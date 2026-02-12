import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

import {
  getItemLocal,
  getParentUserId,
  getUserId,
} from "../../common_utilities";

import { getFamilyMember } from
  "../../FrappeIntegration-Services/services/user-management-api/userApiService";

import { getGoalDetailsByFilterType } from
  "../../FrappeIntegration-Services/services/financial-planning-api/goal";
import { Link } from "react-router-dom";


export default function SavingsGoals() {
  /* ---------------- CORE STATE ---------------- */
  const [goals, setGoals] = useState([]);
  const [goalCount, setGoalCount] = useState({});
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [memberID, setMemberID] = useState("");
  const [isMemberSelected, setIsMemberSelected] = useState(false);

  const userId = getUserId();

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    initMemberAndGoals();
  }, []);

  /* ---------------- MEMBER + GOALS ---------------- */
  const initMemberAndGoals = async () => {
    try {
      let member_id = null;
      let member_selected = "member_id";

      const memberRes = await getFamilyMember(getParentUserId());

      if (memberRes?.status_code === "200") {
        const members = memberRes.data || [];
        const self = members.find(m => m.user_id === userId);

        if (self && getItemLocal("family") != 1) {
          member_id = self.user_id;
          setMemberID(member_id);
          setIsMemberSelected(true);
        }
      }

      if (getItemLocal("family")) {
        member_selected = "all";
      }

      fetchGoals(member_selected, member_id);
    } catch (err) {
      console.error("Member init failed", err);
    }
  };

  /* ---------------- FETCH GOALS (FRAPPE) ---------------- */
  const fetchGoals = async (member_selected, member_id) => {
    try {
      setIsLoading(true);

      const res = await getGoalDetailsByFilterType(userId, member_selected);

      if (res?.status_code === "200") {
        setGoals(res.data || []);
        setGoalCount(res.count_data || {});
      } else {
        setGoals([]);
        setGoalCount({});
      }

      setIsDataLoaded(true);
      setIsLoading(false);
    } catch (err) {
      console.error("Goal fetch failed", err);
      setIsLoading(false);
      setIsDataLoaded(true);
    }
  };

  /* ---------------- HELPERS ---------------- */
