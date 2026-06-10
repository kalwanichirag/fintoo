import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getParentUserId } from "../../common_utilities";
import { DATA_BELONGS_TO } from "../../constants";
import { Getpaymentstatus } from "../../FrappeIntegration-Services/services/payment-api/paymentapiService";

const formatPlanDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  if (Number.isNaN(expiry.getTime())) return null;

  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

function RenewalPopup({ plan, onClose, onRenew }) {
  if (!plan) return null;

  const daysUntilExpiry = getDaysUntilExpiry(plan.plan_expiry_date);

  const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;

  return (
    <div className="tw-fixed tw-inset-0 tw-z-[1000] tw-flex tw-items-center tw-justify-center tw-p-4">
      <div
        className="tw-absolute tw-inset-0 tw-bg-slate-950/60 tw-backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="tw-relative tw-w-full tw-max-w-xl tw-overflow-hidden tw-rounded-[28px] tw-border tw-border-white/40 tw-bg-white tw-shadow-[0_30px_100px_rgba(15,23,42,0.35)]">
        <div className="tw-relative tw-overflow-hidden tw-bg-[linear-gradient(135deg,#052c65_0%,#0f4c81_55%,#f59e0b_140%)] tw-p-6 md:tw-p-8 tw-text-white">
          <div className="tw-absolute tw--right-10 tw--top-10 tw-h-36 tw-w-36 tw-rounded-full tw-bg-white/10" />
          <div className="tw-absolute tw-right-16 tw-top-12 tw-h-16 tw-w-16 tw-rounded-full tw-bg-amber-300/20" />
          <div className="tw-relative">
            <div className="tw-inline-flex tw-items-center tw-rounded-full tw-bg-white/15 tw-px-3 tw-py-1 tw-text-xs tw-font-semibold tw-tracking-[0.2em] tw-uppercase">
              Renewal Reminder
            </div>
            <h2 className="tw-mt-4 tw-text-2xl md:tw-text-3xl tw-font-semibold">
              {isExpired ? "Your plan has expired" : "Your renewal is coming up"}
            </h2>
            <p className="tw-mt-3 tw-max-w-lg tw-text-sm md:tw-text-base tw-leading-6 tw-text-white/85">
              Your {plan.plan_name || "advisory"} plan expired on {formatPlanDate(plan.plan_expiry_date)}. Renew now to keep your dashboard, reports, and expert guidance uninterrupted.
            </p>
          </div>
        </div>

        <div className="tw-bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.08),transparent_40%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] tw-p-6 md:tw-p-8">
          <div className="tw-grid tw-gap-3 md:tw-grid-cols-2">
            <div className="tw-rounded-2xl tw-border tw-border-slate-200 tw-bg-white/80 tw-p-4">
              <div className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.18em] tw-text-slate-500">Current Plan</div>
              <div className="tw-mt-2 tw-text-lg tw-font-semibold tw-text-slate-900">{plan.plan_name || "-"}</div>
              <div className="tw-mt-1 tw-text-sm tw-text-slate-600">Started on {formatPlanDate(plan.plan_date) || "-"}</div>
            </div>
            <div className="tw-rounded-2xl tw-border tw-border-slate-200 tw-bg-white/80 tw-p-4">
              <div className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.18em] tw-text-slate-500">Expiry Date</div>
              <div className="tw-mt-2 tw-text-lg tw-font-semibold tw-text-slate-900">{formatPlanDate(plan.plan_expiry_date) || "-"}</div>
              <div className="tw-mt-1 tw-text-sm tw-text-slate-600">
                {daysUntilExpiry !== null ? `${Math.abs(daysUntilExpiry)} day(s) overdue` : "Plan timeline unavailable"}
              </div>
            </div>
          </div>

          {plan.rm_data?.emp_name && (
            <div className="tw-mt-4 tw-rounded-2xl tw-border tw-border-amber-200 tw-bg-amber-50 tw-p-4 tw-text-sm tw-text-slate-700">
              <span className="tw-text-lg tw-font-semibold tw-text-slate-900">Relationship Manager:</span>
              <br />
              <span className="tw-font-semibold tw-text-slate-900">{plan.rm_data.emp_name}</span>
              {plan.rm_data.emp_email ? ` • ${plan.rm_data.emp_email}` : ""}
            </div>
          )}

          <div className="tw-mt-6 tw-flex tw-flex-col-reverse tw-gap-3 sm:tw-flex-row sm:tw-justify-end">
            <button
              type="button"
              onClick={onClose}
              className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-xl tw-border tw-border-slate-300 tw-bg-white tw-px-5 tw-py-3 tw-text-sm tw-font-medium tw-text-slate-700 tw-transition hover:tw-border-slate-400 hover:tw-bg-slate-50"
            >
              Maybe later
            </button>
            <button
              type="button"
              onClick={onRenew}
              className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-xl tw-bg-slate-950 tw-px-5 tw-py-3 tw-text-sm tw-font-semibold tw-text-white tw-shadow-lg tw-shadow-slate-900/20 tw-transition hover:tw-bg-slate-800"
            >
              Renew Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpiredPlanStrip({ plan, onRenew }) {
  if (!plan) return null;

  return (
    <div className="tw-mb-3 md:tw-mb-4 tw-overflow-hidden tw-rounded-2xl tw-border tw-border-amber-200 tw-bg-[linear-gradient(90deg,#fff7ed_0%,#ffffff_48%,#fff1f2_100%)] tw-shadow-sm">
      <div className="tw-flex tw-flex-col tw-gap-3 tw-p-4 md:tw-flex-row md:tw-items-center md:tw-justify-between md:tw-px-5 md:tw-py-4">
        <div>
          <div className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.18em] tw-text-amber-700">
            Plan Expired
          </div>
          <div className="tw-mt-1 tw-text-sm md:tw-text-base tw-font-medium tw-text-slate-900">
            Your {plan.plan_name || "advisory"} plan expired on {formatPlanDate(plan.plan_expiry_date)}. Renew now to restore uninterrupted access.
          </div>
        </div>
        <button
          type="button"
          onClick={onRenew}
          className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-xl tw-bg-slate-950 tw-px-4 tw-py-2.5 tw-text-sm tw-font-semibold tw-text-white tw-transition hover:tw-bg-slate-800"
        >
          Renew Now
        </button>
      </div>
    </div>
  );
}

