import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Footer, LeftSidebar, Navbar, RightSidebar } from "@/components/shared";
// import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'Medi-Link',
    description: 'A Next.js Medical-Dashboard',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <Navbar />
                    <main className="flex flex-row bg-[hsl(var(--background-darker))]">
                        <LeftSidebar />
                        <section className="main-container flex-1">
                            <div className="w-full">
                                {children}
                            </div>
                        </section>
                        <RightSidebar />
                    </main>
                    <Footer />
                </body>
            </html>
        // </ClerkProvider>
    );
}
