import React from 'react'
import Style from "./style.module.css"



const InvestmentInstruments = () => {
    return (
        <div className={` ${Style.InvestmentInstruments}`}>
            <div className={` ${Style.InvestmentInstrumentsBox}`}>
                <div className='mb-4'>
                    <h2 className={`text-center ${Style.InvestmentInstrumentsonetxt}`}>Investment Instruments Used in Financial Planning</h2>
                    <div className={`${Style.InvestmentInstrumentssubtitle}`}>Investment instruments are a crucial part of any comprehensive financial plan. These assets help diversify a portfolio and grow wealth over time. Here’s a breakdown of some key investment vehicles</div>
                </div>
                <div className={`${Style.InvestmentInstrumentsCards}`}>
                    <div className='d-flex gap-3'>
                        <div>
                            <img
                                width={40}
                                src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/First_.svg"}
                                alt='Equity Investments'
                            />
                        </div>
                        <div>
                            <div className={`${Style.InvestmentInstrumentstitle}`}>Equity Investments</div>
                            <div className={`${Style.InvestmentInstrumentssubinfo}`}>
                                <div><b>Stocks</b>: Stocks are ownership shares in a company, providing the potential for capital appreciation and dividends.</div>
                                <div><b>Mutual Funds</b>: Pooled investments where funds from many investors are used to buy securities.</div>
                                <div><b>Private Equity (PE)</b>: Direct investments in companies, often in the form of venture capital or leveraged buyouts.</div>
                                <div><b>Alternative Investment Funds (AIF)</b>: These funds invest in niche markets, including hedge funds, real estate, and commodities.</div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex gap-3'>
                        <div>
                            <img
                                width={40}
                                src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/rp.svg"}
                                alt='Debt Instruments'
                            />
                        </div>
                        <div>
                            <div className={`${Style.InvestmentInstrumentstitle}`}>Debt Instruments</div>
                            <div className={`${Style.InvestmentInstrumentssubinfo}`}>
                                <div><b>Bonds</b>: Bonds are issued by corporations or governments to raise capital and provide fixed-interest returns.</div>
                                <div><b>Debentures</b>: Unsecured bonds backed only by the issuer's reputation and creditworthiness.</div>
                                <div><b>Fixed Deposits</b>: Low-risk, interest-bearing deposits offered by banks and financial institutions.</div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex gap-3'>
                        <div>
                            <img
                                width={40}
                                src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/investplan.svg"}
                                alt='Real Assets'
                            />
                        </div>
                        <div>
                            <div className={`${Style.InvestmentInstrumentstitle}`}>Real Assets</div>
                            <div className={`${Style.InvestmentInstrumentssubinfo}`}>
                                <div><b>Gold</b>: A traditional safe-haven asset, known for its ability to retain value over time.</div>
                                <div><b>Real Estate</b>: Physical property investments, such as residential, commercial, or industrial properties.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvestmentInstruments;
