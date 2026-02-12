import { FpAgreementEndpoints } from "../../../constants";
import apiClient from "../apiClient"

export const Fp_Expert = async (user_id,plan_uuid) => {
    try {
        const url = `${FpAgreementEndpoints.FP_EXPERT}?user_id=${user_id}&plan_uuid=${plan_uuid}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Get_Expert_Fp_Document = async (user_id,plan_uuid) => {
    try {
        const url = `${FpAgreementEndpoints.GET_EXPERT_FP_DOCUMENT}?user_id=${user_id}&plan_uuid=${plan_uuid}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Sign_Desk_Api = async (payload) => {
    
    try {
        // const url = `${FpAgreementEndpoints.SIGN_DESK_API}?user_id=${user_id}&file_content=${file_content}&is_expert=${is_expert}`;
        const response = await apiClient(FpAgreementEndpoints.SIGN_DESK_API, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Sign_Desk_Api_Check = async (user_id, file_content, is_expert) => {
    try {
        const url = `${FpAgreementEndpoints.SIGN_DESK_API_CHECK}?user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};




