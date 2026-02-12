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
        heading: "Investment & Wealth Management",
        content: "Tailored portfolios across domestic & global markets.",
        icon: coloricon1
    },
    {
        heading: "Personal Investment Management",
        content: "Diversified solutions beyond standard products.",
        icon: coloricon2
    },
    {
        heading: "Tax & Financial Advisory",
        content: "Structuring for tax efficiency & legacy planning.",
        icon: coloricon3
    },
    {
        heading: "Financial Goal Planning",
        content: "Aligning investments with lifestyle, retirement & legacy goals.",
        icon: coloricon4
    },
    {
        heading: "Equity management",
        content: "Private equity management for effective wealth creation.",
        icon: coloricon5
    },
    {
        heading: "Professional Financial Advisors",
        content: "Guided by licensed financial advisors & CFP certified financial planners.",
        icon: coloricon6
    }
];


const WeDeliver = ({ scrollToForm }) => {

    return (
        <section className={`${styles.WeDeliverSection}`}>
            <div className={`${Styles.desktopView}`}>
                <div className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0' }}>
                   Our Expertise

                </div>
                <p className={`text-center text-white ${styles.para}`}>
                    Comprehensive Wealth & Investment Planning Services

                </p>
            </div>

            <div className={`${Styles.mobileView}`}>
                <div className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0', color: 'black' }}>
                  Our Expertise

                </div>
                                 <p className="text-center ">

                    Comprehensive Wealth & Investment Planning Services

                </p>
            </div>

            <br />
            <div className={`${Styles.desktopView}`}>
                <div className="container">
                    <div className={`${styles.WeDeliverSectionItemContainer}`}>
                        <div className={`${styles.fadeInLeft} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '50px' }}>
                                <img style={{ width: '100%' }} src={icon1} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Investment & Wealth Management</h4>
                                <p>Tailored portfolios across domestic & global markets.</p>
                            </div>
                        </div>
                        <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '50px' }}>
                                <img style={{ width: '100%' }} src={icon2} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Personal Investment Management</h4>
                                <p>Diversified solutions beyond standard products.</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.WeDeliverSectionItemContainer}`}>
                        <div className={`${styles.fadeInLeft} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '50px' }}>
                                <img style={{ width: '100%' }} src={icon3} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Tax & Financial Advisory</h4>
                                <p>Structuring for tax efficiency & legacy planning.</p>
                            </div>
                        </div>
                        <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '50px' }}>
                                <img style={{ width: '100%' }} src={icon4} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Financial Goal Planning</h4>
                                <p>Aligning investments with lifestyle, retirement & legacy goals.</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.WeDeliverSectionItemContainer}`}>
                        <div className={`${styles.fadeInLeft} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '50px' }}>
                                <img style={{ width: '100%' }} src={icon5} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Equity management</h4>
                                <p>Private equity management for effective wealth creation.</p>
                            </div>
                        </div>
                        <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '50px' }}>
                                <img style={{ width: '100%' }} src={icon6} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Professional Financial Advisors</h4>
                                <p>Guided by licensed financial advisors & CFP certified financial planners.</p>
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
