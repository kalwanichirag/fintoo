import { React, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import BackBtn from "../../Assets/left-arrow.png";
import Link from "../../MainComponents/Link";
import MainLayout from "../../Layout/MainLayout";
import CartAmt from "./CartAmt";

const NeftRtgsDetails = () => {

  return (
    <MainLayout>
    <div className="Transaction">
      <Container>
        <span></span>
        <Row>
          <Col md="auto">
            <div className="MainPanel">
              <div className="">
                <p>
                  <span className="Rupeees">
                    <Link to="/direct-mutual-fund/Mandate">
                      {" "}
                      <img
                        className="BackBtn"
                        src={process.env.REACT_APP_STATIC_URL + "media/DMF/left-arrow.svg"}
                        alt="NextArrow"
                        srcset=""
                      />
                    </Link>
                  </span>
                </p>
              </div>
            </div>
          </Col>
          <Col>
            <div className="CartSelectSIP SelectBank f-Amt">
              <h4 style={{ textAlign: "center" }}>Select payment mode</h4>
              <p className="PaymentText" style={{ textAlign: "center" }}>
                Choose how you'd like to pay for your purchase
              </p>
              <div className="PaymentLayout">
                <Container>
                  <div className="payment-box">
                    <Row>
                      <div className="col-12 col-md-12 col-lg-7  ">
                        <h4>Payment instructions for Mandate</h4>
                        <hr />
                        <p>
                        Please  note  that fund transfers from an HDFC Bank Account  to ICCL  will be restricted to the eCMS module provided by the Bank on its Internet Banking facility  using  . The Client needs  to create ICCL as a Beneficiary under the eCMS module  using  TAB named  “ add Merchant  ( eCMS) Payee “ (and not under “Transfer within Bank” module), which is a onetime activity. 
                        </p>
                        <p>
                        1. Individual / Savings Account - Fund Transfer - Transfer to eCMS Account - Third Party Transfer - Add a Beneficiary
                        </p>
                        <p>
                        2. Non-Individual / Current Account - Funds Transfer - Request - Add a Beneficiary - Transfer to eCMS Account
                        </p>
                        <p>
                          In order to proceed with Mandate payment, please add
                          the following account as beneficiary in{" "}
                          <span className="bank-nm">
                            {bankname}
                          </span>
                        </p>
                        <p className="neft-title">Beneficiary Details To Be Added</p>
                        <div className="benificiary-details ">
                          <div className="benificiary-data">
                            <p className="benificiary-title">
                              Beneficiary Name :{" "}
                            </p>
                            <p className="benificiary-data-text">Indian Clearing Corporation Ltd -MFD A/c</p>
                          </div>
                          <div className="benificiary-data">
                            <p className="benificiary-title">
                              Beneficiary A/C No. :
                            </p>
                            <p className="benificiary-data-text">MFDICC</p>
                          </div>
                          <div className="benificiary-data">
                            <p className="benificiary-title">IFSC Code :</p>
                            <p className="benificiary-data-text">HDFC0000240</p>
                          </div>
                          <div className="benificiary-data">
                            <p className="benificiary-title">Bank Name : </p>
                            <p className="benificiary-data-text">HDFC Bank</p>
                          </div>
                          {/* <div className="benificiary-data">
                            <p className="benificiary-title">
                              Branch Details :
                            </p>
                            <p className="benificiary-data-text">
                              CMS Branch, LOWER PAREL, MUMBAI
                            </p>
                          </div> */}
                        </div>
                      </div>
                      <div className="col-5 col-lg-4 DesktopView">
                        <CartAmt />
                      </div>
                     
                      <div>
                        <Link to="/">
                          <button className="continue-btn">Continue</button>
                        </Link>
                      </div>
                      <div className="payment-instruction col-lg-8  col-12 mt-4">
                        <ol>
                          <li>
                            Only Mandate mode is supported. Do not transfer
                            using IMPS or UPI mode.
                          </li>
                          <li>
                            When paying thorugh Mandate do note that the amount
                            will be deducted based on the order on that they are
                            placed. So if you execute an lumpsum order of 30K
                            and an SIP order of 30K and transfer 30K by Mandate the
                            order which was placed first, lumpum in this
                            scenario, will be executed and the SIP order will
                            get rejected.
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
