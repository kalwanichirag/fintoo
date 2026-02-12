import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import BackBtn from "../../Assets/left-arrow.png";
import Link from "../../MainComponents/Link";
import Form from "react-bootstrap/Form";
import NetBankingBox from "./NetBankingBox";
import CartAmt from "./CartAmt";
import MainLayout from "../../Layout/MainLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { renderToReadableStream } from "react-dom/server";
import {
  apiCall,
  getItemLocal,
  getUserId,
  errorAlert,
  loginRedirectGuest,
  sleep,
  setItemLocal,
} from "../../../common_utilities";
import { useDispatch } from "react-redux";
import ApplyWhiteBg from "../../ApplyWhiteBg";
import FintooLoader from "../../FintooLoader";
import FintooInlineLoader from "../../FintooInlineLoader";
import { getUserBankDetails } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { DATA_BELONGS_TO } from "../../../constants";
import {
  Cancelorder,
  PlaceOrder,
  SuccessOrder,
} from "../../../FrappeIntegration-Services/services/investment-api/investmentService";

export default function NetBanking() {
  const userid = getUserId();
  const bankid = getItemLocal("selbankid");
  const mandateType = getItemLocal("mandateType");
  const [selectedValue, setSelectedValue] = useState("");
  const [NeftOption, setNeftOption] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loader, setloader] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  const dispatch = useDispatch();
  const [counter, setCounter] = useState(0);
  const interval = useRef(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  React.useEffect(function () {
    onLoadInIt();
  }, []);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      loginRedirectGuest();
    }

    if (!searchParams.get("return") && getItemLocal("transaction_data")) {
      localStorage.removeItem("transaction_data");
      localStorage.removeItem("order_id");
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("return")) {
      interval.current = setInterval(() => {
        let order_id = getItemLocal("order_id");
        let transaction_data = getItemLocal("transaction_data");
        checkPayment(order_id, transaction_data);
      }, 5000);
    }
    return () => clearInterval(interval.current);
  }, []);

  // const onLoadInIt = async () => {
  //   let url = DMF_GETBANKDETAILS_API_URL;
  //   let data = {
  //     user_id: userid,
  //     bank_id: bankid,
  //     is_direct: "1",
  //   };
  //   setIsPageLoaded(true);
  //   let respData = await apiCall(url, data);

  //   if (respData["error_code"] == "100") {
  //     let data = respData["data"];
  //     setNeftOption(data);
  //     setSelectedValue(data[0].bank_id);
  //   } else if (respData["error_code"] == "102") {
  //     if (respData["message"] != "") {
  //       errorAlert(respData["message"]);
  //     } else {
  //       errorAlert();
  //     }
  //     return;
  //   }
  // };

  const onLoadInIt = async () => {
    try {
      var payload = {
        user_id: userid,
        bank_id: bankid,
      };
      setIsPageLoaded(true);
      var res = await getUserBankDetails(payload);

      if (res.status_code == 200) {
        setNeftOption(res.data);
        setSelectedValue(res.data[0].bank_id);
      } else {
        if (res["message"] != "") {
          errorAlert(res["message"]);
        } else {
          errorAlert();
        }
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    setloader(true);
    let data = {
      user_id: userid,
      bank_id: bankid,
      mandate_type: mandateType,
      payment_mode: "net-banking",
      loop_back_url: window.location.href + "?return=1",
      data_belongs_to: DATA_BELONGS_TO,
      purchase_type: "lumpsum",
    };
    var res = await PlaceOrder(data);
    setloader(false);
    if (res.status_code == 200) {
      setItemLocal("transaction_data", res.data.transaction_data);
      setItemLocal("order_id", res.data.order_id);
      sleep(2000);
      if (res.data.html) {
        const node = document
          .createRange()
          .createContextualFragment(res.data.html);
        ref.current.appendChild(node);
      }
    } else {
      errorAlert(res.message);
    }
  };

  const checkPayment = async (orderId, transaction_data) => {
    try {
      // setloader(true);
      // var res = await apiCall(DMF_PAYMENTGATEWAYRESPONSE_API_URL, {
      //   user_id: userid,
      //   order_id: orderId,
      //   data_belongs_to: DATA_BELONGS_TO,
      // });

      // let status = "D";
      // let paymentAwaiting = "1";

      // res = {
      //   error_code: "100",
      //   message: "Success",
      //   data: { status: "Success", message: "APPROVED ( DIRECT )" },
      // }; // comment later

      // if (res.error_code == "100") {
      //   if (res.data.message.toUpperCase().includes("APPROVED ( DIRECT )")) {
      //     status = "Y";
      //     paymentAwaiting = "0";
      //   } else if (
      //     res.data.message
      //       .toUpperCase()
      //       .includes("AWAITING FOR FUNDS CONFIRMATION ( NODAL )") ||
      //     res.data.message
      //       .toUpperCase()
      //       .includes("AWAITING FOR RESPONSE FROM BILLDESK ( NODAL )") ||
      //     res.data.message
      //       .toUpperCase()
      //       .includes("AWAITING FOR RESPONSE FROM BILLDESK ( DIRECT )")
      //   ) {
      //     status = "D";
      //     paymentAwaiting = "1";
      //   } else if (
      //     res.data.message
      //       .toUpperCase()
      //       .includes("PAYMENT NOT INITIATED FOR GIVEN ORDER")
      //   ) {
      //     status = "D";
      //   }

      //   if (status == "Y") {
      const data = {
        user_id: userid,
        bank_id: bankid,
        transaction_data: transaction_data,
        payment_mode: "net-banking",
        data_belongs_to: DATA_BELONGS_TO,
      };
      var res = await SuccessOrder(data);
      // var res = await apiCall(DMF_SUCCESSORDER_API_URL, {

      // });

      if (res.status_code == 200) {
        localStorage.removeItem("transaction_data");
        localStorage.removeItem("order_id");
        dispatch({ type: "UPDATE_CART_COUNT", payload: 0 });
        // Clear guest cart count on successful payment
        localStorage.removeItem("guestCartCount");
        navigate(
          `${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentSucess?a=NetBank`
        );
      }

      // setloader(false);
    } catch (e) {
      console.error(e);
      // setloader(false);
    }
  };

  const cancelPayment = async (transaction_data = "") => {
    try {
      setloader(true);
      let data = {
        user_id: userid,
        bank_id: bankid,
        trxn_data: transaction_data,
        data_belongs_to: DATA_BELONGS_TO,
      };
      var res = await Cancelorder(data);
      // var res = await apiCall(DMF_CANCELORDER_API_URL, data);
      setloader(false);
      if (res.status_code == 200) {
        // Calcel Order mail API call
        localStorage.removeItem("transaction_data");
        localStorage.removeItem("order_id");
        navigate(`${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentFailed`);
      }
    } catch (e) {
      console.error(e);
      setloader(false);
    }
  };

  var bank_id = selectedValue;

  return (
    <MainLayout>
      <FintooLoader isLoading={loader} />
      <ApplyWhiteBg />
      {isPageLoaded === false ||
      window.location.search.indexOf("return=1") > -1 ? (
        <div style={{ paddingTop: "15rem", paddingBottom: "15rem" }}>
          <FintooInlineLoader isLoading={true} />
          <p style={{ textAlign: "center", paddingTop: "1rem" }}>
            Waiting for payment status, please wait...
          </p>
        </div>
      ) : (
        <div className="Transaction">
          <Container>
            <div
              id="successHtmlRender"
              ref={ref}
              style={{ display: "none" }}
            ></div>
            <span></span>
            <div className="row">
              <div className="MainPanel d-flex">
                <div className="">
                  <p>
                    <span className="Rupeees">
                      <Link to="/direct-mutual-fund/MyCart/">
                        <img
                          className="BackBtn"
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/left-arrow.svg"
                          }
                          alt="BackBtn"
                        />
                      </Link>
                    </span>
                  </p>
                </div>
                <div className="text-label align-items-center text-center  w-75 ">
                  <h4 style={{ textAlign: "center" }}>Select Bank</h4>
                  <p className="PaymentText" style={{ textAlign: "center" }}>
                    Choose how you'd like to pay for your purchase
                  </p>
                </div>
              </div>
              <div>
                <div className="CartSelectSIP SelectBank f-Amt">
                  <div className="PaymentLayout">
                    <Container>
                      <div className="payment-box">
                        <Row>
                          <div className="col-12 col-md-12 col-lg-7  ">
                            <div className="Neft-rtgs-txt">
                              <div className="text-label">
                                <h4>Net Banking</h4>
                              </div>
                              <div className="add-bank-new">
                                <Link
                                  to={
                                    "/direct-mutual-fund/profile/dashboard/bankaccount"
                                  }
                                >
                                  <label>+ Add Another Bank</label>
                                </Link>
                              </div>
                            </div>

                            <Form
                              className="mt-4"
                              style={{
                                maxHeight: "460px",
                                overflowY: "Scroll",
                                padding: "20px",
                                border: "1px solid #d6d6d6",
                                borderRadius: "10px",
                                scrollWidth: "thin",
                              }}
                            >
                              {NeftOption.map((v) => (
                                <NetBankingBox
                                  value={selectedValue}
                                  item={v}
                                  key={v.bank_id}
                                  onCheck={() => {
                                    if (selectedValue == v.bank_id) {
                                      setSelectedValue(v.bank_id);
                                    } else {
                                      setSelectedValue(v.bank_id);
                                    }
                                  }}
                                />
                              ))}
                            </Form>
                          </div>
                          <div className="col-5 col-lg-4 DesktopView">
                            <CartAmt />
                          </div>

                          <div>
                            {/* <Link to={""}> */}
                            <button
                              className="continue-btn"
                              onClick={handleSubmit}
                            >
                              Continue
                            </button>
                            {/* </Link> */}
                          </div>
                        </Row>
                      </div>
                    </Container>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}
    </MainLayout>
  );
}
