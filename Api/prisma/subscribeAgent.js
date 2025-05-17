// prisma/subscribeAgent.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const userId = "67ea0b14bdd3171b899ba5b5";
  const planId = "67f89040d385a4a7f9cb15e7"; // Must be for an "Agent" plan

  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.duration);

  await prisma.userSubscription.create({
    data: {
      userId,
      planId,
      endDate,
    },
  });

  console.log("✅ Agent subscribed successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
