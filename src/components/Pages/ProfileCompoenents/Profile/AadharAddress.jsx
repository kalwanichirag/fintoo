import { useState, useEffect, useRef } from "react";
import "react-responsive-modal/styles.css";
import Link from "../../../MainComponents/Link";
import LocationImg from "../../../Assets/03_Location_search.svg";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import Back from "../../../Assets/left-arrow.png";
import FintooButton from "../../../HTML/FintooButton";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import useForm from "./useForm";
import {} from "../../../../constants";
import {
  fetchEncryptData,
  getUserId,
  memberId,
  user_id,
  getPublicMediaURL
} from "../../../../common_utilities";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import commonEncode from "../../../../commonEncode";
import {
  apiCall,
  successAlert,
  errorAlert,
  CheckSession,
} from "../../../../common_utilities";
import { format } from "date-fns";
import WhiteOverlay from "../../../HTML/WhiteOverlay";
import { useDispatch, useSelector } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import FintooLoader from "../../../../components/FintooLoader";
import { GetCities, GetCountries, GetStates } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { fetchUserProfileDetails, updateBasicDetails } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";

function AadharAddress(props) {
  const simpleValidator = useRef(new SimpleReactValidator());
  const locationRef = useRef(null);
  const dataExistRef = useRef(false);
  const [validated, setValidated] = useState(false);
  const [selectVisibleCountry, setSelectVisibleCountry] = useState(true);
  const [selectVisibleState, setSelectVisibleState] = useState(true);
  const [selectVisibleCity, setSelectVisibleCity] = useState(true);
  const dispatch = useDispatch();
  const { AadharAddress } = useSearchParams();
  const showBack = useSelector((state) => state.isBackVisible);

  // for populating list
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [reloadPincode, setReloadPincode] = useState(false);
  const [addressDisable, setAddressDisable] = useState(false);
  const [userzip, setzip] = useState(false);
  const [usercity, setcity] = useState(false);
  const [userstate, setstate] = useState(false);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [reloadCountry, setReloadCountry] = useState(false);
  const [statesList, setStatesList] = useState("");
  const [stateId, setStateId] = useState("");
  const [reloadState, setReloadState] = useState(false);
  const [cityId, setCityId] = useState("");
  const [reloadCity, setReloadCity] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [loadFromAadhar, setLoadFromAadhar] = useState(false);
  const [user_district, setUserDistrict] = useState("");
  const [user_country, setUserCountry] = useState("");
  const [user_locality, setUserLocality] = useState("");
  const [user_state, setUserSatate] = useState("");
  const userid = memberId();
  const [, forceUpdate] = useState();
  const apiCountryRef = useRef();
  const apiStateRef = useRef();
  const apiCityRef = useRef();


  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    populateCountry();
  }, []);

  const onLoadInIt = async () => {
    try {
      var responseobj = await fetchUserProfileDetails(getUserId());
      const req_req = localStorage.getItem("req");

      setAddress(responseobj.data["address"]);

      if ("user_pincode" in responseobj.data && responseobj.data["user_pincode"]) {
        dataExistRef.current = true;
        if ("user_state" in responseobj.data && responseobj.data["user_state"])
          setStateId(responseobj.data["user_state"]);
        if ("user_city" in responseobj.data && responseobj.data["user_city"])
          setCityId(responseobj.data["user_city"]);
        setPincode(responseobj.data["user_pincode"]);
      }

      var api_message = responseobj["message"];

      if (responseobj["status_code"] == 200) {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: api_message, type: "success" },
        });
      }
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something wents wrong", type: "error" },
      });
    }
  };

  useEffect(() => {
    if (pincode) {
      fetchAutoCountry();
    }
  }, [pincode]);

  useEffect(() => {
    if (countryId) {
      fetchAutoState();
    }
  }, [countryId]);

  useEffect(() => {
    if (stateId) {
      fetchAutoCity();
    }
  }, [stateId]);

  useEffect(() => {
    if (countries.length > 0) {
      onLoadInIt();
    }
  }, [countries]);

  // Cleanup function to clear timeouts and abort controllers
  useEffect(() => {
    return () => {
      if (apiCountryRef.current) {
        apiCountryRef.current.abort();
      }
      if (apiStateRef.current) {
        apiStateRef.current.abort();
      }
      if (apiCityRef.current) {
        apiCityRef.current.abort();
      }
    };
  }, []);

  
  const populateCountry = async () => {
    try {
      var res = await GetCountries();
      var a = res.data;
      setCountries(a);
      setCountryId(a.find(v => v.country_name.toLowerCase() === "india")?.country_id || "");
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went wrong...", type: "error" },
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    var formValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    forceUpdate(1);

    if (formValid === false) {
    } else {

      try {
        var payload = {
          country_code: "+91",
          address: address,
          pincode: pincode,
          city: cityId,
          state: stateId,
          country: countryId,
          user_id: getUserId()
        }
        
        var response = await updateBasicDetails(payload);

        if (response.status_code == 200) {
          const selectedCity = cities.find(
            (c) => String(c.city_id) === String(cityId)
          );
          if (
            window.webengage?.user &&
            selectedCity?.city_name
          ) {
            window.webengage.user.setAttribute(
              "User City",
              selectedCity.city_name.trim()
            );
            setTimeout(() => {
              props.onNext();
            }, 300);
          } else {
            props.onNext();
          }
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: response.message, type: "success" },
          });
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: response.message, type: "error" },
          });
        }
      } catch (e) {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: e.toString(), type: "error" },
        });
      }
    }
  };

  const fetchAutoCountry = async () => {
    try {
      setShowLoad(true);
      if(apiCountryRef.current) {
        apiCountryRef.current.abort();
      }
      apiCountryRef.current = new AbortController();
      
      // Add timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        if (apiCountryRef.current) {
          apiCountryRef.current.abort();
        }
      }, 10000); // 10 second timeout
      
      var res = await axios.get(process.env.REACT_APP_PINCODE_CHECK + pincode, {
        signal: apiCountryRef.current.signal,
        timeout: 10000
      });
      
      clearTimeout(timeoutId);
      var data = res.data.data;
      locationRef.current = { ...data };
      
      if(locationRef.current.State) {
        setstate(true);
      } else {
        setstate(false);
      }
      if(locationRef.current.District) {
        setcity(true);
      } else {
        setcity(false);
      }

      // Try exact match first, then case-insensitive match
      let index = -1;
      if (locationRef.current?.Country) {
        index = countries.findIndex(
          (v) => v.country_name === locationRef.current.Country
        );
        
        if (index === -1) {
          index = countries.findIndex(
            (v) => v.country_name.toLowerCase() === locationRef.current.Country.toLowerCase()
          );
        }
      }
      
      if (index > -1) {
        const selectedCountryId = "" + countries[index].country_id;
        setCountryId(selectedCountryId);
        // Now call fetchAutoState with the countryId directly
        try {
          await fetchAutoState(selectedCountryId);
        } catch (stateError) {
          console.error("Error in fetchAutoState:", stateError);
        }
      }
      setShowLoad(false);
    } catch (e) {
      console.error("Error in fetchAutoCountry:", e);
      setShowLoad(false);
    }
  };

  const fetchAutoState = async (countryIdParam = null) => {
    const currentCountryId = countryIdParam || countryId;
    if (Boolean(currentCountryId) == false) return;
    try {
      setShowLoad(true);
      // Only clear values if this is not an auto-fill operation
      if (dataExistRef.current === false && !locationRef.current?.State) {
        setStateId("");
        setCityId("");
      }
      if(apiStateRef.current) {
        apiStateRef.current.abort();
      }
      apiStateRef.current = new AbortController();
      
      // Add timeout
      const timeoutId = setTimeout(() => {
        if (apiStateRef.current) {
          apiStateRef.current.abort();
        }
      }, 10000);
      
      var res = await GetStates(currentCountryId);
      clearTimeout(timeoutId);
      var data = res.data;
      
      setStatesList(data);

      // Only try to auto-fill if we have location data from pincode
      if (locationRef.current?.State) {
        // Try exact match first, then case-insensitive match, then partial match
        let index = data.findIndex(
          (v) => v.state_name === locationRef.current.State
        );
        
        if (index === -1) {
          index = data.findIndex(
            (v) => v.state_name.toLowerCase() === locationRef.current.State?.toLowerCase()
          );
        }
        
        if (index === -1) {
          index = data.findIndex(
            (v) => v.state_name.toLowerCase().includes(locationRef.current.State?.toLowerCase() || '') ||
                   (locationRef.current.State?.toLowerCase() || '').includes(v.state_name.toLowerCase())
          );
        }
        
        if (index > -1) {
          const selectedStateId = "" + data[index].state_id;
          setStateId(selectedStateId);
          // Call fetchAutoCity with the stateId directly
          try {
            await fetchAutoCity(selectedStateId);
          } catch (cityError) {
            console.error("Error in fetchAutoCity:", cityError);
          }
        }
      }
      setShowLoad(false);
    } catch (e) {
      console.error("Error in fetchAutoState:", e);
      setShowLoad(false);
    }
  };

  const fetchAutoCity = async (stateIdParam = null) => {
    const currentStateId = stateIdParam || stateId;
    if (Boolean(countryId) == false || Boolean(currentStateId) == false) {
      return;
    }
    try {
      setShowLoad(true);
      // Only clear city if this is not an auto-fill operation
      if (dataExistRef.current === false && !locationRef.current?.District) {
        setCityId("");
      }
      if(apiCityRef.current) {
        apiCityRef.current.abort();
      }
      apiCityRef.current = new AbortController();

      // Add timeout
      const timeoutId = setTimeout(() => {
        if (apiCityRef.current) {
          apiCityRef.current.abort();
        }
      }, 10000);

      var response = await GetCities(currentStateId);
      clearTimeout(timeoutId);
      var data = response.data;
      
      setCities(data);
      
      // Only try to auto-fill if we have location data from pincode
      if (locationRef.current?.District) {
        
        // Try exact match first
        var index = data.findIndex(
          (v) => v.city_name === locationRef.current.District
        );
        
        // If no exact match, try case-insensitive match
        if (index === -1) {
          index = data.findIndex(
            (v) => v.city_name.toLowerCase() === locationRef.current.District?.toLowerCase()
          );
        }
        
        // If still no match, try partial match
        if (index === -1) {
          index = data.findIndex(
            (v) => v.city_name.toLowerCase().includes(locationRef.current.District?.toLowerCase() || '') ||
                   (locationRef.current.District?.toLowerCase() || '').includes(v.city_name.toLowerCase())
          );
        }
        
        if (index > -1) {
          const selectedCityId = "" + data[index].city_id;
          setCityId(selectedCityId);
        } else {
          console.log("No city match found");
        }
      } else {
        console.log("No District data available for city matching");
      }
      
      if(locationRef.current?.District) {
        setcity(true); 
      } else {
        setcity(false);
      }
      setShowLoad(false);
    } catch (e) {
      console.error("Error in fetchAutoCity:", e);
      setShowLoad(false);
    }
  };

  return (
    <Row className="reverse">
      <Col className="col-12 col-md-6 ProfileImg">
        <div>
          <img src={getPublicMediaURL("static/media/DMF/03_Location_search.svg")} alt="Location" />
        </div>
      </Col>
      <Col className="col-12 col-md-6 RightPanel">
        <FintooLoader show={showLoad} />
        <div className="rhl-inner">
          {showBack == true && (
            <FintooProfileBack
              title="Confirm your Address"
              onClick={() => props.onPrevious()}
            />
          )}
          <div>
            <p></p>
            Your address should be as mentioned in your legal document.
          </div>
          <div className="VerifyDetails" style={{ marginTop: "0rem" }}>
            <div className="">
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="Nominee_Identity" style={{ marginTop: "0rem" }}>
                  <div className="profile-space-1">
                    <Form.Label className="LabelName" htmlFor="inputText">
                      Address:
                    </Form.Label>
                    <textarea
                      placeholder="Enter address here"
                      className="shadow-none form-control"
                      style={{ height: "140px", borderRadius: "10px" }}
                      name="address"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value.trimStart());
                      }}
                      onBlur={() => {
                        simpleValidator.current.showMessageFor("address");
                      }}
                      autoComplete="off"
                    ></textarea>
                    {simpleValidator.current.message(
                      "address",
                      address?.replaceAll(" ", ""),
                      "required|min:10|max:250",
                      {
                        messages: {
                          required: "Please enter Address.",
                          max: "The address should not be greater than 250 characters.",
                        },
                      }
                    )}
                  </div>
                  <div className="row">
                    <div className=" col-12 col-md-6 profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Pin Code:
                      </Form.Label>
                      <input
                        maxLength="6"
                        aria-label="Default select example"
                        className="shadow-none form-control"
                        name="pincode"
                        style={{
                          borderRadius: "10px",
                          height: "2.5rem",
                          outline: "none",
                        }}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            /^\d+$/.test(e.target.value)
                          ) {
                            setPincode(e.target.value);
                          }
                        }}
                        value={pincode}
                        onBlur={() => {
                          simpleValidator.current.showMessageFor("pincode");
                          if (simpleValidator.current.fieldValid("pincode")) {
                            dataExistRef.current = false;
                            fetchAutoCountry();
                          }
                        }}
                        autoComplete="off"
                      />
                      {simpleValidator.current.message(
                        "pincode",
                        pincode,
                        "required|max:6|min:6",
                        { messages: { required: "Please enter Pin Code." } }
                      )}
                    </div>
                    <div className="col-12 col-md-6 profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Country:
                      </Form.Label>
                      <select
                        required
                        controlid="validationCustom02"
                        className="shadow-none form-select"
                        name="country"
                        aria-label="Default select example"
                        style={{
                          borderRadius: "10px",
                          height: "2.5rem",
                          outline: "none",
                        }}
                        onChange={(e) => {
                          setPincode("");
                          setCityId("");
                          setCities([]);
                          setCountryId(e.target.value);
                        }}
                        value={countryId}
                      >
                        <option key="selectCountry" value="">
                          Select
                        </option>

                        {countries &&
                          countries.map((v) => (
                            <option
                              key={v.country_id}
                              value={"" + v.country_id}
                            >
                              {v.country_name}
                            </option>
                          ))}
                      </select>
                      {simpleValidator.current.message(
                        "country",
                        countryId,
                        "required"
                      )}
                    </div>
                    <div className="col-12 col-md-6 profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        State:
                      </Form.Label>
                      <select
                        required
                        controlid="validationCustom02"
                        className="shadow-none form-select"
                        name="state"
                        aria-label="Default select example"
                        style={{
                          borderRadius: "10px",
                          height: "2.5rem",
                          outline: "none",
                        }}
                        onChange={(e) => {
                          setStateId(e.target.value);
                        }}
                        value={stateId ? "" + stateId : ""}
                      >
                        <option key="selectState" value="">
                          Select
                        </option>
                        {statesList &&
                          statesList.map((state) => (
                            <option
                              key={state.state_id}
                              value={"" + state.state_id}
                            >
                              {state.state_name}
                            </option>
                          ))}
                      </select>
                      {simpleValidator.current.message(
                        "state",
                        stateId || "",
                        "required",
                        { messages: { required: "Please select a state." } }
                      )}
                    </div>
                    <div className=" col-12 col-md-6 profile-space-1">
                      <div className=" ">
                        <Form.Label className="LabelName" htmlFor="inputText">
                          City:
                        </Form.Label>
                        <select
                          required
                          controlid="validationCustom02"
                          className="shadow-none form-select"
                          name="city"
                          aria-label="Default select example"
                          style={{
                            borderRadius: "10px",
                            height: "2.5rem",
                            outline: "none",
                          }}
                          value={cityId ? "" + cityId : ""}
                          onChange={(e) => {
                            setCityId("" + e.target.value);
                          }}
                        >
                          <option key="selectCity" value="">
                            Select
                          </option>
                          {cities &&
                            cities.map((city) => (
                              <option key={city.city_id} value={"" + city.city_id}>
                                {city.city_name}
                              </option>
                            ))}
                        </select>
                        {simpleValidator.current.message(
                          "city",
                          cityId || "",
                          "required",
                          { messages: { required: "Please select a city." } }
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="ProfileHr" />
                <div className="pt-2">
                  <FintooButton
                    type="submit"
                    className="d-block me-0 ms-auto"
                    title="Next"
                    onSubmit={handleSubmit}
                  />
                </div>
              </Form>
            </div>
          </div>
          <p>&nbsp;</p>
        </div>
      </Col>
    </Row>
  );
}

export default AadharAddress;
