import React, { useEffect, useRef, useState } from "react";
import Styles from '../../../../Pages/datagathering/DG.module.css'
import DetailsView from "./DetailsView";
import OtpView from "./OtpView";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { CHECK_SESSION, DATA_BELONGS_TO, SMALLCASE_GATEWAY } from "../../../../constants";
import { apiCall, getItemLocal, getParentUserId, restApiCall, loginRedirectGuest, fetchData, setItemLocal, fetchEncryptData } from "../../../../common_utilities";
import { useDispatch } from "react-redux";
import { } from "../../../../constants";
import { CheckPanExists, GenerateJWTToken, GettransactionID, sendSmallcaseOTP, Verifysmallcasemfotp } from "../../../../FrappeIntegration-Services/services/financial-planning-api/externalApi";
import { verifyOTP } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import commonEncode from "../../../../commonEncode";
import SmallcaseGateway from "../../../SmallcaseGateway/SmallcaseGateway";


const MFReportModal = (props) => {

    const [session, setSession] = useState("");

    // const [currView, setCurrView] = useState('OTP');
    const [currView, setCurrView] = useState(props.areBothSelected.redirectFlow || props.areBothSelected.both ? 'OTP' : 'DETAILS');
    const dispatch = useDispatch();

    const [showGateway, setShowGateway] = useState(false);
    const [smallcaseTrxnId, setSmallcaseTrxnId] = useState("");
    const [smallcaseAuthToken, setSmallcaseAuthToken] = useState("");

    const [casResponse, setCasResponse] = useState("");
    const [mfToken, setMfToken] = useState("");
    const [otpInput, setOtpInput] = useState("");
    const timer = useRef({ obj: null, counter: 120, default: 120 });
    const [selectedMember, setSelectedMember] = useState(props.commonUserData);

    const [panEditable, setPanEditable] = useState(false);
    const [restHeaders, setRestHeaders] = useState({});
    const [errors, setErrors] = useState({});
    const [allMembers, setAllMembers] = useState([]);
    const [sendDisabled, setSendDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(true)
    const [modalType, setModalType] = useState(-1);
    const interval = useRef(null);
    const stopSmallCase = useRef(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errormfMessage, setErrorMfMessage] = useState('');
    const timeNewObj = useRef();
    const timeNewValue = useRef(120);

    const setDefaultTimer = () => {
        timer.current.counter = timer.current.default;
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
            console.log("mf token error", mfTok);
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
            console.log("encrypt error", response);
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
            console.log("signature error", response);
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
            console.log("decrypt error", response);
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
                console.log("error", decryptResponse);
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
            user_pan: selectedMember.pan,
            user_id: selectedMember.id,
            data_belongs_to: DATA_BELONGS_TO,
        };
        // let checkPan = await restApiCall(
        //     DMF_CHECKIFPANEXISTS_API_URL,
        //     reqData,
        //     restHeaders
        // );
        let checkPan = await CheckPanExists(reqData)
        if (checkPan.status_code == 404) return true;
        else if (checkPan.status_code == 200) return checkPan.message;
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
                console.log("encrypt error", response);
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Someting went wrong!");
            }
        }
    };



    const checkenterpanexists = async () => {
        if (selectedMember.pan != "" && selectedMember.pan != null) {
            let url =
                ADVISORY_CHECK_PAN_EXISTSS +
                "?uid=" +
                btoa("00" + session.data.id) +
                "&pan=" +
                selectedMember.pan;
            let checkpan = await apiCall(url, "", false, false);
            return checkpan;
        }
    };


    const sendOTP_MFCentral = async (refresh = 0) => {
        try {

            let existingMember = allMembers.find(member => member.id === selectedMember.id);

            let panIsSame = existingMember && existingMember.pan === selectedMember.pan;
            let mobileIsSame = existingMember && existingMember.mobile === selectedMember.mobile;
            if (!panIsSame || !mobileIsSame) {
                dispatch({ type: "SET_PAR_PAN_MOBILE_PREFILLED", payload: false });
            }


            const mobileErrors = findMobileErrors();
            const panErrors = findPANErrors();

            if (!props.areBothSelected.both) {
                // const panRegistred = await checkPANRegistered(selectedMember.pan);

                // if (!panEditable && selectedMember.pan && !checkenterpanexists()) {
                //     panErrors.userPan = checkenterpanexists();
                // }
                // let checkenterPan = await checkenterpanexists();

                // if (checkenterPan != true) {
                //     panErrors.userPan = checkenterPan;
                // }
                if (!panEditable && selectedMember.pan != "" && selectedMember.pan != null) {
                    let checkenterPan = await checkenterpanexists();
                    if (checkenterPan != true) {
                        panErrors.userPan = checkenterPan;
                    }
                }
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
                            setDefaultTimer();
                            setOtpInput("");
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
            let reqData = {
                user_id: selectedMember.id,
            }
            let jwtTok = await GenerateJWTToken(reqData);
            if (jwtTok.status_code == 200) return jwtTok;
            return "Something went wrong!";
        } catch (e) {
            console.error(e);
        }
    };

    const getTransactionId = async (jwtToken) => {
        try {
            let reqData = {
                token: jwtToken,
                pan: selectedMember.pan,
                mobile: selectedMember.mobile,
                user_id: selectedMember.id
            }
            let trxnId = await GettransactionID(reqData)
            if (trxnId.status_code == 200) return trxnId;
            return "Something went wrong!";
        } catch (e) {
            console.error(e);
        }
    };

    const sendSmallcaseOTPFunc = async (trxnId) => {
        try {
            let payload = {
                transactionId: trxnId,
                pan: selectedMember?.pan,
                phone: selectedMember?.mobile,
            }
            let sendOTP = await sendSmallcaseOTP(payload);
            if (sendOTP.status_code == 200) {
                return sendOTP;
            } else if (sendOTP.status_code == 400) {
                return sendOTP;
            }
            return "Something went wrong!";
        } catch (e) {
            console.error(e);
        }
    };

    const sendOTP = async () => {
        try {
            let all_member = allMembers.length > 0 ? allMembers : JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
            let existingMember = all_member.find(member => member.id === selectedMember.id);

            let panIsSame = existingMember && existingMember.pan === selectedMember.pan;
            let mobileIsSame = existingMember && existingMember.mobile === selectedMember.mobile;
            if (!panIsSame || !mobileIsSame) {
                dispatch({ type: "SET_PAR_PAN_MOBILE_PREFILLED", payload: false });
            }
            const mobileErrors = findMobileErrors();
            const panErrors = findPANErrors();
            if (!props.areBothSelected.both) {
                if (!panEditable && selectedMember.pan != "" && selectedMember.pan != null) {
                    let checkenterPan = await checkIfPanExists();
                    if (checkenterPan != true) {
                        panErrors.userPan = checkenterPan;
                    }
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

            const checkPan = await checkIfPanExists();
            if (checkPan !== true) {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error(checkPan);
                return false;
            }
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
            if (jwtTok.status_code == 200) {
                let trxnIdData = await getTransactionId(jwtTok.data.token);
                if (trxnIdData.status_code == 200) {
                    let trxnId = trxnIdData.data.data.data.transactionId;
                    let sendOTP = await sendSmallcaseOTPFunc(trxnId);
                    if (sendOTP.status_code == 200) {
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
                    } else if (sendOTP.status_code == 400) {
                        // toastr.options.positionClass = "toast-bottom-left";
                        // toastr.error(sendOTP.message);
                        setErrorMessage("PAN is not linked with the given mobile number");
                        setErrorMfMessage("PAN is not linked with the given mobile number")

                        props.setAreBothSelected(prev => ({ ...prev, MFStatus: false }))
                        if (props.areBothSelected.both) {
                            if (props.areBothSelected.stockStatus === false) {
                                props.setInvestmentTypeView('SUCCESSVIEW');
                            } else {
                                props.setShowSuccessPopupSpinner(true);
                            }

                        }

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

    // const getSmallCaseData = async () => {
    //     try{
    //     let reqData = {
    //       method: "post",
    //       data: {
    //         pan: selectedMember?.pan,
    //         user_id: selectedMember?.id,

    //       },
    //       url: DMF_CHECK_ECAS_S3,
    //     };

    //     let checkS3Data = await fetchData(reqData);
    //     if (checkS3Data.error_code == "100") {
    //       stopSmallCase.current = true;

    //       let scReqData = {
    //         method: "post",
    //         url: DMF_GET_SC_DATA_API_URL,
    //         data: {
    //           pan: selectedMember?.pan,
    //           user_id: selectedMember?.id,
    //           fp_user_id: selectedMember?.id,
    //           dmf: "",
    //         },
    //       };

    //       // if (selectedMember.fp_log_id !== undefined && selectedMember.fp_log_id !== "") {
    //       //   scReqData.data.fp_log_id = selectedMember.fp_log_id;
    //       // }

    //       let getScData = await fetchEncryptData(scReqData);

    //       if (getScData.error_code == "100") {
    //         let msg =
    //           "Hello! Your holdings have been successfully linked with Fintoo! Regards. -Team Fintoo";
    //         let whatsapptext =
    //           "Hello! Your holdings have been successfully linked with Fintoo!\nRegards,\nTeam Fintoo";
    //         var urlsms_success = {
    //           mobile: selectedMember?.mobile,
    //           whatsappmsg: whatsapptext,
    //         };
    //         var config1 = {
    //           method: "post",
    //           url: DMF_SENDWPSMS_API_URL,
    //           data: urlsms_success,
    //         };

    //         var resp_success = await fetchEncryptData(config1);
    //       } else {
    //         let msg =
    //           "Hello! Something went wrong while gathering your holding data. Please try again.\nRegards,\nTeam Fintoo";
    //         let whatsapptext_fail =
    //           "Hello! Something went wrong while gathering your holding data. Please try again.\nRegards,\nTeam Fintoo";
    //         var urlsms_fail = {
    //           mobile: selectedMember?.mobile,
    //           whatsappmsg: whatsapptext_fail,
    //         };
    //         var config2 = {
    //           method: "post",
    //           url: DMF_SENDWPSMS_API_URL,
    //           data: urlsms_fail,
    //         };

    //         var resp_fail = await fetchEncryptData(config2);
    //       }
    //     }
    //   }catch(e){
    //     console.error(e)
    //   }
    // };


    const verifySmallcaseOTP = async () => {
        try {
            const otpErrors = findOtpErrors();
            if (Object.keys(otpErrors).length > 0) {
                setErrors(otpErrors);
                return false;
            }

            let trxnId = getItemLocal("trxnId");
            const payload = {
                transactionId: trxnId,
                user_id: selectedMember?.id,
                pan: selectedMember?.pan,
                phone: selectedMember?.mobile,
                otp: otpInput,
                data_belongs_to: DATA_BELONGS_TO
            };

            let verifyOTP = await Verifysmallcasemfotp(payload);

            let errMsg = "";

            if (verifyOTP.status_code == 200) {
                setModalType(2);
                // interval.current = setInterval(() => {
                //     if (stopSmallCase.current == false) {
                //       getSmallCaseData();
                //     }
                // }, 10000);
                return true;
            } else if (verifyOTP.status_code) {
                errMsg = verifyOTP.message;
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
            toastr.error(e);
            return false;
        }
    };

    // const checksession = async () => {
    //     try {
    //         let url = '';
    // let url = CHECK_SESSION;
    //         let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
    //         let session_data = await apiCall(url, data, true, false);


    //         if (session_data.error_code == "100") {
    //             setSession(session_data);

    //         } else {
    //             loginRedirectGuest();
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toastr.options.positionClass = "toast-bottom-left";
    //         toastr.error("Something Went Wrong1");
    //     }
    // };


    // useEffect(() => {
    //     // if (props.open) {
    //     // checksession();
    //     // }
    // }, [])

    // useEffect(() => {
    //     if (props.areBothSelected.redirectFlow || props.areBothSelected.both) {
    //         setCurrView('OTP')
    //     }
    // }, [])

    const SmallcaseSDK = async () => {
        let all_member = allMembers.length > 0 ? allMembers : JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
        let existingMember = all_member.find(member => member.id === selectedMember.id);

        let panIsSame = existingMember && existingMember.pan === selectedMember.pan;
        let mobileIsSame = existingMember && existingMember.mobile === selectedMember.mobile;
        if (!panIsSame || !mobileIsSame) {
            dispatch({ type: "SET_PAR_PAN_MOBILE_PREFILLED", payload: false });
        }
        const mobileErrors = findMobileErrors();
        const panErrors = findPANErrors();
        if (!props.areBothSelected.both) {
            if (!panEditable && selectedMember.pan != "" && selectedMember.pan != null) {
                let checkenterPan = await checkIfPanExists();
                if (checkenterPan != true) {
                    panErrors.userPan = checkenterPan;
                }
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
1
        const checkPan = await checkIfPanExists();
        if (checkPan !== true) {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error(checkPan);
            return false;
        }

        let jwtTok = await getJwtToken();
        if (jwtTok.status_code === 200) {
            setSmallcaseAuthToken(jwtTok.data.token)
            let trxnIdData = await getTransactionId(jwtTok.data.token);
            if (trxnIdData.status_code === 200) {
                let trxnId = trxnIdData.data.transactionId;
                setItemLocal("trxnId", trxnId);
                setSmallcaseTrxnId(trxnId);
                setShowGateway(true)
            }

        }
    }


    return (
        <div>
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
                    <div className={`${Styles.modal_Heading}`}>
                        Mutual Fund
                    </div>
                    <div className={`${Styles.CloseBtnpopup}`}>
                        <img
                            onClick={() => {
                                props.Closemodal(); setCurrView('INITIAL')
                            }}
                            style={{ cursor: "pointer", right: 0 }}
                            src={process.env.REACT_APP_STATIC_URL + "media/DG/Close.svg"}
                            alt="Close"
                        />
                    </div>
                </div>
                {
                    currView == 'DETAILS' && <DetailsView
                        session={session}
                        setCurrView={setCurrView}
                        errorMessage={errorMessage}
                        // setOpenModalByName={setOpenModalByName}
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
                        setInvestmentTypeView={props.setInvestmentTypeView}
                        setErrorMessage={setErrorMessage}
                        setErrorMfMessage={setErrorMfMessage}
                    />
                }
                {
                    currView == 'OTP' && <OtpView
                        session={session}
                        errormfMessage={errormfMessage}
                        setCurrView={setCurrView}
                        casResponse={casResponse}
                        setCasResponse={setCasResponse}
                        selectedMember={selectedMember}
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
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        ShowSuccessPopup={props.handleShowSuccessPopup}
                        // isLastView={props.areBothSelected.redirectFlow && (props.areBothSelected.prevInvestView === 'STOCK')}
                        isLastView={props.areBothSelected.both}
                        areBothSelected={props.areBothSelected}
                        setShowSuccessPopupSpinner={props.setShowSuccessPopupSpinner}
                        generateParSnippet={props.generateParSnippet}
                        setAreBothSelected={props.setAreBothSelected}
                        setInvestmentTypeView={props.setInvestmentTypeView}
                        Closemodal={props.Closemodal}
                    />
                }
            </div>
            {showGateway && (
                <SmallcaseGateway
                    key={smallcaseTrxnId}
                    gatewayName={SMALLCASE_GATEWAY}
                    authToken={smallcaseAuthToken}
                    transactionId={smallcaseTrxnId}
                    setIsLoading={setIsLoading}
                    fetcEcas = {false}
                    parSnippet = {true}
                    portfolio = {false}
                    dg  = {false}
                    isLastView={props.areBothSelected.both}
                    areBothSelected={props.areBothSelected}
                    setShowSuccessPopupSpinner={props.setShowSuccessPopupSpinner}
                    generateParSnippet={props.generateParSnippet}
                    setAreBothSelected={props.setAreBothSelected}
                    setInvestmentTypeView={props.setInvestmentTypeView}
                />
            )}
        </div>
    );
};
export default MFReportModal;
