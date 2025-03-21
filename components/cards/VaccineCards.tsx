"use client";

import { VaccineProps } from '@/constants';
import Image from 'next/image';
import React from 'react'
import { Button } from '../ui/button';

const VaccineCards = ({ title, date }: VaccineProps) => {
  return (
    <>
      <div className="flex py-2 w-full">
        <div className='flex flex-row justify-between items-center w-full'>
          <div className="flex gap-4 justify-center items-center">
            <div className="flex w-10 h-10 justify-center items-center rounded-full bg-muted">
              <Image
                src={'/assets/syringe.svg'}
                width={25}
                height={25}
                alt='syringe'
              />
            </div>

            <div className="flex flex-col">
              <h2 className='text-base-semibold text-foreground'>{title}</h2>
              <p className='text-muted-foreground text-small-regular'>{date}</p>
            </div>
          </div>

          <div className="flex ml-2">
            <Button className="shadow-none border-none p-0">
              <Image
                src={'/assets/dots.svg'}
                width={20}
                height={20}
                alt="more"
                style={{ height: "auto" }}
              />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default VaccineCards