import React from "react";
import { MotionReveal, PlannerIcon, SectionHeader } from "./PlannerShared";

const supportPoints = [
  {
    title: "Bridge Your Retirement Gap",
    text: "We'll show if your current investments suffice, or what it takes to secure your desired future.",
  },
  {
    title: "Optimise your portfolio",
    text: "Our expertise helps optimize your portfolio, uncovering missed gains for better, consistent growth.",
  },
  {
    title: "Total Peace of Mind",
    text: "Your dedicated client partner will do quarterly reviews to ensure your portfolio is aligned with your goals.",
  },
];

const callBenefits = [
  "Talk to an expert about your goals",
  "Free in depth analysis of the portfolio",
  "Get a tailored portfolio for your goals",
];

export default function DezervRetirementSection() {
  return (
    <section className="tw-bg-fintoo-blue tw-px-[8%] tw-py-[80px] max-md:tw-px-[5%] max-md:tw-py-[50px]">
      <MotionReveal>
        <SectionHeader
          tag="Expert Planning"
          title="Fintoo can help you plan a peaceful retirement life"
          subtitle="Schedule an expert call to understand whether your current portfolio is enough, what your retirement gap looks like, and how to align your investments with long-term financial goals."
          dark
        />
      </MotionReveal>

      <div className="tw-mt-[50px] tw-grid tw-gap-8">
        <MotionReveal delay={60} y={16} scale={0.995} duration={480}>
          <div className="tw-overflow-hidden tw-rounded-[28px] tw-bg-white tw-p-8 md:tw-p-10">
            <div className="tw-grid tw-gap-10 lg:tw-grid-cols-[0.9fr_1.1fr] lg:tw-items-center">
              <div>
                <div className="tw-mb-4 tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-bg-fintoo-orange/10 tw-px-4 tw-py-2 tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[1px] tw-text-fintoo-orange">
                  <PlannerIcon type="calendar" className="tw-h-4 tw-w-4" />
                  Retirement Gap Analysis
                </div>
                <h3 className="tw-mb-3 tw-text-3xl tw-font-semibold tw-leading-[1.15] tw-text-fintoo-blue">
                  {supportPoints[0].title}
                </h3>
                <p className="tw-max-w-[430px] tw-text-base tw-leading-[1.8] tw-text-slate-500">
                  {supportPoints[0].text}
                </p>
              </div>

              <div className="tw-rounded-[24px] tw-border tw-border-slate-200 tw-bg-[linear-gradient(180deg,#f7faff_0%,#eef4ff_100%)] tw-p-5 tw-shadow-[0_20px_50px_rgba(4,43,98,0.08)]">
                <div className="tw-mb-4 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                  <div className="tw-rounded-full tw-bg-white tw-px-3 tw-py-1 tw-text-sm tw-font-medium tw-text-slate-500 tw-shadow-sm">
                    Your desired future
                  </div>
                  <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3 tw-text-xs tw-font-medium tw-text-slate-500">
                    <span className="tw-inline-flex tw-items-center tw-gap-2">
                      <span className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-fintoo-blue" />
                      Current trajectory
                    </span>
                    <span className="tw-inline-flex tw-items-center tw-gap-2">
                      <span className="tw-h-0 tw-w-5 tw-border-t-2 tw-border-dashed tw-border-fintoo-orange" />
                      Desired trajectory
                    </span>
                  </div>
                </div>

                <div className="tw-rounded-[20px] tw-border tw-border-white/70 tw-bg-white/75 tw-p-4">
                  <div className="tw-grid tw-gap-4 lg:tw-grid-cols-[1fr_120px]">
                    <div className="tw-relative tw-h-[260px] tw-overflow-hidden tw-rounded-[16px] tw-bg-[linear-gradient(180deg,rgba(4,43,98,0.02)_0%,rgba(4,43,98,0.06)_100%)]">
                      <div className="tw-absolute tw-inset-x-0 tw-top-5 tw-flex tw-justify-between tw-px-4 tw-text-[11px] tw-font-medium tw-text-slate-400">
                        <span>Target Corpus</span>
                        <span>On-track Growth</span>
                      </div>
                      <div className="tw-absolute tw-inset-x-4 tw-top-10 tw-bottom-12">
                        {[0, 1, 2, 3, 4].map((line) => (
                          <div
                            key={line}
                            className="tw-absolute tw-left-0 tw-right-0 tw-border-t tw-border-dashed tw-border-slate-200"
                            style={{ top: `${line * 25}%` }}
                          />
                        ))}

                        <svg viewBox="0 0 620 220" className="tw-absolute tw-inset-0 tw-h-full tw-w-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="dezervCurrentLine" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#7c8cf5" />
                              <stop offset="100%" stopColor="#042b62" />
                            </linearGradient>
                            <linearGradient id="dezervCurrentArea" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#7c8cf5" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#7c8cf5" stopOpacity="0" />
                            </linearGradient>
                          </defs>

                          <path
                            d="M36 172 C94 166, 138 154, 182 132 S282 102, 338 86 S456 50, 584 24 L584 220 L36 220 Z"
                            fill="url(#dezervCurrentArea)"
                          />
                          <path
                            d="M36 172 C94 166, 138 154, 182 132 S282 102, 338 86 S456 50, 584 24"
                            fill="none"
                            stroke="url(#dezervCurrentLine)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M36 180 C96 170, 142 154, 194 126 S300 88, 366 64 S476 22, 584 10"
                            fill="none"
                            stroke="#dd7300"
                            strokeWidth="3"
                            strokeDasharray="8 8"
                            strokeLinecap="round"
                          />
                          <line x1="338" y1="86" x2="338" y2="64" stroke="#dd7300" strokeWidth="2" strokeDasharray="4 5" />
                          <circle cx="36" cy="172" r="7" fill="#7c8cf5" />
                          <circle cx="584" cy="24" r="5" fill="#042b62" />
                          <circle cx="584" cy="10" r="5" fill="#dd7300" />
                        </svg>

                        <div className="tw-absolute tw-left-[4%] tw-top-[56%] tw-rounded-full tw-bg-white/95 tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-text-slate-600 tw-shadow-sm">
                          Today
                        </div>
                        <div className="tw-absolute tw-left-[47%] tw-top-[10%] tw-rounded-full tw-border tw-border-fintoo-orange/15 tw-bg-fintoo-orange/10 tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-text-fintoo-orange">
                          Retirement gap visible here
                        </div>
                      </div>

                      <div className="tw-absolute tw-bottom-3 tw-left-4 tw-right-4 tw-flex tw-justify-between tw-text-xs tw-text-slate-400">
                        <span>2025</span>
                        <span>2035</span>
                        <span>2045</span>
                        <span>2055</span>
                        <span>2065</span>
                      </div>
                    </div>

                    <div className="tw-grid tw-gap-3">
                      <div className="tw-rounded-[16px] tw-border tw-border-slate-200 tw-bg-white tw-p-3">
                        <div className="tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.4px] tw-text-slate-400">Projected Gap</div>
                        <div className="tw-mt-1 tw-text-2xl tw-font-semibold tw-text-fintoo-blue">18%</div>
                        <div className="tw-mt-1 tw-text-xs tw-text-slate-500">If your portfolio stays unchanged</div>
                      </div>
                      <div className="tw-rounded-[16px] tw-border tw-border-slate-200 tw-bg-white tw-p-3">
                        <div className="tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.4px] tw-text-slate-400">Expert Outcome</div>
                        <div className="tw-mt-1 tw-text-2xl tw-font-semibold tw-text-fintoo-orange">Aligned</div>
                        <div className="tw-mt-1 tw-text-xs tw-text-slate-500">With timely reallocation and reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>

        <div className="tw-grid tw-gap-8 lg:tw-grid-cols-2">
          <MotionReveal delay={110} y={16} scale={0.995} duration={480}>
            <div className="tw-h-full tw-overflow-hidden tw-rounded-[28px] tw-bg-white tw-p-8 md:tw-p-10">
              <h3 className="tw-mb-3 tw-text-3xl tw-font-semibold tw-leading-[1.15] tw-text-fintoo-blue">
                {supportPoints[1].title}
              </h3>
              <p className="tw-max-w-[360px] tw-text-base tw-leading-[1.7] tw-text-slate-500">
                {supportPoints[1].text}
              </p>

              <div className="tw-mt-8 tw-rounded-[26px] tw-border tw-border-slate-200 tw-bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_45%,#fff8f1_100%)] tw-p-6">
                <div className="tw-mb-5">
                  <div className="tw-text-lg tw-font-semibold tw-text-slate-800">Hi there!</div>
                  <div className="tw-text-sm tw-text-slate-500">Let&apos;s optimise your portfolio for better returns</div>
                </div>

                <div className="tw-relative tw-min-h-[250px]">
                  <div className="tw-absolute tw-left-0 tw-top-2 tw-w-[56%] tw-rounded-[18px] tw-border tw-border-rose-200 tw-bg-rose-50 tw-p-4 tw-shadow-sm">
                    <div className="tw-mb-4 tw-flex tw-items-center tw-gap-2 tw-text-xs tw-font-semibold tw-text-rose-500">
                      <span className="tw-h-3 tw-w-3 tw-rounded-full tw-bg-rose-400" />
                      Exit these funds
                    </div>
                    <div className="tw-grid tw-gap-3">
                      {["Sectoral Fund", "Conservative Fund", "Mid cap Index Fund", "Mid cap Value Fund"].map((item) => (
                        <div key={item} className="tw-border-b tw-border-rose-100 tw-pb-2">
                          <div className="tw-text-xs tw-uppercase tw-tracking-[0.4px] tw-text-slate-400">Fund</div>
                          <div className="tw-text-xs tw-text-slate-500">{item}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="tw-absolute tw-bottom-0 tw-right-0 tw-w-[58%] tw-rounded-[18px] tw-border tw-border-emerald-200 tw-bg-emerald-50 tw-p-4 tw-shadow-[0_18px_40px_rgba(4,43,98,0.08)]">
                    <div className="tw-mb-4 tw-flex tw-items-center tw-gap-2 tw-text-xs tw-font-semibold tw-text-teal-600">
                      <span className="tw-h-3 tw-w-3 tw-rounded-full tw-bg-teal-500" />
                      Invest in these funds
                    </div>
                    <div className="tw-grid tw-gap-3">
                      {["Large cap Index fund", "Value Fund", "Liquid Fund", "Long Term Bonds Fund"].map((item) => (
                        <div key={item} className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-emerald-100 tw-pb-2">
                          <div>
                            <div className="tw-text-xs tw-uppercase tw-tracking-[0.4px] tw-text-slate-400">Fund</div>
                            <div className="tw-text-xs tw-text-slate-500">{item}</div>
                          </div>
                          <div className="tw-h-3 tw-w-12 tw-rounded-full tw-bg-slate-200" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={160} y={16} scale={0.995} duration={480}>
            <div className="tw-h-full tw-overflow-hidden tw-rounded-[28px] tw-bg-white tw-p-8 md:tw-p-10">
              <h3 className="tw-mb-3 tw-text-3xl tw-font-semibold tw-leading-[1.15] tw-text-fintoo-blue">
                {supportPoints[2].title}
              </h3>
              <p className="tw-max-w-[360px] tw-text-base tw-leading-[1.7] tw-text-slate-500">
                {supportPoints[2].text}
              </p>

              <div className="tw-mt-8 tw-flex tw-justify-center">
                <div className="tw-relative tw-h-[360px] tw-w-full tw-max-w-[420px]">
                  <div className="tw-absolute tw-left-1/2 tw-top-1/2 tw-h-[310px] tw-w-[310px] tw--translate-x-1/2 tw--translate-y-1/2 tw-rounded-full tw-border tw-border-dashed tw-border-slate-200" />
                  <div className="tw-absolute tw-left-1/2 tw-top-1/2 tw-h-[210px] tw-w-[210px] tw--translate-x-1/2 tw--translate-y-1/2 tw-rounded-full tw-border tw-border-dashed tw-border-slate-200" />

                  <div className="tw-absolute tw-left-1/2 tw-top-1/2 tw-flex tw-h-[118px] tw-w-[118px] tw--translate-x-1/2 tw--translate-y-1/2 tw-items-center tw-justify-center tw-rounded-full tw-border-[3px] tw-border-white tw-bg-fintoo-blue tw-text-white tw-shadow-lg">
                    <img src="/static/media/wp/Fintoowhitelogo_.svg" alt="Fintoo Logo" className="tw-h-8 tw-w-auto" />
                  </div>
                  <div className="tw-absolute tw-left-1/2 tw-top-[70%] tw--translate-x-1/2 tw-rounded-full tw-bg-slate-100 tw-px-4 tw-py-2 tw-text-xs tw-text-slate-500">
                    Your Fintoo partner
                  </div>

                  {[
                    { label: "Zero hidden fees", pos: "tw-left-2 tw-top-16" },
                    { label: "Transparency", pos: "tw-right-2 tw-top-24" },
                    { label: "Track portfolio daily", pos: "tw-left-0 tw-bottom-14" },
                    { label: "Quarterly reviews", pos: "tw-right-8 tw-bottom-10" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`tw-absolute ${item.pos} tw-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-slate-200 tw-bg-white tw-px-4 tw-py-2 tw-text-xs tw-font-medium tw-text-slate-600 tw-shadow-sm`}
                    >
                      <span className="tw-h-3 tw-w-3 tw-rounded-full tw-bg-teal-500" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>

     
      </div>
    </section>
  );
}
