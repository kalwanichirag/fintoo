import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import Select from "react-select";
import {
  apiCall,
  fetchEncryptData,
  getItemLocal,
  getParentUserId,
  getUserId,
  loginRedirectGuest,
  restApiCall,
  setItemLocal,
} from "../../../common_utilities";
import { DATA_BELONGS_TO, imagePath, SMALLCASE_GATEWAY } from "../../../constants";
import OTPInput from "otp-input-react";
import moment from "moment";
import { Modal } from "react-bootstrap";
import FintooLoader from "../../../components/FintooLoader";
import * as toastr from "toastr";
import customStyles from "../../../components/CustomStyles";
import style from "../../style.module.css";
import { useNavigate } from "react-router-dom";
import { Deletesmallcaseaccount, Fetchexternalholdingdetails, GenerateJWTToken, GettransactionID, Verifysmallcasemfotp, sendSmallcaseOTP } from "../../../FrappeIntegration-Services/services/External-api/externalApi";
import { checkPan, fetchUserProfileDetails, getFamilyMember } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { formatApiValue } from "../../../Utils/Date/DateFormat";
import SmallcaseGateway from "../../../components/SmallcaseGateway/SmallcaseGateway";

function LinkYourHoldingsDG(props) {
  const [show, setShow] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const timer = useRef({ obj: null, counter: 120, default: 120 });
  const [count, setCount] = useState(120);
  const [modalType, setModalType] = useState(0);
  const [accToken, setAccToken] = useState("");
  const [restHeaders, setRestHeaders] = useState({});
  const [selectedMember, setSelectedMember] = useState({});
  const [otpInput, setOtpInput] = useState("");
  const dispatch = useDispatch();
  const interval = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ecasData, setEcasData] = useState([]);
  const [errors, setErrors] = useState({});
  const [sendDisabled, setSendDisabled] = useState(true);
  const [showlinkac, setShowLinkAc] = useState(false);
  const [ecasDeletePopup, setEcasDeletePopup] = useState(false);
  const [memberID, setMemberID] = useState("");
  const [panEditable, setPanEditable] = useState(true);
  const [isEcasRefresh, setIsEcasRefresh] = useState(false);
  const timeNewObj = useRef();
  const timeNewValue = useRef(120);
  const stopSmallCase = useRef(false);
  const [waitforSms, setWaitforSms] = useState(false);
  const [mfToken, setMfToken] = useState("");
  const [casResponse, setCasResponse] = useState("");
  const [showGateway, setShowGateway] = useState(false);
  const [smallcaseTrxnId, setSmallcaseTrxnId] = useState("");
  const [smallcaseAuthToken, setSmallcaseAuthToken] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (getUserId() == null) {
      loginRedirectGuest();
    }
    setSelectedMember({ ...selectedMember, user_id: getParentUserId() });
    fetchSmallcase();
    fetchUserDetails();
    // onLoadInit();
    document.body.classList.add("link-your-holding");
    return () => {
      document.body.classList.remove("link-your-holding");
      clearInterval(interval.current);
      clearInterval(timeNewObj.current);
      timeNewValue.current = 120;
    };
  }, []);

  const fetchUserDetails = async () => {
    try {
      const userid = getParentUserId();
      const data = await getFamilyMember(userid);
      if (data.status_code === "200" && Array.isArray(data.data)) {
        // replace allMembers with family details first
        const formattedMembers = data.data.map((member) => ({
          name: formatApiValue(member.user_name),
          pan: member.pan || "",
          mobile: member.mobile_number || "",
          email: member.user_email || "",
          user_id: member.user_id,
          relation: member.relation,
          gender: member.gender,
          dob: member.dob,
          is_dependent: member.is_dependent,
          label: formatApiValue(member.user_name),
          value: member.user_id,
        }));
        setAllMembers(formattedMembers);
      }
    } catch (e) {
      console.error("Error fetching user details", e);
    }
  };


  // const onLoadInit = async () => {
  //   try {
  //     var accTok = await getRestApiHeaders();
  //     if (accTok) {
  //       setAccToken(accTok.gatewayauthtoken);
  //       setRestHeaders(accTok);
  //     }
  //     fetchSmallcase();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };


  useEffect(() => {
    if (allMembers.length > 0) {
      handleChange();
    }
  }, [allMembers]);

  const handleClose = () => {
    setErrors({ userPan: "", userMobile: "" });

  }

  const checkPANRegistered = async (pan) => {
    let url =
      ADVISORY_CHECK_PAN_REGISTERED +
      "?uid=" +
      btoa("00" + props.session.data.id) +
      "&pan=" +
      pan;
    let checkpan = await apiCall(url, "", false, false);
    return checkpan;
  }

  const findMobileErrors = () => {
    const newErrors = {};
    let regex = /^[6789]\d{9}$/;
    if (!selectedMember.mobile || selectedMember.mobile === "")
      newErrors.userMobile = "Please enter valid mobile number!";
    else if (selectedMember.mobile.length !== 10)
      newErrors.userMobile = "Please enter valid mobile number!";
    else if (!regex.test(selectedMember.mobile))
      newErrors.userMobile = "Please enter valid mobile number!";
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
      newErrors.userPan = "Please enter PAN number";
    } else if (selectedMember.pan.length !== 10) {
      newErrors.userPan = "Please enter valid PAN number";
    } else if (!regex.test(selectedMember.pan)) {
      newErrors.userPan = "Please enter valid PAN number!";
    } else if (
      selectedMember.pan ||
      regex.test(selectedMember.pan) ||
      selectedMember.pan.length == 10
    ) {
      newErrors.userPan = "";
    }
    return newErrors;
  };

  const findOtpErrors = () => {
    const newErrors = {};
    if (!otpInput || otpInput === "")
      newErrors.otpInput = "Please enter valid otp!";
    else if (otpInput.length !== 6)
      newErrors.otpInput = "Please enter valid otp!";
    return newErrors;
  };

  const checkenterpanexists = async () => {
    if (selectedMember.pan != "" && selectedMember.pan != null) {
      const payload = {
        user_id: selectedMember.value,
        user_pan: selectedMember.pan
      }
      const res = await checkPan(payload)
      return res;
    }
  };

  const fetchSmallcase = async () => {
    try {
      let reqdata = {
        user_id: getParentUserId(),
        holding_type: "MF",
        data_belongs_to: DATA_BELONGS_TO,
      };
      let checkData = await Fetchexternalholdingdetails(reqdata);
      if (checkData.status_code == 200) {
        setEcasData(checkData?.data?.holding_details);
        dispatch({
          type: "ASSETS_UPDATE",
          payload: true,
        });
      } else if (checkData.status_code == 400) {
        setEcasData([]);
      }

      if (checkData.data.member_details && checkData.data.member_details.length > 0) {
        // merge external member list with already fetched family member details
        const all = checkData.data.member_details.map((v) => {
          const fam = allMembers.find((f) => f.user_id === v.user_id);
          return {
            name: v.user_name,
            id: v.user_id,
            label: v.user_name,
            value: v.user_id,
            pan: fam?.pan || "",
            mobile: fam?.mobile || "",
            email: fam?.email || "",
            relation: fam?.relation || "",
            dob: fam?.dob || "",
            gender: fam?.gender || "",
          };
        });
        setAllMembers(all);
      }
    } catch (e) {
      console.error("Error in fetchSmallcase:", e);
    }
  };

  const fetchMfCentral = async () => {
    try {
      let reqdata = {
        fp_user_id: props.session.data.fp_user_id,
        fp_log_id: props.session.data.fp_log_id,
      };
      let checkData = await restApiCall(
        ADVISORY_FETCH_MF_CENTRAL_DATA,
        reqdata,
        ""
      );
      if (checkData.error_code == "100") {
        setEcasData(checkData.data);
      }
      if (checkData.error_code == "103") {
        setEcasData([]);
      }
      if (checkData.valid_members.length > 0) {
        const all = checkData.valid_members.map((v) => ({
          name: v.first_name + " " + v.last_name,
          id: v.id,
          pan: v.pan,
          mobile: v.mobile,
          label: v.first_name + " " + v.last_name,
          value: v.id,
        }));
        setAllMembers([...all]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const generateClientRefNo = () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note: Months are zero-based
    const year = currentDate.getFullYear().toString().substring(2);
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const customFormat = `minty_${day}${month}${year}_${hours}${minutes}${seconds}`;
    return customFormat;
  };

  const sendOTP = async (refresh = 0) => {

    try {
      const mobileErrors = findMobileErrors();
      const panErrors = findPANErrors();
      if (refresh === 0) {
        // const panRegistred = await checkPANRegistered(selectedMember.pan);
        // const panExists = await checkenterpanexists();
        setIsEcasRefresh(false);

        // if (!panEditable && selectedMember.pan && panExists != true) {
        //   panErrors.userPan = panExists;
        // }
        // if (panRegistred != true) {
        //   panErrors.userPan = panRegistred;
        // }
      }

      if (
        (Object.keys(mobileErrors).length > 0 ||
          Object.keys(panErrors).length > 0) &&
        (mobileErrors.userMobile !== "" || panErrors.userPan !== "")
      ) {
        setErrors({ ...mobileErrors, ...panErrors });
        return;
      }

      // let checkPan = await checkIfPanExists();
      // if (checkPan != true) {
      //   toastr.options.positionClass = "toast-bottom-left";
      //   toastr.error(checkPan);
      //   return;
      // }
      const Payload = {
        user_id: selectedMember?.user_id,
      }

      let jwtTok = await GenerateJWTToken(Payload);
      if (jwtTok.status_code == "200") {
        const trxnIdData = await GettransactionID({ token: jwtTok.data.token });
        if (trxnIdData.status_code == "200") {
          let trxnId = trxnIdData.data.data.data.transactionId;
          const sendOTP = await sendSmallcaseOTP({
            transactionId: trxnId,
            pan: selectedMember.pan,
            phone: selectedMember.mobile,

          });
          if (sendOTP.status_code == "200") {
            clearInterval(timeNewObj.current);
            timeNewValue.current = 120;
            setItemLocal("trxnId", trxnId);
            setModalType(1);
            setDefaultTimer();
            setOtpInput("");
            startTimer();
            setErrors({});
            return;
          } else {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error(sendOTP.message);
            return;
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSmallcaseSDk = async (refresh = 0) => {

    try {
      const mobileErrors = findMobileErrors();
      const panErrors = findPANErrors();
      if (refresh === 0) {
        setIsEcasRefresh(false);
      }

      if (
        (Object.keys(mobileErrors).length > 0 ||
          Object.keys(panErrors).length > 0) &&
        (mobileErrors.userMobile !== "" || panErrors.userPan !== "")
      ) {
        setErrors({ ...mobileErrors, ...panErrors });
        return;
      }

      const Payload = {
        user_id: selectedMember?.user_id,
      }
      debugger
      let jwtTok = await GenerateJWTToken(Payload);
      if (jwtTok.status_code == 200) {
        let payload = {
          token: jwtTok.data.token,
          pan: selectedMember.pan,
          mobile: selectedMember.mobile,
          user_id: selectedMember.user_id
        }
        const trxnIdData = await GettransactionID(payload);
        setSmallcaseAuthToken(jwtTok.data.token)
        if (trxnIdData.status_code === 200) {
          let trxnId = trxnIdData.data.transactionId;
          setItemLocal("trxnId", trxnId);
          setSmallcaseTrxnId(trxnId);
          setShowGateway(true)
        }
        else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(trxnIdData.message);
          return;
        }
      
    }
    } catch (e) {
    console.log(e);
  }
};
const handleOtpChange = (e) => {
  setOtpInput(e.target.value);
};

const checkIfPanExists = async () => {
  let reqData = {
    user_id: selectedMember.value,
    user_pan: selectedMember.pan
  };
  const res = await checkPan(reqData)
  if (res.error_code == "200") return true;
  else if (res.error_code == "101") return message;
  return "Something went wrong!";
};

const getMFToken = async () => {
  let reqData = {
    user_id: getParentUserId(),
    fp_log_id: props.session.data.fp_log_id,
  };
  let mfTok = await restApiCall(
    ADVISORY_MF_GENERATE_TOKEN,
    reqData,
    restHeaders
  );
  if (mfTok.error_code == "100") {
    return mfTok;
  } else {
    toastr.options.positionClass = "toast-bottom-left";
    toastr.error("Someting went wrong!");
  }
};

const verifySmallcaseOTP = async () => {
  const otpErrors = findOtpErrors();
  if (Object.keys(otpErrors).length > 0) {
    setErrors(otpErrors);
    return;
  }

  let trxnId = getItemLocal("trxnId");
  let reqData = {
    transactionId: trxnId,
    pan: selectedMember.pan,
    phone: selectedMember.mobile,
    user_id: selectedMember.user_id,
    otp: otpInput,
    // holdling_type: "MF"
  };
  let verifyOTP = await Verifysmallcasemfotp(reqData)
  let errMsg = "";
  if (verifyOTP.status_code == "200") {
    setModalType(2);
    setShowLinkAc(false);
    setWaitforSms(true);
    // fetchSmallcase();

    let attempts = 0;
    interval.current = setInterval(async () => {
      if (stopSmallCase.current === false && attempts < 3) {
        attempts++;
        stopSmallCase.current = true;
        await fetchSmallcase();
      } else {
        clearInterval(interval.current);
      }
    }, 10000);

    return;
  } else if (verifyOTP.error_code) {
    if (verifyOTP.data.data.errors) {
      let errResp = verifyOTP.data.data.errors
      errMsg = errResp[0];
    }
    else {
      let errResp = JSON.parse(verifyOTP.data.data.data)
      errMsg = errResp.errors[0]?.message;
    }
  }

  if (errMsg.includes("Entered OTP appears to be incorrect")) {
    setErrors({ otpInput: errMsg });
    return;
  }
  setModalType(1);
  // setDefaultTimer();
  setOtpInput("");
  setErrors({});
  toastr.options.positionClass = "toast-bottom-left";
  toastr.error(errMsg ? errMsg : "Someting went wrong!");
};

const deleteSmallCase = async (memberid) => {

  var selected_name = "";
  var selected_pan = "";
  ecasData.filter((item) => {
    if (item.holding_id == memberid) {
      selected_name = item.user_name;
      selected_pan = item.holding_pan;
    }
  });

  let data = ecasData.filter((v) => v.holding_id == memberid);
  try {
    let reqdata = {
      // fp_user_id: memberid,
      // pan: selected_pan,
      holding_id: data[0].holding_id,
      holding_type: data[0].holding_type,
      data_belongs_to: DATA_BELONGS_TO
    };
    let delData = await Deletesmallcaseaccount(reqdata)
    if (delData.status_code == "200") {
      dispatch({
        type: "ASSETS_UPDATE",
        payload: true,
      });
      fetchSmallcase();
      toastr.options.positionClass = "toast-bottom-left";
      toastr.success("Mutual Fund holdings has been deleted successfully");
      return;
    }
  } catch (e) {
    console.log(e);
  }
};

const refreshSmallcase = async (memberid) => {
  let member_data = ecasData.filter((v) => v.user_id == memberid);
  const member = member_data.map((v) => ({
    name: v.user_name,
    user_id: v.user_id,
    pan_number: v.holding_pan,
    mobile_number: v.holding_mobile,
    label: v.user_name,
    value: v.user_id,
    last_modified: v.holding_modified_date
  }));
  setSelectedMember({ ...member[0] });
  setIsEcasRefresh(true)
  let current_date = moment().format("DD/MM/YYYY");
  let modified_date = moment(member[0].holding_modified_date).format("DD/MM/YYYY");
  if (current_date == modified_date) {
    setIsEcasRefresh(false)
    // let reqData = {
    //   pan: member[0].pan,
    //   fp_user_id: memberid,
    //   fp_log_id: props.session.data.fp_log_id,
    // };
    // let checkPan = await restApiCall(
    //   DMF_CHECKIFPANEXISTS_API_URL,
    //   reqData,
    //   restHeaders
    // );
    let reqData = {
      user_id: memberid,
      user_pan: member[0].pan_number,
    };
    let res = await checkPan(reqData)

    if (res.status_code != 200) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(checkPan.message);
      return;
    }
  }
};

useEffect(() => {
  if (selectedMember?.mobile && selectedMember?.pan && isEcasRefresh) {
    // sendOTP(1);
    handleSmallcaseSDk(1);
  }
}, [selectedMember, isEcasRefresh]);

const handleChange = async (e) => {
  try {
    if (!e) {
      if (allMembers.length > 0) {
        const member = allMembers[0]; // pick first member
        setSelectedMember({ ...member });
        setPanEditable(member.pan !== null && member.pan !== "" ? true : false);
        setSendDisabled(false);
      }
    } else {
      setSelectedMember({ ...e });
      setPanEditable(e.pan !== null && e.pan !== "" ? true : false);
      setErrors({});
      setSendDisabled(false);
    }
  } catch (err) {
    console.error("handleChange error:", err);
  }
};

useEffect(() => {
  setDefaultTimer();
}, []);

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

const handleEcasDelete = async (e) => {
  if (e == "yes") {
    setEcasDeletePopup(false);
    deleteSmallCase(memberID);
  } else {
    setEcasDeletePopup(false);
  }
};

const startTimer = () => {
  timeNewObj.current = setInterval(function () {
    if (timeNewValue.current <= 0) {
      clearInterval(timeNewObj.current);
    } else {
      timeNewValue.current = timeNewValue.current - 1;
      setCount(timeNewValue.current);
    }
  }, 1000);
};

const setDefaultTimer = () => {
  timer.current.counter = timer.current.default;
};

const handleMobileChange = (e) => {
  setSelectedMember({ ...selectedMember, mobile: e.target.value });
  if (e.target.value.length == 10) {
    findMobileErrors();
  }
};
const handlePANChange = async (e) => {
  setSelectedMember({ ...selectedMember, pan: e.target.value });
  if (e.target.value.length == 10) {
    findPANErrors();
    const panErrors = {};
    // let panRegistered = await checkPANRegistered(e.target.value);
    // if (panRegistered != true) {
    //   panErrors.userPan = panRegistered;
    //   setErrors({ ...panErrors });
    //   return;
    // }
  }
};

useEffect(() => {
  if (show && modalType) {
    document.getElementById("root").classList.add("blur-bg");
  } else {
    document.getElementById("root").classList.remove("blur-bg");
  }
}, [show, modalType]);
return (
  <>
    <FintooLoader isLoading={isLoading} />
    <div>
      <div>
        <div>
          <div
            style={{
              fontWeight: "bold",
              fontSize: 15,
            }}
            onClick={() => {
              setShowLinkAc(true);
              setModalType(0);
            }}
            className="linkholdings_btn pointer"
          >
            Link Account
          </div>
        </div>
        <table className="bgStyleTable text-center">
          <tbody>
            <tr>
              <th>Name</th>
              <th>PAN</th>
              <th>Mobile Number</th>
              <th>Last Updated</th>
              <th>Delete</th>
              <th>Update</th>
            </tr>
            {ecasData && ecasData.length > 0 ? (
              ecasData.map((smallcase) => (
                <tr>
                  <td>
                    {smallcase.user_name}
                  </td>
                  <td>{smallcase.holding_pan}</td>
                  <td>{smallcase.holding_mobile}</td>
                  <td>
                    {moment(smallcase.holding_modified_date).format("DD/MM/YYYY")}
                  </td>
                  <td>
                    <button
                      className="default-btn"
                      type="button"
                      style={{
                        marginRight: 0,
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <img
                        alt="Delete"
                        src={imagePath + "/static/media/Images/delete.svg"}
                        onClick={() => {
                          setMemberID(smallcase.holding_id);
                          setEcasDeletePopup(true);
                        }}
                        style={{
                          width: 25,
                          height: 25,
                        }}
                      />
                    </button>
                  </td>
                  <td>
                    <div
                      type="button"
                      style={{
                        marginRight: 0,
                        padding: 0,
                        margin: 0,
                      }}
                      className=""
                    >
                      {" "}
                      <img
                        src={imagePath + "/static/media/Images/refresh.svg"}
                        style={{
                          width: 25,
                          height: 25,
                        }}
                        onClick={() => {
                          refreshSmallcase(smallcase.user_id);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No Holdings Linked.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {modalType == 0 && (
        <Modal className="popupmodal" centered show={showlinkac}>
          <Modal.Header className="ModalHead d-flex">
            <div className="text-center w-100">Link your Holdings </div>
            <div className="">
              <img
                onClick={() => {
                  setShowLinkAc(false);
                  handleClose();
                }}
                className="pointer"
                src={imagePath + "/static/media/Images/cancel_white.svg"}
                width={40}
              />
            </div>
          </Modal.Header>
          <div className=" p-4 d-grid place-items-center align-item-center">
            <div
              style={{
                fontSize: "1rem",
                textAlign: "left",
              }}
            >
              Please select the respective member from the dropdown menu to
              fetch MF holdings.
            </div>
            <div className=" HeaderModal mt-2">
              <form noValidate="novalidate" name="goldassetform">
                <div className="row py-md-2">
                  <div className="col-12">
                    <div className="material">
                      <Form.Label>Member*</Form.Label>
                      <Select
                        classNamePrefix="sortSelect"
                        isSearchable={false}
                        styles={customStyles}
                        options={allMembers}
                        onChange={handleChange}
                        value={
                          allMembers.find(
                            (v) => v.user_id === selectedMember.id || v.user_id === selectedMember.user_id
                          ) || null
                        }
                      />

                    </div>
                  </div>
                </div>
                <div className="row py-md-2 py-2">
                  <div className="col-md-6 col-12">
                    <div className="bank-label">
                      <div
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        PAN*{" "}
                      </div>
                    </div>
                    <div className="bank-info Nominee-name">
                      <div>
                        <input
                          aria-label=""
                          className="shadow-none form-control"
                          placeholder=""
                          maxlength="10"
                          style={{
                            border: 0,
                            borderBottom: "1px solid #aeaeae",
                            borderRadius: "0",
                            textTransform: "uppercase",
                            padding: "1px 0px 8px 0px",
                          }}
                          value={selectedMember.pan ?? ""}
                          onChange={(e) => handlePANChange(e)}
                          readOnly={panEditable}
                        />
                        {errors.userPan && (
                          <p className="error">{errors.userPan}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="bank-label">
                      <div
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        Mobile Number*{" "}
                      </div>
                    </div>
                    <div className="bank-info Nominee-name">
                      <div>
                        <input
                          aria-label=""
                          className="shadow-none form-control"
                          placeholder=""
                          type="number"
                          maxlength="10"
                          style={{
                            border: 0,
                            borderBottom: "1px solid #aeaeae",
                            borderRadius: "0",
                            padding: "1px 0px 8px 0px",
                          }}
                          value={selectedMember.mobile ?? ""}
                          onChange={(e) => handleMobileChange(e)}
                        />
                        {errors.userMobile && (
                          <p className="error">{errors.userMobile}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center mt-4">
                    <button
                      type="button"
                      className="btn LInkOTPBTn"
                      disabled={sendDisabled}
                      onClick={() => handleSmallcaseSDk()}
                    >
                      Fetch Holdings
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
      {modalType == 1 && (
        <>
          <Modal
            style={{
              maxWidth: "400px !important",
            }}
            className="popupmodal"
            centered
            show
          >
            <Modal.Header className="ModalHead d-flex">
              <div className="text-center w-100">Please Enter OTP </div>
              <div className="">
                <img
                  onClick={() => {
                    setModalType(2);
                  }}
                  className="pointer"
                  src={imagePath + "/static/media/Images/cancel_white.svg"}
                  width={40}
                />
              </div>
            </Modal.Header>

            <div className="p-4 d-grid place-items-center align-item-center">
              <div>
                <div className="">
                  <div>
                    <div className="modal-whitepopup-box-item  border-top-0 text-center">
                      <p>
                        We have sent an OTP to -
                        <b>
                          {" "}
                          {selectedMember.mobile
                            .split("")
                            .map((v, i) => (i > 2 && i < 8 ? "*" : v))
                            .join("")}
                        </b>
                      </p>
                    </div>
                  </div>
                  <div className={`d-flex justify-center align-items-center`}>
                    <div className="m-auto">
                      <OTPInput
                        value={otpInput}
                        onChange={setOtpInput}
                        autoFocus
                        className="link-holdings-otp w-100"
                        style={{
                          border: "none",
                        }}
                        OTPLength={6}
                        otpType="number"
                        disabled={false}
                      />
                      <div
                        style={{
                          height: "2px",
                        }}
                      ></div>
                      {errors.otpInput && (
                        <span
                          style={{
                            color: "red",
                            fontWeight: "normal",
                            padding: "9px 0px",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {errors.otpInput}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-center grey-color">
                    {count == 0 &&

                      <>
                        <p
                          style={{ fontSize: "1.2rem", color: "#042b62" }}
                          className="pointer mt-md-4 blue-color"
                          onClick={() => {
                            sendOTP();
                          }}
                        >
                          Resend OTP
                        </p>
                      </>}
                    {count > 0 && (
                      <p
                        className="mt-md-4"
                      // style={{
                      //   fontSize: "1.2rem",
                      // }}
                      >
                        Didn’t receive a code?
                        ( <strong>
                          {moment()
                            .startOf("day")
                            .seconds(count)
                            .format("mm:ss")}
                        </strong>)
                      </p>
                    )}
                  </div>
                </div>
                <center>
                  <>
                    <div
                      type="button"
                      className="btn LInkOTPBTn"
                      onClick={() => {
                        verifySmallcaseOTP();
                      }}
                    >
                      Submit
                    </div>
                  </>
                </center>
                <p>&nbsp;</p>
              </div>
            </div>
          </Modal>
        </>
      )}
      {modalType == 2 && (
        <>
          <Modal
            style={{
              maxWidth: "400px !important",
            }}
            className="popupmodal"
            centered
            show={waitforSms}
          >
            <div className={style["modal-cntn-www"] + ""}>
              <div>
                <div className={`${style.linkmodaltext}`}>
                  Your external mutual Fund portfolio sync is in progress
                </div>
                <div className={`${style.linkmodalDestext}`}>
                  This may take 10 to 15 minutes. We will notify you once your
                  external portfolio is synced.
                </div>
              </div>
              <div className="mt-5">
                <button
                  className={style["OK-btns"]}
                  setw
                  onClick={() => {
                    navigate(
                      process.env.PUBLIC_URL +
                      "/datagathering/assets-liabilities/"
                    );
                    setWaitforSms(false);
                  }}
                >
                  Ok
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}

      <Modal className="popupmodal" centered show={ecasDeletePopup}>
        <Modal.Header className="ModalHead d-flex">
          <div className="text-center w-100">Delete Confirmation</div>
        </Modal.Header>
        <div className=" p-4 d-grid place-items-center align-item-center">
          <div
            style={{
              fontSize: "1rem",
              textAlign: "left",
            }}
          >
            All fetched mutual funds and their goal linkages will be
            permanently deleted. Are you sure you want to delete?
          </div>
          <div className="d-flex justify-content-center mt-5">
            <button
              onClick={() => {
                handleEcasDelete("yes");
              }}
              className="outline-btn m-2"
            >
              Yes
            </button>

            <button
              onClick={() => {
                handleEcasDelete("no");
              }}
              className="outline-btn m-2"
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </div>
    {showGateway && (
      <SmallcaseGateway
        key={smallcaseTrxnId}
        gatewayName={SMALLCASE_GATEWAY}
        authToken={smallcaseAuthToken}
        transactionId={smallcaseTrxnId}
        setIsLoading={setIsLoading}
        fetcEcas={false}
        parSnippet={false}
        portfolio={false}
        dg={true}
        setModalType={setModalType}
        fetchSmallcase={fetchSmallcase}
      />
    )}
  </>
);
}

export default LinkYourHoldingsDG;
