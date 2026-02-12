import React, { useEffect, useRef, useState } from "react";
import { Modal as ReactModal } from "react-responsive-modal";
import Styles from "../report.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import PortfolioLayout from "../../../../components/Layout/Portfolio";
import SimpleReactValidator from "simple-react-validator";
import AllCategoriesView from "./AssetCategoriesDetailsViews/AllCategoriesView";
import MutualFundReportView from "./AssetCategoriesDetailsViews/MutualFundReportView";
import StocksHoldingsReportView from "./AssetCategoriesDetailsViews/StocksHoldingsReportView";
import FixedDepositBondsReportView from "./AssetCategoriesDetailsViews/FixedDepositBondsReportView";
import AlternateReportView from "./AssetCategoriesDetailsViews/AlternateReportView";
import {
    getParentUserId,
    getPublicMediaURL,
    indianRupeeFormat,
    fetchMembers,
    getUserId,
    getItemLocal,
} from "../../../../common_utilities";
import style from "./style.module.css";
import FintooButton from "../../../../components/HTML/FintooButton";
import apiClient from "../../../../FrappeIntegration-Services/services/apiClient";
import { getFamilyMember } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { portfolioReportEndpoints, financialplanningAssetEndpoints, DATA_BELONGS_TO } from "../../../../constants";
import { useDispatch } from "react-redux";
import toastr from 'toastr';
import PortfolioGraph from "./PortfolioGraph";
import Calendar from "react-calendar";
import moment from "moment";
import FintooLoader from "../../../../components/FintooLoader";
import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import { formatDatefun, formatDate } from "../../../../Utils/Date/DateFormat";
import { get } from "react-scroll/modules/mixins/scroller";

const reportTypeOptions = [
    { value: "", label: "Select" },
    { value: "Summary", label: "Summary Report" },
    { value: "Detailed", label: "Detail Report" },
];

const initialValues = {
    reportType: "",
    assetCategory: "all",
    registrar: "all",
    fromDate: "",
    toDate: "",
    member: 0
};

const AssetBox = ({ title, amount, percentage, color }) => {
    return (
        <div className={style.assetBoxDv}>
            <p className={style.assetBoxTitle}>{title}</p>
            <p className={style.assetBoxAmount}>
                {indianRupeeFormat(amount)}
                <span>({percentage}%)</span>
            </p>
        </div>
    );
};

