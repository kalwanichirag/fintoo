import { useState, useEffect } from "react";
import NextImg from "../../../Assets/Images/CommonDashboard/BlogView.svg";
import Trade from "../../../Assets/Images/CommonDashboard/buy_taxplan.png";
import { Link, useNavigate } from "react-router-dom";
import {

  BASE_API_URL,
  BLOG_URL,
  imagePath,
} from "../../../constants";
import {
  apiCall,
  getUserId,
  successAlert,
  loginRedirectGuest,
} from "../../../common_utilities";
import CommonDashboardLayout from "../../../components/Layout/Commomdashboard";

import CardBox from "../../../components/CommonDashboard/CardBox";
import DashboardSlider from "../../../components/CommonDashboard/DashboardSlider";

import BlogBoxSection from "./BlogBoxSection";
import commonEncode from "../../../commonEncode";
import SavingAccountSection from "../../MoneyManagement/views/CommonDashboard/SavingAccountSection";

// const triggerDefaulyValues = [
//   { 'report_frequency': 'Monthly' },
//   { 'portfolio_percentage': '5%', 'portfolio_movement': 'Both', 'portfolio_Mode': 'Both' },
//   { 'mutual_fund_percentage': '3%', 'mutual_fund_movement': 'Both', 'mutual_fund_Mode': 'Both' },
//   { 'stock_percent': '3%', 'stock_movement': 'Both', 'stock_Mode': 'Both' },
//   { 'buzz_mutual_fund_frequency': 'Monthly', 'buzz_mutual_fund_Mode': 'Both' },
//   { 'goal_frequency': '3 Months' },
//   { 'Subscription': true },
//   { 'Report': true },
//   { 'Portfolio': true },
//   { 'MutualFunds': true },
//   { 'Stocks': true },
//   { 'BuzzMF': true },
//   { 'Goals': true },
// ]
// let url = BASE_API_URL + "managetrigger/";
// let payload = {
//   "user_id": getUserId(),
//   "tag": "all",
//   "data": triggerDefaulyValues
// }
// let default_data = apiCall(url, payload, false, false);
const progressBarValues = [
  {
    title: "Equity",
    value: 20,
    color: "#fd9745",
  },
  {
    title: "Debt",
    value: 10,
    color: "#fe5a01",
  },
  {
    title: "Real Estate",
    value: 14,
    color: "#e3e3e3",
  },
  {
    title: "Liquid",
    value: 18,
    color: "#3598db",
  },
  {
    title: "Alternate",
    value: 10,
    color: "#16a086",
  },
  {
    title: "Gold",
    value: 24,
    color: "#2dcc70",
  },
  {
    title: "Other",
    value: 4,
    color: "#ffcc00",
  },
];

const news = [
  {
    id: 1,
    title: "Which Are The Best Stocks Below Rs 20 in India?",
    img: require("../../../Assets/Images/CommonDashboard/News1.jpg"),
  },
  {
    id: 2,
    title: "SMFG said to face $670 million tax hit on Fullerton India deal",
    img: require("../../../Assets/Images/CommonDashboard/News2.jpg"),
  },
  {
    id: 3,
    title: "India is one of the greatest opportunity in the world",
    img: require("../../../Assets/Images/CommonDashboard/News3.jpg"),
  },
];

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2, itemsToScroll: 2 },
  { width: 768, itemsToShow: 4 },
  { width: 1200, itemsToShow: 4 },
];
const Dashboard = ({ lifecyclestatus, renewpopup, subscriptionenddate }) => {
  const [returnsType, setReturnsType] = useState("xirr");
  const [selectedTab, setSelectedTab] = useState(1);
  const [blogdata, setBlogData] = useState([]);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const value = params.get('rm');
  const replacedString = value?.replace(/\+/g, ' ');
  const decodedValue = decodeURIComponent(replacedString);
  const [rmname, setRmname] = useState("");
  useEffect(() => {
    if (value) {
      const decodedValue = value.replaceAll(' ', '+');
      // setRmname(commonEncode.decrypt(decodedValue))
      const rmname = commonEncode.decrypt(decodedValue)
      
      successAlert("Your financial planning report has been generated and shared with your designated wealth manager. <b>" + rmname + "</b> will get in touch with you shortly and help you understand the report.");
    }
  }, [value]);
  // useEffect(()=> {
  //   if (value) {
  //     successAlert("Your financial planning report has been generated and shared with your designated wealth manager. <b>"+rmname+"</b> will get in touch with you shortly and help you understand the report.");
  //   }
  // }, []);
  return (
    <CommonDashboardLayout>

      {/* <p style={{ height: "2rem" }}></p> */}
      <div
        style={{
          marginTop: "1rem",
        }}
      >
        {/* <div className="row">
          <NiftySensex  renewpopup={renewpopup} />
        </div> */}
        
        <div className="Section">
          <CardBox lifecyclestatus={lifecyclestatus} renewpopup={renewpopup} subscriptionenddate={subscriptionenddate} />
        </div>

        {/* <div className="Section">
          <DashboardSlider
            lifecyclestatus={lifecyclestatus}
            renewpopup={renewpopup} subscriptionenddate={subscriptionenddate}
          />
        </div> */}

        

        <p style={{ height: "2rem" }}></p>
      </div>
    </CommonDashboardLayout>
  );
};

export default Dashboard;
