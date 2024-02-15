import { fetchUserThreads } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchThreadbyAuthor } from "@/lib/actions/thread.actions";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props{
    currentUserId: string;
    accountId: string;
    accountType: string
    userInfo_id: string,
    myThreads: any
}
const ThreadsTab = async({currentUserId, accountId, accountType, userInfo_id, myThreads} : Props)=>{ 
   
    let result = accountType === 'Community' ?
        await fetchCommunityPosts(accountId) :
        await fetchUserThreads(accountId) 
    // if(!result) redirect("/")
    let threads = await fetchThreadbyAuthor(userInfo_id);
    console.log('threads', myThreads)
    return(
        <section className="mt-9 flex flex-col gap-10">
            {result?.threads.map((thread:any)=>{
                if(accountType === "User"){
                    thread.author.name = result.name;
                    thread.author.image = result.image
                }
                if(accountType === "Community"){
                    thread.community.name = result.name;
                    thread.community.image = result.image
                }
                return (
                    <div>
                        <ThreadCard 
                            thread={thread} 
                            currentUserId={currentUserId} 
                            key={thread.id} 
                            authorId={accountType === "User"? result.id : null}
                            communityId={accountType === "Community"? result.id : null}
                            />
                    </div>
                
                )
            })}

        </section>
    )
}

export default ThreadsTab