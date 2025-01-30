import { InfoCard, PatientCard, PatientStatisticsCard, PrescriptionCard } from "@/components/cards";
import { medicines } from "@/constants";

const page = () => {
    return (
        <div className="flex flex-col gap-5">
            {/* User Info */}
            <div className="flex flex-col gap-2">
                <h4 className="text-base1-semibold text-muted-foreground">Welcome Back,</h4>
                <h1 className="text-heading2-semibold text-foreground">Bishal Roy</h1>
            </div>

            {/* Availability */}
            <div className="flex flex-col lg:flex-row gap-2 justify-between items-center">
                <PatientCard cardTitle="My Appointments" cardDetail="5" logo="users" color='gray' />
                <PatientCard cardTitle="Assigned Doctor(s)" cardDetail="3" logo="staff" color='aqua' />
                <PatientCard cardTitle="Hospital Visits" cardDetail="60" logo="h-room" color='peach' />
            </div>

            {/* Prescription */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
                <div className="flex flex-col w-full lg:w-1/2 gap-10 p-5 bg-card rounded-2xl shadow-sm h-full border">
                    <h1 className="text-body2-bold text-foreground">Patient Prescription</h1>
                    <PrescriptionCard />
                </div>

                {/* Medicine RunsOut */}
                <div className="flex flex-col w-full lg:w-1/2 bg-card rounded-2xl shadow-sm p-5 gap-4 h-full border">
                    <h1 className="text-body2-bold text-foreground">Medicine Runs Out</h1>
                    <div className="flex flex-row flex-wrap gap-5 justify-center items-center">
                        {medicines.map((item) => (
                            <InfoCard key={item.index} img={item.index} time={item.date} title={item.name} highlight={item.index === 1 ? true : false} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="hidden md:flex flex-col bg-card rounded-2xl shadow-sm border">
                <PatientStatisticsCard />
            </div>

        </div>
    )
}

export default page