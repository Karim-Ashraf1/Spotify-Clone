import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB ', conn.connection.host);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // 1 is a failure, 0 is a success
    }
}