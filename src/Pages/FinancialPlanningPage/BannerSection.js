import Styles from "./style.module.css";
import React from "react";

const BannerSection = ({ scrollToForm, scrollToNextSection }) => {

    return (
        <section className={`${Styles.bannerSection}`}>
            <div className={`${Styles.bannerSectionBackgroundOverlay}`}>
            </div>
            <div className={`w-100 text-center ${Styles["land-txt"]}`}>
                <img
                    className={`${Styles.bannerSectionLogo}`}
                    // src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoowhitelogo_.svg"}
                    src={process.env.REACT_APP_STATIC_URL + "media/FH.png"}
                />
                <br /><br />
                <h1 className={`${Styles.SpaceReduce}`}>
                    Get your Goal-Driven Financial Plan.<br />Crafted by Qualified Wealth Advisors.
                </h1>
                <p>
                    Delivering reliable financial advice based on extensive market research and a personalized approach.
                </p>
                {/* <a href="#PortfolioReviewSectionId" style={{ textDecoration: 'none' }}> */}
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
