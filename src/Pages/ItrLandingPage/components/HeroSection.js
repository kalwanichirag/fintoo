export default function HeroSection() {
  return (
    <section id="home" 
 style={{
    backgroundImage: `url(${process.env.PUBLIC_URL}/static/media/ItrLogos/banner.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}    className="tw-relative tw-flex tw-min-h-screen tw-items-center tw-overflow-hidden tw-bg-[#021d44] tw-px-4 tw-pb-20 tw-pt-10 md:tw-px-8 lg:tw-pt-32">
      <style>
        {`
          @keyframes itrHeroFadeIn {
            0% {
              opacity: 0;
              transform: translateY(6px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes itrHeroProgress {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }

          .itr-hero-fade-card {
            animation: itrHeroFadeIn 360ms ease-out both;
            transition: opacity 360ms ease, transform 360ms ease;
          }

          .itr-hero-progress {
            animation: itrHeroProgress 4500ms linear both;
          }
        `}
      </style>
      
    

      <div className="tw-relative tw-z-10 tw-mx-auto tw-w-full tw-max-w-7xl">
        <div>
          <div className="tw-mb-7 tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-solid tw-border-fintoo-orange/25 tw-bg-fintoo-orange/10 tw-py-1.5 tw-pl-2 tw-pr-4">
            <span className="tw-text-xs tw-font-bold tw-uppercase tw-text-fintoo-orange">
              SEBI Registered · INA000020031
            </span>
          </div>
          <h1 className="tw-m-0 tw-font-dmserif1 tw-text-4xl tw-font-black tw-leading-tight tw-text-white md:tw-text-7xl">
            Not Just
            <br />
            <em className="tw-text-fintoo-orange">ITR Filing.</em>
            <br />
            Structured Tax
            <br />
            Advisory.
          </h1>
          <p className="tw-mt-6 tw-max-w-lg tw-text-lg tw-font-light tw-leading-8 tw-text-white/65">
            India's most trusted tax advisory for corporate professionals with complex income streams - ESOPs, global
            assets, multiple sources, and beyond.
          </p>

          <div className="tw-mt-8 tw-flex tw-flex-nowrap tw-items-center tw-gap-2 sm:tw-mt-10 sm:tw-flex-wrap sm:tw-gap-4">
            <a
              href="#booking"
              className="tw-inline-flex tw-min-w-0 tw-flex-1 tw-items-center tw-justify-center tw-gap-1.5 tw-rounded-lg tw-bg-fintoo-orange tw-px-2 tw-py-3 tw-text-xs tw-font-bold tw-text-white tw-no-underline tw-shadow-xl hover:tw-bg-[#f08c1a] hover:tw-text-white sm:tw-flex-none sm:tw-gap-2.5 sm:tw-px-7 sm:tw-py-4 sm:tw-text-sm"
            >
              <span className="sm:tw-hidden">Book Free</span>
              <span className="tw-hidden sm:tw-inline">Book Free Consultation</span>
              <span>→</span>
            </a>
           
          </div>

          <div className="tw-mt-10 tw-grid tw-grid-cols-3 tw-gap-3 sm:tw-mt-14 sm:tw-flex sm:tw-flex-wrap sm:tw-gap-8">
            {[
              ["₹5,000 Cr+", "Assets Tracked"],
              ["25,000+", "Employees Advised"],
              ["500+", "Corporate Tie-Ups"],
            ].map(([num, label]) => (
              <div key={label} className="tw-border-0 tw-border-r tw-border-solid tw-border-white/10 tw-pr-3 last:tw-border-r-0 sm:tw-pr-8">
                <div className="tw-font-dmserif1 tw-text-xl tw-font-bold tw-leading-none tw-text-white sm:tw-text-3xl">{num}</div>
                <div className="tw-mt-1 tw-text-xs tw-font-bold tw-uppercase tw-leading-tight tw-text-white/50">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
