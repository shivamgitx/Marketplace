import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";
import path from "path";

// add product items
const addProduct = async (req, res) => {
  try {
    // Validate inputs
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Validate price is a positive number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.json({ success: false, message: "Invalid price" });
    }

    // Validate category is in the allowed list
    const allowedCategories = [
      "Sohrai Art",
      "Stone carving",
      "Lac Bangles",
      "Khadi Handloom",
      "Bamboo Craft",
      "Dhokra Craft",
      "Jute Products",
      "Munda jewelry"
    ];

    if (!allowedCategories.includes(category)) {
      return res.json({ success: false, message: "Invalid category" });
    }

    // Validate file upload exists
    if (!req.file) {
      return res.json({ success: false, message: "Image file is required" });
    }

    let image_filename = `${req.file.filename}`;
    const product = new productModel({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      category: category.trim(),
      image: image_filename,
    });

    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await product.save();
      res.json({ success: true, message: "Product Added" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding product" });
  }
};

// all products
const listProducts = async (req, res) => {
  try {
    // Support for search, filtering and pagination
    const { search, category, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]; // Case insensitive search in both name and description
    }

    // Add category filtering
    if (category) {
      query.category = category;
    }

    const products = await productModel
      .find(query)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination info
    const total = await productModel.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching products" });
  }
};

// remove product item
const removeProduct = async (req, res) => {
  try {
    // Validate product ID
    if (!req.body.id) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const product = await productModel.findById(req.body.id);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      // Secure file path construction to prevent directory traversal
      const imagePath = path.join(process.cwd(), 'uploads', product.image);

      // Check if file exists and delete it securely
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      await productModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Product Removed" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing product" });
  }
};

export { addProduct, listProducts, removeProduct };
