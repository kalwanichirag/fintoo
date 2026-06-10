import { useEffect, useRef, useState } from "react";
import FintooLoader from "../../components/FintooLoader";
import {
  UploadDocumentApi,
  GetDocumentDetails
} from "../../FrappeIntegration-Services/services/financial-planning-api/document";
import {
  Get_Expert_Fp_Document,
  Sign_Desk_Api,
  Sign_Desk_Api_Check
} from "../../FrappeIntegration-Services/services/financial-planning-api/fpagreementapi";
import {
  check_all_status_api,
  fetchUserProfileDetails,
  updateBasicDetails
} from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { Getpaymentstatus } from "../../FrappeIntegration-Services/services/payment-api/paymentapiService";
import { getParentUserId, setItemLocal } from "../../common_utilities";
import { DATA_BELONGS_TO, X_CRM_ACCESS_TOKEN, X_CRM_USER } from "../../constants";
import axios from "axios";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import HideHeader from "../../components/HideHeader";
import HideFooter from "../../components/HideFooter";
import { isFromCRM } from "../../common_utilities";

const updateKycStatusApi = async ({ leadId, panFile, aadhaarFile }) => {
  let payload;
  let headers = {
    "X-CRM-Access-Token": X_CRM_ACCESS_TOKEN,
    "X-CRM-User": X_CRM_USER
  };

  if (panFile || aadhaarFile) {
    payload = new FormData();
    payload.append("lead_id", leadId);
    if (panFile) payload.append("pan", panFile);
    if (aadhaarFile) payload.append("aadhar", aadhaarFile);
  } else {
    payload = { lead_id: leadId };
    headers["Content-Type"] = "application/json";
  }

  const res = await axios.post(
    `${process.env.REACT_APP_CRM_BASE_URL}/update_kyc_status`,
    payload,
    { headers }
  );

  return res.data;
};

const updateFpAgreementStatusApi = async (leadId) => {
  const res = await axios.post(
    `${process.env.REACT_APP_CRM_BASE_URL}/update_fp_agreement_status`,
    { lead_id: leadId },
    {
      headers: {
        "X-CRM-Access-Token": X_CRM_ACCESS_TOKEN,
        "X-CRM-User": X_CRM_USER
      }
    }
  );

  return res.data;
};

