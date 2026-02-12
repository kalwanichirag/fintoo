import React, { useEffect, useState, useRef } from "react";
import "react-responsive-modal/styles.css";
import Profile_1 from "../../../Assets/01_pan_verfication.svg";
import Form from "react-bootstrap/Form";
import Verify from "../../../Assets/verify.png";
import { Row, Modal } from "react-bootstrap";
import { Modal as ReactModal } from "react-responsive-modal";
import axios from "axios";
import { DATA_BELONGS_TO } from "../../../../constants";
import { useDispatch } from "react-redux";
import moment from "moment";
import commonEncode from "../../../../commonEncode";
import {
  apiCall,
  errorAlert,
  fetchEncryptData,
  getUserId,
  loginRedirectGuest,
  memberId,
} from "../../../../common_utilities";
import FintooButton from "../../../HTML/FintooButton";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import OTPInput from "otp-input-react";
import Success from "../../../Assets/Success.png";

import { CheckSession, successAlert } from "../../../../common_utilities";
import { AutoTabProvider } from "react-auto-tab";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import WhiteOverlay from "../../../../components/HTML/WhiteOverlay";
import { fetchPanStatus } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { updateBasicDetails } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";

function Pan(props) {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = (val = true) => {
    setShow1(val);
    setTempKey(tempKey + 1);
  };
  const [show2, setShow2] = useState(false);
  const handleShow2 = () => {
    setShow2(true);
    setTimeout(() => {
      setShow2(false);
      window.location.href =
        process.env.PUBLIC_URL + "/direct-mutual-fund/Profile?s=Birth";
    }, 5000);
  };

  const handleClose2 = () => setShow2(false);
  const [OTP, setOTP] = useState("");
  const [form, setForm] = useState({
    inputPanNumber: props.pan || "",
  });
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [, setKycPan] = useState("");
  const [kycName, setKycName] = useState(null);
  const userid = getUserId();

  const [adharOtpError, setAdharOtpError] = useState("");
  const [otpgenerateerror, setotpgenerateerror] = useState("");
  const [kycVerified, setKycVerified] = useState(0);
  const [tempKey, setTempKey] = useState(0);
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const [isOpenReKycModal, setIsOpenReKycModal] = useState(false);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (getUserId() == null) {
      // loginRedirectGuest();
    }
  }, []);

  const { inputPanNumber, inputPanName } = form;

  useEffect(() => {
    props.dispatch({ type: "SET_PROGRESS_NAME", payload: kycName });
  }, [props, kycName]);

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const handleChange = (e) => {
    e.target.value = e.target.value.toUpperCase();
    setField(e.target.id, e.target.value);
    setKycPan(e.target.value);
  };

  const findPanErrors = () => {
    const newErrors = {};

    let regex = /^([a-zA-Z]){3}(P|H){1}([a-zA-Z]){1}([0-9]){4}([a-zA-Z]){1}?$/;
    if (!inputPanNumber || inputPanNumber === "")
      newErrors.inputPanNumber = "Please enter your PAN!";
    else if (inputPanNumber.length !== 10)
      newErrors.inputPanNumber = "Please enter a valid PAN!";
    else if (!regex.test(inputPanNumber))
      newErrors.inputPanNumber = "Please enter a valid PAN!";
    return newErrors;
  };

  const findNameErrors = () => {
    const newErrors = {};
    let regex = /([a-zA-Z\s])/;
    if (!inputPanName || inputPanName === "")
      newErrors.inputPanName = "Please enter your name as per PAN!";
    else if (inputPanName.length > 50)
      newErrors.inputPanName = "Cannot be more than 50 charachters!";
    else if (!regex.test(inputPanName))
      newErrors.inputPanName = "Please enter a valid name!";
    return newErrors;
  };

