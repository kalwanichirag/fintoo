
import { InlineWidget } from "react-calendly";
import styles from "./style.module.css";
import ThankyouSection from "../../../components/ThankyouSection";
import Calendar from '../../../components/Pages/Calendly/Calendar'
import { useState } from "react";
import { useDispatch } from "react-redux";
import {} from "../../../constants";
import axios from "axios";
import { fetchData } from "../../../common_utilities";
import { useNavigate } from "react-router-dom";

const ConnectWithExpert = ({ setCurrentTab, setBasicInfoCurrentStep, setBasicInfo, basicInfo, pdf_snippet_url, pdf_snippet_url_WA, total_current_value, utmSource, tagval, pageurl }) => {


    const dispatch = useDispatch();

    const [show, SetShow] = useState(false);

    const navigate = useNavigate();

    const closeThankuPopUp = () => {

        setBasicInfo({
            FullName: "",
            Email: "",
            Mobile: "",
            PAN: ""
        })
        dispatch({
            type: "SET_LEAD_DATA", payload: {
                fullname: '',
                mobile: '',
                email: ''
            }
        });

        setCurrentTab(1);
        setBasicInfoCurrentStep(1);

        navigate('/')
    }

    const calendlyCallbackFunMFSnippet = async (FullName, Email, Mobile) => {
        const payloadData = {
            "fullname": basicInfo.FullName ? basicInfo.FullName : FullName,
            // "mobile": basicInfo.Mobile ? basicInfo.Mobile : Mobile.replace(/^(\+91|91)?\s*/, ''),
            "mobile": basicInfo.Mobile ? basicInfo.Mobile : Mobile,
            "mailid": basicInfo.Email ? basicInfo.Email : Email,
            "country_code": "91",
            "tags": tagval ? tagval : "fintoo_mf_screening_report",
            "utm_source": utmSource ? utmSource : 27,
            "service": 25,
            "status": "Introductory meet",
            "skip_mail": "1",
            "skip_sms": "1",
        }

        try {
            var config = {
                method: "post",
                url: BASE_API_URL + 'restapi/callback/',
                data: payloadData,
            };

            var res = await axios(config);

            window.dataLayer = window.dataLayer || [];
            function gtag() { window.dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'AW-11313015202');

            try {
                gtag('event', 'conversion', { 'send_to': 'AW-11313015202/j3glCJXmhIUZEKLTu5Iq' });
            } catch (error) {
                console.error('Error sending conversion event', error);
            }

            var response_obj = res.data
            if (response_obj.error_code == "0") {

            } else {
            }
        } catch (error) {
            return false;
        }

    }

    return (
        <div className={`${styles.ConnectWithExpertContainer}`} >
            <Calendar eventCode={"fintoo_mf_screening_report"} url={"https://calendly.com/d/ckct-w7p-p4t/30-min-meeting-with-expert-review-your-portfolio?hide_event_type_details=1&hide_gdpr_banner=1"} serviceName={"Financial Planning"} planId={"08"} SetShow={SetShow} calendlyCallbackFunMFSnippet={calendlyCallbackFunMFSnippet} />
            {show && <ThankyouSection onClose={() => closeThankuPopUp()} />}
        </div>

    );
};

export default ConnectWithExpert; 
