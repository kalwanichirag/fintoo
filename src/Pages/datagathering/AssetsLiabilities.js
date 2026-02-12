import React, { useState, useRef } from "react";
import { useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import QuizeRadio from "../../components/HTML/QuizRadio";
import { GrEdit } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import SlidingPanel from "react-sliding-side-panel";
import moment from "moment";
import Switch from "react-switch";
import { Row, Modal } from "react-bootstrap";
import DatagatherLayout from "../../components/Layout/Datagather";
import Slider from "../../components/HTML/Slider";
import "rc-slider/assets/index.css";
import { BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import ReactDatePicker from "../../components/HTML/ReactDatePicker/ReactDatePicker";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import DGstyles from "./DG.module.css";
import {

  DATA_BELONGS_TO,
  DELETE_OTHER_INVESTMENTS,
  imagePath
} from "../../constants";
import {
  apiCall,
  getItemLocal,
  getParentUserId,
  getSchemeDataStorage,
  getUserId,
  indianRupeeFormat,
  loginRedirectGuest,
  setBackgroundDivImage,
  goalfilter,
  fv,
  fetchEncryptData,
  getprofilestatus,
  fetchData,
  getParentFpLogId,
} from "../../common_utilities";
import { CommentIcon } from "evergreen-ui";
import commonEncode from "../../commonEncode";
import { toast } from "react-toastify";
import { Buffer } from "buffer";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import CloseFilter from "../../Assets/Images/close.png";
import FintooCheckbox from "../../components/FintooCheckbox/FintooCheckbox";
import FintooSubCheckbox from "../../components/FintooCheckbox/FintooSubCheckbox";
import Others from "./AssetsLibDG/Others";
import Realestate from "./AssetsLibDG/Realestate";
import Liquid from "./AssetsLibDG/Liquid";
import Alternate from "./AssetsLibDG/Alternate";
import AssetGold from "./AssetsLibDG/AssetGold";
import AssetDebt from "./AssetsLibDG/AssetDebt";
import AssetEquity from "./AssetsLibDG/AssetEquity";
import SimpleReactValidator from "simple-react-validator";
import AssetOthers from "./AssetsLibDG/AssetOthers";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Liabilities from "./AssetsLibDG/Liabilities";
import customStyles from "../../components/CustomStyles";
import FintooLoader from "../../components/FintooLoader";
import AssetLibstyle from "./AssetLib.module.css"
import { faL } from "@fortawesome/free-solid-svg-icons";
import { IoCloseCircleOutline } from "react-icons/io5";
import GoalsDropdown from "../../components/GoalsDropdown/GoalDropdown";
import PortfolioBalance from "../../components/PortfolioBalance";
import GoalSelectionModal from "../../components/GoalsDropdown/GoalSelectionModal";
import { getFamilyMember } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { UpdateAssetDetails, UpdateCategoryGoalLinkage, deleteAssetDetails, getAssetCategoryList, getEPFMaturityAmount } from "../../FrappeIntegration-Services/services/financial-planning-api/asset";
import { getOtherInvestments, saveUserAssetDetails } from "../../FrappeIntegration-Services/services/investment-api/investmentService";
import { getGoalDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/goal";
import { GetUsEquityShares, geEquitySharesList } from "../../FrappeIntegration-Services/services/financial-planning-api/externalApi";
import { getIncomeDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/income";
// const categories = [
//   {
//     title: "All",
//     id: 0,
//     child: [],
//   },
//   {
//     title: "Equity",
//     id: 29,
//     child: [
//       { title: "ESOP`S", id: 34 },
//       { title: "PMS", id: 32 },
//       { title: "Equity Mutual Funds", id: 31 },
//       { title: "Unlisted / AIF Equity", id: 33 },
//       { title: "Equity Shares", id: 30 },
//       { title: "US Equity", id: 123 },
//       { title: "Future & Options", id: 35 },
//       { title: "Others", id: 74 },
//     ],
//   },
//   {
//     title: "Shares",
//     id: 1,
//     child: [
//       { title: "All", id: "All" },
//       { title: "External", id: "External" },
//       { title: "Manual", id: "Manual" },
//     ],
//   },
//   {
//     title: "Gold",
//     id: 42,
//     child: [
//       { title: "Gold ETF", id: 70 },
//       { title: "Gold Mutual Fund", id: 71 },
//       { title: "Physical Gold", id: 69 },
//       { title: "Sovereign Gold Bonds", id: 72 },
//       { title: "Others", id: 73 },
//     ],
//   },
//   {
//     title: "Mutual Funds",
//     id: 2,
//     child: [
//       { title: "All", id: "All" },
//       { title: "Internal", id: "Internal" },
//       { title: "External", id: "External" },
//       { title: "Manual", id: "Manual" },
//     ],
//   },
//   {
//     title: "Liquid",
//     id: 40,
//     child: [
//       { title: "Bank Balance", id: 61 },
//       // { title: "Cash Balance", id: 60 },
//       { title: "Liquid Funds", id: 62 },
//       { title: "Others", id: 63 },
//     ],
//   },
//   {
//     title: "Alternate",
//     id: 41,
//     child: [
//       { title: "Art Investment", id: 64 },
//       { title: "Vintage/Luxury Cars", id: 66 },
//       { title: "Commodity", id: 36 },
//       { title: "Cryptocurrency", id: 119 },
//       { title: "Currency", id: 37 },
//       { title: "Others", id: 67 },
//     ],
//   },
//   {
//     title: "Real Estate",
//     id: 39,
//     child: [
//       { title: "Agricultural Land", id: 53 },
//       { title: "Under Construction Property", id: 55 },
//       { title: "Commercial", id: 52 },
//       { title: "Land", id: 56 },
//       { title: "Residential Premises", id: 51 },
//       { title: "Others", id: 59 },
//     ],
//   },
//   {
//     title: "Debt",
//     id: 38,
//     child: [
//       { title: "Debentures", id: 80 },
//       { title: "Debt Mutual Funds", id: 77 },
//       { title: "EPF", id: 117 },
//       { title: "Fixed Deposit", id: 75 },
//       { title: "Gratuity", id: 82 },
//       { title: "Govt Bonds", id: 79 },
//       { title: "Govt. Schemes", id: 76 },
//       { title: "NPS", id: 118 },
//       { title: "NSC/KVP", id: 84 },
//       { title: "Pension Schemes", id: 85 },
//       { title: "Post Office Scheme", id: 78 },
//       { title: "PPF/GPF/VPF", id: 81 },
//       { title: "Sukanya Samriddhi Yojana", id: 86 },
//       { title: "Recurring Deposit", id: 120 },
//       { title: "Others", id: 87 },
//     ],
//   },
//   {
//     title: "Others",
//     id: 115,
//     child: [],
//   },
// ];



const upload_options = [
  {
    title: "CDSL",
    img:
      imagePath +
      "/static/media/DG/assets-liabilities/alternate/assets_alternate_wine_investment.svg",
  },
  {
    title: "NSDL",
    img:
      imagePath +
      "/static/media/DG/assets-liabilities/alternate/assets_alternate_wine_investment.svg",
  },
];

const AssetsLiabilities = () => {



  const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');

  const UserDetails = getItemLocal('member');
  const [assetsData, setAssetsData] = useState([]);
  const [assetCatdata, setAssetCatData] = useState([])
  const asset_data = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("tab1");
  const [subtab, setSubTab] = useState("individual");
  const [category, setCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState(["All"]);
  const [selectedMember, setSelectedMember] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Equity");
  const [selectedSubOption, setSelectedSubOption] = useState("Equity Mutual Funds");
  const [selectedSubcatOption, setSelectedSubcatOption] = useState("");
  const [sliderValue, setSliderValue] = useState(7);
  const cntRef = useRef(null);
  const [openPanel, setOpenPanel] = useState(false);
  const [sidePanelWidth, setSidePanelWidth] = useState(30);
  const [showview, setShowView] = useState(true);
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState("");
  const [, setForceUpdate] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const userid = getParentUserId();
  const fpLogId = getParentFpLogId();
  const assetsUpdated = useSelector((state) => state.assetsUpdated);
  const [fetched, setFetched] = useState(false);
  const [viewmore1, setViewMore1] = useState(0);
  const [viewmore2, setViewMore2] = useState(0);
  const [assetIsLinkable, setAssetIsLinkable] = useState({});
  const [selectedgoalsdata, setSelectedGoalsData] = useState(false);
  const [selectedgoalsmodal, setSelectedGoalsmodal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [deletetoggle, setDeleteToggle] = useState(false)
  const [filteredAssetsDataCheck, setfilteredAssetsDataCheck] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [isOpenGoalSelectionModal, setIsOpenGoalSelectionModal] = useState(false);
  // const removefixheader = useRef(null);
  const [scroll, setScroll] = useState(false);
  const { v4: uuidv4 } = require("uuid");
  const [cdslBrokers, setCDSLBrokers] = useState([]);
  const [selectedBrokers, setSelectedBrokers] = useState([]);
  const [showBrokers, setShowBrokers] = useState(false);
  const [equityHoldingsData, setEquityHoldingsData] = useState([]);
  const [equityFilteredHoldings, setEquityFilteredHoldings] = useState([]);
  const [filterBroker, setFilterBroker] = useState(false);
  const [updatemultilinkageData, setUpdatemultilinkageData] = useState('');

  const [totalassetvalue, setTotalAssetValue] = useState(0);

  const [disableexternal, setDisableExternal] = useState(false)
  const [categories, setCategories] = useState([]);
  const [linkageDetails, setLinkageDetails] = useState([]);
  
  // const [removefixheaderVisible, setRemovefixheaderVisible] = useState(false);
  // useEffect(() => {
  //   window.addEventListener("scroll", () => {
  //     setScroll(window.scrollY > 116);
  //   });
  // }, []);

  useEffect(() => {
    const handleScroll2 = () => {
      const removefixheader = document.querySelector('.removefixheaderasset');
      const FixdgsubHeader = document.querySelector('.FixdgHeaderasset');
      const FixdgmainHeader = document.querySelector('.DGheaderFix');
      const scrollPosition = window.scrollY;
      if (removefixheader && FixdgsubHeader && FixdgmainHeader) {
        const removefixheaderRect = removefixheader.getBoundingClientRect();
        const threshold = 70;
        if (removefixheaderRect.top > 170 && scrollPosition > 50) {
          setScroll(true)
          FixdgsubHeader.classList.add("DGsubheaderFixasset");
          if (removefixheaderRect.top <= threshold) {
            FixdgmainHeader.classList.remove("DGmainHeaderFix");
          }
          else {
            FixdgmainHeader.classList.add("DGmainHeaderFix");
          }
        } else {
          setScroll(false);
          FixdgsubHeader.classList.remove("DGsubheaderFixasset")
          FixdgmainHeader.classList.remove("DGmainHeaderFix");
        }
      }
    };

    window.addEventListener('scroll', handleScroll2);

    return () => {
      window.removeEventListener('scroll', handleScroll2);

    };
  }, []);
  useEffect(() => {
    const handleScroll3 = () => {
      const removefixheader2 = document.querySelector('.removefixheaderasset2');
      const FixdgsubHeader2 = document.querySelector('.FixdgHeaderasset2');
      const FixdgmainHeader2 = document.querySelector('.DGheaderFix2');
      const scrollPosition = window.scrollY;
      if (removefixheader2 && FixdgsubHeader2 && FixdgmainHeader2) {
        const removefixheaderRect2 = removefixheader2.getBoundingClientRect();
        const threshold2 = 70;
        if (removefixheaderRect2.top > 180 && scrollPosition > 50) {
          setScroll(true)
          FixdgsubHeader2.classList.add("DGsubheaderFixasset");

          if (removefixheaderRect2.top <= threshold2) {
            FixdgmainHeader2.classList.remove("DGmainHeaderFix");
          }
          else {
            FixdgmainHeader2.classList.add("DGmainHeaderFix");
          }
        } else {
          setScroll(false);
          FixdgsubHeader2.classList.remove("DGsubheaderFixasset");
          FixdgmainHeader2.classList.remove("DGmainHeaderFix");
        }
      }
    };

    window.addEventListener('scroll', handleScroll3);

    return () => {
      window.removeEventListener('scroll', handleScroll3);

    };
  }, []);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("success");
    const myEpfParam = urlParams.get("isepf");
    const myStockParam = urlParams.get("isstocks");
    const myLiabilityParam = urlParams.get("isliability");

    if (myParam == 1) {
      setIsOpen(true);
    }
    if (myEpfParam == 1) {
      if (urlParams.get("epfamount")) {
        setModalData((prev) => ({
          ...prev,
          epfamount: Number(urlParams.get("epfamount")),
        }));
      }
    } else if (myStockParam == 1) {
      if (urlParams.get("stocksamount")) {
        setModalData((prev) => ({
          ...prev,
          stocksamount: Number(urlParams.get("stocksamount")),
        }));
      }
    } else if (myLiabilityParam == 1) {
      if (urlParams.get("liabilityamount")) {
        setModalData((prev) => ({
          ...prev,
          liabilityamount: Number(urlParams.get("liabilityamount")),
        }));
        setIsFetched(true);
        setTab("tab2");
        // setSelectedOption("Fetch Loan");
      }
    } else {
      if (urlParams.get("amount")) {
        setModalData((prev) => ({
          ...prev,
          amount: Number(urlParams.get("amount")),
        }));
      }
    }


    document.body.classList.add("dg-layout");

    const interval = setInterval(() => {
      const bgAssets = document.getElementById("bg-assets");
      if (bgAssets) {
        bgAssets.style.background = `url(${imagePath}/static/media/DG/assets.svg) no-repeat right top`;
        clearInterval(interval);
        setBackgroundDivImage();
      }
    }, 50);

    return () => {
      clearInterval(interval);
      document.body.classList.remove("dg-layout");
    };
  }, []);



  useEffect(() => {

    if (assetsUpdated) {
      getAssetData(0);
      setAddForm(true);
      setUpdateForm(false);
      dispatch({
        type: "ASSETS_UPDATE",
        payload: false,
      });
    }
  }, [assetsUpdated]);

  useEffect(() => {

    if (!assetsUpdated) {
      getAssetData(0);
      setAddForm(true);
      setUpdateForm(false);
      dispatch({
        type: "ASSETS_UPDATE",
        payload: false,
      });
    }
  }, [assetsUpdated]);


  useEffect(() => {
    if (selectedSubcategory.indexOf(30) > -1 && cdslBrokers.length > 0) {
      setShowBrokers(true);
    } else {
      setShowBrokers(false);
    }
  }, [selectedSubcategory]);

  const handleFilterBroker = (value) => {
    setFilterBroker(value);
  }

  useEffect(() => {
    setTimeout(() => {
      setCurrentUrl(location.pathname);
    }, 100);
  }, [location]);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      loginRedirectGuest();
    }
    // getCDSLBrokers();    
  }, []);

  const getCDSLBrokers = async (assetsData) => {

    const rid = uuidv4();
    const ts = new Date().toISOString();
    const loginPayload = {
      header: {
        rid: rid,
        ts: ts,
        channelId: "finsense",
      },
      body: {
        userId: "channel@fintoo",
        password: "85a333fb49044c7e91611a0d962ff8ba",
      },
    };

    const url =
      "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/User/Login";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginPayload),
    };

    const loginResponse = await fetch(url, options);

    if (loginResponse.status === 200) {
      const responseData = await loginResponse.json();
      const token = responseData.body.token;
      try {
        // let fir_request_payload = {
        //   header: {
        //     rid: rid,
        //     ts: ts,
        //     channelId: "finsense",
        //   },
        //   body: {
        //     custId: cust_id,
        //     consentId: consent_id,
        //     consentHandleId: consent_handle,
        //     dateTimeRangeFrom: daterange_from,
        //     dateTimeRangeTo: daterange_to,
        //   },
        // };

        // const requestBody = JSON.stringify(fir_request_payload);

        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // body: requestBody,
        };

        let brokersResponse = await fetch(
          "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/fips/brokers",
          requestOptions
        )

        if (brokersResponse.status === 200) {
          brokersResponse = await brokersResponse.json();
          let brokersList = brokersResponse.body;
          // let brokersList = brokersResp;
          let assetBrokerList = [];
          let assetList = assetsData;

          assetList.forEach((item) => {
            if ((item.user_asset_source == "External" && item.asset_sub_name_uuid == "equity_shares") && item.asset_broker_id != 0) {
              // slice demat id from 3 to 7
              // let dematId = assetList['demat_id'].slice(3, 8);
              // let brok = brokersList.filter(v => console.log("bbb", v, v["brokerId"], item.asset_broker_id, typeof item.asset_broker_id));
              let broker = brokersList.filter(v => parseInt(v["brokerId"]) == item.asset_broker_id);
              // console.log("broker", broker[0], broker[0].brokerId);
              let existBroker = assetBrokerList.filter(v => v.brokerId == broker[0]["brokerId"]);
              if (existBroker.length == 0) {
                assetBrokerList.push({ 'brokerId': broker[0]["brokerId"], "brokerName": broker[0]["brokerName"] });
              }
            }
          });
          setCDSLBrokers(assetBrokerList);
        }
        else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error("Could not fetch brokers list");
        }

        // .then((response) => response.json())
        // .then((data) => {
        //   let brokersList = data;
        //   let assetList = [];
        //   // if (data.body && data.body.sessionId) {
        //   //   setUserSessionId(data.body.sessionId);
        //   //   FIStatus(
        //   //     data.body.sessionId,
        //   //     cust_id,
        //   //     consent_handle,
        //   //     consent_id,
        //   //     token,
        //   //     daterange_from,
        //   //     daterange_to
        //   //   );
        //   // } else {
        //   //   // setIsLoading(false);
        //   //   toastr.options.positionClass = "toast-bottom-left";
        //   //   toastr.error("Could not fetch brokers list");
        //   // }
        // })
        // .catch((error) => {
        //   console.log("Error:", error);
        // });
      } catch (e) {
        console.log("Error", e);
      }
    }
  }


  const assetImageMap = {
    // Debt Mutual Funds
    "Debt Mutual Funds": "/static/media/DG/assets-liabilities/debt/assets_debt_mutual_fund.svg",

    // Government Schemes
    "EPF": "/static/media/DG/assets-liabilities/debt/assets_debt_PPF_EPF.svg",
    "NPS": "/static/media/DG/assets-liabilities/debt/assets_debt_PPF_EPF.svg",
    "NSC": "/static/media/DG/assets-liabilities/debt/assets_debt_NSC_KVP.svg",
    "PPF": "/static/media/DG/assets-liabilities/debt/assets_debt_PPF_EPF.svg",
    "Sukanya Samriddhi Yojana": "/static/media/DG/assets-liabilities/debt/assets_debt_capital_gain_bonds.svg",
    "Post Office Schemes": "/static/media/DG/assets-liabilities/debt/assets_debt_post_office_scheme.svg",

    // Liquid Debt
    "Saving Account": "/static/media/DG/assets-liabilities/liquid/assets_liquid_bank_balance.svg",
    "Fixed Deposit": "/static/media/DG/assets-liabilities/debt/assets_debt_fixed_deposit.svg",
    "RD": "/static/media/DG/assets-liabilities/debt/recurring_deposit.svg",

    // Bonds
    "Debentures": "/static/media/DG/assets-liabilities/debt/assets_debt_debenture.svg",
    "Public Bonds": "/static/media/DG/assets-liabilities/debt/assets_debt_govt_bond.svg",
    "Private Bonds": "/static/media/DG/assets-liabilities/debt/assets_debt_govt_bond.svg",

    // Others
    "Pension Schemes": "/static/media/DG/assets-liabilities/debt/assets_debt_pension_scheme.svg",
    "Gratuity": "/static/media/DG/assets-liabilities/debt/assets_debt_Gratuity.svg",
    "Others": "/static/media/DG/assets-liabilities/debt/assets_debt_others.svg",
  };

  const defaultCategoryImage = "/static/media/DG/assets-liabilities/debt/assets_debt_others.svg";


  const [options, setOptions] = useState([]);

  const FetchAssetCategoryList = async () => {
    try {
      const result = await getAssetCategoryList();

      if (result.status_code === "200") {
        const data = typeof result.data === "string" ? JSON.parse(result.data) : result.data;

        const categoryList = data?.[0]?.category_list || [];
        setCategories(data[0]?.category_list || []);
        // const categories = transformCategoriesFromAPI(data);
        const updatedOptions = categoryList.map((category) => {
          const subOptions = [];

          category.subcategories?.forEach((sub) => {
            if (sub.asset_types?.length) {
              sub.asset_types.forEach((type) => {
                subOptions.push({
                  title: type.asset_type_name,
                  id: parseInt(type.asset_type_id.replace("ATM-", "")),
                  asset_type_id: type.asset_type_id,
                  asset_type_name_uuid: type.asset_type_name_uuid,
                  img: imagePath + (assetImageMap[type.asset_type_name] || defaultCategoryImage),
                  // asset_sub_cat_id: sub.asset_sub_id,
                  asset_sub_name: sub.asset_sub_name,
                  asset_sub_name_uuid: sub.asset_sub_name_uuid,
                  // asset_cat_id: category.asset_id,
                  asset_cat_name: category.asset_name,
                  asset_cat_name_uuid: category.asset_name_uuid,
                  is_asset_type: true
                });
              });
            } else {
              subOptions.push({
                title: sub.asset_sub_name,
                id: parseInt(sub.asset_sub_id.replace("ASC-", "")),
                asset_type_id: null,
                asset_type_name_uuid: null,
                img: imagePath + defaultCategoryImage,
                // asset_sub_cat_id: sub.asset_sub_id,
                asset_sub_name: sub.asset_sub_name,
                asset_sub_name_uuid: sub.asset_sub_name_uuid,
                // asset_cat_id: category.asset_id,
                asset_cat_name: category.asset_name,
                asset_cat_name_uuid: category.asset_name_uuid,
                is_asset_type: false
              });
            }
          });


          return {
            title: category.asset_name,
            id: parseInt(category.asset_id.replace("UCAT-", "")),
            img: imagePath + defaultCategoryImage,
            options: subOptions,
            assetuuid: category.asset_name_uuid,
            // asset_cat_id: category.asset_id
          };
        });
        setOptions(updatedOptions);
      } else {
        setOptions([]);
      }
    } catch (e) {
      console.error("Error fetching asset categories:", e);
      setOptions([]);
    }
  };



  useEffect(() => {
    FetchAssetCategoryList();
  }, []);


  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    document.body.classList.add("dg-layout");
    return () => {
      document.body.classList.remove("rp-layout");
    };
  }, []);


  // Assets

  const defaultAssetDetails = {

    asset_type_name_uuid: '',
    asset_name_uuid: 'equity',
    asset_sub_name_uuid: "equity_mf",                // UUID for asset type (can be null)
    asset_sub_category_id: "",              // UUID (not numeric ID) of subcategory
    user_asset_source: "Manual",
    asset_epf_ismanual: "1",

    user_asset_ownership: "Free Hold",
    user_asset_valid_till: "",                  // TO DISCUSS: Perpetual flag meaning?
    user_asset_allocation: "Y",
    asset_iselss: "",
    user_asset_occurance: "One Time",
    user_asset_property_type: "Self-Occupied",
    user_asset_maturity_amount: 0,
    user_asset_maturity_date: null,
    user_asset_end_date: null,
    asset_name: "Equity",                    // Can be asset type or category title
    user_asset_name: "Equity",
    asset_pan: null,
    user_asset_payout_type: "",
    user_asset_pincode: "",
    user_asset_avg_purchase_price: "",
    user_asset_purchase_date: null,
    asset_rental_amount: "",
    asset_rental_income: null,
    user_asset_ror: "0",
    asset_unique_code: "",
    user_asset_quantity: "",
    subcategorydetail: "",                  // Subcategory title (display only)
    user_asset_investment_amount: "",
    user_asset_growth_rate: "0",
    user_asset_service_years: '5',
    asset_abreturn: "0",
    user_asset_current_price: "",
    user_asset_monthly_salary: 0,
    asset_broker_id: 0,
    user_asset_city_type: "",
    user_asset_sip_amount: '',
    user_asset_freq: "One Time",
    // TO DISCUSS: Goal linkage logic — should this be an array?
    asset_goal_link_id: 0,
    asset_goalname: null,
    // User/member identification
    user_asset_user_id: getUserId(),                   // Prefer using getUserId() directly
    user_asset_for: "",
    asset_member_id: getUserId(),          // Assuming all 3 use the same ID

    membername1: "",
    stock_mf: null,
    stock_name: null,
    scheme_equityshare: {},
    user_asset_current_amount: "",
    totalmaturtiyamount: "",
    user_asset_gratuity_amount: 0,

    // Automated flags
    user_asset_automated_linkage: 1,
    user_asset_installment_paid: "",
    user_asset_currency: "INR",
    // user_asset_allocation: 'N'

    user_asset_is_linkable: 0
  };


  const [assetForMember, setAssetForMember] = useState("");
  const [assetName, setAssetName] = useState("");
  const [categoryDetail, setCategoryDetail] = useState("");
  const [subCategoryDetails, setSubCategoryDetails] = useState("");
  const [assetLinkGoal, setAssetLinkGoal] = useState("");
  const [unfilteredAssetsData, setUnfilteredAssetsData] = useState("");
  const [alternateFilteredAssetsData, setAlternateFilteredAssetsData] = useState("");
  const [goldFilteredAssetsData, setGoldFilteredAssetsData] = useState("");
  const [liquidFilteredAssetsData, setLiquidFilteredAssetsData] = useState("");
  const [realEstateFilteredAssetsData, setRealEstateFilteredAssetsData] = useState("");
  const [equityFilteredAssetsData, setEquityFilteredAssetsData] = useState("");
  const [goalData, setGoalData] = useState([]);
  const [multiLinkageGoalData, setMultiLinkageGoalData] = useState([]);
  const [unchangedgoaldata, setUnchangedGoalData] = useState([]);
  const [rentalincomeData, setRentalIncomeData] = useState([]);
  const [eqfunds, setEQFunds] = useState([]);
  const [equityShares, setEquityShares] = useState([]);
  const [debtfunds, setDebtfunds] = useState([]);
  const [goldfunds, setGoldfunds] = useState([]);
  const [liquidfunds, setLiquidfunds] = useState([]);
  // set US equity data
  const [USEquity, setUSEquity] = useState([]);
  const [assetsDetails, setAssetsDetails] = useState(defaultAssetDetails);
  const [filterText, setFilterText] = useState("");
  const [filterName, setFilterName] = useState("");
  const [totalacivesip, setTotalActiveSIP] = useState(0);
  const [activeSIP, setActiveSIP] = useState(0);
  const [activeSIPAmount, setActiveSIPAmount] = useState(0);
  const [schemedata, setSchemeData] = useState([]);
  const [cryptodata, setCryptoData] = useState([]);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [isLoading, setIsLoading] = useState(false);
  const [assetEditId, setAssetEditId] = useState("");
  const [isGoalSelected, setGoalSelected] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState("Automated Linkage");
  const [selectedGoalsId, setSelectedGoalsId] = useState([]);
  const [selectedPriorityArray, setSelectedPriorityArray] = useState([]);
  const [isAutoMatedGoal, setAutoMatedGoal] = useState(true);
  const [retirementGoalID, setRetirementGoalId] = useState(0);
  // const [checkboxShouldExcludel, setCheckboxShouldExcludel] = useState(false);


  const getLinkageDetailsPayload = () => {
    return selectedGoalsId?.map((goalId, index) => {
      return {
        linkage_goal_id: goalId,
        linkage_priority: selectedPriorityArray[index],
      };
    });
  };

  const categoryEditIdRef = useRef();
  const [assetsArrayInModal, setAssetsArrayInModal] = useState([]);
  const [categoryEditId, setCategoryEditId] = useState(null);
  const [viewAllGoalsData, setViewAllGoalsData] = useState([]);

  const handleDoneInModal = (v) => {
    //console.log(v);
  }
  const defaultGoal = { label: "Automated Linkage", value: 0 };

  const renderGoalNames = (goalsArray, memberName) => {
    if (!Array.isArray(goalsArray) || goalsArray.length === 0) return "Automated Linkage";

    const allGoals = [defaultGoal, ...multiLinkageGoalData, ...goalData];

    const sortedGoals = [...goalsArray].sort(
      (a, b) => a.linkage_priority - b.linkage_priority
    );


    const result = sortedGoals.map(({ linkage_goal_id, member_id }) => {

      const match = allGoals.find((g) => String(g.value) === String(linkage_goal_id));

      if (!match) return null;

      // let memberName = match.member_name;

      // if (!memberName && member_id) {
      //   const user = UserDetails.find((u) => String(u.id) === String(member_id) ? u.name : '');
      //   memberName = user?.name || "";
      // }

      return memberName ? `${match.label} - ${memberName}` : match.label;
    }).filter(Boolean);

    return result.length ? result.join(", ") : "Automated Linkage";
  };


  const openViewAllModal = (ar) => {

    let b = [];
    for (const v of ar) {
      for (const x of multiLinkageGoalData) {
        if (v.linkage_goal_id === x.value) {
          // Find matching member name from UserDetails
          const user = UserDetails?.find((u) => u.id === x.member_name);
          const member = user?.name || x.member_name; // fallback to id if not found
          b.push({ member, goal: x.label });
          break;
        }
      }
    }
    setViewAllGoalsData(b);
    setSelectedGoalsData(true);
  };

  useEffect(() => {
    if (window.location.href.includes('openLinkYourStatement=1')) {
      setTimeout(() => {
        setAssetsDetails(prev => ({ ...prev, asset_sub_name_uuid: 'liquid' }));
        // setSelectedOption('Liquid');
      }, 1000);
    }
  }, []);

  const getBrokersList = async () => {
    const rid = uuidv4();
    const ts = new Date().toISOString();
    const loginPayload = {
      header: {
        rid: rid,
        ts: ts,
        channelId: "finsense",
      },
      body: {
        userId: "channel@fintoo",
        password: "85a333fb49044c7e91611a0d962ff8ba",
      },
    };

    const url =
      "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/User/Login";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginPayload),
    };

    const loginResponse = await fetch(url, options);

    if (loginResponse.status === 200) {
      const responseData = await loginResponse.json();
      const token = responseData.body.token;

      // try {
      //   let fir_request_payload = {
      //     header: {
      //       rid: rid,
      //       ts: ts,
      //       channelId: "finsense",
      //     },
      //     body: {
      //       custId: cust_id,
      //       consentId: consent_id,
      //       consentHandleId: consent_handle,
      //       dateTimeRangeFrom: daterange_from,
      //       dateTimeRangeTo: daterange_to,
      //     },
      //   };

      //   const requestBody = JSON.stringify(fir_request_payload);

      //   const requestOptions = {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //     body: requestBody,
      //   };

      //   fetch(
      //     "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIRequest",
      //     requestOptions
      //   )
      //     .then((response) => response.json())
      //     .then((data) => {
      //       if (data.body && data.body.sessionId) {
      //         setUserSessionId(data.body.sessionId);
      //         FIStatus(
      //           data.body.sessionId,
      //           cust_id,
      //           consent_handle,
      //           consent_id,
      //           token,
      //           daterange_from,
      //           daterange_to
      //         );
      //       } else {
      //         setIsLoading(false);
      //         toastr.options.positionClass = "toast-bottom-left";
      //         toastr.error("Could not fetch session id from the bank");
      //       }
      //     })
      //     .catch((error) => {
      //       console.log("Error:", error);
      //     });
      // } catch (e) {
      //   console.log("Error", e);
      // }
    }
  }

  const getfpgoalsdata = async (fplogid) => {
    try {

      let fpgoals_res = await getGoalDetails(getParentUserId());

      if (fpgoals_res["status_code"] == "200") {
        var family_array = [];
        var family__multi_linkage_array = [];
        var family_array1 = [];

        // Add the automated linkage field at the beginning
        // family_array.push({
        //   value: 0,
        //   label: "Automated Linkage",
        // });

        var family = fpgoals_res["data"];
        const hasUniqueIds = (arr) => {
          const idSet = new Set();
          for (const obj of arr) {
            if (idSet.has(obj.name)) return false;
            idSet.add(obj.name);
          }
          return true;
        };
        if (hasUniqueIds(family)) {
          family.forEach((goal) => {
            // If any specific ID logic is needed, use this condition
            // if (goal.goal_category_type === "Retirement") {
            //   setRetirementGoalId(goal.name);
            // }

            const goalObj = {
              value: goal.name,
              label: goal.user_goal_name,
              goal_end_date: goal.user_goal_end_date,
              goal_start_date: goal.user_goal_start_date,
              goal_isRecurring: goal.goal_isRecurring ? "1" : "0",
            };

            family_array.push(goalObj);
            family__multi_linkage_array.push({
              ...goalObj,
              member_name: goal.user_goal_for,
            });
            family_array1.push(goalObj);
          });
        }

        setGoalData(family_array);
        setMultiLinkageGoalData(family__multi_linkage_array);
        setUnchangedGoalData(family_array1);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getRentalIncome = async (fplogid) => {
    try {
      const getIncomeData = await getIncomeDetails(user_data.user_id);
      if (getIncomeData["status_code"] == "200") {
        var rental_income = [];
        var incomedata = getIncomeData["data"];
        incomedata.map((v) => {
          if (v.income_category_type && v.income_category_type == "Rental") {
            rental_income.push({ value: v.name, label: v.user_income_amount });
          }
        });
        setRentalIncomeData(rental_income);
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const [assetsId, setAssetsId] = useState("");
  const [assetType, setAssetType] = useState("");
  const addAssetsSubmit = async (e) => {
    e.preventDefault();
    if (assetsDetails.user_asset_user_id == 0) {
      // var fp_log_id = fplogid;
      var user_id = getParentUserId();
      setAssetsDetails({
        ...assetsDetails,
        user_asset_user_id: user_id,
        // fp_log_id: fp_log_id,
      });
    }
    if (simpleValidator.current.allValid()) {
      addAssets(e);
    } else {
      // Form is not valid, handle or display error messages
      simpleValidator.current.showMessages();
    }
  };

  const updateAssetsSubmit = async (e) => {
    e.preventDefault();

    if (simpleValidator.current.allValid()) {
      updateAssets(e);
    } else {
      // Form is not valid, handle or display error messages
      simpleValidator.current.showMessages();
    }
  };
  const deleteDMFAsset = async (id) => {
    try {
      if (assetType == "realestate") {
        var payload = {
          inv_type: "real_estate",
          inv_id: id.toString(),
          user_id: getUserId(),
          data_belongs_to: DATA_BELONGS_TO
        };
      } else if (assetType == "liquid") {
        var payload = {
          inv_type: "liquid",
          inv_id: id.toString(),
          user_id: getUserId(),
          data_belongs_to: DATA_BELONGS_TO
        };
      } else {
        var payload = {
          inv_type: "gold",
          inv_id: id.toString(),
          user_id: getUserId(),
          data_belongs_to: DATA_BELONGS_TO
        };
      }
      let url = DELETE_OTHER_INVESTMENTS;

      let deleteassetData = await apiCall(url, payload, true, false);
      if (deleteassetData["error_code"] == "100") {
        setAssetType("");
        setShow(false);
        var msg = assetName ? " - " + assetName : "";
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          categoryDetail +
          "-" +
          subCategoryDetails +
          msg +
          " Data Deleted Successfully"
        );
        getAssetData(fpLogId, 0);
        dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        scrollToList();
        setAssetsDetails(defaultAssetDetails);
        setSelectedOption("Equity");
        setSelectedSubOption("Equity Mutual Funds");
        setAssetsDetails({
          ...defaultAssetDetails,
          user_id: getUserId(),
          user_asset_for: familyData["0"].value,
        });
        setSelectedGoals("Automated Linkage");
        setSelectedGoalsId([]);
        setSelectedPriorityArray([]);
        setAutoMatedGoal(true);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };


  const deleteAssetData = async (id) => {
    const filteredData = assetsData?.filter(
      (item) => item.user_asset_source === "External" && item.asset_sub_name_uuid == "equity_shares"
    );
    const lengthOfFilteredData = filteredData.length;
    if (assetType) {
      deleteDMFAsset(id);
    } else {
      try {

        let filteredIds = selectedCategories.filter(id => assetsData.find(asset => asset.name === id && asset.user_asset_source === "External"));
        let external_data = [];
        filteredIds.forEach(id => {
          let asset = assetsData.find(asset => asset.name === id);
          if (asset) {
            external_data.push({
              asset_unique_code: asset.asset_unique_code,
              user_asset_for: asset.user_asset_for,
              asset_folio_number: asset.asset_folio_number
            });
          }
        });

        const ecasData = assetsData?.filter(entry => entry.user_asset_source === 'External' && ["equity_mf","debt_mf","gold_etf_mf"].includes(entry.asset_sub_name_uuid));
        const data_count_by_id = ecasData.reduce((accumulator, entry) => {
          accumulator[entry.user_asset_for] = (accumulator[entry.user_asset_for] || 0) + 1;
          return accumulator;
        }, {});

        const delete_all_data_keys = [];
        for (const memberId in data_count_by_id) {
          const countInExternalData = external_data.filter(entry => entry.user_asset_for === Number(memberId)).length;
          if (countInExternalData === data_count_by_id[memberId]) {
            delete_all_data_keys.push(memberId);
          }
        }

        // let url = ADVISORY_DELETE_ASSETS_API;



        let payload = {
          // id: selectedCategories,
          // external_data: external_data,
          // delete_all_data_keys: delete_all_data_keys,
          // user_id: getParentUserId(),
          // fp_log_id: fpLogId,
          // lengthOfFilteredData: lengthOfFilteredData,
          user_asset_id: selectedCategories.length > 0 ? selectedCategories : id,
          data_belongs_to: DATA_BELONGS_TO
        };
        setIsLoading(true);


        // let deleteassetData = await apiCall(url, payload, true, false);
        let deleteassetData = await deleteAssetDetails(payload);
        if (deleteassetData["status_code"] == "200") {
          // let payload = {
          //   url: ADVISORY_DELETE_BANK_DATA,
          //   data: {
          //     user_id: getUserId(),
          //     asset_id: id,
          //   },
          //   method: "post",
          // };
          // const r = await fetchData(payload);

          setShow(false);
          setIsLoading(false);
          var msg = assetName ? " - " + assetName : "";
          toastr.options.positionClass = "toast-bottom-left";
          toastr.success(deleteassetData.message);
          setSelectedCategories([]);
          dispatch({ type: "ASSETS_UPDATE", payload: true });
          // toastr.success(
          //   categoryDetail +
          //   "-" +
          //   subCategoryDetails +
          //   msg +
          //   " Data Deleted Successfully"
          // );
          dispatch({ type: "TRIGGER_EQUITY_HOLDING", payload: true });
          // getAssetData(fpLogId, 0);
          if (selectedCategories.length > 0) {
            let updatedAssetData = assetsData?.filter(asset => !selectedCategories.includes(asset.name))
            asset_data.current = updatedAssetData;
            setAssetsData(updatedAssetData);
          } else {
            let updatedAssetData = assetsData?.filter(asset => asset.name !== id);
            asset_data.current = updatedAssetData;
            setAssetsData(updatedAssetData);
          }
          dispatch({ type: "RELOAD_SIDEBAR", payload: true });
          scrollToList();
          setAssetsDetails(defaultAssetDetails);
          setSelectedOption("Equity");
          setSelectedSubOption("Equity Mutual Funds");
          setAssetsDetails({
            ...defaultAssetDetails,
            user_id: getUserId(),
            // fp_log_id: session["data"]["user_details"]["fp_log_id"],
            user_asset_for: familyData["0"].value,
          });
          setSelectedGoals("Automated Linkage");
          setSelectedGoalsId([]);
          setSelectedPriorityArray([]);
          setLinkageDetails([])
          setAutoMatedGoal(true);
        } else {
          setIsLoading(false);
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error("Something went wrong");
        }
      } catch (err) {
        setIsLoading(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    }
  };

  const addAssets = async (e) => {
    e.preventDefault();
    if (assetsDetails.subcategorydetail != "Multi Assets Linkage") {
      try {
        let payload = assetsDetails;

        if (assetsDetails.user_asset_automated_linkage === true || assetsDetails.user_asset_automated_linkage === 1) {
          payload.user_asset_automated_linkage = 1;
          payload.user_asset_is_linkable = 1
          payload.linkage_details = linkageDetails.length > 0 ? linkageDetails : [];
        } else {
          payload.user_asset_automated_linkage = 0;
          payload.user_asset_is_linkable = 0;
          payload.linkage_details = [];
        }


        if (payload.asset_type_name_uuid == 'us_equity') {
          if (payload.user_asset_currency == 'Dollar') {
            payload.user_asset_currency = 'Dollar';
          } else {
            payload.user_asset_currency = 'INR';
          }
        }

        payload.user_id = getParentUserId();
        payload.fp_log_id = fpLogId;
        payload.asset_source = "1";

        if (assetsDetails.asset_type_name_uuid == "gratuity") {
          if (retirementGoalID) {
            payload.asset_goal_link_id = retirementGoalID.toString();
          } else {
            payload.asset_goal_link_id = "";
          }
        }

        if (assetsDetails.asset_sub_category_id == "equity_shares") {
          payload.asset_unique_code = payload.scheme_equityshare.isin;
        }

        setIsLoading(true);
        // Remove unwanted keys from payload whose value is empty, null, or 'none'
        Object.keys(payload).forEach(key => {
          if (payload[key] === '' || payload[key] === null || payload[key] === 'none') {
            delete payload[key];
          }
        });
        let addassetData = await saveUserAssetDetails(payload);
        if (addassetData["status_code"] == "200") {
          var checkFirstSave = 1;
          var msg = assetsDetails.subcategorydetail
            ? " - " + assetsDetails.user_asset_name
            : "";
          // var addedAsset = addassetData["asset"];
          // let existingAssetsData = assetsData;
          // setAssetsData((prev) => {
          //   const newState = [...prev, addedAsset];
          //   let assetLength = newState.length;
          //   if (checkFirstSave == 1 && assetLength == 1) {
          //     localStorage.setItem("assetLiabilityCookie", 1);
          //     dispatch({ type: "RELOAD_SIDEBAR", payload: true });
          //   } else {
          //     localStorage.removeItem("assetLiabilityCookie");
          //     dispatch({ type: "RELOAD_SIDEBAR", payload: true });
          //   }
          //   return newState
          // });
          // asset_data.current = [...existingAssetsData, ...[addedAsset]];
          getAssetData(checkFirstSave);
          // await getAssetData(fpLogId, checkFirstSave);
          scrollToList();
          toastr.options.positionClass = "toast-bottom-left";
          toastr.success(addassetData.message);
          // dispatch({ type: "RELOAD_SIDEBAR", payload: true });
          setAssetsDetails({
            ...defaultAssetDetails,
            user_id: getUserId(),
            // fp_log_id: session["data"]["user_details"]["fp_log_id"],
            user_asset_for: familyData["0"].value,
          });
          setSelectedOption(defaultAssetDetails.asset_name);
          setSelectedSubOption("Equity Mutual Funds");
          setAddForm(true);
          setUpdateForm(false);
          setGoalSelected(false);
          setSelectedGoals("Automated Linkage");
          setSelectedGoalsId([]);
          setSelectedPriorityArray([]);
          setLinkageDetails([])
          setAutoMatedGoal(true);
          setIsLoading(false);

        } else {
          setIsLoading(false);
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error("Something went wrong");
        }
      } catch (err) {
        setIsLoading(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    }
  };

  const updateDMFAsset = async (e, asset_type) => {
    e.preventDefault();
    try {
      if (asset_type == "realestate") {
        var updateassetData = await apiCall(DMF_ADD_EDIT_REALESTATE, {
          user_id: getUserId(),
          property_name: assetsDetails.user_asset_name,
          property_type: assetsDetails.subcategorydetail,
          purchase_rate: assetsDetails.user_asset_avg_purchase_price.toString(),
          current_rate: assetsDetails.user_asset_investment_amount.toString(),
          purchase_date: moment(assetsDetails.user_asset_purchase_date).format(
            "DD/MM/YYYY"
          ),
          pincode: assetsDetails.user_asset_pincode,
          residential_type:
            assetsDetails.user_asset_property_type,
          ownership:
            assetsDetails.asset_isMortgage == "1" ? "mortgage" : "freehold",
          is_active: "1",
          update: "",
          realestate_id: assetsDetails.id,
          city: assetsDetails.user_asset_city_type,
          asset_rental_income: assetsDetails.asset_rental_income,
          user_asset_automated_linkage: assetsDetails.user_asset_automated_linkage ? "1" : "0",
          user_asset_allocation: assetsDetails.user_asset_allocation,
        });
      } else if (asset_type == "gold") {
        if (assetsDetails.asset_sub_category_id == "commodity_others") {
          var updateassetData = await apiCall(DMF_ADD_EDIT_GOLD, {
            user_id: getUserId(),
            gold_type: assetsDetails.user_asset_name,
            units: parseInt(assetsDetails.user_asset_quantity),
            purchase_date: moment(
              assetsDetails.user_asset_purchase_date,
              "DD/MM/YYYY"
            ).format("DD/MM/YYYY"),
            user_asset_current_price: parseInt(assetsDetails.user_asset_current_price),
            user_asset_avg_purchase_price: parseInt(assetsDetails.user_asset_avg_purchase_price),
            user_asset_investment_amount: parseInt(assetsDetails.user_asset_investment_amount),
            user_asset_quantity: parseInt(assetsDetails.user_asset_quantity),
            user_asset_current_amount: parseInt(assetsDetails.user_asset_current_amount),
            asset_gold_karat: assetsDetails.asset_gold_karat,
            user_asset_automated_linkage: assetsDetails.user_asset_automated_linkage ? "1" : "0",
            gold_id: assetsDetails.id,
            update: "1",
          });
        } else if (
          assetsDetails.asset_sub_category_id == "commodity_others" ||
          assetsDetails.asset_sub_category_id == "physical_gold"
        ) {
          var updateassetData = await apiCall(DMF_ADD_EDIT_GOLD, {
            user_id: getUserId(),
            gold_type: assetsDetails.user_asset_name,
            units: parseInt(assetsDetails.user_asset_quantity),
            purchase_date: moment(
              assetsDetails.user_asset_purchase_date,
              "DD/MM/YYYY"
            ).format("DD/MM/YYYY"),
            current_price: parseInt(assetsDetails.user_asset_current_price),
            purchase_price: parseInt(assetsDetails.user_asset_avg_purchase_price),
            invested_value: parseInt(assetsDetails.user_asset_investment_amount),
            number_of_gms: parseInt(assetsDetails.user_asset_quantity),
            current_amount: parseInt(assetsDetails.user_asset_current_amount),
            user_asset_automated_linkage: assetsDetails.user_asset_automated_linkage ? "1" : "0",
            gold_id: assetsDetails.id,
            update: "1",
          });
        } else {
          var updateassetData = await apiCall(DMF_ADD_EDIT_GOLD, {
            user_id: getUserId(),
            gold_type: assetsDetails.user_asset_name,
            units: parseInt(assetsDetails.user_asset_quantity),
            current_price: parseInt(assetsDetails.user_asset_current_price),
            purchase_price: parseInt(assetsDetails.user_asset_avg_purchase_price),
            invested_value: parseInt(assetsDetails.user_asset_investment_amount),
            number_of_gms: parseInt(assetsDetails.user_asset_quantity),
            current_amount: parseInt(assetsDetails.user_asset_current_amount),
            user_asset_automated_linkage: assetsDetails.user_asset_automated_linkage ? "1" : "0",
            gold_id: assetsDetails.id,
            update: "1",
          });
        }
      } else if (asset_type == "liquid") {
        var updateassetData = await apiCall(DMF_ADD_EDIT_LIQUID, {
          user_id: getUserId(),
          asset_type: assetsDetails.user_asset_name,
          purchase_date: assetsDetails.user_asset_purchase_date,
          current_balance: assetsDetails.user_asset_investment_amount,
          user_asset_automated_linkage: assetsDetails.user_asset_automated_linkage ? "1" : "0",
        });
      }

      if (updateassetData["error_code"] == "100") {
        var msg = assetsDetails.subcategorydetail
          ? " - " + assetsDetails.subcategorydetail
          : "";
        getAssetData(0);
        scrollToList();
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          assetsDetails.categorydetail + msg + " updated succesfully"
        );
        // dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        setAssetsDetails({
          ...defaultAssetDetails,
          user_id: getUserId(),
          user_asset_for: familyData["0"].value,
        });
        setSelectedOption(defaultAssetDetails.asset_name);
        setSelectedSubOption("Equity Mutual Funds");
        setAddForm(true);
        setUpdateForm(false);
        setGoalSelected(false);
        // setSelectedGoals('Automated Linkage')
        setSelectedGoalsId([]);
        setSelectedPriorityArray([]);
        setLinkageDetails([])
        setAutoMatedGoal(true);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
      const updatemultiplegoals = await apiCall(
        ADVISORY_UPDATE_MULTIPLE_GOALS_API,
        {
          asset_goal_link_id: selectedGoalsId,
          inv_id: assetsDetails.id,
          asset_type: assetsDetails.asset_type,
        }
      );
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };
  const updateAssets = async (e) => {

    if (assetsDetails.asset_type && assetsDetails.asset_type !== "none") {
      updateDMFAsset(e, assetsDetails.asset_type);
    } else {
      e.preventDefault();

      try {
        let payload = {
          ...assetsDetails,
          asset_id: assetsDetails.name,
          user_id: getParentUserId(),
          user_asset_name: assetsDetails.user_asset_name,
          user_asset_currency: assetsDetails.user_asset_currency,
          user_asset_purchase_date: assetsDetails.user_asset_purchase_date,
          user_asset_end_date: assetsDetails.user_asset_end_date,
          user_asset_occurance: assetsDetails.user_asset_occurance,
          user_asset_freq: assetsDetails.user_asset_freq,
          user_asset_quantity: assetsDetails.user_asset_quantity,
          user_asset_investment_amount: assetsDetails.user_asset_investment_amount,
          user_asset_sip_amount: assetsDetails.user_asset_sip_amount || 0,
          user_asset_ror: assetsDetails.user_asset_ror,
          user_asset_growth_rate: assetsDetails.user_asset_growth_rate,
          user_asset_avg_purchase_price: assetsDetails.user_asset_avg_purchase_price,
          user_asset_automated_linkage: assetsDetails.user_asset_automated_linkage,
          user_asset_maturity_date: assetsDetails.user_asset_maturity_date,
          user_asset_maturity_amount: assetsDetails.user_asset_maturity_amount,
          user_asset_gratuity_amount: assetsDetails.user_asset_gratuity_amount,
          user_asset_epf_employee: assetsDetails.user_asset_epf_employee || 0,
          user_asset_epf_employer: assetsDetails.user_asset_epf_employer || 0,
          user_asset_installment_paid: assetsDetails.user_asset_installment_paid,
          user_asset_payout_type: assetsDetails.user_asset_payout_type,
          user_asset_pincode: assetsDetails.user_asset_pincode,
          user_asset_allocation: assetsDetails.user_asset_allocation,
          user_asset_valid_till: assetsDetails.user_asset_valid_till,
          user_asset_user_id: assetsDetails.user_asset_user_id,
          user_asset_for: assetsDetails.user_asset_for,
          user_asset_context: assetsDetails.user_asset_context || "Individual",
          user_asset_belongs_to: assetsDetails.user_asset_belongs_to || DATA_BELONGS_TO,
          user_asset_city_type: assetsDetails.user_asset_city_type || "",
          user_asset_goal_linkage_ids: assetsDetails.user_asset_goal_linkage_ids || null,
          // // asset_cat_id: assetsDetails.asset_cat_id,
          // // asset_sub_cat_id: assetsDetails.asset_sub_cat_id,
          asset_type_name: assetsDetails.asset_type_name,
          asset_category_type: assetsDetails.asset_category_type,
          asset_sub_category_type: assetsDetails.asset_sub_category_type,
          asset_unique_code: assetsDetails.asset_unique_code,
          user_asset_source: assetsDetails.user_asset_source || "Manual",
          user_asset_occurance: assetsDetails.user_asset_occurance,
          user_asset_ownership: assetsDetails.user_asset_ownership,
          user_asset_current_amount: assetsDetails.user_asset_current_amount || 0,
          totalmaturtiyamount: assetsDetails.totalmaturtiyamount || 0,
          user_asset_avg_current_price: assetsDetails.user_asset_current_price || 0,
          user_asset_recommended: assetsDetails.user_asset_recommended || 0,
          asset_gold_karat: assetsDetails.asset_gold_karat || 0,
          asset_goal_link_id: assetsDetails.asset_goal_link_id || 0,
          asset_goalname: assetsDetails.asset_goalname || null,
          membername1: assetsDetails.membername1 || "",
          asset_name_uuid: assetsDetails.asset_name_uuid,
          asset_sub_name_uuid: assetsDetails.asset_sub_name_uuid,
          asset_type_name_uuid: assetsDetails.asset_type_name_uuid,
          scheme_equityshare: assetsDetails.scheme_equityshare || {},
          stock_mf: assetsDetails.stock_mf || null,
          stock_name: assetsDetails.stock_name || null,
          asset_pan: assetsDetails.asset_pan || null,
          subcategorydetail: assetsDetails.subcategorydetail,
        };


        if (assetsDetails.asset_sub_category_id === "equity_shares") {
          if (
            assetsDetails.user_asset_source == "External"
          ) {
            payload.asset_unique_code = assetsDetails.asset_unique_code;
          } else {
            payload.asset_unique_code = assetsDetails.scheme_equityshare?.isin || "";
          }
        }

        if (assetsDetails.user_asset_automated_linkage === true || assetsDetails.user_asset_automated_linkage === 1) {
          payload.user_asset_automated_linkage = 1;
          payload.user_asset_is_linkable = 1
          payload.linkage_details = linkageDetails.length > 0 ? linkageDetails : [];
        } else {
          payload.user_asset_automated_linkage = 0;
          payload.user_asset_is_linkable = 0;
          payload.linkage_details = [];
        }

        setIsLoading(true);
        // Remove unwanted keys from payload whose value is empty, null, or 'none'
        Object.keys(payload).forEach(key => {
          if (payload[key] === '' || payload[key] === null || payload[key] === 'none') {
            delete payload[key];
          }
        });
        const updateassetData = await UpdateAssetDetails(payload);
        if (updateassetData["status_code"] === 200) {
          setIsLoading(false);
          const id = updateassetData["data"][0]['name'];
          const asset = updateassetData["asset"];
          const index = assetsData.findIndex(item => item.id === id);

          if (index !== -1) {
            assetsData[index] = asset;
            asset_data.current[index] = asset;
          }

          scrollToList();
          toastr.options.positionClass = "toast-bottom-left";
          toastr.success(
            `${assetsDetails.user_asset_name} - ${assetsDetails.subcategorydetail || ""} updated successfully`
          );

          setAssetsDetails({
            ...defaultAssetDetails,
            user_id: getParentUserId(),
            user_asset_for: familyData["0"].value,
          });
          getAssetData(0)
          dispatch({ type: "ASSETS_UPDATE", payload: true });
          setSelectedOption(defaultAssetDetails.user_asset_name);
          setSelectedSubOption("Equity Mutual Funds");
          setAddForm(true);
          setUpdateForm(false);
          setGoalSelected(false);
          setSelectedGoals("Automated Linkage");
          setSelectedGoalsId([]);
          setLinkageDetails([])
          setSelectedPriorityArray([]);
          setAutoMatedGoal(true);
        } else {
          setIsLoading(false);
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error("Something went wrong");
        }
      } catch (err) {
        setIsLoading(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    }
  };

  const editAssetData = async (id, asset_type) => {
    setAutoMatedGoal(false);
    try {
      let asset = assetsData?.find(asset => asset.name === id);

      if (asset) {
        let msg = asset.user_asset_name ? " - " + asset.user_asset_name : "";



        let editData = {
          ...asset,
          // user_asset_for: asset.user_asset_for,
          user_asset_for: asset.user_asset_for,
          membername1: asset.membername1,
          asset_type_name_uuid: asset.asset_type_name_uuid,
          asset_type_name: asset.asset_type_name,
          user_asset_ownership: asset.user_asset_ownership,
          user_asset_valid_till: asset.user_asset_valid_till,
          user_asset_occurance: asset.user_asset_occurance,
          user_asset_allocation: asset.user_asset_allocation,
          user_asset_currency: asset.user_asset_currency,
          user_asset_payout_type: asset.user_asset_payout_type,
          user_asset_freq: asset.user_asset_freq,
          user_asset_growth_rate: asset.user_asset_growth_rate,
          user_asset_installment_paid: asset.user_asset_installment_paid,
          user_asset_automated_linkage: asset.user_asset_automated_linkage,
          user_asset_investment_amount: Number(asset.user_asset_investment_amount || 0),
          user_asset_avg_purchase_price: Number(asset.user_asset_avg_purchase_price || 0),
          user_asset_current_price: Number(asset.user_asset_current_price || 0),
          user_asset_quantity: Number(asset.user_asset_quantity || 0),
          user_asset_maturity_amount: Number(asset.user_asset_maturity_amount || 0),
          user_asset_gratuity_amount: Number(asset.user_asset_gratuity_amount || 0),
          user_asset_current_amount: Number(asset.user_asset_current_amount || 0),
          totalmaturtiyamount: Number(asset.totalmaturtiyamount || 0),
          user_asset_epf_employee: Number(asset.user_asset_epf_employee || 0),
          user_asset_epf_employer: Number(asset.user_asset_epf_employer || 0),
          user_asset_pincode: asset.user_asset_pincode ? asset.user_asset_pincode.toString() : "",
          user_asset_source: asset?.user_asset_source || "Manual"
        };
        goalData.forEach(resetPriorityKey);
        unchangedgoaldata.forEach(resetPriorityKey);
        setLinkageDetails([])
        const linkedGoals = asset.linked_goals || [];

        if (linkedGoals.length > 0) {
          let selectedGoals = [];
          let goalIds = [];
          let priorityArray = [];
          let linkage_details = []

          linkedGoals.forEach((goal) => {
            // if (goal.goal_name == "") {
            //   goal.goal_details.goal_for_name = "Family";
            // }
            selectedGoals.push(goal.goal_name);
            goalIds.push(goal.goal_id);
            priorityArray.push(goal.goal_priority);
            goalData.forEach((goal_obj) => {
              if (goal_obj.value == goal.goal_id) {
                goal_obj.priority = parseInt(goal.goal_priority);
              }
            });
            unchangedgoaldata.forEach((goal_obj) => {
              if (goal_obj.value == goal.goal_id) {
                goal_obj.priority = parseInt(goal.goal_priority);
              }
            });
            linkage_details.push({ linkage_goal_id: goal.goal_id, linkage_priority: goal.goal_priority })
          });

          setLinkageDetails(linkage_details)
          setDisableExternal(editData.user_asset_source === "External" ? true : false);
          setGoalData(goalData);
          setUnchangedGoalData(unchangedgoaldata);
          setSelectedGoals(selectedGoals.toString());
          setSelectedGoalsId(goalIds);
          setSelectedPriorityArray(priorityArray);
          setAutoMatedGoal(false);

        } else {
          setAutoMatedGoal(true);
          setSelectedGoals("Automated Linkage");
          setSelectedGoalsId([]);
          setSelectedPriorityArray([]);
          setLinkageDetails([])
        }

        setAssetsDetails(editData);
        setSelectedOption(asset.asset_category_type);
        setSelectedSubOption(asset.asset_sub_category_type);
        setSelectedSubcatOption(asset.asset_type_name)

        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(`You can now edit details for ${asset.user_asset_name}${msg}`);
        scrollToForm();

        if (asset.subcategorydetail === "saving_account") {
          setFetched(asset.user_asset_source === "External" ? true : false);
        }

      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };



  const resetPriorityKey = (obj) => {
    if ('priority' in obj) {
      delete obj.priority;
    }
  }

  const cancelAssetForm = async (e) => {
    e.preventDefault();
    setAssetsDetails({
      ...defaultAssetDetails,
      user_id: getUserId(),
      user_asset_for: familyData["0"].value,
    });
    setSelectedOption(defaultAssetDetails.user_asset_name);
    setSelectedSubOption("Equity Mutual Funds");
    setAssetEditId(" ");
    setAddForm(true);
    setUpdateForm(false);
    setGoalSelected(false);
    setSelectedGoals("Automated Linkage");
    setSelectedGoalsId([]);
    setSelectedPriorityArray([]);
    setLinkageDetails([])
    setAutoMatedGoal(true);
    // if (session["data"]["user_details"]["fp_log_id"]) {
    //   getfpgoalsdata(session["data"]["user_details"]["fp_log_id"]);
    // }
  };

  // Liability Code

  const [liabilityName, setLiabilityName] = useState("Business Loan");
  const [liabilityNameError, setLiabilityNameError] = useState("");
  const [currentOutStandingAmount, setCurrentOutStandingAmount] = useState("");
  const [currentOutStandingAmountError, setCurrentOutStandingAmountError] =
    useState("");
  const [liabilityForMember, setLiabilityForMember] = useState("");
  const [familyData, setFamilyData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [liabilityEndDate, setLiabilityEndDate] = useState(null);
  const [liabilityEndDateError, setLiabilityEndDateError] = useState("");
  const [liabilityEmiIntRateIncrease, setLiabilityEmiIntRateIncrease] =
    useState(7);
  const [liabilityCurrentEmi, setLiabilityCurrentEmi] = useState("");
  const [liabilityCurrentEmiError, setLiabilityCurrentEmiError] = useState("");
  const [liabilityFrequency, setLiabilityFrequency] = useState("1");
  const [liabilityRemarks, setLiabilityRemarks] = useState("");
  const [liabilityCatId, setLiabilityCatId] = useState(24);
  const [liabilityId, setLiabilityId] = useState("");
  const [liabGetData, setLiabGetData] = useState("");

  const [liabilityData, setLiabilityData] = useState("");
  const [session, setSession] = useState("");

  const [not_calculated, setNotCalculated] = useState("0");
  const [check_liabilityoutstandingamount, setCheckLiabilityoutstandingamount] =
    useState("");
  const [check_liabilityenddate, setCheckLiabilityenddate] = useState("");
  const [check_emi_rate, setCheckEmiRate] = useState("");
  const [check_emi, setCheckEmi] = useState("");
  const [retirmentdate, setRetirmentDate] = useState("");
  const [lifeexpectancydate, setLifeExpentancyDate] = useState("");

  const [addForm, setAddForm] = useState(true);
  const [updateForm, setUpdateForm] = useState(false);


  const checkprofile = async (sessionData) => {
    try {
      let api_data = {
        user_id: sessionData["data"]["id"],
        fp_log_id: sessionData["data"]["user_details"]["fp_log_id"],
        web: 1,
      };
      var payload_data = commonEncode.encrypt(JSON.stringify(api_data));
      var res = await apiCall(
        '',
        payload_data,
        false,
        false
      );
      let decoded_res = JSON.parse(commonEncode.decrypt(res));
      if (decoded_res["error_code"] == "100") {
        dispatch({ type: "UPDATE_PROFILE", payload: decoded_res["data"] });
        const profile_completed_mapping = {
          17: 117.496,
          50: 70.4973,
          67: 46.9982,
          83: 23.4991,
          100: 0,
        };

        const profile_completed =
          decoded_res["data"][13]["profile_completed"] === 66
            ? 67
            : decoded_res["data"][13]["profile_completed"];
        const sectionIdsToCheck = [1, 3, 5, 6, 7, 8];
        const allConditionsMet = sectionIdsToCheck.every((sectionId) => {
          const matchingEntry = decoded_res["data"].find(
            (entry) => entry.section_id === sectionId
          );
          return matchingEntry && matchingEntry.total > 0;
        });

        const sectionIdsToCheckk = [1, 3];
        const allConditionsMett = sectionIdsToCheckk.every((sectionId) => {
          const matchingEntryy = decoded_res["data"].find(
            (entry) => entry.section_id === sectionId
          );
          return matchingEntryy && matchingEntryy.total > 0;
        });

        let newNumber;
        if (allConditionsMet) {
          newNumber = "1";
        } else {
          newNumber = "0";
        }

        let newNumberr;
        if (allConditionsMett) {
          newNumberr = "1";
        } else {
          newNumberr = "0";
        }
        const sectionTextMap = {
          1: "About You",
          3: "About You",
          5: "Goals",
          6: "Income & Expenses",
          7: "Income & Expenses",
          8: "Assets & Liabilities",
        };

        const filteredData = decoded_res["data"].filter((item) =>
          [1, 3, 5, 6, 7, 8].includes(item.section_id)
        );

        const sectionsWithTotalZeroTextArray = filteredData
          .filter((item) => item.total === 0)
          .map((item) => sectionTextMap[item.section_id]);

        const uniqueSectionsWithTotalZeroTextArray = [
          ...new Set(sectionsWithTotalZeroTextArray),
        ];
        const sectionsWithTotalZeroText =
          uniqueSectionsWithTotalZeroTextArray.join(", ");

        if (
          uniqueSectionsWithTotalZeroTextArray.includes("About You") &&
          uniqueSectionsWithTotalZeroTextArray.includes("Income & Expenses") &&
          uniqueSectionsWithTotalZeroTextArray.includes("Assets & Liabilities")
        ) {
          sessionStorage.setItem("showAboutYouToast", "1");
          window.location.href =
            process.env.PUBLIC_URL + "/datagathering/about-you";
        } else if (uniqueSectionsWithTotalZeroTextArray.includes("About You")) {
          sessionStorage.setItem("showAboutYouToast", "1");
          window.location.href =
            process.env.PUBLIC_URL + "/datagathering/about-you";
        }
      }
    } catch (e) {
      console.error(e);
    }
  };
  const setDate = (date, dateType) => {
    setLiabilityEndDate(moment(date).format("DD/MM/YYYY"));
    if (dateType == "assetPurchaseDate") {
      assetsDetails.user_asset_purchase_date = moment(date).format("DD/MM/YYYY");
    }
    if (dateType == "assetendDate") {
      assetsDetails.user_asset_end_date = moment(date).format("DD/MM/YYYY");
    }
    if (dateType == "maturityDate") {
      assetsDetails.user_asset_maturity_date = moment(date).format("DD/MM/YYYY");
    }
    setAssetsDetails({
      ...assetsDetails,
      user_asset_valid_till: "",
      isEditable: true,
    });
  };

  function dateDiff(date) {
    date = date.split("/");
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const yy = parseInt(date[2]);
    const mm = parseInt(date[1]);
    const dd = parseInt(date[0]);

    let years, months, days;

    // months
    months = mm - month;
    if (day > dd) {
      months = months - 1;
    }

    // years
    years = yy - year;
    if (mm * 100 + dd < month * 100 + day) {
      years = years - 1;
      months = months + 12;
    }

    // days
    days = Math.floor(
      new Date(year + years, month + months - 1, day).getTime() /
      (24 * 60 * 60 * 1000) -
      today.getTime()
    );

    months = months + years * 12;

    return months;
  }

  function PMT(ir, np, pv, fv, type) {
    if (np != "") {
      np = dateDiff(np);
      np = np + 1;
      if (np == 1) {
        np = 2;
      }
      var pmt, pvif;

      fv || (fv = 0);
      type || (type = 0);

      if (ir === 0) return (pv + fv) / np;

      pvif = Math.pow(1 + ir, np);
      pmt = (-ir * pv * (pvif + fv)) / (pvif - 1);

      if (type === 1) pmt /= 1 + ir;

      return parseFloat(-pmt.toFixed(2)) == Infinity
        ? 0
        : parseFloat(-pmt.toFixed(2));
    }
  }

  useEffect(() => {
    setLiabilityCurrentEmi("");
    let emi_amt = 0;
    if (
      check_liabilityoutstandingamount !== currentOutStandingAmount ||
      check_liabilityenddate !== liabilityEndDate ||
      check_emi_rate !== liabilityEmiIntRateIncrease
    ) {
      setNotCalculated("0");
    }
    if (
      liabilityEmiIntRateIncrease &&
      liabilityEndDate &&
      currentOutStandingAmount &&
      not_calculated === "0"
    ) {
      emi_amt = PMT(
        (liabilityEmiIntRateIncrease * 0.01) / 12,
        liabilityEndDate,
        currentOutStandingAmount
      );

      if (`${emi_amt}`.length > 9) {
        emi_amt = Math.round(emi_amt);
      }
      setLiabilityCurrentEmi(emi_amt);
      setCheckEmi(emi_amt);
    }
  }, [
    liabilityEmiIntRateIncrease,
    liabilityEndDate,
    currentOutStandingAmount,
    not_calculated,
  ]);


  useEffect(() => {
    if (!familyData || !Array.isArray(familyData)) return;

    // Find the primary user — you can adjust this logic if needed
    const parentUser = familyData.find(member => member.label === "Self");

    if (parentUser && parentUser.dob && parentUser.retirement_age && parentUser.life_expectancy) {
      // Parse DOB in DD/MM/YYYY format
      const dobMoment = moment(parentUser.dob, "DD/MM/YYYY");

      const retirement_date = dobMoment
        .clone()
        .add(parentUser.retirement_age, "years")
        .format("DD/MM/YYYY");

      const life_expectancy_date = dobMoment
        .clone()
        .add(parentUser.life_expectancy, "years")
        .format("DD/MM/YYYY");

      setRetirmentDate(retirement_date);
      setLifeExpentancyDate(life_expectancy_date);
    }
  }, [familyData]);

  useEffect(() => {
    if (userid) {
      getRentalIncome()
    }
  }, [])


  const checksession = async () => {
    try {
      let url = '';
      // let url = CHECK_SESSION;
      let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
      let session_data = await apiCall(url, data, true, false);
      getFamilyMembers();


      getUSEquityData();
      // getbankdata();
      getConnectedBroker(session_data);

      if (session_data.error_code == "100") {
        setSession(session_data);
        checkprofile(session_data);
        var liability_payload = await apiCall(
          BASE_API_URL +
          "restapi/getuserliabilities/" +
          "?user_id=" +
          Buffer.from(
            commonEncode.encrypt(session_data.data.id.toString())
          ).toString("base64") +
          "&fp_log_id=" +
          Buffer.from(commonEncode.encrypt(fpLogId.toString())).toString(
            "base64"
          ) +
          "&web=1"
        );
        getfpgoalsdata(fpLogId);
        getRentalIncome(fpLogId);
        getCryptoData();
        var retirement_date = moment(session_data.data.user_details.dob)
          .add(session_data.data.user_details.retirement_age, "y")
          .format("DD/MM/YYYY");
        var life_expectancy_date = moment(session_data.data.user_details.dob)
          .add(session_data.data.user_details.life_expectancy, "y")
          .format("DD/MM/YYYY");
        setRetirmentDate(retirement_date);
        setLifeExpentancyDate(life_expectancy_date);
        var liability_res = liability_payload;
        getAssetData(0);
        setAddForm(true);
        setUpdateForm(false);
        if (liability_res["error_code"] == "100") {
          setLiabilityData(liability_res.data);
        } else {
          setLiabilityData([]);
        }
      } else {
        loginRedirectGuest();
      }
    } catch (error) {
      console.log(error);
      toastr.options.positionClass = "toast-bottom-left";
      // toastr.error("Something Went Wrong1");
    }
  };

  const getSchemeData = async () => {

    try {

      let getschemeData = await getSchemeDataStorage();
      if (getschemeData["status_code"] == 200) {
        setSchemeData(getschemeData["data"]["Liquid"] || []);
        setDebtfunds(getschemeData.data.Debt || []);
        setGoldfunds(getschemeData.data.Gold || []);
        setLiquidfunds(getschemeData.data.Liquid || []);
        setEQFunds(getschemeData.data.Equity || []);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (user_data) {
      getSchemeData();
      getEquitySharesData();
      getUSEquityData();
    }
  }, [])

  // get US quity data from api
  const getUSEquityData = async () => {
    try {
      const resp = await GetUsEquityShares();

      if (resp?.status_code === 200 && resp.data) {
        setUSEquity(resp.data);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const getCryptoData = async () => {
    try {
      let url = ADVISORY_GET_CRYPTO_DATA;
      let getcryptoData = await apiCall(url, {}, false, false);
      if (getcryptoData["status"] == "success") {
        var cryptolist = [];
        var crypto_data = Object.values(getcryptoData["data"]);
        var price = 0;
        crypto_data.map((v) => {
          if (v.hasOwnProperty("INR")) {
            if (v.INR.hasOwnProperty("sellPrice")) {
              price = parseFloat(v.INR.sellPrice).toFixed(2);
            }
          }
          cryptolist.push({ label: v.name, value: price });
        });
        setCryptoData(cryptolist);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const getEquitySharesData = async () => {

    try {
      // let url = ADVISORY_GET_EQUITY_SHARES_DATA;

      // let getequitysharesdata = await apiCall(url, "", true, false);
      let getequitysharesdata = await geEquitySharesList();
      if (getequitysharesdata["status_code"] == 200) {
        setEquityShares(getequitysharesdata);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const showToastMessage = async () => {
    toastr.options.positionClass = "toast-bottom-left";
    toastr.error("As there is no value available for Linkages, you cannot link any goal");
  }

  const getAssetData = async (check_first_save = 0) => {

    try {

      // let url = '';
      // let log_id = await getParentFpLogId();
      // let payload = {
      //   update_share: "1",
      //   filter_id: "0",
      //   user_id: getParentUserId(),
      //   fp_log_id: log_id,
      // };
      // let getassetData = await apiCall(url, payload, true, false);

      const getassetData = await getOtherInvestments({
        user_id: getParentUserId()
      });

      setIsDataLoading(true);
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      setIsDataLoading(false);

      getCDSLBrokers(getassetData["data"]['listing']);

      if (getassetData["status_code"] == "200" && getassetData["data"] && Array.isArray(getassetData["data"]['listing'])) {
        setTotalAssetValue(getassetData['data']['total_asset_value'])
        asset_data.current = getassetData["data"]['listing'];
        var assetLength = getassetData["data"]['listing'].length;
        setAssetsData(getassetData["data"]['listing']);
        setAssetCatData(getassetData["data"]['category_list'] || []);


        setActiveSIP(getassetData["data"]["active_sip"] || 0);
        setActiveSIPAmount(getassetData["data"]['active_sip_amount'] || 0);
        // const checkboxfilteredData = getassetData["data"]['listing'].filter(item => item.asset_sub_category_id !== 125);
        setUnfilteredAssetsData(getassetData["data"]['listing']);
        // const shouldExclude = checkboxfilteredData.length > 0 ? checkboxfilteredData.every(item => ['cams', 'karvy'].includes(item.user_asset_source)) : false;
        // setCheckboxShouldExcludel(shouldExclude)
        // const totasset = getassetData["data"]['listing'].filter(asset => asset.asset_sub_category_id !== 125);
        setfilteredAssetsDataCheck(getassetData["data"]['listing']);

        // This is for those Alternate assets, which are linkable i.e user has selected consider this in automated linkage as yes
        // const subCategoryIds = [125];
        const alternateFilteredData = getassetData["data"]['listing'].filter(item =>
          item.asset_name_uuid === 'alternate' &&
          item.user_asset_automated_linkage == "1" &&
          item.user_asset_for != 0
          // !subCategoryIds.includes(item.asset_sub_category_id)
        );
        var resultAlternateArray = alternateFilteredData.map(item => ({
          asset_id: item.id,
          value: item.asset_sub_category_id,
          label: item.subcategorydetail,
          asset_recurring: item.user_asset_occurance,
          // user_asset_investment_amount: item.user_asset_occurance === 'One Time' || item.user_asset_occurance === true ? item.user_asset_investment_amount : 0,
          user_asset_occurance: item.user_asset_occurance,
          user_asset_for: item.user_asset_for,
          user_asset_investment_amount: item.user_asset_investment_amount,
          user_asset_current_amount: item.user_asset_current_amount,
          total_linked_goals_value: item.linked_goals_id && item.linked_goals_id.length > 0 ? 1 : 0
        }));
        var newResultAlternateArray = [];
        for (var i = 0; i < resultAlternateArray.length; i++) {
          if (newResultAlternateArray.findIndex(v => v.asset_id == resultAlternateArray[i].asset_id) == -1) {
            newResultAlternateArray.push(resultAlternateArray[i]);
          }
        }
        setAlternateFilteredAssetsData((prev) => ({ ...prev, select_subclass: newResultAlternateArray, all_subclass: resultAlternateArray }))

        // This is for those Gold assets, which are linkable i.e user has selected consider this in automated linkage as yes
        const goldFilteredData = getassetData["data"]['listing'].filter(item =>
          item.asset_name_uuid === 'debt' &&
          item.user_asset_automated_linkage == "1" &&
          item.user_asset_for != 0
          // !subCategoryIds.includes(item.asset_sub_category_id)
        );

        var resultGoldArray = goldFilteredData.map(item => ({
          asset_id: item.id,
          value: item.asset_sub_category_id,
          label: item.subcategorydetail,
          asset_recurring: item.user_asset_occurance,
          // user_asset_investment_amount: item.user_asset_occurance === 'One Time' || item.user_asset_occurance === true ? item.user_asset_investment_amount : 0,
          user_asset_occurance: item.user_asset_occurance,
          user_asset_for: item.user_asset_for,
          user_asset_investment_amount: item.user_asset_investment_amount,
          user_asset_current_amount: item.user_asset_current_amount,
          total_linked_goals_value: item.linked_goals_id && item.linked_goals_id.length > 0 ? 1 : 0
        }));
        var newResultGoldArray = [];
        for (var i = 0; i < resultGoldArray.length; i++) {
          if (newResultGoldArray.findIndex(v => v.asset_id == resultGoldArray[i].asset_id) == -1) {
            newResultGoldArray.push(resultGoldArray[i]);
          }
        }
        setGoldFilteredAssetsData((prev) => ({ ...prev, select_subclass: newResultGoldArray, all_subclass: resultGoldArray }))


        // This is for those Liquid assets, which are linkable i.e user has selected consider this in automated linkage as yes
        const liquidFilteredData = getassetData["data"]['listing'].filter(item =>
          item.asset_sub_name_uuid === "liquid" &&
          item.user_asset_automated_linkage == "1" &&
          item.user_asset_for != 0
          // !subCategoryIds.includes(item.asset_sub_category_id)
        );

        var resultLiquidArray = liquidFilteredData.map(item => ({
          asset_id: item.id,
          value: item.asset_sub_category_id,
          label: item.subcategorydetail,
          asset_recurring: item.user_asset_occurance,
          // user_asset_investment_amount: item.user_asset_occurance === 'One Time' || item.user_asset_occurance === true ? item.user_asset_investment_amount : 0,
          user_asset_occurance: item.user_asset_occurance,
          user_asset_for: item.user_asset_for,
          user_asset_investment_amount: item.user_asset_investment_amount,
          user_asset_current_amount: item.user_asset_current_amount,
          total_linked_goals_value: item.linked_goals_id && item.linked_goals_id.length > 0 ? 1 : 0
        }));
        var newResultLiquidArray = [];
        for (var i = 0; i < resultLiquidArray.length; i++) {
          if (newResultLiquidArray.findIndex(v => v.asset_id == resultLiquidArray[i].asset_id) == -1) {
            newResultLiquidArray.push(resultLiquidArray[i]);
          }
        }
        setLiquidFilteredAssetsData((prev) => ({ ...prev, select_subclass: newResultLiquidArray, all_subclass: resultLiquidArray }))


        // This is for those Real Estate assets, which are linkable i.e user has selected consider this in automated linkage as yes
        const realEstateFilteredData = getassetData["data"]['listing'].filter(item =>
          item.asset_name_uuid === "real_estate" &&
          item.user_asset_automated_linkage == "1" &&
          item.user_asset_for != 0
          // !subCategoryIds.includes(item.asset_sub_category_id)
        );

        var resultRealEstateArray = realEstateFilteredData.map(item => ({
          asset_id: item.id,
          value: item.asset_sub_category_id,
          label: item.subcategorydetail,
          asset_recurring: item.user_asset_occurance,
          // user_asset_investment_amount: item.user_asset_occurance === 'One Time' || item.user_asset_occurance === true ? item.user_asset_investment_amount : 0,
          user_asset_occurance: item.user_asset_occurance,
          user_asset_for: item.user_asset_for,
          user_asset_investment_amount: item.user_asset_investment_amount,
          user_asset_current_amount: item.user_asset_current_amount,
          total_linked_goals_value: item.linked_goals_id && item.linked_goals_id.length > 0 ? 1 : 0
        }));
        var newResultRealEstateArray = [];
        for (var i = 0; i < resultRealEstateArray.length; i++) {
          if (newResultRealEstateArray.findIndex(v => v.asset_id == resultRealEstateArray[i].asset_id) == -1) {
            newResultRealEstateArray.push(resultRealEstateArray[i]);
          }
        }
        setRealEstateFilteredAssetsData((prev) => ({ ...prev, select_subclass: newResultRealEstateArray, all_subclass: resultRealEstateArray }))


        // This is for those Equity assets, which are linkable i.e user has selected consider this in automated linkage as yes
        const equityFilteredData = getassetData["data"]['listing'].filter(item =>
          item.asset_name_uuid === "equity" &&
          item.user_asset_automated_linkage == "1" &&
          item.user_asset_for != 0
          // !subCategoryIds.includes(item.asset_sub_category_id)
        );

        var resultEquityArray = equityFilteredData.map(item => ({
          asset_id: item.id,
          value: item.asset_sub_category_id,
          label: item.subcategorydetail,
          asset_recurring: item.user_asset_occurance,
          // user_asset_investment_amount: item.user_asset_occurance === 'One Time' || item.user_asset_occurance === true ? item.user_asset_investment_amount : 0,
          user_asset_occurance: item.user_asset_occurance,
          user_asset_for: item.user_asset_for,
          user_asset_investment_amount: item.user_asset_investment_amount,
          user_asset_current_amount: item.user_asset_current_amount,
          total_linked_goals_value: item.linked_goals_id && item.linked_goals_id.length > 0 ? 1 : 0
        }));
        var newResultEquityArray = [];
        for (var i = 0; i < resultEquityArray.length; i++) {
          if (newResultEquityArray.findIndex(v => v.asset_id == resultEquityArray[i].asset_id) == -1) {
            newResultEquityArray.push(resultEquityArray[i]);
          }
        }
        setEquityFilteredAssetsData((prev) => ({ ...prev, select_subclass: newResultEquityArray, all_subclass: resultEquityArray }))
        // setAddForm(true);
        // setUpdateForm(false);
        setAssetEditId("");
        simpleValidator.current.hideMessages();
        setForceUpdate((v) => ++v);
        if (check_first_save == 1 && assetLength == 1) {
          localStorage.setItem("assetLiabilityCookie", 1);
          dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        } else {
          localStorage.removeItem("assetLiabilityCookie");
          dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        }
      } else {
        asset_data.current = [];
        setAssetsData([]);
        setAssetCatData([]);
        setActiveSIP(0);
        setActiveSIPAmount(0);
        dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        toastr.options.positionClass = "toast-bottom-left";
        // toastr.error("Something went wrong");
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(err);
    }
  };
  useEffect(() => {
  }, [familyData]);

  const getFamilyMembers = async () => {
    try {
      const member_data = await getFamilyMember(user_data.user_id);
      if (member_data.status_code === '200') {

        let member_array = [];
        let filter_member = [];

        const members = member_data["data"];
        members.forEach((member) => {
          const isSelf = member.relation === "Self";
          const memberId = member.user_id;
          const parentId = member.user_parent_id;

          const label = isSelf ? "Self" : member.user_name ?? "Unnamed";

          const commonData = {
            value: memberId,
            label,
            retirement_age: member.retirement_age,
            dob: member.dob,
            life_expectancy: member.life_expectancy_age,
            isdependent: member.is_dependent,
          };

          member_array.push(commonData);
          filter_member.push({ value: memberId, label });

          if (isSelf && !parentId) {
            setLiabilityForMember(memberId);
            setAssetForMember(memberId);
            setAssetsDetails((prev) => ({
              ...prev,
              // user_asset_for: memberId,
            }));

            const assetSubCategoryIds = [
              "commodity", "ASC-30", "land", "currency", "residential_premises", "commercial", "ppf", "post_office_schemes", "ASC-25", "sovereign_gold_bonds", "ATM-40",
              "ASC-31", "ASC-27", "ASC-21", "reits", "ASC-29", "ATM-24", "ASC-28", "ATM-23",
            ];


            if (
              assetSubCategoryIds.includes(assetsDetails.asset_name_uuid) ||
              assetSubCategoryIds.includes(assetsDetails.asset_sub_name_uuid) ||
              assetSubCategoryIds.includes(assetsDetails.asset_type_name_uuid)
            ) {
              member_array.push({
                value: 0,
                label: "Family",
                retirement_age: member.retirement_age,
                dob: member.dob,
                life_expectancy: member.life_expectancy_age,
                isdependent: member.is_dependent,
              });
              filter_member.push({ value: 0, label: "Family" });
            }
          }
        });
        setFamilyData(member_array);
        setMemberData(filter_member);
      } else {
        setFamilyData([]);
        setMemberData([]);
      }
    } catch (error) {
      setFamilyData([]);
      setMemberData([]);
    }
  };



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setUpdateForm(false);
  //   if (liabilityName == "") {
  //     setLiabilityNameError("Please enter the liabiity name");
  //   }
  //   if (currentOutStandingAmount == "") {
  //     setCurrentOutStandingAmountError(
  //       "Please enter current outstanding amount"
  //     );
  //   }
  //   if (liabilityCurrentEmi == "") {
  //     setLiabilityCurrentEmiError("Please enter the liability current emi");
  //   }
  //   if (liabilityCurrentEmi <= 0) {
  //     setLiabilityCurrentEmiError("Please enter EMI amount");
  //   }
  //   if (liabilityCurrentEmi.toString().length >= 10) {
  //     setLiabilityCurrentEmiError("Please enter less than 10 digits");
  //   }
  //   if (liabilityEndDate == null) {
  //     setLiabilityEndDateError("Please enter liability end date");
  //   }

  //   if (
  //     liabilityName != "" &&
  //     currentOutStandingAmount != "" &&
  //     liabilityCurrentEmi != "" &&
  //     liabilityEndDate != null &&
  //     liabilityCurrentEmi.toString().length < 10 &&
  //     liabilityCurrentEmi != 0 &&
  //     liabilityCurrentEmi > 0
  //   ) {
  //     saveliability();
  //   }
  // };

  // const updateFormData = async (e) => {
  //   setUpdateForm(true);
  //   e.preventDefault();
  //   if (liabilityName == "") {
  //     setLiabilityNameError("Please enter the liabiity name");
  //   }
  //   if (currentOutStandingAmount == "") {
  //     setCurrentOutStandingAmountError(
  //       "Please enter current outstanding amount"
  //     );
  //   }
  //   if (liabilityCurrentEmi == "") {
  //     setLiabilityCurrentEmiError("Please enter the liability current emi");
  //   }
  //   if (liabilityCurrentEmi <= 0) {
  //     setLiabilityCurrentEmiError("Please enter EMI amount");
  //   }
  //   if (liabilityCurrentEmi.toString().length >= 10) {
  //     setLiabilityCurrentEmiError("Please enter less than 10 digits");
  //   }
  //   if (liabilityEndDate == null) {
  //     setLiabilityEndDateError("Please enter liability end date");
  //   }

  //   if (
  //     liabilityName != "" &&
  //     currentOutStandingAmount != "" &&
  //     liabilityCurrentEmi != "" &&
  //     liabilityEndDate != null &&
  //     liabilityCurrentEmi.toString().length < 10 &&
  //     liabilityCurrentEmi != 0 &&
  //     liabilityCurrentEmi > 0
  //   ) {
  //     updateliability();
  //   }
  // };

  // const saveliability = async () => {
  //   try {
  //     let session_data = session;

  //     var payload = {
  //       liability_category_id: liabilityCatId,
  //       liability_frequency: liabilityFrequency,
  //       liability_emi_rate: liabilityEmiIntRateIncrease,
  //       liability_name: liabilityName,
  //       user_id: session_data.data.id,
  //       fp_log_id: session_data.data.fp_log_id,
  //       liability_member_id: liabilityForMember,
  //       liability_asset_id: "",
  //       current_emi: liabilityCurrentEmi,
  //       liability_emi: "",
  //       liability_outstanding_amount: currentOutStandingAmount,
  //       liability_end_date: liabilityEndDate,
  //       liability_footnote: liabilityRemarks,
  //     };

  //     var payload = commonEncode.encrypt(JSON.stringify(payload));
  //     var res = await apiCall(
  //       BASE_API_URL + "restapi/saveupdateliability/",
  //       payload,
  //       false,
  //       false
  //     );

  //     let decodes_res = JSON.parse(commonEncode.decrypt(res));
  //     if ((decodes_res.error_code = "100")) {
  //       scrollToList();
  //       getfpfamilydata();
  //       var filteredCategories = liability_option.filter((lib) => {
  //         return lib.id === liabilityCatId;
  //       });
  //       var msg = liabilityName ? " - " + liabilityName : " ";
  //       toastr.options.positionClass = "toast-bottom-left";
  //       toastr.success(
  //         filteredCategories[0]["title"] + msg + " saved successfully"
  //       );

  //       setCurrentOutStandingAmount("");
  //       setSliderValue(7);
  //       setLiabilityCurrentEmi("");
  //       setLiabilityEndDate(null);
  //       setLiabilityFrequency("1");
  //       setLiabilityForMember(session_data.data.fp_user_id);
  //       setLiabilityRemarks("");
  //       setLiabilityEmiIntRateIncrease(7);
  //       setLiabilityCatId("");
  //       setLiabilityCurrentEmiError("");
  //       setLiabilityEndDateError("");
  //       setLiabilityNameError("");
  //       setLiabilityName("Business Loan");
  //       setSelectedOption1("Business Loan");
  //       setCurrentOutStandingAmountError("");
  //       setAddForm(true);
  //       setUpdateForm(false);
  //     } else {
  //       toast.error("Oops something went wrong!!", {
  //         position: "bottom-left",
  //       });
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     toast.error("Something Went Wrong", {
  //       position: "bottom-left",
  //     });
  //   }
  // };

  // const updateliability = async () => {
  //   try {
  //     let session_data = session;

  //     var payload = {
  //       liability_member_id: liabilityForMember,
  //       liability_category_id: liabilityCatId,
  //       liability_frequency: liabilityFrequency,
  //       liability_emi_rate: liabilityEmiIntRateIncrease,
  //       liability_name: liabilityName,
  //       user_id: liabGetData.user_id,
  //       fp_log_id: liabGetData.fp_log_id,
  //       liability_emi: liabGetData.liability_emi,
  //       Created_By: liabGetData.Created_By,
  //       Created_Datetime: liabGetData.Created_Datetime,
  //       Updated_By: liabGetData.Updated_By,
  //       Updated_Datetime: liabGetData.Updated_Datetime,
  //       categoryname: liabGetData.categoryname,
  //       id: liabGetData.id,
  //       liability_asset_id: liabGetData.liability_asset_id,
  //       liability_end_date: liabilityEndDate,
  //       liability_footnote: liabGetData.liability_footnote,
  //       liability_isActive: liabGetData.liability_isActive,
  //       liability_outstanding_amount: currentOutStandingAmount,
  //       liability_principle: liabGetData.liability_principle,
  //       liability_start_date: liabGetData.liability_start_date,
  //       liability_years_remaining: liabGetData.liability_years_remaining,
  //       membername: liabGetData.membername,
  //       related_asset_name: liabGetData.related_asset_name,
  //       current_emi: liabilityCurrentEmi,
  //       liability_id: liabGetData.id,
  //     };
  //     var payload = commonEncode.encrypt(JSON.stringify(payload));
  //     var res = await apiCall(
  //       BASE_API_URL + "restapi/saveupdateliability/",
  //       payload,
  //       false,
  //       false
  //     );

  //     let decodes_res = JSON.parse(commonEncode.decrypt(res));
  //     if ((decodes_res.error_code = "100")) {
  //       getfpfamilydata();
  //       scrollToList();
  //       var category_name = [liabGetData].filter((lib) => {
  //         return lib.id === decodes_res["data"]["liability_id"];
  //       });

  //       var msg = category_name[0]["liability_name"]
  //         ? " - " + category_name[0]["liability_name"]
  //         : "";
  //       toastr.success(
  //         category_name[0]["categoryname"] + msg + " updated successfully"
  //       );

  //       setCurrentOutStandingAmount("");
  //       setSliderValue(7);
  //       setLiabilityCurrentEmi("");
  //       setLiabilityEndDate(null);
  //       setLiabilityFrequency("1");
  //       setLiabilityForMember(session_data.data.fp_user_id);
  //       setLiabilityRemarks("");
  //       setLiabilityEmiIntRateIncrease(7);
  //       setLiabilityCatId("");
  //       setLiabilityCurrentEmiError("");
  //       setLiabilityEndDateError("");
  //       setLiabilityNameError("");
  //       setCurrentOutStandingAmountError("");
  //       setAddForm(true);
  //       setUpdateForm(false);
  //     } else {
  //       toast.error("Oops something went wrong!!", {
  //         position: "bottom-left",
  //       });
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     toast.error("Something Went Wrong", {
  //       position: "bottom-left",
  //     });
  //   }
  // };

  // const getfpfamilydata = async () => {
  //   try {
  //     let session_data = session;
  //     var family_payload = await apiCall(
  //       BASE_API_URL +
  //       "restapi/getfpfamilydata/" +
  //       "?parent_user_id=" +
  //       Buffer.from(
  //         commonEncode.encrypt(session_data.data.id.toString())
  //       ).toString("base64") +
  //       "&fp_log_id=" +
  //       Buffer.from(
  //         commonEncode.encrypt(session_data.data.fp_log_id.toString())
  //       ).toString("base64") +
  //       "&web=1"
  //     );
  //     getfpuserdata();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const getfpuserdata = async () => {
  //   try {
  //     let session_data = session;

  //     var user_payload = await apiCall(
  //       BASE_API_URL +
  //       "restapi/getfpuserdata/" +
  //       "?fp_user_id=" +
  //       Buffer.from(
  //         commonEncode.encrypt(session_data.data.fp_user_id.toString())
  //       ).toString("base64") +
  //       "&fp_log_id=" +
  //       Buffer.from(
  //         commonEncode.encrypt(session_data.data.fp_log_id.toString())
  //       ).toString("base64") +
  //       "&user_id=" +
  //       Buffer.from(
  //         commonEncode.encrypt(session_data.data.id.toString())
  //       ).toString("base64") +
  //       "&web=1"
  //     );
  //     getuserliability();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const getuserliability = async () => {
  //   try {
  //     let session_data = session;

  //     var liability_payload = await apiCall(
  //       BASE_API_URL +
  //       "restapi/getuserliabilities/" +
  //       "?user_id=" +
  //       Buffer.from(
  //         commonEncode.encrypt(session_data.data.id.toString())
  //       ).toString("base64") +
  //       "&fp_log_id=" +
  //       Buffer.from(
  //         commonEncode.encrypt(session_data.data.fp_log_id.toString())
  //       ).toString("base64") +
  //       "&web=1"
  //     );

  //     var liability_res = liability_payload;
  //     if (liability_res["error_code"] == "100") {
  //       setLiabilityData(liability_res.data);
  //     } else {
  //       setLiabilityData([]);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const getConnectedBroker = async (session_data) => {
    try {
      var paylod = {
        url: '',
        method: "post",
        data: {
          user_id: session_data.data.id,
          fp_log_id: session_data.data.fp_log_id,
        },
      };
      const fetchdata = await fetchEncryptData(paylod);
      if (fetchdata.error_code == "100") {
        // setBrokerData(fetchdata.data);
        setEquityHoldingsData(fetchdata.equity_holdings);
        // dispatch({
        //   type: "ASSETS_UPDATE",
        //   payload: true,
        // });
      }

      // if (!onload) makeconnection(fp_holding_auth_id);
    } catch (e) {
      console.log(e);
    }
  };

  // const getuserliabilities = async (id) => {
  //   try {
  //     let liability_id = id;
  //     setLiabilityId(id);

  //     var getliab_payload = await apiCall(
  //       BASE_API_URL +
  //       "restapi/getuserliabilities/" +
  //       "?liability_id= " +
  //       Buffer.from(commonEncode.encrypt(liability_id.toString())).toString(
  //         "base64"
  //       ) +
  //       "&web=1"
  //     );

  //     setLiabilityCurrentEmiError("");
  //     setLiabilityEndDateError(null);
  //     setCurrentOutStandingAmountError("");

  //     var lib_res = getliab_payload;
  //     if (lib_res["error_code"] == "100") {
  //       setLiabGetData(lib_res["data"]["0"]);
  //       if (lib_res.data.length > 0) {
  //         toastr.options.positionClass = "toast-bottom-left";
  //         var msg = lib_res["data"]["0"]["liability_name"]
  //           ? " - " + lib_res["data"]["0"]["liability_name"]
  //           : " ";
  //         toastr.success(
  //           " You can now edit details for " +
  //           lib_res["data"]["0"]["categoryname"] +
  //           msg
  //         );
  //         scrollToForm();
  //         setLiabilityName(lib_res["data"]["0"]["liability_name"]);
  //         setCurrentOutStandingAmount(
  //           lib_res["data"]["0"]["liability_outstanding_amount"]
  //         );
  //         setLiabilityForMember(lib_res["data"]["0"]["liability_member_id"]);
  //         setLiabilityEndDate(lib_res["data"]["0"]["liability_end_date"]);
  //         setLiabilityEmiIntRateIncrease(
  //           lib_res["data"]["0"]["liability_emi_rate"]
  //         );
  //         setLiabilityCurrentEmi(lib_res["data"]["0"]["liability_emi"]);
  //         setLiabilityFrequency(lib_res["data"]["0"]["liability_frequency"]);
  //         setSelectedOption1(lib_res["data"]["0"]["categoryname"]);
  //         setSliderValue(lib_res["data"]["0"]["liability_emi_rate"]);
  //         setLiabilityCatId(lib_res["data"]["0"]["liability_category_id"]);
  //       }
  //     } else {
  //       setLiabilityData([]);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const handleCategoryClick = (liab, type) => {
  //   let session_data = session;
  //   if (type == "liability") {
  //     setLiabilityName(liab.title);
  //     setLiabilityCatId(liab.id);
  //     setLiabilityEndDate(null);
  //     setCurrentOutStandingAmount("");
  //     setLiabilityCurrentEmi("");
  //     setLiabilityRemarks("");
  //     setLiabilityForMember(session_data.data.fp_user_id);
  //     setLiabilityEmiIntRateIncrease(7);
  //     setLiabilityFrequency("1");
  //     setAddForm(true);
  //     setUpdateForm(false);
  //     setSliderValue(7);
  //     setLiabilityCurrentEmiError("");
  //     setLiabilityEndDateError("");
  //     setLiabilityNameError("");
  //     setCurrentOutStandingAmountError("");
  //   }
  // };

  // const cancelFormData = (e) => {
  //   e.preventDefault();
  //   var filteredCategories = liability_option.filter((lib) => {
  //     return lib.id === liabilityCatId;
  //   });
  //   toastr.success(
  //     "Liabilities - " +
  //     filteredCategories[0]["title"] +
  //     " Cancelled Successfully"
  //   );
  //   let session_data = session;
  //   setLiabilityName(e.title);
  //   setLiabilityCatId(e.id);
  //   setLiabilityEndDate(null);
  //   setCurrentOutStandingAmount("");
  //   setLiabilityCurrentEmi("");
  //   setLiabilityRemarks("");
  //   setSliderValue(7);
  //   setLiabilityForMember(session_data.data.fp_user_id);
  //   setLiabilityEmiIntRateIncrease(7);
  //   setLiabilityFrequency("1");
  //   setUpdateForm(false);
  //   setAddForm(true);
  // };

  const handleClose = (type, form) => {
    if (type == "yes" && form == "liability") {
      // removeliability(liabilityId);
      // deleteassets(assetsId);
    } else if (type == "yes" && form == "asset") {
      deleteAssetData(assetsId);
    } else {
      setShow(false);
    }
  };

  // const removeliability = async (id) => {
  //   try {
  //     let session_data = session;

  //     var remove_payload = {
  //       liability_id: id,
  //       user_id: session_data.data.id,
  //       fp_log_id: session_data.data.fp_log_id,
  //     };

  //     var rem_paylod = commonEncode.encrypt(JSON.stringify(remove_payload));
  //     var rem_res = await apiCall(
  //       BASE_API_URL + "restapi/removeliability/",
  //       rem_paylod,
  //       false,
  //       false
  //     );
  //     let decoded_res = JSON.parse(commonEncode.decrypt(rem_res));
  //     if (decoded_res) {
  //       if (decoded_res.error_code == "100") {
  //         toastr.options.positionClass = "toast-bottom-left";
  //         var msg = liabilityName ? " - " + liabilityName : " ";
  //         toastr.success(
  //           selectedOption1 + msg + " has been deleted successfully"
  //         );
  //         getfpfamilydata();
  //         setShow(false);
  //         setCurrentOutStandingAmount("");
  //         setSliderValue(7);
  //         setLiabilityCurrentEmi("");
  //         setLiabilityEndDate(null);
  //         setLiabilityFrequency("1");
  //         setLiabilityForMember(session_data.data.fp_user_id);
  //         setLiabilityRemarks("");
  //         setLiabilityEmiIntRateIncrease(7);
  //         setLiabilityCatId("");
  //         setLiabilityCurrentEmiError("");
  //         setLiabilityEndDateError("");
  //         setLiabilityNameError("");
  //         setLiabilityName("Business Loan");
  //         setSelectedOption1("Business Loan");
  //         setCurrentOutStandingAmountError("");
  //         setAddForm(true);
  //         setUpdateForm(false);
  //       } else {
  //         toastr.options.positionClass = "toast-bottom-left";
  //         toastr.error(decoded_res.data);
  //         setShow(false);
  //       }
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  const fetchFilter = () => {
    setOpenPanel(true);
  };
  function handleResize() {
    if (window.innerWidth < 768) {
      setSidePanelWidth(100);
    } else {
      setSidePanelWidth(30);
    }
  }

  const closeFilter = () => {
    setCategory(0)
    setFilterName("")
    setOpenPanel(false);
    setSelectedBrokers([]);
  }

  function applyFilter() {
    setOpenPanel(false);
    $("#no-result-msg").text("");
    $("#no-result-msgg").text("");

    if (!asset_data.current || !Array.isArray(asset_data.current)) return;

    const isIndividual = subtab === "individual";

    // -------------------------
    // Step 1: Base filter based on subtab
    // -------------------------
    let assets = isIndividual
      ? asset_data.current.filter(a => a.subcategorydetail !== "Multi Assets Linkage")
      : asset_data.current.filter(a => a.subcategorydetail === "Multi Assets Linkage");

    let filtered = [...assets];

    // -------------------------
    // Step 2: Filter by Category
    // -------------------------
    if (category) {

      // All possible IDs (subcategory IDs + asset type IDs)
      const categoryIds = category.subcategories.flatMap(sub => [
        sub.asset_sub_id,
        ...(sub.asset_types?.map(t => t.asset_type_id) || [])
      ]);

      // Match either the main category id or any subcategory/type within it
      filtered = filtered.filter(a =>
        a.asset_cat_id === category.asset_id ||
        categoryIds.includes(a.asset_sub_cat_id) ||
        categoryIds.includes(a.user_asset_type_id)
      );
    }

    // -------------------------
    // Step 3: Filter by Subcategory / Asset Type
    // -------------------------
    if (selectedSubcategory.length > 0) {

      filtered = filtered.filter(a =>
        selectedSubcategory.includes(a.asset_sub_cat_id) ||
        selectedSubcategory.includes(a.user_asset_type_id) ||
        selectedSubcategory.includes(a.asset_sub_name_uuid)
      );
    }

    // -------------------------
    // Step 4: Filter by Members
    // -------------------------
    if (selectedMember.length > 0) {
      filtered = filtered.filter(a => selectedMember.includes(a.user_asset_for));
    }

    // -------------------------
    // Step 5: Filter by Brokers
    // -------------------------
    if (selectedBrokers.length > 0) {
      filtered = filtered.filter(a => selectedBrokers.includes(a.asset_broker_id));
    }

    // -------------------------
    // Step 6: No Results Message
    // -------------------------
    if (!filtered.length) {
      $("#no-result-msg").text("No Results Found");
      $("#no-result-msgg").text("No Results Found");
    }

    // -------------------------
    // Step 7: Calculate Total Active Investment (One Time)
    // -------------------------
    const totalActiveSIP = filtered.reduce((sum, a) => {
      if (
        a.user_asset_occurance === "One Time" &&
        ["equity_mf", "debt_mf", "gold_etf_mf"].includes(a.asset_sub_name_uuid)
      ) {
        return sum + Number(a.user_asset_investment_amount || 0);
      }
      return sum;
    }, 0);

    setTotalActiveSIP(totalActiveSIP);
    setAssetsData(filtered);


    const totalCurrentAmt = filtered.reduce((sum, a) => {
        return sum + Number(a.total_current_amount || 0);
    }, 0);
    
    setTotalAssetValue(totalCurrentAmt)
    // -------------------------
    // Step 8: Set Filter Name (for display)
    // -------------------------
    let names = [];

    if (category) names.push(category.asset_name);

    if (selectedSubcategory.length && category?.subcategories) {
      const subNames = category.subcategories.flatMap((sub) => {
        const items = [
          { id: sub.asset_sub_id, title: sub.asset_sub_name },
          ...(sub.asset_types?.map((type) => ({
            id: type.asset_type_id,
            title: type.asset_type_name,
          })) || []),
        ];
        return items
          .filter((item) => selectedSubcategory.includes(item.id))
          .map((item) => item.title);
      });
      names.push(...subNames);
    }

    if (selectedBrokers.length && typeof cdslBrokers !== "undefined") {
      const brokerNames = cdslBrokers
        .filter((b) => selectedBrokers.includes(b.brokerId))
        .map((b) => b.brokerName);
      names.push(...brokerNames);
    }

    if (selectedMember.length && typeof familyData !== "undefined") {
      const memberNames = familyData
        .filter((m) => selectedMember.includes(m.value))
        .map((m) => m.label);
      names.push(...memberNames);
    }

    setFilterName(names.join(", "));
  }




  function resetFilter(e) {
    setFilterBroker(false);
    setSelectedBrokers([]);
    setSelectedCategories([])
    setOpenPanel(false);
    setCategory();
    setSelectedSubcategory([]);
    setSelectedMember([]);
    setFilterText("");
    setFilterName("");
    setAssetsData(asset_data.current);
    $("#no-result-msg").text("");
    $("#no-result-msgg").text("");
    var activesip = 0;
    var total_Amt = 0;
    var data = asset_data.current;
    for (var i = 0; i < data.length; i++) {
      if (
        data[i]["user_asset_occurance"] == "One Time" &&
        (data[i]["asset_sub_name_uuid"] == "equity_mf" ||
          data[i]["asset_sub_name_uuid"] == "debt_mf" ||
          data[i]["asset_sub_name_uuid"] == "gold_etf_mf")) {
        activesip = Number(data[i]["user_asset_investment_amount"]) + activesip;
      }
      total_Amt = Number(data[i]["total_current_amount"]) + total_Amt;
    }
    var totalactivesip = activesip;
    setTotalActiveSIP(totalactivesip);

    setTotalAssetValue(total_Amt)
  }

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

  useEffect(() => {
    applyFilter();
    setSelectedCategories([])
  }, [asset_data.current, subtab]);

  useEffect(() => {
    setSelectedSubcategory([]);
    setSelectedMember([]);
  }, [category]);

  // function calculateTotalAssets() {
  //   if (!assetsData) return 0;

  //   return assetsData.reduce((total, asset) => {
  //     const investedValue = parseFloat(asset.user_asset_current_amount);
  //     return total + investedValue;
  //   }, 0);
  // }


  function calculateTotalAssets() {
    if (subtab == "individual") {
      if (!assetsData || assetsData != undefined) return 0;
      for (let i = 0; i < assetsData.length; i++) {
        let v = assetsData[i];
      }
      return assetsData?.filter(v => v.subcategorydetail != "Multi Assets Linkage").reduce((total, asset) => {
        const investedValue = parseFloat(asset.user_asset_current_amount);
        return total + investedValue;
      }, 0);
    }
    else {
      if (!assetsData) return 0;
      return assetsData?.filter(v => v.subcategorydetail == "Multi Assets Linkage").reduce((total, asset) => {
        const investedValue = parseFloat(asset.user_asset_investment_amount);
        return total + investedValue;
      }, 0);
    }
  }

  const scrollToForm = () => {
    // const { offsetTop } = document.getElementById("formBox");
    var body = document.body,
      html = document.documentElement;

    var height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    window.scroll(0, height);
  };

  const scrollToList = () => {
    window.scroll({ top: 0 });
  };

  // const scrolltoSubCategory = () => {
  //   const {offsetTop} = cntRef.current;
  //   window.scroll({top: offsetTop + 80});
  // }

  function calculateTotalLiabilities() {
    if (!liabilityData) return 0;

    return liabilityData.reduce((total, liab) => {
      const outstandingamount = parseFloat(liab.liability_outstanding_amount);
      return total + outstandingamount;
    }, 0);
  }

  useEffect(() => {
    let calculatePurchase = 0.0;
    let calculateCurrent = 0.0;
    let calculateRor = 0.0;


    if (document.getElementById("unitPrice-error")) {
      document.getElementById("unitPrice-error").innerHTML = "";
    }

    // --- Calculate Purchase ---
    if (
      assetsDetails.user_asset_quantity !== "" &&
      assetsDetails.user_asset_avg_purchase_price !== ""
    ) {

      calculatePurchase =
        parseFloat(assetsDetails.user_asset_quantity) *
        parseFloat(assetsDetails.user_asset_avg_purchase_price);
    }

    // --- Calculate Current ---
    if (
      assetsDetails.user_asset_quantity !== "" &&
      assetsDetails.user_asset_current_price !== ""
    ) {
      calculateCurrent =
        parseFloat(assetsDetails.user_asset_quantity) *
        parseFloat(assetsDetails.user_asset_current_price);
    }

    // --- Special case for category_id = 123 ---
    if (
      assetsDetails.user_asset_quantity !== "" &&
      assetsDetails.user_asset_avg_purchase_price !== ""
    ) {
      if (assetsDetails.asset_type_name_uuid === "us_equity") {
        calculatePurchase =
          parseFloat(assetsDetails.user_asset_quantity) *
          parseFloat(assetsDetails.user_asset_avg_purchase_price);
      }
    }

    if (
      assetsDetails.user_asset_quantity !== "" &&
      assetsDetails.user_asset_current_price !== ""
    ) {
      if (assetsDetails.asset_type_name_uuid === "us_equity") {
        calculateCurrent =
          parseFloat(assetsDetails.user_asset_quantity) *
          parseFloat(assetsDetails.user_asset_current_price);
      } else {
        calculateCurrent =
          parseFloat(assetsDetails.user_asset_quantity) *
          parseFloat(assetsDetails.user_asset_current_price);
      }
    }

    // --- Handle NaN cases ---
    if (Number.isNaN(calculatePurchase)) calculatePurchase = 0.0;
    if (Number.isNaN(calculateCurrent)) calculateCurrent = 0.0;

    // --- Calculate ROR ---
    if (calculatePurchase && calculateCurrent) {
      calculateRor =
        ((calculateCurrent - calculatePurchase) / calculatePurchase) * 100;
    }

    if (
      assetsDetails.user_asset_occurance === "One Time" &&
      assetsDetails.user_asset_avg_purchase_price &&
      assetsDetails.user_asset_investment_amount &&
      assetsDetails.user_asset_current_amount
    ) {
      calculateRor =
        ((calculateCurrent - assetsDetails.user_asset_avg_purchase_price) /
          assetsDetails.user_asset_avg_purchase_price) *
        100;
    }

    if (Number.isNaN(calculateRor)) calculateRor = 0.0;

    // --- Assign values (only format at the end) ---
    const updatedInvestment = calculatePurchase.toFixed(2);
    const updatedCurrent = calculateCurrent.toFixed(2);

    setAssetsDetails({
      ...assetsDetails,
      total_invested_amount: updatedInvestment,
      total_current_amount: updatedCurrent,
      user_asset_current_amount: (Number(updatedCurrent) != 0.00 || Number(updatedCurrent) != 0) ? updatedCurrent : assetsDetails.user_asset_current_amount,
      user_asset_investment_amount: (Number(updatedInvestment) != 0.00 || Number(updatedInvestment) != 0) ? updatedInvestment : assetsDetails.user_asset_investment_amount,
    });
  }, [
    assetsDetails.user_asset_quantity,
    assetsDetails.user_asset_avg_purchase_price,
    assetsDetails.user_asset_current_price,
    // assetsDetails.user_asset_current_amount,
  ]);



  useEffect(() => {
    getfpgoalsdata();
  }, [])

  useEffect(() => {
    if (UserDetails) {
      let calculatematurityamount = 0.0;
      const assetMaturityDate =
        assetsDetails.user_asset_maturity_date ||
        moment(UserDetails[0].dob, "DD/MM/YYYY")
          .add(UserDetails[0].retirement_age, "y")
          .format("DD/MM/YYYY");

      const retirmentdate = moment(UserDetails[0].dob, "DD/MM/YYYY")
        .add(UserDetails[0].retirement_age, "y")
        .format("DD/MM/YYYY")

      if (assetsDetails.asset_type_name_uuid === "epf") {
        if (assetMaturityDate) {
          calculateMaturityAmount();
        }
      } else if (
        assetsDetails.asset_type_name_uuid === "fixed_deposit" ||
        assetsDetails.asset_type_name_uuid === "government_schemes_others" ||
        assetsDetails.asset_type_name_uuid === "post_office_schemes" ||
        assetsDetails.asset_type_name_uuid === "public_bonds" ||
        assetsDetails.asset_type_name_uuid === "private_bonds" ||
        assetsDetails.asset_type_name_uuid === "debentures" ||
        assetsDetails.asset_type_name_uuid === "nsc"
      ) {
        if (
          assetsDetails?.user_asset_maturity_date &&
          assetsDetails?.user_asset_purchase_date
        ) {

          const mf_yr_f = assetsDetails.user_asset_maturity_date.split("/");
          const c_yr = assetsDetails?.user_asset_purchase_date;
          const c_yr_f = c_yr.split("/");
          const firstDate = new Date(
            parseInt(mf_yr_f[2]),
            parseInt(mf_yr_f[1]) - 1,
            parseInt(mf_yr_f[0])
          );
          const secondDate = new Date(
            parseInt(c_yr_f[2]),
            parseInt(c_yr_f[1]) - 1,
            parseInt(c_yr_f[0])
          );
          const timeDiff = Math.abs(firstDate.getTime() - secondDate.getTime());
          const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          const nper = parseFloat((diffDays / 365.2425).toFixed(2));

          calculatematurityamount = fv(
            assetsDetails.user_asset_ror,
            nper,
            0,
            assetsDetails.user_asset_investment_amount
          );

          if (assetsDetails.user_asset_payout_type === "Non-Cumulative") {
            calculatematurityamount =
              assetsDetails.user_asset_investment_amount;
          } else {
            calculatematurityamount =
              calculatematurityamount > 999999999
                ? Math.round(calculatematurityamount)
                : calculatematurityamount.toFixed(2);
          }
        }
      } else if (
        assetsDetails.asset_type_name_uuid === "ppf" ||
        assetsDetails.asset_type_name_uuid === "pension_schemes" ||
        assetsDetails.asset_type_name_uuid === "sukanya_samriddhi_yojana" ||
        assetsDetails.asset_type_name_uuid === "nps" ||
        assetsDetails.asset_type_name_uuid === "rd"
      ) {
        setAssetsDetails((prev) => ({
          ...prev,
          user_asset_maturity_date: assetMaturityDate,
          user_asset_valid_till: assetMaturityDate !== retirmentdate ? "" : "Retirement",
          user_asset_freq: assetsDetails.user_asset_freq && assetsDetails.user_asset_freq != "One Time" ? assetsDetails.user_asset_freq : "Yearly",
        }));
        if (assetMaturityDate) {
          const c_yr = new Date();
          const c_yr_date = new Date(c_yr);
          const mf_yr_f = assetMaturityDate.split("/");
          const firstDate = new Date(
            parseInt(mf_yr_f[2]),
            parseInt(mf_yr_f[1]) - 1,
            parseInt(mf_yr_f[0])
          );
          const secondDate = c_yr_date;
          const timeDiff = Math.abs(firstDate.getTime() - secondDate.getTime());
          const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          const nper = parseFloat((diffDays / 365.2425).toFixed(2));
          const month_var = {
            "Yearly": 1,
            "Quarterly": 4,
            "Half Yearly": 2,
            "Monthly": 12,
          };

          if (assetsDetails.user_asset_investment_amount) {
            const pmt =
              parseInt(assetsDetails.user_asset_investment_amount) *
              month_var[assetsDetails.user_asset_freq];

            calculatematurityamount = fv(
              assetsDetails.user_asset_ror,
              nper,
              pmt,
              assetsDetails.user_asset_current_price
            );

            calculatematurityamount =
              calculatematurityamount > 999999999
                ? Math.round(calculatematurityamount)
                : calculatematurityamount.toFixed(2);
            if (parseInt(assetsDetails.user_asset_investment_amount) == 0) {
              calculatematurityamount = 0;
            }
          }
        }
      } else if (assetsDetails.asset_type_name_uuid === "gratuity") {
        if (assetsDetails.user_asset_monthly_salary) {
          calculatematurityamount =
            (15 *
              assetsDetails.user_asset_monthly_salary *
              assetsDetails.user_asset_service_years) /
            26;

          calculatematurityamount =
            calculatematurityamount > 999999999
              ? Math.round(calculatematurityamount)
              : calculatematurityamount.toFixed(2);
        }
      }

      if (assetsDetails.user_asset_investment_amount == "") {
        setAssetsDetails((prev) => ({
          ...prev,
          user_asset_maturity_amount: Number(0),
          user_asset_gratuity_amount: Number(0),
        }));
      }

      if (
        calculatematurityamount !== 0 &&
        calculatematurityamount !== null &&
        calculatematurityamount !== undefined
      ) {
        setAssetsDetails((prev) => ({
          ...prev,
          user_asset_maturity_amount: Number(calculatematurityamount),
          user_asset_gratuity_amount: Number(calculatematurityamount),
        }));
      } else {
        setAssetsDetails((prev) => ({
          ...prev,
          user_asset_maturity_amount: Number(0),
          user_asset_gratuity_amount: Number(0),
        }));
      }

      if (assetEditId) {
        if (selectedGoals === "Automated Linkage") {
          setAutoMatedGoal(true);
          setSelectedGoals("Automated Linkage");
        } else {
          setAutoMatedGoal(false);
        }
      } else {
        setAutoMatedGoal(true);
        setSelectedGoals("Automated Linkage");
      }

      if (!assetEditId) {
        setGoalSelected(false);
        setSelectedGoalsId([]);
        setSelectedPriorityArray([]);
        getfpgoalsdata();
      }
    }
  }, [
    selectedSubOption,
    assetsDetails?.user_asset_avg_purchase_price,
    assetsDetails?.user_asset_purchase_date,
    assetsDetails?.user_asset_maturity_date,
    assetsDetails?.user_asset_payout_type,
    assetsDetails?.user_asset_ror,
    assetsDetails?.user_asset_freq,
    assetsDetails?.user_asset_current_price,
    assetsDetails?.user_asset_growth_rate,
    assetsDetails?.user_asset_service_years,
    assetsDetails?.user_asset_monthly_salary,
    assetsDetails?.user_asset_epf_employee,
    assetsDetails?.user_asset_epf_employer,
    assetsDetails?.user_asset_investment_amount,
    assetsDetails?.isEditable,
  ]);


  useEffect(() => {
    if (liabilityName != "") {
      setLiabilityNameError("");
    }
    if (currentOutStandingAmount != "") {
      setCurrentOutStandingAmountError("");
    }
    if (liabilityCurrentEmi != "") {
      setLiabilityCurrentEmiError("");
    }
    if (liabilityEndDate != null) {
      setLiabilityEndDateError("");
    }
    if (liabilityCurrentEmi.toString().length >= 10) {
      setLiabilityCurrentEmiError("Please enter less than 10 digits");
    }
    if (liabilityCurrentEmi.toString().length < 10) {
      setLiabilityCurrentEmiError("");
    }
    if (liabilityCurrentEmi.toString() == "0") {
      setLiabilityCurrentEmiError("Please enter EMI amount");
    }
  }, [
    liabilityName,
    currentOutStandingAmount,
    liabilityCurrentEmi,
    liabilityEndDate,
  ]);

  const calculateMaturityAmount = async () => {

    try {
      const payload = {
        user_id: getUserId(),
        user_asset_current_price: Number(assetsDetails.user_asset_current_amount),
        user_asset_ror: assetsDetails.user_asset_ror,
        user_asset_EPF_employee:
          assetsDetails.user_asset_epf_employee != ""
            ? Number(assetsDetails.user_asset_epf_employee)
            : 0,
        user_asset_EPF_employer:
          assetsDetails.user_asset_epf_employer != ""
            ? Number(assetsDetails.user_asset_epf_employer)
            : 0,
        user_asset_growth_rate: parseFloat(assetsDetails.user_asset_growth_rate),
        user_asset_maturity_date: assetsDetails.user_asset_maturity_date,
        data_belongs_to: DATA_BELONGS_TO
      };
      const res = await getEPFMaturityAmount(payload)
      // const res = await fetchEncryptData(payload);
      if (res["status_code"] == "200") {

        var calculatematuarityamount = Math.round(JSON.parse(res["data"], 2));

        if (calculatematuarityamount != 0) {
          setAssetsDetails((prev) => ({
            ...prev,
            user_asset_maturity_amount: calculatematuarityamount,
            totalmaturityamount: calculatematuarityamount,
          }));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const closeModal = () => {
    setGoalSelected(false);
    setSelectedGoalsmodal(false)
  };
  const selectGoals = (goals, goalId, priority) => {
    if (goals.length > 0) {
      const nameIndex = goals.indexOf("Automated Linkage");
      if (nameIndex != -1) {
        setSelectedGoals("Automated Linkage");
        setLinkageDetails([])
      } else {
        setSelectedGoals(goals.toString());
        setLinkageDetails(prev => {
          const updated = [];

          for (let i = 0; i < goals.length; i++) {
            const id = goalId[i];
            const linkage_priority = priority[i] || 1;

            updated.push({
              linkage_goal_id: id,
              linkage_priority: linkage_priority
            });
          }

          return updated;
        });
      }
    }
    if (selectedGoalsId.length > 0) {
      const index = selectedGoalsId.indexOf("");
      if (index != -1) {
        selectedGoalIdArray(selectedGoalsId.splice(index, 1));
      }
    }
    let defaultGoal = "Automated Linkage";
    goals = goals.filter(v => v && v != defaultGoal);
    if (goals.length == 0) {
      goals.push(defaultGoal);
    }
    if (categoryEditId) {
      let a = assetsData.map((v) => {
        if (v.id == categoryEditId) {
          v.selectedGoals = goals.join(", ");
        }
        return v;
      });
      setCategoryEditId(null);
      setAssetsData([...a]);
    } else {
      setSelectedGoals(goals.join(", "));
    }
  };

  const goalsInAssetsData = () => {
    let newArray = "";
    for (let i = 0; i < assetsData.length; i++) {
      if (assetsData[i]['id'] == categoryEditId) {
        newArray = assetsData[i]['selectedGoals'];
        // break;
      }
    }
    return newArray;
    // return "";
  }

  const selectedGoalIdArray = (goalIds) => {
    setSelectedGoalsId(goalIds);
  };



  const switchToggle = async (category_uuid, toggleValue) => {
    const categoryData = assetCatdata.find(item => item.asset_category_uuid === category_uuid);

    if (!categoryData) return;

    const payload = {
      user_asset_user_id: getUserId(),
      user_asset_for: categoryData?.user_asset_for || "",
      asset_sub_name_uuid: categoryData?.asset_sub_category_uuid || "",
      user_asset_automated_linkage: toggleValue ? 1 : 0,
      linkage_details: selectedGoalsId?.map((goalId, index) => ({
        linkage_goal_id: goalId,
        linkage_priority: selectedPriorityArray[index]
      })) || [],
      data_belongs_to: categoryData?.data_belongs_to || DATA_BELONGS_TO
    };

    try {
      const updateResponse = await UpdateCategoryGoalLinkage(payload);
      if (updateResponse.status_code === 200) {
        const getassetData = await getOtherInvestments({
          user_id: getUserId(),
          data_belongs_to: DATA_BELONGS_TO
        });

        if (getassetData.status_code === "200") {
          asset_data.current = getassetData.data.listing;
          setAssetsData(getassetData.data.listing);
          setAssetCatData(getassetData.data.category_list);
        }
      }
    } catch (err) {
      console.error("Error updating category linkage", err);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };



  const setPriorityArray = (priorityArray) => {
    setSelectedPriorityArray(priorityArray);
  };
  const setGoalLink = (goalIds) => {
    if (goalIds.length > 0) {
      if (selectedGoalsId.length > 0) {
        const idIndex = selectedGoalsId.indexOf("");
        if (idIndex != -1) {
          goalIds.splice(idIndex, 1);
        }
      }
      setAssetsDetails({
        ...assetsDetails,
        asset_goal_link_id: goalIds.join(","),
      });
    }
  };


  useEffect(() => {
    // if (!assetsDetails.id) {
    getFamilyMembers();
    // }
  }, [assetsDetails.asset_sub_category_id]);

  const Amounttxt = 340000;
  const selectedgoalsdatahandleClose = () => {
    setSelectedGoalsData(false)
  }
  // const selectedgoalsModalhandleClose = () => {
  //   setSelectedGoalsmodal(false)
  // }

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setDeleteToggle(false);
    }
  }, [selectedCategories]);

  const updateMultiAssetLinkageData = async (goal_id, asset_id) => {
    try {
      const categoryData = assetCatdata.find(item => item.asset_category_uuid === asset_id);
      if (!categoryData) return;
      if (subtab.toLowerCase() === "category") {
        const payload = {
          user_asset_user_id: getParentUserId(),
          user_asset_for: categoryData?.user_asset_for || "",
          asset_sub_name_uuid: categoryData?.asset_sub_category_uuid || "",
          user_asset_automated_linkage: categoryData?.category_isAutoLinkable,
          linkage_details: goal_id || [],
          data_belongs_to: categoryData?.data_belongs_to || DATA_BELONGS_TO,
        };

        const updateCategoryRes = await UpdateCategoryGoalLinkage(payload);
        if (updateCategoryRes.status_code === 200) {
          const getassetData = await getOtherInvestments({
            user_id: getParentUserId(),
            data_belongs_to: DATA_BELONGS_TO
          });
          if (getassetData.status_code === "200") {
            asset_data.current = getassetData.data.listing;
            setAssetsData(getassetData.data.listing);
            setAssetCatData(getassetData.data.category_list);
          }
        }
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };


  const transformCategoriesFromAPI = (apiResponse) => {
    return apiResponse.data[0].category_list.map((category) => ({
      title: category.asset_name,
      id: category.asset_id,
      child: category.subcategories.flatMap((sub) => {
        if (sub.asset_types && sub.asset_types.length > 0) {
          return [
            {
              title: sub.asset_sub_name,
              id: sub.asset_sub_id,
            },
            ...sub.asset_types.map((t) => ({
              title: t.asset_type_name,
              id: t.asset_type_id,
            })),
          ];
        }
        return {
          title: sub.asset_sub_name,
          id: sub.asset_sub_id,
        };
      }),
    }));
  };

  // const categories = transformCategoriesFromAPI(apiResponse);

  // Compute filtered assets once, outside of JSX
  const filteredAssets = React.useMemo(() => {
    if (!assetsData || isDataLoading) return [];

    return assetsData
      // ✅ Remove Multi Assets Linkage
      .filter(asset => asset.subcategorydetail !== "Multi Assets Linkage")

      // ✅ Apply Category filter
      .filter(asset => !category || asset.asset_cat_id === category.asset_id)

      // ✅ Apply Subcategory / Asset Types filter
      .filter(asset =>
        selectedSubcategory.length === 0 ||
        selectedSubcategory.includes(asset.asset_sub_cat_id) ||
        selectedSubcategory.includes(asset.user_asset_type_id) ||
        selectedSubcategory.includes(asset.user_asset_source)
      )

      // ✅ Apply Brokers filter
      .filter(asset =>
        selectedBrokers.length === 0 || selectedBrokers.includes(asset.asset_broker_id)
      )

      // ✅ Apply Members filter
      .filter(asset =>
        selectedMember.length === 0 || selectedMember.includes(asset.user_asset_for)
      )

      // ✅ Apply viewmore limit
      .filter((_, i) => viewmore1 === 0 ? i < 10 : true);
  }, [assetsData, category, selectedSubcategory, selectedBrokers, selectedMember, viewmore1, isDataLoading]);

  // Update filter name based on current selections
  // Function to update filter name based on selected filters
  const updateFilterName = () => {

    let names = [];

    // ✅ Category
    if (category) {
      names.push(category.asset_name);
    }

    // ✅ Subcategory / Type
    if (selectedSubcategory.length > 0 && category?.subcategories) {
      const subNames = category.subcategories.flatMap((sub) => {
        const items = [
          { id: sub.asset_sub_id, title: sub.asset_sub_name },
          ...(sub.asset_types?.map((type) => ({ id: type.asset_type_id, title: type.asset_type_name })) || []),
        ];
        return items
          .filter((item) => selectedSubcategory.includes(item.id))
          .map((item) => item.title);
      });
      names.push(...subNames);
    }

    // ✅ Brokers
    if (selectedBrokers.length > 0) {
      const brokerNames = cdslBrokers
        .filter((b) => selectedBrokers.includes(b.brokerId))
        .map((b) => b.brokerName);
      names.push(...brokerNames);
    }

    // ✅ Members
    if (selectedMember.length > 0) {
      const memberNames = familyData
        .filter((m) => selectedMember.includes(m.value))
        .map((m) => m.label);
      names.push(...memberNames);
    }

    // ✅ Join all selected filter names
    setFilterName(names.join(", "));
  };


  useEffect(() => {
    if (assetsDetails?.user_asset_for === "") {
      setAssetsDetails((prev) => ({
        ...prev,
        user_asset_for: familyData?.[0]?.value || "",
      }));
    }
  }, [assetsDetails?.user_asset_for, familyData]);


  return (
    <DatagatherLayout>
      <FintooLoader isLoading={isLoading} />
      <div className="AssetLib">
        <div className="background-div">
          <div
            className={`bg ${currentUrl.indexOf("datagathering/assets-liabilities") > -1
              ? "active"
              : ""
              }`}
            id="bg-assets"
          ></div>
        </div>
        <div className="white-box">
          <div className={`d-flex justify-content-md-center tab-box DGheaderFix DGheaderFix2 DGheaderFix3`} >
            <div className="d-flex top-tab-menu m-0">
              <div
                className={`tab-menu-item ${tab == "tab1" ? "active" : ""}`}
                onClick={() => {
                  setTab("tab1");
                  setSubTab("individual");
                }
                }
              >
                <div className="tab-menu-title">ASSETS</div>
              </div>
              <div
                className={`tab-menu-item ${tab == "tab2" ? "active" : ""}`}
                onClick={() => setTab("tab2")}
              >
                <div className="tab-menu-title">LIABILITIES</div>
              </div>
            </div>
          </div>

          <div>
            <div className={tab == "tab1" ? "d-block" : "d-none"}>
              <div className="row">
                <div className="col-md-10">
                  <div className="inner-box">
                    <div className="shimmercard br hide" id="assets-shimmer">
                      <div className="wrapper">
                        <div className="comment br animate w80" />
                        <div className="comment br animate" />
                      </div>
                    </div>
                    {/* For Total Assetsss */}
                    <div className={`${subtab == "Category" ? "FixdgHeaderasset2" : "FixdgHeaderasset"}`}>
                      {asset_data?.current && asset_data.current.length > 0 && (
                        <div className="mb-2 d-flex align-items-center justify-content-between assetsLiab">
                          <div className="d-flex">
                            <h4 className="total-amt">
                              <span
                                style={{
                                  fontWeight: "600",
                                }}
                              >
                                {" "}
                                Total Assets:{" "}
                                {/* <br className="d-md-none d-block"/> */}
                                <span className="ms-md-2">
                                  {indianRupeeFormat(totalassetvalue)}{" "}
                                </span>
                                {
                                  //console.log("asset_data", totalassetvalue)
                                }
                              </span>
                            </h4>
                            <h4 className="total-amt ms-md-5 ms-2">
                              <span style={{ fontWeight: "600" }}>
                                Active SIP{activeSIP !== 1 ? "s" : ""} ({activeSIP}
                                {activeSIP > 0 ? `): ${indianRupeeFormat(activeSIPAmount)}` : ")"}
                              </span>
                            </h4>
                          </div>
                          <div className="sorting d-inline-block">
                            {filterName != "" && (
                              <span
                                style={{
                                  // marginLeft: "26rem",
                                  fontWeight: "bold",
                                  marginRight: "1.5rem",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                {filterName}
                                <img
                                  alt="filter"
                                  onClick={resetFilter}
                                  width={28}
                                  className="ps-2"
                                  src={process.env.REACT_APP_STATIC_URL + "media/DMF/cancel.svg"}
                                />
                              </span>
                            )}
                            <a className="color-blue font-bold sort-by" onClick={fetchFilter} style={{ whiteSpace: "nowrap" }}>
                              Filter By
                              <img
                                alt="filter"
                                width={32}
                                className="ps-2"
                                src={imagePath + "/static/media/DMF/filter.svg"}
                              // src="https://images.minty.co.in/static/media/DG/filter.svg"
                              // src="https://images.minty.co.in/static/media/DG/filter.svg"
                              />
                            </a>
                          </div>
                        </div>
                      )}
                      {asset_data.current.length == 1 &&
                        session?.["data"]?.["fp_lifecycle_status"] == 2 && (
                          <div>
                            <p style={{ color: "#F0806D", paddingRight: "20px" }}>
                              Note : In asset, there should be at least one
                              self/spouse's asset.
                            </p>
                          </div>
                        )}
                      <hr style={{
                        padding: "6px 0"
                      }} className="mt-0" />
                      <div className="d-flex align-items-center justify-content-between">
                        {
                          // assetsData && assetsData.length > 0 &&
                          <div className={`d-flex align-items-center top-tab-menu `}>
                            {
                              subtab == "individual" ? <>
                                {/* checkboxShouldExcludel == false && subtab == "individual" ? <> */}
                                <FintooSubCheckbox
                                  checked={selectedCategories.length === assetsData.length}
                                  onChange={() => {
                                    if (selectedCategories.length === assetsData.length) {
                                      setSelectedCategories([]);
                                      setDeleteToggle(false);
                                    } else {
                                      const allIds = assetsData.map(asset => asset.name);
                                      setSelectedCategories(allIds);
                                      setDeleteToggle(true);
                                    }
                                  }}
                                />
                              </> : null
                            }
                            <div
                              className={`tab-menu-item ${subtab == "individual" ? "active" : ""}`}
                              onClick={() => {
                                setSubTab("individual");
                              }
                              }
                            >
                              <div className="tab-menu-title">Individual</div>
                            </div>
                            <div
                              className={`tab-menu-item ${subtab == "Category" ? "active" : ""}`}
                              onClick={() => setSubTab("Category")}
                            >
                              <div className="tab-menu-title">Category</div>
                            </div>
                          </div>
                        }
                        {
                          selectedCategories.length > 0 &&
                          deletetoggle == true && (
                            <div>
                              {unfilteredAssetsData.length > 1 && (
                                <span
                                  onClick={() => {
                                    handleShow();
                                    setAssetsId(selectedCategories);
                                    // setAssetName(asset.name);
                                    // setCategoryDetail(asset.categorydetail);
                                    // setSubCategoryDetails(
                                    //   asset.subcategorydetail
                                    // );
                                    // setAssetType(asset.asset_type);
                                  }}
                                  style={{
                                    marginRight: "2rem",
                                    cursor: "pointer"
                                  }}
                                  className="opt-options-2 pointer"
                                >
                                  {console.log("selectedCategories", selectedCategories)}
                                  <MdDelete style={{ color: "#042b62", fontSize: "1.6rem" }} />
                                </span>
                              )}
                              {session?.["data"]?.["fp_lifecycle_status"] ==
                                1 && (
                                  <span
                                    onClick={() => {
                                      handleShow();
                                      setAssetsId(selectedCategories);
                                      // setAssetName(asset .name);
                                      // setCategoryDetail(asset.categorydetail);
                                      // setSubCategoryDetails(
                                      //   asset.subcategorydetail
                                      // );
                                      // setAssetType(asset.asset_type);
                                    }}
                                    className="opt-options-2 pointer"
                                  >
                                    <MdDelete style={{ color: "#042b62", fontSize: "1.6rem" }} />
                                  </span>
                                )}             </div>
                          )
                        }
                      </div>
                    </div>
                    {/* For Inner Box */}
                    <div className={subtab == "individual" ? "d-block" : "d-none"}>
                      <div>
                        {isDataLoading && (
                          <div>
                            <div className=" inner-container mt-4 pt-4">
                              <div
                                className="shine w-25 mb-1"
                                style={{ height: ".7rem" }}
                              ></div>
                              <div
                                className="shine w-100"
                                style={{ height: ".7rem" }}
                              ></div>
                            </div>
                            <div className=" inner-container mt-4 pt-4">
                              <div
                                className="shine w-25 mb-1"
                                style={{ height: ".7rem" }}
                              ></div>
                              <div
                                className="shine w-100"
                                style={{ height: ".7rem" }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {
                          //console.log("assetsData", assetsData)
                        }
                        {/* {console.log("isDataLoading", category)} */}
                        {isDataLoading === false && filteredAssets.length > 0 ? (
                          filteredAssets.map((asset, index) => (
                            <div className="d-flex align-items-center" key={index}>
                              <div>
                                {asset.user_asset_source !== "Internal" && (
                                  <FintooSubCheckbox
                                    id={asset.name}
                                    checked={selectedCategories.includes(asset.name)}
                                    title={asset.title}
                                    onChange={() => {
                                      setSelectedCategories(prev => {
                                        if (prev.includes(asset.name)) {
                                          const updated = prev.filter(id => id !== asset.name);
                                          setDeleteToggle(updated.length > 0);
                                          return updated;
                                        } else {
                                          setDeleteToggle(true);
                                          return [...prev, asset.name];
                                        }
                                      });
                                    }}
                                  />
                                )}
                              </div>

                              <div
                                style={{
                                  marginLeft:
                                    asset.user_asset_source !== "Internal"
                                      ? "0rem"
                                      : "2rem",
                                }}
                                className="inner-container mt-4 w-100"
                              >
                                <h4>
                                  {asset.asset_category_type}{" "}
                                  {asset.asset_category_type ? " - " + asset.user_asset_name : ""}{" "}
                                  <span style={{ fontWeight: "500" }}>
                                    {(asset.user_asset_source === "External" && "(External)") ||
                                      ((asset.user_asset_source === "Internal") &&
                                        "(Internal)") ||
                                      (asset.asset_sub_category_id === "equity_shares" &&
                                        asset.user_asset_source == "External" &&
                                        "(External)") ||
                                      (asset.user_asset_source === "Manual" &&
                                        ["equity_mf", "debt_mf", "gold_etf_mf", "equity_shares"].includes(
                                          asset.asset_sub_name_uuid
                                        ) &&
                                        "(Manual)")}
                                  </span>
                                </h4>

                                <div className="row">
                                  <div className="col-md-4">
                                    <div className="display-style">
                                      <span>Value:</span>
                                      <p
                                        className="invest-show"
                                        title={indianRupeeFormat(
                                          parseFloat(
                                            asset.total_current_amount || asset.total_invested_amount
                                          )
                                        )}
                                      >
                                        {indianRupeeFormat(
                                          parseFloat(
                                            asset.total_current_amount || asset.total_invested_amount
                                          )
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="col-md-4">
                                    <div className="display-style">
                                      <span>Type: </span>
                                      <p>{asset.asset_type_name || asset.asset_sub_category_type || "Not added"}</p>
                                    </div>
                                  </div>

                                  <div className="col-md-2">
                                    <div className="display-style">
                                      <span>Member: </span>
                                      <p>{asset.user_name || "Not added"}</p>
                                    </div>
                                  </div>

                                  <div className="col-md-2">
                                    <div className="opt-options">
                                      <span>
                                        <BsPencilFill
                                          onClick={() => {
                                            editAssetData(asset.name, asset.asset_type || "none");
                                            scrollToForm();
                                            setAddForm(false);
                                            setUpdateForm(true);
                                            setAssetEditId(asset.name);
                                          }}
                                        />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          isDataLoading === false &&
                          subtab === "individual" && (
                            <div
                              style={{ textAlign: "center", fontSize: "17px", fontWeight: "bold" }}
                            >
                              No records found
                            </div>
                          )
                        )}



                        {asset_data.current && asset_data.current.length > 0 && (
                          <div
                            id="no-result-msg"
                            style={{
                              textAlign: "center",
                              fontSize: "17px",
                              fontWeight: "bold",
                              display: 'none'
                            }}
                          >
                          </div>
                        )}
                        <div className="DataGridViewform" style={{
                          padding: "0"
                        }}>
                          {assetsData && assetsData != undefined &&
                            assetsData?.filter((asset) => asset?.subcategorydetail != "Multi Assets Linkage").length > 10 && (
                              <button onClick={() => setViewMore1(viewmore1 === 0 ? 1 : 0)}>
                                {viewmore1 === 0 ? "View All" : "View Less"}
                              </button>
                            )}
                        </div>
                      </div>
                      <div className="mt-4 removefixheaderasset">
                        <div>
                          <div className="accordion">
                            <div className="accordion-panel active" id="assetbox">
                              <div className="accordion-header d-flex justify-content-between">
                                <h4 className="accordion-heading">
                                  <img
                                    alt="Asset"
                                    className="accordian-img"
                                    src={
                                      imagePath +
                                      "/static/media/DG/assets-liabilities/asset-top.svg"
                                    }
                                  />
                                  <span
                                    style={
                                      {
                                        // fontWeight: "500",
                                        // paddingTop: "2em",
                                      }
                                    }
                                  >
                                    Add Assets
                                  </span>
                                </h4>
                                <div
                                  onClick={() => setShowView(!showview)}
                                  className={`${DGstyles.HideSHowicon} hideShowIconCustom`}
                                >
                                  {showview == true ? <>-</> : <>+</>}
                                </div>
                              </div>
                              {showview && (
                                <div
                                  className={`accordion-content  family ${DGstyles.bgAssetLib}`}
                                >
                                  <div className="">
                                    <div className="container-fluid ">
                                      <div className="row">
                                        <div className="col-md-10">
                                          <label className="category-label-title">
                                            Category
                                          </label>
                                          <ul className="card-list">
                                            {options.map((v, i) => (
                                              <React.Fragment key={i}>
                                                {/* Main Category Item */}
                                                <li
                                                  className={`li-options ${selectedOption === v.title ? "active" : ""}`}
                                                  onClick={() => {
                                                    const defaultSub = v.options?.[0] || {};
                                                    setGoalSelected(false);
                                                    setSelectedGoals("Automated Linkage");
                                                    setSelectedGoalsId([]);
                                                    setSelectedPriorityArray([]);
                                                    setAutoMatedGoal(true);

                                                    const assetSubNameUUID = defaultSub.asset_sub_name_uuid || "";

                                                    setAssetsDetails({
                                                      ...defaultAssetDetails,
                                                      user_asset_type_id: defaultSub.asset_type_id || "",
                                                      asset_type_name_uuid: defaultSub.asset_type_name_uuid || "",
                                                      // // asset_sub_cat_id: defaultSub.asset_sub_cat_id || "",
                                                      // categorydetail: v.title,
                                                      // asset_name_uuid: v.assetuuid,
                                                      // // asset_cat_id: v.asset_cat_id,
                                                      asset_name: defaultSub.title || v.title,
                                                      user_asset_name: defaultSub.title || v.title,
                                                      subcategorydetail: defaultSub.title || "",
                                                      asset_sub_category_id: defaultSub.id || "",
                                                      asset_name_uuid: v.assetuuid,
                                                      asset_sub_name_uuid: assetSubNameUUID,
                                                      // user_id: user_data.user_id,
                                                      // fp_log_id: "",
                                                      // user_asset_for: assetsDetails?.user_asset_for == "" ? familyData["0"].value : assetsDetails?.user_asset_for,
                                                    });

                                                    simpleValidator.current.hideMessages();
                                                    setForceUpdate((v) => ++v);
                                                    setSelectedOption(v.title);
                                                    setSelectedSubOption(defaultSub.title || "");
                                                    setAddForm(true);
                                                    setUpdateForm(false);
                                                    getfpgoalsdata();
                                                  }}
                                                >

                                                  <label title={v.title}>
                                                    <img src={v.img} alt={v.title} />
                                                    <span>{v.title}</span>
                                                  </label>
                                                </li>
                                              </React.Fragment>
                                            ))}
                                          </ul>
                                          {/* <button onClick={() => {
                                            setSelectedOption("Liquid")
                                          }} className="btn btn-primary ">
                                            Liquid
                                          </button> */}
                                          <hr />
                                          <span>
                                            <label>{selectedOption}</label>
                                          </span>

                                          {/* Subcategory Options for Selected Category */}
                                          <ul className="card-list child" id="alternate">
                                            {options
                                              .filter((v) => v.title === selectedOption)
                                              .map((v, z) => (
                                                <React.Fragment key={z}>
                                                  {v.options.map((x, i) => {
                                                    let ror = 0;
                                                    let freq = "One Time";
                                                    let growth_rate = "10";
                                                    let user_asset_maturity_date = null;
                                                    let user_asset_end_date = "";
                                                    let tmp_asset_name = x.title;
                                                    let user_asset_currency = "INR";
                                                    let user_asset_valid_till = ""

                                                    // Handle special logic
                                                    switch (x.asset_sub_name_uuid) {
                                                      case "gratuity":
                                                        growth_rate = "5";
                                                        break;
                                                      case "ppf":
                                                      case "pension_schemes":
                                                      case "sukanya_samriddhi_yojana":
                                                      case "nps":
                                                      case "rd":
                                                        ror =
                                                          x.asset_sub_name_uuid === "ppf"
                                                            ? 7.1
                                                            : x.asset_sub_name_uuid === "nps"
                                                              ? 10
                                                              : 6.8;
                                                        freq = "Yearly";
                                                        user_asset_maturity_date = moment(retirmentdate)
                                                          .add(retirmentdate, "y")
                                                          .format("MM/DD/YYYY");
                                                        user_asset_valid_till = "Retirement"

                                                        break;
                                                      case "nsc":
                                                        ror = 6.8;
                                                        break;
                                                      case "epf":
                                                        user_asset_maturity_date = moment(retirmentdate)
                                                          .add(retirmentdate, "y")
                                                          .format("MM/DD/YYYY");
                                                        ror = 8.1;
                                                        user_asset_valid_till = "Retirement"
                                                        break;
                                                      case "us_equity":
                                                        tmp_asset_name = "";
                                                        user_asset_end_date = moment("31/12/2099", "DD/MM/YYYY").format(
                                                          "DD/MM/YYYY"
                                                        );
                                                        break;
                                                      default:
                                                        ror = 0;
                                                        break;
                                                    }

                                                    return (
                                                      <li
                                                        key={i}
                                                        onClick={() => {
                                                          setSelectedSubcatOption("");
                                                          setAssetsDetails({
                                                            ...defaultAssetDetails,
                                                            asset_name: tmp_asset_name,
                                                            user_asset_name: tmp_asset_name,
                                                            user_asset_type_id: x.asset_type_id || null,
                                                            asset_type_name_uuid: x.asset_type_name_uuid || null,
                                                            asset_sub_name_uuid: x.asset_sub_name_uuid,
                                                            asset_name_uuid: v.assetuuid,
                                                            user_asset_currency,
                                                            subcategorydetail: x.title,
                                                            asset_sub_category_id: x.asset_sub_name_uuid,
                                                            user_asset_end_date: user_asset_end_date,
                                                            user_asset_maturity_date,
                                                            user_asset_ror: ror,
                                                            user_asset_freq: freq,
                                                            user_asset_growth_rate: growth_rate,
                                                            user_asset_valid_till: user_asset_valid_till
                                                          });

                                                          setSelectedSubOption(x.title);

                                                          simpleValidator.current.hideMessages();
                                                          setForceUpdate((v) => ++v);
                                                          setAssetEditId("");
                                                          setAddForm(true);
                                                          setUpdateForm(false);
                                                          setGoalSelected(false);
                                                          setSelectedGoals("Automated Linkage");
                                                          setSelectedGoalsId([]);
                                                          setSelectedPriorityArray([]);
                                                          setLinkageDetails([])
                                                          setLinkageDetails([])
                                                          setAutoMatedGoal(true);
                                                          getfpgoalsdata();
                                                        }}
                                                        className={`li-options ${selectedSubOption === x.title || selectedSubcatOption === x.title
                                                          ? "active"
                                                          : ""
                                                          }`}
                                                      >
                                                        <label>
                                                          <img alt={x.title} src={x.img} />
                                                          <span>{x.title}</span>
                                                        </label>
                                                      </li>
                                                    );
                                                  })}
                                                </React.Fragment>
                                              ))}
                                          </ul>

                                        </div>
                                      </div>

                                      <div className="forms-container col-md-12">
                                        {selectedOption == "Alternate" && (
                                          <>
                                            <Alternate
                                              filteredAssetsData={alternateFilteredAssetsData}
                                              familyData={familyData}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              setDate={setDate}

                                              cryptodata={cryptodata}
                                              session={session}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              assetEditId={assetEditId}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              setTab={setTab}
                                            />
                                          </>
                                        )}

                                        {selectedOption == "Debt" && (
                                          <>
                                            <AssetDebt
                                              familyData={familyData}
                                              disableexternal={disableexternal}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              setDate={setDate}
                                              debtfunds={debtfunds}
                                              session={session}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              assetEditId={assetEditId}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              retirementGoalID={retirementGoalID}
                                              setTab={setTab}

                                              // liquid
                                              filteredAssetsData={liquidFilteredAssetsData}
                                              rentalincomeData={rentalincomeData}
                                              schemedata={schemedata}
                                              liquidfunds={liquidfunds}

                                            />
                                          </>
                                        )}



                                        {selectedOption == "Equity" && (
                                          <>
                                            <AssetEquity
                                              equityFilteredHoldings={equityFilteredHoldings}
                                              disableexternal={disableexternal}
                                              filterBroker={filterBroker}
                                              handleFilterBroker={handleFilterBroker}
                                              filteredAssetsData={equityFilteredAssetsData}
                                              upload_options={upload_options}
                                              familyData={familyData}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              setDate={setDate}
                                              eqfunds={eqfunds}
                                              usequity={USEquity}
                                              equityShares={equityShares}
                                              selectedOption={selectedOption}
                                              selectedSubOption={selectedSubOption}
                                              session={session}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              assetEditId={assetEditId}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              setTab={setTab}
                                            />
                                          </>
                                        )}

                                        {selectedOption == "Commodity" && (
                                          <>
                                            <AssetGold
                                              filteredAssetsData={goldFilteredAssetsData}
                                              familyData={familyData}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              setDate={setDate}
                                              goldfunds={goldfunds}
                                              session={session}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              assetEditId={assetEditId}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              setTab={setTab}
                                            />
                                          </>
                                        )}

                                        {/* {selectedOption == "Saving Account" && (
                                          <>
                                            <Liquid
                                              filteredAssetsData={liquidFilteredAssetsData}
                                              familyData={familyData}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              setDate={setDate}
                                              rentalincomeData={rentalincomeData}
                                              schemedata={schemedata}
                                              liquidfunds={liquidfunds}
                                              session={session}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              deleteAssetData={deleteAssetData}
                                              assetEditId={assetEditId}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              setTab={setTab}
                                              fetch={fetched}
                                            />
                                          </>
                                        )} */}

                                        {selectedOption == "Real Estate" && (
                                          <>
                                            <Realestate
                                              filteredAssetsData={realEstateFilteredAssetsData}
                                              familyData={familyData}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              setDate={setDate}
                                              rentalincomeData={rentalincomeData}
                                              session={session}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              assetEditId={assetEditId}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              setTab={setTab}
                                            />
                                          </>
                                        )}
                                        {selectedOption == "Upload" && (
                                          <>
                                            <AssetOthers
                                              session={session}
                                              selectedOption={selectedOption}
                                              selectedSubOption={selectedSubOption}
                                              familyData={familyData}
                                              addForm={addForm}
                                              unchangedgoaldata={unchangedgoaldata}
                                              setTab={setTab}
                                            />
                                          </>
                                        )}

                                        {selectedOption == "Others" && (
                                          <>
                                            <Others
                                              familyData={familyData}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              assetEditId={assetEditId}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              setTab={setTab}
                                            />
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={subtab == "Category" ? "d-block" : "d-none"}>

                      <div>
                        {isDataLoading && (
                          <div>
                            <div className=" inner-container mt-4 pt-4">
                              <div
                                className="shine w-25 mb-1"
                                style={{ height: ".7rem" }}
                              ></div>
                              <div
                                className="shine w-100"
                                style={{ height: ".7rem" }}
                              ></div>
                            </div>
                            <div className=" inner-container mt-4 pt-4">
                              <div
                                className="shine w-25 mb-1"
                                style={{ height: ".7rem" }}
                              ></div>
                              <div
                                className="shine w-100"
                                style={{ height: ".7rem" }}
                              ></div>
                            </div>
                          </div>
                        )}





                        {isDataLoading == false &&
                          assetCatdata
                            // &&
                            // assetCatdata?.filter((asset) => asset.subcategorydetail === "Multi Assets Linkage").filter((asset, i) => {
                            //   if (viewmore2 == 0) {
                            //     if (i < 10) {
                            //       return true;
                            //     } else {
                            //       return false;
                            //     }
                            //   } else {
                            //     return true;
                            //   }
                            // })

                            .map((asset) => (
                              <div>
                                {/* New UI */}

                                {
                                  //console.log("categorydetail", asset)
                                }
                                <div key={asset.asset_category_uuid} className="inner-container mt-4">
                                  <div className="d-md-flex justify-content-md-between align-items-center ">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <h4 className="mb-0">{asset.asset_category_type}{" "}
                                        {asset.asset_category_type ? " - " + asset.asset_sub_category_type : ""}{" "}
                                        <span style={{ fontWeight: "500" }}>
                                          {/* {(asset.user_asset_source == "ecas" || asset.user_asset_source == "cdsldemat") && "(External)"}
                                        {(asset.user_asset_source == "cams" ||
                                          asset.user_asset_source == "karvy") &&
                                          "(Internal)"} */}
                                          {/* {asset.user_asset_source == "Manual" &&
                                          (asset.asset_sub_category_id == "equity_mf" ||
                                            asset.asset_sub_category_id == "debt_mf" ||
                                            asset.asset_sub_category_id == "gold_etf_mf" ||
                                            asset.asset_sub_category_id == "62") &&
                                          "(Manual)"} */}
                                        </span></h4>
                                      <div className={`ms-4 ${AssetLibstyle.memberbox}`}>
                                        <span className={`${AssetLibstyle.membetTxt}`}>Member:</span> <span> {asset.asset_for
                                          ? asset.asset_for
                                          : "Not added"}</span>
                                      </div>
                                    </div>
                                    <div className="d-flex mt-md-0 mt-3">
                                      <div className={`${AssetLibstyle.automatedLinkage}`} style={{ fontWeight: "bold" }}>
                                        Consider This Asset In Automated Linkage*   <span
                                          className="ms-md-4 info-hover-left-box float-right"
                                          style={{
                                            position: "relative !important",
                                          }}
                                        >
                                          <span className={`icon ${AssetLibstyle.InfoIcon}`}>
                                            <img
                                              alt="More information"
                                              src={imagePath + '/static/media/more_information.svg'}
                                            />
                                          </span>
                                          <span className="msg">
                                            Select a goal below to map this investment with a goal of your choice. Otherwise, Fintoo will link it automatically with your high priority goal. In case, you do not wish to utilize this investment for any goal, select "NO".
                                          </span>
                                        </span>
                                      </div>


                                      {
                                        //console.log("asset.category_isAutoLinkable", asset.category_isAutoLinkable)
                                      }
                                      <div className="d-flex  ms-4">
                                        <div>No</div>
                                        <Switch
                                          onChange={(v) => {
                                            const updatedData = assetCatdata.map((item) => {
                                              if (item.asset_category_uuid === asset.asset_category_uuid) {
                                                return {
                                                  ...item,
                                                  category_isAutoLinkable: v ? '1' : '0',
                                                };
                                              }
                                              return item;
                                            });
                                            setAssetCatData(updatedData);
                                            switchToggle(asset.asset_category_uuid, v);
                                          }}
                                          checked={Boolean(Number(asset.category_isAutoLinkable))}
                                          className="react-switch px-2"
                                          activeBoxShadow="0 0 2px 3px #042b62"
                                          uncheckedIcon={true}
                                          checkedIcon={true}
                                          height={20}
                                          width={40}
                                          onColor="#042b62"
                                          offColor="#d8dae5"
                                        />

                                        <div>Yes</div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* {assetsDetails.user_asset_automated_linkage === true || assetsDetails.user_asset_automated_linkage === 1 && ( */}
                                  <>
                                    <div style={{ border: '1px solid rgb(231, 231, 231)' }} className="mt-3"></div>
                                    <div className={`d-md-flex justify-content-between align-items-center mt-3`}>
                                      <div className={`${AssetLibstyle.assetlibBox}`}>
                                        <div title={indianRupeeFormat(
                                          parseFloat(
                                            asset.total_current ||
                                            asset.total_invested
                                          )
                                        )} className={`${AssetLibstyle.title}`}>Total Current Value:</div>
                                        <div className={`${AssetLibstyle.totalAmount}`}>
                                          {indianRupeeFormat(
                                            parseFloat(
                                              // asset.user_asset_investment_amount ||
                                              // asset.user_asset_investment_amount
                                              asset['total_current']
                                            )
                                          )}</div>
                                      </div>

                                      <div className="d-md-block d-none" style={{ transform: 'rotate(0deg)', height: "55px", transformOrigin: '0 0', borderRight: '1px solid rgb(231, 231, 231)' }}></div>
                                      <div className={`d-md-grid d-flex ${AssetLibstyle.assetlibBox}`}>
                                        <div className={`${AssetLibstyle.title}`}>Recurring Contribution</div>
                                        <div className={`${AssetLibstyle.totalAmount}`}>{assetCatdata.length > 0 && indianRupeeFormat(parseFloat(
                                          asset.total_recurring_investment
                                        ))}</div>
                                      </div>
                                      <div className="d-md-block d-none" style={{ transform: 'rotate(0deg)', height: "55px", transformOrigin: '0 0', border: '1px solid rgb(231, 231, 231)' }}></div>
                                      <div className={`${AssetLibstyle.assetlibBox}`}>
                                        <div className={`${AssetLibstyle.title}`}>Asset Linked</div>
                                        <div className={`${AssetLibstyle.totalAmount}`}>{assetCatdata.length > 0 && indianRupeeFormat(parseFloat(
                                          asset.total_asset_value_linked
                                        ))}</div>
                                      </div>
                                      <div className="d-md-block d-none" style={{ transform: 'rotate(0deg)', height: "55px", transformOrigin: '0 0', border: '1px solid rgb(231, 231, 231)' }}></div>
                                      <div className={`${AssetLibstyle.assetlibBox}`}>
                                        <div className={`${AssetLibstyle.title}`}>Asset available for Linkages</div>
                                        <div className={`${AssetLibstyle.totalAmount}`}>
                                          {assetCatdata.length > 0 && indianRupeeFormat(parseFloat(
                                            asset.total_asset_value_for_linkages
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                  {/* )} */}
                                  {
                                    //console.log("renderGoalNames", asset)
                                  }

                                  {Boolean(Number(asset.category_isAutoLinkable))}

                                  {
                                    Boolean(Number(asset.category_isAutoLinkable)) && (
                                      <>
                                        <div style={{ border: '1px solid rgb(231, 231, 231)' }} className="mt-3"></div>
                                        <div className="d-md-flex gap-3 justify-content-between align-items-center mt-3">
                                          <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center ">
                                              <h4 className="mb-0">Selected Goals : </h4>


                                              <div className="ms-2 selectedGoals">{renderGoalNames(asset.linked_goals, asset.asset_for)}</div>
                                            </div>
                                            {!asset.linked_goals.includes(0) && (
                                              <div onClick={() => {
                                                // setSelectedGoalsData(true);
                                                openViewAllModal(asset.linked_goals);
                                              }} className={`ms-4 ${AssetLibstyle.viewallBtn}`}>View All</div>
                                            )}
                                          </div>
                                          <div style={{ justifyContent: "space-between" }} className="d-flex mt-md-0 mt-3 align-items-center">
                                            <div style={{ fontWeight: "bold" }} className={`${AssetLibstyle.LinkGoals}`}>
                                              Link This Investment Asset to Goal  <span
                                                className="ms-md-1 info-hover-left-box float-right"
                                                style={{
                                                  position: "relative !important",
                                                }}
                                              >
                                                <span className={`icon ${AssetLibstyle.InfoIcon}`}>
                                                  <img
                                                    alt="More information"
                                                    src={imagePath + '/static/media/more_information.svg'}
                                                  />
                                                </span>
                                                <span className="msg">
                                                  You can only assign goals which are prior to the end date of the asset (for Link ths asset)
                                                </span>
                                              </span>
                                            </div>

                                            <div className={`ms-4 ${AssetLibstyle.SelectGoalsbtn}`}>
                                              <button onClick={() => {
                                                // setSelectedGoalsmodal(true);
                                                if (asset['total_asset_value_for_linkages'] === 0) {
                                                  showToastMessage();
                                                } else {
                                                  setIsOpenGoalSelectionModal(true);
                                                  setCategoryEditId(asset.asset_category_uuid);
                                                }
                                              }}
                                              // disabled={asset['totalAssetValueForLinkages'] === 0}
                                              >Select Goals</button>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  }
                                </div>

                              </div>
                            ))}


                        {isDataLoading == false &&
                          (assetCatdata.length == 0 && subtab == "Category" && (
                            <div
                              style={{
                                textAlign: "center",
                                fontSize: "17px",
                                fontWeight: "bold",
                              }}
                            >No records found</div>
                          ))}

                        {asset_data.current && asset_data.current.length > 0 && (
                          <div
                            id="no-result-msgg"
                            style={{
                              textAlign: "center",
                              fontSize: "17px",
                              fontWeight: "bold",
                              display: 'none'
                            }}
                          >
                          </div>
                        )}

                        <div className="DataGridViewform" style={{
                          padding: "0"
                        }}>
                          {assetCatdata.length > 10 && (
                            <button onClick={() => setViewMore2(viewmore2 === 0 ? 1 : 0)}>
                              {viewmore2 === 0 ? "View All" : "View Less"}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 removefixheaderasset2">

                        <div>
                          <div className="accordion">
                            <div className="accordion-panel active" id="assetbox">
                              <div className="accordion-header d-flex justify-content-between pt-2">
                                <h4 className="accordion-heading">
                                  <img
                                    alt="Asset"
                                    className="accordian-img"
                                    src={
                                      imagePath +
                                      "/static/media/DG/assets-liabilities/asset-top.svg"
                                    }
                                  />
                                  <span
                                    style={
                                      {
                                        // fontWeight: "500",
                                        // paddingTop: "2em",
                                      }
                                    }
                                  >
                                    Add Assets
                                  </span>
                                </h4>
                                <div
                                  onClick={() => setShowView(!showview)}
                                  className={`${DGstyles.HideSHowicon} hideShowIconCustom`}
                                >
                                  {showview == true ? <>-</> : <>+</>}
                                </div>
                              </div>
                              {
                                //console.log("familyData", familyData)
                              }
                              {showview && (
                                <div
                                  className={`accordion-content  family ${DGstyles.bgAssetLib}`}
                                >
                                  <div className="">
                                    <div className="container-fluid ">
                                      <div className="row">
                                        <div className="col-md-10">
                                          <label className="category-label-title">
                                            Category
                                          </label>
                                          <ul className="card-list ">
                                            {options.map((v, i) => (
                                              <React.Fragment key={i}>
                                                {/* Main Category Item */}
                                                <li
                                                  className={`li-options ${selectedOption === v.title ? "active" : ""}`}
                                                  onClick={() => {
                                                    const defaultSub = v.options?.[0] || {};
                                                    setGoalSelected(false);
                                                    setSelectedGoals("Automated Linkage");
                                                    setSelectedGoalsId([]);
                                                    setSelectedPriorityArray([]);
                                                    setAutoMatedGoal(true);

                                                    const assetSubNameUUID = defaultSub.asset_sub_name_uuid || "";

                                                    setAssetsDetails({
                                                      ...defaultAssetDetails,
                                                      user_asset_type_id: defaultSub.asset_type_id || "",
                                                      asset_type_name_uuid: defaultSub.asset_type_name_uuid || "",
                                                      // // asset_sub_cat_id: defaultSub.asset_sub_cat_id || "",
                                                      // categorydetail: v.title,
                                                      // asset_name_uuid: v.assetuuid,
                                                      // // asset_cat_id: v.asset_cat_id,
                                                      asset_name: defaultSub.title || v.title,
                                                      user_asset_name: defaultSub.title || v.title,
                                                      subcategorydetail: defaultSub.title || "",
                                                      asset_sub_category_id: defaultSub.id || "",
                                                      asset_name_uuid: v.assetuuid,
                                                      asset_sub_name_uuid: assetSubNameUUID,
                                                      // user_id: user_data.user_id,
                                                      // fp_log_id: "",
                                                      // user_asset_for: assetsDetails?.user_asset_for == "" ? familyData["0"].value : assetsDetails?.user_asset_for,
                                                    });

                                                    simpleValidator.current.hideMessages();
                                                    setForceUpdate((v) => ++v);
                                                    setSelectedOption(v.title);
                                                    setSelectedSubOption(defaultSub.title || "");
                                                    setAddForm(true);
                                                    setUpdateForm(false);
                                                    getfpgoalsdata();
                                                  }}
                                                >

                                                  <label title={v.title}>
                                                    <img src={v.img} alt={v.title} />
                                                    <span>{v.title}</span>
                                                  </label>
                                                </li>
                                              </React.Fragment>
                                            ))}
                                          </ul>
                                          <hr />
                                          <span>
                                            <label className="">{selectedOption}</label>
                                          </span>
                                          <ul
                                            className="card-list child "
                                            id="alternate"
                                          >
                                            {options
                                              .filter((v) => v.title === selectedOption)
                                              .map((v, z) => (
                                                <React.Fragment key={z}>
                                                  {v.options.map((x, i) => {
                                                    let ror = 0;
                                                    let freq = "One Time";
                                                    let growth_rate = "10";
                                                    let user_asset_maturity_date = null;
                                                    let user_asset_end_date = "";
                                                    let tmp_asset_name = x.title;
                                                    let user_asset_currency = "INR";
                                                    let user_asset_valid_till = ""

                                                    // Handle special logic
                                                    switch (x.asset_sub_name_uuid) {
                                                      case "gratuity":
                                                        growth_rate = "5";
                                                        break;
                                                      case "ppf":
                                                      case "pension_schemes":
                                                      case "sukanya_samriddhi_yojana":
                                                      case "nps":
                                                      case "rd":
                                                        ror =
                                                          x.asset_sub_name_uuid === "ppf"
                                                            ? 7.1
                                                            : x.asset_sub_name_uuid === "nps"
                                                              ? 10
                                                              : 6.8;
                                                        freq = "Yearly";
                                                        user_asset_maturity_date = moment(retirmentdate)
                                                          .add(retirmentdate, "y")
                                                          .format("MM/DD/YYYY");
                                                        user_asset_valid_till = "Retirement"
                                                        break;
                                                      case "nsc":
                                                        ror = 6.8;
                                                        break;
                                                      case "epf":
                                                        user_asset_maturity_date = moment(retirmentdate)
                                                          .add(retirmentdate, "y")
                                                          .format("MM/DD/YYYY");
                                                        ror = 8.1;
                                                        user_asset_valid_till = "Retirement"
                                                        break;
                                                      case "us_equity":
                                                        tmp_asset_name = "";
                                                        user_asset_end_date = moment("31/12/2099", "DD/MM/YYYY").format(
                                                          "DD/MM/YYYY"
                                                        );
                                                        break;
                                                      default:
                                                        ror = 0;
                                                        break;
                                                    }

                                                    return (
                                                      <li
                                                        key={i}
                                                        onClick={() => {
                                                          setSelectedSubcatOption("");
                                                          setAssetsDetails({
                                                            ...defaultAssetDetails,
                                                            asset_name: tmp_asset_name,
                                                            user_asset_name: tmp_asset_name,
                                                            user_asset_type_id: x.asset_type_id || null,
                                                            asset_type_name_uuid: x.asset_type_name_uuid || null,
                                                            asset_sub_name_uuid: x.asset_sub_name_uuid,
                                                            asset_name_uuid: v.assetuuid,
                                                            user_asset_currency,
                                                            subcategorydetail: x.title,
                                                            asset_sub_category_id: x.asset_sub_name_uuid,
                                                            user_asset_end_date: user_asset_end_date,
                                                            user_asset_maturity_date,
                                                            user_asset_ror: ror,
                                                            user_asset_freq: freq,
                                                            user_asset_growth_rate: growth_rate,
                                                            user_asset_valid_till: user_asset_valid_till
                                                          });

                                                          setSelectedSubOption(x.title);

                                                          simpleValidator.current.hideMessages();
                                                          setForceUpdate((v) => ++v);
                                                          setAssetEditId("");
                                                          setAddForm(true);
                                                          setUpdateForm(false);
                                                          setGoalSelected(false);
                                                          setSelectedGoals("Automated Linkage");
                                                          setSelectedGoalsId([]);
                                                          setSelectedPriorityArray([]);
                                                          setAutoMatedGoal(true);
                                                          getfpgoalsdata();
                                                        }}
                                                        className={`li-options ${selectedSubOption === x.title || selectedSubcatOption === x.title
                                                          ? "active"
                                                          : ""
                                                          }`}
                                                      >
                                                        <label>
                                                          <img alt={x.title} src={x.img} />
                                                          <span>{x.title}</span>
                                                        </label>
                                                      </li>
                                                    );
                                                  })}
                                                </React.Fragment>
                                              ))}
                                          </ul>
                                        </div>
                                      </div>

                                      <div className="forms-container col-md-12">
                                        {selectedOption == "Alternate" && (
                                          <>
                                            <Alternate
                                              filteredAssetsData={alternateFilteredAssetsData}
                                              familyData={familyData}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              setDate={setDate}
                                              cryptodata={cryptodata}
                                              session={session}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              assetEditId={assetEditId}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              setTab={setTab}
                                            />
                                          </>
                                        )}

                                        {selectedOption == "Debt" && (
                                          <>
                                            <AssetDebt
                                              familyData={familyData}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              setDate={setDate}
                                              debtfunds={debtfunds}
                                              session={session}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              assetEditId={assetEditId}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              retirementGoalID={retirementGoalID}
                                              setTab={setTab}
                                            />
                                          </>
                                        )}

                                        {selectedOption == "Equity" && (
                                          <>
                                            <AssetEquity
                                              filteredAssetsData={equityFilteredAssetsData}
                                              upload_options={upload_options}
                                              familyData={familyData}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              setDate={setDate}
                                              eqfunds={eqfunds}
                                              usequity={USEquity}
                                              equityShares={equityShares}
                                              selectedOption={selectedOption}
                                              selectedSubOption={selectedSubOption}
                                              session={session}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              assetEditId={assetEditId}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              setTab={setTab}
                                            />
                                          </>
                                        )}

                                        {selectedOption == "Commodity" && (
                                          <>
                                            <AssetGold
                                              filteredAssetsData={goldFilteredAssetsData}
                                              familyData={familyData}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              setDate={setDate}
                                              goldfunds={goldfunds}
                                              session={session}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              assetEditId={assetEditId}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              setTab={setTab}
                                            />
                                          </>
                                        )}

                                        {/* {selectedOption == "Saving Account" && (
                                          <>
                                            <Liquid
                                              filteredAssetsData={liquidFilteredAssetsData}
                                              familyData={familyData}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              setDate={setDate}
                                              rentalincomeData={rentalincomeData}
                                              schemedata={schemedata}
                                              liquidfunds={liquidfunds}
                                              session={session}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              deleteAssetData={deleteAssetData}
                                              assetEditId={assetEditId}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              setTab={setTab}
                                              fetch={fetched}
                                            />
                                          </>
                                        )} */}

                                        {selectedOption == "Real Estate" && (
                                          <>
                                            <Realestate
                                              filteredAssetsData={realEstateFilteredAssetsData}
                                              familyData={familyData}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              setDate={setDate}
                                              rentalincomeData={rentalincomeData}
                                              session={session}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              assetEditId={assetEditId}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              setTab={setTab}
                                            />
                                          </>
                                        )}
                                        {selectedOption == "Upload" && (
                                          <>
                                            <AssetOthers
                                              session={session}
                                              selectedOption={selectedOption}
                                              familyData={familyData}
                                              selectedSubOption={selectedSubOption}
                                              addForm={addForm}
                                              unchangedgoaldata={unchangedgoaldata}
                                              setTab={setTab}
                                            />
                                          </>
                                        )}

                                        {selectedOption == "Others" && (
                                          <>
                                            <Others
                                              familyData={familyData}
                                              assetsDetails={assetsDetails}
                                              setAssetsDetails={setAssetsDetails}
                                              goalData={goalData}
                                              addForm={addForm}
                                              updateForm={updateForm}
                                              addAssetsSubmit={addAssetsSubmit}
                                              cancelAssetForm={cancelAssetForm}
                                              updateAssetsSubmit={updateAssetsSubmit}
                                              assetEditId={assetEditId}
                                              unchangedgoaldata={unchangedgoaldata}
                                              getfpgoalsdata={getfpgoalsdata}
                                              setGoalSelected={setGoalSelected}
                                              closeModal={closeModal}
                                              selectGoals={selectGoals}
                                              selectedGoals={selectedGoals}
                                              selectedGoalIdArray={selectedGoalIdArray}
                                              selectedGoalsId={selectedGoalsId}
                                              setPriorityArray={setPriorityArray}
                                              selectedPriorityArray={
                                                selectedPriorityArray
                                              }
                                              setAutoMatedGoal={setAutoMatedGoal}
                                              isAutoMatedGoal={isAutoMatedGoal}
                                              setGoalLink={setGoalLink}
                                              isGoalSelected={isGoalSelected}
                                              setSelectedGoals={setSelectedGoals}
                                              setSelectedGoalsId={setSelectedGoalsId}
                                              setSelectedPriorityArray={
                                                setSelectedPriorityArray
                                              }
                                              setTab={setTab}
                                            />
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
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
            <div className={tab == "tab2" ? "d-block" : "d-none"}>
              <Liabilities tab={tab} familyData={familyData} setTab={setTab} isFetch={isFetched} />
            </div>
          </div>
        </div>
      </div>
      {session['data'] && (filteredAssetsDataCheck.length === selectedCategories.length) && session['data']['fp_lifecycle_status'] === 2 ? (
        // {session['data'] && checkboxShouldExcludel == true && (filteredAssetsDataCheck.length === selectedCategories.length) && session['data']['fp_lifecycle_status'] === 2 ? (
        <Modal className="popupmodal" centered show={show} onHide={handleClose}>
          <Modal.Header className="ModalHead">
            <div className="text-center">Alert</div>
          </Modal.Header>
          <div className=" p-5 d-grid place-items-center align-item-center">
            <div className=" HeaderModal">
              <div
                style={{
                  fontSize: "1rem",
                  textAlign: "center",
                }}
              >
                As you have already generated the report there should be at least one self/spouse asset in this section.
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center pb-5">
            <button
              onClick={() => {
                handleClose("no");
              }}
              className="outline-btn m-2"
            >
              Ok
            </button>
          </div>
        </Modal>

      ) : (

        <Modal className="popupmodal" centered show={show} onHide={handleClose}>
          <Modal.Header className="ModalHead">
            <div className="text-center">Delete Confirmation</div>
          </Modal.Header>
          <div className=" p-5 d-grid place-items-center align-item-center">
            <div className=" HeaderModal">
              <div
                style={{
                  fontSize: "1rem",
                  textAlign: "center",
                }}
              >
                This will permanently erase the record and its associated
                information.
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center pb-5">
            {tab && tab == "tab1" && (
              <button
                onClick={() => {
                  handleClose("yes", "asset");
                }}
                className="outline-btn m-2"
              >
                Yes
              </button>
            )}

            {tab && tab == "tab2" && (
              <button
                onClick={() => {
                  handleClose("yes", "liability");
                }}
                className="outline-btn m-2"
              >
                Yes
              </button>
            )}

            <button
              onClick={() => {
                handleClose("no");
              }}
              className="outline-btn m-2"
            >
              No
            </button>
          </div>
        </Modal>
      )}


      {/* For Selected Goals Member */}
      <Modal className="popupmodal" centered show={selectedgoalsdata} onHide={selectedgoalsdatahandleClose}>
        <Modal.Header className="ModalHead">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-left">Selected Goals</div>
            <div>
              <IoCloseCircleOutline onClick={() => {
                selectedgoalsdatahandleClose()
              }} style={{ fontSize: "2.3rem", cursor: "pointer" }} />
            </div>
          </div>
        </Modal.Header>
        <div style={{ padding: "1.4rem" }} className="d-grid place-items-center align-item-center">
          <table style={{
            border: "1px solid #042b62",

          }}>
            <thead style={{
              border: "1px solid #042b62",
            }}>
              <th style={{
                border: "1px solid #042b62",
                padding: ".6rem 1rem",
                fontWeight: "bold"
              }}>Member</th>
              <th style={{
                border: "1px solid #042b62", padding: ".6rem 1rem", fontWeight: "bold"
              }}>Goal Name</th>
            </thead>
            <tbody>
              {viewAllGoalsData.map((v, i) => (
                <tr key={i}>
                  <td style={{
                    borderRight: "1px solid #042b62", padding: ".6rem 1rem",
                  }}>{v.member.trim()}</td>
                  <td style={{ padding: ".6rem 1rem", }}>{v.goal.trim()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* For Edit goals */}


      {subtab.toLowerCase() === "category" && categoryEditId && (
        <GoalSelectionModal
          isOpenGoalSelectionModal={isOpenGoalSelectionModal}
          setIsOpenGoalSelectionModal={setIsOpenGoalSelectionModal}
          goalsData={[defaultGoal, ...goalData]}
          handleOnClose={(e) => {
            updateMultiAssetLinkageData(e.selectedGoals, categoryEditId);
            setAssetCatData((prev) =>
              prev.map((item) =>
                item.asset_category_uuid === categoryEditId
                  ? { ...item, linked_goals: e.selectedGoals }
                  : item
              )
            );
            setCategoryEditId(null);
          }}
          onHide={() => {
            setCategoryEditId(null);
          }}
          assetData={
            assetCatdata.find((v) => v.asset_category_uuid === categoryEditId) ?? {}
          }
        />
      )}



      {/* For Selected Goals */}
      {
        selectedgoalsmodal == true && (
          <>
            <GoalsDropdown
              setGoalSelected={setGoalSelected}
              goals={goalData}
              unchangedgoaldata={unchangedgoaldata}
              closeModal={closeModal}
              selectGoals={selectGoals}
              selectedGoals={categoryEditId ? goalsInAssetsData() : selectedGoals}
              selectedGoalIdArray={selectedGoalIdArray}
              selectedGoalsId={selectedGoalsId}
              setPriorityArray={setPriorityArray}
              selectedPriorityArray={selectedPriorityArray}
              setAutoMatedGoal={setAutoMatedGoal}
              isAutoMatedGoal={isAutoMatedGoal}
              setGoalLink={setGoalLink}
              type={"Asset"}
            />
          </>
        )
      }
      <SlidingPanel
        className="Filter_Panel"
        type={"right"}
        isOpen={openPanel}
        size={sidePanelWidth}
      >
        <form id="FilterData" className="d-flex flex-column">
          <div className="ps-3 pe-3 pt-3">
            {/* Header */}
            <div className="SideBar_Filter">
              <div className="filter_text">
                <p style={{ fontSize: "1.2rem" }}>Filters</p>
              </div>
              <div>
                <button type="button" onClick={() => setOpenPanel(false)}>
                  <img src={CloseFilter} alt="" />
                </button>
              </div>
            </div>

            <div style={{ marginTop: "1rem" }} className="Line"></div>

            <div className="fltr-section NSEBSE remove-border-li">

              <div className="fltr-section">
                <h4>Category</h4>
                <div className="Category_Filter">
                  <ul className="fltr-items">
                    {categories.map((cat) => (
                      <li className="fltr-items-li" key={cat.asset_id}>
                        <FintooCheckbox
                          checked={category?.asset_id === cat.asset_id}
                          title={cat.asset_name}
                          onChange={() => {
                            // Toggle category selection
                            setCategory(category?.asset_id === cat.asset_id ? null : cat);
                            setSelectedSubcategory([]); // reset subcategories when changing category
                            // updateFilterName()
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>


              {category && (
                <div className="fltr-section">
                  {(category.asset_id === "1" || category.asset_id === "2") ? (
                    <h4>Type</h4>
                  ) : (
                    <h4>Sub Category</h4>
                  )}
                  <div className="Category_Filter">
                    <ul className="fltr-items subcate">
                      {category.subcategories
                        .flatMap((sub) => {

                          if (sub.asset_sub_name_uuid === "government_schemes") {
                            return (
                              sub.asset_types?.map((type) => ({
                                id: type.asset_type_id,
                                title: type.asset_type_name,
                              })) || []
                            );
                          }


                          const subItem = {
                            id: sub.asset_sub_id,
                            title: sub.asset_sub_name,
                          };
                          const assetTypes =
                            sub.asset_types?.map((type) => ({
                              id: type.asset_type_id,
                              title: type.asset_type_name,
                            })) || [];

                          return [subItem, ...assetTypes];
                        })
                        .map((x) => (
                          <li className="fltr-items-li" key={x.id}>
                            <FintooSubCheckbox
                              checked={selectedSubcategory.includes(x.id)}
                              title={x.title}
                              onChange={() => {
                                if (selectedSubcategory.includes(x.id)) {
                                  setSelectedSubcategory((prev) =>
                                    prev.filter((id) => id !== x.id)
                                  );
                                } else {
                                  setSelectedSubcategory((prev) => [...prev, x.id]);
                                }
                              }}
                            />
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}

              {showBrokers && (
                <div className="fltr-section">
                  <h4>Brokers</h4>
                  <div className="Category_Filter">
                    <ul className="fltr-items Memebsrs" style={{ height: "50px" }}>
                      {cdslBrokers.map((v, i) => (
                        <li className="fltr-items-li" key={i}>
                          <FintooSubCheckbox
                            checked={selectedBrokers.includes(v.brokerId)}
                            title={v.brokerName}
                            onChange={() => {
                              if (selectedBrokers.includes(v.brokerId)) {
                                setSelectedBrokers((prev) =>
                                  prev.filter((id) => id !== v.brokerId)
                                );
                              } else {
                                setSelectedBrokers((prev) => [...prev, v.brokerId]);
                              }
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* ✅ Members Section */}
              <div className="fltr-section">
                <h4>Members</h4>
                <div className="Category_Filter">
                  <ul className="fltr-items Memebsrs">
                    {familyData.map((v) => (
                      <li className="fltr-items-li" key={v.value}>
                        <FintooSubCheckbox
                          checked={selectedMember.includes(v.value)}
                          title={v.label}
                          onChange={() => {
                            if (selectedMember.includes(v.value)) {
                              setSelectedMember((prev) =>
                                prev.filter((id) => id !== v.value)
                              );
                            } else {
                              setSelectedMember((prev) => [...prev, v.value]);
                            }
                            // updateFilterName()
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Footer */}
          <div className="p-3 Filter_Btn_panel">
            <div>
              <button type="button" onClick={applyFilter}>
                Apply
              </button>
            </div>
            <div className="reset_btn">
              <button className="Reset" type="button" onClick={resetFilter}>
                Reset All
              </button>
            </div>
          </div>
        </form>
      </SlidingPanel>


      <PortfolioBalance open={isOpen} setIsOpen={setIsOpen} modalData={modalData}
        isDashboard={false}
        isFetch={isFetched}
      />

    </DatagatherLayout>

  );
};
export default AssetsLiabilities;


// | Old ID | Old Name                    | New Mapping ID | New Name         |
// | ------ | --------------------------- | -------------- | ---------------- |
// | 73     | Others (Gold)               | ASC-22         | commodity_others |
// | 69     | Physical Gold               | ASC-32         | physical_gold    |
// | 125    | –                           | empty          | –                |


// | 123    | US Equity (Equity → Others) | ATM-40         | us_equity        |
// | 4      | –                           | empty          | –                |
// | 35     | Future & Options            | Remove          | –                |
// | 23     | Commercial (Real Estate)    | ASC-23         | commercial       |
// | 36     | Commodity                   | commodity      | commodity                |
// | 27     | –                           | empty          | –                |

