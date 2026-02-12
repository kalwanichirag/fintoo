import React, { useEffect, useRef, useState } from 'react';
import HeroSection from '../../components/NewPlanningpage/HeroSection';
import PlanSection from '../../components/NewPlanningpage/PlanSection';
import Whyfintoo from '../../components/NewPlanningpage/whyfintoo';
import FPPlanner from '../../components/NewPlanningpage/FPPlanner';
import KeyElements from '../../components/NewPlanningpage/KeyElements';
import KeyFactors from '../../components/NewPlanningpage/FactorsFP';
import PortFolios from '../../components/NewPlanningpage/PortFolios';
import FpBenefits from '../../components/NewPlanningpage/FpBenefits';
import InvestmentInstruments from '../../components/NewPlanningpage/InvestmentInstruments';
import WhoisfpPlanner from '../../components/NewPlanningpage/WhoisfpPlanner/';
import FaqSection from '../../components/NewPlanningpage/FaqSection';
import Book_consultation from '../../components/NewPlanningpage/Book_consultation';
import FpProcess from '../../components/NewPlanningpage/FpProcess';
import CalendlySectionView from '../../components/NewPlanningpage/CalendlySection';
import ExpertReview from '../../components/NewPlanningpage/ExpertReview';
import ClientTestimonial from '../../components/NewPlanningpage/ClientReviews';
import { Helmet } from 'react-helmet-async';

const images = [
    process.env.REACT_APP_STATIC_URL + "media/LandingPage/FPExpert.webp",
    process.env.REACT_APP_STATIC_URL + "media/LandingPage/FPExpert2.webp",
    process.env.REACT_APP_STATIC_URL + "media/LandingPage/FPExpert3.webp"
];

const NewPlanningpage = () => {
    const calendlyRef = useRef(null);
    const bookConsultationRef = useRef(null);
    const [isHeroVisible, setIsHeroVisible] = useState(true);
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const [isCalendlyVisible, setIsCalendlyVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [isBookConsultationVisible, setIsBookConsultationVisible] = useState(true);
    const [bookConsultationHeight, setBookConsultationHeight] = useState('11.3%');
    const [bookConsultationWidth, setBookConsultationWidth] = useState('65%');

    const [formData, setFormData] = useState({
        fullname: '',
        mobile: '',
        email: ''
    });

    const scrollToCalendly = () => {
        if (calendlyRef.current) {
            calendlyRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const updateBookConsultationDimensions = () => {
        if (bookConsultationRef.current) {
            const rect = bookConsultationRef.current.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            setBookConsultationWidth(width + 'px');
            setBookConsultationHeight(height + 'px');
        }
    };

    useEffect(() => {
        updateBookConsultationDimensions();
        const handleResize = () => {
            updateBookConsultationDimensions();
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('load', updateBookConsultationDimensions);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('load', updateBookConsultationDimensions);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const heroElement = document.getElementById('hero-section');
            const footerElement = document.getElementById('FooterView');
            const calendlyElement = calendlyRef.current;
            const bookConsultationElement = document.getElementById('book-consultation');
            if (heroElement) {
                const rect = heroElement.getBoundingClientRect();
                setIsHeroVisible(rect.top < window.innerHeight && rect.bottom > 0);
            }
            if (footerElement) {
                const rect = footerElement.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const isFooterVisible = rect.top <= windowHeight && rect.bottom >= 0;
                setIsFooterVisible(isFooterVisible);
            }
            if (calendlyElement) {
                const rect = calendlyElement.getBoundingClientRect();
                setIsCalendlyVisible(rect.top < window.innerHeight && rect.bottom > 0);
            }
            if (footerElement && bookConsultationElement) {
                const footerRect = footerElement.getBoundingClientRect();
                if (footerRect.top <= 200) {
                    setIsBookConsultationVisible(false);
                } else {
                    setIsBookConsultationVisible(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);

            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                setFade(true);
            }, 500);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {/* <Helmet>
                <meta name="keywords" content="Certified Financial Planner, Certified Financial Planner in India, Certified Financial Planner in Mumbai, Financial Planning, Financial Advisor, online financial advisor, financial consultant, certified financial planner india, best financial advisor in india, financial, online financial advisor, personal financial advisor, best financial advisors, financial advisory companies in India, online investment advisor india, online financial advisor india, best financial planners in india, certified financial planner in mumbai, top financial consultants, financial advisor websites" />
            </Helmet> */}
            <div id="hero-section">
                <HeroSection scrollToCalendly={scrollToCalendly} setFormData={setFormData} formData={formData} />
            </div>
            <PlanSection />
            <Whyfintoo />
            <FPPlanner
                title="What is Financial Planning?"
                textInfo2="The process typically includes assessing your current financial situation, setting realistic goals, identifying available resources, developing strategies, and implementing a monitoring framework to track progress. From budgeting to risk management, financial planning encompasses various aspects that ensure financial health and growth."
                textInfo="Financial planning is the systematic approach to managing one’s financial resources to achieve personal, business, or organizational objectives. Financial planning involves creating a strategy for efficiently allocating and managing money to meet both short-term and long-term goals. Whether you're an individual investor, a family office, or a business owner, a comprehensive financial plan ensures that your financial decisions are aligned with your future objectives."
            />
            <KeyElements />
            <FPPlanner
                title="Why is Financial Planning Important?"
                textInfo2="Fintoo can help you structure an optimized, personalized financial plan, so your investments work for you."
                textInfo="Financial planning is important because it helps manage your financial future. It ensures that your objectives are realistically achievable and lays down a systematic path for wealth creation and protection. Without financial planning, it’s easy to fall prey to poor financial decisions, excessive debt, or missed investment opportunities."
            />
            <FpProcess />
            <PortFolios />
            <KeyFactors />
            <FpBenefits />
            <InvestmentInstruments />
            <WhoisfpPlanner />
            <div style={{ background: '#fff' }}>
                <ClientTestimonial />
            </div>
            <div ref={calendlyRef}>
                <CalendlySectionView formData={formData}   pageName={"Financial Planning"} />
            </div>
            <ExpertReview />
            <FaqSection />
            <div style={{
                position: "absolute",
                background: "#fff",
                width: "100%",
                height: bookConsultationHeight
            }}></div>
            {
                !isHeroVisible && !isCalendlyVisible && (
                    <div ref={bookConsultationRef} style={{ position: "sticky", bottom: "0px", }}>
                        <Book_consultation
                            currentIndex={currentIndex}
                            images={images}
                            fade={fade}
                            scrollToCalendly={scrollToCalendly}
                          
                        />
                    </div>
                )
            }
        </div>
    );
};

export default NewPlanningpage;
