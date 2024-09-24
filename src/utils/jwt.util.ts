import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (payload: Record<string, any>) => {
    const secret: string = process.env.JWT_SECRET || '';
    return jwt.sign(payload, secret, { 
        expiresIn: '1h',
     });
}

export default generateToken;