import React from "react";
import { AnimatedCounter, MotionReveal, PlannerIcon } from "./PlannerShared";

export default function HeroSection({ form, errors = {}, isSubmitting = false, onChange, onSubmit }) {
  const getInputClassName = (field) =>
    `tw-w-full tw-rounded-[18px] tw-border tw-bg-white/95 tw-px-[16px] tw-py-[14px] tw-text-base tw-text-slate-800 tw-shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] tw-transition-all focus:tw-bg-white focus:tw-outline-none focus:tw-ring-4 ${errors[field]
      ? "tw-border-red-400 focus:tw-border-red-500 focus:tw-ring-red-100"
      : "tw-border-slate-200/90 focus:tw-border-fintoo-blue focus:tw-ring-fintoo-blue/10"
    }`;

  return (
    <>
      <section
        id="top"
        className="tw-relative tw-overflow-hidden md:tw-min-h-[94vh] tw-flex tw-justify-center tw-bg-fintoo-blue tw-px-4 tw-py-10 md:tw-px-[5%] md:tw-py-[52px] lg:tw-px-[6%]"
        style={{ background: "linear-gradient(135deg, #06285c 0%, #123e86 52%, #0b2f68 100%)" }}
      >
        <div className="tw-pointer-events-none tw-absolute tw-inset-0 tw-opacity-60 " style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="tw-pointer-events-none tw-absolute -tw-left-[10%] tw-top-[14%] tw-h-[420px] tw-w-[420px] tw-rounded-full tw-bg-white/6 tw-blur-3xl" />
        <div className="tw-pointer-events-none tw-absolute -tw-right-[6%] -tw-top-[12%] tw-h-[460px] tw-w-[460px] tw-rounded-full tw-bg-fintoo-orange/12 tw-blur-3xl" />
        <div className="tw-pointer-events-none tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-h-[140px] tw-bg-gradient-to-t tw-from-black/15 tw-to-transparent" />
        <div className="tw-flex tw-items-center">
          <div className="tw-relative tw-z-10 tw-mx-auto tw-grid tw-w-full tw-max-w-[1380px] tw-items-center tw-gap-8 lg:tw-grid-cols-[minmax(0,1fr)_minmax(520px,0.9fr)] lg:tw-gap-[42px]">
            <MotionReveal immediate className="tw-relative" y={14} scale={0.99} duration={480}>
              <div className="">
                <img src="/static/media/wp/Fintoowhitelogo_.svg" alt="Fintoo Logo" className="tw-mb-4 tw-h-8 tw-w-auto md:tw-h-10" />
              </div>
              <div className="tw-inline-flex tw-max-w-full tw-items-center tw-gap-[8px] tw-rounded-full tw-border tw-border-white/10 tw-bg-fintoo-orange tw-px-4 tw-py-2 tw-text-xs tw-font-medium tw-text-white tw-backdrop-blur sm:tw-text-sm">
                SEBI Registered Investment Advisor
              </div>

              <h1 className="tw-mb-5 tw-mt-4 md:tw-mt-5 tw-max-w-[620px] tw-text-[2.25rem] tw-font-bold tw-leading-[1.02] tw-text-white sm:tw-text-[2.8rem] md:tw-mb-6 md:tw-mt-6 md:tw-text-[4.5rem] md:tw-leading-[0.98]">
                Know Your{" "}
                <span className="tw-text-fintoo-orange">Retirement Corpus</span>{" "}
                Today
              </h1>

              <p className="tw-mb-6 tw-max-w-[560px] tw-text-base tw-leading-7 tw-text-white/90 md:tw-mb-8 md:tw-text-lg md:tw-leading-8">
                Plan the retirement you truly deserve. Our experts help you build a personalised strategy so you never outlive your wealth.
              </p>

              <div className="tw-grid tw-max-w-[660px] tw-grid-cols-3 tw-gap-2 sm:tw-gap-3 md:tw-gap-4">
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-1 tw-py-2 tw-text-center md:tw-rounded-[24px] md:tw-border md:tw-border-white/12 md:tw-bg-white/8 md:tw-px-6 md:tw-py-5 md:tw-backdrop-blur">
                  <div className="tw-text-[1.2rem] tw-font-semibold tw-leading-none tw-text-white sm:tw-text-[1.45rem] md:tw-text-3xl">
                    <AnimatedCounter value={250000} suffix="+" />
                  </div>
                  <div className="tw-mt-2 tw-text-[10px] tw-leading-4 tw-text-white/70 sm:tw-text-xs md:tw-text-base">Happy customers</div>
                </div>
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-border-x tw-border-white/10 tw-px-1 tw-py-2 tw-text-center md:tw-rounded-[24px] md:tw-border md:tw-border-white/12 md:tw-bg-white/8 md:tw-px-6 md:tw-py-5 md:tw-backdrop-blur">
                  <div className="tw-text-[1.2rem] tw-font-semibold tw-leading-none tw-text-white sm:tw-text-[1.45rem] md:tw-text-3xl">
                    <AnimatedCounter value={1200} prefix="₹" suffix="Cr+" />
                  </div>
                  <div className="tw-mt-2 tw-text-[10px] tw-leading-4 tw-text-white/70 sm:tw-text-xs md:tw-text-base">Assets under advisory</div>
                </div>
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-1 tw-py-2 tw-text-center md:tw-rounded-[24px] md:tw-border md:tw-border-white/12 md:tw-bg-white/8 md:tw-px-6 md:tw-py-5 md:tw-backdrop-blur">
                  <div className="tw-text-[1.2rem] tw-font-semibold tw-leading-none tw-text-white sm:tw-text-[1.45rem] md:tw-text-3xl">
                    <AnimatedCounter value={20} suffix="+" />
                  </div>
                  <div className="tw-mt-2 tw-text-[10px] tw-leading-4 tw-text-white/70 sm:tw-text-xs md:tw-text-base">Years of experience</div>
                </div>
              </div>


            </MotionReveal>

            <MotionReveal immediate className="tw-relative" delay={120} y={18} scale={0.99} duration={520}>
              <div id="retirement-planner-form" className="tw-relative tw-w-full tw-overflow-hidden tw-rounded-[28px] tw-border tw-border-white/55 tw-bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,248,253,0.98)_100%)] tw-p-5 tw-shadow-[0_30px_80px_rgba(2,12,34,0.35)] sm:tw-rounded-[34px] sm:tw-p-6 md:tw-p-8">
                <div className="tw-pointer-events-none tw-absolute tw-right-0 tw-top-0 tw-h-36 tw-w-36 tw-rounded-full tw-bg-fintoo-blue/6 tw-blur-2xl" />
                <div className="tw-pointer-events-none tw-absolute tw-bottom-0 tw-left-0 tw-h-32 tw-w-32 tw-rounded-full tw-bg-fintoo-orange/10 tw-blur-2xl" />
                <div className="tw-relative tw-z-10">
                  <div className="tw-mb-5 tw-flex tw-items-center tw-justify-between tw-gap-4">
                    <div>
                      <h3 className="tw-text-[1.45rem] tw-font-semibold tw-leading-tight tw-text-fintoo-blue sm:tw-text-[1.75rem]">Retirement Corpus Calculator</h3>
                      <p className="tw-mt-2 tw-text-sm tw-text-slate-500 sm:tw-text-[15px]">Fill in your details to know your retirement number</p>
                    </div>

                  </div>



                  <div className="tw-grid tw-gap-[14px] md:tw-grid-cols-2">
                    <div className="tw-mb-2 md:tw-mb-4">
                      <label htmlFor="name" className="tw-mb-[7px] tw-block tw-text-[11px] tw-font-semibold tw-uppercase tw-tracking-[0.16em] tw-text-slate-500">
                        Your Name
                      </label>
                      <input
                        id="name"
                        value={form.name}
                        onChange={onChange("name")}
                        placeholder="Rahul Sharma"
                        className={getInputClassName("name")}
                      />
                      {errors.name && <p className="tw-mt-1 tw-text-xs tw-text-red-500">{errors.name}</p>}
                    </div>
                    <div className="tw-mb-2 md:tw-mb-4">
                      <label htmlFor="mobile" className="tw-mb-[7px] tw-block tw-text-[11px] tw-font-semibold tw-uppercase tw-tracking-[0.16em] tw-text-slate-500">
                        Mobile Number
                      </label>
                      <input
                        id="mobile"
                        value={form.mobile}
                        onChange={onChange("mobile")}
                        placeholder="+91 9699 800 600"
                        className={getInputClassName("mobile")}
                      />
                      {errors.mobile && <p className="tw-mt-1 tw-text-xs tw-text-red-500">{errors.mobile}</p>}
                    </div>
                  </div>

                  <div className="tw-mb-2 md:tw-mb-4">
                    <label htmlFor="email" className="tw-mb-[7px] tw-block tw-text-[11px] tw-font-semibold tw-uppercase tw-tracking-[0.16em] tw-text-slate-500">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={onChange("email")}
                      placeholder="rahul@example.com"
                      className={getInputClassName("email")}
                    />
                    {errors.email && <p className="tw-mt-1 tw-text-xs tw-text-red-500">{errors.email}</p>}
                  </div>

                  <div className="tw-grid tw-gap-[14px] md:tw-grid-cols-2">
                    <div className="tw-mb-2 md:tw-mb-4">
                      <label htmlFor="currentAge" className="tw-mb-[7px] tw-block tw-text-[11px] tw-font-semibold tw-uppercase tw-tracking-[0.16em] tw-text-slate-500">
                        Current Age
                      </label>
                      <input
                        id="currentAge"
                        type="number"
                        min="18"
                        max="70"
                        value={form.currentAge}
                        onChange={onChange("currentAge")}
                        className={getInputClassName("currentAge")}
                      />
                      {errors.currentAge && <p className="tw-mt-1 tw-text-xs tw-text-red-500">{errors.currentAge}</p>}
                    </div>
                    <div className="tw-mb-2 md:tw-mb-4">
                      <label htmlFor="retirementAge" className="tw-mb-[7px] tw-block tw-text-[11px] tw-font-semibold tw-uppercase tw-tracking-[0.16em] tw-text-slate-500">
                        Retirement Age
                      </label>
                      <input
                        id="retirementAge"
                        type="number"
                        min="40"
                        max="80"
                        value={form.retirementAge}
                        onChange={onChange("retirementAge")}
                        className={getInputClassName("retirementAge")}
                      />
                      {errors.retirementAge && <p className="tw-mt-1 tw-text-xs tw-text-red-500">{errors.retirementAge}</p>}
                    </div>
                  </div>

                  <div className="tw-mb-5">
                    <label
                      htmlFor="annualIncome"
                      className="tw-mb-[7px] tw-block tw-text-[11px] tw-font-semibold tw-uppercase tw-tracking-[0.16em] tw-text-slate-500"
                    >
                      Annual Income
                    </label>

                    <select
                      id="annualIncome"
                      value={form.annualIncome}
                      onChange={onChange("annualIncome")}
                      className={getInputClassName("annualIncome")}
                    >
                      <option value="">Select your income</option>
                      <option value="0-10L">0 – 10 Lakhs</option>
                      <option value="10-25L">10 – 25 Lakhs</option>
                      <option value="25-50L">25 – 50 Lakhs</option>
                      <option value="50L-1Cr">50 Lakhs – 1 Crore</option>
                      <option value="1Cr+">1 Crore+</option>
                    </select>
                    {errors.annualIncome && <p className="tw-mt-1 tw-text-xs tw-text-red-500">{errors.annualIncome}</p>}
                  </div>

                  {errors.submit && <p className="tw-mb-3 tw-text-sm tw-text-red-500">{errors.submit}</p>}

                  <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className={`tw-w-full tw-rounded-[18px] tw-p-[16px] tw-text-base tw-font-semibold tw-text-white tw-shadow-[0_18px_35px_rgba(234,120,0,0.28)] tw-transition ${isSubmitting ? "tw-cursor-not-allowed tw-bg-slate-400 tw-shadow-none" : "tw-bg-fintoo-orange hover:tw--translate-y-[1px] hover:tw-brightness-95"
                      }`}
                  >
                    {isSubmitting ? "Submitting..." : "Get My Free Retirement Plan →"}
                  </button>

                  <p className="tw-mt-4 tw-text-center tw-text-xs tw-text-slate-500">
                    <span className="tw-inline-flex tw-items-center tw-gap-1">
                      <PlannerIcon type="shield" className="tw-h-[11px] tw-w-[11px]" />
                      100% secure &amp; confidential. No spam ever.
                    </span>
                  </p>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
