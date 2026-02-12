import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import FintooLoader from "../../../../components/FintooLoader";
import FormRadioComponent from "../CommonDashboardComponents/FormRadioComponent";
import { formatDatefun } from "../../../../Utils/Date/DateFormat";
import {
  apiCall,
  fetchEncryptData,
  getFpUserDetailsId,
  getItemLocal,
  getParentUserId,
  getUserId,
} from "../../../../common_utilities";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";
import apiClient from '../../../../FrappeIntegration-Services/services/apiClient';
import { getFamilyMember } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { getOtherInvestments, saveUserAssetDetails, updateUserAssetDetails } from "../../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { getAssetCategoryList } from "../../../../FrappeIntegration-Services/services/financial-planning-api/asset";
import { DATA_BELONGS_TO } from "../../../../constants";

const numericRegex = new RegExp(/^\d*\.?\d*$/);

const realEastateInputs = {
  "agriculture_land": [
    "nameOfProperty",
    "purchaseDate",
    "purchaseValue",
    "currentValue",
    "pincode",
    "residentialType",
    "mortgageOrFreehold",
    "cityType",
  ],
  "commercial": [
    "nameOfProperty",
    "purchaseDate",
    "purchaseValue",
    "currentValue",
    "pincode",
    "residentialType",
    "mortgageOrFreehold",
    "cityType",
  ],
  "residential_premises": [
    "nameOfProperty",
    "purchaseDate",
    "purchaseValue",
    "currentValue",
    "pincode",
    "residentialType",
    "mortgageOrFreehold",
    "cityType",
  ],
  "reits": [
    "nameOfProperty",
    "purchaseDate",
    "purchaseValue",
    "currentValue",
    "pincode",
    "residentialType",
    "mortgageOrFreehold",
    "cityType",
  ],
  "land": [
    "nameOfProperty",
    "purchaseDate",
    "purchaseValue",
    "currentValue",
    "pincode",
    "residentialType",
    "mortgageOrFreehold",
    "cityType",
  ],
};

const defaultAssetDetails = {
  user_asset_name: "",
  asset_type_name_uuid: "",
  user_asset_for: "",
  user_asset_automated_linkage: 0,
  user_asset_user_id: "",
  user_asset_pincode: "",
  user_asset_property_type: "Self-Occupied",
  user_asset_ownership: "Free Hold",
  user_asset_allocation: 0,
  user_asset_currency: "INR"
}

const options_type_of_real_estate = [
  { label: "Agriculture Land", value: "agriculture_land" },
  { label: "Commercial", value: "commercial" },
  { label: "Residential Premises", value: "residential_premises" },
  { label: "REITS", value: "reits" },
  { label: "Land", value: "land" }
];


const options_residental_type_radio = [
  { text: "Self-Occupied", name: "residentialType", id: "Self-Occupied" },
  { text: "Rented", name: "residentialType", id: "Rented" },
];

const options_mortgage_or_freehold = [
  { text: "Free Hold", name: "mortgageOrFreehold", id: "Free Hold" },
  { text: "Mortgage", name: "mortgageOrFreehold", id: "Mortgage" },
];

const options_city_type = [
  { text: "Tier 1", name: "cityType", id: "Tier 1" },
  { text: "Tier 2", name: "cityType", id: "Tier 2" },
  { text: "Tier 3", name: "cityType", id: "Tier 3" },
];

const initialValues = {
  typeOfProperty: "",
  realEstatMembername:"",
  nameOfProperty: "",
  purchaseDate: "",
  purchaseValue: "",
  currentValue: "",
  pincode: "",
  residentialType: "Self-Occupied",
  mortgageOrFreehold: "Free Hold",
  cityType: "Tier 1",
};

