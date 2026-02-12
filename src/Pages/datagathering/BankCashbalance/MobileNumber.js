import React, { useEffect, useState } from "react";
import Bankbalance from "../BankCashbalance/Bankbalance.module.css";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import { Link, useNavigate } from "react-router-dom";
import FintooBackButton from "../../../components/HTML/FintooBackButton";
import Checked from "../../../components/FintooRadio2/radio-on-button.svg";
import Unchecked from "../../../components/FintooRadio2/radio-off-button.svg";
import styles from "../../../components/FintooRadio2/style.module.css";
import { Modal } from "react-bootstrap";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { CHECK_SESSION, FINVU_BASE_API_URL, FINVU_PASSWORD, FINVU_USER_ID } from "../../../constants";
import {
  apiCall,
  createCookie,
  getCookie,
  getItemLocal,
  getUserId,
} from "../../../common_utilities";
import socket, { onMessageHandler } from "./socket";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import commonEncode from "../../../commonEncode";

const MobileNumber = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [customNumber, setCustomNumber] = useState("");
  const [isAddingCustomNumber, setIsAddingCustomNumber] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [openModalByName, setOpenModalByName] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [session, setSession] = useState("");
  const [error, setError] = useState("");

  const radioOptions = [];

  // useEffect(() => {

  //   const checksession = async () => {
  //     try {
  //       let url = '';
