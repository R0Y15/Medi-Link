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
      "flex flex-row gap-2 px-3 py-2 min-w-[45%] rounded-lg",
      highlight ? 'bg-[#193741] text-[#4fd1c5]' : 'bg-muted text-foreground',
      className
    )}>
      <div className="flex items-center justify-center w-5">
        {typeof img === 'string' ? (
          <div className="flex justify-center items-center">
            <Image
              src={img}
              width={20}
              height={20}
              alt="img"
              className="brightness-0 dark:brightness-200 dark:invert"
            />
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-xs font-semibold">{img}.</span>
          </div>
        )}
      </div>

      <div className="flex flex-col min-w-0">
        <h1 className='text-sm font-medium truncate'>{title}</h1>
        <h2 className={cn(
          "text-xs",
          highlight ? 'text-[#4fd1c5]/80' : 'text-muted-foreground'
        )}>{time}</h2>

        {desc ? (
          <p className='text-xs font-medium mt-1 dark:text-[#4fd1c5]/90'>{desc}</p>
        ) : null}
      </div>
    </div>
  )
}

export default InfoCard