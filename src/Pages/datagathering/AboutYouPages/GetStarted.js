import React, { useState, useRef, useEffect } from "react";
import { imagePath } from "../../../constants";
import { setBackgroundDivImage } from "../../../common_utilities";

// import { ScrollToTop } from "./ScrollToTop";
import getstart from "./getstarted.module.css"
function GetStarted(props) {
    const setTab = props.setTab;

    useEffect(() => {

        setBackgroundDivImage();

    }, []);
    return (

        <div className={`${getstart.getstartedSection}`}>
            <div className={`${getstart.getstartedSectiontitle}`}>Welcome</div>
            <div className={`${getstart.getstartBoxcontainer}`}>
                <div className={`${getstart.getstartItem}`}>
                    <div className={`${getstart.getstartedSectionBox}`}>
                        <div className={`d-flex align-items-center justify-content-center ${getstart.getStartimg}`}>
                            <img src={imagePath + '/static/media/DG/Data_input.svg'} alt="" />
                        </div>

                    </div>
                    <div className={`${getstart.bottomsection}`}>
                        <div className={`${getstart.title}`}>Enter your accurate details</div>
                        <div className={`${getstart.information}`}>Please input accurate information regarding your personal details, income, expenditures, goals, assets and liabilities. This data is essential for generating a report.</div>
                    </div>
                </div>
                <div className={`${getstart.getstartItem}`}>
                    <div className={`${getstart.getstartedSectionBox}`}>
                        <div className={`d-flex align-items-center justify-content-center ${getstart.getStartimg}`}>
                            <img src={imagePath + '/static/media/DG/AccountAgree.svg'} alt="" />
                        </div>

                    </div>
                    <div className={`${getstart.bottomsection}`}>
                        <div className={`${getstart.title}`}>Retrieve your data through Account Aggregator </div>
                        <div className={`pt-1 ${getstart.information}`}>By providing your PAN and mobile number, you can access data for mutual funds, EPF, stocks, liabilities, and more.
                        </div>
                    </div>
                </div>
                <div className={`${getstart.getstartItem}`}>
                    <div className={`${getstart.getstartedSectionBox}`}>
                        <div className={`d-flex align-items-center justify-content-center ${getstart.getStartimg}`}>
                            <img src={imagePath + '/static/media/DG/SecureData.svg'} alt="" />
                        </div>

                    </div>
                    <div className={`${getstart.bottomsection}`}>
                        <div className={`${getstart.title}`}>Your data is 100% secure</div>
                        <div className={`${getstart.information}`}>We use advanced security protocols and secure platforms to protect your data, ensuring it's safe with us!</div>
                    </div>
                </div>
                <div className={`${getstart.getstartItem}`}>
                    <div className={`${getstart.imgSection}`}><img src={imagePath + '/static/media/DG//Reportt.svg'} alt="" /></div>
                    <div className={`${getstart.bottomDetailssection}`}>
                        <div>Generate Report</div>
                        <div className={`${getstart.Description}`}>After completing the data gathering process, click "Generate Report" to retrieve your financial health checkup report.</div>
                    </div>
                </div>
                <div className={`${getstart.getstartItem}`}>
                    <div className={`${getstart.getstartbtn}`}>
                        <button onClick={() => {
                            setTab("tab1")
                        }}
                            className="custom-background-color"
                        >
                            <div style={{ marginRight: "auto" }}>Let’s Proceed</div>
                            <div>
                                <svg width="52" height="49" viewBox="0 0 52 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.0891 16L29.0891 24.2571L19.0891 33" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </button>

                    </div>
                </div>
            </div>

        </div>

    )
}

export default GetStarted;