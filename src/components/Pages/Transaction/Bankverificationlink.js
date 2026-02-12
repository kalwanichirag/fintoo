import React, { useEffect, useRef, useState } from "react";
import Bankbalance from "../../../Pages/datagathering/BankCashbalance/Bankbalance.module.css";
import HideHeader from "../../../components/HideHeader";
import { Link, useNavigate } from "react-router-dom";
import "../../../components/FintooCheckbox/style.css";
import { Modal } from "react-bootstrap";
import transactioncss from "./transaction.module.css";
import LoadingModal from "../../EmandateRegister/LoadingModal";

const Bankverificationlink = ({ bankDetail, isSuccess }) => {
  const [openModalByName, setOpenModalByName] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const loadingDuration = 75000; // 60 seconds
  const imageURL = process.env.REACT_APP_STATIC_URL + "media/DG/loader.svg";
  useEffect(() => {
    let loadingTimeout = setTimeout(() => {
      if (progress >= 100) return;
      setProgress(progress + 1);
    }, loadingDuration / 100);

    if (progress === 100) {
      setLoading(false);
      setOpenModalByName("exitConsent");
    }

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [progress, loading]);

  const size = 150;
  const trackWidth = 10;
  const indicatorWidth = 10;
  const trackColor = `#f0f0f0`;
  const indicatorColor = `#042b62`;
  const indicatorCap = `round`;
  const spinnerMode = false;
  const spinnerSpeed = 1;

  const center = size / 2;
  const radius =
    center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth);
  const dashArray = 2 * Math.PI * radius;
  const dashOffset = dashArray * ((100 - progress) / 100);
  // useEffect(() => {
  //     let interval;
  //     if (isActive && seconds > 0) {
  //         interval = setInterval(() => {
  //             setSeconds((prevSeconds) => prevSeconds - 1);
  //         }, 1000);
  //     } else if (seconds === 0) {
  //         setIsActive(false);
  //         clearInterval(interval);
  //     }
  //     return () => clearInterval(interval);
  // }, [isActive, seconds]);

  const sessionData = useRef("");

  return (
    <div>
      <HideHeader />
      <div
        className={`white-modal fn-redeem-modal ${Bankbalance.BanklistData} `}
      >
        <div className={` ${Bankbalance.BankaccLoader} `}>
          <div
            className={`${Bankbalance.svgpiwrapper}`}
            style={{ width: size, height: size }}
          >
            <svg
              className="svg-pi"
              width="200"
              height="200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="svg-pi-track"
                cx={center}
                cy={center}
                fill="transparent"
                r={radius}
                stroke={trackColor}
                strokeWidth={trackWidth}
              />

              <circle
                className={`svg-pi-indicator ${
                  spinnerMode ? "svg-pi-indicator--spinner" : ""
                }`}
                style={{ animationDuration: `${spinnerSpeed * 90000}ms` }}
                cx={center}
                cy={center}
                fill="transparent"
                r={radius}
                stroke={indicatorColor}
                strokeWidth={indicatorWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap={indicatorCap}
              />
              <image
                x="50"
                y="55"
                width="50"
                height="50"
                href={imageURL}
              ></image>
            </svg>
          </div>
          {/* <div className={` ${Bankbalance.bankAccLoadingPage} ${isLoading ? Bankbalance.loader : ''}`}>
                        <img src={process.env.REACT_APP_STATIC_URL + "media/wp/FintooImg.png"} />
                    </div> */}
          <p
            style={{ fontSize: "1.2rem" }}
            className={`${Bankbalance.LoadContent}`}
          >
            Generating Verification Link
          </p>
          <p
            style={{ whiteSpace: "nowrap" }}
            className={`${Bankbalance.LoadContentdes}`}
          >
            This May Take 80 to 90 Seconds. We Will Notify You Once The Data
            Received From {bankDetail.length > 0 && bankDetail[0]['bank_name']}
          </p>
          <div className={`${transactioncss.transactionPartner}`}>
            <div>
              <img
                src={process.env.REACT_APP_STATIC_URL + "media/DMF/BSE.png"}
              />
            </div>
            <div>
              <img
                src={process.env.REACT_APP_STATIC_URL + "media/DMF/Nach.png"}
              />
            </div>
            <div className={`${transactioncss.emandate}`}>
              E-mandate <br /> Powered by
            </div>
            <div>
              <img
                src={process.env.REACT_APP_STATIC_URL + "media/DMF/NPCI.png"}
              />
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-center align-items-center">
            <div>
              <img
                src={
                  process.env.REACT_APP_STATIC_URL + "media/DMF/security.svg"
                }
                alt=""
                width={30}
              />
            </div>
            <div className="ms-3 font-bold">100% Safe And Secure Payment</div>
          </div>
        </div>
      </div>
      <LoadingModal />
    </div>
  );
};

export default Bankverificationlink;
