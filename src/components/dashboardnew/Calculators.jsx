import React from "react";
import {
  FaMoneyBillTrendUp,
  FaSackDollar,
  FaGlobe,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function CalculatorsPreview() {
    const navigate = useNavigate();

  return (
    <section id="calculators-preview" className="tw-mb-8">
      <div className="tw-bg-white tw-border-solid  tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200">

        {/* Header */}
        <div className="tw-p-6 tw-pb-0">
          <div className="tw-flex tw-items-center tw-justify-between">
            <h2 className="tw-text-xl tw-font-bold tw-text-navy tw-font-display">
              Investment & Planning Solutions
            </h2>
          </div>
        </div>

        {/* Cards */}
        <div className="tw-p-6 tw-pt-4">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">

           
            {[

              {
                icon: <FaMoneyBillTrendUp className="tw-text-white" />,
                title: "Tax Planning",
                desc: "Optimize tax savings with expert advice.",
                link: "/tax-planning-page"
              },
              {
                icon: <FaSackDollar className="tw-text-white" />,
                title: "Mutual Fund At Zero Cost",
                desc: "Invest in 2500+ mutual funds at 0% commission.",
                link: "/direct-mutual-fund/funds/all"
              },
              {
                icon: <FaGlobe className="tw-text-white" />,
                title: "Global Investment",
                desc: "Invest globally with confidence, backed by our expert advisory team.",
                link:"/international-equity"
              },
            ].map((item, idx) => (
              <div
                key={idx}
                 onClick={() => navigate(item.link)}
                className="tw-bg-white tw-rounded-lg tw-p-4 tw-border tw-border-solid tw-border-gray-200 tw-shadow-sm tw-transition tw-duration-200 hover:tw-shadow-md tw-cursor-pointer"
              >
                <div className="tw-flex tw-items-center tw-mb-3">
                  <div className="tw-p-2 tw-bg-fintoo-blue tw-rounded-lg tw-mr-3">
                    {item.icon}
                  </div>
                  <h3 className="tw-font-semibold tw-text-navy tw-pb-0 tw-mb-0">{item.title}</h3>
                </div>

                <p className="tw-text-sm tw-text-gray-600 tw-mb-1">
                  {item.desc}
                </p>

                <div
                 
                  className="tw-text-sm tw-text-fintoo-orange tw-font-medium">
                  Learn More →
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
