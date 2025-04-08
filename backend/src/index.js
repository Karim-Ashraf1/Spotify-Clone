const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./lib/db');

const {userRoutes} = require('./Routes/user.route');
const {adminRoutes} = require('./Routes/admin.route');
const {authRoutes} = require('./Routes/auth.route');
const {songRoutes} = require('./Routes/song.route');
const {albumRoutes} = require('./Routes/album.route');
const {statRoutes} = require('./Routes/stat.route');
const { connect } = require('mongoose');

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/song", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port "+ PORT);
    connectDB();
});