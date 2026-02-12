import { SlCheck } from "react-icons/sl";
import SectionHeader from "../../../SectionHeader";
import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";

function EndToEndSolutionSection() {

    return (
        <>
            <section className={`${styles['end-to-end-solution-section']} ${commonStyles['padding-class']}`}>
                <SectionHeader headerText={'NRI Taxation'} />
                <br /><br />
                <div className={`${styles['end-to-end-solution-continer']} `}>
                    <div className={`${styles['end-to-end-solution-item']} `}>
                        <div className={`${styles['end-to-end-solution-item-icon']} `}>
                            <SlCheck />
                        </div>
                        <div className={`${styles['end-to-end-solution-item-content']} `}>

                            Individual Tax Filing
                        </div>
                    </div>
                    <div className={`${styles['end-to-end-solution-item']} `}>
                        <div className={`${styles['end-to-end-solution-item-icon']} `}>
                            <SlCheck />
                        </div>
                        <div className={`${styles['end-to-end-solution-item-content']} `}>
                            Lower/NIL TDS deduction certificate
                        </div>
                    </div>
                    <div className={`${styles['end-to-end-solution-item']} `}>
                        <div className={`${styles['end-to-end-solution-item-icon']} `}>
                            <SlCheck />
                        </div>
                        <div className={`${styles['end-to-end-solution-item-content']} `}>

                            {'Repatriation of Funds (including 15CA/15CB Certificates)'}
                        </div>
                    </div>
                    <div className={`${styles['end-to-end-solution-item']} `}>
                        <div className={`${styles['end-to-end-solution-item-icon']} `}>
                            <SlCheck />
                        </div>
                        <div className={`${styles['end-to-end-solution-item-content']} `}>

                            Gift Provisions
                        </div>
                    </div>
                    <div className={`${styles['end-to-end-solution-item']} `}>
                        <div className={`${styles['end-to-end-solution-item-icon']} `}>
                            <SlCheck />
                        </div>
                        <div className={`${styles['end-to-end-solution-item-content']} `}>
                            {'NRI Tax Advisory (including DTAA)'}
                        </div>
                    </div>
                    <div className={`${styles['end-to-end-solution-item']} `}>
                        <div className={`${styles['end-to-end-solution-item-icon']} `}>
                            <SlCheck />
                        </div>
                        <div className={`${styles['end-to-end-solution-item-content']} `}>

                            NRI Property Transaction
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default EndToEndSolutionSection
