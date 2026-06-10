import { useEffect, useMemo, useRef, useState } from "react";
import PortfolioLayout from "../../../components/Layout/Portfolio";
import { FaLongArrowAltUp, FaDownload, FaChartLine } from "react-icons/fa";
import { BsLink45Deg } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import Table from "react-bootstrap/Table";
import { ReactComponent as PiggybankIcon } from "../../../Assets/Images/piggybank.svg";
import { ReactComponent as DownloadIcon } from "../../../Assets/Images/download-reports.svg";
import { ReactComponent as DownArrow } from "../../../Assets/Images/down-arr-98.svg";
import FintooDropdown from "../../../components/HTML/FintooDropdown";
import Calender from "../../../Assets/Images/CommonDashboard/calendar-323.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import {
  fetchEncryptData,
  getUserId,
  indianRupeeFormat,
  loginRedirectGuest,
  getProfilePercentage,
  getItemLocal,
  isUnderMaintenance,
  fetchData,
  getParentFpLogId,
  apiCall,
  getPublicMediaURL,
  getParentUserId,
  isFamilySelected,
} from "../../../common_utilities";
import {
  SUPPORT_EMAIL,
  portfolioReportEndpoints,
  financialplanningInsuranceEndpoints,
  investmentEndpoints,
  DATA_BELONGS_TO,
  exchange_rate,
} from "../../../constants";
import ExploreStock from "../../../components/HTML/ExploreStock";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { } from "../../../constants";
import FintooLoader from "../../../components/FintooLoader";
import style from "./style.module.css";
import Swal from "sweetalert2";
import ProgressStats from "./ProgressStats/ProgressStats";
import ReactTooltip from "react-tooltip";
import MfFilterSidePanel from "./filters/MfFilterSidePanel";
import { HiSortAscending } from "react-icons/hi";
import StocksFilterSidePanel from "./filters/StocksFilterSidePanel";
import {
  getSumOfDataListProp,
  calculatePercentage,
} from "../../../Utils/ListDataUtils/DataListOperations";
import { openDialog } from "../CommonDashboard/CommonDashboardComponents/ConfirmationDialog/ConfirmHandler";
import Modal from "react-responsive-modal";
import SelectMemberModal from "../../../components/SelectMemberModal";
import Nsdlcsdl from "../../datagathering/AssetsLibDG/NSDL_CSDL/Nsdlcsdl";
import ConnectWithBroker from "../Portfolio/Fetchstockholdings/ConnectWithBroker";
import PortfolioBalance from "../../../components/PortfolioBalance";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import FintooInlineLoader from "../../../components/FintooInlineLoader";
import commonEncode from "../../../commonEncode";
import axios from "axios";
import { DeleteOtherInvestments } from "../../../FrappeIntegration-Services/services/financial-planning-api/dashboardApi";
import { DELETE_OTHER_INVESTMENTS } from "../../../constants";
import {
  fetchUserProfileDetails,
  getFamilyMember,
} from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import {
  GetAssetAllocation,
  getDashboardDataPortfolio,
  getOtherInvestments,
} from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
import apiClient from "../../../FrappeIntegration-Services/services/apiClient";
import { DeleteUserAsset } from "../../../FrappeIntegration-Services/services/financial-planning-api/dashboardApi";
import { deleteInsuranceDetails } from "../../../FrappeIntegration-Services/services/financial-planning-api/insurance";
import { getMfSummaryPortfolio } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { Fetch_User_Mf_Profile_Status } from "../../../FrappeIntegration-Services/services/financial-planning-api/ndaflow";
import { Fetchecasdatadetails } from "../../../FrappeIntegration-Services/services/financial-planning-api/externalApi";
import { Fetchexternalholdingdetails } from "../../../FrappeIntegration-Services/services/financial-planning-api/liabilities";
import { loginWebEngageSafe } from "../../../Utils/Webengage/safeLogin";

const options_alternate_type = [
  { value: "currency", label: "Currency" },
  { value: "private_equity", label: "Private Equity" },
];

const STOCK_LOGO_TOKEN = process.env.REACT_APP_LOGO_DEV_TOKEN;

const buildLogoQuery = () =>
  `token=${STOCK_LOGO_TOKEN}&size=64&format=png&fallback=404`;

const normalizeStockTicker = (rawTicker) => {
  if (!rawTicker) return null;

  const cleaned = String(rawTicker).trim().toUpperCase();
  if (!cleaned) return null;

  const strippedPrefix = cleaned.replace(/^(NSE|BSE)[:\-]/, "");
  const strippedSuffix = strippedPrefix.replace(/\.(NS|BO|NSE|BSE|IN)$/, "");
  const normalized = strippedSuffix.replace(/[^A-Z0-9&-]/g, "");

  return normalized || null;
};

