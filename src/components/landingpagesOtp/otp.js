import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2/lib/lib";
import "react-phone-input-2/lib/style.css";
import styles from "./otp.module.css";

import {
  generateLead,
  sendOTP,
  verifyOTP,
} from "../../FrappeIntegration-Services/services/user-management-api/userApiService";

const GOOGLE_SHEET_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbxa1JKqBxbApkWyNRT0mTA2R2R5X7CqcapHr9qbiKoyhrg-ILgGdJo9vEH4EdIzlNNx/exec";

const INCOME_SLAB_OPTIONS = [
  "0 - 10 Lakhs",
  "10 - 25 Lakhs",
  "25 - 50 Lakhs",
  "50 Lakhs - 1 Crore",
  "1 Cr+",
];

const LeadWithOtp = ({ pageName }) => {
  const [step, setStep] = useState(1);
  const [resendTimer, setResendTimer] = useState(50);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    incomeSlab: "",
  });

  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    sessionStorage.setItem(
      "utm_source",
      params.get("utm_source") || "Website Callback"
    );
    sessionStorage.setItem("tags", params.get("tags") || "");
  }, []);

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

  useEffect(() => {
    if (step !== 3) return;

    const redirectTimer = setTimeout(() => {
      window.location.assign("/thankyou-page");
    }, 800);

    return () => clearTimeout(redirectTimer);
  }, [step]);

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get("utm_source") || "Website Callback";
  const utmCampaign = urlParams.get("utm_campaign") || "";
  const tags = urlParams.get("tags") || "";
  const utmMedium = urlParams.get("utm_medium") || "CPC";

  const isIndianUser = phoneCountry?.countryCode === "in";

  const getIndianMobile = () => formData.mobile.slice(-10);

  const getFormattedPhone = () => {
    if (!phoneCountry || !formData.mobile) return "";

    return `+${phoneCountry.dialCode}${formData.mobile.slice(-(
      phoneCountry.countryCode === "in" ? 10 : formData.mobile.length
    ))}`;
  };

  const validateForm = () => {
    const e = {};

    if (!formData.fullName.trim()) e.fullName = "Full name is required";

    if (!formData.email) {
      e.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      e.email = "Enter a valid email";
    }

    if (!phoneCountry) e.mobile = "Please select country and number";

    if (isIndianUser) {
      if (!formData.mobile || getIndianMobile().length !== 10) {
        e.mobile = "Enter valid 10 digit mobile number";
      }
    }

    if (!formData.city.trim()) e.city = "City is required";

    if (!formData.incomeSlab) e.incomeSlab = "Please select income slab";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitLeadToGoogleSheet = async () => {
    const submittedAt = new Date();
    const payload = {
      name: formData.fullName.trim(),
      "email id": formData.email.trim(),
      email_id: formData.email.trim(),
      "mobile number": getFormattedPhone(),
      mobile_number: getFormattedPhone(),
      city: formData.city.trim(),
      "income slab": formData.incomeSlab,
      income_slab: formData.incomeSlab,
      date: submittedAt.toLocaleDateString("en-CA"),
      time: submittedAt.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    };

    await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });
  };

  const submitLeadToCRMAndWebengage = async () => {
    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedCity = formData.city.trim();
    const cleanedMobile = isIndianUser
      ? getIndianMobile()
      : getFormattedPhone().replace(/^\+/, "");

    const leadRes = await generateLead({
      full_name: trimmedName,
      email: trimmedEmail,
      mobile: cleanedMobile,
      city: trimmedCity,
      slab: formData.incomeSlab,
      source: utmSource,
      campaign: utmCampaign,
      tag: tags,
      services: ["assisted_advisory_fixed_fees"],
    });

    if (window.webengage) {
      const nameParts = trimmedName.split(" ");
      window.webengage.user.setAttribute("we_first_name", nameParts[0] || "");
      window.webengage.user.setAttribute(
        "we_last_name",
        nameParts.slice(1).join(" ")
      );
      window.webengage.user.setAttribute("we_email", trimmedEmail);
      window.webengage.user.setAttribute("we_phone", cleanedMobile);
      window.webengage.user.setAttribute("we_city", trimmedCity);
      window.webengage.user.setAttribute("City", trimmedCity);
      window.webengage.user.setAttribute("Income Slab", formData.incomeSlab);
      window.webengage.user.setAttribute("Lead Source", utmSource);
      window.webengage.user.setAttribute("Lead Medium", utmMedium);
      window.webengage.user.setAttribute("LeadDate", new Date());
      window.webengage.user.setAttribute("we_whatsapp_opt_in", true);

      window.webengage.track(pageName || "OTP Lead", {
        name: trimmedName,
        email: trimmedEmail,
        number: cleanedMobile,
        City: trimmedCity,
        "Lead Source": utmSource,
        "Lead Medium": utmMedium,
        "Lead Status": "Entry",
        "RM Name": "Online",
        "RM Email": "Online@fintoo.in",
        "Lead Type": pageName || "OTP Lead",
        "Income Slab": formData.incomeSlab,
        "Tag": tags || "",
        "Lead Date": new Date(),
      });

      const leadId = leadRes?.data?.lead_id;
      if (leadId) {
        try {
          window.webengage.user.login(leadId);
        } catch (error) {
          console.warn("WebEngage login failed:", error);
        }
      }
    }

    return leadRes;
  };

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
      setIsSubmittingLead(true);

      try {
        await submitLeadToCRMAndWebengage();
        await submitLeadToGoogleSheet();
      } catch (sheetError) {
        console.error("Lead submission failed", sheetError);
      } finally {
        setIsSubmittingLead(false);
      }

      setStep(3);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={styles.card}>
      {step === 1 && (
        <>
          <h3 className={styles.title}>Schedule Your Free Consultation</h3>

          <form className={styles.form} onSubmit={handleFormSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name *</label>
              <input
                type="text"
                className={styles.input}
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
              {errors.fullName && (
                <p className={styles.error}>{errors.fullName}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email ID *</label>
              <input
                type="email"
                className={styles.input}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
            </div>

            <div className={`${styles.field} ${styles.phoneField}`}>
              <label className={styles.label}>Mobile Number *</label>
              <PhoneInput
                country={"in"}
                enableSearch
                countryCodeEditable={true}
                value={formData.mobile}
                onChange={(value, country) => {
                  setFormData({
                    ...formData,
                    mobile: value,
                  });
                  setPhoneCountry(country);
                }}
              />

              {errors.mobile && <p className={styles.error}>{errors.mobile}</p>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>City *</label>
              <input
                type="text"
                className={styles.input}
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
              {errors.city && <p className={styles.error}>{errors.city}</p>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Income Slab *</label>
              <select
                className={styles.select}
                value={formData.incomeSlab}
                onChange={(e) =>
                  setFormData({ ...formData, incomeSlab: e.target.value })
                }
              >
                <option value="">Select income slab</option>
                {INCOME_SLAB_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.incomeSlab && (
                <p className={styles.error}>{errors.incomeSlab}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSendingOtp}
              className={`${styles.submitButton} ${
                isSendingOtp ? styles.buttonDisabled : ""
              }`}
            >
              {isSendingOtp ? (
                <span className={styles.buttonContent}>
                  Sending OTP...
                  <span className={styles.spinner} />
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
          <h3 className={styles.title}>Verify OTP</h3>

          <p className={styles.subtext}>
            OTP sent to{" "}
            <span className={styles.subtextStrong}>
              {phoneCountry?.countryCode === "in"
                ? formData.mobile
                : formData.email}
            </span>

            <button
              type="button"
              onClick={() => setStep(1)}
              className={styles.editButton}
            >
              Edit
            </button>
          </p>

          <form className={styles.form} onSubmit={handleOtpSubmit}>
            <input
              type="text"
              maxLength="6"
              className={styles.otpInput}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            {errors.otp && <p className={styles.error}>{errors.otp}</p>}

            <button
              type="submit"
              disabled={isVerifying || isSubmittingLead}
              className={styles.submitButton}
            >
              {isVerifying || isSubmittingLead
                ? "Submitting..."
                : "Verify OTP"}
            </button>
          </form>

          <div className={styles.resendWrap}>
            {!canResend ? (
              <p className={styles.timerText}>
                Resend OTP in{" "}
                <span className={styles.timerValue}>{resendTimer}s</span>
              </p>
            ) : (
              <button onClick={handleResendOtp} className={styles.linkButton}>
                Resend OTP
              </button>
            )}
          </div>
        </>
      )}

      {step === 3 && (
        <div className={styles.successWrap}>
          <div className={styles.successBadge}>Verified</div>
          <h3 className={styles.title}>Consultation request received</h3>
          <p className={styles.subtext}>
            Thank you{formData.fullName ? `, ${formData.fullName}` : ""}. Your
            details have been shared with our team for {pageName || "this request"}.
          </p>
          <p className={styles.subtext}>
            We will connect with you within 24hours.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadWithOtp;
