import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import cardImg1 from './assets/cardImg1.svg'
import cardImg2 from './assets/cardImg2.svg'
import cardImg3 from './assets/cardImg3.svg'
import cardImg4 from './assets/cardImg4.svg'
import SectionHeader from "../../../SectionHeader";

function WhyTrustUsSection() {

    return (
        <>
            <section className={`${styles['why-trust-us-section']} ${commonStyles['padding-class']}`}>
                <SectionHeader headerText={'Why Us'} />
                <br /><br />
                <div className={`${styles['why-trust-us-section-items-container']}`}>
                    <div className={`${styles['why-trust-us-section-item']} ${styles['flex-item-left']}`}>
                        <div className={`${styles['why-trust-us-section-item-icon']}`}>
                            <div style={{ width: '50px' }}>
                                <img style={{ width: '100%' }} src={cardImg1} alt="" />
                            </div>
                        </div>
                        <div>
                            <div className={`${styles['why-trust-us-section-item-heading']}`}>
                                TEAM OF QUALIFIED & EXPERIENCED CAs
                            </div>
                            <div className={`${styles['why-trust-us-section-item-content']}`}>
                                Having extensive experience in managing NRI Taxation, our team of CAs ensures you timely and accurate solutions.
                            </div>
                        </div>
                    </div>
                    <div className={`${styles['why-trust-us-section-item']} ${styles['flex-item-right']}`}>
                        <div>
                            <div className={`${styles['why-trust-us-section-item-heading']}`}>
                                END-TO-END SUPPORT
                            </div>
                            <div className={`${styles['why-trust-us-section-item-content']}`}>
                                Personalised advisory and compliance services that cover all aspects of NRI Taxation like Income Tax, DTAA, Foreign Exchange Management Act, FERA, FCRA, Companies Act and more.
                            </div>
                        </div>
                        <div className={`${styles['why-trust-us-section-item-icon']}`}>
                            <div style={{ width: '50px' }}>
                                <img style={{ width: '100%' }} src={cardImg2} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className={`${styles['why-trust-us-section-item']} ${styles['flex-item-left']}`}>
                        <div className={`${styles['why-trust-us-section-item-icon']}`}>
                            <div style={{ width: '50px' }}>
                                <img style={{ width: '100%' }} src={cardImg4} alt="" />
                            </div>
                        </div>
                        <div>
                            <div className={`${styles['why-trust-us-section-item-heading']}`}>
                                COMPLETE PRIVACY AND SECURITY
                            </div>
                            <div className={`${styles['why-trust-us-section-item-content']}`}>
                                We at Fintoo completely understand the importance of the information and therefore, we use only the latest and the most trusted security system to ensure utmost secrecy and maximum protection.
                            </div>
                        </div>
                    </div>
                </div>
                <br /><br />
            </section>
        </>

    )
}

export default WhyTrustUsSection
