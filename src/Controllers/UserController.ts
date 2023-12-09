import { Request, Response } from "express";
import UserService from "../Services/UserService";
import { UserDocument } from "../Interfaces/UserInterface";
import userValidationSchema from "../Validation/UserDataSchema";


export default class UserController {
    static async getAllUsers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 10;
            const userId = req.body.user._id
            const response = await UserService.getAllUsers(page, limit, userId);
            // Modify the response to omit the 'code' property
            const { code, ...responseData } = response;
            res.status(response.code).json(responseData);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ status: false, message: 'Failed to fetch users' });
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const response = await UserService.getUserById(userId);
            const { code, ...responseData } = response;
            res.status(code).json(responseData);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ status: false, message: 'Failed to fetch user' });
        }
    }

    static async createUser(req: Request, res: Response) {
        try {
            const validatedData = userValidationSchema.parse(req.body) as UserDocument;
            const response = await UserService.createUser(validatedData);
            const { code, ...responseData } = response;
            res.status(code).json(responseData);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const userData: Partial<UserDocument> = req.body;
            // Exclude password field from the update data
            if ('password' in userData) {
                res.status(419).json({ status: false, error: 'Password cannot be updated' });
            }
            const response = await UserService.updateUser(userId, userData);
            const { code, ...responseData } = response;
            res.status(code).json(responseData);
        } catch (error) {
            res.status(500).json({status: false, error: 'Failed to update user' });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const userId = req.params.id
            const response = await UserService.deleteUser(userId);
            const { code, ...responseData } = response;
            res.status(code).json(responseData);
        } catch (error) {
            console.error('Error deleting user:', error);
            return { status: false, code: 500, error: 'Failed to delete user' };
        }
    }
}