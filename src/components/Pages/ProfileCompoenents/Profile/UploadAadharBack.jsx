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
import "../Fatca/style.css";
import Back from "../../../Assets/left-arrow.png";
import axios from "axios";
import commonEncode from "../../../../commonEncode";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckSession,
  fetchData,
  fetchEncryptData,
  getUserId,
  memberId,
} from "../../../../common_utilities";

import styled from "styled-components";

import FintooButton from "../../../HTML/FintooButton";
import { canvasPreview } from "../../../FintooCrop/canvasPreview";
import { MdDelete } from "react-icons/md";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import { Modal } from "react-bootstrap";
import ReactCrop from "../../../HTML/ReactCrop";

const UploadInput = styled("input")({
  display: "none",
});

const aspect = 16 / 9;
const scale = 1;

const UploadAadharBack = (props) => {
  const dispatch = useDispatch();
  const user_id = memberId();
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
  const [rotateValue, setRotateValue] = useState(0);
  const showBack = useSelector((state) => state.isBackVisible);
  const [oldPhoto, setOldPhoto] = useState({});

  useEffect(() => {
    // // checksession();
    loadInIt();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  const loadInIt = async () => {
    // try {
    //   var payload = {
    //     url: USER_GET_DOCS,
    //     method: "post",
    //     data: {
    //       user_id: getUserId(),
    //     },
    //   };

    //   var response = await fetchEncryptData(payload);

    //   var photo = {};

    //   if (props.documentName == "aadhar") {
    //     photo = response.data.filter(
    //       (v) => v.doc_other_name == "aadhar_card_back"
    //     )[0];
    //   }
    //   if (props.documentName == "passport") {
    //     photo = response.data.filter(
    //       (v) => v.doc_other_name == "passport_back"
    //     )[0];
    //   }

    //   if (props.documentName == "driving license") {
    //     photo = response.data.filter(
    //       (v) => v.doc_other_name == "driving_license_back"
    //     )[0];
    //   }
    //   if (photo === undefined) {
    //     photo = {};
    //   }

    //   var pObj = {};
    //   if (Object.keys(photo).length) {
    //     pObj = { doc_id: photo.doc_id };
    //     var paylaod = {
    //       data: {
    //         user_id: getUserId(),
    //         file_name: photo.doc_name,
    //       },
    //       url: '',
    //       method: "post",
    //     };
    //     var response = await fetchData(paylaod);

    //     if ("data" in response && "file_url" in response.data) {
    //       pObj = { ...pObj, url: response.data.file_url };
    //       setOldPhoto({ ...pObj });
    //     }
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
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
    // props.onImageSelect();
    const { width, height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          // You don't need to pass a complete crop into
          // makeAspectCrop or centerCrop.
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
    // let file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
    // //
    // // props.onImageChange(file);
    // let formdata = new FormData();
    // formdata.append("doc_file", file);
    // formdata.append("user_id", commonEncode.encrypt(user_id));
    // formdata.append("doc_type", commonEncode.encrypt("158"));
    // // formdata.append('no_enc_key', 'AAAA');
    // formdata.append(
    //   "doc_name",
    //   commonEncode.encrypt(props.documentName + "_back")
    // );
    // var res = await axios({
    //   url: DMF_BASE_URL + "api/document/adddocument",
    //   method: "POST",
    //   data: formdata,
    // });
    // let response = commonEncode.decrypt(res.data);
    // let responseobj = JSON.parse(response);
    // let error_code = responseobj.error_code;
    // if (error_code == "102") {
    //   dispatch({
    //     type: "RENDER_TOAST",
    //     payload: {
    //       message: responseobj.message,
    //       type: "error",
    //       autoClose: 3000,
    //     },
    //   });
    //   onRemoveUploaded();
    // } else if (error_code == "100") {
    //   dispatch({
    //     type: "RENDER_TOAST",
    //     payload: {
    //       message: responseobj.message,
    //       type: "success",
    //       autoClose: 3000,
    //     },
    //   });
    //   props.onNext();
    // }
  };

  const convertBlob = () => {
    fetch(imgSrc)
      .then((res) => res.blob())
      .then(async (blob) => {
        convertBase(blob);
      });
  };

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

  return (
    <>
      <Row className="reverse">
        <Col className="ProfileImg p-2">
          <div>
            <img
              src={
                process.env.REACT_APP_STATIC_URL +
                "media/DMF/07_Upload_aadhar.svg"
              }
              alt=""
            />
          </div>
        </Col>
        <Col
          className="p-2 RightPanel"
          style={{
            marginTop: "3rem",
          }}
        >
          <div className="rhl-inner">
            <FintooProfileBack
              title={`Upload ${props.documentName}: Back`}
              onClick={() => {
                props.onPrevious("UploadAadharFront");
              }}
            />

            <p className="">
              {/* Please upload a clear photograph or a scanned copy of the back side of your {props.documentName} in JPEG, JPG or PNG format. */}
              {props.documentName === "aadhar" &&
                "Please upload a clear photograph or a scanned copy of the back side of your aadhar in JPEG, JPG or PNG format."}
              {props.documentName === "passport" &&
                "Please upload a clear photograph or a scanned copy of the last page of your passport in JPEG, JPG or PNG format."}
              {props.documentName === "driving license" &&
                "Please upload a clear photograph or a scanned copy of the back side of your driving license in JPEG, JPG or PNG format."}
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
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/file-upload.svg"
                          }
                          alt="file-upload"
                        />
                        <p>Upload</p>
                      </label>
                    </div>
                  </div>
                </div>
                <div
                  className="sample-check-txt pointer"
                  onClick={() => setShowModal(true)}
                >
                  {" "}
                  <img
                    src={
                      process.env.REACT_APP_STATIC_URL + "media/DMF/info.png"
                    }
                  />
                  <h3>&nbsp;Check how to upload</h3>
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
                    inputFileUpload.current.value = "";
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
                  }}
                  title={"Next"}
                />
              </div>
            </div>
          </div>
          <p>&nbsp;</p>
        </Col>
      </Row>

      <Modal
        size="lg"
        centered
        show={showModal}
        className="profile-popups document-popup"
        onHide={() => {
          setShowModal(false);
        }}
      >
        {/* <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">Passport front</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          {props?.documentName.toLowerCase() === "passport" && (
            <div className="modal-body-box">
              <h2 className="pt-0 pb-0 text-center">Passport Back</h2>
              <div className="pt-3 pb-3">
                <div className="img-box9 ">
                  <img
                    className="img-fluid"
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/DMF/sample_passport_back.jpg"
                    }
                  />
                </div>
              </div>
              <h3 className="pt-2 pb-0 text-center ">
                This is just the sample image
              </h3>
            </div>
          )}
          {props?.documentName.toLowerCase() === "aadhar" && (
            <div className="modal-body-box">
              <h2 className="pt-0 pb-0 text-center">Aadhar Front</h2>
              <div className="pt-3 pb-3">
                <div className="img-box9 ">
                  <img
                    className="img-fluid"
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/DMF/sample_passport_back.jpg"
                    }
                  />
                </div>
              </div>
              <h3 className="pt-2 pb-0 text-center ">
                This is just the sample image
              </h3>
            </div>
          )}
          {props?.documentName.toLowerCase() === "driving license" && (
            <div className="modal-body-box">
              <h2 className="pt-0 pb-0 text-center">Driving License Front</h2>
              <div className="pt-3 pb-3">
                <div className="img-box9 ">
                  <img
                    className="img-fluid"
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/DMF/sample_passport_back.jpg"
                    }
                  />
                </div>
              </div>
              <h3 className="pt-2 pb-0 text-center ">
                This is just the sample image
              </h3>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UploadAadharBack;
