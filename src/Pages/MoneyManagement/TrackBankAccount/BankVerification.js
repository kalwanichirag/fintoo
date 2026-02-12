import React, { useRef, useState, useEffect } from "react";
import Styles from "../moneymanagement.module.css";
import style from "../style.module.css";
import Header from "./Header";
import { Modal, Form } from "react-bootstrap";
import socket, { onMessageHandler } from "./socket";
import * as toastr from "toastr";
import { useData } from '../context/DataContext';
import { FINVU_BASE_API_URL, FINVU_USER_ID, FINVU_PASSWORD, FINVU_AAID, FINVU_TEMPLATE_NAME } from "../../../constants";

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

const BankVerification = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { sidData, setRes, setDataDict, bankIdDetails, mob_no, setaccDiscData, accDiscData, handleIdfromConsent, setHandleIdfromConsent, mergeAccDetails, linkingRefNum, setLinkingRefNum, setSecondAccountHandleId, secondAccHandleId, linkedAccData, setMergeAccountDetails, setLinkedAccData, setTrackMonth, trackMonth } = useData();
  const { v4: uuidv4 } = require("uuid");
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
  const [ismobilenumberchnage, setIsmobilenumberchnage] = useState(true);
  const [processcount, setProcessCount] = useState(3);
  let updatedMergeData = [];
  let consentAppAcc = [];
  const [startingDate, setStartingDate] = useState(new Date());

  const handleSelectChange = (e) => {
    setTrackMonth(e.target.value);
    const currentDate = new Date();
    setStartingDate(currentDate);
  };

  const calculateEndDate = (trackMonth) => {
    let endDate = new Date(startingDate);

    switch (trackMonth) {
      case '3 Month':
        endDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6 Month':
        endDate.setMonth(endDate.getMonth() - 6);
        break;
      case '9 Month':
        endDate.setMonth(endDate.getMonth() - 9);
        break;
      case '1 Year':
        endDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        break;
    }

    const formattedEndDate = `${endDate.getDate()}${getOrdinalSuffix(endDate.getDate())} ${getMonthName(
      endDate.getMonth()
    )}'${endDate.getFullYear().toString().substr(-2)}`;

    return formattedEndDate;
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    const formattedDate = `${day}${suffix} ${getMonthName(date.getMonth())}'${date.getFullYear().toString().substr(-2)}`;
    return formattedDate;
  };

  const getOrdinalSuffix = (number) => {
    if (number >= 11 && number <= 13) {
      return 'th';
    }
    const lastDigit = number % 10;
    switch (lastDigit) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const getMonthName = (monthIndex) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthIndex];
  };

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      otp[index] = value;
      setOTP([...otp]);
      if (value && index < 5) {
        inputRefs[index + 1].current.focus();
      } else if (index === 5 && value) {
        handleBankVerifyOtpStep(otp);
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

  const accountConfirmLinkingAPI = async (otp) => {
    try {
      const account_confirm_linking_payload = {
        "header": {
          "mid": "fcd2c56e-9414-11e8-9eb6-529269fb1459",
          "ts": (new Date().toISOString()).replace('Z', '+00:00'),
          "sid": sidData,
          "dup": "false",
          "type": "urn:finvu:in:app:req.confirm-token.01"
        },
        "payload": {
          "ver": "1.1.2",
          "timestamp": (new Date().toISOString()).replace('Z', '+00:00'),
          "txnid": "de3115b6-a367-4153-9890-700cc6967e70",
          "AccountsLinkingRefNumber": linkingRefNum,
          "token": otp.join('')
        }
      }
      socket.send(JSON.stringify(account_confirm_linking_payload));
    } catch (error) {
      console.error(
        "An error occurred during Account Confirm Linking:",
        error.message
      );
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Account confirm linking unsuccessful");
    }
  };

  const getConsentHandle = async () => {
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
        try {
          const submitConsentRequestPayload = {
            "header": {
              "ts": ts,
              "channelId": "finsense",
              "rid": rid
            },
            "body": {
              "custId": mob_no + "@finvu",
              "consentDescription": "Apply for loan",
              "templateName": FINVU_TEMPLATE_NAME,
              "aaId": FINVU_AAID
            }
          };
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(submitConsentRequestPayload),
          };
          const submitConsentRequestResponse = await fetch(FINVU_BASE_API_URL + "/SubmitConsentRequest", options);
          if (submitConsentRequestResponse.status === 200) {
            const submitConsentRequestResponseData = await submitConsentRequestResponse.json();
            const body = submitConsentRequestResponseData.body;
            setSecondAccountHandleId(submitConsentRequestResponseData.body.consentHandle);
          }
        }
        catch (error) {
          console.error("An error occurred:", error.message);
        }
      }
    }
    catch (error) {
      console.error("An error occurred:", error.message);
    }
  };

  const consentRequestDetailsAPI = async () => {
    try {
      const consent_request_detail_payload = {
        "header": {
          "mid": "fcd2c56e-9414-11e8-9eb6-529269fb1459",
          "ts": (new Date().toISOString()).replace('Z', '+00:00'),
          "sid": sidData,
          "dup": "false",
          "type": "urn:finvu:in:app:req.consentRequestDetails.01"
        },
        "payload": {
          "consentHandleId": secondAccHandleId,
          "userId": mob_no + "@finvu"
        }
      }
      socket.send(JSON.stringify(consent_request_detail_payload));
    } catch (error) {
      console.error(
        "An error occurred during Consent Request:",
        error.message
      );
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Consent Request unsuccessful");
    }
  };

  const consentApprovalRequestAPI = async (consentHandleId) => {
    // alert(JSON.stringify(updatedMergeData));
    // alert(JSON.stringify(mergeAccDetails));
    try {
      if (mergeAccDetails.length === 0) {
        consentAppAcc = updatedMergeData;
      } else {
        consentAppAcc = mergeAccDetails;
      }
      // alert(consentAppAcc);
      const consent_approval_request_payload = {
        "header": {
          "mid": "fcd2c56e-9414-11e8-9eb6-529269fb1459",
          "ts": (new Date().toISOString()).replace('Z', '+00:00'),
          "sid": sidData,
          "dup": "false",
          "type": "urn:finvu:in:app:req.accountConsentRequest.01"
        },
        "payload": {
          "FIPDetails": [
            {
              "FIP": {
                "id": bankIdDetails.fipId
              },
              "Accounts": consentAppAcc
            }
          ],
          "FIU": {
            "id": "fiulive@fintoo"
          },
          "ver": "1.1.2",
          "consentHandleId": consentHandleId,
          "handleStatus": "ACCEPT"
        }
      }
      socket.send(JSON.stringify(consent_approval_request_payload));
    } catch (error) {
      console.error(
        "An error occurred during Consent Request:",
        error.message
      );
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Consent Request unsuccessful");
    }
  };

  const handleBankVerifyOtpStep = (otp) => {
    accountConfirmLinkingAPI(otp);
    // props.onLaststepclick();
  }

  const checkMaskedAccNumber = (linkedAccData, accDiscData) => {
    const maskedAccNumbers = accDiscData.map(data => data.maskedAccNumber);
    const foundLinkedAcc = linkedAccData.find(account => maskedAccNumbers.includes(account.maskedAccNumber));
    const mergedDetailsList = [];

    for (const linkedAccount of linkedAccData) {
      for (const discoveredData of accDiscData) {
        if (linkedAccount.maskedAccNumber === discoveredData.maskedAccNumber) {
          const mergedDetails = {
            linkRefNumber: linkedAccount.linkRefNumber,
            accType: discoveredData.accType,
            accRefNumber: discoveredData.accRefNumber,
            maskedAccNumber: discoveredData.maskedAccNumber,
            FIType: discoveredData.FIType,
            fipId: linkedAccount.fipId,
            fipName: linkedAccount.fipName
          };
          mergedDetailsList.push(mergedDetails);
        }
      }
    }
    setMergeAccountDetails(mergedDetailsList);


    if (foundLinkedAcc) {
      return foundLinkedAcc;
    } else {
      return false;
    }
  };

  const accountLinkingAPI = async () => {
    try {
      const account_linking_payload = {
        "header": {
          "mid": "fcd2c56e-9414-11e8-9eb6-529269fb1459",
          "ts": (new Date().toISOString()).replace('Z', '+00:00'),
          "sid": sidData,
          "dup": "false",
          "type": "urn:finvu:in:app:req.linking.01"
        },
        "payload": {
          "ver": "1.1.2",
          "timestamp": (new Date().toISOString()).replace('Z', '+00:00'),
          "txnid": "8cc9b944-f599-45ec-9f77-24108e7a70b8",
          "FIPDetails": {
            "fipId": bankIdDetails.fipId,
            "fipName": bankIdDetails.fipName
          },
          "Customer": {
            "id": mob_no + "@finvu",
            "Accounts": accDiscData
          }
        }
      }
      socket.send(JSON.stringify(account_linking_payload));
    } catch (error) {
      console.error(
        "An error occurred during Account Discovery:",
        error.message
      );
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Account Discovery unsuccessful");
    }
  };

  const nextFlowCheck = () => {
    accountLinkingAPI();
    // props.onProceedClick();
  };


  useEffect(() => {
    getConsentHandle();
    socket.onmessage = function (event) {
      const data = onMessageHandler(event);
      if (data.payload.status == "SEND") {
        setOtpReference(data.payload.otpReference);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("OTP sent successfully");
      } else if (data.header.type == "urn:finvu:in:app:res.loginOtpVerify.01" && data.payload.status == "SUCCESS") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("OTP verified successfully");
        props.onNextviewshow();
        // getData("nsdl", data);
        // getData("cdsl", data);
        setShowLoader(true);
      } else if (data.header.type == "urn:finvu:in:app:res.discover.01") {
        if (data.payload.status == "SUCCESS") {
          let disc_acc = data.payload.DiscoveredAccounts;
          if (disc_acc != null) {
            const d = disc_acc;
            setaccDiscData(d);
            const d_length = d.length;
            setRes(disc_acc[0]);
            let m_id = disc_acc[0].maskedAccNumber;
            let d1 = [disc_acc[0], bankIdDetails.fipId, bankIdDetails.fipName];
            let d2 = {
              m_id: d1
            }
            setDataDict(d2);
          }
        }
        else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.success("No accounts Discovered!");
        }
      } else if (data.header.type == "urn:finvu:in:app:res.userLinkedAccount.01") {
        if (data.payload.status == "SUCCESS") {
          setLinkedAccData(data.payload.LinkedAccounts);
          // toastr.options.positionClass = "toast-bottom-left";
          // toastr.success("Found Linked Accounts");
        } else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.success("No accounts Linked!");
        }
      } else if (data.header.type == "urn:finvu:in:app:res.linking.01") {
        if (data.payload.status == "SUCCESS") {
          setLinkingRefNum(data.payload.RefNumber);
          toastr.options.positionClass = "toast-bottom-left";
          toastr.success("OTP sent successfully");
        }
      } else if (data.header.type == "urn:finvu:in:app:res.confirm-token.01") {
        if (data.payload.status == "SUCCESS") {
          updatedMergeData = accDiscData.map(item => ({
            ...item,
            "linkRefNumber": data.payload.AccLinkDetails[0].linkRefNumber,
            "accRefNumber": data.payload.AccLinkDetails[0].accRefNumber,
            "fipId": bankIdDetails.fipId,
            "fipName": bankIdDetails.fipName
          }));
          let mergedData = [];
          if (mergeAccDetails) {
            mergedData = [...updatedMergeData, ...mergeAccDetails];
          } else {
            mergedData = updatedMergeData;
          }
          setMergeAccountDetails(mergedData);
          consentRequestDetailsAPI();
          props.onLaststepclick(2);
        } else if (data.payload.status == "FAILURE" && data.payload.message == "Token incorrect.") {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error("Invalid OTP");
        } else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error("Issue in " + bankIdDetails.fipName + " Verification");
        }
      } else if (data.header.type == "urn:finvu:in:app:res.consentRequestDetailsResponse.01") {
        setHandleIdfromConsent(data.payload.ConsentHandle);
        // alert("Printing handle id:");
        // alert(data.payload.ConsentHandle);
        consentApprovalRequestAPI(data.payload.ConsentHandle);
      } else if (data.header.type == "urn:finvu:in:app:res.accountConsentRequest.01") {
      } else if (data.payload['message'] == "otp reference and/or otp not set or has invalid values") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Enter OTP");
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Invalid OTP");
      }
    };
  }, []);

  return (
    <div className={`${Styles.SelectBankslist}`}>
      <div>
        <div className='d-md-flex d-none align-items-md-center'>
          <div>
            <div>
              <img
                className='pointer'
                onClick={() => {
                  props.onBackProceedClick();
                }}
                src={`${process.env.REACT_APP_STATIC_URL +
                  "media/MoneyManagement/Back.png"
                  }`}
                alt="Back-button"
              />
            </div>
          </div>
          <Header

            Banklogoshow={bankIdDetails.image}
            title={bankIdDetails.fipName + " Verification"}
            mobileNumberDesc={props.isMobileVerify}
            mobNo={mob_no}
          // decscription={description}
          />
        </div>
        <div className={`mt-md-5 ms-0 ${Styles.OtpForm}`}>
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
              <div className={`${Styles.otpresendtext}`}>
                <span>Didn’t get the code ?</span> <span ><ResetTimer resetFun={nextFlowCheck} /></span>
              </div>
            </div>
          </div>
        </div>
        <div className={`d-md-flex justify-content-md-between ${Styles.bottomDescription}`}>
          {/* <div
            style={{
              fontSize: "1rem",
              fontWeight: "400",
              color: "#000000",
            }}
          >
            We automatically track your expenses for a default period of {trackMonth}. 
            <br /> If you wish to modify click{" "}
            <span
              onClick={openPopup}
              style={{ color: "#017AFF", cursor: "pointer" }}
            >
              View Consent details
            </span>
            .
          </div> */}
          <div className={`${Styles.ContinueButton}`}>
            <button className={`d-md-none ${Styles.mobileBackbtn}`} onClick={() => {
              props.onBackProceedClick();
            }}>Back</button>
            <button onClick={() => {
              handleBankVerifyOtpStep(otp);
              // props.onLaststepclick();
            }} >Track Account</button>
          </div>
        </div>
      </div>

      <Modal
        className={`${style.moneyManagementModal}`}
        dialogClassName={`${style.moneyManagementModalDialog}`}
        centered
        show={isPopupOpen}
        size="lg"
      >
        <div className={`${Styles.moneyManagementBankerror}`}>
          <div className={`${style.popuiContainer}`}>
            <div
              style={{ position: "relative" }}
              className={`w-100 ${style.popuiHeader}`}
            >
              <img
                style={{ width: "25px" }}
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/MoneyManagement/zondicons_shield.svg"
                }
              />
              <span className={`${style.headerText2}`}>
                Track With Security!
              </span>
              <div className={`${Styles.modal_close}`}>
                <img
                  onClick={closePopup}
                  style={{ width: "15px" }}

                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/MoneyManagement/Close.svg"
                  }
                />
              </div>
            </div>
            <p
              className={`${style.secondaryText4}`}
              style={{ display: "flex", alignItems: "center" }}
            >
              RBI regulated CAMS finserv enables to receive end-to-end encrypted
              data safely!
            </p>
            <div className={`p-0 ${style.borderedContainer}`}>
              <div>
                <div style={{ padding: "1rem" }}>
                  <div className={`${style.label1}`}>Purpose</div>
                  <div className={`${style.labelValue1}`}>
                    Customer spending patterns, budget or other reportings
                  </div>
                </div>
                <br />
                <div
                  style={{ padding: "1rem" }}
                  className={`w-100 d-block ${style.labelGrid3}`}
                >
                  <div>
                    <div className={`${style.label1}`}>
                      Details will be shared from
                    </div>
                    <div className={`${style.labelValue1}`}>
                      {`${calculateEndDate(trackMonth)} to ${formatDate(startingDate)}`}
                    </div>
                  </div>
                </div>
                <br />
                <div style={{ padding: "1rem" }}>
                  <div>
                    <div className={`${style.label1}`}>
                      Details will be updated
                    </div>
                    <div className={`${style.labelValue1}`}>
                      3 times in a DAY
                    </div>
                  </div>
                </div>
                <div
                  style={{ padding: "1rem" }}
                  className={`${style.popupNoteContainer}`}
                >
                  <div className={`${style.popupNoteContentContainer}`}>
                    <span
                      className={`${style.labelValue1}`}
                      style={{ fontWeight: "600" }}
                    >
                      Note :-
                    </span>{" "}
                    <span
                      className={`${style.label1}`}
                      style={{ fontWeight: "600" }}
                    >
                      {" "}
                      Default Frequency of the consent is{" "}
                    </span>
                    <Form.Select
                      required
                      name="guardianRelation"
                      style={{
                        width: "fit-content",
                        border: "none",
                        color: "#042b62",
                        fontSize: "1.125rem",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "1.25rem",
                        textDecorationLine: "underline",
                        textUnderlineOffset: "0.25rem",
                      }}
                      onChange={handleSelectChange}
                      value={trackMonth}
                    >
                      <option value="3 Month">3 Month</option>
                      <option value="6 Month">6 Month</option>
                      <option value="9 Month">9 Month</option>
                      <option value="1 Year">1 Year</option>
                    </Form.Select>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className={`${style.btn3}`} onClick={() => closePopup()}>
                Got it!
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BankVerification;
