import React from "react";

const logoPath = `${process.env.PUBLIC_URL}/static/media/ItrLogos`;

const companies = [
  { name: "Accenture", src: `${logoPath}/Accenture.png` },
  { name: "Amazon", src: `${logoPath}/Amazon.png` },
  { name: "Broadcom", src: `${logoPath}/Broadcom.png` },
  { name: "Google", src: `${logoPath}/Google.png` },
  { name: "Microsoft", src: `${logoPath}/Microsoft.png` },
  { name: "NVIDIA", src: `${logoPath}/NVIDIA.png` },
  { name: "Swiggy", src: `${logoPath}/Swiggy.png` },
  { name: "TCS", src: `${logoPath}/TCS.png` },
];
export default function MarqueeSection() {
  return (
    <div className="tw-overflow-hidden tw-border-0 tw-border-y tw-border-solid tw-border-white/10  tw-py-4">
      <div className="tw-flex tw-w-max tw-animate-marquee tw-whitespace-nowrap">
        {[...companies, ...companies, ...companies].map((company, index) => (
          <div
            key={`${company}-${index}`}
            className="tw-mx-10 tw-flex tw-h-8 tw-items-center   tw-transition"
          >
            <img
              src={company.src}
              alt={company.name}
              className="tw-h-8 tw-w-auto tw-object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
