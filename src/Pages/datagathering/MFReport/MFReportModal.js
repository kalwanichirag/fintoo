import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Styles from '../DG.module.css'

import * as BootModal from "react-bootstrap";
import InitialView from "./InitialView";
import DetailsView from "./DetailsView";
import OtpView from "./OtpView";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { CHECK_SESSION, DATA_BELONGS_TO, SMALLCASE_GATEWAY } from "../../../constants";
import { apiCall, loginRedirectGuest, restApiCall, getParentUserId, getItemLocal, fetchData, setItemLocal } from "../../../common_utilities";
import PortfolioBalance from "../../../components/PortfolioBalance";
import { } from "../../../constants";
import { useDispatch } from "react-redux";
import { CHATBOT_BASE_API_URL, FINTOO_BASE_API_URL } from "../../../constants";
import commonEncode from "../../../commonEncode";
import { useSelector } from "react-redux";
import axios from "axios";
import { saveScreenReport } from "../../../Services/ReportService";
import { Fetchecasdatadetails, GenerateJWTToken, GettransactionID, sendSmallcaseOTP, Verifysmallcasemfotp } from "../../../FrappeIntegration-Services/services/financial-planning-api/externalApi";
import { checkPan } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { GenerateParSnippet } from "../../../FrappeIntegration-Services/services/External-api/externalApi";
import SmallcaseGateway from "../../../components/SmallcaseGateway/SmallcaseGateway";





