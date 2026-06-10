import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import DetailsStep from "./DetailStep";
import OtpStep from "./OtpStep";
import commonEncode from "../../../commonEncode";

import {
  generateRecordentToken,
  sendRecordentOtp,
  resendRecordentOtp,
  verifyRecordentOtp,
  fetchRecordentReport,
} from "../../../FrappeIntegration-Services/services/financial-planning-api/goal";

import { fetchUserProfileDetails } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { getUserId } from "../../../common_utilities";
import { Fetch_External_User_Loan_Details } from "../../../FrappeIntegration-Services/services/financial-planning-api/liabilities";
import { Update_External_User_Loan_Details } from "../../../FrappeIntegration-Services/services/financial-planning-api/liabilities";

import { Fetchexternalholdingdetails } from "../../../FrappeIntegration-Services/services/financial-planning-api/liabilities";
import { DATA_BELONGS_TO } from "../../../constants";
export default function CibilDetailsModal({ onClose, onSuccess }) {
  const [step, setStep] = useState("DETAILS");

  const [recordentToken, setRecordentToken] = useState(null);
  const [requestId, setRequestId] = useState(null);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
const [userProfile, setUserProfile] = useState(null);
const LIABILITY_CACHE_KEY = "LIABILITY_OVERVIEW_CACHE";
const LIABILITY_REFRESH_EVENT = "liability-overview-refresh";
    
    
  
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await fetchUserProfileDetails(getUserId());
      setUserProfile(res?.data);
      console.log("User Profile Details:", res?.data);
    } catch (error) {
      console.error("Failed to fetch user profile details", error);
    }
  };

  fetchProfile();
}, []);


  useEffect(() => {
    try {
      const decrypted = commonEncode.decrypt(
        localStorage.getItem("member")
      );
      const parsed = JSON.parse(decrypted) || [];

      const mapped = parsed.map((m) => ({
        id: m.id,
        name: m.name,
        pan: m.pan,
        mobile: m.mobile,
      }));

      setMembers(mapped);
      setSelectedMember(mapped[0]);
    } catch (e) {
      console.error("Member fetch failed", e);
    }
  }, []);

  /* ---------------- RESEND TIMER ---------------- */

  useEffect(() => {
    if (step !== "OTP" || canResend) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, canResend]);

  const activateOtpStep = (nextRequestId) => {
    setRequestId(nextRequestId);
    setOtp(Array(6).fill(""));
    setResendTimer(60);
    setCanResend(false);
    setStep("OTP");
  };

  /* ---------------- GENERATE TOKEN ---------------- */

  const handleGenerateToken = async (memberOverride = selectedMember) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const uniqueId = memberOverride?.pan?.trim();
      const mobileNumber = memberOverride?.mobile?.toString().trim();

      if (!uniqueId || !mobileNumber) {
        throw new Error("Please provide valid member details (PAN, mobile).");
      }

      const payload = {
        data_belongs_to: "DIR",
        user_id: getUserId(),
        mobileNumber,
        uniqueId,
      };

      const res = await generateRecordentToken(payload);
      const accessToken = res?.data?.access_token;
      const generatedRequestId = res?.data?.requestId;

      if (!accessToken) {
        throw new Error( "Token generation failed");
      }

      setRecordentToken(accessToken);

      if (generatedRequestId) {
        await handleResendOtp(accessToken, generatedRequestId, false);
        return;
      }

      await handleSendConsentOtp(accessToken, memberOverride);
    } catch (e) {
      console.error(e);
      setErrorMessage("Unable to initiate CIBIL check");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- SEND OTP ---------------- */

  const handleSendConsentOtp = async (token, memberOverride = selectedMember) => {
    try {
      const fullName = memberOverride?.name?.trim();
      const uniqueId = memberOverride?.pan?.trim();
      const mobileNumber = Number(memberOverride?.mobile);

      if (!fullName || !uniqueId || !mobileNumber) {
        throw new Error("Please provide valid member details (name, PAN, mobile).");
      }

      const payload = {
        user_id: getUserId(),
        access_token: token,
        fullName,
        mobileNumber,
        uniqueId,
        requestType: 3,
      };

      const res = await sendRecordentOtp(payload);

      const nextRequestId = res?.data?.requestId;

      if (Number(res?.status_code) !== 200 || !nextRequestId) {
        throw new Error("OTP send failed");
      }

      activateOtpStep(nextRequestId);
    } catch (e) {
      console.error(e);
      setErrorMessage( "Failed to send consent OTP");
    }
  };

  /* ---------------- VERIFY OTP ---------------- */

const handleVerifyOtp = async () => {
  if (otp.some((d) => d === "")) {
    setErrorMessage("Please enter OTP");
    return;
  }

  try {
    setIsLoading(true);
    setErrorMessage("");

    const res = await verifyRecordentOtp({
      requestId,
      otp: otp.join(""),
      access_token: recordentToken,
    });

    if (res?.status_code !== 200) {
      throw new Error("OTP verification failed");
    }

    const consentId = res?.data?.consentId;

    if (!consentId) {
      throw new Error("ConsentId missing after OTP verification");
    }

    // ✅ PASS consentId (not requestId)
    await handleFetchCibil(consentId);

  } catch (e) {
    console.error(e);
    setErrorMessage("Invalid OTP");
  } finally {
    setIsLoading(false);
  }
};
const buildLoanPayload = (profile, cibilData) => {
  const formatDob = (dob) => {
    // backend expects DD/MM/YYYY
    const [yyyy, mm, dd] = dob.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  return {
    user_name: `${profile.user_name} ${profile.middle_name || ""} ${profile.last_name || ""}`.trim(),
    user_id: profile.user_id,
    user_pan: profile.user_pan || selectedMember?.pan,
    user_dob: formatDob(profile.user_dob),
    data_belongs_to: "DIR",
    user_loan_for: profile.user_id,
    user_mobile: Number(profile.mobile),
    loan_data: cibilData, 
  };
};
  
  /* ---------------- FETCH CIBIL ---------------- */

const handleFetchCibil = async (consentId) => {
  try {
    const res = await fetchRecordentReport({
      user_id: getUserId(),
      consentId,
      recordentProductCode: "RCDT3",
      access_token: recordentToken,
    });

    if (!res?.data) {
      throw new Error("CIBIL report not ready");
    }

    // ✅ Build payload using profile + cibil
    if (!userProfile) {
      throw new Error("User profile not loaded");
    }

    const loanPayload = buildLoanPayload(userProfile, res.data);

    console.log("Loan API Payload:", loanPayload);

    const holdingPayload = {
      user_id: getUserId(),
      holding_type: "Loan",
      data_belongs_to: DATA_BELONGS_TO,
    };
    const holdingRes = await Fetchexternalholdingdetails(holdingPayload);
    const existingHolding = (holdingRes?.data?.holding_details || []).find(
      (item) => item?.user_id === loanPayload.user_id
    );

    if (existingHolding?.holding_id) {
      const updatePayload = {
        external_holding_id: existingHolding.holding_id,
        user_id: getUserId(),
        data_belongs_to: DATA_BELONGS_TO,
        loan_data: res.data,
      };
      const updateRes = await Update_External_User_Loan_Details(updatePayload);
      console.log("Loan API Update Response:", updateRes);
    } else {
      const loanRes = await Fetch_External_User_Loan_Details(loanPayload);
      console.log("Loan API Fetch Response:", loanRes);
    }

    // Invalidate and refresh liability overview immediately after loan APIs succeed.
    localStorage.removeItem(LIABILITY_CACHE_KEY);
    window.dispatchEvent(new CustomEvent(LIABILITY_REFRESH_EVENT));

    onSuccess(res.data);

  } catch (e) {
    console.error(e);
    setErrorMessage("Unable to fetch CIBIL / Loan details");
  }
};


  /* ---------------- RESEND OTP ---------------- */

  const handleResendOtp = async (
    requestToken = recordentToken,
    nextRequestId = requestId,
    enforceTimer = true
  ) => {
    if (enforceTimer && !canResend) return;

    try {
      setIsLoading(true);

      const res = await resendRecordentOtp({
        requestId: nextRequestId,
        access_token: requestToken,
      });

      if (Number(res?.status_code) !== 200) {
        throw new Error("Failed to resend OTP");
      }

      activateOtpStep(nextRequestId);
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- BACK ---------------- */

  const handleBack = () => {
    setStep("DETAILS");
    setOtp(Array(6).fill(""));
    setRequestId(null);
    setErrorMessage("");
  };

  /* ---------------- UI ---------------- */

  const modalNode = useMemo(() => {
    if (typeof document === "undefined") return null;
    return document.body;
  }, []);

  if (!modalNode) return null;

  return createPortal(
    <div className="tw-fixed tw-inset-0 tw-z-[9999] tw-flex tw-items-center tw-justify-center tw-p-4">
      <div
        className="tw-absolute tw-inset-0 tw-bg-black/40"
        onClick={onClose}
      />

      <div className="tw-relative tw-z-10 tw-w-full tw-max-w-lg tw-rounded-2xl tw-bg-white tw-p-6 tw-shadow-xl">
        {step === "DETAILS" && (
          <DetailsStep
            members={members}
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
            onClose={onClose}
            onNext={handleGenerateToken}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        )}

        {step === "OTP" && (
          <OtpStep
            mobile={selectedMember?.mobile}
            otp={otp}
            setOtp={setOtp}
            onBack={handleBack}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            resendTimer={resendTimer}
            canResend={canResend}
            errorMessage={errorMessage}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>,
    modalNode
  );
}
