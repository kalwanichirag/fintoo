import React, { useEffect, useRef, useState } from "react";
import { FaChartPie, FaCrown, FaDownload, FaRobot, FaRedo, FaEllipsisV } from "react-icons/fa";
import { FiRefreshCw, FiInfo } from "react-icons/fi";

import MFReportModal from "../../../Pages/datagathering/MFReport/MFReportModal";
import { getUserId, indianRupeeFormat } from "../../../common_utilities";
import { DATA_BELONGS_TO } from "../../../constants";

import { GetDocumentDetails } from "../../../FrappeIntegration-Services/services/financial-planning-api/document";
import { Fetchexternalholdingdetails } from "../../../FrappeIntegration-Services/services/financial-planning-api/liabilities";
import { fetchUserProfileDetails } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { Getpaymentstatus } from "../../../FrappeIntegration-Services/services/payment-api/paymentapiService";
import { getParentUserId } from "../../../common_utilities";
import { Fetchecasdatadetails } from "../../../FrappeIntegration-Services/services/financial-planning-api/externalApi";
import { getMfSummaryPortfolio } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
/* ---------- UTIL ---------- */
const StateBlock = ({ state, show, children }) =>
  state === show ? <>{children}</> : null;

const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  return Number(String(value).replace(/,/g, "")) || 0;
};

