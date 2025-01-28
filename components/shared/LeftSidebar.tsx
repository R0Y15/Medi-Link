"use client";

import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation';
// import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs';

const LeftSidebar = () => {
  const pathname = usePathname();
  // const { userId } = useAuth();

  return (
    <section className='custom-scrollbar leftsidebar pr-5'>
      <div className='flex flex-1 flex-col bg-card rounded-2xl py-5 shadow-sm'>
        <div className="flex w-full flex-1 flex-col gap-4 px-6 rounded-2xl">
          <h1 className='font-semibold hidden lg:block lg:text-[20px] my-3 px-4 text-foreground'>Menu</h1>
          {sidebarLinks.map((link, index) => {
            const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

            // if (link.route === '/profile') link.route = `${link.route}/${userId}`

            return (
              <Link 
                href={link.route} 
                key={index} 
                className={`leftsidebar_link ${
                  isActive 
                    ? 'bg-muted text-primary' 
                    : 'text-foreground/90 hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Image
                  src={`/assets/${isActive ? link.activeIcon : link.icon}`}
                  alt={link.label}
                  width={24}
                  height={24}
                  className="brightness-0 dark:brightness-200 dark:invert"
                />
                <span className='max-lg:hidden'>{link.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 px-6">
          {/* <SignedIn> */}
          {/* <SignOutButton redirectUrl='/sign-in'> */}
          <div className="flex cursor-pointer gap-4 p-4 rounded-lg hover:bg-muted/50">
            <Image
              src={'/assets/logout.svg'}
              alt='logout'
              width={24}
              height={24}
              className="brightness-0 dark:brightness-200 dark:invert"
            />
            <p className="max-lg:hidden text-[#FF3333] dark:text-[#FF6666] hover:opacity-80">Logout</p>
          </div>
          {/* </SignOutButton> */}
          {/* </SignedIn> */}
        </div>
      </div>
    </section>
  )
}

export default LeftSidebar