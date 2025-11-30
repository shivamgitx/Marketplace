import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "https://jharkhand-marketplace-frontend.onrender.com";
  try {
    // Validate inputs
    const { userId, items, amount, address } = req.body;
    if (!userId || !items || !amount || !address) {
      return res.json({ success: false, message: "All order fields are required" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: "Invalid User ID format" });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "Items must be a non-empty array" });
    }

    // Validate each item
    for (const item of items) {
      if (!item.name || !item.price || !item.quantity || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        return res.json({ success: false, message: "Each item must have name, price, and quantity" });
      }
    }

    // Validate amount is a positive number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.json({ success: false, message: "Invalid order amount" });
    }

    // Verify user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const newOrder = new orderModel({
      userId: userId,
      items: items,
      amount: parsedAmount,
      address: address,
    });
    await newOrder.save();

    // Clear user's cart after successful order creation
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Ensure proper rounding
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    // If order was created but Stripe checkout failed, we should delete the order
    if (newOrder && newOrder._id) {
      try {
        await orderModel.findByIdAndDelete(newOrder._id);
      } catch (deleteError) {
        console.log("Error deleting order after Stripe failure:", deleteError);
      }
    }

    // Send appropriate error response based on the type of error
    if (error.type === 'StripeCardError') {
      res.json({ success: false, message: error.message || "Payment processing error" });
    } else {
      res.json({ success: false, message: "Payment processing error" });
    }
  }
};

const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    // Validate inputs
    if (!orderId || success === undefined) {
      return res.json({ success: false, message: "Order ID and success status are required" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.json({ success: false, message: "Invalid Order ID format" });
    }

    // Validate success parameter
    if (success !== "true" && success !== "false") {
      return res.json({ success: false, message: "Invalid success status" });
    }

    if (success === "true") {
      // Update order payment status
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true } // Return updated document
      );

      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }

      res.json({ success: true, message: "Paid" });
    } else {
      // Find order first to check if it exists
      const order = await orderModel.findById(orderId);
      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }

      // Check if payment was already processed
      if (order.payment) {
        return res.json({ success: false, message: "Order already paid" });
      }

      // Delete the order
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error verifying order" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    // Validate userId
    const { userId } = req.body;
    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: "Invalid User ID format" });
    }

    // Verify user exists (optional - can be skipped for performance if auth middleware already validates)
    // const user = await userModel.findById(userId);
    // if (!user) {
    //   return res.json({ success: false, message: "User not found" });
    // }

    const orders = await orderModel.find({ userId: userId }).sort({ date: -1 }); // Sort by date descending
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    // Validate userId
    const { userId } = req.body;
    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: "Invalid User ID format" });
    }

    let userData = await userModel.findById(userId);
    if (userData && userData.role === "admin") {
      // Add pagination support
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const orders = await orderModel
        .find({})
        .sort({ date: -1 }) // Sort by date descending
        .skip(skip)
        .limit(limit);

      // Get total count for pagination info
      const total = await orderModel.countDocuments({});

      res.json({
        success: true,
        data: orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    // Validate inputs
    const { userId, orderId, status } = req.body;
    if (!userId || !orderId || !status) {
      return res.json({ success: false, message: "User ID, Order ID, and Status are required" });
    }

    // Validate ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.json({ success: false, message: "Invalid User ID or Order ID format" });
    }

    // Validate allowed status values
    const allowedStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { status: status },
        { new: true } // Return updated document
      );

      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }

      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating order status" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
