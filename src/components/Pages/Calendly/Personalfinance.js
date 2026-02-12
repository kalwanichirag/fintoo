import SectionHeader from "../../SectionHeader";
import styles from "./style.module.css";
import commonStyles from "../../Layout/Fullpage/style.module.css";
import { useCalendlyEventListener, InlineWidget } from "react-calendly";
// import TaxData from "./TaxData.json";
import { fetchData } from "../../../common_utilities";
import { useEffect } from "react";
import Calendar from "./Calendar";

function Personalfinance({ eventCode, eventUrl, serviceName, extraParams }) {

  return (
    <>
      <section
      style={{
        overflow : "hidden"
      }}
        className={`pt-2 ${styles["appointment-section"]} ${commonStyles["padding-class"]}`}
      >
        <div className="mb-5">
          <div className={`d-flex justify-content-center`}>
            <div
              className="calendly-inline-widget"
              style={{
                width: "100%",
                overflow : "hidden"
              }}
            >
              <Calendar extraParams={extraParams} eventCode={eventCode} url={eventUrl} serviceName={serviceName} />
            </div>
            {/* <iframe src="https://calendly.com/fintoo/30-min-consultation-call-with-our-insurance-specialist?month=2023-03" width="100%" height="100%" frameBorder="0"></iframe> */}
          </div>
        </div>
      </section>
      
    </>
  );
}

export default Personalfinance;
