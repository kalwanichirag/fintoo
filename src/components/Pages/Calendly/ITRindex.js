import SectionHeader from "../../SectionHeader";
import styles from "./style.module.css";
import commonStyles from "../../Layout/Fullpage/style.module.css";
import { useCalendlyEventListener, InlineWidget } from "react-calendly";
// import TaxData from "./TaxData.json";
import { fetchData } from "../../../common_utilities";
import { useEffect } from "react";
import Calendar from "./Calendar";

function AppointmentBox({eventCode, eventUrl, serviceName, extraParams, plan_id}) {
  useCalendlyEventListener({
    
    onEventScheduled: async (e) => {
      localStorage.setItem('eventURL', e.data.payload.invitee.uri);
      localStorage.setItem('extraParams', JSON.stringify(extraParams));
    },
    
  });


  return (
    <>
      <section
        className={`${styles["appointment-section"]} ${styles["ITR-Appointment"]} ${commonStyles["padding-class"]}`}
       
      >
        {/* <p className={`text-center ${styles.SectionTitle}`}>Confused?</p> */}
        <div className={`${styles["appointment-section-container1"]}`}>
          <div className={`${styles["appointment-section-iframe"]}`}>
            <div
              className="calendly-inline-widget"
              style={{
                width: "100%",
              }}
            >
              <Calendar planId={plan_id}   extraParams={extraParams} itrPage eventCode={eventCode} url={eventUrl} serviceName={serviceName} />
            </div>
            {/* <iframe src="https://calendly.com/fintoo/30-min-consultation-call-with-our-insurance-specialist?month=2023-03" width="100%" height="100%" frameBorder="0"></iframe> */}
          </div>
        </div>
      </section>
    </>
  );
}

export default AppointmentBox;
