import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Homepage from "./Pages";
import PersonalFinancialPlan from "./Pages/wpPages/Personal-financial-Planning";
import WealthManagementForIndianandNRI from "./Pages/wpPages/WealthManagementForIndianandNRI";
import FinancialPlanningPageCalendly from "./Pages/wpPages/FinancialPlanningPageCalendly";
import RetirementPlanningNew from "./Pages/retirement-planning/RetirementPlanningNew";
import InvestmentPlanningNew from "./Pages/Invest-planning/InvestmentPlannning";
import FinancialAdvicePage from "./Pages/financialadvicepage";
import InvestmentPlanningNewB from "./Pages/Invest-planning-b/InvestmentPlannning";

export default function MarketingApp() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/financial-strategy" element={<FinancialPlanningPageCalendly formtype="otp" />} />
        <Route path="/financial-planning" element={<FinancialPlanningPageCalendly />} />
        <Route path="/personal-financial-strategy" element={<PersonalFinancialPlan  formtype="otp"/>} />
        <Route path="/personal-financial-planning" element={<PersonalFinancialPlan />} />
        <Route path="/wealth-management-strategy-for-indians-and-nri" element={<WealthManagementForIndianandNRI formtype="otp"/>} />
        <Route path="/wealth-management-for-indians-and-nri" element={<WealthManagementForIndianandNRI />} />
        <Route path="/investment-advice" element={<InvestmentPlanningNew formtype="otp" />} />
        <Route path="/investment-planning" element={<InvestmentPlanningNew />} />
        <Route path="/financial-planning-strategy" element={<FinancialAdvicePage formtype="otp"/>} />
        <Route path="/financial-advice" element={<FinancialAdvicePage />} />
        <Route path="/retirement-strategy" element={<RetirementPlanningNew formtype="otp"/>} />
        <Route path="/retirement-planning" element={<RetirementPlanningNew />} />
        <Route path="/investment-strategy" element={<InvestmentPlanningNewB />} />

      </Routes>
    </HelmetProvider>
  );
}
