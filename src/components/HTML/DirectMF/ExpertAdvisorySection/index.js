import { useRef } from "react";
import { useViewCheckOnce } from "../../../../Utils/Hooks/UseViewCheck";
import styles from "./style.module.css";

function ExpertAdvisorySection() {

    const ref = useRef(null)
    const isVisible = useViewCheckOnce(ref)

    return (
        <>
            <section className={`${styles['expert-advisory-section']} `}>
                <div className={`${styles['expert-advisory-section-container']}`} >
                    <div className={`${styles['expert-advisory-section-content']}`} >
                        <h2 className={`${styles['expert-advisory-section-title']}`}>Fintoo's Expert Advisory</h2>
                        <h2 className={`${styles['expert-advisory-section-sub-title']}`}>Don’t Wish To Take Any Chances With Your Investment And Future? <br/> <br/> Let The Experts Do What They Do Best!</h2>
                        {/* <h3 className={`${styles['expert-advisory-section-text']}`}>Choose Fintoo’s personalised financial advisory services and let an experienced financial advisor personally guide you at every step of your journey to achieve your financial goals.</h3> */}
                        <br />
                        <a href={`${process.env.PUBLIC_URL}/financial-planning-page`} className={`${styles['expert-advisory-section-content-btn']} ${styles['animatedBouncInUp']} ${styles['bounceInUp']}`} >Know More</a>
                    </div>
                    <div ref={ref} className={`${styles['expert-advisory-section-image']}`}>
                        <div className={`${styles['expert-advisory-section-image-container']}`} >
                            <img className={`${styles['behind-img']}`} src={process.env.REACT_APP_STATIC_URL + '/media/wp/behindImg.png'}  alt="" />
                            <div className={`${styles['front-img-container']} ${isVisible ? `${styles['animated']} ${styles['animatedFadeInUp']} ${styles['fadeInUp']}` : ''}`}>
                                <div className={`${styles['front-img']}`}>
                                    <img style={{ width: '100%' }} src={process.env.REACT_APP_STATIC_URL + '/media/wp/frontImg.png'}  alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ExpertAdvisorySection
