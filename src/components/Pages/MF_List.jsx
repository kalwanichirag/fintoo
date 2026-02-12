import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
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
import Filter from "../Assets/filter-results-button.svg";
import Explore from "../Assets/Explore.svg";
import AMC from "../Assets/AMC.png";
import { Modal } from "react-responsive-modal";
import CompareSelectBox from "../Compare/CompareSelectBox";
import { FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import { BiFilter } from "react-icons/bi";
import ReactPaginate from "react-paginate";
import Link from "../MainComponents/Link";
import { ReactComponent as SearchIo } from "../Assets/loupe-_1_.svg";
import CloseFilter from "../../Assets/Images/close.png";
import FintooLoader from "../FintooLoader";
import FintooInlineLoader from "../FintooInlineLoader";
import { IoClose } from "react-icons/io5";
import FintooCheckbox from "../FintooCheckbox/FintooCheckbox";
import MainLayout from "../Layout/MainLayout";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import FintooSubCheckbox from "../../components/FintooCheckbox/FintooSubCheckbox";
import { param } from "jquery";
import commonEncode from "../../commonEncode";
import {
  CheckSession,
  apiCall,
  successAlert,
  errorAlert,
  fetchEncryptData,
  loginRedirectGuest,
  getUserId,
  defaultamclogo,
  getItemLocal,
  getParentUserId,
} from "../../common_utilities";
import ScrollToTop from "../HTML/ScrollToTop";
import AddToWish from "../AddToWish";
import { useDispatch } from "react-redux";
import GuestLayout from "../Layout/GuestLayout";
import useDebounce from "../../Utils/Hooks/UseDebaunce";
import customStyles from "../CustomStyles";
import { FetchMfWishlist, GetAMCList, GetMfCategories, GetSchemeList } from "../../FrappeIntegration-Services/services/investment-api/investmentService";

const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');

const riskfilter = [
  { value: "Low Risk", label: "Low Risk" },
  { value: "Moderately Low Risk", label: "Moderately Low Risk" },
  { value: "Moderate Risk", label: "Moderate Risk" },
  { value: "Moderately High Risk", label: "Moderately High Risk" },
  { value: "Very High Risk", label: "Very High Risk" },
];
const categories = ["Equity", "Debt", "Hybrid", "Others"];

const fundOptionList = ["Growth", "Dividend"];
const InvestmentOptions = [
  { value: "lumpsum", label: "Lumpsum" },
  { value: "sip", label: "SIP" },
];
const tabsData = {
  all: { title: "All", image: "all.png", tabImage: "all-black.svg" },
  recommended: {
    title: "Recommended",
    image: "recommended.png",
    tabImage: "recommended-black.svg",
  },
  "tax-saver": {
    title: "Tax saver (ELSS)",
    image: "tax-saver.png",
    tabImage: "tax-saver-black.svg",
  },
  "liquid-fund": {
    title: "Liquid fund",
    image: "insta-redeem.png",
    tabImage: "insta-redeem-black.svg",
  },
  nfo: { title: "NFO", image: "NFO.png", tabImage: "NFO-black.svg" },
  wishlist: {
    title: "Wishlist",
    image: "wishlist.png",
    tabImage: "wishlist-black.png",
  },
};

export default function MutualFundList({ options, callback }) {
  const dispatch = useDispatch();
  // start pagination
  const navigate = useNavigate();

  const { tabName } = useParams();

  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [mutualfundlist, setMutualFundList] = useState([]);
  const [searchlist, setSearchList] = useState([]);
  const [txtvalue, setTxtvalue] = useState("");
  const debauncedText = useDebounce(txtvalue, 500);

  const [catName, setCategory] = useState([]);
  const [amcName, setAmcName] = useState([]);
  const [subcatName, setSubCategory] = useState([]);
  const [applyFilters, setFilters] = useState([]);
  const [subFilters, setSubFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedFirstTime, setLoadedFirstTime] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [userIds, setUserIds] = useState([]);
  // const [searchParams1, ] = useSearchParams();
  const userid = getUserId();

  const [selected, setSelected] = useState("");
  const [expanded, setExpanded] = useState(null);

  const [inlineLoader, setInlineLoader] = useState(false);
  const [fundOptions, setFundOptions] = useState([]);
  const [riskOptions, setRiskOptions] = useState([]);
  const [investmentOptions, setInvestmentOptions] = useState([]);

  const [sidePanelWidth, setSidePanelWidth] = useState(30);
  const [selectedSort, setSelectedSort] = useState("");
  const [params, setParams] = useState({ sort: "three_year" });

  useEffect(() => {
    // console.log("params", params, 'mutualfundlist', mutualfundlist)
  }, [params, mutualfundlist])

  const [searchkey, setSearchkey] = useState("");

  const [selectedCategory, setSelectedCategory] = useState({});
  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const [notReload, setNotReload] = useState(false);
  const [resetAll, setresetAll] = useState(false);
  const [mainData, setMainData] = useState({});
  const [statusData, setStatusData] = useState({});
  const [skipInit, setSkipInit] = useState(false);
  const [errorMsg, SetErrorMsg] = useState("");
  const [amcList, setAmcList] = useState([]);
  const [amcFilter, setAmcFilter] = useState(false);
  const [amcCheck, setAmcCheck] = useState(false);
  const autoFilterRef = useRef(null);
  const [isOpen1, setIsOpen1] = useState(false);
  const openModal1 = () => { setIsOpen1(true); };
  const closeModal1 = () => { setIsOpen1(false); };
  const apiControllerRef = useRef();

  useEffect(() => {
    getAmcList();
    familyArray();
    // if (userid) {
    //   checkUserData();
    // }
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
    resetFilterValues();
    setNotReload(false);
    handleTabNameChange(tabName);
  }, [tabName]);

  // const checkUserData = async () => {
  //   var pan = await fetchUserData();
  //   if (pan == "") {
  //     navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile");
  //   }
  // };

  const handleTabNameChange = (v) => {
    switch (tabName) {
      case "all":
        setParams({
          page: 1,
          user_id: userid,
          sort: "three_year"
        });
        setTxtvalue("");
        break;
      case "recommended":
        setParams({
          page: 1,
          recommend: "1",
          user_id: userid,
          sort: "three_year"
        });
        setTxtvalue("");
        break;
      case "tax-saver":
        setParams({
          page: 1,
          tax_saver: "txsv",
          user_id: userid,
          sort: "three_year"
        });
        setTxtvalue("");
        break;
      case "nfo":
        setParams({
          page: 1,
          NFO: "nfo",
          user_id: userid,
          sort: "three_year"
        });
        setTxtvalue("");
        break;
      case "liquid-fund":
        setTxtvalue("");
        setParams({
          page: 1,
          liquid_fund: "liqdfund",
          user_id: userid,
          sort: "three_year"
        });
        break;
      case "wishlist":
        setTxtvalue("");
        if (userid) {
          fetchWishListFund();
        } else {
          // loginRedirectGuest();
          navigate("/login");
          return;
        }
        break;
    }
  };

  const fetchMutualfundata = async () => {
    try {
      SetErrorMsg("");

      if (!loadedFirstTime) {
        setIsLoading(true);
        setLoadedFirstTime(true);
      }

      if (Object.keys(params).length === 0) return;

      showInlineLoading();
      setMutualFundList([]);

      // Cancel previous request if still in progress
      if (apiControllerRef.current) {
        apiControllerRef.current.abort();
      }

      apiControllerRef.current = new AbortController();

      let payload1 = { ...(user_data?.user_id ? { user_id: user_data.user_id } : {}) };

      if (params?.page !== undefined && params?.page !== null) {
        payload1.page = params.page;
      }
      if (params?.NFO !== undefined && params?.NFO !== null) {
        payload1.nfo = params.NFO;
      }
      if (params?.sort !== undefined && params?.sort !== null) {
        payload1.sort_order = params.sort;
      }
      if (params?.search !== undefined && params?.search !== null) {
        payload1.search = params.search;
      } else (
        // hardcoded search for testing
        payload1.search = ""
      )

      if (params?.amc !== undefined && params?.amc !== null) {
        payload1.amc_code = params.amc;
      }
      if (params?.recommend !== undefined && params?.recommend !== null) {
        payload1.recommend = params.recommend;
      }
      if (params?.risk_filter !== undefined && params?.risk_filter !== null) {
        payload1.risk_filter = params.risk_filter;
      }
      if (params?.sub_category_filter !== undefined && params?.sub_category_filter !== null) {
        payload1.subcategory_filter = params.sub_category_filter;
      }
      if (params?.liquid_fund !== undefined && params?.liquid_fund !== null) {
        payload1.liquid_fund = params.liquid_fund;
      }
      if (params?.tax_saver !== undefined && params?.tax_saver !== null) {
        payload1.tax_saver = params.tax_saver;
      }
      if (params?.fund_option !== undefined && params?.fund_option !== null) {
        payload1.fund_option = params.fund_option;
      }
      if (params?.investment_type !== undefined && params?.investment_type !== null) {
        payload1.investment_type = params.investment_type;
      }
      if (params?.category_filter !== undefined && params?.category_filter !== null) {
        payload1.category_filter = params.category_filter;
      }

      const res = await GetSchemeList(payload1)
      const data = res.data;

      if (res.status_code === 200 && Array.isArray(data) && data.length > 0) {

        const mappedData = data.map((item) => ({
          scheme_code: item?.scheme_code ?? "",
          scheme_name: item?.scheme_name ?? "Unnamed Scheme",
          star_rating: item?.star_rating ?? null,
          risk_value: item?.risk_value ?? "",
          nav: item?.nav ?? 0,
          nav_net_change: item?.nav_net_change ?? 0,
          scheme_1_year_ret: item?.scheme_1_year_ret ?? 0,
          scheme_3_year_ret: item?.scheme_3_year_ret ?? 0,
          scheme_5_year_ret: item?.scheme_5_year_ret ?? 0,
          amc_code: item?.amc_code ?? "",
          isin_code: item?.isin_code ?? "",
          fintoo_category_name: item?.fintoo_category_name ?? "",
          sip_available: item?.sip_allowed === 1 ? "true" : "false",
          lumsump_minimum_amount: item?.lumpsum_minimum_amount ?? 0,
          scheme_slug: item?.slug ?? "",
          is_purchase_available: item?.is_purchase_available ?? "",
          wishlist_key: item?.wishlist_key === "true"
        }));

        if (searchParams.get("category") === "landing") {
          searchParams.delete("category");
          setSearchParams(searchParams);
          setPageCount(1);
          setMutualFundList(mappedData);
        } else {
          const pageData = res?.schemes_count ?? 0;
          setPageCount(Math.ceil(pageData / perPage));
          setMutualFundList(mappedData);
        }

        setIsLoading(false);
        hideInlineLoading();
        setNotReload(false);
      } else {
        setMutualFundList([]);
        setPageCount(0);
        setIsLoading(false);
        hideInlineLoading();
        SetErrorMsg(res?.schemes_count === 0 ? "No funds found!" : "No funds found.");
      }
    } catch (error) {
      // console.error("Error in fetchMutualfundata:", error);
      setMutualFundList([]);
      setPageCount(0);
      setIsLoading(false);
      hideInlineLoading();
      SetErrorMsg("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    if (Object.keys(selectedCategory).length == 0) return;
    fetchSubCategorylist();
  }, [selectedCategory]);

  useEffect(() => {
    // if (skipInit == false) return;
    if (tabName === "wishlist") {
      fetchWishListFund();
    } else {
      // check auto filters
      if (
        searchParams.get("category") &&
        Boolean(autoFilterRef.current) == false
      ) {
        autoFilterRef.current = true;
        switch (searchParams.get("category")) {
          case "large_cap":
            handleCategoryChange("equity");
            handleSubCategoryChange("large-cap");
            setParams({
              ...params,
              category_filter: "equity",
              sub_category_filter: "large-cap",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "mid_cap":
            handleCategoryChange("equity");
            handleSubCategoryChange("mid-cap");
            setParams({
              ...params,
              category_filter: "equity",
              sub_category_filter: "mid-cap",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "small_cap":
            handleCategoryChange("equity");
            handleSubCategoryChange("small-cap");
            setParams({
              ...params,
              category_filter: "equity",
              sub_category_filter: "small-cap",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "index_funds":
            handleCategoryChange("equity");
            handleSubCategoryChange("index funds");
            setParams({
              ...params,
              category_filter: "equity",
              sub_category_filter: "index funds",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "nfo":
            window.location.href =
              process.env.PUBLIC_URL + "/direct-mutual-fund/funds/nfo";
          case "money_market":
            handleCategoryChange("debt");
            handleSubCategoryChange("money market");
            setParams({
              ...params,
              category_filter: "debt",
              sub_category_filter: "money market",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "corporate_bond":
            handleCategoryChange("debt");
            handleSubCategoryChange("corporate bond");
            setParams({
              ...params,
              category_filter: "debt",
              sub_category_filter: "corporate bond",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "banking_psu":
            handleCategoryChange("debt");
            handleSubCategoryChange("banking & psu");
            setParams({
              ...params,
              category_filter: "debt",
              sub_category_filter: "banking & psu",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "arbitrage_fund":
            handleCategoryChange("hybrid");
            handleSubCategoryChange("arbitrage fund");
            setParams({
              ...params,
              category_filter: "hybrid",
              sub_category_filter: "arbitrage fund",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "fund_of_funds":
            handleCategoryChange("hybrid");
            handleSubCategoryChange("fund of funds");
            setParams({
              ...params,
              category_filter: "hybrid",
              sub_category_filter: "fund of funds",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "hybrid":
            handleCategoryChange("hybrid");
            setParams({ ...params, category_filter: "hybrid" });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "balanced allocation":
            handleCategoryChange("hybrid");
            handleSubCategoryChange("balanced allocation");
            setParams({
              ...params,
              category_filter: "hybrid",
              sub_category_filter: "balanced allocation",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "equity":
            handleCategoryChange("equity");
            setParams({ ...params, category_filter: "equity" });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "debt":
            handleCategoryChange("debt");
            setParams({ ...params, category_filter: "debt" });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "government bond":
            handleCategoryChange("debt");
            handleSubCategoryChange("government bond");
            setParams({
              ...params,
              category_filter: "debt",
              sub_category_filter: "government bond",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "low duration":
            handleCategoryChange("debt");
            handleSubCategoryChange("low duration");
            setParams({
              ...params,
              category_filter: "debt",
              sub_category_filter: "low duration",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "ultra short duration":
            handleCategoryChange("debt");
            handleSubCategoryChange("ultra short duration");
            setParams({
              ...params,
              category_filter: "debt",
              sub_category_filter: "ultra short duration",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "liquid":
            handleCategoryChange("debt");
            handleSubCategoryChange("liquid");
            setParams({
              ...params,
              category_filter: "debt",
              sub_category_filter: "liquid",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "overnight":
            handleCategoryChange("debt");
            handleSubCategoryChange("overnight");
            setParams({
              ...params,
              category_filter: "debt",
              sub_category_filter: "overnight",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
          case "landing":
            setParams({ ...params, sort: "three_year" });
            // searchParams.delete('category');
            // setSearchParams(searchParams);
            break;
          case "sector - precious metals":
            handleCategoryChange("others");
            handleSubCategoryChange("sector - precious metals");
            setParams({
              ...params,
              category_filter: "others",
              sub_category_filter: "sector - precious metals",
            });
            searchParams.delete("category");
            setSearchParams(searchParams);
            break;
        }
        // fetchMutualfundata();
      }
      if (searchParams.get("amc") && Boolean(autoFilterRef.current) == false) {
        autoFilterRef.current = true;
        // newObj = { ...newObj, amc: amcName.map(i=>i.amc_code).join()};
        setParams({ ...params, amc: searchParams.get("amc") });
        setAmcCheck(true);
        setAmcFilter(true);
        setAmcName([...amcName, searchParams.get("amc")]);
        searchParams.delete("amc");
        setSearchParams(searchParams);
      } else {
        fetchMutualfundata();
      }
    }
  }, [params]);

  const fetchSubCategorylist = async () => {
    const controller = new AbortController();

    var res = await GetMfCategories(selectedCategory);

    if (res.message === "Success") {
      setSubCategoryOption(res?.data);
    }
    controller.abort();
  };

  const getAmcList = async () => {
    try {
      const res = await GetAMCList();

      if (res.message === "Success") {
        const transformedData = res.data.map(item => ({
          ...item,
          amc: item.amc_name,
        }));

        setAmcList(transformedData);
      }
    } catch (error) {
      // console.error("Failed to fetch AMC list:", error);
    }
  };


  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setParams({ ...params, page: currentPage });
    window.scrollTo(0, 0);
  };

  const familyArray = (typeOfArray) => {
    try {
      var new_array = [];
      var new_array_pans = [];
      var new_data = getItemLocal("member");
      new_data.forEach((element) => {
        if (element.id !== null) {
          new_array.push(element.id.toString());
        }
      });
      setUserIds(new_array.toString())
    } catch {
      // do nothing
    }

  };

  const fetchWishListFund = async () => {
    SetErrorMsg("");
    // var userIdArray = userIds.split(',').map(id => id.trim());
    // var userId = userIds.split(',').filter(id => id.trim() !== '');
    // const p = { ...params, user_id: getItemLocal('family') ? userIdArray : getUserId() };

    var payload = {
      user_id: getUserId(),
      ...params
    };

    var res = await FetchMfWishlist(payload);

    var r = res.data;
    if (res.status_code == 200) {
      setMutualFundList([...r]);
    } else {
      SetErrorMsg(res.data?.message || "Error");
      // setMutualFundList([]);

      // ifuserid null then       // navigate("/login");
    }
    r = r?.map((v) => {
      v.wishlist_key = true;
      return v;
    });
    const pageData = res?.schemes_count ?? 0;
    setPageCount(Math.ceil(pageData / perPage));
    setIsLoading(false);
  };

  // const fetchWishListFundReset = async () => {
  //   const p = { user_id: getUserId() };
  //   var config = {
  //     method: "post",
  //     url: WISHLIST_FUND_DATA_API_URL,
  //     data: p,
  //   };
  //   var res = await axios(config);
  //   var r = res.data.data;
  //   if (res.data.error_code == 100) {
  //     setMutualFundList([...r]);
  //   } else {
  //     SetErrorMsg(res.data.message);
  //     setMutualFundList([]);
  //   }
  //   r = r.map((v) => {
  //     v.wishlist_key = true;
  //     return v;
  //   });
  //   setPageCount(Math.ceil(res.data.page_count / perPage));
  //   setIsLoading(false);
  // };

  // For Side Panel
  const [openPanel, setOpenPanel] = useState(false);

  const [name, setName] = useState("");
  const [compareArray, setCompareArray] = useState([]);
  const [foundStocks, setFoundStocks] = useState(null);

  useEffect(() => {
    if (openPanel) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [openPanel]);

  const filter = async (e) => {
    const keyword = e.target.value;
    setTxtvalue(keyword);
  };

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
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  function select(event) {
    const value = event.target.textContent;
    callback(value);
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
  const [showResults, setShowResults] = React.useState(false);
  const [showMobileSearchBox, setShowMobileSearchBox] = useState(false);
  const mobileSearchBoxRef = useRef();



  const handleMobileSearch = async (e) => {

    if (e.target.value.length > 2) {
      setParams({ ...params, search: e.target.value, page: 1 });
    }
    if (e.target.value.length == 0) {
      setParams({ ...params, search: undefined, page: 1 });
    }
  };

  const handleChooseCompare = (v) => {
    var newArray = compareArray;
    if (newArray.findIndex((x) => x.scheme_code == v.scheme_code) > -1) {
      newArray.splice(newArray.indexOf(v), 1);
    } else {
      if (newArray.length < 3) {
        newArray.push(v);
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "You cannot add more than 3 funds for compare.",
            type: "error",
          },
        });
      }
    }

    setCompareArray([...newArray]);
  };

  function handleAmcChange() {
    setAmcFilter((e) => !e, setAmcName([]));
    setAmcCheck((f) => !f);
  }

  function handleCategoryChange(v) {
    //   if (searchParams.get('equity')==1){
    //       v == 'equity'
    //   }
    //   if (searchParams.get('hybrid')==1){
    //     v == 'hybrid'
    // }
    if (v == catName) {
      setCategory("");
      setSelectedCategory({});
      setShowResults(false);
      setSubCategory([]);
    } else {
      setCategory(v);
      setSelectedCategory({ category: v });
      setShowResults(true);
      setSubCategory([]);
    }
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

  function handleAmcNameChange(v) {
    var ssc = [...amcName];
    var index = ssc.indexOf(v.amc_code);
    if (index > -1) {
      ssc.splice(index, 1);
    } else {
      ssc.push(v.amc_code);
    }
    setAmcName([...ssc]);
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

  function handleRiskFilterChange(v) {
    setRiskOptions((prev) => (prev[0] === v ? [] : [v]));
  }

  function handleInvestmentOptionChange(v) {
    var investype = [...investmentOptions];
    var index = investype.indexOf(v);
    if (index > -1) {
      investype.splice(index, 1);
    } else {
      investype.push(v);
    }
    setInvestmentOptions([...investype]);
  }

  function applyFilter(e) {
    e.preventDefault();
    setOpenPanel(false);

    var newObj = {};
    if (catName.length) {
      newObj = { ...newObj, category_filter: catName };
    } else {
      newObj = { ...newObj, category_filter: undefined };
    }
    if (subcatName.length) {
      newObj = { ...newObj, sub_category_filter: subcatName.join() };
    } else {
      newObj = { ...newObj, sub_category_filter: undefined };
    }
    if (fundOptions.length) {
      newObj = { ...newObj, fund_option: fundOptions.join() };
    } else {
      newObj = { ...newObj, fund_option: undefined };
    }

    if (riskOptions.length) {
      newObj = { ...newObj, risk_filter: riskOptions[0] };
    } else {
      newObj = { ...newObj, risk_filter: undefined };
    }

    if (investmentOptions.length) {
      newObj = { ...newObj, investment_type: investmentOptions.join() };
    } else {
      newObj = { ...newObj, investment_type: undefined };
    }
    if (amcName.length) {
      newObj = { ...newObj, amc: amcName.map((i) => i).join() };
    } else {
      newObj = { ...newObj, amc: undefined };
    }
    if (selectedSort && selectedSort.length) {
      newObj = { ...newObj, sort: selectedSort };
    } else {
      newObj = { ...newObj, sort: undefined };
    }
    setParams({ ...params, ...newObj });
  }

  const showInlineLoading = () => {
    setMutualFundList([]);
    setPageCount(0);
    setInlineLoader(true);
  };

  const hideInlineLoading = () => {
    setInlineLoader(false);
  };
  const openComparePage = () => {
    if (compareArray.length == 1) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Please add one more fund to compare.",
          type: "error",
        },
      });
    } else {
      var allSchemeCodes = compareArray.map((v) =>
        v.scheme_code != "" ? v.scheme_code : v.scheme_code
        // v.scheme_code != "" ? v.scheme_slug : v.scheme_code
      );
      var scheme_c = allSchemeCodes.join(",");

      localStorage.setItem("schemecode", scheme_c);

      // window.open(process.env.PUBLIC_URL + "/direct-mutual-fund/Compare");
      navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/Compare");
    }
  };

  const sortOptions = [
    { value: "one_year", label: "1 Years" },
    { value: "three_year", label: "3 Years" },
    { value: "five_year", label: "5  Years" },
  ];

  function toggleSort(e) {
    var sorKey = { sort: undefined };
    if (e.length) {
      sorKey = { ...sorKey, sort: e };
    }
    setParams({ ...params, ...sorKey });
  }
  const resetFilterValues = () => {
    setSelectedSort("");
    setFundOptions(["growth"]);
    setCategory("");
    setSelectedCategory({});
    setSubCategory([]);
    setInvestmentOptions([]);
    setRiskOptions("");
    setAmcCheck(false);
    setAmcFilter(false);
  };
  const onToggleWishlist = (scheme_code) => {
    switch (tabName) {
      case "wishlist":
        setMutualFundList((v) => v.filter((x) => x.scheme_code != scheme_code));
        break;
      default:
        setMutualFundList((v) =>
          v.map((x) => {
            if (x.scheme_code == scheme_code) {
              x.wishlist_key = !x.wishlist_key;
            }
            return x;
          })
        );
    }
  };

  // useEffect(() => {
  //   return () => navigate(
  //     process.env.PUBLIC_URL +
  //     "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=1", { replace: true }
  //   );
  // }, [])

  useEffect(() => {
    if (debauncedText.length > 2) {
      return setParams({ ...params, search: debauncedText, page: 1 });
    }
    if (debauncedText.length == 0) {
      return setParams({ ...params, search: undefined, page: 1 });
    }
  }, [debauncedText])

  return (
    <GuestLayout>
      <FintooLoader isLoading={isLoading} />

      {Boolean(tabName) && (
        <div className="pt-0 pt-4 Stock_Details container">
          <div className="react-tabs">
            <div className="Stock_Header1">
              <ul className="react-tabs__tab-list top-nav-menu">
                <li
                  className={`TabHeader ${tabName == "all" ? "react-tabs__tab--selected" : ""
                    }`}
                >
                  <Link to={`/direct-mutual-fund/funds/all`}>
                    <div className="top-menu-li-item">
                      <div className="imgC" style={{ paddingRight: "10px" }}>
                        <img
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/all.png"
                          }
                          alt="All"
                        />
                      </div>
                      <div className="header-tab-title">
                        {" "}
                        {tabsData["all"]["title"]}
                      </div>
                    </div>
                  </Link>
                </li>
                <li
                  className={`TabHeader ${tabName == "recommended" ? "react-tabs__tab--selected" : ""
                    }`}
                >
                  <Link to={`/direct-mutual-fund/funds/recommended`}>
                    <div className="top-menu-li-item">
                      <div className="imgC" style={{ paddingRight: "10px" }}>
                        <img
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/recommended.png"
                          }
                          alt="Recommended"
                        />
                      </div>
                      <div className="header-tab-title">
                        {" "}
                        {tabsData["recommended"]["title"]}
                      </div>
                    </div>
                  </Link>
                </li>

                <li
                  className={`TabHeader ${tabName == "tax-saver" ? "react-tabs__tab--selected" : ""
                    }`}
                >
                  <Link to={`/direct-mutual-fund/funds/tax-saver`}>
                    <div className="top-menu-li-item">
                      <div className="imgC" style={{ paddingRight: "10px" }}>
                        <img
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/tax-saver.png"
                          }
                          alt="Tax-Saver"
                        />
                      </div>
                      <div className="header-tab-title">
                        {" "}
                        {tabsData["tax-saver"]["title"]}
                      </div>
                    </div>
                  </Link>
                </li>

                <li
                  className={`TabHeader ${tabName == "liquid-fund" ? "react-tabs__tab--selected" : ""
                    }`}
                >
                  <Link to={`/direct-mutual-fund/funds/liquid-fund`}>
                    <div className="top-menu-li-item">
                      <div className="imgC" style={{ paddingRight: "10px" }}>
                        <img
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/insta-redeem.png"
                          }
                          alt="Liquid-Fund"
                        />
                      </div>
                      <div className="header-tab-title">
                        {" "}
                        {tabsData["liquid-fund"]["title"]}
                      </div>
                    </div>
                  </Link>
                </li>

                <li
                  className={`TabHeader ${tabName == "nfo" ? "react-tabs__tab--selected" : ""
                    }`}
                >
                  <Link to={`/direct-mutual-fund/funds/nfo`}>
                    <div className="top-menu-li-item">
                      <div className="imgC" style={{ paddingRight: "10px" }}>
                        <img
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/NFO.png"
                          }
                          alt="NFO"
                        />
                      </div>
                      <div className="header-tab-title">
                        {" "}
                        {tabsData["nfo"]["title"]}
                      </div>
                    </div>
                  </Link>
                </li>

                <li
                  className={`TabHeader ${tabName == "wishlist" ? "react-tabs__tab--selected" : ""
                    }`}
                  onClick={() => {
                    window.location.reload();
                    // setSubCategory([]);
                    // setCategory([]);
                    // setFundOptions(["growth"]);
                    // setInvestmentOptions([]);
                    // setRiskOptions([]);
                    // setShowResults(false);
                    // setSelectedSort("");
                    // setNotReload(false);
                    // handleTabNameChange(tabName);
                    // setresetAll(true);
                  }}
                >
                  <Link to={`/direct-mutual-fund/funds/wishlist`}>
                    <div className="top-menu-li-item">
                      <div className="imgC" style={{ paddingRight: "10px" }}>
                        <img
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/wishlist.png"
                          }
                          alt="wishlist"
                        />
                      </div>
                      <div className="header-tab-title">
                        {" "}
                        {tabsData["wishlist"]["title"]}
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="Stock_Search">
            <div className="searchbar-desktop">
              <div className="row ">
                <div className="col-12 col-md-3 tab-header-bx">
                  <div style={{ marginTop: "0.5rem" }}>
                    <h4>
                      <span>
                        <img
                          className="imgC"
                          src={require("../../Assets/Images/main/mf_list/" +
                            tabsData[tabName]["tabImage"])}
                          alt={tabName}
                          style={{ width: "30px" }}
                        />
                      </span>
                      <span> {tabsData[tabName]["title"]}</span>
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
                        tabIndex={0}
                        className="autocomplete-text"
                      />

                      {txtvalue.length == 0 && (
                        <span
                          className="cr-pointer"
                          onClick={() =>
                            document.getElementById("search-text").focus()
                          }
                        >
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
                            setParams({
                              ...params,
                              search: undefined,
                              page: 1,
                            });
                          }}
                        >
                          <IoClose />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-2 col-md-3">
                  <div className="row fintoo-filter-buttons">
                    <div className="col-6 ">
                      {tabName != "wishlist" && (
                        <Select
                          placeholder="Sort"
                          styles={customStyles}
                          isSearchable={false}
                          classNamePrefix="sortSelect"
                          onChange={(v) => toggleSort(v.value)}
                          value={sortOptions.find(
                            (v) => v.value == params.sort
                          )}
                          options={sortOptions}
                        />
                      )}
                    </div>
                    <div className="col-md-6">
                      <button
                        onClick={() => setOpenPanel(true)}
                        className="Btn btn-filter"
                      >
                        <span>
                          Filter{" "}
                          <BiFilter
                            style={{ fontSize: "1.5em", color: "#042b62" }}
                          />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="Mobile_Stock_search">
              <div className="d-flex align-items-center">
                {showMobileSearchBox === true ? (
                  <>
                    <div className="flex-grow-1">
                      <input
                        ref={mobileSearchBoxRef}
                        placeholder="Type here..."
                        className="w-100 border-0"
                        type=""
                        onChange={handleMobileSearch}

                      />
                    </div>
                    <div className="pe-2 pt-1" onClick={() => {
                      setShowMobileSearchBox(false);
                    }}>
                      <i class="fa-regular fa-circle-xmark"></i>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="Search_Field">
                      <img
                        onClick={() => {
                          setShowMobileSearchBox(true);
                        }}
                        src={Search}
                        alt="search"
                      />
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
                    <div
                      style={{ textAlign: "center" }}
                      className="flex-grow-1"
                    >
                      <h4 className="mt-0 mb-0">All Funds</h4>
                    </div>
                  </>
                )}
                <div className="Filter_Field ">
                  <img
                    width={"16px"}
                    onClick={() => setOpenPanel(true)}
                    src={Filter}
                    alt="filter"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="item-list">
            {compareArray.length > 0 && (
              <div className="Stock_List_Table_selected">
                <h6>
                  Compare | <span>Max 3 Funds</span>
                </h6>
                <div className="CompareFundata">
                  <div className="Seleted_Funds">
                    {compareArray.map((v) => (
                      <CompareSelectBox
                        data={v}
                        onRemove={(v) => {
                          handleChooseCompare(v);
                        }}
                      />
                    ))}
                  </div>
                  <div
                    className="CompareBtn"
                    style={{ display: "grid", float: "right" }}
                  >
                    {compareArray.length > 0 && (
                      <button onClick={() => openComparePage()}>Compare</button>
                    )}
                    {compareArray.length > 0 && (
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
                    )}
                  </div>
                </div>
              </div>
            )}

            {inlineLoader === true && (
              <div className="item-continer-bx">
                <div className="row item-continer-row">
                  <div className="col-12">
                    <FintooInlineLoader isLoading={inlineLoader} />
                  </div>
                </div>
              </div>
            )}

            {errorMsg.length == 0 &&
              Array.isArray(mutualfundlist) &&
              mutualfundlist.map((item, index) => (
                <div
                  // key={"pd1" + item.isin_code + item.net_change}
                  key={index + 1}
                  className="item-continer-bx mf-container"
                >
                  <div className="row item-continer-row ">
                    <div className="col-12 col-md-3">
                      {/* <h3>{item.id}</h3> */}
                      <div className="item-title-container">
                        <div className="Stock_Img">
                          <img
                            id={"img-" + item.isin_code}
                            className="imgC"
                            src={
                              item.amc_code != "" && item.amc_code != null
                                ? `${process.env.REACT_APP_STATIC_URL}/media/companyicons/${item.amc_code}.png`
                                : defaultamclogo()
                            }
                            // src={require("../../public/static/media/companyicons/" + item.amc_code +".png")}
                            alt={item.scheme_name}
                            onError={() => {
                              document
                                .getElementById("img-" + item.isin_code)
                                .setAttribute("src", defaultamclogo());
                            }}
                          />
                        </div>
                        <div
                          className="item-title-parent"
                          style={{ verticlAlign: "middle" }}
                        >
                          <div className="item-title">
                            {/* className="explore-now" */}
                            <a
                              // href={'/direct-mutual-fund/MutualFund/'+ item.scheme_slug}
                              href={
                                // item.scheme_slug != ""
                                //   ? "/direct-mutual-fund/MutualFund/" +
                                //   item.scheme_slug
                                // : 
                                "/direct-mutual-fund/MutualFund/" +
                                item.scheme_code
                              }
                              title={item.scheme_name}
                            >
                              {item.scheme_name}
                            </a>

                            {/* <Link to={`/direct-mutual-fund/MutualFund/${item.scheme_slug}`}>{item.scheme_name}</Link> */}
                          </div>
                          <span>
                            <span>
                              {item.fintoo_category_name}| {item.risk_value}
                            </span>{" "}
                            <span className="formobile">
                              | <span className="navtext">NAV: &nbsp;</span> ₹{" "}
                              {item.nav}{" "}
                              <span style={{ color: "#ff7f10" }}>
                                {item.nav_net_change}%
                              </span>
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-9">
                      <div className="item-side-options ps-md-3 pe-md-3">
                        <div className="Sample fordesktop">
                          <div className="in-options-title">NAV | 1D</div>
                          <div className="Value">
                            <span className="currencySymbol">₹</span> {item.nav}{" "}
                            &nbsp;{" "}
                            {item.nav_net_change >= 0 ? (
                              <span style={{ color: "#21913a" }}>
                                {item.nav_net_change}%
                              </span>
                            ) : (
                              <span style={{ color: "#ff7f10" }}>
                                {item.nav_net_change}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="Sample">
                          <div className="in-options-title">
                            <span className="fordesktop">1 YEAR</span>
                            <span className="formobile">1 Y</span>
                          </div>
                          <div className="Value"> {item.scheme_1_year_ret}% </div>
                        </div>
                        <div className="Sample">
                          <div className="in-options-title">
                            <span className="fordesktop">3 YEARS</span>
                            <span className="formobile">3 Y</span>
                          </div>
                          <div className="Value">{item.scheme_3_year_ret}%</div>
                        </div>
                        <div className="Sample">
                          <div className="in-options-title">
                            <span className="fordesktop">5 YEARS</span>
                            <span className="formobile">5 Y</span>
                          </div>
                          <div className="Value">{item.scheme_5_year_ret}%</div>
                        </div>
                        <div className="Sample">
                          <div className="inSideComp">
                            <div className="in-options-title">COMPARE</div>
                            <span className="Value">
                              <input
                                checked={
                                  compareArray.findIndex(
                                    (v) => v.scheme_code == item.scheme_code
                                  ) > -1
                                }
                                type="checkbox"
                                name=""
                                id=""
                                value={item.scheme_code}
                                onChange={(e) => {
                                  handleChooseCompare(item);
                                }}
                              />{" "}
                            </span>
                          </div>
                        </div>
                        <div className="Sample explore-for-desktop">
                          <div className="explore-now-bx">
                            <a
                              // onClick={()=> handleExplore(item)}
                              className="explore-now"
                              href={process.env.PUBLIC_URL +
                                "/direct-mutual-fund/MutualFund/" +
                                item.scheme_code}
                            // item.scheme_slug != ""
                            //   ? process.env.PUBLIC_URL +
                            //   "/direct-mutual-fund/MutualFund/" +
                            //   item.scheme_slug
                            //   : process.env.PUBLIC_URL +
                            //   "/direct-mutual-fund/MutualFund/" +
                            //   item.scheme_code
                            >
                              Explore
                            </a>
                          </div>
                        </div>
                        <div className="addtowish-btn">
                          <AddToWish
                            scheme_slug={item.scheme_slug}
                            scheme_code={item.scheme_code}
                            value={item.wishlist_key}
                            onToggleWishlist={onToggleWishlist}

                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 explore-for-mobile">
                      <Link
                        className="explore-now"
                        to={
                          item.scheme_slug != ""
                            ? "/direct-mutual-fund/MutualFund/" +
                            item.scheme_slug
                            : "/direct-mutual-fund/MutualFund/" +
                            item.scheme_code
                        }
                      >
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

            {tabName != "wishlist" && errorMsg.length > 0 && (
              <div className="item-continer-bx stock-container">
                <div className="row item-continer-row">
                  <div className="text-center">
                    <strong>{errorMsg}</strong>
                  </div>
                </div>
              </div>
            )}

            {tabName == "wishlist" && mutualfundlist.length == 0 && (
              <div className="item-continer-bx stock-container">
                <div className="row item-continer-row">
                  <div className="text-center">
                    <div className="search-fund-list">
                      <Link to={`/direct-mutual-fund/funds/all`}>
                        Add Funds
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {Array.isArray(mutualfundlist) &&
            mutualfundlist.length > 0 &&
            pageCount > 1 && (
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-end"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
                forcePage={params.page == undefined ? 0 : params.page - 1}
              />
            )}
          <br />
        </div>
      )}

      <SlidingPanel
        className="Filter_Panel"
        type={"right"}
        isOpen={openPanel}
        size={sidePanelWidth}
      >
        <Form id="FilterData" className="d-flex flex-column">
          <div className="ps-3 pe-3 pt-3">
            <div className="SideBar_Filter">
              <div className="filter_text">Filters</div>
              <div>
                <button type="button" onClick={applyFilter}>
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
                  {sortOptions.map((item) => (
                    <li className="fltr-items-li" key={"sort" + item.value}>
                      <div className="chk-item-bx">
                        <FintooCheckbox
                          checked={item.value === selectedSort}
                          title={item.label}
                          onChange={() => setSelectedSort(item.value)}
                        />
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
                    <li className="fltr-items-li" key={"fo-" + v.toLowerCase()}>
                      <div className="chk-item-bx">
                        <FintooCheckbox
                          checked={fundOptions.indexOf(v.toLowerCase()) > -1}
                          title={v}
                          onChange={() =>
                            handleFundOptionChange(v.toLowerCase())
                          }
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ marginTop: "1rem" }} className="Line"></div>
            <div className="fltr-section">
              <FintooCheckbox
                checked={amcCheck}
                title={"AMC"}
                onChange={() => handleAmcChange()}
              />
              <br></br>
              {amcFilter ? (
                <div className="Category_Filter">
                  <ul className="fltr-items">
                    {amcList.map((v) => (
                      <li className="fltr-items-li-amc">
                        <FintooCheckbox
                          checked={
                            amcName.findIndex((x) => x == v.amc_code) > -1
                          }
                          title={v.amc}
                          onChange={() => handleAmcNameChange(v)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="fltr-section">
              <h4>Category</h4>
              <div className="Category_Filter">
                <ul className="fltr-items">
                  {categories.map((v) => (
                    <li className="fltr-items-li" key={"ct-" + v.toLowerCase()}>
                      <FintooCheckbox
                        checked={catName.indexOf(v.toLowerCase()) > -1}
                        title={v}
                        onChange={() => handleCategoryChange(v.toLowerCase())}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ marginTop: "1rem" }} className="Line"></div>
            {showResults ? (
              <>
                <div className="fltr-section">
                  <h4>Subcategory Filter</h4>
                  <div className="SubCategory_Filter">
                    <div className="fund_options ">
                      {Array.isArray(subCategoryOption) &&
                        subCategoryOption.length > 0 &&
                        [...new Set(subCategoryOption.map((v) => v.asset_category))]
                          .sort()
                          .map((category) => (
                            <h4 key={"sub-" + category.toLowerCase()}>
                              <div className="fltr-items-li">
                                <div className="subcat-dv">
                                  <FintooCheckbox
                                    checked={
                                      subcatName.indexOf(category.toLowerCase()) > -1
                                    }
                                    title={category}
                                    onChange={() =>
                                      handleSubCategoryChange(category.toLowerCase())
                                    }
                                  />
                                </div>
                              </div>
                            </h4>
                          ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            <div className="fltr-section">
              <h4>Investment Style</h4>
              <div className="Category_Filter">
                <ul className="fltr-items">
                  {InvestmentOptions.map((v) => (
                    <li
                      className="fltr-items-li"
                      key={"in-style-" + v.value.toLowerCase()}
                    >
                      <FintooCheckbox
                        checked={
                          investmentOptions.indexOf(v.value.toLowerCase()) > -1
                        }
                        title={v.label}
                        onChange={() =>
                          handleInvestmentOptionChange(v.value.toLowerCase())
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ marginTop: "1rem" }} className="Line"></div>
            <div className="fltr-section">
              <h4>Risk</h4>
              <div className="Category_Filter">
                <ul className="fltr-items">
                  {riskfilter.map((v) => (
                    <li
                      className="fltr-items-li fltr-items-li-w50"
                      key={"risk-" + v.value.toLowerCase()}
                    >
                      <FintooCheckbox
                        checked={riskOptions.includes(v.value)}
                        title={v.label}
                        onChange={() => handleRiskFilterChange(v.value)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="p-3 Filter_Btn_panel">
            <div>
              <button onClick={applyFilter}>Apply</button>
            </div>
            <div
              onClick={() => {
                // setSubCategory([]);
                // setCategory([]);
                // setFundOptions(["growth"]);
                // setInvestmentOptions([]);
                // setRiskOptions([]);
                // setShowResults(false);
                // setSelectedSort("");
                // setNotReload(false);
                // handleTabNameChange(tabName);
                // setresetAll(true);
                // setOpenPanel(false);
                // applyFilter();
                // fetchWishListFundReset();
                window.location.reload();
              }}
              style={{ paddingLeft: "5%" }}
              className="Filter_Btn_panel"
            >
              <button
                className="Reset"
                type="button"
                onClick={() => {
                  // fetchWishListFundReset();
                  // navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/funds/all");
                  window.location.reload();
                }}
              >
                Reset All
              </button>
            </div>
          </div>
        </Form>
      </SlidingPanel>

      <ScrollToTop />
    </GuestLayout>
  );
}
