import { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import { useDispatch } from "react-redux";
import { GetAssetAllocation } from "../../FrappeIntegration-Services/services/investment-api/investmentService";
import { DATA_BELONGS_TO } from "../../constants";
import { getUserId } from "../../common_utilities";

const StateBlock = ({ state, show, children }) =>
  show === state ? <>{children}</> : null;
const AllocationEmptyState = () => (
  <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-10 tw-text-center tw-space-y-4 tw-min-h-full">
    <div className="tw-w-16 tw-h-16 tw-rounded-full tw-bg-gradient-to-br tw-from-blue-100 tw-to-blue-50 tw-flex tw-items-center tw-justify-center tw-shadow-inner">
      <i className="fa-solid fa-chart-pie tw-text-fintoo-blue tw-text-2xl"></i>
    </div>

    <p className="tw-text-slate-700 tw-font-medium">
      No asset allocation available
    </p>

    <p className="tw-text-slate-500 tw-text-sm tw-max-w-xs">
      Add or import your investments to view how your assets are distributed
      across equity, debt, and other categories.
    </p>
  </div>
);

export default function AssetAllocationCard({ state }) {
  const dispatch = useDispatch();
const ASSET_ALLOC_CACHE_KEY = "asset_allocation_cache";
const TODAY = new Date().toDateString();

  const [allocationData, setAllocationData] = useState([]);
  const [loading, setLoading] = useState(false);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // ---------------- FETCH DATA ----------------
  const fetchAllocation = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }

      const payload = {
        user_id: getUserId(),
        family:"1",
        data_belongs_to: DATA_BELONGS_TO,
      };

      const response = await GetAssetAllocation(payload);

      const formattedData =
        Array.isArray(response?.data)
          ? response.data.map((item) => ({
              name: item.title,
              y: Number(item.value),
            }))
          : [];

setAllocationData(formattedData);

localStorage.setItem(
  ASSET_ALLOC_CACHE_KEY,
  JSON.stringify({
    data: formattedData,
    date: TODAY,
  })
);
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: e.message || "Failed to load asset allocation",
          type: "error",
        },
      });
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  // Fetch when card becomes visible
useEffect(() => {
  if (state !== "filled") return;

  const cached = localStorage.getItem(ASSET_ALLOC_CACHE_KEY);
  let hasFreshCache = false;

  if (cached) {
    try {
      const { data, date } = JSON.parse(cached);
      if (date === TODAY) {
        setAllocationData(Array.isArray(data) ? data : []);
        hasFreshCache = true;
      }
    } catch {
      localStorage.removeItem(ASSET_ALLOC_CACHE_KEY);
    }
  }

  // Cache-first render, then always refresh from API.
  fetchAllocation(hasFreshCache);
}, [state]);

const hasValidAllocation =
  allocationData.length > 0 &&
  allocationData.some(item => item.y > 0);

  // ---------------- RENDER CHART ----------------
  useEffect(() => {
    if (state !== "filled") return;
  if (!hasValidAllocation) return;
      if (!chartRef.current) return;

    // Destroy old chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    chartInstance.current = Highcharts.chart(chartRef.current, {
      chart: {
        type: "pie",
        backgroundColor: "transparent",
        height: isMobile ? 230 : 300,
      },
      title: { text: null },
      credits: { enabled: false },
      tooltip: {
        pointFormat: "<b>{point.percentage:.1f}%</b>",
      },
      plotOptions: {
        pie: {
          innerSize: "60%",
          dataLabels: {
            enabled: !isMobile,
            format: "<b>{point.name}</b><br>{point.percentage:.1f}%",
            style: {
              fontSize: "10px",
              color: "#334155",
            },
          },
        },
      },
      series: [
        {
          name: "Allocation",
          data: allocationData,
        },
      ],
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [allocationData, state]);

  // ---------------- UI ----------------
  return (
    <>
      {/* FILLED STATE */}
      <StateBlock state={state} show="filled">
        <div className="">
          <div className="tw-p-4 md:tw-p-6 tw-border-b tw-border-gray-100">
            <h3 className="tw-text-xl tw-font-bold tw-text-slate-900 tw-mb-0 tw-pb-0 ">
              Asset Allocation Overview
            </h3>
             <p className="tw-text-sm tw-text-slate-500 tw-mb-0 " >
        Track and manage your financial goals
      </p>
          </div>

          <div className="tw-p-4 md:tw-p-6 tw-pt-0">
           {loading ? (
  <div className="tw-text-center tw-text-slate-500 tw-py-10">
    Loading asset allocation...
  </div>
) : !hasValidAllocation ? (
  <AllocationEmptyState />
) : (
  <>
    {/* CHART */}
    <div ref={chartRef} className="tw-mt-1 md:tw-mt-0"></div>

    {/* LEGEND */}
    <div className="tw-mt-4 tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-6 tw-gap-y-3">
      {allocationData.map((item, index) => (
        <div
          key={index}
          className="tw-flex tw-items-center tw-justify-between tw-text-sm"
        >
          <div className="tw-flex tw-items-center tw-gap-2">
            <span
              className="tw-w-3 tw-h-3 tw-rounded-full"
              style={{
                backgroundColor:
                  Highcharts.getOptions().colors[index],
              }}
            ></span>
            <span className="tw-text-slate-700">
              {item.name}
            </span>
          </div>

          <span className="tw-font-medium tw-text-slate-800">
            {item.y.toLocaleString("en-IN")}%
          </span>
        </div>
      ))}
    </div>
  </>
)}

          </div>
        </div>
      </StateBlock>

      {/* EMPTY STATE */}
      <StateBlock state={state} show="empty">
        <div className="glass-card tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-100">
          <div className="tw-p-6 tw-border-b tw-border-gray-100">
            <h3 className="tw-text-xl tw-font-bold tw-text-slate-900">
              Asset Allocation Overview
            </h3>
          </div>

          <div className="tw-p-8 tw-text-center">
            <div className="tw-flex tw-flex-col tw-items-center tw-space-y-4">
              <div className="tw-w-16 tw-h-16 tw-rounded-full tw-bg-gradient-to-br tw-from-blue-100 tw-to-blue-50 tw-flex tw-items-center tw-justify-center tw-shadow-inner">
                <i className="fa-solid fa-chart-pie tw-text-fintoo-blue tw-text-2xl"></i>
              </div>
              <p className="tw-text-slate-700 tw-font-medium">
                No asset allocation data available yet.
              </p>
              <p className="tw-text-slate-500 tw-text-sm">
                Import your portfolio to view equity & debt insights.
              </p>
            </div>
          </div>
        </div>
      </StateBlock>
    </>
  );
}
