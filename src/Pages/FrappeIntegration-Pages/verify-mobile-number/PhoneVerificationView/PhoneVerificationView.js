
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useEffect, useState } from "react";
// import OTPResend from "../Otp/resendOTPComponent";
// import { validateMobile } from "@/library/utils/validations";
import Cookies from "js-cookie";
import { formatTime } from "../../../../Utils/FrappeIntegration-Utils/timeUtils";
import OTPResend from "../../../../components/FrappeIntegration-Components/Otp/resendOTPComponent";
import { OTPInput } from '../../../../components/FrappeIntegration-Components/Otp';
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { validateMobile } from '../../../../Utils/FrappeIntegration-Utils/validations';
import { checkMobile, registerMobile, sendOTP, userLogout, verifyOTP } from '../../../../FrappeIntegration-Services/services/user-management-api/userApiService';
import smartphone from "../../Images/registration/smartphone.svg"
import Concord from "../../Images/registration/Concord.svg"
import styles from './PhoneVerificationView.module.css';
import { useNavigate } from 'react-router-dom';



function formatPhoneNumber(phoneNumber) {

    let cleanNumber = phoneNumber.replace(/\D/g, '');

    if (cleanNumber.length > 10) {
        cleanNumber = cleanNumber.slice(cleanNumber.length - 10);
    }

    const masked = cleanNumber.slice(0, 6).replace(/\d/g, '*') + cleanNumber.slice(6);

    return masked;
}

const toE164Phone = (countryCode, mobile) => {
  if (!countryCode || !mobile) return null;
  return `+${countryCode}${mobile}`;
};


const PhoneInputView = ({ setCurrentView, phoneNo, setPhoneNo, userDetails, isLoading, setLoading }) => {


    const [phoneNoError, setPhoneNoError] = useState('');

    const sendPhoneOTP = async () => {

        if (!validateMobile(phoneNo?.phoneNo)) {

            setPhoneNoError("Please enter a valid mobile No.");
            return;
        }

        try {

            setLoading(true);

            const data = await checkMobile(
                {
                    // mobile: phoneNo.phoneNo,
                    mobile: phoneNo.phoneNo.replace(phoneNo.country_code, ""),
                    country_code: phoneNo.country_code
                }
            );

            if (data.status_code == 404 || data.error_code == 404) {

                const payload = {
                    identifier: phoneNo.phoneNo.replace(phoneNo.country_code, ""),
                    for_otp: "mobile"
                }

                const data = await sendOTP(payload);

                if (data.status_code == 200 || data.error_code == 200) {
                    setCurrentView('PHONEVERIFICATION');
                } else {
                    toastr.options.positionClass = "toast-bottom-left";
                    toastr.error(data.message);
                }

                setLoading(false);
                return;

            }

            if (data.status_code == 200 || data.error_code == 200) {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error('Mobile already exists');
                setLoading(false);
                return;
            }

            setLoading(false);
            return;

        } catch (error) {
            console.error('Failed to check email:', error);
        } finally {

        }
    }

    return (
        <>
            <div className={styles.container}>
                <img
                    src={smartphone}
                    alt="Bottom Left"
                    width={120}
                    height={120}
                    sizes="100vw"
                />
                <h2 className={styles.heading}>
                    Verify your Mobile Number
                </h2>
            </div>

            <div className={styles.formWrapper}>
                <div className="mb-7">
                    <label htmlFor="mobileNumber" className={styles.label}>Mobile Number</label>
                    <PhoneInput
                        inputClass="PhoneInputClass"
                        country={'in'}
                        value={phoneNo?.phoneNo ?? ""}
                        onChange={(phone, country) => setPhoneNo({ phoneNo: phone, country_code: country.dialCode })}
                    />
                    {phoneNoError && <p className={styles.errorText}>{phoneNoError}</p>}
                </div>
                <button className={`${styles.button} ${isLoading ? styles.buttonDisabled : styles.buttonEnabled}`} onClick={() => sendPhoneOTP()}>
                    Send OTP
                </button>
            </div>


            <div className={styles.footer}>
                <span>{userDetails.user_email}</span>
                <span style={{ marginLeft: '0.5rem', color: 'blue', cursor: 'pointer' }} onClick={userLogout}>
                    Sign Out
                </span>
            </div>
        </>
    )
}

