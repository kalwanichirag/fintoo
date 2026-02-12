import React, { useState, useEffect } from "react";
import Cibilreport from "./Cibil_Report.module.css";
import ReportStepper from "./ReportStepper";
const Creditreportprocess = (props) => {
    const count = props.count;
    return (
        <>
            <div className="d-md-block w-100">
                <ReportStepper
                    stepnumber="1"
                    text1={"Fetching your credit score for free "}
                    isActive={count >= 1}
                    isLoading={count == 1}
                />

                <ReportStepper
                    stepnumber="2"
                    text1={"setting up your liabilities"}
                    isActive={count >= 2}
                    isLoading={count == 2}
                />
                <ReportStepper
                    stepnumber="3"
                    text1={"Analyzing Your credit report"}
                    isActive={count >= 3}
                    isLoading={count == 3}
                />
                 <ReportStepper
                    stepnumber="4"
                    text1={"updating your information"}
                    isActive={count >= 4}
                    isLoading={count == 4}
                />
                <ReportStepper
                    stepnumber="5"
                    text1={"all set !"}
                    isActive={count >= 5}
                    isLoading={count == 5}
                />
            </div>
        </>
    );
};
export default Creditreportprocess;
