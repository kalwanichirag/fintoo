import { useEffect, useState } from "react";
import * as BootModal from "react-bootstrap";
import Fetchreport from "./Fetchreport";
import MFReportModal from "./MFReport/MFReportModal";
import Stockreport from "./StockReport/Stockreport";
import PortfolioBalance from "../../PortfolioBalance";
import InitialView from "./InitialView";
import { useSelector } from "react-redux";
import { CHATBOT_BASE_API_URL, DATA_BELONGS_TO  } from "../../../constants";
import { fetchData, getParentUserId, setItemLocal } from "../../../common_utilities";
import * as toastr from "toastr";
import { saveScreenReport } from "../../../Services/ReportService";
import { GenerateParSnippet } from "../../../FrappeIntegration-Services/services/External-api/externalApi";
import { getFamilyMember } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";


const Reportmodal = (props) => {
    const [showSuccessPopupSpinner, setShowSuccessPopupSpinner] = useState(false);
    const [mFScreeningPDF, setMFScreeningPDF] = useState('');
    const [reportPDFUrl, setReportPDFUrl] = useState({
        MF: '',
        STOCK: ''
    });
    const [modalData, setModalData] = useState({
        mfAmount: null,
        stocksamount: null,
        totalAmount: null
    });

    const [investmentTypeView, setInvestmentTypeView] = useState('INITIAL');
    // const [investmentTypeView, setInvestmentTypeView] = useState('MF');

    const [areBothSelected, setAreBothSelected] = useState({
        both: false,
        prevInvestView: '',
        redirectFlow: false,
        stockStatus: null,
        MFStatus: null
    });

    const [commonUserData, setCommonUserData] = useState({});

    const par_report_data = useSelector((state) => state.par_report_data);
    const par_pan_mobile_prefilled = useSelector((state) => state.par_pan_mobile_prefilled);
    const member_data = useSelector((state) => state.member_data);

    const onCloseClick = () => {
        props.Closemodal();
        setShowSuccessPopupSpinner(false);
        setInvestmentTypeView('INITIAL');
        props.fetchReportsData ? props.fetchReportsData() : null;
    }

    const addMemberData = async () => {
        try {
            let customHeaders_getPan = {
                "Content-Type": "application/json",
                Accept: "application/json",
                // Authorization: "Bearer " + token,
            };
            let get_pan_status_payload = {
                "pan": par_report_data.pan,
                "user_id": par_report_data.user_id,
                "data_belongs_to": DATA_BELONGS_TO
            };

            // let getPanStatusPayload = {
            //     url: FINTOO_BASE_API_URL + "direct-mutual-fund/api/kyc/getpanstatus",
            //     headers: customHeaders_getPan,
            //     method: "POST",
            //     data: get_pan_status_payload
            // };

            // const getPanStatusRes = await fetchData(getPanStatusPayload);
            // if (getPanStatusRes["error_code"] == "100") {
            //     let user_name = getPanStatusRes['data']['kyc_name']
            //     let customHeader_updateBasic = {
            //         "Content-Type": "application/json",
            //         Accept: "application/json",
            //         // Authorization: "Bearer " + token,
            //     };
            //     let update_basic_details_payload = {
            //         "user_id": par_report_data.user_id.toString(),
            //         "pan": par_report_data.pan,
            //         "first_name": user_name,
            //         "kyc_user_name": user_name,
            //         "kyc_verified": 1,
            //         "is_direct": "1"
            //     };

            //     let updateBasicDetailsPayload = {
            //         url: FINTOO_BASE_API_URL + "direct-mutual-fund/api/user/updatebasicdetails",
            //         headers: customHeader_updateBasic,
            //         method: "POST",
            //         data: update_basic_details_payload
            //     };

            //     const updateBasicDetailsRes = await fetchData(updateBasicDetailsPayload);
            //     if (updateBasicDetailsRes["error_code"] == "100") {
            //         let user_name = getPanStatusRes['data']['kyc_name']
            //         let customHeaders_addMember = {
            //             "Content-Type": "application/json",
            //             Accept: "application/json",
            //             // Authorization: "Bearer " + token,
            //         };
            //         let existingMember = member_data.find(member => member.id === par_report_data.user_id);
            //         console.log("existingMember: ", existingMember);
            //         let parent_user_id = "";
            //         let member_user_id = "";
            //         let id = "";
            //         if (existingMember.parent_user_id == 0) {
            //             parent_user_id = "0";
            //             member_user_id = existingMember.id.toString();
            //             id = existingMember.id.toString();
            //         } else {
            //             parent_user_id = existingMember.parent_user_id.toString();
            //             member_user_id = existingMember.id.toString();
            //             id = existingMember.parent_user_id.toString();

            //         }
            //         let add_member_payload = {
            //             "id": id,
            //             "member_user_id": member_user_id,
            //             "parent_user_id": parent_user_id,
            //             "email": par_report_data.email,
            //             "mobile": par_report_data.mobile,
            //             "relation": "11",
            //             "type": "update"
            //         };

            //         let addMemberPayload = {
            //             url: FINTOO_BASE_API_URL + "direct-mutual-fund/api/user/addmember",
            //             headers: customHeaders_addMember,
            //             method: "POST",
            //             data: add_member_payload
            //         };

            //         const addMemberRes = await fetchData(addMemberPayload);
            //         if (addMemberRes["error_code"] == "100") {
            //         }

            //     }

            // }
        } catch (e) {
            console.log("Error Occured ===>>> ", e);
        }
    }

    const fetchMembers = async () => {
        try {
            const r = await getFamilyMember(getParentUserId())
            const all = r.data.map((v) => ({
                name: v.user_name,
                id: v.user_id,
                parent_user_id: v.parent_user_id,
                pan: v.pan,
                mobile: v.mobile,
                email: v.user_email,
                fp_user_details_id: v.fp_user_details_id,
            }));
            // setItemLocal("member", [...all]);

        } catch (e) { }

    };


    const generateParSnippet = async (investmentType) => {
        try {
            // let customHeaders = {
            //     "Content-Type": "application/json",
            //     Accept: "application/json",
            //     // Authorization: "Bearer " + token,
            // };
            let par_report_data_payload = {
                ...par_report_data,
                investment_type: investmentType,
                data_belongs_to:DATA_BELONGS_TO
            };

            // let payload = {
            //     url: CHATBOT_BASE_API_URL + "generateParSnippet/",
            //     headers: customHeaders,
            //     method: "POST",
            //     data: par_report_data_payload
            // };

            const generatePar = await GenerateParSnippet(par_report_data_payload);
            if (generatePar["status_code"] == "200") {
                if (!par_pan_mobile_prefilled) {
                    if (!areBothSelected.redirectFlow) {
                        // await addMemberData();
                        fetchMembers();
                    }
                }
                setMFScreeningPDF(generatePar['data']['pdf_snippet'])

                // setModalData((data) => ({ ...data, stocksamount: generatePar['data']['stock_holding_data']['total_current_value'] }))
                if (investmentType === 1) {
                    setModalData((data) => ({
                        ...data,
                        stocksamount: generatePar['data']['stock_holding_data']['total_current_value'],
                        mfAmount: null,
                        totalAmount: null

                    }));
                    setReportPDFUrl(prev => ({ ...prev, STOCK: generatePar['data']['pdf_snippet'] }));
                    saveScreenReport(par_report_data.user_id, 'PAR', generatePar['data']['stock_holding_data']['total_current_value'], generatePar['data']['pdf_snippet_wa'])
                } else if (investmentType === 2) {
                    setModalData((data) => ({
                        ...data,
                        mfAmount: generatePar['data']['mf_holding']['total_current_value'],
                        stocksamount: null,
                        totalAmount: null
                    }));
                    setReportPDFUrl(prev => ({ ...prev, MF: generatePar['data']['pdf_snippet'] }));
                    saveScreenReport(par_report_data.user_id, 'PAR', generatePar['data']['mf_holding']['total_current_value'], generatePar['data']['pdf_snippet_wa'])

                } else {
                    setModalData((data) => ({
                        ...data,
                        totalAmount: generatePar['data']['total_portfolio_value'],
                        stocksamount: null,
                        mfAmount: null
                    }));
                    saveScreenReport(par_report_data.user_id, 'PAR', generatePar['data']['total_portfolio_value'], generatePar['data']['pdf_snippet_wa'])
                }

                toastr.options.positionClass = "toast-bottom-left";
                toastr.success("Data fetched successfully");
                return true;

            } else if (generatePar["error_code"] == "103") {
                // toastr.options.positionClass = "toast-bottom-left";
                // toastr.error("Looks like you don't have any investments!");
                return false;

            } else {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("An error occurred while fetching your investment details. Please try again later. We apologise for the inconvenience.");
                return false;

            }

        } catch (e) {
            console.log("Error Occured ===>>> ", e);
        }
    }

    return (
        <>
            {
                showSuccessPopupSpinner ?
                    <PortfolioBalance
                        open={showSuccessPopupSpinner}
                        areBothSelected={areBothSelected}
                        report={true}
                        downloadPDF={mFScreeningPDF}
                        modalData={modalData}
                        isDashboard={true}
                        isContinueDisabled={true}
                        handleClose={() => { onCloseClick() }}
                    /> :

                    <BootModal.Modal
                        dialogClassName="Nsdlcsdl-modal-width"
                        className="Modalpopup"
                        show={props.open}
                        centered
                        animationDuration={0}
                    >
                        <div className="Flows">
                            {
                                investmentTypeView === 'INITIAL' && <InitialView setInvestmentTypeView={setInvestmentTypeView} setAreBothSelected={setAreBothSelected} Closemodal={onCloseClick} setModalData={setModalData} setReportPDFUrl={setReportPDFUrl} />
                            }
                            {
                                investmentTypeView === 'STOCK' &&
                                <Stockreport
                                    areBothSelected={areBothSelected}
                                    handleMfView={() => setInvestmentTypeView('MF')}
                                    handleShowSuccessPopup={() => setInvestmentTypeView('SUCCESSVIEW')}
                                    setInvestmentTypeView={setInvestmentTypeView}
                                    onclose={onCloseClick}
                                    setShowSuccessPopupSpinner={setShowSuccessPopupSpinner}
                                    setCommonUserData={setCommonUserData}
                                    setAreBothSelected={setAreBothSelected}
                                    generateParSnippet={generateParSnippet}
                                    modalData={modalData}
                                    reportPDFUrl={reportPDFUrl}
                                />
                            }
                            {
                                investmentTypeView === 'MF' &&
                                <MFReportModal
                                    Closemodal={onCloseClick}
                                    areBothSelected={areBothSelected}
                                    handleShowSuccessPopup={() => setInvestmentTypeView('SUCCESSVIEW')}
                                    setShowSuccessPopupSpinner={setShowSuccessPopupSpinner}
                                    commonUserData={commonUserData}
                                    generateParSnippet={generateParSnippet}
                                    setInvestmentTypeView={setInvestmentTypeView}
                                    setAreBothSelected={setAreBothSelected}
                                />
                            }
                            {
                                investmentTypeView === 'SUCCESSVIEW' &&
                                <Fetchreport
                                    Closemodal={onCloseClick}
                                    modalData={modalData}
                                    reportPDFUrl={reportPDFUrl}
                                    setModalData={setModalData}
                                    setMFScreeningPDF={setMFScreeningPDF}
                                    setShowSuccessPopupSpinner={setShowSuccessPopupSpinner}
                                    setAreBothSelected={setAreBothSelected}
                                    areBothSelected={areBothSelected}
                                    setInvestmentTypeView={setInvestmentTypeView}
                                    generateParSnippet={generateParSnippet}
                                />
                            }
                        </div>
                    </BootModal.Modal>
            }
        </>
    );
}

export default Reportmodal;
