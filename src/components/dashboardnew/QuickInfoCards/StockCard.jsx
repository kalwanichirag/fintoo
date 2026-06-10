import React, { useEffect, useRef, useState } from "react";
import { FaChartLine, FaDownload, FaRobot, FaCrown, FaEllipsisV } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";


import Nsdlcsdl from "../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/Nsdlcsdl";
import { GenerateParSnippet } from
  "../../../FrappeIntegration-Services/services/External-api/externalApi";
import { saveScreenReport } from "../../../Services/ReportService";
import { fetchUserProfileDetails } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { Getpaymentstatus } from "../../../FrappeIntegration-Services/services/payment-api/paymentapiService";
import {
  getUserId,
  getParentUserId,
  getItemLocal,
} from "../../../common_utilities";
import { DATA_BELONGS_TO } from "../../../constants";
import { getOtherInvestments } from
  "../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { Fetchexternalholdingdetails } from "../../../FrappeIntegration-Services/services/financial-planning-api/liabilities";
import { useSelector } from "react-redux";
import FintooLoader from "../../FintooLoader";


const StateBlock = ({ state, show, children }) =>
  show === state ? <>{children}</> : null;

const formatCompactAmountIN = (value) => {
  const amount = Number(value) || 0;
  const abs = Math.abs(amount);
  const trim = (num) => num.toFixed(2).replace(/\.?0+$/, "");

  if (abs >= 10000000) {
    return `${trim(abs / 10000000)}CR`;
  }
  if (abs >= 100000) {
    return `${trim(abs / 100000)}L`;
  }
  return abs.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

export default function StockCard({ state }) {
  const STOCK_CACHE_KEY = `stock_summary_cache_${getParentUserId()}_${getUserId()}_${getItemLocal("family") ? "family" : "personal"}`;
  const CACHE_TTL_MS = 15 * 60 * 1000;

  const nsdlRef = useRef(null);
  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);
  const actionsMenuRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [paymentChecked, setPaymentChecked] = useState(false);
  const [parGenerating, setParGenerating] = useState(false);

  const [stockSummary, setStockSummary] = useState({
    hasStocks: false,
    currentValue: 0,
    investedValue: 0,
    totalreturn: 0,
    stockCount: 0,
  });
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const BASE_URL = (process.env.REACT_APP_STATIC_URL || "")
    .replace(/\/static\/?$/, "");

  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const openImportModal = () => {
    nsdlRef.current?.openModal();
  };

  const formatUpdatedDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const parseHoldingDate = (dateStr) => {
    if (!dateStr) return null;
    const normalized = String(dateStr).replace(" ", "T").replace(/(\.\d{3})\d+$/, "$1");
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const fetchStockHoldingMeta = async () => {
    try {
      const payload = {
        data_belongs_to: DATA_BELONGS_TO,
        user_id: getUserId(),
        holding_type: "Stocks",
      };
      const res = await Fetchexternalholdingdetails(payload);
      const details = res?.data?.holding_details || [];
      const latestModified = details.reduce((latest, item) => {
        const current = parseHoldingDate(item?.holding_modified_date);
        if (!current) return latest;
        if (!latest) return current;
        return current > latest ? current : latest;
      }, null);
      setLastUpdatedAt(latestModified ? latestModified.getTime() : null);
    } catch (err) {
      console.error("Stock holding details API error", err);
      setLastUpdatedAt(null);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    const init = async () => {
      let hasCachedData = false;
      const cached = localStorage.getItem(STOCK_CACHE_KEY);

      if (cached) {
        try {
          const { data } = JSON.parse(cached);
          if (isMountedRef.current && data) {
            setStockSummary(data); // fast paint from cache
            setLoading(false);
            setHasFetchedOnce(true);
            hasCachedData = true;
          }
        } catch (err) {
          console.error("Stock cache parse failed", err);
        }
      }

      // Always refresh from API, even when cache exists.
      await fetchStockData({ showLoader: !hasCachedData });
    };

    init();

    const intervalId = setInterval(() => {
      fetchStockData({ showLoader: false });
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


  const fetchStockData = async ({ showLoader = true } = {}) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      if (isMountedRef.current && showLoader) setLoading(true);

      const parentUserId = getParentUserId();
      const currentUserId = getUserId();

      if (!parentUserId) {
        const emptySummary = {
          hasStocks: false,
          currentValue: 0,
          investedValue: 0,
          totalreturn: 0,
          stockCount: 0,
        };
        if (isMountedRef.current) setStockSummary(emptySummary);
        return;
      }

      let payload = {};
      if (getItemLocal("family")) {
        payload = {
          user_id: String(parentUserId),
          data_belongs_to: DATA_BELONGS_TO,
        };
      } else {
        payload = {
          user_id: String(parentUserId),
          user_asset_for: currentUserId ? String(currentUserId) : "",
        };
      }

      const res = await getOtherInvestments(payload);



      const listing = res.data?.listing || [];
      const categoryList = res.data?.category_list || [];

      const stocks = listing.filter(
        (asset) =>
          asset.asset_name_uuid === "equity" &&
          asset.asset_sub_name_uuid === "equity_shares" &&
          asset.user_asset_source === "External"
      );
      console.log(stocks, "stocks");

      if (!stocks.length) {
        const emptySummary = {
          hasStocks: false,
          currentValue: 0,
          investedValue: 0,
          totalreturn: 0,
          stockCount: 0,
        };

        if (isMountedRef.current) setStockSummary(emptySummary);
        localStorage.setItem(
          STOCK_CACHE_KEY,
          JSON.stringify({
            data: emptySummary,
            lastFetched: Date.now(),
          })
        );
        await fetchStockHoldingMeta();
        return;
      }

      const investedValue = stocks.reduce(
        (sum, s) => sum + Number(s.user_asset_investment_amount || 0),
        0
      );

      const currentValue = stocks.reduce(
        (sum, s) => sum + Number(s.user_asset_current_amount || 0),
        0
      );

      const totalreturn =
        investedValue > 0
          ? ((currentValue - investedValue) / investedValue) * 100
          : 0;


      const summary = {
        hasStocks: true,
        currentValue,
        investedValue,
        totalreturn,
        stockCount: stocks.length,
      };

      if (isMountedRef.current) setStockSummary(summary);

      localStorage.setItem(
        STOCK_CACHE_KEY,
        JSON.stringify({
          data: summary,
          lastFetched: Date.now(),
        })
      );
      await fetchStockHoldingMeta();




    } catch (err) {
      console.error("StockCard API error", err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setHasFetchedOnce(true);
      }
      isFetchingRef.current = false;
    }
  };
  const generateStockParReport = async (parReportData) => {
    try {
      const userId = getUserId();

      const userRes = await fetchUserProfileDetails(userId);
      if (userRes?.status_code !== 200 || !userRes?.data) {
        throw new Error("Unable to fetch user profile");
      }

      const { user_pan, user_name, mobile, user_email } = userRes.data;

      const payload = {
        ...parReportData,
        investment_type: 1,
        user_id: userId,
        pan: user_pan,
        name: user_name,
        mobile: mobile,
        email: user_email,
        data_belongs_to: DATA_BELONGS_TO,
      };

      const res = await GenerateParSnippet(payload);

      if (res?.status_code !== "200" || !res?.data) {
        throw new Error("Stock PAR generation failed");
      }

      const pdfUrl = res.data.pdf_snippet;
      const pdfWhatsapp = res.data.pdf_snippet_wa;
      const stockValue =
        res.data.stock_holding_data?.total_current_value || 0;

      saveScreenReport(
        parReportData.user_id,
        "PAR",
        stockValue,
        pdfWhatsapp
      );

      return { pdfUrl, stockValue };
    } catch (err) {
      console.error("Stock PAR Report Error:", err);
      throw err; // let caller handle UI/alerts
    }
  };

  const parReportData = useSelector(
    (state) => state.par_report_data
  );


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
        console.log("Stock: plan active");
      } else {
        setIsPaidUser(false);
        console.log("Stock: plan expired or inactive");
      }
    } catch (err) {
      console.error("Stock payment check failed", err);
      setIsPaidUser(false);
    } finally {
      setPaymentChecked(true);
    }
  };

  const handleBoostReturnsClick = async () => {
    if (!paymentChecked || parGenerating) return;

    if (!isPaidUser) {
      window.location.href = "/pricing";
      return;
    }

    try {
      setParGenerating(true); // 🔥 START LOADING IMMEDIATELY

      const { pdfUrl } = await generateStockParReport(parReportData);

      window.open(pdfUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("Unable to generate stock report");
    } finally {
      setParGenerating(false); // 🔥 STOP LOADING
    }
  };


  useEffect(() => {
    checkPaymentStatus();
  }, []);

  let displayState = "filled";

  if (!loading && hasFetchedOnce && !stockSummary.hasStocks) {
    displayState = "empty";
  }

  return (
    <>
      {/* STOCK FILLED */}
      <StateBlock state={displayState} show="filled">
        <div
          id="stock-card-filled"
          className="glass-card tw-rounded-2xl tw-p-4 md:tw-p-6 tw-relative tw-grid tw-items-stretch"
        >
          {loading && (
            <div className="tw-absolute tw-inset-0 tw-bg-white/70 tw-flex tw-items-center tw-justify-center tw-z-50 tw-rounded-2xl">
              <FintooLoader />
            </div>
          )}
          <div>
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-4 md:tw-mb-6">
              <div className="tw-flex tw-items-center tw-space-x-3">
                <div className="tw-w-11 tw-h-11 md:tw-w-12 md:tw-h-12 tw-bg-fintoo-blue tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                  <FaChartLine className="tw-text-white tw-text-xl md:tw-text-2xl" />
                </div>
                <div>
                  <h2 className="tw-text-base tw-font-semibold tw-text-slate-800 tw-mb-0 tw-pb-0">
                    Stocks
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
                          Reconnect to view the updated stock values.
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
                        openImportModal();
                      }}
                      className="tw-w-full tw-bg-transparent tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 tw-text-xs tw-text-slate-700 hover:tw-bg-slate-50"
                    >
                      Fetch Holdings
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="tw-mb-0">
              <p className="tw-text-xs tw-text-slate-500 tw-mb-1">
                Current Value

              </p>
              <div className="tw-flex tw-items-center tw-justify-between">
                <p className="tw-text-2xl tw-font-bold tw-text-slate-900 tw-mb-0">
                  ₹{formatCompactAmountIN(stockSummary.currentValue)}
                </p>
              </div>

            </div>



            <div className="tw-border-t tw-border-slate-200 tw-my-3"></div>



            <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-text-sm tw-items-start">
              <div>
                <p className="tw-text-xs tw-text-slate-500 tw-mb-1">Invested Value</p>
                <p className="tw-font-semibold tw-tabular-nums tw-leading-tight">
                  ₹{formatCompactAmountIN(stockSummary.investedValue)}
                </p>
              </div>

              <div className="tw-text-right">
                <p className="tw-text-xs tw-text-slate-500 tw-mb-1">Total Returns</p>
                <p
                  className={`tw-font-semibold tw-tabular-nums tw-leading-tight ${stockSummary?.totalreturn < 0 ? "!tw-text-red-600" : "!tw-text-green-600"}`}
                >
                  {stockSummary?.totalreturn.toLocaleString("en-IN") || 0}%

                </p>
              </div>
            </div>

            {!loading && !isPaidUser && (
              <div className="tw-mt-4 tw-bg-gradient-to-r tw-from-orange-50 tw-to-orange-100 tw-border tw-border-orange-200 tw-rounded-lg tw-p-3 tw-flex tw-items-start tw-space-x-3">
                <div className="tw-flex-shrink-0">
                  <FaCrown className="tw-text-fintoo-orange tw-text-lg tw-mb-2" />
                </div>

                <div className="tw-flex-1">
                  <p className="tw-text-sm tw-text-slate-800 tw-mb-0 tw-pb-0">
                    Your portfolio needs urgent attention.
                  </p>

                  <a
                    href={`${BASE_URL}/personal-financial-planning`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-inline-flex tw-items-center tw-text-xs tw-font-semibold tw-mt-0 tw-text-fintoo-orange hover:tw-text-orange-700"
                  >
                    Book a complimentary call with expert to know how.
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </StateBlock>

      {/* STOCK EMPTY */}
      <StateBlock state={displayState} show="empty">
        <div
          id="stock-card-empty"
          className="glass-card tw-rounded-2xl tw-p-4 md:tw-p-6 tw-relative tw-grid tw-items-stretch"
        >
          {loading && (
            <div className="tw-absolute tw-inset-0 tw-bg-white/70 tw-flex tw-items-center tw-justify-center tw-z-50 tw-rounded-2xl">
              <FintooLoader />
            </div>
          )}
          <div>
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-4 md:tw-mb-6">
              <div className="tw-flex tw-items-center tw-space-x-3">
                <div className="tw-w-11 tw-h-11 md:tw-w-12 md:tw-h-12 tw-bg-fintoo-blue tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                  <FaChartLine className="tw-text-white tw-text-xl md:tw-text-2xl" />
                </div>
                <div>
                  <h2 className="tw-text-base tw-font-semibold tw-text-slate-800 tw-mb-0">
                    Stocks
                  </h2>
                  <p className="tw-text-xs tw-text-slate-500 tw-mb-0">
                    Portfolio Summary
                  </p>
                </div>
              </div>

              <button
                onClick={openImportModal}
                className="tw-bg-fintoo-orange tw-text-white tw-text-xs tw-font-semibold tw-py-2 tw-px-4 tw-rounded-lg"
              >
                <FaDownload className="tw-mr-2" />
                Import
              </button>
            </div>

            <div className="tw-mb-6 tw-text-center">
              <p className="tw-text-xs tw-text-slate-500 tw-mb-1">
                Current Value
              </p>
              <div className="tw-flex tw-flex-col tw-items-center">
                <p className="tw-text-3xl tw-font-bold tw-text-slate-900">
                  ₹0
                </p>
                <span className="tw-text-slate-400 tw-text-sm">
                  No data available
                </span>
              </div>
            </div>

            <div className="tw-border-t tw-border-slate-200 tw-my-4"></div>
          </div>

          <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded-lg tw-p-4 tw-flex tw-space-x-3">
            <FaRobot className="tw-text-fintoo-blue tw-text-3xl" />
            <div>
              <p className="tw-text-sm tw-mb-0">

                Please import your stock data to start tracking live
                performance.
              </p>
              <button
                onClick={openImportModal}
                className="tw-text-blue-600 tw-text-xs tw-font-semibold tw-mt-2 tw-bg-transparent"
              >
                <FaDownload className="tw-mr-2" />
                Import Stock Portfolio
              </button>
            </div>
          </div>
        </div>

      </StateBlock>

      {/* MODAL */}
      <Nsdlcsdl
        hideParIntro={false}
        ref={nsdlRef}
        hideDematTab={false}
        fromStockCard={true}
        onLinkedSuccess={() => {
          fetchStockData({ showLoader: false });
        }}
      />
    </>
  );
}
