import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const JSON_SERVER_URL = "http://localhost:3001";

if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL environment variable is not set");
  console.log("Please follow these steps:");
  console.log("1. Run 'npx convex dev' to initialize Convex project");
  console.log("2. Copy the Convex URL from the dashboard");
  console.log("3. Add it to .env.local file: NEXT_PUBLIC_CONVEX_URL=your_convex_url");
  process.exit(1);
}

async function migrateMedicines() {
  try {
    // Initialize Convex client
    const client = new ConvexClient(CONVEX_URL);

    // Fetch medicines from JSON server
    const response = await fetch(`${JSON_SERVER_URL}/prescriptions`);
    const medicines = await response.json();

    console.log(`Found ${medicines.length} medicines to migrate...`);

    // Migrate each medicine to Convex
    for (const medicine of medicines) {
      const { id, ...medicineData } = medicine;
      
      try {
        await client.mutation(api.medicines.create, {
          name: medicineData.name,
          stock: parseInt(medicineData.stock),
          category: medicineData.category,
          price: parseFloat(medicineData.price),
          expiryDate: medicineData.expiryDate,
          status: medicineData.status as "In Stock" | "Low Stock" | "Out of Stock"
        });
        console.log(`✅ Migrated medicine: ${medicineData.name}`);
      } catch (error) {
        console.error(`❌ Failed to migrate medicine: ${medicineData.name}`, error);
      }
    }

    console.log("Migration completed!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateMedicines(); 