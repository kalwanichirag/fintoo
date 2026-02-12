
import { useEffect, useState } from "react";
import { BASE_API_URL, CHATBOT_BASE_API_URL, CHATBOT_TOKEN_PASSWORD, CHATBOT_TOKEN_USERNAME, GATEWAY_AUTH_NAME } from "../../../../constants";
import BasicInfo from "./BasicInfo";
import OtpView from "./OtpView";
import ThankyouSection, { ThankyouSectionInline } from "../../../../components/ThankyouSection";
import { apiCall } from "../../../../common_utilities";
import { CRMCallback } from "../../../../Services/CallbackService";
import { SendMailFile, SendWsappMsgFile } from "../../../../Services/MessagingService";
import axios from "axios";
import styles from "../style.module.css";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import FintooLoader from "../../../../components/FintooLoader";

const BasicInfoComponent = ({
    basicInfo,
    setBasicInfo,
    basicInfoCurrentStep,
    setBasicInfoCurrentStep,
}) => {

    const [show, SetShow] = useState(false);
    const [token, SetToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const queryParams = new URLSearchParams(window.location.search);

    const utm_source = queryParams.get('utm_source');

    // const handleClose = () => {
    //     SetShow(false);
    // }

    const sendOtp = async (Mobile) => {
        try {
            const result = await apiCall(
                BASE_API_URL + "restapi/sendotpapi/",
                {
                    mobile_number: Mobile + ""
                },
                false,
                false
            );

            if (result.error_code != 100) {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error(result.message);
                return false
            } else {
                return true
            }
        } catch (error) {
            return false
        }

    }

    const handleSuccessfulVerification = async () => {

        setLoading(true);

        const callbackResult = await handleCallback();

        setLoading(false);

        if (callbackResult) {
            sendEmailToUser();
            // sendWhatsappToUser();
            SetShow(true);
        } else {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("We encountered an error while processing your information. Please try again!");
            SetShow(false);
            setBasicInfoCurrentStep(1);
        }
    }

    const handleCallback = async () => {

        // const CRMCallbackFun = async (payload) => {
        //     return new Promise((resolve, reject) => {
        //         CRMCallback(payload, (error, response) => {
        //             if (error || response == false) return reject(error);
        //             resolve(response);
        //         });
        //     });
        // };

        // const promises = basicInfo.IntereatAreas.map(async (data) => {
        //     const callbackPayload = {
        //         "fullname": basicInfo.FullName,
        //         "mobile": basicInfo.Mobile,
        //         "mailid": basicInfo.Email,
        //         "country_code": "91",
        //         "tags": data.value,
        //         "utm_source": utm_source ? utm_source : 27,
        //         "service": data.service_id,
        //         "status": "Introductory meet",
        //         "skip_mail": "1",
        //         "skip_sms": "1",
        //     };

        //     try {
        //         await CRMCallbackFun(callbackPayload);
        //     } catch (error) {
        //         console.error(`Error processing data with service_id: ${data.service_id}`, error);
        //     }
        // });

        // Promise.all(promises).then(() => {
        //     return true
        // }).catch((error) => {
        //     return false
        // });

        for (const data of basicInfo.IntereatAreas) {

            const callbackPayload = {
                "fullname": basicInfo.FullName,
                "mobile": basicInfo.Mobile,
                "mailid": basicInfo.Email,
                "country_code": "91",
                "tags": data.value,
                "utm_source": utm_source ? utm_source : 27,
                "service": data.service_id,
                "status": "Introductory meet",
                "skip_mail": "1",
                "skip_sms": "1",
            }

            try {
                const result = await CRMCallback(callbackPayload); // Wait for the current task to complete

                if (result == false) {
                    return false
                }

            } catch (error) {
                return false
            }
        }

        return true;
    };

    const sendEmailToUser = async () => {

        const attachmentArry = []
        const attachmentNameArry = []

        if (basicInfo.IntereatAreas.some(data => { return data.serialNo == 1 || data.serialNo == 2 || data.serialNo == 3 || data.serialNo == 4 })) {
            const pranamProfile = await getAttachmentUrl("service_interest_profiles", "PRNAM Profile.pdf");
            attachmentArry.push(pranamProfile);
            attachmentNameArry.push("PRNAM Profile");
        }

        if (basicInfo.IntereatAreas.some(data => { return data.serialNo == 5 })) {
            const fintooGlobalInvestment = await getAttachmentUrl("service_interest_profiles", "Fintoo Global Investments.pdf");
            attachmentArry.push(fintooGlobalInvestment);
            attachmentNameArry.push("Fintoo Global Investments");
        }

        if (basicInfo.IntereatAreas.some(data => { return data.serialNo == 6 || data.serialNo == 7 })) {
            const wealthTechBrochure = await getAttachmentUrl("service_interest_profiles", "FINTOO Profile.pdf");
            attachmentArry.push(wealthTechBrochure);
            attachmentNameArry.push("FINTOO Profile");
        }

        const emailPayload = {
            "email": basicInfo.Email,
            "subject": "Exciting Financial Opportunities Await – Explore What’s Next",
            "templateName": "connect_with_us.html",
            "contextvar": {
                "client_name": basicInfo.FullName,
                "attachment_name": attachmentNameArry
            },
            "attachment": attachmentArry
        }

        SendMailFile(emailPayload);

        sendWhatsappToUser(attachmentArry, attachmentNameArry);

    }

    const sendWhatsappToUser = async (attachmentArry, attachmentNameArry) => {

        const whatsappTextPayload = {
            "mobile": basicInfo.Mobile,
            "whatsapp_msg": `Hi ${basicInfo.FullName},\r\nThank you for registering with Fintoo!\r\nAs promised, here's a detailed PDF about the services you chose while registering.\r\nWe are excited to be a part of your journey. Let's change the financial landscape in India together.\r\nLooking forward to connecting soon!`,
        }

        await SendWsappMsgFile(whatsappTextPayload);

        for (let i = 0; i < attachmentArry.length; i++) {
            const whatsappFilePayload = {
                "mobile": basicInfo.Mobile,
                // "whatsapp_file_msg": `Fintoo Snippets- ${attachmentNameArry[i]}`,
                "whatsapp_file_msg": `Kindly download the ${attachmentNameArry[i]} PDF.`,
                "file_name": attachmentNameArry[i],
                "file_path": attachmentArry[i]
            }

            SendWsappMsgFile(whatsappFilePayload);

        }
    }

    const getAttachmentUrl = async (filePath, fileName) => {
        try {
            const myHeaders = {
                'gatewayauthtoken': 'Token ' + token,
                'gatewayauthname': GATEWAY_AUTH_NAME
            };

            var config = {
                method: "post",
                url: CHATBOT_BASE_API_URL + "readfiles3/",
                headers: myHeaders,
                data: {
                    "remote_path": filePath,
                    "file_name": fileName
                },
            };

            const response = await axios(config);

            if (response.data.error_code == 100) {

                return response.data.data.file_url;
            } else {
                return ""
            }

        } catch (error) {
            return ""
        }
    }

    const getJWTToken = async () => {
        const headers = new Headers();

        headers.append('Content-Type', 'application/json');
        const payload = {
            "username": CHATBOT_TOKEN_USERNAME,
            "password": CHATBOT_TOKEN_PASSWORD
        };
        const response = await fetch(CHATBOT_BASE_API_URL + "api/token/", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });
        if (response.ok) {
            const result = await response.json();
            SetToken(result.data.token);
        }
    };

    useEffect(() => {
        getJWTToken()
    }, [basicInfo])

    return (
        <div style={{ width: '100%', marginTop: '1px' }}>
            {
                show ?
                    <div className={`${styles.PortfolioReviewSectionStepsContainer}`}>
                        <ThankyouSectionInline />
                    </div>
                    :
                    <div style={{ width: '100%' }}>
                        {
                            loading ? <div style={{ textAlign: 'center' }}>
                                {/* <img style={{ width: '150px' }} src={process.env.PUBLIC_URL + "/static/media/Loader.gif"} /> */}
                                <FintooLoader isLoading={isLoading} />
                            </div> :
                                < div style={{ paddingTop: '1.5rem' }} className={`${styles.PortfolioReviewSectionStepsContainer}`}>
                                    {
                                        basicInfoCurrentStep == 1 && <BasicInfo
                                            setBasicInfoCurrentStep={setBasicInfoCurrentStep}
                                            basicInfo={basicInfo}
                                            setBasicInfo={setBasicInfo}
                                            sendOtp={sendOtp}
                                        />
                                    }
                                    {
                                        basicInfoCurrentStep == 2 && <OtpView
                                            setBasicInfoCurrentStep={setBasicInfoCurrentStep}
                                            basicInfo={basicInfo}
                                            setBasicInfo={setBasicInfo}
                                            sendOtp={sendOtp}
                                            handleSuccessfulVerification={handleSuccessfulVerification}
                                        />
                                    }
                                </ div>
                        }
                    </div>
            }
        </div>
    );
};

export default BasicInfoComponent;
