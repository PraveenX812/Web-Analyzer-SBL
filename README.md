# SBL Analyze - AI Web Scraper & Q/A

This is a full-stack application that allows users to submit a website URL and a question. The system scrapes the website in the background, processes the content using Google's Gemini AI, and returns the answer.

## Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, TanStack Query, Framer Motion (via Tailwind).
- **Backend**: Node.js, Express.
- **Queue**: BullMQ with Redis.
- **Database**: PostgreSQL with Drizzle ORM.
- **Scraper**: Playwright (Headless Browser).
- **AI**: Google Gemini (generative-ai).
- **DevOps**: Docker Compose for infrastructure.

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- Google Gemini API Key

## Setup & Running

1. **Infrastructure** (Postgres & Redis):
   ```bash
   docker-compose up -d
   ```

2. **Server (Backend)**:
   - Navigate to `/server`.
   - Create a `.env` file with your keys (see `.env.example`).
   - Install dependencies:
     ```bash
     npm install
     npx playwright install
     ```
   - Push database schema:
     ```bash
     npm run db:push
     ```
   - Start the server:
     ```bash
     npm run dev
     ```

3. **Client (Frontend)**:
   - Navigate to `/client`.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend:
     ```bash
     npm run dev
     ```
   - Open [http://localhost:3000](http://localhost:3000).

## Architecture

1. **Submission**: User submits URL + Question -> `POST /jobs`.
2. **Queueing**: Server adds job to `scraper-queue` (BullMQ) and returns `jobId`.
3. **Processing**: 
   - Worker picks up job.
   - Playwright scrapes website text.
   - Content + Question sent to Gemini AI.
   - Result saved to PostgreSQL.
4. **Result**: Frontend polls `/jobs/:id` until status is `completed` and displays result.
