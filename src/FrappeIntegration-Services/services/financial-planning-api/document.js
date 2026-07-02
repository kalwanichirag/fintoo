import { financialplanningDocumentEndpoints } from "../../../constants";
import apiClient from "../apiClient";


export const GetDocumentDetails = async (
    user_id,
    data_belongs_to,
    user_document_uuid = null,
    additionalParams = {}
) => {
    try {
        const params = new URLSearchParams({
            user_id,
            data_belongs_to,
            ...additionalParams,
        });
        if (user_document_uuid) {
            params.set("user_document_uuid", user_document_uuid);
        }
        const url = `${financialplanningDocumentEndpoints.GET_USER_DOCUMENT_DETAILS}?${params.toString()}`;
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

export const UploadItrDocumentApi = async (payload) => {
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

export const UpdateItrDocumentApi = async (payload) => {
    try {
        const response = await apiClient(financialplanningDocumentEndpoints.UPDATE_USER_ITR_DOCUMENT_DETAILS, {
            method: 'POST',
            body: payload
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const GetDocumentListByCategory = async (payload) => {
    try {
        const params = new URLSearchParams(payload).toString();
        const response = await apiClient(`${financialplanningDocumentEndpoints.GET_DOCUMENT_LIST_BY_CATEGORY}?${params}`, {
            method: 'GET'
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
