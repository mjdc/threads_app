import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ThreadCard from "@/components/cards/ThreadCard"

export default async function Home() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchThreads(1, 30);
  if(!result) return
  return (
    <main>
      <h1 className='head-text text-left'>Home</h1>

      <section className='mt-9 flex flex-col gap-10'>

        {result.threads.length ? (
          <>
          {
            result.threads.map((thread: any)=>(
              <ThreadCard
                key={thread.id}
                thread={thread}
                currentUserId={user.id}
                />
          ))} 
          </>
          ):(
            <p>No threads found</p>
          )
        }
      </section>
    </main>
  );
}
