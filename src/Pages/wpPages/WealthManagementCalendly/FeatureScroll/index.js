
import styles from "./style.module.css";

const FeatureScroll = ({ scrollToForm }) => {

    return (
        <section className={`${styles.featureScrollSection}`}>
            <div className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0' }}>
                Track the Performance of Your Investments
            </div>

            <div className={`${styles.featureSection}`}>
                <section className={`${styles.featureContainer}`}>
                    <div className={`${styles.featureContentContainer}`}>
                        <div className={`${styles.featureTxtContent}`} >
                            <div className={`${styles.GlobalText2} ${styles.FeatureHeading}`} style={{ padding: '0.8rem 0' }}>
                                Analyse the performance of<br />funds you are invested in!
                            </div>
                            <div className={`${styles.Text1}`}>
                                Ensure that your funds are diversified.
                            </div>
                            <div className={`${styles.featureTxtContentBtn1}`} style={{ marginTop: '1.5rem' }} onClick={() => scrollToForm()}>
                                <span>Explore Now</span><i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                        <div className={`${styles.featureImgContent}`}>
                            {/* <img className={`${styles.featureImg1}`} src={process.env.REACT_APP_STATIC_URL + '/media/MFSnippet/featureBackground.png'} alt="" /> */}
                            <img className={`${styles.featureImg2}`} src={process.env.REACT_APP_STATIC_URL + '/media/MFSnippet/feature1.svg'} alt="" />
                        </div>
                    </div>
                </section>
                <section className={`${styles.featureContainer}`}>
                    <div className={`${styles.featureContentContainer}`}>
                        <div className={`${styles.featureTxtContent}`} >
                            <div className={`${styles.GlobalText2} ${styles.FeatureHeading}`} style={{ padding: '0.8rem 0' }}>
                                Analyse the performance of<br />funds you are invested in!
                            </div>
                            <div className={`${styles.Text1}`}>
                                Ensure that your funds are diversified.
                            </div>
                            <div className={`${styles.featureTxtContentBtn1}`} style={{ marginTop: '1.5rem' }} onClick={() => scrollToForm()}>
                                <span>Explore Now</span><i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                        <div className={`${styles.featureImgContent}`} >
                            {/* <img className={`${styles.featureImg1}`} src={process.env.REACT_APP_STATIC_URL + '/media/MFSnippet/featureBackground.png'} alt="" /> */}
                            <img className={`${styles.featureImg2}`} src={process.env.REACT_APP_STATIC_URL + '/media/MFSnippet/feature2.svg'} alt="" />
                        </div>
                    </div>
                </section>
                <section className={`${styles.featureContainer}`}>
                    <div className={`${styles.featureContentContainer}`}>
                        <div className={`${styles.featureTxtContent}`} >
                            <div className={`${styles.GlobalText2} ${styles.FeatureHeading}`} style={{ padding: '0.8rem 0' }}>
                                Analyse the performance of<br />funds you are invested in!
                            </div>
                            <div className={`${styles.Text1}`}>
                                Ensure that your funds are diversified.
                            </div>
                            <div className={`${styles.featureTxtContentBtn1}`} style={{ marginTop: '1.5rem' }} onClick={() => scrollToForm()}>
                                <span>Explore Now</span><i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                        <div className={`${styles.featureImgContent}`} >
                            {/* <img className={`${styles.featureImg1}`} src={process.env.REACT_APP_STATIC_URL + '/media/MFSnippet/featureBackground.png'} alt="" /> */}
                            <img className={`${styles.featureImg2}`} src={process.env.REACT_APP_STATIC_URL + '/media/MFSnippet/feature3.svg'} alt="" />
                        </div>
                    </div>
                </section>
            </div>

        </section>
    );
};

export default FeatureScroll;
