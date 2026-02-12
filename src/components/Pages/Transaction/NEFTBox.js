import { React, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import NextArrow from "../../Assets/NextStep.png";
import Link from "../../MainComponents/Link";
import HDFC from '../../Assets/hdfc.png'
import FintooCheckbox from "../../FintooCheckbox/FintooCheckbox";
import {
  maskBankAccNo  
} from "../../../common_utilities";
const NEFTBox = (props) => {
  const [isOpened, setIsOpened] = useState(false);
  const [checked, setChecked] = useState(false);
  function toggle() {
    setIsOpened((wasOpened) => !wasOpened);
  }
  return (
    <div>
      <div className="NeftBox">
        <div className="paymentgatewayoption">
          <Container>
            <Row>
              <Col xs={1} lg={1}>
                <div className="select-bank">
                  <FintooCheckbox
                    checked={props.value == props.item.bank_id}
                    className="neftcheckbox"
                    name="NEft"
                    onChange={()=> props.onCheck()}
                  />
                </div>
              </Col>
              <Col xs={11} lg={11} style={{
              lineHeight : '20px'
            }}>
                <div className="AccountDetails d-flex desktopspace">
                  <div className="BankLogo">
                  <img src={`${process.env.REACT_APP_STATIC_URL}/media/bank_logo/${props.item.bank_bse_code ? props.item.bank_bse_code : 'img_default' }.png`}  />
                  </div>
                  <div className="bank-title">
                    <div className="AccountLabel">Bank</div>
                    <div className="AccountNo">{props.item.bank_name}</div>
                  </div>
                </div>
                <div className="AccountDetails" style={{
                  paddingLeft : '2.2rem'
                }}>
                  <div className="AccountLabel">Account No.</div>
                  <div className="AccountNo">{maskBankAccNo(props.item.bank_acc_no)}</div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default NEFTBox;
