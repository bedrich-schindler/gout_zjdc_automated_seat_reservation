import { getAvailableSeats } from './getAvailableSeats.mjs';
import { getNSeatPairsNextToEachOther } from './getNSeatPairsNextToEachOther.mjs';

export const reserveSeats = async (
    page,
    numberOfSeatsToReserve,
    numberOfSeatsToReserveLimit,
    prioritization = null,
) => {
    const availableSeatsEl = await page.locator('.shape--seat:not(.is-occupied)').all();

    if (availableSeatsEl.length === 0) {
        console.log('No available seats found');
        return false;
    }

    if (availableSeatsEl.length < numberOfSeatsToReserve) {
        console.log(`Not enough available seats found (count: ${availableSeatsEl.length}, required: ${numberOfSeatsToReserve}})`);
        return false;
    }

    const availableSeats = await getAvailableSeats(availableSeatsEl, prioritization);
    const availableSeatVariants = getNSeatPairsNextToEachOther(availableSeats, numberOfSeatsToReserve);

    console.log(`Available seats (count: ${availableSeats.length})`);
    for (const availableSeat of availableSeats) {
        console.log(
            availableSeat.section,
            availableSeat.row.toString().padStart(2, '0'),
            availableSeat.seat.toString().padStart(2, '0')
        );
    }

    console.log(`Available ${numberOfSeatsToReserve}-seat variants (count:  ${availableSeatVariants.length})`);
    availableSeatVariants.forEach((variant) => {
       if (variant.length > 0) {
           console.log(
               variant[0].section,
               '|',
               variant[0].row.toString().padStart(2, '0'),
               '|',
               variant.map((seat) => seat.seat.toString().padStart(2, '0')).join(' '),
           );
       }
    });

    if (availableSeatVariants.length === 0) {
        console.log('No available seat variants found, trying to get alternate seat variants without prioritization...');
        const alternateAvailableSeats = await getAvailableSeats(availableSeatsEl, null);
        const alternateAvailableSeatVariants = getNSeatPairsNextToEachOther(alternateAvailableSeats, numberOfSeatsToReserve);

        console.log(`Alternate available seats (count: ${alternateAvailableSeats.length})`);
        for (const availableSeat of alternateAvailableSeats) {
            console.log(
                availableSeat.section,
                availableSeat.row.toString().padStart(2, '0'),
                availableSeat.seat.toString().padStart(2, '0')
            );
        }

        console.log(`Alternate available ${numberOfSeatsToReserve}-seat variants (count:  ${alternateAvailableSeatVariants.length})`);
        alternateAvailableSeatVariants.forEach((variant) => {
            if (variant.length > 0) {
                console.log(
                    variant[0].section,
                    '|',
                    variant[0].row.toString().padStart(2, '0'),
                    '|',
                    variant.map((seat) => seat.seat.toString().padStart(2, '0')).join(' '),
                );
            }
        });

        if (alternateAvailableSeatVariants.length === 0) {
            console.log('No alternate available seat variants found, reserving seats one by one original prioritization...');

            for (const seat of availableSeats) {
                await seat.el.dispatchEvent('click');
                await page.waitForTimeout(25);

                if ((await page.locator('.shape--seat.is-selected').all()).length >= numberOfSeatsToReserveLimit) {
                    break;
                }
            }
        } else {
            console.log(`${alternateAvailableSeatVariants.length} alternate available seat variants found, reserving seats...`);

            for (const variant of alternateAvailableSeatVariants) {
                for (const seat of variant) {
                    await seat.el.dispatchEvent('click');
                    await page.waitForTimeout(25);

                    if ((await page.locator('.shape--seat.is-selected').all()).length >= numberOfSeatsToReserveLimit) {
                        break;
                    }
                }

                if ((await page.locator('.shape--seat.is-selected').all()).length >= numberOfSeatsToReserveLimit) {
                    break;
                }
            }
        }
    } else {
        console.log(`${availableSeatVariants.length} available seat variants found, reserving seats...`);

        for (const variant of availableSeatVariants) {
            for (const seat of variant) {
                await seat.el.dispatchEvent('click');
                await page.waitForTimeout(25);

                if ((await page.locator('.shape--seat.is-selected').all()).length >= numberOfSeatsToReserveLimit) {
                    break;
                }
            }

            if ((await page.locator('.shape--seat.is-selected').all()).length >= numberOfSeatsToReserveLimit) {
                break;
            }
        }
    }

    const reservedSeatsCount = (await page.locator('.shape--seat.is-selected').all()).length;
    console.log(`Reservations done (reserved: ${reservedSeatsCount}, required: ${numberOfSeatsToReserve})`);

    return true;
};
