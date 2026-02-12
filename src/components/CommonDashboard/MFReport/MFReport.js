import React, { useState, memo } from "react";
import creditreport from '../CreditScore/Creditreport.module.css';
import Nsdlcsdl from "../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/Nsdlcsdl";
import { formatDatefun } from "../../../Utils/Date/DateFormat";
import moment from "moment";

const MFReport = (props) => {
    const [partreportPopup, setParReportpopup] = useState(false);

    return (
        <>
            <div className={`${creditreport.CreditReportboxs}`}>
                <div className={` ${creditreport.Texttitle} ${creditreport.creditmeter} mt-0 pt-4 custom-color`}>
                    <>
                        <div style={{ color: "#042b62" }}>
                            <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#042b62 !important" }} className="">{props.title}</span> <br /> <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#042b62 !important" }} className="">Report</span> <br />
                            <span style={{ color: "#042b62" }}>In 30 seconds!</span>
                        </div>
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '0.2rem' }}>
                            <div>
                                <div className={`${creditreport.refreshbtn}`}>
                                    {
                                        props.popup == "mfreport" ? <>
                                            <button onClick={() => {
                                                props.setOpenModalByName("MF_Screening")
                                            }} style={{ marginLeft: '0' }} className="custom-background-color">Generate Report</button>
                                        </> : null
                                    }
                                    {
                                        props.popup == "parreport" ? <>
                                            <button onClick={() => {
                                                props.setOpenModalByName("PAR_Report");
                                            }} style={{ marginLeft: '0' }} className="custom-background-color">Generate Report</button>
                                        </> : null
                                    }
                                </div>
                            </div>
                            {
                                props.reportLink.Link ?
                                    <div>
                                        <a href={props.reportLink.Link} download >
                                            <img alt="download" title={props.popup == "parreport" ? "Download Consolidated Portfolio Report" : "Download MF Screening Report"}
                                                width={25}
                                                // height={20}
                                                className="pointer"
                                                src={
                                                    process.env.REACT_APP_STATIC_URL +
                                                    "media/MoneyManagement/downloads.svg"
                                                }
                                            />
                                        </a>
                                    </div>
                                    : null
                            }
                        </div>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#042b62' }}>
                            {
                                props.reportLink.last_generated_Date && `Last generated on ${moment(props.reportLink.last_generated_Date).format("D MMMM YYYY")}`
                            }
                        </div>


                    </>
                </div>
            </div >

            {
                partreportPopup ? <>
                    <Nsdlcsdl />
                </> : null
            }
        </>
    );
};
export default memo(MFReport);
