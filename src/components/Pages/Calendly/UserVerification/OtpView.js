import { useEffect, useRef, useState } from 'react';
import Styles from '../style.module.css'
import { secondsToMMSS } from '../../../../Utils/Date/DateFormat';
import { useDispatch } from 'react-redux';
import { apiCall } from '../../../../common_utilities';
import { BASE_API_URL } from '../../../../constants';
import { maskPhoneNumber } from '../../../../Utils/Format/Phone';
import { verifyOTP } from '../../../../FrappeIntegration-Services/services/user-management-api/userApiService';

const ResetTimer = ({ resendFlag, resetFun }) => {
    const intervalInstanceRef = useRef(null);
    const [countdown, setCountdown] = useState(120);

    useEffect(() => {
        if (countdown > 0) {
            intervalInstanceRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(intervalInstanceRef.current);
    }, [countdown]);

    const handleResendOTP = () => {
        setCountdown(120);
    };

    return (
        <>
            {
                (countdown == 0) || resendFlag ? <span style={{ color: '#042b62', cursor: 'pointer' }} onClick={() => {
                    webengage.track('resend OTP clicked');
                    handleResendOTP();
                    resetFun()
                }
                } >Resend</span> : <span>Resend in {secondsToMMSS(countdown)}</span>
            }
        </>
    )
}

function OtpView({ setCurrView, setCurrAppointmentView, formState, sendOtp }) {

    const dispatch = useDispatch();

    const [otp, setOTP] = useState(["", "", "", "", "", ""]);
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
        if (otp.some(number => number == '')) {
            setErrorMessage('Please enter otp.');
            return;
        }

        try {
            const enteredOtp = otp.join("");

            const payload = {
                identifier: formState.mobile,
                for_otp: "mobile",
                otp: enteredOtp
            }
            const data = await verifyOTP(payload);
            if (data.status_code != "200") {
                setErrorMessage(data.message);
                webengage.track('verify OTP clicked', {
                    "status": 'Failure',
                    "failure reason": data.message,
                })
                // console.log('webengage event trigger - verify OTP clicked', {
                //     "status": 'Failure',
                //     "failure reason": result.message,
                // })

                if ((data.status_code == "400") && (data.message == 'Your OTP is expired please resend otp')) {
                    setResendFlag(true);
                }
                return;
            }

            webengage.track('verify OTP clicked', {
                "status": 'Success',
                "failure reason": "",
            })
            // console.log('webengage event trigger - verify OTP clicked', {
            //     "status": 'Success',
            //     "failure reason": "",
            // })

            webengage.track('form continue clicked', {
                "name": formState.fullname,
                "email": formState.email,
                "mobile": formState.mobile,
            })
            // console.log('webengage event trigger - form continue clicked', {
            //     "name": formState.fullname,
            //     "email": formState.email,
            //     "mobile": formState.mobile,
            // })
            dispatch({ type: "SET_LEAD_DATA", payload: formState });
            setCurrAppointmentView('CALENDLY');
        } catch (error) {

        }


    }

    return (

        <div>
            <span style={{ position: 'absolute', top: '0', left: '0', margin: '1rem', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setCurrView('DETAILS')}>
                <i className="fa-solid fa-arrow-left"></i>
            </span>
            <div className={Styles.inputDetailsContainer}>
                <div className={Styles.inputElemTitle} style={{ textAlign: 'center', marginBottom: '0' }}>Two-Factor Verification</div>
                <div className={Styles.inputElemSubTitle} style={{ textAlign: 'center' }}>Enter the verification code sent to</div>
                <div className={Styles.maskedNo} style={{ textAlign: 'center' }}>{maskPhoneNumber(formState.mobile + "")}</div>
                <div className={Styles.inputElemContainer}>
                    <div className={Styles.inputElemLabel}>Type your 6 digit OTP</div>
                    <div >
                        <div className={`${Styles.otpfields}`}>
                            {Array.isArray(otp) && otp.map((value, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"

                                    value={value}
                                    onChange={(e) => handleInput(e, index)}
                                    onKeyDown={(e) => handleBackspace(e, index)}
                                    min={1}
                                    max={1}
                                />
                            ))}
                        </div>
                        {errorMessage && (
                            <p style={{ color: 'red', fontSize: '1.2rem', marginTop: '-0.5rem' }}>{errorMessage}</p>
                        )}
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <button className={Styles.btnElem} onClick={() => handleVerify()}>Verify OTP</button>
            </div>
            <div className={Styles.inputElemSubTitle} style={{ textAlign: 'center' }}>Didn’t get the code ? <span style={{ color: '#1B84FF' }}><ResetTimer resendFlag={resendFlag} resetFun={() => {

                setResendFlag(false); sendOtp();
            }} /></span></div>
        </div>
    );
}

export default OtpView;
