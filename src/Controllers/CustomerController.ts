import { Request, Response } from "express";
import SupportRequestService from "../Services/SupportRequestService";
import { SupportRequestDocument } from "../Interfaces/SupportRequestInterface";
import createSupportRequestDataSchema from "../Validation/CreateSupportRequestDataSchema";
import { CommentDocument } from "../Interfaces/CommentInterface";
import commentDataSchema from "../Validation/CommentDataSchema";
import CommentService from "../Services/CommentService";


export default class CustomerController {
    static async getAllSupportRequests(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 10;
            const userId = req.body.user._id
            const response = await SupportRequestService.getAllSupportRequestsForCustomer(page, limit, userId);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            res.status(500).json({ status: false, message: 'Failed to fetch tickets' });
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
            console.error('Error fetching support ticket:', error);
            res.status(500).json({ status: false, message: 'Failed to fetch ticket' });
        }
    }

    static async createSupportRequest(req: Request, res: Response) {
        try {
            const validatedData = createSupportRequestDataSchema.parse(req.body) as SupportRequestDocument;
            validatedData.customerId = req.body.user._id;
            const response = await SupportRequestService.createSupportRequest(validatedData);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error('Error fetching support ticket:', error);
            res.status(500).json({ status: false, message: 'Failed to fetch ticket' });
        }
    }


    static async createComment(req: Request, res: Response) {
        try {
            const supportRequestId = req.params.supportRequestId;
            const validatedData = commentDataSchema.parse(req.body) as CommentDocument;
            validatedData.userId = req.body.user._id;
            const response = await CommentService.createCommentAsCustomer(validatedData, supportRequestId);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error('Error fetching support ticket:', error);
            res.status(500).json({ status: false, message: `Failed to create comment due to ${error}` });
        }
    }
}