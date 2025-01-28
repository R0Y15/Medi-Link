"use client"

import { Calendar } from "@/components/ui/calendar"
import React from 'react'
import { InfoCard, VaccineCards } from "../cards";
import { vaccines } from "@/constants";
import { Button } from "../ui/button";
import Image from "next/image";

const RightSidebar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // console.log(date);


  return (
    <div className='rightsidebar'>
      <div className='flex flex-1 flex-col bg-card rounded-2xl py-5 shadow-lg p-8 gap-5'>
        <h2 className="my-2 text-heading4-semibold text-foreground">Consultation Date</h2>
        <div className="border-none rounded-lg">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg bg-muted w-full"
            initialFocus
          />
        </div>

        <div className="flex flex-col gap-2">
          <InfoCard img={'/assets/virus.svg'} time="10:00 - 11:30" title="Neuro Poly" desc="Dr. Ashton Cleve" highlight />
          <InfoCard img={'/assets/lungs.svg'} time="12:30 - 13:00" title="Lungs Poly" desc="Dr. Kyle Eloise" />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row justify-between items-center">
            <h2 className="my-2 text-heading4-semibold text-foreground">Past Vaccination</h2>
            <Button className="shadow-none border-none p-0">
              <Image
                src={'/assets/x-dots.svg'}
                width={20}
                height={10}
                alt="more"
              />
            </Button>
          </div>
          <div className="h-12 overflow-auto no-scrollbar">
            {vaccines.map((vaccine, index) => (
              <VaccineCards key={index} title={vaccine.name} date={vaccine.date} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightSidebar


// import { fetchCommunities } from '@/lib/actions/community.actions';
// import { fetchUser, fetchUsers } from '@/lib/actions/user.action';
// import { currentUser } from '@clerk/nextjs/server';
// import Link from 'next/link'
// import { redirect } from 'next/navigation';
// import React from 'react'
// // import { CommunityCard, UserCard } from '../cards';

// const RightSidebar = async () => {
//   // const user = await currentUser(); //fetch current user
//   // if (!user) return null;

//   // const userInfo = await fetchUser(user.id); //fetch user info
//   // if (!userInfo?.onboarded) redirect('/onboarding'); //check for user login status

//   // const communityResult = await fetchCommunities({
//   //   searchString: '',
//   //   pageNumber: 1,
//   //   pageSize: 20,
//   // })

//   // const userResult = await fetchUsers({
//   //   userId: user.id,
//   //   searchString: '',
//   //   pageNumber: 1,
//   //   pageSize: 20,
//   // })
//   return (
//     <section className='custom-scrollbar rightsidebar'>
//       <div className="flex flex-1 flex-col justify-start border">
//         <h3 className='text-heading4-medium text-light-1'>Suggested Communities</h3>

//         {/* for displaying the communitites */}
//         {/* <div className="mt-3 flex flex-col">
//           {communityResult.communities.length === 0 ? (
//             <p className='no-result'>No communities</p>
//           ) : (
//             <>
//               {communityResult.communities.map((community) => (
//                 <div className="mt-3" key={community.id}>
//                   <CommunityCard
//                     key={community.id}
//                     id={community.id}
//                     name={community.name}
//                     username={community.username}
//                     image={community.image}
//                     bio={community.bio}
//                     members={community.members}
//                   />
//                 </div>
//               ))}
//             </>
//           )}
//         </div> */}
//       </div>

//       <div className="flex flex-1 flex-col justify-start">
//         <h3 className='text-heading4-medium text-light-1'>Suggested Users</h3>
//         <div className="mt-3 flex flex-col">
//           {/* {userResult.users.length === 0 ? (
//             <p className='no-result'>No Users</p>
//           ) : (
//             <>
//               {userResult.users.map((person) => (
//                 <div className="mt-3" key={person.id}>
//                   <UserCard
//                     key={person.id}
//                     id={person.id}
//                     name={person.name}
//                     username={person.username}
//                     image={person.image}
//                     personType='User'
//                   />
//                 </div>
//               ))}
//             </>
//           )} */}
//         </div>
//       </div>

//       <Link href={'/contact-page'}>
//         <p className='text-light-1'>Contact Us</p>
//       </Link>

//     </section>
//   )
// }

// export default RightSidebar