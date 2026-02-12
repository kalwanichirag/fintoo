import { financialplanningDocumentEndpoints } from "../../../constants";
import apiClient from "../apiClient";


export const GetDocumentDetails = async (user_id, data_belongs_to, user_document_uuid = null) => {
    try {
        let url = `${financialplanningDocumentEndpoints.GET_USER_DOCUMENT_DETAILS}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        if (user_document_uuid) {
            url += `&user_document_uuid=${user_document_uuid}`;
        }
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const UploadDocumentApi = async (payload) => {
    try {
        const response = await apiClient(financialplanningDocumentEndpoints.UPLOAD_USER_DOCUMENT_API, {
            method: 'POST',
            body: payload
        });
        return response;
    } catch (error) {
        throw error;
    }
};


export const DeleteDocumentApi = async (payload) => {
    try {
        const response = await apiClient(financialplanningDocumentEndpoints.DELETE_USER_DOCUMENT_API, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const GetDocType = async () => {
    try {
        const response = await apiClient(financialplanningDocumentEndpoints.GET_DOCTYPE_API, {
            method: 'GET'
        })
        return response;
    } catch (error) {
        throw error;
    }
};
