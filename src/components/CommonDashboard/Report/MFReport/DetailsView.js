import React, { useEffect, useState } from "react";
import Styles from '../../../../Pages/datagathering/DG.module.css'
import customStyles from "../../../CustomStyles";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import { apiCall,getUserId, loginRedirectGuest, getParentUserDetails } from "../../../../common_utilities";
// import {} from "../../../constants";
import {} from "../../../../constants";
import commonEncode from "../../../../commonEncode";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { CHECK_SESSION } from "../../../../constants";
import FHLoader from "./loader";



const DetailsView = (props) => {
    const dispatch = useDispatch();
    const [touchedFields, setTouchedFields] = useState({
        pan: false,
        mobile: false
    });
    // const checksession = async () => {
    //     let url = '';
// let url = CHECK_SESSION;
    //     let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
    //     return await apiCall(url, data, true, false);
    // };



    const fetchMfCentral = async () => {
        let member = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
        dispatch({ type: "SET_MEMBER_DATA", payload: member });
        // let sessionData = await // checksession();
        try {
            if (member.length > 0) {
                const all = member.map((v) => ({
                    name: v.name,
                    id: v.id,
                    pan: v.pan,
                    mobile: v.mobile,
                    label: v.name,
                    value: v.id
                }));
                props.setAllMembers([...all]);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const onLoadInit = async () => {
        try {
            // var accTok = await getRestApiHeaders();
            // if (accTok) {
            //     // setAccToken(accTok.gatewayauthtoken);
            //     props.setRestHeaders(accTok);
            // }
            fetchMfCentral();
        } catch (e) {
            console.log(e);
        }
    };

    const handleMobileChange = (e) => {
        props.setSelectedMember({ ...props.selectedMember, mobile: e.target.value });
        if (!touchedFields.mobile) {
            setTouchedFields((prev) => ({ ...prev, mobile: true }));
        }
    };

    const handlePANChange = async (e) => {
        props.setSelectedMember({ ...props.selectedMember, pan: e.target.value });
        if (!touchedFields.pan) {
            setTouchedFields((prev) => ({ ...prev, pan: true }));
        }
        if (e.target.value.length === 10) {
            findPANErrors();
        }
    };

    const findMobileErrors = () => {
        const newErrors = {};
        let regex = /^[6789]\d{9}$/;
        if (!props.selectedMember.mobile || props.selectedMember.mobile === "")
            newErrors.userMobile = "Please enter valid mobile number";
        else if (props.selectedMember.mobile.length !== 10)
            newErrors.userMobile = "Please enter valid mobile number";
        else if (!regex.test(props.selectedMember.mobile))
            newErrors.userMobile = "Please enter valid mobile number";
        else if (
            props.selectedMember.mobile ||
            regex.test(props.selectedMember.mobile) ||
            props.selectedMember.mobile.length == 10
        ) {
            newErrors.userMobile = "";
        }
        return newErrors;
    };

    const findPANErrors = () => {
        const newErrors = {};
        let regex = /^[A-Za-z]{3}[HPhp]{1}[A-Za-z]{1}\d{4}[A-ZHPa-zhp]{1}$/;
        if (!props.selectedMember.pan || props.selectedMember.pan === "") {
            newErrors.userPan = "Please enter PAN";
        } else if (props.selectedMember.pan.length !== 10) {
            newErrors.userPan = "Please enter valid PAN";
        } else if (!regex.test(props.selectedMember.pan)) {
            newErrors.userPan = "Please enter valid PAN";
        } else if (
            props.selectedMember.pan ||
            regex.test(props.selectedMember.pan) ||
            props.selectedMember.pan.length == 10
        ) {
            newErrors.userPan = "";
        }

        return newErrors;
    };

    const checkPANRegistered = async (pan) => {
        let url =
            ADVISORY_CHECK_PAN_REGISTERED +
            "?uid=" +
            btoa("00" + props.session.data.id) +
            "&pan=" +
            pan;
        let checkpan = await apiCall(url, "", false, false);
        return checkpan;
    }

    const handleChange = async (e) => {
        props.setErrorMessage('')
        props.setErrorMfMessage('')
        try {
            if (Boolean(e) == false) {
                let member = props.allMembers;
                props.setSelectedMember({ ...member[0] });
                props.setPanEditable(
                    member[0].pan !== null && member[0].pan !== "" ? true : false
                );
                props.setSendDisabled(false);
            } else {
                props.setSelectedMember({ ...e });
                props.setPanEditable(e.pan !== null && e.pan !== "" ? true : false);
                props.setErrors({});
                props.setSendDisabled(false);
            }
        } catch (e) { }
    };

    const handleSendOTP = async () => {
        try {
            props.setIsLoading(true);
            let email = props.selectedMember.email;
            if (!email) {
                try {
                    let allmember = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser")));
                    if (allmember && Array.isArray(allmember)) {
                        let check_member = allmember.find(check_member => check_member.id === props.selectedMember.id);
                        if (check_member && check_member.email) {
                            email = check_member.email;
                        } else {
                            check_member = allmember.find(check_member => check_member.parent_user_id === 0);
                            email = check_member && check_member.email ? check_member.email : null;
                        }
                    }
                } catch (e) {
                    console.error('Error parsing allMemberUser from localStorage:', e);
                    email = null;
                }
            }
            dispatch({
                type: "SET_PAR_REPORT_DATA",
                payload: {
                    "pan": props.selectedMember.pan,
                    "name": props.selectedMember.name,
                    "mobile": props.selectedMember.mobile,
                    "user_id": props.selectedMember.id,
                    "email": email ? email : (getParentUserDetails()?.user_email || '')
                }
            });
            const response = await props.sendOTP();
            if (response) {
                props.setCurrView('OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
        } finally {
            props.setIsLoading(false);
        }
    };


     const handleSmallcaseSDk = async () => {

        try {
            props.setIsLoading(true);
            let email = props.selectedMember.email;
            if (!email) {
                try {
                    let allmember = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser")));
                    if (allmember && Array.isArray(allmember)) {
                        let check_member = allmember.find(check_member => check_member.id === props.selectedMember.id);
                        if (check_member && check_member.email) {
                            email = check_member.email;
                        } else {
                            check_member = allmember.find(check_member => check_member.parent_user_id === 0);
                            email = check_member && check_member.email ? check_member.email : null;
                        }
                    }
                } catch (e) {
                    console.error('Error parsing allMemberUser from localStorage:', e);
                    email = null;
                }
            }
            dispatch({
                type: "SET_PAR_REPORT_DATA",
                payload: {
                    "pan": props.selectedMember.pan,
                    "name": props.selectedMember.name,
                    "mobile": props.selectedMember.mobile,
                    "user_id": props.selectedMember.id,
                    "email": email ? email : (getParentUserDetails()?.user_email || '')
                }
            });
            const response = await props.SmallcaseSDK();
            
        } catch (error) {
            console.error('Error sending OTP:', error);
        } finally {
            props.setIsLoading(false);
        }
    }


    useEffect(() => {
        const validateInputs = () => {
            const mobileErrors = findMobileErrors();
            const panErrors = findPANErrors();

            let errors = {};
            if (touchedFields.mobile && mobileErrors['userMobile'] !== "") {
                errors = { ...errors, ...mobileErrors };
            }

            if (touchedFields.pan && panErrors['userPan'] !== "") {
                errors = { ...errors, ...panErrors };
            }

            props.setErrors(errors);

            if (Object.keys(errors).length === 0) {
                return props.setSendDisabled(false);
            }

            return props.setSendDisabled(true);
        };

        validateInputs();
    }, [props.selectedMember.pan, props.selectedMember.mobile, touchedFields]);

    useEffect(() => {
        if (getUserId() == null) {
            loginRedirectGuest();
        }
        // if (props.session.data) {
            // props.setSelectedMember({ ...props.selectedMember, id: props.session.data.fp_user_id });
            onLoadInit()
        // }
    }, [props.session]);

    useEffect(() => {
        handleChange();
    }, [props.allMembers]);

    useEffect(() => {
        props.setIsLoading(false);
    }, [])

    return (
        <div className={`modalBody ${Styles.DematmodalBody}`} style={{ flexGrow: '1' }}>
            {
                props.isLoading ? <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {/* <img style={{ width: '150px' }} src={process.env.PUBLIC_URL + "/static/media/Loader.gif"} /> */}
                    <FHLoader />
                    {/* <div className={`${Styles.waitingTxt}`}><p style={{ textAlign: 'center' }}>Please Wait...</p></div> */}
                </div> : (
                    <div className={`${Styles.parBody} ${Styles.DetailsViewContainer}`} style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', alignItems: 'center' }}>
                        <form className="col-md-6 col-12" noValidate="novalidate" name="goldassetform">
                            {props.errorMessage && (
                                <div className="alert alert-danger">
                                    {props.errorMessage}
                                </div>
                            )}
                            <div className="col-12">
                                <div className={`material ${Styles.DetailsView} MFReportModalInput`}>
                                    <div className="bank-label">
                                        <div
                                            style={{
                                                fontWeight: "600",
                                            }}
                                        >
                                            Member*{" "}
                                        </div>
                                    </div>
                                    <Select
                                        classNamePrefix="sortSelect"
                                        isSearchable={false}
                                        options={props.allMembers}
                                        onChange={(e) => {
                                            handleChange(e);
                                        }}
                                        value={props.allMembers.filter(
                                            (v) => v.id == props.selectedMember.id
                                        )}
                                    />
                                </div>
                            </div>
                            <br />
                            <div className="col-12">
                                <div className="bank-label">
                                    <div
                                        style={{
                                            fontWeight: "600",
                                        }}
                                    >
                                        PAN*{" "}
                                    </div>
                                </div>
                                <div className="bank-info Nominee-name">
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            aria-label=""
                                            className="shadow-none form-control"
                                            placeholder="Enter PAN"
                                            maxlength="10"
                                            style={{
                                                border: 0,
                                                borderBottom: "1px solid #aeaeae",
                                                borderRadius: "0",
                                                textTransform: "uppercase",
                                                padding: "1px 0px 8px 0px",
                                            }}
                                            value={props.selectedMember.pan ?? ""}
                                            onChange={(e) => handlePANChange(e)}
                                            readOnly={props.panEditable}
                                        />
                                        {props.errors.userPan && (
                                            <p className="error">{props.errors.userPan}</p>
                                        )}
                                        {/* <span style={{ position: 'absolute', right: '0', top: '2%', color: '#BFBFBF', cursor: 'pointer' }}><HiOutlineInformationCircle size={25} /></span> */}
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className="col-12">
                                <div className="bank-label">
                                    <div
                                        style={{
                                            fontWeight: "600",
                                        }}
                                    >
                                        Mobile Number*{" "}
                                    </div>
                                </div>
                                <div className="bank-info Nominee-name">
                                    <div>
                                        <input
                                            aria-label=""
                                            className="shadow-none form-control"
                                            placeholder="Enter 10 Digit Mobile Number"
                                            type="number"
                                            maxlength="10"
                                            style={{
                                                border: 0,
                                                borderBottom: "1px solid #aeaeae",
                                                borderRadius: "0",
                                                padding: "1px 0px 8px 0px",
                                            }}
                                            value={props.selectedMember.mobile ?? ""}
                                            onChange={(e) => handleMobileChange(e)}
                                        />
                                        {props.errors.userMobile && (
                                            <p className="error">{props.errors.userMobile}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className={`mt-5 ${props.sendDisabled ? Styles.continueBtnsDisable : Styles.continueBtns}`}>
                            <button onClick={() => props.setInvestmentTypeView('INITIAL')} className="custom-background-color">
                                Back
                            </button>
                            <button onClick={handleSmallcaseSDk} className="custom-background-color">
                                Fetch Holdings
                            </button>
                        </div>
                    </div>

                )}

        </div>
    );
};
export default DetailsView;
