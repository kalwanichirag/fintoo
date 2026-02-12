import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import BackBtn from "../../Assets/left-arrow.png";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import commonEncode from "../../../commonEncode";
import {
  apiCall,
  errorAlert,
  fetchData,
  fetchEncryptData,
  getItemLocal,
  getUserId,
  indianRupeeFormat,
  isFamilySelected,
  isUnderMaintenance,
  setItemLocal,
} from "../../../common_utilities";
import ApplyWhiteBg from "../../ApplyWhiteBg";
import transactioncss from "./transaction.module.css";
import Selectmandatelimit from "./Selectmandatelimit";
import { useDispatch } from "react-redux";
import Bankerificationlink from "./Bankverificationlink";
import LoadingModal from "../../EmandateRegister/LoadingModal";
import { Getemandateauthurl, Mandateregister, getUserBankDetails } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { DATA_BELONGS_TO } from "../../../constants";
const AddFund = () => { };
const CloseFund = () => { };

export default function Mandate_limit({ selectedBankId, setSelectedBankId }) {
  const navigate = useNavigate();
  const [bankDetail, setBankDetail] = useState([]);
  const [error, setError] = useState(false);
  const [amount, setAmount] = useState(100000);
  const [mandatelink, setMandateLink] = useState("");
  const [mandateid, setMandateId] = useState("");
  const [mandatebankid, setMandateBankId] = useState("");
  const [step, setStep] = useState(-1);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();
  const params = new URLSearchParams(window.location.search);

  
  setItemLocal('bank_id', mandatebankid);
  setItemLocal('mandateid', mandateid);

  const bankId = params.get("bank_id")??selectedBankId;
  // const bankId = selectedBankId;
  const userid = getUserId();
  const [showModal, setShowModal] = useState(false);
  const [amountErr, setAmountErr] = useState("");

  useEffect(function () {
      if (bankId) {
        setStep(0);
        onLoadInIt();
        setMandateBankId(bankId);
      }
    }, [bankId]);

  const onLoadInIt = async () => {
    try {
      if (isFamilySelected()) {
        setTimeout(() => {
          navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/mycart");
        }, 300);
        return;
      }

      var payload = {
        user_id: userid,
        bank_id: bankId,
        data_belongs_to: DATA_BELONGS_TO
      }

      var res = await getUserBankDetails(payload);

      setBankDetail(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const mandateRegistration = async () => {

    try {
      setStep(1);

      const payload = {
        user_id: getUserId(),
        bank_id: selectedBankId || mandatebankid,
        // mandate_type: "emandate",
        "type": "N",
        mandate_amount: amount + "",
        data_belongs_to: DATA_BELONGS_TO,
      }

      var response = await Mandateregister(payload)
      
      var status = response.status_code;
      var mandate_id = response.data;
     
      setMandateId(mandate_id)

      if (status == 200 && mandate_id != "" && mandate_id != null) {
        mandateResponseFromSource(mandate_id);
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.message, type: "error" },
        });
        setStep(0);
        if(window.location.href.includes("placeorder=1")) {
          navigate(-1); 
        } else {
          navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard/bankaccount"); 
        }
      }
    } catch (e) {
      console.log("E ---> ", e);
      //setError(true);
    }
  };

  const mandateResponseFromSource = async (mandate_id) => {
    try {

      let payload = {
        user_id: getUserId(),
        mandate_id: mandate_id + "",
        data_belongs_to: DATA_BELONGS_TO,
      };

      const res = await Getemandateauthurl(payload);
      var response = res.data;
      setMandateLink(response.ResponseString)
      
      let message = res.message ?? '';
      if (message.toLowerCase() != "success") {
        setTimeout(() => {
          mandateResponseFromSource(mandate_id);
        }, 10000);
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Mandate Request Success  !", type: "success" },
        });
        // setIsSuccess(true);
        setStep(0);
        setShowModal(true);
      }
    } catch (e) { }

  };

  const validateForm = async () => {
    if (amountErr == "" && amount) {
      mandateRegistration();
    } else {
      // validation
    }
  };

  useEffect(() => {
    if (amount === "") {
      setAmountErr("Please enter a value");
    } else if (!isNaN(amount)) {
      if (amount < 100 || amount > 1000000) {
        setAmountErr("Amount should be between 100 and 10,00,000");
      } else {
        setAmountErr("");
      }
    } else {
      setAmountErr("Invalid amount");
    }
  }, [amount]);


  return (
    <>
      <MainLayout>
        <ApplyWhiteBg />
        {step == -1 && <div className="Transaction">
          <Container>
            <span></span>
            <div>

              <div
                className="col-lg-12 col-12"
                style={{
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div className="CartSelectBank mt-4 col-lg-8 col-12">
                  <div>Something went wrongsss.!!!</div>
                </div>
              </div>
            </div>
          </Container>
        </div>}
        {step == 0 && <div className="Transaction">
          <Container>
            <span></span>
            <div>
              <div className="col-12 col-lg-12">
                <div className="MainPanel d-md-flex">
                  <div className="">
                    <div>
                      <span className="Rupeees pointer" onClick={() => {
                        if (window.location.href.includes("placeorder")) {
                          navigate(-1);
                        } else {
                          setSelectedBankId("");
                        }
                      }}>

                        {" "}
                        <img
                          className="BackBtn"
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/left-arrow.svg"
                          }
                          alt="Back"
                          srcset=""
                        />

                      </span>
                    </div>
                  </div>
                  <div
                    className={`align-items-center text-center ${transactioncss.bankHeader}`}
                  >
                    {isUnderMaintenance() == false && (
                      <h4 className="trans-head mt-md-0 mt-3 text-center">
                        {/* Select Bank Account */}
                        Set Mandate limit
                      </h4>
                    )}
                  </div>
                </div>
              </div>
              <div
                className="col-lg-12 col-12"
                style={{
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div className="CartSelectBank mt-4 col-lg-8 col-12">
                  {error && <div>Something went wrong.!!!</div>}
                  {isUnderMaintenance() ? (
                    <>
                      <div className="col-7 m-auto">
                        <br />
                        {isUnderMaintenance(true)["html"]}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`${transactioncss.mandatelimitData}`}>
                        {/* <div>
                          {bankDetail?.map((item) => (
                            <Selectmandatelimit key={'bank-' + item.bank_id} banklist={item} />
                          ))}
                        </div> */}
                        <div className="mt-5">
                          <div className={`${transactioncss.autopayheader}`}>
                            Set Maximum Auto- Pay Limit (Digital Autopay)
                          </div>
                          <div className={`${transactioncss.autopayamountbox}`}>
                            <input
                              type="text"
                              name=""
                              value={amount}
                              maxLength={7}
                              id=""
                              onChange={(e) => {
                                let value = e.target.value.replace(/[^\d]/g, '');
                                setAmount(value);

                              }}
                            // onBlur={(e) => {
                            //   let value = e.target.value.replace(/,/g, '');
                            //   if (!isNaN(value) && value <= 1000000) {
                            //     setAmount(indianRupeeFormat(value, 0));
                            //   }
                            // }}

                            />
                          </div>
                          {amountErr && <p className="error text-center">{amountErr}</p>}
                          <div className={`${transactioncss.setamountbuttons}`}>
                            <button
                              onClick={() => setAmount(10000)}
                              className={
                                amount == 10000 ? "amt-exact" : "amt-add"
                              }
                            >
                              ₹10,000
                            </button>
                            <button
                              onClick={() => setAmount(25000)}
                              className={
                                amount == 25000 ? "amt-exact" : "amt-add"
                              }
                            >
                              ₹25,000
                            </button>
                            <button
                              onClick={() => setAmount(50000)}
                              className={
                                amount == 50000 ? "amt-exact" : "amt-add"
                              }
                            >
                              ₹50,000
                            </button>
                            <button
                              onClick={() => setAmount(100000)}
                              className={
                                amount == 100000 ? "amt-exact" : "amt-add"
                              }
                            >
                              ₹1,00,000
                            </button>
                          </div>
                        </div>
                        <div
                          className={`text-center ${transactioncss.continueBtn}`}
                        >

                          <button onClick={validateForm} disabled={amountErr !== ""}>Next</button>

                        </div>
                        <div className="text-center">
                          <span className={`${transactioncss.noteText}`}>
                            Note :{" "}
                          </span>{" "}
                          <span>
                            We recommend you to set a mandate of at least Rs.
                            1,00,000 to pay for SIP order.
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>}
        {step == 1 && <Bankerificationlink isSuccess={isSuccess} bankDetail={bankDetail} />}
        {showModal && (
          <LoadingModal
            mandatelink={mandatelink}
            bank_id={mandatebankid}
            mandateid={mandateid}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        )}

      </MainLayout>
    </>
  );
}
