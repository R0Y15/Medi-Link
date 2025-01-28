"use client";

import { PatientCardProps } from '@/constants';
import Image from 'next/image'
import React from 'react'

const PatientCard = ({ cardTitle, cardDetail, logo, color, onViewDetails }: PatientCardProps & { onViewDetails?: () => void }) => {
  const getCardStyle = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-card border-2 border-blue-200 dark:border-blue-800';
      case 'aqua':
        return 'bg-card border-2 border-teal-200 dark:border-teal-800';
      case 'peach':
        return 'bg-card border-2 border-red-200 dark:border-red-800';
      case 'gray':
        return 'bg-card border-2 border-gray-200 dark:border-gray-800';
      default:
        return 'bg-card border-2 border-blue-200 dark:border-blue-800';
    }
  };

  const getIconBackground = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900/50';
      case 'aqua':
        return 'bg-teal-100 dark:bg-teal-900/50';
      case 'peach':
        return 'bg-red-100 dark:bg-red-900/50';
      case 'gray':
        return 'bg-gray-100 dark:bg-gray-900/50';
      default:
        return 'bg-blue-100 dark:bg-blue-900/50';
    }
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-700 dark:text-blue-300';
      case 'aqua':
        return 'text-teal-700 dark:text-teal-300';
      case 'peach':
        return 'text-red-700 dark:text-red-300';
      case 'gray':
        return 'text-gray-700 dark:text-gray-300';
      default:
        return 'text-blue-700 dark:text-blue-300';
    }
  };

  return (
    <div className={`flex flex-col p-4 min-w-64 w-full rounded-2xl shadow-sm ${getCardStyle(color)}`}>
      <div className="flex flex-row gap-4">
        <div className={`flex p-2 mx-2 w-14 h-14 rounded-full shadow-sm items-center justify-center ${getIconBackground(color)}`}>
          <Image
            src={`/assets/${logo}.svg`}
            width={30}
            height={30}
            alt='users'
            className={`${color === 'gray' ? 'opacity-70' : ''}`}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className={`text-base-semibold ${getTextColor(color)}`}>
            {cardTitle}
          </h3>
          <h1 className={`text-body-semibold ${getTextColor(color)}`}>
            {cardDetail}
          </h1>
        </div>
      </div>

      <div 
        className="flex flex-row mt-6 gap-2 justify-start items-center cursor-pointer group" 
        onClick={onViewDetails}
      >
        <h1 className={`text-base1-semibold ${getTextColor(color)} group-hover:opacity-90 transition-opacity`}>
          View details
        </h1>
        <div className="transform transition-transform group-hover:translate-x-3">
          <Image
            src={'/assets/arrow-r.svg'}
            width={20}
            height={20}
            alt='arrow'
            className={`${getTextColor(color).includes('dark:text') ? 'dark:invert' : ''} opacity-90 group-hover:opacity-100`}
          />
        </div>
      </div>
    </div>
  )
}

export default PatientCard