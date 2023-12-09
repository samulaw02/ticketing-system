import { ObjectId } from "mongodb";
import SupportRequest from "../Models/SupportRequest";
import Comment from "../Models/Comment";
import { JSONResponseInterface } from "../Interfaces/JSONResponseInterface";
import { SupportRequestDocument } from "../Interfaces/SupportRequestInterface";
import { SupportRequestStatus } from "../Utils/SupportRequestStatus";
import supportRequestDataSchema  from "../Validation/CreateSupportRequestDataSchema";


export default class SupportRequestService {
    static async getAllSupportRequestsForCustomer(page: number, limit: number, userId: string): Promise<JSONResponseInterface> {
        try {
            const skip = (page - 1) * limit;
            const supportRequests = await SupportRequest.find({customerId: new ObjectId(userId)})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            if (supportRequests) {
                return { status: true, code: 200, data: supportRequests };
            }
            return { status: false, code: 404, error: 'Support request not found' };
        } catch (error) {
            console.error('Error fetching support requests:', error);
            return { status: false, code: 500, error: 'Failed to fetch support requests' };
        }
    }

    static async getAllSupportRequests(req: any): Promise<JSONResponseInterface> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;
            let query: any = {};
            if (req.query.assignee) {
                query = { ...query, supportAgentId: new ObjectId(req.query.assignee) };
            }
            if (req.query.status) {
                query = { ...query, status: req.query.status };
            }
            const supportRequests = await SupportRequest.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            return { status: true, code: 200, data: supportRequests };
        } catch (error) {
            console.error('Error fetching support requests:', error);
            return { status: false, code: 500, error: 'Failed to fetch support requests' };
        }
    }
    
    static async getSupportRequestWithComments(supportRequestId: string): Promise<JSONResponseInterface> {
        try {
            const supportRequest = await SupportRequest.findById(new ObjectId(supportRequestId));
            if (!supportRequest) {
                return { status: false, code: 404, error: 'Support request not found' };
            }
            const comments = await Comment.find({ requestId: new ObjectId(supportRequestId) });
            // Convert supportRequest and comments to plain JavaScript objects
            const supportRequestData = supportRequest.toObject();
            const commentsData = comments.map(comment => comment.toObject());
            // Nest comments inside supportRequestData under the 'comments' key
            const supportRequestWithComments = {
                ...supportRequestData,
                comments: commentsData,
            } as typeof supportRequestData & { comments: typeof commentsData };
            return { status: true, code: 200, data: supportRequestWithComments };
        } catch (error) {
            console.error('Error fetching support request with comments:', error);
            return { status: false, code: 500, error: `Failed to fetch support request with comments due to ${error}` };
        }
    }

    static async createSupportRequest(supportRequestData: SupportRequestDocument): Promise<JSONResponseInterface> {
        try {
            const newSupportRequest = new SupportRequest(supportRequestData);
            const savedSupportRequest = await newSupportRequest.save();
            if (savedSupportRequest) {
                return { status: true, code: 201, data: savedSupportRequest};
            }
            return { status: false, code: 500, error: 'Unable to create support request' };
        } catch (error) {
            console.log(`Error creating support ticket: ${error}`);
            return { status: false, code: 500, error: `Error creating support ticket: ${error}` };
        }
    }

    static async updateSupportRequest(supportRequestId: string, supportRequestData: SupportRequestDocument): Promise<JSONResponseInterface> {
        try {
            const updatedSupportRequest = await SupportRequest.findByIdAndUpdate(new ObjectId(supportRequestId), supportRequestData, { new: true });
            if (!updatedSupportRequest) {
                return { status: false, code: 404, error: 'Wrong support request id' };
            }
            return { status: true, code: 201, data: updatedSupportRequest};
        } catch (error) {
            console.log(`Error updating support ticket: ${error}`);
            return { status: false, code: 500, error: `Error updating support ticket: ${error}` };
        }
    }

    static async deleteSupportRequest(supportRequestId: string) {
        try {
            // Find and delete associated comments
            const deletedComments = await Comment.deleteMany({ requestId: new ObjectId(supportRequestId) });
            // Find and delete the support request
            const deletedSupportRequest = await SupportRequest.findByIdAndDelete(new ObjectId(supportRequestId));
            if (deletedSupportRequest) {
                return { status: true, code: 200, message: 'Support request deleted successfully' };
            } else {
                return { status: false, code: 404, error: 'Support request not found' };
            }
        } catch (error) {
            console.log(`Error deleting support request: ${error}`);
            return { status: false, code: 500, error: `Error deleting support request: ${error}` };
        }
    }

    static async updateStatus(id:string, agentId: ObjectId, newStatus:any): Promise<JSONResponseInterface> {
        try {
            const supportRequest = await SupportRequest.findById(new ObjectId(id));
            //check if support request id is valid
            if (!supportRequest) {
                return { status: false, code: 404, error: 'Support request not found' };
            }
            const supportRequestAssignee = supportRequest.supportAgentId.equals(agentId) 
            //check if agent is the the righful assignee to the request
            if (!supportRequestAssignee) {
                return { status: false, code: 401, error: 'Agent cannot updated the support request' };
            }
            // Ensure the newStatus matches the predefined status options
            if (!Object.values(SupportRequestStatus).includes(newStatus)) {
                return { status: false, code: 400, error: 'Invalid status provided' };
            }
            //update the status of support request
            supportRequest.status = newStatus;
            await supportRequest.save();
            return { status: true, code: 200, data: supportRequest };
        } catch (error) {
            console.error('Error updating support requests status:', error);
            return { status: false, code: 500, error: 'Failed to update support requests status' };
        }
    }
    
}