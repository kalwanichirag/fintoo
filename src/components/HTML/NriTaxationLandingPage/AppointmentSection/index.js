import SectionHeader from "../../../SectionHeader";
import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";

function AppointmentSection() {

    return (
        <>
            <section className={`${styles['appointment-section']} ${commonStyles['padding-class']}`}>
            <p className={`text-center ${styles.SectionTitle}`}>
               Confused?
                </p>
                <br /><br />
                <div className={`${styles['appointment-section-container']}`}>
                    <div className={`${styles['appointment-section-text']}`}>Book A Complimentary 15 Minutes Consultation With Our Tax Expert To Know How.</div>
                    <div className={`${styles['appointment-section-iframe']}`}>
                        <iframe src="https://calendly.com/fintoo/15-minutes-consultation-tax-planning?embed_domain=www.fintoo.in&amp;embed_type=Inline&amp;hide_event_type_details=1&amp;hide_gdpr_banner=1" width="100%" height="100%" frameBorder="0"></iframe>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AppointmentSection
