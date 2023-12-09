import { Document } from "mongoose";

export interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "customer" | "support_agent" | "admin";
}