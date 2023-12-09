import mongoose from "mongoose";

const connectDB = async (uri: string) => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDB;
