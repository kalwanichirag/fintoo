import { useEffect, useState } from "react";
import Styles from "./style.module.css";
import { Row, Modal } from "react-bootstrap";
import NsdlcsdlInnersection from "./NsdlcsdlInnersection";
import Stepper from "./Stepper";
import BasicDetails from "./BasicDetails";
import Otpverification from "./Otpverification";
import AccoutDetails from "./AccoutDetails";
import Completed from "./Completed";
import MobileStepper from "./MobileStepper";
import { useDispatch, useSelector } from "react-redux";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
const Nsdlcsdl = forwardRef((props, ref) => {
  const { hideDematTab,hideParIntro = true, fromStockCard = false } = props;

  const dispatch = useDispatch();
  //
  // const triggerRefreshData = useSelector((state)=> state.triggerRefreshData);
  const [discoveredAccountsData, setDiscoveredAccountsData] = useState([]);
  const [showcsdlnsdlModal, setshowcsdlnsdlModal] = useState(false);
  const [linknow, setLinknow] = useState(false);
  const [count, setCount] = useState(0);
  const [dummy, setDummy] = useState({
    username: "",
    mobileNum: "",
    handleId: ""
  })
  // const CloseModal = () => {
  //     setshowcsdlnsdlModal(false)
  // }
  // const CloseModal = () => {
  //     setshowcsdlnsdlModal(false)
  // }
  const [currentPopup, setCurrentPopup] = useState(null);
  const [tab, setTab] = useState("");
  const [actve, setActive] = useState(false);
  const [cdslNsdlResponse, setCdslNsdlResponse] = useState({});
  const [stocksChecked, setStocksChecked] = useState(false);
  const [mutualFundChecked, setMutualFundChecked] = useState(false);

  const handleStocksChange = () => {
    setStocksChecked(!stocksChecked);
  };

  const handleMutualFundChange = () => {
    setMutualFundChecked(!mutualFundChecked);
  };
  const onChangepopup = () => {
    setActive(true)
  }
  const handleProceedClick = () => {
    setCount(count + 1);
  };
  const handleBackProceedClick = () => {
    if (count === 2) {
      setCount(0);
    }
  };

  // useEffect(()=> {
  //   if(triggerRefreshData && Object.keys(triggerRefreshData).length > 0) {
  //     setActive(true);
  //     setCurrentPopup(0);
  //     dispatch({type: 'TRIGGER_REFRESH_HOLDING', payload: {}});
  //   }
  // }, [triggerRefreshData]);
  useImperativeHandle(ref, () => ({
  openModal() {
    setCount(0);
      setActive(false);
      setTab("Demat");  
    setCurrentPopup(0); // THIS opens the modal
  },
  closeModal() {
    setCurrentPopup(null);
    setActive(false);
  }
}));

  return (
    <>
      {hideParIntro && (
  props.forpar == true ? <>
            <>
              <div className="" style={{
                padding: "0 !important",

              }}>
                <div className="">
                  <div style={{
                    background: "#042b62",
                    border: "0px solid #042b62"
                  }} className="RefreshModalpopup_Heading col-12 d-flex ">
                    <div className={`${Styles.modal_Heading}`}>Consolidated Portfolio Report</div>
                    <div className={`${Styles.CloseBtnpopup}`}>
                      <img
                        onClick={() => {
                          props.Closemodal();
                          setActive(null)
                        }}
                        style={{ cursor: "pointer", right: 0 }}
                        src={process.env.REACT_APP_STATIC_URL + "media/DG/Close.svg"}
                        alt="Close"
                      />
                    </div>
                  </div>
                  <div className={`modalBody ${Styles.DematmodalBody}`}>
                    <div className={`${Styles.parBody}`}>
                      <div className={`${Styles.parTitle}`}>Welcome !</div>
                      <ul>
                        <li>We are excited to provide you with a detailed portfolio report for your investments, tailored to your financial goals and preference. Our goal is to offer you valuable insights into your financial journey.</li>
                        <li>You can access your stocks and mutual funds via an account aggregator. Select the options from respective types as per your transactions for data retrieval.</li>
                      </ul>
                      <div>
                        <div className="d-flex align-items-center " >
                          <div>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14.2734 9.56254C13.6879 9.56254 13.116 9.61419 12.6091 9.71038C12.2724 8.97364 10.9494 8.59547 9.52734 8.5215V6.32817H11.1094C13.7264 6.32817 15.8555 4.19907 15.8555 1.58208V0.527389C15.8555 0.314096 15.727 0.121791 15.5299 0.0401932C15.3329 -0.0414396 15.106 0.00366589 14.9552 0.154486L14.5183 0.591373C14.2195 0.890201 13.8222 1.05473 13.3997 1.05473H13.2188C11.3843 1.05473 9.78968 2.10102 9 3.6281C8.21032 2.10102 6.61574 1.05473 4.78125 1.05473H4.6003C4.17772 1.05473 3.78042 0.890166 3.48163 0.591373L3.04478 0.154486C2.89396 0.00366589 2.66713 -0.0414747 2.47008 0.0401581C2.27303 0.121791 2.14453 0.314096 2.14453 0.527389V1.58208C2.14453 4.19907 4.27363 6.32817 6.89063 6.32817H8.47266V8.5215C7.05059 8.59547 5.72759 8.97368 5.39089 9.71038C4.88401 9.61419 4.31213 9.56254 3.72656 9.56254C1.87165 9.56254 0 10.0517 0 11.1446V13.254V15.3633C0 16.4562 1.87165 16.9454 3.72656 16.9454C4.31213 16.9454 4.88401 16.8937 5.39089 16.7975C5.769 17.6248 7.39083 18 9 18C10.6092 18 12.231 17.6248 12.6091 16.7975C13.116 16.8937 13.6879 16.9454 14.2734 16.9454C16.1284 16.9454 18 16.4562 18 15.3633V13.254V11.1446C18 10.0517 16.1284 9.56254 14.2734 9.56254ZM13.2188 2.10942C13.4967 2.10942 14.1172 2.13705 14.7986 1.70885C14.7315 3.68576 13.1023 5.27348 11.1094 5.27348H9.56489C9.8216 3.48695 11.3624 2.10942 13.2188 2.10942ZM6.89063 5.27348C4.89769 5.27348 3.26851 3.68576 3.20136 1.70885C3.73999 2.04726 4.21436 2.10942 4.78125 2.10942C6.63768 2.10942 8.17843 3.48695 8.43511 5.27348H6.89063ZM5.30859 15.7387C4.84242 15.8373 4.29515 15.8906 3.72656 15.8906C2.1363 15.8907 1.21655 15.5003 1.05469 15.3153V14.4108C1.76527 14.6998 2.7482 14.8359 3.72656 14.8359C4.28063 14.8359 4.82245 14.7897 5.30859 14.7032V15.7387ZM5.30859 13.6294C4.84242 13.728 4.29515 13.7813 3.72656 13.7813C2.1363 13.7813 1.21655 13.3909 1.05469 13.2059V12.3015C1.76527 12.5904 2.7482 12.7266 3.72656 12.7266C4.28063 12.7266 4.82245 12.6803 5.30859 12.5939V13.6294ZM5.30859 11.52C4.84242 11.6186 4.29515 11.6719 3.72656 11.6719C2.26357 11.6719 1.36804 11.3415 1.10805 11.1445C1.36804 10.9476 2.26357 10.6172 3.72656 10.6172C4.29515 10.6172 4.84242 10.6706 5.30859 10.7691V11.52ZM9 9.56254C10.4575 9.56254 11.3413 9.89498 11.5889 10.0899C11.3413 10.2848 10.4575 10.6172 9 10.6172C7.54246 10.6172 6.65877 10.2848 6.41113 10.0899C6.65877 9.89495 7.54246 9.56254 9 9.56254ZM11.6367 16.153C11.6367 16.1545 11.6367 16.156 11.6367 16.1574V16.3731C11.4823 16.5561 10.5773 16.9454 9 16.9454C7.42279 16.9454 6.51772 16.5561 6.36328 16.3731V16.1574C6.36332 16.156 6.36328 16.1545 6.36328 16.153V15.4695C7.06637 15.7557 8.03538 15.8907 9 15.8907C9.96462 15.8907 10.9336 15.7557 11.6367 15.4695V16.153ZM11.6367 14.0436C11.6367 14.0451 11.6367 14.0465 11.6367 14.048V14.2637C11.4823 14.4468 10.5773 14.836 9 14.836C7.42279 14.836 6.51772 14.4468 6.36328 14.2637V14.048C6.36332 14.0465 6.36328 14.0451 6.36328 14.0436V13.3601C7.06637 13.6463 8.03538 13.7813 9 13.7813C9.96462 13.7813 10.9336 13.6463 11.6367 13.3601V14.0436ZM11.6367 11.9343C11.6367 11.9358 11.6367 11.9372 11.6367 11.9387V12.1544C11.4823 12.3374 10.5773 12.7266 9 12.7266C7.42279 12.7266 6.51772 12.3374 6.36328 12.1544V11.9387C6.36332 11.9372 6.36328 11.9358 6.36328 11.9343V11.2508C7.06637 11.537 8.03538 11.672 9 11.672C9.96462 11.672 10.9336 11.537 11.6367 11.2508V11.9343ZM12.6914 10.7692C13.1576 10.6706 13.7049 10.6173 14.2735 10.6173C15.7365 10.6172 16.632 10.9476 16.8919 11.1446C16.632 11.3415 15.7365 11.6719 14.2735 11.6719C13.7049 11.6719 13.1576 11.6186 12.6914 11.52V10.7692ZM16.9453 15.3153C16.7835 15.5003 15.8637 15.8907 14.2734 15.8907C13.7049 15.8907 13.1576 15.8373 12.6914 15.7388V14.7033C13.1775 14.7897 13.7194 14.836 14.2734 14.836C15.2518 14.836 16.2347 14.6998 16.9453 14.4108V15.3153ZM16.9453 13.2059C16.7835 13.3909 15.8637 13.7813 14.2734 13.7813C13.7049 13.7813 13.1576 13.728 12.6914 13.6294V12.5939C13.1775 12.6803 13.7194 12.7266 14.2734 12.7266C15.2518 12.7266 16.2347 12.5904 16.9453 12.3015V13.2059Z" fill="#042b62" />
                            </svg>
                          </div>
                          <div className="ms-2" style={{
                            color: "#080808",
                            fontSize: "1.3rem",
                            fontWeight: "600"
                          }}>Investment Type</div>
                        </div>
                        <div className="d-md-flex align-items-center ms-4 mt-3" >
                          <div className={`me-5 pointer ${Styles.partreportselectiontype}`} onClick={() => {
                            handleStocksChange();
                          }}>
                            <div style={{ position: "absolute", right: "1rem" }}>
                              <input
                                type="checkbox"
                                id="stocksCheckbox"
                                checked={stocksChecked}
                                onChange={handleStocksChange}
                              />
                            </div>
                            <div>
                              <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.99048 8.00974H6.83897H8.68746C8.82356 8.00974 8.93391 7.89939 8.93391 7.76329V4.92896C8.93391 4.65716 8.71277 4.43603 8.44098 4.43603H7.0863C7.08859 4.45157 7.08841 4.46755 7.08539 4.48352V3.94313C7.08539 3.67133 6.86428 3.4502 6.59249 3.4502H5.23693C4.96513 3.4502 4.744 3.67133 4.744 3.94313V5.79162H3.38844C3.11664 5.79162 2.89551 6.01275 2.89551 6.28455V7.76332C2.89551 7.89942 3.00585 8.00977 3.14196 8.00977L4.99048 8.00974ZM7.08545 4.92896H8.441V7.51684H7.08545V4.92896ZM5.23696 3.9431H6.59252V7.51681H5.23696V3.9431ZM3.38847 6.28452H4.74403V7.51684H3.38847V6.28452Z" fill="#042b62" />
                                <path d="M5.9766 10.4751C8.49078 10.4751 10.5362 8.42971 10.5362 5.91556C10.5362 3.40141 8.49078 1.35596 5.9766 1.35596C3.46244 1.35596 1.41699 3.40138 1.41699 5.91556C1.41702 8.42968 3.46244 10.4751 5.9766 10.4751ZM5.9766 1.84889C8.21898 1.84889 10.0433 3.67318 10.0433 5.91556C10.0433 8.15791 8.21898 9.9822 5.9766 9.9822C3.73421 9.9822 1.90992 8.15791 1.90992 5.91556C1.90995 3.67318 3.73424 1.84889 5.9766 1.84889Z" fill="#042b62" />
                                <path d="M0.862292 14.8071C1.13333 14.9636 1.42947 15.0379 1.72201 15.0379C2.31868 15.0379 2.89984 14.7285 3.21902 14.1756L4.65866 11.6821C5.08257 11.7789 5.52361 11.8303 5.97642 11.8303C9.23806 11.8303 11.8916 9.17674 11.8916 5.91513C11.8916 2.65352 9.23806 0 5.97642 0C2.71481 0 0.0612882 2.65352 0.0612882 5.91513C0.0612882 7.47948 0.671969 8.90371 1.66711 9.96259L0.230788 12.4504C-0.244845 13.2743 0.0384376 14.3315 0.862292 14.8071ZM5.97642 0.492932C8.96626 0.492932 11.3986 2.92532 11.3986 5.91516C11.3986 8.90497 8.96626 11.3374 5.97642 11.3374C2.9866 11.3374 0.554191 8.90497 0.554191 5.91516C0.55422 2.92532 2.9866 0.492932 5.97642 0.492932ZM0.657694 12.6968L2.03102 10.3182C2.64235 10.8665 3.36804 11.2896 4.16749 11.547L2.79214 13.9292C2.45241 14.5176 1.69725 14.72 1.10874 14.3802C0.520297 14.0405 0.317931 13.2853 0.657694 12.6968Z" fill="#042b62" />
                              </svg>
                            </div>
                            <div className="ms-3">
                              <div className={`${Styles.titleName}`}>Stocks</div>
                              <div className={`${Styles.information}`}>Fintoo will need access to your CDSL  account statement via Finvu, a regulated RBI account aggregator, to analyze your stock details.</div>
                            </div>
                          </div>

                          <div className={`pointer ${Styles.partreportselectiontype}`} onClick={() => {
                            handleMutualFundChange();
                          }}>
                            <div style={{ position: "absolute", right: "1rem" }}>
                              <input
                                type="checkbox"
                                id="stocksCheckbox"
                                checked={mutualFundChecked}
                                onChange={handleMutualFundChange}
                              />
                            </div>
                            <div>
                              <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.99048 8.00974H6.83897H8.68746C8.82356 8.00974 8.93391 7.89939 8.93391 7.76329V4.92896C8.93391 4.65716 8.71277 4.43603 8.44098 4.43603H7.0863C7.08859 4.45157 7.08841 4.46755 7.08539 4.48352V3.94313C7.08539 3.67133 6.86428 3.4502 6.59249 3.4502H5.23693C4.96513 3.4502 4.744 3.67133 4.744 3.94313V5.79162H3.38844C3.11664 5.79162 2.89551 6.01275 2.89551 6.28455V7.76332C2.89551 7.89942 3.00585 8.00977 3.14196 8.00977L4.99048 8.00974ZM7.08545 4.92896H8.441V7.51684H7.08545V4.92896ZM5.23696 3.9431H6.59252V7.51681H5.23696V3.9431ZM3.38847 6.28452H4.74403V7.51684H3.38847V6.28452Z" fill="#042b62" />
                                <path d="M5.9766 10.4751C8.49078 10.4751 10.5362 8.42971 10.5362 5.91556C10.5362 3.40141 8.49078 1.35596 5.9766 1.35596C3.46244 1.35596 1.41699 3.40138 1.41699 5.91556C1.41702 8.42968 3.46244 10.4751 5.9766 10.4751ZM5.9766 1.84889C8.21898 1.84889 10.0433 3.67318 10.0433 5.91556C10.0433 8.15791 8.21898 9.9822 5.9766 9.9822C3.73421 9.9822 1.90992 8.15791 1.90992 5.91556C1.90995 3.67318 3.73424 1.84889 5.9766 1.84889Z" fill="#042b62" />
                                <path d="M0.862292 14.8071C1.13333 14.9636 1.42947 15.0379 1.72201 15.0379C2.31868 15.0379 2.89984 14.7285 3.21902 14.1756L4.65866 11.6821C5.08257 11.7789 5.52361 11.8303 5.97642 11.8303C9.23806 11.8303 11.8916 9.17674 11.8916 5.91513C11.8916 2.65352 9.23806 0 5.97642 0C2.71481 0 0.0612882 2.65352 0.0612882 5.91513C0.0612882 7.47948 0.671969 8.90371 1.66711 9.96259L0.230788 12.4504C-0.244845 13.2743 0.0384376 14.3315 0.862292 14.8071ZM5.97642 0.492932C8.96626 0.492932 11.3986 2.92532 11.3986 5.91516C11.3986 8.90497 8.96626 11.3374 5.97642 11.3374C2.9866 11.3374 0.554191 8.90497 0.554191 5.91516C0.55422 2.92532 2.9866 0.492932 5.97642 0.492932ZM0.657694 12.6968L2.03102 10.3182C2.64235 10.8665 3.36804 11.2896 4.16749 11.547L2.79214 13.9292C2.45241 14.5176 1.69725 14.72 1.10874 14.3802C0.520297 14.0405 0.317931 13.2853 0.657694 12.6968Z" fill="#042b62" />
                              </svg>
                            </div>
                            <div className="ms-3">
                              <div className={`${Styles.titleName}`}>Mutual Fund</div>
                              <div className={`${Styles.information}`}>By inputting your PAN and mobile number, which are linked to your mutual fund account, we can seamlessly retrieve your information through MF central.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`mt-5 ${Styles.continueBtns}`}>
                        <button disabled={!stocksChecked && !mutualFundChecked} onClick={() => {
                          // props.Closemodal();
                          setCurrentPopup(0);
                        }}>Continue</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </> :

            <div className={`mt-3 ${Styles.NsdlcsdlView}`}>
              <div>
                <div className={`${Styles.NsdlcsdlViewSection}`}>
                  <div>
                    <div className={`${Styles.NsdlcsdlViewtext}`}>
                      Fetch more holdings{" "}
                    </div>
                    <div className={`${Styles.NsdlcsdlViewdsubtext}`}>
                      Link Now its simple and faster then ever  {" "}
                      <span
                        className={`${Styles.NsdlcsdlViewLink}`}
                        onClick={() => {
                          setCurrentPopup(0);
                          setCount(0);
                          setTab("Demat");
                        }}>Know more</span>
                    </div>

                  </div>
                  <div className="d-md-flex">
                    <div
                      className={`me-md-4 ${Styles.Holdingsoptview}`}
                      onClick={() => {
                        // setshowcsdlnsdlModal(true)
                        setCurrentPopup(0);
                        setCount(0);
                        setTab("Demat");
                      }}
                    >
                      <div className={`${Styles.leftsection}`}>
                        <div className={`${Styles.Holdingsoptviewtext}`}>
                          Link your Demat
                        </div>
                        <div className={`${Styles.PoweredBy}`}>
                          <span>Powered by</span>{" "}
                          <img
                            src={
                              process.env.REACT_APP_STATIC_URL + "media/DG/Finvu.png"
                            }
                            width={"50px"}
                          />
                        </div>
                      </div>
                      <div className={`${Styles.next}`}>
                        <img
                          src={process.env.REACT_APP_STATIC_URL + "media/DG/Next.svg"}
                          width={"40px"}
                        />
                      </div>
                    </div>
                    {/* <div
                    className={`${Styles.Holdingsoptview}`}
                    onClick={() => {
                      // setshowcsdlnsdlModal(true)
                      setCurrentPopup(0);
                      setTab("Broker");
                    }}
                  >
                    <div className={`${Styles.leftsection}`}>
                      <div className={`${Styles.Holdingsoptviewtext}`}>
                        Connect With Broker
                      </div>
                      <div className={`${Styles.PoweredBy}`}>
                        <span>Powered by</span>{" "}
                        <img
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DG/Smallcase.png"
                          }
                          width={"60px"}
                        />
                      </div>
                    </div>
                    <div className={`${Styles.next}`}>
                      <img
                        src={process.env.REACT_APP_STATIC_URL + "media/DG/Next.svg"}
                        width={"40px"}
                      />
                    </div>
                  </div> */}
                  </div>
                </div>
              </div>
            </div>
         
)}

      {/* All Modals */}
      <Modal
        dialogClassName="Nsdlcsdl-modal-width"
        show={currentPopup === 0}
        onClose={() => () => { setCurrentPopup(null); }}
        centered
        animationDuration={0}
      >
        {
          actve ? (
            <>
              <div className="" style={{ padding: "0 !important" }}>
                <div className="">
                  <div style={{ backgroundColor: "#042b62" }} className="RefreshModalpopup_Heading col-12 d-flex ">
                    <div className={`${Styles.modal_Heading}`}>Link Your Demat</div>
                    <div className={`${Styles.CloseBtnpopup}`}>
                      <img
                        onClick={() => {
                          setCurrentPopup(null);
                          setActive(null)
                        }}
                        style={{ cursor: "pointer", right: 0 }}
                        src={process.env.REACT_APP_STATIC_URL + "media/DG/Close.svg"}
                        alt="Close"
                      />
                    </div>
                  </div>
                  <div className={`modalBody ${Styles.DematmodalBody}`}>
                    <div className={`${Styles.LeftSection}`}>
                      <div className="d-md-block d-none">
                        <Stepper
                          stepnumber="1"
                          text1={"Basic Details "}
                          text2={"Provide your account details"}
                          isActive={count >= 0}
                        />

                        <Stepper
                          stepnumber="2"
                          text1={"OTP Verification"}
                          text2={"Consent to fetch your documents"}
                          isActive={count >= 1}
                        />
                        <Stepper
                          stepnumber="3"
                          text1={"Account Details"}
                          text2={"Your demat related info"}
                          isActive={count >= 2}
                          isNumberMatched={props.isNumberMatched}
                          currentPopup={currentPopup}
                          cdslNsdlResponse={cdslNsdlResponse}
                        />
                        <Stepper
                          stepnumber="4"
                          text1={"Completed"}
                          text2={"Woah, we are here"}
                          isActive={count >= 3}
                        />
                      </div>
                      <div>
                        <div className={`d-flex d-md-none ${Styles.mobileStepper}`}>
                          <MobileStepper isActive={count >= 0} stepnumber="1" />
                          <MobileStepper isActive={count >= 1} stepnumber="2" />
                          <MobileStepper cdslNsdlResponse={cdslNsdlResponse}
                            isNumberMatched={props.isNumberMatched} currentPopup={currentPopup} isActive={count >= 2} stepnumber="3" />
                          <MobileStepper isActive={count >= 3} stepnumber="4" />
                        </div>
                        <div className="d-md-none d-block pt-2">
                          {
                            count === 0 ? (
                              <div className={count === 0 ? "d-block" : "d-none"}>
                                <div className={`${Styles.stepTitle}`} style={{ color: "#042b62" }}>Basic Details</div>
                                <div className={`${Styles.stepsubTitle}`}>Provide your account details</div>
                              </div>
                            ) : null
                          }
                          {
                            count === 1 ? (
                              <div className={count === 1 ? "d-block" : "d-none"}>
                                <div className={`${Styles.stepTitle}`} style={{ color: "#042b62" }}>OTP Verification</div>
                                <div className={`${Styles.stepsubTitle}`}>Consent to fetch your documents</div>
                              </div>
                            ) : null
                          }
                          {
                            count === 2 ? (
                              <div className={count === 2 ? "d-block" : "d-none"}>
                                <div className={`${Styles.stepTitle}`} style={{ color: "#042b62" }}>Account Details</div>
                                <div className={`${Styles.stepsubTitle}`}>Your demat related info</div>
                              </div>
                            ) : null
                          }
                          {
                            count === 3 ? (
                              <div className={count === 3 ? "d-block" : "d-none"}>
                                <div className={`${Styles.stepTitle}`} style={{ color: "#042b62" }}>Completed</div>
                                <div className={`${Styles.stepsubTitle}`}>Provide your account details</div>
                              </div>
                            ) : null
                          }
                        </div>
                      </div>
                      <div className="d-md-block d-none">
                        <div className={`p-2 ${Styles.Modalbottombody}`}>
                          <div
                            style={{
                              justifyContent: "flex-start",
                            }}
                            className={`${Styles.thirdPartyView}`}
                          >
                            <div className="d-flex align-items-center">
                              <div className={`${Styles.poweredBy}`}>Powered by</div>{" "}
                              <img
                                className="ms-2"
                                width={60}
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/DG/Finvu.png"
                                }
                                alt="Close"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`${Styles.RightSection}`}>
                      {count === 0 && (
                        <BasicDetails
                          onClose={() => {
                            setCurrentPopup(null);
                            setActive(null)
                            if (props.forpar == true) {
                              props.Closemodal();
                            }
                          }}
                          onProceedClick={handleProceedClick} setDummy={setDummy} />
                      )}
                      {count === 1 && (
                        <Otpverification
                          onClose={() => {
                            setCurrentPopup(null);
                            setActive(null)
                            if (props.forpar == true) {
                              props.Closemodal();
                            }
                          }}
                          onHandlebackClick={() => {
                            setCount(0);
                          }}
                          onProceedClick={(response) => {
                            handleProceedClick();
                            setCdslNsdlResponse({ ...response });
                          }}
                          dummy={dummy}
                          setDiscoveredAccountsData={setDiscoveredAccountsData}
                        />
                      )}
                      {count === 2 && (
                        <AccoutDetails
                          onClose={() => {
                            setCurrentPopup(null);
                            setActive(null);
                            if (props.forpar == true) {
                              props.Closemodal();
                            }
                          }}
                          onBackProceedClick={handleBackProceedClick}
                          onProceedClick={handleProceedClick} dummy={dummy}
                          cdslNsdlResponse={cdslNsdlResponse}
                          discoveredAccountsData={discoveredAccountsData}
                        />
                      )}
                      {count === 3 && (
                        <Completed
                          fromStockCard={fromStockCard} 
                          onLinkedSuccess={props.onLinkedSuccess}
                          onClose={() => {
                            setCurrentPopup(null);
                            
                            setActive(null)
                            if (props.forpar == true) {
                              props.Closemodal();
                            }
                          }}
                        />
                      )}
                    </div>
                    <div style={{ borderTop: "1px solid #e6e6e6", margin: "0 1.2rem" }} className={`p-3 mt-2 d-md-none d-block ${Styles.Modalbottombody}`}>
                      <div
                        style={{
                          justifyContent: "flex-end",
                        }}
                        className={`${Styles.thirdPartyView}`}
                      >
                        <div className="d-flex align-items-center">
                          <div className={`${Styles.poweredBy}`}>Powered by</div>{" "}
                          <img
                            className="ms-2"
                            width={60}
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DG/Finvu.png"
                            }
                            alt="Close"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="" style={{ padding: "0 !important" }}>
                <div className="">
                  <div style={{
                    backgroundColor: '#042b62'
                    // background: props.forpar == true ? "#042b62" : "#042b62",
                    // border: props.forpar == true ? "0px solid #042b62" : "0px solid #F1F1F2"
                  }} className="RefreshModalpopup_Heading col-12 d-flex ">
                    <div className={`${Styles.modal_Heading}`}>
                      {
                        props.forpar == true ? "Stocks" : " Know More"
                      }
                    </div>
                    <div className={`${Styles.CloseBtnpopup}`}>
                      <img
                        onClick={() => {
                          setCurrentPopup(null);
                          setActive(null)
                        }}
                        style={{ cursor: "pointer", right: 0 }}
                        src={process.env.REACT_APP_STATIC_URL + "media/DG/Close.svg"}
                        alt="Close"
                      />
                    </div>
                  </div>
                  <div className={`modalBody ${Styles.modalBody}`}>
                    <NsdlcsdlInnersection hideDematTab={hideDematTab}  onChangepopup={() => { setActive(true) }} onClose={() => {
                      setCurrentPopup(null);
                    }} tab={tab} setTab={setTab} setNextPopup={() => setCurrentPopup(1)} />
                  </div>
                </div>
              </div>
            </>
          )
        }

      </Modal>
    </>
  );
});
export default Nsdlcsdl;
