import React from 'react'
import Style from "./style.module.css"

const FpProcess = () => {
    return (
        <div className={` ${Style.FpProcess}`}>
            <div className={` ${Style.FpProcessBox}`}>
                <div className='mb-4'>
                    <h2 className={`text-center ${Style.FpProcessonetxt}`}>The Financial Planning Process: A Step-by-Step Guide</h2>
                    <div className={`${Style.FpProcesssubtitle}`}>Financial planning isn't a one-time task; it's an ongoing process. The method involves a multi-step approach that requires attention to detail, deep financial knowledge, and flexibility to adapt to changes in the financial landscape.
                    </div>
                </div>
                <div style={{ position: "relative" }} className='d-grid'>
                    <div className={`${Style.FpProcessCards}`}>
                        <div>
                            <div className={`${Style.fpimg}`}>
                                <img
                                    width={100}
                                    src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/Fp_1.svg"}
                                    alt='Define Financial Goals'
                                />
                            </div>
                            <div className={`${Style.FpProcessCard}`}>
                                <div className={`${Style.title}`}>Define Financial Goals</div>
                                <div className={`${Style.Desc}`}>
                                    The first step in creating a financial plan is identifying clear and specific financial goals. These goals could range from buying a house, saving for college tuition, or growing a business. By quantifying your objectives—whether short-term (1-3 years) or long-term (5-10 years)—you can establish a path to success.
                                </div>
                            </div>
                        </div>
                        <div className={`${Style.fp_RightLine}`}>
                            <img
                                src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/fp_Right_line.svg"}
                              
                            />
                        </div>
                    </div>

                    <div className={`${Style.FpProcessCards}`}>
                        <div>
                            <div className={`${Style.fpimg}`}>
                                <img
                                    width={100}
                                    src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/Fp_2.svg"}
                                    alt='Assess Your Current Financial Situation'
                                />
                            </div>
                            <div className={`${Style.FpProcessCard}`}>
                                <div className={`${Style.title}`}>Assess Your Current Financial Situation</div>
                                <div className={`${Style.Desc}`}>
                                    This stage involves a thorough analysis of your current financial standing. Key components include
                                </div>
                                <div className={`${Style.list}`}>
                                    <ul>
                                        <li><span>Income</span>: All sources of income, including salary, business earnings, dividends, etc.</li>
                                        <li><span>Expenses</span>: Monthly expenses like utilities, loans, groceries, and entertainment.</li>
                                        <li><span>Assets</span>: What you own, including savings, investments, real estate, etc.</li>
                                        <li><span>Liabilities</span>: Any outstanding debts such as mortgages, loans, credit card debts, etc.</li>
                                    </ul>
                                </div>
                                <div className={`${Style.Desc}`}>
                                    Understanding your net worth and cash flow is vital for crafting a suitable financial plan.
                                </div>
                            </div>
                        </div>
                        <div className={`${Style.Fp_Left_line}`}>
                            <img
                                src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/Fp_Left_line.svg"}
                            />
                        </div>
                    </div>
                    <div className={`${Style.FpProcessCards}`}>
                        <div>
                            <div className={`${Style.fpimg}`}>
                                <img
                                    width={100}
                                    src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/Fp_3.svg"}
                                    alt='Identify Financial Gaps and Set Priorities'
                                />
                            </div>
                            <div className={`${Style.FpProcessCard}`}>
                                <div className={`${Style.title}`}>Identify Financial Gaps and Set Priorities</div>
                                <div className={`${Style.Desc}`}>
                                    Once you assess your current situation, identify gaps that could prevent achieving your goals. Do you have enough retirement savings? Are you prepared for emergency expenses? Set priorities for your goals based on their importance and urgency.
                                </div>
                            </div>
                        </div>
                        <div className={`${Style.fp_RightLine}`}>
                            <img
                                src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/fp_Right_line.svg"}
                            />
                    </div>
                    </div>
                    <div className={`${Style.FpProcessCards}`}>
                        <div>
                            <div className={`${Style.fpimg}`}>
                                <img
                                    width={100}
                                    src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/Fp_4.svg"}
                                    alt='Develop a Financial Plan'
                                />
                            </div>
                            <div className={`${Style.FpProcessCard}`}>
                                <div className={`${Style.title}`}>Develop a Financial Plan</div>
                                <div className={`${Style.Desc}`}>
                                    Based on your goals and financial analysis, develop strategies to close the identified gaps. These may include increasing savings, optimizing investments, reducing debt, or obtaining appropriate insurance
                                </div>
                            </div>
                        </div>
                        <div className={`${Style.Fp_Left_line}`}>
                            <img
                                src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/Fp_Left_line.svg"}
                            />
                        </div>
                    </div>
                    <div className={`${Style.FpProcessCards}`}>
                        <div>
                            <div className={`${Style.fpimg}`}>
                                <img
                                    width={100}
                                    src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/Fp_5.svg"}
                                    alt='Implement the Plan'
                                />
                            </div>
                            <div className={`${Style.FpProcessCard}`}>
                                <div className={`${Style.title}`}>Implement the Plan</div>
                                <div className={`${Style.Desc}`}>
                                    Execution is key. At this stage, you'll begin implementing the various strategies laid out in your financial plan. Whether it's investing in stocks, opening a retirement fund, or taking out an insurance policy, ensure each step contributes to achieving your goals.
                                </div>
                            </div>
                        </div>
                        <div className={`${Style.fp_RightLine}`}>
                            <img
                                src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/fp_Right_line.svg"}
                            />
                        </div>
                    </div>
                    <div className={`${Style.FpProcessCards}`}>
                        <div>
                            <div className={`${Style.fpimg}`}>
                                <img
                                    width={100}
                                    src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/Fp_6.svg"}
                                    alt='Review and Revise the Plan'
                                />
                            </div>
                            <div className={`${Style.FpProcessCard}`}>
                                <div className={`${Style.title}`}> Review and Revise the Plan</div>
                                <div className={`${Style.Desc}`}>
                                    The financial world is dynamic, and your financial plan should be regularly revisited. Circumstances such as market fluctuations, changes in personal life, tax laws, or business environment shifts may necessitate adjustments. Annual reviews are typically recommended, but major life events should trigger immediate revisions.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FpProcess;
