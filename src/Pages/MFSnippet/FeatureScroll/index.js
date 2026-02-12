
import styles from "./style.module.css";
import Slider from "react-slick";

const FeatureScroll = ({ scrollToForm }) => {
 
    return (
        <section className={`${styles.section} container`}>
            <div className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0' }}>
                Track the Performance of Your Investments
            </div>

            <div className={`${styles.featureSection} ${styles.featureSectionDesktopTab}`}>
                <section className={`${styles.featureContainer}`}>
                    <div className={`${styles.featureContentContainer}`}>
                        <div className={`${styles.featureTxtContent}`} >
                            <div className={`${styles.GlobalText1}`} style={{ padding: '0.8rem 0' }}>
                            Track Your Mutual Fund Performance!
                            </div>
                            <div className={`${styles.Text1}`}>
                            Identify underperforming investments and optimize your portfolio for higher returns with recommendations from our experienced advisor.
                            </div>

                        </div>
                        <div className={`${styles.featureImgContent}`}>
                            <img className={`${styles.featureImg2}`} src={process.env.REACT_APP_STATIC_URL + '/media/MFSnippet/feature1.svg'} alt="" />
                        </div>
                    </div>
                </section>
                <section className={`${styles.featureContainer}`}>
                    <div className={`${styles.featureContentContainer}`}>
                        <div className={`${styles.featureImgContent}`} >
                            <img className={`${styles.featureImg2}`} src={process.env.REACT_APP_STATIC_URL + '/media/MFSnippet/feature2.svg'} alt="" />
                        </div>
                        <div className={`${styles.featureTxtContent}`} >
                            <div className={`${styles.GlobalText1}`} style={{ padding: '0.8rem 0' }}>
                            Sector-Wise Allocation Overview!
                            </div>
                            <div className={`${styles.Text1}`}>
                            Check your portfolio’s diversification and manage sector-wise investments with assistance from our wealth manager.
                            </div>

                        </div>

                    </div>
                </section>
                <section className={`${styles.featureContainer}`}>
                    <div className={`${styles.featureContentContainer}`}>
                        <div className={`${styles.featureTxtContent}`} >
                            <div className={`${styles.GlobalText1}`} style={{ padding: '0.8rem 0' }}>
                            Tailored Recommendations from Portfolio Managers!
                            </div>
                            <div className={`${styles.Text1}`}>
                            Capture untapped opportunities for optimal performance.
                            </div>

                        </div>
                        <div className={`${styles.featureImgContent}`} >
                            <img className={`${styles.featureImg2}`} src={process.env.REACT_APP_STATIC_URL + '/media/MFSnippet/feature3.svg'} alt="" />
                        </div>
                    </div>
                </section>
            </div>


        </section>
    );
};

export default FeatureScroll;
