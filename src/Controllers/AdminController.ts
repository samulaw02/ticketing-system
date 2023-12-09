import { Request, Response } from "express";
import SupportRequestService from "../Services/SupportRequestService";
import CommentService from "../Services/CommentService";
import { SupportRequestDocument } from "../Interfaces/SupportRequestInterface";
import updateSupportRequestDataSchema from "../Validation/UpdateSupportRequestDataSchema";
import commentDataSchema from "../Validation/CommentDataSchema"
import { CommentDocument } from "../Interfaces/CommentInterface";


export default class AdminController {

    static async getAllSupportRequests(req: Request, res: Response): Promise<void> {
        try {
            const response = await SupportRequestService.getAllSupportRequests(req);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error("Error in fetching all support requests :", error);
            res.status(500).json({ status: false, message: "Failed to fetch all support requests" });
        }
    }

    static async getSupportRequestById(req: Request, res: Response) {
        try {
            const supportRequestId: string = req.params.id;
            const response = await SupportRequestService.getSupportRequestWithComments(supportRequestId);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error('Error fetching support request:', error);
            res.status(500).json({ status: false, message: 'Failed to support ticket' });
        }
    }

    static async updateSupportRequest(req: Request, res: Response) {
        try {
            const supportRequestId: string = req.params.id;
            const supportRequestData = updateSupportRequestDataSchema.parse(req.body) as SupportRequestDocument;
            const response = await SupportRequestService.updateSupportRequest(supportRequestId, supportRequestData);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error('Error fetching support request:', error);
            res.status(500).json({ status: false, message: 'Failed to update support request' });
        }
    }

    static async deleteSupportRequest(req: Request, res: Response) {
        try {
            const supportRequestId: string = req.params.id;
            const response = await SupportRequestService.deleteSupportRequest(supportRequestId);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error('Error deleting support request:', error);
            res.status(500).json({ status: false, message: 'Failed to delete support request' });
        }
    }

    static async getCommentsBySupportRequestId(req: Request, res: Response) {
        try {   
            const supportRequestId: string = req.params.supportRequestId;
            const response = await CommentService.getCommentsByRequestId(supportRequestId);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error('Error fetching comment:', error);
            res.status(500).json({ status: false, message: 'Failed to fetch comment' });
        }
    }


    static async updateComment(req: Request, res: Response) {
        try {
            const commentId: string = req.params.id;
            const commentData = commentDataSchema.parse(req.body) as CommentDocument
            const response = await CommentService.updateComment(commentId, commentData);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error('Error updating comment:', error);
            res.status(500).json({ status: false, message: 'Failed to update comment' });
        }
    }


    static async deleteComment(req: Request, res: Response) {
        try {   
            const commentId: string = req.params.id;
            const response = await CommentService.deleteComment(commentId);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({ status: false, message: 'Failed to delete comment' });
        }
    }

}