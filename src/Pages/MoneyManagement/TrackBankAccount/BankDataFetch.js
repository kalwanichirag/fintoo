import React, { useRef, useState, useEffect } from "react";
import Styles from "../moneymanagement.module.css";
import style from "../style.module.css";
import Header from "./Header";
import { Modal, Form } from "react-bootstrap";
import socket, { onMessageHandler } from "./socket";
import * as toastr from "toastr";
import { useData } from '../context/DataContext';
import { fetchData, getItemLocal, getParentUserId } from "../../../common_utilities";
// import BankAccountDataTransactionTableView  from "../views/BankAccountDataView/BankAccountDataTransactionTableView";
// import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import SelectBanks from "./SelectBanks";
import BankTrackingProcess from "../components/BankTrackingProcess/BankTrackingProcess";
import { FINVU_BASE_API_URL, CHATBOT_BASE_API_URL, FINVU_USER_ID, FINVU_PASSWORD, FINVU_TEMPLATE_NAME, FINVU_AAID, FINTOO_BASE_API_URL, DATA_BELONGS_TO } from "../../../constants";
import {
  getMemberId,
  getUserId,
  removeMemberId,
  setFpUserDetailsId,
  setMemberId,
  setUserId
} from "../../../common_utilities";
import { generateToken, saveTransactions, updateTrackedBankDetails as updateTrackedBankDetailsFun } from "../../../FrappeIntegration-Services/services/money-management-api/moneyManagementService";
import { saveUserAssetDetails } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";


