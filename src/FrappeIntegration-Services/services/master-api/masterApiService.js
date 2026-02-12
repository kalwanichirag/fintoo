import { masterEndpoints } from "../../../constants";
import apiClient from "../apiClient";

// std useful dynamic values
const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
let user_id = user_data.user_id;
let data_belongs_to = process.env.REACT_APP_DATA_BELONGS_TO;

// get_bank_list
export const GetBankList = async () => {
    try {
        const url = `${masterEndpoints.GET_BANK_LIST}`;
        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// get_bank_types_list
export const GetBankTypesList = async () => {
    try {
        const url = `${masterEndpoints.GET_BANK_TYPES_LIST}`;
        const response = await apiClient(url, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw error;
    }
};


export const CheckProfileStatus = async (user_id) => {
    try {
        const url = `${masterEndpoints.CHECK_PROFILE_STATUS_API}?user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const fetchPanStatus = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.GET_PAN_STATUS_API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const addFatcaDetails = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.ADD_FATCA_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const GetCountries = async () => {
    try {
        const url = `${masterEndpoints.GET_COUNTRIES}`;
        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const GetStates = async (country_id) => {
    try {
        const url = `${masterEndpoints.GET_STATES}?country_id=${country_id}`;
        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const GetCities = async (state_id) => {
    try {
        const url = `${masterEndpoints.GET_CITIES}?state_id=${state_id}`;
        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const GetFatcaDetails = async (user_id) => {
    try {
        const url = `${masterEndpoints.GET_FATCA_DETAILS}?user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};




export const addNewCity = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.ADD_NEW_CITY, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const pennydropValidation = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.PENNYDROP_VALIDATION, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getCodes = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.GET_CODES, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const addBank = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.ADD_BANK, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getUserBankDetails = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.GET_USER_BANKS_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const GetNomineeDetails = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.GET_NOMINEE_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const fetchUserMfProfileStatus = async (user_id, data_belongs_to) => {
    try {
        const queryParams = new URLSearchParams({
            user_id,
            data_belongs_to,
        });

        const url = `${masterEndpoints.FETCH_USER_PROFILE_STATUS}?${queryParams.toString()}`;

        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Mandateregister = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.MANDATE_REGISTER, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Getemandateauthurl = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.GET_EMANDATE_AUTH_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};



export const GenerateAof = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.GENERATE_AOF, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const AofImageUpload = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.AOF_IMAGE_UPLOAD, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const GetSlabList = async () => {
    try {
        const url = `${masterEndpoints.GET_SLAB_LIST}`;
        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const GetOccupationList = async () => {
    try {
        const url = `${masterEndpoints.GET_OCCUPATION_LIST}`;
        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const BseClientRegistration = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.CLIENT_BSE_REGISTRATION, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const FatcaUpload = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.FATCA_UPLOAD, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const SwpRegisteration = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.SWP_REGISTERATION, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const SwpCancellation = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.SWP_CANCELLATION, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const GetStopSipReasons = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.GET_STOP_SIP_REASONS, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const PaymentGatewayResponse = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.PAYMENT_GATEWAY_RESPONSE, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const XsiporderEntry = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.XSIPORDER_ENTRY, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Normalorderentry = async (payload) => {
    try {
        const response = await apiClient(masterEndpoints.NORMALORDER_ENTRY, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


