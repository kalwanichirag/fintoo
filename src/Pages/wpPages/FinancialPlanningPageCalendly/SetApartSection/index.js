import styles from "./style.module.css";
import Styles from "../style.module.css";

import icon1 from "../../common/images/whyfintoo/whyfintoo1.svg"
import icon2 from "../../common/images/whyfintoo/whyfintoo2.svg"
import icon3 from "../../common/images/whyfintoo/whyfintoo3.svg"
import icon4 from "../../common/images/whyfintoo/whyfintoo4.svg"
import icon5 from "../../common/images/whyfintoo/whyfintoo5.svg"
import whyfintoodark1 from "../../common/images/whyfintoo/whyfintoodark1.svg"
import whyfintoodark2 from "../../common/images/whyfintoo/whyfintoodark2.svg"
import whyfintoodark3 from "../../common/images/whyfintoo/whyfintoodark3.svg"
import whyfintoodark4 from "../../common/images/whyfintoo/whyfintoodark4.svg"
import whyfintoodark5 from "../../common/images/whyfintoo/whyfintoodark5.svg"
import trackrecord from "../../common/images/whyfintoo/trackrecord.png"

const SetApartSection = () => {

    return (
        <section className={`${styles.SetApartSectionSection}`}>
            {/* <h2 className={`text-center ${styles.GlobalText2} ${Styles.desktopView}`} style={{ paddingBottom: '0' }}>
                What Sets Us Apart?
            </h2> */}
            <div className={`text-center ${styles.GlobalText2} ${Styles.mobileView}`} style={{ paddingBottom: '0', paddingTop: '1rem', textAlign: 'center', display: 'block' }}>
                Why Fintoo?
            </div>
            <div className={`${Styles.desktopView}`}>
                <br />
            </div>
            <div className={`${Styles.desktopView}`}>
                <div className={`${styles.flipCardContainer}`}>
                    <div className={styles.flipCard}>
                        <div className={styles.flipCardInner}>
                            <div className={styles.flipCardFront}>
                                <div className={styles.flipCardFrontIcon}>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                                Unbiased Advisory
                            </div>
                            <div className={styles.flipCardBack}>Virtuous and unbiased advisory while catering to fiduciary matters.</div>
                        </div>
                    </div>
                    <div className={styles.flipCard}>
                        <div className={styles.flipCardInner}>
                            <div className={styles.flipCardFront}>
                                <div className={styles.flipCardFrontIcon}>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                                Data Privacy & Security
                            </div>
                            <div className={styles.flipCardBack}>Adherence to privacy, data security, and transparency with end-to-end encryption technology.</div>
                        </div>
                    </div>
                    <div className={styles.flipCard}>
                        <div className={styles.flipCardInner}>
                            <div className={styles.flipCardFront}>
                                <div className={styles.flipCardFrontIcon}>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                                AI-Driven Portfolio Analysis
                            </div>
                            <div className={styles.flipCardBack}>A tech-driven system that performs real-time portfolio analysis to identify suitable opportunities.</div>
                        </div>
                    </div>
                    <div className={styles.flipCard}>
                        <div className={styles.flipCardInner}>
                            <div className={styles.flipCardFront}>
                                <div className={styles.flipCardFrontIcon}>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                                In-House Research Desk
                            </div>
                            <div className={styles.flipCardBack}>A robust in-house research team for real-time and dynamic portfolio monitoring.</div>
                        </div>
                    </div>
                    <div className={styles.flipCard}>
                        <div className={styles.flipCardInner}>
                            <div className={styles.flipCardFront}>
                                <div className={styles.flipCardFrontIcon}>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                                Zero Commission-Based Solutions
                            </div>
                            <div className={styles.flipCardBack}>A fee-only advisory ensuring unbiased advice spanning diversified investment solutions.</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${Styles.mobileView}`}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '10px', margin: '1rem', padding: '0.5rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)' }}>
                    <img style={{ width: '25px', marginRight: '1rem' }} src={whyfintoodark1} alt="" />
                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0F172A' }}>AI Portfolio Analysis</div>
                        <div style={{ fontSize: '1rem', color: '#0F172A' }}>Advanced AI-driven portfolio optimization</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '10px', margin: '1rem', padding: '0.5rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)' }}>
                    <img style={{ width: '25px', marginRight: '1rem' }} src={whyfintoodark2} alt="" />
                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0F172A' }}>In-House Research</div>
                        <div style={{ fontSize: '1rem', color: '#0F172A' }}>Dedicated research team for market insights</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '10px', margin: '1rem', padding: '0.5rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)' }}>
                    <img style={{ width: '25px', marginRight: '1rem' }} src={whyfintoodark3} alt="" />
                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0F172A' }}>Data Security</div>
                        <div style={{ fontSize: '1rem', color: '#0F172A' }}>Bank-grade security for your information</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '10px', margin: '1rem', padding: '0.5rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)' }}>
                    <img style={{ width: '25px', marginRight: '1rem' }} src={whyfintoodark4} alt="" />
                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0F172A' }}>Unbiased Advisory</div>
                        <div style={{ fontSize: '1rem', color: '#0F172A' }}>Independent advice with no hidden agenda</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '10px', margin: '1rem', padding: '0.5rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)' }}>
                    <img style={{ width: '25px', marginRight: '1rem' }} src={whyfintoodark5} alt="" />
                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0F172A' }}>Zero Commission</div>
                        <div style={{ fontSize: '1rem', color: '#0F172A' }}>Direct products with no commission bias</div>
                    </div>
                </div>
            </div>

            <div className={`${Styles.desktopView}`}>
                <br /><br />
            </div>
        </section>
    );
};

export default SetApartSection;
