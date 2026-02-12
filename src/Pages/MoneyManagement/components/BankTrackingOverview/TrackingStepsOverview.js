
import React from 'react';
import style from '../../style.module.css';
import { useNavigate } from 'react-router-dom';

function TrackingStepsOverview() {
    const navigate = useNavigate();

    return (
        <div className={`${style.bankTrackingOverViewItemContainer}`}>
            <div className={`${style.trackingStepsOverviewContainer}`}>
                <div className={`${style.dashboardHeader} text-center`}>Understand how to Track your Bank Transactions</div>
                <br />
                <div className={`${style.stepItemContainer}`}>
                    <div className={`${style.stepItemContentContainer}`}>
                        <div className={`${style.chip1}`}>
                            Step 1
                        </div>
                        <div className={`${style.secondaryText2}`} >Select bank account you want to track!</div>
                    </div>
                    <img className={`${style.stepItemArrow}`} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/steparrow.svg"} />
                </div>
                <div className={`${style.stepItemContainer}`}>
                    <div className={`${style.stepItemContentContainer}`}>
                        <div className={`${style.chip1}`}>
                            Step 2
                        </div>
                        <div className={`${style.secondaryText2}`} >Select your account and verify with OTP</div>
                    </div>
                    <img className={`${style.stepItemArrow}`} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/steparrow.svg"} />
                </div>
                <div className={`${style.stepItemContainer}`}>
                    <div className={`${style.stepItemContentContainer}`}>
                        <div className={`${style.chip1}`}>
                            Step 3
                        </div>
                        <div className={`${style.secondaryText2}`} >All done! Enjoy seamless tracking</div>
                    </div>
                    {/* <img style={{ height: '50px', marginTop: '-1px' }} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/steparrow.svg"} /> */}
                </div>
                <br />
                <div className={`${style.dashboardHeader} text-center`}>Complete in just 3 Easy steps</div>
            </div>
        </div>
    );
}

export default TrackingStepsOverview;
