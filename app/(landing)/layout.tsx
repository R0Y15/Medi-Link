import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer, Navbar } from "@/components/shared";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'Medi-Link',
    description: 'A Next.js Medical-Dashboard',
}

export default function LandingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
} 