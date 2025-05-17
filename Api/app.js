import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import commentRoute from "./routes/comment.route.js";
import replyRoute from "./routes/reply.route.js";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.route.js";
import subscriptionRoutes from "./routes/subscription.route.js";
import stripeRoutes from "./routes/stripe.route.js";


dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/comments", commentRoute);
app.use("/api/replies", replyRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/stripe", stripeRoutes);


app.listen(8800, () => {
  console.log("Server is running on port 8800!");
});

export default app;