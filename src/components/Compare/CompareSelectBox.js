import React from "react";
import ICICI from "../Assets/01_icici.png";
import { defaultamclogo } from "../../common_utilities";

const CompareSelectBox = (props) => {
  return (
    <div className="compareSmallBox">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {/* <img src={require("../Assets/companyicons/" + props.data.amc_code +".png")} className="rounded-circle" alt="icici" /> */}
          {/* <img
            id={"imgd-" + props.data?.amc_code}
            className="rounded-circle"
            src={
              props.data?.amc_code != "" && props.data?.amc_code != null
                ? `${process.env.REACT_APP_STATIC_URL}/media/companyicons/${props.data?.amc_code}.png`
                : defaultamclogo()
            }
            // src={require("../../public/static/media/companyicons/" + item.amc_code +".png")}
            alt={props.data?.amc_code}
            onError={() => {
              document
                .getElementById("imgd-" + props.data?.isin_code)
                .setAttribute("src", defaultamclogo());
            }}
          /> */}
          <img
            id={"imgd-" + props.data?.amc_code}
            className="rounded-circle"
            src={`${process.env.REACT_APP_STATIC_URL}/media/companyicons/${props.data?.amc_code}.png`}
            alt={props.data?.amc_code}
            onError={(e) => (e.target.src = defaultamclogo())}
          />

        </div>
        <div>
          <p>{props.data?.scheme_name}</p>
          {/* <p>{props.data.scheme_code}</p> */}
        </div>
        <div>
          <span
            className="Close_Fund"
            onClick={() => props.onRemove(props.data)}
          >
            X
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompareSelectBox;