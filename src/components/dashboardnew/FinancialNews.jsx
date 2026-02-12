import React from "react";
import { FaChartLine, FaBuilding, FaCoins } from "react-icons/fa";

export default function FinancialNews() {
  const newsList = [
    {
      icon: <FaChartLine className="tw-text-blue-600 tw-text-xl" />,
      bg: "tw-bg-blue-100",
      title: "RBI Announces New Digital Currency Guidelines",
      desc: "The Reserve Bank of India has released comprehensive guidelines for digital currency transactions...",
      source: "Economic Times",
      time: "2 hours ago",
    },
    {
      icon: <FaBuilding className="tw-text-blue-600 tw-text-xl" />,
      bg: "tw-bg-blue-100",
      title: "Top IT Stocks Rally After Strong Q3 Results",
      desc: "Major IT companies report better-than-expected earnings driving sector-wide gains...",
      source: "Business Standard",
      time: "4 hours ago",
    },
    {
      icon: <FaCoins className="tw-text-purple-600 tw-text-xl" />,
      bg: "tw-bg-purple-100",
      title: "Mutual Fund SIP Inflows Hit Record High",
      desc: "Systematic Investment Plan contributions reach ₹18,000 crores in November...",
      source: "Mint",
      time: "6 hours ago",
    },
  ];

  return (
    <div id="financial-news" className="glass-card tw-rounded-2xl tw-p-6">
      {/* Header */}
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
        <div>
          <h2 className="tw-text-xl tw-font-bold tw-text-slate-800">
            Financial News
          </h2>
          <p className="tw-text-slate-500 tw-text-sm">Latest updates</p>
        </div>
        <button className="tw-text-blue-600 hover:tw-text-blue-700 tw-font-medium tw-text-sm">
          View All
        </button>
      </div>

      {/* News List */}
      <div className="tw-space-y-4">
        {newsList.map((item, index) => (
          <article
            key={index}
            className="tw-p-4 tw-bg-slate-50 tw-rounded-xl hover:tw-bg-slate-100 tw-transition-colors tw-cursor-pointer"
          >
            <div className="tw-flex tw-items-start">
              <div
                className={`tw-w-16 tw-h-16 ${item.bg} tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-mr-4`}
              >
                {item.icon}
              </div>

              <div className="tw-flex-1">
                <h3 className="tw-font-semibold tw-text-slate-800 tw-mb-1 tw-pb-0">
                  {item.title}
                </h3>

                <p className="tw-text-slate-600 tw-text-sm tw-mb-2">
                  {item.desc}
                </p>

                <div className="tw-flex tw-items-center tw-text-slate-400 tw-text-xs">
                  <span>{item.source}</span>
                  <span className="tw-mx-2">•</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
