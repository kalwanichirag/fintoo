import styled from "styled-components";

import style from "../style.module.css";
import { useEffect, useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import ReactCrop from "../../../../../components/HTML/ReactCrop";
import SweetAlert from "sweetalert-react";

const UploadInput = styled("input")({
  display: "none",
});

function UploadComponent({
  imgSrc,
  setImgSrc,
  preview,
  setPreview,
  oldPhoto,
  setOldPhoto,
  deleteOldPhoto,
  uploadTxt,
}) {
  useEffect(() => {
  }, [preview, oldPhoto]);

  const [crop, setCrop] = useState({
    unit: "%", // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const showBack = useSelector((state) => state.isBackVisible);
  const [rotateValue, setRotateValue] = useState(0);
  //   const [oldPhoto, setOldPhoto] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);

  const dispatch = useDispatch();

  const inputFileUpload = useRef(null);

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

  // const convertBase = async (blob) => {
  //     let file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
  //     let formdata = new FormData();
  //     formdata.append("doc_file", file);
  //     formdata.append("user_id", commonEncode.encrypt(getUserId()));
  //     formdata.append("doc_type", commonEncode.encrypt("142"));
  //     formdata.append("doc_name", commonEncode.encrypt("PAN Card"));
  //     var res = await axios({
  //         url: DMF_UPLOADDOCUMENT_API_URL,
  //         method: "POST",
  //         data: formdata,
  //     });
  //     let response = commonEncode.decrypt(res.data);
  //     let responseobj = JSON.parse(response);
  //     let error_code = responseobj.error_code;

  //     if (error_code == "102") {
  //         dispatch({
  //             type: "RENDER_TOAST",
  //             payload: {
  //                 message: responseobj.message,
  //                 type: "error",
  //                 autoClose: 3000,
  //             },
  //         });
  //     } else if (error_code == "100") {
  //         dispatch({
  //             type: "RENDER_TOAST",
  //             payload: {
  //                 message: responseobj.message,
  //                 type: "success",
  //                 autoClose: 3000,
  //             },
  //         });
  //         props.onNext();
  //     }
  // };

  // const convertBlob = () => {

  //     fetch(imgSrc)
  //         .then(res => res.blob())
  //         .then(async blob => {
  //             convertBase(blob);
  //         });
  // }

  const onRemoveUploaded = () => {
    inputFileUpload.current.value = "";
    setImgSrc("");
    setPreview(false);
    setOldPhoto({});
  };

  //   const deleteOldPhoto = async () => {
  //     try {
  //       var payload = {
  //         url: DOCS_DELETE_FILE,
  //         data: {
  //           document_id: "" + oldPhoto.doc_id,
  //           user_id: getUserId(),
  //         },
  //         method: "post",
  //       };
  //       var response = await fetchData(payload);

  //       setOldPhoto({});
  //       setOpenConfirm(false);
  //       dispatch({
  //         type: "RENDER_TOAST",
  //         payload: { message: response.message, type: "success" },
  //       });
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };

  return (
    <div>
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
      <div>
        {/* <div style={{ display: "url" in oldPhoto ? "" : "none" }}>
          <div className="img-preview-n">
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
        </div> */}
        {/* <div style={{ display:"url" in oldPhoto ? "none" : "" }}> */}

        <div style={{ display: !preview ? "" : "none" }}>
          <div style={{ display: imgSrc.trim() == "" ? "block" : "none" }}>
            <UploadInput
              onChange={(e) => onSelectFile(e)}
              accept="image/*"
              id="inputFileUpload"
              ref={inputFileUpload}
              type="file"
            />

            <div className={`${style.uploadContainer}`} role="button">
              <label htmlFor="inputFileUpload" role="button">
                <img
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/DMF/file-upload.svg"
                  }
                />
                <p className={`${style.uploadText}`}>{uploadTxt}</p>
              </label>
            </div>
          </div>
        </div>
        <div
          className={`${
            Boolean(preview) == false && imgSrc.trim() != "" ? "" : "fakeHide"
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
            <span
              onClick={() => {
                if (!imgSrc) {
                  deleteOldPhoto();
                } else {
                  onRemoveUploaded();
                }
              }}
            >
              <MdDelete />
            </span>
            <img
              //   src={imgSrc}
              src={oldPhoto?.url ? oldPhoto.url : imgSrc}
              style={{
                // border: '1px solid black',
                objectFit: "contain",
                maxHeight: "270px",
                maxWidth: "90%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadComponent;
