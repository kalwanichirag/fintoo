import apiClient from "../apiClient"
import { DATA_BELONGS_TO, financialplanningliablitiesEndpoints } from "../../../constants";

// GET_USER_LIABILITY_CATEGORIES_LIST
export const getLiablityCategoryList = async () => {
    try {
        const response = await apiClient(financialplanningliablitiesEndpoints.GET_LIABILITY_CATEGORY, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};


// GET_USER_IABLITY_DEATILS_LIST
export const getLiabilityDetails = async (user_id,liability_id) => {
    try {
        let url = `${financialplanningliablitiesEndpoints.GET_USER_LIABILITY_DEATILS}?data_belongs_to=${DATA_BELONGS_TO}`;

        if (!user_id) {
            url += `&liability_id=${liability_id}`;
        } else {
            url += `&user_id=${user_id}`;
        }
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};


// ADD_USER_IABLITY_DETAILS
export const addLiablityDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanningliablitiesEndpoints.ADD_USER_LIABILITY_DEATILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// UPDATE_USER_LIABLITY_DETAILS
export const UpdateLiablityDetails = async (payload, income_id) => {
    try {
        const response = await apiClient(financialplanningliablitiesEndpoints.UPDATE_USER_LIABILITY_DEATILS, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


// DELETE_USER_LIABLITY_DETAILS
export const deleteLiablityDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanningliablitiesEndpoints.DELETE_USER_LIABILITY_DEATILS, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// FETCH_EXTERNAL_USER_LOAN_DETAILS
export const Fetch_External_User_Loan_Details = async (payload) => {
    try {
        const response = await apiClient(financialplanningliablitiesEndpoints.FETCH_EXTERNAL_USER_LOAN_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// FETCHEXTERNALHOLDINGDETAILS


export const Fetchexternalholdingdetails = async (payload) => {
    try {

        const response = await apiClient(financialplanningliablitiesEndpoints.FETCHEXTERNALHOLDINGDETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// DELETE_EXTERNAL_LOANS


export const Delete_External_Loans = async (payload) => {
    try {

        const response = await apiClient(financialplanningliablitiesEndpoints.DELETE_EXTERNAL_LOANS, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// UPDATE_EXTERNAL_USER_LOAN_DETAILS


export const Update_External_User_Loan_Details = async (payload) => {
    try {

        const response = await apiClient(financialplanningliablitiesEndpoints.UPDATE_EXTERNAL_USER_LOAN_DETAILS, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};