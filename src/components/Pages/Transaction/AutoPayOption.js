import { React, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HDFC from "../../Assets/hdfc.png";
import NextArrow from "../../Assets/NextStep.png";
import Link from "../../MainComponents/Link";
import {MdOutlineArrowForwardIos} from 'react-icons/md'
import { setItemLocal } from '../../../common_utilities'
import { useNavigate } from "react-router-dom";

function AutoPayOption(props) {
  const navigate = useNavigate();
  const handleClick = () => {
    setItemLocal("mandateType", props.item.title.toLowerCase());
    navigate(`${process.env.PUBLIC_URL}/direct-mutual-fund/MyCartPaymentmode`)
  }

  return (
    <div className="InvestSelectBank payement-option">
      <div className="bank-details pay-details d-flex align-items-center">
        <div className="">
          <div>
            <div className="SelectBankData"> 
              <div>
                <div className="AutoPayOPtion">
                  <img src={props.item.image} />
                </div>
              </div>
              <div className=" PayOption">
                <div className="PayType">
                  <p> {props.item.title}</p>
                </div>
                <div className="PayOptionInfo">
                  <div>
                   {props.item.text}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Phone-next">
        {/* <Link to="/direct-mutual-fund/MyCartPaymentmode"> */}
            <MdOutlineArrowForwardIos style={{color : "#042b62", cursor: "pointer"}} className="mt-2" onClick= {handleClick}/>
              {/* <img className="next-page mt-4" src={NextArrow} /> */}
            {/* </Link> */}
        </div>
      </div>
    </div>
  );
}

export default AutoPayOption;
