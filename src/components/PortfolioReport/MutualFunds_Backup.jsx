import React, { useEffect, useRef, useState } from "react";
import Styles from "../../Pages/DMF/Portfolio/report.module.css";
import { Link } from "react-router-dom";
import {
  fetchData,
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
import SweetAlert from "sweetalert-react";
// import FintooLoader from "../FintooLoader";
import Modal from "react-responsive-modal";
import ELSSReportView from "../../Pages/DMF/Portfolio/reports/AssetCategoriesDetailsViews/ELSSReportView";

function MutualFunds() {
  const repdata = {
    fileD: "",
    fileP: "",
    fileS: "",
  };

  const [file, setFile] = useState(repdata);
  const [userDetails, setUserDetails] = useState([]);
  // const [mainData, setMainData] = useState({});
  // const [userIds, setUserIds] = useState([]);
  // const [otherInvestment, setOtherInvestment] = useState({})


  const mainDataRef = useRef({});
  const userIdsRef = useRef([]);
  const otherInvestmentRef = useRef({});
  const [showELSSPopup, setShowELSSPopup] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const dispatch = useDispatch();
  const [spinneremail, setSpinneremail] = useState(0);
  const [spinner, setSpinner] = useState(false);

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

  const btnDownloadRef = useRef({
    summaryDownload: null,
    detailedDownload: null,
    parDownload: null,
  });

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
    // setUserIds(new_array.toString())
    userIdsRef.current = new_array.toString();
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
      // setMainData(res);
      mainDataRef.current = res

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
      // setOtherInvestment(res)
      otherInvestmentRef.current = res;
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
      user_id: getItemLocal("family") ? userIdsRef : "" + getUserId(),
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

  // const summaryData = async () => {

  //   try {
  //     if (mainData.error_code * 1 === 103 && otherInvestment.error_code * 1 === 103) {

  //       return dispatch({
  //         type: "RENDER_TOAST",
  //         payload: { message: "No Records Found", type: "error" },
  //       })

  //     } else if (mainData.error_code * 1 === 102) {

  //       return dispatch({
  //         type: "RENDER_TOAST",
  //         payload: { message: "Something went wrong..!", type: "error" },
  //       })
  //     } else if (getItemLocal("family")) {

  //       return dispatch({
  //         type: "RENDER_TOAST",
  //         payload: { message: "Please select a member from dropdown", type: "info" },
  //       });
  //     }

  //     if (file.fileD) {
  //       document.querySelector("#su-download").click();
  //       return;
  //     }
  //     btnDownloadRef.current.summaryDownload.setAttribute("disabled", true);
  //     setSpinnerLoader((prev) => ({ ...prev, spinner1: true }));
  //     let res = await summaryApi();

  //     if (res.error_code == "100") {
  //       const response = await fetch(res.data);
  //       const blob = await response.blob();
  //       setFile((prev) => ({ ...prev, fileS: URL.createObjectURL(blob) }));
  //       btnDownloadRef.current.summaryDownload.removeAttribute("disabled");
  //     } else if (res.error_code == "103") {
  //       dispatch({
  //         type: "RENDER_TOAST",
  //         payload: {
  //           message: "No records found!",
  //           type: "info",
  //         },
  //       });

  //     } else {
  //       dispatch({
  //         type: "RENDER_TOAST",
  //         payload: {
  //           message: "Something went wrong...",
  //           type: "error",
  //         },
  //       });
  //     }
  //     setSpinnerLoader((prev) => ({ ...prev, spinner1: false }));
  //   } catch (e) {
  //     setSpinnerLoader((prev) => ({ ...prev, spinner1: false }));
  //     console.error(e);
  //   }
  // };

  const fetchMailSummary = async () => {
    try {
      if (mainDataRef.error_code * 1 === 103 && otherInvestmentRef.error_code * 1 === 103) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No Records Found", type: "error" },
        })
      } else if (mainDataRef.error_code * 1 === 102) {
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
      setSpinnerEmailLoaderLoader((prev) => ({ ...prev, spinner1: true }));
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
    const detailedRep = {
      user_id: getItemLocal("family") ? userIds : "" + getUserId(),
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

  // const detailedData = async () => {
  //   try {
  //     if (mainData.error_code * 1 === 103) {
  //       return dispatch({
  //         type: "RENDER_TOAST",
  //         payload: { message: "No mutual fund investment found", type: "success" },
  //       })
  //     } else if (mainData.error_code * 1 === 102) {
  //       return dispatch({
  //         type: "RENDER_TOAST",
  //         payload: { message: "Something went wrong..!", type: "error" },
  //       })
  //     }
  //     else if (getItemLocal("family")) {
  //       return dispatch({
  //         type: "RENDER_TOAST",
  //         payload: { message: "Please select a member from dropdown", type: "info" },
  //       });
  //     }


  //     if (file.fileD) {
  //       document.querySelector("#da-download").click();
  //       return;
  //     }
  //     btnDownloadRef.current.detailedDownload.setAttribute("disabled", true);
  //     setSpinnerLoader((prev) => ({ ...prev, spinner2: true }));
  //     let res = await detailApi();
  //     const response = await fetch(res.data);
  //     const blob = await response.blob();
  //     setSpinnerLoader((prev) => ({ ...prev, spinner2: false }));
  //     setFile((prev) => ({ ...prev, fileD: URL.createObjectURL(blob) }));
  //     btnDownloadRef.current.detailedDownload.removeAttribute("disabled");
  //   } catch (e) {
  //     setSpinnerLoader((prev) => ({ ...prev, spinner2: false }));
  //     console.error(e);
  //   }
  // };

  const fetchMailDetailed = async () => {
    try {
      if (mainDataRef.error_code * 1 === 103) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No mutual fund investment found", type: "success" },
        });
      } else if (mainDataRef.error_code * 1 === 102) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Something went wrong..!", type: "error" },
        })
      }

      setSpinnerEmailLoaderLoader((prev) => ({ ...prev, spinner2: true }));
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

  // Usage example for summaryData
  const summaryData = async () => {
    await fetchData(summaryApi, btnDownloadRef, "summary");
  };

  // Usage example for detailedData
  const detailedData = async () => {
    await fetchData(detailApi, btnDownloadRef, "detailed");
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
      if (mainDataRef.error_code * 1 === 103) {
        return dispatch({
          type: "RENDER_TOAST",
          payload: { message: "No Record Found", type: "error" },
        })
      } else if (mainDataRef.error_code * 1 === 102) {
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
    if (mainDataRef.error_code * 1 === 103) {
      return dispatch({
        type: "RENDER_TOAST",
        payload: { message: "No Record Found", type: "error" },
      })
    } else if (mainDataRef.error_code * 1 === 102) {
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

  return (
    <>
      <SweetAlert
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
      />
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

              <div className={`${Styles.Reportsshareoptions}`}>
                {
                  // spinneremail == 1 ? (
                  spinnerEmailLoader.spinner1 === true ? (
                    <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                  ) : (
                    <img
                      width={20}
                      height={20}
                      title="Share via Mail"
                      onClick={() => {
                        fetchMailSummary();
                      }}
                      src={
                        process.env.PUBLIC_URL +
                        "/static/media/DMF/Report/email.svg"
                      }
                    />
                  )
                }
                {
                  // spinner == 1 ? (
                  spinnerLoader.spinner1 === true ? (
                    <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                  ) : (
                    <img
                      width={18}
                      height={18}
                      title="Download Detail Report"
                      className="ms-3"
                      ref={(ref) => btnDownloadRef.current.summaryDownload = ref}
                      onClick={() => {
                        summaryData();
                        // setSpinner(1);
                      }}
                      src={
                        process.env.PUBLIC_URL +
                        "/static/media/DMF/Report/download.svg"
                      }
                    />
                  )}
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
                  {
                    // spinneremail == 3 ? (
                    spinnerEmailLoader.spinner3 === true ? (
                      <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                    ) : (
                      <img
                        width={20}
                        height={20}
                        title="Share via Mail"
                        onClick={() => {
                          fetchMailPar();
                        }}
                        src={
                          process.env.PUBLIC_URL +
                          "/static/media/DMF/Report/email.svg"
                        }
                      />
                    )}
                  {
                    // spinner == 3 ? (
                    spinnerLoader.spinner3 === true ? (
                      <div className={`ms-2 ${Styles.downloadSpinner}`}></div>
                    ) : (
                      <img
                        width={18}
                        height={18}
                        title="Download Performance Report"
                        className="ms-3"
                        ref={(ref) => btnDownloadRef.current.parDownload = ref}
                        onClick={() => {
                          parData();
                          // setSpinner(3);
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
                      download={getItemLocal("family") ? "Performance_Report_" + getUserId() + "_Family" : "Performance_Report_" + getUserId()}
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

export default MutualFunds;
