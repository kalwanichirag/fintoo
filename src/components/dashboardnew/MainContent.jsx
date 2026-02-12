import QuickInfoCards from "./QuickInfoCards";
import AssetAllocationCard from "./AssestAllocationCard";
import SavingsGoals from "./SavingsGoals";
import FinancialOverview from "./FinancialOverview";
import CalculatorsPreview from "./Calculators";
import "../../components/Insurance/tailwind.css"
import LiabilityOverview from "./LiabitlityOverview";

export default function MainDashboard() {
  return (
    <>
      <div className=" ">
          <QuickInfoCards />
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-3 tw-mb-4">
          <div className="lg:tw-col-span-4 glass-card tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-100">
            <AssetAllocationCard   key="asset-allocation" state={"filled"} />
          </div>
          <div className="lg:tw-col-span-8 glass-card tw-relative tw-rounded-2xl tw-bg-white/60 tw-backdrop-blur-md tw-border tw-border-slate-200 tw-shadow-sm">
            <FinancialOverview key="financial-overview"  />
          </div>
          <div className="lg:tw-col-span-4 tw-glass-card tw-relative tw-rounded-2xl tw-p-6 tw-bg-white/60 tw-backdrop-blur-md tw-border tw-border-slate-200 tw-shadow-sm">
            <LiabilityOverview/>
</div>
          <div className="lg:tw-col-span-8 tw-glass-card tw-relative tw-rounded-2xl tw-p-6 tw-bg-white/60 tw-backdrop-blur-md tw-border tw-border-slate-200 tw-shadow-sm">
            <SavingsGoals />
        </div>
          
           </div>
        <div className="tw-mt-6">
          <CalculatorsPreview />
        </div>
      </div>
    </>

  );
}
