import { React, useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import BackBtn from "../../Assets/left-arrow.png";
import Link from "../../MainComponents/Link";
import MainLayout from "../../Layout/MainLayout";
import CartAmt from "./CartAmt";
import PaymentApprove from "../ErrosPages/PaymentApprove";
import { useNavigate } from "react-router-dom";

import {
  apiCall,
  getItemLocal,
  getUserId,
  errorAlert,
  loginRedirectGuest,
} from "../../../common_utilities";
import FintooInlineLoader from "../../FintooInlineLoader";
import { useDispatch } from "react-redux";
import FintooLoader from "../../FintooLoader";
import { createGlobalStyle } from "styled-components";
import { PlaceOrder, SuccessOrder } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { DATA_BELONGS_TO } from "../../../constants";
import { getUserBankDetails } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";

const NeftRtgsDetails = () => {
  const userid = getUserId();
  const bankid = getItemLocal("selbankid");
  const mandateType = getItemLocal("mandateType");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [bankname, setbankname] = useState();

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      loginRedirectGuest();
    }
    bankname1();
  }, []);

  const handleSubmit = async () => {
    let data = {
      user_id: userid,
      bank_id: bankid,
      mandate_type: mandateType,
      payment_mode: "neft",
      data_belongs_to: DATA_BELONGS_TO,
      purchase_type: "lumpsum",
      payment_type:"direct",
      device_track: "Web"
    };

    setIsLoading(true);
    var place_order_response = await PlaceOrder(data);
    if (place_order_response.status_code == 200) {
      var bse_response = place_order_response.data.bse_response;
      var res = await SuccessOrder({
        user_id: userid,
        bank_id: bankid,
        transaction_data: place_order_response.data.transaction_data,
        data_belongs_to: DATA_BELONGS_TO,
        payment_status: "Pending",
        device_track: "Web"
      });

      if (res.status_code == 200) {
        setIsLoading(false);
        dispatch({ type: "UPDATE_CART_COUNT", payload: 0 });
        // Clear guest cart count on successful payment
        localStorage.removeItem("guestCartCount");
        navigate(
          `${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentSucess?a=NEFT`
        );
      }
    } else {
      setIsLoading(false);
      errorAlert(place_order_response.message);
    }
  };

  const bankname1 = async () => {
    var payload = {
      user_id: userid,
      bank_id: bankid,
    };
    var res = await getUserBankDetails(payload);
    setbankname(res.data[0].bank_name);
  };

  return (
    <MainLayout>
      <FintooLoader isLoading={isLoading} />
      <div className="Transaction">
        <Container>
          <span></span>
          <Row>
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
              {/* <div className="text-label align-items-center text-center  w-75 ">
              <h4 style={{ textAlign: "center" }}>Select Bank</h4>
                <p className="PaymentText" style={{ textAlign: "center" }}>
                  Choose how you'd like to pay for your purchase
                </p>
              </div> */}
            </div>

            <Col>
              <div className="CartSelectSIP SelectBank f-Amt">
                <div className="PaymentLayout">
                  <Container>
                    <div className="payment-box">
                      <Row>
                        <div className="col-12 col-md-12 col-lg-7  text-label">
                          <h4>Payment instructions for NEFT/RTGS</h4>
                          <hr />
                          <p className="neftdetailsinfo">
                            Please note that fund transfers from an HDFC Bank
                            Account to ICCL will be restricted to the eCMS
                            module provided by the Bank on its Internet Banking
                            facility using . The Client needs to create ICCL as
                            a Beneficiary under the eCMS module using TAB named
                            “ add Merchant ( eCMS) Payee “ (and not under
                            “Transfer within Bank” module), which is a onetime
                            activity.
                          </p>
                          <p className="neftdetailsinfo">
                            1. Individual / Savings Account - Fund Transfer -
                            Transfer to eCMS Account - Third Party Transfer -
                            Add a Beneficiary
                          </p>
                          <p className="neftdetailsinfo">
                            2. Non-Individual / Current Account - Funds Transfer
                            - Request - Add a Beneficiary - Transfer to eCMS
                            Account
                          </p>
                          <p className="neftdetailsinfo">
                            In order to proceed with NEFT/RTGS payment, please
                            add the following account as beneficiary in{" "}
                            <span className="bank-nm">{bankname}.</span>
                          </p>
                          <p className="neft-title">
                            Beneficiary Details To Be Added
                          </p>
                          <div className="benificiary-details ">
                            <table className="benificiary-data">
                              <tr>
                                <td className="benificiary-title">
                                  Beneficiary Name :{" "}
                                </td>
                                <td className="benificiary-data-text">
                                  Indian Clearing Corporation Ltd -MFD A/c
                                </td>
                              </tr>
                              <tr>
                                <td className="benificiary-title">
                                  Beneficiary A/C No. :
                                </td>
                                <td className="benificiary-data-text">
                                  MFDICC
                                </td>
                              </tr>
                              <tr>
                                <td className="benificiary-title">
                                  IFSC Code :
                                </td>
                                <td className="benificiary-data-text">
                                  HDFC0000240
                                </td>
                              </tr>
                              <tr>
                                <td className="benificiary-title">
                                  Bank Name :{" "}
                                </td>
                                <td className="benificiary-data-text">
                                  HDFC Bank
                                </td>
                              </tr>
                              {/* <tr>
                                <td className="benificiary-title">
                                  Branch Details :
                                </td>
                                <td className="benificiary-data-text">
                                  CMS Branch, LOWER PAREL, MUMBAI
                                </td>
                              </tr> */}
                            </table>
                            {/* </div> */}
                          </div>
                        </div>
                        <div className="col-5 col-lg-4 DesktopView">
                          <CartAmt />
                        </div>

                        <div>
                          <button
                            className="continue-btn"
                            onClick={handleSubmit}
                          >
                            Continue
                          </button>
                        </div>
                        <div className="payment-instruction col-lg-8  col-12 mt-4">
                          <ol>
                            <li>
                              Only NEFT/RTGS mode is supported. Do not transfer
                              using IMPS or UPI mode.
                            </li>
                            <li>
                              When paying thorugh NEFT do note that the amount
                              will be deducted based on the order on that they
                              are placed. So if you execute an lumpsum order of
                              30K and an SIP order of 30K and transfer 30K by
                              NEFT the order which was placed first, lumpum in
                              this scenario, will be executed and the SIP order
                              will get rejected.
                            </li>
                          </ol>
                        </div>
                      </Row>
                    </div>
                  </Container>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </MainLayout>
  );
};

export default NeftRtgsDetails;
