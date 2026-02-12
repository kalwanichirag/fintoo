import React, { useState, useRef } from "react";
import { useEffect, useCallback } from "react";
import styles from "./Signup.module.css";
import bg from "../Login/Login.png";
import arrow from "./Arrow.svg";
import HideHeader from "../../components/HideHeader";
import HideFooter from "../../components/HideFooter";
import { IoMdArrowBack } from "react-icons/io";
import InternationalNumber from "../InternationalNumber";
import axios from "axios";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import SimpleReactValidator from "simple-react-validator";
import commonEncode from "../../commonEncode";
import {
  loginRedirectGuest,
  setUserId,
  setItemLocal,
  deleteCookie,
  getUserId,
  getItemLocal,
  apiCall,
  getCookie,
  getCookieData,
  createCookie,
  fetchEncryptData,
  getParentUserId,
} from "../../common_utilities";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { BASE_API_URL, DATA_BELONGS_TO } from "../../constants";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import ReCaptchaComponent from "../../components/Recaptcha/ReCaptchaComponent";
import Cookies from "js-cookie";


const Whatsapp = () => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
        <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clipRule="evenodd"></path>
      </svg>
    </>
  )
}

function Signup() {
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 700);
  const firstPageRef = useRef(null);
  const secondPageRef = useRef(null);
  const inputRefs = Array(5).fill().map(() => useRef(null));
  const [errorMsg, setErrorMsg] = useState("");
  const [otp, setOTP] = useState(["", "", "", "", ""]);
  const [enableVerify, setEnableVerify] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(300);
  const [mobileNo, setMobileNo] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [isMobileValid, setMobileValidation] = useState(false);
  const [mobileErrorMsg, setMobileErrorMsg] = useState("");
  const simpleValidator = useRef(new SimpleReactValidator());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [subscribeError, setSubscribeErrorMsg] = useState("");
  const [subscribenotificationError, setSubscribenotificationErrorMsg] = useState('');
  const [otpReceived, setOtpReceived] = useState("");
  const [isSubsChecked, setSubs] = useState(false);
  const [isSubsnotiChecked, setSubsnoti] = useState(true);
  // const [, forceUpdate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [otperror, setOTPError] = useState("");
  const [resendOTPRegCounter, setResendOTPRegCounter] = useState(1);
  const [otpActive, setOTPActive] = useState(1);
  const [alreadyExistMsg, setAlreadyExistMsg] = useState("");
  const [doesMobileExist, setMobileExist] = useState(false);
  // const [checkEmailExists, setCheckEmailExists] = useState('')
  const [isActive, setIsActive] = useState(false);
  const recaptchaRef = useRef();
  const [isMobileFieldValid, setIsMobileFieldValid] = useState(false);
  const [isSecondPageActive, setIsSecondPageActive] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState(null);
  const [subscribeChecked, setSubscribeChecked] = useState(true);
  const storedUtmSource = Cookies.get("utm_source");
  const storedTagval = Cookies.get("tagval");
  const storedPageurl = Cookies.get("pageurl");

  useEffect(() => {
    setSubscribeChecked(true)
  }, [])

  const forceUpdate = useCallback(() => {
    setSubscribeErrorMsg((prev) => prev + " ");
    setSubscribenotificationErrorMsg((prev) => prev + " ");
  }, []);

  useEffect(() => {
    if (!isMobileValid && alreadyExistMsg !== "") {
      setAlreadyExistMsg("");
    }
  }, [alreadyExistMsg, isMobileValid]);

  useEffect(() => {
    if (mobileNo) {
      setMobileErrorMsg("");
    }
  }, [mobileNo])

  useEffect(() => {
    if (isMobileValid) {
      setMobileErrorMsg("");
    }
  }, [isMobileValid]);

  // Once the user enters his/her details and clicks on continue button, here all the details get verified and then moved forward
  const flipForward = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    // recaptchaRef.current.execute();
    // const token = await recaptchaRef.current.executeAsync();
    // let url = VERIFY_GOOGLE_CAPTCHA;
    let url = '';
    let data = { token: recaptchaToken };
    let captchaVerify = await apiCall(url, data, false, false);

    if (captchaVerify["error_code"] == "100" && captchaVerify["data"]["success"]) {
      recaptchaRef.current.reset();

      var isFormValid = simpleValidator.current.allValid();

      // Reset error messages
      setRecaptchaToken(null)
      setSubscribeErrorMsg('');
      setSubscribenotificationErrorMsg('')
      setMobileErrorMsg('');
      setErrorMsg('');

      // Handle subscription agreement error
      if (!isSubsChecked) {
        setSubscribeErrorMsg("You must agree to the Terms & Conditions and Privacy Policy to proceed.");
        setSubscribenotificationErrorMsg('Please subscribe to receive notifications.')
      }
      else {
        setSubscribeErrorMsg("")
      }
      // Handle mobile number errors and validations
      if (!mobileNo) {
        setMobileErrorMsg("Please enter mobile number.");
      } else if (mobileNo.startsWith("0")) {
        setMobileErrorMsg("Mobile number should not start with zero.");
      }
      else if (mobileNo.length < 10) {
        setMobileErrorMsg("Please enter a valid mobile number.");
      }
      else if (!isMobileValid) {
        setMobileErrorMsg("Please enter a valid mobile number.");
      }
      const hasNoErrors =
        isFormValid &&
        // isSubsChecked &&
        subscribeChecked &&
        mobileErrorMsg === "" &&
        isMobileValid &&
        !doesMobileExist &&
        alreadyExistMsg === "";

      if (hasNoErrors && !emailErrorMsg && !mobileErrorMsg) {
        setSubscribeErrorMsg("")
        if (isSmallScreen) {
          firstPageRef.current.style.left = "100%";
          firstPageRef.current.style.display = "none";
          setTimerOn(true);
        } else {
          setTimerOn(true);
          await new Promise((resolve) => setTimeout(resolve, 700));
          secondPageRef.current.style.transform = "rotateY(-180deg)";
        }
        setIsSecondPageActive(true);
        setNavigationDirection('forward');
        // Perform other actions after transition
        setIsActive(true);
        if (!isActive) {
          sendSMS(mobileNo, email, firstName, countryCode);
        }

      } else {
        // Show validation messages if form is not valid
        simpleValidator.current.showMessages();
        setSubscribeErrorMsg("You must agree to the Terms & Conditions and Privacy Policy to proceed.");
      }
    }
  };

  const deleteCookie = (name) => {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    // setIsLoading(false);
    // let url = constClass.CHECK_SESSION;
    // let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
    // let respData = await apiCall(url, data, true, false);
    // if (respData["error_code"] == "100") {
    //   toastr.options.positionClass = "toast-bottom-left";
    //   toastr.success("You are already logged in");
    //   window.location.href = process.env.PUBLIC_URL + "/commondashboard/";
    // }
  };

  const getCookie = (cname) => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  // This timer is of 5 minutes for the user to enter OTP
  useEffect(() => {
    let interval;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }
    if (seconds == 0) {
      setOTPActive(0);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const createCookie = (name, value, minutes) => {
    if (minutes) {
      var date = new Date();
      date.setTime(date.getTime() + minutes * 60 * 1000);
      var expires = "; expires=" + date.toGMTString();
    } else {
      var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  };

  const getCookieData = (name) => {
    var pairs = document.cookie.split("; "),
      count = pairs.length,
      parts;
    while (count--) {
      parts = pairs[count].split("=");
      if (parts[0] === name) return parts[1];
    }
    return false;
  };

  useEffect(() => {
    timer(180);
  }, []);

  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);

  useEffect(() => {
    if (timerOn) {
      const id = setTimeout(function () {
        timer(180);
      }, 1000);
      setTimerId(id);
      setOTPActive(1);
    } else {
      // setOTPActive(0)
      clearTimeout(timerId);
    }
    return () => clearTimeout(timerId);
  }, [timerOn]);

  const sendSMS = async (mobileNo, email, firstName, countryCode) => {
    var otp = Math.floor(Math.random() * 90000) + 10000;
    setOtpReceived(otp);
    try {
      var otpmsg =
        "Greetings from Fintoo! Your OTP verification code is " + otp;
      var whatsapptext =
        "Greetings from Fintoo! Your OTP verification code is : " + otp;
      var data = {
        mobile: mobileNo,
        msg: otpmsg,
        otp: otp,
        data_belongs_to: DATA_BELONGS_TO,
        key: "register",
        sms_api_id: "fintoo_otp",
        whatsapptext: whatsapptext,
        country_code: countryCode,
      };
      var config = {
        method: "POST",
        url: BASE_API_URL + "restapi/sendsmsApi/",
        data: commonEncode.encrypt(JSON.stringify(data)),
      };
      var res = await axios(config);
      if (res) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("OTP sent to registered email/mobile");
        try {
          var mail_payload = {
            userdata: {
              to: email,
            },
            subject: "Fintoo - Verification for your new account",
            template: "otp_message_template.html",
            contextvar: { otp: otp, name: firstName },
          };
          var mail_config = {
            method: "POST",
            url: BASE_API_URL + "restapi/sendmail/",
            data: commonEncode.encrypt(JSON.stringify(mail_payload)),
          };
          var mail_res = await axios(mail_config);
          if (mail_res) {
          }
        } catch (e) {
          console.log("Error Occurred ===>>>>", e);
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.log("Error Occurred ===>>>> ", e);
    }
  };

  const flipBackward = () => {
    if (isSmallScreen) {
      firstPageRef.current.style.left = "0%";
      firstPageRef.current.style.display = "block";
      setTimerOn(false);
    } else {
      setOTPError("");
      setOTP(["", "", "", "", ""]);
      setFirstName("");
      setLastName("");
      setEmail("");
      setSubs(false);
      setMobileNo("");
      setTimerOn(false);
      setIsActive(false);
      setSeconds(0);
      timer(0);
      setOTPActive(0);
      setEmailErrorMsg("");
      setSubscribeErrorMsg("");
      setSubscribenotificationErrorMsg('');
      setMobileErrorMsg("");
      setMobileValidation("");
      simpleValidator.current.visibleFields = [];
      simpleValidator.current.hideMessages();
      secondPageRef.current.style.transform = "rotateY(0)";
    }
  };

  const handleResize = () => {
    isSmallScreen.current = window.innerWidth < 700;
    if (isSmallScreen.current) {
      firstPageRef.current.style.left = "0";
    } else {
      firstPageRef.current.style.left = "50%";
    }
  };

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOTP(newOtp);
      if (value && index < otp.length - 1) {
        inputRefs[index + 1].current.focus();
      }
      const allFilled = newOtp.every(val => val !== "");
      setEnableVerify(allFilled);
    }
  };

  const handleBackspace = (e, index) => {
    if (e.keyCode === 8 && !otp[index] && index > 0) {
      otp[index - 1] = "";
      setOTP([...otp]);
      inputRefs[index - 1].current.focus();
      setEnableVerify(false);
    }
  };

  // const fetchValidateMobileNo = async () => {
  //   if (mobileNo) {
  //     var config = {
  //       method: "GET",
  //       url:
  //         BASE_API_URL +
  //         "restapi/checkmobileexist/?mobile=" +
  //         mobileNo +
  //         "&country_code=" +
  //         btoa("00" + countryCode) +
  //         "&is_direct=1",
  //     };
  //     var res = await axios(config);
  //     var validateMobileNo = res.data;
  //     if (validateMobileNo != true) {
  //       setAlreadyExistMsg(res.data);
  //       setMobileExist(true);
  //     } else {
  //       setAlreadyExistMsg("");
  //       setMobileExist(false);
  //     }
  //   }
  // };

  const fetchValidateMobileNo = useCallback(async () => {
    if (mobileNo) {
      const res = await axios.get(
        `${BASE_API_URL}restapi/checkmobileexist/?mobile=${mobileNo}&country_code=${btoa("00" + countryCode)}&data_belongs_to=${DATA_BELONGS_TO}`
      );
      setAlreadyExistMsg(res.data !== true ? res.data : "");
      setMobileExist(res.data !== true);
    }
  }, [mobileNo, countryCode]);

  useEffect(() => {
    if (mobileNo) {
      fetchValidateMobileNo();
    }
  }, [mobileNo, fetchValidateMobileNo]);

  useEffect(() => {
    document.body.classList.remove("bgImagClass");
    document.body.classList.add("login-demo");
    return function cleanup() {
      document.body.classList.add("bgImagClass");
      document.body.classList.remove("login-demo");
    };
  }, []);

  // useEffect(() => {
  //   const checkbox = document.getElementById("accept");
  //   if (checkbox) {
  //     checkbox.checked = isSubsChecked;
  //   }
  // }, [isSubsChecked]);

  // This is the logic for resend OTP logic
  const resendOTP = () => {
    setNavigationDirection('forward');
    setIsSecondPageActive(true);
    setOTPError("");
    setOTP(["", "", "", "", ""]);
    if (resendOTPRegCounter == 1) {
      if (getCookieData("resendregotpcookie")) {
        var expiry_time = getCookieData("resendregotpcookie");
        var current_time = new Date().getTime();
        if (current_time > expiry_time) {
          var date = new Date();
          if (!getCookieData("resendregotpcookie")) {
            createCookie(
              "resendregotpcookie",
              date.setTime(date.getTime() + 30 * 60 * 1000),
              30
            );
          }
          setResendOTPRegCounter((oldCount) => oldCount + 1);
          sendSMS(mobileNo, email, firstName, lastName, countryCode);
          timer(180);
          setOTPActive(1);
          setSeconds(300);
          setIsActive(true);
        } else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(
            "You've reached Maximum Attempts to generate OTP. Please try again after 30 min."
          );
          setResendOTPRegCounter(1);
        }
      } else {
        var date = new Date();
        if (!getCookieData("resendregotpcookie")) {
          createCookie(
            "resendregotpcookie",
            date.setTime(date.getTime() + 30 * 60 * 1000),
            30
          );
        }
        setResendOTPRegCounter((oldCount) => oldCount + 1);
        sendSMS(mobileNo, email, firstName, lastName, countryCode);
        timer(180);
        setOTPActive(1);
        setSeconds(300);
        setIsActive(true);
      }
    } else if (resendOTPRegCounter <= 3) {
      var expiry_time = getCookieData("resendregotpcookie");
      var current_time = new Date().getTime();
      if (expiry_time < current_time) {
        toastr.error(
          " You've reached Maximum Attempts to generate OTP. Please try again after 30 min."
        );
        $scope.resend_otp_counter = 1;
      } else {
        var date = new Date();
        if (!getCookieData("resendregotpcookie")) {
          createCookie(
            "resendregotpcookie",
            date.setTime(date.getTime() + 30 * 60 * 1000),
            30
          );
        }
        setResendOTPRegCounter((oldCount) => oldCount + 1);
        sendSMS(mobileNo, email, firstName, lastName, countryCode);
        timer(180);
        setOTPActive(1);
        setSeconds(300);
        setIsActive(true);
      }
    } else {
      var expiry_time = getCookieData("resendregotpcookie");
      var current_time = new Date().getTime();
      if (current_time > expiry_time) {
        setResendOTPRegCounter(1);
      }
      toastr.error(
        " You've reached Maximum Attempts to generate OTP. Please try again after 30 min."
      );
    }
  };

  // This is to check if the email id entered by the user exists or not
  // const fetchValidateemail = async (val) => {
  //   var config = {
  //     method: "GET",
  //     url: BASE_API_URL + "restapi/checkemailexist/?email=" + val + "&is_direct=1",
  //   };
  //   var res = await axios(config);
  //   var validateEmail = res.data;
  //   if (validateEmail != true) {
  //     setEmailErrorMsg(res.data);
  //   } else {
  //     setEmailErrorMsg("");
  //   }
  //   if (val == "") {
  //     setEmailErrorMsg("");
  //   }
  // };

  const fetchValidateemail = useCallback(async (val) => {
    if (val.trim() === "") {
      setEmailErrorMsg("");
      return;
    }
    const res = await axios.get(`${BASE_API_URL}restapi/checkemailexist/?email=${val}&data_belongs_to=${DATA_BELONGS_TO}`);
    setEmailErrorMsg(res.data !== true ? res.data : "");
  }, []);

  const handleSubscribeClick = (e) => {
    setSubscribeChecked(prev => !prev);
    if (e.target.checked == false) {
      setSubscribeErrorMsg("You must agree to the Terms & Conditions and Privacy Policy to proceed.");
      // setSubscribenotificationErrorMsg('Please subscribe to receive notifications.')
    } else {
      setSubscribeErrorMsg("");
      // setSubscribenotificationErrorMsg('')
    }
    setSubs(e.target.checked);
  };
  const handleSubscribenotificationClick = (e) => {
    // if (e.target.checked == false) {
    //   setSubscribenotificationErrorMsg("Please subscribe to receive notifications.");
    // } else {
    //   setSubscribenotificationErrorMsg("");
    // }
    setSubsnoti(e.target.checked);
  };


  useEffect(() => {
    if (otp.join("") == "") {
      setOTPError("");
    }
  }, [otp]);

  const verifyOtp = (event, otpValue) => {
    event.preventDefault();
    event.stopPropagation();
    var isFormValid = simpleValidator.current.allValid();
    var otp = otpValue.join("");
    var sentOTP = otpReceived;

    if (otp == "") {
      setOTPError("Please enter OTP");
    } else if (sentOTP != otp) {
      setOTPError("The entered OTP is incorrect. Please try again");
    } else if (otp == sentOTP && otpActive == 0) {
      setOTPError("This OTP has expired.");
    }
    if (otp == sentOTP && otpActive == 1 && isFormValid) {
      callbackFunction(mobileNo, email, firstName, lastName, countryCode);
    }
  };

  const getUTMSource = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var utm_source = url.searchParams.get("utm_source");
    if (utm_source) {
      utm_source = utm_source;
    } else {
      utm_source = 27;
    }
    return utm_source;
  };

  const getRMID = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var rm_id = url.searchParams.get("rm_id");
    if (rm_id) {
      rm_id = rm_id;
    } else {
      if (getCookie("rm_id") == "") {
        rm_id = "96";
      } else {
        rm_id = getCookie("rm_id");
      }
    }
    return rm_id;
  };

  const transformEntry = (item, type) => {
    if (item != "") {
      try {
        switch (type) {
          case "email":
            var parts = item.split("@"),
              len = parts[0].length;
            return item.replace(parts[0].slice(1, -1), "*".repeat(len - 2));
          case "mobile":
            return item[0] + "*".repeat(item.length - 4) + item.slice(-3);
          default:
            throw new Error("Undefined type: " + type);
        }
      } catch {
        return item;
      }
    }
  };

  const getService = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var utm_service = url.searchParams.get("utm_service");
    if (utm_service) {
      utm_service = utm_service;
    } else {
      utm_service = "98";
    }
    return utm_service;
  };

  const getTags = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var tags = url.searchParams.get("tags");
    if (tags) {
      tags = tags;
    } else {
      tags = "fin_web_reg";
    }
    return tags;
  };


  const callbackFunction = async (
    mobileNo,
    email,
    firstName,
    lastName,
    countryCode
  ) => {
    setIsLoading(true);
    var is_expert = getCookie("is_expert");
    if (is_expert == "") {
      var payload = {
        fullname: firstName + " " + lastName,
        mobile: mobileNo,
        mailid: email,
        country_code: countryCode,
        tags: storedTagval ? storedTagval : getTags(),
        utm_source: storedUtmSource ? storedUtmSource : getUTMSource(),
        service: getService(),
        skip_mail: "1",
        rm_id: getRMID(),
        data_belongs_to: DATA_BELONGS_TO
      };
      var data = JSON.stringify(payload);
      try {
        var config = {
          method: "post",
          url: BASE_API_URL + "restapi/callback/",
          data: data,
        };
        var res = await axios(config);
        var response_obj = res.data;
        let error_code = response_obj.error_code;
        if (error_code == "0") {
          registerUserFunction(
            mobileNo,
            email,
            firstName,
            lastName,
            countryCode
          );
        } else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(response_obj.data);
          setIsLoading(false);
        }
      } catch (e) {
        console.log("Error Occured ====>>>>> ", e);
      }
    } else {
      registerUserFunction(mobileNo, email, firstName, lastName, countryCode);
    }
  };

  const registerUserFunction = async (
    mobileNo,
    email,
    firstName,
    lastName,
    countryCode
  ) => {
    var rm_id = "96";
    var expert = '96';
    if (
      getCookie("rm_id") != null &&
      getCookie("rm_id") != "" &&
      getCookie("rm_id") != "0"
    ) {
      rm_id = getCookie("rm_id");
      expert = getCookie("rm_id");
    }
    var plan_id = "";
    if (getCookie("plan_id") != null && getCookie("plan_id") == "31") {
      plan_id = getCookie("plan_id");
    }
    var payload = {
      fullname: firstName + " " + lastName,
      mobile: mobileNo,
      email: email,
      country_code: countryCode,
      tags: storedTagval ? storedTagval : getTags(),
      utm_source: storedUtmSource ? storedUtmSource : getUTMSource(),
      service: getService(),
      skip_mail: "1",
      rm_id: rm_id,
      react: "1",
      plan_id: plan_id,
      is_expert: "1",
      expert: expert,
      data_belongs_to: DATA_BELONGS_TO
    };
    var data = payload;
    try {
      var config = {
        method: "post",
        url: BASE_API_URL + "restapi/UserRegisterApi/",
        data: data,
      };

      var res = await axios(config);
      var response = res.data;
      var response_obj = response;

      let error_code = response_obj.error_code;
      var redirect_url = "/commondashboard";
      let urlParams = new URLSearchParams(window.location.search);

      if (error_code == "0") {
        if (getCookie("is_expert") == "1") {
          if (response_obj["data"]["expertflow_error_code"] == "100") {
            redirect_url = "/userflow/expert-nda";
            deleteCookie("rm_id");
            deleteCookie("plan_id");
            deleteCookie("is_expert");
          } else {
            redirect_url = "/commondashboard";
          }
        }
        let fhc = urlParams.get("fhc");
        if (fhc) {
          setItemLocal("fhc", 1);
          // let url = CHECK_SESSION;
          // let data = {
          //   user_id: response_obj.data.id.toString(),
          //   sky: response_obj.data.sky,
          // };
          // let session_data = await apiCall(url, data, true, false);
          // if (session_data["error_code"] == "100") {
          //   setUserId(response_obj.data.id);
          //   setItemLocal("sky", response_obj.data.sky);
          //   let fpLifecycleStatus = session_data["data"]["fp_lifecycle_status"];
          //   fpLifecycleStatus = fpLifecycleStatus ? fpLifecycleStatus : 0;
          //   if (fpLifecycleStatus == 0 || fpLifecycleStatus == "") {
          //     let url = ADVISORY_GET_PRICINGDETAILS_API_URL;
          //     let pricing_data = await apiCall(url, "", false, false);
          //     if (pricing_data["error_code"] == "100") {
          //       pricing_data =
          //         pricing_data["data"]["plan_details"]["plandetails"];
          //       let pricingData = pricing_data.filter(
          //         (data) => data.plan_id == 29
          //       );
          //       pricingData = pricingData[0];
          //       var amount = 0;
          //       if (
          //         pricingData.amount.isquaterly == 0 &&
          //         pricingData.amount.total != "custom"
          //       ) {
          //         amount = parseInt(pricingData.amount.total);
          //       } else {
          //         amount = pricingData.amount.Q1;
          //       }
          //       let cartdatatosend = {
          //         user_id: response_obj.data.id,
          //         plan_id: pricingData.plan_id,
          //         plan_sub_cat_id: pricingData.id,
          //         amount: amount,
          //         subscription_freq: pricingData.payment_frequency,
          //       };
          //       let url = ADVISORY_ADDTOCART_API_URL;
          //       let cart_data = await apiCall(url, cartdatatosend, true, false);
          //       if (cart_data.error_code == "100") {
          //         redirect_url = "/userflow/payment";
          //         window.location.href =
          //           process.env.PUBLIC_URL + "/userflow/payment/";
          //       }
          //     }
          //   }
          // }
        } else {
          let redUri =
            process.env.PUBLIC_URL +
            "/checkredirect";
          let sky = response_obj.data.sky;
          let auth1 = commonEncode.encrypt(
            "" + JSON.stringify(response_obj.data.id) + "|" + sky
          );
          let auth = btoa(auth1);
          let redAuth = redUri + "?auth=" + auth;
          localStorage.setItem("redirectToThis", window.location.origin + process.env.PUBLIC_URL + redirect_url);
          // if (localStorage.getItem("redirectURL")) {
          //   redAuth = localStorage.getItem("redirectURL") + "&auth=" + auth;
          // }
          setUserId(response_obj.data.id);
          setItemLocal("sky", response_obj.data.sky);
          window.location.href = redAuth;
          return;
        }
      } else {
        setIsLoading(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(response.data);
      }
    } catch (e) {
      console.log("Error Occured", e);
    }
  };

  const timer = (remaining) => {
    var m = Math.floor(remaining / 60);
    var s = remaining % 60;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    document.getElementById("timer").innerHTML = m + ":" + s;
    remaining -= 1;
    if (remaining >= 0 && timerOn) {
      const id = setTimeout(function () {
        timer(remaining);
      }, 1000);
      setTimerId(id);
      document.getElementById("otp").style.display = "none";
      document.getElementById("timer").style.display = "block";
      return;
    } else {
      // setOTPActive(0);
      document.getElementById("otp").style.display = "block";
      document.getElementById("timer").style.display = "none";
    }
  };

  const handleRecaptchaChange = (token) => {
    if (token) {
      setRecaptchaToken(token)
    } else {
      setRecaptchaToken(null)
    }
  };

  useEffect(() => {
    const url = window.location.search;
    const params = new URLSearchParams(url);
    const isexpert = params.get("isexpert");
    const rm_id = params.get("rm_id");
    const plan_id = params.get("plan_id");
    if (isexpert != null && isexpert == "1") {
      if (
        rm_id != null &&
        rm_id != "" &&
        rm_id != "0" &&
        plan_id != null &&
        plan_id == "31"
      ) {
        async function rmdetails() {
          var payload = {
            method: "post",
            // url: ADVISORY_GET_RM_DETAILS_API_URL,
            data: {
              rm_id: rm_id,
            },
          };
          let api_call_data = await fetchEncryptData(payload);
          var rm_data = api_call_data["data"];
          if (rm_data.length > 0) {
            createCookie("is_expert", isexpert, 600);
            createCookie("rm_id", rm_id, 600);
            createCookie("plan_id", plan_id, 600);
          } else {
            deleteCookie("rm_id");
            deleteCookie("plan_id");
            deleteCookie("is_expert");
          }
        }
        rmdetails();
      }
    }
  }, []);

  const generateLoginLink = () => {
    let anchorLink = process.env.PUBLIC_URL + "/login";
    let urlParams = new URLSearchParams(window.location.search);
    let src = urlParams.get("src");
    if (src) {
      anchorLink = anchorLink + "?src=" + src;
    }
    return anchorLink;
  };
  useEffect(() => {
    if (navigationDirection === 'forward' && isSecondPageActive) {
      setTimeout(() => {
        if (inputRefs[0].current) {
          inputRefs[0].current.focus();
        }
      }, 100);
    }
  }, [isSecondPageActive, navigationDirection]);
  return (
    <>
      <HideHeader />
      <HideFooter />
      <div className={`${styles.SignupcontainerDemo}`}>
        <div className={`${styles.page} ${styles.first}`} ref={firstPageRef}>
          <div className={`${styles.back}`}>
            <div className={`${styles.outer}`}>
              <div className={`${styles.logincontent}`}>
                <div className={`${styles["form-wrapper"]}`}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Link to={process.env.PUBLIC_URL + ""}>
                      <img
                        className={`${styles["login-image"]}`}
                        // src="https://stg.minty.co.in/image/?logo=1&file=logo.svg"
                        src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
                        alt="img"
                      />
                    </Link>
                  </div>
                  <h1
                    style={{ textAlign: "center", color: "#042b62" }}
                    className={`${styles.heading}`}
                  >
                    Sign up for an account
                  </h1>
                  <div className={`${styles.signupform}`} id="register">
                    <form autocomplete="off">
                      <div className="item d-md-flex">
                        <div>
                          <div
                            style={{ margin: "0px" }}
                            className={`${styles.input}`}
                          >
                            <div></div>
                            {/* <input autoComplete="false" type="text" id="fname" placeholder="First Name*" /> */}
                            <input
                              autoComplete="false"
                              type="text"
                              tabIndex="1"
                              id="fname"
                              placeholder="First Name*"
                              value={firstName}
                              className="default-input"
                              onInput={(e) => {
                                setFirstName(e.target.value);
                              }}
                              onFocus={(e) => setFirstName(e.target.value)}
                              onBlur={() => {
                                simpleValidator.current.showMessageFor(
                                  "firstName"
                                );
                                forceUpdate(1);
                              }}
                            />
                          </div>
                          <>
                            {simpleValidator.current.message(
                              "firstName",
                              firstName,
                              "required|alpha_space|min:3|max:60",
                              {
                                messages: {
                                  alpha_space: "Alphabets are allowed only.",
                                  required: "Please enter first name",
                                  max: "Name must be between 3-60 characters.",
                                  min: "Name must be between 3-60 characters.",
                                },
                              }
                            )}
                          </>
                        </div>
                        <div>
                          <div
                            style={{ margin: "0px" }}
                            className={`${styles.input} ms-md-3 mt-md-0 mt-3`}
                          >
                            {/* <input autoComplete="false" type="text" id="lname" placeholder="Last Name*" /> */}
                            <input
                              autoComplete="false"
                              type="text"
                              tabIndex="1"
                              placeholder="Last Name*"
                              value={lastName}
                              className="default-input"
                              onInput={(e) => {
                                setLastName(e.target.value);
                              }}
                              onFocus={(e) => setLastName(e.target.value)}
                              onBlur={() => {
                                simpleValidator.current.showMessageFor(
                                  "lastName"
                                );
                                forceUpdate(1);
                              }}
                            />
                          </div>
                          <div className="ms-md-3">
                            {simpleValidator.current.message(
                              "lastName",
                              lastName,
                              "required|alpha_space|min:3|max:60",
                              {
                                messages: {
                                  alpha_space: "Alphabets are allowed only.",
                                  required: "Please enter last name",
                                  max: "Name must be between 3-60 characters.",
                                  min: "Name must be between 3-60 characters.",
                                },
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="item mt-3">
                        <div
                          className={`${styles.input}`}
                          style={{ margin: "0 0px" }}
                        >
                          {/* <input autoComplete="false" type="text" id="Email" placeholder="Email*" /> */}
                          <input
                            autoComplete="false"
                            type="text"
                            tabIndex="1"
                            placeholder="Email*"
                            value={email}
                            className="default-input"
                            onInput={(e) => {
                              setEmail(e.target.value);
                              fetchValidateemail(e.target.value);
                            }}
                            onFocus={(e) => {
                              setEmail(e.target.value);
                              fetchValidateemail(e.target.value);
                            }}
                            onBlur={() => {
                              simpleValidator.current.showMessageFor("email");
                              forceUpdate(1);
                            }}

                          />
                        </div>
                        {emailErrorMsg && email && <span className="error">{emailErrorMsg}</span>}

                        <>
                          {simpleValidator.current.message("email", email, "required|email", {
                            messages: {
                              email: "The email address must be valid.",
                            },
                          })}
                        </>
                        {/* <>{simpleValidator.current.message('email', email, 'required', { messages: { required: 'Please enter email'} })}</> */}
                      </div>
                      <div className="item mt-3">
                        <div
                          className={`${styles.input}`}
                          style={{ margin: "0 0px" }}
                        >
                          {/* <input autoComplete="false" type="text" id="phonenumber" name="phonenumber" placeholder="Mobile Number*" /> */}
                          <InternationalNumber
                            value={mobileNo}
                            setCountryCode={setCountryCode}
                            fetchValidateMobileNo={fetchValidateMobileNo}
                            onChange={(v) => { setMobileNo(v); }}
                            tabIndex="4"
                            onBlur={() => { simpleValidator.current.showMessageFor("mobileNo"); }}
                            setErrorMsg={setErrorMsg}
                            setMobileValidation={setMobileValidation}
                            setMobileErrorMsg={setMobileErrorMsg}
                            setIsMobileFieldValid={setIsMobileFieldValid}
                          />
                        </div>
                        {mobileErrorMsg && (
                          <span className="srv-validation-message">
                            {mobileErrorMsg}
                          </span>
                        )}
                        {alreadyExistMsg && (
                          <span className="srv-validation-message">
                            {alreadyExistMsg}
                          </span>
                        )}
                        {errorMsg && (
                          <span className="srv-validation-message">
                            {errorMsg}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className={`mt-3 ${styles.item} ${styles.terms}`}>
                          <div
                            className={`${styles.input} ${styles.checkbox} d-flex align-items-center`}
                          >
                            <input
                              type="checkbox"
                              name=""
                              id="accept"
                              checked={subscribeChecked}
                              onClick={handleSubscribeClick}
                            />
                            <label className="ms-2" for="accept">
                              I agree to the <Link to={process.env.PUBLIC_URL + "/terms-conditions"} style={{ textDecoration: "underline", fontWeight: "600" }} className={` custom-color`} target="_blank" >
                                <span style={{ fontWeight: "500" }}>Terms & Conditions</span></Link> and <Link to={process.env.PUBLIC_URL + "/privacy-policy"} style={{ textDecoration: "underline", fontWeight: "600" }} className={` custom-color`} target="_blank" >
                                <span style={{ fontWeight: "500" }}>Privacy Policy</span></Link>*
                            </label>
                          </div>
                        </div>
                        <span style={{ lineHeight: "10px" }} className="error">{subscribeError}</span>
                      </div>
                      <div>
                        <div className={`mt-3 ${styles.item} ${styles.terms}`}>
                          <div
                            className={`${styles.input} ${styles.checkbox} d-flex align-items-center`}
                          >
                            <input
                              type="checkbox"
                              name=""
                              id="notifications"
                              onClick={handleSubscribenotificationClick}
                              checked={isSubsnotiChecked}
                            />
                            <label className="ms-2" for="notifications">
                              Subscribe me for <Whatsapp /> notifications
                            </label>
                          </div>
                        </div>
                        {/* <span className="error">{subscribenotificationError}</span> */}
                      </div>

                      <ReCaptchaComponent ref={recaptchaRef} onChange={handleRecaptchaChange} />
                      <div
                        className="item mt-3"
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <button
                          className={`${styles.loginpagebtn} custom-background-color ${styles["login-btn"]}`}
                          onClick={flipForward}
                        >
                          Continue
                          <img
                            style={{
                              marginTop: "0",
                              float: "right",
                              marginRight: ".6rem",
                            }}
                            width={20}
                            src={arrow}
                            alt="arrow"
                          />
                        </button>
                      </div>
                    </form>
                    <div className={`${styles.hrline}`}></div>
                    <div style={{ paddingTop: ".3rem", textAlign: "center" }}>
                      <span style={{ color: "#9e9e9e" }}>
                        Already have an account?{" "}
                        <span className={`${styles.forgetPassword}`}>
                          <Link
                            to={generateLoginLink()}
                            style={{
                              textDecoration: "underline",
                              fontWeight: "600",
                            }}
                            className={`${styles.forget} custom-color`}
                          >
                            Sign in
                          </Link>
                        </span>
                      </span>
                    </div>
                    <p className="d-md-none" style={{ height: "2rem" }}>
                      {" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${styles.page} ${styles.second}`}
          ref={secondPageRef}
          id=""
        >
          <div className={`${styles.front}`}>
            <div className={`${styles.outer}`}>
              <div className={`${styles.logincontent}`}>
                <img style={{ pointerEvents: "none" }} src={bg} alt="" />
              </div>
            </div>
          </div>
          <div className={`${styles.back} ${styles.third}`} id="">
            <div className={`${styles.outer}`}>
              <div className={`${styles.logincontent}`}>
                <div className={`${styles["helper-class"]}`}>
                  <img style={{ pointerEvents: "none" }} src={bg} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.page} ${styles.fourth}`}>
          <div className={`${styles.front}`}>
            <div className={`${styles.outer}`}>
              <div className={`${styles.logincontent}`}>
                <div
                  className={`${styles["form-wrapper"]}`}
                  style={{
                    padding: "0 1rem",
                    background: "#fff",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      padding: "1.4rem",
                      fontSize: "1.6rem",
                      color: "#042b62",
                      cursor: "pointer",
                      top: " 0rem",
                      position: "absolute",
                    }}
                  >
                    <IoMdArrowBack
                      onClick={() => {
                        flipBackward();
                        // setMinutes(0);
                        // setSeconds(0);
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginTop: "0",
                      justifyContent: "center",
                    }}
                  >
                    <Link to={process.env.PUBLIC_URL + ""}>
                      <img
                        className={`${styles["login-image"]}`}
                        src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
                        alt="img"
                      />
                    </Link>
                  </div>
                  <h1
                    style={{ textAlign: "center" }}
                    className={`${styles.heading}`}
                  >
                    Enter OTP
                  </h1>
                  <div className={`${styles.item}`}>
                    <div className={`${styles.otpfields}`}>
                      {Array.isArray(otp) &&
                        otp.map((value, index) => (
                          <input
                            key={index}
                            ref={inputRefs[index]}
                            type="text"
                            className={` ${styles.loginotpnumber}`}
                            value={value}
                            onChange={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleBackspace(e, index)}
                            min={1}
                            max={1}
                          />
                        ))}
                    </div>
                  </div>
                  <div className="text-center">
                    {otperror != "" && <p className="error">{otperror}</p>}
                  </div>
                  <div className={`${styles.item}`} style={{ display: "flex" }}>
                    <button
                      type="button"
                      disabled={!enableVerify}
                      className={`${styles.loginpagebtn} ${styles["register-btn"]} custom-background-color`}
                      onClick={(event) => verifyOtp(event, otp)}
                    >
                      Verify OTP
                    </button>
                  </div>
                  <div className="text-center">
                    <div id="" className={`${styles.loginotptimer}`}>
                      <div
                        id="timer"
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          fontStyle: "bold",
                        }}
                        className="custom-color"
                      ></div>
                      <div
                        id="otp"
                        className={`${styles.resendotpdiv} custom-color`}
                      >
                        Didn't recieve code?{" "}
                        <span
                          disabled={seconds > 0 || minutes > 0}
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={resendOTP}
                        >
                          {" "}
                          Resend OTP
                        </span>{" "}
                      </div>
                    </div>
                    <div className={`${styles.otptxtinfo}`}>
                      We have sent an OTP to your -{" "}
                      <span className="custom-color">
                        {transformEntry(email, "email")}
                      </span>{" "}
                      &{" "}
                      <span className="custom-color">
                        +{countryCode}- {transformEntry(mobileNo, "mobile")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey="6LeTEa8pAAAAAHCO5zVqhJOTPCRZp6rzaZ5tCjiR"
      /> */}
    </>
  );
}

export default Signup;
