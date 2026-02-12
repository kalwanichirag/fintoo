import { useEffect, useRef, useState } from "react";
import style from "../style.module.css";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { Form, FormGroup } from "react-bootstrap";
import SimpleReactValidator from "simple-react-validator";
import FintooLoader from "../../../../../components/FintooLoader";
import {
  DATA_BELONGS_TO
} from "../../../../../constants";
import {
  fetchData,
  fetchEncryptData,
  getMinorUserId,
  getParentUserId,
  getUserId,
  memberId,
  setMemberId,
  setMinorUserId,
} from "../../../../../common_utilities";
import moment from "moment";
import commonEncode from "../../../../../commonEncode";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const initialFormState = {
  fatherName: "",
  motherName: "",
  guardianEmail: "",
  guardianMobile: "",
};

function MinorsOtherDetails(props) {
  // localStorage.removeItem('isGuest');
  const storedMinorDetails = localStorage.getItem("combinedDetails");
  const minorDetailsObject = JSON.parse(storedMinorDetails);

  const [formState, setFormState] = useState(initialFormState);
  const [, forceUpdate] = useState();
  const [minorDetails, setMinorDetails] = useState();
  const [guardianData, setGuardianDetails] = useState([]);
  const [gaurdianId, setGuardianID] = useState("");
  const [minorId, setMinorId] = useState();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);


  const simpleValidator = useRef(new SimpleReactValidator());
  const fullName = `${guardianData.name || ''} ${guardianData.middle_name || ''} ${guardianData.last_name || ''}`.trim();


  useEffect(() => {
    if (localStorage.getItem("combinedDetails") !== null) {
      getUserParent();
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("ParentDetails");
    if (storedData !== "") {
      const parsedData = JSON.parse(storedData);
      if (parsedData && "fatherName" in parsedData) {
        setFormState((prevFormState) => ({
          ...prevFormState,
          fatherName: parsedData.fatherName,
          motherName: parsedData.motherName,
        }));
      }
    }
  }, []);

  useEffect(() => {
    if(localStorage.getItem("combinedDetails") == null){
      onLoadInIt();
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

    setFormState({ ...formState, [name]: value });
  };

  const onNextClick = () => {
    if (validateForm()) {
      localStorage.setItem(
        "ParentDetails",
        JSON.stringify({
          fatherName: formState.fatherName,
          motherName: formState.motherName,
        })
      );
      addMinorDetails();
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
    //   const filteredUser =
    //     respon.data.find((v) => v.name === minorDetailsObject.guardianName) ??
    //     {};
    //   const userId = filteredUser.user_id || null;
    //   setGuardianDetails(filteredUser);
    //   setGuardianID(userId);
    //   setIsLoading(false);
    //   // localStorage.setItem('gaurdiaID',userId)
    // } catch (e) {
    //   console.log("catch", e);
    // }
  };

  const addMinorDetails = async () => {
    try {
      if (getMinorUserId()) {
        var data = {
          parent_user_id: getUserId(),
          relation: minorDetailsObject?.guardianRelation || minorDetails?.guardian_relation,
          email: "",
          mobile: "",
          name: minorDetailsObject?.name || minorDetails.name,
          dob:moment(minorDetailsObject?.dob).format('YYYY-MM-DD')|| moment(minorDetails?.dob).format('YYYY-MM-DD') ,
          id: getUserId(),
          data_belongs_to: DATA_BELONGS_TO,
          fdmf_mother_name: formState.motherName,
          fdmf_father_name: formState.fatherName,
          fdmf_is_minor: "Y",
          guardian_name: minorDetailsObject?.guardianName || minorDetails?.guardian_name,
          fdmf_guardian_relation: minorDetailsObject?.guardianRelation || minorDetails?.guardian_relation,
          fdmf_guardian_email: guardianData?.email || minorDetails?.guardian_email,
          fdmf_guardian_mobile: guardianData?.mobile || minorDetails?.guardian_mobile,
          is_minor: "Y",
          mother_name: formState.motherName,
          guardian_email: guardianData?.email || minorDetails?.guardian_email,
          guardian_mobile: guardianData?.mobile || minorDetails?.guardian_mobile,
          // pan: minorDetailsObject?.pan || "",
          guardian_pan: guardianData.pan || minorDetails?.guardian_pan,
          gender: minorDetailsObject?.gender || minorDetails?.gender,
          guardian_id: gaurdianId,
          type:"update",
          member_user_id :getMinorUserId()
        };
      } else {
        data = {
          parent_user_id: getUserId(),
          relation: minorDetailsObject?.guardianRelation || minorDetails?.guardian_relation,
          email: "",
          mobile: "",
          name: minorDetailsObject?.name || minorDetails.name,
          dob: moment(minorDetailsObject?.dob).format('YYYY-MM-DD')|| moment(minorDetails?.dob).format('YYYY-MM-DD') ,
          id: getUserId(),
          data_belongs_to: DATA_BELONGS_TO,
          fdmf_mother_name: formState.motherName,
          fdmf_father_name: formState.fatherName,
          fdmf_is_minor: "Y",
          guardian_name:minorDetailsObject?.guardianName || minorDetails?.guardian_name,
          fdmf_guardian_relation:  minorDetailsObject?.guardianRelation || minorDetails?.guardian_relation,
          fdmf_guardian_email: guardianData?.email || minorDetails?.guardian_email,
          fdmf_guardian_mobile: guardianData?.mobile || minorDetails?.guardian_mobile,
          is_minor: "Y",
          mother_name: formState.motherName,
          guardian_email: guardianData?.email || minorDetails?.guardian_email,
          guardian_mobile: guardianData?.mobile || minorDetails?.guardian_mobile,
          // pan: minorDetailsObject?.pan || "",
          guardian_pan: guardianData.pan || minorDetails?.guardian_pan,
          gender: minorDetailsObject?.gender || minorDetails?.gender,
          guardian_id: gaurdianId,
        };
      }
      var config_joint = {
        method: "post",
        url: ADD_MINOR_API_URL,
        data: data,
      };

      var response = await fetchData(config_joint);
      if (response.error_code == "100") {
        setMinorDetails(response);
        setMinorUserId(response.data.minor_id);
        props.onNext();
      }

      // if(response.error_code == 100){
      //     localStorage.removeItem('combinedDetails');
      // }
    } catch (e) {
      console.log("catch", e);
    }
  };

  const onLoadInIt = async () => {
    var data = { user_id: memberId() };
    try {
      var data = commonEncode.encrypt(JSON.stringify(data));
      var config = {
        method: "post",
        url: '',
        data: data,
      };
      var res = await axios(config);
      var response = commonEncode.decrypt(res.data);
      const r = JSON.parse(response)["data"];
      setMinorDetails(r)
      setMemberId(r.user_id);
      let fatherName = r.father_name;
      let motherName = r.mother_name;
      let email = r.guardian_email;
      let mobile = r.guardian_mobile;
      setGuardianDetails((prevGuardianDetails) => ({
        ...prevGuardianDetails,
        email,
        mobile,
      }));

      setFormState((prevFormState) => ({
        ...prevFormState,
        fatherName,
        motherName,
      }));

      //   setFormState(prev=> ({...prev, fatherName}))
      //   setFormState(prev=> ({...prev, motherName}))
      //   setGuardianDetails(prev=> ({...prev, email}))
      //   setGuardianDetails(prev=> ({...prev, mobile}))
      //   setUserDetails(JSON.parse(response)["data"]);
      //   setres(JSON.parse(response)["data"]["residential_status"]);
      //   renderBankTypes(JSON.parse(response)["data"]["residential_status"] * 1);
    } catch (e) {
      console.log(e);
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
            "media/DMF/minorFlow/minorflowimg2.png"
          }
          alt=""
        />
      </div>
      <div className=" ">
        <div className={`${style.addMinorFormTitleContainer}`}>
          <div onClick={() => props.onPrevious()}>
            <IoChevronBackCircleOutline
              className={`${style.addMinorFormTitlebackBtn}`}
            />
          </div>

          <div className={`${style.addMinorFormTitle}`}>Other Details</div>
        </div>

        <div className={`${style.uploadContentContainer}`}>
          <div className={`${style.noteTextContent}`}>
            Please enter the below details.
          </div>
          <br />
          <Form>
            <div className={`${style.formInputContainer}`}>
              <Form.Label className={`${style.formLabel}`} htmlFor="inputText">
                Father’s Name <span style={{ fontWeight: "lighter" }}>(As per PAN)</span>
              </Form.Label>
              <Form.Control
                controlId="validationCustom05"
                maxLength="40"
                placeholder="Enter Father’s name"
                className={`${style.formInput}`}
                required
                type="text"
                name="fatherName"
                value={minorDetailsObject?.guardianRelation === "Father" ? fullName : formState.fatherName || ""}
                readOnly={minorDetailsObject?.guardianRelation === "Father"}
                onChange={(e) => {
                  setFormState((prev) => ({
                    ...prev,
                    fatherName: e.target.value.replace(/[^a-zA-Z ]/g, ""),
                  }));
                }}
              ></Form.Control>
              {simpleValidator.current.message(
                "fatherName",
                minorDetailsObject?.guardianRelation === "Father" ? fullName : formState.fatherName,
                "required|alpha_space",
                {
                  messages: {
                    alpha_space: "Alphabets and spaces are allowed only.",
                  },
                }
              )}
            </div>

            <div className={`${style.formInputContainer}`}>
              <Form.Label className={`${style.formLabel}`} htmlFor="inputText">
                Mother’s Name
              </Form.Label>
              <Form.Control
                controlId="validationCustom05"
                maxLength="40"
                placeholder="Enter Mother’s name"
                className={`${style.formInput}`}
                required
                type="text"
                name="motherName"
                value={minorDetailsObject?.guardianRelation === "Mother" ? fullName : formState.motherName || ""}
                readOnly={minorDetailsObject?.guardianRelation === "Mother"}
                onChange={(e) => {
                  setFormState((prev) => ({
                    ...prev,
                    motherName: e.target.value.replace(/[^a-zA-Z ]/g, ""),
                  }));
                }}
              ></Form.Control>
              {simpleValidator.current.message(
                "motherName",
                minorDetailsObject?.guardianRelation === "Mother" ? fullName : formState.motherName,
                "required|alpha_space",
                {
                  messages: {
                    alpha_space: "Alphabets and spaces are allowed only.",
                  },
                }
              )}
            </div>

            <div className={`${style.formInputContainer}`}>
              <Form.Label className={`${style.formLabel}`} htmlFor="inputText">
                Email of Guardian
              </Form.Label>
              <Form.Control
                controlId="validationCustom05"
                maxLength="18"
                className={`${style.formInput}`}
                // required
                type="text"
                name="guardianEmail"
                value={guardianData.email}
                onChange={(e) => onInputChange(e, false)}
              ></Form.Control>
              {simpleValidator.current.message(
                "guardianEmail",
                guardianData.email,
                "required|email"
              )}
            </div>
            <div className={`${style.formInputContainer}`}>
              <Form.Label className={`${style.formLabel}`} htmlFor="inputText">
                Mobile Number of Guardian
              </Form.Label>
              <Form.Control
                controlId="validationCustom05"
                maxLength="18"
                className={`${style.formInput}`}
                // required
                readOnly
                type="text"
                name="guardianMobile"
                value={guardianData.mobile}
                onChange={(e) => onInputChange(e, false)}
              ></Form.Control>
              {simpleValidator.current.message(
                "guardianMobile",
                guardianData.mobile,
                "required|phone",
                { messages: { phone: "Please enter a valid Mobile Number" } }
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

export default MinorsOtherDetails;
