import { parsePhoneNumberFromString } from "libphonenumber-js";

export const validateMobile = (mobile) => {
    try {
        if (!mobile.startsWith("91")) {
            const phoneNumber = parsePhoneNumberFromString(`+${mobile}`);


            if (phoneNumber && phoneNumber.isValid()) {
                return true;
            } else {
                return false;
            }
        }
        const nationalNumber = mobile.slice(2);

        const indianNumberRegex = /^[6-9]\d{9}$/;

        return indianNumberRegex.test(nationalNumber);


    } catch (error) {
        console.log('errorerrorerror', error);
        return false
    }

};