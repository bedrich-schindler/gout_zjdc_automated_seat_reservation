export const getAvailableSeats = async (availableSeatsEl, prioritization = null) => {
    const availableSeats = [];
    let matchingPrioritization = false;

    for (const el of availableSeatsEl) {
        const id = parseInt(await el.getAttribute('data-id'), 10);
        const block = parseInt(await el.getAttribute('data-block'), 10);
        const row = parseInt(await el.getAttribute('data-row'), 10);
        const seat = parseInt(await el.textContent(), 10);

        // Section is by default set to MAX_SAFE_INTEGER
        let section = Number.MAX_SAFE_INTEGER;
        if (prioritization?.sections != null && prioritization.sections[block] != null) {
            section = prioritization.sections[block];
            matchingPrioritization = true;
        }

        availableSeats.push({
            el,
            id,
            block,
            row,
            seat,
            section,
        });
    }

    // For prioritized seating, sort available seats by section ASC, otherwise by block ASC
    if (matchingPrioritization) {
        // Sort available seats by section ASC
        availableSeats.sort((a, b) => {
            if (a.section < b.section) {
                return -1;
            }
            if (a.section > b.section) {
                return 1;
            }
            return 0;
        });
    } else {
        // Sort available seats by block ASC
        availableSeats.sort((a, b) => {
            if (a.block < b.block) {
                return -1;
            }
            if (a.block > b.block) {
                return 1;
            }
            return 0;
        });
    }

    // Sort available seats by row ASC
    availableSeats.sort((a, b) => {
        if (a.section === b.section) {
            if (a.row < b.row) {
                return -1;
            }
            if (a.row > b.row) {
                return 1;
            }
        }
        return 0;
    });

    // Sort available seats by seat ASC
    availableSeats.sort((a, b) => {
        if (a.section === b.section && a.row === b.row) {
            if (a.seat < b.seat) {
                return -1;
            }
            if (a.seat > b.seat) {
                return 1;
            }
        }
        return 0;
    });

    // Sort available seats by priority
    if (prioritization?.priorities != null && matchingPrioritization) {
        const prioritizedAvailableSeats = availableSeats.map((seat) => ({
            ...seat,
            priority: prioritization.priorities[`${seat.section}-${seat.row}-${seat.seat}`],
        }));

        prioritizedAvailableSeats.sort((a, b) => {
            if (a.priority < b.priority) {
                return -1;
            }
            if (a.priority > b.priority) {
                return 1;
            }
            return 0;
        });

        return prioritizedAvailableSeats;
    }

    return availableSeats;
};
