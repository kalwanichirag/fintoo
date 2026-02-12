import { useEffect, useRef, useState } from "react";
import Fullpage from "../components/Layout/Fullpage";
import style from "./style.module.css";
import ReactSimpleSelect from "../components/ReactSimpleSelect";
import axios from "axios";
import { fetchData, getItemLocal, getParentUserId, getUserId, loginRedirectGuest, apiCall, setItemLocal } from "../common_utilities";
import { getuid } from "process";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const ItrUploadDocs = () => {
  const [Documents, setDocumentData] = useState([]);
  const [UploadedDocuments, setUploadedDocuments] = useState([]);
  const [documentsName, setDocumentName] = useState([]);
  const [doctype, setdoctype] = useState("");
  const [oldPhoto, setOldPhoto] = useState({});
  const [remark, setRemark] = useState("");
  const [fileObj, setFileObj] = useState([]);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [preview, setPreview] = useState();
  const [userItrData, setUserItrData] = useState({});
  const [skipCal, setSkipCal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const uploadRef = useRef();
  const navigate = useNavigate();

 
  const member = getItemLocal('pd') ? getItemLocal('pd') : "";
  const docUserId = member.user_id

  //const navigateToAppointment = () => {
  //   // 👇️ navigate to /contacts
  //   navigate(`${process.env.PUBLIC_URL}/itr-Appointment`);
  // };

  const onFileChange = (e, j) => {
    // Update the state
    const a = UploadedDocuments;
    const b = documentsName;
    a[j]["readyToUpload"] = e.target.files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
      a[j]["thumbnail"] = reader.result;
      setUploadedDocuments([...a]);
    };

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    // setDocumentName([...b])
  };

  useEffect(() => {
    if(getUserId() == null) return;
    if (document.querySelector("header")) {
      document.querySelector("header").classList.add("d-none");
    }
    return () => {
      if (document.querySelector("header")) {
        document.querySelector("header").classList.remove("d-none");
      }
    };
  }, []);

  useEffect(() => {
    if(getUserId() == null) {
      loginRedirectGuest();
    } else {
      // fetchDocuments();
      // fetchUploadedDocuments();
      getUserItrData();
    }
  }, []);

  const getUserItrData = async () => {
    setItemLocal("sc", 0);
    let data = await apiCall('', {
      user_id: docUserId ? docUserId :getUserId(),
    });
    if (data.error_code == '100'){
      setUserItrData(data.data?.[0]);
      if (data.data?.[0]["Current_Filing_Step"] == "4") {
        setSkipCal(true);
        setItemLocal("sc", 1)
      }
    }
  }

  const deleteOldPhoto = async (v, j) => {
    setUploadedDocuments((x) => x.filter((xx, ii) => ii != j));
    try {
      var payload = {
        url: TAX_ITR_DELETE_DOCS_API_URL,
        data: {
          document_id: v.toString(),
          user_id: docUserId?docUserId:getUserId(),
        },
        method: "post",
      };
      var response = await fetchData(payload);

      setOldPhoto({});
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: response.message, type: "success" },
      });
    } catch (e) {}
  };

  // const fetchDocuments = async () => {
  //   var res = await axios.post(TAX_GET_DOCUMENTS_API_URL, {});
  //   const index_data = res.data.data;
  //   setDocumentData(index_data);
  // };

  // const fetchUploadedDocuments = async () => {
  //   const user_id = docUserId?docUserId:getUserId()
  //   var res = await axios.post(TAX_GET_UPLOADED_DOCUMENTS_API_URL, {
  //     user_id: user_id,
  //     assesment_year:ASSESSMENT_YEAR
  //   });
  //   const doc_data = res.data.data.filter((v) => v.is_active == 1 && v.s3_link != "NA");
  //   if (doc_data.length > 0 ) {
  //     setUploadedDocuments(doc_data);
  //   } else {
  //     setUploadedDocuments([{ doc_type: UploadedDocuments.length }]);
  //   }
  // };

  const onFileUpload = async () => {
    setIsDisabled(true);
    var i = 0;
    uploadRef.current = UploadedDocuments;
    for await (var obj of UploadedDocuments) {
      if (Boolean(obj["readyToUpload"]) == true) {
        var file = obj["readyToUpload"];
      }
      let formdata = new FormData();
      formdata.append("doc_file", file);
      formdata.append("user_id", docUserId?docUserId:getUserId());
      formdata.append("doc_type", obj.doc_type);
      formdata.append("no_enc_key", "AAAA");
      formdata.append("doc_name", "itr_Filling");
      remark != "" && formdata.append("remark", remark);
      var res = await fetchData({
        url: TAX_ITR_UPLOAD_DOCS_API_URL,
        method: "POST",
        data: formdata,
      });
      const x = UploadedDocuments;
      uploadRef.current[i]["finishedUpload"] = false;
      if (res.error_code == 100) {
        uploadRef.current[i]["finishedUpload"] = true;
      }
      setUploadedDocuments([...uploadRef.current]);
      i++;
      setTimeout(() => {
        if (skipCal) {
          navigate(`${process.env.PUBLIC_URL}/itr-thank-you`);
          return;
        }
        navigate(`${process.env.PUBLIC_URL}/itr-Appointment`);
      }, 3500);
      
    }
  };

  const handleError = () => {
    dispatch({
      type: "RENDER_TOAST",
      payload: { message: "Please Select Document Type First.", type: "error" },
    });
    setErrorMessage("Please Select Document Type First.");
  };

  const openThumbnail = (v) => {
    fetch(v)
      .then((res) => res.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        window.open(url);
      });
  };
  // const options = [
  //     {value: 1, title: 'Form 16 - PART A'},
  //     {value: 2, title: 'Form 16 - PART B'},
  //     {value: 3, title: 'Form 16 - (PART A & B)'},
  //     {value: 4, title: 'PAN'},
  //     {value: 5, title: 'For HRA, Rent Agreement'}
  // ];

  return (
    <>
      <Fullpage>
        <div>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6">
                <h3 className="text-center display-6">Upload Documents</h3>
                <div 
                style={{
                  color: "#888",
                  fontWeight: "600",
                  textAlign: "center",
                }}>
                <span>Don't have documents now?<a href={`${process.env.PUBLIC_URL}/itr-Appointment`}
                style={{
                  color: "#042b62",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                //onClick={navigateToAppointment}
              > Skip</a></span>
              </div>  
                <p className={`text-center ${style.subtitle}`}>
                  Kindly upload images size between 200kb to 500kb{" "}
                  {/* <i>(images types can include PNG, JPG, JPEG and BMP)</i> */}
                </p>
                {/* <div 
                style={{
                  color: "#888",
                  fontWeight: "600",
                  textAlign: "center",
                }}>
                  
                <span>Don't have documents now?<a href={`${process.env.PUBLIC_URL}/itr-Appointment`}
                style={{
                  color: "#042b62",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                //onClick={navigateToAppointment}
              > Skip</a></span>
              </div>   */}
                <table className="table">
                  <thead>
                    <tr>
                      <th>File Type</th>
                      <th>Status</th>
                      <th style={{ width: 40 }}>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UploadedDocuments.map((v, j) => (
                      <tr className={style.trField}>
                        <td>
                          <ReactSimpleSelect
                            options={Documents.map((w) => {
                              return { title: w.dt_name, value: w.dt_id };
                            })}
                            value={v.doc_type}
                            onChange={(x) => {
                              const a = UploadedDocuments;
                              const i = a.findIndex(
                                (vv) => vv.doc_type == v.doc_type
                              );
                              a[i]["doc_type"] = x;
                              setUploadedDocuments([...a]);
                            }}
                          />
                        </td>
                        <td>
                          <>
                            {(Boolean(v.s3_link) || Boolean(v.thumbnail)) && (
                              <div className="d-flex">
                                {Boolean(v.thumbnail) && (
                                  <>
                                    <div>
                                      <p className="mb-0">
                                        {"..." +
                                          v.readyToUpload.name.substring(
                                            v.readyToUpload.name.length - 20,
                                            v.readyToUpload.name.length
                                          )}
                                      </p>
                                      <p
                                        className={`mb-0 ${style["preview-link"]}`}
                                        onClick={() => {
                                          openThumbnail(v.thumbnail);
                                        }}
                                      >
                                        Preview
                                      </p>
                                    </div>
                                  </>
                                )}
                                {Boolean(v.s3_link) && (
                                  <>
                                    <div>
                                      <p className="mb-0">
                                        {"..." +
                                          v.s3_link.substring(
                                            v.s3_link.length - 20,
                                            v.s3_link.length
                                          )}
                                      </p>
                                      <a
                                        className={`mb-0 ${style["preview-link"]}`}
                                        href={v.s3_link}
                                        target="_blank"
                                      >
                                        Preview
                                      </a>
                                    </div>
                                  </>
                                )}

                                {Boolean(v.finishedUpload) && (
                                  <i
                                    style={{
                                      paddingLeft: "1rem",
                                      color: "green",
                                    }}
                                    class="fa-solid fa-check"
                                  ></i>
                                )}
                              </div>
                            )}
                          </>

                          {Boolean(v.thumbnail) == false &&
                            Boolean(v.s3_link) == false && (
                              <>
                                <div
                                  className={`${style.buttonChoose} d-inline-flex pointer`}
                                  onClick={() => {
                                    if (v.doc_type == "") {
                                      handleError();
                                    } else {
                                      document
                                        .querySelector("#file-" + j)
                                        .click();
                                    }
                                  }}
                                >
                                  <input
                                    type="file"
                                    id={"file-" + j}
                                    onChange={(e) => onFileChange(e, j)}
                                    style={{
                                      display: "none",
                                    }}
                                    // onChange={(e) => convertBase(v.dt_id)}
                                  />
                                  <div className={style.imagebox}>
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/static/media/ITR/up-loading_3.png"
                                      }
                                    />
                                  </div>
                                  <div className={style.chooseText}>
                                    Choose File
                                  </div>
                                </div>
                              </>
                            )}
                        </td>
                        <td>
                          <div
                            onClick={() => {
                              //if (v.doc_id != "" || v.doc_id != null)
                              deleteOldPhoto(v.doc_id, j);
                            }}
                          >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="py-3">
                  <p
                    className={style.addMoreBtn}
                    onClick={() => {
                      const a = UploadedDocuments;
                      a.push({ doc_type: "" });
                      setUploadedDocuments([...a]);
                    }}
                  >
                    + Add More
                  </p>
                </div>
                <div className="py-3">
                  <textarea
                    rows="3"
                    className={style.textarea}
                    placeholder="If you have any comments or queries related to ITR, Please mention here!"
                    onChange={(e) => {
                      setRemark(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="pt-3 mb-4">
                  <button
                    disabled={isDisabled}
                    type="button"
                    className={style.btn}
                    onClick={() => onFileUpload()
                    }
                  >
                    {"Save & Continue"}
                  </button>
                </div>
                {/* <center>
                  <div
                    style={{
                      color: "#042b62",
                      fontWeight: "600",
                      cursor: "pointer",
                      padding: " 05px 15px",
                    }}
                    onClick={navigateToAppointment}
                  >
                    Skip
                  </div>
                </center> */}
              </div>
              <div className="d-none d-md-block col-6">
                <img
                  className="img-fluid"
                  src={
                    process.env.PUBLIC_URL +
                    "/static/media/ITR/01_personal_data.21c9b7453073cdd0b44e.png"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Fullpage>
    </>
  );
};
export default ItrUploadDocs;
