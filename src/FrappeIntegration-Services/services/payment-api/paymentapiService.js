import apiClient from "../apiClient"
import { PaymentappEndpoints } from "../../../constants"

export const getpricinglist = async (payload) => {
    try {
        const url = `${PaymentappEndpoints.GET_PRICING_PLAN_LIST}?for_crm=0`;
        const response = await apiClient(url, {
            method: 'GET',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Getcouponlist = async (payload) => {
    try {
        const response = await apiClient(PaymentappEndpoints.GETCOUPONLIST, {
            method: 'GET',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Getpaymentstatus = async (payload) => {
    try {
        let url = `${PaymentappEndpoints.GETPAYMENTSTATUS}?user_id=${payload["user_id"]}&data_belongs_to=${payload["data_belongs_to"]}`;

        if (payload["plan_name"]) {
            url += `&plan_name=${payload["plan_name"]}`;
        }
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const Createorderid = async (payload) => {
    try {
        const response = await apiClient(PaymentappEndpoints.CREATEORDERID, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const GetExpertDetails = async (plan_uuid) => {
    try {
        const response = await apiClient(PaymentappEndpoints.GETEXPERTDETAILS + "?plan_uuid=" + plan_uuid, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getndadoc = async (payload) => {
    try {
        const response = await apiClient(PaymentappEndpoints.GETNDADOC, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Getexpertnda = async (user_id, data_belongs_to) => {
    try {
        const url = `${PaymentappEndpoints.GETEXPERTNDA}?user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const Paymentfail = async (payload) => {
    try {
        const response = await apiClient(PaymentappEndpoints.PAYMENTFAIL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const Paymentsuccess = async (payload) => {
    try {
        const response = await apiClient(PaymentappEndpoints.GETPAYMENTSUCCESS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const RenewPayment = async (user_id) => {
    try {
        const response = await apiClient(`${PaymentappEndpoints.RENEW_PAYMENT}?user_id=${user_id}`, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Getbillingdetails = async (userId) => {
    try {
        const response = await apiClient(`${PaymentappEndpoints.GET_BILLING_DETAILS}?user_id=${userId}`, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const GetInvoiceList = async (userId, data_belongs_to) => {
    try {
        const response = await apiClient(`${PaymentappEndpoints.GET_INVOICE_LIST}?user_id=${userId}&data_belongs_to=${data_belongs_to}`, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};