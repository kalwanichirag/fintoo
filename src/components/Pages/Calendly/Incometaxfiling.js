import SectionHeader from "../../SectionHeader";
import styles from "./style.module.css";
import commonStyles from "../../Layout/Fullpage/style.module.css";
import { useCalendlyEventListener, InlineWidget } from "react-calendly";
// import TaxData from "./TaxData.json";
import { fetchData } from "../../../common_utilities";
import { useEffect } from "react";
import Calendar from "./Calendar";

function Incometaxfiling({eventCode, eventUrl, serviceName, extraParams}) {
  
  return (
    <>
      <section
        className={`${styles["appointment-section"]} ${commonStyles["padding-class"]}`}
      >
        {/* <p className={`text-center ${styles.SectionTitle}`}>Confused?</p> */}
        <div className={`${styles["appointment-section-container"]}`}>
          <div style={{
            color : "#042b62"
          }} className={`text-center ${styles["ITR-appointment-section-text"]}`}>
         <span className={`${styles["appointment-section-sub-text"]}`}> Need more information?</span>
          {/* <br /> */}
        <span> Connect with tax experts at your preferred date and time to get all your doubts resolved. </span>
          </div>
          <div className={`${styles["appointment-section-iframe"]}`}>
            <div
              className="calendly-inline-widget"
              style={{
                width: "100%",
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

export default Incometaxfiling;
