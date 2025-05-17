// middleware/checkUserSubscription.js
import prisma from "../lib/prisma.js";

export const checkUserSubscription = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gte: new Date() },
        plan: {
          userType: "Buyer",
        },
      },
    });

    if (!subscription) {
      return res.status(403).json({
        message: "This feature is available to subscribed users only.",
      });
    }

    next();
  } catch (err) {
    console.error("❌ Subscription check failed:", err);
    return res.status(500).json({ message: "Subscription check failed." });
  }
};