function PortfolioHoldingsReportDetails() {
    const dispatch = useDispatch();
    const [, forceUpdate] = useState(0);
    const [formData, setFormData] = useState(initialValues);
    useEffect(() => {
        getMemberPan()
    }, [formData])
    const [noteModal, setNoteModal] = useState(false);
    const [currentReportView, setCurrentReportView] = useState(null);
    const [memberDropdownData, setMemberDropdownData] = useState([
        { label: "Self", value: getUserId() }
    ]);
    const [mainData, setMainData] = useState(null);
    const [hasData, setHasData] = useState(null);

    const [downloadReport, setDownloadReport] = useState(false);
    const [shareReport, setShareReport] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isReportGenerated, setIsReportGenerated] = useState(false);
    const [reportTitle, setReportTitle] = useState({});
    const [assetCategoryOptions, setAssetCategoryOptions] = useState([]);
    const [userExternalFundData, setUserExternalFundData] = useState([]);
    const [mutualFundReportGenerated, setMutualFundReportGenerated] = useState(false);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const reportType = params.get('report_type');


    const navigate = useNavigate();
    const membersPan = useRef({});
    const registrarList = [
        { value: "all", label: "All" },
        { value: "fintoo", label: "Fintoo" },
        { value: "other", label: "Other" },
    ];

    const simpleValidator = useRef(new SimpleReactValidator());

    const validateForm = () => {
        forceUpdate((v) => v + 1);
        simpleValidator.current.showMessages();
        if (simpleValidator.current.allValid() == true) {
            return true;
        }
        return false;
    };

    const getMemberData = async () => {
        try {
            const response = await getFamilyMember(getParentUserId());
            // Check for both string and number status codes
            if (response.status_code === 200 || response.status_code === "200") {
                if (response.data && Array.isArray(response.data)) {
                    const memberOptions = [
                        { label: "Family", value: 0 },
                        ...response.data.map((member) => ({
                            label: member.user_name || member.user_email || member.NAME || 'Unknown Member',
                            value: member.user_id || member.id
                        })),
                    ];
                    setMemberDropdownData(memberOptions);
                } else {
                    // If data is not an array, set default options without showing error
                    console.warn("Member data is not in expected format:", response.data);
                    setMemberDropdownData([
                        { label: "Family", value: 0 },
                        { label: "Self", value: getUserId() }
                    ]);
                }
            } else {
                // Only show error for actual API failures, not for data format issues
                console.warn("API returned non-200 status:", response.status_code);
                setMemberDropdownData([
                    { label: "Family", value: 0 },
                    { label: "Self", value: getUserId() }
                ]);
            }
        } catch (e) {
            console.error("Error in getMemberData:", e);
            // Only show error toast for network/API failures, not for data parsing issues
            if (e.name === 'TypeError' || e.message?.includes('fetch') || e.message?.includes('network')) {
                dispatch({
                    type: "RENDER_TOAST",
                    payload: {
                        message: "Network error. Please check your connection and try again.",
                        type: "error",
                    },
                });
            }
            // Set default member data
            setMemberDropdownData([
                { label: "Family", value: 0 },
                { label: "Self", value: getUserId() }
            ]);
        }
    };

    useEffect(() => {
        loadInitialData();

        // Reset Mutual Fund report generated flag on component mount
        // This handles the case when user comes back from link your holdings page
        setMutualFundReportGenerated(false);
    }, []);

    useEffect(() => {
        if (downloadReport) {
            goToGenerate();
            setDownloadReport(false);
        }
        if (shareReport) {
            goToGenerate();
            setShareReport(false);
        }
    }, [downloadReport, shareReport]);

    const loadInitialData = () => {
        getAssetsList();
        getMemberData();
        getMemberPan();
    };

    const getMemberPan = async () => {
        try {
            let memberData = await fetchMembers();

            const selectedMemberId = formData.member
            const newMemberArr = [];

            // loop only over the selected member
            for (const v of memberData) {
                if (selectedMemberId && v.id !== selectedMemberId) continue;
                
                if (v.pan) {
                    try {
                        
                        const response = await apiClient(portfolioReportEndpoints.GET_SC_CHECK_STATUS, {
                            method: 'POST',
                            body: JSON.stringify({
                                pan: v.pan,
                                data_belongs_to: DATA_BELONGS_TO,
                            }),
                        });
                       
                        // Check for both string and number status codes
                        if ((response.status_code === "200" || response.status_code === 200) && response.data) {
                            if (Array.isArray(response.data)) {
                                response.data.forEach((holding) => {
                                    newMemberArr.push({
                                        name: `${v.user_name || ''}`.trim(),
                                        email: v.user_email || '',
                                        pan: holding.holding_pan,
                                        status: holding.holding_status,
                                        created_datetime: holding.creation,
                                        updated_datetime: holding.modified,
                                    });
                                });
                            } else {
                                console.warn(`Unexpected data format for PAN ${v.pan}:`, response.data);
                            }
                        } else {
                            console.warn(`API returned non-200 status for PAN ${v.pan}:`, response.status_code);
                        }
                    } catch (error) {
                        // Only log the error, don't show to user for non-critical issues
                        console.warn(`Error fetching data for PAN ${v.pan}:`, error);
                    }
                }
            }
            setUserExternalFundData(newMemberArr);

            // Reset Mutual Fund report generated flag if user has recent successful updates
            if (formData.assetCategory === "mutual_fund" && newMemberArr.length > 0) {
                const hasRecentSuccess = newMemberArr.some(data => {
                    if (!data.updated_datetime) return false;
                    const updateTime = new Date(data.updated_datetime);
                    const now = new Date();
                    const hoursDiff = (now - updateTime) / (1000 * 60 * 60);
                    return hoursDiff < 24 && data.status === "Success";
                });

                if (hasRecentSuccess) {
                    setMutualFundReportGenerated(false);
                }
            }
        } catch (err) {
            // Only log the error, don't show to user for non-critical issues
            console.warn("Error in getMemberPan:", err);
            setUserExternalFundData([]);
        }
    };

    const getAssetsList = async () => {
        setAssetCategoryOptions([
            { value: "all", label: "All" },
            { value: "mutual_fund", label: "Mutual Fund" },
            { value: "stocks", label: "Stocks" },
            { value: "us_equity", label: "US Equity" },
            { value: "aif_equity", label: "AIF/Unlisted Equity" },
            { value: "fd_bond", label: "FD & Bonds" },
            { value: "govt_scheme", label: "Govt Scheme" },
            { value: "real_estate", label: "Real Estate" },
            { value: "alternate", label: "Alternate" },
            { value: "gold", label: "Gold" },
            { value: "liquid", label: "Liquid" }
        ]);
    };

    const generateSummaryReportDefaultResponse = {
        overall_portfolio: { inv_data: [] },
    };

    const getEmptyErrorMessage = () => {
        let data;

        // Determine report type for title
        const reportTypeText = reportType === 'detailed' ? 'Transaction' : 'Holdings';

        switch (reportTitle?.value) {
            case "us_equity":
                data = {
                    title: `US Equity Portfolio ${reportTypeText} Report`,
                    link: "direct-mutual-fund/portfolio/dashboard?assetTabNumber=11",
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your US Equity data to display.
                                </strong>
                            </p>
                        </>
                    ),
                    buttonText: "Add US Equity",
                };
                break;
            case "mutual_fund":
                data = {
                    title: `Mutual Fund Portfolio ${reportTypeText} Report`,
                    link: "direct-mutual-fund/portfolio/link-your-holdings",
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your Mutual Fund data to display. You can fetch your existing Mutual Fund Holdings.
                                </strong>
                            </p>
                            
                        </>
                    ),
                    buttonText: "Fetch Holdings Now",
                };
                break;
            case "stocks":
                data = {
                    title: `Stocks Portfolio ${reportTypeText} Report`,
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your Stocks data to display.
                                </strong>
                            </p>
                        </>
                    ),
                };
                break;
            case "fd_bond":
                data = {
                    title: `FD & Bonds Portfolio ${reportTypeText} Report`,
                    link: "direct-mutual-fund/portfolio/dashboard?assetTabNumber=3",
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your FD data to display.
                                </strong>
                            </p>
                        </>
                    ),
                    buttonText: "Add FD & Bonds",
                };
                break;
            case "govt_scheme":
                data = {
                    title: `Government Schemes Portfolio ${reportTypeText} Report`,
                    link: "direct-mutual-fund/portfolio/dashboard?assetTabNumber=4",
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your Govt. Schemes data to display.
                                </strong>
                            </p>
                        </>
                    ),
                    buttonText: "Add Existing Scheme",
                };
                break;
            case "alternate":
                data = {
                    title: `Alternate Investment Portfolio ${reportTypeText} Report`,
                    link: "direct-mutual-fund/portfolio/dashboard?assetTabNumber=6",
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your Alternate data to display.
                                </strong>
                            </p>
                        </>
                    ),
                    buttonText: "Add Alternate",
                };
                break;
            case "gold":
                data = {
                    title: `Gold Assets Portfolio ${reportTypeText} Report`,
                    link: "direct-mutual-fund/portfolio/dashboard?assetTabNumber=7",
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your Gold Assets data to display.
                                </strong>
                            </p>
                        </>
                    ),
                    buttonText: "Add Gold Assets",
                };
                break;
            case "real_estate":
                data = {
                    title: `Real Estate Portfolio ${reportTypeText} Report`,
                    link: "direct-mutual-fund/portfolio/dashboard?assetTabNumber=5",
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your Real Estate data to display.
                                </strong>
                            </p>
                        </>
                    ),
                    buttonText: "Add Existing Real Estate",
                };
                break;
            case "liquid":
                data = {
                    title: `Liquid Assets Portfolio ${reportTypeText} Report`,
                    link: "direct-mutual-fund/portfolio/dashboard?assetTabNumber=8",
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your Liquid Assets data to display.
                                </strong>
                            </p>
                        </>
                    ),
                    buttonText: "Add Liquid Assets",
                };
                break;
            case "insurance":
                data = {
                    title: `Insurance Portfolio ${reportTypeText} Report`,
                    link: "direct-mutual-fund/portfolio/dashboard?assetTabNumber=2",
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your Insurance data to display.
                                </strong>
                            </p>
                        </>
                    ),
                    buttonText: "Add Insurance",
                };
                break;
            case "post_office":
                data = {
                    title: `Government Schemes Portfolio ${reportTypeText} Report`,
                    link: "direct-mutual-fund/portfolio/dashboard/",
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your Govt Scheme data to display.
                                </strong>
                            </p>
                        </>
                    ),
                    buttonText: "Add Govt. Scheme",
                };
                break;
            case "others":
                data = {
                    title: `Other Assets Portfolio ${reportTypeText} Report`,
                    buttonText: "Add Other Assets",
                    link: "direct-mutual-fund/portfolio/dashboard/",
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your Others data to display.
                                </strong>
                            </p>
                        </>
                    ),
                };
                break;
            case "aif_equity":
                data = {
                    title: `Unlisted/AIF Equity Portfolio ${reportTypeText} Report`,
                    buttonText: "Add Unlisted/AIF Equity",
                    link: "direct-mutual-fund/portfolio/dashboard?assetTabNumber=10",
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your Unlisted/AIF equity data to display.
                                </strong>
                            </p>
                        </>
                    ),
                };
                break;
            default:
                data = {
                    title: `Portfolio ${reportTypeText} Report`,
                    link: "direct-mutual-fund/portfolio/dashboard/",
                    message: (
                        <>
                            <p>
                                <strong>
                                    Currently it seems we don't have your data to display.
                                </strong>
                            </p>
                        </>
                    ),
                };
                break;
        }
        return data;
    };

    const goToGenerate = async () => {
        try {
            if (validateForm()) {
                setIsLoading(true);
                // set report title here
                let title = {};
                let from_date = formData.fromDate;
                let to_date = formData.toDate;
                let api_url = "";
                try {
                    title = assetCategoryOptions.filter(
                        (v) => v.value == (formData.assetCategory || "all")
                    )[0];
                } catch {
                    // do nothing
                }
                setReportTitle(title);
                // end
                // let isDownloadingReport = downloadReport;
                let isDownloadingReport = true;
                let isShareReport = shareReport;

                const finalFormData = {
                    data_belongs_to: DATA_BELONGS_TO,
                };
                // if (isDownloadingReport == false) {
                //   finalFormData.action = "viewdata";
                // }

                // if (isShareReport == true) {
                //   finalFormData.action = "email";
                // }
                finalFormData.asset_type = formData.assetCategory;

                if (formData.assetCategory == "mutual_fund") {
                    switch (formData.registrar) {
                        case "all":
                            finalFormData.fund_registrar = "all";
                            break;
                        case "fintoo":
                            finalFormData.fund_registrar = "all";
                            finalFormData.ecas = "0";
                            break;
                        case "other":
                            finalFormData.fund_registrar = "ecas";
                            finalFormData.ecas = "1";
                            break;
                    }
                }
                const selectedUserId = formData.member || getParentUserId();
                finalFormData.user_id = selectedUserId;

                if (formData.member == 0 || formData.member == "0") {
                    finalFormData.family = "1";
                }
                
                if (from_date && to_date) {
                    finalFormData.from_date = from_date;
                    finalFormData.to_date = to_date;
                } else if (from_date && !to_date) {
                    finalFormData.from_date = from_date;
                    finalFormData.to_date = new Date().toISOString().split("T")[0];
                } else if (!from_date && to_date) {
                    finalFormData.from_date = "1970-01-01";
                    finalFormData.to_date = to_date;
                }

                // Map Investment Platform (registrar) to fund_registrar and ecas
                let fund_registrar = "all";
                let ecas = undefined;

                if (formData.assetCategory === "mutual_fund") {
                    switch (formData.registrar) {
                        case "all":
                            fund_registrar = "all";
                            // No ecas key for "all"
                            break;
                        case "fintoo":
                            fund_registrar = "all";
                            ecas = "0";
                            break;
                        case "other":
                            fund_registrar = "ecas";
                            ecas = "1";
                            break;
                        default:
                            fund_registrar = "all";
                    }
                }
                finalFormData.report_type = reportType === "summary" ? "Summary" : "Detail";
                finalFormData.fund_registrar = fund_registrar;
                finalFormData.ecas = ecas;
                
                // Use the correct API endpoint - single endpoint for both summary and detailed reports
                const apiEndpoint = portfolioReportEndpoints.PORTFOLIO_REPORT_API;

                const r = await apiClient(apiEndpoint, {
                    method: "POST",
                    body: JSON.stringify(finalFormData),
                });

                if (isDownloadingReport) {
                    if (r.status_code == "400") {
                        setMainData(null);
                        setHasData(false);
                        setIsLoading(false);
                        return;
                    } else if (r.status_code == "200" && r.data) {
                        setHasData(true);
                        window.open(r.data, "_blank");
                        toastr.success("Report generated successfully!");
                        if (formData.assetCategory === "mutual_fund") {
                            setMutualFundReportGenerated(true);
                        }
                    } else {
                        toastr.error(r. message || "Failed to generate report. Please try again.");
                    }
                } else if (isShareReport) {
                    toastr.success("Email sent successfully.");
                } else {
                    if (r.data?.[0]) {
                        setMainData(r.data[0]);
                        setHasData(true);
                        toastr.success("Report data loaded successfully!");
                        if (formData.assetCategory === "mutual_fund") {
                            setMutualFundReportGenerated(true);
                        }
                    } else {
                        setMainData(null);
                        setHasData(false);
                    }
                }
                setIsLoading(false);
            } else {
                throw "Form error";
            }
        } catch (error) {
            console.error("Error in goToGenerate:", error);
            toastr.error("Failed to generate portfolio report. Please try again.");
            setIsLoading(false);
        }
    };

    const onDateAndSelectInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    }

    const [openCalendar, setOpenCalendar] = useState(false);
    const refCalendarBox = useRef();

    simpleValidator.current.purgeFields();

    const showMemberTable = () => {
        // Only show table for Mutual Fund category
        if (reportType == "summary" || reportType == "detailed") {
            if (formData.assetCategory === "mutual_fund" && (formData.registrar == 'all' || formData.registrar == 'other')) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    const showGenerateBtn = () => {
        // For Mutual Fund reports, check if report has been generated before
        if (formData.assetCategory === "mutual_fund" && mutualFundReportGenerated) {
            // Check if user has recently updated their holdings (within last 24 hours)
            const hasRecentUpdate = userExternalFundData.some(data => {
                if (!data.updated_datetime) return false;
                const updateTime = new Date(data.updated_datetime);
                const now = new Date();
                const hoursDiff = (now - updateTime) / (1000 * 60 * 60);
                return hoursDiff < 24 && data.status === "Success";
            });

            // If user has recent update, allow generation again
            if (hasRecentUpdate) {
                return true;
            }

            return false; // Show attention popup
        }

        if (!showMemberTable()) {
            return true;
        } else {
            return !userExternalFundData.some(data =>
                data.status === "Pending" || (new Date() - new Date(data.updated_datetime)) > 1 * 24 * 60 * 60 * 1000
            );
        }
    }

    const handleGenerateClick = () => {
        if (!showGenerateBtn()) {
            setNoteModal(true);
        } else {
            goToGenerate()
        }
    }

    const handleRefreshClick = (member) => {
        // Directly navigate to the link your holdings page
        navigate(
            process.env.PUBLIC_URL +
            "/direct-mutual-fund/portfolio/link-your-holdings"
        );
    }

    useEffect(() => {
        setMainData(null);
        setHasData(null);
        // Reset Mutual Fund report generated flag when asset category or member changes
        setMutualFundReportGenerated(false);
    }, [formData.assetCategory, formData.member, formData.reportType])

    return (
        <PortfolioLayout>
            <FintooLoader isLoading={isLoading} />
            <div className={`${Styles.ReportDetailSection}`}>
                <div>
                    <Link
                        className="text-decoration-none"
                        to={`${process.env.PUBLIC_URL}/commondashboard/Report`}
                    >
                        <img
                            className="pointer"
                            src={
                                process.env.REACT_APP_STATIC_URL + "media/DMF/left-arrow.svg"
                            }
                            width={25}
                        />
                    </Link>
                </div>
                <div className={`row ${Styles.PortfolioReportSection}`}>
                    <div className="col-12  mt-md-5 mt-4">
                        <div className={`pb-2 ${Styles.insideTabBoxd}`}>
                            <div className="d-flex align-items-center">
                                <div>
                                    <img
                                        src={
                                            process.env.REACT_APP_STATIC_URL +
                                            "media/DMF/Report/01_capital_gains_Loss_report.svg"
                                        }
                                        width={50}
                                    />
                                </div>
                                <div className={`pt-3 ${Styles.ReportName}`}>
                                    {reportType === 'detailed'
                                        ? 'Portfolio Transaction Report'
                                        : 'Portfolio Holdings Report'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="row mt-4">
                        {/* <div className="col">
              <div className={`${Styles.ReportLabel}`}>Type of Report</div>
              <div className="mt-2">
                <Select
                  className="box-shadow-none border-0"
                  classNamePrefix="ReportSelect"
                  isSearchable={false}
                  placeholder="Select.."
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,

                      primary: "#042b62",
                    },
                  })}
                  options={reportTypeOptions}
                  value={
                    reportTypeOptions.filter(
                      (v) => v.value === formData.reportType
                    )[0] ?? ""
                  }
                  onChange={(e) => {
                    onDateAndSelectInputChange("reportType", e.value);
                  }}
                />
              </div>
              {simpleValidator.current.message(
                "reportType",
                formData.reportType,
                "required",
                { messages: { required: "This field is required" } }
              )}
            </div> */}
                        <div className="col">
                            <div className={`${Styles.ReportLabel}`}>Member</div>

                            <div className="mt-2">
                                <Select
                                    value={
                                        memberDropdownData.filter(
                                            (v) => v.value == formData.member
                                        )[0] || null
                                    }
                                    className="box-shadow-none border-0"
                                    classNamePrefix="ReportSelect"
                                    isSearchable={false}
                                    options={memberDropdownData}
                                    placeholder="Select.."
                                    theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 0,
                                        colors: {
                                            ...theme.colors,
                                            primary: "#042b62",
                                        },
                                    })}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            member: e.value,
                                        }));
                                    }}
                                />
                            </div>
                            {simpleValidator.current.message(
                                "assetCategory",
                                formData.assetCategory,
                                "required"
                            )}
                        </div>
                        <div className="col">
                            <div className={`${Styles.ReportLabel}`}>Asset Category</div>

                            <div className="mt-2">
                                <Select
                                    className="box-shadow-none border-0"
                                    classNamePrefix="ReportSelect"
                                    isSearchable={false}
                                    options={assetCategoryOptions}
                                    placeholder="Select.."
                                    theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 0,
                                        colors: {
                                            ...theme.colors,

                                            primary: "#042b62",
                                        },
                                    })}
                                    value={
                                        assetCategoryOptions.filter(
                                            (v) => v.value == (formData.assetCategory || "all")
                                        )[0] || null
                                    }
                                    onChange={(e) => {
                                        onDateAndSelectInputChange("assetCategory", e.value);
                                    }}
                                />
                            </div>
                            {simpleValidator.current.message(
                                "assetCategory",
                                formData.assetCategory,
                                "required"
                            )}
                        </div>
                        <div className="col">
                            {formData?.assetCategory == "mutual_fund" && (
                                <>
                                    <div className="my-2">
                                        <div className={`${Styles.ReportLabel}`}>Investment Platform</div>
                                        <div className="mt-2">
                                            <Select
                                                className="box-shadow-none border-0"
                                                classNamePrefix="ReportSelect"
                                                isSearchable={false}
                                                options={registrarList}
                                                placeholder="Select.."
                                                theme={(theme) => ({
                                                    ...theme,
                                                    borderRadius: 0,
                                                    colors: {
                                                        ...theme.colors,

                                                        primary: "#042b62",
                                                    },
                                                })}
                                                value={
                                                    registrarList.filter(
                                                        (v) => v.value === (formData.registrar ?? "all")
                                                    )[0]
                                                }
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        registrar: e.value,
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* From Date */}
                                    <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        {/* <div className="mt-2">
                      <label className="me-3">
                        <input
                          type="radio"
                          value="as_on_date"
                          // checked={dateType === 'as_on_date'}
                          onChange={(e) => onDateAndSelectInputChange('as_on_date', formatDate(e))}
                        />{' '}
                        As on Date
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="custom_date"
                          // checked={dateType === 'custom_date'}
                          onChange={(e) => onDateAndSelectInputChange('custom_date', formatDate(e))}
                        />{' '}
                        Custom Date
                      </label>
                    </div> */}
                                        <div>
                                            <div className={`${Styles.ReportLabel}`}>From Date</div>
                                            <div className="mt-2">
                                                <FintooDatePicker
                                                    dateFormat="dd-MM-yyyy"
                                                    selected={formData.fromDate === "" ? new Date('1970-01-01') : new Date(formData.fromDate)}
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    name='fromDate'
                                                    maxDate={new Date()}
                                                    customClass="datePickerDMF"
                                                    onChange={(e) => onDateAndSelectInputChange('fromDate', formatDate(e))}
                                                    onKeyDown={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className={`${Styles.ReportLabel}`}>To Date</div>
                                            <div className="my-2">
                                                <FintooDatePicker
                                                    dateFormat="dd-MM-yyyy"
                                                    selected={formData.toDate === "" ? new Date() : new Date(formData.toDate)}
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    name='toDate'
                                                    maxDate={new Date()}
                                                    minDate={formData.fromDate === "" ? new Date('1970-01-01') : new Date(formData.fromDate)}
                                                    customClass="datePickerDMF"
                                                    onChange={(e) => onDateAndSelectInputChange('toDate', formatDate(e))}
                                                    onKeyDown={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="col">
                            <div className={`${Styles.ReportGenOption}`}>
                                <div
                                    className="d-md-block d-none"
                                    style={{
                                        height: "2.3rem",
                                    }}
                                ></div>
                                {
                                    <button
                                        onClick={() => handleGenerateClick()}
                                        className={`${Styles.ReportButton}`}
                                    >
                                        Generate
                                    </button>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                {mainData ? (
                    <>
                        {/* <div className="mt-4">
              <>
                <div className="row my-4">
                  <div className="col-4">
                    <p className={style.reportTextDate}>
                      Report Generated on{" "}
                      <strong>{mainData?.report_date}</strong>
                    </p>
                  </div>
                  <div className={`${style.bottomBtnDv} col-6`}>
                    <div className="d-flex align-items-center">
                      <div
                        className="d-flex align-items-center pointer"
                        onClick={() => setDownloadReport(true)}
                      >
                        <p className="m-0">Download Now</p>
                        <span className="ms-1">
                          <img
                            src={getPublicMediaURL(
                              "/static/media/icons/download-ico.png"
                            )}
                          />
                        </span>
                      </div>
                      <div className={style.emptyLine}></div>
                      <div
                        className="d-flex align-items-center pointer"
                        onClick={() => setShareReport(true)}
                      >
                        <p className="m-0">Share via Email</p>
                        <span className="ms-1">
                          <img
                            className={style.btnIcons}
                            src={getPublicMediaURL(
                              "/static/media/icons/email-ico.png"
                            )}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </div> */}
                    </>
                ) :
                    <>
                        {
                            (hasData === false) && (
                                <div className={style.emptyStateContainer}>
                                    {/* Dynamic Title based on Asset Category */}
                                    <div className={style.emptyStateTitle}>
                                        {getEmptyErrorMessage()?.title || "Portfolio Report"}
                                    </div>

                                    {/* Message */}
                                    <div className={style.emptyStateMessage}>
                                        {"message" in getEmptyErrorMessage() &&
                                            getEmptyErrorMessage()["message"]}
                                    </div>

                                    {/* Action Button */}
                                    {"buttonText" in getEmptyErrorMessage() && (
                                        <div className="text-center">
                                            <Link
                                                to={
                                                    process.env.PUBLIC_URL +
                                                    "/" +
                                                    getEmptyErrorMessage()["link"]
                                                }
                                                className={style.emptyStateButton}
                                            >
                                                {getEmptyErrorMessage()["buttonText"]}
                                            </Link>
                                        </div>
                                    )}

                                    {/* Investment Data Illustration */}
                                    <div className="text-center">
                                        <img
                                            className={style.emptyStateImage}
                                            src={getPublicMediaURL(
                                                "static/media/icons/Investment-data.png"
                                            )}
                                            width={500}
                                            alt="Investment Data Illustration"
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </>
                }
                {showMemberTable() && (
                    <>
                        {
                            userExternalFundData.length > 0 &&
                            <div className="col-12 col-md-10 mt-md-5 mt-4">
                                <table className="bgStyleTable text-center">
                                    <tbody>
                                        <tr>
                                            <th>Member</th>
                                            <th>Status</th>
                                            <th>
                                                Updated Date
                                            </th>
                                            <th>Action</th>
                                        </tr>
                                        <>
                                            {userExternalFundData?.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{user.name ?? "N/A"}</td>
                                                    <td>{user.status ?? "N/A"}</td>
                                                    <td>{moment(user.updated_datetime).format("DD-MM-YYYY")}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => handleRefreshClick(user)}
                                                        >
                                                            {user?.updated_datetime ? (
                                                                <>Refresh</>
                                                            ) : (
                                                                <>Link your holdings</>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    </tbody>
                                </table>
                            </div>
                        }
                    </>)}


                {/* {"t_inv_val" in mainData && (
          <>
            <p className="mt-5 fw-bold mb-0">{"Asset Category: "+reportTitle?.label}</p>
            <div className="mt-4">
              {Number(mainData.t_inv_val) == 0 &&
                Number(mainData.t_curr_val) == 0 ? (
                <>
                  <div className="my-4">
                    <div className="text-center fw-bold mb-0 report-section-paragraphs">
                      {"message" in getEmptyErrorMessage() &&
                        getEmptyErrorMessage()["message"]}
                    </div>

                    {"buttonText" in getEmptyErrorMessage() && (
                      <div className="text-center mt-4">
                        <Link
                          to={
                            process.env.PUBLIC_URL +
                            "/" +
                            getEmptyErrorMessage()["link"]
                          }
                          className="fintoo-link-button"
                        >
                          {getEmptyErrorMessage()["buttonText"]}
                        </Link>
                      </div>
                    )}
                    <img
                      className={`${style["no-results"]} mt-4`}
                      src={getPublicMediaURL(
                        "static/media/icons/Investment-data.png"
                      )}
                      width={500}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="row my-4">
                    <div className="col-6">
                      <div className={style.assetBoxTableWrapper}>
                        <table className={style.assetBoxTable}>
                          <tbody>
                            {mainData?.inv_data
                              ?.reduce((rows, v, index, array) => {
                                if (index % 3 === 0) {
                                  // Group items in pairs for each row
                                  rows.push(array.slice(index, index + 3));
                                }
                                return rows;
                              }, [])
                              .map((pair, rowIndex) => (
                                <tr key={rowIndex}>
                                  {pair.map((v, colIndex) => (
                                    <td key={colIndex}>
                                      <AssetBox
                                        title={v.label}
                                        amount={v.inv_val}
                                        percentage={v.perc}
                                        color="blue"
                                      />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-6">
                      <PortfolioGraph
                        valuation={mainData?.t_curr_val}
                        graphData={(mainData?.inv_data || [])
                          .filter((v) => Number(v.perc) > 0)
                          .map((v) => ({
                            name: v.label,
                            y: Number(v.perc),
                          }))}
                      />
                    </div>
                  </div>

                  <div className="row my-4">
                    <div className="col-4">
                      <p className={style.reportTextDate}>
                        Report Generated on{" "}
                        <strong>{mainData?.report_date}</strong>
                      </p>
                    </div>
                    <div className={`${style.bottomBtnDv} col-6`}>
                      <div className="d-flex align-items-center">
                        <div
                      className={`${style.shareNowDv} d-flex align-items-center position-relative`}
                    >
                      <p className="m-0">Share Now</p>
                      <span className="ms-1">
                        <img
                          src={getPublicMediaURL(
                            "/static/media/icons/share-ico.png"
                          )}
                        />
                      </span>
                      <div className={style.showMoreDv}>
                        <div className={style.showMoreDvInner}>
                          <div className="row">
                            <div
                              className={`col ${style.borderDvRight} ${style.insideWrapper}`}
                            >
                              <div>
                                <p className="m-0 text-center">
                                  <img
                                    className={style.btnIcons}
                                    src={getPublicMediaURL(
                                      "/static/media/icons/email-ico.png"
                                    )}
                                  />
                                </p>
                                <p className="m-0 mt-2 text-center">
                                  Share via Email
                                </p>
                              </div>
                            </div>
                            <div className={`col ${style.insideWrapper}`}>
                              <div>
                                <p className="m-0 text-center">
                                  <img
                                    className={style.btnIcons}
                                    src={getPublicMediaURL(
                                      "/static/media/icons/whatsapp-ico.png"
                                    )}
                                  />
                                </p>
                                <p className="m-0 mt-2 text-center">
                                  Share on WhatsApp
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={style.emptyLine}></div>
                        <div
                          className="d-flex align-items-center pointer"
                          onClick={() => setDownloadReport(true)}
                        >
                          <p className="m-0">Download Now</p>
                          <span className="ms-1">
                            <img
                              src={getPublicMediaURL(
                                "/static/media/icons/download-ico.png"
                              )}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={`${Styles.categoriesDataContainer}`}>
            {currentReportView === "All" && (
              <AllCategoriesView
                selectedCategoryName={
                  AssetCategoryOptions.filter(
                    (v) => v.value === currentReportView
                  )[0]?.label ?? ""
                }
              />
            )}
            {currentReportView === "MutualFund" && (
              <MutualFundReportView
                selectedCategoryName={
                  AssetCategoryOptions.filter(
                    (v) => v.value === currentReportView
                  )[0]?.label ?? ""
                }
              />
            )}
            {currentReportView === "StocksHoldings" && (
              <StocksHoldingsReportView
                selectedCategoryName={
                  AssetCategoryOptions.filter(
                    (v) => v.value === currentReportView
                  )[0]?.label ?? ""
                }
              />
            )}
            {currentReportView === "FixedDepositBonds" && (
              <FixedDepositBondsReportView
                selectedCategoryName={
                  AssetCategoryOptions.filter(
                    (v) => v.value === currentReportView
                  )[0]?.label ?? ""
                }
              />
            )}
            {currentReportView === "Alternate" && (
              <AlternateReportView
                selectedCategoryName={
                  AssetCategoryOptions.filter(
                    (v) => v.value === currentReportView
                  )[0]?.label ?? ""
                }
              />
            )}
          </div>
          </>
        )} */}
            </div>
            <ReactModal
                classNames={{
                    modal: "ModalpopupContentWidth",
                }}
                open={noteModal}
                showCloseIcon={false}
                center
                animationDuration={0}
                closeOnOverlayClick={false}
                large
            >
                <div className="text-center">
                    <h3 className="HeaderText">Attention !</h3>
                    <div className="">
                        <div
                            className="PopupImg"
                            style={{ width: "40%", margin: "0 auto" }}
                        >
                            <img
                                style={{ width: "100%" }}
                                src={
                                    process.env.PUBLIC_URL +
                                    "/static/media/DMF/SelectingTeam.svg"
                                }
                            />
                        </div>
                        <div className="p-2">
                            <p
                                className="PopupContent"
                                style={{
                                    fontSize: "1.3rem",
                                    fontWeight: "normal",
                                    padding: "0 1rem",
                                    width: "90%",
                                    margin: "0 auto",
                                }}
                            >
                                To ensure your holdings report reflects the most accurate mutual fund data, please click the refresh button to sync your external holdings with the latest information as of today.
                            </p>
                        </div>
                        <div
                            className="ButtonBx aadharPopUpFooter"
                            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
                        >
                            <button
                                className="ReNew"
                                onClick={() => {
                                    setNoteModal(false);
                                }}
                            >
                                Ok
                            </button>
                            <button
                                className="ReNew"
                                style={{ backgroundColor: "#042b62", color: "white" }}
                                onClick={() => {
                                    setNoteModal(false);
                                    navigate(
                                        process.env.PUBLIC_URL +
                                        "/direct-mutual-fund/portfolio/link-your-holdings"
                                    );
                                }}
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </ReactModal>
        </PortfolioLayout>
    );
}

export default PortfolioHoldingsReportDetails;
