import { useEffect, useState } from "react";
import Fullpage from "../components/Layout/Fullpage";
import style from "./style.module.css";
import { getItemLocal, getUserId, loginRedirectGuest, setItemLocal } from "../common_utilities";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ASSESSMENT_YEAR, DATA_BELONGS_TO } from "../constants";
import {
  DeleteDocumentApi,
  GetDocumentDetails,
  GetDocumentListByCategory,
  UpdateItrDocumentApi,
  UploadItrDocumentApi,
} from "../FrappeIntegration-Services/services/financial-planning-api/document";
import { addUpdateITRUserDetails, fetchUserITRDetails, fetchUserProfileDetails } from "../FrappeIntegration-Services/services/user-management-api/userApiService";
import { Getpaymentstatus } from "../FrappeIntegration-Services/services/payment-api/paymentapiService";

const MAX_FILE_SIZE = 500 * 1024;
const ALLOWED_FILE_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "tiff", "pdf", "xml", "csv", "xls", "xlsx",
]);
const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/tiff",
  "application/pdf",
  "application/xml",
  "text/xml",
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const getFileValidationError = (file) => {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || !ALLOWED_FILE_EXTENSIONS.has(extension) || !ALLOWED_FILE_TYPES.has(file.type.toLowerCase())) {
    return "Only JPG, JPEG, PNG, TIFF, PDF, XML, CSV, XLS, and XLSX files are allowed.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Max allowed file size is 500 KB.";
  }

  return "";
};

