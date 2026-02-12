import React, { useEffect, useRef, useState } from "react";
import Styles from "../moneymanagement.module.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Header from "./Header";
import ChangeMobileNumber from './ChangeMobileNumber'
import { useData } from '../context/DataContext';
import socket, { onMessageHandler } from "./socket";
import * as toastr from "toastr";

const ResetTimer = ({ resetFun }) => {

  const intervalInstanceRef = useRef(null);

  const [countdown, setCountdown] = useState(60);

  useEffect(() => {

    if (countdown > 0) {
      intervalInstanceRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
    }

    return () => clearTimeout(intervalInstanceRef.current);
  }, [countdown]);

  const handleResendOTP = () => {
    setCountdown(60);
  };

  return (
    <>
      {
        countdown == 0 ? <span onClick={() => {
          handleResendOTP();
          resetFun()
        }
        } >Resend</span> : <span>Resend in {countdown} Seconds</span>
      }
    </>
  )
}

const VerifyMobilenumber = (props) => {
  const { mob_no, otpReference, handleId } = useData();
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);


  const [errorMessage, setErrorMessage] = useState("");

  const [processcount, setProcessCount] = useState(0);
  const handleInput = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      otp[index] = value;
      setOTP([...otp]);

      if (value && index < 5) {
        inputRefs[index + 1].current.focus();
      } else if (index === 5 && value) {
        // Check if this is the last input field and it has a value
        handleLastStep();
      }
    }
    setErrorMessage("");
  };
  const handleBackspace = (e, index) => {
    if (e.keyCode === 8 && !otp[index] && index > 0) {
      otp[index - 1] = "";
      setOTP([...otp]);
      inputRefs[index - 1].current.focus();
    }
  };
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const handleProceedClick = () => {
    setProcessCount(processcount + 1);
  };
  const handleBackProceedClick = () => {
    setProcessCount(processcount - 1);
  };
  const handleonNextviewshow = () => {
    props.onNextviewshow();
  };
  const resend_otp = () => {
    setOTP(["", "", "", "", "", ""])
    const resend_otp_payload = {
      header: {
        mid: "fcd2c56e-9414-11e8-9eb6-529269fb1459",
        ts: new Date().toISOString().replace("Z", "+00:00"),
        sid: "",
        dup: "false",
        type: "urn:finvu:in:app:req.loginOtp.01",
      },
      payload: {
        username: mob_no + "@finvu",
        mobileNum: mob_no,
        handleId: handleId,
      },
    };
    socket.send(JSON.stringify(resend_otp_payload));
  }

  const handleLastStep = () => {
    const combinedOTP = otp.join("");
    try {
      const verify_otp_payload = {
        "header": {
          "mid": "fcd2c56e-9414-11e8-9eb6-529269fb1459",
          "ts": (new Date().toISOString()).replace('Z', '+00:00'),
          "sid": "",
          "dup": "false",
          "type": "urn:finvu:in:app:req.loginOtpVerify.01"
        },
        "payload": {
          "otpReference": otpReference,
          "otp": combinedOTP
        }
      };
      socket.send(JSON.stringify(verify_otp_payload));
    }
    catch (error) {
      console.error("An error occurred:", error.message);
    }
  }

  return (
    <div style={{ position: "relative" }} className={`${Styles.SelectBankslist}`}>
      {processcount === 0 && (

        <ChangeMobileNumber onBackProceedClick={() => props.onBackstepProceedclick()} onProceedClick={handleProceedClick} onNextviewshow={handleonNextviewshow} />
      )}
      {processcount === 1 && (
        <div>
          <div>
            <div className='d-md-flex d-none align-items-md-center'>
              <div>
                <div>
                  <img
                    className="pointer"
                    onClick={() => {
                      setOTP(["", "", "", "", "", ""])
                      handleBackProceedClick();
                    }}
                    src={`${process.env.REACT_APP_STATIC_URL +
                      "media/MoneyManagement/Back.png"
                      }`}
                    alt="Back-button"
                  />
                </div>
              </div>
              <Header
                isMobileNumberDes={processcount === 1}
                title={"Verify your mobile number"}
                mobNo={mob_no}
                // decscription={description}
                mobileNumberStyle={{ color: '#042b62', fontWeight: 'bold' }}
              />
            </div>
            <div className={`mt-md-5 ${Styles.OtpForm}`}>
              <div className={`${Styles.Datatitle}`}>
                Type your 6 digit security code
              </div>
              <div>
                <div className={` ${Styles.OtpFields}`}>
                  <div>
                    {otp.map((value, index) => (
                      <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        className={Styles.otpnumber}
                        value={value}
                        onChange={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleBackspace(e, index)}
                        min={1}
                        max={1}
                        autoFocus={index == 0}
                      />
                    ))}
                    {errorMessage && (
                      <div className={`${Styles.ErrorField}`}>{errorMessage}</div>
                    )}
                  </div>
                  {/* <div className={`${Styles.notfoundnumber}`}>
                    We could not find any account with your mobile number{" "}
                    <span className={`${Styles.mobileNUmber}`}>+91 9876897830</span>{" "}
                    <span
                      onClick={openPopup}
                      className={`${Styles.DatainfoIcon}`}
                    >
                      <IoMdInformationCircleOutline />{" "}
                    </span>
                  </div> */}
                  <div className={`${Styles.otpresendtext}`}>
                    <span>Didn’t get the code ? </span> <span style={{ color: '#3E97FF !important' }} > <ResetTimer resetFun={resend_otp} /></span>
                  </div>
                  <div
                    onClick={() => {
                      setOTP(["", "", "", "", "", ""])
                      setProcessCount(0);
                    }}
                    className={`${Styles.changenumberText}`}
                  >
                    Change Number
                  </div>
                </div>
              </div>
              <div className={`${Styles.ContinueButton}`}>
                <button className={`d-md-none ${Styles.mobileBackbtn}`} onClick={() => {
                  props.onBackstepProceedclick();
                }}>Back</button>
                <button onClick={() => {
                  handleLastStep();
                  // props.onNextviewshow();
                }}>Continue</button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default VerifyMobilenumber;