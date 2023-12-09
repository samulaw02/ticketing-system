import mongoose, { model, Schema } from "mongoose";
import { SupportRequestDocument } from "../Interfaces/SupportRequestInterface";
import { SupportRequestStatus } from "../Utils/SupportRequestStatus";


const supportRequestSchema = new Schema<SupportRequestDocument>({
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    supportAgentId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    status: {
        type: String,
        enum: Object.values(SupportRequestStatus),
        default: SupportRequestStatus.Open,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    },
    { timestamps: true }
);

const SupportRequest = model<SupportRequestDocument>("SupportRequest", supportRequestSchema);

export default SupportRequest;
