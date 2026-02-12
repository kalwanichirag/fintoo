import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from "../../../SectionHeader";
function WidgetSection() {

    return (
        <>
        <section className={`${styles.WidgetSection}`}>
          <SectionHeader
          className="text-center"
          headerText={"Personalised Tax Planning Solutions for every Individual, Entrepreneur, Professional and Business. "}
        />
        </section>
            <section className={`${styles['widget-section']} ${commonStyles['padding-class']} pb-5 pt-5`}>
                <div className={`${styles['widget-section-container']}`}>
                    <div className={`${styles['widget-item']}`}>
                        <h3 className={`${styles['widget-item-heading']}`}>COMPREHENSIVE TAX PLANNING</h3>
                        <div className={`${styles['widget-item-content']} ${commonStyles['widget-content-text']}`} >Combining the innovative AI Technology with in-depth expert experience and knowledge, we deliver comprehensive tax planning solutions that not only help you to save tax, but also enable you to plan your tax for the entire year and create wealth in the long run.</div>
                    </div>
                </div>
                
                <br /><br />
                <div className={`${styles['widget-section-container']}`}>
                    <div className={`${styles['widget-item']}`}>
                        <h3 className={`${styles['widget-item-heading']}`}>COMPLETELY CUSTOMISED TAX PLAN</h3>
                        <div className={`${styles['widget-item-content']} ${commonStyles['widget-content-text']}`} >As your income, expenses and tax structure is unique, we create a completely customised plan that gives you an extremely precise and accurate solution that not only enables you to achieve your tax-saving goals, but also creates a strong base for you to pursue your goals related to financial planning, retirement planning and wealth creation.</div>
                    </div>
                </div>
               
            </section>
        </>
    )
}

export default WidgetSection
