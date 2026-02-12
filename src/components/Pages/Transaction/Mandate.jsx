import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import BackBtn from "../../Assets/left-arrow.png";
import Link from "../../MainComponents/Link";
import Form from "react-bootstrap/Form";
import NEFTBox from "./NEFTBox";
import CartAmt from "./CartAmt";
import MainLayout from "../../Layout/MainLayout";
import MandateBox from "./MandateBox";
// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Success from "../../Assets/payment_success.png";
import Fail from "../../Assets/failed_Payment.svg";
import {
  DATA_BELONGS_TO,
  DMF_BASE_URL,
  DMF_GETBANKDETAILS_API_URL,
} from "../../../constants";
import commonEncode from "../../../commonEncode";
import axios from "axios";
import FintooLoader from "../../FintooLoader";
import { useNavigate } from "react-router-dom";

import {
  apiCall,
  getItemLocal,
  getUserId,
  errorAlert,
  loginRedirectGuest,
} from "../../../common_utilities";

import { useDispatch } from "react-redux";
import {
  PlaceOrder,
  SuccessOrder,
} from "../../../FrappeIntegration-Services/services/investment-api/investmentService";

export default function NeftRtgs() {
  const userid = getUserId();
  const mandateType = getItemLocal("mandateType");
  const bankid = getItemLocal("selbankid");
  const [bankDetail, setBankDetail] = useState([]);
  const [mandateNewArray, setMandateNewArray] = useState([]);
  const [mandateId, setMandateId] = useState("");
  const [loader, setloader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      loginRedirectGuest();
    }
  }, []);

  React.useEffect(function () {
    onLoadInIt();
  }, []);

  const onLoadInIt = async () => {
    try {
      var userID = { user_id: userid, bank_id: bankid };
      var user_id = commonEncode.encrypt(JSON.stringify(userID));
      var config = {
        method: "post",
        //  url: DMF_GETBANKDETAILS_API_URL,
        url: "",
        data: user_id,
      };
      var res = await axios(config);

      var response = commonEncode.decrypt(res.data);
      setBankDetail(JSON.parse(response)["data"]);
      var bankIdStr = JSON.parse(response)["data"];
      for (const v of bankIdStr) {
        try {
          var apiResponse = (
            await axios({
              method: "post",

              url: DMF_BASE_URL + "api/bank/getmandatelist",
              data: commonEncode.encrypt(
                JSON.stringify({ bank_id: "" + v.bank_id })
              ),
            })
          )["data"];
          v.apiResponse = JSON.parse(commonEncode.decrypt(apiResponse))[
            "data"
          ].map((v) => {
            return {
              mandate_id: v.mandate_id,
              mandate_amount: v.mandate_amount,
              mandate_status: v.mandate_status,
            };
          });

          if (v.apiResponse.length == 0) {
            v.apiResponse = [{ mandate_id: "", mandate_amount: "" }];
          }
        } catch (e) {}
      }
      setMandateNewArray([...bankIdStr]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    if (!mandateId) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Please choose a mandate to proceed!",
          type: "error",
        },
      });
      return;
    }

    let data = {
      user_id: userid,
      bank_id: bankid,
      mandate_type: mandateType,
      payment_mode: "mandate",
      mandate_id: mandateId,
      data_belongs_to: DATA_BELONGS_TO,
    };
    setloader(true);
    var res = await PlaceOrder(data);

    if (res.status_code == 200) {
      var res = await SuccessOrder({
        user_id: userid,
        bank_id: bankid,
        transaction_data: res.data.transaction_data,
        data_belongs_to: DATA_BELONGS_TO,
      });
      if (res.status_code == 200) {
        setloader(false);
        dispatch({ type: "UPDATE_CART_COUNT", payload: 0 });
        // Clear guest cart count on successful payment
        localStorage.removeItem("guestCartCount");
        navigate(`${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentSucess`);
      }
    } else {
      errorAlert(res.message);
    }
  };

  return (
    <MainLayout>
      <div className="Transaction">
        <FintooLoader isLoading={loader} />
        <Container>
          <span></span>
          <div className="row">
            <div className="MainPanel">
              <div className="col-2">
                <p>
                  <span className="Rupeees">
                    <Link to="/direct-mutual-fund/MyCartPaymentMode">
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
              <div className="text-label col-lg-11 col-10">
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
                          <div className="text-label">
                            <div>
                              <h4>Choose Mandate</h4>
                            </div>
                          </div>
                          <Form>
                            {mandateNewArray.map((x) => {
                              return x.apiResponse.map((v) => {
                                return (
                                  <MandateBox
                                    value={mandateId}
                                    item={{ mandate: v, bank: x }}
                                    key={v.mandate_id}
                                    onCheck={() => {
                                      setMandateId(v.mandate_id);
                                    }}
                                  />
                                );
                              });
                            })}
                          </Form>
                        </div>
                        <div className="col-5 col-lg-4 DesktopView">
                          <CartAmt />
                        </div>

                        <div>
                          <button
                            className="continue-btn"
                            onClick={handleSubmit}
                            disabled={mandateId == "" ? true : false}
                          >
                            Continue
                          </button>
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
    </MainLayout>
  );
}
