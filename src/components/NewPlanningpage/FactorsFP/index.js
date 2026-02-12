import React, { useState } from 'react'
import Style from "./style.module.css"

const cardData = [
    {
        title: "Economic Conditions",
        description: "Inflation, interest rates, and economic cycles influence investment returns and financial strategies.",
        image: "media/LandingPage/Economic Conditions.svg",
        hoverImage: "media/LandingPage/Economic Conditions blue.svg",
    },
    {
        title: "Market Volatility",
        description: "Fluctuations in stocks, commodities, and currencies impact portfolio stability.",
        image: "media/LandingPage/Market Volatility.svg",
        hoverImage: "media/LandingPage/Market Volatility blue.svg",
    },
    {
        title: "Inflation Rates",
        description: "The erosion of purchasing power necessitates inflation-adjusted planning, especially for long-term goals.",
        image: "media/LandingPage/Inflation Rates.svg",
        hoverImage: "media/LandingPage/Inflation Rates blue.svg",
    },
    {
        title: "Changes in Tax Laws",
        description: "Dynamic tax regulations require tax-optimized financial strategies.",
        image: "media/LandingPage/Changes in Tax Laws.svg",
        hoverImage: "media/LandingPage/Changes in Tax Laws blue.svg",
    },
    {
        title: "Life Events",
        description: "Milestones like marriage, childbirth, and retirement demand financial plan adjustments.",
        image: "media/LandingPage/Life Events.svg",
        hoverImage: "media/LandingPage/Life Events blue.svg",
    },
    {
        title: "Risk Appetite and Time Horizon",
        description: "Decisions hinge on individual risk tolerance and investment timelines.",
        image: "media/LandingPage/Risk Appetite and Time Horizon.svg",
        hoverImage: "media/LandingPage/Risk Appetite and Time Horizon blue.svg",
    }
];

const KeyFactors = () => {
    const [hoverIndex, setHoverIndex] = useState(null);
    const [hoverIndex1, setHoverIndex1] = useState(0);

    return (
        <div className={` ${Style.KeyFactors}`}>
            <div className={` ${Style.KeyFactorsBox}`}>
                <div className='mb-4'>
                    <h2 className={`text-center ${Style.KeyFactorstitle}`}>Factors Affecting Financial Planning</h2>
                </div>
                <div className={`${Style.KeyFactorsCards}`}>
                    {cardData.map((card, index) => (
                        <div key={index} onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)} className={`${Style.KeyFactorsCard}`}>
                            <div>
                                <img
                                    width={60}
                                    src={process.env.REACT_APP_STATIC_URL + (hoverIndex === index ? card.hoverImage : card.image)}
                                    alt={card.title}
                                    style={{
                                        background: "#fff",
                                        borderRadius: "50%",
                                        padding: "5px"
                                    }}
                                />
                            </div>
                            <div className={`${Style.KeyFactorsCardtitle}`}>{card.title}</div>
                            <div className={`${Style.KeyFactorsCardDec}`}>{card.description}</div>
                        </div>
                    ))}
                </div>
                <div onMouseEnter={() => setHoverIndex1(1)}
                    onMouseLeave={() => setHoverIndex1(0)} className={`d-md-flex gap-3 align-items-center ${Style.KeyFactorsCard} ${Style.KeyFactorsCard2}`}>
                    <div className={`${Style.KeyFactorsbg}`}>
                        <img
                         style={{
                            background: "#fff",
                            borderRadius: "50%",
                            padding: "5px"
                        }}
                            width={60}
                            src={process.env.REACT_APP_STATIC_URL + (hoverIndex1 === 1 ? "media/LandingPage/Technological Advancements Blue.svg" : "media/LandingPage/Technological Advancements.svg")}
                            alt='Technological Advancements'
                        />
                    </div>
                    <div>
                        <div className={`${Style.KeyFactorsCardtitle}`}>Technological Advancements</div>
                        <div className={`${Style.KeyFactorsCardDec}`}>FinTech innovations provide new tools for wealth management and investment strategies.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KeyFactors;