const PhoneVerificationCodeView = ({ setCurrentView, phoneNo, userDetails, isLoading, setLoading }) => {

    const [otp, setOtp] = useState(Array(6).fill(""));
    const [otpError, setOtpError] = useState("");

    const verifyPhone = async () => {

        if (otp.includes("")) {
            setOtpError("Please fill OTP correctly.");
            return;
        } else {
            const enteredOtp = otp.join("");

            const payload = {
                identifier: phoneNo.phoneNo.replace(phoneNo.country_code, ""),
                for_otp: "mobile",
                otp: enteredOtp
            }

            setLoading(true);

            const data = await verifyOTP(payload);

            if (data.status_code == 200 || data.error_code == 200) {

                const registerMobilePayload = {
                    user_id: userDetails.user_id,
                    country_code: phoneNo.country_code,
                    mobile: phoneNo.phoneNo.replace(phoneNo.country_code, "")
                }

                const data = await registerMobile(registerMobilePayload);

                if (data.status_code == 200 || data.error_code == 200) {
                    const wePhone = toE164Phone(
                        data.data.country_code,
                        data.data.mobile
                    );

                    webengage.user.setAttribute("we_phone", wePhone);
                    const userData = localStorage.getItem("user_data");

                    if (userData) {
                        const parsedData = JSON.parse(userData);
                        parsedData.mobile_verified = true;
                        localStorage.setItem("user_data", JSON.stringify(parsedData));
                    }

                    setCurrentView('PHONEVERIFICATIONSUCCESS');
                    setLoading(false);
                    return;
                } else {
                    setOtpError(data.message);
                    setLoading(false);
                    return;
                }
            } else {
                setOtpError(data.message);
                setLoading(false);
                return;
            }
        }
    }

    const resendPhoneOTP = async () => {

        setOtp(Array(6).fill(""));
        setOtpError("");

        try {

            const payload = {
                identifier: phoneNo.phoneNo.replace(phoneNo.country_code, ""),
                for_otp: "mobile"
            }

            setLoading(true);

            const data = await sendOTP(payload);

            setLoading(false);

        } catch (error) {
            console.error('Failed to check email:', error);
        } finally {

        }
    }

    return (
        <>
            <div className={styles.header}>
                <img
                    src={smartphone}
                    alt="Bottom Left"
                    width={120}
                    height={120}
                    sizes="100vw"
                />
                <h2 className={styles.heading}>
                    Verify your Mobile number
                </h2>
            </div>

            <div>
                <p className={styles.instruction}>
                    Enter the verification code we sent to <br />
                    <span className={styles.phoneText}>{formatPhoneNumber(phoneNo.phoneNo)}</span>
                    <span className={styles.editLink} onClick={() => setCurrentView('PHONEINPUT')}>
                        Edit
                    </span>
                </p>
            </div>

            <div className={styles.formWrapper}>
                <div className="mb-4">
                    <OTPInput length={6} isRectangular={false} otp={otp} setOtp={setOtp} onComplete={verifyPhone} />
                    {
                        otpError && <p className={styles.errorText}>{otpError}</p>
                    }
                    <OTPResend resendTime={120} resendFunction={resendPhoneOTP}>
                        {({ counter, isClickable, handleResend }) => (
                            <div className={styles.resendWrapper}>
                                <span className={styles.resendTimer}>
                                    Didn’t receive a code? {counter > 0 ? `(${formatTime(counter)})` : ""}
                                </span>
                                <span
                                    className={`${styles.resendLink} ${isClickable ? styles.resendActive : styles.resendDisabled
                                        }`}
                                    onClick={handleResend}
                                >
                                    {isClickable ? "Resend" : ""}
                                </span>
                            </div>
                        )}
                    </OTPResend>
                </div>
            </div>
            <div className={styles.confirmWrapper}>
                <button className={`${styles.button} ${isLoading ? styles.buttonDisabled : styles.buttonEnabled
                    }`} onClick={() => verifyPhone()}>
                    Confirm
                </button>
            </div>
        </>
    )
}

const PhoneVerificationSuccessView = ({ phoneNo }) => {

    const navigate = useNavigate();

    const handleContinue = () => {
        navigate(`${process.env.PUBLIC_URL}/onboard-flow`, { replace: true });
    }

    return (
        <>
            <div className={styles.container}>
                <img
                    src={Concord}
                    alt="Bottom Left"
                    width={200}
                    // height={0}
                    sizes="100vw"
                />
                <h2 className={styles.heading}>
                    Mobile number registered
                </h2>
            </div>

            <div className={styles.wrapper}>
                <div className={styles.message}>
                    <p >
                        Your Mobile number has been successfully registered.
                        Your account's security is our priority.
                    </p>
                </div>
                <button className={styles.button} onClick={() => handleContinue()}>
                    Continue
                </button>
            </div>
        </>
    )
}

export default function PhoneVerificationView({ setUserDetails }) {
   

    // const userDetails = useSelector((state) => state.userData);

    const [currentView, setCurrentView] = useState('PHONEINPUT');
    const [phoneNo, setPhoneNo] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [userDetails, setLocalUserDetails] = useState(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('user_data');
        if (storedUserData) {
            try {
                const parsedData = JSON.parse(storedUserData);
                setLocalUserDetails(parsedData);
            } catch (e) {
                console.error('Failed to parse user_data from localStorage', e);
            }
        }
    }, []);

    return (
        <>
            <div className="">
                {
                    userDetails && <div className={styles.screenCenter}>
                        <div className={styles.card}>
                            {
                                currentView == "PHONEINPUT" && <PhoneInputView setCurrentView={setCurrentView} phoneNo={phoneNo} setPhoneNo={setPhoneNo} userDetails={userDetails} isLoading={isLoading} setLoading={setLoading} />
                            }

                            {
                                currentView == "PHONEVERIFICATION" && <PhoneVerificationCodeView setCurrentView={setCurrentView} phoneNo={phoneNo} setPhoneNo={setPhoneNo} userDetails={userDetails} setUserDetails={setUserDetails} isLoading={isLoading} setLoading={setLoading} />
                            }

                            {
                                currentView == "PHONEVERIFICATIONSUCCESS" && <PhoneVerificationSuccessView phoneNo={phoneNo} setCurrentView={setCurrentView} />
                            }
                        </div>
                    </div>
                }

            </div>

        </>
    );
}
