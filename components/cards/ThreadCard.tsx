"use client"
import { extractMentionedUsernames, formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteThread from "../forms/DeleteThread";
import LikeThread from "../forms/LikeThread";
import ThreadText from "../forms/ThreadText";
import { useState } from "react";

interface Props{
    thread : {
        _id : string;
        parentId: string;
        text: string;
        author: {
            name:string;
            image: string;
            id: string;
        },
        community: {
            id:string;
            name:string;
            image:string;
        } | null;
        createdAt: string;
        children: {
            author: {
              image: string;
            };
        }[];
        likes:string[];
    }
    isComment? : boolean | false;
    currentUserId: string; 
    userId: string;
}
const ThreadCard =({
    thread,
    isComment,
    currentUserId,
    userId
}: Props)=>{

    const author = thread.author,
          comments = thread.children,
          community = thread.community;
    
          // console.log(thread)

    const handleLikeChange = (liked: boolean) => {
      setLiked(liked);
      setLikes(likes + (liked ? 1 : -1))
    };
    const [likes, setLikes] = useState(thread.likes.length);
    const [liked, setLiked] = useState(thread.likes.includes(JSON.parse(userId)))



    return(
        
        <article className={`flex w-full flex-col rounded-xl ${
          isComment ? 'px-0 xs:p-0' : 'bg-dark-2 p-7'
        }`}>
            <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
              <Image
                src={author.image}
                alt='user_community_image'
                fill
                className='cursor-pointer rounded-full'
              />
            </Link>

            <div className='thread-card_bar' />
          </div>
          <div className='flex w-full flex-col'>
            <Link href={`/profile/${author.id}`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold text-light-1'>
                {author.name}
              </h4>
            </Link>
            <p className='mt-2 text-small-regular text-light-2'>{<ThreadText text={thread.text}></ThreadText>}</p>

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className='flex gap-3.5'>
                
                
                <LikeThread
                  threadId={thread._id}
                  userId={userId}
                  liked={liked}
                  setLiked={(handleLikeChange)}
                />

                <Link href={`/thread/${thread._id}`}>
                  <Image
                    src='/assets/reply.svg'
                    alt='heart'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                  />
                </Link>
                <Image
                  src='/assets/repost.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Image
                  src='/assets/share.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
              </div>
              <p className='mt-1 text-subtle-medium text-gray-1'>
                {!isComment && comments?.length > 0 && (
                  <Link href={`/thread/${thread._id}`}>
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </Link>
                )}
                {likes ? (<span> &middot; {likes} like{likes > 1 && 's'}</span>) : null}
                {/* <h1 onClick={()=>handleLikeChange(true)}>ASDF</h1> */}
              </p>
            </div>

            </div>
          </div>
          <DeleteThread
            threadId={JSON.stringify(thread._id)}
            currentUserId={currentUserId}
            authorId={author.id}
            parentId={thread.parentId}
            isComment={isComment}
          />
          
          </div>
          {/* TODO: Delete thread, show comment logos */}
          {!isComment && community && (
            <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
              <p className="text-subtle-medium text-gray-1">
                {formatDateString(thread.createdAt)}
                - {community.name} Community
              </p>
              <Image src={community.image} alt={community.name} width={14} height={14} className="ml-1 rounded-full object-cover"/>
            </Link>
          )}
        </article>
    )
}

export default ThreadCard