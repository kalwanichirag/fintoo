import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import QuickInfoCards from "./QuickInfoCards";
import AssetAllocationCard from "./AssestAllocationCard";
import SavingsGoals from "./SavingsGoals";
import FinancialOverview from "./FinancialOverview";
import CalculatorsPreview from "./Calculators";
import "../../components/Insurance/tailwind.css";
import LiabilityOverview from "./LiabilityOverview";
import commonEncode from "../../commonEncode";
import { successAlert } from "../../common_utilities";
import RenewalNotice from "./RenewalNotice";

export default function MainDashboard() {
  const [showItrThankYou, setShowItrThankYou] = useState(
    () => sessionStorage.getItem("showItrBookingThankYou") === "true"
  );

  const closeItrThankYou = () => {
    sessionStorage.removeItem("showItrBookingThankYou");
    setShowItrThankYou(false);
  };

  useEffect(() => {
    if (!showItrThankYou) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") closeItrThankYou();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasRmParam = params.has("rm");
    const value = params.get("rm") || "";

    if (!hasRmParam) return;

    const decodedValue = value.replaceAll(" ", "+");
    const rmName = decodedValue
      ? commonEncode.decrypt(decodedValue) || "Your Wealth Manager"
      : "Your Wealth Manager";

    if (!rmName) return;

    successAlert(
      "Your financial planning report has been generated and shared with your designated wealth manager. <br/><b>" +
      
        rmName +
        "</b> will get in touch with you shortly and help you understand the report."
    );
  }, []);

  return (
    <>
      <div className="dashboard-compact">
        <RenewalNotice />
        <QuickInfoCards />
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-2 md:tw-gap-3 tw-mb-3 md:tw-mb-4">
          <div className="lg:tw-col-span-4 glass-card tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-100">
            <AssetAllocationCard key="asset-allocation" state={"filled"} />
          </div>
          <div className="lg:tw-col-span-8 glass-card tw-relative tw-rounded-2xl tw-bg-white/60 tw-backdrop-blur-md tw-border tw-border-slate-200 tw-shadow-sm">
            <FinancialOverview key="financial-overview" />
          </div>
          <div className="lg:tw-col-span-4 tw-glass-card tw-relative tw-rounded-2xl tw-p-4 md:tw-p-6 tw-bg-white/60 tw-backdrop-blur-md tw-border tw-border-slate-200 tw-shadow-sm">
            <LiabilityOverview />
          </div>
          <div className="lg:tw-col-span-8 tw-glass-card tw-relative tw-rounded-2xl tw-p-4 md:tw-p-6 tw-bg-white/60 tw-backdrop-blur-md tw-border tw-border-slate-200 tw-shadow-sm">
            <SavingsGoals />
          </div>
         
        </div>
        <div className="tw-mt-4 md:tw-mt-6">
          <CalculatorsPreview />
        </div>
      </div>

      {showItrThankYou && (
        <div
          className="tw-fixed tw-inset-0 tw-z-[9999] tw-flex tw-items-center tw-justify-center tw-bg-slate-950/55 tw-p-4 tw-backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="itr-booking-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeItrThankYou();
          }}
        >
          <div className="tw-relative tw-w-full tw-max-w-[520px] tw-overflow-hidden tw-rounded-3xl tw-bg-white tw-shadow-[0_24px_80px_rgba(2,43,98,0.28)]">
            <div className="tw-absolute tw-inset-x-0 tw-top-0 tw-h-1.5 tw-bg-gradient-to-r tw-from-[#0b4f9c] tw-via-[#1677c8] tw-to-[#43b97f]" />

            <button
              type="button"
              onClick={closeItrThankYou}
              className="tw-absolute tw-right-5 tw-top-5 tw-z-10 tw-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded-full tw-bg-slate-100 tw-text-slate-500 tw-transition hover:tw-bg-slate-200 hover:tw-text-slate-800"
              aria-label="Close"
            >
              <IoClose className="tw-text-2xl" />
            </button>

            <div className="tw-px-6 tw-pb-7 tw-pt-10 sm:tw-px-10 sm:tw-pb-9">
              <div className="tw-mx-auto tw-flex tw-h-20 tw-w-20 tw-items-center tw-justify-center tw-rounded-full tw-bg-emerald-50 tw-ring-8 tw-ring-emerald-50/50">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="tw-h-10 tw-w-10 tw-text-emerald-500"
                  aria-hidden="true"
                >
                  <path
                    d="m6.5 12.5 3.4 3.4 7.6-8"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="tw-mt-7 tw-text-center">
                <span className="tw-inline-flex tw-rounded-full tw-bg-blue-50 tw-px-3 tw-py-1 tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wider tw-text-[#0b4f9c]">
                  ITR filing appointment
                </span>
                <h2
                  id="itr-booking-title"
                  className="tw-mt-4 tw-text-2xl tw-font-bold tw-leading-tight tw-text-slate-900 sm:tw-text-[28px]"
                >
                  Your appointment is confirmed
                </h2>
                <p className="tw-mx-auto tw-mt-3 tw-max-w-md tw-text-[15px] tw-leading-6 tw-text-slate-600">
                 A tax expert will call you at
                  the scheduled time and guide you through your ITR filing.
                </p>
              </div>

              <div className="tw-mt-6 tw-flex tw-items-start tw-gap-3 tw-rounded-2xl tw-border tw-border-blue-100 tw-bg-blue-50/70 tw-p-4">
                <div className="tw-mt-0.5 tw-flex tw-h-8 tw-w-8 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-bg-white tw-text-[#0b4f9c] tw-shadow-sm">
                  <span className="tw-text-sm tw-font-bold">i</span>
                </div>
                <p className="tw-m-0 tw-text-sm tw-leading-5 tw-text-slate-600">
                  Please keep your income and tax documents ready for a smooth
                  filing experience.
                </p>
              </div>

              <button
                type="button"
                onClick={closeItrThankYou}
                className="tw-mt-6 tw-w-full tw-rounded-xl tw-bg-[#062c62] tw-px-5 tw-py-3.5 tw-text-sm tw-font-semibold tw-text-white tw-shadow-lg tw-shadow-blue-950/15 tw-transition hover:tw-bg-[#0b407f] focus:tw-outline-none focus:tw-ring-4 focus:tw-ring-blue-200"
              >
                Continue to dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
