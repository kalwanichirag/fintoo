import styles from "./style.module.css";
import icon1 from "../../common/images/wedeliver/wedeliver1.svg"
import icon2 from "../../common/images/wedeliver/wedeliver2.svg"
import icon3 from "../../common/images/wedeliver/wedeliver3.svg"
import icon4 from "../../common/images/wedeliver/wedeliver4.svg"
import icon5 from "../../common/images/wedeliver/wedeliver5.svg"
import icon6 from "../../common/images/wedeliver/wedeliver6.svg"
import coloricon1 from "../../common/images/wedeliver/wedelivercolor1.svg"
import coloricon2 from "../../common/images/wedeliver/wedelivercolor2.svg"
import coloricon3 from "../../common/images/wedeliver/wedelivercolor3.svg"
import coloricon4 from "../../common/images/wedeliver/wedelivercolor4.svg"
import coloricon5 from "../../common/images/wedeliver/wedelivercolor5.svg"
import coloricon6 from "../../common/images/wedeliver/wedelivercolor6.svg"
import Styles from "../style.module.css";
import AccordianWP from "../../common/AccordianWP";

const accordionData = [
    {
        heading: "Financial Planning",
        content: "Comprehensive roadmap for your financial future",
        icon: coloricon1
    },
    {
        heading: "Tax Planning",
        content: "Optimize your tax efficiency and savings",
        icon: coloricon2
    },
    {
        heading: "Investment Planning",
        content: "Strategic investment portfolio management",
        icon: coloricon3
    },
    {
        heading: "Retirement Planning",
        content: "Professional equity portfolio management",
        icon: coloricon4
    },
    {
        heading: "Equity management",
        content: "Secure your golden years with smart planning",
        icon: coloricon5
    },
    {
        heading: "Risk Management",
        content: "Protect your wealth with comprehensive insurance",
        icon: coloricon6
    }
];


const WeDeliver = ({ scrollToForm }) => {

    return (
        <section className={`${styles.WeDeliverSection}`}>
            <div className={`${Styles.desktopView}`}>
                <div className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0' }}>
                    We Deliver
                </div>
            </div>

            <div className={`${Styles.mobileView}`}>
                <div className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0', color: 'black' }}>
                    We Deliver
                </div>
            </div>

            <br />
            <div className={`${Styles.desktopView}`}>
                <div className="container">
                    <div className={`${styles.WeDeliverSectionItemContainer}`}>
                        <div className={`${styles.fadeInLeft} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '40px' }}>
                                <img style={{ width: '100%' }} src={icon1} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Financial Planning</h4>
                                <p>An expert-curated personalised financial plan that helps you navigate the best way to achieve your goals.</p>
                            </div>
                        </div>
                        <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '40px' }}>
                                <img style={{ width: '100%' }} src={icon2} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Tax Planning</h4>
                                <p>Complete tax planning guidance to ensure maximum savings.</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.WeDeliverSectionItemContainer}`}>
                        <div className={`${styles.fadeInLeft} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '40px' }}>
                                <img style={{ width: '100%' }} src={icon3} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Investment Planning</h4>
                                <p>Step-by-step assistance in making and managing the right investments based on your risk profile, preferences, and needs.</p>
                            </div>
                        </div>
                        <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '40px' }}>
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
                            <div style={{ width: '40px' }}>
                                <img style={{ width: '100%' }} src={icon5} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Equity management</h4>
                                <p>Private equity management for effective wealth creation.</p>
                            </div>
                        </div>
                        <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '40px' }}>
                                <img style={{ width: '100%' }} src={icon6} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Risk Management</h4>
                                <p>Get tailored protection and risk management solutions to mitigate risk exposures.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${Styles.mobileView}`}>
                <AccordianWP accordionData={accordionData} />
            </div>
            <br />
        </section>
    );
};

export default WeDeliver;
