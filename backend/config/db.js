import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");
  } catch (error) {
    console.error("Database connection error:", error);
    console.log("Server started without database connection. Some features may not work.");
  }
};
