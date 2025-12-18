import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from '../db/schema';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to DB');
    } catch (err) {
        console.error('DB connection error:', err);
    }
};

connectDB();

export const db = drizzle(client, { schema });
