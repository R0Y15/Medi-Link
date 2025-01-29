"use client";

import { LeftSidebar, RightSidebar } from '@/components/shared';
import { usePathname } from 'next/navigation';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const hideRightSidebar = pathname === '/appointments';

    return (
        <main className="flex flex-row bg-[hsl(var(--background-darker))]">
            <LeftSidebar />
            <section className="main-container flex-1">
                <div className="w-full">
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