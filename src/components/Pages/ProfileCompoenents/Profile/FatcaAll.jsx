import { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import Fatcaimg from "../../../Assets/05_Fatca_details.svg";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import Back from "../../../Assets/left-arrow.png";
import Resident from "../../../Assets/04_fatca_resident.svg";
import NRIResident from "../../../Assets/NRI.svg";
import NROResident from "../../../Assets/nro.png";
import HoldingNatureImg from "../../../Assets/07_holding_nature_single.svg";
import HoldingNatureJoint from "../../../Assets/08_holding_nature_joint.svg";
import HoldingNatureSurvivor from "../../../Assets/09_holding_nature_anyone_survivor.svg";
import { SegmentedControl } from "segmented-control";
import FintooButton from "../../../HTML/FintooButton";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import { DATA_BELONGS_TO } from "../../../../constants";
import axios from "axios";
import { DMF_BASE_URL,  } from "../../../../constants";
import commonEncode from "../../../../commonEncode";
import { Modal as ReactModal } from "react-responsive-modal";
import {
  CheckSession,
  fetchEncryptData,
  getParentUserId,
  getUserId,
  memberId,
} from "../../../../common_utilities";
import { useDispatch, useSelector } from "react-redux";
import FintooInlineLoader from "../../../FintooInlineLoader";
import { addFatcaDetails,GetFatcaDetails } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { fetchUserProfileDetails, updateBasicDetails, userLogin } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";

function FatcaAll(props) {
  const user_id = getUserId();
  const [userDetails, setUserDetails] = useState("");
  const [validated, setValidated] = useState(false);
  const [isPoliticallyExposed, setPoliticallyExposed] = useState("2");
  const [residential, setResidential] = useState("RES");
  const [updateSeg, setUpdateSeg] = useState(0);
  const [parentName, setParentName] = useState("");
  const [parentProfile, setParentProfile] = useState([]);
  const allUserData = localStorage.getItem("user");
  const [jointDropdown, setJointDropdown] = useState([]);
  const userData = JSON.parse(allUserData);
  const dispatch = useDispatch();
  const showBack = useSelector((state) => state.isBackVisible);
  const [isLoading, setIsLoading] = useState(false);
  const [holdingNature, setHoldingNature] = useState("");
  const [holding, setHolding] = useState("");
  const [isOpenReKycModal, setIsOpenReKycModal] = useState(false);
  const [error, setError] = useState(false);
  const [fatcaId, setFatcaId] = useState(false);
  const [userFatcaDetails, setUserFatcaDetails] = useState("");

  let navDynamicNext = "";
  let navDynamicPrev = "";

  const options = [
    {
      label: "Yes",
      value: "Yes",
      default: isPoliticallyExposed == "1" ? true : false,
    },
    {
      label: "No",
      value: "No",
      default: isPoliticallyExposed == "2" ? true : false,
    },
    {
      label: "Partially Exposed",
      value: "Partially Exposed",
      default: isPoliticallyExposed == "3" ? true : false,
    },
  ];

  const options1 = [
    {
      label: "Yes",
      value: "1",
      default: residential == "NRO" || residential == "NRI" ? true : false,
    },
    { label: "No", value: "0", default: residential == "RES" ? true : false },
  ];

  const [value, setValue] = useState("");

  const [value1, setValue1] = useState("2");

  if (residential == "NRI" && value == "1") {
    navDynamicNext = "FatcaAdd";
    navDynamicPrev = "FatcaAll";
  }
  if (residential == "RES" && value == "0") {
    navDynamicNext = "NomineeDetails";
    navDynamicPrev = "FatcaAll";
  }

  const onLoadInIt = async () => {
    try {
      
      var res = await fetchUserProfileDetails(user_id);
      var user_details = res.data;

      setUserDetails(user_details);
    } catch (e) {
      
    }
  };

  const defaultValues = async () => {
    // Check if userDetails exists before accessing its properties
    if (!userDetails) {
      setResidential("RES");
      setHolding("AHN-1");
      setPoliticallyExposed("2");
      setUpdateSeg((v) => ++v);
      return;
    }

    if (userDetails.user_residential_status != "") {
      if (userDetails.user_residential_status == "RES") {
        setResidential("RES");
      }
      if (userDetails.user_residential_status == "NRI") {
        setResidential("NRI");
      }
    } else {
      setResidential("RES");
    }
    
    if (userDetails.user_holding_nature) {
      if (userDetails.user_holding_nature == "AHN-1") {
        setHolding("AHN-1");
      }
      if (userDetails.user_holding_nature == "AHN-3") {
        setHolding("AHN-3");
      }
      if (userDetails.user_holding_nature == "AHN-2") {
        setHolding("AHN-2");
      }
    } else {
      setHolding("AHN-1");
    }

    if (userDetails.user_politically_exposed == "Yes") {
      setPoliticallyExposed("1");
    } else if (userDetails.user_politically_exposed == "No") {
      setPoliticallyExposed("2");
    } else if (userDetails.user_politically_exposed == "Partially Exposed") {
      setPoliticallyExposed("3");
    } else{
      setPoliticallyExposed("2");
    }

    setUpdateSeg((v) => ++v);
  };

  useEffect(() => {
    if (typeof userDetails == "string" || !userDetails) return;
    defaultValues();
    getUserParent();
    if (
      typeof userDetails != "string" &&
      userDetails &&
      "joint_survivor_user_id" in userDetails &&
      userDetails.joint_survivor_user_id
    ) {
      setHoldingNature(userDetails.joint_survivor_user_id);
    }
  }, [userDetails]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      ApiCall();
    } else {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: holdingNature ? "Please try again." : "Please select member",
          type: "error",
          autoClose: 3000,
        },
      });
    }
    setValidated(true);
  };

  const getUserParent = async () => {
    // try {
    //   setIsLoading(true);
    //   var config_joint = {
    //     method: "POST",
    //     url: DMF_JOINT_DROPDOWN_API_URL,
    //     data: { user_id: "" + getParentUserId() },
    //   };

    //   var respon = await fetchEncryptData(config_joint);
    //   setJointDropdown(respon.data);

    //   var config_user = {
    //     method: "POST",
    //     url: '',
    //     data: { user_id: "" + getParentUserId() },
    //   };

    //   var resp = await fetchEncryptData(config_user);
      
    //   setParentName(resp.data);

    //   var config_profile = {
    //     method: "POST",
    //     url: '',
    //     data: { pan: resp.data.pan },
    //   };

    //   var res = await fetchEncryptData(config_profile);
    //   setParentProfile(res.data);
    //   setIsLoading(false);
    // } catch (e) {
    //   setIsLoading(false);
    // }
  };

  const SegmentedChange = async () => {
    if (residential == "RES") {
      setUpdateSeg((v) => ++v);
    }
    if (residential == "NRI") {
      setUpdateSeg((v) => ++v);
    }
  };

  const ResiChange = async () => {
    if (value == "1") {
      setResidential("NRI");
    }
    if (value == "0") {
      setResidential("RES");
    }
  };

  useEffect(() => {
    ResiChange();
  }, [value]);

  const ApiCall = async () => {
    let joint_survivor_user_id = "";

    var myHolding = holding;
    if (myHolding == "AHN-2") {
      myHolding = "anyone_survivor";
      joint_survivor_user_id = holdingNature;
    } else if (myHolding == "AHN-3") {
      joint_survivor_user_id = holdingNature;
    } else {
      joint_survivor_user_id = "0";
    }
    if (myHolding === "") {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Please select the account holding nature",
          type: "error",
          autoClose: 2000,
        },
      });
      return;
    }

    props.mainData.residential_status = value;
    props.mainData.politically_exposed = value1;

    var payload = {
      user_id: getUserId(),
      residential_status: residential,
      holding_nature: holding,
      politically_exposed: value1,
      // joint_survivor_user_id: joint_survivor_user_id
    }

    let respData = await updateBasicDetails(payload);

    if (respData.status_code == 200) {
      addfatca();
      setTimeout(() => {
        props.onNext(navDynamicNext);
      }, 3500);
    } else {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: respData["message"],
          type: "error",
          autoClose: 2000,
        },
      });
    }
  };

  useEffect(() => {
    onLoadInIt();
    // // checksession();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  function onChangeValue(event) {
    setResidential(event.target.value);
  }
  const [isActive, setActive] = useState("true");

  const handleToggle = () => {
    setActive(!isActive);
  };
  //

  function onChangeValue1(event) {
    setHolding(event.target.value);
  }
  const [isActive1, setActive1] = useState("true");

  const apiFatcaDetails = async () => {
      var user_id = getUserId();
      try {
        
        var response = await GetFatcaDetails(user_id);
        const fatca_response = response?.data;
        setUserFatcaDetails(fatca_response);
        
      } catch (e) {
        console.log("catch", e);
      }
    };
  
    useEffect(() => {
      apiFatcaDetails();
    }, []);

  const addfatca = async () => {
    try {
     
      let payload = {
        user_id: getUserId(),
        data_belongs_to: DATA_BELONGS_TO,
        fatca_nationality: residential == "RES" ? "India" : "",
        ...(userFatcaDetails?.fatca_overseas_address && {
          fatca_overseas_address: userFatcaDetails.fatca_overseas_address,
        }),
        ...(userFatcaDetails?.fatca_country_id && {
          fatca_country_id: userFatcaDetails.fatca_country_id,
        }),
        ...(userFatcaDetails?.fatca_city && {
          fatca_city: userFatcaDetails.fatca_city,
        }),
        ...(userFatcaDetails?.fatca_state && {
          fatca_state: userFatcaDetails.fatca_state,
        }),
        ...(userFatcaDetails?.fatca_zip_code && {
          fatca_zip_code: userFatcaDetails.fatca_zip_code
        })
      }
      payload.fatca_overseas_address = userFatcaDetails?.fatca_overseas_address || "";
      payload.fatca_country_id = userFatcaDetails?.fatca_country_id || "";
      payload.fatca_city = userFatcaDetails?.fatca_city || "";
      payload.fatca_tax_payer_id_one = userFatcaDetails?.fatca_tax_payer_id_one || "";
      payload.fatca_id_type_one = userFatcaDetails?.fatca_id_type_one || "";
      payload.fatca_tax_payer_country_one = userFatcaDetails?.fatca_tax_payer_country_one || "";
      payload.fatca_tax_payer_id_two = userFatcaDetails?.fatca_tax_payer_id_two || "";
      payload.fatca_id_type_two = userFatcaDetails?.fatca_id_type_two || "";
      payload.fatca_tax_payer_country_two = userFatcaDetails?.fatca_tax_payer_country_two || "";
      payload.fatca_tax_payer_id_three = userFatcaDetails?.fatca_tax_payer_id_three || "";
      payload.fatca_id_type_three = userFatcaDetails?.fatca_id_type_three || "";
      payload.fatca_tax_payer_country_three = userFatcaDetails?.fatca_tax_payer_country_three || "";
      
      var response = await addFatcaDetails(payload);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: response["message"],
          type: "success",
          autoClose: 2000,
        },
      });
      if (response?.data?.fatca_id) {
        setFatcaId(response.data.fatca_id);
      } else {
        setFatcaId(null);
      }

    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went Wrong...", type: "error" },
      });
      setError(true);
    }
  };

  return (
    <>
      <ReactModal
        classNames={{
          modal: "ModalpopupContentWidth",
        }}
        open={isOpenReKycModal}
        showCloseIcon={true}
        center
        animationDuration={0}
        closeOnOverlayClick={false}
        large
        onClose={() => {
          setIsOpenReKycModal(false);
          setIsDisabled(false);
        }}
      >
        <div>
          <h3 className="text-center HeaderText">Attention !</h3>
          <div className="p-2" style={{ fontSize: "1.2rem" }}>
            <p>Dear Client,</p>
            <p>
              We regret to inform you that your KYC verification has failed due
              to certain reasons. As per the recent circular by SEBI, we need
              you to undergo the Re-KYC (Re-verification of KYC) process.
            </p>
            <p>
              Ensuring compliance with KYC norms is crucial for regulatory
              purposes and to maintain the integrity of our financial services.
              Therefore, we kindly request your cooperation in completing the
              Re-KYC process at your earliest convenience.
            </p>
            <p>
              Please{" "}
              <a
                href="https://investor-web.hdfcfund.com/kyc-verification"
                onClick={() => {
                  setIsOpenReKycModal(false);
                  setIsDisabled(false);
                }}
                target="_blank"
              >
                Click Here
              </a>{" "}
              to initiate the Re-KYC process. Your understanding and prompt
              action in this matter are greatly appreciated.
            </p>
            <div
              className="ButtonBx aadharPopUpFooter"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button
                className="ReNew"
                onClick={() => {
                  setIsOpenReKycModal(false);
                  setIsDisabled(false);
                  window.open(
                    "https://investor-web.hdfcfund.com/kyc-verification",
                    "_blank"
                  );
                }}
              >
                Re-KYC
              </button>
              <button
                style={{ backgroundColor: "#999" }}
                className="ReNew"
                onClick={() => {
                  setIsOpenReKycModal(false);
                  setIsDisabled(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
      <div className="row">
        <div className="ProfileImg col-12 col-md-6">
          <div>
            <img
              src={
                process.env.REACT_APP_STATIC_URL +
                "media/DMF/05_Fatca_details.svg"
              }
              alt="Fatcaimg"
            />
          </div>
        </div>
        <div className="RightPanel col-12 col-md-6">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="rhl-inner">
              {showBack == true && (
                <FintooProfileBack
                  title="FATCA Details"
                  onClick={() => props.onPrevious()}
                />
              )}
              <div className="Fatca">
                <div className="profile-space profile-border">
                  <h5 className="ResiStatus">Residential Status</h5>
                  <p>Please select your residential status</p>
                  <br />
                  <div
                    className="d-flex text-center"
                    onChange={onChangeValue}
                    style={{ marginTop: "0rem" }}
                  >
                    <div
                      className={`w-33 rs-type-bx pointer ${
                        residential == "RES" ? "active" : ""
                      }`}
                    >
                      <div
                        className="rs-type-ck"
                        onClick={() => {
                          setResidential("RES");
                          SegmentedChange();
                        }}
                      >
                        <label>
                          <img
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/04_fatca_resident.svg"
                            }
                            style={{
                              width: "60px",
                            }}
                          />
                        </label>
                        <div className="ResidentType">
                          <span>RES-Resident</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-33 rs-type-bx pointer ${
                        residential == "NRI" ? "active" : ""
                      }`}
                    >
                      <div
                        className="rs-type-ck"
                        onClick={() => {
                          setResidential("NRI");
                          SegmentedChange();
                        }}
                      >
                        <label>
                          <img
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/NRI.svg"
                            }
                            className={
                              residential.toLowerCase() == "nri"
                                ? "ColorChangeDark"
                                : "ColorChange"
                            }
                            style={{
                              width: "60px",
                            }}
                          />
                        </label>
                        <div className="ResidentType">
                          <span style={{ whiteSpace: "nowrap" }}>
                            NRI – Non-Resident Indian
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="profile-space profile-border">
                  <h5 className="ResiStatus">
                    Tax Resident in any other country than India?
                  </h5>
                  <div>
                    <SegmentedControl
                      name="taxResident"
                      className="my-segment"
                      options={options1}
                      key={"sg-" + updateSeg}
                      style={{ width: "66.66%", color: "#042b62" }} // purple400
                      setValue={(newValue) => {
                        setValue(newValue);
                        if (newValue === "yes") {
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="profile-space profile-border">
                  <h5 className="ResiStatus">Account Holding Nature</h5>
                  <p>
                    {" "}
                    <b>Note</b> : The nature of the first account will by default be Single.
                  </p>
                  <br />
                  <div
                    className="d-flex text-center"
                    style={{ marginTop: "0rem" }}
                  >
                    <div
                      className={`w-33 rs-type-bx pointer ${
                        holding == "AHN-1" ? "active" : "AHN-1"
                      }`}
                      onClick={() => setHolding("AHN-1")}
                    >
                      <label htmlFor="Single">
                        <img
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/07_holding_nature_single.svg"
                          }
                          style={{
                            width: "60px",
                            cursor: "pointer",
                          }}
                        />
                      </label>
                      <div className="ResidentType">
                        <span>Single</span>
                      </div>
                    </div>

                    <div
                      className={`w-33 rs-type-bx pointer  ${
                        holding == "AHN-3" ? "active" : ""
                      }`}
                      onClick={() => {
                        setHolding((v) => {
                          if (getParentUserId() !== getUserId()) {
                            return "AHN-3";
                          } else {
                            return v;
                          }
                        });
                      }}

                    >
                      <label htmlFor="Joint">
                        <img
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/08_holding_nature_joint.svg"
                          }
                          style={{
                            width: "60px",
                            cursor: "pointer",
                          }}
                        />
                      </label>
                      <div className="ResidentType">
                        <span>Joint</span>
                      </div>
                    </div>

                    <div
                      className={`w-33 rs-type-bx pointer  ${
                        holding == "AHN-2" ? "active" : ""
                      }`}
                      onClick={() =>
                        setHolding((v) => {
                          if (getParentUserId() != getUserId()) {
                            return "AHN-2";
                          } else {
                            return v;
                          }
                        })
                      }
                    >
                      <label htmlFor="Anyone">
                        <img
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/09_holding_nature_anyone_survivor.svg"
                          }
                          style={{
                            width: "60px",
                            cursor: "pointer",
                          }}
                        />
                      </label>
                      <div className="ResidentType">
                        <span style={{ whiteSpace: "nowrap" }}>
                          Anyone or Survivor
                        </span>
                      </div>
                    </div>
                  </div>
                  {holding == "joint" || holding == "any" ? (
                    <div className="d-md-flex justify-content-start">
                      <div className="w-50  mt-4 ms-auto pe-4">
                        <div
                          className={`d-flex data-loader align-items-center ${
                            isLoading
                              ? "justify-content-between"
                              : "justify-content-end"
                          }`}
                        >
                          <FintooInlineLoader isLoading={isLoading} />

                          <Form.Select
                            aria-label="Default select example"
                            className="shadow-none"
                            style={{
                              borderRadius: "10px",
                              height: "3rem",
                              outline: "none",
                              marginLeft: "-1.5rem",
                            }}
                            required
                            value={holdingNature}
                            onChange={(e) => {
                              setHoldingNature(e.target.value);
                            }}
                          >
                            <option value={""}>---Select---</option>
                            {jointDropdown.map((v) => (
                              <option value={v.user_id}>{v.name}</option>
                            ))}
                          </Form.Select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="profile-space profile-border">
                  <h5 className="ResiStatus">Are you politically exposed?</h5>
                  <div className="">
                    <SegmentedControl
                      className="my-segment line-2-seg"
                      name="politicalStatus"
                      width={"100%"}
                      key={"sg-" + updateSeg}
                      options={options}
                      style={{ width: "100%", color: "#042b62" }} // purple400
                      setValue={(newValue) => {
                        setValue1(newValue);
                        if (newValue === "yes") {
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="profile-space">
                  <FintooButton
                    className="d-block ms-auto me-0"
                    title={"Next"}
                    type="submit"
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default FatcaAll;
