import Image from 'next/image'
import React from 'react'
import { cn } from '@/lib/utils'

interface InfoCardProps {
  img?: string | React.ReactNode;
  title: string;
  time: string;
  desc?: string;
  highlight?: boolean;
  className?: string;
}

export function InfoCard({ img, title, time, desc, highlight, className }: InfoCardProps) {
  return (
    <div className={cn(
      "flex flex-row gap-4 px-4 py-3 min-w-[9.75rem] rounded-2xl",
      highlight ? 'bg-primary/10 text-primary dark:bg-[#193741] dark:text-[#4fd1c5]' : 'bg-muted text-foreground',
      typeof img === 'string' ? 'py-4' : '',
      className
    )}>
      <div className="flex">
        {typeof img === 'string' ? (
          <div className="flex justify-start items-start">
            <Image
              src={img}
              width={25}
              height={25}
              alt="img"
              className="brightness-0 dark:brightness-200 dark:invert"
            />
          </div>
        ) : (
          <div className="flex">
            <p className="text-base-bold">{img}.</p>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <h1 className='text-base-bold'>{title}</h1>
        <h2 className={cn(
          "text-small-regular",
          highlight ? 'text-primary/80 dark:text-[#4fd1c5]/80' : 'text-muted-foreground'
        )}>{time}</h2>

        {desc ? (
          <p className='text-small-semibold mt-2 dark:text-[#4fd1c5]/90'>{desc}</p>
        ) : null}
      </div>
    </div>
  )
}

export default InfoCard