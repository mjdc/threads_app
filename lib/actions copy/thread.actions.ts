"use server"
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model'
import { connectToDB } from "../validations/mongoose"
import User from '../models/user.model';

interface Params {
    text : string,
    author: string,
    communityId: string,
    path: string
}

export async function createThread({
    text,
    author,
    communityId,
    path
    }: Params): Promise<void>{
    

    try{
        connectToDB();
        const createdThread = await Thread.create(
            {
                text,
                author,
                community: communityId
            },
        );

        //Update user model
        await User.findByIdAndUpdate(author,{
            $push: { threads: createdThread._id}
        })
    
        revalidatePath(path);
    }catch(error:any){
        throw new Error(`failed to create update user ${error.message}`)
    }

    
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
            .populate({path: 'author', model : User})
            .populate({
                path: "children", // Populate the children field
                populate: {
                  path: "author", // Populate the author field within children
                  model: User,
                  select: "_id name parentId image", // Select only _id and username fields of the author
                },
            });

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
                select: "_id name image"
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


export async function fetchThreadbyAuthor(userId: string) {
    connectToDB()
    try{
      const threads = await Thread.find({author: userId, parentId: { $in: [null, undefined] }})
      .populate({path: 'author', model : User})
      .populate({
          path: "children", // Populate the children field
          populate: {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id name parentId image", // Select only _id and username fields of the author
          },
      }).exec()
      return threads
    }catch(error){

    }
}