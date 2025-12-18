import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const jobs = pgTable('jobs', {
    id: serial('id').primaryKey(),
    url: text('url').notNull(),
    question: text('question').notNull(),
    status: text('status').default('pending').notNull(),
    answer: text('answer'),
    scrapedContent: text('scraped_content'),
    error: text('error'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
