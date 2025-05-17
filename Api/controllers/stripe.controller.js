// controllers/stripe.controller.js
import Stripe from "stripe";
import prisma from "../lib/prisma.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckoutSession = async (req, res) => {
  try {
    const { planId } = req.body;

    // Fetch plan details from DB
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'npr',
          product_data: {
            name: plan.name,
          },
          unit_amount: plan.price * 100, // convert to paisa
        },
        quantity: 1,
      }],
      success_url: `http://localhost:5173/success?planId=${planId}`,
      cancel_url: `http://localhost:5173/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Checkout session failed" });
  }
};
