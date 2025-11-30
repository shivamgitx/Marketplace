import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";

// add items to user cart
const addToCart = async (req, res) => {
  try {
    // Validate inputs
    const { userId, itemId } = req.body;
    if (!userId || !itemId) {
      return res.json({ success: false, message: "User ID and Item ID are required" });
    }

    // For our implementation, we'll allow both ObjectIds and numeric IDs from frontend
    // Check if userId is a valid ObjectId or a numeric string
    const isUserIdValid = mongoose.Types.ObjectId.isValid(userId) || (!isNaN(userId) && Number(userId) > 0);
    const isItemIdValid = mongoose.Types.ObjectId.isValid(itemId) || (!isNaN(itemId) && Number(itemId) > 0);

    if (!isUserIdValid || !isItemIdValid) {
      return res.json({ success: false, message: "Invalid User ID or Item ID format" });
    }

    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if product exists (using both ObjectId and string comparison)
    let product = await productModel.findById(itemId);
    if (!product) {
      // Try to find by string ID as well
      product = await productModel.findOne({ _id: itemId });
    }

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    let cartData = userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    // Update cart data
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding to cart" });
  }
};

// remove from cart
const removeFromCart = async (req, res) => {
  try {
    // Validate inputs
    const { userId, itemId } = req.body;
    if (!userId || !itemId) {
      return res.json({ success: false, message: "User ID and Item ID are required" });
    }

    // For our implementation, we'll allow both ObjectIds and numeric IDs from frontend
    // Check if userId is a valid ObjectId or a numeric string
    const isUserIdValid = mongoose.Types.ObjectId.isValid(userId) || (!isNaN(userId) && Number(userId) > 0);
    const isItemIdValid = mongoose.Types.ObjectId.isValid(itemId) || (!isNaN(itemId) && Number(itemId) > 0);

    if (!isUserIdValid || !isItemIdValid) {
      return res.json({ success: false, message: "Invalid User ID or Item ID format" });
    }

    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if product exists (using both ObjectId and string comparison)
    let product = await productModel.findById(itemId);
    if (!product) {
      // Try to find by string ID as well
      product = await productModel.findOne({ _id: itemId });
    }

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    let cartData = userData.cartData;
    if (cartData[req.body.itemId]) {
      if (cartData[req.body.itemId] > 1) {
        cartData[req.body.itemId] -= 1;
      } else {
        delete cartData[req.body.itemId];
      }

      // Update cart data
      await userModel.findByIdAndUpdate(userId, { cartData });
      res.json({ success: true, message: "Removed from Cart" });
    } else {
      res.json({ success: false, message: "Item not in cart" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing from cart" });
  }
};

// fetch user cart data
const getCart = async (req, res) => {
  try {
    // Validate userId
    const { userId } = req.body;
    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // For our implementation, we'll allow both ObjectIds and numeric IDs from frontend
    // Check if userId is a valid ObjectId or a numeric string
    const isUserIdValid = mongoose.Types.ObjectId.isValid(userId) || (!isNaN(userId) && Number(userId) > 0);

    if (!isUserIdValid) {
      return res.json({ success: false, message: "Invalid User ID format" });
    }

    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData;
    res.json({ success: true, cartData: cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching cart data" });
  }
};

export { addToCart, removeFromCart, getCart };
