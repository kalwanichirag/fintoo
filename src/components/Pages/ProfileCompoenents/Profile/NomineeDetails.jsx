import { useState, useEffect, useRef } from "react";
import "react-responsive-modal/styles.css";
import { DATA_BELONGS_TO } from "../../../../constants";
import { Form, Row, FormGroup } from "react-bootstrap";
import axios from "axios";
import OTPInput, { ResendOTP } from "otp-input-react";
import "../Fatca/style.css";
import FintooButton from "../../../HTML/FintooButton";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import moment from "moment/moment";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "../../../../common_utilities";
import FintooDatePicker from "../../../HTML/FintooDatePicker";
import {
  GetCountries,
  GetStates,
  GetCities,
} from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";
import {
  fetchUserProfileDetails,
  getRelationList,
  sendOTP,
  verifyOTP,
} from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import {
  addNomineeDetails,
  getNomineeDetails,
  updateNomineeDetails,
} from "../../../../FrappeIntegration-Services/services/investment-api/investmentService";

const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MOBILE: /^[6-9]\d{9}$/,
  PAN: /^[A-Z]{5}\d{4}[A-Z]$/,
  AADHAAR: /^\d{12}$/,
  PINCODE: /^\d{5,6}$/,
  NAME: /^[a-z A-Z]+$/,
};

const TOAST_TYPE = {
  SUCCESS: "success",
  ERROR: "error",
};

const TIMER_INTERVAL = 1000;

