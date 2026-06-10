import { useState, useEffect, useRef } from "react";
import "react-responsive-modal/styles.css";
import Signatureimg from "../../../Assets/08_signture.svg";
import ProfileCompletedImg from "../../../../Assets/Images/temp_img_8865.svg";
import { Row } from "react-bootstrap";
import "../Fatca/style.css";
import axios from "axios";
import commonEncode from "../../../../commonEncode";
import {
  fetchData,
  fetchEncryptData,
  getUserId,
} from "../../../../common_utilities";
import { DATA_BELONGS_TO } from "../../../../constants";

import styled from "styled-components";

import FintooButton from "../../../HTML/FintooButton";
import { MdDelete } from "react-icons/md";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";

import ReactCrop from "../../../HTML/ReactCrop";
import SweetAlert from "sweetalert-react/lib/SweetAlert";
import { AofImageUpload, FatcaUpload, GenerateAof } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { DeleteDocumentApi, UploadDocumentApi } from "../../../../FrappeIntegration-Services/services/financial-planning-api/document";
import { fetchUserProfileDetails } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";

const userid = getUserId();

const UploadInput = styled("input")({
  display: "none",
});

const aspect = 16 / 9;
const scale = 1;

const UploadSignature = (props) => {
  const dispatch = useDispatch();
  const inputFileUpload = useRef(null);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [imgSrc, setImgSrc] = useState("");
  const [preview, setPreview] = useState(false);
  const showBack = useSelector((state) => state.isBackVisible);
  const [showModal, setShowModal] = useState(false);
  const [showModalfalse, setshowModalfalse] = useState(false);
  const [condition, setCondition] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const [oldPhoto, setOldPhoto] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [popupTitleError, setPopupTitleError] = useState("AOF REJECT");
  const [popupDescError, setPopupDescError] = useState(
    "Hi, YOUR AOF HAS BEEN REJECTED"
  );
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    getUserKycDetails();
    GetUserDetails();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, [condition]);

  useEffect(() => { }, [condition]);

  useEffect(() => {
    if (userDetails.bse_reg == "N" || userDetails.bse_reg == "") {
      clientRegistration();
    }
  }, []);

  const loadInIt = async () => {
    try {
      var payload = {
        url: '',
        method: "post",
        data: {
          user_id: getUserId(),
        },
      };

      var response = await fetchEncryptData(payload);

      var photo = {};

      photo = response.data.filter((v) => v.doc_other_name == "Signature")[0];
      if (photo === undefined) photo = {};

      var pObj = {};
      if (Object.keys(photo).length) {
        pObj = { doc_id: photo.doc_id };
        var paylaod = {
          data: {
            user_id: getUserId(),
            file_name: photo.doc_name,
          },
          url: '',
          method: "post",
        };
        var response = await fetchData(paylaod);
        if (response.error_code == "100") {
          setFlag(true);
        }

        if ("data" in response && "file_url" in response.data) {
          pObj = { ...pObj, url: response.data.file_url };
          setOldPhoto({ ...pObj });
        }
      }
    } catch (e) { }
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (
        e.target.files[0].type == "image/jpeg" ||
        e.target.files[0].type == "image/png"
      ) {
        if (e.target.files[0].size <= 2097152) {
          setCrop(undefined);
          const reader = new FileReader();
          reader.addEventListener("load", () =>
            setImgSrc(reader.result.toString() || "")
          );
          reader.readAsDataURL(e.target.files[0]);
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Files up to 2MB accepted.",
              type: "error",
              autoClose: 3000,
            },
          });
          onRemoveUploaded();
        }
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Invalid file extension being uploaded.",
            type: "error",
            autoClose: 3000,
          },
        });
        onRemoveUploaded();
      }
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  };

  const convertBlob = async () => {

    const byteString = atob(imgSrc.split(',')[1]);
    const mimeString = imgSrc.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    if (userDetails.user_fatca_verified == 0) {
      var payload = {
        user_id: getUserId(),
        data_belongs_to: DATA_BELONGS_TO
      }
      var res = await FatcaUpload(payload);
    }
    convertBase(blob);
  };

  const convertBase = async (blob) => {
    if (flag) {
      setCondition(false);
      setShowModal(true);
    } else {
      const current = new Date();
      const time = current.toLocaleTimeString("en-US");
      let file = new File([blob], "filName" + time + ".png", {
        type: "image/png",
      });
      let formdata = new FormData();
      formdata.append("user_document_belongs_to", DATA_BELONGS_TO)
      formdata.append("document_files", file);
      formdata.append("user_document_user_id", userid);
      formdata.append("document_cat_uuid", "signDirect");

      const response = await UploadDocumentApi(formdata);

      if (response.status_code == "200") {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Signature uploaded successfully.",
            type: "success",
            autoClose: 3000,
          },
        });
        await GetUserDetails();
        let doc_id = response.data[0].user_document_id;

        generateAOF(doc_id);
        if (userDetails.user_residential_status == "NRI") {
          setCondition(false);
          sendMailToSupport();
          setShowModal(true);
        }
      }
    }
  };

  const sendMailToSupport = async () => {
    try {
      var urlmail = {
        userdata: {
          to: "partnersupport@wealthtech.ai"
        },
        subject: "Action Required - New NRE/NRO Member Are Registered",
        template: "NRE_NRO_UPDATE.html",
        contextvar: {
          name: userDetails.name,
          user_id: getUserId(),
          pan: userDetails.pan,
          platform: "FIntoo",
          mobile: userDetails.mobile,
          email: userDetails.email,
          type: "NRE/NRO"
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

  const clientRegistration = async () => {
    let url = DMF_CLIENT_REGISTRATION_API_URL;
    let data_sent = JSON.stringify({
      user_id: getUserId(),
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
      FATCAUpload();
    } else {
      setTimeout(() => {
        props.onNext();
      }, 1000);
    }
  };

  const FATCAUpload = async () => {
    let url = DMF_FATCA_UPLOAD_API_URL;
    let data_sent = JSON.stringify({
      user_id: getUserId(),
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
      toast.success("User details updated successfully.", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
      });
      setTimeout(() => {
        props.onNext();
      }, 1000);
    } else {
      toast.success("User details updated successfully", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
      });
      setTimeout(() => {
        props.onNext();
      }, 1000);
    }
  };

  const generateAOF = async (doc_id) => {
    var payload = {
      user_id: userid,
      data_belongs_to: DATA_BELONGS_TO,
      doc_id: doc_id
    }
    var res = await GenerateAof(payload);

    let error_code = res.status_code;

    if (error_code == 200) {
      if (userDetails.user_residential_status == "RES") {
        AOFImageUplode();
      }
    } else {
      setshowModalfalse(true);
    }
  };

  const AOFImageUplode = async () => {

    var payload = {
      user_id: getUserId(),
      data_belongs_to: DATA_BELONGS_TO
    }

    var response = await AofImageUpload(payload);

    var status_code = response.status_code;

    if (status_code == 200) {
      setCondition(true);
      setShowModal(true);
    } else {
      setCondition(false);
      setshowModalfalse(true);
      setPopupDescError("Please try again later, or contact customer support.");
      setPopupTitleError("Oops! Something went wrong");
    }
  };

  const convertUrlToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const blob = await response.blob();

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting URL to base64:", error);
      return null;
    }
  };

  const handleConvert = async (s3Url) => {
    const base64String = await convertUrlToBase64(s3Url);
    if (base64String) {
      setImgSrc(base64String);
    }
  };

  const GetUserDetails = async () => {
    try {
      const userid = getUserId();
      const response = await fetchUserProfileDetails(userid);
      const data = response.data;
      setUserDetails(data);
      if (data?.signature_doc_url) {
        handleConvert(data?.signature_doc_url);
        setOldPhoto({
          url: data.signature_doc_url,
          doc_id: data.signature_doc_id || null,
        });
      }
    } catch (e) {
      console.error("Error fetching user details:", e);
    }
  };

  const getUserKycDetails = async () => {
    var urlgetmemdata1 = {
      user_id: getUserId(),
      data_belongs_to: DATA_BELONGS_TO,
    };

    var data = commonEncode.encrypt(JSON.stringify(urlgetmemdata1));
    // var config = {
    //   method: "post",
    //   url: DMF_GET_KYC_DETAILS_API_URL,
    //   data: data,
    // };
    // var res = await axios(config);
    // var response = commonEncode.decrypt(res.data);
    // var a = JSON.parse(response)["data"];
    // setKycDetails(a);
  };

  const onRemoveUploaded = () => {
    inputFileUpload.current.value = "";
    setImgSrc("");
    setPreview(false);
  };
  const handleChange = () => {
    window.location.href = process.env.PUBLIC_URL + "/direct-mutual-fund/";
  };

  const handleChange1 = () => {
    window.location.href = process.env.PUBLIC_URL + "/direct-mutual-fund/";
  };

  const deleteOldPhoto = async () => {
    if (!oldPhoto?.doc_id) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "No signature to delete", type: "error" },
      });
      setOpenConfirm(false);
      return;
    }

    try {
      const payload = {
        user_document_id: oldPhoto.doc_id,
        user_id: getUserId(),
      };

      const response = await DeleteDocumentApi(payload);

      if (response?.status_code == "200") {
        setImgSrc("");
        setOldPhoto({});
        setFlag(false);
        setOpenConfirm(false);
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.data[0].message, type: "success" },
        });
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.message || "Failed to delete", type: "error" },
        });
      }
    } catch (e) {
      console.error(e);
      setOpenConfirm(false);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went wrong", type: "error" },
      });
    }
  };

  return (
    <>
      <SweetAlert
        show={openConfirm}
        title="Delete photo"
        text="Are you sure?"
        onConfirm={() => {
          deleteOldPhoto();
        }}
        onCancel={() => {
          setOpenConfirm(false);
        }}
        showCancelButton
      />
      <Row className="reverse">
        <div className="ProfileImg col-12 col-md-6">
          <div>
            <img src={Signatureimg} alt="Signatureimg" />
          </div>
        </div>
        <div className=" RightPanel col-12 col-md-6">
          <div className="rhl-inner">
            {showBack == true && (
              <FintooProfileBack
                title="Signature Verfication"
                onClick={() => props.onPrevious()}
              />
            )}
            <p className="">
              Please provide your signature for verification purposes.
            </p>

            <div style={{ display: oldPhoto?.url ? "" : "none" }}>
              <div className="whitebg-rounded img-preview-n fileContainer">
                <span
                  onClick={() => {
                    // setOldPhoto({});
                    setOpenConfirm(true);
                  }}
                >
                  <MdDelete />
                </span>
                <img
                  src={oldPhoto.url}
                  style={{
                    objectFit: "contain",
                    maxHeight: "270px",
                    maxWidth: "90%",
                  }}
                />
              </div>
              <div className="pt-4">
                <FintooButton
                  className={`d-block me-0 ms-auto`}
                  onClick={() => {
                    convertBlob();
                    localStorage.removeItem("YmFua19pZA==");
                    localStorage.removeItem("bmF2RHluYW1pY05leHQ=");
                    localStorage.removeItem("bmF2RHluYW1pY1ByZXY=");
                    localStorage.removeItem("doc");
                  }}
                  title={"Next"}
                />
              </div>
            </div>

            <div style={{ display: oldPhoto?.url ? "none" : "block" }}>
              <div style={{ display: imgSrc.trim() == "" ? "block" : "none" }}>
                <UploadInput
                  onChange={(e) => onSelectFile(e)}
                  accept="image/*"
                  id="inputFileUpload"
                  ref={inputFileUpload}
                  type="file"
                />
                <div className="dlc-bx-upload  px-5">
                  <div className="dlc-bx">
                    <div className="pnf-img-bx" role="button">
                      <label htmlFor="inputFileUpload" role="button">
                        <img
                          src={require("../../../../Assets/Images/file-upload.png")}
                        />
                        <p>Upload</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${Boolean(preview) == false && imgSrc.trim() != ""
                  ? ""
                  : "fakeHide"
                  }`}
              >
                <div className="new-bg-white">
                  <ReactCrop
                    onDelete={() => {
                      setImgSrc("");
                      inputFileUpload.current.value = "";
                    }}
                    image={imgSrc.trim()}
                    maxWidth={250}
                    maxHeight={200}
                    onCrop={(v) => {
                      setImgSrc(v);
                      setPreview(true);
                    }}
                  />
                </div>
              </div>

              <div style={{ display: Boolean(preview) ? "" : "none" }}>
                <div className="fileContainer d-flex justify-content-center align-items-center img-preview-n">
                  <span onClick={() => onRemoveUploaded()}>
                    <MdDelete />
                  </span>
                  <img
                    src={imgSrc}
                    style={{
                      objectFit: "contain",
                      maxHeight: "270px",
                      maxWidth: "90%",
                    }}
                  />
                </div>

                <div className=" pt-4 mt-4">
                  <FintooButton
                    className={`d-block me-0 ms-auto`}
                    onClick={() => {
                      convertBlob();
                      localStorage.removeItem("YmFua19pZA==");
                      localStorage.removeItem("bmF2RHluYW1pY05leHQ=");
                      localStorage.removeItem("bmF2RHluYW1pY1ByZXY=");
                      localStorage.removeItem("doc");
                    }}
                    title={"Next"}
                  />
                </div>
              </div>
            </div>
          </div>
          <p>&nbsp;</p>
        </div>
      </Row>
      <Modal
        backdrop="static"
        size="lg"
        centered
        show={showModal}
        className="profile-popups sign-popup"
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Modal.Body>
          <div className="modal-body-box">
            <h2 className="pt-3 pb-0 text-center">Profile Completed</h2>
            {condition === true && (
              <>
                <div className="pt-3 pb-3 ">
                  <div className="img-box9 pt-4 inv-sign-border text-center">
                    <img
                      className="img-fluid inv-img-86"
                      src={ProfileCompletedImg}
                    />
                  </div>
                </div>
                <h3 className="pt-2 pb-0 text-center ">
                  Hi, congratulations your profile has been completed
                </h3>
                <div className="pb-3 pt-2">
                  <FintooButton
                    onClick={() => handleChange()}
                    title={"Start Investment"}
                  />
                </div>
              </>
            )}
            {condition === false && (
              <>
                <div className="pt-3 pb-3 ">
                  <div className="img-box9 pt-4 inv-sign-border text-center">
                    <img
                      className="img-fluid inv-img-iqc"
                    src={ProfileCompletedImg}
                    />
                  </div>
                </div>
                <h3 className="pt-2 pb-0 text-center ">
                  Hi, <strong>congratulations!</strong> Your profile has been successfully completed. <br />The NRE/NRO account verification will take 24-48 hours. In the meantime, feel free to explore other Fintoo products and make the most of your experience.
                </h3>
                <div className="pb-3 pt-3">
                  <FintooButton
                    onClick={() => {
                      handleChange1();
                    }}
                    title={"Continue"}
                  />
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        backdrop="static"
        size="lg"
        centered
        show={showModalfalse}
        className="profile-popups sign-popup"
      >
        <Modal.Body>
          <div className="modal-body-box">
            <h2 className="pt-3 pb-0 text-center">{popupTitleError}</h2>

            <>
              <div className="pt-3 pb-3 ">
                <div className="img-box9 pt-4 inv-sign-border text-center">
                  <img
                    className="img-fluid inv-img-86"
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/DMF/temp_img_8865.svg"
                    }
                  />
                </div>
              </div>
              <h3 className="pt-2 pb-0 text-center ">{popupDescError}</h3>
              <div className="pb-3 pt-3">
                <FintooButton
                  onClick={() => {
                    handleChange1();
                  }}
                  title={"Continue"}
                />
              </div>
            </>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UploadSignature;
