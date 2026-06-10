import { useEffect, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import FintooBackButton from "../../HTML/FintooBackButton";
import commonEncode from "../../../commonEncode";
import { DATA_BELONGS_TO } from "../../../constants";
import axios from "axios";
import moment from "moment";
import { fetchEncryptData, apiCall, getUserId, getItemLocal } from "../../../common_utilities";
import { useNavigate } from "react-router-dom";
import { fetchUserProfileDetails, sendMail, sendSMS, sendOTP, verifyOTP } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { SendEmail, SendSMs } from "../../../FrappeIntegration-Services/services/financial-planning-api/ndaflow";
import OTPInput from "otp-input-react";

const Twofactorotpverification = (props) => {
  // 
  const timer = useRef({ obj: null, counter: 120, default: 120 });
  const [count, setCount] = useState(120);
  const [useremail, setuseremail] = useState("");
  const [usermobile, setusermobile] = useState("");
  const [generateotp, setGeneratedSmsOTP] = useState("");
  const [generatedemailotp, setGeneratedEmailOTP] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [validOtp, setValidOtp] = useState(true);
  const navigate = useNavigate();
  const [nomineeflag, setnomineeflag] = useState("");
  const [username, SetName] = useState("");
  const [OTP, setOTP] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpFlowLockRef = useRef(false);

  // const user_data = JSON.parse(localStorage.getItem("user_data"));

  useEffect(() => {
    onLoadInIt();
    fetchMail();
    fetchSms();
  }, [useremail]);

  useEffect(() => {
    var count = commonEncode.decrypt(localStorage.getItem('cart_amt'))
  })

  const randomOTP = useRef(Math.floor(Math.random() * 90000) + 10000);

  const handleOtpChange = (e) => {
    if (e.target.value.length > 5) {
      setOtpInput("");
      setValidOtp(false);
    } else {
      setOtpInput(e.target.value);
      setValidOtp(true);
    }
  };

  const submitOtp = async () => {
    if (otpFlowLockRef.current) return;

    otpFlowLockRef.current = true;

    try {
      const isVerified = await verifyOTPCode();

      if (!isVerified) {
        setValidOtp(false);
        return;
      }

      await props.onSubmit();
    } catch (err) {
      console.error(err);
    } finally {
      otpFlowLockRef.current = false;
    }
  };

  const updatenominee = async () => {
    try {
      var res = await apiCall(DMF_UPDATENOMINEE_API_URL, {
        user_id: getUserId(),
        data_belongs_to: DATA_BELONGS_TO,
        is_authenticated: "1"
      });

    } catch (e) {
      console.error(e);
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
    setOtpInput("");

    var otp = randomOTP.current;
    setGeneratedEmailOTP(otp);

    // var urlmail = {
    //   userdata: {
    //     to: useremail,
    //   },
    //   subject: "Fintoo - Your one time password",
    //   template: "otp_message_template.html",
    //   contextvar: { otp: otp ,name:username},
    // };

    var urlmail = {
      userdata: {
        to: useremail,
      },
      subject: "Fintoo - Your one time password",
      template: "otp_message_template.html",
      contextvar: { otp: otp, name: username },
    };

    // var data = commonEncode.encrypt(JSON.stringify(urlmail));
    // var config = {
    //   method: "post",
    //   url: DMF_SENDMAIL_API_URL,
    //   data: data,
    // };

    // var res = await axios(config);
    // var res = await SendEmail(urlmail)
    // var response = commonEncode.decrypt(res.data);
  };

  const onLoadInIt = async () => {
      try {
        const userid = getUserId();
        const response = await fetchUserProfileDetails(userid);
        const user_data = response?.data;
        
        if (response.status_code === "200" || response.status_code === 200) {
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

  useEffect(() => {
    timer.current.counter = timer.current.default;
    startTimer();
  }, []);

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

  const submitOtpHandler = () => {
    submitOtp();
  };

  return (
    <>
      <Modal.Header className="py-3">
        <FintooBackButton onClick={() => props.onBack()} />
        <div className="modal-title">Two Factor Authentication</div>
      </Modal.Header>
      <Modal.Body>
        <div>
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
              {count == 0 && (
                <p
                  className="pointer blue-color"
                  onClick={() => {
                    startTimer();
                    fetchSms();
                    fetchMail();
                    setValidOtp(true);
                  }}
                >
                  Resend OTP
                </p>
              )}
              {count > 0 && (
                <p>
                  Resend OTP in{" "}
                  <strong>
                    {moment().startOf("day").seconds(count).format("mm:ss")}
                  </strong>
                </p>
              )}
              {validOtp ? <> </> : <p className="red-color">Invalid OTP</p>}
            </div>

            <button
              className="mt-3 switch-fund-btn mobile-bottom-button"
              style={{ width: "100%" }}
              disabled={isSubmitting} onClick={submitOtpHandler}
            >
              {isSubmitting ? "Processing..." : "Submit"}
            </button>
          </div>
        </div>
      </Modal.Body>
    </>
  );
};
export default Twofactorotpverification;
