import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { ReactComponent as AddIcon } from "../../Assets/Images/addicon_19.svg";
import StarRate from "../HTML/StarRate";
import { defaultamclogo } from "../../common_utilities";


const FundBox = (props) => {

  return (<>
    {typeof props.fundData == 'string' ? (
      <div className="item-container d-flex justify-content-center">
        <div className="addmore-fund-compare " onClick={() => props.onAdd()}>
          <div><AddIcon width="35px" height="35px" /></div>

        </div>
        <div className="Invest_Btn">
          <button onClick={() => props.onAdd()}>Add Fund</button>
        </div>
      </div>
    ) : (<div className="item-container">
      <button className="comapre-remove-button" onClick={() => props.onRemove(props.fundData?.Overview?.scheme_code != '' ? props.fundData?.Overview.scheme_code : props.fundData?.Overview.scheme_code)}><IoClose /></button>
      <div className="item-inside-bx">
        <div className="Funds_Name">
          <div style={{ border: "none" }}>
            <img
              // id={"imgd-" + props.fundData.Overview.amc_code}
              // className="rounded-circle"
              src={props.fundData?.Overview.amc_code != "" && props.fundData?.Overview.amc_code != null ? `${process.env.REACT_APP_STATIC_URL}/media/companyicons/${props.fundData?.Overview.amc_code}.png` : defaultamclogo()}
              alt={props.fundData?.Overview.amc_code}
              onError={(e) => {
                e.target.src = defaultamclogo();
              }}
            />

          </div>
          <div className="funds-title-bx">
            <span>{props.fundData?.Overview.scheme_name}</span>
          </div>

          {/* <span
            className="Close_Fund"
            onClick={() => props.onRemove(props.fundData.id)}
          >
            X
          </span> */}
        </div>


      </div>
      <div className="Invest_Btn">
        <div className="d-block d-md-none">
          <div className="Fund_Options show-in-mobile">
            <div className="d-flex">
              <div className="in-invest">{props.fundData?.Overview?.fintoo_category_name}</div>
              <div className="in-invest"><StarRate number={props.fundData?.Overview.scheme_star_rating} /></div>
            </div>
          </div>
          <div className="Fund_Options show-in-mobile">
            <span>{props.fundData?.Overview.scheme_risk_value}</span>
          </div>
        </div>
        <div className="Fund_Options show-in-desktop fund-opt-spacing d-none d-md-flex">
          <div className="in-invest">{props.fundData?.Overview?.fintoo_category_name}</div>
          <div className="in-invest"><StarRate number={props.fundData?.Overview?.scheme_star_rating} /></div>
          <div className="in-invest">{props.fundData?.Overview?.scheme_risk_value}</div>
        </div>
        <button> <Link style={{ textDecoration: "none", color: "#fff" }} to=
          {`${process.env.PUBLIC_URL}/direct-mutual-fund/MutualFund/${props.fundData?.Overview?.scheme_code}`}>Invest Now</Link> </button>
      </div>
    </div>)}
  </>);
};

export default FundBox;