const MFReportModal = (props) => {
    const dispatch = useDispatch();
    const location = useLocation();


    const [session, setSession] = useState("");

    const [currView, setCurrView] = useState('INITIAL');
    // const [currView, setCurrView] = useState('OTP');
    const [showGateway, setShowGateway] = useState(false);
    const [smallcaseTrxnId, setSmallcaseTrxnId] = useState("");
    const [smallcaseAuthToken, setSmallcaseAuthToken] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [casResponse, setCasResponse] = useState("");
    const [mfToken, setMfToken] = useState("");
    // const [casResponse, setCasResponse] = useState("");
    const [modalType, setModalType] = useState(0);
    const [otpInput, setOtpInput] = useState("");
    const timer = useRef({ obj: null, counter: 120, default: 120 });
    const [count, setCount] = useState(120);
    const [selectedMember, setSelectedMember] = useState({});
    const [panEditable, setPanEditable] = useState(false);
    const [restHeaders, setRestHeaders] = useState({});
    const [errors, setErrors] = useState({});
    const [showlinkac, setShowLinkAc] = useState(false);
    const [waitforSms, setWaitforSms] = useState(false);
    const [allMembers, setAllMembers] = useState([]);
    const [sendDisabled, setSendDisabled] = useState(true);
    const [token, setToken] = useState(null);
    const [mFScreeningPDF, setMFScreeningPDF] = useState(null);
    const [mfAmount, setMfAmount] = useState(null);
    const [ecasData, setEcasData] = useState([]);
    const [errorMsg, setErrormsg] = useState("");

    const interval = useRef(null);
    const stopSmallCase = useRef(false);
    const par_pan_mobile_prefilled = useSelector((state) => state.par_pan_mobile_prefilled);
    const member_data = useSelector((state) => state.member_data);
    const [errorMessage, setErrorMessage] = useState();

    const [isLoading, setIsLoading] = useState(false)

    const timeNewObj = useRef();
    const timeNewValue = useRef(120);
    const shouldShowPopup = props.source === "IMPORT";


    const setDefaultTimer = () => {
        timer.current.counter = timer.current.default;
    };

    const startTimer = () => {
        timeNewObj.current = setInterval(function () {
            if (timeNewValue.current <= 0) {
                clearInterval(timeNewObj.current);
            } else {
                timeNewValue.current = timeNewValue.current - 1;
                setCount(timeNewValue.current);
            }
        }, 1000);
    };

    const findMobileErrors = () => {
        const newErrors = {};
        let regex = /^[6789]\d{9}$/;
        if (!selectedMember.mobile || selectedMember.mobile === "")
            newErrors.userMobile = "Please enter valid mobile number";
        else if (selectedMember.mobile.length !== 10)
            newErrors.userMobile = "Please enter valid mobile number";
        else if (!regex.test(selectedMember.mobile))
            newErrors.userMobile = "Please enter valid mobile number";
        else if (
            selectedMember.mobile ||
            regex.test(selectedMember.mobile) ||
            selectedMember.mobile.length == 10
        ) return newErrors;
        // newErrors.userMobile = "";
        return newErrors;
    };


    const getMFToken = async () => {
        let reqData = {
            // user_id: getParentUserId(),
            // fp_log_id: session.data.fp_log_id,
        };
        let mfTok = await restApiCall(
            ADVISORY_MF_GENERATE_TOKEN,
            reqData,
            restHeaders
        );
        if (mfTok.error_code == "100") {
            return mfTok;
        } else {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Someting went wrong!");
        }
    };

    const generateClientRefNo = () => {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, "0");
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note: Months are zero-based
        const year = currentDate.getFullYear().toString().substring(2);
        const hours = currentDate.getHours().toString().padStart(2, "0");
        const minutes = currentDate.getMinutes().toString().padStart(2, "0");
        const seconds = currentDate.getSeconds().toString().padStart(2, "0");
        const customFormat = `minty_${day}${month}${year}_${hours}${minutes}${seconds}`;
        return customFormat;
    };

    const mfEncrypt = async (data) => {
        let reqData = data;
        let response = await restApiCall(
            ADVISORY_MF_ENCRYPT,
            reqData,
            restHeaders
        );
        if (response.error_code == "100") {
            return response;
        } else {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Someting went wrong!");
        }
    };

    const mfSignature = async (data) => {
        let reqData = data;
        let response = await restApiCall(
            ADVISORY_MF_GENERATE_SIGNATURE,
            reqData,
            restHeaders
        );
        if (response.error_code == "100") {
            return response;
        } else {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Someting went wrong!");
        }
    };

    const mfDecrypt = async (data) => {
        let reqData = data;
        let response = await restApiCall(
            ADVISORY_MF_DECRYPT,
            reqData,
            restHeaders
        );
        if (response.error_code == "100") {
            return response;
        } else {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Someting went wrong!");
        }
    };

    const mfSubmitCasSummaryRequest = async (data) => {
        let reqData = data;
        let response = await restApiCall(
            ADVISORY_MF_SUBMIT_CAS_SUM_REQUEST,
            reqData,
            restHeaders
        );
        let decryptPayload = {
            token: data["token"],
            data: response["data"]["response"],
        };
        let decryptResponse = await mfDecrypt(decryptPayload);
        if (response.error_code == "100") {
            if (decryptResponse?.error_code == "100") {
                setCasResponse(decryptResponse["data"]);
                return decryptResponse;
            } else {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Someting went wrong!");
            }
        } else {
            var errMsg = decryptResponse["data"]["errors"][0]["message"];
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error(errMsg);
        }
    };

    const findPANErrors = () => {
        const newErrors = {};
        let regex = /^[A-Za-z]{3}[HPhp]{1}[A-Za-z]{1}\d{4}[A-ZHPa-zhp]{1}$/;
        if (!selectedMember.pan || selectedMember.pan === "") {
            newErrors.userPan = "Please enter PAN";
        } else if (selectedMember.pan.length !== 10) {
            newErrors.userPan = "Please enter valid PAN";
        } else if (!regex.test(selectedMember.pan)) {
            newErrors.userPan = "Please enter valid PAN";
        } else if (
            selectedMember.pan ||
            regex.test(selectedMember.pan) ||
            selectedMember.pan.length == 10
        ) return newErrors;
        // newErrors.userPan = "";

        return newErrors;
    };

    const checkPANRegistered = async (pan) => {
        let url =
            ADVISORY_CHECK_PAN_REGISTERED +
            "?uid=" +
            btoa("00" + session.data.id) +
            "&pan=" +
            pan;
        let checkpan = await apiCall(url, "", false, false);
        return checkpan;
    };

    const checkIfPanExists = async () => {
        let reqData = {
            pan: selectedMember.pan,
            fp_user_id: selectedMember.id,
            fp_log_id: session.data.fp_log_id,
        };
        let checkPan = await restApiCall(
            DMF_CHECKIFPANEXISTS_API_URL,
            reqData,
            restHeaders
        );
        if (checkPan.error_code == "100") return true;
        else if (checkPan.error_code == "101") return message;
        return "Something went wrong!";
    };

    const findOtpErrors = () => {
        const newErrors = {};
        if (!otpInput || otpInput === "")
            newErrors.otpInput = "Please enter valid otp!";
        else if (otpInput.length !== 6)
            newErrors.otpInput = "Please enter valid otp!";
        return newErrors;
    };

    const mfInvestorConsent = async (data) => {
        let reqData = data;
        let response = await restApiCall(
            ADVISORY_MF_INVESTOR_CONSENT,
            reqData,
            restHeaders
        );
        if (response.error_code == "100") {
            return response;
        } else {
            let decryptPayload = {
                token: data["token"],
                data: response["data"]["response"],
            };
            let decryptResponse = await mfDecrypt(decryptPayload);

            if (decryptResponse?.error_code == "100") {
                var errMsg = decryptResponse["data"]["errors"][0]["message"];
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error(errMsg);
                return response;
            }
        }
    };

    const getMfDocuments = async () => {
        if (casResponse) {
            let request;
            if (session.data.fp_log_id) {
                request = {
                    token: mfToken,
                    reqId: casResponse["reqId"],
                    clientRefNo: casResponse["clientRefNo"],
                    pan: selectedMember.pan,
                    mobile: selectedMember.mobile,
                    fp_user_id: session.data.fp_user_id,
                    fp_log_id: session.data.fp_log_id,
                    user_id: getParentUserId()
                };
            } else {
                request = {
                    token: mfToken,
                    reqId: casResponse["reqId"],
                    clientRefNo: casResponse["clientRefNo"],
                    pan: selectedMember.pan,
                    mobile: selectedMember.mobile
                };
            }
            let response = await restApiCall(
                ADVISORY_GET_ALL_CAS_DOCUMENTS,
                request,
                restHeaders
            );
            if (response.error_code == "100") {
                return response;
            } else {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Someting went wrong!");
            }
        }
    };

    // const fetchMfCentral = async () => {
    //     try {
    //       if(session.data.fp_log_id)  {
    //         let reqdata = {
    //             fp_user_id: session.data.fp_user_id,
    //             fp_log_id: session.data.fp_log_id,
    //             };
    //             let checkData = await restApiCall(
    //             ADVISORY_FETCH_MF_CENTRAL_DATA,
    //             reqdata,
    //             ""
    //             );
    //             if (checkData.error_code == "100") {
    //             setEcasData(checkData.data);
    //             }
    //             if (checkData.error_code == "103") {
    //             setEcasData([]);
    //             }
    //             if (checkData.valid_members.length > 0) {
    //             const all = checkData.valid_members.map((v) => ({
    //                 name: v.first_name + " " + v.last_name,
    //                 id: v.id,
    //                 pan: v.pan,
    //                 mobile: v.mobile,
    //                 label: v.first_name + " " + v.last_name,
    //                 value: v.id,
    //             }));
    //             setAllMembers([...all]);
    //       }          

    //       }
    //     } catch (e) {
    //       console.log(e);
    //     }
    // };

    const checkenterpanexists = async () => {
        const payload = {
            user_id: selectedMember.id,
            user_pan: selectedMember.pan,
            data_belongs_to: DATA_BELONGS_TO
        };
        const checkpan = await checkPan(payload);
        if (checkpan["status_code"] == 404) return true;
        else if (checkpan["status_code"] == 200) return checkpan["message"];
        else return "Something went wrong!";
    };


    const sendOTP_MFCentral = async (refresh = 0) => {
        try {
            const mobileErrors = findMobileErrors();
            const panErrors = findPANErrors();
            const panRegistred = await checkPANRegistered(selectedMember.pan);

            if (!panEditable && selectedMember.pan && !checkenterpanexists()) {
                panErrors.userPan = checkenterpanexists();
            }

            // if (refresh == 0 && panRegistred != true) {
            //     panErrors.userPan = panRegistred
            // }

            if (
                (Object.keys(mobileErrors).length > 0 ||
                    Object.keys(panErrors).length > 0) &&
                (mobileErrors.userMobile !== "" || panErrors.userPan !== "")
            ) {
                setErrors({ ...mobileErrors, ...panErrors });
                return false;
            }

            const checkPan = await checkIfPanExists();
            if (checkPan !== true) {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error(checkPan);
                return false;
            }

            const mfCentralToken = await getMFToken();

            if (mfCentralToken.error_code === "100") {
                const mF_Token = mfCentralToken.data;
                setMfToken(mF_Token);

                const clientRefNo = generateClientRefNo();
                const param = {
                    clientRefNo,
                    pan: selectedMember.pan,
                    mobile: selectedMember.mobile,
                    email: "",
                    pekrn: "",
                    otherApi: "DET_SUM",
                };

                const request = { token: mF_Token, data: param };
                const encryptRequest = await mfEncrypt(request);

                if (encryptRequest?.error_code === "100") {
                    const encryptResponse = encryptRequest.data;
                    const signRequest = { token: mF_Token, data: encryptResponse };
                    const generateSignature = await mfSignature(signRequest);

                    if (generateSignature?.error_code === "100") {
                        const submitRequestPayload = {
                            token: mF_Token,
                            data: generateSignature.data,
                        };
                        const sendOTPResponse = await mfSubmitCasSummaryRequest(
                            submitRequestPayload
                        );

                        if (sendOTPResponse.error_code === "100") {
                            clearInterval(timeNewObj.current);
                            timeNewValue.current = 120;
                            setModalType(1);
                            setDefaultTimer();
                            setOtpInput("");
                            startTimer();
                            setErrors({});
                            toastr.options.positionClass = "toast-bottom-left";
                            toastr.success("OTP sent successfully");
                            return true;
                        }
                    }
                }
            }
            return false;
            // props.setCurrView('OTP');
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const getJwtToken = async () => {
        try {
            let payload = {
                user_id: selectedMember.id
            }
            const response = await GenerateJWTToken(payload)
            if (response.status_code === 200)
                return response;
            return "Something went wrong!";
        } catch (e) {
            console.error(e);
        }
    };

    const getTransactionId = async (jwtToken) => {
        try {
            // generatemftxnid expects only jwt token payload.
            let payload = {
                     token: jwtToken,
                pan: selectedMember.pan,
                mobile: selectedMember.mobile,
                user_id: selectedMember.id
            }
            const response = await GettransactionID(payload)
            if (response.status_code === 200)
                return response;
            return "Something went wrong!";
        } catch (e) {
            console.error(e);
        }
    };


    const sendSmallcaseOTPFunc = async (trxnId) => {
        try {
            let payload = {
                transactionId: trxnId,
                pan: selectedMember.pan,
                phone: selectedMember.mobile
            }

            let sendOTP = await sendSmallcaseOTP(payload);
            if (sendOTP.status_code === 200) {
                return sendOTP;
            } else if (sendOTP.status_code === 400) {
                return sendOTP;
            }
            return "Something went wrong!";
        } catch (e) {
            console.error(e);
        }
    };


    const sendOTP = async () => {
        try {
            let existingMember = allMembers.find(member => member.id === selectedMember.id);

            let panIsSame = existingMember && existingMember.pan === selectedMember.pan;
            let mobileIsSame = existingMember && existingMember.mobile === selectedMember.mobile;
            if (!panIsSame || !mobileIsSame) {
                dispatch({ type: "SET_PAR_PAN_MOBILE_PREFILLED", payload: false });
            }
            const mobileErrors = findMobileErrors();
            const panErrors = findPANErrors();
            if (!panEditable && selectedMember.pan != "" && selectedMember.pan != null) {
                let checkenterPan = await checkenterpanexists();
                if (checkenterPan != true) {
                    panErrors.userPan = checkenterPan;
                }
            }
            if (
                (Object.keys(mobileErrors).length > 0 ||
                    Object.keys(panErrors).length > 0) &&
                (mobileErrors.userMobile !== "" || panErrors.userPan !== "")
            ) {
                setErrors({ ...mobileErrors, ...panErrors });
                return false;
            }

            // const checkPan = await checkIfPanExists();
            // if (checkPan !== true) {
            //     toastr.options.positionClass = "toast-bottom-left";
            //     toastr.error(checkPan);
            //     return false;
            // }
            //   const mobileErrors = findMobileErrors();
            //   if (Object.keys(mobileErrors).length > 0) {
            //     setErrors(mobileErrors);
            //     return;
            //   }

            //   let checkPan = await checkIfPanExists();
            //   if (checkPan != true) {
            //     dispatch({
            //       type: "RENDER_TOAST",
            //       payload: {
            //         message: checkPan,
            //         type: "error",
            //       },
            //     });
            //     return;
            //   }

            let jwtTok = await getJwtToken();
            if (jwtTok.status_code === 200) {
                let trxnIdData = await getTransactionId(jwtTok.data.token);
                if (trxnIdData.status_code === 200) {
                    let trxnId = trxnIdData.data.data.data.transactionId;
                    let sendOTP = await sendSmallcaseOTPFunc(trxnId);
                    if (sendOTP.status_code === 200) {
                        clearInterval(timeNewObj.current);
                        timeNewValue.current = 120;
                        setItemLocal("trxnId", trxnId);
                        // setShow(true);
                        setModalType(1);
                        setDefaultTimer();
                        setOtpInput("");
                        // startTimer();
                        setErrors({});
                        toastr.options.positionClass = "toast-bottom-left";
                        toastr.success("OTP sent successfully");
                        setErrorMessage("");
                        return true;
                    } else if (sendOTP.status_code === 400) {
                        // toastr.options.positionClass = "toast-bottom-left";
                        // toastr.error(sendOTP.message);
                        setErrorMessage("PAN is not linked with the given mobile number");
                        setTimeout(() => {
                            setErrorMessage("");
                        }, 10000);
                        return false;
                    } else {
                        toastr.options.positionClass = "toast-bottom-left";
                        toastr.error(sendOTP);
                        setErrorMessage("");
                        return false;
                    }
                }
            }
            return false;
            // dispatch({
            //     type: "RENDER_TOAST",
            //     payload: {
            //         message: "Someting went wrong!",
            //         type: "error",
            //     },
            // });
        } catch (e) {
            console.error(e);
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error(e);
            return false;
        }
    };

    const verifyMfCentralOTP = async () => {
        const otpErrors = findOtpErrors();
        if (Object.keys(otpErrors).length > 0) {
            setErrors(otpErrors);
            return false;
        }
        if (!casResponse) {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Something went wrong!");
            return false;
        }
        const verifyPayload = { ...casResponse, enteredOtp: otpInput };
        const encryptRequest = await mfEncrypt({
            token: mfToken,
            data: verifyPayload,
        });

        if (encryptRequest?.error_code !== "100") {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Something went wrong!");
            return false;
        }

        const encryptResponse = encryptRequest.data;
        const generateSignature = await mfSignature({
            token: mfToken,
            data: encryptResponse,
        });

        if (generateSignature?.error_code !== "100") {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Something went wrong!");
            return false;
        }

        const submitRequestPayload = {
            token: mfToken,
            data: generateSignature.data,
            pan: selectedMember.pan,
            mobile: selectedMember.mobile,
            fp_user_id: selectedMember.id,
        };
        const verifyOTP = await mfInvestorConsent(submitRequestPayload);

        if (verifyOTP?.error_code !== "100") {
            //   toastr.options.positionClass = "toast-bottom-left";
            //   toastr.error("Something went wrong 4!");
            return false;
        }
        setModalType(2);
        setShowLinkAc(false);
        setWaitforSms(true);

        const getMfData = await getMfDocuments();

        if (getMfData?.error_code === "100") {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.success("Holding Data has been fetched successfully");
            dispatch({
                type: "ASSETS_UPDATE",
                payload: true,
            });

            //   fetchMfCentral();
            return true;
        }
    };
const handleSuccess = () => {
    if (props.source === "IMPORT") {
        // Directly close modal, no PortfolioBalance
        setShowSuccessPopup(false);
        setCurrView("INITIAL");
        setErrors({});
        setSendDisabled(true);

        props.setOpenModalByName("");
        props.CloseMfModal();

        // refresh parent data if needed
        props.fetchReportsData?.();
    } else {
        // Normal flow → show success popup
        setShowSuccessPopup(true);
    }
};

    const verifySmallcaseOTP = async () => {
        try {
            const otpErrors = findOtpErrors();
            if (Object.keys(otpErrors).length > 0) {
                setErrors(otpErrors);
                return false;
            }

            let trxnId = getItemLocal("trxnId");
            const payload = {
                user_id: selectedMember.id,
                transactionId: trxnId,
                pan: selectedMember.pan,
                phone: selectedMember.mobile,
                // is_chat_bot: 1,
                otp: otpInput,
                // data_belongs_to: DATA_BELONGS_TO
            };

            let verifyOTP = await Verifysmallcasemfotp(payload);


            // let verifyOTP = await fetchData(payload);

            let errMsg = "";

            if (verifyOTP.status_code === 200) {
                setModalType(2);
                setShowLinkAc(false);
                setWaitforSms(true);
                handleSuccess();
                // interval.current = setInterval(() => {
                //     if (stopSmallCase.current == false) {
                //       getSmallCaseData();
                //     }
                // }, 10000);
                return true;
            } else if (verifyOTP.status_code === 400) {
                // let errResp = verifyOTP.data;
                errMsg = verifyOTP.message;
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error(errMsg);
                return false;
            }

            if (errMsg.includes("Entered OTP appears to be incorrect")) {
                setErrors({ otpInput: errMsg });
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Entered OTP appears to be incorrect");
                return false;
            }
            setModalType(0);
            setDefaultTimer();
            setOtpInput("");
            setErrors({});
            dispatch({
                type: "RENDER_TOAST",
                payload: {
                    message: errMsg ? errMsg : "Someting went wrong!",
                    type: "error",
                },
            });
        } catch (e) {
            console.error(e);
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Someting went wrong!");
            return false;
        }
    };

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
            setToken(result.data.token);
            return result.data.token;
        }
    };

    const addMemberData = async () => {
        // try {
        //     let customHeaders_getPan = {
        //         "Content-Type": "application/json",
        //         Accept: "application/json",
        //         // Authorization: "Bearer " + token,
        //     };
        //     let get_pan_status_payload = {
        //         "pan": selectedMember.pan,
        //         "user_id": selectedMember.id,
        //         "is_direct": "1"
        //     };

        //     let getPanStatusPayload = {
        //         url: FINTOO_BASE_API_URL + "direct-mutual-fund/api/kyc/getpanstatus",
        //         headers: customHeaders_getPan,
        //         method: "POST",
        //         data: get_pan_status_payload
        //     };

        //     const getPanStatusRes = await fetchData(getPanStatusPayload);
        //     if (getPanStatusRes["error_code"] == "100") {
        //         let user_name = getPanStatusRes['data']['kyc_name']
        //         let customHeader_updateBasic = {
        //             "Content-Type": "application/json",
        //             Accept: "application/json",
        //             // Authorization: "Bearer " + token,
        //         };
        //         let update_basic_details_payload = {
        //             "user_id": selectedMember.id.toString(),
        //             "pan": selectedMember.pan,
        //             "first_name": user_name,
        //             "kyc_user_name": user_name,
        //             "kyc_verified": 1,
        //             "is_direct": "1"
        //         };

        //         let updateBasicDetailsPayload = {
        //             url: FINTOO_BASE_API_URL + "direct-mutual-fund/api/user/updatebasicdetails",
        //             headers: customHeader_updateBasic,
        //             method: "POST",
        //             data: update_basic_details_payload
        //         };

        //         const updateBasicDetailsRes = await fetchData(updateBasicDetailsPayload);
        //         if (updateBasicDetailsRes["error_code"] == "100") {
        //             let user_name = getPanStatusRes['data']['kyc_name']
        //             let customHeaders_addMember = {
        //                 "Content-Type": "application/json",
        //                 Accept: "application/json",
        //                 // Authorization: "Bearer " + token,
        //             };
        //             let existingMember = member_data.find(member => member.id === selectedMember.id);
        //             let parent_user_id = "";
        //             let member_user_id = "";
        //             let id = "";
        //             if (existingMember.parent_user_id == 0) {
        //                 parent_user_id = "0";
        //                 member_user_id = existingMember.id.toString();
        //                 id = existingMember.id.toString();
        //             } else {
        //                 parent_user_id = existingMember.parent_user_id.toString();
        //                 member_user_id = existingMember.id.toString();
        //                 id = existingMember.parent_user_id.toString();

        //             }
        //             let email_data = "";
        //             if (selectedMember.email) {
        //                 email_data = selectedMember.email;
        //             } else {
        //                 email_data = existingMember.email;
        //             }
        //             let add_member_payload = {
        //                 "id": id,
        //                 "member_user_id": member_user_id,
        //                 "parent_user_id": parent_user_id,
        //                 "email": email_data,
        //                 "mobile": selectedMember.mobile,
        //                 "relation": "11",
        //                 "type": "update"
        //             };

        //             let addMemberPayload = {
        //                 url: FINTOO_BASE_API_URL + "direct-mutual-fund/api/user/addmember",
        //                 headers: customHeaders_addMember,
        //                 method: "POST",
        //                 data: add_member_payload
        //             };

        //             const addMemberRes = await fetchData(addMemberPayload);
        //             if (addMemberRes["error_code"] == "100") {
        //             }

        //         }

        //     }
        // } catch (e) {
        //     console.log("Error Occured ===>>> ", e);
        // }
    }
    const fetchMembers = async () => {
        try {
            const r = await fetchData({
                url: '',
                data: {
                    user_id: getParentUserId(),
                    // is_direct:IS_DIRECT,// "0",
                    data_belongs_to: DATA_BELONGS_TO
                },
                method: "post",
            });
            const all = r.data.map((v) => ({
                name: v.NAME ? v.NAME : v.fdmf_email,
                id: v.id,
                parent_user_id: v.parent_user_id,
                pan: v.pan,
                mobile: v.mobile,
                email: v.fdmf_email,
                fp_user_details_id: v.fp_user_details_id,
                fdmf_is_minor: v.minor,
            }));
            // setItemLocal("member", [...all]);
        } catch (e) { }

    };

    const fetchEcasData = async () => {
        try {
            // var myHeaders = new Headers();
            // const tkn = await getJWTToken();
            // myHeaders.append("gatewayauthtoken", 'Token ' + tkn);
            // myHeaders.append("gatewayauthname", GATEWAY_AUTH_NAME);
            let email_id = selectedMember.email;
            if (!email_id) {
                let allmember = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser")));
                let check_member = allmember.find(check_member => check_member.id === selectedMember.id);
                if (check_member && check_member.email) {
                    email_id = check_member.email;
                } else {
                    check_member = allmember.find(check_member => check_member.parent_user_id === 0);
                    email_id = check_member.email
                }
            }
            const fetchEcasPayload = {
                "pan": selectedMember.pan,
                "username": selectedMember.name,
                // "email": email_id,
                "phone": String(selectedMember.mobile),
                // "country_code": 91
            };
            try {
                const result = await Fetchecasdatadetails(fetchEcasPayload);
                // const response = await fetch(CHATBOT_BASE_API_URL + "fetchecasdata1/", {
                //     method: 'POST',
                //     headers: myHeaders,
                //     body: JSON.stringify(fetchEcasPayload),
                // });
                // const result = await response.json();
                if (result["message"]["status_code"] === "200") {
                    if (!par_pan_mobile_prefilled) {
                        // await addMemberData();
                        fetchMembers();
                    }
                    setMFScreeningPDF(result["message"]['data']['pdf_snippet']);
                    setMfAmount(result["message"]['data']['data']['total_current_value']);
                    saveScreenReport(selectedMember.id, 'MF', result["message"]['data']['data']['total_current_value'], result["message"]['data']['pdf_snippet_WA'])
                    return true;
                } else if (result["message"]["status_code"] === "400") {
                    toastr.options.positionClass = "toast-bottom-left";
                    setErrormsg(result['message']["message"]);
                    toastr.error(result['message']["message"]);
                    return false;
                } else {
                    toastr.options.positionClass = "toast-bottom-left";
                    let error_message = "An error occurred while fetching your investment details. Please try again later. We apologise for the inconvenience.";
                    setErrormsg(error_message);
                    toastr.error("Something went wrong!");
                    return false;
                }
            } catch (e) {
                console.log("Error Occured ===>>> ", e);
                return false;
            }
        } catch (e) {
            console.log("Error Occured ===>>> ", e);
            return false;
        }
    }

    const generateParSnippet = async (investmentType = 1) => {
        try {
            let par_report_data_payload = {
                user_id: selectedMember.id || getParentUserId(),
                pan: selectedMember.pan,
                mobile: selectedMember.mobile,
                investment_type: investmentType,
                data_belongs_to: DATA_BELONGS_TO
            };

            const generatePar = await GenerateParSnippet(par_report_data_payload);
            if (generatePar["status_code"] == "200") {
                if (!par_pan_mobile_prefilled) {
                    fetchMembers();
                }
                setMFScreeningPDF(generatePar['data']['pdf_snippet']);
                setMfAmount(generatePar['data']['mf_holding']['total_current_value']);
                saveScreenReport(selectedMember.id || getParentUserId(), 'PAR', generatePar['data']['mf_holding']['total_current_value'], generatePar['data']['pdf_snippet_wa']);

                toastr.options.positionClass = "toast-bottom-left";
                toastr.success("Data fetched successfully");
                return true;
            } else if (generatePar["error_code"] == "103") {
                return false;
            } else {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("An error occurred while fetching your investment details. Please try again later. We apologise for the inconvenience.");
                return false;
            }
        } catch (e) {
            console.log("Error Occured ===>>> ", e);
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Something went wrong!");
            return false;
        }
    };

    useEffect(() => {
        if (props.forpar && props.investmentType == 1) {
            (async () => {
                await generateParSnippet();
            })();
        }
    }, [location]);

    const fallbackToOtpFlow = async () => {
        setShowGateway(false);
        const response = await sendOTP();
        if (response) {
            setCurrView("OTP");
        }
    };

    const SmallcaseSDK = async () => {
        let existingMember = allMembers.find((member) => member.id === selectedMember.id);
        let panIsSame = existingMember && existingMember.pan === selectedMember.pan;
        let mobileIsSame = existingMember && existingMember.mobile === selectedMember.mobile;

        if (!panIsSame || !mobileIsSame) {
            dispatch({ type: "SET_PAR_PAN_MOBILE_PREFILLED", payload: false });
        }

        const mobileErrors = findMobileErrors();
        const panErrors = findPANErrors();
        if (!panEditable && selectedMember.pan !== "" && selectedMember.pan !== null) {
            let checkenterPan = await checkenterpanexists();
            if (checkenterPan !== true) {
                panErrors.userPan = checkenterPan;
            }
        }

        if (
            (Object.keys(mobileErrors).length > 0 || Object.keys(panErrors).length > 0) &&
            (mobileErrors.userMobile !== "" || panErrors.userPan !== "")
        ) {
            setErrors({ ...mobileErrors, ...panErrors });
            return false;
        }

        let jwtTok = await getJwtToken();
        if (jwtTok?.status_code === 200) {
            setSmallcaseAuthToken(jwtTok.data.token);
            let trxnIdData = await getTransactionId(jwtTok.data.token);
            if (trxnIdData?.status_code === 200) {
                let trxnId = trxnIdData?.data?.transactionId || trxnIdData?.data?.data?.transactionId;
                if (!trxnId) {
                    return false;
                }
                setItemLocal("trxnId", trxnId);
                setSmallcaseTrxnId(trxnId);
                setShowGateway(true);
                return true;
            }
        }
        return false;
    };

    return (
        <div>
            {
                showSuccessPopup && props.source !== "IMPORT" ?  
                    <PortfolioBalance open={showSuccessPopup}
                    report={true}
                    downloadPDF={mFScreeningPDF}
                    modalData={{ mfAmount: mfAmount }}
                    isDashboard={true}
                    handleClose={() => {
                        setShowSuccessPopup(false); props.setOpenModalByName(""); setCurrView('INITIAL'); setShowGateway(false);
                        props.fetchReportsData ? props.fetchReportsData() : null;
                    }}
                /> :
                    <BootModal.Modal
                        dialogClassName="Nsdlcsdl-modal-width"
                        show={props.open}
                        centered
                        animationDuration={0}
                    >
                        <>
                            <div style={{
                                padding: "0 !important",
                                minHeight: '520px',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>

                                <div style={{
                                    background: "#042b62",
                                    border: "0px solid #042b62"
                                }} className="RefreshModalpopup_Heading col-12 d-flex custom-background-color">
                                    <div className={`${Styles.modal_Heading}`}>{currView == 'INITIAL' ? 'Welcome!' : 'Mutual Fund'}</div>
                                    {
                                        isLoading ? null : <div className={`${Styles.CloseBtnpopup}`}>
                                            <img
                                                onClick={() => {
                                                    setErrors({});
                                                    setSendDisabled(true);
                                                    setShowSuccessPopup(false); props.setOpenModalByName(""); setCurrView('INITIAL'); setShowGateway(false);
                                                    props.CloseMfModal();
                                                }}
                                                style={{ cursor: "pointer", right: 0 }}
                                                src={process.env.REACT_APP_STATIC_URL + "media/DG/Close.svg"}
                                                alt="Close"
                                            />
                                        </div>
                                    }

                                </div>
                                {
                                    currView == 'INITIAL' && <InitialView setCurrView={setCurrView}
                                        selectedMember={selectedMember}
                                        setSelectedMember={setSelectedMember}
                                    />
                                }
                                {
                                    currView == 'DETAILS' && <DetailsView session={session}
                                        setCurrView={setCurrView}
                                        errorMessage={errorMessage}
                                        casResponse={casResponse}
                                        setCasResponse={setCasResponse}
                                        sendOTP={sendOTP}
                                        SmallcaseSDK={SmallcaseSDK}
                                        selectedMember={selectedMember}
                                        setSelectedMember={setSelectedMember}
                                        panEditable={panEditable}
                                        setPanEditable={setPanEditable}
                                        restHeaders={restHeaders}
                                        setRestHeaders={setRestHeaders}
                                        errors={errors}
                                        setErrors={setErrors}
                                        allMembers={allMembers}
                                        setAllMembers={setAllMembers}
                                        sendDisabled={sendDisabled}
                                        setSendDisabled={setSendDisabled}
                                        isLoading={isLoading}
                                        setIsLoading={setIsLoading}
                                    />
                                }
                                {
                                    currView == 'OTP' && <OtpView setCurrView={setCurrView}
                                        setShowSuccessPopup={setShowSuccessPopup}
                                        casResponse={casResponse}
                                        setCasResponse={setCasResponse}
                                        selectedMember={selectedMember}
                                        setSelectedMember={setSelectedMember}
                                        panEditable={panEditable}
                                        setPanEditable={setPanEditable}
                                        restHeaders={restHeaders}
                                        setRestHeaders={setRestHeaders}
                                        errors={errors}
                                        setErrors={setErrors}
                                        sendOTP={sendOTP}
                                        verifyMfCentralOTP={verifySmallcaseOTP}
                                        otpInput={otpInput}
                                        setOtpInput={setOtpInput}
                                        allMembers={allMembers}
                                        setAllMembers={setAllMembers}
                                        sendDisabled={sendDisabled}
                                        setSendDisabled={setSendDisabled}
                                        fetchEcasData={fetchEcasData}
                                        isLoading={isLoading}
                                        setIsLoading={setIsLoading}
                                        errorMsg={errorMsg}
                                        setErrormsg={setErrormsg}
                                        closeView={() => {
                                            setErrors({});
                                            setSendDisabled(true);
                                            setShowSuccessPopup(false);
                                            props.setOpenModalByName("");
                                            setCurrView('INITIAL');
                                        }}
                                    />
                                }

                            </div>
                        </>
                    </BootModal.Modal>
            }
            {showGateway && (
                <SmallcaseGateway
                    key={smallcaseTrxnId}
                    gatewayName={SMALLCASE_GATEWAY}
                    authToken={smallcaseAuthToken}
                    transactionId={smallcaseTrxnId}
                    setIsLoading={setIsLoading}
                    fetchEcasData={fetchEcasData}
                    setShowSuccessPopup={setShowSuccessPopup}
                    onSuccess={handleSuccess}
                    fetcEcas={true}
                    parSnippet={false}
                    portfolio={false}
                    dg={false}
                    onError={async () => {
                        await fallbackToOtpFlow();
                    }}
                />
            )}
        </div>
    );
};
export default MFReportModal;
