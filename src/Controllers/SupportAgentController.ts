import { Request, Response } from "express";
import SupportRequestService from "../Services/SupportRequestService";
import commentDataSchema from "../Validation/CommentDataSchema";
import { CommentDocument } from "../Interfaces/CommentInterface";
import CommentService from "../Services/CommentService";
import { ObjectId } from "mongoose";


export default class SupportAgentController {
    static async getAllSupportRequests(req: Request, res: Response) {
        try {
            const response = await SupportRequestService.getAllSupportRequests(req);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error('Error fetching support requests:', error);
            res.status(500).json({ status: false, message: 'Failed to fetch support requests' });
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
            res.status(500).json({ status: false, message: 'Failed to fetch support request' });
        }
    }

    static async updateSupportRequestStatus(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const newStatus  = req.body.status;
            const agentId = req.body.user._id;
            const response = await SupportRequestService.updateStatus(id, agentId, newStatus);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error('Error updating support request status:', error);
            res.status(500).json({ status: false, message: 'Failed to update support request status' });
        }
    }

    static async createComment(req: Request, res: Response) {
        try {
            const supportRequestId = req.params.supportRequestId;
            const validatedData = commentDataSchema.parse(req.body) as CommentDocument;
            validatedData.userId = req.body.user._id;
            const response = await CommentService.createCommentAsSupportAgent(validatedData, supportRequestId);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error('Error creating comment:', error);
            res.status(500).json({ status: false, message: `Failed to create comment due to ${error}` });
        }
    }
}