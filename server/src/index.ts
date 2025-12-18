import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Queue } from 'bullmq';
import connection from './config/redis';
import { setupWorker } from './workers/scraper.worker';
import { db } from './config/db';
import { jobs } from './db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Setup Queue
const scraperQueue = new Queue('scraper-queue', {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        }
    }
});

setupWorker();

const jobSchema = z.object({
    url: z.string().url(),
    question: z.string().min(1)
});

// Submit Job
app.post('/jobs', async (req, res) => {
    try {
        const { url, question } = jobSchema.parse(req.body);

        const [newJob] = await db.insert(jobs).values({
            url,
            question,
            status: 'pending'
        }).returning();

        await scraperQueue.add('scrape-job', {
            jobId: newJob.id,
            url,
            question
        });

        res.json(newJob);
    } catch (error) {
        res.status(400).json({ error: error });
    }
});

// Get Job Status
app.get('/jobs/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    try {
        const result = await db.select().from(jobs).where(eq(jobs.id, id));

        if (result.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
