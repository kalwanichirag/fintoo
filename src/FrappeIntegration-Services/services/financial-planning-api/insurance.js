import { DATA_BELONGS_TO, financialplanningInsuranceEndpoints } from "../../../constants";
import apiClient from "../apiClient"

// GET_USER_Insurance_CATEGORIES_LIST
export const getInsuranceCategoryList = async () => {
    try {
        const response = await apiClient(financialplanningInsuranceEndpoints.GET_USER_INSURANCE_CATEGORIES, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};


// GET_USER_Insurance_CATEGORIES_LIST
export const getInsuranceUlipList = async () => {
    try {
        const response = await apiClient(financialplanningInsuranceEndpoints.GET_USER_FETCH_ULIP_LIST, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// GET_USER_Insurance_DEATILS_LIST
export const getInsuranceDetails = async (user_id,insurance_id) => {
    try {
        let url = financialplanningInsuranceEndpoints.GET_USER_INSURANCE_DETAILS;
        
        if (!insurance_id) {
            // If no insurance_id, use user_id as parameter
            const queryParams = new URLSearchParams();
            queryParams.append('user_id', user_id);
            url = `${url}?${queryParams.toString()}`;
        } else {
            // Use user_id and insurance id as parameter
            const queryParams = new URLSearchParams();
            queryParams.append('insurance_id', insurance_id);
            queryParams.append('user_id', user_id);
            url = `${url}?${queryParams.toString()}`;
        }



        const response = await apiClient(url, {
            method: 'GET'
        });



        return response;
    } catch (error) {

        throw error;
    }
};


// ADD_USER_Insurance_DETAILS
export const addInsuranceDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanningInsuranceEndpoints.ADD_USER_INSURANCE_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// UPDATE_USER_Insurance_DETAILS
export const UpdateInsuranceDetails = async (payload, insurance_id) => {
    try {
        const url = `${financialplanningInsuranceEndpoints.UPDATE_USER_INSURANCE_DETAILS}`;
        const response = await apiClient(url, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};


// DELETE_USER_Insurance_DETAILS
export const deleteInsuranceDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanningInsuranceEndpoints.DELETE_USER_INSURANCE_DETAILS, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getInsuranceType = async () => {
    try {
        const response = await apiClient(financialplanningInsuranceEndpoints.GET_INSURANCE_TYPE, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// GET_Know your Mediclaim
export const getKnowyourmediclaimQuestion = async () => {
    try {
        const response = await apiClient(financialplanningInsuranceEndpoints.KNOW_YOUR_MEDICLAIM, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getKnowyourmediclaimQuestionAnswers = async (id) => {

    try {
        const response = await apiClient(`${financialplanningInsuranceEndpoints.FETCH_KNOW_YOUR_MEDICLAIM_ANSWERS}?user_id=${id}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const addUpdateUserMediclaimAnswers = async (payload) => {

    try {
        const response = await apiClient(`${financialplanningInsuranceEndpoints.ADD_UPDATE_KNOW_YOUR_MEDICLAIM_ANSWERS}`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getInsuranceIdealExistingCover = async (user_id) => {
    try {

        const url = `${financialplanningInsuranceEndpoints.GET_INSURANCE_IDEAL_EXISTING_COVER}?data_belongs_to=${DATA_BELONGS_TO}&user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};


export const getMedicalInsurance = async (user_id, filter_type, member_id) => {
    try {

        const url = `${financialplanningInsuranceEndpoints.GET_MEDICAL_INSURANCE}?data_belongs_to=${DATA_BELONGS_TO}&user_id=${user_id}&filter_type=${filter_type}&user_insurance_for=${member_id}`;
        const response = await apiClient(url, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

