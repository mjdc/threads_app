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
    return(
        <section className="relative">
            <ThreadCard
                key={thread.id}
                thread={JSON.parse(JSON.stringify(thread))}
                currentUserId={user.id}
                userId={JSON.stringify(userInfo._id)}
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
                    thread={JSON.parse(JSON.stringify(childItem))}
                    currentUserId={user.id}
                    userId={JSON.stringify(userInfo._id)}
                    isComment
                />
                ))}
            </div>
        </section>
    )
}

export default Page