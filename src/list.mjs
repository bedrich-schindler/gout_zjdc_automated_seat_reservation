import { chromium } from '@playwright/test';

export const list = async (artistName, artistCode, numberOfSeatsToReserve, prioritizationFilePath = null) => {
    // Initialize browser, context and page
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Go to artist page
    const pageResponse = await page.goto(`https://goout.net/cs/${artistName}/${artistCode}/`);

    // If page is not successfully loaded, close browser
    if (!pageResponse.ok()) {
        // Close browser
        await browser.close();
        return false;
    }

    // Click to confirm cookies
    const cookieConfirmEl = await page.locator('.goout-cookie-confirm-all');
    await cookieConfirmEl.click()

    // Click to show all events
    const showMoreEl = await page.locator('.show-more');
    await showMoreEl.click()

    // Get all HTML elements of events
    const eventsEl = await page.locator('.ticket-button.blue').all();

    // Transform HTML elements of events to objects
    const events = [];
    for (const eventEl of eventsEl) {
        const parentRowEl = await eventEl.locator('..').locator('..').first();

        const titleEl = await parentRowEl.locator('a:nth-child(1)').first();
        const dateTimeEl = await parentRowEl.locator('span:nth-child(3)').first();

        const title = await titleEl.textContent();
        const dateTime = await dateTimeEl.textContent();
        const link = await eventEl.getAttribute('href');
        const linkParts = link.split('/');

        events.push({
            title: title.trim(),
            dateTime: dateTime.trim(),
            linkName: linkParts[3],
            linkCode: linkParts[4],
            prioritizationFilePath: prioritizationFilePath ? prioritizationFilePath : null,
            numberOfSeatsToReserve: numberOfSeatsToReserve ? numberOfSeatsToReserve : null,
        });
    }

    // Print events
    console.log(JSON.stringify(events, null, 2));

    // Close browser
    await browser.close();
    return true;
}
