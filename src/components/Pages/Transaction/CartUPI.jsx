import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import BackBtn from "../../Assets/left-arrow.png";
import Link from "../../MainComponents/Link";
import Form from "react-bootstrap/Form";
import UPIBOX from "./UPIBOX";
import CartAmt from "./CartAmt";
import MainLayout from "../../Layout/MainLayout";
import {  DATA_BELONGS_TO
} from "../../../constants";
import {
  getItemLocal,
  getUserId,
  isFamilySelected,
} from "../../../common_utilities";
import { getUserBankDetails } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";

const AddFund = () => {};
const CloseFund = () => {};

const userid = getUserId();

export default function CartUPI() {

  const bankid = getItemLocal("selbankid");
  const [typeName, setTypeName] = useState(0);
  const [bankDetail, setBankDetail] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [cartData, setCartData] = useState(getItemLocal("cart_data"));
  const [cartAmt, setCartAmt] = useState(getItemLocal("cart_amt"));
  const [upiId, setUpiId] = useState("");
  const [saveUpiId, setSaveUpiId] = useState(false);
  const changeTypeName = (num) => {
    // setTypeName(num);
    setSelectedBankId(num);
  };

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  React.useEffect(function () {
    onLoadInIt();
  }, []);

  const onLoadInIt = async () => {
    try {
      if(isFamilySelected()) {
        setTimeout(()=> {
          navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/mycart");
        }, 300);
        return;
      }

      var payload = {
        user_id: userid,
        bank_id: bankid
      }
      var res = await getUserBankDetails(payload);

      setBankDetail(res.data);
      changeTypeName(res?.data[0]?.bank_id);

      setSaveUpiId(true);
      setUpiId(res?.data[0]?.bank_upi_id);
      
    } catch (e) {
      
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
                      <img className="BackBtn"   src={process.env.REACT_APP_STATIC_URL + "media/DMF/left-arrow.svg"} alt="BackBtn" />
                    </Link>
                  </span>
                </p>
              </div>
              <div className="text-label align-items-center text-center  w-75 ">
                <h4 style={{ textAlign: "center", fontWeight: "600" }}>
                  Select Bank
                </h4>
                <p className="PaymentText" style={{ textAlign: "center" }}>
                  Choose how you'd like to pay for your purchase
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="CartSelectSIP SelectBank f-Amt text-label">
              <div className="PaymentLayout">
                <Container>
                  <div className="payment-box">
                    <Row>
                      <div className="col-12 col-md-12 col-lg-7  ">
                        {/* <p className="col-12 col-md-12 col-lg-12 text-center ">
                          
                        </p> */}
                        <Form
                          style={{
                            maxHeight: "460px",
                            overflowY: "Scroll",
                            padding: "20px",
                            border: "1px solid #d6d6d6",
                            borderRadius: "10px",
                            scrollWidth: "thin",
                          }}
                        >
                          {bankDetail?.map((v) => (
                            <UPIBOX
                              selectedType={v}
                              thisTypeName={selectedBankId}
                              upi_id={upiId}
                              save_upi_id={saveUpiId}
                            />
                          ))}
                          {/* <UPIBOX
                            selectedType={typeName}
                            thisTypeName={2}
                            onClick={() => changeTypeName(2)}
                          />
                          <UPIBOX
                            selectedType={typeName}
                            thisTypeName={3}
                            onClick={() => changeTypeName(3)}
                          />
                          <UPIBOX
                            selectedType={typeName}
                            thisTypeName={4}
                            onClick={() => changeTypeName(4)}
                          /> */}
                        </Form>
                      </div>
                      <div className="col-5 col-lg-4 DesktopView">
                        <CartAmt cartAmt={cartAmt} key={cartAmt} />
                      </div>
                    </Row>
                  </div>
                </Container>
                <br />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
