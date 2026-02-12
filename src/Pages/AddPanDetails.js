import React, { useRef, useState, useEffect } from "react";
import PortfolioLayout from "../components/Layout/Portfolio";
import pmc from "../components/Layout/Portfolio/portfolio.module.css";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import FintooBackButton from "../components/HTML/FintooBackButton";
import moment from "moment";
import { Link } from "react-router-dom";
import style from "./style.module.css";


import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getUserId,
  loginRedirectGuest,
  apiCall,
  restApiCall,
  getParentUserId,
  getItemLocal,
  setItemLocal,
  setMemberId,
  fetchEncryptData,
  fetchData,
  isFamilySelected,
  getFpUserDetailsId,
  getFpLogId,
} from "../common_utilities";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import IncompleteRegistration from "../components/IncompleteRegistration";
import FintooLoader from "../components/FintooLoader";
import OTPInput from "otp-input-react";
import { DATA_BELONGS_TO } from "../constants";
import { getFamilyMember, updateBasicDetails } from "../FrappeIntegration-Services/services/user-management-api/userApiService";
import { fetchPanStatus } from "../FrappeIntegration-Services/services/master-api/masterApiService";

function AddPanDetails(props) {
  const params = new URLSearchParams(window.location.search);
  const memberId = params.get("member") ?? null;
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
        setSelectedMember(all.find((v) => String(v.id) === String(memberId)) || {});

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

      if (r.status_code === 200 && (r.data?.kyc_status || "").toLowerCase() === "validated") {
        const res = await updateBasicDetails(payload);
        navigate(process.env.PUBLIC_URL + "/commondashboard/Report-details");
      } else {
        if (r.status_code === 400 && r.message.toLowerCase() === "kra api exception") {
          const res = await updateBasicDetails(payload);
          navigate(process.env.PUBLIC_URL + "/commondashboard/Report-details");
        }else{
          return r.message ?? "Something went wrong";
        }
      }
    } catch (error) {
      console.error("Error in checkenterpanexists:", error);
      return "Something went wrong. Please try again.";
    }
  };

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
      if (jwtTok.error_code == "100") {
        let trxnIdData = await getTransactionId(jwtTok.data.token);
        if (trxnIdData.error_code == "100") {
          let trxnId = trxnIdData.data.data.data.transactionId;
          let sendOTP = await sendSmallcaseOTP(trxnId);
          if (sendOTP.error_code == "100") {
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
        } else {
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

  const handleOtpChange = (e) => {
    setOtpInput(e.target.value);
  };

  const getJwtToken = async () => {
    // try {
    //   var reqData = {
    //     method: "post",
    //     url: GET_JWTTOKEN_API_URL,
    //     data: {
    //       user_id: selectedMember.id,
    //       is_chat_bot: 1,
    //     },
    //   };

    //   let jwtTok = await fetchData(reqData);
    //   if (jwtTok.error_code == "100") return jwtTok;
    //   return "Something went wrong!";
    // } catch (e) {
    //   console.error(e);
    // }
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

  const sendSmallcaseOTP = async (trxnId) => {
    // try {
    //   let payload = {
    //     method: "post",
    //     url: SEND_SC_OTP_API_URL,
    //     data: {
    //       transactionId: trxnId,
    //       pan: selectedMember?.pan,
    //       phone: selectedMember?.mobile,
    //     },
    //     // headers: { ...restHeaders },
    //   };

    //   let sendOTP = await fetchData(payload);
    //   return sendOTP;
    //   // if (sendOTP.error_code == "100") return sendOTP;
    //   // return sendOTP?.message??"Something went wrong!";
    // } catch (e) {
    //   console.error(e);
    // }
  };

  const verifySmallcaseOTP = async () => {
    try {
      // const otpErrors = findOtpErrors();
      // if (Object.keys(otpErrors).length > 0) {
      //   setErrors(otpErrors);
      //   return;
      // }

      // let trxnId = getItemLocal("trxnId");
      // const payload = {
      //   method: "post",
      //   data: {
      //     transactionId: trxnId,
      //     pan: selectedMember?.pan,
      //     phone: selectedMember?.mobile,
      //     is_chat_bot: 1,
      //     otp: otpInput,
      //     data_belongs_to: DATA_BELONGS_TO,
      //   },
      //   url: VERIFY_SC_OTP_API_URL,
      // };

      // let verifyOTP = await fetchData(payload);

      // let errMsg = "";

      // if (verifyOTP.error_code == "100") {
      //   if (
      //     kycDataOfUser.kyc_status.toLowerCase() == "verified" &&
      //     !panReadonly
      //   ) {
      //     let config = {
      //       url: DMF_UPDATEBASICDETAILS_API_URL,
      //       method: "post",
      //       data: {
      //         user_id: "" + selectedMember?.id,
      //         pan: selectedMember?.pan,
      //         first_name: kycDataOfUser.kyc_name,
      //         kyc_user_name: kycDataOfUser.kyc_name,
      //         kyc_verified: "1",
      //         is_direct: "" + IS_DIRECT,
      //       },
      //     };
      //     await fetchEncryptData(config);
      //   }
      //   localStorage.setItem("data-added", 1);
      //   navigate(process.env.PUBLIC_URL + "/commondashboard/Report-details");

      //   return;
      // } else if (verifyOTP.error_code) {
      //   let errResp = JSON.parse(verifyOTP.data.data.data);
      //   errMsg = errResp.errors[0]?.message;
      // }

      // if (errMsg.includes("Entered OTP appears to be incorrect")) {
      //   setErrors({ otpInput: errMsg });
      //   return;
      // }
      // setModalType(0);
      // setDefaultTimer();
      // setOtpInput("");
      // setErrors({});
      // dispatch({
      //   type: "RENDER_TOAST",
      //   payload: {
      //     message: errMsg ? errMsg : "Someting went wrong!",
      //     type: "error",
      //   },
      // });
    } catch (e) {
      console.error(e);
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

  // useEffect(() => {
  //   if (show && modalType) {
  //     document.getElementById("root").classList.add("blur-bg");
  //   } else {
  //     document.getElementById("root").classList.remove("blur-bg");
  //   }
  // }, [show, modalType]);

  const getMemberName = () => {
    const member = allMembers.find((v) => String(v.id) === String(memberId));
    if (member) {
      return member.name || member.email || "N/A";
    }
    return "N/A";
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
                          "/commondashboard/Report-details"
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
                      <p className="text-center mb-0">Add PAN</p>
                    </div>
                  </div>
                  <div className={`${pmc.formSection} pt-3`}>
                    <div className={`${pmc.FormsFillup}`}>
                      <div className="mt-md-3">
                        <span className={`${pmc.FormlableName}`}>Member *</span>

                        <p>{getMemberName()}</p>
                      </div>

                      <>
                        {Object.keys(selectedMember).length > 0 ? (
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
                                  <p className="error">{errors.userPan}</p>
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
                                  <p className="error">{errors.userMobile}</p>
                                )}
                              </div>
                            </div>
                            <div className={`${pmc.OtpBtn}`}>
                              <button
                                onClick={() => sendOTP()}
                              >
                                Save & Continue
                              </button>
                            </div>
                          </>
                        ) : (
                          <p> </p>
                        )}
                      </>
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
                                border: "none",
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
    </PortfolioLayout>
  );
}

export default AddPanDetails;
