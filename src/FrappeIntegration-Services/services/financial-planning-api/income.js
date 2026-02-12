import apiClient from "../apiClient"
import { financialplanningincomeEndpoints } from "../../../constants";

// GET_USER_INCOME_CATEGORIES_LIST
export const getIncomeCategoryList = async () => {
    try {
        const response = await apiClient(financialplanningincomeEndpoints.GET_USER_INCOME_CATEGORIES, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// GET_USER_INCOME_DEATILS_LIST
export const getIncomeDetails = async (user_id) => {
    try {

        // const url = `${financialplanningincomeEndpoints.GET_USER_INCOME_DETAILS}?user_id=${user_id}&income_for_retirement=0&data_belongs_to=DIR`;
        const url = `${financialplanningincomeEndpoints.GET_USER_INCOME_DETAILS}?user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// GET_USER_INCOME_DEATILS_BY_DATE
export const getIncomeDetailsbyDate = async (user_id, from_date, to_date, data_belongs_to, filter_type) => {
    try {
        let url = `${financialplanningincomeEndpoints.GET_INCOME_DETAILS_BY_DATE}?user_id=${user_id}&income_from_date=${from_date}&data_belongs_to=${data_belongs_to}&filter_type=${filter_type}`;

        if (to_date && to_date.trim() !== "") {
            url += `&income_to_date=${to_date}`;
        }

        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};



// ADD_USER_INCOME_DETAILS
export const addIncomeDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanningincomeEndpoints.ADD_USER_INCOME_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// UPDATE_USER_INCOME_DETAILS
export const UpdateIncomeDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanningincomeEndpoints.UPDATE_USER_INCOME_DETAILS, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


// DELETE_USER_INCOME_DETAILS
export const deleteIncomeDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanningincomeEndpoints.DELETE_USER_INCOME_DETAILS, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};