function NomineeDetails(props) {
  const [countryStateCity, setSountryStateCity] = useState({
    countries: [],
    states: [],
    cities: [],
  });
  const [validated, setValidated] = useState(false);
  const [editNumber, setEditNumber] = useState(null);
  const [allNominee, setAllNominee] = useState([]);
  const [fullname, setFullname] = useState("");
  const [percentage, setPercentage] = useState("");
  const [relation, setRelation] = useState("");
  const [dob, setDob] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [nominee_email, setNominee_email] = useState("");
  const [nominee_mobile, setNominee_mobile] = useState("");
  const [nominee_address1, setNominee_address1] = useState("");
  const [nominee_address2, setNominee_address2] = useState("");
  const [nominee_address3, setNominee_address3] = useState("");
  const [nominee_pincode, setNominee_pincode] = useState("");
  const [nominee_city, setNominee_city] = useState("");
  const [nominee_state, setNominee_state] = useState("");
  const [nominee_country, setNominee_country] = useState("");
  const [nominee_city_id, setNominee_city_id] = useState("");
  const [nominee_state_id, setNominee_state_id] = useState("");
  const [nominee_country_id, setNominee_country_id] = useState("");
  const [nominee_id_proof_type, setNominee_id_proof_type] = useState("");
  const [nominee_id_proof_number, setNominee_id_proof_number] = useState("");

  const [error, setError] = useState({});
  const showBack = useSelector((state) => state.isBackVisible);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState("");
  const [nomineeid, setnomineeid] = useState("");
  const [editThis, setEditThis] = useState({});

  const [OTP, setOTP] = useState("");
  const [showdata, setShowdata] = useState(false);
  const [mobile, setmobile] = useState("");
  const [email, setemail] = useState("");
  const [count, setCount] = useState(120);

  const handleClosedata = () => setShowdata(false);
  const timer = useRef({ obj: null, counter: 120, default: 120 });
  const randomOTP = useRef(Math.floor(Math.random() * 90000) + 10000);
  const [nomineerelations, setNomineeRelations] = useState([]);
  const [navDynamic, setNavDynamic] = useState({ prev: "", next: "" });

  const locationRef = useRef(null);
  const dataExistRef = useRef(false);
  const apiCountryRef = useRef();
  const apiStateRef = useRef();
  const apiCityRef = useRef();

  useEffect(() => {
    onLoadInIt();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    nomineelist();
    getNomineeRelations();
  }, []);

  const isDataSame = () => {
    if (!allNominee[0]) return false;

    const proofType = allNominee[0]
      ? allNominee[0]["nominee_id_proof_type"]
      : "";

    let id_proof_type;
    if (proofType === "PAN") {
      id_proof_type = 1;
    } else if (proofType === "Aadhaar") {
      id_proof_type = 2;
    } else if (proofType === "Driving License") {
      id_proof_type = 3;
    } else {
      id_proof_type = "";
    }

    const currentNominee = {
      nominee_first_name: fullname,
      nominee_relation: relation,
      nominee_dob: moment(dob).format("YYYY-MM-DD"),
      nominee_email,
      nominee_mobile: Number(nominee_mobile),
      nominee_address1,
      nominee_address2,
      nominee_address3,
      nominee_pincode,
      nominee_city,
      nominee_state,
      nominee_country,
      nominee_id_proof_type,
      nominee_id_proof_number,
      nominee_guardian_name: guardianName,
    };

    const savedNominee = {
      nominee_first_name:
        allNominee[0].nominee_first_name +
        " " +
        allNominee[0].nominee_middle_name +
        " " +
        allNominee[0].nominee_last_name,
      nominee_relation: allNominee[0].nominee_relation_id,
      nominee_dob: moment(allNominee[0].nominee_dob).format("YYYY-MM-DD"),
      nominee_email: allNominee[0].nominee_email,
      nominee_mobile: parseInt(allNominee[0].nominee_mobile),
      nominee_address1: allNominee[0].nominee_address1,
      nominee_address2: allNominee[0].nominee_address2,
      nominee_address3: allNominee[0].nominee_address3,
      nominee_pincode: allNominee[0].nominee_pincode,
      nominee_city: allNominee[0].nominee_city,
      nominee_state: allNominee[0].nominee_state,
      nominee_country: allNominee[0].nominee_country,
      nominee_id_proof_type: allNominee[0].nominee_id_proof_type,
      nominee_id_proof_number: allNominee[0].nominee_id_proof_number,
      nominee_guardian_name: allNominee[0].nominee_guardian_name ?? "",
    };

    return JSON.stringify(currentNominee) === JSON.stringify(savedNominee);
  };

  const handleNextBtn = () => {
    if (!validateForm()) return;

    const sameCheck = isDataSame();

    if (!sameCheck) {
      randomOTP.current = Math.floor(Math.random() * 90000) + 10000;
      startTimer();
      fetchSms();
      setShowdata(true);
    } else {
      props.onNext(navDynamic.next);
    }
  };

  const onLoadInIt = async () => {
    try {
      const response = await fetchUserProfileDetails(getUserId());

      if (response.status_code === 200) {
        const data = response.data;
        setUserDetails(data);
        setmobile(data.mobile);
        setemail(data.user_email);

        const navDynamic__ = {
          next: "Bank",
          prev: data.user_residential_status === "NRI"
            ? "FatcaAdd"
            : "FatcaAll"
        };
        setNavDynamic(navDynamic__);
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.message, type: "error" },
        });
      }
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went wrong.", type: TOAST_TYPE.ERROR },
      });
    }
  };

  const startTimer = () => {
    setOTP("");
    clearInterval(timer.current.obj);
    timer.current.counter = timer.current.default;
    setCount(timer.current.counter);
    timer.current.obj = setInterval(() => {
      if (timer.current.counter === 0) {
        clearInterval(timer.current.obj);
        timer.current.counter = timer.current.default;
        return;
      }
      timer.current.counter = timer.current.counter - 1;
      setCount(timer.current.counter);
    }, TIMER_INTERVAL);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    props.setShowPanel(navDynamic.next);
  };

  const validateForm = () => {
    const tempError = {};

    if (!fullname.trim()) {
      tempError.fullname = "Name is required";
    } else if (fullname.length < 2) {
      tempError.fullname = "Please Provide Valid nominee first name";
    }

    if (!dob) tempError.dob = "Date of birth is required";

    if (!guardianName.trim()) {
      if (moment().diff(moment(dob), "years") < 18) {
        tempError.guardianName = "Parent/Guardian name is required.";
      } else {
        setGuardianName("");
      }
    } else if (!VALIDATION_PATTERNS.NAME.test(guardianName)) {
      tempError.guardianName = "Please enter valid Parent/Guardian name";
    }

    if (!relation.trim()) tempError.relation = "Relation is required";

    if (!nominee_email.trim()) {
      tempError.nominee_email = "Email is required";
    } else if (!VALIDATION_PATTERNS.EMAIL.test(nominee_email)) {
      tempError.nominee_email = "Please enter a valid email address";
    }

    if (!nominee_mobile) {
      tempError.nominee_mobile = "Mobile number is required";
    } else if (!VALIDATION_PATTERNS.MOBILE.test(nominee_mobile)) {
      tempError.nominee_mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!nominee_address1.trim()) {
      tempError.nominee_address1 = "Address line 1 is required";
    }

    if (!nominee_pincode.trim()) {
      tempError.nominee_pincode = "Pincode is required";
    } else if (!VALIDATION_PATTERNS.PINCODE.test(nominee_pincode)) {
      tempError.nominee_pincode = "Please enter a valid pincode";
    }

    if (!nominee_city_id) tempError.nominee_city = "City is required";
    if (!nominee_state_id) tempError.nominee_state = "State is required";
    if (!nominee_country_id) tempError.nominee_country = "Country is required";

    if (!nominee_id_proof_type) {
      tempError.nominee_id_proof_type = "ID proof type is required";
    }

    if (!nominee_id_proof_number) {
      tempError.nominee_id_proof_number = "ID proof number is required";
    } else if (nominee_id_proof_type) {
      if (nominee_id_proof_type === "PAN") {
        if (!VALIDATION_PATTERNS.PAN.test(nominee_id_proof_number)) {
          tempError.nominee_id_proof_number = "Please enter a valid PAN";
        } else if (userDetails?.user_pan === nominee_id_proof_number) {
          tempError.nominee_id_proof_number = "PAN can not be same as parent";
        }
      } else if (nominee_id_proof_type === "Aadhaar" &&
        !/^[2-9]{1}[0-9]{11}$/.test(nominee_id_proof_number)) {
        tempError.nominee_id_proof_number = "Please enter a valid Aadhar number";
      } else if (nominee_id_proof_type === "Driving license" &&
        !/^([A-Z]{2})(\d{2}|\d{3})[a-zA-Z]{0,1}(\d{4})(\d{7})$/.test(nominee_id_proof_number)) {
        tempError.nominee_id_proof_number = "Please enter a valid Driving License number";
      }
    }

    setError(tempError);
    return Object.keys(tempError).length === 0;
  };
  const editData = (v, index) => {
    setEditThis({
      nominee_first_name: v.nominee_first_name,
      nominee_dob: v.nominee_dob,
      nominee_guardian_name: v.nominee_guardian_name,
      nominee_relation: v.nominee_relation,
      percentage,
    });
    setEditNumber(index);
  };

  const resetForm = () => {
    setFullname("");
    setPercentage("");
    setDob("");
    setGuardianName("");
    setRelation("");
    setEditNumber(null);
  };

  const nomineelist = async () => {
    var user_data = { nominee_user_id: getUserId() };
    try {
      var res = await getNomineeDetails(user_data);

      var allNominee = res.data;

      if (allNominee.length > 0) {
        setAllNominee(allNominee);

        setFullname(
          allNominee[0]["nominee_first_name"] +
          " " +
          allNominee[0]["nominee_middle_name"] +
          " " +
          allNominee[0]["nominee_last_name"]
        );
        setPercentage(allNominee[0]["nominee_applicable"]);
        setDob(allNominee[0]["nominee_dob"]);
        setGuardianName(
          allNominee[0]["nominee_guardian_name"]
            ? allNominee[0]["nominee_guardian_name"]
            : ""
        );
        setRelation(allNominee[0]["nominee_relation_id"]);
        setnomineeid(allNominee[0]["nominee_id"]);
        setNominee_email(allNominee[0]["nominee_email"]);
        setNominee_mobile(allNominee[0]["nominee_mobile"]);
        setNominee_address1(allNominee[0]["nominee_address1"]);
        setNominee_address2(allNominee[0]["nominee_address2"]);
        setNominee_address3(allNominee[0]["nominee_address3"]);
        setNominee_pincode(allNominee[0]["nominee_pincode"]);
        setNominee_country(allNominee[0]["nominee_country"]);
        setNominee_state(allNominee[0]["nominee_state"]);
        setNominee_city(allNominee[0]["nominee_city"]);
        setNominee_country_id(allNominee[0]["nominee_country_id"]);
        setNominee_state_id(allNominee[0]["nominee_state_id"]);
        setNominee_city_id(allNominee[0]["nominee_city_id"]);
        //setNominee_city(allNominee[0]["nominee_city_id"]);
        setNominee_id_proof_type(allNominee[0]["nominee_id_proof_type"]);
        setNominee_id_proof_number(allNominee[0]["nominee_id_proof_number"]);

        const countriesArr = await getCountries(true);
        let statesArr = [];
        let citiesArr = [];
        if (
          allNominee[0]["nominee_country_id"] &&
          allNominee[0]["nominee_state_id"]
        ) {
          statesArr = await getStates(
            true,
            allNominee[0]["nominee_country_id"] + ""
          );
          citiesArr = await getCities(
            true,
            allNominee[0]["nominee_state_id"] + ""
          );
        }

        setSountryStateCity((prev) => ({
          ...prev,
          countries: countriesArr,
          states: statesArr,
          cities: citiesArr,
        }));
      }
    } catch (e) {
      console.error("Error fetching nominee details:", e);
      setAllNominee([]);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message:
            "Unable to load nominee details. You can still add new nominees.",
          type: "warning",
        },
      });
    }
  };

  const saveNominee = async () => {
    try {
      const payload = {
        nominee_full_name: fullname,
        nominee_dob: dob,
        nominee_relation_id: relation,
        user_id: getUserId(),
        nominee_email: nominee_email,
        nominee_mobile: nominee_mobile,
        nominee_address_line_1: nominee_address1,
        nominee_address_line_2: nominee_address2,
        nominee_address_line_3: nominee_address3,
        nominee_pincode: nominee_pincode,
        nominee_city: nominee_city_id,
        nominee_state: nominee_state_id,
        nominee_country: nominee_country_id,
        nominee_city_id: nominee_city_id,
        nominee_state_id: nominee_state_id,
        nominee_country_id: nominee_country_id,
        nominee_id_proof_type: nominee_id_proof_type,
        nominee_id_proof_number: (nominee_id_proof_number || "").trim(),
        nominee_guardian_name: guardianName || null,
        data_belongs_to: DATA_BELONGS_TO
      };

      const sameCheck = isDataSame();
      if ((allNominee.length > 0 && !sameCheck) || (allNominee.length === 0 && !sameCheck)) {
        const r = await addNomineeDetails(payload);
        if (r.status_code === 200) {
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: r.message, type: "success" },
          });
          nomineelist();
          setShowdata(false);
          props.setShowPanel(navDynamic.next);
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: r.message, type: "error" },
          });
        }
      }
    } catch (e) {
      console.log("Error saving nominee details", e);
    }
  };

  const updateNominee = async () => {
    try {
      const payload = {
        nominee_full_name: fullname,
        nominee_dob: dob,
        nominee_relation_id: relation,
        user_id: getUserId(),
        nominee_email: nominee_email,
        nominee_mobile: nominee_mobile,
        nominee_address_line_1: nominee_address1,
        nominee_address_line_2: nominee_address2,
        nominee_address_line_3: nominee_address3,
        nominee_pincode: nominee_pincode,
        nominee_city: nominee_city_id,
        nominee_state: nominee_state_id,
        nominee_country: nominee_country_id,
        nominee_city_id: nominee_city_id,
        nominee_state_id: nominee_state_id,
        nominee_country_id: nominee_country_id,
        nominee_id_proof_type: nominee_id_proof_type,
        nominee_id_proof_number: (nominee_id_proof_number || "").trim(),
        nominee_guardian_name: guardianName || null,
        data_belongs_to: DATA_BELONGS_TO,
      };

      const r = await updateNomineeDetails(payload);
      if (r.status_code === 200) {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: r.message, type: "success" },
        });
        nomineelist();
        setShowdata(false);
        props.setShowPanel(navDynamic.next);
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: r.message, type: "error" },
        });
      }
    } catch (e) {
      console.log("Error updating nominee details", e);
    }
  };

  const fetchSms = async () => {
    const payload = {
      identifier: userDetails.mobile,
      for_otp: "mobile"
    };
    await sendOTP(payload);
  };

  const getNomineeRelations = async () => {
    try {
      const res = await getRelationList();
      setNomineeRelations(res?.data);
    } catch (e) {
      console.error("Error fetching nominee relations:", e);
    }
  };

  const getCountries = async (returnArr) => {
    try {
      const res = await GetCountries();

      if (returnArr) {
        return res.data;
      } else {
        setSountryStateCity((prev) => ({ ...prev, countries: res.data }));
      }
    } catch (e) {
      console.error("Error fetching countries:", e);
    }
  };

  const getStates = async (returnArr, country_id) => {
    if (!country_id) return [];

    try {
      const res = await GetStates(country_id);

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
      console.error("Error fetching states:", e);
    }
  };

  const getCities = async (returnArr, state_id) => {
    if (!state_id) return [];

    try {
      const res = await GetCities(state_id);

      if (returnArr) {
        return res.data;
      } else {
        setSountryStateCity((prev) => ({ ...prev, cities: res.data }));
      }
    } catch (e) {
      console.error("Error fetching cities:", e);
    }
  };

  const onCountryChange = async (country_id) => {
    if (!country_id) return;
    setNominee_country_id(country_id);

    setNominee_state("");
    setNominee_state_id("");
    setNominee_city("");
    setNominee_city_id("");
    setNominee_pincode("");

    locationRef.current = null;
    await getStates(false, country_id);
  };

  const onStateChange = async (state_id) => {
    if (!state_id) return;
    setNominee_state_id(state_id);
    setNominee_city("");
    setNominee_city_id("");
    setNominee_pincode("");

    locationRef.current = null;
    await getCities(false, state_id);
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
      if (countryStateCity.countries && countryStateCity.countries.length > 0) {
        var countryIndex = countryStateCity.countries.findIndex(
          (v) => v.country_name === locationRef.current.Country
        );
        if (countryIndex > -1) {
          const selectedCountry = countryStateCity.countries[countryIndex];
          setNominee_country_id(selectedCountry.country_id);
          setNominee_country(selectedCountry.country_name);
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

      var stateIndex = data.findIndex(
        (v) => v.state_name === locationRef.current.State
      );
      if (stateIndex > -1) {
        const selectedState = data[stateIndex];
        setNominee_state_id(selectedState.state_id);
        setNominee_state(selectedState.state_name);
        setError((prev) => ({
          ...prev,
          nominee_state: "",
        }));

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

      var index = data.findIndex(
        (v) => v.city_name === locationRef.current.District
      );

      if (index === -1) {
        index = data.findIndex(
          (v) =>
            v.city_name.toLowerCase() ===
            locationRef.current.District?.toLowerCase()
        );
      }

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
        setNominee_city(selectedCity.city_name);
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
      };

      const response = await verifyOTP(payload);
      if (response.status_code === 200 || response.status_code === "200") {
        if (allNominee.length === 0) {
          saveNominee();
        } else {
          updateNominee();
        }
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.message, type: "error" },
        });
      }
    } catch (error) {
      console.error("Error in verifyOTP:", error);
    }
  };

  useEffect(() => {
    if (nominee_pincode && nominee_pincode.length === 6) {
      dataExistRef.current = false;
      fetchAutoCountry();
    }
  }, [nominee_pincode]);

  useEffect(() => {
    if (nominee_country_id && locationRef.current) {
      fetchAutoState();
    }
  }, [nominee_country_id]);

  useEffect(() => {
    if (nominee_state_id && locationRef.current) {
      setTimeout(() => {
        fetchAutoCity(nominee_state_id);
      }, 100);
    }
  }, [nominee_state_id]);

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <>
      <Row className="reverse">
        <div className="ProfileImg col-12 col-md-6">
          <div>
            <img
              src={
                process.env.REACT_APP_STATIC_URL +
                "media/DMF/04_Add_nominee.svg"
              }
              alt=""
            />
          </div>
        </div>
        <div className=" col-12 col-md-6 RightPanel">
          <div className="rhl-inner">
            {showBack == true && (
              <FintooProfileBack
                title="Add Nominee"
                onClick={() => props.setShowPanel(navDynamic.prev)}
              />
            )}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Label className="LabelName pt-4" htmlFor="inputText">
                Please add your nominee details.
              </Form.Label>
              {allNominee.length < 1 && (
                <div
                  className="profile-addmore noselect"
                  onClick={() => {
                    setEditNumber(null);
                    resetForm();
                  }}
                ></div>
              )}
              <div>
                <div className="mylist-items-3 my-3 position-relative">
                  <div className="row">
                    <div className="col-12 col-md-6 profile-space-1 mainformhere">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Nominee Full Name
                      </Form.Label>
                      <Form.Control
                        autoComplete
                        placeholder="Name"
                        type="text"
                        style={{
                          height: "2.5rem",
                          borderRadius: "10px",
                        }}
                        className="NomineeName shadow-none"
                        id="inputText"
                        aria-describedby="passwordHelpBlock"
                        maxLength="40"
                        value={fullname}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (
                            value === "" ||
                            (/^[a-zA-Z ]+$/.test(value) && value !== " ")
                          ) {
                            setFullname(value);

                            if (value.trim() !== "") {
                              setError((prev) => ({ ...prev, fullname: "" }));
                            }
                          }
                        }}
                      />
                      {"fullname" in error && (
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-block"
                        >
                          {error.fullname}
                        </Form.Control.Feedback>
                      )}
                    </div>
                    <div className="col-12 col-md-6  profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Percentage
                      </Form.Label>
                      <Form.Control
                        required
                        className="shadow-none"
                        style={{
                          borderRadius: "10px",
                          height: "2.5rem",
                          outline: "none",
                        }}
                        classname=""
                        placeholder=""
                        value="100 %"
                        onChange={(e) => setPercentage(e.target.value)}
                      ></Form.Control>
                      {"percentage" in error && (
                        <div className="invalid-feedback d-block">
                          {error.percentage}
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-md-6 profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Relation
                      </Form.Label>
                      <Form.Select
                        required
                        aria-label="Default select example"
                        style={{
                          borderRadius: "10px",
                          height: "2.5rem",
                          outline: "none",
                        }}
                        className="NomineeName shadow-none"
                        onChange={(e) => {
                          const value = e.target.value;
                          setRelation(value);

                          if (value !== "") {
                            setError((prev) => ({ ...prev, relation: "" }));
                          }
                        }}
                        value={relation}
                      >
                        <option value="">Select</option>
                        {nomineerelations &&
                          nomineerelations.map((v) => (
                            <option key={v.relation_id} value={v.relation_id}>
                              {v.relation_name}
                            </option>
                          ))}
                      </Form.Select>
                      {"relation" in error && (
                        <div className="invalid-feedback d-block">
                          {error.relation}
                        </div>
                      )}
                    </div>
                    <div className=" col-12 col-md-6 profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Date of Birth
                      </Form.Label>
                      <FormGroup controlId="date" bsSize="large">
                        <div
                          className={`dob8 nominee-calendar ${dob ? "m_selected" : "m_empty"
                            }`}
                        >
                          <FintooDatePicker
                            maxDate={new Date()}
                            monthPlaceholder="MM"
                            yearPlaceholder="YYYY"
                            dayPlaceholder="DD"
                            className={`my-dob-calendar`}
                            onChange={(v) => {
                              if (v) {
                                const formattedDate =
                                  moment(v).format("YYYY-MM-DD");
                                setDob(formattedDate);

                                setError((prev) => ({ ...prev, dob: "" }));
                              }
                            }}
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                            showMonthDropdown
                            showYearDropdown
                            selected={dob ? new Date(dob) : null}
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>
                      </FormGroup>
                      {"dob" in error && (
                        <div className="invalid-feedback d-block">
                          {error.dob}
                        </div>
                      )}
                    </div>
                    <>
                      {moment().diff(moment(dob), "years") < 18 && (
                        <div className="col-12 profile-space-1 col-md-6">
                          <Form.Label
                            className="LabelName"
                            htmlFor="guardianName"
                          >
                            Parent/Guardian Name
                          </Form.Label>
                          <Form.Control
                            placeholder="Name"
                            className="shadow-none"
                            required
                            type="text"
                            maxLength={40}
                            style={{
                              height: "2.5rem",
                              borderRadius: "10px",
                            }}
                            id="guardianName"
                            aria-describedby="passwordHelpBlock"
                            value={guardianName}
                            onChange={(e) => {
                              const value = e.target.value;

                              if (value === "" || /^[a-zA-Z ]+$/.test(value)) {
                                setGuardianName(value);

                                if (value.trim() !== "") {
                                  setError((prev) => ({
                                    ...prev,
                                    guardianName: "",
                                  }));
                                }
                              }
                            }}
                          />
                          {"guardianName" in error && (
                            <div className="invalid-feedback d-block">
                              {error.guardianName}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                    <div className="col-12 col-md-6 profile-space-1 col-md-6">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Email
                      </Form.Label>
                      <Form.Control
                        placeholder="Email"
                        className="shadow-none"
                        required
                        type="text"
                        maxLength={40}
                        style={{
                          height: "2.5rem",
                          borderRadius: "10px",
                        }}
                        id="nomineeEmail"
                        aria-describedby="passwordHelpBlock"
                        value={nominee_email}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNominee_email(value);

                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          if (emailRegex.test(value)) {
                            setError((prev) => ({
                              ...prev,
                              nominee_email: "",
                            }));
                          }
                        }}
                      />

                      {"nominee_email" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_email}
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-md-6 profile-space-1 col-md-6">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Mobile
                      </Form.Label>
                      <Form.Control
                        placeholder="Mobile"
                        className="shadow-none"
                        required
                        type="text"
                        maxLength={10}
                        style={{
                          height: "2.5rem",
                          borderRadius: "10px",
                        }}
                        id="nomineeMobile"
                        aria-describedby="passwordHelpBlock"
                        value={nominee_mobile}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (/^\d*$/.test(value)) {
                            setNominee_mobile(value);

                            if (value.length === 10) {
                              setError((prev) => ({
                                ...prev,
                                nominee_mobile: "",
                              }));
                            }
                          }
                        }}
                      />

                      {"nominee_mobile" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_mobile}
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-md-4 profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Address line 1
                      </Form.Label>
                      <Form.Control
                        autoComplete="off"
                        placeholder="Address"
                        maxLength={40}
                        as="textarea"
                        rows={2}
                        className="NomineeName shadow-none"
                        value={nominee_address1}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNominee_address1(value);

                          if (value.trim() !== "") {
                            setError((prev) => ({
                              ...prev,
                              nominee_address1: "",
                            }));
                          }
                        }}
                      />

                      {"nominee_address1" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_address1}
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-md-4 profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Address line 2
                      </Form.Label>
                      <Form.Control
                        autoComplete="off"
                        placeholder="Address"
                        maxLength={40}
                        as="textarea"
                        rows={2}
                        className="NomineeName shadow-none"
                        value={nominee_address2}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNominee_address2(value);

                          if (value.trim() !== "") {
                            setError((prev) => ({
                              ...prev,
                              nominee_address2: "",
                            }));
                          }
                        }}
                      />

                      {"nominee_address2" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_address2}
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-md-4 profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Address line 3
                      </Form.Label>
                      <Form.Control
                        autoComplete="off"
                        placeholder="Address"
                        maxLength={40}
                        as="textarea"
                        rows={2}
                        className="NomineeName shadow-none"
                        value={nominee_address3}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNominee_address3(value);

                          if (value.trim() !== "") {
                            setError((prev) => ({
                              ...prev,
                              nominee_address3: "",
                            }));
                          }
                        }}
                      />

                      {"nominee_address3" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_address3}
                        </div>
                      )}
                    </div>

                    <div className=" col-12 col-md-4 profile-space-1">
                      <Form.Label className="LabelName" htmlFor="PIN">
                        Pincode
                      </Form.Label>
                      <Form.Control
                        autoComplete="off"
                        placeholder="Pincode"
                        type="text"
                        style={{
                          height: "2.5rem",
                          borderRadius: "10px",
                        }}
                        className="NomineeName shadow-none"
                        id="PIN"
                        maxLength={6}
                        value={nominee_pincode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setNominee_pincode(value);
                          locationRef.current = null;
                          if (value) {
                            setError((prev) => ({
                              ...prev,
                              nominee_pincode: "",
                            }));
                          }
                        }}
                        onBlur={() => {
                          if (nominee_pincode && nominee_pincode.length === 6) {
                            dataExistRef.current = false;
                            fetchAutoCountry();
                          }
                        }}
                      />

                      {"nominee_pincode" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_pincode}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-md-4 profile-space-1">
                      <Form.Label className="LabelName" htmlFor="nomineeCity">
                        City
                      </Form.Label>

                      <Form.Select
                        id="nomineeCity"
                        required
                        aria-label="Select City"
                        style={{
                          borderRadius: "10px",
                          height: "2.5rem",
                          outline: "none",
                        }}
                        className={`NomineeName shadow-none ${error.nominee_city ? "is-invalid" : ""
                          }`}
                        onChange={(e) => {
                          const city_id = e.target.value;
                          const city_name = e.target.options[e.target.selectedIndex].text;

                          setNominee_city_id(city_id);
                          setNominee_city(city_name);

                          setNominee_pincode("");
                          locationRef.current = null;

                          if (city_id) {
                            setError((prev) => ({ ...prev, nominee_city: "" }));
                          }
                        }}
                        value={nominee_city_id}
                      >
                        <option value="">Select</option>
                        {countryStateCity.cities &&
                          countryStateCity.cities.map((data) => (
                            <option key={data.city_id} value={data.city_id}>
                              {data.city_name}
                            </option>
                          ))}
                      </Form.Select>

                      {error.nominee_city && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_city}
                        </div>
                      )}
                    </div>

                    <div className=" col-12 col-md-4 profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        State
                      </Form.Label>
                      <Form.Select
                        required
                        aria-label="Select state"
                        style={{
                          borderRadius: "10px",
                          height: "2.5rem",
                          outline: "none",
                        }}
                        className="NomineeName shadow-none"
                        value={nominee_state_id}
                        onChange={(e) => {
                          const value = e.target.value;
                          onStateChange(value);

                          if (value !== "") {
                            setError((prev) => ({
                              ...prev,
                              nominee_state: "",
                            }));
                          }
                        }}
                      >
                        <option value="">Select</option>
                        {countryStateCity.states &&
                          countryStateCity.states.map((data) => (
                            <option key={data.state_id} value={data.state_id}>
                              {data.state_name}
                            </option>
                          ))}
                      </Form.Select>

                      {"nominee_state" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_state}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-md-4 profile-space-1">
                      <Form.Label
                        className="LabelName"
                        htmlFor="nomineeCountry"
                      >
                        Country
                      </Form.Label>
                      <Form.Select
                        required
                        id="nomineeCountry"
                        aria-label="Select country"
                        style={{
                          borderRadius: "10px",
                          height: "2.5rem",
                          outline: "none",
                        }}
                        className="NomineeName shadow-none"
                        value={nominee_country_id}
                        onChange={(e) => {
                          const value = e.target.value;
                          onCountryChange(value);

                          if (value !== "") {
                            setError((prev) => ({
                              ...prev,
                              nominee_country: "",
                            }));
                          }
                        }}
                      >
                        <option value="">Select</option>
                        {countryStateCity.countries &&
                          countryStateCity.countries.map((data) => (
                            <option
                              key={data.country_id}
                              value={data.country_id}
                            >
                              {data.country_name}
                            </option>
                          ))}
                      </Form.Select>

                      {"nominee_country" in error && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_country}
                        </div>
                      )}
                    </div>

                    <div className=" col-12 col-md-4 profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Nominee ID Type
                      </Form.Label>
                      <Form.Select
                        id="nomineeIdProofType"
                        required
                        aria-label="Select ID Proof Type"
                        style={{
                          borderRadius: "10px",
                          height: "2.5rem",
                          outline: "none",
                        }}
                        className="NomineeName shadow-none"
                        onChange={(e) => {
                          const value = e.target.value;
                          setNominee_id_proof_type(value);

                          if (value && error.nominee_id_proof_type) {
                            setError((prev) => ({
                              ...prev,
                              nominee_id_proof_type: "",
                            }));
                          }
                        }}
                        value={nominee_id_proof_type}
                      >
                        <option value="">Select</option>
                        <option value="PAN">PAN</option>
                        <option value="Aadhaar">Aadhaar</option>
                        <option value="Driving license">Driving License</option>
                      </Form.Select>

                      {error.nominee_id_proof_type && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_id_proof_type}
                        </div>
                      )}
                    </div>
                    <div className=" col-12 col-md-4 profile-space-1">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Nominee ID Number
                      </Form.Label>
                      <Form.Control
                        autoComplete
                        placeholder="Nominee ID Number"
                        type="text"
                        style={{
                          height: "2.5rem",
                          borderRadius: "10px",
                        }}
                        className="NomineeName shadow-none"
                        onChange={(e) => {
                          if (nominee_id_proof_type == "PAN") {
                            setNominee_id_proof_number(e.target.value.toUpperCase());
                          } else {
                            setNominee_id_proof_number(e.target.value);
                          }
                          if (error.nominee_id_proof_number) {
                            setError((prev) => ({
                              ...prev,
                              nominee_id_proof_number: "",
                            }));
                          }
                        }}
                        value={nominee_id_proof_number}
                      />
                      {error.nominee_id_proof_number && (
                        <div className="invalid-feedback d-block">
                          {error.nominee_id_proof_number}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Form>
            <div className="pt-4 fintoo-top-border mt-4">
              <div
                className={`mb-3,mx-2 ${moment().diff(moment(dob), "years") < 18 ? "" : "d-none"
                  }`}
                style={{ fontFamily: "Red Hat Text" }}
              >
                <p className="mt-4">
                  Since your nominee is a minor, please enter his/her guardian
                  details. The guardian should not be the same as the Fintoo
                  account holder - that’s you!
                </p>
                <strong>Note:</strong> Account holder(s) cannot be a Guardian.
              </div>
              <FintooButton
                className={`d-block me-0 ms-auto`}
                onClick={() => {
                  if (validateForm() == false) {
                    return;
                  } else {
                    handleNextBtn();
                  }
                }}
                title={"Next"}
              />
            </div>
            <p>&nbsp;</p>
          </div>
        </div>
        <Modal
          backdrop="static"
          className="NomineeModal white-modal"
          centered
          show={showdata}
          onHide={() => handleClosedata()}
        >
          <div className="d-flex justify-center p-3">
            <div
              className="DeleteBank text-center pb-3 w-100"
              style={{
                borderBottom: "1px solid #eeee",
              }}
            >
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
              <div
                className="text-center"
                style={{
                  fontWeight: "500",
                  alignContent: "center",
                }}
              >
                {"          "}
                Validate
              </div>
              <div className="p-3">
                <div className="modal-whitepopup-box-item  border-top-0 text-center">
                  <p>Sent to</p>
                  <p>{email}</p>
                  <p>{mobile}</p>
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
                        fetchSms();
                      }}
                    >
                      Resend OTP
                    </p>
                  )}

                  {count > 0 && (
                    <p>
                      Resend in &nbsp;
                      <strong>
                        {moment().startOf("day").seconds(count).format("mm:ss")}
                      </strong>
                    </p>
                  )}
                </div>
              </div>
              <div
                className="mt-3"
                style={{
                  background: "#042b62",
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#fff",
                  borderBottomLeftRadius: "1rem",
                  borderBottomRightRadius: "1rem",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                  cursor: "pointer",
                }}
                onClick={verifyOTPCode}
              >
                Continue
              </div>
            </div>
          </div>
        </Modal>
      </Row>
    </>
  );
}

export default NomineeDetails;