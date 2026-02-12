import React, { useEffect, useState } from 'react'
import Styles from "../../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/style.module.css";
import { Row, Modal } from "react-bootstrap";
// import NsdlcsdlInnersection from "../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/NsdlcsdlInnersection";
import Stepper from "../../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/Stepper";
import BasicDetails from "../../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/BasicDetails";
import Otpverification from "../../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/Otpverification";
import AccoutDetails from "../../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/AccoutDetails";
import Completed from "../../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/Completed";
import MobileStepper from "../../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/MobileStepper";
import ParreportDemat from '../ParreportDemat';
import { useLocation } from 'react-router-dom';
import { imagePath } from '../../../../constants';
function Stockreport(props) {
    const [discoveredAccountsData, setDiscoveredAccountsData] = useState([]);
    const [currentPopup, setCurrentPopup] = useState(null);
    const [cdslNsdlResponse, setCdslNsdlResponse] = useState({});
    const [dummy, setDummy] = useState({
        username: "",
        mobileNum: "",
        handleId: ""
    })
    const [open, setOpen] = useState(true);
    const [tab, setTab] = useState("");
    const [actve, setActive] = useState(false);
    const [pageurl, setPageurl] = useState(false);
    const location = useLocation();
    const [count, setCount] = useState(0);
    useEffect(() => {
        if ("pathname" in location) {
            setPageurl(location.pathname);
        }
    }, [location]);
    const CloseSuccessReportModal = () => {
        setOpen(false)
    }
    const onChangepopup = () => {
        setActive(true)
    }
    const handleProceedClick = () => {
        setCount(count + 1);
    };
    const handlebackClick = () => {
        setCount(count - 1);
    };
    const handleBackProceedClick = () => {
        if (count === 2) {
            setCount(0);
        }
    };
    const ShowSuccessPopup = () => {
        props.handleShowSuccessPopup();
    };
    // const mfflow = () => {
    //     props.bothCheck();
    // }

    useEffect(() => {
        if (props.areBothSelected.redirectFlow) {
            setActive(true)
            setCount(1);
            return;
        }
    }, [])

    // useEffect(() => {
    //     setTimeout(() => {
    //         setCurrentPopup(null);
    //         setActive(null)
    //         console.log('lollllllll')
    //     }, 2000)
    // }, [])

    return (
        <div>
            {
                actve ? (
                    <>
                        <div className="" style={{ padding: "0 !important" }}>
                            <div className="">
                                <div style={{
                                    background: pageurl === "/commondashboard" || pageurl === "/commondashboard/" ? "#042b62" : ""
                                }} className="RefreshModalpopup_Heading col-12 d-flex custom-background-color">
                                    <div className={`${Styles.modal_Heading}`}>Stocks</div>
                                    <div className={`${Styles.CloseBtnpopup}`}>
                                        <img
                                            onClick={() => {
                                                setCurrentPopup(null);
                                                setActive(null)
                                                props.onclose();
                                            }}
                                            style={{ cursor: "pointer", right: 0 }}
                                            src={imagePath + "/static/media/DG/Close.svg"}
                                            alt="Close"
                                        />
                                    </div>
                                </div>
                                <div className={`modalBody ${Styles.DematmodalBody}`}>
                                    <div className={`${Styles.LeftSection}`}>
                                        <div className="d-md-block d-none">
                                            <Stepper
                                                stepnumber="1"
                                                text1={"Basic Details "}
                                                text2={"Provide your account details"}
                                                isActive={count >= 0}
                                            />

                                            <Stepper
                                                stepnumber="2"
                                                text1={"OTP Verification"}
                                                text2={"Consent to fetch your documents"}
                                                isActive={count >= 1}
                                            />
                                            <Stepper
                                                stepnumber="3"
                                                text1={"Account Details"}
                                                text2={"Your demat related info"}
                                                isActive={count >= 2}
                                                isNumberMatched={props.isNumberMatched}
                                                currentPopup={currentPopup}
                                                cdslNsdlResponse={cdslNsdlResponse}
                                            />
                                            <Stepper
                                                stepnumber="4"
                                                text1={"Completed"}
                                                text2={"Woah, we are here"}
                                                isActive={count >= 3}
                                            />
                                        </div>
                                        <div>
                                            <div className={`d-flex d-md-none ${Styles.mobileStepper}`}>
                                                <MobileStepper isActive={count >= 0} stepnumber="1" />
                                                <MobileStepper isActive={count >= 1} stepnumber="2" />
                                                <MobileStepper cdslNsdlResponse={cdslNsdlResponse}
                                                    isNumberMatched={props.isNumberMatched} currentPopup={currentPopup} isActive={count >= 2} stepnumber="3" />
                                                <MobileStepper isActive={count >= 3} stepnumber="4" />
                                            </div>
                                            <div className="d-md-none d-block pt-2">
                                                {
                                                    count === 0 ? (
                                                        <div className={count === 0 ? "d-block" : "d-none"}>
                                                            <div className={`${Styles.stepTitle}`} style={{ color: "#042b62" }}>Basic Details</div>
                                                            <div className={`${Styles.stepsubTitle}`}>Provide your account details</div>
                                                        </div>
                                                    ) : null
                                                }
                                                {
                                                    count === 1 ? (
                                                        <div className={count === 1 ? "d-block" : "d-none"}>
                                                            <div className={`${Styles.stepTitle}`} style={{ color: "#042b62" }}>OTP Verification</div>
                                                            <div className={`${Styles.stepsubTitle}`}>Consent to fetch your documents</div>
                                                        </div>
                                                    ) : null
                                                }
                                                {
                                                    count === 2 ? (
                                                        <div className={count === 2 ? "d-block" : "d-none"}>
                                                            <div className={`${Styles.stepTitle}`} style={{ color: "#042b62" }}>Account Details</div>
                                                            <div className={`${Styles.stepsubTitle}`}>Your demat related info</div>
                                                        </div>
                                                    ) : null
                                                }
                                                {
                                                    count === 3 ? (
                                                        <div className={count === 3 ? "d-block" : "d-none"}>
                                                            <div className={`${Styles.stepTitle}`} style={{ color: "#042b62" }}>Completed</div>
                                                            <div className={`${Styles.stepsubTitle}`}>Provide your account details</div>
                                                        </div>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                        <div className="d-md-block d-none">
                                            <div className={`p-2 ${Styles.Modalbottombody}`}>
                                                <div
                                                    style={{
                                                        justifyContent: "flex-start",
                                                    }}
                                                    className={`${Styles.thirdPartyView}`}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <div className={`${Styles.poweredBy}`}>Powered by</div>{" "}
                                                        <img
                                                            className="ms-2"
                                                            width={60}
                                                            src={
                                                                process.env.REACT_APP_STATIC_URL +
                                                                "media/DG/Finvu.png"
                                                            }
                                                            alt="Close"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${Styles.RightSection}`}>
                                        {count === 0 && (
                                            <BasicDetails
                                                onClose={() => {
                                                    setCurrentPopup(null);
                                                    setActive(null)
                                                    props.onclose();
                                                }}
                                                onProceedClick={handleProceedClick} setDummy={setDummy}
                                                setCommonUserData={props.setCommonUserData}
                                                forpar={true} />
                                        )}
                                        {count === 1 && (
                                            <Otpverification
                                                onClose={() => {
                                                    setCurrentPopup(null);
                                                    setActive(null)
                                                    props.onclose();
                                                }}
                                                onHandlebackClick={handlebackClick}
                                                onProceedClick={(response) => {
                                                    handleProceedClick();
                                                    setCdslNsdlResponse({ ...response });
                                                }} dummy={dummy}
                                                forpar={true}
                                                setDiscoveredAccountsData={setDiscoveredAccountsData}
                                            />
                                        )}
                                        {count === 2 && (
                                            <AccoutDetails
                                                onClose={() => {
                                                    setCurrentPopup(null);
                                                    setActive(null);
                                                    props.onclose();
                                                }}
                                                onBackProceedClick={handleBackProceedClick}
                                                onProceedClick={handleProceedClick}
                                                onHandlebackClick={() => {
                                                    props.onclose();
                                                }}
                                                handleMfView={() => {
                                                    props.handleMfView();
                                                }}
                                                areBothSelected={props.areBothSelected.redirectFlow || props.areBothSelected.both}
                                                dummy={dummy}
                                                cdslNsdlResponse={cdslNsdlResponse}
                                                forpar={true}
                                                setAreBothSelected={props.setAreBothSelected}
                                                discoveredAccountsData={discoveredAccountsData}
                                            />
                                        )}
                                        {count === 3 && (
                                            <Completed
                                                onClose={() => {
                                                    setCurrentPopup(null);
                                                    setActive(null)
                                                    props.onclose();
                                                }}
                                                forpar={true}
                                                investmentType={props.investmentType}
                                                ShowSuccessPopup={props.handleShowSuccessPopup}
                                                setShowSuccessPopupSpinner={props.setShowSuccessPopupSpinner}
                                                generateParSnippet={props.generateParSnippet}
                                                modalData={props.modalData}
                                                reportPDFUrl={props.reportPDFUrl}
                                                areBothSelected={props.areBothSelected}
                                                setAreBothSelected={props.setAreBothSelected}
                                                setInvestmentTypeView={props.setInvestmentTypeView}
                                            // mfflow={mfflow}
                                            />

                                        )}
                                    </div>
                                    <div style={{ borderTop: "1px solid #e6e6e6", margin: "0 1.2rem" }} className={`p-3 mt-2 d-md-none d-block ${Styles.Modalbottombody}`}>
                                        <div
                                            style={{
                                                justifyContent: "flex-end",
                                            }}
                                            className={`${Styles.thirdPartyView}`}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div className={`${Styles.poweredBy}`}>Powered by</div>{" "}
                                                <img
                                                    className="ms-2"
                                                    width={60}
                                                    src={
                                                        process.env.REACT_APP_STATIC_URL +
                                                        "media/DG/Finvu.png"
                                                    }
                                                    alt="Close"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="" style={{ padding: "0 !important" }}>
                            <div className="">
                                <div style={{
                                    background: pageurl === "/commondashboard" || pageurl === "/commondashboard/" ? "#042b62" : "#042b62",
                                    border: pageurl === "/commondashboard" || pageurl === "/commondashboard/" ? "0px solid #042b62" : "0px solid #F1F1F2"
                                }} className="RefreshModalpopup_Heading col-12 d-flex custom-background-color">
                                    <div className={`${Styles.modal_Heading}`}>
                                        {
                                            pageurl === "/commondashboard" || pageurl === "/commondashboard/" ? "Stocks" : " Know More"
                                        }
                                    </div>
                                    <div className={`${Styles.CloseBtnpopup}`}>
                                        <img
                                            onClick={() => {
                                                // setCurrentPopup(null);
                                                // setActive(null)
                                                props.onclose();
                                            }}
                                            style={{ cursor: "pointer", right: 0 }}
                                            src={imagePath + "/static/media/DG/Close.svg"}
                                            alt="Close"
                                        />
                                    </div>
                                </div>
                                <div className={`modalBody ${Styles.modalBody}`}>
                                    <ParreportDemat
                                        setInvestmentTypeView={props.setInvestmentTypeView}
                                        onpopupclose={() => {
                                            props.onclose();
                                        }} onChangepopup={() => { setActive(true) }} onClose={() => {
                                            setCurrentPopup(null);
                                        }} tab={tab} setTab={setTab} setNextPopup={() => setCurrentPopup(1)} />
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Stockreport
