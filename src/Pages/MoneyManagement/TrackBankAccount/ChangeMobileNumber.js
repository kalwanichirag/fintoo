import React, { useState, useEffect, useRef } from "react";
import Styles from "../moneymanagement.module.css";
import style from "../style.module.css";
import Header from "./Header";
import socket, { onMessageHandler } from "./socket";
import * as toastr from "toastr";
import { useData } from "../context/DataContext";
import commonEncode from "../../../commonEncode";
import { apiCall, getMemberId, getParentUserId, getUserId } from "../../../common_utilities";
import { FINVU_BASE_API_URL, FINVU_USER_ID, FINVU_PASSWORD, FINVU_AAID, FINVU_TEMPLATE_NAME } from "../../../constants";
import SimpleReactValidator from "simple-react-validator";
import { fetchTrackedMobileList } from "../../../FrappeIntegration-Services/services/money-management-api/moneyManagementService";

const ChangeMobileNumber = (props) => {
  const { setSidData, setOtpReference, setMobNo, setHandleId } = useData();
  // setHandleId
  const { v4: uuidv4 } = require("uuid");
  // const [handleId, setHandleId] = useState("");
  // const [otpReference, setOtpReference] = useState("");
  const [selectedOption, setSelectedOption] = useState(0);
  const [customNumber, setCustomNumber] = useState("");
  const [numberList, setNumberList] = useState([]);
  const [isAddingCustomNumber, setIsAddingCustomNumber] = useState(false);
  const [, forceUpdate] = useState();
  const simpleValidator = useRef(new SimpleReactValidator(
    {
      validators: {
        phone: {
          required: true,
          message: "Invalid phone number.",
          rule: (val, _, validator) => {
            if (`${val}`.charAt(0) === '0') return false;
            if (!validator.helpers.testRegex(val, /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)) return false;
            return parseInt(val) > 5000000000 && parseInt(val) < 9999999999;
          },
        }
      },
    }
  ));

  const validateFun = () => {
  }

  const userid = getUserId();

  const handleRadioClick = (index) => {
    setCustomNumber(numberList[index])
    // setCustomNumber('')
    setMobNo(numberList[index])
    setSelectedOption(index);
    setIsAddingCustomNumber(false);
  };

  const loginOTP = async () => {
    if (!simpleValidator.current.allValid() && selectedOption == null) {
      simpleValidator.current.showMessageFor('mobile_number');
      forceUpdate(1);
      return;
    }

    if (selectedOption == null && numberList.some(data => data === customNumber)) {
      return;
    }


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
            header: {
              ts: ts,
              channelId: "finsense",
              rid: rid,
            },
            body: {
              custId: customNumber + "@finvu",
              consentDescription: "Apply for loan",
              templateName: FINVU_TEMPLATE_NAME,
              aaId: FINVU_AAID,
            },
          };

          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify(submitConsentRequestPayload),
          };

          const submitConsentRequestResponse = await fetch(
            FINVU_BASE_API_URL + "/SubmitConsentRequest",
            options
          );
          if (submitConsentRequestResponse.status === 200) {
            props.onProceedClick();
            const submitConsentRequestResponseData =
              await submitConsentRequestResponse.json();
            const body = submitConsentRequestResponseData.body;
            try {
              setHandleId(submitConsentRequestResponseData.body.consentHandle);
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
                    username: customNumber + "@finvu",
                    mobileNum: customNumber,
                    handleId:
                      submitConsentRequestResponseData.body.consentHandle,
                  },
                };
                socket.send(JSON.stringify(send_otp_payload));
              };
              socketCreation();
            } catch (error) {
              console.error("An error occurred:", error.message);
              toastr.options.positionClass = "toast-bottom-left";
              toastr.error("Something went wrong. Please try again later");
            }
          } else {
            console.log("Submit consent failure");
            console.error("An error occurred:", error.message);
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Something went wrong. Please try again later");
          }
        } catch (error) {
          console.error("An error occurred:", error.message);
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error("Something went wrong. Please try again later");
        }
      } else {
        console.error("An error occurred:", error.message);
        console.log("Login Failure");
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong. Please try again later");
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong. Please try again later");
    }
  };

  useEffect(() => {
    // loginOTP();
    // fetchBankListData();
    socket.onmessage = function (event) {
      const data = onMessageHandler(event);
      if (data.payload.status == "SEND") {
        setOtpReference(data.payload.otpReference);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("OTP sent successfully");
        props.onProceedClick();
      } else if (
        data.header.type == "urn:finvu:in:app:res.loginOtpVerify.01" &&
        data.payload.status == "SUCCESS"
      ) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("OTP verified successfully");
        setSidData(data.header.sid);
        props.onNextviewshow();
      } else if (
        data.payload["message"] ==
        "otp reference and/or otp not set or has invalid values"
      ) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Please enter OTP");
      } else if (
        data.payload["message"] ==
        "Maximum OTP limit reached for session."
      ) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Maximum OTP limit reached for session.");
        window.location.href = `${process.env.PUBLIC_URL}/money-management/track-bank-account`;
      } else if (
        data.payload["message"] ==
        "Otp already used or expired."
      ) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Otp already used or expired.");
        window.location.href = `${process.env.PUBLIC_URL}/money-management/track-bank-account`;
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Invalid OTP");
      }
    };
    let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
    let currentUser = getMemberId();
    if (!currentUser) {
      currentUser = getUserId();
    }
    let defaultMobile = "";
    try {
      defaultMobile = users.filter(v => v.id == currentUser)[0]['mobile'] ?? '';
    } catch {
      defaultMobile = "";
    }

  }, []);

  const handleAddCustomNumber = () => {
    setSelectedOption(null);
    setIsAddingCustomNumber(true);
    setCustomNumber('')
  };

  const handleCustomNumberChange = (e) => {
    if (e.key === "Enter") {
      // If Enter key is pressed, call loginOTP function
      loginOTP();
    } else {
      // Handle number input as usual
      let numericValue = e.target.value.replace(/[^0-9]/g, "");
      numericValue = numericValue.slice(0, 10);
      setCustomNumber(numericValue);
      setSelectedOption(null);
      setMobNo(numericValue);
    }
  };
  const handleSubmitCustomNumber = (event) => {
    event.preventDefault();
    setCustomNumber("");
    setIsAddingCustomNumber(false);
  };

  // For Enter Keybaord function

  const getNumbersList = async () => {
    try {
      const result = await fetchTrackedMobileList(getUserId());
      if (result.status_code === 200 && result.data) {
        setNumberList(result.data);
        if (result.data.length > 0) {
          setSelectedOption(0);
          setMobNo(result.data[0]);
          setCustomNumber(result.data[0].toString());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { getNumbersList() }, [])

  useEffect(() => {
    if (!simpleValidator.current.allValid()) {
      simpleValidator.current.showMessageFor('mobile_number');
      forceUpdate(2);
      return;
    }
  }, [customNumber])

  return (
    <div className={`${Styles.SelectBankslist}`} style={{ height: "auto" }}>
      <div>
        <div className="d-md-flex d-none align-items-md-center">
          <div>
            <div>
              <img
                className="pointer"
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
            onBackClick={props.handleBackProceedClick}
            title={"Enter or select mobile number"}
            decscription={
              "Select an already verified number for finding your account or use an another number."
            }
          />
        </div>
        <div className={`mt-2 ms-0 ${Styles.OtpForm}`}>
          <div className={`${Styles.mobileNumberLayout}`}>
            {/* {mobile_list.map((v, index) => ( */}
            {numberList.map((v, index) => (
              <div key={index} className={`${Styles.mobileNumberBox}`}>
                <div
                  className={`d-flex align-items-center pointer ${Styles.radio}`}
                  onClick={() => handleRadioClick(index)}
                >
                  <div>
                    <img
                      src={
                        selectedOption === index
                          ? process.env.REACT_APP_STATIC_URL +
                          "media/MoneyManagement/radio-on-button.svg"
                          : process.env.REACT_APP_STATIC_URL +
                          "media/MoneyManagement/radio-off-button.svg"
                      }
                      alt="Radio Button"
                      width={20}
                    />
                  </div>
                  <div
                    style={{
                      color: selectedOption === index ? "black" : "gray",
                    }}
                    className={`${Styles.mobileNumber}`}
                  >
                    {v}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {
            numberList.length < 3 && <>
              {isAddingCustomNumber ? (
                // Render the custom number input field
                <div className={`${Styles.mobileNumberBox}`}>
                  <form onSubmit={handleSubmitCustomNumber}>
                    <div className={`${Styles.radio}`}>
                      <div className={`${Styles.mobileNumber}`}>
                        <input
                          className={`${Styles.mobilenumberfield}`}
                          type="text"
                          placeholder="Enter Your Number Here"
                          value={customNumber}
                          onChange={handleCustomNumberChange}
                          // onKeyDown={handleCustomNumberChange}
                          onBlur={() => {
                            console.log('simpleValidator.current', simpleValidator.current, customNumber)
                            simpleValidator.current.showMessageFor('mobileNo');
                          }}
                        />
                        {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
                        <div>{simpleValidator.current.message('mobile_number', customNumber, 'required|phone')}</div>
                        {
                          (numberList.some(data => data === customNumber)) && <div p style={{ color: "red", margin: '0' }}> Please add another number</div>
                        }
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                // Render the "Add another number" button
                <div className={`${Styles.mobileNumberBox}`}>
                  <div className={`d-flex align-items-center`}>
                    <div
                      className={`${Styles.Addnumbertext}`}
                      onClick={handleAddCustomNumber}
                    >
                      + Add another number
                    </div>
                  </div>
                </div>
              )}
            </>
          }

        </div>
      </div >
      <div className={`${Styles.ContinueButton}`}>
        <button
          className={`d-md-none ${Styles.mobileBackbtn}`}
          onClick={() => {
            props.onBackProceedClick();
          }}
        >
          Back
        </button>
        <button
          onClick={() => {
            loginOTP();
            // props.onProceedClick();
          }}
        >
          Continue
        </button>
      </div>
    </div >
  );
};
export default ChangeMobileNumber;
