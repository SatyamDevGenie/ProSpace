import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/user.model";

const users = [
    {
        name: "Satyam Administrator",
        email: "satyam@gmail.com",
        password: "satyam123",
        role: "ADMIN" as const
    },
    {
        name: "Aftab Mulani",
        email: "aftab@gmail.com",
        password: "aftab123",
        role: "USER" as const
    }
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("✅ MongoDB connected");

        for (const user of users) {
            const exists = await User.findOne({ email: user.email });
            if (exists) {
                console.log(`⏭️  User already exists: ${user.email}`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(user.password, 10);
            await User.create({
                name: user.name,
                email: user.email,
                password: hashedPassword,
                role: user.role
            });
            console.log(`✅ Created ${user.role}: ${user.email}`);
        }

        console.log("🎉 Seeding complete");
    } catch (error) {
        console.error("❌ Seeding failed:", (error as Error).message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

const destroyUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("✅ MongoDB connected");

        const emails = users.map((u) => u.email);
        const result = await User.deleteMany({ email: { $in: emails } });

        console.log(`🗑️  Deleted ${result.deletedCount} seeded user(s)`);
        console.log("🎉 Destroy complete");
    } catch (error) {
        console.error("❌ Destroy failed:", (error as Error).message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

const isDestroy = process.argv.includes("--destroy");

if (isDestroy) {
    destroyUsers();
} else {
    seedUsers();
}
