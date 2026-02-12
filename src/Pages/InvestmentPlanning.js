import { useState, useEffect } from "react";
import Footer from "../components/MainComponents/Footer";
import SideModal from "../components/SideModal";
import MainHeader from "../components/MainHeader";
import RegisterForm from "../components/RegisterForm";
import { imagePath } from "../constants";

const InvestmentPlanning = () => {
    const [getInTouch, setGetInTouch] = useState(false);

    useEffect(() => {
        document.body.classList.add('main-layout');
    }, []);
    return (
        <div>
            {/* <MainHeader /> */}

            <section className="video-promo-hero position-relative">

                <div className="video-background-container">
                    <video
                        loop={true}
                        muted={true}
                        className="video-content video"
                        poster=""
                        preload="none"
                        id="bg-video"
                        autoPlay={true}

                    >
                        <source
                            src={imagePath + "/static/media/Images/userflow/video/investment_planning.mp4"}
                            type="video/mp4"
                        />
                    </video>
                </div>

                <div className="container " style={{ paddingTop: "1rem", paddingBottom: "1rem", paddingLeft: "10rem" }}>
                    <div className="row align-items-center banner-content color-white">
                        <div className="col-md-8">
                            <h1 className="page-header" style={{ fontSize: "32px !important" }}>Investment Planning</h1>
                            <div className="button-container" style={{ marginTop: 20 }}>

                                <button
                                    type="submit"
                                    id="get_in_touch"
                                    value="Get in touch"
                                    onClick={() => setGetInTouch(true)}
                                    className="outline-btn white d-inline-block"
                                >
                                    Get in touch
                                </button>

                            </div>
                            <p>You cannot make money until and unless you make your money make more money for you. And simply keeping your money idle in your locker or savings account is not going make your money, make more money for you. Instead, investing is the only way to make your money make more money for you. And Fintoo’s tried, tested, and trusted investment advisory service can help invest your money in the right place in order to achieve your desired financial goals at the right time.</p>
                            <br />
                            <p>Keeping in mind your current situation, future expectations, financial needs, financial goals, and most importantly, your risk profile, Fintoo’s certified and experienced investment advisors create an exclusive investment plan for you that forms the base of all your investment-related decisions.</p>
                            <br />
                            <p>Fintoo’s investment planning service doesn't only focus on investing to get the desired returns without considering the risk. Instead, it focuses on developing a 360-degree strategy that takes care of all your short-term as well as long-term goals while maintaining the required liquidity to handle any emergency and also ensuring maximum protection of your investments from the market risks.</p>
                            <br />
                            <p>Planning To Start Investing? Know About Your Ideal Investment Plan By Using Fintoo’s INVESTMENT PLANNING TOOL.</p>
                            <br />
                            <p>Need more reasons to choose Fintoo’s investment advisory services? Here are few reasons to start your investment planning with Fintoo;</p>
                            <ul className="financial-services">
                                <li>Analyses your risk appetite using statistical tools</li>
                                <li>Reviews your existing investments and recommending new ones</li>
                                <li>Creates a diversified portfolio with suitable asset allocation</li>
                                <li>Balancing inflation-beating returns with financial security</li>

                            </ul>
                        </div>
                    </div>
                </div>

            </section>

            <SideModal show={getInTouch} onClose={() => setGetInTouch(false)}>
                <div className="row m-0 myrow">
                    <div className=" col-12">
                        <RegisterForm />
                    </div>
                </div>
            </SideModal>

            {/* <Footer /> */}
        </div>
    );
}
export default InvestmentPlanning;