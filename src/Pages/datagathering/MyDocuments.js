import { useState, useRef } from "react";
import { useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Row, Modal } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import DatagatherLayout from "../../components/Layout/Datagather";
import DgDragDrop from "../../components/HTML/DgDragDrop";
import Select from "react-select";
import { Link, useLocation } from "react-router-dom";
import { apiCall, getItemLocal, getUserId, setFplogid, getFpLogId, getParentUserId } from "../../common_utilities";
import SimpleReactValidator from "simple-react-validator";
import commonEncode from "../../commonEncode";
import { setBackgroundDivImage } from "../../common_utilities";
import { toast } from "react-toastify";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { useDispatch } from "react-redux";
import FintooLoader from "../../components/FintooLoader";
import customStyles from "../../components/CustomStyles";
import { ScrollToTop } from "./ScrollToTop"
import { DATA_BELONGS_TO, imagePath } from "../../constants";
import { DeleteDocumentApi, GetDocType, GetDocumentDetails, UploadDocumentApi } from "../../FrappeIntegration-Services/services/financial-planning-api/document";

const MyDocuments = () => {

  const dispatch = useDispatch();
  const [tab, setTab] = useState("tab1");
  const [show, setShow] = useState(false);
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState("");
  const cntref = useRef(null);
  const scrollTodocumentRef = () => {
    cntref.current.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    document.body.classList.add("dg-layout");
  
    const interval = setInterval(() => {
      const bgDoc = document.getElementById("bg-Doc");
      if (bgDoc) {
        bgDoc.style.background = `url(${imagePath}/static/media/DG/bg/document.svg) no-repeat right top`;
        clearInterval(interval);
        setBackgroundDivImage();
      }
    }, 50);
  
    return () => {
      clearInterval(interval);
      document.body.classList.remove("dg-layout");
    };
  }, []);
  
  
  useEffect(() => {
    setTimeout(() => {
      setCurrentUrl(location.pathname);
    }, 100);
  }, [location]);
  useEffect(() => {
    document.body.classList.add("dg-layout");
    return () => {
      document.body.classList.remove("rp-layout");
    };
  }, []);

  // const customStyles = {
  //   option: (base, { data, isDisabled, isFocused, isSelected }) => {
  //     return {
  //       ...base,
  //       backgroundColor: isFocused ? "#ffff" : "#042b62",
  //       color: isFocused ? "#042b62" : "#fff",
  //       cursor: "pointer",
  //     };

  //   },
  //   menuList: (base) => ({
  //     ...base,
  //     height: "100px",
  //     overflowY: 'scroll',
  //     scrollBehavior: 'smooth',
  //     "::-webkit-scrollbar": {
  //       width: "4px",
  //       height: "0px",
  //     },
  //     "::-webkit-scrollbar-track": {
  //       background: "#fff"
  //     },
  //     "::-webkit-scrollbar-thumb": {
  //       background: "#042b62"
  //     },
  //     "::-webkit-scrollbar-thumb:hover": {
  //       background: "#555"
  //     }
  //   })
  // };

  // Declaring the use states

  const [documentData, setDocumentData] = useState("");
  const [documentName, setdocumentName] = useState("");
  const [docRemarks, setDocRemarks] = useState("");
  const [session, setSession] = useState('');
  const [documentType, setDocumentType] = useState(null);
  const [options, setOptions] = useState([]);
  const [dropFiles, setdropFiles] = useState([]);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [docId, setDocId] = useState("");
  const [docName, setDocName] = useState("");
  const [, forceUpdate] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Declaring the check session api in use effect to run it as soon as the my documents tab is clicked

  useEffect(() => {
    setIsLoading(true)
    getdoctype();
    getdocuments();
  }, []);

  // Declaring the APIs required

  const getdocuments = async () => {

    var res_doc = await GetDocumentDetails(getParentUserId(), DATA_BELONGS_TO);

    if (res_doc["status_code"] == "200") {
      setIsLoading(false)

      setDocumentData(res_doc.data)
      setDocRemarks("");
      getknowyourstatus();
    }
    else {
      setIsLoading(false)
    }
  }

  const checkprofilestatus = async () => {
    let session_data = session
    try {
      var pfs_data = {
        user_id: session_data["data"]["user_details"]["user_id"],
        fp_log_id: session_data["data"]["user_details"]["fp_log_id"],
        web: 1
      }

      var payload_pfs_data = commonEncode.encrypt(JSON.stringify(pfs_data));
      var config_pfs = await apiCall(
        '',
        payload_pfs_data,
        false,
        false
      );

      var res_pfs = JSON.parse(commonEncode.decrypt(config_pfs));
    }
    catch {
      (e) => {
        console.log("Error", e)
      }
    }
  }

  const getknowyourstatus = async () => {

    let session_data = session
    try {
      var gtys_data = {
        fp_log_id: session_data["data"]["user_details"]["fp_log_id"],
        user_id: session_data["data"]["user_details"]["user_id"],
        web: 1,
        data_belongs_to: DATA_BELONGS_TO
      }

      var payload_gtys_data = commonEncode.encrypt(JSON.stringify(gtys_data));
      var config_gtys = await apiCall(
        ADVISORY_GET_KNOW_YOUR_STATUS_API_URL,
        payload_gtys_data,
        false,
        false
      );

      var res_gtys = JSON.parse(commonEncode.decrypt(config_gtys));
      if (res_gtys["error_code"] == "100") {
        checkprofilestatus();
      }
      else {
        console.log("Error");
      }
    }
    catch {
      (e) => {
        console.log("Error", e)
      }
    }
  }

  // const getdocuments = async () => {
  //   let session_data = session
  //   try {
  //     var doc_data = {
  //       user_id: session_data["data"]["id"],
  //       fp_log_id: session_data["data"]["user_details"]["fp_log_id"]
  //     }

  //     var payload_doc_data = commonEncode.encrypt(JSON.stringify(doc_data));

  //     var config_doc = await apiCall(
  //       ADVISORY_GET_DOCUMENTS_API,
  //       payload_doc_data,
  //       false,
  //       false
  //     );

  //     var res_doc = JSON.parse(commonEncode.decrypt(config_doc));

  //     if (res_doc["error_code"] == "100" || res_doc["error_code"] == "103") {
  //       setDocumentData(res_doc.data)
  //       setDocRemarks("");
  //       getknowyourstatus();
  //     }
  //     else {
  //       console.log("Error");
  //     }
  //   }
  //   catch {
  //     (e) => {
  //       console.log("Error", e)
  //     }
  //   }
  // }


  const deleteDoc = async (doc_id, doc_name) => {
   
    try {
      var doc_delete = {
        user_id: getParentUserId(),
        user_document_id: doc_id
      };
  
      var res_doc_del = await DeleteDocumentApi(doc_delete);
  
      simpleValidator.current.hideMessages();
  
      if (res_doc_del["status_code"] == "200") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(" Document - " + doc_name + " deleted successfully");

        setDocumentData(prevDocs =>
          prevDocs.filter(doc => doc.user_document_id !== doc_id)
        );
  
        setIsLoading(false);
        setShow(false);
        setDocRemarks("");
        setdocumentName("");
        setDocumentType(null);
        setdropFiles([]);
        dispatch({ type: 'RESET_DRAGZONE', payload: true });

        checkprofilestatus();
        getdocuments();
      } else {
        console.log("Error");
        setIsLoading(false);
      }
    } catch (e) {
      console.log("Error", e);
    }
  };
  

  const getdoctype = async () => {
    try {
      const response = await GetDocType();
      if (response.status_code == "200") {
        const options = response?.data.map(({ document_uuid, document_name }) => ({
          value: document_uuid,
          label: document_name,
        }));
        setOptions(options);
        simpleValidator.current.hideMessages();
      }
      else {
        setOptions([]);
      }
    } catch {
      (e) => {
        console.log("Error", e)
      }
    }
  };

  const adddocument = async () => {
    try {
      setIsLoading(true)
      var form = new FormData();
      form.append('user_document_user_id', getParentUserId());
      form.append('document_cat_uuid', documentType["value"]);
      if (docRemarks) {
        form.append('user_document_remarks', docRemarks);
      }
      form.append('user_document_belongs_to', DATA_BELONGS_TO);

      dropFiles.forEach(file => {
        form.append("document_files", file, file.name);
      });


      // Send the form
      const config_add = await UploadDocumentApi(form);
      simpleValidator.current.hideMessages();
      forceUpdate(1);
      setDocRemarks("");
      setdocumentName("");
      setDocumentType(null);
      setdropFiles([]);
      dispatch({ type: 'RESET_DRAGZONE', payload: true });

      if (config_add["status_code"] == "200") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(" Document uploaded successfully");
        setIsLoading(false)
        checkprofilestatus();
        getdocuments();
        setDocRemarks("");
      }
      else {
        setIsLoading(false)
      }
    }
    catch {
      (e) => {
        console.log("Error", e)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    scrollTodocumentRef();
    forceUpdate(2);

    if (isFormValid) {
      adddocument();
      setIsLoading(true)
    }
  };

  const handleFilesSelected = (files) => {
    const dropFile = Array.from(files).slice(0, 5); // max 5 files
    setdropFiles(dropFile);  // ✅ replace with flat array, not push
  };

  function encodefilter(value) {
    // -- appending 00 as encryption
    var text = '00' + value
    text = btoa(text);
    return text;
  }

  const handleClose = (type) => {
    if (type == "yes") {
      deleteDoc(docId, docName)
      setIsLoading(true)
    }
    else {
      setShow(false);
    }
  }

  const handleShow = () => setShow(true);

  const handleFileChanges = (doc_id, doc_name) => {
    setDocId(doc_id)
    setDocName(doc_name)
  }


  return (
    <DatagatherLayout>
      <div className="DguploadDoc">
        <FintooLoader isLoading={isLoading} />
        <div className="background-div">
          <div className={`bg ${currentUrl.indexOf("datagathering/my-document") > -1
            ? "active"
            : ""
            }`} id="bg-Doc"></div>
        </div>
        <div className="white-box">
          <div>
            <div className={tab == "tab1" ? "d-block" : "d-none"}>
              <div className="row">
                <div className="col-md-10">
                  <div className="inner-box">
                    <div className="upload-files">
                      <h4
                        className="title text-center"
                        style={{
                          fontWight: "600",
                        }}
                      >
                        DOCUMENT LIBRARY
                      </h4>
                      <form
                        name="mydocument"
                        id="mydocument"
                        // onSubmit="return false;"
                        className="upload-form"
                      >
                        <div className="container mt-4">
                          <div className="row align-items-center">
                            <div className="col-md-12">
                              <p style={{ fontSize: 14 }}>
                                The document library is a collection of your uploaded files that are linked to your plan. A "document" can be anything from an account statement to a policy contract.
                              </p>
                            </div>
                            <div className="col-md-6">
                              <div className="material select">
                                <Select
                                  classNamePrefix="sortSelect"
                                  placeholder="Document Type*"
                                  isSearchable={false}
                                  styles={customStyles}
                                  value={documentType}
                                  onChange={setDocumentType}
                                  options={options}
                                  required
                                />


                                {/* <span
                                  tabIndex={0}
                                  id="document_type-button"
                                  role="combobox"
                                  aria-expanded="false"
                                  aria-autocomplete="list"
                                  aria-owns="document_type-menu"
                                  aria-haspopup="true"
                                  className="ui-selectmenu-button ui-selectmenu-button-closed ui-corner-all ui-button ui-widget"
                                >
                                  <span className="ui-selectmenu-icon ui-icon ui-icon-triangle-1-s" />
                                  <span className="ui-selectmenu-text">
                                    &nbsp;
                                  </span>
                                </span>
                                <span className="bar" /> */}
                              </div>
                              <span>{simpleValidator.current.message('documentType', documentType, 'required')}</span>
                            </div>
                            <div ref={cntref} className="col-md-6 custom-input" style={{ paddingTop: "17px" }} >
                              <div className={`position-relative form-group w-100 ${documentName ? "inputData" : null}`}>
                                <input type="text" maxLength={25}
                                  className="required DocName"
                                  defaultValue=""
                                  value={documentName}
                                  onChange={(e) => {
                                    setdocumentName(e.target.value);
                                  }} autoComplete="off" />
                                <span class="highlight"></span>
                                <span class="bar"></span>
                                <label for="name">Document Name*</label>
                              </div>
                              {/* <span className="bar" /> */}
                              <div id="DocName">{simpleValidator.current.message('documentName', documentName, 'required|min:3|max:25', { message: { required: 'Please enter the document name' } })}</div>
                              {/* 
                              <span
                                id="documentNameErrorMsg"
                                className="error-msg"
                              /> */}
                            </div>

                            <p className="py-4" style={{ color: "#F0806D", fontSize: 14 }} >Upload Instructions: The maximum size of your document must be 5 MB and it should be in the following formats: PDF, Word, Excel, text, or images (.gif. jpg, .tiff, .png ). Do not upload more than 5 files at a time.</p>

                            <div className="col-md-12">
                              <DgDragDrop className="iconupload" value={dropFiles} onFilesSelected={handleFilesSelected}
                              />
                              <p className="mb-5">{simpleValidator.current.message('dropFiles', dropFiles, 'required')}</p>
                            </div>

                            <div className="col-md-12 mt-2">
                              <div className="row">
                                <div className="col-12 custom-input">
                                  <div className={`form-group mt-3 ${docRemarks ? "inputData" : ""}`}>
                                    <input value={docRemarks}
                                      type="text"
                                      // placeholder="*"
                                      className="shadow-none"
                                      maxLength={100}
                                      onChange={(e) => {
                                        setDocRemarks(e.target.value);
                                      }}
                                      autoComplete="off" />
                                    <span class="highlight"></span>
                                    <span class="bar"></span>
                                    <label for="name">Remarks (Max 100 characters)</label>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row text-center">
                            <div className="col-md-12">
                              <button
                                className="default-btn gradient-btn save-btn"
                                onClick={(e) => handleSubmit(e)}>

                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="mt-5">
                    <span style={{ fontWeight: "bold" }}>
                      UPLOADED DOCUMENTS&nbsp;&nbsp;
                    </span>
                    <span className="info-hover-left-box">
                      <span className="icon">
                        <img
                          alt="More information"
                          src={imagePath + '/static/media/more_information.svg'}
                        />
                      </span>
                      <span className="msg">
                        <p style={{ fontWeight: "bold" }}>
                          Your Data is protected by Fintoo
                        </p>
                        <li>We are SEBI Registered Investment advisor</li>
                        <li>
                          We are hosted on Amazon’s Secured private network{" "}
                        </li>
                        <li>
                          Strong access controls with OTP &amp; Password based
                          login{" "}
                        </li>
                        <li>
                          Stringent Privacy Policy. Fintoo never discloses your
                          data to third parties
                        </li>
                        <li>Our data Security is audited regularly </li>
                      </span>
                    </span>
                  </div>
                  <div className="inner-box">
                    <div className="table-responsive">
                      <table className="bgStyleTable uploadFileTable">
                        <tbody>
                          <tr>
                            <th>ID</th>
                            <th>File Name</th>
                            <th>Remark</th>
                            <th>Type</th>
                            <th>Uploaded Date</th>
                            <th>Download</th>
                            <th>Delete</th>
                          </tr>
                          {documentData.length === 0 ? (
                            <tr>
                              <td colSpan="8" style={{ textAlign: "center" }}>
                                No document available.
                              </td>
                            </tr>
                          ) : (
                            documentData.map((doc, index) => (

                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{doc.user_document_name}</td>
                                <td>{doc.user_document_remarks}</td>
                                <td>{doc.document_cat_name}</td>
                                <td>{`${doc.creation?.slice(8, 10)}-${doc.creation?.slice(5, 7)}-${doc.creation?.slice(0, 4)}`}</td>
                                <td style={{ textAlign: 'center' }}>
                                  <a
                                    href={doc?.document_file_url}
                                    download={doc?.user_document_name}
                                    target="_self"
                                  >
                                    <img
                                      alt="Download"
                                      src={`${process.env.REACT_APP_STATIC_URL}/media/download.svg`}
                                    />
                                  </a>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <button style={{
                                    border: '0',
                                    background: "none",
                                    outline: "none"
                                  }} onClick={() => handleFileChanges(doc.user_document_id, doc.user_document_name)}>
                                    <img
                                      onClick={handleShow}
                                      alt="Delete"
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/DG/Delete.svg"
                                      }
                                    />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br></br>
            <div className="row py-2">
              <div className=" text-center">
                <div>
                  <div className="btn-container">
                    <div className="d-flex justify-content-center">
                      <Link
                        to={
                          process.env.PUBLIC_URL +
                          "/datagathering/insurance"
                        }
                      >
                        <div className="previous-btn form-arrow d-flex align-items-center">
                          <FaArrowLeft />
                          <span className="hover-text">&nbsp;Previous</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal className="popupmodal" centered show={show} onHide={handleClose}>
        <Modal.Header className="ModalHead">
          <div className="text-center">Delete Confirmation</div>
        </Modal.Header>
        <div className=" p-5 d-grid place-items-center align-item-center">
          <div className=" HeaderModal">
            <div
              style={{
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              This will permanently erase the record and its associated
              information.
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center pb-5">
          <button
            disabled={isLoading}
            onClick={() => {
              handleClose("yes");
            }}
            className="outline-btn m-2"
          >
            Yes
          </button>
          <button
            onClick={() => {
              handleClose("no");
            }}
            className="outline-btn m-2"
          >
            No
          </button>
        </div>
      </Modal>
    </DatagatherLayout>
  );
};

export default MyDocuments;
