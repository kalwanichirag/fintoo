import React, { useEffect, useState, useRef } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import ImageUploader from "react-images-upload";
import { RiEditBoxLine } from "react-icons/ri";
import ProfileImage from "../../../Assets/Images/uni-user-ic.svg";
import FintooBackButton from "../../../components/HTML/FintooBackButton";
import OTPInput from "otp-input-react";
import { fetchData, fetchEncryptData, getUserId, } from "../../../common_utilities";

import moment from "moment";
import axios from "axios";
import commonEncode from "../../../commonEncode";
import SimpleReactValidator from "simple-react-validator";
import FintooDatePicker from "../../../components/HTML/FintooDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { DATA_BELONGS_TO } from "../../../constants";
import {
  GetCountries,
  GetStates,
  GetCities,
  BseClientRegistration,
} from "../../../FrappeIntegration-Services/services/master-api/masterApiService";
import {
  fetchUserProfileDetails,
  getRelationList,
  sendMail,
  sendOTP,
  sendSMS,
  verifyOTP,
} from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import {
  addNomineeDetails,
  getNomineeDetails,
  updateNomineeDetails,
} from "../../../FrappeIntegration-Services/services/investment-api/investmentService";

function NomineeList(props) {

  useEffect(() => {
  }, [props.NomineeData])
  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  const randomOTP = useRef(Math.floor(Math.random() * 90000) + 10000);

  var userid = getUserId();

  const [removed, setRemoved] = useState(false);

  const [editNominee, setEditNominee] = React.useState(false);
  const EditnomineeData = () => setEditNominee(true);
  const [show, setShow] = useState(false);
  const [showdata, setShowdata] = useState(false);
  const handleShow = () => setEditNominee(false);
  const handleClose = () => setShow(false);
  const handleClosedata = () => setShowdata(false);
  const [goingToDelete, setGoingToDelete] = useState(null);
  const [validated, setValidated] = useState(false);
  const [uOTP, updatesetOTP] = useState("");
  const simpleValidator = useRef(new SimpleReactValidator());
  const timer = useRef({ obj: null, counter: 120, default: 120 });
  const [count, setCount] = useState(120);
  const [nomineerelations, setNomineeRelations] = useState([]);
  const [userDetails, setUserDetails] = useState("");
  const [nominee_id, setnominee_id] = useState("");
  const [name, setName] = useState("");
  const [percentageallocation, setpercentageallocation] = useState("");
  const [nomineerelationship, setnomineerelationship] = useState("");
  const [dateofbirth, setdateofbirth] = useState("");
  const [gardianname, setgardianname] = useState("");
  const [user_mobile, setUserMobile] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [GeneratedSmsOTP, setGeneratedSmsOTP] = useState("");
  const [generatedemailotp, setGeneratedEmailOTP] = useState("");

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
  const locationRef = useRef(null);
  const dataExistRef = useRef(false);
  const apiCountryRef = useRef();
  const apiStateRef = useRef();
  const apiCityRef = useRef();

  const handleEditClick = async (data) => {
    setNominee_first_name(data.nominee_first_name ?? "");
    setNominee_relation(data.nominee_relation_id ?? "");
    setNominee_dob(data.nominee_dob ?? "");
    setNominee_guardian_name(data.nominee_guardian_name ?? "");
    setNominee_email(data.nominee_email ?? "");
    setNominee_mobile(data.nominee_mobile + '');
    setNominee_address1(data.nominee_address1 ?? "");
    setNominee_address2(data.nominee_address2 ?? "");
    setNominee_address3(data.nominee_address3 ?? "");
    setNominee_pincode(data.nominee_pincode ?? "");
    const countriesArr = await getCountries(true);
    let statesArr = [];
    let citiesArr = [];

    if (data.nominee_country_id && data.nominee_state_id) {
      statesArr = await getStates(true, data.nominee_country_id + '');
      citiesArr = await getCities(true, data.nominee_state_id + '');
    }

    setSountryStateCity(prev => ({
      ...prev,
      countries: countriesArr,
      states: statesArr,
      cities: citiesArr
    }))
    setNominee_country(data.nominee_country_id);
    setNominee_state(data.nominee_state_id);
    setNominee_city(data.nominee_city_id);
    setNominee_id_proof_type(data.nominee_id_proof_type ?? "");
    setNominee_id_proof_number(data.nominee_id_proof_number ?? "");
    setNominee_city_id(data.nominee_city_id);
    setNominee_state_id(data.nominee_state_id);
    setNominee_country_id(data.nominee_country_id);

  }

  const resetFields = () => {
    setNominee_first_name("");
    setNominee_relation("");
    setNominee_dob(null);
    setNominee_guardian_name("");
    setNominee_email("");
    setNominee_mobile('');
    setNominee_address1("");
    setNominee_address2("");
    setNominee_address3("");
    setNominee_pincode("");
    setNominee_city('');
    setNominee_state('');
    setNominee_country('');
    setNominee_id_proof_type("");
    setNominee_id_proof_number("");
    setId_proof_image(null);
  }

  const validateForm = () => {

    const tempEerror = {};
    if (nominee_first_name.trim() == "") { tempEerror.nominee_first_name = "Name is required"; } else if (!/^[a-z A-Z]+$/.test(nominee_first_name)) { tempEerror.nominee_first_name = "Please enter valid Name"; }
    if (Boolean(nominee_dob) == false) tempEerror.nominee_dob = "Date of birth is required";
    if (nominee_guardian_name.trim() == "") {
      if (moment().diff(moment(nominee_dob), "years") < 18) {
        tempEerror.nominee_guardian_name = "Parent/Guardian name is required.";
      } else {
        setNominee_guardian_name("");
      }
    } else if (!/^[a-z A-Z]+$/.test(nominee_guardian_name)) { tempEerror.nominee_guardian_name = "Please enter valid Parent/Guardian name"; }
    if (nominee_relation.trim() == "") tempEerror.nominee_relation = "Relation is required";

    if (nominee_email.trim() === "") {
      tempEerror.nominee_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nominee_email)) {
      tempEerror.nominee_email = "Please enter a valid email address";
    }

    if (nominee_mobile.trim() === "") {
      tempEerror.nominee_mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(nominee_mobile)) {
      tempEerror.nominee_mobile = "Please enter a valid 10-digit mobile number";
    }

    if (nominee_address1.trim() === "")
      tempEerror.nominee_address1 = "Address line 1 is required";

    // if (nominee_address2.trim() === "")
    //   tempEerror.nominee_address2 = "Address line 2 is required";

    // if (nominee_address3.trim() === "")
    //   tempEerror.nominee_address3 = "Address line 3 is required";

    if (nominee_pincode.trim() === "")
      tempEerror.nominee_pincode = "Pincode is required";
    else if (!/^\d{5,6}$/.test(nominee_pincode))
      tempEerror.nominee_pincode = "Please enter a valid pincode";
    if (!nominee_city)
      tempEerror.nominee_city = "City is required";

    if (!nominee_state)
      tempEerror.nominee_state = "State is required";

    if (!nominee_country)
      tempEerror.nominee_country = "Country is required";

    if (nominee_id_proof_type.trim() === "")
      tempEerror.nominee_id_proof_type = "ID proof type is required";

    if (nominee_id_proof_number.trim() === "") {
      tempEerror.nominee_id_proof_number = "ID proof number is required"
    } else {
      if (nominee_id_proof_type.trim() != "") {
        if (nominee_id_proof_type == "1" && !(/^[A-Z]{5}\d{4}[A-Z]$/.test(nominee_id_proof_number.trim()))) { tempEerror.nominee_id_proof_number = "Please enter a valid PAN" }
        if (nominee_id_proof_type == "2" && !(/^[2-9]{1}[0-9]{11}$/.test(nominee_id_proof_number.trim()))) { tempEerror.nominee_id_proof_number = "Please enter a valid Aadhar number"; }
        if (nominee_id_proof_type == "3" && !(/^([A-Z]{2})(\d{2}|\d{3})[a-zA-Z]{0,1}(\d{4})(\d{7})$/.test(nominee_id_proof_number.trim()))) { tempEerror.nominee_id_proof_number = "Please enter a valid Driving License number"; }
      }
    }
    setError({ ...tempEerror });
    return !Boolean(Object.keys(tempEerror).length);
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
    setNominee_country_id(country_id)
    setNominee_state("");
    await getStates(false, country_id);
  }
  const onStateChange = async (state_id) => {
    if (!state_id) return;
    setNominee_state(state_id);
    setNominee_state_id(state_id);
    setNominee_city("");
    await getCities(false, state_id);
  }

  useEffect(() => {
    if (!editNominee) {
      resetFields();
      setError({});
    }
  }, [editNominee])
  // ====================================================================================================================================

  const [, forceUpdate] = useState();

  const dispatch = useDispatch();

  const nominee_back = useSelector((state) => state.nominee_back);

  useEffect(() => {
    setEditNominee(false);
  }, [nominee_back])

  useEffect(() => {
    getNomineeRelations();

  }, []);

  useEffect(() => {
    onLoadInIt();

  }, [user_mobile, useremail]);

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

  const fetchSms = async () => {
    const payload = {
      identifier: userDetails.mobile,
      for_otp: "mobile"
    }

    await sendOTP(payload);
  };

  const fetchMail = async () => {
    var otp = randomOTP.current;
    setGeneratedEmailOTP(otp);

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

  const startTimer = () => {
    setOTP("");
    updatesetOTP("");
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

  const resendTimer = () => {
    timer.current.obj = setInterval(() => { }, 1000);
  };
  const [OTP, setOTP] = useState("");
  var id = String(props.NomineeData.nominee_id);
  var addnominee_req = {
    nominee_first_name: name,
    nominee_dob: dateofbirth,
    nominee_applicable: percentageallocation,
    nominee_guardian_name: gardianname,
    nominee_relation: nomineerelationship,
    user_id: userid,
    nominee_id: id,
  };

  function refreshPage() {
    window.location.reload(true);
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      if (form_data.nominee_first_name.length > 1) editnomineeData();
    }
    setValidated(true);
  };

  const editnomineeData = () => {
    setName(name);
    setpercentageallocation(percentageallocation);
    setnomineerelationship(nomineerelationship);
    setdateofbirth(dateofbirth);
    setgardianname(gardianname);
    setnominee_id(nominee_id);
  };

  const updatenomineedetails = async () => {

    var nominee_payload = {
      nominee_full_name: nominee_first_name,
      nominee_dob: moment(nominee_dob).format("YYYY-MM-DD"),
      nominee_applicable: "100",
      nominee_relation_id: nominee_relation,
      user_id: userid,
      nominee_email: nominee_email,
      nominee_mobile: nominee_mobile,
      nominee_address_line_1: nominee_address1,
      nominee_address_line_2: nominee_address2,
      nominee_address_line_3: nominee_address3,
      nominee_pincode: nominee_pincode,
      nominee_city: nominee_city,
      nominee_state: nominee_state,
      nominee_country: nominee_country_id,
      nominee_id_proof_type: nominee_id_proof_type,
      nominee_id_proof_number: (nominee_id_proof_number || "").trim(),
      nominee_guardian_name: nominee_guardian_name,
    }

    try {

      const r = await updateNomineeDetails(nominee_payload);
      if (r.status_code == 200) {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: r.message, type: "success" },
        });

        var ucc_payload = {
          user_id: userid,
          data_belongs_to: DATA_BELONGS_TO
        }

        var response = await BseClientRegistration(ucc_payload);

        let status_code = response["status_code"];
        if (status_code == 200 || response.message?.includes("modification") && response.message?.includes("not found")) {
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: response.message, type: "success" },
          });
          nominee_payload.nominee_is_authenticated = 1;
          const update_nominee = await updateNomineeDetails(nominee_payload);
          if (update_nominee.status_code == 200) {
            dispatch({
              type: "RENDER_TOAST",
              payload: { message: r.message, type: "success" },
            });
          } else {
            dispatch({
              type: "RENDER_TOAST",
              payload: { message: "Something went wrong...", type: "error" },
            });
          }
        } else {
          nominee_payload.nominee_is_authenticated = 0;
          const update_nominee = await updateNomineeDetails(nominee_payload);
          if (update_nominee.status_code == 200) {
            dispatch({
              type: "RENDER_TOAST",
              payload: { message: r.message, type: "success" },
            });
          } else {
            dispatch({
              type: "RENDER_TOAST",
              payload: { message: "Something went wrong...", type: "error" },
            });
          }
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: "We couldn’t process your nominee registration with BSE right now. Our support team is looking into it. Please try again shortly.", type: "error" },
          });
        }

      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: r.message, type: "error" },
        });
      }

      setShowdata(false);
      setEditNominee(false);

      props.refreshPage();
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went wrong...", type: "error" },
      });
    }
  };

  var mobile = user_mobile.slice(7);
  const handleChange = (v) => {
    setDob(v);
  };

  const getNomineeRelations = async () => {
    try {
      var res = await getRelationList();

      setNomineeRelations(res?.data);
    } catch (e) { }
  };

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
        updatenomineedetails();
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
    if (nominee_pincode.length === 6) {
      dataExistRef.current = false;
      fetchAutoCountry();
    }
  }, [nominee_pincode]);

  return (
    <>
      {(editNominee && props.NomineeData?.nominee_is_authenticated == 0) ? (
        <div>
          <Row>
            <Col xs={12} lg={8}>
              <Row className="Bank-details nomineeData">
                <Col xs={12} lg={12} className="b-layout">
                  <div>
                    <FintooBackButton onClick={() => setEditNominee(false)} />
                  </div>
                  <div className="bank-name nomiee ms-5"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className="sm:w-100">
                      <div className="memeber-logo">
                        <img
                          src={process.env.REACT_APP_STATIC_URL + "media/DMF/uni-user-ic.svg"}
                        />
                      </div>
                    </div>
                    <div

                      className="lg:mt-2"
                    >
                      <div></div>
                      <div className="Edit-nominee">
                        <button
                          onClick={() => {
                            if (validateForm() == false) { return }
                            else {
                              // updatenomineedetails();

                              randomOTP.current =
                                Math.floor(Math.random() * 90000) + 10000;
                              setShowdata(true);
                              // fetchMail();
                              fetchSms();
                              startTimer();

                            }
                          }}

                        // type="submit"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
                <span
                  style={{
                    borderBottom: "1px solid #eeee",
                    paddingTop: "1em",
                    paddingLeft: "0rem !important",
                    paddingRight: "0rem !important",
                  }}
                ></span>
                <div className="b-subdetails col-12">
                  <Row className="mb-3">
                    <Col
                      xs={12}
                      lg={12}
                      className="b-layout"
                    >
                      <div className="bank-label nomiee-label bank-data">
                        <div className="bank-label">
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
                      <div className="bank-label nomiee-label bank-data">
                        <div className="bank-label">
                          Nominee Relationship
                        </div>
                        <div className="bank-info">
                          <Form.Select
                            aria-label="Default select example"
                            className="shadow-none "
                            onChange={(e) => {
                              const value = e.target.value;
                              setNominee_relation(value);

                              if (value !== "") {
                                setError((prev) => ({ ...prev, relation: "" }));
                              }
                            }}
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
                      <div className="bank-label nomiee-label bank-data">
                        <div className="bank-label">
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
                        <div className="bank-label nomiee-label bank-data">
                          <div className="bank-label">
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
                      <div className="bank-label nomiee-label bank-data">
                        <div className="bank-label">
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
                      <div className="bank-label nomiee-label bank-data">
                        <div className="bank-label">
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
                      <div className="bank-label nomiee-label bank-data">
                        <div className="bank-label">
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
                              onChange={(e) => setNominee_address1(e.target.value)}
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
                      <div className="bank-label nomiee-label bank-data">
                        <div className="bank-label">
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
                              onChange={(e) => setNominee_address2(e.target.value)}
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
                      <div className="bank-label nomiee-label bank-data">
                        <div className="bank-label">
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
                              onChange={(e) => setNominee_address3(e.target.value)}
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
                          style={{ textTransform: nominee_id_proof_type == 1 ? 'uppercase' : 'none' }}
                          aria-label="Default select example"
                          className="shadow-none form-control"
                          placeholder="Nominee ID Number"
                          maxlength="40"
                          onChange={(e) => {
                            setNominee_id_proof_number(e.target.value?.toUpperCase())
                          }}
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
                  {/* <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: props.NomineeData?.doc_url ? '50%' : '100%' }}>
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
                    </div>
                    {
                      props.NomineeData?.doc_url &&
                      <div style={{ width: '50%' }}>
                        <div className="bank-label nomiee-label bank-data">
                          Uploaded Document
                        </div>
                        <img style={{ width: '100%' }} src={props.NomineeData.doc_url} alt="" />
                      </div>
                    }
                  </div>
                  <div className="invalid-feedback d-block">
                    Only .jpg and .png images are allowed
                  </div> */}

                </div>
              </Row>
              <div className={`mt-3, mx-2 ${moment().diff(moment(nominee_dob), "years") <
                18
                ? ""
                : "d-none"
                }`} style={{ fontFamily: "Red Hat Text" }}>
                <p className="mt-4">Since your nominee is a minor, please enter his/her guardian details. The guardian should not be the same as the Fintoo account holder - that’s you!</p><strong>Note:</strong> Account holder(s) cannot be a Guardian.</div>
            </Col>
          </Row >
        </div >
      ) : (
        <>
          <div className="Bank-P-de nomineeData desktopView">
            <Row>
              <Col xs={12} lg={8}>
                <Row className="Bank-details">
                  <Col xs={12} lg={12} className="b-layout">
                    <div className="bank-name nomiee">
                      <div>
                        <div className="memeber-logo">
                          <img
                            src={ProfileImage}
                          />
                        </div>
                      </div>
                      <div
                        className="bank-data"
                        style={{
                          marginLeft: ".6em",
                        }}
                      >
                        <div className="bank-label">
                          <p>Nominee Name</p>
                        </div>
                        <div
                          className="bank-info Nominee-name"
                          style={{ textTransform: "capitalize" }}
                        >
                          <div>
                            {props.NomineeData.nominee_first_name}{" "}
                            {props.NomineeData.nominee_middle_name}{" "}
                            {props.NomineeData.nominee_last_name}
                          </div>
                        </div>
                      </div>
                      {
                        props.NomineeData?.nominee_is_authenticated === 0 &&
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          className="lg:mt-2"
                        >
                          <div className="Edit-nominee">
                            <button
                              onClick={() => {
                                console.log("props ======== ", props)
                                handleEditClick(props.NomineeData);
                                setEditNominee(true);
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      }

                    </div>
                  </Col>
                  <span
                    style={{
                      borderBottom: "1px solid #eeee",
                      paddingTop: "1em",
                      paddingLeft: "0rem !important",
                      paddingRight: "0rem !important",
                    }}
                  ></span>
                  <div className="b-subdetails col-12">
                    <Row className="mb-3">
                      <Col xs={6} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>Percentage Allocation</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            100%
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>Nominee Relationship</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            {props.NomineeData.nominee_relation.replace("Siblings", "Sibling")}
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>Date of Birth</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            {moment(props.NomineeData.nominee_dob).format(
                              "DD-MM-YYYY"
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb-3" >
                      <Col
                        xs={6}
                        lg={4}
                        className={`b-layout ${props.NomineeData.nominee_guardian_name == null || props.NomineeData.nominee_guardian_name == ""
                          ? "d-none"
                          : ""
                          }`}
                      >
                        <div className="nomiee-label">
                          <p>Parent/Guardian full name </p>
                        </div>
                        <div
                          className="bank-info"
                          style={{ textTransform: "capitalize" }}
                        >
                          <div>{props.NomineeData.nominee_guardian_name ? props.NomineeData.nominee_guardian_name : '-'}</div>
                        </div>
                      </Col>
                      <Col xs={6} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>Email</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            {props.NomineeData?.nominee_email ? props.NomineeData.nominee_email : '-'}
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>Mobile</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            {props.NomineeData?.nominee_mobile ? props.NomineeData.nominee_mobile : '-'}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb-3" >
                      <Col xs={6} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>Pin code</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            {props.NomineeData?.nominee_pincode ? props.NomineeData.nominee_pincode : '-'}
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>Country</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            {props.NomineeData?.nominee_country ? props.NomineeData.nominee_country : '-'}
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>State</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            {props.NomineeData?.nominee_state ? props.NomineeData.nominee_state : '-'}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb-3" >
                      <Col xs={6} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>City</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            {props.NomineeData?.nominee_city ? props.NomineeData.nominee_city : '-'}
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>Nominee id proof type</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            {props.NomineeData?.nominee_id_proof_type ? props.NomineeData.nominee_id_proof_type : '-'}
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>Nominee id proof number</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            {props.NomineeData?.nominee_id_proof_number ? props.NomineeData.nominee_id_proof_number : '-'}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb-3" >
                      <Col xs={12} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>Address line 1</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            {props.NomineeData?.nominee_address1 ? props.NomineeData.nominee_address1 : '-'}
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>Address line 2</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            {props.NomineeData?.nominee_address2 ? props.NomineeData.nominee_address2 : '-'}
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} lg={4} className="b-layout">
                        <div className=" nomiee-label">
                          <p>Address line 3</p>
                        </div>
                        <div className="bank-info nomineeDOB">
                          <div>
                            {props.NomineeData?.nominee_address3 ? props.NomineeData.nominee_address3 : '-'}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Row>
              </Col>
            </Row>
          </div>
          <div className="mobileNomineeList">
            <div className="Bank-details">
              <div className="d-flex">
                <div className="sm:w-100">
                  <div>
                    <img width="30" src={process.env.REACT_APP_STATIC_URL + "media/DMF/female.svg"} />
                  </div>
                  <span>
                    <div className="bank-info Nominee-name mt-1">
                      <div>{props.NomineeData.nomineName}</div>
                    </div>
                  </span>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    className="lg:mt-2"
                  >
                    <div className="Edit-nominee" style={{}}>
                      <RiEditBoxLine
                        style={{
                          fontSize: "20px",
                          color: "rgb(36, 167, 221)",
                        }}
                        onClick={EditnomineeData}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="mt-2"
                style={{
                  borderBottom: "1px solid #f3f3f3",
                }}
              ></div>
              <div className="row">
                <div
                  className="col-4"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>Percentage Allocation</p>
                  </div>
                  <div className="bank-info">
                    <div>{props.NomineeData.nominee_applicable}</div>
                  </div>
                </div>
                <div
                  className="col-4"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label ">
                    <p>Nominee Relationship</p>
                  </div>
                  <div className="bank-info">
                    <div>{props.NomineeData.NomineeRelation}</div>
                  </div>
                </div>
                <div
                  className="col-4"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>Date of Birth</p>
                  </div>
                  <div className="bank-info nomineeDOB">
                    <div>
                      {moment(props.NomineeData.nominee_dob).format(
                        "DD-MM-YYYY"
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-6"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>Email</p>
                  </div>
                  <div className="bank-info nomineeDOB">
                    <div>
                      {props.NomineeData?.nominee_email ? props.NomineeData.nominee_email : '-'}
                    </div>
                  </div>
                </div>
                <div
                  className="col-6"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>Mobile</p>
                  </div>
                  <div className="bank-info nomineeDOB">
                    <div>
                      {props.NomineeData?.nominee_mobile ? props.NomineeData.nominee_mobile : '-'}
                    </div>
                  </div>
                </div>
                <div
                  className="col-6"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>Nominee guardian name</p>
                  </div>
                  <div className="bank-info nomineeDOB">
                    <div>
                      {props.NomineeData?.nominee_guardian_name ? props.NomineeData.nominee_guardian_name : '-'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-4"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>Address line 1</p>
                  </div>
                  <div className="bank-info nomineeDOB">
                    <div>
                      {props.NomineeData?.nominee_address1 ? props.NomineeData.nominee_address1 : '-'}
                    </div>
                  </div>
                </div>
                <div
                  className="col-4"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>Address line 2</p>
                  </div>
                  <div className="bank-info nomineeDOB">
                    <div>
                      {props.NomineeData?.nominee_address2 ? props.NomineeData.nominee_address2 : '-'}
                    </div>
                  </div>
                </div>
                <div
                  className="col-4"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>Address line 3</p>
                  </div>
                  <div className="bank-info nomineeDOB">
                    <div>
                      {props.NomineeData?.nominee_address3 ? props.NomineeData.nominee_address3 : '-'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-3"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>Pin code</p>
                  </div>
                  <div className="bank-info nomineeDOB">
                    <div>
                      {props.NomineeData?.nominee_pincode ? props.NomineeData.nominee_pincode : '-'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-4"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>Country</p>
                  </div>
                  <div className="bank-info nomineeDOB">
                    <div>
                      {props.NomineeData?.nominee_country ? props.NomineeData.nominee_country : '-'}
                    </div>
                  </div>
                </div>
                <div
                  className="col-4"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>State</p>
                  </div>
                  <div className="bank-info nomineeDOB">
                    <div>
                      {props.NomineeData?.nominee_state ? props.NomineeData.nominee_state : '-'}
                    </div>
                  </div>
                </div>
                <div
                  className="col-4"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>City</p>
                  </div>
                  <div className="bank-info nomineeDOB">
                    <div>
                      {props.NomineeData?.nominee_city ? props.NomineeData.nominee_city : '-'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-4"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>nominee id proof type</p>
                  </div>
                  <div className="bank-info nomineeDOB">
                    <div>
                      {props.NomineeData?.nominee_id_proof_type ? props.NomineeData.nominee_id_proof_type : '-'}
                    </div>
                  </div>
                </div>
                <div
                  className="col-4"
                  style={{
                    lineHeight: "6px",
                  }}
                >
                  <div className=" nomiee-label">
                    <p>nominee id proof number</p>
                  </div>
                  <div className="bank-info nomineeDOB">
                    <div>
                      {props.NomineeData?.nominee_id_proof_number ? props.NomineeData.nominee_id_proof_number : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )
      }
      <Modal
        backdrop="static"
        className="NomineeModal white-modal"
        centered
        show={show}
        onHide={handleClose}
      >
        <div className="d-flex justify-center p-3">
          <div>
            {" "}
            <FintooBackButton onClick={handleClose} />
          </div>
          <div
            className="DeleteBank text-center pb-3 w-100"
            style={{
              borderBottom: "1px solid #eeee",
            }}
          ></div>
        </div>
        <div>
          <div>
            <div className="p-3">
              <div className="modal-whitepopup-box-item  border-top-0 text-center">
                <p>Sent to</p>
                <p>XXXXXXXX{user_mobile}</p>
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
                    OTPLength={5}
                    otpType="number"
                    disabled={false}
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
                      fetchMail();
                      fetchSms();
                      startTimer();
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
          </div>
        </div>
      </Modal>
      <Modal
        backdrop="static"
        className="NomineeModal white-modal"
        centered
        show={showdata}
        onHide={() => handleClosedata()}
      >
        <div className="d-flex justify-center p-3">
          <div>
            {" "}
            <FintooBackButton onClick={() => handleClosedata()} />
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
              Validate
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
              <div className="d-flex justify-content-center align-items-center">
                <OTPInput
                  value={OTP}
                  onChange={setOTP}
                  style={{
                    width: "auto",
                  }}
                  autoFocus
                  className="rounded rounded-otp"
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                />
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
                      // fetchMail();
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
  );
}

export default NomineeList;
