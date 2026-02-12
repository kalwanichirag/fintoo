import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import FormSwitch from "../CommonDashboardComponents/formSwitch";
import SimpleReactValidator from "simple-react-validator";
import { formatDatefun } from "../../../../Utils/Date/DateFormat";
import { useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
// import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  DATA_BELONGS_TO
} from "../../../../constants";
import {
  getParentUserId,
  loginRedirectGuest,
  apiCall,
  fetchEncryptData,
  getItemLocal,
  getUserId,
  getFpUserDetailsId,
} from "../../../../common_utilities";
import commonEncode from "../../../../commonEncode";
import uuid from "react-uuid";
import moment from "moment";
import FormRangeSlider from "../CommonDashboardComponents/FormRangeSlider";

const numericRegex = new RegExp(/^\d*\.?\d*$/);

const options = [{ value: "115", label: "Others" }];

const initialValues = {
  insurancePolicyType: "",
  insurancePolicyName: "",
  policyNumber: "",
  premiumAmount: "",
  premiumPaymentFrequency: "",
  sumAssured: "",
  surrenderValue: "",
  dateOfPurchase: "",
  premiumPaymentEndDate: "",
  policyTermYears: "",
  isMaturityOneTimeOrRecurring: "",
  addBonus: false,
  maturityBonus: "",
  typeOfGeneralInsurance: "",
  insuranceMaturityAmount: "",
  ulip: "",
  topUp: "",
  mediclaimInsuranceFor: "",
  anyPreExistingDisease: "",
  maturityData: [],
};

