import React, { useEffect, useState } from "react";
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
  const [consentId, setConsentId] = useState(null);
const [userProfile, setUserProfile] = useState(null);
const CIBIL_CACHE_KEY = "cibil_report_v1";
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

  /* ---------------- GENERATE TOKEN ---------------- */

  const handleGenerateToken = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const res = await generateRecordentToken({});
      const accessToken = res?.data?.access_token;

      if (!accessToken) {
        throw new Error("Token generation failed");
      }

      setRecordentToken(accessToken);
      await handleSendConsentOtp(accessToken);
    } catch (e) {
      console.error(e);
      setErrorMessage("Unable to initiate CIBIL check");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- SEND OTP ---------------- */

  const handleSendConsentOtp = async (token) => {
    try {
      const payload = {
        fullName: "SHETTY SUDHIR",
        uniqueId: "AHFLW7645D",
        mobileNumber: 9820140097,
      
        // fullName: selectedMember?.name ,
        // uniqueId: selectedMember?.pan ,
        // mobileNumber: selectedMember?.mobile ,
        requestType: 3,
        access_token: token,
      };

      const res = await sendRecordentOtp(payload);

      if (!res?.data?.requestId) {
        throw new Error("OTP send failed");
      }

      setRequestId(res.data.requestId);
      setOtp(Array(6).fill(""));
      setResendTimer(60);
      setCanResend(false);
      setStep("OTP");
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to send consent OTP");
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
      consentId,
      recordentProductCode: "RCDT3",
      access_token: recordentToken,
    });

    if (!res?.data) {
      throw new Error("CIBIL report not ready");
    }
    // Keep cache in sync as soon as fresh CIBIL data is received.
    localStorage.setItem(CIBIL_CACHE_KEY, JSON.stringify(res.data));

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

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      setIsLoading(true);

      await resendRecordentOtp({
        requestId,
        access_token: recordentToken,
      });

      setResendTimer(60);
      setCanResend(false);
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

  return (
    <div className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center">
      <div
        className="tw-absolute tw-inset-0 tw-bg-black/40"
        onClick={onClose}
      />

      <div className="tw-relative tw-z-10 tw-w-full tw-max-w-md tw-rounded-2xl tw-bg-white tw-p-6 tw-shadow-xl">
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
    </div>
  );
}
