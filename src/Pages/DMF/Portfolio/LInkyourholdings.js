import React, { useRef, useState, useEffect } from "react";
import PortfolioLayout from "../../../components/Layout/Portfolio";
import pmc from "../../../components/Layout/Portfolio/portfolio.module.css";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import FintooBackButton from "../../../components/HTML/FintooBackButton";
import moment from "moment";
import { Link } from "react-router-dom";
import style from "./style.module.css";

import { DATA_BELONGS_TO, SMALLCASE_GATEWAY } from "../../../constants";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getUserId,
  loginRedirectGuest,
  apiCall,
  restApiCall,
  getRestApiHeaders,
  getParentUserId,
  getItemLocal,
  setItemLocal,
  setMemberId,
  fetchEncryptData,
  fetchData,
  isFamilySelected,
  getFpUserDetailsId,
  getFpLogId,
} from "../../../common_utilities";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import IncompleteRegistration from "../../../components/IncompleteRegistration";
import FintooLoader from "../../../components/FintooLoader";
import OTPInput from "otp-input-react";
import { updateBasicDetails, getFamilyMember, getFamilyMember1 } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { fetchPanStatus } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { GenerateMfJwtToken, GenerateMfTxnId, GenerateSendMFotp, VerifyMFotp } from "../../../FrappeIntegration-Services/services/Portfolio-api/mfHoldingsApiService";
import SmallcaseGateway from "../../../components/SmallcaseGateway/SmallcaseGateway";

