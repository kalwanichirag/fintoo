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
        heading: "Discretion and confidentiality at every step",
        content: "",
        icon: coloricon1
    },
    {
        heading: "Access to top financial advisor insights with boutique-level personalization",
        content: "",
        icon: coloricon2
    },
    {
        heading: "Global perspective with a strong India focus",
        content: "",
        icon: coloricon3
    },
    {
        heading: "Support from senior financial advisors and women financial advisors for a diverse perspective",
        content: "",
        icon: coloricon4
    },
    
];


const WhyHniTrustFintoo = ({ scrollToForm }) => {

    return (
        <section className={`${styles.WeDeliverSection}`}>
            <div className={`${Styles.desktopView}`}>
                <div className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0' }}>
                  Why HNIs Trust Fintoo


                </div>
                               <p className={`text-center text-white ${styles.para}`}>

Your Partner for Generational Wealth

                </p>
            </div>

            <div className={`${Styles.mobileView}`}>
                <div className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0', color: 'black' }}>
               Why HNIs Trust Fintoo


                </div>
                                 <p className="text-center ">

Your Partner for Generational Wealth

                </p>
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
                                <h4>Discretion and confidentiality at every step
</h4>
                            </div>
                        </div>
                        <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '40px' }}>
                                <img style={{ width: '100%' }} src={icon2} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Access to top financial advisor insights with boutique-level personalization
</h4>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.WeDeliverSectionItemContainer}`}>
                        <div className={`${styles.fadeInLeft} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '40px' }}>
                                <img style={{ width: '100%' }} src={icon3} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Global perspective with a strong India focus
</h4>
                            </div>
                        </div>
                        <div className={`${styles.fadeInRight} ${styles.WeDeliverSectionItem}`}>
                            <div style={{ width: '40px' }}>
                                <img style={{ width: '100%' }} src={icon4} alt="" />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h4>Support from senior financial advisors and women financial advisors for a diverse perspective</h4>
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

export default WhyHniTrustFintoo;
