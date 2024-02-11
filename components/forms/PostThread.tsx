"use client"
import { usePathname, useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea";


import { createThread } from "@/lib/actions/thread.actions";
import { threadValidation } from "@/lib/validations/thread";

interface Props {
    userId: string
}



function PostThread({userId}:Props){
    
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(threadValidation),
        defaultValues: {
            thread: '',
            userId,
        }
    })

    const onSubmit = async(values: z.infer<typeof threadValidation>) => {
        await createThread({
            text: values.thread,
            author: userId,
            communityId: null,
            path: pathname
        })
        router.push("/")
    }


    return (
        <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <FormField
            control={form.control}
            name='thread'
            render={({ field }) => (
                <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                    Content
                </FormLabel>
                <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                    <Textarea
                    rows={15}
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" className="bg-primary-500">Submit</Button>
         </form>
        </Form>
    )
}

export default PostThread