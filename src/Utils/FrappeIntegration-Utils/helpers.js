export function debounce(func, delay = 1000) {
    let timeoutId;

    return function (...args) {
        // Clear the previous timeout, if any
        clearTimeout(timeoutId);

        // Set a new timeout
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

export function percentageOfSmallerWithRespectToLarger(a, b) {
    if (!a || !b) return 0

    if (a === 0 || b === 0) return 0;

    const smaller = Math.min(a, b);
    const larger = Math.max(a, b);

    return ((smaller / larger) * 100).toFixed(2);

}

export const downloadPdf = (pdfUrl) => {
    const link = document.createElement('a');

    link.href = pdfUrl;

    link.download = 'downloaded-file.pdf';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const handleKeyEnterClick = (event, action) => {
    // const allowedKeys = [
    //     "Backspace",
    //     "ArrowLeft",
    //     "ArrowRight",
    //     "Tab",
    // ];

    // if (
    //     !allowedKeys.includes(event.key) && // Allow special keys
    //     !numericKeysRegex.test(event.key) // Allow numeric keys
    // ) {
    //     event.preventDefault();
    // }



    if (event.key === "Enter") {
        action();
        return;
    }
};

