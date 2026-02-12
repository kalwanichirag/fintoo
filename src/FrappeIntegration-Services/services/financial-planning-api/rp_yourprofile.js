import apiClient from "../apiClient"
import {
    GET_SCORE_CARD,
    GET_CASH_IN_OUT_FLOW
} from "../../../constants"

// GET_USER_Asset_CATEGORIES_LIST
export const get_score_card = async (user_id) => {
    try {
        let url = `${GET_SCORE_CARD}?user_id=${user_id}`;

        const response = await apiClient(url, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const get_cash_in_out_flow = async (user_id) => {
    try {
        let url = `${GET_CASH_IN_OUT_FLOW}?user_id=${user_id}`;

        const response = await apiClient(url, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

