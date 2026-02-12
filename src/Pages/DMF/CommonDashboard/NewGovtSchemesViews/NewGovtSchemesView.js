import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormRangeSlider from "../CommonDashboardComponents/FormRangeSlider";
import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import SimpleReactValidator from "simple-react-validator";
import { formatDatefun } from "../../../../Utils/Date/DateFormat";
import {
  DATA_BELONGS_TO
} from "../../../../constants";
import {
  apiCall,
  fetchEncryptData,
  fv,
  getFpUserDetailId,
  getItemLocal,
  getParentUserId,
  getUserId,
  loginRedirectGuest,
} from "../../../../common_utilities";
import axios from "axios";
import { useDispatch } from "react-redux";
import moment from "moment";
import { getOtherInvestments, saveUserAssetDetails, updateUserAssetDetails } from "../../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { getFamilyMember } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { getAssetCategoryList } from "../../../../FrappeIntegration-Services/services/financial-planning-api/asset";
import { GetBankList } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";

const numericRegex = new RegExp(/^\d*\.?\d*$/);

const govtSchemeInputs = {
  default: [
    "bankInstituteName",
    "accountBalanceToday",
    "investmentAmountPerFrequency",
    "expectedRateOfReturn",
    "maturityDate",
    "maturityAmount",
  ],
  "government_schemes_others": [
    "purchaseDate",
    "purchaseAmount",
    "interestRate",
    "payoutType",
    "maturityDate",
    "maturityAmount",
  ],
  "post_office_schemes": [
    "schemeName",
    "purchaseDate",
    "investedAmount",
    "expectedRateOfReturn",
    "payoutType",
    "maturityDate",
    "maturityAmount",
  ],
  "sukanya_samriddhi_yojana": [
    "accountBalanceToday",
    "investmentAmountPerFrequency",
    "expectedRateOfReturn",
    "maturityDate",
    "maturityAmount",
  ],
  "ppf": [
    "schemeName",
    "accountBalanceToday",
    "investmentAmountPerFrequency",
    "expectedRateOfReturn",
    "maturityDate",
    "maturityAmount",
  ],
  "nsc": [
    "schemeName",
    "purchaseDate",
    "investedAmount",
    "expectedRateOfReturn",
    "payoutType",
    "maturityDate",
    "maturityAmount",
  ],
  "nps": [
    "bankInstituteName",
    "accountBalanceToday",
    "investmentAmountPerFrequency",
    "expectedRateOfReturn",
    "maturityDate",
    "maturityAmount",
  ],
  "epf": [
    "bankInstituteName",
    "accountBalanceToday",
    "investmentAmountPerFrequency",
    "expectedRateOfReturn",
    "maturityDate",
    "maturityAmount",
  ]
};

function isInputInPolicy(inputName, policyType) {
  if (!policyType) policyType = "default";
  const scheme = govtSchemeInputs[policyType.toLowerCase()];
  if (!scheme) return false;
  return scheme.includes(inputName);
}

