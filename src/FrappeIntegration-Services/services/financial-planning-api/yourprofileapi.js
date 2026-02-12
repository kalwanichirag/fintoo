import apiClient from "../apiClient"
import { financialplanningYourprofileEndpoints } from "../../../constants";

// Fetch_Risk_Questions_Url
export const FetchRiskQuestionsUrl = async () => {
    try {
        const response = await apiClient(financialplanningYourprofileEndpoints.FETCH_RISK_QUESTIONS_URL, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// fetch_user_risk_answers_url
export const FetchUserRiskAnswersUrl = async (user_id) => {
    try {
        const url = `${financialplanningYourprofileEndpoints.FETCH_USER_RISK_ANSWERS_URL}?user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Add_Update_User_Risk_Answers_Url
export const AddUpdateUserRiskAnswersUrl = async (payload) => {
    try {
        const response = await apiClient(financialplanningYourprofileEndpoints.ADD_UPDATE_USER_RISK_ANSWERS_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const GetUserAssumptions = async (payload) => {
    try {
        const response = await apiClient(financialplanningYourprofileEndpoints.GET_USER_ASSUMPTIONS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const GetUserInflations = async (payload) => {
    try {
        const response = await apiClient(financialplanningYourprofileEndpoints.GET_USER_INFLATIONS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};