const BankDataFetch = (props) => {
  const consentMonthData = localStorage.getItem("consentMonth");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidData, setRes, setDataDict, bankIdDetails, mob_no, setaccDiscData, accDiscData, handleIdfromConsent, setHandleIdfromConsent, mergeAccDetails, setMergeAccountDetails, secondAccHandleId, jwtToken, setFinvuToken, finvuToken, setConsentId, consentId, setCustomerInfo, setStatementAccounts, customerInfo, statementAccounts, setXnsOther, xnsOther, xnsExceptOther, setXnsExceptOther } = useData();
  dispatch({ type: "SET_BANK_ID_DETAILS", payload: bankIdDetails });
  const [showData, setShowData] = useState("");
  const { v4: uuidv4 } = require("uuid");
  const customerInfoData = useSelector((state) => state.customerInfoData);
  const [currentUserIds, setCurrentUserIds] = useState([]);
  // const [bankAccounts, setBankAccounts] = useState([]);
  // const [ dateRangeFrom, setDateRangeFrom ] = useState("");
  // const [ dateRangeTo, setDateRangeTo ] = useState("");
  let updatedMergeData = [];
  let consentAppAcc = [];
  let dateRangeFrom = "";
  let dateRangeTo = "";
  let finToken = "";
  let consentHandle = "";
  let consentDataForFIP = [];
  let allConsentData = [];
  let accumulatedData = [];
  let successFlag = false;
  let user_details = "";
  let bank_accounts = [];
  const [BankBalance, setBankBalance] = useState(0);
  const [accountBalance, setAccountBalance] = useState((""));
  

  // const [xnsOther, setXnsOther] = useState([]);
  // const [xnsExceptOther, setXnsExceptOther] = useState([]);
  const [renderBankAccountData, setRenderBankAccountData] = useState(false);
  // let consId = "";

  const getMemberIdFn = () => {
    let isFamilySelected = Boolean(localStorage.getItem("family"));
    if (!isFamilySelected) {
      const userId = getUserId();
      const userIdArray = [userId];
      return userIdArray;
      // } else {
      //     let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
      //     const idsArray = users.map(item => String(item.id));
      //     return idsArray;
    }
  };


  const handleButtonClick = () => {
    setRenderBankAccountData(true);
  };

  const dgexternalfetchbankbal = getItemLocal("dgexternalfetchbankbal");

  const consentApprovalRequestAPI = async (consentHandleId, consentData) => {
    try {
      // alert(JSON.stringify(mergeAccDetails));
      // alert(JSON.stringify(upda${process.env.PUBLIC_URL}/commondashboardentAppAcc));
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
              "Accounts": [consentData]
            }
          ],
          "FIU": {
            "id": "fiulive@fintoo"
          },
          "ver": "1.1.2",
          "consentHandleId": consentHandleId,
          "handleStatus": "ACCEPT"
        }
      };
      socket.send(JSON.stringify(consent_approval_request_payload));
    } catch (error) {
      console.error(
        "An error occurred during Consent Request:",
        error.message
      );
      // toastr.options.positionClass = "toast-bottom-left";
      // toastr.error("Bank Server Error");
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
      // toastr.options.positionClass = "toast-bottom-left";
      // toastr.error("Bank Server Error");
    }
  };

  const finvuTokenAPI = async (consId, consentHandle, consentData) => {
    // const url = FINTOO_BASE_API_URL + 'money_managment/finvutoken/';
    // const headers = new Headers();
    // headers.append('gatewayauthtoken', 'Token ' + jwtToken);
    // headers.append('gatewayauthname', 'localhost');
    try {

      const result = await generateToken();
      if (result.status_code == 200) {
        // const result = await response.json();

        setFinvuToken(result.data.body.token);
        finToken = result.data.body.token;
        await fiRequestAPI(consId, consentHandle, consentData);
      } else {
        // toastr.options.positionClass = "toast-bottom-left";
        // toastr.error("Bank Server Error");
        // throw new Error('Failed to fetch Finvu Token');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // toastr.options.positionClass = "toast-bottom-left";
      // toastr.error("Bank Server Error");
    }
  };

  const consentHandleAPI = async () => {
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

          // const url =
          //   "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/SubmitConsentRequest";
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
            // setSecondAccountHandleId(submitConsentRequestResponseData.body.consentHandle);
            return { success: true, data: { consentHandle: submitConsentRequestResponseData.body.consentHandle } };
          } else {
            return { success: false };
          }
        }
        catch (error) {
          console.error("An error occurred:", error.message);
          return { success: false };

        }
      }
    }
    catch (error) {
      console.error("An error occurred:", error.message);
      return { success: false };

    }
  };

  const fiRequestAPI = async (consId, consentHandle, consentData) => {
    try {
      const url = FINVU_BASE_API_URL + "/FIRequest";
      const rid = uuidv4();
      const fi_request_api_payload = {
        "header": {
          "rid": rid,
          "ts": (new Date().toISOString()).replace('Z', '+00:00'),
          "channelId": "finsense"
        },
        "body": {
          "custId": mob_no + "@finvu",
          "consentId": consId,
          "consentHandleId": consentHandle,
          "dateTimeRangeFrom": dateRangeFrom,
          // "dateTimeRangeTo": dateRangeTo
          "dateTimeRangeTo": ((new Date()).toISOString()).replace('Z', '+00:00')
        }
      }

      const requestBody = JSON.stringify(fi_request_api_payload);

      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: 'Bearer ' + finToken,
          "Content-Type": "application/json",
        },
        body: requestBody,
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        const statusResult = await FIStatus(consId, data.body.sessionId, consentHandle, consentData);
        if (statusResult && !statusResult.error) {
          // FIStatus succeeded and returned a result
          // Proceed with further actions if needed
        } else {
          // FIStatus failed
          // Handle failure if needed
          // props.handleFailure();
        }
        // for (let i=0; i<=5; i++){
        //   const response = await FIStatus(consId, data.body.sessionId, consentHandle, consentData);
        //   if (response.data ==="true"){
        //     // FipFmDatatReport
        //   } 
        // }
      } else {
        // toastr.options.positionClass = "toast-bottom-left";
        // toastr.error("Bank Server Error");
        // navigate(`${process.env.PUBLIC_URL}/money-management/link-bank-account`);
        // props.handleFailure();
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      // toastr.options.positionClass = "toast-bottom-left";
      // toastr.error("Bank Server Error");
      // navigate(`${process.env.PUBLIC_URL}/money-management/link-bank-account`);
      // props.handleFailure();
    }
  };

  //   async function FIStatus(cons_id, session_id, consent_handle_id, consentData) {
  //     const max_retries = 5;
  //     let retry = 0;
  //     // Define a function to call anotherAsyncFunction recursively until desired status is received
  //     const callAnotherAsyncFunction = async () => {
  //         if (retry < max_retries) {
  //             return new Promise((resolve) => {
  //                 setTimeout(async () => {
  //                     const response = await FIStatusAPI(cons_id, session_id, consent_handle_id, consentData);
  //                     if (response.body.fiRequestStatus === "READY") {
  //                       const apiResponse = await FIPfmDataReport(consent_handle_id, session_id, consentDataForFIP.linkRefNumber);
  //                       resolve(apiResponse);
  //                     } else if (response.body.fiRequestStatus === "FAILED") {
  //                         // Handle failed status if needed
  //                         resolve({ error: "FI Status failed" })
  //                     } else {
  //                         retry++;
  //                         resolve(await callAnotherAsyncFunction());
  //                     }
  //                 }, 5000); // Wait for 15 seconds before each recursive call
  //             });
  //         } else {
  //             return false;
  //         }
  //     };

  //     // Start the recursive call
  //     return callAnotherAsyncFunction();
  // }

  async function FIStatus(cons_id, session_id, consent_handle_id, consentData) {
    try {
      const max_retries = 5;
      let retry = 0;
      while (retry < max_retries) {
        const response = await FIStatusAPI(cons_id, session_id, consent_handle_id, consentData);
        if (response.body.fiRequestStatus === "READY") {
          const apiResponse = await FIPfmDataReport(consent_handle_id, session_id, consentDataForFIP.linkRefNumber);
          if (apiResponse.success && apiResponse.data) {
            consentDataForFIP.totalBalance = apiResponse.data.statementAccounts[0].currentBalance;
            allConsentData.push(consentDataForFIP);
            accumulatedData.push(apiResponse.data);
            bank_accounts.push(apiResponse.data.statementAccounts[0].accountNo);
            setAccountBalance(apiResponse.data.statementAccounts[0].currentBalance);
            successFlag = true;
          }
          return apiResponse; // Return the result immediately when status is "READY"
        } else if (response.body.fiRequestStatus === "FAILED") {
          return { "error": "FI Status failed" };
          // throw new Error("FI Status failed"); // Throw an error if status is "FAILED"
        }
        retry++;
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 5 seconds before each retry
      }
      return { error: "Max retries exceeded" }; // Return an error if max retries exceeded
    } catch (error) {
      console.error('FIStatus error:', error);
      throw error; // Propagate the error
    }
  };



  const FIStatusAPI = async (cons_id, session_id, consent_handle_id, consentData, retryCount = 0) => {
    let custID = mob_no + "@finvu";
    let successFlag = false;
    const accumulatedData = [];

    try {
      const customHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: 'Bearer ' + finToken,
      };
      const payload = {
        url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIStatus/${cons_id}/${session_id}/${consent_handle_id}/${custID}`,
        headers: customHeaders,
        method: "get",
      };

      const r = await fetchData(payload);
      // const r = await fetch(url, payload);
      return r;

      if (r.body.fiRequestStatus === "READY") {

        // for (let i of consentAppAcc) {
        const apiResponse = await FIPfmDataReport(consent_handle_id, session_id, consentDataForFIP.linkRefNumber);

        //   if (apiResponse.success && apiResponse.data) {
        //     accumulatedData.push(apiResponse.data);
        //     successFlag = true;
        //   }
        // }

        // if (successFlag) {
        //   setCustomerInfo(accumulatedData[0].customerInfo);
        //   dispatch({ type: "SET_CUSTOMER_INFO", payload: accumulatedData[0].customerInfo });
        //   const allStatementAccounts = accumulatedData.map(item => item.statementAccounts).flat();

        //   dispatch({ type: "SET_STATEMENT_ACCOUNT_DATA", payload: allStatementAccounts });

        //   setShowData("Bank details have been fetched successfully.");
        // } else {
        //   setShowData("Sorry, we weren't able to fetch your bank details.");
        //   // navigate(`${process.env.PUBLIC_URL}/money-management/link-bank-account`);
        //   // props.handleFailure();
        // }
      } else if (r.body.fiRequestStatus === "FAILED") {
        // toastr.options.positionClass = "toast-bottom-left";
        // toastr.error("Bank Server Error");
        // navigate(`${process.env.PUBLIC_URL}/money-management/link-bank-account`);
        // props.handleFailure();

      } else {
        if (retryCount < 5) {
          setTimeout(async () => await FIStatus(cons_id, session_id, consent_handle_id, retryCount + 1), 15000);
        } else {
          setShowData("Sorry, we weren't able to fetch your bank details.");
          // toastr.options.positionClass = "toast-bottom-left";
          // toastr.error("Bank Server Error");
          // navigate(`${process.env.PUBLIC_URL}/money-management/link-bank-account`);
          // props.handleFailure();
        }
      }

      return accumulatedData;
    } catch (error) {
      console.error("OTP error", error);
      // toastr.options.positionClass = "toast-bottom-left";
      // toastr.error("Bank Server Error");
      return accumulatedData;
    }
  };

  // const FIStatus = async (cons_id, session_id, consent_handle_id, consentData, retryCount = 0) => {
  //   let custID = mob_no + "@finvu";
  //   let successFlag = false;
  //   const accumulatedData = [];

  //   try {
  //     const customHeaders = {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       Authorization: 'Bearer ' + finToken,
  //     };
  //     const url = FINVU_BASE_API_URL+ `FIStatus/${cons_id}/${session_id}/${consent_handle_id}/${custID}`;
  //     const payload = {
  //       headers: customHeaders,
  //       method: "get",
  //     };

  //     // const r = await fetchData(payload);
  //     const r = await fetch(url, payload);

  //     if (r.body.fiRequestStatus === "READY") {

  //       // for (let i of consentAppAcc) {
  //         const apiResponse = await FIPfmDataReport(consent_handle_id, session_id, consentDataForFIP.linkRefNumber);

  //       //   if (apiResponse.success && apiResponse.data) {
  //       //     accumulatedData.push(apiResponse.data);
  //       //     successFlag = true;
  //       //   }
  //       // }

  //       // if (successFlag) {
  //       //   setCustomerInfo(accumulatedData[0].customerInfo);
  //       //   dispatch({ type: "SET_CUSTOMER_INFO", payload: accumulatedData[0].customerInfo });
  //       //   const allStatementAccounts = accumulatedData.map(item => item.statementAccounts).flat();

  //       //   dispatch({ type: "SET_STATEMENT_ACCOUNT_DATA", payload: allStatementAccounts });

  //       //   setShowData("Bank details have been fetched successfully.");
  //       // } else {
  //       //   setShowData("Sorry, we weren't able to fetch your bank details.");
  //       //   // navigate(`${process.env.PUBLIC_URL}/money-management/link-bank-account`);
  //       //   // props.handleFailure();
  //       // }
  //     } else if (r.body.fiRequestStatus === "FAILED") {
  //       toastr.options.positionClass = "toast-bottom-left";
  //       toastr.error("Bank Server Error");
  //       // navigate(`${process.env.PUBLIC_URL}/money-management/link-bank-account`);
  //       // props.handleFailure();

  //     } else {
  //       if (retryCount < 5) {
  //         setTimeout(async() => await FIStatus(cons_id, session_id, consent_handle_id, retryCount + 1), 15000);
  //       } else {
  //         setShowData("Sorry, we weren't able to fetch your bank details.");
  //         toastr.options.positionClass = "toast-bottom-left";
  //         toastr.error("Bank Server Error");
  //         // navigate(`${process.env.PUBLIC_URL}/money-management/link-bank-account`);
  //         // props.handleFailure();
  //       }
  //     }

  //     return accumulatedData;
  //   } catch (error) {
  //     console.error("OTP error", error);
  //     toastr.options.positionClass = "toast-bottom-left";
  //     toastr.error("Bank Server Error");
  //     return accumulatedData;
  //   }
  // };


  const FIPfmDataReport = async (ConsentHandle, sID, linkref) => {
    try {
      const customHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: 'Bearer ' + finToken,
      };
      const payload = {
        url: FINVU_BASE_API_URL + `/FIPfmDataReport/${ConsentHandle}/${sID}/${linkref}`,
        headers: customHeaders,
        method: "get",
      };

      const r = await fetchData(payload);

      if (r.body.customerInfo && r.body.statementAccounts) {
        return { success: true, data: { customerInfo: r.body.customerInfo, statementAccounts: r.body.statementAccounts } };
      } else {
        // toastr.options.positionClass = "toast-bottom-left";
        // toastr.error("Bank Server Error");
        return { success: false };
      }
    } catch (error) {
      console.error("FIPfmDataReport error", error);
      // toastr.options.positionClass = "toast-bottom-left";
      // toastr.error("Bank Server Error");
      return { success: false };
    }
  };



  const separateTransactions = (statAccounts) => {
    const newXnsOther = [];
    const newXnsExceptOther = [];

    for (const account of statAccounts) {
      for (const transaction of account.xns) {
        if (transaction.category.toLowerCase().includes('other') && transaction.type === 'DEBIT') {
          newXnsOther.push(transaction);
        } else {
          newXnsExceptOther.push(transaction);
        }
      }
    }

    setXnsOther(newXnsOther);
    setXnsExceptOther(newXnsExceptOther);
  };

  const uploadDatatoS3 = async (user_id, customerInfo, account_statement) => {
    // const call_id = await getCallbackId();
    var myHeaders = new Headers();
    // const tkn = await getJWTToken();
    // myHeaders.append("gatewayauthtoken", 'Token '+tkn);
    // myHeaders.append("gatewayauthname", GATEWAY_AUTH_NAME);
    // const transformedData = statementAccounts.map(account => [account]);
    const payload = {
      customerInfo: customerInfo,
      account_statement: [account_statement],
      user_id: user_id[0]
    };
    // myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Cookie", "AWSALBTG=VmwGpjloOZHqm4zYwwgrhQHBFqgjHSadlnkk3pDv2VHCrOFU76lUNk3jvnw2J18jV4XbJnqGSOz80EIcr/iuY3e7RusDT2z5wK+pQ768CDlWOIIAjWkuVSatFsU8WKYhNR7V7TAJIR7Kmc2FcpsYP/iq+TP5rGPWnuCGQS5wqzXV; AWSALBTGCORS=VmwGpjloOZHqm4zYwwgrhQHBFqgjHSadlnkk3pDv2VHCrOFU76lUNk3jvnw2J18jV4XbJnqGSOz80EIcr/iuY3e7RusDT2z5wK+pQ768CDlWOIIAjWkuVSatFsU8WKYhNR7V7TAJIR7Kmc2FcpsYP/iq+TP5rGPWnuCGQS5wqzXV");
    try {
      const result = await saveTransactions(payload);
      if (result.status_code == 200) {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Internal Server Error");
    }
  };

  const UpdateTrackedbankDetails = async (bank_data) => {
    try {
      const payload = {
        user_id: bank_data.userId[0],
        finvuuserId: bank_data.finvuUserid,
        fipId: bank_data.fipId,
        fipType: bank_data.FIType,
        mobile_number: String(bank_data.mobileNumber),
        consentId: bank_data.consentId,
        consentHandleId: bank_data.consentHandleId,
        fipName: bank_data.fipName,
        acc_type: bank_data.accType,
        account_masked_id: bank_data.maskedAccNumber,
        link_ref_no: bank_data.linkRefNumber,
        total_balance: bank_data.totalBalance,
        daterange_from: bank_data.dateRangeFrom,
        daterange_to: bank_data.dateRangeTo,
      };

      const response = await updateTrackedBankDetailsFun(payload);

      if (response.status_code == 200) {
        return response;
      }

    } catch (error) {
      console.error('Error updating tracked bank details:', error);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Internal Server Error");
      // navigate(`${process.env.PUBLIC_URL}/money-management/link-bank-account`);
      // props.handleFailure();
    }
  };

  // useEffect(() => {
  //     separateTransactions();
  // }, []);

  async function waitForWebSocketMessage(socket, onMessageHandler) {
    return new Promise(resolve => {
      socket.onmessage = function (event) {
        const data = onMessageHandler(event);
        resolve(data);
      };
    });
  }


  useEffect(() => {

    user_details = getMemberIdFn();
    setCurrentUserIds(user_details);
    socket.onmessage = function (event) {
      const data = onMessageHandler(event);
      if (data.header.type == "urn:finvu:in:app:res.confirm-token.01") {
        if (data.payload.status == "SUCCESS") {
          updatedMergeData = accDiscData.map(item => ({
            ...item,
            "linkRefNumber": data.payload.AccLinkDetails[0].linkRefNumber,
            "accRefNumber": data.payload.AccLinkDetails[0].accRefNumber,
            "fipId": bankIdDetails.fipId,
            "fipName": bankIdDetails.fipName
          }));
          consentRequestDetailsAPI();
        } else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error("Bank Server Error");
        }
      } else if (data.header.type == "urn:finvu:in:app:res.consentRequestDetailsResponse.01") {
        if (data.payload.status == "SUCCESS") {
          setHandleIdfromConsent(data.payload.ConsentHandle);
          const consentDate = new Date(consentMonthData);
          const formattedConsentDate = consentDate.toISOString().replace('Z', '');
          // dateRangeFrom = data.payload.DataDateTimeRange.from;
          dateRangeFrom = formattedConsentDate + "+00:00";
          // setDateRangeTo(data.payload.DataDateTimeRange.to);
          dateRangeTo = data.payload.DataDateTimeRange.to;
          // setMergeAccountDetails(updatedMergeData);
          if (mergeAccDetails.length === 0) {
            consentAppAcc = updatedMergeData;
          } else {
            consentAppAcc = mergeAccDetails;
          }
          (async () => {
            let isFirstIteration = true;
            for (let consentData of consentAppAcc) {
              consentDataForFIP = consentData;
              if (isFirstIteration) {
                consentHandle = data.payload.ConsentHandle;
                isFirstIteration = false;
              } else {
                const consenthandleRespone = await consentHandleAPI();
                if (consenthandleRespone.success && consenthandleRespone.data) {
                  consentHandle = consenthandleRespone.data.consentHandle;
                }
              }
              await consentApprovalRequestAPI(consentHandle, consentData);
              const message = await waitForWebSocketMessage(socket, onMessageHandler);
              if (message.header.type == "urn:finvu:in:app:res.accountConsentRequest.01") {
                if (message.payload.status == "SUCCESS") {
                  // setShowData("Bank Details has Been Fetch Successful");
                  setConsentId(message.payload.fipConsentInfos[0].consentId);
                  consentDataForFIP.consentHandleId = consentHandle;
                  consentDataForFIP.consentId = message.payload.fipConsentInfos[0].consentId;
                  consentDataForFIP.finvuUserid = mob_no + "@finvu";
                  consentDataForFIP.mobileNumber = mob_no;
                  consentDataForFIP.userId = user_details;
                  consentDataForFIP.dateRangeFrom = dateRangeFrom;
                  consentDataForFIP.dateRangeTo = dateRangeTo;
                  await finvuTokenAPI(message.payload.fipConsentInfos[0].consentId, consentHandle, consentData);
                }
                // else {
                //     props.handleFailure();
                //     toastr.options.positionClass = "toast-bottom-left";
                //     toastr.error("Bank Server Error");
                //     setShowData("Sorry, we weren't able to fetch your bank details.");
                // }
              }
            }
            if (successFlag & accumulatedData.length > 0) {
              setCustomerInfo(accumulatedData[0].customerInfo);
              dispatch({ type: "SET_CUSTOMER_INFO", payload: accumulatedData[0].customerInfo });
              const allStatementAccounts = accumulatedData.map(item => item.statementAccounts).flat();

              // dispatch({ type: "SET_STATEMENT_ACCOUNT_DATA", payload: allStatementAccounts });
              dispatch({ type: "SET_ALL_FETCHED_ACCOUNT_DETAILS", payload: allConsentData });
              await uploadDatatoS3(user_details, accumulatedData[0].customerInfo, allStatementAccounts);
              for (let bank_details of allConsentData) {

                setBankBalance(bank_details.totalBalance)
                const response = await UpdateTrackedbankDetails(bank_details);
                if (response.status_code !== 200) {
                  props.handleFailure();
                  toastr.options.positionClass = "toast-bottom-left";
                  toastr.error("Something Went wrong, Please try again!");
                }
              }
              dispatch({ type: "SET_FETCH_TXN_DATA_ACCOUNT", payload: bank_accounts });
              // await FetchAccountTransactionsAPI(user_details, bank_accounts);
              // await GetExpenseCategoryList();
              if (consentAppAcc.length == accumulatedData.length) {
                setShowData("Bank transactions have been fetched successfully.");
              } else {
                setShowData("Only " + accumulatedData.length + " bank details has been fetched successfully.");
              }
            } else {
              props.handleFailure();

              // toastr.options.positionClass = "toast-bottom-left";
              // toastr.error("Bank Server Error");

              props.setErrorData({
                message: 'Experiencing temporary bank connectivity issues. Please retry later.',
                variant: 'error'
              })


              // setShowData("Sorry, we weren't able to fetch your bank details.");
              // props.handleFailure();

              // }
              // setShowData("Sorry, we weren't able to fetch your bank details.");
              // navigate(`${process.env.PUBLIC_URL}/money-management/link-bank-account`);
              // props.handleFailure();
            }
          })();


        } else {
          // toastr.options.positionClass = "toast-bottom-left";
          // toastr.error("Bank Server Error");

          props.setErrorData({
            message: 'Experiencing temporary bank connectivity issues. Please retry later.',
            variant: 'error'
          })

        }

      }
      // else if (data.header.type == "urn:finvu:in:app:res.accountConsentRequest.01"){
      //       if (data.payload.status=="SUCCESS") {
      //           // setShowData("Bank Details has Been Fetch Successful");
      //           setConsentId(data.payload.fipConsentInfos[0].consentId);
      //           finvuTokenAPI(data.payload.fipConsentInfos[0].consentId);
      //       }
      //       else {
      //           setShowData("Sorry, we weren't able to fetch your bank details.");
      //       }
      //       }
    };
  }, [showData]);

  const AssetAdd = async () => {
   ;
    try {
      const payload = {
        user_asset_source: "External",
        asset_type_name_uuid: "saving_account",
        asset_name_uuid: "debt",
        asset_sub_name_uuid: "liquid",
        // asset_sub_category_id: "liquid",
        user_asset_allocation: "0",
        user_asset_occurance: "One Time",
        user_asset_property_type: "Self-Occupied",
        user_asset_maturity_amount: 0,
        user_asset_maturity_date: null,
        user_asset_end_date: "",
        asset_name: "Saving Account",
        user_asset_name: "Saving Account",
        asset_pan: null,
        user_asset_payout_type: "Cumulative",
        subcategorydetail: "Saving Account",
        user_asset_current_amount: BankBalance, 
        user_asset_user_id: getParentUserId(),
        user_asset_for: getUserId(),
        // asset_member_id: user_details,
        user_asset_automated_linkage: "0",
        user_asset_installment_paid: "0",
        user_asset_currency: "INR",
        user_asset_type_id: "ATM-15",
        user_id: getParentUserId(),
        user_asset_context: "Individual",
        user_asset_investment_amount :BankBalance, 
        asset_source: "1",
        user_asset_belongs_to: DATA_BELONGS_TO
      };
  
      const response = await saveUserAssetDetails(payload);
  
      if (response?.status_code === "200") {
        return response;
      } else {
        console.warn("Asset save failed:", response);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Failed to save asset details");
      }
    } catch (error) {
      console.error("Error saving asset details:", error);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Internal Server Error");
    }
  };
  


  return (
    <>
      <div style={{
        display: "grid",
        placeItems: "center",
        placeContent: "center"
      }}>
        <div>
          <img src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/Successful.svg"} alt="Successful" />
        </div>
        {showData ? (
          <div className={`mt-4 ${Styles.Successfulmsg}`}>{showData}</div>
        ) : (
          <div className={`mt-4 ${Styles.Successfulmsg}`} style={{ display: 'block' }}>
            Please wait while we are fetching your transaction details.<br />
            This task may require a moment.
          </div>
        )}
        {showData ? (
          <div style={{ position: "relative" }} className={`mt-5 ${Styles.ContinueButton}`}>
            {
              dgexternalfetchbankbal == true ?
                
                  <button
                    onClick={async () => {
                      localStorage.removeItem("dgexternalfetchbankbal");
                      await AssetAdd(); 

                      if (accountBalance === "") {
                        navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
                      } else {
                        navigate(
                          `${process.env.PUBLIC_URL}/datagathering/assets-liabilities?success=1&isbank=1&amount=${accountBalance}`
                        );
                      }
                    }}
                    style={{ padding: ".5rem 2rem" }}
                  >
                    Continue
                  </button>
                

                : <Link
                  to={process.env.PUBLIC_URL + "/money-management/map-transactions"}
                >
                  <button style={{ padding: '.5rem 2rem' }}>Continue</button>
                </Link>
            }

          </div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  )
};

export default BankDataFetch;