// middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import dotenv from 'dotenv';
dotenv.config();
export const authMiddleware = (req: any, res: any, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized token' });
    }
    
    try {
    const decoded:any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
