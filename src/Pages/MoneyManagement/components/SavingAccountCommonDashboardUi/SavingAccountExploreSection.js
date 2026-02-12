import React, { useState } from 'react';
import style from '../../style.module.css';
import { Link } from 'react-router-dom';

const SavingAccountExploreSection = (props) => {

    return (
        <div>
            {
                props.isModal &&
                <div className={`cardBox autoAdvisory lifeInsurance ${style.savingAccCampeignMainContainer}`} style={{ position: 'relative', }}>
                    <div className={`${style.savingAccCampeignContainer} ${props.isModal ? '' : style.savingAccCampeignContainerGap}`} style={{ padding: `${props.isModal ? '1.2rem 1rem' : ''}` }}>
                        <div className='d-md-flex justify-content-between align-items-center'>
                            <div>
                                <div className={`${style.secondaryText2}`} >Uncover Money Management with us.</div>
                                <div className={`${style.dashboardHeader}`}>Master your finances effortlessly!</div>
                                <p className={`${style.secondaryText1}`}>Simplify income and expenses, gain insights, and supercharge your spending habits.</p>
                                <div className={`${style.exploreNowOptionContainer}`} style={{ flexDirection: `${props.isModal ? 'column' : ''}`, alignItems: `${props.isModal ? 'start' : ''}` }}>

                                </div>
                            </div>
                            <div>    <Link

                                style={{ textDecoration: 'none' }}
                                to={`${process.env.PUBLIC_URL}/money-management/bank-tracking-overview`}>

                                <div onClick={() => {
                                        localStorage.removeItem("dgexternalfetchbankbal");
                                    }} className={`${style.btn1}`}>
                                    Explore Now
                                </div>
                            </Link></div>
                        </div>
                        <div style={{ width: `${props.isModal ? '50%' : ''}` }}>
                            <img className={`${style.savingAccCampeignImg}`} style={{ width: '100%' }} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/campaign1.svg"} alt="" />
                        </div>
                    </div>
                    {
                        props.isModal &&
                        <div className={`${style.closeOption}`}>
                            <img onClick={() => props.onClose && props.onClose()} style={{ width: '30px', cursor: 'pointer' }} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/closeIcon.svg"} alt="" />
                        </div>
                    }
                </div>
            }

            {
                !props.isModal &&
                <>
                    <div className={`${style.bannerContainerDesktop}`}>
                        <div className={`${style.savingAccCampeignContainer}`} style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '10px 75px 75px 10px' }}>
                            <div className='d-md-flex justify-content-between align-items-center' style={{ width: '100%' }}>
                                <div>
                                    <div className={`${style.dashboardHeader}`}>Master your finances effortlessly!</div>
                                    <div className={`${style.exploreNowOptionContainer}`} style={{ justifyContent: 'space-between', paddingRight: '2rem' }}>
                                        <div className={`${style.secondaryText2}`} >Uncover Money Management with us.</div>
                                    </div>
                                    <p className={`${style.secondaryText1}`}>Simplify income and expenses, gain insights, and supercharge your spending habits.</p>
                                </div>
                                <div><Link
                                    style={{ textDecoration: 'none' }}
                                    to={`${process.env.PUBLIC_URL}/money-management/bank-tracking-overview`}>

                                    <div onClick={() => {
                                        localStorage.removeItem("dgexternalfetchbankbal");
                                    }} className={`${style.btn1}`} style={{ width: '130px' }}>
                                        Explore Now
                                    </div>
                                </Link></div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img className={`${style.savingAccCampeignImg}`} style={{ width: '100%' }} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/banerBackground.png"} alt="" />
                        </div>
                    </div>
                    <div className={`cardBox autoAdvisory lifeInsurance ${style.savingAccCampeignMainContainer} ${style.bannerContainerMobile}`} style={{ position: 'relative', }}>
                        <div className={`${style.savingAccCampeignContainer} ${props.isModal ? '' : style.savingAccCampeignContainerGap}`} style={{ padding: `${props.isModal ? '1.2rem 1rem' : ''}` }}>
                            <div className='d-md-flex justify-content-between align-items-center'>
                                <div>
                                    <div className={`${style.dashboardHeader}`}>Master your finances effortlessly!</div>
                                    <div className={`${style.secondaryText1}`}>Simplify income and expenses, gain insights, and supercharge your spending habits.</div>
                                    <div className={`${style.exploreNowOptionContainer}`} style={{ flexDirection: `${props.isModal ? 'column' : ''}`, alignItems: `${props.isModal ? 'start' : ''}` }}>
                                        <div className={`${style.secondaryText2}`} >Uncover Money Management with us.</div>

                                    </div>
                                </div>
                                <div className='mt-md-0 mt-2'>
                                    <Link
                                        style={{ textDecoration: 'none' }}
                                        to={`${process.env.PUBLIC_URL}/money-management/bank-tracking-overview`}>

                                        <div onClick={() => {
                                        localStorage.removeItem("dgexternalfetchbankbal");
                                    }} className={`${style.btn1}`} >
                                            Explore Now
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className='d-md-block d-none' style={{ width: `${props.isModal ? '50%' : ''}` }}>
                                <img className={`${style.savingAccCampeignImg}`} style={{ width: '100%' }} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/campaign1.svg"} alt="" />
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
};
export default SavingAccountExploreSection;
