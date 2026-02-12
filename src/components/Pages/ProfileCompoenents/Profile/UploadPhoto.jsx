import { useState, useEffect, useRef, useCallback } from "react";
import "react-responsive-modal/styles.css";
import Link from "../../../MainComponents/Link";
import Profile_1 from "../../../Assets/Add-Photo.svg";
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
import ImageCapture from "../Aadhar/FintooImageCapture";
import Back from "../../../Assets/left-arrow.png";
import Camera from "../../../Assets/camera.svg";
import UPload from "../../../Assets/file-upload.png";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import axios from "axios";
import commonEncode from "../../../../commonEncode";
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
import Webcam from "react-webcam";
import SweetAlert from "sweetalert-react";
import { useDispatch, useSelector } from "react-redux";
import ReactCrop from "../../../HTML/ReactCrop";

const UploadInput = styled("input")({
  display: "none",
});

const videoConstraints = {
  width: 720,
  height: 360,
};

const aspect = 16 / 9;
const scale = 1;

function UploadPhoto(props) {
  const webcamRef = useRef(null);
  const [validated, setValidated] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [isShown1, setIsShown1] = useState(false);
  const [showImgCapture, setShowImgCapture] = useState(false);
  const [uploadPanel, setUploadPanel] = useState(true);
  const [rotateValue, setRotateValue] = useState(0);
  const user_id = memberId();
  const inputFileUpload = useRef(null);
  const [crop, setCrop] = useState(undefined);
  const [imgSrc, setImgSrc] = useState("");
  const [completedCrop, setCompletedCrop] = useState(null);
  const [preview, setPreview] = useState(false);
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [isCaptureEnable, setCaptureEnable] = useState(false);
  const [oldPhoto, setOldPhoto] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const showBack = useSelector((state) => state.isBackVisible);
  const dispatch = useDispatch();

  const captureScreenshot = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCaptureEnable(false);
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  useEffect(() => {
    // // checksession();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    loadInIt();
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

      var photo =
        response.data.filter((v) => v.doc_other_name == "Photo")[0] || {};
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
    let file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
    //
    // props.onImageChange(file);
    let formdata = new FormData();
    formdata.append("doc_file", file);
    formdata.append("user_id", commonEncode.encrypt(user_id));
    formdata.append("doc_type", commonEncode.encrypt("143"));
    // formdata.append('no_enc_key', 'AAAA');
    formdata.append("doc_name", commonEncode.encrypt("Photo"));

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
          autoClose: 2500,
        },
      });
      onRemoveUploaded();
    } else if (error_code == "100") {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Image added successfully.",
          type: "success",
          autoClose: 2500,
        },
      });
      props.onNext();
    }
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
    setCaptureEnable(false);
    setUploadPanel(true);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
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

  return (
    <>
      <SweetAlert
        show={openConfirm}
        title="Delete photo"
        text="Are you sure?"
        onConfirm={() => {
          // setOldPhoto({});
          // setOpenConfirm(false);
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
            <img
              src={process.env.REACT_APP_STATIC_URL + "media/DMF/Add-Photo.svg"}
              alt=""
            />
          </div>
        </div>
        <div className=" RightPanel col-12 col-md-6">
          <div className="rhl-inner">
            {showBack == true && (
              <FintooProfileBack
                title="Upload Photo"
                onClick={() => props.onPrevious()}
              />
            )}
            <div>
              <p className="mb-0">
                Please submit your recent and clear photograph.
              </p>
              <p className="mb-0">
                Click or upload the photo in JPEG, JPG or PNG format.
              </p>
              <p>Clear face on a plain background.</p>

              <div style={{ display: "url" in oldPhoto ? "" : "none" }}>
                <div className="whitebg-rounded img-preview-n fileContainer">
                  <span
                    onClick={() => {
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
                <div
                  style={{ display: imgSrc.trim() == "" ? "block" : "none" }}
                >
                  <div style={{ display: isCaptureEnable ? "none" : "block" }}>
                    <UploadInput
                      onChange={(e) => {
                        onSelectFile(e);
                        setUploadPanel(false);
                      }}
                      accept="image/*"
                      id="inputFileUpload"
                      ref={inputFileUpload}
                      type="file"
                    />
                    <div className="dlc-bx-upload  px-5">
                      <div className="dlc-bx">
                        <div
                          className="pnf-img-bx"
                          role="button"
                          onClick={() => {
                            // window.open('https://uidai.gov.in/', 'name', 'width=600,height=400');
                            setCaptureEnable(true);
                            setUploadPanel(false);
                          }}
                        >
                          <img
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/camera.svg"
                            }
                          />
                          <p>Camera</p>
                        </div>
                        <div className="fnt-seperator">
                          <img
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/or-188.png"
                            }
                          />
                        </div>
                        <div className="pnf-img-bx" role="button">
                          <label htmlFor="inputFileUpload" role="button">
                            <img
                              src={
                                process.env.REACT_APP_STATIC_URL +
                                "media/DMF/file-upload.svg"
                              }
                            />
                            <p>Upload</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isCaptureEnable && (
                  <>
                    <div>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div className="pt-4">
                      <div className="d-flex justify-content-between">
                        <FintooButton
                          onClick={() => setCaptureEnable(false)}
                          title="Cancel"
                        />
                        <FintooButton
                          onClick={() => captureScreenshot()}
                          title="Capture"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  {showImgCapture && (
                    <ImageCapture
                      onCapture={(v) => {
                        const reader = new FileReader();
                        reader.addEventListener("load", () => {
                          setImgSrc(reader.result.toString() || "");
                          setShowImgCapture(false);
                        });
                        reader.readAsDataURL(v);
                      }}
                    />
                  )}
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

                  <div className="pt-4">
                    <FintooButton
                      className={`d-block me-0 ms-auto`}
                      onClick={() => convertBlob()}
                      title={"Next"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p>&nbsp;</p>
        </div>
      </Row>
    </>
  );
}

export default UploadPhoto;
