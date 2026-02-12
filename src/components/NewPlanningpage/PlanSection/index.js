import React from 'react'
import Style from "./Style.module.css"
const PlanSection = () => {
    return (
        <div className={` ${Style.PlanSection}`}>
            <div className='mb-4'>
                <h2 className={`text-center ${Style.PlanSectiontitle}`}>What Does A Fintoo Financial Advisor Do?</h2>
                <div className={`${Style.PlanSectionsubtitle}`}>A Financial Planner or an Advisor helps manage your finances effectively by offering expert advice in areas such as</div>
            </div>
            <div className={` ${Style.Plantype}`}>
                <div className={`d-flex gap-3 ${Style.plantypeData}`}>
                    <div>
                        <img
                            width={40}
                            src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/First_.svg"}
                            alt='Goal-Based Planning'
                        />
                    </div>
                    <div>
                        <div className={`${Style.plantitle}`}>Goal-Based Planning</div>
                        <div className={`${Style.plansubtitle}`}> SMART strategies tailored to achieve specific financial objectives. </div>
                    </div>
                </div>
                <div className={`d-flex gap-3 ${Style.plantypeData}`}>
                    <div>
                        <img
                            width={40}
                            src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/rp.svg"}
                            alt='Retirement Planning'
                        />
                    </div>
                    <div>
                        <div className={`${Style.plantitle}`}>Retirement Planning</div>
                        <div className={`${Style.plansubtitle}`}>Secure your future with long-term investment solutions.</div>
                    </div>
                </div>
                <div className={`d-flex gap-3 ${Style.plantypeData}`}>
                    <div>
                        <img
                            width={40}
                            src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/investplan.svg"}
                            alt='Investment Planning'
                        />
                    </div>
                    <div>
                        <div className={`${Style.plantitle}`}>Investment Planning</div>
                        <div className={`${Style.plansubtitle}`}>Filter and manage investments based on your goals, risk tolerance, and market conditions.</div>
                    </div>
                </div>
                <div className={`d-flex gap-3 ${Style.plantypeData}`}>
                    <div>
                        <img
                            width={40}
                            src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/debtmgmt.svg"}
                            alt='Debt Management'
                        />
                    </div>
                    <div>
                        <div className={`${Style.plantitle}`}>Debt Management</div>
                        <div className={`${Style.plansubtitle}`}>Efficient repayment strategies to minimize interest costs.</div>
                    </div>
                </div>
                <div className={`d-flex gap-3 ${Style.plantypeData}`}>
                    <div>
                        <img
                            width={40}
                            src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/taxplan.svg"}
                            alt='Tax Planning'
                        />
                    </div>
                    <div>
                        <div className={`${Style.plantitle}`}>Tax Planning</div>
                        <div className={`${Style.plansubtitle}`}>Legal methods to minimize tax liabilities and retain more of your income. </div>
                    </div>
                </div>
             
                <div className={`d-flex gap-3 ${Style.plantypeData}`}>
                    <div>
                        <img
                            width={40}
                            src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/legacyplan.svg"}
                            alt='Legacy & Inheritance Planning'
                        />
                    </div>
                    <div>
                        <div className={`${Style.plantitle}`}>Legacy & Inheritance Planning</div>
                        <div className={`${Style.plansubtitle}`}>Estate planning to ensure seamless asset transfer to beneficiaries.</div>
                    </div>
                </div>
               
                <div className={`d-flex gap-3 ${Style.plantypeData}`}>
                    <div>
                        <img
                            width={40}
                            src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/emergency.svg"}
                            alt='Emergency Planning'
                        />
                    </div>
                    <div>
                        <div className={`${Style.plantitle}`}>Emergency Planning</div>
                        <div className={`${Style.plansubtitle}`}>Build an emergency fund to handle unexpected financial challenges.</div>
                    </div>
                </div>
                
                <div className={`d-flex gap-3 ${Style.plantypeData}`}>
                    <div>
                        <img
                            width={40}
                            src={process.env.REACT_APP_STATIC_URL + "media/LandingPage/insurance.svg"}
                            alt='Insurance Guidance'
                        />
                    </div>
                    <div>
                        <div className={`${Style.plantitle}`}>Insurance Guidance</div>
                        <div className={`${Style.plansubtitle}`}>Find the right health and term insurance plans to safeguard your financial stability.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlanSection
