import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import crypto from "crypto";
import nodemailer from "nodemailer";


import dotenv from "dotenv";
dotenv.config();
const ADMIN_SECRET = process.env.ADMIN_SECRET || "mySuperAdminSecret";

export const register = async (req, res) => {
  const { username, email, password, userType } = req.body;

  try {
    //  Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (!existingUser.isVerified) {
        // Generate new OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
          where: { email },
          data: { otp, otpExpiry },
        });

        // Resend OTP
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"EstateHunt" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Your new EstateHunt OTP",
          html: `<p>Your new OTP is: <strong>${otp}</strong></p>`,
        });

        return res.status(200).json({ message: "OTP re-sent. Please verify your email." });
      }

      return res.status(400).json({ message: "Email is already registered. Please log in." });
    }

    // Continue with user creation (if not already registered)
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString(); // new OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        userType: userType || "Buyer",
        isVerified: false,
        otp,
        otpExpiry,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"EstateHunt" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your EstateHunt account",
      html: `<h3>Welcome, ${username}!</h3><p>Your verification code is: <strong>${otp}</strong></p>`,
    });

    res.status(201).json({ message: "User created. OTP sent to email." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt for email:", email); // Debugging log

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found in database!");
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    console.log("User found in database:", user);

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Password does not match!"); // Debugging log
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    console.log("Password matched, generating JWT...");

    // Generate JWT token
    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
      {
        id: user.id,
        userType: user.userType,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    console.log("Login successful! Token generated.");

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json({ token, user });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Failed to login!" });
  }
};
export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ message: "User not found!" });
    if (user.isVerified) return res.status(400).json({ message: "Already verified!" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP!" });

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired!" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
      },
    });

    res.status(200).json({ message: "Email verified successfully." });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ message: "Verification failed!" });
  }
};

export const registerAdmin = async (req, res) => {
  const { username, email, password, secretKey } = req.body;
  const secretCode = secretKey;
  
  console.log("🧾 Full req.body:", req.body);
  console.log("✅ ADMIN_SECRET from env:", process.env.ADMIN_SECRET);
  console.log("🟠 Secret code provided:", secretCode);
  

  if (secretCode !== ADMIN_SECRET) {
    return res.status(403).json("Unauthorized to register as admin");
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json("User already exists");

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        userType: "Admin",
      },
    });

    const token = jwt.sign({ id: newUser.id, userType: "Admin" }, process.env.JWT_SECRET_KEY, {
      expiresIn: "3d",
    });

    res.status(201).json({
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        userType: newUser.userType,
      },
      token,
    });
  } catch (err) {
    console.error("❌ Failed to register admin:", err);
  
    if (err.code === "P2002") {
      const target = err.meta?.target;
      const fields = Array.isArray(target) ? target.join(", ") : target || "username or email";
      return res.status(400).json({
        message: `The ${fields} already exists. Please use a different one (e.g. a new Gmail).`,
      });
    }
    
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
  
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
