import { useEffect, useState } from "react";
import OTPResend from "../../../components/FrappeIntegration-Components/Otp/resendOTPComponent";
import { emailRegex } from "../../../Utils/FrappeIntegration-Utils/regex";
import { formatTime } from "../../../Utils/FrappeIntegration-Utils/timeUtils";
import { handleKeyEnterClick } from "../../../Utils/FrappeIntegration-Utils/helpers";
import { OTPInput } from "../../../components/FrappeIntegration-Components/Otp";
import styles from './AuthFlow.module.css';
import GoogleLoginComponent from "../GoogleLoginComponent/GoogleLoginComponent";
import { checkEmail, checkEmail1, sendOTP, verifyOTP } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { Link } from "react-router-dom";

export default function AuthFlow({ setview, setVerificationFlow, userDetails, setUserDetails }) {


    const [emailError, setEmailError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [isNewDevice, setIsNewDevice] = useState(false);
    const [isNewUser, setIsNewUser] = useState(true);

    const [isLoading, setLoading] = useState(false);

    const [otp, setOtp] = useState(Array(6).fill(""));

    const [currentView, setCurrentView] = useState('EMAILINPUTVIEW');

    const validateEmail = (email) => {
        return emailRegex.test(email);
    };

    const emailInputChange = (email) => {

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError('');
        }

        setUserDetails({ ...userDetails, email: email });
        return;
    }

    const proceedToEmailVerification = () => {
        if (!validateEmail(userDetails.email)) {
            setEmailError("Please enter a valid email address.");
            return;
        } else {
            handleEmail();
            setEmailError('');
        }
    };

    const handleEmail = async (googleEmail) => {

        const emailstr = googleEmail ? googleEmail : userDetails.email;

        try {
            setLoading(true);

            const data = await checkEmail1(emailstr);

            if (data.status_code == 404 || data.error_code == 404) {
                setIsNewUser(true);
                const payload = {
                    identifier: emailstr,
                    for_otp: "email"
                }

                const data = await sendOTP(payload);

                setLoading(false);

                if (data.status_code == 200 || data.error_code == 200) {
                    setCurrentView('EMAILOTPVIEW');
                    return;
                }

            }

            if (data.status_code == 200 || data.error_code == 200) {

                setIsNewUser(false);

                setUserDetails(prev => ({ ...prev, user_email: data.data.user_email }));

                if (!data.data.device_verified) {
                    const payload = {
                        identifier: emailstr,
                        for_otp: "email"
                    }

                    const data = await sendOTP(payload);

                    setLoading(false);

                    if (data.status_code == 200 || data.error_code == 200) {
                        setIsNewDevice(true);
                        setCurrentView('EMAILOTPVIEW');
                        return;
                    }
                }

                setview('VERIFICATIONFLOW');
                setVerificationFlow('PINVERIFICATIONVIEW');
                return;
            }

            // showAlert('error', data?.errors ?? 'Something went wrong, please try again.');
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error(data?.errors ?? 'Something went wrong, please try again.');
            setLoading(false);

            setview('VERIFICATIONFLOW');
            setVerificationFlow('PINVERIFICATIONVIEW');
        } catch (error) {
            console.error('Failed to check email:', error);
        } finally {

        }
    };

    const VerifyEmailCode = async () => {
        if (otp.includes("")) {
            setOtpError("Please fill OTP correctly.");
            return;
        } else {
            const enteredOtp = otp.join("");
            try {
                const payload = {
                    identifier: userDetails.email,
                    for_otp: "email",
                    otp: enteredOtp
                }

                setLoading(true);

                const data = await verifyOTP(payload);

                if (data.status_code == 200 || data.error_code == 200) {

                    if (isNewDevice) {
                        setview('VERIFICATIONFLOW');
                        setVerificationFlow('PINVERIFICATIONVIEW');
                        return;
                    }

                    setview('VERIFICATIONFLOW');
                    setVerificationFlow('PINGENERATIONVIEW');
                    return;

                } else {
                    setOtpError(data.message);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to check email:', error);
            } finally {

            }

        }

    };

    const resedEmailOTP = async () => {

        setOtp(Array(6).fill(""));
        setOtpError("");

        try {

            const payload = {
                identifier: userDetails.email,
                for_otp: "email"
            }
            setLoading(true);
            const data = await sendOTP(payload);
            setLoading(false);

            if (data.status_code == 200 || data.error_code == 200) {
                return;
            }

        } catch (error) {
            console.error('Failed to check email:', error);
        } finally {

        }
    };

    useEffect(() => {
        const firstInput = document.getElementById("email");
        firstInput?.focus();
    }, []);

    return (
        <div className={styles.container}>
            {
                currentView == "EMAILINPUTVIEW" &&
                (
                    <div className={styles.box}>
                        <div className={styles.flexCenter}>
                            <h1 className={`mb-0 ${styles.heading}`}>Welcome to </h1>
                            <Link to={`/`}>
                                <img src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"} alt="FintooLogo" style={{ width: '120px' }} /></Link>
                        </div>

                        <div className={styles.viewSpacing}>
                            {
                                <div>
                                    <GoogleLoginComponent handleEmail={handleEmail} setUserDetails={setUserDetails} />
                                    <div >
                                        <div className={styles.orSeparator}>
                                            <div className={styles.orLine}></div>
                                            <span className={styles.orText}>Or</span>
                                            <div className={styles.orLine}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className={styles.inputLabel} htmlFor="email">Email Address</label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Email ID"
                                            className={styles.inputField}
                                            value={userDetails.email}
                                            onChange={(e) => emailInputChange(e.target.value)}
                                            onKeyDown={(e) => handleKeyEnterClick(e, proceedToEmailVerification)}
                                        />
                                        {emailError && <p className={styles.errorText}>{emailError}</p>}
                                    </div>
                                </div>
                            }
                            <button className={`${styles.button} ${isLoading ? styles.buttonDisabled : styles.buttonActive}`} onClick={proceedToEmailVerification} >
                                Continue
                            </button>
                        </div>
                        <p className={styles.tnc}>
                            By Proceeding, I Agree To <span className={styles.tncLink}><Link className="text-decoration-none " target="_blank" to={process.env.PUBLIC_URL + "/terms-conditions"}>T&C</Link>,</span> <span className={styles.tncLink}><Link className="text-decoration-none " target="_blank" to={process.env.PUBLIC_URL + "/privacy-policy"}>Privacy Policy</Link></span>
                        </p>
                    </div>
                )
            }

            {
                currentView == "EMAILOTPVIEW" &&
                (
                    <div className={styles.box}>
                        <div className={styles.flexCenter}>
                            <h1 className={`mb-0 ${styles.heading}`}>{isNewUser ? "Join With" : "Welcome to"} </h1>
                            <Link to={`/`}>
                                <img src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"} alt="FintooLogo" className={styles.logo} style={{ width: '100px' }} /></Link>

                        </div>

                        <div className={styles.relativeWrap}>
                            <div>
                                <div>
                                    <label className={styles.inputLabel} htmlFor="email">Email Address</label>
                                    <span className={styles.inputWithIcon}>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder={userDetails.email}
                                            className={styles.inputField}
                                            readOnly
                                            value={userDetails.email}
                                        />
                                        <div className={styles.editIcon} onClick={() => setCurrentView('EMAILINPUTVIEW')}>
                                            <i className="fa-solid fa-pencil"></i>
                                        </div>
                                    </span>
                                </div>
                                <div className={styles.otpBox}>
                                    <label className={styles.inputLabel} htmlFor="email">OTP</label>
                                    <OTPInput length={6} isRectangular={false} otp={otp} setOtp={setOtp} onComplete={VerifyEmailCode} />
                                    {
                                        otpError && <p className={styles.errorText}>{otpError}</p>
                                    }
                                    <OTPResend resendTime={120} resendFunction={resedEmailOTP}>
                                        {({ counter, isClickable, handleResend }) => (
                                            <div className={styles.resendBox}>
                                                {
                                                    !isClickable && <span className={styles.resendText}>
                                                        <span>Didn’t receive a code?</span> {counter > 0 ? `(${formatTime(counter)})` : ""}
                                                    </span>
                                                }
                                                <span
                                                    className={isClickable ? styles.resendText : styles.resendDisabled}
                                                    onClick={handleResend}
                                                >
                                                    {isClickable ? "Resend" : ""}
                                                </span>
                                            </div>
                                        )}
                                    </OTPResend>
                                </div>
                            </div>

                            <button
                                className={`${styles.button} ${isLoading ? styles.buttonDisabled : styles.buttonActive}`}
                                onClick={VerifyEmailCode}
                            >
                                {isNewUser ? "Sign Up" : "Sign In"}
                            </button>
                        </div>
                        <p className={styles.tnc}>
                            By Proceeding, I Agree To <span className={styles.tncLink}><Link className="text-decoration-none " target="_blank" to={process.env.PUBLIC_URL + "/terms-conditions"}>T&C</Link>,</span> <span className={styles.tncLink}><Link className="text-decoration-none " target="_blank" to={process.env.PUBLIC_URL + "/privacy-policy"}>Privacy Policy</Link></span>
                        </p>
                    </div>
                )
            }
        </div>
    );
}