function formatWithIndianCommas(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

const initialState = {
  dateOfInvestment: "",
  typeOfAsset: "",
  assetName: "",
  govtSchemeMemberName: "",
  bankInstituteName: "",
  bankInstituteNameOther: "",
  accountBalanceToday: 0,
  investmentAmountPerFrequency: 0,
  investmentAmount: 0,
  expectedRateOfReturn: 0,
  maturityDate: "",
  maturityAmount: 0,
  schemeName: "",
  investmentDate: "",
  interestRate: 0,
  purchaseDate: "",
  investedAmount: "",
  payoutType: "Cumulative",
  asset_frequency: "1",
  asset_isPerpetual: "",
};

const NewGovtSchemesView = () => {
  const [, forceUpdate] = useState();
  const [formData, setFormData] = useState(initialState);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState("Monthly");

  const [activeIndex2, setActiveIndex2] = useState(0);
  const [selectedValue2, setSelectedValue2] = useState("Monthly");
  const [allBank, setAllBank] = useState([]);
  const dispatch = useDispatch();
  const [period, setperiod] = useState("");
  const [rate, setrate] = useState("");
  const { id } = useParams();
  const [editdata, setEditData] = useState("");
  const [session, setSession] = useState("");
  const [maturityamount, setMaturityCalculation] = useState(0);
  const navigate = useNavigate();
  const simpleValidator = useRef(new SimpleReactValidator());
  const [familyData, setFamilyData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [govtSchemesOptions, setGovtSchemesOptions] = useState([]);
  const [assetForMember, setAssetForMember] = useState("");
  const [assetsDetails, setAssetsDetails] = useState(initialState);
  const [govtSchemePayload, setGovtSchemePayload] = useState("");
  const [addForm, setAddForm] = useState(true);
  const [updateForm, setUpdateForm] = useState(false);
  const [assetEditId, setAssetEditId] = useState("");

  //options label after select
  const options = [
    { value: "nps", label: "National Pension Scheme (NPS)" },
    { value: "ppf", label: "PPF" },
    { value: "epf", label: "EPF" },
    { value: "nsc", label: "NSC" },
    { value: "sukanya_samriddhi_yojana", label: "Sukanya Samriddhi Yojana" },
    { value: "post_office_schemes", label: "Post Office Scheme" },
    { value: "government_schemes_others", label: "Other Govt Schemes" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {

        const asset_category = await getAssetCategoryList();

        const categoryList = asset_category?.data?.[0]?.category_list || [];

        const debtCategory = categoryList.find(
          (cat) => cat.asset_name === "Debt"
        );

        if (debtCategory) {

          for (const sub of debtCategory.subcategories) {
            if (sub.asset_sub_name_uuid === "government_schemes") {
              const formattedOptions = sub.asset_types.map(item => ({
                value: item.asset_type_name_uuid,
                label: item.asset_type_name == "NPS" ? "National Pension Scheme (NPS)" : item.asset_type_name
              }));
              setGovtSchemesOptions(formattedOptions);
              break;
            }
          }
          let govtSchemePayloadData = {};
          for (const sub of debtCategory.subcategories) {
            if (sub.asset_sub_name_uuid === "government_schemes") {
              govtSchemePayloadData["asset_sub_name_uuid"] = sub.asset_sub_name_uuid;
              govtSchemePayloadData["asset_name_uuid"] = debtCategory.asset_name_uuid;
              govtSchemePayloadData["asset_type_data"] = [];
              sub.asset_types.map((item) => {
                govtSchemePayloadData.asset_type_data.push({ "asset_type_name_uuid": item.asset_type_name_uuid, })
              })
            }
          }
          setGovtSchemePayload(govtSchemePayloadData);

        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const options_payout = [
    { value: "Cumulative", label: "Cumulative" },
    { value: "Non-Cumulative", label: "Non-Cumulative" },
  ];


  useEffect(() => {
    let calculatematurityamount = 0.0;
    if (
      formData.typeOfAsset === "post_office_schemes" ||
      formData.typeOfAsset === "nsc" ||
      formData.typeOfAsset === "government_schemes_others"
    ) {
      if (
        formData?.maturityDate &&
        (formData?.purchaseDate || formData?.investmentDate)
      ) {
        const mf_yr_f = moment(formData?.maturityDate).format("DD/MM/YYYY").split("/");

        const c_yr_f = moment(formData?.purchaseDate ? formData?.purchaseDate : formData?.investmentDate).format("DD/MM/YYYY").split("/");
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

        let amt = 0
        if (formData.typeOfAsset === "post_office_schemes") {
          amt = formData.investedAmount
        }
        else if (formData.typeOfAsset === "government_schemes_others") {
          amt = formData.purchaseAmount
        }
        else {
          amt = formData.investedAmount
        }

        let assetROR = 0
        if (formData.typeOfAsset === "government_schemes_others") {
          assetROR = formData.interestRate
        }
        else {
          assetROR = formData.expectedRateOfReturn
        }

        calculatematurityamount = fv(
          assetROR,
          nper,
          0,
          amt
        );

        if (
          formData.payoutType === "Non-Cumulative"
        ) {
          calculatematurityamount = formData.investedAmount;
        } else {
          calculatematurityamount =
            calculatematurityamount > 999999999
              ? Math.round(calculatematurityamount)
              : calculatematurityamount.toFixed(2);
        }
      }
    } else if (
      formData.typeOfAsset === "ppf" ||
      formData.typeOfAsset === "epf" ||
      formData.typeOfAsset === "sukanya_samriddhi_yojana" ||
      formData.typeOfAsset === "nps"
    ) {
      // const assetMaturityDate = moment(formData?.maturityDate).isValid()
      //   ? formData.maturityDate
      //   : null;

      const assetMaturityDate = formData?.maturityDate;
      if (assetMaturityDate && formData.expectedRateOfReturn &&
        (formData.investmentAmountPerFrequency || formData.accountBalanceToday)) {
        const c_yr = session?.data?.plan_date ? session["data"]["plan_date"] : new Date();
        const c_yr_date = new Date(c_yr);
        const mf_yr_f = moment(assetMaturityDate).format("DD/MM/YYYY").split("/");
        const firstDate = new Date(
          parseInt(mf_yr_f[2]),
          parseInt(mf_yr_f[1]) - 1,
          parseInt(mf_yr_f[0])
        );
        const secondDate = c_yr_date;
        const timeDiff = Math.abs(firstDate.getTime() - secondDate.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const nper = parseFloat((diffDays / 365.2425).toFixed(2));
        const month_var = [0, 12, 4, 2, 1];

        if (formData.investmentAmountPerFrequency) {
          const pmt =
            parseInt(formData.investmentAmountPerFrequency) *
            month_var[formData.asset_frequency];
          calculatematurityamount = fv(
            formData.expectedRateOfReturn,
            nper,
            pmt,
            formData.accountBalanceToday
          );

          calculatematurityamount =
            calculatematurityamount > 999999999
              ? Math.round(calculatematurityamount)
              : calculatematurityamount.toFixed(2);
          if (parseInt(formData.purchaseAmount) == 0) {
            calculatematurityamount = 0;
          }
        }
      }
    }

    if (formData.investedAmount == "") {
      setMaturityCalculation(Number(0))
    }

    if (
      calculatematurityamount !== 0 &&
      calculatematurityamount !== null &&
      calculatematurityamount !== undefined
    ) {
      setMaturityCalculation(Number(calculatematurityamount))
    } else {
      setMaturityCalculation(Number(0));
    }

  }, [
    formData.investedAmount,
    formData.purchaseAmount,
    formData.purchaseDate,
    formData.investmentDate,
    formData?.maturityDate,
    formData?.payoutType,
    formData?.expectedRateOfReturn,
    formData?.asset_frequency,
    formData?.accountBalanceToday,
    formData?.interestRate,
    formData?.investmentAmountPerFrequency,
  ]);

  const getFamilyMembers = async () => {
    try {
      const member_data = await getFamilyMember(getUserId());

      if (member_data.status_code === '200') {

        let member_array = [];
        let filter_member = [];

        const members = member_data["data"];

        members.forEach((member) => {
          const isSelf = member.relation_id === 1 || member.relation === "Self";
          const memberId = member.user_id;
          const parentId = member.user_parent_id;

          const label = isSelf ? "Self" : member.user_name ?? member.user_email;

          const commonData = {
            value: memberId,
            label,
            dob: member.dob,
            life_expectancy: member.life_expectancy_age,
            isdependent: member.is_dependent,
          };

          member_array.push(commonData);
          filter_member.push({ value: memberId, label });

          if (isSelf && !parentId) {
            setAssetForMember(memberId);
            setAssetsDetails((prev) => ({
              ...prev,
              asset_member_id: memberId,
            }));
            setFormData({
              ...formData,
              aifmembername: memberId,
            });

            const assetSubCategoryIds = [
              "UCAT-5", "ASC-30", "ASC-10", "ASC-16", "ASC-11", "ASC-12", "ATM-4", "ATM-6", "ASC-25", "ASC-17", "ATM-40",
              "ASC-31", "ASC-27", "ASC-21", "ASC-13", "ASC-29", "ATM-24", "ASC-28", "ATM-23",
            ];

            // if (assetSubCategoryIds.includes(assetsDetails.asset_sub_category_id)) {
            //   member_array.push({
            //     value: 0,
            //     label: "Family",
            //     retirement_age: member.retirement_age,
            //     dob: member.dob,
            //     life_expectancy: member.life_expectancy_age,
            //     isdependent: member.is_dependent,
            //   });
            // }
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
        });

        setFamilyData(member_array);
        setMemberData(filter_member);
        if (member_array.length > 0) {
          const selfMember = member_array.find(m => m.label === "Self");
          if (selfMember) {
            setFormData(prev => ({ ...prev, usmembername: selfMember.value }));
          }
        }
      } else {
        setFamilyData([]);
        setMemberData([]);
      }
    } catch (error) {
      setFamilyData([]);
      setMemberData([]);
    }
  };

  const parseDate = (dateStr) => {
    try {
      if (!dateStr || typeof dateStr !== "string") return null;
      const [day, month, year] = dateStr.split("/");
      const date = new Date(`${year}-${month}-${day}`);
      if (isNaN(date)) throw new Error("Invalid date");
      return date;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    getFamilyMembers();
    const urlParams = new URLSearchParams(window.location.search);
    let asset_id = urlParams.get("id");
    if (asset_id) {
      setUpdateForm(true);
      setAddForm(false);
      setAssetEditId(asset_id);
      fetchGovtSchemeAssetData(asset_id);
    }
  }, []);


  const fetchGovtSchemeAssetData = async (id) => {
    try {
      let payload_data = {
        user_id: getUserId(),
        user_asset_id: id
      };

      const res = await getOtherInvestments(payload_data);

      if (res?.status_code === "200") {

        const urlParams = new URLSearchParams(window.location.search);

        const selectedAsset = res?.data?.listing?.find(
          (item) => item?.name === urlParams.get("id")
        );

        if (selectedAsset) {
          let assetType = selectedAsset.asset_type_name_uuid;
          let frequency = selectedAsset.user_asset_freq;
          let assetFrequency = selectedAsset.user_asset_freq;
          if (frequency === "Monthly") {
            assetFrequency = "1";
          } else if (frequency === "Quarterly") {
            assetFrequency = "2";
          } else if (frequency === "Semi Anually") {
            assetFrequency = "3";
          } else if (frequency === "Anually") {
            assetFrequency = "4";
          }

          if (assetType === "epf") {
            setFormData({
              ...formData,
              typeOfAsset: selectedAsset.asset_type_name_uuid,
              govtSchemeMemberName: selectedAsset.user_asset_for,
              bankInstituteName: selectedAsset.user_asset_name,
              accountBalanceToday: selectedAsset.user_asset_current_amount,
              investmentAmountPerFrequency: selectedAsset.user_asset_investment_amount.toString(),
              asset_frequency: assetFrequency,
              expectedRateOfReturn: selectedAsset.user_asset_ror,
              maturityDate: parseDate(selectedAsset.user_asset_maturity_date),
            });
            setMaturityCalculation(selectedAsset.user_asset_maturity_amount);
          } else if (assetType === "nps") {
            setFormData({
              ...formData,
              typeOfAsset: selectedAsset.asset_type_name_uuid,
              govtSchemeMemberName: selectedAsset.user_asset_for,
              bankInstituteName: selectedAsset.user_asset_name,
              accountBalanceToday: selectedAsset.user_asset_current_amount,
              investmentAmountPerFrequency: selectedAsset.user_asset_investment_amount.toString(),
              asset_frequency: assetFrequency,
              expectedRateOfReturn: selectedAsset.user_asset_ror,
              maturityDate: parseDate(selectedAsset.user_asset_maturity_date),
            });
            setMaturityCalculation(selectedAsset.user_asset_maturity_amount);
          } else if (assetType === "nsc") {
            setFormData({
              ...formData,
              typeOfAsset: selectedAsset.asset_type_name_uuid,
              govtSchemeMemberName: selectedAsset.user_asset_for,
              schemeName: selectedAsset.user_asset_name,
              purchaseDate: parseDate(selectedAsset.user_asset_purchase_date),
              investedAmount: selectedAsset.user_asset_investment_amount,
              expectedRateOfReturn: selectedAsset.user_asset_ror,
              payoutType: selectedAsset.user_asset_payout_type,
              maturityDate: parseDate(selectedAsset.user_asset_maturity_date),
            });
            setMaturityCalculation(selectedAsset.user_asset_maturity_amount);
          } else if (assetType === "ppf") {
            let rawValue = selectedAsset.user_asset_maturity_amount;
            if (typeof rawValue === "string") {
              rawValue = rawValue.replace(/,/g, "");
            }
            const cleanValue = Number(rawValue);
            setFormData({
              ...formData,
              typeOfAsset: selectedAsset.asset_type_name_uuid,
              schemeName: selectedAsset.user_asset_name,
              govtSchemeMemberName: selectedAsset.user_asset_for,
              accountBalanceToday: selectedAsset.user_asset_current_amount,
              investmentAmountPerFrequency: selectedAsset.user_asset_investment_amount.toString(),
              asset_frequency: assetFrequency,
              expectedRateOfReturn: selectedAsset.user_asset_ror,
              maturityDate: parseDate(selectedAsset.user_asset_maturity_date),
            });
            setMaturityCalculation(cleanValue);
          } else if (assetType === "sukanya_samriddhi_yojana") {
            setFormData({
              ...formData,
              typeOfAsset: selectedAsset.asset_type_name_uuid,
              assetName: selectedAsset.user_asset_name,
              govtSchemeMemberName: selectedAsset.user_asset_for,
              accountBalanceToday: selectedAsset.user_asset_current_amount,
              investmentAmountPerFrequency: selectedAsset.user_asset_investment_amount.toString(),
              asset_frequency: assetFrequency,
              expectedRateOfReturn: selectedAsset.user_asset_ror,
              maturityDate: parseDate(selectedAsset.user_asset_maturity_date),
            });
            setMaturityCalculation(selectedAsset.user_asset_maturity_amount);
          } else if (assetType === "post_office_schemes") {

            setFormData({
              ...formData,
              typeOfAsset: selectedAsset.asset_type_name_uuid,
              govtSchemeMemberName: selectedAsset.user_asset_for,
              schemeName: selectedAsset.user_asset_name,
              purchaseDate: parseDate(selectedAsset.user_asset_purchase_date),
              investedAmount: selectedAsset.user_asset_investment_amount,
              expectedRateOfReturn: selectedAsset.user_asset_ror,
              payoutType: selectedAsset.user_asset_payout_type,
              maturityDate: parseDate(selectedAsset.user_asset_maturity_date),
            });
            setMaturityCalculation(selectedAsset.user_asset_maturity_amount);
          } else if (assetType === "government_schemes_others") {
            setFormData({
              ...formData,
              typeOfAsset: selectedAsset.asset_type_name_uuid,
              govtSchemeMemberName: selectedAsset.user_asset_for,
              purchaseDate: parseDate(selectedAsset.user_asset_purchase_date),
              purchaseAmount: selectedAsset.user_asset_investment_amount,
              interestRate: selectedAsset.user_asset_ror,
              payoutType: selectedAsset.user_asset_payout_type,
              maturityDate: parseDate(selectedAsset.user_asset_maturity_date),
            });
            setMaturityCalculation(selectedAsset.user_asset_maturity_amount);
          }

        }
      }
    } catch (e) {
      console.error("Error in fetchRealEstateData:", e);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Something went wrong while fetching data.",
          type: "error",
          autoClose: 3000,
        },
      });
    }
  };


  const UpdateGovScheme = async () => {
    try {

      var payload = {};
      var govtSchemeData = govtSchemePayload;

      payload["asset_id"] = assetEditId;
      payload["asset_name_uuid"] = govtSchemeData.asset_name_uuid;
      payload["asset_sub_name_uuid"] = govtSchemeData.asset_sub_name_uuid;
      payload["asset_type_name_uuid"] = formData.typeOfAsset;
      payload["user_asset_for"] = formData.govtSchemeMemberName;
      payload["user_asset_user_id"] = getUserId();
      payload["user_asset_current_amount"] = formData.accountBalanceToday;
      payload["user_asset_investment_amount"] = formData.investmentAmountPerFrequency;
      payload["user_asset_ror"] = formData.expectedRateOfReturn;
      payload["user_asset_maturity_date"] = formData?.maturityDate
        ? new Date(formData.maturityDate).toLocaleDateString("en-GB")
        : '';
      payload["user_asset_maturity_amount"] = maturityamount;
      payload["user_asset_automated_linkage"] = 0;
      let asset_name = "";
      var assetType = formData.typeOfAsset;
      if (assetType === "epf" || assetType === "nps") {
        asset_name = formData.bankInstituteName;
      } else if (assetType === "sukanya_samriddhi_yojana") {
        asset_name = formData.assetName;
      } else if (assetType === "nsc" || assetType === "post_office_schemes") {
        asset_name = formData.schemeName;
      } else if (assetType === "government_schemes_others") {
        asset_name = formData.assetName;
      } else if (assetType === "ppf") {
        asset_name = formData.schemeName;
      }
      payload["user_asset_name"] = asset_name;

      let asset_frequency = "";
      if (Number(formData.asset_frequency) === 1) {
        asset_frequency = "Monthly";
      } else if (Number(formData.asset_frequency) === 2) {
        asset_frequency = "Quarterly";
      } else if (Number(formData.asset_frequency) === 3) {
        asset_frequency = "Half Yearly";
      } else if (Number(formData.asset_frequency) === 4) {
        asset_frequency = "Yearly";
      }
      payload["user_asset_freq"] = asset_frequency;
      payload["user_asset_payout_type"] = formData.payoutType;
      payload["user_asset_purchase_date"] = formData.purchaseDate
        ? new Date(formData.purchaseDate).toLocaleDateString("en-GB")
        : '';

      if (assetType === "government_schemes_others") {
        payload["user_asset_ror"] = formData.interestRate;
      }

      if (assetType === "nsc") {
        payload["user_asset_investment_amount"] = formData.investedAmount;
      } else if (assetType === "ppf") {
        payload["user_asset_investment_amount"] = formData.investmentAmountPerFrequency;
      } else if (assetType === "post_office_schemes") {
        payload["user_asset_investment_amount"] = formData.investedAmount;
      } else if (assetType === "government_schemes_others") {
        payload["user_asset_investment_amount"] = formData.purchaseAmount;
      }

      var response = await updateUserAssetDetails(payload);

      if (response["status_code"] == "200") {
        if (id != undefined) {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Gov Scheme Updated Successfully!",
              type: "success",
            },
          });
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Gov Scheme Added Successfully!",
              type: "success",
            },
          });
        }

        navigate(
          process.env.PUBLIC_URL +
          "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=4"
        );
      }
    } catch (e) {
      console.log(e, ">>>>>>>>>");
    }
  };



  useEffect(() => {
    getBanks();
  }, []);


  const AddGovScheme = async () => {
    try {

      var payload = {};
      var govtSchemeData = govtSchemePayload;

      payload["asset_name_uuid"] = govtSchemeData.asset_name_uuid;
      payload["asset_sub_name_uuid"] = govtSchemeData.asset_sub_name_uuid;
      payload["asset_type_name_uuid"] = formData.typeOfAsset;
      payload["user_asset_for"] = formData.govtSchemeMemberName;
      payload["user_asset_user_id"] = getUserId();
      payload["user_asset_current_amount"] = formData.accountBalanceToday;
      payload["user_asset_investment_amount"] = formData.investmentAmountPerFrequency;
      payload["user_asset_ror"] = formData.expectedRateOfReturn;
      payload["user_asset_maturity_date"] = formData?.maturityDate
        ? new Date(formData.maturityDate).toLocaleDateString("en-GB")
        : '';
      payload["user_asset_maturity_amount"] = maturityamount;
      payload["user_asset_automated_linkage"] = 0;
      let asset_name = "";
      var assetType = formData.typeOfAsset;

      if (assetType === "epf" || assetType === "nps") {
        asset_name = formData.bankInstituteName;
      } else if (assetType === "sukanya_samriddhi_yojana") {
        asset_name = formData.assetName;
      } else if (assetType === "nsc" || assetType === "post_office_schemes") {
        asset_name = formData.schemeName;
      } else if (assetType === "government_schemes_others") {
        asset_name = formData.assetName;
      } else if (assetType === "ppf") {
        asset_name = formData.schemeName;
      }
      payload["user_asset_name"] = asset_name;

      let asset_frequency = "";
      if (Number(formData.asset_frequency) === 1) {
        asset_frequency = "Monthly";
      } else if (Number(formData.asset_frequency) === 2) {
        asset_frequency = "Quarterly";
      } else if (Number(formData.asset_frequency) === 3) {
        asset_frequency = "Half Yearly";
      } else if (Number(formData.asset_frequency) === 4) {
        asset_frequency = "Yearly";
      }
      payload["user_asset_freq"] = asset_frequency;
      payload["user_asset_payout_type"] = formData.payoutType;
      payload["user_asset_purchase_date"] = formData.purchaseDate
        ? new Date(formData.purchaseDate).toLocaleDateString("en-GB")
        : '';

      if (assetType === "government_schemes_others") {
        payload["user_asset_ror"] = formData.interestRate;
      }

      if (assetType === "nsc") {
        payload["user_asset_investment_amount"] = formData.investedAmount;
      } else if (assetType === "ppf") {
        payload["user_asset_investment_amount"] = formData.investmentAmountPerFrequency;
      } else if (assetType === "post_office_schemes") {
        payload["user_asset_investment_amount"] = formData.investedAmount;
      } else if (assetType === "government_schemes_others") {
        payload["user_asset_investment_amount"] = formData.purchaseAmount;
      }

      var response = await saveUserAssetDetails(payload);

      if (response["status_code"] == "200") {
        if (id != undefined) {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Gov Scheme Updated Successfully!",
              type: "success",
            },
          });
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Gov Scheme Added Successfully!",
              type: "success",
            },
          });
        }

        navigate(
          process.env.PUBLIC_URL +
          "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=4"
        );
      }
    } catch (e) {
      console.log(e, ">>>>>>>>>");
    }
  };

  const getBanks = async () => {
    try {
      const bankResp = await GetBankList();
      setAllBank(bankResp.data);
    } catch (e) {
      console.log(e);
    }
  };

  const onInputChange = (e, isNumeric) => {
    const name = e.target.name;
    let value = e.target.value;

    if (isNumeric) {
      const rawValue = value.replace(/,/g, "");
      if (!numericRegex.test(rawValue) && rawValue !== "") {
        return;
      }
      value = rawValue;
    }

    setFormData({ ...formData, [name]: value });
  };


  const onDateAndSelectInputChange = (name, value) => {
    return setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {

    const isValid = simpleValidator.current.allValid();

    if (isValid == true) {
      AddGovScheme();
    }
    simpleValidator.current.showMessages();
    forceUpdate(1);
  };

  const getGoldTypeData = (goldTypeData, label) => {
    return goldTypeData.find((data) => data.value === label);
  };

  const handleGOvtSchemeMember = (selectedOption) => {
    setFormData({
      ...formData,
      govtSchemeMemberName: selectedOption.value,
    });
  };

  const emptystates = () => {
    setFormData((prevformData) => ({
      ...prevformData,
      maturityDate: "",
      investmentAmountPerFrequency: "",
      interestRate: 0,
      accountBalanceToday: "",
      investmentDate: "",
      bankInstituteName: "",
      expectedRateOfReturn: 0,
      schemeName: "",
      purchaseDate: "",
    }));
  };


  simpleValidator.current.purgeFields();

  const customStyles = {
    option: (base, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...base,
        backgroundColor: "#ffff",
        color: isFocused ? "#042b62" : isSelected ? "#042b62" : "gray",
        cursor: "pointer",
      };
    },
    menuList: (base) => ({
      ...base,
      overflowY: "scroll",
      scrollBehavior: "smooth",
      "::-webkit-scrollbar": {
        width: "4px",
        height: "0px",
      },
      "::-webkit-scrollbar-track": {
        background: "#fff",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#042b62",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555",
      },
    }),
  };

  return (
    <>
      <div className="px-0 px-md-4 assetForm">
        <div
          className="p-3"
          style={{ border: "1px solid #d8d8d8", borderRadius: 10 }}
        >
          {updateForm ? (
            <div className="d-flex">
              <a href={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard?assetTabNumber=4`}>
                <img
                  style={{
                    transform: "rotate(180deg)",
                  }}
                  width={20}
                  height={20}
                  src={process.env.PUBLIC_URL + "/static/media/icons/chevron.svg"}
                />
              </a>
              <h3
                className="text-center pb-0 mb-0 ps-2"
                style={{
                  flexGrow: 1,
                }}
              >
                Edit Your Government Schemes Assets
              </h3>
            </div>
          ) : (
            <div className="d-flex">
              <a href={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard?assetTabNumber=4`}>
                <img
                  style={{
                    transform: "rotate(180deg)",
                  }}
                  width={20}
                  height={20}
                  src={process.env.PUBLIC_URL + "/static/media/icons/chevron.svg"}
                />
              </a>
              <h3
                className="text-center pb-0 mb-0 ps-2"
                style={{
                  flexGrow: 1,
                }}
              >
                Add Your Government Schemes Assets
              </h3>
            </div>
          )}
          <hr style={{ color: "#afafaf" }} />
          <div className="row">
            <div className="col-12 col-md-11 col-lg-8 m-auto">
              {addForm && (
                <p className="text-center">
                  Enter Your Details To Add Government Schemes Assets
                </p>
              )}

              {updateForm && (
                <p className="text-center">
                  Enter Your Details To Edit Government Schemes Assets
                </p>
              )}
              <br />
              <br />
              <div>
                <div className="my-md-4">
                  <div className="">
                    <span className="lbl-newbond">Select Type Of Asset *</span>
                    <br />
                    <Select
                      className={`fnto-dropdown-react ${id ? "disabled" : ""}`}
                      classNamePrefix=" sortSelect"
                      isSearchable={false}
                      options={govtSchemesOptions}
                      styles={customStyles}
                      name="typeOfAsset"
                      value={getGoldTypeData(options, formData.typeOfAsset)}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          typeOfAsset: e.value,
                          assetName: e.label,
                        }));
                        emptystates();
                      }}
                    />
                    {simpleValidator.current.message(
                      "typeOfAsset",
                      formData.typeOfAsset,
                      "required"
                    )}
                  </div>
                </div>

                <div
                  className="row"
                  style={{ display: "flex", flexWrap: "wrap" }}
                >
                  <>
                    {isInputInPolicy(
                      "bankInstituteName",
                      formData.typeOfAsset
                    ) && (
                        <div className="col-md-12 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Select Bank Institute Name *
                              </span>
                              <br />
                              <Select
                                className="fnto-dropdown-react"
                                styles={customStyles}
                                classNamePrefix=" sortSelect"
                                isSearchable={true}
                                options={allBank?.map((v) => ({
                                  label: v.bank_name,
                                  value: v.bank_name,
                                }))}
                                value={
                                  allBank?.filter(
                                    (v) =>
                                      v.bank_name == formData.bankInstituteName
                                  )
                                    .map((v) => ({
                                      label: v.bank_name,
                                      value: v.bank_name,
                                    }))[0] ?? null
                                }
                                // name={selectedOption}
                                name="bankInstituteName"
                                onChange={(e) =>
                                  onDateAndSelectInputChange(
                                    "bankInstituteName",
                                    e.label
                                  )
                                }
                              />
                              {simpleValidator.current.message(
                                "bankInstituteName",
                                formData.bankInstituteName,
                                "required"
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    <div className="my-md-4">
                      <div className="">
                        <span className="lbl-newbond">
                          Who Is This Investment For*
                        </span>
                        <br />
                        <Select
                          className={`fnto-dropdown-react`}
                          classNamePrefix="sortSelect"
                          isSearchable={false}
                          styles={customStyles}
                          options={familyData}
                          name="govtSchemeMemberName"
                          onChange={handleGOvtSchemeMember}
                          value={familyData.find((v) => v.value === formData.govtSchemeMemberName)}
                        />

                        {simpleValidator.current.message(
                          "govtSchemeMemberName",
                          formData.govtSchemeMemberName,
                          "required"
                        )}
                      </div>
                    </div>

                    {isInputInPolicy(
                      "dateOfInvestment",
                      formData.typeOfAsset
                    ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Date Of Investment *
                              </span>
                              <br />

                              <div className="bonds-datepicker">
                                <FintooDatePicker
                                  dateFormat="dd/MM/yyyy"
                                  selected={
                                    formData.dateOfInvestment === ""
                                      ? ""
                                      : new Date(formData.dateOfInvestment)
                                  }
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  name="dateOfInvestment"
                                  customClass="datePickerDMF"
                                  onChange={(e) =>
                                    onDateAndSelectInputChange(
                                      "dateOfInvestment",
                                      formatDatefun(e)
                                    )
                                  }
                                />
                              </div>
                              {simpleValidator.current.message(
                                "dateOfInvestment",
                                formData.dateOfInvestment,
                                "required"
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    {isInputInPolicy("schemeName", formData.typeOfAsset) && (
                      <div className="col-md-12 col-12">
                        <div className="my-md-4">
                          <div className="">
                            <span className="lbl-newbond">Scheme Name *</span>
                            <br />
                            <input
                              placeholder="Enter Your Scheme Name Here"
                              className={` w-100 fntoo-textbox-react inputPlaceholder`}
                              type="text"
                              value={formData.schemeName}
                              name="schemeName"
                              onChange={onInputChange}
                            />
                          </div>
                          {simpleValidator.current.message(
                            "schemeName",
                            formData.schemeName,
                            "required"
                          )}
                        </div>
                      </div>
                    )}

                    {formData.typeOfAsset === "Sukanya Samriddhi Yojana"
                      ? ""
                      : isInputInPolicy(
                        "investmentDate",
                        formData.typeOfAsset
                      ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Date Of Investment *
                              </span>
                              <br />
                              <div className="bonds-datepicker">
                                <FintooDatePicker
                                  // dateFormat="yyyy/MM/dd"
                                  dateFormat="dd/MM/yyyy"
                                  selected={
                                    formData.investmentDate === ""
                                      ? ""
                                      : new Date(formData.investmentDate)
                                  }
                                  showMonthDropdown
                                  showYearDropdown
                                  maxDate={new Date()}
                                  dropdownMode="select"
                                  name="investmentDate"
                                  customClass="datePickerDMF"
                                  onChange={(e) =>
                                    onDateAndSelectInputChange(
                                      "investmentDate",
                                      formatDatefun(e)
                                    )
                                  }
                                />
                              </div>
                              {simpleValidator.current.message(
                                "investmentDate",
                                formData.investmentDate,
                                "required"
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    {isInputInPolicy(
                      "accountBalanceToday",
                      formData.typeOfAsset
                    ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Account Balance Today *
                              </span>
                              <br />
                              <input
                                placeholder="Enter a/c Bal on Today"
                                className="w-100 fntoo-textbox-react Rupee-icon inputPlaceholder"
                                type="text"
                                value={formatWithIndianCommas(formData.accountBalanceToday)}
                                maxLength={10}
                                name="accountBalanceToday"
                                onChange={(e) => {
                                  const rawValue = e.target.value.replace(/,/g, "");
                                  if (!isNaN(rawValue)) {
                                    onInputChange({
                                      target: {
                                        name: "accountBalanceToday",
                                        value: rawValue
                                      }
                                    }, true);
                                  }
                                }}
                              />

                              {simpleValidator.current.message(
                                "accountBalanceToday",
                                formData.accountBalanceToday,
                                "required|numeric|min:1,num"
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    {isInputInPolicy(
                      "investmentAmountPerFrequency",
                      formData.typeOfAsset
                    ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Investment Amount (Per Frequency) *
                              </span>
                              <br />
                              <input
                                placeholder="Enter Amount"
                                className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                                type="text"
                                maxLength={10}
                                value={formatWithIndianCommas(formData.investmentAmountPerFrequency)}
                                name="investmentAmountPerFrequency"
                                // onChange={(e) => onInputChange(e, true)}
                                onChange={(e) => {
                                  onInputChange(e, true);
                                }}
                              />
                              {simpleValidator.current.message(
                                "investmentAmountPerFrequency",
                                formData.investmentAmountPerFrequency,
                                "required|numeric|min:1,num"
                              )}
                            </div>
                            <div className="fnto-bonds-tags">
                              <div
                                className={
                                  formData?.asset_frequency == "1" ? "active" : ""
                                }
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    asset_frequency: "1",
                                  }))
                                }
                              >
                                <p>Monthly</p>
                              </div>
                              <div
                                className={
                                  formData?.asset_frequency == "2" ? "active" : ""
                                }
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    asset_frequency: "2",
                                  }))
                                }
                              >
                                <p>Quarterly</p>
                              </div>
                              <div
                                className={
                                  formData?.asset_frequency == "3" ? "active" : ""
                                }
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    asset_frequency: "3",
                                  }))
                                }
                              >
                                <p>Semi Anually</p>
                              </div>
                              <div
                                className={
                                  formData?.asset_frequency == "4" ? "active" : ""
                                }
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    asset_frequency: "4",
                                  }))
                                }
                              >
                                <p>Anually</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    {isInputInPolicy("purchaseDate", formData.typeOfAsset) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div className="">
                            <span className="lbl-newbond">Purchase Date *</span>
                            <br />
                            <div className="bonds-datepicker">
                              <FintooDatePicker
                                maxDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                                selected={
                                  formData.purchaseDate === ""
                                    ? ""
                                    : new Date(formData.purchaseDate)
                                }
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                name="purchaseDate"
                                customClass="datePickerDMF"
                                onChange={(e) =>
                                  onDateAndSelectInputChange(
                                    "purchaseDate",
                                    formatDatefun(e)
                                  )
                                }
                              />
                            </div>
                            {simpleValidator.current.message(
                              "purchaseDate",
                              formData.purchaseDate,
                              "required"
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {isInputInPolicy(
                      "purchaseAmount",
                      formData.typeOfAsset
                    ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Purchase Amount *
                              </span>
                              <br />
                              <div className="bonds-datepicker">
                                <input
                                  placeholder="Enter Investment Amount"
                                  className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                                  type="text"
                                  value={formatWithIndianCommas(formData.purchaseAmount)}
                                  name="purchaseAmount"
                                  maxLength={10}
                                  onChange={(e) => onInputChange(e, true)}
                                />
                              </div>
                              {simpleValidator.current.message(
                                "purchaseAmount",
                                formData.purchaseAmount,
                                "required|numeric|min:1,num"
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    {isInputInPolicy(
                      "investedAmount",
                      formData.typeOfAsset
                    ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Invested Amount*
                              </span>
                              <br />
                              <input
                                placeholder="Enter Investment Amount"
                                className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                                type="text"
                                value={formatWithIndianCommas(formData.investedAmount)}
                                name="investedAmount"
                                maxLength={10}
                                onChange={(e) => onInputChange(e, true)}
                              />
                              {simpleValidator.current.message(
                                "investedAmount",
                                formData.investedAmount,
                                "required|numeric|min:1,num"
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    {isInputInPolicy(
                      "investmentAmount",
                      formData.typeOfAsset
                    ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Investment Amount*
                              </span>
                              <br />
                              <input
                                placeholder="Enter Investment Amount"
                                className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                                type="text"
                                value={formatWithIndianCommas(formData.investmentAmount)}
                                name="investmentAmount"
                                // onChange={(e) => onInputChange(e, true)}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (value > 0 || e.target.value === "") {
                                    // Accepts positive values or empty string
                                    onInputChange(e, true);
                                  }
                                }}
                              />
                              {simpleValidator.current.message(
                                "investmentAmount",
                                formData.investmentAmount,
                                "required|numeric|min:1,num"
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    {isInputInPolicy("interestRate", formData.typeOfAsset) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">Interest Rate *</span>
                            <br />
                            <FormRangeSlider
                              x={formData.interestRate}
                              min={0}
                              max={20}
                              step={0.1}
                              onChange={(x) => {
                                onDateAndSelectInputChange(
                                  "interestRate",
                                  Math.round(x * 100) / 100
                                );
                              }}
                            />
                          </div>
                        </div>
                        {simpleValidator.current.message(
                          "interestRate",
                          formData.interestRate,
                          "required"
                        )}
                      </div>
                    )}
                    {isInputInPolicy(
                      "expectedRateOfReturn",
                      formData.typeOfAsset
                    ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div>
                              <span className="lbl-newbond">
                                Expected Rate Of Return *
                              </span>
                              <p className="mb-0" style={{ height: "8px" }}>
                                &nbsp;
                              </p>
                              <FormRangeSlider
                                x={formData.expectedRateOfReturn}
                                min={0}
                                max={20}
                                step={0.1}
                                onChange={(x) => {
                                  onDateAndSelectInputChange(
                                    "expectedRateOfReturn",
                                    Math.round(x * 100) / 100
                                  );
                                }}
                              />
                            </div>
                          </div>
                          {/* {simpleValidator.current.message('expectedRateOfReturn', formData.expecteinterestRatedRateOfReturn, 'required')} */}
                        </div>
                      )}
                    {isInputInPolicy("payoutType", formData.typeOfAsset) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div className="">
                            <span className="lbl-newbond">Payout Type*</span>
                            <br />
                            <Select
                              className="fnto-dropdown-react"
                              classNamePrefix=" sortSelect"
                              isSearchable={false}
                              styles={customStyles}
                              options={options_payout}
                              name="payoutType"
                              value={getGoldTypeData(
                                options_payout,
                                formData.payoutType
                              )}
                              onChange={(e) =>
                                onDateAndSelectInputChange(
                                  "payoutType",
                                  e.label
                                )
                              }
                            />
                            {simpleValidator.current.message(
                              "payoutType",
                              formData.payoutType,
                              "required"
                            )}
                          </div>
                          {formData.payoutType === "Non-Cumulative" && (
                            <>
                              <div className="fnto-bonds-tags">
                                <div
                                  className={
                                    formData?.asset_frequency == 1
                                      ? "active"
                                      : ""
                                  }
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      asset_frequency: 1,
                                    }))
                                  }
                                >
                                  <p>Monthly</p>
                                </div>
                                <div
                                  className={
                                    formData?.asset_frequency == 2
                                      ? "active"
                                      : ""
                                  }
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      asset_frequency: 2,
                                    }))
                                  }
                                >
                                  <p>Quarterly</p>
                                </div>
                                <div
                                  className={
                                    formData?.asset_frequency == 3
                                      ? "active"
                                      : ""
                                  }
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      asset_frequency: 3,
                                    }))
                                  }
                                >
                                  <p>Semi Anually</p>
                                </div>
                                <div
                                  className={
                                    formData?.asset_frequency == 4
                                      ? "active"
                                      : ""
                                  }
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      asset_frequency: 4,
                                    }))
                                  }
                                >
                                  <p>Anually</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}


                    {isInputInPolicy(
                      "maturityDate",
                      formData.typeOfAsset
                    ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Maturity Date *
                              </span>
                              <br />
                              <div className="bonds-datepicker">
                                <FintooDatePicker
                                  minDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  selected={
                                    formData.maturityDate === ""
                                      ? ""
                                      : new Date(formData.maturityDate)
                                  }
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  name="maturityDate"
                                  customClass="datePickerDMF"
                                  onChange={(e) =>
                                    onDateAndSelectInputChange(
                                      "maturityDate",
                                      formatDatefun(e)
                                    )
                                  }
                                  onKeyDown={(e) => e.preventDefault()}
                                />
                              </div>
                              {simpleValidator.current.message(
                                "maturityDate",
                                formData.maturityDate,
                                "required"
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    {isInputInPolicy(
                      "maturityAmount",
                      formData.typeOfAsset
                    ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Maturity Amount *
                              </span>
                              <br />
                              <input
                                placeholder=" Maturity Amount Auto calculated"
                                className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder disabled`}
                                type="text"
                                value={formatWithIndianCommas(maturityamount)}
                                name="maturityAmount"
                                onChange={(e) => onInputChange(e, true)}
                              />
                              {/* {simpleValidator.current.message('maturityAmount', formData.maturityAmount, 'required|numeric')} */}
                            </div>
                          </div>
                        </div>
                      )}
                  </>
                </div>

                <div className="my-md-4">
                  {addForm && (
                    <div className="my-md-4">
                      <button
                        type="submit"
                        className="d-block m-auto btn btn-primary"
                        onClick={() => validateForm()}
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {updateForm && (
                    <div>
                      <button
                        type="submit"
                        className="d-block m-auto btn btn-primary"
                        onClick={() => UpdateGovScheme()}
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NewGovtSchemesView;
