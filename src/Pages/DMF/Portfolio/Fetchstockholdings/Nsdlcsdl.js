import { useState } from "react";
import Styles from "./style.module.css";
import { Modal } from "react-bootstrap";
import NsdlcsdlInnersection from "./NsdlcsdlInnersection";
import Stepper from "./Stepper";
import BasicDetails from "./BasicDetails";
import Otpverification from "./Otpverification";
import AccoutDetails from "./AccoutDetails";
import Completed from "./Completed";
import MobileStepper from "./MobileStepper";

const Nsdlcsdl = (props) => {
  const [discoveredAccountsData, setDiscoveredAccountsData] = useState([]);
  const [showcsdlnsdlModal, setshowcsdlnsdlModal] = useState(false);
  const [linknow, setLinknow] = useState(false);
  const [count, setCount] = useState(0);
  const [tab, setTab] = useState("Demat");
  const [dummy, setDummy] = useState({
    username: "",
    mobileNum: "",
    handleId: ""
  });

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
    setActive(true);
  };

  const handleProceedClick = () => {
    setCount(count + 1);
  };

  const handleBackProceedClick = () => {
    if (count === 2) {
      setCount(0);
    }
  };
  const handlebackClick = () => {
    setCount(count - 1);
  };
  return (
    <>
      <Modal
        dialogClassName="Nsdlcsdl-modal-width"
        show={props.currentPopup === 0}
        onClose={() => props.setCurrentPopup(null)}
        centered
        animationDuration={0}
      >
        {actve ? (
          <>
            {/* Main Modal Content */}
            <div className="" style={{ padding: "0 !important" }}>
              <div className="">
                <div
                  style={{ backgroundColor: "#042b62" }}
                  className="RefreshModalpopup_Heading col-12 d-flex"
                >
                  <div className={`${Styles.modal_Heading}`}>Link Your Demat</div>
                  <div className={`${Styles.CloseBtnpopup}`}>
                    <img
                      onClick={() => {
                        props.setCurrentPopup(null);
                        setActive(false);
                        setCount(0);
                      }}
                      style={{ cursor: "pointer", right: 0 }}
                      src={
                        process.env.REACT_APP_STATIC_URL + "media/DG/Close.svg"
                      }
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
                        currentPopup={props.currentPopup}
                        cdslNsdlResponse={cdslNsdlResponse}
                      />
                      <Stepper
                        stepnumber="4"
                        text1={"Completed"}
                        text2={"Woah, we are here"}
                        isActive={count >= 3}
                      />
                    </div>

                  </div>

                  <div className={`${Styles.RightSection}`}>
                    {count === 0 && (
                      <BasicDetails
                        onClose={() => {
                          props.setCurrentPopup(null);
                          setActive(null);
                        }}
                        onProceedClick={handleProceedClick}
                        setDummy={setDummy}
                      />
                    )}
                    {count === 1 && (
                      <Otpverification
                        onClose={() => {
                          props.setCurrentPopup(null);
                          setActive(null);
                        }}
                        onHandlebackClick={handlebackClick}
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
                          props.setCurrentPopup(null);
                          setActive(null);
                        }}
                        onBackProceedClick={handleBackProceedClick}
                        onProceedClick={handleProceedClick}
                        dummy={dummy}
                        cdslNsdlResponse={cdslNsdlResponse}
                        discoveredAccountsData={discoveredAccountsData}
                      />
                    )}
                    {count === 3 && (
                      <Completed
                        onClose={() => {
                          props.setCurrentPopup(null);
                          setActive(null);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="" style={{ padding: "0 !important" }}>
              <div className="">
                <div
                  style={{
                    backgroundColor: "#042b62",
                  }}
                  className="RefreshModalpopup_Heading col-12 d-flex "
                >
                  <div className={`${Styles.modal_Heading}`}>
                    {props.forpar === true ? "Stocks" : " Fetch Your Holdings"}
                  </div>
                  <div className={`${Styles.CloseBtnpopup}`}>
                    <img
                      onClick={() => {
                        props.setCurrentPopup(null);
                        setActive(null);
                      }}
                      style={{ cursor: "pointer", right: 0 }}
                      src={
                        process.env.REACT_APP_STATIC_URL + "media/DG/Close.svg"
                      }
                      alt="Close"
                    />
                  </div>
                </div>
                <div className={`modalBody ${Styles.modalBody}`}>
                  <NsdlcsdlInnersection
                    onChangepopup={onChangepopup}
                    onClose={() => {
                      props.setCurrentPopup(null);
                    }}
                    tab={tab}
                    setTab={setTab}
                    setNextPopup={() => props.setCurrentPopup(1)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default Nsdlcsdl;
