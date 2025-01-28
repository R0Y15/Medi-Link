import { ChartConfig } from "@/components/ui/chart";

export interface PatientCardProps {
    cardTitle: string;
    cardDetail: string;
    logo: string;
    color: string;
}

export interface InfoCardprops {
    img?: string | number;
    title: string;
    time: string;
    desc?: string;
    highlight?: boolean;
}

export interface VaccineProps {
    title: string;
    date: string;
}

export const sidebarLinks = [
    {
        'route': '/',
        'icon': 'dashboard.svg',
        'activeIcon': 'dashboard2.svg',
        'label': 'Dashboard'
    },
    {
        'route': '/appointments',
        'icon': 'appoint.svg',
        'activeIcon': 'appoint2.svg',
        'label': 'Appointments'
    },
    {
        'route': '/pharmacy',
        'icon': 'Pharmacy.svg',
        'activeIcon': 'Pharmacy2.svg',
        'label': 'Pharmacy'
    },
    {
        'route': '/activity',
        'icon': 'Activity.svg',
        'activeIcon': 'Activity2.svg',
        'label': 'Activity'
    },
    {
        'route': '/report',
        'icon': 'Report.svg',
        'activeIcon': 'Report2.svg',
        'label': 'Report'
    },
    {
        'route': '/settings',
        'icon': 'Settings.svg',
        'activeIcon': 'Settings2.svg',
        'label': 'Settings'
    },
]

export const chartData = [
    // { "month": "", "desktop": 0 },
    { "month": "January", "desktop": 186 },
    { "month": "February", "desktop": 305 },
    { "month": "March", "desktop": 237 },
    { "month": "April", "desktop": 73 },
    { "month": "May", "desktop": 209 },
    { "month": "June", "desktop": 214 },
    { "month": "July", "desktop": 1200 }, // High peak
    { "month": "August", "desktop": 450 }, // Drop after peak
    { "month": "September", "desktop": 500 }, // Slight increase
    { "month": "October", "desktop": 650 }, // Upward trend
    { "month": "November", "desktop": 300 }, // Sharp drop
    { "month": "December", "desktop": 750 } // Ending on a high note
]

export const medicines = [
    { index: 1, name: "Amoxicline", date: "12 Jan 2022" },
    { index: 2, name: "Baclofen", date: "13 Feb 2022" },
    { index: 3, name: "Cefuroxime", date: "14 Mar 2022" },
    { index: 4, name: "Diazepam", date: "15 Apr 2022" },
    { index: 5, name: "Estrogen", date: "16 May 2022" },
    { index: 6, name: "Finasteride", date: "17 Jun 2022" },
    { index: 7, name: "Glycerol", date: "18 Jul 2022" },
    { index: 8, name: "Metformin", date: "19 Aug 2022" }
]

export const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#0095F6",
    }
} satisfies ChartConfig

export const vaccines = [
    { name: "Pfizer-BioNTech", date: "2023-01-15" },
    { name: "Moderna", date: "2023-02-20" },
    { name: "AstraZeneca", date: "2023-03-10" },
    { name: "Johnson & Johnson", date: "2023-04-05" },
    { name: "Covaxin", date: "2023-05-12" },
    { name: "Sputnik V", date: "2023-06-18" },
    { name: "Sinopharm", date: "2023-07-22" },
    { name: "Sinovac", date: "2023-08-30" },
    { name: "Novavax", date: "2023-09-15" },
    { name: "Covovax", date: "2023-10-01" }
];

export const API_ENDPOINTS = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    user: '/user',
    stats: '/stats',
    prescriptions: '/prescriptions',
    appointments: '/appointments',
    vaccinations: '/vaccinations',
    activity: '/activity',
    settings: '/settings',
} as const;
