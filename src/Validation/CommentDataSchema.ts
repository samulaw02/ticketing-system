import { object, string, Schema } from "zod";

const commentDataSchema = object({
    content: string().min(1)
});


export default commentDataSchema;