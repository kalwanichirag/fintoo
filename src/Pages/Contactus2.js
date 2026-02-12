import React, { useState, useRef, useEffect } from "react";
import SimpleReactValidator from "simple-react-validator";
import Form from "react-bootstrap/Form";
import commonEncode from "../commonEncode";
import { apiCall, fetchEncryptData } from "../common_utilities";
import FintooLoader from "../components/FintooLoader";
import styles from "../components/HTML/Footer/style.module.css";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import HideFooter from "../components/HideFooter";
import HideHeader from "../components/HideHeader";
import { useDispatch, useSelector } from "react-redux";
import UAEFooter from "../components/HTML/Footer/UAEFooter";
import InternationalNumber from "./InternationalNumber";
import UAEHeader from "../components/MainHeader/UAEHeader";
import refresh_captcha from "../Assets/Images/main/refresh_captcha.svg";
function Contactus() {
  const [captcha, setCaptcha] = useState("");
  const [captchaVal, setCaptchaVal] = useState("");
  const [captchaImg, setCaptchaImg] = useState("");
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showThankyou, setShowThankyou] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [countryCode, setCountryCode] = useState("971");
  const formRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "HIDE_FOOTER", payload: true });
  }, []);
  useEffect(() => {
    document.body.classList.add("main-layout");
    getCaptcha();
    getCountryCode();

  }, []);

  const getCountryCode=()=>{
    const dialcode = Array.from(
      document.getElementsByClassName('iti__selected-dial-code')

    );
    if(dialcode.length>0){
      setCountryCode(dialcode[0].outerText.replace("+",""))

    }
  }
  const handleSuccess = () => {
    setShowThankyou(true);

    setTimeout(() => {
      setShowThankyou(false);
    }, 5000);

    setSubject("");
    setEmail("");
    setMessage("");
    setName("");
    setMobileNo("");
    setCaptchaVal("");
    simpleValidator.current.visibleFields = [];
    simpleValidator.current.hideMessages();
    forceUpdate(1);
  };

  const getCaptcha = async () => {
    // try {
    //   setIsLoading(true);
    //   var config = await apiCall(ADVISORY_CAPTCHA_API_URL, "", false, false);

    //   if (config != "") {
    //     setIsLoading(false);
    //     setCaptchaImg(
    //       config.captcha_url
    //     );
    //     setCaptcha(atob(config.captchatext));
    //     setCaptchaVal("");
    //   }
    // } catch(e) {
    //   console.log('error',e)
    // }
    // {

    // }
  };

  const contact = async () => {
    try {
      setIsLoading(true);
      // var data = {
      //   name: Name,
      //   mobile: countryCode+mobileNo,
      //   email: email,
      //   mail_subject: subject,
      //   message: message,
      //   country:"uae"
      // };

      // var payload_data = commonEncode.encrypt(JSON.stringify(data));
      // var contactus_data = await apiCall(
      //   ADVISORY_CONTACTUS_API_URL,
      //   payload_data,
      //   false,
      //   false
      // );
      // var res = JSON.parse(commonEncode.decrypt(contactus_data));
      // if ((res.error_code = "0")) {
      //   setIsLoading(false);
      //   handleSuccess();
      // } else {
      //   setIsLoading(true);
      //   setError(true);
      // }
    } catch (e) {
      // console.log("Error");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    var isFormValid = simpleValidator.current.allValid();

    simpleValidator.current.showMessages();
    forceUpdate(1);
    if (isFormValid) {
      contact();
    }
  };

  


  return (
    <div>
      <HideFooter />
      {window.location.host.indexOf('fintoo.ae') > -1 && <HideHeader />}
      
      <FintooLoader isLoading={isLoading} />
      <section className="contact-us mt-4" ng-controller="contactController">
        {window.location.host.indexOf('fintoo.ae') > -1 && (<div className="text-center py-4">
          <img src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"} alt="fintoo logo"/>
        </div>)}
        <div className="container-fluid UAE-contact">
          <div className="row d-flex align-items-center RowReverse  bg-grey">
            <div className="col-md-6 pl-40">
              <div className=" ">
                <div className="d-md-block d-none">
                  <div className="w-50 m-auto">
                    <h2 className="page-header2 color-blue">
                      Contact Information
                    </h2>
                    <ul className="icon-list mt-3">
                      <li className="call"> +971 54 512 6647</li>
                      <li className="mail">support@fintoo.ae</li>
                    </ul>
                  </div>
                </div>
                <div className="d-md-none d-block">
                  <div className="w-75 m-auto">
                    <h2 className="page-header2 color-blue">
                      Contact Information
                    </h2>
                    <ul className="icon-list mt-3">
                      <li className="call"> +971 54 512 6647</li>
                      <li className="mail">support@fintoo.ae</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className=" ">
                <div className="d-md-block d-none">
                  <div className="w-50 m-auto">
                    <h2 className="page-header2 color-blue">Business Hours</h2>
                    <ul className="icon-list mt-3">
                      <li className="hours">
                        <p>Monday to Saturday - 9 am to 6 pm</p>
                      </li>
                    </ul>
                    <h2 className="page-header2 color-blue">Get In Touch</h2>
                    <div
                      className={`d-flex m-0 justify-content-start ${styles.FooterwidgetSocialNRI}`}
                    >
                      <a
                        target="_blank"
                        className={` ${styles.FooterwidgetSocialIcons}`}
                        href="https://twitter.com/fintoouae"
                      >
                        <FaTwitter />
                      </a>

                      <a
                        target="_blank"
                        className={`${styles.FooterwidgetSocialIcons}`}
                        href="https://www.facebook.com/fintoouae"
                      >
                        <FaFacebookF />
                      </a>

                      <a
                        target="_blank"
                        className={`${styles.FooterwidgetSocialIcons}`}
                        href="https://www.linkedin.com/showcase/fintooae/"
                      >
                        <FaLinkedin />
                      </a>

                      <a
                        target="_blank"
                        className={`${styles.FooterwidgetSocialIcons}`}
                        href="https://www.instagram.com/fintoouae"
                      >
                        <FaInstagram />
                      </a>

                      <a
                        target="_blank"
                        className={`${styles.FooterwidgetSocialIcons}`}
                        href="https://www.youtube.com/channel/UC00AMcwwfUKrV-XD5n6hWyQ/videos"
                      >
                        <FaYoutube />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="d-md-none d-block">
                  <div className="w-75 m-auto">
                    <h2 className="page-header2 color-blue">Business Hours</h2>
                    <ul className="icon-list mt-3">
                      <li className="hours">
                        <p>Monday to Saturday - 9 am to 6 pm</p>
                      </li>
                    </ul>
                    <h2 className="page-header2 color-blue">Get In Touch</h2>
                    <div
                      className={`d-flex m-0 justify-content-start ${styles.FooterwidgetSocialNRI}`}
                    >
                      <a
                        target="_blank"
                        className={` ${styles.FooterwidgetSocialIcons}`}
                        href="https://twitter.com/fintoouae"
                      >
                        <FaTwitter />
                      </a>

                      <a
                        target="_blank"
                        className={`${styles.FooterwidgetSocialIcons}`}
                        href="https://www.facebook.com/fintoouae"
                      >
                        <FaFacebookF />
                      </a>

                      <a
                        target="_blank"
                        className={`${styles.FooterwidgetSocialIcons}`}
                        href="https://www.linkedin.com/showcase/fintooae/"
                      >
                        <FaLinkedin />
                      </a>

                      <a
                        target="_blank"
                        className={`${styles.FooterwidgetSocialIcons}`}
                        href="https://www.instagram.com/fintoouae"
                      >
                        <FaInstagram />
                      </a>

                      <a
                        target="_blank"
                        className={`${styles.FooterwidgetSocialIcons}`}
                        href="https://www.youtube.com/channel/UC00AMcwwfUKrV-XD5n6hWyQ/videos"
                      >
                        <FaYoutube />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 pl-0">
              <div
                style={{ display: showThankyou == false ? "block" : "none" }}
              >
                <Form
                  ref={formRef}
                  name="userForm"
                  id="commentForm"
                  method="post"
                  action=""
                  className="login-form registration-form contact-form ng-pristine ng-valid"
                  autoComplete="off"
                  noValidate="novalidate"
                  onSubmit={handleSubmit}
                >
                  <div className="row form-row justify-content-center">
                    <div  className="col-md-7">
                      <h2 className="page-header2 text-center">
                        Send A Message
                      </h2>
                    </div>
                  </div>
                  <div className="row form-row justify-content-center">
                    <div className="col-md-7">
                      <div className="position-relative">
                      <div className="material input">
                        <input value={Name} type="text" tabIndex="1" placeholder="Name*" name="name" id="name"
                        onChange={(e) => {
                          setName(e.target.value);
                            }
                        }
                        onBlur={() => {
                          simpleValidator.current.showMessageFor('Name');
                      }}
                        
                        />
                        <p>{simpleValidator.current.message('Name', Name, 'required|alpha|min:3|max:60')}</p>
                      </div>
                      </div>
                    </div>
                  </div>
                  <div className="row form-row justify-content-center">
                    <div className="col-md-7">
                      <div className="position-relative">
                        <div
                          className="material input"
                          style={{
                            width: "100%",
                          }}
                        >
                          {/* <input
                            type="text"
                            value={mobileNo}
                            tabIndex="1"
                            placeholder="Mobile Number*"
                            className="input"
                            onChange={(e) => {
                              setMobileNo(e.target.value);
                            }}
                            onBlur={() => {
                              simpleValidator.current.showMessageFor(
                                "mobileNo"
                              );
                            }}
                          /> */}
                          <InternationalNumber
                            value={mobileNo}
                            setCountryCode={setCountryCode}
                            onChange={(v) => {
                              setMobileNo(v);
                            }}
                            tabIndex="2"
                            onBlur={()=> {
                              simpleValidator.current.showMessageFor("mobileNo");
                            }}
                          />
                          {simpleValidator.current.message(
                            "mobileNo",
                            mobileNo,
                            "required|numeric|min:1|max:15",
                            {
                              message: {
                                numeric: "Mobile Number must be numeric",
                              },
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row form-row justify-content-center">
                    <div className="col-md-7">
                      <div className="position-relative">
                        <div className="material input">
                          <input
                            type="text"
                            tabIndex="3"
                            value={email}
                            placeholder="Email*"
                            className="input"
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                            onBlur={() => {
                              simpleValidator.current.showMessageFor("email");
                            }}
                          />

                          {simpleValidator.current.message(
                            "email",
                            email,
                            "required|email"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row form-row justify-content-center">
                    <div className="col-md-7">
                      <div className="position-relative">
                        <div className="material input">
                          <input
                            type="text"
                            tabIndex="4"
                            value={subject}
                            name="subject"
                            id="subject"
                            className="input"
                            placeholder="Subject*"
                            onChange={(e) => {
                              setSubject(e.target.value);
                            }}
                            onBlur={() => {
                              simpleValidator.current.showMessageFor("subject");
                             
                            }}
                          />

                          {simpleValidator.current.message(
                            "subject",
                            subject,
                            "required"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row form-row justify-content-center">
                  <div className="col-md-7">
                    <div className="position-relative">
                      <div className="material input">
                      <input type="text" tabIndex="5" value={message} name="message" id="message" className="input"
                          placeholder="Message*"
                            onChange={(e) => {
                              setMessage(e.target.value);
                              }
                          }   
                            onBlur={() => {
                              simpleValidator.current.showMessageFor('message');
                          }}
                        />
                        <p>{simpleValidator.current.message('message', message, 'required')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                  <br />
                  <div
                    className="row form-row justify-content-center"
                    id="contact_captcha_div"
                  >
                    <div className="col-md-3" style={{ minHeight: 65 }}>
                      <div className="position-relative">
                        <div id="captcha_block">
                          <img
                            src={captchaImg}
                            style={{ float: "left" }}
                            draggable="false"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="position-relative">
                        <img
                          onClick={getCaptcha}
                          className="refresh_captcha"
                          src={refresh_captcha} 
                          draggable="false"
                        />
                      </div>
                    </div>
                    <br />
                    <div className="col-md-7">
                    <div className="position-relative">
                      <div className="material input">
                      <input type="text" tabIndex="6"  placeholder="Captcha*" value={captchaVal} className="input"
                          onChange={(e) => {
                              setCaptchaVal(e.target.value);
                              }
                          }  
                          onBlur={() => {
                            simpleValidator.current.showMessageFor('captchaVal');
                            forceUpdate(1);
                          }}
                          />
                          <p>{simpleValidator.current.message('captchaVal', captchaVal, ['required',{in:captcha}],{messages:{in:'Please enter valid captcha code',required:'Please enter captcha'}})}</p>
                      </div>
                    </div>
                  </div>
                  </div>
                  <div className="row form-row justify-content-center mt-2">
                    <div className="col">
                      <div className="btn-container text-center">
                        <button
                          type="submit"
                          id="contact"
                          className="default-btn"
                          style={{
                            backgroundColor : "#042b62"
                          }}
                          tabIndex="7"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
              <div
                className="form-success-msg text-center"
                id="form-success-msg"
                style={{ display: showThankyou ? "block" : "none" }}
              >
                <img
                  src={imagePath + "/static/media/Images/assets/img/reports/thank-you-illustration.svg"}
                  alt=""
                  className="form-illustration"
                />
                <h2 className="m-0">Thank you for Contacting us!</h2>
                <p>We will be in touch with you Shortly.</p>
              </div>
              <div
                className="form-success-msg text-center"
                id="form-error-msg"
                style={{ display: "none" }}
              >
                <h1>Something went wrong!!</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <UAEFooter />
    </div>
  );
}

export default Contactus;
