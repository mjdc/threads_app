"use client"

import {sidebarLinks} from '@/constants'
import Image from "next/image"
import Link from 'next/link'
import { SignOutButton, SignedIn } from "@clerk/nextjs"
import { usePathname, useRouter } from 'next/navigation'

function Bottombar(){
    const router = useRouter();
    const pathName = usePathname();
    const isActive = (route:string) => {
        return (pathName.includes(route) && route.length > 1) || pathName === route
    }
    return(
        <section className="bottombar">
            <div className="bottombar_container">
                {sidebarLinks.map((link)=>
                    (
                    <Link 
                        href={link.route}
                        key={link.label}
                        className={`bottombar_link ${isActive(link.route) && "bg-primary-500 "}`}>
                        <Image src={link.imgURL} alt={link.label} width={24} height={24}/>
                        <p className='text-subtle-medium text-light-1 max-sm:hidden'>
                            {link.label.split(/\s+/)[0]}
                        </p>
                     </Link>
                    )  
                )}
            </div>
        </section>
    )
}

export default Bottombar