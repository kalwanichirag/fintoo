import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import HideHeader from "../components/HideHeader";
import axios from "axios";
import { setUserId, setItemLocal, getFpLogId, setFplogid } from '../common_utilities';
import FintooLoader from '../components/FintooLoader';
import SimpleReactValidator from "simple-react-validator";
import { BASE_API_URL, REGISTER_PAGE } from "../constants";
import Form from "react-bootstrap/Form";
import {
  getParentUserId, getItemLocal, apiCall
} from "../common_utilities";
import commonEncode from "../commonEncode";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import Refresh_captcha from "../Assets/Images/main/refresh_captcha.svg";



const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailmobile, setEmailMobileNo] = useState("");
  const [emailError, setEmailErrorMsg] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordErrorMsg] = useState("");
  const [captchaData, setCaptchaData] = useState([]);
  const [captchaVal, setCaptchaVal] = useState("");
  const [captchaError, setcaptchaError] = useState("");
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [isLoginFormValid, setLoginFormValid] = useState(false);
  const [rememberMe, setRememberMe] = useState("");

  useEffect(() => {
    document.body.classList.add("main-layout");
    getCaptcha();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    let url = constClass.CHECK_SESSION;

    setIsLoading(true);
    let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
    let respData = await apiCall(url, data, true, false);

    if (respData["error_code"] == "100") {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.success("You are already logged in");
      window.location.href = process.env.PUBLIC_URL + "/commondashboard/";
    }
    else {
      setIsLoading(false);
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

  const checkPasswordValid = (enteredPassword) => {
    if (enteredPassword != "") {
      setPasswordErrorMsg("");
    } else {
      setPasswordErrorMsg("Please enter your password.");
    }
  };

  const checkIfUserExists = async (emailmobile, password, rememberMe) => {
    setIsLoading(true);

    var payload = {
      react: "1",
      emailmobile: emailmobile,
      password: password
    };

    var payloadData = commonEncode.encrypt(JSON.stringify(payload));

    try {
      var config = {
        method: "POST",
        url: BASE_API_URL + "loginuser/",
        data: payloadData
      }
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
          setEmailErrorMsg("");
          setUserId(response_obj.user_id);
          setItemLocal("sky", response_obj.sky);
          try {
            let fp_log_id = await getFpLogId();
            setFplogid(fp_log_id);
          } catch {
            setFplogid("");
          }

          let redirectUri = process.env.PUBLIC_URL + "/commondashboard/";

          setItemLocal("logged_in", 1);
          setItemLocal("family", 1);
          window.location.href = redirectUri;
          return;
        } else {
          setIsLoading(false);
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(response_obj.message);
          return;
        }
      }
    } catch (e) {
      console.log('e', e)
    }
  };

  const handleRememberMe = (rememberMe) => {
    if (rememberMe) {
      setRememberMe("yes")
    }
    else {
      console.log("Check found: ", rememberMe);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    var isFormValid = simpleValidator.current.allValid();

    if (
      isFormValid &&
      emailError == "" &&
      passwordError == "" &&
      captchaVal != "" &&
      emailmobile != "" &&
      password != "" &&
      captchaError == ""
    ) {
      checkIfUserExists(emailmobile, password, rememberMe);

      setcaptchaError("");
    } else {
      if (captchaVal == "") {
        setcaptchaError("Please enter captcha.");
      }
      if (emailmobile == "") {
        setEmailErrorMsg("Enter email id/mobile number.");
      }
      if (password == "") {
        setPasswordErrorMsg("Please enter password.");
      }
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

  return (
    <div>
      <FintooLoader isLoading={isLoading} />
      <HideHeader />

      <div className="login-header">
        <a target="_self" href="/" className="logo">
          <img
            src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
            alt="Fintoo logo"
          />
        </a>
      </div>

      <section className="login-section">
        <div className="container-fluid" style={{ paddingTop: "50px" }}>
          <div className="row align-items-center ">
            <div className="col-md-5">
              <div className="login-block">
                <h2 className="page-header text-center">Welcome!!</h2>


                <div>
                  <Form noValidate onSubmit={handleSubmit}>
                    <div className="row justify-content-center">
                      <div className="col-md-6">
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
                          <p className="error">{emailError}</p>
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-md-6">
                        <div className="material input">
                          <input
                            type="password"
                            tabindex="1"
                            placeholder="Password*"
                            name="password"
                            id="password"
                            autoComplete="off"
                            value={password}
                            className="default-input"
                            onChange={(e) => {
                              setPassword(e.target.value);
                              checkPasswordValid(e.target.value);
                            }}
                            onBlur={() => {
                              simpleValidator.current.showMessageFor(
                                "password"
                              );
                              forceUpdate(1);
                            }}
                          />
                          <p className="error">{passwordError}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4"></div>
                    <div className="row justify-content-center">
                      <div className="col-md-3">
                        <div id="captcha_block">
                          <img
                            src={captchaData.captchaImg}
                            style={{ float: "left" }}
                            draggable="false"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
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
                      <div className="col-md-6">
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
                          <p className="error">{captchaError}</p>
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-center text-left">
                      <div className="col-md-6">
                        <div
                          className="checkbox-container position-relative"
                          style={{ margin: "10px 0px" }}
                        >
                          <input
                            type="checkbox"
                            name="rememberMe"
                            className="custom-checkbox"
                            id="rememberMe"
                            onChange={(e) => {
                              handleRememberMe(e.target.checked);
                            }}
                          />
                          <label for="remember-me" className="checkbox-label">
                            Remember Me
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-center text-center">
                      <div class="col">
                        <div class="btn-container">
                          <input
                            type="submit"
                            name="login"
                            value="Login"
                            class="default-btn d-block"
                            data-loading-text="Loading..."
                          />
                          <Link to={`${process.env.PUBLIC_URL}/login`}
                            target="_self"
                            class="blue-link"
                          >
                            Login with OTP
                          </Link>
                        </div>
                      </div>
                    </div>
                    <p className="text-center">
                      Not a member yet?{" "}
                      <a href={REGISTER_PAGE} target="_self" class="blue-link default-grey">
                        Register Now
                      </a>
                    </p>
                  </Form>
                </div>
              </div>
            </div>

            <div className="col-md-6 login-illustration h-100">
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Login;
