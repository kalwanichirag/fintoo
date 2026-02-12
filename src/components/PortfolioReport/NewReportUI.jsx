import React, { useEffect, useRef, useState } from "react";
import Styles from "../../Pages/DMF/Portfolio/report.module.css";
import { Link } from "react-router-dom";
import {
  fetchEncryptData,
  getItemLocal,
  getParentUserId,
  getUserId,
  loginRedirectGuest,
  setUserId,
} from "../../common_utilities";
import {
  SUPPORT_EMAIL,
  DATA_BELONGS_TO,

} from "../../constants";
import { useDispatch } from "react-redux";
import FintooLoader from "../FintooLoader";
import FintooInlineLoader from "../FintooInlineLoader";
import Modal from "react-responsive-modal";
import ELSSReportView from "../../Pages/DMF/Portfolio/reports/AssetCategoriesDetailsViews/ELSSReportView";

function NewReportUI() {
  const repdata = {
    fileD: "",
    fileP: "",
    fileS: "",
  };

  const [file, setFile] = useState(repdata);
  // const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [mainData, setMainData] = useState({});
  const [userIds, setUserIds] = useState([]);
  const [showELSSPopup, setShowELSSPopup] = useState(false);
  const btnDownloadRef = useRef();
  const dispatch = useDispatch();
  const [spinneremail, setSpinneremail] = useState(0);
  const [spinner, setSpinner] = useState(false);
  useEffect(() => {
    onLoadInit();
    familyArray();
  }, []);

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
    setUserIds(new_array)
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
      if (Boolean(res.data.pan) == false) {
        throw "PAN not found";
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
      setMainData(res);
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
    const summaryRep = {
      user_id: getItemLocal("family") ? userIds : "" + getUserId(),
      data_belongs_to: DATA_BELONGS_TO,
      fund_registrar: "all",
    };
    var payload = {
      url: '',
      method: "post",
      data: summaryRep,
    };

    var res = await fetchEncryptData(payload);
    return res;
  };

  const summaryData = async () => {
    try {
      if (mainData.error_code * 1 !== 100) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Please wait...", type: "info" },
        });
      } else if (mainData.error_code * 1 === 103) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No Record Found", type: "error" },
        })
      } else if (mainData.error_code * 1 === 102) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Something went wrong..!", type: "error" },
        })
      }

      if (file.fileD) {
        document.querySelector("#su-download").click();
        return;
      }
      setIsLoading(true);
      btnDownloadRef.current.setAttribute("disabled", true);
      let res = await summaryApi();
      setIsLoading(false);
      if (res.error_code == "100") {
        const response = await fetch(res.data);
        const blob = await response.blob();
        setFile((prev) => ({ ...prev, fileS: URL.createObjectURL(blob) }));
        btnDownloadRef.current.removeAttribute("disabled");
      } else if (res.error_code == "103") {
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
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMailSummary = async () => {
    try {
      if (mainData.error_code == undefined) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Please wait...", type: "info" },
        });
      } else if (mainData.error_code * 1 === 103) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No Record Found", type: "error" },
        })
      } else if (mainData.error_code * 1 === 102) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Something went wrong..!", type: "error" },
        })
      }

      setIsLoading(true);
      let res = await summaryApi();

      if (res.data) {
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
        setIsLoading(false);
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
    } catch {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went wrong", type: "error" },
      });
    }
  };

  useEffect(() => {
    if (file.fileD) {
      document.querySelector("#da-download").click();

    }
  }, [file.fileD]);
  const detailApi = async () => {
    const detailedRep = {
      user_id: getItemLocal("family") ? userIds : ["" + getUserId()],
      data_belongs_to: DATA_BELONGS_TO,
      fund_registrar: "all",
    };
    let payload = {
      url: '',
      method: "post",
      data: detailedRep,
    };
    var res = await fetchEncryptData(payload);
    return res;
  };

  const detailedData = async () => {
    try {
      if (mainData.error_code == undefined) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Please wait...", type: "info" },
        });
      } else if (mainData.error_code * 1 === 103) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No Record Found", type: "error" },
        })
      } else if (mainData.error_code * 1 === 102) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Something went wrong..!", type: "error" },
        })
      }

      if (file.fileD) {
        document.querySelector("#da-download").click();
        return;
      }
      btnDownloadRef.current.setAttribute("disabled", true);
      setIsLoading(true);
      let res = await detailApi();
      setIsLoading(false);
      const response = await fetch(res.data);
      const blob = await response.blob();
      setFile((prev) => ({ ...prev, fileD: URL.createObjectURL(blob) }));
      btnDownloadRef.current.removeAttribute("disabled");
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMailDetailed = async () => {
    try {
      if (mainData.error_code == undefined) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Please wait...", type: "info" },
        });
      } else if (mainData.error_code * 1 === 103) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No Record Found", type: "error" },
        })
      } else if (mainData.error_code * 1 === 102) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Something went wrong..!", type: "error" },
        })
      }

      setIsLoading(true);
      let res = await detailApi();
      if (res.data) {
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
        setIsLoading(false);
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
    } catch (e) {
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
      user_id: Number(getUserId())
    };

    var payload_par = {
      url: '',
      method: "POST",
      data: parRep,
      headers: {
        gatewayauthtoken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJnYXRld2F5bmFtZSI6Imh0dHBzOi8vc3RnLm1pbnR5LmNvLmluLyIsImV4cCI6MTY4ODM4MjU2OX0.x2_gelbtpUBq6sSVajq-nhBwM7COXgnuaPir-IQyIRM",
        "Content-Type": "text/plain",
      },
    };
    var resp = await fetchEncryptData(payload_par);
    // setParApiresp(resp)
    return resp;
  };

  const parData = async () => {
    try {
      if (mainData.error_code == undefined) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Please wait...", type: "info" },
        });
      } else if (mainData.error_code * 1 === 103) {
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
      setIsLoading(true);
      btnDownloadRef.current.setAttribute("disabled", true);
      let resp = await parApi();
      setIsLoading(false);
      const response = await fetch(resp.data.pdf_snippet_wa);
      const blob = await response.blob();
      // setFile.fileP(URL.createObjectURL(blob));
      setFile((prev) => ({ ...prev, fileP: URL.createObjectURL(blob) }));
      btnDownloadRef.current.removeAttribute("disabled");
    } catch (e) {
      console.error(e);
    }
  };
  
  const fetchMailPar = async () => {
    if (mainData.error_code == undefined) {
      return dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Please wait...", type: "info" },
      });
    } else if (mainData.error_code * 1 === 103) {
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
    setIsLoading(true);
    let resp = await parApi();
    if (resp.data.pdf_snippet_wa) {
      var urlmail = {
        userdata: {
          to: userDetails.email
        },
        subject: "Fintoo - PAR Report",
        template: "transactions_dmf.html",
        contextvar: {
          name: userDetails.name,
          SUPPORT_EMAIL: SUPPORT_EMAIL,
          report_link: resp.data.pdf_snippet_wa,
        },
      };

      // var data = commonEncode.encrypt(JSON.stringify(urlmail));
      let config = {
        method: "post",
        url: '',
        data: urlmail,
      };

      var res = await fetchEncryptData(config);
      setIsLoading(false);
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
  };

  return (
    <>
      {/* <FintooLoader isLoading={isLoading} /> */}
      <div className="row">
        <div className="col-12 pt-2">
          <FintooInlineLoader
            isLoading={!Boolean(mainData?.error_code)}
            hideText={false}
          />
        </div>
        <div className="col-12">

          {/* <div className={`${Styles.DataSection}`}>
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

            <div className={`${Styles.ReportCard} `}>
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
              {!isLoading && (
                <div className={`${Styles.Reportsshareoptions}`}>
                  <img
                    width={20}
                    height={20}
                    title="Share via Mail"
                    onClick={fetchMailSummary}
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
                    ref={btnDownloadRef}
                    onClick={summaryData}
                    src={
                      process.env.PUBLIC_URL +
                      "/static/media/DMF/Report/download.svg"
                    }
                  />
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
              )}
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
                  <img
                    width={20}
                    height={20}
                    title="Share via Mail"
                    onClick={fetchMailDetailed}
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
                    ref={btnDownloadRef}
                    onClick={detailedData}
                    src={
                      process.env.PUBLIC_URL +
                      "/static/media/DMF/Report/download.svg"
                    }
                  />
                  <div style={{ display: "none" }}>
                    <a
                      id="da-download"
                      href={file.fileD}
                      style={{
                        textDecoration: "none",
                      }}
                      download={getItemLocal("family")? "Detailed_Report_" + getUserId()+"_Family" : "Detailed_Report_" + getUserId()}
                    ></a>
                  </div>
                  
                </div>
              </div>
            </div>
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
                <div className={`${Styles.ReportName}`}>Performance Report</div>
                <div className={`${Styles.Reportsshareoptions}`}>
                  <img
                    width={20}
                    height={20}
                    title="Share via Mail"
                    onClick={fetchMailPar}
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
                    ref={btnDownloadRef}
                    onClick={parData}
                    src={
                      process.env.PUBLIC_URL +
                      "/static/media/DMF/Report/download.svg"
                    }
                  />
                  <div style={{ display: "none" }}>
                    <a
                      id="pa-download"
                      href={file.fileP}
                      style={{
                        textDecoration: "none",
                      }}
                      download={getItemLocal("family")? "Performance_Report_" + getUserId()+"_Family" : "Performance_Report_" + getUserId()}
                    ></a>
                  </div>
                  
                </div>
              </div>
            </div>
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
          </div> */}

          <div className={`${Styles.DataSection}`}>
            
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
                <div className={`${Styles.ReportName}`}>Consolidated Portfolio Report</div>

                <div className={`${Styles.Reportsshareoptions}`}>
                  {
                    setSpinneremail == 1 ? (
                      <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                    ) : (
                      <img
                        width={20}
                        height={20}
                        title="Share via Mail"
                        onClick={()=>{
                          fetchMailPar();
                          setSpinneremail(1);
                        }}
                        src={
                          process.env.PUBLIC_URL +
                          "/static/media/DMF/Report/email.svg"
                        }
                      />
                    )
                  }
                  {
                    setSpinner == 1 ? (
                      <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                    ) : (
                      <img
                        width={18}
                        height={18}
                        title="Download Detail Report"
                        className="ms-3"
                        ref={btnDownloadRef}
                        onClick={()=>{
                          parData();
                          setSpinner(1)
                        }}
                        src={
                          process.env.PUBLIC_URL +
                          "/static/media/DMF/Report/download.svg"
                        }
                      />
                    )
                  }
                  <div style={{ display: "none" }}>
                    <a
                      id="pa-download"
                      href={file.fileP}
                      style={{
                        textDecoration: "none",
                      }}
                      download={getItemLocal("family") ? "Performance_Report_" + getUserId() + "_Family" : "Performance_Report_" + getUserId()}
                    ></a>
                  </div>

                </div>
              </div>
            </div>

            <Link
              className="text-decoration-none text-black"
              to={`${process.env.PUBLIC_URL}/commondashboard/Report-details`}
            >
              <div className={`${Styles.ReportCard}`}>
                <div className="d-flex  align-items-center justify-content-between">
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
            <div className={`${Styles.ReportCard}`} onClick={() => setShowELSSPopup(true)}>
              <div className="d-flex  align-items-center justify-content-between">
                <div className="d-flex  align-items-center"> <div>
                  <img
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/DMF/Report/06_ELSS_purchase.svg"
                    }
                    width={40}
                  />
                </div>
                  <div className={`${Styles.ReportName}`}>
                    ELSS Report
                  </div></div>
                <div style={{ cursor: 'pointer' }} >
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
            <div className={`${Styles.ReportCard}`}>
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
                <div>
                  <div className={`${Styles.ReportName}`}>XIRR Report</div>
                  <div className={`${Styles.ReportName}`} style={{ fontSize: '1rem', color: 'gray', fontWeight: 'lighter' }}>Coming soon...</div>
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
    </>
  );
}

export default NewReportUI;
