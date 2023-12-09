import mongoose from "mongoose";
import Document from "mongoose";
import { SupportRequestStatus } from "../Utils/SupportRequestStatus";


export interface SupportRequestDocument extends Document {
    customerId: mongoose.Types.ObjectId;
    supportAgentId: mongoose.Types.ObjectId;
    status: SupportRequestStatus;
    title: string;
    description: string;
}
