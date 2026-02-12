
import { useEffect,useState,useRef } from "react";
import Form from "react-bootstrap/Form";
import SimpleReactValidator from "simple-react-validator";
import { BASE_API_URL , DATA_BELONGS_TO } from "../constants";
import '../checkboxstyle.css'
import axios from "axios";
import RegisterOTP from "./RegisterOTP";
import commonEncode from '../commonEncode';
import { loginRedirectGuest,getUserId,getItemLocal,apiCall, getCookie, getCookieData, createCookie, deleteCookie, fetchEncryptData } from "../common_utilities";
import * as toastr from 'toastr'
import 'toastr/build/toastr.css';

import InternationalNumber from "./InternationalNumber";
import HideHeader from '../components/HideHeader';
import refreshCaptcha from "../Assets/Images/main/01_refresh_captcha.svg";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha';
import { Buffer } from "buffer";

const Register = () => {
    const [captcha,setCaptcha]=useState('')
    const [captchaVal,setCaptchaVal]=useState('')
    const [captchaImg,setCaptchaImg] = useState("");
    const [firstName,setFirstName]=useState('')
    const [email,setEmail]=useState('')
    const [emailErrorMsg,setEmailErrorMsg]=useState('')
    const [mobileNo,setMobileNo]=useState('')
    const [mobileErrorMsg,setMobileErrorMsg]=useState('')

    const [subscribeError,setSubscribeErrorMsg]=useState('')
    const [isSubsChecked,setSubs]=useState(false)
    const [termsError,setTermsMsg]=useState('')
    const [isTermsChecked,setTerms]=useState(false)
    const [isRegisterFormValid,setRegisterFormValid]=useState(false)
    const simpleValidator = useRef(new SimpleReactValidator());
    const [, forceUpdate] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [countryCode, setCountryCode] = useState("91");
    const [isMobileValid, setMobileValidation] = useState(false);
    const navigate = useNavigate();
    const recaptchaRef =useRef();
    const [src, setSrc] = useState("");
    const [redirectUri, setRedirectUri] = useState("");
    const [fhc, setFhc] = useState(0);
    const [utmSource, setUtmSource] = useState("");
    const [utmCampaign, setUtmCampaign] = useState("");
    const [tags, setTags] = useState("");


    const [otp,setOTP]=useState('')

  
    useEffect(() => {
        document.body.classList.add('main-layout');
    }, []);
    useEffect(() => {
        getCaptcha()
    }, []);
    useEffect(() => {
        if(isMobileValid==true){
            setMobileErrorMsg('')
        }
    }, [isMobileValid]);
    useEffect(() => {
        // checkIfLoggedIn()
    }, []);

    useEffect(() => {
      let urlParams = new URLSearchParams(window.location.search);
      let src = urlParams.get("src");
      let redirect_uri = urlParams.get("redirect_uri");
      let fhc = urlParams.get("fhc");
      if (fhc) {
        let utm_source = urlParams.get("utm_source");
        let utm_campaign = urlParams.get("utm_campaign");
        let tags = urlParams.get("tags");
        setSrc(src);
        setRedirectUri(redirect_uri);
        setFhc(1);
        setUtmSource(utm_source);
        setUtmCampaign(utm_campaign);
        setTags(tags);
      }
    }, []);


    const getCountryCode=()=>{
        const dialcode = Array.from(
          document.getElementsByClassName('iti__selected-dial-code')
    
        );
        if(dialcode.length>0){
          setCountryCode(dialcode[0].outerText.replace("+",""))
    
        }
    }
    const checkIfLoggedIn= async()=>{
        // let url = constClass.CHECK_SESSION;
        // let data = { user_id: getUserId(), sky: getItemLocal("sky") };
        // let respData = await apiCall(url, data, true, false);
        // if (respData["error_code"] == "100") {
        //     window.location.href = process.env.PUBLIC_URL + "/commondashboard/"
        // } 
    }
    const handleCheckboxClick=(e)=>{
        if(e.target.checked==false){
            setTermsMsg('Please accept Terms & Conditions.')
        }
        else{
            setTermsMsg('')

        }
        setTerms(e.target.checked)
    }
    const handleSubscribeClick=(e)=>{
        if(e.target.checked==false){
            setSubscribeErrorMsg('Please agree to receive alerts.')
        }
        else{
            setSubscribeErrorMsg('')

        }
        setSubs(e.target.checked)
    }
    const fetchValidateemail = async (val) => {
        
    
        var config = {
          method: "GET",
          url: BASE_API_URL + "restapi/checkemailexist/?email="+val,
        };
        var res = await axios(config);
       
        var validateEmail = res.data;
        
        if(validateEmail!=true){
            setEmailErrorMsg(res.data)
        }
        else{
            setEmailErrorMsg('')
        }
        

        if (val == ""){
          setEmailErrorMsg('')
        }
    
        
    };
    const fetchValidateMobileNo = async () => {
        
        if(mobileNo){

        var config = {
          method: "GET",
          url: BASE_API_URL + "restapi/checkmobileexist/?mobile="+mobileNo+"&country_code="+btoa("00" + countryCode),
        };
        var res = await axios(config);
       
        var validateMobileNo = res.data;
        
        if(validateMobileNo!=true){
            setMobileErrorMsg(res.data)
        }
        else{
            setMobileErrorMsg('')
        }
    }

    };
    const getCaptcha = async () => {
    
        var config = {
          method: "GET",
          url: BASE_API_URL + "restapi/getcaptcha/",
        };
        var res = await axios(config);
        if (res!=''){
           
            setCaptchaImg(
                res.data.captcha_url
              );
            setCaptcha(atob(res.data.captchatext));
            setCaptchaVal('')
        }
       
    };
    const sendSMS = async (mobileNo,email,firstName,countryCode) => {
        var otp = Math.floor(Math.random() * 90000) + 10000;
        setOTP(otp)
        try{
        var otpmsg = 'Greetings from Fintoo! Your OTP verification code is ' + otp;
        var whatsapptext = 'Greetings from Fintoo! Your OTP verification code is : ' + otp;
        var data={
            mobile:mobileNo,
            msg:otpmsg,
            otp:otp,
            data_belongs_to: DATA_BELONGS_TO,
            key:"register",
            sms_api_id: "fintoo_otp",
            whatsapptext: whatsapptext,
            country_code: countryCode
        }
        var config = {
            method: "POST",
            url: BASE_API_URL + "restapi/sendsmsApi/",
            data:commonEncode.encrypt(JSON.stringify(data))
        };
        var res = await axios(config);
        if(res){
            toastr.options.positionClass = 'toast-bottom-left';
            toastr.success("OTP sent to registered email/mobile");
            try{

                var mail_payload={
                    userdata: {
                        to: email
                    },
                    subject: "Fintoo - Verification for your new account",
                    template: "otp_message_template.html",
                    contextvar: { "otp": otp, "name":firstName  }
                }
                var mail_config = {
                    method: "POST",
                    url: BASE_API_URL + "restapi/sendmail/",
                    data:commonEncode.encrypt(JSON.stringify(mail_payload))
                };
                var mail_res = await axios(mail_config);
                if(mail_res){
                    // setIsLoading(false);

                }

            }
            catch(e){
                // setIsLoading(false);

                console.log('err',e);
            }

        }
        }
        catch(e){
            setIsLoading(false);

            console.log('e',e)
        }
    }
    
    const handleSubmit = (event) => {
        
        event.preventDefault();
        event.stopPropagation();
        recaptchaRef.current.execute(); 
        
        var isFormValid=simpleValidator.current.allValid();

        if(isTermsChecked==false){
            setTermsMsg('Please accept Terms & Conditions.')
        }
        if(isSubsChecked==false){
            setSubscribeErrorMsg('Please agree to receive alerts.')
        }
        if(isMobileValid==false){
            setMobileErrorMsg('Please enter mobile number.')
        }
        if (isFormValid  && isTermsChecked && isSubsChecked && emailErrorMsg=='') {
            sendSMS(mobileNo,email,firstName,countryCode)
            setRegisterFormValid(true)
        }
        
        else{
            simpleValidator.current.showMessages();
        }
        
        
    };
    useEffect(()=>{
        const url = window.location.search;
        const params =  new URLSearchParams(url);
        const isexpert = params.get('isexpert');
        const rm_id = params.get('rm_id');
        const plan_id = params.get('plan_id');
        if (isexpert != null && isexpert == "1"){
            
            if (rm_id != null && rm_id != '' && rm_id != '0' && plan_id != null && plan_id == '31'){
                async function rmdetails() {
                    var payload = {
                        method: "post",
                        url: '',
                        data: {
                            'rm_id':rm_id
                        },
                      };
                    let api_call_data = await fetchEncryptData(payload);
                    var rm_data= api_call_data['data']
                    if (rm_data.length > 0){
                        createCookie('is_expert', isexpert,600)
                        createCookie('rm_id', rm_id, 600)
                        createCookie('plan_id', plan_id,600)
                        navigate(process.env.PUBLIC_URL + '/register');
                    }
                    else{
                        deleteCookie('rm_id')
                        deleteCookie('plan_id')
                        deleteCookie('is_expert')
                        navigate(process.env.PUBLIC_URL + '/register');
                    }
                }
                rmdetails()
            }
                
        }
        
    },[])
    return (
        <div>
            {/* <FintooLoader isLoading={isLoading} /> */}


            {/* <div className="login-header">
                <a target="_self" href="/" className="back-arrow">
                    <img
                        src="https://images.minty.co.in/static/userflow/img/icons/back-arrow.svg"
                        alt="Back Arrow"
                    />
                </a>
                <a target="_self" href="/" className="logo">
                    <img
                        src="https://images.minty.co.in/static/userflow/img/logo.svg"
                        alt="Fintoo logo"
                    />
                </a>
            </div> */}
            {isRegisterFormValid && <RegisterOTP  firstName={firstName} mobileNo={mobileNo} email={email}  sendSMS={sendSMS} countryCode={countryCode} sentOTP={otp}></RegisterOTP>}
            {isRegisterFormValid==false &&
            <>
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
            <section className="login-section">
                <div className="container-fluid">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-md-5 pt-5">
                            <div className="login-block" style={{ marginTop: '0rem' }}>
                                <h2 className="page-header text-center">Let's get started!</h2>
                                <p className="text-center">Enter your details</p>
                                <Form noValidate onSubmit={handleSubmit}>

                                <div>
                                    <div className="row justify-content-center">
                                        <div className="col-md-6">
                                            <div className="material input register_div mb-md-0">
                                                <input type="text" tabIndex="1" placeholder="Full Name*" value={firstName}  className="default-input" onChange={(e) => {
                                                        setFirstName(e.target.value);
                                                    }
                                                }
                                                onBlur={() => {
                                                    simpleValidator.current.showMessageFor('firstName')
                                                    forceUpdate(1);

                                                  }}
                                                />
                                                <>{simpleValidator.current.message('firstName', firstName, 'required|alpha_space|min:3|max:60',{messages:{alpha_space:'Alphabets are allowed only.',required:'Please enter Full Name',max: "Name must be between 3-60 characters.",min: "Name must be between 3-60 characters."}})}</>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center">
                                        <div className="col-md-6">
                                            <div className="material input register_div mt-md-2">
                                                <input type="text" tabIndex="1" placeholder="Email*" value={email} className="default-input" 
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        fetchValidateemail(e.target.value)
                                                        }
                                                    }   
                                                    // onFocus={() => {
                                                    //     simpleValidator.current.showMessageFor('email')
                                                    //     forceUpdate(1);

                                                        
                                                    // }}
                                                    onBlur={() => {
                                                        simpleValidator.current.showMessageFor('email')
                                                        forceUpdate(1);

                                                        // if (
                                                        //     simpleValidator.current.fieldValid("email")
                                                        //   ) {
                                                        //     fetchValidateemail();
                                                        //   }
                                                    }
                                                }
                                                />
                                                <>{simpleValidator.current.message('email', email, 'required|email')}</>
                                                <span  className="error" >{emailErrorMsg}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center">
                                        <div className="col-md-6">
                                            <div className="material input register_div mt-md-2">
                                            <InternationalNumber
                                                    value={mobileNo}
                                                    setCountryCode={setCountryCode}
                                                    fetchValidateMobileNo={fetchValidateMobileNo}
                                                    onChange={(v) => {
                                                    setMobileNo(v);

                                                    }}
                                                    tabIndex="2"
                                                    onBlur={()=> {
                                                    simpleValidator.current.showMessageFor("mobileNo");
                                                    }}
                                                    setMobileValidation={setMobileValidation}
                                                />
                                                {mobileErrorMsg!=''&& <span className="srv-validation-message">{mobileErrorMsg}</span> }
                                                {/* <input type="text" tabIndex="1" placeholder="Mobile Number*" value={mobileNo} className="default-input" 
                                                onChange={(e) => {
                                                    setMobileNo(e.target.value);
                                                    }
                                                }   
                                                onFocus={() => {
                                                    simpleValidator.current.showMessageFor('mobileNo')
                                                    forceUpdate(1);
                                                }}
                                                onBlur={() => {
                                                    simpleValidator.current.showMessageFor('mobileNo')
                                                    forceUpdate(1);

                                                    if (
                                                        simpleValidator.current.fieldValid("mobileNo")
                                                    ) {
                                                        fetchValidateMobileNo();
                                                    } <input type="text" tabIndex="1" placeholder="Mobile Number*" value={mobileNo} className="default-input" 
                                                onChange={(e) => {
                                                    setMobileNo(e.target.value);
                                                    }
                                                }   
                                                onFocus={() => {
                                                    simpleValidator.current.showMessageFor('mobileNo')
                                                    forceUpdate(1);
                                                }}
                                                onBlur={() => {
                                                    simpleValidator.current.showMessageFor('mobileNo')
                                                    forceUpdate(1);

                                                    if (
                                                        simpleValidator.current.fieldValid("mobileNo")
                                                    ) {
                                                        fetchValidateMobileNo();
                                                    }
                                                }}
                                                />
                                                <p>{simpleValidator.current.message('mobileNo', mobileNo, 'required|numeric|min:10|max:15',{message:{numeric:'Mobile number must be numeric'}})}</p>
                                                <p className="error">{mobileErrorMsg}</p>
                                                }}
                                                />
                                                <p>{simpleValidator.current.message('mobileNo', mobileNo, 'required|numeric|min:10|max:15',{message:{numeric:'Mobile number must be numeric'}})}</p>
                                                <p className="error">{mobileErrorMsg}</p> */}

                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="row justify-content-center">
                                        <div className="col-md-6">
                                            <div className="material input mb-2">

                                                <input type="password" tabIndex="1" placeholder="Enter Password*" value={password} className="default-input" 
                                                        onChange={(e) => {
                                                            setPassword(e.target.value);
                                                            }
                                                        }
                                                        onBlur={() => {
                                                            simpleValidator.current.showMessageFor('password')
                                                        }}
                                                
                                                />
                                               
                                                <p>{simpleValidator.current.message('password', password, ['required',{regex:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/}], {messages: {regex: 'Password must contain a capital letter, a number and a special character (only ! @ # $ % ^ & * are allowed)'}})}</p>

                                               
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center">
                                        <div className="col-md-6">
                                            <div className="material input mb-2 mt-1">
                                               
                                                <input type="password" tabIndex="1" placeholder="Confirm Password*" value={confirmPassword} className="default-input" 
                                                        onChange={(e) => {
                                                            setConfirmPassword(e.target.value);
                                                            }
                                                        }
                                                        onBlur={() => {
                                                            simpleValidator.current.showMessageFor('confirmPassword')
                                                        }}
                                                
                                                />
                                                <p>{simpleValidator.current.message('confirmPassword', confirmPassword, ['required',{regex:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/},{in:password}], {messages: {regex: 'Password must contain a capital letter, a number and a special character (only ! @ # $ % ^ & * are allowed)',in:'Password do not match'}})}</p>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="mt-md-2"></div>
                                    <div className="row mt-2 justify-content-center">
                                        <div className="col-md-3">
                                            <div id="captcha_block" style={{marginTop: "10px"}}>
                                                <img src={captchaImg} style={{ float: "left" }} draggable="false" />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div id="captcha_block" style={{marginTop: "10px"}}>
                                                <img onClick={getCaptcha} className="refresh_captcha" src={refreshCaptcha} draggable="false" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center">
                                        <div className="col-md-6">
                                            <div className="material input register_div">
                                                <input type="text" tabIndex="1"  placeholder="Captcha*"  value={captchaVal} className="default-input"
                                                onChange={(e) => {
                                                    setCaptchaVal(e.target.value);
                                                    }
                                                }  
                                                onFocus={() => {
                                                    simpleValidator.current.showMessageFor('captchaVal')
                                                    forceUpdate(1);
                                                }}
                                                />
                                                <>{simpleValidator.current.message('captchaVal', captchaVal, ['required',{in:captcha}],{messages:{in:'Please enter valid captcha code',required:'Please enter captcha'}})}</>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center text-left">
                                        <div className="col-md-6">
                                            <div className="checkbox-container position-relative" style={{ margin: '10px 0px 0px' }}>
                                                
                                                <input type="checkbox" tabIndex="1" className="custom-checkbox"  onClick={handleCheckboxClick}/>
                                                <label for="rememberMe" className="checkbox-label">I accept the <a className="blue-link mt-0" href={process.env.PUBLIC_URL + "/terms-conditions/"} >Terms & Conditions</a>*</label>
                                                
                                            </div>
                                            <span  className="error" >{termsError}</span>
                                        </div>
                                      
                                    </div>
                                    <div className="row justify-content-center text-left">
                                        <div className="col-md-6">
                                                <div className="checkbox-container position-relative" style={{ margin: '13px 0px 0px' }}>
                                                    
                                                    <input type="checkbox" tabIndex="1" className="custom-checkbox"  onClick={handleSubscribeClick}/>
                                                    <label for="rememberMe" className="checkbox-label">I agree to receive alerts via email & text messages.*</label>
                                                    
                                                </div>  
                                                <span  className="error" >{subscribeError}</span>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center text-center">
                                        <div class="col">
                                            <div class="btn-container">
                                                <input type="submit" name="login" value="Register" class="default-btn d-block" data-loading-text="Loading..." />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center">
                                        Already a member?{" "}
                                        <a
                                            href={
                                            fhc
                                                ? process.env.PUBLIC_URL +
                                                "/login" +
                                                "/?src=" +
                                                src +
                                                "&redirect_uri=" +
                                                redirectUri +
                                                "&fhc=" +
                                                Buffer.from(commonEncode.encrypt("1")).toString("base64") +
                                                (utmSource ? "&utm_source=" + Buffer.from(utmSource) : "") +
                                                (utmCampaign ? "&utm_service=" + Buffer.from(utmCampaign) : "") +
                                                (tags ? "&tags=" + Buffer.from(tags) : "")
                                                : process.env.PUBLIC_URL + "/login/"
                                            }
                                            target="_self"
                                            class="blue-link"
                                        >
                                            Login
                                        </a>
                                    </p>

                                </div>
                                </Form>
                            </div>
                        </div>
                        <div className="col-md-5 d-none d-md-block registration-illustration h100"></div>
                        <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey="6LeTEa8pAAAAAHCO5zVqhJOTPCRZp6rzaZ5tCjiR" />
                    </div>
                </div>
            </section>
            </>
            }
        </div>
    );
}
export default Register;