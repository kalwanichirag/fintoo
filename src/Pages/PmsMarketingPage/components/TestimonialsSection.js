import React from "react";
import { brandGreen, Container, CTAButton, Section } from "./shared";

export default function TestimonialsSection() {
  return (
    <Section id="testimonials" className="tw-py-24">
      <Container>
        <div className="tw-mb-16 tw-flex tw-flex-col tw-items-start tw-justify-between tw-gap-6 md:tw-flex-row md:tw-items-center">
          <h2 className="tw-m-0 tw-text-4xl tw-font-extrabold">Trusted by <span style={{ color: brandGreen }}>wealth creators</span> like you</h2>
          <CTAButton />
        </div>
        <div className="tw-flex tw-gap-6 tw-overflow-x-auto tw-pb-8 [scrollbar-width:none]">
          <article className="tw-group tw-relative tw-aspect-[3/4] tw-min-w-[320px] tw-overflow-hidden tw-rounded-3xl md:tw-min-w-[400px]">
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/c17c0cddea-18e0ffedbb4f393a5c59.png" alt="Pooja Jauhari" className="tw-absolute tw-inset-0 tw-h-full tw-w-full tw-object-cover" />
            <div className="tw-absolute tw-inset-0 tw-flex tw-flex-col tw-justify-end tw-space-y-4 tw-bg-gradient-to-b tw-from-transparent tw-to-black/85 tw-p-8">
              <i className="fa-solid fa-play tw-text-4xl tw-text-white/80 group-hover:tw-scale-110" />
              <p className="tw-m-0 tw-text-lg tw-font-medium">"Fintoo brought simplicity and clarity to my investments."</p>
              <div><p className="tw-m-0 tw-font-bold">Pooja Jauhari</p><p className="tw-m-0 tw-text-xs tw-text-gray-400">Founder & CEO, EMoMee</p></div>
            </div>
          </article>
          <article className="tw-group tw-relative tw-aspect-[3/4] tw-min-w-[320px] tw-overflow-hidden tw-rounded-3xl md:tw-min-w-[400px]">
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/84a9bc8623-050a899e42c934ad68ad.png" alt="Brijesh Bharadwaj" className="tw-absolute tw-inset-0 tw-h-full tw-w-full tw-object-cover" />
            <div className="tw-absolute tw-inset-0 tw-flex tw-flex-col tw-justify-end tw-space-y-4 tw-bg-gradient-to-b tw-from-transparent tw-to-black/85 tw-p-8">
              <i className="fa-solid fa-play tw-text-4xl tw-text-white/80 group-hover:tw-scale-110" />
              <p className="tw-m-0 tw-text-lg tw-font-medium">"I am sure Fintoo will invest my money better than I could."</p>
              <div><p className="tw-m-0 tw-font-bold">Brijesh Bharadwaj</p><p className="tw-m-0 tw-text-xs tw-text-gray-400">Co-Founder, Segwise.ai</p></div>
            </div>
          </article>
          <article className="tw-group tw-relative tw-aspect-[3/4] tw-min-w-[320px] tw-overflow-hidden tw-rounded-3xl md:tw-min-w-[400px]">
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/324c5ced79-fa8d7ceefc9e91c1ec15.png" alt="Adarsh Menon" className="tw-absolute tw-inset-0 tw-h-full tw-w-full tw-object-cover" />
            <div className="tw-absolute tw-inset-0 tw-flex tw-flex-col tw-justify-end tw-space-y-4 tw-bg-gradient-to-b tw-from-transparent tw-to-black/85 tw-p-8">
              <i className="fa-solid fa-play tw-text-4xl tw-text-white/80 group-hover:tw-scale-110" />
              <p className="tw-m-0 tw-text-lg tw-font-medium">"Fintoo delivers returns while saving my time and bandwidth."</p>
              <div><p className="tw-m-0 tw-font-bold">Adarsh Menon</p><p className="tw-m-0 tw-text-xs tw-text-gray-400">Partner, Fireside Ventures</p></div>
            </div>
          </article>
        </div>
      </Container>
    </Section>
  );
}
