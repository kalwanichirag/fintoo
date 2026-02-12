import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import ProgressBar from "@ramonak/react-progress-bar";
import MainLayout from "../../../../components/Layout/MainLayout";
import style from "./style.module.css";
import AgeProof from "./AddMinorForms/ageProof";
import Modal from "react-responsive-modal";
import MinorsDetails from "./AddMinorForms/minorsDetails";
import MinorsOtherDetails from "./AddMinorForms/minorsOtherDetails";
import MinorsBankDetails from "./AddMinorForms/minorsBankDetails";
import LegalGuardianProof from "./AddMinorForms/legalGuardianProof";
import UploadBankDetails from "./AddMinorForms/uploadBankDetails";
import Bank from "../../../../components/Pages/ProfileCompoenents/Profile/Bank";
import ConfirmBank from "../../../../components/Pages/ProfileCompoenents/Profile/ConfirmBank";
import { useNavigate } from "react-router-dom";
import { fetchEncryptData, getMinorUserId, getUserId, loginRedirectGuest } from "../../../../common_utilities";
import {  } from "../../../../constants";
import { useDispatch } from "react-redux";

function AddMinorView(props) {
  const [currentView, setCurrentView] = useState("DETAILS");
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [mainData, setMainData] = useState({});
  const dispatch = useDispatch();

  const storedMinorDetails = localStorage.getItem("combinedDetails");
  const minorDetailsObject = JSON.parse(storedMinorDetails);

  const navigate = useNavigate();

  let value = 0;
      if (mainData.is_minor == "Y") {
        value = 25;
        if (mainData.bse_reg == "Y") {
          value = 50;
          if (mainData.fatca_status == "PASS") {
            value = 75;
            if (mainData.aof_status == "Y") {
              value = 100;
            }
          }
        }
      }

  useEffect(() => {
    if (window.screen.width < 550) {
      document.body.style.background = "white";
    }

    window.addEventListener("resize", () => {
      if (window.screen.width < 550) {
        document.body.style.background = "white";
      } else {
        document.body.style.removeProperty("background");
      }
    });

    return () => {
      document.body.style.removeProperty("background");
      window.removeEventListener("resize", () => {});
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    // fetchUserData();
  }, [currentView]);

  // const fetchUserData = async () => {
  //   try {
  //     var payload = {
  //       url: DMF_DATAGATHERING_API_URL,
  //       method: "post",
  //       data: { user_id: "" + getMinorUserId() },
  //     };
  //     var res = await fetchEncryptData(payload);

  //     setMainData(res.data);
  //   } catch (e) {
  //     console.error(e);
  //     dispatch({
  //       type: "RENDER_TOAST",
  //       payload: { message: e.toString(), type: "error" },
  //     });
  //   }
  // };

  return (
    <MainLayout>
      <div>
        <ToastContainer />
        <div className={`${style.welcomeName}`}>Welcome</div>
        <div
          className={`${style.AddMinorViewContainer} ${style.AddMinorViewProgress}`}
        >
          <ProgressBar className="ProgressPan" completed={value} />
        </div>
        <div className={`${style.AddMinorViewContainer}`}>
          {currentView === "DETAILS" && (
            <MinorsDetails
              onPrevious={() => {}}
              onNext={() => setCurrentView("OTHERDETAILS")}
            />
          )}
          {currentView === "OTHERDETAILS" && (
            <MinorsOtherDetails
              onPrevious={() => setCurrentView("DETAILS")}
              onNext={() => setCurrentView("Bank")}
            />
          )}
          {currentView === "Bank" && (
            <Bank
              onPrevious={() => setCurrentView("OTHERDETAILS")}
              onNext={() => setCurrentView("UPLOADBANKDETAILS")}
              value="minor"
            />
          )}
          {/* {
                        currentView === 'UPLOADBANKDETAILS' && <UploadBankDetails
                            onPrevious={() => setCurrentView('BANKDETAILS')}
                            onNext={() => setCurrentView('AGEPROOF')}
                        />
                    } */}
          {currentView === "UPLOADBANKDETAILS" && (
            <UploadBankDetails
              onPrevious={() => setCurrentView("Bank")}
              onNext={() => setCurrentView("ConfirmBank")}
             
            />
          )}
          {currentView === "ConfirmBank" && (
            <ConfirmBank
              onPrevious={() => setCurrentView("UPLOADBANKDETAILS")}
              onNext={() => setCurrentView("AGEPROOF")}
              value="minor"
            />
          )}

          {currentView === "AGEPROOF" && (
            <AgeProof
              onPrevious={() => setCurrentView("ConfirmBank")}
              setShowCompleteModal={(value) => setShowCompleteModal(value)}
              onNext={() => {
                if (minorDetailsObject.guardianRelation == "legal guardian") {
                  setCurrentView("LEGALGUARDIANPROOF");
                } else {
                  // setShowCompleteModal(prev => !prev);
                  localStorage.removeItem("combinedDetails");
                }
              }}
            />
          )}
          {currentView === "LEGALGUARDIANPROOF" && (
            <LegalGuardianProof
              onPrevious={() => setCurrentView("AGEPROOF")}
              // setShowCompleteModal={(value) => {
              //     setShowCompleteModal(value);
              //     localStorage.removeItem('combinedDetails');
              // }}
              onNext={() => {
                //console.log('here');
              }}
            />
          )}
        </div>
      </div>
      <Modal
        classNames={{
          modal: "Modalpopup",
        }}
        open={showCompleteModal}
        showCloseIcon={false}
        // onClose={() => setIsRegulatoryUodateModalActive(false)}
        center
        animationDuration={0}
        closeOnOverlayClick={false}
      >
        <div className="text-center">
          <h2 className="HeaderText pt-3">Profile Completed</h2>
          <div className="ModalpopupContentContainer">
            <br />
            <div
              className="PopupImg"
              style={{ width: "30%", margin: "0 auto" }}
            >
              {/* <img style={{ width: "100%" }} src={imp_notice} /> */}
              <img
                style={{ width: "100%" }}
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/DMF/minorFlow/minorflowimg5.png"
                }
              />
            </div>
            <div className="p-2">
              <p className="PopupContent">
                Hi, Congratulations your profile has been completed.
              </p>
            </div>
            <br />
            <div className="ButtonBx aadharPopUpFooter">
              <button
                className="ReNew"
                onClick={() => {
                  navigate(
                    process.env.PUBLIC_URL + "/direct-mutual-fund/funds/all"
                  );
                }}
              >
                Start Investment
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}

export default AddMinorView;
