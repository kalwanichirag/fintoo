import React, { useEffect, useRef, useState } from "react";
import Bankbalance from "../BankCashbalance/Bankbalance.module.css";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import Checked from "../../../components/FintooRadio2/radio-on-button.svg";
import Unchecked from "../../../components/FintooRadio2/radio-off-button.svg";
import styles from "../../../components/FintooRadio2/style.module.css";
import { Modal } from "react-bootstrap";
import { AiFillInfoCircle, AiOutlineCloseCircle } from "react-icons/ai";
import socket, { onMessageHandler } from "./socket";
import commonEncode from "../../../commonEncode";
import { apiCall, createCookie, getCookie, getItemLocal, getParentUserId } from "../../../common_utilities";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { CHECK_SESSION } from "../../../constants";
import { v1 as uuidv1 } from 'uuid';

const BankAccountSelection = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionNew, setSelectedOptionNew] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [isAddingCustomNumber, setIsAddingCustomNumber] = useState(false);
  const [openModalByName, setOpenModalByName] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [linkedBankAccount, setLinkedBankAccount] = useState([]);
  const [discoveredBankAccount, setDiscoveredBankAccount] = useState({});
  const [userBankName, setUserBankName] = useState("");
  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [accRefNumber, setAccRefNumber] = useState("");
  const [errorShown, setErrorShown] = useState(false);
  const sessionData = useRef("");
  const { v4: uuidv1 } = require("uuid");
  const [timerActive, setTimerActive] = useState(false);
  

  // useEffect(() => {
  //   const checksession = async () => {
  //     try {
  //       let url = '';