/* ---------- COMPONENT ---------- */
export default function MutualFundCard() {
  const MF_CACHE_KEY = `mf_performance_cache_${getUserId()}`;
  const CACHE_TTL_MS = 15 * 60 * 1000;
  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);
  const refreshQueuedRef = useRef(false);
  const actionsMenuRef = useRef(null);

  const [isPaidUser, setIsPaidUser] = useState(false);
  const [paymentChecked, setPaymentChecked] = useState(false);

  const [openModalByName, setOpenModalByName] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mfPerformance, setMfPerformance] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [lowRatedCount, setLowRatedCount] = useState(0);

  const [reportsData, setReportData] = useState({
    PAR: { Link: "", last_generated_Date: "" },
    MF: { Link: "", last_generated_Date: "" },
  });
  let cardState = "filled";

  if (!loading && !mfPerformance) {
    cardState = "empty";
  }

  const BASE_URL = (process.env.REACT_APP_STATIC_URL || "")
  .replace(/\/static\/?$/, "");
  
  const formatUpdatedDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const withTimeout = async (promise, timeoutMs = 20000) => {
    let timeoutId;
    try {
      return await Promise.race([
        promise,
        new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error(`Request timed out after ${timeoutMs}ms`));
          }, timeoutMs);
        }),
      ]);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const parseHoldingDate = (dateStr) => {
    if (!dateStr) return null;
    const normalized = String(dateStr).replace(" ", "T").replace(/(\.\d{3})\d+$/, "$1");
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const fetchMfHoldingMeta = async () => {
    try {
      const payload = {
        data_belongs_to: DATA_BELONGS_TO,
        user_id: getUserId(),
        holding_type: "MF",
      };
      const res = await withTimeout(Fetchexternalholdingdetails(payload), 12000);
      const details = res?.data?.holding_details || [];
      const latestModified = details.reduce((latest, item) => {
        const current = parseHoldingDate(item?.holding_modified_date);
        if (!current) return latest;
        if (!latest) return current;
        return current > latest ? current : latest;
      }, null);
      setLastUpdatedAt(latestModified ? latestModified.getTime() : null);
    } catch (err) {
      console.error("MF holding details API error:", err);
    }
  };

  /* ---------- FETCH MF PERFORMANCE ---------- */
  const fetchMfPerformance = async ({ manual = false } = {}) => {
    if (isFetchingRef.current) {
      if (manual) refreshQueuedRef.current = true;
      return;
    }
    isFetchingRef.current = true;
    try {
      if (isMountedRef.current && (manual || !mfPerformance)) setLoading(true);

      const userId = getUserId();

      const userRes = await withTimeout(fetchUserProfileDetails(userId), 12000);
      if (userRes?.status_code !== 200 || !userRes?.data) {
        return;
      }

      const { user_pan, user_name, mobile } = userRes.data;
      const [summaryData, ecasData] = await Promise.all([
        fetchMfSummaryData(user_pan),
        fetchEcasData(user_pan, user_name, mobile),
      ]);

      if (summaryData?.hasFunds) {
        const formattedData = {
          totalInvested: summaryData?.totalInvested || 0,
          totalCurrentValue: summaryData?.totalCurrentValue || 0,
          oneDayReturn: summaryData?.oneDayReturn || 0,
          oneDayReturnPercentage: summaryData?.oneDayReturnPercentage || 0,
          hasFunds: true,
        };
        const lowRatedCount = ecasData?.lowRatedCount || 0;

        if (isMountedRef.current) {
          setMfPerformance(formattedData);
          setLowRatedCount(lowRatedCount);
        }

        localStorage.setItem(
          MF_CACHE_KEY,
          JSON.stringify({
            data: formattedData,
            lowRatedCount,
            lastFetched: Date.now(),
          })
        );
      } else if (isMountedRef.current) {
        setMfPerformance(null);
        setLowRatedCount(0);
        localStorage.removeItem(MF_CACHE_KEY);
      }

      // Keep this non-blocking so slow holding API does not delay the card.
      fetchMfHoldingMeta();

    } catch (err) {
      console.error("MF Performance API error:", err);
      // Preserve existing cached state on timeout/network errors.
    } finally {
      if (isMountedRef.current) setLoading(false);
      isFetchingRef.current = false;

      // If user clicked refresh while a fetch was already in-flight, run once more.
      if (refreshQueuedRef.current) {
        refreshQueuedRef.current = false;
        fetchMfPerformance({ manual: true });
      }
    }
  };

  const fetchMfSummaryData = async (pan) => {
    try {
      const payload = {
        pan,
        fund_registrar: "all",
        data_belongs_to: DATA_BELONGS_TO,
      };
      const result = await withTimeout(getMfSummaryPortfolio(payload), 25000);
      if (Number(result?.status_code) !== 200) {
        return null;
      }

      const envelope = result?.data?.status_code ? result?.data : result;
      const portfolioData = envelope?.data?.data || envelope?.data || {};
      const summary = portfolioData?.portfolio_summary || {};
      const fundCount =
        Number(summary?.tfunds) || (portfolioData?.fund_list || []).length || 0;

      return {
        totalInvested: toNumber(summary?.tinvested_value),
        totalCurrentValue: toNumber(summary?.tcurr_value),
        oneDayReturn: toNumber(summary?.tone_day_return),
        oneDayReturnPercentage: toNumber(summary?.tone_day_return_percentage),
        hasFunds: fundCount > 0,
      };
    } catch (err) {
      console.error("MF Summary API error:", err);
      return null;
    }
  };

const fetchEcasData = async (pan, username, phone) => {
  try {
    const payload = {
      pan,
      username,
      phone: String(phone),
    };

    const result = await withTimeout(Fetchecasdatadetails(payload), 25000);

    // API shape can be either:
    // 1) { status_code, data: { ... } }
    // 2) { message: { status_code, data: { ... } } }
    const envelope = result?.message?.status_code ? result.message : result;
    const statusCode = String(envelope?.status_code || "");
    const apiData = envelope?.data?.data || envelope?.data;

    if (statusCode !== "200" || !apiData) {
      return null;
    }
    const funds = apiData.mf_name_list || [];

    const count = funds.filter(
      f => Number(f.star_rating) < 3
    ).length;

    return { lowRatedCount: count };

  } catch (err) {
    console.error("ECAS API error:", err);
    return null;
  }
};


  /* ---------- FETCH REPORT LINKS ---------- */
  const fetchReportsData = async () => {
    const userId = getUserId();
    const res = await GetDocumentDetails(
      userId,
      DATA_BELONGS_TO,
      "mf_screening_report,par_report"
    );

    const PAR = res?.data?.find(
      (d) =>
        d.user_document_user_id == userId &&
        d.document_cat_uuid === "par_report"
    );

    const MF = res?.data?.find(
      (d) =>
        d.user_document_user_id == userId &&
        d.document_cat_uuid === "mf_screening_report"
    );

    setReportData({
      PAR: {
        Link: PAR?.document_file_url || "",
        last_generated_Date: PAR?.creation || "",
      },
      MF: {
        Link: MF?.document_file_url || "",
        last_generated_Date: MF?.creation || "",
      },
    });
  };
  const isPlanActive = (expiryDate) => {
  if (!expiryDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(23, 59, 59, 999);

  return expiry >= today;
};


const checkPaymentStatus = async () => {
  try {
    const parentUserId = getParentUserId();

    if (!parentUserId) {
      setIsPaidUser(false);
      return;
    }

    const payload = {
      user_id: parentUserId,
      data_belongs_to: DATA_BELONGS_TO,
    };

    const res = await Getpaymentstatus(payload);

    /**
     * EXPECTED:
     * res.data.plan_expiry_date
     */
    const plan = res?.data;

    if (plan && isPlanActive(plan.plan_expiry_date)) {
      setIsPaidUser(true);
      console.log("Plan is active");
    } else {
      setIsPaidUser(false);
      console.log("Plan expired or not found");
    }
  } catch (err) {
    console.error("Payment check failed", err);
    setIsPaidUser(false);
  } finally {
    setPaymentChecked(true);
  }
};


  /* ---------- EFFECT ---------- */
  useEffect(() => {
    isMountedRef.current = true;

    const init = async () => {
      fetchReportsData();
      checkPaymentStatus();

      const cached = localStorage.getItem(MF_CACHE_KEY);

      if (cached) {
        try {
          const { data, lowRatedCount: cachedLowRatedCount } = JSON.parse(cached);
          const hasFundsInCache =
            data?.hasFunds === true ||
            toNumber(data?.totalCurrentValue) > 0 ||
            toNumber(data?.totalInvested) > 0;

          if (isMountedRef.current && data && hasFundsInCache) {
            setMfPerformance(data); // show cached immediately
            setLowRatedCount(Number(cachedLowRatedCount || 0));
            setLoading(false);
          } else {
            localStorage.removeItem(MF_CACHE_KEY);
          }
        } catch (e) {
          console.error("MF cache parse failed:", e);
        }
      }

      // ALWAYS fetch latest and update cache on every load/reload.
      await fetchMfPerformance();
    };

    init();

    const intervalId = setInterval(() => {
      fetchMfPerformance();
    }, CACHE_TTL_MS);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!isActionsOpen) return;
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(event.target)
      ) {
        setIsActionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isActionsOpen]);



  const closeMfModal = () => setOpenModalByName(null);

  /* ---------- RENDER ---------- */
  return (
    <div className="glass-card tw-rounded-2xl tw-p-6 tw-relative tw-grid tw-items-stretch">
      {/* ================= FILLED STATE ================= */}
      <StateBlock state={cardState} show="filled">
        <div>
          {/* Header */}
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
            <div className="tw-flex tw-items-center tw-space-x-3">
              <div className="tw-w-12 tw-h-12 tw-bg-fintoo-blue tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                <FaChartPie className="tw-text-white tw-text-2xl" />
              </div>
              <div>
                <h2 className="tw-text-base tw-font-semibold tw-text-slate-800 tw-mb-0">
                  Mutual Funds
                </h2>
                <div className="tw-flex tw-items-center tw-gap-1">
                  <p className="tw-text-xs tw-text-slate-500 tw-mb-0">
                    {loading
                      ? "Fetching..."
                      : lastUpdatedAt
                      ? `Updated on ${formatUpdatedDate(lastUpdatedAt)}`
                      : "Updated recently"}
                  </p>
                  {!loading && (
                    <div className="tw-relative tw-group">
                      <button
                        type="button"
                        className="tw-bg-transparent tw-p-0 tw-leading-none tw-text-slate-400 hover:tw-text-slate-600"
                        aria-label="Reconnect info"
                      >
  <FiInfo className="tw-text-slate-600 tw-cursor-pointer tw-ml-0.5 tw-mb-0.5" size={12} />
                      </button>
                      <div className="tw-pointer-events-none tw-absolute tw-left-1/2 tw-top-full tw-z-20 tw-mt-2 tw-w-64 -tw-translate-x-1/2 tw-rounded-md tw-bg-slate-800 tw-text-white tw-text-[11px] tw-leading-snug tw-px-3 tw-py-2 tw-opacity-0 tw-transition-opacity tw-duration-150 group-hover:tw-opacity-100 group-focus-within:tw-opacity-100">
                        If you started a new MF SIP, please reconnect your account to see updated values.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div ref={actionsMenuRef} className="tw-relative tw-flex tw-items-center tw-gap-3">
              
              <button
                onClick={() => setIsActionsOpen((v) => !v)}
                className="tw-flex tw-bg-transparent tw-items-center tw-justify-center tw-h-7 tw-w-7 tw-rounded-md tw-text-slate-500 hover:tw-bg-slate-100 hover:tw-text-slate-700"
                aria-label="Open actions menu"
                title="Actions"
              >
                <FaEllipsisV size={12} />
              </button>

              {isActionsOpen && (
                <div className="tw-absolute tw-right-0 tw-top-7 tw-z-20 tw-w-40 tw-bg-white tw-border tw-border-slate-200 tw-rounded-lg tw-shadow-lg tw-py-1">
                  <button
                    onClick={() => {
                      setIsActionsOpen(false);
                      fetchMfPerformance({ manual: true });
                    }}
                    className="tw-w-full tw-bg-transparent tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 tw-text-xs tw-text-slate-700 hover:tw-bg-slate-50"
                  >
                    <FiRefreshCw size={12} />
                    Refresh
                  </button>
                  <button
                    onClick={() => {
                      setIsActionsOpen(false);
                      setOpenModalByName({
                        name: "MF_Screening",
                        source: "IMPORT",
                      });
                    }}
                    className="tw-w-full tw-bg-transparent tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 tw-text-xs tw-text-slate-700 hover:tw-bg-slate-50"
                  >
                    <FaRedo size={12} />
                    Reconnect
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Current Value */}
          <div className="">
            <p className="tw-text-xs tw-text-slate-500 tw-mb-1">Current Value</p>
            <div className="tw-flex tw-items-baseline tw-space-x-2">
              <p className="tw-text-3xl tw-font-bold tw-text-slate-900 tw-mb-0">
                {indianRupeeFormat(mfPerformance?.totalCurrentValue || 0)}
              </p>
            </div>
          </div>

          <div className="tw-border-t tw-border-slate-200 tw-my-3"></div>

          {/* Bottom Stats */}
          <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-text-sm">
            <div>
              <p className="tw-text-xs tw-text-slate-500 tw-mb-1">Invested Value</p>
              <p className="tw-font-semibold">
                {indianRupeeFormat(mfPerformance?.totalInvested || 0)}
              </p>
            </div>

            <div className="tw-text-right">
              <p className="tw-text-xs tw-text-slate-500 tw-mb-1">1 Day Return</p>
              <p
                className={`tw-font-semibold  ${mfPerformance?.oneDayReturn < 0 ? "!tw-text-red-600" : "!tw-text-green-600"}`}
              >
                {`${(mfPerformance?.oneDayReturn || 0) > 0 ? "+ " : (mfPerformance?.oneDayReturn || 0) < 0 ? "- " : ""}${indianRupeeFormat(Math.abs(mfPerformance?.oneDayReturn || 0))} (${(mfPerformance?.oneDayReturnPercentage || 0) < 0 ? "-" : ""}${Math.abs(mfPerformance?.oneDayReturnPercentage || 0).toFixed(1)}%)`}

              </p>
            </div>


          </div>
          {!loading && mfPerformance && (
            <div className="tw-mt-4 tw-bg-gradient-to-r tw-from-orange-50 tw-to-orange-100 tw-border tw-border-orange-200 tw-rounded-lg tw-p-3 tw-flex tw-items-start tw-space-x-3">
              <div className="tw-flex-shrink-0">
                <FaCrown className="tw-text-orange-500 tw-text-lg -tw-mt-1.5" />
              </div>

              <div className="tw-flex-1">
                <p className="tw-text-sm tw-text-slate-800 tw-mb-0">
                  {lowRatedCount > 0 ? (
                    <span>
                      {lowRatedCount} fund{lowRatedCount > 1 ? "s are" : "is"} underperforming.
                     Your portfolio needs urgent attention.
                    </span>
                  ) : (
                    <span>
                      Your mutual fund portfolio looks healthy. Keep monitoring performance regularly.
                    </span>
                  )}
                </p>

                {isPaidUser && reportsData?.MF?.Link && (
                  <a
                    href={reportsData.MF.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-inline-flex tw-items-center tw-text-xs tw-font-semibold tw-mt-1 tw-transition-colors tw-text-fintoo-orange hover:tw-text-orange-700"
                  >
                    <FaDownload className="tw-mr-2" />
                    Download report
                  </a>
                )}
                {!isPaidUser && (
                  <a
                    href={`${BASE_URL}/personal-financial-planning`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-inline-flex tw-items-center tw-text-xs tw-font-semibold tw-mt-2 tw-text-fintoo-orange hover:tw-text-orange-700"
                  >
                    Book a complimentary call with expert to know how.
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </StateBlock>

      {/* ================= EMPTY STATE ================= */}
      <StateBlock state={cardState} show="empty">
        <div>
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
            <div className="tw-flex tw-items-center tw-space-x-3">
              <div className="tw-w-12 tw-h-12 tw-bg-fintoo-blue tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                <FaChartPie className="tw-text-white tw-text-2xl" />
              </div>
              <div>
                <h2 className="tw-text-base tw-font-semibold tw-mb-0 tw-pb-0">Mutual Funds</h2>
                <p className="tw-text-xs tw-text-slate-500 tw-mb-0">
                  Portfolio Summary
                </p>
              </div>
            </div>

            <button
               onClick={() =>
                  setOpenModalByName({
                    name: "MF_Screening",
                    source: "IMPORT",
                  })
                }
              className="tw-bg-fintoo-orange tw-text-white tw-text-xs tw-font-semibold tw-py-2 tw-px-4 tw-rounded-lg"
            >
              <FaDownload className="tw-mr-2" />
              Import
            </button>
          </div>

          <div className="tw-text-center tw-mb-6">
            <p className="tw-text-xs tw-text-slate-500 tw-mb-1">Current Value</p>
            <p className="tw-text-3xl tw-font-bold">₹0</p>
            <p className="tw-text-sm tw-text-slate-400">
              No data available
            </p>
          </div>

          <div className="tw-border-t tw-border-slate-200 tw-my-4"></div>

          <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded-lg tw-p-4 tw-flex tw-space-x-3">
            <FaRobot className="tw-text-fintoo-blue tw-text-2xl" />
            <div>
              <p className="tw-text-sm tw-mb-0">
                My analysis shows no active Mutual Fund data yet.
              </p>
              <button
                onClick={() =>
                  setOpenModalByName({
                    name: "MF_Screening",
                    source: "IMPORT",
                  })
                }
                className="tw-text-blue-600 tw-text-xs tw-font-semibold tw-mt-2 tw-bg-transparent"
              >
                <FaDownload className="tw-mr-2" />
                Import Mutual Fund Portfolio
              </button>
            </div>
          </div>
        </div>
      </StateBlock>

      {/* ================= MODAL ================= */}
      <MFReportModal
        open={openModalByName?.name === "MF_Screening"}
        source={openModalByName?.source}
        CloseMfModal={closeMfModal}
        setOpenModalByName={setOpenModalByName}
        fetchReportsData={fetchReportsData}
      // fetchMfSummary={fetchMfSummary}
      />
    </div>
  );
}
