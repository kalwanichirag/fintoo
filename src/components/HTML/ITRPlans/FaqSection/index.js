import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from '../../../SectionHeader';
import FaqAccordian from "./faqAccordian";

function FaqSection() {

    return (
        <>
            <section className={`${styles['faq-section']} pb-5`} >
                {/* <Sectio nHeader headerText={'FAQs'} /> */}
                <FaqAccordian />
            </section>
        </>
    )
}

export default FaqSection
