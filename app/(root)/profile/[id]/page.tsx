import AccountProfile from "@/components/forms/AccountProfile"
import ProfileHeader from "@/components/shared/ProfileHeader";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { redirect } from "next/navigation";
import { fetchThreadbyAuthor } from "@/lib/actions/thread.actions";
import ThreadsTab from "@/components/shared/ThreadsTab";
import ThreadCard from "@/components/cards/ThreadCard";

async function Page({params} : {params : {id: string}}) {

    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser(params.id || user?.id)
    if(!userInfo?.onboarded) redirect("/onboarding")

    const myThreads = await fetchThreadbyAuthor(userInfo._id)

    return(
        <section>
            <ProfileHeader
                authUserId={user.id}
                info={userInfo}
            />

            <div className="mt-9">
                <h1>asfdasd{params.id}</h1>
                <Tabs defaultValue='threads' className='w-full'>
                    <TabsList className="tab">
                        {profileTabs.map((tab)=>(
                                <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                                <Image
                                src={tab.icon}
                                alt={tab.label}
                                width={24}
                                height={24}
                                className='object-contain'
                                />
                                <p className='max-sm:hidden'>{tab.label}</p>
                                {tab.label==='Threads' && (
                                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                        {userInfo.threads.length} 
                                        <span>mine {myThreads?.length}</span>
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>


                    {profileTabs.map((tab)=>(
                        <TabsContent key={`content-${tab.label}`} value={tab.value}
                            className="w-full text-light-1">
                                <ThreadsTab
                                    currentUserId={user.id}
                                    accountId={userInfo.id}
                                    accountType='User'
                                    myThreads={myThreads}
                                    userInfo_id={userInfo._id}
                                />
                                
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
}

export default Page