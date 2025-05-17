import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { PrismaClient } from "@prisma/client";
//port bcrypt from "bcryptjs";


const router = express.Router();
const prisma = new PrismaClient();

router.get("/users", verifyToken, async (req, res) => {
    try {
      if (req.user.userType !== "Admin") {
        return res.status(403).json("Access denied");
      }
  
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          userType: true,
          createdAt: true,
        },
      });
  
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  router.get("/dashboard-stats", verifyToken, async (req, res) => {
    try {
      console.log("➡️ Authenticated user:", req.user);
  
      if (req.user.userType !== "Admin") {
        console.log("⛔ Not an admin");
        return res.status(403).json("Access denied");
      }
  
      console.log("✅ User is admin, fetching stats...");
  
      const userCount = await prisma.user.count();
      const postCount = await prisma.post.count();
      const agentCount = await prisma.user.count({
        where: { userType: "Agent" },
      });
  
      console.log("✅ Fetched stats:", { userCount, postCount, agentCount });
  
      res.json({
        userCount,
        postCount,
        agentCount,
      });
    } catch (err) {
      console.error("❌ Error in dashboard-stats route:", err);
      res.status(500).json(err);
    }
  });
  
  
  router.delete("/users/:id", verifyToken, async (req, res) => {
    try {
      if (req.user.userType !== "Admin") {
        return res.status(403).json("Access denied");
      }
  
      await prisma.user.delete({
        where: {
          id: req.params.id,
        },
      });
  
      res.json("User deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
router.post("/admin-register", async (req, res) => {
  const { username, email, password, secretKey } = req.body;

  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ error: "Invalid admin secret key" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        userType: "Admin",
      },
    });

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("❌ Admin Registration Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
  
  export default router;