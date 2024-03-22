

import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import DeleteThread from "../forms/DeleteThread";

interface Props {
  threadId: string;
  currentUserId: string;
}

function ThreadCard({
  threadId,
  currentUserId
}: Props) {
  return (
    <Image
                    src='/assets/heart-gray.svg'
                    alt='heart'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                    onClick={()=>{
                      console.log('like here')
                    }}
                  />
  );
}

export default ThreadCard;
