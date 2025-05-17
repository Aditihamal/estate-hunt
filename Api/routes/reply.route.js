import express from "express";
import {
  createReply,
  updateReply,   
  deleteReply    
} from "../controllers/reply.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createReply);
// Backend route - this goes in your Express backend, NOT in React
router.patch("/replies/:id", verifyToken, async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);

    if (!reply) {
      return res.status(404).json("Reply not found.");
    }

    if (reply.agentId.toString() !== req.user.id) {
      return res.status(403).json("You are not allowed to edit this reply.");
    }

    reply.content = req.body.content;
    await reply.save();

    res.status(200).json("Reply updated successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error.");
  }
});

router.delete("/:id", verifyToken, deleteReply); 

export default router;