export default function RenewalNotice() {
  const navigate = useNavigate();
  const [renewalPlan, setRenewalPlan] = useState(null);
  const [showRenewalPopup, setShowRenewalPopup] = useState(false);

  useEffect(() => {
    const checkRenewalStatus = async () => {
      try {
        const parentUserId = getParentUserId();
        if (!parentUserId) return;

        const res = await Getpaymentstatus({
          user_id: parentUserId,
          data_belongs_to: DATA_BELONGS_TO,
        });

        const plan = res?.data;
       const daysUntilExpiry = getDaysUntilExpiry(plan?.plan_expiry_date);
        if (!plan?.plan_expiry_date || daysUntilExpiry === null) return;

        if (daysUntilExpiry < 0) {
          setRenewalPlan(plan);
          setShowRenewalPopup(true);
        }
      } catch {}
    };

    checkRenewalStatus();
  }, []);

  return (
    <>
      {showRenewalPopup && (
        <RenewalPopup
          plan={renewalPlan}
          onClose={() => setShowRenewalPopup(false)}
          onRenew={() => navigate(`${process.env.PUBLIC_URL}/pricing`)}
        />
      )}
      {!showRenewalPopup && renewalPlan && (
        <ExpiredPlanStrip
          plan={renewalPlan}
          onRenew={() => navigate(`${process.env.PUBLIC_URL}/pricing`)}
        />
      )}
    </>
  );
}
