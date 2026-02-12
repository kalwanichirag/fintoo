import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from '../../../SectionHeader';
import FaqAccordian from "./faqAccordian";

function FaqSection() {

    return (
        <>
            <section className={`${styles['faq-section']} ${commonStyles['padding-class']} pb-5 pt-5`}>
                <SectionHeader headerText={'FAQs'} />
                <FaqAccordian />
            </section>
        </>
    )
}

export default FaqSection
