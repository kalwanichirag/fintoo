import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import {
  FaArrowUp,
  FaArrowDown,
  FaArrowRight,
  FaExclamationTriangle,
  FaLink,
  FaChartPie,
  FaUniversity,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import commonEncode from "../../commonEncode";
import { getUserId } from "../../common_utilities";

import {
  fetchTrackedBankDetails as fetchTrackedBankDetailsFun,
  financialOverview,
  getCategoryList,
} from "../../FrappeIntegration-Services/services/money-management-api/moneyManagementService";

/* -------------------------------------- */
const EXPENSE_COLORS = [
  "#EF4444",
  "#3B82F6",
  "#F59E0B",
  "#8B5CF6",
  "#10B981",
  "#EC4899",
  "#14B8A6",
  "#6366F1",
  "#22C55E",
  "#F97316",
];

const CACHE_KEY = "FINANCIAL_OVERVIEW_CACHE";
const TODAY = new Date().toDateString();
/* -------------------------------------- */

const statusStyles = {
  UP: {
    bg: "tw-bg-green-50 tw-border-green-100",
    text: "tw-text-green-600",
    icon: <FaArrowUp className="tw-mr-1" />,
  },
  DOWN: {
    bg: "tw-bg-red-50 tw-border-red-100",
    text: "tw-text-red-600",
    icon: <FaArrowDown className="tw-mr-1" />,
  },
  NO_CHANGE: {
    bg: "tw-bg-gray-100 tw-border-gray-200",
    text: "tw-text-gray-500",
    icon: <FaArrowRight className="tw-mr-1" />,
  },
  ALERT: {
    bg: "tw-bg-orange-50 tw-border-orange-100",
    text: "tw-text-orange-600",
    icon: <FaExclamationTriangle className="tw-mr-1" />,
  },
};

/* -------------------------------------- */
const StatCard = ({
  label,
  value,
  meta,
  change,
  status,
  comment,
  link,
  ctaText,
}) => {
  const style = statusStyles[status] || statusStyles.NO_CHANGE;
  const Wrapper = link ? Link : React.Fragment;
  const wrapperProps = link ? { to: link } : {};

  return (
    <Wrapper {...wrapperProps}>
      <div
        className={`tw-p-3 md:tw-p-4 tw-rounded-xl tw-border ${style.bg} ${link ? "hover:tw-shadow-md tw-cursor-pointer tw-transition" : ""
          }`}
      >
        {label && (
          <p className="tw-text-xs tw-text-slate-500 tw-mb-1">{label}</p>
        )}

        <h3 className="tw-text-lg tw-font-bold tw-text-slate-800 tw-pb-0">
          ₹{Number(value ?? 0).toLocaleString("en-IN")}
        </h3>

        {meta && (
          <div className="tw-inline-flex tw-items-center tw-gap-1 tw-mt-1 tw-px-2 tw-py-1 tw-rounded-full tw-bg-slate-100 tw-text-slate-600 tw-text-[11px] tw-font-medium">
            <FaUniversity className="tw-text-[10px]" />
            <span>{meta}</span>
          </div>
        )}

        {(typeof change === "number" || comment) && (
          <p
            className={`${style.text} tw-text-xs tw-font-semibold tw-flex tw-items-center tw-mt-1 tw-mb-1`}
          >
            {style.icon}
            {typeof change === "number" && <span>{Math.abs(change)}%</span>}
            {comment && <span>{comment}</span>}
          </p>
        )}

        {ctaText && (
          <div className="tw-mt-1">
            <span className="tw-text-xs tw-font-semibold tw-text-fintoo-blue">
              {ctaText} →
            </span>
          </div>
        )}
      </div>
    </Wrapper>
  );
};
/* -------------------------------------- */

const StateBlock = ({ state, show, children }) =>
  show === state ? <>{children}</> : null;

const EmptyFinancialOverview = () => (
  <>
    <div class="tw-flex tw-items-center tw-justify-between tw-mb-6">
      <div><h2 class="tw-text-xl tw-font-bold tw-text-slate-800 tw-mb-0">Financial Overview</h2><p class="tw-text-slate-500 tw-text-sm tw-mb-0">Smart money snapshot</p></div><a href="/money-management/bank-tracking-overview"><div class="tw-bg-fintoo-blue tw-text-white tw-text-xs tw-font-semibold tw-py-2 tw-px-4 tw-rounded-lg tw-flex tw-items-center">
        <FaLink className="tw-mr-2" />    Link other banks</div></a></div>
    <div className="tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-py-12">
      <div className="tw-w-16 tw-h-16 tw-rounded-full tw-bg-fintoo-blue tw-flex tw-items-center tw-justify-center tw-mb-3">
        <FaChartPie className="tw-text-white tw-text-2xl" />
      </div>
      <h3 className="tw-text-lg tw-font-semibold tw-text-slate-800 tw-pb-0" >
        Your money overview is empty
      </h3>
      <p className="tw-text-sm tw-text-slate-500 tw-max-w-xs tw-mb-4">
        Track income, expenses and savings by connecting your bank account.
      </p>
      <Link to="/money-management/bank-tracking-overview">
        <div className="tw-bg-fintoo-blue tw-text-white tw-text-sm tw-font-semibold tw-py-2.5 tw-px-6 tw-rounded-lg tw-flex tw-items-center">
          <FaLink className="tw-mr-2" />
          Connect Bank Account
        </div>
      </Link>
    </div>
  </>
);

/* ====================================== */
/* MAIN COMPONENT */
/* ====================================== */

export default function FinancialOverview({ state = "filled" }) {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [expenseBreakup, setExpenseBreakup] = useState([]);
  const [bankSummary, setBankSummary] = useState({ totalBalance: 0, totalAccounts: 0 });
  const [linkedBanks, setLinkedBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const getMemberIdFn = () => {
    try {
      const member = localStorage.getItem("member");
      if (!member) return [];
      if (!localStorage.getItem("family")) return [getUserId()];
      return JSON.parse(commonEncode.decrypt(member)).map((u) => String(u.id));
    } catch {
      return [getUserId()];
    }
  };

  /* -------- LOAD DATA (CACHED) -------- */
  useEffect(() => {
    if (state !== "filled") return;

    let hadFreshCache = false;
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.date === TODAY) {
          setDashboardStats(parsed.dashboardStats);
          setExpenseBreakup(parsed.expenseBreakup);
          setBankSummary(parsed.bankSummary);
          setLinkedBanks(parsed.linkedBanks || []);
          setLoading(false);
          hadFreshCache = true;
        }
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    const loadData = async () => {
      try {
        if (!hadFreshCache) setLoading(true);

        const userIds = getMemberIdFn();

        const bankRes = await fetchTrackedBankDetailsFun({ user_id: userIds });
        const trackedAccounts = Array.isArray(bankRes?.data)
          ? bankRes.data
          : Array.isArray(bankRes?.data?.accounts)
            ? bankRes.data.accounts
            : Array.isArray(bankRes?.data?.results)
              ? bankRes.data.results
              : [];
        const bankLogos = trackedAccounts
          .filter((acc) => Boolean(acc?.mm_bank_logo))
          .map((acc) => ({
            key: acc?.name || acc?.mm_account_masked_id || Math.random(),
            logo: acc.mm_bank_logo,
            bankName: acc.mm_fip_name || "Bank",
          }));

        let totalBalance = 0;
        const bankAccounts = [];

        trackedAccounts.forEach((acc) => {
          totalBalance += Number(acc.mm_total_balance || 0);
          bankAccounts.push(acc.mm_account_masked_id);
        });

        const categoryRes = await getCategoryList();
        const categoryMap = categoryRes?.data?.expense_cat || {};

        if (!bankAccounts.length) {
          setDashboardStats(null);
          setExpenseBreakup([]);
          setBankSummary({ totalBalance, totalAccounts: trackedAccounts.length });
          setLinkedBanks([]);
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              date: TODAY,
              dashboardStats: null,
              expenseBreakup: [],
              bankSummary: { totalBalance, totalAccounts: trackedAccounts.length },
              linkedBanks: [],
            })
          );
          return;
        }

        const overviewRes = await financialOverview({
          user_id: userIds,
          bank_accounts: bankAccounts,
        });

        if (overviewRes?.status_code !== 200) return;

        const { current_period, growth_percentage } = overviewRes.data;

        const stats = {
          bankBalance: {
            label: "Total Bank Balance",
            value: totalBalance,
            link: "/money-management/overview",
            ctaText: "View account details",
          },
          income: {
            label: "Total Income",
            value: current_period.income,
            change: growth_percentage.income_growth,
            comment: " from last month",
            status: growth_percentage.income_growth >= 0 ? "UP" : "DOWN",
            link: "/money-management/map-transactions?type=income",
          },
          expenses: {
            label: "Total Expenses",
            value: current_period.expense,
            change: growth_percentage.expense_growth,
            comment: " vs last month",
            status: growth_percentage.expense_growth >= 0 ? "DOWN" : "UP",
            link: "/money-management/map-transactions?type=expense",
          },
          savings: {
            label: "Net Cash Flow",
            value: current_period.savings,
            status:
              current_period.savings > 0
                ? "UP"
                : current_period.savings < 0
                  ? "DOWN"
                  : "NO_CHANGE",
          },
        };

        const raw = current_period.expense_breakup || {};
        const total = Object.values(raw).reduce((a, b) => a + b, 0);

        const breakup = Object.entries(raw).map(([key, amount], index) => ({
          name: categoryMap[key] || key,
          amount,
          percent: total ? Math.round((amount / total) * 100) : 0,
          color: EXPENSE_COLORS[index % EXPENSE_COLORS.length],
        }));

        setDashboardStats(stats);
        setExpenseBreakup(breakup);
        setBankSummary({ totalBalance, totalAccounts: trackedAccounts.length });
        setLinkedBanks(bankLogos);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            date: TODAY,
            dashboardStats: stats,
            expenseBreakup: breakup,
            bankSummary: { totalBalance, totalAccounts: trackedAccounts.length },
            linkedBanks: bankLogos,
          })
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [state]);

  /* -------- PIE CHART -------- */
  useEffect(() => {
    if (!expenseBreakup.length || !chartContainerRef.current) return;

    if (chartRef.current) {
      try {
        chartRef.current.destroy();
      } catch { }
      chartRef.current = null;
    }

    chartRef.current = Highcharts.chart(chartContainerRef.current, {
      chart: { type: "pie", height: isMobile ? 250 : 400 },
      title: { text: "Expenses Breakdown" },
      series: [
        {
          name: "Amount",
          data: expenseBreakup.map((i) => ({
            name: i.name,
            y: Number(i.amount || 0),
            color: i.color,
          })),
        },
      ],
    });

    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.destroy();
        } catch { }
        chartRef.current = null;
      }
    };
  }, [expenseBreakup]);

  /* -------- RENDER -------- */
  const isEmpty =
    !loading &&
    (!dashboardStats ||
      (
        dashboardStats.income.value === 0 &&
        dashboardStats.expenses.value === 0 &&
        dashboardStats.savings.value === 0
      ));

  return (
    <StateBlock state={state} show="filled">
      <div className="lg:tw-col-span-2 tw-rounded-2xl tw-p-4 md:tw-p-6">
        {isEmpty ? (
          <EmptyFinancialOverview />
        ) : (
          <>
            <div className="tw-flex tw-items-start md:tw-items-center tw-justify-between tw-mb-4 md:tw-mb-6">
  <div>
    <h2 className="tw-text-lg md:tw-text-xl tw-font-bold tw-text-slate-900 tw-mb-1">
      Financial Overview
    </h2>

    {/* Linked Accounts */}
    <div className="tw-flex tw-items-center tw-gap-1.5 md:tw-gap-2 tw-flex-wrap">
      <span className="tw-text-sm tw-text-slate-500 tw-font-medium">
        Linked Accounts ({bankSummary?.totalAccounts || 0})
      </span>

      {linkedBanks.map((bank, index) => (
        <div
          key={`${bank.key}-${index}`}
          className="tw-flex tw-items-center tw-gap-1 tw-bg-slate-100 tw-px-2 tw-py-1 tw-rounded-full"
        >
          <img
            src={
              process.env.REACT_APP_STATIC_URL +
              "media/bank_logo/" +
              bank.logo
            }
            alt={bank.bankName}
            className="tw-w-4 tw-h-4 tw-rounded-full"
          />
          <span className="tw-text-xs tw-font-medium tw-text-slate-700">
            {bank.bankName}
          </span>
        </div>
      ))}
    </div>
  </div>

  <Link to="/money-management/bank-tracking-overview">
    <div className="tw-bg-fintoo-blue tw-text-white tw-text-xs tw-font-semibold tw-py-2 tw-px-3 md:tw-px-4 tw-rounded-lg tw-flex tw-items-center hover:tw-opacity-90">
      <FaLink className="tw-mr-2" />
      Link Bank
    </div>
  </Link>
</div>
              
            <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-3 md:tw-gap-4 tw-mb-5 md:tw-mb-8">
              {!loading && dashboardStats && (
                <>
                  <StatCard {...dashboardStats.bankBalance} />
                  <StatCard {...dashboardStats.income} />
                  <StatCard {...dashboardStats.expenses} />
                  <StatCard {...dashboardStats.savings} />
                </>
              )}
            </div>

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 md:tw-gap-6">
              <div className="tw-h-[250px] md:tw-h-[400px]">
                <div ref={chartContainerRef} className="tw-h-full" />
              </div>

              <div className="tw-space-y-2.5 md:tw-space-y-3 tw-pr-1">
                {expenseBreakup.map((item, i) => (
                  <div
                    key={i}
                    className="tw-flex tw-items-center tw-justify-between tw-p-2.5 md:tw-p-3 tw-rounded-lg tw-bg-slate-50"
                  >
                    <div className="tw-flex tw-items-center">
                      <div
                        className="tw-w-3.5 tw-h-3.5 tw-rounded-full tw-mr-3"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="tw-text-slate-700 tw-font-medium">
                        {item.name}
                      </span>
                    </div>
                    <span className="tw-text-slate-800 tw-font-semibold">
                      ₹{item.amount.toLocaleString("en-IN")}{" "}
                      <span className="tw-text-xs tw-text-slate-500">
                        ({item.percent}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </StateBlock>
  );
}
