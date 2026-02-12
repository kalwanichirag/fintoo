import { useState, useEffect, useRef } from "react";
import "react-responsive-modal/styles.css";
import Link from "../../../MainComponents/Link";
import Profile_1 from "../../../Assets/07_Upload_aadhar.svg";
import Form from "react-bootstrap/Form";
import HDFC from "../../../Assets/hdfc.png";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Container, Row, Col } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import Aadhar from "../Aadhar/AadharFront";
import AadharBack from "../Aadhar/AadharBack";
import PanCard from "../Aadhar/PanCard";
import Photo from "../Aadhar/Photo";
// import VerifyButton from "@passbase/button/react";
import "../Fatca/style.css";
import ImageEditor from "./CropImg/ImageEditor";
import { whiteTheme } from "./CropImg/white-theme";
import { Pane, FileUploader, FileCard } from "evergreen-ui";
import Back from "../../../Assets/left-arrow.png";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import styled from "styled-components";
import axios from "axios";
import commonEncode from "../../../../commonEncode";
import { ToastContainer, toast } from "react-toastify";
import { CheckSession, fetchData, fetchEncryptData, getUserId, memberId } from "../../../../common_utilities";

import FintooButton from "../../../HTML/FintooButton";

import { MdDelete } from "react-icons/md";
import ReactCrop from "../../../HTML/ReactCrop";
import SweetAlert from "sweetalert-react";
import { useSelector, useDispatch } from "react-redux";

const UploadInput = styled("input")({
  display: "none",
});

const aspect = 16 / 9;
const scale = 1;

const UploadPan = (props) => {
  const dispatch = useDispatch();

  const [validated, setValidated] = useState(false);

  const inputFileUpload = useRef(null);
  const [crop, setCrop] = useState({
    unit: "%", // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [imgSrc, setImgSrc] = useState("");
  const [completedCrop, setCompletedCrop] = useState(null);
  const [preview, setPreview] = useState(false);
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const showBack = useSelector((state) => state.isBackVisible);
  const [rotateValue, setRotateValue] = useState(0);
  const [oldPhoto, setOldPhoto] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);



  useEffect(() => {
    // // checksession();
    loadInIt();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
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
      
      photo = response.data.filter(
        (v) => v.doc_other_name == "PAN Card"
      )[0];
      if(photo === undefined) photo = {};
      
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
        
        if ("data" in response && "file_url" in response.data) {
          pObj = { ...pObj, url: response.data.file_url };
          setOldPhoto({ ...pObj });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  var user_id = memberId();

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if ((e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png")) 
      {
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
      } 
      else {
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
  const convertBase = async (blob) => {
    let file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
    let formdata = new FormData();
    formdata.append("doc_file", file);
    formdata.append("user_id", commonEncode.encrypt(getUserId()));
    formdata.append("doc_type", commonEncode.encrypt("142"));
    formdata.append("doc_name", commonEncode.encrypt("PAN Card"));
    var res = await axios({
      url: DMF_BASE_URL + "api/document/adddocument",
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
    
    fetch(imgSrc)
    .then(res => res.blob())
    .then(async blob => {
      convertBase(blob);
    });
  }
  
  const onRemoveUploaded = () => {
    inputFileUpload.current.value = "";
    setImgSrc("");
    setPreview(false);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  const referenceUserWithKey = (key) => {
    
    // Make request to your backend/db and save the key to the user's profile
  };

  const deleteOldPhoto = async () => {
    try {
      var payload = {
        url: DOCS_DELETE_FILE,
        data: {
          document_id: "" + oldPhoto.doc_id,
          user_id: getUserId(),
        },
        method: "post",
      };
      var response = await fetchData(payload);
      
      setOldPhoto({});
      setOpenConfirm(false);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: response.message, type: "success" },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const props1 = {
    includeUI: {
      uiSize: {
        width: "630px",
        height: "500px",
      },
      menu: [
        "crop",
        "flip",
        "rotate",
        "draw",
        "shape",
        "icon",
        "text",
        "filter",
      ],
      menuBarPosition: "left",
      theme: whiteTheme,
    },
    cssMaxWidth: 700,
    cssMaxHeight: 800,
    selectionStyle: {
      cornerSize: 20,
      rotatingPointOffset: 70,
    },
  };

  

  return (
    <>
      <ToastContainer limit={1} />

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
        <div className="col-12 col-md-6 ProfileImg p-2">
          <div>
            <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/07_Upload_aadhar.svg"} alt="" />
          </div>
        </div>
        <div className="col-12 col-md-6 RightPanel">
          <div className="rhl-inner uploadpan-section">
            {showBack == true && (
              <FintooProfileBack
                title="Upload PAN Card"
                onClick={() => props.onPrevious()}
              />
            )}

            <p className="">
              Please upload a clear photograph or a scanned copy of your PAN
              card in JPEG, JPG or PNG format.{" "}
            </p>

            <div style={{ display: "url" in oldPhoto ? "" : "none" }}>
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
                  onClick={() => props.onNext()}
                  title={"Next"}
                />
              </div>
            </div>

            <div style={{ display: "url" in oldPhoto ? "none" : "" }}>
              <div style={{ display: imgSrc.trim() == "" ? "block" : "none" }}>
                <UploadInput
                  onChange={(e) => onSelectFile(e)}
                  accept="image/*"
                  id="inputFileUpload"
                  ref={inputFileUpload}
                  type="file"
                />
                <div className="dlc-bx-upload px-0 px-md-5">
                  <div className="dlc-bx">
                    <div className="pnf-img-bx" role="button">
                      <label htmlFor="inputFileUpload" role="button">
                        <img
                       src={process.env.REACT_APP_STATIC_URL + "media/DMF/file-upload.svg"}
                        />
                        <p>Upload</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`${
                Boolean(preview) == false && imgSrc.trim() != ""
                  ? ""
                  : "fakeHide"
              }`}
            >
              <div className="new-bg-white">
                <ReactCrop
                  onDelete={() => {
                    setImgSrc("");
                    inputFileUpload.current.value = '';
                  }}
                  image={imgSrc.trim()}
                  // maxWidth={250}
                  // maxHeight={200}
                  onCrop={(v) => {
                    
                    setImgSrc(v);
                    setPreview(true);
                    // convertBlob();
                  }}
                />
              </div>
            </div>

            <div style={{ display: Boolean(preview) ? "block" : "none" }}>
              <div className="fileContainer d-flex justify-content-center align-items-center img-preview-n">
                <span onClick={() => onRemoveUploaded()}>
                  <MdDelete />
                </span>
                <img
                  src={imgSrc}
                  style={{
                    // border: '1px solid black',
                    objectFit: "contain",
                    maxHeight: "270px",
                    maxWidth: "90%",
                  }}
                />
              </div>
              <div>
                <FintooButton
                  className={`d-block me-0 ms-auto`}
                  onClick={() => {
                    convertBlob();
                    // props.onNext()
                  }}
                  title={"Next"}
                />
              </div>
            </div>
          </div>
        </div>
      </Row>
    </>
  );
};

export default UploadPan;
