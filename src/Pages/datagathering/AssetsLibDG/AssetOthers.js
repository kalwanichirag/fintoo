import React, { useState, useEffect, useRef } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Select, { components } from "react-select";
import ReactDatePicker from "../../../components/HTML/ReactDatePicker/ReactDatePicker";
import FintooRadio2 from "../../../components/FintooRadio2";
import Switch from "react-switch";
import moment from "moment";
import Slider from "../../../components/HTML/Slider";
import DgRoundedButton from "../../../components/HTML/DgRoundedButton";
import DgDragDrop from "../../../components/HTML/DgDragDrop";
import DgDragDrop2 from "../../../components/HTML/DgDragDrop/DgDragDrop2";
import { apiCall } from "../../../common_utilities";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import FintooLoader from "../../../components/FintooLoader";
import SimpleReactValidator from "simple-react-validator";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { useDispatch } from "react-redux";
import {ScrollToTop} from "../ScrollToTop"
import { Buffer } from "buffer";
import { Modal } from "react-bootstrap";
import commonEncode from "../../../commonEncode";
import Uniquepannotfoundmodal from "./Uniquepannotfoundmodal";

function AssetOthers(props) {
  const session = props.session;
  const selectedOption = props.selectedOption;
  const selectedSubOption = props.selectedSubOption;
  const addForm = props.addForm;
  const simpleValidator = useRef(new SimpleReactValidator());
  const dispatch = useDispatch();
  const familyData = props.familyData;
  // Upload Document

  const [docPassword, setDocPassword] = useState("");
  const [dropFiles, setdropFiles] = useState([]);
  const [, setForceUpdate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showuniqueUANModal, setShowuniqueUANModal] = useState(false);
  const [pannumbers, setPanNumbers] = useState([]);
  const [familyecas, setFamilyEcas] = useState([]);
  const [memberdataid,setMemberDataId] = useState({})

  const ecashUploadDocument = async () => {
    try {
      var form = new FormData();
      form.append("ecash_type", "CAMS");
      form.append("ecash_passkey", docPassword);
      form.append("fp_user_id", parseInt(session["data"]["fp_user_id"]));
      form.append("fp_log_id", parseInt(session["data"]["fp_log_id"]));
      form.append("doc_user_id", parseInt(session["data"]["id"]));

      for (let i = 0; i < dropFiles.length; i++) {
        form.append(`file[${i}]`, dropFiles[i], dropFiles[i].name);
      }
      setIsLoading(true);
      var ecash_upload = await apiCall(
        '',
        form,
        false,
        false
      );

      if (ecash_upload["error_code"] == "100") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("Document uploaded successfully");
        getUnassignedAsset();
        setIsLoading(false);
        setdropFiles([]);
        setDocPassword("");
        setForceUpdate((v) => ++v);
        dispatch({ type: "RESET_DRAGZONE", payload: true });
      } else if (ecash_upload["error_code"] == "102") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(ecash_upload["data"]);
        setIsLoading(false);
        setdropFiles([]);
        setDocPassword("");
        setForceUpdate((v) => ++v);
        dispatch({ type: "RESET_DRAGZONE", payload: true });
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
        setdropFiles([]);
        setDocPassword("");
        setForceUpdate((v) => ++v);
        dispatch({ type: "RESET_DRAGZONE", payload: true });
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUnassignedAsset = async ()=>{
    // try{
    //   var payload ={"user_id":session["data"]["id"],"fp_log_id":session["data"]["fp_log_id"],"fp_user_id":session["data"]["fp_user_id"]}
    //   var unassigned_asset = await apiCall(
    //     ADVISORY_GET_UNASSIGNED_ASSET,
    //     payload,
    //     false,
    //     false
    //   );
    //   if (unassigned_asset["error_code"] == "100") {
    //       setPanNumbers(unassigned_asset.data)
    //       if (unassigned_asset.data != 'false'){
    //         setShowuniqueUANModal(true)
    //       }
    //       var response_pan = unassigned_asset.data
    //       var temp_member_id = 0
    //       var familyDetails = await apiCall(
    //         BASE_API_URL + "restapi/getfpfamilydata/" +
    //         "?parent_user_id=" +
    //         Buffer.from(commonEncode.encrypt((session["data"]["id"]).toString())).toString("base64") + '&fp_log_id='+Buffer.from(commonEncode.encrypt((session["data"]["fp_log_id"]).toString())).toString("base64")+
    //         "&web=1",
    //     )
    //     if (familyDetails.data != undefined) {
    //       setFamilyEcas(familyDetails.data)
          
    //       let url = ADVISORY_GET_FP_USER_DATA + '?user_id=' + btoa(commonEncode.encrypt((session["data"]["id"]).toString())) + '&fp_log_id=' + btoa(commonEncode.encrypt((session["data"]["fp_log_id"]).toString())) + '&fp_user_id=' + btoa(commonEncode.encrypt((session["data"]["fp_user_id"]).toString())) + "&web=1";

    //       let fpUserData = await apiCall(url, "", true, false);
    //       if (fpUserData.data.length > 0){
    //         if(familyDetails.data.length>0 && familyDetails.data != undefined){
    //           temp_member_id = familyDetails.data[0].id
    //         }
    //         else{
    //           setFamilyEcas([])
    //         }
    //       }
    //       else{
    //         setFamilyEcas([])
    //       }
    //     }
    //     var item = {}
    //     for (var pan = 0; pan < unassigned_asset.data.length; pan++) {
    //       item["familydata_ecas_" + response_pan[pan].asset_pan] = temp_member_id.toString();
    //     }
    //     setMemberDataId(item)
    //   }
    // }
    // catch(e){
    //   console.log(e)
    // }
  }

  const handleFilesSelected = (files) => {
    const dropFiles = Array.from(files).slice(0, 1);
    setdropFiles(dropFiles);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    setForceUpdate((v) => ++v);

    if (isFormValid) {
      setIsLoading(true);
      ecashUploadDocument();
      simpleValidator.current.hideMessages();
      setForceUpdate((v) => ++v);
      dispatch({ type: "RESET_DRAGZONE", payload: true });
    }
  };

  useEffect(() => {
    simpleValidator.current.hideMessages();
    setForceUpdate((v) => ++v);
  }, [selectedSubOption]);

  const showuniqueUANModalclose =()=>{
    setShowuniqueUANModal(false);
  }
  
  return (
    <div>
      {selectedOption == "Upload" && selectedSubOption == "CDSL" && (
        <form
          encType="multipart/form-data"
          method="post"
          action="http://localhost/fileupload.php"
        >
          <FintooLoader isLoading={isLoading} />
          <div className="col-md-10" value="CAMS">
            <h4>CDSL</h4>
            <p>
              Consolidated account statement (CAS) is a summary of your current
              stock holdings available at CDSL or NSDL depository. To download
              your CAS, follow the steps mentioned below based on your demat
              account depository. - For CDSL :
            </p>
            <ol>
              <li>
                Login to{" "}
                <a
                  target="_new"
                  className="custom_link"
                  href="https://www.cdslindia.com/CAS/LoginCAS.aspx"
                >
                  <u>CDSL</u>
                </a>{" "}
                website.
              </li>
              <li>Provide your PAN, date of birth and BO ID to log in.</li>
              <li>
                Download the latest available CAS by selecting the latest date
                range.
              </li>
            </ol>
            <div className="col-md-12">
              <p>
                <b>Note</b>: CDSL PDF can be uploaded one time a day ( Per PAN )
              </p>
              <p
                style={{
                  color: "red",
                }}
              >
                In the Equity share, the Purchase Price will be the same as the
                Current Price because in CDSL Report they do not mention
                Purchase price. If you know the Purchase price you can Edit it
                &amp; you can change it after uploading.
              </p>
            </div>
          </div>
          <div>
            <DgDragDrop2
              className="iconupload"
              value={dropFiles}
              onFilesSelected={handleFilesSelected}
            />
            {simpleValidator.current.message(
              "Password",
              dropFiles,
              "required",
              {
                messages: {
                  required: "Please select atleast one document to upload",
                },
              }
            )}
          </div>
          <div className="col-md-12  custom-input">
            <div className={`form-group mt-5 ${docPassword ? "inputData" : null} `}>
              <input type="password" id="pass_word" name="Password" value={docPassword}
                onChange={(e) => {
                  setDocPassword(e.target.value);
                }} required autoComplete="off" />
              <span class="highlight"></span>
              <span class="bar"></span>
              <label for="name">Password*</label>
            </div>
            {simpleValidator.current.message(
              "Password",
              docPassword,
              "required",
              { messages: { required: "Please enter the password" } }
            )}
          </div>
          <div className="row py-2">
            <div className=" text-center">
              <div>
                <div className="btn-container">
                  <div className="d-flex justify-content-center">
                    <Link to={process.env.PUBLIC_URL + "/datagathering/goals"}>
                      <div
                        className="previous-btn form-arrow d-flex align-items-center"
                        onClick={() => 
                          {
                            ScrollToTop();
                            setTab("tab1")}
                          }
                      >
                        <FaArrowLeft />
                        <span className="hover-text">&nbsp;Previous</span>
                      </div>
                    </Link>

                    {props.addForm && (
                      <button
                        onClick={(e) => handleUploadSubmit(e)}
                        className="default-btn gradient-btn save-btn"
                      >
                        Save & Add More
                      </button>
                    )}

                    <div
                      className="next-btn form-arrow d-flex align-items-center"
                      onClick={() =>
                        {
                          ScrollToTop();
                          props.setTab("tab2")}
                        }
                    >
                      <span className="hover-text" style={{ maxWidth: 100 }}>
                        Continue&nbsp;
                      </span>
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
      {selectedOption == "Upload" && selectedSubOption == "NSDL" && (
        <form
          encType="multipart/form-data"
          method="post"
          action="http://localhost/fileupload.php"
        >
          <FintooLoader isLoading={isLoading} />
          <div className="col-md-10" value="CAMS">
            <h4>NDSL</h4>
            <p>
              Consolidated account statement (CAS) is a summary of your current
              stock holdings available at CDSL or NSDL depository. To download
              your CAS, follow the steps mentioned below based on your demat
              account depository. - For NSDL :
            </p>
            <ol>
              <li>
                Login to{" "}
                <a
                  target="_new"
                  className="custom_link"
                  href="https://eservices.nsdl.com/"
                >
                  <u>NDSL</u>
                </a>{" "}
                website.
              </li>
              <li>
                Register using your DP ID, Client ID and registered mobile
                number.
              </li>
              <li>Authenticate using the OTP received on mobile.</li>
              <li>Set your login credentials and login to download CAS.</li>
            </ol>
            <div className="col-md-12">
              <p>
                <b>Note</b>: NSDL PDF can be uploaded one time a day ( Per PAN )
              </p>
              <p
                style={{
                  color: "red",
                }}
              >
                In the Equity share, the Purchase Price will be the same as the
                Current Price because in NSDL Report they do not mention
                Purchase price. If you know the Purchase price you can Edit it &
                you can change it after uploading.
              </p>
            </div>
          </div>
          <div>
            <DgDragDrop2
              className="iconupload"
              value={dropFiles}
              onFilesSelected={handleFilesSelected}
            />
            {simpleValidator.current.message(
              "Password",
              dropFiles,
              "required",
              {
                messages: {
                  required: "Please select atleast one document to upload",
                },
              }
            )}
          </div>
          <div className="col-md-12 mt-5 custom-input">
            <div className={`form-group ${docPassword ? "inputData" : null} `}>
              <input type="password" id="pass_word_2" name="Password" value={docPassword}
                onChange={(e) => {
                  setDocPassword(e.target.value);
                }} required autoComplete="off" />
              <span class="highlight"></span>
              <span class="bar"></span>
              <label for="name">Password*</label>
            </div>
            {simpleValidator.current.message(
              "Password",
              docPassword,
              "required",
              { messages: { required: "Please enter the password" } }
            )}
          </div>
          <div className="row py-2">
            <div className=" text-center">
              <div>
                <div className="btn-container">
                  <div className="d-flex justify-content-center">
                    <Link to={process.env.PUBLIC_URL + "/datagathering/goals"}>
                      <div
                        className="previous-btn form-arrow d-flex align-items-center"
                        onClick={() => setTab("tab1")}
                      >
                        <FaArrowLeft />
                        <span className="hover-text">&nbsp;Previous</span>
                      </div>
                    </Link>

                    {props.addForm && (
                      <button
                        onClick={(e) => handleUploadSubmit(e)}
                        className="default-btn gradient-btn save-btn"
                      >
                        Save & Add More
                      </button>
                    )}

                    <div
                      className="next-btn form-arrow d-flex align-items-center"
                      onClick={() => {
                        ScrollToTop();
                        props.setTab("tab2")
                      }}
                    >
                      <span className="hover-text" style={{ maxWidth: 100 }}>
                        Continue&nbsp;
                      </span>
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
      <Modal
        classNames={{
          modal: "RefreshModalpopup",
        }}
        show={showuniqueUANModal}
        showCloseIcon={false}
        onClose={() => () => { }}
        centered
        animationDuration={0}
      >
        <Uniquepannotfoundmodal showuniqueUANModalclose={showuniqueUANModalclose} pannumbers={pannumbers} familyecas={familyecas} familyData={familyData} memberdataid={memberdataid} session={session} />
      </Modal>
    </div>
  );
}

export default AssetOthers;
