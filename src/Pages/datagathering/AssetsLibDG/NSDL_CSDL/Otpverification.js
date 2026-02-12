import { useEffect, useRef, useState } from "react";
import Styles from "./style.module.css";
import Otploader from "./Otploader.svg";
import * as toastr from "toastr";
import socket, { onMessageHandler } from "../../BankCashbalance/socket";
import commonEncode from "../../../../commonEncode";
import {
  apiCall,
  getItemLocal,
  restApiCall,
  getParentUserId,
  createCookie,
} from "../../../../common_utilities";
import { json, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import FintooLoader from "../../../../components/FintooLoader";

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
        countdown == 0 ? <span style={{ color: '#042b62', textDecoration: 'none', cursor: 'pointer' }} className="custom-color" onClick={() => {
          handleResendOTP();
          resetFun()
        }
        } >Resend</span> : <span style={{ textDecoration: 'none' }} className="custom-color">Resend in {countdown} seconds.</span>
      }
    </>
  )
}

const Otpverification = (props) => {

  const [nsdldata, setSetnsdldata] = useState([]);
  const [cdsldata, setSetcdsldata] = useState([]);
  const [handleId, setHandleId] = useState("");
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
  const [showLoader, setShowLoader] = useState(false);
  const { v4: uuidv4 } = require("uuid");
  const [otpReference, setOtpReference] = useState("");
  const [cdslStatus, setCdslStatus] = useState({});
  const tempUserData = useRef({});
  const [pageurl, setPageurl] = useState(false);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if ("pathname" in location) {
      setPageurl(location.pathname);
    }
  }, [location]);
  const handleInput = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      otp[index] = value;
      setOTP([...otp]);
      if (value && index < 5) {
        inputRefs[index + 1].current.focus();
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

  useEffect(() => {
    socket.onmessage = function (event) {
      const data = onMessageHandler(event);

      if (data.payload.status == "SEND") {
        setOtpReference(data.payload.otpReference);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("OTP sent successfully");
      } else if (data.header.type == "urn:finvu:in:app:res.loginOtpVerify.01") {

        if (data.payload.status == "SUCCESS") {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.success("OTP verified successfully");
          // getData("nsdl", data);
          getData("cdsl", data);
          // trackAccount("nsdl", data);
          // trackAccount("cdsl", data);
          setShowLoader(true);
        } else {
          if (data.payload['message'] == "otp reference and/or otp not set or has invalid values") {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Enter OTP");
          } else {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Invalid OTP");
          }
        }
      } else if (data.header.type == "urn:finvu:in:app:res.discover.01") {
        const mid = data["header"]["mid"]
        const discovered_accounts = data["payload"]["DiscoveredAccounts"]

        if (discovered_accounts != null && discovered_accounts.length > 0) {
          props.setDiscoveredAccountsData((prev) => [...prev, ...discovered_accounts]);
        }

        // if (data["header"]["mid"].indexOf("nsdl") == 0) {
        //   setCdslStatus(prev => ({ ...prev, nsdl: discovered_accounts ?? [], sid: data["header"]["sid"] }));
        // }


        setCdslStatus(prev => ({ ...prev, nsdl: [], sid: data["header"]["sid"] }));

        if (data["header"]["mid"].indexOf("cdsl") == 0) {
          setCdslStatus(prev => ({ ...prev, cdsl: discovered_accounts ?? [], sid: data["header"]["sid"] }));
        }

      }
    };
  }, []);
  useEffect(() => {
    tempUserData.current = props.dummy;
  }, [props.dummy]);

  useEffect(() => {

    if (Object.keys(cdslStatus).length >= 3) {
      setShowLoader(false);
      props.onProceedClick(cdslStatus);
    }
  }, [cdslStatus]);
  const getData = async (type, data) => {
    const _tempUserData = tempUserData.current;
    const rid = type + '-' + uuidv4();
    try {
      let linked_cdsl_banks_payload = {
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
            id: _tempUserData["mobileNum"] + "@finvu",
            Identifiers: [
              {
                category: "STRONG",
                type: "MOBILE",
                value: _tempUserData["mobileNum"],
              },
              {
                category: "WEAK",
                type: "PAN",
                value: _tempUserData["pan"],
              },
            ],
          },
          FIPDetails: {
            fipId: type == "cdsl" ? "CDSLFIP" : "fip@nsdl",
            fipName:
              type == "cdsl"
                ? "Central Depository Services Limited"
                : "National Securities Depository Limited",
          },
          // FITypes: ["EQUITIES", "MUTUAL_FUNDS"],
          FITypes: ["EQUITIES"],
        },
      };
      socket.send(JSON.stringify(linked_cdsl_banks_payload));
    } catch (e) {
      console.log("Error", e);

      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(
        "Unable to discover data"
      );
      props.onClose();

    }
  };

  const trackAccount = async (type, data) => {
    try {
      const rid = type + "-" + uuidv4();
      try {
        let track_account_payload = {
          header: {
            mid: rid,
            ts: new Date().toISOString().replace("Z", "+00:00"),
            sid: data.header.sid,
            dup: false,
            type: "urn:finvu:in:app:req.userLinkedAccount.01"
          },
          payload: {
            userId: props.dummy["mobileNum"] + "@finvu",
          }
        };
        socket.send(JSON.stringify(track_account_payload));
      } catch (e) {
        console.log("Error Occured ===>>> ", e);
      }
    } catch (e) {
      console.log("Error Occured ===>>> ", e);
    }
  };

  const verifyOTP = async (otp) => {
    try {
      const otpstring = otp.join("");

      const verifyOTPPayload = {
        header: {
          mid: "fcd2c56e-9414-11e8-9eb6-529269fb1459",
          ts: new Date().toISOString().replace("Z", "+00:00"),
          sid: "",
          dup: "false",
          type: "urn:finvu:in:app:req.loginOtpVerify.01",
        },
        payload: {
          otpReference,
          otp: otpstring,
        },
      };

      socket.send(JSON.stringify(verifyOTPPayload));
    } catch (error) {
      console.error(
        "An error occurred during OTP verification:",
        error.message
      );
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("OTP verification unsuccessful");
    }
  };

  const ResendOTP = async () => {
    setOTP(["", "", "", "", "", ""])
    try {
      let mobileNo = props.dummy["mobileNum"];
      try {
        const rid = uuidv4();
        const ts = new Date().toISOString();

        const loginPayload = {
          header: {
            rid: rid,
            ts: ts,
            channelId: "finsense",
          },
          body: {
            userId: "channel@fintoo",
            password: "85a333fb49044c7e91611a0d962ff8ba",
          },
        };

        const url =
          "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/User/Login";
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
          commonEncode.encrypt(
            createCookie(
              "finvu_token",
              commonEncode.encrypt(JSON.stringify(token, 60))
            )
          );

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

          const response = await fetch(
            "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/ConsentRequestPlus",
            {
              method: "POST",
              headers: headers,
              body: JSON.stringify(payload),
            }
          );

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
                  username: props.dummy["mobileNum"] + "@finvu",
                  mobileNum: props.dummy["mobileNum"],
                  handleId: responseData.body.ConsentHandle,
                },
              };
              socket.send(JSON.stringify(send_otp_payload));
              if (send_otp_payload) {
                const tokenMessage = {
                  header: {},
                  payload: {
                    token: token,
                    handleId: responseData.body.ConsentHandle,
                  },
                };
                socket.send(JSON.stringify(tokenMessage));
              }
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

        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(
          "Unable to resend OTP please try again"
        );
      }
    } catch (e) {
      console.log(e);

      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(
        "Unable to resend OTP please try again"
      );
    }
  };
  return (
    <>
      <div
        className={` DeamtBasicDetailsSection ${Styles.BasicDetailsSection}`}
      >
        {showLoader ? (
          <>
            <div className={`fintoo_loader ${Styles.Otploader}`}>
              <div>
                <center>
                  {/* <img
                    className="ms-2"
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/Loader.gif"
                    }
                    alt="Loader"
                    width={150}
                  /> */}
                  <FintooLoader isLoading={isLoading} />
                </center>
                <div className={`${Styles.otploadtext}`} style={{
                  textAlign: 'center',
                  color: '#00000080',
                  fontSize: '1.3rem'
                }}>
                  Securely looking for the demat account(s) linked with your
                  number
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="">
              <div className={`${Styles.title}`}>OTP Verification</div>
              <div className={`pt-2 ${Styles.stepsubTitle}`}>
                Please enter the OTP sent to {props.dummy["mobileNum"]}
              </div>
            </div>
            <div className={` ${Styles.OtpFields}`}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {otp.map((value, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}

                    type="text"
                    className={Styles.otpnumber}
                    autoFocus={index === 0}
                    value={value}
                    onChange={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    min={1}
                    max={1}
                  />
                ))}
                {errorMessage && (
                  <div className={`${Styles.ErrorField}`}>{errorMessage}</div>
                )}
              </div>
              <div className={`${Styles.otpResend}`} style={{ marginRight: '0px' }}>
                <span className={`${Styles.otpresendtxt}`}>
                  Didn’t receive OTP?{" "}
                </span>&nbsp;<span style={{
                  textDecoration: 'none',
                  color: pageurl === "/commondashboard" || pageurl === "/commondashboard/" ? "#042b62" : ""
                }} className={`${Styles.otpresendbtn}`} >
                  <ResetTimer resetFun={() => ResendOTP()} />
                </span>
              </div>
            </div>
            <div className={`${Styles.termsConditions}`}>
              <span className={`${Styles.termsText}`}>
                By tapping on submit you agree to Finvu's

                <a style={{ color: "#042b62" }} className={`ps-1 text-decoration-none ${Styles.otpresendbtn} custom-color`} href="https://finvu.in/terms" target="_blank">
                  Terms & Conditions
                </a>
              </span>
            </div>
            <div className="mt-0">
              <div className="ButtonBx d-flex justify-content-center">
                <button
                  style={{
                    border: "1px solid #042b62",
                    color: "#042b62"
                  }}
                  className={`Cancel commonDashboardButton custom-outline-hover-btn-style`}
                  onClick={() => {
                    props.onHandlebackClick();
                  }}
                >
                  Back
                </button>
                <button
                  style={{
                    backgroundColor: "#042b62",
                    border: "1px solid #042b62"
                  }}
                  className="Unlink ms-md-0 ms-2 custom-btn-style"
                  onClick={() => {
                    verifyOTP(otp);
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Otpverification;