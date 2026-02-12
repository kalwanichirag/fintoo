
import { useEffect, useRef, useState } from "react";
import styles from "../style.module.css";
import mainStyles from "../../style.module.css";

const ResetTimer = ({ resetFun }) => {

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
                countdown == 0 ? <span style={{ fontSize: '1.3rem', color: '#042b62', cursor: 'pointer' }} onClick={() => {
                    handleResendOTP();
                    resetFun()
                }
                } >Resend</span> : <span style={{ fontSize: '1.3rem', color: '#07143775' }}> Resend in {countdown} Seconds</span>
            }
        </>
    )
}

const BasicInfoThird = ({ setBasicInfoCurrentStep, basicInfo, setCurrentTab, sendOTP, verifySmallcaseOTP, fetchEcasData, setBottomAlert }) => {

    const [otp, setOTP] = useState(["", "", "", "", "", ""]);
    const [verifyInProgress, setVerifyInProgress] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


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

        if (otp.some(number => number == '')) {
            setErrorMessage('Please enter otp.');
            return;
        }

        try {
            setVerifyInProgress(true)
            const verifyOTPResp = await verifySmallcaseOTP(otp.join(""));
            setVerifyInProgress(false)
            if (verifyOTPResp) {
                fetchEcasData()
                setCurrentTab(2);
            }

        } catch (error) {
            console.error('Error verifying OTP:', error);
        }


    }

    useEffect(() => {
        setBottomAlert({
            varient: 'info',
            message: 'Hurray you are just 1 Step away.',
            show: true
        });
    }, [])

    return (
        <div>
            <div className={`${styles.Text2}`}>
                Verification
            </div>
            <br />
            <div className={`${styles.InputsContainer}`}>
                <div className={`${styles.InputContainer}`}>
                    <label >Enter OTP</label>
                    <div className={`${styles.otpfieldsContainer}`}>
                        <div className={`${styles.otpfields}`}>
                            {Array.isArray(otp) && otp.map((value, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    autoFocus={index == 0}
                                    value={value}
                                    onChange={(e) => handleInput(e, index)}
                                    onKeyDown={(e) => handleBackspace(e, index)}
                                    min={1}
                                    max={1}
                                />
                            ))}
                        </div>
                        <div >
                            <ResetTimer resetFun={() => { setOTP(["", "", "", "", "", ""]); sendOTP(basicInfo.PAN, basicInfo.Mobile) }} />
                        </div>

                    </div>
                </div>
                {errorMessage && (
                    <p style={{ color: 'red', fontSize: '1.2rem', marginTop: '0.5rem' }}>{errorMessage}</p>
                )}
            </div>
            <br />
            <br />
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className={`${styles.btn2}`} onClick={() => setBasicInfoCurrentStep(2)}>
                    {'< Back'}
                </div>
                <div className={`${verifyInProgress ? styles.btnDisabled : styles.btn1}`} onClick={() => handleVerify()}>
                    {' Submit >'}
                </div>
            </div>



        </div>
    );
};

export default BasicInfoThird;
