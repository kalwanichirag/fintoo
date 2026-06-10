import { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import Profile_1 from "../../../Assets/06_banking_app.svg";
import { Row, Modal } from "react-bootstrap";
import "../Fatca/style.css";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import FintooButton from "../../../HTML/FintooButton";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getMinorUserId,
  getPublicMediaURL,
  memberId,
} from "../../../../common_utilities";
import { DATA_BELONGS_TO } from "../../../../constants";
import {
  addBank,
  BseClientRegistration,
  FatcaUpload,
} from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";

function ConfirmBank(props) {
  const dispatch = useDispatch();
  const showBack = useSelector((state) => state.isBackVisible);

  const user_id = props.value === "minor" ? getMinorUserId() : memberId();

  const [bank, setBank] = useState({});
  const [uccmessage, setUccMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const getAccountHoldingNatureId = (status) => {
    if (status === "NRI" || status === "NRO") return "Either or survivor";
    return "Single";
  };

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    loadBankDetails();
  }, []);

  const loadBankDetails = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("bankDetails"));
      setBank(stored || {});
    } catch {
      setBank({});
    }
  };

  const handleBseError = (res) => {
    let rawError =
      res?.data ||
      res?.Remarks ||
      res?.message ||
      "";

    if (!rawError) return;

    let cleaned = rawError.toUpperCase().replace("FAILED:", "").trim();

    const map = {
      "INVALID ACCOUNT INFORMATION":
        "Something went wrong, kindly contact support.",

      "INVALID ACCOUNT TYPE FOR BANK 1":
        "The selected bank account type is not valid. Please check whether it is Savings/Current.",

      "INVALID OCCUPATION CODE":
        "The occupation code provided is invalid. Please select the correct occupation.",

      "OCCUPATION CODE DOES NOT MATCH WITH OCCUPATION TYPE":
        "Selected occupation details do not match. Please review and update occupation type and code correctly.",

      "INVALID TYPE OF IDENTIFICATION DOCUMENT 1":
        "The selected identification document type is not valid. Please choose a valid document (e.g., PAN, Aadhaar)",

      "INVALID CO_BIR_INC VALUE":
        "Income details provided are not valid. Please review and select the correct income range.",

      "ONLY ONE DEFAULT FLAG ALLOWED":
        "Only one bank account can be marked as default. Please update your selection accordingly."
    };

    let finalMsg = rawError;

    for (let key in map) {
      if (cleaned.includes(key)) {
        finalMsg = map[key];
        break;
      }
    }

    setUccMessage(finalMsg);
    setShowModal(true);
  };

  const handleFatcaUpload = async () => {
    try {
      const payload = { user_id, data_belongs_to: DATA_BELONGS_TO };
      const res = await FatcaUpload(payload);

      if (res?.status_code === 200) {
        toast.success("User details updated successfully.", {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 2000,
        });

        const isNRI =
          ["NRE", "NRO", "NRI"].includes(
            props?.mainData?.residential_status
          );

        if (isNRI) {
          props.setShowPanel("BankCheque");
        } else {
          props.setShowPanel("UploadSignature");
        }
      } else {
        handleBseError(res);
      }
    } catch {
      handleBseError(res);
    }
  };

  const handleClientRegistration = async () => {
    try {
      const payload = { user_id, data_belongs_to: DATA_BELONGS_TO };
      const res = await BseClientRegistration(payload);

      const isSuccess =
        res?.status_code === 200 ||
        res?.status_code === "200" ||
        (res?.message?.includes("already") &&
          res?.message?.includes("bank"));

      if (isSuccess) {
        handleFatcaUpload();
      } else {
        handleBseError(res);
      }
    } catch {
      handleBseError(res);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!bank || !Object.keys(bank).length) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "No bank details found.",
            type: "error",
            autoClose: 3000,
          },
        });
        return;
      }

      const payload = {
        ...bank,
        single_survivor: getAccountHoldingNatureId(
          props?.mainData?.user_residential_status
        ),
      };

      delete payload.bank_bse_code;

      const res = await addBank(payload);

      const isSuccess =
        res?.status_code === 200 ||
        (res?.message?.includes("added") &&
          res?.message?.includes("Bank"));

      if (isSuccess) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Bank details have been saved.",
            type: "success",
            autoClose: 3000,
          },
        });

        handleClientRegistration();
      } else {

        const msg = res?.message || "";

        const message = msg.toLowerCase().includes("incorrect value")
          ? "Bank account number must be 7 to 18 digits"
          : msg || "Error while adding bank.";

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message,
            type: "error",
            autoClose: 3000,
          },
        });
      }
    } catch (err) {
      console.error(err);

      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message:
            "Unable to save bank details, please contact customer support.",
          type: "error",
          autoClose: 3000,
        },
      });
    }
  };

  return (
    <>
      <ToastContainer limit={1} />
      <Row className="reverse">
        <Modal
          backdrop="static"
          size="md"
          centered
          show={showModal}
          onHide={() => setShowModal(false)}
        >
          <Modal.Body>
            <div className="modal-body-box text-center">
              <h5><b>Client registration failed</b></h5>

              <p>{uccmessage}</p>

              <div className="pt-3">
                <FintooButton
                  onClick={() => setShowModal(false)}
                  title="Close"
                />
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <div className="ProfileImg col-12 col-md-6">
          <div>
            <img src={Profile_1} alt="" />
          </div>
        </div>
        <div className="RightPanel col-12 col-md-6">
          <div className="rhl-inner">
            {showBack == true && (
              <FintooProfileBack
                title="Bank Account Details"
                onClick={() => props.onPrevious()}
              />
            )}
            <p className="">Confirm Your Bank Details</p>

            <div className="ConfBank">
              {Object.keys(bank).length ? (
                <div>
                  <div className="BankConfrmDetails">
                    <div>
                      <img
                        src={getPublicMediaURL(
                          `/static/media/bank_logo/${bank.bank_bse_code}.png`
                        )}
                      />
                    </div>

                    <div style={{ marginLeft: "10px" }}>
                      <span className="BankCnfmName">{bank.bank_name}</span>
                      <p>
                        <small>{bank.bank_address}</small>
                      </p>
                      <table className="w-100 bank-tbl">
                        <tr>
                          <td>
                            <span className="CofmAccountNM">Account No. </span>
                          </td>
                          <td>
                            <span>{bank.bank_acc_no}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="CofmIfscCode">IFSC </span>
                          </td>
                          <td>
                            <span>{bank.bank_ifsc_code}</span>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>

                  <div
                    className="Nominee_Identity_Last"
                    style={{ float: "right" }}
                  >
                    <FintooButton
                      onClick={() => {
                        handleSubmit();
                      }}
                      title="Save Bank & Proceed"
                      style={{
                        padding: "8px 20px"
                      }}
                    />
                  </div>
                </div>
              ) : (
                <p className="d-flex text-center">
                  <strong>No results found</strong>
                </p>
              )}
            </div>
          </div>
        </div>
      </Row>
    </>
  );
}

export default ConfirmBank;