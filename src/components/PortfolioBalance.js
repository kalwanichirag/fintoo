import React, { useState } from "react";
import Modal from "react-responsive-modal";
import { IoClose } from "react-icons/io5";
import { indianRupeeFormat } from "../common_utilities";
import PortfolioBal from "./PortfolioBal.module.css";
import * as animationData from "./Successful.json";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";
const PortfolioBalance = ({ open, areBothSelected, modalData, setIsOpen, isDashboard, handleClose, downloadPDF, report, isContinueDisabled }) => {
  // const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  let isContinueDisabledFlag = isContinueDisabled || false;
  const handleDownloadClick = () => {
    const link = document.createElement('a');
    link.href = downloadPDF;
    // link.download = 'MF Screening Report';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  const onCloseModal = () => {
    if (handleClose) {
      handleClose()
    } else {
      setIsOpen(false);
    }

    const currentPath = window.location.pathname;

    if (currentPath.includes("direct-mutual-fund/portfolio/dashboard")) {
      navigate(`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/?assetTabNumber=10`);
  
    } else if (isDashboard) {
      navigate(`${process.env.PUBLIC_URL}/commondashboard/`);
    } else {
      navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
    }
  };

  const PortfolioAmt = 84704;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    width: "200",
  };


  return (
    <>
      <Modal
        open={open}
        showCloseIcon={false}
        center
        classNames={{ modal: PortfolioBal["medium-modal"] }}
      >
        <div className={`${PortfolioBal.PortfolioBalClose}`}>

          <IoClose
            onClick={() => {
              onCloseModal();
            }}
          />
        </div>
        <div className={`${PortfolioBal.PortfolioBalbody}`}>
          <div className={`${PortfolioBal.Verifiedimg}`}>
            <Lottie options={defaultOptions} />
          </div>
          {modalData?.amount && (
            <div>
              <div className={`${PortfolioBal.PortfolioBalbodytxt}`}>
                Congratulations! Your bank balance has been successfully
                fetched.
              </div>
              <div className={`${PortfolioBal.PortfoliotoatlBal} custom-color`}>
                {Boolean(modalData?.amount) &&
                  indianRupeeFormat(modalData?.amount)}
              </div>
            </div>
          )}
          {modalData?.epfamount && (
            <div>
              <div className={`${PortfolioBal.PortfolioBalbodytxt}`}>
                Success! Your Employee Provident Fund value has been fetched.
                Plan your future with confidence!
              </div>
              <div className={`${PortfolioBal.PortfoliotoatlBal} custom-color`}>
                {Boolean(modalData?.epfamount) &&
                  indianRupeeFormat(modalData?.epfamount)}
              </div>
            </div>
          )}
          {modalData?.totalAmount && (
            <div>
              <div className={`${PortfolioBal.PortfoliotoatlBal} custom-color`}>
                <span style={{ color: 'black' }}>Your Portfolio - </span>
                {Boolean(modalData?.totalAmount) &&
                  indianRupeeFormat(modalData?.totalAmount).replace(/\.00$/, '')}
              </div>
              <div className={`${PortfolioBal.PortfolioBalbodytxt}`}>
                Based on the details you provided, we found the following stock and mutual funds investments in your portfolio. You can download a detailed report of your portfolio by clicking the button below.
              </div>
            </div>
          )}
          {modalData?.stocksamount && (
            <div>
              <div className={`${PortfolioBal.PortfoliotoatlBal} custom-color`}>
                <span style={{ color: 'black' }}>Your Stocks Portfolio - </span>
                {Boolean(modalData?.stocksamount) &&
                  indianRupeeFormat(modalData?.stocksamount).replace(/\.00$/, '')}
              </div>
              {
                areBothSelected?.both ?
                  <div className={`${PortfolioBal.PortfolioBalbodytxt}`}>
                    Based on the details you provided, we found the following stock investments in your portfolio. It appears you do not have any mutual fund investments at the moment.
                    You can download a detailed report of your stocks portfolio by clicking the button below.
                  </div> :
                  <div className={`${PortfolioBal.PortfolioBalbodytxt}`}>
                    Based on the details you provided, we found the following stock investments in your portfolio. You can download a detailed report of your stocks portfolio by clicking the button below.
                  </div>
              }

            </div>
          )}
          {modalData?.liabilityamount && (
            <div>
              <div className={`${PortfolioBal.PortfolioBalbodytxt}`}>
                Success! Your liabilities have been retrieved. Gain a clear understanding of your financial commitments
              </div>
              <div className={`${PortfolioBal.PortfoliotoatlBal} custom-color`}>
                {Boolean(modalData?.liabilityamount) &&
                  indianRupeeFormat(modalData?.liabilityamount)}
              </div>
            </div>
          )}
          {modalData?.cibilscore && (
            <div>
              <div className={`${PortfolioBal.PortfolioBalbodytxt}`}>
                Congratulations! Your CIBIL Score has been successfully retrieved. Stay credit-savvy!
              </div>
              <div className={`${PortfolioBal.PortfoliotoatlBal} custom-color`}>
                {/* {Boolean(modalData?.cibilscore) &&
                  indianRupeeFormat(modalData?.cibilscore)} */}
                Score :
                {Boolean(modalData?.cibilscore) &&
                  " " + modalData?.cibilscore}
              </div>
            </div>
          )}
          {modalData?.mfAmount && (
            <div>
              <div className={`${PortfolioBal.PortfoliotoatlBal} custom-color`}>
                <span style={{ color: 'black' }}>Your MF Portfolio - </span>
                {Boolean(modalData?.mfAmount) &&
                  indianRupeeFormat(modalData?.mfAmount).replace(/\.00$/, '')}
              </div>
              {
                areBothSelected?.both ?
                  <div className={`${PortfolioBal.PortfolioBalbodytxt}`}>
                    Based on the details you provided, we found the following mutual fund investments in your portfolio. It appears you do not have any stock investments at the moment.
                    You can download a detailed report of your mutual fund portfolio by clicking the button below.
                  </div> :
                  <div className={`${PortfolioBal.PortfolioBalbodytxt}`}>
                    Based on the details you provided, we found the following Mutual Funds investments in your portfolio. You can download a detailed report of your portfolio by clicking the button below.
                  </div>
              }
            </div>
          )}

          <div>
            {downloadPDF ? (
              <button
                onClick={() => handleDownloadClick()}
                className={`${PortfolioBal.ContinueBtn1} custom-background-color`}
              >
                {report ? "Download Report" : "Download PDF"}
              </button>
            ) : (
              <div>
                {/* {isContinueDisabledFlag ? (
                  <div style={{ whiteSpace: 'pre-wrap', marginBottom: '10px' }}>
                    We are currently analysing the data and generating your personalised MF Screening Report.
                    {'\n'}
                    We request you to patiently wait as this may take up to 25-30 seconds.
                  </div>
                ) : (
                  <button
                    onClick={onCloseModal}
                    className={`${PortfolioBal.ContinueBtn1} custom-background-color`}
                  >
                    Continue
                  </button>
                )} */}
              </div>
            )}
          </div>

        </div>
      </Modal>
    </>
  );
};
export default PortfolioBalance;
