import express from "express";
import { addComment, getAlbumComments, deleteComment } from "../controllers/comment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, addComment);

router.get("/album/:albumId", getAlbumComments);

router.delete("/:commentId", protectRoute, deleteComment);

export default router; 