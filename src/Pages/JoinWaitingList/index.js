import React from "react";
import { Helmet } from "react-helmet-async";
import "../../components/Insurance/tailwind.css";

function JoinWaitingList() {
  return (
    <>
      <Helmet>
        <title>Fintoo360 | Join Waiting List</title>
      </Helmet>

      <main className="tw-overflow-hidden tw-bg-white tw-font-inter tw-text-[#1a202c]">
        <section className="tw-relative tw-px-0 tw-py-0 tw-container tw-mx-auto">
          <div className="tw-absolute tw-left-[-8rem] tw-top-[-3rem] tw-h-72 tw-w-72 tw-rounded-full tw-bg-[#8b5cf6]/10 tw-blur-3xl" />
          <div className="tw-absolute tw-right-[-10rem] tw-top-10 tw-h-[32rem] tw-w-[32rem] tw-rounded-full tw-bg-[#60a5fa]/10 tw-blur-3xl" />

          <div className="tw-relative tw-w-full  tw-px-5 tw-py-10 sm:tw-px-8 md:tw-px-10 md:tw-py-12 lg:tw-px-16 lg:tw-py-14">
            <div className="tw-relative tw-grid tw-gap-10 lg:tw-grid-cols-[1fr_280px] lg:tw-gap-8">
              <div className="tw-grid tw-items-start tw-gap-10 lg:tw-grid-cols-[minmax(0,1fr)_320px]">
                <div className="tw-max-w-[420px] tw-pt-4">
                  <h1 className="tw-text-[3rem] tw-font-bold tw-leading-[1.05] tw-tracking-[-0.04em] tw-text-[#151515] md:tw-text-[4.25rem]">
                    Take Control Of Your Money
                    <span className="tw-mt-2 tw-block tw-font-serif tw-italic tw-text-[#8b5cf6]">
                      With AI
                    </span>
                  </h1>

                  <div className="tw-mt-8 tw-flex tw-flex-wrap tw-gap-4">
                    <button
                      type="button"
                      className="tw-rounded-full tw-bg-[linear-gradient(90deg,#8b5cf6_0%,#6b46c1_100%)] tw-px-7 tw-py-3 tw-text-sm tw-font-semibold tw-text-white tw-shadow-[0_16px_30px_rgba(107,70,193,0.25)]"
                    >
                      Download Now
                    </button>
                    <button
                      type="button"
                      className="tw-rounded-full tw-bg-white tw-px-7 tw-py-3 tw-text-sm tw-font-semibold tw-text-[#1f2937] tw-shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
                    >
                      Watch Demo
                    </button>
                  </div>
                </div>

                <div className="tw-relative tw-mx-auto tw-flex tw-justify-center lg:tw-min-h-[620px]">
                  <img
                    className="tw-relative tw-z-10 tw-h-auto tw-w-full tw-max-w-[280px] tw-object-contain tw-drop-shadow-[0_30px_30px_rgba(31,41,55,0.28)] md:tw-max-w-[520px]"
                    src="https://static.vecteezy.com/system/resources/thumbnails/053/460/381/small/white-titanium-smartphone-mockup-template-in-isometric-style-with-no-background-png.png"
                    alt="White titanium smartphone mockup"
                  />
                </div>
              </div>

              <div className="tw-max-w-[250px] tw-pt-3 lg:tw-justify-self-end">
                <p className="tw-text-sm tw-leading-7 tw-text-[#5f6471]">
                  Easily track where your money is going, understand your spending
                  habits, and get smart AI suggestions that help you make better
                  decisions every day.
                </p>

                <div className="tw-mt-8 tw-flex tw-items-center tw-gap-4">
                  <div className="tw-flex -tw-space-x-2">
                    <span className="tw-h-10 tw-w-10 tw-rounded-full tw-border-2 tw-border-white tw-bg-[#c4b5fd]" />
                    <span className="tw-h-10 tw-w-10 tw-rounded-full tw-border-2 tw-border-white tw-bg-[#93c5fd]" />
                    <span className="tw-h-10 tw-w-10 tw-rounded-full tw-border-2 tw-border-white tw-bg-[#f9a8d4]" />
                  </div>
                  <div>
                    <div className="tw-text-[2rem] tw-font-bold tw-leading-none">50K+</div>
                    <p className="tw-mt-2 tw-text-sm tw-leading-6 tw-text-[#71717a]">
                      Over 50,000 users are already loving FinFlow and having a great
                      time with it.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-relative tw-mt-6 tw-overflow-hidden tw-rounded-[28px] tw-bg-[linear-gradient(90deg,#8b5cf6_0%,#7c3aed_100%)] tw-px-6 tw-pb-8 tw-pt-20 md:tw-px-10 md:tw-pb-10 lg:tw-mt-8 lg:tw-px-12 lg:tw-pb-12 lg:tw-pt-24">
              <div className="tw-pointer-events-none tw-absolute tw-inset-0 tw-bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%)]" />
              <div className="tw-pointer-events-none tw-absolute tw-inset-x-0 tw-top-4 tw-overflow-hidden tw-text-center tw-text-[4rem] tw-font-semibold tw-leading-none tw-tracking-[0.08em] tw-text-white/28 md:tw-text-[5.5rem]">
                FLOW • FINFLOW • FINFLOW
              </div>

              <div className="tw-relative tw-z-10 tw-text-center">
                <p className="tw-text-sm tw-font-medium tw-text-white/85">
                  Trusted by 2,000+ startups &amp; finance teams
                </p>
                <div className="tw-mt-6 tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-gap-x-8 tw-gap-y-4 tw-text-sm tw-font-semibold tw-text-white/95">
                  <span>Boltshift</span>
                  <span>Lightbox</span>
                  <span>FeatherDev</span>
                  <span>GlobalBank</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tw-relative tw-container tw-mx-auto tw-px-5 tw-pb-16 tw-pt-10 sm:tw-px-8 md:tw-px-10 lg:tw-px-16 lg:tw-pb-24 lg:tw-pt-16">
          <div className="tw-mx-auto tw-max-w-[1180px] tw-rounded-[32px] tw-bg-[linear-gradient(180deg,#faf7ff_0%,#f3ecff_100%)] tw-px-5 tw-py-10 tw-shadow-[0_24px_60px_rgba(139,92,246,0.10)] md:tw-rounded-[36px] md:tw-px-8 md:tw-py-12 lg:tw-px-10">
            <div className="tw-text-center">
              <span className="tw-inline-flex tw-items-center tw-rounded-full tw-bg-white tw-px-4 tw-py-2 tw-text-xs tw-font-medium tw-text-[#6b7280] tw-shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
                Smart Finance Experience
              </span>
              <h2 className="tw-mx-auto tw-mt-5 tw-max-w-4xl tw-text-[2rem] tw-font-bold tw-leading-tight tw-tracking-[-0.03em] tw-text-[#171717] md:tw-text-[3rem]">
                You&apos;re earning well. But does your money actually have a plan?
              </h2>
            </div>

            <div className="tw-mt-10 tw-grid tw-gap-8 lg:tw-grid-cols-[360px_minmax(0,1fr)] lg:tw-items-start">
              <div className="tw-relative tw-flex tw-justify-center lg:tw-justify-start">
                <div className="tw-absolute tw-bottom-6 tw-left-1/2 tw-h-[78%] tw-w-[82%] -tw-translate-x-1/2 tw-rounded-[32px] tw-bg-[linear-gradient(180deg,rgba(139,92,246,0.16)_0%,rgba(139,92,246,0.05)_100%)] tw-blur-2xl" />
                <div className="tw-relative tw-z-10 tw-w-full tw-max-w-[310px] tw-overflow-hidden tw-rounded-[36px] tw-border tw-border-white/70 tw-bg-white tw-p-4 tw-shadow-[0_30px_50px_rgba(139,92,246,0.18)]">
                  <div className="tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-1">
                    <span className="tw-text-[11px] tw-font-semibold tw-text-[#202020]">9:41</span>
                    <div className="tw-h-6 tw-w-20 tw-rounded-full tw-bg-[#111111]" />
                    <div className="tw-flex tw-gap-1">
                      <span className="tw-h-2 tw-w-2 tw-rounded-full tw-bg-[#111111]" />
                      <span className="tw-h-2 tw-w-2 tw-rounded-full tw-bg-[#111111]/60" />
                      <span className="tw-h-2 tw-w-2 tw-rounded-full tw-bg-[#111111]/30" />
                    </div>
                  </div>

                  <div className="tw-mt-3 tw-rounded-[28px] tw-bg-[linear-gradient(180deg,#fcfaff_0%,#f5efff_100%)] tw-p-4">
                    <p className="tw-text-sm tw-font-semibold tw-text-[#6b46c1]">Fintoo360 Insights</p>
                    <p className="tw-mt-2 tw-text-[11px] tw-font-medium tw-text-[#7c7c90]">
                      AI-powered financial clarity for real life decisions
                    </p>

                    <div className="tw-mt-5 tw-rounded-[22px] tw-bg-white tw-p-4 tw-shadow-[0_10px_24px_rgba(139,92,246,0.08)]">
                      <p className="tw-text-xs tw-font-semibold tw-text-[#262626]">
                        Your money, modelled against reality
                      </p>
                      <p className="tw-mt-2 tw-text-[1.9rem] tw-font-bold tw-leading-none tw-text-[#6b46c1]">
                        ₹7,200
                      </p>
                      <div className="tw-mt-4 tw-h-24 tw-rounded-[18px] tw-bg-[linear-gradient(180deg,#f8f4ff_0%,#ffffff_100%)] tw-p-3">
                        <div className="tw-flex tw-h-full tw-items-end tw-justify-between tw-gap-2">
                          <span className="tw-h-[30%] tw-w-6 tw-rounded-t-full tw-bg-[#d7c3ff]" />
                          <span className="tw-h-[45%] tw-w-6 tw-rounded-t-full tw-bg-[#c4b5fd]" />
                          <span className="tw-h-[60%] tw-w-6 tw-rounded-t-full tw-bg-[#a78bfa]" />
                          <span className="tw-h-[48%] tw-w-6 tw-rounded-t-full tw-bg-[#c4b5fd]" />
                          <span className="tw-h-[70%] tw-w-6 tw-rounded-t-full tw-bg-[#8b5cf6]" />
                        </div>
                      </div>
                    </div>

                    <div className="tw-mt-4 tw-rounded-[22px] tw-bg-white tw-p-4 tw-shadow-[0_10px_24px_rgba(139,92,246,0.08)]">
                      <p className="tw-text-xs tw-font-semibold tw-text-[#262626]">Smart Suggestion</p>
                      <p className="tw-mt-2 tw-text-[11px] tw-leading-5 tw-text-[#6b7280]">
                        Fintoo360 keeps your real numbers in view before every financial move.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tw-grid tw-gap-4">
                <div className="tw-rounded-[22px] tw-bg-white tw-p-5 tw-shadow-[0_14px_30px_rgba(139,92,246,0.10)]">
                  <p className="tw-text-base tw-font-semibold tw-text-[#1f2937]">
                    You have SIPs, loans, insurance you barely understand, maybe ESOPs, and a savings account sitting idle — but no single picture of where you actually stand.
                  </p>
                </div>

                <div className="tw-rounded-[22px] tw-bg-white tw-p-5 tw-shadow-[0_14px_30px_rgba(139,92,246,0.10)]">
                  <p className="tw-text-base tw-font-semibold tw-text-[#1f2937]">
                    Every big decision — job switch, home loan, having a child, taking a sabbatical — feels like a stab in the dark because no one has modelled it against your real numbers.
                  </p>
                </div>

                <div className="tw-rounded-[22px] tw-bg-white tw-p-5 tw-shadow-[0_14px_30px_rgba(139,92,246,0.10)]">
                  <p className="tw-text-base tw-font-semibold tw-text-[#1f2937]">
                    You&apos;ve watched parents struggle with nominations, inheritance confusion, and no financial plan at the end. You don&apos;t want that to be your story.
                  </p>
                </div>

                <div className="tw-rounded-[22px] tw-bg-white tw-p-5 tw-shadow-[0_14px_30px_rgba(139,92,246,0.10)]">
                  <p className="tw-text-base tw-font-semibold tw-text-[#1f2937]">
                    You&apos;ve tried apps, spreadsheets, and weekend YouTube rabbit holes. But what you actually need is an advisor who&apos;s always available, always updated, and never selling you something.
                  </p>
                </div>

                <div className="tw-rounded-[22px] tw-bg-[linear-gradient(90deg,#8b5cf6_0%,#7c3aed_100%)] tw-p-6 tw-shadow-[0_18px_40px_rgba(139,92,246,0.20)]">
                  <p className="tw-text-lg tw-font-semibold tw-leading-8 tw-text-white">
                    That&apos;s what Fintoo360 is. An AI-powered, advisory-grade personal CFO — built by the people who have been advising Indian families for over a decade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default JoinWaitingList;
