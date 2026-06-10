import React from "react";
import { PlannerIcon } from "./PlannerShared";

export default function SuccessModal({ corpus, onClose }) {
  return (
    <div className="tw-fixed tw-inset-0 tw-z-[1000] tw-flex tw-items-center tw-justify-center tw-bg-black/55 tw-p-5" onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="tw-relative tw-w-[90%] tw-max-w-[440px] tw-rounded-[22px] tw-bg-white tw-px-10 tw-py-11 tw-text-center tw-shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
      >
        <button onClick={onClose} className="tw-absolute tw-right-4 tw-top-[14px] tw-bg-transparent tw-text-2xl tw-leading-none tw-text-slate-500">
          ×
        </button>

        <div className="tw-mx-auto tw-mb-5 tw-flex tw-h-[72px] tw-w-[72px] tw-items-center tw-justify-center tw-rounded-full tw-bg-fintoo-blue/10 tw-text-fintoo-blue">
          <PlannerIcon type="checkCircle" className="tw-h-9 tw-w-9" />
        </div>

        <h3 className="tw-mb-[10px] tw-text-2xl tw-text-fintoo-blue"> We've Received Your Details!</h3>

        <div className="tw-mb-[22px] tw-rounded-[10px] tw-bg-fintoo-orange/10 tw-px-5 tw-py-[14px]">
          <div className="tw-text-xs tw-uppercase tw-tracking-[0.5px] tw-text-fintoo-blue">    Thank you for sharing your information with us.
</div>
          <div className="tw-text-4xl tw-text-fintoo-blue">{corpus}</div>
        </div>

        <p className="tw-mb-6 tw-text-base tw-leading-[1.6] tw-text-slate-500">
  Our advisory team will review your details and get in touch with you within <strong>24 hours</strong> to guide you further.
  <br /><br />
        </p>

        <a
       
          onClick={onClose}
          className="tw-block tw-cursor-pointer tw-rounded-[10px] tw-bg-fintoo-orange tw-py-[14px] tw-text-center tw-text-base tw-font-semibold tw-text-white  hover:tw-text-white"
        >
         Explore Our Services →
        </a>

        <p className="tw-mt-3 tw-text-xs tw-text-slate-500">  Keep an eye on your email for further updates.</p>
      </div>
    </div>
  );
}
