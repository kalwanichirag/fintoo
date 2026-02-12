import { financialplanningContingencyPlanningEndpoints } from "../../../../constants";
import apiClient from "../../apiClient";

const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
let user_id = user_data.user_id;
let data_belongs_to = process.env.REACT_APP_DATA_BELONGS_TO;

// get_current_insurance
export const GetCurrentInsuranceData = async () => {
    try {
        const url = `${financialplanningContingencyPlanningEndpoints.GET_CURRENT_INSURANCE_API_URL}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};