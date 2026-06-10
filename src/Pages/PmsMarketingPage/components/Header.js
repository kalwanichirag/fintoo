import React from "react";
import { logo } from "./shared";

export default function Header() {
  return (
    <header className="tw-fixed tw-left-0 tw-right-0 tw-top-0 tw-z-50 tw-border-0 tw-border-b tw-border-solid tw-border-white/10 tw-bg-black/80 tw-backdrop-blur-md">
      <nav className="tw-mx-auto tw-flex tw-h-16 tw-max-w-7xl tw-items-center tw-justify-between tw-px-4 md:tw-px-8">
        <div className="tw-flex tw-items-center tw-gap-12">
          <img src={ process.env.REACT_APP_STATIC_URL + "media/wp/Fintoowhitelogo_.svg"} alt="Fintoo" className="tw-h-10" />
          <div className="tw-hidden tw-items-center tw-gap-5 tw-text-sm tw-text-gray-400 lg:tw-flex">
            <a href="#about" className="tw-text-gray-400 tw-no-underline hover:tw-text-white">About us</a>
            <a href="#clients" className="tw-text-gray-400 tw-no-underline hover:tw-text-white">Our clients</a>
            <a href="#challenges" className="tw-text-gray-400 tw-no-underline hover:tw-text-white">Challenges</a>
            <a href="#why" className="tw-text-gray-400 tw-no-underline hover:tw-text-white">Why Fintoo</a>
            <a href="#returns" className="tw-text-gray-400 tw-no-underline hover:tw-text-white">Returns</a>
            <a href="#testimonials" className="tw-text-gray-400 tw-no-underline hover:tw-text-white">Testimonials</a>
            <a href="#offerings" className="tw-text-gray-400 tw-no-underline hover:tw-text-white">Offerings</a>
            <a href="#fees" className="tw-text-gray-400 tw-no-underline hover:tw-text-white">Fees</a>
            <a href="#faqs" className="tw-text-gray-400 tw-no-underline hover:tw-text-white">FAQs</a>
          </div>
        </div>
        <a href="#start" className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-bg-white tw-px-5 tw-py-2 tw-text-sm tw-font-semibold tw-text-black tw-no-underline hover:tw-bg-gray-200">
          Get started <i className="fa-solid fa-arrow-right tw-text-xs" />
        </a>
      </nav>
    </header>
  );
}
