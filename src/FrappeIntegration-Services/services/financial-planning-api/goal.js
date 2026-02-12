import apiClient from "../apiClient"
import { financialplanninggoalEndpoints, ADVISORY_GET_GOAL_SUMMARY, DATA_BELONGS_TO } from "../../../constants";
// import { financialplanninggoalEndpoints } from "../apiEndpoints"

// GET_USER_GOAL_CATEGORIES_LIST
export const getGoalCategoryList = async () => {
    try {
        const response = await apiClient(financialplanninggoalEndpoints.GET_USER_GOAL_CATEGORIES, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// GET_USER_GOAL_DEATILS_LIST
export const getGoalDetails = async (user_id) => {
    try {

        const url = `${financialplanninggoalEndpoints.GET_USER_GOAL_DETAILS}?data_belongs_to=${DATA_BELONGS_TO}&user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getGoalDetailsByGoalId = async (goal_id) => {

    try {
        const url = `${financialplanninggoalEndpoints.GET_USER_GOAL_DETAILS}?data_belongs_to=${DATA_BELONGS_TO}&goal_id=${goal_id}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const getGoalDetailsByFilterType = async (user_id, filter_type) => {
    try {
        // Use the working goal summary endpoint instead of the non-existent get_user_goal_details
        const url = `${financialplanninggoalEndpoints.GET_USER_GOAL_DETAILS}?user_id=${user_id}&data_belongs_to=${DATA_BELONGS_TO}&filter_type=${filter_type}`;
        const response = await apiClient(url, {
            method: 'GET'
        });

        // Transform the response to match the expected format
        // if (response && response.status_code === "200") {
        //     debugger
        //     // Extract goals from the goal_api_data if available
        //     let goals = [];
        //     let countData = {
        //         total: 0,
        //         achieved_goal_data: 0,
        //         pending_goal_data: 0,
        //         upcoming_goal_data: 0
        //     };

        //     if (response.goal_api_data && response.goal_api_data.data) {
        //         const goalApiData = response.goal_api_data.data;
                
        //         // Combine all goal types
        //         const goalAchieved = goalApiData.goal_achieved || [];
        //         const goalUnderachieved = goalApiData.goal_underachieved || [];
        //         const goalOverachieved = goalApiData.goal_overachieved || [];
                
        //         goals = [...goalAchieved, ...goalUnderachieved, ...goalOverachieved];
                
        //         // Calculate counts
        //         countData.total = goals.length;
        //         countData.achieved_goal_data = goalAchieved.length;
        //         countData.pending_goal_data = goalUnderachieved.length;
        //         countData.upcoming_goal_data = goalOverachieved.length;
        //     }

        //     return {
        //         status_code: "200",
        //         data: goals,
        //         count_data: countData
        //     };
        // }

        return response;
    } catch (error) {
        console.error("Error fetching goal details:", error);
        throw error;
    }
};



// ADD_USER_GOAL_DETAILS
export const addGoalDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanninggoalEndpoints.ADD_USER_GOAL_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const generateRecordentToken = async (payload) => {
    try {
        const response = await apiClient(financialplanninggoalEndpoints.GENERATE_RECORDENT_TOKEN, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const sendRecordentOtp = async (payload) => {
    try {
        const response = await apiClient(financialplanninggoalEndpoints.SEND_RECORDENT_OTP, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};
export const resendRecordentOtp = async (payload) => {
    try {
        const response = await apiClient(financialplanninggoalEndpoints.RESEND_RECORDENT_OTP, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};
export const verifyRecordentOtp = async (payload) => {
    try {
        const response = await apiClient(financialplanninggoalEndpoints.VERIFY_RECORDENT_OTP, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};
export const fetchRecordentReport = async (payload) => {
    try {
        const response = await apiClient(financialplanninggoalEndpoints.FETCH_RECORDENT_REPORT, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// UPDATE_USER_GOAL_DETAILS
export const UpdateGoalDetails = async (payload, income_id) => {
    try {
        const response = await apiClient(financialplanninggoalEndpoints.UPDATE_USER_GOAL_DETAILS, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};



// DELETE_USER_GOAL_DETAILS
export const deleteGoalDetails = async (payload) => {
    try {
        const response = await apiClient(financialplanninggoalEndpoints.DELETE_USER_GOAL_DETAILS, {
            method: 'DELETE',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};