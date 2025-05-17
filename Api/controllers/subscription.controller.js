import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// Get all plans based on user type
// export const getPlansByUserType = async (req, res) => {
//   try {
//     let userType = req.query.userType;
//     console.log("🔍 Fetching plans for userType:", userType);

//     if (!userType) {
//       return res.status(400).json({ message: "Missing userType in query" });
//     }

//     userType = userType.toLowerCase();

//     const plans = await prisma.subscriptionPlan.findMany({
//       where: {
//         userType: {
//           equals: userType,
//           mode: "insensitive", // ensures "Agent", "agent", etc. all match
//         },
//       },
//     });

//     if (!plans.length) {
//       return res.status(404).json({ message: "No plans found for this user type" });
//     }

//     res.status(200).json(plans);
//   } catch (err) {
//     console.error("❌ Failed to fetch plans:", err);
//     res.status(500).json({ message: "Failed to fetch plans" });
//   }
// };
export const getPlansByUserType = async (req, res) => {
  try {
    const userType = req.user.userType; // ✅ correct
    console.log("📦 userType from token:", userType);

    if (!userType) {
      return res.status(400).json({ message: "Missing userType in token" });
    }

    const plans = await prisma.subscriptionPlan.findMany({
      where: { userType },
    });

    return res.status(200).json(plans);
  } catch (err) {
    console.error("❌ Error in getPlansByUserType:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


  
  // Subscribe to a plan
 export const subscribeToPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body;

    const existing = await prisma.userSubscription.findFirst({
      where: { userId, planId, isActive: true },
    });

    if (existing) {
      return res.status(200).json({ message: "Subscription already exists" });
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

    await prisma.userSubscription.create({
      data: {
        userId,
        planId,
        startDate,
        endDate,
        isActive: true,
      },
    });

    res.status(200).json({ message: "Subscription activated" });
  } catch (err) {
    console.error("❌ Failed to subscribe:", err);
    res.status(500).json({ message: "Server error" });
  }
};

  export const getUserSubscription = async (req, res) => {
    try {
      const subscription = await prisma.userSubscription.findFirst({
        where: {
          userId: req.user.id,
          isActive: true,
        },
        include: {
          plan: true,
        },
      });
  
      if (!subscription) {
        return res.status(404).json({ message: "No active subscription found." });
      }
  
      res.status(200).json(subscription);
    } catch (err) {
      console.error("❌ Failed to fetch subscription:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  