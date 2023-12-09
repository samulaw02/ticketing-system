import mongoose, { Schema } from "mongoose";
import { CommentDocument } from "../Interfaces/CommentInterface";

const commentSchema = new Schema<CommentDocument>({
    requestId: { type: Schema.Types.ObjectId, ref: "SupportRequest", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    },
    { timestamps: true }
);

const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);

export default Comment;
