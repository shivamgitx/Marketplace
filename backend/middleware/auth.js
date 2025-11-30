import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login required." });
  }

  try {
    // Verify token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // Validate decoded user ID format
    if (!mongoose.Types.ObjectId.isValid(token_decode.id)) {
      return res.json({ success: false, message: "Invalid token" });
    }

    // Check if user still exists in database
    const user = await userModel.findById(token_decode.id);
    if (!user) {
      return res.json({ success: false, message: "User not found. Please login again." });
    }

    // Add userId to request body and user object to request
    req.body.userId = token_decode.id;
    req.user = user; // Attach user object to request for future use

    next();
  } catch (error) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      return res.json({ success: false, message: "Token expired. Please login again." });
    } else if (error.name === 'JsonWebTokenError') {
      return res.json({ success: false, message: "Invalid token. Please login again." });
    }
    res.json({ success: false, message: "Authentication error" });
  }
};
export default authMiddleware;
