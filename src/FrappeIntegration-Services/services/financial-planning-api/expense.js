import { financialplanningexpenseEndpoints } from "../../../constants";
import apiClient from "../apiClient"
// import { financialplanningexpenseEndpoints } from "../apiEndpoints"

// GET_USER_EXPENSE_CATEGORIES_LIST
export const geExpenseCategoryList = async () => {
    try {
        const response = await apiClient(financialplanningexpenseEndpoints.GET_USER_EXPESNE_CATEGORIES, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// GET_USER_EXPENSE_DEATILS_LIST
export const getExpenseDetails = async (user_id) => {
    try {
        const url = `${financialplanningexpenseEndpoints.GET_USER_EXPESNE_DETAILS}?user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};


// ADD_USER_EXPENSE_DETAILS
export const addExpenseDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanningexpenseEndpoints.ADD_USER_EXPESNE_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// GET_USER_EXPENSE_DEATILS_BY_DATE
export const getExpenseDetailsbyDate = async (user_id, from_date, to_date, data_belongs_to, filter_type) => {
    try {
        let url = `${financialplanningexpenseEndpoints.GET_EXPENSE_DETAILS_BY_DATE}?user_id=${user_id}&expense_from_date=${from_date}&data_belongs_to=${data_belongs_to}&filter_type=${filter_type}`;

        if (to_date && to_date.trim() !== "") {
            url += `&expense_to_date=${to_date}`;
        }

        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};




// UPDATE_USER_EXPENSE_DETAILS
export const UpdateExpenseDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanningexpenseEndpoints.UPDATE_USER_EXPESNE_DETAILS, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


// DELETE_USER_EXPENSE_DETAILS
export const deleteExpenseDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanningexpenseEndpoints.DELETE_USER_EXPESNE_DETAILS, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};