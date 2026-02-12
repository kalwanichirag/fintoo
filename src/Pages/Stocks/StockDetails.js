import React, { useRef, useEffect, useState } from "react";
// import "bootstrap/dist/js/bootstrap.min.js";
// import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ReactTooltip from "react-tooltip";
import share from "../../Assets/Images/share.png";
import bookmark from "../../Assets/Images/bookmark.png";
import bookmark_alternative from "../../Assets/Images/bookmark_alternative.png";
import pdf_dw from "../../Assets/Images/pdf_dw.png";
import information from "../../Assets/Images/information.png";
import graph from "../../Assets/Images/graph.png";
import Next_Arrow from "../../Assets/Images/Next_Arrow.png";
import upArrow from "../../Assets/Images/upArrow.png";
import downArrow from "../../Assets/Images/downArrow.png";
import marketcapitalization from "../../Assets/Images/marketcapitalization.svg";
import DividendYield from "../../Assets/Images/DividendYield.svg";
import cashfromoperating from "../../Assets/Images/cashfromoperating.png";
import NetProfit from "../../Assets/Images/NetProfit.svg";
import OperatingRevenues from "../../Assets/Images/OperatingRevenues.svg";
import PricetoBook from "../../Assets/Images/PricetoBook.svg";
import TrailingTwelveMonths from "../../Assets/Images/TrailingTwelveMonths.svg";
import rupeeindian from "../../Assets/Images/rupeeindian.png";
import ReturnonEquity from "../../Assets/Images/ReturnonEquity.svg";
import SMA30 from "../../Assets/Images/SMA30.svg";
import RSI from "../../Assets/Images/RSI.svg";
import MFI from "../../Assets/Images/MFI.svg";
import TechGraph from "../../Assets/Images/TechGraph.png";
import quality_qvt from "../../Assets/Images/quality_qvt.png";
import QVT_popup from "../../Assets/Images/QVT_popup.png";
import techival_qvt from "../../Assets/Images/techival_qvt.png";
import technical_q from "../../Assets/Images/technical_q.png";
import value from "../../Assets/Images/value.png";
import value_qvt from "../../Assets/Images/value_qvt.png";
import RadialBar from "../../components/Graph/RadialBar";
import Slackchart from "../../components/Graph/Slackchart";
import BarNegitive from "../../components/Graph/BarNegitive";
import Splinechart from "../../components/Graph/Splinechart";
import Modal from "react-bootstrap/Modal";
import Popup from "reactjs-popup";
import Carousel from "react-elastic-carousel";
import RangeChart from "../../components/Graph/RangeChart";
import Arrow from "../../Assets/Images/arrow.png";
import HomeIcon from "../../Assets/Images/home.png";
import TableIcon from "../../Assets/Images/Table_Up_Down.png";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Notification from "../../Assets/Images/notification.png";
import closeicon from "../../Assets/Images/closeicon.svg";
import CopyIcon from "../../Assets/Images/copy_icon.svg";
import FintooLoader from "../../components/FintooLoader";
import { Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import moment from "moment";
import { connect } from "react-redux";
import { loginRedirectGuest, getUserId } from "../../common_utilities";
import GuestLayout from "../../components/Layout/GuestLayout";

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  color: #fff;
  margin: 15px;
  font-size: 4em;
`;

function StockDetails(props) {
  const successAlert = () => {
    Swal.fire({
      title: "",
      text: "Added to Watchlist!",
      icon: "success",
    });
  };
  const RemoveAlert = () => {
    Swal.fire({
      title: "",
      text: "Removed from Watchlist!",
      icon: "success",
    });
  };

  const smallCaseAlert = () => {
    Swal.fire({
      title: "",
      text: "Market Timing is 9:15 Am To 3:30 Pm",
      icon: "Alert",
    });
  };
  /* API Call Start */

  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleSection, setVisibleSection] = useState(null);
  const [StockBySector, setStockBySector] = useState([]);
  const [TodayHighLow, setTodayHighLow] = useState([]);
  const [NseDayOpen, setDayOpen] = useState([]);
  const [DayClose, setDayClose] = useState([]);
  const [BseCurrentPrice, setBseCurrentPrice] = useState([]);
  const [BseDayOpenPrice, setBseDayOpenPrice] = useState([]);
  const [userId, setUserId] = useState([]);
  const myUserId = getUserId(); //searchParams.get("auth");
  const [myId, setMyId] = useState(0);

  const OverviewRef = useRef(null);
  const KeyMatricsRef = useRef(null);
  const TechnicalsRef = useRef(null);
  const BrokersRef = useRef(null);
  const PeerRef = useRef(null);

  const [bookmarked, setBookmarked] = useState(false);

  const sectionRefs = [
    { section: "OverviewRef", ref: OverviewRef },
    { section: "KeyMatricsRef", ref: KeyMatricsRef },
    { section: "TechnicalsRef", ref: TechnicalsRef },
    { section: "BrokersRef", ref: BrokersRef },
    { section: "PeerRef", ref: PeerRef },
  ];

  const stock_code = searchParams.get("stock_code");
  const authId = searchParams.get("auth");
  const mobile = searchParams.get("mobile");

  const [stockDetails, setStockDetails] = useState([]);
  const [stockOtherDetails, setStockOtherDetails] = useState([]);
  const [pdf, setpdf] = useState([]);
  const [userSession, setUserSession] = useState([]);
  const [dataByPrice, setgetdatabyprice] = useState([]);
  const [authData, setAuthData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inlineLoader, setInlineLoader] = useState(true);
  const [errorMsg, SetErrorMsg] = useState("");
  const [graphType, setGraphType] = useState("30M");
  const [smallCaseData, setSmallCaseData] = useState([]);
  const [click, setClick] = useState(false);

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      // style: 'currency',
      currency: "INR",
    }).format(value);

  const url = window.location.href;

  function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    toast.success("Url Copied Successfully!", {
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 2000,
    });
  }

  const hideInlineLoading = () => {
    setInlineLoader(false);
  };

  const fetchSession = () => {
    const requestOptions = {
      method: "GET",
    };
    fetch('', requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUserSession(data);
      });
  };

  const fetchStockDetails = () => {
    setIsLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockname: stock_code, user_id: getUserId() }),
    };

    fetch(STOCK_DETAIL_API_URL, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error_code == 100) {
          setpdf(data.PDF);
          setStockOtherDetails(data);
          setStockDetails(data.data);
          setStockBySector(data.peer);
          setTodayHighLow(data.today_high_low[0]);
          setDayOpen(data.nse_day_open_price.toFixed(2));
          setDayClose(data.day_close_price);
          setBseCurrentPrice(data.bse_current_price);
          setBseDayOpenPrice(data.bse_day_open_price);
          setIsLoading(false);
          hideInlineLoading();
          setIsLoading(false);
        } else {
          setIsLoading(false);
          hideInlineLoading();
          var msg = data.message;
          SetErrorMsg(msg);
        }
      })
      .catch((data) => {
        setIsLoading(false);
        hideInlineLoading();
        var msg = "Something Went Wrong !!!";
        SetErrorMsg(msg);
      });
  };

  const getdatabyprice = (param) => {
    if (activeTab == "BSE" && Boolean(stockData?.BSEcode.trim()) == false)
      return;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stock_code: stock_code,
        param: graphType,
        source: "web",
        market: activeTab,
      }),
    };

    fetch(STOCK_DATABYPRICE_API_URL, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setgetdatabyprice([...data.data]);
        if (Boolean(param)) setGraphType(param);
        setMyId((i) => ++i);
      });
  };
  const fetchAuthData = () => {
    const requestOptions = {
      method: "GET",
    };
    fetch(STOCK_AUTH_URL, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAuthData(data.data);
      });
  };
  const fetchUserDetail = () => {
    // const requestOptions = {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ user_id: authId, mobile: mobile }),
    // };
    // fetch(GET_USERINFO_API_URL, requestOptions)
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     if (data.data != "") {
    //       window.sessionStorage.removeItem("userid");
    //       window.sessionStorage.setItem("userid", authId);
    //       props.dispatch({ type: "LOGGIN_LOGOUT", payload: true });
    //       window.history.pushState(
    //         "",
    //         "",
    //         STOCKLIST_PAGE + "/details?stock_code=" + stock_code
    //       );
    //     }
    //   });
  };
  const fetchSmallCaseData = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authId: "", stock_code: stock_code }),
    };
    fetch(CONNECT_WITH_BROKER_API_URL, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //data = data
        var token = data.token;
        var trxnId = data.data.data.transactionId;
        setSmallCaseData(data);

        const gatewayInstance = new window.scDK({
          gateway: "fintoo",
          smallcaseAuthToken: token,
          config: {
            amo: true,
          },
        });
        gatewayInstance
          .triggerTransaction({
            transactionId: trxnId,
          })
          .then((txnResponse) => {})
          .catch((err) => {});
      });
  };

  useEffect(() => {
    if (myUserId & mobile) {
      fetchUserDetail();
    }

    var id = getUserId();
    if (id) {
      setUserId(id);
      props.dispatch({ type: "LOGGIN_LOGOUT", payload: true });
    }
    var userId = getUserId();
    document.body.classList.add("page-stock-details");
    document.body.classList.add("stock-styling");
    fetchStockDetails();
    fetchSession();
    fetchWatchlistgetData();
    return () => {
      document.body.classList.remove("page-stock-details");
      document.body.classList.remove("stock-styling");
    };
  }, []);
  const stockFullData = stockDetails;
  const stockData = stockDetails.stockData;
  const stockQvt = stockData?.QVT;
  const stockTechnicalData = stockDetails.technicalData;
  const stockBrockerSummary = stockDetails.brokerSummaryData;
  const stockFundamentalData = stockDetails.fundamentalData;
  const stockinvestmentChecklist = stockDetails.investmentChecklist;

  const nse_updated_date = moment(stockData?.updated).format(
    "MMM DD, YYYY hh:mm A"
  );
  const bse_updated_date = moment(stockData?.exch2Updated).format(
    "MMM DD, YYYY hh:mm A"
  );

  function numDifferentiation(val) {
    if (val >= 10000000) val = (val / 10000000).toFixed(2) + " Cr";
    else if (val >= 100000) val = (val / 100000).toFixed(2) + " Lac";
    else if (val >= 1000) val = (val / 1000).toFixed(2) + " K";
    return val;
  }

  var buy = stockBrockerSummary?.broker_buy_1Y;
  var sell = stockBrockerSummary?.broker_sell_1Y;
  var hold = stockBrockerSummary?.broker_hold_1Y;
  var analytics = "";
  if (buy >= sell && buy >= hold) {
    analytics = "buy";
  } else if (sell >= buy && sell >= hold) {
    analytics = "sell";
  } else {
    analytics = "hold";
  }
  /* API Call End */
  useEffect(() => {
    const handleScroll = () => {
      // const { height: headerHeight } = getDimensions(OverviewRef.current);
      const scrollPosition = window.scrollY + 250;
      if (scrollPosition < 300) {
        setVisibleSection(null);
      } else {
        const selected = sectionRefs.find(({ section, ref }) => {
          const ele = ref.current;
          if (ele) {
            const { offsetBottom, offsetTop } = getDimensions(ele);
            return scrollPosition > offsetTop && scrollPosition < offsetBottom;
          }
        });
        if (selected && selected.section !== visibleSection) {
          setVisibleSection(selected.section);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    var id = getUserId();
    if (id) {
      setUserId(id);
      props.dispatch({ type: "LOGGIN_LOGOUT", payload: true });
    }

    window.addEventListener("scroll", isStickyNav);
    return () => {
      window.removeEventListener("scroll", isStickyNav);
    };
  }, []);
  /* Method that will fix header after a specific scrollable */
  // const isSticky = (e) => {
  //   const header = document.querySelector(".Funds_nm");
  //   const scrollTop = window.scrollY;
  //   scrollTop >= 1
  //     ? header.classList.add("fixed_top")
  //     : header.classList.remove("fixed_top");
  // };
  const fetchWatchlistgetData = () => {
    var stock_code = searchParams.get("stock_code");
    var userId = getUserId();
    if (!userId) {
      var userId = searchParams.get("auth");
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, nse_code: stock_code }),
    };
    fetch(GET_WATCHLIST_API_URL, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setWatchlistgetData(data.data);
        if ("id" in data.data[0] && Boolean(data.data[0]["id"]))
          setBookmarked(true);
      });
  };
  const [watchlistData, setWatchlistData] = useState([]);
  const [deletewatchlistData, setAddUpdateWatchList] = useState([]);
  const [watchlistGetData, setWatchlistgetData] = useState([]);
  var nse_code = searchParams.get("nse_code");

  const fetchWatchlistData = () => {
    var userid = userSession.id;
    var nse_code = searchParams.get("stock_code");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userid, nse_code: nse_code }),
    };
    fetch(INSERT_WATCHLIST_API_URL, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setWatchlistData(data.data);
      });
  };

  const AddUpdateWatchList = (param) => {
    var userId = getUserId();
    var nse_code = searchParams.get("stock_code");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        nse_code: nse_code,
        bse_code: "",
        flag: param,
      }),
    };
    fetch(ADD_UPDATE_WATCHLIST_API_URL, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAddUpdateWatchList(data.data);
        if (data.message.toLowerCase().indexOf("added") > -1) {
          setBookmarked(true);
          successAlert();
        } else {
          setBookmarked(false);
          RemoveAlert();
        }
      });
  };

  const handledeleteWatchlist = (e) => {
    AddUpdateWatchList(e);
  };

  const handlepricegraph = (e) => {
    getdatabyprice(e);
  };

  const isStickyNav = (e) => {
    const header = document.querySelector(".sticky");
    const scrollTop = window.scrollY;
    scrollTop >= 50
      ? header.classList.add("fixed_top_Nav")
      : header.classList.remove("fixed_top_Nav");
  };
  const [isActive, setIsActive] = useState(false);
  const smallcase = (event) => {
    var d = new Date();
    var currentTime =
      d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    if (d.getDay() != 6 || d.getDay() != 7) {
      if (d.getHours() >= "9" && d.getHours() <= "15") {
        if (
          (d.getHours() == "15" && d.getMinutes() >= "31") ||
          (d.getHours() == "9" && d.getMinutes() <= "16")
        ) {
          smallCaseAlert();
        } else {
          fetchSmallCaseData();
        }
      } else {
        smallCaseAlert();
      }
    } else {
      smallCaseAlert();
    }
    /* fetchSmallCaseData(); */
  };

  const changetime = (event) => {
    setGraphType(event);
  };
  const handleClick = (event) => {
    // 👇️ toggle isActive state on click
    document.querySelector(".header-tabs-li").classList.remove("active");
    event.currentTarget.classList.add("active");
  };
  const [name, setName] = useState(share);
  const [shareActive, setshareActive] = useState(false);
  const navManu = document.querySelector(".stckymenu");
  const ToggleClass = () => {
    setshareActive(!shareActive);
    if (shareActive === false) {
      navManu.classList.add("MenuTop");
    } else {
      navManu.classList.remove("MenuTop");
    }
    // let value = name;
    // if (value === share) {
    //   setName(closeicon);

    // } else {
    //   setName(share);
    // }
  };
  const Redirect = () => {
    window.reload();
  };
  // navManu.classList.remove("MenuTop");
  const scrollTo = (ele) => {
    // var element = document.getElementById('targetElement');
    var headerOffset = 200;
    var elementPosition = ele.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const getDimensions = (ele) => {
    const { height } = ele.getBoundingClientRect();
    const offsetTop = ele.offsetTop;
    const offsetBottom = offsetTop + height;

    return {
      height,
      offsetTop,
      offsetBottom,
    };
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // For NSE:BSE Tab
  const [activeTab, setActiveTab] = useState("NSE");

  //  Functions to handle Tab Switching
  const handleTab1 = () => {
    // update the state to tab1
    setActiveTab("NSE");
  };
  const handleTab2 = () => {
    // update the state to tab2
    setActiveTab("BSE");
  };
  useEffect(() => {
    getdatabyprice();
  }, [graphType, activeTab]);

  return (
    <GuestLayout>
      {/* <FintooLoader isLoading={isLoading} /> */}
      {inlineLoader === true && <FintooLoader isLoading={isLoading} />}
      {errorMsg.length == 0 && (
        <>
          <div className="classList">
            <Container>
              <Row>
                <div className="col-12 col-md-8">
                  <div className="Funds_Sub_Details stock-details">
                    <div className="sticky">
                      <div className="Funds_nm ">
                        <h4 className="Stock_Header">{stockData?.stockName}</h4>
                        <div>
                          <div className="Funds_icons">
                            <label for="click" className="share-btn">
                              <span >
                                <img
                                  className="fund-i-ing"
                                  style={{ cursor: "pointer" }}
                                  onClick={ToggleClass}
                                  src={shareActive ? closeicon : share}
                                  alt=""
                                  title="Share"
                                />
                              </span>
                              <div
                                style={{
                                  position: "absolute",
                                  zIndex: "9999",
                                }}
                                className={
                                  shareActive ? " icon-d" : "share-links icon-d"
                                }
                              >
                                <a
                                  className=""
                                  rel="nofollow"
                                  target="_blank"
                                  onClick={copy}
                                >
                                  <ToastContainer />
                                  <img
                                    id="Copy"
                                    src={CopyIcon}
                                    alt="copy"
                                    title="Copy"
                                  />
                                </a>
                                <a
                                  href={`https://twitter.com/intent/tweet?text=${url}`}
                                  className=""
                                  rel="nofollow"
                                  target="_blank"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="126.444 2.281 589 589"
                                    height="35"
                                    width="35"
                                  >
                                    <title>Share on twitter</title>
                                    <circle
                                      cx="420.944"
                                      cy="296.781"
                                      r="294.5"
                                      fill="#042b62"
                                    ></circle>
                                    <path
                                      d="M609.773 179.634c-13.891 6.164-28.811 10.331-44.498 12.204 16.01-9.587 28.275-24.779 34.066-42.86a154.78 154.78 0 01-49.209 18.801c-14.125-15.056-34.267-24.456-56.551-24.456-42.773 0-77.462 34.675-77.462 77.473 0 6.064.683 11.98 1.996 17.66-64.389-3.236-121.474-34.079-159.684-80.945-6.672 11.446-10.491 24.754-10.491 38.953 0 26.875 13.679 50.587 34.464 64.477a77.122 77.122 0 01-35.097-9.686v.979c0 37.54 26.701 68.842 62.145 75.961-6.511 1.784-13.344 2.716-20.413 2.716-4.998 0-9.847-.473-14.584-1.364 9.859 30.769 38.471 53.166 72.363 53.799-26.515 20.785-59.925 33.175-96.212 33.175-6.25 0-12.427-.373-18.491-1.104 34.291 21.988 75.006 34.824 118.759 34.824 142.496 0 220.428-118.052 220.428-220.428 0-3.361-.074-6.697-.236-10.021a157.855 157.855 0 0038.707-40.158z"
                                      fill="#fff"
                                    ></path>
                                  </svg>
                                </a>
                                {/* <Link to='/'> */}
                                <a
                                  //href={`https://api.whatsapp.com/send?text=${url}`}
                                  href={
                                    "https://api.whatsapp.com/send?text=" +
                                    encodeURI(url)
                                  }
                                  className=""
                                  rel="nofollow"
                                  target="_blank"
                                  data-action="share/whatsapp/share"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 64 64"
                                    height="35"
                                    width="35"
                                    className="ssb143ShareButton ssb143ShareShow ssb143WhClick"
                                  >
                                    <title>Share on whatsapp</title>
                                    <circle
                                      cx="32"
                                      cy="32"
                                      r="31"
                                      fill="#30bf39"
                                    ></circle>
                                    <path
                                      d="M41.4 34.8c-.4-.2-2.5-1.4-2.9-1.5-.4-.2-.7-.2-1 .2-.3.4-1.2 1.4-1.4 1.6-.3.3-.5.3-.9.1-.4-.2-1.8-.7-3.4-2.3-1.2-1.2-2.1-2.6-2.3-3.1-.2-.4 0-.7.2-.9.2-.2.4-.5.7-.7s.3-.4.5-.7c.2-.3.1-.5 0-.8s-.9-2.4-1.2-3.3c-.3-.9-.7-.7-.9-.8-.3 0-.5-.1-.8-.1-.4 0-.9.2-1.2.5-.4.4-1.6 1.4-1.6 3.5s1.4 4.3 1.6 4.5c.2.3 2.8 4.9 7.1 6.8 4.3 1.9 4.3 1.3 5.1 1.3.8 0 2.6-1 3-1.9.4-1 .4-1.9.3-2-.2 0-.5-.1-.9-.4zm-8 10.3c-2.8 0-5.4-.8-7.7-2.3l-5.4 1.7 1.8-5.2c-1.7-2.4-2.7-5.3-2.7-8.3 0-7.8 6.3-14.1 14.1-14.1s14 6.3 14 14.1-6.3 14.1-14.1 14.1zm0-31c-9.3 0-16.9 7.6-16.9 16.9 0 3.1.8 6.1 2.4 8.7l-3.1 9.1 9.4-3c2.5 1.4 5.3 2.1 8.2 2.1 9.3 0 16.9-7.6 16.9-16.9s-7.5-16.9-16.9-16.9z"
                                      fill="#fff"
                                    ></path>
                                  </svg>
                                </a>
                              </div>
                            </label>

                            {(userId && Boolean(userId.length)) ||
                            (myUserId && Boolean(myUserId.length)) ? (
                              bookmarked ? (
                                <a
                                  onClick={() =>
                                    handledeleteWatchlist("delete")
                                  }
                                >
                                  {" "}
                                  <img
                                    src={bookmark_alternative}
                                    title="Add to Watchlist"
                                  />
                                </a>
                              ) : (
                                <a onClick={() => handledeleteWatchlist("add")}>
                                  {" "}
                                  <img src={bookmark} title="Watchlist" />
                                </a>
                              )
                            ) : (
                              <a
                                onClick={() => {
                                  loginRedirectGuest();
                                }}
                              >
                                <img src={bookmark} title="Add to Watchlist" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="header stckymenu">
                        <button
                          type="button"
                          className={`header_link ${
                            visibleSection === "OverviewRef" ? "selected" : ""
                          }`}
                          onClick={() => {
                            scrollTo(OverviewRef.current);
                          }}
                        >
                          Overview
                        </button>

                        <button
                          type="button"
                          className={`header_link ${
                            visibleSection === "KeyMatricsRef" ? "selected" : ""
                          }`}
                          onClick={() => {
                            scrollTo(KeyMatricsRef.current);
                          }}
                        >
                          Key&nbsp;Metrics
                        </button>

                        <button
                          type="button"
                          className={`header_link ${
                            visibleSection === "TechnicalsRef" ? "selected" : ""
                          }`}
                          onClick={() => {
                            scrollTo(TechnicalsRef.current);
                          }}
                        >
                          Technicals
                        </button>

                        <button
                          type="button"
                          className={`header_link ${
                            visibleSection === "PeerRef" ? "selected" : ""
                          }`}
                          onClick={() => {
                            scrollTo(PeerRef.current);
                          }}
                        >
                          Peer&nbsp;Comparison
                        </button>
                      </div>
                    </div>
                    <div className="TabList">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="tabbable-panel">
                            <div className="tabbable-line">
                              <div className="tab-content">
                                <div
                                  className="tab-pane active "
                                  id="tab_default_1"
                                >
                                  <div className="row">
                                    <div className=" col-12 col-xs-12 ">
                                      <div id="outerContainer">
                                        {/* <div
                                          className="select-left"
                                          id="container"
                                        >
                                          <div id="item"></div>
                                          <div className="left">
                                            <span>NSE</span>
                                          </div>
                                          <div className="right">
                                            <span>BSE</span>
                                          </div>
                                        </div> */}
                                        <div className="TabsNSEBSE">
                                          <ul className="nav1">
                                            <li
                                              className={
                                                activeTab === "NSE"
                                                  ? "active"
                                                  : ""
                                              }
                                              onClick={handleTab1}
                                            >
                                              NSE
                                            </li>
                                            <li
                                              className={
                                                activeTab === "BSE"
                                                  ? "active"
                                                  : ""
                                              }
                                              onClick={handleTab2}
                                            >
                                              BSE
                                            </li>
                                          </ul>

                                          <div className="outlet">
                                            {activeTab === "NSE" ? (
                                              stockData?.NSEcode ? (
                                                <>
                                                  <div className="Flex_Diff">
                                                    <span>
                                                      NSE: {stockData?.NSEcode}
                                                    </span>
                                                    {/* {Date()} */}
                                                    {nse_updated_date}
                                                  </div>
                                                  <div className="">
                                                    <div className="Price_Range">
                                                      <div>
                                                        <span className="Price">
                                                          <span>&#8377;</span>{" "}
                                                          {numberFormat(
                                                            stockData?.currentPrice
                                                          )}
                                                        </span>{" "}
                                                      </div>
                                                      <div className="Price_Line"></div>
                                                      <div className="Price_Pos_Neg">
                                                        <span>
                                                          {" "}
                                                          {numberFormat(
                                                            stockData?.dayChange
                                                          )}{" "}
                                                          <span
                                                            style={{
                                                              color:
                                                                stockData?.dayChangeP <
                                                                0
                                                                  ? "red"
                                                                  : "green" &&
                                                                    stockData?.dayChangeP ==
                                                                      0
                                                                  ? "black"
                                                                  : "green",
                                                            }}
                                                          >
                                                            (
                                                            {
                                                              stockData?.dayChangeP
                                                            }
                                                            %)
                                                          </span>
                                                        </span>
                                                      </div>
                                                    </div>
                                                    <div className="NoteStock">
                                                      * Note : Price is delayed
                                                      by 15min from current
                                                      market price
                                                    </div>
                                                    <div className="BSE_line"></div>
                                                    {/* <div className="Line"></div> */}
                                                    <div className="Stock_Value">
                                                      <div className="Price_COV">
                                                        <span>
                                                          ₹{" "}
                                                          {numberFormat(
                                                            NseDayOpen
                                                          )}
                                                        </span>
                                                        <span>Open</span>
                                                      </div>
                                                      <div className="Price_Line"></div>
                                                      <div className="Price_COV">
                                                        <span>
                                                          ₹{" "}
                                                          {numberFormat(
                                                            DayClose
                                                          )}
                                                        </span>
                                                        <span>
                                                          Previous Close
                                                        </span>
                                                      </div>
                                                      <div className="Price_Line"></div>
                                                      <div className="Price_COV">
                                                        <span>
                                                          {" "}
                                                          {numDifferentiation(
                                                            stockData?.volumeDay
                                                          )}
                                                        </span>
                                                        <span>Volume</span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </>
                                              ) : (
                                                <p>
                                                  Company is not listed on NSE
                                                </p>
                                              )
                                            ) : stockData?.BSEcode ? (
                                              <>
                                                <div className="Flex_Diff">
                                                  <span>
                                                    BSE: {stockData?.BSEcode}
                                                  </span>
                                                  {/* {Date()} */}
                                                  {bse_updated_date}
                                                </div>
                                                <div className="">
                                                  <div className="Price_Range">
                                                    <div>
                                                      <span className="Price">
                                                        <span>&#8377;</span>{" "}
                                                        {numberFormat(
                                                          BseCurrentPrice
                                                        )}
                                                      </span>{" "}
                                                    </div>
                                                    <div className="Price_Line"></div>
                                                    <div className="Price_Pos_Neg">
                                                      <span>
                                                        {" "}
                                                        {numberFormat(
                                                          stockData?.dayChange
                                                        )}{" "}
                                                        <span
                                                          style={{
                                                            color:
                                                              stockData?.dayChangeP <
                                                              0
                                                                ? "red"
                                                                : "green" &&
                                                                  stockData?.dayChangeP ==
                                                                    0
                                                                ? "black"
                                                                : "green",
                                                          }}
                                                        >
                                                          (
                                                          {
                                                            stockData?.dayChangeP
                                                          }
                                                          %)
                                                        </span>
                                                      </span>
                                                    </div>
                                                  </div>
                                                  <div className="NoteStock">
                                                    * Note : Price is delayed by
                                                    15min from current market
                                                    price
                                                  </div>
                                                  <div className="BSE_line"></div>
                                                  <div className="Stock_Value">
                                                    <div className="Price_COV">
                                                      <span>
                                                        ₹{" "}
                                                        {numberFormat(
                                                          BseDayOpenPrice
                                                        )}
                                                      </span>
                                                      <span>Open</span>
                                                    </div>
                                                    <div className="Price_Line"></div>
                                                    <div className="Price_COV">
                                                      <span>
                                                        ₹{" "}
                                                        {numberFormat(DayClose)}
                                                      </span>
                                                      <span>
                                                        Previous Close
                                                      </span>
                                                    </div>
                                                    <div className="Price_Line"></div>
                                                    <div className="Price_COV">
                                                      <span>
                                                        {" "}
                                                        {numDifferentiation(
                                                          stockData?.exch2Volume
                                                        )}
                                                      </span>
                                                      <span>Volume</span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            ) : (
                                              <p>
                                                Company is not listed on BSE
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      {/* activeTab === "NSE" ? (
                                              stockData?.NSEcode?( */}
                      {activeTab === "NSE" ? (
                        stockData?.NSEcode ? (
                          <div
                            className="Overview stk-section"
                            id="Overview"
                            ref={OverviewRef}
                          >
                            <h4>Overview</h4>
                            <div className="Graph_Sub_Details">
                              <div className="Left_Space">
                                <div className="Graph_Overview">
                                  <div className="high_low">
                                    <span>52 Week </span>
                                    <span
                                      style={{
                                        color: "rgba(255, 127, 16, 0.85)",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Low
                                    </span>{" "}
                                  </div>
                                  <div className="high_low">
                                    <span className="week">52 Week </span>
                                    <span
                                      style={{
                                        textAlign: "right",
                                        color: "rgba(0, 227, 150, 0.85)",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      High
                                    </span>
                                  </div>
                                </div>
                                <div className="range">
                                  <div className="range-outer">
                                    <div
                                      className="range-inner"
                                      style={{
                                        width:
                                          "technicalData" in stockDetails &&
                                          Object.keys(
                                            stockDetails.technicalData
                                          ).length > 0 &&
                                          stockDetails["technicalData"][
                                            "52_Week_High_Low"
                                          ]["width"] + "%",
                                        // background: "red",
                                      }}
                                    ></div>
                                  </div>

                                  <div className="overview_val">
                                    <div className="Over_SubVal">
                                      {"technicalData" in stockDetails &&
                                        Object.keys(stockDetails.technicalData)
                                          .length > 0 &&
                                        stockDetails["technicalData"][
                                          "52_Week_High_Low"
                                        ]["low"]}
                                    </div>
                                    <div className="Over_SubVal">
                                      {"technicalData" in stockDetails &&
                                        Object.keys(stockDetails.technicalData)
                                          .length > 0 &&
                                        stockDetails["technicalData"][
                                          "52_Week_High_Low"
                                        ]["high"]}
                                    </div>
                                  </div>
                                  <span className="Return_val">
                                    {"technicalData" in stockDetails &&
                                      Object.keys(stockDetails.technicalData)
                                        .length > 0 &&
                                      stockDetails["technicalData"][
                                        "52_Week_High_Low"
                                      ]["lt1"]}
                                  </span>
                                </div>
                              </div>

                              <div className="Right_Space">
                                <div className="Graph_Overview">
                                  <div className="high_low">
                                    <span>Today </span>
                                    <span
                                      style={{
                                        color: "rgba(255, 127, 16, 0.85)",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Low
                                    </span>
                                  </div>
                                  <div className="high_low">
                                    <span className="week2">Today </span>
                                    <span
                                      style={{
                                        textAlign: "right",
                                        color: "rgba(0, 227, 150, 0.85)",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      High
                                    </span>
                                  </div>
                                </div>
                                <div className="range">
                                  <div className="range-outer">
                                    <div
                                      className="range-inner"
                                      style={{
                                        width:
                                          TodayHighLow.nse_graph_width + "%",
                                      }}
                                    ></div>
                                  </div>

                                  <div className="overview_val">
                                    <div>{TodayHighLow.nse_low}</div>
                                    <div>{TodayHighLow.nse_high}</div>
                                  </div>
                                  <span className="Return_val">
                                    {stockData?.dayChangeP}% 1 Day returns
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="Slab_Chart w-100">
                              <br />
                              <br />
                              <i id="Key_Metrics"></i>
                              <div id="chart">
                                <div
                                  className="toolbar"
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <button
                                    id="Five_Min"
                                    // onClick={() => this.updateData("three_months")}
                                    onClick={() => changetime("5M")}
                                    className={`chart-button-st ${
                                      graphType === "5M" ? "active" : ""
                                    }`}
                                  >
                                    5M
                                  </button>
                                  &nbsp;
                                  <button
                                    id="fif_min"
                                    // onClick={() => this.updateData("six_months")}
                                    onClick={() => changetime("15M")}
                                    className={`chart-button-st ${
                                      graphType === "15M" ? "active" : ""
                                    }`}
                                  >
                                    15M
                                  </button>
                                  &nbsp;
                                  <button
                                    id="thirty_min"
                                    // onClick={() => this.updateData("six_months")}
                                    onClick={() => changetime("30M")}
                                    className={`chart-button-st ${
                                      graphType === "30M" ? "active" : ""
                                    }`}
                                  >
                                    30M
                                  </button>
                                  &nbsp;
                                  <button
                                    id="one_hr"
                                    // onClick={() => this.updateData("one_year")}
                                    onClick={() => changetime("1Hr")}
                                    className={`chart-button-st ${
                                      graphType === "1Hr" ? "active" : ""
                                    }`}
                                  >
                                    1Hr
                                  </button>
                                  &nbsp;
                                </div>

                                <div id="chart-timeline">
                                  {Boolean(stockData) && Boolean(stockData) && (
                                    <Splinechart
                                      key={`${myId}${graphType}-gp`}
                                      data={dataByPrice}
                                      title={stockData?.NSEcode}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="Overview stk-section"
                            id="Overview"
                            ref={OverviewRef}
                          >
                            <h4>Overview</h4>
                            <div>Company not listed on NSE</div>
                          </div>
                        )
                      ) : stockData?.BSEcode ? (
                        <div
                          className="Overview stk-section"
                          id="Overview"
                          ref={OverviewRef}
                        >
                          <h4>Overview</h4>
                          <div className="Graph_Sub_Details">
                            <div className="Left_Space">
                              <div className="Graph_Overview">
                                <div className="high_low">
                                  <span>52 Week </span>
                                  <span
                                    style={{
                                      color: "rgba(255, 127, 16, 0.85)",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Low
                                  </span>{" "}
                                </div>
                                <div className="high_low">
                                  <span className="week">52 Week </span>
                                  <span
                                    style={{
                                      textAlign: "right",
                                      color: "rgba(0, 227, 150, 0.85)",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    High
                                  </span>
                                </div>
                              </div>
                              <div className="range">
                                <div className="range-outer">
                                  <div
                                    className="range-inner"
                                    style={{
                                      width:
                                        "technicalData" in stockDetails &&
                                        Object.keys(stockDetails.technicalData)
                                          .length > 0 &&
                                        stockDetails["technicalData"][
                                          "52_Week_High_Low"
                                        ]["width"] + "%",
                                      // background: "red",
                                    }}
                                  ></div>
                                </div>

                                <div className="overview_val">
                                  <div className="Over_SubVal">
                                    {"technicalData" in stockDetails &&
                                      Object.keys(stockDetails.technicalData)
                                        .length > 0 &&
                                      stockDetails["technicalData"][
                                        "52_Week_High_Low"
                                      ]["low"]}
                                  </div>
                                  <div className="Over_SubVal">
                                    {"technicalData" in stockDetails &&
                                      Object.keys(stockDetails.technicalData)
                                        .length > 0 &&
                                      stockDetails["technicalData"][
                                        "52_Week_High_Low"
                                      ]["high"]}
                                  </div>
                                </div>
                                <span className="Return_val">
                                  {"technicalData" in stockDetails &&
                                    Object.keys(stockDetails.technicalData)
                                      .length > 0 &&
                                    stockDetails["technicalData"][
                                      "52_Week_High_Low"
                                    ]["lt1"]}
                                </span>
                              </div>
                            </div>

                            <div className="Right_Space">
                              <div className="Graph_Overview">
                                <div className="high_low">
                                  <span>Today </span>
                                  <span
                                    style={{
                                      color: "rgba(255, 127, 16, 0.85)",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Low
                                  </span>
                                </div>
                                <div className="high_low">
                                  <span className="week2">Today </span>
                                  <span
                                    style={{
                                      textAlign: "right",
                                      color: "rgba(0, 227, 150, 0.85)",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    High
                                  </span>
                                </div>
                              </div>
                              <div className="range">
                                <div className="range-outer">
                                  <div
                                    className="range-inner"
                                    style={{
                                      width: TodayHighLow.bse_graph_width + "%",
                                    }}
                                  ></div>
                                </div>

                                <div className="overview_val">
                                  <div>{TodayHighLow.bse_low}</div>
                                  <div>{TodayHighLow.bse_high}</div>
                                </div>
                                <span className="Return_val">
                                  {stockData?.dayChangeP}% 1 Day Returns
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="Slab_Chart w-100">
                            <br />
                            <br />
                            <i id="Key_Metrics"></i>
                            <div id="chart">
                              <div
                                className="toolbar"
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <button
                                  id="Five_Min"
                                  // onClick={() => this.updateData("three_months")}
                                  onClick={() => changetime("5M")}
                                  className={`chart-button-st ${
                                    graphType === "5M" ? "active" : ""
                                  }`}
                                >
                                  5M
                                </button>
                                &nbsp;
                                <button
                                  id="fif_min"
                                  // onClick={() => this.updateData("six_months")}
                                  onClick={() => changetime("15M")}
                                  className={`chart-button-st ${
                                    graphType === "15M" ? "active" : ""
                                  }`}
                                >
                                  15M
                                </button>
                                &nbsp;
                                <button
                                  id="thirty_min"
                                  // onClick={() => this.updateData("six_months")}
                                  onClick={() => changetime("30M")}
                                  className={`chart-button-st ${
                                    graphType === "30M" ? "active" : ""
                                  }`}
                                >
                                  30M
                                </button>
                                &nbsp;
                                <button
                                  id="one_hr"
                                  // onClick={() => this.updateData("one_year")}
                                  onClick={() => changetime("1Hr")}
                                  className={`chart-button-st ${
                                    graphType === "1Hr" ? "active" : ""
                                  }`}
                                >
                                  1Hr
                                </button>
                                &nbsp;
                              </div>
                              <div id="chart-timeline">
                                {Boolean(stockData) && Boolean(stockData) && (
                                  <Splinechart
                                    key={`${myId}-${graphType}-gp`}
                                    data={dataByPrice}
                                    title={stockData?.NSEcode}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="Overview stk-section"
                          id="Overview"
                          ref={OverviewRef}
                        >
                          <h4>Overview</h4>
                          <div>Company not listed on BSE</div>
                        </div>
                      )}

                      <div
                        className="Key_Metrics stk-section"
                        ref={KeyMatricsRef}
                      >
                        <h4>Key Metrics</h4>
                        <div className="Change_Diff">
                          <div className="Flex_Diff">
                            <span>Day Change</span>
                            <span>
                              {numberFormat(stockData?.dayChange)} (
                              {stockData?.dayChangeP}%)
                            </span>
                            {stockData?.dayChangeP > 0 ? (
                              <span className="upArrow">
                                <img src={upArrow} />
                              </span>
                            ) : stockData?.dayChangeP == null ? (
                              ""
                            ) : (
                              <span className="downArrow">
                                <img src={downArrow} />
                              </span>
                            )}
                          </div>
                          <div className="Price_Line"></div>
                          <div className="Flex_Diff">
                            <span>Week Change</span>
                            <span>
                              {numberFormat(stockData?.weekChange)} (
                              {stockData?.weekChangeP}%)
                            </span>
                            {stockData?.weekChangeP > 0 ? (
                              <span className="upArrow">
                                <img src={upArrow} />
                              </span>
                            ) : stockData?.weekChangeP == null ? (
                              ""
                            ) : (
                              <span className="downArrow">
                                <img src={downArrow} />
                              </span>
                            )}
                          </div>
                          <div className="Price_Line"></div>
                          <div className="Flex_Diff">
                            <span>Month Change</span>
                            <span>
                              {numberFormat(stockData?.monthChange)} (
                              {stockData?.monthChangeP}%)
                            </span>
                            {stockData?.monthChangeP > 0 ? (
                              <span className="upArrow">
                                <img src={upArrow} />
                              </span>
                            ) : stockData?.monthChangeP == null ? (
                              ""
                            ) : (
                              <span className="downArrow">
                                <img src={downArrow} />
                              </span>
                            )}
                          </div>
                          <div className="Price_Line"></div>
                          <div className="Flex_Diff">
                            <span>Year Change</span>
                            <span>
                              {numberFormat(stockData?.yearChange)} (
                              {numberFormat(stockData?.yearChangeP)}%)
                            </span>
                            {stockData?.yearChangeP > 0 ? (
                              <span className="upArrow">
                                <img src={upArrow} />
                              </span>
                            ) : stockData?.yearChangeP == null ? (
                              ""
                            ) : (
                              <span className="downArrow">
                                <img src={downArrow} />
                              </span>
                            )}
                          </div>
                        </div>
                        <hr className="Hr" />
                        <div className="ms">
                          <div className="Market_Diff">
                            <div className="Flex_Diff">
                              <span>Market Capitalization in Cr.</span>
                              <span className="d-flex justify-content-center align-items-center">
                                <span className="">
                                  <img src={marketcapitalization} />
                                </span>{" "}
                                <span>
                                  {/* {stockTechnicalData?.MCAP_Q.value} */}
                                  {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[0].value
                                    ? numberFormat(
                                        stockFundamentalData[0].value
                                      )
                                    : "N/A"}
                                </span>
                              </span>
                              <span
                                className="KeyMetricopt"
                                style={{
                                  color:
                                    stockFundamentalData &&
                                    stockFundamentalData.length > 0 &&
                                    (stockFundamentalData[0].color == "positive"
                                      ? "#00e396d9"
                                      : stockFundamentalData[0].color ==
                                        "neutral"
                                      ? "#f7d81b"
                                      : "#ff7f10"),
                                }}
                              >
                                {/* {stockTechnicalData?.MCAP_Q.st} */}
                                {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[0].st}
                              </span>
                            </div>
                            <div className="Price_Line"></div>
                            <div className="Flex_Diff">
                              <span>
                                TTM PE Ratio
                                <sup>
                                  <span className="info">
                                    <img
                                      style={{
                                        width: "17px",
                                        height: "17px",
                                      }}
                                      data-tip
                                      data-for="TTM"
                                      data-event-off
                                      data-title=""
                                      src={information}
                                      // closeOnDocumentClick
                                    />
                                  </span>
                                  <ReactTooltip
                                    id="TTM"
                                    place="top"
                                    className="Tool"
                                    effect="solid"
                                    style={{
                                      height: "200px !important",
                                    }}
                                  >
                                    The price-to-earnings ratio, or P/E ratio,
                                    helps you compare the price of a company’s
                                    stock to the earnings the company generates.
                                    This comparison helps you understand whether
                                    markets are overvaluing or undervaluing a
                                    stock. TTM period refers to the 12 months
                                    preceding the current month.
                                    {/* {stockFundamentalData &&
                                      stockFundamentalData.length > 0 &&
                                      stockFundamentalData[1].lt} */}
                                  </ReactTooltip>
                                </sup>
                              </span>
                              <span className="d-flex justify-content-center align-items-center">
                                <span>
                                  <img src={TrailingTwelveMonths} />
                                </span>{" "}
                                <span>
                                  {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[1].value
                                    ? stockFundamentalData[1].value
                                    : "N/A"}
                                </span>
                              </span>
                              <span
                                style={{
                                  color:
                                    stockFundamentalData &&
                                    stockFundamentalData.length > 0 &&
                                    (stockFundamentalData[1].color == "positive"
                                      ? "#00e396d9"
                                      : stockFundamentalData[1].color ==
                                        "neutral"
                                      ? "#f7d81b"
                                      : "#ff7f10"),
                                }}
                              >
                                {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[1].st}
                              </span>
                            </div>
                            <div className="Price_Line"></div>
                            <div className="Flex_Diff">
                              <span>
                                Price to Book Value Ratio
                                <sup>
                                  <span className="info">
                                    <img
                                      style={{
                                        width: "17px",
                                        height: "17px",
                                      }}
                                      data-tip
                                      data-for="Price"
                                      data-event-off
                                      data-title=""
                                      src={information}
                                      // closeOnDocumentClick
                                    />
                                  </span>
                                  <ReactTooltip
                                    id="Price"
                                    place="top"
                                    className="Tool"
                                    effect="solid"
                                    style={{
                                      height: "200px !important",
                                    }}
                                  >
                                    The price-to-book ratio compares a company's
                                    market value to its book value.
                                    {/* {stockFundamentalData &&
                                    stockFundamentalData.length > 0 &&
                                    stockFundamentalData[2].lt} */}
                                  </ReactTooltip>
                                </sup>
                              </span>
                              <span>
                                <span>
                                  <img src={PricetoBook} />
                                </span>{" "}
                                <span>
                                  {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[2].value
                                    ? numberFormat(
                                        stockFundamentalData[2].value
                                      )
                                    : "N/A"}
                                </span>
                              </span>
                              <span
                                style={{
                                  color:
                                    stockFundamentalData &&
                                    stockFundamentalData.length > 0 &&
                                    (stockFundamentalData[2].color == "positive"
                                      ? "#00e396d9"
                                      : stockFundamentalData[2].color ==
                                        "neutral"
                                      ? "#f7d81b"
                                      : "#ff7f10"),
                                }}
                              >
                                {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[2].st}
                              </span>
                            </div>
                          </div>

                          <div className="Market_Diff">
                            <div className="Flex_Diff">
                              <span>
                                Dividend Yield
                                <sup>
                                  <span className="info">
                                    <img
                                      style={{
                                        width: "17px",
                                        height: "17px",
                                      }}
                                      data-tip
                                      data-for="Yeild"
                                      data-event-off
                                      data-title=""
                                      src={information}
                                      // closeOnDocumentClick
                                    />
                                  </span>
                                  <ReactTooltip
                                    id="Yeild"
                                    place="top"
                                    className="Tool"
                                    effect="solid"
                                    style={{
                                      height: "200px !important",
                                    }}
                                  >
                                    The dividend yield is a financial ratio that
                                    tells you the percentage of a company's
                                    share price that it pays out in dividends
                                    each year.
                                    {/* {stockFundamentalData &&
                                      stockFundamentalData.length > 0 &&
                                      stockFundamentalData[3].lt} */}
                                  </ReactTooltip>
                                </sup>
                              </span>
                              <span className="d-flex justify-content-center align-items-center">
                                <span>
                                  <img src={DividendYield} />
                                </span>{" "}
                                <span>
                                  {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[3].value
                                    ? stockFundamentalData[3].value
                                    : "N/A"}
                                  %
                                </span>
                              </span>
                              <span
                                style={{
                                  color:
                                    stockFundamentalData &&
                                    stockFundamentalData.length > 0 &&
                                    (stockFundamentalData[3].color == "positive"
                                      ? "#00e396d9"
                                      : stockFundamentalData[3].color ==
                                        "neutral"
                                      ? "#f7d81b"
                                      : "#ff7f10"),
                                }}
                              >
                                {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[3].st}
                              </span>
                            </div>
                            <div className="Price_Line"></div>
                            <div className="Flex_Diff">
                              <span>
                                TTM PEG Ratio
                                <sup>
                                  <span className="info">
                                    <img
                                      style={{
                                        width: "17px",
                                        height: "17px",
                                      }}
                                      data-tip
                                      data-for="TTMPEG"
                                      data-event-off
                                      data-title=""
                                      src={information}
                                      // closeOnDocumentClick
                                    />
                                  </span>
                                  <ReactTooltip
                                    id="TTMPEG"
                                    place="top"
                                    className="Tool"
                                    effect="solid"
                                    style={{
                                      height: "200px !important",
                                    }}
                                  >
                                    It is a metric that helps investors value a
                                    stock by taking company’s market price, its
                                    earnings and its future growth prospects.
                                    Compare the PEG ratio to the
                                    price-to-earnings ratio (P/E ratio), a
                                    related measure that evaluates how expensive
                                    a stock is by comparing the company’s stock
                                    price to its earnings.
                                    {/* {stockFundamentalData &&
                                      stockFundamentalData.length > 0 &&
                                      stockFundamentalData[4].lt} */}
                                  </ReactTooltip>
                                </sup>
                              </span>
                              <span className="d-flex justify-content-center align-items-center">
                                <span>
                                  <img src={TrailingTwelveMonths} />
                                </span>{" "}
                                <span>
                                  {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[4].value
                                    ? stockFundamentalData[4].value
                                    : "N/A"}
                                </span>
                              </span>
                              <span
                                style={{
                                  color:
                                    stockFundamentalData &&
                                    stockFundamentalData.length > 0 &&
                                    (stockFundamentalData[4].color == "positive"
                                      ? "#00e396d9"
                                      : stockFundamentalData[4].color ==
                                        "neutral"
                                      ? "#f7d81b"
                                      : "#ff7f10"),
                                }}
                              >
                                {stockTechnicalData?.PEG_TTM.st}
                              </span>
                            </div>
                            <div className="Price_Line"></div>
                            <div className="Flex_Diff">
                              <span>
                                Operating Revenues Qtr Cr.
                                <sup>
                                  <span className="info">
                                    <img
                                      style={{
                                        width: "17px",
                                        height: "17px",
                                      }}
                                      data-tip
                                      data-for="Operating"
                                      data-event-off
                                      effect="float"
                                      data-title=""
                                      src={information}
                                      // closeOnDocumentClick
                                    />
                                  </span>
                                  <ReactTooltip
                                    id="Operating"
                                    place="top"
                                    className="Tool"
                                    effect="solid"
                                    style={{
                                      height: "200px !important",
                                      // overflow : "hidden"
                                    }}
                                  >
                                    <p>
                                      Operating revenue is the revenue that a
                                      company generates from its primary
                                      business activities. For example, a
                                      retailer produces its operating revenue
                                      through merchandise sales.
                                      {/* {stockFundamentalData &&
                                        stockFundamentalData.length > 0 &&
                                        stockFundamentalData[5].lt} */}
                                    </p>
                                  </ReactTooltip>
                                </sup>
                              </span>
                              <span className="d-flex justify-content-center align-items-center">
                                <span>
                                  <img src={OperatingRevenues} />
                                </span>{" "}
                                <span>
                                  {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[5].value
                                    ? numberFormat(
                                        stockFundamentalData[5].value
                                      )
                                    : "N/A"}
                                </span>{" "}
                                <span className="Percent_Val">
                                  {" "}
                                  <span className="">
                                    {/* <img className="upArrow_Dual" src={upArrow} /> */}
                                    {stockFundamentalData &&
                                    stockFundamentalData.length > 0 &&
                                    stockFundamentalData[5].value > 0 ? (
                                      <img
                                        className="upArrow_Dual"
                                        src={upArrow}
                                      />
                                    ) : (
                                      <img
                                        className="downArrow_Dual"
                                        src={downArrow}
                                      />
                                    )}
                                  </span>
                                </span>
                              </span>
                              <span
                                id="Technicals"
                                style={{
                                  color:
                                    stockFundamentalData &&
                                    stockFundamentalData.length > 0 &&
                                    (stockFundamentalData[5].color == "positive"
                                      ? "#00e396d9"
                                      : stockFundamentalData[5].color ==
                                        "neutral"
                                      ? "#f7d81b"
                                      : "#ff7f10"),
                                }}
                              >
                                {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[5].st}
                              </span>
                            </div>
                          </div>

                          <div className="Market_Diff ">
                            <div className="Flex_Diff">
                              <span>Net Profit Qtr Cr.</span>
                              <span className="d-flex justify-content-center align-items-center">
                                <span>
                                  <img src={NetProfit} />
                                </span>{" "}
                                <span>
                                  {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[6].value
                                    ? numberFormat(
                                        stockFundamentalData[6].value
                                      )
                                    : "N/A"}
                                </span>{" "}
                                <span className="Percent_Val">
                                  {" "}
                                  <span className="">
                                    {stockFundamentalData &&
                                    stockFundamentalData.length > 0 &&
                                    stockFundamentalData[6].value > 0 ? (
                                      <img
                                        className="upArrow_Dual"
                                        src={upArrow}
                                      />
                                    ) : (
                                      <img
                                        className="downArrow_Dual"
                                        src={downArrow}
                                      />
                                    )}
                                  </span>
                                </span>
                              </span>
                              <span
                                style={{
                                  color:
                                    stockFundamentalData &&
                                    stockFundamentalData.length > 0 &&
                                    (stockFundamentalData[6].color == "positive"
                                      ? "#00e396d9"
                                      : stockFundamentalData[6].color ==
                                        "neutral"
                                      ? "#f7d81b"
                                      : "#ff7f10"),
                                }}
                              >
                                {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[6].st}
                              </span>
                            </div>
                            <div className="Price_Line"></div>
                            <div className="Flex_Diff">
                              <span>
                                Return on Equity
                                <sup>
                                  <span className="info">
                                    <img
                                      style={{
                                        width: "17px",
                                        height: "17px",
                                      }}
                                      data-tip
                                      data-for="Return"
                                      data-event-off
                                      data-title=""
                                      src={information}
                                      // closeOnDocumentClick
                                    />
                                  </span>
                                  <ReactTooltip
                                    id="Return"
                                    place="top"
                                    className="Tool"
                                    effect="solid"
                                    style={{
                                      height: "200px !important",
                                    }}
                                  >
                                    {stockFundamentalData &&
                                      stockFundamentalData.length > 0 &&
                                      stockFundamentalData[8].lt}
                                  </ReactTooltip>
                                </sup>
                              </span>
                              <span className="d-flex justify-content-center align-items-center">
                                <span>
                                  <img src={ReturnonEquity} />
                                </span>{" "}
                                {/* {stockFundamentalData?.map((key) =>
                                key.name === "Return on Equity %" ? key.value : ""
                              )}{" "} */}
                                <span>
                                  {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[8].value
                                    ? stockFundamentalData[8].value
                                    : "N/A"}
                                  %
                                </span>
                              </span>
                              <span
                                style={{
                                  color:
                                    stockFundamentalData &&
                                    stockFundamentalData.length > 0 &&
                                    (stockFundamentalData[8].color == "positive"
                                      ? "#00e396d9"
                                      : stockFundamentalData[8].color ==
                                        "neutral"
                                      ? "#f7d81b"
                                      : "#ff7f10"),
                                }}
                              >
                                {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[8].st}
                              </span>
                            </div>
                            <div className="Price_Line"></div>
                            <div className="Flex_Diff">
                              <span>
                                Cash from operating Activities
                                <sup>
                                  <span className="info">
                                    <img
                                      style={{
                                        width: "17px",
                                        height: "17px",
                                      }}
                                      data-tip
                                      data-for="Cash"
                                      data-event-off
                                      data-title=""
                                      src={information}
                                      // closeOnDocumentClick
                                    />
                                  </span>
                                  <ReactTooltip
                                    id="Cash"
                                    place="top"
                                    className="Tool"
                                    effect="solid"
                                    style={{
                                      height: "200px !important",
                                    }}
                                  >
                                    {stockFundamentalData &&
                                      stockFundamentalData.length > 0 &&
                                      stockFundamentalData[7].lt}
                                  </ReactTooltip>
                                </sup>
                              </span>
                              <span className="d-flex justify-content-center align-items-center">
                                <span>
                                  <img src={cashfromoperating} />
                                </span>{" "}
                                <span>
                                  {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[7].value
                                    ? stockFundamentalData[7].value
                                    : "N/A"}
                                </span>{" "}
                                <span className="Percent_Val">
                                  {" "}
                                  <span className="">
                                    {stockFundamentalData &&
                                    stockFundamentalData.length > 0 &&
                                    stockFundamentalData[7].value > 0 ? (
                                      <img
                                        className="upArrow_Dual"
                                        src={upArrow}
                                      />
                                    ) : (
                                      <img
                                        className="downArrow_Dual"
                                        src={downArrow}
                                      />
                                    )}
                                  </span>{" "}
                                </span>
                              </span>
                              <span
                                style={{
                                  color:
                                    stockFundamentalData &&
                                    stockFundamentalData.length > 0 &&
                                    (stockFundamentalData[7].color == "positive"
                                      ? "#00e396d9"
                                      : stockFundamentalData[7].color ==
                                        "neutral"
                                      ? "#f7d81b"
                                      : "#ff7f10"),
                                }}
                              >
                                {stockFundamentalData &&
                                  stockFundamentalData.length > 0 &&
                                  stockFundamentalData[7].st}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="Technicals stk-section"
                        id="Summary"
                        ref={TechnicalsRef}
                      >
                        <h4>Technicals</h4>
                        <div>
                          <div className="Market_Diff">
                            <div className="Flex_Diff">
                              <span className="Tech_Val">
                                {stockTechnicalData?.sma_30.name}
                                <sup>
                                  <span className="info" ReactTooltip="{}">
                                    <img
                                      style={{
                                        width: "17px",
                                        height: "17px",
                                      }}
                                      data-tip
                                      data-for="SMA"
                                      data-event-off
                                      data-title=""
                                      src={information}
                                      // closeOnDocumentClick
                                    />
                                  </span>
                                  <ReactTooltip
                                    id="SMA"
                                    place="top"
                                    className="Tool"
                                    effect="solid"
                                    style={{
                                      height: "200px !important",
                                    }}
                                  >
                                    {stockTechnicalData?.sma_30.lt}
                                  </ReactTooltip>
                                </sup>
                              </span>
                              <span>
                                <span className="big_val">
                                  <img src={SMA30} />{" "}
                                  {stockTechnicalData?.sma_30.value}{" "}
                                </span>
                              </span>
                              {/* <span style={{ color: "#ff7f10" }}> */}
                              <span
                                style={{
                                  color:
                                    stockTechnicalData &&
                                    Object.keys(stockTechnicalData).length >
                                      0 &&
                                    (stockTechnicalData?.sma_30.color ==
                                    "positive"
                                      ? "#00e396d9"
                                      : stockTechnicalData?.sma_30.color ==
                                        "neutral"
                                      ? "#f7d81b"
                                      : "#ff7f10"),
                                }}
                              >
                                {stockTechnicalData?.sma_30.st}
                              </span>
                            </div>
                            <div className="Price_Line"></div>
                            <div className="Flex_Diff">
                              <span className="Tech_Val">
                                MFI
                                <sup>
                                  <span className="info">
                                    <img
                                      style={{
                                        width: "17px",
                                        height: "17px",
                                      }}
                                      data-tip
                                      data-for="MFI"
                                      data-event-off
                                      data-title=""
                                      src={information}
                                      // closeOnDocumentClick
                                    />
                                  </span>
                                  <ReactTooltip
                                    id="MFI"
                                    place="top"
                                    className="Tool"
                                    effect="solid"
                                    style={{
                                      height: "200px !important",
                                    }}
                                  >
                                    {stockTechnicalData?.mfi.lt}
                                  </ReactTooltip>
                                </sup>
                              </span>

                              <span className="big_val">
                                <img src={MFI} />{" "}
                                {stockTechnicalData?.mfi.value}
                              </span>
                              <span
                                style={{
                                  color:
                                    stockTechnicalData &&
                                    Object.keys(stockTechnicalData).length >
                                      0 &&
                                    (stockTechnicalData?.mfi.color == "positive"
                                      ? "#00e396d9"
                                      : stockTechnicalData?.mfi.color ==
                                        "neutral"
                                      ? "#f7d81b"
                                      : "#ff7f10"),
                                }}
                              >
                                {stockTechnicalData?.mfi.st}
                              </span>
                            </div>
                            <div className="Price_Line"></div>
                            <div className="Flex_Diff">
                              <span className="Tech_Val">
                                {stockTechnicalData?.rsi.name}
                                <sup>
                                  <span className="info">
                                    <img
                                      style={{
                                        width: "17px",
                                        height: "17px",
                                      }}
                                      data-tip
                                      data-for="RSI"
                                      data-event-off
                                      data-title=""
                                      src={information}
                                      // closeOnDocumentClick
                                    />
                                  </span>
                                  <ReactTooltip
                                    id="RSI"
                                    place="top"
                                    className="Tool"
                                    effect="solid"
                                    style={{
                                      height: "200px !important",
                                    }}
                                  >
                                    {stockTechnicalData?.rsi.lt}
                                  </ReactTooltip>
                                </sup>
                              </span>

                              <span className="big_val">
                                <img src={RSI} />{" "}
                                {stockTechnicalData?.rsi.value
                                  ? stockTechnicalData?.rsi.value
                                  : "N/A"}
                              </span>
                              <span
                                style={{
                                  color:
                                    stockTechnicalData &&
                                    Object.keys(stockTechnicalData).length >
                                      0 &&
                                    (stockTechnicalData?.rsi.color == "positive"
                                      ? "#00e396d9"
                                      : stockTechnicalData?.rsi.color ==
                                        "neutral"
                                      ? "#f7d81b"
                                      : "#ff7f10"),
                                }}
                              >
                                {stockTechnicalData?.rsi.st}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="Technicals_Graph">
                          {/* <div className="Posi_Negi_Graph">
                <span>12 Positive</span>
                <span className="circle_gray">
                  <img src={TechGraph} />{" "}
                </span>
                <span>Negitive 11</span>
              </div> */}
                          {/* <br /> */}
                          {/* <p id="tab_default_5">High Rank 52.17 Pass in Checklist</p> */}
                        </div>
                      </div>

                      <div
                        className="Compare_Stock stk-section"
                        id="Comparison"
                        ref={PeerRef}
                      >
                        <div className="Table_Header">
                          <div>
                            <h4>Compare with other stock</h4>
                          </div>
                        </div>
                        <div
                          className=""
                          style={{
                            overflow: "auto",
                          }}
                        >
                          <table id="Stock_table1">
                            <tr>
                              <th
                                style={{
                                  textAlign: "left",
                                }}
                              >
                                STOCK NAME
                              </th>
                              <th>
                                PRICE
                                {/* <img src={TableIcon} alt="" /> */}
                              </th>
                              <th>
                                1D
                                {/* <img src={TableIcon} alt="" /> */}
                              </th>
                              <th>
                                1Y
                                {/* <img src={TableIcon} alt="" /> */}
                              </th>
                              <th>
                                PE
                                {/* <img src={TableIcon} alt="" /> */}
                              </th>
                              {/* <th>
                              PB
                              <img src={TableIcon} alt="" />
                            </th>
                            <th>
                              EPS
                              <img src={TableIcon} alt="" />
                            </th> */}
                              <th>
                                MARKET CAP
                                {/* <img src={TableIcon} alt="" /> */}
                              </th>
                            </tr>
                            {StockBySector.map((v) => (
                              <tr>
                                <td>
                                  <Link
                                    to={"?stock_code=" + v.nse_code}
                                    onClick={Redirect}
                                  >
                                    {v.stock_full_name}
                                  </Link>
                                </td>

                                <td>
                                  <span>&#8377;</span>
                                  {numberFormat(v.current_price)}
                                </td>
                                <td
                                  style={{
                                    color:
                                      v.day_changeP < 0
                                        ? "red"
                                        : "green" && v.day_changeP == 0
                                        ? "black"
                                        : "green",
                                  }}
                                >
                                  {v.day_changeP}%
                                </td>
                                <td>{v.year_changeP}%</td>
                                <td>{v.pe_ttm && v.pe_ttm.toFixed(2)}</td>
                                <td>₹ {numberFormat(v.mcap_q.toFixed(2))}</td>
                              </tr>
                            ))}
                          </table>
                        </div>
                        <div>
                          <div className="Mobile_Table">
                            <div className="table-center">
                              <table>
                                <tr className="tablr_Head">
                                  <th>STOCK NAME</th>
                                  <th>
                                    PRICE
                                    {/* <img src={TableIcon} alt="" /> */}
                                  </th>
                                  <th>
                                    1D
                                    {/* <img src={TableIcon} alt="" /> */}
                                  </th>
                                  <th>
                                    1Y
                                    {/* <img src={TableIcon} alt="" /> */}
                                  </th>
                                  <th>
                                    PE
                                    {/* <img src={TableI  con} alt="" /> */}
                                  </th>
                                  <th>
                                    MARKET CAP
                                    {/* <img src={TableIcon} alt="" /> */}
                                  </th>
                                </tr>
                                {StockBySector.map((v) => (
                                  <tr>
                                    <td>
                                      <Link
                                        to={"?stock_code=" + v.nse_code}
                                        onClick={Redirect}
                                      >
                                        {v.stock_full_name}
                                      </Link>
                                    </td>

                                    <td>{numberFormat(v.current_price)} </td>
                                    <td
                                      style={{
                                        color:
                                          v.day_changeP < 0
                                            ? "red"
                                            : "green" && v.day_changeP == 0
                                            ? "black"
                                            : "green",
                                      }}
                                    >
                                      {v.day_changeP}%
                                    </td>
                                    <td>{v.year_changeP}%</td>
                                    <td>{v.pe_ttm && v.pe_ttm.toFixed(2)}</td>
                                    <td>
                                      ₹ {numberFormat(v.mcap_q.toFixed(2))}
                                    </td>
                                  </tr>
                                ))}
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      <br />
                      <br />
                      <br />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="Fund_Buy_Now  ">
                    <div className="Card Funds_icons">
                      <div className="card-bx d-none d-md-block">
                        <div className="Card_Des">
                          <p>Invest and track all your stocks in one place</p>
                        </div>
                        <div className="Card_Btn">
                          <button onClick={smallcase}>Trade Now</button>
                        </div>
                      </div>
                      <br />
                      <br />
                      <center>
                        <div className="Range_chart">
                          {stockQvt && Object.keys(stockQvt).length > 0 && (
                            <RangeChart
                              style={{ color: "gray" }}
                              data={stockinvestmentChecklist}
                            />
                          )}
                          <p
                            style={{ color: "#042b62", fontWeight: "700" }}
                            id="tab_default_5"
                          >
                            {stockinvestmentChecklist &&
                              Object.keys(stockQvt).length > 0 &&
                              stockinvestmentChecklist.insight}
                          </p>
                        </div>
                      </center>
                    </div>
                  </div>
                </div>
              </Row>
            </Container>
          </div>
          <div className="stock-float-btn">
            <div className="Card_Btn d-block d-md-none">
              {(userId && Boolean(userId.length)) ||
              (myUserId && Boolean(myUserId.length)) ? (
                <button onClick={smallcase}>Trade Now</button>
              ) : (
                <a
                  onClick={() => {
                    loginRedirectGuest();
                  }}
                >
                  <button>Trade Now</button>
                </a>
              )}
              {/* <button onClick={smallcase}>Trade</button> */}
            </div>
          </div>
        </>
      )}
      {errorMsg.length > 0 && (
        <div className="classList" style={{ marginTop: "8rem" }}>
          <div className="item-continer-bx stock-container">
            <div className="row item-continer-row">
              <div className="text-center">
                <strong>{errorMsg}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </GuestLayout>
  );
}

const mapStateToProps = (state) => ({
  loggedIn: state.loggedIn,
});

export default connect(mapStateToProps)(StockDetails);
function TabPanel(props) {
  const { childern, value, index } = props;
  return <div>{value === index && <h1>{childern}</h1>}</div>;
}