const isValidAddress = (addr) => {
  if (!addr || typeof addr !== "string") return false;
  const trimmed = addr.trim();
  if (trimmed.length < 10 || trimmed.length > 100) return false;
  return /^[a-zA-Z0-9\s,.\-/#]+$/.test(trimmed);
};

const VerificationDocuments = () => {
  const uid = getParentUserId();
  const navigate = useNavigate();
  const showSkip = isFromCRM();

  const userInitiatedRef = useRef(false);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, []);

  const [planUuid, setPlanUuid] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [existingPan, setExistingPan] = useState(null);
  const [existingAadhaar, setExistingAadhaar] = useState(null);
  const [prefillLoading, setPrefillLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [kycError, setKycError] = useState("");
  const [signRetry, setSignRetry] = useState(false);

  const kycRejectedRef = useRef(false);
  const signDeskStartedRef = useRef(false);
  const leadIdRef = useRef(null);
  const signIntervalRef = useRef(null);
  const syncCompletedRef = useRef(false);
  const signingCompletedRef = useRef(false);

  const validateFile = (file) => {
    if (!file) return false;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/tiff"
    ];

    if (!allowedTypes.includes(file.type)) {
      toastr.error("Allowed formats: PDF, JPG, JPEG, PNG, TIFF");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toastr.error("Maximum file size allowed is 5MB");
      return false;
    }

    return true;
  };

  const getLeadIdSafe = async () => {
    if (leadIdRef.current) return leadIdRef.current;
    const profile = await fetchUserProfileDetails(uid, DATA_BELONGS_TO);
    const leadId = profile?.data?.user_lead_id;
    if (leadId) leadIdRef.current = leadId;
    return leadId;
  };

  useEffect(() => {
    const bootstrap = async () => {
      const rejected = localStorage.getItem("kyc_rejected");
      const msg = localStorage.getItem("kyc_rejection_message");

      if (rejected === "1") {
        kycRejectedRef.current = true;

        setKycError(
          msg || "KYC rejected. Please upload documents again."
        );

        setExistingPan(null);
        setExistingAadhaar(null);
      }

      await init();
    };

    bootstrap();

    return () => {
      if (signIntervalRef.current) {
        clearInterval(signIntervalRef.current);
        signIntervalRef.current = null;
      }
    };
  }, []);

  const init = async () => {
    try {
      const paymentRes = await Getpaymentstatus({
        user_id: uid,
        data_belongs_to: DATA_BELONGS_TO
      });

      if (
        paymentRes?.status_code === 200 &&
        paymentRes.data?.plan_uuid !== "fp_expert" &&
        paymentRes.data?.plan_uuid !== "fp_robo"
      ) {
        setPlanUuid(paymentRes.data?.plan_uuid);

        const profile = await fetchUserProfileDetails(uid, DATA_BELONGS_TO);

        const addr = profile?.data?.address || "";
        const pin = profile?.data?.user_pincode || "";

        setAddress(addr);
        setPincode(pin);

        if (addr && pin) {
          setIsAddressSaved(true);
        }

        setPrefillLoading(false);

        if (!kycRejectedRef.current) {
          await checkExistingDocs(addr, pin);
        }

      } else {
        navigate("/commonDashboard", { replace: true });
      }
    } catch (e) {
      console.error("Init error", e);
      setPrefillLoading(false);
    }
  };

  const checkExistingDocs = async (addr = "", pin = "") => {
    try {
      const res = await GetDocumentDetails(uid, DATA_BELONGS_TO);

      if (res?.status_code !== "200") return;

      const docs = res.data || [];
      const panDoc = docs.find(d => d.document_cat_uuid === "panDirect");
      const aadhaarDoc = docs.find(d => d.document_cat_uuid === "e_aadhar");

      if (panDoc) {
        setExistingPan({
          name: panDoc.user_document_name,
          url: panDoc.read_file_url
        });
      }

      if (aadhaarDoc) {
        setExistingAadhaar({
          name: aadhaarDoc.user_document_name,
          url: aadhaarDoc.read_file_url
        });
      }

      if (panDoc && aadhaarDoc && addr && /^\d{6}$/.test(pin)) {
        const leadId = await getLeadIdSafe();
        if (leadId) await updateKycStatusApi({ leadId });
      }
    } catch (e) {
      console.error("Prefill failed", e);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!panFile && !existingPan) return toastr.error("Upload PAN");
    if (!aadhaarFile && !existingAadhaar) return toastr.error("Upload Aadhaar");

    if (!isAddressSaved) {
      if (!isValidAddress(address)) return toastr.error("Invalid address");
      if (!/^\d{6}$/.test(pincode)) return toastr.error("Invalid pincode");
    }

    setLoading(true);

    try {
      if (!isAddressSaved) {
        await updateBasicDetails({ user_id: uid, address, pincode });
        setIsAddressSaved(true);
      }

      if (panFile) await uploadDocument(panFile, "panDirect");
      if (aadhaarFile) await uploadDocument(aadhaarFile, "e_aadhar");

      const leadId = await getLeadIdSafe();

      if (!leadId) {
        toastr.error("Lead ID not found");
        return;
      }

      await updateKycStatusApi({
        leadId,
        panFile: panFile || null,
        aadhaarFile: aadhaarFile || null
      });

      userInitiatedRef.current = true;
      localStorage.removeItem("kyc_rejected");
      localStorage.removeItem("kyc_rejection_message");

      setKycError("");
      setSignRetry(false);

      startSignDeskOnce();
    } catch (err) {
      toastr.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file, type) => {
    const form = new FormData();
    form.append("user_document_user_id", uid);
    form.append("document_cat_uuid", type);
    form.append("user_document_belongs_to", DATA_BELONGS_TO);
    form.append("document_files", file, file.name);
    const res = await UploadDocumentApi(form);
    if (res?.status_code !== "200") throw new Error("Upload failed");
  };

  const startSignDeskOnce = async () => {
    if (!userInitiatedRef.current) return;
    if (signDeskStartedRef.current) return;
    signDeskStartedRef.current = true;

    try {
      const signed = await Sign_Desk_Api_Check(uid);
      if (signed?.status_code === "200") return syncAndRedirect();
      initiateSigning();
    } catch {
      initiateSigning();
    }
  };

  const initiateSigning = async () => {
    if (signingCompletedRef.current) return;

    try {
      const docRes = await Get_Expert_Fp_Document(uid, planUuid);
      if (docRes?.status_code !== "200") return toastr.error("Agreement failed");

      const signRes = await Sign_Desk_Api({
        user_id: uid,
        file_content: docRes.data.b64_file_string,
        is_expert: true
      });

      const signUrl = signRes?.data?.signer_info?.[0]?.invitation_link;
      if (!signUrl) return toastr.error("Signing link failed");

      const popup = window.open(signUrl, "SignDesk", "width=1080,height=840");

      if (!popup) {
        toastr.error("Popup blocked. Please allow popups and try again.");
        signDeskStartedRef.current = false;
        return;
      }

      signIntervalRef.current = setInterval(async () => {
        try {
          const status = await Sign_Desk_Api_Check(uid);

          if (status?.status_code === "200") {
            signingCompletedRef.current = true;

            if (signIntervalRef.current) {
              clearInterval(signIntervalRef.current);
              signIntervalRef.current = null;
            }
            popup?.close();
            syncAndRedirect();
            return;
          }

          if (popup?.closed) {
            if (signIntervalRef.current) {
              clearInterval(signIntervalRef.current);
              signIntervalRef.current = null;
            }

            const finalCheck = await Sign_Desk_Api_Check(uid);

            if (finalCheck?.status_code === "200") {
              signingCompletedRef.current = true;
              await syncAndRedirect();
            } else {
              signDeskStartedRef.current = false;
              setSignRetry(true);
              toastr.warning(
                "Signing not completed. Please click 'Proceed to Agreement Signing' again."
              );
            }
            return;
          }
        } catch (err) {
          console.error("Sign polling error", err);
        }
      }, 5000);
    } catch {
      toastr.error("Signing failed");
    }
  };

  const syncAndRedirect = async () => {
    if (syncCompletedRef.current) return;
    syncCompletedRef.current = true;

    try {
      await postSignUpdates();
      const leadId = await getLeadIdSafe();
      if (leadId) await updateFpAgreementStatusApi(leadId);
    } finally {
      window.location.href = process.env.PUBLIC_URL + "/commondashboard";
    }
  };

  const postSignUpdates = async () => {
    const res = await check_all_status_api(uid);
    if (res?.status_code !== "200") return;

    Object.entries(res.data).forEach(([key, value]) =>
      setItemLocal(key, value)
    );
  };

  const isBothDocsPresent =
    (panFile || existingPan) && (aadhaarFile || existingAadhaar);

  if (!Cookies.get("token")) return null;

  return (
    <>
      <HideHeader />
      <HideFooter />

      {(loading || prefillLoading) && <FintooLoader />}

      {kycError ? (
        <div className="alert alert-danger text-center mb-3 shadow-sm">
          <div className="fw-bold mb-1">KYC Verification Failed</div>
          <div style={{ fontSize: "14px" }}>
            {"Please upload valid PAN & Aadhar to continue."}
          </div>
        </div>
      ) : prefillLoading ? (
        <div className="alert alert-info text-center py-2 mb-3">
          🔄 Loading your saved details...
        </div>
      ) : null}

      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
        <div className="card shadow-sm" style={{ maxWidth: "520px", width: "100%" }}>
          <div className="card-body p-4">
            <h4 className="text-center mb-1">Complete Your KYC Verification</h4>
            <p className="text-center text-muted mb-4" style={{ fontSize: "14px" }}>
              please verify your identity and provide required details.
            </p>

            <div className="mb-4 p-3 border rounded bg-light">
              <h6 className="mb-2">📍 Address Information</h6>

              <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
                This is a one-time step. Your address will be securely stored.
              </p>

              <label className="fw-semibold mb-1">Full Address</label>
              <textarea
                className="form-control mb-3"
                placeholder="Enter your complete residential address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={prefillLoading || (isAddressSaved && !kycRejectedRef.current)}
              />

              <label className="fw-semibold mb-1">Pincode</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter 6 digit pincode"
                value={pincode}
                maxLength={6}
                disabled={prefillLoading || (isAddressSaved && !kycRejectedRef.current)}
                onChange={(e) =>
                  setPincode(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            <div className="mb-3">
              <h6 className="mb-2">📄 Identity Documents</h6>
              <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
                Please upload clear and valid copies of your PAN and Aadhar card. These are mandatory for KYC verification as per regulatory requirements.
              </p>
              <small className="text-muted d-block mt-1">
                Accepted formats: PDF, JPG, JPEG, PNG, Tiff | Max size: 5MB
              </small>
            </div>

            <div className="mb-4">
              <label className="fw-semibold mb-1">PAN Card</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.tiff"
                className="form-control"
                disabled={prefillLoading}
                onChange={(e) => {
                  if (prefillLoading || !e.target.files.length) return;

                  const file = e.target.files[0];
                  if (validateFile(file)) {
                    setPanFile(file);
                    setExistingPan(null);
                  }
                }}
              />
              {(panFile || existingPan) && (
                <small className="text-success d-block mt-1">
                  ✔ {(panFile || existingPan).name}
                  {existingPan?.url && (
                    <a
                      href={existingPan.url}
                      target="_blank"
                      rel="noreferrer"
                      className="ms-2"
                    >
                      View
                    </a>
                  )}
                </small>
              )}
            </div>

            <div className="mb-4">
              <label className="fw-semibold mb-1">Aadhar Card</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.tiff"
                className="form-control"
                disabled={prefillLoading}
                onChange={(e) => {
                  if (prefillLoading || !e.target.files.length) return;

                  const file = e.target.files[0];
                  if (validateFile(file)) {
                    setAadhaarFile(file);
                    setExistingAadhaar(null);
                  }
                }}
              />
              {(aadhaarFile || existingAadhaar) && (
                <small className="text-success d-block mt-1">
                  ✔ {(aadhaarFile || existingAadhaar).name}
                  {existingAadhaar?.url && (
                    <a
                      href={existingAadhaar.url}
                      target="_blank"
                      rel="noreferrer"
                      className="ms-2"
                    >
                      View
                    </a>
                  )}
                </small>
              )}
            </div>
            <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
              <button
                onClick={handleSubmit}
                disabled={prefillLoading || loading}
                style={{
                  filter: prefillLoading ? "blur(2px)" : "none",
                  opacity: prefillLoading ? 0.6 : 1,
                  pointerEvents: prefillLoading ? "none" : "auto",
                  transition: "all 0.2s ease"
                }}
                className="btn btn-primary px-5 py-2 rounded-pill"
              >
                {prefillLoading
                  ? "Loading..."
                  : kycError && !isBothDocsPresent
                    ? "Re-upload Documents"
                    : signRetry
                      ? "Proceed to Agreement Signing"
                      : isBothDocsPresent
                        ? "Proceed to Agreement Signing"
                        : "Upload & Continue"}
              </button>
              {showSkip && (
                <button
                  className="btn btn-outline-secondary px-5 py-2 rounded-pill"
                  onClick={() => {
                    sessionStorage.setItem("kyc_skipped", "1");
                    window.location.href = process.env.PUBLIC_URL + "/commondashboard";
                  }}
                >
                  Skip KYC
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationDocuments;