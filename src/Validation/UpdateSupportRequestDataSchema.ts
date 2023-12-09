import { object, string, z } from "zod";
import { SupportRequestStatus } from "../Utils/SupportRequestStatus";

const updateSupportRequestDataSchema = object({
    customerId: z.any().optional(),
    supportAgentId: z.any().optional(),
    status: z.enum([
        SupportRequestStatus.Open,
        SupportRequestStatus.Closed,
        SupportRequestStatus.InProgress,
    ]).optional(),
    title: string().optional(),
    description: string().optional(),
});

export default updateSupportRequestDataSchema ;