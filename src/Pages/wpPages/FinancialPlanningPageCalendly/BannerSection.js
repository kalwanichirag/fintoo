import Styles from "./style.module.css";
import bannerImg from "../common/images/banner/bannerimg.png"
import icon1 from "../common/images/banner/banericon1.svg"
import icon2 from "../common/images/banner/banericon2.svg"
import icon3 from "../common/images/banner/banericon3.svg"
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BannerSection = ({ scrollToForm, scrollToNextSection, isCalendlyVisible, isBannerVisible }) => {
    
    return (
        <>
            <div className={`${Styles.desktopView}`}>
                <section className={`${Styles.bannerSection}`}>
                    <div className={`${Styles.bannerSectionBackgroundOverlay}`}>
                    </div>
                    <div className={`w-100 text-center ${Styles["land-txt"]}`}>
                        <img
                            className={`${Styles.bannerSectionLogo}`}
                            // src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoowhitelogo_.svg"}
                            src={process.env.REACT_APP_STATIC_URL + "media/FH.png"}
                        />
                        <div
                            className={`${Styles.desktopView}`}
                        >
                            <br /><br />
                            <br /><br />
                        </div>

                        <h1 className={`${Styles.SpaceReduce}`}>
                            Get your Goal-Driven Financial Plan.<br />Crafted by Qualified Wealth Advisors.
                        </h1>
                        <p>
                            Delivering reliable financial advice based on extensive market research and a personalized approach.
                        </p>
                        <div
                            className={`${Styles.desktopView}`}
                        >
                            <br /><br />
                            <br /><br />
                        </div>
                        <div
                            className={`${Styles.BookAppointmentBtn} ${Styles.desktopView}`}
                            onClick={() => scrollToForm()}
                        >
                            Book An Appointment
                        </div>

                        <div className={`${Styles.mobileView}`}>
                            {
                                <div className={`${Styles.stickyBookAppointmentBtn} `}>
                                    <div
                                        className={`${Styles.BookAppointmentBtn}`}
                                        onClick={() => scrollToForm()}
                                    >
                                        Book An Appointment
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="d-flex justify-content-center">
                            <div className={`${Styles.mouseicon}`} onClick={() => scrollToNextSection()}>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </section >
            </div>
            <div className={`${Styles.mobileView}`}>
                <section className={`${Styles.bannerSectionMobile}`}>
                    <div style={{ width: '100%', background: 'white', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Link to={process.env.PUBLIC_URL}>
                            <img style={{ width: '90px' }} src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"} />
                        </Link>


                        <div
                            style={{ width: 'fit-content', background: '#134994', borderRadius: '30px', padding: '0.5rem 1rem', color: 'white', cursor: 'pointer' }}
                            onClick={() => scrollToForm()}
                        >
                            Book An Appointment
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img style={{ width: '17px', marginRight: '0.5rem' }} src={icon1} alt="" />
                            <div style={{ fontSize: '0.7rem', color: '#374151' }}>SEBI Registered</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img style={{ width: '17px', marginRight: '0.5rem' }} src={icon2} alt="" />
                            <div style={{ fontSize: '0.7rem', color: '#374151' }}>2 Lakhs+ Happy Clients</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img style={{ width: '17px', marginRight: '0.5rem' }} src={icon3} alt="" />
                            <div style={{ fontSize: '0.7rem', color: '#374151' }}>4.8/5 Rating</div>
                        </div>
                    </div>

                    <div className={`w-100 text-center ${Styles["land-txt"]}`}>
                        <h1 className={`${Styles.SpaceReduce}`} style={{ color: 'black', marginTop: '0.5rem' }}>
                            Get your Goal-Driven Financial Plan.<br />Crafted by Qualified Wealth Advisors.
                        </h1>
                        <p style={{ color: 'black' }}>
                            Delivering reliable financial advice based on extensive market research and a personalized approach.
                        </p>

                    </div>
                    <div style={{ padding: '0 2rem' }}>
                        <img style={{ width: '100%' }} src={bannerImg} alt="" />
                    </div>
                    <div className={`${Styles.mobileView}`}>
                        {
                             !isBannerVisible &&(
                            <div className={`${Styles.stickyBookAppointmentBtn} `}>
                                <div
                                    className={`${Styles.BookAppointmentBtn}`}
                                    style={{ width: 'fit-content', background: '#F58639', borderRadius: '30px', padding: '0.5rem 1rem', color: 'white', cursor: 'pointer' }}
                                    onClick={() => scrollToForm()}
                                >
                                    Book An Appointment
                                </div>
                            </div>)
                        }
                    </div>
                </section >
            </div>

        </>

    );
};
export default BannerSection;
