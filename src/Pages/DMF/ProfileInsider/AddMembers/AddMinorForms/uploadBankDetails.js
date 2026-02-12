import style from "../style.module.css";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import UploadComponent from "../AddMemberComponents/UploadComponent";
import { useEffect, useState } from "react";
import commonEncode from "../../../../../commonEncode";
import {
  fetchData,
  fetchEncryptData,
  getMinorUserId,
  getUserId,
  memberId,
} from "../../../../../common_utilities";
import axios from "axios";
import { useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import FintooButton from "../../../../../components/HTML/FintooButton";

function UploadBankDetails(props) {
  const [imgSrc, setImgSrc] = useState("");
  const [preview, setPreview] = useState(false);
  const [oldPhoto, setOldPhoto] = useState({});
  const user_id =  getMinorUserId() ? getMinorUserId(): memberId();

  useEffect(() => {
  }, [preview]);

  const dispatch = useDispatch();

  useEffect(() => {
    loadInIt();
  }, []);

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
        (v) => v.doc_other_name == "Cancel Cheque"
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
    formdata.append("doc_type", commonEncode.encrypt("7"));
    formdata.append("doc_name", commonEncode.encrypt("Cancel Cheque"));
    var res = await axios({
      // url: DMF_UPLOADDOCUMENT_API_URL,
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
    <div className={`${style.addMinorSectionView}`}>
      <div className={`${style.addMinorSectionViewImg}`}>
        <img
          style={{ width: "100%" }}
          src={
            process.env.REACT_APP_STATIC_URL +
            "media/DMF/minorFlow/minorflowimg4.png"
          }
          alt=""
        />
      </div>
      <div className=" ">
        <div className={`${style.addMinorFormTitleContainer}`}>
          <div onClick={() => props.onPrevious()}>
            <IoChevronBackCircleOutline
              className={`${style.addMinorFormTitlebackBtn}`}
            />
          </div>

          <div className={`${style.addMinorFormTitle}`}>
            Upload Bank Details of Minor
          </div>
        </div>
        <div className={`${style.uploadContentContainer}`}>
          <div className={`${style.noteTextContent}`}>
            <span className={`${style.noteText}`}>Note:-</span> The bank account
            must be in the name of the minor and be under the same guardianship
            as mentioned in the account i.e. Guardian mentioned in bank account
            of minor and Fintoo account should match.
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
              "Upload a clear photo or scanned copy of cancelled cheque OR account passbook"
            }
          />
        </div>

        {/* <div style={{ display: Boolean(preview.url) ? "block" : "none" }}>
          <div className="fileContainer d-flex justify-content-center align-items-center img-preview-n">
            <span onClick={() => onRemoveUploaded()}>
              <MdDelete />
            </span>
            <img
              src={preview.url}
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
        </div> */}
        <div
          className="fintoo-top-border mt-4 pt-4"
          style={{ display: Boolean(preview) ? "block" : "none" }}
        >
          <div className={`${style.nextBtn}`} onClick={() => convertBlob()}>
            Next
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadBankDetails;
