import axios from "axios";
import { BASE_API_URL } from "../constants";

export const CRMCallback = async (payloadData) => {

    try {
        var config = {
            method: "post",
            // url: BASE_API_URL + 'restapi/callback/',
            data: payloadData,
        };

        var res = await axios(config);

        var response_obj = res.data
        if (response_obj.error_code == "0") {
            return true;
        } else {
            return false;
        }


    } catch (error) {
        return false;
    }

}