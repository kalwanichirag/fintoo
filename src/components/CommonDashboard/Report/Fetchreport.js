import React, { useEffect, useState } from 'react'
import style from "./style.module.css";
import Styles from "../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/style.module.css"
import { useLocation } from "react-router-dom";
import { indianRupeeFormat } from '../../../common_utilities';
import { imagePath } from '../../../constants';
import CommonCss from "../../CommonStyle/CommonPopup.module.css"

function Fetchreport(props) {
    const [stockMFView, setStockMFView] = useState('BOTH');
    const [pageurl, setPageurl] = useState(false);
    const location = useLocation();
    const [snippetError, setSnippetError] = useState(false);
    const [nodataError, setNoDataError] = useState(false);

    const handleDownloadClick = (downloadPDF) => {
        const link = document.createElement('a');
        link.href = downloadPDF;
        // link.download = 'MF Screening Report';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
    };

    const handleRedirect = () => {
        props.setAreBothSelected(prev => ({
            ...prev,
            redirectFlow: true
        }));

        props.setInvestmentTypeView((prev) => {
            return props.areBothSelected.prevInvestView === 'STOCK' ? 'MF' : 'STOCK'
        })
    }

    useEffect(() => {
        if ("pathname" in location) {
            setPageurl(location.pathname);
        }
    }, [location]);

    useEffect(() => {
        if (props.areBothSelected.stockStatus === false && props.areBothSelected.MFStatus === false) {
            setStockMFView('BOTH');
            return;
        }
        if (props.areBothSelected.stockStatus === false) {
            setStockMFView('MF');
            return;
        }
        if (props.areBothSelected.MFStatus === false) {
            setStockMFView('STOCK');
            return;
        }
    }, []);

    return (
        <>

            <div>
                <div className={``}>
                    {
                        props.setMfFlow ? <></> : <>
                            <div style={{
                                backgroundColor: "#042b62"
                            }} className="RefreshModalpopup_Heading d-flex custom-background-color">
                                {
                                    props.areBothSelected.both && (props.areBothSelected.stockStatus === false || props.areBothSelected.MFStatus === false) ? (
                                        <div className={`${Styles.modal_Heading}`}>
                                            {
                                                stockMFView === 'BOTH' && 'No Investments Found!'
                                            }
                                            {
                                                stockMFView === 'MF' && 'Mutual Fund'
                                            }
                                            {
                                                stockMFView === 'STOCK' && 'Stocks'
                                            }
                                        </div>
                                    ) :
                                        (
                                            <div className={`${Styles.modal_Heading}`}>
                                                {
                                                    props.areBothSelected.both ? 'Your Stock holding is linked  successfully !' : props.areBothSelected.prevInvestView === 'STOCK' ? 'Stocks' : 'Mutual Fund'
                                                }
                                            </div>
                                        )
                                }

                                <div className={`${Styles.CloseBtnpopup}`}>
                                    <img
                                        onClick={() => props.Closemodal()}
                                        style={{ cursor: "pointer", right: 0 }}
                                        src={process.env.REACT_APP_STATIC_URL + "media/DG/Close.svg"}
                                        alt="Close"
                                    />

                                </div>


                            </div>
                        </>
                    }

                    {
                        props.areBothSelected.both && (props.areBothSelected.stockStatus === false || props.areBothSelected.MFStatus === false) ?
                            (
                                <>
                                    {
                                        stockMFView === 'BOTH' &&
                                        <div style={{
                                            textAlign: "center",
                                            padding: "2rem"
                                        }} className={`modalBody d-block ${Styles.DematmodalBody}`}>
                                            <div className={`${CommonCss.modalContent}`}>
                                                <img style={{ width: "100px" }} src={`${process.env.PUBLIC_URL}/static/media/unsucesfull.svg`} alt='success-data' />
                                                <br />
                                                <div style={{
                                                    fontSize: "1.3rem",
                                                    fontWeight: '600',
                                                    color: "rgba(0, 0, 0, 0.50)"
                                                }} className={`${style.Description}`}>
                                                    Based on the details you provided, we couldn't find any stock or mutual fund investments in your portfolio.
                                                    If you believe this is an error, please check your details and try again or contact support for assistance.
                                                </div>
                                                <button
                                                    onClick={() => props.Closemodal()}
                                                    style={{
                                                        backgroundColor: "#042b62",
                                                        border: "1px solid #042b62",
                                                        color: "#fff"
                                                    }}
                                                    type="button"
                                                    className="Unlink custom-btn-style"
                                                >
                                                    Ok
                                                </button>
                                            </div>
                                        </div>
                                    }
                                    {
                                        stockMFView === 'MF' &&
                                        <div style={{
                                            textAlign: "center",
                                            padding: "2rem"
                                        }} className={`modalBody d-block ${Styles.DematmodalBody}`}>
                                            <div className={`${CommonCss.modalContent}`}>
                                                {/* <img style={{ width: "100px" }} src={imagePath + "/web/static/media/unsucesfull.svg"} alt='success-data' /> */}
                                                <div style={{
                                                    fontSize: "1"

                                                }} className={`${CommonCss.infoText}`}>
                                                    Your Mutual Funds Portfolio - {
                                                        <span style={{ color: '#042b62' }}>{props.modalData.mfAmount && indianRupeeFormat(props.modalData.mfAmount).replace(/\.00$/, '')}</span>
                                                    }

                                                </div>

                                                <div style={{
                                                    fontSize: "1.3rem",
                                                    fontWeight: '600',
                                                    color: "rgba(0, 0, 0, 0.50)"
                                                }}
                                                    // className={`${CommonCss.infoText}`}
                                                    className={`${style.Description}`}
                                                >
                                                    Based on the details you provided, we found the following mutual fund investments in your portfolio. It appears you do not have any stock investments at the moment.
                                                    You can download a detailed report of your mutual fund portfolio by clicking the button below.
                                                </div>
                                                <button
                                                    onClick={() => handleDownloadClick(props.reportPDFUrl.MF)}
                                                    style={{
                                                        backgroundColor: "#042b62",
                                                        border: "1px solid #042b62",
                                                        color: "#fff"
                                                    }}
                                                    type="button"
                                                    className="Unlink ms-4 custom-btn-style"
                                                >
                                                    Download Report
                                                </button>
                                            </div>
                                        </div>
                                    }
                                    {
                                        stockMFView === 'STOCK' &&
                                        <div style={{
                                            textAlign: "center",
                                            padding: "2rem"
                                        }} className={`modalBody d-block ${Styles.DematmodalBody}`}>
                                            <div className={`${CommonCss.modalContent}`}>
                                                {/* <img style={{ width: "100px" }} src={imagePath + "/web/static/media/unsucesfull.svg"} alt='success-data' /> */}
                                                <div style={{
                                                    fontSize: "1"
                                                }} className={`${CommonCss.infoText}`}>
                                                    Your Stocks Portfolio - {<span style={{ color: '#042b62' }}>{props.modalData.stocksamount && indianRupeeFormat(props.modalData.stocksamount).replace(/\.00$/, '')}</span>}
                                                </div>
                                                <div style={{
                                                    fontSize: "1.3rem",
                                                    fontWeight: '600',
                                                    color: "rgba(0, 0, 0, 0.50)"
                                                }} className={`${style.Description}`}>
                                                    Based on the details you provided, we found the following stock investments in your portfolio. It appears you do not have any mutual fund investments at the moment.
                                                    You can download a detailed report of your stocks portfolio by clicking the button below.
                                                </div>
                                                <button
                                                    onClick={() => handleDownloadClick(props.reportPDFUrl.STOCK)}
                                                    style={{
                                                        backgroundColor: "#042b62",
                                                        border: "1px solid #042b62",
                                                        color: "#fff"
                                                    }}
                                                    type="button"
                                                    className="Unlink ms-4 custom-btn-style"
                                                >
                                                    Download Report
                                                </button>
                                            </div>
                                        </div>
                                    }
                                </>
                            )
                            : (
                                <div style={{
                                    textAlign: "center",
                                    padding: "2rem"
                                }} className={`modalBody d-block ${Styles.DematmodalBody}`}>
                                    <div>
                                        <div style={{
                                            margin: "1rem 0"
                                        }}>
                                            <div className={`${CommonCss.modalContent}`}>
                                                {snippetError ? (
                                                    <>
                                                        <img style={{ width: "100px" }} src={`${process.env.PUBLIC_URL}/static/media/unsucesfull.svg`} alt='success-data' />

                                                        {
                                                            nodataError ? (
                                                                <>

                                                                    <div style={{
                                                                        fontSize: "1"
                                                                    }} className={`${CommonCss.infoText}`}>
                                                                        Looks like you don't have any investments!
                                                                    </div>
                                                                    <button style={{
                                                                        backgroundColor: "#042b62",
                                                                        border: "1px solid #042b62",
                                                                        color: "#fff !important"
                                                                    }} type="button" className="Unlink ms-4 custom-btn-style" onClick={() => props.Closemodal()}>Cancel</button>
                                                                </>
                                                            ) :
                                                                <div style={{
                                                                    fontSize: "1"
                                                                }} className={`${CommonCss.infoText}`}>
                                                                    An error occurred while fetching your investment details. Please try again later. We apologise for the inconvenience.
                                                                </div>
                                                        }
                                                    </>

                                                ) : (
                                                    <img src={`${process.env.PUBLIC_URL}/static/media/Success.svg`} alt='success-data' />
                                                )
                                                }
                                            </div>
                                        </div>
                                        {
                                            props.areBothSelected.both ? (
                                                <>
                                                    {props.modalData.stocksamount ? (
                                                        <div className={`${CommonCss.modalContent}`}>
                                                            <div className={`${style.currVal}`}>
                                                                Current Value : <span style={{ color: '#042b62' }}>{props.modalData.stocksamount && indianRupeeFormat(props.modalData.stocksamount).replace(/\.00$/, '')}</span>
                                                            </div>
                                                            <div style={{
                                                                color: "rgba(0, 0, 0, 0.50)",

                                                            }} className={`${style.Description} ${CommonCss.infoText}`}>
                                                                To get complete access to your Portfolio Analysis Report (PAR), we need to link your Mutual fund holdings too. To link your Mutual Fund holdings click on continue.
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div></div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {snippetError ? (
                                                        <div className={`${CommonCss.modalContent}`}>
                                                            <div className={`${style.currVal}`}>
                                                                Unsuccessful!
                                                            </div>
                                                            <div style={{ color: "rgba(0, 0, 0, 0.50)", }} className={`${style.Description} ${CommonCss.infoText}`}>
                                                                We could not link your {props.areBothSelected.prevInvestView === 'STOCK' ? 'Stocks' : 'Mutual Fund'} holdings. Please try again.
                                                            </div>
                                                        </div>

                                                    ) : (
                                                        <div className={`${CommonCss.modalContent}`}>
                                                            <div className={`${style.currVal}`}>
                                                                Congratulations!
                                                            </div>
                                                            <div style={{ color: "rgba(0, 0, 0, 0.50)", }} className={`${style.Description} ${CommonCss.infoText}`}>
                                                                You have successfully linked your {props.areBothSelected.prevInvestView === 'STOCK' ? 'Stocks' : 'Mutual Fund'} holdings.
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )
                                        }
                                        <div className='d-flex justify-content-center'>
                                            {
                                                props.areBothSelected.both ?
                                                    <div>
                                                        {props.modalData.stocksamount ? (
                                                            <button
                                                                onClick={() => { handleRedirect() }}
                                                                style={{
                                                                    backgroundColor: "#042b62",
                                                                    border: "1px solid #042b62",
                                                                    color: "#fff !important"
                                                                }} type="button" className="Unlink ms-4 custom-btn-style">
                                                                Continue
                                                            </button>
                                                        ) : (
                                                            <div></div>
                                                        )}
                                                    </div>
                                                    : <>
                                                        {snippetError ? (
                                                            <div></div>

                                                        ) : (
                                                            <button
                                                                onClick={() => { props.setShowSuccessPopupSpinner(true) }}
                                                                style={{
                                                                    backgroundColor: "#042b62",
                                                                    border: "1px solid #042b62",
                                                                    color: "#fff"
                                                                }} type="button" className="Unlink ms-4 custom-btn-style">
                                                                Continue
                                                            </button>
                                                        )}
                                                    </>
                                            }

                                        </div>

                                    </div>
                                </div>
                            )
                    }
                </div>
            </div>
        </>
    )
}

export default Fetchreport