function isInputInPolicy(inputName, policyType) {
  if (typeof policyType === "object" && policyType?.value) {
    policyType = policyType.value;
  }

  if (typeof policyType === "string") {
    let lowercasePolicyType = policyType.toLowerCase();

    if (!policyType) {
      lowercasePolicyType = "agriculture_land";
    }

    if(lowercasePolicyType.includes(" ")){
      lowercasePolicyType = lowercasePolicyType.replace(/ /g, "_");
    }

    return (
      realEastateInputs[lowercasePolicyType] &&
      realEastateInputs[lowercasePolicyType].includes(inputName)
    );
  } else if (typeof policyType === "number") {
    return (
      realEastateInputs[policyType] &&
      realEastateInputs[policyType].includes(input )
    );
  }

  return false;
}

const NewRealEstateFormView = () => {
  const [, forceUpdate] = useState();
  const [formData, setFormData] = useState(initialValues);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [familyData, setFamilyData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assetsDetails, setAssetsDetails] = useState(defaultAssetDetails);
  const [assetForMember, setAssetForMember] = useState("");
  const [updateForm, setUpdateForm] = useState(false);
  const [addForm, setAddForm] = useState(true);
  const [assetEditId, setAssetEditId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [realEstateData, editRealEstateData] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let asset_id = urlParams.get("id");

    if (asset_id) {
      setUpdateForm(true);
      setAddForm(false);
      setAssetEditId(asset_id);
      getFamilyMembers(true);
      fetchRealEstateData(asset_id);
    } else {
      getFamilyMembers();
    }
  }, []);

  const getFamilyMembers = async (isEdit = false) => {
    try {
      const member_data = await getFamilyMember(getUserId());

      if (member_data.status_code === "200" && member_data.data?.length) {
        const members = member_data.data;

        const memberArray = [];
        const filterMember = [];

        const selfMember = members.find(
          (m) => m.relation_id === 1 || m.relation === "Self"
        );
        if (selfMember) {
          const selfData = {
            value: selfMember.user_id,
            label: "Self",
            dob: selfMember.dob,
            life_expectancy: selfMember.life_expectancy_age,
            isdependent: selfMember.is_dependent,
          };
          memberArray.push(selfData);
          filterMember.push({ value: selfMember.user_id, label: "Self" });
        }

        memberArray.push({ value: 0, label: "Family" });
        filterMember.push({ value: 0, label: "Family" });

        members.forEach((member) => {
          if (member.user_id === selfMember?.user_id) return;
          const label = member.user_name ?? member.user_email;
          memberArray.push({
            value: member.user_id,
            label,
            dob: member.dob,
            life_expectancy: member.life_expectancy_age,
            isdependent: member.is_dependent,
          });
          filterMember.push({ value: member.user_id, label });
        });

        setFamilyData(memberArray);
        setMemberData(filterMember);

        if (!isEdit && selfMember) {
          setFormData((prev) => ({
            ...prev,
            realEstatMembername: selfMember.user_id,
          }));
          setAssetsDetails((prev) => ({
            ...prev,
            asset_member_id: selfMember.user_id,
          }));
        }
      } else {
        setFamilyData([]);
        setMemberData([]);
      }
    } catch (error) {
      setFamilyData([]);
      setMemberData([]);
      console.error("Error fetching family members:", error);
    }
  };

  const simpleValidator = useRef(new SimpleReactValidator());

  const onInputChange = (e, isNumeric = false) => {
    const name = e.target.name;
    let value = e.target.value;

    if (isNumeric) {
      const rawValue = value.replace(/,/g, "");

      if (!numericRegex.test(rawValue) && rawValue !== "") {
        return;
      }
      setFormData({
        ...formData,
        [name]: rawValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const onDateAndSelectInputChange = (name, value) => {
    if (name === "typeOfProperty") {
      setFormData({
        ...formData,
        typeOfProperty: value.value,
        typeOfPropertyName: value.label
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRealEstateMember = (selectedOption) => {
    setFormData({
      ...formData,
      realEstatMembername: selectedOption.value,
    });
  };
  const validateForm = () => {
    simpleValidator.current.showMessages();
    forceUpdate(1);
    if (simpleValidator.current.allValid() == true) {
      addRealEstate();
    }
  };


  const getRealEstateTypeValue = (insuranceTypeData, value) => {
    const result = insuranceTypeData.find((data) => data.value === value);
    return result;
  }

  simpleValidator.current.purgeFields();

  useEffect(() => {
    const fetchCategories = async () => {
      try {

        const asset_category = await getAssetCategoryList();

        const categoryList = asset_category?.data?.[0]?.category_list || [];

        const realEstateCategory = categoryList.find(
          (cat) => cat.asset_name === "Real Estate"
        );
        setCategories(realEstateCategory);

      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  function getSelectedAssetObject(selectedName) {

    for (let sub of categories.subcategories) {
      for (let type of sub.asset_types) {
        if (type.asset_type_name === selectedName) {
          return {
            asset_id: categories.asset_id,
            asset_name: categories.asset_name,
            asset_name_uuid: categories.asset_name_uuid,
            asset_sub_id: sub.asset_sub_id,
            asset_sub_name: sub.asset_sub_name,
            asset_sub_name_uuid: sub.asset_sub_name_uuid,
            asset_type_id: type.asset_type_id,
            asset_type_name_uuid: type.asset_type_name_uuid,
            asset_type_name: type.asset_type_name
          };
        }
      }

      // Case 2: check subcategory (only if no type matched)
      if (sub.asset_sub_name === selectedName) {
        return {
          asset_id: categories.asset_id,
          asset_name: categories.asset_name,
          asset_name_uuid: categories.asset_name_uuid,
          asset_sub_id: sub.asset_sub_id,
          asset_sub_name: sub.asset_sub_name,
          asset_sub_name_uuid: sub.asset_sub_name_uuid,
          asset_type_id: "",
          asset_type_name_uuid: "",
          asset_type_name: ""
        };
      }
    }

    // If nothing matches, return everything empty
    return {
      asset_id: "",
      asset_name: "",
      asset_name_uuid: "",
      asset_sub_id: "",
      asset_sub_name: "",
      asset_sub_name_uuid: "",
      asset_type_id: "",
      asset_type_name_uuid: "",
      asset_type_name: ""
    };
  }


  const getCityTypeText = (id) => {
    const match = options_city_type.find((opt) => opt.id === id);
    return match?.text || "";
  };

  function formatDateToDDMMYYYY(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

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


  const addRealEstate = async () => {
    let realEstateData = assetsDetails;

    const result = getSelectedAssetObject(formData?.typeOfPropertyName);

    if (result.asset_id !== "") {
      realEstateData["user_asset_name"] = formData.nameOfProperty;
      realEstateData["asset_type_name_uuid"] = result.asset_type_name_uuid;
      realEstateData["asset_sub_name_uuid"] = result.asset_sub_name_uuid;
    }

    let assetContext = "Individual";
    if(formData.realEstatMembername === 0){
      assetContext = "Family"
    }
    realEstateData["user_asset_currency"] = "INR";
    realEstateData['user_asset_purchase_date'] = formData?.purchaseDate
      ? new Date(formData.purchaseDate).toLocaleDateString("en-GB")
      : '';
    realEstateData["user_asset_investment_amount"] = formData.purchaseValue
    realEstateData["user_asset_current_amount"] = formData.currentValue
    realEstateData['user_asset_pincode'] = formData.pincode;
    realEstateData['user_asset_property_type'] = formData.residentialType;
    realEstateData["user_asset_ownership"] = formData.mortgageOrFreehold;
    realEstateData["user_asset_belongs_to"] = DATA_BELONGS_TO;
    realEstateData['user_asset_for'] = formData.realEstatMembername;
    realEstateData['user_asset_user_id'] = getUserId();
    realEstateData["user_asset_context"] = assetContext;
    realEstateData["user_asset_city_type"] = formData.cityType;
    realEstateData["asset_name_uuid"] = "real_estate";

    var asset_sub_name_uuid = "";
    var asset_type_name_uuid = "";
    if(formData.typeOfProperty === "residential_premises" || formData.typeOfProperty === "commercial" || formData.typeOfProperty === "reits"){
      asset_sub_name_uuid = formData.typeOfProperty;
    } else if(formData.typeOfProperty === "agriculture_land" || formData.typeOfProperty === "land"){
      asset_type_name_uuid = formData.typeOfProperty;
    }

    const resp = await saveUserAssetDetails(realEstateData);

    if (resp.status_code == 200) {
      navigate(
        process.env.PUBLIC_URL +
        "/direct-mutual-fund/portfolio/dashboard?realestate=1"
      );
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Data added successfully.", type: "success", autoClose: 3000 }
      });
    } else {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went wrong, try again later.", type: "error", autoClose: 3000 }
      });
    }
  }

  const updateRealEstateAsset = () => {
    if (
      simpleValidator.current.allValid() ) {
      updateRealEstate();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate((v) => ++v);
    }
  };

  const updateRealEstate = async () => {
    let realEstateData = assetsDetails;

    const result = getSelectedAssetObject(formData?.typeOfPropertyName);

    if (assetEditId !== "") {
      realEstateData["asset_type_name_uuid"] = result.asset_type_name_uuid;
      realEstateData["user_asset_name"] = formData.nameOfProperty;
      realEstateData["asset_cat_id"] = result.asset_id;
      realEstateData["user_asset_type_id"] = result.asset_type_id;
      realEstateData["asset_sub_cat_id"] = result.asset_sub_id;
      realEstateData["asset_sub_name_uuid"] = result.asset_sub_name_uuid;
      realEstateData["asset_name_uuid"] = result.asset_name_uuid;
      realEstateData["asset_id"] = assetEditId;
    }

    realEstateData['user_asset_for'] = formData.realEstatMembername;
    realEstateData['user_asset_user_id'] = getUserId();
    realEstateData['user_asset_current_amount'] = formData.currentValue;
    realEstateData['user_asset_ownership'] = formData.mortgageOrFreehold;
    realEstateData['user_asset_pincode'] = formData.pincode;
    realEstateData["user_asset_investment_amount"] = formData.purchaseValue;
    realEstateData["user_asset_avg_purchase_price"] = formData.purchaseValue;
    realEstateData['user_asset_property_type'] = formData.residentialType;
    realEstateData["user_asset_city_type"] = getCityTypeText(formData.cityType);

    realEstateData["user_asset_purchase_date"] = formData.purchaseDate
      ? formatDateToDDMMYYYY(formData.purchaseDate)
      : null;

    const resp = await updateUserAssetDetails(realEstateData);

    if (resp.status_code == 200) {
      navigate(
        process.env.PUBLIC_URL +
        "/direct-mutual-fund/portfolio/dashboard?realestate=1"
      );
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Data updated successfully!", type: "success", autoClose: 3000 },
      });
    } else {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went wrong, try again later.", type: "error", autoClose: 3000 },
      });
    }
  }

  const fetchRealEstateData = async (id) => {
    try {
      let payload_data =  {
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
          const propertyTypeValue = selectedAsset.asset_sub_name_uuid || selectedAsset.asset_type_name_uuid || "";
          const propertyTypeLabel =
            options_type_of_real_estate.find(opt => opt.value === propertyTypeValue)?.label || "";

          let memberValue = selectedAsset.asset_member_id ?? selectedAsset.user_asset_for;

          if (memberValue === null || memberValue === undefined) {
            memberValue = getUserId();
          }

          setFormData({
            ...formData,
            nameOfProperty: selectedAsset.user_asset_name,
            typeOfProperty: propertyTypeValue,
            typeOfPropertyName: propertyTypeLabel,
            realEstatMembername: memberValue,
            purchaseValue: selectedAsset.total_invested_amount,
            avgbuyPrice: selectedAsset.user_asset_current_amount,
            assetcurrency: selectedAsset.user_asset_currency === "INR",
            purchaseDate: parseDate(selectedAsset.user_asset_purchase_date),
            sipenddate: parseDate(selectedAsset.user_asset_end_date),
            sipamount: selectedAsset.user_asset_sip_amount,
            noofShares: selectedAsset.user_asset_quantity,
            currentValue: selectedAsset.user_asset_current_amount,
            asset_name_uuid: selectedAsset.asset_name_uuid,
            asset_sub_name_uuid: selectedAsset.asset_sub_name_uuid,
            user_asset_automated_linkage: selectedAsset.user_asset_automated_linkage,
            pincode: selectedAsset.user_asset_pincode,
            residentialType: selectedAsset.user_asset_property_type,
            mortgageOrFreehold: selectedAsset.user_asset_ownership,
            cityType: selectedAsset.user_asset_city_type
          });
        }
      }
    } catch (e) {
      console.error("Error in fetchRealEstateData:", e);
      setFormData(initialValues);
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

  // Select Options Styles
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
      <FintooLoader isLoading={isLoading} />
      <div className="px-0 px-md-4 assetForm">
        <div
          className="p-3"
          style={{ border: "1px solid #d8d8d8", borderRadius: 10 }}
        >
          {updateForm ? (
            <div className="d-flex">
              <a href={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard?assetTabNumber=5`}>
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
                Edit Your Real Estate
              </h3>
            </div>
          ) : (
            <div className="d-flex">
              <a href={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard?assetTabNumber=5`}>
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
                Add Your Real Estate
              </h3>
            </div>
          )}

          <hr style={{ color: "#afafaf" }} />
          <div className="row">
            <div className="col-12 col-md-11 col-lg-8 m-auto">
              {addForm && (
                <p className="text-center">
                  Enter Your Details To Add Existing Assets
                </p>
              )}

              {updateForm && (
                <p className="text-center">
                  Enter Your Details To Edit Existing Assets
                </p>
              )}
              <br />
              <br />
              <div>
                <div className="my-md-4">
                  <div>
                    <span className="lbl-newbond">Type Of Property *</span>
                    <br />

                    <Select
                      className="fnto-dropdown-react"
                      classNamePrefix="sortSelect"
                      isSearchable={false}
                      styles={customStyles}
                      options={options_type_of_real_estate}
                      value={getRealEstateTypeValue(
                        options_type_of_real_estate,
                        formData?.typeOfProperty
                      )}
                      name="typeOfProperty"
                      onChange={(selectedOption) => {
                        // Auto-fill the property name based on selected type
                        const autoFillPropertyName = selectedOption.label;

                        setFormData({
                          ...formData,
                          typeOfProperty: selectedOption.value,
                          typeOfPropertyName: selectedOption.label,
                          nameOfProperty: autoFillPropertyName,
                          purchaseDate: "",
                          purchaseValue: "",
                          currentValue: "",
                          pincode: "",
                          residentialType: "Self-Occupied",
                          cityType: "Tier 1",
                          mortgageOrFreehold: "Free Hold"
                        });

                        isInputInPolicy("typeOfProperty", selectedOption.value);
                      }}

                    />
                    {simpleValidator.current.message(
                      "typeOfProperty",
                      formData.typeOfProperty,
                      "required"
                    )}
                  </div>
                </div>
                <div className="my-md-4">
                  <div className="">
                    <span className="lbl-newbond">
                      Who Is This Investment For*
                    </span>
                    <br />
                    <Select
                      className="fnto-dropdown-react"
                      classNamePrefix="sortSelect"
                      isSearchable={false}
                      styles={customStyles}
                      options={familyData}
                      name="realEstatMembername"
                      onChange={(selected) =>
                        setFormData({ ...formData, realEstatMembername: selected.value })
                      }
                      value={
                        familyData.find((v) => v.value == formData.realEstatMembername) || null
                      }
                    />
                    {simpleValidator.current.message(
                      "realEstatMemberName",
                      formData.realEstatMembername,
                      "required"
                    )}
                  </div>
                </div>
                <div>
                  <div
                    className="row"
                    style={{ display: "flex", flexWrap: "wrap" }}
                  >
                    <div className="col-md-12 col-12">
                      <div className="my-md-4">
                        <div>
                          <span className="lbl-newbond">Name Of Property *</span>
                          <br />
                          <input
                            placeholder="Enter Name Of Property"
                            className={` w-100 fntoo-textbox-react inputPlaceholder`}
                            type="text"
                            name="nameOfProperty"
                            value={formData.nameOfProperty}
                            onChange={(e) => onInputChange(e)}
                            autocomplete="off"
                          />
                        </div>
                        {simpleValidator.current.message(
                          "nameOfProperty",
                          formData.nameOfProperty,
                          "required|alpha_num_dash_space"
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div>
                          <span className="lbl-newbond">Purchase Date *</span>
                          <br />
                          <div className="bonds-datepicker">
                            <FintooDatePicker
                              dateFormat="dd/MM/yyyy"
                              selected={
                                formData.purchaseDate === ""
                                  ? ""
                                  : new Date(formData.purchaseDate)
                              }
                              showMonthDropdown
                              showYearDropdown
                              autoComplete="off"
                              dropdownMode="select"
                              name="purchaseDate"
                              customClass="datePickerDMF"
                              maxDate={new Date()}
                              onChange={(e) =>
                                onDateAndSelectInputChange(
                                  "purchaseDate",
                                  formatDatefun(e)
                                )
                              }
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
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
                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div>
                          <span className="lbl-newbond">Purchase Value*</span>
                          <br />
                          <input
                            placeholder="Enter Purchase Value"
                            className={` w-100 fntoo-textbox-react Rupee-icon`}
                            type="text"
                            name="purchaseValue"
                            value={
                              formData.purchaseValue
                                ? Number(formData.purchaseValue).toLocaleString("en-IN")
                                : ""
                            }
                            onChange={(e) => onInputChange(e, true)}
                            autocomplete="off"
                          />
                        </div>
                        {simpleValidator.current.message(
                          "purchaseValue",
                          formData.purchaseValue,
                          "required|numeric"
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div>
                          <span className="lbl-newbond">Current Value *</span>
                          <br />
                          <input
                            placeholder="Enter Current Value"
                            className={` w-100 fntoo-textbox-react Rupee-icon`}
                            type="text"
                            name="currentValue"
                            value={
                              formData.currentValue
                                ? Number(formData.currentValue).toLocaleString("en-IN")
                                : ""
                            }
                            onChange={(e) => onInputChange(e, true)}
                            autocomplete="off"
                          />
                        </div>
                        {simpleValidator.current.message(
                          "currentValue",
                          formData.currentValue,
                          "required|numeric"
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div>
                          <span className="lbl-newbond">Pincode *</span>
                          <br />
                          <input
                            placeholder="Enter Pincode"
                            className={` w-100 fntoo-textbox-react inputPlaceholder`}
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            maxLength={6}
                            onChange={(e) => onInputChange(e, true)}
                            autocomplete="off"
                          />
                        </div>
                        {simpleValidator.current.message(
                          "pincode",
                          formData.pincode,
                          "required|integer|max:6|min:6",
                          { messages: { required: "Please enter Pin Code." } }
                        )}
                      </div>
                    </div>

                    {isInputInPolicy(
                      "residentialType",
                      formData.typeOfProperty
                    ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div>
                              <span className="lbl-newbond">
                                Residential Type *
                              </span>
                              <br />
                            </div>
                            <FormRadioComponent
                              radioData={options_residental_type_radio}
                              onChange={onInputChange}
                              checkedOpton={formData.residentialType}
                            />
                          </div>
                        </div>
                      )}

                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div>
                          <span className="lbl-newbond">
                            Mortgage Or Freehold *
                          </span>
                          <br />
                        </div>
                        <FormRadioComponent
                          radioData={options_mortgage_or_freehold}
                          onChange={onInputChange}
                          checkedOpton={
                            formData.mortgageOrFreehold

                          }
                        />
                      </div>
                    </div>

                    {isInputInPolicy("cityType", formData.typeOfProperty) && formData.residentialType === 'Rented' && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">City Type *</span>
                            <br />
                          </div>
                          <FormRadioComponent
                            radioData={options_city_type}
                            onChange={onInputChange}
                            checkedOpton={formData.cityType}
                            isHorizontal={true}
                          />
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                <br />
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
                        onClick={() => updateRealEstateAsset()}
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
export default NewRealEstateFormView;
