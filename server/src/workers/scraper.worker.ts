import { Worker, Job } from 'bullmq';
import connection from '../config/redis';
import { db } from '../config/db';
import { jobs } from '../db/schema';
import { scrapeWebsite } from '../services/scraper.service';
import { askAI } from '../services/ai.service';
import { eq } from 'drizzle-orm';

export const setupWorker = () => {
    console.log('Running scraper-queue');
    const worker = new Worker('scraper-queue', async (job: Job) => {
        console.log(`Processing Job ${job.id}`);
        const { jobId, url, question } = job.data;

        await db.update(jobs).set({ status: 'processing' }).where(eq(jobs.id, jobId));

        try {
            console.log(`Scraping ${url}`);
            const content = await scrapeWebsite(url);

            console.log('Asking AI');
            const answer = await askAI(content, question);

            await db.update(jobs).set({
                status: 'completed',
                scrapedContent: content,
                answer: answer
            }).where(eq(jobs.id, jobId));

            console.log(`Job ${jobId} completed successfully.`);

        } catch (error: any) {
            console.error(`Job ${jobId} failed:`, error);
            await db.update(jobs).set({
                status: 'failed',
                error: error.message
            }).where(eq(jobs.id, jobId));
            throw error;
        }
    }, { connection });

    worker.on('completed', job => {
        console.log(`Job ${job.id} finished`);
    });

    worker.on('failed', (job, err) => {
        console.log(`Job ${job?.id} failed with ${err.message}`);
    });
};
