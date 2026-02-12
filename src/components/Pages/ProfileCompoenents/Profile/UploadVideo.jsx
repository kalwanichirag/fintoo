import { useState, useEffect, useRef } from "react";
import "react-responsive-modal/styles.css";
import Link from "../../../MainComponents/Link";
import Videoimg from "../../../Assets/Add-Photo.svg";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import "../Fatca/style.css";
import Back from "../../../Assets/left-arrow.png";
import videoShoot from "../../../Assets/video-camera.png";
import { useRecordWebcam, CAMERA_STATUS } from "react-record-webcam";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import FintooButton from "../../../HTML/FintooButton";
import { FaCircle } from "react-icons/fa";
import FintooInlineLoader from "../../../FintooInlineLoader";
import axios from "axios";
import commonEncode from "../../../../commonEncode";
import {
  CheckSession,
  fetchData,
  fetchEncryptData,
  getUserId,
  loginRedirectGuest,
  memberId,
} from "../../../../common_utilities";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

const OPTIONS = {
  filename: "video-verification",
  fileType: "mp4",
  width: 460,
  height: 320,
};
function UploadVideo(props) {
  const recordWebcam = useRecordWebcam(OPTIONS);
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const dispatch = useDispatch();
  const timeRef = useRef(null);
  const user_id = memberId();
  const showBack = useSelector((state) => state.isBackVisible);
  const [oldPhoto, setOldPhoto] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mainData, setMainData] = useState({});
  const [statusData, setStatusData] = useState({});

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    loadInIt();
    // fetchUserData();
  }, []);

  // useEffect(() => {
  //  fetchUserData();
  // }, []);

  const loadInIt = async () => {
    try {
      setIsLoading(true);
      var payload = {
        url: '',
        method: "post",
        data: {
          user_id: memberId(),
        },
      };

      var response = await fetchEncryptData(payload);
      var photo =
        response.data.filter(
          (v) => v.doc_other_name == "Video Verification"
        )[0] || {};
      var pObj = {};
      if (Object.keys(photo).length) {
        pObj = { doc_id: photo.doc_id };
        var paylaod = {
          data: {
            user_id: memberId(),
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
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error("Error here ", e);
    }
  };

  // const fetchUserData = async () => {
  //   try {
  //     if (getUserId() == null) {
  //       loginRedirectGuest();
  //       return;
  //     }
  //     var payload = {
  //       url: DMF_DATAGATHERING_API_URL,
  //       method: "post",
  //       data: { user_id: "" + getUserId() },
  //     };
  //     var res = await fetchEncryptData(payload);
  //     setMainData(res.data);
  //     setStatusData(res.user_alldata_status);
  //     // localStorage.setItem("user", JSON.stringify(res.data));
  //     // var userData = localStorage.getItem('user');
  //   } catch (e) {}
  // };

  const fetchMail = async () => {
    var email = mainData.email;
    var pan = mainData.pan;
    var urlmail = {
      userdata: {
        to: SUPPORT_EMAIL,
      },
      subject: "Fintoo-KYC Documents are uploaded by user " + email + "  ",
      template: "kyc_upload_mail.html",
      contextvar: { email: email, pan: pan },
    };

    var data = commonEncode.encrypt(JSON.stringify(urlmail));
    var config = {
      method: "post",
      url: '',
      data: data,
    };

    var res = await axios(config);
    var response = commonEncode.decrypt(res.data);
    var rep_msg = response.data;
  };

  const videoToApi = async () => {
    const blob = await recordWebcam.getRecording();
    let file = new File([blob], "fileName.mp4", { type: "video/mp4" });
    //
    // props.onImageChange(file);
    let formdata = new FormData();
    formdata.append("doc_file", file);
    formdata.append("user_id", commonEncode.encrypt(user_id));
    formdata.append("doc_type", commonEncode.encrypt("147"));
    // formdata.append('no_enc_key', 'AAAA');
    formdata.append("doc_name", commonEncode.encrypt("Video Verification"));
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
        payload: { message: "Error!", type: "error" },
        autoClose: 3000,
      });
      // onRemoveUploaded();
    } else if (error_code == "100") {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Video added successfully!", type: "success" },
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    // // checksession();

    if (recordWebcam.status === "OPEN" && isRecording) {
      startCounter();
      recordWebcam.start();
      setTimeout(() => {
        clearInterval(timeRef.current);
        recordWebcam.stop();
      }, 6 * 1000);
    }
    if (recordWebcam.status === "PREVIEW") {
      videoToApi();
    }
  }, [recordWebcam, recordWebcam.status, isRecording]);

  const startCounter = () => {
    timeRef.current = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);
  };

  return (
    <Row className="reverse">
      <FintooInlineLoader isLoading={isLoading} />
      <div className="ProfileImg col-12 col-md-6">
        <div>
          <img
            src={process.env.REACT_APP_STATIC_URL + "media/DMF/Add-Photo.svg"}
            alt="Videoimg"
          />
        </div>
      </div>
      <div className="RightPanel col-12 col-md-6">
        <div className="rhl-inner">
          {showBack == true && (
            <FintooProfileBack
              title="Upload Video for Official Use"
              onClick={() => props.onPrevious()}
            />
          )}

          <p className="">Please record the video and upload it.</p>
          <p>Clear face on a plain background.</p>

          <div
            className="fn-video-record new-upload-bx"
            style={{
              display: recordWebcam.status == CAMERA_STATUS.INIT ? "" : "none",
            }}
          >
            <div>
              <div>
                <FintooInlineLoader isLoading={true} />
              </div>
            </div>
          </div>

          <div style={{ display: "url" in oldPhoto ? "block" : "none" }}>
            <div className="video-bx new-upload-bx ">
              {"url" in oldPhoto && (
                <video className="VideoShoot" controls>
                  <source src={oldPhoto.url} type="video/mp4"></source>
                </video>
              )}
              <div
                className="video-retake noselect"
                onClick={() => {
                  setOldPhoto({});
                  setSeconds(0);
                  recordWebcam.open();
                  setIsRecording(true);
                }}
              >
                <div className="video-retake-btn">
                  <div className="vd-span-icon">
                    <img
                     src={process.env.REACT_APP_STATIC_URL + "media/DMF/movie-clapper-open.png"}
                    />
                  </div>
                  <div className="vd-span-txt">Retake</div>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <FintooButton
                className={`d-block me-0 ms-auto`}
                onClick={() => {
                  props.onNext();
                  fetchMail();
                }}
                title={"Next"}
              />
            </div>
          </div>

          <div style={{ display: "url" in oldPhoto ? "none" : "block" }}>
            <div
              className="fn-video-record new-upload-bx "
              style={{
                display:
                  recordWebcam.status == CAMERA_STATUS.CLOSED ? "" : "none",
              }}
            >
              <div className="video-init-bx">
                <div className="">
                  <div
                    onClick={() => {
                      recordWebcam.open();
                    }}
                    disabled={recordWebcam.status === CAMERA_STATUS.RECORDING}
                  >
                    <img  src={process.env.REACT_APP_STATIC_URL + "media/DMF/video-camera.svg"} alt="" srcSet="" />
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "0.5rem",
                  }}
                >
                  <div>&nbsp;</div>
                  <div>Click to start recording video</div>
                </div>
              </div>
            </div>

            <div
              className="video-bx new-upload-bx"
              style={{
                display: `${
                  recordWebcam.status === CAMERA_STATUS.OPEN ||
                  recordWebcam.status === CAMERA_STATUS.RECORDING
                    ? "block"
                    : "none"
                }`,
              }}
            >
              <div className="position-relative">
                <video
                  className="VideoShoot"
                  ref={recordWebcam.webcamRef}
                  autoPlay
                  muted
                />
                {isRecording == false && (
                  <div
                    className="video-retake noselect"
                    onClick={() => {
                      setIsRecording(true);
                      recordWebcam.open();
                    }}
                  >
                    <div className="video-retake-btn">
                      <div className="vd-span-icon">
                      <img  src={process.env.REACT_APP_STATIC_URL + "media/DMF/movie-clapper-open.png"}  alt="" srcSet="" />
                      </div>
                      <div className="vd-span-txt">Start</div>
                    </div>
                  </div>
                )}
                <div className="video-countdown">
                  <div className="vd-record-icon-bx">
                    <FaCircle className="vd-record-icon" />
                  </div>
                  <div className="vd-record-txt">{`Recording... (${seconds}s)`}</div>
                </div>
              </div>
            </div>

            <div
              className="video-bx new-upload-bx"
              style={{
                display: `${
                  recordWebcam.status === CAMERA_STATUS.PREVIEW
                    ? "block"
                    : "none"
                }`,
              }}
            >
              <video
                className="VideoShoot"
                ref={recordWebcam.previewRef}
                style={{
                  display: `${
                    recordWebcam.status === CAMERA_STATUS.PREVIEW
                      ? "block"
                      : "none"
                  }`,
                }}
                controls
              />
              <div
                className="video-retake noselect"
                onClick={() => {
                  setSeconds(0);
                  recordWebcam.open();
                  setIsRecording(true);
                }}
              >
                <div className="video-retake-btn">
                  <div className="vd-span-icon">
                  <img  src={process.env.REACT_APP_STATIC_URL + "media/DMF/movie-clapper-open.png"}  alt="" srcSet="" />
                  </div>
                  <div className="vd-span-txt">Retake</div>
                </div>
              </div>
            </div>

            {recordWebcam.status === CAMERA_STATUS.PREVIEW && (
              <>
                <hr className="ProfileHr" />
                <div>
                  <FintooButton
                    className={`d-block me-0 ms-auto`}
                    onClick={() => props.onNext()}
                    title={"Next"}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <p>&nbsp;</p>
      </div>
    </Row>
  );
}

export default UploadVideo;
