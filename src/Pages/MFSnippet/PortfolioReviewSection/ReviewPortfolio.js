
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import mainStyles from "../style.module.css";
import { getPublicMediaURL } from "../../../common_utilities";
import { useDispatch } from "react-redux";
import { FintooLogoLoader } from "../../../components/FintooInlineLoader";

const ReviewPortfolio = ({ setCurrentTab, setBasicInfoCurrentStep, mfSnippetData, basicInfo }) => {

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (mfSnippetData.pdf_snippet_url != '') {
            setIsLoading(false);
        }
        dispatch({
            type: "SET_LEAD_DATA", payload: {
                fullname: basicInfo.FullName,
                mobile: basicInfo.Mobile,
                email: basicInfo.Email
            }
        });
    }, [mfSnippetData])



    return (
        <div className={`${styles.ReviewPortfolio}`} style={{ marginTop: '1px' }}>
            {
                isLoading ?
                    <div className={`${styles.ReviewBuildIndicatorContainer}`}>
                        <FintooLogoLoader />
                        <div style={{ textAlign: 'center' }}>
                            <div className={`${styles.Text2}`}>
                                Building your Portfolio
                            </div>
                            <br />
                            <div className={`${styles.Text1}`} style={{ color: '#848991', fontSize: '1.2rem', fontWeight: '500', width: '75%', margin: '0 auto' }}>
                                We are currently analysing the data and generating your personalised MF Screening Report. We request you to patiently wait as this may take up to 25-30 seconds.
                            </div>
                            <br />
                            <div className={`${styles.btnDisabled}`} style={{ margin: '0 auto' }}>
                                {'Download now '}<i className="fa-solid fa-download"></i>
                            </div>
                            <br />
                        </div>
                    </div> :
                    <div className={`${styles.ReviewBuildIndicatorContainer}`} >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '2rem' }}>
                            <img style={{ width: '80%' }} src={getPublicMediaURL("static/media/MFSnippet/rafiki.svg")} alt="" />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <br />
                            <br />
                            <div className={`${styles.Text2}`}>
                                Congratulations!!
                            </div>
                            <div className={`${styles.Text1}`} style={{ color: '#848991', fontSize: '1.2rem', fontWeight: '500', width: '80%', margin: '0 auto' }}>
                                Ensure you don’t lose out on opportunities to make gains.
                            </div>
                            <br />
                            <a href={mfSnippetData.pdf_snippet_url} target="_blank" style={{ textDecoration: 'none' }}>
                                <div className={`${styles.btn1}`} style={{ margin: '0 auto' }}>
                                    {'Download now '}<i className="fa-solid fa-download"></i>
                                </div>
                            </a>
                            <br />
                        </div>
                    </div>
            }
            <br />
            <br />
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className={`${styles.btn2}`} onClick={() => { setCurrentTab(1); setBasicInfoCurrentStep(2) }}>
                    {'< Back'}
                </div>
                <div className={`${isLoading ? styles.btnDisabled : styles.btn1}`} onClick={() => setCurrentTab(3)}>
                    {'Book call >'}
                </div>
            </div>
        </div>
    );
};

export default ReviewPortfolio; 
