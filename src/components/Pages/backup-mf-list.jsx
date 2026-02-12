import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "jquery/dist/jquery";
// import "bootstrap/dist/js/bootstrap.min.js";
import "../Boostarp.css";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
// import Fund_Details from "../Fund_Details/Fund_Details";
import SlidingPanel from "react-sliding-side-panel";

import SweetPagination from "sweetpagination";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import stockBlue from "../Assets/02_All_stocks_Blue.svg";
import stockWhite from "../Assets/01_All_stocks_white.png";
import gainWhite from "../Assets/02_top_gainer_white.png";
import gainBlue from "../Assets/02_top_gainer_blue.png";
import topLoser from "../Assets/03_top_losers_white.png";
import topLoserBlue from "../Assets/03_top_losers_blue.png";
import WeekHighBlue from "../Assets/02_52_Week_High_blue.png";
import WeekLow from "../Assets/01_52_Week_Low_white.png";
import WeekLowBlue from "../Assets/02_52_Week_High_low_blue.png";
import WeekHigh from "../Assets/01_52_Week_High.png";
import WatchList from "../Assets/03_watchlist_white.png";
import arrow from "../Assets/arrow.png";
import Home from "../Assets/home.png";
import Rupee from "../Assets/Rupee.png";
import filter_menu from "../Assets/filter_menu.png";
import hdfc from "../Assets/hdfc.png";
import icici from "../Assets/01_icici.png";
import star from "../Assets/star.png";
import Search from "../Assets/search.svg";
import Filter from "../Assets/filter-icon.svg";
import Explore from "../Assets/Explore.svg";
import AMC from "../Assets/AMC.png";
// import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import CompareSelectBox from "../Compare/CompareSelectBox";
import { FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import { BiFilter } from "react-icons/bi"
import ReactPaginate from 'react-paginate';
import Link from "../MainComponents/Link";
import { ReactComponent as SearchIo } from '../Assets/loupe-_1_.svg';
import CloseFilter from '../../Assets/Images/close.png';

import FintooLoader from "../FintooLoader";
import FintooInlineLoader from "../FintooInlineLoader";

import { IoClose } from "react-icons/io5";
import FintooCheckbox from "../FintooCheckbox/FintooCheckbox";

import MainLayout from "../Layout/MainLayout";

import Select from "react-select";
import { DMF_BASE_URL } from "../../constants";

const categories = ['Equity', 'Debt', 'Hybrid', 'Other'];
const subcategories = ['Large Cap', 'Mid Cap', 'Small Cap', 'Multi Cap', 'Focused', 'Yield', 'Value', 'Sector', 'ELSS'];
const fundOptionList = ['Growth', 'Dividend'];

export default function MutualFundList({ options, callback }) {
  // start pagination
  const navigate = useNavigate();
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0)
  const [mutualfundlist, setMutualFundList] = useState([])
  const [txtvalue, setTxtvalue] = useState("");
  const [catName, setCategory] = useState([]);
  const [subcatName, setSubCategory] = useState([]);
  const [applyFilters, setFilters] = useState([]);
  const [subFilters, setSubFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedFirstTime, setLoadedFirstTime] = useState(false);

  const [selected, setSelected] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [tabName, setTabName] = useState("All");
  const [inlineLoader, setInlineLoader] = useState(false);
  const [fundOptions, setFundOptions] = useState([]);
  const [sidePanelWidth, setSidePanelWidth] = useState(30);
  const [selectedSort, setSelectedSort] = useState("");

  useEffect(() => {
    fetchMutualFundData();
  }, []);

  useEffect(() => {

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


  React.useEffect(() => {
    const category = applyFilters.join(',')
    const sub_category = subFilters.join(',')
    switch (tabName) {
      case "All":
        if (category != '') {
          const alldata = fetchMutualFundData(category, '');
        }
        if (sub_category != '') {
          const alldata = fetchMutualFundData('', sub_category);
        }
        if (sub_category != '' && category != '') {
          const alldata = fetchMutualFundData(category, sub_category);
        }
        else {
          const alldata = fetchMutualFundData();
        }
        break;
      case "Recommended":
        if (category != '') {
          const recommdata = fetchRecommendFund(category);
        }
        if (sub_category != '') {
          const recommdata = fetchRecommendFund('', sub_category);
        }
        if (sub_category != '' && category != '') {
          const recommdata = fetchRecommendFund(category, sub_category);
        }
        else {
          const recommdata = fetchRecommendFund();
        }
        break;
      case "Tax saver (ELSS)":
        if (category != '') {
          const taxsaverdata = fetchTaxSaverFund(category);
        }
        if (sub_category != '') {
          const taxsaverdata = fetchTaxSaverFund('', sub_category);
        }
        if (sub_category != '' && category != '') {
          const taxsaverdata = fetchTaxSaverFund(category, sub_category);
        }
        else { const taxsaverdata = fetchTaxSaverFund(); }
        break;
      case "NFO":
        if (category != '') {
          const nfodata = fetchNFOFund(category);
        }
        if (sub_category != '') {
          const nfodata = fetchNFOFund('', sub_category);
        }
        if (sub_category != '' && category != '') {
          const nfodata = fetchNFOFund(category, sub_category);
        }
        else {
          const taxsaverdata = fetchNFOFund();
        }
        break;
      case "Insta redeem":
        if (category != '') {
          const liquidfundata = fetchLiquidFund(category);
        }
        if (sub_category != '') {
          const liquidfundata = fetchLiquidFund('', sub_category);
        }
        if (sub_category != '' && category != '') {
          const liquidfundata = fetchLiquidFund(category, sub_category);
        }
        else {
          const liquidfundata = fetchLiquidFund();
        }
        break;
    }

  }, [tabName, applyFilters, subFilters]);


  const MUTUAL_FUND_DATA_API_URL = DMF_BASE_URL+'api/scheme/getschemelist';
  const WISHLIST_FUND_DATA_API_URL = DMF_BASE_URL+'api/wishlist/getwishlist';
  const fetchMutualFundData = (category, sub_category) => {


    if (loadedFirstTime == false) {
      setIsLoading(true);
      setLoadedFirstTime(true);
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 1, category_filter: category, sub_category_filter: sub_category })
    };
    showInlineLoading();
    fetch(MUTUAL_FUND_DATA_API_URL, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        const pagedata = data.page_count
        setPageCount(Math.ceil(pagedata / perPage))
        setMutualFundList([...data.data]);
        setIsLoading(false);
        hideInlineLoading();
      })
  }


  const fetchMutualFUnd = async (currentPage, searchValue) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: currentPage, search: searchValue })
    };
    var res1 = await fetch(MUTUAL_FUND_DATA_API_URL, requestOptions);
    var json = await res1.json();
    // 
    return json.data;

  };

  const fetchLiquidFundPage = async (currentPage) => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: currentPage, liquid_fund: 'liqdfund' })
    };
    var res1 = await fetch(MUTUAL_FUND_DATA_API_URL, requestOptions);
    var json = await res1.json();

    return json.data;

  };



  const handlePageClick = async (data) => {
    if (tabName == 'Insta redeem') {
      let currentPage = data.selected + 1;
      const commentsFormServer = await fetchLiquidFundPage(currentPage);
      // 
      setMutualFundList([...commentsFormServer]);
      // scroll to the top
      window.scrollTo(0, 0)
    }
    if (tabName == 'All') {
      let currentPage = data.selected + 1;
      const commentsFormServer = await fetchMutualFUnd(currentPage);
      // 
      setMutualFundList([...commentsFormServer]);
      // scroll to the top
      window.scrollTo(0, 0)
    }

  };
  
  
  

  const fetchSearchFund = async (keyword) => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ search: keyword })
    };
    var res1 = await fetch(MUTUAL_FUND_DATA_API_URL, requestOptions);
    var json = await res1.json();
    
    return json.data;

  };



  const fetchRecommendFund = (category, sub_category) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recommend: '1', category_filter: category, sub_category_filter: sub_category })
    };
    showInlineLoading();
    fetch(MUTUAL_FUND_DATA_API_URL, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        const pagedata = data.page_count
        setPageCount(Math.ceil(pagedata / perPage))
        setMutualFundList([...data.data]);
        hideInlineLoading();
      })
  }

  const fetchTaxSaverFund = (category, sub_category) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tax_saver: 'txsv', category_filter: category, sub_category_filter: sub_category })
    };
    showInlineLoading();
    fetch(MUTUAL_FUND_DATA_API_URL, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        const pagedata = data.page_count
        setPageCount(Math.ceil(pagedata / perPage));
        setMutualFundList([...data.data]);
        hideInlineLoading();
      })
  }

  const fetchNFOFund = (category, sub_category) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ NFO: 'nfo', category_filter: category, sub_category_filter: sub_category })
    };
    showInlineLoading();
    fetch(MUTUAL_FUND_DATA_API_URL, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        const pagedata = data.page_count
        setPageCount(Math.ceil(pagedata / perPage))
        setMutualFundList([...data.data]);
        hideInlineLoading();
      })
  }


  const fetchLiquidFund = (category, sub_category) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liquid_fund: 'liqdfund', category_filter: category, sub_category_filter: sub_category })
    };
    showInlineLoading();
    fetch(MUTUAL_FUND_DATA_API_URL, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        const pagedata = data.page_count
        setPageCount(Math.ceil(pagedata / perPage))
        setMutualFundList([...data.data]);
        hideInlineLoading();
      })
  }
  const fetchWishListFund = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: '1223' })
    };
    
    showInlineLoading();
    fetch(WISHLIST_FUND_DATA_API_URL, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setMutualFundList([...data.data]);
        hideInlineLoading();
      })


  }

  // For Side Panel
  const [openPanel, setOpenPanel] = useState(false);


  const [name, setName] = useState("");
  const [compareArray, setCompareArray] = useState([]);
  const [foundStocks, setFoundStocks] = useState(null);

  const filter = async (e) => {
    const keyword = e.target.value;
    setTxtvalue(keyword);
    if (keyword !== "" && keyword.length > 2) {
      const commentsFormServer = await fetchSearchFund(keyword);
      // 
      setFoundStocks(commentsFormServer);
    }
    setName(keyword);
  };
  
  // For Hovering Effect
  const [isHovering, setIsHovering] = useState(false);
  const [isHovering1, NewIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };
  const handleMouseOvernew = () => {
    NewIsHovering(true);
  };

  // For Pagination
  const [currentPageData, setCurrentPageData] = useState(new Array(5).fill());
  // Example items, to simulate fetching from another resources.
  const items = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29,
  ];


  React.useEffect(() => {
    const category = applyFilters.join(',')
    const sub_category = subFilters.join(',')
    switch (tabName) {
      case "All":
        if (category != '') {
          const alldata = fetchMutualFundData(category, '');
        }
        if (sub_category != '') {
          const alldata = fetchMutualFundData('', sub_category);
        }
        if (sub_category != '' && category != '') {
          const alldata = fetchMutualFundData(category, sub_category);
        }
        else {
          const alldata = fetchMutualFundData();
        }
        break;
      case "Recommended":
        if (category != '') {
          const recommdata = fetchRecommendFund(category);
        }
        if (sub_category != '') {
          const recommdata = fetchRecommendFund('', sub_category);
        }
        if (sub_category != '' && category != '') {
          const recommdata = fetchRecommendFund(category, sub_category);
        }
        else {
          const recommdata = fetchRecommendFund();
        }
        break;
      case "Tax saver (ELSS)":
        if (category != '') {
          const taxsaverdata = fetchTaxSaverFund(category);
        }
        if (sub_category != '') {
          const taxsaverdata = fetchTaxSaverFund('', sub_category);
        }
        if (sub_category != '' && category != '') {
          const taxsaverdata = fetchTaxSaverFund(category, sub_category);
        }
        else { const taxsaverdata = fetchTaxSaverFund(); }
        break;
      case "NFO":
        if (category != '') {
          const nfodata = fetchNFOFund(category);
        }
        if (sub_category != '') {
          const nfodata = fetchNFOFund('', sub_category);
        }
        if (sub_category != '' && category != '') {
          const nfodata = fetchNFOFund(category, sub_category);
        }
        else {
          const taxsaverdata = fetchNFOFund();
        }
        break;
      case "Insta redeem":
        if (category != '') {
          const liquidfundata = fetchLiquidFund(category);
        }
        if (sub_category != '') {
          const liquidfundata = fetchLiquidFund('', sub_category);
        }
        if (sub_category != '' && category != '') {
          const liquidfundata = fetchLiquidFund(category, sub_category);
        }
        else {
          const liquidfundata = fetchLiquidFund();
        }
        break;
      case "Wishlist":

        const wishlistdata = fetchWishListFund();
        break;
    }

  }, [tabName, applyFilters, subFilters])

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
    };
  });

  function select(event) {
    const value = event.target.textContent;
    callback(value);
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
  const [checked, setChecked] = useState(false);

  const handleChooseCompare = (v) => {
    // alert(v.id);
    var newArray = compareArray;
    if (newArray.findIndex((x) => x.scheme_code == v.scheme_code) > -1) {
      newArray.splice(newArray.indexOf(v), 1);
    } else {
      if (newArray.length < 3) {
        newArray.push(v);
      }
    }
    // alert(JSON.stringify(newArray));
    setCompareArray([...newArray]);
  }
  const handleTabChange = (v) => {
    setCompareArray([]);
    setTabName(v);
  }

  function handleCategoryChange(v) {
    var sc = [...catName];
    var index = sc.indexOf(v);
    
    if (index > -1) {
      sc.splice(index, 1);
    } else {
      sc.push(v);
    }
    setCategory([...sc]);
  }

  function handleSubCategoryChange(v) {
    var ssc = [...subcatName];
    var index = ssc.indexOf(v)
    if (index > -1) {
      ssc.splice(index, 1);
    } else {
      ssc.push(v);
    }
    setSubCategory([...ssc]);
  }

  function handleFundOptionChange(v) {
    var fo = [...fundOptions];
    var index = fo.indexOf(v);
    if (index > -1) {
      fo.splice(index, 1);
    } else {
      fo.push(v);
    }
    setFundOptions([...fo]);
  }

  function handleClick(e) {
    e.preventDefault();
    setOpenPanel(false);
    setFilters([...applyFilters, catName]);
    // setCategory([]);

    setSubFilters([...subFilters, subcatName]);
    // setSubCategory([]);
    
  }
  const showInlineLoading = () => {
    setMutualFundList([]);
    setPageCount(0);
    setInlineLoader(true);
  }
  const hideInlineLoading = () => {
    setInlineLoader(false);
  }
  const openComparePage = () => {
    var allSchemeCodes = compareArray.map((v) => v.scheme_code);
    
    navigate("/direct-mutual-fund/Compare?schemes=" + allSchemeCodes.join(","));

  }

 

  return (
    <MainLayout>
      <FintooLoader isLoading={isLoading} />

      <div className="Stock_Details container">

        <Tabs style={{ marginTop: "1rem" }}>
          <div className="Stock_Header1">
            <TabList className="react-tabs__tab-list top-nav-menu">
              <Tab className="TabHeader" onClick={() => handleTabChange("All")}>
                <div className="top-menu-li-item">
                  <div className="imgC" style={{ paddingRight: "10px" }}>
                    <img src={stockWhite} alt="All" />
                  </div>
                  <div className="header-tab-title"> All</div>
                </div>
              </Tab>
              <Tab className="TabHeader" onClick={() => handleTabChange("Recommended")}>
                <div className="top-menu-li-item">
                  <div className="imgC" style={{ paddingRight: "10px" }}>
                    <img className="imgC" src={gainWhite} alt="Recommended" />
                  </div>
                  <div className="header-tab-title"> Recommended</div>
                </div>
              </Tab>

              <Tab className="TabHeader" onClick={() => handleTabChange("Tax saver (ELSS)")}>
                <div className="top-menu-li-item">
                  <div className="imgC" style={{ paddingRight: "10px" }}>
                    <img className="imgC" src={topLoser} alt="Tax saver (ELSS)" />
                  </div>
                  <div className="header-tab-title"> Tax saver (ELSS)</div>
                </div>
              </Tab>

              <Tab className="TabHeader" onClick={() => handleTabChange("Insta redeem")}>
                <div className="top-menu-li-item">
                  <div className="imgC" style={{ paddingRight: "10px" }}>
                    <img className="imgC" src={WeekHigh} alt="Insta redeem" />
                  </div>
                  <div className="header-tab-title"> Insta redeem</div>
                </div>
              </Tab>

              <Tab className="TabHeader" onClick={() => handleTabChange("NFO")}>
                <div className="top-menu-li-item">
                  <div className="imgC" style={{ paddingRight: "10px" }}>
                    <img className="imgC" src={WeekLow} alt="NFO" />
                  </div>
                  <div className="header-tab-title"> NFO</div>
                </div>
              </Tab>

              <Tab className="TabHeader" onClick={() => handleTabChange("Wishlist")}>
                <div className="top-menu-li-item">
                  <div className="imgC" style={{ paddingRight: "10px" }}>
                    <img className="imgC" src={WatchList} alt="Wishlist" />
                  </div>
                  <div className="header-tab-title"> Wishlist</div>
                </div>
              </Tab>
            </TabList>
          </div>
        </Tabs>
        {/* <p>{JSON.stringify(mutualfundlist)}</p> */}

        <div className="Stock_Search">



          <div className="searchbar-desktop">
            <div className="row ">



              <div className="col-12 col-md-3 tab-header-bx">
                <div style={{ marginTop: "0.5rem" }}>
                  <h4>
                    <span>
                      <img className="imgC" src={stockBlue} alt={tabName} style={{ width: '30px' }} />
                    </span>
                    <span> {tabName}</span>
                  </h4>
                </div>
              </div>
              <div className="col-10 col-md-6">
                <div className="Second">
                  <div className="search-box-container">
                    <input
                      type="text"
                      name=""
                      id="search-text"
                      placeholder="Search Fund"
                      value={txtvalue}
                      onChange={filter}
                      onClick={handleMouseOvernew}
                      tabIndex={0}
                      onFocus={expand}
                      className="autocomplete-text"
                    />

                    {txtvalue.length == 0 && (
                      <span className="cr-pointer" onClick={() => document.getElementById("search-text").focus()}>
                        <SearchIo width={"1.2em"} height={"1.2em"} />
                      </span>
                    )}
                    {txtvalue.length > 0 && (
                      <span
                        className="clear-input"
                        onClick={() => {
                          setTxtvalue("");
                          setFoundStocks(null);
                          setExpanded(false);
                        }}
                      >
                        <IoClose />
                      </span>
                    )}
                  </div>
                  {expanded ? (
                    <div className="user-list mf-autocomplete" ref={eleh2}>
                      {foundStocks == null && <h6>Start typing...</h6>}
                      {Array.isArray(foundStocks) &&
                        foundStocks.length == 0 && <h6>No results found!</h6>}
                      {Array.isArray(foundStocks) && foundStocks.length > 0 && (
                        foundStocks.map((stcoks) => (
                          <a
                            style={{ color: "gray", cursor: "pointer" }}
                            key={stcoks.scheme_code}
                            href="#"
                          >

                            <div
                              className="user "
                            // onMouseOut={handleMouseOut}
                            >
                              {/* <span className="user-id">{stcoks.id}</span> */}
                              <div className="user-name">{stcoks.scheme_name}</div>
                              <div className="user-Price">
                                <div className="mf-nv-rt">
                                  <p>NAV</p>
                                  <p>{stcoks.nav}</p>
                                </div>
                                <div className="mf-nv-lt">
                                  <p>1D</p>
                                  <p>{stcoks.net_change}</p>
                                </div>

                              </div>
                            </div>
                            {/* {isHovering && (
                              <div
                                key={stcoks.id}
                                // onMouseOver={handleMouseOver}
                                className="Search_tab"
                              >
                                <ul>
                                  <li>
                                    <Link to="/MutualFund">Overview</Link>
                                  </li>
                                  <li>
                                    <Link to="/MutualFund">Fund Details</Link>
                                  </li>
                                  <li>
                                    <Link to="/MutualFund">Compare</Link>
                                  </li>
                                  <li>
                                    <Link to="/MutualFund">Allocation</Link>
                                  </li>
                                  <li>
                                    <Link to="/MutualFund">Top Holdings</Link>
                                  </li>
                                  <li>
                                    <Link to="/Fund">Risk Measures</Link>
                                  </li>
                                </ul>
                              </div>
                            )} */}
                          </a>
                        ))
                      )}
                    </div>
                  ) : null}
                </div>

              </div>
              <div className="col-2 col-md-3">
                <div className="row fintoo-filter-buttons">
                  <div className="col-6 ">
                    <Select
                      classNamePrefix="sortSelect"
                      options={[
                        { value: "1d", label: "1 Day" },
                        { value: "1m", label: "1 Month" },
                        { value: "1Y", label: "1 Year" },
                      ]}
                    />
                  </div>
                  <div className="col-md-6">

                    <button
                      onClick={() => setOpenPanel(true)}
                      className="Btn btn-filter"
                    >
                      <span>Filter <BiFilter style={{ fontSize: "1.5em", color: "#042b62" }} /></span>

                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="Mobile_Stock_search">
            <div className="Search_Filter_Mobile">
              <div className="Search_Field">
                <img onClick={onOpenModal} src={Search} alt="search" />
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
                        id=""
                      />
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                      <p className="mostpop">MostsPopular</p>
                      <div style={{ marginTop: "1rem" }}>
                        <div className="Top_Stock_List">
                          <div>Bajaj Finance Ltd. 3Y</div>
                          <div>
                            <p style={{ float: "right" }}>FD</p>
                          </div>
                        </div>
                        <div className="Top_Stock_List">
                          <div>
                            Parag Parikh Flexi Cap Growth Direct Plan
                          </div>
                          <div>
                            <p style={{ float: "right" }}>MF</p>
                          </div>
                        </div>
                        <div className="Top_Stock_List">
                          <div>Tata Motors Ltd.</div>
                          <div>
                            <p style={{ float: "right" }}>US Stocks</p>
                          </div>
                        </div>
                        <div className="Top_Stock_List">
                          <div>UTI Nifty 50 Index Growth Direct Plan</div>
                          <div>
                            <p style={{ float: "right" }}>MF</p>
                          </div>
                        </div>
                        <div className="Top_Stock_List">
                          <div>Mahindra & Mahindra Ltd</div>
                          <div>
                            <p style={{ float: "right" }}>FD</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <h4>All Funds</h4>
              </div>
              <div className="Filter_Field">
                <img onClick={() => setOpenPanel(true)} src={Filter} alt="filter" />

              </div>
            </div>
          </div>
        </div>

        <div className="item-list">
          {compareArray.length > 0 && (<div className="Stock_List_Table_selected">
            <h6>
              Compare | <span>Max 3 Funds</span>
            </h6>
            <div className="CompareFundata">
              <div className="Seleted_Funds">

                {
                  compareArray.map((v) => <CompareSelectBox data={v} onRemove={(v) => {
                    handleChooseCompare(v);
                  }} />)
                }
              </div>
              <div
                className="CompareBtn"
                style={{ display: "grid", float: "right" }}
              >
                <button onClick={() => openComparePage()}>Compare</button>
                <button
                  oonClick={() => this.toggleButton()}
                  style={{
                    backgroundColor: "gray",
                    Color: "#fff",
                    border: "None ",
                  }}
                  onClick={() => setCompareArray([])}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>)}

          {inlineLoader === true && (<div className="item-continer-bx">
            <div className="row item-continer-row">
              <div className="col-12">
                <FintooInlineLoader isLoading={inlineLoader} />
              </div>
            </div>
          </div>)}

          {mutualfundlist.map((item) => (
            <div key={"pd1" + item.isin_code + item.net_change} className="item-continer-bx mf-container">
              <div className="row item-continer-row ">
                <div className="col-12 col-md-3">
                  {/* <h3>{item.id}</h3> */}
                  <div className="item-title-container">
                    <div
                      className="Stock_Img"
                    >
                      <img
                        className="imgC"
                        src={AMC}
                        alt={item.scheme_name}
                      />
                    </div>
                    <div className="item-title-parent" style={{ verticlAlign: "middle" }}>
                      <div className="item-title"><a href="/">{item.scheme_name}</a></div>
                      <span><span>{item.fintoo_category_name}| {item.risk}</span> <span className="formobile">| <span className="navtext">NAV 1D</span> ₹ {item.nav} <span style={{ color: "#ff7f10" }}>{item.net_change}%</span></span></span>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-9">
                  <div className="item-side-options">
                    <div className="Sample fordesktop">
                      <div className="in-options-title">NAV | 1D</div>
                      <div className="Value">
                        <span className="currencySymbol">₹</span> {item.nav} &nbsp; <span style={{ color: "#ff7f10" }}>{item.net_change}%</span>
                      </div>
                    </div>
                    <div className="Sample">
                      <div className="in-options-title"><span className="fordesktop">1 YEAR</span><span className="formobile">1 Y</span></div>
                      <div className="Value"> {item.return_year1}% </div>
                    </div>
                    <div className="Sample">
                      <div className="in-options-title"><span className="fordesktop">3 YEARS</span><span className="formobile">3 Y</span></div>
                      <div className="Value">{item.return_year3}%</div>
                    </div>
                    <div className="Sample">
                      <div className="in-options-title"><span className="fordesktop">5 YEARS</span><span className="formobile">5 Y</span></div>
                      <div className="Value">{item.return_year5}%</div>
                    </div>
                    <div className="Sample">
                      <div className="in-options-title">COMPARE</div>
                      <span className="Value">
                        <input checked={compareArray.findIndex((v) => v.scheme_code == item.scheme_code) > -1} type="checkbox" name="" id="" value={item.scheme_code} onChange={(e) => { handleChooseCompare(item) }} /> </span>
                    </div>
                    <div className="Sample explore-for-desktop">
                      <div className="explore-now-bx">
                        <Link className="explore-now" to={"/direct-mutual-fund/MutualFund/" + item.scheme_code}>Explore</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 explore-for-mobile"><Link className="explore-now" to="/MutualFund">Explore</Link></div>
              </div>
            </div>
          ))}

        </div>

        {pageCount > 0 && <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />}
        {/* <SweetPagination
          currentPageData={setCurrentPageData}
          getData={items}
          // nextLabel= "next"
          dataPerPage={10}
          navigation={true}
          getStyle={"style-1"}
        /> */}
        <br />
      </div>


      <SlidingPanel
        className="Filter_Panel"
        type={"right"}
        isOpen={openPanel}
        size={sidePanelWidth}
      >

        <Form id="FilterData">

          <div className="SideBar_Filter">
            <div className="filter_text">Filters</div>
            <div>
              <button type="button" onClick={() => setOpenPanel(false)}>
                <img src={CloseFilter} alt="" srcset="" />
              </button>
            </div>
          </div>
          <div style={{ marginTop: "1rem" }} className="Line"></div>

          <div className="fltr-section desktop-view-none">
            {/* desktop filters */}
            <h4>Sort</h4>
            <div className="fund_Option">
              <ul className="fltr-items">
                {['1 Day', '1 Month', '1 Year'].map((v)=> (
                  <li className="fltr-items-li">
                    <div className="chk-item-bx">
                      <FintooCheckbox checked={ v == selectedSort } title={v} onChange={()=> setSelectedSort(v)}/>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="fltr-section">
            {/* desktop filters */}
            <h4>Fund Option</h4>
            <div className="fund_Option">
              <ul className="fltr-items">
                {fundOptionList.map((v) => (
                  <li className="fltr-items-li">
                    <div className="chk-item-bx">
                      <FintooCheckbox checked={fundOptions.indexOf(v.toLowerCase()) > -1} title={v} onChange={() => handleFundOptionChange(v.toLowerCase())} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ marginTop: "1rem" }} className="Line"></div>
          <div className="fltr-section">
            <h4>Category</h4>
            <div className="Category_Filter">
              <ul className="fltr-items">
                {categories.map((v) => (
                  <li className="fltr-items-li">
                    <FintooCheckbox checked={catName.indexOf(v.toLowerCase()) > -1} title={v} onChange={() => handleCategoryChange(v.toLowerCase())} />
                    {/* <input type="checkbox" name="Equity" value="Equity" id="" onChange={handleCategoryChange} /> <span>Equity</span> */}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ marginTop: "1rem" }} className="Line"></div>
          <div className="fltr-section">
            <h4>Subcategory Filter</h4>
            <div className="SubCategory_Filter">
              <ul className="fltr-items">
                {subcategories.map((v) => (
                  <li className="fltr-items-li">
                    <div className="subcat-dv">
                      <FintooCheckbox checked={subcatName.indexOf(v.toLowerCase().replaceAll(' ', '-')) > -1} title={v} onChange={() => handleSubCategoryChange(v.toLowerCase().replaceAll(' ', '-'))} />
                      {/* <input type="checkbox" name="Equity" value="Equity" id="" onChange={handleCategoryChange} /> <span>Equity</span> */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="Filter_Btn_panel">
            <div>
              <button onClick={handleClick}>Apply</button>
            </div>
            <div className="reset_btn">
              <button className="Reset" type="button" onClick={() => {
                setSubCategory([]);
                setCategory([]);
                setFundOptions([]);
                setSelectedSort("");
                // setOpenPanel(false);
              }}>
                Reset All
              </button>
            </div>
          </div>
        </Form>
      </SlidingPanel>
    </MainLayout>
  );
}
