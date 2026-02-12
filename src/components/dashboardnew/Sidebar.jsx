import React from "react";
import { FaTachometerAlt, FaFolder, FaChartBar, FaPlusSquare } from "react-icons/fa";

export default function Sidebar() {
  const menu = [
    { label: "Dashboard", icon: FaTachometerAlt },
    { label: "Portfolio", icon: FaFolder },
    { label: "Report", icon: FaChartBar },
    { label: "Transaction", icon: FaPlusSquare },
  ];

  return (<>      <nav className="tw-flex tw-flex-col tw-gap-6 tw-w-full">
        {menu.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              className="tw-flex tw-items-center tw-gap-3 tw-text-gray-500 hover:tw-text-gray-900 tw-font-medium tw-text-sm"
            >
              <Icon className="tw-w-5 tw-h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="tw-w-full tw-h-px tw-bg-gray-200 tw-mt-4"></div>
      </>
  );
}