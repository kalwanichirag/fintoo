import React, { useEffect, useState, useRef, useCallback } from "react";
import "react-responsive-modal/styles.css";
import { Row } from "react-bootstrap";
import { Modal as ReactModal } from "react-responsive-modal";
import { useDispatch, connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import Form from "react-bootstrap/Form";
import Profile_1 from "../../../Assets/01_pan_verfication.svg";
import Verify from "../../../Assets/verify.png";
import { DATA_BELONGS_TO } from "../../../../constants";
import { errorAlert, getUserId } from "../../../../common_utilities";
import FintooButton from "../../../HTML/FintooButton";
import WhiteOverlay from "../../../../components/HTML/WhiteOverlay";
import { fetchPanStatus } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { updateBasicDetails, userLogout } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";

const VALIDATION_REGEX = {
  PAN: /^([a-zA-Z]){3}(P|H){1}([a-zA-Z]){1}([0-9]){4}([a-zA-Z]){1}?$/,
  NAME: /([a-zA-Z\s])/,
};

const VALIDATION_MESSAGES = {
  PAN_REQUIRED: "Please enter your PAN!",
  PAN_INVALID_LENGTH: "Please enter a valid PAN!",
  PAN_INVALID_FORMAT: "Please enter a valid PAN!",
  NAME_REQUIRED: "Please enter your name as per PAN!",
  NAME_TOO_LONG: "Cannot be more than 50 characters!",
  NAME_INVALID: "Please enter a valid name!",
  KYC_NOT_VERIFIED: "Please complete KYC verification before proceeding",
};

const INPUT_LIMITS = {
  PAN_LENGTH: 10,
  NAME_LENGTH: 50,
};

const KYC_STATUS = {
  VALIDATED: "Validated",
  REGISTERED: "Registered",
};

const GUEST_MESSAGE = "Your session has been expired. Please login to continue";

const validatePan = (panNumber) => {
  const errors = {};

  if (!panNumber) {
    errors.inputPanNumber = VALIDATION_MESSAGES.PAN_REQUIRED;
  } else if (panNumber.length !== INPUT_LIMITS.PAN_LENGTH) {
    errors.inputPanNumber = VALIDATION_MESSAGES.PAN_INVALID_LENGTH;
  } else if (!VALIDATION_REGEX.PAN.test(panNumber)) {
    errors.inputPanNumber = VALIDATION_MESSAGES.PAN_INVALID_FORMAT;
  }

  return errors;
};

const validateName = (name) => {
  const errors = {};

  if (!name) {
    errors.inputPanName = VALIDATION_MESSAGES.NAME_REQUIRED;
  } else if (name.length > INPUT_LIMITS.NAME_LENGTH) {
    errors.inputPanName = VALIDATION_MESSAGES.NAME_TOO_LONG;
  } else if (!VALIDATION_REGEX.NAME.test(name)) {
    errors.inputPanName = VALIDATION_MESSAGES.NAME_INVALID;
  }

  return errors;
};

function Pan(props) {
  const dispatch = useDispatch();
  const userid = getUserId();
  const [form, setForm] = useState({ inputPanNumber: "", inputPanName: "" });
  const [errors, setErrors] = useState({});
  const [kycName, setKycName] = useState(null);
  const [kycVerified, setKycVerified] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [isOpenReKycModal, setIsOpenReKycModal] = useState(false);

  const hasFetchedPan = useRef(false);
  const { inputPanNumber, inputPanName } = form;

  const handleReKycModalClose = useCallback(() => {
    setIsOpenReKycModal(false);
    setIsDisabled(false);
  }, []);

  const setField = useCallback((field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: null,
    }));
  }, []);

  const handleChange = useCallback((e) => {
    const value = e.target.value.toUpperCase();
    setField(e.target.id, value);
    setKycName(null);
    setKycVerified(0);
  }, [setField]);

  const handleNameChange = useCallback((e) => {
  const value = e.target.value;

  if (/^[a-zA-Z ]*$/.test(value)) {
    setField(e.target.id, value);
  }
}, [setField]);

  const getPanStatus = useCallback(async (inputPanNumber) => {
    setShowLoader(true);
    try {
      if (!getUserId()) {
        setShowLoader(false);
        errorAlert(GUEST_MESSAGE).then(() => {
          userLogout();
        });
        return;
      }

      const payload = {
        user_id: getUserId(),
        pan: inputPanNumber,
      };

      const respData = await fetchPanStatus(payload);
      setShowLoader(false);

      if (respData.status_code === 200) {
        const name = respData.data?.kyc_name || "";
        const kycStatus = respData.data?.kyc_status;

        setForm((prev) => ({ ...prev, inputPanNumber, inputPanName: name }));
        setKycName(name);
        setIsDisabled(true);

        if (kycStatus === KYC_STATUS.VALIDATED || kycStatus === KYC_STATUS.REGISTERED) {
          setKycVerified(1);
          props.dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "You will not be able to edit PAN after clicking Next.",
              autoClose: 10000,
              type: "success",
            },
          });
        } else {
          setKycVerified(0);
        }
      } else if (respData.status_code === 400 && respData.message.includes("already associated")) {
        errorAlert(respData.message);
      } else if (respData.status_code === 400 && respData.message.includes("KYC not verified")) {
        setIsOpenReKycModal(true);
      } else if (respData.status_code === 400 && respData.message.includes("KRA API exception")) {
        errorAlert("Unable to connect to the service. Please try again later.");
      } else if (respData.status_code === 400 && respData.message.includes("KRA service after retries")) {
        errorAlert("Maximum retry limit reached. Please try again later.");
      } else if (respData.status_code === 500) {
        setIsDisabled(true);
        setIsOpenReKycModal(true);
      }
    } catch (err) {
      setShowLoader(false);
      setKycVerified(0);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went Wrong. Please try again later.", type: "error" },
      });
    }
  }, [props, dispatch]);

  const updatePanData = useCallback(() => {
    const newErrors = validatePan(inputPanNumber);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    getPanStatus(inputPanNumber);
  }, [inputPanNumber, getPanStatus]);

  const handleSubmit = useCallback(async () => {
    const nameErrors = validateName(inputPanName);
    const panErrors = validatePan(inputPanNumber);

    if (Object.keys(nameErrors).length > 0 || Object.keys(panErrors).length > 0) {
      setErrors({ ...nameErrors, ...panErrors });
      return;
    }

    if (kycVerified !== 1) {
      errorAlert(VALIDATION_MESSAGES.KYC_NOT_VERIFIED);
      return;
    }

    const payload = {
      user_id: userid,
      pan: form.inputPanNumber,
      name: form.inputPanName,
      kyc_user_name: form.inputPanName,
      kyc_verified: kycVerified,
      data_belongs_to: DATA_BELONGS_TO,
    };

    const respData = await updateBasicDetails(payload);

    if (respData.status_code === 200) {
      const isKycVerified = kycVerified === 1;
      if (window.webengage && window.webengage.user) {
        window.webengage.user.setAttribute("we_first_name", payload.name);
        window.webengage.user.setAttribute("fullName", payload.name);
        window.webengage.user.setAttribute("kyc_status", String(isKycVerified));
      }
      props.onNext && props.onNext();
    } else {
      errorAlert(respData.message || "Something went wrong");
    }
  }, [inputPanName, inputPanNumber, kycVerified, form, userid, props]);

  const handleChangePan = useCallback((e) => {
    e.preventDefault();
    setField("inputPanName", "");
    setKycName(null);
    setKycVerified(0);
    setIsDisabled(false);
  }, [setField]);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (props.mainData?.user_pan && !hasFetchedPan.current) {
      hasFetchedPan.current = true;
      const pan = props.mainData.user_pan.toUpperCase();
      setForm({ inputPanNumber: pan, inputPanName: "" });
      getPanStatus(pan);
    }
  }, [props.mainData, getPanStatus]);

  useEffect(() => {
    props.dispatch({ type: "SET_PROGRESS_NAME", payload: kycName });
  }, [props, kycName]);

  return (
    <Row className="reverse">
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
        onClose={handleReKycModalClose}
      >
        <div>
          <h3 className="text-center HeaderText">Attention !</h3>
          <div className="p-2" style={{ fontSize: "1.2rem" }}>
            <p>Dear Client,</p>
            <p>
              We regret to inform you that your KYC verification has failed
              due to certain reasons. As per the recent circular by SEBI, we
              need you to undergo the Re-KYC (Re-verification of KYC) process.
            </p>
            <p>
              Ensuring compliance with KYC norms is crucial for regulatory
              purposes and to maintain the integrity of our financial
              services. Therefore, we kindly request your cooperation in
              completing the Re-KYC process at your earliest convenience.
            </p>
            <p>
              Please{" "}
              <a
                href="https://investor-web.hdfcfund.com/kyc-verification"
                onClick={handleReKycModalClose}
                target="_blank"
                rel="noopener noreferrer"
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
                  handleReKycModalClose();
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
                onClick={handleReKycModalClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </ReactModal>

      <ToastContainer limit={1} />
      <WhiteOverlay show={showLoader} />

      <div className="ProfileImg col-12 col-md-6">
        <div>
          <img src={Profile_1} alt="PAN Verification" />
        </div>
      </div>

      <div className="col-12 col-md-6 RightPanel">
        <div className="rhl-inner">
          <h4>PAN Verification</h4>
          <p className="mt-4 mb-5">
            To comply with regulatory requirements, we require your PAN Number to process your investments. This is a mandatory step to ensure the security and legality of your transactions on our platform.
          </p>

          <div className="pn-rht-bx">
            <div className="pn-rht-bx-txt">
              <Form.Control
                type="text"
                className="InputText shadow-none w-100"
                id="inputPanNumber"
                name="inputPanNumber"
                placeholder="Enter PAN"
                aria-describedby="inputPanNumBlock"
                maxLength={INPUT_LIMITS.PAN_LENGTH}
                onChange={handleChange}
                isInvalid={!!errors.inputPanNumber}
                disabled={isDisabled || showLoader}
                value={inputPanNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.inputPanNumber}
              </Form.Control.Feedback>
            </div>
            <div className="pt-4 pt-md-0">
              <FintooButton
                className="d-block me-0 ms-auto"
                type="button"
                onClick={updatePanData}
                title={showLoader ? "Processing..." : "Verify"}
                disabled={showLoader || inputPanNumber.length !== INPUT_LIMITS.PAN_LENGTH}
              />
            </div>
          </div>

          {kycName != null && kycName !== "" && (
            <>
              <hr className="ProfileHr" />
              <div className="VerifyDetails">
                <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Please verify your name and click Next
                </p>
                <div>
                  <div className="pn-rht-bx-txt">
                    <div className="py-2 d-flex align-items-center">
                      <div>
                        <img style={{ width: "32px" }} src={Verify} alt="Verified" />
                      </div>
                      <div>
                        <h4 className="m-0 PanName">{kycName}</h4>
                      </div>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.inputPanName}
                    </Form.Control.Feedback>
                  </div>
                  <div className="profile-btn-container fintoo-top-border pt-4 mt-4">
                    <p>
                      <span className="NotCorrect">Incorrect,</span>
                      <span className="ChangePan" onClick={handleChangePan}>
                        &nbsp;<b>Change PAN</b>
                      </span>
                    </p>
                    <FintooButton
                      type="button"
                      onClick={handleSubmit}
                      title="Next"
                      disabled={kycVerified !== 1}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {kycName != null && kycName === "" && (
            <>
              <hr className="ProfileHr" />
              <div className="VerifyDetails">
                <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Please enter your name as per PAN
                </p>
                <div className="pn-rht-bx">
                  <div className="pn-rht-bx-txt">
                    <Form.Control
                      type="text"
                      className="InputText shadow-none w-100"
                      id="inputPanName"
                      name="inputPanName"
                      placeholder="Enter Name"
                      aria-describedby="inputPanNameBlock"
                      maxLength={INPUT_LIMITS.NAME_LENGTH}
                      onChange={handleNameChange}
                      isInvalid={!!errors.inputPanName}
                      value={inputPanName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.inputPanName}
                    </Form.Control.Feedback>
                  </div>
                  <div className="profile-btn-container">
                    <FintooButton
                      type="button"
                      onClick={handleSubmit}
                      title="Next"
                      disabled={kycVerified !== 1}
                    />
                  </div>
                </div>
              </div>
              <div className="MobilePanUI">
                <p>
                  <span className="NotCorrect">Incorrect,</span>
                  <span className="ChangePan" onClick={handleChangePan}>
                    &nbsp;<b>Change PAN</b>
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Row>
  );
}

const mapStateToProps = (state) => ({
  progressValue: state.progressValue,
  progressTitle: state.progressTitle,
});

export default connect(mapStateToProps)(Pan);