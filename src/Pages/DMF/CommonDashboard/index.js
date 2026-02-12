import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Dashboard from "./Dashboard";
import NetworthGoals from "./NetworthGoals";
import {
  getParentUserId,
  storeUserSession,
  getItemLocal
} from "../../../common_utilities";
import PlanofAction from "./PlanofAction";
import PortfolioBalance from "../../../components/PortfolioBalance";
import { GetPlanOfAction } from "../../../FrappeIntegration-Services/services/financial-planning-api/reports/plan-of-action";
import { RenewPayment } from "../../../FrappeIntegration-Services/services/payment-api/paymentapiService";

const CommonDashboard = () => {
  const [page, setPage] = useState("dashboard");
  const [dashboardpage, setDashboardPage] = useState(-1);
  const [plansubcat, setPlanSubCat] = useState(0);
  const [planuuid, setPlanUuid] = useState("");
  const [renewpopup, setRenewPopup] = useState(0);
  const [subscriptionenddate, setSubscriptionEndDate] = useState("");
  const [mutualfunddata, setMutualFundData] = useState(null);
  const [lifeinsurancerecomm, setLifeInsuranceRecomm] = useState(0);
  const [lifeinsurance, setLifeInsurance] = useState(0);
  const [totalmfsum, setTotalMFSum] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [sessionData, setSessionData] = useState({});
  const [uiReady, setUiReady] = useState(false);

  const showPage = useSelector((state) => state.page);

  const renewPayment = async () => {
    try {
      var res = await RenewPayment(getParentUserId());
      if (res["status_code"] === 200 && res["data"] !== "") {
        setRenewPopup(res["data"]["show_popup"]);
        if ("subscription_end_date" in res["data"]) {
          setSubscriptionEndDate(res["data"]["subscription_end_date"]);
        }
      } else {
        setRenewPopup(0);
        setSubscriptionEndDate("");
      }

    } catch (e) {
      console.log("Error fetching session data:", e);
    }
  }

  const getPlanOfActionData = async () => {
    try {
      setIsLoading(true);
      let res = await GetPlanOfAction();

      if (res?.status_code == '200' && res?.data) {
        setIsLoading(false);
        const mutualFundsArray = Array.isArray(res.data.mutual_funds)
          ? res.data.mutual_funds
          : [];
        const mutualFundDataObj =
          mutualFundsArray.length > 0 ? mutualFundsArray[0] : {};
        const lifeInsuranceData = Array.isArray(res.data.lifeinsurance)
          ? res.data.lifeinsurance
          : [];
        const totalPvSum =
          typeof res.data.total_pvsum === "number" ? res.data.total_pvsum : 0;
        const totalPmtSum =
          typeof res.data.total_pmtsum === "number" ? res.data.total_pmtsum : 0;

        setMutualFundData(mutualFundDataObj);
        setLifeInsurance(lifeInsuranceData);
        setLifeInsuranceRecomm(Number(res.data.life_insurance_recomm || 0));
        setTotalMFSum({
          total_pvsum: totalPvSum,
          total_pmtsum: totalPmtSum,
        });
      } else {
        setIsLoading(false);
        setMutualFundData({});
        setLifeInsurance([]);
        setLifeInsuranceRecomm(0);
        setTotalMFSum({});
      }
    } catch (e) {
      console.log("Error fetching plan of action data:", e);
    }
  };

  useEffect(() => {
    if (showPage) {
      setPage(showPage);
    }
  }, [showPage]);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        // 1. Parse query params
        const params = new URLSearchParams(window.location.search);
        const parsed = {};
        for (let [key, value] of params.entries()) parsed[key] = value;

        // 2. Store session if query params exist
        if (Object.keys(parsed).length > 0) {
          if (parsed["userdata"] && parsed["token"]) {
            parsed["redirect_to"] = parsed["redirect_to"] || "";
            await storeUserSession(parsed); // ensures session is ready
          }
        }

        // 3. Read localStorage safely after session setup
        const ndasignstatus = getItemLocal("ndasignstatus");
        const datagatehringstatus = getItemLocal("datagatheringstatus");
        const reportstatus = getItemLocal("reportstatus");
        setPlanUuid(getItemLocal("plan_uuid"));

        if (ndasignstatus === "Y" && planuuid != "fp_robo") setDashboardPage(2);
        else if (reportstatus === "Y") setDashboardPage(2);
        else if (ndasignstatus === "Y" || datagatehringstatus === "Y") setDashboardPage(1);
        else setDashboardPage(0);

        // 4. Fetch dependent async data
        await renewPayment();
        await getPlanOfActionData();

        document.body.scrollTop = document.documentElement.scrollTop = 0;

        const hasToken = params["userdata"] && params["token"];
        if (!getParentUserId() && !hasToken) {
          window.location.href = '/login';
          return;
        }

        if (params?.success === "1") {
          setIsOpen(true);
        }

        if (params?.iscibilscore === "1" && params?.cibilscore) {
          setModalData((prev) => ({
            ...prev,
            cibilscore: Number(params?.cibilscore),
          }));
        }
      } catch (error) {
        console.error("Error initializing dashboard:", error);
      } finally {
        setUiReady(true);
      }
    };

    initDashboard();
  }, []);

  return (
    <>
      <div style={{ minHeight: "110vh" }}>
        {uiReady && dashboardpage > -1 && (
          <>
            <div
              style={{
                display:
                  page === "dashboard" &&
                    (dashboardpage === 0 || dashboardpage === 1) &&
                    plansubcat != 7
                    ? "block"
                    : "none",
              }}
            >
              <Dashboard
                lifecyclestatus={dashboardpage}
                renewpopup={renewpopup}
                subscriptionenddate={subscriptionenddate}
                onChangePage={(v) => setPage(v)}
              />
            </div>

            <div
              className="CoachmarkIssue"
              style={{
                display:
                  page === "dashboard" &&
                    !((dashboardpage === 0 || dashboardpage === 1) &&
                      plansubcat != 7)
                    ? "block"
                    : "none",
              }}
            >
              {dashboardpage > 1 && (
                <NetworthGoals
                  session={sessionData}
                  renewpopup={renewpopup}
                  lifecyclestatus={dashboardpage}
                  subscriptionenddate={subscriptionenddate}
                  onChangePage={(v) => setPage(v)}
                />
              )}
            </div>

            <div
              style={{
                display:
                  dashboardpage > 1 && planuuid == "fp_robo" && page === "planofaction"
                    ? "block"
                    : "none",
              }}
            >
              <PlanofAction
                mutualfunddata={mutualfunddata}
                totalmfsum={totalmfsum}
                lifeinsurancerecomm={lifeinsurancerecomm}
                lifeinsurance={lifeinsurance}
                isLoading={isLoading}
                onChangePage={(v) => setPage(v)}
              />

              <PortfolioBalance
                open={isOpen}
                setIsOpen={setIsOpen}
                modalData={modalData}
                isDashboard={true}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CommonDashboard;
