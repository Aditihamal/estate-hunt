// routes/subscription.route.js
import express from "express";
import { getPlansByUserType, subscribeToPlan, getUserSubscription } from "../controllers/subscription.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/plans", verifyToken, getPlansByUserType);
router.post("/subscribe", verifyToken, subscribeToPlan);
router.get("/my-subscription", verifyToken, getUserSubscription);


export default router;
