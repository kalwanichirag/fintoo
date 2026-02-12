import { useState } from "react";
import {
  FaLock,
  FaPlug,
  FaSpinner,
  FaLightbulb,
} from "react-icons/fa";

export default function LiabilityOverview() {
  const [state, setState] = useState("empty"); 
  // empty → locked
  // loading → connecting
  // filled → active

  const connectLiabilities = () => {
    setState("loading");
    setTimeout(() => {
      setState("filled");
    }, 2000); // simulate API call
  };

  return (
    <div className="tw-bg-white tw-relative tw-rounded-2xl tw-p-6 tw-bg-white/60 tw-backdrop-blur-md tw-border tw-border-slate-200 tw-shadow-sm tw-mb-10">
      
      {/* Header */}
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
        <div>
          <h2 className="tw-text-xl tw-font-bold tw-text-slate-800">Liability Overview</h2>
          <p className="tw-text-slate-500 tw-text-sm">Outstanding debts & EMIs</p>
        </div>
      </div>

      {/* EMPTY STATE (Locked) */}
      {state === "empty" && (
        <div className="tw-relative tw-rounded-xl tw-border tw-border-dashed tw-border-slate-300 tw-bg-slate-50 tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-12 tw-text-center">

          <div className="tw-bg-orange-100 tw-w-16 tw-h-16 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-mb-4">
            <FaLock className="tw-text-orange-600 tw-text-2xl" />
          </div>

          <h3 className="tw-text-lg tw-font-semibold tw-text-slate-800 tw-mb-2">
            Liability Overview Locked
          </h3>

          <p className="tw-text-slate-600 tw-text-sm tw-max-w-xs tw-mx-auto tw-mb-6">
            Connect your credit cards, loans, and EMIs to unlock real-time insights and smart repayment suggestions.
          </p>

          <button
            onClick={connectLiabilities}
            className="tw-bg-orange-500 tw-text-white tw-px-6 tw-py-3 tw-rounded-lg tw-font-semibold hover:tw-bg-orange-600 tw-transition tw-flex tw-items-center"
          >
            <FaPlug className="tw-mr-2" /> Connect Now
          </button>

        </div>
      )}

      {/* LOADING STATE */}
      {state === "loading" && (
        <div className="tw-absolute tw-inset-0 tw-bg-white/80 tw-backdrop-blur-sm tw-flex tw-flex-col tw-items-center tw-justify-center tw-rounded-2xl">

          <FaSpinner className="tw-animate-spin tw-mb-4 tw-text-orange-600 tw-text-2xl" />
          <p className="tw-text-slate-700 tw-font-medium">
            Connecting your liabilities...
          </p>

        </div>
      )}

      {/* FILLED STATE */}
      {state === "filled" && (
        <div className="tw-space-y-4 tw-mt-6">

          {/* Credit Card */}
          <div className="tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-xl tw-p-4">
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
              <h3 className="tw-font-semibold tw-text-slate-800">Credit Card</h3>
              <span className="tw-text-red-600 tw-font-bold">₹45,680</span>
            </div>

            <div className="tw-w-full tw-bg-red-200 tw-rounded-full tw-h-2 tw-mb-2">
              <div className="tw-bg-red-500 tw-h-2 tw-rounded-full" style={{ width: "76%" }}></div>
            </div>

            <div className="tw-flex tw-justify-between tw-text-sm">
              <span className="tw-text-slate-600">Due: 15th Dec</span>
              <span className="tw-text-red-600">18% APR</span>
            </div>

            <div className="tw-mt-3 tw-bg-orange-100 tw-border tw-border-orange-200 tw-rounded-lg tw-p-3">
              <div className="tw-flex tw-items-start">
                <FaLightbulb className="tw-text-orange-600 tw-mr-2 tw-mt-1" />
                <div>
                  <p className="tw-text-orange-800 tw-font-medium tw-text-sm">AI Suggestion</p>
                  <p className="tw-text-orange-700 tw-text-xs">
                    Pay ₹12,000 extra to avoid 18% APR charges
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Home Loan */}
          <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded-xl tw-p-4">
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
              <h3 className="tw-font-semibold tw-text-slate-800">Home Loan</h3>
              <span className="tw-text-blue-600 tw-font-bold">₹28,45,000</span>
            </div>

            <div className="tw-w-full tw-bg-blue-200 tw-rounded-full tw-h-2 tw-mb-2">
              <div className="tw-bg-blue-500 tw-h-2 tw-rounded-full" style={{ width: "34%" }}></div>
            </div>

            <div className="tw-flex tw-justify-between tw-text-sm">
              <span className="tw-text-slate-600">EMI: ₹35,420</span>
              <span className="tw-text-blue-600">7.5% Interest</span>
            </div>
          </div>

          {/* Car Loan */}
          <div className="tw-bg-green-50 tw-border tw-border-green-200 tw-rounded-xl tw-p-4">
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
              <h3 className="tw-font-semibold tw-text-slate-800">Car Loan</h3>
              <span className="tw-text-green-600 tw-font-bold">₹2,85,430</span>
            </div>

            <div className="tw-w-full tw-bg-green-200 tw-rounded-full tw-h-2 tw-mb-2">
              <div className="tw-bg-green-500 tw-h-2 tw-rounded-full" style={{ width: "68%" }}></div>
            </div>

            <div className="tw-flex tw-justify-between tw-text-sm">
              <span className="tw-text-slate-600">EMI: ₹12,890</span>
              <span className="tw-text-green-600">8.9% Interest</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
