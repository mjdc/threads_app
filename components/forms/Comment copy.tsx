"use client"
import { usePathname, useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";


import { commentValidation } from "@/lib/validations/thread";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";


interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
  }
  
function Comment({ threadId, currentUserImg, currentUserId }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm<z.infer<typeof commentValidation>>({
        resolver: zodResolver(commentValidation),
        defaultValues: {
          thread: "",
        },
      });

    const onSubmit = async(values: z.infer<typeof commentValidation>) => {
        console.log('adding therad')
        // await addCommentToThread(
        //     threadId,
        //     values.thread,
        //     JSON.parse(currentUser.id),
        //     pathname
        // )
        form.reset();
    }
    return(
        <Form {...form}>
            <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                control={form.control}
                name='thread'
                render={({ field }) => (
                    <FormItem className='flex w-full items-center gap-3'>
                        <FormLabel>
                            <Image 
                                src={currentUserImg} 
                                alt="Profile Image"
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                            />
                        </FormLabel>
                        <FormControl className='border-none bg-transparent'>
                            <Input 
                                type="text" 
                                placeholder="Comment..." 
                                className='no-focus text-light-1 outline-none'
                            />
                        </FormControl>

                    </FormItem>
                )}
                />
                <Button type='submit' className='comment-form_btn'>
                    Reply
                </Button>
            </form>
        </Form>
    )
    
}

export default Comment