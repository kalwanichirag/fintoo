import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { createStore } from "redux";
import fintooReducer from "./fintooReducer";
import MainHeader from "./components/MainHeader";
import Footer from "./components/HTML/Footer";

const Homepage = lazy(() => import("./Pages"));
const PersonalFinancialPlan = lazy(() => import("./Pages/wpPages/Personal-financial-Planning"));
const WealthManagementForIndianandNRI = lazy(() => import("./Pages/wpPages/WealthManagementForIndianandNRI"));
const FinancialPlanningPageCalendly = lazy(() => import("./Pages/wpPages/FinancialPlanningPageCalendly"));
const RetirementPlanningNew = lazy(() => import("./Pages/retirement-planning/RetirementPlanningNew"));
const RetirementPlanner = lazy(() => import("./Pages/retirement-planning/RetirementPlanner"));
const InvestmentPlanningNew = lazy(() => import("./Pages/Invest-planning/InvestmentPlannning"));
const FinancialAdvicePage = lazy(() => import("./Pages/financialadvicepage"));
const InvestmentPlanningNewB = lazy(() => import("./Pages/Invest-planning-b/InvestmentPlannning"));
const WomoneyaPage = lazy(() => import("./Pages/womoneya/WomoneyaPage"));
const ThankYouPage = lazy(() => import("./Pages/Thankyoupage/Thankyoupage"));
const ItrFilingThankYouPage = lazy(() => import("./Pages/Thankyoupage/ItrFilingThankYouPage"));
const ReviewPage = lazy(() => import("./Pages/ReviewPage"));
const PmsMarketingPage = lazy(() => import("./Pages/PmsMarketingPage/PmsMarketingPage"));
const ItrLandingPage = lazy(() => import("./Pages/ItrLandingPage/ItrLandingPage"));
const ItrFilingForEmployee = lazy(() => import("./Pages/ItrFilingForEmployee/ItrFilingForEmployee"));

const marketingFallback = <div style={{ minHeight: "100vh", background: "#fff" }} />;
const store = createStore(fintooReducer);

function IndexPageLayout() {
  return (
    <>
      <MainHeader />
      <Homepage />
      <Footer />
    </>
  );
}

export default function MarketingApp() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <Suspense fallback={marketingFallback}>
          <Routes>
            <Route path="/" element={<IndexPageLayout />} />
            <Route path="/financial-strategy" element={<FinancialPlanningPageCalendly formtype="otp" />} />
            <Route path="/financial-planning" element={<FinancialPlanningPageCalendly />} />
            <Route path="/personal-financial-strategy" element={<PersonalFinancialPlan formtype="otp" />} />
            <Route path="/personal-financial-planning" element={<PersonalFinancialPlan />} />
            <Route path="/wealth-management-strategy-for-indians-and-nri" element={<WealthManagementForIndianandNRI formtype="otp" />} />
            <Route path="/wealth-management-for-indians-and-nri" element={<WealthManagementForIndianandNRI />} />
            <Route path="/investment-advice" element={<InvestmentPlanningNew formtype="otp" />} />
            <Route path="/investment-planning" element={<InvestmentPlanningNew />} />
            <Route path="/financial-planning-strategy" element={<FinancialAdvicePage formtype="otp" />} />
            <Route path="/financial-advice" element={<FinancialAdvicePage />} />
            <Route path="/retirement-strategy" element={<RetirementPlanningNew formtype="otp" />} />
            <Route path="/retirement-planning" element={<RetirementPlanningNew />} />
            <Route path="/retirement-planner" element={<RetirementPlanner />} />
            <Route path="/investment-strategy" element={<InvestmentPlanningNewB />} />
            <Route path="/womoneya" element={<WomoneyaPage />} />
            <Route path="/womoneya-choice" element={<WomoneyaPage variant="association" />} />
            <Route path="/thankyou-page" element={<ThankYouPage />} />
            <Route path="/itr-filing-thankyou-page" element={<ItrFilingThankYouPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/portfolio-management-services" element={<PmsMarketingPage />} />
            <Route path="/itr-filing-partnerships" element={<ItrLandingPage />} />
            <Route
              path="/itr-filing-retail"
              element={<ItrFilingForEmployee enablePlanPurchase />}
            />
            <Route
              path="/itr-filing-corporate"
              element={
                <ItrFilingForEmployee
                  prices={["999", "2,499", "4,499"]}
                  bookingPageName="ITR Filing For Corporate"
                />
              }
            />
          </Routes>
        </Suspense>
      </HelmetProvider>
    </Provider>
  );
}
