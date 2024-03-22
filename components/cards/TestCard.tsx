"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

interface Props{
  thread : {
      id : string;
      parentId: string;
      text: string;
      author: {
          name:string;
          image: string;
          id: string;
          user: string;
      },
      community: {
          id:string;
          name:string;
          image:string;
      } | null;
      createdAt: string;
      comments: {
          author :{
              image:string
          };
      }[];
  }
  authorId? : string;
  communityId? :string;
  isComment : boolean | false;
  currentUserId: string;
}

function TestCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  // community,
  createdAt,
  // comments,
  isComment,
}: Props) {
  const router = useRouter();
  return (
    <article className='user-card'>
      

      <Button
        className='user-card_btn'
        onClick={() => {
          console.log("test")
        }}
      >
        View
      </Button>
    </article>
  );
}

export default TestCard;
