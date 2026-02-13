import React, { useCallback, useEffect, useState } from "react";
import { FaWallet, FaShieldAlt, FaHeartbeat } from "react-icons/fa";
import { GetNetworthLiabilites } from "../../../FrappeIntegration-Services/services/financial-planning-api/dashboardApi";
import {
  getUserId,
  getParentUserId,
  getItemLocal,
} from "../../../common_utilities";
import { DATA_BELONGS_TO } from "../../../constants";
import { getMedicalInsurance } from "../../../FrappeIntegration-Services/services/financial-planning-api/insurance";
const LIABILITY_REFRESH_EVENT = "liability-overview-refresh";

const StateBlock = ({ show, children }) =>
  show ? <>{children}</> : null;

export default function NetWorthCard({ member_selected }) {
  const [networthData, setNetworthData] = useState(null);
  const [insuranceData, setInsuranceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const parentUserId = getParentUserId();
  const userId = getUserId();

  const cacheKey = `networth_${parentUserId}_${userId}_${member_selected ? "personal" : "family"}`;
  const insuranceCacheKey = `insurance_${parentUserId}_${userId}_${member_selected ? "personal" : "family"}`;

  /* -----------------------------
     LOAD CACHE FIRST (FAST UI)
  ----------------------------- */
  const loadCache = useCallback(() => {
    try {
      const cachedNW = JSON.parse(localStorage.getItem(cacheKey));
      const cachedIns = JSON.parse(localStorage.getItem(insuranceCacheKey));

      if (cachedNW?.data) {
        setNetworthData(cachedNW.data);
      }

      if (cachedIns?.data) {
        setInsuranceData(cachedIns.data);
      }
    } catch (e) {
      console.log("Cache parse error", e);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, insuranceCacheKey]);

  /* -----------------------------
     BACKGROUND REFRESH
  ----------------------------- */
  const fetchNetworthAndInsurance = useCallback(async () => {
    try {
      const memberFilter = getItemLocal("family")
        ? "all"
        : "member_id";

     

      const [networthRes, insuranceRes] = await Promise.all([
        GetNetworthLiabilites(
          getParentUserId(),
          getUserId(),
          memberFilter,
          DATA_BELONGS_TO
        ),
        getMedicalInsurance(userId, memberFilter, userId)
      ]);

      /* ---- NETWORTH UPDATE ---- */
      if (networthRes?.status_code === 200 && networthRes?.data) {
        setNetworthData(networthRes.data);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: networthRes.data,
            timestamp: Date.now(),
          })
        );
      }

      /* ---- INSURANCE UPDATE ---- */
      if (
        (insuranceRes?.status_code === "200" ||
          insuranceRes?.status_code === 200) &&
        insuranceRes?.data
      ) {
        setInsuranceData(insuranceRes.data);

        localStorage.setItem(
          insuranceCacheKey,
          JSON.stringify({
            data: insuranceRes.data,
            timestamp: Date.now(),
          })
        );
      }
    } catch (err) {
      console.log("Background refresh failed:", err);
    }
  }, [cacheKey, insuranceCacheKey, userId]);

  useEffect(() => {
    loadCache();
    fetchNetworthAndInsurance();
  }, [loadCache, fetchNetworthAndInsurance, member_selected]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchNetworthAndInsurance();
    };

    window.addEventListener(LIABILITY_REFRESH_EVENT, handleRefresh);
    return () => {
      window.removeEventListener(LIABILITY_REFRESH_EVENT, handleRefresh);
    };
  }, [fetchNetworthAndInsurance]);

  const formatInsuranceValue = (value, formatted) => {
    if (formatted) return `₹${formatted}`;
    if (typeof value === "number")
      return `₹${value.toLocaleString("en-IN")}`;
    return "₹0";
  };

  const isFilled =
    networthData &&
    networthData.networth_sum_formatted &&
    networthData.asset_sum_formatted &&
    networthData.liability_sum_formatted;

  if (loading) return null;

  return (
    <div className="glass-card tw-rounded-2xl tw-p-5 tw-flex tw-flex-col tw-justify-between tw-h-full">
      <StateBlock show={isFilled}>
        <div>
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
            <div className="tw-flex tw-items-center tw-space-x-3">
              <div className="tw-w-12 tw-h-12 tw-bg-fintoo-blue tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                <FaWallet className="tw-text-white tw-text-2xl" />
              </div>
              <div>
                <h2 className="tw-text-base tw-font-semibold tw-text-slate-800 tw-mb-0">
                  Total Net Worth
                </h2>
                <p className="tw-text-xs tw-text-slate-500 tw-mb-0">
                  Summary
                </p>
              </div>
            </div>
          </div>

          <p className="tw-text-xs tw-text-slate-500 tw-mb-1">
            Current Value
          </p>
          <p className="tw-text-2xl tw-font-bold tw-text-slate-900 tw-mb-0">
            ₹{networthData?.networth_sum_formatted}
          </p>

          <div className="tw-border-t tw-border-slate-200 tw-my-3"></div>

          <div className="tw-grid tw-grid-cols-2 tw-gap-2">
            <div className="tw-rounded-lg tw-border tw-border-slate-200 tw-p-2.5 tw-bg-slate-50">
              <p className="tw-text-xs tw-text-slate-500 tw-mb-1">Assets</p>
              <p className="tw-text-sm tw-font-semibold tw-text-slate-800 tw-mb-0 tw-leading-tight">
                ₹{networthData?.asset_sum_formatted}
              </p>
            </div>

            <div className="tw-rounded-lg tw-border tw-border-slate-200 tw-p-2.5 tw-bg-slate-50">
              <p className="tw-text-xs tw-text-slate-500 tw-mb-1">Liabilities</p>
              <p className="tw-text-sm tw-font-semibold tw-text-slate-800 tw-mb-0 tw-leading-tight">
                ₹{networthData?.liability_sum_formatted}
              </p>
            </div>

            <div className="tw-rounded-lg tw-border tw-border-slate-200 tw-p-2.5 tw-bg-slate-50">
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-0.5">
                
                <p className="tw-text-xs tw-text-slate-500 tw-mb-1">
                  Life Insurance
                </p>
              </div>
              <p className="tw-text-sm tw-font-semibold tw-text-slate-800 tw-mb-0 tw-leading-tight">
                {insuranceData
                  ? formatInsuranceValue(
                      insuranceData.life_insurance_sum_assured,
                      insuranceData.life_insurance_sum_assured_formatted
                    )
                  : "—"}
              </p>
            </div>

            <div className="tw-rounded-lg tw-border tw-border-slate-200 tw-p-2.5 tw-bg-slate-50">
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-0.5">
               
                <p className="tw-text-xs tw-text-slate-500 tw-mb-1">
                  Medical Insurance
                </p>
              </div>
              <p className="tw-text-sm tw-font-semibold tw-text-slate-800 tw-mb-0 tw-leading-tight">
                {insuranceData
                  ? formatInsuranceValue(
                      insuranceData.medical_insurance_sum_assured,
                      insuranceData.medical_insurance_sum_assured_formatted
                    )
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </StateBlock>

      <StateBlock show={!isFilled}>
        <div className="tw-text-center tw-py-6">
         <div id="networth-empty" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-py-10 tw-space-y-4">
    <div className="tw-w-12 tw-h-12 tw-bg-fintoo-blue tw-rounded-full tw-flex tw-items-center tw-justify-center">
                <FaWallet className="tw-text-white tw-text-2xl" />
              </div>
    <p class="tw-text-slate-700 tw-font-medium">No net worth data available</p>
    <p class="tw-text-slate-500 tw-text-sm tw-max-w-sm">
        Import your <b>portfolio holdings and liabilities</b> to calculate your networth accurately.
    </p>
   
  </div>
        </div>
      </StateBlock>

     
    </div>
  );
}
