import React, { forwardRef } from "react";

export const brandGreen = "#dd7300";
export const logo =
  "https://storage.googleapis.com/uxpilot-auth.appspot.com/TPXgOMVZTdXq8fZkCjQzXTMbbwL2%2Fclone-site-assets%2F7fc308ae-0216-4b2d-8a52-da87a3212af7.svg";

export const Section = forwardRef(function Section({ id, className = "", children, ...props }, ref) {
  return (
    <section ref={ref} id={id} className={`tw-bg-black tw-text-white ${className}`} {...props}>
      {children}
    </section>
  );
});

export function Container({ className = "", children }) {
  return (
    <div className={`tw-max-w-7xl tw-mx-auto tw-px-4 md:tw-px-8 ${className}`}>
      {children}
    </div>
  );
}

export function CTAButton({ children = "Book a free call", className = "" }) {
  return (
    <a
      href="#start"
      className={`tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-rounded-full tw-bg-white tw-px-6 tw-py-3 tw-text-sm tw-font-bold tw-text-black tw-no-underline tw-transition hover:tw-bg-gray-200 ${className}`}
    >
      <i className="fa-regular fa-calendar" />
      {children}
    </a>
  );
}
