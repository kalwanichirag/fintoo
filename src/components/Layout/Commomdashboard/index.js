import React, { useEffect, useState } from "react";
import {
  FaUserAlt,
  FaLongArrowAltUp,
  FaCalendarAlt,
  FaChevronRight,
} from "react-icons/fa";
import CommonDSidebar from "./sidebar";
import pmc from "./commonDashboard.module.css";
import Table from "react-bootstrap/Table";
import AIChat from "../../../Assets/Images/CommonDashboard/AskFintoo.png";
import { ReactComponent as FintooNext } from "../../../Assets/Images/fintooNextIc.svg";
import MainHeader from "../../MainHeader";
import CloseIcon from "../../../components/Assets/Dashboard/close-button.png";
import Refresh from "../../../components/Assets/Dashboard/refresh.png";
import ApplyWhiteBg from "../../ApplyWhiteBg";
import { apiCall, fetchUserData, getItemLocal, getParentUserId } from "../../../common_utilities";
import Fintootour from "../../../Pages/Fintootour";
import { CHECK_SESSION } from "../../../constants";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const CommonDashboardLayout = (props) => {
  const [chatUrl, setChatUrl] = React.useState("");
  const [showResults, setShowResults] = React.useState(false);
  const onClick = () => setShowResults(true);
  const onClose = () => setShowResults(false);
  const [sessionData, setSessionData] = useState({})

  const refreshIframe = () => {
    var ifr = document.getElementsByName("ChatBot")[0];
    ifr.src = ifr.src;
  };
  const [showTour, setShowTour] = useState(false);
  const [pageurl, setPageurl] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const delay = 2000;
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    document.body.classList.add("page-Commondashboard");
    document.body.classList.add("white-bg");
    return () => {
      document.body.classList.remove("white-bg");
      document.body.classList.remove("page-Commondashboard");
    };
  }, []);

  useEffect(() => {
    loadInit();
    // getSessiondata()
  }, []);
  const loadInit = async () => {
    // const u = await fetchUserData(true);
    // const a = `https://fintoo.hellotars.com/conv/z_dfOY/?name=${u.name}&email=${u.email}&mobile=${u.mobile}&country_code=${u.country_code}`;
    // setChatUrl(a);
  };

  const getSessiondata = async () => {
    // try {
    //   let url = CHECK_SESSION;
    //   let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
    //   let session_data = await apiCall(url, data, true, true);
    //   if ((session_data.error_code = "100" && session_data.data != "")) {

    //     setSessionData(session_data["data"]);


    //   }
    // } catch (e) { }
  };
  useEffect(() => {
    setShowTour(sessionData && sessionData["fp_lifecycle_status"] === 2);
  }, [sessionData]);
  const location = useLocation();
  useEffect(() => {
    if ("pathname" in location) {
      setPageurl(location.pathname);
    }
  }, [location]
  );
  const showPage = useSelector((state) => state.page);
  return (
    <div style={{ background: "#fff" }}>
      {/* {sessionData && sessionData["fp_lifecycle_status"] == 2 && isLoading == false && (pageurl === "/commondashboard" || pageurl === "/commondashboard/" || pageurl === "/commondashboard/") && showPage === "dashboard" ? (
        <Fintootour session={sessionData} />) : null
      } */}

      {sessionData &&
        sessionData["fp_lifecycle_status"] === 2 &&
        !isLoading &&
        (pageurl === "/commondashboard" ||
          pageurl === "/commondashboard/" ||
          pageurl === "/commondashboard/") &&
        showPage === "dashboard" && (
          <Fintootour session={sessionData} />
        )}


      <ApplyWhiteBg />
      {/* <MainHeader /> */}
      <div className={pmc.wrapper}>
        <CommonDSidebar showPage={showPage} />
        <div id="PortfolioCoach" className={pmc.contentWrapper}>
          <div id={pmc.content}>
            <div className={`container-fluid ${pmc.container}`}>
              {props.children}
            </div>
          </div>
          <div style={{ height: "1rem" }}></div>
        </div>

      </div>
    </div>
  );
};

export default CommonDashboardLayout;
