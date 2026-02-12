import React, { useState, useRef } from "react";
import { useEffect } from "react";
import styles from "./login.module.css";
import bg from "./Login.png";
import arrow from "./Arrow.svg";
import HideHeader from "../../components/HideHeader";
import HideFooter from "../../components/HideFooter";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";
import commonEncode from "../../commonEncode";
import SimpleReactValidator from "simple-react-validator";
import "toastr/build/toastr.css";
import * as toastr from "toastr";
import {
  fetchEncryptData,
  setUserId,
  setItemLocal,
  getFpLogId,
  setFplogid,
  apiCall,
  getItemLocal,
  getParentUserId,
} from "../../common_utilities";
import ReCAPTCHA from "react-google-recaptcha";
import refreshCaptcha from "../../Assets/Images/main/01_refresh_captcha.svg";
import ReCaptchaComponent from "../../components/Recaptcha/ReCaptchaComponent";
import { DATA_BELONGS_TO } from "../../constants";
function Loginpage() {
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [emailmobile, setEmailMobileNo] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailErrorMsg] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [isLoading, setIsLoading] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 700);
  const firstPageRef = useRef(null);
  const secondPageRef = useRef(null);
  const [captchaData, setCaptchaData] = useState([]);
  const inputRefs = Array(5).fill().map(() => useRef(null));
  const [otp, setOTP] = useState(["", "", "", "", ""]);
  const [enableVerify, setEnableVerify] = useState(false);
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(300);
  const [timerId, setTimerId] = useState(null);
  const [otpError, setOTPError] = useState("");
  const [otpActive, setOTPActive] = useState(1);
  const [otpReceived, setOtpReceived] = useState("");
  const [resendOTPCounter, setResendOTPCounter] = useState(1);
  const [timerOn, setTimerOn] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [captchaVal, setCaptchaVal] = useState("");
  const recaptchaRef = useRef();
  const [captchaError, setcaptchaError] = useState("");
  const [isSecondPageActive, setIsSecondPageActive] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState(null);
  // This is to validate the enter email/mobile of the user
  // const checkEmailMobileValid = (enteredEmailMob) => {
  //   if (enteredEmailMob != "") {
  //     var isdigit = false;
  //     isdigit = /^\d+$/.test(enteredEmailMob);

  //     if (isdigit) {
  //       var isValid = false;
  //       isValid = /^[5-9]\d{9,15}$/.test(enteredEmailMob);
  //       if (isValid) {
  //         setEmailErrorMsg("");
  //       } else {
  //         setEmailErrorMsg("Please enter valid mobile number.");
  //       }
  //     } else {
  //       var isValid = false;
  //       isValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
  //         enteredEmailMob
  //       );
  //       if (isValid) {
  //         setEmailErrorMsg("");
  //       } else {
  //         if (enteredEmailMob != "") {
  //           setEmailErrorMsg("Please enter valid email.");
  //         } else {
  //           setEmailErrorMsg("");
  //         }
  //       }
  //     }
  //   } else {
  //     setEmailErrorMsg("Please enter your email/mobile number.");
  //   }
  // };

  const checkEmailMobileValid = (enteredEmailMob) => {
    if (enteredEmailMob === "") {
      setEmailErrorMsg("Please enter your email/mobile number.");
      return;
    }

    const isMobileNumber = /^\d+$/.test(enteredEmailMob);

    if (isMobileNumber) {
      const isValidMobile = /^\d{9,15}$/.test(enteredEmailMob);
      if (isValidMobile) {
        setEmailErrorMsg("");
      } else {
        setEmailErrorMsg("Please enter a valid mobile number.");
      }
    } else {
      // Validate email
      const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(enteredEmailMob);
      if (isValidEmail) {
        setEmailErrorMsg("");
      } else {
        setEmailErrorMsg("Please enter a valid email.");
      }
    }
  };


  // Once the user enters the email/mobile and clicks on continue
  const flipForward = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    // const token = await recaptchaRef.current.executeAsync();
    let url = '';
    let data = { token: recaptchaToken };
    let captchaVerify = await apiCall(url, data, false, false);
    if (captchaVerify["error_code"] == "100") {
      // if (true) {
      if (captchaVerify["data"]["success"]) {
        // if (true) {

        recaptchaRef.current.reset();
        setRecaptchaToken(null)
        var isFormValid = simpleValidator.current.allValid();
        if (
          isFormValid &&
          emailError == "" &&
          emailmobile != ""
          // captchaError == "" &&
          // captchaVal != ""
        ) {
          setIsActive(true);
          checkIfUserExists(emailmobile);
          // setTimerOn(true);
          // setcaptchaError("");
        } else {
          // if (captchaVal == "") {
          //   setcaptchaError("Please enter captcha");
          // }
          if (emailmobile == "") {
            setEmailErrorMsg("Please enter your email/mobile number.");
          }
        }
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfLoggedIn();
    // getCaptcha();
  }, []);

  // To check if the user is logged-in or not
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

  const transformEntry = (item, type) => {
    if (item != "") {
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
    }
  };

  const checkIfUserExists = async (emailmobile) => {
    setIsLoading(true);
    var payload = {
      emailmobile: emailmobile,
      data_belongs_to: DATA_BELONGS_TO
    };
    var config = {
      method: "POST",
      url: BASE_API_URL + "loginuser/",
      data: commonEncode.encrypt(JSON.stringify(payload)),
    };
    var res = await axios(config);
    if (res) {
      var response_obj = JSON.parse(commonEncode.decrypt(res.data));
      let error_code = response_obj.error_code;

      var autofetchfinvudataconfig = {
        method: "POST",
        url: BASE_API_URL + "restapi/autofetchfinvudata/",
        data: {
          "user_id": response_obj?.data?.id
        }
      }

      axios(autofetchfinvudataconfig);

      if (error_code == "100") {
        setEmailErrorMsg("");
        if (response_obj.message == "User Exists") {
          setIsLoading(false);
          setMobileNo(response_obj.data.mobile);
          setEmail(response_obj.data.email);
          setCountryCode(response_obj.data.country_code);
          if (!isActive) {
            sendSMS(
              response_obj.data.mobile,
              response_obj.data.country_code,
              response_obj.data.email
            );
          }
        }
        if (isSmallScreen) {
          firstPageRef.current.style.left = "100%";
          firstPageRef.current.style.display = "none";
        } else {
          setTimerOn(true);
          await new Promise((resolve) => setTimeout(resolve, 700));
          secondPageRef.current.style.transform = "rotateY(-180deg)";
        }
        setIsSecondPageActive(true);
        setNavigationDirection('forward');
      } else {
        setEmailErrorMsg("You are not registered with us. Please sign up.");
      }
    }
  };

  const sendSMS = async (mobileNo, countryCode, email) => {
    var otp = Math.floor(Math.random() * 90000) + 10000;
    if (email) {
      if (email.startsWith("test") || email.startsWith("Test")) {
        otp = 91049;
      }
    }
    setOtpReceived(otp);
    try {
      var otpmsg =
        "Greetings from Fintoo! Your OTP verification code is " + otp;
      var whatsapptext =
        "Greetings from Fintoo! Your OTP verification code is : " + otp;
      var data = {
        mobile: mobileNo,
        msg: otpmsg,
        key: "login",
        otp: otp,
        sms_api_id: "fintoo_otp",
        data_belongs_to: DATA_BELONGS_TO,
        whatsapptext: whatsapptext,
        country_code: countryCode,
      };
      var config = {
        method: "POST",
        url: DMF_SENDSMS_API_URL,
        data: data,
      };
      var res = await fetchEncryptData(config);
      var name = res.data;
      if (res) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("OTP sent to registered email/mobile");
        try {
          var mail_payload = {
            userdata: {
              to: email,
            },
            subject: "Fintoo - Your one time password",
            template: "otp_message_template.html",
            contextvar: { otp: otp, name: name },
          };
          var mail_config = {
            method: "POST",
            url: '',
            data: mail_payload,
          };
          var mail_res = await fetchEncryptData(mail_config);
        } catch (e) {
          console.log("Error Occured ====>>>>", e);
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.log("Error Occured ====>>>> ", e);
    }
  };

  const flipBackward = () => {
    if (isSmallScreen) {
      firstPageRef.current.style.left = "0%";
      firstPageRef.current.style.display = "block";
    } else {
      setOTPError("");
      setOTP(["", "", "", "", ""]);
      setOTPActive(0);
      setcaptchaError("");
      setCaptchaVal("");
      setEmailMobileNo("");
      setTimerOn(false);
      timer(0);
      setIsActive(false);
      setSeconds(0);
      secondPageRef.current.style.transform = "rotateY(0)";
    }
    setNavigationDirection('backward');
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 700);
      if (firstPageRef.current) {
        if (window.innerWidth < 700) {
          firstPageRef.current.style.left = "0";
        } else {
          firstPageRef.current.style.left = "50%";
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  useEffect(() => {
    document.body.classList.remove("bgImagClass");
    document.body.classList.add("login-demo");
    return function cleanup() {
      document.body.classList.add("bgImagClass");
      document.body.classList.remove("login-demo");
    };
  }, []);

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

  // This timer is of 3 minutes to enable the resend OTP button
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

  const deleteCookie = (name) => {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  // This is the logic for resend OTP logic
  const resendOTP = () => {
    setNavigationDirection('forward');
    setIsSecondPageActive(true);
    setOTPError("");
    setOTP(["", "", "", "", ""]);
    if (resendOTPCounter == 1) {
      if (getCookieData("resendotpcookie")) {
        var expiry_time = getCookieData("resendotpcookie");
        var current_time = new Date().getTime();
        if (current_time > expiry_time) {
          var date = new Date();
          if (!getCookieData("resendotpcookie")) {
            createCookie(
              "resendotpcookie",
              date.setTime(date.getTime() + 30 * 60 * 1000),
              30
            );
          }
          setResendOTPCounter((oldCount) => oldCount + 1);
          sendSMS(mobileNo, countryCode, email);
          setOTPActive(1);
          timer(180);
          setSeconds(300);
          setIsActive(true);
        } else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(
            "You've reached Maximum Attempts to generate OTP. Please try again after 30 min."
          );
        }
      } else {
        var date = new Date();
        if (!getCookieData("resendotpcookie")) {
          createCookie(
            "resendotpcookie",
            date.setTime(date.getTime() + 30 * 60 * 1000),
            30
          );
        }
        setResendOTPCounter((oldCount) => oldCount + 1);
        sendSMS(mobileNo, countryCode, email);
        setOTPActive(1);
        timer(180);
        setSeconds(300);
        setIsActive(true);
      }
    } else if (resendOTPCounter <= 3) {
      var expiry_time = getCookieData("resendotpcookie");
      var current_time = new Date().getTime();
      if (expiry_time < current_time) {
        toastr.error(
          " You've reached Maximum Attempts to generate OTP. Please try again after 30 min."
        );
        $scope.resend_otp_counter = 1;
      } else {
        var date = new Date();
        if (!getCookieData("resendotpcookie")) {
          createCookie(
            "resendotpcookie",
            date.setTime(date.getTime() + 30 * 60 * 1000),
            30
          );
        }
        setResendOTPCounter((oldCount) => oldCount + 1);
        sendSMS(mobileNo, countryCode, email);
        setOTPActive(1);
        timer(180);
        setSeconds(300);
        setIsActive(true);
      }
    } else {
      var expiry_time = getCookieData("resendotpcookie");
      var current_time = new Date().getTime();
      if (current_time > expiry_time) {
        setResendOTPCounter(1);
      }
      toastr.error(
        " You've reached Maximum Attempts to generate OTP. Please try again after 30 min."
      );
    }
  };

  useEffect(() => {
    if (otp.join("") == "") {
      setOTPError("");
    }
  }, [otp]);

  const verifyOTP = (event) => {
    event.preventDefault();
    event.stopPropagation();
    var isFormValid = simpleValidator.current.allValid();
    var entered_otp = otp.join("");
    var actual_otp = otpReceived;
    if (entered_otp == "") {
      setOTPError("Please enter OTP");
    } else if (entered_otp == actual_otp && otpActive == 0) {
      setOTPError("This OTP has expired");
    } else if (entered_otp != actual_otp) {
      setOTPError("The entered OTP is incorrect. Please try again");
    } else if (entered_otp == actual_otp && otpActive == 1) {
      setOTPError("");
      if (isFormValid) {
        loginuser(mobileNo, email);
      }
    }
  };

  const loginuser = async (mobileNo, email) => {

    setIsLoading(true);
    let payload = {};
    for (let i = 0; i < ("" + otpReceived).length; i++) {
      payload[`otp-${i + 1}`] = ("" + otpReceived)[i];
    }
    payload["emailmobile"] = email;
    payload["data_belongs_to"] = DATA_BELONGS_TO;
    var data = commonEncode.encrypt(JSON.stringify(payload));
    try {
      var config = {
        method: "post",
        url: BASE_API_URL + "loginuser/",
        data: data,
      };
      var res = await axios(config);
      if (res) {
        var response_obj = JSON.parse(commonEncode.decrypt(res.data));
        let error_code = response_obj.error_code;

        var autofetchfinvudataconfig = {
          method: "POST",
          url: BASE_API_URL + "restapi/autofetchfinvudata/",
          data: {
            "user_id": response_obj?.user_id
          }
        }

        axios(autofetchfinvudataconfig);

        if (error_code == "100") {
          setUserId(response_obj.user_id);
          setItemLocal("sky", response_obj.sky);
          try {
            let fp_log_id = await getFpLogId();
            setFplogid(fp_log_id);
          } catch {
            setFplogid("");
          }
          if (response_obj.status == "0") {
            document.cookie = "dg_not_completed=1";
            createCookie("dg_not_completed", "1", 10);
          } else if (response_obj.status == "1") {
            document.cookie = "dg_not_completed=2";
            createCookie("dg_not_completed", "2", 10);
          } else if (response_obj.status == "6") {
            document.cookie = "renewal_popup";
            createCookie("renewal_popup", "1", 600);
            createCookie(
              "subscription_end_date",
              response_obj.subscription_end_date,
              600
            );
          } else if (response_obj.status == "7") {
            document.cookie = "renewal_popup";
            createCookie("renewal_popup", "2", 600);
            createCookie(
              "subscription_end_date",
              response_obj.subscription_end_date,
              600
            );
          }
          let urlParams = new URLSearchParams(window.location.search);
          let src = urlParams.get("src");
          let redirectUri = urlParams.get("redirect_uri");
          let urlkey = urlParams.get("urlkey");
          let fhc = urlParams.get("fhc");
          let fhc_status = 0;
          // if (fhc) {
          //   setItemLocal("fhc", 1);
          //   let url = CHECK_SESSION;
          //   let data = {
          //     user_id: response_obj.user_id.toString(),
          //     sky: response_obj.sky,
          //   };
          //   let session_data = await apiCall(url, data, true, false);
          //   if (session_data["error_code"] == "100") {
          //     let fpLifecycleStatus =
          //       session_data["data"]["fp_lifecycle_status"];
          //     fpLifecycleStatus = fpLifecycleStatus ? fpLifecycleStatus : 0;
          //     if (fpLifecycleStatus == 0 || fpLifecycleStatus == "") {
          //       let url = ADVISORY_GET_PRICINGDETAILS_API_URL;
          //       let pricing_data = await apiCall(url, "", false, false);
          //       if (pricing_data["error_code"] == "100") {
          //         pricing_data =
          //           pricing_data["data"]["plan_details"]["plandetails"];
          //         let pricingData = pricing_data.filter(
          //           (data) => data.plan_id == 29
          //         );
          //         pricingData = pricingData[0];
          //         var amount = 0;
          //         if (
          //           pricingData.amount.isquaterly == 0 &&
          //           pricingData.amount.total != "custom"
          //         ) {
          //           amount = parseInt(pricingData.amount.total);
          //         } else {
          //           amount = pricingData.amount.Q1;
          //         }
          //         let cartdatatosend = {
          //           user_id: response_obj.user_id,
          //           plan_id: pricingData.plan_id,
          //           plan_sub_cat_id: pricingData.id,
          //           amount: amount,
          //           subscription_freq: pricingData.payment_frequency,
          //         };
          //         let url = ADVISORY_ADDTOCART_API_URL;
          //         let cart_data = await apiCall(
          //           url,
          //           cartdatatosend,
          //           true,
          //           false
          //         );
          //         if (cart_data.error_code == "100") {
          //           fhc_status = 1;
          //           window.location.href =
          //             process.env.PUBLIC_URL + "/userflow/payment/";
          //         }
          //       }
          //     }
          //   }
          // }
          if (src) {
            setItemLocal("logged_in", 1);
            setItemLocal("family", 1);
            let redUri = commonEncode.decrypt(atob(redirectUri));
            if (localStorage.getItem("redirectToThis")) {
              redUri = localStorage.getItem("redirectToThis");
            } else if (!redUri || (fhc && fhc_status == 0)) {
              redUri = window.location.origin + "/commondashboard";
              localStorage.setItem("redirectToThis", encodeURIComponent(redUri));
            } else {
              redUri = window.location.origin + "/commondashboard";
              localStorage.setItem("redirectToThis", encodeURIComponent(redUri));
            }


            let sky = response_obj.sky;
            let auth1 = commonEncode.encrypt(
              "" + JSON.stringify(response_obj.user_id) + "|" + sky
            );
            let auth = btoa(auth1);
            window.location.href =
              window.location.origin + "/checkredirect?auth=" + auth;
            return;
          }
          if (urlkey == "stocks") {
            window.location.href =
              process.env.PUBLIC_URL +
              "/stocks/?auth=" +
              response_obj.user_id +
              "&mobile=" +
              response_obj.mobile;
            return;
          }
          if (urlkey == "details") {
            window.location.href =
              process.env.PUBLIC_URL +
              "/stocks/details/?stock_code=" +
              stock_code +
              "&auth=" +
              response_obj.user_id +
              "&mobile=" +
              response_obj.mobile;
            return;
          }
          if (response_obj.data == "expertflow_logged_in") {
            deleteCookie("rm_id");
            deleteCookie("plan_id");
            deleteCookie("is_expert");
            window.location.href = "/datagathering/about-you/";
            setIsLoading(false);
          } else if (response_obj.data == "expertflow_logged_in_profile") {
            deleteCookie("rm_id");
            deleteCookie("plan_id");
            deleteCookie("is_expert");
            window.location.href = "/userflow/profile-fill-details/";
            setIsLoading(false);
          } else if (response_obj.data == "expertflow_logged_in_nda") {
            deleteCookie("rm_id");
            deleteCookie("plan_id");
            deleteCookie("is_expert");
            window.location.href = "/userflow/expert-nda/";
            setIsLoading(false);
          } else if (response_obj.data == "renewal_pop_up") {
            window.location.href = process.env.PUBLIC_URL + "/commondashboard";
            setIsLoading(false);
          } else {
            window.location.href = process.env.PUBLIC_URL + "/commondashboard";
            setIsLoading(false);
          }
        } else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(response_obj.data);
          setIsLoading(false);
        }
      }
    } catch (e) {
      console.log("Error Ocurred ====>>> ", e);
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
  const getCaptcha = async () => {
    var config = {
      method: "GET",
      url: BASE_API_URL + "restapi/getcaptcha/",
    };
    var res = await axios(config);
    if (res != "") {
      captchaData.captchaImg = res.data.captcha_url;
      captchaData.captcha = atob(res.data.captchatext);
      setCaptchaData({ ...captchaData });
      setCaptchaVal("");
    }
  };
  const checkCaptcha = (enteredcaptcha) => {
    if (enteredcaptcha !== "") {
      setcaptchaError("");
      if (enteredcaptcha != captchaData.captcha) {
        setcaptchaError("Please enter valid captcha");
      }
    } else {
      setcaptchaError("Please enter captcha");
    }
  };

  const handleRecaptchaChange = (token) => {
    if (token) {
      setRecaptchaToken(token)
    } else {
      setRecaptchaToken(null)
    }
  };

  const InputId = document.getElementById("emailmobile");

  useEffect(() => {
    if (navigationDirection === 'forward' && isSecondPageActive) {
      setTimeout(() => {
        if (inputRefs[0].current) {
          inputRefs[0].current.focus();
        }
      }, 100);
    }
    else{
      InputId?.focus();
    }
  }, [isSecondPageActive, navigationDirection]);

  useEffect(()=>{
      InputId?.focus();
  }, [])

  React.useEffect(() => {
    document.querySelectorAll('input').forEach(input => {
      input.setAttribute('autocomplete', 'off');
    });
  }, []);

  return (
    <>
      <HideHeader />
      <HideFooter />
      <div className={`${styles.containerDemo}`}>
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
                    Welcome Back!
                  </h1>
                  <div
                    className={`${styles.loginform}`}
                    action="#"
                    id="register"
                  >
                    <div className="item">
                      <div
                        className={`${styles.input}`}
                        style={{ margin: "0" }}
                      >
                        <input type="text" style={{ display: "none" }} autocomplete="new-password" />
                        <input
                          type="text"
                          tabIndex="1"
                          placeholder="Email/Mobile Number*"
                          name="emailmobile"
                          id="emailmobile"
                          autoComplete="off"
                          value={emailmobile}
                          className="default-input"
                          onChange={(e) => {
                            setEmailMobileNo(e.target.value);
                            checkEmailMobileValid(e.target.value);
                          }}
                          onBlur={() => {
                            simpleValidator.current.showMessageFor(
                              "emailmobile"
                            );
                            forceUpdate(1);
                          }}
                        />
                      </div>
                      <div className="error">{emailError}</div>
                    </div>
                    <ReCaptchaComponent ref={recaptchaRef} onChange={handleRecaptchaChange} />
                    {/* <div className="d-md-flex">
                      <div className="">
                        <div className="">
                          <div className={` ${styles.input}`} style={{margin : "0"}}>
                            <input
                              type="text"
                              tabIndex="1"
                              placeholder="Captcha*"
                              value={captchaVal}
                              className={`default-input ${styles.captchainput}`}
                              onChange={(e) => {
                                setCaptchaVal(e.target.value);
                                checkCaptcha(e.target.value);
                              }}
                              onBlur={() => {
                                simpleValidator.current.showMessageFor(
                                  "captchaVal"
                                );
                                forceUpdate(1);
                              }}
                            />
                          </div>
                          <div className="error">{captchaError}</div>
                        </div>
                      </div>
                      <div style={{
                        display: "flex",
                        justifyContent: "start",
                        // alignItems: "center"
                      }} className="ms-md-2 mt-md-0 mt-3">
                        <div className="">
                          <div id="captcha_block">
                            <img

                              src={captchaData.captchaImg}
                              style={{ float: "left", borderRadius: "5px" }}
                            />
                          </div>
                        </div>
                        <div className="ms-2 mt-2">
                          <div id="captcha_block">
                            <img
                              onClick={getCaptcha}
                              className="refresh_captcha"
                              src={refreshCaptcha}
                              draggable="false"
                              style={{ width: "40px" }}
                            />
                          </div>
                        </div>
                      </div>

                    </div> */}
                    <div
                      className="item"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <button
                        className={`${styles.loginpagebtn} ${styles["login-btn"]} custom-background-color`}
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
                    <div className={`${styles.hrline}`}></div>
                    <div style={{ paddingTop: ".3rem", textAlign: "center" }}>
                      <span style={{ color: "#9e9e9e" }}>
                        Don't have an account yet?{" "}
                        <span className={`${styles.forgetPassword}`}>
                          <Link
                            to={process.env.PUBLIC_URL + "/register"}
                            style={{
                              textDecoration: "underline",
                              fontWeight: "600",
                            }}
                            className={`${styles.forget} custom-color`}
                          >
                            Sign up
                          </Link>
                        </span>
                      </span>
                    </div>
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
                <img style={{ pointerEvents: "none" }} src={bg} alt="Login" />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "fixed",
                  bottom: "4rem",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <div className="me-3">
                  <Link
                    className="custom-color"
                    style={{ fontSize: "1.2rem", fontWeight: "400" }}
                    to={process.env.PUBLIC_URL + "/terms-conditions"}
                    target="_blank"
                  >
                    Terms & Conditions
                  </Link>
                </div>
                <div
                  className="me-3 custom-background-color"
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                ></div>
                <div className="">
                  {" "}
                  <Link
                    className="custom-color"
                    style={{ fontSize: "1.2rem", fontWeight: "400" }}
                    to={process.env.PUBLIC_URL + "/privacy-policy"}
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </div>
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
                  style={{ padding: "0 1rem", background: "#fff" }}
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
                        // src="https://stg.minty.co.in/image/?logo=1&file=logo.svg"
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
                  <div className="col-md-12 text-center">
                    <p className="error">{otpError}</p>
                  </div>
                  <div className={`${styles.item}`} style={{ display: "flex" }}>
                    <button
                      type="submit"
                      disabled={!enableVerify}
                      className={`${styles.loginpagebtn} ${styles["register-btn"]} custom-background-color`}
                      onClick={verifyOTP}
                    >
                      Verify OTP
                    </button>
                  </div>
                  <div className="text-center">
                    <div id="" className={`${styles.loginotptimer}`}>
                      <div
                        id="timer"
                        className="custom-color"
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          fontStyle: "bold",
                        }}
                      ></div>
                      <div id="otp" className={`${styles.resendotpdiv}`}>
                        Didn't recieve code?{" "}
                        <span
                          disabled={seconds > 0 || minutes > 0}
                          style={{
                            cursor: "pointer",
                          }}
                          className="custom-color"
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

export default Loginpage;
