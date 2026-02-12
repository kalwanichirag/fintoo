import React, { useEffect, useRef, useState } from "react";
import Bankbalance from "../BankCashbalance/Bankbalance.module.css";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../../components/FintooRadio2/style.module.css";
import Unchecked from "../../../components/FintooCheckbox/check_mark_02.svg";
import "../../../components/FintooCheckbox/style.css";
import { Modal } from "react-bootstrap";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import socket, { onMessageHandler } from "./socket";
import {
  apiCall,
  createCookie,
  fetchData,
  fetchEncryptData,
  getCookie,
  getItemLocal,
  getUserId,
} from "../../../common_utilities";
import commonEncode from "../../../commonEncode";
import { format } from "date-fns";

import moment from "moment";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { v1 as uuidv1 } from "uuid";
import { imagePath } from "../../../constants";

const ConfirmConsent = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [stepCount, setStepCount] = useState(0);
  const [openModalByName, setOpenModalByName] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userBankAccount, setUserBankAccount] = useState("");
  const [userBalancePayload, setUserBalancePayload] = useState("");
  const [userBankName, setUserBankName] = useState("");
  const [userBankLogo, setUserBankLogo] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [assetId, setAssetId] = useState("");
  const loadingDuration = 75000; // 60 seconds
  const [accountBalance, setAccountBalance] = useState((""));

  const imageURL = process.env.REACT_APP_STATIC_URL + "media/DG/loader.svg";
  useEffect(() => {
    let loadingTimeout = setTimeout(() => {
      if (progress >= 100) return;
      setProgress(progress + 1);
    }, loadingDuration / 100);

    if (progress === 100) {
      setLoading(false);
    }

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [progress, loading]);

  const startLoader = () => {
    setProgress(0);
    setLoading(true);
  };
  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 30000000);
  // }, []);

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

  const radioOptions = ["HDFC Bank", "SBI Bank"];
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

  const sessionData = useRef("");

  // useEffect(() => {
  //   const checksession = async () => {
  //     let url = '';
