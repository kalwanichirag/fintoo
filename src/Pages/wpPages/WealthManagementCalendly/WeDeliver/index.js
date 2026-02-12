
import styles from "./style.module.css";
import icon1 from "../images/icon-page-list.png"
import icon2 from "../images/icon-page.png"
import icon3 from "../images/icon-handshake.png"
import icon4 from "../images/icon-onepage-scroll.png"
import icon5 from "../images/icon-User.png"
import icon6 from "../images/icon-progress-bar.png"

const WeDeliver = ({ scrollToForm }) => {

    return (
        <section className={`${styles.WeDeliverSection}`}>
            <div className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0' }}>
                We Deliver
            </div>
            <br />
            <div className="container">
                <div className={`${styles.WeDeliverSectionItemContainer}`}>
                    <div className={`${styles.fadeInLeft} ${styles.WeDeliverSectionItem}`}>
                        <div style={{ width: '100px' }}>
                            <img style={{ width: '100%' }} src={icon1} alt="" />
                        </div>
                        <div style={{ width: '100%' }}>
                            <h4>Financial Planning</h4>
                            <p>An expert-curated personalised financial plan that helps you navigate the best way to achieve your goals.</p>
                        </div>
                    </div>
                    <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                        <div style={{ width: '100px' }}>
                            <img style={{ width: '100%' }} src={icon2} alt="" />
                        </div>
                        <div style={{ width: '100%' }}>
                            <h4>Wealth Management</h4>
                            <p>Comprehensive wealth management with personalized approach to help you grow your investment portfolio.</p>
                        </div>
                    </div>
                </div>
                <div className={`${styles.WeDeliverSectionItemContainer}`}>
                    <div className={`${styles.fadeInLeft} ${styles.WeDeliverSectionItem}`}>
                        <div style={{ width: '100px' }}>
                            <img style={{ width: '100%' }} src={icon3} alt="" />
                        </div>
                        <div style={{ width: '100%' }}>
                            <h4>Investment Planning</h4>
                            <p>Step-by-step assistance in making and managing the right investments based on your risk profile, preferences, and needs.</p>
                        </div>
                    </div>
                    <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                        <div style={{ width: '100px' }}>
                            <img style={{ width: '100%' }} src={icon4} alt="" />
                        </div>
                        <div style={{ width: '100%' }}>
                            <h4>Retirement Planning</h4>
                            <p>Retire on your terms and live a financially secure retired life with your desired income.</p>
                        </div>
                    </div>
                </div>
                <div className={`${styles.WeDeliverSectionItemContainer}`}>
                    <div className={`${styles.fadeInLeft} ${styles.WeDeliverSectionItem}`}>
                        <div style={{ width: '100px' }}>
                            <img style={{ width: '100%' }} src={icon5} alt="" />
                        </div>
                        <div style={{ width: '100%' }}>
                            <h4>
                                Equity management</h4>
                            <p>Private equity management for effective wealth creation.</p>
                        </div>
                    </div>
                    <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                        <div style={{ width: '100px' }}>
                            <img style={{ width: '100%' }} src={icon6} alt="" />
                        </div>
                        <div style={{ width: '100%' }}>
                            <h4>Risk Management</h4>
                            <p>Get tailored protection and risk management solutions to mitigate risk exposures.</p>
                        </div>
                    </div>
                </div>
            </div>
            <br />
        </section>
    );
};

export default WeDeliver;
