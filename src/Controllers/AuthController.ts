import { Request, Response } from "express";
import { UserDocument } from "../Interfaces/UserInterface";
import AuthService from "../Services/AuthService";
import userValidationSchema from "../Validation/UserDataSchema";


export default class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = userValidationSchema.parse(req.body) as UserDocument;
            const response = await AuthService.registerUser(validatedData);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            if (!response.status) {
                res.status(code).json(responseData);
            } else {
                res.status(code).json(responseData);
            }
        } catch (error) {
            console.error("Error in user registration:", error);
            res.status(500).json({ status: false, message: "Failed to register user" });
        }

    }


    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            // Call the login service method
            const response = await AuthService.loginUser(email, password);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            if (!response.status) {
                res.status(response.code).json(responseData);
            } else {
                res.status(response.code).json(responseData);
            }
        } catch (error) {
            console.error("Error in user login:", error);
            res.status(500).json({ status: false, message: "Failed to log in" });
        }
    }


    static async exchangeRefreshToken(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;
            const response = await AuthService.exchangeRefreshToken(refreshToken);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            if (!response.status) {
                res.status(code).json(responseData);
            } else {
                res.status(code).json(responseData);
            }
        } catch (error) {
            console.error('Error exchanging refresh token:', error);
            res.status(500).json({ error: 'Failed to exchange refresh token' });
        }
    }
}
