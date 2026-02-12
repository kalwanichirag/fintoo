import { useDebugValue, useEffect, useState } from "react";
import Cibilreport from "./Cibil_Report.module.css";
import Select from "react-select";
import ReactDatePicker from "../../../../components/HTML/ReactDatePicker/ReactDatePicker";
import Creditreportprocess from "./Creditreportprocess";
import customStyles from "../../../../components/CustomStyles";
import moment from "moment";
import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import { DATA_BELONGS_TO } from "../../../../constants";
import { format } from "date-fns";
import * as toastr from "toastr";
import { imagePath } from "../../../../constants";
import CreditReport from "../../../../Assets/Datagathering/CreditReport.svg";
import {
    apiCall,
    fetchEncryptData,
    getItemLocal,
    getParentUserId,
    getUserId,
    loginRedirectGuest,
    restApiCall,
    setItemLocal,
} from "../../../../common_utilities";
import { checkPan } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { Fetch_External_User_Loan_Details } from "../../../../FrappeIntegration-Services/services/financial-planning-api/liabilities";


const formatDateToDDMMYYYY = (date) => {
    if (!(date instanceof Date)) return "";
    return `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
};




const Fetchloan = (props) => {

    const parseDDMMYYYY = (str) => {
        if (!str || typeof str !== "string") return null;
        const [dd, mm, yyyy] = str.split("/");
        const date = new Date(`${yyyy}-${mm}-${dd}`);
        return isNaN(date.getTime()) ? null : date;
    };



    const defaultHandleError = {
        liability_end_date: "",
    };
    const defaultSelectedMember = {
        name: "",
        liability_member_id: 0,
        dob: null,
        pan: null,
        mobile: null,
        // user_id: null,
        // fp_log_id: null
    };


    const session = props.session;
    const allMembers = props.allMembers;
    const is_plan = props?.is_plan;

    const [panReadonly, setPanReadonly] = useState(false);
    const [dobReadonly, setDobReadonly] = useState(false);
    const [fetchingLoans, setFetchingloans] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedMember, setSelectedMember] = useState(defaultSelectedMember);
    const [errors, setErrors] = useState("");
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [termsError, setTermsError] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [handlerror, setHandleError] = useState(defaultHandleError);
    const [loaderCount, setLoaderCount] = useState(1);
    const [liability_amount, setLiabilityAmount] = useState(0);
    const [cibilScore, setCibilScore] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);

    const initialValues = {
        min: null,
        max: null
    };
    const [formData, setFormData] = useState(initialValues);

    const defaultLiabilitiesDetails = {
        liability_name: "Business Loan",
        liability_category_type: "Business Loan",
        liability_category_id: "24",
        liability_outstanding_amount: "",
        user_id: 0,
        fp_log_id: 0,
        liability_end_date: "",
        liability_member_id: 0,
        liability_asset_id: 0,
        liability_frequency: "1",
        liability_emi: "",
        current_emi: "",
        liability_emi_rate: 7,
        liability_footnote: "",
    };
    const [liabilitiesData, setLiabilitiesData] = useState(
        defaultLiabilitiesDetails
    );
    const [noResult, setNoResult] = useState(false);
    // For fetch loan modal

    useEffect(() => {
        // if (getUserId() == null) {
        //   loginRedirectGuest();
        // }
        setSelectedMember({
            ...selectedMember,
            user_id: props.session.id,
            fp_log_id: props.session.fp_log_id
        });

        setShowForm(true);

    }, []);

    useEffect(() => {
        if (props?.defaultSelectedMember != undefined) {
            let member_details = props?.defaultSelectedMember;

            if (Object.entries(member_details).length > 0) {
                // var dob =  moment(member_details.dob, "YYYY-MM-DD").toDate();

                if (member_details.pan != null || member_details.pan != undefined) {
                    setPanReadonly(true);
                }

                let member_data = {
                    name: member_details.name,
                    liability_member_id: member_details.id,
                    pan: member_details.pan,
                    mobile: member_details.mobile,
                }

                if (member_details.dob != null || member_details.dob != undefined) {
                    setDobReadonly(true);
                    member_data['dob'] = new Date(member_details.dob)
                }

                // setSelectedMember((prev) => ({
                //     ...prev,
                //     name: member_details.name,
                //     liability_member_id: member_details.id,
                //     pan: member_details.pan,
                //     mobile: member_details.mobile,
                //     dob: new Date(member_details.dob),

                // }));
                setSelectedMember((prev) => ({
                    ...prev,
                    ...member_data
                }))
            }

        }

    }, [props?.defaultSelectedMember])

    const checkenterpanexists = async () => {
        if (selectedMember.pan != "" && selectedMember.pan != null) {

            const payload = {
                // user_id: selectedMember.liability_member_id,
                user_pan: selectedMember.pan
            }
            const checkpan = await checkPan(payload)
            // let url =
            //     ADVISORY_CHECK_PAN_EXISTSS +
            //     "?uid=" +
            //     btoa("00" + props.session.id) +
            //     "&pan=" +
            //     selectedMember.pan;
            // let checkpan = await apiCall(url, "", false, false);
            return checkpan;
        }
    };

    const handleDOBChange = (date) => {
        if (date !== "" && date != null) {
            setErrors({
                ...errors, ...{
                    userDob: ""
                }
            });
        }
    }

    const handleSelectedMember = (e) => {
        var pan = (e?.pan);
        var dob = e.dob;
        var name = e.name;
        var mobile = e.mobile;
        var liability_member_id = e.id
        var selectedData = {}

        // setSelectedOption(e.id);

        if (name !== "" && name != null) {
            // setSelectedMember({ ...selectedMember, name: name, liability_member_id: liability_member_id});
            selectedData.name = name
            selectedData.liability_member_id = liability_member_id
            setErrors({
                ...{
                    userName: ""
                }
            });
        } else {
            // setSelectedMember({ ...selectedMember, name: name, liability_member_id: liability_member_id});
            selectedData.name = name
            selectedData.liability_member_id = liability_member_id
        }
        if (pan !== "" && pan != null) {
            setPanReadonly(true);
            // setSelectedMember({ ...selectedMember, pan: pan});
            selectedData.pan = pan
            setErrors({
                ...{
                    userPan: ""
                }
            });
        } else {
            setPanReadonly(false);
            // setSelectedMember({ ...selectedMember, pan: pan});
            selectedData.pan = null
        }

        if (dob !== "" && dob != null) {
            setDobReadonly(true);
            // setSelectedMember({ ...selectedMember, dob: moment(dob, "YYYY-MM-DD").toDate() });
            // selectedData.dob = moment(dob, "YYYY-MM-DD").toDate()
            selectedData.dob = dob;
            setErrors({
                ...{
                    userDob: ""
                }
            });
        }
        else {
            setDobReadonly(false);
            // setSelectedMember({ ...selectedMember, dob: dob });
            // selectedData.dob = dob
        }

        if (mobile !== "" && mobile != null) {
            selectedData.mobile = mobile;
            setErrors({
                ...{
                    userMobile: ""
                }
            });
        }
        else {
            selectedData.mobile = mobile;
        }
        setTermsError("");

        setSelectedMember({ ...selectedMember, ...selectedData });

    }
    const findMemberNameErrors = () => {
        var newErrors = {}
        if ((selectedMember.name == null || selectedMember.name == "")) {
            newErrors.userName = "Please select member."
        }
        else {
            newErrors.userName = ""
        }
        return newErrors
    }

    const handleFetchSubmit = async () => {
        try {
          const nameErrors = findMemberNameErrors();
          const mobileErrors = findMobileErrors();
          const panErrors = findPANErrors("", "0");
          const termsError = findTermsCheckboxError();
          const dobErrors = findDobError();
      
          if (
            !panReadonly &&
            selectedMember.pan != "" &&
            selectedMember.pan != null
          ) {
            // let checkenterPan = await checkenterpanexists();
      
            // if (checkenterPan != true) {
            //   // stop flow immediately if PAN already exists
            //   setErrors({ ...mobileErrors, ...panErrors, ...dobErrors, ...nameErrors, userPan: checkenterPan.message });
            //   setTermsError(termsError);
            //   return;
            // }
          }
      
          if (
            (Object.keys(mobileErrors).length > 0 ||
              termsError !== "" ||
              Object.keys(panErrors).length > 0 ||
              Object.keys(dobErrors).length > 0 ||
              Object.keys(nameErrors).length > 0) &&
            (mobileErrors.userMobile !== "" ||
              termsError !== "" ||
              panErrors.userPan !== "" ||
              dobErrors.userDob !== "" ||
              nameErrors.userName !== "")
          ) {
            setErrors({ ...mobileErrors, ...panErrors, ...dobErrors, ...nameErrors });
            setTermsError(termsError);
            return;
          }
      
          // Build payload
          let payload = {
            user_name: selectedMember.name,
            user_id: selectedMember.liability_member_id,
            user_pan: selectedMember.pan,
            user_dob: String(selectedMember.dob),
            data_belongs_to: DATA_BELONGS_TO,
            user_loan_for: selectedMember.liability_member_id,
            user_mobile: Number(selectedMember.mobile),
            ...(is_plan ? {} : { is_plan })
          };
      
          setShowForm(false);
          setFetchingloans(true);
      
          const respData = await Fetch_External_User_Loan_Details(payload);
      
          switch (respData.status_code) {
            case "200":
            case 200:
              setLiabilityAmount(respData.liability_total_amount);
              setCibilScore(respData.data["cibil_score"]);
              props.getEquifaxData();
              animateBoxes();
              break;
      
            case "500":
            case 500:
            case "400":
            case 400:
            case "404":
            case 404:
            default:
              toastr.options.positionClass = "toast-bottom-left";
              toastr.error(respData.message);
              setTimeout(() => {
                setNoResult(true);
                setFetchingloans(false);
              }, 2000);
              break;
          }
        } catch (e) {
          console.log(e);
        }
      };
      

    const animateBoxes = () => {
        setTimeout(() => {
            if (loaderCount < 7) {
                animateBoxes();
                setLoaderCount((prev) => prev + 1);
            }
        }, 2000);
    }

    useEffect(() => {
        if (loaderCount == 6) {
            props.Closemodal();
            // props.getEquifaxData();

            if (props?.isCardBox) {
                // window.location.href = `${process.env.PUBLIC_URL}/commondashboard?success=1&isliability=1&liabilityamount=3000`;
                window.location.href = `${process.env.PUBLIC_URL}/commondashboard?success=1&iscibilscore=1&cibilscore=${cibilScore}`;
            }
            else {
                props.getLiabilityList();

                window.location.href = `${process.env.PUBLIC_URL}/datagathering/assets-liabilities?success=1&isliability=1&liabilityamount=${liability_amount}`;
            }

        }
    }, [loaderCount]);


    const findMobileErrors = () => {
        const newErrors = {};
        let regex = /^[789]\d{9}$/;

        if (!selectedMember.mobile || selectedMember.mobile.trim() === "") {
            newErrors.userMobile = "Please enter mobile number!";
        } else if (selectedMember.mobile.length !== 10) {
            newErrors.userMobile = "Please enter a valid 10-digit mobile number!";
        } else if (!regex.test(selectedMember.mobile)) {
            newErrors.userMobile = "Please enter a valid mobile number!";
            // } else if (isMobileNumberLinked(selectedMember.mobile)) {
            //   newErrors.userMobile = "Mobile number is already linked.";
        } else {
            newErrors.userMobile = "";
        }

        return newErrors;
    };

    useEffect(() => {
        const mobileErrors = findMobileErrors();

        if (selectedMember.mobile != "" && selectedMember.mobile != null) {
            if (Object.keys(mobileErrors).length > 0) {
                setErrors((v) => ({ ...v, ...mobileErrors }));
            }
        }
    }, [selectedMember.mobile]);

    const handleMobileChange = (e) => {
        // const newMobile = e.target.value.slice(0, 10);
        const newMobile = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
        setSelectedMember({ ...selectedMember, mobile: newMobile });

        if (newMobile.length !== 10) {
            setMobileError("Please enter a 10-digit mobile number");
            return;
        }

        const mobileErrors = findMobileErrors();

        setMobileError(mobileErrors.userMobile);
    };
    const findPANErrors = (enteredPAN = "", change_flag = "0") => {
        const newErrors = {};
        let regex = /^[A-Za-z]{3}[HPhp]{1}[A-Za-z]{1}\d{4}[A-ZHPa-zhp]{1}$/;
        var pan = ""
        if (change_flag == "1") {
            pan = enteredPAN
        }
        else {
            pan = selectedMember.pan
        }

        if (!pan || pan === "") {
            newErrors.userPan = "Please enter pan number!";
        } else if (pan.length !== 10) {
            newErrors.userPan = "Please enter valid pan number!";
        } else if (!regex.test(pan)) {
            newErrors.userPan = "Please enter valid pan number!";
        } else if (
            pan ||
            regex.test(pan) ||
            pan.length == 10
        ) {
            newErrors.userPan = "";
        }
        return newErrors;
    };

    const handlePANChange = (e) => {
        // const enteredPAN = e.target.value;
        const enteredPAN = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);

        setSelectedMember({ ...selectedMember, pan: ("" + enteredPAN).toUpperCase() });

        // if (enteredPAN.trim().length === 10 || enteredPAN.trim() === "") {
        // if (enteredPAN.trim() !== "") {
        const newErrors = findPANErrors(enteredPAN, "1");
        setErrors({ ...errors, ...newErrors });
        // } else {
        //     // Clear errors when the length is not 10 and not empty
        //     setErrors({ userPan: '' });
        // }
    };
    const handleCheckboxClick = (e) => {
        setIsTermsChecked(e.target.checked);
        if (!isTermsChecked) {
            setTermsError("");
        } else {
            setTermsError("Please accept the Terms & Conditions.");
        }
    };
    const findTermsCheckboxError = () => {
        var terms_error = ""
        if (isTermsChecked) {
            terms_error = ""
        } else {
            terms_error = "Please accept the Terms & Conditions."
        }
        return terms_error
    };
    const findDobError = () => {
        var newErrors = {}
        if (selectedMember.dob) {
            newErrors.userDob = ""
        } else {
            newErrors.userDob = "Please select your Date Of Birth."
        }
        return newErrors
    };

    return (
        <>
            <div className="" style={{ padding: "0 !important" }}>
                <div className={`${Cibilreport.fetchloanpopup}`}>
                    <div style={{
                        backgroundColor: "#042b62"
                    }} className="RefreshModalpopup_Heading Loanpopup  col-12 d-flex ">
                        <div style={{ textTransform: 'capitalize' }} className={`${Cibilreport.modal_Heading}`}>
                            Fetch your Loan & credit score Details
                        </div>
                        {
                            fetchingLoans && noResult == false ? null : <>

                                <div className={`${Cibilreport.CloseBtnpopup}`}>
                                    <img
                                        onClick={() => {
                                            props.Closemodal();
                                            // setFetchloan(false);
                                        }}
                                        style={{ cursor: "pointer", right: 0 }}
                                        src={process.env.REACT_APP_STATIC_URL + "media/DG/Close.svg"}
                                        alt="Close"
                                    />
                                </div>
                            </>
                        }

                    </div>
                    {
                        noResult ? (
                            <div style={{
                                display: "grid",
                                placeItems: "center",
                                justifyContent: "center"
                            }} className={`${Cibilreport.fetchloanmodalBody} fetchloanmodalbody`}>
                                <div className="" style={{ placeItems: "center", padding: "2rem 0" }}>
                                    <div>
                                        <center>  <img
                                            src={
                                                process.env.REACT_APP_STATIC_URL +
                                                "media/DG/Notfound.svg"
                                            }
                                            alt="Notfound"
                                        />
                                        </center>
                                    </div>
                                    <div className={`${Cibilreport.notfoundtext} text-center`}>
                                        No Result Found
                                    </div>
                                    <div style={{ textTransform: 'capitalize' }} className={`${Cibilreport.notfoundsubtext}`}>
                                        we couldn’t find the credit history, please find using another details
                                    </div>
                                    <div className={`${Cibilreport.button_1} justify-content-center`}>
                                        <button onClick={() => {
                                            setNoResult(false)
                                            setFetchingloans(false);
                                            setShowForm(true);
                                            setSelectedMember([]);
                                            setIsTermsChecked(false);
                                            setDobReadonly(false);
                                            setPanReadonly(false);
                                        }}>Fetch Another Account</button>
                                        <button onClick={() => {
                                            props.Closemodal();
                                        }}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={`modalBody ${Cibilreport.fetchloanmodalBody} fetchloanmodalBody`}>

                                <div style={{
                                }} className={noResult ? null : Cibilreport.LeftSection}>
                                    {
                                        fetchingLoans ? (
                                            <div className={noResult ? "d-none" : "d-block"}>
                                                <Creditreportprocess count={loaderCount} />
                                            </div>
                                        ) : ""
                                    }

                                    {showForm == true &&
                                        (
                                            <div className="">
                                                <div>
                                                    By tracking, you allow Fintoo to fetch your credit report from Equifax. This will help Fintoo to analyze your loans & credit card details.
                                                </div>
                                                <div className="mt-4 fetch_name">
                                                    <div className={`${Cibilreport.title}`}>Name</div>
                                                    <div className="mt-2">
                                                        <Select
                                                            classNamePrefix="sortSelect"
                                                            placeholder="Select"
                                                            isSearchable={false}
                                                            styles={customStyles}
                                                            options={allMembers}
                                                            // style={{padding: "10px"}}
                                                            onChange={(e) => {
                                                                setSelectedMember((prev) => ({
                                                                    ...prev,
                                                                    name: e.name,
                                                                    liability_member_id: e.value,
                                                                    pan:(e?.pan ?? "").toUpperCase(),
                                                                    dob: moment(e.dob, "DD/MM/YYYY", true).isValid()
                                                                        ? e.dob
                                                                        : "",
                                                                    mobile: e.mobile ?? ""
                                                                }));
                                                                handleSelectedMember(e);
                                                            }}
                                                            value={allMembers?.filter(
                                                                (v) => v.id == selectedMember.liability_member_id
                                                            )}
                                                        />
                                                    </div>
                                                    {errors.userName && (
                                                        <div className="error">{errors.userName}</div>
                                                    )}
                                                    <div className="mt-3">
                                                        <div className={`${Cibilreport.title}`}>Date Of Birth </div>
                                                        <div className={`mt-2 loanDate dt-conbx ${Cibilreport.loanDatepicker}`}>
                                                            <FintooDatePicker
                                                                dateFormat="dd/MM/yyyy"
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dropdownMode="select"
                                                                name="dateOfPurchase"
                                                                customClass="datePickerDMFReport"
                                                                className={`${dobReadonly ? "disabled" : ""}`}
                                                                Placeholder="DD/MM/YYYY"
                                                                selected={parseDDMMYYYY(selectedMember?.dob)}
                                                                maxDate={new Date()}
                                                                onChange={(date) => {
                                                                    handleDOBChange(date);
                                                                    setSelectedMember((prev) => ({
                                                                        ...prev,
                                                                        dob: date
                                                                            ? `${String(date.getDate()).padStart(2, "0")}/${String(
                                                                                date.getMonth() + 1
                                                                            ).padStart(2, "0")}/${date.getFullYear()}`
                                                                            : null
                                                                    }));
                                                                }}
                                                                readOnly={dobReadonly}
                                                            />

                                                        </div>
                                                        {/* <div className="error">
                                                            {handlerror.liability_end_date}
                                                        </div> */}
                                                        {errors.userDob && (
                                                            <div className="error">{errors.userDob}</div>
                                                        )}
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className={`${Cibilreport.title}`}>PAN</div>
                                                        <div className="mt-2">
                                                            {//console.log('selectedMember.pan', selectedMember.dob ?? "")
                                                            }
                                                            <input className={`${Cibilreport.inputField} ${panReadonly === true ?
                                                                "disabled"
                                                                : ""
                                                                }`}
                                                                maxLength="10"
                                                                // style={{
                                                                //     textTransform: "uppercase",
                                                                //     webkitInputPlace
                                                                //   }}
                                                                // onInput={{this.value:  this.value.toUpperCase()}}
                                                                placeholder="Enter Your PAN" type="text"
                                                                value={selectedMember.pan ?? ""}
                                                                onChange={(e) => handlePANChange(e)}
                                                                readOnly={panReadonly}
                                                            />
                                                            {errors.userPan && (
                                                                <p className="error">{errors.userPan}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {//console.log("selectedMember.mobile: ", selectedMember)
                                                    }
                                                    <div className="mt-3">
                                                        <div className={`${Cibilreport.title}`}>Mobile Number</div>
                                                        <div className="mt-2">
                                                            <input
                                                                className={`${Cibilreport.inputField}`}
                                                                type="text"
                                                                placeholder="Enter Your Mobile Number"
                                                                value={selectedMember.mobile ?? ""}
                                                                onChange={(e) => handleMobileChange(e)}
                                                            />
                                                            {errors.userMobile && (
                                                                <p className="error">{errors.userMobile}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 checkbox-container">
                                                        <div className="d-flex align-items-center">
                                                            <input
                                                                type="checkbox"
                                                                name=""
                                                                tabIndex="1"
                                                                className={`custom-checkbox ${Cibilreport.inputCheckBox}`}
                                                                id="terms"
                                                                checked={isTermsChecked}
                                                                onChange={(e) => {
                                                                    handleCheckboxClick(e);
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor="terms"
                                                                style={{
                                                                    paddingTop: "2px",
                                                                    fontSize: "15px",
                                                                    cursor: "pointer",
                                                                    paddingLeft: "25px",
                                                                }}
                                                            >
                                                                Accept &nbsp;
                                                                <a
                                                                    className={`${Cibilreport.LinkTerms} custom-color`}
                                                                    style={{
                                                                        fontWeight: "600",
                                                                        color: "#042b62",
                                                                        textDecoration: "underline"
                                                                    }}
                                                                    href={process.env.PUBLIC_URL + "/terms-conditions/"}
                                                                    target="_blank"
                                                                >
                                                                    Terms & Conditions
                                                                </a>
                                                            </label>
                                                        </div>
                                                        <div className="error">{termsError}</div>
                                                    </div>
                                                    <div className={`${Cibilreport.fetchbtn}`}>
                                                        <button style={{
                                                            backgroundColor: "#042b62"
                                                        }} className="default-background-grey" onClick={() => {
                                                            // setFetchloan(true);
                                                            // setNoResult(true)
                                                            handleFetchSubmit();
                                                        }}>Fetch My Details</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className={`${Cibilreport.RightSection} ${noResult ? "d-none" : "d-block"}`}>
                                    <center>
                                        <img
                                            src={
                                                imagePath +
                                                CreditReport
                                            }
                                            alt="CreditReport"
                                        />
                                    </center>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div >
        </>
    );
};
export default Fetchloan;
