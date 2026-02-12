import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";

export default function InfoTooltip({ title, description }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="tw-relative tw-inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <FiInfo
        size={12}
        className="tw-text-slate-400 hover:tw-text-fintoo-blue tw-cursor-pointer"
      />

      {open && (
        <div className="tw-absolute tw-z-50 tw-top-6 tw-left-0 tw-w-56 tw-rounded-xl tw-bg-white tw-shadow-lg tw-border tw-p-3">
          <p className="tw-text-xs tw-font-semibold tw-text-slate-800 tw-mb-1">
            {title}
          </p>
          <p className="tw-text-xs tw-text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
