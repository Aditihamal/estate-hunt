import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
dotenv.config();

export const getPosts = async (req, res) => {
  const query = req.query;
  const token = req.cookies?.token;
  let userId = null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      userId = payload.id;
    } catch (err) {
      console.log("Invalid token:", err.message);
    }
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        ...(query.city && { city: query.city }),
        ...(query.type && { type: query.type }),
        ...(query.property && { property: query.property }),
        ...(query.bedroom && { bedroom: parseInt(query.bedroom) }),
        ...(query.minPrice || query.maxPrice
          ? {
              price: {
                ...(query.minPrice && { gte: parseInt(query.minPrice) }),
                ...(query.maxPrice && { lte: parseInt(query.maxPrice) }),
              },
            }
          : {}),
        ...(userId && {
          userId: {
            not: userId, // don't return current user's own listings if logged in
          },
        }),
      },
      take: query.limit ? parseInt(query.limit) : undefined,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        postDetail: true,
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json("Something went wrong!");
  }
};



export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true, // ✅ make sure avatar is included
          },
        },
        postDetail: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    
    const userPosts = await prisma.post.count({
      where: { userId: tokenUserId },
    });

    
    const activeSub = await prisma.userSubscription.findFirst({
      where: {
        userId: tokenUserId,
        isActive: true,
        endDate: { gte: new Date() },
        plan: {
          userType: "Agent",
        },
      },
      include: { plan: true },
    });

    if (userPosts >= 3 && !activeSub) {
      return res.status(403).json({
        message: "Post limit reached. Please subscribe to continue posting.",
      });
    }

    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};


export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { postData, postDetail } = req.body;

  console.log("postData", postData);
  console.log("postDetail", postDetail);

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...postData,
        postDetail: {
          upsert: {
            update: { ...postDetail },
            create: { ...postDetail }, // ✅ remove postId here
          },
        },
      },
      include: {
        postDetail: true,
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("❌ Failed to update post:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.postDetail.delete({
      where: { id: post.postDetail.id },
    });

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};