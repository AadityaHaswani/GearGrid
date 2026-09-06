import { Router } from "express";
import { generateRecommendations } from "../controllers/configure.controllers.js";

const router = Router();

// POST /api/v1/configure/recommend - Generates 3 deterministic, compatible builds from MongoDB
router.route("/recommend").post(generateRecommendations);

export default router;
