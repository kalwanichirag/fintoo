import { useEffect, useState } from "react";
// import ReactDOM from "react-dom";
import Pan from "../Pages/ProfileCompoenents/Profile/Pan";
import Birth from "../Pages/ProfileCompoenents/Profile/DOB";
import AadharAddress from "../Pages/ProfileCompoenents/Profile/AadharAddress";
import Occupation from "../Pages/ProfileCompoenents/Profile/Occupation";
import NomineeDetails from "../Pages/ProfileCompoenents/Profile/NomineeDetails";
import Bank from "../Pages/ProfileCompoenents/Profile/Bank";
import BankCheque from "../Pages/ProfileCompoenents/Profile/BankCheque";
import ConfirmBank from "../Pages/ProfileCompoenents/Profile/ConfirmBank";
import UploadPan from "../Pages/ProfileCompoenents/Profile/UploadPan";
// import UploadPan from "../Pages/ProfileCompoenents/Profile/UploadPan";
import UploadVideo from "../Pages/ProfileCompoenents/Profile/UploadVideo";
import UploadPhoto from "../Pages/ProfileCompoenents/Profile/UploadPhoto";
import UploadSignature from "../Pages/ProfileCompoenents/Profile/UploadSignature";
import UploadAadharFront from "../Pages/ProfileCompoenents/Profile/UploadAadharFront";
import UploadAadharBack from "../Pages/ProfileCompoenents/Profile/UploadAadharBack";
import AadharDocument from "../Pages/ProfileCompoenents/Profile/AadharDocument";
import FatcaAll from "../Pages/ProfileCompoenents/Profile/FatcaAll";
import FatcaAdd from "../Pages/ProfileCompoenents/Profile/FatcaAdd";
import { useSearchParams } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";
import MainLayout from "../Layout/MainLayout";
import {
  getUserId,
} from "../../common_utilities";
import { ToastContainer } from "react-toastify";
import { DATA_BELONGS_TO } from "../../constants";
import MinorsDetails from "../../Pages/DMF/ProfileInsider/AddMembers/AddMinorForms/minorsDetails";
import MinorsOtherDetails from "../../Pages/DMF/ProfileInsider/AddMembers/AddMinorForms/minorsOtherDetails";
import AgeProof from "../../Pages/DMF/ProfileInsider/AddMembers/AddMinorForms/ageProof";
import UploadBankDetails from "../../Pages/DMF/ProfileInsider/AddMembers/AddMinorForms/uploadBankDetails";
import LegalGuardianProof from "../../Pages/DMF/ProfileInsider/AddMembers/AddMinorForms/legalGuardianProof";
import { fetchUserMfProfileStatus } from "../../FrappeIntegration-Services/services/master-api/masterApiService";
import {
  fetchUserProfileDetails,
  getFamilyMember,
} from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import FintooLoader from "../FintooLoader";

