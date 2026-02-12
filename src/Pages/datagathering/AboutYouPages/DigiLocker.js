import React, { useEffect, useRef, useState } from "react";
import { apiCall, fetchData, fetchEncryptData, getItemLocal, getParentFpLogId, getParentUserId } from "../../../common_utilities";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import DIGILocker from "../../../Assets/Images/digilocker.png";
import VerifyImg from "../../../Assets/Images/KYC-Verified.svg";
import FintooLoader from "../../../components/FintooLoader";
import { Modal } from "react-bootstrap";
import { AiFillCheckCircle } from "react-icons/ai";
import { ScrollToTop } from '../ScrollToTop';
function DigiLocker(props) {
  const setTab = props.setTab;
  const clientIdRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [kycDone, setKycDone] = useState(false);
  const fpLogId = getParentFpLogId();

  const getCAMSDigilocker = async () => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://auth.camsonline.com/Authservice/Login/Digilocker';

      // Add hidden input fields for parameters (clientId and redirectUrl)
      const clientIdInput = document.createElement('input');
      clientIdInput.type = 'hidden';
      clientIdInput.name = 'clientId';
      clientIdInput.value = 'YOUR_CLIENT_ID'; 
      form.appendChild(clientIdInput);

      const redirectUrlInput = document.createElement('input');
      redirectUrlInput.type = 'hidden';
      redirectUrlInput.name = 'redirectUrl';
      redirectUrlInput.value = 'YOUR_REDIRECT_URL'; // 
      form.appendChild(redirectUrlInput);

      // Append the form to the document body and submit it
      document.body.appendChild(form);
      form.submit();

      document.body.removeChild(form);

  };

  const getDigilockerurl = async () => {
    let updatedSessionData = [];
    try {
      let url = '';
// let url = CHECK_SESSION;
      let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };

      let session_data = await apiCall(url, data, true, false);
      if (session_data.error_code == "100") {
        updatedSessionData = session_data
      }
    } catch (e) {
      console.log("err", e);
    }
    let firstName = updatedSessionData?.data?.user_details?.first_name ? updatedSessionData.data.user_details.first_name : "";
    let lastName = updatedSessionData?.data?.user_details?.last_name ? updatedSessionData.data.user_details.last_name : "";
    try {
      var payload = {
        method: "post",
        url: '',
        data: {
          full_name:
            firstName + " " + lastName,
          mobile_number: props.session.data.mobile,
          user_email: props.session.data.email,
        },
      };
      let getdigilocker = await fetchEncryptData(payload);
      if (getdigilocker["error_code"] == "100") {
        setIsLoading(true);
        const verification_url = getdigilocker["data"]["verification_url"];
        window.open(verification_url, "_self");
        clientIdRef.current = getdigilocker["data"]["client_id"];
        // checkStatus();
      }
    } catch (e) {
      console.log(e);
    }
  };

  // const checkStatus = async () => {
  //   try {
  //     var payload = {
  //       method: "get",
  //       url: digilocker_url + "/status/" + clientIdRef.current,
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: "Bearer " + auth_token,
  //       },
  //     };
  //     let digi_kyc_status = await fetchData(payload);
  //     if (digi_kyc_status.status_code == 200) {
  //       if (
  //         digi_kyc_status.data.completed == true &&
  //         digi_kyc_status.data.status == "completed"
  //       ) {
  //         // done
  //         downloadDigiDocument();
  //       } else {
  //         setTimeout(() => {
  //           checkStatus();
  //         }, 1000);
  //       }
  //     } else {
  //       setIsLoading(false);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const downloadDigiDocument = async () => {
  //   try {
  //     var payload = {
  //       method: "POST",
  //       url: DMF_DOWNLOAD_DIGILOCKER_DOCUMENT,
  //       data: {
  //         client_id: clientIdRef.current,
  //         user_id: props.session.data.id.toString(),
  //       },
  //     };
  //     let digi_document = await fetchEncryptData(payload);
  //     if (digi_document.error_code == "100") {
  //       setIsLoading(false);

  //     } else {
  //       setIsLoading(false);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const getDocument = async () => {
    try {
      var payload = {
        method: "POST",
        url: ADVISORY_GET_DOCUMENTS_API,
        data: {
          user_id: props.session.data.id,
          fp_log_id: fpLogId,
        },
      };
      let get_document = await fetchEncryptData(payload);
      if (get_document["error_code"] == "100") {
        const filteredData = get_document.data.filter(
          (item) => item.doc_type === 167 || item.doc_type === 168
        );
        if (filteredData.length > 1) {
          setShow(true);
          setKycDone(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getDocument();
  }, [props.session]);

  return (
    <>
      <div>
        {!kycDone ?
          <div className="appendix completeKycDigi">
            <div className="tabs innerTabs subTabWrapper">
              <div className="rContent" style={{}}>
                <p className="" />
                <p className="d-flex">
                  <div className="notes">Note: </div>
                  <div className="ms-3">
                    As per the SEBI requirements, if a user has onboarded on
                    Fintoo we need to take client PAN & Aadhar ID after the
                    payment of Advisory fees.
                  </div>
                </p>
                <p />
              </div>
              <div className="pt-3">
                <div
                  className="notes DigiNotes"
                  style={{
                    color: "#746868",
                  }}
                >
                  Digilocker - Document for KYC
                </div>
                <div className="DigiPara">
                  Your Aadhar must be linked to and Mobile number to receive and
                  confirm OTP.
                </div>
                {/* <p className="DigisubPara"> */}
              </div>
              <div className="WhyDigibox mt-5">
                <div className="notes DigiNotes">
                  <img style={{ height: "2rem" }} src={DIGILocker} /> Why
                  digilocker needed?
                </div>
                <div className="DigiPara">
                  Digilocker automatically verifies your documents needed for KYC
                  and account opening.
                </div>
              </div>
              <div style={{gap : "1rem"}} className="d-flex justify-content-center">
                {!kycDone ? (<>
                  <button
                    className="ProceedPayBtn"
                    onClick={() => {
                      getDigilockerurl();
                    }}
                  >
                    Proceed for KYC
                  </button>
                   <button
                   className="ProceedPayBtn"
                   onClick={() => {
                     getCAMSDigilocker();
                   }}
                 >
                   Proceed for KYC CAMS
                 </button>
                 </>
                ) : (
                  <button
                    className="ProceedPayBtn"
                    style={{ backgroundColor: "gray", cursor: "not-allowed" }}
                  >
                    Proceed for KYC
                  </button>
                )}
              </div>
            </div>
          </div>
          :
          <div className="appendix completeKycDigi">
            <div className="tabs innerTabs subTabWrapper">

              <div className="pt-3" style={{ display: "grid", placeContent: "center" }}>

                <img style={{ height: "25rem" }} src={VerifyImg} />

              </div>
              <div className="mt-2 text-center">
                <h2>Congratulations!</h2>
                <h2 style={{ color: "#07a4fb" }}>Your KYC is verified.</h2>
              </div>
            </div>
          </div>
        }

        <div className="row text-center">
          <div className="btn-container">
            <div className="d-flex justify-content-center">
              <div
                className="previous-btn form-arrow d-flex align-items-center"
                onClick={() => {
                  ScrollToTop();
                  setTab("tab4")
                }
                }
              >
                <FaArrowLeft />
                <span className="hover-text">&nbsp;Previous</span>
              </div>


              <Link
                to={
                  process.env.PUBLIC_URL +
                  "/datagathering/income-expenses"
                }
              >
                <div className="next-btn form-arrow d-flex align-items-center">
                  <span
                    className="hover-text"
                    style={{ maxWidth: 100 }}
                  >
                    Continue&nbsp;
                  </span>
                  <FaArrowRight />
                </div>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DigiLocker;
