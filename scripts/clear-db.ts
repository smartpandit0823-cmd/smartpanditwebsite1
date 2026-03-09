import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function clearDB() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected.");

    console.log("Clearing data (keeping AdminUsers)...");

    // Collections to wipe completely
    const collections = [
        "products",
        "orders",
        "categories",
        "banners",
        "coupons",
        "reviews",
        "users",
        "bookings",
        "astrorequests",
        "payments",
        "notifications"
    ];

    for (const coll of collections) {
        try {
            await mongoose.connection.collection(coll).deleteMany({});
            console.log(`Cleared ${coll}`);
        } catch (e) {
            console.log(`Skipped ${coll} (might not exist)`);
        }
    }

    console.log("Database cleared. Ready for new store setup.");
    process.exit(0);
}

clearDB();
