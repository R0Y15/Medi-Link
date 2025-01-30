import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL environment variable is not set");
  console.log("Please follow these steps:");
  console.log("1. Run 'npx convex dev' to initialize Convex project");
  console.log("2. Copy the Convex URL from the dashboard");
  console.log("3. Add it to .env.local file: NEXT_PUBLIC_CONVEX_URL=your_convex_url");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

const dummyActivities = [
  {
    type: "appointment",
    title: "General Checkup",
    description: "Regular health checkup with Dr. Smith",
    timestamp: new Date("2024-01-29T10:00:00").toISOString(),
    category: "medical",
    status: "completed",
    metadata: {
      doctorName: "Dr. Smith",
      location: "Main Clinic",
      speciality: "General Medicine",
      notes: "Patient is in good health. Follow-up in 6 months."
    }
  },
  {
    type: "prescription",
    title: "New Prescription",
    description: "Prescribed medication for blood pressure",
    timestamp: new Date("2024-01-28T15:30:00").toISOString(),
    category: "pharmacy",
    status: "active",
    metadata: {
      doctorName: "Dr. Johnson",
      prescription: ["Lisinopril 10mg", "Once daily"],
      notes: "Take with food in the morning"
    }
  },
  {
    type: "lab",
    title: "Blood Test Results",
    description: "Complete Blood Count (CBC) results",
    timestamp: new Date("2024-01-27T09:15:00").toISOString(),
    category: "lab",
    status: "completed",
    metadata: {
      doctorName: "Dr. Wilson",
      testResults: ["Hemoglobin: 14.2", "WBC: 7.5", "Platelets: 250"],
      notes: "All results within normal range"
    }
  },
  {
    type: "vaccination",
    title: "Flu Shot",
    description: "Annual influenza vaccination",
    timestamp: new Date("2024-01-26T14:00:00").toISOString(),
    category: "medical",
    status: "completed",
    metadata: {
      location: "City Pharmacy",
      notes: "Next vaccination due in January 2025"
    }
  },
  {
    type: "note",
    title: "Diet Plan Update",
    description: "Modified diet plan for better health",
    timestamp: new Date("2024-01-25T11:45:00").toISOString(),
    category: "general",
    status: "active",
    metadata: {
      notes: "Reduce salt intake, increase vegetables and fruits"
    }
  }
];

async function migrateActivities() {
  try {
    console.log("Starting activities migration...");
    console.log(`Using Convex URL: ${CONVEX_URL}`);
    
    for (const activity of dummyActivities) {
      try {
        await client.mutation(api.activities.create, activity);
        console.log(`✅ Created activity: ${activity.title}`);
      } catch (error) {
        console.error(`❌ Failed to create activity: ${activity.title}`, error);
      }
    }

    console.log("Activities migration completed!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Run migration
migrateActivities(); 