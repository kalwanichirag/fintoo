export default function CorporateTaxSolutions() {
  const solutions = [
    {
      title: "Filing Tax Returns",
      description:
        "Complete ITR filing support with full disclosures, compliance checks, and expert review."
    },
    {
      title: "Tax Planning",
      description:
        "Strategic tax-saving recommendations aligned with employee income structures."
    },
    {
      title: "Awareness Sessions",
      description:
        "Interactive workshops and webinars helping employees understand taxation better."
    }
  ];

  return (
    <section className="tw-relative tw-overflow-hidden tw-bg-[#FAF8F3] tw-py-24">
      {/* Background Pattern */}
      <div className="tw-absolute tw-inset-0 tw-opacity-[0.04]">
        <div className="tw-h-full tw-w-full tw-bg-fintoo-blue/5" />
      </div>

      <div className="tw-relative tw-max-w-7xl tw-mx-auto tw-px-6 lg:tw-px-8">
        <div className="tw-grid lg:tw-grid-cols-2 tw-gap-16 tw-items-center">
          
          {/* Left Content */}
          <div>
            <span className="tw-inline-flex tw-items-center tw-gap-2 tw-uppercase tw-tracking-widest tw-text-[#E47A11] tw-font-semibold tw-text-sm">
              <span className="tw-w-8 tw-h-0.5 tw-bg-[#E47A11]" />
              Corporate Solutions
            </span>

            <h2 className="tw-mt-6 tw-text-[#02265D] tw-font-black tw-leading-tight tw-text-4xl md:tw-text-5xl">
              Tax Planning Solutions
              <br />
              <span className="tw-text-[#E47A11]">For Employees</span>
            </h2>

            <p className="tw-mt-6 tw-text-[#4A5568] tw-text-lg tw-leading-relaxed tw-max-w-xl">
              Ethical, smart and secure tax support tailored for your
              employees through virtual consultations, tax planning sessions,
              and end-to-end filing assistance.
            </p>

            <div className="tw-mt-10 tw-space-y-5">
              {solutions.map((item, index) => (
                <div
                  key={index}
                  className="tw-group tw-bg-white tw-border tw-border-[#E5E7EB] tw-rounded-2xl tw-p-6 hover:tw-shadow-xl tw-transition-all tw-duration-300"
                >
                  <div className="tw-flex tw-gap-5">
                    <div className="tw-w-1.5 tw-rounded-full tw-bg-[#E47A11]" />

                    <div>
                      <h3 className="tw-font-bold tw-text-[#02265D] tw-text-xl">
                        {item.title}
                      </h3>

                      <p className="tw-mt-2 tw-text-gray-600 tw-leading-relaxed tw-mb-0">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
       {/* Right Content */}
<div className="tw-relative">

  <div className="tw-rounded-3xl tw-bg-[#02265D] tw-p-10 tw-text-white tw-shadow-2xl">

    <div className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-bg-white/10 tw-px-4 tw-py-2">
      <span className="tw-h-2 tw-w-2 tw-rounded-full tw-bg-[#E47A11]" />
      <span className="tw-text-xs tw-font-bold tw-uppercase tw-tracking-wider">
        Our Approach
      </span>
    </div>

    <h3 className="tw-mt-8 tw-text-4xl tw-font-black tw-leading-tight">
      One advisory.
      <br />
      <span className="tw-text-[#E47A11]">
        Every dimension.
      </span>
    </h3>

    <p className="tw-mt-6 tw-text-lg tw-leading-8 tw-text-white/75">
      We don't just file your ITR. We structure and optimize your entire
      tax life — ethically, accurately, and transparently.
    </p>

    <div className="tw-my-10 tw-h-px tw-bg-white/10" />

    <div>
      <div className="tw-text-sm tw-font-bold tw-uppercase tw-tracking-widest tw-text-[#E47A11]">
        Our Promise
      </div>

      <h4 className="tw-mt-3 tw-text-3xl tw-font-black">
        Fee-Only.
        <br />
        Zero Commissions.
        <br />
        Always.
      </h4>

      <p className="tw-mt-5 tw-leading-8 tw-text-white/75">
        Every recommendation we make is purely in your interest.
        We earn no commission — ever.
        That's how trust is built.
      </p>
    </div>

    <div className="tw-mt-10 tw-grid tw-grid-cols-2 tw-gap-5">

      <div className="tw-rounded-2xl tw-bg-white/5 tw-p-5">
        <div className="tw-text-3xl tw-font-black tw-text-[#E47A11]">
          100%
        </div>
        <div className="tw-mt-1 tw-text-sm tw-text-white/60">
          Conflict-Free Advice
        </div>
      </div>

      <div className="tw-rounded-2xl tw-bg-white/5 tw-p-5">
        <div className="tw-text-3xl tw-font-black tw-text-[#E47A11]">
          0%
        </div>
        <div className="tw-mt-1 tw-text-sm tw-text-white/60">
          Product Commissions
        </div>
      </div>

      <div className="tw-rounded-2xl tw-bg-white/5 tw-p-5">
        <div className="tw-text-3xl tw-font-black tw-text-[#E47A11]">
          SEBI
        </div>
        <div className="tw-mt-1 tw-text-sm tw-text-white/60">
          Registered Advisor
        </div>
      </div>

      <div className="tw-rounded-2xl tw-bg-white/5 tw-p-5">
        <div className="tw-text-3xl tw-font-black tw-text-[#E47A11]">
          25k+
        </div>
        <div className="tw-mt-1 tw-text-sm tw-text-white/60">
          Professionals Advised
        </div>
      </div>

    </div>

  </div>

</div>
        </div>
      </div>
    </section>
  );
}
