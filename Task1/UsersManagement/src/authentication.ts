import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

const SECRET = "farheen";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let authHeader = req.headers.authorization;

    let token: string;

    if (authHeader) 
    {
        token = authHeader.trim();
    } 
    else 
    {
        return res.status(401).json({ message: "Authorization token is missing" });
    }

    try {
        const decoded: any = jwt.verify(token, SECRET);
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ id: decoded.id });

        if (user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ message: "Token expired due to new login" });
        }

        (req as any).user = decoded;
        next();
    } 
    
    catch (error) 
    {
        res.status(401).json({ message: "Invalid token" });
    }
};
