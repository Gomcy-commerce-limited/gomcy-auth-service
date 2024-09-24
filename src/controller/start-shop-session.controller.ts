import { client, logger } from 'config';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { generateToken } from 'utils';

/**
 * @description Sign in a shop
 *      1. Validate the request body
 *      2. Get the shopId and password from the request body
 *      3. Generate a token with the shopId and timeLoggedIn
 *      4. Set the token in cookies
 *      5. Log the shop in the database
 * @param req { shopId: string, password: string }
 * @param res 
 */
const startShopSession = async (req: Request, res: Response) => {
    try {
        const validateRes = validationResult(req);
        if (!validateRes.isEmpty()) {
            console.error(validateRes.array().map((error) => error.msg).join(", "));
            throw new Error(validateRes.array().map((error) => error.msg).join(", "));
        }
        const { shopId, isVerified } = req.body as { shopId: string, isVerified: boolean };
        const timeLoggedIn = new Date().toISOString();
        const query = `INSERT INTO shops (time_logged_in) VALUES $1 WHERE id = $2`;
        const values = [timeLoggedIn, shopId];
        await client.query(query, values);

        const token = generateToken({ shopId, timeLoggedIn, isVerified });
        const cookies1 = token.slice(0, token.length / 2);
        const cookies2 = token.slice(token.length / 2);

        res.cookie("cookies1", cookies1, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000, // 1 hour
        });
        res.cookie("cookies2", cookies2, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000, 
        });

        logger.info({
            endpoint: req.originalUrl,
            message: `Shop ${shopId} signed in at ${timeLoggedIn}`,
            createdAt: new Date().toISOString()
        });

        res.status(200).json({ message: "Shop signed in" });
    } catch (error) {
        console.error(`Error: ${error}`);
        logger.error({
            endpoint: req.originalUrl,
            error,
            createdAt: new Date().toISOString()
        });
        res.status(500).json({ error: "Failed to sign in" });
    }
}

export default startShopSession;