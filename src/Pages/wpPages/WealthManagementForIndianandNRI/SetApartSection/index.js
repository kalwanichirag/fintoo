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
            <h2 className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0' }}>
               Why Choose Fintoo

            </h2>

                <p className={`text-center mb-0  ${styles.para}`}>
                India’s Top-Rated Financial Advisors, At Your Service

            </p>
                <p className={`text-center  ${styles.para}`}>
              As a leading <b>  financial advisor firm</b>, Fintoo delivers personalized wealth strategies through:



        </p>
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
                               Certified Financial Advisors
                            </div>
                            <div className={styles.flipCardBack}>Dedicated personal financial planners and certified financial advisors.</div>
                        </div>
                    </div>
                    <div className={styles.flipCard}>
                        <div className={styles.flipCardInner}>
                            <div className={styles.flipCardFront}>
                                <div className={styles.flipCardFrontIcon}>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                               Investment & Wealth Management
                            </div>
                            <div className={styles.flipCardBack}>Expertise across investment and wealth management, estate planning, and taxation.</div>
                        </div>
                    </div>
                    <div className={styles.flipCard}>
                        <div className={styles.flipCardInner}>
                            <div className={styles.flipCardFront}>
                                <div className={styles.flipCardFrontIcon}>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                                Fee-Based Financial Planning
                            </div>
                            <div className={styles.flipCardBack}>Transparent, fee-based financial planning advisor services.</div>
                        </div>
                    </div>
                    <div className={styles.flipCard}>
                        <div className={styles.flipCardInner}>
                            <div className={styles.flipCardFront}>
                                <div className={styles.flipCardFrontIcon}>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                                Serving HNIs, UHNWIs, and global NRIs
                            </div>
                            <div className={styles.flipCardBack}>Proven track record serving HNIs, UHNWIs, and global NRIs.</div>
                        </div>
                    </div>
                   
                </div>
            </div>

            <div className={`${Styles.mobileView}`}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '10px', margin: '1rem', padding: '0.5rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)' }}>
                    <img style={{ width: '25px', marginRight: '1rem' }} src={whyfintoodark1} alt="" />
                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0F172A' }}>Certified Financial Advisors</div>
                        <div style={{ fontSize: '1rem', color: '#0F172A' }}>Dedicated personal financial planners and certified financial advisors.
</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '10px', margin: '1rem', padding: '0.5rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)' }}>
                    <img style={{ width: '25px', marginRight: '1rem' }} src={whyfintoodark2} alt="" />
                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0F172A' }}>Investment & Wealth Management</div>
                        <div style={{ fontSize: '1rem', color: '#0F172A' }}>Expertise across investment and wealth management, estate planning, and taxation.
</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '10px', margin: '1rem', padding: '0.5rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)' }}>
                    <img style={{ width: '25px', marginRight: '1rem' }} src={whyfintoodark3} alt="" />
                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0F172A' }}>Fee-Based Financial Planning</div>
                        <div style={{ fontSize: '1rem', color: '#0F172A' }}>Transparent, fee-based financial planning advisor services.
</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '10px', margin: '1rem', padding: '0.5rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)' }}>
                    <img style={{ width: '25px', marginRight: '1rem' }} src={whyfintoodark4} alt="" />
                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0F172A' }}>Serving HNIs, UHNWIs, and global NRIs</div>
                        <div style={{ fontSize: '1rem', color: '#0F172A' }}>Proven track record serving HNIs, UHNWIs, and global NRIs.</div>
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
