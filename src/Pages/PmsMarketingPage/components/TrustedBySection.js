import React from "react";
import { Container, Section } from "./shared";

const trustedLogos = [
  {
    src: "https://storage.googleapis.com/uxpilot-auth.appspot.com/TPXgOMVZTdXq8fZkCjQzXTMbbwL2%2Fclone-site-assets%2F65dca034-ab9e-4368-a7ed-c34446f76c31.svg",
    alt: "Amazon",
  },
  {
    src: "https://storage.googleapis.com/uxpilot-auth.appspot.com/TPXgOMVZTdXq8fZkCjQzXTMbbwL2%2Fclone-site-assets%2Fae7130bf-c389-4f42-9751-156ab18e7644.svg",
    alt: "Manipal",
  },
  {
    src: "https://storage.googleapis.com/uxpilot-auth.appspot.com/TPXgOMVZTdXq8fZkCjQzXTMbbwL2%2Fclone-site-assets%2F439e9bbb-54b2-4132-8aba-e1472b5fdd8d.svg",
    alt: "Bain",
  },
  {
    src: "https://storage.googleapis.com/uxpilot-auth.appspot.com/TPXgOMVZTdXq8fZkCjQzXTMbbwL2%2Fclone-site-assets%2F0a2c218b-29d0-4eb8-a0c9-effcfae15a00.svg",
    alt: "BCG",
  },
  {
    src: "https://storage.googleapis.com/uxpilot-auth.appspot.com/TPXgOMVZTdXq8fZkCjQzXTMbbwL2%2Fclone-site-assets%2F1f6060b0-aa11-49b7-8b13-3dbf74a8f57d.svg",
    alt: "CRED",
  },
  {
    src: "https://storage.googleapis.com/uxpilot-auth.appspot.com/TPXgOMVZTdXq8fZkCjQzXTMbbwL2%2Fclone-site-assets%2F812c4a6f-71e2-49fc-b3f5-6539bbe86cc6.svg",
    alt: "Google",
  },
  {
    src: "https://storage.googleapis.com/uxpilot-auth.appspot.com/TPXgOMVZTdXq8fZkCjQzXTMbbwL2%2Fclone-site-assets%2F6a2b2830-bf8e-421f-abfd-7f0364d2568a.svg",
    alt: "Kotak",
  },
];

export default function TrustedBySection() {
  return (
    <Section id="clients" className="tw-overflow-hidden tw-py-20" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.8), #000), linear-gradient(0deg, #2d9b95, #2d9b95)" }}>
      <Container className="tw-text-center">
        <h2 className="tw-mb-12 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2 tw-text-2xl tw-font-medium tw-text-gray-400 md:tw-text-5xl">
          <span className="tw-mb-4">Trusted by</span>
          <span className="pms-text-rotator tw-relative tw-overflow-hidden">
            <span className="pms-text-slide tw-flex tw-flex-col tw-font-semibold tw-text-white">
              <span className="pms-text-slide-item tw-flex tw-items-center tw-justify-center">Business Owners</span>
              <span className="pms-text-slide-item tw-flex tw-items-center tw-justify-center">HNIs</span>
              <span className="pms-text-slide-item tw-flex tw-items-center tw-justify-center">Doctors</span>
              <span className="pms-text-slide-item tw-flex tw-items-center tw-justify-center">Investors</span>
              <span className="pms-text-slide-item tw-flex tw-items-center tw-justify-center">Entrepreneurs</span>
              <span className="pms-text-slide-item tw-flex tw-items-center tw-justify-center">Business Owners</span>
            </span>
          </span>
        </h2>
        <div className="pms-logo-marquee tw-opacity-70 tw-grayscale tw-transition hover:tw-opacity-100">
          {[0, 1].map((groupIndex) => (
            <div className="pms-logo-track" key={groupIndex} aria-hidden={groupIndex === 1}>
              {trustedLogos.map((logo) => (
                <img src={logo.src} alt={logo.alt} className="pms-trusted-logo" key={`${groupIndex}-${logo.alt}`} />
              ))}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
