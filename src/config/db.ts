import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 25060,
    ssl: {
        rejectUnauthorized: false
    }
};

const client = new pg.Client(config);

async function connectClient() {
    try {
        await client.connect();
        console.log("Connected to the database");
    } catch (err) {
        console.error("Failed to connect to the database", err);
    }
}

connectClient();

export default client;