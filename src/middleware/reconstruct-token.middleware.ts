import { logger } from "config";
import { NextFunction, Request, Response } from "express";

/**
 * @description Reconstruct the token from the two cookies
 * @param req 
 * @param res 
 * @param next 
 */
const reconstructToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token1 = req.cookies.token1 || "";
        const token2 = req.cookies.token2 || "";
        const token = token1 + token2;

        req.headers.authorization = `Bearer ${token}`;
        next();
    } catch (error) {
        console.log(error);
        logger.error({
            endpoint: req.originalUrl,
            error,
            message: "Failed to reconstruct token",
            createdAt: new Date().toISOString()
        });
        res.status(401).json({ error: "Unauthorized" });
    }
};

export default reconstructToken;