import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import BackBtn from "../../Assets/left-arrow.png";
import Link from "../../MainComponents/Link";
import Form from "react-bootstrap/Form";
import NEFTBox from "./NEFTBox";
import CartAmt from "./CartAmt";
import MainLayout from "../../Layout/MainLayout";
import commonEncode from '../../../commonEncode';
import { getUserBankDetails } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";

import {
  CheckSession,
  apiCall,
  errorAlert,
  getUserId,
  getItemLocal,
  
} from "../../../common_utilities";

export default function NeftRtgs() {
  const [selectedValue, setSelectedValue] = useState('');
  const [NeftOption, setNeftOption] = useState([]);
  const userid = getUserId();
  const bankid = getItemLocal("selbankid");
  useEffect(() => {
    // //// checksession();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  React.useEffect(function () {
    onLoadInIt();
  }, []);

  const onLoadInIt = async () => {
    
    var payload = {
      user_id: userid,
      bank_id: bankid
    }
    var respData = await getUserBankDetails(payload);
    
    if (respData["status_code"] == 200) {
      // successAlert(respData["message"]);
      let data = respData["data"];
      
      setNeftOption(data);
      setSelectedValue(data[0].bank_id);
    } else {
      if (respData["message"] != "") {
        errorAlert(respData["message"]);
      } else {
        errorAlert();
      }
      return;
    }
  };

  return (
    <MainLayout>
      <div className="Transaction">
        <Container>
          <span></span>
          <div className="row">
            <div className="MainPanel d-flex">
              <div className="">
                <p>
                  <span className="Rupeees">
                    <Link to="/direct-mutual-fund/MyCart/">
                      <img className="BackBtn" src={process.env.REACT_APP_STATIC_URL + "media/DMF/left-arrow.svg"} alt="BackBtn" />
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
                              <h4>NEFT/RTGS</h4>
                            </div>
                            <div className="add-bank-new">
                              <Link to={"/direct-mutual-fund/profile/dashboard/bankaccount"}>
                                <label>+ Add Another Bank</label>
                              </Link>
                            </div>
                          </div>

                          <Form className="mt-4"
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
                              <NEFTBox
                                value={selectedValue}
                                item={v}
                                key={v.bank_id}
                                onCheck={() => {
                                  if (selectedValue == v.bank_id) {
                                    setSelectedValue(v.bank_id);
                                  } else{
                                    setSelectedValue(v.bank_id)
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
                          <Link to={"/direct-mutual-fund/NeftRtgsDetails/"}>
                            <button className="continue-btn">Continue</button>
                          </Link>
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
