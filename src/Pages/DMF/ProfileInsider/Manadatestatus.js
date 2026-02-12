import React, { useState, useEffect } from "react";
import ProfileInsiderLayout from "../../../components/Layout/ProfileInsiderLayout";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, useNavigate } from "react-router-dom";
import HDFC from "../../../Assets/Images/hdfc.png";
import ManadateData from "./ManadateData";
import { DATA_BELONGS_TO, DMF_BASE_URL } from "../../../constants";
import {
  fetchEncryptData,
  getPublicMediaURL,
  getUserId,
  isFamilySelected,
  loginRedirectGuest,
  maskBankAccNo
} from "../../../common_utilities";
import {} from "../../../constants";
import axios from "axios"; //api calling
import commonEncode from "../../../commonEncode"; //encrypt decrypt data
import { useSearchParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import moment from "moment";
import transactioncss from '../../../components/Pages/Transaction/transaction.module.css'
import { getUserBankDetails } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";
const Manadatestatus = (props) => {
  const [mandatelist, setMandatelist] = useState([]);
  const [mandatestatus, setMandatestatus] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const bank_id = searchParams.get("bank_id");
  const [bankDetails, setBankDetails] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);


  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (getUserId() == null) {
      loginRedirectGuest();
    }
  }, []);

  useEffect(function () {
    onLoadInIt();
  }, []);
  const userid = getUserId();


  useEffect(() => {
    // // checksession();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);
  const onLoadInIt = async () => {
    try {
      if(isFamilySelected()) {
        window.location = process.env.PUBLIC_URL + "/direct-mutual-fund/portfolio/dashboard/"
        return;
      }
      
      // function sortByDayAddedDescending(a, b) {
      //   return new Date(b.mandate_added) - new Date(a.mandate_added);
      // }
      // mandate.sort(sortByDayAddedDescending);
      // setMandatelist(mandate);

      let payload = {
        user_id: getUserId(),
        data_belongs_to: DATA_BELONGS_TO,
        bank_id: bank_id
      };

      var bank_response = await getUserBankDetails(payload);
      
      if(Array.isArray(bank_response.data) && bank_response.data.length > 0) {
        setBankDetails(bank_response.data[0]);
        if (bank_response?.data[0]?.mandate_list.length > 0){
          setMandatelist(bank_response?.data[0]?.mandate_list);
        } 
      }
      
    } catch (e) {
      console.log("e -- ", e);
      //   setError(true);
    }
  };


  return (
    <ProfileInsiderLayout>
      <div className="ProfileDashboard">

        <div style={{ cursor: 'pointer', marginTop: '1rem' }} onClick={() => navigate(-1)}>
          <img
            style={{
              transform: "rotate(180deg)",
            }}
            width={20}
            height={20}
            src={process.env.PUBLIC_URL + "/static/media/icons/chevron.svg"} />
        </div>
        {/* <div className="d-md-none d-flex justify-content-between mt-2">
          <div style={{
            fontSize: "1.1rem",
            fontWeight: "500",
            border: "2px soild #042b62"
          }}>
            Set Mandate Limit
          </div>
          <div>
            <button style={{
              border: "0",
              outline: "0",
              backgroundColor: "#042b62",
              fontSize: ".9rem",
              fontWeight: " 500",
              padding: ".2rem .8rem",
              color: "#fff",
              borderRadius: "25px"

            }}>Add Funds</button>
          </div> */}
      </div>
      <div className="mt-4 ms-md-4">
        <div>
          <div className={`InvestSelectBank ${transactioncss.BankInvestBox}`}>
            <div className="bank-details">
              <div className="d-md-flex justify-content-between bank-data align-items-center">
                <div className=" d-flex align-items-center">
                  <div className={`${transactioncss.cartBankLogo}`}>
                    <img width={30} src={getPublicMediaURL(`/static/media/bank_logo/${bankDetails?.bank_bse_code}.png`)} />
                  </div>
                  <div className="ms-2">
                    <div title="HDFC Bank " className={`${transactioncss.CartmandateBankName}`}>
                      <div className={`${transactioncss.cartbanksName}`} title="HDFC Bank">{bankDetails?.bank_name}</div>
                      <div className="ms-2" style={{ color: 'rgba(0, 0, 0, 0.60)', fontSize: ".9rem", fontWeight: "400" }}>
                        (Digital Autopay Supported)
                      </div>
                    </div>

                  </div>
                </div>
                <div className="me-3">
                  <div className="">
                    <div style={{ paddingTop: "0.5em" }} className={`${transactioncss.bankinfodata}`}>
                      {maskBankAccNo(bankDetails?.bank_acc_no)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="ml-10 md:mt-14 p-2 md:p-3 rounded-3xl ms-md-4">
        <div className={`${transactioncss.manadateList}`}>
          {mandatelist.length ? (
            <>
              {//console.log('mandatelist', mandatelist)
              }
              <div className={`row ${transactioncss.mandateHeader}`}>
                <div className="col-4">Mandate ID</div>
                <div className="col-4 text-center" style={{ whiteSpace: "nowrap" }}>Maximum Debit Limit</div>
                <div className="col-4 text-center">Status</div>
              </div>
              {mandatelist.map((item) => <ManadateData key={item.mandate_id} mandateDetail={item} />)}
            </>
          ) : (
            <p>No Mandate Added</p>
          )}
          {/* {mandatelist.length > 0 && <ManadateData mandateDetail={mandatelist} />} */}
        </div>
      </div>
    </ProfileInsiderLayout>
  );
};

export default Manadatestatus;