// let url = CHECK_SESSION;
  //       let data = { user_id: getUserId(), sky: getItemLocal("sky") };
  //       let session_data = await apiCall(url, data, true, false);

  //       if (session_data["error_code"] == "100") {
  //         setSession(session_data);
  //       }
  //     } catch (e) {
  //       console.log("Error", e);
  //     }
  //   };

  //   // checksession();
  // }, []);

  const handleRadioClick = (index) => {
    setSelectedOption(index);
    setIsAddingCustomNumber(false);
  };

  const handleAddCustomNumber = () => {
    setSelectedOption(null);
    setIsAddingCustomNumber(true);
  };

  const handleCustomNumberChange = (e) => {
    let numericValue = e.target.value.replace(/[^0-9]/g, "");
    numericValue = numericValue.slice(0, 10);
    setCustomNumber(numericValue);
    setSelectedOption(null);
  };

  const handleSubmitCustomNumber = (event) => {
    event.preventDefault();
    setCustomNumber("");
    setIsAddingCustomNumber(false);
  };

  // const handleReset = () => {
  //   setIsActive(false);
  //   setSeconds(60);
  // };
  // useEffect(() => {
  //   let interval;

  //   if (isActive && seconds > 0) {
  //     interval = setInterval(() => {
  //       setSeconds((prevSeconds) => prevSeconds - 1);
  //     }, 1000);
  //   } else if (seconds === 0) {
  //     setIsActive(false);
  //     clearInterval(interval);
  //   }

  //   return () => clearInterval(interval);
  // }, [isActive, seconds]);

  const navigate = useNavigate();
  const [sid, setSid] = useState("");
  const [userId, setUserId] = useState("");
  const [handleId, setHandleId] = useState("");

  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const startTimer = () => {
    setSeconds(60); // Set the initial timer value (change this value as needed)
    setTimerActive(true);
  };

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

  const handleResendClick = (session) => {
    if (!timerActive) {
      startTimer();
      fetchOTP(session);
    }
  };

  useEffect(() => {
    socket.onopen = (event) => { };
    socket.onmessage = (event) => {
      const data = onMessageHandler(event);

      const eventdata = JSON.stringify(event);

      if (data.payload.status == "SEND") {
        setOtpReference(data.payload.otpReference);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("OTP sent successfully");
        setOpenModalByName("mobileOtp");
      } else if (data.payload.status == "SUCCESS") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("OTP verified successfully");
        const payload = {
          sid: data.header.sid,
          userId: data.payload.userId,
        };
        commonEncode.encrypt(
          createCookie(
            "payload",
            commonEncode.encrypt(JSON.stringify(payload)),
            15
          )
        );

        try {
          let linked_banks_payload = {
            header: {
              mid: "fcd2c56e-9414-11e8-9eb6-529269fb1459",
              ts: new Date().toISOString().replace("Z", "+00:00"),
              sid: data.header.sid,
              dup: "false",
              type: "urn:finvu:in:app:req.userLinkedAccount.01",
            },
            payload: {
              userId: data.payload.userId,
            },
          };

          socket.send(JSON.stringify(linked_banks_payload));

          socket.onmessage = (event) => {
            const accountData = onMessageHandler(event);
            const payload = {
              linkedaccounts: accountData.payload.LinkedAccounts,
            };
            commonEncode.encrypt(
              createCookie(
                "linkedaccounts",
                commonEncode.encrypt(JSON.stringify(payload)),
                15
              )
            );

            if (accountData.payload.status) {
              try {
                let bankname = JSON.parse(
                  commonEncode.decrypt(getCookie("bankname"))
                );

                let rid = uuidv4();

                let account_discovery_payload = {
                  header: {
                    mid: rid,
                    ts: new Date().toISOString().replace("Z", "+00:00"),
                    sid: data.header.sid,
                    dup: false,
                    type: "urn:finvu:in:app:req.discover.01",
                  },

                  payload: {
                    ver: "1.1.2",
                    timestamp: new Date().toISOString().replace("Z", "+00:00"),
                    txnid: uuidv4(),
                    Customer: {
                      id: data.payload.userId,
                      Identifiers: [
                        {
                          category: "STRONG",
                          type: "MOBILE",
                          value: data.payload.userId.replace(/[^0-9]/g, ""),
                        },
                      ],
                    },
                    FIPDetails: {
                      fipId: bankname.fipId,
                      fipName: bankname.fipName,
                    },
                    FITypes: ["DEPOSIT", "RECURRING_DEPOSIT", "TERM-DEPOSIT"],
                  },
                };

                socket.send(JSON.stringify(account_discovery_payload));

                socket.onmessage = (event) => {
                  const accountData = onMessageHandler(event);
                  commonEncode.encrypt(
                    createCookie(
                      "discoveredaccounts",
                      commonEncode.encrypt(
                        JSON.stringify(accountData.payload.DiscoveredAccounts)
                      ),
                      15
                    )
                  );

                  if (accountData.payload.status == "SUCCESS") {
                    navigate(
                      `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-select/`
                    );
                  } else if (accountData.payload.status == "RECORD-NOT-FOUND") {
                    navigate(
                      `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-not-found/`
                    );
                  } else {
                    toastr.options.positionClass = "toast-bottom-left";
                    toastr.error("Something went wrong");
                    navigate(
                      `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`
                    );
                  }
                };
              } catch (e) {
                console.log("Error", e);
              }
            } else {
              navigate(
                `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-list/`
              );
            }
          };
        } catch (e) {
          console.log("Error", e);
        }
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Invalid OTP");
        navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
      }
    };
  }, []);

  const { v4: uuidv4 } = require("uuid");
  const [otpReference, setOtpReference] = useState("");

  const fetchOTP = async (session) => {
    
    let toastDisplayed = false;

    if (customNumber) {
      // let mobileNo = session.data.mobile;
      let mobileNo = customNumber;

      try {
        // Generate a dynamic rid
        const rid = uuidv4();
        const ts = new Date().toISOString();

        const loginPayload = {
          header: {
            rid: rid,
            ts: ts,
            channelId: "finsense",
          },
          body: {
            userId: FINVU_USER_ID,
            password: FINVU_PASSWORD,
          },
        };

        const url = FINVU_BASE_API_URL + "/User/Login";
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginPayload),
        };

        const loginResponse = await fetch(url, options);
        if (loginResponse.status === 200) {
          const responseData = await loginResponse.json();
          const token = responseData.body.token;

          let consent_url =
            "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/ConsentRequestPlus";

          let redirect_url = `https://stg.minty.co.in/money_managment/FatchDataFromAccount/?mob_no=${mobileNo}`;

          const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          };
          const payload = {
            header: {
              ts: ts,
              channelId: "finsense",
              rid: rid,
            },
            body: {
              custId: mobileNo + "@finvu",
              consentDescription: "Apply for loan",
              templateName: "BANK_STATEMENT_PERIODIC",
              userSessionId: "sessionid123",
              redirectUrl: redirect_url,
              ConsentDetails: {},
            },
          };

          const url = FINVU_BASE_API_URL + "/ConsentRequestPlus";
          const options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
          };
          const response = await fetch(url, options);

          if (response.status === 200) {
            const responseData = await response.json();
            setHandleId(responseData.body.ConsentHandle);

            const socketCreation = () => {
              // Send OTP payload
              const send_otp_payload = {
                header: {
                  mid: "fcd2c56e-9414-11e8-9eb6-529269fb1459",
                  ts: new Date().toISOString().replace("Z", "+00:00"),
                  sid: "",
                  dup: "false",
                  type: "urn:finvu:in:app:req.loginOtp.01",
                },
                payload: {
                  username: mobileNo + "@finvu",
                  mobileNum: mobileNo,
                  handleId: responseData.body.ConsentHandle,
                },
              };

              socket.send(JSON.stringify(send_otp_payload));
              commonEncode.encrypt(
                createCookie(
                  "customerhandleId",
                  commonEncode.encrypt(
                    JSON.stringify(responseData.body.ConsentHandle)
                  ),
                  15
                )
              );
            };
            socketCreation();
          }
        } else {
          console.error(
            "Request failed with status code:",
            loginResponse.status
          );
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
      }
    } else {
      if (!toastDisplayed) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Please enter mobile number");
        toastDisplayed = true; // Set the flag to true
      }
    }
  };

  const verifyOTP = async (otp) => {
    try {

      const verifyOTPPayload = {
        header: {
          mid: "fcd2c56e-9414-11e8-9eb6-529269fb1459",
          ts: new Date().toISOString().replace("Z", "+00:00"),
          sid: "",
          dup: "false",
          type: "urn:finvu:in:app:req.loginOtpVerify.01",
        },
        payload: {
          otpReference: otpReference, // Pass the OTP reference received from the previous step
          otp: otp, // Replace with the actual OTP value
        },
      };

      if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify(verifyOTPPayload));
      } else {
        console.error("WebSocket is not open. Cannot send data.");
      }
    } catch (error) {
      console.error(
        "An error occurred during OTP verification:",
        error.message
      );
    }
  };

  return (
    <div>
      <HideHeader />
      <div
        className={`white-modal fn-redeem-modal ${Bankbalance.BanklistData}`}
      >
        <div className={`${Bankbalance.Accountnotfound}`}>
          <div className={`row ${Bankbalance.AccHeader}`}>
            <div className="col-md-4 col-2">
              <Link
                to={
                  process.env.PUBLIC_URL + "/datagathering/assets-liabilities"
                }
              >
                <IoChevronBackCircleOutline
                  className={`btn-fintoo-back ${Bankbalance.backIcon}`}
                />
              </Link>
            </div>
            <div
              className={`col-md-8 col-9 ps-4 pb-md-4 pb-2 pb-md-4 pb-2 ${Bankbalance.TextHeader}`}
            >
              Select Mobile Number
            </div>
          </div>
          <div className={`${Bankbalance.bankaccnotfounfinfo}`}>
            <p className={`text-black ${Bankbalance.text}`}>
              Select an already verified number for finding your account or use
              another number.
            </p>
          </div>
          <div className={`${Bankbalance.mobileNumberLayout}`}>
            {radioOptions.map((option, index) => (
              <div key={index} className={`${Bankbalance.mobileNumberBox}`}>
                <div
                  className={`d-flex align-items-center ${styles.radio}`}
                  onClick={() => handleRadioClick(index)}
                >
                  <div>
                    <img
                      src={selectedOption === index ? Checked : Unchecked}
                      alt="Radio Button"
                    />
                  </div>
                  <div className={`${Bankbalance.mobileNumber}`}>{option}</div>
                </div>
              </div>
            ))}

            {isAddingCustomNumber ? (
              // Render the custom number input field
              <div className={`${Bankbalance.mobileNumberBox}`}>
                <form onSubmit={handleSubmitCustomNumber}>
                  <div className={`d-flex align-items-center ${styles.radio}`}>
                    <div className={`${Bankbalance.mobileNumber}`}>
                      <input
                        className={`${Bankbalance.mobilenumberfield}`}
                        type="text"
                        placeholder="Enter Your Number Here"
                        value={customNumber}
                        onChange={handleCustomNumberChange}
                      />
                      {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              // Render the "Add another number" button
              <div className={`${Bankbalance.mobileNumberBox}`}>
                <div className={`d-flex align-items-center`}>
                  <div
                    className={`${Bankbalance.Addnumbertext}`}
                    onClick={handleAddCustomNumber}
                  >
                    + Add another number
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={`${Bankbalance.alternateOption}`}>
            <button
              onClick={() => {
                fetchOTP(session);
              }}
            >
              Continuesss
            </button>
            <div className={`${Bankbalance.ExitBtn}`}>
              <Link
                className="text-decoration-none"
                to={
                  process.env.PUBLIC_URL +
                  "/datagathering/assets-liabilities/bank-account-not-found"
                }
              >
                Back to Instructions
              </Link>
            </div>
            <div></div>
          </div>
        </div>
        <div className="col-md-10 mt-md-5">
          <div
            className={`pt-md-5 me-md-5 me-4 ${Bankbalance.thirdPartySection}`}
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
        show={openModalByName == "mobileOtp"}
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
                  <div className="modal-whitepopup-box-item pb-1 grey-color border-top-0">
                    <div className="px-md-4 text-center grey-color">
                      <div className={`${Bankbalance.Stylishborder}`}>
                        <div className={`${Bankbalance.modalDecs}`}>
                          You will receive this OTP by{" "}
                          <span className={`${Bankbalance.thirdPartyName}`}>
                            Finvu
                          </span>{" "}
                          to authenticate your phone number.
                        </div>
                      </div>
                      <div className={`mt-3 ${Bankbalance.otpText}`}>
                        Sent to
                      </div>
                      <div className={`pt-2 ${Bankbalance.Otpmobilenumber}`}>
                        {"+91 " + customNumber}
                        {/* +91 9374889689 */}
                      </div>
                    </div>
                  </div>
                  <div className="modal-whitepopup-box-item  grey-color text-center">
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
                        {timerActive ? (
                          <span>
                            {`${Math.floor(seconds / 60) < 10 ? "0" : ""
                              }${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? "0" : ""
                              }${seconds % 60}`}{" "}
                          </span>
                        ) : (
                          <label
                            className="pointer"
                            onClick={() => handleResendClick(session)}
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

export default MobileNumber;
