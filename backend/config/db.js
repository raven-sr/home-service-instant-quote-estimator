
const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!mongoURI) {
    throw new Error("MONGO_URI or MONGO_URL is missing.");
  }

  try {
    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");

    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
