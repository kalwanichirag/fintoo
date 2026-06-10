import { useCallback, useEffect, useState } from "react";
import { FaHeartbeat } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { GetScoreCard } from "../../../FrappeIntegration-Services/services/financial-planning-api/dashboardApi";
import { getItemLocal, getUserId } from "../../../common_utilities";
import { DATA_BELONGS_TO } from "../../../constants";

const StateBlock = ({ state, show, children }) =>
  state === show ? <>{children}</> : null;

const CACHE_TTL_MS = 15 * 60 * 1000;
const MAX_SCORE = 100;

const scoreTone = (score) => {
  if (score >= 75) {
    return {
      text: "tw-text-emerald-700",
      chip: "tw-bg-emerald-100 tw-text-emerald-700",
      ring: "#16a34a",
    };
  }
  if (score >= 50) {
    return {
      text: "tw-text-amber-700",
      chip: "tw-bg-amber-100 tw-text-amber-700",
      ring: "#d97706",
    };
  }
  return {
    text: "tw-text-red-700",
    chip: "tw-bg-red-100 tw-text-red-700",
    ring: "#dc2626",
  };
};

export default function FinancialWellnessCard() {
  const userId = getUserId();
  const cacheKey = `financial_wellness_score_${userId}`;
  const [wellnessData, setWellnessData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const datagatehringstatus = getItemLocal("datagatheringstatus");
  const isDgReady = datagatehringstatus === "Y";

  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return;
      const parsed = JSON.parse(cached);
      const age = Date.now() - Number(parsed?.timestamp || 0);
      if (parsed?.data && age <= CACHE_TTL_MS) {
        setWellnessData(parsed.data);
      }
    } catch {}
  }, [cacheKey]);

  const fetchWellnessScore = useCallback(async () => {
    try {
      if (!userId || !isDgReady) {
        setWellnessData(null);
        return;
      }

      const response = await GetScoreCard(userId, DATA_BELONGS_TO);
      const isSuccess = String(response?.status_code) === "200";
      const data = isSuccess ? response?.data : null;

      if (data?.total_score !== undefined && data?.total_score !== null) {
        setWellnessData(data);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data, timestamp: Date.now() })
        );
      } else {
        setWellnessData(null);
      }
    } catch {
      setWellnessData(null);
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, userId, isDgReady]);

  useEffect(() => {
    if (!isDgReady) {
      setWellnessData(null);
      setIsLoading(false);
      return;
    }
    loadFromCache();
    fetchWellnessScore();
  }, [loadFromCache, fetchWellnessScore, isDgReady]);

  const hasData =
    wellnessData &&
    wellnessData.total_score !== undefined &&
    wellnessData.total_score !== null;
  const cardState = hasData ? "filled" : "empty";

  const score = Math.max(0, Math.min(100, Number(wellnessData?.total_score || 0)));
  const tone = scoreTone(score);
  const scoreLabel =
    score >= 75 ? "Strong position" : score >= 50 ? "Needs tuning" : "Action needed";
  const percentage = (score / MAX_SCORE) * 100;
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (percentage / 100) * circumference;

  if (isLoading && !hasData) {
    return (
      <div className="glass-card tw-rounded-2xl tw-p-4 md:tw-p-5 tw-flex tw-flex-col tw-h-full tw-animate-pulse">
        <div className="tw-h-5 tw-w-40 tw-bg-slate-200 tw-rounded tw-mb-4"></div>
        <div className="tw-h-12 tw-w-28 tw-bg-slate-200 tw-rounded tw-mb-4"></div>
        <div className="tw-h-12 tw-bg-slate-100 tw-rounded-lg"></div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card tw-rounded-2xl tw-p-4 md:tw-p-5 tw-flex tw-flex-col tw-h-full">
        <StateBlock state={cardState} show="filled">
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
            <div className="tw-flex tw-items-center tw-space-x-3">
              <div className="tw-w-11 tw-h-11 md:tw-w-12 md:tw-h-12 tw-bg-fintoo-blue tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                <FaHeartbeat className="tw-text-white tw-text-xl" />
              </div>
              <div>
                <h2 className="tw-text-base tw-font-semibold tw-text-slate-800 tw-mb-0 tw-pb-0">
                  Financial Wellness
                </h2>
                <p className="tw-text-xs tw-text-slate-500 tw-mb-0">
                  Your money health snapshot, based on your latest details
                </p>
              </div>
            </div>
            
          </div>

          <div className="tw-flex tw-flex-col tw-items-center tw-mt-1 tw-mb-2">
            <div className="tw-relative tw-w-32 tw-h-32">
              <svg className="tw-w-full tw-h-full" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  stroke={tone.ring}
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>

              <div className="tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center">
                <p className={`tw-text-2xl tw-font-extrabold tw-leading-none tw-mb-1 ${tone.text}`}>
                  {Math.round(score)}
                </p>
                <p className="tw-text-xs tw-text-slate-500 tw-mb-0">out of {MAX_SCORE}</p>
              </div>
            </div>

            <div className="tw-flex tw-items-center tw-gap-1.5 tw-relative tw-group tw-mt-2">
              <p className={`tw-text-lg tw-font-semibold tw-mb-0 ${tone.text}`}>{scoreLabel}</p>
              <FiInfo className="tw-text-slate-500 tw-cursor-pointer" size={14} />

              <div className="tw-absolute tw-bottom-full tw-left-1/2 tw--translate-x-1/2 tw-mb-2 tw-hidden group-hover:tw-block tw-w-56 tw-rounded-lg tw-bg-fintoo-blue tw-text-white tw-text-xs tw-p-3 tw-shadow-lg tw-z-10">
                <p className="tw-mb-1"><b>0-49:</b> Action needed</p>
                <p className="tw-mb-1"><b>50-74:</b> Needs tuning</p>
                <p className="tw-mb-0"><b>75-100:</b> Strong position</p>
              </div>
            </div>

         

            <button
              type="button"
              onClick={() => {
                window.location.href = `${process.env.PUBLIC_URL}/report/intro`;
              }}
              className="tw-mt-3 tw-inline-flex tw-items-center tw-gap-2 tw-rounded-xl tw-bg-fintoo-blue  tw-text-white tw-text-xs tw-font-semibold tw-px-5 tw-py-3 tw-shadow-sm tw-transition"
            >
              View full report
            </button>
          </div>
        </StateBlock>

        <StateBlock state={cardState} show="empty">
          <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-flex-1 tw-text-center tw-py-8">
            <div className="tw-w-12 tw-h-12 tw-bg-gradient-to-br tw-from-slate-100 tw-to-slate-200 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-3">
              <FaHeartbeat className="tw-text-slate-700 tw-text-lg" />
            </div>
            <p className="tw-text-base tw-font-semibold tw-text-slate-800 tw-mb-1">
              Financial Wellness
            </p>
            {!isDgReady ? (
              <>
                <p className="tw-text-sm tw-text-slate-600 tw-max-w-xs tw-mb-3">
                  Share a few details to get your personalized wellness score and next-step guidance.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `${process.env.PUBLIC_URL}/datagathering/about-you`;
                  }}
                  className="tw-rounded-xl tw-bg-fintoo-blue tw-px-4 tw-py-2 tw-text-xs tw-font-semibold tw-text-white tw-shadow-sm"
                >
                 Let’s Get Started
                </button>
              </>
            ) : (
              <p className="tw-text-sm tw-text-slate-600 tw-max-w-xs tw-mb-0">
                We are almost there. Add income, expenses, assets, and liabilities to generate your score.
              </p>
            )}
          </div>
        </StateBlock>
      </div>
    </>
  );
}
