import apiClient from "../apiClient"
import {
    GET_LIFE_INSURANCE_URL,
} from "../../../constants"

// GET_USER_Asset_CATEGORIES_LIST
export const get_life_insurance = async (user_id) => {
    try {
        let url = `${GET_LIFE_INSURANCE_URL}?user_id=${user_id}`;

        const response = await apiClient(url, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};