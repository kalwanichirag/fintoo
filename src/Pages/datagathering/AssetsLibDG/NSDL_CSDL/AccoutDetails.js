import React, { useState, useEffect, useRef } from "react";
import "react-magic-slider-dots/dist/magic-dots.css";
import Styles from "./style.module.css";
import * as toastr from "toastr";
import socket, { onMessageHandler } from "../../BankCashbalance/socket";
import commonEncode from "../../../../commonEncode";
import { createCookie, fetchData, apiCall, getCookie, getParentUserDetails, } from "../../../../common_utilities";
import {  CHATBOT_BASE_API_URL, imagePath, GATEWAY_AUTH_NAME, CHATBOT_TOKEN_PASSWORD, CHATBOT_TOKEN_USERNAME } from "../../../../constants";
import ProgressBar from "./ProgressBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ParS3Upload } from "../../../../FrappeIntegration-Services/services/financial-planning-api/dashboardApi";
import { UPDATEEXTERNALSTOCKHOLDINGS } from "../../../../FrappeIntegration-Services/services/financial-planning-api/externalApi";

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
        } >Resend</span> : <span style={{ textDecoration: 'none' }} className="custom-color">Resend in {countdown} Seconds</span>
      }
    </>
  )
}

const AccoutDetails = (props) => {

  const apiAttemptRef = useRef(0);
  const [isAccountAlreadyLinked, setIsAccountAlreadyLinked] = useState(false);
  const [verified, setVerified] = useState(false);
  const [accountfound, setAccountfound] = useState(false);
  const [activeprogressBar, setActiveprogressBar] = useState(false);
  const [test, SetTest] = useState(true);
  const { v4: uuidv4 } = require("uuid");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [consentStatus, setConsentStatus] = useState("");
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [RefNumber, setRefNumber] = useState("");
  const [activeInput, setActiveInput] = useState(0);
  const [visible, setVisible] = useState(false);
  const [trackAccountInProgress, setTrackAccountInProgress] = useState(false);
  const [accverified, setAccverified] = useState(false)
  const [tab, setTab] = useState("CSDL");
  const [progressValue, setProgressValue] = useState(0);
  const tempCheckRef = useRef(0);
  const [totalAmount, setTotalAmount] = useState("");
  const [pageurl, setPageurl] = useState(false);
  const [token, setToken] = useState(null);
  const location = useLocation();
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
    } else {
      otp[index] = "";
      setOTP([...otp]);
    }
    setActiveInput(index);
    setErrorMessage("");
  };

  const handleBackspace = (e, index) => {
    if (e.keyCode === 8 && !otp[index] && index > 0) {
      otp[index - 1] = "";
      setOTP([...otp]);
      inputRefs[index - 1].current.focus();
      setActiveInput(index - 1);
    }
  };
  const clearAllInputs = () => {
    const clearedOTP = ["", "", "", "", "", ""];
    setOTP(clearedOTP);
  };

  useEffect(() => {

    if (
      // props.cdslNsdlResponse.nsdl.length === 0 &&
      props.cdslNsdlResponse.cdsl.length === 0
    ) {
      setVerified(true);
      if (props.forpar) {
        props.setAreBothSelected(prev => ({
          ...prev,
          stockStatus: false,
        }));
      }
    } else {
      setVerified(false);
      if (props.forpar) {
        props.setAreBothSelected(prev => ({
          ...prev,
          stockStatus: true,
        }));
      }
    }

  }, []);




  const consentApproval = async (accountsData, type) => {
    // try {
    //   let consent_request_details_payload = {
    //     header: {
    //       mid: "fcd2c56e-9414-11e8-9eb6-529269fb1459",
    //       ts: new Date().toISOString().replace("Z", "+00:00"),
    //       sid: props.cdslNsdlResponse.sid,
    //       dup: "false",
    //       type: "urn:finvu:in:app:req.accountConsentRequest.01",
    //     },
    //     payload: {
    //       FIPDetails: [
    //         {
    //           FIP: {
    //             id: "CDSLFIP"
    //           },
    //           Accounts: filteredData
    //         },
    //       ],
    //       FIU: {
    //         id: "fiulive@fintoo",
    //       },
    //       ver: "1.1.2",
    //       consentHandleId: props.dummy["consentid"],
    //       handleStatus: "ACCEPT",
    //     },
    //   };

    //   socket.send(JSON.stringify(consent_request_details_payload));
    // } catch (e) {
    //   console.log("Error Occured ===>>> ", e);
    // }

    try {
      const filteredData = accountsData
        .filter(item => item.fipId === "CDSLFIP")
        .map(({ fipId, linkRefNumber, accType, accRefNumber, maskedAccNumber, FIType, fipName }) => ({
          fipId,
          linkRefNumber,
          accType,
          accRefNumber,
          maskedAccNumber,
          FIType,
          fipName
        }));

      let consent_request_details_payload = {
        header: {
          mid: "fcd2c56e-9414-11e8-9eb6-529269fb1459",
          ts: new Date().toISOString().replace("Z", "+00:00"),
          sid: props.cdslNsdlResponse.sid,
          dup: "false",
          type: "urn:finvu:in:app:req.accountConsentRequest.01",
        },
        payload: {
          FIPDetails: [
            {
              FIP: {
                id: "CDSLFIP"
              },
              Accounts: filteredData
            },
          ],
          FIU: {
            id: "fiulive@fintoo",
          },
          ver: "1.1.2",
          consentHandleId: props.dummy["consentid"],
          handleStatus: "ACCEPT",
        },
      };

      socket.send(JSON.stringify(consent_request_details_payload));
    } catch (e) {
      console.log("Error Occured ===>>> ", e);

      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(
        "Unable to approve your consent"
      );
      props.onClose();

    }

  };


  const toggleVisibility = () => {
    setVisible((current) => !current);
  };

  async function handleTrackAccountBtn() {
    await trackAccount('cdsl')
    await handleApprove();
  }

  useEffect(() => {
    socket.onmessage = function (event) {
      const data = onMessageHandler(event);
      setRefNumber(data.payload.RefNumber)

      if (data.payload.status == "SUCCESS" && data.header.type == "urn:finvu:in:app:res.consentRequestDetailsResponse.01") {
        commonEncode.encrypt(
          createCookie(
            "dateRange",
            commonEncode.encrypt(
              JSON.stringify(data.payload.DataDateTimeRange)
            ),
            60
          )
        );
      }

      if (data.payload.status == "SUCCESS" && data.header.type == "urn:finvu:in:app:res.accountConsentRequest.01" && data.payload.consentIntentId) {
        commonEncode.encrypt(
          createCookie(
            "consentId",
            commonEncode.encrypt(JSON.stringify(data.payload.consentIntentId)),
            60
          )
        );
        setActiveprogressBar(true);
        checkConsentStatus();
      } else if (data.payload.status == "SUCCESS" && data.header.type == "urn:finvu:in:app:res.confirm-token.01") {

        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("OTP verified successfully");
        SetTest(false);
        setAccverified(false);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        // toastr.error("Could not fetch the consent");
        // navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
      }

      if (data.payload.status == "SUCCESS" && data.header.type == "urn:finvu:in:app:res.userLinkedAccount.01") {


        const LinkedAccounts = data["payload"]["LinkedAccounts"]

        const matchingAccountsData = findMatchingAccounts(props.discoveredAccountsData, LinkedAccounts);

        if (matchingAccountsData.length > 0) {

          if (isAccountAlreadyLinked) {
            cdslTrackAccount(matchingAccountsData)
          } else {
            consentApproval(matchingAccountsData, 'cdsl')
          }
          SetTest(false);
          setAccverified(false);
          setVisible(false);
        }
      }

      // else{
      if (data.payload.status == "SUCCESS" && data.header.type == "urn:finvu:in:app:res.linking.01") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("OTP sent successfully");
        setVisible(true);
        setIsAccountAlreadyLinked(false)
      }
      else if (data.header.type == "urn:finvu:in:app:res.linking.01" && data.payload.message.includes("You have already linked this account(s):")) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(data.payload.message);
        SetTest(false);
        setAccverified(false);
        setVisible(false);
        setIsAccountAlreadyLinked(true);
      }
      else if (data.payload.status == "FAILURE" && data.payload.message == "Bad Request") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
        SetTest(true);
        setAccverified(false);
        setVisible(false);
      }
      else if (data.payload.status == "FAILURE" && data.payload.message == "Token incorrect.") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Invalid OTP");
        setAccverified(true)
      }
    };
  }, []);

  function accountExists(accounts, accType, maskedAccNumber, FIType) {
    return accounts.some(account =>
      account.accType === accType &&
      account.maskedAccNumber === maskedAccNumber &&
      account.FIType === FIType
    );
  }

  function findMatchingAccounts(discoveredAccounts, linkedAccounts) {
    let matchingAccounts = [];

    for (let discovered of discoveredAccounts) {
      for (let linked of linkedAccounts) {
        if (discovered.accType === linked.accType &&
          discovered.maskedAccNumber === linked.maskedAccNumber &&
          discovered.FIType === linked.FIType) {
          if (!accountExists(matchingAccounts, linked.accType, linked.maskedAccNumber, linked.FIType)) {
            matchingAccounts.push(linked);
          }
        }
      }
    }

    return matchingAccounts;
  }


  const handleApprove = async () => {
    try {
      const rid = uuidv4();
      let handle_approve_payload = {
        header: {
          mid: rid,
          ts: new Date().toISOString().replace("Z", "+00:00"),
          sid: props.cdslNsdlResponse.sid,
          dup: "false",
          type: "urn:finvu:in:app:req.consentRequestDetails.01",
        },
        payload: {
          consentHandleId: props.dummy["consentid"],
          userId: props.dummy["mobileNum"] + "@finvu",
        },
      };

      socket.send(JSON.stringify(handle_approve_payload));
    } catch (e) {
      console.log("Error Occured ===>>> ", e);

      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(
        "Unable to approve your consent"
      );
      props.onClose();

    }
  };

  const [userSesssionId, setUserSessionId] = useState("");
  const FIRequest = async () => {
    const rid = uuidv4();
    const ts = new Date().toISOString();
    let consentHandle = props.dummy["consentid"];
    let consentId = JSON.parse(commonEncode.decrypt(getCookie("consentId")));
    let dateRange = JSON.parse(commonEncode.decrypt(getCookie("dateRange")));
    let token = JSON.parse(commonEncode.decrypt(getCookie("finvu_token")));

    try {
      let fir_request_payload = {
        header: {
          rid: rid,
          ts: ts,
          channelId: "finsense",
        },
        body: {
          custId: props.dummy["mobileNum"] + "@finvu",
          consentId: consentId,
          consentHandleId: consentHandle,
          dateTimeRangeFrom: dateRange.from,
          dateTimeRangeTo: dateRange.to,
        },
      };

      const requestBody = JSON.stringify(fir_request_payload);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: requestBody,
      };

      fetch(
        "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIRequest",
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setUserSessionId(data.body.sessionId);
          FIStatus(data.body.sessionId);

          return;
        })
        .catch((error) => {
          console.log("OTP API Error:", error);
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(
            "Unable to fetch Financial Information (FI)"
          );
          props.onClose();
        });
    } catch (e) {
      console.log("Error Occured ===>>> ", e);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(
        "Unable to fetch Financial Information (FI)"
      );
      props.onClose();
    }
  };

  // const FIStatus = async (sId, retryCount = 0) => {
  //   let token = JSON.parse(commonEncode.decrypt(getCookie("token")));
  //   let ConsentHandle = props.dummy["consentid"];
  //   let custID = props.dummy["mobileNum"] + "@finvu";
  //   let consentID = JSON.parse(commonEncode.decrypt(getCookie("consentId")));
  //   let sessionId = sId;

  //   try {
  //     const customHeaders = {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       Authorization: `Bearer ${token}`,
  //     };
  //     const payload = {
  //       url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIStatus/${consentID}/${sessionId}/${ConsentHandle}/${custID}`,
  //       headers: customHeaders,
  //       method: "get",
  //     };

  //     const r = await fetchData(payload);


  //     if (r.body.fiRequestStatus === "READY") {
  //       setProgressValue(25)
  //       FIPfmDataReport(sessionId);
  //     }
  //     // else if (r.body.fiRequestStatus === "PENDING") {
  //     //   setProgressValue(33)
  //     // }
  //     else if (r.body.fiRequestStatus === "FAILED") {
  //       props.onClose();
  //       if (tempCheckRef.current == 0) {
  //         toastr.options.positionClass = "toast-bottom-left";
  //         toastr.error("Failed to Fetch your holdings");
  //         if (!(location.pathname === "/commondashboard" || location.pathname === "/commondashboard/")) {
  //           navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
  //         }
  //         tempCheckRef.current = tempCheckRef.current + 1;
  //       }
  //     }
  //     else {
  //       if (retryCount < 5) {
  //         setTimeout(() => FIStatus(sId, retryCount + 1), 15000);
  //       } else {
  //         toastr.options.positionClass = "toast-bottom-left";
  //         toastr.error(
  //           "Financial Information (FI) Status is PENDING / REJECTED"
  //         );
  //         if (!(location.pathname === "/commondashboard" || location.pathname === "/commondashboard/")) {
  //           navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("OTP error", error);
  //     // Handle error here if needed
  //   }
  // };

  async function FIStatus(sId) {
    try {
      const max_retries = 5;
      let retry = 0;
      while (retry < max_retries) {
        const response = await FIStatusAPI(sId);
        if (response.body.fiRequestStatus === "READY") {
          setProgressValue(25)
          FIPfmDataReport(sId);
          return;
          // const apiResponse = await FIPfmDataReport(consent_handle_id, session_id, consentDataForFIP.linkRefNumber);
          // if (apiResponse.success && apiResponse.data) {
          //   consentDataForFIP.totalBalance = apiResponse.data.statementAccounts[0].currentBalance;
          //   allConsentData.push(consentDataForFIP);
          //   accumulatedData.push(apiResponse.data);
          //   bank_accounts.push(apiResponse.data.statementAccounts[0].accountNo);
          //   successFlag = true;
          // }
          // return apiResponse; // Return the result immediately when status is "READY"
        } else if (response.body.fiRequestStatus === "FAILED") {
          props.onClose();
          if (tempCheckRef.current == 0) {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Failed to Fetch your holdings");

            // if (!(location.pathname === "/commondashboard" || location.pathname === "/commondashboard/")) {
            //   navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
            // }
            props.onClose();
            tempCheckRef.current = tempCheckRef.current + 1;
          }
          // return { "error": "FI Status failed" };
          // throw new Error("FI Status failed"); // Throw an error if status is "FAILED"
        }
        retry++;
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 5 seconds before each retry
      }

      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(
        "Financial Information (FI) Status is PENDING / REJECTED"
      );
      props.onClose();
      // if (!(location.pathname === "/commondashboard" || location.pathname === "/commondashboard/")) {
      //   navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
      // }

      // return { error: "Max retries exceeded" }; 
    } catch (error) {
      console.error('FIStatus error:', error);

      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(
        "Financial Information (FI) Status is PENDING / REJECTED"
      );
      props.onClose();
    }
  };

  const FIStatusAPI = async (sId, retryCount = 0) => {
    let token = JSON.parse(commonEncode.decrypt(getCookie("finvu_token")));
    let ConsentHandle = props.dummy["consentid"];
    let custID = props.dummy["mobileNum"] + "@finvu";
    let consentID = JSON.parse(commonEncode.decrypt(getCookie("consentId")));
    let sessionId = sId;

    try {
      const customHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const payload = {
        url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIStatus/${consentID}/${sessionId}/${ConsentHandle}/${custID}`,
        headers: customHeaders,
        method: "get",
      };

      const r = await fetchData(payload);
      return r


      // if (r.body.fiRequestStatus === "READY") {
      //   setProgressValue(25)
      //   FIPfmDataReport(sessionId);
      // }
      // // else if (r.body.fiRequestStatus === "PENDING") {
      // //   setProgressValue(33)
      // // }
      // else if (r.body.fiRequestStatus === "FAILED") {
      //   props.onClose();
      //   if (tempCheckRef.current == 0) {
      //     toastr.options.positionClass = "toast-bottom-left";
      //     toastr.error("Failed to Fetch your holdings");
      //     if (!(location.pathname === "/commondashboard" || location.pathname === "/commondashboard/")) {
      //       navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
      //     }
      //     tempCheckRef.current = tempCheckRef.current + 1;
      //   }
      // }
      // else {
      //   if (retryCount < 5) {
      //     setTimeout(() => FIStatus(sId, retryCount + 1), 15000);
      //   } else {
      //     toastr.options.positionClass = "toast-bottom-left";
      //     toastr.error(
      //       "Financial Information (FI) Status is PENDING / REJECTED"
      //     );
      //     if (!(location.pathname === "/commondashboard" || location.pathname === "/commondashboard/")) {
      //       navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
      //     }
      //   }
      // }
    } catch (error) {
      console.error("OTP error", error);
      return { error: "FIStatus error" };
    }
  };

  const FIPfmDataReport = async (sID) => {
    let token = JSON.parse(commonEncode.decrypt(getCookie("finvu_token")));
    // let bankAccounts = JSON.parse(
    //   commonEncode.decrypt(getCookie("filteredCDSLaccountdata"))
    // );
    let ConsentHandle = props.dummy["consentid"];
    let dateRange = JSON.parse(commonEncode.decrypt(getCookie("dateRange")));
    let consentID = JSON.parse(commonEncode.decrypt(getCookie("consentId")));
    try {
      let customHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      };

      let payload = {
        url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/Consent/${consentID}`,
        headers: customHeaders,
        method: "get",
      };

      const r = await fetchData(payload);
      if (r.body.status == "ACTIVE") {
        setProgressValue(50)
        let linkref = r.body.ConsentDetail.Accounts["0"].linkRefNumber;
        let accounts = r.body.ConsentDetail.Accounts;
        try {
          let customHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          };

          let payload = {
            url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIDataFetch/${ConsentHandle}/${sID}`,
            headers: customHeaders,
            method: "get",
          };

          const userData = await fetchData(payload);
          const fp_log_id = 0;

          if (props.forpar) {
            const member_id = props.dummy['fp_id']
            const pan = props.dummy['pan']
            const mobile = props.dummy['mobileNum']
            const id = props.dummy['id'];
            const user_id = id;
            const user_specific_id = user_id;
            // let fp_log_id = props.dummy['fp_log_id'];
            // if (!fp_log_id) {
            // }
            const retirement_date = props.dummy['retirement_date'];
            const name = props.dummy['name'];
            let email = props.dummy['email'];
            let customerId = userData.body[0].custId
            var userProfile = userData.body[0].fiObjects;
            var userpanExist = userProfile.filter((v) =>
              v.Profile.Holders.Holder[0].pan == pan
            )
            if (userpanExist.length > 0) {
              var holdings = userpanExist.flatMap(v => v.Summary.Investment.Holdings.Holding)
            }
            else {
              var holdings = []
            }

            const modifiedData = [];
            var broker_ids_list = "";

            for (let i = 0; i < userProfile.length; i++) {
              var profile = userProfile[i].Profile;
              if (profile.Holders.Holder[0].pan == pan) {
                var dematId = "";
                dematId = profile.Holders.Holder[0].dematId;

                var broker_id = dematId.slice(3, 8);

                var broker_ids = broker_id + ",";

                broker_ids_list = broker_ids_list + broker_id + ",";

                var holdings = userProfile[i].Summary.Investment.Holdings.Holding;

                var holdings_temp = holdings.map(item => {
                  return {
                    user_id: user_id,
                    member_id: member_id,
                    issuerName: item.issuerName,
                    isin: item.isin,
                    isinDescription: item.isinDescription,
                    units: item.units,
                    brokerId: broker_id,
                    lastTradedPrice: item.lastTradedPrice,
                    fp_log_id: fp_log_id,
                    // retirement_date: retirement_date,
                    pan: pan,
                    mobile: mobile
                  };
                });

                holdings_temp.forEach(element => {
                  modifiedData.push(element)
                });
                // modifiedData.push({
                //       user_id: user_id,
                //       member_id: member_id,
                //       issuerName: item.issuerName,
                //       isin: item.isin,
                //       isinDescription: item.isinDescription,
                //       units: item.units,
                //       brokerId: broker_id,
                //       lastTradedPrice: item.lastTradedPrice,
                //       fp_log_id: fp_log_id,
                //       retirement_date: retirement_date,
                //       pan: pan,
                //       mobile: mobile
                // });
              }

            }

            const totalValue = holdings.map(stock => {
              const units = parseFloat(stock.units);
              const lastTradedPrice = parseFloat(stock.lastTradedPrice);
              return units * lastTradedPrice;
            }).reduce((acc, value) => acc + value, 0).toFixed(2);

            setTotalAmount(totalValue)

            commonEncode.encrypt(createCookie("totalAmount", totalValue, 60));

            const assetGetPayload = {
              "filter_id": "0",
              "user_id": user_id,
              "fp_log_id": fp_log_id
            }

            if (!email) {
              let allmember = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser")));
              let check_member = allmember.find(check_member => check_member.id === user_id);
              if (check_member && check_member.email) {
                email = check_member.email;
              } else {
                check_member = allmember.find(check_member => check_member.parent_user_id === 0);
                email = check_member.email;
              }
            }

            let final_data = {}

            let maskedDematId = userData.body[0].fiObjects[0].maskedDematId;
            final_data[maskedDematId] = userData.body[0];

            try {

              // const getJWTToken = async () => {
              //   const headers = new Headers();

              //   headers.append('Content-Type', 'application/json');
              //   const payload = {
              //     "username": CHATBOT_TOKEN_USERNAME,
              //     "password": CHATBOT_TOKEN_PASSWORD
              //   };
              //   const response = await fetch(CHATBOT_BASE_API_URL + "api/token/", {
              //     method: 'POST',
              //     headers: headers,
              //     body: JSON.stringify(payload),
              //   });
              //   if (response.ok) {
              //     const result = await response.json();
              //     setToken(result.data.token);
              //     return result.data.token;
              //   }
              // };


              // var myHeaders = new Headers();
              // const tkn = await getJWTToken();
              // myHeaders.append("gatewayauthtoken", 'Token ' + tkn);
              // myHeaders.append("gatewayauthname", GATEWAY_AUTH_NAME);
              const pars3Upload_payload = {
                "user_id": user_id,
                "cdsl_nsdl_details": final_data
              };
              // myHeaders.append("Content-Type", "application/json");
              // myHeaders.append("Cookie", "AWSALBTG=VmwGpjloOZHqm4zYwwgrhQHBFqgjHSadlnkk3pDv2VHCrOFU76lUNk3jvnw2J18jV4XbJnqGSOz80EIcr/iuY3e7RusDT2z5wK+pQ768CDlWOIIAjWkuVSatFsU8WKYhNR7V7TAJIR7Kmc2FcpsYP/iq+TP5rGPWnuCGQS5wqzXV; AWSALBTGCORS=VmwGpjloOZHqm4zYwwgrhQHBFqgjHSadlnkk3pDv2VHCrOFU76lUNk3jvnw2J18jV4XbJnqGSOz80EIcr/iuY3e7RusDT2z5wK+pQ768CDlWOIIAjWkuVSatFsU8WKYhNR7V7TAJIR7Kmc2FcpsYP/iq+TP5rGPWnuCGQS5wqzXV");
              try {
                // const response = await fetch(CHATBOT_BASE_API_URL + "finvu/pars3Upload/", {
                //   method: 'POST',
                //   headers: myHeaders,
                //   body: JSON.stringify(pars3Upload_payload),
                // });
                const response = await ParS3Upload(pars3Upload_payload)
                if (response) {
                  setProgressValue(75);
                  if (apiAttemptRef.current == 0) {
                    apiAttemptRef.current = apiAttemptRef + 1;
                    // const res = await apiCall(
                    //   ADVISORY_NSDL_CDSL_DATA,
                    //   modifiedData,
                    //   true,
                    //   false
                    // );
                    let stock_payload = {
                      "user_id": user_id,
                      "holding_mobile": mobile,
                      "holding_customer_id":customerId,
                      "holding_consent_id":consentID,
                      "holding_consent_handle_id":ConsentHandle,
                      "holding_daterange_from":dateRange.from,
                      "holding_daterange_to":dateRange.to,
                      "stock_holdings": userData
                    }
                    const res = await UPDATEEXTERNALSTOCKHOLDINGS(stock_payload)
                    try {
                      if (res["status_code"] == 200) {
                        setProgressValue(100);
                        dispatch({
                          type: "ASSETS_UPDATE",
                          payload: true,
                        });
                        dispatch({
                          type: "TRIGGER_EQUITY_HOLDING",
                          payload: true,
                        });
                        dispatch({
                          type: "SET_PAR_REPORT_DATA",
                          payload: {
                            "pan": pan,
                            "name": name,
                            "email": email ? email : (getParentUserDetails()).user_email,
                            "mobile": mobile,
                            "user_id": user_id
                          }
                        });
                        setProgressValue(100);
                        // toastr.options.positionClass = "toast-bottom-left";
                        // toastr.success("Data fetched successfully");
                        setTimeout(() => {
                          props.onProceedClick();
                        }, 3000);


                      }
                      else {
                        throw new Error('Failed to fetch data');
                      }
                    }
                    catch (e) {
                      console.log("Error Occured ===>>> ", e);

                      toastr.options.positionClass = "toast-bottom-left";
                      toastr.error(
                        "Unable to fetch Financial Information (FI)"
                      );
                      props.onClose();
                    }

                  }
                }

              } catch (error) {
                console.error('Error fetching data:', error);

                toastr.options.positionClass = "toast-bottom-left";
                toastr.error(
                  "Unable to fetch Financial Information (FI)"
                );
                props.onClose();
              }
            } catch (e) {
              console.log("Error Occured ===>>> ", e);

              toastr.options.positionClass = "toast-bottom-left";
              toastr.error(
                "Unable to fetch Financial Information (FI)"
              );
              props.onClose();
            }

          }

          if (!props.forpar) {
            const member_id = props.dummy['fp_id']
            const pan = props.dummy['pan']
            const mobile = props.dummy['mobileNum']
            const user_id = props.dummy['user_id'];
            const user_specific_id = props.dummy['user_specific_id'];
            const retirement_date = props.dummy['retirement_date'];
            var userProfile = userData.body[0].fiObjects;
            var userpanExist = userProfile.filter((v) =>
              v.Profile.Holders.Holder[0].pan == pan
            )
            if (userpanExist.length > 0) {
              var holdings = userpanExist.flatMap(v => v.Summary.Investment.Holdings.Holding)
            }
            else {
              var holdings = []
            }
            // // broker id
            // var dematId = "";
            // if (userpanExist.length > 0) {
            //   dematId = userpanExist[0].Profile.Holders.Holder[0].dematId;
            // }
            // // brokerId from 
            // var broker_id = dematId.slice(3, 8);

            // var broker_ids = broker_id + ",";
            // const modifiedData = holdings.map(item => {
            //   return {
            //     user_id: user_id,
            //     member_id: member_id,
            //     issuerName: item.issuerName,
            //     isin: item.isin,
            //     isinDescription: item.isinDescription,
            //     units: item.units,
            //     brokerId: broker_id,
            //     lastTradedPrice: item.lastTradedPrice,
            //     fp_log_id: fp_log_id,
            //     retirement_date: retirement_date,
            //     pan: pan,
            //     mobile: mobile
            //   };
            // });
            // const modifiedData = [];
            // var broker_ids_list = "";

            // for (let i = 0; i < userProfile.length; i++) {
            //   var profile = userProfile[i].Profile;
            //   if (profile.Holders.Holder[0].pan == pan) {
            //     var dematId = "";
            //     dematId = profile.Holders.Holder[0].dematId;

            //     var broker_id = dematId.slice(3, 8);

            //     var broker_ids = broker_id + ",";

            //     broker_ids_list = broker_ids_list + broker_id + ",";

            //     var holdings = userProfile[i].Summary.Investment.Holdings.Holding;

            //     var holdings_temp = holdings.map(item => {
            //       return {
            //         user_id: user_id,
            //         member_id: member_id,
            //         issuerName: item.issuerName,
            //         isin: item.isin,
            //         isinDescription: item.isinDescription,
            //         units: item.units,
            //         brokerId: broker_id,
            //         lastTradedPrice: item.lastTradedPrice,
            //         fp_log_id: fp_log_id,
            //         retirement_date: retirement_date,
            //         pan: pan,
            //         mobile: mobile
            //       };
            //     });

            //     holdings_temp.forEach(element => {
            //       modifiedData.push(element)
            //     });
            //     // modifiedData.push({
            //     //       user_id: user_id,
            //     //       member_id: member_id,
            //     //       issuerName: item.issuerName,
            //     //       isin: item.isin,
            //     //       isinDescription: item.isinDescription,
            //     //       units: item.units,
            //     //       brokerId: broker_id,
            //     //       lastTradedPrice: item.lastTradedPrice,
            //     //       fp_log_id: fp_log_id,
            //     //       retirement_date: retirement_date,
            //     //       pan: pan,
            //     //       mobile: mobile
            //     // });
            //   }

            // }

            const totalValue = holdings.map(stock => {
              const units = parseFloat(stock.units);
              const lastTradedPrice = parseFloat(stock.lastTradedPrice);
              return units * lastTradedPrice;
            }).reduce((acc, value) => acc + value, 0).toFixed(2);

            setTotalAmount(totalValue)

            commonEncode.encrypt(createCookie("totalAmount", totalValue, 60));

            const assetGetPayload = {
              "filter_id": "0",
              "user_id": user_id,
              "fp_log_id": fp_log_id
            }
            try {

              if (apiAttemptRef.current == 0) {
                apiAttemptRef.current = apiAttemptRef + 1;
                let stock_payload = {
                    "user_id": props.dummy['id'],
                    "holding_mobile": mobile,
                    "holding_customer_id":userData.body[0].custId,
                    "holding_consent_id":consentID,
                    "holding_consent_handle_id":ConsentHandle,
                    "holding_daterange_from":dateRange.from,
                    "holding_daterange_to":dateRange.to,
                    "stock_holdings": userData
                }
                const res = await UPDATEEXTERNALSTOCKHOLDINGS(stock_payload)
                try {
                  if (res["status_code"] == 200) {
                    setProgressValue(100)
                    // const response = await apiCall(
                    //   '',
                    //   assetGetPayload,
                    //   true,
                    //   false
                    // );
                    dispatch({
                      type: "ASSETS_UPDATE",
                      payload: true,
                    });
                    dispatch({
                      type: "TRIGGER_EQUITY_HOLDING",
                      payload: true,
                    });
                    toastr.options.positionClass = "toast-bottom-left";
                    toastr.success("Data fetched successfully");
                    setTimeout(() => {
                      props.onProceedClick();
                    }, 3000);
                   
                  }
                } catch (e) {
                  console.log("Error Occured ===>>> ", e);

                  toastr.options.positionClass = "toast-bottom-left";
                  toastr.error(
                    "Unable to fetch Financial Information (FI)"
                  );
                  props.onClose();
                }

              }
            } catch (e) {
              console.log("Error Occured ===>>> ", e);

              toastr.options.positionClass = "toast-bottom-left";
              toastr.error(
                "Unable to fetch Financial Information (FI)"
              );
              props.onClose();
            }
          }

        } catch (e) {
          console.log("Error Occured ===>>> ", e);

          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(
            "Unable to fetch Financial Information (FI)"
          );
          props.onClose();
        }
      } else {

        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(
          "Unable to approve your consent"
        );
        props.onClose();

        // if (!(location.pathname === "/commondashboard" || location.pathname === "/commondashboard/")) {
        //   navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
        // }
      }
    } catch (e) {
      console.log("Error Occured ===>>> ", e);

      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(
        "Unable to fetch Financial Information (FI)"
      );
      props.onClose();
    }
  };


  // const checkConsentStatus = async (retryCount = 0) => {
  //   let token = JSON.parse(commonEncode.decrypt(getCookie("token")));
  //   try {
  //     const customHeaders = {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       Authorization: `Bearer ${token}`,
  //     };

  //     const payload = {
  //       url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/ConsentStatus/${props.dummy["consentid"]}/${props.dummy["mobileNum"] + "@finvu"}`,
  //       headers: customHeaders,
  //       method: "get",
  //     };

  //     const r = await fetchData(payload);
  //     if (r.body.consentStatus === "ACCEPTED") {
  //       setConsentStatus(r.body.consentStatus);
  //       FIRequest();
  //     } else {
  //       if (retryCount < 5) {
  //         setTimeout(() => checkConsentStatus(retryCount + 1), 15000);
  //       } else {
  //         if (r.body.consentStatus === "REJECTED") {
  //           toastr.options.positionClass = "toast-bottom-left";
  //           // toastr.error("Consent Status is Rejected");
  //           // navigate(
  //           //   `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`
  //           // );
  //         } else {
  //           toastr.options.positionClass = "toast-bottom-left";
  //           // toastr.error("Consent Status is Requested");
  //           // navigate(
  //           //   `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`
  //           // );
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("OTP error", error);
  //     // Handle error here if needed
  //   }
  // };

  async function checkConsentStatus() {
    try {
      const max_retries = 5;
      let retry = 0;
      while (retry < max_retries) {
        const response = await checkConsentStatusAPI();
        if (response.body.consentStatus === "ACCEPTED") {
          setConsentStatus(response.body.consentStatus);
          // commonEncode.encrypt(
          //   createCookie(
          //     "consentId",
          //     commonEncode.encrypt(JSON.stringify(response.body.consentId)),
          //     60
          //   )
          // );
          FIRequest();
          return; // Exit function as the desired status is reached          
        } else if (response.body.consentStatus === "REJECTED") {
          toastr.options.positionClass = "toast-bottom-left";
          // Handle "REJECTED" or max retries reached
          // Uncomment the following lines if you want to show the toast messages and navigate
          toastr.error(`Consent Status is ${r.body.consentStatus}`);
          props.onClose();

          // if (!(location.pathname === "/commondashboard" || location.pathname === "/commondashboard/")) {
          //   navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
          // }
          return;
        }
        retry++;
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 5 seconds before each retry
      }
      // setConsentStatus("ACCEPTED");
      // FIRequest();
      // toastr.options.positionClass = "toast-bottom-left";
      // // Handle "REJECTED" or max retries reached
      // // Uncomment the following lines if you want to show the toast messages and navigate
      // toastr.error(`Consent not accepted`);
      // navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
      return;
    }
    catch (error) {
      console.error("OTP error", error);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(`Failed to fetch consent`);
      props.onClose();

      // Optional: Handle error here if needed during the retry loop
    }
  }


  const checkConsentStatusAPI = async () => {
    let token = JSON.parse(commonEncode.decrypt(getCookie("finvu_token")));
    const customHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const payload = {
      url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/ConsentStatus/${props.dummy["consentid"]}/${props.dummy["mobileNum"] + "@finvu"}`,
      headers: customHeaders,
      method: "get",
    };

    // for (let i = 0; i < retryCount; i++) {
    //   try {
    const r = await fetchData(payload);
    return r;

    //     if (r.body.consentStatus === "ACCEPTED") {
    //       setConsentStatus(r.body.consentStatus);
    //       FIRequest();
    //       return; // Exit function as the desired status is reached
    //     } else if (r.body.consentStatus === "REJECTED" || i === retryCount - 1) {
    //       toastr.options.positionClass = "toast-bottom-left";
    //       // Handle "REJECTED" or max retries reached
    //       // Uncomment the following lines if you want to show the toast messages and navigate
    //       // toastr.error(`Consent Status is ${r.body.consentStatus}`);
    //       // navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
    //       return;
    //     }
    //   } catch (error) {
    //     console.error("OTP error", error);
    //     // Optional: Handle error here if needed during the retry loop
    //   }

    //   await delay(delayMs); // Wait for the specified delay before the next retry
    // }

    // toastr.options.positionClass = "toast-bottom-left";
    // Uncomment the following lines if you want to show the toast messages and navigate after all retries
    // toastr.error("Consent Status check failed after maximum retries");
    // navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
  };

  const AccountverifyOTP = async (type, otp) => {
    const rid = type + "-" + uuidv4();
    try {
      const otpstring = otp.join("");
      const verifyOTPPayload = {
        header: {
          mid: rid,
          ts: new Date().toISOString().replace("Z", "+00:00"),
          sid: props.cdslNsdlResponse.sid,
          dup: false,
          type: "urn:finvu:in:app:req.confirm-token.01"
        },
        payload:
        {
          ver: "1.1.2",
          timestamp: new Date().toISOString().replace("Z", "+00:00"),
          txnid: uuidv4(),
          AccountsLinkingRefNumber: RefNumber,
          token: otpstring
        }
      }

      socket.send(JSON.stringify(verifyOTPPayload));
    } catch (error) {
      console.error(
        "An error occurred during OTP verification:",
        error.message
      );

      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(
        "Unable to verify OTP"
      );
      props.onClose();
    }
  };

  const handleTrackAccount = async (type) => {
    setTrackAccountInProgress(true);
    try {
      const rid = type + "-" + uuidv4();
      try {
        let link_account_payload = {
          header: {
            mid: rid,
            ts: new Date().toISOString().replace("Z", "+00:00"),
            sid: props.cdslNsdlResponse.sid,
            dup: false,
            type: "urn:finvu:in:app:req.linking.01",
          },
          payload: {
            ver: "1.1.2",
            timestamp: new Date().toISOString().replace("Z", "+00:00"),
            txnid: uuidv4(),
            FIPDetails: {
              fipId: type == "cdsl" ? "CDSLFIP" : "fip@nsdl",
              fipName:
                type == "cdsl"
                  ? "Central Depository Services Limited"
                  : "National Securities Depository Limited",
            },
            Customer: {
              id: props.dummy["mobileNum"] + "@finvu",
              Accounts:
                type == "cdsl"
                  ? props.cdslNsdlResponse.cdsl
                  : props.cdslNsdlResponse.nsdl,
            },
          },
        };
        socket.send(JSON.stringify(link_account_payload));
        setTrackAccountInProgress(false);
      } catch (e) {
        console.log("Error Occured ===>>> ", e);
        setTrackAccountInProgress(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(`Failed to verify account`);
        props.onClose();
      }
    } catch (e) {
      console.log("Error Occured ===>>> ", e);
      setTrackAccountInProgress(false);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(`Failed to verify account`);
      props.onClose();
    }

    // if (!verified) {
    //   setTimeout(() => {
    //     setAccountfound(true);

    //   }, 3000);
    // } else {
    //   // props.onProceedClick();
    // }
  };

  const trackAccount = async (type) => {
    try {
      const rid = type + "-" + uuidv4();
      try {
        let track_account_payload = {
          header: {
            mid: rid,
            ts: new Date().toISOString().replace("Z", "+00:00"),
            sid: props.cdslNsdlResponse.sid,
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

        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(`Failed to link your account`);
        props.onClose();
      }
    } catch (e) {
      console.log("Error Occured ===>>> ", e);

      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(`Failed to link your account`);
      props.onClose();
    }
  };

  const cdslTrackAccount = async (data) => {
    try {
      const rid = uuidv4();
      try {
        const filteredData = data
          .filter(item => item.fipId === "CDSLFIP")
          .map(({ fipId, linkRefNumber, accType, accRefNumber, maskedAccNumber, FIType, fipName }) => ({
            fipId,
            linkRefNumber,
            accType,
            accRefNumber,
            maskedAccNumber,
            FIType,
            fipName
          }));
        // commonEncode.encrypt(
        //   createCookie(
        //     "filteredCDSLaccountdata",
        //     commonEncode.encrypt(JSON.stringify(filteredData)),
        //     60
        //   )
        // );
        let track_account_payload = {
          header: {
            mid: rid,
            ts: new Date().toISOString().replace("Z", "+00:00"),
            sid: props.cdslNsdlResponse.sid,
            dup: false,
            type: "urn:finvu:in:app:req.accountConsentRequest.01"
          },
          payload:
          {
            FIPDetails: [
              {
                FIP: {
                  id: "CDSLFIP"
                },
                Accounts: filteredData

              }
            ],
            FIU: {
              id: "fiulive@fintoo"
            },
            ver: "1.1.2",
            consentHandleId: props.dummy["consentid"],
            handleStatus: "ACCEPT"
          }
        };
        socket.send(JSON.stringify(track_account_payload));
      } catch (e) {
        console.log("Error Occured ===>>> ", e);

        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(`Consent request failed`);
        props.onClose();
      }
    } catch (e) {
      console.log("Error Occured ===>>> ", e);

      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(`Consent request failed`);
      props.onClose();
    }
  };

  return (
    <>
      {
        activeprogressBar ? (
          <ProgressBar progress={progressValue} />
        ) : (
          <div
            className={` DeamtBasicDetailsSection ${Styles.BasicDetailsSection}`}
          >
            {verified ? (
              <>
                <div className="">
                  <div
                    className={`d-flex align-items-center ps-2 ${Styles.accountnotfoundDetailsbox}`}
                  >
                    <div>
                      <img
                        style={{ verticalAlign: "middle" }}
                        className=""
                        width={40}
                        src={
                          imagePath + "/static/media/DG/Warning.svg"
                        }
                        alt="Warning"
                      />
                    </div>
                    <div className="ms-2">
                      <div className={`${Styles.notfoundtext}`}>
                        {/* Couldn't Find an Account */}
                        Couldn't Find an Account with CDSL Data
                      </div>
                      <div className={`${Styles.notfoundnumber}`}>
                        No account found with your mobile no.{" "}
                        <span style={{ textDecoration: "underline" }}>
                          {props.dummy["mobileNum"]}
                        </span>
                        .
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className={`${Styles.reasonTitle}`}>
                      This could be due to either
                    </div>
                    <div>
                      <div className="d-flex align-items-center">
                        <div>
                          {" "}
                          {/* <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="4.88069" cy="5" rx="4.88069" ry="5" fill="#042b62" />
                          </svg> */}
                          <img
                            src={
                              imagePath + "/static/media/PARFlow/focusPoint.svg"
                            }
                          />
                        </div>
                        <div className={`ms-3 ${Styles.Reasonlist}`}>
                          The depository may be experiencing some technical
                          difficulties - please try again after some time.
                        </div>
                      </div>
                      <div className="d-flex mt-3 align-items-center">
                        <div>
                          {" "}
                          {/* <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="4.88069" cy="5" rx="4.88069" ry="5" fill="#042b62" />
                          </svg> */}
                          <img
                            src={
                              imagePath + "/static/media/PARFlow/focusPoint.svg"
                            }
                          />
                        </div>
                        <div className={`ms-3 ${Styles.Reasonlist}`}>
                          The PAN that you provided must not correspond to the
                          registered mobile number on the Demat.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <>
                  <div className={`${Styles.title}`}>We found your account(s)</div>
                  <div className={`pt-2 ${Styles.stepsubTitle}`}>
                    Please note you can only track demat account(s) actively used
                    for trading and still holding investments within the past year
                  </div>


                  <div className="">
                    <div style={{ display: `${tab === "CSDL" ? "block" : "none"}` }}>
                      {"cdsl" in props?.cdslNsdlResponse &&
                        props.cdslNsdlResponse.cdsl.length > 0 && (
                          <div className={`${Styles.accountDetailsbox} custom-accountDetailsbox`}>
                            <>
                              <div className={`${Styles.servicesName}`}>
                                Central Depository Services LTD (CDSL)
                              </div>
                              {props.cdslNsdlResponse.cdsl.map((v) => (
                                <>
                                  <div className={`${Styles.AccountList} ${props.cdslNsdlResponse.cdsl.length > 4 ? Styles.listHeight : null}`}>
                                    <div className={`${Styles.accountSubdetails}`}>
                                      <div className="d-flex align-items-center">
                                        <div>
                                          <img
                                            style={{ verticalAlign: "middle" }}
                                            className=""
                                            width={20}
                                            src={
                                              imagePath + "/static/media/DG/Check.svg"
                                            }
                                            alt="Check"
                                          />
                                        </div>
                                        <div
                                          className={`ms-2 pt-1 text-black ${Styles.dmatAccno}`}
                                        >
                                          Demat Account {v.maskedAccNumber}
                                        </div>
                                      </div>
                                      <div className={`pt-1 ${Styles.BrokerName}`}>
                                        {/* Broker Name */}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                              <div className={`${Styles.HRLine}`}></div>
                              <div >
                                {
                                  visible ? null : (
                                    <div className={test ? "d-block" : "d-none"}>
                                      <div className={accverified ? "d-none" : "d-block"}>
                                        <div className="ButtonBx w-auto d-flex justify-content-md-end justify-content-center">
                                          <button
                                            style={{ outline: 0, border: 0, padding: "0.5rem 1rem", backgroundColor: "#042b62", color: "#fff" }}
                                            type="button"
                                            className="Unlink mt-3 custom-btn-style"
                                            onClick={() => {
                                              // toggleVisibility()
                                              handleTrackAccount("cdsl");
                                            }}
                                          >
                                            Verify Now
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }

                                {
                                  visible ? (
                                    <>
                                      <div className={`${Styles.OtpVerify}`}>
                                        <div className={`${Styles.title}`}>
                                          OTP Verification
                                        </div>
                                        <div className={`${Styles.sentotptext}`}>
                                          Enter the OTP sent to{" "}
                                          <span>+91 {props.dummy["mobileNum"]}</span>
                                        </div>
                                        <div className={`${Styles.OtpBox}`} style={{ justifyContent: 'center' }}>
                                          <div>
                                            <div>
                                              {Array.from({ length: 6 }).map(
                                                (_, index) => (
                                                  <input
                                                    key={index}
                                                    ref={inputRefs[index]}
                                                    type="text"
                                                    className={
                                                      otp[index] ? Styles.active : null
                                                    }
                                                    value={otp[index]}
                                                    onChange={(e) =>
                                                      handleInput(e, index)
                                                    }
                                                    onKeyDown={(e) =>
                                                      handleBackspace(e, index)
                                                    }
                                                    min={1}
                                                    max={1}
                                                  />
                                                )
                                              )}
                                            </div>
                                            <div className={`${Styles.Resentotptxt}`}>
                                              Didn’t receive OTP?&nbsp;
                                              <span
                                                // onClick={() => {
                                                //   handleTrackAccount("cdsl");
                                                //   setVisible(true);
                                                // }}
                                                style={{
                                                  textDecoration: 'none',
                                                  color: pageurl === "/commondashboard" ? "#042b62" : "",
                                                  cursor: 'pointer'

                                                }}
                                              >
                                                <ResetTimer resetFun={() => {
                                                  handleTrackAccount("cdsl");
                                                  setVisible(true);
                                                  setOTP(["", "", "", "", "", ""])
                                                }} /></span>{" "}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="ButtonBx w-auto mt-3">
                                          <button
                                            type="button"
                                            style={{ marginTop: '0px' }}
                                            className="Unlink custom-btn-style"
                                            onClick={() => {
                                              AccountverifyOTP("cdsl", otp);
                                              setVisible(false);
                                            }}
                                          >
                                            Submit
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  ) : null
                                }

                                {
                                  accverified ? (
                                    <div className={visible ? "d-none" : "d-block "}>

                                      <div className={`mt-3 d-flex justify-content-center align-items-center`}>
                                        <div className={`${Styles.notverifiedAccount}`}>
                                          <div>
                                            <img
                                              style={{ verticalAlign: "middle" }}
                                              className=""
                                              width={15}
                                              src={
                                                imagePath + "/static/media/DG/Failed.svg"
                                              }
                                              alt="List"
                                            />
                                          </div>
                                          <div className="ms-2">
                                            Verification Failed
                                          </div>
                                        </div>
                                        <div className={`ms-3 pointer ${Styles.RetryBtn} custom-color`} onClick={() => {
                                          setVisible(true);
                                          setAccverified(null);
                                          handleTrackAccount("cdsl");
                                          clearAllInputs()
                                          // inputRefs(nu)
                                        }}>Retry</div>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className={test ? "d-none" : "d-block mt-3"}>
                                        <div className={`${Styles.verifiedAccount} custom-verifiedAccount`}>
                                          <div>
                                            <img
                                              style={{ verticalAlign: "middle" }}
                                              className=""
                                              width={15}
                                              src={
                                                imagePath + "/static/media/DG/Verified.svg"
                                              }
                                              alt="List"
                                            />
                                          </div>
                                          <div className="ms-2">
                                            Account verified successfully
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )
                                }
                              </div>
                            </>
                          </div>
                        )}
                    </div>
                    <div style={{ display: `${tab === "NSDL" ? "block" : "none"}` }}>
                      {"nsdl" in props?.cdslNsdlResponse &&
                        props.cdslNsdlResponse.nsdl.length > 0 && (
                          <div className={`${Styles.accountDetailsbox} custom-accountDetailsbox`}>
                            <>
                              <div className={`${Styles.servicesName}`}>
                                National Securities Depository LTD (NSDL)
                              </div>
                              {props.cdslNsdlResponse.nsdl.map((v) => (
                                <div className={`${Styles.accountSubdetails}`}>
                                  <div className="d-flex align-items-center">
                                    <div>
                                      <img
                                        style={{ verticalAlign: "middle" }}
                                        className=""
                                        width={20}
                                        src={
                                          imagePath + "/static/media/DG/Check.svg"
                                        }
                                        alt="Check"
                                      />
                                    </div>
                                    <div
                                      className={`ms-2 pt-1 ${Styles.dmatAccno}`}
                                    >
                                      Demat Account {v.maskedAccNumber}
                                    </div>
                                  </div>
                                  <div
                                    style={{ fontWeight: "bold" }}
                                    className={`pt-1 ${Styles.BrokerName}`}
                                  >
                                    {/* Broker Name */}
                                  </div>
                                </div>
                              ))}
                              <div className={`${Styles.HRLine}`}></div>
                              <div>
                                {
                                  visible ? null : (
                                    <>
                                      <div>
                                        <div className="ButtonBx w-auto d-flex justify-content-end">
                                          <button
                                            style={{ outline: 0, border: 0, padding: "0.5rem 1rem", backgroundColor: "#042b62", color: "#fff" }}
                                            type="button"
                                            className="Unlink mt-3 custom-btn-style"
                                            onClick={() => {
                                              toggleVisibility();
                                              handleTrackAccount("nsdl");
                                            }}
                                          >
                                            Verify Now
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  )
                                }

                                {
                                  visible && (
                                    <>
                                      <div className={`${Styles.OtpVerify}`}>
                                        <div className={`${Styles.title}`}>
                                          OTP Verification
                                        </div>
                                        <div className={`${Styles.sentotptext}`}>
                                          Enter the OTP sent to{" "}
                                          <span>+91 {props.dummy["mobileNum"]}</span>
                                        </div>
                                        <div className={`${Styles.OtpBox}`} style={{ justifyContent: 'center' }}>
                                          <div>
                                            <div>
                                              {Array.from({ length: 6 }).map(
                                                (_, index) => (
                                                  <input
                                                    key={index}
                                                    ref={inputRefs[index]}
                                                    type="text"
                                                    className={
                                                      otp[index] ? Styles.active : null
                                                    }
                                                    value={otp[index]}
                                                    onChange={(e) =>
                                                      handleInput(e, index)
                                                    }
                                                    onKeyDown={(e) =>
                                                      handleBackspace(e, index)
                                                    }
                                                    min={1}
                                                    max={1}
                                                  />
                                                )
                                              )}
                                            </div>
                                            <div className={`${Styles.Resentotptxt}`}>
                                              Didn’t receive OTP?&nbsp;
                                              <span
                                                // onClick={() => handleTrackAccount("nsdl")}
                                                style={{ cursor: 'pointer' }}
                                              >
                                                <ResetTimer resetFun={() => { handleTrackAccount("nsdl"); setOTP(["", "", "", "", "", ""]) }} />
                                              </span>{" "}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="ButtonBx w-auto mt-3">
                                          <button
                                            style={{ marginTop: '0px' }}
                                            type="button"
                                            className="Unlink custom-btn-style"
                                            onClick={() => {
                                              AccountverifyOTP("cdsl", otp);
                                              setVisible(null);
                                            }}
                                          >
                                            Submit
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  )
                                }
                                {/* Account Verified */}
                                <div className="mt-2">
                                  <div className={`${Styles.verifiedAccount} custom-verifiedAccoun`}>
                                    <div>
                                      <img
                                        style={{ verticalAlign: "middle" }}
                                        className=""
                                        width={15}
                                        src={
                                          imagePath + "/static/media/DG/Verified.svg"
                                        }
                                        alt="List"
                                      />
                                    </div>
                                    <div className="ms-2">
                                      Account verified successful
                                    </div>
                                  </div>
                                </div>
                                {/* Account not verified */}
                                <div style={{ display: visible ? 'none' : 'block' }} className={`mt-2 d-flex justify-content-center align-items-center`}>
                                  <div className={`${Styles.notverifiedAccount}`}>
                                    <div>
                                      <img
                                        style={{ verticalAlign: "middle" }}
                                        className=""
                                        width={15}
                                        src={
                                          imagePath + "/static/media/DG/Failed.svg"
                                        }
                                        alt="List"
                                      />
                                    </div>
                                    <div className="ms-2">
                                      Verification Failed
                                    </div>
                                  </div>
                                  <div className={`${Styles.RetryBtn} custom-color`}>Retry</div>
                                </div>
                              </div>
                            </>
                          </div>
                        )}
                    </div>
                    {
                      props.cdslNsdlResponse.nsdl.length === 0 ||
                        props.cdslNsdlResponse.cdsl.length === 0 ? (
                        null
                      ) : (
                        <>
                          <div className="d-flex justify-content-center">
                            <div className="d-flex justify-content-between align-items-center mt-4">
                              <div
                                className={`${tab == "CSDL" ? `${Styles.Dotactive} custom-background-color` : Styles.Dots}`}
                                onClick={() => setTab("CSDL")}
                              >
                              </div>
                              <div
                                className={`text-center ${tab == "NSDL" ? `${Styles.Dotactive} custom-background-color` : Styles.Dots}`}
                                onClick={() => setTab("NSDL")}
                              >
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    }
                  </div>
                </>
              </div>
            )}

            <div className={`mt-4 ${Styles.accountfoundsection}`}>
              <div
                className={`ButtonBx justify-content-center ${verified ? "" : "d-flex"
                  }`}
                style={{ flexWrap: 'nowrap' }}
              >
                {/* {accountfound ? null : (
                  <button
                    style={{
                      marginLeft: `${verified ? "" : "0"}`,
                      border: "1px solid #042b62",
                      color: "#042b62"
                    }}
                    className={`Cancel commonDashboardButton ${Styles.Cancelpopup} ${verified ? Styles.Cancelbtnmobile : Styles.CancelBtndesktop
                      } custom-outline-btn-style`}
                    onClick={() => {
                      props.onHandlebackClick();
                    }}
                  >
                    Cancel
                  </button>
                )} */}

                {verified ? (
                  <>
                    <button
                      style={{
                        marginLeft: `${verified ? "" : "0"}`,
                        backgroundColor: "#042b62",
                        border: "1px solid #042b62",
                        marginLeft: '0px',
                        marginRight: '0px'
                      }}
                      type="button"
                      className={`Unlink ${Styles.UseDiffnumber} custom-btn-style`}
                      onClick={() => {
                        props.onBackProceedClick();
                      }}
                    >
                      Change Number
                    </button>

                    {
                      props.areBothSelected &&
                      <button
                        style={{
                          marginLeft: `${verified ? "" : "0"}`,
                          backgroundColor: "#042b62",
                          border: "1px solid #042b62",
                          marginLeft: '0px',
                          marginRight: '0px'
                        }}
                        type="button"
                        className={`Unlink ${Styles.UseDiffnumber} custom-btn-style`}
                        onClick={() => {
                          props.handleMfView();
                        }}
                      >
                        Proceed to Mutual Fund
                      </button>
                    }

                    {/* <button
                      style={{
                        marginLeft: `${verified ? "" : "0"}`,
                        backgroundColor: "#042b62",
                        border: "1px solid #042b62",
                      }}
                      type="button"
                      className={`Unlink  ${Styles.UseDiffnumber}`}
                      onClick={() => {
                        props.onBackProceedClick();
                      }}
                    >
                      Continue to Mutual Fund
                    </button> */}
                  </>
                ) : (
                  <>
                    {accountfound ? null : (
                      <button
                        type="button"
                        style={{
                          marginLeft: `${verified ? "" : "1rem"}`,
                          padding: `${verified ? "" : "0.6rem 2rem"}`,
                          backgroundColor: "#042b62",
                          border: "1px solid #042b62"
                        }}
                        className={test ? Styles.disableBtn : "Unlink custom-btn-style"}
                        onClick={() => {
                          // handleTrackAccount("nsdl");
                          // handleTrackAccount("cdsl");
                          // trackAccount("cdsl")
                          handleTrackAccountBtn()
                        }}
                      >
                        Track Account
                      </button>
                    )}
                  </>
                )}

              </div>

            </div>
          </div>
        )
      }

    </>
  );
};
export default AccoutDetails;
