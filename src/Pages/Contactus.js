import React, { useState, useRef, useEffect } from "react";
import SimpleReactValidator from "simple-react-validator";
// import { ADVISORY_CAPTCHA_API_URL, ADVISORY_CONTACTUS_API_URL, BASE_API_URL  } from "../constants";
import Form from "react-bootstrap/Form";
import commonEncode from '../commonEncode';
import { apiCall, fetchEncryptData } from "../common_utilities";
import FintooLoader from "../components/FintooLoader";
import refresh_captcha from "../Assets/Images/main/refresh_captcha.svg";
import { SendEmail } from "../FrappeIntegration-Services/services/financial-planning-api/ndaflow";
function Contactus() {
  const [captcha, setCaptcha] = useState('')
  const [captchaVal, setCaptchaVal] = useState('')
  const [captchaImg, setCaptchaImg] = useState("");
  const [Name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showThankyou, setShowThankyou] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("main-layout");
    getCaptcha();
  }, []);

  const handleSuccess = () => {
    setShowThankyou(true)

    setTimeout(() => {
      setShowThankyou(false)
    }, 5000);

    setSubject("");
    setEmail("");
    setMessage("");
    setName("");
    setMobileNo("");
    setCaptchaVal("");
    simpleValidator.current.visibleFields = [];
    simpleValidator.current.hideMessages();
    forceUpdate(1)
  };

  const getCaptcha = async () => {
    // try{
    //   setIsLoading(true);
    //   var config = await apiCall(
    //     ADVISORY_CAPTCHA_API_URL,
    //     "",
    //     false,
    //     false
    //   );

    //   if (config!=''){
    //       setIsLoading(false);
    //       setCaptchaImg(
    //         config.captcha_url
    //       );
    //       setCaptcha(atob(config.captchatext));
    //       setCaptchaVal('')
    //   }
    //   }
    // catch(e){
    //   console.log("Erro",e)
    // }
  };

  const contact = async () => {
    try {
      setIsLoading(true);
      let country = "in"
      let mail_subject = "Fintoo will call you back shortly!"

      let admin_subject = "Query received from contact us page - Fintoo Wealth Private Limited"
      let to_mail = email
      let context = { 'name': Name, 'mail_subject': subject, 'mail_message': message }
      let context2 = { "name": Name, "useremail": email, "phone": mobileNo, "subject": mail_subject, "message": message }
      let templatedata = { 'userdata': { 'from': 'support@fintoo.in', 'to': to_mail }, 'subject': mail_subject, 'template': 'contact_mail.html', 'contextvar': context }
      let templatedata2 = { 'userdata': { "from": to_mail, "to": 'support@fintoo.in' }, 'subject': admin_subject, 'template': 'contact_mail_admin.html', 'contextvar': context2, "country": country }
      const response = await SendEmail(templatedata);
      let flag = false;

      if (response["status_code"] === "200") {
        flag = true;
      } else {
        flag = false;
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Failed to deliver email.");
      }
      const admin_response = await SendEmail(templatedata2);
      if (admin_response["status_code"] === "200") {
        flag = true;
      } else {
        // flag = false;
        throw new Error('Failed to deliver email to the admin.');
      }


      if (flag) {
        setIsLoading(false);
        handleSuccess();
      } else {
        setIsLoading(false);
        setError(true);
      }
    } catch (e) {
      console.log("Error")
    }
  }

  const handleSubmit = (event) => {

    event.preventDefault();
    event.stopPropagation();

    var isFormValid = simpleValidator.current.allValid();

    simpleValidator.current.showMessages();
    forceUpdate(1);
    if (isFormValid) {
      contact()
    }

  };

  return (
    <div>
      <FintooLoader isLoading={isLoading} />
      <section
        className="contact-us mt-4"
        ng-controller="contactController"
      >
        <div className="container-fluid">
          <div className="row align-items-center  bg-grey">
            <div className="col-md-6 pr-0 pl-0">
              <div id="map" style={{ paddingLeft: "10%" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.835153482838!2d72.85904261490182!3d19.11488638706561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b723032fffff%3A0x91a61c8dda6c86c3!2sFintoo%20-%20Building%20Trust%20And%20Technology%20In%20Wealth!5e0!3m2!1sen!2sin!4v1650544339559!5m2!1sen!2sin"
                  style={{ border: "none" }}
                  width="100%"
                  height="550px"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <div className="col-md-6 pl-0">
              <div style={{ display: showThankyou == false ? 'block' : 'none' }}>
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
                    <div className="col-md-7">
                      <h2 className="page-header text-center">Send A Message</h2>
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
                        <div className="material input">
                          <input type="text" value={mobileNo} tabIndex="1" placeholder="Mobile Number*" className="input"
                            onChange={(e) => {
                              setMobileNo(e.target.value);
                            }
                            }
                            onBlur={() => {
                              simpleValidator.current.showMessageFor('mobileNo');
                            }}
                          />
                          <p>{simpleValidator.current.message('mobileNo', mobileNo, 'required|numeric|min:10|max:15', { message: { numeric: 'Mobile Number must be numeric' } })}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row form-row justify-content-center">
                    <div className="col-md-7">
                      <div className="position-relative">
                        <div className="material input">
                          <input type="text" tabIndex="1" value={email} placeholder="Email*" className="input"
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }
                            }
                            onBlur={() => {
                              simpleValidator.current.showMessageFor('email');
                            }}
                          />
                          <p>{simpleValidator.current.message('email', email, 'required|email')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row form-row justify-content-center">
                    <div className="col-md-7">
                      <div className="position-relative">
                        <div className="material input">
                          <input type="text" tabIndex="1" value={subject} name="subject" id="subject" className="input"
                            placeholder="Subject*"
                            onChange={(e) => {
                              setSubject(e.target.value);
                            }
                            }
                            onBlur={() => {
                              simpleValidator.current.showMessageFor('subject')
                              forceUpdate(1);
                            }}
                          />
                          <p>{simpleValidator.current.message('subject', subject, 'required')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row form-row justify-content-center">
                    <div className="col-md-7">
                      <div className="position-relative">
                        <div className="material input">
                          <input type="text" tabIndex="1" value={message} name="message" id="message" className="input"
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
                          <img src={captchaImg} style={{ float: "left" }} draggable="false" />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      {/* <div className="position-relative">
                      <img onClick={getCaptcha} className="refresh_captcha" src={refresh_captcha} draggable="false" />
                    </div> */}
                    </div>
                    <br />
                    {/* <div className="col-md-7">
                    <div className="position-relative">
                      <div className="material input">
                      <input type="text" tabIndex="1"  placeholder="Captcha*" value={captchaVal} className="input"
                          onChange={(e) => {
                              setCaptchaVal(e.target.value);
                              }
                          }  
                          onBlur={() => {
                            simpleValidator.current.showMessageFor('captchaVal');
                          }}
                          />
                          <p>{simpleValidator.current.message('captchaVal', captchaVal, ['required',{in:captcha}],{messages:{in:'Please enter valid captcha code',required:'Please enter captcha'}})}</p>
                      </div>
                    </div>
                  </div> */}
                  </div>
                  <div className="row form-row justify-content-center mt-2">
                    <div className="col">
                      <div className="btn-container text-center">
                        <button
                          type="submit"
                          id="contact"
                          className="default-btn"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
              <div className="form-success-msg text-center" id="form-success-msg" style={{ display: showThankyou ? 'block' : 'none' }} >
                <img src={imagePath + "/static/media/Images/assets/img/reports/thank-you-illustration.svg"} alt="" className="form-illustration" />
                <h2 className="m-0">Thank you for Contacting us!</h2>
                <p>We will be in touch with you Shortly.</p>
              </div>
              <div className="form-success-msg text-center" id="form-error-msg" style={{ display: "none" }} >
                <h1>Something went wrong!!</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="address-section ">
        <div className="container mb-5">
          <div className="row d-flex ">
            <div className="col-md-6 ">
              <div className="w-50 m-auto">
                <h2 className="page-header color-blue">Contact Information</h2>
                <ul className="icon-list ">
                  <li className="address">
                    {/* <HiLocationMarker /> */}
                    B/309, Dynasty Business park,
                    <br />Opp Sangam Cinema, Andheri East, <br /> J B Nagar, Mumbai,
                    <br />Maharashtra 400059
                  </li>
                  <li className="call"> +91-9699 800 600</li>
                  <li className="mail">support@fintoo.in</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 ">
              <h2 className="page-header color-blue">Business Hours</h2>
              <ul className="icon-list mt-3">
                <li className="hours">
                  <p>Monday to Saturday - 9 am to 6 pm</p>
                </li>
              </ul>
              <h2 className="page-header color-blue">Get In Touch</h2>
              <p></p>
              <p>
                To become a partner contact us on{" "}
                <a
                  href="mailto:franchise@fintoo.in"
                  className="color-light-green font-bold"
                >
                  franchise@fintoo.in
                </a>
              </p>
              <p />
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
}

export default Contactus;
