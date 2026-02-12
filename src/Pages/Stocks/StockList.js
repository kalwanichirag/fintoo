import React, { useState, useEffect, useRef } from "react";
import SlidingPanel from "react-sliding-side-panel";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { BiInfoCircle } from "react-icons/bi";
import stockWhite from "../../Assets/Images/01_All_stocks_white.png";
import gainWhite from "../../Assets/Images/02_top_gainer_white.png";
import bookmark from "../../Assets/Images/bookmark.png";
import bookmark_alternative from "../../Assets/Images/bookmark_alternative.png";
import topLoser from "../../Assets/Images/03_top_losers_white.png";
import WeekLow from "../../Assets/Images/01_52_Week_Low_white.png";
import WeekHigh from "../../Assets/Images/01_52_Week_High.png";
import WatchList from "../../Assets/Images/03_watchlist_white.png";
import IPO from "../../Assets/Images/IPOWhitenew.png";
import stocks_icon from "../../Assets/Images/stocks_icon.png";
// import WishList from "../../Assets/Images/wishList.png";
import Search from "../../Assets/Images/search.svg";
import Filter from "../../Assets/Images/filter-icon.svg";
import Explore from "../../Assets/Images/left.png";
import BooKMarkStock from "../../components/HTML/BookMarkStock";
import ExploreStock from "../../components/HTML/ExploreStock";
import { Modal } from "react-responsive-modal";
import CloseFilter from "../../Assets/Images/close.png";
import Styles from "../../components/Stocks/IPOStock/style.module.css";
// import CloseFilter from "../../Assets/Images/close.png";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import ReactPaginate from "react-paginate";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { ReactComponent as SearchIo } from "../../Assets/Images/loupe-_1_.svg";
import { BiFilter } from "react-icons/bi";
import stockBlue from "../../Assets/Images/02_All_stocks_Blue.svg";
import IPOBlue from "../../Assets/Images/IPOBlue.png";
import FintooLoader from "../../components/FintooLoader";
import { useSearchParams } from "react-router-dom";
// import FilterData from "./Filter";
import Select from "react-select";
import { IoClose } from "react-icons/io5";
import FintooInlineLoader from "../../components/FintooInlineLoader";
import FintooCheckbox from "../../components/FintooCheckbox/FintooCheckbox";
import FintooSubCheckbox from "../../components/FintooCheckbox/FintooSubCheckbox";
import MainLayout from "../../components/Layout/MainLayout";
import axios from "axios";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import Headerstocklist from "../../components/Stocks/HeaderStockList";
import {
  loginRedirectGuest,
  getUserId,
  fetchData,
  indianRupeeFormat,
  apiCall,
} from "../../common_utilities";

const categories = ["All", "NSE", "BSE"];
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

const numberFormat = (value) =>
  new Intl.NumberFormat("en-IN", {
    // style: 'currency',
    currency: "INR",
  }).format(value);

