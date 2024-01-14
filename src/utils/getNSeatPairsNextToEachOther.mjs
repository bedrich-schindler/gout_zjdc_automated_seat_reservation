export const getNSeatPairsNextToEachOther = (availableSeats, minNumberOfSeatsToReserve) => {
    const nPairs = [];
    let currentNPair = [];

    if (availableSeats.length <= 1) {
        return nPairs;
    }

    // Push first seat to currentNPair
    let previousSeat = availableSeats[0];
    currentNPair.push(previousSeat);

    for (let i = 1; i < availableSeats.length; i++) {
        const currentSeat = availableSeats[i];

        // If currentSeat is in the same section and row as previousSeat, set isInTheSameRow to true, otherwise false
        const isInTheSameRow = currentSeat.section === previousSeat.section && currentSeat.row === previousSeat.row;

        // If isInTheSameRow is true, check if currentSeat is next to previousSeat (can be either on the left or right side) and push currentSeat to currentNPair
        // If isInTheSameRow is false or currentSeat is not next to previousSeat, push currentNPair to nPairs and reset currentNPair
        if (isInTheSameRow) {
            if (currentSeat.seat === previousSeat.seat + 1 || currentSeat.seat === previousSeat.seat - 1) {
                currentNPair.push(currentSeat);
            } else {
                nPairs.push(currentNPair);
                currentNPair = [currentSeat];
            }
        } else {
            nPairs.push(currentNPair);
            currentNPair = [currentSeat];
        }

        // Set previousSeat to currentSeat
        previousSeat = currentSeat;
    }

    // Push last currentNPair to nPairs
    nPairs.push(currentNPair);

    return nPairs.filter((nPair) => nPair.length >= minNumberOfSeatsToReserve)
};
