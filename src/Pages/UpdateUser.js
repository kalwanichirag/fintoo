import { useEffect, useState, useRef } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Modal } from "react-bootstrap";
import OTPInput from "otp-input-react";
import { ToastContainer, toast } from "react-toastify";
import SimpleReactValidator from "simple-react-validator";
import { useNavigate } from "react-router-dom";
import SweetAlert from "sweetalert-react";
import Cookies from "js-cookie";
import {
    DATA_BELONGS_TO,
    DMF_BASE_URL,
    userManagementEndpoints
} from "../constants";
import {
    fetchEncryptData,
    getParentUserId,
    getUserId,
    isValidEmail
} from "../common_utilities";
import MobileOTP from "./DMF/ProfileInsider/MobileOTP";
const token = Cookies.get('token');
const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
const userName = user_data?.user_name || '';

const UpdateUser = () => {
    const simpleValidator = useRef(new SimpleReactValidator());
    const [, forceUpdate] = useState();

    const hiddenDivRef = useRef(null);
    const [mobileNumber, setMobilenumber] = useState("");
    const [mail, setMail] = useState("");
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
    const [errors, setErrors] = useState({});
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [familyMembers, setFamilyMembers] = useState([]);

    const navigate = useNavigate();


    useEffect(() => {
        setIsComponentLoaded(true);
    }, []);

    useEffect(() => {
        if (isComponentLoaded === false) return;
        validateMobile();
    }, [mobile]);

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
    };

    useEffect(() => {
        if (isComponentLoaded === false) return;
        validateEmail();
    }, [email]);

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
    };

    const checkDuplicateMobile = async () => {
        try {
            const url = `${userManagementEndpoints.CHECK_MOBILE}`;

            const payload = {
                mobile: mobile,
                data_belongs_to: DATA_BELONGS_TO
            };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `token ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const r = await response.json();
            if (r.status_code !== '200') {
                setErrors((prevState) => ({
                    ...prevState,
                    mobile: "",
                }));
                return
            }
            ShowOTPData();
            startTimer()
            fetchSms();
        } catch (err) {
            console.log("Error in checkDuplicateMobile: ", err);
        }
    };

    const checkDuplicateEmail = async (str = "") => {
        try {
            const url = `${userManagementEndpoints.CHECK_EMAIL}`;

            const payload = {
                email: str || email,
                data_belongs_to: DATA_BELONGS_TO
            };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `token ${token}`
                },
                body: JSON.stringify(payload),
            });

            const r = await response.json();

            if (r.status_code !== "200") {
                setErrors((prevState) => ({
                    ...prevState,
                    email: "",
                }));
                return;
            }
            ShowmailOTPData();
            startTimer1();
            fetchMail();
        } catch (err) {
            console.log("Error in checkDuplicateEmail:", err);
        }
    };

    const ShowOTPData = () => {
        setShowOTP({ showMobOtp: true });
    }
    const ShowmailOTPData = () => {
        setShowOTP({ showEmailOtp: true });
    }

    const timer = useRef({ obj: null, counter: 0, default: 30 });
    const timer1 = useRef({ obj: null, counter: 0, default: 30 });
    const [count, setCount] = useState(timer.current.default);
    const [countEmail, setCountEmail] = useState(timer1.current.default);
    const [openConfirm, setOpenConfirm] = useState(false);

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

    const fetchValidateemail = async () => {
        try {
            var config = {
                method: "post",
                url: DMF_BASE_URL + "api/user/validateemail",
                data: urldata,
            };
            var validateEmail = await fetchEncryptData(config);

            if (validateEmail.error_code == 102) {
                if (validateEmail.message != "User Email and UserId Match...!!") {
                    setFakeEmailMsg("");
                } else if (getUserId() != getParentUserId()) {
                    setDuplicateParentEmail("");
                }
                return;
            }
        } catch (err) {
            console.log("err ", err);
        }
    };

    const fetchAddMemberData = async () => {
        try {
            var formValid = simpleValidator.current.allValid();
            simpleValidator.current.showMessages();
            forceUpdate(1);
            if (formValid == false) return;
            if (getUserId() == getParentUserId()) {
                alert('Parent is selected')
                return;
            }

            const userDetails = familyMembers.find((member) => member.user_id === getUserId());
            let updateUserObj = {
                "user_id": getUserId(),
                "parent_user_id": getParentUserId(),
                "user_email": userDetails?.user_email,
                "user_mobile": userDetails.mobile_number ? Number(userDetails.mobile_number) : null
            }

            const response = await fetch(userManagementEndpoints.UPDATE_FAMILY_MEMBER, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `token ${token}`
                },
                body: updateUserObj,
            });
            if (response.status_code == 200) {
                setOpenConfirm(true);
            }
        } catch (e) {
            console.log("err ", e);
        }
    };

    const fetchSms = async () => {
        try {
            var sms_api_id = "fintoo_otp";
            var otp = Math.floor(Math.random() * 90000) + 10000;
            setGeneratedOTP(otp);
            var urlsms = {
                msg: "test msg For sms",
                mobile: mobile,
                sms_api_id: sms_api_id
            };

            const response = await fetch(`${userManagementEndpoints.SEND_SMS}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `token ${token}`
                },
                body: JSON.stringify(urlsms)
            });
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
                subject: "Thank You For Requesting For A Callback. We Will Call You Shortly!",
                template: "otp_message_template.html",
                contextvar: { otp: otp, name: userName ? userName : "User" },
            };

            const response = await fetch(`${userManagementEndpoints.SEND_EMAIL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `token ${token}`
                },
                body: JSON.stringify(urlmail)
            });
            const result = await response.json();
        } catch (e) {
            console.log("err", e);
        }
    };

    useEffect(() => {
        if ((getUserId() == getParentUserId()) || Boolean(localStorage.getItem("family"))) {
            return navigate(`${process.env.PUBLIC_URL}/commondashboard`);
        } else {
            fetchMembers();
        }
    }, []);

    useEffect(() => {
        fetchValidateemail();
    }, [mail]);

    const fetchMembers = async () => {
        try {
            const userid = getUserId();
            const url = `${userManagementEndpoints.GET_FAMILY_MEMBER}?user_id=${userid}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `token ${token}`,
                },
            });
            const resp = await response.json();
            if (resp.status_code == 200) {
                setFamilyMembers(resp.data);
                setMobile(resp.data[0].mobile_number ?? "");
                setEmail(resp.data[0].user_email ?? "");
            }
        } catch (e) {
            console.log("err ", e);
        }
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

    const handleUpdateConfirmation = async () => {
        try {
            const url = `${userManagementEndpoints.GET_FAMILY_MEMBER}?user_id=${userid}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `token ${token}`,
                },
            });

            const r = await response.json();
            const all = r.data.map((v) => ({
                name: v.NAME ? v.NAME : v.email,
                id: v.id,
                parent_user_id: v.parent_user_id,
                pan: v.pan,
                mobile: v.mobile,
                email: v.email,
            }));
            // setItemLocal("allMemberUser", [...all]);
            setOpenConfirm(false);
            window.location.href = `${process.env.PUBLIC_URL}/userflow/expert-payment`;
        } catch (e) { }
    }

    return (
        <div className="container-fluid profile-container" style={{ padding: '1rem 0', backgroundColor: 'white' }}>
            <div className="page-profile-inside">
                <div className="profile-container">
                    <SweetAlert
                        show={openConfirm}
                        title="Member Details Updated Successfully!"
                        showCancelButton={false}
                        onConfirm={() => {
                            handleUpdateConfirmation()
                        }}
                        confirmButtonText="Continue"
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
                            <div className="ml-10 md:mt-14 mt-4 p-2 md:p-3 rounded-3xl col-12 col-md-9" style={{ margin: '0 auto' }}>
                                <div className="text-label-info">
                                    <Row>
                                        <Col xs={12} lg={12}>
                                            <Row>
                                                <Col>
                                                    <div className="col-12 col-lg-8">
                                                        <div className="text-nominee">
                                                            <p className="text-label">Update Member Details</p>
                                                            <span className="bank-label">
                                                                Update member to your Fintoo Account
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="Hrline mt-3"></p>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="add-member-field desktopview">
                                    <Row>
                                        <Col >
                                            <Row>
                                                <Col xs={6} lg={8}>
                                                    <Row>
                                                        <Col xs={12} lg={2}>
                                                            <label className="text-label">Mobile No.</label>
                                                        </Col>

                                                        <Col xs={12} lg={5}>
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
                                                                            checkDuplicateMobile()
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
                                                                                    // startTistartTimermer();
                                                                                    fetchSms();
                                                                                    setOtpData("");
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
                                            <Col >
                                                <Row>
                                                    <Col xs={6} lg={8}>
                                                        <Row>
                                                            <Col xs={12} lg={2}>
                                                                <label className="text-label">Email ID</label>
                                                            </Col>
                                                            <Col xs={12} lg={5}>
                                                                <input
                                                                    className="email w-100"
                                                                    type="email"
                                                                    maxLength={40}
                                                                    autoComplete="off"
                                                                    value={email}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                    disabled={showOTP.showEmailOtp || inputDataVisibility.showEidInput}

                                                                />
                                                            </Col>
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
                                                                                checkDuplicateEmail();
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

                                        <button
                                            disabled={
                                                !(inputDataVisibility.showMobInput && inputDataVisibility.showEidInput)
                                            }
                                            className="amt-Save"
                                            onClick={() => fetchAddMemberData()}
                                        >
                                            Confirm
                                        </button>

                                        <button
                                            className="amt-Save"
                                            onClick={() => navigate(`${process.env.PUBLIC_URL}/expert?service=tax-planning`)}
                                            style={{ marginLeft: '1rem' }}
                                        >
                                            Back
                                        </button>

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
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Modal show={show} onHide={() => setShow(false)}>
                            <MobileOTP />
                        </Modal>
                    </>
                </div>
            </div>
        </div >

    );
}
export default UpdateUser;