"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon?: string | React.ReactNode;
  iconColor?: string;
  className?: string;
  link?: string;
}

export function StatCard({ title, value, icon, iconColor = 'blue', className, link }: StatCardProps) {
  const bgColorMap = {
    'blue': 'bg-blue-100 dark:bg-blue-900/30',
    'red': 'bg-red-100 dark:bg-red-900/30',
    'green': 'bg-emerald-100 dark:bg-emerald-900/30',
    'purple': 'bg-purple-100 dark:bg-purple-900/30',
    'amber': 'bg-amber-100 dark:bg-amber-900/30',
    'teal': 'bg-teal-100 dark:bg-teal-900/30',
    'gray': 'bg-gray-100 dark:bg-gray-900/30',
  };

  const textColorMap = {
    'blue': 'text-blue-600 dark:text-blue-300',
    'red': 'text-red-600 dark:text-red-300',
    'green': 'text-emerald-600 dark:text-emerald-300',
    'purple': 'text-purple-600 dark:text-purple-300',
    'amber': 'text-amber-600 dark:text-amber-300',
    'teal': 'text-teal-600 dark:text-teal-300',
    'gray': 'text-gray-600 dark:text-gray-300',
  };

  const bgColor = bgColorMap[iconColor as keyof typeof bgColorMap] || bgColorMap.blue;
  const textColor = textColorMap[iconColor as keyof typeof textColorMap] || textColorMap.blue;

  return (
    <div className={cn(
      "flex-1 bg-card border shadow-sm rounded-xl p-4 transition-all hover:shadow-md",
      className
    )}>
      <div className="flex items-center space-x-4">
        <div className={cn("p-3 rounded-full", bgColor)}>
          {typeof icon === 'string' ? (
            <Image
              src={icon}
              width={20}
              height={20}
              alt={title}
              className={textColor}
            />
          ) : icon ? (
            <div className={textColor}>
              {icon}
            </div>
          ) : (
            <div className={cn("h-5 w-5", textColor)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-xl font-bold">{value}</h3>
          {link && (
            <a href={link} className={cn("text-xs font-medium mt-1 block", textColor)}>
              View details →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatCard; 