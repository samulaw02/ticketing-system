import { Request, Response, NextFunction } from 'express';

export const checkUserRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.body.user.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ status: false, error: 'Forbidden' });
        }
        next();
    };
};