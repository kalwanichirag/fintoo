import React, { useState, useEffect } from "react";
import Styles from "./style.module.css"
import Select from 'react-select'
import { DATA_BELONGS_TO } from "../../../../constants";
import customStyles from "../../../../components/CustomStyles";
import { CHECK_SESSION } from "../../../../constants";
import { apiCall, getItemLocal, restApiCall, getParentUserId, createCookie, setUserId, fetchData, getParentUserDetails } from "../../../../common_utilities";
import socket, { onMessageHandler } from "../../BankCashbalance/socket";
import commonEncode from "../../../../commonEncode";
import { useLocation } from "react-router-dom";
import * as toastr from "toastr";
import { useDispatch } from "react-redux";
import { CheckPanExists, Fetchexternalholdingdetails } from "../../../../FrappeIntegration-Services/services/financial-planning-api/externalApi";
import { getFamilyMember } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { formatApiValue } from "../../../../Utils/Date/DateFormat";

const BasicDetails = (props) => {
    const dispatch = useDispatch();

    const [selectedMember, setSelectedMember] = useState({});
    const [ecasData, setEcasData] = useState([]);
    const [restHeaders, setRestHeaders] = useState({});
    const [allMembers, setAllMembers] = useState([]);
    const [panEditable, setPanEditable] = useState(false);
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
        if (props.forpar) {
            fetchMemberDetails();
        } else {
            fetchSmallcase();
        }
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

    const findPANErrors = () => {
        const newErrors = {};
        let regex = /^[A-Za-z]{3}[HPhp]{1}[A-Za-z]{1}\d{4}[A-ZHPa-zhp]{1}$/;
        if (!selectedMember.pan || selectedMember.pan === "") {
            newErrors.userPan = "Please enter PAN";
        } else if (selectedMember.pan.length !== 10) {
            newErrors.userPan = "Please enter valid PAN";
        } else if (!regex.test(selectedMember.pan)) {
            newErrors.userPan = "Please enter valid PAN";
        } else if (
            selectedMember.pan ||
            regex.test(selectedMember.pan) ||
            selectedMember.pan.length == 10
        ) {
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
            const userid = getParentUserId();
            const familyData = await fetchMemberDetails(); // Fetch family member details
            const reqdata = {
                data_belongs_to: DATA_BELONGS_TO,
                holding_type: "MF",
                user_id: userid
            };
            const externalHoldingData = await Fetchexternalholdingdetails(reqdata);
            // const externalHoldingData = {
            //     "status_code": 200,
            //     "message": "Success",
            //     "data": {
            //         "holding_details": [],
            //         "member_details": [
            //             {
            //                 "user_name": "Akshay",
            //                 "user_id": "6e57p5a3se"
            //             }
            //         ]
            //     }
            // }
            if (externalHoldingData.status_code === 200) {
                const holdingDetails = externalHoldingData.data.holding_details;
                const validMembers = externalHoldingData.data.member_details;
                const validHoldingMembers = validMembers;

                // const valid_member = a.filter(data => !b.includes(data.user_id))


                // const validHoldingMembers = Array.isArray(holdingDetails) ? holdingDetails.filter(
                //     (data) => validMembers.some(member => member.user_id === data.user_id)
                // ) : [];

                setEcasData(validMembers);
                // const familyData = {
                //     "status_code": 200,
                //     "message": "Family members fetched successfully",
                //     "data": [
                //         {
                //             "user_id": "6e57p5a3se",
                //             "user_parent_id": "",
                //             "user_details_id": "USRD-31",
                //             "user_name": "Akshay",
                //             "user_email": "akshay.padave@fintoo.in",
                //             "relation": "Self",
                //             "relation_id": 1,
                //             "dob": "29/11/2000",
                //             "mobile_number": "7977812895",
                //             "pan": null,
                //             "is_dependent": true,
                //             "is_minor": false,
                //             "occupation": "Professional",
                //             "occupation_id": "OCM-1",
                //             "retirement_age": 0,
                //             "life_expectancy_age": 0,
                //             "gender": "Male"
                //         }
                //     ]
                // }

                if (validHoldingMembers.length > 0) {
                    const allMembers = validHoldingMembers.map((holdingMember) => {
                        const familyMember = familyData.data.find(
                            (member) => member.user_id === holdingMember.user_id
                        );

                        return {
                            name: holdingMember.user_name || "",
                            id: holdingMember.user_id,
                            user_id: holdingMember.user_id,
                            pan: familyMember?.pan || null,
                            mobile: familyMember?.mobile_number || null,
                            label: holdingMember.user_name || "",
                            value: holdingMember.user_id,
                            fp_log_id: null,
                            retirement_date: familyMember?.retirement_age || null,
                            fp_id: null, 
                            email: familyMember?.user_email || null,
                            relation: familyMember?.relation || null,
                            gender: familyMember?.gender || null,
                            dob: familyMember?.dob || null,
                            is_dependent: familyMember?.is_dependent || null
                        };
                    });

                    setAllMembers([...allMembers]);
                }
            }
        } catch (e) {
            console.error("Error fetching smallcase data:", e);
        }
    };
    const fetchMemberDetails_old = async () => {
        let sessionData = await  checksession();

        let member = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
        dispatch({ type: "SET_MEMBER_DATA", payload: member });
        try {
            if (member.length > 0) {
                const all = member.map((v) => ({
                    name: v.name,
                    id: v.id,
                    pan: v.pan,
                    mobile: v.mobile,
                    label: v.name,
                    value: v.id,
                    email: v.user_email == null ? member[0].user_email : v.user_email,
                    fp_id: v.user_details_id
                }));
                setAllMembers([...all]);

            }
        } catch (e) {
            console.log(e);
        }
    };

    const fetchMemberDetails = async () => {
        try {
            
        const userid = getParentUserId();
        const data = await getFamilyMember(userid);
        if (data.status_code === '200' && Array.isArray(data.data)) {
            const formattedMembers = data.data.map((member) => ({
            name: formatApiValue(member.user_name),
            pan: member.pan,
            mobile: member.mobile_number,
            email_address: formatApiValue(member.user_email),
            user_id: member.user_id,
            relation: member.relation,
            gender: member.gender,
            dob: member.dob,
            is_dependent: member.is_dependent,
            id: member.user_id,
            label: formatApiValue(member.user_name),
            value: member.user_id,
            }));
            dispatch({ type: "SET_MEMBER_DATA", payload: formattedMembers });
            setAllMembers(formattedMembers);
            // Or use: 
            // setAllMembers(prev => [...prev, ...formattedMembers]);
        }
        } catch (e) {
        console.error("Error fetching user details", e);
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
                setSendDisabled(false);


            } else {
                setSelectedMember({ ...e });
                setPanEditable(e.pan !== null && e.pan !== "" ? true : false);
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
        setSelectedMember({ ...selectedMember, pan: e.target.value });
        if (e.target.value.length == 10) {
            findPANErrors();
        }
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
        // let sessionData = await // checksession();
        // const userid = getParentUserId();

        // if (selectedMember.pan != "" && selectedMember.pan != null) {
        //     let url =
        //         ADVISORY_CHECK_PAN_EXISTS +
        //         "?uid=" +
        //         btoa("00" + sessionData['data']['id']) +
        //         "&pan=" +
        //         selectedMember.pan; 
        let payload = {
            "user_pan":selectedMember.pan,
            "user_id": selectedMember.id,
            "data_belongs_to": DATA_BELONGS_TO
        };
        let checkPan = await CheckPanExists(payload)
        if (checkPan.status_code == 404) return true;
        else if (checkPan.status_code == 200) return checkPan.message;
        return "Something went wrong!";
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
            if (!panEditable && selectedMember.pan != "" && selectedMember.pan != null) {
                let checkenterPan = await checkenterpanexists();
                if (checkenterPan != true){
                    panErrors.userPan = checkenterPan || "PAN validation failed";
                }
                
            }
            if (
                (Object.keys(mobileErrors).length > 0 || Object.keys(panErrors).length > 0) && (mobileErrors.userMobile !== "" || panErrors.userPan !== "")) {
                setErrors({ ...mobileErrors, ...panErrors });
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
                        commonEncode.encrypt(createCookie("finvu_token", commonEncode.encrypt(JSON.stringify(token, 60))));

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
                                        // fp_log_id: selectedMember.fp_log_id,
                                        // retirement_date: selectedMember.retirement_date,
                                        name: selectedMember.name,
                                        user_specific_id: selectedMember.user_id,
                                        email: selectedMember.email,
                                        fp_id: selectedMember.fp_id
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

                    toastr.options.positionClass = "toast-bottom-left";
                    toastr.error(
                        "Unable to send OTP"
                    );
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

            toastr.options.positionClass = "toast-bottom-left";
            toastr.error(
                "Unable to send OTP"
            );
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
                            // styles={customStyles}
                            options={allMembers}
                            onChange={(e) => {
                                handleChange(e);
                            }}
                            value={allMembers.filter(
                                (v) => v.id == selectedMember.user_id
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
