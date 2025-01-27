// import { OrganizationSwitcher, SignOutButton, SignedIn } from '@clerk/nextjs'
// import { dark } from '@clerk/themes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'>
        <Image
          src={'/logo.svg'}
          alt='logo'
          width={28}
          height={28}
        />
        <p className="text-heading3-bold max-xs-hidden">Medi-Link</p>
      </Link>

      <div className="flex items-center gap-1">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-10 w-10"
            }
          }}
        />

        <div className="md:block hidden">
          <div className="relative w-5 h-5">
            <div className="flex cursor-pointer">
              <Image
                src={'/assets/bell.svg'}
                alt='notification'
                width={24}
                height={24}
              />
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rounded-full p-1 bg-red-500 text-white" />
            </div>
          </div>
        </div>

        <div className="block md:hidden">
          {/* <SignedIn>
            <SignOutButton> */}
          <div className="flex cursor-pointer">
            <Image
              src={'/assets/logout.svg'}
              alt='logout'
              width={24}
              height={24}
            />
          </div>
          {/* </SignOutButton>
          </SignedIn> */}
        </div>

        {/* <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4"
            }
          }}
        /> */}

      </div>
    </nav>
  )
}

export default Navbar