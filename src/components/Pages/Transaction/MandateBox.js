import { React, useState,useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import NextArrow from "../../Assets/NextStep.png";
import Link from "../../MainComponents/Link";
import FintooCheckbox from "../../FintooCheckbox/FintooCheckbox";
import { getUserId , maskBankAccNo } from "../../../common_utilities";
import axios from "axios";
const Mandatebox = (props) => {
  const [isOpened, setIsOpened] = useState(false);
  const [checked, setChecked] = useState(false);
  function toggle() {
    setIsOpened((wasOpened) => !wasOpened);
  }
  return (
    <>
      {props.item.mandate.mandate_status == "2" && (
        <div>
        <div
          className="NeftBox DesktopView"
        >
          <div className="paymentgatewayoption mandate">
            <Container>
              <Row className="">
                <Col xs={1} lg={1}>
                  <div className="select-bank">
                    { props.item.mandate.mandate_id ?
                    <FintooCheckbox
                      checked={props.value == props.item.mandate.mandate_id}
                      className=""
                      onChange={()=> props.onCheck()}
                    /> : null}
                  </div>
                </Col>
                <Col xs={6} lg={6} style={{
                  marginLeft : "-1em"
                }}>
                  <div className="AccountDetails d-flex">
                    <div className="BankLogo">
                      
                      <img src={`${process.env.REACT_APP_STATIC_URL}/media/bank_logo/${props.item.bank.bank_bse_code ? props.item.bank.bank_bse_code : 'img_default' }.png`} />
                    </div>
                    <div className="bank-title">
                      <p className="AccountLabel">Bank</p>
                      <p
                        className="AccountNo"
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        {props.item.bank.bank_name}
                      </p>
                    </div>
                  </div>
                </Col>
                </Row>
            </Container>
            <Container>
              <Row className="">
                <Col xs={4} lg={6}>
                  <div className="AccountDetails">
                    <p className="AccountLabel">Account No.</p>
                    <p className="AccountNo"> {maskBankAccNo(props.item.bank.bank_acc_no)}</p>
                  </div>
                </Col>
                <Col xs={12} lg={6}>
                  <div className="AccountDetailbankaccounts AddManadateLabel">
                  {props.item.mandate.mandate_amount * 1 > 0 ? (
                    
                    <p className="AccountLabel">Mandate amount</p>) : (
                      <p className="AccountLabel"></p>
                    )}
                   
                    {props.item.mandate.mandate_amount * 1 > 0 ? (
                    
                    <p className="AccountNo"> {props.item.mandate.mandate_amount}</p>) : (<p
                      style={{
                        color: "#042b62",
                        fontWeight: "500",
                        float: "left",
                      }}
                    >
                      <Link to={`/direct-mutual-fund/profile/dashboard/bankaccount/ProfileMandate?bank_id=${props.item.bank.bank_id}`}> 
                      Add mandate
                      </Link>{" "}
                    </p>)}
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
        {/* // For Mobile View */}
        <div className=" NEFTMobile">
          <div className="paymentgatewayoption mandate">
            <div className="MobileFlexNEFT">
              <div className="select-bank">
                <FintooCheckbox
                  checked={isOpened}
                  className=""
                  onChange={toggle}
                />
              </div>
              <div>
                <h4> {props.item.title}</h4>
              </div>
            </div>
            <div className="d-flex">
              <div className="AccountDetails">
                <p className="AccountLabel">Account No.</p>
                <p className="AccountNo"> {props.item.text}</p>
              </div>
              <div className="AccountDetails AddManadateLabel">
                    <p className="AccountLabel">{props.item.textTitle}</p>
                    <p className="AccountNo"> {props.item.limit}</p>
                    <p
                      style={{
                        color: "#042b62",
                        fontWeight: "500",
                        float: "left",
                      }}
                    >
                      {props.item.Button}
                    </p>
                  </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
  
};


export default Mandatebox;
