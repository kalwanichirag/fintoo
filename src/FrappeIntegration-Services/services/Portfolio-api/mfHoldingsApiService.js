import { investmentEndpoints } from "../../../constants";
import apiClient from "../apiClient";

// std useful dynamic values
const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
let user_id = user_data.user_id;
let data_belongs_to = process.env.REACT_APP_DATA_BELONGS_TO;

// generatemfjwttoken
export const GenerateMfJwtToken = async (payload) => {
    try {
        const url = `${investmentEndpoints.GENERATE_MF_JWTTOKEN}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// generatemftxnid
export const GenerateMfTxnId = async (payload) => {
    try {
        const url = `${investmentEndpoints.GENERATE_MF_TXNID_API_URL}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// sendmfotp
export const GenerateSendMFotp = async (payload) => {
    try {
        const url = `${investmentEndpoints.SEND_MF_OTP_API_URL}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// verifymfotp
export const VerifyMFotp = async (payload) => {
    try {
        const url = `${investmentEndpoints.VERIFY_MF_OTP_API_URL}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};
