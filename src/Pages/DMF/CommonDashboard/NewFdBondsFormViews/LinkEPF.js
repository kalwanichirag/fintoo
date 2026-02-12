import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import { imagePath } from "../../../../constants";
import OTPInput from "otp-input-react";
import {
  apiCall,
  fetchData,
  getParentUserId,
  getUserId,
  loginRedirectGuest,
  restApiCall,
} from "../../../../common_utilities";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import moment from "moment";
import FintooLoader from "../../../../components/FintooLoader";
import SimpleReactValidator from "simple-react-validator";
import { faL } from "@fortawesome/free-solid-svg-icons";
import customStyles from "../../../../components/CustomStyles";
import { useNavigate } from "react-router-dom";

function LinkEPF(props) {
  const { showUANModal, setShowUANModal, modalType, setModalType, session } =
    props;

  const timer = useRef({ obj: null, counter: 120, default: 120 });
  const dispatch = useDispatch();
  const timeNewObj = useRef();
  const timeNewValue = useRef(120);
  const interval = useRef(null);
  const stopEPF = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(120);
  const [epfDeletePopup, setEpfDeletePopup] = useState(false);
  const [show, setShow] = useState(false);
  // const [modalType, setModalType] = useState(0);
  const [otpInput, setOtpInput] = useState("");
  const [epfData, setEpfData] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState({});
  const [selectedEpfMemberId, setSelectedEpfMemberId] = useState({});
  const [epfDropdown, setEpfDropdown] = useState({});
  // const [showUANModal, setShowUANModal] = useState(false);
  const [uanEditable, setUanEditable] = useState(false);
  const [sendDisabled, setSendDisabled] = useState(true);
  const [isUANValid, setIsUANValid] = useState(false);
  const [clientID, setClientID] = useState("");
  const [epfID, setEpfID] = useState("");
  const [errors, setErrors] = useState({});
  const simpleValidator = useRef(new SimpleReactValidator());
  const [UANError, setUANError] = useState("");
  const [, forceUpdate] = useState();
  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    if (getUserId() == null) {
      loginRedirectGuest();
    }

    // Add safety check for session.data
    if (session && session.data && session.data.fp_user_id) {
      setSelectedMember({
        ...selectedMember,
        id: session.data.fp_user_id,
        epfotpsentnumber: "",
      });
    } else {
      // Fallback to getUserId() if session.data is not available
      setSelectedMember({
        ...selectedMember,
        id: getUserId(),
        epfotpsentnumber: "",
      });
    }

    onLoadInit();
    document.body.classList.add("link-epf");
    return () => {
      document.body.classList.remove("link-epf");
      clearInterval(interval.current);
      clearInterval(timeNewObj.current);
      timeNewValue.current = 120;
    };
  }, []);

  useEffect(() => {
    handleChange();
  }, [allMembers]);

  useEffect(() => {
    if (show && modalType) {
      document.getElementById("root").classList.add("blur-bg");
    } else {
      document.getElementById("root").classList.remove("blur-bg");
    }
  }, [show, modalType]);

  const onLoadInit = async () => {
    try {
      fetchValidEpfMembers();
    } catch (e) {
      console.log(e);
    }
  };

  const fetchValidEpfMembers = async () => {
    try {
      // Add safety check for session.data
      if (
        !props.session ||
        !props.session.data ||
        !props.session.data.id ||
        !props.session.data.fp_log_id
      ) {
        console.error("Session data is not available");
        return;
      }

      let reqdata = {
        user_id: props.session.data.id,
        fp_log_id: props.session.data.fp_log_id,
      };
      let checkData = await restApiCall(
        ADVISORY_GET_VALID_EPF_MEMBERS,
        reqdata,
        ""
      );
      let epf_valid_members = checkData.valid_members;
      setEpfData(checkData.data);
      if (checkData.valid_members.length > 0) {
        const all = checkData.valid_members.map((v) => ({
          name: v.first_name + " " + v.last_name,
          id: v.id,
          uan: v.UAN,
          mobile: v.alternate_mobile,
          label: v.first_name + " " + v.last_name,
          value: v.id,
        }));
        setAllMembers([...all]);
        setEpfDropdown({
          epf_member:
            epf_valid_members[Object.keys(epf_valid_members)[0]][
              "id"
            ].toString(),
        });
        setSelectedEpfMemberId(
          epf_valid_members[Object.keys(epf_valid_members)[0]]["id"].toString()
        );
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
        setUanEditable(
          member[0].uan !== null && member[0].uan !== "" ? true : false
        );
        setEpfDropdown({
          epf_member: member[0]["id"].toString(),
        });
        setSelectedEpfMemberId(member[0]["id"].toString());
        setSendDisabled(false);
      } else {
        setSelectedMember({ ...e });
        setUanEditable(e.uan !== null && e.uan !== "" ? true : false);
        setErrors({});
        setEpfDropdown({
          epf_member: e["id"].toString(),
        });
        setSelectedEpfMemberId(e["id"].toString());
        setSendDisabled(false);
      }
    } catch (e) {}
  };

  const getUserUAN = async (id) => {
    try {
      let data = {
        fp_user_id: id,
      };
      let checkData = await restApiCall(ADVISORY_GET_USERDETAILS, data, "");
      if (checkData.error_code == "100") {
        if (checkData.data[0]) {
          if (checkData.data[0]["uan"]) {
            setUanEditable(false);
            setSelectedMember({
              ...selectedMember,
              uan: checkData.data["data"][0]["uan"],
            });
          } else {
            setUanEditable(true);
          }
        } else {
          setUanEditable(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const sendEpfOTP = async () => {
    // Add safety check for session.data
    if (
      !props.session ||
      !props.session.data ||
      !props.session.data.fp_log_id
    ) {
      console.error("Session data is not available");
      return;
    }

    let data = {
      member_id: epfDropdown.epf_member,
      fp_log_id: props.session.data.fp_log_id,
      uan: selectedMember.uan,
    };
    let sendOTP = await restApiCall(ADVISORY_GET_EPF_OTP, data, "");
    return sendOTP;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    var isFormValid = simpleValidator.current.allValid();
    setIsFormValid(isFormValid);
    simpleValidator.current.showMessages();
    forceUpdate(1);

    if (isFormValid && (UANError == "" || UANError == null)) {
      // setUANError("");
      sendOTP();
    } else {
      // var UAN = selectedMember.uan;
      if (UANError != "") {
        setIsFormValid(false);
      }
    }
  };

  const sendOTP = async () => {
    try {
      let sendOTP = await sendEpfOTP();

      if (sendOTP.error_code == "100") {
        clearInterval(timeNewObj.current);
        timeNewValue.current = 120;
        setClientID(sendOTP.data.client_id);
        let epf_mob = sendOTP.data["masked_mobile_number"];
        setSelectedMember({
          ...selectedMember,
          epfotpsentnumber: epf_mob,
        });
        setModalType(1);
        setDefaultTimer();
        setOtpInput("");
        startTimer();
        setErrors({});
        return;
      }
      // else if(sendOTP.error_code == "102" && sendOTP.message == "UAN already registered")
      //   {
      //     setUANError(sendOTP.message);
      //   }
      else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(sendOTP.message);
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const verifyEPFOTP = async () => {
    const otpErrors = findOtpErrors();
    if (Object.keys(otpErrors).length > 0) {
      setErrors(otpErrors);
      return;
    }

    // Add safety check for session.data
    if (
      !props.session ||
      !props.session.data ||
      !props.session.data.fp_log_id
    ) {
      console.error("Session data is not available");
      return;
    }

    // setIsLoading(true);
    let reqData = {
      member_id: selectedMember.id,
      fp_log_id: props.session.data.fp_log_id,
      client_id: clientID,
      otp: otpInput,
    };
    setIsLoading(true);
    setModalType(2);
    let verifyOTP = await restApiCall(ADVISORY_SUBMIT_EPF_OTP, reqData, "");

    let errMsg = "";

    if (verifyOTP.error_code == "100") {
      setModalType(2);
      setShowUANModal(false);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.success("OTP verified successfully");

      // Define an async function for the setTimeout callback
      const setTimeoutCallback = async () => {
        if (!stopEPF.current) {
          await getEpfPassbook();
          dispatch({
            type: "ASSETS_UPDATE",
            payload: true,
          });
        }
      };
      interval.current = setTimeout(setTimeoutCallback, 10000);
      return;
    } else if (verifyOTP.error_code == "102") {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(verifyOTP["message"]);
      setIsLoading(false);
      setModalType(0);
      setOtpInput("");
      setErrors({});
    }
  };

  const navigate = useNavigate();

  const getEpfPassbook = async () => {
    // Add safety check for session.data
    if (
      !props.session ||
      !props.session.data ||
      !props.session.data.fp_log_id
    ) {
      console.error("Session data is not available");
      return;
    }

    let reqData = {
      member_id: selectedMember.id,
      fp_log_id: props.session.data.fp_log_id,
      client_id: clientID,
      uan: selectedMember.uan,
    };

    let response = await restApiCall(ADVISORY_GET_EPF_PASSBOOK, reqData, "");
    if (response.error_code == "100") {
      // toastr.options.positionClass = "toast-bottom-left";
      // toastr.success("EPF data fetched successfully");

      let payload = {
        url: ADVISORY_FETCH_EPF_DATA,
        data: {
          user_id: props.session.data.id,
          fp_log_id: props.session.data.fp_log_id,
          member_id: selectedMember.id,
        },
        method: "post",
      };

      const r = await fetchData(payload);

      await fetchValidEpfMembers();
      setIsLoading(false);
      window.location.href = `${process.env.PUBLIC_URL}/datagathering/assets-liabilities?success=1&isepf=1&epfamount=${r.data}`;
    } else if (response.error_code == "102") {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(response.message);
      setIsLoading(false);
    }
  };

  const handleEpfDelete = async (e) => {
    if (e == "yes") {
      setEpfDeletePopup(false);
      deleteEpf(epfID);
    } else {
      setEpfDeletePopup(false);
    }
  };

  const deleteEpf = async (epfid) => {
    var selected_uan = "";
    epfData.filter((item) => {
      if (item.id == epfid) {
        selected_uan = item.UAN;
      }
    });
    try {
      let reqdata = {
        fp_user_id: epfid,
        uan: selected_uan,
      };
      let delData = await restApiCall(
        ADVISORY_DELETE_EPF_HOLDINGS,
        reqdata,
        ""
      );
      if (delData.error_code == "100") {
        fetchValidEpfMembers();
        dispatch({
          type: "ASSETS_UPDATE",
          payload: true,
        });
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const refreshEpf = async (epfid) => {
    // Add safety check for session.data
    if (
      !props.session ||
      !props.session.data ||
      !props.session.data.fp_log_id
    ) {
      console.error("Session data is not available");
      return;
    }

    let selected_uan = "";
    let selected_id = "";
    let last_modified = "";
    let selected_user_id = "";
    for (var i = 0; i < epfData.length; i++) {
      if (epfData[i]["id"] == epfid) {
        setSelectedMember({
          ...selectedMember,
          selected_uan: epfData[i]["UAN"],
          selected_id: epfData[i]["id"],
          last_modified: epfData[i]["last_modified"],
          selected_user_id: epfData[i]["user_id"],
        });
        selected_uan = epfData[i]["UAN"];
        selected_id = epfData[i]["id"];
        last_modified = epfData[i]["last_modified"];
        selected_user_id = epfData[i]["user_id"];
      }
    }
    let currentDate = new Date().toJSON();
    var last_modified_new = last_modified.substr(
      0,
      last_modified.lastIndexOf("T")
    );
    var current_date_new = currentDate.substr(0, currentDate.lastIndexOf("T"));
    if (last_modified_new == current_date_new) {
      try {
        let reqdata = {
          uan: selected_uan,
          fp_log_id: props.session.data.fp_log_id,
          member_id: epfid,
        };
        let response = await restApiCall(
          ADVISORY_CHECK_EPF_FETCHED_TODAY,
          reqdata,
          ""
        );
        if (response.error_code == "101") {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(response["message"]);
        } else {
          getUserUAN(epfData);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      await fetchValidEpfMembers();
      for (var i = 0; i < epfData; i++) {
        if (epfData[i]["id"] == epfid) {
          setSelectedMember({
            ...selectedMember,
            selected_uan: epfData[i]["UAN"],
            selected_id: epfData[i]["id"],
            last_modified: epfData[i]["last_modified"],
          });
          selected_uan = epfData[i]["UAN"];
          selected_id = epfData[i]["id"];
          last_modified = epfData[i]["last_modified"];
        }
      }
      await sendOTP();
    }
  };

  const findOtpErrors = () => {
    const newErrors = {};
    if (!otpInput || otpInput === "")
      newErrors.otpInput = "Please enter valid otp!";
    else if (otpInput.length !== 6)
      newErrors.otpInput = "Please enter valid otp!";
    return newErrors;
  };

  const handleMemberChange = async (e) => {
    setSelectedMember({ ...e });
    getUserUAN(e["id"]);
    setEpfDropdown({
      epf_member: e["id"].toString(),
    });
    setSelectedEpfMemberId(e["id"].toString());
    setSendDisabled(false);
    // setUANError("");
    setIsFormValid(true);
    simpleValidator.current.hideMessages();
    simpleValidator.current.visibleFields = [];
    forceUpdate(1);
  };

  const handleUANChange = (e) => {
    setSelectedMember({ ...selectedMember, uan: e });
    // simpleValidator.current.showMessages();
    // forceUpdate(1);

    checkUANValidity(e)
      .then((isValid) => {
        if (isValid == "UAN is already registered") {
          // setIsUANValid(false);
          // setIsFormValid(false);
          setUANError(isValid);
        } else {
          // setIsUANValid(true);
          // setIsFormValid(true);
          setUANError("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkUANValidity = async (uan) => {
    try {
      const response = await fetch(
        `${ADVISORY_CHECK_UAN_EXISTS}?uid=${selectedEpfMemberId}&uan=${uan}`
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  };

  const setDefaultTimer = () => {
    timer.current.counter = timer.current.default;
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

  return (
    <>
      <FintooLoader isLoading={isLoading} />
      <div>
        {//console.log("modalType", modalType)
        }
        {modalType == 0 && (
          <Modal className="popupmodal" centered show={showUANModal}>
            <Modal.Header className="ModalHead d-flex">
              <div className="text-center w-100">Link Your EPF Account </div>
              <div className="">
                <img
                  onClick={() => {
                    setShowUANModal(false);
                    setIsFormValid(true);
                    simpleValidator.current.hideMessages();
                    simpleValidator.current.visibleFields = [];
                    forceUpdate(1);
                    setSelectedMember({ ...selectedMember, uan: "" });
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
                fetch EPF.
              </div>
              <div className=" HeaderModal mt-2">
                <Form noValidate name="goldassetform" onSubmit={handleSubmit}>
                  <div className="row py-md-2">
                    <div className="col-12">
                      <div className="material">
                        <Form.Label>Member*</Form.Label>
                        <Select
                          classNamePrefix="sortSelect"
                          isSearchable={false}
                          styles={customStyles}
                          options={allMembers}
                          onChange={(e) => {
                            handleMemberChange(e);
                          }}
                          value={allMembers.filter(
                            (v) => v.id == selectedMember.id
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row py-md-2 py-2">
                    <div className="col-12">
                      <div className="bank-label">
                        <div
                          style={{
                            fontWeight: "600",
                          }}
                        >
                          UAN*{" "}
                        </div>
                      </div>
                      <div className="bank-info Nominee-name">
                        <div>
                          <input
                            aria-label=""
                            className="shadow-none form-control"
                            placeholder=""
                            type="text"
                            required={true}
                            maxLength={12}
                            minLength={12}
                            style={{
                              border: 0,
                              borderBottom: "1px solid #aeaeae",
                              borderRadius: "0",
                              textTransform: "uppercase",
                              padding: "1px 0px 8px 0px",
                            }}
                            // disabled={uanEditable}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              if (inputValue == "") {
                                setSelectedMember({
                                  ...selectedMember,
                                  uan: inputValue,
                                });
                              } else if (/^\d+$/.test(inputValue)) {
                                handleUANChange(inputValue);
                              }
                            }}
                            value={selectedMember.uan ?? ""}
                            id="uan"
                            name="uan"
                            onBlur={() => {
                              simpleValidator.current.showMessageFor("uan");
                              forceUpdate(1);
                            }}
                          />
                          {/* {errors.userPan && (
                          <p className="error">{errors.userPan}</p>
                        )} */}
                          <>
                            {simpleValidator.current.message(
                              "uan",
                              selectedMember.uan ?? "",
                              "required|min:12",
                              {
                                messages: {
                                  required: "This field is required.",
                                  min: "Please enter at least 12 characters.",
                                },
                              }
                            )}
                          </>

                          <p className="error">{UANError}</p>
                        </div>
                      </div>
                    </div>

                    <div className="d-grid place-content-center mt-4">
                      <div
                        class="error text-center"
                        style={{ fontSize: "16px" }}
                      >
                        {!isFormValid && (
                          <span>Please enter valid required fields</span>
                        )}
                      </div>

                      <div
                        style={{
                          width: "",
                        }}
                        className="d-flex justify-content-center"
                      >
                        <input
                          type="submit"
                          name="send_otp"
                          value="Send OTP"
                          class="default-btn d-block LInkOTPBTn"
                          // data-loading-text="Loading..."
                        />
                      </div>
                    </div>
                  </div>
                </Form>
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
                            {selectedMember.epfotpsentnumber
                              ? selectedMember.epfotpsentnumber
                              : ""}
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
                      {count == 0 && (
                        <p
                          style={{ fontSize: "1.2rem", color: "#042b62" }}
                          className="pointer mt-md-4 blue-color"
                          onClick={() => {
                            sendOTP();
                          }}
                        >
                          Resend OTP
                        </p>
                      )}
                      {count > 0 && (
                        <p
                          className="mt-md-4"
                          // style={{
                          //   fontSize: "1.2rem",
                          // }}
                        >
                          Didn’t receive a code? ({" "}
                          <strong>
                            {moment()
                              .startOf("day")
                              .seconds(count)
                              .format("mm:ss")}
                          </strong>
                          )
                        </p>
                      )}
                    </div>
                  </div>
                  <center>
                    <div
                      type="button"
                      className="btn LInkOTPBTn"
                      onClick={() => {
                        verifyEPFOTP();
                      }}
                    >
                      Submit
                    </div>
                  </center>
                  <p>&nbsp;</p>
                </div>
              </div>
            </Modal>
          </>
        )}
        <Modal className="popupmodal" centered show={epfDeletePopup}>
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
              This will permanently erase the record and its associated
              information.
            </div>
            <div className="d-flex justify-content-center mt-5">
              <button
                onClick={() => {
                  handleEpfDelete("yes");
                }}
                className="outline-btn m-2"
              >
                Yes
              </button>

              <button
                onClick={() => {
                  handleEpfDelete("no");
                }}
                className="outline-btn m-2"
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default LinkEPF;
