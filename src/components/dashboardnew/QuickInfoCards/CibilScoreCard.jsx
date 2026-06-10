import React, { useEffect, useState } from "react";
import { FiRefreshCw,FiInfo,FiLock } from "react-icons/fi";
import { Fetchexternalholdingdetails } from "../../../FrappeIntegration-Services/services/financial-planning-api/liabilities";
import { getUserId } from "../../../common_utilities";
import { DATA_BELONGS_TO } from "../../../constants";

const StateBlock = ({ state, show, children }) =>
  state === show ? <>{children}</> : null;

const MAX_SCORE = 900;
const MIN_SCORE = 300;
const NO_CIBIL_SCORE = 0;

const getScoreLabel = (score) => {
  if (score >= 750) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 650) return "Fair";
  return "Needs Improvement";
};

export default function CibilScoreCard({
  refreshKey,
  onCheckCibil,
  onRefresh,
}) {
  const COMING_SOON = false;
  const [score, setScore] = useState(null);
  const [hasCibilHolding, setHasCibilHolding] = useState(false);
  const [lastModifiedAt, setLastModifiedAt] = useState(null);
  const [cooldownMessage, setCooldownMessage] = useState("");
  const [nowTick, setNowTick] = useState(Date.now());

  const COOLDOWN_DAYS = 30;
  const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

  const parseHoldingDate = (dateStr) => {
    if (!dateStr) return null;
    const isoLike = dateStr.replace(" ", "T");
    const parsed = new Date(isoLike);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const formatRemaining = (ms) => {
    if (ms <= 0) return "0m";
    const totalMinutes = Math.ceil(ms / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    if (days > 0) return `${days}d`;
    const hours = Math.floor(totalMinutes / 60);
    if (hours > 0) return `${hours}h`;
    return `${totalMinutes}m`;
  };

  useEffect(() => {
    if (COMING_SOON) return;
    const fetchHoldingDetails = async () => {
      try {
        let payload = {
                data_belongs_to: DATA_BELONGS_TO,
                user_id: getUserId(),
                holding_type: "Loan"
              };
        const res = await Fetchexternalholdingdetails(payload);

        const details = res?.data?.holding_details || [];
        const hasDetails = details.length > 0;
        const fetchedScore = details?.[0]?.cibil_score;
        const parsedScore =
          fetchedScore === null || fetchedScore === undefined || fetchedScore === ""
            ? null
            : Number(fetchedScore);
        const latestModified = details.reduce((latest, item) => {
          const current = parseHoldingDate(item?.holding_modified_date);
          if (!current) return latest;
          if (!latest) return current;
          return current > latest ? current : latest;
        }, null);

        setHasCibilHolding(hasDetails);
        setScore(Number.isNaN(parsedScore) ? null : parsedScore);
        setLastModifiedAt(latestModified || null);
        if (!hasDetails) {
          setCooldownMessage("");
        }
      } catch (err) {
        console.log("Holding API error:", err);
        setHasCibilHolding(false);
        setScore(null);
        setLastModifiedAt(null);
        setCooldownMessage("");
      }
    };

    fetchHoldingDetails();
  }, [refreshKey, COMING_SOON]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setNowTick(Date.now());
    }, 60000);
    return () => clearInterval(timerId);
  }, []);

  const nextAllowedAt = lastModifiedAt
    ? new Date(lastModifiedAt.getTime() + COOLDOWN_MS)
    : null;
  const remainingMs = nextAllowedAt ? nextAllowedAt.getTime() - nowTick : 0;
  const canFetch = !nextAllowedAt || remainingMs <= 0;

  const handleOpenCibil = (mode) => {
    if (COMING_SOON) return;
    if (mode === "refresh" && !canFetch) {
      setCooldownMessage(
        `CIBIL can be fetched once every ${COOLDOWN_DAYS} days. Try again in ${formatRemaining(
          remainingMs
        )}.`
      );
      return;
    }
    setCooldownMessage("");
    if (mode === "refresh") onRefresh?.();
    else onCheckCibil?.();
  };

  const percentage = score
    ? ((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100
    : 0;

  const circumference = 2 * Math.PI * 44;
  const offset =
    circumference - (percentage / 100) * circumference;

  const scoreLabel = score ? getScoreLabel(score) : "N/A";

  const effectiveState = !hasCibilHolding
    ? "empty"
    : score === NO_CIBIL_SCORE
      ? "no-history"
      : "filled";

  if (COMING_SOON) {
    return (
      <div className="glass-card tw-rounded-2xl tw-p-4 md:tw-p-6 tw-pb-4 md:tw-pb-5 tw-flex tw-flex-col tw-h-full tw-relative tw-overflow-hidden">
        <div className="tw-flex tw-items-center tw-space-x-3 tw-mb-3 md:tw-mb-4">
          <div className="tw-w-11 tw-h-11 md:tw-w-12 md:tw-h-12 tw-bg-slate-200 tw-rounded-xl tw-flex tw-items-center tw-justify-center">
            <i className="fa-solid fa-gauge-high tw-text-slate-600 tw-text-xl"></i>
          </div>
          <div>
            <h2 className="tw-text-base tw-font-semibold tw-text-slate-800 tw-pb-0 tw-mb-0">
              CIBIL Score
            </h2>
            {/* <p className="tw-text-xs tw-text-slate-500 tw-mb-0">
              Locked
            </p> */}
          </div>
        </div>

        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-flex-1 tw-text-center tw-py-10 tw-border tw-border-dashed tw-border-slate-300 tw-bg-slate-50 tw-rounded-xl">
          <div className="tw-w-12 tw-h-12 tw-bg-slate-200 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-3">
            <FiLock className="tw-text-slate-700" size={18} />
          </div>
          <p className="tw-text-base tw-font-semibold tw-text-slate-800 tw-mb-1">
            Coming Soon
          </p>
          <p className="tw-text-sm tw-text-slate-600 tw-max-w-xs tw-mb-0">
            CIBIL Score will be available soon.
          </p>
        </div>
      </div>
    );
  }

  return (
      <div className="glass-card tw-rounded-2xl tw-p-4 md:tw-p-6 tw-pb-4 md:tw-pb-5 tw-flex tw-flex-col tw-h-full">

      <StateBlock state={effectiveState} show="filled">
        <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
          <div className="tw-flex tw-items-center tw-space-x-3">
            <div className="tw-w-12 tw-h-12 tw-bg-fintoo-blue tw-rounded-xl tw-flex tw-items-center tw-justify-center">
              <i className="fa-solid fa-gauge-high tw-text-white tw-text-xl"></i>
            </div>

            <div>
              <h2 className="tw-text-base tw-font-semibold tw-text-slate-800 tw-pb-0 tw-mb-0">
                CIBIL Score
              </h2>
              <p className="tw-text-xs tw-text-slate-500 tw-mb-0">
                {canFetch
              ? "You can refresh now"
              : `Next refresh in ${formatRemaining(remainingMs)}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenCibil("refresh")}
            // disabled={!canFetch}
            className={`tw-flex tw-items-center tw-gap-1.5 tw-text-xs tw-bg-transparent ${
              canFetch
                ? "tw-text-fintoo-blue"
                : "tw-text-slate-400 tw-cursor-not-allowed"
            }`}
            title={
              canFetch
                ? "Refresh CIBIL"
                : `Try again in ${formatRemaining(remainingMs)}`
            }
          >
            <FiRefreshCw size={14} />
          </button>
        </div>
          
          {cooldownMessage && (
            <p className="tw-text-xs tw-text-center tw-text-amber-600 tw-mb-0">
              {cooldownMessage}
            </p>
          )}

        <div className="tw-flex tw-flex-col tw-items-center tw-mt-4">
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
                stroke="#2563eb"
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>

            <div className="tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center">
              <p className="tw-text-xl tw-font-extrabold tw-mb-0">
                {score ?? "--"}
              </p>
              <p className="tw-text-xs tw-text-slate-500 tw-mb-0">
                out of {MAX_SCORE}
              </p>
            </div>
          </div>

        <div className="tw-flex tw-items-center tw-gap-2 tw-relative tw-group">
  <p className="tw-text-base tw-font-semibold tw-text-fintoo-blue tw-mb-0">
    {scoreLabel}
  </p>

           
  <FiInfo className="tw-text-slate-600 tw-cursor-pointer" size={14} />

  {/* Tooltip */}
  <div className="tw-absolute tw-bottom-full tw-left-1/2 tw--translate-x-1/2 tw-mb-2 
                  tw-hidden group-hover:tw-block tw-w-56 tw-rounded-lg tw-bg-fintoo-blue 
                  tw-text-white tw-text-xs tw-p-3 tw-shadow-lg tw-z-10">
    <p className="tw-mb-1"><b>300–649:</b> Needs Improvement</p>
    <p className="tw-mb-1"><b>650–699:</b> Fair</p>
    <p className="tw-mb-1"><b>700–749:</b> Good</p>
    <p className="tw-mb-1"><b>750–900:</b> Excellent</p>
  </div>
          </div>
           <p className="tw-text-sm tw-text-slate-500 tw-text-center tw-mt-2">
    Higher scores improve loan approval chances and interest rates.
  </p>
        </div>
      </StateBlock>

      <StateBlock state={effectiveState} show="empty">
         <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
          <div className="tw-flex tw-items-center tw-space-x-3">
            <div className="tw-w-12 tw-h-12 tw-bg-fintoo-blue tw-rounded-xl tw-flex tw-items-center tw-justify-center">
              <i className="fa-solid fa-gauge-high tw-text-white tw-text-xl"></i>
            </div>

            <div>
              <h2 className="tw-text-base tw-font-semibold tw-text-slate-800 tw-pb-0 tw-mb-0">
                CIBIL Score
              </h2>
              <p className="tw-text-xs tw-text-slate-500 tw-mb-0">
                Credit score range: 300 – 900
              </p>
            </div>
          </div>

         
        </div>

        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-flex-1 tw-text-center tw-py-10">
          <p className="tw-text-sm tw-text-slate-600 tw-max-w-xs">
            Connect your credit profile to view your CIBIL score.
          </p>

          <button
            onClick={() => handleOpenCibil("check")}
            className="tw-rounded-xl tw-bg-fintoo-blue tw-px-6 tw-py-3 tw-text-sm tw-font-semibold tw-text-white"
          >
            View CIBIL Score
          </button>
        </div>
      </StateBlock>

      <StateBlock state={effectiveState} show="no-history">
        <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
          <div className="tw-flex tw-items-center tw-space-x-3">
            <div className="tw-w-12 tw-h-12 tw-bg-fintoo-blue tw-rounded-xl tw-flex tw-items-center tw-justify-center">
              <i className="fa-solid fa-gauge-high tw-text-white tw-text-xl"></i>
            </div>

            <div>
              <h2 className="tw-text-base tw-font-semibold tw-text-slate-800 tw-pb-0 tw-mb-0">
                CIBIL Score
              </h2>
              <p className="tw-text-xs tw-text-slate-500 tw-mb-0">
                {canFetch
                  ? "You can refresh now"
                  : `Next refresh in ${formatRemaining(remainingMs)}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenCibil("refresh")}
            className={`tw-flex tw-items-center tw-gap-1.5 tw-text-xs tw-bg-transparent ${
              canFetch
                ? "tw-text-fintoo-blue"
                : "tw-text-slate-400 tw-cursor-not-allowed"
            }`}
            title={
              canFetch
                ? "Refresh CIBIL"
                : `Try again in ${formatRemaining(remainingMs)}`
            }
          >
            <FiRefreshCw size={14} />
          </button>
        </div>

        {cooldownMessage && (
          <p className="tw-text-xs tw-text-center tw-text-amber-600 tw-mb-0">
            {cooldownMessage}
          </p>
        )}

        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-flex-1 tw-text-center tw-py-8">
          <div className="tw-flex tw-items-center tw-justify-center tw-w-24 tw-h-24 tw-rounded-full tw-bg-slate-100 tw-border tw-border-slate-200">
            <p className="tw-text-3xl tw-font-extrabold tw-text-slate-700 tw-mb-0">
              0
            </p>
          </div>

          <p className="tw-mt-4 tw-text-base tw-font-semibold tw-text-slate-800 tw-mb-1">
            No CIBIL history yet
          </p>
          <p className="tw-text-sm tw-text-slate-500 tw-max-w-xs tw-mb-0">
            This usually means the user has not taken a loan or used credit yet, so no score has been generated.
          </p>
        </div>
      </StateBlock>
    </div>
  );
}
