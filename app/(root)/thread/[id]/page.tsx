import ThreadCard from "@/components/cards/ThreadCard"
import Comment from "@/components/forms/Comment";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchThreadbyId } from "@/lib/actions/thread.actions";

const Page = async({params}: {params: {id: string}}) =>{
    if(!params.id) return null
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect("/onboarding")

    if (!params.id) return null;

    const thread = await fetchThreadbyId(params.id)
    console.log('userInfo', userInfo)
    console.log('img', user.imageUrl)
    return(
        <section className="relative">
            <ThreadCard
                key={thread.id}
                thread={thread}
                currentUserId={user.id}
                />
            <div className="mt-7">
            {/* <Comment
                threadId={params.id}
                currentUser={userInfo}
                currentUserImg={user.imageUrl}
                currentUserId={userInfo._id}
            /> */}
            <Comment
            threadId={params.id}
            currentUserImg={userInfo.image}
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