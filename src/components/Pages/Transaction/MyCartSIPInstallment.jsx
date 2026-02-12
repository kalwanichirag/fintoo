import {React, useState} from "react";
import Home from "../../Assets/home.png";
import Arrow from "../../Assets/arrow.png";
import { Container, Row, Col } from "react-bootstrap";
import Rupee from "../../Assets/Rupee.png";
import security from "../../Assets/security.png";
import BackBtn from "../../Assets/left-arrow.png";
import calendar from "../../Assets/calendar.png";
import NextStep from "../../Assets/NextStep.png";
import SIPInstallment from "../../Assets/cart_Blue_SIP_installments_01.png";
import SIPDate from "../../Assets/cart_Blue_SIP_installments_02.png"
import Link from '../../MainComponents/Link';
const AddFund = () => {};
const CloseFund = () => {};
export default function MyCartSIPInstallment() {
 
  return (
    <div className="Transaction">
      <Container>
        <span></span>
        <Row>
          <Col md="auto">
            <div className="MainPanel">
              <div className="">
                <p>
                  <span className="Rupeees">
                  <Link to="/direct-mutual-fund/MyCartAutoPay/:bank_id"><img className="BackBtn" src={process.env.REACT_APP_STATIC_URL + "media/DMF/left-arrow.svg"} alt="BackBtn" srcset="" /></Link>
                  </span>
                
                </p>
              </div>
            </div>
          </Col>
         
        </Row>
      </Container>
      <Container>
        <Row>
        <Col>
            <div className="CartSelectSIP">
              <h4 style={{ textAlign: "center" }}>
                Place your first SIP Installment today ?
              </h4>
              <div className="SelectedBank">
                <div className="SIP_Install">
                  <Container>
                    <Row>
                      <Col className="SIPInstallment" sm={6}>
                        <div >
                          <Link to="/direct-mutual-fund/MyCartPaymentmode">
                            <img className="Active" src={process.env.REACT_APP_STATIC_URL + "media/DMF/cart_Blue_SIP_installments_01.svg"} alt="" srcset="" />
                          </Link>
                        </div>
                        <div className="SIPText">
                          Place your first <br /> SIP installment today ?
                        </div>
                      </Col>
                      <Col className="MobileSpace" sm={6}>
                        <div>
                          <Link to="/direct-mutual-fund/MyCartPaymentmode">
                            <img className="INActive" src={process.env.REACT_APP_STATIC_URL + "media/DMF/cart_Blue_SIP_installments_02.svg"} alt="" srcset="" />
                          </Link>
                        </div>
                        <div className="SIPText">
                          No, Please <br /> Start SIP on scheduled
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
