import { ReportRetirementPlanningCashflowEndpoints } from "../../../../constants";
import apiClient from "../../apiClient";

// std useful dynamic values
const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
let user_id = user_data.user_id;
let data_belongs_to = process.env.REACT_APP_DATA_BELONGS_TO;

// GET_SURPLUS_DATA
export const GetRetirementCashflow = async () => {

    try {
        const url = `${ReportRetirementPlanningCashflowEndpoints.GET_RETIREMENT_CASHFLOW}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET',
            // body: JSON.stringify(payload)
        });
        
        return response;
    } catch (error) {
        throw error;
    }
};
// GET_CASH_IN_OUT_FLOW
export const GetRecommendationRetirementCashflow = async () => {

    try {
        const url = `${ReportRetirementPlanningCashflowEndpoints.GET_RECOMMENDATION_RETIREMENT_CASHFLOW}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET',
            // body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// GET_RETIREMENT_CORPUS
export const GetRetirementCorpus = async (user_id) => {

    try {
        const url = `${ReportRetirementPlanningCashflowEndpoints.GET_RETIREMENT_CORPUS}?user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'GET',
        });
        
        return response;
    } catch (error) {
        throw error;
    }
};