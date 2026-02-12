import { useEffect, useState } from "react";
import Styles from "./style.module.css"
import Stepper from "./Stepper";
import { Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { imagePath } from "../../../../constants";
const Demat = (props) => {
    const [pageurl, setPageurl] = useState(false);
    const location = useLocation();
    useEffect(() => {
        if ("pathname" in location) {
            setPageurl(location.pathname);
        }
    }, [location]);
    return (
        <div>
            <div style={{ width: "100%" }} className=" d-md-flex justify-content-between">
                <div className={`${Styles.Demat}`}>
                    <div className="">
                        <div className={`mb-4  ${Styles.ModalProgressBar}`}>
                            <Stepper isActive={true} stepnumber="1" text1={"Basic Details "} text2={"Provide your account details"} />
                            <Stepper isActive={true} stepnumber="2" text1={"OTP Verification"} text2={"Consent to fetch your documents"} />
                            <Stepper isActive={true} stepnumber="3" text1={"Account Details"} text2={"Your demat related info"} />
                            <Stepper isActive={true} stepnumber="4" text1={"Completed"} text2={"Woah, we are here"} />
                        </div>

                    </div>
                </div>
                <div className={`ms-md-3   ${Styles.DematRightSection}`}>
                    <div className={`${Styles.Demattrackinfo}`}>
                        <div className={`${Styles.Demattitle}`}>Track with Account Aggregator (In just 4 steps)</div>
                        <div className={`${Styles.Dematsubinfo}`}>Get your complete portfolio on your fingertips securely with Account Aggregator Highly Recommended.</div>
                        <div className={`${Styles.DematkeyBenefit} custom-color`}>Key benefits:</div>
                        <div className="ms-md-2 mt-1">
                            <div className={`${Styles.DematkeyBenefitlist}`}>
                                <div className={`${Styles.DematkeyBenefitlisticon}`}><img className="" width={25} src={imagePath + "/static/media/DG/Star.svg"} alt="Close" /></div>
                                <div className={`${Styles.DematkeyBenefitlistText}`}>Live & 100% accurate portfolio updates</div>
                            </div>
                            <div className={`${Styles.DematkeyBenefitlist}`}>
                                <div className={`${Styles.DematkeyBenefitlisticon}`}><img className="" width={25} src={imagePath + "/static/media/DG/Star.svg"} alt="Close" /></div>
                                <div className={`${Styles.DematkeyBenefitlistText}`}>Get weekly health report of your portfolio</div>
                            </div>
                            <div className={`${Styles.DematkeyBenefitlist}`}>
                                <div className={`${Styles.DematkeyBenefitlisticon}`}><img className="" width={25} src={imagePath + "/static/media/DG/Star.svg"} alt="Close" /></div>
                                <div className={`${Styles.DematkeyBenefitlistText}`}>Track all brokers at one place - No matter where you invest</div>
                            </div>
                            <div className={`${Styles.DematkeyBenefitlist}`}>
                                <div className={`${Styles.DematkeyBenefitlisticon}`}><img className="" width={25} src={imagePath + "/static/media/DG/Star.svg"} alt="Close" /></div>
                                <div className={`${Styles.DematkeyBenefitlistText}`}>Powered by RBI regulated Account Aggregator</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-2 mb-0 ${Styles.ModalBottomSection}`}>
                        <div className={`${Styles.thirdPartyView}`}>
                            <div className="d-flex align-items-center">
                                <div className={`${Styles.poweredBy}`}>Powered by</div>  <img className="ms-2" width={60} src={process.env.REACT_APP_STATIC_URL + "media/DG/Finvu.png"} alt="Close" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${Styles.linkNowbtn}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                {
                    (pageurl == "/commondashboard" || pageurl == "/commondashboard/") && <button style={{
                        background: pageurl == "/commondashboard" || pageurl == "/commondashboard/" ? "#042b62" : ""
                    }} className="custom-btn-style" onClick={() => {
                        props.setInvestmentTypeView('INITIAL');
                    }} >Back</button>
                }

                <button style={{
                    background: pageurl == "/commondashboard" || pageurl == "/commondashboard/" ? "#042b62" : ""
                }} className="custom-btn-style" onClick={() => {
                    props.showNextStep();


                }} >Link Now</button>
            </div>

            {/* Demat Now */}

        </div>
    );
};
export default Demat;