const getPanStatus = async (inputPanNumber) => {
    setShowLoader(true);
    try {
      if (getUserId() == null) {
        props.dispatch({
          type: "RENDER_TOAST",
          payload: { message: GUEST_MESSAGE, type: "error" },
        });
        return;
      }

      let payload = {
        "user_id": getUserId(),
        "pan": inputPanNumber
      }
      let respData = await fetchPanStatus(payload);
      
      setShowLoader(false);
      if (respData.status_code === 200) {
        let name = respData["data"]["kyc_name"] !== "" ? respData["data"]["kyc_name"] : "";
        setField("inputPanNumber", inputPanNumber);
        setField("inputPanName", name);
        if (name) setKycVerified(1);
        setKycName(name);
        setIsDisabled(true);

        props.dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "You will not be able to edit PAN after clicking Next.",
            autoClose: 10000,
            type: "success",
          },
        });
      } else if (respData.status_code === 400 && respData.message.includes("already associated")) {
        errorAlert(respData.message);
      } else if (respData.status_code === 400 && respData.message.includes("KYC not verified")) {
        setIsOpenReKycModal(true);
      } else if (respData.status_code === 400 && respData.message.includes("KRA API exception")) {
        errorAlert("Something went wrong, please try again after sometime.")
      } else if (respData.status_code === 500){
        setIsDisabled(true);
        setIsOpenReKycModal(true);
      }
    } catch (err) {
      setShowLoader(false);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went Wrong...", type: "error" },
      });
    }
  };

  if (kycName != null && kycName !== "") {
    var name_user = kycName;
    var aadhar_name = name_user;
  } else {
    var aadhar_name = inputPanName;
  }

  const updatePanData = (event) => {
    const newErrors = findPanErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    getPanStatus(inputPanNumber);
  };

  const handleSubmit = async () => {
    const newNameErrors = findNameErrors();
    const newPanErrors = findPanErrors();
    var ret = false;
    if (Object.keys(newNameErrors).length > 0) {
      setErrors(newNameErrors);
      ret = true;
    }
    if (Object.keys(newPanErrors).length > 0) {
      setErrors(newPanErrors);
      ret = true;
    }
    if (ret) return;
    if (getUserId() == null) {
      props.dispatch({
        type: "RENDER_TOAST",
        payload: { message: GUEST_MESSAGE, type: "error" },
      });
      return;
    }
    // handleShow();
    // props.onNext();
    let payload = {
      user_id: userid,
      pan: inputPanNumber,
      name: inputPanName,
      kyc_user_name: inputPanName,
      kyc_verified: kycVerified,
      data_belongs_to: DATA_BELONGS_TO,
    };
    let respData = await updateBasicDetails(payload);

    if (respData["status_code"] === 200) {
      const isKycVerified = kycVerified === 1;
      if (window.webengage && window.webengage.user) {
        webengage.user.setAttribute("we_first_name", payload.name);
        webengage.user.setAttribute("fullName", payload.name);
        webengage.user.setAttribute("kyc_status", String(isKycVerified));
      }
      props.onNext();
    } else {
      if (respData["message"] !== "") {
        errorAlert(respData["message"]);
      } else {
        errorAlert();
      }
      return;
    }

    handleShow();
    props.dispatch({
      type: "SET_PROGRESS",
      payload: Math.round((1 / 18) * 100),
    });
  };

  const timer = useRef({ obj: null, counter: 120, default: 120 });
  const [count, setCount] = useState(10);
  useEffect(() => {
    timer.current.counter = timer.current.default;
  }, []);

  const startTimer = () => {
    setOTP("");
    clearInterval(timer.current.obj);
    timer.current.counter = timer.current.default;
    timer.current.obj = setInterval(() => {
      if (timer.current.counter > 0) {
        timer.current.counter = timer.current.counter - 1;
        setCount(timer.current.counter);
      } else {
        clearInterval(timer.current.obj);
        timer.current.counter = timer.current.default;
      }
    }, 1000);
  };

  const [num, setNum] = useState("");
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [otpvalue, setOtpValue] = useState();
  const [otpvalue2, setOtpValue2] = useState();
  const [otpvalue3, setOtpValue3] = useState();
  const [client_id, setclientids] = useState("");
  const [useraddress, setuseraddress] = useState("");
  const navigate = useNavigate();
  const limit = 4;
  const handleNumChange = (event) => {
    setNum(event.target.value.replace(/[^0-9\s]/g, "").slice(0, limit));

    setOtpValue(event.target.value);
    checkerror();
  };
  const handleNumChange1 = (event) => {
    setNum1(event.target.value.replace(/[^0-9\s]/g, "").slice(0, limit));
    setOtpValue2(event.target.value);
    checkerror();
  };
  const handleNumChange2 = (event) => {
    setNum2(event.target.value.replace(/[^0-9\s]/g, "").slice(0, limit));
    setOtpValue3(event.target.value);
    checkerror();
  };

  var aadhr_num = num + num1 + num2;
  function checkerror() {
    if (aadhr_num.length < 12) setotpgenerateerror("");
  }

  function inputaadhar() {
    if (aadhr_num == "" || aadhr_num == null) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Please enter aadhar number", type: "error" },
      });
    }
  }

  const generateotp = async () => {
    try {
      setShowLoader(true);
      var req_data = {
        id_number: aadhr_num,
      };
      var config = {
        method: "post",
        url: AADHAR_GENERATE_OTP,
        headers: AADHAR_HEADERS,
        data: req_data,
      };
      var res = await axios(config);
      setclientids(res["data"]["data"]["client_id"]);
      var status = res["data"]["status_code"];

      if (status == "200") {
        setShowLoader(false);
        props.dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "OTP has been sent successfully",
            type: "success",
          },
        });
        handleShow1();
        setotpgenerateerror("");
        startTimer(true);
      }
    } catch (e) {
      setShowLoader(false);
      e.toString().indexOf("failed") > -1;
      {
        setotpgenerateerror(
          "Oops! Something went wrong. please try after sometime."
        );
        handleShow1(false);
      }
    }
  };

  const verifyadharotp = async () => {
    setAdharOtpError("");
    setShowLoader(true);
    try {
      var sub_req_data = {
        client_id: client_id,
        otp: OTP,
      };

      var config = {
        method: "post",
        url: AADHAR_SUBMIT_OTP,
        headers: AADHAR_HEADERS,
        data: sub_req_data,
      };
      var res = await axios(config);

      var code = res.status;
      setuseraddress(res.data.data.address);

      const req = commonEncode.encrypt(JSON.stringify(res.data));
      localStorage.setItem("req", req);

      handleClose1();
      if (code == "200") {
        setShowLoader(false);
        aadharstatus();
        handleShow2(true);
        handleClose(true);
      } else {
        startTimer(false);
      }
    } catch (e) {
      setShowLoader(false);
      if (
        e.toString().indexOf("failed") > -1 &&
        e.toString().indexOf("400") > -1
      ) {
        setAdharOtpError("Enter OTP");
      } else if (
        e.toString().indexOf("failed") > -1 &&
        e.toString().indexOf("422") > -1
      ) {
        setAdharOtpError("Invalid OTP");
      } else {
        e.toString().indexOf("failed") > -1 && e.toString().indexOf("500") > -1;
        {
          setotpgenerateerror(
            "Oops! Something went wrong. Please try after sometime."
          );
          handleShow1(false);
          handleShow();
        }
      }
    }
  };

  const aadharstatus = async () => {
    try {
      var req_data = { user_id: userid, aadhar_verified: "yes" };
      var data = commonEncode.encrypt(JSON.stringify(req_data));

      var config = {
        method: "post",
        url: DMF_UPDATEBASICDETAILS_API_URL,
        data: data,
      };
      var res = await axios(config);
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went wrong...", type: "error" },
      });
    }
  };

  return (
    <Row className="reverse">
      <ReactModal
          classNames={{
            modal: "ModalpopupContentWidth",
          }}
          open={isOpenReKycModal}
          showCloseIcon={true}
          center
          animationDuration={0}
          closeOnOverlayClick={false}
          large
          onClose={() => {setIsOpenReKycModal(false);setIsDisabled(false)}}
        >
          <div>
            <h3 className="text-center HeaderText">Attention !</h3>
            <div className="p-2" style={{ fontSize: "1.2rem" }}>
              <p>Dear Client,</p>
              <p>
                We regret to inform you that your KYC verification has failed
                due to certain reasons. As per the recent circular by SEBI, we
                need you to undergo the Re-KYC (Re-verification of KYC) process.
              </p>
              <p>
                Ensuring compliance with KYC norms is crucial for regulatory
                purposes and to maintain the integrity of our financial
                services. Therefore, we kindly request your cooperation in
                completing the Re-KYC process at your earliest convenience.
              </p>
              <p>
                Please{" "}
                <a
                  href="https://investor-web.hdfcfund.com/kyc-verification"
                  onClick={() => {
                    setIsOpenReKycModal(false);
                    setIsDisabled(false);
                  }}
                  target="_blank"
                >
                  Click Here
                </a>{" "}
                to initiate the Re-KYC process. Your understanding and prompt
                action in this matter are greatly appreciated.
              </p>
              <div
                className="ButtonBx aadharPopUpFooter"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  className="ReNew"
                  onClick={() => {
                    setIsOpenReKycModal(false);
                    setIsDisabled(false);
                    window.open(
                      "https://investor-web.hdfcfund.com/kyc-verification",
                      "_blank"
                    );
                  }}
                >
                  Re-KYC
                </button>
                <button
                  style={{ backgroundColor: "#999" }}
                  className="ReNew"
                  onClick={() => {
                    setIsOpenReKycModal(false);
                    setIsDisabled(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </ReactModal>
      <ToastContainer limit={1} />
      <WhiteOverlay show={showLoader} />
      <div className="ProfileImg col-12 col-md-6">
        <div>
          <img src={Profile_1} alt="" />
        </div>
      </div>
      <div className="col-12 col-md-6 RightPanel">
        <div className="rhl-inner">
          <h4>PAN Verification</h4>
          <p className="mt-4 mb-5">To comply with regulatory requirements, we require your PAN Number to process your investments. This is a mandatory step to ensure the security and legality of your transactions on our platform.</p>

          <div className="pn-rht-bx">
            <div className="pn-rht-bx-txt">
              <Form.Control
                type="text"
                className="InputText shadow-none w-100"
                id="inputPanNumber"
                name="inputPanNumber"
                placeholder="Enter PAN"
                aria-describedby="inputPanNumBlock"
                maxLength={10}
                onChange={handleChange}
                isInvalid={!!errors.inputPanNumber}
                disabled={isDisabled || showLoader}
                value={inputPanNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.inputPanNumber}
              </Form.Control.Feedback>
            </div>
            <div className="pt-4 pt-md-0">
              <FintooButton
                className="d-block me-0 ms-auto"
                type="button"
                onClick={() => {
                  updatePanData();
                }}
                title={showLoader ? "Processing..." : "Verify"}
                disabled={isDisabled || showLoader}
              />
            </div>
          </div>

          {/* if PAN name received */}
          {kycName != null && kycName !== "" && (
            <>
              <hr className="ProfileHr" />
              <div className="VerifyDetails">
                <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Please verify your name and click Next
                </p>
                {/* <small>Please verify your name and click Next</small> */}
                <div className="">
                  <div className="pn-rht-bx-txt">
                    <div
                      className="py-2 d-flex align-items-center"
                      style={{ display: "flex" }}
                    >
                      <div>
                        <img style={{ width: "32px" }} src={Verify} alt="" />
                      </div>
                      <div>
                        <h4 className="m-0 PanName">
                          {kycName !== "" ? kycName : ""}
                        </h4>
                      </div>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.inputPanName}
                    </Form.Control.Feedback>
                  </div>
                  <div className="profile-btn-container fintoo-top-border pt-4 mt-4">
                    <p>
                      <span className="NotCorrect">Incorrect,</span>
                      <span
                        className="ChangePan"
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          setField("inputPanName", "");
                          setKycName(null);
                          setIsDisabled(false);
                        }}
                      >
                        &nbsp;<b>Change PAN</b>
                      </span>
                    </p>
                    <FintooButton
                      type="button"
                      onClick={() => {
                        handleSubmit();
                      }}
                      title="Next"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* if PAN name not received */}
          {kycName != null && kycName === "" && (
            <>
              <hr className="ProfileHr" />
              <div className="VerifyDetails">
                <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Please enter your name as per PAN
                </p>
                {/* <small>Please verify the name and click Next</small> */}
                <div className="pn-rht-bx">
                  <div className="pn-rht-bx-txt">
                    <Form.Control
                      type="text"
                      className="InputText shadow-none w-100"
                      id="inputPanName"
                      name="inputPanName"
                      placeholder="Enter Name"
                      aria-describedby="inputPanNameBlock"
                      maxLength={50}
                      onChange={(e) => {
                        if (e.target.value.match("^[a-zA-Z ]*$") != null) {
                          setField(e.target.id, e.target.value);
                        }
                      }}
                      isInvalid={!!errors.inputPanName}
                      value={inputPanName}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.inputPanName}
                    </Form.Control.Feedback>
                  </div>
                  <div className="profile-btn-container">
                    <FintooButton
                      type="button"
                      onClick={handleSubmit}
                      title="Next"
                    />
                  </div>
                </div>
              </div>
              <div className="MobilePanUI">
                <p>
                  <span className="NotCorrect">Incorrect,</span>
                  <span
                    className="ChangePan "
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      setField("inputPanName", "");
                      setKycName(null);
                      setIsDisabled(false);
                    }}
                  >
                    &nbsp;<b>Change PAN</b>
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Row>
  );
}

const mapStateToProps = (state) => ({
  progressValue: state.progressValue,
  progressTitle: state.progressTitle,
});

export default connect(mapStateToProps)(Pan);
