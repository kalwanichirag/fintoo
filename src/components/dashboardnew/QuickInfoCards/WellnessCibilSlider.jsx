import { useEffect, useState } from "react";
import FinancialWellnessCard from "./FinancialWellnessCard";
import CibilContainer from "./CibilContainer";

const SLIDE_INTERVAL_MS = 7000;

export default function WellnessCibilSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

 

  return (
    <div className="tw-relative tw-h-full">
      <div className="tw-overflow-hidden tw-rounded-2xl tw-h-full">
        <div
          className="tw-flex tw-transition-transform tw-duration-500 tw-ease-out tw-h-full"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          <div className="tw-min-w-full tw-h-full">
            <FinancialWellnessCard />
          </div>
          <div className="tw-min-w-full tw-h-full">
            <CibilContainer />
          </div>
        </div>
      </div>

      <div className="tw-absolute tw-bottom-2 tw-left-1/2 tw--translate-x-1/2 tw-flex tw-items-center tw-gap-2 tw-z-10">
        <button
          type="button"
          onClick={() => setActiveIndex(0)}
          className={`tw-w-2 tw-h-2 tw-rounded-full tw-transition ${
            activeIndex === 0 ? "tw-bg-fintoo-blue" : "tw-bg-slate-300"
          }`}
          aria-label="Show financial wellness card"
        />
        <button
          type="button"
          onClick={() => setActiveIndex(1)}
          className={`tw-w-2 tw-h-2 tw-rounded-full tw-transition ${
            activeIndex === 1 ? "tw-bg-fintoo-blue" : "tw-bg-slate-300"
          }`}
          aria-label="Show cibil card"
        />
      </div>
    </div>
  );
}
