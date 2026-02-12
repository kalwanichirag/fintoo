import React from 'react'
import Style from "./style.module.css"

const WhoisfpPlanner = () => {
    return (
        <div className={` ${Style.WhoisfpPlanner}`}>
            <div className={` ${Style.WhoisfpPlannerBox}`}>
                <div className='mb-4'>
                    <h2 className={`text-center ${Style.WhoisfpPlannertitle}`}>Who is a Financial Planner?</h2>
                    <div className={`${Style.WhoisfpPlannersubtitle}`}>A financial planner is your strategic partner in achieving financial success and security. From asset allocation to tax optimization, they take on roles like investment advisors, portfolio managers, and tax consultants. Their expertise ensures your finances are managed effectively to meet your goals.</div>
                </div>
                <div className={`${Style.FPReport}`}>
                    <div className={`${Style.FPReportBox}`}>
                        <div className={`${Style.FPReportImg}`}>
                            <img src={process.env.REACT_APP_STATIC_URL + 'media/LandingPage/Strategic Asset Allocation for Wealth Growth.svg'} alt='A person managing gold in one circle, a pie chart showcasing a diversified equity portfolio in another circle, and a house in a third circle depicting real estate as part of their investments—all these elements symbolize Strategic Asset Allocation.' title="Strategic Asset Allocation for Wealth Growth" />
                            {/* <img src={Assumptions} /> */}
                        </div>
                        <div className={`ms-md-5 ${Style.FPReportBoxContent}`}>
                            <p className={`${Style.FPReportBoxContentTitle}`}>Strategic Asset Allocation for Wealth Growth</p>
                            <p className={`${Style.FPReportBoxContentText}`}>
                                Estimates future income, expenses, and returns based on inflation rates and past performance.
                            </p>
                        </div>
                    </div>
                    <div className={`${Style.FPReportBox}`}>
                        <div className={`${Style.FPReportBoxContent}`}>
                            <p className={`${Style.FPReportBoxContentTitle}`}>
                            Comprehensive Risk Management Solutions
                            </p>
                            <p className={`${Style.FPReportBoxContentText}`}>
                            Protect what matters most with expert strategies for insurance, debt management, and financial contingencies.
                            </p>
                        </div>
                        <div className={`ms-md-5 ${Style.FPReportImg}`}>
                            <img src={process.env.REACT_APP_STATIC_URL + 'media/LandingPage/Comprehensive Risk Management Solutions.svg'} alt='A person holding a risk meter below the risk threshold, symbolizing risk management.' title="Comprehensive Risk Management Solutions" />
                            {/* <img src={FinancialGoalAdvice} /> */}
                        </div>
                    </div>
                    <div className={`${Style.FPReportBox}`}>
                        <div className={`${Style.FPReportImg}`}>
                            <img src={process.env.REACT_APP_STATIC_URL + 'media/LandingPage/Optimized Tax Strategies for Maximum Savings.svg'} alt='Tax documents with a calculator and a percentage showing saved tax, symbolizing Optimized Tax Strategies for Maximum Savings.' title="Optimized Tax Strategies " />
                            {/* <img src={FintooRecommends} /> */}
                        </div>
                        <div className={`ms-md-5 ${Style.FPReportBoxContent}`}>
                            <p className={`${Style.FPReportBoxContentTitle}`}>
                            Optimized Tax Strategies for Maximum Savings
                            </p>
                            <p className={`${Style.FPReportBoxContentText}`}>
                            Simplify tax complexities with proactive planning to reduce liabilities and enhance your wealth.
                            </p>
                        </div>
                    </div>
                    <div className={`${Style.FPReportBox}`}>
                        <div className={`${Style.FPReportBoxContent}`}>
                            <p className={`${Style.FPReportBoxContentTitle}`}>Achieve Financial Independence with Goal-Based Planning</p>
                            <p className={`${Style.FPReportBoxContentText}`}>
                            Let your financial planner design personalized roadmaps that align every decision with your short-term and long-term goals.
                            </p>
                        </div>
                        <div className={`ms-md-5 ${Style.FPReportImg}`}>
                            <img src={process.env.REACT_APP_STATIC_URL + 'media/LandingPage/Achieve Financial Independence with Goal-Based Planning.svg'} title="Goal-Based Planning" alt='A piggy bank, cash, and a house at different stages of life, symbolizing Goal-Based Planning'/>
                            {/* <img src={Goal} /> */}
                        </div>
                    </div>
                    <div className={`${Style.FPReportBox}`}>
                        <div className={`${Style.FPReportImg}`}>
                            <img src={process.env.REACT_APP_STATIC_URL + 'media/LandingPage/Secure Your Legacy with Estate Planning Expertise.svg'} alt='House documents, a house, and a key, symbolizing estate planning.' title="estate planning." />
                            {/* <img src={RetirementPlanning} /> */}
                        </div>
                        <div className={`ms-md-5 ${Style.FPReportBoxContent}`}>
                            <p className={`${Style.FPReportBoxContentTitle}`}>
                            Secure Your Legacy with Estate Planning Expertise
                            </p>
                            <p className={`${Style.FPReportBoxContentText}`}>
                            Ensure your wealth transitions seamlessly to the next generation with expert estate planning solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhoisfpPlanner;
