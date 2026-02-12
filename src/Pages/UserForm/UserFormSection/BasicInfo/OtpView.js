
import { useEffect, useRef, useState } from "react";
import styles from "../style.module.css";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { apiCall } from "../../../../common_utilities";
import { BASE_API_URL } from "../../../../constants";

const ResetTimer = ({ resendFlag, resetFun }) => {

    const intervalInstanceRef = useRef(null);

    const [countdown, setCountdown] = useState(60);

    useEffect(() => {

        if (countdown > 0) {
            intervalInstanceRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
        }

        return () => clearTimeout(intervalInstanceRef.current);
    }, [countdown]);

    const handleResendOTP = () => {
        setCountdown(60);
    };

    return (
        <>
            {
                (countdown == 0) || resendFlag ? <span style={{ fontSize: '1.1rem', color: '#042b62', cursor: 'pointer' }} onClick={() => {
                    handleResendOTP();
                    resetFun()
                }
                } >Resend</span> : <span style={{ fontSize: '1.1rem', color: '#07143775' }}> Resend in {countdown} Seconds</span>
            }
        </>
    )
}

const OtpView = ({ setBasicInfoCurrentStep, basicInfo, sendOtp, handleSuccessfulVerification }) => {

    const [otp, setOTP] = useState(["", "", "", "", ""]);
    const [verifyInProgress, setVerifyInProgress] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [resendFlag, setResendFlag] = useState(false);


    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    const handleInput = (e, index) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 1) {
            otp[index] = value;
            setOTP([...otp]);
            const allFilled = otp.every(val => val !== '');
            if (value && inputRefs[index + 1]?.current) {
                inputRefs[index + 1].current.focus();
            }
        }
        setErrorMessage("");
    };

    const handleBackspace = (e, index) => {
        if (e.keyCode === 8 && !otp[index] && index > 0) {
            otp[index - 1] = "";
            setOTP([...otp]);
            inputRefs[index - 1].current.focus();
        }
    };

    const handleVerify = async () => {

        // handleSuccessfulVerification();
        // return

        if (otp.some(number => number == '')) {
            setErrorMessage('Please enter otp.');
            return;
        }

        try {
            setVerifyInProgress(true);
            const result = await apiCall(
                BASE_API_URL + "restapi/verifyotpapi/",
                {
                    otp: otp.join(''),
                    mobile_number: basicInfo.Mobile + ""
                },
                false,
                false
            );

            setVerifyInProgress(false);
            if (result.error_code != 100) {
                setErrorMessage(result.message);

                if ((result.error_code == 103) && (result.message == 'Your OTP is expired please resend otp')) {
                    setResendFlag(true);
                }
                return;
            } else {
                handleSuccessfulVerification();
            }
        } catch (error) {

        }
    }

    return (
        <div>
            <div className={`${styles.Text2}`}>
                OTP Verification
            </div>
            <br />
            <div className={`${styles.InputsContainer}`}>
                <div className={`${styles.InputContainer}`}>
                    <label >Enter OTP</label>
                    <div className={`${styles.otpfieldsContainer}`}>
                        <div>
                            <div className={`${styles.otpfields}`}>
                                {Array.isArray(otp) && otp.map((value, index) => (
                                    <input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type="number"
                                        inputMode="numeric"
                                        autoFocus={index == 0}
                                        value={value}
                                        onChange={(e) => handleInput(e, index)}
                                        onKeyDown={(e) => handleBackspace(e, index)}
                                        min={1}
                                        max={1}
                                        style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
                                    />
                                ))}
                            </div>
                            {errorMessage && (
                                <p style={{ color: 'red', fontSize: '1.2rem', marginTop: '0.5rem' }}>{errorMessage}</p>
                            )}
                        </div>

                        <div style={{ fontSize: '1.1rem', color: '#07143775' }} >
                            Didn’t get the code? <ResetTimer resendFlag={resendFlag} resetFun={() => { setResendFlag(false); setOTP(["", "", "", "", ""]); sendOtp(basicInfo.Mobile); }} />
                        </div>

                    </div>
                </div>

            </div>
            <br />
            <br />
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className={`${styles.btn2}`} onClick={() => setBasicInfoCurrentStep(1)}>
                    {'< Back'}
                </div>
                <div className={`${verifyInProgress ? styles.btnDisabled : styles.btn1}`} onClick={() => handleVerify()}>
                    {' Submit >'}
                </div>
            </div>
        </div>
    );
};

export default OtpView;
