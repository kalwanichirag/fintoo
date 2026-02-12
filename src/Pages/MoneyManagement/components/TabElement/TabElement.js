import { useEffect, useRef } from 'react';
import styles from './style.module.css';

const TabElement = ({ activeTab, onTabChange }) => {

    const element1Ref = useRef(null);

    const element2Ref = useRef(null);

    const gliderRef = useRef(null);

    const handleTabClick = (tabIdx) => {
        onTabChange(tabIdx);

        handleTabSlide(tabIdx)
    }

    const handleTabSlide = (tabIdx) => {
        if (!element1Ref.current && !element1Ref.current) return;

        if (tabIdx == 1) {
            const tabElement = element1Ref.current;
            const rectLeft = tabElement.offsetLeft;
            const rectWidth = tabElement.offsetWidth;


            gliderRef.current.style.left = rectLeft + 'px';
            gliderRef.current.style.width = rectWidth + 'px';
        } else {
            const tabElement = element2Ref.current;
            const rectLeft = tabElement.offsetLeft;
            const rectWidth = tabElement.offsetWidth;


            gliderRef.current.style.left = rectLeft + 'px';
            gliderRef.current.style.width = rectWidth + 'px';
        }
    }

    useEffect(() => {
        if (gliderRef.current && element1Ref.current) {
            gliderRef.current.style.width = element1Ref.current.offsetWidth + 'px';
        }
    }, [])

    useEffect(() => { handleTabSlide(activeTab) }, [activeTab])

    return (
        <div className={styles.container}>
            <div ref={element1Ref} onClick={(e) => handleTabClick(1)} className={`${styles.tabElem} ${activeTab == 1 && styles.tabElemActive}`}>

                <span style={{ width: '16px' }}>
                    {
                        activeTab == 1 ? <img style={{ width: '100%' }} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/codicon_fold_down.svg"} /> : <img style={{ transform: 'rotate(180deg)', width: '100%' }} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/codicon_fold_up.svg"} />
                    }
                </span>
                <span>Inflow Transactions</span>
            </div>
            <div ref={element2Ref} onClick={e => handleTabClick(2)} className={`${styles.tabElem} ${activeTab == 2 && styles.tabElemActive}`}>
                <span style={{ width: '16px' }}>
                    {
                        activeTab == 2 ? <img style={{ transform: 'rotate(180deg)', width: '100%' }} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/codicon_fold_down.svg"} /> : <img style={{ width: '100%' }} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/codicon_fold_up.svg"} />}
                </span>
                <span>Outflow Transactions</span>
            </div>
            <div ref={gliderRef} className={styles.tabGlider}></div>
        </div>
    );
}

export default TabElement;
