import { useEffect, useRef, useState } from "react";
import Styles from "./style.module.css";
import { getCookie, fetchData, getParentUserId, getUserId, setItemLocal, indianRupeeFormat } from "../../../../common_utilities";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CHATBOT_BASE_API_URL, imagePath } from "../../../../constants";
import * as toastr from "toastr";
import CommonCss from "../../../../components/CommonStyle/CommonPopup.module.css"
import FintooLoader from "../../../../components/FintooLoader";

const Completed = (props) => {
  const { fromStockCard = false } = props;
  const areBothSelected = props?.areBothSelected || { both: false };
  const stockAmount = props?.modalData?.stocksamount ?? null;

  const handleDownloadClick = (downloadPDF) => {
    const link = document.createElement('a');
    link.href = downloadPDF;
    // link.download = 'MF Screening Report';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  const scrollToTop = () => {
    window.scroll({ top: 0 });
  };

  let amount = getCookie("totalAmount")
  const navigate = useNavigate();
  // const [pageurl, setPageurl] = useState(false);
  const location = useLocation();
  const par_report_data = useSelector((state) => state.par_report_data);
  const [downloadParReport, setDownloadParReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallbackSuccess, setShowFallbackSuccess] = useState(false);

  const handleRedirect = () => {

    if (areBothSelected.both) {
      props.setAreBothSelected(prev => ({
        ...prev,
        redirectFlow: true
      }));

      props.setInvestmentTypeView((prev) => {
        return areBothSelected.prevInvestView === 'STOCK' ? 'MF' : 'STOCK'
      })
    } else {
      props.onClose();
    }

  }

  useEffect(() => {
    if (

      (location.pathname === "/commondashboard" || location.pathname === "/commondashboard/")
    ) {
      (async () => {
        if (typeof props.generateParSnippet === "function") {
          let res = await props.generateParSnippet(1);
          if (res === false) {
            props.onClose();
          }
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (!fromStockCard) return;

    // Trigger dashboard refresh if provided.
    if (props.onLinkedSuccess) {
      props.onLinkedSuccess();
    }

    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
      setShowFallbackSuccess(true);
    }, 1200);

    const closeTimer = setTimeout(() => {
      if (props.onClose) props.onClose();
    }, 1800);

    return () => {
      clearTimeout(fallbackTimer);
      clearTimeout(closeTimer);
    };
  }, [fromStockCard, props]);


  return (
    <>
      <div
        className={` DeamtBasicDetailsSection ${Styles.BasicDetailsSection}`}
        style={{ height: '100%' }}
      >
        <div style={{ height: '100%' }}>
          {
            location.pathname === "/commondashboard" || location.pathname === "/commondashboard/" ? (
              <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {
                  !stockAmount && !showFallbackSuccess ? (
                    <div>
                      <FintooLoader isLoading={isLoading} />
                      {/* <img
                        className="ms-2"
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/Loader.gif"
                        }
                        alt="Loader"
                        width={150}
                      /> */}

                      {/* <div className={`${Styles.Congratulationstxt}`} style={{ paddingTop: '0.5rem' }}>Please wait...</div> */}
                    </div>
                  ) : (
                    <div>
                      <center>
                        <img width={150} className="ms-2" src={imagePath + "/static/media/DG/Completed.svg"} alt="Completed" />
                      </center>
                      <div className="text-center">
                        <div className={`${Styles.Congratulationstxt}`}>Congratulations!</div>
                        <div style={{
                          fontSize: "1"
                        }} className={`${CommonCss.infoText}`}>
                          {stockAmount ? (
                            <>Your Stocks Portfolio - {<span style={{ color: '#042b62' }}>{indianRupeeFormat(stockAmount)}</span>}</>
                          ) : (
                            <>Your stock holdings were fetched successfully.</>
                          )}
                        </div>
                        <div className={`${Styles.Congratulationssubtxt} ${CommonCss.infoText}`}>
                          {props.fromStockCard
                            ? "We’ve successfully analyzed your stock portfolio." :
                            areBothSelected.both ? 'We have retrieved your stock details. To proceed with generating your Consolidated Portfolio Report, please link your mutual fund holdings as well.' : 'Based on the details you provided, we found the following stock investments in your portfolio. You can download a detailed report of your stocks portfolio by clicking the button below.'
                          }
                        </div>
                        <div className="ButtonBx mt-0 d-md-flex justify-content-center">
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                              {
                                areBothSelected.both ? (
                                  <button
                                    onClick={() => { handleRedirect() }}
                                    style={{
                                      backgroundColor: "#042b62",
                                      border: "1px solid #042b62",
                                      color: "#fff !important",
                                      marginTop: '0px'
                                    }} type="button" className="Unlink ms-4 custom-btn-style">
                                    Continue to Mutual fund
                                  </button>
                                ) : (
                                  !fromStockCard && (
                                    <button
                                      type="button"
                                      className="Unlink custom-btn-style"
                                      onClick={() => handleDownloadClick(props.reportPDFUrl.STOCK)}
                                    >
                                      Download Report
                                    </button>
                                  )
                                )
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>

            ) : (
              <div>
                <center>
                  <img style={{ width: '50%' }} className="ms-2" src={imagePath + "/static/media/DG/Completed.svg"} alt="Completed" />
                </center>
                <div className="text-center">
                  <div className={`${Styles.Congratulationstxt}`}>Congratulations!</div>
                  <div className={`${Styles.Congratulationssubtxt} ${CommonCss.infoText}`}>
                    You have successfully started tracking your Indian Stocks
                    Portfolio with Fintoo
                  </div>
                  <div className="ButtonBx mt-0 d-md-flex justify-content-center">
                    <>
                      <button style={{
                        backgroundColor: "#042b62",
                        border: "1px solid #042b62",
                        color: "#fff !important"
                      }} type="button" className="Unlink custom-btn-style" onClick={() => {
                        scrollToTop();

                        props.onClose();
                        window.location.href = `${process.env.PUBLIC_URL}/datagathering/assets-liabilities?success=1&isstocks=1&stocksamount=${amount}`;
                      }}>
                        Continue
                      </button>
                    </>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </>
  );
};
export default Completed;
