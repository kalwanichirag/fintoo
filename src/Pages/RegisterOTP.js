import { useEffect, useState, useRef } from "react";
import SimpleReactValidator from "simple-react-validator";
import { imagePath } from "../constants";
import Form from "react-bootstrap/Form";
import axios from "axios";
import commonEncode from '../commonEncode';

import * as toastr from 'toastr'
import 'toastr/build/toastr.css';
import FintooLoader from '../components/FintooLoader';
import {
    setUserId,
    setItemLocal,
    deleteCookie,
    fetchEncryptData,
    apiCall,
} from "../common_utilities";
import HideHeader from '../components/HideHeader';
import { useNavigate } from "react-router-dom";


const RegisterOTP = (props) => {
    const [otp1, setOTP1] = useState('')
    const [otp2, setOTP2] = useState('')
    const [otp3, setOTP3] = useState('')
    const [otp4, setOTP4] = useState('')
    const [otp5, setOTP5] = useState('')
    const [otp, setOTP] = useState('')
    const [otperror, setOTPError] = useState('')
    const simpleValidator = useRef(new SimpleReactValidator());
    const [, forceUpdate] = useState();
    const [timerOn, setTimer] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [otpActive, setOtpActive] = useState('1');
    const [resendOTPRegCounter, setResendOTPRegCounter] = useState(1);

    const navigate = useNavigate();


    useEffect(() => {
        document.body.classList.add('main-layout');
    }, []);
    useEffect(() => {
        timer(180);
    }, [])
    const goBack = () => {
        window.location.href = process.env.PUBLIC_URL + "/login"

    }
    const getCookie = (cname) => {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    const timer = (remaining) => {
        var m = Math.floor(remaining / 60);
        var s = remaining % 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        document.getElementById('timer').innerHTML = m + ':' + s;
        remaining -= 1;
        if (remaining >= 0 && timerOn) {
            setTimeout(function () {
                timer(remaining);
            }, 1000);
            document.getElementById("otp").style.display = "none";
            document.getElementById("timer").style.display = "block";

            return;
        }
        else {
            setOtpActive('0')
            document.getElementById("otp").style.display = "block";
            document.getElementById("timer").style.display = "none";
        }
        if (!timerOn) {
            return;
        }
    }
    const transformEntry = (item, type) => {
        switch (type) {
            case 'email':
                var parts = item.split("@"), len = parts[0].length;
                return item.replace(parts[0].slice(1, -1), "*".repeat(len - 2));
            case 'mobile':
                return item[0] + "*".repeat(item.length - 4) + item.slice(-3);
            default:
                throw new Error("Undefined type: " + type);
        }
    }
    const createCookie = (name, value, minutes) => {
        if (minutes) {
            var date = new Date();
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else {
            var expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }
    const getCookieData = (name) => {

        var pairs = document.cookie.split("; "),
            count = pairs.length, parts;
        while (count--) {
            parts = pairs[count].split("=");
            if (parts[0] === name)
                return parts[1];
        }
        return false;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();


        var isFormValid = simpleValidator.current.allValid();

        let sentOTP = props.sentOTP
        var otp = otp1 + otp2 + otp3 + otp4 + otp5
        if (otp == '') {
            setOTPError('Please enter OTP')

        }
        else if (sentOTP != otp) {
            setOTPError('Invalid OTP, please try again.')
        }
        else if (otp == sentOTP && otpActive == '0') {
            setOTPError('This OTP has expired.')
        }
        if (otp == sentOTP && otpActive == '1' && isFormValid) {
            callbackFunction(props.mobileNo, props.email, props.firstName, props.countryCode)
        }



    }
    const getUTMSource = () => {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var utm_source = url.searchParams.get("utm_source");
        if (utm_source) {
            utm_source = utm_source
        } else {
            utm_source = 27
        }
        return utm_source
    }
    const getRMID = () => {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var rm_id = url.searchParams.get("rm_id");
        if (rm_id) {
            rm_id = rm_id
        } else {
            if (getCookie('rm_id') == '') {
                rm_id = "96"
            }
            else {
                rm_id = getCookie('rm_id')
            }
        }
        return rm_id
    }
    const getService = () => {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var utm_service = url.searchParams.get("utm_service");
        if (utm_service) {
            utm_service = utm_service
        } else {
            utm_service = "98"
        }
        return utm_service
    }

    const getTags = () => {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var tags = url.searchParams.get("tags");
        if (tags) {
            tags = tags
        } else {
            tags = "fin_web_reg"
        }
        return tags
    }

    const resendOTP = () => {
        setOTP1('')
        setOTP2('')
        setOTP3('')
        setOTP4('')
        setOTP5('')
        setOTPError('')
        setOTP('')
        setOtpActive(1)
        if (resendOTPRegCounter == 1) {
            if (getCookieData('resendregotpcookie')) {
                var expiry_time = getCookieData('resendregotpcookie')
                var current_time = new Date().getTime()
                if (current_time > expiry_time) {
                    var date = new Date()
                    if (!getCookieData('resendregotpcookie')) {
                        createCookie('resendregotpcookie', date.setTime(date.getTime() + (30 * 60 * 1000)), 30)
                    }
                    timer(180)

                    setResendOTPRegCounter((oldCount) => oldCount + 1)
                    props.sendSMS(props.mobileNo, props.email, props.firstName, props.countryCode);

                }
                else {
                    toastr.options.positionClass = 'toast-bottom-left';
                    toastr.error("You've reached Maximum Attempts to generate OTP. Please try again after 30 min.")
                    setResendOTPRegCounter(1)
                }
            }
            else {
                var date = new Date()
                if (!getCookieData('resendregotpcookie')) {
                    createCookie('resendregotpcookie', date.setTime(date.getTime() + (30 * 60 * 1000)), 30)
                }
                timer(180)
                setResendOTPRegCounter((oldCount) => oldCount + 1)
                props.sendSMS(props.mobileNo, props.email, props.firstName, props.countryCode);


            }
        }
        else if (resendOTPRegCounter <= 3) {
            var expiry_time = getCookieData('resendregotpcookie')
            var current_time = new Date().getTime()
            if (expiry_time < current_time) {
                toastr.error(" You've reached Maximum Attempts to generate OTP. Please try again after 30 min.")
                $scope.resend_otp_counter = 1
            }
            else {
                var date = new Date()
                if (!getCookieData('resendregotpcookie')) {
                    createCookie('resendregotpcookie', date.setTime(date.getTime() + (30 * 60 * 1000)), 30)
                }
                timer(180)
                setResendOTPRegCounter((oldCount) => oldCount + 1)
                props.sendSMS(props.mobileNo, props.email, props.firstName, props.countryCode);

            }
        }
        else {

            var expiry_time = getCookieData('resendregotpcookie')
            var current_time = new Date().getTime()
            if (current_time > expiry_time) {
                setResendOTPRegCounter(1)
            }
            toastr.error(" You've reached Maximum Attempts to generate OTP. Please try again after 30 min.")
        }
    }
    const callbackFunction = async (mobileNo, email, firstName, countryCode) => {

        setIsLoading(true)
        var is_expert = getCookie('is_expert');
        if (is_expert == "") {
            var payload = {
                fullname: firstName,
                mobile: mobileNo,
                mailid: email,
                country_code: countryCode,
                tags: getTags(),
                utm_source: getUTMSource(),
                service: getService(),
                skip_mail: "1",
                rm_id: getRMID(),
                skip_sms: "1"

            };
            var data = JSON.stringify(payload);

            try {
                var config = {
                    method: "post",
                    url: BASE_API_URL + 'restapi/callback/',
                    data: data,
                };

                var res = await axios(config);


                var response_obj = res.data

                let error_code = response_obj.error_code;
                if (error_code == "0") {


                    registerUserFunction(mobileNo, email, firstName)


                } else {

                    toastr.options.positionClass = 'toast-bottom-left';
                    toastr.error(response_obj.data)
                    setIsLoading(false)
                    //   dispatch({
                    //     type: "RENDER_TOAST",
                    //     payload: { message: response.data, type: "error" },
                    //     autoClose: 3000,
                    //   });
                }
            } catch (e) {
                console.log('e', e)
            }
        }
        else {
            registerUserFunction(mobileNo, email, firstName)
        }


    };
    const registerUserFunction = async (mobileNo, email, firstName, countryCode) => {

        //
        var rm_id = "96"
        if (getCookie('rm_id') != null && getCookie('rm_id') != "" && getCookie('rm_id') != "0") {
            rm_id = getCookie('rm_id')
        }
        var plan_id = ""
        if (getCookie('plan_id') != null && getCookie('plan_id') == '31') {
            plan_id = getCookie('plan_id')
        }

        var payload = {
            fullname: firstName,
            mobile: mobileNo,
            email: email,
            country_code: countryCode,
            tags: getTags(),
            utm_source: getUTMSource(),
            service: getService(),
            skip_mail: "1",
            rm_id: rm_id,
            react: "1",
            plan_id: plan_id,
            is_expert: "1"



        };
        var data = payload

        try {
            var config = {
                method: "post",
                url: BASE_API_URL + 'restapi/UserRegisterApi/',
                data: data,
            };

            var res = await axios(config);
            var response = res.data;
            var response_obj = response

            let error_code = response_obj.error_code;
            if (error_code == "0") {
                var redirect_url = "/commondashboard"
                if (getCookie('is_expert') == '1') {
                    // var expert_response = await expertflowcommonapi(getCookie('rm_id'),getCookie('plan_id'),0,0)
                    if (response_obj["data"]["expertflow_error_code"] == '100') {
                        redirect_url = "/userflow/expert-nda"
                        deleteCookie('rm_id')
                        deleteCookie('plan_id')
                        deleteCookie('is_expert')
                    }
                    else {
                        redirect_url = "/commondashboard"
                    }
                }
                let urlParams = new URLSearchParams(window.location.search);
                let fhc = urlParams.get("fhc");
                if (fhc) {
                    setItemLocal("fhc", 1);
                    let url = CHECK_SESSION;
                    let data = { user_id: response_obj.data.id.toString(), sky: response_obj.data.sky };
                    let session_data = await apiCall(url, data, true, false);
                    if (session_data["error_code"] == "100") {
                        setUserId(response_obj.data.id)
                        setItemLocal("sky", response_obj.data.sky);
                        let fpLifecycleStatus = session_data["data"]["fp_lifecycle_status"];
                        fpLifecycleStatus = fpLifecycleStatus ? fpLifecycleStatus : 0;
                        if (fpLifecycleStatus == 0 || fpLifecycleStatus == "") {
                            let url = ADVISORY_GET_PRICINGDETAILS_API_URL;
                            let pricing_data = await apiCall(url, "", false, false);
                            if (pricing_data["error_code"] == "100") {
                                pricing_data = pricing_data["data"]["plan_details"]["plandetails"]
                                let pricingData = pricing_data.filter(data =>

                                    data.plan_id == 29
                                );
                                pricingData = pricingData[0];
                                var amount = 0;
                                if (pricingData.amount.isquaterly == 0 && pricingData.amount.total != "custom") {
                                    amount = parseInt(pricingData.amount.total);
                                } else {
                                    amount = pricingData.amount.Q1;
                                }
                                let cartdatatosend = {
                                    user_id: response_obj.data.id,
                                    plan_id: pricingData.plan_id,
                                    plan_sub_cat_id: pricingData.id,
                                    amount: amount,
                                    subscription_freq: pricingData.payment_frequency,
                                };
                                let url = ADVISORY_ADDTOCART_API_URL;
                                let cart_data = await apiCall(url, cartdatatosend, true, false);
                                if (cart_data.error_code == "100") {
                                    redirect_url = "/userflow/payment"
                                    window.location.href = process.env.PUBLIC_URL + "/userflow/payment/";
                                }
                            }
                        }
                    }
                } else {

                    let redUri = process.env.PUBLIC_URL + "/checkredirect?redirect=" + process.env.PUBLIC_URL + redirect_url;
                    let sky = response_obj.data.sky;
                    let auth1 = commonEncode.encrypt('' + JSON.stringify(response_obj.data.id) + '|' + sky);
                    let auth = btoa(auth1);
                    let redAuth = (redUri) ? "" + redUri + "/?auth=" + auth : "?auth=" + auth;
                    window.location.href = redAuth;
                    // setIsLoading(false)
                    setUserId(response_obj.data.id)
                    setItemLocal("sky", response_obj.data.sky);
                    return;
                }

                // loginRedirectGuest()
                // window.location.href = process.env.PUBLIC_URL + "/pricing/"



            } else {
                setIsLoading(false)
                toastr.options.positionClass = 'toast-bottom-left';
                toastr.error(response.data)
                //   dispatch({
                //     type: "RENDER_TOAST",
                //     payload: { message: response.data, type: "error" },
                //     autoClose: 3000,
                //   });
            }
        } catch (e) {
            console.log('e', e)
        }


    };
    const inputOTPChange = () => {
        var num1 = document.getElementById("otp_v1");
        var num2 = document.getElementById("otp_v2");
        var num3 = document.getElementById("otp_v3");
        var num4 = document.getElementById("otp_v4");
        var num5 = document.getElementById("otp_v5");

        if (num1.value.length === 1) {
            num1.classList.add("verif-b-orange");
        } else {
            num1.classList.remove("verif-b-orange");
        }

        if (num2.value.length === 1) {
            num2.classList.add("verif-b-orange");
        } else {
            num2.classList.remove("verif-b-orange");
        }

        if (num3.value.length === 1) {
            num3.classList.add("verif-b-orange");
        } else {
            num3.classList.remove("verif-b-orange");
        }

        if (num4.value.length === 1) {
            num4.classList.add("verif-b-orange");
        } else {
            num4.classList.remove("verif-b-orange");
        }
        if (num5.value.length === 1) {
            num5.classList.add("verif-b-orange");
        } else {
            num5.classList.remove("verif-b-orange");
        }

        var container = document.getElementsByClassName("input-code")[0];
        container.onkeyup = function (e) {
            var target = e.target;

            var maxLength = parseInt(target.attributes["maxlength"].value, 10);
            var myLength = target.value.length;

            if (myLength >= maxLength) {
                var next = target;
                while (next = next.nextElementSibling) {
                    if (next == null)
                        break;
                    if (next.tagName.toLowerCase() == "input") {
                        next.focus();
                        break;
                    }
                }
            } else if (myLength < maxLength) {
                var prev = target;
                while (prev = prev.previousElementSibling) {
                    if (prev == null)
                        break

                    if (prev.tagName.toLowerCase() == "input") {
                        prev.focus();
                        break;
                    }
                }
            }
        }

    }
    return (
        <div>
            <FintooLoader isLoading={isLoading} />

            <HideHeader />

            <div className="login-header">
                <a target="_self" href={process.env.PUBLIC_URL + "/login"} >
                    <div
                        className="back-arrow"

                    >
                        <img
                            src={imagePath + "/static/media/Images/userflow/img/icons/back-arrow.svg"}
                            alt="Back Arrow"
                        />
                    </div>
                </a>
                <a target="_self" href="/" className="logo">
                    <img
                        src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
                        alt="Fintoo logo"
                    />
                </a>
            </div>

            <section className="login-section">
                <div className="container-fluid">
                    <div className="row align-items-center ">
                        <div className="col-md-7">
                            <div className="login-block">
                                <div className="pt-3"></div>
                                <h2 className="page-header text-center">Enter OTP</h2>
                                <div>
                                    <div className="text-center">
                                        {otperror != '' && <p className="error">{otperror}</p>}

                                    </div>
                                    <div className="pt-3"></div>
                                    <div className="pt-3"></div>
                                    <Form onSubmit={handleSubmit}>
                                        <div className="row justify-content-center">
                                            <div className="col-md-8">
                                                <div className="input-code material input">
                                                    <input autoComplete="off" type="text" id="otp_v1" value={otp1} name="otp-1" className="otp-number-input" maxlength="1" onChange={(e) => {
                                                        inputOTPChange(e.target.value)
                                                        setOTP1(e.target.value)
                                                    }}
                                                        onFocus={() => {
                                                            simpleValidator.current.showMessageFor('otp1')
                                                        }}

                                                    />

                                                    <input autoComplete="off" type="text" id="otp_v2" value={otp2} name="otp-2" className="otp-number-input" maxlength="1" onChange={(e) => {
                                                        inputOTPChange(e.target.value)
                                                        setOTP2(e.target.value)
                                                    }}
                                                        onFocus={() => {
                                                            simpleValidator.current.showMessageFor('otp2')
                                                        }}
                                                    />

                                                    <input autoComplete="off" type="text" id="otp_v3" value={otp3} name="otp-3" className="otp-number-input" maxlength="1" onChange={(e) => {
                                                        inputOTPChange(e.target.value)
                                                        setOTP3(e.target.value)
                                                    }}
                                                        onFocus={() => {
                                                            simpleValidator.current.showMessageFor('otp3')
                                                        }}
                                                    />

                                                    <input autoComplete="off" type="text" id="otp_v4" value={otp4} name="otp-4" className="otp-number-input" maxlength="1" onChange={(e) => {
                                                        inputOTPChange(e.target.value)
                                                        setOTP4(e.target.value)
                                                    }}
                                                        onFocus={() => {
                                                            simpleValidator.current.showMessageFor('otp4')
                                                        }}
                                                    />

                                                    <input autoComplete="off" type="text" id="otp_v5" value={otp5} name="otp-5" className="otp-number-input" maxlength="1" onChange={(e) => {
                                                        inputOTPChange(e.target.value)
                                                        setOTP5(e.target.value)
                                                    }}
                                                        onFocus={() => {
                                                            simpleValidator.current.showMessageFor('otp5')
                                                        }}
                                                    />



                                                </div>
                                                {/* <div className="input-code material input">
                                                <input style={{fontSize:"14px"}} maxLength="5" type="text" tabindex="1" placeholder="" value={otp} onChange={(e)=>{
                                                    setOTP(e.target.value)
                                                    setOTPError('')
                                                }} 
                                                onFocus={() => {
                                                    simpleValidator.current.showMessageFor('otp')
                                                }}
                                                className="default-input"
                                                />

                                            </div> */}
                                                <div className="text-center">
                                                    <p>{simpleValidator.current.message('otp', otp, 'numeric|max:5|min:5', { message: { numeric: 'Please enter OTP' } })}</p>

                                                </div>

                                            </div>
                                        </div>

                                        <div className="row form-row justify-content-center">
                                            <div className="col-md-8 text-center" id="otp" style={{ display: "block" }}>
                                                <a href="#" onClick={() => {
                                                    resendOTP()
                                                }} style={{ marginBottom: '15px' }} className="blue-link resend-link">
                                                    Resend OTP
                                                </a>
                                            </div>
                                        </div>

                                        <div className="row justify-content-center text-center">
                                            <div class="col">
                                                <div class="btn-container">
                                                    <input type="submit" name="login" value="Submit" class="default-btn d-block" data-loading-text="Loading..." onSubmit={handleSubmit} />
                                                    <div id='timer'
                                                        style={{ fontWeight: 'bold', fontSize: '20px', fontStyle: 'bold', color: '#042b62' }}>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                    <div className="row form-row otp-msg">
                                        <div className="col">
                                            <div className="bottom-container">
                                                <p className="text-center pt-3">
                                                    We have sent an OTP to your -{" "}
                                                    <span id="sentnumber">{transformEntry(props.email, 'email')} &amp; {transformEntry(props.mobileNo, 'mobile')}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-md-5 d-none d-md-block registration-illustration h100"></div>
                    </div>
                </div>
            </section>

        </div>
    );
}
export default RegisterOTP;
