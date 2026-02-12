import React, { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import pmc from "./portfoliomobile.module.css";

import FintooLogo from "../../../Assets/Images/F_logo.png";
import { DMF_BASE_URL } from "../../../constants";
import transactions from "../../../Assets/Images/transactions.png";
import Investment from "../../../Assets/Images/Investment.png";
import Services from "../../../Assets/Images/Services.svg";
import advisory from "../../../Assets/Images/advisory_dashboard.png";
import documents from "../../../Assets/Images/my_documents.png";
import editdata from "../../../Assets/Images/edit_data.png";
import viewreport from "../../../Assets/Images/view_report.png";

const MobileSidebar = (props) => {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location]);

  return (
    <div className={pmc.navbar}>
      {/* <div>
        <div className={pmc.menuLogo}>
          <img src={FintooLogo} />
        </div>
      </div> */}

      <div className={pmc.menuitem}>
        <div>
          <img src={Services} />
        </div>
        <div className={pmc.menutext}>Services</div>
      </div>

      <a
        classname={`menu-link-182 ${pmc["menu-link"]}`}
        href={process.env.REACT_APP_PYTHON_URL + "/userflow/dashboard-summary/"}
      >
        <div className={pmc.menuitem}>
          <div>
            <img src={advisory} />
          </div>
          <div className={pmc.menutext}>Advisory Dashboard</div>
        </div>
      </a>

      {/* <div className={pmc.menuitem}>
        <div>
          <img src={advisory} />
        </div>
        <div className={pmc.menutext}>Advisory Dashboard</div>
      </div> */}

      <Link
        className={`menu-link-182 ${pmc["menu-link"]} ${
          currentUrl.toLowerCase().split("/").reverse()[0] == "dashboard"
            ? pmc.active
            : ""
        }`}
        to={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard`}
      >
        <div className={pmc.menuitem}>
          <div>
            <img src={transactions} />
          </div>
          <div className={pmc.menutext}>Investment</div>
        </div>
      </Link>

      <div className={pmc.menuitem}>
        <div>
          <img src={documents} />
        </div>
        <div className={pmc.menutext}>My Documents</div>
      </div>

      <div className={pmc.menuitem}>
        <div>
          <img src={editdata} />
        </div>
        <div className={pmc.menutext}>Edit Data</div>
      </div>

      <div className={pmc.menuitem}>
        <div>
          <img src={viewreport} />
        </div>
        <div className={pmc.menutext}>View Report</div>
      </div>
      <Link
        className={`menu-link-182 ${pmc["menu-link"]}  ${
          currentUrl.toLowerCase().indexOf("portfolio/dashboard/transaction") >
          -1
            ? pmc.active
            : ""
        }`}
        to={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/transaction?a=Pending`}
      >
        <div className={pmc.menuitem}>
          <div>
            <img src={transactions} />
          </div>
          <div className={pmc.menutext}>Transaction </div>
        </div>
      </Link>
    </div>
  );
};

export default MobileSidebar;
