import { ChartConfig } from "@/components/ui/chart";

// Import icons
import dashboardIcon from '@/public/assets/dashboard.svg';
import dashboard2Icon from '@/public/assets/dashboard2.svg';
import appointIcon from '@/public/assets/appoint.svg';
import appoint2Icon from '@/public/assets/appoint2.svg';
import pharmacyIcon from '@/public/assets/pharmacy.svg';
import pharmacy2Icon from '@/public/assets/pharmacy2.svg';
import activityIcon from '@/public/assets/activity.svg';
import activity2Icon from '@/public/assets/activity2.svg';
import reportIcon from '@/public/assets/report.svg';
import report2Icon from '@/public/assets/report2.svg';
import settingsIcon from '@/public/assets/settings.svg';
import settings2Icon from '@/public/assets/settings2.svg';
import bloodBankIcon from '@/public/assets/bloodBankIcon.svg';
import bloodBank2Icon from '@/public/assets/bloodBank2Icon.svg';

export interface PatientCardProps {
    cardTitle: string;
    cardDetail: string;
    logo: string;
    color: string;
    detailedInfo?: Array<{
        title: string;
        value: string;
        icon?: string;
    }>;
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
        'route': '/patientDashboard',
        'icon': dashboardIcon,
        'activeIcon': dashboard2Icon,
        'label': 'Dashboard'
    },
    {
        'route': '/appointments',
        'icon': appointIcon,
        'activeIcon': appoint2Icon,
        'label': 'Appointments'
    },
    {
        'route': '/pharmacy',
        'icon': pharmacyIcon,
        'activeIcon': pharmacy2Icon,
        'label': 'Pharmacy'
    },
    {
        'route': '/blood-bank',
        'icon': bloodBankIcon,
        'activeIcon': bloodBank2Icon,
        'label': 'Blood Bank'
    },
    {
        'route': '/activity',
        'icon': activityIcon,
        'activeIcon': activity2Icon,
        'label': 'Activity'
    },
    {
        'route': '/report',
        'icon': reportIcon,
        'activeIcon': report2Icon,
        'label': 'Report'
    },
    {
        'route': '/settings',
        'icon': settingsIcon,
        'activeIcon': settings2Icon,
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
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    user: '/user',
    stats: '/stats',
    prescriptions: '/prescriptions',
    appointments: '/appointments',
    vaccinations: '/vaccinations',
    activity: '/activity',
    settings: '/settings',
} as const;

