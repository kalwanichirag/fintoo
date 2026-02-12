import React, { useEffect, useState } from 'react'
import Style from "./style.module.css"


const Book_consultation = ({ scrollToCalendly, second, images, currentIndex, fade }) => {

    return (
        <div className={` ${second ? "" : Style.Book_consultation_fixed}`}>
            <div className={`${Style.Book_consultation}`}>
                <div className={`${Style.imgConsult} ${fade ? Style.fadeIn : Style.fadeOut}`}>
                    <img src={images[currentIndex]} alt="Book A Complimentary Session" />
                </div>
                <div className={`${Style.Book_consultation_info}`}>
                    <div className={`${Style.Book_consultationtitle}`}>
                        Plan your financial future with confidence
                    </div>
                    <div className={`${Style.Book_consultationsubtitle}`}>Get expert advice, tailored to your goals, schedule a free consultation today – because we only charge for the plan, not the chat.
                    </div>
                </div>
                <div className={`${Style.btn}`}>
                    <button onClick={scrollToCalendly}>Book A Complimentary Session</button>
                </div>
            </div>
        </div>
    )
}

export default Book_consultation
