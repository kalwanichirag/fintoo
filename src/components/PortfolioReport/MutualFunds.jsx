import React, { useEffect, useRef, useState } from "react";
import Styles from "../../Pages/DMF/Portfolio/report.module.css";
import { Link } from "react-router-dom";
import {
  apiCall,
  fetchEncryptData,
  getCurrentUserDetails,
  getItemLocal,
  getParentUserId,
  getProfilePercentage,
  getUserId,
  getprofilestatus,
  loginRedirectGuest,
  setUserId,
} from "../../common_utilities";
import {
  SUPPORT_EMAIL,
  DATA_BELONGS_TO
} from "../../constants";
import apiClient from "../../FrappeIntegration-Services/services/apiClient";
import { useDispatch } from "react-redux";
import SweetAlert from "sweetalert-react";
// import FintooLoader from "../FintooLoader";
import Modal from "react-responsive-modal";
import ELSSReportView from "../../Pages/DMF/Portfolio/reports/AssetCategoriesDetailsViews/ELSSReportView";
import { getReports } from "../../Services/ReportService";
import { SendMailFile } from "../../Pages/MFSnippet/Service/MessagingService";
import Reportmodal from "../CommonDashboard/Report/Reportmodal";

function MutualFunds({ reportsData, fetchReportsData }) {
  const repdata = {
    fileD: "",
    fileP: "",
    fileS: "",
  };

  const [file, setFile] = useState(repdata);
  const [userDetails, setUserDetails] = useState([]);
  const [mainData, setMainData] = useState({});
  const [userIds, setUserIds] = useState([]);
  const [otherInvestment, setOtherInvestment] = useState({})
  const [showELSSPopup, setShowELSSPopup] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const dispatch = useDispatch();
  const [spinneremail, setSpinneremail] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [fileCG, setFileCG] = useState();
  const cgDownloadRef = useRef();
  const [error, seterror] = useState('');
  const [showReportmodal, setShowReportmodal] = useState(false);


  const [spinnerEmailLoader, setSpinnerEmailLoaderLoader] = useState(
    {
      spinner1: false,
      spinner2: false,
      spinner3: false,

    }
  );
  const [spinnerLoader, setSpinnerLoader] = useState(
    {
      spinner1: false,
      spinner2: false,
      spinner3: false,
    }
  );
  const [spinnerExcelLoader, setSpinnerExcelLoader] = useState(
    {
      spinner1: false,
      spinner2: false,
      spinner3: false,
      spinner4: false
    }
  );

  const btnDownloadRef = useRef({
    summaryDownload: null,
    detailedDownload: null,
    parDownload: null,
  });

  useEffect(() => {
    onLoadInit();
    familyArray();
  }, []);

  const sendReportMail = async (type, reportLink) => {
    const emailPayloadData = {
      email: userDetails.email,
      subject: type == 'MF' ? 'Fintoo: Your Personalized Mutual Fund Screening Report is Here!' : 'Fintoo: Your Personalized Portfolio Analysis Report Awaits!',
      templateName: type == 'MF' ? 'mf_screening_report.html' : 'par_portfolio_analysis_report.html',
      attachment: reportLink,
      contextvar: { client_name: userDetails.name, attachment_name: `${type == 'MF' ? 'MF screening' : 'PAR'} Report` }
    };

    const mailRes = await SendMailFile(emailPayloadData);

    if (mailRes) {
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
  }

  const familyArray = (typeOfArray) => {
    var new_array = [];
    var new_array_pans = [];
    var new_data = getItemLocal("member");

    new_data.forEach((element) => {
      if (element.id !== null) {
        new_array.push(element.id.toString());
      }

      // if (element.pan !== null) {
      //   new_array_pans.push(element.pan);
      // }
    });
    setUserIds(new_array.toString())
  };

  const onLoadInit = async () => {
    try {

      if (getUserId() == null) {
        loginRedirectGuest();
        return;
      }

      var payload = {
        url: '',
        method: "post",
        data: {
          user_id: getItemLocal("family") ? getParentUserId() : "" + getUserId(),
          data_belongs_to: DATA_BELONGS_TO
        },
      };

      var res = await fetchEncryptData(payload);

      if (res.error_code * 1 === 103) {
        return setOpenConfirm(true);

      }
      setUserDetails(res.data);
      var payload = {
        url: '',
        data: {
          pan: res.data.pan,
          data_belongs_to: DATA_BELONGS_TO,
        },
        method: "post",
      };
      var res = await fetchEncryptData(payload);
      seterror(res['error_code'])
      setMainData(res);

      var payload = {
        url: '',
        method: "post",
        data: {
          user_id: getItemLocal("family") ? getParentUserId() : "" + getUserId(),
          inv_type: "all",
          data_belongs_to: DATA_BELONGS_TO,
        },
      };

      var res = await fetchEncryptData(payload);
      setOtherInvestment(res)
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (file.fileS) {
      document.querySelector("#su-download").click();
      // setFileP("");
    }
  }, [file.fileS]);

  const summaryApi = async () => {
    // Get the selected family member or use current user
    const memberData = getItemLocal("member") || [];
    const selectedMember = memberData.find(member => member.id === getUserId()) || memberData[0];
    
    const summaryRep = {
      user_id: selectedMember?.id || getUserId(),
      data_belongs_to: DATA_BELONGS_TO,
      fund_registrar: "all",
      report_type: "Summary",
      from_date: "01-01-2025",
      to_date: "31-01-2025",
    };

    var res = await apiClient('', {
      method: "POST",
      body: JSON.stringify(summaryRep),
    });
    return res;
  };

  const summaryData = async () => {
    try {
      if (userDetails.pan != "") {
        if (mainData.error_code * 1 === 103 && otherInvestment.error_code * 1 === 103) {

          return dispatch({
            type: "RENDER_TOAST",
            payload: { message: "No Records Found", type: "error" },
          })

        } else if (mainData.error_code * 1 === 102) {

          return dispatch({
            type: "RENDER_TOAST",
            payload: { message: "Something went wrong..!", type: "error" },
          })
        }
        // } else if (getItemLocal("family")) {

        //   return dispatch({
        //     type: "RENDER_TOAST",
        //     payload: { message: "Please select a member from dropdown", type: "info" },
        //   });
        // }
      } else {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No Records Found", type: "error" },
        });
      }

      if (file.fileD) {
        document.querySelector("#su-download").click();
        return;
      }
      btnDownloadRef.current.summaryDownload.setAttribute("disabled", true);
      setSpinnerLoader((prev) => ({ ...prev, spinner1: true }));
      let res = await summaryApi();

      if (res.status_code == "200" && res.data) {
        const response = await fetch(res.data);
        const blob = await response.blob();
        setFile((prev) => ({ ...prev, fileS: URL.createObjectURL(blob) }));
        btnDownloadRef.current.summaryDownload.removeAttribute("disabled");
      } else if (res.status_code == "103" || res.error_code == "103") {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "No records found!",
            type: "info",
          },
        });

      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Something went wrong...",
            type: "error",
          },
        });
      }
      setSpinnerLoader((prev) => ({ ...prev, spinner1: false }));
    } catch (e) {
      setSpinnerLoader((prev) => ({ ...prev, spinner1: false }));
      console.error(e);
    }
  };

  const fetchMailSummary = async () => {
    try {
      if (userDetails.pan != "") {
        if (mainData.error_code * 1 === 103 && otherInvestment.error_code * 1 === 103) {
          return dispatch({
            type: "RENDER_TOAST",
            payload: { message: "No Records Found", type: "error" },
          })
        } else if (mainData.error_code * 1 === 102) {
          return dispatch({
            type: "RENDER_TOAST",
            payload: { message: "Something went wrong..!", type: "error" },
          })
        } else if (getItemLocal("family")) {
          return dispatch({
            type: "RENDER_TOAST",
            payload: { message: "Please select a member from dropdown", type: "info" },
          });
        }
      } else {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No Record Found", type: "error" },
        });
      }
      setSpinnerEmailLoaderLoader((prev) => ({ ...prev, spinner1: true }));
      let res = await summaryApi();

      if (res.status_code == "200" && res.data) {
        var urlmail = {
          userdata: {
            to: userDetails.email,
          },
          subject: "Fintoo - Summary Report",
          template: "transactions_dmf.html",
          contextvar: {
            name: userDetails.name,
            SUPPORT_EMAIL: SUPPORT_EMAIL,
            report_link: res.data,
          },
        };

        var config = {
          method: "post",
          url: '',
          data: urlmail,
        };

        var resp = await fetchEncryptData(config);
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: resp.message, type: "success" },
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
      setSpinnerEmailLoaderLoader((prev) => ({ ...prev, spinner1: false }));
    } catch {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went wrong", type: "error" },
      });

      setSpinnerEmailLoaderLoader((prev) => ({ ...prev, spinner1: false }));
    }
  };

  useEffect(() => {
    if (file.fileD) {
      document.querySelector("#da-download").click();

    }
  }, [file.fileD]);
  const detailApi = async () => {
    // Get the selected family member or use current user
    const memberData = getItemLocal("member") || [];
    const selectedMember = memberData.find(member => member.id === getUserId()) || memberData[0];
    
    const detailedRep = {
      user_id: selectedMember?.id || getUserId(),
      data_belongs_to: DATA_BELONGS_TO,
      fund_registrar: "all",
      report_type: "Detail",
      from_date: "01-01-2025",
      to_date: "31-01-2025",
    };

    var res = await apiClient('', {
      method: "POST",
      body: JSON.stringify(detailedRep),
    });
    return res;
  };

  const detailedData = async () => {
    try {
      if (userDetails.pan != "") {
        if (mainData.error_code * 1 === 103 && otherInvestment.error_code * 1 === 103) {
          return dispatch({
            type: "RENDER_TOAST",
            payload: { message: "No mutual fund investment found", type: "success" },
          })
        } else if (mainData.error_code * 1 === 102) {
          return dispatch({
            type: "RENDER_TOAST",
            payload: { message: "Something went wrong..!", type: "error" },
          })
        }
      } else {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No Records Found", type: "error" },
        });
      }
      // else if (getItemLocal("family")) {
      //   return dispatch({
      //     type: "RENDER_TOAST",
      //     payload: { message: "Please select a member from dropdown", type: "info" },
      //   });
      // }


      if (file.fileD) {
        document.querySelector("#da-download").click();
        return;
      }
      btnDownloadRef.current.detailedDownload.setAttribute("disabled", true);
      setSpinnerLoader((prev) => ({ ...prev, spinner2: true }));
      let res = await detailApi();
      
      if (res.status_code == "200" && res.data) {
        const response = await fetch(res.data);
        const blob = await response.blob();
        setFile((prev) => ({ ...prev, fileD: URL.createObjectURL(blob) }));
        btnDownloadRef.current.detailedDownload.removeAttribute("disabled");
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Something went wrong...",
            type: "error",
          },
        });
      }
      setSpinnerLoader((prev) => ({ ...prev, spinner2: false }));
    } catch (e) {
      setSpinnerLoader((prev) => ({ ...prev, spinner2: false }));
      console.error(e);
    }
  };

  const fetchMailDetailed = async () => {
    try {
      if (userDetails.pan != "") {
        if (mainData.error_code * 1 === 103 && otherInvestment.error_code * 1 === 103) {

          return dispatch({
            type: "RENDER_TOAST",
            payload: { message: "No mutual fund investment found", type: "success" },
          })
        } else if (mainData.error_code * 1 === 102) {

          return dispatch({
            type: "RENDER_TOAST",
            payload: { message: "Something went wrong..!", type: "error" },
          })
        }
      } else {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No Record Found", type: "error" },
        });
      }

      setSpinnerEmailLoaderLoader((prev) => ({ ...prev, spinner2: true }));
      let res = await detailApi();
      if (res.status_code == "200" && res.data) {
        var urlmail = {
          userdata: {
            to: userDetails.email,
          },
          subject: "Fintoo - Detailed Report",
          template: "transactions_dmf.html",
          contextvar: {
            name: userDetails.name,
            SUPPORT_EMAIL: SUPPORT_EMAIL,
            report_link: res.data,
          },
        };

        var config = {
          method: "post",
          url: '',
          data: urlmail,
        };

        var resp = await fetchEncryptData(config);
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: resp.message, type: "success" },
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
      setSpinnerEmailLoaderLoader((prev) => ({ ...prev, spinner2: false }));
    } catch (e) {
      setSpinnerEmailLoaderLoader((prev) => ({ ...prev, spinner2: false }));
      console.error(e)
    }
  };

  useEffect(() => {
    if (file.fileP) {
      document.querySelector("#pa-download").click();
      // setFileP("");
    }
  }, [file.fileP]);

  const parApi = async () => {
    const parRep = {
      user_id: "" + getUserId(),
      pan: userDetails.pan,
    };
    var payload_par = {
      url: '',
      method: "POST",
      data: parRep,
    };
    var resp = await fetchEncryptData(payload_par);
    return resp;
  };

  const parData = async () => {
    try {
      if (userDetails.pan != "") {
        if (mainData.error_code * 1 === 103) {
          return dispatch({
            type: "RENDER_TOAST",
            payload: { message: "No Record Found", type: "error" },
          })
        } else if (mainData.error_code * 1 === 102) {
          return dispatch({
            type: "RENDER_TOAST",
            payload: { message: "Something went wrong..!", type: "error" },
          })
        } else if (getItemLocal("family")) {
          return dispatch({
            type: "RENDER_TOAST",
            payload: { message: "Please select a member from dropdown", type: "info" },
          });
        }
      } else {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No Record Found", type: "error" },
        });
      }
      if (file.fileP) {
        document.querySelector("#pa-download").click();
        return;
      }
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Please Wait...",
          type: "info",
        },
      });
      btnDownloadRef.current.parDownload.setAttribute("disabled", true);
      setSpinnerLoader((prev) => ({ ...prev, spinner3: true }));
      let resp = await parApi()

      const response = await fetch(resp.pdf_report_link);
      const blob = await response.blob();
      // setFile.fileP(URL.createObjectURL(blob));
      setSpinnerLoader((prev) => ({ ...prev, spinner3: false }));
      setFile((prev) => ({ ...prev, fileP: URL.createObjectURL(blob) }));
      btnDownloadRef.current.parDownload.removeAttribute("disabled");
    } catch (e) {
      setSpinnerLoader((prev) => ({ ...prev, spinner3: false }));
      console.error(e);
    }
  };
  const fetchMailPar = async () => {
    if (userDetails.pan != "") {
      if (mainData.error_code * 1 === 103) {

        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No Record Found", type: "error" },
        })
      } else if (mainData.error_code * 1 === 102) {

        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Something went wrong..!", type: "error" },
        })
      } else if (getItemLocal("family")) {

        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Please select a member from dropdown", type: "info" },
        });
      }
    } else {
      return dispatch({
        type: "RENDER_TOAST",
        payload: { message: "No Record Found", type: "error" },
      });
    }
    setSpinnerEmailLoaderLoader((prev) => ({ ...prev, spinner3: true }));
    let resp = await parApi();
    if (resp.pdf_report_link) {
      var urlmail = {
        userdata: {
          to: userDetails.email,
        },
        subject: "Fintoo - Par Report",
        template: "transactions_dmf.html",
        contextvar: {
          name: userDetails.name,
          SUPPORT_EMAIL: SUPPORT_EMAIL,
          report_link: resp.pdf_report_link,
        },
      };

      // var data = commonEncode.encrypt(JSON.stringify(urlmail));
      let config = {
        method: "post",
        url: '',
        data: urlmail,
      };

      var res = await fetchEncryptData(config);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: res.message, type: "success" },
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
    setSpinnerEmailLoaderLoader((prev) => ({ ...prev, spinner3: false }));
  };

  const ExcelReport = async () => {
    try {
      const payload = {
        method: "post",
        data: {
          pan: userDetails.pan,
        },
        url: '',
      };
      const r = await fetchEncryptData(payload);
      if (Number(r.error_code) === 100) {
        var response = r.data.profile_status
      }

    } catch (e) {
      throw "Something went wrong";
    }
    try {
      if (mainData.error_code * 1 === 103 && response != 100) {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No Record Found", type: "error" },
        })
      }
      else {
        let usrdetails = await getCurrentUserDetails();

        let data = {
          user_id: getUserId(),
          data_belongs_to: DATA_BELONGS_TO,
          fund_registrar: "all",
          report_type: "csv",
          user_pan: usrdetails['pan']
        }
        let url = '';

        setSpinnerExcelLoader((prev) => ({ ...prev, spinner4: true }));
        let response = await apiCall(url, data, true, true);
        
        if (response['error_code'] == '100') {
          const excelResponse = await fetch(response.data);
          const blobData = await excelResponse.blob();
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Excel report generated Sucessfully...",
              type: "success",
              autoClose: 3000,
            },
          });

          const url = window.URL.createObjectURL(blobData);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Summary_Report.xlsx');

          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
          cgDownloadRef.current.removeAttribute("disabled");
          setSpinnerExcelLoader((prev) => ({ ...prev, spinner4: false }));

        }
        else if (error === "103") {
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: "No Record Found", type: "error" },
          })
          setSpinnerExcelLoader((prev) => ({ ...prev, spinner4: false }));
        }
        else {
          setSpinnerExcelLoader((prev) => ({ ...prev, spinner4: false }));
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: "Something went wrong..!", type: "error" },
          })
        }
      }
    }
    catch (e) {
      console.log("catch", e);
      setSpinnerExcelLoader((prev) => ({ ...prev, spinner4: false }));
    }


  }

  return (
    <>
      {/* <SweetAlert
        show={openConfirm}
        title="Please complete member's profile!"
        onConfirm={() => {
          setOpenConfirm(false);
          setTimeout(() => {
            window.location =
              process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard";
          }, 100);
        }}
        confirmButtonText="Continue"
      /> */}
      {/* <FintooLoader isLoading={isLoading} /> */}
      <div className="row">
        {/* <div className="col-12 pt-2">
          <FintooLoader
            isLoading={!Boolean(mainData?.error_code) && !Boolean(otherInvestment?.error_code)}
            hideText={false}
          />
        </div> */}

        <div className="col-12">


          <div className={`${Styles.DataSection}`}>


          <Link
              className="text-decoration-none text-black"
              to={`${process.env.PUBLIC_URL}/commondashboard/Portfolio-Holdings-Report-details?report_type=summary`}
            >
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
                    <div className={`${Styles.ReportName}`}>Portfolio Holdings Report</div>
                    <div style={{ cursor: 'pointer' }}>
                      <img
                        style={{
                          transform: "rotate(-90deg)",
                        }}
                        width={23}
                        height={23}
                        src={
                          process.env.PUBLIC_URL + "/static/media/DMF/down.svg"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              className="text-decoration-none text-black"
              to={`${process.env.PUBLIC_URL}/commondashboard/Portfolio-Holdings-Report-details?report_type=detailed`}
            >
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
                    <div className={`${Styles.ReportName}`}>Portfolio Transaction Report</div>
                    <div style={{ cursor: 'pointer' }}>
                      <img
                        style={{
                          transform: "rotate(-90deg)",
                        }}
                        width={23}
                        height={23}
                        src={
                          process.env.PUBLIC_URL + "/static/media/DMF/down.svg"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link
              className="text-decoration-none text-black"
              to={`${process.env.PUBLIC_URL}/commondashboard/Report-details`}
            >
              <div className={`${Styles.ReportCard}`}>
                <div className="d-flex  align-items-center">
                  <div>
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/DMF/Report/01_capital_gains_Loss_report.svg"
                      }
                      width={40}
                    />
                  </div>
                  <div className={`${Styles.ReportName}`}>
                    Capital Gains & Loss Report
                  </div>
                  <div>
                    <img
                      style={{
                        transform: "rotate(-90deg)",
                      }}
                      width={23}
                      height={23}
                      src={
                        process.env.PUBLIC_URL + "/static/media/DMF/down.svg"
                      }
                    />
                  </div>
                </div>
              </div>
            </Link>
            {/* <Link
              className="text-decoration-none text-black"
              to={`${process.env.PUBLIC_URL}/commondashboard/Portfolio-Holdings-Report-details`}
            >
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
                    <div className={`${Styles.ReportName}`}>Portfolio Holdings Report ..</div>
                    <div style={{ cursor: 'pointer' }}>
                      <img
                        style={{
                          transform: "rotate(-90deg)",
                        }}
                        width={23}
                        height={23}
                        src={
                          process.env.PUBLIC_URL + "/static/media/DMF/down.svg"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link> */}

            {/* <div className={`${Styles.ReportCard} `}>
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
                <div className={`${Styles.ReportName}`}>Transaction Summary Report</div>
              </div>

              <div className={`${Styles.Reportsshareoptions}`}>
                {
                  spinnerExcelLoader.spinner4 === true ? (
                    <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                  ) : (
                    <div style={{ marginRight: '10px' }}>
                      <img
                        width={20}
                        height={20}
                        title="Download In Excel "
                        onClick={() => {
                          if (getItemLocal('family')) {
                            dispatch({
                              type: "RENDER_TOAST",
                              payload: { message: "Please select a member from dropdown", type: "info" },
                            });
                          }
                          else {
                            ExcelReport()
                          }

                        }}
                        src={process.env.PUBLIC_URL + "/static/media/DMF/Report/Excel.svg"}
                      />
                    </div>
                  )
                }
                {
                  spinnerEmailLoader.spinner1 === true ? (
                    <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                  ) : (
                    <div style={{ marginLeft: '10px' }}>
                      <img
                        width={20}
                        height={20}
                        title="Share via Mail"
                        onClick={() => {
                          fetchMailSummary();
                        }}
                        src={process.env.PUBLIC_URL + "/static/media/DMF/Report/email.svg"}
                      />
                    </div>
                  )
                }
                {
                  spinnerLoader.spinner1 === true ? (
                    <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                  ) : (
                    <img
                      width={18}
                      height={18}
                      title="Download Summary Report"
                      className="ms-3"
                      ref={(ref) => btnDownloadRef.current.summaryDownload = ref}
                      onClick={() => {
                        summaryData();
                        // setSpinner(1);
                      }}
                      src={process.env.PUBLIC_URL + "/static/media/DMF/Report/download.svg"}
                    />
                  )
                }

                <div style={{ display: "none" }}>
                  <a
                    id="su-download"
                    href={file.fileS}
                    style={{
                      textDecoration: "none",
                    }}
                    download={"Summary_Report_" + getUserId()}
                  ></a>
                </div>
              </div>
            </div>
            <div className={`${Styles.ReportCard} `}>
              <div className="d-flex justify-content-between  align-items-center">
                <div>
                  <img
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/DMF/Report/03_performance_report.svg"
                    }
                    width={40}
                  />
                </div>
                <div className={`${Styles.ReportName}`}>Detailed Transaction Report</div>

                <div className={`${Styles.Reportsshareoptions}`}>
                  {
                    // spinneremail == 2 ? (
                    spinnerEmailLoader.spinner2 === true ? (
                      <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                    ) : (
                      <img
                        width={20}
                        height={20}
                        title="Share via Mail"
                        onClick={() => {
                          fetchMailDetailed();
                        }}
                        src={
                          process.env.PUBLIC_URL +
                          "/static/media/DMF/Report/email.svg"
                        }
                      />
                    )
                  }
                  {
                    // spinner == 2 ? (
                    spinnerLoader.spinner2 === true ? (
                      <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                    ) : (
                      <img
                        width={18}
                        height={18}
                        title="Download Detail Report"
                        className="ms-3"
                        ref={(ref) => btnDownloadRef.current.detailedDownload = ref}
                        onClick={() => {
                          detailedData();
                          // setSpinner(2)
                        }}
                        src={
                          process.env.PUBLIC_URL +
                          "/static/media/DMF/Report/download.svg"
                        }
                      />
                    )}
                  <div style={{ display: "none" }}>
                    <a
                      id="da-download"
                      href={file.fileD}
                      style={{
                        textDecoration: "none",
                      }}
                      download={getItemLocal("family") ? "Detailed_Report_" + getUserId() + "_Family" : "Detailed_Report_" + getUserId()}
                    ></a>
                  </div>

                </div>
              </div>
            </div> */}
            {
              reportsData.PAR &&
              <div className={`${Styles.ReportCard}`} onClick={() => setShowReportmodal(true)}>
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
                          <img
                            width={20}
                            height={20}
                            title="Share via Mail"
                            onClick={(e) => {
                              e.stopPropagation();
                              sendReportMail('PAR', reportsData.PAR);
                            }}
                            src={
                              process.env.PUBLIC_URL +
                              "/static/media/DMF/Report/email.svg"
                            }
                          />
                          <a href={reportsData.PAR} download onClick={(e) => e.stopPropagation()}>
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

            <div className={`${Styles.ReportCard} d-none`}>
              <div className="d-flex  align-items-center">
                <div>
                  <img
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/DMF/Report/05_transaction_report.svg"
                    }
                    width={40}
                  />
                </div>
                <div className={`${Styles.ReportName}`}>Transaction Report</div>
                <div className={`${Styles.Reportsshareoptions}`}>
                  <img
                    width={20}
                    height={20}
                    title="Share via Mail"
                    src={
                      process.env.PUBLIC_URL +
                      "/static/media/DMF/Report/email.svg"
                    }
                  />
                  <img
                    width={18}
                    height={18}
                    title="Download Detail Report"
                    className="ms-3"
                    src={
                      process.env.PUBLIC_URL +
                      "/static/media/DMF/Report/download.svg"
                    }
                  />
                </div>
              </div>
            </div>
            <div className={`${Styles.ReportCard} d-none`}>
              <div className="d-flex  align-items-center">
                <div>
                  <img
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/DMF/Report/06_ELSS_purchase.svg"
                    }
                    width={40}
                  />
                </div>
                <div className={`${Styles.ReportName}`}>
                  ELSS Purchase Report
                </div>
                <div className={`${Styles.Reportsshareoptions}`}>
                  <img
                    width={20}
                    height={20}
                    title="Share via Mail"
                    src={
                      process.env.PUBLIC_URL +
                      "/static/media/DMF/Report/email.svg"
                    }
                  />
                  <img
                    width={18}
                    height={18}
                    title="Download Detail Report"
                    className="ms-3"
                    src={
                      process.env.PUBLIC_URL +
                      "/static/media/DMF/Report/download.svg"
                    }
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Modal
        classNames={{
          modal: "Modalpopup",
        }}
        style={{ width: '100%' }}
        open={showELSSPopup}
        showCloseIcon={false}
        // onClose={() => setIsRegulatoryUodateModalActive(false)}
        center
        animationDuration={0}
        closeOnOverlayClick={false}
      >
        <ELSSReportView onClose={() => setShowELSSPopup(false)} />
      </Modal>
      <Reportmodal open={showReportmodal}
        Closemodal={() => { setShowReportmodal(false); fetchReportsData() }}
        forpar={true} />
    </>
  );
}

export default MutualFunds;
