import React from 'react'
import Style from "./style.module.css"

const cardData = [
    {
        title: "Goal Achievement",
        description: "Whether it’s saving for retirement, purchasing a home, or expanding a business, financial planning ensures that you have a roadmap to achieve your goals. A structured approach prevents reckless spending and encourages savings to meet future needs.",
        image: "media/LandingPage/Goal Achievement.svg",
        alt: "An arrow hitting the target, symbolizing goal achievement as a key benefit of financial planning."
    },
    {
        title: "Improved Cash Flow Management",
        description: "Financial planning aids in managing cash flow effectively, ensuring that expenses are covered and opportunities for saving or reinvesting are maximized. It provides a clear understanding of inflows and outflows, preventing financial surprises.",
        image: "media/LandingPage/Improved Cash Flow Management.svg",
        alt: "A rupee symbol in smooth motion, representing improved cash flow management as a key benefit of financial planning."
    },
    {
        title: "Risk Mitigation",
        description: "Risk management is a fundamental part of financial planning. Financial planning shields you from unpredictable financial disruptions by identifying potential risks (market, credit, inflation, etc.) and adopting strategies like insurance, asset diversification, and hedging.",
        image: "media/LandingPage/Risk Mitigation.svg",
        alt: "A risk symbol, representing risk management as a key benefit of financial planning."
    },
    {
        title: "Investment Optimization",
        description: "Financial planning helps maximize the return on investments by ensuring the right mix of asset classes (equities, bonds, real estate, etc.), diversification, and risk management.",
        image: "media/LandingPage/Investment Optimization.svg",
        alt: "A rupee symbol with an upward graph and a clock, representing investment optimization across different asset classes as a key benefit of financial planning."
    },
   
    {
        title: "Peace of Mind",
        description: "A well-thought-out financial plan reduces uncertainty about the future. With goals defined, risks mitigated, and a clear strategy in place, you can enjoy peace of mind knowing you’re on the right path.",
        image: "media/LandingPage/Peace of Mind.svg",
        alt: "A man meditating, symbolizing peace of mind as a key benefit of financial planning"
    }
];

const FpBenefits = () => {
    return (
        <div className={Style.FpBenefits}>
            <div className={Style.FpBenefitsBox}>
                <div className='mb-4'>
                    <h2 className={`text-center ${Style.FpBenefitstitle}`}>Benefits of Financial Planning</h2>
                    <div className={Style.FpBenefitssubtitle}>
                        Effective financial planning offers numerous advantages that can transform both personal finances and business outcomes. Here are the top benefits:
                    </div>
                </div>
                <div className={`${Style.FpBenefitsCards}`}>
                    <div className={Style.FpBenefitsTop}>
                        {cardData.slice(0, 3).map((card, index) => (
                            <div key={index} className={Style.FpBenefitsCard}>
                                <div>
                                    <img
                                        width={70}
                                        src={process.env.REACT_APP_STATIC_URL + card.image}
                                        alt={card.alt}
                                        title={card.title}
                                    />
                                </div>
                                <div className={Style.FpBenefitsCardtitle}>{card.title}</div>
                                <div className={Style.FpBenefitsCardDec}>{card.description}</div>
                            </div>
                        ))}
                    </div>
                    <div className={Style.FpBenefitsBottom}>
                        {cardData.slice(3, 5).map((card, index) => (
                            <div key={index} className={Style.FpBenefitsCard}>
                                <div>
                                    <img
                                        width={70}
                                        src={process.env.REACT_APP_STATIC_URL + card.image}
                                        alt={card.title}
                                    />
                                </div>
                                <div className={Style.FpBenefitsCardtitle}>{card.title}</div>
                                <div className={Style.FpBenefitsCardDec}>{card.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FpBenefits;
