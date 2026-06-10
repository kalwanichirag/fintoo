import { useState, useEffect, useRef } from "react";
import "react-responsive-modal/styles.css";
import { Row, Col } from "react-bootstrap";
import "../Fatca/style.css";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import FintooButton from "../../../HTML/FintooButton";
import "react-image-crop/dist/ReactCrop.css";
import commonEncode from "../../../../commonEncode";
import { ToastContainer } from "react-toastify";
import {
  getItemLocal,
  getUserId,
  base64ToBlob
} from "../../../../common_utilities";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import SweetAlert from "sweetalert-react/lib/SweetAlert";

import { canvasPreview } from "../../../FintooCrop/canvasPreview";

import { MdDelete } from "react-icons/md";

import ReactCrop from "../../../HTML/ReactCrop";
import { DeleteDocumentApi, UploadDocumentApi } from "../../../../FrappeIntegration-Services/services/financial-planning-api/document";
import { DATA_BELONGS_TO } from "../../../../constants";
import { deteleBankDetails, fetchUserProfileDetails } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { getUserBankDetails } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";

const UploadInput = styled("input")({
  display: "none",
});
const aspect = 16 / 9;

function BankCheque(props) {
  const user_id = getUserId();
  const bank_id = getItemLocal("YmFua19pZA==")
  const imgRef = useRef(null);
  const inputFileUpload = useRef(null);
  const dispatch = useDispatch();
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
  const showBack = useSelector((state) => state.isBackVisible);
  const [openConfirm, setOpenConfirm] = useState(false);

  const chequeNameRef = useRef();
  const [oldPhoto, setOldPhoto] = useState({});

  const convertUrlToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const blob = await response.blob();

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Base64 string
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
      if (data?.cancel_check_doc_url) {
        handleConvert(data?.cancel_check_doc_url);
        setOldPhoto({
          url: data.cancel_check_doc_url,
          doc_id: data.cancel_check_doc_id || null,
        });
      }
    } catch (e) {
      console.error("Error fetching user details:", e);
    }
  };

  useEffect(() => {
    //getbankdetails();
    GetUserDetails();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (completedCrop != null) {
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
    }
  }, [completedCrop]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  const [showModal, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const navigate = () => {
    navigate("/ConfirmBank");
  };

  const getbankdetails = async () => {
    var payload = { user_id: user_id, bank_id: bank_id };
    try {

      var response = await getUserBankDetails(payload);

      chequeNameRef.current = response.data[0]?.bank_cancel_cheque;
      // loadDoc();
    } catch (e) {
      console.log("CATCH -- ", e);
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

  const deleteBank = async () => {

    var bank_id = commonEncode.decrypt(localStorage.getItem("YmFua19pZA=="));
    var payload = {
      bank_user_id: getUserId(),
      bank_id: bank_id
    }

    var response = await deteleBankDetails(payload);

    let status_code = response.error_code;

    if (status_code == 200) {
      localStorage.removeItem("bankDetails");
      localStorage.removeItem("sendData");
      props.onPrevious("Bank");
    }
  };

  const convertBase = async () => {
    const mimeType = "image/jpeg";
    const blob = base64ToBlob(imgSrc, mimeType);

    let file = new File([blob], "fileName.jpg", { type: mimeType });

    let formdata = new FormData();
    formdata.append('user_document_user_id', getUserId());
    formdata.append("document_files", file);
    formdata.append("document_cat_uuid", "cancel_cheque_direct");
    formdata.append("user_document_belongs_to", DATA_BELONGS_TO);

    var response = await UploadDocumentApi(formdata);
    if (response.status_code == "200" || response.status_code == 200) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Cheque Leaf uploaded successfully",
          type: "success",
          autoClose: 3500,
        },
      });

      props.onNext();
    } else {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: response.message,
          type: "error",
          autoClose: 3500,
        },
      });
    }
  };

  const convertBlob = () => {
    convertBase();
  };

  const onRemoveUploaded = () => {
    setImgSrc("");
    setPreview(false);
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
      <ToastContainer limit={1} />
      <Row className="reverse">
        <div className="ProfileImg col-12 col-md-6 ">
          <div>
            <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/06_banking_app.svg"} alt="" />
          </div>
        </div>
        <div className=" RightPanel col-12 col-md-6">
          <div className="rhl-inner">
            {showBack == true && (
              <FintooProfileBack
                title="Upload Bank Details"
                onClick={() => {
                  props.onPrevious("Bank");
                }}
              />
            )}

            <p className="">
              Upload a clear photograph or a scanned copy of your cheque leaf in
              JPEG, JPG or PNG format.
            </p>
            <div className="VerifyDetails">
              <label className="LabelName form-label">Upload Cheque Leaf</label>

              <div className="">
                <Col className=" ">
                  <div
                    style={{ display: oldPhoto?.url ? "" : "none" }}
                  >
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


                  <div style={{ display: oldPhoto?.url ? "none" : "" }}>
                    <div
                      style={{ display: imgSrc.trim() == "" ? "block" : "none" }}
                    >
                      <UploadInput
                        onChange={(e) => onSelectFile(e)}
                        accept="image/*"
                        id="inputFileUpload"
                        ref={inputFileUpload}
                        type="file"
                        name="fileUploadHere"
                      />
                      <div className="dlc-bx-upload px-0 px-md-5">
                        <div className="dlc-bx">
                          <div className="pnf-img-bx" role="button">
                            <label htmlFor="inputFileUpload" role="button">
                              <img
                                src={process.env.REACT_APP_STATIC_URL + "media/DMF/file-upload.png"}
                                alt="file-upload"
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
                          onCrop={(v) => {
                            setImgSrc(v);
                            setPreview(true);
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

                </Col>
              </div>
            </div>
            <br />
          </div>
        </div>
      </Row>
    </>
  );
}

export default BankCheque;
