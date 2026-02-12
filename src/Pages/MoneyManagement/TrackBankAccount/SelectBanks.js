import React, { useState, useEffect } from 'react';
import Styles from '../moneymanagement.module.css';
import Header from './Header';
import Accountfound from "./Accountfound";
import BankVerification from "./BankVerification";
import { Modal } from 'react-bootstrap';
import style from '../style.module.css'
// import socket, {onMessageHandler} from "./socket";
import { useData } from '../context/DataContext';
import AlertComponent from '../../../components/AlertComponent';
import { FINVU_BASE_API_URL, FINVU_USER_ID, FINVU_PASSWORD, FINVU_TEMPLATE_NAME, FINVU_AAID, CHATBOT_BASE_API_URL, CHATBOT_BASE_API_URL_LOCAL } from '../../../constants';
import { CircularProgressBar } from '../../../components/FintooInlineLoader';
import { getBankList } from '../../../FrappeIntegration-Services/services/money-management-api/moneyManagementService';

const SelectBanks = (props) => {
  const { sidData, setBankIdDetails, setRes, setDataDict, bankIdDetails, mob_no, setJwtToken } = useData();
  const [selectedBank, setSelectedBank] = useState(null)
  const [processcount, setProcessCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bankData, setBankData] = useState(null);
  const [popBank, setopBank] = useState(null);
  const [othBank, setOthBank] = useState(null);
  const PopularBanks = [];
  const OtherBanks = [];
  const [searchQuery, setSearchQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const { v4: uuidv4 } = require("uuid");
  const [success_rate, setSuccessRate] = useState(null);


  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  useEffect(() => {
    if (bankIdDetails != null) {
      setProcessCount(1)
    }

  }, [bankIdDetails])

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setBankIdDetails(selectedBank);
    props.onNextviewshow(1)
  };

  const handleProceedClick = (count) => {
    if (count == 2) {
      handleLastStep(count);
    } else {
      setProcessCount(processcount + 1);
    }
  };

  // const handleProceedClick_1 = (bank) => {
  //   setBankIdDetails(bank);
  //   props.onNextviewshow(1)
  // };

  const handleBankClick = async (data) => {
    // setBankIdDetails(data);
    let success_rate_details = await getSuccessRateOfFipId(data.fipId);
    if (success_rate_details !== null && success_rate_details < 90) {
      openPopup()
      setSelectedBank(data)
      // }
      // if (Boolean(data.hasLowSuccessRate)) {
      //   openPopup()
      //   setSelectedBank(data)
    } else {
      setBankIdDetails(data);
      props.onNextviewshow(1)
    }
  }

  const handleBackProceedClick = () => {
    setProcessCount(processcount - 1);
  };

  const handleNoAccountClick = () => {
    props.onNextviewshow(1)
  }

  const handleLastStep = (count) => {
    const stepCount = count ? count : 1;
    props.onNextviewshow(stepCount);
  }

  const fetchBankListData = async () => {
    try {
      const result = await getBankList();
      if (result.status_code == 200) {
        // if (response.ok) {
        // const result = await response.json();
        const bankData1 = result.data;
        setBankData(result.data.body);

        const mapDataWithImages = (bankData1) => {
          PopularBanks.length = 0;
          OtherBanks.length = 0;
          bankData1.forEach(item => {
            const { fipId, fipName, logo: finvu_bank_logo, isPopular: finvu_bank_popular, lowSuccessRate: finvu_bank_low_success_rate } = item;
            const imagePath = finvu_bank_logo ? "media/bank_logo/" + finvu_bank_logo : "media/bank_logo/Default Logo.png";
        
            const mappedItem = { fipId, fipName, image: imagePath, hasLowSuccessRate: finvu_bank_low_success_rate };
        
            if (finvu_bank_popular === 1) {
              PopularBanks.push(mappedItem);
            } else {
              OtherBanks.push(mappedItem);
            }
          });
        
          return { PopularBanks, OtherBanks };
        };

        mapDataWithImages(bankData1);
        setopBank(PopularBanks);
        setOthBank(OtherBanks);
      }

      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const filterBanks = (banks) => {
    return banks.filter((bank) =>
      bank.fipName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getSuccessRateOfFipId = async (fip_id) => {
    try {
      const rid = uuidv4();
      const ts = new Date().toISOString();

      const loginPayload = {
        header: {
          rid: rid,
          ts: ts,
          channelId: "finsense",
        },
        body: {
          userId: FINVU_USER_ID,
          password: FINVU_PASSWORD,
        },
      };

      const url = FINVU_BASE_API_URL + "/User/Login";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginPayload),
      };

      const loginResponse = await fetch(url, options);
      if (loginResponse.status === 200) {
        const responseData = await loginResponse.json();
        const token = responseData.body.token;
        try {
          const options = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token,
            },
          };

          const latestMatricesAllResponse = await fetch(FINVU_BASE_API_URL + "/fips/latest-metrics-all", options);
          if (latestMatricesAllResponse.status === 200) {
            const latestMatricesAllResponseData = await latestMatricesAllResponse.json();
            const data = latestMatricesAllResponseData.data;
            for (let i = 0; i < data.length; i++) {
              if (data[i][0] === fip_id) {
                if (data[i][1] == "FIP:AA:FIRequestResponse") {
                  setSuccessRate(data[i][3]);
                  return data[i][3];
                }

              }
            }
            setSuccessRate(null);
            return null;
          } else {
            console.error('Error fetching data:', latestMatricesAllResponse.status);
            setSuccessRate(null);
            return null;
          }
        }
        catch (error) {
          console.error("An error occurred:", error.message);
        }
      }
    }
    catch (error) {
      console.error("An error occurred:", error.message);
    }
  };


  useEffect(() => {
    fetchBankListData();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div className={`${Styles.SelectBankslist}  ${Styles.BankScrollbox}`}>
        {processcount === 0 && (
          <div>
            <div className='d-md-flex d-none align-items-md-center'>
              <div>
                <div>
                  <img
                    className="pointer"
                    onClick={() => {
                      props.onBackstepProceedclick();
                    }}
                    src={`${process.env.REACT_APP_STATIC_URL +
                      "media/MoneyManagement/Back.png"
                      }`}
                    alt="Back-button"
                  />
                </div>
              </div>
              <Header title={"Select your bank"} decscription={"Track your balance with 100% accuracy, get insights on your expenses!"} />
            </div>
            <AlertComponent variant={props.errorData.variant} message={props.errorData.message} timeout={10000} closeError={() => props.setErrorData({
              message: '',
              variant: '',
            })} />
            <div className={`${Styles.BankSearchBar}`}>
              <input
                placeholder={!inputFocused ? 'Search for your bank here' : ''}
                type='search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
            <div className='mt-4'>
              {popBank ? (
                <div>
                  {filterBanks(popBank).length > 0 ? (
                    <div>
                      <div className={`${Styles.decscription}`}>
                        Popular Banks
                      </div>
                      <div className={`mt-3 ${Styles.popularBanks}`}>
                        {filterBanks(popBank).map((bank, index) => (
                          <div key={index} className={`${Styles.banklistbox}`} onClick={() => handleBankClick(bank)}>
                            {bank.logo}
                            <div>
                              {/* <img width={60} src={`${process.env.REACT_APP_STATIC_URL + `${bank.image}`}`} alt='bank_logo' /> */}
                              <img src={`${process.env.REACT_APP_STATIC_URL + `${bank.image}`}`} />
                            </div>
                            <div className={`ms-2 ${Styles.BankName}`}>
                              {bank.fipName}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              ) : (
                // Display loading or placeholder while data is being fetched
                <p>Loading...</p>
              )}
            </div>
            <div className='mt-4'>
              {othBank ? (
                <div>
                  {filterBanks(othBank).length > 0 ? (
                    <div>
                      <div className={`${Styles.decscription}`}>
                        Other Banks
                      </div>
                      <div className={`mt-3 ${Styles.otherBanks}`}>
                        {filterBanks(othBank).map((bank, index) => (
                          <div key={index} className={`${Styles.banklistbox}`} onClick={() => handleBankClick(bank)}>
                            <div className='d-flex align-items-center'>
                              <div className={`${Styles.bankLogo}`}>
                                {/* <img src={`${process.env.REACT_APP_STATIC_URL + `${bank.image}`}`} alt='bank_logo' /> */}
                                <img src={`${process.env.REACT_APP_STATIC_URL + `${bank.image}`}`} />
                              </div>
                              <div className={`ms-2 ${Styles.BankName}`}>
                                {bank.fipName}
                              </div>
                            </div>
                            <div className={`${Styles.NextArrow}`}>
                              <img src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/Back.png"}`} alt='Back-button' />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              ) : (
                // Display loading or placeholder while data is being fetched
                <p></p>
              )}
            </div>
          </div>
        )}
        {processcount === 1 && (
          <div>
            <Accountfound onBackProceedClick={() => { handleBackProceedClick(); setBankIdDetails(null) }} onProceedClick={handleProceedClick} onAccountNotFound={() => { handleNoAccountClick() }} />
            {/* <BankVerification  /> */}
          </div>
        )}
        {processcount === 2 && (
          <div>
            <BankVerification isMobileVerify={processcount === 2} onLaststepclick={handleLastStep} onBackProceedClick={handleBackProceedClick} Banklogo={processcount === 2} />
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        className={`${style.moneyManagementModal}`}
        dialogClassName={`${style.moneyManagementModalDialog}`}
        centered
        show={isPopupOpen}
        size="md"
      >
        <div className={`${Styles.moneyManagementBankerror}`}>
          <div className={`text-center ${Styles.titleHead}`}>
            <div
              className="modal-title text-center d-flex align-items-center justify-content-center  w-100"
              style={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              <div>
                <img
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/MoneyManagement/bxs_error.svg"
                  }
                  width={"50px"}
                />
              </div>
              <div className="ms-2">Bank Connectivity Success Rate</div>
            </div>
          </div>
          <br />
          {
            success_rate !== null && <CircularProgressBar percentage={success_rate} />
          }
          <br />
          <h2 className={Styles.heading}>What This Means:</h2>
          <p className={Styles.paragraph}>
            A lower success rate indicates potential connectivity issues with your bank.
            You may experience delays or failures in fetching transactions.
          </p>

          <h2 className={Styles.heading}>Next Steps:</h2>
          <div>
            <div className={Styles.stepItem}>Proceed with caution.</div>
            <div className={Styles.stepItem}>Consider trying again later if you encounter issues.</div>
            <div className={Styles.stepItem}>Contact your bank for further assistance.</div>
          </div>
          <div className={`${Styles.OkButton}`}>
            <button onClick={closePopup}>Proceed</button>
          </div>
        </div>
      </Modal>
    </div>
  )
};

export default SelectBanks;
