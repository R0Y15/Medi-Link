"use client";

import { LeftSidebar, RightSidebar } from '@/components/shared';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const hideRightSidebar = pathname === '/appointments' || isSmallScreen;
    const isPharmacyPage = pathname.includes('/pharmacy');
    const isReportPage = pathname.includes('/report');

    // Add responsive handling
    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 1280); // xl breakpoint
        };
        
        // Initial check
        checkScreenSize();
        
        // Listen for window resize
        window.addEventListener('resize', checkScreenSize);
        
        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <main className="flex flex-row bg-[hsl(var(--background-darker))] h-screen">
            <LeftSidebar />
            <section className={`main-container flex-1 custom-scrollbar ${isPharmacyPage ? 'pl-2 pr-2 md:pl-4 md:pr-4' : ''} ${isReportPage ? 'overflow-hidden' : 'overflow-auto'}`}>
                <div className={`w-full ${isReportPage ? 'h-full' : ''}`}>
                    {children}
                </div>
            </section>
            <div className={`transition-all duration-300 ease-in-out ${
                hideRightSidebar ? 'w-0 opacity-0' : 'w-fit opacity-100'
            }`}>
                {!hideRightSidebar && <RightSidebar />}
            </div>
        </main>
    );
} 