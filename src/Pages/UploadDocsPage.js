import { useEffect, useRef, useState } from "react";
import style from "./style.module.css";
import ReactSimpleSelectForTaxPlanning from "./ReactSimpleSelectForTaxPlanning";
import axios from "axios";
import { getItemLocal, getUserId } from "../common_utilities";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import StepComponent from "../components/StepsComponent";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { taxplanningEndpoints } from "../constants";
import { openDialog } from "./DMF/CommonDashboard/CommonDashboardComponents/ConfirmationDialog/ConfirmHandler";
import MainLayout from "../components/Layout/MainLayout";
import uuid from 'react-uuid';
import Cookies from 'js-cookie';
import { getDocumentListByCategory } from "../FrappeIntegration-Services/services/tax-planning-api/taxApiService";

// Test function to check GET API without navigating to the page
export const testDocumentAPI = () => {
    const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
    const userid = getUserId();
    let user_id = user_data.user_id || userid;
    const token = Cookies.get('token');

    // Get appointment info from localStorage if available
    const FintooUserAppointmentInfo = JSON.parse(localStorage.getItem('FintooUserAppointmentInfo') || '{}');
    const appointment_id = FintooUserAppointmentInfo.appointment_id || 'APPD-14'; // Default to APPD-14 if not found

    axios.get(`${taxplanningEndpoints.GET_DOCUMENT_DETAILS}?appointment_id=${appointment_id}&appointment_user_id=${user_id}`, {
        headers: {
            'Authorization': `token ${token}`
        }
    })
        .then(res => {
            //console.log('API Response document:', res.data);
        })
        .catch(error => {
            console.error('API Error:', error);
        });
};

