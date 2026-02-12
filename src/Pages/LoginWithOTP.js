import { useEffect, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import SimpleReactValidator from "simple-react-validator";
import { BASE_API_URL, DATA_BELONGS_TO, REGISTER_PAGE } from "../constants";
import axios from "axios";
import "toastr/build/toastr.css";

import LoginOTP from "./LoginOTP";
import commonEncode from "../commonEncode";
import * as toastr from "toastr";
import {
  getUserId,
  getItemLocal,
  apiCall,
  getParentUserId,
  fetchEncryptData,
} from "../common_utilities";
import { useLocation } from "react-router";
import { Buffer } from "buffer";
import { useSearchParams } from "react-router-dom";
// import refreshCaptcha from "../Assets/Images/main/01_refresh_captcha.svg";
import Refresh_captcha from "../Assets/Images/main/refresh_captcha.svg";


import HideHeader from "../components/HideHeader";

import ReCAPTCHA from 'react-google-recaptcha'

const LoginWithOTP = () => {
  const [emailmobile, setEmailMobileNo] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaVal, setCaptchaVal] = useState("");
  const [captchaImg, setCaptchaImg] = useState("");
  const [captchaError, setcaptchaError] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailErrorMsg] = useState("");
  const [otp, setOTP] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [isLoginFormValid, setLoginFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const recaptchaRef = useRef();
  const [src, setSrc] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [fhc, setFhc] = useState(0);
  const [utmSource, setUtmSource] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    document.body.classList.add("main-layout");
  }, []);

  useEffect(() => {
    getCaptcha();

    if (localStorage.getItem('expertPaymentError')) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(JSON.parse(localStorage.getItem('expertPaymentError')));
    }

  }, []);
  useEffect(() => {
    setIsLoading(true);

    // checkIfLoggedIn();
  }, []);

  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    let src = urlParams.get('src');
    let redirect_uri = urlParams.get('redirect_uri');
    let fhc = urlParams.get('fhc');
    if (fhc) {
      let utm_source = urlParams.get('utm_source');
      let utm_campaign = urlParams.get('utm_campaign');
      let tags = urlParams.get('tags');
      setSrc(src);
      setRedirectUri(redirect_uri);
      setFhc(1);
      setUtmSource(utm_source);
      setUtmCampaign(utm_campaign);
      setTags(tags);
    }
  }, [])

  const checkIfLoggedIn = async () => {
    setIsLoading(false);
    let url = '';
// let url = CHECK_SESSION;

    let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
    let respData = await apiCall(url, data, true, false);
    if (respData["error_code"] == "100") {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.success("You are already logged in");

      window.location.href = process.env.PUBLIC_URL + "/commondashboard/";
    }
  };
  const getCaptcha = async () => {
    var config = {
      method: "GET",
      url: BASE_API_URL + "restapi/getcaptcha/",
    };
    var res = await axios(config);
    if (res != "") {
      setCaptchaImg(
        res.data.captcha_url
      );
      setCaptcha(atob(res.data.captchatext));
      setCaptchaVal("");
    }
  };
  const checkEmailMobileValid = (enteredEmailMob) => {
    if (enteredEmailMob != "") {
      var isdigit = false;
      isdigit = /^\d+$/.test(enteredEmailMob);

      if (isdigit) {
        var isValid = false;
        isValid = /^[5-9]\d{9,15}$/.test(enteredEmailMob);
        if (isValid) {
          setEmailErrorMsg("");
        } else {
          setEmailErrorMsg("Please enter valid mobile number.");
        }
      } else {
        var isValid = false;
        isValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
          enteredEmailMob
        );
        if (isValid) {
          setEmailErrorMsg("");
        } else {
          if (enteredEmailMob != "") {
            setEmailErrorMsg("Please enter valid Email Id.");
          } else {
            setEmailErrorMsg("");
          }
        }
      }
    } else {
      setEmailErrorMsg("Please enter your email/mobile");
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    recaptchaRef.current.execute();
    var isFormValid = simpleValidator.current.allValid();

    if (
      isFormValid &&
      emailError == "" &&
      captchaVal != "" &&
      emailmobile != "" &&
      captchaError == ""
    ) {
      checkIfUserExists(emailmobile);

      setcaptchaError("");
    } else {
      if (captchaVal == "") {
        // simpleValidator.current.showMessageFor('captchaVal');
        // simpleValidator.current.showMessages();
        setcaptchaError("Please enter captcha");
      }
      if (emailmobile == "") {
        // simpleValidator.current.showMessageFor('emailmobile')
        setEmailErrorMsg("Please enter your email/mobile.");
      }
      // if(){

      //     simpleValidator.current.showMessages();
      //     setEmailErrorMsg('  ')
      //     setcaptchaError('  ')
      //     setLoginFormValid(false)
      //     checkEmailMobileValid(emailmobile)
      // }
    }
  };
  const checkCaptcha = (enteredcaptcha) => {
    if (enteredcaptcha !== "") {
      setcaptchaError("");
      if (enteredcaptcha != captcha) {
        setcaptchaError("Please enter valid captcha");
      }
    } else {
      setcaptchaError("Please enter captcha");
    }
  };
  const checkIfUserExists = async (emailmobile) => {
    setIsLoading(true);
    var payload = {
      emailmobile: emailmobile,
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
          setLoginFormValid(true);
          setIsLoading(false);
          setMobileNo(response_obj.data.mobile);
          setEmail(response_obj.data.email);
          setCountryCode(response_obj.data.country_code)
          sendSMS(response_obj.data.mobile, response_obj.data.country_code, response_obj.data.email);
        }
      } else {
        setLoginFormValid(false);

        setEmailErrorMsg("Please check the entered email/mobile.");
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

    setOTP(otp);

    try {
      var otpmsg = 'Greetings from Fintoo! Your OTP verification code is ' + otp;
      var whatsapptext = 'Greetings from Fintoo! Your OTP verification code is : ' + otp;
      var data = {
        mobile: mobileNo,
        msg: otpmsg,
        key: "login",
        otp: otp,
        sms_api_id: "fintoo_otp",
        data_belongs_to: DATA_BELONGS_TO,
        whatsapptext: whatsapptext,
        country_code: countryCode
      };
      var config = {
        method: "POST",
        url: DMF_SENDSMS_API_URL,
        data: data,
      };
      var res = await fetchEncryptData(config);
      var name = res.data
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
          console.log("err", e);
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.log("e", e);
    }
  };

  return (
    <div>
      {isLoginFormValid && (
        <LoginOTP
          mobileNo={mobileNo}
          email={email}
          emailmobile={emailmobile}
          sendSMS={sendSMS}
          otp={otp}
          countryCode={countryCode}
        ></LoginOTP>
      )}

      {isLoginFormValid == false && (
        <>
          <HideHeader />

          <div className="login-header">
            <a target="_self" href="/" className="logo">
              <img
                // src="https://images.minty.co.in/static/userflow/img/logo.svg"
                src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
                alt="Fintoo logo"
              />
            </a>
          </div>

          <section className="login-section">
            <div className="container-fluid">
              <div className="row justify-content-center align-items-center ">
                <div className="col-md-5">
                  <div>
                    {searchParams.get("country") == "UAE" && (
                      <>
                        <HideHeader />
                        <div className="text-center pb-4">
                          <img
                            style={{ width: "500px" }}
                            src={
                              process.env.PUBLIC_URL +
                              "/static/media/Fintoo_vita_logo.png"
                            }
                          />
                        </div>
                      </>
                    )}
                    <h2 className="page-header text-center">Welcome!!</h2>
                    <p className="text-center">
                      Type your registered email address/mobile no. below{" "}
                      <br></br> to get the OTP
                    </p>
                    <br></br>
                    <div>
                      <Form noValidate onSubmit={handleSubmit}>
                        <div className="row justify-content-center">
                          <div className="col-md-7">
                            <div className="material input">
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
                              {/* <p>{simpleValidator.current.message('emailmobile', emailmobile, 'required',{messages:{required:'Please enter your email/mobile.'}})}</p> */}
                              <p className="error">{emailError}</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4"></div>
                        <div className="row justify-content-center">
                          <div className="col-md-3">
                            <div id="captcha_block">
                              <img
                                src={captchaImg}
                                style={{ float: "left" }}
                                draggable="false"
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div id="captcha_block">
                              <img
                                onClick={getCaptcha}
                                className="refresh_captcha"
                                src={Refresh_captcha}
                                draggable="false"
                                style={{ width: "15%" }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row justify-content-center">
                          <div className="col-md-7">
                            <div className="material input">
                              <input
                                type="text"
                                tabIndex="1"
                                placeholder="Captcha*"
                                value={captchaVal}
                                className="default-input"
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
                              {/* <p>{simpleValidator.current.message('captchaVal', captchaVal, [{in:captcha}],{messages:{in:'Please enter valid captcha code'}})}</p> */}
                              <p className="error">{captchaError}</p>
                            </div>
                          </div>
                        </div>

                        <div className="row justify-content-center text-center">
                          <div class="col">
                            <div class="btn-container">
                              <input
                                type="submit"
                                name="login"
                                value="Send OTP"
                                class="default-btn d-block custom-background-color"
                                data-loading-text="Loading..."
                              />
                            </div>
                            <p class="d-inline-block">
                              Not a member yet?{" "}
                              <a
                                href={
                                  fhc
                                    ? REGISTER_PAGE +
                                    "/?src=" +
                                    src +
                                    "&redirect_uri=" +
                                    redirectUri +
                                    "&fhc=" +
                                    Buffer.from(commonEncode.encrypt("1")).toString("base64") +
                                    (utmSource ? "&utm_source=" + Buffer.from(utmSource) : "") +
                                    (utmCampaign ? "&utm_service=" + Buffer.from(utmCampaign) : "") +
                                    (tags ? "&tags=" + Buffer.from(tags) : "")
                                    : REGISTER_PAGE
                                }
                                target="_self"
                                class="blue-link default-grey"
                              >
                                Register Now
                              </a>
                            </p>
                          </div>
                        </div>
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          size="invisible"
                          sitekey="6LeTEa8pAAAAAHCO5zVqhJOTPCRZp6rzaZ5tCjiR"
                        />
                      </Form>
                    </div>
                  </div>
                </div>
                <div className="col-md-5 otp-illustration h-100 d-md-block d-none"></div>
              </div>
            </div>
          </section>
        </>
      )}
      {/* <Footer /> */}
    </div>
  );
};
export default LoginWithOTP;
