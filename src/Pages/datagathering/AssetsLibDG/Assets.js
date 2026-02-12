import React, { useState, useRef } from "react";
import { useEffect } from "react";
import moment from "moment";
import DatagatherLayout from "../../../components/Layout/Datagather";
import "rc-slider/assets/index.css";
import { useLocation } from "react-router-dom";
import DGstyles from "../DG.module.css";
import { Modal } from "react-bootstrap";
import {
  DATA_BELONGS_TO,
  imagePath,
} from "../../../constants";
import {
  apiCall,
  getItemLocal,
  getParentUserId,
  getSchemeDataStorage,
  getUserId,
  loginRedirectGuest,
  setBackgroundDivImage,
} from "../../../common_utilities";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import Others from "../AssetsLibDG/Others";
import Realestate from "../AssetsLibDG/Realestate";
import Liquid from "../AssetsLibDG/Liquid";
import Alternate from "../AssetsLibDG/Alternate";
import AssetGold from "../AssetsLibDG/AssetGold";
import AssetDebt from "../AssetsLibDG/AssetDebt";
import AssetEquity from "../AssetsLibDG/AssetEquity";
import SimpleReactValidator from "simple-react-validator";
import AssetOthers from "../AssetsLibDG/AssetOthers";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Liabilities from "../AssetsLibDG/Liabilities";
import AssetFilter from "./AssetFilter";
import AssetList from "./AssetList";

