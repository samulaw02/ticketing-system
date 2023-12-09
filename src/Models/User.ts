import { Schema, model } from "mongoose";
import { UserDocument } from "../Interfaces/UserInterface";

const userSchema = new Schema<UserDocument>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: ["customer", "support_agent", "admin"], required: true },
    },
    { timestamps: true }
);

const User = model<UserDocument>("User", userSchema);

export default User;
