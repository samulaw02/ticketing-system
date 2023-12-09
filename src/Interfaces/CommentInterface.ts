import mongoose from "mongoose";
import Document from "mongoose";

export interface CommentDocument extends Document {
    requestId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    content: string;
}
