import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import { formatDatefun } from "../../../../Utils/Date/DateFormat";
import { useNavigate, useParams } from "react-router-dom";
// import { data } from "cheerio/lib/api/attributes";
import {
  fetchEncryptData,
  getFpUserDetailsId,
  getUserId,
  getParentUserId,
  getMemberId,
  apiCall,
} from "../../../../common_utilities";
import axios from "axios";
import { useDispatch } from "react-redux";
import moment from "moment";
import { DATA_BELONGS_TO } from "../../../../constants";
import { debug } from "util";
import { getFamilyMember } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import {
  getOtherInvestments,
  saveUserAssetDetails,
} from "../../../../FrappeIntegration-Services/services/investment-api/investmentService";
import {
  getAssetCategoryList,
  UpdateAssetDetails,
} from "../../../../FrappeIntegration-Services/services/financial-planning-api/asset";

// Helper function to format number with commas
const formatNumberWithCommas = (value) => {
  if (!value || value === "" || value === "0") return value;
  const num = String(value).replace(/,/g, "");
  if (isNaN(num)) return value;
  return Number(num).toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

// Helper function to remove commas from formatted number
const removeCommas = (value) => {
  return String(value).replace(/,/g, "");
};

const liquidAssetsInputs = {
  default: ["current_balance"],
  "Saving Account": ["current_balance"],
  Cash: ["current_balance"],
  "Recurring Deposit": ["current_balance"],
  Others: ["dateOfPurchase", "directValue"],
};

const options_liquid_type = [];

function isInputInPolicy(inputName, assetType) {
  if (!assetType) {
    assetType = "default";
  }

  // Check if the assetType exists in liquidAssetsInputs, otherwise use default
  const inputs = liquidAssetsInputs[assetType] || liquidAssetsInputs.default;
  return inputs.includes(inputName);
}
const initialValues = {
  AssetType: "",
  liquidMemberName: "",
  dateOfPurchase: "",
  directValue: "",
  current_balance: "",
};

const NewLiquidAssetFormView = () => {
  const [, forceUpdate] = useState();

  const [formData, setFormData] = useState(initialValues);
  const navigate = useNavigate();
  const [editdata, setEditData] = useState("");
  const dispatch = useDispatch();
  const [familyData, setFamilyData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [assetForMember, setAssetForMember] = useState(null);
  const [assetsDetails, setAssetsDetails] = useState({});
  const [assetEditId, setAssetEditId] = useState("");
  const [liquidAssetDetails, setLiquidAssetDetails] = useState({
    asset_id: null,
    asset_name: null,
    asset_name_uuid: null,

    asset_sub_id: null,
    asset_sub_name: null,
    asset_sub_name_uuid: null,

    asset_type_id: null,
    asset_type_name: null,
    asset_type_name_uuid: null,
  });

  const [addForm, setAddForm] = useState(true);
  const [updateForm, setUpdateForm] = useState(false);
  const [optionsLoaded, setOptionsLoaded] = useState(false);

  const simpleValidator = useRef(new SimpleReactValidator());

  const onDateAndSelectInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const getLiquidTypeData = (insuranceTypeData, label) => {
    if (!label) return null;

    // First try exact match
    let match = insuranceTypeData.find((data) => data.label === label);
    if (match) return match;

    // Try case-insensitive match
    match = insuranceTypeData.find(
      (data) => data.label.toLowerCase() === label.toLowerCase()
    );
    if (match) return match;

    // Try partial match (contains)
    match = insuranceTypeData.find(
      (data) =>
        data.label.toLowerCase().includes(label.toLowerCase()) ||
        label.toLowerCase().includes(data.label.toLowerCase())
    );
    if (match) return match;

    // Try common variations
    const variations = {
      // "Fixed Deposit": ["Fixed Deposits", "Fixed Deposit Account"],
      "Saving Account": ["Savings Account", "Savings", "Saving"],
      Cash: ["Cash Account", "Cash in Hand"],
    };

    if (variations[label]) {
      for (const variation of variations[label]) {
        match = insuranceTypeData.find((data) => data.label === variation);
        if (match) return match;
      }
    }
    return null;
  };

  useEffect(() => {
    getFamilyMembers();
    const urlParams = new URLSearchParams(window.location.search);
    let asset_id = urlParams.get("id");
    if (asset_id) {
      setUpdateForm(true);
      setAddForm(false);
      setAssetEditId(asset_id);
      fetchLiquidAssetData(asset_id);
    }
  }, []);

  // State to store the fetched asset data
  const [fetchedAssetData, setFetchedAssetData] = useState(null);

  // useEffect to set form data when both options are loaded and asset data is available
  useEffect(() => {
    if (optionsLoaded && fetchedAssetData && updateForm) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        AssetType: fetchedAssetData.user_asset_name,
        liquidMemberName:
          fetchedAssetData?.user_asset_for == "0"
            ? 0
            : fetchedAssetData?.user_asset_for,
        current_balance: fetchedAssetData?.user_asset_current_amount || "",
        dateOfPurchase: fetchedAssetData?.user_asset_purchase_date || "",
        directValue: fetchedAssetData?.user_asset_investment_amount || "",
      }));
    }
  }, [optionsLoaded, fetchedAssetData, updateForm]);

  const validateForm = () => {
    simpleValidator.current.showMessages();
    forceUpdate(1);
    if (simpleValidator.current.allValid() == true) {
      addliquiddata();
    }
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

  const fetchLiquidAssetData = async (id) => {
    try {
      let payload_data = {
        user_id: getUserId(),
        user_asset_id: id,
      };

      const res = await getOtherInvestments(payload_data);

      if (res?.status_code === "200") {
        const urlParams = new URLSearchParams(window.location.search);

        const selectedAsset = res?.data?.listing?.find(
          (item) => item?.name === urlParams.get("id")
        );
        if (selectedAsset) {
          // Store the asset data to be used when options are loaded
          setFetchedAssetData(selectedAsset);
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

  const getFamilyMembers = async () => {
    try {
      const member_data = await getFamilyMember(getUserId());

      if (member_data.status_code === "200") {
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
              "UCAT-5",
              "ASC-30",
              "ASC-10",
              "ASC-16",
              "ASC-11",
              "ASC-12",
              "ATM-4",
              "ATM-6",
              "ASC-25",
              "ASC-17",
              "ATM-40",
              "ASC-31",
              "ASC-27",
              "ASC-21",
              "ASC-13",
              "ASC-29",
              "ATM-24",
              "ASC-28",
              "ATM-23",
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
      } else {
        setFamilyData([]);
        setMemberData([]);
      }
    } catch (error) {
      setFamilyData([]);
      setMemberData([]);
    }
  };

  const emptystates = () => {
    setFormData((prevformData) => ({
      ...prevformData,
      liquidMemberName: "",
      current_balance: "",
      directValue: "",
      dateOfPurchase: "",
    }));
  };

  const handleLiquidMember = (selectedOption) => {
    setFormData({
      ...formData,
      liquidMemberName: selectedOption.value,
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const asset_category = await getAssetCategoryList();

        const categoryList = asset_category?.data?.[0]?.category_list || [];

        const equityCategory = categoryList.find(
          (cat) => cat.asset_name === "Debt"
        );

        if (equityCategory) {
          const liquidAssetDataDict = {};

          for (const sub of equityCategory.subcategories) {
            if (sub.asset_sub_name === "Liquid") {
              // Clear the options array before populating to avoid duplicates
              options_liquid_type.length = 0;

              sub.asset_types.map((obj) => {
                // Filter out RD, FD, and Fixed Deposit from the options
                if (
                  obj.asset_type_name !== "RD" &&
                  obj.asset_type_name !== "FD" &&
                  obj.asset_type_name !== "Fixed Deposit"
                ) {
                  options_liquid_type.push({
                    label: obj.asset_type_name,
                    value: obj.asset_type_name_uuid,
                  });
                }
              });

              liquidAssetDataDict[sub.asset_sub_name_uuid] = {
                asset_id: equityCategory.asset_id,
                asset_name: equityCategory.asset_name,
                asset_name_uuid: equityCategory.asset_name_uuid,

                asset_sub_id: sub.asset_sub_id,
                asset_sub_name: sub.asset_sub_name,
                asset_sub_name_uuid: sub.asset_sub_name_uuid,

                asset_type_details: sub.asset_types,
              };
              setLiquidAssetDetails(liquidAssetDataDict);
            }
            // break;
          }
        }
        setOptionsLoaded(true);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setOptionsLoaded(true);
      }
    };

    fetchCategories();
  }, []);

  const addliquiddata = async () => {
    try {
      let liquidAssetData = assetsDetails;
      // Get the liquid asset info from the dictionary
      const liquidAssetKeys = Object.keys(liquidAssetDetails);
      const assetInfo = liquidAssetDetails[liquidAssetKeys[0]];
      let assetTypeNameUuid = "";
      assetInfo.asset_type_details.map((obj) => {
        if (obj.asset_type_name === formData.AssetType) {
          assetTypeNameUuid = obj.asset_type_name_uuid;
        }
      });

      liquidAssetData["asset_cat_id"] = assetInfo.asset_id;
      liquidAssetData["asset_name_uuid"] = assetInfo.asset_name_uuid;
      liquidAssetData["asset_sub_cat_id"] = assetInfo.asset_sub_id;
      liquidAssetData["asset_sub_name_uuid"] = assetInfo.asset_sub_name_uuid;
      liquidAssetData["asset_type_name_uuid"] = assetTypeNameUuid;
      liquidAssetData["user_asset_for"] = formData.liquidMemberName;
      liquidAssetData["user_asset_user_id"] = getUserId();
      liquidAssetData["user_asset_occurance"] = "One Time";
      liquidAssetData["user_asset_quantity"] = 0;
      liquidAssetData["user_asset_avg_purchase_price"] = "";
      liquidAssetData["user_asset_investment_amount"] = "";
      liquidAssetData["user_asset_current_price"] = "";
      liquidAssetData["user_asset_current_amount"] = formData.current_balance;
      liquidAssetData["user_asset_automated_linkage"] = 0;
      liquidAssetData["user_asset_name"] = formData.AssetType;
      liquidAssetData["user_asset_sip_amount"] = 0;
      liquidAssetData["user_asset_context"] =
        formData.liquidMemberName == "0" ? "Family" : "Individual";
      liquidAssetData["user_asset_purchase_date"] = formData?.SIPStartDate
        ? new Date(formData.SIPStartDate).toLocaleDateString("en-GB")
        : "";
      liquidAssetData["user_asset_end_date"] = formData?.SIPEndDate
        ? new Date(formData.SIPEndDate).toLocaleDateString("en-GB")
        : "";

      const response = await saveUserAssetDetails(liquidAssetData);

      if (response.status_code == "200") {
        navigate(
          process.env.PUBLIC_URL +
            "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=8"
        );

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `Alternate asset added Successfully!`,
            type: "success",
          },
        });
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `Alternate asset not added, Something went wrong!`,
            type: "error",
          },
        });
      }
    } catch (e) {
      console.log("Error while saving liquid asset details: ", e);
    }
  };

  const updateLiquidAsset = () => {
    if (simpleValidator.current.allValid()) {
      updateLiquidAssetData();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate((v) => ++v);
    }
  };

  const updateLiquidAssetData = async () => {
    try {
      let liquidAssetData = assetsDetails;
      // Get the liquid asset info from the dictionary
      const liquidAssetKeys = Object.keys(liquidAssetDetails);
      const assetInfo = liquidAssetDetails[liquidAssetKeys[0]];
      let assetTypeNameUuid = "";
      assetInfo.asset_type_details.map((obj) => {
        if (obj.asset_type_name === formData.AssetType) {
          assetTypeNameUuid = obj.asset_type_name_uuid;
        }
      });

      liquidAssetData["asset_name_uuid"] = assetInfo.asset_name_uuid;
      liquidAssetData["asset_sub_name_uuid"] = assetInfo.asset_sub_name_uuid;
      liquidAssetData["asset_type_name_uuid"] = assetTypeNameUuid;
      liquidAssetData["user_asset_for"] = formData.liquidMemberName;
      liquidAssetData["user_asset_current_amount"] = formData.current_balance;
      liquidAssetData["user_asset_user_id"] = getUserId();
      liquidAssetData["user_asset_automated_linkage"] = 0;
      liquidAssetData["user_asset_name"] = formData.AssetType;
      liquidAssetData["asset_id"] = assetEditId;

      const response = await UpdateAssetDetails(liquidAssetData);

      if (response.status_code == "200") {
        navigate(
          process.env.PUBLIC_URL +
            "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=8"
        );

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `Alternate asset updated Successfully!`,
            type: "success",
          },
        });
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `Alternate asset not added, Something went wrong!`,
            type: "error",
          },
        });
      }
    } catch (e) {
      console.log("Error while saving liquid asset details: ", e);
    }
  };

  return (
    <>
      <div className="px-0 px-md-4 assetForm">
        <div
          className="p-3"
          style={{ border: "1px solid #d8d8d8", borderRadius: 10 }}
        >
          <div className="d-flex">
            <a
              href={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard?assetTabNumber=8`}
            >
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
              {updateForm ? "Edit Your Liquid Asset" : "Add Your Liquid Assets"}
            </h3>
          </div>

          <hr style={{ color: "#afafaf" }} />
          <div className="row">
            <div className="col-12 col-md-11 col-lg-8 m-auto">
              <p className="text-center">
                {updateForm
                  ? ""
                  : " Enter Your Details To Add Existing Liquid Assets"}
              </p>
              <br />
              <br />
              <div>
                <div className="my-md-4">
                  <div>
                    <span className="lbl-newbond">Select Asset Type *</span>
                    <br />

                    <Select
                      className="fnto-dropdown-react shadow-none outline-none"
                      classNamePrefix="sortSelect"
                      isSearchable={false}
                      styles={customStyles}
                      options={options_liquid_type}
                      value={getLiquidTypeData(
                        options_liquid_type,
                        formData.AssetType
                      )}
                      name="AssetType"
                      onChange={(e) => {
                        onDateAndSelectInputChange("AssetType", e.label);
                        emptystates();
                      }}
                    />
                    {simpleValidator.current.message(
                      "AssetType",
                      formData.AssetType,
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
                      className={`fnto-dropdown-react`}
                      classNamePrefix="sortSelect"
                      isSearchable={false}
                      styles={customStyles}
                      options={familyData}
                      name="liquidMemberName"
                      placeholder="Select Members"
                      onChange={handleLiquidMember}
                      value={(() => {
                        if (
                          formData.liquidMemberName === "" ||
                          formData.liquidMemberName === null ||
                          formData.liquidMemberName === undefined
                        ) {
                          return null;
                        }
                        const selectedOption = familyData.find(
                          (v) => v.value == formData.liquidMemberName
                        );
                        return selectedOption || null;
                      })()}
                    />
                    {simpleValidator.current.message(
                      "liquidMemberName",
                      formData.liquidMemberName,
                      "required"
                    )}
                  </div>
                </div>

                <div>
                  <div
                    className="row"
                    style={{ display: "flex", flexWrap: "wrap" }}
                  >
                    {isInputInPolicy("current_balance", formData.AssetType) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Current Balance *
                            </span>
                            <br />
                            <input
                              placeholder="Enter Current Balance"
                              className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                              type="text"
                              name="current_balance"
                              value={formatNumberWithCommas(
                                formData.current_balance
                              )}
                              onChange={(e) => {
                                const cleanValue = removeCommas(e.target.value);
                                setFormData((prev) => ({
                                  ...prev,
                                  current_balance: cleanValue.replace(
                                    /[^0-9.]/,
                                    ""
                                  ),
                                }));
                              }}
                            />
                          </div>
                          {simpleValidator.current.message(
                            "current_balance",
                            formData.current_balance,
                            "required|numeric"
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="row"
                  style={{ display: "flex", flexWrap: "wrap" }}
                >
                  {isInputInPolicy("dateOfPurchase", formData.AssetType) && (
                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div>
                          <span className="lbl-newbond">Date Of Purchase</span>
                          <br />
                          <div className="bonds-datepicker">
                            <FintooDatePicker
                              dateFormat="yyyy/MM/dd"
                              selected={
                                formData.dateOfPurchase === ""
                                  ? ""
                                  : new Date(formData.dateOfPurchase)
                              }
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              name="dateOfPurchase"
                              customClass="datePickerDMF"
                              maxDate={new Date()}
                              onChange={(e) =>
                                onDateAndSelectInputChange(
                                  "dateOfPurchase",
                                  formatDatefun(e)
                                )
                              }
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                            />
                          </div>

                          {simpleValidator.current.message(
                            "dateOfPurchase",
                            formData.dateOfPurchase,
                            "required"
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {isInputInPolicy("directValue", formData.AssetType) && (
                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div>
                          <span className="lbl-newbond">Direct Value</span>
                          <br />
                          <input
                            placeholder="Enter Direct Value"
                            className={` w-100 fntoo-textbox-react inputPlaceholder Rupee-icon`}
                            type="text"
                            name="directValue"
                            value={formatNumberWithCommas(formData.directValue)}
                            onChange={(e) => {
                              const cleanValue = removeCommas(e.target.value);
                              setFormData((prev) => ({
                                ...prev,
                                directValue: cleanValue.replace(/[^0-9.]/, ""),
                              }));
                            }}
                          />
                          {simpleValidator.current.message(
                            "directValue",
                            formData.directValue,
                            "required|numeric"
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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
                        onClick={() => updateLiquidAsset()}
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
export default NewLiquidAssetFormView;
