import React, { memo, useEffect, useRef, useState } from "react";
import Styles from '../DG.module.css'
import MFStyles from "../AssetsLibDG/NSDL_CSDL/style.module.css";
import OTPInput from "otp-input-react";
import CommonPopup from "../../../components/CommonStyle/CommonPopup.module.css"
import FHLoader from "../../../components/CommonDashboard/Report/MFReport/loader";
const ResetTimer = memo(({ resetFun, countdown, setCountdown }) => {

    const intervalInstanceRef = useRef(null);

    // const [countdown, setCountdown] = useState(60);

    useEffect(() => {

        if (countdown > 0) {
            intervalInstanceRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
            // intervalInstanceRef.current = setTimeout(() => countdown = countdown - 1, 1000);
        }

        return () => clearTimeout(intervalInstanceRef.current);
    }, [countdown]);

    const handleResendOTP = () => {
        setCountdown(60);
        // countdown = 60;
    };

    return (
        <>
            {
                countdown == 0 ? <span className="custom-color" style={{ color: '#042b62', cursor: 'pointer' }} onClick={() => {
                    handleResendOTP();
                    resetFun()
                }
                } >Resend</span> : <span className="custom-color">Resend in {countdown} seconds.</span>
            }
        </>
    )
})

const OtpView = (props) => {

    const [countdown, setCountdown] = useState(60);
    const [snippetError, setSnippetError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleSubmit = async () => {
        if (props.otpInput.length != 6) {
            setErrorMessage('Please enter valid otp.');
            return;
        }
        try {
            props.setIsLoading(true);
            const verifyOTPResp = await props.verifyMfCentralOTP();
            if (verifyOTPResp) {
                setTimeout(async () => {
                    const fetchEcasResp = await props.fetchEcasData();
                    if (fetchEcasResp) {
                        props.setShowSuccessPopup(true);
                    } else {
                        setSnippetError(true);
                    }
                    props.setIsLoading(false);
                }, 20000); // 20000 milliseconds = 20 seconds
            } else {
                props.setIsLoading(false);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            props.setIsLoading(false);
        }
    };

    useEffect(() => { //console.log('otp countdown')    
    }, [snippetError])

    return (
        <>
            {!snippetError ? (
                <div className={`modalBody ${Styles.DematmodalBody}`} style={{ flexGrow: '1', position: 'relative' }}>
                    {
                        props.isLoading ?
                            <div className={`${CommonPopup.modalContent}`}>
                                <FHLoader />
                                <br />
                                {/* <img src={process.env.PUBLIC_URL + "/static/media/Loader.gif"} style={{ width: '165px' }} /> */}
                                <div className={`pt-5 ${CommonPopup.infoText}`}
                                    style={{
                                        textAlign: 'center',
                                        color: '#00000080',
                                        fontSize: '1.3rem'
                                    }}
                                >


                                    We are currently analysing the data and generating your personalised MF Screening Report.<br />
                                    We request you to patiently wait as this may take up to 25-30 seconds.</div>
                            </div> :
                            <div className={`${Styles.parBody}`}>
                                <div>
                                    <div>
                                        <div
                                            className={`${Styles.Title1}`}>OTP Verification</div>
                                        <div
                                            className={`${Styles.SubTitle1}`}>Please enter the OTP sent to {props.selectedMember?.mobile ?? ""}</div>
                                        <br />
                                        <OTPInput
                                            value={props.otpInput}
                                            onChange={props.setOtpInput}
                                            autoFocus
                                            // className="link-holdings-otp w-100"
                                            className={`w-100 ${Styles.OTPviewInput}`}
                                            style={{
                                                border: "none",
                                            }}
                                            OTPLength={6}
                                            otpType="number"
                                            disabled={false}
                                        />
                                        {errorMessage && (
                                            <p style={{ color: 'red', fontSize: '1.2rem', marginTop: '0.5rem' }}>{errorMessage}</p>
                                        )}
                                    </div>
                                    <br />
                                    <div
                                        className={`${Styles.SubTitle1}`}
                                        style={{ textAlign: 'center' }}>Didn’t receive OTP? &nbsp;<ResetTimer resetFun={() => { props.sendOTP(); setErrorMessage('') }} countdown={countdown} setCountdown={setCountdown} />
                                    </div>
                                </div>

                                <div className={`mt-5 ${Styles.continueBtns}`}>
                                    <button className={`${Styles.outlineBtn} custom-border-color custom-color`} onClick={() => props.setCurrView('DETAILS')}>Cancel</button>
                                    <button onClick={() => handleSubmit()} className="custom-background-color">Submit</button>
                                </div>
                            </div>
                    }
                </div >
            ) : (
                <div style={{ textAlign: "center", padding: "2rem" }} className={`modalBody d-block ${MFStyles.DematmodalBody}`}>
                    <br />
                    <br />
                    <div style={{
                        margin: "1rem 0"
                    }}>
                        <img src={process.env.REACT_APP_STATIC_URL + "media/unsucesfull.svg"} alt='success-data' />
                    </div>
                    <br />
                    <div>
                        <div className={`${Styles.Title1}`}>
                            Unsuccessful!
                        </div>
                        <div style={{ height: '0.4rem' }}></div>
                        <div style={{
                            textAlign: 'center',
                            color: '#00000080',
                            fontSize: '1.3rem'
                        }}
                        >
                            {props.errorMsg}
                        </div>
                    </div>
                    <br />
                    <div className={`mt-5 ${Styles.continueBtns}`}>
                        <button className="custom-background-color" onClick={props.closeView}>Ok</button>
                    </div>

                </div>
            )}
        </>
    );
};
export default memo(OtpView);
