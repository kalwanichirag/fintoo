import React, { useState, useEffect, useCallback } from "react";
import { FaCreditCard, FaChartLine } from "react-icons/fa";
import { getLiabilityDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/liabilities";
import { getUserId } from "../../common_utilities";

const formatInr = (value) => `₹${Number(value || 0).toLocaleString()}`;

const getTotalLoanAmount = (item = {}) => {
  const candidates = [
    item.user_liability_total_amount,
    item.user_liability_loan_amount,
    item.user_liability_amount,
    item.user_liability_sanctioned_amount,
    item.user_liability_disbursed_amount,
    item.liability_total_amount,
    item.liability_amount,
    item.total_loan_amount,
    item.loan_amount,
  ];

  const amount = candidates.find((value) => Number(value) > 0);
  return Number(amount) > 0 ? Number(amount) : null;
};

export default function LiabilityOverview() {
  const CACHE_KEY = "LIABILITY_OVERVIEW_CACHE";
  const TODAY = new Date().toDateString();
  const REFRESH_EVENT = "liability-overview-refresh";
  const [state, setState] = useState("loading");
  const [liabilities, setLiabilities] = useState([]);
  const userId = getUserId();

  const totalOutstanding = (liabilities || []).reduce(
    (sum, item) => sum + (item?.user_liability_outstanding_amount || 0),
    0
  );


  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setState("loading");

      if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY);

        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.date === TODAY) {
            setLiabilities(parsed.data);
            setState(parsed.data.length ? "filled" : "empty");
            return;
          }
        }
      }

      // ✅ Otherwise fetch fresh data
      const response = await getLiabilityDetails(userId);

      const list = Array.isArray(response?.data)
        ? response.data
        : [];

      if (list.length > 0) {
        setLiabilities(list);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            date: TODAY,
            data: list,
          })
        );

        setState("filled");
      } else {
        setLiabilities([]);
        localStorage.removeItem(CACHE_KEY);
        setState("empty");
      }
    } catch (error) {
      console.error("Error fetching liabilities:", error);
      setState("empty");
    }
  }, [CACHE_KEY, TODAY, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchData(true);
    };

    window.addEventListener(REFRESH_EVENT, handleRefresh);
    return () => {
      window.removeEventListener(REFRESH_EVENT, handleRefresh);
    };
  }, [fetchData, REFRESH_EVENT]);


  return (
    <div className="">
      {/* Header */}
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
        <div>
          <h2 className="tw-text-xl tw-font-bold tw-text-slate-800 tw-mb-1">
            Liability Overview
          </h2>
          <p className="tw-text-slate-500 tw-text-sm tw-mb-0">
            Outstanding Debts & EMIs
          </p>
        </div>

        {totalOutstanding > 0 && (
          <div className="tw-text-right">
            <p className="tw-text-xs tw-text-slate-400 tw-mb-1">Total Outstanding</p>
            <p className="tw-font-bold tw-text-lg tw-text-slate-900 tw-mb-0">
              ₹{totalOutstanding.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {state === "loading" && (
        <div className="tw-absolute tw-inset-0 tw-bg-white/80 tw-backdrop-blur-sm tw-flex tw-flex-col tw-items-center tw-justify-center tw-rounded-2xl">
          <FaChartLine className="tw-animate-spin tw-fintoo-blue tw-text-2xl tw-mb-3" />
          <p className="tw-text-slate-700 tw-font-medium">
            Connecting your liabilities...
          </p>
        </div>
      )}

{state === "locked" && ( <div className="">
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
        <div>
          <h2 className="tw-text-xl tw-font-bold tw-text-slate-900 tw-mb-1">
            Liability Overview
          </h2>
          <p className="tw-text-slate-500 tw-text-sm tw-mb-0">
            Outstanding Debts & EMIs
          </p>
        </div>
      </div>

      <div className="tw-relative tw-rounded-xl tw-border tw-border-dashed tw-border-slate-300 tw-bg-slate-50 tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-12 tw-text-center">
        <div className="tw-bg-slate-200 tw-w-16 tw-h-16 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-mb-4">
          <FaLock className="tw-text-slate-700 tw-text-2xl" />
        </div>
        <h3 className="tw-text-lg tw-font-semibold tw-text-slate-800 tw-mb-2 tw-pb-0">
          Coming Soon
        </h3>
        <p className="tw-text-slate-600 tw-text-sm tw-max-w-xs tw-mx-auto tw-mb-0">
          Liability Overview will be available soon.
        </p>
      </div>
    </div> )}
    
      {state === "empty" && (
        <div className="tw-relative tw-rounded-xl  tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-12 tw-text-center">
          <div className="tw-bg-fintoo-blue tw-w-16 tw-h-16 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-mb-4">
            <FaCreditCard className="tw-text-white tw-text-xl" />
          </div>

          <h3 className="tw-text-lg tw-font-semibold tw-text-slate-800 tw-mb-2 tw-pb-0">
            Liability Overview Locked
          </h3>

          <p className="tw-text-slate-600 tw-text-sm tw-max-w-xs tw-mx-auto tw-mb-4">
            Connect your cibil to fetch credit cards, loans, and EMIs and unlock real-time
            insights and smart repayment suggestions.
          </p>

          {/* <button
            onClick={fetchData}
            className="tw-bg-fintoo-blue tw-text-white tw-px-6 tw-py-3 tw-rounded-lg tw-font-semibold  tw-transition tw-flex tw-items-center tw-gap-2"
          >
            <FaCreditCard /> Connect Now
          </button> */}
        </div>
      )}

      {state === "filled" && (
       <div className="
  tw-space-y-4
  tw-mt-6
  tw-max-h-[540px]
  tw-overflow-y-auto
  force-scrollbar
">
          {liabilities.map((item) => {
            const outstandingAmount = Number(item.user_liability_outstanding_amount || 0);
            const totalLoanAmount = getTotalLoanAmount(item);
            const hasRepaymentView =
              Number(totalLoanAmount) > 0 && totalLoanAmount >= outstandingAmount;
            const paidAmount = hasRepaymentView
              ? Math.max(totalLoanAmount - outstandingAmount, 0)
              : 0;
            const paidPercent = hasRepaymentView
              ? ((paidAmount / totalLoanAmount) * 100).toFixed(1)
              : 0;
            const outstandingPercent = hasRepaymentView
              ? ((outstandingAmount / totalLoanAmount) * 100).toFixed(1)
              : 0;

            return (
              <div
                key={item.user_liability_id}
                className="tw-bg-slate-50 tw-rounded-2xl tw-p-5 tw-shadow-sm hover:tw-shadow-md tw-transition"
              >
                <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
                  <div className="tw-flex tw-items-center tw-gap-3">
                    <div className="tw-bg-slate-200 tw-p-2 tw-rounded-xl">
                      <FaCreditCard className="tw-text-slate-700" />
                    </div>

                    <div>
                      <h3 className="tw-font-semibold tw-text-slate-800  tw-text-base tw-mb-1 tw-pb-0">
                        {item.user_liability_name}
                      </h3>
                      
                    </div>
                  </div>

                  <div className="tw-text-right">
                    <p className="tw-font-bold tw-text-slate-900 tw-mb-0">
                      {formatInr(outstandingAmount)}
                    </p>
                    <p className="tw-text-[11px] tw-text-slate-500 tw-mb-0">
                      Outstanding
                      {totalLoanAmount ? ` of ${formatInr(totalLoanAmount)}` : ""}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                {/* <div className="tw-w-full tw-bg-slate-200 tw-h-2 tw-rounded-full tw-mb-2">
                  <div
                    className="tw-bg-slate-700 tw-h-2 tw-rounded-full"
                    style={{ width: `${hasRepaymentView ? paidPercent : 0}%` }}
                  />
                </div>

                <p className="tw-text-xs tw-text-slate-500 tw-mb-3 tw-flex tw-items-center tw-gap-1">
                  <FaChartLine />
                  {hasRepaymentView
                    ? `Paid ${formatInr(paidAmount)} (${paidPercent}%), Outstanding ${outstandingPercent}%`
                    : "Loan amount not available. Showing outstanding only."}
                </p> */}

                <div className="tw-flex tw-justify-between tw-text-sm tw-text-slate-600">
                  <span className="tw-flex tw-items-center tw-gap-1">
                    EMI: {formatInr(item.user_liability_emi_amount)}
                  </span>

                  <span className="tw-flex tw-items-center tw-gap-1">
                    {item.user_liability_emi_rate || 0}% Interest
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
