import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import {
  apiCall,
  errorAlert,
  fetchData,
  fetchEncryptData,
  getUserId,
  isUnderMaintenance,
} from "../../../common_utilities";
import ApplyWhiteBg from "../../ApplyWhiteBg";
import transactioncss from "./transaction.module.css";
import Selectmandatelimit from "./Selectmandatelimit";
import InvestSelectBank from "./InvestSelectBank";
import TwoFactorOtpModal from "./TwoFactorOTP";
import { Modal } from "react-bootstrap";
import Twofactorotpverification from "./Twofactorotpverification";
import InvestSelectMandate from "./InvestSelectMandate";
import moment from "moment/moment";
import { useDispatch } from "react-redux";
import FintooInlineLoader from "../../FintooInlineLoader";
import FintooLoader from "../../FintooLoader";
import { getUserBankDetails } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { PlaceOrder, SuccessOrder } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { DATA_BELONGS_TO } from "../../../constants";
export default function MyCartSelectBank() {
  const [bankList, getBankList] = useState([]);
  const [error, setError] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedMandate, setSelectedMandate] = useState(null);
  const [openModalByName, setOpenModalByName] = useState("");
  const params = new URLSearchParams(window.location.search);
  const bankId = params.get("bank_id") ?? null;
  const [step, setStep] = useState(0);
  const [mandateList, setMandateList] = useState([]);
  const [selectmandateid, setSelectMandateId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(function () {
    getBankListFromApi();
  }, []);
  useEffect(
    function () {
      getMandateListFromApi();
    },
    [bankId, bankList]
  );

  const getMandateListFromApi = async () => {
    if (bankId) {
      let r = await fetchEncryptData({
        method: "post",
        // url: DMF_MANDATELIST_API_URL,
        url: '',
        data: { bank_id: "" + bankId, data_belongs_to: DATA_BELONGS_TO },
      });
      setStep(1);

      var mandate = r.data;
      const mandateStatusArray = ['Pending', 'Rejected', 'Approved'];
      mandate.forEach(async (item) => {
        // let today_date = moment();
        // let mandate_added = moment(item.mandate_added);
        // let diff = today_date.diff(mandate_added, "days");
        // if (diff > 1 && item.mandate_status == 0) {
        //   item.mandate_status = "1";
        // }
        item.mandate_status_text = mandateStatusArray[Number(item.mandate_status)];
      });
      function sortByDayAddedDescending(a, b) {
        return a.mandate_status_text.localeCompare(b.mandate_status_text);
      }
      mandate.sort(sortByDayAddedDescending);
      setMandateList(mandate);
      // loop through and set bank details
      setSelectedBank(bankList.filter((v) => v.bank_id == bankId)[0] ?? {});
    } else {
      setMandateList([]);
      setStep(0);
    }
  };

  const getBankListFromApi = async () => {

    const Payload = {
      user_id: getUserId(),
      data_belongs_to: DATA_BELONGS_TO
    }
    // setIsLoading(true);

    let respData = await getUserBankDetails(Payload);


    if (respData["status_code"] == 100) {
      let data = respData["data"];
      getBankList(data);
    } else if (respData["error_code"] == 404) {
      if (respData["message"] != "") {
        errorAlert(respData["message"]);
      } else {
        errorAlert();
      }
      return;
    }
  };
  const handleBankSelect = (v) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    navigate("?bank_id=" + v.name);
    navigate("?bank_id=" + v.name);
  };
  const handleMandateSelect = (v) => {
    setSelectedMandate(v);
  };
  const Selectmandatelimit = (bank_id) => {
    var bank_enc_id = btoa(bank_id);
    navigate(
      process.env.PUBLIC_URL +
      "/direct-mutual-fund/mycart-mandate-limit?bank_id=" +
      bank_enc_id
    );
  };

  const mandateplaceorder = async () => {
    const userid = getUserId();
    if (selectedMandate.mandate_id != "") {
      if (selectedMandate.mandate_status == "0") {
        var data = {
          user_id: userid,
          bank_id: bankId,
          mandate_id: selectedMandate.mandate_id,
          mandate_type: "N",
          payment_mode: "mandate",
          payment_type: "mandate",
          data_belongs_to: DATA_BELONGS_TO,
        };
      }
      if (selectedMandate.mandate_status == "2") {
        var data = {
          user_id: userid,
          bank_id: bankId,
          mandate_id: selectedMandate.mandate_id,
          mandate_type: "N",
          payment_mode: "mandate",
          data_belongs_to: DATA_BELONGS_TO,
        };
      }
      var res = await PlaceOrder(data);

      if (res.status_code == 200) {
        if (selectedMandate.mandate_status == "2") {
          var res = await SuccessOrder({
            user_id: userid,
            bank_id: bankId,
            transaction_data: res.data.transaction_data,
            data_belongs_to: DATA_BELONGS_TO,
          });

          setIsLoading(false);
          if (res.status_code == 200) {
            dispatch({ type: "FORCE_UPDATE_CART_COUNT", payload: true });
            navigate(`${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentSucess`);
          } else {
            errorAlert(res.message);
          }
        } else if (selectedMandate.mandate_status == "0") {
          setIsLoading(false);
          dispatch({ type: "FORCE_UPDATE_CART_COUNT", payload: true });
          navigate(`${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentSucess`);
        } else {
          setIsLoading(false);
          navigate(
            process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentFailed?a=Mandate"
          );
        }
      } else {
        setIsLoading(false);
        navigate(
          process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentFailed?a=Mandate"
        );
      }

    } else {
      setIsLoading(false);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Mandate Id not found  !", type: "error" },
      });
    }
  };

  const handleBack = () => {
    setOpenModalByName("");
    // navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/MyCartSelectBank");
  };

  return (
    <MainLayout>
      <FintooLoader isLoading={isLoading} />
      <ApplyWhiteBg />
      <div className="Transaction">
        {step == 0 && (
          <Container>
            <span></span>
            <div>
              <div className="col-12 col-lg-12 mt-4">
                <div className="MainPanel d-md-flex">
                  <div className="">
                    <div>
                      <span className="Rupeees">
                        <Link
                          to={`${process.env.PUBLIC_URL}/direct-mutual-fund/MyCart`}
                        >
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
                        </Link>
                      </span>
                    </div>
                  </div>
                  <div
                    className={`d-md-block d-flex justify-content-between  align-items-md-center text-md-center ${transactioncss.bankHeader}`}
                  >
                    {isUnderMaintenance() == false && (
                      <h4 className="trans-head mt-md-0 mt-2 text-md-center">
                        {/* Select Bank Account */}
                        Select Bank For Your SIPss
                      </h4>
                    )}

                    <div
                      className={`text-right d-md-none d-block ${transactioncss.continueBtn}`}
                    >
                      <Link
                        to={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/dashboard/bankaccount?add=1&goto=cart`}
                      >
                        <button className="m-0 ">+ Add New Bank</button>
                      </Link>
                    </div>
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
                      <div className="SelectedBank  ">
                        <div
                          className={`text-right d-md-block d-none ${transactioncss.continueBtn}`}
                        >
                          <Link
                            to={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/dashboard/bankaccount?add=1&goto=cart`}
                          >
                            <button className="m-0 ">+ Add New Bank</button>
                          </Link>
                        </div>
                        {bankList.map((item) => (
                          <InvestSelectBank
                            data={item}
                            key={item.bank_id}
                            onSelect={handleBankSelect}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Container>
        )}
        {step == 1 && (
          <Container>
            <span></span>
            <div>
              <div className="col-12 col-lg-12 mt-4">
                <div className="MainPanel d-md-flex">
                  <div className="">
                    <div>
                      <span className="Rupeees">
                        <Link to={`./`}>
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
                        </Link>
                      </span>
                    </div>
                  </div>
                  <div
                    className={`d-md-block d-flex justify-content-between  ms-md-4 align-items-md-center text-md-center ${transactioncss.bankHeader}`}
                  >
                    {isUnderMaintenance() == false && (
                      <h4 className="trans-head mt-md-0 mt-2 text-md-center">
                        {/* Select Bank Account */}
                        Select Mandate For Your SIP
                      </h4>
                    )}

                    <div
                      className={`text-right d-md-none d-block ${transactioncss.continueBtn}`}
                    >
                      <div
                        onClick={() => {
                          navigate(
                            process.env.PUBLIC_URL +
                            "/direct-mutual-fund/mycart-mandate-limit?placeorder=1&bank_id=" +
                            btoa(bankId)
                          );
                        }}
                      >
                        <button className="m-0 ">+ Add new mandate</button>
                      </div>
                    </div>
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
                      <div className="SelectedBank  ">
                        <div
                          className={`text-right d-md-block d-none ${transactioncss.continueBtn}`}
                        >
                          <button
                            onClick={() => {
                              navigate(
                                process.env.PUBLIC_URL +
                                "/direct-mutual-fund/mycart-mandate-limit?placeorder=1&bank_id=" +
                                btoa(bankId)
                              );
                            }}
                            style={{
                              background: "transparent",
                              border: "1px solid #042b62",
                              color: "#042b62",
                            }}
                            className="m-0 ms-3"
                          >
                            + Add Mandate
                          </button>
                        </div>

                        {mandateList.length == 0 && <div className="mt-2 mb-2 text-center">
                          <span className={`${transactioncss.noteText}`}>
                            Note :{" "}
                          </span>{" "}
                          <span>
                            To start SIP we need to set a mandate first.
                          </span>
                        </div>}
                        {mandateList.map((item) => (
                          <InvestSelectMandate
                            data={item}
                            bankdata={selectedBank}
                            key={item.mandate_id}
                            onSelect={handleMandateSelect}
                            selected={
                              Boolean(selectedMandate?.mandate_id) == true &&
                              selectedMandate?.mandate_id === item?.mandate_id
                            }
                            handleConfirmSIP={() => {
                              setOpenModalByName("twoFA");
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Container>
        )}
      </div>

      {/* Two Factor Aunthentication */}
      <Modal
        backdrop="static"
        show={openModalByName === "twoFA"}
        className="white-modal fn-redeem-modal"
        // centered
        onHide={() => {
          setOpenModalByName("");
        }}
      >
        <Twofactorotpverification
          // <TwoFactorOtpModal
          onBack={() => {
            handleBack();
          }}
          onSubmit={() => {
            setOpenModalByName("");
            // your code
            mandateplaceorder();
          }}
        />
      </Modal>
    </MainLayout>
  );
}
