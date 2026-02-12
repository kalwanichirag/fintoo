import { useState, useEffect } from "react";
import Footer from "../components/MainComponents/Footer";
import { ReactComponent as Logo } from '../Assets/Images/logo.svg';
import SideModal from "../components/SideModal";
import MainHeader from "../components/MainHeader";
import RegisterForm from "../components/RegisterForm";
import { imagePath } from "../constants";

const RetirementServices = () => {

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
                            src={imagePath + "/static/media/Images/userflow/video/retirement_planning.mp4"}
                            type="video/mp4"
                        />
                    </video>
                </div>

                <div className="container " style={{ paddingTop: "2rem", paddingBottom: "1rem", }}>
                    <div className="row align-items-center banner-content color-white">
                        <div className="col-md-8">
                            <h1 className="page-header" style={{ fontSize: "32px !important" }}>
                                Retirement Planning
                            </h1>
                            <div className="button-container" style={{ marginTop: 20, marginBottom: "20px" }}>

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
                            <p>There is still a long way to go. This is the most heard sentence whenever the topic of retirement planning is raised. Retirement planning is often neglected by most people considering the number of years left to get retired along with giving priority to the current expenses or the expenses in the near future. However, considering the fact that time passes by quickly and it’s better to act before it’s too late, the expert planners at Fintoo recommend you to start your retirement planning as early as possible to create a lot more retirement corpus in the long run.</p>
                            <br />
                            <p>In order to enable you to thoroughly enjoy your retirement period and continue living your desired lifestyle without depending on anyone, Fintoo’s retirement planning services help you create a perfect retirement. This customized retirement plan enables you to identify the ideal amount of your retirement corpus, invest in the best investment avenues whose returns match with your goals, keep a track of the performance of the investments and make the required changes to ensure that the retirement planning does not go off-track.</p>
                            <br />
                            <p>Wish To Start Your Retirement Planning? If Yes, Take The First Step Towards Securing Your Retirement Life By Calculating Your Ideal Retirement Corpus Using Fintoo’s RETIREMENT PLANNING CALCULATOR.</p>
                            <br />
                            <p>Still not convinced to start your retirement planning? Here are a few more reasons to start your retirement planning with Fintoo right away;</p>
                            <ul className="financial-services">
                                <li>Customized retirement plan based on retirement goals</li>
                                <li>Trust the retirement planning services trusted by 3000+ individuals</li>
                                <li>Constant support and assistance throughout your retirement planning process and beyond</li>
                                <li>Honest, transparent, and unbiased solution</li>
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
export default RetirementServices;