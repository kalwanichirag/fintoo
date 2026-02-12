export function findSmallestDate(dateStrings) {
    if (dateStrings.length === 0) {
        return null;
    }

    return dateStrings.reduce((largestDate, currentDate) => {
        const current = new Date(currentDate);
        if (current < largestDate) {
            return current;
        } else {
            return largestDate;
        }
    }, new Date(dateStrings[0])).toISOString();
}