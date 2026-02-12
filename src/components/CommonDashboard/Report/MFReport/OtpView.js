import React, { useEffect, useRef, useState } from "react";
import Styles from '../../../../Pages/datagathering/DG.module.css'
import OTPInput from "otp-input-react";
import * as toastr from "toastr";
import { useDispatch } from "react-redux";

import {} from "../../../../constants";
import CommonPopup from "../../../CommonStyle/CommonPopup.module.css"
import FHLoader from "./loader";
const ResetTimer = ({ resetFun, countdown, setCountdown }) => {

    const intervalInstanceRef = useRef(null);

    // const [countdown, setCountdown] = useState(60);

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
                countdown == 0 ? <span className="custom-color" style={{ color: '#042b62', cursor: 'pointer' }} onClick={() => {
                    handleResendOTP();
                    resetFun()
                }
                } >Resend</span> : <span className="custom-color" style={{ color: '#042b62' }}>Resend in {countdown} seconds.</span>
            }
        </>
    )
}

const OtpView = (props) => {

    const [countdown, setCountdown] = useState(60);
    const [errorMessage, setErrorMessage] = useState("");
    const [MFReportFetching, setMFReportFetching] = useState(false);
    const [noInvestments, setNoInvestments] = useState(false);


    const handleSubmit = async () => {

        if (props.otpInput.length != 6) {
            setErrorMessage('Please enter valid otp.');
            return;
        }

        try {
            props.setIsLoading(true);
            const verifyOTPResp = await props.verifyMfCentralOTP();
            if (verifyOTPResp) {
                if (props.isLastView) {
                    setMFReportFetching(true)
                    setTimeout(async () => {
                        let res = await props.generateParSnippet(3);
                        if (res === true) {
                            props.setShowSuccessPopupSpinner(true);
                            // props.ShowSuccessPopup();
                        } else {
                            if (props.areBothSelected.stockStatus === false) {
                                props.setAreBothSelected(prev => ({ ...prev, MFStatus: false }))
                                props.setInvestmentTypeView('SUCCESSVIEW');
                            } else {
                                props.setShowSuccessPopupSpinner(true);
                            }
                            setMFReportFetching(false)
                            props.setIsLoading(false);
                            setNoInvestments(false)
                        }
                    }, 20000);
                } else {
                    // props.ShowSuccessPopup();
                    // props.setIsLoading(false);
                    setMFReportFetching(true)
                    setTimeout(async () => {

                        let res = await props.generateParSnippet(2);
                        if (res === true) {
                            props.setShowSuccessPopupSpinner(true);
                        } else {
                            props.setAreBothSelected(prev => ({ ...prev, MFStatus: false }))
                            setMFReportFetching(false)
                            props.setIsLoading(false);
                            setNoInvestments(true)
                        }

                    }, 20000);
                }
            } else {
                props.setIsLoading(false);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            props.setIsLoading(false);
        }
    };


    useEffect(() => {
        if (props.areBothSelected.both) {
            props.setIsLoading(true);
            props.sendOTP().then(() => {
                props.setIsLoading(false);
            })
        }
    }, [])

    useEffect(() => {
        setNoInvestments(false);
    }, [])

    return (
        <>
            {
                noInvestments ? (
                    <div className={`modalBody ${Styles.DematmodalBody}`} style={{ flexGrow: '1', position: 'relative' }}>
                        <div className={`${CommonPopup.modalContent}`}>
                            <img style={{ width: "100px" }} src={`${process.env.PUBLIC_URL}/static/media/unsucesfull.svg`} alt='success-data' />
                            <br />
                            <div className={`${CommonPopup.infoText}`}
                                style={{
                                    textAlign: 'center',
                                    color: '#00000080',
                                    fontSize: '1.3rem'
                                }}>
                                Based on the details you provided, we couldn't find any mutual fund investments in your portfolio.
                                If you believe this is an error, please check your details and try again or contact support for assistance.
                            </div>

                            <button
                                onClick={() => { props.Closemodal(); props.setCurrView('INITIAL') }}
                                style={{
                                    backgroundColor: "#042b62",
                                    border: "1px solid #042b62",
                                    color: "#fff"
                                }}
                                type="button"
                                className="Unlink custom-btn-style"
                            >
                                Ok
                            </button>

                        </div>
                    </div>
                ) : (
                    <div className={`modalBody ${Styles.DematmodalBody}`} style={{ flexGrow: '1', position: 'relative' }}>
                        {
                            props.isLoading ?
                                <div className={`${CommonPopup.modalContent}`}>
                                    <FHLoader />
                                    <br />
                                    {/* <img src={process.env.PUBLIC_URL + "/static/media/Loader.gif"} style={{ width: '165px' }} /> */}
                                    {
                                        MFReportFetching ?
                                            <div className={`pt-5 ${CommonPopup.infoText}`}
                                                style={{
                                                    textAlign: 'center',
                                                    color: '#00000080',
                                                    fontSize: '1.3rem'
                                                }}>
                                                {/* {
                                                    props.areBothSelected.both ? 'We are currently analysing the data and generating your Portfolio Analysis Report. ' : 'We are currently analysing the data and generating your Portfolio Analysis Report. '
                                                } */}
                                                We are currently analysing the data and generating your Consolidated Portfolio Report. We request you to patiently wait as this may take up to 25-30 seconds.
                                            </div> : 
                                            
                                            <div className={`${CommonPopup.infoText}`} style={{
                                                textAlign: 'center',
                                                color: '#00000080',
                                                fontSize: '1.3rem'
                                            }}></div>
                                    }
                                </div> :
                                <div className={`${Styles.parBody}`} style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', alignItems: 'center' }}>
                                    {props.errormfMessage && (
                                        <div className="alert alert-danger">
                                            {props.errormfMessage} lollll
                                        </div>
                                    )}
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
                                            style={{ textAlign: 'center' }}>Didn’t receive OTP?&nbsp;<ResetTimer resetFun={() => { props.sendOTP(); setErrorMessage('') }} countdown={countdown} setCountdown={setCountdown} />
                                        </div>
                                    </div>

                                    <div className={`mt-5 ${Styles.continueBtns}`}>
                                        {
                                            !props.areBothSelected.both && <button className={`${Styles.outlineBtn} custom-color custom-border-color`} onClick={() => props.setCurrView('DETAILS')}>Cancel</button>
                                        }
                                        <button onClick={() => handleSubmit()} disabled={props.errormfMessage} className="custom-background-color">Submit</button>
                                    </div>
                                </div>
                        }

                    </div >
                )
            }

        </>

    );
};
export default OtpView;
