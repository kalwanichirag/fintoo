import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import BackBtn from "../../Assets/left-arrow.png";
import Link from "../../MainComponents/Link";
import AutoPayOPtion from "./AutoPayOption";
import MainLayout from "../../Layout/MainLayout";
import commonEncode from "../../../commonEncode";

import {
  CheckSession,
  apiCall,
  errorAlert,
  getUserId

} from "../../../common_utilities";
import ApplyWhiteBg from "../../ApplyWhiteBg";
const AddFund = () => { };
const CloseFund = () => { };
const userid = getUserId();
export default function MyCartAutoPay() {
  const [userdetails, getUserDetails] = useState([]);


  const [payoption, setPayoption] = useState([
    {
      title: "Autopay",
      image: process.env.REACT_APP_STATIC_URL + "media/DMF/cart_Blue_Choose_Autopay_Option_03.png",
      text: "Note: AutoPay facility will enable you to set automatic monthly deductions for your SIP by registering eMandate to your Bank. This is not available for NRI and Joint holder account.",
      id: 1,
    },
    {
      title: "XSIP",
      image: process.env.REACT_APP_STATIC_URL + "media/DMF/cart_Blue_Choose_Autopay_Option_01.svg",
      text: "Is a facility offered by the exchange to register their client’s ECS Bank Mandates and upon successful registration with the destination bank, to start registering SIPs for their mutual fund clients.",
      id: 2,
    },

  ]);

  useEffect(() => {
    // //// checksession();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  useEffect(function () {
    onLoadInIt();
  }, []);



  const onLoadInIt = async () => {

    const userDeatils = await fetchUserProfileDetails(userid);
    // let url = GET_USERINFO_API_URL;
    // let data = {
    //   user_id: userid,
    //   is_direct: "1"
    // };
    let respData = await fetchUserProfileDetails(userid);
    if (respData["status_code"] == 200) {

      let data = respData["data"];

      getUserDetails(data);
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
      <ApplyWhiteBg />
      <div className="Transaction">
        <Container>
          <span></span>
          <div>
            <div xs={12} lg={12}>
              <div className="MainPanel d-flex">
                <div className="">
                  <p>
                    <span className="Rupeees">
                      <Link to="/direct-mutual-fund/select-bank-for-lumpsum">
                        {" "}
                        <img
                          className="BackBtn"
                          src={process.env.REACT_APP_STATIC_URL + "media/DMF/left-arrow.svg"}
                          alt=""
                          srcset=""
                        />
                      </Link>
                    </span>
                  </p>
                </div>
                <div className="text-label align-items-center text-center  w-75 ">
                  <h4 className="trans-head text-center">
                    Choose Payment option
                  </h4>
                </div>
              </div>
            </div>
            <div
              className="col-lg-12 col-12"
              style={{
                display: "grid",
                placeItems: "center",
              }}
            >
              <div className="CartSelectBank mt-4  col-lg-8 col-12">
                <div className="SelectedBank pay-type">
                  {payoption.filter((v) => !((userdetails.user_residential_status == "NRI") && v.title.toLowerCase() == 'autopay')).map((v) => (
                    <AutoPayOPtion item={v} key={v} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
