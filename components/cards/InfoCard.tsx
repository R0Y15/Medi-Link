import { InfoCardprops } from '@/constants'
import Image from 'next/image'
import React from 'react'

const InfoCard = ({ img, title, time, desc, highlight }: InfoCardprops) => {
    return (
        <div className={`flex flex-row gap-4 px-4 py-3 min-w-[9.75rem] rounded-2xl ${highlight ? 'bg-blue text-white' : 'bg-slate-100'} ${typeof img === 'string' ? 'py-4' : ''}`}>
            <div className="flex">
                {typeof img === 'string' ? (
                    <div className="flex justify-start items-start">
                        <Image
                            src={img}
                            width={25}
                            height={25}
                            alt="img"
                            className="flex"
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
                <h2 className={`${highlight ? 'text-slate-200' : 'text-slate-500'} text-small-regular`}>{time}</h2>

                {desc ? (
                    <p className='text-small-semibold mt-2'>{desc}</p>
                ) : null}
            </div>
        </div>
    )
}

export default InfoCard