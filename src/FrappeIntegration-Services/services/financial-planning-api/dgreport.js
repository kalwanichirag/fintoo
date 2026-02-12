import apiClient from "../apiClient"
import { DgReportEndpoints } from "../../../constants";


// GET_ADVISORY_RISK_APPETITE
export const GetAdvisoryRiskAppetite = async (user_id, data_belongs_to ) => {
    try {
        const url = `${DgReportEndpoints.GET_ADVISORY_RISK_APPETITE}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const GetAssetRecommendation = async (user_id, data_belongs_to ) => {
    try {
        const url = `${DgReportEndpoints.GET_ASSET_RECOMMENDATION}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};