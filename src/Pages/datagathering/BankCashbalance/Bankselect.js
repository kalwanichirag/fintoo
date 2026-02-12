import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import Bankbalance from "../BankCashbalance/Bankbalance.module.css";
import { MdOutlineNavigateNext } from "react-icons/md";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import {
  apiCall,
  createCookie,
  fetchData,
  getCookie,
  getItemLocal,
  getParentUserId,
  getUserId,
} from "../../../common_utilities";
import { FiSearch } from "react-icons/fi";
import { CHECK_SESSION, FINVU_BASE_API_URL, FINVU_PASSWORD, FINVU_USER_ID } from "../../../constants";
import socket, { onMessageHandler } from "../BankCashbalance/socket";
import commonEncode from "../../../commonEncode";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Styles from "../AssetsLibDG/NSDL_CSDL/style.module.css";

import { v1 as uuidv1 } from "uuid";
import FintooLoader from "../../../components/FintooLoader";
import { getBankList } from "../../../FrappeIntegration-Services/services/money-management-api/moneyManagementService";

const Bankselect = (props) => {
  const bankNamess = [
    {
      fipId: "AUBank-FIP",
      fipName: "AUBank",
      logo: "media/bank_logo/AUB.png",
    },
    {
      fipId: "AXIS001",
      fipName: "Axis Bank",
      logo: "media/bank_logo/AXC.png",
    },
    {
      fipId: "BARBFIP",
      fipName: "BANK OF BARODA",
      logo: "media/bank_logo/BBC.png",
    },
    {
      fipId: "BOI-FIP",
      fipName: "Bank Of India",
      logo: "media/bank_logo/BOI.png",
    },
    {
      fipId: "BOM_FIP",
      fipName: "Bank of Maharashtra",
      logo: "media/bank_logo/BOM.png",
    },
    {
      fipId: "CENTRALFIP",
      fipName: "Central Bank",
      logo: "media/bank_logo/CBI.png",
    },
    {
      fipId: "CUBFIP",
      fipName: "City Union Bank",
      logo: "media/bank_logo/CIT.png",
    },
    {
      fipId: "FDRLFIPPROD",
      fipName: "FEDERAL BANK",
      logo: "media/bank_logo/FBK.png",
    },
    {
      fipId: "fiplive@canarabank",
      fipName: "Canara Bank",
      logo: "media/bank_logo/CNB.png",
    },
    {
      fipId: "fiplive@fincarebank",
      fipName: "Fincare Small Finance Bank",
      logo: "media/bank_logo/FNC.png",
    },
    {
      fipId: "HDFC-FIP",
      fipName: "HDFC Bank",
      logo: "media/bank_logo/HDF.png",
    },
    {
      fipId: "ICICI-FIP",
      fipName: "ICICI Bank",
      logo: "media/bank_logo/ICI.png",
    },
    {
      fipId: "idbibank-fip",
      fipName: "IDBI Bank Ltd.",
      logo: "media/bank_logo/IDB.png",
    },
    {
      fipId: "IDFCFirstBank-FIP",
      fipName: "IDFC FIRST BANK",
      logo: "media/bank_logo/IDN.png",
    },
    {
      fipId: "fiplive@indusind",
      fipName: "IndusInd Bank Ltd.",
      logo: "media/bank_logo/IDS.png",
    },
    {
      fipId: "IBFIP",
      fipName: "Indian Bank",
      logo: "media/bank_logo/INB.png",
    },
    {
      fipId: "IOB-FIP",
      fipName: "Indian Overseas Bank",
      logo: "media/bank_logo/IOB.png",
    },
    {
      fipId: "KarurVysyaBank-FIP",
      fipName: "Karur Vysya Bank",
      logo: "media/bank_logo/KVB.png",
    },
    {
      fipId: "KBL-FIP",
      fipName: "Karnataka Bank Ltd",
      logo: "media/bank_logo/KBL.png",
    },
    {
      fipId: "KotakMahindraBank-FIP",
      fipName: "Kotak Mahindra Bank",
      logo: "media/bank_logo/KKBK.png",
    },
    {
      fipId: "MGBFIP",
      fipName: "Maharashtra Gramin Bank",
      logo: "media/bank_logo/MGB.png",
    },
    {
      fipId: "PNB-FIP",
      fipName: "Punjab National Bank",
      logo: "media/bank_logo/PNB.png",
    },
    {
      fipId: "PSFIP",
      fipName: "Punjab and Sind Bank",
      logo: "media/bank_logo/PSB.png",
    },
    {
      fipId: "sbi-fip",
      fipName: "STATE BANK OF INDIA",
      logo: "media/bank_logo/SBI.png",
    },
    {
      fipId: "UBI-FIP",
      fipName: "Union Bank Of India",
      logo: "media/bank_logo/UBI.png",
    },
    {
      fipId: "UCOB-FIP",
      fipName: "UCO Bank",
      logo: "media/bank_logo/UCO.png",
    },
    {
      fipId: "YESB-FIP",
      fipName: "Yes Bank Ltd",
      logo: "media/bank_logo/YBK.png",
    },
  ];

  const [bankNames, setBankNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const sessionData = useRef("");
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [handleId, setHandleId] = useState("");

  const [otpReference, setOtpReference] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [customNumber, setCustomNumber] = useState("");
  const [isAddingCustomNumber, setIsAddingCustomNumber] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [openModalByName, setOpenModalByName] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchBankListData = async () => {
    try {
      const result = await getBankList();
      if (result.status_code === 200) {
        const allBanks = result.data;

        const popular = [];
        const others = [];

        allBanks.forEach((item) => {
          const bank = {
            fipId: item.fipId,
            fipName: item.fipName,
            logo: `media/bank_logo/${item.logo}`,
            hasLowSuccessRate: item.lowSuccessRate,
          };

          if (item.isPopular === 1) {
            popular.push(bank);
          } else {
            others.push(bank);
          }
        });
        popular.sort((a, b) => a.fipName.localeCompare(b.fipName));
        others.sort((a, b) => a.fipName.localeCompare(b.fipName));

        const combined = [...popular, ...others];
        setBankNames(combined);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
    socket.onopen = (event) => {
      const cb_s = document.createElement("script");
      const cb_src =
        "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js";
      cb_s.setAttribute("src", cb_src);
      document.body.appendChild(cb_s);
    };

    socket.onmessage = (event) => {
      const data = onMessageHandler(event);

      const eventdata = JSON.stringify(event);

      if (data.payload.status == "SEND") {
        setOtpReference(data.payload.otpReference);
        toastr.options.positionClass = "toast-bottom-left";
        // toastr.success("OTP sent successfully");
        setOpenModalByName("mobileOtp");
      } else if (data.payload.status == "SUCCESS") {
        toastr.options.positionClass = "toast-bottom-left";
        // toastr.success("OTP verified successfully");
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

                let rid = uuidv1();

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
                    txnid: uuidv1(),
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
                      60
                    )
                  );

                  if (accountData.payload.status == "SUCCESS") {
                    setIsLoading(false);
                    navigate(
                      `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-select/`
                    );
                  } else if (accountData.payload.status == "RECORD-NOT-FOUND") {
                    navigate(
                      `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-not-found/`
                    );
                  } else {
                    toastr.options.positionClass = "toast-bottom-left";
                    toastr.error(accountData.payload.message);
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

        // try {
        //   let bankname = JSON.parse(
        //     commonEncode.decrypt(getCookie("bankname"))
        //   );

        //   let rid = uuidv1();

        //   let account_discovery_payload = {
        //     header: {
        //       mid: rid,
        //       ts: new Date().toISOString().replace("Z", "+00:00"),
        //       sid: data.header.sid,
        //       dup: false,
        //       type: "urn:finvu:in:app:req.discover.01",
        //     },

        //     payload: {
        //       ver: "1.1.2",
        //       timestamp: new Date().toISOString().replace("Z", "+00:00"),
        //       txnid: uuidv1(),
        //       Customer: {
        //         id: data.payload.userId,
        //         Identifiers: [
        //           {
        //             category: "STRONG",
        //             type: "MOBILE",
        //             value: data.payload.userId.replace(/[^0-9]/g, ""),
        //           },
        //         ],
        //       },
        //       FIPDetails: {
        //         fipId: bankname.fipId,
        //         fipName: bankname.fipName,
        //       },
        //       FITypes: ["DEPOSIT", "RECURRING_DEPOSIT", "TERM-DEPOSIT"],
        //     },
        //   };

        //   socket.send(JSON.stringify(account_discovery_payload));

        //   socket.onmessage = (event) => {
        //     const accountData = onMessageHandler(event);
        //     commonEncode.encrypt(
        //       createCookie(
        //         "discoveredaccounts",
        //         commonEncode.encrypt(
        //           JSON.stringify(accountData.payload.DiscoveredAccounts)
        //         ),
        //         60
        //       )
        //     );

        //     if (accountData.payload.status == "SUCCESS") {
        //       navigate(
        //         `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-select/`
        //       );
        //     } else if (accountData.payload.status == "RECORD-NOT-FOUND") {
        //       navigate(
        //         `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-not-found/`
        //       );
        //     } else {
        //       toastr.options.positionClass = "toast-bottom-left";
        //       toastr.error("Something went wrong");
        //       navigate(
        //         `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`
        //       );
        //     }
        //   };
        // } catch (e) {
        // }
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Invalid OTP");
        navigate(
          `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-list/`
        );
      }
    };
  }, []);

  const fetchOTP = async (session, fipId, fipName, logo) => {
    
    let number = getCookie("user");
    let mobileNo = number;
    setCustomNumber(mobileNo);

    try {
      const rid = uuidv1();
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
        commonEncode.encrypt(
          createCookie("token", commonEncode.encrypt(JSON.stringify(token, 15)))
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

            let bankname = {
              fipName: fipName,
              fipId: fipId,
              handleId: responseData.body.ConsentHandle,
              fipLogo: logo,
            };
            commonEncode.encrypt(
              createCookie(
                "bankname",
                commonEncode.encrypt(JSON.stringify(bankname)),
                15
              )
            );
          };
          socketCreation();
        }
      } else {
        console.error("Error", loginResponse.status);
      }
    } catch (error) {
      console.error("Error", error.message);
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
          otpReference: otpReference,
          otp: otp,
        },
      };

      if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify(verifyOTPPayload));
        // setIsLoading(true);
        // window.location.href = `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-list/`;

      } else {
        console.error("WebSocket is not open. Cannot send data.");
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("OTP verification unsuccessful");
      }
    } catch (error) {
      console.error("Error", error.message);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("OTP verification unsuccessful");
    }
  };

  const handleYesClick = async () => {
    fetchOTP(
      sessionData.current,
      modalData.fipId,
      modalData.fipName,
      modalData.logo
    );
    setOpenModalByName("");
  };

  const handleNoClick = async () => {
    setOpenModalByName("");
  };


  useEffect(() => {
    fetchBankListData();
  }, []);

  // useEffect(() => {
  //   socket.onopen = (event) => {

  //   };
  //   socket.onmessage = (event) => {
  //     const data = onMessageHandler(event);

  //     if (data.payload.status == "SUCCESS") {
  //       setAccounts(data.payload.DiscoveredAccounts);
  //       commonEncode.encrypt(
  //         createCookie(
  //           "discoveredaccounts",
  //           commonEncode.encrypt(
  //             JSON.stringify(data.payload.DiscoveredAccounts)
  //           ),
  //           15
  //         )
  //       );
  //       navigate(
  //         `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-select/`
  //       );
  //       toastr.options.positionClass = "toast-bottom-left";
  //       toastr.success("Account(s) found");
  //     } else {
  //       toastr.options.positionClass = "toast-bottom-left";
  //       toastr.error("Could not find account(s)");
  //       navigate(
  //         `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-not-found/`
  //       );
  //     }
  //   };
  //   socket.onerror = (event) => {
  //     // Handle WebSocket errors here
  //     console.error("OTP WebSocket error:", event);
  //   };
  // }, []);

  // const accountDiscover = async (f_id, f_name) => {

  //   // let bankAccounts = JSON.parse(
  //   //   commonEncode.decrypt(getCookie("selectedAccounts"))
  //   // );
  //   let payload = JSON.parse(commonEncode.decrypt(getCookie("payload")));

  //   const rid = uuidv1();
  //   const ts = new Date().toISOString();

  //   try {
  //     let account_discovery_payload = {
  //       header: {
  //         mid: rid,
  //         ts: new Date().toISOString().replace("Z", "+00:00"),
  //         sid: payload.sid,
  //         dup: false,
  //         type: "urn:finvu:in:app:req.discover.01",
  //       },

  //       payload: {
  //         ver: "1.1.2",
  //         timestamp: new Date().toISOString().replace("Z", "+00:00"),
  //         txnid: uuidv1(),
  //         Customer: {
  //           id: payload.userId,
  //           Identifiers: [
  //             {
  //               category: "STRONG",
  //               type: "MOBILE",
  //               value: payload.userId.replace(/[^0-9]/g, ""),
  //             },
  //           ],
  //         },
  //         FIPDetails: {
  //           fipId: f_id,
  //           fipName: f_name,
  //         },
  //         FITypes: ["DEPOSIT", "RECURRING_DEPOSIT", "TERM-DEPOSIT"],
  //       },
  //     };

  //     socket.send(JSON.stringify(account_discovery_payload));

  //     let bankpaylod = {
  //       fipId: f_id,
  //       fipName: f_name,
  //     };

  //     commonEncode.encrypt(
  //       createCookie(
  //         "bankname",
  //         commonEncode.encrypt(JSON.stringify(bankpaylod)),
  //         15
  //       )
  //     );
  //   } catch (e) {
  //   }
  // };

  const filteredBanks = bankNames?.filter((bank) =>
    bank.fipName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <FintooLoader isLoading={isLoading} />
      <HideHeader />
      <div
        className={`white-modal fn-redeem-modal   ${Bankbalance.BanklistData}`}
      >
        <div className={`row container-fluid ${Bankbalance.banklistLayout}`}>
          <div className="col-md-5 m-auto d-flex justify-content-center">
            <div>
              <img
                className={`img-fluid d-grid place-items-center ${Bankbalance.BankLeftImg}`}
                src={
                  process.env.REACT_APP_STATIC_URL + "media/DG/BankLayout.png"
                }
              />
            </div>
          </div>
          <div className="col-md-7 ">
            <div className="row">
              <div className="col-1 pt-1">
                <Link
                  style={{ float: "right" }}
                // to={
                //   process.env.PUBLIC_URL + "/datagathering/assets-liabilities"
                // }
                >
                  <IoChevronBackCircleOutline className="btn-fintoo-back" />
                </Link>
              </div>
              <div className="col-md-7">
                <div>
                  <div className={`${Bankbalance.banklabel}`}>
                    Select Your Bank
                  </div>
                  <div className={`${Bankbalance.banklabeltext}`}>
                    Track your balance at Fintoo with 100% accuracy
                  </div>
                </div>
                <div className="container">
                  <div className="row justify-content-center">
                    <div className={`col-md-12 ${Bankbalance.bankListSection}`}>

                      <div className="input-group my-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search banks..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            outline: "none",
                            boxShadow: "none"
                          }}
                        />
                        <span className="input-group-text bg-white border-start-0">
                          <FiSearch />
                        </span>
                      </div>

                      <div className={`${Bankbalance.listofBanks}`}>
                        {filteredBanks.length === 0 ? (
                          <div className="text-center text-muted py-5">
                            <FiSearch size={48} className="mb-3 text-secondary" />
                            <h5>No bank found</h5>
                            <p className="small">Try a different name or check your spelling.</p>
                          </div>
                        ) : (
                          filteredBanks.map((bankName, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                if (
                                  bankName.fipId === "sbilife-fip" ||
                                  bankName.fipId === "AUBank-FIP" ||
                                  bankName.fipId === "CUBFIP" ||
                                  bankName.fipId === "PSFIP" ||
                                  bankName.fipId === "UBI-FIP" ||
                                  bankName.fipId === "KotakMahindraBank-FIP"
                                ) {
                                  setOpenModalByName("warning");
                                  setModalData({ ...bankName });
                                } else {
                                  fetchOTP(
                                    sessionData.current,
                                    bankName.fipId,
                                    bankName.fipName,
                                    bankName.logo
                                  );
                                }
                              }}
                            >
                              <div
                                className={`d-flex justify-content-between align-items-center pointer ${Bankbalance.bankbox}`}
                              >
                                <div className="d-flex align-items-center">
                                  <div>
                                    <div>
                                      <img
                                        className={`${Bankbalance.bankImg}`}
                                        width={40}
                                        src={process.env.REACT_APP_STATIC_URL + bankName.logo}
                                        alt={bankName.fipName}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = process.env.REACT_APP_STATIC_URL + "media/bank_logo/HDF.png";
                                        }}
                                      />
                                    </div>

                                  </div>
                                  <div className={`${Bankbalance.bankName} ms-3`}>
                                    {bankName.fipName}
                                  </div>
                                </div>
                                <div className={`${Bankbalance.NextbtnProcess}`}>
                                  <MdOutlineNavigateNext />
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mt-3">
                  <div className={`${Bankbalance.thirdPartySection}`}>
                    Powered by RBI regulated Account Aggregator{" "}
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL + "media/DG/Finvu.png"
                      }
                      width={"60px"}
                    />
                  </div>
                </div>
              </div>
            </div>
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
      {/* For Low Success Rates For Bank */}
      <Modal
        className="popupmodal2"
        centered
        show={openModalByName === "warning"} // Use '===' for comparison
        onHide={() => {
          setOpenModalByName("");
        }}
      >
        <div className={`p-4 d-grid place-items-center align-item-center`}>
          <div>
            <center>
              <img
                src={process.env.REACT_APP_STATIC_URL + "media/DG/Warning_.svg"}
                width={150}
              />
            </center>
          </div>
          <div className={`${Bankbalance.modalTitletext}`}>
            Low Success Rates For Bank
            <div className="d-none">SBI Servers Are Currently Down</div>
          </div>
          <div className=" HeaderModal">
            <div className={`${Bankbalance.modalDesText}`}>
              We have observed that there is a low success rates for linking
              bank account for this bank for tracking purposes. You can continue
              to try linking.
              <div className="d-none">
                We have observed that SBI is currently facing an ecosystem wide
                problem in linking. Please try again later.
              </div>
            </div>
          </div>
          <div className="d-flex mt-4 ButtonBx justify-content-center pb-2">
            <div>
              <button
                style={{ fontSize: "1rem" }}
                className={`outline-btn m-2 ${Bankbalance.Buttons}`}
                onClick={() => handleNoClick()}
              >
                Cancel
              </button>
              <button
                style={{ fontSize: "1rem" }}
                className={`outline-btn m-2 ${Bankbalance.Buttons}`}
                onClick={() => handleYesClick()}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Bankselect;
