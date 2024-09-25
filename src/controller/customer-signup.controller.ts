import { client, logger } from "config";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateUniqueUsername } from "utils";

const customerSignup = async (req: Request, res: Response) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            phone_number,
            gender,
            date_of_birth,
        } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ error: "First name, last name, email, username, and password are required" });
        }
        const username = generateUniqueUsername();
        const hashedPassword = await bcrypt.hash(password, 10);

        const userRes = await client.query(`
            INSERT INTO users (
                first_name, last_name, email, username, password, phone_number, gender, date_of_birth
            ) VALUES (
                ${first_name}, ${last_name}, ${email}, ${username}, ${hashedPassword}, ${phone_number}, 
                ${gender}, ${date_of_birth} 
            ) RETURNING  email, username`);

        const user = userRes.rows[0];
        res.status(200).json({ email: user.email, username: user.username });
    } catch (error) {
        console.log(error);
        logger.error({
            endpoint: req.originalUrl,
            error,
            message: "Failed to sign up customer",
            createdAt: new Date().toISOString()
        });
        res.status(500).json({ error: "Failed to sign up customer" });
    }
}

export default customerSignup;