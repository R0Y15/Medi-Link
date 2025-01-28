import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
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
        <html lang="en">
            <body className={`${inter.className} bg-background`}>
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
} 