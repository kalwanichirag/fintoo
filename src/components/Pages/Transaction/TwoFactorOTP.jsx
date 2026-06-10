import { useEffect, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import FintooBackButton from "../../HTML/FintooBackButton";
import commonEncode from "../../../commonEncode";
import { DATA_BELONGS_TO } from "../../../constants";
import axios from "axios";
import moment from "moment";
import { fetchEncryptData, apiCall, getUserId, getItemLocal } from "../../../common_utilities";
import { useNavigate } from "react-router-dom";
import { fetchUserProfileDetails, sendMail, sendOTP, verifyOTP } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { SendSMs } from "../../../FrappeIntegration-Services/services/financial-planning-api/ndaflow";
import { addNomineeDetails } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
import OTPInput from "otp-input-react";

const TwoFactorOtpModal = (props) => {
  const user_data = JSON.parse(localStorage.getItem("user_data"));

  const timer = useRef({ obj: null, counter: 120, default: 120 });
  const otpRef = useRef(null);
  const [count, setCount] = useState(120);
  const [useremail, setuseremail] = useState("");
  const [usermobile, setusermobile] = useState("");
  const [generatedemailotp, setGeneratedEmailOTP] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [validOtp, setValidOtp] = useState(true);
  const [nomineeflag, setnomineeflag] = useState("");
  const [username, SetName] = useState("");
  const [OTP, setOTP] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    onLoadInIt();
    if (useremail && usermobile) {
      fetchMail();
      fetchSms();
    }
  }, [useremail, usermobile, username]);

  const handleOtpChange = (e) => {
    if (e.target.value.length > 5) {
      setOtpInput("");
      setValidOtp(false);
    } else {
      setOtpInput(e.target.value);
      setValidOtp(true);
    }
  };

  const verifyOTPCode = async () => {
    try {
      const payload = {
        identifier: usermobile,
        for_otp: "mobile",
        otp: OTP
      }

      const response = await verifyOTP(payload);
      if (response.status_code == 200 || response.status_code == "200") {
        return true;
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.message, type: "error" },
        });
        return false;
      }
    } catch (error) {
      console.log("Error in verifyOTP:", error);
      return false;
    }

  }

  const submitOtp = async () => {
    const isVerified = await verifyOTPCode();
    if (!isVerified) {
      setValidOtp(false);
    }
    props.onSubmit();
  };

  // const updatenominee = async () => {
  //   try {
  //     await apiCall(DMF_UPDATENOMINEE_API_URL, {
  //       user_id: getUserId(),
  //       data_belongs_to: DATA_BELONGS_TO,
  //       is_authenticated: "1",
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const updatenominee = async () => {
    try {

      const payload = {
        user_id: getUserId(),
        "data_belongs_to": DATA_BELONGS_TO,
      }
      await addNomineeDetails(payload)
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSms = async () => {

    try {
      const payload = {
        identifier: usermobile,
        for_otp: "mobile"
      }

      await sendOTP(payload);
    } catch (err) {
      console.error("SMS sending failed:", err);
    }
  };

  const fetchMail = async () => {
    try {
      const payload = {
        identifier: useremail,
        for_otp: "email"
      }

      await sendOTP(payload);
    } catch (err) {
      console.error("SMS sending failed:", err);
    }
  };

  const onLoadInIt = async () => {
    try {
      const userid = getUserId();
      const response = await fetchUserProfileDetails(userid);
      const user_data = response?.data;
      console.log("User profile data:", response);

      if (response.status_code === 200) {
        SetName(user_data.user_name);
        setnomineeflag(user_data.is_authenticated);
        setuseremail(user_data.user_email);
        setusermobile(user_data.mobile);
      }
    } catch (e) {
      console.error("User profile fetch failed:", e);
    }
  };

  // const onLoadInIt = () => {
  //   SetName(user_data.user_name)
  //   setnomineeflag(user_data.is_authenticated);
  //   setuseremail(user_data.user_email);
  //   setusermobile(user_data.mobile);
  // };

  const startTimer = () => {
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
  // useEffect(() => {
  //   const userData = JSON.parse(localStorage.getItem("user_data")) || {};
  //   if (userData) {
  //     SetName(userData.user_name || "");
  //     setnomineeflag(userData.is_authenticated || false);
  //     setuseremail(userData.user_email || "");
  //     setusermobile(userData.mobile || "");
  //   }
  // }, []);

  // useEffect(() => {
  //   if (useremail && usermobile) {
  //     // ✅ this runs only once because of ref guard
  //     if (!otpRef.current) {
  //       const otp = generateOTP();
  //       fetchMail();
  //       fetchSms();
  //       timer.current.counter = timer.current.default;
  //       setCount(timer.current.default);
  //       startTimer();
  //     }
  //   }
  // }, [useremail, usermobile]);

  useEffect(() => {
    timer.current.counter = timer.current.default;
    startTimer();
  }, []);

  var props_data = props.value;

  return (
    <>
      <Modal.Header className="py-3">
        <FintooBackButton onClick={() => props.onBack()} />
        <div className="modal-title">Two Factor Authentication</div>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="modal-whitepopup-box-item grey-color border-top-0 text-center">
            <p>Please enter OTP sent to</p>
            <p><strong>{useremail}</strong></p>
            <p><strong>{usermobile}</strong></p>
          </div>

          <div className="d-flex justify-content-center align-items-center">
            <OTPInput
              value={OTP}
              onChange={setOTP}
              style={{
                width: "auto",
              }}
              autoFocus
              className="rounded rounded-otp"
              OTPLength={6}
              otpType="number"
              disabled={false}
            />
          </div>

          <div className="text-center p-4 grey-color">
            {count === 0 ? (
              <p
                className="pointer blue-color"
                onClick={() => {
                  fetchSms();
                  fetchMail();
                  setValidOtp(true);
                  timer.current.counter = timer.current.default;
                  setCount(timer.current.default);
                  startTimer();
                }}
              >
                Resend OTP
              </p>
            ) : (
              <p>
                Resend OTP in{" "}
                <strong>
                  {moment().startOf("day").seconds(count).format("mm:ss")}
                </strong>
              </p>
            )}
            {!validOtp && <p className="red-color">Invalid OTP</p>}
          </div>

          <div
            className="mt-3 switch-fund-btn mobile-bottom-button"
            onClick={submitOtp}
          >
            Submit
          </div>
        </div>
      </Modal.Body>
    </>
  );
};

export default TwoFactorOtpModal;
