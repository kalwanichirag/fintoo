import React, { useEffect, useState } from "react";

const navItems = [
  ["#serve", "Who We Help"],
  ["#process", "How It Works"],
  ["#services", "Services"],
  ["#testimonials", "Clients"],
];

function Logo({ light = false }) {
  return (
    <a href="#home" className="tw-flex tw-items-center tw-gap-2.5 tw-no-underline">
      <span className="tw-relative tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-overflow-hidden tw-rounded-[10px] tw-bg-fintoo-orange">
        <span className="tw-absolute tw-right-1.5 tw-top-1.5 tw-h-3.5 tw-w-3.5 tw-rounded-full tw-bg-white" />
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="tw-relative tw-z-10">
          <path d="M3 14L9 4L15 14H3Z" fill="white" opacity="0.9" />
        </svg>
      </span>
      <span className={`tw-font-dmserif1 tw-text-[22px] tw-font-bold ${light ? "tw-text-white" : "tw-text-fintoo-blue"}`}>
        FINT<span className="tw-text-fintoo-orange">OO</span>
      </span>
    </a>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`tw-fixed tw-left-0 tw-right-0 tw-top-0 tw-z-50 tw-flex tw-items-center tw-justify-between tw-px-[5%] tw-transition-all tw-duration-300 ${
          scrolled
            ? "tw-bg-[#fdf9f3]/90 tw-py-3.5 tw-shadow-[0_8px_40px_rgba(4,43,98,0.06)] tw-backdrop-blur-xl"
            : "tw-bg-transparent tw-py-6"
        }`}
      >
        <Logo light={!scrolled} />
        <nav className="tw-hidden tw-items-center tw-gap-9 lg:tw-flex">
          {navItems.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className={`tw-text-sm tw-font-medium tw-no-underline tw-transition-colors ${
                scrolled ? "tw-text-fintoo-blue/70 hover:tw-text-fintoo-blue" : "tw-text-white/80 hover:tw-text-white"
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href="#booking"
            className="tw-rounded-[8px] tw-bg-fintoo-orange tw-px-5 tw-py-2.5 tw-text-xs tw-font-bold tw-uppercase tw-text-white tw-no-underline tw-shadow-[0_4px_16px_rgba(221,115,0,0.25)] hover:tw-bg-[#f08c1a] hover:tw-text-white"
          >
            Book a Session
          </a>
        </nav>
        <button
          type="button"
          aria-label="Open menu"
          className="tw-flex tw-flex-col tw-gap-1.5 tw-bg-transparent tw-p-2 lg:tw-hidden"
          onClick={() => setOpen(true)}
        >
          <span className={`tw-block tw-h-0.5 tw-w-6 tw-rounded ${scrolled ? "tw-bg-fintoo-blue" : "tw-bg-white"}`} />
          <span className={`tw-block tw-h-0.5 tw-w-6 tw-rounded ${scrolled ? "tw-bg-fintoo-blue" : "tw-bg-white"}`} />
          <span className={`tw-block tw-h-0.5 tw-w-6 tw-rounded ${scrolled ? "tw-bg-fintoo-blue" : "tw-bg-white"}`} />
        </button>
      </header>

      {open ? (
        <div className="tw-fixed tw-inset-0 tw-z-[60] tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-9 tw-bg-[#021d44]">
          <button
            type="button"
            className="tw-absolute tw-right-6 tw-top-6 tw-bg-transparent tw-text-3xl tw-text-white"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            x
          </button>
          {navItems.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="tw-font-dmserif1 tw-text-3xl tw-text-white/80 tw-no-underline hover:tw-text-fintoo-orange"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            href="#booking"
            className="tw-font-dmserif1 tw-text-3xl tw-text-white/80 tw-no-underline hover:tw-text-fintoo-orange"
            onClick={() => setOpen(false)}
          >
            Book a Session
          </a>
        </div>
      ) : null}
    </>
  );
}
