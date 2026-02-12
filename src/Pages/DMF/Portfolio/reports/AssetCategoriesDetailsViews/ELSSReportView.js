import React, { useState } from "react";
import Styles from "../../report.module.css";
import Select from "react-select";

const FYOptions = [
    { value: "2022-2023", label: "FY 2022 - 2023" },
];

function ELSSReportView(props) {
    const [FY, SetFY] = useState('2022-2023')

    const onDateAndSelectInputChange = (name, value) => {
        SetFY(value);
    };

    return (


        <div>
            <span className={`HeaderText pb-3 ${Styles.ELSSPopupHeader}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}><img width={30} src={
                    process.env.PUBLIC_URL +
                    "/static/media/DMF/Report/ELSS_purchase.svg"
                } alt="" /> ELSS Report</div>
                <span style={{ cursor: 'pointer' }} onClick={() => props.onClose()}><img width={30} src={
                    process.env.PUBLIC_URL +
                    "/static/media/DMF/Report/ELSSClose.svg"
                } alt="" /></span>
            </span>
            <div className="ModalpopupContentContainer">
                <div className={`${Styles.ReportDetailSection}`} >
                    <br />
                    <div className={`${Styles.textLight1}`} style={{ textAlign: 'left' }}>
                        To Download Report <b>Select Financial Year</b>
                    </div>
                    <br />
                    <div >
                        <div className={`${Styles.ELSSReportDetailsOptionsContainer} ${Styles.ELSSReportDetailsOptionsContainerPadding}`}>
                            <div className={`${Styles.ELSSReportDetailsOptionsInput}`} >
                                <div className="mt-2">
                                    <Select
                                        className="box-shadow-none border-0"
                                        classNamePrefix="ReportSelect"
                                        isSearchable={false}
                                        placeholder="Select.."
                                        options={FYOptions}
                                        value={FYOptions.filter((v) => v.value === FY)[0] ?? ""}
                                        onChange={(e) => {
                                            onDateAndSelectInputChange("FY", e.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={`${Styles.ELSSGenerateBtnContainer}`}>
                                <div className={`${Styles.ELSSGenerateBtn}`}>
                                    Download
                                </div>
                            </div>
                        </div>
                        {/* <br /> */}
                        <div className={`${Styles.ELSSReportDetailsOptionsContainer}`}>
                            <div></div>
                            <div className={`${Styles.textGrayNormal} ${Styles.ELSSActions}`}>
                                Share via Mail <span><img width={15} src={
                                    process.env.PUBLIC_URL +
                                    "/static/media/DMF/Report/email.svg"
                                } alt="" /></span> | or Whatsapp <span><img width={15}
                                    src={
                                        process.env.PUBLIC_URL +
                                        "/static/media/DMF/Report/whatsapp.svg"
                                    } alt="" /></span>
                            </div>
                        </div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </div>


    );
}

export default ELSSReportView;
