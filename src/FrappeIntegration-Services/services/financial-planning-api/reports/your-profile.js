import { DgReportEndpoints } from "../../../../constants";
import apiClient from "../../apiClient";

const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
let user_id = user_data.user_id;
let data_belongs_to = process.env.REACT_APP_DATA_BELONGS_TO;

// GET_SURPLUS_DATA
export const GETSURPLUSDATA = async () => {
    try {
        const url = `${DgReportEndpoints.GET_SURPLUS_DATA}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// GET_CASH_IN_OUT_FLOW
export const GETCASH_IN_OUT_FLOW = async () => {

    try {
        const url = `${DgReportEndpoints.GET_CASH_IN_OUT_FLOW}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};