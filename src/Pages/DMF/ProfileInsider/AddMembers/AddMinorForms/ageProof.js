import styled from "styled-components";

import style from '../style.module.css'
import { IoChevronBackCircleOutline } from "react-icons/io5";
import UploadComponent from "../AddMemberComponents/UploadComponent";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchData, fetchEncryptData, getMinorUserId, getUserId, memberId } from "../../../../../common_utilities";
import axios from "axios";
import commonEncode from "../../../../../commonEncode";
import ModalProfileComplete from "../../../../../components/Pages/ProfileCompoenents/Profile/ModalProfileComplete";
import ModalProfileError from "../../../../../components/Pages/ProfileCompoenents/Profile/ModalProfileError";
import { DATA_BELONGS_TO } from "../../../../../constants";

function AgeProof(props) {

    const [imgSrc, setImgSrc] = useState("");
    const [preview, setPreview] = useState(false);
    const [oldPhoto, setOldPhoto] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [condition, setCondition] = useState(false);
    const [showModalfalse, setshowModalfalse] = useState(false);
    const [userDetails, setUserDetails] = useState("");
    const [popupTitleError, setPopupTitleError] = useState("AOF REJECT");
    const [popupDescError, setPopupDescError] = useState(
        "Hi, YOUR AOF HAS BEEN REJECTED"
    );
    const user_id =  getMinorUserId() ? getMinorUserId(): memberId();

    // const storedMinorDetails = localStorage.getItem('gaurdiaID');
    // const guardianID = JSON.parse(storedMinorDetails);
    useEffect(() => {
      }, [preview]);
    
    const dispatch = useDispatch();

    useEffect(() => {
    loadInIt();
    getUserDetails();

    }, []);

    const getUserDetails = async () => {
        var data = { user_id: user_id };
        try {
          var data = commonEncode.encrypt(JSON.stringify(data));
          var config = {
            method: "post",
            url: '',
            data: data,
          };
          var res = await axios(config);
          var response = commonEncode.decrypt(res.data);
          setUserDetails(JSON.parse(response)["data"]);
         
        } catch (e) {
          e.errorAlert();
        }
      };

    const loadInIt = async () => {
    setOldPhoto({});
    setPreview(false);

    try {
        var payload = {
        url: '',
        method: "post",
        data: {
            user_id: user_id,
        },
        };

        var response = await fetchEncryptData(payload);

        var photo = {};

        photo = response.data.filter(
        (v) => v.doc_other_name == "minor_age_proof"
        )[0];
        if (photo === undefined) photo = {};

        var pObj = {};
        if (Object.keys(photo).length) {
        pObj = { doc_id: photo.doc_id };
        var paylaod = {
            data: {
            user_id: user_id,
            file_name: photo.doc_name,
            },
            url: '',
            method: "post",
        };
        var response = await fetchData(paylaod);
        if ("data" in response && "file_url" in response.data) {
            pObj = { ...pObj, url: response.data.file_url };

            setOldPhoto({ ...pObj });
            setPreview(true);
        }
        }
    } catch (e) {}
    };

    const convertBase = async (blob) => {
    let file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
    let formdata = new FormData();
    formdata.append("doc_file", file);
    formdata.append("user_id", commonEncode.encrypt(user_id));
    formdata.append("doc_type", commonEncode.encrypt("170"));
    formdata.append("doc_name", commonEncode.encrypt("minor_age_proof"));
    var res = await axios({
        url: '',
        method: "POST",
        data: formdata,
    });
    let response = commonEncode.decrypt(res.data);
    let responseobj = JSON.parse(response);
    let error_code = responseobj.error_code;

    if (error_code == "102") {
        dispatch({
        type: "RENDER_TOAST",
        payload: {
            message: responseobj.message,
            type: "error",
            autoClose: 3000,
        },
        });
    } else if (error_code == "100") {
        if(userDetails.guardian_relation !== "legal guardian"){
            generateAOF();
        }
        // props.setShowCompleteModal(true)
        dispatch({
        type: "RENDER_TOAST",
        payload: {
            message: responseobj.message,
            type: "success",
            autoClose: 3000,
        },
        });
        props.onNext();
        
    }
    };

    const convertBlob = () => {
    if (preview === true && !imgSrc) {
        props.onNext();
    } else {
        if(userDetails.guardian_relation != "legal guardian")
        {
        suppoortmailhit();
         
        }
        fetch(imgSrc)
        .then((res) => res.blob())
        .then(async (blob) => {
            convertBase(blob);
        });
    }
    };

    const deleteOldPhoto = async () => {
    try {
        var payload = {
        url: DOCS_DELETE_FILE,
        data: {
            document_id: "" + oldPhoto.doc_id,
            user_id: user_id,
        },
        method: "post",
        };
        var response = await fetchData(payload);

        setOldPhoto({});
        setPreview(false)
        // setOpenConfirm(false);
        dispatch({
        type: "RENDER_TOAST",
        payload: { message: response.message, type: "success" },
        });
    } catch (e) {
        console.error(e);
    }
    };

    const generateAOF = async () => {
        let url =DMF_GENERATE_AOF_API_URL;
        let data_sent = JSON.stringify({
            user_id: user_id,
            data_belongs_to: DATA_BELONGS_TO,
        });
        var config = {
            method: "post",
            url: url,
            data: commonEncode.encrypt(data_sent),
        };
        var res = await axios(config);
        var response = commonEncode.decrypt(res.data);
        let response_obj = JSON.parse(response);
        let error_code = response_obj["error_code"];
    
        if (error_code == "100") {
            setShowModal(true);
            window.history.pushState("", "", process.env.PUBLIC_URL+"/direct-mutual-fund/profile/AddMinor?minor=1");
            // localStorage.removeItem("YmFua19pZA==");
            // localStorage.removeItem("klmclNXd");
            // localStorage.removeItem("Bank_DETAILS");
        } else {
            setCondition(false);
            setshowModalfalse(true);
            //setPopupDescError(response_obj["message"]);
            setPopupDescError("Please try again later, or contact customer support.");
            setPopupTitleError("Oops! Something went wrong");
            // localStorage.removeItem("YmFua19pZA==");
            // localStorage.removeItem("klmclNXd");
            // localStorage.removeItem("Bank_DETAILS");
        }
        };


    // const AOFImageUplode = async () => {
    //     let url = DMF_AOF_IMAGE_UPLOAD_API_URL;
    //     let data_sent = JSON.stringify({
    //         user_id:  getMinorUserId(),
    //         data_belongs_to: DATA_BELONGS_TO,
    //     });
    //     var config = {
    //         method: "post",
    //         url: url,
    //         data: commonEncode.encrypt(data_sent),
    //     };
    //     var res = await axios(config);
    //     var response = commonEncode.decrypt(res.data);
    //     let response_obj = JSON.parse(response);
    //     let error_code = response_obj["error_code"];
    
    //     if (error_code == "100") {
    //         setCondition(true);
    //         setShowModal(true);
    //     } else {
    //         setCondition(false);
    //         setshowModalfalse(true);
    //         //setPopupDescError(response_obj["message"]);
    //         setPopupDescError("Please try again later, or contact customer support.");
    //         setPopupTitleError("Oops! Something went wrong");
    //     }
    //     };

    const suppoortmailhit = async () => {
        try {
          var urlmail = {
            userdata: {
              to: "krishna.bonate@wealthtech.ai"
              // "support@fintoo.in",
            },

            subject: "Action Required - New Minor Member Are Registered  ",
            template: "NRE_NRO_UPDATE.html",
            contextvar: {
              name: userDetails.name,
              user_id : getUserId(),
              pan:userDetails.pan,
              platform :"FIntoo",   
              mobile : userDetails.mobile,
              email:userDetails.email ,
              type:"minor"
            },
          };
          let config = {
            method: "post",
            url: '',
            data: urlmail,
          };
          var res = await fetchEncryptData(config);
        } catch (e) {
          console.log("------->", e);
        }
      };




    const handleChange = () => {
        window.location.href = process.env.PUBLIC_URL + "/direct-mutual-fund/";
    };
    
    const handleChange1 = () => {
        window.location.href = process.env.PUBLIC_URL + "/direct-mutual-fund/";
    };
        

    return (
        <div className={`${style.addMinorSectionView}`}>
            <div className={`${style.addMinorSectionViewImg}`}>
                <img style={{ width: '100%' }} src={process.env.REACT_APP_STATIC_URL + "media/DMF/minorFlow/minorflowimg4.png"} alt="" />
            </div>
            <div className=" ">
                <div className={`${style.addMinorFormTitleContainer}`}>
                    <div
                        onClick={() => props.onPrevious()}
                    >
                        <IoChevronBackCircleOutline className={`${style.addMinorFormTitlebackBtn}`} />
                    </div>

                    <div className={`${style.addMinorFormTitle}`}>Upload Proof of Minor’s Age</div>
                </div>

                <div className={`${style.uploadContentContainer}`}>
                    <div className={`${style.noteTextContent}`}>
                        <span className={`${style.noteText}`}>Note:-</span> Birth certificate/School leaving certificate/Mark sheet issued by Higher Secondary Board of respective states, ICSE, CBSE etc./Passport/Any other suitable proof evidencing the date of birth of the minor.
                    </div>
                    <br />
                </div>
                <div className={`${style.uploadElemContainer}`}>
                <UploadComponent
                    imgSrc={imgSrc}
                    setImgSrc={setImgSrc}
                    preview={preview}
                    setPreview={setPreview}
                    oldPhoto={oldPhoto}
                    setOldPhoto={setOldPhoto}
                    deleteOldPhoto={deleteOldPhoto}
                    uploadTxt={
                    "Upload a clear photo or scanned copy of age proof of minor"
                    }
                />
                </div>
                <div className="fintoo-top-border mt-4 pt-4" style={{ display: Boolean(preview) ? "block" : "none" }}>
                <div className={`${style.nextBtn}`} onClick={() => convertBlob()}>
                    Next
                </div>
                </div>

            </div>
            <ModalProfileComplete
                showModal={showModal}
                setShowModal={setShowModal}
                condition={condition}
                handleChange={handleChange}
                handleChange1={handleChange1}
            />
            <ModalProfileError
                showModalfalse={showModalfalse}
                popupTitleError={popupTitleError}
                popupDescError={popupDescError}
                handleChange1={handleChange1}
            />
        </div>
    );
}

export default AgeProof;
