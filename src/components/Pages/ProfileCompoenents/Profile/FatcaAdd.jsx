import { useState, useEffect, useRef, useCallback } from "react";
import "react-responsive-modal/styles.css";
import Link from "../../../MainComponents/Link";
import Profile_1 from "../../../Assets/05_Fatca_details.svg";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Container, Row, Col } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import FatcaAddress from "../../ProfileCompoenents/Fatca/FatcaAddress";
import Back from "../../../Assets/left-arrow.png";
import FintooButton from "../../../HTML/FintooButton";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import { FaTrashAlt, FaEdit, FaMinusCircle } from "react-icons/fa";
import { CheckSession, getUserId, memberId } from "../../../../common_utilities";
import commonEncode from "../../../../commonEncode";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import { fetchUserProfileDetails, updateBasicDetails, userLogin } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { addFatcaDetails, GetCities, GetCountries, GetFatcaDetails, GetStates } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { DMF_BASE_URL, DMF_GETCOUNTRIES_API_URL, DMF_GETSTATES_API_URL, DMF_GETCITIES_API_URL, DATA_BELONGS_TO } from "../../../../constants";
import Cookies from 'js-cookie';

function FatcaAdd(props) {
  const initialDataRef = useRef(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const showBack = useSelector((state) => state.isBackVisible);
  const [addMore, setAddMore] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editNumber, setEditNumber] = useState(null);
  const editValid = useRef();

  const [userDetails, setUserDetails] = useState("");
  const [userFatcaDetails, setUserFatcaDetails] = useState("");
  const [countryList, setCountries] = useState([]);
  const [stateList, setStates] = useState([]);
  const [cityList, setCities] = useState([]);

  const [taxData, setTaxData] = useState([]);

  var [countryId, setCountryId] = useState("");
  var [stateId, setStateId] = useState("");
  var [osAddress, setOSAddress] = useState("");
  var [zipCode, setZipCode] = useState("");
  var [cityId, setCityId] = useState("");

  // Auto-fill states
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [pendingLocationData, setPendingLocationData] = useState(null);
  const locationRef = useRef({});
  const apiLocationRef = useRef();

  const dispatch = useDispatch();

  const [formObject, setFormObject] = useState({});
  const [demo, setDemo] = useState("");

  const user_id = memberId();

  // const [tax_res, set_tax_res] = useState("");
  // const [pol_stat, set_pol_stat] = useState("");


  // useEffect(()=> {
  //   set_tax_res(props.maindata.residential_status);
  //   set_pol_stat(props.maindata.politically_exposed);
  // }, []);

  const [, forceUpdate] = useState();

  // Define API functions at the top to avoid hoisting issues
  const getCountries = async () => {
    try {      
      var config = {
        method: "post",
        url: DMF_GETCOUNTRIES_API_URL,
      };
      var res = await axios(config);
      
      if (res.data && res.data.data) {
        setCountries(res.data.data);
      } else {
        setCountries([]);
      }
    } catch (e) {
      setCountries([]);
    }
  };

  const getStates = async () => {
    if (Boolean(countryId) == false) return;
    try {
      
      let countryData = { country_id: countryId };
      var config = {
        method: "post",
        url: DMF_GETSTATES_API_URL,
        data: countryData,
      };
      var res = await axios(config);
      
      let statesData = res.data.data;
      setStates(statesData);
      if (locationRef.current && locationRef.current.State) {
        
        // Try exact match first, then case-insensitive match, then partial match
        let index = statesData.findIndex(
          (state) => state.state_name === locationRef.current.State
        );
       
        
        if (index === -1) {
          index = statesData.findIndex(
            (state) => state.state_name.toLowerCase() === locationRef.current.State.toLowerCase()
          );
          
        }
        
        if (index === -1) {
          index = statesData.findIndex(
            (state) => state.state_name.toLowerCase().includes(locationRef.current.State.toLowerCase()) ||
                     locationRef.current.State.toLowerCase().includes(state.state_name.toLowerCase())
          );
         
        }
        
        if (index > -1) {
          
          setStateId(statesData[index].state_id);
        } else {
          console.log("No matching state found for:", locationRef.current.State);
        }
      } else {
        console.log("No location data or State available for matching");
      }
    } catch (e) {
      console.log("Error fetching states:", e);
    }
  };

  const getCities = async () => {
    if (Boolean(countryId) == false || Boolean(stateId) == false) {
      return;
    }
    try {
      
      let stateData = { state_id: stateId };
      var config = {
        method: "post",
        url: DMF_GETCITIES_API_URL,
        data: stateData,
      };
      var res = await axios(config);
      
      let citiesData = res.data.data;
      setCities(citiesData);
      
      // Process location data directly like AadharAddress.jsx
      if (locationRef.current && locationRef.current.District) {
        
        // Try exact match first
        var index = citiesData.findIndex(
          (city) => city.city_name === locationRef.current.District
        );
        
        // If no exact match, try case-insensitive match
        if (index === -1) {
          index = citiesData.findIndex(
            (city) => city.city_name.toLowerCase() === locationRef.current.District?.toLowerCase()
          );
        }
        
        // If still no match, try partial match
        if (index === -1) {
          index = citiesData.findIndex(
            (city) => city.city_name.toLowerCase().includes(locationRef.current.District?.toLowerCase()) ||
                     locationRef.current.District?.toLowerCase().includes(city.city_name.toLowerCase())
          );
        }
        
        if (index > -1) {
          setCityId("" + citiesData[index].city_id);
        } else {
          console.log("No matching city found for:", locationRef.current.District);
        }
      } else {
        console.log("No location data or District available for matching");
      }
    } catch (e) {
      console.log("Error fetching cities:", e);
    }
  };

  const defaultValues = async () => {
    const fatca = userDetails?.fatca_details;

    setOSAddress(fatca?.fatca_overseas_address ?? "");
    setZipCode(fatca?.fatca_zip_code ?? "");
    setCountryId(fatca?.fatca_country_id ?? "");
    setCityId(fatca?.fatca_city ?? "");
    setStateId(fatca?.fatca_state ?? "");
  };

  useEffect(() => {
    defaultValues();
  }, [userDetails]);

  useEffect(() => {
    getCountries();
    // // checksession();
    onLoadInIt();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    return () => {
      initialDataRef.current = false;
      // Cancel any pending location requests
      if (apiLocationRef.current) {
        apiLocationRef.current.abort();
      }
    };
  }, []);

  const apiFatcaDetails = async () => {
    var user_id = getUserId();
    try {
      
      var response = await GetFatcaDetails(user_id);
      const fatca_response = response?.data;

      setUserFatcaDetails(fatca_response);
    } catch (e) {
      console.log("catch", e);
    }
  };

  useEffect(() => {
    apiFatcaDetails();
  }, [formObject]);

  useEffect(() => {
    if (countryList.length && initialDataRef.current === false) {
      initialDataRef.current = true;
      const suffixMap = ["one", "two", "three"];

      const taxData = suffixMap.map((suffix) => {
        const taxpayer = userFatcaDetails[`fatca_tax_payer_id_${suffix}`];
        const country = userFatcaDetails[`fatca_tax_payer_country_${suffix}`];
        const iType = userFatcaDetails[`fatca_id_type_${suffix}`];

        if (!taxpayer && !country && !iType) {
          return null;
        }

        return {
          taxpayer,
          country,
          iType,
        };
      }).filter(Boolean);
      setTaxData(taxData);
    }
  }, [userFatcaDetails, countryList]);

  const onLoadInIt = async () => {
    try {
      var response = await fetchUserProfileDetails(getUserId());
      setUserDetails(response.data);
    } catch (e) {
      console.log("Error fetching user details:", e);
    }
  };

  const editDetails = (event) => {
    if (editMode == true) {
      var formValid = simpleValidator.current.allValid();
      simpleValidator.current.showMessages();
      forceUpdate(1);
      if (formValid == true) {
        cancelForm();
        setEditMode(false);
        editValid.current = true;
      } else {
        editValid.current = false;
      }
    }
  };

  const addDetails = (event) => {
    if (addMore === true) {
      var formValid = simpleValidator.current.allValid();
      
      forceUpdate(1);
      if (formValid === true) {
        setTaxData((v) => [
          ...v,
          {
            taxpayer: formObject.taxpayer,
            country: formObject.country,
            iType: formObject.iType,
          },
        ]);
        // FatcaApiCall();
        cancelForm();
        // apiFatcaDetails();
      } else {
        simpleValidator.current.showMessages();
        forceUpdate(1);
      }
    }
  };

  const validateForm = () => {
    // Clear previous validation messages first
    simpleValidator.current.hideMessages();
    forceUpdate(1);
    
    // Small delay to ensure auto-filled values are processed
    setTimeout(() => {
      var formValid = simpleValidator.current.allValid();
      simpleValidator.current.showMessages();
      forceUpdate(1);
      
      if (formValid == true) {
        if (addMore == true) {
          addDetails();
        }
        FatcaApiCall();
      } else {
        simpleValidator.current.showMessages();
        forceUpdate(1);
      }
    }, 100);
  };

  const updateData = (i) => {
    var t = taxData;
    t[i] = { ...formObject };
    setTaxData([...t]);
    setFormObject({});
    cancelForm();
    // editNumber(-1);
  };




  useEffect(() => {
    if (typeof countryId === "string" && countryId.trim() !== "") {
      getStates();
    }
  }, [countryId]);

  useEffect(() => {
    if (typeof stateId === "string" && stateId.trim() !== "") {
      getCities();
    } 
  }, [stateId]);

  // Clear validation messages when auto-fill is complete
  useEffect(() => {
    if (isAutoFilled && countryId && stateId && cityId) {
      simpleValidator.current.hideMessages();
      forceUpdate(1);
    }
  }, [isAutoFilled, countryId, stateId, cityId]);

  // Auto-fill location when ZIP code changes
  useEffect(() => {
    if (zipCode && zipCode.length >= 3 && countryList.length > 0) {
      const timeoutId = setTimeout(() => {
        fetchLocationFromZipCode(zipCode);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [zipCode, countryList]);


  // ZIP code lookup function
  const fetchLocationFromZipCode = async (zipCodeValue) => {
    if (!zipCodeValue || zipCodeValue.length < 3) {
      return;
    }

    try {
      setIsLoadingLocation(true);
      
      // Cancel previous request if exists
      if (apiLocationRef.current) {
        apiLocationRef.current.abort();
      }
      apiLocationRef.current = new AbortController();

      const response = await axios.get(process.env.REACT_APP_PINCODE_CHECK + zipCodeValue, {
        signal: apiLocationRef.current.signal
      });
      
      const locationData = response.data.data;
      locationRef.current = { ...locationData };

      if (locationData.Country && locationData.State && locationData.District) {
        // Find and set country with flexible matching like AadharAddress.jsx
        let countryIndex = countryList.findIndex(
          (country) => country.country_name === locationData.Country
        );
        
        if (countryIndex === -1) {
          countryIndex = countryList.findIndex(
            (country) => country.country_name.toLowerCase() === locationData.Country.toLowerCase()
          );
        }
        
        if (countryIndex > -1) {
          setCountryId(countryList[countryIndex].country_id);
          setIsAutoFilled(true);
          
          // Clear validation messages for auto-filled fields
          setTimeout(() => {
            simpleValidator.current.hideMessages();
            forceUpdate(1);
          }, 200);
        } else {
          console.log("Country not found in list:", locationData.Country);
          console.log("Available countries:", countryList.map(c => c.country_name));
        }
      } else {
        console.log("Location data missing required fields:", {
          Country: locationData.Country,
          State: locationData.State,
          District: locationData.District
        });
      }
      
      setIsLoadingLocation(false);
    } catch (error) {
      setIsLoadingLocation(false);
      
      if (error.name !== 'AbortError') {
        dispatch({
          type: "RENDER_TOAST",
          payload: { 
            message: "Unable to find location for this ZIP code. Please select manually.", 
            type: "warning" 
          },
        });
      }
    }
  };

  const cancelForm = () => {
    setAddMore(false);
    setEditMode(false);
    setEditNumber(null);
    
    setFormObject({});
    simpleValidator.current.purgeFields();
    forceUpdate(3);
  };

  const FatcaApiCall = async () => {
    const residentialStatus = props.maindata?.residential_status || null;
    const politicallyExposed = props.maindata?.politically_exposed || null;
    
    var data = {
      user_id: user_id,
      fatca_politically_exposed: politicallyExposed,
      fatca_tax_resident: residentialStatus,
    };
    // var prefix = 0;
    // taxData.forEach((v) => {
    //   data["fatca_tax_payer_id" + (prefix == 0 ? "" : "_" + prefix)] =
    //     v.taxpayer;
    //   data["fatca_id_type" + (prefix == 0 ? "" : "_" + prefix)] = v.iType;
    //   data["fatca_resident_country" + (prefix == 0 ? "" : "_" + prefix)] =
    //     v.country;
    //   prefix++;
    // });
    
    try {

      var payload = {
        user_id: user_id,
        fatca_politically_exposed: politicallyExposed,
        fatca_tax_resident: residentialStatus,
        fatca_overseas_address: osAddress,
        fatca_zip_code: zipCode,
        fatca_country_id: countryId,
        fatca_state: stateId,
        fatca_city: cityId,
        ...(userDetails?.fatca_details?.name && { fatca_id: userDetails.fatca_details.name }),
        data_belongs_to: DATA_BELONGS_TO,
        fatca_networth: 0,
        fatca_nationality: residentialStatus == "RES" ? "India" : "",
        fatca_resident_country: countryId
      }
      const suffixMap = ["one", "two", "three"];
      suffixMap.forEach((suffix, idx) => {
        const entry = taxData[idx] || {};
        payload[`fatca_tax_payer_id_${suffix}`] = entry.taxpayer || "";
        payload[`fatca_id_type_${suffix}`] = entry.iType || "";
        payload[`fatca_tax_payer_country_${suffix}`] = entry.country || "";
      });
      
      var response_obj = await addFatcaDetails(payload);
     
      var error_code = response_obj.status_code;
      if (error_code == 200) {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Taxpayer added successfully.", type: "success" },
        });
        setEditMode(false);
        setTimeout(() => {
          props.onNext();
        }, 2000);
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Something went wrong.", type: "error" },
        });
        setEditMode(true);
      }
    } catch (e) {
      console.log("catch", e);
    }
  };


  return (
    <>
      <ToastContainer />
      <Row className="reverse">
        <div className="col-12 col-md-6 ProfileImg">
          <div>
            <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/05_Fatca_details.svg"} alt="" />
          </div>
        </div>
        <div className="col-12 col-md-6 RightPanel">
          <div className="rhl-inner">
            {showBack == true && (
              <FintooProfileBack
                title="FATCA Details"
                onClick={() => props.setShowPanel("FatcaAll")}
              />
            )}

            <div className="Fatca">
              <div
                className=""
                style={{
                  marginTop: "-1rem",
                }}
              >
                <div className="profile-space-1">
                  <Form.Label className="LabelName" htmlFor="inputText">
                    Overseas Address
                  </Form.Label>
                  <FloatingLabel controlId="floatingTextarea2">
                    <textarea
                      className="form-control shadow-none"
                      required
                      placeholder="Enter your address here"
                      style={{
                        height: "140px",
                        borderRadius: "10px",
                        textAlign: "left",
                      }}
                      value={osAddress}
                      onChange={(event) => {
                        setOSAddress(event.target.value);
                      }}
                      maxLength="250"
                    />
                    {simpleValidator.current.message(
                      "overseasAddress",
                      osAddress,
                      "required|min:6|max:250",
                      {
                        messages: {
                          required: "Please enter your Overseas Address.",
                          max: "The Overseas Address should not be greater than 250 characters.",
                          min: "The Overseas Address should at least be of 6 characters.",
                        },
                      }
                    )}
                  </FloatingLabel>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        ZIP code
                      </Form.Label>
                      <div className="position-relative">
                        <input
                          aria-label="Default select example"
                          className="shadow-none form-control"
                          style={{
                            borderRadius: "10px",
                            height: "2.5rem",
                            outline: "none",
                            paddingRight: isLoadingLocation ? "40px" : "12px",
                          }}
                          value={zipCode}
                          // pattern="^\d{5}(?:[-\s]\d{4})?$"
                          pattern="^[A-Za-z0-9\-]{1,10}$"
                          onChange={(event) => {
                            setZipCode(event.target.value);
                          }}
                          // onKeyPress={(event) => {
                          //   if (!/[0-9]/.test(event.key)) {
                          //     event.preventDefault();
                          //   }
                          // }}
                          onKeyPress={(event) => {
                            if (!/[A-Za-z0-9\-]/.test(event.key)) {
                              event.preventDefault(); // Block non-alphanumeric characters
                            }
                          }}
                          maxLength="9"
                          placeholder="Enter ZIP code"
                        />
                        {isLoadingLocation && (
                          <div 
                            className="position-absolute top-50 end-0 translate-middle-y me-2"
                            style={{ zIndex: 10 }}
                          >
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {simpleValidator.current.message(
                        "zipCode",
                        zipCode,
                        "required"
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Country
                      </Form.Label>
                      <select
                        controlId="validationCustom02"
                        required
                        className="shadow-none form-select"
                        aria-label="Default select example"
                        style={{
                          borderRadius: "10px",
                          height: "2.5rem",
                          outline: "none",
                          backgroundColor: isAutoFilled ? "#f8f9fa" : "white",
                          color: isAutoFilled ? "#6c757d" : "inherit",
                        }}
                        onChange={(event) => setCountryId(event.target.value)}
                        value={countryId}
                        disabled={false}
                      >
                        <option value="" selected disabled>
                          Select
                        </option>
                        {countryList.map((w) => (
                          <option
                            key={w.country_id}
                            value={w.country_id}
                          >
                            {w.country_name}
                          </option>
                        ))}
                      </select>
                      {simpleValidator.current.message(
                        "country",
                        countryId,
                        "required"
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        State
                      </Form.Label>
                      <select
                        controlId="validationCustom02"
                        required
                        className="shadow-none form-select"
                        aria-label="Default select example"
                        style={{
                          borderRadius: "10px",
                          height: "2.5rem",
                          outline: "none",
                          backgroundColor: isAutoFilled ? "#f8f9fa" : "white",
                          color: isAutoFilled ? "#6c757d" : "inherit",
                        }}
                        onChange={(event) => setStateId(event.target.value)}
                        value={stateId}
                        disabled={false}
                      >
                        <option value="" selected disabled>
                          Select
                        </option>
                        {stateList && stateList.map((b) => {
                          return (
                            <option key={b.state_id} value={b.state_id}>{b.state_name}</option>
                          );
                        })}
                      </select>
                      {simpleValidator.current.message(
                        "state",
                        stateId,
                        "required"
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        City
                      </Form.Label>
                      <select
                        controlId="validationCustom02"
                        required
                        className="shadow-none form-select"
                        aria-label="Default select example"
                        style={{
                          borderRadius: "10px",
                          height: "2.5rem",
                          outline: "none",
                        }}
                        onChange={(event) => setCityId(event.target.value)}
                        value={cityId}
                      >
                        <option value="" selected disabled>
                          Select
                        </option>
                        {cityList && cityList.map((x) => {
                          return (
                            <option key={x.city_id} value={x.city_id}>{x.city_name}</option>
                          );
                        })}
                      </select>
                      {simpleValidator.current.message(
                        "city",
                        cityId,
                        "required"
                      )}
                    </div>
                  </div>
                </div>

                {[...taxData].map((v, i) => (
                  <div key={`ff-${i}-${v.taxpayer}`}>
                    {editNumber == i ? (
                      <></>
                    ) : (
                      <div className="d-flex mylist-items my-3">
                        <div className="txi-item">
                          <div className="my-badge">{i + 1}</div>
                        </div>
                        <table className="flex-grow-1 ftc-tbl">
                          <tr>
                            <td>
                              <p className="tbl-head">Taxpayer ID</p>
                              <p className="tbl-txt">{v.taxpayer}</p>
                            </td>
                            <td>
                              <p className="tbl-options">
                                <span>
                                  <FaTrashAlt
                                    onClick={() => {
                                      setTaxData((x) =>
                                        [...x].filter((b, k) => k != i)
                                      );
                                    }}
                                  />
                                </span>
                                <span>
                                  <FaEdit
                                    onClick={() => {
                                      setFormObject({ ...v });
                                      setEditNumber(i);
                                      setAddMore(false);
                                      setEditMode(true);
                                    }}
                                  />
                                </span>
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <p className="tbl-head">Identification Type</p>
                              <p className="tbl-txt">{v.iType}</p>
                            </td>
                            <td>
                              <p className="tbl-head">Country</p>
                              <p className="tbl-txt">
                                {countryList.find(x => x.country_id === v.country)?.country_name || ""}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </div>
                    )}
                    {editNumber == i && (
                      <div className="mylist-items my-3 position-relative">
                        <div className="btn-cross">
                          <FaMinusCircle
                            className=" fintoo-blue"
                            onClick={() => cancelForm()}
                          />
                        </div>
                        <div className="row">
                          <div className="col-12 col-md-6">
                            <div className="profile-space-1">
                              <Form.Label
                                className="LabelName"
                                htmlFor="inputText"
                              >
                                Taxpayer ID
                              </Form.Label>
                              <input
                                value={formObject.taxpayer}
                                onChange={(event) => {
                                  setFormObject((x) => ({
                                    ...x,
                                    taxpayer: event.target.value,
                                  }));
                                }}
                                pattern="^(9\d{2})([ \-]?)([7]\d|8[0-8])([ \-]?)(\d{4})$"
                                maxLength={11}
                                aria-label="Default select example"
                                className="shadow-none form-control"
                              />
                              {simpleValidator.current.message(
                                "taxpayerId",
                                formObject.taxpayer,
                                "required"
                              )}
                            </div>
                          </div>

                          <div className="col-12 col-md-6">
                            <div className="profile-space-1">
                              <Form.Label
                                className="LabelName"
                                htmlFor="inputText"
                              >
                                Country
                              </Form.Label>
                              <select
                                controlId="validationCustom02"
                                required
                                className="shadow-none form-select"
                                aria-label="Default select example"
                                style={{
                                  borderRadius: "10px",
                                  height: "2.5rem",
                                  outline: "none",
                                }}
                                onChange={(event) => {
                                  setFormObject((x) => ({
                                    ...x,
                                    country: event.target.value,
                                  }));
                                }}
                              >
                                <option value="0" selected disabled>
                                  Select
                                </option>
                                {countryList.map((c) => (
                                  <option
                                    selected={
                                      c.country_id == formObject.country
                                    }
                                    value={c.country_id}
                                  >
                                    {c.country_name}
                                  </option>
                                ))}
                              </select>
                              {simpleValidator.current.message(
                                "country",
                                formObject.country,
                                "required"
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-md-6">
                            <div className="profile-space-1 pb-0">
                              <Form.Label
                                className="LabelName"
                                htmlFor="inputText"
                              >
                                Identification Type
                              </Form.Label>
                              <input
                                controlId="validationCustom02"
                                required
                                className="shadow-none form-control"
                                aria-label="Default select example"
                                style={{
                                  borderRadius: "10px",
                                  height: "2.5rem",
                                  outline: "none",
                                }}
                                maxLength="20"
                                onChange={(event) => {
                                  setFormObject((x) => ({
                                    ...x,
                                    iType: event.target.value,
                                  }));
                                }}
                                value={formObject.iType}
                              />

                              {simpleValidator.current.message(
                                "IdentificationType",
                                formObject.iType,
                                "required"
                              )}
                            </div>
                          </div>
                          <div className="col-12 col-md-6 ">
                            <div className="profile-space-1 pb-0">
                              <Form.Label className="LabelName">
                                &nbsp;
                              </Form.Label>
                              <div>
                                <FintooButton
                                  type="button"
                                  className={`d-block me-0 ms-auto`}
                                  onClick={() => {
                                    setTaxData((v) => [
                                      ...v,
                                      {
                                        taxpayer: formObject.taxpayer,
                                        country: formObject.country,
                                        iType: formObject.iType,
                                      },
                                    ]);
                                    editDetails();
                                    editValid.current ? updateData(i) : forceUpdate(2);
                                  }}
                                  title={"Save"}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {addMore && (
                  <div className="mylist-items my-3 position-relative">
                    <div className="btn-cross">
                      <FaMinusCircle
                        className=" fintoo-blue"
                        onClick={() => cancelForm()}
                      />
                    </div>
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <div className="profile-space-1">
                          <Form.Label className="LabelName" htmlFor="inputText">
                            Taxpayer ID
                          </Form.Label>
                          <input
                            aria-label="Default select example"
                            className="shadow-none form-control"
                            onChange={(e) => {
                              setDemo(e.target.value);
                              setFormObject((v) => ({
                                ...v,
                                taxpayer: e.target.value,
                              }));
                            }}
                            maxLength={11}
                            value={formObject.taxpayerId}
                          />
                          
                          {simpleValidator.current.message(
                            "taxpayerId",
                            formObject.taxpayer,
                            "required"
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="profile-space-1">
                          <Form.Label className="LabelName" htmlFor="inputText">
                            Country
                          </Form.Label>
                          <select
                            controlId="validationCustom02"
                            required
                            className="shadow-none form-select"
                            aria-label="Default select example"
                            style={{
                              borderRadius: "10px",
                              height: "2.5rem",
                              outline: "none",
                            }}
                            onChange={(e) => {
                              setFormObject((v) => ({
                                ...v,
                                country: e.target.value,
                              }));
                            }}
                            value={formObject.country}
                          >
                            <option value="0" selected disabled>
                              Select
                            </option>
                            {countryList.map((a) => (
                              <option value={a.country_id}>
                                {a.country_name}
                              </option>
                            ))}
                          </select>
                          {simpleValidator.current.message(
                            "country",
                            formObject.country,
                            "required"
                          )}
                        </div>
                      </div>

                      <div className="col-12 col-md-6">
                        <div className="profile-space-1 pb-0">
                          <Form.Label className="LabelName" htmlFor="inputText">
                            Identification Type
                          </Form.Label>
                          <input
                            controlId="validationCustom02"
                            required
                            className="shadow-none form-control"
                            aria-label="Default select example"
                            style={{
                              borderRadius: "10px",
                              height: "2.5rem",
                              outline: "none",
                            }}
                            onChange={(e) => {
                              setFormObject((v) => ({
                                ...v,
                                iType: e.target.value,
                              }));
                            }}
                            maxLength="20"
                            value={formObject.iType}
                          />
                          {simpleValidator.current.message(
                            "IdentificationType",
                            formObject.iType,
                            "required"
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-6 ">
                        <div className="profile-space-1 pb-0">
                          <Form.Label className="LabelName">&nbsp;</Form.Label>
                          <div>
                            <FintooButton
                              type="button"
                              className={`d-block me-0 ms-auto`}
                              onClick={() => {
                                addDetails();
                              }}
                              title={"Save"} //button to add taxpayer ID
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {taxData.length < 3 && (
                  <div
                    className="profile-addmore noselect"
                    onClick={() => {
                      simpleValidator.current.hideMessages();
                      forceUpdate(2);
                      setAddMore(true);
                      setEditMode(false);
                      setEditNumber(null);
                      setFormObject({});
                    }}
                  >
                    + Add New Taxpayer ID
                  </div>
                )}
              </div>

                <div className="profile-space d-flex fintoo-top-border mt-4">
                <div>
                  <p className="mt-1 mb-1">
                    <b>Note</b>: You can add up to 3 Taxpayer IDs
                  </p>
                </div>
                <FintooButton
                  className={`d-block me-0 ms-auto`}
                  onClick={() => validateForm()}
                  title={"Next"}
                />{" "}
              </div>
            </div>
          </div>
        </div>
      </Row>
    </>
  );
}

export default FatcaAdd;
