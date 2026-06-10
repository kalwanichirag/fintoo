import NetWorthCard from "./NetWorthCard";
import MutualFundCard from "./MutualFundCard";
import StockCard from "./StockCard";
import WellnessCibilSlider from "./WellnessCibilSlider";
import CibilContainer from "./CibilContainer";

export default function QuickInfoCards({
  networthState = "empty",
  mfState = "filled",
  stockState = "empty",
  cibilState = "filled"
}) {
  return (
    <section
      id="quick-info-cards"
      className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-4 tw-gap-2 md:tw-gap-3 tw-mb-3 md:tw-mb-4"
    >
      <NetWorthCard state={networthState} />
      <MutualFundCard state={mfState} />
      <StockCard state={stockState} />
      {/* <WellnessCibilSlider /> */}
      <CibilContainer/>
    </section>
  );
}
