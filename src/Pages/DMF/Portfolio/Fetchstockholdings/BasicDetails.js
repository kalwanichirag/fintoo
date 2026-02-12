import React, { useState, useEffect } from "react";
import Styles from "./style.module.css"
import Select from 'react-select'
import { DATA_BELONGS_TO } from "../../../../constants";
import customStyles from "../../../../components/CustomStyles";
import { CHECK_SESSION } from "../../../../constants";
import { apiCall, getItemLocal, restApiCall, getParentUserId, createCookie, setUserId, fetchData, getParentUserDetails,  fetchEncryptData,getUserId } from "../../../../common_utilities";
import socket, { onMessageHandler } from "../../../datagathering/BankCashbalance/socket";
import commonEncode from "../../../../commonEncode";
import { useLocation } from "react-router-dom";
import * as toastr from "toastr";
import { useDispatch } from "react-redux";
import { CheckPanExists } from "../../../../FrappeIntegration-Services/services/financial-planning-api/externalApi";

const BasicDetails = (props) => {
    const dispatch = useDispatch();

    const [selectedMember, setSelectedMember] = useState({});
    const [ecasData, setEcasData] = useState([]);
    const [restHeaders, setRestHeaders] = useState({});
    const [allMembers, setAllMembers] = useState([]);
    const [panEditable, setPanEditable] = useState(false);
    const [mobEditable, setMobEditable] = useState(false);
    const [errors, setErrors] = useState({});
    const [sendDisabled, setSendDisabled] = useState(true);
    const [isPanRegistered, setIsPanRegistered] = useState(false);
    const { v4: uuidv4 } = require("uuid");
    const [handleId, setHandleId] = useState("");
    const [userId, setUserId] = useState("");
    const [pageurl, setPageurl] = useState(false);
    const location = useLocation();
    const [email, setEmail] = useState(null);
    useEffect(() => {
        if ("pathname" in location) {
            setPageurl(location.pathname);
        }
    }, [location]);

    useEffect(() => {
        // if (props.forpar) {
        //     fetchMemberDetails();
        // } else {
        //     fetchSmallcase();
        // }
        fetchMemberDetails();
    }, []);

    useEffect(() => {
        handleChange();
    }, [allMembers]);

    const findMobileErrors = () => {
        const newErrors = {};
        let regex = /^[6789]\d{9}$/;
        if (!selectedMember.mobile || selectedMember.mobile === "")
            newErrors.userMobile = "Please enter mobile number";
        else if (selectedMember.mobile.length !== 10)
            newErrors.userMobile = "Please enter valid mobile number";
        else if (!regex.test(selectedMember.mobile))
            newErrors.userMobile = "Please enter valid mobile number";
        else if (
            selectedMember.mobile ||
            regex.test(selectedMember.mobile) ||
            selectedMember.mobile.length == 10
        )
            newErrors.userMobile = "";
        return newErrors;
    };

    const findPANErrors = (enteredPAN = "", change_flag = "0") => {
        const newErrors = {};
        let regex = /^[A-Za-z]{3}[HPhp]{1}[A-Za-z]{1}\d{4}[A-ZHPa-zhp]{1}$/;
        var pan = "";
        if (change_flag == "1") {
          pan = enteredPAN;
        } else {
          pan = selectedMember.pan;
        }
    
        if (!pan || pan === "") {
          newErrors.userPan = "Please enter pan number!";
        } else if (pan.length !== 10) {
          newErrors.userPan = "Please enter valid pan number!";
        } else if (!regex.test(pan)) {
          newErrors.userPan = "Please enter valid pan number!";
        } else if (pan || regex.test(pan) || pan.length == 10) {
          // good pan
    
          newErrors.userPan = "";
        }
        return newErrors;
      };
    

    useEffect(() => {
        const mobileErrors = findMobileErrors();
        const panErrors = findPANErrors();
        if (
            !panEditable &&
            selectedMember.pan != "" &&
            selectedMember.pan != null
        ) {
            if (Object.keys(panErrors).length > 0) {
                setErrors((v) => ({ ...v, ...panErrors }));
            }
        }
        if (selectedMember.mobile != "" && selectedMember.mobile != null) {
            if (Object.keys(mobileErrors).length > 0) {
                setErrors((v) => ({ ...v, ...mobileErrors }));
            }
        }
    }, [selectedMember.pan, selectedMember.mobile]);

    const checksession = async () => {
        // let url = CHECK_SESSION;
        // let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
        // return await apiCall(url, data, true, false);
    };

    const fetchSmallcase = async () => {
        try {
            // // let sessionData = await //checksession();
            let sessionData = "";
            let reqdata = {
                fp_user_id: sessionData['data']['fp_user_id'] ? sessionData['data']['fp_user_id'] : "",
                fp_log_id: sessionData['data']['fp_log_id'] ? sessionData['data']['fp_log_id'] : "", //test2
                user_id: sessionData['data']['id'], //test
            };
            setUserId(sessionData['data']['id'])
            let checkData = await restApiCall(
                ADVISORY_FETCH_MEMBER_DATA,
                reqdata,
                ""
            );
            if (checkData.error_code == "100") {
                const a = checkData.data
                const b = checkData.valid_members
                const valid_member = a.filter(data => !b.includes(data.user_id))
                setEcasData(valid_member);
                if (valid_member.length > 0) {
                    const all = valid_member.map((v) => ({
                        name: v.first_name + " " + v.last_name,
                        id: v.id,
                        user_id: v.user_id,
                        pan: v.PAN,
                        mobile: v.alternate_mobile,
                        label: v.first_name + " " + v.last_name,
                        value: v.id,
                        fp_log_id: v.fp_log_id,
                        retirement_date: v.retirement_date
                    }));
                    setAllMembers([...all]);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const fetchMemberDetails = async () => {
        try {
            // const resp = await apiCall(, {
            //   user_id: getParentUserId(),
            //   data_belongs_to: DATA_BELONGS_TO,
            //   ecas: "1",
            // });
            const resp = await fetchData({
              method: "post",
              url:  '',
              data: {
                user_id: getParentUserId(),
                data_belongs_to: DATA_BELONGS_TO,
                // ecas: "1",
              },
            });
      
            const all = resp.data.map((v) => ({
              name: v.NAME ? v.NAME : v.NAME,
              id: v.id,
              fp_log_id: v.fp_log_id,
              parent_user_id: v.parent_user_id,
              pan: v.pan,
              mobile: v.mobile,
              email: v.fdmf_email,
              label: v.NAME ? v.NAME : v.fdmf_email,
              value: v.id,
              fp_user_id: v.fp_user_details_id,
            }));
            setAllMembers([...all]);
            if (!isFamilySelected()) {
              let sM = all.filter((v) => v.id == getUserId());
              handleChange({ ...sM[0] });
            }
          } catch (e) {
            console.log(e);
          }
    };

    const handleChange = async (e) => {
        try {
            if (Boolean(e) == false) {
                let member = allMembers;
                setSelectedMember({ ...member[0] });
                setPanEditable(
                    member[0].pan !== null && member[0].pan !== "" ? true : false
                );
                setMobEditable(
                    member[0].mobile !== null && member[0].mobile !== "" ? true : false
                );
                setSendDisabled(false);


            } else {
                setSelectedMember({ ...e });
                setPanEditable(e.pan !== null && e.pan !== "" ? true : false);
                setMobEditable(e.mobile !== null && e.mobile !== "" ? true : false);
                setErrors({});
                setSendDisabled(false);
            }
        } catch (e) { }
    };

    const handleMobileChange = (e) => {
        setSelectedMember({ ...selectedMember, mobile: e.target.value });
        if (e.target.value.length == 10) {
            findMobileErrors();
        }
    };

    const handlePANChange = (e) => {
        const enteredPAN = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
        setSelectedMember({
          ...selectedMember,
          pan: ("" + enteredPAN).toUpperCase(),
        });
    
        const newErrors = findPANErrors(enteredPAN, "1");
        setErrors({ ...errors, ...newErrors });
      };

    // const checkIfPanExists = async () => {
    //     let sessionData = await // checksession();
    //     let reqData = {
    //         pan: selectedMember.pan,
    //         fp_user_id: selectedMember.id,
    //         fp_log_id: sessionData['data']['fp_log_id'],
    //     };
    //     let checkPan = await restApiCall(
    //         DMF_CHECKIFPANEXISTS_API_URL,
    //         reqData,
    //         restHeaders
    //     );
    //     if (checkPan.error_code == "100") return true;
    //     else if (checkPan.error_code == "101") return message;
    //     return "Something went wrong!";
    // };

    const checkenterpanexists = async () => {
        // let r = await fetchEncryptData({
        //   url: DMF_GETPANSTATUS_API_URL,
        //   method: "post",
        //   data: {
        //     pan: selectedMember?.pan,
        //     user_id: selectedMember?.id,
        //     data_belongs_to: DATA_BELONGS_TO,
        //   },
        // });
        // if (r.error_code == 100) {
        //   return "";
        // } else {
        //   return r.message??"Something went wrong";
        // }
        let payload = {
            "user_pan":selectedMember?.pan,
            "user_id": selectedMember?.id,
            "data_belongs_to": DATA_BELONGS_TO
        };
        let checkpan = await CheckPanExists(payload);
        if (checkpan.status_code == 404) return true;
        else if (checkpan.status_code == 200) return checkpan.message;
        return "Something went wrong!";
      };


  const checkDuplicateMobile = async () => {
    try {
      let data = {
        method: "post",
        url: DMF_BASE_URL + "api/user/validatemobile",
        data: {
          parent_user_id: getParentUserId(),
          user_id: getUserId(),
          mobile: selectedMember.mobile,
        },
      };

      let r = await fetchEncryptData(data);
      if (r.error_code == 100) {
        return "";
      } else {
        return r.message??"Something went wrong";
      }
    } catch (err) {
      console.log("err ", err);
    }
  };
    // const getJwtToken = async () => {
    //     try {
    //         var reqData = {
    //             method: "post",
    //             url: GET_JWTTOKEN_API_URL,
    //             data: {
    //                 user_id: selectedMember.id,
    //                 is_chat_bot: 1,
    //             },
    //         };

    //         let jwtTok = await fetchData(reqData);
    //         if (jwtTok.error_code == "100") return jwtTok;
    //         return "Something went wrong!";
    //     } catch (e) {
    //         console.error(e);
    //     }
    // };
    const sendOTP = async () => {
        try {

            let existingMember = allMembers.find(member => member.id === selectedMember.id);

            let panIsSame = existingMember && existingMember.pan === selectedMember.pan;
            let mobileIsSame = existingMember && existingMember.mobile === selectedMember.mobile;
            if (!panIsSame || !mobileIsSame) {
                dispatch({ type: "SET_PAR_PAN_MOBILE_PREFILLED", payload: false });
            }


            const mobileErrors = findMobileErrors();
            const panErrors = findPANErrors();
            if (panErrors?.userPan) {
                setErrors({ ...mobileErrors, ...panErrors });
                return;
              }
            if (!panEditable && selectedMember.pan != "" && selectedMember.pan != null) {
                panErrors.userPan = await checkenterpanexists();
                
            }
            if (!mobEditable && selectedMember.mobile != "" && selectedMember.mobile != null) {
                mobileErrors.userMobile = await checkDuplicateMobile();
                
            }

            
           
            
            if (
                (Object.keys(mobileErrors).length > 0 || Object.keys(panErrors).length > 0) && (mobileErrors.userMobile !== "" || panErrors.userPan !== "")) {
                setErrors({ ...mobileErrors, ...panErrors});
                return;
            }
            // let checkPan = await checkIfPanExists();

            if (mobileErrors['userMobile'].trim() == '' && panErrors['userPan'].trim() === '') {
                props.setCommonUserData && props.setCommonUserData(selectedMember);
                let mobileNo = selectedMember.mobile;
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
                        commonEncode.encrypt(createCookie("token", commonEncode.encrypt(JSON.stringify(token, 60))));

                        let consent_url = "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/ConsentRequestPlus";
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
                                if (socket.readyState === 1) {
                                    props.onProceedClick();
                                } else {
                                    toastr.options.positionClass = "toast-bottom-left";
                                    toastr.error("Something went wrong!");
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 5000);

                                }
                                const send_otp_payload = {
                                    header: {
                                        mid: "fcd2c56e-9414-11e8-9eb6-529269fb1459",
                                        ts: new Date().toISOString().replace("Z", "+00:00"),
                                        sid: "",
                                        dup: "false",
                                        type: "urn:finvu:in:app:req.loginOtp.01",
                                    },
                                    payload: {
                                        username: selectedMember.mobile + "@finvu",
                                        mobileNum: selectedMember.mobile,
                                        handleId: responseData.body.ConsentHandle,
                                    },

                                };
                                // props.setDummy(send_otp_payload['payload'])   
                                props.setDummy(
                                    {
                                        ...send_otp_payload['payload'],
                                        tokenid: token,
                                        pan: selectedMember.pan,
                                        id: selectedMember.id,
                                        consentid: responseData.body.ConsentHandle,
                                        user_id: userId,
                                        fp_log_id: selectedMember.fp_log_id,
                                        retirement_date: selectedMember.retirement_date,
                                        name: selectedMember.name,
                                        user_specific_id: selectedMember.user_id,
                                        email: selectedMember.email
                                    })

                                dispatch({
                                    type: "SET_PAR_REPORT_DATA",
                                    payload: {
                                        "pan": selectedMember.pan,
                                        "name": selectedMember.name,
                                        "email": selectedMember.email ? selectedMember.email : (getParentUserDetails()).user_email,
                                        "mobile": selectedMember.mobile,
                                        "user_id": selectedMember.id,
                                    }
                                });
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
                        console.error("Request failed with status code:", loginResponse.status);
                    }
                } catch (error) {
                    console.error("An error occurred:", error.message);
                }
            }

            // let jwtTok = await getJwtToken();
            // if (sendOTP.error_code == "102") {
            //     // toastr.options.positionClass = "toast-bottom-left";
            //     // toastr.error(sendOTP.message);
            //     setErrorMessage("PAN is not linked with the given mobile number");
            //     setTimeout(() => {
            //         setErrorMessage("");
            //     }, 10000);
            //     return false;
            // }
            //   if (checkPan != true) {
            //     toastr.options.positionClass = "toast-bottom-left";
            //     toastr.error(checkPan);
            //     return;
            //   }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <div className={`DeamtBasicDetailsSection ${Styles.BasicDetailsSection}`}>
                <div className="">
                    <div className={`${Styles.title}`}>Name</div>
                    <div className="mt-2">
                        <Select classNamePrefix="sortSelect"
                            placeholder="Select Member"
                            isSearchable={false}
                            styles={customStyles}
                            options={allMembers}
                            onChange={(e) => {
                                handleChange(e);
                            }}
                            value={allMembers.filter(
                                (v) => v.id == selectedMember.id
                            )}
                        />
                    </div>
                </div>
                <div className="mt-4 ">
                    <div className={`${Styles.title}`}>PAN*</div>
                    <div className="mt-2">
                        <input maxlength="10" className={`${Styles.inputField}`} placeholder="Enter PAN" type="text"
                            value={selectedMember.pan ?? ""}
                            onChange={(e) => handlePANChange(e)}
                            readOnly={panEditable}
                        />
                        {errors.userPan && (
                            <p className="error">{errors.userPan}</p>
                        )}
                        {
                            //console.log("selectedMember", selectedMember.pan)
                        }
                    </div>
                </div>
                <div className="mt-4">
                    <div className={`${Styles.title}`}>Mobile Number</div>
                    <div className="mt-2">
                        <input className={`${Styles.inputField}`}
                            type="number"

                            placeholder="Enter 10 Digit Mobile Number"
                            value={selectedMember.mobile ?? ""}
                            onChange={(e) => handleMobileChange(e)}
                            readOnly={mobEditable}
                        />
                        {errors.userMobile && (
                            <p className="error">{errors.userMobile}</p>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    <div className="ButtonBx d-flex justify-content-center">
                        <button style={{
                            border: "1px solid #042b62",
                            color: "#042b62"
                        }}
                            className={`Cancel commonDashboardButton custom-outline-hover-btn-style`}
                            onClick={() => {
                                props.onClose();
                            }}>
                            Back
                        </button>
                        <button
                            style={{
                                backgroundColor: "#042b62",
                                border: "1px solid #042b62"
                            }}
                            // style={{
                            //     backgroundColor: pageurl === "/commondashboard" || pageurl === "/commondashboard/" ? "#042b62" : "",
                            //     border: pageurl === "/commondashboard" || pageurl === "/commondashboard/" ? "1px solid #042b62" : "",
                            // }}
                            type="button"
                            className="Unlink ms-md-0 ms-2 custom-btn-style"
                            disabled={sendDisabled}
                            onClick={() => {
                                sendOTP()
                                //   props.onProceedClick();
                            }}
                        >
                            Send OTP
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default BasicDetails;
