import apiClient from "../apiClient"
import { ExternalAPIListEndpoints, DATA_BELONGS_TO } from "../../../constants";

export const getMFschemlist = async () => {
    try {
        const url = `${ExternalAPIListEndpoints.GETSCHEMEMFLIST}?&data_belongs_to=${DATA_BELONGS_TO}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Us Equity

export const geUsEquityList = async ({ pageSize}) => {

    try {
        const url = `${ExternalAPIListEndpoints.GETUSEQUITYLIST}?page_size=${pageSize}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Equity Shares

export const geEquitySharesList = async ({ pageSize}) => {
    try {
        const url = `${ExternalAPIListEndpoints.GETSHARESDATA}?page_size=${pageSize}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// For Link your holdings mf

export const GenerateJWTToken = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.GETJWTTOKEN, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};



export const GettransactionID = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.GETTRANSACTION, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const sendSmallcaseOTP = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.SENDMFOTP, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Verifysmallcasemfotp = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.VERIFYMFOTP, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Fetchexternalholdingdetails = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.FETCHEXTERNALHOLDINGDETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// export const Fetchexternalmfdetails = async (payload) => {
//     try {
//         const response = await apiClient(ExternalAPIListEndpoints.FETCHEXTERNALMFDETAILS, {
//             method: 'POST',
//             body: JSON.stringify(payload)
//         });

//         return response;
//     } catch (error) {
//         throw error;
//     }
// };

export const Deletesmallcaseaccount = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.DELETESMALLCASEACCOUNT, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


// For Link your holdings mf

export const Getuanexits = async (user_id, uan) => {

    try {
        const url = `${ExternalAPIListEndpoints.GETUANEXITS}?user_id=${user_id}&uan=${uan}&data_belongs_to=${DATA_BELONGS_TO}`;
        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const DeletEpfdata = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.DELETEEPFDATA, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Getepfdata = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.GETEPFDATA, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Sendepfotp = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.SENDEPFOTP, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Verifyepfotp = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.VERIFYEPFOTP, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// 

export const Finvulogin = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.FINVULOGIN, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Finvuconsentrequestplus = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.FINVUCONSENTREQUESTPLUS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const UPDATEEXTERNALSTOCKHOLDINGS = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.UPDATEEXTERNALSTOCKHOLDINGS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const AutoFetchFinvuData = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.AUTOFETCHFINVUDATA, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const GenerateParSnippet = async (payload) => {
    try {
        const response = await apiClient(ExternalAPIListEndpoints.GENERATEPARSNIPPET, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};