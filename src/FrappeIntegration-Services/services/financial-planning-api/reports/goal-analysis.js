import { financialplanninggoalEndpoints } from "../../../../constants";
import apiClient from "../../apiClient";

// std useful dynamic values
const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
let user_id = user_data.user_id;
let data_belongs_to = process.env.REACT_APP_DATA_BELONGS_TO;

// get_final_goal_recommendations
export const GetFinalGoalRecommendation = async () => {

    try {
        const url = `${financialplanninggoalEndpoints.GET_FINAL_GOAL_RECOMMENDATION}?user_id=${user_id}`;
        const response = await apiClient(url, {
            method: 'GET',
            // body: JSON.stringify(payload)
        });
       
        return response;
    } catch (error) {
        throw error;
    }
};
