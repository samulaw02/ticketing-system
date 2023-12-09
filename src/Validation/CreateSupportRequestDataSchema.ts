import { object, string, z } from "zod";

const createSupportRequestDataSchema = object({
    title: string().min(2),
    description: string().min(2),
});


export default createSupportRequestDataSchema;