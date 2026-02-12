
import { useEffect, useState } from "react";
import styles from "../style.module.css";
import BasicInfoFirst from "./BasicInfoFirst";
import BasicInfoSecond from "./BasicInfoSecond";
import BasicInfoThird from "./BasicInfoThird";
import { CHATBOT_BASE_API_URL } from "../../../../constants";

const BasicInfo = ({
    setCurrentTab,
    basicInfo,
    setBasicInfo,
    sendOTP,
    verifySmallcaseOTP,
    fetchEcasData,
    setBottomAlert,
    basicInfoCurrentStep,
    setBasicInfoCurrentStep,
    seMfSnippetData
}) => {

    useEffect(() => {
        seMfSnippetData({
            pdf_snippet_url: '',
            pdf_snippet_url_WA: '',
            total_current_value: ''
        })
    }, [])

    return (
        <div style={{ marginTop: '1px' }}>
            <div className={`${styles.BasicInfoStepIndicatorContainer}`}>
                <div className={`${styles.Text1}`}  >
                    {basicInfoCurrentStep}/3
                </div>
                <div className={`${styles.BasicInfoStepIndicatorBar}`}>
                    <div style={{ width: `${(basicInfoCurrentStep * 100) / 3}%` }} className={`${styles.BasicInfoStepIndicatorInnerBar}`}></div>
                </div>
            </div>
            <div>
                {
                    basicInfoCurrentStep == 1 && <BasicInfoFirst
                        setBasicInfoCurrentStep={setBasicInfoCurrentStep}
                        basicInfo={basicInfo}
                        setBasicInfo={setBasicInfo}
                    />
                }
                {
                    basicInfoCurrentStep == 2 && <BasicInfoSecond
                        setBasicInfoCurrentStep={setBasicInfoCurrentStep}
                        basicInfo={basicInfo}
                        setBasicInfo={setBasicInfo}
                        sendOTP={sendOTP}
                    />
                }
                {
                    basicInfoCurrentStep == 3 && <BasicInfoThird
                        setBasicInfoCurrentStep={setBasicInfoCurrentStep}
                        basicInfo={basicInfo}
                        setCurrentTab={setCurrentTab}
                        sendOTP={sendOTP}
                        verifySmallcaseOTP={verifySmallcaseOTP}
                        fetchEcasData={fetchEcasData}
                        setBottomAlert={setBottomAlert}
                    />
                }
            </div>



        </div>
    );
};

export default BasicInfo;
