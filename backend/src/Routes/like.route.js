import express from "express";
import { likeSong, unlikeSong, checkLikeStatus, getLikedSongs } from "../controllers/like.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, likeSong);

router.delete("/:songId", protectRoute, unlikeSong);

router.get("/check/:songId", protectRoute, checkLikeStatus);

router.get("/songs", protectRoute, getLikedSongs);

export default router; 