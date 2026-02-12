import React from 'react'
import Style from "./Style.module.css"
const PortFolios = () => {
    return (
        <div className={` ${Style.PortFolios}`}>
            <div className='mb-5'>
                <h2 className={`text-center ${Style.PortFoliostitle}`}>How Financial Planning Helps in Restructuring Portfolios</h2>
            </div>
            <div className={` ${Style.Plantype}`}>
                <div className='d-flex gap-3'>
                    <div>
                        <img
                            width={40}
                            src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/First_.svg"}
                            alt='Optimize Asset Allocation'
                        />
                    </div>
                    <div>
                        <div className={`${Style.plantitle}`}>Optimize Asset Allocation</div>
                        <div className={`${Style.plansubtitle}`}>Based on your risk tolerance, financial goals, and investment horizon, a financial planner can help rebalance your portfolio to maintain a proper mix of asset classes (equities, bonds, commodities, real estate, etc.)</div>
                    </div>
                </div>
                <div className='d-flex gap-3'>
                    <div>
                        <img
                            width={40}
                            src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/rp.svg"}
                            alt='Minimize Risks'
                        />
                    </div>
                    <div>
                        <div className={`${Style.plantitle}`}>Minimize Risks</div>
                        <div className={`${Style.plansubtitle}`}>A financial planner can minimize market volatility’s impact and enhance long-term stability by conducting thorough analysis and forecasting.</div>
                    </div>
                </div>
                <div className='d-flex gap-3'>
                    <div>
                        <img
                            width={40}
                            src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/investplan.svg"}
                            alt='Ensure Diversification'
                        />
                    </div>
                    <div>
                        <div className={`${Style.plantitle}`}>Ensure Diversification</div>
                        <div className={`${Style.plansubtitle}`}>A well-diversified portfolio is critical for maximizing returns and minimizing risk. Financial planning helps identify unbalanced portfolios and recommends suitable diversification strategies.</div>
                    </div>
                </div>
                <div className='d-flex gap-3'>
                    <div>
                        <img
                            width={40}
                            src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/debtmgmt.svg"}
                            alt='Maximize Tax Efficiency'
                        />
                    </div>
                    <div>
                        <div className={`${Style.plantitle}`}>Maximize Tax Efficiency</div>
                        <div className={`${Style.plansubtitle}`}>Portfolio restructuring can help maximize tax-efficient strategies. A well-structured portfolio must adapt as market conditions and life circumstances change. </div>
                    </div>
                </div>
                <div className='d-flex gap-3'>
                    <div>
                        <img
                            width={40}
                            src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/taxplan.svg"}
                            alt='Adapt to Changing Goals'
                        />
                    </div>
                    <div>
                        <div className={`${Style.plantitle}`}>Adapt to Changing Goals</div>
                        <div className={`${Style.plansubtitle}`}>As an individual's or a business’s objectives evolve, so should their investment strategy. For example, a family nearing retirement may shift toward more stable and conservative investments.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortFolios
