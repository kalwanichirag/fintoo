import { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import { Form } from "react-bootstrap";
import { SegmentedControl } from "segmented-control";
import FintooButton from "../../../HTML/FintooButton";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import { DATA_BELONGS_TO } from "../../../../constants";
import { Modal as ReactModal } from "react-responsive-modal";
import { getParentUserId, getUserId } from "../../../../common_utilities";
import { useDispatch, useSelector } from "react-redux";
import FintooInlineLoader from "../../../FintooInlineLoader";
import { addFatcaDetails, GetFatcaDetails } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { fetchUserProfileDetails, updateBasicDetails } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";

const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 3500,
};

const STATUS_CODE = {
  SUCCESS: 200,
};

const TOAST_TYPE = {
  SUCCESS: "success",
  ERROR: "error",
};

function FatcaAll(props) {
  const user_id = getUserId();

  const [userDetails, setUserDetails] = useState(null);
  const [validated, setValidated] = useState(false);
  const [residential, setResidential] = useState("RES");
  const [updateSeg, setUpdateSeg] = useState(0);
  const [jointDropdown, setJointDropdown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [holdingNature, setHoldingNature] = useState("");
  const [holding, setHolding] = useState("Single");
  const [isOpenReKycModal, setIsOpenReKycModal] = useState(false);
  const [error, setError] = useState(false);
  const [fatcaId, setFatcaId] = useState(null);
  const [userFatcaDetails, setUserFatcaDetails] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [value, setValue] = useState("0");
  const [value1, setValue1] = useState("No");

  const dispatch = useDispatch();
  const showBack = useSelector((state) => state.isBackVisible);

  let navDynamicNext = value === "1" ? "FatcaAdd" : "NomineeDetails";

  const options = [
    { label: "Yes", value: "Yes", default: value1 === "Yes" },
    { label: "No", value: "No", default: value1 === "No" },
    {
      label: "Partially Exposed",
      value: "Partially Exposed",
      default: value1 === "Partially Exposed",
    },
  ];

  const options1 = [
    { label: "Yes", value: "1", default: residential === "NRI" },
    { label: "No", value: "0", default: residential === "RES" },
  ];

  const onLoadInIt = async () => {
    try {
      const res = await fetchUserProfileDetails(user_id);
      setUserDetails(res?.data || null);
    } catch (e) {
      console.error("Error loading user details:", e);
    }
  };

  const defaultValues = () => {
    if (!userDetails) {
      setResidential("RES");
      setHolding("Single");
      setValue1("No");
      setValue("0");
      setUpdateSeg((v) => v + 1);
      return;
    }

    const isNRI = userDetails.user_residential_status === "NRI";

    setResidential(isNRI ? "NRI" : "RES");
    setValue(isNRI ? "1" : "0");

    const holdingMap = {
      Single: "Single",
      "Either or survivor": "Either or survivor",
      Joint: "Joint",
    };

    setHolding(holdingMap[userDetails.account_holding_nature_label] || "Single");

    const politicalMapReverse = {
      "1": "Yes",
      "2": "No",
      "3": "Partially Exposed",
      Yes: "Yes",
      No: "No",
      "Partially Exposed": "Partially Exposed",
    };

    setValue1(
      politicalMapReverse[userDetails.user_politically_exposed] || "No"
    );

    setUpdateSeg((v) => v + 1);
  };

  useEffect(() => {
    if (!userDetails) return;

    defaultValues();
    getUserParent();

    if (userDetails?.joint_survivor_user_id) {
      setHoldingNature(userDetails.joint_survivor_user_id);
    }
  }, [userDetails]);

  const getUserParent = async () => {
    // Placeholder for future implementation
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    if (submitting) return;

    if (form.checkValidity()) {
      ApiCall();
    } else {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: holdingNature
            ? "Please try again."
            : "Please select member",
          type: TOAST_TYPE.ERROR,
          autoClose: TOAST_DURATION.MEDIUM,
        },
      });
    }
    setValidated(true);
  };
  const SegmentedChange = () => {
    setUpdateSeg((v) => v + 1);
  };

  const ResiChange = () => {
    setResidential(value === "1" ? "NRI" : "RES");
  };

  useEffect(() => {
    ResiChange();
  }, [value]);

  const ApiCall = async () => {
    if (submitting) return;

    let joint_survivor_user_id =
      holding === "Joint" || holding === "Either or survivor"
        ? holdingNature
        : "";

    if (!holding) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Please select the account holding nature",
          type: TOAST_TYPE.ERROR,
          autoClose: TOAST_DURATION.SHORT,
        },
      });
      return;
    }

    if (!userFatcaDetails) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Please wait, loading FATCA details",
          type: TOAST_TYPE.ERROR,
          autoClose: TOAST_DURATION.SHORT,
        },
      });
      return;
    }

    const payload = {
      user_id,
      residential_status: residential,
      holding_nature: holding,
      politically_exposed: value1 || "No"
    };

    try {
      setSubmitting(true);

      const respData = await updateBasicDetails(payload);

      if (respData?.status_code === STATUS_CODE.SUCCESS) {
        await addfatca();
        props.onNext(navDynamicNext);
      } else {
        throw new Error(respData?.message);
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: error?.message || "Something went wrong",
          type: TOAST_TYPE.ERROR,
          autoClose: TOAST_DURATION.SHORT,
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    onLoadInIt();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const apiFatcaDetails = async () => {
    try {
      const response = await GetFatcaDetails(user_id);
      setUserFatcaDetails(response?.data || null);
    } catch (error) {
      console.error("Error fetching FATCA details:", error);
    }
  };

  useEffect(() => {
    apiFatcaDetails();
  }, []);

  const addfatca = async () => {
    try {
      const payload = {
        user_id,
        data_belongs_to: DATA_BELONGS_TO,
        fatca_nationality: residential === "RES" ? "India" : "",
        fatca_overseas_address: userFatcaDetails?.fatca_overseas_address || "",
        fatca_country_id: userFatcaDetails?.fatca_country_id || "",
        fatca_city: userFatcaDetails?.fatca_city || "",
        fatca_state: userFatcaDetails?.fatca_state || "",
        fatca_zip_code: userFatcaDetails?.fatca_zip_code || "",
        fatca_tax_payer_id_one: userFatcaDetails?.fatca_tax_payer_id_one || "",
        fatca_id_type_one: userFatcaDetails?.fatca_id_type_one || "",
        fatca_tax_payer_country_one: userFatcaDetails?.fatca_tax_payer_country_one || "",
        fatca_tax_payer_id_two: userFatcaDetails?.fatca_tax_payer_id_two || "",
        fatca_id_type_two: userFatcaDetails?.fatca_id_type_two || "",
        fatca_tax_payer_country_two: userFatcaDetails?.fatca_tax_payer_country_two || "",
        fatca_tax_payer_id_three: userFatcaDetails?.fatca_tax_payer_id_three || "",
        fatca_id_type_three: userFatcaDetails?.fatca_id_type_three || "",
        fatca_tax_payer_country_three: userFatcaDetails?.fatca_tax_payer_country_three || "",
      };

      const response = await addFatcaDetails(payload);

      if (!response) throw new Error("FATCA failed");

      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: response.message || "FATCA added",
          type: TOAST_TYPE.SUCCESS,
          autoClose: TOAST_DURATION.SHORT,
        },
      });

      setFatcaId(response?.data?.fatca_id || null);
    } catch (error) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Something went wrong while adding FATCA details",
          type: TOAST_TYPE.ERROR,
          autoClose: TOAST_DURATION.SHORT,
        },
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
                    style={{ marginTop: "0rem" }}
                  >
                    <div
                      className={`w-33 rs-type-bx pointer ${
                        residential === "RES" ? "active" : ""
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
                        residential === "NRI" ? "active" : ""
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
                              residential.toLowerCase() === "nri"
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
                      style={{ width: "66.66%", color: "#042b62" }}
                      setValue={(newValue) => {
                        setValue(newValue);
                        if (newValue === "1") {
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
                        holding === "Single" ? "active" : ""
                      }`}
                      onClick={() => setHolding("Single")}
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
                      className={`w-33 rs-type-bx pointer ${
                        holding === "Joint" ? "active" : ""
                      }`}
                      onClick={() => {
                        setHolding((v) => {
                          if (getParentUserId() !== getUserId()) {
                            return "Joint";
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
                      className={`w-33 rs-type-bx pointer ${
                        holding === "Either or survivor" ? "active" : ""
                      }`}
                      onClick={() =>
                        setHolding((v) => {
                          if (getParentUserId() !== getUserId()) {
                            return "Either or survivor";
                          }
                          return v;
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
                  {holding === "joint" || holding === "any" ? (
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
