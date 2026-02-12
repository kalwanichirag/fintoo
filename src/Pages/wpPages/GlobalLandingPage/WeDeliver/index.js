
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
                            <h4>Investment Planning</h4>
                            <p>Step-by-step assistance in making and managing the right investments based on your risk profile, preferences, and needs.</p>
                        </div>
                    </div>
                    <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                        <div style={{ width: '100px' }}>
                            <img style={{ width: '100%' }} src={icon2} alt="" />
                        </div>
                        <div style={{ width: '100%' }}>
                            <h4>Global Private Wealth Management</h4>
                            <p>Innovative and impartial investment advisory services, covering diverse asset classes, cross-border estate planning, and tailored solutions for multigenerational families with global assets.</p>
                        </div>
                    </div>
                </div>
                <div className={`${styles.WeDeliverSectionItemContainer}`}>
                    <div className={`${styles.fadeInLeft} ${styles.WeDeliverSectionItem}`}>
                        <div style={{ width: '100px' }}>
                            <img style={{ width: '100%' }} src={icon3} alt="" />
                        </div>
                        <div style={{ width: '100%' }}>
                            <h4>Equity management</h4>
                            <p>Personalized and bespoke equity management for effective wealth creation</p>
                        </div>
                    </div>
                    <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                        <div style={{ width: '100px' }}>
                            <img style={{ width: '100%' }} src={icon4} alt="" />
                        </div>
                        <div style={{ width: '100%' }}>
                            <h4>Risk Management</h4>
                            <p>Get tailored protection and risk management solutions to mitigate risk exposures.</p>
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
                                ESOP and RSU Management</h4>
                            <p>Streamline your ESOP and RSU management with our global wealth management services, ensuring seamless tracking and optimization of your equity holdings.</p>
                        </div>
                    </div>
                    <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                        <div style={{ width: '100px' }}>
                            <img style={{ width: '100%' }} src={icon6} alt="" />
                        </div>
                        <div style={{ width: '100%' }}>
                            <h4>Invest in Global Markets</h4>
                            <p>Get tailored financial advice designed for Indian investors looking to navigate global markets, including the US stock market. Our expert insights help you make informed investment decisions for long-term wealth growth.</p>
                        </div>
                    </div>
                </div>
            </div>
            <br />
        </section>
    );
};

export default WeDeliver;