function Profile(props) {
  const dispatch = useDispatch();
  const user_id = getUserId();

  const [showPanel, setShowPanel] = useState("");
  const [mainData, setMainData] = useState({});
  const [statusData, setStatusData] = useState({});
  const [documentName, setDocumentName] = useState("");
  const [skipInit, setSkipInit] = useState(true);
  const [profileState, setProfileState] = useState("");
  const [parent, setParent] = useState("");
  const [fatcaId, setFatcaId] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const storedMinorDetails = localStorage.getItem("combinedDetails");
  const minorDetailsObject = JSON.parse(storedMinorDetails);

  let value = 0;
  if (mainData?.user_is_minor === 1) {
    value = 25;
    if (mainData?.user_bse_registered === 1) {
      value = 50;
      if (mainData?.fatca_bse_status === "PASS") {
        value = 75;
        if (mainData?.fatca_bse_aof_status === "Y") {
          value = 100;
        }
      }
    }
  }

  useEffect(() => {
  let isMounted = true;

  const init = async () => {
    if (!skipInit) return;

    document.body.classList.add("page-profile");
    dispatch({ type: "PROFILE_BACK", payload: true });

    try {
      const userRes = await fetchUserProfileDetails(user_id);
      if (!isMounted) return;
      setMainData(userRes.data);

      const membersRes = await getFamilyMember(user_id);
      if (!isMounted) return;
      handleParentdata(membersRes);

      const statusRes = await fetchUserMfProfileStatus(user_id, DATA_BELONGS_TO);
      if (!isMounted) return;
      setProfileState(statusRes.user_profile_progress.profile_status);
      setStatusData(statusRes.data);

      if (
        userRes.data &&
        Object.keys(userRes.data).length &&
        statusRes.data &&
        Object.keys(statusRes.data).length
      ) {
        setIsDataLoaded(true);

        const mainData = userRes.data;
        const statusData = statusRes.data;
        const parentData = membersRes.data?.filter((obj) => obj.user_parent_id == null) || [];

        if (mainData.user_id !== getUserId() && mainData.user_is_minor !== 1) {
          if (
            mainData.mobile === parentData[0]?.mobile ||
            mainData.user_email === parentData[0]?.fdmf_email
          ) {
            window.location =
              process.env.PUBLIC_URL +
              "/direct-mutual-fund/profile/addmembers?update=1";
            return;
          }
        }

        if (
          (mainData.mobile === "" || mainData.user_email === "") &&
          mainData.user_is_minor !== 1
        ) {
          window.location =
            process.env.PUBLIC_URL +
            "/direct-mutual-fund/profile/addmembers?update=1";
          return;
        }

        // main profile navigation logic
        if (mainData.user_is_minor !== 1) {
          if (profileState >= 75 && statusData.user_bse_aof_status === "No") {
            setShowPanel("UploadSignature");
            return;
          }

          if (!mainData.user_pan?.trim()) {
            setShowPanel("Pan");
            return;
          }
          if (!mainData.user_dob) {
            setShowPanel("Birth");
            return;
          }
          if (!mainData?.address?.trim() || !mainData?.user_city_id || !mainData?.user_state_id || !mainData?.user_country_id || !mainData?.user_pincode) {
            setShowPanel("AadharAddress");
            return;
          }
          if (
            !mainData?.user_income_slab?.trim() ||
            !mainData?.user_occupation ||
            !mainData?.user_marital_status?.trim()
          ) {
            setShowPanel("Occupation");
            return;
          }
          if (
            !mainData.user_residential_status ||
            !mainData.user_holding_nature ||
            !mainData.user_politically_exposed
          ) {
            setShowPanel("FatcaAll");
            return;
          }
          if (
            mainData.user_residential_status === "NRI" &&
            mainData.fatca_details?.fatca_overseas_address === ""
          ) {
            setShowPanel("FatcaAdd");
            return;
          }
          if (statusData.nominee_details === "No") {
            setShowPanel("NomineeDetails");
            return;
          }
          if (
            statusData.bank_details === "No" ||
            statusData.user_bse_registered === "No"
          ) {
            setShowPanel("Bank");
            return;
          }
          if (
            mainData.user_residential_status === "NRI" &&
            statusData.user_bse_registered === "Yes" &&
            statusData.fatca_status === "Yes" &&
            statusData.bank_details === "Yes"
          ) {
            setShowPanel("Bank");
            return;
          }
          if (statusData.user_bse_registered === "No") {
            if (mainData.user_pan?.trim()) {
              dispatch({ type: "PROFILE_BACK", payload: false });
            }
            setShowPanel("Birth");
            return;
          }
          if (statusData.user_bse_aof_status === "No") {
            if (statusData.kyc_verified === "Yes") {
              dispatch({ type: "PROFILE_BACK", payload: false });
            }
            setShowPanel("UploadSignature");
            return;
          }
        } else {
          // Minor case
          if (!mainData.user_dob) {
            setShowPanel("DETAILS");
            return;
          }
          if (
            statusData.bank_details === "No" &&
            statusData.user_bse_registered === "No"
          ) {
            setShowPanel("Bank");
            return;
          }
          if (statusData.user_bse_registered === "No") {
            setShowPanel("Bank");
            return;
          }
          if (statusData.user_bse_aof_status === "No") {
            if (mainData.guardian_relation === "legal guardian") {
              setShowPanel("LEGALGUARDIANPROOF");
            } else {
              setShowPanel("AGEPROOF");
            }
            return;
          }
        }
      } else {
        setShowPanel("Pan");
      }
    } catch (e) {
      console.error("Initialization error:", e);
    } finally {
      setSkipInit(false);
    }
  };

  init();
  return () => {
    isMounted = false;
  };
}, []);

  const handlePrevious = (v) => {
    dispatch({ type: "PROFILE_BACK", payload: true });
    if (mainData.user_is_minor !== 1) {
      if (mainData.user_pan?.trim() == "" && v == "Pan") {
        setShowPanel("Pan");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "Birth") {
        if (mainData.user_pan?.trim() != "" || mainData.user_pan == null) {
          dispatch({ type: "PROFILE_BACK", payload: false });
        }
        setShowPanel("Birth");
        return;
      }

      if (statusData.user_bse_registered == "No" && v == "AadharAddress") {
        setShowPanel("AadharAddress");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "MaritalStatus") {
        setShowPanel("MaritalStatus");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "Occupation") {
        setShowPanel("Occupation");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "FatcaAll") {
        setShowPanel("FatcaAll");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "FatcaAdd") {
        if (mainData.user_residential_status == "NRI") {
          setShowPanel("FatcaAdd");
          return;
        } else {
          setShowPanel("NomineeDetails");
          return;
        }
      }
      if (statusData.user_bse_registered == "No" && v == "NomineeDetails") {
        setShowPanel("NomineeDetails");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "Bank") {
        setShowPanel("Bank");
        return;
      }

      if (statusData.user_bse_registered == "No" && v == "BankCheque") {
        if (mainData.user_residential_status == "NRI") {
          setShowPanel("BankCheque");
          return;
        } else {
          setShowPanel("ConfirmBank");
          return;
        }
      }
      if (statusData.user_bse_registered == "No" && v == "ConfirmBank") {
        setShowPanel("ConfirmBank");
        return;
      }

      if (statusData.user_bse_aof_status == "No" && v == "UploadSignature") {
        if (statusData.kyc_verified == "Yes") {
          dispatch({ type: "PROFILE_BACK", payload: false });
        }
        setShowPanel("UploadSignature");
        return;
      }
    } else {
      if (v == "UPLOADBANKDETAILS") {
        setShowPanel("UPLOADBANKDETAILS");
        return;
      }
      if (v == "ConfirmBank") {
        setShowPanel("ConfirmBank");
        return;
      }
      if (mainData.user_dob && v == "DETAILS") {
        setShowPanel("DETAILS");
        return;
      }
      if (
        statusData.bank_details == "No" &&
        statusData.user_bse_registered == "No" &&
        v == "Bank"
      ) {
        setShowPanel("Bank");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "Bank") {
        setShowPanel("Bank");
        return;
      }
      if (statusData.user_bse_registered == "Yes" && v == "Bank") {
        setShowPanel("Bank");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "ConfirmBank") {
        setShowPanel("ConfirmBank");
        return;
      }

      if (v == "OTHERDETAILS") {
        setShowPanel("OTHERDETAILS");
        return;
      }
      if (statusData.user_bse_aof_status === "No" && v == "AGEPROOF") {
        setShowPanel("AGEPROOF");
        return;
      }
    }
  };

  const handleNext = (v) => {
    dispatch({ type: "PROFILE_BACK", payload: true });

    if (
      mainData?.user_is_minor !== 1 &&
      statusData &&
      Object.keys(statusData).length
    ) {
      // Check if profile is at 75% completion - should go to UploadSignature
      if (profileState >= 75 && statusData.user_bse_aof_status === "No") {
        setShowPanel("UploadSignature");
        return;
      }

      if (mainData?.user_pan?.trim() == "" && v == "Pan") {
        setShowPanel("Pan");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "Birth") {
        if (mainData.user_pan?.trim() != "" || mainData.user_pan == null) {
          dispatch({ type: "PROFILE_BACK", payload: false });
        }
        setShowPanel("Birth");
        return;
      }

      if (statusData.user_bse_registered == "No" && v == "AadharAddress") {
        setShowPanel("AadharAddress");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "MaritalStatus") {
        setShowPanel("MaritalStatus");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "Occupation") {
        setShowPanel("Occupation");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "FatcaAll") {
        setShowPanel("FatcaAll");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "FatcaAdd") {
        setShowPanel("FatcaAdd");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "NomineeDetails") {
        setShowPanel("NomineeDetails");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "Bank") {
        if (
          statusData.kyc_verified == "Yes" &&
          statusData.bank_details == "Yes"
        ) {
          setShowPanel("UploadSignature");
          return;
        } else {
          setShowPanel("Bank");
          return;
        }
      }
      if (statusData.user_bse_registered == "No" && v == "BankCheque") {
        if (
          mainData.user_residential_status == "NRE" ||
          mainData.user_residential_status == "NRI" ||
          mainData.user_residential_status == "NRO"
        ) {
          setShowPanel("BankCheque");
          return;
        } else {
          setShowPanel("ConfirmBank");
          return;
        }
      }
      if (statusData.user_bse_registered == "No" && v == "ConfirmBank") {
        setShowPanel("ConfirmBank");
        return;
      }
      if (statusData.kyc_verified == "Yes") {
        dispatch({ type: "PROFILE_BACK", payload: false });
        setShowPanel("UploadSignature");
        return;
      }
      if (statusData.user_bse_aof_status == "No" && v == "UploadSignature") {
        if (statusData.kyc_verified == "Yes") {
          dispatch({ type: "PROFILE_BACK", payload: false });
        }
        setShowPanel("UploadSignature");
        return;
      }
    } else {
      if (v == "UPLOADBANKDETAILS") {
        setShowPanel("UPLOADBANKDETAILS");
        return;
      }
      if (mainData.user_dob && v == "DETAILS") {
        setShowPanel("DETAILS");
        return;
      }
      if (
        statusData.bank_details == "No" &&
        statusData.user_bse_registered == "No" &&
        v == "Bank"
      ) {
        setShowPanel("Bank");
        return;
      }
      if (statusData.user_bse_registered == "No" && v == "Bank") {
        setShowPanel("Bank");
        return;
      }
      if (v == "Bank") {
        setShowPanel("Bank");
        return;
      }
      if (v == "ConfirmBank") {
        setShowPanel("ConfirmBank");
        return;
      }
      if (v == "OTHERDETAILS") {
        setShowPanel("OTHERDETAILS");
        return;
      }
      if (statusData.user_bse_aof_status === "No" && v == "AGEPROOF") {
        setShowPanel("AGEPROOF");
        return;
      }
      if (statusData.user_bse_aof_status === "No" && v == "LEGALGUARDIANPROOF") {
        setShowPanel("LEGALGUARDIANPROOF");
        return;
      }
    }
  };

  const onDocumentSelect = (v) => {
    setDocumentName(v);
  };

  const handleParentdata = (Rdata) => {
    var getarray1 = Rdata.data.filter((obj) => {
      return obj.user_parent_id == null;
    });

    setParent(getarray1);
  };

  return (
    <MainLayout>
      <div className="Profile">
        <ToastContainer />
        <div className="container">
          <div className="profile-container">
            <div>
              <div className="welcome-name">
                {props.progressTitle == null && <h2>Welcome&nbsp;</h2>}
                {props.progressTitle != null && props.progressTitle === "" && (
                  <h2>Welcome&nbsp;</h2>
                )}
                {props.progressTitle != null && props.progressTitle !== "" && (
                  <h2>Hello,&nbsp;{props.progressTitle.split(" ")[0]}</h2>
                )}
              </div>
              {mainData?.user_is_minor == 1 ? (
                <ProgressBar className="ProgressPan" completed={value} />
              ) : (
                <ProgressBar className="ProgressPan" completed={profileState} />
              )}
            </div>

            {/* Show loading state while data is being fetched */}
            <FintooLoader isLoading={!isDataLoaded} />

            {isDataLoaded && mainData?.user_is_minor !== 1 ? (
              <>
                {showPanel === "Pan" && (
                  <Pan
                    onPrevious={() => handlePrevious("")}
                    onNext={() => handleNext("Birth")}
                  />
                )}
                {showPanel === "Birth" && (
                  <Birth
                    onPrevious={() => handlePrevious("Pan")}
                    onNext={() => handleNext("AadharAddress")}
                  />
                )}
                {showPanel === "AadharAddress" && (
                  <AadharAddress
                    onPrevious={() => handlePrevious("Birth")}
                    onNext={() => handleNext("Occupation")}
                  />
                )}
                {/* {showPanel === "MaritalStatus" && <MaritalStatus onPrevious={() => handlePrevious("AadharAddress")} onNext={() => handleNext("Occupation")} />} */}
                {showPanel === "Occupation" && (
                  <Occupation
                    onPrevious={() => handlePrevious("AadharAddress")}
                    onNext={() => handleNext("FatcaAll")}
                  />
                )}
                {showPanel === "FatcaAll" && (
                  <FatcaAll
                    onPrevious={() => handlePrevious("Occupation")}
                    onNext={(p = "NomineeDetails") => handleNext(p)}
                    setShowPanel={setShowPanel}
                    mainData={mainData}
                    setFatcaId={setFatcaId}
                  />
                )}
                {showPanel === "FatcaAdd" && (
                  <FatcaAdd
                    onPrevious={() => handlePrevious("FatcaAll")}
                    onNext={() => handleNext("NomineeDetails")}
                    maindata={mainData}
                    setShowPanel={setShowPanel}
                    fatcaId={fatcaId}
                  />
                )}
                {showPanel === "NomineeDetails" && (
                  <NomineeDetails
                    onPrevious={(l) => handlePrevious(l)}
                    onNext={() => handleNext("Bank")}
                    setShowPanel={setShowPanel}
                  />
                )}
                {showPanel === "Bank" && (
                  <Bank
                    onPrevious={() => handlePrevious("NomineeDetails")}
                    onNext={(p) => handleNext(p)}
                    setShowPanel={setShowPanel}
                  />
                )}
                {showPanel === "BankCheque" && (
                  <BankCheque
                    onPrevious={() => handlePrevious("Bank")}
                    onNext={() => handleNext("ConfirmBank")}
                    setShowPanel={setShowPanel}
                  />
                )}
                {showPanel === "ConfirmBank" && (
                  <ConfirmBank
                    mainData={mainData}
                    statusData={statusData}
                    setShowPanel={setShowPanel}
                    onPrevious={() => {
                      setShowPanel("Bank");
                      return;
                    }}
                    onNext={() => handleNext("UploadPan")}
                  />
                )}
                {showPanel === "UploadPan" && (
                  <UploadPan
                    onPrevious={() => handlePrevious("ConfirmBank")}
                    onNext={() => handleNext("AadharDocument")}
                  />
                )}
                {showPanel === "AadharDocument" && (
                  <AadharDocument
                    onDocumentSelect={(v) => onDocumentSelect(v)}
                    onPrevious={() => handlePrevious("UploadPan")}
                    onNext={() => handleNext("UploadAadharFront")}
                  />
                )}
                {showPanel === "UploadAadharFront" && (
                  <UploadAadharFront
                    documentName={documentName}
                    onPrevious={(q) => handlePrevious(q)}
                    onNext={(p) => handleNext(p)}
                  />
                )}
                {showPanel === "UploadAadharBack" && (
                  <UploadAadharBack
                    documentName={documentName}
                    onPrevious={(q) => handlePrevious(q)}
                    onNext={() => handleNext("UploadPhoto")}
                  />
                )}
                {showPanel === "UploadPhoto" && (
                  <UploadPhoto
                    onPrevious={() => handlePrevious("UploadAadharBack")}
                    onNext={() => handleNext("UploadVideo")}
                  />
                )}
                {showPanel === "UploadVideo" && (
                  <UploadVideo
                    onPrevious={() => handlePrevious("UploadPhoto")}
                    onNext={() => handleNext("UploadSignature")}
                  />
                )}
                {showPanel === "UploadSignature" && (
                  <UploadSignature
                    onPrevious={() => handlePrevious("UploadVideo")}
                    onNext={() => handleNext("UploadSignature")}
                  />
                )}
              </>
            ) : (
              <>
                {isDataLoaded && showPanel === "DETAILS" && (
                  <MinorsDetails
                    onPrevious={() => { }}
                    onNext={() => handleNext("OTHERDETAILS")}
                  />
                )}
                {isDataLoaded && showPanel === "OTHERDETAILS" && (
                  <MinorsOtherDetails
                    onPrevious={() => handlePrevious("DETAILS")}
                    onNext={() => handleNext("Bank")}
                  />
                )}
                {isDataLoaded && showPanel === "Bank" && (
                  <Bank
                    onPrevious={() => handlePrevious("OTHERDETAILS")}
                    onNext={() => handleNext("UPLOADBANKDETAILS")}
                    setShowPanel={setShowPanel}
                  />
                )}
                {isDataLoaded && showPanel === "UPLOADBANKDETAILS" && (
                  <UploadBankDetails
                    onPrevious={() => handlePrevious("Bank")}
                    onNext={() => handleNext("ConfirmBank")}
                  />
                )}
                {isDataLoaded && showPanel === "ConfirmBank" && (
                  <ConfirmBank
                    onPrevious={() => handlePrevious("UPLOADBANKDETAILS")}
                    onNext={() => handleNext("AGEPROOF")}
                  />
                )}
                {isDataLoaded && showPanel === "AGEPROOF" && (
                  <AgeProof
                    onPrevious={() => handlePrevious("ConfirmBank")}
                    onNext={() => {
                      if (mainData.guardian_relation == "legal guardian") {
                        handleNext("LEGALGUARDIANPROOF");
                      } else {
                      }
                    }}
                  />
                )}
                {isDataLoaded && showPanel === "LEGALGUARDIANPROOF" && (
                  <LegalGuardianProof
                    onPrevious={() => handlePrevious("AGEPROOF")}
                    onNext={() => ""}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
const mapStateToProps = (state) => ({
  progressValue: state.progressValue,
  progressTitle: state.progressTitle,
});

export default connect(mapStateToProps)(Profile);

