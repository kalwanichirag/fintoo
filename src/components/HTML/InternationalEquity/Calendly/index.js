import SectionHeader from "../../../SectionHeader";
import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";

function AppointmentBox() {
  return (
    <>
      <section
        className={`${styles["appointment-section"]} ${commonStyles["padding-class"]}`}
      >
        <p className={`text-center ${styles.SectionTitle}`}>Confused?</p>
        <div className={`${styles["appointment-section-container"]}`}>
          <div className={` text-center ${styles["appointment-section-text"]}`}>
            Wondering If Investing In International Equity Is The Right Choice
            For You And How Will It Benefit You?

            
            <br />
            {/* Connect with our investment expert over a 15-minute complimentary
              call */}
          </div>
          <div className={`${styles["appointment-section-iframe"]}`}>
            <iframe
              src="https://calendly.com/fintoo/15-minutes-consultation-tax-planning?embed_domain=www.fintoo.in&amp;embed_type=Inline&amp;hide_event_type_details=1&amp;hide_gdpr_banner=1"
              width="100%"
              height="100%"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}

export default AppointmentBox;
