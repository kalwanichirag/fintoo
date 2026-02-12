import axios from "axios";
import { BASE_API_URL } from "../constants";

export const saveScreenReport = async (user_id, report_type, mf_portfolio_value, pdf_snippet_url_WA) => {

    const payloadData = {
        "user_id": user_id,
        "report_type": report_type,
        // "mf_portfolio_value": parseInt(mf_portfolio_value),
        "report_url": pdf_snippet_url_WA,
    }

    if (report_type == 'MF') {
        payloadData.mf_portfolio_value = parseInt(mf_portfolio_value)
    }

    try {
        var config = {
            method: "post",
            // url: BASE_API_URL + 'restapi/SaveReportApi/',
            data: payloadData,
        };

        var res = await axios(config);

        var response_obj = res.data
        if (response_obj.error_code == "100") {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

export const getReports = async (idArr, report_type) => {

    const payloadData = {
        "user_id": idArr,
        "report_type": report_type,
    }

    try {
        var config = {
            method: "post",
            // url: BASE_API_URL + 'restapi/GetReportApi/',
            data: payloadData,
        };

        var res = await axios(config);

        var response_obj = res.data

        if (response_obj.error_code == "100") {
            return {
                data: response_obj.data,
                message: response_obj.message
            }
        } else {
            return {
                data: [],
                message: response_obj.message
            }
        }
    } catch (error) {
        return false
    }
}