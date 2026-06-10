import { FloatingLabel, Form, Modal } from "react-bootstrap";
import Select, { components } from "react-select";
import FintooRadio2 from "../../../components/FintooRadio2";
import ReactDatePicker from "../../../components/HTML/ReactDatePicker/ReactDatePicker";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import {
    imagePath, DATA_BELONGS_TO
} from "../../../constants";
import { apiCall, getItemLocal, getParentFpLogId, getParentUserId, getUserId, loginRedirectGuest, setBackgroundDivImage, getFpLogId } from "../../../common_utilities";
import axios from "axios";
import moment from "moment";
import commonEncode from "../../../commonEncode";
import * as toastr from 'toastr'
import 'toastr/build/toastr.css';
import FintooLoader from "../../../components/FintooLoader";
import customStyles from "../../../components/CustomStyles";
import { ScrollToTop } from '../ScrollToTop';
import { checkPan, fetchUserProfileDetails, getMemberDetails, getOccupationList, updateBasicDetails, updateOpportunityStatus } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { CheckProfileStatus } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { CheckPanExists } from "../../../FrappeIntegration-Services/services/financial-planning-api/externalApi";
function YourInfo(props) {
    const reportstatus = getItemLocal("reportstatus")
    let user_data = JSON.parse(localStorage.getItem("user_data"));
    const [animateaddress, setAnimateAddress] = useState(false)
    const [leadId, setLeadId] = useState("")
    const defaultInfoData = {
        salary_range: "2",
        gender: "Male",
        relation_id: 1,
        user_id: 0,
        fp_log_id: 0,
        fp_user_id: 0,
        name: '',
        pin_code: "",
        pan: "",
        retirement_age: "",
        life_expectancy: "",
        occupation: 0,
        dob: null,
        alternate_address: "",
        remark: "",
        alternate_landline: "",
        city: "",
        country: "",
        country_code: "",
        height: "",
        id: "",
        is_epf_linked: "0",
        isdependent: "0",
        life_cycle_status: 0,
        state: null,
        tax_slab: "",
        uan: "",
        updated_datetime: "",
        user_isactive: "1",
        weight: "",
        fp_userid: 0,
        email: "",
        mobile: "",
        chat_email: "",
        chat_mobile: "",
        chat_user_id: "",
        justLoginFlag: "",
        user_name: "",

        user_details: {
            id: "",
            user_id: 0,
            fp_log_id: 0,
            user_name: "",
            gender: "Male",
            relation_id: 1,
            parent_user_id: 0,
            dob: null,
            alternate_mobile: "",
            alternate_landline: "",
            alternate_address: "",
            City: "",
            PAN: "",
            State: "",
            Country: "",
            pin_code: "",
            salary_range: "2",
            tax_slab: "",
            life_expectancy: 0,
            retirement_age: 0,
            isdependent: "0",
            occupation: "",
            remark: "",
            user_isactive: "1",
            Created_By: "",
            Updated_By: "",
            height: "",
            weight: "",
            uan: "",
            is_epf_linked: "",
            name: "",
            email: "",
            mobile: "",
            country_code: "",
            plandate: "",
        },

        user_avatar: "",
        rm_id: "",
        fp_plan_type: "",
        fp_plan_service: "",
        lead_id: "",
        plan_id: "",
        plan_date: "",
        fp_lifecycle_status: 0,
        plam_payment_status: "",
        fp_plan_sub_cat: "",
        alternate_mobile: ""
    }

    // const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const simpleValidator = useRef(new SimpleReactValidator());
    const [occupationList, setOccupationList] = useState([]);
    const [session, setSession] = useState("");
    const [infoData, setInfoData] = useState(defaultInfoData);
    const [age, setAge] = useState(0);
    const [isNotEditable, setisNotEditable] = useState(reportstatus === "Y" ? true : false);
    const [isSavedFieldsEditable, setSavedFieldsEditable] = useState({ "username": false, "pincode": false, "pan": false });
    const [fieldError, setFieldError] = useState({ "panError": "", "retAgeError": "", "lifeExpError": "" });

    // const customStyles = {   
    //     option: (base, { data, isDisabled, isFocused, isSelected }) => {
    //         return {
    //             ...base,
    //             backgroundColor: isFocused ? "#ffff" : "#042b62",
    //             color: isFocused ? "#042b62" : "#fff",
    //             cursor: "pointer",
    //         };
    //     },
    //     menuList: (base) => ({
    //         ...base,
    //         height: "100px",
    //         overflowY: "scroll",
    //         scrollBehavior: "smooth",
    //         "::-webkit-scrollbar": {
    //             width: "4px",
    //             height: "0px",
    //         },
    //         "::-webkit-scrollbar-track": {
    //             background: "#fff",
    //         },
    //         "::-webkit-scrollbar-thumb": {
    //             background: "#042b62",
    //         },
    //         "::-webkit-scrollbar-thumb:hover": {
    //             background: "#555",
    //         },
    //     }),
    // };

    const getoccupationList = async () => {
        try {
            const occ_list = await getOccupationList();
            var occ_other_index = '';
            var occ_new = [];
            let occ_data = occ_list["data"]
            for (var i = 0; i < occ_data.length; i++) {
                if (occ_data[i]['occupation_name'] == 'Others') {
                    occ_other_index = {
                        'value': occ_data[i]['occupation_id'],
                        'label': occ_data[i]['occupation_name']
                    };
                } else {
                    var occ_obj = {
                        'value': occ_data[i]['occupation_id'],
                        'label': occ_data[i]['occupation_name']
                    }
                    occ_new.push(occ_obj);
                }
            }
            occ_new.push(occ_other_index);
            setOccupationList(occ_new)

        }
        catch (e) {
            console.log('Error fetching list', e);
        }
    }

    useEffect(() => {

        // // checksession();
        getFPUserData()
        setBackgroundDivImage();
        getoccupationList();
    }, []);

    const formatDate = (dateString) => {
        if (dateString) {
            if (dateString.indexOf('/') == -1) {
                var dateObject = new Date(dateString);
            }
            else {
                const dateStringSplit = dateString.split('/')
                const dateStringFormatted = dateStringSplit[2] + '-' + dateStringSplit[1] + '-' + dateStringSplit[0]
                var dateObject = new Date(dateStringFormatted);
            }
            const day = String(dateObject.getDate()).padStart(2, '0');
            const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = dateObject.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;

            const dob = moment(dateObject);
            const ageInYears = moment().diff(dob, 'years');
            setAge(ageInYears);

            return formattedDate;
        }

    }
    // const getFpLog = async (session) => {
    //     if (session.data.fp_log_id) {
    //         getFPUserData(session)
    //     }
    //     else {
    //         let url = '';
    //         let data = { user_id: session.data.id };
    //         let fp_log_resp = await apiCall(url, data, false, false);
    //         if (fp_log_resp['error_code'] == "100") {
    //             if (fp_log_resp.data.fp_log_id != '') {
    //                 session.data.fp_log_id = fp_log_resp.data.fp_log_id
    //                 getFPUserData(session)
    //             }
    //             else {
    //                 window.location.href = process.env.PUBLIC_URL + '/pricing'
    //             }

    //         }
    //         else {
    //             window.location.href = process.env.PUBLIC_URL + '/pricing'
    //         }

    //     }
    // }
    const getFPUserData = async () => {
        let fpUserData = await fetchUserProfileDetails(getParentUserId(), DATA_BELONGS_TO)
        const fpuserData = fpUserData?.status_code === 200 && fpUserData.data ? fpUserData.data : [];
        if (fpuserData) {
            // report y then nonedit
            // const isNotEditable = fpuserData.life_cycle_status === 2;
            // setisNotEditable(isNotEditable)
            setLeadId(fpuserData.user_lead_id || "")
            if (fpuserData.user_name) {
                setSavedFieldsEditable(field => ({
                    ...field,
                    username: true,
                }));
            }

            if (fpuserData.user_pan) {
                setSavedFieldsEditable(field => ({
                    ...field,
                    pan: true
                }));
            }

            if (fpuserData.user_pincode) {
                setSavedFieldsEditable(field => ({
                    ...field,
                    pincode: true
                }));
            }

            setInfoData(prev => ({
                ...prev,
                gender: fpuserData.user_gender,
                relation_id: fpuserData.user_relation_id,
                user_id: fpuserData.user_id,
                fp_user_id: fpuserData.user_detail_id,
                user_name: fpuserData.user_name,
                pin_code: fpuserData.user_pincode,
                pan: fpuserData.user_pan,
                retirement_age: fpuserData.user_retirement_age,
                life_expectancy: fpuserData.user_life_expectancy,
                occupation: fpuserData.user_occupation_id,
                dob: formatDate(fpuserData.user_dob),
                alternate_address: fpuserData.address,
                remark: fpuserData.user_remarks,
                alternate_landline: null,
                city: fpuserData.user_city,
                country: fpuserData.user_country,
                country_code: fpuserData.country_code || "91", // Not provided
                height: '',
                id: fpuserData.user_id,
                is_epf_linked: false,
                isdependent: fpuserData.user_is_minor,
                // life_cycle_status: fpuserData.fp_lifecycle_status,
                state: fpuserData.user_state,
                tax_slab: fpuserData.user_income_slab,
                uan: '',
                updated_datetime: '', // Not available
                user_isactive: true, // Or infer from status
                weight: '',
                fp_userid: fpuserData.user_detail_id,
                email: fpuserData.user_email,
                mobile: fpuserData.mobile,
                chat_email: fpuserData.user_email,
                chat_mobile: fpuserData.mobile,
                chat_user_id: fpuserData.user_id,
                justLoginFlag: fpUserData.data?.justLoginFlag,
                user_name: fpuserData.user_name,
                alternate_mobile: fpuserData.user_alternate_mobile,

                user_details: {
                    id: fpuserData.user_detail_id,
                    user_id: fpuserData.user_id,
                    fp_log_id: '',
                    user_name: fpuserData.user_name,
                    gender: fpuserData.user_gender,
                    relation_id: fpuserData.user_relation_id,
                    parent_user_id: '',
                    dob: fpuserData.user_dob,
                    alternate_mobile: fpuserData.user_alternate_mobile,
                    alternate_landline: null,
                    alternate_address: fpuserData.address,
                    City: fpuserData.user_city,
                    PAN: fpuserData.user_pan,
                    State: fpuserData.user_state,
                    Country: fpuserData.user_country,
                    pin_code: fpuserData.user_pincode,
                    tax_slab: fpuserData.user_income_slab,
                    life_expectancy: fpuserData.user_life_expectancy,
                    retirement_age: fpuserData.user_retirement_age,
                    isdependent: fpuserData.user_is_minor,
                    occupation: fpuserData.user_occupation_id,
                    remark: fpuserData.user_remarks,
                    user_isactive: true,
                    Created_By: '',
                    Updated_By: '',
                    height: '',
                    weight: '',
                    uan: '',
                    is_epf_linked: false,
                    name: fpuserData.user_name,
                    email: fpuserData.user_email,
                    mobile: fpuserData.mobile,
                    country_code: fpuserData.country_code || "91"
                }
            }))
        }


    }
    // const checksession = async () => {
    //     let url = '';
    // let url = CHECK_SESSION;
    //     let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
    //     let session_data = await apiCall(url, data, true, false);

    //     setSession(session_data)

    //     if (session_data['error_code'] == "100") {
    //         let infoDetails = {}
    //         // if(session_data.data.fp_log_id!=''){
    //         if (session_data.data.user_details.first_name != '' && session_data.data.user_details.first_name) {
    //             setSavedFieldsEditable(field => ({
    //                 ...field,
    //                 firstname: true
    //             }))
    //         }
    //         if (session_data.data.user_details.last_name != '' && session_data.data.user_details.last_name) {
    //             setSavedFieldsEditable(field => ({
    //                 ...field,
    //                 lastname: true
    //             }))
    //         }
    //         if (session_data.data.user_details.PAN != '' && session_data.data.user_details.PAN) {
    //             setSavedFieldsEditable(field => ({
    //                 ...field,
    //                 pan: true
    //             }))
    //         }
    //         if (session_data.data.user_details.pin_code != '' && session_data.data.user_details.pin_code) {
    //             setSavedFieldsEditable(field => ({
    //                 ...field,
    //                 pincode: true
    //             }))
    //         }
    //         getFpLog(session_data)
    //     }

    //     // if (isNotEditable) {
    //     // Fill the infoData object with data from the session_data

    //     // getFPUserData(session_data)


    //     // }
    //     // else{

    //     // setInfoData(data=>({
    //     //     ...data,
    //     //         salary_range: session_data.data.user_details.salary_range,
    //     //         gender: session_data.data.user_details.gender,
    //     //         relation_id: session_data.data.user_details.relation_id,
    //     //         user_id: session_data.data.user_details.user_id,
    //     //         fp_log_id: session_data.data.fp_log_id,
    //     //         fp_user_id: session_data.data.fp_user_id,
    //     //         first_name: session_data.data.user_details.first_name,
    //     //         last_name: session_data.data.user_details.last_name,
    //     //         pin_code: session_data.data.user_details.pin_code,
    //     //         pan: session_data.data.user_details.PAN,
    //     //         retirement_age: session_data.data.user_details.retirement_age,
    //     //         life_expectancy: session_data.data.user_details.life_expectancy,
    //     //         occupation: session_data.data.user_details.occupation,
    //     //         dob: formatDate(session_data.data.user_details.dob),
    //     //         alternate_address: session_data.data.user_details.alternate_address,
    //     //         remark: session_data.data.user_details.remark,
    //     //         alternate_landline: session_data.data.user_details.alternate_landline,
    //     //         city: session_data.data.user_details.City,
    //     //         country: session_data.data.user_details.Country,
    //     //         country_code: session_data.data.user_details.country_code,
    //     //         height: session_data.data.user_details.height,
    //     //         id: session_data.data.user_details.id,
    //     //         is_epf_linked: session_data.data.user_details.is_epf_linked,
    //     //         isdependent: session_data.data.user_details.isdependent,
    //     //         life_cycle_status: session_data.data.fp_lifecycle_status,
    //     //         state: session_data.data.user_details.State,
    //     //         tax_slab: session_data.data.user_details.tax_slab,
    //     //         uan: session_data.data.user_details.uan,
    //     //         updated_datetime: session_data.data.user_details.Updated_Datetime,
    //     //         user_isactive: session_data.data.user_details.user_isActive,
    //     //         weight: session_data.data.user_details.weight,
    //     //         fp_userid: session_data.data.fp_user_id,
    //     //         email: session_data.data.email,
    //     //         mobile: session_data.data.mobile,
    //     //         chat_email: session_data.data.chat_email,
    //     //         chat_mobile: session_data.data.chat_mobile,
    //     //         chat_user_id: session_data.data.chat_user_id,
    //     //         justLoginFlag: session_data.data.justLoginFlag,
    //     //         user_name: session_data.data.user_name,
    //     // }))
    //     // getFPUserData(session_data)

    //     // }
    // }

    const checkifpanexists = async () => {

        if (infoData.pan != '') {

            let reqData = {
                user_pan: infoData.pan,
                user_id: getParentUserId(),
                data_belongs_to: DATA_BELONGS_TO,
            };

            let check_Pan = await CheckPanExists(reqData)
            if (check_Pan.status_code == 200) {
                setFieldError(data => ({
                    ...data,
                    panError: check_Pan.message
                }))
            }
            else {
                setFieldError(data => ({
                    ...data,
                    panError: ""
                }))
            }
        }

    };
    function handlePanInput(e) {
        const upperCaseValue = e.target.value.toUpperCase();

        setInfoData({
            ...infoData,
            pan: upperCaseValue,
            user_details: {
                ...infoData.user_details,
                pan: e.target.value,
            },
        })
    };

    const setDate = (date) => {
        setInfoData({
            ...infoData,
            dob: moment(date).format("DD/MM/YYYY"),
            user_details: {
                ...infoData.user_details,
                dob: moment(date).format("DD/MM/YYYY"),
            },
        });

        const dob = moment(date);
        const ageInYears = moment().diff(dob, 'years');
        setAge(ageInYears);
        checkRetirementAgeAfterDOBChange(ageInYears);
        checkLifeExpectancyAgeAfterDOBChange(ageInYears);
    };

    const saveupdatefpuserdata = async (e) => {
       
        try {
            let payload = {};

            Object.entries({
                "user_id": getParentUserId(),
                "name": infoData.user_name,
                "dob": moment(infoData.dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
                "mobile": infoData.mobile,
                "alternate_mobile": infoData.alternate_mobile,
                "gender": infoData.gender,
                "pan": infoData.pan,
                "address": infoData.alternate_address,
                "pincode": infoData.pin_code,
                "occupation": infoData.occupation,
                "retirement_age": parseInt(infoData.retirement_age),
                "life_expectancy_age": parseInt(infoData.life_expectancy),
                "user_remarks": infoData.remark,
                "data_belongs_to": DATA_BELONGS_TO
            }).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== "") {
                    payload[key] = value;
                }
            });

            let addInfoData = await updateBasicDetails(payload);

            if (parseInt(addInfoData["status_code"]) === 200) {

                if (window.webengage && window.webengage.user) {
                    webengage.user.setAttribute("age", Number(age));
                    webengage.user.setAttribute("we_city", infoData.city || "");
                    webengage.user.setAttribute("gender", infoData.gender?.toLowerCase());
                    webengage.user.setAttribute("we_birth_date", infoData.dob);
                    webengage.user.setAttribute("we_first_name", infoData.user_name);
                    webengage.user.setAttribute("fullName", infoData.user_name);
                }
                toastr.options.positionClass = "toast-bottom-left";
                toastr.success(addInfoData.message);
                props.onOpenYourInfoModal();
                props.setTab("tab2");
                setIsLoading(false)
                // getknowyourstatus();
                // update_opportunity_status();
                check_profile_status();
                // updateretirementdate();


            }
            else {
                if (parseInt(addInfoData["status_code"]) === 404) {
                    toastr.options.positionClass = "toast-bottom-left";
                    toastr.error((addInfoData.data['data']))
                }
                if (parseInt(addInfoData["status_code"]) != 200) {
                    toastr.options.positionClass = "toast-bottom-left";
                    toastr.error("Oops something went wrong!!");
                }
                setIsLoading(false)

            }
        }
        catch (e) {
            console.log('Error', e);
        }
    };
    const handleSubmit = async (e) => {

        const shouldAnimate = infoData.alternate_address ? infoData.alternate_address.length >= 50 : 0;
        setAnimateAddress(shouldAnimate);
        e.preventDefault();
        e.stopPropagation();
        ScrollToTop();
        // Check if DOB is valid (age >= 18)
        if (age < 18) {
            setFieldError(data => ({
                ...data,
                dobError: 'DOB must be 18 or above'
            }));
            return; // Prevent API call
        } else {
            setFieldError(data => ({
                ...data,
                dobError: ''
            }));
        }

        if (infoData.occupation == 0) {
            setFieldError(data => ({
                ...data,
                occupationError: 'Please select occupation'
            }))
        }
        else {
            setFieldError(data => ({
                ...data,
                occupationError: ''
            }))
        }
        // if (infoData.last_name.trim() == '') {
        //     setFieldError(data => ({
        //         ...data,
        //         lastNameError: 'Please enter last name'
        //     }))
        // }
        // else {
        //     setFieldError(data => ({
        //         ...data,
        //         lastNameError: ''
        //     }))
        // }
        if (infoData.retirement_age === 0 || infoData.retirement_age == '' || !infoData.retirement_age) {
            setFieldError(data => ({
                ...data,
                retAgeError: 'Please enter retirement age'
            }))
        }
        else {
            if (fieldError.retAgeError == '') {
                setFieldError(data => ({
                    ...data,
                    retAgeError: ''
                }))
            }

        }
        if (infoData.life_expectancy == '0' || infoData.life_expectancy == '' || !infoData.life_expectancy) {
            setFieldError(data => ({
                ...data,
                lifeExpError: 'Please enter life expectancy age'
            }))
        }
        else {
            if (fieldError.lifeExpError == '') {
                setFieldError(data => ({
                    ...data,
                    lifeExpError: ''
                }))
            }

        }
       
        if (isNotEditable) {
            if (infoData.occupation != 0 && (infoData.retirement_age != 0 && infoData.retirement_age != '' && infoData.retirement_age) && (infoData.life_expectancy != '0' && infoData.life_expectancy != '' && infoData.life_expectancy) && fieldError.lifeExpError == '' && fieldError.retAgeError == '') {
                setIsLoading(true)
                await saveupdatefpuserdata();

            }
            else {
                simpleValidator.current.showMessages()
            }
        }
        else {
            if (simpleValidator.current.allValid() && infoData.occupation != 0 && (infoData.retirement_age != 0 && infoData.retirement_age != '' && infoData.retirement_age) && (infoData.life_expectancy != '0' && infoData.life_expectancy != '' && infoData.life_expectancy) && fieldError.lifeExpError == '' && fieldError.retAgeError == '' ) {
                setIsLoading(true)

                await saveupdatefpuserdata();

            }
            else {
                simpleValidator.current.showMessages()
            }
        }
        // saveupdatefpuserdata();
        // setShow(true);
        // props.setTab("tab2");
    };

    // const updateretirementdate = async () => {

    //     let session_data = session
    //     try {
    //         var retire_data = {
    //             fp_log_id: session_data["data"]["user_details"]["fp_log_id"],
    //             fp_user_id: session_data["data"]["user_details"]["user_id"],
    //             data_belongs_to: DATA_BELONGS_TO
    //         }

    //         var payload_retire_data = commonEncode.encrypt(JSON.stringify(retire_data));

    //         var config_ret = await apiCall(
    //             ADVISORY_UPDATE_RETIREMENT_DATE_API_URL,
    //             payload_retire_data,
    //             false,
    //             false
    //         );

    //         var res_ret = JSON.parse(commonEncode.decrypt(config_ret));
    //     }
    //     catch (e) {
    //         console.log('Error', e);
    //     }
    // };

    // const getknowyourstatus = async () => {

    //     let session_data = session
    //     try {
    //         var gtys_data = {
    //             fp_log_id: session_data["data"]["user_details"]["fp_log_id"],
    //             user_id: session_data["data"]["user_details"]["user_id"],
    //             web: 1,
    //             data_belongs_to: DATA_BELONGS_TO
    //         }

    //         var payload_gtys_data = commonEncode.encrypt(JSON.stringify(gtys_data));

    //         var config_gtys = await apiCall(
    //             ADVISORY_GET_KNOW_YOUR_STATUS_API_URL,
    //             payload_gtys_data,
    //             false,
    //             false
    //         );

    //         var res_gtys = JSON.parse(commonEncode.decrypt(config_gtys));
    //     }
    //     catch (e) {
    //         console.log('Error', e);
    //     }
    // };

    const check_profile_status = async () => {
        try {

            var config_pfs = await CheckProfileStatus(getParentUserId())
        }
        catch (e) {
            console.log('Error', e);
        }
    };


    // const update_opportunity_status = async () => {
    //     try {
    //         let opp_id = getItemLocal("opportunity_id")
    //         let payload = {
    //             "party_name": leadId,
    //             "opportunity_id": opp_id,
    //             "custom_opportunity_status": "Data Gathering Scheduled"
    //         }
    //         var config_pfs = await updateOpportunityStatus(payload)
    //         console.log("congid",config_pfs,payload)
    //     }
    //     catch (e) {
    //         console.log('Error', e);
    //     }
    // };

    const checkRetirementAge = (retAge) => {
        if (retAge && age) {
            if (parseInt(retAge) <= parseInt(age)) {
                setFieldError(data => ({
                    ...data,
                    retAgeError: 'Please enter value more than age'
                }))
            }
            else if (parseInt(retAge) > 80) {
                setFieldError(data => ({
                    ...data,
                    retAgeError: 'Please enter age less than or equal to 80'
                }))
            }
            else if (parseInt(retAge) > parseInt(infoData.life_expectancy)) {
                setFieldError(data => ({
                    ...data,
                    retAgeError: 'Please enter retirement age less than life expectancy age'
                }))
            }
            else {
                setFieldError(data => ({
                    ...data,
                    retAgeError: ''
                }))
            }
        }
        else if (parseInt(retAge) > 80) {
            setFieldError(data => ({
                ...data,
                retAgeError: 'Please enter age less than or equal to 80'
            }))
        }
        else if (parseInt(retAge) > parseInt(infoData.life_expectancy)) {
            setFieldError(data => ({
                ...data,
                retAgeError: 'Please enter retirement age less than life expectancy age'
            }))
        }
        else {
            setFieldError(data => ({
                ...data,
                retAgeError: ''
            }))
        }
    }

    const checkRetirementAgeAfterDOBChange = (age) => {
        let retAge = infoData.retirement_age ? infoData.retirement_age : 0;
        if (retAge && age) {
            if (parseInt(retAge) <= parseInt(age)) {
                setFieldError(data => ({
                    ...data,
                    retAgeError: 'Please enter value more than age'
                }))
            }
            else if (parseInt(retAge) > 80) {
                setFieldError(data => ({
                    ...data,
                    retAgeError: 'Please enter age less than or equal to 80'
                }))
            }
            else if (parseInt(retAge) > parseInt(infoData.life_expectancy)) {
                setFieldError(data => ({
                    ...data,
                    retAgeError: 'Please enter retirement age less than life expectancy age'
                }))
            }
            else {
                setFieldError(data => ({
                    ...data,
                    retAgeError: ''
                }))
            }
        }
        else if (parseInt(retAge) > 80) {
            setFieldError(data => ({
                ...data,
                retAgeError: 'Please enter age less than or equal to 80'
            }))
        }
        else if (parseInt(retAge) > parseInt(infoData.life_expectancy)) {
            setFieldError(data => ({
                ...data,
                retAgeError: 'Please enter retirement age less than life expectancy age'
            }))
        }
        else {
            setFieldError(data => ({
                ...data,
                retAgeError: ''
            }))
        }
    }
    const checkLifeExpectancyAge = (lifeExpAge) => {
        if (lifeExpAge && infoData.retirement_age) {
            if (parseInt(lifeExpAge) <= parseInt(infoData.retirement_age)) {
                setFieldError(data => ({
                    ...data,
                    lifeExpError: 'Please enter value more than retirement age'
                }))
            }
            else if (parseInt(lifeExpAge) > 100) {
                setFieldError(data => ({
                    ...data,
                    lifeExpError: 'Please enter age less than or equal to 100'
                }))
            }
            else {
                setFieldError(data => ({
                    ...data,
                    lifeExpError: ''
                }))

            }
        }
        else if (parseInt(lifeExpAge) > 100) {
            setFieldError(data => ({
                ...data,
                lifeExpError: 'Please enter age less than or equal to 100'
            }))
        }
        else {
            setFieldError(data => ({
                ...data,
                lifeExpError: ''
            }))
        }
    }

    const checkLifeExpectancyAgeAfterDOBChange = (age) => {
        let lifeExpAge = infoData.life_expectancy ? infoData.life_expectancy : 0;
        if (lifeExpAge && infoData.retirement_age) {
            if (parseInt(lifeExpAge) <= parseInt(infoData.retirement_age)) {
                setFieldError(data => ({
                    ...data,
                    lifeExpError: 'Please enter value more than retirement age'
                }))
            }
            else if (parseInt(lifeExpAge) > 100) {
                setFieldError(data => ({
                    ...data,
                    lifeExpError: 'Please enter age less than or equal to 100'
                }))
            }
            else {
                setFieldError(data => ({
                    ...data,
                    lifeExpError: ''
                }))

            }
        }
        else if (parseInt(lifeExpAge) > 100) {
            setFieldError(data => ({
                ...data,
                lifeExpError: 'Please enter age less than or equal to 100'
            }))
        }
        else {
            setFieldError(data => ({
                ...data,
                lifeExpError: ''
            }))
        }
    }
    const isValid =
        age >= 0 && // Ensure age is a non-negative value
        age <= 99 && // Ensure age is less than or equal to 99
        infoData.retirement_age >= 0 && // Ensure retirement_age is a non-negative value
        infoData.retirement_age <= 99 && // Ensure retirement_age is less than or equal to 99
        infoData.life_expectancy >= 0 && // Ensure life_expectancy is a non-negative value
        infoData.life_expectancy <= 100 && // Ensure life_expectancy is less than or equal to 100
        infoData.retirement_age >= age &&
        infoData.life_expectancy >= infoData.retirement_age &&
        infoData.life_expectancy >= age;


    const shouldAnimateAddress = () => {
        return isNotEditable;
    };
    const handleInputChange = (e) => {
        // Check if the field is editable before updating the state
        if (!isNotEditable) {
            setInfoData({
                ...infoData,
                alternate_address: e.target.value,
                user_details: {
                    ...infoData.user_details,
                    alternate_address: e.target.value,
                },
            });
            setAnimateAddress(false);
        }
    };

    useEffect(() => {
        // Start animation when isNotEditable is true
        setAnimateAddress(isNotEditable);
    }, [isNotEditable]);

    return (
        <div>
            <FintooLoader isLoading={isLoading} />

            <form noValidate="novalidate" name="goldassetform">
                <div className="col-md-12">

                    {getItemLocal("reportstatus") == "Y" &&
                        <>
                            <div
                                style={{ color: "#F0806D", paddingTop: 20, paddingRight: 20 }}
                                className=""
                            >
                                Note : 1) As you have already generated the report you can
                                only edit Retirement Age and Life Expectancy Age in "YOUR
                                INFO" section.
                            </div>

                            <div
                                className="pt-2"
                                style={{ color: "#F0806D", marginLeft: 43 }}
                            >
                                2) To change your mobile number or email id, send a request to{" "}
                                <a
                                    href="mailto:support@fintoo.in"
                                    style={{ color: "#6151c9" }}
                                >
                                    <u>support@fintoo.in</u>
                                </a>
                                .
                            </div>
                        </>
                    }

                    {getItemLocal("ndasignstatus") == "Y" && getItemLocal("reportstatus") == "N" &&
                        <div
                            className="pt-2"
                            style={{ color: "#F0806D", marginLeft: 43 }}
                        >
                            Note: To change your mobile number or email id, send a request to{" "}
                            <a
                                href="mailto:support@fintoo.in"
                                style={{ color: "#6151c9" }}
                            >
                                <u>support@fintoo.in</u>
                            </a>
                            .
                        </div>
                    }

                </div>
                <p
                    style={{
                        height: "1rem",
                    }}
                ></p>
                <div className="row">
                    <div className="col-md-8 col-12 custom-input">
                        <div className={`form-group mt-2 ${infoData.user_name ? "inputData" : null}`}>
                            <input type="text" id="user_name" name="user_name" value={infoData.user_name}
                                onChange={(e) => {
                                    setInfoData({
                                        ...infoData,
                                        user_name: e.target.value,
                                        user_details: {
                                            ...infoData.user_details,
                                            user_name: e.target.value,
                                        },
                                    });
                                }}
                                readOnly={isSavedFieldsEditable.username}
                                required autoComplete="off" />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label htmlFor="name">Full Name*</label>
                            <>{simpleValidator.current.message('user_name', infoData.user_name, 'required|alpha_space', { messages: { required: 'Please enter full name', alpha_space: 'Alphabets are allowed only.' } })}</>
                        </div>
                    </div>
                    {/* <div className="col-md-4 col-12 custom-input">
                        <div className={`form-group mt-2 ${infoData.last_name ? "inputData" : null}`}>
                            <input type="text" id="last_name" name="last_name" value={infoData.last_name}
                                onChange={(e) => {
                                    // Check if the field is editable before updating the stat
                                    if (!isSavedFieldsEditable.lastname) {
                                        setFieldError(data => ({
                                            ...data,
                                            lastNameError: ""
                                        }))
                                        setInfoData({
                                            ...infoData,
                                            last_name: e.target.value,
                                            user_details: {
                                                ...infoData.user_details,
                                                last_name: e.target.value,
                                            },
                                        });
                                    }
                                }}
                                onBlur={() => {
                                 
                                    if (!isSavedFieldsEditable.lastname) {
                                        simpleValidator.current.showMessageFor('last_name');

                                    }
                                }}
                                readOnly={isSavedFieldsEditable.lastname}
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label htmlFor="name">Last Name*</label>
                          

                            <>{simpleValidator.current.message('last_name', infoData.last_name, 'required|alpha_space', { messages: { required: 'Please enter last name', alpha_space: 'Alphabets are allowed only.' } })}</>
                          
                        </div>
                    </div> */}
                </div>
                <div className="row mt-2">
                    <div className="col-md-4 col-12 custom-input">
                        <div className={`form-group w-100 mt-2  ${infoData.alternate_address ? "inputData" : null}`}>
                            <span>
                                <input
                                    id="alternate_address"
                                    className={(infoData?.alternate_address && infoData?.alternate_address.length >= 50 && shouldAnimateAddress()) ? 'animateaddress' : null}
                                    type="text"
                                    name="alternate_address"
                                    value={infoData.alternate_address}
                                    onChange={handleInputChange}
                                    readOnly={isNotEditable}
                                    autoComplete="off"
                                />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label htmlFor="name">Residential Address</label>
                            </span>
                            <span className="info-hover-box">
                                <span className="icon">
                                    <img
                                        alt="More information"
                                        src={imagePath + '/static/media/more_information.svg'}
                                    />
                                </span>
                                <span className="msg">
                                    Ex: Flat no, Building Name, Road/street, Locality
                                </span>
                            </span>
                        </div>
                        <>{simpleValidator.current.message('alternate_address', infoData.alternate_address, 'min:10', { messages: { min: 'Please enter atleast 10 characters' } })}</>
                    </div>
                    <div className="col-md-4 col-12 custom-input">
                        <div className={`form-group w-100 mt-2  ${infoData.pin_code ? "inputData" : null}`}>
                            <span>
                                <input type="text" id="pincode" name="pincode" value={infoData.pin_code}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Check if the field is editable before updating the state
                                        if (!isNotEditable && /^\d*$/.test(value)) {
                                            setInfoData({
                                                ...infoData,
                                                pin_code: value.slice(0, 6),
                                                user_details: {
                                                    ...infoData.user_details,
                                                    pin_code: value.slice(0, 6),
                                                },
                                            });
                                        }
                                    }}
                                    onBlur={() => {
                                        // Check if the field is editable before running the validation
                                        if (!isNotEditable) {
                                            simpleValidator.current.showMessageFor('pincode');

                                        }
                                    }}
                                    readOnly={isSavedFieldsEditable.pincode}
                                    required autoComplete="off" />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label htmlFor="name">Pincode*</label>
                            </span>
                            <span className="info-hover-box">
                                <span className="icon">
                                    <img
                                        alt="More information"
                                        src={imagePath + '/static/media/more_information.svg'}
                                    />
                                </span>
                                <span className="msg">Ex: 400097</span>
                            </span>
                        </div>
                        <>{simpleValidator.current.message('pincode', infoData.pin_code, 'required|numeric|min:6|max:6', { messages: { required: 'Please enter valid pincode', min: 'Please enter valid pincode' } })}</>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-4 col-12 custom-input">
                        <div className={`form-group mt-2 ${infoData.email ? "inputData" : null}`}>
                            <input type="text" id="email" name="email" value={infoData.email}
                                onChange={(e) => {
                                    setInfoData({
                                        ...infoData,
                                        email: e.target.value,
                                        user_details: {
                                            ...infoData.user_details,
                                            email: e.target.value,
                                        },
                                    })
                                }}
                                readOnly required autoComplete="off" />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label htmlFor="name">Email Address*</label>
                        </div>
                    </div>
                    <div className="col-md-4 col-12 custom-input">
                        <div className={`form-group w-100 mt-2 ${infoData.pan && infoData.pan?.length <= 10 ? "inputData" : ""}`}>
                            <span>
                                <input
                                    type="text"
                                    id="pan"
                                    name="pan"
                                    value={infoData.pan || ""}
                                    onChange={(e) => {
                                        setFieldError(data => ({
                                            ...data,
                                            panError: ""
                                        }));
                                        handlePanInput(e);
                                    }}
                                    onBlur={() => {
                                        if (!isSavedFieldsEditable.pan) {
                                            simpleValidator.current.showMessageFor("PAN");
                                            checkifpanexists();
                                        }
                                    }}
                                    maxLength={10}
                                    readOnly={isSavedFieldsEditable.pan}
                                    autoComplete="off"
                                />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label htmlFor="name">PAN</label>
                            </span>
                            <span className="info-hover-box">
                                <span className="icon">
                                    <img
                                        alt="More information"
                                        src={imagePath + '/static/media/more_information.svg'}
                                    />
                                </span>
                                <span className="msg">Ex: BPYPK1234C</span>
                            </span>
                        </div>
                        {infoData.pan?.length <= 10 && !isNotEditable && (
                            <>
                                {simpleValidator.current.message('PAN', infoData.pan, [{ regex: /^[A-Za-z]{3}[HPhp]{1}[A-Za-z]{1}\d{4}[A-ZHPa-zhp]{1}$/ }], { messages: { regex: 'Please enter valid PAN' } })}
                                <div style={{
                                    display: infoData.pan === "0" ? "none" : "block"
                                }} className="error">{fieldError.panError}</div>
                            </>
                        )}
                    </div>

                </div>
                <div className="row mt-2">
                    <div className="col-md-4 col-12 custom-input">
                        <div className={`form-group mt-2 inputData`}>
                            <input type="text" id="mobile" name="mobile" value={`+${infoData.country_code} ${infoData.mobile}`}
                                onChange={(e) => {
                                    setInfoData({
                                        ...infoData,
                                        mobile: e.target.value,
                                        user_details: {
                                            ...infoData.user_details,
                                            mobile: e.target.value,
                                        },
                                    })
                                }}
                                readOnly required autoComplete="off" />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label htmlFor="name">Mobile Number*</label>
                        </div>
                    </div>
                    <div className="col-md-4 col-12 custom-input">
                        <div className={`form-group mt-2 ${infoData.alternate_mobile ? "inputData" : null}`}>
                            <input type="text" id="alternate_mobile" name="alternate_mobile" value={infoData.alternate_mobile}
                                onChange={(e) => {
                                    if (!isNotEditable) {
                                        // checkInput(e);
                                        setInfoData({
                                            ...infoData,
                                            alternate_mobile: e.target.value.slice(0, 10),
                                            user_details: {
                                                ...infoData.user_details,
                                                alternate_mobile: e.target.value.slice(0, 10),
                                            },
                                        });
                                    }
                                }}
                                onBlur={() => {
                                    // Check if the field is editable before running the validation
                                    if (!isNotEditable) {
                                        simpleValidator.current.showMessageFor("alternate_mobile");

                                    }

                                }} autoComplete="off" />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label htmlFor="name">Alternate Mobile Number</label>
                        </div>
                        {(
                            <>
                                <>{simpleValidator.current.message('alternate_mobile', infoData.alternate_mobile, 'numeric|min:8|max:10', { messages: { min: 'Please enter at least 8 characters.' } })}</>
                            </>

                        )}
                    </div>
                </div>
                <div className="row d-flex align-items-center">
                    <div className="col-md-4 col-12">
                        <div className="dark-label">
                            <Form.Label>DOB*</Form.Label>
                            <div
                                className="dt-conbx"
                                style={{
                                    borderBottom: "1px solid #dadada",
                                    paddingTop: "9px",
                                    marginTop: "1px !important",
                                }}
                            >
                                <ReactDatePicker
                                    readOnly={isNotEditable}
                                    select_date={moment(infoData.dob, "DD/MM/YYYY").toDate()}
                                    setDate={(date) => {
                                        // Check if the field is editable before updating the state
                                        if (!isNotEditable) {
                                            setDate(date);
                                        }
                                    }}
                                    minDate={moment().subtract(100, "years")}
                                    maxDate={moment().subtract(18, "years")}
                                    className="pt-4"

                                />
                            </div>
                            {!isNotEditable && (
                                <div style={{ position: 'absolute' }}>
                                    {simpleValidator.current.message('DOB', infoData.dob, 'required', { messages: { required: 'Please select date of birth' } })}
                                    {age < 18 && <div className="srv-validation-message">DOB must be 18 or above</div>}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-4 col-12 custom-input">
                        <div className={`form-group inputData`} style={{ paddingTop: "17px" }}>
                            <input id="Age" type="Number" name="Age" value={age}
                                readOnly autoComplete="off" />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label htmlFor="name">Age</label>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-4 col-12 custom-input">
                        <div
                            className="material mt-2"
                            style={{
                                width: "100% !important",
                            }}
                        >
                            <Form.Label>Occupation*</Form.Label>
                            {occupationList && (
                                <Select
                                    id="occupationSelect"
                                    name="occupation"
                                    style={{ marginBottom: "0" }}
                                    classNamePrefix="sortSelect"
                                    isSearchable={false}
                                    styles={customStyles}
                                    options={occupationList}
                                    isDisabled={isNotEditable}
                                    value={infoData.occupation !== 0 ? occupationList.find((option) => option.value === infoData.occupation) : null}
                                    onChange={(e) => {
                                        setInfoData({
                                            ...infoData,
                                            occupation: e.value,
                                            user_details: {
                                                ...infoData.user_details,
                                                occupation: e.value,
                                            },
                                        })

                                        setFieldError(data => ({
                                            ...data,
                                            occupationError: ''
                                        }))

                                    }}

                                />

                            )}
                        </div>
                        {!isNotEditable && (
                            <div style={{ position: "absolute", bottom: '-9px' }} className="srv-validation-message">{fieldError.occupationError}</div>
                        )}
                    </div>
                    <div className="col-md-4 col-12">
                        <div className="dark-label">
                            <Form.Label>Gender*</Form.Label>
                            <div className="d-flex pt-4" style={{ clear: "both" }}>
                                <FintooRadio2
                                    checked={infoData.gender == "Male"}
                                    onClick={() => {
                                        !isNotEditable ?
                                            setInfoData({
                                                ...infoData,
                                                gender: "Male",
                                                user_details: {
                                                    ...infoData.user_details,
                                                    gender: "Male",
                                                },
                                            })
                                            : undefined
                                    }}


                                    title="Male"
                                />
                                <FintooRadio2
                                    checked={infoData.gender == "Female"}
                                    onClick={() => {
                                        !isNotEditable ?
                                            setInfoData({
                                                ...infoData,
                                                gender: "Female",
                                                user_details: {
                                                    ...infoData.user_details,
                                                    gender: "Female",
                                                },
                                            })
                                            : undefined

                                    }}

                                    title="Female"
                                />
                                <FintooRadio2
                                    checked={infoData.gender == "Other"}
                                    onClick={() => {
                                        !isNotEditable ?
                                            setInfoData({
                                                ...infoData,
                                                gender: "Other",
                                                user_details: {
                                                    ...infoData.user_details,
                                                    gender: "Other",
                                                },
                                            })
                                            : undefined

                                    }}

                                    title="Other"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-4 col-12 custom-input">
                        <div className={`form-group w-100 mt-2  ${infoData.retirement_age ? "inputData" : null}`}>
                            <span>
                                <input
                                    id="retirement_age"
                                    type="text"
                                    name="retirement_age"
                                    pattern="^[1-9][0-9]?$"
                                    value={infoData.retirement_age}
                                    inputMode="numeric"
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const isValidInput = /^(?:[1-9][0-9]?)?$/.test(inputValue);

                                        setInfoData({
                                            ...infoData,
                                            retirement_age: isValidInput ? inputValue : infoData.retirement_age,
                                            user_details: {
                                                ...infoData.user_details,
                                                retirement_age: isValidInput ? inputValue : infoData.retirement_age,
                                            },
                                        });

                                        if (isValidInput) {
                                            checkRetirementAge(inputValue);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        simpleValidator.current.showMessageFor("Retirement Age")
                                    }}
                                    required autoComplete="off" />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label htmlFor="name">Retirement Age*</label>
                            </span>
                            <span className="info-hover-box">
                                <span className="icon">
                                    <img
                                        alt="More information"
                                        src={imagePath + '/static/media/more_information.svg'}
                                    />
                                </span>
                                <span className="msg">
                                    Put an age by when you wish to retire.
                                </span>
                            </span>
                        </div>
                        <div className="srv-validation-message">{fieldError.retAgeError}</div>
                    </div>
                    <div className="col-md-4 col-12 custom-input">
                        <div className={`form-group w-100 mt-2  ${infoData.life_expectancy ? "inputData" : null}`}>
                            <span>
                                <input
                                    id="life_expectancy"
                                    type="text"
                                    name="life_expectancy"
                                    pattern="^(?:[1-9][0-9]?|100)?$"
                                    value={infoData.life_expectancy}
                                    inputMode="numeric"
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const isValidInput = /^(?:[1-9][0-9]?|100)?$/.test(inputValue);

                                        setInfoData({
                                            ...infoData,
                                            life_expectancy: isValidInput ? inputValue : infoData.life_expectancy,
                                            user_details: {
                                                ...infoData.user_details,
                                                life_expectancy: isValidInput ? inputValue : infoData.life_expectancy,
                                            },
                                        });

                                        if (isValidInput) {
                                            checkLifeExpectancyAge(inputValue);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        simpleValidator.current.showMessageFor("Life Expectancy")
                                    }}
                                    required autoComplete="off" />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label htmlFor="name">Life Expectancy*</label>
                            </span>
                            <span className="info-hover-box">
                                <span className="icon">
                                    <img
                                        alt="More information"
                                        src={imagePath + '/static/media/more_information.svg'}
                                    />
                                </span>
                                <span className="msg">
                                    Type an age not less than 70. Keep in mind your family
                                    history. Also, note that women live longer than men.
                                </span>
                            </span>
                        </div>
                        <div className="srv-validation-message">{fieldError.lifeExpError}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9 col-12 custom-input">
                        <div className={`form-group mt-4 ${infoData.remark ? "inputData" : null} `}>
                            <input id="remark" type="text" value={infoData.remark} name="Remarks"
                                onChange={(e) => {
                                    setInfoData({
                                        ...infoData,
                                        remark: e.target.value,
                                        user_details: {
                                            ...infoData.user_details,
                                            remark: e.target.value,
                                        },
                                    })
                                }} autoComplete="off" />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label htmlFor="name">Remarks</label>
                        </div>

                    </div>
                </div>

                <div className="row">
                    <div className="col-md-8 col-12">
                        <div className="d-flex justify-content-center mt-2">
                            <button
                                className="default-btn gradient-btn save-btn outline-none"
                                onClick={(e) => {

                                    handleSubmit(e)
                                }
                                }
                            >
                                Save & Continue
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
};

export default YourInfo;