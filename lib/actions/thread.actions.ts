"use server"
import { revalidatePath } from 'next/cache';

import { connectToDB } from "../validations/mongoose"

import Thread from '../models/thread.model'
import User from '../models/user.model';
import Community from "../models/community.model";

import{extractMentionedUsernames} from "@/lib/utils"
interface Params {
    text : string,
    author: string,
    communityId: string,
    path: string
}

export async function createThread({ text, author, communityId, path }: Params
    ) {
      try {
        connectToDB();
    
        const communityIdObject = await Community.findOne(
          { id: communityId },
          { _id: 1 }
        );
    
        const createdThread = await Thread.create({
          text,
          author,
          community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
        });
    
        // Update User model
        await User.findByIdAndUpdate(author, {
          $push: { threads: createdThread._id },
        });

        const mentionedUsernames = extractMentionedUsernames(text);
        for (const username of mentionedUsernames) {
          const user = await User.findOneAndUpdate(
            { username : username.substring(1)}, // Remove "@" from username
            { $push: { mentions: createdThread._id }}
          )
          if(user){
            const profileLink = `/profile/${user.id}`;
            text = text.replace(username, `[${username}](${profileLink})`)
          }
        }
        if(mentionedUsernames){
          await Thread.findByIdAndUpdate(createdThread._id,{
            text
          })
        }
        

        if (communityIdObject) {
          // Update Community model
          await Community.findByIdAndUpdate(communityIdObject, {
            $push: { threads: createdThread._id },
          });
        }
    
        revalidatePath(path);
      } catch (error: any) {
        throw new Error(`Failed to create thread: ${error.message}`);
      }
}
async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

async function getUserDataForMentions(mentionedUsernames: string[]) {
  const userData = [];
  for (const username of mentionedUsernames) {
      const user = await User.findOne({ username: username.substring(1) }); // Remove "@" from username
      if (user) {
          userData.push(user);
      }
  }
  return userData;
}

export async function fetchThreads(pageNumber = 1, pageSize = 20){
    try{
        connectToDB()

        //Calculate number of posts to skip
        const skipAmount = (pageNumber - 1) * pageSize;

        //show top-level threads / no parents
        const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
            .sort({createdAt : 'desc'})
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
              path: 'author',
              model : User})
            .populate({
              path: "community",
              model: Community,
            })
            .populate({
                path: "children", // Populate the children field
                populate: {
                  path: "author", // Populate the author field within children
                  model: User,
                  select: "_id name parentId image", // Select only _id and username fields of the author
                },
            })
            

        const totalPostsCount = await Thread.countDocuments({parentId: {$in: [null, undefined]}})

        const threads = await threadsQuery.exec();

        const isNext = totalPostsCount > skipAmount + threads.length;

        return{ threads, isNext}

    }catch(error: any){
        throw new Error(`failed to create update user ${error.message}`)
    }
}

export async function fetchThreadbyId(id: string){
    connectToDB()
    try{
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: 'children',
                populate:[{
                    path: 'author',
                    model: User,
                    select: "_id id name parentId image"
                },
                {
                    path:'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    }
                }]
            }).exec();
            return thread

    }catch(error:any){
        throw new Error(`failed to create update user ${error.message}`)
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
  ) {
    
  
    try {
        connectToDB();
      // Find the original thread by its ID
      const originalThread = await Thread.findById(threadId);
  
      if (!originalThread) {
        throw new Error("Thread not found");
      }
  
      // Create the new comment thread
      const commentThread = new Thread({
        text: commentText,
        author: userId,
        parentId: threadId, // Set the parentId to the original thread's ID
      });

  
      // Save the comment thread to the database
      const savedCommentThread = await commentThread.save();

      // Add the comment thread's ID to the original thread's children array
      originalThread.children.push(savedCommentThread._id);
      
  
      // Save the updated original thread to the database
      await originalThread.save();
  
      revalidatePath(path);
    } catch (err:any) {
      console.error("Error while adding comment:", err);
      throw new Error(`failed to add comment ${err.message}`)
    }
}

export async function likeThread(
  threadId: string,
  userId: string,
  option: boolean
): Promise<any> {
  

  try {
    connectToDB();
    const liked = await Thread.findByIdAndUpdate(threadId, 
      option ? {
        $push: { likes: userId },
      }:{
        $pull: { likes: userId },
      }
    );
  } catch (err:any) {
    console.error("Error while liking thread:", err);
    throw new Error(`failed to like thread ${err.message}`)
  }
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds }, mentions: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}


export async function fetchThreadbyAuthor(userId: string) {
  connectToDB()
  try{
    const threads = await Thread.find({author: userId, parentId: { $in: [null, undefined] }})
    .populate({
      path: "author",
      model: User,
      select: "name image _id",
    })
    .exec()
    return threads
  }catch(error:any){
    throw new Error(`failed to create update user ${error.message}`)
  }
}