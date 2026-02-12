import { useLocation } from "react-router-dom";
import Styles from "./style.module.css";
import React from "react";

const BannerSection = ({ scrollToForm, scrollToNextSection }) => {

    const location = useLocation();

    const landingPageLocation = location.pathname;


    const getBannerText = (currLocation) => {
        const normalizedPath = currLocation.replace(/\/$/, '');
        switch (normalizedPath) {
            case '/web/wealth-management-consultation-landing-page-calendly':
                return (
                    <>
                        <h1 className={`${Styles.SpaceReduce}`}>
                            Get your Goal-Driven Investment Plan.<br />Crafted by Qualified Wealth Managers.
                        </h1>
                        <p>
                            Delivering reliable financial advice based on extensive market research and a personalized approach.
                        </p>
                    </>
                )
            case '/web/wealth-management-consultation-landing-page-calendly-fintoo5':
                return (
                    <>
                        <h1 className={`${Styles.SpaceReduce}`}>
                            Bespoke Wealth Management By Qualified Wealth Advisors.
                        </h1>
                        <p>
                            20+ Years In Business. Delivered goal-based financial advice to 2.5 Lac+ Indians & NRIs.
                        </p>
                    </>
                )
            default:
                break;
        }
    }

    return (
        <section className={`${Styles.bannerSection}`}>
            <div className={`${Styles.bannerSectionBackgroundOverlay}`}>
            </div>
            <div className={`w-100 text-center ${Styles["land-txt"]}`}>
                <img
                    className={`${Styles.bannerSectionLogo}`}
                    src={process.env.REACT_APP_STATIC_URL + "media/FH.png"}
                />
                <br /><br />
                <br /><br />
                {
                    getBannerText(landingPageLocation)
                }
                <div
                    className={`${Styles.BookAppointmentBtn}`}
                    onClick={() => scrollToForm()}
                >
                    Book An Appointment
                </div>


                <div className="d-flex justify-content-center">
                    <div className={`${Styles.mouseicon}`} onClick={() => scrollToNextSection()}>
                        <span></span>
                    </div>
                </div>
            </div>
        </section >
    );
};
export default BannerSection;
