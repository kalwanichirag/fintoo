import React, { useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Styles from "./Managetriggers.module.css";
import FintooLogo from "../../../Assets/Images/F_logo.png";
import Advisory from "../../../Assets/Images/CommonDashboard/01_advisory.svg";
import Investment from "../../../Assets/Images/CommonDashboard/02_investment.png";
import PersonalTax from "../../../Assets/Images/CommonDashboard/03_personal_tax.png";
import Experts from "../../../Assets/Images/CommonDashboard/04_connect_to_our_experts.svg";
import Man from "../../../Assets/Images/CommonDashboard/man.png";
import Menu from "../../../Assets/Images/CommonDashboard/menu.png";
const Managetriggers = (props) => {
  const url = window.location.pathname.split("/").pop();
 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [url]);
  return (
    <div>
      <div className={Styles.navbar}>
        <div>
          <div className={Styles.menuLogo}>
            <img  src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"} alt="fintoo logo"/>
          </div>
        </div>
        <div className={`${Styles.menuitem} `}>
          <Link
            className="text-decoration-none d-flex"
            to={`${process.env.PUBLIC_URL}/commondashboard`}
          >
            <div>
              <img width={20} src={Advisory} />
            </div>
            <div
              className={`${Styles.menutext} ${
                url == "dashboard" ? "active" : ""
              }`}
            >
             Manage Triggers
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Managetriggers;
