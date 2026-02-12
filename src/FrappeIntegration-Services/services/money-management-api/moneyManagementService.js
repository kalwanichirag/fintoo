import apiClient from "../apiClient"
import { moneyManagementEndpoints } from "../../../constants"

//SUBMIT_CONSENT_REQUEST
export const submitConsentRequest = async (payload) => {
    try {
        const response = await apiClient(moneyManagementEndpoints.SUBMIT_CONSENT_REQUEST, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

//SAVE_TRANSACTIONS
export const saveTransactions = async (payload) => {
    try {
        const response = await apiClient(moneyManagementEndpoints.SAVE_TRANSACTIONS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};
//FETCH_ACCOUNT_TRANSACTIONS
export const fetchTransactions = async (payload) => {

    try {
        const response = await apiClient(moneyManagementEndpoints.FETCH_ACCOUNT_TRANSACTIONS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

//FETCH_TRACKED_BANK_DETAILS
export const fetchTrackedBankDetails = async (payload) => {
    try {
        const response = await apiClient(moneyManagementEndpoints.FETCH_TRACKED_BANK_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const financialOverview = async (payload) => {
    try {
        const response = await apiClient(moneyManagementEndpoints.FINANCIAL_OVERVIEW, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
 
        return response;
    } catch (error) {
        throw error;
    }
};
//FETCH_TRACKED_BANK_DETAILS
export const fetchTrackedMobileList = async (user_id) => {
    try {
        const response = await apiClient(`${moneyManagementEndpoints.FETCH_TRACKED_MOBILE_LIST}?user_id=${user_id}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

//AUTO_UPDATE_ACCOUNT_TRANSACTIONS
export const autoUpdateAccountTransactions = async (payload) => {
    try {
        const response = await apiClient(moneyManagementEndpoints.AUTO_UPDATE_ACCOUNT_TRANSACTIONS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

//MAP_TRANSACTIONS
export const mapTransactions = async (payload) => {
    try {
        const response = await apiClient(moneyManagementEndpoints.MAP_TRANSACTIONS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};
//MAP_TRANSACTIONS
export const analyseTransactions = async (payload) => {
    try {
        const response = await apiClient(moneyManagementEndpoints.ANALYSE_BANK_ACCOUNT_TRANSACTIONS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

//UPDATE_TRACKED_BANK_DETAILS
export const updateTrackedBankDetails = async (payload) => {
    try {
        const response = await apiClient(moneyManagementEndpoints.UPDATE_TRACKED_BANK_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

//UNLINK_BANK_ACCOUNT
export const stopTrackingBank = async (payload) => {
    try {
        const response = await apiClient(moneyManagementEndpoints.UNLINK_BANK_ACCOUNT, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

//ANALYSE_PAST_DATA
export const analysePastData = async (payload) => {
    try {
        const response = await apiClient(moneyManagementEndpoints.ANALYSE_PAST_DATA, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

//GET_DEPENDENT_EARNING_COUNT
export const getDependentEarningCount = async (payload) => {
    try {
        const response = await apiClient(moneyManagementEndpoints.GET_DEPENDENT_EARNING_COUNT, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

//DUPLICATE_ACCOUNT_CHECK
export const checkForDuplicateAccount = async (user_ids) => {
    try {
        const query = encodeURIComponent(JSON.stringify(user_ids));
        const response = await apiClient(
            `${moneyManagementEndpoints.DUPLICATE_ACCOUNT_CHECK}?user_ids=${query}`,
            {
            method: 'GET',
            }
        );
        return response;
    } catch (error) {
      throw error;
    }
  };
  

//GENERATE_TOKEN
export const generateToken = async () => {
    try {
        const response = await apiClient(moneyManagementEndpoints.GENERATE_TOKEN, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

//BANK_LIST
export const getBankList = async () => {
    try {
        const response = await apiClient(moneyManagementEndpoints.BANK_LIST, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

//CATEGORY_LIST
export const getCategoryList = async () => {
    try {
        const response = await apiClient(moneyManagementEndpoints.CATEGORY_LIST, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};
// ---------------------------------- finfactor API functions --------------------------------

//  FIP_FM_DATA_REPORT: `${FINVU_BASE_API_URL}/FIPfmDataReport`,
export const FIPfmDataReport = async (externalToken, ConsentHandle, sID, linkref) => {
    try {
        const response = await apiClient(`${moneyManagementEndpoints.FIP_FM_DATA_REPORT}/${ConsentHandle}/${sID}/${linkref}`, {
            method: 'GET'
        }, externalToken);

        return response;
    } catch (error) {
        throw error;
    }
};

//  LATEST_METRICS_ALL: `${FINVU_BASE_API_URL}/fips/latest-metrics-all`,
export const getLatestMetricsAll = async (externalToken) => {
    try {
        const response = await apiClient(`${moneyManagementEndpoints.LATEST_METRICS_ALL}`, {
            method: 'GET'
        }, externalToken);

        return response;
    } catch (error) {
        throw error;
    }
};

export function moneyManagementSocketPayload(mid, type, payload, sid = "", dup = false) {
    const timestamp = new Date().toISOString().replace("Z", "+00:00");

    const payloadObject = {
        header: {
            mid: mid, // Provided mid
            ts: timestamp, // Current timestamp in ISO format
            sid: sid, // Use passed sid or default to ""
            dup: dup, // Use passed dup or default to "false"
            type: type, // Provided type
        },
        payload: payload, // Provided payload
    };

    return payloadObject;
}
