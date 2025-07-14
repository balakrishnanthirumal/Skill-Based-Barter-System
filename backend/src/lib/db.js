import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to mongoDB `);
  } catch (error) {
    console.log("Failed to connect to dmongoDB", error);
    process.exit(1);
  }
};

export default connectDB;
