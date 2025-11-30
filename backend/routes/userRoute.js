import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected routes (require authentication)
// Example: userRouter.get("/profile", authMiddleware, getProfile);

export default userRouter;