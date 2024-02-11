import ThreadCard from "@/components/cards/ThreadCard"
import Comment from "@/components/forms/Comment";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchThreadbyId } from "@/lib/actions/thread.actions";

const Page = async({params}: {params: {id: string}}) =>{
    if(!params.id) return null
    const user = await currentUser();
    const userInfo = user ? await fetchUser(user.id) : null;
    if(!userInfo?.onboarded) redirect("/onboarding")

    const thread = await fetchThreadbyId(params.id)

    return(
        <section className="relative">
            <ThreadCard
                key={thread.id}
                thread={thread}
                currentUserId={user.id}
                />
            <div className="mt-7">
            <Comment
                threadId={params.id}
                currentUser={userInfo}
                currentUserImg={user.imageUrl}
                currentUserId={JSON.stringify(userInfo._id)}
            />
            </div>

            <div className='mt-10'>
   
                {thread.children.map((childItem: any) => (
                <ThreadCard
                    key={childItem._id}
                    thread={childItem}
                    currentUserId={user.id}
                    // id={childItem._id}
                    // currentUserId={user.id}
                    // parentId={childItem.parentId}
                    // content={childItem.text}
                    // author={childItem.author}
                    // community={childItem.community}
                    // createdAt={childItem.createdAt}
                    // comments={childItem.children}
                    isComment
                />
                ))}
            </div>
        </section>
    )
}

export default Page