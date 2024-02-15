import Image from "next/image";

interface Props {
    authUserId : string;
    info: {
        id:string;
        name:string;
        username:string;
        image:string;
        bio:string
    }
    type? : 'User' | 'Community'
}
const ProfileHeader = ({
    authUserId,
    info,
    type
}:Props) =>{
    return(
    <div className="flex w-full flex-col justify-start">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="relative h-20 w-20 object-cover">
                    <Image 
                    src={info.image}
                    alt="Profile Image"
                    fill
                    className="rounded-full object-cover shadow-2xl"
                    />
                </div>
                <div className="flex-1">
                    <h2 className='text-left text-heading3-bold text-light-1'>
                        {info.name}
                    </h2>
                    <p className='text-base-medium text-gray-1'>@{info.username}</p>     
                </div>
            </div>
            
        </div>
        
        {/* TODO: community */}
        <p className='mt-6 max-w-lg text-base-regular text-light-2'>{info.bio}</p>

        <div className='mt-12 h-0.5 w-full bg-dark-3' />
    </div>
    )
}

export default ProfileHeader
