import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BootStrapModal from "react-bootstrap/Modal";
import styles from "../../../MainHeader/style.module.css";
import style from "./../../../CommonDashboard/style.module.css";
import {
  ADVISORY_DOWNLOAD_REPORT_SIDEBAR,
  CHECK_SESSION,
} from "../../../../constants";
import { imagePath } from "../../../../constants";
import {
  apiCall,
  getItemLocal,
  getParentUserId,
} from "../../../../common_utilities";
import apiClient from "../../../../FrappeIntegration-Services/services/apiClient";
import FintooLoader from "../../../FintooLoader";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { useDispatch, useSelector } from "react-redux";
import { sendMail } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";

// src/components/MainHeader/style.module.css
const SlideBar = () => {
  const url = window.location.pathname.split("/").pop();
  const [openMenu, setOpenMenu] = useState(false);
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportValue, setReportValue] = useState(1);
  const [sessionData, setSessionData] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const reportDownloadStatus = useSelector(state => state.reportDownload);

  useEffect(() => {
    // Function will retrigger on URL change
    // checksession();
    window.scrollTo(0, 0);
  }, [url]);

  const user_data = getItemLocal("user_data")
  const userid = getParentUserId();
  const checksession = async () => {
    // try {
    //   let url = CHECK_SESSION;
    //   let data = { user_id: userid, sky: getItemLocal("sky") };
    //   let session_data = await apiCall(url, data, true, false);
    //   setSessionData(session_data["data"]);
    // } catch (e) {
    //   setError(true);
    // }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (reportDownloadStatus == 1) {
        // Get user_id from local storage instead of sessionData
        const userId = getParentUserId();

        dispatch({ type: "REPORT_DOWNLOAD_STATUS", payload: 0 });
        try {
          const downloadReport = async (summaryreport) => {
            const apiUrl = `${ADVISORY_DOWNLOAD_REPORT_SIDEBAR}?user_id=${userId}&filename=all&merge=all&summary_report=${summaryreport}`;

            const response = await apiClient(apiUrl, { method: 'GET' });

            if (response.status_code === "200" && response.message === "success") {
              if (summaryreport == 0) {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.success("Your report is ready to download.");
              }
            }
          };

          // Directly call the download reports without status checks
          await downloadReport(1); // Summary report
          await downloadReport(0); // Detailed report
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchData();
  }, [reportDownloadStatus]);

  const handleButtonClick = (type, action) => {
    setReportType(type);
    if (action == "open") {
      setOpenModal(true);
    }
    if (action == "close") {
      setOpenModal(false);
      setReportValue(1);
    }
  };

  const downloadReport = async () => {
    setLoading(true);

    // Map reportValue to summary_report parameter
    // reportValue 1 = summary report (summary_report=1)
    // reportValue 2 = detailed report (summary_report=0)
    const summaryReportParam = reportValue === 1 ? 1 : 0;

    try {
      // Get user_id from local storage
      const userId = getParentUserId();

      const apiUrl = `${ADVISORY_DOWNLOAD_REPORT_SIDEBAR}?user_id=${userId}&filename=all&merge=all&summary_report=${summaryReportParam}`;

      const response = await apiClient(apiUrl, { method: 'GET' });

      if (response.status_code === "200" && response.message === "success") {
        const d_url = response.data;
        const filename = `report_${summaryReportParam === 1 ? 'summary' : 'detailed'}.pdf`;

        setTimeout(async () => {
          if (reportType == "pdf") {
            window.open(d_url, "_blank");
            setLoading(false);
            toastr.options.positionClass = "toast-bottom-left";
            toastr.success("Report pdf generated successfully.");
          } else if (reportType == "print") {
            printPdf(d_url);
            setLoading(false);
          } else {
            const subject = summaryReportParam === 1
              ? "Download your customised summary report from Fintoo!"
              : "Download your customised detailed report from Fintoo!";

            var emaildata = {
              userdata: { to: user_data["user_email"] },
              subject: subject,
              template: "reportpdf.html",
              contextvar: {
                encodeduserid: btoa("00" + userId),
                filename: filename,
                fullname: user_data["user_name"],
                id: userId,
                report_url: d_url,
              },
            };

            let resp = await sendMail(emaildata);
            setLoading(false);
            toastr.options.positionClass = "toast-bottom-left";
            toastr.success("Report pdf mailed successfully.");
          }
          setOpenModal(false);
          setReportValue(1);
          setReportType("");
        }, 1000);

      } else {
        setLoading(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Failed to generate report. Please try again.");
        setOpenModal(false);
        setReportValue(1);
        setReportType("");
      }
    } catch (error) {
      console.error("Error in downloadReport:", error);
      setLoading(false);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("We apologize, but we're currently experiencing technical difficulties. Please try again later.");
      setOpenModal(false);
      setReportValue(1);
      setReportType("");
    }
  };

  const printPdf = (url) => {
    var iframe = document.createElement("iframe");
    document.body.appendChild(iframe);

    iframe.style.display = "none";
    iframe.onload = function () {
      setTimeout(function () {
        iframe.focus();
        iframe.contentWindow.print();
      }, 1);
    };

    iframe.src = url;
  };

  useEffect(()=>{
    if(reportType!="" && reportValue == 1){
      downloadReport()
    }
  },[reportType,reportValue])
  return (
    <>
      <FintooLoader isLoading={loading} />
      <div className="sidebar d-none d-md-block" id="menu-sidebar">
        <div className="top-left-block">
          <a href="/" target="_self" className="logo">
            <img src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"} alt="Fintoo Logo" />
          </a>
          <a
            href=""
            ng-click="removeClassFromId('menu-sidebar')"
            className="mobile-menu-close-btn"
          >
            ×
          </a>
          <div className="download-box">
            {hide ? (
              <>
                <div className="download-icons text-center">
                  <div className="close-download">
                    <img
                      onClick={() => {
                        setHide(false);
                      }}
                      src={
                        imagePath +
                        "/static/media/DG/reports/cross.svg"
                      }
                      alt=""
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "500",
                    }}
                  >
                    Click Here
                  </span>

                  <a
                    href="javascript:void(0)"
                    download
                    // style={{ display: "none" }}
                    id="_download_click"
                  />
                  <ul className="download-btns">
                    <li>
                      <a
                        href
                        className="email download-step2"
                        data-type="email"
                        data-text="Sending Email..."
                        // onClick={() => handleButtonClick("email", "open")}
                        onClick={() => {
                          setReportType("email");
                          setReportValue(1);
                        }}
                      >
                        Email
                      </a>
                    </li>
                    <li>
                      <a
                        href
                        className="pdf download-step2"
                        data-type="pdf"
                        data-text="Downlading PDF..."
                        // onClick={() => handleButtonClick("pdf", "open")}
                        onClick={() => {
                          setReportType("pdf");
                          setReportValue(1);
                        }}

                      >
                        PDF
                      </a>
                    </li>
                    <li>
                      <a
                        href
                        className="print download-step2"
                        data-type="print"
                        data-text="Printing Report..."
                        // onClick={() => handleButtonClick("print", "open")}
                        onClick={() => {
                          setReportType("print");
                          setReportValue(1);
                        }}
                      >
                        Print
                      </a>
                    </li>
                  </ul>
                  {openModal && (
                    <BootStrapModal show={openModal} centered>
                      <BootStrapModal.Body>
                        <div className={style.row}>
                          <div className="row">
                            <div className="col-12">
                              <div className="row">
                                <div className="col-md-4">Report Type:</div>
                                <div className="col-md-4">
                                  <div className="d-flex align-items-center">
                                    <input
                                      type="radio"
                                      name="dwn_opt_report"
                                      value={reportValue}
                                      onChange={() => {
                                        setReportValue(1);
                                      }}
                                      checked={reportValue == 1}
                                    />
                                    <div className="ps-2">Summary</div>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="d-flex align-items-center">
                                    <input
                                      type="radio"
                                      name="dwn_opt_report"
                                      value={reportValue}
                                      onChange={() => {
                                        setReportValue(2);
                                      }}
                                      checked={reportValue == 2}
                                    />
                                    <div className="ps-2">Detail</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-center">
                          <button
                            type="button"
                            className={style.outlineBtn}
                            onClick={() => downloadReport()}
                          >
                            Submit
                          </button>
                          <button
                            type="button"
                            className={style.outlineBtn}
                            onClick={() => {
                              handleButtonClick("", "close");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </BootStrapModal.Body>
                    </BootStrapModal>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="download-btn-container active">
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: "500",
                    }}
                  >
                    Click Here
                  </div>
                  <a
                    onClick={() => {
                      setHide(true);
                    }}
                    href
                    className="download-btn pointer"
                  >
                    Download
                  </a>
                </div>
              </>
            )}
            <div className="download-process d-none">
              <span className="download-progress">
                <svg
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                >
                  <circle
                    className="cls-1"
                    cx={25}
                    cy={25}
                    r="22.44"
                    fill="none"
                    stroke="#042b62"
                    strokeWidth={1}
                    style={{ opacity: "0.1" }}
                  />
                  <circle
                    id="bar"
                    className="cls-1"
                    cx={25}
                    cy={25}
                    r="22.44"
                    fill="transparent"
                    stroke="#042b62"
                    strokeWidth={2}
                    strokeDasharray={112}
                    strokeDashoffset={0}
                  />
                </svg>
              </span>
              <p className="download-text">PDF Downloading...</p>
            </div>
          </div>
        </div>
        <div className="navigation-container left-scroll">
          {/* ngInclude: '/static/template/navigation.html' */}
          <div
            ng-include="'/static/template/navigation.html'"
            className=""
            style={{}}
          >
            <ul className="right-navigation ">
              <li>
                <Link
                  to={process.env.PUBLIC_URL + "/report/intro"}
                  className={url == "intro" ? "active" : ""}
                  style={{}}
                >
                  <img
                    src={
                      imagePath +
                      "/static/media/DG/reports/left-nav/nav-intro.svg"
                    }
                    alt="Introduction"
                  />{" "}
                  Introduction
                  {/* <span className="required">*</span>
                  <span className="navtick tick" id="tick_about_you_id" /> */}
                </Link>
              </li>
              <li className="income-expenses navigation-icon">
                <Link
                  to={process.env.PUBLIC_URL + "/report/profile"}
                  className={url == "profile" ? "active" : ""}
                  style={{}}
                >
                  <img
                    src={
                      imagePath +
                      "/static/media/DG/reports/left-nav/nav-profile.svg"
                    }
                    alt="Your Profile"
                  />{" "}
                  Your Profile
                  {/* <span className="required">*</span>
                  <span className="navtick tick" id="tick_inncAndExp_id" /> */}
                </Link>
              </li>
              <li className="income-expenses navigation-icon">
                <Link
                  to={process.env.PUBLIC_URL + "/report/assets-liabilities"}
                  className={url == "assets-liabilities" ? "active" : ""}
                  style={{}}
                >
                  <img
                    src={
                      imagePath +
                      "/static/media/DG/reports/left-nav/nav-assets.svg"
                    }
                    alt="Your Profile"
                  />{" "}
                  Assets &amp; Liabilities
                  {/* <span className="required">*</span>
                  <span className="navtick tick" id="tick_inncAndExp_id" /> */}
                </Link>
              </li>
              <li className="assets-liabilities navigation-icon">
                <Link
                  to={process.env.PUBLIC_URL + "/report/goal-analysis"}
                  className={url == "goal-analysis" ? "active" : ""}
                >
                  <img
                    src={
                      imagePath +
                      "/static/media/DG/reports/left-nav/nav-goal.svg"
                    }
                    alt=""
                  />{" "}
                  Goal Analysis
                  {/* <span className="required">*</span>
                  <span className="navtick tick" id="tick_assetandliab_id" /> */}
                </Link>
              </li>
              <li className="insurance navigation-icon">
                <Link
                  to={process.env.PUBLIC_URL + "/report/risk-management"}
                  className={url == "risk-management" ? "active" : ""}
                >
                  <img
                    src={
                      imagePath +
                      "/static/media/DG/reports/left-nav/nav-risk.svg"
                    }
                    alt="Insurance"
                  />{" "}
                  Contingency Planning
                  {/* <span className="navtick tick" id="tick_insurance_id" /> */}
                </Link>
              </li>
              <li className="document navigation-icon">
                <Link
                  to={process.env.PUBLIC_URL + "/report/cash-flow-management"}
                  className={url == "cash-flow-management" ? "active" : ""}
                >
                  <img
                    src={
                      imagePath +
                      "/static/media/DG/reports/left-nav/nav-cashflow.svg"
                    }
                    alt=""
                  />{" "}
                  Cashflow Analysis
                  {/* <span className="navtick tick" id="tick_my_document_id" /> */}
                </Link>
              </li>

              <li className="dashboard-summary navigation-icon">
                <Link
                  to={process.env.PUBLIC_URL + "/report/retirement-corpus"}
                  className={url == "retirement-corpus" ? "active" : ""}
                >
                  <img
                    src={
                      imagePath +
                      "/static/media/DG/reports/left-nav/nav-retirement.svg"
                    }
                    alt=""
                  />
                  Retirement Planning
                  {/* <span className="navtick tick" id="tick_summary_id" /> */}
                </Link>
              </li>
              <li className="dashboard-summary navigation-icon">
                {/* <Link
                  to={"/datagathering/about-you"}
                  className={url == "about-you" ? "active" : ""}
                  style={{}}
                >
                  <img
                    src="static/media/DG/reports/left-nav/nav-data-gathering.svg"
                    alt=""
                  />
                  Data-gathering */}
                {/* <span className="navtick" id="tick_summary_id" /> */}
                {/* </Link> */}
                <a
                  href={process.env.PUBLIC_URL + "/datagathering/about-you"}
                  className={url == "about-you" ? "active" : ""}
                >
                  <img
                    src={
                      imagePath +
                      "/static/media/DG/reports/left-nav/nav-data-gathering.svg"
                    }
                    alt=""
                  />
                  Data-gathering
                </a>
              </li>
              <li className="dashboard-summary navigation-icon">
                <a
                  style={{ display: "block" }}
                  href={process.env.PUBLIC_URL + "/commondashboard"}
                  target="_self"
                >
                  <img
                    src={
                      imagePath +
                      "/static/media/DG/reports/left-nav/nav-summary.svg"
                    }
                    alt=""
                  />
                  Dashboard
                  {/* <span className="navtick" id="tick_summary_id" /> */}
                </a>
              </li>
            </ul>
            <ul className="mobile-bottom-nav ">
              <li>
                <a href="/logout" target="_self">
                  Logout
                </a>
              </li>
              <li>
                <a href="/" target="_self">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="sidebarMobile d-block d-md-none" id="menu-sidebar">
        <div
          className={styles["RP-menu-button"]}
          onClick={() => setOpenMenu(true)}
        >
          {openMenu ? (
            <></>
          ) : (
            <>
              <div className="d-flex justify-content-between">
                <div className="ms-2">
                  <img
                    className={`${styles.mobileImg}`}
                    width={40}
                    src={imagePath + "/static/media/Images/assets/img/mobile-menu-icon.svg"}
                  />
                </div>
                <div className={`${styles.Logo}`}>
                  <img
                    width={80}
                    src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
                  />
                </div>
              </div>
            </>
          )}
          {/*           
          <div></div> */}
        </div>
        <div
          className={`${styles["RP-mobile-menu-wrapper"]} ${openMenu ? styles["active"] : ""
            } `}
          id="hamburger"
        >
          <div className={styles[""]}>
            <a
              onClick={() => setOpenMenu(false)}
              className={styles["close-menu"]}
            >
              ×
            </a>
          </div>
          <div className="top-left-block">
            <a href="/" target="_self" className="logo">
              <img src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"} />
            </a>
            <a
              href=""
              ng-click="removeClassFromId('menu-sidebar')"
              className="mobile-menu-close-btn"
            >
              ×
            </a>
            <div className="download-box">
              <div className="download-btn-container active">
                <div>Click Here</div>
                <a href className="download-btn">
                  Download
                </a>
              </div>
              <div className="download-icons">
                <div className="close-download">
                  <img
                    src={
                      imagePath +
                      "/static/media/DG/reports/cross.svg"
                    }
                    alt=""
                  />
                </div>
                <span>Click Here</span>
                <a
                  href="javascript:void(0)"
                  download
                  style={{ display: "none" }}
                  id="_download_click"
                />
                <ul className="download-btns">
                  <li>
                    <a
                      href
                      className="email download-step2"
                      data-type="email"
                      data-text="Sending Email..."
                    >
                      Email
                    </a>
                  </li>
                  <li>
                    <a
                      href
                      className="pdf download-step2"
                      data-type="pdf"
                      data-text="Downlading PDF..."
                    >
                      PDF
                    </a>
                  </li>
                  <li>
                    <a
                      href
                      className="print download-step2"
                      data-type="print"
                      data-text="Printing Report..."
                    >
                      Print
                    </a>
                  </li>
                </ul>
              </div>
              <div className="download-process">
                <span className="download-progress">
                  <svg
                    id="Layer_1"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                  >
                    <circle
                      className="cls-1"
                      cx={25}
                      cy={25}
                      r="22.44"
                      fill="none"
                      stroke="#042b62"
                      strokeWidth={1}
                      style={{ opacity: "0.1" }}
                    />
                    <circle
                      id="bar"
                      className="cls-1"
                      cx={25}
                      cy={25}
                      r="22.44"
                      fill="transparent"
                      stroke="#042b62"
                      strokeWidth={2}
                      strokeDasharray={112}
                      strokeDashoffset={0}
                    />
                  </svg>
                </span>
                <p className="download-text">PDF Downloading...</p>
              </div>
            </div>
          </div>
          <div className="navigation-container left-scroll">
            {/* ngInclude: '/static/template/navigation.html' */}
            <div
              ng-include="'/static/template/navigation.html'"
              className=""
              style={{}}
            >
              <ul className="right-navigation ">
                <li>
                  <Link
                    to={process.env.PUBLIC_URL + "/report/intro"}
                    className={url == "intro" ? "active" : ""}
                    style={{}}
                  >
                    <img
                      src={
                        imagePath +
                        "/static/media/DG/reports/left-nav/nav-intro.svg"
                      }
                      alt="Introduction"
                    />{" "}
                    Introduction
                    {/* <span className="required">*</span>
                  <span className="navtick tick" id="tick_about_you_id" /> */}
                  </Link>
                </li>
                <li className="income-expenses navigation-icon">
                  <Link
                    to={process.env.PUBLIC_URL + "/report/profile"}
                    className={url == "profile" ? "active" : ""}
                    style={{}}
                  >
                    <img
                      src={
                        imagePath +
                        "/static/media/DG/reports/left-nav/nav-profile.svg"
                      }
                      alt="Your Profile"
                    />{" "}
                    Your Profile
                    {/* <span className="required">*</span>
                  <span className="navtick tick" id="tick_inncAndExp_id" /> */}
                  </Link>
                </li>
                <li className="income-expenses navigation-icon">
                  <Link
                    to={process.env.PUBLIC_URL + "/report/assets-liabilities"}
                    className={url == "assets-liabilities" ? "active" : ""}
                    style={{}}
                  >
                    <img
                      src={
                        imagePath +
                        "/static/media/DG/reports/left-nav/nav-assets.svg"
                      }
                      alt="Your Profile"
                    />{" "}
                    Assets &amp; Liabilities
                    {/* <span className="required">*</span>
                  <span className="navtick tick" id="tick_inncAndExp_id" /> */}
                  </Link>
                </li>
                <li className="assets-liabilities navigation-icon">
                  <Link
                    to={process.env.PUBLIC_URL + "/report/goal-analysis"}
                    className={url == "goal-analysis" ? "active" : ""}
                  >
                    <img
                      src={
                        imagePath +
                        "/static/media/DG/reports/left-nav/nav-goal.svg"
                      }
                      alt=""
                    />{" "}
                    Goal Analysis
                    {/* <span className="required">*</span>
                  <span className="navtick tick" id="tick_assetandliab_id" /> */}
                  </Link>
                </li>
                <li className="insurance navigation-icon">
                  <Link
                    to={process.env.PUBLIC_URL + "/report/risk-management"}
                    className={url == "risk-management" ? "active" : ""}
                  >
                    <img
                      src={
                        imagePath +
                        "/static/media/DG/reports/left-nav/nav-risk.svg"
                      }
                      alt="Insurance"
                    />{" "}
                    Contingency Planning
                    {/* <span className="navtick tick" id="tick_insurance_id" /> */}
                  </Link>
                </li>
                <li className="document navigation-icon">
                  <Link
                    to={process.env.PUBLIC_URL + "/report/cash-flow-management"}
                    className={url == "cash-flow-management" ? "active" : ""}
                  >
                    <img
                      src={
                        imagePath +
                        "/static/media/DG/reports/left-nav/nav-cashflow.svg"
                      }
                      alt=""
                    />{" "}
                    Cashflow Analysis
                    {/* <span className="navtick tick" id="tick_my_document_id" /> */}
                  </Link>
                </li>

                <li className="dashboard-summary navigation-icon">
                  <Link
                    to={process.env.PUBLIC_URL + "/report/retirement-corpus"}
                    className={url == "retirement-corpus" ? "active" : ""}
                  >
                    <img
                      src={
                        imagePath +
                        "/static/media/DG/reports/left-nav/nav-retirement.svg"
                      }
                      alt=""
                    />
                    Retirement Planning
                    {/* <span className="navtick tick" id="tick_summary_id" /> */}
                  </Link>
                </li>
                <li className="dashboard-summary navigation-icon">
                  {/* <Link
                  to={"/datagathering/about-you"}
                  className={url == "about-you" ? "active" : ""}
                  style={{}}
                >
                  <img
                    src="https://www.fintoo.in/static/media/DG/reports/left-nav/nav-data-gathering.svg"
                    alt=""
                  />
                  Data-gathering */}
                  {/* <span className="navtick" id="tick_summary_id" /> */}
                  {/* </Link> */}
                  <a
                    href="/datagathering/about-you"
                    className={url == "about-you" ? "active" : ""}
                  >
                    <img
                      src={
                        imagePath +
                        "/static/media/DG/reports/left-nav/nav-data-gathering.svg"
                      }
                      alt=""
                    />
                    Data-gathering
                  </a>
                </li>
                <li className="dashboard-summary navigation-icon">
                  <a
                    style={{ display: "block" }}
                    href={process.env.PUBLIC_URL + "/commondashboard"}
                    target="_self"
                  >
                    <img
                      src={
                        imagePath +
                        "/static/media/DG/reports/left-nav/nav-summary.svg"
                      }
                      alt=""
                    />
                    Dashboard
                    {/* <span className="navtick" id="tick_summary_id" /> */}
                  </a>
                </li>
              </ul>
              <ul className="mobile-bottom-nav ">
                <li>
                  <a href="/logout" target="_self">
                    Logout
                  </a>
                </li>
                <li>
                  <a href="/" target="_self">
                    Dashboard
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SlideBar;
