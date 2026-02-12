import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import BackBtn from "../../Assets/left-arrow.png";
import NetBanking from "../../Assets/Cart_blue_payment_mode_01.svg";
import UPI from "../../Assets/Cart_blue_payment_mode_02.svg";
import NFET from "../../Assets/Cart_blue_payment_mode_04.svg";
import Mandate from "../../Assets/Cart_blue_payment_mode_03.svg";
import Link from "../../MainComponents/Link";
import MainLayout from "../../Layout/MainLayout";
import CartAmt from "./CartAmt";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import {
  CheckSession,
  apiCall,
  getItemLocal,
  getUserId,
  fetchEncryptData,
  getDownActivityStateFromLS,
  isFamilySelected,
} from "../../../common_utilities";
import TwoFactorOtpModal from "./TwoFactorOTP";
import commonEncode from "../../../commonEncode";
import ApplyWhiteBg from "../../ApplyWhiteBg";
import axios from "axios";
import { getUserBankDetails } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";

export default function MyCartPaymentmode() {
  const userid = getUserId();
  const bankid = getItemLocal("selbankid");
  const cartAmt = getItemLocal("cart_amt");

  const [bankDetail, setBankDetail] = useState([]);
  const [prev, setPrev] = useState("");
  const [dis, setDis] = useState("");
  const [mandateList, setMandatelist] = useState("");
  const [openModalByName, setOpenModalByName] = useState("twoFA");
  const navigate = useNavigate();

  useEffect(() => {
    // //// checksession();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    // onLoad();
  }, []);

  React.useEffect(function () {
    onLoadInIt();
  }, []);

  const onLoadInIt = async () => {
    try {
      if (isFamilySelected()) {
        setTimeout(() => {
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
    } catch (e) {
      console.error(e);
    }
  };

  const condiNavigation = () => {
    let x = localStorage.getItem("cart_data");
    let y = commonEncode.decrypt(x);
    let types = JSON.parse(y).map((v) => v.cart_purchase_type);
    types = [...new Set(types)]; //1 lumpsum 2 sip
    Object.keys(types).forEach(function (key) {
      if (types[key] == 1) {
        setDis("paymentgatewayoption disabled");
      } else {
        setDis("paymentgatewayoption");
      }
    });

    if (types.length > 1) {
      setPrev("/direct-mutual-fund/MyCart");
    } else {
      if (types[0] == 2) {
        setPrev("/direct-mutual-fund/MyCart");
      } else {
        setPrev("/direct-mutual-fund/MyCart");
      }
    }
  };

  const onLoad = async () => {
    try {
      var mandaterequest = { bank_id: bankid, data_belongs_to: DATA_BELONGS_TO };
      var data = commonEncode.encrypt(JSON.stringify(mandaterequest));
      var config = {
        method: "post",
        // url: DMF_MANDATELIST_API_URL,
        url: '',
        data: data,
      };

      var res = await axios(config);
      var response = commonEncode.decrypt(res.data);
      var mandate = JSON.parse(response)["data"];
      setMandatelist(mandate);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    condiNavigation();
    setOpenModalByName("twoFA");
  }, []);

  return (
    <MainLayout>
      <ApplyWhiteBg />
      <div className="Transaction">
        <Container>
          <span></span>
          <div className="row">
            <div className="MainPanel d-flex">
              <div className="">
                <p>
                  <span className="Rupeees">
                    <Link to={prev}>
                      <img className="BackBtn" src={process.env.REACT_APP_STATIC_URL + "media/DMF/left-arrow.svg"} alt="BackBtn" />
                    </Link>
                  </span>
                </p>
              </div>
              <div className="text-label align-items-center text-center  w-75 ">
                <h4 style={{ textAlign: "center" }}>Select payment mode</h4>
                <p className="PaymentText" style={{ textAlign: "center" }}>
                  Choose how you'd like to pay for your purchase
                </p>
              </div>
            </div>
            {bankDetail.length > 0 &&
              bankDetail?.map((v) => (
                <>
                  <div>
                    <div className="CartSelectSIP ">
                      <div className="PaymentLayout">
                        <Container>
                          <div className="payment-box">
                            <Row>
                              <div className="col-12 col-md-12 col-lg-7 ">
                                {v.bank_bse_code == "" ? (
                                  <>
                                    shubham
                                  </>
                                ) : (
                                  <div className="paymentgatewayoption mt-0">
                                    <Container>
                                      <Row>
                                        <Col xs={3} lg={2}>
                                          <div className="PayImg">
                                            <img
                                              src={NetBanking}
                                              alt="NetBanking"
                                            />
                                          </div>
                                        </Col>
                                        <Col>
                                          <h4 className="PaymentType">
                                            NetBanking
                                          </h4>
                                        </Col>
                                        <Col>
                                          <Link
                                            to="/direct-mutual-fund/NetBanking"
                                            className="next-process"
                                          >
                                            <MdOutlineArrowForwardIos
                                              style={{ color: "#042b62" }}
                                              className="NextArrow"
                                            />
                                          </Link>
                                        </Col>
                                      </Row>
                                    </Container>
                                  </div>
                                )}
                                {v.upi_allow == 1 && (
                                  <div className="paymentgatewayoption UPIOption">
                                    <Container>
                                      <Row>
                                        <Col xs={3} lg={2}>
                                          <div className="PayImg">
                                            <img
                                              style={{ width: "80px" }}
                                              className="UPI"
                                              src={UPI}
                                              alt="UPI"
                                            />
                                          </div>
                                        </Col>
                                        <Col>
                                          <h4 className="PaymentType UPIData">
                                            UPI
                                          </h4>
                                        </Col>
                                        <Col>
                                          <Link
                                            to="/direct-mutual-fund/CartUPI"
                                            className="next-process"
                                          >
                                            <MdOutlineArrowForwardIos
                                              style={{ color: "#042b62" }}
                                              className="NextArrow"
                                            />
                                            {/* <img
                                      style={{color : "#042b62"}} className="NextArrow"
                                      src={NextArrow}
                                      alt=""
                                    /> */}
                                          </Link>
                                        </Col>
                                        {/* <div style={{ color: "red", paddingTop: "6px" }}>
                                          The UPI service is currently unavailable due to low success rate from BSE.
                                        </div> */}
                                      </Row>
                                    </Container>
                                  </div>
                                )}

                                {v.emandate_allow == 1 &&
                                  mandateList.length > 0 &&
                                  mandateList.some(
                                    (x) => x.mandate_status == "2"
                                  ) && (
                                    <div className={dis}>
                                      <Container>
                                        <Row>
                                          <Col xs={3} lg={2}>
                                            <div className="PayImg">
                                              <img
                                                // style={{ width: "80px" }}
                                                className=""
                                                src={Mandate}
                                                alt="Mandate"
                                              />
                                            </div>
                                          </Col>
                                          <Col>
                                            <h4 className="PaymentType">
                                              Mandate
                                            </h4>
                                          </Col>
                                          <Col>
                                            <Link
                                              to="/direct-mutual-fund/Mandate"
                                              className="next-process"
                                            >
                                              <MdOutlineArrowForwardIos
                                                style={{ color: "#042b62" }}
                                                className="NextArrow"
                                              />
                                            </Link>
                                          </Col>
                                        </Row>
                                      </Container>
                                    </div>
                                  )}

                                {v.neft_allow == 1 && (
                                  <div className="paymentgatewayoption">
                                    <Container>
                                      <Row>
                                        <Col xs={3} lg={2}>
                                          <div className="PayImg">
                                            <img src={NFET} alt="NFET" />
                                          </div>
                                        </Col>
                                        <Col>
                                          <h4 className="PaymentType">
                                            NEFT/RTGS
                                          </h4>
                                        </Col>
                                        <Col>
                                          <Link
                                            to="/direct-mutual-fund/NeftRtgs"
                                            className="next-process"
                                          >
                                            <MdOutlineArrowForwardIos
                                              style={{ color: "#042b62" }}
                                              className="NextArrow"
                                            />
                                          </Link>
                                        </Col>
                                      </Row>
                                    </Container>
                                  </div>
                                )}
                              </div>

                              <div className="col-5 col-lg-4  DesktopView">
                                <CartAmt cartAmt={cartAmt} />
                              </div>
                              {/* <Col xs={12} lg={5} className="MobileView">
                                <div className="mb-float-button">
                                  <Link to="/direct-mutual-fund/NeftRtgs">
                                    {" "}
                                    <button> Rs. {cartAmt} Pay</button>
                                  </Link>
                                </div>
                              </Col> */}
                            </Row>
                          </div>
                        </Container>
                      </div>
                    </div>
                  </div>
                </>
              ))}
          </div>
        </Container>
      </div>
      <Modal style={{ paddingTop: '90px' }}
        backdrop="static"
        show={openModalByName == "twoFA"}
        className="white-modal fn-redeem-modal"
        // centered
        onHide={() => {
          setOpenModalByName("");
        }}
      >
        <TwoFactorOtpModal
          onBack={() =>
            navigate(
              process.env.PUBLIC_URL + "/direct-mutual-fund/select-bank-for-lumpsum"
            )
          }
          onSubmit={() => {
            setOpenModalByName("");
          }}
        />
      </Modal>
    </MainLayout>
  );
}
