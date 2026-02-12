import React, { useState, useRef, useEffect } from "react";
import { FloatingLabel, Form, Modal } from "react-bootstrap";
import FintooRadio2 from "../../components/FintooRadio2";
import Select, { components } from "react-select";
import ReactDatePicker from "../../components/HTML/ReactDatePicker/ReactDatePicker";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import {
    imagePath,
    DATA_BELONGS_TO
} from "../../constants";
import { apiCall, getItemLocal, getParentFpLogId, getParentUserId, getUserId, loginRedirectGuest } from "../../common_utilities";
import commonEncode from "../../commonEncode";
import { Buffer } from "buffer";
import axios from "axios";
import SimpleReactValidator from "simple-react-validator";
import moment from "moment";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import FintooLoader from "../../components/FintooLoader";
import DGstyles from "./DG.module.css";
import customStyles from "../../components/CustomStyles";
import { ScrollToTop } from "./ScrollToTop"
import { addFamilyMember, deleteFamilyMember, fetchUserProfileDetails, getFamilyMember, getMemberDetails, getOccupationList, updateFamilyMember } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
function Family(props) {

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

    const options1 = [
        {
            title: "Spouse",
            id: "RELM-2",
            image: imagePath + "/static/media/DG/about-you/about-family-spouse.svg",
        },
        {
            title: "Son",
            id: "RELM-3",
            image: imagePath + "/static/media/DG/about-you/about-family-son.svg",
        },
        {
            title: "Daughter",
            id: "RELM-4",
            image: imagePath + "/static/media/DG/about-you/about-family-daughter%20.svg",
        },
        {
            title: "Father",
            id: "RELM-5",
            image: imagePath + "/static/media/DG/about-you/about-family-father.svg",
        },
        {
            title: "Mother",
            id: "RELM-6",
            image: imagePath + "/static/media/DG/about-you/about-family-mother.svg",
        },
        {
            title: "Hindu Undivided Family",
            id: "RELM-7",
            image: imagePath + "/static/media/DG/about-you/about-family-HUF.svg",
        },
        {
            title: "Others",
            id: "RELM-8",
            image: imagePath + "/static/media/DG/about-you/about-family-dependent.svg",
        },
    ];
    const setTab = props.setTab;
    const [selectedOption, setSelectedOption] = useState("Spouse");
    const [session, setSession] = useState("");
    const [familyData, setFamilyData] = useState([]);
    const [show, setShow] = useState(false);
    const [fieldError, setFieldError] = useState({ "retAgeError": "", "lifeExpError": "" });
    const [showview, setShowView] = useState(true);
    const [selfDetails, setSelfDetails] = useState([]);
    const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
    const cntRef = useRef(null);
    const scrollToFamilyRef = () => {
        cntRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const userid = getParentUserId();
    const fpLogId = getParentFpLogId();

    useEffect(() => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        simpleValidator.current.hideMessages();
        setForceUpdate((v) => ++v);
        if (!userid) {
            loginRedirectGuest();
        }
    }, []);

    const scrollToFamily = () => {
        var body = document.body,
            html = document.documentElement;

        var height = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);
        window.scroll(0, height);
    };
    const handleShow = () => {
        setShow(true);
    };

    const handleClose = (type) => {
        if (type == "yes") {
            setIsLoading(true);
            deleteFamily(deleteId);
        }
        else {
            setShow(false);
            setIsLoading(false);
        }
    }

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
        getoccupationList();
        getFamily();

    }, []);


    const scrollToList = () => {
        window.scroll({ top: 0 });
    };

    // APIs

    // const checksession = async () => {
    //     let url = '';
    // let url = CHECK_SESSION;
    //     let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
    //     let session_data = await apiCall(url, data, true, false);

    //     setSession(session_data)

    //     if (session_data['error_code'] == "100") {
    //         getFamily();
    //         // getSelfDetails(session_data);
    //         if (familyDetails.parent_user_id == 0) {
    //             var email = session_data['data']['email'];
    //             var mobile = session_data['data']['mobile']
    //             var parent_user_id = getParentUserId();
    //             setFamilyDetails({
    //                 ...defaultFamilyDetails,
    //                 email: email,
    //                 mobile: mobile,
    //                 parent_user_id: parent_user_id
    //             })
    //         }
    //     }
    //     else {
    //         loginRedirectGuest();
    //     }

    // };

    const getSelfDetails = async () => {
        setIsLoading(true);
        // let url = ADVISORY_GET_FP_USER_DATA + '?user_id=' + btoa(commonEncode.encrypt((session.data.id).toString())) + '&fp_log_id=' + btoa(commonEncode.encrypt((fpLogId).toString())) + '&fp_user_id=' + btoa(commonEncode.encrypt((session.data.fp_user_id).toString()));

        // let fpUserData = await apiCall(url, "", true, false);

        try {
            const fpUserData = await fetchUserProfileDetails(getParentUserId());
            if (fpUserData && fpUserData.data) {
                setFamilyDetails(prev => ({
                    ...prev,
                    retirement_age: fpUserData.data.user_retirement_age,
                    life_expectancy: fpUserData.data.user_life_expectancy
                }));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        setIsLoading(false);
    }

    const getFamily = async () => {

        try {
            // var get_family_data = await apiCall(

            //     BASE_API_URL + "restapi/getfpfamilydata/" +
            //     "?parent_user_id=" +
            //     Buffer.from(commonEncode.encrypt((getParentUserId()).toString())).toString("base64") +
            //     "&fp_log_id=" +
            //     Buffer.from(commonEncode.encrypt((fpLogId).toString())).toString("base64") +
            //     "&web=1&is_direct=1",
            // )
            var get_family_data = await getFamilyMember(getParentUserId())
            if (get_family_data["status_code"] === "200") {
                const family_data = get_family_data.data.filter(
                    (member) => member.relation?.toLowerCase() !== "self"
                );

                setFamilyData(family_data);
                scrollToList();
                // Use Array.prototype.some() to check if any family member has the relation "Spouse"
                const hasSpouse = family_data.some(
                    (member) => member.relation === "Spouse"
                );
                setIsSpouse(hasSpouse);

                // Use Array.prototype.some() to check if any family member has the relation "Father"
                const hasFather = family_data.some(
                    (member) => member.relation === "Father"
                );
                setIsFather(hasFather);

                // Use Array.prototype.some() to check if any family member has the relation "Mother"
                const hasMother = family_data.some(
                    (member) => member.relation === "Mother"
                );
                setIsMother(hasMother);

                if (hasSpouse) {
                    setSelectedOption("Son");
                    setFamilyDetails({
                        ...defaultFamilyDetails,
                        relation: "Son",
                        relation_id: "RELM-3"
                    })
                }
                else {
                    setSelectedOption("Spouse");
                    setFamilyDetails(defaultFamilyDetails);
                    setIsSpouse(false);
                }


                simpleValidator.current.hideMessages();
                setForceUpdate((v) => ++v);

            }

            else {
                setFamilyData([]);
                setSelectedOption("Spouse");
                setFamilyDetails(defaultFamilyDetails);
                setIsSpouse(false);
            }
        }
        catch (e) {
            console.log("Error", e)
        }
    };

    const defaultFamilyDetails = {
        occupation: "",
        email: "",
        mobile: "",
        salary_range: "2",
        gender: "Male",
        isdependent: "1",
        first_name: "",
        last_name: "",
        relation_id: "RELM-2",  // family id
        parent_user_id: 0,
        id: "",  // familyData list
        relation: "Spouse", // options -label
        dob: null,
        dobb: null,
        alternate_mobile: null,
        alternate_landline: null,
        alternate_address: null,
        city: null,
        pan: null,
        state: null,
        country: null,
        pin_code: null,
        tax_slab: null,
        life_expectancy: "",
        retirement_age: "",
        remark: "",
        user_isactive: "1",
        created_by: "0",
        created_datetime: "0",
        updated_datetime: "0",
        updated_by: "0",
        height: "",
        weight: "",
        uan: null,
        is_epf_linked: "0",
        user_id: "",
        fp_userid: "",
        member_id: "",
    };

    const [familyDetails, setFamilyDetails] = useState(defaultFamilyDetails);
    const [occupationList, setOccupationList] = useState([]);
    const [familyId, setFamilyId] = useState("")
    const simpleValidator = useRef(new SimpleReactValidator());
    const [, setForceUpdate] = useState(0);
    const [addForm, setAddForm] = useState(true);
    const [updateForm, setUpdateForm] = useState(false);
    const [fpuserId, setFpuserid] = useState("");
    const [memberId, setMemberId] = useState("");
    const [deleteId, setDeleteId] = useState("");
    const [isSpouse, setIsSpouse] = useState(false);
    const [isFather, setIsFather] = useState(false);
    const [isMother, setIsMother] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [age, setAge] = useState(0);
    const [familyDeleteName, setFamilyDeleteName] = useState("");

    const setDate = (date) => {
        if (selectedOption == "Hindu Undivided Family") {
            setFamilyDetails({
                ...familyDetails,
                dob: moment(date).format("DD/MM/YYYY"),
                dobb: moment(date).format("DD/MM/YYYY")
            })
        }
        else {
            setFamilyDetails({
                ...familyDetails,
                dob: moment(date).format("DD/MM/YYYY")
            });
        }

        const dob = moment(date);
        const ageInYears = moment().diff(dob, 'years');
        setAge(ageInYears);
    };

    // const getFpLog = async () => {
    //     let url = ADVISORY_GET_FP_LOG;
    //     let data = { user_id: getParentUserId() };

    //     let fp_log_resp = await apiCall(url, data, false, false);
    //     if (fp_log_resp["error_code"] == "100") {
    //         if (fp_log_resp.data.fp_log_id != "") {
    //             return fp_log_resp.data.fp_log_id;
    //         } else {
    //             return 0;
    //         }
    //     } else {
    //         return 0;
    //     }
    // };

    const getParentUserMobile = () => {
        try {
            const parentUserData = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser") || '[]'));
    
            if (!Array.isArray(parentUserData)) return '';
    
            // Find the parent user (the one with no parent_user_id)
            const parentUser = parentUserData.find(
                (user) => !user.parent_user_id || user.parent_user_id === null || user.parent_user_id === ''
            );
    
            return parentUser?.mobile || '';
        } catch (error) {
            console.error("Error fetching parent user data:", error);
            return '';
        }
    };
    


    const addFamily = async (e) => {
        e.preventDefault();
        try {
            let payload = {
                "parent_user_id": getParentUserId(),
                "name": familyDetails.first_name + ' ' + familyDetails.last_name,
                "dob": moment(familyDetails.dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
                "occupation": familyDetails.occupation,
                "retirement_age": familyDetails.retirement_age,
                "life_expectancy_age": familyDetails.life_expectancy,
                "relation_id": familyDetails.relation_id,
                "is_dependent": familyDetails.isdependent == "1" ? true : false,
                "user_remarks": familyDetails.remark,
                "data_belongs_to": DATA_BELONGS_TO,
                mobile: (user_data?.mobile && user_data.mobile.trim() !== "") 
                ? user_data.mobile 
                : getParentUserMobile(),
                email: user_data?.user_email,

            };
            // payload.email = session['data']['email'];
            // payload.mobile = session['data']['mobile'];

            let addFamilyDetails = await addFamilyMember(payload);
            if (addFamilyDetails["status_code"] == 200) {
                setIsLoading(false);
                scrollToList();
                toastr.options.positionClass = "toast-bottom-left";
                toastr.success(
                    "Member details for " + familyDetails.first_name + " saved succesfully"
                );
                setFamilyDetails({
                    ...defaultFamilyDetails,
                    occupation: "",
                    parent_user_id: getParentUserId(),
                })
                setAge(0);
                setFpuserid(addFamilyDetails.data.fp_userid);
                setMemberId(addFamilyDetails.data.member_id);
                setAddForm(true);
                setUpdateForm(false);
                getFamily();

                if (familyDetails.relation == "Spouse") {
                    setIsSpouse(true);
                    // setSelectedOption("Son");
                    setFamilyDetails({
                        ...defaultFamilyDetails,
                        relation: "Son",
                        relation_id: "RELM-3"
                    })
                } if (familyDetails.relation == "Father") {
                    setIsFather(true);
                } if (familyDetails.relation == "Mother") {
                    setIsMother(true);
                }

            } else {
                setIsLoading(false);
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Something went wrong");
            }
        } catch (err) {
            setIsLoading(false);
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Something went wrong");
        }
    };

    const checkRetirementAge = (retAge) => {
        if (retAge && age) {
            if (parseInt(retAge) <= parseInt(age)) {
                setFieldError(data => ({
                    ...data,
                    retAgeError: 'Please enter value more than age'
                }));
                scrollToFamilyRef();
            }
            else if (parseInt(retAge) > 80) {
                setFieldError(data => ({
                    ...data,
                    retAgeError: 'Please enter age less than or equal to 80'
                }));
                scrollToFamilyRef();
            }
            else if (parseInt(retAge) > parseInt(familyDetails.life_expectancy)) {
                setFieldError(data => ({
                    ...data,
                    retAgeError: 'Please enter retirement age less than life expectancy age'
                }));
                scrollToFamilyRef();
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
            }));
            scrollToFamilyRef();
        }
        else if (parseInt(retAge) > parseInt(familyDetails.life_expectancy)) {
            setFieldError(data => ({
                ...data,
                retAgeError: 'Please enter retirement age less than life expectancy age'
            }));
            scrollToFamilyRef();
        }
        else {
            setFieldError(data => ({
                ...data,
                retAgeError: ''
            }));
            scrollToFamilyRef();
        }
    };

    const checkLifeExpectancyAge = (lifeExpAge) => {

        if (lifeExpAge && familyDetails.retirement_age) {
            if (parseInt(lifeExpAge) <= parseInt(familyDetails.retirement_age)) {
                setFieldError(data => ({
                    ...data,
                    lifeExpError: 'Please enter value more than retirement age'
                }));
                scrollToFamilyRef();
            }
            else if (parseInt(lifeExpAge) > 100) {
                setFieldError(data => ({
                    ...data,
                    lifeExpError: 'Please enter age less than or equal to 100'
                }));
                scrollToFamilyRef();
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
            }));
            scrollToFamilyRef();
        }
        else {
            setFieldError(data => ({
                ...data,
                lifeExpError: ''
            }))
        }
    };

    const addFamilySubmit = async (e) => {

        e.preventDefault();
        // if(familyId == 7){
        //     setFamilyDetails({
        //         ...familyDetails,
        //         retirement_age: selfDetails.self_retirement_age,
        //         life_expectancy: selfDetails.self_life_expectancy
        //     })
        // }

        // if(familyId != 7){
        if (familyDetails.retirement_age === 0 || familyDetails.retirement_age == '' || !familyDetails.retirement_age) {
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
        // }

        if (familyDetails.life_expectancy == '0' || familyDetails.life_expectancy == 0 || familyDetails.life_expectancy == '' || !familyDetails.life_expectancy) {
            setFieldError(data => ({
                ...data,
                lifeExpError: 'Please enter life expectancy age'
            }));
            scrollToFamilyRef();
        }
        else {
            if (fieldError.lifeExpError == '') {
                setFieldError(data => ({
                    ...data,
                    lifeExpError: ''
                }))
            }
        }

        if (simpleValidator.current.allValid()) {
            if (familyDetails.isdependent == "1") {
                familyDetails.retirement_age = "0";
                familyDetails.life_expectancy = "0";
                setIsLoading(true);
                addFamily(e);
                setSelectedOption("Son")
                simpleValidator.current.hideMessages();
                setForceUpdate((v) => ++v);
            }
            else if (familyDetails.isdependent == "0" && fieldError.lifeExpError == '' && fieldError.retAgeError == '' &&
                (familyDetails.life_expectancy != '0' && familyDetails.life_expectancy != '' &&
                    familyDetails.retirement_age != 0 && familyDetails.retirement_age != '')) {
                setIsLoading(true);
                addFamily(e);
                setSelectedOption("Son")
                simpleValidator.current.hideMessages();
                setForceUpdate((v) => ++v);
            }
        }
        else {
            simpleValidator.current.showMessages(); // Show validation messages on all fields
            simpleValidator.current.showMessageFor("Occupation")
            setForceUpdate((v) => ++v);
        }
    };

    const updateFamily = async (e) => {
        e.preventDefault();
        try {

            let payload = {
                "user_id": familyDetails.user_id,
                "parent_user_id": getParentUserId(),
                "name": familyDetails.first_name + ' ' + familyDetails.last_name,
                "dob": moment(familyDetails.dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
                "occupation": familyDetails.occupation,
                "retirement_age": familyDetails.retirement_age,
                "is_dependent": familyDetails.isdependent == "1" ? true : false,
                "life_expectancy_age": familyDetails.life_expectancy,
                "relation_id": familyDetails.relation_id,
                "user_remarks": familyDetails.remark,
                "data_belongs_to": DATA_BELONGS_TO,
                mobile: (user_data?.mobile && user_data.mobile.trim() !== "") 
                ? user_data.mobile 
                : getParentUserMobile(),
                email: user_data?.user_email,
            };

            let updateFamilyDetails = await updateFamilyMember(payload);
            if (updateFamilyDetails["status_code"] == 200) {
                scrollToList();
                toastr.options.positionClass = "toast-bottom-left";
                toastr.success("Member details for " + familyDetails.first_name + " updated successfully");
                setFamilyDetails({
                    ...defaultFamilyDetails,
                    parent_user_id: getParentUserId(),
                })
                setAddForm(true);
                setUpdateForm(false);
                setAge(0);
                getFamily();
                setIsLoading(false);
            } else {
                setIsLoading(false);
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Something went wrong");
            }
        } catch (err) {
            setIsLoading(false);
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Something went wrong");
        }
    };

    const updateFamilyForm = async (e) => {
        e.preventDefault();
        if (familyDetails.retirement_age === 0 || familyDetails.retirement_age == '' || !familyDetails.retirement_age) {
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

        if (familyDetails.life_expectancy == '0' || familyDetails.life_expectancy == 0 || familyDetails.life_expectancy == '' || !familyDetails.life_expectancy) {
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
        if (simpleValidator.current.allValid()) {
            if (familyDetails.isdependent == "1") {
                familyDetails.retirement_age = "0";
                familyDetails.life_expectancy = "0";
                setIsLoading(true);
                updateFamily(e);
                simpleValidator.current.hideMessages();
                setForceUpdate((v) => ++v);
            }
            else if (familyDetails.isdependent == "0" && fieldError.lifeExpError == '' && fieldError.retAgeError == '' &&
                (familyDetails.life_expectancy != '0' && familyDetails.life_expectancy != '' &&
                    familyDetails.retirement_age != 0 && familyDetails.retirement_age != '')) {
                setIsLoading(true);
                updateFamily(e);
                simpleValidator.current.hideMessages();
                setForceUpdate((v) => ++v);
            }
        }
        else {
            simpleValidator.current.showMessages(); // Show validation messages on all fields
            setForceUpdate((v) => ++v);
        }
    };

    const cancelFamilyForm = async (e) => {
        e.preventDefault();
        // setFamilyDetails({
        //     ...defaultFamilyDetails,
        //     email: session["data"]["user_details"]["email"],
        //     mobile: session["data"]["user_details"]["mobile"],
        //     parent_user_id: session["data"]["user_details"]["user_id"]
        // });
        setAge(0);
        setAddForm(true);
        setUpdateForm(false);
        getFamily();
    };

    const deleteFamily = async (deleteId) => {
        try {
            // let url = ADVISORY_REMOVE_FAMILY_DATA;
            let payload = {
                user_id: deleteId,
                parent_user_id: getParentUserId(),
                data_belongs_to: DATA_BELONGS_TO,
            };

            let deleteFamilyData = await deleteFamilyMember(payload);
            if (deleteFamilyData["status_code"] == 200) {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.success(familyDeleteName + " has been deleted successfully");
                getFamily();
                // setFamilyDetails({
                //     ...defaultFamilyDetails,
                //     parent_user_id: session["data"]["user_details"]["user_id"],
                //     fpLogId,
                // })
                setShow(false);
                setIsLoading(false);
                setAge(0);
                setAddForm(true);
                setUpdateForm(false);
            } else {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Something went wrong");
                setAddForm(true);
                setUpdateForm(false);
            }
        } catch (err) {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Something went wrong");
        }
    };

    const editFamily = async (id) => {
        try {
            // var editFamilyDetails = await apiCall(

            //     BASE_API_URL + "restapi/getfpfamilydata/" +
            //     "?fp_user_id=" +
            //     Buffer.from(commonEncode.encrypt((id).toString())).toString("base64") +
            //     "&web=1",
            // )

            let editFamilyData = await getMemberDetails(id, getParentUserId());
            if (editFamilyData["status_code"] == 200) {
                scrollToFamily();
                if (editFamilyData.data['is_dependent'] == true) {
                    editFamilyData.data['isdependent'] = "1";
                    editFamilyData.data['retirement_age'] = "",
                        editFamilyData.data['life_expectancy_age'] = ""
                }
                else {
                    editFamilyData.data['isdependent'] = "0";
                }

                editFamilyData.data['dob'] = editFamilyData.data['dob'];
                if (editFamilyData.data['relation_id'] == "RELM-7") {
                    editFamilyData.data['dobb'] = editFamilyData.data['dob']
                }

                const username_parts = editFamilyData.data['user_name'].trim().split(" ");

                editFamilyData.data["first_name"] = username_parts[0] || "";
                editFamilyData.data["last_name"] = username_parts[1] || "";
                editFamilyData.data["occupation"] = editFamilyData.data['occupation_id'] ? editFamilyData.data['occupation_id'] : "";
                editFamilyData.data['life_expectancy'] = editFamilyData.data['life_expectancy_age']
                editFamilyData.data['remark'] = editFamilyData.data["user_remarks"]
                setFamilyDetails(editFamilyData.data);

                setFpuserid(editFamilyData.data['user_details_id']);
                setMemberId(editFamilyData.data['user_id']);
                toastr.options.positionClass = "toast-bottom-left";
                toastr.success("You can now edit details for " + editFamilyData.data.user_name);

                const dob = editFamilyData.data['dob'];
                const calculateAge = (dob) => {
                    const [day, month, year] = dob.split('/').map(Number);
                    const birthDate = new Date(year, month - 1, day); // Month is zero-based in JavaScript Date object
                    const today = new Date();
                    const ageInMillis = today - birthDate;
                    const ageDate = new Date(ageInMillis);
                    return Math.abs(ageDate.getUTCFullYear() - 1970);
                };
                const calculatedAge = calculateAge(dob);
                setAge(calculatedAge);

                if (editFamilyData.data.relation == "Spouse") {
                    // setIsSpouse(false);
                    setSelectedOption("Spouse");
                } if (editFamilyData.data.relation == "Father") {
                    // setIsFather(false);
                    setSelectedOption("Father");
                } if (editFamilyData.data.relation == "Mother") {
                    // setIsMother(false);
                    setSelectedOption("Mother");
                }

            } else {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Something went wrong");
            }
        } catch (err) {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Something went wrong");
        }
    };

    useEffect(() => {
        simpleValidator.current.hideMessages(); // Show validation messages on all fields
        setForceUpdate((v) => ++v);
    }, [cntRef, familyDetails]);

    useEffect(() => {
        simpleValidator.current.hideMessageFor('Occupation');
        setForceUpdate((v) => ++v);
    }, [familyDetails?.isdependent]);

    return (
        <div>
            <div className="row">
                {familyData && familyData.length > 0 && (
                    <div>
                        <p
                            style={{
                                fontSize: "1em",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            Added Family Details
                        </p>
                    </div>
                )}
                <div className="col-12 col-md-10">
                    <div className="inner-box">
                        {familyData && familyData.map(fam => (
                            <div key={fam.user_name} className="inner-container mt-4">
                                <h4>
                                    {fam.user_name}
                                </h4>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="display-style">
                                            <span>Relationship: {" "}
                                            </span>
                                            <p
                                                className="invest-show ">
                                                {fam.relation}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="display-style d-flex">
                                            <span>Dependency Status:{" "}</span>
                                            <p
                                                className="invest-show ">
                                                {fam.is_dependent == true ? "Dependent" : "Earning"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="display-style">
                                            <span>Age: </span>
                                            <p className="invest-show">
                                                {(() => {
                                                    if (!fam.dob) return 'N/A';
                                                    const dobParts = fam.dob.split('/');
                                                    const birthDate = new Date(`${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`);
                                                    const ageDifMs = Date.now() - birthDate.getTime();
                                                    const ageDate = new Date(ageDifMs);
                                                    return Math.abs(ageDate.getUTCFullYear() - 1970);
                                                })()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="opt-options">
                                            <span>
                                                <BsPencilFill
                                                    onClick={() => {
                                                        editFamily(fam.user_id);
                                                        setSelectedOption(fam.relation)
                                                        setUpdateForm(true);
                                                        setAddForm(false);
                                                    }}
                                                />
                                            </span>
                                            {fam.is_bse_registered != 1 && (
                                                <span
                                                    onClick={() => {
                                                        handleShow();
                                                        setDeleteId(fam.user_id)
                                                        setFamilyDeleteName(
                                                            fam?.user_name
                                                        );
                                                    }}
                                                    className="opt-options-2"
                                                >
                                                    <MdDelete />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-12 col-md-10">
                    <div className="accordion mt-4">
                        <div className="accordion-panel active">
                            <div className="accordion-header d-flex justify-content-between">
                                <h3 className="accordion-heading" style={{ paddingTop: '15px' }}>
                                    <img
                                        className="accordian-img"
                                        src={imagePath + "/static/media/DG/about-you/family-details.svg"}
                                        alt="Family details"
                                    />
                                    Family Details
                                </h3>
                                <div
                                    onClick={() => setShowView(!showview)}
                                    className={`${DGstyles.HideSHowicon}  hideShowIconCustom`}
                                >
                                    {showview == true ? <>-</> : <>+</>}
                                </div>
                            </div>
                            {showview && (
                                <div className="accordion-content family">
                                    <div className="row py-2">
                                        <span>
                                            <label className="">
                                                Family Details : ({selectedOption})
                                            </label>
                                        </span>
                                        <div className="col-12 col-md-10">
                                            <ul className="card-list">
                                                {options1.map((v, i) => (
                                                    <React.Fragment key={i}>
                                                        <li
                                                            onClick={() => {
                                                                setSelectedOption(v.title);
                                                                setFamilyId(v.id);
                                                                setFamilyDetails({
                                                                    ...defaultFamilyDetails,
                                                                    relation_id: v.id,
                                                                    relation: v.title,
                                                                    parent_user_id: getParentUserId(),
                                                                });
                                                                setAddForm(true);
                                                                setUpdateForm(false);
                                                                setAge(0);

                                                                if (v.id == "RELM-7") {
                                                                    getSelfDetails();
                                                                }
                                                            }}
                                                            className={`li-options ${v.title === "Spouse" ? (isSpouse ? "DisableField" : "EnableField") :
                                                                v.title === "Father" ? (isFather ? "DisableField" : "EnableField") :
                                                                    v.title === "Mother" ? (isMother ? "DisableField" : "EnableField") : ""
                                                                } ${selectedOption == v.title
                                                                    ? "active"
                                                                    : ""
                                                                }`}
                                                        >

                                                            {/* <input type="radio" value="5" id="type-5" name="type" data-show=".recurring-group" // ref="Father" ng-model="family.relation_id" className="" > */}
                                                            <label htmlFor="type-2">
                                                                <img alt={v.title} src={v.image} />
                                                                {v.title}
                                                            </label>
                                                        </li>
                                                    </React.Fragment>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    {(selectedOption == "Spouse") && (
                                        <div ref={cntRef} >
                                            <form noValidate="novalidate" name="goldassetform">
                                                <FintooLoader isLoading={isLoading} />
                                                <div className="row">
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.first_name ? "inputData" : null}`}>
                                                            <input type="text" name="s_f_name" value={familyDetails.first_name}
                                                                maxLength={20}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        first_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })
                                                                }} required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">First Name*</label>
                                                        </div>

                                                        <div>{simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })}</div>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.last_name ? "inputData" : null}`}>
                                                            <input type="text" name="s_l_name" value={familyDetails.last_name}
                                                                maxLength={20}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        last_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })
                                                                }}
                                                                required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Last Name*</label>
                                                        </div>

                                                        <>{simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })}</>
                                                    </div>
                                                </div>
                                                <div className="row py-2 mt-2">
                                                    <div className="col-12 col-md-10">
                                                        <div className="dark-label">
                                                            <Form.Label>Gender*</Form.Label>
                                                            <div
                                                                className="d-flex pt-4"
                                                                style={{ clear: "both" }}
                                                            >
                                                                <FintooRadio2
                                                                    checked={familyDetails.gender == "Male"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            gender: "Male",
                                                                        })
                                                                    }}
                                                                    title="Male"
                                                                />
                                                                <FintooRadio2
                                                                    checked={familyDetails.gender == "Female"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            gender: "Female",
                                                                        })
                                                                    }}
                                                                    title="Female"
                                                                />
                                                                <FintooRadio2
                                                                    checked={familyDetails.gender == "Other"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            gender: "Other",
                                                                        })
                                                                    }}
                                                                    title="Other"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row py-2 mt-2">
                                                    <div className="col-md-5 col-12">
                                                        <div className="material mt-3">
                                                            {familyDetails.isdependent === "1" ? (
                                                                <Form.Label>Occupation</Form.Label>
                                                            ) : (
                                                                <Form.Label>Occupation*</Form.Label>
                                                            )}
                                                            {occupationList && (
                                                                <Select
                                                                    classNamePrefix="sortSelect"
                                                                    isSearchable={false}
                                                                    styles={customStyles}
                                                                    options={occupationList}
                                                                    value={familyDetails.occupation !== "" ? occupationList.find((option) => option.value === familyDetails.occupation) : null}
                                                                    onChange={(e) => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            occupation: e.value,
                                                                        });
                                                                    }}
                                                                />
                                                            )}
                                                            <>
                                                                {simpleValidator.current.message('Occupation', (familyDetails.isdependent === "1" ? "1" : "") + familyDetails.occupation, 'required', { messages: { min: 'Please select the occupation' } })}
                                                            </>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12">
                                                        <div className="dark-label mt-2">
                                                            <Form.Label>Dependency Status*</Form.Label>
                                                            <div className="d-flex pt-4" style={{ clear: "both" }}>
                                                                <FintooRadio2
                                                                    style={{
                                                                        paddingLeft: "0rem !important",
                                                                    }}
                                                                    checked={familyDetails.isdependent == "1"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "1",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Dependent"
                                                                />
                                                                <FintooRadio2
                                                                    checked={familyDetails.isdependent == "0"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "0",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Earning"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row d-flex align-items-center">
                                                    <div className="col-md-5 col-12 pt-1">
                                                        <div className="dark-label ">
                                                            <Form.Label>DOB*</Form.Label>
                                                            <div
                                                                className="dt-conbx"
                                                                style={{
                                                                    borderBottom: "1px solid #dadada",
                                                                    paddingTop: "6px",
                                                                }}
                                                            >
                                                                <ReactDatePicker
                                                                    select_date={moment(
                                                                        familyDetails.dob,
                                                                        "DD/MM/YYYY"
                                                                    ).toDate()}
                                                                    setDate={(date) => {
                                                                        setDate(date);
                                                                    }}
                                                                    maxDate={moment().subtract(18, "years")}
                                                                    minDate={moment().subtract(70, "years")}
                                                                    className="pt-4"
                                                                />
                                                            </div>
                                                            <div>{simpleValidator.current.message('DOB', familyDetails.dob, 'required', { messages: { required: 'Please select date of birth' } })}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group inputData`} style={{ paddingTop: "17px" }}>
                                                            <span>
                                                                <input type="Number" name="age" value={age}
                                                                    readOnly required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Age</label>
                                                            </span>
                                                            <span>
                                                                <span className="info-hover-box" style={{ top: '25px' }}>
                                                                    <span className="icon">
                                                                        <img
                                                                            alt="More information"
                                                                            src={imagePath + '/static/media/more_information.svg'}
                                                                        />
                                                                    </span>
                                                                    <span className="msg">
                                                                        Auto Calculated by DOB
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                                {familyDetails.isdependent === "0" && ( // Show the fields when isdependent is "earning"
                                                    <div className="row ">
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.retirement_age ? "inputData" : null}`}>
                                                                <input type="text" name="retirement_age" value={familyDetails.retirement_age}
                                                                    min="0"
                                                                    max="999"
                                                                    onChange={(e) => {
                                                                        checkRetirementAge(e.target.value.slice(0, 2))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            retirement_age: e.target.value.slice(0, 2), // Restrict input to 2 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Retirement Age")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Retirement Age*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.retAgeError}</div>
                                                        </div>
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.life_expectancy ? "inputData" : null}`}>
                                                                <input name="retirement_age" type="number"
                                                                    min="0"
                                                                    max="999"
                                                                    value={familyDetails.life_expectancy}
                                                                    onChange={(e) => {
                                                                        checkLifeExpectancyAge(e.target.value.slice(0, 3))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            life_expectancy: e.target.value.slice(0, 3), // Restrict input to 3 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Life Expectancy")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Life Expectancy*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.lifeExpError}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="row">
                                                    <div className="col-md-10 col-12 custom-input">
                                                        <div className={`form-group mt-2 ${familyDetails.remark ? "inputData" : ""}`}>
                                                            <input type="text" name="S_Remarks" value={familyDetails.remark}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        remark: e.target.value,
                                                                    })
                                                                }} autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Remarks</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row py-2">
                                                    <div className=" text-center">
                                                        <div>
                                                            <div className="btn-container">
                                                                <div className="d-flex justify-content-center">
                                                                    <FintooLoader isLoading={isLoading} />
                                                                    <div
                                                                        className="previous-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => {
                                                                            ScrollToTop();
                                                                            setTab("tab3")
                                                                        }
                                                                        }
                                                                    >
                                                                        <FaArrowLeft />
                                                                        <span className="hover-text">
                                                                            &nbsp;Previous
                                                                        </span>
                                                                    </div>

                                                                    {addForm && (
                                                                        <button
                                                                            className="default-btn gradient-btn save-btn"
                                                                            onClick={(e) => {
                                                                                addFamilySubmit(e)
                                                                            }}>
                                                                            Save & Add More
                                                                        </button>
                                                                    )}
                                                                    {updateForm && (
                                                                        <div>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    cancelFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    updateFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Update
                                                                            </button>
                                                                        </div>
                                                                    )}


                                                                    {/* <div className="next-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => {
                                                                            ScrollToTop();
                                                                            setTab("tab5")
                                                                        }
                                                                        }
                                                                    >
                                                                        <span
                                                                            className="hover-text"
                                                                            style={{ maxWidth: 100 }}
                                                                        >
                                                                            Continue&nbsp;
                                                                        </span>
                                                                        <FaArrowRight />
                                                                    </div> */}
                                                                    <Link
                                                                        to={
                                                                            process.env.PUBLIC_URL +
                                                                            "/datagathering/income-expenses"
                                                                        }
                                                                    >
                                                                        <div className="next-btn form-arrow d-flex align-items-center">
                                                                            <span
                                                                                className="hover-text"
                                                                                style={{ maxWidth: 100 }}
                                                                            >
                                                                                Continue&nbsp;
                                                                            </span>
                                                                            <FaArrowRight />
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                    {(selectedOption == "Son") && (
                                        <div ref={cntRef} >
                                            <form noValidate="novalidate" name="goldassetform">
                                                <FintooLoader isLoading={isLoading} />
                                                <div className="row">
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.first_name ? "inputData" : null}`}>
                                                            <input type="text" name="son_name" value={familyDetails.first_name}
                                                                maxLength={20}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        first_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })
                                                                }} required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">First Name*</label>
                                                        </div>
                                                        <>{simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })}</>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.last_name ? "inputData" : null}`}>
                                                            <input type="text" name="son_last_name"
                                                                maxLength={20}
                                                                value={familyDetails.last_name}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        last_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })
                                                                }} required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Last Name*</label>
                                                        </div>
                                                        <>{simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })}</>
                                                    </div>
                                                </div>
                                                <div className="row py-2 mt-2">
                                                    <div className="col-md-5 col-12">
                                                        <div className="material mt-3">
                                                            {familyDetails.isdependent === "1" ? (
                                                                <Form.Label>Occupation</Form.Label>
                                                            ) : (
                                                                <Form.Label>Occupation*</Form.Label>
                                                            )}
                                                            {occupationList && (
                                                                <Select
                                                                    classNamePrefix="sortSelect"
                                                                    isSearchable={false}
                                                                    styles={customStyles}
                                                                    options={occupationList}
                                                                    value={familyDetails.occupation !== "" ? occupationList.find((option) => option.value === familyDetails.occupation) : null}
                                                                    onChange={(e) => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            occupation: e.value,
                                                                        });
                                                                    }}
                                                                />
                                                            )}
                                                            <>
                                                                {simpleValidator.current.message('Occupation', (familyDetails.isdependent === "1" ? "1" : "") + familyDetails.occupation, 'required', { messages: { min: 'Please select the occupation' } })}
                                                            </>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12">
                                                        <div className="dark-label mt-2">
                                                            <Form.Label>Dependency Status*</Form.Label>
                                                            <div className="d-flex pt-4" style={{ clear: "both" }}>
                                                                <FintooRadio2
                                                                    style={{
                                                                        paddingLeft: "0rem !important",
                                                                    }}
                                                                    checked={familyDetails.isdependent == "1"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "1",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Dependent"
                                                                />
                                                                <FintooRadio2
                                                                    checked={familyDetails.isdependent == "0"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "0",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Earning"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row py-2 d-flex align-items-center">
                                                    <div className="col-md-5 col-12 pt-1">
                                                        <div className="dark-label">
                                                            <Form.Label>DOB*</Form.Label>
                                                            <div
                                                                className="dt-conbx"
                                                                style={{
                                                                    borderBottom: "1px solid #dadada",
                                                                    paddingTop: "6px",
                                                                }}
                                                            >
                                                                <ReactDatePicker
                                                                    select_date={moment(
                                                                        familyDetails.dob,
                                                                        "DD/MM/YYYY"
                                                                    ).toDate()}
                                                                    setDate={(date) => {
                                                                        setDate(date);
                                                                    }}
                                                                    maxDate={moment()}
                                                                    minDate={moment().subtract(70, "years")}
                                                                    className="pt-4"
                                                                />
                                                            </div>
                                                            <div>{simpleValidator.current.message('DOB', familyDetails.dob, 'required', { messages: { required: 'Please select date of birth' } })}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group  inputData`} style={{ paddingTop: "17px" }}>
                                                            <span>
                                                                <input type="Number" name="son_age" value={age}
                                                                    readOnly required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Age</label>
                                                            </span>
                                                            <span>
                                                                <span className="info-hover-box" style={{ top: '25px' }}>
                                                                    <span className="icon">
                                                                        <img
                                                                            alt="More information"
                                                                            src={imagePath + '/static/media/more_information.svg'}
                                                                        />
                                                                    </span>
                                                                    <span className="msg">
                                                                        Auto Calculated by DOB
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {familyDetails.isdependent === "0" && ( // Show the fields when isdependent is "earning"
                                                    <div className="row py-2">
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.retirement_age ? "inputData" : null}`}>
                                                                <input type="text" name="retirement_age" value={familyDetails.retirement_age}
                                                                    min="0"
                                                                    max="999"
                                                                    onChange={(e) => {
                                                                        checkRetirementAge(e.target.value.slice(0, 2))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            retirement_age: e.target.value.slice(0, 2), // Restrict input to 2 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Retirement Age")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Retirement Age*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.retAgeError}</div>
                                                        </div>
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.life_expectancy ? "inputData" : null}`}>
                                                                <input name="retirement_age" type="number"
                                                                    min="0"
                                                                    max="999"
                                                                    value={familyDetails.life_expectancy}
                                                                    onChange={(e) => {
                                                                        checkLifeExpectancyAge(e.target.value.slice(0, 3))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            life_expectancy: e.target.value.slice(0, 3), // Restrict input to 3 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Life Expectancy")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Life Expectancy*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.lifeExpError}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="row">
                                                    <div className="col-12 col-md-10 custom-input">
                                                        <div className={`form-group mt-2 ${familyDetails.remark ? "inputData" : ""}`}>
                                                            <input type="text" name="son_remarks" value={familyDetails.remark}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        remark: e.target.value,
                                                                    })
                                                                }} required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Remarks</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className=" text-center">
                                                        <div>
                                                            <div className="btn-container">
                                                                <div className="d-flex justify-content-center">
                                                                    <div
                                                                        className="previous-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => setTab("tab3")}
                                                                    >
                                                                        <FaArrowLeft />
                                                                        <span className="hover-text">
                                                                            &nbsp;Previous
                                                                        </span>
                                                                    </div>

                                                                    {addForm && (
                                                                        <button
                                                                            className="default-btn gradient-btn save-btn"
                                                                            onClick={(e) => { addFamilySubmit(e) }}>
                                                                            Save & Add More
                                                                        </button>
                                                                    )}
                                                                    {updateForm && (
                                                                        <div>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    cancelFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    updateFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Update
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                                    {/* <div className="next-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => setTab("tab5")}>
                                                                        <span
                                                                            className="hover-text"
                                                                            style={{ maxWidth: 100 }}
                                                                        >
                                                                            Continue&nbsp;
                                                                        </span>
                                                                        <FaArrowRight />
                                                                    </div> */}
                                                                    <div className="next-btn form-arrow d-flex align-items-center">
                                                                        <Link
                                                                            style={{
                                                                                color: "#042b62"
                                                                            }}
                                                                            className="d-flex align-items-center"
                                                                            to={
                                                                                process.env.PUBLIC_URL +
                                                                                "/datagathering/income-expenses"
                                                                            }
                                                                        >
                                                                            <span
                                                                                className="hover-text"
                                                                                style={{ maxWidth: 100 }}
                                                                            >
                                                                                Continue&nbsp;
                                                                            </span>
                                                                            <FaArrowRight />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                    {(selectedOption == "Daughter") && (
                                        <div ref={cntRef} >
                                            <form noValidate="novalidate" name="goldassetform">
                                                <FintooLoader isLoading={isLoading} />
                                                <div className="row">
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.first_name ? "inputData" : null}`}>
                                                            <input type="text" name="Daughter_f_name" value={familyDetails.first_name}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        first_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })
                                                                }}
                                                                required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">First Name*</label>
                                                        </div>
                                                        <>{simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })}</>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.first_name ? "inputData" : null}`}>
                                                            <input type="text" name="Daughter_last_name" value={familyDetails.last_name}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        last_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })
                                                                }}
                                                                required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Last Name*</label>
                                                        </div>
                                                        <>{simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })}</>
                                                    </div>
                                                </div>
                                                <div className="row py-2 mt-2">
                                                    <div className="col-md-5 col-12">
                                                        <div className="material mt-3">
                                                            {familyDetails.isdependent === "1" ? (
                                                                <Form.Label>Occupation</Form.Label>
                                                            ) : (
                                                                <Form.Label>Occupation*</Form.Label>
                                                            )}
                                                            {occupationList && (
                                                                <Select
                                                                    classNamePrefix="sortSelect"
                                                                    isSearchable={false}
                                                                    styles={customStyles}
                                                                    options={occupationList}
                                                                    value={familyDetails.occupation !== "" ? occupationList.find((option) => option.value === familyDetails.occupation) : null}
                                                                    onChange={(e) => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            occupation: e.value,
                                                                        });
                                                                    }}
                                                                />
                                                            )}
                                                            <>
                                                                {simpleValidator.current.message('Occupation', (familyDetails.isdependent === "1" ? "1" : "") + familyDetails.occupation, 'required', { messages: { min: 'Please select the occupation' } })}
                                                            </>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12">
                                                        <div className="dark-label mt-2">
                                                            <Form.Label>Dependency Status*</Form.Label>
                                                            <div className="d-flex pt-4" style={{ clear: "both" }}>
                                                                <FintooRadio2
                                                                    style={{
                                                                        paddingLeft: "0rem !important",
                                                                    }}
                                                                    checked={familyDetails.isdependent == "1"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "1",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Dependent"
                                                                />
                                                                <FintooRadio2
                                                                    checked={familyDetails.isdependent == "0"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "0",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Earning"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row py-2 d-flex align-items-center">
                                                    <div className="col-md-5 col-12 pt-1">
                                                        <div className="dark-label ">
                                                            <Form.Label>DOB*</Form.Label>
                                                            <div
                                                                className="dt-conbx"
                                                                style={{
                                                                    borderBottom: "1px solid #dadada",
                                                                    paddingTop: "6px",
                                                                }}
                                                            >
                                                                <ReactDatePicker
                                                                    select_date={moment(
                                                                        familyDetails.dob,
                                                                        "DD/MM/YYYY"
                                                                    ).toDate()}
                                                                    setDate={(date) => {
                                                                        setDate(date);
                                                                    }}
                                                                    maxDate={moment()}
                                                                    minDate={moment().subtract(70, "years")}
                                                                    className="pt-4"
                                                                />
                                                            </div>
                                                            <div>{simpleValidator.current.message('DOB', familyDetails.dob, 'required', { messages: { required: 'Please select date of birth' } })}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input ">
                                                        <div className={`form-group inputData`} style={{ paddingTop: "17px" }}>
                                                            <span>
                                                                <input type="Number" name="Daughter_age" value={age}
                                                                    readOnly required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Age</label>
                                                            </span>
                                                            <span>
                                                                <span className="info-hover-box" style={{ top: '25px' }}>
                                                                    <span className="icon">
                                                                        <img
                                                                            alt="More information"
                                                                            src={imagePath + '/static/media/more_information.svg'}
                                                                        />
                                                                    </span>
                                                                    <span className="msg">
                                                                        Auto Calculated by DOB
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {familyDetails.isdependent === "0" && ( // Show the fields when isdependent is "earning"
                                                    <div className="row py-2">
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.retirement_age ? "inputData" : null}`}>
                                                                <input type="text" name="retirement_age" value={familyDetails.retirement_age}
                                                                    min="0"
                                                                    max="999"
                                                                    onChange={(e) => {
                                                                        checkRetirementAge(e.target.value.slice(0, 2))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            retirement_age: e.target.value.slice(0, 2), // Restrict input to 2 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Retirement Age")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Retirement Age*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.retAgeError}</div>
                                                        </div>
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.life_expectancy ? "inputData" : null}`}>
                                                                <input name="retirement_age" type="number"
                                                                    min="0"
                                                                    max="999"
                                                                    value={familyDetails.life_expectancy}
                                                                    onChange={(e) => {
                                                                        checkLifeExpectancyAge(e.target.value.slice(0, 3))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            life_expectancy: e.target.value.slice(0, 3), // Restrict input to 3 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Life Expectancy")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Life Expectancy*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.lifeExpError}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="row">
                                                    <div className="col-md-10 col-12 custom-input">
                                                        <div className={`form-group ${familyDetails.remark ? "inputData" : ""}`}>
                                                            <input type="text" name="Daughter_remarks" value={familyDetails.remark}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        remark: e.target.value,
                                                                    })
                                                                }} required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Remarks</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row py-2">
                                                    <div className=" text-center">
                                                        <div>
                                                            <div className="btn-container">
                                                                <div className="d-flex justify-content-center">
                                                                    <div
                                                                        className="previous-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => setTab("tab3")}
                                                                    >
                                                                        <FaArrowLeft />
                                                                        <span className="hover-text">
                                                                            &nbsp;Previous
                                                                        </span>
                                                                    </div>

                                                                    {addForm && (
                                                                        <button
                                                                            className="default-btn gradient-btn save-btn"
                                                                            onClick={(e) => { addFamilySubmit(e) }}>
                                                                            Save & Add More
                                                                        </button>
                                                                    )}
                                                                    {updateForm && (
                                                                        <div>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    cancelFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    updateFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Update
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                                    {/* <div className="next-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => setTab("tab5")}>
                                                                        <span
                                                                            className="hover-text"
                                                                            style={{ maxWidth: 100 }}
                                                                        >
                                                                            Continue&nbsp;
                                                                        </span>
                                                                        <FaArrowRight />
                                                                    </div> */}
                                                                    <Link
                                                                        to={
                                                                            process.env.PUBLIC_URL +
                                                                            "/datagathering/income-expenses"
                                                                        }
                                                                    >
                                                                        <div className="next-btn form-arrow d-flex align-items-center">
                                                                            <span
                                                                                className="hover-text"
                                                                                style={{ maxWidth: 100 }}
                                                                            >
                                                                                Continue&nbsp;
                                                                            </span>
                                                                            <FaArrowRight />
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                    {(selectedOption == "Father") && (
                                        <div ref={cntRef} >
                                            <form noValidate="novalidate" name="goldassetform">
                                                <FintooLoader isLoading={isLoading} />
                                                <div className="row ">
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.first_name ? "inputData" : null}`}>
                                                            <input type="text" name="Father_name" maxLength={20}
                                                                value={familyDetails.first_name}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        first_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })
                                                                }}
                                                                required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">First Name*</label>
                                                        </div>
                                                        <>{simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })}</>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.first_name ? "inputData" : null}`}>
                                                            <input type="text" name="Father_last_name" maxLength={20}
                                                                value={familyDetails.last_name}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        last_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })
                                                                }}
                                                                required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Last Name*</label>
                                                        </div>
                                                        <>{simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })}</>
                                                    </div>
                                                </div>
                                                <div className="row py-2 mt-2">
                                                    <div className="col-md-5 col-12">
                                                        <div className="material mt-3">
                                                            {familyDetails.isdependent === "1" ? (
                                                                <Form.Label>Occupation</Form.Label>
                                                            ) : (
                                                                <Form.Label>Occupation*</Form.Label>
                                                            )}
                                                            {occupationList && (
                                                                <Select
                                                                    classNamePrefix="sortSelect"
                                                                    isSearchable={false}
                                                                    styles={customStyles}
                                                                    options={occupationList}
                                                                    value={familyDetails.occupation !== "" ? occupationList.find((option) => option.value === familyDetails.occupation) : null}
                                                                    onChange={(e) => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            occupation: e.value,
                                                                        });
                                                                    }}
                                                                />
                                                            )}
                                                            <>
                                                                {simpleValidator.current.message('Occupation', (familyDetails.isdependent === "1" ? "1" : "") + familyDetails.occupation, 'required', { messages: { min: 'Please select the occupation' } })}
                                                            </>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12">
                                                        <div className="dark-label mt-2">
                                                            <Form.Label>Dependency Status*</Form.Label>
                                                            <div className="d-flex pt-4" style={{ clear: "both" }}>
                                                                <FintooRadio2
                                                                    style={{
                                                                        paddingLeft: "0rem !important",
                                                                    }}
                                                                    checked={familyDetails.isdependent == "1"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "1",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Dependent"
                                                                />
                                                                <FintooRadio2
                                                                    checked={familyDetails.isdependent == "0"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "0",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Earning"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row py-2 d-flex align-items-center">
                                                    <div className="col-md-5 col-12 pt-1">
                                                        <div className="dark-label">
                                                            <Form.Label>DOB*</Form.Label>
                                                            <div
                                                                className="dt-conbx"
                                                                style={{
                                                                    borderBottom: "1px solid #dadada",
                                                                    paddingTop: "6px",
                                                                }}
                                                            >
                                                                <ReactDatePicker
                                                                    select_date={moment(
                                                                        familyDetails.dob,
                                                                        "DD/MM/YYYY"
                                                                    ).toDate()}
                                                                    setDate={(date) => {
                                                                        setDate(date);
                                                                    }}
                                                                    maxDate={moment().subtract(36, "years")}
                                                                    minDate={moment().subtract(100, "years")}
                                                                    className="pt-4"
                                                                />
                                                            </div>
                                                            <div>{simpleValidator.current.message('DOB', familyDetails.dob, 'required', { messages: { required: 'Please select date of birth' } })}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group  inputData`} style={{ paddingTop: "17px" }}>
                                                            <span>
                                                                <input type="Number" name="Father_age" value={age}
                                                                    readOnly required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Age</label>
                                                            </span>
                                                            <span>
                                                                <span className="info-hover-box" style={{ top: '25px' }}>
                                                                    <span className="icon">
                                                                        <img
                                                                            alt="More information"
                                                                            src={imagePath + '/static/media/more_information.svg'}
                                                                        />
                                                                    </span>
                                                                    <span className="msg">
                                                                        Auto Calculated by DOB
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {familyDetails.isdependent === "0" && ( // Show the fields when isdependent is "earning"
                                                    <div className="row py-2">
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.retirement_age ? "inputData" : null}`}>
                                                                <input type="text" name="retirement_age" value={familyDetails.retirement_age}
                                                                    min="0"
                                                                    max="999"
                                                                    onChange={(e) => {
                                                                        checkRetirementAge(e.target.value.slice(0, 2))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            retirement_age: e.target.value.slice(0, 2), // Restrict input to 2 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Retirement Age")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Retirement Age*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.retAgeError}</div>
                                                        </div>
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.life_expectancy ? "inputData" : null}`}>
                                                                <input name="retirement_age" type="number"
                                                                    min="0"
                                                                    max="999"
                                                                    value={familyDetails.life_expectancy}
                                                                    onChange={(e) => {
                                                                        checkLifeExpectancyAge(e.target.value.slice(0, 3))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            life_expectancy: e.target.value.slice(0, 3), // Restrict input to 3 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Life Expectancy")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Life Expectancy*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.lifeExpError}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="row">
                                                    <div className="col-md-10 col-12 custom-input">
                                                        <div className={`form-group mt-2 ${familyDetails.remark ? "inputData" : ""}`}>
                                                            <input type="text" name="name" value={familyDetails.remark}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        remark: e.target.value,
                                                                    })
                                                                }} required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Remarks</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row py-2">
                                                    <div className=" text-center">
                                                        <div>
                                                            <div className="btn-container">
                                                                <div className="d-flex justify-content-center">
                                                                    <div
                                                                        className="previous-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => setTab("tab3")}
                                                                    >
                                                                        <FaArrowLeft />
                                                                        <span className="hover-text">
                                                                            &nbsp;Previous
                                                                        </span>
                                                                    </div>

                                                                    {addForm && (
                                                                        <button
                                                                            className="default-btn gradient-btn save-btn"
                                                                            onClick={(e) => { addFamilySubmit(e) }}>
                                                                            Save & Add More
                                                                        </button>
                                                                    )}
                                                                    {updateForm && (
                                                                        <div>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    cancelFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    updateFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Update
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                                    {/* <div className="next-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => setTab("tab5")}>
                                                                        <span
                                                                            className="hover-text"
                                                                            style={{ maxWidth: 100 }}
                                                                        >
                                                                            Continue&nbsp;
                                                                        </span>
                                                                        <FaArrowRight />
                                                                    </div> */}
                                                                    <Link
                                                                        to={
                                                                            process.env.PUBLIC_URL +
                                                                            "/datagathering/income-expenses"
                                                                        }
                                                                    >
                                                                        <div className="next-btn form-arrow d-flex align-items-center">
                                                                            <span
                                                                                className="hover-text"
                                                                                style={{ maxWidth: 100 }}
                                                                            >
                                                                                Continue&nbsp;
                                                                            </span>
                                                                            <FaArrowRight />
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                    {(selectedOption == "Mother") && (
                                        <div ref={cntRef} >
                                            <form noValidate="novalidate" name="goldassetform">
                                                <FintooLoader isLoading={isLoading} />
                                                <div className="row ">
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.first_name ? "inputData" : null}`}>
                                                            <input type="text" name="Mother_name" maxLength={20}
                                                                value={familyDetails.first_name}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        first_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })
                                                                }}
                                                                required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">First Name*</label>
                                                        </div>
                                                        <>{simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })}</>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.first_name ? "inputData" : null}`}>
                                                            <input type="text" name="Mother_last_name" maxLength={20}
                                                                value={familyDetails.last_name}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        last_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })
                                                                }}
                                                                required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Last Name*</label>
                                                        </div>
                                                        <>{simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })}</>
                                                    </div>
                                                </div>
                                                <div className="row py-2 mt-2">
                                                    <div className="col-md-5 col-12">
                                                        <div className="material mt-3">
                                                            {familyDetails.isdependent === "1" ? (
                                                                <Form.Label>Occupation</Form.Label>
                                                            ) : (
                                                                <Form.Label>Occupation*</Form.Label>
                                                            )}
                                                            {occupationList && (
                                                                <Select
                                                                    classNamePrefix="sortSelect"
                                                                    isSearchable={false}
                                                                    styles={customStyles}
                                                                    options={occupationList}
                                                                    value={familyDetails.occupation !== "" ? occupationList.find((option) => option.value === familyDetails.occupation) : null}
                                                                    onChange={(e) => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            occupation: e.value,
                                                                        });
                                                                    }}
                                                                />
                                                            )}
                                                            <>
                                                                {simpleValidator.current.message('Occupation', (familyDetails.isdependent === "1" ? "1" : "") + familyDetails.occupation, 'required', { messages: { min: 'Please select the occupation' } })}
                                                            </>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12">
                                                        <div className="dark-label mt-2">
                                                            <Form.Label>Dependency Status*</Form.Label>
                                                            <div className="d-flex pt-4" style={{ clear: "both" }}>
                                                                <FintooRadio2
                                                                    style={{
                                                                        paddingLeft: "0rem !important",
                                                                    }}
                                                                    checked={familyDetails.isdependent == "1"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "1",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Dependent"
                                                                />
                                                                <FintooRadio2
                                                                    checked={familyDetails.isdependent == "0"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "0",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Earning"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row py-2 d-flex align-items-center">
                                                    <div className="col-md-5 col-12 pt-1">
                                                        <div className="dark-label">
                                                            <Form.Label>DOB*</Form.Label>
                                                            <div
                                                                className="dt-conbx"
                                                                style={{
                                                                    borderBottom: "1px solid #dadada",
                                                                    paddingTop: "6px",
                                                                }}
                                                            >
                                                                <ReactDatePicker
                                                                    select_date={moment(
                                                                        familyDetails.dob,
                                                                        "DD/MM/YYYY"
                                                                    ).toDate()}
                                                                    setDate={(date) => {
                                                                        setDate(date);
                                                                    }}
                                                                    maxDate={moment().subtract(36, "years")}
                                                                    minDate={moment().subtract(100, "years")}
                                                                    className="pt-4"
                                                                />
                                                            </div>
                                                            <div>{simpleValidator.current.message('DOB', familyDetails.dob, 'required', { messages: { required: 'Please select date of birth' } })}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group inputData`} style={{ paddingTop: "17px" }}>
                                                            <span>
                                                                <input type="Number" name="Mother_age" value={age}
                                                                    readOnly required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Age</label>
                                                            </span>
                                                            <span>
                                                                <span className="info-hover-box" style={{ top: '25px' }}>
                                                                    <span className="icon">
                                                                        <img
                                                                            alt="More information"
                                                                            src={imagePath + '/static/media/more_information.svg'}
                                                                        />
                                                                    </span>
                                                                    <span className="msg">
                                                                        Auto Calculated by DOB
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                                {familyDetails.isdependent === "0" && ( // Show the fields when isdependent is "earning"
                                                    <div className="row py-2">
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.retirement_age ? "inputData" : null}`}>
                                                                <input type="text" name="retirement_age" value={familyDetails.retirement_age}
                                                                    min="0"
                                                                    max="999"
                                                                    onChange={(e) => {
                                                                        checkRetirementAge(e.target.value.slice(0, 2))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            retirement_age: e.target.value.slice(0, 2), // Restrict input to 2 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Retirement Age")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Retirement Age*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.retAgeError}</div>
                                                        </div>
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.life_expectancy ? "inputData" : null}`}>
                                                                <input name="retirement_age" type="number"
                                                                    min="0"
                                                                    max="999"
                                                                    value={familyDetails.life_expectancy}
                                                                    onChange={(e) => {
                                                                        checkLifeExpectancyAge(e.target.value.slice(0, 3))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            life_expectancy: e.target.value.slice(0, 3), // Restrict input to 3 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Life Expectancy")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Life Expectancy*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.lifeExpError}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="row">
                                                    <div className="col-md-10 col-12 custom-input">
                                                        <div className={`form-group mt-2 ${familyDetails.remark ? "inputData" : ""}`}>
                                                            <input type="text" name="Mother_remarks" value={familyDetails.remark}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        remark: e.target.value,
                                                                    })
                                                                }} required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Remarks</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row py-2">
                                                    <div className=" text-center">
                                                        <div>
                                                            <div className="btn-container">
                                                                <div className="d-flex justify-content-center">
                                                                    <div
                                                                        className="previous-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => setTab("tab3")}
                                                                    >
                                                                        <FaArrowLeft />
                                                                        <span className="hover-text">
                                                                            &nbsp;Previous
                                                                        </span>
                                                                    </div>

                                                                    {addForm && (
                                                                        <button
                                                                            className="default-btn gradient-btn save-btn"
                                                                            onClick={(e) => { addFamilySubmit(e) }}>
                                                                            Save & Add More
                                                                        </button>
                                                                    )}
                                                                    {updateForm && (
                                                                        <div>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    cancelFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    updateFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Update
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                                    {/* <div className="next-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => setTab("tab5")}>
                                                                        <span
                                                                            className="hover-text"
                                                                            style={{ maxWidth: 100 }}
                                                                        >
                                                                            Continue&nbsp;
                                                                        </span>
                                                                        <FaArrowRight />
                                                                    </div> */}
                                                                    <Link
                                                                        to={
                                                                            process.env.PUBLIC_URL +
                                                                            "/datagathering/income-expenses"
                                                                        }
                                                                    >
                                                                        <div className="next-btn form-arrow d-flex align-items-center">
                                                                            <span
                                                                                className="hover-text"
                                                                                style={{ maxWidth: 100 }}
                                                                            >
                                                                                Continue&nbsp;
                                                                            </span>
                                                                            <FaArrowRight />
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                    {(selectedOption == "Hindu Undivided Family") && (
                                        <div ref={cntRef} >
                                            <form noValidate="novalidate" name="goldassetform">
                                                <FintooLoader isLoading={isLoading} />
                                                <div className="row ">
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.first_name ? "inputData" : null}`}>
                                                            <input type="text" name="HUF_name" maxLength={20}
                                                                value={familyDetails.first_name}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        first_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })
                                                                }}
                                                                required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">First Name*</label>
                                                        </div>
                                                        <>{simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })}</>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.first_name ? "inputData" : null}`}>
                                                            <input type="text" name="HUF_last_name" maxLength={20}
                                                                value={familyDetails.last_name}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        last_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })
                                                                }}
                                                                required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Last Name*</label>
                                                        </div>
                                                        <>{simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })}</>
                                                    </div>
                                                </div>
                                                <div className="row py-2 mt-2">
                                                    <div className="col-md-5 col-12">
                                                        <div className="material mt-3">
                                                            {familyDetails.isdependent === "1" ? (
                                                                <Form.Label>Occupation</Form.Label>
                                                            ) : (
                                                                <Form.Label>Occupation*</Form.Label>
                                                            )}
                                                            {occupationList && (
                                                                <Select
                                                                    classNamePrefix="sortSelect"
                                                                    isSearchable={false}
                                                                    styles={customStyles}
                                                                    options={occupationList}
                                                                    value={familyDetails.occupation !== "" ? occupationList.find((option) => option.value === familyDetails.occupation) : null}
                                                                    onChange={(e) => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            occupation: e.value,
                                                                        });
                                                                    }}
                                                                />
                                                            )}
                                                            <>
                                                                {simpleValidator.current.message('Occupation', (familyDetails.isdependent === "1" ? "1" : "") + familyDetails.occupation, 'required', { messages: { min: 'Please select the occupation' } })}
                                                            </>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12">
                                                        <div className="dark-label mt-2">
                                                            <Form.Label>Dependency Status*</Form.Label>
                                                            <div className="d-flex pt-4" style={{ clear: "both" }}>
                                                                <FintooRadio2
                                                                    style={{
                                                                        paddingLeft: "0rem !important",
                                                                    }}
                                                                    checked={familyDetails.isdependent == "1"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "1",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Dependent"
                                                                />
                                                                <FintooRadio2
                                                                    checked={familyDetails.isdependent == "0"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "0",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Earning"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row py-2 d-flex align-items-center">
                                                    <div className="col-md-5 col-12 pt-1">
                                                        <div className="dark-label">
                                                            <Form.Label>Date of Incorporation*</Form.Label>
                                                            <div
                                                                className="dt-conbx"
                                                                style={{
                                                                    borderBottom: "1px solid #dadada",
                                                                    paddingTop: "6px",
                                                                }}
                                                            >
                                                                <ReactDatePicker
                                                                    select_date={moment(
                                                                        familyDetails.dob,
                                                                        "DD/MM/YYYY"
                                                                    ).toDate()}
                                                                    setDate={(date) => {
                                                                        setDate(date);
                                                                    }}
                                                                    maxDate={moment().subtract(18, "years")}
                                                                    minDate={moment().subtract(familyDetails.retirement_age, "years").add(1, 'days')}
                                                                    className="pt-4"
                                                                />
                                                            </div>
                                                            <div>{simpleValidator.current.message('DOB', familyDetails.dob, 'required', { messages: { required: 'Please select date of birth' } })}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group inputData`} style={{ paddingTop: "17px" }}>
                                                            <span>
                                                                <input type="Number" name="HUF_age" value={age}
                                                                    readOnly required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Age</label>
                                                            </span>
                                                            <span>
                                                                <span className="info-hover-box" style={{ top: '25px' }}>
                                                                    <span className="icon">
                                                                        <img
                                                                            alt="More information"
                                                                            src={imagePath + '/static/media/more_information.svg'}
                                                                        />
                                                                    </span>
                                                                    <span className="msg">
                                                                        Auto Calculated by Date of Incorporation
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                                {familyDetails.isdependent === "0" && ( // Show the fields when isdependent is "earning"
                                                    <div className="row py-2">
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.retirement_age ? "inputData" : null}`}>
                                                                <input type="text" name="retirement_age" value={familyDetails.retirement_age}
                                                                    min="0"
                                                                    max="999"
                                                                    onChange={(e) => {
                                                                        checkRetirementAge(e.target.value.slice(0, 2))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            retirement_age: e.target.value.slice(0, 2), // Restrict input to 2 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Retirement Age")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Retirement Age*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.retAgeError}</div>
                                                        </div>
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.life_expectancy ? "inputData" : null}`}>
                                                                <input name="retirement_age" type="number"
                                                                    min="0"
                                                                    max="999"
                                                                    value={familyDetails.life_expectancy}
                                                                    onChange={(e) => {
                                                                        checkLifeExpectancyAge(e.target.value.slice(0, 3))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            life_expectancy: e.target.value.slice(0, 3), // Restrict input to 3 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Life Expectancy")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Life Expectancy*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.lifeExpError}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="row">
                                                    <div className="col-md-10 col-12 custom-input">
                                                        <div className={`form-group mt-2 ${familyDetails.remark ? "inputData" : ""}`}>
                                                            <input type="text" name="HUF_remarks" value={familyDetails.remark}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        remark: e.target.value,
                                                                    })
                                                                }} required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Remarks</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row py-2">
                                                    <div className=" text-center">
                                                        <div>
                                                            <div className="btn-container">
                                                                <div className="d-flex justify-content-center">
                                                                    <div
                                                                        className="previous-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => setTab("tab3")}
                                                                    >
                                                                        <FaArrowLeft />
                                                                        <span className="hover-text">
                                                                            &nbsp;Previous
                                                                        </span>
                                                                    </div>

                                                                    {addForm && (
                                                                        <button
                                                                            className="default-btn gradient-btn save-btn"
                                                                            onClick={(e) => { addFamilySubmit(e) }}>
                                                                            Save & Add More
                                                                        </button>
                                                                    )}
                                                                    {updateForm && (
                                                                        <div>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    cancelFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    updateFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Update
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                                    {/* <div className="next-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => setTab("tab5")}>
                                                                        <span
                                                                            className="hover-text"
                                                                            style={{ maxWidth: 100 }}
                                                                        >
                                                                            Continue&nbsp;
                                                                        </span>
                                                                        <FaArrowRight />
                                                                    </div> */}
                                                                    <Link
                                                                        to={
                                                                            process.env.PUBLIC_URL +
                                                                            "/datagathering/income-expenses"
                                                                        }
                                                                    >
                                                                        <div className="next-btn form-arrow d-flex align-items-center">
                                                                            <span
                                                                                className="hover-text"
                                                                                style={{ maxWidth: 100 }}
                                                                            >
                                                                                Continue&nbsp;
                                                                            </span>
                                                                            <FaArrowRight />
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                    {(selectedOption == "Others") && (
                                        <div ref={cntRef} >
                                            <form noValidate="novalidate" name="goldassetform">
                                                <FintooLoader isLoading={isLoading} />
                                                <div className="row py-2">
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.first_name ? "inputData" : null}`}>
                                                            <input type="text" name="Others_name" maxLength={20}
                                                                value={familyDetails.first_name}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        first_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })
                                                                }}
                                                                required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">First Name*</label>
                                                        </div>
                                                        <>{simpleValidator.current.message('First Name', familyDetails.first_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter first name' } })}</>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group mt-1 ${familyDetails.first_name ? "inputData" : null}`}>
                                                            <input type="text" name="Others_last_name" maxLength={20}
                                                                value={familyDetails.last_name}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        last_name: e.target.value,
                                                                    })
                                                                }}
                                                                onBlur={(e) => {
                                                                    simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })
                                                                }}
                                                                required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Last Name*</label>
                                                        </div>
                                                        <div>{simpleValidator.current.message('Last Name', familyDetails.last_name, 'required|alpha_space', { messages: { alpha_space: 'Alphabets are allowed only.', required: 'Please enter last name' } })}</div>
                                                    </div>
                                                </div>
                                                <div className="row ">
                                                    <div className="col-12 col-md-10">
                                                        <div className="dark-label">
                                                            <Form.Label>Gender*</Form.Label>
                                                            <div
                                                                className="d-flex pt-4"
                                                                style={{ clear: "both" }}
                                                            >
                                                                <FintooRadio2
                                                                    checked={familyDetails.gender == "Male"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            gender: "Male",
                                                                        })
                                                                    }}
                                                                    title="Male"
                                                                />
                                                                <FintooRadio2
                                                                    checked={familyDetails.gender == "Female"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            gender: "Female",
                                                                        })
                                                                    }}
                                                                    title="Female"
                                                                />
                                                                <FintooRadio2
                                                                    checked={familyDetails.gender == "Other"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            gender: "Other",
                                                                        })
                                                                    }}
                                                                    title="Other"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row py-2 mt-2">
                                                    <div className="col-md-5 col-12">
                                                        <div className="material mt-3">
                                                            {familyDetails.isdependent === "1" ? (
                                                                <Form.Label>Occupation</Form.Label>
                                                            ) : (
                                                                <Form.Label>Occupation*</Form.Label>
                                                            )}
                                                            {occupationList && (
                                                                <Select
                                                                    classNamePrefix="sortSelect"
                                                                    isSearchable={false}
                                                                    styles={customStyles}
                                                                    options={occupationList}
                                                                    value={familyDetails.occupation !== "" ? occupationList.find((option) => option.value === familyDetails.occupation) : null}
                                                                    onChange={(e) => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            occupation: e.value,
                                                                        });
                                                                    }}
                                                                />
                                                            )}
                                                            <>
                                                                {simpleValidator.current.message('Occupation', (familyDetails.isdependent === "1" ? "1" : "") + familyDetails.occupation, 'required', { messages: { min: 'Please select the occupation' } })}
                                                            </>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12">
                                                        <div className="dark-label mt-2">
                                                            <Form.Label>Dependency Status*</Form.Label>
                                                            <div className="d-flex pt-4" style={{ clear: "both" }}>
                                                                <FintooRadio2
                                                                    style={{
                                                                        paddingLeft: "0rem !important",
                                                                    }}
                                                                    checked={familyDetails.isdependent == "1"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "1",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Dependent"
                                                                />
                                                                <FintooRadio2
                                                                    checked={familyDetails.isdependent == "0"}
                                                                    onClick={() => {
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            isdependent: "0",
                                                                        })
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            lifeExpError: ''
                                                                        }))
                                                                        setFieldError(field => ({
                                                                            ...field,
                                                                            retAgeError: ''
                                                                        }))
                                                                    }}
                                                                    title="Earning"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row py-2 d-flex align-items-center">
                                                    <div className="col-md-5 col-12 pt-1">
                                                        <div className="dark-label">
                                                            <Form.Label>DOB*</Form.Label>
                                                            <div
                                                                className="dt-conbx"
                                                                style={{
                                                                    borderBottom: "1px solid #dadada",
                                                                    paddingTop: "6px",
                                                                }}
                                                            >
                                                                <ReactDatePicker
                                                                    select_date={moment(
                                                                        familyDetails.dob,
                                                                        "DD/MM/YYYY"
                                                                    ).toDate()}
                                                                    setDate={(date) => {
                                                                        setDate(date);
                                                                    }}
                                                                    maxDate={moment()}
                                                                    minDate={moment().subtract(100, "years")}
                                                                    className="pt-4"
                                                                />
                                                            </div>
                                                            <div>{simpleValidator.current.message('DOB', familyDetails.dob, 'required', { messages: { required: 'Please select date of birth' } })}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 col-12 custom-input">
                                                        <div className={`form-group inputData`} style={{ paddingTop: "17px" }}>
                                                            <span>
                                                                <input type="Number" name="Others_age" value={age}
                                                                    readOnly required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Age</label>
                                                            </span>
                                                            <span>
                                                                <span className="info-hover-box" style={{ top: '25px' }}>
                                                                    <span className="icon">
                                                                        <img
                                                                            alt="More information"
                                                                            src={imagePath + '/static/media/more_information.svg'}
                                                                        />
                                                                    </span>
                                                                    <span className="msg">
                                                                        Auto Calculated by DOB
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                                {familyDetails.isdependent === "0" && ( // Show the fields when isdependent is "earning"
                                                    <div className="row py-2">
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.retirement_age ? "inputData" : null}`}>
                                                                <input type="text" name="retirement_age" value={familyDetails.retirement_age}
                                                                    min="0"
                                                                    max="999"
                                                                    onChange={(e) => {
                                                                        checkRetirementAge(e.target.value.slice(0, 2))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            retirement_age: e.target.value.slice(0, 2), // Restrict input to 2 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Retirement Age")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Retirement Age*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.retAgeError}</div>
                                                        </div>
                                                        <div className="col-5 custom-input">
                                                            <div className={`form-group mt-1 ${familyDetails.life_expectancy ? "inputData" : null}`}>
                                                                <input name="retirement_age" type="number"
                                                                    min="0"
                                                                    max="999"
                                                                    value={familyDetails.life_expectancy}
                                                                    onChange={(e) => {
                                                                        checkLifeExpectancyAge(e.target.value.slice(0, 3))
                                                                        setFamilyDetails({
                                                                            ...familyDetails,
                                                                            life_expectancy: e.target.value.slice(0, 3), // Restrict input to 3 digits
                                                                        });
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        simpleValidator.current.showMessageFor("Life Expectancy")
                                                                    }} required autoComplete="off" />
                                                                <span className="highlight"></span>
                                                                <span className="bar"></span>
                                                                <label htmlFor="name">Life Expectancy*</label>
                                                            </div>
                                                            <div className="error" style={{ position: "absolute", top: "42px" }}>{fieldError.lifeExpError}</div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="row">
                                                    <div className="col-md-10 col-12 custom-input">
                                                        <div className={`form-group mt-2 ${familyDetails.remark ? "inputData" : ""}`}>
                                                            <input type="text" name="Others_remarks" value={familyDetails.remark}
                                                                onChange={(e) => {
                                                                    setFamilyDetails({
                                                                        ...familyDetails,
                                                                        remark: e.target.value,
                                                                    })
                                                                }} required autoComplete="off" />
                                                            <span className="highlight"></span>
                                                            <span className="bar"></span>
                                                            <label htmlFor="name">Remarks</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row py-2">
                                                    <div className=" text-center">
                                                        <div>
                                                            <div className="btn-container">
                                                                <div className="d-flex justify-content-center">
                                                                    <div
                                                                        className="previous-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => setTab("tab3")}
                                                                    >
                                                                        <FaArrowLeft />
                                                                        <span className="hover-text">
                                                                            &nbsp;Previous
                                                                        </span>
                                                                    </div>

                                                                    {addForm && (
                                                                        <button
                                                                            className="default-btn gradient-btn save-btn"
                                                                            onClick={(e) => { addFamilySubmit(e) }}>
                                                                            Save & Add More
                                                                        </button>
                                                                    )}
                                                                    {updateForm && (
                                                                        <div>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    cancelFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    updateFamilyForm(e)
                                                                                }
                                                                                className="default-btn gradient-btn save-btn"
                                                                            >
                                                                                Update
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                                    {/* <div className="next-btn form-arrow d-flex align-items-center"
                                                                        onClick={() => setTab("tab5")}>
                                                                        <span
                                                                            className="hover-text"
                                                                            style={{ maxWidth: 100 }}
                                                                        >
                                                                            Continue&nbsp;
                                                                        </span>
                                                                        <FaArrowRight />
                                                                    </div> */}
                                                                    <Link
                                                                        to={
                                                                            process.env.PUBLIC_URL +
                                                                            "/datagathering/income-expenses"
                                                                        }
                                                                    >
                                                                        <div className="next-btn form-arrow d-flex align-items-center">
                                                                            <span
                                                                                className="hover-text"
                                                                                style={{ maxWidth: 100 }}
                                                                            >
                                                                                Continue&nbsp;
                                                                            </span>
                                                                            <FaArrowRight />
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Modal className="popupmodal" centered show={show} onHide={handleClose}>
                <Modal.Header className="ModalHead">
                    <div className="text-center">Delete Confirmation</div>
                </Modal.Header>
                <div className=" p-5 d-grid place-items-center align-item-center">
                    <div className=" HeaderModal">
                        <div
                            style={{
                                fontSize: "1rem",
                                textAlign: "center",
                            }}
                        >
                            This will permanently erase the record and its associated
                            information.
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center pb-5">
                    <button
                        onClick={() => {
                            handleClose("yes");
                        }}
                        className="outline-btn m-2"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => {
                            handleClose("no");
                            setShow(false)
                        }}
                        className="outline-btn m-2"
                    >
                        No
                    </button>
                </div>
            </Modal>
        </div>

    )
}

export default Family;