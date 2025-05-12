import express from "express";
import dotenv from "dotenv";


dotenv.config();

import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import cron from "node-cron";
import fs from "fs";

import { connectDB } from "../src/lib/db.js";
import userRoutes from "../src/Routes/user.route.js";
import adminRoutes from "../src/Routes/admin.route.js";
import authRoutes from "../src/Routes/auth.route.js";
import songRoutes from "../src/Routes/song.route.js";
import albumRoutes from "../src/Routes/album.route.js";
import statRoutes from "../src/Routes/stat.route.js";
import searchRoutes from "../src/Routes/search.route.js";
import likeRoutes from "../src/Routes/like.route.js";
import commentRoutes from "../src/Routes/comment.route.js";

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT;

app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? [process.env.FRONTEND_URL || "*"] 
        : "http://localhost:3000",
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

const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("error", err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes); 
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
}

app.use((error, req, res, next) => {
    res.status(500).send({message: process.env.NODE_ENV === "production" ? "Internal server error" : error.message});
});

app.get('/', (req, res) => {
    res.json({ message: 'Spotify API is running' });
});

app.listen(PORT, () => {
    console.log("Server is running on port "+ PORT);
    connectDB();
});