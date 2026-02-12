import React, { useState, memo } from "react";
import creditreport from "./CreditScore/Creditreport.module.css";
import Nsdlcsdl from "./../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/Nsdlcsdl";
import moment from "moment";
import { Link } from "react-router-dom";

const InvestMutualFund = (props) => {
  const [partreportPopup, setParReportpopup] = useState(false);


  return (
    <>
      <div className={`${creditreport.CreditReportboxs}`}>
        <div
          className={` ${creditreport.Texttitle} ${creditreport.creditmeter} mt-0 pt-4 custom-color`}
        >
          <>
            <div style={{ color: "#042b62",width:'30%' }}>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#042b62 !important",
                }}
                className=""
              >
                Mutual Fund At <br/> ZERO Cost
              </p>

              <p style={{ fontSize: ".9rem" }}>
                The direct mutual fund service enables you to invest in 2500+
                mutual funds across all the sectors at absolutely 0% commission.
              </p>
              <div className={`mt-2 ${creditreport.refreshbtn}`}>
                <Link
                  className="rounded-action-buttons"
                  to={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all`}
                >
                  Explore
                </Link>
              </div>
            </div>

            
          </>
        </div>
      </div>

      {partreportPopup ? (
        <>
          <Nsdlcsdl />
        </>
      ) : null}
    </>
  );
};
export default InvestMutualFund;
