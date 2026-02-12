import { useEffect, useState, useRef } from "react";
import SimpleReactValidator from "simple-react-validator";
import Form from "react-bootstrap/Form";
import axios from "axios";
import commonEncode from '../commonEncode';
import * as toastr from 'toastr'
import 'toastr/build/toastr.css';
import FintooLoader from '../components/FintooLoader';
import {
    setUserId,
    setItemLocal,
    getFpLogId,
    setFplogid,
    apiCall,
} from "../common_utilities";
import HideHeader from "../components/HideHeader";
import { useNavigate } from "react-router-dom";
const LoginOTP = (props) => {

    const [otp1, setOTP1] = useState('')
    const [otp2, setOTP2] = useState('')
    const [otp3, setOTP3] = useState('')
    const [otp4, setOTP4] = useState('')
    const [otp5, setOTP5] = useState('')
    const [otpError, setOTPError] = useState('')
    const [otpActive, setOTPActive] = useState(1)
    const [otpvalid, setOTPValid] = useState(false)
    const simpleValidator = useRef(new SimpleReactValidator());
    const [, forceUpdate] = useState();
    const [timerOn, setTimer] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [resendOTPCounter, setResendOTPCounter] = useState(1);
    const navigate = useNavigate();
    useEffect(() => {
        document.body.classList.add('main-layout');
    }, []);
    useEffect(() => {
        timer(180);
    }, [])
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
    const deleteCookie = (name) => {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    const resendOTP = () => {
        setOTPActive(1)
        setOTP1('')
        setOTP2('')
        setOTP3('')
        setOTP4('')
        setOTP5('')
        setOTPError('')
        if (resendOTPCounter == 1) {
            if (getCookieData('resendotpcookie')) {
                var expiry_time = getCookieData('resendotpcookie')
                var current_time = new Date().getTime()
                if (current_time > expiry_time) {
                    var date = new Date()
                    if (!getCookieData('resendotpcookie')) {
                        createCookie('resendotpcookie', date.setTime(date.getTime() + (30 * 60 * 1000)), 30)
                    }
                    timer(180)

                    setResendOTPCounter((oldCount) => oldCount + 1)
                    props.sendSMS(props.mobileNo, props.countryCode, props.email);

                }
                else {
                    toastr.options.positionClass = 'toast-bottom-left';
                    toastr.error("You've reached Maximum Attempts to generate OTP. Please try again after 30 min.")
                    setResendOTPCounter(1)
                }
            }
            else {
                var date = new Date()
                if (!getCookieData('resendotpcookie')) {
                    createCookie('resendotpcookie', date.setTime(date.getTime() + (30 * 60 * 1000)), 30)
                }
                timer(180)
                setResendOTPCounter((oldCount) => oldCount + 1)
                props.sendSMS(props.mobileNo, props.countryCode, props.email);


            }
        }
        else if (resendOTPCounter <= 3) {
            var expiry_time = getCookieData('resendotpcookie')
            var current_time = new Date().getTime()
            if (expiry_time < current_time) {
                toastr.error(" You've reached Maximum Attempts to generate OTP. Please try again after 30 min.")
                $scope.resend_otp_counter = 1
            }
            else {
                var date = new Date()
                if (!getCookieData('resendotpcookie')) {
                    createCookie('resendotpcookie', date.setTime(date.getTime() + (30 * 60 * 1000)), 30)
                }
                timer(180)
                setResendOTPCounter((oldCount) => oldCount + 1)
                props.sendSMS(props.mobileNo, props.countryCode, props.email);

            }
        }
        else {

            var expiry_time = getCookieData('resendotpcookie')
            var current_time = new Date().getTime()
            if (current_time > expiry_time) {
                setResendOTPCounter(1)
            }
            toastr.error(" You've reached Maximum Attempts to generate OTP. Please try again after 30 min.")
        }
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
            setOTPActive(0)
            document.getElementById("otp").style.display = "block";
            document.getElementById("timer").style.display = "none";
        }
        if (!timerOn) {
            return;
        }
    }
    const transformEntry = (item, type) => {
        if (item != '') {
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
    }


    const isOTPValid = () => {

    }
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
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();


        var isFormValid = simpleValidator.current.allValid();
        var entered_otp = otp1 + otp2 + otp3 + otp4 + otp5
        var actual_otp = props.otp
        if (entered_otp == '') {
            setOTPError('Please enter OTP')
            setOTPValid(false)
        }

        else if (entered_otp == actual_otp && otpActive == 0) {

            setOTPError('This OTP has expired')
            setOTPValid(false)
        }
        else if (entered_otp != actual_otp) {

            setOTPError('Invalid OTP, please try again.')
            setOTPValid(false)
        }
        else if (entered_otp == actual_otp && otpActive == 1) {

            setOTPError('')
            setOTPValid(true)
            if (isFormValid) {
                loginuser(props.mobileNo, props.email)
            }

        }




    }

    const loginuser = async (mobileNo, email) => {

        setIsLoading(true)

        var loginotpdata = {
            "otp-1": otp1,
            "otp-2": otp2,
            "otp-3": otp3,
            "otp-4": otp4,
            "otp-5": otp5,
            "emailmobile": props.emailmobile
        }

        var data = commonEncode.encrypt(JSON.stringify(loginotpdata));

        try {
            var config = {
                method: "post",
                url: BASE_API_URL + 'loginuser/',
                data: data,
            };

            var res = await axios(config);
            if (res) {

                var response_obj = JSON.parse(commonEncode.decrypt(res.data))

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

                    setUserId(response_obj.user_id)
                    setItemLocal("sky", response_obj.sky);
                    try {
                        let fp_log_id = await getFpLogId();
                        setFplogid(fp_log_id)
                    }
                    catch {
                        setFplogid("")
                    }

                    if (response_obj.status == "0") {
                        document.cookie = "dg_not_completed=1";
                        createCookie("dg_not_completed", "1", 10)
                    }
                    else if (response_obj.status == "1") {
                        document.cookie = "dg_not_completed=2";
                        createCookie("dg_not_completed", "2", 10)
                    }
                    else if (response_obj.status == "6") {
                        document.cookie = "renewal_popup";
                        createCookie("renewal_popup", "1", 600)
                        createCookie("subscription_end_date", response_obj.subscription_end_date, 600)
                    }
                    else if (response_obj.status == "7") {
                        document.cookie = "renewal_popup";
                        createCookie("renewal_popup", "2", 600)
                        createCookie("subscription_end_date", response_obj.subscription_end_date, 600)
                    }
                    let urlParams = new URLSearchParams(window.location.search);
                    let src = urlParams.get("src");
                    let redirectUri = urlParams.get("redirect_uri");
                    let urlkey = urlParams.get("urlkey");
                    let fhc = urlParams.get("fhc");
                    let fhc_status = 0;
                    if (fhc) {
                        setItemLocal("fhc", 1);
                        let url = '';
// let url = CHECK_SESSION;
                        let data = { user_id: response_obj.user_id.toString(), sky: response_obj.sky };
                        let session_data = await apiCall(url, data, true, false);
                        if (session_data["error_code"] == "100") {
                            let fpLifecycleStatus = session_data["data"]["fp_lifecycle_status"];
                            fpLifecycleStatus = fpLifecycleStatus ? fpLifecycleStatus : 0;
                            if (fpLifecycleStatus == 0 || fpLifecycleStatus == "") {
                                let url = '';
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
                                        user_id: response_obj.user_id,
                                        plan_id: pricingData.plan_id,
                                        plan_sub_cat_id: pricingData.id,
                                        amount: amount,
                                        subscription_freq: pricingData.payment_frequency,
                                    };
                                    let url = '';
                                    let cart_data = await apiCall(url, cartdatatosend, true, false);
                                    if (cart_data.error_code == "100") {
                                        fhc_status = 1;
                                        window.location.href = process.env.PUBLIC_URL + "/userflow/payment/";
                                    }
                                }
                            }
                        }
                    }

                    if (src) {
                        setItemLocal("logged_in", 1);
                        setItemLocal("family", 1);
                        let redUri = commonEncode.decrypt(atob(redirectUri));
                        if (fhc && fhc_status == 0) {
                            const t =
                                window.location.origin + "/commondashboard";
                            var redirectURL =
                                window.location.origin +
                                process.env.PUBLIC_URL +
                                "/checkredirect?redirect=" +
                                encodeURI(t);
                            redUri = redirectURL;
                        }
                        let sky = response_obj.sky;
                        let auth1 = commonEncode.encrypt('' + JSON.stringify(response_obj.user_id) + '|' + sky);
                        let auth = btoa(auth1);
                        let redAuth = (redUri) ? "" + redUri + "/?auth=" + auth : "?auth=" + auth;
                        window.location.href = redAuth;
                        return;
                    }

                    if (urlkey == 'stocks') {
                        window.location.href = process.env.PUBLIC_URL + "/stocks/?auth=" + response_obj.user_id + "&mobile=" + response_obj.mobile;
                        return;
                    }
                    if (urlkey == 'details') {
                        window.location.href = process.env.PUBLIC_URL + "/stocks/details/?stock_code=" + stock_code + "&auth=" + response_obj.user_id + "&mobile=" + response_obj.mobile;
                        return;
                    }


                    if (response_obj.data == "expertflow_logged_in") {
                        deleteCookie('rm_id')
                        deleteCookie('plan_id')
                        deleteCookie('is_expert')
                        window.location.href = "/web/datagathering/about-you/";
                        setIsLoading(false)
                    } else if (response_obj.data == "expertflow_logged_in_profile") {
                        deleteCookie('rm_id')
                        deleteCookie('plan_id')
                        deleteCookie('is_expert')
                        window.location.href = "/userflow/profile-fill-details/";
                        setIsLoading(false)

                    } else if (response_obj.data == "expertflow_logged_in_nda") {
                        deleteCookie('rm_id')
                        deleteCookie('plan_id')
                        deleteCookie('is_expert')
                        window.location.href = "/userflow/expert-nda/";
                        setIsLoading(false)
                    } else if (response_obj.data == "renewal_pop_up") {
                        window.location.href = process.env.PUBLIC_URL + "/commondashboard";
                        setIsLoading(false)
                    }
                    else {
                        window.location.href = process.env.PUBLIC_URL + "/commondashboard";
                        setIsLoading(false)
                    }




                } else {

                    toastr.options.positionClass = 'toast-bottom-left';
                    toastr.error(response_obj.data)
                    setIsLoading(false)

                }
            }
        } catch (e) {
            console.log('e', e)
        }


    };

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
                            src="https://stg.minty.co.in/static/userflow/img/icons/back-arrow.svg"
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

            <section className="login-section login-otp">
                <div className="container-fluid">
                    <div className="row justify-content-center align-items-center ">
                        <div className="col-md-5">
                            <div className="login-block">
                                <div className="pt-3"></div>
                                <h2 className="page-header text-center" style={{ color: "#042b62" }}>Enter OTP</h2>
                                <div>
                                    <div className="pt-3"></div>
                                    <div className="pt-3"></div>
                                    <Form onSubmit={handleSubmit}>
                                        <div className="row justify-content-center">
                                            <div className="col-md-12 text-center">

                                                <p className="error">{otpError}</p>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="input-code material input">
                                                    <input autoComplete="off" type="text" id="otp_v1" value={otp1} name="otp-1" className="otp-number-input default-grey" maxlength="1" onChange={(e) => {
                                                        inputOTPChange(e.target.value)
                                                        setOTP1(e.target.value)
                                                    }}
                                                        onFocus={() => {
                                                            simpleValidator.current.showMessageFor('otp1')
                                                        }}

                                                    />

                                                    <input autoComplete="off" type="text" id="otp_v2" value={otp2} name="otp-2" className="otp-number-input default-grey" maxlength="1" onChange={(e) => {
                                                        inputOTPChange(e.target.value)
                                                        setOTP2(e.target.value)
                                                    }}
                                                        onFocus={() => {
                                                            simpleValidator.current.showMessageFor('otp2')
                                                        }}
                                                    />

                                                    <input autoComplete="off" type="text" id="otp_v3" value={otp3} name="otp-3" className="otp-number-input default-grey" maxlength="1" onChange={(e) => {
                                                        inputOTPChange(e.target.value)
                                                        setOTP3(e.target.value)
                                                    }}
                                                        onFocus={() => {
                                                            simpleValidator.current.showMessageFor('otp3')
                                                        }}
                                                    />

                                                    <input autoComplete="off" type="text" id="otp_v4" value={otp4} name="otp-4" className="otp-number-input default-grey" maxlength="1" onChange={(e) => {
                                                        inputOTPChange(e.target.value)
                                                        setOTP4(e.target.value)
                                                    }}
                                                        onFocus={() => {
                                                            simpleValidator.current.showMessageFor('otp4')
                                                        }}
                                                    />

                                                    <input autoComplete="off" type="text" id="otp_v5" value={otp5} name="otp-5" className="otp-number-input default-grey" maxlength="1" onChange={(e) => {
                                                        inputOTPChange(e.target.value)
                                                        setOTP5(e.target.value)
                                                    }}
                                                        onFocus={() => {
                                                            simpleValidator.current.showMessageFor('otp5')
                                                        }}
                                                    />



                                                </div>
                                                <div className="text-center">
                                                    {/* <p>{simpleValidator.current.message('otp1', otp1, 'required|numeric',{message:{numeric:'Please enter OTP'}})}</p> */}
                                                </div>

                                            </div>
                                        </div>

                                        <div className="row form-row justify-content-center">
                                            <div className="col-md-8 text-center" id="otp" style={{ display: "block" }}>
                                                <a href="#" onClick={() => { resendOTP() }} style={{ marginBottom: '15px' }} className="blue-link resend-link default-grey">
                                                    Resend OTP
                                                </a>
                                            </div>
                                        </div>

                                        <div className="row justify-content-center text-center">
                                            <div className="col">
                                                <div className="btn-container">
                                                    <input type="submit" name="login" value="Submit" className="default-btn d-block custom-background-color" onSubmit={handleSubmit} />
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
                        <div className="col-md-5 d-md-block d-none registration-illustration h100"></div>
                    </div>
                </div>
            </section>

        </div>
    );
}
export default LoginOTP;
