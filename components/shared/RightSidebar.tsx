"use client"

import { Calendar } from "@/components/ui/calendar"
import React, { useEffect, useState } from 'react'
import { InfoCard, VaccineCards } from "../cards";
import { API_ENDPOINTS } from "@/constants";
import { Button } from "../ui/button";
import Image from "next/image";

interface Appointment {
  id: string;
  doctorName: string;
  speciality: string;
  startTime: string;
  endTime: string;
  appointmentDate: string;
}

interface Vaccination {
  id: string;
  name: string;
  date: string;
  dose: string;
  location: string;
}

const RightSidebar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments
        const appointmentsRes = await fetch(`${API_ENDPOINTS.baseUrl}${API_ENDPOINTS.appointments}`);
        const appointmentsData = await appointmentsRes.json();
        const today = new Date().toISOString().split('T')[0];
        const todayAppts = appointmentsData.filter((apt: Appointment) => 
          apt.appointmentDate === today
        );
        setTodayAppointments(todayAppts);

        // Fetch vaccinations
        const vaccinationsRes = await fetch(`${API_ENDPOINTS.baseUrl}${API_ENDPOINTS.vaccinations}`);
        const vaccinationsData = await vaccinationsRes.json();
        setVaccinations(vaccinationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
          {todayAppointments.map((appointment) => (
            <InfoCard 
              key={appointment.id}
              img={appointment.speciality.toLowerCase().includes('neuro') ? '/assets/virus.svg' : '/assets/lungs.svg'}
              time={`${appointment.startTime} - ${appointment.endTime}`}
              title={`${appointment.speciality}`}
              desc={`Dr. ${appointment.doctorName}`}
              highlight={appointment.speciality.toLowerCase().includes('neuro')}
              className={appointment.speciality.toLowerCase().includes('neuro') ? 
                "bg-primary/10 text-primary dark:bg-[#193741] dark:text-[#4fd1c5] hover:bg-primary/20 dark:hover:bg-[#193741]/80 transition-colors" : 
                "bg-muted hover:bg-muted/80 transition-colors"}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-heading4-semibold text-foreground">Past Vaccination</h2>
            <Button variant="ghost" size="icon" className="hover:bg-transparent">
              <Image
                src={'/assets/x-dots.svg'}
                width={20}
                height={10}
                alt="more"
                className="brightness-0 dark:brightness-200 dark:invert"
              />
            </Button>
          </div>
          <div className="h-12 overflow-auto no-scrollbar">
            {vaccinations.map((vaccine, index) => (
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