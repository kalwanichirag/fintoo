import React from "react";
import Styles from '../DG.module.css'

const InitialView = (props) => {
    return (
        <div>
            <div className={`modalBody ${Styles.DematmodalBody}`}>
                <div className={`${Styles.parBody}`}>
                    <br />
                    <div>
                        <div className={`${Styles.ListContainer}`}>
                            <div style={{ paddingTop: '0.4rem' }}>
                                <i className={`fa-solid fa-circle-check ${Styles.ListIcon} custom-color`} ></i>
                            </div>
                            <div>
                                <div
                                    className={`${Styles.Title1}`}>Track and manage your mutual fund</div>
                                <div
                                    className={`${Styles.SubTitle1}`}>Across multiple brokers at one place. Always stay on top of your holdings!</div>
                            </div>
                        </div>
                        <div className={`${Styles.ListContainer}`}>
                            <div style={{ paddingTop: '0.4rem' }}>
                                <i className={`fa-solid fa-circle-check ${Styles.ListIcon} custom-color`} ></i>
                            </div>
                            <div>
                                <div
                                    className={`${Styles.Title1}`}>Real time analysis of your mutual fund performance</div>

                                <div
                                    className={`${Styles.SubTitle1}`}>Powerful and in-depth analysis on all your holdings with actionable insights</div>
                            </div>
                        </div>
                        <div className={`${Styles.ListContainer}`}>
                            <div style={{ paddingTop: '0.4rem' }}>
                                <i className={`fa-solid fa-circle-check ${Styles.ListIcon} custom-color`} ></i>
                            </div>
                            <div>
                                <div
                                    className={`${Styles.Title1}`}>Get advisory on your mutual fund portfolio</div>
                                <div
                                    className={`${Styles.SubTitle1}`}>Real time investment advisory, super-charge your portfolio's performance!</div>
                            </div>
                        </div>
                    </div>
                    <div className={`mt-5 ${Styles.continueBtns}`}>
                        <button className="custom-background-color" onClick={() => props.setCurrView('DETAILS')} >Fetch Your External Holdings</button>
                    </div>

                </div>
            </div>
            <img
                className={`${Styles.MFReportBg}`}
                src={process.env.PUBLIC_URL + "/static/media/DG/Images/MFReport/MFReportBg.svg"}
            />
        </div>
    );
};
export default InitialView;
