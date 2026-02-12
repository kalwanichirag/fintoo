import AdvisorySection from "../components/HTML/Advisory";
import ClientTestimonial from "../components/HTML/ClientTestimonial";
import InvestSection from "../components/HTML/InvestSection";
import TaxSection from "../components/HTML/TaxSection";
import WelcomeSection from "../components/HTML/WelcomeSection";
import { Helmet } from "react-helmet-async";
import Fullpage from "../components/Layout/Fullpage";
import OurAchievements from "../components/HTML/OurAchievements";
import FeaturedIn from "../components/HTML/FeaturedIn";
import KnowledgeBase from "../components/HTML/KnowledgeBase";
import WealthContactForm from "../components/WealthManagementContactForm";
import { servicesTypes } from '../components/WealthManagementContactForm/model'
import { useEffect, useState } from "react";
import ThankyouSection from "../components/ThankyouSection";
import ExpertAdvisorySection from "../components/HTML/DirectMF/ExpertAdvisorySection";
import AppointmentBox from "../components/Pages/Calendly";
import ClientReviews from "../components/HTML/ClientReviews";
import CallHeader from "../components/MainHeader/CallHeader";
import { Modal } from "react-responsive-modal";
import imp_notice from "../Assets/Images/imp_notice.png";
import moment from "moment";
import { getCookie } from "../common_utilities";

const Homepage = () => {
    const [show, SetShow] = useState(false)
    // const [isRegulatoryUodateModalActive, setIsRegulatoryUodateModalActive] = useState(false);

    useEffect(() => {
        if (window.location.href.includes("fintoo.ae")) {
            window.location.href = process.env.PUBLIC_URL + "/nri-desk-dubai";
        }
    }, []);


    return (
        <Fullpage>
            <Helmet>
                <meta name="keywords" content="income tax filing, Income Tax Notices, bonds, file itr, financial plan, investment planning, wealth management, personal finance, retirement planning, money management, tax planning, stock investement, equity investment, nri taxation, early retirement, financial advice, wealth advisory, investment advice, tax advice, wealth planning" />
            </Helmet>
            {/* <Modal classNames={{
                modal: 'Modalpopup',
            }} open={isRegulatoryUodateModalActive} showCloseIcon={false} center animationDuration={0} closeOnOverlayClick={false}>
                <div className="text-center">
                    <h2 className="HeaderText">Important Regulatory Update</h2>
                    <div className="ModalpopupContentContainer">
                        <br />
                        <div className="PopupImg" style={{ width: '30%', margin: '0 auto' }}>
                            <img style={{ width: '100%' }} src={imp_notice} />
                        </div>
                        <div className="p-2">
                            <p className="PopupContent">
                                Please be informed that as per the latest Income Tax rules, effective from July 1, 2023, linking your PAN with Aadhar is mandatory for all mutual fund investments.
                            </p>
                            <p className="PopupContent">From July 1, 2023, all financial and service requests related to your PAN will not be processed unless it is linked with Aadhaar.</p>
                            <p className="PopupContent">To ensure continuity of your financial transactions and services, please check if your PAN is already linked or link it now by visiting <a href="https://eportal.incometax.gov.in" target="_blank" rel="noopener noreferrer" >https://eportal.incometax.gov.in/ .</a></p>
                            <p className="PopupContent">Act promptly to avoid any inconvenience.</p>
                        </div>
                        <br />
                        <div className="ButtonBx aadharPopUpFooter">
                            <button className="ReNew" onClick={() => {
                                setIsRegulatoryUodateModalActive(false);
                                document.cookie = "aadhar-pan-popup=do-not-show; expires=" + moment('12/31/2023').toDate() + " UTC; path=/";
                            }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>

            </Modal> */}

            {/* <CallHeader /> */}
            <WelcomeSection />
            <AdvisorySection />
            <InvestSection />
            <TaxSection />
            {/* <ExpertAdvisorySection /> */}
            {/* <ClientReviews /> */}
            <ClientTestimonial />
            <OurAchievements />
            <FeaturedIn />
            <KnowledgeBase />
            <AppointmentBox
                pageName={"Homepage Calendly"} eventCode={'Callback_mintyApp_8'} serviceName="financial_planning" eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-financial-planning?hide_event_type_details=1"} planId="29" />
            {/* <AppointmentBox eventCode={'Callback_mintyApp_8'} serviceName="Financial Planning" eventUrl={"https://calendly.com/fintoo/test-clone-clone?hide_event_type_details=1"} /> */}
            {/* <WealthContactForm imgSrc={require('../Assets/Images/mainfintoo/invest-min.jpg')} serviceType={servicesTypes.main} onSuccess={() => SetShow(true)} /> */}
            {show && <ThankyouSection onClose={() => SetShow(false)} />}

        </Fullpage>
    );
}
export default Homepage;