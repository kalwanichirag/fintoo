import { ADVISORY_GET_ASSETS_SUMMARY_API, ADVISORY_GET_LIABILITY_DATA, ADVISORY_GET_NETWORTHLIABILITES_API_URL, ADVISORY_NETWORTHFUNDFLOW_PROJECTION_API_URL, reportHubEndpoints } from "../../../constants";
import apiClient from "../apiClient"

export const sendOtpForCams = async (payload) => {
    try {
        const url = `${reportHubEndpoints.SEND_OTP_FOR_CAMS}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const generateCapitalGainReport = async (payload) => {
    try {
        const url = `${reportHubEndpoints.CAPITAL_GAIN_REPORT_URL}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getCapitalGainStatus = async (userId, pan) => {
    try {
        const response = await apiClient(`${reportHubEndpoints.GET_CAPITAL_GAIN_STATUS}?user_id=${userId}&pan=${pan}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const Advisory_Get_Networthliabilites_Api_Url = async (user_id,user_asset_for, filter_type ) => {
    try {
        const response = await apiClient(`${ADVISORY_GET_NETWORTHLIABILITES_API_URL}?user_id=${user_id}&user_asset_for=${user_asset_for}&filter_type=${filter_type}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Getassetsummary = async (user_id,user_asset_for, filter_type ) => {
    try {
        const response = await apiClient(`${ADVISORY_GET_ASSETS_SUMMARY_API}?user_id=${user_id}&user_asset_for=${user_asset_for}&filter_type=${filter_type}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Advisory_Get_Liability_Data = async (user_id,user_liability_for, filter_type ) => {
    try {
        const response = await apiClient(`${ADVISORY_GET_LIABILITY_DATA}?user_id=${user_id}&user_liability_for=${user_liability_for}&filter_type=${filter_type}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Advisorynetworthfundflowprojectionapiurl = async (user_id) => {
    try {
        const response = await apiClient(`${ADVISORY_NETWORTHFUNDFLOW_PROJECTION_API_URL}?user_id=${user_id}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};



