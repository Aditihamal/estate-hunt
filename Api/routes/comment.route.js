import express from "express";
import {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//  Create a comment
router.post("/", verifyToken, createComment);

// Get comments for a specific post
router.get("/:postId", getCommentsByPostId);

//  Update a comment (only by owner)
router.patch("/:id", verifyToken, updateComment);

//  Delete a comment (only by owner)
router.delete("/:id", verifyToken, deleteComment);

export default router;
