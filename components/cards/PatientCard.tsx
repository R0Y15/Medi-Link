"use client";

import { PatientCardProps } from '@/constants';
import Image from 'next/image'
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// Define detailed info interface
interface CardDetailData {
  title: string;
  value: string;
  icon?: string;
}

// Add a detailedInfo property to props
const PatientCard = ({ 
  cardTitle, 
  cardDetail, 
  logo, 
  color, 
  onViewDetails,
  detailedInfo = [] // Default empty array if not provided
}: PatientCardProps & { 
  onViewDetails?: () => void,
  detailedInfo?: CardDetailData[]
}) => {
  // Default detailed info if none provided
  const defaultDetailedInfo: CardDetailData[] = [
    { title: "Total", value: cardDetail, icon: logo },
    { title: "Active", value: "75%", icon: "pharmacy" },
    { title: "Inactive", value: "25%", icon: "alert" },
    { title: "Growth", value: "+12%", icon: "activity" },
  ];

  // Use provided detailed info or fallback to default
  const details = detailedInfo.length > 0 ? detailedInfo : defaultDetailedInfo;

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
      case 'yellow':
        return 'bg-card border-2 border-yellow-200 dark:border-yellow-800';
      case 'purple':
        return 'bg-card border-2 border-purple-200 dark:border-purple-800';
      case 'green':
        return 'bg-card border-2 border-green-200 dark:border-green-800';
      case 'pink':
        return 'bg-card border-2 border-pink-200 dark:border-pink-800';
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
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/50';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-900/50';
      case 'green':
        return 'bg-green-100 dark:bg-green-900/50';
      case 'pink':
        return 'bg-pink-100 dark:bg-pink-900/50';
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
      case 'yellow':
        return 'text-yellow-700 dark:text-yellow-300';
      case 'purple':
        return 'text-purple-700 dark:text-purple-300';
      case 'green':
        return 'text-green-700 dark:text-green-300';
      case 'pink':
        return 'text-pink-700 dark:text-pink-300';
      default:
        return 'text-blue-700 dark:text-blue-300';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={`flex flex-col p-3 sm:p-4 w-full h-full rounded-2xl shadow-sm ${getCardStyle(color)} cursor-pointer hover:shadow-md transition-shadow`}>
          <div className="flex flex-row gap-2 items-center">
            <div className={`flex p-2 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-sm items-center justify-center ${getIconBackground(color)}`}>
              <Image
                src={`/assets/${logo}.svg`}
                width={28}
                height={28}
                alt='users'
                className={`${color === 'gray' ? 'opacity-70' : ''}`}
              />
            </div>
            <div className="flex flex-col gap-1 sm:gap-2">
              <h3 className={`text-xs sm:text-sm lg:text-base-semibold ${getTextColor(color)}`}>
                {cardTitle}
              </h3>
              <h1 className={`text-lg sm:text-xl ${getTextColor(color)}`}>
                {cardDetail}
              </h1>
            </div>
          </div>

          <div 
            className="flex flex-row mt-2 pt-3 sm:mt-auto sm:pt-5 gap-2 justify-start items-center cursor-pointer group"
          >
            <h1 className={`text-xs sm:text-sm ${getTextColor(color)} group-hover:opacity-90 transition-opacity`}>
              View details
            </h1>
            <div className="transform transition-transform group-hover:translate-x-3">
              <Image
                src={'/assets/arrow-r.svg'}
                width={16}
                height={16}
                alt='arrow'
                className={`${getTextColor(color).includes('dark:text') ? 'dark:invert' : ''} opacity-90 group-hover:opacity-100`}
              />
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden">
        <div className={`p-4 ${getCardStyle(color)}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">{cardTitle} Details</h3>
            <div className={`flex h-8 w-8 rounded-full ${getIconBackground(color)} items-center justify-center`}>
              <Image
                src={`/assets/${logo}.svg`}
                width={16}
                height={16}
                alt={cardTitle}
                className={`${color === 'gray' ? 'opacity-70' : ''}`}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {details.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                {item.icon && (
                  <div className={`flex h-7 w-7 rounded-full ${getIconBackground(color)} items-center justify-center`}>
                    <Image
                      src={`/assets/${item.icon}.svg`}
                      width={14}
                      height={14}
                      alt={item.title}
                      className={`${color === 'gray' ? 'opacity-70' : ''}`}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className={`text-base font-medium ${getTextColor(color)}`}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-5 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onViewDetails}
            >
              View Full Details
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PatientCard