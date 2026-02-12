import React, { useState } from 'react';
import Style from "./style.module.css";

const cardData = [
    {
        title: "Budgeting",
        description: "Setting up a structured plan for managing income and expenses.",
        image: "media/LandingPage/Budgeting.svg",
        hoverImage: "media/LandingPage/Budgeting blue.svg",
        alt:"An expense sheet with a calculator, symbolizing budgeting as a key element of financial planning."
    },
    {
        title: "Investment Planning",
        description: "Strategizing the optimal allocation of resources for growth.",
        image: "media/LandingPage/Investment Planning.svg",
        hoverImage: "media/LandingPage/Investment Planning blue.svg",
        alt:"An upward market graph, symbolizing investment planning as a key element of financial planning"
    },
    {
        title: "Retirement Planning",
        description: "Ensuring enough funds for a comfortable retirement.",
        image: "media/LandingPage/Retirement Planning.svg",
        hoverImage: "media/LandingPage/Retirement Planning_blue.svg",
        alt:"A rocking chair, symbolizing retirement planning as a key element of financial planning."
    },
    {
        title: "Risk Management",
        description: "Identifying risks and creating a buffer for unforeseen events.",
        image: "media/LandingPage/Risk Management.svg",
        hoverImage: "media/LandingPage/Risk Management blue.svg",
        alt:"A rupee coin under an umbrella, representing risk management as a key element of financial planning."
    },
    {
        title: "Estate Planning",
        description: "Managing assets and wealth transfer to heirs in an efficient manner.",
        image: "media/LandingPage/Estate Planning.svg",
        hoverImage: "media/LandingPage/Estate Planning_blue.svg",
        alt:"A house in a palm, showcasing estate planning as a key element of financial planning."
    },
    {
        title: "Tax Planning",
        description: "Minimizing tax liabilities through smart strategies and deductions.",
        image: "media/LandingPage/Tax Planning.svg",
        hoverImage: "media/LandingPage/Tax Planning blue.svg",
        alt:"A stack of coins with a percentage symbol, depicting tax savings and symbolizing tax planning as a key element of financial planning."
    }
];

const KeyElements = () => {
    const [hoverIndex, setHoverIndex] = useState(null);

    return (
        <div className={` ${Style.KeyElements}`}>
            <div className={` ${Style.KeyElementsBox}`}>
                <div className='mb-4'>
                    <h2 className={`text-center ${Style.KeyElementstitle}`}>Key Elements of Financial Planning</h2>
                </div>
                <div className={`${Style.KeyElementsCards}`}>
                    {cardData.map((card, index) => (
                        <div 
                            key={index} 
                            className={`${Style.KeyElementsCard}`}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            <div>
                                <img
                                    width={60}
                                    src={process.env.REACT_APP_STATIC_URL + (hoverIndex === index ? card.hoverImage : card.image)}
                                    alt={card.alt}
                                    title={card.title}
                                    style={{
                                        background : "#fff",
                                        borderRadius : "50%",
                                        padding :"5px"
                                    }}
                                />
                            </div>
                            <div className={`${Style.KeyElementsCardtitle}`}>{card.title}</div>
                            <div className={`${Style.KeyElementsCardDec}`}>{card.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default KeyElements;