// let url = CHECK_SESSION;
  //       let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
  //       let session_data = await apiCall(url, data, true, false);
  //       sessionData.current = session_data;
  //     } catch (e) {
  //       console.log("Error", e);
  //     }
  //   };

  //   // checksession();
  // }, []);

  useEffect(() => {
    let timer;

    if (timerActive) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            setTimerActive(false); // Timer reached 00:00, set it as inactive
            clearInterval(timer);
            return 0;
          }
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [timerActive]);

  useEffect(() => {
    socket.onopen = (event) => {};
    socket.onmessage = (event) => {
      const data = onMessageHandler(event);

      if (data.payload.status) {
        setFlag(true);
        setRefNumber(data.payload.RefNumber);

        if (data.payload.AccLinkDetails) {
          setAccRefNumber(data.payload.AccLinkDetails);

          let bankdata = {
            refNumber: data.payload.AccLinkDetails["0"].linkRefNumber,
            accRefNumber: data.payload.AccLinkDetails["0"].accRefNumber,
          };
          commonEncode.encrypt(
            createCookie(
              "bankdata",
              commonEncode.encrypt(JSON.stringify(bankdata)),
              15
            )
          );

          navigate(
            `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-confirmation/`
          );
        }
        // } else {
        //   navigate(
        //     `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`
        //   );
        //   toastr.options.positionClass = "toast-bottom-left";
        //   toastr.error(
        //     "OTP verification unsuccessful! Please try again after some time."
        //   );
        // }
      } else {
        navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(
          "Something went wrong."
        );
      }
      //   toastr.options.positionClass = "toast-bottom-left";
      //   toastr.success("Your bank account is already linked with FINVU");
      //   navigate(
      //     `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-confirmation/`
      //   );
      // }
      // else {
      //   // navigate(
      //   //   `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-list/?userId=${userId}&sid=${sid}`
      //   // );
      // })
    };
  }, []);

  // const location = useLocation();
  const [sid, setSid] = useState("");
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    // Extract the 'payload' query parameter from the URL
    let payload = JSON.parse(commonEncode.decrypt(getCookie("payload")));
    let userId = payload.userId.replace(/[^0-9]/g, "");
    setUser(userId);
    setSid(payload.sid);
    setUserId(payload.userId);

    let bankname = JSON.parse(commonEncode.decrypt(getCookie("bankname")));
    setUserBankName(bankname);

    if (getCookie("linkedaccounts")) {
      let linkedBankAccounts = JSON.parse(
        commonEncode.decrypt(getCookie("linkedaccounts"))
      );
      setLinkedBankAccount(linkedBankAccounts.linkedaccounts);
    } else {
      let linkedBankAccounts = {};
      setLinkedBankAccount(linkedBankAccounts);
    }

    if (getCookie("discoveredaccounts")) {
      let discoveredBankAccounts = JSON.parse(
        commonEncode.decrypt(getCookie("discoveredaccounts"))
      );
      setDiscoveredBankAccount({ ...discoveredBankAccounts["0"] });
    } else {
      setDiscoveredBankAccount({});
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  const handleRadioClick = (account, index) => {
    setSelectedOption(index);
    setSelectedOptionNew(false);
    let rid = uuidv1();

    let account_linking_payload = {
      header: {
        mid: rid,
        ts: new Date().toISOString().replace("Z", "+00:00"),
        sid: sid,
        dup: "false",
        type: "urn:finvu:in:app:req.linking.01",
      },
      payload: {
        ver: "1.1.2",
        timestamp: new Date().toISOString().replace("Z", "+00:00"),
        txnid: "8cc9b944-f599-45ec-9f77-24108e7a70b8",
        FIPDetails: {
          fipId: account.fipId,
          fipName: account.fipName,
        },
        Customer: {
          id: userId,
          Accounts: [
            {
              maskedAccNumber: account.maskedAccNumber,
              accRefNumber: account.accRefNumber,
              FIType: account.FIType,
              accType: account.accType,
            },
          ],
        },
      },
    };

    socket.send(JSON.stringify(account_linking_payload));

    const payload = {
      linkedaccounts: account,
      sid: sid,
      userId: userId,
    };

    commonEncode.encrypt(
      createCookie(
        "selectedAccounts",
        commonEncode.encrypt(JSON.stringify(payload)),
        15
      )
    );
    // setIsAddingCustomNumber(false);
  };

  const [customNumber, setCustomNumber] = useState("");

  const handleRadioClickBankOtp = (account, index) => {
    setOpenModalByName("BankOtp");
    let number = getCookie("user");
    setCustomNumber(number);
    let rid = uuidv1();

    let account_linking_payload = {
      header: {
        mid: rid,
        ts: new Date().toISOString().replace("Z", "+00:00"),
        sid: sid,
        dup: "false",
        type: "urn:finvu:in:app:req.linking.01",
      },
      payload: {
        ver: "1.1.2",
        timestamp: new Date().toISOString().replace("Z", "+00:00"),
        txnid: "8cc9b944-f599-45ec-9f77-24108e7a70b8",
        FIPDetails: {
          fipId: userBankName.fipId,
          fipName: userBankName.fipName,
        },
        Customer: {
          id: userId,
          Accounts: [
            {
              maskedAccNumber: account.maskedAccNumber,
              accRefNumber: account.accRefNumber,
              FIType: account.FIType,
              accType: account.accType,
            },
          ],
        },
      },
    };

    socket.send(JSON.stringify(account_linking_payload));

    const payload = {
      linkedaccounts: account,
      sid: sid,
      userId: userId,
    };

    commonEncode.encrypt(
      createCookie(
        "selectedAccounts",
        commonEncode.encrypt(JSON.stringify(payload)),
        15
      )
    );
    setIsAddingCustomNumber(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(60);
  };
  useEffect(() => {
    let interval;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const linkedBankData = async () => {
    toastr.options.positionClass = "toast-bottom-left";
    toastr.success("Your bank account is already linked with FINVU");

    navigate(
      `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-confirmation/`
    );
  };

  const verifyOTP = async (otp) => {
    let payload = JSON.parse(commonEncode.decrypt(getCookie("payload")));
    let rid = uuidv1();

    try {
      let account_confirm_linking_payload = {
        header: {
          mid: rid,
          ts: new Date().toISOString().replace("Z", "+00:00"),
          sid: payload.sid,
          dup: "false",
          type: "urn:finvu:in:app:req.confirm-token.01",
        },
        payload: {
          ver: "1.1.2",
          timestamp: new Date().toISOString().replace("Z", "+00:00"),
          txnid: "de3115b6-a367-4153-9890-700cc6967e70",
          AccountsLinkingRefNumber: refNumber,
          token: otp,
        },
      };

      if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify(account_confirm_linking_payload));
      } else {
        console.error("WebSocket is not open. Cannot send data.");
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("OTP verification unsuccessful");
      }
    } catch (e) {
      console.error(
        "An error occurred during OTP verification:",
        error.message
      );
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("OTP verification unsuccessful");
    }
  };

  const handleResendClick = (session) => {
    if (!timerActive) {
      startTimer();
      handleRadioClickBankOtp(discoveredBankAccount, 0);
    }
  };

  const startTimer = () => {
    setSeconds(60); // Set the initial timer value (change this value as needed)
    setTimerActive(true);
  };

  return (
    <div className={`${Bankbalance.BankSelectsection}`}>
      <HideHeader />
      <div
        className={`white-modal fn-redeem-modal ${Bankbalance.BanklistData}`}
      >
        <div className={`${Bankbalance.Accountnotfound}`}>
          <div className={`row ps-0 ${Bankbalance.AccHeader}`}>
            <div className="col-md-4 col-2">
              <Link
                to={
                  process.env.PUBLIC_URL +
                  "/datagathering/assets-liabilities/bank-list"
                }
              >
                <IoChevronBackCircleOutline className="btn-fintoo-back" />
              </Link>
            </div>
            <div
              className={`col-md-8 col-9 ps-4 pb-md-4 pb-2 pb-md-4 pb-2 ${Bankbalance.TextHeader}`}
            >
              Select Bank Account
            </div>
          </div>
          <div className={`${Bankbalance.bankaccnotfounfinfo}`}>
            <p className={`text-black ${Bankbalance.text}`}>
              We found this bank account linked to your mobile number +91 {user}.{" "}
              Please select the account you want to link.
            </p>
          </div>
          <div className={`${Bankbalance.mobileNumberLayout}`}>
            {linkedBankAccount && linkedBankAccount.length > 0 ? (
              linkedBankAccount.map((account, index) => {
                if (
                  account.fipName === userBankName.fipName &&
                  account.maskedAccNumber ===
                    discoveredBankAccount.maskedAccNumber
                ) {
                  return (
                    <div
                      key={index}
                      className={`${Bankbalance.mobileNumberBox}`}
                    >
                      <div
                        className={` align-items-center row ${styles.radio}`}
                        onClick={() => handleRadioClick(account, index)}
                      >
                        <div className="pt-0 col-md-1 col-1 ms-2">
                          <img
                            src={selectedOption === index ? Checked : Unchecked}
                            alt="Radio Button"
                          />
                        </div>
                        <div className="pt-0 col-md-9 col-10 d-flex align-items-center">
                          <div className={`pt-0 ${Bankbalance.ss}`}>
                            <img
                              style={{ width: "2rem", height: "2rem" }}
                              className={`${Bankbalance.bankImg}`}
                              src={`${process.env.REACT_APP_STATIC_URL}${userBankName.fipLogo}`}
                              alt="Bank Name"
                            />
                          </div>
                          <div className={`pt-0 ${Bankbalance.bankDetails}`}>
                            <div className={`${Bankbalance.bankAccType}`}>
                              {account.accType} ACCOUNT
                            </div>
                            <div className={`${Bankbalance.bankAccno}`}>
                              {account.maskedAccNumber}
                            </div>
                            <div className={`${Bankbalance.bankName}`}>
                              {account.fipName}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return null;
                  // if (!errorShown) {
                  //   setErrorShown(true);
                  //   navigate(
                  //     `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`
                  //   );
                  //   toastr.options.positionClass = "toast-bottom-left";
                  //   toastr.error(
                  //     "Could not fetch account details from the bank"
                  //   );
                  // }
                }
              })
            ) : (
              <div>
                {//console.log("otp data", discoveredBankAccount)
                }
                {discoveredBankAccount && (
                  <div className={`${Bankbalance.mobileNumberBox}`}>
                    <div
                      className={` align-items-center row ${styles.radio}`}
                      onClick={() =>
                        handleRadioClickBankOtp(discoveredBankAccount, 0)
                      }
                    >
                      <div className="pt-0 col-md-1 col-1 ms-2">
                        <img
                          src={selectedOption === 0 ? Checked : Unchecked}
                          alt="Radio Button"
                        />
                      </div>
                      <div className="pt-0 col-md-9 col-10 d-flex align-items-center">
                        <div className={`pt-0 ${Bankbalance.ss}`}>
                          <img
                            style={{ width: "2rem", height: "2rem" }}
                            className={`${Bankbalance.bankImg}`}
                            src={`${process.env.REACT_APP_STATIC_URL}${userBankName.fipLogo}`}
                            alt="Bank Name"
                          />
                        </div>
                        <div className={`pt-0 ${Bankbalance.bankDetails}`}>
                          <div className={`${Bankbalance.bankAccType}`}>
                            {discoveredBankAccount.accType} ACCOUNT
                          </div>
                          <div className={`${Bankbalance.bankAccno}`}>
                            {discoveredBankAccount.maskedAccNumber}
                          </div>
                          <div className={`${Bankbalance.bankName}`}>
                            {userBankName.fipName}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className={` mt-4 ${Bankbalance.Errorfindacc}`}>
              <div
                className="d-flex align-items-center"
                style={{ color: "red", fontWeight: "500" }}
              >
                <span>
                  {" "}
                  <AiFillInfoCircle
                    style={{ transform: "rotate(180deg)", fontSize: "1.2rem" }}
                  />{" "}
                </span>
                <span className="pt-1 ps-2"> Couldn't Find your account ?</span>
              </div>
              <div className="mt-3">
                In case you have a savings account linked to secondary mobile
                number please modify your number.
              </div>
              <div className="mt-2">
                <Link
                  className={`${Bankbalance.modifymob}`}
                  to={
                    process.env.PUBLIC_URL +
                    "/datagathering/assets-liabilities/bank-account-mobile-number"
                  }
                >
                  Modify Mobile Number
                </Link>
              </div>
              <div className={`${Bankbalance.noteSection}`}>
                <span>Note :</span> We currently don't support joint and current account.
              </div>
            </div>
          </div>
          {flag && (
            <div className={`${Bankbalance.alternateOption}`}>
              <button
                onClick={() => {
                  // setOpenModalByName("BankOtp");
                  linkedBankData();
                }}
              >
                Proceed
              </button>
            </div>
          )}
        </div>
        <div className="col-md-10 mb-5 mt-md-2">
          <div
            className={`pt-md-2 me-md-5 me-4 ${Bankbalance.thirdPartySection}`}
          >
            Powered by RBI regulated Account Aggregator{" "}
            <img
              src={process.env.REACT_APP_STATIC_URL + "media/DG/Finvu.png"}
              width={"60px"}
            />
          </div>
        </div>
      </div>
      <HideFooter />

      <Modal
        backdrop="static"
        show={openModalByName == "BankOtp"}
        className="white-modal fn-redeem-modal"
        onHide={() => {
          setOpenModalByName("");
        }}
      >
        {stepCount == 0 && (
          <>
            <Modal.Header className="py-3 mt-5">
              <div className="modal-title" style={{ fontWeight: "bold" }}>
                Enter OTP
              </div>
              <div
                onClick={() => {
                  setOpenModalByName("");
                }}
                className={`${Bankbalance.closeButton}`}
              >
                <AiOutlineCloseCircle />
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className={`${Bankbalance.bankmodal}`}>
                <div>
                  <div className="modal-whitepopup-box-item grey-color border-top-0">
                    <div className=" text-center grey-color">
                      <div className={`${Bankbalance.Stylishborder}`}>
                        <div className={`${Bankbalance.modalDecs}`}>
                          {userBankName.fipName} Bank will send you OTP to
                          verify the accounts associated.
                          {/* <img
                            className="ms-1"
                            style={{ width: "2rem", height: "2rem" }}
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/hdfc.png"
                            }
                            alt="Bank Name"
                          /> */}
                        </div>
                      </div>
                      <div className={`mt-3 ${Bankbalance.otpText}`}>
                        Sent to
                      </div>
                      <div className={`pt-2 ${Bankbalance.Otpmobilenumber}`}>
                        {/* +91 9374889689 */}
                        {"+91 " + customNumber}
                      </div>
                    </div>
                  </div>
                  <div className="modal-whitepopup-box-item grey-color text-center">
                    <div className={`${Bankbalance.EnterOtplabel}`}>
                      Enter OTP Here
                    </div>
                    <div className="w-50 m-auto pt-2">
                      <input
                        type="text"
                        value={mobileOtp}
                        className={`bottom-border-input w-100 text-center ${Bankbalance.OtpNumber}`}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          setMobileOtp(numericValue);
                        }}
                      />
                    </div>
                    <div className="py-3">
                      Resend verification code
                      <span className={`ps-2 ${Bankbalance.Otptimer}`}>
                        {seconds > 0 ? (
                          <span>
                            {`${Math.floor(seconds / 60)}:${
                              seconds % 60 < 10 ? "0" : ""
                            }${seconds % 60}`}{" "}
                          </span>
                        ) : (
                          <label
                            className="pointer"
                            onClick={() =>
                              handleResendClick(sessionData.current)
                            }
                          >
                            Resend
                          </label>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <div
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                  }}
                  className="switch-fund-btn mobile-bottom-button"
                  onClick={() => verifyOTP(mobileOtp)}
                >
                  Submit
                </div>
              </div>
              <div className={`${Bankbalance.thirdPartyLabel}`}>
                Powered by RBI regulated Account Aggregator{" "}
                <img
                  src={process.env.REACT_APP_STATIC_URL + "media/DG/Finvu.png"}
                  width={"60px"}
                />
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
};

export default BankAccountSelection;
