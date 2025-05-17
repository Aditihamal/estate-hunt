import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.subscriptionPlan.createMany({
      data: [
        {
          name: "Basic Agent Plan",
          price: 1000,
          duration: 30,
          userType: "Agent",
          features: [
            "List up to 5 properties",
            "Basic email support"
          ]
        },
        {
          name: "Premium Agent Plan",
          price: 3000,
          duration: 90,
          userType: "Agent",
          features: [
            "Unlimited listings",
            "Priority support",
            "Dashboard analytics"
          ]
        },
        {
          name: "Buyer Premium Access",
          price: 500,
          duration: 30,
          userType: "Buyer",
          features: [
            "Early access to new listings",
            "Direct agent messaging"
          ]
        }
      ]
    });

    console.log("✅ Subscription plans seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding subscription plans:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
