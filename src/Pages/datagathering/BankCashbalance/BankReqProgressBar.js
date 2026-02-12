import React, { useEffect, useRef, useState } from "react";
import Bankbalance from '../BankCashbalance/Bankbalance.module.css';
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import { BsCheckLg } from "react-icons/bs";

function BankReqProgressBar(props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [remainingETA, setRemainingETA] = useState(90);
    useEffect(() => {
        const interval = setInterval(() => {
            if (remainingETA > 0) {
                setRemainingETA(remainingETA - 1);
            }
            // if (remainingETA === 0) {
            //     autoAdvance();
            // }
        }, 1000);
        const redirectTimeout = setTimeout(() => {
            window.location.href = "/web/datagathering/assets-liabilities";
        }, 900);
        return () => {
            clearInterval(interval);
        };
    }, [currentStep, remainingETA]);

    return (
        <div>
            <HideHeader />
            <div className={`white-modal fn-redeem-modal d-flex justify-content-center align-items-center  ${Bankbalance.BanklistData}`}>
                <div className="w-md-75">
                    <div className={Bankbalance.stepperWrapper}>
                        <div className={`${Bankbalance.stepperItem} ${currentStep >= 0 ? Bankbalance.completed : ''}`}>
                            <div className={Bankbalance.stepCounter}><BsCheckLg /> </div>
                            <div className={Bankbalance.stepName}>Fintoo has Requested data from HDFC Bank</div>
                            <div className={Bankbalance.stepNamesubtxt}>Requested on: 07th April 2023, 12:11 PM</div>
                        </div>
                        <div className={`${Bankbalance.stepperItem} ${currentStep >= 1 ? Bankbalance.completed : Bankbalance.INcompleted}`}>
                            <div className={Bankbalance.stepCounter}><BsCheckLg /></div>
                            <div className={Bankbalance.stepName}>Data Received from HDFC Bank</div>
                            <div className={currentStep >= 1 ? "pt-1" : Bankbalance.stepNamesubtxtd}>
                                {
                                    currentStep >= 1 ? <> <div>
                                        Your Balance will be updated within 15 minutes
                                    </div> </> : <>
                                        ETA : {remainingETA} Seconds
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>

                    <div className="col-md-10 mt-md-5 mt-4">
                        <div className={`pt-md-5 me-md-5 me-4 ${Bankbalance.thirdPartySection}`}>
                            Powered by RBI regulated Account Aggregator <img
                                src={process.env.REACT_APP_STATIC_URL + "media/DG/Finvu.png"}
                                width={"60px"}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <HideFooter />
        </div>
    );
}

export default BankReqProgressBar;
