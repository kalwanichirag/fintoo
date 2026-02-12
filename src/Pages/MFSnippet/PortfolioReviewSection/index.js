import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import BasicInfo from "./BasicInfo";
import ReviewPortfolio from "./ReviewPortfolio";
import ConnectWithExpert from "./ConnectWithExpert";
import {} from "../../../constants";
import { CHATBOT_BASE_API_URL } from "../../../constants";
import { fetchData, getPublicMediaURL } from "../../../common_utilities";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import axios from "axios";
import { SendMailFile, SendWsappMsgFile } from "../Service/MessagingService";
import { saveScreenReport } from "../../../Services/ReportService";
import { CustomPopupSection } from "../../../components/ThankyouSection";
import UserVerification from "../../../components/Pages/Calendly/UserVerification";
import { useDispatch, useSelector } from "react-redux";

const initialBasicInfo = {
    FullName: "",
    Email: "",
    Mobile: "",
    PAN: ""
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const PortfolioReviewSection = ({ logo }) => {

    const timeoutRef = useRef(null);

    const [bottomAlert, setBottomAlert] = useState({
        varient: '',
        message: '',
        show: false,
        sendToContact: false
    });
    const [currentTab, setCurrentTab] = useState(1);
    const [show, setShow] = useState(false);
    const [basicInfoCurrentStep, setBasicInfoCurrentStep] = useState(1);
    const [basicInfo, setBasicInfo] = useState(initialBasicInfo);
    const [mfSnippetData, seMfSnippetData] = useState({
        pdf_snippet_url: '',
        pdf_snippet_url_WA: '',
        total_current_value: ''
    });
    const [trxnId, setTrxnId] = useState(initialBasicInfo);
    const [utmSource, setUtmSource] = useState(27);
    const [tagval, setTagval] = useState(null);
    const [pageurl, setPageurl] = React.useState();

    const loggedIn = useSelector((state) => state.loggedIn);
    const [currAppointmentView, setCurrAppointmentView] = useState('VERIFICATION');
    const dispatch = useDispatch();
    const sendOTP = async (PAN, Mobile) => {
        try {
            let jwtTok = await getJwtToken();
            if (jwtTok.error_code == "100") {
                let trxnIdData = await getTransactionId(jwtTok.data.token);
                if (trxnIdData.error_code == "100") {
                    let trxnId = trxnIdData.data.data.data.transactionId;
                    let sendOTP = await sendSmallcaseOTP(trxnId, PAN, Mobile);
                    if (sendOTP.error_code == "100") {
                        setTrxnId(trxnId);

                        // toastr.options.positionClass = "toast-bottom-left";
                        // toastr.success("OTP sent successfully");

                        setBottomAlert({
                            varient: 'success',
                            message: "OTP sent successfully",
                            show: true
                        })

                        return true;
                    } else if (sendOTP.error_code == "102") {
                        // toastr.options.positionClass = "toast-bottom-left";
                        // toastr.error(sendOTP.message);

                        const isMismatch = sendOTP.message == 'Invalid PAN and Mobile combination';

                        if (isMismatch) {
                            setShow(true)
                        } else {
                            setBottomAlert({
                                varient: 'error',
                                // message: sendOTP.message == 'Invalid PAN and Mobile combination' ? 'PAN is not linked with the given mobile number' : sendOTP.message,
                                message: sendOTP.message,
                                show: true,
                                sendToContact: false
                            })
                        }



                        return false;
                    } else {
                        // toastr.options.positionClass = "toast-bottom-left";
                        // toastr.error(sendOTP);

                        setBottomAlert({
                            varient: 'error',
                            message: sendOTP.message,
                            show: true
                        })

                        return false;
                    }
                }
            }
            return false;
        } catch (e) {
            console.error(e);
            // toastr.options.positionClass = "toast-bottom-left";
            // toastr.error(e);

            setBottomAlert({
                varient: 'error',
                message: e,
                show: true
            })

            return false;
        }
    };

    const fetchEcasData = async () => {
        await sleep(20000);
        try {
            var myHeaders = new Headers();
            const jwtTok = await getJWTTokenEcas();
            myHeaders.append("gatewayauthtoken", 'Token ' + jwtTok);
            //myHeaders.append("gatewayauthname", GATEWAY_AUTH_NAME);
            myHeaders.append("gatewayauthname", GATEWAY_AUTH_NAME);

            const fetchEcasPayload = {
                "pan": basicInfo.PAN,
                "username": basicInfo.FullName,
                "email": basicInfo.Email,
                "mobile": parseInt(basicInfo.Mobile),
                "country_code": 91
            };

            // const fetchEcasPayload = {
            //     "pan": 'FKHPM0645H',
            //     "username": 'test name',
            //     "email": 'testemial@gmail.com',
            //     "mobile": parseInt('8452052245'),
            //     "country_code": 91
            // };

            try {
                const response = await fetch(CHATBOT_BASE_API_URL + "fetchecasdata1/", {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify(fetchEcasPayload),
                });
                if (response.ok) {
                    const result = await response.json();

                    if (result['error_code'] == "100") {

                        const pdf_snippet_url = result['data']['pdf_snippet'];
                        const pdf_snippet_url_WA = result['data']['pdf_snippet_WA'];
                        const total_current_value = result['data']['data']['total_current_value'];

                        seMfSnippetData({
                            pdf_snippet_url,
                            pdf_snippet_url_WA,
                            total_current_value
                        })

                        callbackCall(pdf_snippet_url, pdf_snippet_url_WA, total_current_value);

                        return true


                    } else if (result['error_code'] == "108") {
                        // toastr.options.positionClass = "toast-bottom-left";
                        // toastr.error("Looks like you don't have any investments!");

                        setCurrentTab(1)
                        setBasicInfoCurrentStep(2);

                        setBottomAlert({
                            varient: 'error',
                            message: "Looks like you don't have any investments!",
                            show: true
                        })

                        return false;
                    } else {
                        setCurrentTab(1)
                        setBasicInfoCurrentStep(2);

                        setBottomAlert({
                            varient: 'error',
                            message: "An error occurred while fetching your investment details. Please try again later. We apologise for the inconvenience.",
                            show: true
                        })

                        return false;
                    }
                }
                return false;
            } catch (e) {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    const callbackCall = async (file_attachment, pdf_snippet_url_WA, total_current_value) => {

        const payloadData = {
            "fullname": basicInfo.FullName,
            "mobile": basicInfo.Mobile,
            "mailid": basicInfo.Email,
            "country_code": "91",
            "tags": tagval ? tagval : "fintoo_mf_screening_report",
            "utm_source": 27,
            "service": 98,
            "skip_mail": "1",
            "skip_sms": "1",
            // "chatbot": "1",
            // "file_attachment": file_attachment,
        }
        try {
            var config = {
                method: "post",
                url: BASE_API_URL + 'restapi/callback/',
                data: payloadData,
            };

            var res = await axios(config);

            var response_obj = res.data
            if (response_obj.error_code == "0") {

                const saveScreenReportResponse = await saveScreenReport(response_obj.data.u_id, 'MF', total_current_value, pdf_snippet_url_WA);

                if (saveScreenReportResponse) {

                    const payloadData = {
                        mobile: parseInt(basicInfo.Mobile),
                        file_path: pdf_snippet_url_WA,
                        file_name: "MF Snippet",
                        whatsapp_file_msg: "Fintoo Snippets- MF Snippet.pdf",
                        whatsapp_msg: `Hi ${basicInfo.FullName}, \r\nThank you for downloading your Mutual Fund Snippet from Fintoo! \r\nTo help you make the most of your investment journey, we are offering you a 30-minute complimentary session with our Wealth Expert. Get personalized advice and answers to all your investment related questions.\r\nBook your session now: https://calendly.com/d/ckct-w7p-p4t/30-min-meeting-with-expert-review-your-portfolio?hide_event_type_details=1&hide_gdpr_banner=1\r\nFeel free to reach out if you have any questions!\r\nBest regards,\r\nThe Fintoo Team`
                    }

                    SendWsappMsgFile(payloadData);

                    const emailPayloadData = {
                        email: basicInfo.Email,
                        subject: 'Unlock Your Financial Potential with a Complimentary 30-Minute Session!',
                        templateName: 'mf_snippet_download.html',
                        contextvar: { client_name: basicInfo.FullName }
                    };

                    SendMailFile(emailPayloadData);

                    return true;
                } else {
                    return false;
                }


            } else {

                // toastr.options.positionClass = 'toast-bottom-left';
                // toastr.error(response_obj.data)

                setBottomAlert({
                    varient: 'error',
                    message: response_obj.data,
                    show: true
                })

                return false;
            }
        } catch (error) {
            return false;
        }
    }

    // const saveScreenReport = async (user_id, mf_portfolio_value, pdf_snippet_url_WA) => {

    //     const payloadData = {
    //         "user_id": user_id,
    //         "mf_portfolio_value": parseInt(mf_portfolio_value),
    //         "mf_screening_report_url": pdf_snippet_url_WA,
    //     }

    //     try {
    //         var config = {
    //             method: "post",
    //             url: BASE_API_URL + 'restapi/SaveScreeningReportApi/',
    //             data: payloadData,
    //         };

    //         var res = await axios(config);

    //         var response_obj = res.data
    //         if (response_obj.error_code == "100") {
    //             return true
    //         } else {
    //             return false
    //         }
    //     } catch (error) {
    //         return false
    //     }
    // }


    const getJwtToken = async () => {
        // try {
        //     var reqData = {
        //         method: "post",
        //         url: GET_JWTTOKEN_API_URL,
        //         data: {
        //             is_chat_bot: 1,
        //         },
        //     };

        //     let jwtTok = await fetchData(reqData);
        //     if (jwtTok.error_code == "100") return jwtTok;
        //     return setBottomAlert({
        //         varient: 'error',
        //         message: 'Something went wrong!',
        //         show: true
        //     })
        // } catch (e) {
        //     console.error(e);
        // }
    };

    const getJWTTokenEcas = async () => {
        const headers = new Headers();

        headers.append('Content-Type', 'application/json');
        const payload = {
            //"username": "localfrontend",
            //"password": "localfrontend@123",
            "username": "stgfintoo",
            "password": "stgfintoo@123",
        };
        const response = await fetch(CHATBOT_BASE_API_URL + "api/token/", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });
        if (response.ok) {
            const result = await response.json();
            return result.data.token;
        }
    };

    const getTransactionId = async (jwtToken) => {
        // try {
        //     let trxnId = await fetchData({
        //         method: "post",
        //         url: GETTRANSACTION_API_URL,
        //         data: {
        //             token: jwtToken,
        //         },
        //     });
        //     if (trxnId.error_code == "100") return trxnId;

        //     return setBottomAlert({
        //         varient: 'error',
        //         message: 'Something went wrong!',
        //         show: true
        //     })
        // } catch (e) {
        //     console.error(e);
        // }
    };

    const sendSmallcaseOTP = async (trxnId, PAN, Mobile) => {
        // try {
        //     let payload = {
        //         method: "post",
        //         url: SEND_SC_OTP_API_URL,
        //         data: {
        //             transactionId: trxnId,
        //             pan: PAN,
        //             phone: Mobile,
        //         },
        //         // headers: { ...restHeaders },
        //     };

        //     let sendOTP = await fetchData(payload);
        //     if (sendOTP.error_code == "100") {
        //         return sendOTP;
        //     } else if (sendOTP.error_code == "102") {
        //         return sendOTP;
        //     }

        //     return setBottomAlert({
        //         varient: 'error',
        //         message: 'Something went wrong!',
        //         show: true
        //     })

        // } catch (e) {
        //     console.error(e);
        // }
    };

    const basicInfoTabClick = () => {
        setCurrentTab(1)
        if (basicInfo.Mobile != "" && basicInfo.PAN != "") {
            setBasicInfoCurrentStep(2)
        } else {
            setBasicInfoCurrentStep(1)
        }
    }

    const handleLoggedInCase = () => {
        setTimeout(() => {
            assignUserData()
        }, 2000)
    }
    useEffect(() => {
        if (bottomAlert.show) {

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setBottomAlert({
                    varient: '',
                    message: '',
                    show: false,
                    sendToContact: false
                });
            }, 10000)
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [bottomAlert])
    const assignUserData = () => {
        const userid = getUserId();

        let member = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
        let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser")));

        const membertUserData = member.filter(data => data.id == userid)[0];
        const currentUserData = users.filter(data => data.id == userid)[0]

        dispatch({
            type: "SET_LEAD_DATA", payload: {
                fullname: membertUserData?.name,
                mobile: currentUserData?.mobile,
                email: currentUserData?.email
            }
        });

        setCurrAppointmentView('CALENDLY');
    }

    useEffect(() => {
        Boolean(loggedIn) == false ? setCurrAppointmentView('VERIFICATION') : handleLoggedInCase();
    }, [loggedIn])
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const source = urlParams.get('utm_source');
        const tag = urlParams.get('tags');
        if (source) {
            setUtmSource(source);
        }

        if (tag) {
            setTagval(tag);
        }
        setPageurl(window.location.pathname);
    }, []);

    return (
        <div className={`${styles.PortfolioReviewSection}`} style={{ marginTop: '1px' }}>
            <div className={`text-center ${styles.GlobalText2}`}>
            Get tailored insights and strategic recommendations <br /> from qualified wealth advisors at Fintoo
            </div>
            {/* <div style={{ color: 'red', textAlign: 'center', paddingTop: '1.5rem' }}>
                Something went wrong, please try again.
            </div> */}

            {/* <div style={{ paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertComponent variant={'error'} message={'Something went wrong, please try again.'} timeout={10000} closeError={() => { }} />
            </div> */}

            <div style={{ paddingTop: '1.5rem' }} className={` ${styles.PortfolioReviewSectionStepsContainer}`}>
                <div className={`${styles.CalendlySectionText}`}>
                    <h1 >
                  
                        <span style={{ color: 'rgb(221, 115, 0)' }}> Book A Complimentary Session At Your Time of Convenience. </span>
                    </h1>
                </div>
                {
                    currAppointmentView === 'VERIFICATION' && <UserVerification logo={logo} setCurrAppointmentView={setCurrAppointmentView} />
                }

                {
                    currAppointmentView === 'CALENDLY' && <div className={`${styles["appointment-section-iframe"]}`}>
                        <div
                            className="calendly-inline-widget"
                            style={{
                                width: "100%",
                            }}
                        >
                            {/* <Calendar extraParams={extraParams} eventCode={eventCode} url={`https://calendly.com/fintoo/test-clone-clone?hide_event_type_details=1`} serviceName={serviceName} planId={planId} SetShow={SetShow} /> */}
                            <ConnectWithExpert
                                setCurrentTab={setCurrentTab} setBasicInfoCurrentStep={setBasicInfoCurrentStep} setBasicInfo={setBasicInfo} basicInfo={basicInfo} file_attachment={mfSnippetData.pdf_snippet_url}
                                pageurl={pageurl}
                                utmSource={utmSource}
                                tagval={tagval}
                            />
                        </div>
                    </div>
                }


            </div>
        </div>

    );
};

export default PortfolioReviewSection;
