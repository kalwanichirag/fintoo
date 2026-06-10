import React from "react";
import Slider from "react-slick";

const CardIcon = ({ children }) => (
  <div className="tw-mb-3 tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-xl tw-bg-fintoo-blue/5 tw-text-fintoo-blue md:tw-h-12 md:tw-w-12">
    {children}
  </div>
);

const CTAIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" className="tw-h-3.5 tw-w-3.5" aria-hidden="true">
    <path d="M4 9h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const profiles = [
  {
    num: "01 - Individual Tax Planning",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="tw-h-6 tw-w-6" aria-hidden="true">
        <path d="M4 8.5C4 7.12 5.12 6 6.5 6h11C18.88 6 20 7.12 20 8.5v7C20 16.88 18.88 18 17.5 18h-11C5.12 18 4 16.88 4 15.5v-7Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 6V5.5C8 4.67 8.67 4 9.5 4h5C15.33 4 16 4.67 16 5.5V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 11.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 14.5h2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Corporate Employees",
    copy: "Salaried professionals with taxable income from multiple sources - salary, rental income, capital gains, and freelance.",
    tags: ["Multiple Income", "Advance Tax", "Deductions"],
  },
  {
    num: "02 - Executive Tax Advisory",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="tw-h-6 tw-w-6" aria-hidden="true">
        <path d="M12 3l3 4 5 .8-3.6 3.7.9 5.2L12 14.9 6.7 16.7l.9-5.2L4 7.8 9 7l3-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8.4 19.5c1.1-1 2.4-1.5 3.6-1.5s2.5.5 3.6 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: "Managers & C-Suite",
    copy: "Senior professionals with ESOPs, RSUs, bonuses, and complex remuneration structures that demand proactive tax strategy.",
    tags: ["ESOPs & RSUs", "Perquisites", "Bonuses"],
  },
  {
    num: "03 - Cross-Border Tax Services",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="tw-h-6 tw-w-6" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4.8 9.5h14.4M4.8 14.5h14.4M12 4a14.5 14.5 0 0 1 0 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: "Global Income Earners",
    copy: "Expats, NRIs, and professionals with overseas assets, SBUs, foreign bank accounts, or US tax filing obligations.",
    tags: ["FBAR / FATCA", "Foreign Assets", "US Tax Filing"],
  },
];

const profileSliderSettings = {
  dots: true,
  arrows: false,
  infinite: false,
  speed: 400,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
};

const ProfileCard = ({ profile }) => (
  <article className="tw-group tw-relative tw-flex tw-h-full tw-flex-col tw-overflow-hidden tw-rounded-2xl tw-border tw-border-solid tw-border-fintoo-blue/10 tw-bg-white tw-p-4 tw-transition-all hover:-tw-translate-y-1.5 hover:tw-border-transparent hover:tw-shadow-2xl md:tw-p-6">
    <span className="tw-absolute tw-left-0 tw-right-0 tw-top-0 tw-h-1 tw-origin-left tw-scale-x-0 tw-bg-fintoo-orange tw-transition-transform group-hover:tw-scale-x-100" />
    <div className="tw-mb-3 tw-text-xs tw-font-bold tw-uppercase tw-text-fintoo-orange">{profile.num}</div>
    <CardIcon>{profile.icon}</CardIcon>
    <h3 className="tw-m-0 tw-font-dmserif1 tw-text-xl tw-font-bold tw-text-fintoo-blue md:tw-text-2xl">{profile.title}</h3>
    <p className="tw-m-0 tw-mt-2 tw-text-sm tw-leading-6 tw-text-fintoo-blue/50 md:tw-leading-7">{profile.copy}</p>
    <div className="tw-mt-3 tw-flex tw-flex-wrap tw-gap-2 md:tw-mt-4">
      {profile.tags.map((tag) => (
        <span key={tag} className="tw-rounded-full tw-border tw-border-solid tw-border-fintoo-blue/10 tw-bg-fintoo-blue/5 tw-px-3 tw-py-1 tw-text-xs tw-font-semibold tw-text-fintoo-blue/65">
          {tag}
        </span>
      ))}
    </div>
    <a
      href="#booking"
      className="tw-mt-4 tw-inline-flex tw-items-center tw-gap-2 tw-self-start tw-rounded-full tw-bg-fintoo-orange tw-px-4 tw-py-2 tw-text-xs tw-font-bold tw-uppercase tw-tracking-wide tw-text-white tw-no-underline tw-shadow-lg tw-transition hover:tw-bg-[#f08c1a] hover:tw-text-white md:tw-mt-5"
    >
      Get Started
      <CTAIcon />
    </a>
  </article>
);

export default function ServeSection() {
  return (
    <section id="serve" className="tw-bg-[#fdf9f3] tw-px-4 tw-py-8 md:tw-px-8 md:tw-py-24">
      <div className="tw-mx-auto tw-max-w-7xl">
        <div className="tw-mb-5 tw-flex tw-flex-wrap tw-items-end tw-justify-between tw-gap-3 md:tw-mb-14 md:tw-gap-10">
          <div>
            <div className="tw-mb-2 tw-flex tw-items-center tw-gap-2 tw-text-xs tw-font-bold tw-uppercase tw-text-fintoo-orange md:tw-mb-4">
              <span className="tw-h-0.5 tw-w-5 tw-bg-fintoo-orange" />
              Who We Help
            </div>
            <h2 className="tw-m-0 tw-font-dmserif1 tw-text-3xl tw-font-black tw-leading-tight tw-text-fintoo-blue md:tw-text-5xl">
              Built for
              <br />
              Complex Incomes.
            </h2>
          </div>
          <p className="tw-m-0 tw-max-w-xl tw-text-sm tw-font-light tw-leading-6 tw-text-fintoo-blue/50 md:tw-text-base md:tw-leading-8">
            If your tax situation goes beyond a single salary, you need more than just a CA who files. You need a
            structured advisory team.
          </p>
        </div>
        <div className="md:tw-hidden">
          <Slider {...profileSliderSettings} className="itr-profile-slider">
            {profiles.map((profile) => (
              <div key={profile.title} className="tw-px-1 tw-pb-8">
                <ProfileCard profile={profile} />
              </div>
            ))}
          </Slider>
        </div>

        <div className="tw-hidden md:tw-grid md:tw-grid-cols-3 md:tw-gap-6">
          {profiles.map((profile) => (
            <ProfileCard key={profile.title} profile={profile} />
          ))}
        </div>
      </div>
    </section>
  );
}
