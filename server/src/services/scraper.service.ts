import { chromium } from 'playwright';

export async function scrapeWebsite(url: string): Promise<string> {
    const browser = await chromium.launch({ headless: true });
    try {
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            viewport: { width: 1280, height: 720 }
        });
        const page = await context.newPage();

        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
        });

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const content = await page.evaluate(() => {
            return document.body.innerText;
        });

        return content.substring(0, 15000);
    } finally {
        await browser.close();
    }
}
