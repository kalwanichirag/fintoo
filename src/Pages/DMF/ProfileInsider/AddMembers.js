import { useEffect, useState, useRef } from "react";
import ProfileInsiderLayout from "../../../components/Layout/ProfileInsiderLayout";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Form, Modal } from "react-bootstrap";
import OTPInput from "otp-input-react";
import MobileOTP from "./MobileOTP";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
  DATA_BELONGS_TO,
  userManagementEndpoints
} from "../../../constants";
import SimpleReactValidator from "simple-react-validator";
import {
  getParentUserId,
  getUserId,
  isValidEmail,
  loginRedirectGuest,
  setMemberId,
} from "../../../common_utilities";
import { useNavigate, useSearchParams } from "react-router-dom";
import SweetAlert from "sweetalert-react";
import FintooLoader from "../../../components/FintooLoader";
import Cookies from "js-cookie";
import Select, { components } from "react-select";
import { addFamilyMember, checkEmail, checkMobile, getFamilyMember1, getRelationList, sendMail, sendSMS } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";

const AddMembers = (props) => {
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [searchParams] = useSearchParams();

  const hiddenDivRef = useRef(null);
  const newMemberIdRef = useRef(null);
  const [mobileNumber, setMobilenumber] = useState("");
  const [mail, setMail] = useState("");
  const [relation, setRelation] = useState("");
  const [show, setShow] = useState(false);
  const [otpData, setOtpData] = useState({ sms: "", email: "" });
  const [mailVerify, setmailVerify] = useState(false);
  const [inputDataVisibility, setInputDataVisibility] = useState({
    showMobInput: false,
    showEidInput: false
  });
  const [showOTP, setShowOTP] = useState({
    showMobOtp: false,
    showEmailOtp: false
  });
  const [generatedOTP, setGeneratedOTP] = useState({
    generatedSmsOTP: "",
    generatedEmailOTP: ""
  });
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  const [error, setError] = useState({});
  const [name, setname] = useState("")
  const [errors, setErrors] = useState({});
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [mobileBelongsTo, setMobileBelongsTo] = useState([]);
  const [emailBelongsTo, setEmailBelongsTo] = useState([]);
  const [selectedEmailCode, setSelectedEmailCode] = useState(1);
  const [selectedMobileCode, setSelectedMobileCode] = useState(1);
  const token = Cookies.get('token');
  const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
  let userid = user_data.user_id;
  const navigate = useNavigate();

  useEffect(() => {
    setIsComponentLoaded(true);
    fetchRelationshipList();
  }, []);


  useEffect(() => {
    setIsComponentLoaded(true);
  }, []);

  useEffect(() => {
    if (isComponentLoaded === false) return;
    validateMobile();
  }, [mobile, selectedMobileCode]);

  const validateMobile = async () => {
    let err = 0;
    if (mobile === "") {
      err++;
      setErrors((v) => {
        return { ...v, mobile: "Mobile is required." };
      });
    } else if ("123450".indexOf(mobile[0]) > -1) {
      err++;
      setErrors((v) => {
        return { ...v, mobile: "Enter valid mobile number." };
      });
    } else if (mobile.length != 10) {
      err++;
      setErrors((v) => {
        return { ...v, mobile: "Enter valid 10 digit mobile number." };
      });
    } else {
      setErrors((v) => {
        return { ...v, mobile: undefined };
      });
    }
    if (err == 0) {
      checkDuplicateMobile();
    }
  };

  useEffect(() => {
    if (isComponentLoaded === false) return;
    validateEmail();
  }, [email, selectedEmailCode]);

  const validateEmail = () => {
    let err = 0;
    if (email === "") {
      err++;
      setErrors((v) => {
        return { ...v, email: "Email is required." };
      });
    } else if (isValidEmail(email) == false) {
      err++;
      setErrors((v) => {
        return { ...v, email: "Enter valid email id." };
      });
    } else {
      setErrors((v) => {
        return { ...v, email: undefined };
      });
    }
    if (err == 0) {
      checkDuplicateEmail();
    }
  };

  useEffect(() => {
    checkDuplicateEmail();
  }, [selectedEmailCode]);

  useEffect(() => {
    checkDuplicateMobile();
  }, [selectedMobileCode]);

  useEffect(() => {
    if (emailBelongsTo.length > 0 && !selectedEmailCode) {
      setSelectedEmailCode(1); // default to "Self"
    }
  }, [emailBelongsTo]);

  useEffect(() => {
    // once the data is loaded, set default if not already set
    if (mobileBelongsTo.length > 0 && !selectedMobileCode) {
      setSelectedMobileCode(1); // "Self"
    }
  }, [mobileBelongsTo]);

  const checkDuplicateMobile = async () => {
    if (!mobile || mobile.trim() === "") return;

    try {
      const payload = {
        mobile: mobile,
        data_belongs_to: DATA_BELONGS_TO
      };

      const response = await checkMobile(payload);

      if (response.status_code === "404") {
        setErrors((prevState) => ({
          ...prevState,
          mobile: "",
        }));
      } else {
        setErrors((prevState) => ({
          ...prevState,
          mobile: response.message,
        }));
      }

    } catch (err) {
      console.log("Error in checkDuplicateMobile:", err);
    }
  };

  const fetchRelationshipList = async () => {
    try {
      const response = await axios.get(
        `${userManagementEndpoints.GET_RELATION_LIST}`,
        {}
      );

      // Set only the actual array to state
      setMobileBelongsTo(response.data.data || []);
      setEmailBelongsTo(response.data.data || []);
    } catch (error) {
      console.error("Error fetching relationships:", error);
    }
  };

  const checkDuplicateEmail = async (str = "") => {
    if (Boolean(errors.email)) return;
    if (email.trim() === "") return;

    try {
      const payload = {
        email: str || email,
        data_belongs_to: DATA_BELONGS_TO
      };

      const response = await checkEmail(payload);

      if (response.status_code == 404) {
        setErrors((prevState) => ({
          ...prevState,
          email: "",
        }));
      } else {
        setErrors((prevState) => ({
          ...prevState,
          email: response.message,
        }));
      }
    } catch (err) {
      console.log("Error in checkDuplicateEmail:", err);
    }
  };


  const [relations, setRelations] = useState([]);

  // const ShowOTPData = () => setShowOTP(true);
  const ShowOTPData = () => {
    setShowOTP({ showMobOtp: true });
  }
  const ShowmailOTPData = () => {
    setShowOTP({ showEmailOtp: true });
  }
  // const ShowOTPDEmata = () => setShowEmOTP(true);
  const timer = useRef({ obj: null, counter: 0, default: 30 });
  const timer1 = useRef({ obj: null, counter: 0, default: 30 });
  const [count, setCount] = useState(timer.current.default);
  const [countEmail, setCountEmail] = useState(timer1.current.default);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [user_name, setusername] = useState("")

  useEffect(() => {
    timer.current.counter = timer.current.default;
    timer1.current.counter = timer1.current.default;
  }, []);

  const startTimer = () => {
    showHiddenDiv();
    clearInterval(timer.current.obj);
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
  const startTimer1 = () => {
    showHiddenDiv();
    clearInterval(timer1.current.obj);
    timer1.current.obj = setInterval(() => {
      if (timer1.current.counter > 0) {
        timer1.current.counter = timer1.current.counter - 1;
        setCountEmail(timer1.current.counter);
      } else {
        clearInterval(timer1.current.obj);
        timer1.current.counter = timer1.current.default;
      }
    }, 1000);
  };

  useEffect(() => {
    var parent_user_id = getUserId();
    if (parent_user_id == null || parent_user_id == "") {
      loginRedirectGuest();
    }
    if (getUserId() != getParentUserId()) {
      if (searchParams.get("update")) {
        return;
      } else {
        window.location =
          process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard";
      }
    }
  }, []);

  var parent_user_id = getUserId();

  const fetchValidateemail = async () => {
    try {

      const url = `${userManagementEndpoints.CHECK_EMAIL}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `token ${token}`,
        },
        body: JSON.stringify(urldata),
      });

      const validateEmail = await response.json();

      if (validateEmail.status_code === 200) {
        return;
      }

      if (validateEmail.message !== "User Email and UserId Match...!!") {
        setFakeEmailMsg("");
      } else if (getUserId() !== getParentUserId()) {
        setDuplicateParentEmail("");
      }

    } catch (err) {
      console.log("Error in fetchValidateemail:", err);
    }
  };

  const fetchAddMemberData = async () => {
    try {
      const formValid = simpleValidator.current.allValid();
      simpleValidator.current.showMessages();
      forceUpdate(1);
      if (!formValid) return;

      let urladdmemdata = {};
      let getParentUserId1 = getParentUserId()
      let getUserId1 = getUserId()

      if (getParentUserId1 === getUserId1) {
        urladdmemdata = {
          parent_user_id: getUserId(),
          relation_id: relation,
          email: email,
          mobile: mobile,
          email_declaration_code: selectedEmailCode,
          mobile_declaration_code: selectedMobileCode
          // id: getParentUserId(),
        };
      }
      // else if (searchParams.get("update") == 1) {
      //   urladdmemdata = {
      //     id: getParentUserId(),
      //     member_user_id: getUserId(),
      //     parent_user_id: getParentUserId(),
      //     email,
      //     mobile,
      //     relation_id: relation,
      //     type: "update",
      //     email_declaration_code: selectedEmailCode,
      //     mobile_declaration_code: selectedMobileCode
      //   };
      // }

      const response = await addFamilyMember(urladdmemdata);

      if (response.status_code === 200) {
        await getRelations();
        newMemberIdRef.current = response.data?.user_id;
        localStorage.setItem('user_data', JSON.stringify(response.data));
        setOpenConfirm(true);
      }

    } catch (e) {
      console.log("Error in fetchAddMemberData:", e);
    }
  };

  const fetchSms = async () => {
    try {
      var sms_api_id = "fintoo_otp";
      var otp = Math.floor(Math.random() * 90000) + 10000;
      setGeneratedOTP(otp);

      var msg = "Greetings from Fintoo! Your OTP verification code is " + otp;
      var whatsapptext = "Greetings from Fintoo! Your OTP verification code is : " + otp;

      var urlsms = {
        mobile: mobile,
        msg: msg,
        sms_api_id: "fintoo_otp"
      };

      const response = await sendSMS(urlsms);

      var name = "User"; //result.data;
      setname(name);

    } catch (e) {
      console.log("err", e);
    }
  };

  const fetchMail = async () => {
    try {
      var otp = Math.floor(Math.random() * 90000) + 10000;
      setGeneratedOTP(otp);

      var urlmail = {
        userdata: {
          to: email,
        },
        subject: "Fintoo - Verification for adding New Member Account",
        template: "otp_message_template.html",
        contextvar: {
          otp: otp,
          name: name ? name : "User",
        },
      };

      const response = await sendMail(urlmail);

    } catch (e) {
      console.log("err", e);
    }
  };


  useEffect(() => {
    getRelations();
    fetchMembers();
    // checkUserData();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  // const checkUserData = async () => {
  //   setIsLoading(true);
  //   var userData = await fetchUserData(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);
  //   if (getUserId() != getParentUserId() && userData.dob && ((userData.mobile && userData.email) || (userData.guardian_email && userData.guardian_mobile))) {
  //     window.location = process.env.PUBLIC_URL + "/direct-mutual-fund/profile";
  //   }
  // };

  useEffect(() => {
    fetchValidateemail();
  }, [mail]);

  const getRelations = async () => {
    try {

      const response = await getRelationList();
      if (response.status_code === "200") {
        setRelations(response.data);
      }
    } catch (e) {
      console.log("Error in getRelations:", e);
    }
  };


  const fetchMembers = async () => {
    try {

      // const url = `${userManagementEndpoints.GET_FAMILY_MEMBER}?user_id=${userid}`;

      // const response = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Authorization": `token ${token}`,
      //   },
      // });
      let response = await getFamilyMember1(userid);
      
      const r = response;

      r.data.map(item => {
        if (item.parent_user_id == "0") {
          var u_name = item['NAME'];
          var l_name = item['last_name'];
          setusername(u_name + ' ' + l_name);
        }
      });

      handleParentdata(r);

      const all = r.data.map((v) => ({
        id: v.id,
        email: v.fdmf_email ? v.fdmf_email : "",
        mobile: v.mobile ? v.mobile : "",
        relation: v.relation,
        parent_id: parent_user_id,
      }));

      if (all != "" || all != null) {
        const a = all.filter((v) => v.id == getUserId());

        if (typeof a == "object" && a.length) {
          setMobile(a[0].mobile > 0 ? a[0].mobile : "");
          setEmail(a[0].email);
          setRelation(a[0].relation);

          if (a[0].email) {
            setTimeout(() => {
              checkDuplicateEmail(a[0].email);
            }, 1000);
          }
        }

        if (searchParams.get("update") == null) {
          setMobile("");
          setEmail("");
          setRelation("");
        }
      }

    } catch (e) {
      console.log("err ", e);
    }
  };


  const handleParentdata = (Rdata) => {
    var getarray1 = Rdata.data.filter((obj) => {
      return obj.parent_user_id == 0;
    });
    // setParent(getarray1);
  };

  useEffect(() => {
    if (otpData.email && otpData.email.length > 4 && generatedOTP !== parseInt(otpData.email)) {
      setError({ otpData: "Please provide a valid OTP for email." });
    } else if (otpData.email && otpData.email.length > 4 && generatedOTP === parseInt(otpData.email)) {
      setShowOTP({ ...showOTP, showEmailOtp: false });
      setInputDataVisibility(prevState => ({
        ...prevState,
        showEidInput: !prevState.showEidInput
      }));
    } else {
      setError({});
    }
  }, [otpData.email]);


  useEffect(() => {
    if (otpData.sms && otpData.sms.length > 4 && generatedOTP !== parseInt(otpData.sms)) {
      setError({ otpData: "Please provide a valid SMS OTP." });
    } else if (otpData.sms && otpData.sms.length > 4 && generatedOTP === parseInt(otpData.sms)) {
      setShowOTP({ ...showOTP, showMobOtp: false });
      setInputDataVisibility(prevState => ({
        ...prevState,
        showMobInput: !prevState.showMobInput
      }));

    } else {
      setError({});
    }
  }, [otpData.sms]);


  const showHiddenDiv = () => {
    hiddenDivRef.current.style.display = "block";
    setTimeout(() => {
      hiddenDivRef.current.style.display = "none";
    }, 1000);
  };
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        {/* <span style={{ color: "black", fontSize: "14px" }}>v</span> */}
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            marginRight: "6px",
            borderLeft: "2px solid black",
            borderBottom: "2px solid black",
            transform: "rotate(-45deg)", // makes it look like ▼ outline
          }}
        />
      </components.DropdownIndicator>
    );
  };
  return (
    <ProfileInsiderLayout>
      <FintooLoader isLoading={isLoading} />
      <SweetAlert
        show={openConfirm}
        title="Member Added Successfully!"
        text="Please complete member's profile."
        showCancelButton={true}
        onConfirm={() => {
          setMemberId(newMemberIdRef.current);
          localStorage.removeItem('family');
          localStorage.removeItem('logged_in');
          setTimeout(() => {
            window.location = "/direct-mutual-fund/profile/dashboard";
          }, 500);
        }}
        onCancel={() => {
          setTimeout(() => {
            window.location = "/direct-mutual-fund/funds/all";
          }, 100);
        }}
        confirmButtonText="Continue"
        cancelButtonText="Later"
        customClass={{
          confirmButton: 'confirm-button',
          cancelButton: 'cancel-button'
        }}
      />
      <ToastContainer limit={1} />
      <div
        ref={hiddenDivRef}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          top: 0,
          left: 0,
          display: "none",
        }}
      ></div>
      <>
        <div className="ProfileDashboard">
          <div className="ml-10 md:mt-14 mt-4 p-2 md:p-3 rounded-3xl">
            <div className="text-label-info">
              <Row>
                <Col xs={12} lg={12}>
                  <Row>
                    {searchParams.get("update") == 1 ? (
                      <Col>
                        <div className="col-12 col-lg-8">
                          <div className="text-nominee">
                            <p className="text-label">Update Members</p>
                            <span className="bank-label">
                              Update member to your Fintoo Account
                            </span>
                          </div>
                        </div>
                        <p className="Hrline mt-3"></p>
                      </Col>
                    ) : (
                      <Col>
                        <div className="col-12 col-lg-8">
                          <div className="text-nominee">
                            <p className="text-label">Add New Members</p>
                            <span className="bank-label">
                              Add member to your Fintoo Account
                            </span>
                          </div>
                        </div>
                        <p className="Hrline mt-3"></p>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            </div>
            <div className="add-member-field desktopview">
              <Row>
                <Col xs={12} lg={9}>
                  <Row>
                    <Col xs={6} lg={12}>
                      <Row>
                        <Col xs={12} lg={2}>
                          <label className="text-label">Mobile No.</label>
                        </Col>

                        <Col xs={12} lg={3}>
                          <input
                            maxLength={10}
                            type="text"
                            className="w-100"
                            value={mobile}
                            onChange={(e) => {
                              setMobile(e.target.value.replace(/[^0-9]+/g, ""));
                            }}
                            disabled={showOTP.showMobOtp || inputDataVisibility.showMobInput}
                          />
                        </Col>

                        {/* <Col xs={12} lg={2}>
                          <label className="text-label">Belongs To</label>
                        </Col>

                        <Col xs={12} lg={2} className="b-layout ">
                          <Form.Select
                            aria-label="Default select example"
                            className="shadow-none"
                            required
                            value={selectedMobileCode}
                            onChange={(e) => setSelectedMobileCode(e.target.value)}
                          >
                            {mobileBelongsTo.map((v, idx) => (
                              <option key={idx} value={v.relation_id}>
                                {v.relation_name}
                              </option>
                            ))}
                          </Form.Select>
                        </Col> 
                        */}

                        <Col>
                          {inputDataVisibility.showMobInput ? (
                            <>
                              <img
                                style={{
                                  width: "20px",
                                }}
                                src={process.env.REACT_APP_STATIC_URL + "media/DMF/tick.svg"}
                              />
                            </>
                          ) : (
                            <>
                              <button
                                disabled={Boolean(
                                  mobile == "" || errors.mobile || showOTP.showMobOtp
                                )}
                                className="amt-Save mt-0 ml-2"
                                onClick={() => {
                                  ShowOTPData();
                                  startTimer();
                                  fetchSms();
                                }}
                              >
                                Verify
                              </button>
                            </>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {Boolean(errors.mobile) && (
                    <div className="error">{errors.mobile}</div>
                  )}

                  <Row>
                    {showOTP.showMobOtp ? (
                      <>
                        <Col className="mt-5">
                          <Row>
                            <Col xs={6} lg={2}>
                              <p className="Otp-text">
                                Verify Mobile Number with OTP
                              </p>
                            </Col>
                            <Col xs={6} lg={8}>
                              <div
                                id="otp"
                                className="inputs d-flex flex-row  mt-2 "
                              >
                                <OTPInput
                                  value={otpData.sms}
                                  onChange={(otp) => setOtpData({ ...otpData, sms: otp })}
                                  autoFocus
                                  className="rounded rounded-otp"
                                  OTPLength={5}
                                  otpType="number"
                                  disabled={false}
                                />

                                {count == 0 && (
                                  <label
                                    className="Otp-resend-text mt-0 ml-2"
                                    onClick={() => {
                                      startTimer()
                                      fetchSms();
                                      setOtpData("");
                                      // setOtpData({ sms: "", ...otpData });
                                      toast.success(
                                        "OTP has been sent successfully",
                                        {
                                          position:
                                            toast.POSITION.BOTTOM_LEFT,
                                          autoClose: 2000,
                                        }
                                      );
                                    }}
                                  >
                                    Resend OTP
                                  </label>
                                )}
                                {count > 0 && (
                                  <label
                                    className="Otp-resend-text mt-0 ml-2"
                                    style={{
                                      cursor: "not-allowed",
                                    }}
                                  >
                                    Resend OTP in &nbsp;
                                    <strong>
                                      {count > 120 ? count : +count} Sec.
                                    </strong>
                                  </label>
                                )}
                              </div>
                            </Col>
                            {error.otpData && (
                              <p className="error">{error.otpData}</p>
                            )}
                          </Row>
                        </Col>
                      </>
                    ) : (
                      <></>
                    )}
                  </Row>
                </Col>
              </Row>
              <div className="add-member-data-field email-data">
                <Row>
                  <Col xs={12} lg={9}>
                    <Row>
                      <Col xs={6} lg={12}>
                        <Row>
                          <Col xs={12} lg={2}>
                            <label className="text-label">Email ID</label>
                          </Col>
                          <Col xs={12} lg={3}>
                            <input
                              className="email w-100"
                              type="email"
                              maxLength={40}
                              autoComplete="off"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onBlur={() => checkDuplicateEmail()}
                              disabled={showOTP.showEmailOtp || inputDataVisibility.showEidInput}

                            />
                          </Col>

                          {/* <Col xs={12} lg={2}>
                            <label className="text-label">Belongs To</label>
                          </Col>

                          <Col xs={12} lg={2} className="b-layout">
                            <Form.Select
                              aria-label="Default select example"
                              className="shadow-none"
                              required
                              value={selectedEmailCode}
                              onChange={(e) => setSelectedEmailCode(e.target.value)}
                            >
                              {emailBelongsTo.map((v, idx) => (
                                <option key={idx} value={v.relation_id}>
                                  {v.relation_name}
                                </option>
                              ))}
                            </Form.Select>
                          </Col> */}

                          <Col>
                            {inputDataVisibility.showEidInput ? (
                              <>
                                <img
                                  style={{
                                    width: "20px",
                                  }}
                                  src={process.env.REACT_APP_STATIC_URL + "media/DMF/tick.svg"}
                                />
                              </>
                            ) : (
                              <>
                                <button
                                  disabled={Boolean(
                                    email == "" || errors.email || showOTP.showEmailOtp
                                  )}
                                  className="amt-Save mt-0 ml-2"
                                  onClick={() => {
                                    ShowmailOTPData();
                                    startTimer1();
                                    fetchMail();
                                  }}
                                >
                                  Verify
                                </button>
                              </>
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    {Boolean(errors.email) && (
                      <div className="error">{errors.email}</div>
                    )}
                    <Row>
                      {showOTP.showEmailOtp ? (
                        <>
                          <Col className="mt-5">
                            <Row>
                              <Col xs={6} lg={2}>
                                <p className="Otp-text">
                                  Verify Email ID with OTP
                                </p>
                              </Col>
                              <Col xs={6} lg={8}>
                                <div
                                  id="otp"
                                  className="inputs d-flex flex-row  mt-2 "
                                >
                                  <OTPInput
                                    value={otpData.email}
                                    onChange={(otp) => setOtpData({ ...otpData, email: otp })}
                                    autoFocus
                                    className="rounded rounded-otp"
                                    OTPLength={5}
                                    otpType="number"
                                    disabled={false}
                                  // secure
                                  />
                                  {countEmail == 0 && (
                                    <label
                                      className="Otp-resend-text mt-0 ml-2"
                                      onClick={() => {
                                        startTimer1();
                                        setOtpData("");
                                        fetchMail();
                                        toast.success(
                                          "OTP has been sent successfully",
                                          {
                                            position:
                                              toast.POSITION.BOTTOM_LEFT,
                                            autoClose: 2000,
                                          }
                                        );
                                      }}
                                    >
                                      Resend OTP
                                    </label>
                                  )}
                                  {countEmail > 0 && (
                                    <label
                                      className="Otp-resend-text mt-0 ml-2"
                                      style={{
                                        cursor: "not-allowed",
                                      }}
                                    >
                                      Resend OTP in &nbsp;
                                      <strong>
                                        {countEmail > 120
                                          ? countEmail
                                          : +countEmail}{" "}
                                        Sec.
                                      </strong>
                                    </label>
                                  )}
                                </div>
                              </Col>
                              {error.otpData && (
                                <p className="error">{error.otpData}</p>
                              )}
                            </Row>
                          </Col>
                        </>
                      ) : null}
                    </Row>
                  </Col>
                </Row>
              </div>
              <div
                style={{
                  marginTop: "2em",
                }}
              ></div>
              <div className="Relational-data">
                <Row>
                  <Col xs={12} lg={9}>
                    <>
                      <Col xs={12} lg={12}>
                        <Row>
                          <Col xs={12} lg={4}>
                            <label className="text-label">
                              Relationship with Primary Holder
                            </label>
                          </Col>
                          <Col>
                            {/* <Form.Select
                              className="w-50"
                              aria-label="Default select example"
                              placeholder="Select"
                              value={relation}
                              onChange={(e) => setRelation(e.target.value)}
                            >
                              <option>Select</option>
                              {relations.map((v) => (
                                <option value={v.relation_id}>
                                  {v.relation_name}
                                </option>
                              ))}
                            </Form.Select> */}
                            <Select
                              options={relations.map((v) => ({
                                value: v.relation_id,
                                label: v.relation_name,
                              }))}
                              value={relations
                                .map((v) => ({ value: v.relation_id, label: v.relation_name }))
                                .find((opt) => opt.value === relation)}
                              onChange={(selectedOption) => setRelation(selectedOption.value)}
                              placeholder="Select"
                              menuPlacement="bottom"
                              menuPosition="fixed"
                              components={{
                                DropdownIndicator,   // custom arrow
                                IndicatorSeparator: () => null, // 🔹 removes left-side line
                              }}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  width: "250px",              // 🔹 smaller width
                                  border: "none",              // remove all borders
                                  borderBottom: "1px solid #ccc", // only bottom border
                                  borderRadius: "0",           // flat edges
                                  boxShadow: "none",           // remove focus outline shadow
                                  minHeight: "32px",           // make it more compact
                                }),
                                valueContainer: (base) => ({
                                  ...base,
                                  padding: "0 8px",            // tighter spacing inside
                                }),
                                indicatorsContainer: (base) => ({
                                  ...base,
                                  padding: "0",                // remove extra spacing for dropdown arrow
                                }),
                              }}
                            />

                          </Col>
                        </Row>
                      </Col>
                    </>
                  </Col>
                </Row>
                {
                  <button
                    disabled={
                      !(inputDataVisibility.showMobInput && inputDataVisibility.showEidInput && (relation !== 'Select' && relation !== ""))
                    }
                    className="amt-Save"
                    onClick={() => fetchAddMemberData()}
                  >
                    Confirm
                  </button>
                }
              </div>
            </div>

            <div className="mobile-view-add-member-field">
              <div className="row">
                <div className="col-12 d-flex">
                  <div className="col-8 add-member-data-field">
                    <div>
                      <label className="text-label">Mobile No.</label>
                    </div>
                    <div>
                      <input
                        className=""
                        maxLength={10}
                        type="number"
                        value={mobileNumber}
                        onChange={(e) => {
                          const newMobilenumber = e.target.value.replace(
                            /[^0-9\s]/g,
                            ""
                          );
                          setMobilenumber(newMobilenumber);
                        }}
                        name=""
                        id=""
                        disabled={showOTP.showMobOtp}
                      />
                    </div>
                  </div>
                  <div>
                    {
                      <button
                        onClick={() => setShow(true)}
                        disabled={!mobileNumber || showOTP.showMobOtp}
                        className="amt-verify ml-2"
                      >
                        Verify
                      </button>
                    }
                  </div>
                </div>
                <div className="col-12 d-flex">
                  <div className="col-8 add-member-data-field">
                    <div>
                      <label className="text-label">Email ID</label>
                    </div>
                    <div>
                      <input
                        className="email"
                        type="email"
                        name=""
                        value={mail}
                        onChange={(e) => {
                          setMail(e.target.value);
                        }}
                        id=""
                        autoComplete="off"
                        disabled={showOTP.showEmailOtp}
                      />
                    </div>
                  </div>
                  <div>
                    {mailVerify ? (
                      <img
                        className="verifyOTP"
                        style={{
                          width: "21px",
                          marginTop: "2em",
                        }}
                        src={process.env.REACT_APP_STATIC_URL + "media/DMF/tick.svg"}
                        alt="Verify"
                      />
                    ) : (
                      <button
                        onClick={() => setmailVerify(true)}
                        disabled={!mail || showOTP.showEmailOtp}
                        className="amt-verify ml-2"
                      >
                        Verify
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-12">
                  <div className="col-12 add-member-data-field">
                    <div>
                      <label className="text-label">
                        Relationship with Primary Holder
                      </label>
                    </div>
                    <Form.Select
                      className="w-50"
                      aria-label="Default select example"
                      placeholder="Select.."
                    >
                      <option>Select..</option>
                      <option>1</option>
                      <option value="1">2</option>
                    </Form.Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={show} onHide={() => setShow(false)}>
          <MobileOTP />
        </Modal>
      </>
    </ProfileInsiderLayout>
  );
};

export default AddMembers;