import React from 'react'
import Style from "./Style.module.css"

const Whyfintoo = () => {
    return (
        <div className={` ${Style.Whyfintoo}`}>
            <div className={` ${Style.WhyfintooBox}`}>
                <div className='mb-4'>
                    <h2 className={`text-center ${Style.Whyfintootitle}`}>Why Fintoo? Because You Deserve More Than Just Financial Advice</h2>
                </div>
                <div className={` ${Style.Whyfintooinfo}`}>
                    <div>
                        At Fintoo, we believe in transforming your financial future with precision and innovation. Our AI-driven Financial Advisory combines cutting-edge technology with insights from India's top financial experts to provide you with personalized financial strategies. Whether you're planning for retirement, building an investment portfolio, or seeking tax-saving strategies, we have you covered every step of the way.
                    </div>
                </div>
                <div className={`d-md-flex d-grid gap-3 mt-5 ${Style.WhyfintooCards}`}>
                    <div className={`${Style.cardBox}`}>
                        <div>
                            <img width={300} src={process.env.REACT_APP_STATIC_URL + 'media/LandingPage/AIDrive.webp'} title="AI-Driven Precision" alt='An AI chip driving various financial factors, symbolizing AI-driven precision in financial decision-making'/>
                        </div>
                        <div className={`${Style.cardInfo}`}>
                            <div>AI-Driven Precision</div>
                            <div>Achieve your financial goals faster with smart, tailored advice powered by Artificial Intelligence. Our AI analyzes your unique financial situation and crafts a strategy just for you.</div>
                        </div>
                    </div>
                    <div className={`${Style.cardBox}`}>
                        <div>
                            <img width={234} src={process.env.REACT_APP_STATIC_URL + 'media/LandingPage/Expert advisory-05.svg'} title="Expert Advisory" alt='A well-suited individual with two stars above their head, symbolizing expert advisory.'/>
                        </div>
                        <div className={`${Style.cardInfo}`}>
                            <div>Expert Advisory</div>
                            <div>Experience the perfect fusion of technology and human expertise. India's top financial advisors team up with cutting-edge AI to deliver advice that’s both personalized and data-driven.</div>
                        </div>
                    </div>
                    <div className={`${Style.cardBox}`}>
                        <div> <img width={300} src={process.env.REACT_APP_STATIC_URL + 'media/LandingPage/Comprehensive.webp'} title="Comprehensive Services" alt='A tax sheet with a calculator representing tax planning, a rocking chair with a checklist representing retirement planning, a handshake with money growing above it symbolizing investment strategies, and a diamond, house, and other assets held in a palm representing wealth management—all of these elements illustrate the comprehensive services provided by Fintoo'/></div>
                        <div className={`${Style.cardInfo}`}>
                            <div>Comprehensive Services</div>
                            <div>From tax planning to retirement solutions, and investment strategies to wealth management, Fintoo provides end-to-end solutions covering all aspects of finance. We take care of it all!</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Whyfintoo;
