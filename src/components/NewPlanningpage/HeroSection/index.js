import React from 'react'
import Select from 'react-select'
import Style from "./style.module.css"
const HeroSection = ({ setFormData, formData, scrollToCalendly }) => {
    return (
        <div  className={`${Style.heroSection}`}>
            <div className='container'>
                {/* <div>
                    <img
                        width={200}
                        src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoowhitelogo_.svg"}
                    />
                </div> */}
                <div>
                    <h1 className={`${Style.herotitle}`}>Financial Planning - Your Guide To Smarter Investments</h1>
                    <div className={`${Style.subtitle}`}>Strengthen your understanding of financial planning and plan ahead to safeguard your investment portfolio against market volatilities. Schedule a complimentary consultation with Fintoo Financial Advisor and analyse your financial strategy.
                    </div>
                </div>
                <div >
                    <div className={`${Style.heroButton}`}>
                        <button onClick={scrollToCalendly} type="button" aria-label="Book a complimentary session">Book A Complimentary Session</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
