import { useEffect, useRef, useState } from 'react';
import styles from './style.module.css';
import { useLocation } from 'react-router-dom';
import ScrollToTopimg from './Scrolltop.svg';
import Scrolltop_white from './Scrolltop_white.svg';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const eleRef = useRef(null);
    const [pageurl, setPageurl] = useState(false);
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);
    const location = useLocation();
    useEffect(() => {
        if ("pathname" in location) {
            setPageurl(location.pathname);
        }
    }, [location]);
    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 200) {
                setIsScrollButtonVisible(true);
            } else {
                setIsScrollButtonVisible(false);
            }
            const footerElement = document.querySelector("#FooterView");
            if (footerElement) {
                const rect = footerElement.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const isVisible = rect.top <= windowHeight && rect.bottom >= 0;
                setIsFooterVisible(isVisible);
            }
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            {isScrollButtonVisible && (
                <div
                    ref={eleRef}
                    className={`${pageurl === "/web/financial-health-checkup" ? styles['scrolltopdiv1'] : styles['scrolltopdiv']}`}
                    onClick={() => window.scrollTo(0, 0)}
                >
                    <img
                        style={{ width: isFooterVisible ? "30px" : "" }} 
                        src={isFooterVisible ? Scrolltop_white : ScrollToTopimg} 
                        alt="Scroll to top"
                    />
                </div>
            )}
        </>
    );
};

export default ScrollToTop;
