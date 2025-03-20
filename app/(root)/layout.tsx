import { Inter } from "next/font/google";
import { Footer, Navbar } from "@/components/shared";
import ClientLayout from "./client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: 'Medi-Link',
    description: 'A Next.js Medical-Dashboard',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <ClientLayout>
                {children}
            </ClientLayout>
            <Footer />
        </>
    );
}
