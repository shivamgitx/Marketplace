import express from "express";
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

// Order routes
orderRouter.post("/place", authMiddleware, placeOrder);     // Requires authentication
orderRouter.post("/verify", verifyOrder);                  // Public route for Stripe webhook verification
orderRouter.post("/userorders", authMiddleware, userOrders); // Requires authentication
orderRouter.post("/list", authMiddleware, listOrders);     // Requires authentication (admin only)
orderRouter.post("/status", authMiddleware, updateStatus); // Requires authentication (admin only)

export default orderRouter;