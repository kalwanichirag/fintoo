import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "react-responsive-modal/styles.css";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import FintooButton from "../../../HTML/FintooButton";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import { getUserId, getPublicMediaURL } from "../../../../common_utilities";
import { useDispatch, useSelector } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import FintooLoader from "../../../../components/FintooLoader";
import { GetCities, GetCountries, GetStates } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { fetchUserProfileDetails, updateBasicDetails } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";

const API_TIMEOUT = 10000;

function AadharAddress({ onNext, onPrevious }) {
  const dispatch = useDispatch();
  const showBack = useSelector((state) => state.isBackVisible);

  const validator = useRef(new SimpleReactValidator());
  const debounceRef = useRef();
  const apiCountryRef = useRef();
  const locationRef = useRef(null);
  const dataExistRef = useRef(false);
  const lastFetched = useRef({ country: null, state: null, pincode: null });
  const isProfileLoaded = useRef(false);

  const [validated, setValidated] = useState(false);
  const [showLoad, setShowLoad] = useState(false);

  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [countries, setCountries] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [statesList, setStatesList] = useState([]);
  const [stateId, setStateId] = useState("");
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState("");

  const showError = (msg = "Something went wrong") =>
    dispatch({ type: "RENDER_TOAST", payload: { message: msg, type: "error" } });

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCountries();
  }, []);

  useEffect(() => {
    if (countries.length && !isProfileLoaded.current) {
      isProfileLoaded.current = true;
      prefillProfile();
    }
  }, [countries]);

  useEffect(() => {
    if (!countryId || dataExistRef.current || lastFetched.current.country === countryId) return;
    lastFetched.current.country = countryId;
    fetchStates(countryId);
  }, [countryId]);

  useEffect(() => {
    if (!stateId || dataExistRef.current || lastFetched.current.state === stateId) return;
    lastFetched.current.state = stateId;
    fetchCities(stateId);
  }, [stateId]);

  useEffect(() => {
    return () => {
      apiCountryRef.current?.abort();
      clearTimeout(debounceRef.current);
    };
  }, []);

  const loadCountries = async () => {
    try {
      setShowLoad(true);
      const res = await GetCountries();
      if (!res?.data) throw new Error();

      setCountries(res.data);
      const india = res.data.find((c) => c.country_name.toLowerCase() === "india");
      if (india) setCountryId(india.country_id);
    } catch {
      showError();
    } finally {
      setShowLoad(false);
    }
  };

  const prefillProfile = async () => {
    try {
      const res = await fetchUserProfileDetails(getUserId());
      if (!res?.data) throw new Error();

      const profile = res.data;
      setAddress(profile.address || "");

      if (profile.user_pincode) {
        dataExistRef.current = true;
        setPincode(profile.user_pincode);
        setStateId(profile.user_state || "");
        setCityId(profile.user_city || "");

        if (countryId) {
          const statesRes = await GetStates(countryId);
          setStatesList(statesRes?.data || []);

          if (profile.user_state) {
            const citiesRes = await GetCities(profile.user_state);
            setCities(citiesRes?.data || []);
          }
        }
      }
    } catch (e) {
      console.error("Prefill failed:", e);
      showError();
    }
  };

  const fetchAutoCountry = async () => {
    if (pincode.length !== 6 || lastFetched.current.pincode === pincode) return;
    lastFetched.current.pincode = pincode;

    try {
      setShowLoad(true);
      locationRef.current = null;

      apiCountryRef.current?.abort();
      apiCountryRef.current = new AbortController();

      const res = await axios.get(`${process.env.REACT_APP_PINCODE_CHECK}${pincode}`, {
        signal: apiCountryRef.current.signal,
        timeout: API_TIMEOUT,
      });

      const data = res?.data?.data;
      if (!data?.Country) throw new Error();

      locationRef.current = data;

      const matchCountry = countries.find(
        (c) => c.country_name.toLowerCase() === data.Country.toLowerCase()
      );
      if (!matchCountry) throw new Error("Country not supported");
      setCountryId(matchCountry.country_id);

      const statesRes = await GetStates(matchCountry.country_id);
      const statesData = statesRes?.data || [];
      setStatesList(statesData);

      if (data.State) {
        const matchState = statesData.find((s) =>
          s.state_name.toLowerCase().includes(data.State.toLowerCase())
        );
        if (matchState) {
          setStateId(matchState.state_id);

          const citiesRes = await GetCities(matchState.state_id);
          const citiesData = citiesRes?.data || [];
          setCities(citiesData);

          if (data.District) {
            const matchCity = citiesData.find((c) =>
              c.city_name.toLowerCase().includes(data.District.toLowerCase())
            );
            if (matchCity) setCityId(matchCity.city_id);
          }
        }
      }
    } catch (e) {
      console.error(e);
      showError("Please enter a valid PIN Code" || e?.response?.data?.message);
    } finally {
      setShowLoad(false);
    }
  };

  const fetchStates = async (cId) => {
    try {
      const res = await GetStates(cId);
      setStatesList(res?.data || []);

      if (locationRef.current?.State) {
        const match = res.data.find((s) =>
          s.state_name.toLowerCase().includes(locationRef.current.State.toLowerCase())
        );
        if (match) setStateId(match.state_id);
      }
    } catch {
      console.error("State fetch failed");
    }
  };

  const fetchCities = async (sId) => {
    try {
      const res = await GetCities(sId);
      setCities(res?.data || []);

      if (locationRef.current?.District) {
        const match = res.data.find((c) =>
          c.city_name.toLowerCase().includes(locationRef.current.District.toLowerCase())
        );
        if (match) setCityId(match.city_id);
      }
    } catch {
      console.error("City fetch failed");
    }
  };

  const handlePincodeBlur = () => {
    validator.current.showMessageFor("pincode");
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (validator.current.fieldValid("pincode")) {
        dataExistRef.current = false;
        fetchAutoCountry();
      }
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.current.allValid()) {
      validator.current.showMessages();
      setValidated(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const payload = {
        country_code: "+91",
        address,
        pincode,
        city: cityId,
        state: stateId,
        country: countryId,
        user_id: getUserId(),
      };

      const res = await updateBasicDetails(payload);

      if (res?.status_code === 200) {
        const selectedCity = cities.find(
          (c) => String(c.city_id) === String(cityId)
        );

        if (window?.webengage?.user && selectedCity?.city_name) {
          window.webengage.user.setAttribute(
            "User City",
            selectedCity.city_name.trim()
          );
        }

        dispatch({
          type: "RENDER_TOAST",
          payload: { message: res?.message || "Updated successfully", type: "success" },
        });

        setTimeout(() => {
          onNext();
        }, 300);

      } else {
        showError(res?.message);
      }

    } catch (e) {
      console.error("API Error:", e);

      showError(
        e?.response?.data?.message ||
        e?.message ||
        "Something went wrong"
      );
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
          {showBack && <FintooProfileBack title="Confirm your Address" onClick={onPrevious} />}
          <div>
            <p></p>
            Your address should be as mentioned in your legal document.
          </div>
          <div className="VerifyDetails" style={{ marginTop: "0rem" }}>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <div className="Nominee_Identity" style={{ marginTop: "0rem" }}>
                <div className="profile-space-1">
                  <Form.Label className="LabelName">Address:</Form.Label>

                  <textarea
                    placeholder="Enter address here"
                    className="shadow-none form-control"
                    style={{ height: "140px", borderRadius: "10px" }}
                    value={address}
                    onChange={(e) => {
                      let value = e.target.value;

                      const cleanedValue = value.replace(/[^a-zA-Z0-9\s,.\-/]/g, "");

                      setAddress(cleanedValue.replace(/\s+/g, " ").trimStart());
                    }}
                    onBlur={() => validator.current.showMessageFor("address")}
                    maxLength={250}
                  />

                  {validator.current.message(
                    "address",
                    address,
                    "required|min:10|max:250",
                    {
                      messages: {
                        required: "Please enter Address.",
                        min: "Address must be at least 10 characters.",
                        max: "The address should not be greater than 250 characters.",
                      },
                    }
                  )}
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 profile-space-1">
                    <Form.Label className="LabelName">Pin Code:</Form.Label>
                    <input
                      maxLength="6"
                      className="shadow-none form-control"
                      style={{ borderRadius: "10px", height: "2.5rem", outline: "none" }}
                      value={pincode}
                      onChange={(e) => {
                        if (e.target.value === "" || /^\d+$/.test(e.target.value)) {
                          setPincode(e.target.value);
                          setStateId("");
                          setCityId("");
                          setCities([]);
                          setStatesList([]);
                          locationRef.current = null;
                          lastFetched.current.pincode = null;
                        }
                      }}
                      onBlur={handlePincodeBlur}
                    />
                    {validator.current.message("pincode", pincode, "required|max:6|min:6", {
                      messages: { required: "Please enter Pin Code." },
                    })}
                  </div>

                  <div className="col-12 col-md-6 profile-space-1">
                    <Form.Label className="LabelName">Country:</Form.Label>
                    <select
                      required
                      className="shadow-none form-select"
                      style={{ borderRadius: "10px", height: "2.5rem", outline: "none" }}
                      value={countryId}
                      onChange={(e) => {
                        setCountryId(e.target.value);
                        setStateId("");
                        setCityId("");
                        setStatesList([]);
                        setCities([]);
                        setPincode("");
                        locationRef.current = null;
                        lastFetched.current.pincode = null;
                      }}
                    >
                      <option value="">Select</option>
                      {countries.map((c) => (
                        <option key={c.country_id} value={c.country_id}>
                          {c.country_name}
                        </option>
                      ))}
                    </select>
                    {validator.current.message("country", countryId, "required")}
                  </div>

                  <div className="col-12 col-md-6 profile-space-1">
                    <Form.Label className="LabelName">State:</Form.Label>
                    <select
                      required
                      className="shadow-none form-select"
                      value={stateId || ""}
                      onChange={(e) => {
                        const selectedStateId = e.target.value;
                        setStateId(selectedStateId);
                        setCityId("");
                        setCities([]);
                        setPincode("");
                        locationRef.current = null;
                        lastFetched.current.pincode = null;
                      }}
                    >
                      <option value="">Select</option>
                      {statesList.map((s) => (
                        <option key={s.state_id} value={s.state_id}>
                          {s.state_name}
                        </option>
                      ))}
                    </select>
                    {validator.current.message("state", stateId || "", "required", {
                      messages: { required: "Please select a state." },
                    })}
                  </div>

                  <div className="col-12 col-md-6 profile-space-1">
                    <Form.Label className="LabelName">City:</Form.Label>
                    <select
                      required
                      className="shadow-none form-select"
                      value={cityId || ""}
                      onChange={(e) => {
                        const selectedCityId = e.target.value;
                        setCityId(selectedCityId);
                        setPincode("");
                        locationRef.current = null;
                        lastFetched.current.pincode = null;
                      }}
                    >
                      <option value="">Select</option>
                      {cities.map((c) => (
                        <option key={c.city_id} value={c.city_id}>
                          {c.city_name}
                        </option>
                      ))}
                    </select>
                    {validator.current.message("city", cityId || "", "required", {
                      messages: { required: "Please select a city." },
                    })}
                  </div>
                </div>
              </div>

              <hr className="ProfileHr" />
              <div className="pt-2">
                <FintooButton type="submit" className="d-block me-0 ms-auto" title="Next" />
              </div>
            </Form>
          </div>
          <p>&nbsp;</p>
        </div>
      </Col>
    </Row>
  );
}

export default AadharAddress;