import { InfoCard, PatientCard, PatientStatisticsCard, PrescriptionCard } from "@/components/cards";
import { medicines } from "@/constants";
import Image from "next/image";

const page = () => {
    return (
        <div className="flex flex-col gap-5">
            {/* User Info */}
            <div className="flex flex-col gap-2">
                <h4 className="text-base1-semibold text-gray-500">Welcome Back,</h4>
                <h1 className="text-heading2-semibold">Bishal Roy</h1>
            </div>

            {/* Availability */}
            <div className="flex flex-col lg:flex-row gap-2 justify-between items-center">
                <PatientCard cardTitle="Total Patients" cardDetail="200K" logo="users" color='blue' />
                <PatientCard cardTitle="Total Staff" cardDetail="120K" logo="staff" color='aqua' />
                <PatientCard cardTitle="Total Rooms" cardDetail="160K" logo="h-room" color='peach' />
            </div>

            {/* Prescription */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
                <div className="flex flex-col w-full lg:w-1/2 gap-10 p-5 bg-white rounded-2xl shadow-lg h-full">
                    <h1 className="text-body2-bold">Patient Prescription</h1>
                    <PrescriptionCard />
                </div>

                {/* Medicine RunsOut */}
                <div className="flex flex-col w-full lg:w-1/2 bg-white rounded-2xl shadow-lg p-5 gap-4 h-full">
                    <h1 className="text-body2-bold">Medicine Runs Out</h1>
                    <div className="flex flex-row flex-wrap gap-5 justify-center items-center">
                        {medicines.map((item) => (
                            <InfoCard key={item.index} img={item.index} time={item.date} title={item.name} highlight={item.index === 1 ? true : false} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="hidden md:flex flex-col bg-white rounded-2xl shadow-lg">
                <PatientStatisticsCard />
            </div>

        </div>
    )
}

export default page