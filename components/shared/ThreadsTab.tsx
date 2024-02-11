import { fetchUserThreads } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchThreadbyAuthor } from "@/lib/actions/thread.actions";

interface Props{
    currentUserId: string;
    accountId: string;
    accountType: string
    userInfo_id: string
}
const ThreadsTab = async({currentUserId, accountId, accountType, userInfo_id} : Props)=>{ 
   
    let result = await fetchUserThreads(accountId);
    // if(!result) redirect("/")
    let threads = await fetchThreadbyAuthor(userInfo_id);
    return(
        <section className="mt-9 flex flex-col gap-10">
            {result?.threads.map((thread:any)=>{
                if(accountType === "User"){
                    thread.author.name = result.name;
                    thread.author.image = result.image
                }
                
                return (
                    <div>
<ThreadCard thread={thread} currentUserId={currentUserId} key={thread.id} authorId={accountType === "User"? result.id : null}/>
                    </div>
                
                )
            })}
            <hr></hr>
            <h1>userInfo_id {userInfo_id}</h1>
            {
                threads?.map((thread)=>{
                    <ThreadCard
                    thread={thread}
                    currentUserId={currentUserId}
                    key={thread._id}
                    />
                })
            }
        </section>
    )
}

export default ThreadsTab