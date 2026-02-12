import { financialPlanningReportsEndpoints } from "../../../../constants";
import apiClient from "../../apiClient";

// std useful dynamic values
const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
let user_id = user_data.user_id;
let data_belongs_to = process.env.REACT_APP_DATA_BELONGS_TO;

// get_plan_of_action
export const GetPlanOfAction = async () => {
    try {
        const url = `${financialPlanningReportsEndpoints.GET_PLAN_OF_ACTION}?user_id=${user_id}&data_belongs_to=${data_belongs_to}`;
        const response = await apiClient(url, {
            method: 'GET',
            // body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// let response1 = {
//     "status_code": "200",
//     "message": "Data is available",
//     "data": {
//         "mutual_funds": [
//             {
//                 "97": {
//                     "pmt_sum": 32034.19,
//                     "pv_sum": 2492440,
//                     "order": 3,
//                     "name": "Small Cap Equity"
//                 },
//                 "98": {
//                     "pmt_sum": 3268184.01,
//                     "pv_sum": 16622539,
//                     "order": 2,
//                     "name": "Mid Cap Equity"
//                 },
//                 "99": {
//                     "pmt_sum": 1637562.86,
//                     "pv_sum": 8076398,
//                     "order": 1,
//                     "name": "Large Cap Equity"
//                 },
//                 "100": {
//                     "pmt_sum": 0,
//                     "pv_sum": 0,
//                     "order": 6,
//                     "name": "Short Term Debt"
//                 },
//                 "101": {
//                     "pmt_sum": 0,
//                     "pv_sum": 0,
//                     "order": 5,
//                     "name": "Mid Term Debt"
//                 },
//                 "102": {
//                     "pmt_sum": 0,
//                     "pv_sum": 0,
//                     "order": 4,
//                     "name": "Long Term Debt"
//                 },
//                 "103": {
//                     "pmt_sum": 3291643.54,
//                     "pv_sum": 18070276,
//                     "order": 7,
//                     "name": "Hybrid"
//                 }
//             }
//         ],
//         "life_insurance_recomm": -104103532,
//         "life_insurance_existing": 23002492,
//         "lifeinsurance": [
//             {
//                 "id": 1,
//                 "insurance": -104103532,
//                 "name": "Life Insurance"
//             }
//         ],
//         "total_pvsum": 45261653,
//         "total_pmtsum": 8229424.6
//     }
// }