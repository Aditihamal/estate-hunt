import express from "express";
import {
  getAgents,
  getAgentPosts,
  getAgentFeedback,
  postAgentFeedback,
  deleteUser,
  updateUser,
  savePost,
  profilePosts,
  getUserWithPosts,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkUserSubscription } from "../middleware/checkUserSubscription.js";




const router = express.Router();

// Agent routes
router.get("/agents", getAgents);
router.get("/agents/:agentId/posts", getAgentPosts);
router.post("/agents/:agentId/feedback", postAgentFeedback);
router.get("/agents/:agentId/feedback", getAgentFeedback);

router.get("/profilePosts", verifyToken, profilePosts);
router.get("/:id", getUserWithPosts);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savePost);
router.post("/save", verifyToken, checkUserSubscription, savePost);

export default router;