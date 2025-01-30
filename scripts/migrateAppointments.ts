import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const JSON_SERVER_URL = "http://localhost:3001/appointments";
const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function migrateAppointments() {
  try {
    // Fetch appointments from JSON server
    const response = await fetch(JSON_SERVER_URL);
    const appointments = await response.json();

    console.log(`Found ${appointments.length} appointments to migrate...`);

    // Migrate each appointment to Convex
    for (const appointment of appointments) {
      const appointmentData = { ...appointment };
      delete appointmentData.id;
      
      // Create appointment in Convex
      await client.mutation(api.appointments.create, {
        ...appointmentData,
        patientName: appointmentData.patientName || "Test Patient",
      });

      console.log(`Migrated appointment: ${appointment.doctorName}`);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Run migration
migrateAppointments(); 