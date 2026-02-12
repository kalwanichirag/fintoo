import React, { useState } from "react";
import styles from "./style.module.css";
import "toastr/build/toastr.css";
import BasicInfoComponent from "./BasicInfo";

const initialBasicInfo = {
    FullName: "",
    Email: "",
    Mobile: "",
    IntereatAreas: []
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const BasicInfoSection = () => {

    const [basicInfoCurrentStep, setBasicInfoCurrentStep] = useState(1);
    const [basicInfo, setBasicInfo] = useState(initialBasicInfo);

    return (
        <div className={`${styles.PortfolioReviewSection}`} style={{ marginTop: '1px' }}>
            <BasicInfoComponent
                basicInfo={basicInfo}
                setBasicInfo={setBasicInfo}
                basicInfoCurrentStep={basicInfoCurrentStep}
                setBasicInfoCurrentStep={setBasicInfoCurrentStep}
            />
        </div >
    );
};

export default BasicInfoSection;
