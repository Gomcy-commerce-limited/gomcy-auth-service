import { logger } from "config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * @description Verify the token from the request headers.
 *  Decode the token and get the shopId and timeLoggedIn
 * @param req 
 * @param res 
 * @param next 
 */
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new Error("No token provided");
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '');
        if (typeof decodedToken !== "object") {
            throw new Error("Invalid token");
        }
        req.body = {
            ...req.body,
            ...decodedToken
        };
        next();
    } catch (error) {
        console.log(error);
        logger.error({
            endpoint: req.originalUrl,
            error,
            message: "Failed to verify token",
            createdAt: new Date().toISOString()
        });
        res.status(401).json({ error: "Unauthorized" });
    }
};

export default verifyToken;