// let url = CHECK_SESSION;
  //     let data = { user_id: getUserId(), sky: getItemLocal("sky") };
  //     let session_data = await apiCall(url, data, true, false);

  //     if (session_data["error_code"] == "100") {
  //       sessionData.current = session_data;
  //     }
  //   };
  //   // checksession();

  //   const memberData = commonEncode.decrypt(
  //     localStorage.getItem("getbankdata")
  //   );
  // }, []);

  useEffect(() => {
    // Extract the 'payload' query parameter from the URL
    let linkedAccounts = getCookie("selectedAccounts");
    let bankAccounts = JSON.parse(commonEncode.decrypt(linkedAccounts));
    setUserBankAccount(bankAccounts.linkedaccounts);
    setUserBankName(bankAccounts.linkedaccounts.fipName);
    let bankLogos = JSON.parse(commonEncode.decrypt(getCookie("bankname")));
    setUserBankLogo(bankLogos.fipLogo);
  }, []);

  useEffect(() => {
    socket.onopen = (event) => {};
    socket.onmessage = (event) => {
      const data = onMessageHandler(event);

      if (data.payload.status == "SUCCESS" && data.payload.consentIntentId) {
        commonEncode.encrypt(
          createCookie(
            "consentId",
            commonEncode.encrypt(JSON.stringify(data.payload.consentIntentId)),
            15
          )
        );

        checkConsentStatus();
      } else if (data.payload.status == "SUCCESS") {
        commonEncode.encrypt(
          createCookie(
            "dateRange",
            commonEncode.encrypt(
              JSON.stringify(data.payload.DataDateTimeRange)
            ),
            15
          )
        );
        consentApproval();
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Could not fetch the consent");
        navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
      }
    };
  }, []);

  const [flag, setFlag] = useState("");

  const handleRadioClick = (index) => {
    setSelectedOption(index);
    setFlag(true);
  };

  const consentApproval = async () => {
    let bankAccounts = JSON.parse(
      commonEncode.decrypt(getCookie("selectedAccounts"))
    );
    let bankdata = getCookie("bankdata");
    bankdata = bankdata ? JSON.parse(commonEncode.decrypt(bankdata)) : "";
    let consentHandle = JSON.parse(commonEncode.decrypt(getCookie("bankname")));
    let rid = uuidv1();

    try {
      let consent_request_details_payload = {
        header: {
          mid: rid,
          ts: new Date().toISOString().replace("Z", "+00:00"),
          sid: bankAccounts.sid,
          dup: "false",
          type: "urn:finvu:in:app:req.accountConsentRequest.01",
        },
        payload: {
          FIPDetails: [
            {
              FIP: {
                id: bankAccounts.linkedaccounts.fipId,
              },
              Accounts: [
                {
                  linkRefNumber: bankAccounts.linkedaccounts.linkRefNumber
                    ? bankAccounts.linkedaccounts.linkRefNumber
                    : bankdata.linkRefNumber,
                  accType: bankAccounts.linkedaccounts.accType,
                  accRefNumber: bankAccounts.linkedaccounts.accRefNumber
                    ? bankAccounts.linkedaccounts.accRefNumber
                    : bankdata.accRefNumber,
                  maskedAccNumber: bankAccounts.linkedaccounts.maskedAccNumber,
                  FIType: bankAccounts.linkedaccounts.FIType,
                  fipId: bankAccounts.linkedaccounts.fipId,
                  fipName: bankAccounts.linkedaccounts.fipName,
                },
              ],
            },
          ],
          FIU: {
            id: "fiulive@fintoo",
          },
          ver: "1.1.2",
          consentHandleId: consentHandle.handleId,
          handleStatus: "ACCEPT",
        },
      };

      socket.send(JSON.stringify(consent_request_details_payload));
    } catch (e) {
      console.log("Error", e);
    }
  };

  const [consentStatus, setConsentStatus] = useState("");

  const checkConsentStatus = async (retryCount = 0) => {
    let bankAccounts = JSON.parse(
      commonEncode.decrypt(getCookie("selectedAccounts"))
    );
    let handleId = JSON.parse(commonEncode.decrypt(getCookie("bankname")));
    let consentHandle = handleId.handleId;
    let token = JSON.parse(commonEncode.decrypt(getCookie("token")));
    let custID = bankAccounts.userId;

    try {
      const customHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const payload = {
        url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/ConsentStatus/${consentHandle}/${custID}`,
        headers: customHeaders,
        method: "get",
      };

      const r = await fetchData(payload);

      if (r.body.consentStatus === "ACCEPTED") {
        setConsentStatus(r.body.consentStatus);
        FIRequest();
      } else {
        if (retryCount < 5) {
          setTimeout(() => checkConsentStatus(retryCount + 1), 15000);
        } else {
          if (r.body.consentStatus === "REJECTED") {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Consent Status is Rejected");
            navigate(
              `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`
            );
          } else {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Consent Status is Requested");
            navigate(
              `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`
            );
          }
        }
      }
    } catch (error) {
      console.error("Error", error);
      // Handle error here if needed
    }
  };

  const { v4: uuidv1 } = require("uuid");
  const [userSesssionId, setUserSessionId] = useState("");

  const FIRequest = async () => {
    const rid = uuidv1();
    const ts = new Date().toISOString();

    let bankAccounts = JSON.parse(
      commonEncode.decrypt(getCookie("selectedAccounts"))
    );
    let handleId = JSON.parse(commonEncode.decrypt(getCookie("bankname")));
    let consentHandle = handleId.handleId;
    let consentId = JSON.parse(commonEncode.decrypt(getCookie("consentId")));
    let dateRange = JSON.parse(commonEncode.decrypt(getCookie("dateRange")));
    let token = JSON.parse(commonEncode.decrypt(getCookie("token")));

    try {
      let fir_request_payload = {
        header: {
          rid: rid,
          ts: ts,
          channelId: "finsense",
        },
        body: {
          custId: bankAccounts.userId,
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
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } catch (e) {
      console.log("Error", e);
    }
  };

  const FIStatus = async (sId, retryCount = 0) => {
    // let retryCount = 0;
    let token = JSON.parse(commonEncode.decrypt(getCookie("token")));
    let bankAccounts = JSON.parse(
      commonEncode.decrypt(getCookie("selectedAccounts"))
    );
    let handleId = JSON.parse(commonEncode.decrypt(getCookie("bankname")));
    let ConsentHandle = handleId.handleId;
    let custID = bankAccounts.userId;
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

      if (r.body.fiRequestStatus === "READY") {
        FIPfmDataReport(sessionId);
      } else {
        if (retryCount < 5) {
          setTimeout(() => FIStatus(sId, retryCount + 1), 15000);
        } else {
          setOpenModalByName("ApprovedConsent");
        }
      }
    } catch (error) {
      console.error("Error", error);
      // Handle error here if needed
    }
  };

  const FIPfmDataReport = async (sID) => {
    let token = JSON.parse(commonEncode.decrypt(getCookie("token")));
    let bankAccounts = JSON.parse(
      commonEncode.decrypt(getCookie("selectedAccounts"))
    );
    let handleId = JSON.parse(commonEncode.decrypt(getCookie("bankname")));
    let ConsentHandle = handleId.handleId;
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
        let linkref = r.body.ConsentDetail.Accounts["0"].linkRefNumber;
        let accounts = r.body.ConsentDetail.Accounts;

        try {
          let customHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          };

          let payload = {
            url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIPfmDataReport/${ConsentHandle}/${sID}/${linkref}`,
            headers: customHeaders,
            method: "get",
          };

          const userData = await fetchData(payload);
          let balancePayload = {
            bankName: userData.body.statementAccounts["0"].bank,
            memberName: userData.body.customerInfo.name,
            mobileNumber: userData.body.customerInfo.mobile,
          };

          setAccountBalance(userData?.body.statementAccounts["0"].currentBalance)

          let member = localStorage.getItem("userdetails");
          let membername = localStorage.getItem("username");

          setUserBalancePayload(balancePayload);
          setOpenModalByName("ApprovedConsent");

          const memData = commonEncode.decrypt(
            localStorage.getItem("getbankdata")
          );

          const memberData = JSON.parse(memData);

          if (memberData.data != "") {
            // Initialize a flag to false
            let isMatch = false;
            // Loop through the memberData array to check for a match
            for (const memberItem of memberData) {
              if (
                memberItem.bank_name === balancePayload.bankName &&
                memberItem.member_name === membername
              ) {
                // If a match is found, set the flag to true and break out of the loop
                isMatch = true;
                setAssetId(memberItem.asset_id);
                break;
              }
            }
            // Now you can use the isMatch flag as needed
            if (isMatch) {
              try {
                let assetPayload = {
                  id: assetId,
                  Created_By: 0,
                  Updated_By: 0,
                  asset_amount:
                    userData?.body.statementAccounts["0"].currentBalance,
                  asset_abreturn: "0",
                  annual_growth_rate: "10",
                  asset_broker_id: 0,
                  asset_category_id: 40,
                  asset_citytype: "0",
                  asset_current_unit_price: "",
                  asset_currency: false,
                  user_asset_source: "broker",
                  asset_epf_ismanual: "1",
                  asset_folio_number: null,
                  asset_footnote: null,
                  asset_frequency: "1",
                  asset_goal_link_id: 0,
                  asset_goalname: null,
                  asset_gold_karat: 0,
                  asset_isActive: "1",
                  asset_ismortgage: "0",
                  asset_isperpetual: "3",
                  asset_isallocation: false,
                  asset_iselss: "1",
                  asset_islinkable: true,
                  asset_isrecurring: false,
                  asset_isrented: "1",
                  asset_maturity_amt: 0,
                  asset_maturity_date: null,
                  asset_member_id: member,
                  asset_mf_end_date: null,
                  asset_name: userData.body.statementAccounts["0"].bank,
                  asset_pan: null,
                  asset_payout_type: "1",
                  asset_pin_code: "",
                  asset_purchase_amount: "",
                  asset_purchase_date: null,
                  asset_rental_amount: "",
                  asset_rental_income: null,
                  asset_ror: "0",
                  asset_sub_category_id: 61,
                  asset_unique_code: "",
                  asset_units: "",
                  categorydetail: "Bank Balance",
                  created_datetime: moment().format("DD/MM/YYYY"),
                  employee_contribution: "",
                  employer_contribution: "",
                  fp_log_id: sessionData.current["data"]["fp_log_id"],
                  installment_ispaid: "1",
                  membername1: "",
                  stock_mf: null,
                  stock_name: null,
                  subcategorydetail: "",
                  totalinvestedvalue: "",
                  totalpurchasevalue: "",
                  totalmaturtiyamount: "",
                  updated_datetime: moment().format("DD/MM/YYYY"),
                  user_id: sessionData.current["data"]["id"],
                  scheme_equityshare: {},
                };
                const res = await apiCall(
                  ADVISORY_UPDATE_ASSETS_API,
                  assetPayload,
                  true,
                  false
                );
                if (res["error_code"] == "100") {
                  try {
                    const currentDate = new Date();
                    const options = {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    };
                    const formattedDate = currentDate.toLocaleDateString(
                      "en-US",
                      options
                    );
                    let bankBalancePayload = {
                      url: ADVISORY_ADD_BANK_DATA,
                      data: {
                        bank_name: userData?.body?.statementAccounts["0"].bank,
                        member_name: membername,
                        mobile_number: bankAccounts.userId.replace(
                          /[^0-9]/g,
                          ""
                        ),
                        user_id: "" + sessionData.current["data"]["id"],
                        fp_log_id:
                          "" + sessionData.current["data"]["fp_log_id"],
                        consent_id: consentID,
                        consent_handle: ConsentHandle,
                        cust_id: bankAccounts.userId,
                        daterange_from: dateRange.from,
                        daterange_to: dateRange.to,
                        asset_id: res.data.id,
                        updated_datetime: formattedDate,
                      },
                      method: "post",
                    };
                    const r = await fetchData(bankBalancePayload);
                    if (r["error_code"] == "100") {
                      console.log("Error", r);
                    }
                  } catch (e) {
                    console.log("Error", e);
                  }
                }
                console.log("Error", r);
              } catch (e) {
                console.log("Error", e);
              }
            } else {
              // Handle the case where there is no match
              try {
                let assetPayload = {
                  Created_By: 0,
                  Updated_By: 0,
                  asset_amount:
                    userData?.body.statementAccounts["0"].currentBalance,
                  asset_abreturn: "0",
                  annual_growth_rate: "10",
                  asset_broker_id: 0,
                  asset_category_id: 40,
                  asset_citytype: "0",
                  asset_current_unit_price: "",
                  asset_currency: false,
                  user_asset_source: "broker",
                  asset_epf_ismanual: "1",
                  asset_folio_number: null,
                  asset_footnote: null,
                  asset_frequency: "1",
                  asset_goal_link_id: 0,
                  asset_goalname: null,
                  asset_gold_karat: 0,
                  asset_isActive: "1",
                  asset_ismortgage: "0",
                  asset_isperpetual: "3",
                  asset_isallocation: false,
                  asset_iselss: "1",
                  asset_islinkable: true,
                  asset_isrecurring: false,
                  asset_isrented: "1",
                  asset_maturity_amt: 0,
                  asset_maturity_date: null,
                  asset_member_id: member,
                  asset_mf_end_date: null,
                  asset_name: userData.body.statementAccounts["0"].bank,
                  asset_pan: null,
                  asset_payout_type: "1",
                  asset_pin_code: "",
                  asset_purchase_amount: "",
                  asset_purchase_date: null,
                  asset_rental_amount: "",
                  asset_rental_income: null,
                  asset_ror: "0",
                  asset_sub_category_id: 61,
                  asset_unique_code: "",
                  asset_units: "",
                  categorydetail: "Bank Balance",
                  created_datetime: moment().format("DD/MM/YYYY"),
                  employee_contribution: "",
                  employer_contribution: "",
                  fp_log_id: sessionData.current["data"]["fp_log_id"],
                  installment_ispaid: "1",
                  membername1: "",
                  stock_mf: null,
                  stock_name: null,
                  subcategorydetail: "",
                  totalinvestedvalue: "",
                  totalpurchasevalue: "",
                  totalmaturtiyamount: "",
                  updated_datetime: moment().format("DD/MM/YYYY"),
                  user_id: sessionData.current["data"]["id"],
                  scheme_equityshare: {},
                };
                const res = await apiCall(
                  '',
                  assetPayload,
                  true,
                  false
                );
                if (res["error_code"] == "100") {
                  try {
                    const currentDate = new Date();
                    const options = {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    };
                    const formattedDate = currentDate.toLocaleDateString(
                      "en-US",
                      options
                    );
                    let bankBalancePayload = {
                      url: ADVISORY_ADD_BANK_DATA,
                      data: {
                        bank_name: userData?.body?.statementAccounts["0"].bank,
                        member_name: membername,
                        mobile_number: bankAccounts.userId.replace(
                          /[^0-9]/g,
                          ""
                        ),
                        user_id: "" + sessionData.current["data"]["id"],
                        fp_log_id:
                          "" + sessionData.current["data"]["fp_log_id"],
                        consent_id: consentID,
                        consent_handle: ConsentHandle,
                        cust_id: bankAccounts.userId,
                        daterange_from: dateRange.from,
                        daterange_to: dateRange.to,
                        asset_id: res.data.id,
                        updated_datetime: formattedDate,
                      },
                      method: "post",
                    };
                    const r = await fetchData(bankBalancePayload);
                    if (r["error_code"] == "100") {
                      console.log("Error", r);
                    }
                  } catch (e) {
                    console.log("Error", e);
                  }
                }
                console.log("Error", r);
              } catch (e) {
                console.log("Error", e);
              }
            }
          } else {
            try {
              let assetPayload = {
                Created_By: 0,
                Updated_By: 0,
                asset_amount:
                  userData?.body.statementAccounts["0"].currentBalance,
                asset_abreturn: "0",
                annual_growth_rate: "10",
                asset_broker_id: 0,
                asset_category_id: 40,
                asset_citytype: "0",
                asset_current_unit_price: "",
                asset_currency: false,
                user_asset_source: "broker",
                asset_epf_ismanual: "1",
                asset_folio_number: null,
                asset_footnote: null,
                asset_frequency: "1",
                asset_goal_link_id: 0,
                asset_goalname: null,
                asset_gold_karat: 0,
                asset_isActive: "1",
                asset_ismortgage: "0",
                asset_isperpetual: "3",
                asset_isallocation: false,
                asset_iselss: "1",
                asset_islinkable: true,
                asset_isrecurring: false,
                asset_isrented: "1",
                asset_maturity_amt: 0,
                asset_maturity_date: null,
                asset_member_id: member,
                asset_mf_end_date: null,
                asset_name: userData.body.statementAccounts["0"].bank,
                asset_pan: null,
                asset_payout_type: "1",
                asset_pin_code: "",
                asset_purchase_amount: "",
                asset_purchase_date: null,
                asset_rental_amount: "",
                asset_rental_income: null,
                asset_ror: "0",
                asset_sub_category_id: 61,
                asset_unique_code: "",
                asset_units: "",
                categorydetail: "Bank Balance",
                created_datetime: moment().format("DD/MM/YYYY"),
                employee_contribution: "",
                employer_contribution: "",
                fp_log_id: sessionData.current["data"]["fp_log_id"],
                installment_ispaid: "1",
                membername1: "",
                stock_mf: null,
                stock_name: null,
                subcategorydetail: "",
                totalinvestedvalue: "",
                totalpurchasevalue: "",
                totalmaturtiyamount: "",
                updated_datetime: moment().format("DD/MM/YYYY"),
                user_id: sessionData.current["data"]["id"],
                scheme_equityshare: {},
              };

              const res = await apiCall(
                '',
                assetPayload,
                true,
                false
              );

              if (res["error_code"] == "100") {
                try {
                  const currentDate = new Date();
                  const options = {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  };
                  const formattedDate = currentDate.toLocaleDateString(
                    "en-US",
                    options
                  );

                  let bankBalancePayload = {
                    url: ADVISORY_ADD_BANK_DATA,
                    data: {
                      bank_name: userData?.body?.statementAccounts["0"].bank,
                      member_name: membername,
                      mobile_number: bankAccounts.userId.replace(/[^0-9]/g, ""),
                      user_id: "" + sessionData.current["data"]["id"],
                      fp_log_id: "" + sessionData.current["data"]["fp_log_id"],
                      consent_id: consentID,
                      consent_handle: ConsentHandle,
                      cust_id: bankAccounts.userId,
                      daterange_from: dateRange.from,
                      daterange_to: dateRange.to,
                      asset_id: res.data.id,
                      updated_datetime: formattedDate,
                    },
                    method: "post",
                  };

                  const r = await fetchData(bankBalancePayload);
                  console.log("Error", r);

                  if (r["error_code"] == "100") {
                    console.log("Error", r);
                  }
                } catch (e) {
                  console.log("Error", e);
                }
              }
              console.log("Error", r);
            } catch (e) {
              console.log("Error", e);
            }
          }
        } catch (e) {
          console.log("Error", e);
        }
      } else {
        navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  const handleApprove = async () => {
    startLoader();
    //
    let linkedAccounts = getCookie("selectedAccounts");
    let bankAccounts = JSON.parse(commonEncode.decrypt(linkedAccounts));
    let handleId = getCookie("bankname");
    let consentHandle = JSON.parse(commonEncode.decrypt(handleId));
    let rid = uuidv1();

    try {
      let consent_request_details_payload = {
        header: {
          mid: rid,
          ts: new Date().toISOString().replace("Z", "+00:00"),
          sid: bankAccounts.sid,
          dup: "false",
          type: "urn:finvu:in:app:req.consentRequestDetails.01",
        },
        payload: {
          consentHandleId: consentHandle.handleId,
          userId: bankAccounts.userId,
        },
      };

      socket.send(JSON.stringify(consent_request_details_payload));
    } catch (e) {
      console.log("Error", e);
    }
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateAfterOneYear, setDateAfterOneYear] = useState(new Date());

  useEffect(() => {
    // Calculate the date after one year
    const oneYearLater = new Date(currentDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 2);
    setDateAfterOneYear(oneYearLater);
  }, [currentDate]);

  const formatDate = (date) => format(date, "do MMMM y");

  const navigate = useNavigate();

  const handleDeny = async () => {
    setOpenModalByName("consentDeny");
  };

  const handleBack = async () => {
    setOpenModalByName("exitConsent");
  };

  const handleOK = async () => {
    toastr.options.positionClass = "toast-bottom-left";
    toastr.success("Data fetched successfully");
    // socket.close();
    navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
  };

  return (
    <div>
      <HideHeader />
      <div
        className={`white-modal fn-redeem-modal ${Bankbalance.BanklistData} `}
      >
        <div className={`${Bankbalance.Accountnotfound}`}>
          <div className={`row ${Bankbalance.AccHeader}`}>
            <div className="col-md-1 col-2">
              {/* <Link
                to={
                  process.env.PUBLIC_URL +
                  "/datagathering/assets-liabilities/bank-account-mobile-number"
                }
              >
                <IoChevronBackCircleOutline className="btn-fintoo-back" />
              </Link> */}
              <button
                style={{ outline: "none", border: "none", background: "none" }}
                onClick={() => handleBack()}
              >
                <IoChevronBackCircleOutline className="btn-fintoo-back" />
              </button>
            </div>
            <div
              className={`col-md-10 ps-3 text-center col-9 pb-md-4 pb-2 pb-md-4 pb-2 ${Bankbalance.TextHeader}`}
            >
              Confirm Consent
            </div>
          </div>
          <div className={`${Bankbalance.bankaccnotfounfinfo}`}>
            <p className={`text-black ${Bankbalance.text}`}>
              Requested on {formatDate(currentDate)}
            </p>
            <p className={`${Bankbalance.accountholder}`}>
              {" "}
              <span className={`${Bankbalance.sss}`}>AA</span> handle{" "}
              <span className="UpiId">{userBankAccount?.userId}</span>{" "}
            </p>
          </div>
          <div className={`${Bankbalance.consentlabel}`}>
            <p>Fintoo requires your consent to access account information</p>
            <div className={`mt-1 ${Bankbalance.ListAccnotfind}`}>
              <ul>
                {/* <li className="text-black">
                  From {formatDate(currentDate)} to{" "}
                  {formatDate(dateAfterOneYear)}
                </li>
                <li className="text-black">
                  Information fetch upto 10 time a hour
                </li> */}
                <li>
                  <span className="text-black" style={{ fontWeight: "600" }}>
                    Start Date & End Date :
                  </span>{" "}
                  From {formatDate(currentDate)} to{" "}
                  {formatDate(dateAfterOneYear)}
                </li>
                <li>
                  <span className="text-black" style={{ fontWeight: "600" }}>
                    Information fetch :
                  </span>{" "}
                  Upto 3 times in a day
                </li>
                <li>
                  <span className="text-black" style={{ fontWeight: "600" }}>
                    Consent Requested On :
                  </span>{" "}
                  {formatDate(currentDate)}
                </li>
                <li>
                  <span className="text-black" style={{ fontWeight: "600" }}>
                    Purpose :
                  </span>{" "}
                  Aggregated Statement
                </li>
                <li>
                  <span className="text-black" style={{ fontWeight: "600" }}>
                    Account Information :
                  </span>{" "}
                  Profile, Summary, Transactions
                </li>
                <li>
                  <span className="text-black" style={{ fontWeight: "600" }}>
                    Data Store :
                  </span>{" "}
                  Until 12 months
                </li>
                <li>
                  <span className="text-black" style={{ fontWeight: "600" }}>
                    Consent Expiry :
                  </span>{" "}
                  {formatDate(dateAfterOneYear)}
                </li>
              </ul>
            </div>
            <div className="w-md-75">
              {userBankAccount && (
                <>
                  <div
                    className={`${Bankbalance.mobileNumberBox} ${Bankbalance.Radiobox}`}
                  >
                    <div
                      className={`align-items-center row ${styles.radio}`}
                      onClick={() => handleRadioClick(0)}
                    >
                      <div className="pt-0 col-md-12 d-flex align-items-center">
                        <div className="col-1">
                          <img
                            style={{ width: "2rem", height: "2rem" }}
                            className={`${Bankbalance.bankImg}`}
                            src={`${process.env.REACT_APP_STATIC_URL}${userBankLogo}`}
                            alt="Bank Name"
                          />
                        </div>
                        <div
                          className={`pt-0 col-8  ms-md-0 ms-3 ${Bankbalance.bankDetails}`}
                        >
                          <div className={`${Bankbalance.bankAccType}`}>
                            {userBankAccount.accType} ACCOUNT
                          </div>
                          <div className={`${Bankbalance.bankAccno}`}>
                            {userBankAccount.maskedAccNumber}
                          </div>
                          <div className={`${Bankbalance.bankName}`}>
                            {userBankAccount.fipName}
                          </div>
                        </div>
                        <div className="col-3" style={{ float: "right" }}>
                          <img
                            style={{ float: "right" }}
                            src={
                              selectedOption === 0
                                ? imagePath + "/static/assets/img/check_mark.svg"
                                : Unchecked
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={`${Bankbalance.alternateOption}`}>
            <button
              onClick={() => {
                if (flag) {
                  setOpenModalByName("bankRequest");
                  handleApprove();
                }
              }}
              disabled={!flag}
              style={{
                backgroundColor: flag ? "#042b62" : "grey",
                color: "white",
              }}
            >
              Approve
            </button>
            <div style={{color : "#042b62"}} className={`${Bankbalance.ExitBtn}`} onClick={handleDeny}>
              Deny
            </div>
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

      {userBankName && (
        <Modal
          backdrop="static"
          show={openModalByName == "bankRequest"}
          className="white-modal fn-redeem-modal"
          onHide={() => {
            setOpenModalByName("ApprovedConsent");
          }}
        >
          {stepCount == 0 && (
            <>
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
                  Fintoo has Requested data from {userBankName}
                </p>
                <p
                  style={{ whiteSpace: "nowrap" }}
                  className={`${Bankbalance.LoadContentdes}`}
                >
                  This May Take 80 to 90 Seconds. We will Notify You Once The
                  Data Received From {userBankName}
                </p>
              </div>
            </>
          )}
        </Modal>
      )}

      <Modal
        centered
        backdrop="static"
        show={openModalByName == "ApprovedConsent"}
        onHide={() => {
          setOpenModalByName("");
        }}
      >
        {stepCount == 0 && (
          <>
            <div className={`${Bankbalance.ApprovedConsent}`}>
              <div className={`text-center ${Bankbalance.modalHeader}`}>
                Consent{" "}
                {userBalancePayload ? <>Approved</> : <>Under Process</>}
              </div>
              <div className={`${Bankbalance.ApprovedConsentData}`}>
                {}
                <div>
                  {userBalancePayload ? (
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/DG/ApprovedConsent.svg"
                      }
                    />
                  ) : (
                    <>
                      <img
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/DG/ConsentDenied.png"
                        }
                        style={{ width: "200px" }}
                      />
                    </>
                  )}
                </div>
                <div className={`${Bankbalance.ApprovedConsentcontent}`}>
                  {userBalancePayload ? (
                    <>
                      <div>
                        Data Received From {userBalancePayload.bankName}
                      </div>
                      <div>Press OK to Continue.</div>
                    </>
                  ) : (
                    <div>
                      It is taking longer than usual to fetch your data. We will
                      notify you once your consent is approved by the bank.
                    </div>
                  )}
                </div>
              </div>
              {/* <div className={`mt-4 ${Bankbalance.alternateOption}`}>
                <button
                  style={{ padding: "10px 38px" }}
                  onClick={() => {
                    setOpenModalByName("");
                    navigate(
                      `${process.env.PUBLIC_URL}/datagathering/assets-liabilities?success=1&amount=3000`
                    );
                  }}
                >
                  OK
                </button>
              </div> */}
              <div className={`mt-4 ${Bankbalance.alternateOption}`}>
                <button
                  style={{ padding: "10px 38px" }}
                  onClick={() => {
                    setOpenModalByName("");
                    if(accountBalance == ""){
                      navigate(
                        `${process.env.PUBLIC_URL}/datagathering/assets-liabilities`
                      );
                    }
                    else{
                    navigate(
                      `${process.env.PUBLIC_URL}/datagathering/assets-liabilities?success=1&isbank=1&amount=${accountBalance}`
                    );
                    }
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* For Consent Denied */}

      <Modal
        className="popupmodal2 Consent_Denied_popup"
        centered
        show={openModalByName === "consentDeny"} // Use '===' for comparison
        onHide={() => {
          setOpenModalByName("");
        }}
      >
        <Modal.Header className="text-center">
          <div
            className="modal-title text-center  w-100"
            style={{ fontWeight: "bold" }}
          >
            Consent Denied
          </div>
        </Modal.Header>
        <div className={`p-4 d-grid place-items-center align-item-center`}>
          <div className=" HeaderModal">
            <div className={`${Bankbalance.modalDesText}`}>
              Are you sure you want to denied the consent? <br /> You are almost
              Done.
            </div>
          </div>
          <div className="d-flex mt-4 ButtonBx justify-content-center pb-2">
            <div>
              <button
                style={{ fontSize: "1rem" }}
                className={`outline-btn m-2 ${Bankbalance.Buttons}`}
              >
                <Link
                  className="text-decoration-none"
                  to={
                    process.env.PUBLIC_URL + "/datagathering/assets-liabilities"
                  }
                >
                  Yes
                </Link>
              </button>
              <button
                onClick={() => {
                  setOpenModalByName("");
                }}
                style={{ fontSize: "1rem" }}
                className={`outline-btn m-2 ${Bankbalance.Buttons}`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* For Exit confirmation */}
      <Modal
        className="popupmodal2 Consent_Denied_popup"
        centered
        show={openModalByName === "exitConsent"}
        onHide={() => {
          setOpenModalByName("");
        }}
      >
        <Modal.Header className="text-center">
          <div
            className="modal-title text-center  w-100"
            style={{ fontWeight: "bold" }}
          >
            Exit Confirmation
          </div>
        </Modal.Header>
        <div className={`p-4 d-grid place-items-center align-item-center`}>
          <div className=" HeaderModal">
            <div className={`${Bankbalance.modalDesText}`}>
              Are you sure you want to leave? <br /> Your changes might not be
              saved.
            </div>
          </div>
          <div className="d-flex mt-4 ButtonBx justify-content-center pb-2">
            <div>
              <button
                style={{ fontSize: "1rem" }}
                className={`outline-btn m-2 ${Bankbalance.Buttons}`}
              >
                <Link
                  className="text-decoration-none"
                  to={
                    process.env.PUBLIC_URL + "/datagathering/assets-liabilities"
                  }
                >
                  Yes
                </Link>
              </button>
              <button
                onClick={() => {
                  setOpenModalByName("");
                }}
                style={{ fontSize: "1rem" }}
                className={`outline-btn m-2 ${Bankbalance.Buttons}`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmConsent;
