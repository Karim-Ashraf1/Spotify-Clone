import express from "express";
import { searchContent, getSearchSuggestions } from "../controllers/search.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route for searching songs, albums, and artists
router.get("/", protectRoute, searchContent);

// Route for getting search suggestions
router.get("/suggestions", protectRoute, getSearchSuggestions);

export default router; 