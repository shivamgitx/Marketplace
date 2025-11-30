import express from "express";
import { addProduct, listProducts, removeProduct } from "../controllers/productController.js";
import { upload } from '../middleware/multer.js';
import authMiddleware from "../middleware/auth.js";

const productRouter = express.Router();

// Admin routes (require authentication)
productRouter.post("/add", authMiddleware, upload.single('image'), addProduct);
productRouter.post("/remove", authMiddleware, removeProduct);

// Public routes
productRouter.get("/list", listProducts);

export default productRouter;