const ItrUploadDocs = () => {
  const [Documents, setDocumentData] = useState([]);
  const [UploadedDocuments, setUploadedDocuments] = useState([]);
  const [remark, setRemark] = useState("");
  const dispatch = useDispatch();
  const [skipCal, setSkipCal] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [documentSearch, setDocumentSearch] = useState("");
  const [savingDocuments, setSavingDocuments] = useState(false);
  const [ownForeignAssets, setOwnForeignAssets] = useState(false);
  const [itrUserProfile, setItrUserProfile] = useState({});
  const [userItrId, setUserItrId] = useState("");

  const navigate = useNavigate();

  const member = getItemLocal('pd') ? getItemLocal('pd') : "";
  const planDetails = getItemLocal("pid") || {};
  const docUserId = member.user_id
  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
  const itrUserId = docUserId || getUserId() || userData.user_id;
  const webEngageLeadId =
    member?.lead_id
    || member?.user_lead_id
    || planDetails?.lead_id
    || planDetails?.user_lead_id
    || itrUserProfile?.lead_id
    || itrUserProfile?.user_lead_id
    || userData?.lead_id
    || userData?.user_lead_id
    || "";

  const trackDocumentsUploaded = (failureReason = "", documents = UploadedDocuments) => {
    if (!window?.webengage?.track) return;

    const listPrice = Number(
      planDetails?.list_price
      || planDetails?.mrp
      || planDetails?.plan_amount
      || 0
    );
    const mrp = Number(planDetails?.mrp || planDetails?.plan_amount || listPrice || 0);
    const listDiscount = Number(
      planDetails?.list_discount
      || planDetails?.discount
      || Math.max(0, listPrice - mrp)
      || 0
    );
    const couponDiscount = Number(
      planDetails?.coupon_discount
      || planDetails?.coupon_discount_amount
      || 0
    );
    const totalPayable = Number(
      planDetails?.total_payable
      || planDetails?.total_amount
      || mrp
      || 0
    );
    const netPayable = Number(
      planDetails?.net_payable
      || planDetails?.payable_amount
      || Math.max(0, totalPayable - couponDiscount)
      || 0
    );
    const uploadedDocumentNames = documents
      .filter((doc) => doc.readyToUpload || doc.doc_id || doc.s3_link)
      .map((doc) => getDocumentTitle(doc.doc_type))
      .filter(Boolean);
    const params = new URLSearchParams(window.location.search);
    const dobValue =
      itrUserProfile?.user_dob
      || itrUserProfile?.dob
      || member?.dob;
    const dobParts =
      typeof dobValue === "string"
        ? dobValue.match(/^(\d{4})-(\d{2})-(\d{2})/)
        : null;
    const dob = dobParts
      ? new Date(
        Number(dobParts[1]),
        Number(dobParts[2]) - 1,
        Number(dobParts[3])
      )
      : dobValue
        ? new Date(dobValue)
        : null;
    const mobileNumber = String(
      itrUserProfile?.mobile
      || itrUserProfile?.mobile_number
      || member?.mobile
      || userData?.mobile
      || userData?.mobile_number
      || ""
    ).trim();
    const webEngagePhone = mobileNumber
      ? mobileNumber.startsWith("+91")
        ? mobileNumber
        : `+91 ${mobileNumber}`
      : "";

    window.webengage.track("documents uploaded", {
      url: window.location.href,
      "list price": listPrice,
      MRP: mrp,
      "list discount": listDiscount,
      "coupon discount": couponDiscount,
      "coupon code": planDetails?.coupon_code || planDetails?.coupon_name || "",
      "plan name": planDetails?.plan_name || planDetails?.name || "",
      "plan id": planDetails?.plan_uuid || planDetails?.plan_id || planDetails?.id || "",
      "lead id": webEngageLeadId,
      name: itrUserProfile?.user_name || itrUserProfile?.name || member?.full_name || userData?.user_name || userData?.name || "",
      email: itrUserProfile?.user_email || itrUserProfile?.email || member?.email || userData?.user_email || userData?.email || "",
      utm_source:
        params.get("utm_source")
        || localStorage.getItem("utm_source")
        || "Direct",
      phone: webEngagePhone,
      "failure reason": failureReason,
      "uploaded documents": uploadedDocumentNames.join(", "),
      ...(dob && !Number.isNaN(dob.getTime()) ? { dob } : {}),
      gender: itrUserProfile?.user_gender || itrUserProfile?.gender || member?.gender || "",
      "pan card": Boolean(
        itrUserProfile?.user_pan
        || itrUserProfile?.pan
        || member?.pan
        || userData?.pan
      ),
      Service: planDetails?.service || planDetails?.service_name || "ITR Filing",
      "total payable": totalPayable,
      "net payable": netPayable,
    });
  };

  //const navigateToAppointment = () => {
  //   // 👇️ navigate to /contacts
  //   navigate(`${process.env.PUBLIC_URL}/itr-Appointment`);
  // };

  const getUploadedDocumentRows = (docs = []) => {
    return docs
      .filter((doc) => doc.user_document_id || doc.doc_id || doc.user_document_uuid || doc.read_file_url || doc.s3_link || doc.doc_read_link || doc.document_file_url)
      .map((doc) => ({
        ...doc,
        doc_id: doc.user_document_id || doc.doc_id || doc.user_document_uuid,
        doc_type: doc.document_cat_uuid || doc.doc_type || doc?.document_data?.document_uuid || "",
        doc_name: doc.user_document_name || doc.doc_name || "",
        s3_link: doc.read_file_url || doc.s3_link || doc.doc_read_link || doc.document_file_url || "",
        finishedUpload: true,
      }));
  };

  const fetchUploadedDocuments = async (currentUserItrId = userItrId) => {
    if (!currentUserItrId) return;

    try {
      const res = await GetDocumentDetails(
        itrUserId,
        DATA_BELONGS_TO,
        null,
        {
          is_itr: 1,
          user_itr_id: currentUserItrId,
        }
      );
      const docs = Array.isArray(res?.data) ? res.data : [];
      const docRows = getUploadedDocumentRows(docs);
      setUploadedDocuments(docRows.length > 0 ? docRows : [{ doc_type: "" }]);
    } catch (error) {
      setUploadedDocuments((current) => current.length > 0 ? current : [{ doc_type: "" }]);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Unable to fetch uploaded documents.", type: "error" },
      });
    }
  };

  const onFileChange = async (e, j) => {
    const file = e.target.files[0];
    e.target.value = null;

    if (!file) return;

    const validationError = getFileValidationError(file);
    if (validationError) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: validationError, type: "error" },
      });
      return;
    }

    const selectedDoc = UploadedDocuments[j];
    if (!selectedDoc?.doc_type) {
      handleError();
      return;
    }

    const reader = new FileReader();
    reader.onloadend = function () {
      setUploadedDocuments((current) =>
        current.map((doc, index) =>
          index === j
            ? {
              ...doc,
              readyToUpload: file,
              thumbnail: reader.result,
              doc_name: file.name,
              uploading: false,
              finishedUpload: false,
            }
            : doc
        )
      );
    };
    reader.readAsDataURL(file);

  };

  const openFilePicker = (rowIndex) => {
    const selectedDoc = UploadedDocuments[rowIndex];
    if (!selectedDoc?.doc_type) {
      handleError();
      return;
    }

    document.querySelector("#file-" + rowIndex)?.click();
  };

  useEffect(() => {
    if (itrUserId == null) return;
    if (document.querySelector("header")) {
      document.querySelector("header").classList.add("d-none");
    }
    return () => {
      if (document.querySelector("header")) {
        document.querySelector("header").classList.remove("d-none");
      }
    };
  }, []);

  const ITRPayment = async () => {
    try {

      const paymentRes = await Getpaymentstatus({
        user_id: itrUserId,
        data_belongs_to: DATA_BELONGS_TO,
      });

      const hasItrFilingPlan =
        paymentRes?.status_code === 200 &&
        paymentRes?.data?.some(
          (item) => item?.service_type === "itr_filing"
        );

      if (!hasItrFilingPlan) {
        if(localStorage.getItem("pid") != null){
          navigate(`${process.env.PUBLIC_URL}/itr-plan-subscription`);
        }
        else{
          navigate(
            `${process.env.PUBLIC_URL}/itr-file?utm_service=91&utm_source=26&tags=itr_filing_2026&rm_id=96`
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch payment status:", error);
    }
  };

  useEffect(() => {
    const closeDropdown = (event) => {
      if (!event.target.closest("[data-itr-document-dropdown]")) {
        setActiveDropdownIndex(null);
        setDocumentSearch("");
      }
    };

    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  useEffect(() => {
    if (itrUserId == null) {
      loginRedirectGuest();
    } else {
      ITRPayment();
      getUserItrData();
      fetchItrUserDetails();
      fetchSavedItrDetails();
    }
  }, []);

  const fetchDocuments = async (currentUserItrId) => {
    try {
      const res = await GetDocumentListByCategory({
        document_service_sub_id: "itr_filing",
      });
      const documentData = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
      const documentList = documentData.flat();

      setDocumentData(documentList);
      setUploadedDocuments((current) =>
        current.length > 0 ? current : [{ doc_type: "" }]
      );
      fetchUploadedDocuments(currentUserItrId);
    } catch (error) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Unable to fetch document types.", type: "error" },
      });
    }
  };

  const getUserItrData = async () => {
    setItemLocal("sc", 0);
    setSkipCal(false);
  }

  const getBooleanValue = (value) => {
    return value == 1
      || value === "1"
      || value === true
      || `${value}`.toLowerCase() === "yes";
  };

  const getApiMessage = (response, fallback) => {
    return response?.message?.message || response?.message || fallback;
  };

  const fetchItrUserDetails = async () => {
    try {
      const response = await fetchUserProfileDetails(itrUserId);
      const data = response?.data || {};
      setItrUserProfile(data);
    } catch (error) {
      console.error("fetchItrUserDetails error:", error);
    }
  };

  const fetchSavedItrDetails = async () => {
    try {
      const response = await fetchUserITRDetails({
        user_id: itrUserId,
        assessment_year: ASSESSMENT_YEAR,
      });
      const responseData = response?.data?.data || response?.data || {};
      const data = Array.isArray(responseData) ? responseData[0] || {} : responseData;
      const currentUserItrId = data.name || "";
      setUserItrId(currentUserItrId);
      await fetchDocuments(currentUserItrId);

      if (data.remarks !== undefined && data.remarks !== null) {
        setRemark(data.remarks);
      }

      if (data.own_foreign_assets !== undefined && data.own_foreign_assets !== null) {
        setOwnForeignAssets(getBooleanValue(data.own_foreign_assets));
      }
    } catch (error) {
      console.error("fetchSavedItrDetails error:", error);
    }
  };

  const deleteOldPhoto = async (v, j) => {
    if (!v) {
      setUploadedDocuments((x) => {
        const nextRows = x.filter((xx, ii) => ii != j);
        return nextRows.length > 0 ? nextRows : [{ doc_type: "" }];
      });
      return;
    }

    const previousDocuments = UploadedDocuments;
    setUploadedDocuments((x) => {
      const nextRows = x.filter((xx, ii) => ii != j);
      return nextRows.length > 0 ? nextRows : [{ doc_type: "" }];
    });

    try {
      const payload = {
        user_id: itrUserId,
        user_document_id: v,
      };
      const response = await DeleteDocumentApi(payload);
      if (response?.status_code && response.status_code != "200" && response.status_code != 200) {
        throw new Error(response?.message || "Delete failed");
      }

      dispatch({
        type: "RENDER_TOAST",
        payload: { message: response?.message || "Document deleted successfully.", type: "success" },
      });
      await fetchUploadedDocuments();
    } catch (e) {
      setUploadedDocuments(previousDocuments);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Unable to delete document. Please try again.", type: "error" },
      });
    }
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
    const pendingDocuments = UploadedDocuments.filter((doc) => doc.readyToUpload);
    const invalidDocument = pendingDocuments.find((doc) => getFileValidationError(doc.readyToUpload));

    if (invalidDocument) {
      const failureReason = getFileValidationError(invalidDocument.readyToUpload);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: failureReason, type: "error" },
      });
      trackDocumentsUploaded(failureReason, pendingDocuments);
      return;
    }

    try {
      setSavingDocuments(true);

      if (pendingDocuments.length > 0) {
        const newDocuments = pendingDocuments.filter((doc) => !doc.doc_id);
        const documentsToUpdate = pendingDocuments.filter((doc) => doc.doc_id);

        if (newDocuments.length > 0) {
          let formdata = new FormData();
          formdata.append("user_document_user_id", itrUserId);
          formdata.append("doc_name", "itr_Filling");
          formdata.append("user_document_belongs_to", DATA_BELONGS_TO);
          formdata.append("is_itr", "1");
          
          for (const document of newDocuments) {
            formdata.append("document_files", document.readyToUpload);
            formdata.append("document_cat_uuid", document.doc_type);
          }

          const res = await UploadItrDocumentApi(formdata);
          if (!(res?.error_code == 100 || res?.status_code == 200 || res?.status_code == "200")) {
            throw new Error(res?.message || "Upload failed");
          }
        }

        if (documentsToUpdate.length > 0) {
          const updateFormData = new FormData();
          const documents = documentsToUpdate.map((document, index) => {
            const fileKey = `document_file_${index}`;
            updateFormData.append(fileKey, document.readyToUpload);

            return {
              user_document_id: document.doc_id,
              document_cat_uuid: document.doc_type,
              user_document_password: "",
              user_document_remarks: "",
              file_key: fileKey,
            };
          });

          updateFormData.append("user_document_user_id", itrUserId);
          updateFormData.append("user_document_belongs_to", DATA_BELONGS_TO);
          updateFormData.append("documents", JSON.stringify(documents));

          const res = await UpdateItrDocumentApi(updateFormData);
          if (!(res?.error_code == 100 || res?.status_code == 200 || res?.status_code == "200")) {
            throw new Error(res?.message || "Update failed");
          }
        }

        await fetchUploadedDocuments();
      }

      const itrDetailsResponse = await addUpdateITRUserDetails({
        data_belongs_to: DATA_BELONGS_TO,
        dob: itrUserProfile?.user_dob || itrUserProfile?.dob || "",
        email: itrUserProfile?.user_email || itrUserProfile?.email || member?.user_email || userData?.user_email || userData?.email || "",
        gender: itrUserProfile?.user_gender || itrUserProfile?.gender || "",
        itr_only: "1",
        mobile: itrUserProfile?.mobile || itrUserProfile?.mobile_number || member?.mobile || userData?.mobile || userData?.mobile_number || "",
        own_foreign_assets: ownForeignAssets ? 1 : 0,
        pan: itrUserProfile?.user_pan || itrUserProfile?.pan || member?.pan || userData?.pan || "",
        remarks: remark,
        user_id: itrUserId,
      });

      if (!(itrDetailsResponse?.error_code == 100 || itrDetailsResponse?.status_code == 200 || itrDetailsResponse?.status_code == "200")) {
        throw new Error(getApiMessage(itrDetailsResponse, "Unable to update ITR details"));
      }

      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "ITR details saved successfully.", type: "success" },
      });
      trackDocumentsUploaded("", pendingDocuments.length > 0 ? pendingDocuments : UploadedDocuments);
    } catch (error) {
      const failureReason = error?.message || "Unable to save ITR details. Please try again.";
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: failureReason, type: "error" },
      });
      trackDocumentsUploaded(failureReason, pendingDocuments);
      return;
    } finally {
      setSavingDocuments(false);
    }

    if (skipCal) {
      navigate(`${process.env.PUBLIC_URL}/itr-thank-you`);
      return;
    }

    navigate(`${process.env.PUBLIC_URL}/itr-Appointment`);
  };

  const handleError = () => {
    dispatch({
      type: "RENDER_TOAST",
      payload: { message: "Please Select Document Type First.", type: "error" },
    });
  };

  const openThumbnail = (thumbnail, file) => {
    const previewUrl = file
      ? window.URL.createObjectURL(file)
      : thumbnail;

    if (!previewUrl) return;

    window.open(previewUrl, "_blank", "noopener,noreferrer");

    if (file) {
      window.setTimeout(() => window.URL.revokeObjectURL(previewUrl), 60000);
    }
  };

  const documentOptions = Documents.map((w) => ({
    title: w.dt_name || w.document_name || w.document_cat_name,
    value: w.dt_uuid || w.document_cat_uuid || w.dt_id || w.document_id,
  })).filter((option) => option.title && option.value);

  const getDocumentTitle = (value) => {
    return documentOptions.find((option) => option.value === value)?.title || "";
  };

  const getFilteredDocumentOptions = () => {
    const searchValue = documentSearch.trim().toLowerCase();
    if (!searchValue) return documentOptions;

    return documentOptions.filter((option) =>
      option.title.toLowerCase().includes(searchValue)
    );
  };

  const hasPendingUpload = UploadedDocuments.some((document) => document.uploading);
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
        <div className={style.itrUploadPage}>
          <div className="container">
            <div className="row align-items-center">
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
                  Kindly upload images size of maximum 500kb{" "}
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
                <div className={style.uploadTableWrap}>
                  <table className={`table ${style.uploadTable}`}>
                    <thead>
                      <tr>
                        <th>File Type</th>
                        <th>Uploaded File</th>
                        <th style={{ width: 90 }}>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {UploadedDocuments.map((v, j) => (
                        <tr className={style.trField} key={`itr-doc-${j}`}>
                          <td>
                            <div
                              className={style.documentSelectWrap}
                              data-itr-document-dropdown
                            >
                              <button
                                type="button"
                                className={style.documentSelect}
                                disabled={Boolean(v.doc_id) || Boolean(v.uploading)}
                                onClick={() => {
                                  if (v.doc_id || v.uploading) return;
                                  setActiveDropdownIndex((current) => current === j ? null : j);
                                  setDocumentSearch("");
                                }}
                              >
                                <span>
                                  {getDocumentTitle(v.doc_type) || "Select Document Type"}
                                </span>
                                <i className="fa-solid fa-caret-down"></i>
                              </button>
                              {activeDropdownIndex === j && (
                                <div className={style.documentDropdownPanel}>
                                  <input
                                    type="text"
                                    className={style.documentSearch}
                                    value={documentSearch}
                                    placeholder="Search document type"
                                    onChange={(e) => setDocumentSearch(e.target.value)}
                                    autoFocus
                                  />
                                  <div className={style.documentOptions}>
                                    {getFilteredDocumentOptions().length > 0 ? (
                                      getFilteredDocumentOptions().map((option) => (
                                        <button
                                          type="button"
                                          key={option.value}
                                          className={`${style.documentOption} ${v.doc_type === option.value ? style.documentOptionActive : ""}`}
                                          onClick={() => {
                                            const a = [...UploadedDocuments];
                                            a[j]["doc_type"] = option.value;
                                            setUploadedDocuments([...a]);
                                            setActiveDropdownIndex(null);
                                            setDocumentSearch("");
                                          }}
                                        >
                                          {option.title}
                                        </button>
                                      ))
                                    ) : (
                                      <div className={style.documentNoResult}>
                                        No document found
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.tiff,.pdf,.xml,.csv,.xls,.xlsx"
                              id={"file-" + j}
                              onChange={(e) => onFileChange(e, j)}
                              style={{
                                display: "none",
                              }}
                            />
                            <>
                              {(Boolean(v.s3_link) || Boolean(v.thumbnail) || Boolean(v.doc_id)) && (
                                <div className={style.documentStatus}>
                                  {Boolean(v.thumbnail) && (
                                    <>
                                      <div className={style.documentFileInfo}>
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
                                            openThumbnail(v.thumbnail, v.readyToUpload);
                                          }}
                                        >
                                          Preview new file
                                        </p>
                                      </div>
                                    </>
                                  )}
                                  {Boolean(v.s3_link) && !Boolean(v.thumbnail) && (
                                    <>
                                      <div className={style.documentFileInfo}>
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
                                          View file
                                        </a>
                                      </div>
                                    </>
                                  )}
                                  {Boolean(v.doc_id) && !Boolean(v.s3_link) && !Boolean(v.thumbnail) && (
                                    <div className={style.documentFileInfo}>
                                      <p className="mb-0">
                                        {v.doc_name || "Uploaded document"}
                                      </p>
                                    </div>
                                  )}

                                  {Boolean(v.uploading) && (
                                    <span className={style.uploadingText}>
                                      Uploading...
                                    </span>
                                  )}

                                </div>
                              )}
                            </>

                            {Boolean(v.thumbnail) == false &&
                              Boolean(v.s3_link) == false &&
                              Boolean(v.doc_id) == false && (
                                <>
                                  <div
                                    className={`${style.buttonChoose} pointer`}
                                    onClick={() => openFilePicker(j)}
                                  >
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
                            <div className={style.documentActions}>
                              {Boolean(v.doc_id) && (
                                <button
                                  type="button"
                                  className={style.documentActionBtn}
                                  title="Replace document"
                                  aria-label="Replace document"
                                  disabled={Boolean(v.uploading)}
                                  onClick={() => openFilePicker(j)}
                                >
                                  <i className="fa fa-refresh" aria-hidden="true"></i>

                                </button>
                              )}
                              <button
                                type="button"
                                className={style.documentActionBtn}
                                title="Delete document"
                                aria-label="Delete document"
                                disabled={Boolean(v.uploading)}
                                onClick={() => {
                                  //if (v.doc_id != "" || v.doc_id != null)
                                  if (!v.uploading) deleteOldPhoto(v.doc_id, j);
                                }}
                              >
                                <i className="fa fa-trash" aria-hidden="true"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="py-3">
                  <p
                    className={style.addMoreBtn}
                    onClick={() => {
                      setUploadedDocuments((current) => [...current, { doc_type: "" }]);
                    }}
                  >
                    + Add More
                  </p>
                </div>
                <div className="py-3">
                  <textarea
                    rows="3"
                    className={style.textarea}
                    value={remark}
                    placeholder="If you have any comments or queries related to ITR, Please mention here!"
                    onChange={(e) => {
                      setRemark(e.target.value);
                    }}
                  ></textarea>
                </div>
                <label className={style.foreignAssetsCheck}>
                  <input
                    type="checkbox"
                    checked={ownForeignAssets}
                    onChange={(e) => setOwnForeignAssets(e.target.checked)}
                  />
                  <span>Do you own any foreign assets?</span>
                </label>
                <div className="pt-3 mb-4">
                  <button
                    disabled={hasPendingUpload || savingDocuments}
                    type="button"
                    className={style.btn}
                    onClick={() => onFileUpload()
                    }
                  >
                    {savingDocuments ? "Saving..." : "Save & Continue"}
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
