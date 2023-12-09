import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import Comment from "../Models/Comment";
import SupportRequest from "../Models/SupportRequest";
import { JSONResponseInterface } from "../Interfaces/JSONResponseInterface";
import { CommentDocument } from "../Interfaces/CommentInterface";




export default class CommentService {
    static async getAllComments(requestId: string, page: number, limit: number): Promise<JSONResponseInterface> {
        try {
            const skip = (page - 1) * limit;
            const comments = await Comment.find({requestId: new ObjectId(requestId) })
            .sort({ createdAt: -1 })
            .skip(skip).limit(limit);
            return { status: true, code: 200, data: comments };
        } catch (error) {
            console.error('Error fetching comments:', error);
            return { status: false, code: 500, error: 'Failed to fetch comments' };
        }
    }

    static async getCommentById(commentId: string): Promise<JSONResponseInterface> {
        try {
            const comment = await Comment.findById(new ObjectId(commentId));
            if (!comment) {
                return { status: false, code: 404, error: 'Comment not found' };
            }
            return { status: true, code: 200, data: comment };
        } catch (error) {
            console.error('Error fetching comment:', error);
            return { status: false, code: 500, error: 'Failed to fetch comment' };
        }
    }

    static async createCommentAsCustomer(commentData: CommentDocument, supportRequestId: string): Promise<JSONResponseInterface> {
        try {
            // check if support request id is valid
            const supportRequest = await SupportRequest.findById(new ObjectId(supportRequestId));
            if (!supportRequest) {
                return { status: false, code: 404, error: 'Invalid support request id' };
            }
            const userId = commentData.userId;

            // check if the customer is associated to the support request
            const supportRequestCustomerId = supportRequest.customerId.equals(userId)
            if (!supportRequestCustomerId) {
                return { status: false, code: 422, error: 'Customer is not associated with this support request' };
            }

            // check if the support request is closed
            const supportRequestStatus = supportRequest.status === "closed"
            if (supportRequestStatus) {
                return { status: false, code: 422, error: 'Support request is closed' };
            }

            // Check if a support agent has commented on the ticket
            const isCommentable = await CommentService.isTicketCommentable(supportRequestId, new ObjectId(userId));
            if (!isCommentable) {
                return { status: false, code: 422, error: 'Ticket is not commentable by a customer' };
            }

            commentData.requestId = new ObjectId(supportRequestId);
            const newComment = new Comment(commentData);
            const savedComment = await newComment.save();
            if (savedComment) {
                return { status: true, code: 201, data: savedComment};
            }
            return { status: false, code: 404, error: 'Support request id not found' };
        } catch (error) {
            console.log(`Error creating support ticket: ${error}`);
            return { status: false, code: 500, error: `Error creating comment due to: ${error}` };
        }
    }


    static async isTicketCommentable(supportRequestId: string, userId: ObjectId): Promise<boolean> {
        try {
            const lastComment = await Comment.findOne({ requestId: new ObjectId(supportRequestId) }).sort({ createdAt: -1 });
            // No previous comment found
            if (!lastComment) {
                return false;
            }
            // Check if the last comment was made by the current user
            const lastCommentByCurrentUser = lastComment.userId.equals(userId);
            // Return true only if the last comment wasn't made by the current user
            return !lastCommentByCurrentUser;
        } catch (error) {
            console.error(`Error checking ticket commentability: ${error}`);
            return false;
        }
      }


    static async createCommentAsSupportAgent(commentData: CommentDocument, supportRequestId: string): Promise<JSONResponseInterface> {
        try {
            // check if support request id is valid
            const supportRequest = await SupportRequest.findById(new ObjectId(supportRequestId));
            if (!supportRequest) {
                return { status: false, code: 404, error: 'Invalid support request id' };
            }
            // check if support request status is not closed
            // check if the support request is closed
            const supportRequestStatus = supportRequest.status === "closed"
            if (supportRequestStatus) {
                return { status: false, code: 422, error: 'Support request is closed' };
            }
            const userId = commentData.userId;
            const isSupportRequestAssigned = await SupportRequest.findOne(
                { _id: new ObjectId(supportRequestId), supportAgentId: { $exists: true } }
            );
            if (!isSupportRequestAssigned) {
                // Assign the support request to the current support agent and update the status
                await SupportRequest.findByIdAndUpdate(
                    new ObjectId(supportRequestId),
                    { supportAgentId: userId, status: 'in_progress' }
                );
            }
            // Create the comment
            commentData.requestId = new ObjectId(supportRequestId);
            const newComment = new Comment(commentData);
            const savedComment = await newComment.save();
            if (savedComment) {
                return { status: true, code: 201, data: savedComment };
            }
            return { status: false, code: 404, error: 'Support request id not found' };
        } catch (error) {
            console.log(`Error creating support ticket: ${error}`);
            return { status: false, code: 500, error: `Error creating comment due to: ${error}` };
        }
    }


    static async updateComment(commentId: string, commentData: Partial<CommentDocument>): Promise<JSONResponseInterface> {
        try {
            const updatedComment = await Comment.findByIdAndUpdate(new ObjectId(commentId), commentData, { new: true });
            if (!updatedComment) {
                return { status: false, code: 422, error: 'Unable to update comment' };
            }
            return { status: true, code: 200, data: updatedComment};
        } catch (error) {
            console.log(`Error updating comment: ${error}`);
            return { status: false, code: 500, error: `Error updating comment: ${error}` };
        }
    }

    static async deleteComment(commentId: string) {
        try {
            const deletedComment = await Comment.findByIdAndDelete(new ObjectId(commentId));
            if (deletedComment) {
                return { status: true, code: 200, message: 'Comment deleted successfully' };
            } else {
                return { status: false, code: 404, error: 'Comment not found' };
            }
        } catch (error) {
            console.log(`Error deleting comment: ${error}`);
            return { status: false, code: 500, error: `Error deleting comment: ${error}` };
        }
    }

    static async getCommentsByRequestId(requestSupportId: string): Promise<JSONResponseInterface> {
        try {
            // check if support request id is valid
            const supportRequest = await SupportRequest.findById(new ObjectId(requestSupportId));
            if (!supportRequest) {
                return { status: false, code: 404, error: 'Invalid support request id' };
            }
            const comments = await Comment.find({ requestId : new ObjectId(requestSupportId) })
            return { status: true, code: 200, data: comments };
        } catch (error) {
            console.log(`Error deleting comment: ${error}`);
            return { status: false, code: 500, error: `Error deleting comment: ${error}` };
        }
    }   
}