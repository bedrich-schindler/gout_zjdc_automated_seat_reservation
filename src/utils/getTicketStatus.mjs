import {
    TS_NOT_OPENED,
    TS_IN_QUEUE,
    TS_LOADING,
    TS_OPENED,
    TS_SOLD_OUT,
    TS_SERVER_ERROR,
    TS_UNKNOWN,
} from './constants.mjs';

// Return an empty array as if it is nothing found
const ignoreException = () => [];

export const getTicketStatus = async (page, pageResponse) => {
    const serverErrorEl = await page.getByText('nginx').all().catch(ignoreException);
    if (!pageResponse.ok || serverErrorEl.length > 0) {
        return TS_SERVER_ERROR;
    }

    const openedCsEl = await page.getByText('Výběr vstupenek').all().catch(ignoreException);
    const openedEnEl = await page.getByText('Ticket selection').all().catch(ignoreException)
    if (openedCsEl.length > 0 || openedEnEl.length > 0) {
        return TS_OPENED;
    }

    const notOpenedCsEl = await page.getByText('Předprodej vstupenek pro tuto akci začne').all().catch(ignoreException);
    const notOpenedEnEl = await page.getByText('The ticket sale for this event will').all().catch(ignoreException);
    if (notOpenedCsEl.length > 0 || notOpenedEnEl.length > 0) {
        return TS_NOT_OPENED;
    }

    const soldOutCsEl = await page.getByText('Vstupenky jsou vyprodány').all().catch(ignoreException);
    const soldOutEnEl = await page.getByText('Tickets are sold out').all().catch(ignoreException);
    if (soldOutCsEl.length > 0 || soldOutEnEl.length > 0) {
        return TS_SOLD_OUT;
    }

    const loadingCsEl = await page.getByText('Okamžik, prosím').all().catch(ignoreException);
    const loadingEnEl = await page.getByText('One moment please').all().catch(ignoreException);
    if (loadingCsEl.length > 0 || loadingEnEl.length > 0) {
        return TS_LOADING;
    }

    const inQueueElCs1 = await page.getByText('ve frontě').all().catch(ignoreException);
    const inQueueElCs2 = await page.getByText('minuty').all().catch(ignoreException);
    const inQueueElCs3 = await page.getByText('minut').all().catch(ignoreException);
    const inQueueElEn1 = await page.getByText('in line').all().catch(ignoreException);
    const inQueueElEn2 = await page.getByText('minutes').all().catch(ignoreException);
    const inQueueElEn3 = await page.getByText('minute').all().catch(ignoreException);
    if (
        inQueueElCs1.length > 0 || inQueueElCs2.length > 0 || inQueueElCs3.length > 0
        || inQueueElEn1.length > 0 || inQueueElEn2.length > 0 || inQueueElEn3.length > 0
    ) {
        return TS_IN_QUEUE;
    }

    return TS_UNKNOWN;
};
