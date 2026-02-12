import React, { useEffect, useState } from 'react'
import Styles from "../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/style.module.css";
import { useLocation } from 'react-router-dom';
import { imagePath } from '../../../constants';

function InitialView(props) {

    const [pageurl, setPageurl] = useState(false);

    const [investMentTypeCheck, setInvestMentTypeCheck] = useState({
        stock: false,
        MF: false
    })

    const location = useLocation();

    const handleContinue = () => {
        switch (true) {
            case investMentTypeCheck.stock && investMentTypeCheck.MF:
                props.setInvestmentTypeView('STOCK');
                props.setAreBothSelected({
                    both: true,
                    prevInvestView: 'STOCK',
                    redirectFlow: false
                });
                return;
            case investMentTypeCheck.stock:
                props.setInvestmentTypeView('STOCK');
                props.setAreBothSelected({
                    both: false,
                    prevInvestView: 'STOCK',
                    redirectFlow: false
                });
                return;
            case investMentTypeCheck.MF:
                props.setInvestmentTypeView('MF');
                props.setAreBothSelected({
                    both: false,
                    prevInvestView: 'MF',
                    redirectFlow: false
                });
                return;
            default:
                break;
        }
    }

    const isButtonDisabled = !investMentTypeCheck.stock && !investMentTypeCheck.MF;

    useEffect(() => {
        if ("pathname" in location) {
            setPageurl(location.pathname);
        }
    }, [location]);

    useEffect(() => {
        props.setAreBothSelected({
            both: false,
            prevInvestView: '',
            redirectFlow: false,
            stockStatus: null,
            MFStatus: null
        })
        props.setReportPDFUrl({
            MF: '',
            STOCK: ''
        })
        props.setModalData({
            mfAmount: null,
            stocksamount: null,
            totalAmount: null
        })
    }, [])

    return (
        <div>
            <div className="" style={{
                padding: "0 !important",

            }}>
                <div className="">
                    <div
                        style={{
                            backgroundColor: "#042b62"
                        }}
                        className="RefreshModalpopup_Heading col-12 d-flex custom-background-color">
                        <div className={`${Styles.modal_Heading}`}>Consolidated Portfolio Report</div>
                        <div className={`${Styles.CloseBtnpopup}`}>
                            <img
                                onClick={() => props.Closemodal()}
                                style={{ cursor: "pointer", right: 0 }}
                                src={imagePath + "/static/media/DG/Close.svg"}
                                alt="Close"
                            />
                        </div>
                    </div>
                    <div className={`modalBody ${Styles.DematmodalBody}`}>
                        <div className={`${Styles.parBody}`}>
                            <div className={`${Styles.parTitle}`}>Welcome!</div>
                            <ul>
                                <li>We are excited to provide you with a detailed portfolio report for your investments, tailored to your financial goals and preference. Our goal is to offer you valuable insights into your financial journey.</li>
                                <li>You can access your stocks and mutual funds via an account aggregator. Select the options from respective types as per your transactions for data retrieval.</li>
                            </ul>
                            <div>
                                <div className="d-flex align-items-center " >
                                    <div>
                                        {/* <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.2734 9.56254C13.6879 9.56254 13.116 9.61419 12.6091 9.71038C12.2724 8.97364 10.9494 8.59547 9.52734 8.5215V6.32817H11.1094C13.7264 6.32817 15.8555 4.19907 15.8555 1.58208V0.527389C15.8555 0.314096 15.727 0.121791 15.5299 0.0401932C15.3329 -0.0414396 15.106 0.00366589 14.9552 0.154486L14.5183 0.591373C14.2195 0.890201 13.8222 1.05473 13.3997 1.05473H13.2188C11.3843 1.05473 9.78968 2.10102 9 3.6281C8.21032 2.10102 6.61574 1.05473 4.78125 1.05473H4.6003C4.17772 1.05473 3.78042 0.890166 3.48163 0.591373L3.04478 0.154486C2.89396 0.00366589 2.66713 -0.0414747 2.47008 0.0401581C2.27303 0.121791 2.14453 0.314096 2.14453 0.527389V1.58208C2.14453 4.19907 4.27363 6.32817 6.89063 6.32817H8.47266V8.5215C7.05059 8.59547 5.72759 8.97368 5.39089 9.71038C4.88401 9.61419 4.31213 9.56254 3.72656 9.56254C1.87165 9.56254 0 10.0517 0 11.1446V13.254V15.3633C0 16.4562 1.87165 16.9454 3.72656 16.9454C4.31213 16.9454 4.88401 16.8937 5.39089 16.7975C5.769 17.6248 7.39083 18 9 18C10.6092 18 12.231 17.6248 12.6091 16.7975C13.116 16.8937 13.6879 16.9454 14.2734 16.9454C16.1284 16.9454 18 16.4562 18 15.3633V13.254V11.1446C18 10.0517 16.1284 9.56254 14.2734 9.56254ZM13.2188 2.10942C13.4967 2.10942 14.1172 2.13705 14.7986 1.70885C14.7315 3.68576 13.1023 5.27348 11.1094 5.27348H9.56489C9.8216 3.48695 11.3624 2.10942 13.2188 2.10942ZM6.89063 5.27348C4.89769 5.27348 3.26851 3.68576 3.20136 1.70885C3.73999 2.04726 4.21436 2.10942 4.78125 2.10942C6.63768 2.10942 8.17843 3.48695 8.43511 5.27348H6.89063ZM5.30859 15.7387C4.84242 15.8373 4.29515 15.8906 3.72656 15.8906C2.1363 15.8907 1.21655 15.5003 1.05469 15.3153V14.4108C1.76527 14.6998 2.7482 14.8359 3.72656 14.8359C4.28063 14.8359 4.82245 14.7897 5.30859 14.7032V15.7387ZM5.30859 13.6294C4.84242 13.728 4.29515 13.7813 3.72656 13.7813C2.1363 13.7813 1.21655 13.3909 1.05469 13.2059V12.3015C1.76527 12.5904 2.7482 12.7266 3.72656 12.7266C4.28063 12.7266 4.82245 12.6803 5.30859 12.5939V13.6294ZM5.30859 11.52C4.84242 11.6186 4.29515 11.6719 3.72656 11.6719C2.26357 11.6719 1.36804 11.3415 1.10805 11.1445C1.36804 10.9476 2.26357 10.6172 3.72656 10.6172C4.29515 10.6172 4.84242 10.6706 5.30859 10.7691V11.52ZM9 9.56254C10.4575 9.56254 11.3413 9.89498 11.5889 10.0899C11.3413 10.2848 10.4575 10.6172 9 10.6172C7.54246 10.6172 6.65877 10.2848 6.41113 10.0899C6.65877 9.89495 7.54246 9.56254 9 9.56254ZM11.6367 16.153C11.6367 16.1545 11.6367 16.156 11.6367 16.1574V16.3731C11.4823 16.5561 10.5773 16.9454 9 16.9454C7.42279 16.9454 6.51772 16.5561 6.36328 16.3731V16.1574C6.36332 16.156 6.36328 16.1545 6.36328 16.153V15.4695C7.06637 15.7557 8.03538 15.8907 9 15.8907C9.96462 15.8907 10.9336 15.7557 11.6367 15.4695V16.153ZM11.6367 14.0436C11.6367 14.0451 11.6367 14.0465 11.6367 14.048V14.2637C11.4823 14.4468 10.5773 14.836 9 14.836C7.42279 14.836 6.51772 14.4468 6.36328 14.2637V14.048C6.36332 14.0465 6.36328 14.0451 6.36328 14.0436V13.3601C7.06637 13.6463 8.03538 13.7813 9 13.7813C9.96462 13.7813 10.9336 13.6463 11.6367 13.3601V14.0436ZM11.6367 11.9343C11.6367 11.9358 11.6367 11.9372 11.6367 11.9387V12.1544C11.4823 12.3374 10.5773 12.7266 9 12.7266C7.42279 12.7266 6.51772 12.3374 6.36328 12.1544V11.9387C6.36332 11.9372 6.36328 11.9358 6.36328 11.9343V11.2508C7.06637 11.537 8.03538 11.672 9 11.672C9.96462 11.672 10.9336 11.537 11.6367 11.2508V11.9343ZM12.6914 10.7692C13.1576 10.6706 13.7049 10.6173 14.2735 10.6173C15.7365 10.6172 16.632 10.9476 16.8919 11.1446C16.632 11.3415 15.7365 11.6719 14.2735 11.6719C13.7049 11.6719 13.1576 11.6186 12.6914 11.52V10.7692ZM16.9453 15.3153C16.7835 15.5003 15.8637 15.8907 14.2734 15.8907C13.7049 15.8907 13.1576 15.8373 12.6914 15.7388V14.7033C13.1775 14.7897 13.7194 14.836 14.2734 14.836C15.2518 14.836 16.2347 14.6998 16.9453 14.4108V15.3153ZM16.9453 13.2059C16.7835 13.3909 15.8637 13.7813 14.2734 13.7813C13.7049 13.7813 13.1576 13.728 12.6914 13.6294V12.5939C13.1775 12.6803 13.7194 12.7266 14.2734 12.7266C15.2518 12.7266 16.2347 12.5904 16.9453 12.3015V13.2059Z" fill="#042b62" />
                                        </svg> */}

                                        <img src={
                                            imagePath + "/web/static/media/PARFlow/svg1.svg"
                                        } alt="" />
                                    </div>
                                    <div className="ms-2" style={{
                                        color: "#080808",
                                        fontSize: "1.3rem",
                                        fontWeight: "600"
                                    }}>Investment Type</div>
                                </div>
                                <div className="d-md-flex align-items-center ms-4 mt-3" >
                                    <div style={{
                                        backgroundColor: investMentTypeCheck.stock ? "#EFFAFF" : "#fff"
                                    }} className={`me-5 pointer custom-dashed-border ${Styles.partreportselectiontype} ${investMentTypeCheck.stock ? 'custom-background-color-fade' : ''}`} onClick={() => {
                                        setInvestMentTypeCheck(prev => ({ ...prev, stock: !prev.stock }))
                                    }}>
                                        <div style={{ position: "absolute", right: "1rem" }}>
                                            <input
                                                type="checkbox"
                                                id="stocksCheckbox"
                                                checked={investMentTypeCheck.stock}
                                                onChange={(e) => setInvestMentTypeCheck(prev => ({ ...prev, stock: e.target.checked }))}
                                            />
                                        </div>
                                        <div>
                                            {/* <svg width="40" height="40" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="15.5" cy="15.5" r="15.5" fill="#E3F7FF" />
                                                <path d="M14.9905 17.0097H16.839H18.6875C18.8236 17.0097 18.9339 16.8994 18.9339 16.7633V13.929C18.9339 13.6572 18.7128 13.436 18.441 13.436H17.0863C17.0886 13.4516 17.0884 13.4675 17.0854 13.4835V12.9431C17.0854 12.6713 16.8643 12.4502 16.5925 12.4502H15.2369C14.9651 12.4502 14.744 12.6713 14.744 12.9431V14.7916H13.3884C13.1166 14.7916 12.8955 15.0128 12.8955 15.2845V16.7633C12.8955 16.8994 13.0059 17.0098 13.142 17.0098L14.9905 17.0097ZM17.0854 13.929H18.441V16.5168H17.0854V13.929ZM15.237 12.9431H16.5925V16.5168H15.237V12.9431ZM13.3885 15.2845H14.744V16.5168H13.3885V15.2845Z" fill="#042b62" />
                                                <path d="M15.9766 19.4746C18.4908 19.4746 20.5362 17.4292 20.5362 14.9151C20.5362 12.4009 18.4908 10.3555 15.9766 10.3555C13.4624 10.3555 11.417 12.4009 11.417 14.9151C11.417 17.4292 13.4624 19.4746 15.9766 19.4746ZM15.9766 10.8484C18.219 10.8484 20.0433 12.6727 20.0433 14.9151C20.0433 17.1574 18.219 18.9817 15.9766 18.9817C13.7342 18.9817 11.9099 17.1574 11.9099 14.9151C11.91 12.6727 13.7342 10.8484 15.9766 10.8484Z" fill="#042b62" />
                                                <path d="M10.8623 23.8071C11.1333 23.9636 11.4295 24.0379 11.722 24.0379C12.3187 24.0379 12.8998 23.7285 13.219 23.1756L14.6587 20.6821C15.0826 20.7789 15.5236 20.8303 15.9764 20.8303C19.2381 20.8303 21.8916 18.1767 21.8916 14.9151C21.8916 11.6535 19.2381 9 15.9764 9C12.7148 9 10.0613 11.6535 10.0613 14.9151C10.0613 16.4795 10.672 17.9037 11.6671 18.9626L10.2308 21.4504C9.75515 22.2743 10.0384 23.3315 10.8623 23.8071ZM15.9764 9.49293C18.9663 9.49293 21.3986 11.9253 21.3986 14.9152C21.3986 17.905 18.9663 20.3374 15.9764 20.3374C12.9866 20.3374 10.5542 17.905 10.5542 14.9152C10.5542 11.9253 12.9866 9.49293 15.9764 9.49293ZM10.6577 21.6968L12.031 19.3182C12.6423 19.8665 13.368 20.2896 14.1675 20.547L12.7921 22.9292C12.4524 23.5176 11.6972 23.72 11.1087 23.3802C10.5203 23.0405 10.3179 22.2853 10.6577 21.6968Z" fill="#042b62" />
                                            </svg> */}

                                            <img src={
                                                imagePath + "/web/static/media/PARFlow/svg2.svg"
                                            } alt="" />
                                        </div>
                                        <div className="ms-3" >
                                            <div className={`${Styles.titleName}`}>Stocks</div>
                                            <div className={`${Styles.information}`}>Fintoo will need access to your CDSL  account statement via Finvu, a regulated RBI account aggregator, to analyze your stock details.</div>
                                        </div>
                                    </div>

                                    <div style={{
                                        backgroundColor: investMentTypeCheck.MF ? "#EFFAFF" : "#fff",
                                        filter: 'alpha(opacity=60)'
                                    }} className={`pointer custom-dashed-border ${Styles.partreportselectiontype} ${investMentTypeCheck.MF ? 'custom-background-color-fade' : ''}`} onClick={() => {
                                        setInvestMentTypeCheck(prev => ({ ...prev, MF: !prev.MF }))

                                    }}>
                                        <div style={{ position: "absolute", right: "1rem" }}>
                                            <input
                                                type="checkbox"
                                                id="mfCheckbox"
                                                checked={investMentTypeCheck.MF}
                                                onChange={(e) => setInvestMentTypeCheck(prev => ({ ...prev, MF: e.target.checked }))}
                                            />
                                        </div>
                                        <div>
                                            {/* <svg width="40" height="40" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="15.5" cy="15.5" r="15.5" fill="#E3F7FF" />
                                                <path d="M11.8261 19.3047H9V22.1308H11.8261V19.3047ZM11.2609 21.5656H9.56522V19.8699H11.2609V21.5656Z" fill="#042b62" />
                                                <path d="M15.2177 22.1311V17.6094H12.3916V22.1311H15.2177ZM12.9568 18.1746H14.6525V21.5659H12.9568V18.1746Z" fill="#042b62" />
                                                <path d="M18.6088 22.1305V15.9131H15.7827V22.1305H18.6088ZM16.3479 16.4783H18.0436V21.5653H16.3479V16.4783Z" fill="#042b62" />
                                                <path d="M19.1743 22.1316H22.0004V13.6533H19.1743V22.1316ZM19.7395 14.2185H21.4352V21.5664H19.7395V14.2185Z" fill="#042b62" />
                                                <path d="M19.3671 10.8119L20.4678 11.1788L15.7826 13.8912V11.4304C15.8189 11.4379 15.8558 11.4421 15.8929 11.443C16.4159 11.443 17.0675 10.8237 17.6545 10.1884C18.1377 9.66406 18.5357 9.06721 18.8339 8.41957L19.0026 8.05472L18.6022 8.01939C17.1877 7.89396 15.9989 8.38369 15.5029 9.29637L15.5 9.30244L15.4971 9.29637C15.0012 8.38383 13.8142 7.89423 12.3978 8.01939L11.9975 8.05471L12.1661 8.41956C12.4644 9.0672 12.8623 9.66405 13.3456 10.1884C13.9326 10.8238 14.5842 11.443 15.1072 11.443C15.1442 11.4421 15.1811 11.4379 15.2174 11.4304V14.2185L10.2715 17.0819L10.5547 17.571L20.6481 11.7274L20.3189 12.7153L20.8551 12.8941L21.5097 10.9303L19.546 10.2757L19.3671 10.8119ZM15.9997 9.56628C16.3335 8.9518 17.1445 8.57936 18.1275 8.56625C17.8835 9.01398 17.5852 9.42994 17.2394 9.80473C16.1939 10.9361 15.9031 10.8819 15.8824 10.8765C15.7592 10.7947 15.7073 10.1045 15.9997 9.56628ZM15.1177 10.8765C15.0972 10.8826 14.8057 10.936 13.7606 9.80474C13.4149 9.42995 13.1166 9.01399 12.8725 8.56625C13.8554 8.57936 14.6667 8.95194 15.0004 9.56628C15.2928 10.1045 15.2409 10.7947 15.1177 10.8765Z" fill="#042b62" />
                                            </svg> */}

                                            <img src={
                                                imagePath + "/web/static/media/PARFlow/svg3.svg"
                                            } alt="" />

                                        </div>
                                        <div className="ms-3">
                                            <div className={`${Styles.titleName}`}>Mutual Fund</div>
                                            <div className={`${Styles.information}`}>By inputting your PAN and mobile number, which are linked to your mutual fund account, we can seamlessly retrieve your information through MF central.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`mt-5 ${isButtonDisabled ? Styles.disablecontinuebtn : Styles.continueBtns}`}>
                                <button className='custom-btn-style' onClick={() => handleContinue()}>Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default InitialView
