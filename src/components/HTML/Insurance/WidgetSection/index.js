import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";

function WidgetSection() {

    return (
        <>
            <section className={`${styles['widget-section']} ${commonStyles['padding-class']} pb-5 pt-5`}>
                <div className={`${styles['widget-section-container']}`}>
                    <div className={`${styles['widget-item']}`}>
                        <h3 className={`${styles['widget-item-heading']}`}>Extensive Experience</h3>
                        <div className={`${styles['widget-item-content']} ${commonStyles['widget-content-text']}`} >Our team of experts has an average experience of more than 10 years and together we have served more than 1,00,000+ clients with a total sum insured of more than 1000 Cr.</div>
                    </div>
                </div>
                <br /><br />
                <div className={`${styles['widget-section-container']}`}>
                    <div className={`${styles['widget-item']}`}>
                        <h3 className={`${styles['widget-item-heading']}`}>Personalised And Effective Solutions</h3>
                        <div className={`${styles['widget-item-content']} ${commonStyles['widget-content-text']}`} >Our team believes in going beyond just selling insurance products, and instead, gives you a personalised and comprehensive solution that is practically useful and beneficial for you.</div>
                    </div>
                </div>
                <br /><br />
                <div className={`${styles['widget-section-container']}`}>
                    <div className={`${styles['widget-item']}`}>
                        <h3 className={`${styles['widget-item-heading']}`}>Industry Relations</h3>
                        <div className={`${styles['widget-item-content']} ${commonStyles['widget-content-text']}`} >Our trusted relationship with the industry’s most respected and trustworthy insurance companies enables us to find the best insurance plan for you at an exceptional price. Moreover, our relations also help us to offer you an additional support during the claim process.</div>
                    </div>
                </div>
                <br /><br />
                <div className={`${styles['widget-section-container']}`}>
                    <div className={`${styles['widget-item']}`}>
                        <h3 className={`${styles['widget-item-heading']}`}>Timely Reviews</h3>
                        <div className={`${styles['widget-item-content']} ${commonStyles['widget-content-text']}`} >At regular intervals or right after any major changes in your requirements, we review the insurance plans to look for any coverage gaps, saving opportunities and additional benefits without any extra payment.</div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default WidgetSection
