import { fetchUserThreads, getReplies, fetchUserMentions } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchThreadbyAuthor } from "@/lib/actions/thread.actions";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props{
    currentUserId: string;
    accountId: string;
    accountType: string
    userInfo_id: string,
    tab: string
}
const ThreadsTab = async({currentUserId, accountId, accountType, userInfo_id, tab} : Props)=>{ 
   
    let result = accountType === 'Community' ?
        await fetchCommunityPosts(accountId) :
        await fetchUserThreads(accountId) 
        // {threads: await fetchThreadbyAuthor(userInfo_id)}
    // if(!result) redirect("/")
    console.log(tab)
    if (tab === 'replies'){
        result = await getReplies(userInfo_id);
    }
    if (tab === 'tagged'){
        result = await fetchUserMentions(accountId);
        console.log(result)
    }

    return(
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((threadRaw:any)=>{
                const thread = JSON.parse(JSON.stringify(threadRaw));

                if(accountType === "User" && tab !== 'tagged'){
                    thread.author = {
                        id:result.id,
                        name:result.name,
                        image:result.image,
                    }
                }
                if(accountType === "Community"){
                    thread.community={
                        id:result.id,
                        name:result.name,
                        image:result.image,
                    }
                }
                return (
                    <div>
                        <ThreadCard
                            key={thread._id}
                            thread={thread}
                            currentUserId={currentUserId}
                            userId={JSON.stringify(userInfo_id)}
                        />
                    </div>
                
                )
            })}

        </section>
    )
}

export default ThreadsTab