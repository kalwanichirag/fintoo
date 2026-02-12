import React from "react";
import Styles from "../../report.module.css";
import CategoryReportInfo from "../ReportsComponents/CategoryReportInfo";
import ReportSummaryValue from "../ReportsComponents/ReportSummaryValue";
import ReportActionsComponent from "../ReportsComponents/ReportActionsComponent";

function MutualFundReportView(props) {
    return (
        <div >
            <br />
            <div className={`${Styles.ReportLabel}`}>{props.selectedCategoryName}</div>
            <br />
            <CategoryReportInfo>
                <div className={`${Styles.categoryReportInfoValuesContainer}`}>
                    <div className={`${Styles.ReportSummaryValueMainContainer}`}>
                        <ReportSummaryValue label='Invested Value' showSaperator={true}>
                            <div className={`${Styles.textBlackBold1}`}>&#8377; 12,05,680.00</div>
                        </ReportSummaryValue>
                    </div>
                    <div className={`${Styles.ReportSummaryValueMainContainer}`}>
                        <ReportSummaryValue label='Current Value' showSaperator={true}>
                            <div className={`${Styles.textBlackBold1}`} >&#8377; 12,05,680.00</div>
                        </ReportSummaryValue>
                    </div>
                    <div className={`${Styles.ReportSummaryValueMainContainer}`}>
                        <ReportSummaryValue label='Absolute Returns' showSaperator={true}>
                            <div className={`${Styles.textBlackBold1}`} style={{ color: '#38761D' }}>&#8377; 77,777.00</div>
                        </ReportSummaryValue>
                    </div>
                    <div className={`${Styles.ReportSummaryValueMainContainer}`}>
                        <ReportSummaryValue label='XIRR'>
                            <div className={`${Styles.textBlackBold1}`}>13.33 %</div>
                        </ReportSummaryValue>
                    </div>
                </div>
            </CategoryReportInfo>
            <br />
            <ReportActionsComponent />
        </div>
    );
}

export default MutualFundReportView;
