
import { userManagementEndpoints } from "../../../../constants";
import apiClient from "../../apiClient";

const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
let user_id = user_data.user_id;
let data_belongs_to = process.env.REACT_APP_DATA_BELONGS_TO;

export const SendSMs = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.SEND_SMS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const SendEmail = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.SEND_EMAIL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};


export const SendWsappMsg = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.SEND_WHATSAPP_MSG, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};




export const Expertfinflowgetrmemail = async () => {
    try {
        const url = `${userManagementEndpoints.EXPERTFINFLOWGETRMEMAIL}?user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'POST',
            // body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};


export const Fetch_User_Mf_Profile_Status = async (user_id) => {
    try {
        const url = `${userManagementEndpoints.FETCH_USER_MF_PROFILE_STATUS}?user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};
