import { useState, useEffect, useRef } from "react";
import "react-responsive-modal/styles.css";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Row } from "react-bootstrap";
import FintooButton from "../../../HTML/FintooButton";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import { FaTrashAlt, FaEdit, FaMinusCircle } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { getUserId, memberId } from "../../../../common_utilities";
import { useDispatch, useSelector } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import { fetchUserProfileDetails } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { addFatcaDetails, GetCities, GetCountries, GetFatcaDetails, GetStates } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { DATA_BELONGS_TO } from "../../../../constants";
import axios from "axios";

function FatcaAdd(props) {
  const initialDataRef = useRef(false);
  const simpleValidator = useRef(
    new SimpleReactValidator({
      autoForceUpdate: { forceUpdate: () => forceUpdate() }
    })
  );
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

  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [osAddress, setOSAddress] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const locationRef = useRef({});
  const apiLocationRef = useRef();

  const dispatch = useDispatch();
  const [formObject, setFormObject] = useState({});
  const user_id = memberId();
  const [, setTick] = useState(0);

  const forceUpdate = () => {
    setTick((prev) => prev + 1);
  };

  const findMatchingIndex = (list, searchValue, key) => {
    if (!searchValue || !list?.length) return -1;

    let index = list.findIndex(item => item[key] === searchValue);
    if (index === -1) {
      index = list.findIndex(item => item[key].toLowerCase() === searchValue.toLowerCase());
    }
    if (index === -1) {
      index = list.findIndex(item =>
        item[key].toLowerCase().includes(searchValue.toLowerCase()) ||
        searchValue.toLowerCase().includes(item[key].toLowerCase())
      );
    }
    return index;
  };

  const getCountries = async () => {
    try {
      const res = await GetCountries();
      console.log("Countries response:", res);
      const countryData = res?.data;

      if (Array.isArray(countryData)) {
        setCountries(countryData);
      } else {
        setCountries([]);
      }

    } catch (e) {
      console.log("Error fetching countries:", e);
      setCountries([]);
    }
  };

  const getStates = async () => {
    if (!countryId) return;

    try {
      const res = await GetStates(countryId);
      const statesData = res.data || [];
      setStates(statesData);

      if (locationRef.current?.State) {
        const index = findMatchingIndex(
          statesData,
          locationRef.current.State,
          "state_name"
        );

        if (index > -1) {
          const selectedStateId = statesData[index].state_id;
          setStateId(selectedStateId);
        }
      }
    } catch (e) {
      console.log("Error fetching states:", e);
    }
  };

  const getCities = async () => {
    if (!countryId || !stateId) return;

    try {
      const res = await GetCities(stateId);
      const citiesData = res.data || [];
      setCities(citiesData);

      if (locationRef.current?.District) {
        const index = findMatchingIndex(
          citiesData,
          locationRef.current.District,
          "city_name"
        );

        if (index > -1) {
          setCityId(String(citiesData[index].city_id));
        }
      }

    } catch (e) {
      console.log("Error fetching cities:", e);
    }
  };

  const defaultValues = () => {
    const fatca = userDetails?.fatca_details || {};
    setOSAddress(fatca.fatca_overseas_address || "");
    setZipCode(fatca.fatca_zip_code || "");
    setCountryId(fatca.fatca_country_id || "");
    setCityId(fatca.fatca_city || "");
    setStateId(fatca.fatca_state || "");
  };

  useEffect(() => defaultValues(), [userDetails]);

  useEffect(() => {
    simpleValidator.current.hideMessages();
    forceUpdate();
  }, [addMore]);

  useEffect(() => {
    getCountries();
    onLoadInIt();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    return () => {
      if (
        apiLocationRef.current &&
        typeof apiLocationRef.current.abort === "function"
      ) {
        apiLocationRef.current.abort();
      }
    };
  }, []);

  const apiFatcaDetails = async () => {
    try {
      const response = await GetFatcaDetails(getUserId());
      setUserFatcaDetails(response?.data || {});
    } catch (e) {
      console.log("Error fetching FATCA details:", e);
    }
  };

  useEffect(() => {
    apiFatcaDetails();
  }, []);

  useEffect(() => {
    if (countryList.length && !initialDataRef.current) {
      initialDataRef.current = true;
      const suffixMap = ["one", "two", "three"];
      const taxData = suffixMap.map(suffix => {
        const taxpayer = userFatcaDetails[`fatca_tax_payer_id_${suffix}`];
        const country = userFatcaDetails[`fatca_tax_payer_country_${suffix}`];
        const iType = userFatcaDetails[`fatca_id_type_${suffix}`];
        if (!taxpayer && !country && !iType) return null;
        return { taxpayer, country, iType };
      }).filter(Boolean);
      setTaxData(taxData);
    }
  }, [userFatcaDetails, countryList]);

  const onLoadInIt = async () => {
    try {
      const response = await fetchUserProfileDetails(getUserId());
      setUserDetails(response.data);
    } catch (e) {
      console.log("Error fetching user details:", e);
    }
  };

  const editDetails = () => {
    simpleValidator.current.showMessages();
    forceUpdate();

    const valid = simpleValidator.current.allValid();

    editValid.current = valid;

    if (valid) cancelForm();
  };

  const addDetails = () => {
    simpleValidator.current.showMessages();

    setTimeout(() => {
      forceUpdate();

      const valid = simpleValidator.current.allValid();

      if (!valid) return;

      setTaxData([...taxData, { ...formObject }]);
      cancelForm();
    }, 0);
  };

  const validateForm = () => {
    simpleValidator.current.showMessages();

    setTimeout(() => {
      forceUpdate();

      const formValid = simpleValidator.current.allValid();

      if (!formValid) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        return;
      }

      if (addMore) {
        addDetails();
        return;
      }

      FatcaApiCall();
    }, 0);
  };

  const updateData = (i) => {
    const updatedTaxData = [...taxData];
    updatedTaxData[i] = { ...formObject };
    setTaxData(updatedTaxData);
    cancelForm();
  };

  useEffect(() => { if (countryId) getStates(); }, [countryId]);
  useEffect(() => { if (stateId) getCities(); }, [stateId]);

  useEffect(() => {
    if (isAutoFilled && countryId && stateId && cityId) {
      simpleValidator.current.hideMessages();
      forceUpdate();
    }
  }, [isAutoFilled, countryId, stateId, cityId]);

  useEffect(() => {
    if (!zipCode || zipCode.length < 3 || !countryList.length) return;

    const timeoutId = setTimeout(() => {
      fetchLocationFromZipCode(zipCode);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [zipCode, countryList]);

  const fetchLocationFromZipCode = async (zip) => {
    if (!zip || zip.length < 3) return;
    try {
      setIsLoadingLocation(true);
      if (apiLocationRef.current) apiLocationRef.current.abort();
      apiLocationRef.current = new AbortController();
      const response = await axios.get(`${process.env.REACT_APP_PINCODE_CHECK}${zip}`, {
        signal: apiLocationRef.current.signal,
      });
      locationRef.current = response.data.data || {};
      const countryIndex = findMatchingIndex(countryList, locationRef.current.Country, 'country_name');
      if (countryIndex > -1) {
        setCountryId(countryList[countryIndex].country_id);
        setIsAutoFilled(true);
        setTimeout(() => { simpleValidator.current.hideMessages(); forceUpdate(); }, 200);
      }
      setIsLoadingLocation(false);
    } catch (error) {
      setIsLoadingLocation(false);
      if (error.name !== 'AbortError') {
        dispatch({ type: "RENDER_TOAST", payload: { message: "Unable to find location for this ZIP code. Please select manually.", type: "warning" } });
      }
    }
  };

  const cancelForm = () => {
    setAddMore(false);
    setEditMode(false);
    setEditNumber(null);

    setFormObject({
      taxpayer: "",
      country: "",
      iType: ""
    });

    simpleValidator.current.purgeFields();
    simpleValidator.current.hideMessages();

    setTimeout(() => {
      forceUpdate();
    }, 0);
  };

  const FatcaApiCall = async () => {
    try {
      const payload = {
        user_id,
        fatca_politically_exposed: props.maindata?.politically_exposed || null,
        fatca_tax_resident: props.maindata?.residential_status || null,
        fatca_overseas_address: osAddress,
        fatca_zip_code: zipCode,
        fatca_country_id: countryId,
        fatca_state: stateId,
        fatca_city: cityId,
        ...(userDetails?.fatca_details?.name && { fatca_id: userDetails.fatca_details.name }),
        data_belongs_to: DATA_BELONGS_TO,
        fatca_networth: 0,
        fatca_nationality: props.maindata?.residential_status === "RES" ? "India" : "",
        fatca_resident_country: countryId,
      };
      ["one", "two", "three"].forEach((s, i) => {
        const e = taxData[i] || {};
        payload[`fatca_tax_payer_id_${s}`] = e.taxpayer || "";
        payload[`fatca_id_type_${s}`] = e.iType || "";
        payload[`fatca_tax_payer_country_${s}`] = e.country || "";
      });

      const res = await addFatcaDetails(payload);
      if (res.status_code === 200) {
        dispatch({ type: "RENDER_TOAST", payload: { message: "Taxpayer added successfully.", type: "success" } });
        setEditMode(false);
        setTimeout(() => props.onNext(), 2000);
      } else {
        dispatch({ type: "RENDER_TOAST", payload: { message: "Something went wrong.", type: "error" } });
        setEditMode(true);
      }
    } catch (e) {
      console.log("Error in FatcaApiCall:", e);
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
            {showBack && <FintooProfileBack title="FATCA Details" onClick={() => props.setShowPanel("FatcaAll")} />}
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
                        let value = event.target.value;
                        const cleanedValue = value.replace(/[^a-zA-Z0-9\s,.\-/]/g, "");
                        setOSAddress(cleanedValue.replace(/\s+/g, " ").trimStart());
                      }}
                      onBlur={() =>
                        simpleValidator.current.showMessageFor("overseasAddress")
                      }
                      maxLength={250}
                    />
                    {simpleValidator.current.message(
                      "overseasAddress",
                      osAddress,
                      "required|min:10|max:250",
                      {
                        messages: {
                          required: "Please enter your Overseas Address.",
                          max: "The Overseas Address should not be greater than 250 characters.",
                          min: "The Overseas Address should at least be of 10 characters.",
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
                          pattern="^[A-Za-z0-9\-]{1,10}$"
                          onChange={(event) => {
                            setZipCode(event.target.value);
                            setCountryId("");
                            setStateId("");
                            setCityId("");
                            setStates([]);
                            setCities([]);
                          }}
                          onKeyPress={(event) => {
                            if (!/[A-Za-z0-9\-]/.test(event.key)) {
                              event.preventDefault();
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
                        onChange={(event) => {
                          const newCountry = event.target.value;
                          setCountryId(newCountry);
                          setStateId("");
                          setCityId("");
                          setCities([]);
                          setStates([]);
                          setZipCode("");
                          locationRef.current = {};
                        }}
                        value={countryId}
                        disabled={false}
                      >
                        <option value="" disabled>
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
                        onChange={(event) => {
                          const newState = event.target.value;
                          setStateId(newState);
                          setCityId("");
                          setCities([]);
                          setZipCode("");
                          if (locationRef.current) {
                            locationRef.current.District = null;
                          }
                        }}
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
                        onChange={(e) => {
                          setCityId(e.target.value);
                          setZipCode("");
                        }}
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
                                    editValid.current ? updateData(i) : forceUpdate();
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
                              setFormObject((v) => ({
                                ...v,
                                taxpayer: e.target.value,
                              }));
                            }}
                            maxLength={11}
                            value={formObject.taxpayer}
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
                              title={"Save"}
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
                      forceUpdate();
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