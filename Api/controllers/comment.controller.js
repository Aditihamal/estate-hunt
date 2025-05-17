// comment.controller.js

import prisma from "../lib/prisma.js";

// Create Comment
export const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.userId;

    if (!postId || !content || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
        userId,
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("❌ Error creating comment:", err);
    res.status(500).json({ message: "Failed to create comment" });
  }
};

// Get Comments by Post ID
export const getCommentsByPostId = async (req, res) => {
    try {
      const postId = req.params.postId;
  
      const comments = await prisma.comment.findMany({
        where: { postId },
        select: {
          id: true,
          content: true,
          createdAt: true,
          userId: true, 
          user: {
            select: { username: true, avatar: true },
          },
          replies: {
            include: {
              agent: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  userType: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      
      
  
      res.status(200).json(comments);
    } catch (err) {
      console.error("❌ Error fetching comments:", err);
      res.status(500).json({ message: "Failed to get comments" });
    }
  };
  
// ✅ Edit Comment
export const updateComment = async (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body;
    const userId = req.userId;
  
    try {
      // Verify ownership
      const existingComment = await prisma.comment.findUnique({
        where: { id: commentId },
      });
  
      if (!existingComment || existingComment.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized or comment not found" });
      }
  
      const updated = await prisma.comment.update({
        where: { id: commentId },
        data: { content },
      });
  
      res.status(200).json(updated);
    } catch (err) {
      console.error("❌ Error updating comment:", err);
      res.status(500).json({ message: "Failed to update comment" });
    }
  };
  
  // ✅ Delete Comment
  export const deleteComment = async (req, res) => {
    const commentId = req.params.id;
    const userId = req.userId;
  
    try {
      const existingComment = await prisma.comment.findUnique({
        where: { id: commentId },
      });
  
      if (!existingComment || existingComment.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized or comment not found" });
      }
  
      await prisma.comment.delete({
        where: { id: commentId },
      });
  
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting comment:", err);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  };
