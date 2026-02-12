import { taxplanningEndpoints } from "../../../constants";
import apiClient from "../apiClient";


export const getAppointmentDetails = async (user_id) => {

    try {
        const response = await apiClient(`${taxplanningEndpoints.GET_APPOINTMENT_DETAILS}?appointment_user_id=${user_id}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getDocumentListByCategory = async (document_service_sub_id) => {
    try {
        const response = await apiClient(`${taxplanningEndpoints.GET_DOCUMENT_LIST_BY_CATEGORY}?document_service_sub_id=${document_service_sub_id}`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};