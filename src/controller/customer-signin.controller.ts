import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { client, logger } from '../config';

/**
 * @description: Sign in a user
 * @param req { email: string, password: string }
 * @param res 
 * @returns The email and username of the user if the sign in is successful, otherwise an error message
 */
const customerSignin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email: string, password: string };
        const query = `SELECT * FROM users WHERE email = $1`;
        const values = [email];
        const userResponse = await client.query(query, values);
        if (userResponse.rowCount === 0) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const user = userResponse.rows[0];
        const hashedPassword = user.password as string;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const userEmail = user.email as string;
        const userName = user.username as string;
        res.status(200).json({ email: userEmail, username: userName });
    } catch (error) {
        console.error(error);
        logger.error(error);
        res.status(500).json({ error: "Failed to sign in" });
    }
}

export default customerSignin;