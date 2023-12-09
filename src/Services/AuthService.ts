import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserDocument } from "../Interfaces/UserInterface";
import User from "../Models/User";
import { JSONResponseInterface } from "../Interfaces/JSONResponseInterface";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "../jwtConfig";


export default class AuthService {
    static generateAccessToken = (userId: string): string => {
        const accessTokenSecret = ACCESS_TOKEN_SECRET;
        const options: SignOptions = {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        };
        return jwt.sign({ userId }, accessTokenSecret, options);
    };

    static generateRefreshToken = (userId: string): string => {
        const refreshTokenSecret = REFRESH_TOKEN_SECRET;
        const options: SignOptions = {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN
        };
        return jwt.sign({ userId }, refreshTokenSecret, options);
    };


    static formatTokenUnixTimestamp = (tokenExpiration: any ) => {
        const expirationDate = new Date(tokenExpiration * 1000);
        return expirationDate.toISOString();
    }

    static async registerUser(userData: UserDocument): Promise<JSONResponseInterface> {
        try {
            // Check if the email already exists in the database
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                return { status: false, code: 409, error: "Email already exists" };
            }
            // Hash the password before saving it to the database
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;
            // Create a new user with the provided data
            const newUser = new User(userData);
            await newUser.save();
            // Convert the ObjectId to string for generating tokens
            const userIdString = newUser._id.toString();
            // Generate access and refresh tokens
            const accessToken = AuthService.generateAccessToken(userIdString);
            const refreshToken = AuthService.generateRefreshToken(userIdString);
            //Generate access token expiration in human readable form
            const decodedAccessToken: any = jwt.decode(accessToken);
            const accessTokenExpiration = AuthService.formatTokenUnixTimestamp(decodedAccessToken.exp) ?? null;
            return { status: true, code: 201, data: { accessToken, refreshToken, accessTokenExpiration } };
        } catch (error) {
            console.error("Error registering user:", error);
            return { status: false, code: 500, error: `Error registering user: ${error}` };
        }
    }

    static async loginUser(email: string, password: string): Promise<JSONResponseInterface> {
        try {
            // Check if the user exists in the database
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return { status: false, code: 404, error: "User not found" };
            }
            // Check if the provided password matches the stored hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return { status: false, code: 401, error: "Invalid credentials" };
            }
            // Convert the ObjectId to string for generating tokens
            const userIdString = user._id.toString();
            // Generate access and refresh tokens upon successful login
            const accessToken = AuthService.generateAccessToken(userIdString);
            const refreshToken = AuthService.generateRefreshToken(userIdString);
            //Generate access token expiration in human readable form
            const decodedAccessToken: any = jwt.decode(accessToken);
            const accessTokenExpiration = AuthService.formatTokenUnixTimestamp(decodedAccessToken.exp) ?? null;
            return { status: true, code: 200, data: { accessToken, refreshToken, accessTokenExpiration } };
        } catch (error) {
            console.error("Error logging in user:", error);
            return { status: false, code: 500, error: `Error logging in user: ${error}` };
        }
    }

    static async exchangeRefreshToken(refreshToken: string): Promise<JSONResponseInterface> {
        try {
            const decodedRefreshToken: any = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
            // Extract the user ID from the refresh token
            const userId = decodedRefreshToken.userId; 
            // Generate a new access token
            const newAccessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
            // Generate a new refresh token
            const newRefreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
            //Generate Expiration
            const decodedAccessToken: any = jwt.decode(newAccessToken);
            const accessTokenExpiration = AuthService.formatTokenUnixTimestamp(decodedAccessToken.exp) ?? null;
            return { status: true, code: 200, data : {accessToken: newAccessToken, refreshToken: newRefreshToken, accessTokenExpiration:  accessTokenExpiration} };
        } catch (error) {
            return { status: false, code: 401, error: 'Invalid or expired refresh token' };
        }
    }
}