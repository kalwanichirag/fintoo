import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";

function WhyTaxPlanningSection() {

    return (
        <>
            <section className={`${styles['why-tax-planning-section']} ${commonStyles['padding-class']}`}>
                <h2 className={`${styles['why-tax-planning-section-title']}`}>Personalised Tax Planning Solutions for every Individual,
              Entrepreneur, Professional and Business.</h2>
                <div className={`${styles['why-tax-planning-section-container']}`} >
                    <div className={`${styles['why-tax-planning-section-item']}`} >
                        <div className={`${styles['why-tax-planning-section-item-heading']}`} >
                            <span>COMPREHENSIVE TAX PLANNING</span>
                        </div>
                        <div className={`${styles['why-tax-planning-section-item-content']}`} >
                            <span>Combining the innovative AI Technology with in-depth expert experience and knowledge, we deliver comprehensive tax planning solutions that not only help you to save tax, but also enable you to plan your tax for the entire year and create wealth in the long run.</span>
                        </div>
                    </div>
                    <div className={`${styles['why-tax-planning-section-item']} ${styles['borderxy']}`} >
                        <div className={`${styles['why-tax-planning-section-item-heading']}`} >
                        <span>COMPLETELY CUSTOMISED TAX PLAN</span>
                        </div>
                        <div className={`${styles['why-tax-planning-section-item-content']}`} >
                        <span>As your income, expenses and tax structure is unique, we create a completely customised plan that gives you an extremely precise and accurate solution that not only enables you to achieve your tax-saving goals, but also creates a strong base for you to pursue your goals related to financial planning, retirement planning and wealth creation.</span>
                     </div>
                    </div>
                    <div className={`${styles['why-tax-planning-section-item']} ${styles['border-x-y']}`} >
                        
                    </div>
                    {/* <div className={`${styles['why-tax-planning-section-item']} ${styles['borderx-y']}`} >
                        
                    </div> */}
                </div>
            </section>
        </>
    )
}

export default WhyTaxPlanningSection
