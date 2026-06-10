import React from "react";

function Logo() {
  return (
    <a href="#home" className="tw-flex tw-items-center tw-gap-2.5 tw-no-underline">
      <span className="tw-relative tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-overflow-hidden tw-rounded-[10px] tw-bg-fintoo-orange">
        <span className="tw-absolute tw-right-1.5 tw-top-1.5 tw-h-3.5 tw-w-3.5 tw-rounded-full tw-bg-white" />
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="tw-relative tw-z-10">
          <path d="M3 14L9 4L15 14H3Z" fill="white" opacity="0.9" />
        </svg>
      </span>
      <span className="tw-font-dmserif1 tw-text-[22px] tw-font-bold tw-text-white">
        FINT<span className="tw-text-fintoo-orange">OO</span>
      </span>
    </a>
  );
}

const columns = [
  ["Services", ["ITR Filing", "Tax Planning", "ESOP Advisory", "Global Tax", "Wealth Advisory"]],
  ["Company", ["About Fintoo", "Our Team", "Corporate Tie-Ups", "Blog", "Careers"]],
  ["Contact", ["+91 77389 14692", "salman.warwande@fintoo.in", "Mumbai · Bangalore · Dubai"]],
];

export default function Footer() {
  return (
    <footer className="tw-border-0 tw-border-t tw-border-solid tw-border-white/10 tw-bg-fintoo-blue tw-px-[5%] tw-py-14">
      <div className="tw-mx-auto tw-max-w-7xl">
        <div className="tw-grid tw-gap-10 tw-border-0 tw-border-b tw-border-solid tw-border-white/10 tw-pb-12 md:tw-grid-cols-2 lg:tw-grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="tw-mt-4 tw-max-w-sm tw-text-sm tw-leading-7 tw-text-white/40">
              Building Trust & Technology in Wealth. SEBI Registered Investment Advisor - structured tax & financial
              advisory for India's corporate professionals.
            </p>
          </div>
          {columns.map(([title, links]) => (
            <div key={title}>
              <h3 className="tw-mb-5 tw-text-xs tw-font-bold tw-uppercase tw-text-white/30">{title}</h3>
              <ul className="tw-m-0 tw-grid tw-list-none tw-gap-2.5 tw-p-0">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#home" className="tw-text-sm tw-text-white/55 tw-no-underline hover:tw-text-fintoo-orange">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-6 tw-pt-8">
          <p className="tw-m-0 tw-max-w-3xl tw-text-[11px] tw-leading-5 tw-text-white/25">
            Fintoo Wealth Private Limited [SEBI RIA: INA000020031] [BASL: 2252] · B/309 Dynasty Business Park, Andheri
            East, Mumbai 400059 · Investments are subject to market risk. Past performance is not indicative of future
            returns.
          </p>
          <span className="tw-text-xs tw-text-white/30">© 2025 Fintoo</span>
        </div>
      </div>
    </footer>
  );
}