const cleanCompanyName = (name) => {
  if (!name) return null;

  return String(name)
    .replace(/\b(LIMITED|LTD|CORPORATION|CORP|INDUSTRIES|INDUSTRY|COMPANY|CO)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

const getStockLogoUrls = (stock) => {
  if (!STOCK_LOGO_TOKEN) return [];

  const urls = [];
  const pushUnique = (url) => {
    if (url && !urls.includes(url)) {
      urls.push(url);
    }
  };

  const isinCandidate =
    stock?.isin ||
    stock?.asset_unique_code ||
    stock?.user_asset_unique_code ||
    stock?.value;

  if (typeof isinCandidate === "string" && /^[A-Z]{2}[A-Z0-9]{9}\d$/i.test(isinCandidate)) {
    pushUnique(
      `https://img.logo.dev/isin/${isinCandidate.toUpperCase()}?${buildLogoQuery()}`
    );
  }

  const tickerCandidate = normalizeStockTicker(
    stock?.ticker ||
    stock?.stock_symbol ||
    stock?.nse_symbol ||
    stock?.bse_symbol ||
    stock?.symbol
  );

  if (tickerCandidate) {
    pushUnique(
      `https://img.logo.dev/ticker/${tickerCandidate}.IN?${buildLogoQuery()}`
    );
    pushUnique(
      `https://img.logo.dev/ticker/${tickerCandidate}?${buildLogoQuery()}`
    );
  }

  const nameCandidate = stock?.user_asset_name || stock?.stock_name || stock?.company_name;

  if (nameCandidate) {
    pushUnique(
      `https://img.logo.dev/name/${encodeURIComponent(
        String(nameCandidate).trim()
      )}?${buildLogoQuery()}`
    );

    const cleanedName = cleanCompanyName(nameCandidate);
    if (cleanedName && cleanedName !== String(nameCandidate).trim()) {
      pushUnique(
        `https://img.logo.dev/name/${encodeURIComponent(
          cleanedName
        )}?${buildLogoQuery()}`
      );
    }
  }

  return urls;
};

const getAssetInitial = (title) => {
  if (typeof title !== "string") return "S";
  const cleaned = title.trim();
  return cleaned ? cleaned.charAt(0).toUpperCase() : "S";
};

const allocationColorMap = {
  "Mutual Funds": "#2563EB",
  Stocks: "#0EA864",
  "US Equity": "#D97706",
  "FD / Bonds": "#E11D48",
  "Govt. Scheme": "#7C3AED",
  "Real Estate": "#14B8A6",
  Alternate: "#64748B",
  Gold: "#F59E0B",
  Liquid: "#06B6D4",
  Insurance: "#9333EA",
  Other: "#94A3B8",
};

const getAllocationColor = (title, index) => {
  return (
    allocationColorMap[title] ||
    ["#2563EB", "#0EA864", "#D97706", "#E11D48", "#7C3AED", "#14B8A6"][index % 6]
  );
};

const AssetName = ({ title, icon, iconElement, imageUrls = [], fallbackLabel }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const initial = useMemo(() => getAssetInitial(fallbackLabel), [fallbackLabel]);
  const activeImageUrl = imageUrls[imageIndex] || null;

  useEffect(() => {
    setImageIndex(0);
  }, [imageUrls, fallbackLabel]);

  return (
    <div className={`d-flex align-items-center ${style.flexBxAssetName}`}>
      <div className="pe-3">
        {activeImageUrl ? (
          <img
            className={`d-none d-md-block ${style.assetLogoImg}`}
            src={activeImageUrl}
            alt={fallbackLabel || "Asset logo"}
            onError={() => {
              if (imageIndex < imageUrls.length - 1) {
                setImageIndex((prev) => prev + 1);
              } else {
                setImageIndex(imageUrls.length);
              }
            }}
          />
        ) : fallbackLabel ? (
          <div className={`${style.assetInitialBadge} d-none d-md-flex`}>
            {initial}
          </div>
        ) : iconElement ? (
          <div className={`${style.assetIconShell} d-none d-md-flex`}>
            {iconElement}
          </div>
        ) : (
          <img
            class={`d-none d-md-block ${style.tblIcons}`}
            src={
              icon ??
              process.env.REACT_APP_STATIC_URL_PYTHON +
              "/assets/img/insurance/insurance_insurance_form.svg"
            }
          />
        )}
      </div>
      <div>{title}</div>
    </div>
  );
};
const PortfolioDashboard = (props) => {
  // Convert asset amount to INR based on currency
  const toINR = (amount, currency) => {
    const val = parseFloat(amount) || 0;
    return currency === "Dollar" ? val * exchange_rate : val;
  };
  const successMessage = [
    "Fd_bond data deleted successfully.",
    "Po data deleted successfully.",
    "Real_estate data deleted successfully.",
    "Insurance data deleted successfully.",
    "Liquid data deleted successfully.",
  ];
  const errorMessage = [
    "No active Fd_bond data found!",
    "No active Po data found!",
    "No active Real_estate data found!",
    "No active Liquid data found!",
    "No active Gold data found!",
    "Please Provide Valid inv_type",
    "Please Provide Valid inv_id",
  ];
  const repdata = {
    fileP: "",
  };
  const [returnsType, setReturnsType] = useState({
    header: "xirr",
    insideTable: "xirr",
  });
  const [selectedTab, setSelectedTab] = useState(1);
  const [mainData, setMainData] = useState({});
  const [mfListDataCopy, setMfListDataCopy] = useState([]);
  const [text, setpopuptext] = useState("");
  const [Open, setIsOpen] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [userExternalFundData, setUserExternalFundData] = useState({});
  const [stockHoldingData, setStockHoldingData] = useState({});
  const [viewAll, setViewAll] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const otherinvUpdated = useSelector((state) => state.otherinvUpdated);
  // For PortfolioBalance

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("success");
    const myEpfParam = urlParams.get("isepf");
    const myStockParam = urlParams.get("isstocks");
    const myLiabilityParam = urlParams.get("isliability");
    // const myCreditScoreParam = urlParams.get('isCreditScore');
    if (myParam == 1) {
      setisOpen(true);
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
  }, []);

  const toggleViewAll = () => {
    setViewAll(!viewAll);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const [resetFilterTriggerState, setResetFilterTriggerState] = useState({
    triggerReset: false,
    showResetTriggerUi: false,
    filtersActive: false,
  });
  const [stocksListCopy, setStocksListCopy] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [stockListData, setStockListData] = useState([]);
  const [stockListSummary, setStockListSummary] = useState([]);
  const [usEquityList, setUsEquityList] = useState([]);
  const [aifEquityList, setAifEquityList] = useState([]);
  const [govtSchemeList, setGovtSchemeList] = useState([]);
  const [realestateList, setRealestateList] = useState([]);
  const [alternateAssetsList, setAlternateAssetsList] = useState({});
  const [goldList, setGoldList] = useState([]);
  const [fdBondList, setFdBondList] = useState([]);
  const [liquidAssetsList, setLiquidAssetsList] = useState([]);
  const [stocksCurrentValue, setStocksCurrentValue] = useState(0);
  const [resetStocksFilterTriggerState, setResetStocksFilterTriggerState] =
    useState({
      triggerReset: false,
      showResetTriggerUi: false,
      filtersActive: false,
    });
  const [progressBarValues, setProgressBarValues] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState(repdata);
  const [isLoading, setIsLoading] = useState(false);
  const userDetails = useRef({});
  const [percent, setPercent] = useState(0);
  const btnDownloadRef = useRef();
  const stockNsdlRef = useRef(null);
  // const [isDataLoading, setIsDataLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState({
    dashboardData: true,
    mfData: true,
    otherInvestmentData: true,
  });
  const [otherInvestmentData, setOtherInvestmentData] = useState({});
  const [dashboardData, setDashboardData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [session, setSession] = useState({});
  const [familyData, setFamilyData] = useState([]);
  const [isFilterPanelActive, setIsFilterPanelActive] = useState(false);
  const [isStocksFilterPanelActive, setIsStocksFilterPanelActive] =
    useState(false);

  const openStockImportModal = () => {
    stockNsdlRef.current?.openModal();
  };

  useEffect(() => {
    if (searchParams.get("realestate") == 1) {
      searchParams.delete("realestate");
      setSearchParams(searchParams);
      setSelectedTab(5);
    }
    if (searchParams.get("fdbonds") == 3) {
      searchParams.delete("fdbonds");
      setSearchParams(searchParams);
      setSelectedTab(3);
    }
    if (searchParams.get("liquidasset") == 1) {
      searchParams.delete("liquidasset");
      setSearchParams(searchParams);
      setSelectedTab(8);
    }
    if (searchParams.get("insurance") == 2) {
      searchParams.delete("insurance");
      setSearchParams(searchParams);
      setSelectedTab(2);
    }
    if (isUnderMaintenance()) {
      Swal.fire({
        html: "" + isUnderMaintenance(true)["string"] + "",
      });
    }

    if (localStorage.getItem("holdingFetched")) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Holding Data has been fetched successfully",
          type: "success",
        },
      });
      localStorage.removeItem("holdingFetched");
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("assetTabNumber")) {
      const tabNumber = searchParams.get("assetTabNumber");

      setSelectedTab(tabNumber);
    }

    // Force refresh data when coming back from asset forms
    if (searchParams.get("refresh") === "true") {
      const refreshData = async () => {
        await fetchFundsData();
        await fetchAssetData();
        await fetchGoldAssets();
        await fetchInsuranceDetails();
        await getDashboardData();
      };

      refreshData();
    }
  }, [searchParams]);

  // Refresh data when component mounts or when navigating back from asset forms
  useEffect(() => {
    const refreshData = async () => {
      await fetchFundsData();
      await fetchAssetData();
      await fetchGoldAssets();
      await fetchInsuranceDetails();
      await getDashboardData();
    };

    refreshData();
  }, []);

  // Monitor gold list changes
  useEffect(() => { }, [goldList]);

  // Monitor selected tab changes
  useEffect(() => { }, [selectedTab]);

  const checksession = async () => {
    // try {
    //   let url = constClass.CHECK_SESSION;
    //   let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
    //   let session_data = await apiCall(url, data, true, false);
    //   if (session_data["error_code"] == "100") {
    //     setSession(session_data);
    //   }
    // } catch (e) {
    //   setIsLoading(false);
    // }
  };

  const getFamilyMembers = async () => {
    try {
      const member_data = await getFamilyMember(getUserId());

      if (member_data.status_code == 200) {
        var member_array = [];
        var members = member_data["data"];
        members.map((member) => {
          if (member.user_parent_id == 0 || member.user_parent_id == "") {
            member_array.push({
              member_id: member.user_id,
              label: "Self",
              retirement_age: member.retirement_age,
              dob: member.dob,
              life_expectancy: member.life_expectancy_age,
              isdependent: member.is_dependent,
              pan: member.pan,
              email: member.user_email || member.email,
            });
          } else {
            member_array.push({
              member_id: member.user_id,
              label: member.user_name,
              retirement_age: member.retirement_age,
              dob: member.dob,
              life_expectancy: member.life_expectancy_age,
              isdependent: member.is_dependent,
              pan: member.pan,
              email: member.user_email || member.email,
            });
          }
        });

        setFamilyData(member_array);
      } else {
        setFamilyData([]);
      }
    } catch { }
  };

  useEffect(() => {
    // // checksession();
    getFamilyMembers();
    fetchFundsData();
    fetchAssetData();
    fetchGoldAssets(); // Fetch gold assets separately
    fetchInsuranceDetails();
    userProfileState();
    getDashboardData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isLoading]);

  const getDashboardData = async () => {
    setIsDataLoading((prev) => ({ ...prev, dashboardData: true }));

    let payload = {};

    if (getItemLocal("family")) {
      const memberData = getItemLocal("member") || [];
      const userIds = memberData
        .filter((m) => m.id !== null)
        .map((m) => m.id.toString());

      payload = {
        user_id: getUserId(),
        data_belongs_to: DATA_BELONGS_TO,
        family: "1",
      };
    } else {
      payload = {
        user_id: String(getUserId()),
      };
    }

    try {
      const res = await getDashboardDataPortfolio(payload);
      setIsDataLoading((prev) => ({ ...prev, dashboardData: false }));

      if (res.status_code === "200") {
        setDashboardData(res.data);
        GraphData(res.data);
      }
    } catch (error) {
      setIsDataLoading((prev) => ({ ...prev, dashboardData: false }));
      console.error("Error fetching dashboard data:", error);
    }
  };

  const deleteUserAsset = async (asset_id, message) => {
    const result = await openDialog("Delete Confirmation", message);
    if (!result) return;

    try {
      let payload = {
        user_asset_user_id: [getUserId()],
        user_asset_id: [asset_id],
        data_belongs_to: DATA_BELONGS_TO,
      };

      let deleteassetData = await DeleteUserAsset(payload);

      if (deleteassetData["status_code"] == "200") {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Data deleted successfully!",
            type: "success",
          },
        });
        fetchAssetData();
        getDashboardData();
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Error!", type: "error" },
        });
      }
    } catch (err) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: err, type: "error" },
      });
    }
  };

  const deleteAsset = async (inv_id, type, fplid, message) => {
    const result = await openDialog("Delete Confirmation", message);
    if (!result) return;

    try {
      setIsLoading(true);
      if (type == "insurance") {
        let payload = {
          insurance_id: [inv_id],
          data_belongs_to: DATA_BELONGS_TO,
        };

        let res = await deleteInsuranceDetails(payload);
        if (res.status_code == "200") {
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: "Data deleted successfully.", type: "success" },
          });

          // Immediately update local state to remove deleted record
          setOtherInvestmentData((prev) => ({
            ...prev,
            insurance_data: {
              ...prev.insurance_data,
              insurance_details:
                prev.insurance_data?.insurance_details?.filter(
                  (item) => item.insurance_id !== inv_id
                ) || [],
              no_of_policies: Math.max(
                0,
                (prev.insurance_data?.no_of_policies || 1) - 1
              ),
              total_premium_amount:
                (prev.insurance_data?.total_premium_amount || 0) -
                (prev.insurance_data?.insurance_details?.find(
                  (item) => item.insurance_id === inv_id
                )?.premium_amount || 0),
              total_risk_coverage:
                (prev.insurance_data?.total_risk_coverage || 0) -
                (prev.insurance_data?.insurance_details?.find(
                  (item) => item.insurance_id === inv_id
                )?.risk_coverage || 0),
            },
          }));

          // Also refresh data from server
          setTimeout(() => {
            fetchInsuranceDetails();
            getDashboardData();
          }, 500);

          setIsLoading(false);
          return;
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Failed to delete insurance data.",
              type: "error",
            },
          });
          setIsLoading(false);
          return;
        }
      }
      let payload = {
        user_asset_id: [inv_id],
        user_asset_user_id: ["f5apbqqgpq"],
        data_belongs_to: DATA_BELONGS_TO,
      };
      // let res = await DeleteOtherInvestments(payload);
      let req = {
        url: DELETE_OTHER_INVESTMENTS,
        method: "DELETE",
        data: payload,
      };
      let res = await axios(req);

      setIsLoading(false);
      if (successMessage.indexOf(res.message) > -1) {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: res.message, type: "success" },
        });
        fetchAssetData();
        fetchGoldAssets();
        getDashboardData();
        return;
      } else if (errorMessage.indexOf(res.message) > -1) {
        setIsLoading(true);
        let payload1 = {
          url: DELETE_FP_USER_ASSET,
          data: {
            user_id: getUserId(),
            id: [inv_id],
            fp_log_id: getParentFpLogId(),
          },
          method: "post",
        };
        let res2 = await fetchEncryptData(payload1);
        setIsLoading(false);
        if (res2.error_code == "100") {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Data deleted successfully!",
              type: "success",
            },
          });
          fetchAssetData();
          fetchGoldAssets();
          getDashboardData();
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: "Error!", type: "error" },
          });
        }
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Something went wrong. Try again later.",
            type: "error",
          },
        });
      }
    } catch (e) { }
  };

  // returns an array of all member's ids or pans depending on the value of typeOfArray
  const familyArray = (typeOfArray) => {
    let new_array = [];
    var new_data = getItemLocal("member");
    switch (typeOfArray) {
      case "pan":
        new_data.forEach((element) => {
          if (element.pan !== null) {
            new_array.push(element.pan);
          }
        });
        break;
      case "user_id":
        new_data.forEach((element) => {
          if (element.id !== null) {
            new_array.push(element.id.toString());
          }
        });
        break;
    }
    return new_array;
  };

  // Helper: Flatten nested asset objects into a single array
  function flattenAssets(listing) {
    let result = [];

    function traverse(obj) {
      if (Array.isArray(obj)) {
        result.push(...obj);
      } else if (typeof obj === "object" && obj !== null) {
        Object.values(obj).forEach(traverse);
      }
    }

    traverse(listing);
    return result;
  }

  const fetchAssetData = async () => {
    try {
      setIsLoading(true);
      setIsDataLoading((prev) => ({ ...prev, otherInvestmentData: true }));
      let payload = {};
      try {
        if (getItemLocal("family")) {
          payload = {
            user_id: getParentUserId().toString(),
            data_belongs_to: DATA_BELONGS_TO,
          };
        } else {
          payload = {
            user_id: getParentUserId().toString(),
            user_asset_for: getUserId().toString()
          };
        }

        const data = await getOtherInvestments(payload);

        setIsLoading(false);
        if (data && (data.status_code === "200" || data.status_code === 200)) {
          setIsDataLoading((prev) => ({ ...prev, otherInvestmentData: false }));

          // Flatten nested listing into a flat array
          const allAssets = flattenAssets(data.data.listing);

          const categorySummaries = Array.isArray(data.data.category_list)
            ? data.data.category_list
            : [];

          const stockAssets = allAssets.filter((asset) => {
            return (
              asset.asset_name_uuid === "equity" &&
              asset.asset_sub_name_uuid === "equity_shares"
            );
          });

          const categoryListData = data.data.category_list || [];
          categoryListData.map((category) => {
            if (
              category.asset_category_uuid === "equity" &&
              category.asset_sub_category_uuid === "equity_shares"
            ) {
              setStocksCurrentValue(category.total_current);
            }
            //setStocksCurrentValue
          });

          const usEquityAssets = allAssets.filter(
            (asset) =>
              asset.asset_name_uuid === "equity" &&
              asset.asset_type_name_uuid === "us_equity"
          );

          const aifAssets = allAssets.filter(
            (asset) =>
              asset.asset_name_uuid === "alternate" &&
              asset.asset_sub_name_uuid === "aif"
          );

          const unlistedAssets = allAssets.filter(
            (asset) =>
              asset.asset_name_uuid === "equity" &&
              asset.asset_sub_name_uuid === "equity_others" &&
              asset.asset_type_name_uuid === "unlisted"
          );
          const mergedAifAndUnlistedList = [...aifAssets, ...unlistedAssets];

          const fdAssets = allAssets.filter(
            (asset) =>
              asset.asset_name_uuid === "debt" &&
              ((asset.asset_sub_name_uuid === "liquid" &&
                (asset.asset_type_name_uuid === "fixed_deposit" ||
                  asset.asset_type_name_uuid === "rd")) ||
                (asset.asset_sub_name_uuid === "debt_others" &&
                  asset.asset_type_name_uuid === "gratuity"))
          );

          const bondAssets = allAssets.filter(
            (asset) =>
              asset.asset_name_uuid === "debt" &&
              asset.asset_sub_name_uuid === "bonds" &&
              (asset.asset_type_name_uuid === "private_bonds" ||
                asset.asset_type_name_uuid === "public_bonds" ||
                asset.asset_type_name_uuid === "debentures")
          );

          const mergedDebtAssets = [...fdAssets, ...bondAssets];

          const govtSchemesAssets = allAssets.filter(
            (asset) =>
              asset.asset_name_uuid === "debt" &&
              asset.asset_sub_name_uuid === "government_schemes" &&
              (asset.asset_type_name_uuid === "government_schemes_others" ||
                asset.asset_type_name_uuid === "post_office_schemes" ||
                asset.asset_type_name_uuid === "sukanya_samriddhi_yojana" ||
                asset.asset_type_name_uuid === "ppf" ||
                asset.asset_type_name_uuid === "nsc" ||
                asset.asset_type_name_uuid === "nps" ||
                asset.asset_type_name_uuid === "epf")
          );

          // Debug logging for Govt. Schemes filtering
          const govtSchemesCandidates = allAssets.filter(
            (asset) =>
              asset.asset_name_uuid === "debt" &&
              asset.asset_sub_name_uuid === "government_schemes"
          );

          // Debug EPF specifically
          const epfAssets = allAssets.filter(
            (asset) => asset.asset_type_name_uuid === "epf"
          );

          const landAgricultureLandAssets = allAssets.filter(
            (asset) =>
              asset.asset_name_uuid === "real_estate" &&
              asset.asset_sub_name_uuid === "land" &&
              (asset.asset_type_name_uuid === "land" ||
                asset.asset_type_name_uuid === "agriculture_land")
          );

          const otherRealEstateAssets = allAssets.filter(
            (asset) =>
              asset.asset_name_uuid === "real_estate" &&
              (asset.asset_sub_name_uuid === "reits" ||
                asset.asset_sub_name_uuid === "commercial" ||
                asset.asset_sub_name_uuid === "residential_premises")
          );

          const mergedRealEstateAssets = [
            ...landAgricultureLandAssets,
            ...otherRealEstateAssets,
          ];

          const alternateAssets = allAssets.filter(
            (asset) =>
              asset.asset_name_uuid === "alternate" &&
              (asset.asset_sub_name_uuid === "currency" ||
                asset.asset_sub_name_uuid === "private_equity")
          );

          const goldAssets = allAssets.filter(
            (asset) =>
              asset.asset_name_uuid === "commodity" &&
              (asset.asset_sub_name_uuid === "gold_etf_mf" ||
                asset.asset_sub_name_uuid === "physical_gold" ||
                asset.asset_sub_name_uuid === "commodity_others" ||
                asset.asset_sub_name_uuid === "sovereign_gold_bonds")
          );

          const liquidAssets = allAssets.filter(
            (asset) =>
              asset.asset_name_uuid === "debt" &&
              asset.asset_sub_name_uuid === "liquid" &&
              (asset.asset_type_name_uuid === "cash" ||
                asset.asset_type_name_uuid === "saving_account")
          );

          // Set filtered lists

          const totalAlternateLength = alternateAssets.length;
          const totalAlternateInvestedValue = alternateAssets.reduce(
            (sum, asset) => sum + (asset.total_invested_amount || 0),
            0
          );
          const totalAlternateCurentValue = alternateAssets.reduce(
            (sum, asset) => sum + (asset.total_current_amount || 0), // replace 'other_field'
            0
          );

          // Transform stock data to match expected format for filters and display
          const transformedStockAssets = stockAssets.map((asset) => ({
            ...asset,
            // Map the properties to the expected format
            cr_val: asset.user_asset_current_amount || 0,
            inv_val: asset.user_asset_investment_amount || 0,
            today_rtn: asset.user_asset_today_return || 0,
            gain_val:
              (asset.user_asset_current_amount || 0) -
              (asset.user_asset_investment_amount || 0),
            // Use specific values as shown in the image
            sector_name: "Automobiles & Auto Components",
            industry_name: "Auto Parts & Equipment",
            broker_name: "Unknown Broker",
            asset_units: asset.user_asset_quantity || asset.quantity || 0,
          }));

          setStockList(transformedStockAssets);
          setStocksListCopy(transformedStockAssets);

          // Add stocks data to otherInvestmentData for UI display
          setOtherInvestmentData((prev) => ({
            ...prev,
            equity_shares: {
              stocks_details: transformedStockAssets,
            },
          }));
          setUsEquityList(usEquityAssets);
          setAifEquityList(mergedAifAndUnlistedList); //merged Unlisted and AIF assets
          setFdBondList(mergedDebtAssets);
          setGovtSchemeList(govtSchemesAssets);
          setRealestateList(mergedRealEstateAssets);
          setAlternateAssetsList({
            alternate_data: alternateAssets,
            no_of_assets: totalAlternateLength,
            total_purchase_rate: totalAlternateInvestedValue,
            total_current_rate: totalAlternateCurentValue,
          });
          setGoldList(goldAssets);
          setLiquidAssetsList(liquidAssets);

          const transformedCategorySummary = categorySummaries.reduce(
            (acc, category) => {
              if (category.asset_category_uuid) {
                acc[category.asset_category_uuid] = category;
              }
              return acc;
            },
            {}
          );

          // Update state
          setOtherInvestmentData((prev) => ({
            ...prev,
            asset_category_summary: transformedCategorySummary,
            insurance_data: prev?.insurance_data, // preserve old insurance data
          }));
        } else {
          // Handle API failure
          setIsDataLoading((prev) => ({ ...prev, otherInvestmentData: false }));
          setOtherInvestmentData((prev) => ({
            insurance_data: prev?.insurance_data,
          }));
          setStocksListCopy([]);
        }
      } catch (err) {
        setIsDataLoading((prev) => ({ ...prev, otherInvestmentData: false }));
        setIsLoading(false);
      }
    } catch (e) {
      setIsDataLoading((prev) => ({ ...prev, otherInvestmentData: false }));
      setIsLoading(false);
    }
  };

  // Separate function specifically for gold assets using new API
  const fetchGoldAssets = async () => {
    try {
      let payload = {};

      if (getItemLocal("family")) {
        payload = {
          user_id: getParentUserId().toString(),
          data_belongs_to: DATA_BELONGS_TO,
        };
      } else {
        payload = {
          user_id: getParentUserId().toString(),
          user_asset_for: getUserId().toString()
        };
      }

      const data = await getOtherInvestments(payload);

      if (data && (data.status_code === "200" || data.status_code === 200)) {
        // Process flat array response for gold assets only
        const allAssets = Array.isArray(data.data.listing)
          ? data.data.listing
          : [];

        // Filter gold assets based on asset category and subcategory
        const extractedGoldAssets = allAssets.filter((asset) => {
          // Check if it's a commodity asset (gold category)
          const isCommodity =
            asset.asset_name_uuid === "commodity" ||
            asset.asset_name_uuid === "commodity-uuid" ||
            asset.asset_name?.toLowerCase().includes("commodity");

          // Check if it's a gold subcategory
          const isGoldSubcategory =
            asset.asset_sub_name_uuid === "gold_etf_mf" ||
            asset.asset_sub_name_uuid === "physical_gold" ||
            asset.asset_sub_name_uuid === "sovereign_gold_bonds" ||
            asset.asset_sub_name_uuid === "commodity_others" ||
            asset.user_asset_name === "Gold ETF" ||
            asset.user_asset_name === "Physical Gold" ||
            asset.user_asset_name === "Sovereign Gold Bonds" ||
            asset.user_asset_name === "Others" ||
            asset.user_asset_name?.toLowerCase().includes("gold");

          return isCommodity && isGoldSubcategory;
        });

        // Calculate totals for gold assets
        const goldSummary = {
          total_invested: extractedGoldAssets.reduce((sum, asset) => {
            let investedAmount = 0;
            if (
              asset.user_asset_avg_purchase_price > 0 &&
              asset.user_asset_quantity > 0
            ) {
              investedAmount =
                asset.user_asset_avg_purchase_price * asset.user_asset_quantity;
            } else {
              investedAmount = asset.user_asset_investment_amount || 0;
            }
            return sum + investedAmount;
          }, 0),
          total_current: extractedGoldAssets.reduce(
            (sum, asset) => sum + (asset.user_asset_current_amount || 0),
            0
          ),
          assets_count: extractedGoldAssets.length,
        };

        // Update otherInvestmentData with gold summary
        setOtherInvestmentData((prev) => ({
          ...prev,
          asset_category_summary: {
            ...prev?.asset_category_summary,
            commodity: goldSummary,
          },
        }));

        // Set gold list
        setGoldList(extractedGoldAssets);
      } else {
        setGoldList([]);
      }
    } catch (error) {
      console.error("Error fetching gold assets:", error);
      setGoldList([]);
    }
  };

  // Delete function specifically for gold assets
  const deleteGoldAsset = async (assetId, message) => {
    const result = await openDialog("Delete Confirmation", message);
    if (!result) return;

    try {
      setIsLoading(true);

      const payload = {
        user_asset_id: [assetId],
        user_asset_user_id: getParentUserId(),
        data_belongs_to: DATA_BELONGS_TO,
      };

      const response = await apiClient(
        investmentEndpoints.DELETE_OTHER_INVESTMENTS,
        {
          method: "DELETE",
          body: JSON.stringify(payload),
        }
      );

      setIsLoading(false);

      if (
        response &&
        (response.status_code === "200" || response.status_code === 200)
      ) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Gold asset deleted successfully!",
            type: "success",
          },
        });

        // Refresh data after successful deletion
        fetchGoldAssets();
        getDashboardData();
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message:
              response?.message ||
              "Failed to delete gold asset. Please try again.",
            type: "error",
          },
        });
      }
    } catch (error) {
      setIsLoading(false);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message:
            "An error occurred while deleting the gold asset. Please try again.",
          type: "error",
        },
      });
    }
  };

  const fetchInsuranceDetails = async () => {
    try {
      const user_id = getParentUserId();
      const queryParams = new URLSearchParams();
      queryParams.append("user_id", user_id);
      const url = `${financialplanningInsuranceEndpoints.GET_USER_INSURANCE_DETAILS
        }?${queryParams.toString()}`;

      const response = await apiClient(url, {
        method: "GET",
      });

      if (
        response.status_code === 200 ||
        response.status_code === "200" ||
        response.error_code === "100"
      ) {
        const insuranceDataArray = response.data || response.message || [];

        if (
          Array.isArray(insuranceDataArray) &&
          insuranceDataArray.length > 0
        ) {
          // Map the API response to match UI expected field names
          const insuranceDetails = insuranceDataArray.map((insurance) => {
            // Convert date format from DD/MM/YYYY to YYYY-MM-DD for proper parsing
            const formatDate = (dateStr) => {
              if (!dateStr || dateStr === "null") return null;
              try {
                const [day, month, year] = dateStr.split("/");
                return `${year}-${month}-${day}`;
              } catch (e) {
                return null;
              }
            };

            return {
              insurance_id: insurance.name,
              policy_name: insurance.user_insurance_name || "-",
              insurance_company_name: insurance.user_insurance_name,
              policy_no: insurance.user_insurance_policy_number || "-",
              insurance_type: insurance.insurance_category_type || "-",
              premium_amount: insurance.user_insurance_premium_amount || 0,
              risk_coverage: insurance.user_insurance_sum_assured || 0,
              policy_start_date: formatDate(
                insurance.user_insurance_start_date
              ),
              maturitydate: formatDate(insurance.user_insurance_end_date),
              user_insurance_premium_freq:
                insurance.user_insurance_premium_freq,
              user_insurance_policy_term: insurance.user_insurance_policy_term,
              user_insurance_remarks: insurance.user_insurance_remarks,
              insurance_cat_id: insurance.insurance_cat_id,
            };
          });

          // Update the insurance data in otherInvestmentData
          setOtherInvestmentData((prev) => ({
            ...prev,
            insurance_data: {
              insurance_details: insuranceDetails,
              // Summary totals with correct field names for UI
              no_of_policies: insuranceDetails.length,
              total_premium_amount: insuranceDetails.reduce(
                (total, insurance) =>
                  total + (parseFloat(insurance.premium_amount) || 0),
                0
              ),
              total_risk_coverage: insuranceDetails.reduce(
                (total, insurance) =>
                  total + (parseFloat(insurance.risk_coverage) || 0),
                0
              ),
            },
          }));
        } else {
          setOtherInvestmentData((prev) => ({
            ...prev,
            insurance_data: {
              insurance_details: [],
              no_of_policies: 0,
              total_premium_amount: 0,
              total_risk_coverage: 0,
            },
          }));
        }
      } else {
        setOtherInvestmentData((prev) => ({
          ...prev,
          insurance_data: {
            insurance_details: [],
            no_of_policies: 0,
            total_premium_amount: 0,
            total_risk_coverage: 0,
          },
        }));
      }
    } catch (error) {
      setOtherInvestmentData((prev) => ({
        ...prev,
        insurance_data: {
          insurance_details: [],
          no_of_policies: 0,
          total_premium_amount: 0,
          total_risk_coverage: 0,
        },
      }));
    }
  };

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      currency: "INR",
    }).format(value);

  const fetchFundsData = async () => {
    try {
      let new_array = [];
      if (getItemLocal("family")) {
        new_array = familyArray("pan");
      }
      if (getParentUserId() == null) {
        loginRedirectGuest();
        return;
      }

      var res = await fetchUserProfileDetails(getUserId());
      if (res.data.user_is_minor == 0) {
        if (Boolean(res.data.user_pan) == false) {
          throw "PAN not found";
        }
      } else if (res.data.is_minor == 1) {
        if (Boolean(res.data.guardian_pan) == false) {
          throw "PAN not found";
        }
      }
      userDetails.current = res.data;

      var portfolio_payload = {
        pan: getItemLocal("family") ? new_array : res.data.user_pan,
        fund_registrar: "all",
        data_belongs_to: DATA_BELONGS_TO,
      };

      setIsDataLoading((prev) => ({ ...prev, mfData: true }));
      var res = await getMfSummaryPortfolio(portfolio_payload);

      if (res.status_code == 200) {
        setMainData(res.data);
        setMfListDataCopy(res.data.fund_list);
        setIsDataLoading((prev) => ({ ...prev, mfData: false }));
      } else {
        setIsDataLoading((prev) => ({ ...prev, mfData: false }));
      }
    } catch (e) {
      setIsDataLoading((prev) => ({ ...prev, mfData: false }));
    }
  };

  const GraphData = (data) => {
    let graph_data = [];

    Object.keys(data?.investment?.inv_data).forEach((key) => {
      const percValue = Math.round(
        (data?.investment?.inv_data[key]?.perc * 100) / 100
      );
      graph_data.push({
        title: key,
        value: percValue,
        color: "",
      });
    });
    setProgressBarValues(graph_data);
  };

  const userProfileState = async () => {
    // setIsLoading1(true);
    try {
      const profilePercentage = await Fetch_User_Mf_Profile_Status(getUserId());
      setPercent(profilePercentage.user_profile_progress);
    } catch (e) { }
  };

  const smallcasemfloan = async () => {
    var data = {
      pan: userDetails.current.pan,
      contact: userDetails.current.mobile,
    };

    var res = await apiCall("", data);
    var unity_id = res.data.data.unityUserId;

    if (unity_id) {
      var data = {
        userid: unity_id,
      };
      var tokenres = await apiCall(DMF_SMALLCASE_MFLOAN_INTERATCID, data);
      var interaction_id = tokenres.data;

      if (interaction_id) {
        const lasSdkInstance = new window.ScLoan({
          // ! gateway name integration key is shared by business team
          gatewayName: "fintoo",
        });

        try {
          const response = await lasSdkInstance.apply({
            interactionToken: interaction_id,
          });
          // handle success response
        } catch (e) {
          // handle error
        }
      }
    } else {
    }
  };

  useEffect(() => {
    if (file.fileP) {
      document.querySelector("#pa-download").click();
      // setFileP("");
    }
  }, [file.fileP]);

  // Calculate portfolio value based on selected tab
  useEffect(() => {
    const calculateTabSpecificPortfolioValue = () => {
      let totalValue = 0;
      let tabName = "";

      // Calculate value based on selected tab
      switch (Number(selectedTab)) {
        case 1: // Mutual Fund
          totalValue =
            parseFloat(mainData?.portfolio_summary?.tcurr_value) || 0;
          tabName = "Mutual Fund";
          break;

        case 2: // Insurance
          totalValue =
            parseFloat(
              otherInvestmentData?.insurance_data?.total_risk_coverage
            ) || 0;
          tabName = "Insurance";
          break;

        case 3: // FD / Bonds
          if (otherInvestmentData?.asset_category_summary) {
            const categorySummary = otherInvestmentData.asset_category_summary;
            // Sum FD and Bonds categories
            Object.values(categorySummary).forEach((category) => {
              if (
                category.asset_category_uuid === "debt" &&
                (category.asset_sub_name_uuid === "liquid" ||
                  category.asset_sub_name_uuid === "bonds")
              ) {
                totalValue += parseFloat(category.total_current_amount) || 0;
              }
            });
          }
          tabName = "FD / Bonds";
          break;

        case 4: // Govt. Scheme
          if (otherInvestmentData?.asset_category_summary) {
            const categorySummary = otherInvestmentData.asset_category_summary;
            Object.values(categorySummary).forEach((category) => {
              if (
                category.asset_category_uuid === "debt" &&
                category.asset_sub_name_uuid === "government_schemes"
              ) {
                totalValue += parseFloat(category.total_current_amount) || 0;
              }
            });
          }
          tabName = "Govt. Scheme";
          break;

        case 5: // Real Estate
          if (otherInvestmentData?.asset_category_summary) {
            const categorySummary = otherInvestmentData.asset_category_summary;
            Object.values(categorySummary).forEach((category) => {
              if (category.asset_category_uuid === "real_estate") {
                totalValue += parseFloat(category.total_current_amount) || 0;
              }
            });
          }
          tabName = "Real Estate";
          break;

        case 6: // Alternate
          totalValue = parseFloat(alternateAssetsList?.total_current_rate) || 0;
          tabName = "Alternate";
          break;

        case 7: // Gold
          if (goldList && goldList.length > 0) {
            totalValue = goldList.reduce((sum, asset) => {
              return sum + (parseFloat(asset.user_asset_current_amount) || 0);
            }, 0);
          }
          tabName = "Gold";
          break;

        case 8: // Liquid
          if (otherInvestmentData?.asset_category_summary) {
            const categorySummary = otherInvestmentData.asset_category_summary;
            Object.values(categorySummary).forEach((category) => {
              if (
                category.asset_category_uuid === "debt" &&
                category.asset_sub_name_uuid === "liquid" &&
                (category.asset_type_name_uuid === "cash" ||
                  category.asset_type_name_uuid === "saving_account" ||
                  category.asset_type_name_uuid === "rd")
              ) {
                totalValue += parseFloat(category.total_current_amount) || 0;
              }
            });
          }
          tabName = "Liquid";
          break;

        case 10: // Unlisted/AIF Equity
          if (otherInvestmentData?.asset_category_summary) {
            const categorySummary = otherInvestmentData.asset_category_summary;
            Object.values(categorySummary).forEach((category) => {
              if (
                category.asset_category_uuid === "alternate" &&
                category.asset_sub_name_uuid === "aif"
              ) {
                totalValue += parseFloat(category.total_current_amount) || 0;
              }
            });
          }
          tabName = "Unlisted/AIF Equity";
          break;

        case 11: // US Equity
          if (otherInvestmentData?.asset_category_summary) {
            const categorySummary = otherInvestmentData.asset_category_summary;
            Object.values(categorySummary).forEach((category) => {
              if (
                category.asset_category_uuid === "equity" &&
                category.asset_type_name_uuid === "us_equity"
              ) {
                totalValue += parseFloat(category.total_current_amount) || 0;
              }
            });
          }
          tabName = "US Equity";
          break;

        case 12: // Stocks
          if (otherInvestmentData?.asset_category_summary) {
            // const categorySummary = otherInvestmentData.asset_category_summary;
            // Object.values(categorySummary).forEach(category => {
            //   if (category.asset_category_uuid === 'equity' &&
            //       category.asset_sub_category_uuid === 'equity_shares') {
            //         totalValue += parseFloat(category.total_current_amount) || 0;
            //   }
            // });
            stockList.forEach((stock) => {
              if (
                stock.asset_name_uuid === "equity" &&
                stock.asset_sub_name_uuid === "equity_shares"
              ) {
                totalValue += parseFloat(stock.user_asset_current_amount) || 0;
              }
            });
          }
          tabName = "Stocks";
          break;

        default:
          // Default to total portfolio value
          totalValue =
            parseFloat(mainData?.portfolio_summary?.tcurr_value) || 0;
          if (otherInvestmentData?.asset_category_summary) {
            const categorySummary = otherInvestmentData.asset_category_summary;
            Object.values(categorySummary).forEach((category) => {
              if (category.total_current_amount) {
                totalValue += parseFloat(category.total_current_amount) || 0;
              }
            });
          }
          if (goldList && goldList.length > 0) {
            const goldTotal = goldList.reduce((sum, asset) => {
              return sum + (parseFloat(asset.user_asset_current_amount) || 0);
            }, 0);
            totalValue += goldTotal;
          }
          if (alternateAssetsList?.total_current_rate) {
            totalValue +=
              parseFloat(alternateAssetsList.total_current_rate) || 0;
          }
          tabName = "Total Portfolio";
      }

      setDashboardData((prev) => ({
        ...prev,
        investment: {
          ...prev.investment,
          t_curr_val: totalValue,
        },
      }));
    };

    // Only calculate if we have data
    if (mainData || otherInvestmentData || goldList || alternateAssetsList) {
      calculateTabSpecificPortfolioValue();
    }
  }, [
    selectedTab,
    mainData,
    otherInvestmentData,
    goldList,
    alternateAssetsList,
  ]);

  const parApi = async () => {
    const parRep = {
      user_id: "" + getUserId(),
      pan: userDetails.current.pan,
    };
    var payload_par = {
      url: "",
      method: "POST",
      data: parRep,
      headers: {
        gatewayauthtoken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJnYXRld2F5bmFtZSI6Imh0dHBzOi8vc3RnLm1pbnR5LmNvLmluLyIsImV4cCI6MTY4ODM4MjU2OX0.x2_gelbtpUBq6sSVajq-nhBwM7COXgnuaPir-IQyIRM",
        "Content-Type": "text/plain",
      },
    };
    var resp = await fetchEncryptData(payload_par);
    // setParApiresp(resp)
    return resp;
  };

  const parData = async () => {
    try {
      if (getUserId() == null) {
        loginRedirectGuest();
        return;
      }
      if (file.fileP) {
        document.querySelector("#pa-download").click();
        return;
      }
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Please Wait...",
          type: "info",
        },
      });
      setIsLoading(true);
      btnDownloadRef.current.setAttribute("disabled", true);
      let resp = await parApi();
      setIsLoading(false);
      const response = await fetch(resp.pdf_report_link);
      const blob = await response.blob();
      // setFile.fileP(URL.createObjectURL(blob));
      setFile((prev) => ({ ...prev, fileP: URL.createObjectURL(blob) }));
      btnDownloadRef.current.removeAttribute("disabled");
    } catch (e) { }
  };

  const fetchMailPar = async () => {
    setIsLoading(true);
    let resp = await parApi();
    if (resp.pdf_report_link) {
      var urlmail = {
        userdata: {
          to: userDetails.current.email,
        },
        subject: "Fintoo - Par Report",
        template: "transactions_dmf.html",
        contextvar: {
          name: userDetails.current.name,
          SUPPORT_EMAIL: SUPPORT_EMAIL,
          report_link: resp.pdf_report_link,
        },
      };

      // var data = commonEncode.encrypt(JSON.stringify(urlmail));
      let config = {
        method: "post",
        url: "",
        data: urlmail,
      };

      var res = await fetchEncryptData(config);
      setIsLoading(false);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: res.message, type: "success" },
      });
    } else {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Email not sent, Something went wrong...",
          type: "error",
        },
      });
    }
  };

  const handlesort = (v) => {
    var myarray = mainData?.fund_list;
    var numDescending;
    var data;
    switch (v) {
      case "Current Value":
        numDescending = myarray.sort((a, b) => b.curr_val - a.curr_val);
        data = { ...mainData, fund_list: numDescending };
        setMainData(data);
        break;
      case "Invested Amount":
        numDescending = myarray.sort((a, b) => b.inv - a.inv);
        data = { ...mainData, fund_list: numDescending };
        setMainData(data);
        break;
      case "Gain Percentage":
        numDescending = myarray.sort(
          (a, b) => b.xirr_percentage - a.xirr_percentage
        );
        data = { ...mainData, fund_list: numDescending };
        setMainData(data);
        break;
      case "Gain Value":
        numDescending = myarray.sort((a, b) => b.gain_loss - a.gain_loss);
        data = { ...mainData, fund_list: numDescending };
        setMainData(data);
        break;
    }
  };

  const stockSort = (v) => {
    var myarray = otherInvestmentData?.equity_shares?.stocks_details || [];
    var numDescending;
    switch (v) {
      case "Current Value":
        numDescending = [...myarray].sort((a, b) => b.cr_val - a.cr_val);
        var stocksData = {
          ...otherInvestmentData?.equity_shares,
          stocks_details: numDescending,
        };
        var updatedOtherInvestmentData = {
          ...otherInvestmentData,
          equity_shares: stocksData,
        };
        setOtherInvestmentData(updatedOtherInvestmentData);
        break;
      case "Invested Amount":
        numDescending = [...myarray].sort((a, b) => b.inv_val - a.inv_val);
        var stocksData = {
          ...otherInvestmentData?.equity_shares,
          stocks_details: numDescending,
        };
        var updatedOtherInvestmentData = {
          ...otherInvestmentData,
          equity_shares: stocksData,
        };
        setOtherInvestmentData(updatedOtherInvestmentData);
        break;
      case "Today Return":
        numDescending = [...myarray].sort((a, b) => b.today_rtn - a.today_rtn);
        var stocksData = {
          ...otherInvestmentData?.equity_shares,
          stocks_details: numDescending,
        };
        var updatedOtherInvestmentData = {
          ...otherInvestmentData,
          equity_shares: stocksData,
        };
        setOtherInvestmentData(updatedOtherInvestmentData);
        break;
      case "Total Return":
        numDescending = [...myarray].sort((a, b) => b.gain_val - a.gain_val);
        var stocksData = {
          ...otherInvestmentData?.equity_shares,
          stocks_details: numDescending,
        };
        var updatedOtherInvestmentData = {
          ...otherInvestmentData,
          equity_shares: stocksData,
        };
        setOtherInvestmentData(updatedOtherInvestmentData);
        break;
    }
  };

  const detailsPage = (v) => {
    var detailsData = JSON.stringify({
      pan: v.pan,
      data_belongs_to: DATA_BELONGS_TO,
      fund_registrar: v.fund_registrar,
      prod_code: v.prod_code,
      folio_no: v.folio_no,
      amc_code: v.amc_code,
    });

    var name_user = v.investor_name.toString();

    localStorage.setItem("detailsData", detailsData);
    // added for temporary name change
    dispatch({ type: "SET_TEMP_NAME", payload: name_user });
    navigate(
      process.env.PUBLIC_URL + "/direct-mutual-fund/portfolio/dashboard/fund"
    );
  };

  const checkIfPanExists = async () => {
    try {
      var reqData = {
        method: "post",
        url: DMF_CHECKIFPANEXISTS_API_URL,
        data: {
          pan: userDetails.current.pan,
          fp_user_id: getUserId(),
        },
      };
      let checkPan = await fetchData(reqData);
      if (checkPan.error_code == "100") {
        navigate(
          process.env.PUBLIC_URL +
          "/" +
          process.env.REACT_APP_FOLDER_NAME +
          "/portfolio/link-your-holdings"
        );
      } else if (checkPan.error_code == "101") {
        setpopuptext(
          "Please complete your profile to access all features and enjoy a tailored experience"
        );
        openModal();
        // dispatch({
        //   type: "RENDER_TOAST",
        //   payload: { message: checkPan.message, type: "error" },
        // });
      } else if (checkPan.error_code == "102") {
        setpopuptext(
          "Please complete your profile to access all features and enjoy a tailored experience"
        );
        openModal();
      }
    } catch (e) { }
  };

  function getFrequencyName(frequency) {
    switch (frequency) {
      case 1:
        return "Monthly";
      case 2:
        return "Quarterly";
      case 3:
        return "Half Yearly";
      case 4:
        return "Yearly";
      default:
        return "-";
    }
  }

  function insuraceType(type) {
    switch (type) {
      case 45:
        return "Endowment";
      case 47:
        return "General Insurance";
      case 46:
        return "Guaranteed Income Plan";
      case 48:
        return "Mediclaim";
      case 49:
        return "Pension Plan";
      case 43:
        return "Term Plan";
      case 44:
        return "ULIP";
      case 50:
        return "Others";
      default:
        return "-";
    }
  }

  const handleSubmit = () => {
    navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile/");
  };

  const checkHoldingStatus = async () => {
    try {
      const payload = {
        data_belongs_to: DATA_BELONGS_TO,
        user_id: getUserId(),
        holding_type: "MF",
      };
      const res = await Fetchexternalholdingdetails(payload);
      if (res.status_code == 200) {
        const holding = res?.data?.holding_details?.[0] || {};
        setUserExternalFundData(holding);
      } else {
        throw "";
      }
    } catch (e) { }
  };

  const checkStockHoldingStatus = async () => {
    try {
      const payload = {
        data_belongs_to: DATA_BELONGS_TO,
        user_id: getUserId(),
        holding_type: "Stocks",
      };
      const res = await Fetchexternalholdingdetails(payload);
      if (res.status_code == 200) {
        const holdingDetails = Array.isArray(res?.data?.holding_details)
          ? res.data.holding_details
          : [];
        const latestHolding = holdingDetails.reduce((latest, item) => {
          if (!item?.holding_modified_date) return latest;
          if (!latest?.holding_modified_date) return item;
          return moment(item.holding_modified_date).isAfter(
            moment(latest.holding_modified_date)
          )
            ? item
            : latest;
        }, {});
        setStockHoldingData(latestHolding || {});
      } else {
        setStockHoldingData({});
      }
    } catch (e) {
      setStockHoldingData({});
    }
  };

  useEffect(() => {
    if (otherinvUpdated) {
      fetchAssetData();
      fetchGoldAssets();
      fetchInsuranceDetails();
      dispatch({
        type: "OTHERINVESTMENT_UPDATE",
        payload: false,
      });
    }
  }, [otherinvUpdated]);

  useEffect(() => {
    if (userDetails?.current?.user_pan) {
      checkHoldingStatus();
      checkStockHoldingStatus();
    }
  }, [userDetails?.current?.user_pan]);

  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [tab, setTab] = useState("");
  const [count, setCount] = useState(0);
  const [openAllocation, setOpenAllocation] = useState(false);
  const [allocationLoading, setAllocationLoading] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
      width: 600,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br/>{point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        innerSize: "0%",
        name: "",
        colorByPoint: true,
        data: [],
      },
    ],
  });

  const fetchAllocation = async () => {
    try {
      setOpenAllocation(true);
      setAllocationLoading(true);

      var payload = {
        user_id: getUserId(),
        data_belongs_to: DATA_BELONGS_TO,
      };
      if (isFamilySelected()) {
        payload.family = "1";
      }
      var response = await GetAssetAllocation(payload);

      setGraphData(response.data);
      let _graphdata = response.data.map((v) => {
        return { name: v.title, y: v.value };
      });
      setChartOptions((prev) => ({
        ...prev,
        series: { ...prev.series, data: _graphdata },
      }));
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: e.message,
          type: "error",
        },
      });
      setOpenAllocation(false);
    } finally {
      setAllocationLoading(false);
    }
  };

  function parseDMY(dateStr) {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`); // convert to YYYY-MM-DD
  }
  const [userLeadId, setUserLeadId] = useState(null);

  useEffect(() => {
    const getUserLead = async () => {
      const res = await fetchUserProfileDetails(getUserId());
      const leadId = res?.data?.user_lead_id;

      // console.log(leadId, "userleadid response");
      setUserLeadId(leadId);
    };

    getUserLead();
  }, []);

  useEffect(() => {
    if (!userLeadId) return;
    const loggedIn = loginWebEngageSafe(userLeadId);
    if (loggedIn) {
      console.log("WebEngage login done:", userLeadId);
    }
  }, [userLeadId]);

  useEffect(() => {
    if (!window.webengage?.user) return;
    if (!userLeadId) return; // ensures login happened

    const summary = mainData?.portfolio_summary;
    const allocation = dashboardData?.investment_allocation;

    if (!summary || !allocation) return;

    const numberOfFunds = Array.isArray(mainData?.fund_list)
      ? mainData.fund_list.length
      : 0;

    const dayChange = Number(summary.tone_day_return_percentage);
    const xirr = Number(summary.txirr_percentage);
    const portfolioValue = Number(allocation.t_curr_val);

    if (
      Number.isNaN(dayChange) ||
      Number.isNaN(xirr) ||
      Number.isNaN(portfolioValue)
    ) {
      console.warn(" Invalid WebEngage values", {
        dayChange,
        xirr,
        portfolioValue,
      });
      return;
    }

    console.log(" WebEngage user attributes", {
      numberOfFunds,
      dayChange,
      xirr,
      portfolioValue,
    });

    window.webengage.user.setAttribute({
      number_of_funds: numberOfFunds,
      day_change_percentage: dayChange,
      xirr_percentage: xirr,
      portfolio_value: portfolioValue,
    });

  }, [userLeadId, mainData, dashboardData]);


  useEffect(() => {
    const stocks_data = dashboardData?.user_asset_data?.stocks || {};
    setStockListSummary(stocks_data)
    const stock_List_Data = stocks_data?.stock_details || [];
    const displayedStocks = viewAll
      ? stock_List_Data
      : stock_List_Data.slice(0, 5);

    setStockListData(displayedStocks);
  }, [dashboardData,viewAll])

  return (
    <PortfolioLayout>
      <Modal
        classNames={{
          modal: "ModalpopupContentWidth",
        }}
        open={Open}
        showCloseIcon={false}
        center
        animationDuration={0}
        closeOnOverlayClick={false}
        large
      >
        <div className="text-center">
          <h3 className="HeaderText">Attention !</h3>
          <div className="">
            <div
              className="PopupImg"
              style={{ width: "40%", margin: "0 auto" }}
            >
              <img
                style={{ width: "100%" }}
                src={
                  process.env.PUBLIC_URL + "/static/media/DMF/SelectingTeam.svg"
                }
              />
            </div>
            <div className="p-2">
              <p
                className="PopupContent"
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "normal",
                  padding: "0 1rem",
                  width: "90%",
                  margin: "0 auto",
                }}
              >
                {text}
              </p>
            </div>
            <div
              className="ButtonBx aadharPopUpFooter"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button
                className="ReNew"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        classNames={{
          modal: "ModalpopupContentWidth",
        }}
        open={openAllocation}
        center
        animationDuration={0}
        large
        closeOnOverlayClick={true}
        onClose={() => setOpenAllocation(false)}
        showCloseIcon={true}
      >
        <div className="text-center">
          <h3>Portfolio Asset Allocation</h3>
          {/* ${allocationLoading ? "invisible" : "visible"}  */}
          <div className={`position-relative`}>
            {allocationLoading && (
              <div
                className="position-absolute w-100"
                style={{
                  zIndex: 100,
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FintooInlineLoader isLoading={true} />
              </div>
            )}
            <div className={`${allocationLoading ? "invisible" : "visible"}`}>
              <HighchartsReact highcharts={Highcharts} options={chartOptions} />

            </div>
            <div
              className="text-start"
              style={{
                backgroundColor: "#ecf9e4",
                padding: "10px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              {graphData.map(
                (v) =>
                  v?.breakdown?.length > 0 && (
                    <div key={v.title}>
                      <h4 style={{ textTransform: "capitalize" }}>{v.title}</h4>
                      <div>
                        {v.breakdown.map((_v, index) => (
                          <div key={index} className="allocation-badge me-3">
                            {_v.title}:&nbsp;
                            <span>{Number(_v.value).toFixed(2)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </Modal>
      <FintooLoader isLoading={isLoading} />
      {isLoading ? (
        <div className="text-center p-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      ) : (
          <div className={style.portfolioPage}>
            <div className="row">
              <div className="col-12">
                <div className="mybox mt-4">
                  <div className="row">
                    <div className="col-12">
                      <div className="d-none d-md-flex justify-content-between">
                        <div></div>
                        <div className="topOptions">
                          <div
                            className="topOptionsButton pointer"
                            onClick={() =>
                              navigate(
                                process.env.PUBLIC_URL +
                                "/direct-mutual-fund/funds/all"
                              )
                            }
                          >
                            <PiggybankIcon width={"17px"} height={"17px"} />
                            <span>Add Funds</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="myboxInner">
                        <div className={`${style.statsContainer} row`}>
                          <div className={`${style.portfolioValue} col-4`}>
                            <p className={`smallCalendar mb-0 pt-1`}></p>
                            <p className="mb-2 pb-2">
                              <strong>Your Portfolio Value</strong>
                            </p>
                            <div className="valueBox pointer">
                              <p className="valueBoxPortolio pe-2">
                                <>
                                  <span className="valueBoxSymbol">₹</span>
                                  <span className="valueBoxAmount">
                                    {dashboardData?.investment_allocation &&
                                      "t_curr_val" in
                                      dashboardData.investment_allocation
                                      ? numberFormat(
                                        dashboardData.investment_allocation
                                          .t_curr_val * 1
                                      )
                                      : 0}
                                  </span>
                                </>
                              </p>
                              {Number(
                                dashboardData?.investment_allocation
                                  ?.t_curr_val || 0
                              ) != 0 && (
                                  <img
                                    onClick={() => {
                                      fetchAllocation();
                                    }}
                                    src={getPublicMediaURL(
                                      "/static/media/icons/pie-chart-ic.png"
                                    )}
                                    width={30}
                                    alt={"Asset Allocation Graph"}
                                    title={"Asset Allocation Graph"}
                                  // style={{ display: "none" }}
                                  />
                                )}
                            </div>
                          </div>
                          <div className={`${style.statsData} col-8`}>
                            <ProgressStats
                              selectedTab={selectedTab}
                              data={progressBarValues}
                              onSelect={(_number) => {
                                setSelectedTab(_number);
                                setSearchParams({
                                  ["assetTabNumber"]: _number,
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p style={{ height: "1rem" }}></p>
            <div className="row">
              <div className="col-12">
                <div className="col-12">
                  <div
                    className={`insideTabContent px-2 px-md-4 ${selectedTab == 1 ? "" : "d-none"
                      }`}
                  >
                    {isDataLoading.mfData ? (
                      <Table
                        responsive
                        className={`ptTable fixedTable ${style.mfTable} mb-0 ${style.dataTable}`}
                      >
                        <tbody>
                          <tr>
                            <td className="pt-1">
                              <div className="shine"></div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pt-1">
                              <div className="shine"></div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pt-1">
                              <div className="shine"></div>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    ) : (
                      <div>
                        {Boolean(mainData?.fund_list?.length) && (
                          <div className="row pb-3">
                            <div className="col-12 col-md-9">
                              <div className="d-none d-md-block">
                                <div className="cntResults">
                                  <div className="cntRItems">
                                    <div className="borderSpace">
                                      Total Funds
                                    </div>
                                    <div
                                      className={`borderSpace borderText pointer`}
                                    >
                                      {mainData?.fund_list?.length}{" "}
                                    </div>
                                  </div>
                                  <div className="cntRItems">
                                    <div className="borderSpace">
                                      Active SIP
                                    </div>
                                    <div
                                      className={`borderSpace borderText pointer`}
                                    >
                                      {mainData?.portfolio_summary?.active_sips}
                                      <span style={{ fontSize: ".9rem" }}>
                                        &nbsp;(
                                        {indianRupeeFormat(
                                          mainData?.portfolio_summary
                                            ?.active_sip_amount
                                        )}
                                        )
                                      </span>
                                    </div>
                                  </div>
                                  <div className="cntRItems">
                                    <div className="borderSpace">Invested</div>
                                    <div className={`borderSpace borderText`}>
                                      {indianRupeeFormat(
                                        mainData?.portfolio_summary
                                          ?.tinvested_value
                                      )}
                                    </div>
                                  </div>
                                  <div className="cntRItems">
                                    <div className="borderSpace">
                                      Total Fund Value
                                    </div>
                                    <div className={`borderSpace borderText`}>
                                      {indianRupeeFormat(
                                        mainData?.portfolio_summary?.tcurr_value
                                      )}
                                    </div>
                                  </div>

                                  <div className="cntRItems">
                                    <div className="borderSpace">Returns</div>
                                    <div className={`borderSpace borderText`}>
                                      {indianRupeeFormat(
                                        mainData?.portfolio_summary?.tgain_loss
                                      )}
                                    </div>
                                  </div>

                                  <div className="cntRItems">
                                    <div className="borderSpace">
                                      Day Change
                                    </div>
                                    <div
                                      className={`borderSpace borderText d-flex`}
                                    >
                                      <span
                                        className={` xrr-returns ${mainData?.portfolio_summary
                                          ?.tone_day_return < 0
                                          ? "red"
                                          : "green"
                                          }`}
                                      >
                                        {indianRupeeFormat(
                                          mainData?.portfolio_summary
                                            ?.tone_day_return
                                        )}
                                        &nbsp;
                                      </span>

                                      <small
                                        className={`valueBoxPercentage xrr-returns ${mainData?.portfolio_summary
                                          ?.tone_day_return_percentage < 0
                                          ? "red"
                                          : "green"
                                          }`}
                                      >
                                        (
                                        {mainData &&
                                          mainData?.portfolio_summary
                                            ?.tone_day_return_percentage}
                                        )&nbsp;
                                        {/* ({mainData?.tone_day_return_percentage}%)&nbsp; */}
                                        <FaLongArrowAltUp />
                                      </small>
                                    </div>
                                  </div>
                                  <div
                                    className="cntRItems pointer"
                                    onClick={() =>
                                      setReturnsType((prev) => ({
                                        ...prev,
                                        header:
                                          prev.header == "xirr"
                                            ? "absolute"
                                            : "xirr",
                                      }))
                                    }
                                  >
                                    <div className="borderSpace triangle-ct">
                                      {returnsType.header == "xirr"
                                        ? "XIRR"
                                        : "Absolute"}
                                      &nbsp;%
                                    </div>
                                    {
                                      <div
                                        className={`borderSpace borderText `}
                                      >
                                        {returnsType.header == "xirr" && (
                                          <p
                                            className={`valueBoxPercentage ${mainData?.portfolio_summary
                                              ?.txirr_percentage *
                                              1 <
                                              0
                                              ? "red"
                                              : "green"
                                              }`}
                                          >
                                            <span>
                                              {mainData?.portfolio_summary
                                                ?.txirr_percentage > 0
                                                ? +mainData?.portfolio_summary
                                                  ?.txirr_percentage
                                                : mainData?.portfolio_summary
                                                  ?.txirr_percentage}
                                              %
                                            </span>
                                            <FaLongArrowAltUp />
                                          </p>
                                        )}
                                        {returnsType.header == "absolute" && (
                                          <p
                                            className={`valueBoxPercentage ${mainData?.portfolio_summary
                                              ?.tabs_return_percentage *
                                              1 <
                                              0
                                              ? "red"
                                              : "green"
                                              }`}
                                          >
                                            <span>
                                              {mainData?.portfolio_summary
                                                ?.tabs_return_percentage > 0
                                                ? +mainData?.portfolio_summary
                                                  ?.tabs_return_percentage
                                                : mainData?.portfolio_summary
                                                  ?.tabs_return_percentage}
                                              %
                                            </span>
                                            <FaLongArrowAltUp />
                                          </p>
                                        )}
                                      </div>
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="d-block d-md-none mobile-portfolio-view">
                              <div className="col-12">
                                <div className="row">
                                  <div className="col-6 py-2">
                                    <div>Total Funds</div>
                                    <div className="text-bold">
                                      {mainData?.fund_list?.length ?? ""}
                                    </div>
                                  </div>
                                  <div className="col-6 py-2">
                                    <div>Total Fund Value</div>
                                    <div className="text-bold">
                                      {mainData?.portfolio_summary
                                        ?.tcurr_value &&
                                        !resetFilterTriggerState.filtersActive
                                        ? indianRupeeFormat(
                                          mainData?.portfolio_summary
                                            ?.tcurr_value
                                        )
                                        : indianRupeeFormat(
                                          getSumOfDataListProp(
                                            mainData?.fund_list,
                                            "curr_val"
                                          )
                                        )}
                                    </div>
                                  </div>
                                  <div className="col-6 py-2">
                                    <div>Invested</div>
                                    <div className="text-bold">
                                      {mainData?.portfolio_summary
                                        ?.tinvested_value &&
                                        !resetFilterTriggerState.filtersActive
                                        ? indianRupeeFormat(
                                          mainData?.portfolio_summary
                                            ?.tinvested_value
                                        )
                                        : indianRupeeFormat(
                                          getSumOfDataListProp(
                                            mainData?.fund_list,
                                            mainData?.fund_list,
                                            "inv"
                                          )
                                        )}
                                    </div>
                                  </div>
                                  <div className="col-6 py-2">
                                    <div>Returns</div>
                                    <div className="text-bold">
                                      {mainData?.portfolio_summary
                                        ?.tgain_loss &&
                                        !resetFilterTriggerState.filtersActive
                                        ? indianRupeeFormat(
                                          mainData?.portfolio_summary
                                            ?.tgain_loss
                                        )
                                        : indianRupeeFormat(
                                          getSumOfDataListProp(
                                            mainData?.fund_list,
                                            "gain_loss"
                                          )
                                        )}
                                    </div>
                                  </div>
                                  <div className="col-6 py-2">
                                    <div>Day Change</div>
                                    <div className="text-bold">
                                      {mainData?.portfolio_summary
                                        ?.tgain_loss &&
                                        !resetFilterTriggerState.filtersActive
                                        ? indianRupeeFormat(
                                          mainData?.portfolio_summary
                                            ?.tgain_loss
                                        )
                                        : indianRupeeFormat(
                                          getSumOfDataListProp(
                                            mainData?.fund_list,
                                            "gain_loss"
                                          )
                                        )}
                                    </div>
                                  </div>

                                  <div
                                    className="col-6 py-2"
                                    onClick={() =>
                                      setReturnsType((prev) => ({
                                        ...prev,
                                        header:
                                          prev.header == "xirr"
                                            ? "absolute"
                                            : "xirr",
                                      }))
                                    }
                                  >
                                    <div className="borderSpace align-items-center d-flex">
                                      <div className="pe-2 returns-txt">
                                        {returnsType.header == "xirr"
                                          ? "XIRR"
                                          : "Absolute"}
                                        &nbsp;%
                                      </div>
                                      <DownArrow
                                        width={"12px"}
                                        height={"12px"}
                                      />
                                    </div>
                                    <div className={`borderSpace borderText`}>
                                      {returnsType.header == "xirr" && (
                                        <p
                                          className={`valueBoxPercentage ${mainData?.portfolio_summary
                                            ?.txirr_percentage *
                                            1 <
                                            0
                                            ? "red"
                                            : "green"
                                            }`}
                                        >
                                          <span>
                                            {mainData?.portfolio_summary
                                              ?.txirr_percentage > 0
                                              ? +mainData?.portfolio_summary
                                                ?.txirr_percentage
                                              : mainData?.portfolio_summary
                                                ?.txirr_percentage}
                                            %
                                          </span>
                                          <FaLongArrowAltUp />
                                        </p>
                                      )}
                                      {returnsType.header == "absolute" && (
                                        <p
                                          className={`valueBoxPercentage ${mainData?.portfolio_summary
                                            ?.tabs_return_percentage *
                                            1 <
                                            0
                                            ? "red"
                                            : "green"
                                            }`}
                                        >
                                          <span>
                                            {mainData?.portfolio_summary
                                              ?.tabs_return_percentage > 0
                                              ? +mainData?.portfolio_summary
                                                ?.tabs_return_percentage
                                              : mainData?.portfolio_summary
                                                ?.tabs_return_percentage}
                                            %
                                          </span>
                                          <FaLongArrowAltUp />
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-md-3 ">
                              <div className="pt-4">
                                <div className="d-flex justify-content-end">
                                  <div>
                                    <div className=" ">
                                      <div className="resultOptions">
                                        <div>
                                          <div
                                            className={`${getItemLocal("family")
                                              ? "enable"
                                              : ""
                                              } resultOptionsBtn position-relative hover-dropdown pointer text-center`}
                                            onClick={() => {
                                              navigate(
                                                process.env.PUBLIC_URL +
                                                "/direct-mutual-fund/portfolio/link-your-holdings"
                                              );
                                            }}
                                          >
                                            {userExternalFundData?.holding_modified_date ? (
                                              <>Refresh</>
                                            ) : (
                                              <>Link your holdings</>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <p className="small-para mb-0 pt-2">
                                      {Boolean(
                                        userExternalFundData?.holding_modified_date
                                      ) &&
                                        "Last Updated on " +
                                        moment(
                                          userExternalFundData.holding_modified_date
                                        ).format("DD-MM-YYYY")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="fixedHeaders">
                          <div className="">
                            <div class="row pb-3">
                              <div className="col-12 col-md-9">
                                {/* <div class="ptTableBx" style={{
                                  overflowX: "auto"
                                }}>
                                  <div class="d-flex fn-inner-summary gap-3 pt-1">
                                    <div class="d-flex align-items-center">
                                      <span
                                        title="Active SIP"
                                        className={`${style["fund-tick-active"]} ${style["fund-tick-1"]}`}
                                      ></span>
                                      <span>Active SIP</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                      <span
                                        title="Inactive SIP"
                                        className={`${style["fund-tick-inactive"]} ${style["fund-tick-1"]}`}
                                      ></span>
                                      <span>Stopped SIP</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                      <span
                                        title="Offline SIP"
                                        className={`${style["fund-tick-offline"]} fund-tick`}
                                      ></span>
                                      <span>Offline Transaction</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                      <span
                                        title="Order Mapping Required"
                                        className={`${style["fund-tick-error"]} fund-tick`}
                                      ></span>
                                      <span>Order Mapping Required</span>
                                    </div>
                                  </div>
                                </div> */}
                              </div>
                              <div className="col-12 col-md-3 ">
                                <div className="pt-4">
                                  <div className="d-flex justify-content-end">
                                    <div className=" ">
                                      <div className="resultOptions">
                                        <div>
                                          <div
                                            className="resultOptionsBtn position-relative hover-dropdown pointer"
                                            onClick={() =>
                                              setIsFilterPanelActive(
                                                (prev) => !prev
                                              )
                                            }
                                          >
                                            <HiSortAscending
                                              fontSize={"1.2rem"}
                                            />
                                            <span>Sort & Filter</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="ptTableBx">
                              {Boolean(mainData?.fund_list?.length) && (
                                <Table
                                  className={`ptTable ${style.mfTable} ${style["bold-table"]} mb-0 ${style.headerTable}`}
                                >
                                  <thead>
                                    <tr>
                                      <td scope="col" className="align-top">
                                        Funds
                                      </td>
                                      <td scope="col" className="align-top">
                                        <p className="mb-1">Current Value</p>
                                        <p
                                          className="mb-0"
                                          style={{
                                            fontWeight: 500,
                                            fontSize: "0.8rem",
                                          }}
                                        >
                                          Invested
                                        </p>
                                      </td>
                                      <td scope="col" className="align-top">
                                        <p className="mb-1">Gain | Loss</p>
                                        <p
                                          className="mb-0"
                                          style={{
                                            fontWeight: 300,
                                            fontSize: "0.9rem",
                                          }}
                                        >
                                          Day Change
                                        </p>
                                      </td>
                                      <td scope="col" className="align-top">
                                        <div
                                          className="d-flex align-items-center pointer"
                                          onClick={() =>
                                            setReturnsType((prev) => ({
                                              ...prev,
                                              insideTable:
                                                prev.insideTable == "xirr"
                                                  ? "absolute"
                                                  : "xirr",
                                            }))
                                          }
                                        >
                                          <span className="pe-2">
                                            {returnsType.insideTable == "xirr"
                                              ? "XIRR"
                                              : "Absolute"}{" "}
                                            %
                                          </span>
                                          <DownArrow
                                            width={"12px"}
                                            height={"12px"}
                                          />
                                        </div>
                                      </td>
                                      <td scope="col"></td>
                                    </tr>
                                  </thead>
                                </Table>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className="  "
                          style={{
                            overflow: resetFilterTriggerState.showResetTriggerUi
                              ? "auto"
                              : "hidden",
                          }}
                        >
                          <Table
                            responsive
                            className={`ptTable fixedTable ${style.mfTable} mb-0 ${style.dataTable}`}
                          >
                            <tbody>
                              {(mainData?.fund_list || []).map((v, index) => (
                                <tr key={index}>
                                  <td
                                    scope="row"
                                    className="fundNameTd"
                                    data-label="Funds"
                                  >
                                    <div className="fundName9">
                                      <div className="position-relative">
                                        <img
                                          src={getPublicMediaURL(
                                            `/static/media/companyicons/${v.amc_code}.png`
                                          )}
                                          onError={(e) => {
                                            e.target.src = `${process.env.REACT_APP_STATIC_URL}/media/companyicons/amc_icon.png`;
                                            e.onError = null;
                                          }}
                                        />
                                        {(v?.inv_type || "").toLowerCase() ==
                                          "sip" && (
                                            <span
                                              title={
                                                v.sip_status == "active"
                                                  ? "Active SIP"
                                                  : "Inactive SIP"
                                              }
                                              className={`${v.sip_status == "active"
                                                ? style["fund-tick-active"]
                                                : style["fund-tick-inactive"]
                                                } ${style["fund-tick-"]} `}
                                            ></span>
                                          )}
                                      </div>

                                      <div className="fundNameCon">
                                        <div className="mb-2">
                                          {v.inv_type && (
                                            <span
                                              className={`me-2 ${style["invtype-badge"]} ${style["rounded-badge"]}`}
                                            >
                                              {v.inv_type}
                                            </span>
                                          )}
                                          {v.fund_registrar == "ecas" && (
                                            <span
                                              className={`${style["registrar-badge"]} ${style["rounded-badge"]}`}
                                            >
                                              External
                                            </span>
                                          )}
                                          {/* {getItemLocal("family") ? ( */}
                                          <strong className="investor-name orange">
                                            {v.investor_name}
                                          </strong>
                                          {/* ):("")} */}
                                        </div>
                                        <div
                                          className="fnc-yy"
                                          style={{ cursor: "pointer" }}
                                        >
                                          <strong
                                            onClick={() => detailsPage(v)}
                                          >
                                            {v.scheme}
                                          </strong>
                                        </div>
                                        <div className="d-flex fn-inner-summary pt-1">
                                          <div>Folio: {v.folio_no}</div>
                                          <div>NAV: {v.curr_nav}</div>
                                          <div>Units: {v.units}</div>
                                        </div>
                                        <div></div>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    scope="row"
                                    data-label="Current Value"
                                    className=""
                                  >
                                    <div>
                                      <strong>
                                        {" "}
                                        {indianRupeeFormat(v.curr_val)}
                                      </strong>
                                    </div>
                                    <p
                                      className="mb-0 pt-1"
                                      style={{
                                        fontWeight: 300,
                                        fontSize: "0.8rem",
                                      }}
                                    >
                                      {" "}
                                      {indianRupeeFormat(v.inv)}
                                    </p>
                                  </td>

                                  <td
                                    scope="row"
                                    data-label="Gain | Loss"
                                    className=""
                                  >
                                    <div>
                                      <strong
                                        className={`xrr-returns ${v.gain_loss * 1 < 0 ? "red" : "green"
                                          }`}
                                      >
                                        {indianRupeeFormat(v.gain_loss)}
                                      </strong>
                                    </div>
                                    <p
                                      className="mb-0 pt-1"
                                      style={{
                                        fontWeight: 300,
                                        fontSize: "0.8rem",
                                      }}
                                    >
                                      <span
                                        className={` xrr-returns ${v.day_change < 0 ? "red" : "green"
                                          }`}
                                      >
                                        {indianRupeeFormat(v.day_change)}
                                        &nbsp;
                                      </span>
                                      <span
                                        className={`xrr-returns ${v.day_change_perc < 0
                                          ? "red"
                                          : "green"
                                          }`}
                                      >
                                        ({v.day_change_perc}%)
                                      </span>
                                    </p>
                                  </td>
                                  <td
                                    scope="row"
                                    data-label="XIRR %"
                                    className=""
                                  >
                                    <div>
                                      <strong
                                        className={`xrr-returns ${v.xirr_percentage < 0
                                          ? "red"
                                          : "green"
                                          }`}
                                      >
                                        {returnsType.insideTable == "xirr"
                                          ? v.xirr_percentage != "Error"
                                            ? v.xirr_percentage
                                            : 0
                                          : v.abs_return_percentage}
                                      </strong>
                                    </div>
                                  </td>
                                  <td className="">
                                    <p
                                      onClick={() => detailsPage(v)}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <ExploreStock />
                                    </p>
                                  </td>
                                </tr>
                              ))}
                              {Boolean(mainData?.fund_list?.length) ===
                                false && (
                                  <tr>
                                    <div className="w-50 m-auto p-5">
                                      <BulletPoint
                                        heading={
                                          "Track and manage your mutual fund"
                                        }
                                        text={`Across multiple brokers at one place. Always stay on top of yourholdings`}
                                      />
                                      <BulletPoint
                                        heading={`Real time analysis of your mutual fund performance`}
                                        text={`Powerful and in-depth analysis on all your holdings with actionable insights`}
                                      />
                                      <BulletPoint
                                        heading={`Get advisory on your mutual fund portfolio`}
                                        text={`Real time investment advisory, super-charge your portfolio's performance!`}
                                      />

                                      <div className="pt-3">
                                        <ActionButton
                                          label={"Add mutual fund now"}
                                          onClick={() => {
                                            navigate(
                                              process.env.PUBLIC_URL +
                                              "/direct-mutual-fund/funds/all"
                                            );
                                          }}
                                        />
                                        <ActionButton
                                          label={"Fetch your external holdings"}
                                          onClick={() => {
                                            navigate(
                                              process.env.PUBLIC_URL +
                                              "/direct-mutual-fund/portfolio/link-your-holdings"
                                            );
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </tr>
                                )}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* ================================================================= MF table end ================================================================= */}
                <div>
                  {/* {!otherInvestmentData ? ( */}
                  {isDataLoading.otherInvestmentData &&
                    searchParams.get("assetTabNumber") != 1 ? (
                    <div className={`insideTabContent px-2 px-md-4`}>
                      <Table
                        responsive
                        className={`ptTable fixedTable ${style.mfTable} mb-0 ${style.dataTable}`}
                      >
                        <tbody>
                          <tr>
                            <td className="pt-1">
                              <div className="shine"></div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pt-1">
                              <div className="shine"></div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pt-1">
                              <div className="shine"></div>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div>
                      <div
                        className={`insideTabContent px-2 px-md-4 ${selectedTab == 2 ? "" : "d-none"
                          }`}
                      >
                        {otherInvestmentData?.insurance_data
                          ?.insurance_details &&
                          otherInvestmentData?.insurance_data?.insurance_details
                            .length > 0 ? (
                          <>
                            <div className="row pb-3">
                              <div className="col-12 col-md-9">
                                <div className="d-none d-md-block">
                                  <div className="cntResults">
                                    <div className={style.ecntRItems}>
                                      <div className={style.borderSpace}>
                                        No. Of Policies
                                      </div>
                                      <div
                                        className={`borderSpace borderText pointer`}
                                      >
                                        {otherInvestmentData?.insurance_data
                                          ?.no_of_policies != undefined
                                          ? otherInvestmentData.insurance_data
                                            .no_of_policies
                                          : "-"}
                                      </div>
                                    </div>
                                    <div className={style.ecntRItems}>
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Premium Amount
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        {otherInvestmentData?.insurance_data
                                          ?.total_premium_amount
                                          ? indianRupeeFormat(
                                            otherInvestmentData.insurance_data
                                              .total_premium_amount
                                          )
                                          : "-"}
                                      </div>
                                    </div>
                                    <div
                                      className={`mt-2 mt-md-0 ${style.ecntRItems}`}
                                    >
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Sum Assured
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        {otherInvestmentData?.insurance_data
                                          ?.total_risk_coverage
                                          ? indianRupeeFormat(
                                            otherInvestmentData.insurance_data
                                              .total_risk_coverage
                                          )
                                          : "-"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`col-12 col-md-3 ${style.addBtnContainer}`}
                              >
                                <div className={`${style.addBtn}`}>
                                  <Link
                                    className={`anchor-primary ${style.linkStyle}`}
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/commondashboard/investment/new-insurance"
                                    }
                                  >
                                    <span>
                                      <i className="fa-solid fa-plus"></i>
                                    </span>{" "}
                                    <span>Add Insurance</span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="fixedHeaders">
                              <div className="table-responsive">
                                <div className="ptTableBx">
                                  <Table
                                    className={`ptTable ${style["portfolio-insurance-table"]} ${style["bold-table"]} mb-0`}
                                  >
                                    <thead>
                                      <tr>
                                        <td
                                          scope="col"
                                        // className={`${style.policyCompany}`}
                                        >
                                          Policy Name
                                        </td>
                                        <td scope="col">Policy Number</td>
                                        <td scope="col">Insurance Type</td>
                                        <td scope="col">Premium (&#x20B9;)</td>
                                        <td scope="col">
                                          Sum assured (&#x20B9;)
                                        </td>
                                        <td scope="col">Start Date</td>
                                        <td scope="col">Term Date</td>
                                        <td
                                          scope="col"
                                          style={{ width: "10%" }}
                                        >
                                          &nbsp;
                                        </td>
                                      </tr>
                                    </thead>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-4">
                            <p className="fw-bold mb-0">
                              Currently it seems like we don't have your
                              Insurance Policy data to display
                            </p>
                            <p className="fw-bold">
                              You can add your existing Insurance Policy
                            </p>
                            <div className="text-center">
                              <Link
                                className="anchor-primary"
                                to={
                                  process.env.PUBLIC_URL +
                                  "/commondashboard/investment/new-insurance"
                                }
                              >
                                Add Insurance
                              </Link>
                              <img
                                className="pt-4"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "/media/Group-162.png"
                                }
                                style={{ width: 200 }}
                              />
                            </div>
                          </div>
                        )}

                        {otherInvestmentData?.insurance_data
                          ?.insurance_details &&
                          otherInvestmentData?.insurance_data?.insurance_details
                            .length > 0 && (
                            <div className="">
                              <Table
                                responsive
                                className={`ptTable fixedTable ${style.dataTable} ${style["portfolio-insurance-table"]} mb-0`}
                              >
                                <tbody>
                                  {otherInvestmentData?.insurance_data?.insurance_details.map(
                                    (v) => (
                                      <tr
                                        className={`${style.tableRowStyle}`}
                                        style={{
                                          borderBottom:
                                            "1px solid black !important",
                                        }}
                                        key={v?.insurance_id}
                                      >
                                        <td
                                          scope="row"
                                          data-label="Policy Name"
                                        // className={`${style.policyCompany}`}
                                        >
                                          <div className="d-flex">
                                            <div className="pe-3">
                                              <img
                                                class={`accordian-img ${style.tblIcons}`}
                                                src={
                                                  process.env
                                                    .REACT_APP_STATIC_URL_PYTHON +
                                                  "/assets/img/insurance/insurance_insurance_form.svg"
                                                }
                                              />
                                            </div>
                                            <div>
                                              {v.insurance_company_name == null
                                                ? v.policy_name != ""
                                                  ? v.policy_name
                                                  : "-"
                                                : v.insurance_company_name}
                                            </div>
                                          </div>
                                        </td>
                                        <td
                                          scope="row"
                                          data-label="Policy Number"
                                        >
                                          {v.policy_no ? v.policy_no : "-"}
                                        </td>
                                        <td
                                          scope="row"
                                          data-label="Insurance Type"
                                          className=""
                                        >
                                          {v.insurance_type || "-"}
                                        </td>
                                        <td
                                          scope="row"
                                          data-label="Premium"
                                          className=""
                                        >
                                          {indianRupeeFormat(v.premium_amount)}
                                        </td>
                                        <td
                                          scope="row"
                                          data-label="Sum assured"
                                          className=""
                                        >
                                          {indianRupeeFormat(v.risk_coverage)}
                                        </td>
                                        <td
                                          scope="row"
                                          data-label="Start Date"
                                          className=""
                                        >
                                          {v?.policy_start_date
                                            ? moment(
                                              v.policy_start_date
                                            ).format("MM/DD/YYYY")
                                            : "-"}
                                        </td>
                                        <td
                                          scope="row"
                                          data-label="Term Date"
                                          className=""
                                        >
                                          {v?.maturitydate
                                            ? moment(v.maturitydate).format(
                                              "MM/DD/YYYY"
                                            )
                                            : "-"}
                                        </td>
                                        <td>
                                          <div
                                            className={
                                              style.actionBtnsContainer
                                            }
                                          >
                                            <Link
                                              to={
                                                process.env.PUBLIC_URL +
                                                "/commondashboard/investment/new-insurance/" +
                                                btoa(v.insurance_id)
                                              }
                                            >
                                              <i
                                                className={`fa-solid fa-pen-to-square ${style.trash}`}
                                              ></i>
                                            </Link>
                                            <i
                                              class={`fa fa-trash ${style.trash}`}
                                              onClick={() =>
                                                deleteAsset(
                                                  v.insurance_id,
                                                  "insurance",
                                                  null,
                                                  "Are you sure you want to delete your insurance?"
                                                )
                                              }
                                              aria-hidden="true"
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </Table>
                            </div>
                          )}
                      </div>
                      {/* fd section */}
                      <div
                        className={`insideTabContent px-2 px-md-4 ${selectedTab == 3 ? "" : "d-none"
                          }`}
                      >
                        {fdBondList &&
                          Boolean(Object.keys(fdBondList).length) && (
                            <div className="row pb-3">
                              <div className="col-12 col-md-9">
                                <div className="d-none d-md-block">
                                  <div className="cntResults">
                                    <div className={style.ecntRItems}>
                                      <div className={style.borderSpace}>
                                        Total FDs & Bonds
                                      </div>
                                      <div
                                        className={`borderSpace borderText pointer`}
                                      >
                                        {fdBondList ? fdBondList.length : "-"}
                                      </div>
                                    </div>
                                    <div className={style.ecntRItems}>
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Invested Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        ₹{" "}
                                        {fdBondList
                                          .reduce(
                                            (sum, item) =>
                                              sum +
                                              Number(
                                                item.user_asset_investment_amount ||
                                                0
                                              ),
                                            0
                                          )
                                          .toLocaleString("en-IN")}
                                      </div>
                                    </div>
                                    <div
                                      className={`mt-2 mt-md-0 ${style.ecntRItems}`}
                                    >
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Current Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        ₹{" "}
                                        {fdBondList
                                          .reduce(
                                            (sum, item) =>
                                              sum +
                                              Number(
                                                item.user_asset_current_amount ||
                                                0
                                              ),
                                            0
                                          )
                                          .toLocaleString("en-IN")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`col-12 col-md-3 ${style.addBtnContainer}`}
                              >
                                <div className={`${style.addBtn}`}>
                                  <Link
                                    className={`anchor-primary ${style.linkStyle}`}
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/commondashboard/investment/new-fd-bonds"
                                    }
                                  >
                                    <span>
                                      <i className="fa-solid fa-plus"></i>
                                    </span>{" "}
                                    <span>Add FD & Bonds</span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )}
                        {fdBondList &&
                          Object.keys(fdBondList || {}).length > 0 && (
                            <div className="fixedHeaders">
                              <div className="table-responsive">
                                <div className="ptTableBx">
                                  <Table
                                    className={`ptTable ${style["portfolio-fd-table"]} ${style.fdTbl} ${style["bold-table"]} mb-0 ${style.headerTable}`}
                                  >
                                    <thead>
                                      <tr>
                                        <td scope="col">Name of Asset</td>
                                        <td scope="col">Tenure (Year)</td>
                                        <td scope="col">Interest Rate</td>
                                        <td scope="col">Invested Value</td>
                                        <td scope="col">Current Value</td>
                                        <td scope="col">Maturity Value</td>
                                        <td scope="col">Start Date</td>
                                        <td scope="col">Maturity Date</td>
                                        <td scope="col">&nbsp;</td>
                                      </tr>
                                    </thead>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          )}
                        <div className="  ">
                          <Table
                            responsive
                            className={`ptTable fixedTable ${style["portfolio-fd-table"]} ${style["actual-data-table"]} ${style.fdTbl} mb-0 ${style.dataTable}`}
                          >
                            <tbody>
                              {fdBondList?.length ? (
                                fdBondList.map((v) => (
                                  <tr key={v.name}>
                                    <td scope="row" data-label="Name of Asset">
                                      <AssetName
                                        title={
                                          v.user_asset_name
                                            ? v.user_asset_name
                                            : v.issuer_type || "-"
                                        }
                                        icon={
                                          process.env
                                            .REACT_APP_STATIC_URL_PYTHON +
                                          "/assets/img/insurance/insurance_insurance_form.svg"
                                        }
                                      />
                                    </td>
                                    <td scope="row" data-label="Tenure (Year)">
                                      {v.user_asset_maturity_date &&
                                        v.user_asset_purchase_date
                                        ? (() => {
                                          try {
                                            const [mDay, mMonth, mYear] = (
                                              v.user_asset_maturity_date || ""
                                            ).split("/");
                                            const [pDay, pMonth, pYear] = (
                                              v.user_asset_purchase_date || ""
                                            ).split("/");

                                            if (
                                              !mDay ||
                                              !mMonth ||
                                              !mYear ||
                                              !pDay ||
                                              !pMonth ||
                                              !pYear
                                            )
                                              return "-";

                                            const maturity = new Date(
                                              `${mYear}-${mMonth}-${mDay}`
                                            );
                                            const purchase = new Date(
                                              `${pYear}-${pMonth}-${pDay}`
                                            );

                                            if (
                                              isNaN(maturity) ||
                                              isNaN(purchase)
                                            )
                                              return "-";

                                            const tenure = Math.floor(
                                              (maturity - purchase) /
                                              (1000 * 60 * 60 * 24 * 365)
                                            );

                                            return tenure >= 0 ? tenure : "-";
                                          } catch (err) {
                                            return "-";
                                          }
                                        })()
                                        : "-"}
                                    </td>

                                    <td
                                      scope="row"
                                      data-label="Interest Rate"
                                      className=""
                                    >
                                      {v.user_asset_ror
                                        ? v.user_asset_ror
                                        : "-"}
                                      %
                                    </td>
                                    <td
                                      scope="row"
                                      data-label="Invested Value"
                                      className=""
                                    >
                                      {v.user_asset_investment_amount === 0
                                        ? "-"
                                        : indianRupeeFormat(
                                          Math.round(
                                            v.user_asset_investment_amount
                                          )
                                        )}
                                    </td>
                                    <td
                                      scope="row"
                                      data-label="Current Value"
                                      className=""
                                    >
                                      {indianRupeeFormat(
                                        Math.round(v.user_asset_current_amount)
                                      )}
                                    </td>
                                    <td
                                      scope="row"
                                      data-label="Maturity Amount"
                                      className=""
                                    >
                                      <span className={`xrr-returns`}>
                                        {indianRupeeFormat(
                                          parseFloat(
                                            Math.ceil(
                                              v.user_asset_maturity_amount
                                            )
                                          ).toFixed(2)
                                        )}
                                      </span>
                                    </td>
                                    <td
                                      scope="row"
                                      data-label="Start Date"
                                      className=""
                                    >
                                      <span className={`xrr-returns`}>
                                        {v.user_asset_purchase_date
                                          ? moment(
                                            v.user_asset_purchase_date,
                                            "DD/MM/YYYY"
                                          ).format("DD/MM/YYYY")
                                          : "-"}
                                      </span>
                                    </td>
                                    <td
                                      scope="row"
                                      data-label="Maturity Date"
                                      className=""
                                    >
                                      <span className={`xrr-returns`}>
                                        {v.user_asset_maturity_date
                                          ? moment(
                                            v.user_asset_maturity_date,
                                            "DD/MM/YYYY"
                                          ).format("DD/MM/YYYY")
                                          : "-"}
                                      </span>
                                    </td>
                                    <td>
                                      <div
                                        className={style.actionBtnsContainer}
                                      >
                                        <Link
                                          to={
                                            process.env.PUBLIC_URL +
                                            "/commondashboard/investment/new-fd-bonds?id=" +
                                            v.name
                                          }
                                        >
                                          <i
                                            className={`fa-solid fa-pen-to-square ${style.trash}`}
                                            title="Edit Asset"
                                          ></i>
                                        </Link>

                                        <i
                                          className={`fa-solid fa-trash ${style.trash} pointer`}
                                          onClick={() =>
                                            deleteUserAsset(
                                              v.name,
                                              "Are you sure you want to delete your asset?"
                                            )
                                          }
                                          title="Delete Asset"
                                          aria-hidden="true"
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="9">
                                    <div className="text-center py-4">
                                      <p className="fw-bold mb-0">
                                        Currently it seems like we don't have
                                        your Bonds, Fixed Deposit data to
                                        display
                                      </p>
                                      <p className="fw-bold">
                                        You can add your existing Debt Assets
                                      </p>
                                      <Link
                                        className="anchor-primary"
                                        to={
                                          process.env.PUBLIC_URL +
                                          "/commondashboard/investment/new-fd-bonds?type=fd"
                                        }
                                      >
                                        Add Existing Asset
                                      </Link>
                                      <div>
                                        <img
                                          className="pt-4"
                                          src={
                                            process.env.REACT_APP_STATIC_URL +
                                            "/media/Group-162.png"
                                          }
                                          style={{ width: 200 }}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                      {/* govt scheme section */}
                      <div
                        className={`govtschemetable insideTabContent px-2 px-md-4 ${selectedTab == 4 ? "" : "d-none"
                          }`}
                      >
                        {govtSchemeList?.length > 0 ? (
                          <>
                            <div className="row pb-3">
                              <div className="col-12 col-md-9">
                                <div className="d-block">
                                  <div className="cntResults">
                                    <div className={style.ecntRItems}>
                                      <div className={style.borderSpace}>
                                        Total Schemes
                                      </div>
                                      <div
                                        className={`borderSpace borderText pointer`}
                                      >
                                        {govtSchemeList?.length != undefined
                                          ? govtSchemeList?.length
                                          : "-"}
                                      </div>
                                    </div>
                                    <div className={style.ecntRItems}>
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Invested Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        ₹{" "}
                                        {govtSchemeList
                                          .reduce(
                                            (sum, item) =>
                                              sum +
                                              Number(
                                                item.total_invested_amount || 0
                                              ),
                                            0
                                          )
                                          .toLocaleString("en-IN")}
                                      </div>
                                    </div>
                                    <div
                                      className={`mt-2 mt-md-0 ${style.ecntRItems}`}
                                    >
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Current Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        ₹{" "}
                                        {govtSchemeList
                                          .reduce(
                                            (sum, item) =>
                                              sum +
                                              Number(
                                                item.total_current_amount || 0
                                              ),
                                            0
                                          )
                                          .toLocaleString("en-IN")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Link
                                className="anchor-primary"
                                to={
                                  process.env.PUBLIC_URL +
                                  "/commondashboard/investment/new-govt-scheme"
                                }
                              >
                                Add Existing Scheme
                              </Link>
                            </div>

                            <div className="fixedHeaders">
                              <div className="table-responsive">
                                <div className="ptTableBx">
                                  <Table
                                    className={`ptTable ${style.govtSchemeTbl} mb-0 ${style["bold-table"]} ${style.headerTable}`}
                                  >
                                    <thead>
                                      <tr>
                                        <td scope="col">Name Of Asset</td>
                                        <td scope="col">Interest Rate</td>
                                        <td scope="col">Frequency</td>
                                        <td scope="col">Invested Value</td>
                                        <td scope="col">Current Value</td>
                                        <td scope="col">Maturity Value</td>
                                        <td scope="col">Start Date</td>
                                        <td scope="col">Maturity Date</td>
                                        <td scope="col">&nbsp;</td>
                                      </tr>
                                    </thead>
                                  </Table>
                                </div>
                              </div>
                            </div>
                            <div className="  ">
                              <Table
                                responsive
                                className={`ptTable fixedTable ${style.govtSchemeTbl} mb-0 ${style.dataTable}`}
                              >
                                <tbody>
                                  {govtSchemeList?.map((v) => (
                                    <tr key={v.post_id}>
                                      <td scope="row" data-label="Funds">
                                        <AssetName
                                          title={v.asset_type_name}
                                          icon={
                                            process.env
                                              .REACT_APP_STATIC_URL_PYTHON +
                                            "/assets/img/insurance/insurance_insurance_form.svg"
                                          }
                                        />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="Current Value"
                                        className=""
                                      >
                                        <strong>
                                          {v.user_asset_ror
                                            ? parseFloat(v.user_asset_ror) + "%"
                                            : "-"}
                                        </strong>
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="Units"
                                        className=""
                                      >
                                        <strong>
                                          {v?.user_asset_freq
                                            ? v.user_asset_freq
                                            : "-"}
                                        </strong>
                                      </td>
                                      <td scope="row" data-label="Invested">
                                        <strong>
                                          {Number(
                                            v.user_asset_investment_amount
                                          )
                                            ? indianRupeeFormat(
                                              v.user_asset_investment_amount
                                            )
                                            : "-"}
                                        </strong>
                                        <br />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="Gain | Loss"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          <strong className={`xrr-returns`}>
                                            {v.total_current_amount
                                              ? indianRupeeFormat(
                                                v.total_current_amount
                                              )
                                              : "-"}
                                          </strong>
                                        </strong>
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="XIRR %"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {v.user_asset_maturity_amount
                                            ? indianRupeeFormat(
                                              v.user_asset_maturity_amount * 1
                                            )
                                            : "-"}
                                        </strong>
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="XIRR %"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {v.user_asset_purchase_date
                                            ? v.user_asset_purchase_date
                                            : "-"}
                                        </strong>
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="XIRR %"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {v.user_asset_maturity_date
                                            ? v.user_asset_maturity_date
                                            : "-"}
                                        </strong>
                                      </td>
                                      <td>
                                        <div
                                          className={style.actionBtnsContainer}
                                        >
                                          <>
                                            <Link
                                              to={
                                                process.env.PUBLIC_URL +
                                                "/commondashboard/investment/new-govt-scheme/?id=" +
                                                v.name
                                              }
                                            >
                                              <i
                                                className={`fa-solid fa-pen-to-square ${style.trash}`}
                                              ></i>
                                            </Link>
                                          </>

                                          <i
                                            class={`fa fa-trash ${style.trash}`}
                                            onClick={() =>
                                              deleteUserAsset(
                                                v.name,
                                                "Are you sure you want to delete your asset?"
                                              )
                                            }
                                            aria-hidden="true"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <br />
                              <p className="text-center fw-bold mb-0">
                                Currently it seems like we don't have your
                                Government Scheme data to display
                              </p>
                              <p className="text-center fw-bold">
                                You can add your existing Government Schemes
                              </p>
                              <div className="text-center">
                                <Link
                                  className="anchor-primary"
                                  to={
                                    process.env.PUBLIC_URL +
                                    "/commondashboard/investment/new-govt-scheme"
                                  }
                                >
                                  Add Existing Scheme
                                </Link>

                                <img
                                  className="pt-4"
                                  src={
                                    process.env.REACT_APP_STATIC_URL +
                                    "/media/Group-162.png"
                                  }
                                  style={{ width: 200 }}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div
                        className={`insideTabContent px-2 px-md-4 ${selectedTab == 5 ? "" : "d-none"
                          }`}
                      >
                        {realestateList?.length > 0 ? (
                          <>
                            <div className="row pb-3">
                              <div className="col-12 col-md-9">
                                <div className="d-block">
                                  <div className="cntResults">
                                    <div className={style.ecntRItems}>
                                      <div className={style.borderSpace}>
                                        No. Of Properties
                                      </div>
                                      <div
                                        className={`borderSpace borderText pointer`}
                                      >
                                        {realestateList?.length != undefined
                                          ? realestateList?.length
                                          : "-"}
                                      </div>
                                    </div>

                                    <div className={style.ecntRItems}>
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Purchased Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        ₹{" "}
                                        {realestateList
                                          .reduce(
                                            (sum, item) =>
                                              sum +
                                              Number(
                                                item.total_invested_amount || 0
                                              ),
                                            0
                                          )
                                          .toLocaleString("en-IN")}
                                      </div>
                                    </div>
                                    <div
                                      className={`mt-2 mt-md-0 ${style.ecntRItems}`}
                                    >
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Current Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        ₹{" "}
                                        {realestateList
                                          .reduce(
                                            (sum, item) =>
                                              sum +
                                              Number(
                                                item.user_asset_current_amount ||
                                                0
                                              ),
                                            0
                                          )
                                          .toLocaleString("en-IN")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`col-12 col-md-3 ${style.addBtnContainer}`}
                              >
                                <div className={`${style.addBtn}`}>
                                  <>
                                    <Link
                                      className={`anchor-primary ${style.linkStyle}`}
                                      to={
                                        process.env.PUBLIC_URL +
                                        "/commondashboard/investment/new-real-estate"
                                      }
                                    >
                                      <span>
                                        <i className="fa-solid fa-plus"></i>
                                      </span>{" "}
                                      <span>Add Real Estate</span>
                                    </Link>
                                  </>
                                </div>
                              </div>
                            </div>
                            <div className="fixedHeaders">
                              <div className="table-responsive">
                                <div className="ptTableBx">
                                  <Table
                                    className={`ptTable mb-0 ${style["bold-table"]} ${style.realEstateTable} ${style.headerTable}`}
                                  >
                                    <thead>
                                      <tr>
                                        <td scope="col">Name Of Property</td>
                                        <td scope="col">Member Name</td>
                                        <td scope="col">Type of Property</td>
                                        <td scope="col">Purchased Value</td>
                                        <td scope="col">Current Value</td>
                                        <td scope="col">Returns</td>
                                        <td scope="col">Absolute Returns</td>
                                        <td scope="col">&nbsp;</td>
                                      </tr>
                                    </thead>
                                  </Table>
                                </div>
                              </div>
                            </div>
                            <div className="  ">
                              <Table
                                responsive
                                className={`ptTable fixedTable ${style.realEstateTable} mb-0 ${style.dataTable}`}
                              >
                                <tbody>
                                  {realestateList?.map((v) => (
                                    <tr key={v.name}>
                                      {/* 1. Name Of Property */}
                                      <td
                                        scope="row"
                                        data-label="Name Of Property"
                                      >
                                        <AssetName
                                          title={v.user_asset_name || "-"}
                                          icon={
                                            process.env
                                              .REACT_APP_STATIC_URL_PYTHON +
                                            "assets/img/assets-liabilities/assets_real_estate.svg"
                                          }
                                        />
                                      </td>

                                      {/* 2. Member Name */}
                                      <td scope="row" data-label="Member Name">
                                        <strong className="xrr-returns">
                                          {(() => {
                                            if (v.user_asset_for === "0") {
                                              return "Family";
                                            }
                                            const member = familyData.find(
                                              (m) =>
                                                m.member_id === v.user_asset_for
                                            );
                                            if (member?.label) {
                                              return member.label;
                                            }
                                            if (member?.email) {
                                              return member.email;
                                            }
                                            return "-";
                                          })()}
                                        </strong>
                                      </td>

                                      {/* 3. Type of Property */}
                                      <td
                                        scope="row"
                                        data-label="Type of Property"
                                      >
                                        <strong>
                                          {v.user_asset_property_type ||
                                            v.property_type ||
                                            v.asset_type ||
                                            "-"}
                                        </strong>
                                      </td>

                                      {/* 4. Purchased Value */}
                                      <td
                                        scope="row"
                                        data-label="Purchased Value"
                                      >
                                        <strong className="xrr-returns">
                                          {v.user_asset_investment_amount
                                            ? indianRupeeFormat(
                                              v.user_asset_investment_amount *
                                              1
                                            )
                                            : "-"}
                                        </strong>
                                      </td>

                                      {/* 5. Current Value */}
                                      <td
                                        scope="row"
                                        data-label="Current Value"
                                      >
                                        <strong>
                                          {v.user_asset_current_amount
                                            ? indianRupeeFormat(
                                              v.user_asset_current_amount * 1
                                            )
                                            : "-"}
                                        </strong>
                                      </td>

                                      {/* 6. Returns */}
                                      <td scope="row" data-label="Returns">
                                        <strong
                                          className={`xrr-returns ${v.user_asset_current_amount -
                                            v.user_asset_investment_amount <
                                            0
                                            ? "red"
                                            : "green"
                                            }`}
                                        >
                                          {v.user_asset_current_amount -
                                            v.user_asset_investment_amount !==
                                            0
                                            ? indianRupeeFormat(
                                              v.user_asset_current_amount -
                                              v.user_asset_investment_amount *
                                              1
                                            )
                                            : "-"}
                                        </strong>
                                      </td>

                                      {/* 7. Absolute Returns */}
                                      <td
                                        scope="row"
                                        data-label="Absolute Returns"
                                      >
                                        <strong
                                          className={`xrr-returns ${v.user_asset_investment_amount !== 0
                                            ? ((v.user_asset_current_amount -
                                              v.user_asset_investment_amount) /
                                              v.user_asset_investment_amount) *
                                              100 <
                                              0
                                              ? "red"
                                              : "green"
                                            : "default-class"
                                            }`}
                                        >
                                          {v.user_asset_investment_amount !== 0
                                            ? `${(
                                              ((v.user_asset_current_amount -
                                                v.user_asset_investment_amount) /
                                                v.user_asset_investment_amount) *
                                              100
                                            ).toFixed(2)} %`
                                            : "-"}
                                        </strong>
                                      </td>

                                      {/* 8. Actions */}
                                      <td>
                                        <div
                                          className={style.actionBtnsContainer}
                                        >
                                          {/* <div className="pointer">
                                          <ExploreStock />
                                        </div> */}
                                          <Link
                                            to={
                                              process.env.PUBLIC_URL +
                                              "/commondashboard/investment/new-real-estate/?id=" +
                                              v.name
                                            }
                                          >
                                            <i
                                              className={`fa-solid fa-pen-to-square ${style.trash}`}
                                            ></i>
                                          </Link>
                                          <i
                                            className={`fa fa-trash ${style.trash}`}
                                            onClick={() =>
                                              deleteUserAsset(
                                                v.name,
                                                "Are you sure you want to delete your asset?"
                                              )
                                            }
                                            aria-hidden="true"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <br />
                              <p className="text-center fw-bold mb-0">
                                Currently it seems like we don't have your Real
                                Estate Data to display
                              </p>
                              <p className="text-center fw-bold">
                                You can add your existing Real Estate
                              </p>
                              <div className="text-center">
                                <>
                                  <Link
                                    className="anchor-primary"
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/commondashboard/investment/new-real-estate"
                                    }
                                  >
                                    Add Existing Real Estate
                                  </Link>
                                  <img
                                    className="pt-4"
                                    src={
                                      process.env.REACT_APP_STATIC_URL +
                                      "/media/Group-162.png"
                                    }
                                    style={{ width: 200 }}
                                  />
                                </>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div
                        className={`insideTabContent px-2 px-md-4 ${selectedTab == 6 ? "" : "d-none"
                          }`}
                      >
                        {alternateAssetsList?.alternate_data?.length > 0 && (
                          <>
                            <div className="row pb-3">
                              <div className="col-12 col-md-10">
                                <div className="d-none d-md-block">
                                  <div className="cntResults">
                                    <div className={style.ecntRItems}>
                                      <div className={style.borderSpace}>
                                        Total Alternate Assets
                                      </div>
                                      <div
                                        className={`borderSpace borderText pointer`}
                                      >
                                        {alternateAssetsList?.no_of_assets !=
                                          undefined
                                          ? alternateAssetsList?.no_of_assets
                                          : "-"}
                                      </div>
                                    </div>
                                    <div className={style.ecntRItems}>
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Invested Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        ₹{" "}
                                        {alternateAssetsList?.alternate_data
                                          ?.reduce(
                                            (sum, item) =>
                                              sum +
                                              Number(
                                                item.user_asset_investment_amount ||
                                                0
                                              ),
                                            0
                                          )
                                          .toLocaleString("en-IN")}
                                      </div>
                                    </div>
                                    <div
                                      className={`mt-2 mt-md-0 ${style.ecntRItems}`}
                                    >
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Current Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        ₹{" "}
                                        {alternateAssetsList?.alternate_data
                                          ?.reduce(
                                            (sum, item) =>
                                              sum +
                                              Number(
                                                item.user_asset_current_amount ||
                                                0
                                              ),
                                            0
                                          )
                                          .toLocaleString("en-IN")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-2 col-12">
                                <div className={`${style.addBtn}`}>
                                  <Link
                                    className={`anchor-primary ${style.linkStyle}`}
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/commondashboard/investment/new-alternet-asset"
                                    }
                                  >
                                    <span>
                                      <i className="fa-solid fa-plus"></i>
                                    </span>{" "}
                                    <span>Add Alternate</span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="fixedHeaders">
                              <div className="table-responsive">
                                <div className="ptTableBx">
                                  <Table
                                    className={`ptTable ${style.alternateTbl} ${style["bold-table"]} mb-0 ${style.headerTable}`}
                                  >
                                    <thead>
                                      <tr>
                                        <td scope="col">
                                          Name of Asset (Category)
                                        </td>
                                        <td scope="col">Member Name</td>
                                        <td scope="col">Invested Value</td>
                                        <td scope="col">Current Value</td>
                                        <td scope="col">Returns</td>
                                        <td scope="col">Absolute Return</td>
                                        <td scope="col">&nbsp;</td>
                                      </tr>
                                    </thead>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        <div className="  ">
                          <Table
                            className={`ptTable fixedTable ${style.alternateTbl} mb-0 ${style.dataTable}`}
                          >
                            <tbody>
                              {alternateAssetsList?.alternate_data?.length ? (
                                alternateAssetsList?.alternate_data?.map(
                                  (v) => (
                                    <tr key={v.user_asset_name}>
                                      <td scope="row" data-label="asset_name">
                                        <strong></strong>
                                        <AssetName
                                          title={
                                            v.user_asset_name
                                              ? options_alternate_type.find(
                                                (opt) =>
                                                  opt.value ===
                                                  v.user_asset_name
                                              )?.label
                                              : "-"
                                          }
                                          icon={
                                            process.env
                                              .REACT_APP_STATIC_URL_PYTHON +
                                            "/assets/img/assets-liabilities/assets_alternate.svg"
                                          }
                                        />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="Member val"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {(() => {
                                            if (v.user_asset_for === "0") {
                                              return "Family";
                                            }
                                            const member = familyData.find(
                                              (m) =>
                                                m.member_id === v.user_asset_for
                                            );
                                            if (member?.label) {
                                              return member.label;
                                            }
                                            if (member?.email) {
                                              return member.email;
                                            }
                                            return "-";
                                          })()}
                                        </strong>
                                        <br />
                                      </td>
                                      <td scope="row" data-label="invested_val">
                                        <strong>
                                          {v.user_asset_investment_amount != 0.0
                                            ? indianRupeeFormat(
                                              v.user_asset_investment_amount *
                                              1
                                            )
                                            : "-"}
                                        </strong>
                                        <br />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="curr_val"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {v.user_asset_current_amount
                                            ? indianRupeeFormat(
                                              v.user_asset_current_amount * 1
                                            )
                                            : "-"}
                                        </strong>
                                      </td>
                                      <td scope="row" data-label="returns">
                                        {(() => {
                                          const avgPrice =
                                            Number(
                                              v.user_asset_avg_purchase_price
                                            ) || 0;
                                          const qty =
                                            Number(v.user_asset_quantity) || 0;

                                          const investedAmount =
                                            avgPrice > 0 && qty > 0
                                              ? avgPrice * qty
                                              : Number(
                                                v.user_asset_investment_amount
                                              ) || 0;

                                          const currentAmount =
                                            Number(
                                              v.user_asset_current_amount
                                            ) || 0;
                                          const absoluteReturns =
                                            currentAmount - investedAmount;

                                          return (
                                            <strong
                                              className={`xrr-returns ${absoluteReturns < 0
                                                ? "red"
                                                : absoluteReturns > 0
                                                  ? "green"
                                                  : ""
                                                }`}
                                            >
                                              {investedAmount > 0
                                                ? indianRupeeFormat(
                                                  absoluteReturns
                                                )
                                                : "-"}
                                            </strong>
                                          );
                                        })()}
                                      </td>

                                      <td scope="row" data-label="absolute_rtn">
                                        {(() => {
                                          const avgPrice =
                                            Number(
                                              v.user_asset_avg_purchase_price
                                            ) || 0;
                                          const qty =
                                            Number(v.user_asset_quantity) || 0;

                                          const investedAmount =
                                            avgPrice > 0 && qty > 0
                                              ? avgPrice * qty
                                              : Number(
                                                v.user_asset_investment_amount
                                              ) || 0;

                                          const currentAmount =
                                            Number(
                                              v.user_asset_current_amount
                                            ) || 0;
                                          const absoluteReturns =
                                            currentAmount - investedAmount;

                                          // Percentage returns
                                          const percentageReturns =
                                            investedAmount > 0
                                              ? (absoluteReturns /
                                                investedAmount) *
                                              100
                                              : 0;

                                          return (
                                            <strong
                                              className={`xrr-returns ${percentageReturns < 0
                                                ? "red"
                                                : percentageReturns > 0
                                                  ? "green"
                                                  : ""
                                                }`}
                                            >
                                              {investedAmount > 0
                                                ? `${percentageReturns.toFixed(
                                                  2
                                                )} %`
                                                : "-"}
                                            </strong>
                                          );
                                        })()}
                                      </td>

                                      <td>
                                        <div
                                          className={style.actionBtnsContainer}
                                        >
                                          <Link
                                            to={
                                              process.env.PUBLIC_URL +
                                              "/commondashboard/investment/new-alternet-asset/?id=" +
                                              v.name
                                            }
                                          >
                                            <i
                                              className={`fa-solid fa-pen-to-square ${style.trash}`}
                                            ></i>
                                          </Link>

                                          <i
                                            class={`fa fa-trash ${style.trash}`}
                                            onClick={() =>
                                              deleteUserAsset(
                                                v.name,
                                                "Are you sure you want to delete your asset?"
                                              )
                                            }
                                            aria-hidden="true"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )
                              ) : (
                                <>
                                  <div>
                                    <br />
                                    <p className="text-center fw-bold mb-0">
                                      Currently it seems like we don't have your
                                      Alternate Assets Data to display
                                    </p>
                                    <p className="text-center fw-bold">
                                      You can add your existing Alternate Assets
                                    </p>
                                    <div className="text-center">
                                      <Link
                                        className="anchor-primary"
                                        to={
                                          process.env.PUBLIC_URL +
                                          "/commondashboard/investment/new-alternet-asset"
                                        }
                                      >
                                        Add Alternate Assets
                                      </Link>

                                      <img
                                        className="pt-4"
                                        src={
                                          process.env.REACT_APP_STATIC_URL +
                                          "/media/Group-177.png"
                                        }
                                        style={{ width: 200 }}
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                      <div
                        className={`insideTabContent px-2 px-md-4 ${selectedTab == 7 ? "" : "d-none"
                          }`}
                      >
                        {Array.isArray(goldList) && goldList.length > 0 ? (
                          <>
                            <div className="row pb-3">
                              <div className="col-12 col-md-9">
                                <div className="d-block">
                                  <div className="cntResults">
                                    <div className={style.ecntRItems}>
                                      <div className={style.borderSpace}>
                                        Total Gold Assets
                                      </div>
                                      <div
                                        className={`borderSpace borderText pointer`}
                                      >
                                        {otherInvestmentData
                                          ?.asset_category_summary?.commodity
                                          ?.assets_count || goldList.length}
                                      </div>
                                    </div>
                                    <div className={style.ecntRItems}>
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Invested Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        {indianRupeeFormat(
                                          goldList.reduce((total, v) => {
                                            let investedAmount = 0;
                                            if (
                                              v.user_asset_avg_purchase_price >
                                              0 &&
                                              v.user_asset_quantity > 0
                                            ) {
                                              investedAmount =
                                                v.user_asset_avg_purchase_price *
                                                v.user_asset_quantity;
                                            } else {
                                              investedAmount =
                                                v.user_asset_investment_amount ||
                                                0;
                                            }
                                            return total + investedAmount;
                                          }, 0)
                                        )}
                                      </div>
                                    </div>
                                    <div
                                      className={`mt-2 mt-md-0 ${style.ecntRItems}`}
                                    >
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Current Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        {indianRupeeFormat(
                                          goldList.reduce(
                                            (total, v) =>
                                              total +
                                              (v.user_asset_current_amount *
                                                1 || 0),
                                            0
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`col-12 col-md-3 ${style.addBtnContainer}`}
                              >
                                <div className={`${style.addBtn}`}>
                                  <Link
                                    className={`anchor-primary ${style.linkStyle}`}
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/commondashboard/investment/new-gold-asset"
                                    }
                                  >
                                    <span>
                                      <i className="fa-solid fa-plus"></i>
                                    </span>{" "}
                                    <span>Add Gold Assets</span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="fixedHeaders">
                              <div className="table-responsive">
                                <div className="ptTableBx">
                                  <Table
                                    className={`ptTable ${style.goldTbl} ${style["bold-table"]} ${style.headerTable} mb-0`}
                                  >
                                    <thead>
                                      <tr>
                                        <td scope="col">
                                          Name of Asset (category)
                                        </td>
                                        <td scope="col">Member Name</td>
                                        <td scope="col">Invested Value</td>
                                        <td scope="col">Current Value</td>
                                        <td scope="col">Returns</td>
                                        <td scope="col">Absolute Return</td>
                                        <td scope="col">&nbsp;</td>
                                      </tr>
                                    </thead>
                                  </Table>
                                </div>
                              </div>
                            </div>
                            <div className="">
                              <Table
                                responsive
                                className={`ptTable fixedTable ${style.goldTbl} ${style.dataTable} mb-0`}
                              >
                                <tbody>
                                  {goldList.map((v) => (
                                    <tr key={v.user_asset_name}>
                                      <td data-label="Name of Asset (category)">
                                        <AssetName
                                          title={v.user_asset_name || "-"}
                                          icon={
                                            process.env
                                              .REACT_APP_STATIC_URL_PYTHON +
                                            "/assets/img/assets-liabilities/assets_gold.svg"
                                          }
                                        />
                                      </td>
                                      <td data-label="Member Name">
                                        <strong className="xrr-returns">
                                          {(() => {
                                            if (v.user_asset_for === "0") {
                                              return "Family";
                                            }
                                            if (v.user_name) {
                                              return v.user_name;
                                            }
                                            const member = familyData.find(
                                              (m) =>
                                                m.member_id ===
                                                v.user_asset_for ||
                                                m.value === v.user_asset_for
                                            );
                                            if (member?.label) {
                                              return member.label;
                                            }
                                            if (member?.email) {
                                              return member.email;
                                            }
                                            return "-";
                                          })()}
                                        </strong>
                                      </td>
                                      <td data-label="Invested Value">
                                        <strong>
                                          {(() => {
                                            // Use same calculation logic as returns
                                            let investedAmount = 0;

                                            if (
                                              v.user_asset_avg_purchase_price >
                                              0 &&
                                              v.user_asset_quantity > 0
                                            ) {
                                              // Most reliable: calculate from purchase price × quantity
                                              investedAmount =
                                                v.user_asset_avg_purchase_price *
                                                v.user_asset_quantity;
                                            } else {
                                              // Use user_asset_investment_amount directly
                                              investedAmount =
                                                v.user_asset_investment_amount ||
                                                0;
                                            }

                                            return investedAmount > 0
                                              ? indianRupeeFormat(
                                                investedAmount
                                              )
                                              : "-";
                                          })()}
                                        </strong>
                                      </td>
                                      <td data-label="Current Value">
                                        <strong className="xrr-returns">
                                          {v.user_asset_current_amount * 1 !== 0
                                            ? indianRupeeFormat(
                                              v.user_asset_current_amount
                                            )
                                            : "-"}
                                        </strong>
                                      </td>
                                      <td data-label="Returns">
                                        {(() => {
                                          // Calculate invested amount more reliably
                                          // Priority: calculated from price × quantity > user_asset_investment_amount
                                          let investedAmount = 0;

                                          if (
                                            v.user_asset_avg_purchase_price >
                                            0 &&
                                            v.user_asset_quantity > 0
                                          ) {
                                            // Most reliable: calculate from purchase price × quantity
                                            investedAmount =
                                              v.user_asset_avg_purchase_price *
                                              v.user_asset_quantity;
                                          } else {
                                            // Use user_asset_investment_amount directly
                                            investedAmount =
                                              v.user_asset_investment_amount ||
                                              0;
                                          }

                                          const currentAmount =
                                            v.user_asset_current_amount || 0;
                                          const absoluteReturns =
                                            currentAmount - investedAmount;

                                          return (
                                            <strong
                                              className={`xrr-returns ${absoluteReturns < 0
                                                ? "red"
                                                : absoluteReturns > 0
                                                  ? "green"
                                                  : ""
                                                }`}
                                            >
                                              {investedAmount > 0 &&
                                                absoluteReturns !== 0
                                                ? indianRupeeFormat(
                                                  absoluteReturns
                                                )
                                                : "-"}
                                            </strong>
                                          );
                                        })()}
                                      </td>
                                      <td data-label="Absolute Return">
                                        {(() => {
                                          // Calculate percentage returns with same logic
                                          let investedAmount = 0;

                                          if (
                                            v.user_asset_avg_purchase_price >
                                            0 &&
                                            v.user_asset_quantity > 0
                                          ) {
                                            investedAmount =
                                              v.user_asset_avg_purchase_price *
                                              v.user_asset_quantity;
                                          } else {
                                            investedAmount =
                                              v.user_asset_investment_amount ||
                                              0;
                                          }

                                          const currentAmount =
                                            v.user_asset_current_amount || 0;
                                          const absoluteReturns =
                                            currentAmount - investedAmount;
                                          const percentageReturns =
                                            investedAmount > 0
                                              ? (absoluteReturns /
                                                investedAmount) *
                                              100
                                              : 0;

                                          return (
                                            <strong
                                              className={`xrr-returns ${percentageReturns < 0
                                                ? "red"
                                                : percentageReturns > 0
                                                  ? "green"
                                                  : ""
                                                }`}
                                            >
                                              {investedAmount > 0 &&
                                                percentageReturns !== 0
                                                ? `${percentageReturns.toFixed(
                                                  2
                                                )}%`
                                                : "-"}
                                            </strong>
                                          );
                                        })()}
                                      </td>
                                      <td>
                                        <div
                                          className={style.actionBtnsContainer}
                                        >
                                          <Link
                                            to={
                                              process.env.PUBLIC_URL +
                                              "/commondashboard/investment/new-gold-asset/" +
                                              btoa(v.name)
                                            }
                                          >
                                            <i
                                              className={`fa-solid fa-pen-to-square ${style.trash}`}
                                            ></i>
                                          </Link>
                                          <i
                                            className={`fa fa-trash ${style.trash}`}
                                            onClick={() =>
                                              deleteGoldAsset(
                                                v.name,
                                                "Are you sure you want to delete your gold asset?"
                                              )
                                            }
                                            aria-hidden="true"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-4">
                            <p className="fw-bold mb-0">
                              Currently it seems like we don't have your Gold
                              Assets Data to display
                            </p>
                            <p className="fw-bold">
                              You can add your existing Gold Assets
                            </p>
                            <div className="text-center">
                              <Link
                                className="anchor-primary"
                                to={
                                  process.env.PUBLIC_URL +
                                  "/commondashboard/investment/new-gold-asset"
                                }
                              >
                                Add Gold Assets
                              </Link>
                              <img
                                className="pt-4"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "/media/gold-icon.png"
                                }
                                style={{ width: 200 }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div
                        className={`insideTabContent px-2 px-md-4 ${selectedTab == 8 ? "" : "d-none"
                          }`}
                      >
                        {liquidAssetsList?.length > 0 ? (
                          <>
                            <div className="row pb-3">
                              <div className="col-12 col-md-9">
                                <div className="d-block">
                                  <div className="cntResults">
                                    <div className={style.ecntRItems}>
                                      <div className={style.borderSpace}>
                                        Total Liquid Assets
                                      </div>
                                      <div
                                        className={`borderSpace borderText pointer`}
                                      >
                                        {liquidAssetsList
                                          ? liquidAssetsList?.length
                                          : "-"}
                                      </div>
                                    </div>
                                    <div className={style.ecntRItems}>
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Invested Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        {(() => {
                                          const totalInvested =
                                            liquidAssetsList?.reduce(
                                              (sum, asset) => {
                                                return (
                                                  sum +
                                                  (asset.user_asset_investment_amount ||
                                                    0)
                                                );
                                              },
                                              0
                                            );
                                          return totalInvested > 0
                                            ? indianRupeeFormat(totalInvested)
                                            : "-";
                                        })()}
                                      </div>
                                    </div>
                                    <div
                                      className={`mt-2 mt-md-0 ${style.ecntRItems}`}
                                    >
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Current Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        {(() => {
                                          const totalCurrent =
                                            liquidAssetsList?.reduce(
                                              (sum, asset) => {
                                                return (
                                                  sum +
                                                  (asset.user_asset_current_amount ||
                                                    0)
                                                );
                                              },
                                              0
                                            );
                                          return totalCurrent > 0
                                            ? indianRupeeFormat(totalCurrent)
                                            : "-";
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`col-12 col-md-3 ${style.addBtnContainer}`}
                              >
                                <div className={`${style.addBtn}`}>
                                  <Link
                                    className={`anchor-primary ${style.linkStyle}`}
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/commondashboard/investment/new-liquid-asset"
                                    }
                                  >
                                    <span>
                                      <i className="fa-solid fa-plus"></i>
                                    </span>{" "}
                                    <span>Add Liquid Assets</span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="fixedHeaders">
                              <div className="table-responsive">
                                <div className="ptTableBx">
                                  <Table
                                    className={`ptTable ${style["portfolio-insurance-table"]} ${style["bold-table"]} mb-0`}
                                  >
                                    <thead>
                                      <tr>
                                        <td scope="col">
                                          Name of Asset (Category)
                                        </td>
                                        <td scope="col">Member Name</td>
                                        <td scope="col">Invested Value</td>
                                        <td scope="col">Current Value</td>
                                        <td scope="col">&nbsp;</td>
                                      </tr>
                                    </thead>
                                  </Table>
                                </div>
                              </div>
                            </div>
                            <div className="">
                              <Table
                                responsive
                                className={`ptTable fixedTable ${style.dataTable} ${style["portfolio-insurance-table"]} mb-0`}
                              >
                                <tbody>
                                  {liquidAssetsList.map((v) => (
                                    <tr key={v.user_asset_name}>
                                      <td
                                        scope="row"
                                        data-label="Type/Name Of Property"
                                      >
                                        <AssetName
                                          title={
                                            v.user_asset_name
                                              ? v.user_asset_name
                                              : "-"
                                          }
                                          icon={
                                            process.env
                                              .REACT_APP_STATIC_URL_PYTHON +
                                            "/assets/img/assets-liabilities/assets_liquid.svg"
                                          }
                                        />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="Member val"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {(() => {
                                            if (v.user_asset_for === "0") {
                                              return "Family";
                                            }
                                            if (v.user_name) {
                                              return v.user_name;
                                            }
                                            const member = familyData.find(
                                              (m) =>
                                                m.member_id ===
                                                v.user_asset_for ||
                                                m.value === v.user_asset_for
                                            );
                                            if (member?.label) {
                                              return member.label;
                                            }
                                            if (member?.email) {
                                              return member.email;
                                            }
                                            return "-";
                                          })()}
                                        </strong>
                                        <br />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="Invested Value"
                                      >
                                        <span className={`xrr-returns`}>
                                          {v.user_asset_investment_amount &&
                                            v.user_asset_investment_amount > 0
                                            ? indianRupeeFormat(
                                              v.user_asset_investment_amount *
                                              1
                                            )
                                            : "-"}
                                        </span>
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="Current Value"
                                      >
                                        <span className={`xrr-returns`}>
                                          {v.user_asset_current_amount
                                            ? indianRupeeFormat(
                                              v.user_asset_current_amount * 1
                                            )
                                            : "-"}
                                        </span>
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "2rem",
                                          }}
                                        >
                                          <div className="pointer">
                                            {/* <ExploreStock /> */}
                                          </div>

                                          <Link
                                            to={
                                              process.env.PUBLIC_URL +
                                              "/commondashboard/investment/new-liquid-asset/?id=" +
                                              v.name
                                            }
                                          >
                                            <i
                                              className={`fa-solid fa-pen-to-square ${style.trash}`}
                                            ></i>
                                          </Link>

                                          <i
                                            class={`fa fa-trash ${style.trash}`}
                                            onClick={() =>
                                              deleteUserAsset(
                                                v.name,
                                                "Are you sure you want to delete your asset?"
                                              )
                                            }
                                            aria-hidden="true"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <br />
                              <p className="text-center fw-bold mb-0">
                                Currently it seems we don't have your Liquid
                                Assets Data to display
                              </p>
                              <p className="text-center fw-bold">
                                You can add your existing Liquid Assets
                              </p>
                              <div className="text-center">
                                <Link
                                  className="anchor-primary"
                                  to={
                                    process.env.PUBLIC_URL +
                                    "/commondashboard/investment/new-liquid-asset"
                                  }
                                >
                                  Add Liquid Assets
                                </Link>

                                <img
                                  className="pt-4"
                                  src={
                                    process.env.REACT_APP_STATIC_URL +
                                    "/media/liquid_image.svg"
                                  }
                                  alt="Liquid"
                                  style={{ width: 200 }}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div
                        className={`insideTabContent px-2 px-md-4 ${selectedTab == 10 ? "" : "d-none"
                          }`}
                      >
                        {aifEquityList?.length > 0 ? (
                          <>
                            <div className="row pb-3">
                              <div className="col-12 col-md-9">
                                <div className="d-block">
                                  <div className="stocksTabInfo">
                                    <div style={{ width: "200px" }}>
                                      <div className={style.borderSpace}>
                                        Total Unlisted/AIF Equity
                                      </div>
                                      <div
                                        className={`borderSpace borderText pointer`}
                                      >
                                        {aifEquityList
                                          ? aifEquityList?.length
                                          : "-"}
                                      </div>
                                    </div>
                                    <div>
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Invested Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        {indianRupeeFormat(
                                          aifEquityList.reduce(
                                            (sum, item) =>
                                              sum +
                                              Number(
                                                item.user_asset_investment_amount ||
                                                0
                                              ),
                                            0
                                          )
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Current Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        {indianRupeeFormat(
                                          aifEquityList.reduce(
                                            (sum, item) =>
                                              sum +
                                              Number(
                                                item.user_asset_current_amount ||
                                                0
                                              ),
                                            0
                                          )
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Today Gain/Loss
                                      </div>
                                      <div
                                        className={`borderSpace borderText`}
                                        style={
                                          aifEquityList.reduce(
                                            (sum, item) =>
                                              sum +
                                              Number(
                                                item.user_asset_current_amount ||
                                                0
                                              ),
                                            0
                                          ) -
                                            aifEquityList.reduce(
                                              (sum, item) =>
                                                sum +
                                                Number(
                                                  item.user_asset_investment_amount ||
                                                  0
                                                ),
                                              0
                                            ) <
                                            0
                                            ? { color: "red" }
                                            : { color: "green" }
                                        }
                                      >
                                        {indianRupeeFormat(
                                          aifEquityList.reduce(
                                            (sum, item) =>
                                              sum +
                                              Number(
                                                item.user_asset_current_amount ||
                                                0
                                              ),
                                            0
                                          ) -
                                          aifEquityList.reduce(
                                            (sum, item) =>
                                              sum +
                                              Number(
                                                item.user_asset_investment_amount ||
                                                0
                                              ),
                                            0
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`col-12 col-md-3 ${style.addBtnContainer} ${style.wrapBtns} `}
                              >
                                <Link
                                  className={"anchor-primary"}
                                  to={
                                    process.env.PUBLIC_URL +
                                    "/commondashboard/investment/new-unlisted-aif-equity-asset"
                                  }
                                >
                                  + Add
                                </Link>
                              </div>
                            </div>
                            <div className="fixedHeaders">
                              <div className="table-responsive">
                                <div className="ptTableBx">
                                  <Table
                                    className={`ptTable ${style.stockTbl} ${style["bold-table"]} mb-0 ${style.headerTable}`}
                                  >
                                    <thead>
                                      <tr>
                                        <td scope="col">Equity Name</td>
                                        <td scope="col">Member Name</td>
                                        <td scope="col">Invested Value</td>
                                        <td scope="col">Current Value</td>
                                        <td scope="col">No. Of Shares</td>
                                        <td scope="col">Total Returns(%)</td>
                                        <td scope="col">&nbsp;</td>
                                      </tr>
                                    </thead>
                                  </Table>
                                </div>
                              </div>
                            </div>
                            <div className="">
                              <Table
                                responsive
                                className={`mb-0 ptTable fixedTable ${style.stockTbl} ${style.dataTable}`}
                              >
                                <tbody>
                                  {aifEquityList?.map((v) => (
                                    <tr key={v.id}>
                                      <td scope="row" data-label="title">
                                        <AssetName title={v.user_asset_name} />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="Member val"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {(() => {
                                            if (v.user_asset_for === "0") {
                                              return "Family";
                                            }
                                            const member = familyData.find(
                                              (m) =>
                                                m.member_id === v.user_asset_for
                                            );
                                            if (member?.label) {
                                              return member.label;
                                            }
                                            if (member?.email) {
                                              return member.email;
                                            }
                                            return "-";
                                          })()}
                                        </strong>
                                        <br />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="invested val"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {v?.user_asset_investment_amount
                                            ? v.user_asset_investment_amount *
                                              1 !=
                                              0 &&
                                              v.user_asset_investment_amount !=
                                              undefined
                                              ? indianRupeeFormat(
                                                v.user_asset_investment_amount *
                                                1
                                              )
                                              : "—"
                                            : "—"}
                                        </strong>
                                        <br />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="current val"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {v?.user_asset_current_amount
                                            ? v.user_asset_current_amount * 1 !=
                                              0 &&
                                              v.user_asset_current_amount !=
                                              undefined
                                              ? indianRupeeFormat(
                                                v.user_asset_current_amount *
                                                1
                                              )
                                              : "—"
                                            : "—"}
                                        </strong>
                                        <br />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="current val"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {v?.user_asset_quantity
                                            ? v.user_asset_quantity != 0
                                              ? Math.round(
                                                (v.user_asset_quantity *
                                                  100) /
                                                100
                                              )
                                              : "-"
                                            : "-"}
                                        </strong>
                                        <br />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="current val"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {v?.user_asset_current_amount
                                            ? v.user_asset_current_amount * 1 !=
                                              0 &&
                                              v.user_asset_current_amount !=
                                              undefined
                                              ? indianRupeeFormat(
                                                v.user_asset_current_amount *
                                                1
                                              )
                                              : "—"
                                            : "—"}
                                        </strong>
                                      </td>

                                      <td>
                                        <div
                                          className={`${style.actionBtnsContainer}`}
                                        >
                                          <Link
                                            to={
                                              process.env.PUBLIC_URL +
                                              "/commondashboard/investment/new-unlisted-aif-equity-asset/?id=" +
                                              v.name
                                            }
                                          >
                                            <i
                                              className={`fa-solid fa-pen-to-square ${style.trash}`}
                                            ></i>
                                          </Link>

                                          <i
                                            class={`fa fa-trash ${style.trash}`}
                                            onClick={() =>
                                              deleteUserAsset(
                                                v.name,
                                                "Are you sure you want to delete?"
                                              )
                                            }
                                            aria-hidden="true"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="table-responsive">
                              <br />
                              <p className="text-center fw-bold mb-0">
                                Currently it seems like we don't have your
                                Unlisted/AIF Equity data to display
                              </p>
                              <p className="text-center fw-bold mt-3">
                                You can add your existing Unlisted/AIF Equity
                              </p>
                              <div className="text-center mt-4">
                                <Link
                                  className="anchor-primary"
                                  to={
                                    process.env.PUBLIC_URL +
                                    "/commondashboard/investment/new-unlisted-aif-equity-asset"
                                  }
                                >
                                  Add Unlisted/AIF Equity
                                </Link>
                              </div>
                              <div className="text-center">
                                <img
                                  src={
                                    process.env.REACT_APP_STATIC_URL +
                                    "media/DMF/investment.svg"
                                  }
                                  className="pt-4"
                                  alt={"Start Investing"}
                                  style={{ width: 400 }}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div
                        className={`insideTabContent px-2 px-md-4 ${selectedTab == 11 ? "" : "d-none"
                          }`}
                      >
                        <>
                          {Array.isArray(usEquityList) &&
                            usEquityList?.length > 0 ? (
                            <>
                              <div className="row pb-3">
                                <div className="col-12 col-md-9">
                                  <div className="d-block">
                                    <div className="stocksTabInfo">
                                      <div>
                                        <div className={style.borderSpace}>
                                          Total US Equity
                                        </div>
                                        <div className="borderSpace borderText pointer">
                                          {usEquityList?.length}
                                        </div>
                                      </div>
                                      <div>
                                        <div
                                          className={`${style.extraSpace} ${style.borderSpace}`}
                                        >
                                          Invested Value
                                        </div>
                                        <div className="borderSpace borderText">
                                          {indianRupeeFormat(
                                            usEquityList.reduce(
                                              (acc, curr) =>
                                                acc +
                                                toINR(
                                                  curr.user_asset_investment_amount ||
                                                  0,
                                                  curr.user_asset_currency
                                                ),
                                              0
                                            )
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        <div
                                          className={`${style.extraSpace} ${style.borderSpace}`}
                                        >
                                          Current Value
                                        </div>
                                        <div className="borderSpace borderText">
                                          {indianRupeeFormat(
                                            usEquityList.reduce(
                                              (acc, curr) =>
                                                acc +
                                                toINR(
                                                  curr.user_asset_current_amount ||
                                                  0,
                                                  curr.user_asset_currency
                                                ),
                                              0
                                            )
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        <div
                                          className={`${style.extraSpace} ${style.borderSpace}`}
                                        >
                                          Today Gain/Loss
                                        </div>
                                        <div
                                          className="borderSpace borderText"
                                          style={{
                                            color:
                                              usEquityList.reduce(
                                                (acc, curr) =>
                                                  acc +
                                                  toINR(
                                                    (curr.user_asset_current_amount ||
                                                      0) -
                                                    (curr.user_asset_investment_amount ||
                                                      0),
                                                    curr.user_asset_currency
                                                  ),
                                                0
                                              ) < 0
                                                ? "red"
                                                : "green",
                                          }}
                                        >
                                          {indianRupeeFormat(
                                            usEquityList.reduce(
                                              (acc, curr) =>
                                                acc +
                                                toINR(
                                                  (curr.user_asset_current_amount ||
                                                    0) -
                                                  (curr.user_asset_investment_amount ||
                                                    0),
                                                  curr.user_asset_currency
                                                ),
                                              0
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className={`col-12 col-md-3 ${style.addBtnContainer} ${style.wrapBtns}`}
                                >
                                  <Link
                                    className="anchor-primary"
                                    to={`${process.env.PUBLIC_URL}/commondashboard/investment/new-us-equity-asset`}
                                  >
                                    + Add
                                  </Link>
                                </div>
                              </div>

                              <div className="fixedHeaders">
                                <div className="table-responsive">
                                  <div className="ptTableBx">
                                    <Table
                                      className={`ptTable ${style.stockTbl} ${style["bold-table"]} mb-0 ${style.headerTable}`}
                                    >
                                      <thead>
                                        <tr>
                                          <td scope="col">Stock/ETF Name</td>
                                          <td scope="col">Member Name</td>
                                          <td scope="col">Invested Value</td>
                                          <td scope="col">Current Value</td>
                                          <td scope="col">No. Of Shares</td>
                                          <td scope="col">Total Returns(%)</td>
                                          <td scope="col">&nbsp;</td>
                                        </tr>
                                      </thead>
                                    </Table>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Table
                                  responsive
                                  className={`mb-0 ptTable fixedTable ${style.stockTbl} ${style.dataTable}`}
                                >
                                  <tbody>
                                    {usEquityList.map((v, index) => (
                                      <tr key={v.user_asset_name}>
                                        <td scope="row" data-label="title">
                                          <AssetName
                                            title={v.user_asset_name || "-"}
                                          />
                                        </td>
                                        <td scope="row" data-label="Member val">
                                          <strong className="xrr-returns">
                                            {(() => {
                                              if (
                                                v.asset_member_id === 0 ||
                                                v.user_asset_for === "0"
                                              ) {
                                                return "Family";
                                              }
                                              const member = familyData.find(
                                                (m) =>
                                                  m.member_id ===
                                                  v.user_asset_for
                                              );
                                              if (member?.label) {
                                                return member.label;
                                              }
                                              if (member?.email) {
                                                return member.email;
                                              }
                                              return "-";
                                            })()}
                                          </strong>
                                        </td>
                                        <td
                                          scope="row"
                                          data-label="Invested val"
                                        >
                                          <strong className="xrr-returns">
                                            {v.user_asset_investment_amount
                                              ? indianRupeeFormat(
                                                toINR(
                                                  v.user_asset_investment_amount,
                                                  v.user_asset_currency
                                                )
                                              )
                                              : "—"}
                                          </strong>
                                        </td>
                                        <td
                                          scope="row"
                                          data-label="Current val"
                                        >
                                          <strong className="xrr-returns">
                                            {v.user_asset_current_amount
                                              ? indianRupeeFormat(
                                                toINR(
                                                  v.user_asset_current_amount,
                                                  v.user_asset_currency
                                                )
                                              )
                                              : "—"}
                                          </strong>
                                        </td>
                                        <td
                                          scope="row"
                                          data-label="No. of Shares"
                                        >
                                          <strong className="xrr-returns">
                                            {v.user_asset_quantity
                                              ? Math.round(
                                                v.user_asset_quantity
                                              )
                                              : "-"}
                                          </strong>
                                        </td>
                                        <td
                                          scope="row"
                                          data-label="Total Returns(%)"
                                        >
                                          <strong className="xrr-returns">
                                            {v.user_asset_investment_amount !==
                                              0
                                              ? `${(
                                                ((v.user_asset_current_amount -
                                                  v.user_asset_investment_amount) /
                                                  v.user_asset_investment_amount) *
                                                100
                                              ).toFixed(2)} %`
                                              : "-"}
                                          </strong>
                                        </td>
                                        <td>
                                          <div
                                            className={
                                              style.actionBtnsContainer
                                            }
                                          >
                                            <Link
                                              to={`${process.env.PUBLIC_URL}/commondashboard/investment/new-us-equity-asset/?id=${v.name}`}
                                            >
                                              <i
                                                className={`fa-solid fa-pen-to-square ${style.trash}`}
                                              ></i>
                                            </Link>
                                            <i
                                              className={`fa fa-trash ${style.trash}`}
                                              onClick={() =>
                                                deleteUserAsset(
                                                  v.name,
                                                  "Are you sure you want to delete?"
                                                )
                                              }
                                              aria-hidden="true"
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="table-responsive">
                                <br />
                                <p className="text-center fw-bold mb-0">
                                  Currently it seems like we don't have your US
                                  Equity data to display
                                </p>
                                <p className="text-center fw-bold mt-3">
                                  You can add your existing US Equity
                                </p>
                                <div className="text-center mt-4">
                                  <Link
                                    className="anchor-primary"
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/commondashboard/investment/new-us-equity-asset"
                                    }
                                  >
                                    Add US Equity
                                  </Link>
                                </div>
                                <div className="text-center">
                                  <img
                                    src={
                                      process.env.REACT_APP_STATIC_URL +
                                      "media/DMF/investment.svg"
                                    }
                                    className="pt-4"
                                    alt={"Start Investing"}
                                    style={{ width: 400 }}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      </div>
                      <div
                        className={`insideTabContent px-2 px-md-4 ${selectedTab == 12 ? "" : "d-none"
                          }`}
                      >
                        {/* Filter button - always visible */}
                        <div className="row pb-3">
                          <div className="col-12">
                            <div className="d-flex justify-content-end">
                              <div
                                className={`${style.addBtn}`}
                                style={{ marginTop: "0px" }}
                              >
                                <div>
                                  <div
                                    style={{ marginBottom: "0.5rem" }}
                                    className="resultOptionsBtn position-relative hover-dropdown pointer"
                                    onClick={() =>
                                      setIsStocksFilterPanelActive(
                                        (prev) => !prev
                                      )
                                    }
                                  >
                                    <HiSortAscending fontSize={"1.2rem"} />
                                    <span>Sort & Filter</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {stockListData.length > 0 && (
                          <>
                            <div className="row pb-3">
                              <div className="col-12 col-md-9">
                                <div className="d-block">
                                  <div className="stocksTabInfo">
                                    <div>
                                      <div className={style.borderSpace}>
                                        Total Stocks
                                      </div>
                                      <div
                                        className={`borderSpace borderText pointer`}
                                      >
                                        {stockListSummary ? stockListSummary.no_of_assets : "-"}
                                      </div>
                                    </div>

                                    <div>
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        Current Value
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        {indianRupeeFormat(
                                          stockListSummary?.total_current_rate
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <div
                                        className={`${style.extraSpace} ${style.borderSpace}`}
                                      >
                                        1 Day Change
                                      </div>
                                      <div className={`borderSpace borderText`}>
                                        {stockListSummary?.overall_oneday_perc !==
                                          undefined &&
                                          stockListSummary?.overall_oneday_perc !==
                                          null && (
                                            <p
                                              className={`valueBoxPercentage ${stockListSummary?.overall_oneday_perc < 0
                                                ? "red"
                                                : "green"
                                                }`}
                                            >
                                              {stockListSummary?.overall_oneday_val > 0
                                                ? indianRupeeFormat(
                                                  stockListSummary?.overall_oneday_val *
                                                  1
                                                )
                                                : indianRupeeFormat(
                                                  Math.abs(
                                                    stockListSummary?.overall_oneday_val *
                                                    1
                                                  )
                                                )}
                                              &nbsp;
                                              <span>
                                                {stockListSummary?.overall_oneday_perc > 0
                                                  ? ` (${stockListSummary?.overall_oneday_perc}%)`
                                                  : ` (${Math.abs(
                                                    stockListSummary?.overall_oneday_perc
                                                  )}%)`}
                                              </span>
                                              <FaLongArrowAltUp />
                                            </p>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`col-12 col-md-3 ${style.addBtnContainer} ${style.wrapBtns} `}
                              >
                                <span className="text-center">
                                  <div>
                                    <div
                                      className={`${style.addBtn}`}
                                      style={{ paddingBottom: "0px" }}
                                    >
                                      <div
                                        className="resultOptionsBtn pointer"
                                        style={{ padding: "10px 10px" }}
                                        onClick={openStockImportModal}
                                      >
                                        <span>
                                          {stockHoldingData?.holding_modified_date
                                            ? "Refresh"
                                            : "Fetch Holdings"}
                                        </span>
                                      </div>
                                    </div>
                                    <p className="small-para mb-0 pt-2">
                                      {Boolean(
                                        stockHoldingData?.holding_modified_date
                                      ) &&
                                        "Last Updated on " +
                                          moment(
                                            stockHoldingData.holding_modified_date
                                          ).format("DD-MM-YYYY")}
                                    </p>
                                  </div>
                                </span>
                              </div>
                            </div>
                            <div className="fixedHeaders">
                              <div className="table-responsive">
                                <div className="ptTableBx">
                                  <Table
                                    className={`ptTable ${style.stockTbl} ${style["bold-table"]} mb-0 ${style.headerTable}`}
                                  >
                                    <thead>
                                      <tr>
                                        <td scope="col">Stock Name</td>
                                        <td scope="col">No. of Shares</td>
                                        <td scope="col">Current Value</td>
                                        <td scope="col">&nbsp;</td>
                                      </tr>
                                    </thead>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        <div className="">
                          <Table
                            responsive
                            className={`mb-0 ptTable fixedTable ${style.stockTbl} ${style.dataTable}`}
                          >
                            <tbody>
                              {stockListData?.length > 0 ? (
                                stockListData?.map((v) => (
                                  <tr key={v.user_asset_name}>
                                    <td scope="row" data-label="title">
                                      <AssetName
                                        imageUrls={getStockLogoUrls(v)}
                                        fallbackLabel={v.user_asset_name}
                                        iconElement={
                                          <FaChartLine
                                            className={style.assetInlineIcon}
                                          />
                                        }
                                        title={
                                          <>
                                            <p className="mb-0">
                                              <strong>
                                                {v.user_asset_name
                                                  ? v.user_asset_name
                                                  : "-"}
                                              </strong>
                                            </p>
                                            <p className="mb-0 d-flex">
                                                {v.stock_sector != undefined &&
                                                  v.stock_industry != undefined
                                                  ? v.stock_sector +
                                                  " - " +
                                                  v.stock_industry +
                                                  " " +
                                                  " | "
                                                  : " — | "}
                                                <>
                                                  {v.prev_day_val !==
                                                    undefined &&
                                                    v.prev_day_val !== 0 &&
                                                    v.prev_day_val !== "" ? (
                                                    <>
                                                      <span className="ps-2 pe-2 fw-bold">
                                                        {indianRupeeFormat(
                                                          v.prev_day_val * 1
                                                        )}
                                                      </span>{" "}
                                                      |
                                                    </>
                                                  ) : (
                                                    "— |"
                                                  )}
                                                </>
                                                &nbsp;
                                                <span
                                                  className={`valueBoxPercentage ${v.day_change_perc * 1 < 0
                                                      ? "red"
                                                      : "green"
                                                    }`}
                                                >
                                                  <span>
                                                    {v.day_change_perc &&
                                                      v.day_change_perc > 0
                                                      ? v.day_change_perc
                                                      : Math.abs(
                                                        v.day_change_perc
                                                      )}
                                                    %
                                                  </span>
                                                  <FaLongArrowAltUp />
                                                </span>
                                              </p>
                                          </>
                                        }
                                      />
                                    </td>
                                    <td
                                      scope="row"
                                      data-label="current val"
                                      className=""
                                    >
                                      <strong className={`xrr-returns`}>
                                        {v?.user_asset_quantity
                                          ? v.user_asset_quantity != 0
                                            ? Math.round(
                                              (v.user_asset_quantity * 100) /
                                              100
                                            )
                                            : "-"
                                          : "-"}
                                      </strong>
                                    </td>
                                    <td
                                      scope="row"
                                      data-label="current val"
                                      className=""
                                    >
                                      <strong className={`xrr-returns`}>
                                        {v?.user_asset_current_value
                                          ? v.user_asset_current_value * 1 != 0 &&
                                            v.user_asset_current_value != undefined
                                            ? indianRupeeFormat(
                                              v.user_asset_current_value * 1
                                            )
                                            : "—"
                                          : "—"}
                                      </strong>
                                    </td>
                                    <td>
                                      {getItemLocal("family") ? (
                                        <i
                                          class={`disabled fa fa-trash ${style.trash}`}
                                          aria-hidden="true"
                                        />
                                      ) : (
                                        <i
                                          class={`fa fa-trash ${style.trash}`}
                                          onClick={() =>
                                            deleteUserAsset(
                                              v.name,
                                              "Are you sure you want to delete?"
                                            )
                                          }
                                          aria-hidden="true"
                                        />
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <>
                                  {
                                    <div>
                                      {resetStocksFilterTriggerState.showResetTriggerUi ? (
                                        <span>
                                          <h1 className="startInvesting-header">
                                            No funds found!
                                          </h1>
                                          <button
                                            className="startInvesting pointer mt-4 Reset"
                                            type="button"
                                            onClick={() =>
                                              setResetStocksFilterTriggerState(
                                                () => ({
                                                  triggerReset: true,
                                                  showResetTriggerUi: false,
                                                })
                                              )
                                            }
                                          >
                                            <strong>Reset all filters </strong>
                                          </button>
                                        </span>
                                      ) : (
                                        <div>
                                          <br />
                                          <p className="text-center fw-bold mb-0">
                                            Currently it seems you don't have
                                            any Holdings to display your Stocks
                                            {/* Portfolio - {equityList} */}
                                          </p>
                                          <br />
                                        </div>
                                      )}
                                      <div className="text-center">
                                        <img
                                          src={getPublicMediaURL(
                                            "static/media/DMF/investment.png"
                                          )}
                                          className="pt-4"
                                          alt={"Start Investing"}
                                          style={{ width: 400 }}
                                        />
                                      </div>
                                    </div>
                                  }
                                </>
                              )}
                            </tbody>
                          </Table>
                        </div>
                        <div className="">
                          <Table
                            responsive
                            className={`mb-0 ptTable fixedTable ${style.stockTbl} ${style.dataTable}`}
                          >
                            <tbody>
                              {Array.isArray(
                                otherInvestmentData?.aif_equity_data
                                  ?.other_details
                              ) &&
                                otherInvestmentData?.aif_equity_data
                                  ?.other_details.length > 0
                                ? otherInvestmentData?.aif_equity_data?.other_details.map(
                                  (v) => (
                                    <tr key={v.id}>
                                      <td scope="row" data-label="title">
                                        <AssetName title={v.asset_name} />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="invested val"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {v?.inv_val
                                            ? v.inv_val * 1 != 0 &&
                                              v.inv_val != undefined
                                              ? indianRupeeFormat(
                                                v.inv_val * 1
                                              )
                                              : "—"
                                            : "—"}
                                        </strong>
                                        <br />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="current val"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {v?.cr_val
                                            ? v.cr_val * 1 != 0 &&
                                              v.cr_val != undefined
                                              ? indianRupeeFormat(
                                                v.cr_val * 1
                                              )
                                              : "—"
                                            : "—"}
                                        </strong>
                                        <br />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="current val"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {v?.asset_units
                                            ? v.asset_units != 0
                                              ? Math.round(
                                                (v.asset_units * 100) / 100
                                              )
                                              : "-"
                                            : "-"}
                                        </strong>
                                        <br />
                                      </td>
                                      <td
                                        scope="row"
                                        data-label="current val"
                                        className=""
                                      >
                                        <strong className={`xrr-returns`}>
                                          {v?.cr_val
                                            ? v.cr_val * 1 != 0 &&
                                              v.cr_val != undefined
                                              ? indianRupeeFormat(
                                                v.cr_val * 1
                                              )
                                              : "—"
                                            : "—"}
                                        </strong>
                                      </td>
                                      <td>
                                        <div
                                          className={`${style.actionBtnsContainer}`}
                                        >
                                          {getItemLocal("family") ? (
                                            <i
                                              className={`disabled fa-solid fa-pen-to-square ${style.trash}`}
                                            ></i>
                                          ) : (
                                            <Link
                                              to={
                                                process.env.PUBLIC_URL +
                                                "/commondashboard/investment/new-unlisted-aif-equity-asset/?id=" +
                                                v.id
                                              }
                                            >
                                              <i
                                                className={`fa-solid fa-pen-to-square ${style.trash}`}
                                              ></i>
                                            </Link>
                                          )}
                                          {getItemLocal("family") ? (
                                            <i
                                              class={`disabled fa fa-trash ${style.trash}`}
                                              aria-hidden="true"
                                            />
                                          ) : (
                                            <i
                                              class={`fa fa-trash ${style.trash}`}
                                              onClick={() =>
                                                deleteAsset(
                                                  v.id,
                                                  "unlistedAIF",
                                                  v.fp_log_id != null &&
                                                    v.fp_log_id
                                                    ? v.fp_log_id
                                                    : "",
                                                  "Are you sure you want to delete?"
                                                )
                                              }
                                              aria-hidden="true"
                                            />
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )
                                : ""}
                            </tbody>
                          </Table>
                          {stockListSummary && stockListSummary?.stock_details?.length > 5 && (
                            <div className="d-flex justify-content-end">
                              <button
                                className="resultOptionsBtn"
                                onClick={toggleViewAll}
                                style={{
                                  textDecoration: "none",
                                  outline: "none",
                                  border: "0",
                                }}
                              >
                                {viewAll ? "View Less" : "View All"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
      )}
      <MfFilterSidePanel
        isOpen={isFilterPanelActive}
        togglePanel={setIsFilterPanelActive}
        mainData={mainData}
        setMainData={setMainData}
        mfListDataCopy={mfListDataCopy}
        fetchFundsData={fetchFundsData}
        resetFilterTriggerState={resetFilterTriggerState}
        setResetFilterTriggerState={setResetFilterTriggerState}
      />
      <StocksFilterSidePanel
        isOpen={isStocksFilterPanelActive}
        togglePanel={setIsStocksFilterPanelActive}
        mainData={otherInvestmentData}
        setMainData={setOtherInvestmentData}
        stockListDataCopy={stocksListCopy}
        fetchFundsData={fetchFundsData}
        resetFilterTriggerState={resetStocksFilterTriggerState}
        setResetFilterTriggerState={setResetStocksFilterTriggerState}
      />
      <SelectMemberModal
        isOpen={isOpenPopup}
        onClose={() => {
          setIsOpenPopup(false);
        }}
      />

      <Nsdlcsdl
        hideParIntro={false}
        ref={stockNsdlRef}
        hideDematTab={false}
        fromStockCard={true}
        onLinkedSuccess={() => {
          checkStockHoldingStatus();
          fetchAssetData();
          getDashboardData();
        }}
      />

      <PortfolioBalance
        open={isOpen}
        setIsOpen={setisOpen}
        modalData={modalData}
        isDashboard={false}
        isFetch={isFetched}
      />
    </PortfolioLayout>
  );
};

const BulletPoint = ({ heading, text }) => {
  return (
    <div className="d-flex py-3">
      <img
        className={style["bullet-item-img"]}
        src={getPublicMediaURL("/static/media/icons/check_01.svg")}
      />
      <div className={`ps-2`}>
        <div className={style["bullet-item-heading"]}>{heading}</div>
        <div>{text}</div>
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, label, disabled = false }) => {
  return (
    <button
      className={style["bullet-item-ActionButton"]}
      disabled={disabled ? "disabled" : ""}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default PortfolioDashboard;
