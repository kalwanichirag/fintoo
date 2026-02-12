import style from "../style.module.css";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { Form, FormGroup } from "react-bootstrap";
import FintooDatePicker from "../../../../../components/HTML/FintooDatePicker";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { formatDatefun } from "../../../../../Utils/Date/DateFormat";
import FintooLoader from "../../../../../components/FintooLoader";
import SimpleReactValidator from "simple-react-validator";
import { Link, useSearchParams } from "react-router-dom";
import {
  fetchData,
  fetchEncryptData,
  getMinorUserId,
  getParentUserId,
  getUserId,
  memberId,
} from "../../../../../common_utilities";
import {
  DATA_BELONGS_TO
} from "../../../../../constants";
import moment from "moment";

const initialFormState = {
  name: "",
  dob: "",
  gender: "male",
  // pan: "",
  guardianName: "",
  guardianRelation: "",
};

function MinorsDetails(props) {
  const [formState, setFormState] = useState(initialFormState);
  const [, forceUpdate] = useState();
  const [jointDropdown, setJointDropdown] = useState([]);
  const [, setField] = useState();
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState("");
  const [guardianrelations, setGuardianRelations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const simpleValidator = useRef(new SimpleReactValidator());

  useEffect(() => {
    if (localStorage.getItem("combinedDetails") == null  && searchParams.get("minor")!=1) {
      onLoadInIt();
      getUserParent();
      
    }
    getGuardianRelations();
    getUserParent();
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('combinedDetails');
    if (storedData !== "") {
      const parsedData = JSON.parse(storedData);
      if (parsedData && "name" in parsedData) {
        setFormState((prevFormState) => ({
              ...prevFormState,
              name: parsedData.name,
              dob: parsedData.dob ? moment(parsedData.dob).toDate() : moment().toDate(),
              gender: parsedData.gender,
              pan: parsedData.pan,
              guardianName: parsedData.guardianName,
              guardianRelation: parsedData.guardianRelation,}))
      }   
     }
  }, []);

  const validateForm = () => {
    simpleValidator.current.showMessages();
    forceUpdate(1);
    return simpleValidator.current.allValid();
  };

  const onInputChange = (e, isNumeric) => {
    const name = e.target.name;
    let value = e.target.value;
    if (isNumeric && !numericRegex.test(value) && value !== "") {
      return;
    }
    if(name == "pan") {
      setFormState({ ...formState, [name]: value.toUpperCase()});
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };

  const onDateAndSelectInputChange = (name, value) => {
    setFormState({ ...formState, [name]: value });
  };

  const onNextClick = () => {
    if (validateForm()) {
      props.onNext();
      searchParams.delete("minor")==1
      localStorage.setItem("combinedDetails", JSON.stringify(formState));

    }
  };

  const getUserParent = async () => {
    // try {
    //   var config_joint = {
    //     method: "POST",
    //     url: DMF_JOINT_DROPDOWN_API_URL,
    //     data: { user_id: "" + getParentUserId() },
    //   };

    //   var respon = await fetchEncryptData(config_joint);
    //   // localStorage.setItem("guardianDetails",JSON.stringify(respon))
    //   var all = respon.data
    //     .filter((item) => item.name && item.minor !== 'Y')
    //     .map((item) => item.name);
    //   setJointDropdown(all);
    //   setIsLoading(false);
    // } catch (e) {
    //   console.log("catch", e);
    // }
  };

  const onLoadInIt = async () => {
    try {
      const payload = {
        url: '',
        data: {
          user_id: getMinorUserId(),
        },
        method: "post",
      };
      const r = await fetchData(payload);
      setFormState((prevFormState) => ({
        ...prevFormState,
        name: r.data.name,
        dob: r.data.dob,
        gender: r.data.gender,
        pan: r.data.pan,
        guardianName: r.data.guardian_name,
        guardianRelation: r.data.guardian_relation,
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  

  

  const checkDuplicatePan = async () => {
    try {
      let data = {
        method: "post",
        url: DMF_VALIDATE_PAN_API_URL,
        data: {
          parent_user_id: getParentUserId(),
          user_id: getUserId(),
          pan: formState.pan,
        },
      };
      let r = await fetchEncryptData(data);
      if (r.error_code !== 100) {
        setErrors(r.message);
      } else {
        throw "";
      }
    } catch (err) {
      setErrors("");
      console.log("err ", err);
    }
  };

  useEffect(()=> {
    if(formState?.pan) {
      // formState.pan.length == 10
      if(formState.pan.length == 10 && simpleValidator.current.fieldValid("pan")) {
        checkDuplicatePan();
      } else {
        setErrors("");
      }
    } else {
      setErrors("");
    }
  }, [formState?.pan]);
  
  const getGuardianRelations = async () => {
    try {
      let data = {
        method: "post",
        url: DMF_GUARDIANRELATIONSHIP_LIST,
        data: {},
      };
      let r = await fetchEncryptData(data);
      if (r.error_code !== 100) {
        setGuardianRelations(r.data);
      } else {
        throw "";
      }
    } catch (err) {
      setErrors("");
      console.log("err ", err);
    }
  };
  return (
    <div className={`${style.addMinorSectionView}`}>
      <FintooLoader isLoading={isLoading} />
      <div
        className={`${style.addMinorSectionViewImg}`}
        style={{ width: "90%" }}
      >
        <img
          style={{ width: "100%" }}
          src={
            process.env.REACT_APP_STATIC_URL +
            "media/DMF/minorFlow/minorflowimg1.png"
          }
          alt=""
        />
      </div>
      <div className=" ">
        <div className={`${style.addMinorFormTitleContainer}`}>
          <Link
            style={{ textDecoration: "none", color: "#042b62" }}
            to={
              process.env.PUBLIC_URL +
              "/direct-mutual-fund/profile/AddMembersOptions"
            }
          >
            <IoChevronBackCircleOutline
              className={`${style.addMinorFormTitlebackBtn}`}
            />
          </Link>
          <div className={`${style.addMinorFormTitle}`}>Minor’s Details</div>
        </div>

        <div className={`${style.uploadContentContainer}`}>
          <div className={`${style.noteTextContent}`}>
            Please enter the below details.
          </div>
          <br />
          <Form>
            <div className={`${style.formInputContainer}`}>
              <Form.Label className={`${style.formLabel}`} htmlFor="inputText">
                Full Name
              </Form.Label>
              <Form.Control
                controlId="validationCustom05"
                maxLength="50"
                placeholder="Enter name of  the Minor"
                className={`${style.formInput}`}
                required
                type="text"
                name="name"
                value={formState.name}
                onChange={(e) => {
                  e.target.value
                  setFormState(prev=> ({...prev, name: e.target.value.replace(/[^a-zA-Z ]/g, "")}));
                  // setFormState({ ...formState, [name]: value });
                  // onInputChange(e, false);
                  // if (e.target.value.match("^[a-zA-Z ]*$") !== null) {
                  //   setField(e.target.id, e.target.value);
                  // }
                }}
              ></Form.Control>
              {simpleValidator.current.message(
                "name",
                formState.name,
                "required|alpha_spaces",
              )}
            </div>
            <div
              className={`${style.formInputContainer} ${style.formInputWithAgeContainer}`}
            >
              <div>
                <Form.Label
                  className={`${style.formLabel}`}
                  htmlFor="inputText"
                >
                  Date of Birth
                </Form.Label>
                <div className="formDateInput">
                  <FintooDatePicker
                    autoComplete='off'
                    dateFormat="dd/MM/yyyy"
                    value={formState.dob}
                    // minDate={new Date(2005, "12", "01")}
                    minDate={moment().subtract(18, 'years').toDate()}
                    maxDate={moment().toDate()}
                    name="dob"
                    showMonthDropdown
                    showYearDropdown
                    selected={
                      formState.dob ? moment(formState.dob, "DD/MM/YYYY").toDate() : moment().toDate()
                    }
                    onChange={(e) =>
                      onDateAndSelectInputChange("dob", moment(e).toDate())
                    }
                  />
                  {simpleValidator.current.message(
                    "dob",
                    formState.dob,
                    "required"
                  )}
                </div>
              </div>
              <div>
                <Form.Label
                  className={`${style.formLabel}`}
                  htmlFor="inputText"
                >
                  Gender
                </Form.Label>
                <div className={`${style.genderInputContainer}`}>
                  <div
                    className={`${style.genderInput} ${
                      formState.gender === "male" ? "" : style.disabledElem
                    }`}
                    onClick={() =>
                      setFormState({ ...formState, gender: "male" })
                    }
                  >
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/DMF/01_Fatca_male.svg"
                      }
                      alt="Male"
                    />
                    <span
                      className={`${style.formLabel}`}
                      style={{ color: "#042b62" }}
                    >
                      Male
                    </span>
                  </div>
                  <div
                    className={`${style.genderInput} ${
                      formState.gender === "female" ? "" : style.disabledElem
                    }`}
                    onClick={() =>
                      setFormState({ ...formState, gender: "female" })
                    }
                  >
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/DMF/02_Fatca_female.svg"
                      }
                      alt="Male"
                    />
                    <span
                      className={`${style.formLabel}`}
                      style={{ color: "#042b62" }}
                    >
                      Female
                    </span>
                  </div>
                  <div
                    className={`${style.genderInput} ${
                      formState.gender === "other" ? "" : style.disabledElem
                    }`}
                    onClick={() =>
                      setFormState({ ...formState, gender: "other" })
                    }
                  >
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/DMF/03_Fatca_other.svg"
                      }
                      alt="Male"
                    />
                    <span
                      className={`${style.formLabel}`}
                      style={{ color: "#042b62" }}
                    >
                      Other
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className={`${style.formInputContainer}`}>
              <Form.Label className={`${style.formLabel}`} htmlFor="inputText">
                PAN
              </Form.Label>
              <Form.Control
                controlId="validationCustom05"
                maxLength="10"
                placeholder="Enter PAN of minor (if available)"
                className={`${style.formInput}`}
                required
                type="text"
                name="pan"
                value={formState.pan}
                onChange={(e) => onInputChange(e, false)}
              ></Form.Control>
               {errors && <div className="error">{errors}</div>}
              {simpleValidator.current.message(
                "pan",
                formState.pan,
                "regex:[A-Z]{5}[0-9]{4}[A-Z]{1}",
                // { messages: { regex: "Please enter a valid PAN!" } }
              )}
            </div> */}
            <div className={`${style.formInputContainer}`}>
              <Form.Label className={`${style.formLabel}`} htmlFor="inputText">
                Guardian Name{" "}
                <span
                  className="guardianName"
                  data-title="Please select the user, who has been declared as the guardian in other documents for Minor (e.g. A minor bank account)"
                >
                  <AiOutlineInfoCircle />
                </span>
              </Form.Label>
              <Form.Select
                className={`${style.formInput}`}
                required
                value={formState.guardianName}
                name="guardianName"
                onChange={(e) =>
                  onDateAndSelectInputChange("guardianName", e.target.value)
                }
              >
                <option value="">Select guardian name</option>
                {jointDropdown.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Form.Select>
              {simpleValidator.current.message(
                "guardianName",
                formState.guardianName,
                "required|alpha_spaces"
              )}
            </div>
            <div className={`${style.formInputContainer}`}>
              <Form.Label className={`${style.formLabel}`} htmlFor="inputText">
                Guardian Relation with Minor{" "}
                <span data-title="If the guardian is someone other than the parents, such as a legal guardian, you would need a copy of the court order to establish the relationship between the minor and the guardian.">
                  <AiOutlineInfoCircle />
                </span>
              </Form.Label>
              <Form.Select
                className={`${style.formInput}`}
                required
                value={formState.guardianRelation}
                name="guardianRelation"
                onChange={(e) =>
                  onDateAndSelectInputChange("guardianRelation", e.target.value)
                }
              >
                <option value="">Select relationship with minor</option>
                {guardianrelations.map((v) => (
                                <option value={v.relation_name}>
                                  {v.relation_name}
                                </option>
                              ))}
                {/* <option value="son">Son</option>
                                <option value="husband">Husband</option>
                                <option value="wife">Wife</option>
                                <option value="daughter">Daughter</option> */}
                {/* <option value="siblings">Sibling</option> */}
               
              </Form.Select>
              {simpleValidator.current.message(
                "guardianRelation",
                formState.guardianRelation,
                "required|alpha_spaces"
              )}
            </div>
          </Form>
        </div>
        <div className="fintoo-top-border mt-4 pt-4">
          <div className={`${style.nextBtn}`} onClick={() => onNextClick()}>
            Next
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinorsDetails;
