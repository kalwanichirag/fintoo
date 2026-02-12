import { DashboardEndpoints, investmentEndpoints } from "../../../constants";
import apiClient from "../apiClient";

export const GetScoreCard = async (user_id, data_belongs_to ) => {
    try {
        const url = `${DashboardEndpoints.GET_SCORECARD_API_URL}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET'
        });


        return response;
    } catch (error) {
        throw error;
    }
};

export const GetNetworthLiabilites = async (user_id,user_asset_for,filter_type,data_belongs_to ) => {
    try {
        const url = `${DashboardEndpoints.GET_NETWORTHLIABILITES_API_URL}?user_id=${user_id}&user_asset_for=${user_asset_for}&filter_type=${filter_type}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET'
        });


        return response;
    } catch (error) {
        throw error;
    }
};

export const ParS3Upload = async (payload) => {
    try {
        const url = `${DashboardEndpoints.PAR_S3_UPLOAD}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const DeleteUserAsset = async (payload) => {
    try {
        const url = `${investmentEndpoints.DELETE_OTHER_INVESTMENTS}`;
        const response = await apiClient(url, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};
