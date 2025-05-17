// controllers/reply.controller.js
import prisma from "../lib/prisma.js";

export const createReply = async (req, res) => {
    try {
      const { commentId, content } = req.body;
      const userId = req.userId; // Agent's user ID
  
      const reply = await prisma.reply.create({
        data: {
          content,
          commentId, // ✅ Just connect using foreign key
          agentId: userId, // ✅ Assuming it's stored as agentId in your schema
        },
        include: {
          agent: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
  
      res.status(201).json(reply);
    } catch (err) {
      console.error("❌ Error creating reply:", err);
      res.status(500).json({ message: "Failed to create reply" });
    }
  };
  export const updateReply = async (req, res) => {
    const replyId = req.params.id;
    const { content } = req.body;
    const userId = req.userId;
  
    try {
      const existingReply = await prisma.reply.findUnique({
        where: { id: replyId },
      });
      console.log("Reply AgentId:", existingReply.agentId);
console.log("Request UserId:", userId);

  
      if (!existingReply || existingReply.userId !== req.userId)

 {
        return res.status(403).json({ message: "Unauthorized or reply not found" });
      }
  
      const updated = await prisma.reply.update({
        where: { id: replyId },
        data: { content },
      });
  
      res.status(200).json(updated);
    } catch (err) {
      console.error("❌ Error updating reply:", err);
      res.status(500).json({ message: "Failed to update reply" });
    }
  };
  
  
  export const deleteReply = async (req, res) => {
    const replyId = req.params.id;
    const userId = req.userId;
  
    try {
      const existingReply = await prisma.reply.findUnique({
        where: { id: replyId },
      });
      console.log("Reply AgentId:", existingReply.agentId);
console.log("Request UserId:", userId);

  
      if (!existingReply || existingReply.userId !== req.userId)

        {
        return res.status(403).json({ message: "Unauthorized or reply not found" });
      }
  
      await prisma.reply.delete({
        where: { id: replyId },
      });
  
      res.status(200).json({ message: "Reply deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting reply:", err);
      res.status(500).json({ message: "Failed to delete reply" });
    }
  };
  
  