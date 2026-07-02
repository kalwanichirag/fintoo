import React, { useEffect, useState, useRef } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import FintooBackButton from "../../../components/HTML/FintooBackButton";
import OTPInput from "otp-input-react";
import commonEncode from "../../../commonEncode";
import { BASE_API_URL, DATA_BELONGS_TO } from "../../../constants";
import { useDispatch } from "react-redux";
import { } from "../../../constants";
import ProfileImage from "../../../Assets/Images/uni-user-ic.svg";
import axios from "axios"
import {
  fetchData,
  fetchEncryptData,
  getUserId,
} from "../../../common_utilities";

import FintooDatePicker from "../../../components/HTML/FintooDatePicker";
import moment from "moment";
import ImageUploader from "react-images-upload";
import { fetchUserProfileDetails, getRelationList, sendMail, sendOTP, verifyOTP } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { BseClientRegistration, GetCities, GetCountries, GetStates } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { addNomineeDetails, updateNomineeDetails } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";

function AddNominee(props) {
  const userid = getUserId();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [show123, setShow123] = useState(false);
  const handleClose123 = () => setShow123(false);
  const timer = useRef({ obj: null, counter: 120, default: 120 });
  const [count, setCount] = useState(120);
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState("");
  const [nomineerelationship, setnomineerelationship] = useState("");
  const [dateofbirth, setdateofbirth] = useState("");
  const [gardianname, setgardianname] = useState("");
  const [OTP, setOTP] = useState("");
  const [user_mobile, setUserMobile] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const dispatch = useDispatch();
  const dataExistRef = useRef(false);
  const apiCountryRef = useRef();
  const apiStateRef = useRef();
  const apiCityRef = useRef();
  const locationRef = useRef(null);
  // const [error, setError] = useState({});
  const [nomineerelations, setNomineeRelations] = useState([]);
  const randomOTP = useRef(Math.floor(Math.random() * 90000) + 10000);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    onLoadInIt();
    getNomineeRelations();
  }, [user_mobile, useremail]);

  const cleanAddress = (value) => {
    return value
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ")
      .replace(/[^a-zA-Z0-9\s,.\-/]/g, "")
      .trimStart();
  };

  const onLoadInIt = async () => {
    try {
      var response = await fetchUserProfileDetails(userid);

      if (response.status_code == 200) {
        setUserDetails(response.data);
        setUserMobile(response.data.mobile);
        setUserEmail(response.data.user_email);
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.message, type: "error" },
        });
      }
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went wrong...", type: "error" },
      });
    }
  };

  var total = parseInt(window.localStorage.getItem("total"));
  if (isNaN(total)) {
    total = 0;
  }

  const startTimer = () => {
    setOTP("");
    clearInterval(timer.current.obj);
    timer.current.counter = timer.current.default;
    setCount(timer.current.counter);
    timer.current.obj = setInterval(() => {
      if (timer.current.counter == 0) {
        clearInterval(timer.current.obj);
        timer.current.counter = timer.current.default;
        return;
      }
      timer.current.counter = timer.current.counter - 1;
      setCount(timer.current.counter);
    }, 1000);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      if (name.length < 2) {
        setValidated(true);
      }
    }
  };

  const handleAddNomineeFlow = async () => {
    const nominee_payload = {
      nominee_full_name: nominee_first_name,
      nominee_dob: moment(nominee_dob).format("YYYY-MM-DD"),
      nominee_applicable: "100",
      nominee_relation_id: nominee_relation,
      user_id: userid,
      nominee_email,
      nominee_mobile,
      nominee_address_line_1: nominee_address1,
      nominee_address_line_2: nominee_address2,
      nominee_address_line_3: nominee_address3,
      nominee_pincode,
      nominee_city,
      nominee_state,
      nominee_country,
      nominee_id_proof_type,
      nominee_id_proof_number: nominee_id_proof_number.trim(),
      nominee_guardian_name,
    };

    try {
      const r = await addNomineeDetails(nominee_payload);

      if (r.status_code !== 200) {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: r.message, type: "error" },
        });
        return;
      }

      const ucc_payload = {
        user_id: userid,
        data_belongs_to: DATA_BELONGS_TO,
      };

      const response = await BseClientRegistration(ucc_payload);

      let isSuccess =
        response.status_code == 200 ||
        (response.message?.includes("modification") &&
          response.message?.includes("not found"));

      nominee_payload.nominee_is_authenticated = isSuccess ? 1 : 0;

      await updateNomineeDetails(nominee_payload);

      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: isSuccess
            ? "Nominee added successfully"
            : "Nominee added but BSE registration failed",
          type: isSuccess ? "success" : "warning",
        },
      });

      setShow123(false);
      props.refreshPage();
    } catch (e) {
      console.log("Flow error", e);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went wrong", type: "error" },
      });
    }
  };

  const fetchSms = async () => {
    const payload = {
      identifier: userDetails.mobile,
      for_otp: "mobile"
    }
    await sendOTP(payload);
  };

  const fetchMail = async () => {
    var otp = randomOTP.current;

    var payload = {
      subject: `Greetings from Fintoo! Your OTP verification code is ${otp}`,
      userdata: {
        to: userDetails.user_email,
      },
      template: `Greetings from Fintoo! Your OTP verification code is ${otp}`,
      contextvar: {},
    };
    await sendMail(payload);
  };

  const getNomineeRelations = async () => {
    try {
      var res = await getRelationList();

      setNomineeRelations(res?.data);
    } catch (e) { }
  };

  // ====================================================================================================================================
  const [countryStateCity, setSountryStateCity] = useState({
    countries: [],
    states: [],
    cities: []
  });

  const [error, setError] = useState({});

  const [nominee_first_name, setNominee_first_name] = useState("");
  const [percentage, setPercentage] = useState("");
  const [nominee_relation, setNominee_relation] = useState("");
  const [nominee_dob, setNominee_dob] = useState(null);
  const [nominee_guardian_name, setNominee_guardian_name] = useState("");
  const [nominee_email, setNominee_email] = useState("");
  const [nominee_mobile, setNominee_mobile] = useState("");
  const [nominee_address1, setNominee_address1] = useState("");
  const [nominee_address2, setNominee_address2] = useState("");
  const [nominee_address3, setNominee_address3] = useState("");
  const [nominee_pincode, setNominee_pincode] = useState("");
  const [nominee_city, setNominee_city] = useState("");
  const [nominee_state, setNominee_state] = useState("");
  const [nominee_country, setNominee_country] = useState("");
  const [nominee_id_proof_type, setNominee_id_proof_type] = useState("");
  const [nominee_id_proof_number, setNominee_id_proof_number] = useState("");
  const [id_proof_image, setId_proof_image] = useState(null);
  const [nominee_city_id, setNominee_city_id] = useState("");
  const [nominee_state_id, setNominee_state_id] = useState("");
  const [nominee_country_id, setNominee_country_id] = useState("");

  const validateForm = () => {
    const tempError = {};

    if (!nominee_first_name.trim()) {
      tempError.nominee_first_name = "Name is required";
    } else if (!/^[a-z A-Z]+$/.test(nominee_first_name)) {
      tempError.nominee_first_name = "Please enter valid Name";
    }

    if (!nominee_dob) {
      tempError.nominee_dob = "Date of birth is required";
    }

    if (
      moment().diff(moment(nominee_dob), "years") < 18 &&
      !nominee_guardian_name.trim()
    ) {
      tempError.nominee_guardian_name = "Parent/Guardian name is required.";
    }

    if (!nominee_relation) {
      tempError.nominee_relation = "Relation is required";
    }

    if (!nominee_email) {
      tempError.nominee_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nominee_email)) {
      tempError.nominee_email = "Invalid email";
    }

    if (!nominee_mobile) {
      tempError.nominee_mobile = "Mobile required";
    } else if (!/^[6-9]\d{9}$/.test(nominee_mobile)) {
      tempError.nominee_mobile = "Invalid mobile";
    }

    if (!nominee_address1) {
      tempError.nominee_address1 = "Address required";
    }

    if (!nominee_pincode) {
      tempError.nominee_pincode = "Pincode required";
    }

    if (!nominee_country) tempError.nominee_country = "Country required";
    if (!nominee_state) tempError.nominee_state = "State required";
    if (!nominee_city) tempError.nominee_city = "City required";

    if (!nominee_id_proof_type) {
      tempError.nominee_id_proof_type = "ID proof type required";
    }

    if (!nominee_id_proof_number) {
      tempError.nominee_id_proof_number = "ID proof number required";
    }

    // ❗ Fix: only validate image if uploader used
    // if (!id_proof_image) {
    //   tempError.id_proof_image = "Image required";
    // }

    setError(tempError);
    return Object.keys(tempError).length === 0;
  };

  const onDrop = (pictureFiles, pictureDataURLs) => {
    setId_proof_image(pictureFiles[0]);
  }

  const getCountries = async (returnArr) => {
    try {
      var res = await GetCountries();

      if (returnArr) {
        return res.data;
      } else {
        setSountryStateCity((prev) => ({ ...prev, countries: res.data }));
      }
    } catch (e) {
      console.log("catch", e);
    }
  };

  const getStates = async (returnArr, country_id) => {
    if (!country_id) return [];

    try {
      var res = await GetStates(country_id);

      if (returnArr) {
        return res.data;
      } else {
        setSountryStateCity((prev) => ({
          ...prev,
          states: res.data,
          cities: [],
        }));
      }
    } catch (e) {
      console.log("catch", e);
    }
  };

  const getCities = async (returnArr, state_id) => {
    if (!state_id) {
      return [];
    }

    try {
      var res = await GetCities(state_id);

      if (returnArr) {
        return res.data;
      } else {
        setSountryStateCity((prev) => ({ ...prev, cities: res.data }));
      }
    } catch (e) {
      console.log("catch", e);
    }
  };

  const onCountryChange = async (country_id) => {
    if (!country_id) return;
    setNominee_country(country_id);
    setNominee_state("");
    await getStates(false, country_id);
  }
  const onStateChange = async (state_id) => {
    if (!state_id) return;
    setNominee_state(state_id);
    setNominee_city("");
    await getCities(false, state_id);
  }

  const fetchAutoCountry = async () => {
    try {
      if (apiCountryRef.current) {
        apiCountryRef.current.abort();
      }
      apiCountryRef.current = new AbortController();

      var res = await axios.get(
        process.env.REACT_APP_PINCODE_CHECK + nominee_pincode,
        {
          signal: apiCountryRef.current.signal,
        }
      );
      var data = res.data.data;

      locationRef.current = { ...data };

      // Find and set country
      if (countryStateCity.countries && countryStateCity.countries.length > 0) {
        var countryIndex = countryStateCity.countries.findIndex((v, i) => {

          return v.country_name === locationRef.current.Country;
        });

        if (countryIndex > -1) {
          const selectedCountry = countryStateCity.countries[countryIndex];
          setNominee_country_id(selectedCountry.country_id);
          setNominee_country(selectedCountry.country_id);
          setError((prev) => ({
            ...prev,
            nominee_country: "",
          }));
          await fetchAutoState(selectedCountry.country_id);
        }
      }
    } catch (e) {
      console.log("Error fetching country from pincode:", e);
    }
  };

  const fetchAutoState = async (countryId = null) => {
    const currentCountryId = countryId || nominee_country_id;
    if (!currentCountryId) {
      return;
    }
    try {
      if (apiStateRef.current) {
        apiStateRef.current.abort();
      }
      apiStateRef.current = new AbortController();

      var res = await GetStates(currentCountryId);
      var data = res.data;
      setSountryStateCity((prev) => ({ ...prev, states: data, cities: [] }));

      // Find and set state
      var stateIndex = data.findIndex(
        (v) => v.state_name === locationRef.current.State
      );
      if (stateIndex > -1) {
        const selectedState = data[stateIndex];
        setNominee_state_id(selectedState.state_id);
        setNominee_state(selectedState.state_id);
        setError((prev) => ({
          ...prev,
          nominee_state: "",
        }));

        // Call fetchAutoCity directly with the state ID to avoid timing issues
        await fetchAutoCity(selectedState.state_id);
      }
    } catch (e) {
      console.log("Error fetching state:", e);
    }
  };

  const fetchAutoCity = async (stateId = null) => {
    const currentStateId = stateId || nominee_state_id;
    if (!currentStateId) {
      return;
    }
    try {
      if (apiCityRef.current) {
        apiCityRef.current.abort();
      }
      apiCityRef.current = new AbortController();

      var res = await GetCities(currentStateId);
      var data = res.data;

      if (data && data.length > 0) {
        setSountryStateCity((prev) => ({ ...prev, cities: data }));
      }

      // Try exact match first
      var index = data.findIndex(
        (v) => v.city_name === locationRef.current.District
      );

      // If no exact match, try case-insensitive match
      if (index === -1) {
        index = data.findIndex(
          (v) =>
            v.city_name.toLowerCase() ===
            locationRef.current.District?.toLowerCase()
        );
      }

      // If still no match, try partial match
      if (index === -1) {
        index = data.findIndex(
          (v) =>
            v.city_name
              .toLowerCase()
              .includes(locationRef.current.District?.toLowerCase()) ||
            locationRef.current.District?.toLowerCase().includes(
              v.city_name.toLowerCase()
            )
        );
      }

      if (index > -1) {
        const selectedCity = data[index];
        setNominee_city_id(selectedCity.city_id);
        setNominee_city(selectedCity.city_id);
        setError((prev) => ({
          ...prev,
          nominee_city: "",
        }));
      }
    } catch (e) {
      console.log("Error fetching cities:", e);
    }
  };

  const verifyOTPCode = async () => {

    try {
      const payload = {
        identifier: userDetails.mobile,
        for_otp: "mobile",
        otp: OTP
      }

      const response = await verifyOTP(payload);
      if (response.status_code == 200 || response.status_code == "200") {
        await handleAddNomineeFlow();
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.message, type: "error" },
        });
      }
    } catch (error) {
      console.log("Error in verifyOTP:", error);
    }

  }

  useEffect(() => {
    getCountries()
  }, [])

  useEffect(() => {
    if (nominee_pincode.length === 6) {
      dataExistRef.current = false;
      fetchAutoCountry();
    }
  }, [nominee_pincode]);
  // ====================================================================================================================================


  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <>
        <Row>
          <Col xs={12} lg={8}>
            <Row className="Bank-details">
              <Col xs={12} lg={12} className="b-layout">
                <div className="bank-name nomiee"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="sm:w-100">
                    <div className="memeber-logo">
                      <img
                        src={ProfileImage}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    className="lg:mt-2"
                  >
                    <div className="Edit-nominee">
                      <button
                        type="submit"
                        onClick={() => {
                          const isValid = validateForm();

                          if (!isValid) {
                            return;
                          }

                          randomOTP.current = Math.floor(Math.random() * 90000) + 10000;

                          setShow123(true);
                          startTimer();
                          fetchSms();
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </Col>

              <div className="b-subdetails col-12">
                <Row className="mb-3">
                  <Col
                    xs={12}
                    lg={12}
                    className="b-layout"
                  >
                    <div className="">
                      <div className="bank-label nomiee-label bank-data">
                        Nominee Name
                      </div>
                      <div className="bank-info">
                        <div>
                          <input
                            aria-label="Default select example"
                            className="shadow-none form-control"
                            placeholder="Nominee Name"
                            maxlength="40"
                            onChange={(e) =>
                              setNominee_first_name(e.target.value)
                            }
                            value={nominee_first_name}
                          />
                          {"nominee_first_name" in error && (
                            <div className="invalid-feedback d-block">
                              {error.nominee_first_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col
                    xs={12}
                    lg={6}
                    className="b-layout"
                  >
                    <div className="">
                      <div className="bank-label nomiee-label bank-data">
                        Nominee Relationship
                      </div>
                      <div className="bank-info">
                        <Form.Select
                          aria-label="Default select example"
                          className="shadow-none "
                          onChange={(e) =>
                            setNominee_relation(e.target.value)
                          }
                          value={nominee_relation}
                        >
                          <option value="">Select</option>
                          {nomineerelations.map((v) => (
                            <option value={v.relation_id}>
                              {v.relation_name}
                            </option>
                          ))}
                        </Form.Select>
                        {"nominee_relation" in error && (
                          <div className="invalid-feedback d-block">
                            {error.nominee_relation}
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col
                    xs={12}
                    lg={6}
                    className="b-layout"
                  >
                    <div className="">
                      <div className="bank-label nomiee-label bank-data">
                        Date of Birth
                      </div>
                      <div className="bank-info">
                        <div
                          className={`dob8 nominee-calendar ${nominee_dob ? "m_selected" : "m_empty"
                            }`}
                        >
                          <FintooDatePicker
                            maxDate={new Date()}
                            monthPlaceholder="MM"
                            yearPlaceholder="YYYY"
                            dayPlaceholder="DD"
                            className={`my-dob-calendar`}
                            onChange={(v) => setNominee_dob(moment(v).format('Y-MM-D'))}
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                            showMonthDropdown
                            showYearDropdown
                            selected={nominee_dob ? new Date(nominee_dob) : null}
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>
                        {"nominee_dob" in error && (
                          <div className="invalid-feedback d-block">
                            {error.nominee_dob}
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
                {
                  moment().diff(
                    moment(nominee_dob),
                    "years"
                  ) < 18 && <Row className="mb-3">
                    <Col
                      xs={12}
                      lg={12}
                      className="b-layout"
                    >
                      <div className="">
                        <div className="bank-label nomiee-label bank-data">
                          Guardian Name
                        </div>
                        <div className="bank-info">
                          <div>
                            <input
                              aria-label="Default select example"
                              className="shadow-none form-control"
                              placeholder="Guardian Name"
                              maxlength="40"
                              onChange={(e) =>
                                setNominee_guardian_name(e.target.value)
                              }
                              value={nominee_guardian_name}
                            />
                            {"nominee_guardian_name" in error && (
                              <div className="invalid-feedback d-block">
                                {error.nominee_guardian_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                }
                <Row className="mb-3">
                  <Col
                    xs={12}
                    lg={6}
                    className="b-layout"
                  >
                    <div className="">
                      <div className="bank-label nomiee-label bank-data">
                        Email
                      </div>
                      <div className="bank-info">
                        <div>
                          <input
                            aria-label="Default select example"
                            className="shadow-none form-control"
                            placeholder="Email"
                            maxlength="40"
                            onChange={(e) =>
                              setNominee_email(e.target.value)
                            }
                            value={nominee_email}
                          />
                          {"nominee_email" in error && (
                            <div className="invalid-feedback d-block">
                              {error.nominee_email}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col
                    xs={12}
                    lg={6}
                    className="b-layout"
                  >
                    <div className="">
                      <div className="bank-label nomiee-label bank-data">
                        Mobile
                      </div>
                      <div className="bank-info Nominee-name">
                        <div>
                          <input
                            aria-label="Default select example"
                            className="shadow-none form-control"
                            placeholder="Mobile"
                            type="number"
                            maxlength="40"
                            value={nominee_mobile}
                            onChange={(e) => setNominee_mobile(e.target.value)}
                          />
                          {"nominee_mobile" in error && (
                            <div className="invalid-feedback d-block">
                              {error.nominee_mobile}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col
                    xs={12}
                    lg={4}
                    className="b-layout"
                  >
                    <div className="">
                      <div className="bank-label nomiee-label bank-data">
                        Address line 1
                      </div>
                      <div className="bank-info Nominee-name">
                        <div>
                          <textarea
                            aria-label="Default select example"
                            className="shadow-none form-control"
                            placeholder="Address"
                            rows={4}
                            maxlength="40"
                            value={nominee_address1}
                            onChange={(e) => setNominee_address1(cleanAddress(e.target.value))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") e.preventDefault();
                            }}
                          />
                          {"nominee_address1" in error && (
                            <div className="invalid-feedback d-block">
                              {error.nominee_address1}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col
                    xs={12}
                    lg={4}
                    className="b-layout"
                  >
                    <div className="">
                      <div className="bank-label nomiee-label bank-data">
                        Address line 2
                      </div>
                      <div className="bank-info Nominee-name">
                        <div>
                          <textarea
                            aria-label="Default select example"
                            className="shadow-none form-control"
                            placeholder="Address"
                            rows={4}
                            maxlength="40"
                            value={nominee_address2}
                            onChange={(e) => setNominee_address2(cleanAddress(e.target.value))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") e.preventDefault();
                            }}
                          />
                          {"nominee_address2" in error && (
                            <div className="invalid-feedback d-block">
                              {error.nominee_address2}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col
                    xs={12}
                    lg={4}
                    className="b-layout"
                  >
                    <div className="">
                      <div className="bank-label nomiee-label bank-data">
                        Address line 3
                      </div>
                      <div className="bank-info Nominee-name">
                        <div>
                          <textarea
                            aria-label="Default select example"
                            className="shadow-none form-control"
                            placeholder="Address"
                            rows={4}
                            maxlength="40"
                            value={nominee_address3}
                            onChange={(e) => setNominee_address3(cleanAddress(e.target.value))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") e.preventDefault();
                            }}
                          />
                          {"nominee_address3" in error && (
                            <div className="invalid-feedback d-block">
                              {error.nominee_address3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col xs={12} lg={4} className="b-layout ">
                    <div className="bank-label nomiee-label bank-data">
                      Nominee ID type
                    </div>
                    <div className="bank-info">
                      <Form.Select
                        aria-label="Default select example"
                        className="shadow-none "
                        onChange={(e) => setNominee_id_proof_type(e.target.value)}
                        value={nominee_id_proof_type}
                      >
                        <option value="">Select</option>
                        <option value="PAN">PAN</option>
                        <option value="Aadhaar">Aadhaar</option>
                        <option value="Driving License">Driving license</option>
                      </Form.Select>
                      {"nominee_id_proof_type" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_id_proof_type}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} lg={4} className="b-layout ">
                    <div className="bank-label nomiee-label bank-data">
                      Nominee ID Number
                    </div>
                    <div className="bank-info">
                      <input
                        aria-label="Default select example"
                        className="shadow-none form-control"
                        placeholder="Nominee ID Number"
                        maxlength="40"
                        onChange={(e) => setNominee_id_proof_number(e.target.value)}
                        value={nominee_id_proof_number}
                      />
                      {"nominee_id_proof_number" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_id_proof_number}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} lg={4} className="b-layout ">
                    <div className="bank-label nomiee-label bank-data">
                      Pin code
                    </div>
                    <div className="bank-info">
                      <input
                        aria-label="Default select example"
                        className="shadow-none form-control"
                        placeholder="Pin code"
                        maxlength="40"
                        value={nominee_pincode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setNominee_pincode(value);
                        }}
                      />
                      {"nominee_pincode" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_pincode}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col xs={12} lg={4} className="b-layout ">
                    <div className="bank-label nomiee-label bank-data">
                      Country
                    </div>
                    <div className="bank-info">
                      <Form.Select
                        aria-label="Default select example"
                        className="shadow-none "
                        onChange={(e) => onCountryChange(e.target.value)}
                        value={nominee_country}
                      >
                        <option value="">Select</option>
                        {
                          countryStateCity.countries.map(data => <option value={data.country_id}>{data.country_name}</option>)
                        }
                      </Form.Select>
                      {"nominee_country" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_country}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} lg={4} className="b-layout ">
                    <div className="bank-label nomiee-label bank-data">
                      State
                    </div>
                    <div className="bank-info">
                      <Form.Select
                        aria-label="Default select example"
                        className="shadow-none "
                        onChange={(e) => onStateChange(e.target.value)}
                        value={nominee_state}
                      >
                        <option value="">Select</option>
                        {
                          countryStateCity.states.map(data => <option value={data.state_id}>{data.state_name}</option>)
                        }
                      </Form.Select>
                      {"nominee_state" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_state}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} lg={4} className="b-layout ">
                    <div className="bank-label nomiee-label bank-data">
                      City
                    </div>
                    <div className="bank-info">
                      <Form.Select
                        aria-label="Default select example"
                        className="shadow-none "
                        onChange={(e) => setNominee_city(e.target.value)}
                        value={nominee_city}
                      >
                        <option value="">Select</option>
                        {
                          countryStateCity.cities.map(data => <option value={data.city_id}>{data.city_name}</option>)
                        }
                      </Form.Select>
                      {"nominee_city" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_city}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
                {/* <div>
                  <ImageUploader
                    withIcon={false}
                    withPreview={true}
                    buttonText='Choose image'
                    label=""
                    singleImage={true}
                    onChange={onDrop}
                    imgExtension={[".jpg", ".gif", ".png", ".gif", ".svg"]}
                    maxFileSize={1048576}
                    fileSizeError=" file size is too big"
                    className="ImageUploaderCustomClass"
                  />
                  {"id_proof_image" in error && (
                    <div className="invalid-feedback d-block">
                      {error.id_proof_image}
                    </div>
                  )}
                </div> */}
                {/* <div className="invalid-feedback d-block">
                  Only .jpg and .png images are allowed
                </div> */}
              </div>
            </Row>
          </Col>

        </Row>
        <div className={`mt-3, mx-2 ${moment().diff(moment(nominee_dob), "years") < 18
          ? ""
          : "d-none"
          }`} style={{ fontFamily: "Red Hat Text" }}>
          <p className="mt-4">Since your nominee is a minor, please enter his/her guardian details. The guardian should not be the same as the Fintoo account holder -
            that’s you!</p><strong>Note:</strong> Account holder(s) cannot be a Guardian.</div>
        {/* {<p>hii</p>} */}

        <Modal
          className="NomineeModal white-modal"
          centered
          show={show}
          onHide={handleClose}
        >
          {/* <Modal.Header className="py-3">
         <div> <FintooBackButton onClick={() => props.onBack()} /></div>
          <div>
            <div className="modal-title">
              Do you really want delete Nominee ?
            </div>
            <div className="modal-title">Enter OTP</div>
          </div>
        </Modal.Header>
        > */}
          <div className="d-flex justify-center p-4">
            <div>
              {" "}
              <FintooBackButton onClick={handleClose} />
            </div>
            <div
              className="DeleteBank text-center pb-3 w-100"
              style={{
                borderBottom: "1px solid #eeee",
              }}
            >
              <div
                style={{
                  fontWeight: "500",
                }}
              >
                {" "}
                Do you really want delete Nominee ?
              </div>
              <div
                className="pt-2"
                style={{
                  fontWeight: "600",
                }}
              >
                Enter OTP
              </div>
            </div>
          </div>
          <div>
            <div>
              <div className="p-4">
                <div className="modal-whitepopup-box-item  border-top-0 text-center">
                  <p>Sent to</p>
                  <p>{user_mobile}</p>
                </div>
                <div className="d-flex justify-center align-items-center">
                  <center>
                    <OTPInput
                      value={OTP}
                      onChange={setOTP}
                      style={{
                        width: "8%",
                      }}
                      autoFocus
                      className="rounded rounded-otp"
                      OTPLength={6}
                      otpType="number"
                      disabled={false}
                    // secure
                    />
                  </center>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #eeee",
                  }}
                  className="text-center p-4 grey-color"
                >
                  {count == 0 && (
                    <p
                      className="pointer blue-color"
                      onClick={() => startTimer()}
                    >
                      Resend OTP
                    </p>
                  )}
                  {count > 0 && (
                    <p>
                      Expire in &nbsp;
                      <strong>
                        {moment().startOf("day").seconds(count).format("mm:ss")}
                      </strong>
                    </p>
                  )}
                </div>
              </div>
              <div
                className="mt-5  OTpConfirm"
                onClick={() => {
                  props.onRemove();
                }}
              >
                Continue
              </div>
            </div>
          </div>
        </Modal>
        {/* Save Nominee */}
        <Modal
          className="NomineeModal white-modal"
          centered
          show={show123}
          onHide={handleClose123}
        >
          {/* <Modal.Header className="py-3">
         <div> <FintooBackButton onClick={() => props.onBack()} /></div>
          <div>
            <div className="modal-title">
              Do you really want delete Nominee ?
            </div>
            <div className="modal-title">Enter OTP</div>
          </div>
        </Modal.Header>
        > */}
          <div className="d-flex justify-center p-4">
            <div>
              {" "}
              <FintooBackButton onClick={handleClose123} />
            </div>
            <div
              className="DeleteBank text-center pb-3 w-100"
              style={{
                borderBottom: "1px solid #eeee",
              }}
            >
              <div
                style={{
                  fontWeight: "500",
                }}
              >
                {" "}
                Confirm Details
              </div>
              <div
                className="pt-2"
                style={{
                  fontWeight: "600",
                }}
              >
                Enter OTP
              </div>
            </div>
          </div>
          <div>
            <div>
              <div className="p-3">
                <div className="modal-whitepopup-box-item  border-top-0 text-center">
                  <p>Sent to</p>
                  <p>{useremail}</p>
                  <p>{user_mobile}</p>
                </div>
                <div className="d-flex justify-center align-items-center">
                  <center>
                    <OTPInput
                      value={OTP}
                      onChange={setOTP}
                      style={{
                        width: "8%",
                      }}
                      autoFocus
                      className="rounded rounded-otp"
                      OTPLength={6}
                      otpType="number"
                      disabled={false}
                    // secure
                    />
                  </center>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #eeee",
                  }}
                  className="text-center p-3 grey-color"
                >
                  {count == 0 && (
                    <p
                      className="pointer blue-color"
                      onClick={() => {
                        randomOTP.current =
                          Math.floor(Math.random() * 90000) + 10000;
                        startTimer();
                        fetchMail();
                        fetchSms();
                      }}
                    >
                      Resend OTP
                    </p>
                  )}
                  {count > 0 && (
                    <p>
                      Expire in &nbsp;
                      <strong>
                        {moment().startOf("day").seconds(count).format("mm:ss")}
                      </strong>
                    </p>
                  )}
                </div>
              </div>
              <div
                className="mt-3  OTpConfirm"
                onClick={verifyOTPCode}
              >
                Continue
              </div>
            </div>
          </div>
        </Modal>
      </>
    </Form >
  );
}

export default AddNominee;
