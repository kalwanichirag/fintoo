import React from "react";
import styles from "./style.module.css";
import ClientReviews from "./Slider";
import Rating from "react-rating";
import { BsFillStarFill } from "react-icons/bs";



const ClientTestimonial = () => {


    return (
        <section className={`${styles.ClientTestimonialsection} py-5`}>
            <div className="text-center">
                <div className='mb-4'>
                    <h2 className={`text-center ${styles.ClientTestimonialtitle}`}>Why Clients Trust Us?</h2>
                </div>
                <div className={`${styles.clientReviewtxt}`}>
                    Our reputation is built on trust, transparency, and delivering meaningful results. Join over 2,00,000+ happy customers who’ve rated us 4.6 stars with 225 glowing Google Reviews.
                </div>
                <div className="mt-4 d-md-flex gap-3 justify-content-center align-items-center">
                    <div>

                        <div className="d-flex justify-content-md-start justify-content-center align-items-center gap-2">
                            <div style={{ fontSize: "1.8rem", fontWeight: "500", paddingTop: "2px" }}>
                                4.6
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                                <Rating
                                    initialRating={4.6}
                                    readonly
                                    emptySymbol={
                                        <span style={{ display: "inline-block", lineHeight: 0 }}>
                                            <BsFillStarFill style={{ color: "#d3d3d3", fontSize: "26px" }} />
                                        </span>
                                    }
                                    fullSymbol={
                                        <span style={{ display: "inline-block", lineHeight: 0 }}>
                                            <BsFillStarFill style={{ color: "#ffd700", fontSize: "26px" }} />
                                        </span>
                                    }
                                    fractions={2} // Allows half-stars
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-md-start justify-content-center align-items-center gap-2">
                            <div><img width={100} src={process.env.REACT_APP_STATIC_URL + 'media/LandingPage/google-logo.png'} alt="Google Reviews" /></div>
                            <div className={`${styles.googleplayreviews}`} ><span style={{ fontWeight: 600, color: "#000" }}>Reviews</span></div>
                        </div>
                    </div>
                    <div>

                        <div className="d-flex justify-content-md-start justify-content-center align-items-center gap-2">
                            <div style={{ fontSize: "1.8rem", fontWeight: "500", paddingTop: "2px" }}>
                                4.4
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                                <Rating
                                    initialRating={4.4}
                                    readonly
                                    emptySymbol={
                                        <span style={{ display: "inline-block", lineHeight: 0 }}>
                                            <BsFillStarFill style={{ color: "#d3d3d3", fontSize: "26px" }} />
                                        </span>
                                    }
                                    fullSymbol={
                                        <span style={{ display: "inline-block", lineHeight: 0 }}>
                                            <BsFillStarFill style={{ color: "#ffd700", fontSize: "26px" }} />
                                        </span>
                                    }
                                    fractions={2} // Allows half-stars
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-md-start justify-content-center align-items-center gap-2">
                            <div><img width={20} src={process.env.REACT_APP_STATIC_URL + 'media/LandingPage/playstore.png'} alt="Google Play store Reviews" /></div>
                            <div className={`${styles.googleplayreviews}`} >Google Play <span style={{ fontWeight: 600, color: "#000" }}>Reviews</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5 mb-5">
                <ClientReviews />
            </div>
        </section>
    );
};

export default ClientTestimonial;
