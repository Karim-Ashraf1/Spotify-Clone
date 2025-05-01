import express from "express";
import dotenv from "dotenv";


dotenv.config();

import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import searchRoutes from "./routes/search.route.js";
import likeRoutes from "./routes/like.route.js";
import commentRoutes from "./routes/comment.route.js";

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.static('public'));

app.use(express.json());
app.use(clerkMiddleware());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
    createParentPath: true,
    limits:{
        fileSize: 10 * 1024 * 1024,  
    },
})
);

// Log environment variables during startup (for debugging)
console.log("Environment variables:", {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI ? "DEFINED" : "UNDEFINED",
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "DEFINED" : "UNDEFINED"
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/song", songRoutes); 
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);

app.use((error, req, res, next) => {
    res.status(500).send({message: process.env.NODE_ENV === "production" ? "Internal server error" : error.message});
});

app.listen(PORT, () => {
    console.log("Server is running on port "+ PORT);
    connectDB();
});