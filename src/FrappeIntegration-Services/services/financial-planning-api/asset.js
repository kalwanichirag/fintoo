import apiClient from "../apiClient"
import { DATA_BELONGS_TO, financialplanningAssetEndpoints, investmentEndpoints } from "../../../constants";

// GET_USER_Asset_CATEGORIES_LIST
export const getAssetCategoryList = async () => {
    try {
        const response = await apiClient(financialplanningAssetEndpoints.GET_USER_ASSET_CATEGORIES, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};


// GET_USER_IABLITY_DEATILS_LIST
export const getAssetDetails = async (user_id) => {
    try {

        const url = `${financialplanningAssetEndpoints.FECTH_USER_ASSET_DETAILS}?user_id=${user_id}&data_belongs_to=${DATA_BELONGS_TO}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};


// ADD_USER_ASSET_DETAILS
export const addAssetDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanningAssetEndpoints.ADD_USER_ASSET_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// UPDATE_USER_ASSET_DETAILS
export const UpdateAssetDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanningAssetEndpoints.UPDATE_USER_ASSET_DETAILS, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


// DELETE_USER_ASSET_DETAILS
export const deleteAssetDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanningAssetEndpoints.DELETE_USER_ASSET_DETAILS, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};




// CALCULATE_EPF_MATURITY_AMOUNT
export const getEPFMaturityAmount = async (payload) => {
    try {
        const response = await apiClient(financialplanningAssetEndpoints.CALCULATE_EPF_MATURITY_AMOUNT, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


// DEBT EPF Services

export const Send_Epf_Otp = async (payload) => {
    try {
        const response = await apiClient(financialplanningAssetEndpoints.SEND_EPF_OTP, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Verify_Epf_Otp = async (payload) => {
    try {
        const response = await apiClient(financialplanningAssetEndpoints.VERIFY_EPF_OTP, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Check_Uan_Exists = async (user_id, uan) => {
    try {

        const url = `${financialplanningAssetEndpoints.CHECK_UAN_EXISTS}?user_id=${user_id}&uan=${uan}&data_belongs_to=${DATA_BELONGS_TO}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const Get_Scheme_List_By_Category = async () => {
    try {

        const url = `${financialplanningAssetEndpoints.GET_SCHEME_LIST_BY_CATEGORY}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// UPDATE_CATEGORY_GOAL_LINKAGE

export const UpdateCategoryGoalLinkage = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.UPDATE_CATEGORY_GOAL_LINKAGE, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};