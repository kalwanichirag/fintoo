import moment from "moment";

export const formatDatefun = (date) => {
    return moment(date).format("YYYY/MM/DD");
}

export function secondsToMMSS(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

export const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
}

// Helper function to calculate age from date of birth
export const calculateAge = (dob) => {
    if (!dob) return "-";
    
    // Handle different date formats (DD/MM/YYYY, YYYY-MM-DD, etc.)
    let birthDate;
    if (dob.includes('/')) {
        const [day, month, year] = dob.split('/');
        birthDate = new Date(year, month - 1, day);
    } else {
        birthDate = new Date(dob);
    }
    
    if (isNaN(birthDate.getTime())) return "-";
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

// Helper function to handle null/undefined vs 0 values properly
export const formatApiValue = (value, defaultValue = "-") => {
    // If value is null or undefined, return default
    if (value === null || value === undefined) {
        return defaultValue;
    }
    // If value is 0, return 0 (valid value)
    if (value === 0) {
        return 0;
    }
    // If value is empty string, return default
    if (value === "") {
        return defaultValue;
    }
    // Otherwise return the actual value
    return value;
};