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
import {} from "../../../constants";
import axios from "axios"
import {
  fetchData,
  fetchEncryptData,
  getUserId,
} from "../../../common_utilities";

import FintooDatePicker from "../../../components/HTML/FintooDatePicker";
import moment from "moment";
import ImageUploader from "react-images-upload";

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
  const [user_mobile, setusermobile] = useState("");
  const [useremail, setuseremail] = useState("");
  const dispatch = useDispatch();
  // const [error, setError] = useState({});
  const [nomineerelations, setNomineeRelations] = useState([]);
  const randomOTP = useRef(Math.floor(Math.random() * 90000) + 10000);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    onLoadInIt();
    getNomineeRelations();
  }, [user_mobile, useremail]);

  const onLoadInIt = async () => {
    try {
      var form_data_user = { user_id: userid };
      var config = {
        method: "post",
        url: '',
        data: form_data_user,
      };
      var res = await fetchEncryptData(config);
      var response = res.data;
      setusermobile(response.mobile);
      setuseremail(response.email);
    } catch (e) {
      console.warn("e --> ", e);
      setError({});
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

  const addnomineedetails = async () => {

    const formData = new FormData();

    formData.append('nominee_first_name', nominee_first_name);
    formData.append('nominee_dob', moment(nominee_dob).format("YYYY-MM-DD"));
    formData.append('nominee_applicable', "100");
    formData.append('nominee_relation', nominee_relation);
    formData.append('user_id', userid);
    // formData.append('user_id', 257431);
    formData.append('is_authenticated', "1");
    formData.append('nominee_email', nominee_email);
    formData.append('nominee_mobile', nominee_mobile);
    formData.append('nominee_address1', nominee_address1);
    formData.append('nominee_address2', nominee_address2);
    formData.append('nominee_address3', nominee_address3);
    formData.append('nominee_pincode', nominee_pincode);
    formData.append('nominee_city', nominee_city);
    formData.append('nominee_state', nominee_state);
    formData.append('nominee_country', nominee_country);
    formData.append('nominee_id_proof_type', nominee_id_proof_type);
    formData.append('nominee_id_proof_number', nominee_id_proof_number);
    formData.append('nominee_guardian_name', nominee_guardian_name ? nominee_guardian_name : null);
    formData.append('no_enc_key', 'AAAA');

    if (id_proof_image) {
      formData.append('id_proof_image', id_proof_image);
    }

    try {

      if (randomOTP.current != OTP && randomOTP.current != OTP) {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: "INVALID OTP", type: "error" },
        });
        return;
      }

      var config = {
        method: 'post',
        url: DMF_ADDNOMINEE_API_URL,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData,
      }

      var response = await fetchData(config);
      let error_code = response.error_code;

      if (error_code == "100") {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Nominee Added Successfully!", type: "success" },
        });

        setShow123(false);
        clientRegistration();
      }
    } catch (e) {
      console.warn(e)
    }
  };

  const clientRegistration = async () => {
    let data_sent = {
      user_id: userid,
      data_belongs_to: DATA_BELONGS_TO,
    };

    var config = {
      method: "post",
      url: DMF_CLIENT_REGISTRATION_API_URL,
      data: data_sent,
    };
    var res = await fetchEncryptData(config);
    var response = commonEncode.decrypt(res.data);
    props.refreshPage();
  };

  const fetchSms = async () => {
    var urlsms = {
      mobile: user_mobile,
      otp: randomOTP.current,
      key: "add_nominee",
      data_belongs_to: DATA_BELONGS_TO
    };
    var config = {
      method: "post",
      url: BASE_API_URL + "restapi/sendsmsApi/",
      data: urlsms,
    };

    var res = await fetchEncryptData(config);
  };

  const fetchMail = async () => {
    var urlmail = {
      userdata: {
        to: useremail,
      },
      subject: "Fintoo - Verification for your new account",
      template: "otp_message_template.html",
      contextvar: { otp: randomOTP.current },
    };

    var config = {
      method: "post",
      url: BASE_API_URL + "restapi/sendmail/",
      data: urlmail,
    };

    var res = await fetchEncryptData(config);
  };
  const getNomineeRelations = async () => {
    try {
      var config = {
        method: "post",
        url: DMF_NOMINEERELATIONSHIP_LIST,
        data: {}
      };
      var res = await axios(config);
      var responseRel = res.data;

      setNomineeRelations(responseRel.data);
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
    } else if (!/^[a-z A-Z]+$/.test(nominee_guardian_name)) { tempEerror.nominee_first_name = "Please enter valid Parent/Guardian name"; }
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

    if (!id_proof_image) {
      tempEerror.id_proof_image = "Id proof image is required";
    }

    setError({ ...tempEerror });
    return !Boolean(Object.keys(tempEerror).length);
  };

  const onDrop = (pictureFiles, pictureDataURLs) => {
    setId_proof_image(pictureFiles[0]);
  }

  const getCountries = async (returnArr) => {
    try {
      var config = {
        method: "post",
        url: DMF_GETCOUNTRIES_API_URL,
      };
      var res = await axios(config);
      // var responseCities = res.data;
      if (returnArr) {
        return res.data.data;
      } else {
        setSountryStateCity(prev => ({ ...prev, countries: res.data.data }))
      }

    } catch (e) {
      console.log("catch", e);
    }
  };

  const getStates = async (returnArr, country_id) => {

    if (!country_id) return [];

    let countryData = { country_id: country_id };
    try {
      var config = {
        method: "post",
        url: DMF_GETSTATES_API_URL,
        data: countryData,
      };
      var res = await axios(config);

      if (returnArr) {
        return res.data.data;
      } else {
        setSountryStateCity(prev => ({ ...prev, states: res.data.data, cities: [] }));
      }
    } catch (e) {
      console.log("catch", e);
    }
  };

  const getCities = async (returnArr, state_id) => {

    if (!state_id) return [];

    let stateData = { state_id: state_id };
    try {
      var config = {
        method: "post",
        url: DMF_GETCITIES_API_URL,
        data: stateData,
      };
      var res = await axios(config);

      if (returnArr) {
        return res.data.data;
      } else {
        setSountryStateCity(prev => ({ ...prev, cities: res.data.data }))
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

  useEffect(() => {
    getCountries()
  }, [])
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
                        src={process.env.REACT_APP_STATIC_URL + "media/DMF/uni-user-ic.svg"}
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
                          //console.log('validateForm()', validateForm())
                          if (validateForm() == false) {
                            return
                          }
                          else {
                            randomOTP.current = Math.floor(Math.random() * 90000) + 10000;
                          }
                          setShow123(true);
                          startTimer();
                          fetchMail();
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
                          onChange={(e) =>
                            setNominee_relation(e.target.value)
                          }
                          value={nominee_relation}
                        >
                          <option value="">Select</option>
                          {nomineerelations.map((v) => (
                            <option value={v.relation_name}>
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
                        <option value="1">PAN</option>
                        <option value="2">Aadhaar</option>
                        <option value="3">Driving license</option>
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
                        onChange={(e) => setNominee_pincode(e.target.value)}
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
                <div>
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
                <div className="invalid-feedback d-block">
                  Only .jpg and .png images are allowed
                </div>
              </div>
            </Row>
          </Col>

        </Row>
        <div className={`mt-3, mx-2 ${moment().diff(moment(dateofbirth), "years") < 18
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
                  <p>XXXXX XX9323</p>
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
                  <p>XXXXXXX{user_mobile.slice(7)}</p>
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
                onClick={() => {
                  addnomineedetails();
                }}
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
