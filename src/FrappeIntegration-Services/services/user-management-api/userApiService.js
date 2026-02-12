import { userManagementEndpoints, DATA_BELONGS_TO, financialplanningInsuranceEndpoints } from "../../../constants";
import apiClient from "../apiClient"
import Cookies from "js-cookie";

// CHECK_EMAIL API
export const checkEmail = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.CHECK_EMAIL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;

    } catch (error) {
        throw error;
    }
};
export const checkEmail1 = async (email) => {
    try {
        const response = await apiClient(userManagementEndpoints.CHECK_EMAIL, {
            method: 'POST',
            body: JSON.stringify({
                "email": email,
                "data_belongs_to": DATA_BELONGS_TO
            })
        });

        return response;

    } catch (error) {
        throw error;
    }
};

// UPDATE_EMAIL API
export const updateEmail = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.UPDATE_EMAIL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;

    } catch (error) {
        throw error;
    }
};

// CHECK_MOBILE API
export const checkMobile = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.CHECK_MOBILE, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// SEND_OTP API
export const sendOTP = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.SEND_OTP, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// VERIFY_OTP API
export const verifyOTP = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.VERIFY_OTP, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// REGISTER API
export const userRegister = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.REGISTER, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// REGISTER API
export const userLogin = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.LOGIN, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const userLogout = async () => {
    try {
    if (window.webengage && window.webengage.user) {
      window.webengage.user.logout();
    }
  } catch (err) {
    console.error("WebEngage logout failed", err);
  }
    Cookies.remove('token');
    Cookies.remove('user_data');
    localStorage.removeItem('auth_view');
    localStorage.removeItem('verification_flow');
    localStorage.clear();
    window.location.href = '/login';

};

// REGISTER_MOBILE API
export const registerMobile = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.REGISTER_MOBILE, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// SET_RESET_PIN API
export const setUpdatePin = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.SET_RESET_PIN, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};
// RESET_PIN API
export const resetPin = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.RESET_PIN, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// VERIFY_PIN API
export const verifyPin = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.VERIFY_PIN, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const updateBasicDetails = async (payload) => {

    try {
        const response = await apiClient(userManagementEndpoints.UPDATE_BASIC_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const fetchUserProfileDetails = async (userId) => {

    try {
        const response = await apiClient(`${userManagementEndpoints.FETCH_USER_PROFILE_DETAILS}?user_id=${userId}&data_belongs_to=${DATA_BELONGS_TO}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getOccupationList = async () => {

    try {
        const response = await apiClient(userManagementEndpoints.GET_OCCUPATION_LIST, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getExpertDetails = async (plan_uuid) => {

    try {
        const response = await apiClient(`${userManagementEndpoints.GET_EXPERT_DETAILS}?plan_uuid=${plan_uuid}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw error;
    }
};


export const generateLead = async (payload) => {

    try {
        const response = await apiClient(userManagementEndpoints.GENERATE_LEAD, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};


export const sendMail = async (payload) => {

    try {
        const response = await apiClient(userManagementEndpoints.SEND_EMAIL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};


export const sendSMS = async (payload) => {

    try {
        const response = await apiClient(userManagementEndpoints.SEND_SMS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};




export const getRelationList = async () => {

    try {
        const response = await apiClient(userManagementEndpoints.GET_RELATION_LIST, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getRiskAppetiteQuestionsList = async () => {

    try {
        const response = await apiClient(userManagementEndpoints.FETCH_RISK_QUESTIONS, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getUserRiskQuestionAnswers = async (id) => {

    try {
        const response = await apiClient(`${userManagementEndpoints.FETCH_USER_RISK_ANSWERS}?user_id=${id}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateUserRiskAnswers = async (payload) => {

    try {
        const response = await apiClient(`${userManagementEndpoints.ADD_UPDATE_USER_RISK_ANSWERS}`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const fetchDefaultInflation = async () => {

    try {
        const response = await apiClient(`${userManagementEndpoints.FETCH_DEFAULT_INFLATION}`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const fetchDefaultAssumptions = async () => {

    try {
        const response = await apiClient(`${userManagementEndpoints.FETCH_DEFAULT_ASSUMPTION}`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const fetchUserInflation = async (id) => {

    try {
        const response = await apiClient(`${userManagementEndpoints.FETCH_USER_INFLATION}?user_id=${id}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const fetchUserAssumption = async (id) => {

    try {
        const response = await apiClient(`${userManagementEndpoints.FETCH_USER_ASSUMPTION}?user_id=${id}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateUserSettingData = async (payload) => {

    try {
        const response = await apiClient(`${userManagementEndpoints.UPDATE_USER_SETTING_DATA}`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getRecContingencyRisk = async (id) => {

    try {
        const response = await apiClient(`${userManagementEndpoints.GET_RECCONTINGENCY_RISK}?user_id=${id}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw error;
    }
};
// ---------------------------------------------------------------------- members API --------------------------------------------------------------------------
export const getMemberDetails = async (userId, parentUserId) => {
    try {
        const response = await apiClient(
            `${userManagementEndpoints.GET_MEMBER_DETAILS}?user_id=${userId}&parent_user_id=${parentUserId}`,
            {
                method: 'GET'
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};
export const getFamilyMember = async (userId) => {
    try {
        const response = await apiClient(`${userManagementEndpoints.GET_FAMILY_MEMBER}?user_id=${userId}`,
            {
                method: 'GET'
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const getFamilyMember1 = async (userId) => {
    try {
        const response = await apiClient(`${userManagementEndpoints.GET_FAMILY_MEMBER}?user_id=${userId}`,
            {
                method: 'GET'
            }
        );

        return response;
    } catch (error) {
        throw error;
    }
};
export const deleteFamilyMember = async (payload) => {
    try {
        const response = await apiClient(
            `${userManagementEndpoints.DELETE_FAMILY_MEMBER}`,
            {
                method: 'DELETE',
                body: JSON.stringify(payload)
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const addFamilyMember = async (payload) => {
    try {
        const response = await apiClient(`${userManagementEndpoints.ADD_FAMILY_MEMBER}`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateFamilyMember = async (payload) => {
    try {
        const response = await apiClient(`${userManagementEndpoints.UPDATE_FAMILY_MEMBER}`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// CHECK_pan API
export const checkPan = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.CHECK_PAN, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;

    } catch (error) {
        throw error;
    }
};

export const getmedicalInsuranceApi = async (userId) => {
    try {
        const response = await apiClient(`${financialplanningInsuranceEndpoints.GET_MEDICAL_INSURANCE}?user_id=${userId}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// Check All status API

export const check_all_status_api = async (userId) => {
    try {
        const response = await apiClient(
            `${userManagementEndpoints.CHECK_ALL_STATUS_API}?user_id=${userId}`,
            {
                method: 'GET'
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};


export const deteleBankDetails = async (payload) => {

    try {
        const response = await apiClient(userManagementEndpoints.DELETE_BANK_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateOpportunityStatus = async (payload) => {

    try {
        const response = await apiClient(userManagementEndpoints.UPDATE_CUSTOM_OPPORTUNITY_STATUS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        throw error;
    }
};



