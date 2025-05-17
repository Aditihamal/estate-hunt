import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
dotenv.config();

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;
//   // console.log("Cookies:", req.cookies);

//   if (!token) return res.status(401).json({ message: "Not Authenticated!" });

//   jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
//     if (err) return res.status(403).json({ message: "Token is not Valid!" });
//     req.userId = payload.id;
//     req.user = payload;

//     next();
//   });
// };
// import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    req.userId = decoded.id;
     // ✅ This line must be here
    next();
  });
};
