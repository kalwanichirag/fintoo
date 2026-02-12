export function maskPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');

    const lastFourDigits = cleaned.slice(-4);

    const formatted = '******' + lastFourDigits;
    return formatted;
}