import { ObjectId } from "mongodb";
import User from "../Models/User";
import { JSONResponseInterface } from "../Interfaces/JSONResponseInterface";
import { UserDocument } from "../Interfaces/UserInterface";
import bcrypt from "bcrypt";


export default class UserService {
    static async getAllUsers(page: number, limit: number, userId: string): Promise<JSONResponseInterface> {
        try {
            const skip = (page - 1) * limit;
            const users = await User.find({ _id: { $ne: new ObjectId(userId) } })
            .sort({ createdAt: -1 })
            .skip(skip).limit(limit);
            return { status: true, code: 200, data: users };
        } catch (error) {
            console.error('Error fetching users:', error);
            return { status: false, code: 500, error: 'Failed to fetch users' };
        }
    }

    static async getUserById(userId: string): Promise<JSONResponseInterface> {
        try {
            const user = await User.findById(new ObjectId(userId));
            if (!user) {
                return { status: false, code: 404, error: 'User not found' };
            }
            return { status: true, code: 200, data: user };
        } catch (error) {
            console.error('Error fetching user:', error);
            return { status: false, code: 500, error: 'Failed to fetch user' };
        }
    }

    static async createUser(userData: UserDocument): Promise<JSONResponseInterface> {
        try {
            // Hash the password before saving it to the database
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;
            const newUser = new User(userData);
            const savedUser = await newUser.save();
            if (savedUser) {
                // Omitting the 'password' field from the returned data
                const { password, ...userWithoutPassword } = savedUser.toObject();
                return { status: true, code: 201, data: userWithoutPassword};
            }
            return { status: false, code: 500, error: "Unable to create user"};
        } catch (error) {
            console.log(`Error creating user: ${error}`);
            return { status: false, code: 500, error: `Error creating user: ${error}` };
        }
    }

    static async updateUser(userId: string, userData: Partial<UserDocument>): Promise<JSONResponseInterface> {
        try {
            const updatedUser = await User.findByIdAndUpdate(new ObjectId(userId), userData, { new: true });
            if (updatedUser) {
                return { status: true, code: 201, data: updatedUser};
            }   
            return { status: false, code: 404, error: 'User not found' };
        } catch (error) {
            console.log(`Error updating user: ${error}`);
            return { status: false, code: 500, error: `Error updating user: ${error}` };
        }
    }

    static async deleteUser(userId: string) {
        try {
            const deletedUser = await User.findByIdAndDelete(new ObjectId(userId));
            if (deletedUser) {
                return { status: true, code: 200, message: 'User deleted successfully' };
            } else {
                return { status: false, code: 404, error: 'User not found' };
            }
        } catch (error) {
            console.log(`Error deleting user: ${error}`);
            return { status: false, code: 500, error: `Error deleting user: ${error}` };
        }
    }
}