const sortOptions = [
  { value: "day_changeP", label: "1 Day" },
  { value: "month_changeP", label: "1 Month" },
  { value: "year_changeP", label: "1 Year" },
  { value: "mcap_q", label: "Market cap" },
];
const IPOoptions = [
  { value: "ongoing", label: "Ongoing" },
  { value: "upcoming", label: "Upcoming" },
  { value: "closed", label: "Closed" },
];
function StockList(props) {
  // start pagination

  const dummydata = require("./data.json");

  const [catName, setCategory] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const [subcatName, setSubCategory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [ipodisabled, setIpodisabled] = useState(false)
  const Info = styled(ReactTooltip)`
    max-width: 278px;
    padding-top: 9px;
    background: "#fff";
  `;
  const InfoMessage = styled.p`
    font-size: 13px;
    line-height: 1.4;
    text-align: left;
  `;

  function handleCategoryChange(v) {
    setCategory(v);
    var setCatName = { category: undefined };
    setCatName = { ...setCatName, category: v };

    setSelectedCategory({ ...selectedCategory, ...setCatName });
    setShowResults(true);
  }
  function handleSubCategoryChange(v) {
    var ssc = [...subcatName];
    var index = ssc.indexOf(v);
    if (index > -1) {
      ssc.splice(index, 1);
    } else {
      ssc.push(v);
    }
    setSubCategory([...ssc]);
  }

  const mainTabs = [
    {
      title: "All stocks",
      image: stockWhite,
      headImage: stockBlue,
    },
    {
      title: "Top Gainers",
      image: gainWhite,
      headImage: stockBlue,
    },
    {
      title: "Top Losers",
      image: topLoser,
      headImage: stockBlue,
    },
    {
      title: "52 Week High",
      image: WeekHigh,
      headImage: stockBlue,
    },
    {
      title: "52 Week Low",
      image: WeekLow,
      headImage: stockBlue,
    },
    {
      title: "Watch List",
      image: WatchList,
      headImage: stockBlue,
    },
    {
      title: "IPO",
      image: IPO,
      headImage: IPOBlue,
    },
  ];
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const successAlert = () => {
    Swal.fire({
      title: "",
      text: "Added to Watchlist!",
      icon: "success",
    });
    var tab_Name = mainTabs[tabIndex]["title"];
    if (tab_Name == "All stocks") {
      fetchStockData();
    }
    if (tab_Name == "Top Gainers") {
      fetchStockGainLoseData();
    }
    if (tab_Name == "Top Losers") {
      fetchStockGainLoseData();
    }
    if (tab_Name == "52 Week High") {
      fetch52WeeksHighLow();
    }
    if (tab_Name == "52 Week Low") {
      fetch52WeeksHighLow();
    }
    if (tab_Name == "Watch List") {
      fetchStockWatchList();
    }
  };
  const RemoveAlert = () => {
    Swal.fire({
      title: "",
      text: "Removed from Watchlist!",
      icon: "success",
    });
    var tab_Name = mainTabs[tabIndex]["title"];
    if (tab_Name == "All stocks") {
      fetchStockData();
    }
    if (tab_Name == "Top Gainers") {
      fetchStockGainLoseData();
    }
    if (tab_Name == "Top Losers") {
      fetchStockGainLoseData();
    }
    if (tab_Name == "52 Week High") {
      fetch52WeeksHighLow();
    }
    if (tab_Name == "52 Week Low") {
      fetch52WeeksHighLow();
    }
    if (tab_Name == "Watch List") {
      fetchStockWatchList();
    }
  };

  const smallCaseAlert = () => {
    Swal.fire({
      title: "",
      text: "Market Timing is 9:15 Am To 3:30 Pm",
      icon: "Alert",
    });
  };

  const handledeleteWatchlist = (type, stock_code) => {
    AddUpdateWatchList(type, stock_code);
  };

  /* API Call Start */
  const [stockList, setStockList] = useState([]);
  const [openPanel, setOpenPanel] = useState(false);
  const [name, setName] = useState("");
  const [foundStocks, setFoundStocks] = useState(null);
  const [userSession, setUserSession] = useState([]);
  const [userLogin, setUserLogin] = useState([]);
  const [stockFilteredData, setStockFilteredData] = useState([]);
  const [industryFilteredData, setIndustryFilteresData] = useState([]);
  const [pageWatchListCount, setPageWatchListCount] = useState(0);
  const [checkedFilters, setCheckedFilters] = useState("");
  const [tabName, setTabName] = useState("All Stocks");
  const [tabIndex, setTabIndex] = useState(0);
  const [inlineLoader, setInlineLoader] = useState(false);
  const [loadedFirstTime, setLoadedFirstTime] = useState(false);
  const [sidePanelWidth, setSidePanelWidth] = useState(30);

  //const [params, setParams] = useState({ page: 1, sort: "year_changeP" });
  const [searchkey, setSearchkey] = useState("");
  const [selectedSort, setSelectedSort] = useState("year_changeP");
  const [sectorname, setSectorName] = useState("");
  const [industryname, setIndustryName] = useState([]);
  const [stockCount, setStockCount] = useState([]);
  const [selectedTab, setSelectedTab] = useState([]);
  const [skipInit, setSkipInit] = useState(false);
  const [errorMsg, SetErrorMsg] = useState("");
  const [resetAll, setresetAll] = useState(false);
  const [sessionData, setSessionData] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const stock_code = searchParams.get("nseCode");
  const userId = getUserId(); //localStorage.getItem("userid");
  const mobile = searchParams.get("mobile");
  const [params, setParams] = useState({
    page: 1,
    sort: "mcap_q",
    user_id: userId,
    stock_type: catName,
  });
  const [smallCaseData, setSmallCaseData] = useState([]);
  const [deletewishlistData, setAddUpdateWatchList] = useState([]);
  const [watchlistGetData, setWatchListData] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [indexdata, setIndexData] = useState([]);
  //=const [userId, setUserId] = useState(null);

  useEffect(() => {
    var userId = getUserId();
    if (skipInit == false) return;
    setSearchkey("");
    switch (mainTabs[tabIndex]["title"]) {
      case "All stocks":
        setParams({
          ...params,
          type: undefined,
          page: 1,
          sector_name: undefined,
          industry_name: undefined,
          sort: "mcap_q",
          user_id: userId,
          search: undefined,
          stock_type: "all",
          index_type: selectedIndex,
        });
        break;
      case "Top Gainers":
        setParams({
          ...params,
          type: "gain",
          page: undefined,
          sector_name: undefined,
          industry_name: undefined,
          sort: "day_changeP",
          user_id: userId,
          search: undefined,
          stock_type: "all",
          index_type: selectedIndex,
        });
        break;
      case "Top Losers":
        setParams({
          ...params,
          type: "loss",
          page: undefined,
          sector_name: undefined,
          industry_name: undefined,
          sort: "day_changeP",
          user_id: userId,
          search: undefined,
          stock_type: "all",
          index_type: selectedIndex,
        });
        break;
      case "52 Week High":
        setParams({
          ...params,
          page: 1,
          type: "high",
          sector_name: undefined,
          industry_name: undefined,
          sort: "year_changeP",
          user_id: userId,
          search: undefined,
          stock_type: "all",
          index_type: selectedIndex,
        });

        break;
      case "52 Week Low":
        setParams({
          ...params,
          page: 1,
          type: "low",
          sector_name: undefined,
          industry_name: undefined,
          sort: "year_changeP",
          user_id: userId,
          search: undefined,
          stock_type: "all",
          index_type: selectedIndex,
        });
        break;
      case "Watch List":
        setParams({
          ...params,
          type: undefined,
          user_id: getUserId(),
          page: 1,
          sector_name: undefined,
          industry_name: undefined,
          sort: "mcap_q",
          search: undefined,
          stock_type: "all",
          index_type: selectedIndex,
        });
        break;
      case "IPO":
        setParams({
          ...params,
          type: undefined,
          user_id: getUserId(),
          page: 1,
          sector_name: undefined,
          industry_name: undefined,
          sort: "mcap_q",
          search: undefined,
          stock_type: "all",
          index_type: selectedIndex,
        });
        setCurrentIPO(0);
        setClosedIPO(0);
        setUpcomingIPO(1);
        break;
    }
  }, [tabIndex]);

  useEffect(() => {
    if (skipInit == false) return;
    switch (mainTabs[tabIndex]["title"]) {
      case "All stocks":
        fetchStockData();
        break;
      case "Top Gainers":
        fetchStockGainLoseData();
        break;
      case "Top Losers":
        fetchStockGainLoseData();
        break;
      case "52 Week High":
        fetch52WeeksHighLow();
        break;
      case "52 Week Low":
        fetch52WeeksHighLow();
        break;
      case "Watch List":
        if (userId) {
          fetchStockWatchList();
        } else {
          loginRedirectGuest();
        }
      case "IPO":
        if (!userId) {
          loginRedirectGuest();
        }

        break;
    }
  }, [params]);
  useEffect(() => {
    if (skipInit == false) return;
    fetchStockFilteredData();
  }, [sectorname]);

  useEffect(() => {
    if (skipInit == false) return;
    fetchFilteredIndexData();
  }, [catName]);

  useEffect(() => {
    if (resetAll == true) applyFilter();
  }, [resetAll]);

  useEffect(() => {
    if (userId && mobile) {
      fetchUserDetail();
    }
    var Id = getUserId();
    if (Id) {
      props.dispatch({ type: "LOGGIN_LOGOUT", payload: true });
    }

    // else{
    //   window.sessionStorage.removeItem("userid");
    //   props.dispatch({ type: "LOGGIN_LOGOUT", payload: false });
    // }
    fetchStockData();
    setTimeout(() => {
      setSkipInit(true);
    }, 1000);

    function handleResize() {
      if (window.innerWidth < 768) {
        setSidePanelWidth(100);
      } else {
        setSidePanelWidth(30);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchStockData = async () => {
    SetErrorMsg("");
    if (loadedFirstTime == false) {
      setIsLoading(true);
      setLoadedFirstTime(true);
    }
    showInlineLoading();
    try {
      var res = await axios.post(STOCK_DATA_API_URL, params);
      if (Array.isArray(res.data.data) && res.data.data.length > 0) {
        var pagedata = res.data.count;
        setPageCount(Math.ceil(pagedata / perPage));
        setStockList(res.data.data);
        setIsLoading(false);
        hideInlineLoading();
        if (searchTerm) {
          setFoundStocks(res.data.data);
        }
      } else {
        setFoundStocks(null);
        setStockList([]);
        setIsLoading(false);
        setPageCount(0);
        hideInlineLoading();
        var msg = res.data.message;
        SetErrorMsg(msg);
      }
    } catch {
      setFoundStocks(null);
      setStockList([]);
      setPageCount(0);
      setIsLoading(false);
      hideInlineLoading();
      var msg = "Something Went Wrong !!!";
      SetErrorMsg(msg);
    }
  };

  const fetchStockGainLoseData = async () => {
    SetErrorMsg("");
    if (loadedFirstTime == false) {
      setIsLoading(true);
      setLoadedFirstTime(true);
    }
    showInlineLoading();
    try {
      var res = await axios.post(STOCK_GAIN_LOSS_API_URL, params);
      if (Array.isArray(res.data.data) && res.data.data.length > 0) {
        setPageCount(0);
        setStockList(res.data.data);
        setIsLoading(false);
        hideInlineLoading();
        if (searchTerm) {
          setFoundStocks(res.data.data);
        }
      } else {
        setFoundStocks(null);
        setStockList([]);
        setPageCount(0);
        setIsLoading(false);
        hideInlineLoading();
        var msg = res.data.message;
        SetErrorMsg(msg);
      }
    } catch {
      setFoundStocks(null);
      setStockList([]);
      setPageCount(0);
      setIsLoading(false);
      hideInlineLoading();
      var msg = "Something Went Wrong !!!";
      SetErrorMsg(msg);
    }
  };

  const fetch52WeeksHighLow = async () => {
    SetErrorMsg("");
    if (loadedFirstTime == false) {
      setIsLoading(true);
      setLoadedFirstTime(true);
    }
    showInlineLoading();
    try {
      var res = await axios.post(STOCK_52_WEEK_HIGH_LOW_API_URL, params);
      if (Array.isArray(res.data.data) && res.data.data.length > 0) {
        var pagedata = "";
        if (res.data.count <= 50) {
          pagedata = res.data.count;
        } else {
          pagedata = 50;
        }
        setPageCount(Math.ceil(pagedata / perPage));
        setStockList(res.data.data);
        setIsLoading(false);
        hideInlineLoading();
        if (searchTerm) {
          setFoundStocks(res.data.data);
        }
      } else {
        setFoundStocks(null);
        setStockList([]);
        setPageCount(0);
        setIsLoading(false);
        hideInlineLoading();
        var msg = res.data.message;
        SetErrorMsg(msg);
      }
    } catch {
      setFoundStocks(null);
      setStockList([]);
      setPageCount(0);
      setIsLoading(false);
      hideInlineLoading();
      var msg = "Something Went Wrong !!!";
      SetErrorMsg(msg);
    }
  };

  const fetchStockWatchList = async () => {
    SetErrorMsg("");
    if (loadedFirstTime == false) {
      setIsLoading(true);
      setLoadedFirstTime(true);
    }
    showInlineLoading();
    try {
      var res = await axios.post(STOCK_WATCHLIST_API_URL, params);
      if (Array.isArray(res.data.data) && res.data.data.length > 0) {
        setPageCount(0);
        var pagedata = res.data.count;
        setPageCount(Math.ceil(pagedata / perPage));
        setStockList(res.data.data);
        setIsLoading(false);
        hideInlineLoading();
        if (searchTerm) {
          setFoundStocks(res.data.data);
        }
      } else {
        setFoundStocks(null);
        setStockList([]);
        setPageCount(0);
        setIsLoading(false);
        hideInlineLoading();
        var msg = res.data.message;
        SetErrorMsg(msg);
      }
    } catch {
      setFoundStocks(null);
      setStockList([]);
      setPageCount(0);
      setIsLoading(false);
      hideInlineLoading();
      var msg = "Something Went Wrong !!!";
      SetErrorMsg(msg);
    }
  };

  const fetchStockFilteredData = async () => {
    const sector_name = sectorname;
    var res = await axios.post(STOCK_FILTER_API_URL, {
      type: "filter",
      sector_name: sector_name,
    });
    const ind = res.data.data[0].industry;
    if (Array.isArray(ind) && ind.length) {
      setIndustryFilteresData(ind);
    } else {
      setStockFilteredData(res.data.data);
    }
    setIsLoading(false);
  };

  const fetchFilteredIndexData = async () => {
    const stock_type = catName;
    var res = await axios.post(GET_INDEX_DATA_API_URL, {
      stock_type: stock_type,
    });
    const index_data = res.data;
    setIndexData(index_data.data);
    setIsLoading(false);
  };

  const AddUpdateWatchList = (type, stock_code) => {
    var userId = getUserId();
    //var nse_code = searchParams.get["nseCode"];
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        nse_code: stock_code,
        bse_code: "",
        flag: type,
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

  const fetchWatchlistgetData = () => {
    //var stock_code = searchParams.get("stock_code");
    var userId = getUserId();
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
        setWatchListData(data.data);
        if ("id" in data.data[0] && Boolean(data.data[0]["id"]))
          setBookmarked(true);
      });
  };

  const fetchSession = () => {
    // const requestOptions = {
    //   method: "GET",
    // };
    // fetch('', requestOptions)
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     setUserSession(data);
    //   });
  };

  const fetchUserDetail = () => {
    // const requestOptions = {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ user_id: userId, mobile: mobile }),
    // };
    // fetch(GET_USERINFO_API_URL, requestOptions)
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     if (data.data != "") {
    //       window.sessionStorage.setItem("userid", userId);
    //       setUserLogin(userId);
    //       props.dispatch({ type: "LOGGIN_LOGOUT", payload: true });
    //       // window.history.pushState("object or string", "Title", "http://localhost:3000/invest/stocks/");
    //       window.history.pushState("", "", STOCKLIST_PAGE);
    //     }
    //   });
  };

  const fetchSmallCaseData = (stock_code) => {
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
          .then((txnResponse) => { })
          .catch((err) => { });
      });
  };

  useEffect(() => {
    var id = getUserId();
    if (id) {
      //setUserId(id);
    }
    var userId = getUserId();
    // document.body.classList.add("page-stock-details");
    // document.body.classList.add("stock-styling");
    // fetchStockDetails();
    fetchSession();
    //getdatabyprice();
    // fetchAuthData();
    if (id) {
      fetchWatchlistgetData();
    }

    return () => {
      // document.body.classList.remove("page-stock-details");
      // document.body.classList.remove("stock-styling");
    };
  }, []);

  /* API Call End */

  // For Side Panel

  // For Hovering Effect

  // For Pagination

  const [selected, setSelected] = useState("");
  const [expanded, setExpanded] = useState(false);

  function expand() {
    setExpanded(true);
  }
  const eleh2 = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (eleh2.current && !eleh2.current.contains(event.target)) {
        setExpanded(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
      window.scrollTo(0, 0);
    };
  }, []);

  function select(event) {
    const value = event.target.textContent;
    props.callback(value);
    // close();
    setSelected(value);
  }
  // For Serach anf filter Modal Popup
  const [open, setOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const onOpenModalFilter = () => setOpenFilter(true);
  const onCloseModalFilter = () => setOpenFilter(false);
  // Filter
  const [isOpened, setIsOpened] = useState(false);
  const ref = useRef(null);

  const showInlineLoading = () => {
    setStockList([]);
    // setPageCount(0);
    setInlineLoader(true);
  };
  const hideInlineLoading = () => {
    setInlineLoader(false);
  };

  const handleTabChange = (v) => {
    setPageCount(0);
    setIndustryName([]);
    setSectorName("");
    setSearchkey("tabchange");
    setFoundStocks(null);
    setCategory("all");
    setSelectedIndex("");
    // setSkipInit(true);
    setTabIndex(v);
    SetErrorMsg("");
    setSearchTerm("");
  };

  useEffect(() => {
    if (searchParams.get("page") == "ipo") {
      handleTabChange(6);
    }
  }, []);
  // added by SHhubhamK

  const handleSearch = (e) => {
    try {
      // const keyword = e.target.value;
      var keyword = searchTerm;
      setSearchTerm(keyword);
      setPageCount(0);
      setFoundStocks(null);
      if (keyword !== "" && keyword.length > 1) {
        var search_val = { search: undefined, page: 1 };
        if (keyword.length) {
          search_val = { ...search_val, search: keyword };
        }
        setParams({ ...params, ...search_val });
      } else if (keyword == "") {
        var search_val = { search: undefined };
        setParams({ ...params, ...search_val });
      } else {
        setStockList(stockList);
      }
    } catch (e) {
      // error handle
      var msg = "Something Went Wrong !!!";
      SetErrorMsg(msg);
    }
  };

  const fetchFilter = () => {
    fetchStockFilteredData();
    fetchFilteredIndexData();
    setOpenPanel(true);
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setParams({ ...params, page: currentPage });
    window.scrollTo(0, 0);
  };

  function toggleInnerSectorCheckbox(v) {
    if (v == sectorname) {
      setSectorName("");
    } else {
      setSectorName("");
      setSectorName(v);
    }
    setIndustryName([]);
  }

  function toggleInnerIndexCheckbox(v) {
    setCategory(v);
    setSelectedIndex("");
  }

  function toggleInnerIndustryCheckbox(v) {
    var tsc = [...industryname];
    var index = tsc.indexOf(v);
    if (index > -1) {
      tsc.splice(index, 1);
    } else {
      tsc.push(v);
    }
    setIndustryName(tsc);
    //setParams({...params, category_filter: sc.join(",")});
  }

  function applyFilter(e) {
    var newObj = {
      page: 1,
      sector_name: undefined,
      industry_name: undefined,
      stock_type: catName,
      index_type: selectedIndex,
    };
    if (sectorname.length) {
      newObj = { ...newObj, sector_name: sectorname };
    }
    if (industryname.length) {
      newObj = { ...newObj, industry_name: industryname };
    }
    setPageCount(0);
    setOpenPanel(false);
    setParams({ ...params, ...newObj });
    setresetAll(false);
  }

  function resetForm() {
    setIndustryName([]);
    setSectorName("");
    setCategory("all");
    setSelectedIndex("");
    setresetAll(true);
  }

  function toggleSort(e) {
    var sorKey = { page: 1, sort: undefined };
    if (e.length) {
      sorKey = { ...sorKey, sort: e };
    }
    setParams({ ...params, ...sorKey });
    setPageCount(0);
  }

  const smallcase = (stock_code) => {
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
          fetchSmallCaseData(stock_code);
        }
      } else {
        smallCaseAlert();
      }
    } else {
      smallCaseAlert();
    }
    /* fetchSmallCaseData(); */
  };

  const smallcaseWthoutLogin = () => {
    loginRedirectGuest();
  };

  useEffect(() => {
    if (skipInit == false) return;
    if (searchkey == "tabchange") return;
    const delayDebounceFn = setTimeout(() => {
      // Send Axios request here
      handleSearch();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // IPO

  const [ipoData, setIPOData] = useState([]);
  const [currentIPO, setCurrentIPO] = useState(0);
  const [closedIPO, setClosedIPO] = useState(0);
  const [upcomingIPO, setUpcomingIPO] = useState(1);

  useEffect(() => {
    fetchIPOList(currentIPO, closedIPO, upcomingIPO);
  }, [currentIPO, closedIPO, upcomingIPO]);

  const fetchIPOList = async (currentIPO, closedIPO, upcomingIPO) => {
    try {
      let payload = {
        url: "https://stg.minty.co.in/direct-mutual-fund/api/scheme/getipolist",
        method: "post",
        data: {
          page: 1,
          per_page: 10,
          srch: "",
          current_ipo: currentIPO,
          upcoming_ipo: upcomingIPO,
          closed_ipo: closedIPO,
          ipoidsrch: 0,
          ipos: null,
          enc_resp: 0,
        },
      };

      const r = await fetchData(payload);
      // const chunkdata = r.data;
      // const chunkSize = 10; // Define the size of each chunk
      // for (let i = 0; i < chunkdata.length; i += chunkSize) {
      //     const chunk = chunkdata.slice(i, i + chunkSize); // Extract a chunk of data
      //     await new Promise(resolve => {
      //         // Update state with the chunk after a brief delay
      //         setTimeout(() => {
      //             setIPOData(prevData => [...prevData, ...chunk]);
      //             resolve();
      //         }, 1000); // Adjust the delay as needed
      //     });
      // }

      setIPOData(r.data);
    } catch (e) {
      console.log("Error", e);
    }
  };

  const handleChange = (selectedOption) => {
    if (selectedOption.value === "upcoming") {
      setCurrentIPO(0);
      setClosedIPO(0);
      setUpcomingIPO(1);
      setIpodisabled(false)
    } else if (selectedOption.value === "closed") {
      setCurrentIPO(0);
      setUpcomingIPO(0);
      setClosedIPO(1);
      setIpodisabled(true)
    } else if (selectedOption.value === "ongoing") {
      setCurrentIPO(1);
      setUpcomingIPO(0);
      setClosedIPO(0);
      setIpodisabled(false)
    }

    // Call your API function here with the updated values
    fetchIPOList(currentIPO, closedIPO, upcomingIPO);
  };
  
  useEffect(() => {
    if (selectedOption) {
      setSelectedTitle(selectedOption.label);
    } else {
      setSelectedTitle('');
    }
  }, [selectedOption]);
  useEffect(() => {
    const initialSelectedOption = sortOptions.find(option => option.value === params.sort);
    if (initialSelectedOption) {
      setSelectedTitle(initialSelectedOption.label);
    }
  }, []);

  return (
    <>
      <Headerstocklist />

      <FintooLoader isLoading={isLoading} />
      <div className="Stock_Details container">
        <Tabs style={{ marginTop: "1rem" }} selectedIndex={tabIndex}>
          <div className="Stock_Header1 stock-container">
            <TabList className="react-tabs__tab-list top-nav-menu">
              {mainTabs.map((v, i) => (
                <Tab className="TabHeader" onClick={() => handleTabChange(i)}>
                  <div className="top-menu-li-item">
                    <div className="imgC" style={{ paddingRight: "10px" }}>
                      <img className="imgC" src={v.image} alt="Watchlist" />
                    </div>
                    <div className="header-tab-title"> {v.title}</div>
                  </div>
                </Tab>
              ))}
            </TabList>
          </div>
        </Tabs>

        <div className="Stock_Search">
          <div className="searchbar-desktop">
            <div className="row ">
              <div className="col-3 tab-header-bx">
                <div style={{ marginTop: "0.5rem" }}>
                  <h4>
                    <span>
                      <img
                        className="imgC"
                        src={mainTabs[tabIndex]["headImage"]}
                        alt={mainTabs[tabIndex]["title"]}
                        style={{ width: "30px", paddingBottom: "7px" }}
                      />
                    </span>
                    <span
                      style={{
                        display: "grid",
                      }}
                    >
                      {mainTabs[tabIndex]["title"]}&nbsp;
                      {tabIndex != 6 ? (
                        <span
                          style={{
                            fontSize: ".6em",
                            fontWeight: "700",
                            // paddingTop : "1em"
                          }}
                        >
                          (
                          {catName == "all"
                            ? "nse/bse".toLocaleUpperCase()
                            : catName.toUpperCase()}
                          )
                        </span>
                      ) : null}
                    </span>
                  </h4>
                </div>
              </div>
              <div className="col-6">
                <div className="Second">
                  <div className="search-box-container">
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder={tabIndex != 6 ? "Search Stock" : "Search IPO"}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      // onChange={handleSearch}
                      tabIndex={0}
                      onFocus={expand}
                      className="autocomplete-text"
                    />
                    {searchTerm.length == 0 && (
                      <span>
                        <SearchIo width={"1.2em"} height={"1.2em"} />
                      </span>
                    )}
                    {searchTerm.length > 0 && (
                      <span
                        onClick={() => {
                          //handleSearch();
                          setSearchTerm("");
                          setFoundStocks(null);
                          setExpanded(false);
                        }}
                      >
                        <IoClose />
                      </span>
                    )}
                  </div>
                  {/* {expanded ? (
                    <div className="user-list" ref={eleh2}>
                      {foundStocks == null && searchTerm == "" && (
                        <h6>Start typing...</h6>
                      )}
                      {foundStocks == null && searchTerm != "" && (
                        <h6>No results found!</h6>
                      )}
                      {Array.isArray(foundStocks) &&
                        foundStocks.length > 0 &&
                        foundStocks.map((stocks) => (
                          <Link
                            style={{ color: "gray", cursor: "pointer" }}
                            key={stocks.NSEcode}
                            to={`/stocks/details?stock_code=${stocks.nseCode}`}
                          >
                            <div
                              className="user "
                            >
                              <span className="user-name">
                                {stocks.stockName}
                              </span>
                              <span className="user-Price">
                                {stocks.currentPrice}
                              </span>
                            </div>
                          </Link>
                        ))}
                    </div>
                  ) : null} */}
                </div>
              </div>
              <div className="col-3">
                {tabIndex != 6 ? (
                  <div className="row fintoo-filter-buttons">
                    <div className="col-6 pointer" title={selectedTitle}>
                      <Select
                        classNamePrefix="sortSelect"
                        isSearchable={false}
                        // onChange={(v) => toggleSort(v.value)}
                        // value={sortOptions.filter(
                        //   (v) => v.value == params.sort
                        // )}
                        // options={sortOptions}
                        onChange={(selectedOption) => {
                          setSelectedOption(selectedOption);
                          if (selectedOption) {
                            toggleSort(selectedOption.value);
                          }
                        }}
                        value={sortOptions.filter((v) => v.value === params.sort)}
                        options={sortOptions}
                      />
                    </div>
                    <div className="col-6">
                      <button
                        onClick={fetchFilter}
                        //onClick={() => setOpenPanel(true)}
                        className="Btn btn-filter"
                        type="button"
                      >
                        <span>
                          Filter
                          <BiFilter
                            style={{ fontSize: "1.5em", color: "#042b62" }}
                          />
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row fintoo-filter-buttons">
                    <Select
                      classNamePrefix="sortSelectipo"
                      isSearchable={false}
                      // value={""}
                      options={IPOoptions}
                      onChange={(selectedOption) => {
                        handleChange(selectedOption);
                      }}
                      defaultValue={{ value: "upcoming", label: "Upcoming" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="Mobile_Stock_search">
            <div className="Search_Filter_Mobile">
              <div className="Search_Field">
                <img onClick={onOpenModal} src={Search} alt="" />
                <div>
                  <Modal
                    className="Search_Modal"
                    open={open}
                    onClose={onCloseModal}
                    center
                  >
                    <div>
                      <input
                        placeholder="Search for Funds, Stocks, US Stocks...."
                        type="search"
                        name=""
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        tabIndex={0}
                        onFocus={expand}
                      />
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                      {/* <p className="mostpop">Most Popular</p> */}
                      <div style={{ marginTop: "1rem" }}>
                        {foundStocks == null && searchTerm == "" && (
                          <h6>Start typing...</h6>
                        )}
                        {foundStocks == null && searchTerm != "" && (
                          <h6>No results found!</h6>
                        )}
                        {Array.isArray(foundStocks) &&
                          foundStocks.length > 0 &&
                          foundStocks.map((stocks) => (
                            <Link
                              style={{
                                color: "#042b62 !important",
                                fontWeight: "500",
                                fontSize: "1em",
                                cursor: "pointer",
                                textDecoration: "none",
                              }}
                              key={stocks.nseCode}
                              to={`${process.env.PUBLIC_URL}/stocks/details?stock_code=${stocks.nseCode}`}
                            >
                              <div className="Top_Stock_List">
                                <div>{stocks.stockName}</div>
                                <div
                                  style={{
                                    color: "black !important",
                                  }}
                                >
                                  <p style={{ float: "right" }}>
                                    {stocks.currentPrice}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <h4>{mainTabs[tabIndex]["title"]}</h4>
              </div>
              <div className="Filter_Field">
                <img onClick={fetchFilter} src={Filter} alt="" />
              </div>
            </div>
          </div>
        </div>

        {inlineLoader === true && (
          <div className="item-continer-bx">
            <div className="row item-continer-row">
              <div className="col-12">
                <FintooInlineLoader isLoading={inlineLoader} />
              </div>
            </div>
          </div>
        )}

        {tabIndex != 6 ? (
          <div className="item-list">
            {errorMsg.length == 0 &&
              Array.isArray(stockList) &&
              stockList.map((stock) => (
                <div className="item-continer-bx stock-container">
                  <div className="row item-continer-row">
                    <div
                      className={`col-12 ${tabIndex != 6 ? "col-md-3" : "col-md-4"
                        }`}
                    >
                      <div className="item-title-container">
                        <div className="" style={{ width: '40px', height: '40px', marginRight: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <img
                            style={{ width: '30px' }}
                            // className="imgC"
                            // src={stocks_icon}
                            src={stockBlue}
                            alt="stock Blue"
                          />
                        </div>
                        <div className="item-title-parent stock-item-list">
                          <div className="item-title">
                            <Link
                              to={`${process.env.PUBLIC_URL}/stocks/details?stock_code=${stock.nseCode}`}
                            >
                              {stock.stockName}
                            </Link>
                          </div>
                          <span className="stock-industry">
                            {stock.sectorName} - {stock.industryName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`col-12 ${tabIndex != 6 ? "col-md-7" : "col-md-6"
                        }`}
                    >
                      <div className="item-side-options">
                        <div className="Sample">
                          {tabIndex != 6 ? (
                            <>
                              <div className="in-options-title">
                                PRICE (1 D){" "}
                              </div>
                              <div className="Value">
                                <span className="currencySymbol">₹&nbsp; </span>
                                {numberFormat(
                                  stock.currentPrice &&
                                  stock.currentPrice.toFixed(2)
                                )}{" "}
                                <span className="Value">
                                  <span
                                    style={{
                                      color:
                                        stock.dayChangeP < 0
                                          ? "red"
                                          : "green" && stock.dayChangeP == 0
                                            ? "black"
                                            : "green",
                                    }}
                                  >
                                    (
                                    {stock.dayChangeP &&
                                      stock.dayChangeP.toFixed(2)}
                                    %)
                                  </span>
                                </span>
                                <span style={{ color: "#ff7f10" }}></span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="in-options-title">
                                Biding Dates{" "}
                                <sup
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "3px",
                                  }}
                                >
                                  <BiInfoCircle
                                    style={{
                                      fontSize: "16px",
                                      outline: "none",
                                    }}
                                    data-tip
                                    data-for="BidDate"
                                    data-event-off
                                    data-class={`${Styles.ipotooltip}`}
                                    data-title=""
                                    src={
                                      process.env.REACT_APP_STATIC_URL +
                                      "media/DMF/information.png"
                                    }
                                  />
                                </sup>
                                <Info
                                  className={`${Styles.ipotooltip}`}
                                  id="BidDate"
                                  place="top"
                                >
                                  <InfoMessage>
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Aspernatur, similique.
                                  </InfoMessage>
                                </Info>
                              </div>
                              <span className="Value">Jan 27 - Jan 31</span>
                            </>
                          )}
                        </div>

                        {/* <div className="Sample">
                         <div className="in-options-title">
                           <span className="fordesktop">1 DAY</span>
                           <span className="formobile">1 D</span>
                         </div>
                         <div className="Value">
                           <span
                             style={{
                               color: stock.dayChangeP < 0 ? "red" : "green",
                             }}
                           >
                             {stock.dayChangeP && stock.dayChangeP.toFixed(2)}%
                           </span>
                         </div>
                       </div> */}
                        {/* <div className="Sample">
                         <div className="in-options-title">
                           <span className="fordesktop">1 MONTH</span>
                           <span className="formobile">1 M</span>
                         </div>
                         <div className="Value">
                           <span
                             style={{
                               color: stock.dayChangeP < 0 ? "red" : "green",
                             }}
                           >
                             {stock.dayChangeP && stock.dayChangeP.toFixed(2)}%
                           </span>
                         </div>
                       </div> */}
                        <div className="Sample">
                          {tabIndex != 6 ? (
                            <>
                              <div className="in-options-title">
                                <span className="fordesktop">1 MONTH</span>
                                <span className="formobile">1 M</span>
                              </div>
                              <div className="Value">
                                {stock.monthChangeP &&
                                  stock.monthChangeP.toFixed(2)}
                                %
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="in-options-title">
                                <span className="fordesktop">
                                  Price Range{" "}
                                  <sup
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "3px",
                                    }}
                                  >
                                    <BiInfoCircle
                                      style={{
                                        fontSize: "16px",
                                        outline: "none",
                                      }}
                                      data-tip
                                      data-for="PriceRange"
                                      data-event-off
                                      data-class={`${Styles.ipotooltip}`}
                                      data-title=""
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/DMF/information.png"
                                      }
                                    />
                                  </sup>
                                  <Info
                                    className={`${Styles.ipotooltip}`}
                                    id="PriceRange"
                                    place="top"
                                  >
                                    <InfoMessage>
                                      Lorem ipsum dolor sit amet consectetur
                                      adipisicing elit. Aspernatur, similique.
                                    </InfoMessage>
                                  </Info>
                                </span>
                                <span className="formobile">
                                  Price Range{" "}
                                  <sup
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "3px",
                                    }}
                                  >
                                    <BiInfoCircle
                                      style={{
                                        fontSize: "16px",
                                        outline: "none",
                                      }}
                                      data-tip
                                      data-for="LotSize"
                                      data-event-off
                                      data-class={`${Styles.ipotooltip}`}
                                      data-title=""
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/DMF/information.png"
                                      }
                                    />
                                  </sup>
                                  <Info
                                    className={`${Styles.ipotooltip}`}
                                    id="LotSize"
                                    place="top"
                                  >
                                    <InfoMessage>
                                      Lorem ipsum dolor sit amet consectetur
                                      adipisicing elit. Aspernatur, similique.
                                    </InfoMessage>
                                  </Info>
                                </span>
                              </div>
                              <div className="Value">₹ 38 - ₹ 40</div>
                            </>
                          )}
                        </div>
                        <div className="Sample">
                          {tabIndex != 6 ? (
                            <>
                              <div className="in-options-title">
                                <span className="fordesktop">1 YEAR</span>
                                <span className="formobile">1 Y</span>
                              </div>
                            </>
                          ) : (
                            <div className="in-options-title">
                              <span className="fordesktop">
                                Lot Size{" "}
                                <sup
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "3px",
                                  }}
                                >
                                  <BiInfoCircle
                                    style={{
                                      fontSize: "16px",
                                      outline: "none",
                                    }}
                                    data-tip
                                    data-for="LotSize"
                                    data-event-off
                                    data-class={`${Styles.ipotooltip}`}
                                    data-title=""
                                    src={
                                      process.env.REACT_APP_STATIC_URL +
                                      "media/DMF/information.png"
                                    }
                                  />
                                </sup>
                                <Info
                                  className={`${Styles.ipotooltip}`}
                                  id="LotSize"
                                  place="top"
                                >
                                  <InfoMessage>
                                    A range of price within which you can place
                                    your bid.
                                  </InfoMessage>
                                </Info>
                              </span>
                              <span className="formobile">
                                Lot Size{" "}
                                <sup
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "3px",
                                  }}
                                >
                                  <BiInfoCircle
                                    style={{
                                      fontSize: "16px",
                                      outline: "none",
                                    }}
                                    data-tip
                                    data-for="LotSize"
                                    data-event-off
                                    data-class={`${Styles.ipotooltip}`}
                                    data-title=""
                                    src={
                                      process.env.REACT_APP_STATIC_URL +
                                      "media/DMF/information.png"
                                    }
                                  />
                                </sup>
                                <Info
                                  className={`${Styles.ipotooltip}`}
                                  id="LotSize"
                                  place="top"
                                >
                                  <InfoMessage>
                                    A range of price within which you can place
                                    your bid.
                                  </InfoMessage>
                                </Info>
                              </span>
                            </div>
                          )}
                          <div className="Value">3000</div>
                        </div>
                        {tabIndex != 6 ? (
                          <>
                            <div className="Sample">
                              <div className="in-options-title">PE</div>
                              <div className="Value">
                                {stock.pe && stock.pe.toFixed(2)}
                              </div>
                            </div>
                          </>
                        ) : null}
                        {tabIndex != 6 ? (
                          <>
                            <div className="Sample MarketDesktop">
                              <div className="in-options-title">
                                MARKET CAP (Cr.)
                              </div>
                              <div className="Value">
                                <span className="currencySymbol">₹&nbsp;</span>
                                {numberFormat(
                                  stock.mcapQ && stock.mcapQ.toFixed(2)
                                )}
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div
                      className={`col-12 col-md-2 d-flex float-end  ${tabIndex != 6 ? "justify-content-end" : ""
                        } `}
                    >
                      <div className="Sample MarketMobile">
                        <div className="in-options-title">Market cap (Cr.)</div>
                        <div className="Value">
                          <span className="currencySymbol">₹&nbsp;</span>
                          {numberFormat(stock.mcapQ && stock.mcapQ.toFixed(2))}
                        </div>
                      </div>
                      {tabIndex != 6 ? (
                        <>
                          <div className="Sample explore-for-desktop d-flex">
                            {userId && Boolean(userId) ? (
                              <div className="explore-now-bx">
                                <Link
                                  className="explore-now"
                                  onClick={() => smallcase(stock.nseCode)}
                                // to={`/stocks/details?stock_code=${stock.nseCode}`}
                                >
                                  Trade
                                </Link>
                                <br></br>
                              </div>
                            ) : (
                              <div className="explore-now-bx">
                                <Link
                                  className="explore-now"
                                  onClick={() => smallcaseWthoutLogin()}
                                // to={`/stocks/details?stock_code=${stock.nseCode}`}
                                >
                                  Trade
                                </Link>
                              </div>
                            )}
                            <div className="ps-4">
                              <Link
                                to={`${process.env.PUBLIC_URL}/stocks/details?stock_code=${stock.nseCode}`}
                              >
                                <ExploreStock width="17px" />
                              </Link>
                              {/* <Link
                             className="explore-now"
                             to={`/stocks/details?stock_code=${stock.nseCode}`}
                           >
                             Explore
                           </Link> */}
                            </div>
                            <div className="WishList ps-4 ">
                              {/* <a
                           className=""
                           onClick={() => handledeleteWatchlist('add',stock.nseCode)}
                           //to={`/stocks/details?stock_code=${stock.nseCode}`}
                         >
                           <BooKMarkStock
                             style={{
                               width: "17px",
                             }}
                           />
                         </a> */}
                              {userId && Boolean(userId) ? (
                                stock.userId == userId ? (
                                  <a
                                    onClick={() =>
                                      handledeleteWatchlist(
                                        "delete",
                                        stock.nseCode
                                      )
                                    }
                                  >
                                    {" "}
                                    <img
                                      style={{ width: "17px" }}
                                      src={bookmark_alternative}
                                      title="Delete from Watchlist"
                                    />
                                  </a>
                                ) : (
                                  <a
                                    onClick={() =>
                                      handledeleteWatchlist(
                                        "add",
                                        stock.nseCode
                                      )
                                    }
                                  >
                                    {" "}
                                    <img
                                      style={{ width: "17px" }}
                                      src={bookmark}
                                      title=" Add to Watchlist"
                                    />
                                  </a>
                                )
                              ) : (
                                <a
                                  onClick={() => {
                                    loginRedirectGuest();
                                  }}
                                >
                                  <img
                                    style={{ width: "17px" }}
                                    src={bookmark}
                                    title="Add to Watchlist"
                                  />
                                </a>
                              )}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="Sample explore-for-desktop d-flex">
                            <div className="explore-now-bx">
                              <Link
                                className="explore-now "
                                to={
                                  process.env.PUBLIC_URL +
                                  "/stocks/ipo-details/"
                                }
                              >
                                Invest
                              </Link>
                            </div>
                            <div className="ps-4">
                              <Link
                              // to={`${process.env.PUBLIC_URL}/stocks/details?stock_code=${stock.nseCode}`}
                              >
                                <ExploreStock width="17px" />
                              </Link>
                              {/* <Link
                             className="explore-now"
                             to={`/stocks/details?stock_code=${stock.nseCode}`}
                           >
                             Explore
                           </Link> */}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="col-12 col-md-2">
                      <div className=" explore-for-mobile d-flex float-end justify-content-end">
                        {/* <div className="Watchlist">
                       <Link
                         className=""
                         to={`/stocks/details?stock_code=${stock.nseCode}`}
                       >
                         <img
                           style={{
                             width: "16px",
                           }}
                           src={Watchlist}
                         />
                       </Link>
                     </div> */}

                        {/* <div>
                     <Link
                       className="explore-now"
                       to={`/stocks/details?stock_code=${stock.nseCode}`}
                     >
                       Trade
                     </Link>
                     </div>
                     <div>
                       <Link to={`/stocks/details?stock_code=${stock.nseCode}`}>
                         <img
                           style={{
                             width: "30px",
                             height: "30px",
                           }}
                           className="ExploreBtn"
                           src={Explore}
                         />
                       </Link>
                       <Link
                             className="explore-now"
                             to={`/stocks/details?stock_code=${stock.nseCode}`}
                           >
                             Explore
                           </Link>
                     </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {errorMsg.length > 0 && (
              <div className="item-continer-bx stock-container">
                <div className="row item-continer-row">
                  <div className="text-center">
                    <strong>{errorMsg}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="item-list">
            {errorMsg.length == 0 &&
              Array.isArray(ipoData) && ipoData.length > 0 ? (
              ipoData.slice(0, 10).map((stock) => (
                <div key={'fn-' + stock.fin_code + stock.ipo_code} className="item-continer-bx stock-container">
                  <div className="row item-continer-row">
                    <div
                      className={`col-12 ${tabIndex != 6 ? "col-md-3" : "col-md-4"
                        }`}
                    >
                      <div className="item-title-container">
                        <div className="Stock_Img">
                          <img
                            className="imgC"
                            src={stocks_icon}
                            alt="stock Blue"
                          />
                        </div>
                        <div className="item-title-parent stock-item-list">
                          <div className="item-title">
                            <Link
                              to={
                                process.env.PUBLIC_URL +
                                "/stocks/ipo-details/" + stock.ipo_code
                              }
                            >
                              {stock.company_name}
                            </Link>
                          </div>

                        </div>
                      </div>
                    </div>
                    <div
                      className={`col-12 ${tabIndex != 6 ? "col-md-7" : "col-md-6"
                        }`}
                    >
                      <div className="item-side-options">
                        <div className="Sample">
                          {tabIndex != 6 ? (
                            <>
                              <div className="in-options-title">
                                PRICE (1 D){" "}
                              </div>
                              <div className="Value">
                                <span className="currencySymbol">₹&nbsp; </span>
                                {numberFormat(
                                  stock.currentPrice &&
                                  stock.currentPrice.toFixed(2)
                                )}{" "}
                                <span className="Value">
                                  <span
                                    style={{
                                      color:
                                        stock.dayChangeP < 0
                                          ? "red"
                                          : "green" && stock.dayChangeP == 0
                                            ? "black"
                                            : "green",
                                    }}
                                  >
                                    (
                                    {stock.dayChangeP &&
                                      stock.dayChangeP.toFixed(2)}
                                    %)
                                  </span>
                                </span>
                                <span style={{ color: "#ff7f10" }}></span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="in-options-title">
                                Biding Dates{" "}
                                <sup
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "3px",
                                  }}
                                >
                                  <BiInfoCircle
                                    style={{
                                      fontSize: "16px",
                                      outline: "none",
                                    }}
                                    data-tip
                                    data-for="BidDate"
                                    data-event-off
                                    data-class={`${Styles.ipotooltip}`}
                                    data-title=""
                                    src={
                                      process.env.REACT_APP_STATIC_URL +
                                      "media/DMF/information.png"
                                    }
                                  />
                                </sup>
                                <Info
                                  className={`${Styles.ipotooltip}`}
                                  id="BidDate"
                                  place="top"
                                >
                                  <InfoMessage>
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Aspernatur, similique.
                                  </InfoMessage>
                                </Info>
                              </div>
                              <span className="Value" style={{ color: "#7f7f7f" }}>
                                {new Date(stock.open_date).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}{" "}
                                -&nbsp;
                                {new Date(stock.close_date).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                            </>
                          )}
                        </div>

                        {/* <div className="Sample">
                        <div className="in-options-title">
                          <span className="fordesktop">1 DAY</span>
                          <span className="formobile">1 D</span>
                        </div>
                        <div className="Value">
                          <span
                            style={{
                              color: stock.dayChangeP < 0 ? "red" : "green",
                            }}
                          >
                            {stock.dayChangeP && stock.dayChangeP.toFixed(2)}%
                          </span>
                        </div>
                      </div> */}
                        {/* <div className="Sample">
                        <div className="in-options-title">
                          <span className="fordesktop">1 MONTH</span>
                          <span className="formobile">1 M</span>
                        </div>
                        <div className="Value">
                          <span
                            style={{
                              color: stock.dayChangeP < 0 ? "red" : "green",
                            }}
                          >
                            {stock.dayChangeP && stock.dayChangeP.toFixed(2)}%
                          </span>
                        </div>
                      </div> */}
                        <div className="Sample">
                          {tabIndex != 6 ? (
                            <>
                              <div className="in-options-title">
                                <span className="fordesktop">1 MONTH</span>
                                <span className="formobile">1 M</span>
                              </div>
                              <div className="Value">
                                {stock.monthChangeP &&
                                  stock.monthChangeP.toFixed(2)}
                                %
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="in-options-title">
                                <span className="fordesktop">
                                  Price Range{" "}
                                  <sup
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "3px",
                                    }}
                                  >
                                    <BiInfoCircle
                                      style={{
                                        fontSize: "16px",
                                        outline: "none",
                                      }}
                                      data-tip
                                      data-for="PriceRange"
                                      data-event-off
                                      data-class={`${Styles.ipotooltip}`}
                                      data-title=""
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/DMF/information.png"
                                      }
                                    />
                                  </sup>
                                  <Info
                                    className={`${Styles.ipotooltip}`}
                                    id="PriceRange"
                                    place="top"
                                  >
                                    <InfoMessage>
                                      Lorem ipsum dolor sit amet consectetur
                                      adipisicing elit. Aspernatur, similique.
                                    </InfoMessage>
                                  </Info>
                                </span>
                                <span className="formobile">
                                  Price Range{" "}
                                  <sup
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "3px",
                                    }}
                                  >
                                    <BiInfoCircle
                                      style={{
                                        fontSize: "16px",
                                        outline: "none",
                                      }}
                                      data-tip
                                      data-for="LotSize"
                                      data-event-off
                                      data-class={`${Styles.ipotooltip}`}
                                      data-title=""
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/DMF/information.png"
                                      }
                                    />
                                  </sup>
                                  <Info
                                    className={`${Styles.ipotooltip}`}
                                    id="LotSize"
                                    place="top"
                                  >
                                    <InfoMessage>
                                      Lorem ipsum dolor sit amet consectetur
                                      adipisicing elit. Aspernatur, similique.
                                    </InfoMessage>
                                  </Info>
                                </span>
                              </div>
                              <div className="Value" style={{ color: "#7f7f7f" }}>
                                {/* {indianRupeeFormat(stock.issue_price1) + "-" + indianRupeeFormat(stock.issue_price2)} */}
                                {indianRupeeFormat(stock.issue_price1).replace("₹", "₹ ").replace(/\.00$/, "") + " - " + indianRupeeFormat(stock.issue_price2).replace("₹", "₹ ").replace(/\.00$/, "")}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="Sample">
                          {tabIndex != 6 ? (
                            <>
                              <div className="in-options-title">
                                <span className="fordesktop">1 YEAR</span>
                                <span className="formobile">1 Y</span>
                              </div>
                            </>
                          ) : (
                            <div className="in-options-title">
                              <span className="fordesktop">
                                Lot Size{" "}
                                <sup
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "3px",
                                  }}
                                >
                                  <BiInfoCircle
                                    style={{
                                      fontSize: "16px",
                                      outline: "none",
                                    }}
                                    data-tip
                                    data-for="LotSize"
                                    data-event-off
                                    data-class={`${Styles.ipotooltip}`}
                                    data-title=""
                                    src={
                                      process.env.REACT_APP_STATIC_URL +
                                      "media/DMF/information.png"
                                    }
                                  />
                                </sup>
                                <Info
                                  className={`${Styles.ipotooltip}`}
                                  id="LotSize"
                                  place="top"
                                >
                                  <InfoMessage>
                                    A range of price within which you can place
                                    your bid.
                                  </InfoMessage>
                                </Info>
                              </span>
                              <span className="formobile">
                                Lot Size{" "}
                                <sup
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "3px",
                                  }}
                                >
                                  <BiInfoCircle
                                    style={{
                                      fontSize: "16px",
                                      outline: "none",
                                    }}
                                    data-tip
                                    data-for="LotSize"
                                    data-event-off
                                    data-class={`${Styles.ipotooltip}`}
                                    data-title=""
                                    src={
                                      process.env.REACT_APP_STATIC_URL +
                                      "media/DMF/information.png"
                                    }
                                  />
                                </sup>
                                <Info
                                  className={`${Styles.ipotooltip}`}
                                  id="LotSize"
                                  place="top"
                                >
                                  <InfoMessage>
                                    A range of price within which you can place
                                    your bid.
                                  </InfoMessage>
                                </Info>
                              </span>
                            </div>
                          )}
                          <div className="Value" style={{ color: "#7f7f7f" }}>{stock.min_quantity}</div>
                        </div>

                      </div>
                    </div>
                    <div
                      className={`col-12 col-md-2 d-flex float-end  ${tabIndex != 6 ? "justify-content-end" : ""
                        } `}
                    >
                      <div className="Sample MarketMobile">
                        <div className="in-options-title">Market cap (Cr.)</div>
                        <div className="Value">
                          <span className="currencySymbol">₹&nbsp;</span>
                          {/* {numberFormat(stock.mcapQ && stock.mcapQ.toFixed(2))} */}
                        </div>
                      </div>

                      <>
                        <div className="Sample explore-for-desktop d-flex">
                          <div className="explore-now-bx">
                            <Link
                              className={`explore-now ${ipodisabled ? "disabled" : null}`}
                              to={
                                process.env.PUBLIC_URL +
                                "/stocks/ipo-details/" + stock.ipo_code
                              }
                            >
                              Invest
                            </Link>
                          </div>
                          <div className="ps-4">
                            <Link
                              to={
                                process.env.PUBLIC_URL +
                                "/stocks/ipo-details/" + stock.ipo_code
                              }
                            // to={`${process.env.PUBLIC_URL}/stocks/details?stock_code=${stock.nseCode}`}
                            >
                              <ExploreStock width="17px" />
                            </Link>
                            {/* <Link
                            className="explore-now"
                            to={`/stocks/details?stock_code=${stock.nseCode}`}
                          >
                            Explore
                          </Link> */}
                          </div>
                        </div>
                      </>

                    </div>
                    <div className="col-12 col-md-2">
                      <div className=" explore-for-mobile d-flex float-end justify-content-end">
                        {/* <div className="Watchlist">
                      <Link
                        className=""
                        to={`/stocks/details?stock_code=${stock.nseCode}`}
                      >
                        <img
                          style={{
                            width: "16px",
                          }}
                          src={Watchlist}
                        />
                      </Link>
                    </div> */}

                        {/* <div>
                    <Link
                      className="explore-now"
                      to={`/stocks/details?stock_code=${stock.nseCode}`}
                    >
                      Trade
                    </Link>
                    </div>
                    <div>
                      <Link to={`/stocks/details?stock_code=${stock.nseCode}`}>
                        <img
                          style={{
                            width: "30px",
                            height: "30px",
                          }}
                          className="ExploreBtn"
                          src={Explore}
                        />
                      </Link>
                      <Link
                            className="explore-now"
                            to={`/stocks/details?stock_code=${stock.nseCode}`}
                          >
                            Explore
                          </Link>
                    </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                //   </div>
                // </div>
              ))
            ) : (
              <div className="item-continer-bx stock-container" style={{ textAlign: "center" }}>
                <h6>No record found!</h6>
              </div>
            )}

            {errorMsg.length > 0 && (
              <div className="item-continer-bx stock-container">
                <div className="row item-continer-row">
                  <div className="text-center">
                    <strong>{errorMsg}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <br />
        <div className="overflow-auto float-end" style={{ display: tabIndex != 6 ? "" : "none" }}>
          {Array.isArray(stockList) && pageCount > 0 && (
            <ReactPaginate
              previousLabel="&laquo;"
              nextLabel="&raquo;"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName="pagination mypagination"
              activeClassName="active"
            />
          )}

          {/* {Array.isArray(ipoData) && pageCount > 0 && (
            <ReactPaginate
              previousLabel="&laquo;"
              nextLabel="&raquo;"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName="pagination mypagination"
              activeClassName="active"
            />
          )} */}
        </div>


        <br />
      </div>

      {/* desktop filter */}
      <SlidingPanel
        className="Filter_Panel"
        type={"right"}
        isOpen={openPanel}
        size={sidePanelWidth}
      >
        {/* <hr /> */}
        <form id="FilterData" className="d-flex flex-column">
          <div className="ps-3 pe-3 pt-3">
            <div className="SideBar_Filter">
              <div className="filter_text">
                <h4>Filters</h4>
              </div>
              <div>
                <button type="button" onClick={() => setOpenPanel(false)}>
                  <img src={CloseFilter} alt="" srcset="" />
                </button>
              </div>
            </div>
            <div style={{ marginTop: "1rem" }} className="Line"></div>
          </div>
          <div className="p-3" style={{ flexGrow: "1", overflow: "auto" }}>
            <div className="fltr-section desktop-view-none">
              {/* desktop filters */}
              <h4>Sort</h4>
              <div className="fund_Option">
                <ul className="fltr-items">
                  {sortOptions.map((v) => (
                    <li className="fltr-items-li">
                      <div className="chk-item-bx">
                        <FintooCheckbox
                          checked={v.value == params.sort}
                          title={v.label}
                          onChange={() => toggleSort(v.value)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="fltr-section NSEBSE remove-border-li">
              <div className="fltr-section">
                <h4>Select Exchange</h4>
                <div className="Category_Filter">
                  <ul className="fltr-items">
                    {categories.map((v) => (
                      <li className="fltr-items-li">
                        <FintooCheckbox
                          checked={
                            catName.toLocaleLowerCase() == v.toLocaleLowerCase()
                          }
                          title={v}
                          onChange={() =>
                            toggleInnerIndexCheckbox(v.toLowerCase())
                          }
                        />
                        {/* <input type="checkbox" name="Equity" value="Equity" id="" onChange={handleCategoryChange} /> <span>Equity</span> */}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div style={{ marginTop: "1rem" }} className="Line"></div>

              <>
                <h4 className="Filterhead">Choose Index</h4>
                <div className="fltr-section">
                  <div className="SubCategory_Filter">
                    <div className="fund_options ">
                      {/* {indexdata.filter((v) => (catName == "all" || v["NSE/BSE"].toLowerCase() == catName.toLowerCase())).map((v) => ( */}
                      {Array.isArray(indexdata) &&
                        indexdata.map((v) => (
                          <h4>
                            <div className="fltr-items-li">
                              <div className="subcat-dv">
                                <FintooCheckbox
                                  checked={
                                    selectedIndex == v.filter.toLowerCase()
                                  }
                                  title={v.filter}
                                  onChange={() => {
                                    if (
                                      v.filter.toLowerCase() == selectedIndex
                                    ) {
                                      setSelectedIndex("");
                                    } else {
                                      setSelectedIndex(v.filter.toLowerCase());
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </h4>
                        ))}
                    </div>
                  </div>
                </div>
              </>

              <br />

              <h4 className="Filterhead">Sectors</h4>
              <div className="fund_options st-filter-list">
                {Array.isArray(stockFilteredData) &&
                  stockFilteredData.map((stock) => (
                    <>
                      <h4 style={{ fontSize: "1em", fontWeight: "500" }}>
                        <FintooCheckbox
                          title={stock.sector}
                          checked={sectorname == stock.sector}
                          onChange={() => {
                            toggleInnerSectorCheckbox(stock.sector);
                          }}
                        />
                      </h4>
                      <div className="FilterData">
                        {sectorname == stock.sector && (
                          <div className="my-3 ml-5 category_filter">
                            {Array.isArray(industryFilteredData) &&
                              industryFilteredData.map((industry) => (
                                <div className="mx-4 my-3">
                                  <div className="flex items-center">
                                    <FintooSubCheckbox
                                      title={industry}
                                      //title={`${v} - option ${x}`}
                                      checked={
                                        industryname.indexOf(industry) > -1
                                      }
                                      onChange={() => {
                                        toggleInnerIndustryCheckbox(industry);
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </>
                  ))}
              </div>
            </div>
          </div>

          <div className="p-3 Filter_Btn_panel">
            <div>
              <button type="button" onClick={applyFilter} className="apply_btn">
                Apply
              </button>
            </div>
            <div className="reset_btn">
              <button className="Reset" type="button" onClick={resetForm}>
                Reset All
              </button>
            </div>
          </div>
        </form>
      </SlidingPanel>
      <br />
    </>

  );
}

const mapStateToProps = (state) => ({
  loggedIn: state.loggedIn,
});

export default connect(mapStateToProps)(StockList);
