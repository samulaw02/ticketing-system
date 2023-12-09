import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ACCESS_TOKEN_SECRET } from '../jwtConfig';
import User from '../Models/User';


export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ status: false, error: 'Unauthorized' });
        }
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err: any, decoded: any) => {
            if (err) {
                return res.status(403).json({ status: false, message: 'Failed to authenticate token' });
            }
            const userId: string = decoded.userId;
            User.findById(userId)
                .then((user) => {
                    if (!user) {
                        return res.status(404).json({ status: false, error: 'User not found' });
                    }
                    // Attach the user object to req.body.user
                    req.body.user = user;
                    next();
                })
                .catch((error) => {
                    return res.status(500).json({ status: false, error: `Failed to fetch user: ${error}` });
                });
        });
    } catch (err) {
        return res.status(403).json({ status: false, message: `Failed to authenticate token due to ${err}` });
    }
};