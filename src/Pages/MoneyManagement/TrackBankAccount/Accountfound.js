import React, { useState, useContext, useEffect } from "react";
import Styles from "../moneymanagement.module.css";
import style from "../style.module.css";
import Header from "./Header";
import { Modal, Form } from "react-bootstrap";
import socket, { onMessageHandler } from "./socket";
import * as toastr from "toastr";
import { useData } from '../context/DataContext';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { FINVU_BASE_API_URL, FINVU_USER_ID, FINVU_PASSWORD, FINVU_AAID, FINVU_TEMPLATE_NAME } from "../../../constants";
import {
  getMemberId,
  getUserId,
  removeMemberId,
  setFpUserDetailsId,
  setMemberId,
  setUserId,
  getParentUserId,
  getItemLocal
} from "../../../common_utilities";
import commonEncode from "../../../commonEncode";
import { checkForDuplicateAccount, fetchTrackedBankDetails as fetchTrackedBankDetailsFun } from "../../../FrappeIntegration-Services/services/money-management-api/moneyManagementService";


const Accountfound = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const dispatch = useDispatch();
  const { sidData, setRes, setDataDict, bankIdDetails, mob_no, setaccDiscData, accDiscData, setLinkedAccData, linkedAccData, setSecondAccountHandleId, secondAccHandleId, setMergeAccountDetails, mergeAccDetails, setHandleIdfromConsent, handleIdfromConsent, setTrackMonth, trackMonth } = useData();
  const { v4: uuidv4 } = require("uuid");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [currentUserIds, setCurrentUserIds] = useState([]);
  const [fetchTrackBankData, setFetchTrackBankData] = useState([]);
  const [duplicateAccountData, setDuplicateAccountData] = useState([]);
  const [duplicateFlag, setDuplicateFlag] = useState(false);
  const [allmemberids, setAllMemberIds] = useState([]);


  const mergedDetailsList = [];
  let user_details = [];
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

  const getExpiryDate = (currentDate) => {
    let expiryDate = new Date(currentDate);
    expiryDate.setFullYear(currentDate.getFullYear() + 1);

    const formattedExpiryDate = `${expiryDate.getDate()}${getOrdinalSuffix(expiryDate.getDate())} ${getMonthName(
      expiryDate.getMonth()
    )}  ${expiryDate.getFullYear().toString()}`;

    return formattedExpiryDate;
  };

  const getMonthName = (monthIndex) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthIndex];
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const FetchTrackedBankDetails = async () => {
    var myHeaders = new Headers();
    const payload = {
      user_id: [
        getUserId()
      ]
    };
    try {
      const result = await fetchTrackedBankDetailsFun(payload);
      if (result.error_code === "100") {
        const filteredData = result.data.filter(entry => entry.mm_active_status === 1);
        setFetchTrackBankData(filteredData);
      } else {
        setFetchTrackBankData([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const DuplicateAccountCheckAPI = async () => {

    let allmember = getItemLocal("member");
    let allids = []
    for (const i of allmember) {
      allids.push(i['id']);
    }
    const filteredIds = allids.filter(id => id !== getUserId());
    setAllMemberIds(filteredIds);

    if (filteredIds.length >= 1) {
      // var myHeaders = new Headers();
      
      try {
        const result = await checkForDuplicateAccount(filteredIds);
        if (result.status_code == 200) {
          const filteredData = result.data.filter(entry => entry.mm_active_status === 1);
          setDuplicateAccountData(filteredData);
          return filteredData;
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    return [];
  };

  const accountDescoveryAPI = async () => {
    try {
      const account_discovery_payload = {
        "header": {
          "mid": "fcd2c56e-9414-11e8-9eb6-529269fb1459",
          "ts": (new Date().toISOString()).replace('Z', '+00:00'),
          "sid": sidData,
          "dup": "false",
          "type": "urn:finvu:in:app:req.discover.01"
        },
        "payload": {
          "ver": "1.1.2",
          "timestamp": (new Date().toISOString()).replace('Z', '+00:00'),
          "txnid": "f8d5e43c-4851-4f1f-b845-ad663d0b6026",
          "Customer": {
            "id": mob_no + "@finvu",
            "Identifiers": [
              {
                "category": "STRONG",
                "type": "MOBILE",
                "value": mob_no
              }
            ]
          },
          "FIPDetails": {
            "fipId": bankIdDetails.fipId,
            "fipName": bankIdDetails.fipName
          },
          "FITypes": [
            "DEPOSIT",
            "RECURRING_DEPOSIT",
            "TERM-DEPOSIT"
          ]
        }
      }
      socket.send(JSON.stringify(account_discovery_payload));
    } catch (error) {
      console.error(
        "An error occurred during Account Discovery:",
        error.message
      );
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Account Discovery unsuccessful");
    }
  };

  const trackAccount = async (type) => {
    try {
      const rid = type + "-" + uuidv4();
      try {
        let track_account_payload = {
          header: {
            mid: "fcd2c56e-9414-11e8-9eb6-529269fb1459",
            ts: new Date().toISOString().replace("Z", "+00:00"),
            sid: sidData,
            dup: false,
            type: "urn:finvu:in:app:req.userLinkedAccount.01"
          },
          payload: {
            userId: mob_no + "@finvu",
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

  const checkMaskedAccNumber = (linkedAccData, accDiscData) => {
    const maskedAccNumbers = accDiscData.map(data => data.maskedAccNumber);
    const foundLinkedAcc = linkedAccData.find(account => maskedAccNumbers.includes(account.maskedAccNumber));


    for (const linkedAccount of linkedAccData) {
      for (const discoveredData of accDiscData) {
        if (linkedAccount.maskedAccNumber === discoveredData.maskedAccNumber) {
          const mergedDetails = {
            linkRefNumber: linkedAccount.linkRefNumber,
            accType: discoveredData.accType,
            accRefNumber: linkedAccount.accRefNumber,
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

  const accountLinkingAPI = async (filteredAccDiscData) => {
    let Accounts = [];
    if (filteredAccDiscData) {
      Accounts = filteredAccDiscData;
    } else {
      Accounts = accDiscData;
    }
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
            "Accounts": Accounts
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


  const handleTrackAccount = () => {
    if (selectedAccounts.length === 0) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Please select an account");
    } else {
      nextFlowCheck();
    }
  };


  const nextFlowCheck = () => {
    const trackSelectedAccounts = () => {
    };
    trackSelectedAccounts();
    if (linkedAccData && selectedAccounts) {
      const get_masked_details = checkMaskedAccNumber(linkedAccData, selectedAccounts);
      if (get_masked_details) {
        let mergeDetailsMaskedAccNumbers = mergedDetailsList.map(acc => acc.maskedAccNumber);
        // let selectedAccMaskedAccNumbers = selectedAccounts.map(acc => acc.maskedAccNumber);
        if (new Set(mergeDetailsMaskedAccNumbers).size === selectedAccounts.length) {
          consentRequestDetailsAPI();
          props.onProceedClick(2);
        } else {
          const maskedAccNumbersToRemove = mergedDetailsList.map(detail => detail.maskedAccNumber);

          const filteredAccDiscData = selectedAccounts.filter(data =>
            !maskedAccNumbersToRemove.includes(data.maskedAccNumber)
          );
          setaccDiscData(filteredAccDiscData);
          // filteredAccDiscData;
          accountLinkingAPI(filteredAccDiscData);
          props.onProceedClick();
        }

      }
      else {
        setaccDiscData(selectedAccounts);
        accountLinkingAPI(selectedAccounts);
        props.onProceedClick();
      }

    } else {
      setaccDiscData(selectedAccounts);
      accountLinkingAPI(selectedAccounts);
      props.onProceedClick();
    }

  };

  const handleCheckboxChange = (e, selectedData) => {
    const { checked } = e.target;
    const accNumber = selectedData.maskedAccNumber;

    const isAlreadySelected = selectedAccounts.some(
      (acc) => acc.maskedAccNumber === accNumber
    );

    if (checked && !isAlreadySelected) {
      setSelectedAccounts([...selectedAccounts, selectedData]);
    } else if (!checked && isAlreadySelected) {
      setSelectedAccounts(
        selectedAccounts.filter((acc) => acc.maskedAccNumber !== accNumber)
      );
    }
  };

  const getMemberIdFn = () => {
    // let isFamilySelected = Boolean(localStorage.getItem("family"));
    // if (!isFamilySelected) {
    //   const userId = getUserId();
    //   const userIdArray = [userId];
    //   return userIdArray;
    // } else {
    //   let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
    //   const idsArray = users.map(item => String(item.id));
    //   return idsArray;
    // }
  };


  useEffect(() => {
    user_details = getMemberIdFn();
    setCurrentUserIds(user_details);
    const processData = async () => {
      try {
        await FetchTrackedBankDetails();
      } catch (error) {
        console.error('Error:', error);
      }
    };
    processData();
    accountDescoveryAPI();
    trackAccount();
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
        setShowLoader(true);
      } else if (data.header.type == "urn:finvu:in:app:res.discover.01") {
        setLoadingStatus(true);
        if (data.payload.status == "SUCCESS") {
          if (data.payload.DiscoveredAccounts) {
            (async () => {
              let dupResponse = [];
              dupResponse = await DuplicateAccountCheckAPI();
              const maskedAccNumbersToCheck = data.payload.DiscoveredAccounts.map(item => item.maskedAccNumber);
              const isPresent = maskedAccNumbersToCheck.some(maskedAccNumber =>
                dupResponse.some(item => item.mm_account_masked_id === maskedAccNumber)
              );
              setDuplicateFlag(isPresent);
            })();
          }

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
          // alert("failure");
          setaccDiscData(false);
          setRes(false);
          setDataDict(false);
        }
      } else if (data.header.type == "urn:finvu:in:app:res.userLinkedAccount.01") {
        setLinkedAccData(data.payload.LinkedAccounts);
        dispatch({ type: "SET_LINKED_ACCOUNT_DATA", payload: data.payload.LinkedAccounts });
        // if (data.payload.LinkedAccounts){
        //   const get_masked_details = checkMaskedAccNumber(data.payload.LinkedAccounts, accDiscData);
        // }
        // toastr.options.positionClass = "toast-bottom-left";
        // toastr.success("Found Linked Accounts");
      } else if (data.header.type == "urn:finvu:in:app:res.consentRequestDetailsResponse.01") {
        setHandleIdfromConsent(data.payload.consentHandleId);
      } else if (data.header.type == "urn:finvu:in:app:res.accountConsentRequest.01") {
      }
      else if (data.payload['message'] == "otp reference and/or otp not set or has invalid values") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Enter OTP");
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Invalid OTP");
      }
    };
  }, []);

  if (loadingStatus) {
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
            {accDiscData && accDiscData.length > 0 ? (
              <Header
                title={"Yay! we found your accounts"}
                decscription={"Select and confirm the accounts you want to track!"}
              />
            ) : (
              <Header
                title={"Oops! We couldn't find any account. Please click the back icon and select another bank."}
              // decscription={"Select and confirm the accounts you want to track!"}
              />
            )}
          </div>

          <div className={`mt-md-5 `}>
            <div className={`${Styles.accountfoundbox}`}>
              {accDiscData && accDiscData.length > 0 ? (
                <div
                  className="d-flex align-items-center"
                  style={{
                    borderBottom: "1px solid #E5E7EB",
                    paddingBottom: "1rem",
                  }}
                >
                  <div className={`${Styles.bankimg}`}>
                    <img width={60} src={process.env.REACT_APP_STATIC_URL +
                      `${bankIdDetails.image}`} alt="bank_logo" />
                  </div>
                  <div className={`${Styles.bank_Details}`}>
                    <div className={`${Styles.bank_name}`}>{bankIdDetails.fipName}</div>
                    <div
                      style={{
                        color: "#042b62",
                        fontSize: "1rem",
                        fontWeight: "400",
                      }}
                    >
                      {accDiscData.length} account(s) has been identified for tracking
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="d-flex align-items-center"
                  style={{
                    borderBottom: "1px solid #E5E7EB",
                    paddingBottom: "1rem",
                  }}
                >
                  <div className={`${Styles.bankimg}`}>
                    <img width={60} src={process.env.REACT_APP_STATIC_URL +
                      `${bankIdDetails.image}`} alt="bank_logo" />
                  </div>
                  <div className={`${Styles.bank_Details}`}>
                    <div className={`${Styles.bank_name}`}>{bankIdDetails.fipName}</div>
                    <div
                      style={{
                        color: "#042b62",
                        fontSize: "1rem",
                        fontWeight: "400",
                      }}
                    >
                      No account has been identified for tracking
                    </div>
                  </div>
                </div>
              )}
              {accDiscData && accDiscData.length > 0 ? (
                accDiscData.map((data, index) => (
                  <div
                    className="d-flex justify-content-between"
                    style={{ paddingTop: "1rem" }}
                  >
                    <div>
                      <div className={`${Styles.account_number}`}>
                        <span>{data.accType} Account -</span> <span>{data.maskedAccNumber}</span>
                      </div>
                      <div className={`${Styles.text_description}`}>
                        {duplicateFlag ? (
                          <span style={{ color: 'red' }}>This account is already linked to one of your family members. You cannot link it again to your own account.</span>
                        ) : (
                          linkedAccData && linkedAccData.length > 0 &&
                            linkedAccData.some(acc => acc.maskedAccNumber === data.maskedAccNumber) &&
                            fetchTrackBankData && fetchTrackBankData.length > 0 &&
                            fetchTrackBankData.some(acc => acc.mm_account_masked_id === data.maskedAccNumber)
                            ? "You are already tracking this account with us"
                            : ""
                        )}
                      </div>
                    </div>
                    <div>
                      {!duplicateFlag && (
                        <input
                          type="radio"
                          onChange={(e) => handleCheckboxChange(e, data)}
                          checked={selectedAccounts.some(acc => acc.maskedAccNumber === data.maskedAccNumber)}
                          style={{
                            width: '20px',
                            height: '20px',
                            border: `2px solid ${selectedAccounts.some(acc => acc.maskedAccNumber === data.maskedAccNumber) ? '#4CAF50' : '#042b62'}`,
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={`${Styles.notfoundnumber}`}>
                  We could not find any account with your mobile number{" "}
                  <span className={`${Styles.mobileNUmber}`}>+91-{mob_no}</span>{" "}
                  {/* <span
                      onClick={openPopup}
                      className={`${Styles.DatainfoIcon}`}
                    >
                      <IoMdInformationCircleOutline />{" "}
                    </span> */}
                </div>
              )}
            </div>
            {!accDiscData ? (
              <div
                onClick={() => {
                  props.onAccountNotFound();
                }}
                className={`${Styles.changenumberText}`}
              >
                Change Number
              </div>
            ) : (
              <div></div>
            )}

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
            {accDiscData && accDiscData.length > 0 ? (
              accDiscData.map((data, index) => (
                <div className={`${Styles.ContinueButton}`}>
                  <button className={`d-md-none ${Styles.mobileBackbtn}`} onClick={() => {
                    props.onBackProceedClick();
                  }}>Back</button>
                  {!duplicateFlag && (
                    <button onClick={handleTrackAccount}>Track Account</button>
                  )}
                </div>
              ))
            ) : (
              <div className={`${Styles.ContinueButton}`}>
                <button className={`d-md-none ${Styles.mobileBackbtn}`} onClick={() => {
                  props.onBackProceedClick();
                }}>Back</button>
              </div>
            )}
          </div>
        </div>

        {/* <Modal
          className={`${style.moneyManagementModal}`}
          dialogClassName={`${style.moneyManagementModalDialog}`}
          centered
          show={isPopupOpen}
          size="lg"
        >
          <div className={`${Styles.moneyManagementBankerror}`}>
            <div className={`${style.popuiContainer}`}>
              <div style={{ position: "relative" }} className={`w-100 ${style.popuiHeader}`}>
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
                  <img onClick={closePopup} style={{ width: "15px" }} src={process.env.REACT_APP_STATIC_URL +
                    "media/MoneyManagement/Close.svg"} />
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
        </Modal> */}
      </div>
    );
  }
  else {
    return (
      <Header
        title={"Please wait as we are fetching your account details.."}
      />
    )
  }
};

export default Accountfound;
