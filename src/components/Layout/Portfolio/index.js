import React, { useState, useEffect } from "react";
import pmc from "./portfolio.module.css";
import CommonDSidebar from "../Commomdashboard/sidebar";
import { getItemLocal } from "../../../common_utilities";
const PortfolioLayout = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add("page-portfolio");
    return () => {
      document.body.classList.remove("page-portfolio");
    };
  }, []);
  return (
    <>
      {/* <MainHeader /> */}
      <div className={`${pmc["wrapper"]} mt-1`}>
        {/* <PortfolioSidebar /> */}
        <CommonDSidebar />

        <div className={pmc.contentWrapper}>
          {/* <PortfolioTopMenu /> */}
          <div id={pmc.content}>
          {!window.location.href.includes("portfolio/link-your-holdings") && !window.location.href.includes("commondashboard/Portfolio-Holdings-Report-details") && getItemLocal("family") && (
            <p className="text-md-end ps-4" style={{color:"black", fontWeight:"bold", marginRight:"2rem"}}>To initiate any action, please choose a member from the dropdown.</p>
          )}
            <div className={`container-fluid ${pmc.container}`}>
              {props.children}
            </div>
          </div>
          <div style={{ height: "1rem" }}></div>
        </div>
      </div>
    </>
  );
};

export default PortfolioLayout;
