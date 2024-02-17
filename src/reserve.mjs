import { chromium } from '@playwright/test';
import {
    TS_IN_QUEUE,
    TS_LOADING,
    TS_NOT_OPENED,
    TS_OPENED,
    TS_SERVER_ERROR,
    TS_SOLD_OUT,
} from './utils/constants.mjs';
import { getTicketStatus } from './utils/getTicketStatus.mjs';
import { reserveSeats } from './utils/reserveSeats.mjs';

const NUMBER_OF_SEATS_TO_RESERVE_LIMIT = 4;

export const reserve = async (
    eventTitle,
    eventLinkName,
    eventLinkCode,
    eventDateTime,
    numberOfSeatsToReserve,
    prioritization = null,
) => {
    // Initialize browser, context and page
    const browser = await chromium.launch({ headless: false, timeout: 0 });
    let page = await browser.newPage();

    // Generate random instance ID
    const instanceId = Math.random().toString(36).substring(7);

    console.log(`
==============================    
Event: ${eventTitle} (${eventLinkName}/${eventLinkCode})
Date: ${eventDateTime}
Seats to reserve: ${numberOfSeatsToReserve}
Seats to reserve limit: ${NUMBER_OF_SEATS_TO_RESERVE_LIMIT}
Instance: ${instanceId}
==============================
    `);

    // Open event page
    let pageResponse = await page.goto(`https://goout.net/cs/listky/${eventLinkName}/${eventLinkCode}?min=true`);

    // Run loop until tickets are ready to buy
    let reloadIndex = -1;
    while (true) {
        try {
            const ticketStatus = await getTicketStatus(page, pageResponse);
            console.log(`Status: ${ticketStatus} [${reloadIndex + 1}]`);

            reloadIndex += 1;

            if (
                ticketStatus === TS_SERVER_ERROR
                || ticketStatus === TS_NOT_OPENED
                || ticketStatus === TS_SOLD_OUT
            ) {
                pageResponse = await page.reload();
                await page.waitForTimeout(500);
                continue;
            }

            if (ticketStatus === TS_IN_QUEUE || ticketStatus === TS_LOADING) {
                await page.waitForTimeout(250);
                continue;
            }

            if (ticketStatus === TS_OPENED) {
                const isSeatReservationSuccessful = await reserveSeats(page, numberOfSeatsToReserve, NUMBER_OF_SEATS_TO_RESERVE_LIMIT, prioritization);

                if (isSeatReservationSuccessful) {
                    break;
                } else {
                    pageResponse = await page.reload();
                    await page.waitForTimeout(1000);
                    continue;
                }
            }

            try {
                await page.screenshot({
                    fullPage: true,
                    path: `temp/screenshots/${eventLinkName}-${eventLinkCode}-${instanceId}-${ticketStatus}-${reloadIndex}.png`,
                })
            } catch (e) {
                // Ignore error
            }


            await page.waitForTimeout(1500);
        } catch (e) {
            console.error('Exception:', e);
            try {
                await page.screenshot({
                    fullPage: true,
                    path: `temp/screenshots/${eventLinkName}-${eventLinkCode}-${instanceId}-exception-${reloadIndex}.png`,
                })
            } catch (e) {
                // Ignore error
            }

            console.error('Status: Starting new page');
            page = await browser.newPage();
            pageResponse = await page.goto(`https://goout.net/cs/listky/${eventLinkName}/${eventLinkCode}?min=true`);
        }
    }

    try {
        await page.screenshot({
            fullPage: true,
            path: `temp/screenshots/${eventLinkName}-${eventLinkCode}-${instanceId}-ok-${reloadIndex}.png`,
        })
    } catch (e) {
        // Ignore error
    }

    console.log('Status: Ready to buy');
}
