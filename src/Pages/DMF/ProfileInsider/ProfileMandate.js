import React, { useState, useRef, useEffect } from "react";
// import React, { useEffect, useState, useRef } from "react";
// import React, { useEffect, useState, useRef } from "react";
import ProfileInsiderLayout from "../../../components/Layout/ProfileInsiderLayout";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import HDFC from "../../../Assets/Images/hdfc.png";
import { } from "../../../constants";
import { getUserId, loginRedirectGuest } from "../../../common_utilities";

import moment from "moment";
import axios from "axios"; //api calling
import commonEncode from "../../../commonEncode";
import { DMF_BASE_URL } from "../../../constants";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FintooLoader from "../../../components/FintooLoader";
import { Mandateregister } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";

const ProfileMandate = () => {
  // const [amount, setAmount] = useState("");
  const AmountValue = [10000, 20000, 50000, "1 Lac"];
  const [amount, setAmount] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const bank_id = searchParams.get("bank_id");
  const [acc_number, setaccno] = useState("");
  const [bankname, setbankname] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const [bankBseCode, setBankBseCode] = useState({});
  const [bankcode, setBankCode] = useState("");
  const [bsecode, setbsecode] = useState("");

  var userid = getUserId();
  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (getUserId() == null) {
      loginRedirectGuest();
    }
  }, []);

  useEffect(() => {
    // // checksession();
    var userid = getUserId();
    // localStorage.setItem("bank_id", bank_id);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    setGetBankBseCode();
    onLoadInIt();
  }, [acc_number, bankname, bankcode]);

  const onLoadInIt = async () => {
    try {
      var form_data = { user_id: userid, bank_id: bank_id };
      var data = commonEncode.encrypt(JSON.stringify(form_data));

      var config = {
        method: "post",
        //  url: DMF_GETBANKDETAILS_API_URL,
        url: '',
        data: data,
      };

      var res = await axios(config);
      var response = commonEncode.decrypt(res.data);
      var response = JSON.parse(response);

      setbsecode(response.data[0]["bank_bse_code"]);
      setaccno(response.data[0]["bank_acc_no"]);
      setbankname(response.data[0]["bank_name"]);
    } catch (e) { }
  };

  const setGetBankBseCode = async () => {
    let data = { bank_name: bankname };

    //let data = {"bank_name":bankDetails.ifsc_details.bank_name};
    try {
      var config = {
        method: "post",
        url: REACT_APP_PYTHON_URL + "/direct-mutual-fund/api/bank/getbankbsecode",
        data: data,
      };
      var res = await axios(config);
      var response = res.data;

      // setBankCode(response);
      setBankBseCode(response);
    } catch (e) { }
  };

  var accno = acc_number.slice(9);
  var amount_m = String(amount);
  var result = amount_m.slice(1, 7);

  const mandateregister = async () => {
    try {
      setShowLoader(true);

      const payload = {
        user_id: getUserId(),
        bank_id: selectedBankId || mandatebankid,
        // mandate_type: "emandate",
        "type": "N",
        mandate_amount: amount + "",
        data_belongs_to: DATA_BELONGS_TO,
      }

      var response = await Mandateregister(payload)
      var status = response.data.status;
      setShowLoader(false);

      if (status === "Success") {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Mandate requested. Please approve the same by following the instructions sent on email.",
            type: "success",
          },
        });

        navigate(
          process.env.PUBLIC_URL +
          `/direct-mutual-fund/profile/dashboard/bankaccount/ProfileMandate/Manadatestatus?bank_id=${bank_id}`
        );
      } else if (status === "Error") {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Mandate Request Failed  !", type: "error" },
        });
      }
    } catch (e) {
      setShowLoader(false);
      //setError(true);
    }
  };

  return (
    <ProfileInsiderLayout>
      <FintooLoader show={showLoader} />
      <div className="ProfileDashboard">
        <div className="ml-10 md:mt-14 mt-4 p-2 md:p-3 rounded-3xl">
          <div className="text-label-info ">
            <Row>
              <Col xs={12} lg={7}>
                <Row>
                  <Col>
                    <div>
                      <div className="">
                        <p className="text-label">Setup Auto - Pay</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <p className="Hrline"></p>
          </div>
          <div className="manadte-data">
            <Row>
              <Col xs={12} lg={7}>
                <Row>
                  <div className="col-12 ">
                    <div>
                      <p className="SIPinfo">
                        A one-click mandate allows automatic debit for SIP
                        investments. Please set a mandate of at least Rs.10,000
                        to pay for SIP orders.
                      </p>
                    </div>
                    <div className="Bank-details">
                      <Row>
                        <Col xs={12} lg={4} className="b-layout">
                          <div className="bank-name">
                            <div>
                              <div className="bank-logo">
                                <img
                                  className="rounded-circle"
                                  src={`${process.env.REACT_APP_STATIC_URL}/media/bank_logo/${bsecode}.png`}
                                />
                              </div>
                            </div>
                            <div className="bank-data">
                              <div className="bank-label">
                                <p>Bank</p>
                              </div>
                              <div className="bank-info">
                                <span>{bankname}</span>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col xs={12} lg={2} className="b-layout mobileManadate">
                          <div className="bank-label bank-data mobilebankData">
                            <p>Account No.</p>
                          </div>
                          <div className="bank-info">
                            <span>XXXXXXXX{accno}</span>
                          </div>
                        </Col>
                        <Col xs={12} md={6} className="b-layout">
                          <div style={{ display: "flex" }}>
                            <div>
                              <div className="bank-info ">
                                <p className="aprrove-text">
                                  Approval Will take 5-7 working days
                                </p>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div className="d-auto-pay desktop-auto-pay">
                      <p className="text-label">
                        Set maximum auto-debit limit ( Digital auto-pay )
                      </p>
                      <div className="DigitalAutoPay">
                        <Row>
                          <Col xs={12} lg={4} className="b-layout d-amount">
                            <div className="Digital-Pay-amount">
                              <input
                                type="text"
                                name=""
                                value={amount}
                                maxLength={6}
                                id=""
                                onChange={(e) => {
                                  if (e.target.value <= 100000) {
                                    setAmount(e.target.value);
                                  }
                                }}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col xs={12} lg={2} className="b-layout">
                            <div>
                              <button
                                onClick={() => setAmount("₹" + 10000)}
                                className={
                                  amount == 10000 ? "amt-exact" : "amt-add"
                                }
                              >
                                ₹ 10,000
                              </button>
                            </div>
                          </Col>
                          <Col xs={12} lg={2} className="b-layout">
                            <div>
                              <button
                                onClick={() => setAmount("₹" + 25000)}
                                className={
                                  amount == 25000 ? "amt-exact" : "amt-add"
                                }
                              >
                                ₹ 25,000
                              </button>
                            </div>
                          </Col>
                          <Col xs={12} lg={2} className="b-layout">
                            <div>
                              <button
                                onClick={() => setAmount("₹" + 50000)}
                                className={
                                  amount == 50000 ? "amt-exact" : "amt-add"
                                }
                              >
                                ₹ 50,000
                              </button>
                            </div>
                          </Col>
                          <Col xs={12} lg={2} className="b-layout">
                            <div>
                              <button
                                onClick={() => setAmount("₹" + 100000)}
                                className={
                                  amount == 100000 ? "amt-exact" : "amt-add"
                                }
                              >
                                ₹ 1 Lac
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                    <div className="mobileDigiPay">
                      <div className="d-auto-pay">
                        <p className="text-label">
                          Set maximum auto-debit limit ( Digital auto-pay )
                        </p>
                        <div className="mobileDigiPay">
                          <div className="MobilePayValue">
                            <input
                              type="text"
                              name=""
                              className="text-center"
                              value={amount}
                              maxLength={6}
                              id=""
                              onChange={(e) => {
                                if (e.target.value <= 100000) {
                                  setAmount(e.target.value);
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="d-flex justify-content-between pl-2 mt-4">
                          <div>
                            <button
                              onClick={() => setAmount(10000)}
                              className={
                                amount == 10000 ? "amt-exact" : "amt-add"
                              }
                            >
                              ₹ 10,000
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={() => setAmount(25000)}
                              className={
                                amount == 25000 ? "amt-exact" : "amt-add"
                              }
                            >
                              ₹ 25,000
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={() => setAmount(50000)}
                              className={
                                amount == 50000 ? "amt-exact" : "amt-add"
                              }
                            >
                              ₹ 50000
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={() => setAmount(100000)}
                              className={
                                amount == 100000 ? "amt-exact" : "amt-add"
                              }
                            >
                              ₹ 1 Lac
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Row>
              </Col>
            </Row>

            {/* <button onClick={() => deletenomineedetails()} Link to = "/direct-mutual-fund/profile/dashboard/bankaccount/ProfileMandate/Manadatestatus">Save</button> */}

            <div className="mobileSave">
              <button className="amt-Save" onClick={() => mandateregister()}>
                {" "}
                Save{" "}
                {/* <Link to= {`invest/direct-mutual-fund/profile/dashboard/bankaccount/ProfileMandate/Manadatestatus?bank_id=${bank_id}`}> 
                </Link>  */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProfileInsiderLayout>
  );
};

export default ProfileMandate;
