import React from 'react'
import Style from "./style.module.css"
const ExpertReview = () => {
    return (
        <div className={`${Style.ExpertReviewSection}`}>
            <div className={`d-md-flex d-grid place-items-center justify-content-center ${Style.ExpertReview}`}>
                <div className={`${Style.ExpertReviewImg}`}>
                    <img
                        src={process.env.REACT_APP_STATIC_URL + 'media/LandingPage/mihir.webp'}
                        alt="Mihir Shah - Financial Planning Expert"
                        loading="lazy"
                        width="400"
                        height="500"
                    />
                </div>
                <div className='mt-4'>
                    <div>
                        <div className={`${Style.expertName}`}>Written By - Mihir Shah</div>
                        <div className={`${Style.expertDesign}`}>AVP- Financial Planning</div>
                    </div>
                    <div className={`${Style.expertInfo}`}>
                        “With over six years at Fintoo, he leads the Financial Planning Advisory Team, driving strategic growth and excellence in financial planning. As a Certified Investment Advisor with an MBA in Finance, he specializes in managing select UHNI clients, delivering tailored financial strategies and comprehensive wealth management solutions. He is also instrumental in expanding Fintoo’s fee-based advisory model, ensuring a client-centric, transparent, and value-driven approach to financial planning.”
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExpertReview
