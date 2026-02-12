import React, { useState, memo } from "react";
import creditreport from "./CreditScore/Creditreport.module.css";
import Nsdlcsdl from "../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/Nsdlcsdl";
import moment from "moment";
import { Link } from "react-router-dom";

const GlobalInvestment = (props) => {

  return (
    <>
      <div className={`${creditreport.CreditReportboxs}`}>
        <div
          className={` ${creditreport.Texttitle} ${creditreport.creditmeter} mt-0 pt-4 custom-color`}
        >
          <>
            <div style={{ color: "#042b62",width:'20%'}}>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#042b62 !important",
                }}
                className=""
              >
                Global Investment
              </p>

              <p style={{ fontSize: ".9rem" }}>
                Invest globally with confidence, backed by our expert advisory team to ensure secure and smart investments. Our suite of global wealth solutions is designed to meet the evolving needs of global wealth management.
              </p>
              <div className={`mt-2 ${creditreport.refreshbtn}`}>
                <Link
                  className="rounded-action-buttons"
                  to={`${process.env.PUBLIC_URL}/international-equity`}
                >
                  Explore
                </Link>
              </div>
            </div>


          </>
        </div>
      </div>

      {/* {partreportPopup ? (
        <>
          <Nsdlcsdl />
        </>
      ) : null} */}
    </>
  );
};
export default GlobalInvestment;