const formatCurrency = (num) => {
  if (!num) return "₹0";

  const n = Number(num);

  if (n >= 10000000) {
    // Crore
    return `₹${(n / 10000000).toFixed(2)}CR`;
  } else if (n >= 100000) {
    // Lakh
    return `₹${(n / 100000).toFixed(2)}L`;
  } else if (n >= 1000) {
    // Thousand
    return `₹${(n / 1000).toFixed(2)}K`;
  } else {
    return `₹${n.toLocaleString("en-IN")}`;
  }
};
  const normalizeGoal = (g) => {
    const target =
      g.goaltype === "ContingencyGoal"
        ? Number(g.present_value || 0)
        : Number(g.future_value || 0);

    const percent = Number(g.goal_percent_achieved || 0);

    const saved = target > 0 ? (percent / 100) * target : 0;

    const shortfall =
      Number(g.short_fall || 0); // comes from backend already

    const endYear = g.user_goal_end_date
      ? new Date(g.user_goal_end_date).getFullYear()
      : "";

    return {
      id: g.goal_id,
      name: g.name,
      year: endYear,
      target,
      saved,
      percent,
      shortfall,
      completed: g.goal_type?.includes("achieved"),
      upcoming: g.goal_type?.includes("upcoming"),
      pending: g.goal_type?.includes("pending"),
      isShortfall: shortfall < 0,
      isSurplus: shortfall > 0,
    };
  };


  /* ---------------- FILTER ---------------- */
  const normalizedGoals = goals
    .map(normalizeGoal)
    .sort((a, b) => {
      const ay = Number(a.year || 0);
      const by = Number(b.year || 0);
      if (ay === 0 && by === 0) return 0;
      if (ay === 0) return 1;
      if (by === 0) return -1;
      return ay - by;
    });

  const filteredGoals = normalizedGoals.filter((g) => {
    if (filter === "all") return true;
    if (filter === "achieved") return g.completed;
    if (filter === "pending") return g.pending;
    if (filter === "upcoming") return g.upcoming;
    return true;
  });

  const countFallbacks = {
    all: normalizedGoals.length,
    achieved: normalizedGoals.filter((g) => g.completed).length,
    pending: normalizedGoals.filter((g) => g.pending).length,
    upcoming: normalizedGoals.filter((g) => g.upcoming).length,
  };

  const countFromApi = {
    all: goalCount?.total,
    achieved: goalCount?.achieved_goal_data,
    pending: goalCount?.pending_goal_data,
    upcoming: goalCount?.upcoming_goal_data,
  };

  const getTabCount = (key) => {
    const raw = countFromApi[key];
    if (raw !== undefined && raw !== null && !Number.isNaN(Number(raw))) {
      return Number(raw);
    }
    return countFallbacks[key];
  };

  const emptyStateConfig = {
  all: {
    title: "No goals created yet",
    desc: "You haven’t added any financial goals. Start planning to track and achieve your milestones.",
    hint: "Retirement • Emergency • Education • Travel",
  },
  pending: {
    title: "No pending goals 🎉",
    desc: "Great job! You don’t have any pending goals at the moment.",
    hint: "Keep reviewing and updating your goals regularly.",
  },
  upcoming: {
    title: "No upcoming goals",
    desc: "You don’t have any goals scheduled for the future yet.",
    hint: "Plan ahead to stay prepared for upcoming milestones.",
  },
  achieved: {
    title: "No goals achieved yet",
    desc: "You haven’t achieved any goals so far. Stay consistent — progress takes time.",
    hint: "Small steps today lead to big wins tomorrow.",
  },
};

  /* ---------------- UI ---------------- */
  return (
    <div className=" ">

      {/* Header */}
     <div className="tw-mb-4">
  <div className="tw-flex tw-items-center tw-justify-between tw-gap-3">
    
    {/* Title */}
    <div>
      <h2 className="tw-text-lg tw-font-bold tw-leading-tight">
        Savings Goals
      </h2>
      <p className="tw-text-sm tw-text-slate-500">
        Track and manage your financial goals
      </p>
    </div>

    {/* Desktop Button */}
    <Link
      to={`${process.env.PUBLIC_URL}/datagathering/goals`}
      className="
        tw-hidden md:tw-inline-flex
        tw-items-center
        tw-bg-fintoo-blue tw-text-white
        tw-px-6 tw-py-2.5
        tw-rounded-xl
        tw-text-sm tw-font-medium
        tw-shadow-sm
        hover:tw-shadow-md hover:tw-text-white
        tw-transition
      "
    >
      Add Goal
    </Link>

    {/* Mobile Button */}
    <Link
      to={`${process.env.PUBLIC_URL}/datagathering/goals`}
      className="
        md:tw-hidden
        tw-flex tw-items-center tw-justify-center
        tw-h-10 tw-w-10
        tw-rounded-xl
        tw-bg-fintoo-blue
        tw-text-white tw-text-xl tw-font-semibold
        tw-shadow-sm
        hover:tw-shadow-md
        tw-transition
      "
    >
      +
    </Link>

  </div>
</div>
<div className="  tw-max-h-[540px]
  tw-overflow-y-auto">

      {/* Filters */}
      <div className="tw-flex tw-gap-2 tw-mb-6 tw-flex-wrap">
        {["all", "pending", "upcoming", "achieved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`tw-px-4 tw-py-1.5 tw-rounded-full tw-text-sm ${filter === f
                ? "tw-bg-fintoo-blue tw-text-white"
                : "tw-bg-gray-100"
              }`}
          >
            {`${f.charAt(0).toUpperCase() + f.slice(1)} (${getTabCount(f)})`}
          </button>
        ))}
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="tw-text-center tw-py-10 tw-text-slate-500">
          Loading goals…
        </div>
      )}

      {/* Empty */}
     {!isLoading && isDataLoaded && filteredGoals.length === 0 && (
  <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-py-5 tw-space-y-4">

    <img
      src="/static/media/Savings-bro.svg"
      alt="No goals"
      className="tw-w-56 tw-opacity-90"
    />

    <h3 className="tw-text-base tw-font-semibold tw-text-slate-800 tw-pb-0 !tw-mb-0">
      {emptyStateConfig[filter].title}
    </h3>

    <p className="tw-text-sm tw-text-slate-500 tw-max-w-sm !tw-mt-2">
      {emptyStateConfig[filter].desc}
    </p>

    {filter !== "pending" && (
      <Link
        to={`${process.env.PUBLIC_URL}/datagathering/goals`}
        className="
          tw-inline-flex tw-items-center
          tw-bg-fintoo-blue tw-text-white
          tw-px-6 tw-py-2.5
          tw-rounded-xl
          tw-text-sm tw-font-medium
          tw-shadow-sm
          hover:tw-text-white
          hover:tw-shadow-md
          tw-transition
        "
      >
        Add a Goal
      </Link>
    )}

    {/* <p className="tw-text-sm tw-text-slate-400">
      {emptyStateConfig[filter].hint}
    </p> */}
  </div>
)}



      {/* Goals */}
      <div className="tw-gap-4 tw-grid lg:tw-grid-cols-2">
        {filteredGoals.map((goal) => {
          const progress = Math.min(
            goal.target > 0 ? (goal.saved / goal.target) * 100 : 0,
            100
          );

          return (
            <div
              key={goal.id}
              className="tw-rounded-2xl tw-bg-slate-50  tw-p-5 tw-shadow-sm hover:tw-shadow-md tw-transition"
            >
              
              {/* HEADER */}
              <div className="tw-flex tw-items-end tw-justify-between tw-gap-4">
                <div>
                  <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                    {goal.year && (
                      <span className="tw-text-sm tw-text-slate-500 tw-bg-slate-200 tw-px-2 tw-py-0.5 tw-rounded-full">
                        {goal.year}
                      </span>
                    )}
                    <span
                      className={`tw-text-[10px] tw-uppercase tw-tracking-wide tw-font-semibold tw-px-2 tw-py-0.5 tw-rounded-full ${
                        goal.completed
                          ? "tw-bg-emerald-50 tw-text-emerald-700"
                          : goal.upcoming
                          ? "tw-bg-blue-50 tw-text-blue-700"
                          : "tw-bg-amber-50 tw-text-amber-700"
                      }`}
                    >
                      {goal.completed
                        ? "Achieved"
                        : goal.upcoming
                        ? "Upcoming"
                        : "Pending"}
                    </span>
                  </div>
                  <h2 className="tw-font-semibold tw-text-base tw-text-slate-800 tw-pb-0 tw-mb-1">
                    {goal.name}
                  </h2>
                  
                </div>

             <div className="tw-text-right ">
  <p className="tw-font-semibold tw-text-base tw-text-slate-900 tw-mb-0">
    {formatCurrency(goal.saved)} / {formatCurrency(goal.target)}
  </p>

  {goal.shortfall !== 0 && (
    <p
      className={`tw-text-xs tw-font-medium ${
        goal.isShortfall
          ? "tw-text-red-600"
          : "tw-text-emerald-600"
      }`}
    >
      {formatCurrency(Math.abs(goal.shortfall))}{" "}
      {goal.isShortfall ? "Shortfall" : "Surplus"}
    </p>
  )}
</div>
              </div>

              {/* PROGRESS */}
              <div className="tw-mt-3">
                <div className="tw-flex tw-items-center tw-justify-between tw-text-sm tw-text-slate-500 tw-mb-2">
                  <span>{goal.percent}% of goal achieved</span>
                </div>
                <div className="tw-h-2 tw-bg-slate-100 tw-rounded-full">
                  <div
                    className={`tw-h-2 tw-rounded-full ${
                      goal.isShortfall ? "tw-bg-red-500" : "tw-bg-emerald-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
</div>
      </div>
    </div>
  );
}
