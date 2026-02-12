import { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import Link from "../../../MainComponents/Link";
import Profile_1 from "../../../Assets/06_banking_app.svg";
import { Container, Row, Col, Modal } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import "../Fatca/style.css";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import FintooButton from "../../../HTML/FintooButton";
import axios from "axios";
import commonEncode from "../../../../commonEncode";
import { DATA_BELONGS_TO } from "../../../../constants";
import {
  apiCall,
  CheckSession,
  getMinorUserId,
  getPublicMediaURL,
  memberId,
} from "../../../../common_utilities";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addBank, BseClientRegistration, FatcaUpload } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";

function ConfirmBank(props) {
  const [validated, setValidated] = useState(false);
  const [bankDetails, setBankDetails] = useState({});
  const [bankBseCode, getBankBseCode] = useState({});
  const [bank, setBank] = useState({});
  const dispatch = useDispatch();
  const showBack = useSelector((state) => state.isBackVisible);
  const user_id = props.value == "minor" ? getMinorUserId() : memberId();
  const [isFatcaFailed, setIsFatcaFailed] = useState(false);

  var retrievedData = localStorage.getItem("Bank_DETAILS");
  var retrievedObject = JSON.parse(retrievedData);

  // Function to get account holding nature ID based on residential status
  const getAccountHoldingNatureId = (residentialStatus) => {
    switch (residentialStatus) {
      case "RES":
        return "AHN-1"; // Single
      case "NRI":
        return "AHN-2"; // Either or survivor
      case "NRO":
        return "AHN-2"; // Either or survivor
      default:
        return "AHN-1"; // Default to Single
    }
  };

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    getUserBankDetails();
  }, []);

  const getUserBankDetails = async () => {
    try {
      let bankFromStorage = JSON.parse(localStorage.getItem("bankDetails"));
      setBank({ ...bankFromStorage });
    } catch {
      setBank({});
    }
  };

  const clientRegistration = async () => {

    var payload = {
      user_id: user_id,
      data_belongs_to: DATA_BELONGS_TO
    }

    var response = await BseClientRegistration(payload);

    let status_code = response["status_code"];
    if (status_code == 200 || response.message?.includes("modification") && response.message?.includes("failed")) {
      FATCAUpload();
    } else {
      setIsFatcaFailed(true);
      return;
    }
  };

  const FATCAUpload = async () => {
    
    var payload = {
      user_id: user_id,
      data_belongs_to: DATA_BELONGS_TO
    }
    var res = await FatcaUpload(payload);

    if (res.status_code == 200) {
      toast.success("User details updated successfully.", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
      });
      if(props.mainData.residential_status == "NRE" || props.mainData.residential_status == "NRO" || props.mainData.residential_status == "NRI") {
        props.setShowPanel("BankCheque");
      } else {
        if(props.statusData.kyc_verified == "No") {
          // props.setShowPanel("UploadPan");
          props.setShowPanel("UploadSignature");
        } else {
          props.setShowPanel("UploadSignature");
        }
      }
      // setTimeout(() => {
      //   props.onNext();
      // }, 1000);
      
    } else {
      setIsFatcaFailed(true);
    }
  };

  const handleSubmit = async () => {
    try {
    
      var payload = { ...bank };
      delete payload.bank_bse_code;
      
      // Fix single_survivor field to use correct ID
      if (props.mainData && props.mainData.user_residential_status) {
        payload.single_survivor = getAccountHoldingNatureId(props.mainData.user_residential_status);
      } else {
        // Fallback to default if residential status is not available
        payload.single_survivor = "AHN-1";
      }
      
      const r3 = await addBank(payload);
      
      if (r3.status_code == '200' || (r3.message.includes("already") && r3.message.includes("bank"))) {
        clientRegistration();
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Bank details have been saved.",
            type: "success",
            autoClose: 3000,
          },
        });
      } else {
        if(r3.message.toLowerCase().includes("incorrect value for bank_acc_no")) {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Bank account number must be 7 to 18 digits",
              type: "error",
              autoClose: 3000,
            },
          });
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: r3.message ?? "Error while adding bank.",
              type: "error",
              autoClose: 3000,
            },
          });
        }
        
      }
    } catch (err) {
      console.log("er4------>", err);
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
          show={isFatcaFailed}
          className="profile-popups sign-popup"
          onHide={() => {
            setIsFatcaFailed(false);
          }}
        >
          <Modal.Body>
            <div className="modal-body-box">
              {/* <center><h5><b>{erroronproceed}</b></h5></center> */}
              <center>
                <center>
                  <h5>
                    <b>Verification in Progress</b>
                  </h5>
                </center>
                &nbsp; &nbsp; &nbsp;
                {/* <div></div> */}
                <p className="">
                  Thank you for your patience. Your account is currently
                  undergoing verification, which may take some time. Please
                  allow us a bit more time to complete this process. If you have
                  any questions or need assistance, feel free to reach out to
                  our support@fintoo.in.
                </p>
              </center>

              {/* <center><p><h3> We regret to inform you that your bank verification has encountered errors in the provided data. To successfully complete the verification process, please add your bank details again. If you have any questions or need assistance, please don't hesitate to reach out to us at support@fintoo.in.</h3></p></center> */}
              <div>
                <div className="pt-3 pb-3 ">
                  {/* <div className="img-box9 pt-4 inv-sign-border text-center">
                        <img
                          className="img-fluid inv-img-86"
                          // src={require("../../../../Assets/Images/temp_img_8865.jpg")}
                        />
                          </div> */}
                </div>
                <div className="pb-3 pt-3">
                  <FintooButton
                    onClick={() => {
                      setIsFatcaFailed(false);
                    }}
                    title={"Close"}
                  />
                </div>
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
                      title="Next"
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