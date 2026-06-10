import React, { useEffect, useRef, useState } from "react";
import Styles from "../../Pages/DMF/Portfolio/report.module.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import FintooLoader from "../FintooLoader";
import FintooInlineLoader from "../FintooInlineLoader";
import Modal from "react-responsive-modal";
import ELSSReportView from "../../Pages/DMF/Portfolio/reports/AssetCategoriesDetailsViews/ELSSReportView";
import {
  apiCall,
  fetchEncryptData,
  getItemLocal,
  getParentUserId,
  getUserId,
} from "../../common_utilities";
import commonEncode from "../../commonEncode";
import Cookies from 'js-cookie';
import apiClient from "../../FrappeIntegration-Services/services/apiClient";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { SendMailFile } from "../../Pages/MFSnippet/Service/MessagingService";
import Reportmodal from "../CommonDashboard/Report/Reportmodal";
import { ADVISORY_DOWNLOAD_REPORT, DATA_BELONGS_TO, FRAPPE_API_URL, SUPPORT_EMAIL } from "../../constants";
import { sendMail } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { Getpaymentstatus } from "../../FrappeIntegration-Services/services/payment-api/paymentapiService";
import { GetDocumentDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/document";
import KYCPopup from "../CommonDashboard/KYCPopup";

const AdvisoryReportUI = ({ reportsData, fetchReportsData }) => {
  const repdata = {
    fileD: "",
    fileP: "",
    fileS: "",
  };
  const [file, setFile] = useState(repdata);
  const [showELSSPopup, setShowELSSPopup] = useState(false);
  const btnDownloadRef = useRef();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState("");
  const [reportValue, setReportValue] = useState(1);
  const [reportType, setReportType] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [spinneremail, setSpinneremail] = useState(0);
  const [showReportmodal, setShowReportmodal] = useState(false);
  const [emailLoading, setEmailLoading] = useState({ PAR: false, MF: false });
  // const [kycModal, setKycModal] = useState(false);
  // const [kycDone, setKycDone] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user_data") || '{}');

  useEffect(() => {
    // getDocument();
    initializeUserData();
  }, []);

  const initializeUserData = () => {
    try {
      // Try to get user data from multiple sources
      let userData = {};
      let userEmail = "";
      let userName = "";
      let userId = null;

      // 1. Try to get from cookies user_data
      const userDataFromCookies = Cookies.get('user_data');
      if (userDataFromCookies) {
        try {
          userData = JSON.parse(userDataFromCookies);
          userEmail = userData.email || userData.user_email || "";
          userName = userData.name || userData.user_name || "";
          userId = userData.user_id || userData.id;
        } catch (e) {
          console.warn('Failed to parse user_data from cookies:', e);
        }
      }

      // 2. Try to get from localStorage user_data
      if (!userEmail || !userId) {
        const userDataFromLocalStorage = localStorage.getItem('user_data');
        if (userDataFromLocalStorage) {
          try {
            userData = JSON.parse(userDataFromLocalStorage);
            userEmail = userData.email || userData.user_email || "";
            userName = userData.name || userData.user_name || "";
            userId = userData.user_id || userData.id;
          } catch (e) {
            console.warn('Failed to parse user_data from localStorage:', e);
          }
        }
      }

      // 3. Try to get from member data in localStorage
      if (!userEmail || !userName) {
        try {
          const memberData = localStorage.getItem("member");
          if (memberData) {
            const members = JSON.parse(commonEncode.decrypt(memberData));
            const currentUserId = getUserId() || getParentUserId();
            const currentUser = members.find(member => member.id == currentUserId);

            if (currentUser) {
              userEmail = userEmail || currentUser.email || "";
              userName = userName || currentUser.name || currentUser.user_name || "";
              userId = userId || currentUser.id;
            }
          }
        } catch (e) {
          console.warn('Failed to get user data from member:', e);
        }
      }

      // 4. Get user ID if still not found
      if (!userId) {
        userId = getUserId() || getParentUserId();
      }

      // Split name into first and last name
      const nameParts = userName.split(' ');
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(' ') || "";

      // Create session data object
      const sessionData = {
        id: userId,
        email: userEmail,
        user_details: {
          first_name: firstName,
          last_name: lastName
        },
        fp_lifecycle_status: 2,
        fp_log_id: getItemLocal("fp_log_id") || "",
      };

      setSessionData(sessionData);


    } catch (error) {
      console.error("Error initializing user data:", error);
      // Fallback with minimal data
      const fallbackSessionData = {
        id: getParentUserId() || getUserId(),
        email: "",
        user_details: {
          first_name: "User",
          last_name: ""
        },
        fp_lifecycle_status: 2,
        fp_log_id: "",
      };
      setSessionData(fallbackSessionData);
    }
  };

  const userid = getParentUserId();

  const sendReportMail = async (type, reportLink) => {
    try {
      // Set loading state based on type
      if (type === 'PAR' || type === 'MF') {
        setEmailLoading(prev => ({ ...prev, [type]: true }));
      }

      // Check if sessionData is available
      if (!sessionData || !sessionData.email) {


        // Try to reinitialize user data
        initializeUserData();

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "User email not found. Please ensure you are logged in and try again.",
            type: "error",
          },
        });
        if (type === 'PAR' || type === 'MF') {
          setEmailLoading(prev => ({ ...prev, [type]: false }));
        }
        return;
      }

      // Check if reportLink is available
      if (!reportLink) {

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Report not available for email. Please try again later.",
            type: "error",
          },
        });
        if (type === 'PAR' || type === 'MF') {
          setEmailLoading(prev => ({ ...prev, [type]: false }));
        }
        return;
      }



      let emailPayloadData = {};

      // Handle different report types - using exact payload structure
      if (type === 'SUMMARY') {
        emailPayloadData = {
          userdata: { to: userData["user_email"] },
          subject: 'Download your customised summary report from Fintoo!',
          // template: 'report_pdf.html',
          template: 'razorpay_payment_success.html',

          attachment_files: reportLink,
          contextvar: {
            client_name: userData["user_name"],
            attachment_name: "Summary Report"
          }
        };
      } else if (type === 'DETAILED') {
        emailPayloadData = {
          userdata: { to: userData["user_email"] },
          subject: 'Fintoo: Your Detailed Report is Ready!',
          template: 'welcome_expert_services.html',
          attachment_files: reportLink,
          contextvar: {
            client_name: userData["user_name"],
            attachment_name: "Detailed Report"
          }
        };
      } else if (type === 'MF') {
        emailPayloadData = {
          userdata: { to: userData["user_email"] },
          subject: 'Fintoo: Your Personalized Mutual Fund Screening Report is Here!',
          template: 'welcome_expert_services.html',
          attachment_files: reportLink,
          contextvar: {
            client_name: userData["user_name"],
            attachment_name: "MF Screening Report"
          }
        };
      } else if (type === 'PAR') {
        emailPayloadData = {
          userdata: { to: userData["user_email"] },
          subject: 'Fintoo: Your Personalized Portfolio Analysis Report Awaits!',
          template: 'welcome_expert_services.html',
          attachment_files: reportLink,
          contextvar: {
            client_name: userData["user_name"],
            attachment_name: "Portfolio Analysis Report"
          }
        };
      }



      // Use the API directly instead of SendMailFile since it's commented out
      const mailRes = await apiClient(FRAPPE_API_URL + "send_email", {
        method: "POST",
        body: JSON.stringify(emailPayloadData),
      });



      if (mailRes && (mailRes.status_code === 200 || mailRes.status_code === "200")) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Email sent successfully",
            type: "success",
          },
        });
      } else {

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Email not sent, Something went wrong...",
            type: "error",
          },
        });
      }
    } catch (error) {
      console.error("Error in sendReportMail:", error);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Failed to send email. Please try again.",
          type: "error",
        },
      });
    } finally {
      // Clear loading state
      if (type === 'PAR' || type === 'MF') {
        setEmailLoading(prev => ({ ...prev, [type]: false }));
      }
    }
  }

  // const getDocument = async () => {
  //   try {
  //     const res = await paymentStatus();
  //     if (res?.status_code == 200) {
  //       const payment_data = res.data
  //       let isKycDone = false;

  //       if (
  //         payment_data.plan_uuid === "fp_expert" &&
  //         payment_data.plan_name !== "Assisted Advisory"
  //       ) {
  //         const resDoc = await GetDocumentDetails(
  //           getParentUserId(),
  //           DATA_BELONGS_TO
  //         );

  //         if (resDoc?.status_code === 200) {
  //           isKycDone = resDoc.data.some(
  //             (doc) =>
  //               doc.document_cat_uuid === "e_aadhar" ||
  //               doc.document_cat_uuid === "panDirect"
  //           );
  //         }
  //       } else {
  //         isKycDone = true;
  //       }

  //       setKycDone(isKycDone);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const paymentStatus = async () => {
    const payload = {
      user_id: getParentUserId(),
      data_belongs_to: DATA_BELONGS_TO
    };
    const res = await Getpaymentstatus(payload);
    return res
  }

  useEffect(() => {
    const fetchData = async () => {
      if (sessionData) {
        const { id, fp_user_id, fp_log_id, fp_lifecycle_status, plan_id } = sessionData;

        if (fp_lifecycle_status == 2) {
          try {
            const downloadReport = async (summaryreport) => {
              const apiUrl = `${ADVISORY_DOWNLOAD_REPORT}?user_id=${id}&filename=all&merge=all&summary_report=${summaryreport}`;
              const response = await apiClient(apiUrl, {
                method: 'GET'
              });
              if (response.status_code === "200") {
                setFile(response.data)
                if (summaryreport == 0) {
                  // toastr.options.positionClass = "toast-bottom-left";
                  // toastr.success("Your report is ready to download.");
                  dispatch({
                    type: "RENDER_TOAST",
                    payload: {
                      message: "Your report is ready to email or download.",
                      type: "success",
                    },
                  });
                }
                setSpinner(0);
                setSpinneremail(0);
              }
            };

            const api_data = {
              fp_log_id: fp_log_id,
              user_id: id,
            };

            api_data.doc_type = "148";
            const config1 = {
              method: "POST",
              url: '',
              // url: ADVISORY_GET_SET_REPORT_STATUS,
              data: api_data,
            };

            const response1 = await fetchEncryptData(config1);

            if (response1.error_code === "100") {
              await downloadReport(1);
            }

            api_data.doc_type = "77";
            const config2 = {
              method: "POST",
              url: '',
              // url: ADVISORY_GET_SET_REPORT_STATUS,
              data: api_data,
            };

            const response2 = await fetchEncryptData(config2);

            if (response2.error_code === "100") {
              await downloadReport(0);
            }
          } catch (error) {
            console.error("Error:", error);
          }
        }
      }
      // else {
      //   dispatch({
      //     type: "RENDER_TOAST",
      //     payload: {
      //       message: "Please complete your profile.",
      //       type: "error",
      //     },
      //   });
      // }
    };

    fetchData();
  }, [sessionData]);

  const summaryReport = async () => {
    // if(!kycDone){
    //   setKycModal(true);
    //   setSpinner(0);
    //   setSpinneremail(0);
    // }
    // else{
      const newReportValue = 1;
      setReportValue(newReportValue);
      setReportType("pdf");
      setSpinner(2);
      downloadReport(newReportValue);
    // }
  };

  const summaryEmail = async () => {
    try {
      // if (!kycDone) {
      //   setSpinner(0);
      //   setSpinneremail(0);
      //   setKycModal(true);
      // }
      // else {

        setSpinneremail(1);

        // First call download API to get the report URL
        const user_id = getParentUserId();
        const summary_report = 1; // Summary report

        const apiUrl = `${ADVISORY_DOWNLOAD_REPORT}?filename=all&merge=all&user_id=${user_id}&summary_report=${summary_report}`;


        // const emailPayloadData = {
        //   userdata: { to: userData?.user_email },
        //   subject: 'Download your customised summary report from Fintoo!',
        //   template: 'reportpdf.html',
        //   attachment_files: reportLink,
        //   contextvar: { 
        //     client_name: userData["user_name"],
        //     attachment_name: "Summary Report"
        //   }
        // };

        // const response = await sendMail(emailPayloadData)
        const response = await apiClient(apiUrl, {
          method: 'GET'
        });

        if (response.status_code === "200") {
          // Extract the report URL from response
          let reportUrl = null;

          if (typeof response.data === 'string' && response.data.startsWith('http')) {
            reportUrl = response.data;
          } else if (response.data && response.data.download_url) {
            reportUrl = response.data.download_url;
          } else if (response.data && response.data.s3_url) {
            reportUrl = response.data.s3_url;
          } else if (response.data && response.data.url) {
            reportUrl = response.data.url;
          }

          if (reportUrl) {


            // Now send email with the report URL
            await sendReportMail('SUMMARY', reportUrl);
          } else {

            dispatch({
              type: "RENDER_TOAST",
              payload: {
                message: "Failed to get report URL for email.",
                type: "error",
              },
            });
          }
        } else {

          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Failed to generate report for email.",
              type: "error",
            },
          });
        }
      // }
    } catch (error) {
      console.error("Error in summaryEmail:", error);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Failed to send email. Please try again.",
          type: "error",
        },
      });
    } finally {
      setSpinneremail(0);
    }
  };

  const detailedReport = async () => {
    const newReportValue = 2;
    setReportValue(newReportValue);
    setReportType("pdf");
    downloadReport(newReportValue);
  };

  const detailedEmail = async () => {
    try {
      setSpinneremail(3);

      // First call download API to get the report URL
      const user_id = getParentUserId();
      const summary_report = 0; // Detailed report

      const apiUrl = `${ADVISORY_DOWNLOAD_REPORT}?filename=all&merge=all&user_id=${user_id}&summary_report=${summary_report}`;



      const response = await apiClient(apiUrl, {
        method: 'GET'
      });

      if (response.status_code === 200) {
        // Extract the report URL from response
        let reportUrl = null;

        if (typeof response.data === 'string' && response.data.startsWith('http')) {
          reportUrl = response.data;
        } else if (response.data && response.data.download_url) {
          reportUrl = response.data.download_url;
        } else if (response.data && response.data.s3_url) {
          reportUrl = response.data.s3_url;
        } else if (response.data && response.data.url) {
          reportUrl = response.data.url;
        }

        if (reportUrl) {


          // Now send email with the report URL
          await sendReportMail('DETAILED', reportUrl);
        } else {

          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Failed to get report URL for email.",
              type: "error",
            },
          });
        }
      } else {

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Failed to generate report for email.",
            type: "error",
          },
        });
      }
    } catch (error) {
      console.error("Error in detailedEmail:", error);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Failed to send email. Please try again.",
          type: "error",
        },
      });
    } finally {
      setSpinneremail(0);
    }
  };

  const downloadReport = async (reportValue) => {
    try {
      const user_id = getParentUserId();
      const summary_report = reportValue === 1 ? 1 : 0;

      const apiUrl = `${ADVISORY_DOWNLOAD_REPORT}?filename=all&merge=all&user_id=${user_id}&summary_report=${summary_report}`;

      const response = await apiClient(apiUrl, {
        method: 'GET'
      });

      if (response.status_code === "200") {

        // Check if response contains a download URL
        let downloadUrl = null;

        // First check if data is a direct URL string (like in your response)
        if (typeof response.data === 'string' && response.data.startsWith('http')) {
          downloadUrl = response.data;
        } else if (response.data && response.data.download_url) {
          downloadUrl = response.data.download_url;
        } else if (response.data && response.data.s3_url) {
          downloadUrl = response.data.s3_url;
        } else if (response.data && response.data.url) {
          downloadUrl = response.data.url;
        } else if (response.data && response.data.file_url) {
          downloadUrl = response.data.file_url;
        } else if (response.data && response.data.report_url) {
          downloadUrl = response.data.report_url;
        } else if (response.data && response.data.pdf_url) {
          downloadUrl = response.data.pdf_url;
        } else if (response.data && response.data.report_link) {
          downloadUrl = response.data.report_link;
        } else if (response.data && response.data.link) {
          downloadUrl = response.data.link;
        }

        if (downloadUrl) {
          // Open the report in a new tab
          window.open(downloadUrl, '_blank');
        } else {
          // If no direct URL found, try to create a download link with the API URL
          const directDownloadUrl = `${apiUrl}&download=true`;
          const link = document.createElement('a');
          link.href = directDownloadUrl;
          link.target = '_blank';
          link.download = `report_${summary_report === 1 ? 'summary' : 'detailed'}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        // Show success message
        if (summary_report == 0) {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Your report is ready to download.",
              type: "success",
            },
          });
        }
        setSpinner(0);
        setSpinneremail(0);
      } else {
        console.error("API Error:", response);
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Failed to download report. Please try again.",
            type: "error",
          },
        });
        setSpinner(0);
        setSpinneremail(0);
      }
    } catch (error) {
      console.error("Error:", error);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Failed to download report. Please try again.",
          type: "error",
        },
      });
      setSpinner(0);
      setSpinneremail(0);
    }
  };



  return (
    <>
      {/* <FintooLoader isLoading={loading} /> */}
      <div className="row">
        {/* <div className="col-12 pt-2">
          <FintooInlineLoader
            isLoading={!Boolean(mainData?.error_code)}
            hideText={false}
          />
        </div> */}
        <div className="col-12">
          <div className={`${Styles.DataSection}`}>
            <div className={`${Styles.ReportCard} `}>
              <div className="d-flex  align-items-center justify-content-between">
                <div className="d-flex  align-items-center">
                  <div>
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/DMF/Report/02_holding_report.svg"
                      }
                      width={40}
                    />
                  </div>
                  <div className={`${Styles.ReportName}`}>Summary Report</div>
                  <div className={`${Styles.Reportsshareoptions}`}>
                    {spinneremail == 1 ? (
                      <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                    ) : (
                      <img
                        width={20}
                        height={20}
                        title="Share via Mail"
                        onClick={() => {
                          summaryEmail();
                        }}
                        src={
                          process.env.PUBLIC_URL +
                          "/static/media/DMF/Report/email.svg"
                        }
                      />
                    )}

                    {spinner == 2 ? (
                      <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                    ) : (
                      <img
                        width={18}
                        height={18}
                        title="Summary Report"
                        className="ms-3"
                        ref={btnDownloadRef}
                        onClick={() => {
                          summaryReport();
                        }}
                        src={
                          process.env.PUBLIC_URL +
                          "/static/media/DMF/Report/download.svg"
                        }
                      />
                    )}

                    <div style={{ display: "none" }}>
                      <a
                        id="pa-download"
                        href={file.fileP}
                        style={{
                          textDecoration: "none",
                        }}
                      //   download={getItemLocal("family") ? "Performance_Report_" + getUserId() + "_Family" : "Performance_Report_" + getUserId()}
                      ></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className={`${Styles.ReportCard} `}>
              <div className="d-flex  align-items-center justify-content-between">
                <div className="d-flex  align-items-center">
                  <div>
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/DMF/Report/03_performance_report.svg"
                      }
                      width={40}
                    />
                  </div>
                  <div className={`${Styles.ReportName}`}>Detailed Report</div>
                  <div className={`${Styles.Reportsshareoptions}`}>
                    {spinneremail == 3 ? (
                      <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                    ) : (
                      <img
                        width={20}
                        height={20}
                        title="Share via Mail"
                        onClick={() => {
                          detailedEmail();
                          setSpinneremail(3);
                        }}
                        src={
                          process.env.PUBLIC_URL +
                          "/static/media/DMF/Report/email.svg"
                        }
                      />
                    )}
                    {spinner == 3 ? (
                      <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                    ) : (
                      <img
                        width={18}
                        height={18}
                        title="Download Detail Report"
                        className="ms-3"
                        ref={btnDownloadRef}
                        onClick={() => {
                          detailedReport();
                          setSpinner(3);
                        }}
                        src={
                          process.env.PUBLIC_URL +
                          "/static/media/DMF/Report/download.svg"
                        }
                      />
                    )}

                    <div style={{ display: "none" }}>
                      <a
                        id="pa-download"
                        href={file.fileP}
                        style={{
                          textDecoration: "none",
                        }}
                      //   download={getItemLocal("family") ? "Performance_Report_" + getUserId() + "_Family" : "Performance_Report_" + getUserId()}
                      ></a>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {
              reportsData.PAR &&
              <div className={`${Styles.ReportCard}`}>
                <div className="d-flex  align-items-center">
                  <div>
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/DMF/Report/4_Valuation_Report.svg"
                      }
                      width={40}
                    />
                  </div>
                  <div className={`${Styles.ReportName}`}>Consolidated Portfolio Report</div>
                  <div className={`${Styles.Reportsshareoptions}`}>
                    <>
                      {
                        reportsData.PAR ? <>
                          {emailLoading.PAR ? (
                            <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                          ) : (
                            <img
                              width={20}
                              height={20}
                              title="Share via Mail"
                              onClick={() => sendReportMail('PAR', reportsData.PAR)}
                              src={
                                process.env.PUBLIC_URL +
                                "/static/media/DMF/Report/email.svg"
                              }
                            />
                          )}
                          <a href={reportsData.PAR} download>
                            <img
                              width={18}
                              height={18}
                              title="Download Consolidated Portfolio Report"
                              className="ms-3"
                              src={
                                process.env.PUBLIC_URL +
                                "/static/media/DMF/Report/download.svg"
                              }
                            />
                          </a>
                        </> : null
                      }
                    </>
                  </div>
                </div>
              </div>
            }

            {
              reportsData.MF &&
              <div className={`${Styles.ReportCard}`}>
                <div className="d-flex  align-items-center">
                  <div>
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/DMF/Report/4_Valuation_Report.svg"
                      }
                      width={40}
                    />
                  </div>
                  <div className={`${Styles.ReportName}`}>MF Screening Report</div>
                  <div className={`${Styles.Reportsshareoptions}`}>

                    <>
                      {
                        reportsData.MF ? <>
                          {emailLoading.MF ? (
                            <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                          ) : (
                            <img
                              width={20}
                              height={20}
                              title="Share via Mail"
                              onClick={() => sendReportMail('MF', reportsData.MF)}
                              src={
                                process.env.PUBLIC_URL +
                                "/static/media/DMF/Report/email.svg"
                              }
                            />
                          )}
                          <a href={reportsData.MF} download>
                            <img
                              width={18}
                              height={18}
                              title="Download MF Screening Report"
                              className="ms-3"
                              src={
                                process.env.PUBLIC_URL +
                                "/static/media/DMF/Report/download.svg"
                              }
                            />
                          </a>
                        </> : null
                      }
                    </>

                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      <Modal
        classNames={{
          modal: "Modalpopup",
        }}
        style={{ width: "100%" }}
        open={showELSSPopup}
        showCloseIcon={false}
        // onClose={() => setIsRegulatoryUodateModalActive(false)}
        center
        animationDuration={0}
        closeOnOverlayClick={false}
      >
        {/* <ELSSReportView onClose={() => setShowELSSPopup(false)} /> */}
      </Modal>
      <Reportmodal open={showReportmodal}
        Closemodal={() => { setShowReportmodal(false); fetchReportsData() }}
        forpar={true} />

      {/* <KYCPopup
        kycDone={kycDone}
        show={kycModal}
        onHide={() => setKycModal(false)}
      /> */}
    </>
  );
};

export default AdvisoryReportUI;
