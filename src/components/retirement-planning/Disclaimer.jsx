import { useState } from "react";

export default function Disclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      id="footer-disclaimer"
      className="tw-container tw-m-auto tw-border-t tw-border-gray-700 tw-py-4 tw-px-3 tw-border-t-solid"
    >
      {/* Toggle button only visible on small screens */}
      <div className="tw-flex tw-justify-between tw-items-center tw-block lg:tw-hidden">
        <h4 className="tw-text-sm tw-text-gray-400 tw-font-semibold">
          Disclaimer
        </h4>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="tw-text-gray-400 tw-text-xl tw-font-bold"
        >
          {isOpen ? "−" : "+"}
        </button>
      </div>

      {/* Disclaimer content */}
      <div
        className={`tw-text-xs tw-text-gray-400 tw-leading-relaxed tw-space-y-4 tw-transition-all tw-duration-300 ${
          isOpen ? "tw-max-h-screen tw-opacity-100 tw-mt-2" : "tw-max-h-0 tw-opacity-0 tw-overflow-hidden"
        } lg:tw-max-h-screen lg:tw-opacity-100 lg:tw-mt-4`}
      >
        <p>
          Fintoo Wealth Private Limited (Brand Name - Fintoo.in, Fintoo app, Fintoo) makes no warranties or representations, express or implied, on products and services offered through the platform. It accepts no liability for any damages or losses, however, caused in connection with the use of, or on the reliance of its advisory or related services. Past performance is not indicative of future returns. Please consider your specific investment requirements, risk tolerance, goal, time frame, risk and reward balance and the cost associated with the investment before choosing a fund, or designing a portfolio that suits your needs. Performance and returns of any investment portfolio can neither be predicted nor guaranteed. Investments made on advisory are subject to market risks, read all scheme related documents carefully.
        </p>

        <p>
          © Fintoo Wealth Private Limited [SEBI RIA Registration No: INA000020031] [BASL Membership ID: 2252] [Type of Registration: Non-Individual] [Validity of registration: March 26,2025-Perpetual] [Address: Fintoo Wealth Private Limited, B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059] [CIN - U66301MH2023PTC414206] [GST No : 27AAFCF7114E1ZV] [Principal Officer details : Mr. Mihir Shah (mihir.shah@fintoo.in)] [Compliance Officer details : Mrs. Nisha Harchekar (nisha.harchekar@fintoo.in)] [Corresponding SEBI regional/local office: Plot No. C 4-A , G Block, Near Bank of India, Bandra Kurla Complex,Bandra East, Mumbai, Maharashtra 400051]
        </p>

        <p className="tw-text-center tw-m-0">
          Copyright © 2025 Fintoo. All rights reserved
        </p>
      </div>
    </div>
  );
}
