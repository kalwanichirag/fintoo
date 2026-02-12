import { ReportCashflowAnalysisEndpoints, userManagementEndpoints } from "../../../../constants";
import apiClient from "../../apiClient";

// std useful dynamic values
const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
let user_id = user_data.user_id;
let data_belongs_to = process.env.REACT_APP_DATA_BELONGS_TO;

// get_cash_surplus_shortfall
export const GetCashSurplusShortfall = async () => {

    try {
        const url = `${ReportCashflowAnalysisEndpoints.Get_Cash_Surplus_Shortfall}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET',
            // body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// get_cash_in_flow
export const GetCashInFlow = async () => {
    try {
        const url = `${userManagementEndpoints.CASH_IN_FLOW}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET',
            // body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// get_cash_out_flow
export const GetCashOutFlow = async () => {
    try {
        const url = `${userManagementEndpoints.CASH_OUT_FLOW}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET',
            // body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const cashFlowRecommendation = async () => {
    try {
        const url = `${userManagementEndpoints.CASH_FLOW_RECOMMENDATION}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET',
            // body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


