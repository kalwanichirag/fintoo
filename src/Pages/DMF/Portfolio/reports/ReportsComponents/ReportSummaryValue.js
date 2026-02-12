import React from "react";
import Styles from "../../report.module.css";

function ReportSummaryValue({ children, label, showSaperator }) {

    return (
        <div className={`${Styles.reportSummaryValueContainer}`} style={{ borderRight: `${showSaperator ? '1px solid rgba(0, 0, 0, 0.10)' : ''}` }}>
            <div>
                <div className={`${Styles.textGrayLight1}`}>{label}</div>
                <div style={{ height: '5px' }}></div>
                <div >{children}</div>
            </div>
        </div>
    );
}

export default ReportSummaryValue;
