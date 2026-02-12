import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2/lib/lib";
import "react-phone-input-2/lib/style.css";
import { InlineWidget } from "react-calendly";

import {

  sendOTP,
  verifyOTP,
} from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import LandingPageCalendly from "../landingpagesCalendly/LandingPageCalendly";
import Calendar from "../Pages/Calendly/Calendar";

const LeadWithOtp = ({ pageName, calendlyurl }) => {
  const [step, setStep] = useState(1);
  const [resendTimer, setResendTimer] = useState(50);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "", // raw digits only
    comment: "",
  });

  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});

  /* ------------------ UTM ------------------ */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    sessionStorage.setItem(
      "utm_source",
      params.get("utm_source") || "Website Callback"
    );
    sessionStorage.setItem("tags", params.get("tags") || "");
  }, []);

  /* ------------------ OTP TIMER ------------------ */
  useEffect(() => {
    if (step !== 2) return;

    setCanResend(false);
    setResendTimer(50);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  /* ------------------ REDIRECT ------------------ */
  // useEffect(() => {
  //   if (step === 3) {
  //     const t = setTimeout(() => {
  //       window.location.replace("https://www.fintoo.in/thankyou-page");
  //     }, 800);
  //     return () => clearTimeout(t);
  //   }
  // }, [step]);

  /* ------------------ HELPERS ------------------ */
  const isIndianUser = phoneCountry?.countryCode === "in";

  const getIndianMobile = () => formData.mobile.slice(-10);

  const getFormattedPhone = () => {
    if (!phoneCountry || !formData.mobile) return "";

    return `+${phoneCountry.dialCode}${formData.mobile.slice(-(
      phoneCountry.countryCode === "in" ? 10 : formData.mobile.length
    ))}`;
  };

  /* ------------------ VALIDATION ------------------ */
  const validateForm = () => {
    const e = {};

    if (!formData.fullName.trim()) e.fullName = "Full name is required";


    if (!phoneCountry) e.mobile = "Please select country and number";

    if (isIndianUser) {
      if (!formData.mobile || getIndianMobile().length !== 10) {
        e.mobile = "Enter valid 10 digit mobile number";
      }
    } else {
      if (!formData.email) {
        e.email = "Email is required for OTP";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        e.email = "Enter a valid email";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ------------------ SEND OTP ------------------ */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSendingOtp(true);

    try {
      const payload = isIndianUser
        ? {
          identifier: getIndianMobile(), 
          for_otp: "mobile",
        }
        : {
          identifier: formData.email,
          for_otp: "email",
        };

      const res = await sendOTP(payload);

      if (Number(res?.status_code) === 200) {
        setErrors({});
        setStep(2);
      } else {
        alert("Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("OTP send failed");
    } finally {
    setIsSendingOtp(false);
    }
  };

  /* ------------------ RESEND OTP ------------------ */
  const handleResendOtp = async () => {
    try {
      const payload = isIndianUser
        ? {
          identifier: getIndianMobile(),
          for_otp: "mobile",
        }
        : {
          identifier: formData.email,
          for_otp: "email",
        };

      await sendOTP(payload);
      setOtp("");
      setCanResend(false);
      setResendTimer(50);
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------ VERIFY OTP ------------------ */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setErrors({ otp: "Enter 6 digit OTP" });
      return;
    }

    setIsVerifying(true);

    try {
      const payload = isIndianUser
        ? {
          identifier: getIndianMobile(),
          for_otp: "mobile",
          otp,
        }
        : {
          identifier: formData.email,
          for_otp: "email",
          otp,
        };

      const otpRes = await verifyOTP(payload);

      if (Number(otpRes?.status_code) !== 200) {
        setErrors({ otp: "Invalid OTP. Please try again." });
        return;
      }

      setErrors({});

      setStep(3);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsVerifying(false);
    }
  };

  const prefillState = {
    name: formData.fullName,
    email: formData.email,
    customAnswers: {
      a2: getFormattedPhone(),   // Phone number
    },
  };


  return (
    <div className="tw-bg-white tw-text-left tw-rounded-3xl tw-p-10 tw-shadow-2xl tw-border tw-border-gray-100">
      {step === 1 && (
        <>
          <h3 className="tw-text-2xl tw-font-bold tw-text-primary tw-mb-4 tw-text-black">
            Schedule Your Free Consultation
          </h3>

          <form className="tw-space-y-6" onSubmit={handleFormSubmit}>
            {/* Full Name */}
            <div>
              <label className="tw-block tw-text-gray-700 tw-font-semibold tw-mb-1 tw-text-sm">
                Full Name *
              </label>
              <input
                type="text"
                className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-border-accent tw-text-sm"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
              {errors.fullName && (
                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="tw-block tw-text-gray-700 tw-font-semibold tw-mb-1 tw-text-sm">
                Email ID *
              </label>
              <input
                type="email"
                className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-border-accent tw-text-sm"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && (
                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="tw-block tw-text-gray-700 tw-font-semibold tw-mb-1 tw-text-sm">
                Mobile Number *
              </label>
              <PhoneInput
                country={"in"}                // default India
                enableSearch                  // search among 200+ countries
                countryCodeEditable={true}
                inputStyle={{
                  width: "100%",
                  height: "44px",
                  fontSize: "14px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                }}
                buttonStyle={{
                  borderRadius: "12px 0 0 12px",
                  border: "1px solid #d1d5db",
                }}
                dropdownStyle={{
                  borderRadius: "12px",
                }}
                value={formData.mobile}
                onChange={(value, country) => {
                  // value example: "14155552671"
                  // we store +14155552671 (E.164)
                  setFormData({
                    ...formData,
                    mobile: value,
                  });
                  setPhoneCountry(country);
                }}
              />


              {errors.mobile && (
                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                  {errors.mobile}
                </p>
              )}
            </div>




            {/* Comment */}
            <div>
              <label className="tw-block tw-text-gray-700 tw-font-semibold tw-mb-1 tw-text-sm">
                Comment / Message
              </label>
              <textarea
                rows="4"
                className="tw-w-full tw-px-3 tw-py-2 tw-border !tw-border-[#e9e9e9] tw-rounded-xl focus:tw-outline-none focus:tw-border-accent tw-text-sm"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
              />
            </div>




            <button
  type="submit"
  disabled={isSendingOtp}
  className={`tw-w-full tw-px-8 tw-py-4 tw-font-bold tw-rounded-full tw-transition-all tw-shadow-lg
    ${isSendingOtp
      ? "tw-bg-gray-400 tw-cursor-not-allowed"
      : "tw-bg-fintoo-blue hover:tw-bg-blue-900 tw-text-white"
    }`}
>
  {isSendingOtp ? (
  <span className="tw-flex tw-items-center tw-justify-center">
    Sending OTP...
    <span className="tw-ml-2 tw-animate-spin tw-border-2 tw-border-white tw-border-t-transparent tw-rounded-full tw-w-4 tw-h-4" />
  </span>
) : (
  "Continue"
)}

</button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className="tw-text-2xl tw-font-bold tw-text-black tw-mb-0">
            Verify OTP
          </h3>

          <p className="tw-text-sm tw-text-gray-600 tw-mb-4">
            OTP sent to{" "}
            <span className="tw-font-semibold">
              {phoneCountry?.countryCode === "in"
                ? formData.mobile
                : formData.email}
            </span>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="tw-text-fintoo-blue tw-ml-2 tw-text-sm tw-font-semibold"
            >
              Edit
            </button>
          </p>

          <form className="tw-space-y-6" onSubmit={handleOtpSubmit}>
            <input
              type="text"
              maxLength="6"
              className="tw-w-full tw-text-center tw-text-xl tw-tracking-widest tw-px-4 tw-py-4 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-border-accent"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            {errors.otp && (
              <p className="tw-text-red-500 tw-text-sm">{errors.otp}</p>
            )}

            <button
              type="submit"
              className="tw-w-full tw-px-8 tw-py-4 tw-bg-fintoo-blue tw-text-white tw-font-bold tw-rounded-full hover:tw-bg-blue-900 tw-transition-all"
            >
              {isVerifying ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </form>

          <div className="tw-text-center tw-mt-4">
            {!canResend ? (
              <p className="tw-text-sm tw-text-gray-500">
                Resend OTP in <span className="tw-font-semibold">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                className="tw-text-sm tw-font-semibold tw-text-fintoo-blue"
              >
                Resend OTP
              </button>
            )}
          </div>
        </>
      )}

      {step === 3 && (
        <div className="tw-bg-white tw-space-y-4 tw-py-6">

          {/* <InlineWidget url={calendlyurl} prefill={prefillState} /> */}
          <LandingPageCalendly variant="minimal" prefill={prefillState} pageName={pageName} servicename={"assisted_advisory_fixed_fees"} calendlyurl={calendlyurl} />
        </div>
      )}

    </div>
  );
};

export default LeadWithOtp;
