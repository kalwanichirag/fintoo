import apiClient from "../apiClient"
import {
    ADVISORY_FETCH_USER_ASSUMPTIONS,
    ADVISORY_FETCH_USER_INFLATIONS,
    ADVISORY_UPDATE_USER_SETTINGS_DATA,
    FETCH_USER_EXPENSES
} from "../../../constants"

// GET_USER_Asset_CATEGORIES_LIST
export const fetchUserAssumptions = async (user_id) => {
    try {
        let url = `${ADVISORY_FETCH_USER_ASSUMPTIONS}?user_id=${user_id}`;

        const response = await apiClient(url, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// GET_USER_Asset_CATEGORIES_LIST
export const fetchUserInflations = async (user_id) => {
    try {
        let url = `${ADVISORY_FETCH_USER_INFLATIONS}?user_id=${user_id}`;

        const response = await apiClient(url, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// ADD_USER_ASSET_DETAILS
export const updateSetting = async (payload) => {
    try {
        const response = await apiClient(ADVISORY_UPDATE_USER_SETTINGS_DATA, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// ADD_USER_ASSET_DETAILS
export const fetchUserExpenses = async (user_id) => {
    try {
        let url = `${FETCH_USER_EXPENSES}?user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'POST'
        });

        return response;
    } catch (error) {
        throw error;
    }
};