// Test function to check UPLOAD API without navigating to the page
export const testUploadDocumentAPI = () => {
    const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
    const userid = getUserId();
    let user_id = user_data.user_id || userid;
    const token = Cookies.get('token');

    // Get appointment info from localStorage if available
    const FintooUserAppointmentInfo = JSON.parse(localStorage.getItem('FintooUserAppointmentInfo') || '{}');
    const appointment_id = FintooUserAppointmentInfo.appointment_id || 'APPD-14'; // Default to APPD-14 if not found

    // Create a simple FormData object for testing
    let formdata = new FormData();
    formdata.append("appointment_user_id", user_id);
    formdata.append("appointment_id", appointment_id);
    formdata.append("appointment_remarks", "Testing API from console");

    // Note: For actual file upload testing, you would need to add a file
    // formdata.append("document_files", file);
    // formdata.append("document_cat_uid", "tax_notice");

    axios.post(taxplanningEndpoints.UPLOAD_DOCUMENT_DETAILS, formdata, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(res => {
            //console.log('API Upload Response:', res.data);
        })
        .catch(error => {
            console.error('API Upload Error:', error);
        });
};

// Test function to check DELETE API without navigating to the page
export const testDeleteDocumentAPI = () => {
    const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
    const userid = getUserId();
    let user_id = user_data.user_id || userid;
    const token = Cookies.get('token');

    // Get appointment info from localStorage if available
    const FintooUserAppointmentInfo = JSON.parse(localStorage.getItem('FintooUserAppointmentInfo') || '{}');
    const appointment_id = FintooUserAppointmentInfo.appointment_id || 'APPD-14'; // Default to APPD-14 if not found

    // You need to provide a valid document ID to delete
    const document_id = 'UDCD-113'; // Replace with an actual document ID for testing

    // Use query parameters with DELETE method
    const apiUrl = `${taxplanningEndpoints.DELETE_DOCUMENT_DETAILS}?appointment_id=${appointment_id}&appointment_user_id=${user_id}&appointment_document_id=${document_id}`;

    // Use DELETE method as requested
    axios.delete(apiUrl, {
        headers: {
            'Authorization': `token ${token}`
        }
    })
        .then(res => {
            //console.log('API Delete Response:', res.data);
        })
        .catch(error => {
            console.error('API Delete Error:', error);
        });
};

const UploadDocsPage = () => {

    const [trackData, SetTrackData] = useState({
        docLength: 0,
        remark: ''
    })
    const [Documents, setDocumentData] = useState([]);

    const [UploadedDocuments, setUploadedDocuments] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [exceedingSizeItemIndex, setSexceedingSizeItemIndex] = useState(null)
    const [appointmentDetails, setAppointmentDetails] = useState(null)
    const [remark, setRemark] = useState("");
    const dispatch = useDispatch();
    const [isDisabled, setIsDisabled] = useState(false);

    const uploadRef = useRef();
    let navigate = useNavigate();

    const userid = getUserId();
    const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
    let user_id = user_data.user_id || userid;

    const token = Cookies.get('token');

    const handleError = () => {
        dispatch({
            type: "RENDER_TOAST",
            payload: { message: "Please Select Document Type First.", type: "error" },
        });
        setErrorMessage("Please Select Document Type First.");
    };

    const hasError = (idx) => {
        return exceedingSizeItemIndex && exceedingSizeItemIndex.idx == idx
    }

    function isCorrectExtention(ext) {
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'tiff':
            case 'zip':
            case 'pdf':
            case 'png':
                return true;
        }
        return false;
    }

    const onFileChange = (e, j, localId) => {

        const fileSize = e.target.files[0].size / Math.pow(1024, 2)
        const extentionType = e.target.files[0].type.split("/").pop()

        if (!isCorrectExtention(extentionType)) {

            setSexceedingSizeItemIndex({
                idx: localId, msg: 'allowed formats are - jpg, jpeg, png, tiff, zip and pdf.'
            })
        }
        if (fileSize > 5) {
            setSexceedingSizeItemIndex({
                idx: localId, msg: 'Max allowed file size is 5 MB.'
            })
        } else {
            setUploadedDocuments(prev => prev.map(data => {
                if (data.localId == localId) {
                    return {
                        ...data,
                        fileData: e.target.files[0],
                        doc_name: e.target.files[0].name,
                        isNewDoc: true
                    }
                }
                return data
            }));
            return setSexceedingSizeItemIndex(null)
        }
    };

    const getObjUrl = (v) => {
        if (v) {
            const url = URL.createObjectURL(v);
            return url
        } else {
            return ''
        }
    };

    const showUploadOption = (ob) => {
        return !ob.hasOwnProperty('fileData') && !ob.doc_read_link
    }

    const deleteOldPhoto = async (document_id, j, localId) => {

        if (!document_id) {
            return setUploadedDocuments(prev => prev.filter((data) => data.localId !== localId));
        } else {
            const result = await openDialog("Delete Confirmation", 'Are you sure you want to delete this document?');
            if (!result) return;
            setUploadedDocuments((x) => x.filter((xx, ii) => ii !== j));
        }

        try {
            const FintooUserAppointmentInfo = JSON.parse(localStorage.getItem('FintooUserAppointmentInfo'));

            if (!FintooUserAppointmentInfo?.appointment_id) {
                return navigate(`${process.env.PUBLIC_URL}/commondashboard`);
            }

            // Use the new DELETE_DOCUMENT_DETAILS API endpoint with query parameters and DELETE method
            const apiUrl = `${taxplanningEndpoints.DELETE_DOCUMENT_DETAILS}?appointment_id=${FintooUserAppointmentInfo.appointment_id}&appointment_user_id=${user_id}&appointment_document_id=${document_id}`;

            const res = await axios.delete(apiUrl, {
                headers: {
                    'Authorization': `token ${Cookies.get('token')}`
                }
            });

            const { data } = res.data;

            dispatch({
                type: 'RENDER_TOAST',
                payload: { message: data.message, type: 'success' },
            });
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const onFileUpload = async () => {
        if (!checkDocVerification()) {
            return;
        }
        setIsDisabled(true);

        uploadRef.current = UploadedDocuments;

        let formdata = new FormData();

        formdata.append("user_id", Number(userid));
        formdata.append("appointment_id", appointmentDetails.appointment_id);
        formdata.append("document_remarks", remark);

        const docTypeArr = []

        UploadedDocuments.forEach(fileData => {
            if (fileData.isNewDoc) {
                docTypeArr.push(fileData.doc_type)
                formdata.append("document_files", fileData.fileData);
            }
        })

        formdata.append("document_type", docTypeArr);

        if (UploadedDocuments.some(data => data.isNewDoc) || trackData.remark != remark) {
            let newFormData = new FormData();
            newFormData.append("appointment_user_id", userid);
            newFormData.append("appointment_id", appointmentDetails.appointment_id);
            newFormData.append("appointment_remarks", remark);

            // Add document files and their types
            UploadedDocuments.forEach(fileData => {
                if (fileData.isNewDoc) {
                    newFormData.append("document_files", fileData.fileData);
                    newFormData.append("document_cat_uuid", fileData.doc_type);
                }
            });

            axios.post(taxplanningEndpoints.UPLOAD_DOCUMENT_DETAILS, newFormData, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => {
                    if (parseInt(res.data.status_code) === 200) {
                        toastr.options.positionClass = "toast-bottom-left";
                        toastr.success('Documents uploaded successfully');
                    } else {
                        toastr.options.positionClass = "toast-bottom-left";
                        toastr.error(res.data.message || 'Something went wrong while uploading documents');
                    }
                    return navigate(`${process.env.PUBLIC_URL}/commondashboard`);
                })
                .catch(error => {
                    console.error('Error uploading documents:', error);
                    setIsDisabled(false);
                    toastr.options.positionClass = "toast-bottom-left";
                    toastr.error('Error uploading documents. Please try again.');
                });
        } else {
            return navigate(`${process.env.PUBLIC_URL}/commondashboard`);
        }
    };

    useEffect(() => {
        document.body.classList.add("white-bg");
        return (() => document.body.classList.remove("white-bg"))
    }, [])

    const stepsData = [
        {
            current: false,
            stepCompleted: true,
            name: 'Select the Expert',
        },
        {
            current: false,
            stepCompleted: true,
            name: 'Pay for Consultancy',
        },
        {
            current: false,
            stepCompleted: true,
            name: 'Book an Appointment',
        },
        {
            current: true,
            stepCompleted: false,
            name: 'Upload Documents',
        }
    ]

    useEffect(() => {

        if (getItemLocal("family") == '1') {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error('Please select member');
            return navigate(`${process.env.PUBLIC_URL + '/commondashboard'}`);
        }

        const FintooUserAppointmentInfo = JSON.parse(localStorage.getItem('FintooUserAppointmentInfo'));

        if (!FintooUserAppointmentInfo?.appointment_id) {
            return navigate(`${process.env.PUBLIC_URL}/commondashboard`);
        }

        setAppointmentDetails(FintooUserAppointmentInfo)

        getDocumentListByCategory("tax_planning")
            .then(res => {
                setDocumentData(
                        res?.data.map(doc => ({
                        title: doc.dt_name,
                        value: doc.dt_uuid
                        // value: "actual_expenditure"

                    }))
                )
            })
            .catch(err => console.error("Error fetching document types:", err));
        // getDocumentListByCategory("tax_planning")
        // .then(res => {
        
        //     const documents = res?.data?.data || res?.data || [];
        //     const mapped = documents.map(doc => ({
        //         title: doc.dt_name,
        //         value: doc.dt_uuid
        //       }));
        //     setDocumentData(mapped);
        // })
        // .catch(err => {
        //     console.error("Error fetching documents:", err);
        // });
          

        axios.get(`${taxplanningEndpoints.GET_DOCUMENT_DETAILS}?appointment_id=${FintooUserAppointmentInfo.appointment_id}&appointment_user_id=${user_id}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        })
            .then(res => {
                if (parseInt(res.data.status_code) !== 200) {
                    toastr.options.positionClass = "toast-bottom-left";
                    toastr.error(res.data.message || "Error fetching documents");
                    return navigate(`${process.env.PUBLIC_URL}/commondashboard`);
                }

                const responseData = res?.data || {};
                const { status_code, message, data } = responseData;
                const docDetails = data?.document_details || [];
                const appointmentRemarks = data?.appointment_remarks || "";

                // Filter out invalid documents
                const doc_data = docDetails.filter(
                    (v) => v.doc_read_link && v.doc_read_link !== "File not found!"
                );

                // Update remark
                setRemark(appointmentRemarks);

                // Update uploaded documents
                if (doc_data.length > 0) {
                    setUploadedDocuments(doc_data.map((d) => ({ ...d, localId: uuid() })));
                } else {
                    setUploadedDocuments([{ doc_type: "", localId: uuid() }]);
                }

                // Track info
                SetTrackData({
                    docLength: doc_data.length,
                    remark: appointmentRemarks,
                });
            });
    }, [])

    const getType = (val) => {
        const currDoc = Documents.filter(data => data.value == val)[0]
        return currDoc.title
    }

    const checkDocVerification = () => {
        const hasEmptyFileData = UploadedDocuments.some(data => {
            return !Boolean(data.doc_read_link) && Boolean(data.doc_type) && !Boolean(data.isNewDoc)
        })

        if (hasEmptyFileData) {
            dispatch({
                type: "RENDER_TOAST",
                payload: { message: "Please Select Document.", type: "error" },
            });

            return false;
        }

        return true;
    }

    return (
        <MainLayout>
            <>
                <div className={style.stepComponentContainer}>
                    <StepComponent stepsData={stepsData} />
                </div>
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
                                </div>
                                <p className={`text-center ${style.subtitle}`}>
                                    Submit Documents to Help Our Tax Experts Better Understand Your query
                                </p>
                                <p className={`text-center ${style.subtitle}`} style={{ fontSize: '0.9rem' }} >
                                    ( Allowed formats are - jpg, jpeg, png, tiff, zip and pdf, and max allowed file size is 5 MB.)
                                </p>
                                <br />
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>File Type</th>
                                            <th>File Name</th>
                                            <th style={{ width: 40 }}>&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {UploadedDocuments.map((v, j) => (
                                            <tr key={v.localId} className={style.trField} style={{ position: 'relative' }}>
                                                <td className="col-6" style={{ position: 'relative' }}>
                                                    {
                                                        v.user_document_id ? <span>{getType(v.document_data.document_uuid)}</span> : <ReactSimpleSelectForTaxPlanning
                                                            options={Documents.map((w) => {
                                                                return { title: w.title, value: w.value };
                                                            })}
                                                            value={v?.document_data?.document_uuid || v?.doc_type || ''}
                                                            onChange={(x) => {
                                                                setUploadedDocuments(prev => prev.map(data => {
                                                                    if (data.localId == v.localId) {
                                                                        return {
                                                                            ...data,
                                                                            doc_type: x
                                                                        }
                                                                    }
                                                                    return data;
                                                                }));
                                                            }}
                                                        />
                                                    }
                                                </td>
                                                <td className="col-6" >
                                                    <>
                                                        {(v.fileData || v.doc_read_link) && (
                                                            <div className="d-flex">
                                                                <>
                                                                    <div>
                                                                        <p className="mb-0">
                                                                            {v.doc_name}
                                                                        </p>
                                                                        {v.doc_read_link && <a
                                                                            className={`mb-0 ${style["preview-link"]}`}
                                                                            style={{ color: '#042b62' }}
                                                                            href={v.isNewDoc ? getObjUrl(v.fileData) : v.doc_read_link}
                                                                            target="_blank"
                                                                        >
                                                                            Preview
                                                                        </a>}
                                                                    </div>
                                                                </>
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

                                                    {
                                                        showUploadOption(v) && (
                                                            <>
                                                                <div
                                                                    className={`${style.buttonChoose} d-inline-flex pointer`}
                                                                    onClick={() => {
                                                                        const docUuid = v?.document_data?.document_uuid || v?.doc_type || "";
                                                                        if (!docUuid) {
                                                                        // if (v.document_data.document_uuid == "") {
                                                                            handleError();
                                                                        } else {
                                                                            document
                                                                                .getElementById(v.localId)
                                                                                .click();
                                                                        }
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="file"
                                                                        id={v.localId}
                                                                        onClick={function (e) {
                                                                            e.target.value = null
                                                                        }}
                                                                        onChange={(e) => {
                                                                            onFileChange(e, j, v.localId)
                                                                        }}
                                                                        style={{
                                                                            display: "none",
                                                                        }}
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
                                                            deleteOldPhoto(v.user_document_id, j, v.localId);
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                                    </div>


                                                </td>
                                                {hasError(v.localId) && <p style={{ position: 'absolute', color: 'red', top: '62%', bottom: '-55%', left: '0' }}>{exceedingSizeItemIndex.msg}</p>}
                                            </tr>

                                        ))}
                                    </tbody>
                                </table>
                                {
                                    UploadedDocuments.length < 5 && <div className="py-3">
                                        <p
                                            className={style.addMoreBtn}
                                            onClick={() => {
                                                setUploadedDocuments(prev => [...prev, { doc_type: "", localId: uuid() }]);
                                            }}
                                        >
                                            + Add More
                                        </p>
                                    </div>
                                }

                                <div className="py-3">
                                    <textarea
                                        rows="3"
                                        className={style.textarea}
                                        placeholder="If you have any comments or queries related to ITR, Please mention here!"
                                        value={remark ?? ''}
                                        onChange={(e) => {
                                            setRemark(e.target.value);
                                        }}
                                    ></textarea>
                                </div>
                                <div className="pt-3 d-flex gap-3 justify-content-center">
                                    <button
                                        disabled={isDisabled}
                                        style={{ margin: '0', padding: '0.5rem 1rem', width: '40%' }}
                                        type="button"
                                        className={style.btn}
                                        onClick={() => onFileUpload()}
                                    >
                                        Save & Continue
                                    </button>
                                    <Link to={`${process.env.PUBLIC_URL}/commondashboard`} style={{ textDecoration: 'none', width: '40%' }}>
                                        <button
                                            style={{ margin: '0', padding: '0.5rem 1rem', width: '100%' }}
                                            type="button"
                                            className={style.btnOutline}
                                        >
                                            Skip
                                        </button>
                                    </Link>

                                </div>

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
                <br /><br />
            </>
        </MainLayout>
    );
};


export default UploadDocsPage;




