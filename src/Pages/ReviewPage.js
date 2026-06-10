import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import "../components/Insurance/tailwind.css";

const SCORE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const GOOGLE_SHEET_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbz11uMi9du_t6MEZIVtItX9L00vlPJHKtgHpTKn4nugnO3rci9ahMQn4fyLHE_or8ah2A/exec";
const getQuestionConfig = (score) => {
  if (score >= 9) {
    return {
      question:
        "What has Fintoo done that has made the biggest difference to your financial life? (optional)",
      bucket: "promoter"
    };
  }

  if (score <= 6) {
    return {
      question:
        "We're sorry your experience hasn't met expectations. What is the biggest issue we need to address for you? (optional)",
      bucket: "detractor"
    };
  }

  return {
    question: "What is the one thing that would make Fintoo a 9 or 10 for you? (optional)",
    bucket: "passive"
  };
};

function ReviewPage() {
  const [step, setStep] = useState(1);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionConfig = useMemo(() => getQuestionConfig(score ?? 0), [score]);

  const handleScoreSelect = (value) => {
    setScore(value);
    setStep(2);

    if (window?.webengage?.track) {
      window.webengage.track("review score selected", {
        score: value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedFeedback = feedback.trim();
    if (!score || isSubmitting) return;

    setIsSubmitting(true);

    const payload = {
      score,
      "response question": questionConfig.question,
      "response text": trimmedFeedback || "No response provided",
    };

    try {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error("Google Sheet form sync failed", error);
    }

    if (window?.webengage?.track) {
      window.webengage.track("review form submitted", payload);
    }

    setIsSubmitted(true);
    setStep(3);
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Fintoo | Review</title>
      </Helmet>

      <main className="tw-min-h-screen tw-bg-[linear-gradient(135deg,#042b62_0%,#163d7a_100%)] tw-px-4 sm:tw-px-6">
        
        <div className="tw-mx-auto tw-flex tw-min-h-[calc(100vh-10rem)] tw-w-full tw-max-w-3xl tw-flex-col tw-justify-center">
          <div className="tw-mb-5 tw-px-1">
          <div className="tw-flex tw-items-center tw-justify-center tw-pt-4">
            <img
              src={"https://www.fintoo.in/static/media/wp/Fintoowhitelogo_.svg"}
              alt="Fintoo"
              className="tw-h-14 tw-w-auto center"
            />
            </div>
            <div className="tw-mt-10 tw-space-y-2 tw-text-white tw-text-center">
              <h2 className="tw-text-[1.9rem] md:tw-text-[2.8rem] tw-font-semibold tw-leading-tight">
                Your Experince Matter to Us
              </h2>
              <p className="tw-text-sm md:tw-text-base tw-leading-6 tw-text-white/82">
                You&apos;ve been with Fintoo for a while now.
              </p>
              <p className="tw-text-sm md:tw-text-base tw-leading-6 tw-text-white/72">
                We&apos;d love to hear how your experience has been, honestly and in your own words.
              </p>
              
            </div>
            
          </div>

          <section className="tw-overflow-hidden tw-rounded-[20px] tw-border tw-border-[#e5e7eb] tw-mt-3 tw-bg-white tw-shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="tw-h-2 tw-bg-[#dd7300]" />
            <div className="tw-p-6 sm:tw-p-8">
              {!isSubmitted ? (
                <>
                  <div className="tw-border-b tw-border-slate-100 tw-pb-4">
                    <h1 className="tw-mx-auto tw-max-w-3xl tw-text-center tw-text-[1rem] md:tw-text-[1.5rem]  tw-leading-[1.3] tw-text-slate-900">
                      {step === 1
                        ? "On a scale of 0-10, how likely are you to recommend Fintoo to a friend or family member?"
                        : questionConfig.question}
                    </h1>
                  </div>

                  {step === 1 ? (
                    <div className="tw-mt-4">
                       <div className="tw-flex tw-flex-wrap tw-justify-center tw-gap-3">
                        {SCORE_OPTIONS.map((option) => {
                          const scoreClass =
                            option <= 6
                              ? "tw-bg-[#ff7e74] hover:tw-bg-[#ff6f64]"
                              : option <= 8
                                ? "tw-bg-[#ffc74a] hover:tw-bg-[#ffbc2b]"
                                : "tw-bg-[#42c96d] hover:tw-bg-[#35ba5f]";

                          return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleScoreSelect(option)}
                            disabled={isSubmitting}
                            className={`tw-flex tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-rounded-lg tw-text-lg tw-font-semibold tw-text-white tw-transition disabled:tw-cursor-not-allowed disabled:tw-opacity-60 ${scoreClass}`}
                          >
                            {option}
                          </button>
                          );
                        })}
                      </div>

                      <div className="tw-mt-14 tw-flex tw-items-center tw-justify-between tw-gap-4 tw-text-sm tw-text-slate-500">
                        <span>1 = Not at all likely 😞</span>
                        <span>10 = Extremely likely 😍</span>
                      </div>
                    </div>
                  ) : (
                    <form className="tw-mt-3" onSubmit={handleSubmit}>
                      <label className="tw-block">
                        <textarea
                          value={feedback}
                          onChange={(event) => setFeedback(event.target.value)}
                          rows={6}
                          placeholder="Your answer"
                          className="tw-w-full tw-rounded-xl tw-border tw-border-slate-300 tw-bg-white tw-px-4 tw-py-4 tw-text-base tw-leading-7 tw-text-slate-900 tw-outline-none focus:tw-border-[#dd7300] focus:tw-ring-2 focus:tw-ring-[#dd7300]/10"
                        />
                      </label>

                      <div className="tw-mt-6 tw-flex tw-flex-col tw-gap-3 sm:tw-flex-row">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          disabled={isSubmitting}
                          className="tw-rounded-md tw-border tw-border-slate-300 tw-px-5 tw-py-2.5 tw-text-sm tw-font-medium tw-text-slate-700 disabled:tw-cursor-not-allowed disabled:tw-opacity-60"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-rounded-md tw-bg-fintoo-orange tw-px-5 tw-py-2.5 tw-text-sm tw-font-medium tw-text-white disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="tw-h-4 tw-w-4 tw-animate-spin tw-rounded-full tw-border-2 tw-border-white/40 tw-border-t-white" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Feedback"
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                <div>
                  <h2 className="tw-text-[1.9rem] tw-font-medium tw-text-slate-900">Thank you</h2>
                  <p className="tw-mt-3 tw-text-base tw-leading-7 tw-text-slate-600">
                    Your response has been recorded.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default ReviewPage;
