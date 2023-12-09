import { object, string } from "zod";

const userValidationSchema = object({
    firstName: string().min(2),
    lastName: string().min(2),
    email: string().email(),
    password: string().min(5).min(5),
    role: string(),
});


export default userValidationSchema;