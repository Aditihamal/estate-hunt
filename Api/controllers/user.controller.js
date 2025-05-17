import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// Get all agents
export const getAgents = async (req, res) => {
  try {
    const agents = await prisma.user.findMany({
      where: { userType: "Agent" },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    res.status(200).json(agents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get agents" });
  }
};

// Get all posts created by an agent
export const getAgentPosts = async (req, res) => {
  try {
    const { agentId } = req.params;

    // Check if the agent exists
    const agent = await prisma.user.findUnique({
      where: { id: agentId, userType: "Agent" },
      select: { id: true, username: true, email: true, avatar: true },
    });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Fetch all posts created by the agent
    const posts = await prisma.post.findMany({
      where: { userId: agentId },
      select: {
        id: true,
        title: true,
        price: true,
        images: true,
        address: true,
        city: true,
        bedroom: true,
        bathroom: true,
        createdAt: true,
      },
    });

    res.status(200).json({ agent, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch agent's posts" });
  }
};

// Post feedback for an agent
export const postAgentFeedback = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { content } = req.body;
    const userId = req.body.user.id;

    const feedback = await prisma.feedback.create({
      data: {
        content,
        agentId,
        userId,
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};

// Get feedback for an agent
export const getAgentFeedback = async (req, res) => {
  try {
    const { agentId } = req.params;

    const feedbacks = await prisma.feedback.findMany({
      where: { agentId },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ feedbacks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get feedback" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id.toString() !== tokenUserId.toString()) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updateData = {
      ...inputs,
      ...(updatedPassword && { password: updatedPassword }),
      ...(avatar && { avatar: Array.isArray(avatar) ? avatar[0] : avatar }),

    };

    console.log("🛠️ Updating user with ID:", id);
    console.log("➡️ Data:", updateData);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.log("❌ Update Error:", {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack,
      meta: err.meta,
    });
  
    res.status(500).json({ message: "Failed to update users!" });
  }
  
  
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;
  console.log("postId:", postId); // must be 24-char hex string
console.log("userId:", tokenUserId);


  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};

export const profilePosts = async (req, res) => {
  try {
    const tokenUserId = req.userId;

    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
      include: {
        postDetail: true,
      },
    });

    const savedPostIds = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      select: {
        postId: true,
      },
    });

    const savedPosts = await prisma.post.findMany({
      where: {
        id: {
          in: savedPostIds.map((item) => item.postId),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        postDetail: true,
      },
    });

    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.error("Error in profilePosts:", err);
    res.status(500).json({ message: "Server error while loading profile posts" });
  }
};



export const getUserWithPosts = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    const posts = await prisma.post.findMany({
      where: { userId: id },
      include: {
        postDetail: true,
        user: true,
      },
    });

    res.status(200).json({ user, posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user and posts" });
  }
};
