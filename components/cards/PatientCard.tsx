"use client";

import { PatientCardProps } from '@/constants';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'

const PatientCard = ({ cardTitle, cardDetail, logo, color }: PatientCardProps) => {
  const router = useRouter();

  return (
    <>
      <div className={`flex flex-col p-4 min-w-64 w-full rounded-2xl shadow-lg
        ${color === 'blue' ? 'bg-blue' : ''}
        ${color === 'aqua' ? 'bg-aqua' : ''}
        ${color === 'peach' ? 'bg-peach' : ''}`}>
        <div className="flex flex-row gap-4">
          <div className="flex p-2 mx-2 w-14 h-14 rounded-full bg-white shadow-md items-center justify-center">
            <Image
              src={`/assets/${logo}.svg`}
              width={30}
              height={30}
              alt='users'
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className='text-base-semibold text-slate-200'>
              {cardTitle}
            </h3>
            <h1 className='text-body-semibold text-white'>
              {cardDetail}
            </h1>
          </div>
        </div>

        <div className="flex flex-row mt-6 gap-2 justify-start items-center cursor-pointer group" onClick={() => router.push('/')}>
          <h1 className='text-base1-semibold text-white'>View details</h1>
          <div className="transform transition-transform group-hover:translate-x-3">
            <Image
              src={'/assets/arrow-r.svg'}
              width={20}
              height={20}
              alt='arrow'
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default PatientCard