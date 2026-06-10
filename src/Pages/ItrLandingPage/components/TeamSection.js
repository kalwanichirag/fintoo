import React from "react";

const managementImagePath = `${process.env.PUBLIC_URL}/static/media/management`;

const leaders = [
  ["CA Manish H", "Founder & CEO", `${managementImagePath}/CA%20Manish%20H.jpg`],
  ["Suchita H", "Co - Founder & COO", `${managementImagePath}/Suchita%20H.jpg`],
  ["CA Nikhil S", "Chief Revenue Officer", `${managementImagePath}/CA%20Nikhil%20S.jpg`],
  ["CA Vitesh W", "Taxation Lead", `${managementImagePath}/CA%20Vitesh%20W.jpg`],
  ["Nisha H", "Fund Manager & Strategy", `${managementImagePath}/Nisha%20H.jpg`],
  ["Mihir S", "Principal Officer", `${managementImagePath}/Mihir%20S.jpg`],
  ["Shama M", "Business Development", `${managementImagePath}/Shama%20M.jpg`],
  ["Barinder D", "Business Development", `${managementImagePath}/Barinder%20D.jpg`],
  ["Salman W", "VP Marketing", `${managementImagePath}/Salman%20W.jpg`],
  ["Hussain A", "IT Development", `${managementImagePath}/Hussain%20A.jpg`],
  ["Mayuri S", "Global Advisory", `${managementImagePath}/Mayuri%20S.jpg`],
  ["Yash J", "Global Advisory", `${managementImagePath}/Yash%20J.jpg`],
  ["Shraddha P", "Estate Planning", `${managementImagePath}/Shraddha%20P.jpg`],
];

export default function TeamSection() {
  return (
    <section id="team" className="tw-relative tw-overflow-hidden tw-border-0 tw-border-y tw-border-solid tw-border-gray-100 tw-bg-gray-50/50 tw-px-4 tw-py-20 md:tw-px-8">
      <div className="tw-mx-auto tw-max-w-7xl">
        <div className="tw-mx-auto tw-mb-16 tw-max-w-2xl tw-text-center">
          <span className="tw-mb-3 tw-inline-flex tw-items-center tw-gap-1.5 tw-rounded-full tw-bg-blue-50 tw-px-3 tw-py-1 tw-text-xs tw-font-bold tw-uppercase tw-text-fintoo-blue">
            Expert-Led Fiduciary Group
          </span>
          <h2 className="tw-m-0 tw-font-dmserif1 tw-text-3xl tw-font-black tw-text-fintoo-blue md:tw-text-5xl">
            Meet Our Team <span className="tw-text-fintoo-orange">Leaders</span>
          </h2>
          <p className="tw-mt-4 tw-text-sm tw-font-semibold tw-leading-7 tw-text-slate-500 md:tw-text-base">
            Backed by an accredited team of 80+ Chartered Accountants, global wealth strategists, and regulatory
            analysts dedicated to high-precision asset filing.
          </p>
        </div>

        <div className="tw-grid tw-grid-cols-2 tw-justify-center tw-gap-8 md:tw-grid-cols-3 lg:tw-grid-cols-4 xl:tw-grid-cols-5">
          {leaders.map(([name, role, src]) => (
            <div key={name} className="tw-group tw-relative tw-flex tw-flex-col tw-items-center tw-text-center">
              <div className="tw-relative tw-mb-4 tw-h-28 tw-w-28 tw-rounded-full tw-transition-transform group-hover:tw-scale-105 md:tw-h-32 md:tw-w-32">
                  <img src={src} alt={name} className="tw-h-full tw-w-full tw-rounded-full tw-object-cover tw-grayscale tw-transition-all group-hover:tw-grayscale-0" />
                </div>
              
              <h3 className="tw-m-0 tw-text-sm tw-font-bold tw-text-fintoo-blue group-hover:tw-text-fintoo-orange md:tw-text-base">{name}</h3>
              <p className="tw-m-0 tw-text-xs tw-font-medium tw-text-slate-500">{role}</p>
            </div>
          ))}
        </div>

       <div className="tw-relative tw-mt-16 tw-overflow-hidden tw-rounded-3xl tw-bg-fintoo-blue tw-p-8 tw-text-white tw-shadow-xl md:tw-p-10">
  <div className="tw-mb-8 tw-text-center">
    <h4 className="tw-m-0 tw-font-dmserif1 tw-text-2xl tw-font-bold md:tw-text-3xl">
      Connect With Our Corporate Relations Team
    </h4>
    <p className="tw-mt-3 tw-text-slate-300">
      Speak directly with our team for wealth advisory, tax planning, global assets,
      ESOPs, and corporate executive solutions.
    </p>
  </div>

  <div className="tw-grid tw-gap-6 md:tw-grid-cols-2">
    {/* Salman */}
    <div className="tw-rounded-2xl tw-bg-white/10 tw-p-6 tw-backdrop-blur-sm">
      <h5 className="tw-m-0 tw-text-xl tw-font-bold">
        Salman Warwande
      </h5>
      <p className="tw-mt-1 tw-text-amber-400 tw-font-semibold">
        VP - Marketing
      </p>

      <div className="tw-mt-4 tw-space-y-2 tw-text-sm">
        <p className="tw-m-0">
          📞 <a href="tel:+917738914692" className="tw-text-white tw-no-underline">+91 77389 14692</a>
        </p>
        <p className="tw-m-0">
          ✉ <a href="mailto:salman.warwande@fintoo.in" className="tw-text-white tw-no-underline">
            salman.warwande@fintoo.in
          </a>
        </p>
      </div>
    </div>

    {/* Sabarinath */}
    <div className="tw-rounded-2xl tw-bg-white/10 tw-p-6 tw-backdrop-blur-sm">
      <h5 className="tw-m-0 tw-text-xl tw-font-bold">
        Sabarinath Vasu
      </h5>
      <p className="tw-mt-1 tw-text-amber-400 tw-font-semibold">
        AVP - Corporate Relations
      </p>

      <div className="tw-mt-4 tw-space-y-2 tw-text-sm">
        <p className="tw-m-0">
          📞 <a href="tel:+918082266839" className="tw-text-white tw-no-underline">+91 80822 66839</a>
        </p>
        <p className="tw-m-0">
          ✉ <a href="mailto:sabarinath.vasu@fintoo.in" className="tw-text-white tw-no-underline">
            sabarinath.vasu@fintoo.in
          </a>
        </p>
      </div>
    </div>
  </div>
</div>
      </div>
    </section>
  );
}