const NewOtherAssetsFormView = () => {
  const [, forceUpdate] = useState();
  const [formData, setFormData] = useState(initialValues);
  const [maturityToggle, setMaturityToggle] = useState(false);
  const [addBonusToggle, setAddBonusToggle] = useState(false);
  const [existingDiseaseToggle, setExistingDiseaseToggle] = useState(false);
  const dispatch = useDispatch();
  const [ulipFund, setUlipFund] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [ids, setid] = useState("");
  const [familyData, setFamilyData] = useState([]);

  const simpleValidator = useRef(new SimpleReactValidator());

  const [othersData, setothersData] = useState("");
  const onDateAndSelectInputChange = (name, value) => {
    if (name == "OtherAsset") {
      setothersData({
        ...othersData,
        OtherAsset: value.label,
        insurance_name: value.label,
      });
    } else {
      setothersData({ ...othersData, [name]: value });
    }
    // setFormData({ ...formData, [name]: value });
  };

  const getSelectValueData = (selectOptions, value) => {
    return selectOptions.find((data) => data.value == value);
  };

  const validateForm = () => {
    simpleValidator.current.showMessages();
    if (simpleValidator.current.allValid() == true) {
      let formSuccess = true;

      if (
        maturityToggle == true &&
        othersData.recurring_insurance.some((v) => v.isValid === false)
      )
        formSuccess = false;

      if (
        addBonusToggle == true &&
        othersData.recurring_bonus_amount.some((v) => v.isValid === false)
      )
        formSuccess = false;

      if (formSuccess) {
        // Addinsurance();
        addothers();
      }
    }
    forceUpdate(1);
  };
  simpleValidator.current.purgeFields();
  // For Select Style
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

  useEffect(() => {
  }, [othersData]);

  useEffect(() => {
    if (id != undefined) {
      fetchInsuranceData(atob(id));
    }
    getFamilyMembers();
  }, []);

  const getFamilyMembers = async () => {
    try {
      let data = {
        user_id: getParentUserId(),
        is_direct: "1",
      };

      let member_data = await apiCall('', data, true, false);

      if (member_data.error_code == "100") {
        var member_array = [];
        var members = member_data["data"];
        members.map((member) => {
          if (member.parent_user_id == 0) {
            member_array.push({ value: member.fp_user_id, label: "Self", retirement_age: member.retirement_age, dob: member.dob, life_expectancy: member.life_expectancy, isdependent: member.isdependent });
            setothersData({
              ...othersData,
              othersMemberName: member.fp_user_id,
            });
          
            member_array.push({ value: 0, label: "Family", retirement_age: member.retirement_age, dob: member.dob, life_expectancy: member.life_expectancy, isdependent: member.isdependent });
            
          } else {
            member_array.push({
              value: member.fp_user_id,
              label: member.NAME + " " + member.last_name,
              retirement_age: member.retirement_age,
              dob: member.dob,
              life_expectancy: member.life_expectancy,
              isdependent: member.isdependent
            });
          }
        });

        setFamilyData(member_array);
      } else {
        setFamilyData([]);
      }
    } catch { }
  };

  const handleOthersMember = (selectedOption) => {
    setothersData({
      ...othersData,
      othersMemberName: selectedOption.value,
    });
  };

  const fetchInsuranceData = async () => {
    try {
      if (getItemLocal("family")) {
        var new_array = [];
        var new_data = getItemLocal("member");
        new_data.forEach((element) => {
          if (element.id !== null) {
            new_array.push(element.id.toString());
          }
        });
      }
      var payload = {
        url: '',
        data: {
          user_id: getParentUserId(),
          fp_user_details_id: getItemLocal("family") ? 0 : getItemLocal("member").find(u => u.id == getUserId() * 1).fp_user_details_id,
          inv_type: "all",
          data_belongs_to: DATA_BELONGS_TO,
      },
        method: "post",
      };

      var res = await fetchEncryptData(payload);
      if (res.error_code == "100") {
        var othersId = atob(id);
        const data = res.data.other_data.other_details.filter(
          (v) => v.id === Number(othersId)
        );
        // assignotherData(data[0])
        setothersData((prevFormData) => ({
          ...prevFormData,
          OtherAsset: data[0].asset_category_id,
          othersMemberName:data[0].asset_member_id,
          current_balance: data[0].cr_val,
          expectedReturns: data[0].asset_ror,
        }));
      } else {
        setForsetFormDatamData(initialValues);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addothers = async () => {
    try {
      var date = moment(new Date()).format("DD/MM/YYYY");
      let req = {
        Created_By: 0,
        Updated_By: 0,
        asset_amount: othersData.current_balance,
        asset_abreturn: "0",
        annual_growth_rate: "10",
        asset_broker_id: 0,
        asset_category_id: 115,
        asset_citytype: "0",
        asset_current_unit_price: "",
        asset_currency: false,
        user_asset_source: "Manual",
        asset_epf_ismanual: "1",
        asset_folio_number: null,
        asset_footnote: null,
        asset_frequency: "1",
        asset_goal_link_id: 0,
        asset_goalname: null,
        asset_gold_karat: 0,
        asset_isActive: "1",
        asset_ismortgage: "0",
        asset_isperpetual: "3",
        asset_isallocation: false,
        asset_iselss: "1",
        asset_islinkable: true,
        asset_isrecurring: false,
        asset_isrented: "1",
        asset_maturity_amt: 0,
        asset_maturity_date: null,
        asset_member_id: othersData.othersMemberName,
        asset_mf_end_date: null,
        asset_name: "Others",
        asset_pan: null,
        asset_payout_type: "1",
        asset_pin_code: "",
        asset_purchase_amount: "",
        asset_purchase_date: null,
        asset_rental_amount: "",
        asset_rental_income: null,
        asset_ror: othersData?.expectedReturns ?? "1",
        asset_sub_category_id: 115,
        asset_unique_code: "",
        asset_units: "",
        categorydetail: "Others",
        created_datetime: moment().toDate(),
        employee_contribution: "",
        employer_contribution: "",
        installment_ispaid: 1,
        membername1: "",
        stock_mf: null,
        stock_name: null,
        totalinvestedvalue: "",
        totalpurchasevalue: "",
        totalmaturtiyamount: "",
        updated_datetime: date,
        user_id: getParentUserId(),
        scheme_equityshare: {},
        asset_source: "1",
      };

      if (id != undefined || id != null) {
        var date = moment(new Date()).format("DD/MM/YYYY");
        let req = {
          Created_By: 0,
          Updated_By: 0,
          asset_amount: othersData.current_balance,
          asset_annual_growth_rate: "10.00",
          asset_broker_id: 0,
          asset_category_id: 115,
          asset_citytype: "0",
          asset_currency: false,
          asset_current_unit_price: 0,
          user_asset_source: "Manual",
          asset_epf_ismanual: "1",
          asset_folio_number: null,
          asset_footnote: null,
          asset_frequency: 1,
          asset_goal_link_id: 0,
          asset_goalname: null,
          asset_gold_karat: 0,
          asset_isActive: "1",
          asset_isMortgage: "0",
          asset_isPerpetual: "3",
          asset_isallocation: false,
          asset_iselss: "1",
          asset_islinkable: true,
          asset_isrecurring: false,
          asset_isrented: "1",
          asset_maturity_amt: 0,
          asset_maturity_date: null,
          asset_member_id: othersData.othersMemberName,
          asset_mf_end_date: null,
          asset_name: "Others",
          asset_pan: null,
          asset_payout_type: "1",
          asset_pin_code: "",
          asset_purchase_amount: 0,
          asset_purchase_date: null,
          asset_rental_amount: "0.00",
          asset_rental_income: null,
          asset_ror: othersData?.expectedReturns ?? "1",
          asset_sip_amount: null,
          asset_source: "1",
          asset_sub_category_id: 115,
          asset_unique_code: "",
          asset_units: 0,
          categorydetail: "Others",
          created_datetime: "2024-02-23T15:52:18",
          employee_monthly_contrib: "0.00",
          employeer_monthly_contrib: "0.00",
          id: atob(id),
          installment_ispaid: true,
          linked_goals_id: [],
          membername1: "",
          stock_mf: null,
          stock_name: null,
          subcategorydetail: "",
          totalinvestedvalue: "0.00",
          totalpurchasevalue: "0.00",
          updated_datetime: moment().toDate(),
          user_id: getParentUserId(),
          asset_ismortgage: "0",
          asset_isperpetual: "3",
          annual_growth_rate: "10.00",
          totalmaturtiyamount: null,
          employee_contribution: 0,
          employer_contribution: 0,
        };
        var config = {
          method: "POST",
          url: ADVISORY_UPDATE_ASSETS_API,
          data: req,
        };
      } else {
        var config = {
          method: "POST",
          url: '',
          data: req,
        };
      }

      let response = await axios(config);

      if (response.data["error_code"] == "100") {
        if (id != undefined) {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Others Updated Successfully!",
              type: "success",
            },
          });
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: "Others Added Successfully!", type: "success" },
          });
        }
      }
      navigate(
        process.env.PUBLIC_URL +
          "/direct-mutual-fund/portfolio/dashboard/?assetTabNumber=9"
      );
    } catch (e) {
      console.log(":::::", e);
    }
  };

  const assignotherData = (data) => {
    const dataCopy = {
      OtherAsset: getSelectValueData(options, data.asset_category_id),
      //   nameOfProperty: data.property_name,
      //   purchaseDate: moment(data.purchase_date).toDate(),
      //   purchaseValue: data.purchase_rate.toString(),
      //   currentValue: data.current_rate.toString(),
      //   pincode: data.pincode.toString(),
      //   residentialType: data.asset_isRented == "0" ? "rented" : "self occupied",
      //   mortgageOrFreehold: data.asset_isMortgage == "1" ? "mortgage" : "freehold",
      //   cityType: data.asset_isRented == "0" ? data.asset_citytype : "",
      //   asset_source: "2"
    };
    setFormData(dataCopy);
  };

  return (
    <>
      <div className="px-0 px-md-4 assetForm">
        <div
          className="p-3"
          style={{ border: "1px solid #d8d8d8", borderRadius: 10 }}
        >
          <div className="d-flex">
            <Link
              to={
                process.env.PUBLIC_URL +
                "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=9"
              }
            >
              {" "}
              <img
                style={{
                  transform: "rotate(180deg)",
                }}
                width={20}
                height={20}
                src={process.env.PUBLIC_URL + "/static/media/icons/chevron.svg"}
              />
            </Link>
            <h3
              className="text-center pb-0 mb-0 ps-2"
              style={{
                flexGrow: 1,
              }}
            >
              {id != undefined
                ? "Edit Your Other Assets"
                : "Add Your Other Assets"}
            </h3>
          </div>
          <hr style={{ color: "#afafaf" }} />
          <div className="row">
            <div className="col-12 col-md-11 col-lg-8 m-auto">
              <p className="text-center">
                Enter Your Details To {id != undefined ? "Edit " : "Add "}{" "}
                Existing Other Assets
              </p>
              <br />
              <br />
              <div>
                <div className="my-md-4">
                  <div className="">
                    <span className="lbl-newbond">Select Asset Type *</span>
                    <br />
                    {//console.log("options2", othersData)
                    }
                    <Select
                      className="fnto-dropdown-react"
                      classNamePrefix="sortSelect"
                      styles={customStyles}
                      isSearchable={false}
                      options={options}
                      value={getSelectValueData(options, othersData.OtherAsset)}
                      name="OtherAsset"
                      onChange={(e) => {
                        onDateAndSelectInputChange("OtherAsset", e);
                      }}
                    />
                    {simpleValidator.current.message(
                      "OtherAsset",
                      othersData.OtherAsset,
                      "required"
                    )}
                  </div>
                </div>

                {/* {
                                    getFormView(formData.insurancePolicyName)
                                } */}
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
                      name="othersMemberName"
                      onChange={handleOthersMember}
                      value={familyData.filter(
                        (v) => v.value == othersData.othersMemberName
                      )}
                    />
                    {simpleValidator.current.message(
                      "othersMemberName",
                      othersData.othersMemberName,
                      "required"
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="my-md-4">
                      <div>
                        <span className="lbl-newbond">Rate Of Return (%)*</span>
                        <br />
                      </div>
                      <FormRangeSlider
                        x={othersData.expectedReturns}
                        min={0}
                        max={20}
                        step={1}
                        onChange={(x) => {
                          setothersData({ ...othersData, expectedReturns: x });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="my-md-4">
                      <div>
                        <span className="lbl-newbond">Current Balance *</span>
                        <br />
                        <input
                          placeholder="Enter Current Balance"
                          className={` w-100 fntoo-textbox-react inputPlaceholder`}
                          type="text"
                          name="current_balance"
                          value={othersData.current_balance}
                          onChange={(e) => {
                            //onInputChange(e, true);
                            setothersData((prev) => ({
                              ...prev,
                              current_balance: e.target.value.replace(
                                /[^0-9.]/,
                                ""
                              ),
                            }));
                          }}
                        />
                      </div>
                      {simpleValidator.current.message(
                        "current_balance",
                        othersData.current_balance,
                        "required|alpha_spaces"
                      )}
                    </div>
                  </div>
                </div>
                <br />
                <div className="my-md-4">
                  <button
                    type="submit"
                    className="d-block m-auto btn btn-primary"
                    onClick={() => validateForm()}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NewOtherAssetsFormView;
