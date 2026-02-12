import React, { useState, useEffect } from "react";
import creditreport from './Creditreport.module.css'
import CreditScorecard from "./CreditScorecard";
import * as toastr from "toastr";

import {
    apiCall,
    calculateEMI,
    getItemLocal,
    getParentFpLogId,
    getParentUserId, getFpUserDetailId,
    getUserId,
    indianRupeeFormat,
    restApiCall, loginRedirectGuest,
} from "../../../common_utilities";

import ReactTooltip from "react-tooltip";
import ToolTip from "../../HTML/ToolTip";
import { IoIosInformationCircle } from "react-icons/io";
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { MdRefresh } from "react-icons/md";
const CreditReport = (props) => {
    // const [checkScore, setCheckScore] = useState(false);
    const checkScore = props.isFetched;
    const isPlan = props?.isPlan;

    // const equifaxDetails = props?.equifaxDetails;
    // const creditScore = props?.equifaxDetails?.cibil_score;
    const [creditScore, setCreditScore] = useState("");
    const [creditPerformance, setCreditPerformance] = useState("");
    const [creditDesc, setCreditDesc] = useState("");
    const [equifaxDetails, setEquifaxDetails] = useState([]);
    const [scoreIndicator, setScoreIndicator] = useState("");
    const [session, setSession] = useState("");
    const [showRefreshMessage, setShowRefreshMessage] = useState(false);
    const [performanceColor, setPerformanceColor] = useState("#FE432F");

    // const [num, setNum]= useState(111);
    // const toastId = React.useRef(null);

    useEffect(() => {
        // getEquifaxData();
        // getPerformanceDetails(creditScore);
    }, []);

    // useEffect(() => {
    //     if(showRefreshMessage){
    //         toastr.options.positionClass = "toast-bottom-left";
    //         toastr.error("Please note that you can refresh your CIBIL score after a 90-day waiting period from the last updated date.",
    //         { 
    //             timeOut: 3000,
    //             onclick: () => {
    //                 toastr.clear();
    //               },
    //         });
    //     }
    //     // setNum(num+1);
    //     // if(toastr.isActive())
    // }, [showRefreshMessage == true]);

    const handleRefreshLoans = async (equifax_id, member_id, selected_name) => {
        try {
            let payload = null;

            if (session['user_details'].fp_log_id == null) {
                payload = {
                    fp_equifax_id: equifax_id,
                    liability_member_id: member_id,
                    user_id: session.id,
                    is_plan: "0",
                };

            } else {
                payload = {
                    fp_equifax_id: equifax_id,
                    liability_member_id: member_id,
                    user_id: session.id,
                    fp_log_id: session.fp_log_id,
                };
            }
            // var payload = {
            //     "fp_equifax_id": equifax_id,
            //     "liability_member_id": member_id,
            //     "user_id": session.id,
            //     "fp_log_id": session.fp_log_id
            // };

            let respData = await restApiCall(
                ADVISORY_UPDATE_FETCHEDLOANS_API,
                payload,
                true,
                false
            );

            if (respData.error_code == "100") {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.success(selected_name + "'s loan has been refreshed successfully.");
                // getEquifaxData(session);
                getLiabilityList();
            } else {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Something went wrong!");
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleDisableRefresh = () => {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Please note that you can refresh your CIBIL score after a 30-day waiting period from the last updated date.",
            // { 
            //     timeOut: 3000,
            //     onclick: () => {
            //         toastr.clear();
            //       },
            // }
        );
    };

    const getEquifaxData = async () => {
        // var session_data = props.sessiondata 
        // let url = CHECK_SESSION;
        // let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
        // let session_data = await apiCall(url, data, true, false);
        // setSession(session_data["data"]);

        try {
            let reqdata = null;
            // var isPlanActive = true

            // if(session_data.data['user_details'].fp_log_id == null){
            //     isPlanActive = false;
            // }

            if (session_data.data['user_details'].fp_log_id == null) {
                reqdata = {
                    user_id: session_data["data"].id,
                    is_plan: "0",
                };

            } else {
                reqdata = {
                    user_id: session_data["data"].id,
                    fp_log_id: session_data["data"].fp_log_id,
                };
            }

            let respData = await restApiCall(
                '',
                reqdata,
                true,
                false
            );

            if (respData.error_code == "100") {
                let member_id = getFpUserDetailId();
                let member_selected = "";

                if (getItemLocal("family")) {
                    member_selected = "all";
                } else {
                    member_selected = "member_id";
                }

                if (respData.data.length > 0) {
                    let equifax_data = respData.data;

                    for (let i = 0; i < equifax_data.length; i++) {

                        if ((member_selected == "all" && equifax_data[i].relation_id == 1) ||
                            (member_selected == "member_id" && equifax_data[i].member_id == member_id)) {
                            let credit_score = equifax_data[i].cibil_score;
                            setCreditScore(credit_score);

                            var formattedDate = null;

                            if (equifax_data[i].refreshDate) {
                                var refDate = equifax_data[i].refreshDate;
                                refDate = new Date(refDate);
                                // refDate.setMonth(refDate.getMonth() + 6);
                                var suffixes = ["th", "st", "nd", "rd"];
                                var day = refDate.getDate();
                                var month = refDate.toLocaleString("default", { month: "long" });
                                var year = refDate.getFullYear();
                                var daySuffix = suffixes[(day - 20) % 10] || "th";
                                formattedDate = day + daySuffix + " " + month + ", " + year;
                            }

                            var lastUpdatedDate = equifax_data[i].last_updated_date;
                            lastUpdatedDate = new Date(lastUpdatedDate);

                            var suffixes = ["th", "st", "nd", "rd"];
                            var day = lastUpdatedDate.getDate();
                            var month = lastUpdatedDate.toLocaleString("default", { month: "long" });
                            var year = lastUpdatedDate.getFullYear();
                            var daySuffix = suffixes[(day - 20) % 10] || "th";
                            var lastUpdatedFormattedDate = day + daySuffix + " " + month + ", " + year;

                            // var equifax_data1 = {
                            //     id: equifax_data[i].id,
                            //     member_id: equifax_data[i].member_id,    
                            //     first_name: equifax_data[i].first_name,
                            //     last_updated: lastUpdatedFormattedDate,
                            //     can_refresh: equifax_data[i].canRefresh,
                            //     // refreshDate: formattedDate
                            // }

                            // if(formattedDate){
                            //     equifax_data["refreshDate"] = formattedDate
                            // }

                            setEquifaxDetails({
                                id: equifax_data[i].id,
                                member_id: equifax_data[i].member_id,
                                first_name: equifax_data[i].first_name,
                                last_updated: lastUpdatedFormattedDate,
                                can_refresh: equifax_data[i].canRefresh,
                                refreshDate: formattedDate
                            })

                            getPerformanceDetails(credit_score);
                            break;
                        }
                    }
                }

            }
            else {

            }
        } catch (e) {
            console.log(e);
        }
    };

    const getPerformanceDetails = (credit_score) => {
        var score_desc = "";
        var score_performance = "";
        var score_deg = "";
        let color = ["#FE432F", "#FCAE00", "#FFEB00", "#60C600", "#00B800"]

        if (credit_score < 600) {
            score_performance = "Needs Attention";
            setPerformanceColor(color[0]);
            score_desc = "With a low CIBIL score, loan approval probability is minimal due to poor credit history.";
            score_deg = 240 + (credit_score / 900);
            setScoreIndicator(score_deg);

        } else if (credit_score >= 600 && credit_score <= 649) {
            score_performance = "Doubtful";
            setPerformanceColor(color[1]);
            score_desc = "Loan approval is challenging with a CIBIL score in this range, requiring substantial improvement in creditworthiness.";
            score_deg = 240 + 36 + (credit_score / 900);
            setScoreIndicator(score_deg);

        } else if (credit_score >= 650 && credit_score <= 699) {
            score_performance = "Satisfactory or Fair";
            setPerformanceColor(color[2]);
            score_desc = "There's a chance for loan approval with a CIBIL score in this category, but it may necessitate addressing certain credit issues.";
            score_deg = 240 + (36 * 2) + (credit_score / 900);
            setScoreIndicator(score_deg);

        } else if (credit_score >= 700 && credit_score <= 749) {
            score_performance = "Good";
            setPerformanceColor(color[3]);
            score_desc = "A good CIBIL score enhances loan approval probability significantly, reflecting a strong credit profile";
            score_deg = 240 + (36 * 3) + (credit_score / 900);
            setScoreIndicator(score_deg);

        } else if (credit_score >= 750 && credit_score <= 900) {
            score_performance = "Excellent";
            setPerformanceColor(color[4]);
            score_desc = "Loan approval probability is extremely high with a very high CIBIL score, indicating excellent creditworthiness and reliability.";
            score_deg = 240 + (36 * 4) + (credit_score / 900);
            setScoreIndicator(score_deg);

        }
        setCreditPerformance(score_performance);
        setCreditDesc(score_desc);
    };
    useEffect(() => {
        document.body.classList.add('tooltipDemo');

        return function cleanup() {
            document.body.classList.remove('tooltipDemo');
        };
    }, []);
    return (
        <>
            <div className={`${creditreport.CreditReportboxss}`}>
                <div className={` ${creditreport.Texttitle} ${creditreport.creditmeter} mt-0 pt-4 custom-color`}>
                    {
                        checkScore ? "" :
                            <>
                                <div style={{ color: "#042b62", marginTop: ".7rem" }}>
                                    Track your <span style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#042b62 !important" }} className="custom-color">Credit Score</span> <br /> for
                                    <span style={{ fontSize: "1.4rem", fontWeight: "bold", }}> FREE</span> in 2 mins!
                                </div>
                                <div>
                                    <div style={{
                                        color: "#1A1A1A",
                                        fontSize: ".8rem",
                                        fontWeight: "400"
                                    }} className="pt-2">Get instant access to your credit score with 100% <br /> confidentiality assured!</div>
                                    <div>
                                        <div className={`mt-3 ${creditreport.refreshbtn}`}>
                                            <button onClick={() => {
                                                // setCheckScore(true);
                                                props.setOpenModalByName("Fecth_your_Loan");
                                            }} style={{ marginLeft: '0' }} className="custom-background-color">Click Here</button>
                                        </div>
                                    </div>
                                    <div className="pt-3">
                                        <div style={{
                                            fontSize: "1rem",
                                            fontWeight: "400"
                                        }}>
                                            <div style={{
                                                // display: "flex",
                                                // alignItems: "center"
                                            }}>

                                                <div style={{ color: "#1A1A1A", fontSize: ".9rem" }}>
                                                    Soft queries do not have any impact <br />on the CIBIL score.    <span className="ms-2">
                                                        <OverlayTrigger
                                                            delay={{ hide: 10, show: 30 }}
                                                            overlay={(props) => (
                                                                <Tooltip  {...props}>
                                                                    <div className={`${creditreport.tooltipDataa}`} >
                                                                        Reviewing your credit score through the official CIBIL website or other apps constitutes a soft inquiry, which has no impact on your credit score. Therefore, you can monitor your credit activities by routinely reviewing your credit report.
                                                                    </div>
                                                                </Tooltip>
                                                            )}
                                                            placement="top"
                                                        ><img className="pointer" data-tip data-for="registerTip" src={require('./info.png')} style={{ width: '.8rem', display: "inline-flex" }} />
                                                        </OverlayTrigger>
                                                    </span>
                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </>
                    }
                </div>

                {
                    checkScore ? <>
                        <div className={`${creditreport.creditmeter}`}>
                            <div className={` ${creditreport.creditscoremeter}`}>
                                {/* <div className={`${creditreport.creditscoremetertitle}`}>Credit Score - <span>730 <span style={{}}></span>900 </span></div> */}
                                <div className="d-flex align-items-center">
                                    <div className={`${creditreport.creditscoremetertitle}`}>Credit Score -</div>
                                    <div style={
                                        {
                                            fontSize: "1.4rem",
                                            fontWeight: "bold"
                                        }
                                    } className="d-flex ms-3">
                                        <div>{creditScore}</div>
                                        <div style={{
                                            border: "1px solid #042b62",
                                            height: "25px",
                                            left: "50%",
                                            // marginLeft: "-3px",
                                            top: "0",
                                            margin: "4px 10px"

                                        }}></div>
                                        <div>900</div>
                                    </div>
                                    {equifaxDetails?.can_refresh == true ?
                                        <div onClick={() => {
                                            handleRefreshLoans(equifaxDetails?.id,
                                                equifaxDetails?.member_id, equifaxDetails?.first_name);
                                        }} className="ms-3" style={{
                                            color: "#042b62",
                                            fontWeight: "600",
                                            fontSize: "1.2rem"
                                        }}>
                                            <MdRefresh />
                                            <span className="ps-1 pointer">Refresh</span>
                                        </div>
                                        :
                                        <div onClick={() => { handleDisableRefresh() }} id="refresh-disable"
                                            className="Cancel  ms-3"
                                            style={{
                                                userSelect: "none",
                                                opacity: .5,
                                                backgroundColor: "none",
                                                color: "#042b62",
                                                fontWeight: "600",
                                                fontSize: "1.2rem"
                                            }}>
                                            <MdRefresh />
                                            <span className="ps-1 ">Refresh</span>
                                        </div>

                                    }
                                </div>
                                <div className="d-flex">
                                    <div>
                                        <div>
                                            <CreditScorecard width={179} creditScore={creditScore}
                                                scoreIndicator={scoreIndicator}
                                                performanceColor={performanceColor} />
                                            {equifaxDetails.refreshDate &&
                                                <>
                                                 <div className="mt-4 " style={{ color: "gray", fontSize: ".8rem" }}>
                                                    Last Updated Date: {equifaxDetails.last_updated}</div>
                                                    <div style={{
                                                        padding: "1px 0px"
                                                    }} className="d-flex justify-content-between">
                                                        <div style={{ color: "gray", fontSize: ".8rem" }}>
                                                            Next Update Date: {equifaxDetails.refreshDate}
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>

                                        <div
                                            className={`d-none mt-3 ${creditreport.refreshbtn}`}
                                        >

                                            {equifaxDetails?.can_refresh == true ?
                                                <>
                                                    {/* <button
                                                id="refresh-enable"
                                                className="Cancel position-relative"
                                                style={{ backgroundColor: "none" }}
                                                onClick={() => {
                                                    handleRefreshLoans(equifaxDetails?.id,
                                                        equifaxDetails?.member_id, equifaxDetails?.first_name);
                                                }}
                                            >
                                                Refresh
                                            </button> */}
                                                    <button className="Cancel position-relative custom-background-color custom-border-color"
                                                        onClick={() => {
                                                            handleRefreshLoans(equifaxDetails?.id,
                                                                equifaxDetails?.member_id, equifaxDetails?.first_name);
                                                        }}>
                                                        Refresh
                                                    </button>
                                                </>

                                                :
                                                <>
                                                    {/* <div onMouseEnter={() => {console.log("ppp")}}>
                                                <p
                                                    style={{ backgroundColor: "none"}}
                                                    // data-for={`loan-${equifaxDetails?.id}`}
                                                    // data-tip
                                                    // data-disabled="false"
                                                    onClick={()=>{}}
                                                    className="Cancel RefreshDisable disabled"
                                                    // onMouseEnter={() => {setShowRefreshMessage(true);
                                                    // }}
                                                    // onMouseLeave={() => {setShowRefreshMessage(false)}}
                                                >
                                                    {/* Refresh */}
                                                    {/* </p>
                                                </div>
                                                 <br/> */}
                                                    {/* <p  onMouseMoveCapture={() => console.log("hey1")}
                                                >Hello Refresh</p>  */}

                                                    {/* <div onMouseEnter={() => {console.log("hey2"); setShowRefreshMessage(true);}}
                                                    onMouseLeave={() => {setShowRefreshMessage(false);}}
                                                >
                                                    {/* how are you? */}
                                                    {/* <button
                                                        className="Cancel"
                                                        style={{
                                                            userSelect : "none",
                                                            opacity : .5,
                                                            backgroundColor: "none"
                                                        }}
                                                        onClick={handleDisableRefresh()}
                                                    >Refresh</button>
                                                </div>  */}

                                                    <div
                                                    //  onMouseEnter={() => {console.log("hey2"); setShowRefreshMessage(true);}}
                                                    //     onMouseLeave={() => {setShowRefreshMessage(false);
                                                    // }}
                                                    >
                                                        {/* how are you? */}
                                                        <button
                                                            id="refresh-disable"
                                                            className="Cancel custom-background-color custom-border-color"
                                                            style={{
                                                                userSelect: "none",
                                                                opacity: .5,
                                                                backgroundColor: "none"
                                                            }}
                                                            onClick={() => { handleDisableRefresh() }}
                                                        >Refresh</button>
                                                    </div>
                                                    {/* <ReactTooltip className="Refresh-tooltip" 
                                                id={`loan-${equifaxDetails?.id}`} 
                                                place="right" type="light">
                                                    {/* <div>you can update your loan details.</div> */}
                                                    {/* <div>On {equifaxDetails.refreshDate}, you can update your loan details.</div>
                                                </ReactTooltip> */}
                                                </>
                                            }

                                        </div>
                                    </div>
                                    <div className="ms-3">
                                        <div className={`${creditreport.ReportStatus} mt-2 `} style={{
                                            // width: "240px",
                                            paddingTop: "0rem"
                                        }}>
                                            <div
                                                style={{
                                                    color: creditPerformance ? performanceColor : ""
                                                }}
                                                className={`${creditreport.creditperformancetxt}`}>
                                                {creditPerformance}

                                            </div>
                                            <div>
                                                {/* There's a chance for loan approval with a CIBIL score in this category, but it may necessitate addressing certain credit issues. */}

                                                {creditDesc}
                                            </div>
                                        </div>
                                        <div className="position-relative mt-2">
                                            <div style={{
                                                padding: "1px 5px"
                                            }} className="d-flex justify-content-end">
                                               
                                                <div className="d-flex justify-content-start align-items-center">
                                                    <div style={{ fontSize: ".8rem" }}>Powered By</div>
                                                    <div className="ms-2">
                                                        <img
                                                            alt="meter"
                                                            style={{ width: "40px", }}
                                                            src={process.env.REACT_APP_STATIC_URL + 'media/DG/Equifax.png'}
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="mt-3 position-relative">
                                <div 
                                className={`${creditreport.refreshbtn}`}
                                >
                                    <button>Refresh</button>
                                    </div>
                            </div> */}

                        </div>

                    </> :
                        <></>
                }

            </div >
        </>
    );
};
export default CreditReport;