function LInkyourholdings(props) {
  const [show, setShow] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const timer = useRef({ obj: null, counter: 120, default: 120 });
  const [count, setCount] = useState(120);
  const [modalType, setModalType] = useState(0);
  // const [accToken, setAccToken] = useState("");
  // const [restHeaders, setRestHeaders] = useState({});
  const [selectedMember, setSelectedMember] = useState({});
  // const [casResponse, setCasResponse] = useState("");
  const casResponse = useRef("");
  // const [waitforSms, setWaitforSms] = useState(false);
  // const [showlinkac, setShowLinkAc] = useState(false);
  const [panReadonly, setPanReadonly] = useState(false);
  const [mobileReadonly, setMobileReadonly] = useState(false);

  const [isLoading, setIsLoading] = useState(true)
  const [showGateway, setShowGateway] = useState(false);
  const [smallcaseTrxnId, setSmallcaseTrxnId] = useState("");
  const [smallcaseAuthToken, setSmallcaseAuthToken] = useState("");

  const [otpInput, setOtpInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const interval = useRef(null);
  const [errors, setErrors] = useState({});
  const [sendDisabled, setSendDisabled] = useState(true);
  const mfToken = useRef("");
  const session = useRef("");
  const timeNewObj = useRef();
  const timeNewValue = useRef(120);
  const stopSmallCase = useRef(false);
  const panEditable = useRef();
  const [kycDataOfUser, setKycDataOfUser] = useState({});

  const timerProps = {
    isPlaying: true,
    size: 120,
    strokeWidth: 6,
  };
  const maxLimit = 300;

  useEffect(() => {

    if (getUserId() == null) {
      loginRedirectGuest();
    }
    onLoadInit();
    document.body.classList.add("link-your-holding");
    return () => {
      document.body.classList.remove("link-your-holding");
      clearInterval(interval.current);
      clearInterval(timeNewObj.current);
      timeNewValue.current = 120;
    };
  }, []);

  const onLoadInit = async () => {
    try {
      // var accTok = await getRestApiHeaders();
      // if (accTok) {
      //   setAccToken(accTok.gatewayauthtoken);
      //   setRestHeaders(accTok);
      // }
      getAllMemberList();
    } catch (e) {
      console.log(e);
    }
  };

  const getAllMemberList = async () => {
    try {
      const resp = await getFamilyMember(getUserId());

      if (resp.status_code === "200" && Array.isArray(resp.data)) {
        const all = resp.data.map((v) => ({
          name: v.user_name || "Unnamed",
          id: v.user_id,
          fp_log_id: null, // Not in new response, fallback or omit
          parent_user_id: v.user_parent_id || null,
          pan: v.pan || "",
          mobile: v.mobile_number || "",
          email: v.user_email || "",
          label: v.user_name || v.user_email || "Unknown Member",
          value: v.user_id,
          fp_user_id: v.user_details_id,
        }));

        setAllMembers(all);

        if (!isFamilySelected()) {
          const sM = all.find((v) => v.id === getUserId());
          if (sM) {
            handleChange({ ...sM });
          }
        }
      } else {
        setAllMembers([]);
      }
    } catch (e) {
      console.error("Error fetching family members:", e);
      setAllMembers([]);
    }
  };


  useEffect(() => {
    const mobileErrors = findMobileErrors();
    const panErrors = findPANErrors();
    if (
      !panEditable.current &&
      selectedMember.pan != "" &&
      selectedMember.pan != null
    ) {
      if (Object.keys(panErrors).length > 0) {
        setErrors((v) => ({ ...v, ...panErrors }));
      }
    }
    if (selectedMember.mobile != "" && selectedMember.mobile != null) {
      if (Object.keys(mobileErrors).length > 0) {
        setErrors((v) => ({ ...v, ...mobileErrors }));
      }
    }
  }, [selectedMember.pan, selectedMember.mobile]);

  const findMobileErrors = () => {
    const newErrors = {};
    let regex = /^[6789]\d{9}$/;
    if (!selectedMember.mobile || selectedMember.mobile === "")
      newErrors.userMobile = "Please enter valid mobile number!";
    else if (selectedMember.mobile.length !== 10)
      newErrors.userMobile = "Please enter valid mobile number!";
    else if (!regex.test(selectedMember.mobile))
      newErrors.userMobile = "Please enter valid mobile number!";
    else if (
      selectedMember.mobile ||
      regex.test(selectedMember.mobile) ||
      selectedMember.mobile.length == 10
    )
      newErrors.userMobile = "";
    return newErrors;
  };

  const findOtpErrors = () => {
    const newErrors = {};
    if (!otpInput || otpInput === "")
      newErrors.otpInput = "Please enter valid otp!";
    else if (otpInput.length !== 6)
      newErrors.otpInput = "Please enter valid otp!";
    return newErrors;
  };

  const findPANErrors = (enteredPAN = "", change_flag = "0") => {
    const newErrors = {};
    let regex = /^[A-Za-z]{3}[HPhp]{1}[A-Za-z]{1}\d{4}[A-ZHPa-zhp]{1}$/;
    var pan = "";
    if (change_flag == "1") {
      pan = enteredPAN;
    } else {
      pan = selectedMember.pan;
    }

    if (!pan || pan === "") {
      newErrors.userPan = "Please enter pan number!";
    } else if (pan.length !== 10) {
      newErrors.userPan = "Please enter valid pan number!";
    } else if (!regex.test(pan)) {
      newErrors.userPan = "Please enter valid pan number!";
    } else if (pan || regex.test(pan) || pan.length == 10) {
      // good pan

      newErrors.userPan = "";
    }
    return newErrors;
  };

  const checksession = async () => {
    try {
      let url = '';
      // let url = CHECK_SESSION;
      let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
      let session_data = await fetchEncryptData({
        method: "post",
        url: url,
        data: data,
      });

      if (session_data.error_code == "100") {
        session.current = session_data;
      } else {
        loginRedirectGuest();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkenterpanexists = async () => {
    try {
      let payload = {
        pan: selectedMember?.pan,
        user_id: selectedMember?.id
      }

      let r = await fetchPanStatus(payload);

      setKycDataOfUser({ ...r.data });

      if (r.status_code === 200 && ((r.data?.kyc_status || "").toLowerCase() === "validated" || (r.data?.kyc_status || "") === "Registered")) {
        return "";
      } else {
        if (r.status_code === 400 && r.message.toLowerCase() === "kra api exception") {
          return "";
        } else {
          return r.message ?? "Something went wrong";
        }
      }
    } catch (error) {
      console.error("Error in checkenterpanexists:", error);
      return "Something went wrong. Please try again.";
    }
  };
  // const checkenterpanexists = async () => {
  //   try {
  //     const response = await checkPan({
  //       user_id: selectedMember?.id,
  //       user_pan: selectedMember?.pan,
  //       data_belongs_to: DATA_BELONGS_TO
  //     });

  //     // Optional: store if needed
  //     setKycDataOfUser({ ...response.data, status_code: response.status_code });

  //     if ((response.status_code === 200
  //       && response.message === "Pan exists"
  //       && response.data?.user_id === selectedMember?.id)
  //       || (response.status_code === 404 && response.message === "PAN does not exist")
  //     ) {
  //       return ""; // No error — PAN is valid
  //     } else {
  //       return response.message ?? "Something went wrong";
  //     }

  //   } catch (error) {
  //     console.error("PAN check failed:", error);
  //     return "Unable to verify PAN at the moment.";
  //   }
  // };

  let member_id = getFpUserDetailsId();

  const sendOTP = async () => {
    // 
    try {
      const mobileErrors = findMobileErrors();
      const panErrors = findPANErrors();
      if (panErrors?.userPan) {
        setErrors({ ...mobileErrors, ...panErrors });
        return;
      }
      panErrors.userPan = await checkenterpanexists();

      if (
        (Object.keys(mobileErrors).length > 0 ||
          Object.keys(panErrors).length > 0) &&
        (mobileErrors.userMobile !== "" || panErrors.userPan !== "")
      ) {
        setErrors({ ...mobileErrors, ...panErrors });
        return;
      }

      let jwtTok = await getJwtToken();
      if (jwtTok.status_code === 200) {

        let trxnIdData = await GenerateMfTxnId({ "token": jwtTok.data.token });
        if (trxnIdData.status_code === 200) {
          let trxnId = trxnIdData.data.data.data.transactionId;

          let sendOTP = await GenerateSendMFotp({
            "transactionId": trxnId,
            "pan": selectedMember?.pan,
            "phone": selectedMember?.mobile,
            // "pan": "KZGPS5515B",
            // "phone": "9158834626",
          });

          if (sendOTP.status_code == 200 && sendOTP.message == "Success.") {
            clearInterval(timeNewObj.current);
            timeNewValue.current = 120;
            setItemLocal("trxnId", trxnId);
            // setShow(true);
            setModalType(1);
            setDefaultTimer();
            setOtpInput("");
            startTimer();
            setErrors({});
            return;
          } else {
            dispatch({
              type: "RENDER_TOAST",
              payload: {
                message: sendOTP?.message ?? "Someting went wrong!",
                type: "error",
              },
            });
          }
        }
        else {
          throw "";
        }
      } else {
        throw "";
      }
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Someting went wrong!",
          type: "error",
        },
      });
    }
  };

  const handleSmallcaseSDk = async () => {
    // 
    try {
      const mobileErrors = findMobileErrors();
      const panErrors = findPANErrors();
      if (panErrors?.userPan) {
        setErrors({ ...mobileErrors, ...panErrors });
        return;
      }
      panErrors.userPan = await checkenterpanexists();

      if (
        (Object.keys(mobileErrors).length > 0 ||
          Object.keys(panErrors).length > 0) &&
        (mobileErrors.userMobile !== "" || panErrors.userPan !== "")
      ) {
        setErrors({ ...mobileErrors, ...panErrors });
        return;
      }

      let jwtTok = await getJwtToken();
      if (jwtTok.status_code === 200) {
        let payload = {
          token: jwtTok.data.token,
          pan: selectedMember.pan,
          mobile: selectedMember.mobile,
          user_id: selectedMember.id
        }
        let trxnIdData = await GenerateMfTxnId(payload);
        setSmallcaseAuthToken(jwtTok.data.token)
        if (trxnIdData.status_code === 200) {
          let trxnId = trxnIdData.data.transactionId;
          setItemLocal("trxnId", trxnId);
          setSmallcaseTrxnId(trxnId);
          setShowGateway(true)
          setErrors({});
        }
        else {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: sendOTP?.message ?? "Someting went wrong!",
              type: "error",
            },
          });
        }
      } else {
        throw "";
      }
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Someting went wrong!",
          type: "error",
        },
      });
    }
  };
  const handleOtpChange = (e) => {
    setOtpInput(e.target.value);
  };

  const getJwtToken = async () => {
    try {
      const jwtTok = await GenerateMfJwtToken({
        user_id: selectedMember?.id,
      });

      if (jwtTok.status_code === 200 && jwtTok.data?.token) {
        return jwtTok; // Success
      }

      return { error: true, message: jwtTok.message || "Failed to fetch token." };
    } catch (e) {
      console.error("JWT Token Error:", e);
      return { error: true, message: "Something went wrong while generating token." };
    }
  };


  const getTransactionId = async (jwtToken) => {
    // try {
    //   let trxnId = await fetchData({
    //     method: "post",
    //     url: GETTRANSACTION_API_URL,
    //     data: {
    //       token: jwtToken,
    //     },
    //   });
    //   if (trxnId.error_code == "100") return trxnId;
    //   return "Something went wrong!";
    // } catch (e) {
    //   console.error(e);
    // }
  };



  const verifySmallcaseOTP = async () => {
    try {
      const otpErrors = findOtpErrors();
      if (Object.keys(otpErrors).length > 0) {
        setErrors(otpErrors);
        return;
      }

      let trxnId = getItemLocal("trxnId");

      let verifyOTP = await VerifyMFotp({
        "user_id": selectedMember?.id,
        "transactionId": trxnId,
        "pan": selectedMember?.pan,
        "phone": selectedMember?.mobile,
        "otp": otpInput
      });

      let errMsg = "";
      if (verifyOTP.status_code == 200) {
        if (
          kycDataOfUser?.kyc_status?.toLowerCase() == "verified" &&
          !panReadonly
        ) {
          const res = await updateBasicDetails(payload);
        }

        setModalType(2);
        // interval.current = setInterval(() => {
        //   if (stopSmallCase.current == false) {
        //     getSmallCaseData();
        //   }
        // }, 10000);
        return;
      } else {
        // let errResp = JSON.parse(verifyOTP.message);
        errMsg = "Entered OTP appears to be incorrect. Please try again.";
        // errMsg = errResp.errors[0]?.message;
      }

      if (errMsg === "Entered OTP appears to be incorrect. Please try again.") {
        setErrors({ otpInput: errMsg });
        return;
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
    }
  };

  const getSmallCaseData = async () => {
    try {
      let reqData = {
        method: "post",
        data: {
          pan: selectedMember?.pan,
          user_id: selectedMember?.id,
        },
        url: DMF_CHECK_ECAS_S3,
      };

      let checkS3Data = await fetchData(reqData);
      if (checkS3Data.error_code == "100") {
        stopSmallCase.current = true;

        let scReqData = {
          method: "post",
          url: DMF_GET_SC_DATA_API_URL,
          data: {
            pan: selectedMember?.pan,
            user_id: selectedMember?.id,
            fp_user_id: selectedMember?.fp_user_id,
            dmf: "",
          },
        };

        // if (selectedMember.fp_log_id !== undefined && selectedMember.fp_log_id !== "") {
        //   scReqData.data.fp_log_id = selectedMember.fp_log_id;
        // }

        let getScData = await fetchEncryptData(scReqData);

        if (getScData.error_code == "100") {
          let msg =
            "Hello! Your holdings have been successfully linked with Fintoo! Regards. -Team Fintoo";
          let whatsapptext =
            "Hello! Your holdings have been successfully linked with Fintoo!\nRegards,\nTeam Fintoo";
          var urlsms_success = {
            mobile: selectedMember?.mobile,
            whatsappmsg: whatsapptext,
          };
          var config1 = {
            method: "post",
            url: DMF_SENDWPSMS_API_URL,
            data: urlsms_success,
          };

          var resp_success = await fetchEncryptData(config1);
        } else {
          let msg =
            "Hello! Something went wrong while gathering your holding data. Please try again.\nRegards,\nTeam Fintoo";
          let whatsapptext_fail =
            "Hello! Something went wrong while gathering your holding data. Please try again.\nRegards,\nTeam Fintoo";
          var urlsms_fail = {
            mobile: selectedMember?.mobile,
            whatsappmsg: whatsapptext_fail,
          };
          var config2 = {
            method: "post",
            url: DMF_SENDWPSMS_API_URL,
            data: urlsms_fail,
          };

          var resp_fail = await fetchEncryptData(config2);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = async (e) => {
    try {
      setModalType(0);
      setKycDataOfUser({});
      let member = e;
      if (!member) {
        const user_id = getUserId();
        member = allMembers.find((v) => v.id === user_id);
        setSelectedMember({ ...member });
        setSendDisabled(false);
      } else {
        setSelectedMember(member);
        setErrors({});
        setSendDisabled(false);
      }
      setPanReadonly(!!member?.pan);
      setMobileReadonly(!!member?.mobile);
      // check previous holding status
      if (member?.pan) {
        // const r = await fetchData({
        //   method: "POST",
        //   url: '',
        //   data: {
        //     pan: member.pan,
        //     data_belongs_to: DATA_BELONGS_TO,
        //   },
        // });
        // if (
        //   r.data.length > 0 &&
        //   (r.data[0]["status"] ?? "").toLowerCase() == "success" &&
        //   moment(r.data[0]["Updated_Datetime"]).startOf("day").valueOf() ==
        //   moment().startOf("day").valueOf()
        // ) {
        //   setModalType(3);
        // }
      }
    } catch (error) {
      console.error("An error occurred in handleChange:", error);
    }
  };


  useEffect(() => {
    setDefaultTimer();
  }, []);

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

  const setDefaultTimer = () => {
    timer.current.counter = timer.current.default;
  };

  const handlePANChange = (e) => {
    const enteredPAN = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
    setSelectedMember({
      ...selectedMember,
      pan: ("" + enteredPAN).toUpperCase(),
    });

    const newErrors = findPANErrors(enteredPAN, "1");
    setErrors({ ...errors, ...newErrors });
  };

  const handleMobileChange = (e) => {
    const newMobile = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setSelectedMember({ ...selectedMember, mobile: newMobile });

    if (e.target.value.length == 10) {
      findMobileErrors();
    }
  };


  return (
    <PortfolioLayout>
      {/* <FintooLoader isLoading={isLoading} /> */}
      <IncompleteRegistration
        // open={isProfileIncomplete}
        onCloseModal={() => {
          // setIsProfileIncomplete(false);
          setSelectedMember({});
        }}
        handleSubmit={() => {
          setMemberId(selectedMember.id);
          {
            status === "N"
              ? navigate(
                process.env.PUBLIC_URL + "/direct-mutual-fund/Profile?s=Birth"
              )
              : navigate(
                process.env.PUBLIC_URL + "/direct-mutual-fund/profile"
              );
          }
        }}
      />

      <div className={`cotaininer ${pmc.linkholdings}`}>
        <div className="row">
          <div className="col-4 m-auto">
            <div className="holdings-form-box p-3">
              {(modalType == 0 || modalType == 3 || modalType == 2) && (
                <>
                  <div className={`${pmc.headerbox}`}>
                    <div className={`text-center ${pmc.Heading} d-flex pb-3`}>
                      <Link
                        to={
                          process.env.PUBLIC_URL +
                          "/direct-mutual-fund/portfolio/dashboard"
                        }
                      >
                        <img
                          style={{
                            transform: "rotate(180deg)",
                          }}
                          width={20}
                          height={20}
                          src={
                            process.env.PUBLIC_URL +
                            "/static/media/icons/chevron.svg"
                          }
                        />
                      </Link>
                      <p className="text-center mb-0">
                        Link Your Mutual Fund Holdings
                      </p>
                    </div>
                  </div>
                  <div className={`${pmc.formSection} pt-3`}>
                    <div className={`${pmc.FormsFillup}`}>
                      <div className="mt-md-5">
                        <span className={`${pmc.FormlableName}`}>Member *</span>
                        <Select
                          style={{
                            width: "100% !Important",
                          }}
                          classNamePrefix="sortSelect"
                          isSearchable={false}
                          options={allMembers}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          value={allMembers.filter(
                            (v) => v.id == selectedMember.id
                          )}
                        />
                      </div>

                      {kycDataOfUser.status_code == "400" ? (
                        <>
                          <div className={style["modal-cntn"] + " p-4"}>
                            <div>
                              <p className="pt-3">
                                <strong>Your kyc is not verified</strong>
                              </p>
                              <p>Please complete your KYC as it is mandatory for Mutual fund Investment.</p>
                            </div>
                            <div>
                              <button
                                className={style["long-btn"]}
                                onClick={() => {
                                  localStorage.removeItem("family");
                                  setMemberId("" + selectedMember.id);
                                  window.location = process.env.PUBLIC_URL + "/direct-mutual-fund/profile";
                                }}
                              >
                                Go to Profile
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {Object.keys(selectedMember).length > 0 ? (
                            <>
                              {modalType == 0 && (
                                <>
                                  <div className="mt-md-5">
                                    <div className="">
                                      <span className={`${pmc.FormlableName}`}>
                                        PAN *
                                      </span>
                                      <br />
                                      <p>{panReadonly}</p>
                                      <input
                                        placeholder="Enter Your PAN"
                                        // className={``}
                                        type="text"
                                        value={selectedMember.pan ?? ""}
                                        className={`${pmc.inputs} w-100`}
                                        readOnly={panReadonly}
                                        onChange={(e) => handlePANChange(e)}
                                      />
                                      {errors.userPan && (
                                        <p className="error">
                                          {errors.userPan}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="mt-md-5">
                                    <div className="">
                                      <span className={`${pmc.FormlableName}`}>
                                        Mobile Number *
                                      </span>
                                      <br />
                                      <input
                                        maxLength={10}
                                        placeholder="Enter Mobile Number"
                                        className={`${pmc.inputs} w-100`}
                                        type="text"
                                        readOnly={mobileReadonly}
                                        value={selectedMember?.mobile ?? ""}
                                        onChange={(e) => handleMobileChange(e)}
                                      />
                                      {errors.userMobile && (
                                        <p className="error">
                                          {errors.userMobile}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className={`${pmc.OtpBtn}`}>
                                    <button
                                      disabled={sendDisabled}
                                      onClick={() => handleSmallcaseSDk()}
                                    >
                                      Fetch Holdings
                                    </button>
                                  </div>
                                </>
                              )}

                              {modalType == 3 && (
                                <div className={style["modal-cntn"] + " p-4"}>
                                  <div>
                                    <p className="pt-3">
                                      <strong>
                                        Your external mutual Fund portfolio
                                        synced today.
                                      </strong>
                                    </p>
                                    <p>
                                      You can only link your holdings once every
                                      24 hours. Try again later.
                                    </p>
                                  </div>
                                  <div>
                                    <button
                                      className={style["long-btn"]}
                                      onClick={() => {
                                        navigate(
                                          process.env.PUBLIC_URL +
                                          "/direct-mutual-fund/portfolio/dashboard"
                                        );
                                      }}
                                    >
                                      DONE
                                    </button>
                                  </div>
                                </div>
                              )}

                              {modalType == 2 && (
                                <>
                                  <div className={style["modal-cntn"] + " p-4"}>
                                    <div>
                                      <p className="pt-3">
                                        <strong>
                                          Your external mutual Fund portfolio
                                          sync is in progress
                                        </strong>
                                      </p>
                                      <p>
                                        This may take 10 to 15 minutes. We will
                                        notify you once your external portfolio
                                        is synced.
                                      </p>
                                    </div>
                                    <div>
                                      <button
                                        className={style["long-btn"]}
                                        onClick={() => {
                                          navigate(
                                            process.env.PUBLIC_URL +
                                            "/direct-mutual-fund/portfolio/dashboard"
                                          );
                                        }}
                                      >
                                        DONE
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <p> </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {modalType == 1 && (
                <>
                  <div className="d-flex justify-center ">
                    <div>
                      {" "}
                      <FintooBackButton
                        onClick={() => {
                          setModalType(0);
                        }}
                        onChange={(e) => handleOtpChange(e)}
                      />
                    </div>
                    <div
                      className="DeleteBank text-center pb-3 w-100"
                      style={{
                        borderBottom: "1px solid #eeee",
                      }}
                    >
                      <h3 className="mb-0 pb-0">OTP Verification</h3>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div className="">
                        <div>
                          <div className="modal-whitepopup-box-item  border-top-0 text-center">
                            <p>
                              You will receive OTP from MF Central(SEBI
                              regulated entity) on your mobile number{" "}
                              <b>
                                +91{" "}
                                {selectedMember?.mobile
                                  .split("")
                                  .map((v, i) => (i > 2 && i < 8 ? "*" : v))
                                  .join("")}
                              </b>
                            </p>
                          </div>
                        </div>
                        <div
                          className={`d-flex justify-center align-items-center  ${style.enterbox}`}
                        >
                          <div className="m-auto">
                            <OTPInput
                              value={otpInput}
                              onChange={setOtpInput}
                              autoFocus
                              className="link-holdings-otp w-100"
                              style={{
                                border: "none", "justifyContent": "center"
                              }}
                              OTPLength={6}
                              otpType="number"
                              disabled={false}
                            />
                            {errors.otpInput && (
                              <p className="otp-error">{errors.otpInput}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-center grey-color">
                          {count == 0 && (
                            <p
                              className="pointer blue-color"
                              onClick={() => {
                                sendOTP();
                              }}
                            >
                              <span style={{ color: "black" }}>
                                Didn’t receive OTP?{" "}
                              </span>
                              Resend OTP
                            </p>
                          )}
                          {count > 0 && (
                            <p>
                              Didn’t receive OTP? Resend in &nbsp;
                              <strong>
                                {moment()
                                  .startOf("day")
                                  .seconds(count)
                                  .format("mm:ss")}
                              </strong>
                            </p>
                          )}
                        </div>
                      </div>
                      <div
                        className={` ${pmc.OTpConfirm}`}
                        onClick={() => {
                          verifySmallcaseOTP();
                        }}
                      >
                        Submit
                      </div>
                      <p>&nbsp;</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {showGateway && (
        <SmallcaseGateway
          key={smallcaseTrxnId}
          gatewayName={SMALLCASE_GATEWAY}
          authToken={smallcaseAuthToken}
          transactionId={smallcaseTrxnId}
          setIsLoading={setIsLoading}
          fetcEcas={false}
          parSnippet={false}
          portfolio={true}
          dg = {false}
          setModalType={setModalType}
        />
      )}
    </PortfolioLayout>
  );
}

export default LInkyourholdings;
