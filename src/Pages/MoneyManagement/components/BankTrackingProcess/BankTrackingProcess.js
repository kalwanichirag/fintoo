import React, { useState, useEffect } from "react";
import style from "../../style.module.css";
import Trackbankstepper from "./Trackbankstepper"
import Styles from "../../moneymanagement.module.css";
import SelectBanks from "../../TrackBankAccount/SelectBanks";
// import BankDataFetch from "../../TrackBankAccount/BankDataFetch";
import ApplyWhiteBg from "../../../../components/ApplyWhiteBg";
import VerifyMobilenumber from "../../TrackBankAccount/VerifyMobilenumber";
import MobileBanktrackingStepper from "./MobileBanktrackingStepper";
import socket, { onMessageHandler } from "../../TrackBankAccount/socket";
import * as toastr from "toastr";
import { useData } from "../../context/DataContext";
import BankDataFetch from "../../TrackBankAccount/BankDataFetch";
import { getMemberId, getUserId } from "../../../../common_utilities";
import commonEncode from "../../../../commonEncode";
import { useNavigate } from "react-router-dom";

const BankTrackingProcess = (props) => {
  const { selectedUserData, setBankIdDetails, sidData, setRes, setDataDict, bankIdDetails, mob_no, setaccDiscData, accDiscData, handleIdfromConsent, setHandleIdfromConsent, mergeAccDetails } = useData();
  const [count, setCount] = useState(0);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [currentUsername, setCurrentUsername] = useState("");

  const [errorData, setErrorData] = useState({
    message: '',
    variant: '',
  })

  const navigate = useNavigate();

  const handleProceedClick = () => {
    setCount(count + 1);
  };

  const handlebackProceedClick = () => {
    setCount(count - 1);
  };

  const data = {};

  useEffect(() => {
    // Decrypt and parse the stored users data
    try {
      let isFamilySelected = Boolean(localStorage.getItem("family"));
      if (!isFamilySelected) {
        let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
        let currentUser = getMemberId();
        if (!currentUser) {
          currentUser = getUserId();
        }
        setCurrentUsername(users.filter(v => v.id == currentUser)[0]['name']);
        // let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
        // setCurrentUsername(users[0].name);
      } else {
        setCurrentUsername("For Family");
      }
    } catch {
      setCurrentUsername('');
    }
  }, [])

  return (
    <div>
      <ApplyWhiteBg />
      <div>
        <div className={`${Styles.AccountHolderName}`}>
          Track Your Bank Account <span>{currentUsername}</span>
        </div>
        <div className={`modalBody ${Styles.DematmodalBody}`}>
          <div className={`${Styles.LeftSection}`}>
            <div className="d-md-block d-none">
              <div className={`${Styles.topSection}`}>
                <div>
                  {" "}
                  How to Track your <br /> Bank Transactions !
                </div>
              </div>
              <div className={` ${Styles.stepperInfo}`}>
                <Trackbankstepper
                  stepnumber="1"
                  text1={"Select Bank Account"}
                  text2={"Consent to fetch your Data"}
                  isActive={count >= 0}
                />

                <Trackbankstepper
                  stepnumber="2"
                  text1={"OTP Verification"}
                  text2={"You want to track!"}
                  isActive={count >= 1 || (count == 0 && bankIdDetails != null)}
                />

                <Trackbankstepper
                  stepnumber="3"
                  text1={"All Done!"}
                  text2={"Enjoy seamless tracking"}
                  isActive={count >= 2}
                  currentPopup={currentPopup}
                />
              </div>
            </div>
            <div>
              <div className={`d-flex d-md-none ${Styles.mobileStepper}`}>
                <MobileBanktrackingStepper isActive={count >= 0} stepnumber="1" />
                <MobileBanktrackingStepper isActive={count >= 1} stepnumber="2" />
                <MobileBanktrackingStepper
                  isNumberMatched={props.isNumberMatched} currentPopup={currentPopup} isActive={count >= 2} stepnumber="3" />
              </div>

            </div>
          </div>
          <div className={`${Styles.RightSection}`}>

            {count === 0 && (
              <SelectBanks onNextviewshow={(count) => setCount(count)} onBackstepProceedclick={() => navigate(`${process.env.PUBLIC_URL}/money-management/bank-tracking-overview`)} data={data} errorData={errorData} setErrorData={setErrorData} />
            )}
            {count === 1 && (
              <>
                <>
                  <VerifyMobilenumber
                    onNextviewshow={() => setCount(0)}
                    onBackstepProceedclick={() => { setCount(0); setBankIdDetails(null) }}
                  />
                </>
              </>
            )}
            {count === 2 && (
              <BankDataFetch handleFailure={() => { setCount(0); setBankIdDetails(null) }} setErrorData={setErrorData} />
            )}
          </div>
        </div>
        <div className={`p-3 mt-2  d-block ${style.Modalbottombody}`}>
          <div

            className={`justiy-content-md-end ${Styles.thirdPartyView}`}
          >
            <div className="d-flex align-items-center">
              <div className={`${Styles.poweredBy}`}>Powered by</div>{" "}
              <img
                className="ms-2"
                width={60}
                src={process.env.REACT_APP_STATIC_URL + "media/DG/Finvu.png"}
                alt="Close"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankTrackingProcess;
