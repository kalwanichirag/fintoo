import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import HDFC from "../../../Assets/Images/hdfc.png";
// import IoIosMore from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Delete from "../../../components/Assets/Dashboard/delete_Gray.png";
import DeleteBank from "../../../components/Assets/Dashboard/delete_bank.png";
import List from "../../../components/Assets/Dashboard/Bank_list.png";
import axios from "axios";
import commonEncode from "../../../commonEncode";
import { CheckSession, getPublicMediaURL, getUserId,fetchEncryptData } from "../../../common_utilities";
import { ToastContainer, toast } from "react-toastify";
import { DATA_BELONGS_TO } from "../../../constants";
import { DeleteBankDetails } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { BseClientRegistration } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";

function Profilebank(props) {
  const [removed, setRemoved] = useState(false);
  const [show, setShow] = useState(false);
  const [deletedBank, setDeletedBank] = useState(false);
  const [userBanks, setUserBanks] = useState([]);
  const [mandateList, setMandateList] = useState([{}]);
  const navigate = useNavigate();
  const [mandate, setmandatestatus] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    // // checksession();

  }, []);


  useEffect(function () {
    onLoadInIt();
  }, []);

  const onLoadInIt = async () => {
    try {
      var mandaterequest = { bank_id: String(props.userBanks.bank_id), };
      var data = commonEncode.encrypt(JSON.stringify(mandaterequest));

      var config = {
        method: "post",
        url: DMF_BASE_URL + "api/bank/getmandatelist",
        data: data,
      };
      var res = await axios(config);
      var responsegetmandate = commonEncode.decrypt(res.data);
      setMandateList(JSON.parse(responsegetmandate)["data"]);
      var mandate = JSON.parse(response);

      var mandatebankid = mandate.mandate_bankid;
      var mandate_status = mandate.error_code;
    } catch (e) {

      //   setError(true);
    }

    var user_id = getUserId();
    try {
      // var urldata = { user_id: user_id };
      // var data = commonEncode.encrypt(JSON.stringify(urldata));
      // var config = {
      //   method: "post",
      //   url: '',
      //   data: data,
      // };

      // var res = await axios(config);
      // var response = commonEncode.decrypt(res.data);
      // var res_data = (JSON.parse(response)["data"]);
      // if(res_data != "" && res_data.mandate_status != undefined)
      // {
      //   res_data.forEach(element => {
      //     setmandatestatus(res_data.mandate_status)

      //   });

      // }

      // setUserBanks(res_data);
      // setmandatestatus(res_data.mandate_status)

    } catch (e) {
      // setError(true);
    }
  };

  var userid = getUserId();
  const renderDeleteBank = async () => {
    var payload = {
      bank_id: String(props.userBanks.bank_id),
      user_id: userid,
      data_belongs_to: DATA_BELONGS_TO
    };
    
    var response = await DeleteBankDetails(payload)
    setDeletedBank(response);

    if (response.status_code == 200) {
      BseClientRegistration({user_id: userid, data_belongs_to: DATA_BELONGS_TO});
      toast.success("Account deleted successfully.", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
      });
      setTimeout(() => {
        window.location.reload(true);
      }, 3000);
    }
  };

  return removed ? (
    <></>
  ) : (
    <>
      <ToastContainer />
      <div className="Bank-P-de desktopView">
        <Row>
          <Col xs={12} lg={8}>
            <Row className="Bank-details">
              <Col xs={6} lg={4} className="b-layout">
                <div className="bank-name">
                  <div>
                    <div className="bank-logo">
                      <img className="rounded-circle" src={`${process.env.REACT_APP_STATIC_URL}/media/bank_logo/${props.userBanks.bank_bse_code ? props.userBanks.bank_bse_code : 'img_default'}.png`} />
                    </div>
                  </div>
                  <div className="bank-data">
                    <div className="bank-label">
                      <p>Bank</p>
                    </div>
                    <div className="bank-info">
                      <p>{props.userBanks.bank_name}</p>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={6} lg={4} className="b-layout ">
                <div className="bank-data ms-4">
                  <div className="bank-label ">
                    <p>Account No.</p>
                  </div>
                  <div className="bank-info">
                    <p>{props.userBanks.bank_acc_no}</p>
                  </div>
                </div>
              </Col>
              <Col xs={8} lg={4} className="b-layout">
                <div className="bank-data">
                  <div>
                    <div className="bank-label ">
                      <p>Branch Name</p>
                    </div>
                    <div className="bank-info">
                      <p>{props.userBanks.bank_branch}</p>
                    </div>
                  </div>
                </div>
              </Col>
              <div className="b-subdetails">
                <Row>
                  <Col xs={6} lg={8} className="b-layout">
                    <div className="d-flex">
                      <div style={{ width: '2rem' }}></div>
                      <div
                        style={{
                          marginLeft: 'calc(1rem + 2px)',
                        }}
                      >
                        <div className="bank-label bank-data">
                          <p>IFSC</p>
                        </div>
                        <div className="bank-info">
                          <p>{props.userBanks.bank_ifsc_code}</p>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={8} lg={4}>
                    <div style={{ display: "flex" }}>
                      <div className="bank-data">
                        <div className="bank-buttons ">

                          {props.userBanks.emandate_allow == '1' && (
                            <button className="Add-manadate" onClick={()=> {
                              props.setSelectedBankId(props.userBanks.bank_id);
                            }}>
                                + Add Mandate
                            </button>
                          )}

                          {/* {mandateList.length > 0 && ( */}
                          {props.userBanks.mandate_list.length > 0 && (
                            <button className="bank-List" >
                              <Link to={process.env.PUBLIC_URL + `/direct-mutual-fund/profile/dashboard/bankaccount/ProfileMandate/Manadatestatus?bank_id=${props.userBanks.bank_id}`}>
                                List Mandate(s)
                              </Link>
                            </button>
                          )}



                          {props.hideDelete == false && (
                            <div className="delete-bank">
                              <img
                                style={{ width: "15px" }}
                                onClick={handleShow}
                                src={getPublicMediaURL('static/media/DMF/delete_Gray.png')}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                  {props.hideDelete == true && (<Col className="b-layout mt-3" style={{
                    marginLeft: '1rem',
                    fontSize: '.8em'
                  }}>
                    <div style={{ marginLeft: 'calc(2rem + 2px)' }}>
                      <b>Note :</b> You Cannot delete and edit this bank as you
                      have used this bank for your investments.{" "}
                    </div>
                  </Col>)}
                </Row>
              </div>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="MobileData">
        <div className="Bank-details ">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <div>
                <img
                  className="BankLogo"
                  width={30}
                  // src={props.userBanks.img}
                  src={`${process.env.REACT_APP_STATIC_URL}/media/bank_logo/${props.userBanks.bank_bse_code ? props.userBanks.bank_bse_code : 'img_default'}.png`}
                />
              </div>
              <span className="bank-info mt-1 text-bold">
                <span>{props.userBanks.bank_name}</span>
              </span>
            </div>
            <div className="d-flex justify-content-between p-1">
              <div>
                <Link to="/direct-mutual-fund/profile/dashboard/bankaccount/ProfileMandate/Manadatestatus">
                  <img width={16} src={process.env.REACT_APP_STATIC_URL + "media/DMF/Bank_list.png"} />
                </Link>
              </div>
              {props.hideDelete == false && (
                <div>
                  <img
                    style={{
                      marginLeft: ".7em",
                    }}
                    onClick={handleShow}
                    width={16}
                    src={Delete}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="AccountDetails">
              <div className="AccountLabel">Account No.</div>
              <div className="AccountNo">{props.userBanks.bank_acc_no}</div>
            </div>
            <div className="text-right">
              {props.userBanks.emandate_allow == '1' && (<button className="Add-manadate">
                <Link to="/direct-mutual-fund/profile/dashboard/bankaccount/ProfileMandate">
                  + Add  Mandate --
                </Link>{" "}
              </button>)}
              {props.userBanks.emandate_allow == '1' && props.userBanks.mandate_status == '1' && (
                <button className="Add-manadate" >
                  <Link to={process.env.PUBLIC_URL + `/direct-mutual-fund/profile/dashboard/bankaccount/ProfileMandate/Manadatestatus?bank_id=${props.userBanks.bank_id}`}>
                    List Mandate(s)
                  </Link>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Bank Popup */}

      <Modal
        className="deleteBankPopup modal-md"
        show={show}
        centered
        onHide={handleClose}
        dialogClassName="modal-medium"
        size="lg"
      >
        <div className="d-flex justify-center p-4">
          <div
            className="DeleteBank text-center pb-3 w-100"
            style={{
              borderBottom: "1px solid #eeee",
            }}
          >
            Delete Bank Account
          </div>
        </div>
        <Modal.Body>
          <center>
            <div className="">
              <div>
                <img
                  style={{
                    width: "130px",
                  }}
                  src={DeleteBank}
                />
              </div>
              <div
                style={{
                  fontSize: "1em",
                  fontWeight: "500",
                }}
              >
                Do you really want delete bank account ?
              </div>
            </div>
            <div className="mt-4 buttonsDe">
              <button variant="secondary" onClick={handleClose}>
                Cancel
              </button>
              <button variant="primary" onClick={() => renderDeleteBank()}>
                Yes
              </button>
            </div>
          </center>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Profilebank;