const Assets = () => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState("tab1");
  const [selectedOption, setSelectedOption] = useState("Alternate");
  const [selectedSubOption, setSelectedSubOption] = useState("Art Investment");
  const [showview, setShowView] = useState(true);
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState("");
  const [, setForceUpdate] = useState(0);
  const assetsUpdated = useSelector((state) => state.assetsUpdated);
  const [session, setSession] = useState("");

  useEffect(() => {
  
    document.body.classList.add("dg-layout");
  
   
    const bgAssets = document.getElementById("bg-assets");
    if (bgAssets) {
      bgAssets.style.background = `url(${imagePath}/static/assets/img/bg/assets.svg) no-repeat right top`;
    }
  
    setBackgroundDivImage();
  
    // cleanup
    return () => {
      document.body.classList.remove("dg-layout");
    };
  }, []);
  

  useEffect(() => {
    if (assetsUpdated) {
      getAssetData(session["data"]["fp_log_id"]);
    }
  }, [assetsUpdated]);
  useEffect(() => {
    setTimeout(() => {
      setCurrentUrl(location.pathname);
    }, 100);
  }, [location]);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!getParentUserId()) {
      loginRedirectGuest();
    }
  }, []);

  const options = [
    {
      title: "Alternate",
      id: 41,
      img:
        imagePath +
        "/static/assets/img/assets-liabilities/assets_alternate.svg",
      options: [
        {
          title: "Art Investment",
          id: 64,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/alternate/assets_alternate_art_investment.svg",
        },
        {
          title: "Commodity",
          id: 36,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/equity/assets_equity_commodity.svg",
        },
        {
          title: "Cryptocurrency",
          id: 119,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_others.svg",
        },
        {
          title: "Currency",
          id: 37,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/equity/assets_equity_currency.svg",
        },
        {
          title: "Vintage/ Luxury Cars",
          id: 66,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/alternate/assets_alternate_vintage_car.svg",
        },
        {
          title: "Others",
          id: 67,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_others.svg",
        },
      ],
    },
    {
      title: "Debt",
      id: 38,
      img:
        imagePath +
        "/static/assets/img/assets-liabilities/assets_debt.svg",
      options: [
        {
          title: "Debentures",
          id: 80,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_debenture.svg",
        },
        {
          title: "Debt Mutual Funds",
          id: 77,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_mutual_fund.svg",
        },
        {
          title: "EPF",
          id: 117,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_PPF_EPF.svg",
        },
        {
          title: "Fixed Deposit",
          id: 75,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_fixed_deposit.svg",
        },
        {
          title: "Gratuity",
          id: 82,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_Gratuity.svg",
        },
        {
          title: "Govt Bonds",
          id: 79,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_govt_bond.svg",
        },
        {
          title: "Govt. Schemes",
          id: 76,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_govt_schemes.svg",
        },
        {
          title: "NPS",
          id: 118,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_PPF_EPF.svg",
        },
        {
          title: "NSC/ KVP",
          id: 84,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_NSC_KVP.svg",
        },
        {
          title: "Pension Schemes",
          id: 85,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_pension_scheme.svg",
        },
        {
          title: "Post Office Scheme",
          id: 78,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_post_office_scheme.svg",
        },
        {
          title: "PPF/ GPF/ VPF",
          id: 81,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_PPF_EPF.svg",
        },
        {
          title: "Sukanya Samriddhi Yojana",
          id: 86,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_capital_gain_bonds.svg",
        },
        {
          title: "Recurring Deposit",
          id: 120,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/recurring_deposit.svg",
        },
        {
          title: "Others",
          id: 87,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_others.svg",
        },
      ],
    },
    {
      title: "Equity",
      id: 29,
      img:
        imagePath +
        "/static/assets/img/assets-liabilities/assets_equity.svg",
      options: [
        {
          title: "ESOP's",
          id: 34,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/equity/assets_equity_ESOPs.svg",
        },
        {
          title: "Equity Mutual Funds",
          id: 31,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/equity/assets_equity_mutual_unds.svg",
        },
        {
          title: "Equity Shares",
          id: 30,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/equity/assets_equity_shares.svg",
          options: [
            {
              title: "CDSL",
              img:
                imagePath +
                "/static/assets/img/assets-liabilities/alternate/assets_alternate_wine_investment.svg",
            },
            {
              title: "NSDL",
              img:
                imagePath +
                "/static/assets/img/assets-liabilities/alternate/assets_alternate_wine_investment.svg",
            },
          ],
        },
        {
          title: "Future & Options",
          id: 35,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/equity/assets_equity_future_and_options.svg",
        },
        {
          title: "PMS",
          id: 32,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/equity/assets_equity_PMS.svg",
        },
        {
          title: "Unlisted / AIF Equity",
          id: 33,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/equity/assets_equity_unlisted_equity.svg",
        },
        {
          title: "Others",
          id: 74,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_others.svg",
        },
      ],
    },
    {
      title: "Gold",
      id: 42,
      img:
        imagePath +
        "/static/assets/img/assets-liabilities/assets_gold.svg",
      options: [
        {
          title: "Gold ETF",
          id: 70,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/gold/assets_gold_ETF.svg",
        },
        {
          title: "Gold Mutual Fund",
          id: 71,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/gold/assets_gold_mutual_fund.svg",
        },
        {
          title: "Physical Gold",
          id: 69,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/gold/assets_gold_physical.svg",
        },
        {
          title: "Sovereign Gold Bonds",
          id: 72,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/gold/assets_gold_soverign_bond.svg",
        },
        {
          title: "Others",
          id: 73,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_others.svg",
        },
      ],
    },
    {
      title: "Liquid",
      id: 40,
      img:
        imagePath +
        "/static/assets/img/assets-liabilities/assets_liquid.svg",
      options: [
        {
          title: "Bank Balance",
          id: 61,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/liquid/assets_liquid_bank_balance.svg",
        },
        // {
        //   title: "Cash Balance",
        //   id: 60,
        //   img:
        //     imagePath +
        //     "/static/assets/img/assets-liabilities/liquid/assets_liquid_cash_balance.svg",
        // },
        {
          title: "Liquid Funds",
          id: 62,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/liquid/assets_liquid_funds.svg",
        },
        {
          title: "Others",
          id: 63,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_others.svg",
        },
      ],
    },
    {
      title: "Real Estate",
      id: 39,
      img:
        imagePath +
        "/static/assets/img/assets-liabilities/assets_real_estate.svg",
      options: [
        {
          title: "Agricultural Land",
          id: 53,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/real-estate/assets_real_estate_agricultural_land.svg",
        },
        {
          title: "Commercial",
          id: 52,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/real-estate/assets_real_estate_commercial.svg",
        },
        {
          title: "Land",
          id: 56,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/real-estate/assets_real_estate_land.svg",
        },
        {
          title: "Residential Premises",
          id: 51,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/real-estate/assets_real_estate_residenial_premises.svg",
        },
        {
          title: "Under Construction Property",
          id: 55,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/real-estate/assets_real_estate_under_construction.svg",
        },
        {
          title: "Others",
          id: 59,
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/debt/assets_debt_others.svg",
        },
      ],
    },
    {
      title: "Upload",
      img:
        imagePath +
        "/static/assets/img/assets-liabilities/debt/assets_debt_others.svg",
      options: [
        {
          title: "CDSL",
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/alternate/assets_alternate_wine_investment.svg",
        },
        {
          title: "NSDL",
          img:
            imagePath +
            "/static/assets/img/assets-liabilities/alternate/assets_alternate_wine_investment.svg",
        },
      ],
    },
    {
      title: "Others",
      id: 115,
      img:
        imagePath +
        "/static/assets/img/assets-liabilities/debt/assets_debt_others.svg",
      options: [
        // {
        //   title: "Others",
        //   img: "/static/assets/img/assets-liabilities/debt/assets_debt_others.svg",
        // }
      ],
    },
  ];

  const upload_options = [
    {
      title: "CDSL",
      img:
        imagePath +
        "/static/assets/img/assets-liabilities/alternate/assets_alternate_wine_investment.svg",
    },
    {
      title: "NSDL",
      img:
        imagePath +
        "/static/assets/img/assets-liabilities/alternate/assets_alternate_wine_investment.svg",
    },
  ];

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    document.body.classList.add("dg-layout");
    return () => {
      document.body.classList.remove("rp-layout");
    };
  }, []);

  // const customStyles = {
  //   option: (base, { data, isDisabled, isFocused, isSelected }) => {
  //     return {
  //       ...base,
  //       backgroundColor: isFocused ? "#ffff" : "#042b62",
  //       color: isFocused ? "#042b62" : "#fff",
  //       cursor: "pointer",
  //     };
  //   },
  //   menuList: (base) => ({
  //     ...base,
  //     height: "100px",
  //     overflowY: "scroll",
  //     scrollBehavior: "smooth",
  //     "::-webkit-scrollbar": {
  //       width: "4px",
  //       height: "0px",
  //     },
  //     "::-webkit-scrollbar-track": {
  //       background: "#fff",
  //     },
  //     "::-webkit-scrollbar-thumb": {
  //       background: "#042b62",
  //     },
  //     "::-webkit-scrollbar-thumb:hover": {
  //       background: "#555",
  //     },
  //   }),
  // };

  // Assets
  const defaultAssetDetails = {
    Created_By: 0,
    Updated_By: 0,
    asset_amount: "",
    asset_abreturn: "0",
    user_asset_growth_rate: "10",
    asset_broker_id: 0,
    asset_category_id: 41,
    asset_citytype: "0",
    user_asset_current_price: "",
    user_asset_source: "Manual",
    asset_epf_ismanual: "1",
    asset_folio_number: null,
    asset_footnote: null,
    asset_frequency: "1",
    asset_goal_link_id: 0,
    asset_goalname: null,
    asset_gold_karat: 0,
    asset_isActive: "1",
    asset_isMortgage: "0",
    user_asset_valid_till: "Perpetual",
    user_asset_allocation: 'N',
    asset_iselss: "1",
    asset_islinkable: true,
    user_asset_occurance: "One Time",
    user_asset_property_type: "Self-Occupied",
    user_asset_maturity_amount: 0,
    asset_maturity_date: null,
    user_asset_for: 0,
    user_asset_end_date: null,
   user_asset_name: "Art Investment",
    asset_pan: null,
    asset_payout_type: "1",
    user_asset_pincode: "",
    user_asset_avg_purchase_price: "",
    user_asset_purchase_date: null,
    asset_rental_amount: "",
    asset_rental_income: null,
    user_asset_ror: 0,
    asset_sub_category_id: 64,
    asset_unique_code: "",
    user_asset_quantity: "",
    categorydetail: "Alternate",
    created_datetime: moment().format("DD/MM/YYYY"),
    employee_contribution: "",
    employer_contribution: "",
    fp_log_id: 0,
    user_asset_installment_paid: 1,
    membername1: "",
    stock_mf: null,
    stock_name: null,
    subcategorydetail: "",
    user_asset_current_amount: "",
    user_asset_investment_amount: "",
    totalmaturtiyamount: "",
    asset_purchase_avgamount: "",
    updated_datetime: moment().format("DD/MM/YYYY"),
    user_id: 0,
    scheme_equityshare: {},
  };

  const [assetsData, setAssetsData] = useState("");
  const [goalData, setGoalData] = useState([]);
  const [unchangedgoaldata, setUnchangedGoalData] = useState([]);
  const [rentalincomeData, setRentalIncomeData] = useState([]);
  const [assetsDetails, setAssetsDetails] = useState(defaultAssetDetails);
  const [schemedata, setSchemeData] = useState({
    goldfunds: [],
    eqfunds: [],
    debtfunds: [],
    liquidfunds: [],
    equityShares: [],
    cryptodata: [],
  });
  const simpleValidator = useRef(new SimpleReactValidator());
  const [assetEditId, setAssetEditId] = useState("");
  const [isGoalSelected, setGoalSelected] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState(false);
  const [selectedGoalsId, setSelectedGoalsId] = useState(false);
  const [selectedPriorityArray, setSelectedPriorityArray] = useState([]);
  const [isAutoMatedGoal, setAutoMatedGoal] = useState(true);

  const getfpgoalsdata = async (fplogid) => {
    try {
      let fpgoal_data = {
        user_id: getParentUserId(),
        fp_log_id: fplogid,
      };

      var fpgoals_res = await apiCall(
        ADVISORY_GET_FP_GOALS_DATA,
        fpgoal_data,
        true,
        false
      );

      if (fpgoals_res["error_code"] == "100") {
        var family_array = [];
        var family_array1 = [];

        // Add the automated linkage field at the beginning
        // family_array.push({
        //   value: 0,
        //   label: "Automated Linkage",
        // });

        var family = fpgoals_res["data"];
        family.map((goal) => {
          family_array.push({
            value: goal.id,
            label: goal.goal_name + " - " + goal.goalforname,
          });
          family_array1.push({
            value: goal.id,
            label: goal.goal_name + " - " + goal.goalforname,
          });
        });
        setGoalData(family_array);
        setUnchangedGoalData(family_array1);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getRentalIncome = async (fplogid) => {
    try {
      let url = ADVISORY_GET_INCOME_DATA;
      let payload = {
        income_forretirement: "0",
        isrented: 1,
        user_id: getParentUserId(),
        fp_log_id: fplogid,
      };
      let getIncomeData = await apiCall(url, payload, true, false);
      if (getIncomeData["error_code"] == "100") {
        var rental_income = [];
        var incomedata = getIncomeData["data"];

        incomedata.map((v) => {
          rental_income.push({ value: v.id, label: v.income_amount });
        });
        setRentalIncomeData(rental_income);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const [assetsId, setAssetsId] = useState("");
  const addAssetsSubmit = async (e, fplogid) => {
    e.preventDefault();
    if (assetsDetails.fp_log_id == 0 && assetsDetails.user_id == 0) {
      var fp_log_id = fplogid;
      var user_id = getParentUserId();
      setAssetsDetails({
        ...assetsDetails,
        user_id: user_id,
        fp_log_id: fp_log_id,
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

  const deleteAssetData = async (id) => {
    const item = assetsData.filter((item) => item.id === id);
    try {
      let url = ADVISORY_DELETE_ASSETS_API;
      let payload = {
        id: id,
        user_id: getParentUserId(),
        fp_log_id: session["data"]["fp_log_id"],
      };
      let deleteassetData = await apiCall(url, payload, true, false);
      if (deleteassetData["error_code"] == "100") {
        setShow(false);
        var msg = item[0].asset_name ? " - " + item[0].asset_name : "";
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          item[0].categorydetail +
            "-" +
            item[0].subcategorydetail +
            msg +
            " Data Deleted Successfully"
        );
        dispatch({type: "ASSETS_UPDATE",payload: true});
        getAssetData(session["data"]["fp_log_id"]);
        dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        scrollToList();
        setAssetsDetails(defaultAssetDetails);
        setSelectedOption("Alternate");
        setSelectedSubOption("Art Investment");
        setAssetsDetails({
          ...defaultAssetDetails,
          user_id: session["data"]["user_details"]["user_id"],
          fp_log_id: session["data"]["user_details"]["fp_log_id"],
          user_asset_for: familyData["0"].value,
        });
        setSelectedGoals("Automated Linkage");
        setSelectedGoalsId(false);
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

  const addAssets = async (e) => {
    e.preventDefault();
    try {
      let url = '';
      let payload = assetsDetails;
      payload.user_id = getParentUserId();
      payload.fp_log_id = session["data"]["fp_log_id"];

      let addassetData = await apiCall(url, payload, true, false);
      if (addassetData["error_code"] == "100") {
        var msg = assetsDetails.subcategorydetail
          ? " - " + assetsDetails.asset_name
          : "";
        getAssetData(session["data"]["fp_log_id"]);
        scrollToList();
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          assetsDetails.categorydetail + msg + " added succesfully"
        );
        dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        setAssetsDetails({
          ...defaultAssetDetails,
          user_id: session["data"]["user_details"]["user_id"],
          fp_log_id: session["data"]["user_details"]["fp_log_id"],
          user_asset_for: familyData["0"].value,
        });
        setSelectedOption(defaultAssetDetails.categorydetail);
        setSelectedSubOption("Art Investment");
        setAddForm(true);
        setUpdateForm(false);
        setGoalSelected(false);
        setSelectedGoals("Automated Linkage");
        setSelectedGoalsId(false);
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

  const updateAssets = async (e) => {
    e.preventDefault();
    try {
      let url = ADVISORY_UPDATE_ASSETS_API;
      let payload = assetsDetails;
      payload.user_id = getParentUserId();
      payload.fp_log_id = session["data"]["fp_log_id"];

      let updateassetData = await apiCall(url, payload, true, false);
      if (updateassetData["error_code"] == "100") {
        var msg = assetsDetails.subcategorydetail
          ? " - " + assetsDetails.subcategorydetail
          : "";
        getAssetData(session["data"]["fp_log_id"]);
        scrollToList();
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          assetsDetails.categorydetail + msg + " updated succesfully"
        );
        dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        setAssetsDetails({
          ...defaultAssetDetails,
          user_id: session["data"]["user_details"]["user_id"],
          fp_log_id: session["data"]["user_details"]["fp_log_id"],
          user_asset_for: familyData["0"].value,
        });
        dispatch({type: "ASSETS_UPDATE",payload: true});
        setSelectedOption(defaultAssetDetails.categorydetail);
        setSelectedSubOption("Art Investment");
        setAddForm(true);
        setUpdateForm(false);
        setGoalSelected(false);
        setSelectedGoals("Automated Linkage");
        setSelectedGoalsId(false);
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

  const editAssetData = async (id) => {
    setAutoMatedGoal(false);
    try {
      let url = '';
      let payload = {
        id: id,
        user_id: getParentUserId(),
        fp_log_id: session["data"]["fp_log_id"],
      };
      let editassetData = await apiCall(url, payload, true, false);
      if (editassetData["error_code"] == "100") {
        var msg = editassetData["data"][0]["subcategorydetail"]
          ? " - " + editassetData["data"][0]["subcategorydetail"]
          : "";
        var editData = editassetData["data"][0];
        editData.asset_ismortgage = editData["asset_isMortgage"];
        editData.user_asset_valid_till = editData["asset_isPerpetual"];
        editData.user_asset_occurance = editData["user_asset_occurance"];
        editData.asset_payout_type = editData["asset_payout_type"];
        editData.asset_frequency = editData["asset_frequency"];
        editData.user_asset_growth_rate = editData["asset_user_asset_growth_rate"];
        if (editData["asset_islinkable"] == "1") {
          editData.asset_islinkable = true;
        } else {
          editData.asset_islinkable = false;
        }
        if (editData["user_asset_occurance"] == "One Time") {
          editData.user_asset_occurance = true;
        } else {
          editData.user_asset_occurance = false;
        }
        if (editData["user_asset_installment_paid"] == 1) {
          editData.user_asset_installment_paid = 1;
        } else {
          editData.user_asset_installment_paid = 0;
        }
        if (editassetData["linked_goals"].length > 0) {
          var linkedGoals = editassetData["linked_goals"];

          var selectedGoals = [];
          var goalIds = [];
          var priorityArray = [];
          linkedGoals.forEach((goal) => {
            selectedGoals.push(goal.goal_id.goal_name + "-" + goal.goalforname);
            goalIds.push(goal.goal_id.id);
            priorityArray.push(goal.priority);
            goalData.forEach((goal_obj) => {
              if (goal_obj.value == goal.goal_id.id) {
                goal_obj.priority = parseInt(goal.priority);
              }
            });
            unchangedgoaldata.forEach((goal_obj) => {
              if (goal_obj.value == goal.goal_id.id) {
                goal_obj.priority = parseInt(goal.priority);
              }
            });
          });

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
        }
        editData.asset_amount = Number(editData.asset_amount);
        editData.user_asset_avg_purchase_price = Number(editData.user_asset_avg_purchase_price);
        editData.user_asset_current_price = Number(
          editData.user_asset_current_price
        );
        editData.user_asset_quantity = Number(editData.user_asset_quantity);
        editData.user_asset_maturity_amount = Number(editData.user_asset_maturity_amount);
        editData.user_asset_current_amount = Number(editData.user_asset_current_amount);
        editData.user_asset_investment_amount = Number(editData.user_asset_investment_amount);
        editData.totalmaturtiyamount = Number(editData.totalmaturtiyamount);
        editData.user_asset_ror = Number(editData.user_asset_ror);
        editData.employee_contribution = Number(
          editData["employee_monthly_contrib"]
        );
        editData.employer_contribution = Number(
          editData["employeer_monthly_contrib"]
        );
        setAssetsDetails(editData);
        setSelectedOption(editassetData["data"][0]["categorydetail"]);
        setSelectedSubOption(editassetData["data"][0]["subcategorydetail"]);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          "You can now edit details for " +
            editassetData["data"][0]["categorydetail"] +
            msg
        );
        dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        setAssetEditId(id);
        setUpdateForm(true);
        setAddForm(false);
        scrollToForm();
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const cancelAssetForm = async (e) => {
    e.preventDefault();
    setAssetsDetails({
      ...defaultAssetDetails,
      user_id: session["data"]["user_details"]["user_id"],
      fp_log_id: session["data"]["user_details"]["fp_log_id"],
      user_asset_for: familyData["0"].value,
    });
    setSelectedOption(defaultAssetDetails.categorydetail);
    setSelectedSubOption("Art Investment");
    setAssetEditId(" ");
    setAddForm(true);
    setUpdateForm(false);
    setGoalSelected(false);
    setSelectedGoals("Automated Linkage");
    setSelectedGoalsId(false);
    setSelectedPriorityArray([]);
    setAutoMatedGoal(true);
    if (session["data"]["user_details"]["fp_log_id"]) {
      getfpgoalsdata(session["data"]["user_details"]["fp_log_id"]);
    }
  };

  const [familyData, setFamilyData] = useState([]);
  const [memberData, setMemberData] = useState([]);

  const [addForm, setAddForm] = useState(true);
  const [updateForm, setUpdateForm] = useState(false);
  const asset_data = useRef([]);

  useEffect(() => {
    // checksession();
  }, []);

  const setDate = (date, dateType) => {
    if (dateType == "assetPurchaseDate") {
      assetsDetails.user_asset_purchase_date = moment(date).format("DD/MM/YYYY");
    }
    if (dateType == "assetendDate") {
      assetsDetails.user_asset_end_date = moment(date).format("DD/MM/YYYY");
    }
    if (dateType == "maturityDate") {
      assetsDetails.asset_maturity_date = moment(date).format("DD/MM/YYYY");
    }
  };

  const checksession = async () => {
    let url = '';
// let url = CHECK_SESSION;
    let data = { user_id: getUserId(), sky: getItemLocal("sky") };
    let session_data = await apiCall(url, data, true, false);
    setSession(session_data);
    getFamilyMembers();
    getSchemeData();
    getEquitySharesData();

    if (session_data.error_code == "100") {
      getfpgoalsdata(session_data.data.fp_log_id);
      getRentalIncome(session_data.data.fp_log_id);
      getCryptoData();
      getAssetData(session_data.data.fp_log_id);
    }
  };

  const getSchemeData = async () => {
    try {
      let url = ADVISORY_GET_SCHEME_DATA;
      let getschemeData = await getSchemeDataStorage();
      if (getschemeData["error_code"] == "100") {
        setSchemeData({
          ...schemedata,
          eqfunds: getschemeData.data.Equity,
          debtfunds: getschemeData.data.Debt,
          liquidfunds: getschemeData.data.Liquid,
          goldfunds: getschemeData.data.Gold,
        });
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
        setSchemeData({ ...schemedata, cryptodata: cryptolist });
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (err) {
      console.log("error", err);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const getEquitySharesData = async () => {
    try {
      let url = ADVISORY_GET_EQUITY_SHARES_DATA;
      let getequitysharesdata = await apiCall(url, "", true, false);
      if (getequitysharesdata["error_code"] == "100") {
        setSchemeData({ ...schemedata, equityShares: getequitysharesdata });
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const getAssetData = async (fplogid) => {
    try {
      let url = '';
      let payload = {
        filter_id: "0",
        user_id: getParentUserId(),
        fp_log_id: fplogid,
      };
      let getassetData = await apiCall(url, payload, true, false);
      if (getassetData["error_code"] == "100") {
        asset_data.current = getassetData["data"];
        setAssetsData(getassetData["data"]);
        setAddForm(true);
        setUpdateForm(false);
        setAssetEditId("");
        simpleValidator.current.hideMessages();
        setForceUpdate((v) => ++v);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const getFamilyMembers = async () => {
    try {
      let data = {
        user_id: getParentUserId(),
        data_belongs_to: DATA_BELONGS_TO,
      };
      let member_data = await apiCall('', data, true, false);
      if (member_data.error_code == "100") {
        var member_array = [];
        var filter_member = [];
        var members = member_data["data"];
        members.map((member) => {
          if (member.parent_user_id == 0) {
            member_array.push({ value: member.fp_user_id, label: "Self" });
            filter_member.push({ value: member.fp_user_id, label: "Self" });
            filter_member.push({ value: 0, label: "Family" });
            setAssetsDetails({
              ...assetsDetails,
              user_asset_for: member.fp_user_id,
            });
          } else {
            member_array.push({ value: member.fp_user_id, label: member.NAME });
            filter_member.push({ value: member.fp_user_id, label: member.NAME });
          }
        });
        setFamilyData(member_array);
        setMemberData(filter_member);
        
      } else {
        setFamilyData([]);
        setMemberData([])
      }
    } catch {}
  };

  const handleClose = (type, form) => {
    if (type == "yes" && form == "asset") {
      deleteAssetData(assetsId);
    } else {
      setShow(false);
    }
  };

  const scrollToForm = () => {
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

  useEffect(() => {
    var calculatePurchase = 0.0;
    var calculatecurrent = 0.0;
    var calculateror = 0;
    if (document.getElementById("unitPrice-error")) {
      document.getElementById("unitPrice-error").innerHTML = "";
    }
    if (
      assetsDetails.user_asset_quantity != "" &&
      assetsDetails.user_asset_avg_purchase_price != ""
    ) {
      if (assetsDetails.asset_sub_category_id == "119") {
        calculatePurchase =
          parseFloat(assetsDetails.user_asset_quantity).toFixed(4) *
          parseFloat(assetsDetails.user_asset_avg_purchase_price).toFixed(4);
      } else {
        calculatePurchase =
          parseFloat(assetsDetails.user_asset_quantity).toFixed(2) *
          parseFloat(assetsDetails.user_asset_avg_purchase_price).toFixed(2);
      }
    }
    if (
      assetsDetails.user_asset_current_price != "" &&
      assetsDetails.user_asset_quantity != ""
    ) {
      if (assetsDetails.asset_sub_category_id == "119") {
        calculatecurrent =
          parseFloat(assetsDetails.user_asset_quantity).toFixed(4) *
          parseFloat(assetsDetails.user_asset_current_price).toFixed(4);
      } else {
        calculatecurrent =
          parseFloat(assetsDetails.user_asset_quantity).toFixed(2) *
          parseFloat(assetsDetails.user_asset_current_price).toFixed(2);
      }
    }

    if (
      assetsDetails.user_asset_quantity != "" &&
      assetsDetails.asset_purchase_avgamount != ""
    ) {
      if (assetsDetails.asset_sub_category_id == "123") {
        calculatePurchase =
          parseFloat(assetsDetails.user_asset_quantity).toFixed(4) *
          parseFloat(assetsDetails.asset_purchase_avgamount).toFixed(4);
      } else {
        // calculatePurchase = parseFloat(assetsDetails.user_asset_quantity).toFixed(2) * parseFloat(assetsDetails.user_asset_avg_purchase_price).toFixed(2);
      }
    }
    if (
      assetsDetails.user_asset_current_price != "" &&
      assetsDetails.user_asset_quantity != ""
    ) {
      if (assetsDetails.asset_sub_category_id == "123") {
        calculatecurrent =
          parseFloat(assetsDetails.user_asset_quantity).toFixed(4) *
          parseFloat(assetsDetails.user_asset_current_price).toFixed(4);
      } else {
        calculatecurrent =
          parseFloat(assetsDetails.user_asset_quantity).toFixed(2) *
          parseFloat(assetsDetails.user_asset_current_price).toFixed(2);
      }
    }

    if (Number.isNaN(calculatePurchase)) {
      calculatePurchase = 0.0;
    }
    if (Number.isNaN(calculatecurrent)) {
      calculatecurrent = 0.0;
    }
    if (calculatePurchase && calculatecurrent) {
      calculateror =
        ((parseFloat(calculatecurrent).toFixed(2) -
          parseFloat(calculatePurchase).toFixed(2)) /
          parseFloat(calculatePurchase).toFixed(2)) *
        100;
    }
    if (
      assetsDetails.user_asset_occurance == "One Time" &&
      assetsDetails.user_asset_avg_purchase_price &&
      assetsDetails.asset_amount
    ) {
      calculateror =
        ((calculatecurrent - assetsDetails.user_asset_avg_purchase_price) /
          assetsDetails.user_asset_avg_purchase_price) *
        100;
    }

    if (Number.isNaN(calculateror)) {
      calculateror = 0.0;
    }

    if (assetsDetails.asset_sub_category_id == "119") {
      assetsDetails.user_asset_investment_amount =
        parseFloat(calculatePurchase).toFixed(2);
      assetsDetails.user_asset_current_amount =
        parseFloat(calculatecurrent).toFixed(2);
    } else {
      assetsDetails.user_asset_investment_amount =
        parseFloat(calculatePurchase).toFixed(2);
      assetsDetails.user_asset_current_amount =
        parseFloat(calculatecurrent).toFixed(2);
    }

    // if (
    //   (assetsDetails.asset_category_id == 38 &&
    //     assetsDetails.asset_sub_category_id == 77) ||
    //   assetsDetails.asset_category_id != 38
    // ) {
    //   if (assetsDetails.asset_sub_category_id != 119) {
    //     var asset_abretrun = parseFloat(calculateror).toFixed(2);
    //     assetsDetails.user_asset_ror = parseFloat(asset_abretrun).toFixed(2);
    //   }
    // }
    if (
      assetsDetails.asset_sub_category_id == 36 ||
      assetsDetails.asset_sub_category_id == 37
    ) {
      assetsDetails.user_asset_investment_amount = calculatePurchase.toFixed(2);
      assetsDetails.user_asset_current_amount = calculatecurrent.toFixed(2);
    }

    setAssetsDetails({
      ...assetsDetails,
      user_asset_investment_amount: assetsDetails.user_asset_investment_amount,
      user_asset_current_amount: assetsDetails.user_asset_current_amount,
    });
  }, [
    assetsDetails.user_asset_quantity,
    assetsDetails.user_asset_avg_purchase_price,
    assetsDetails.user_asset_current_price,
  ]);

  const closeModal = () => {
    setGoalSelected(false);
  };
  const selectGoals = (goals) => {
    setSelectedGoals(goals.toString());
  };
  const selectedGoalIdArray = (goalIds) => {
    setSelectedGoalsId(goalIds);
  };
  const setPriorityArray = (priorityArray) => {
    setSelectedPriorityArray(priorityArray);
  };
  const setGoalLink = (goalIds) => {
    if (goalIds.length > 0) {
      setAssetsDetails({
        ...assetsDetails,
        asset_goal_link_id: goalIds.join(","),
      });
    }
  };
  return (
    <DatagatherLayout>
      <div className="AssetLib">
        <div className="background-div">
          <div
            className={`bg ${
              currentUrl.indexOf("datagathering/assets-liabilities") > -1
                ? "active"
                : ""
            }`}
            id="bg-assets"
          ></div>
        </div>
        <div className="white-box">
          <div className="d-flex justify-content-md-center tab-box">
            <div className="d-flex top-tab-menu m-0">
              <div
                className={`tab-menu-item ${tab == "tab1" ? "active" : ""}`}
                onClick={() => setTab("tab1")}
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
                  </div>

                  <div className="inner-box ">
                    <AssetFilter
                      filterdata={asset_data.current}
                      memberData={memberData}
                      assetsData={assetsData}
                      setAssetsData={setAssetsData}
                      session={session}
                    />

                    <AssetList
                      handleShow={handleShow}
                      setAssetsId={setAssetsId}
                      editAssetData={editAssetData}
                      assetsData={assetsData}
                      session={session}
                    />

                    {asset_data.current && asset_data.current.length > 0 && (
                      <div
                        id="no-result-msg"
                        style={{
                          textAlign: "center",
                          fontSize: "17px",
                          fontWeight: "bold",
                        }}
                      ></div>
                    )}
                  </div>
                </div>
                <div className="col-md-12 col-lg-10">
                  <div className="accordion">
                    <div className="accordion-panel active" id="assetbox">
                      <div className="accordion-header d-flex justify-content-between">
                        <h4 className="accordion-heading">
                          <img
                            alt="Asset"
                            className="accordian-img"
                            src={
                              imagePath +
                              "/static/assets/img/assets-liabilities/asset-top.svg"
                            }
                          />
                          <span>Add Assets</span>
                        </h4>
                        <div
                          onClick={() => setShowView(!showview)}
                          className={`${DGstyles.HideSHowicon}`}
                        >
                          {showview == "One Time" ? <>-</> : <>+</>}
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
                                  <ul className="card-list ">
                                    {options.map((v, i) => (
                                      <React.Fragment key={i}>
                                        <li
                                          onClick={() => {
                                            setAssetsDetails({
                                              ...defaultAssetDetails,
                                              categorydetail: v.title,
                                              asset_category_id: v.id,
                                             user_asset_name: v.options["0"]
                                                ? v.options["0"].title
                                                : v.title,
                                              subcategorydetail:
                                                v.options["0"]?.title,
                                              asset_sub_category_id: v.options[
                                                "0"
                                              ]
                                                ? v.options["0"].id
                                                : v.id,
                                              user_id:
                                                session["data"]["user_details"][
                                                  "user_id"
                                                ],
                                              fp_log_id:
                                                session["data"]["user_details"][
                                                  "fp_log_id"
                                                ],
                                              user_asset_for:
                                                familyData["0"].value,
                                            });
                                            simpleValidator.current.hideMessages();
                                            setForceUpdate((v) => ++v);
                                            setSelectedOption(v.title);

                                            if (v.options.length === 0) {
                                              setSelectedSubOption("");
                                            } else {
                                              setSelectedSubOption(
                                                v.options["0"].title
                                              );
                                            }

                                            setAddForm(true);
                                            setUpdateForm(false);
                                          }}
                                          className={`li-options ${
                                            selectedOption == v.title
                                              ? "active"
                                              : ""
                                          }`}
                                        >
                                          <label title={v.title}>
                                            <img src={v.img} />
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
                                      .filter((v) => v.title == selectedOption)
                                      .map((v, z) => (
                                        <React.Fragment key={z}>
                                          {v.options.map((x, i) => (
                                            <React.Fragment key={i}>
                                              <li
                                                onClick={() => {
                                                  setAssetsDetails({
                                                    ...defaultAssetDetails,
                                                   user_asset_name: x.title,
                                                    subcategorydetail: x.title,
                                                    categorydetail: v.title,
                                                    asset_sub_category_id: x.id,
                                                    asset_category_id: v.id,
                                                    user_id:
                                                      session["data"][
                                                        "user_details"
                                                      ]["user_id"],
                                                    fp_log_id:
                                                      session["data"][
                                                        "user_details"
                                                      ]["fp_log_id"],
                                                    user_asset_for:
                                                      familyData["0"].value,
                                                  });
                                                  setSelectedSubOption(x.title);
                                                  simpleValidator.current.hideMessages();
                                                  setForceUpdate((v) => ++v);
                                                  setAssetEditId("");
                                                  setAddForm(true);
                                                  setUpdateForm(false);
                                                }}
                                                className={`li-options ${
                                                  selectedSubOption == x.title
                                                    ? "active"
                                                    : ""
                                                }`}
                                              >
                                                <label htmlFor="alternate-1">
                                                  <img
                                                    alt="Assets art investment"
                                                    src={x.img}
                                                  />
                                                  <span>{x.title}</span>
                                                </label>
                                              </li>
                                            </React.Fragment>
                                          ))}
                                        </React.Fragment>
                                      ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="forms-container  pt-3">
                                {selectedOption == "Alternate" && (
                                  <>
                                    <Alternate
                                      familyData={familyData}
                                      assetsDetails={assetsDetails}
                                      setAssetsDetails={setAssetsDetails}
                                      goalData={goalData}
                                      setDate={setDate}
                                      cryptodata={schemedata.cryptodata}
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
                                      debtfunds={schemedata.debtfunds}
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
                                    />
                                  </>
                                )}

                                {selectedOption == "Equity" && (
                                  <>
                                    <AssetEquity
                                      upload_options={upload_options}
                                      familyData={familyData}
                                      assetsDetails={assetsDetails}
                                      setAssetsDetails={setAssetsDetails}
                                      goalData={goalData}
                                      setDate={setDate}
                                      eqfunds={schemedata.eqfunds}
                                      equityShares={schemedata.equityShares}
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
                                    />
                                  </>
                                )}

                                {selectedOption == "Gold" && (
                                  <>
                                    <AssetGold
                                      familyData={familyData}
                                      assetsDetails={assetsDetails}
                                      setAssetsDetails={setAssetsDetails}
                                      goalData={goalData}
                                      setDate={setDate}
                                      goldfunds={schemedata.goldfunds}
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
                                    />
                                  </>
                                )}

                                {selectedOption == "Liquid" && (
                                  <>
                                    <Liquid
                                      familyData={familyData}
                                      assetsDetails={assetsDetails}
                                      setAssetsDetails={setAssetsDetails}
                                      goalData={goalData}
                                      setDate={setDate}
                                      rentalincomeData={rentalincomeData}
                                      liquidfunds={schemedata.liquidfunds}
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
                                    />
                                  </>
                                )}

                                {selectedOption == "Real Estate" && (
                                  <>
                                    <Realestate
                                      familyData={familyData}
                                      assetsDetails={assetsDetails}
                                      setAssetsDetails={setAssetsDetails}
                                      goalData={goalData}
                                      setDate={setDate}
                                      rentalincomeData={rentalincomeData}
                                      session={session}
                                      addForm={addForm}
                                      updateForm={updateForm}
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
                                    />
                                  </>
                                )}
                                {selectedOption == "Upload" && (
                                  <>
                                    <AssetOthers
                                      session={session}
                                      familyData={familyData}
                                      selectedOption={selectedOption}
                                      selectedSubOption={selectedSubOption}
                                      addForm={addForm}
                                      unchangedgoaldata={unchangedgoaldata}
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
            <div className={tab == "tab2" ? "d-block" : "d-none"}>
              <Liabilities />
            </div>
          </div>
        </div>
      </div>
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

          {/* {tab && tab == "tab2" && (
            <button
              onClick={() => {
                handleClose("yes", "liability");
              }}
              className="outline-btn m-2"
            >
              Yes
            </button>
          )} */}

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
    </DatagatherLayout>
  );
};

export default Assets;
