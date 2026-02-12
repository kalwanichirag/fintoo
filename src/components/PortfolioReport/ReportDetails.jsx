import { useState, useRef, useEffect } from "react";
import Styles from "../../Pages/DMF/Portfolio/report.module.css";
import PortfolioLayout from "../Layout/Portfolio";
import { Link } from "react-router-dom";
import Select from "react-select";
import SimpleReactValidator from "simple-react-validator";
import {
  DATA_BELONGS_TO
} from "../../constants";
import {
  getParentUserId,
  getUserId,
  loginRedirectGuest,
  maskBankAccNo,
} from "../../common_utilities";
import FintooLoader from "../FintooLoader";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Modal } from "react-bootstrap";
import FintooInlineLoader from "../FintooInlineLoader";
import { sendOtpForCams, generateCapitalGainReport, getCapitalGainStatus } from "../../FrappeIntegration-Services/services/reportHub-api/reportHubService";
import { fetchUserProfileDetails, getFamilyMember } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";

function ReportDetails() {
  const initialValues = {
    Statement: "",
    FinancialYear: "",
    min: null,
    max: null,
  };
  const [, forceUpdate] = useState();
  const [userData, setUserData] = useState();
  const [fileCG, setFileCG] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [showDiv, setShowDiv] = useState(false);
  const [isValueChange, setIsValueChange] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [appErrorMessage, setAppErrorMessage] = useState("");
  const [capitalGainHistData, setCapitalGainHistData] = useState([]);
  const [foundTodaysData, setFoundTodaysData] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const userDetails = useRef({});
  const [memberDropdownData, setMemberDropdownData] = useState([]);

  const dispatch = useDispatch();

  const currentYear = new Date().getFullYear();
  const currMonth = new Date().getMonth();
  const [financialYearData, setFinancialYearData] = useState([]);

  const customStyles = {
    control: (base) => ({
      ...base,
      boxShadow: "none",
      color: "#042b62",
    }),
  };

  const getMemberData = async () => {
    try {
      const userid = getUserId();
      const response = await getFamilyMember(userid);

      let membersInDropdown = [
        ...response.data.map((v) => ({
          label: v.user_name || v.user_email || v.relation || 'Unknown Member',
          value: v.user_id,
          pan: v.pan,
          mobile: v.mobile_number,
        })),
      ];
      setMemberDropdownData(membersInDropdown);
      setFormData((prev) => ({
        ...prev,
        member: membersInDropdown.find((v) => v.value == getUserId()),
      }));
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Something went wrong, please try again later.",
          type: "error",
        },
      });
    }
  };

  const onDateAndSelectInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (value === "realized") {
      setShowDiv(true);
    } else {
      setShowDiv(false);
    }
  };

  const validateForm = () => {
    simpleValidator.current.showMessages();
    forceUpdate(1);
    if (simpleValidator.current.allValid() == true) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (formData.FinancialYear) {
      userCred();
      var min_date =
        currMonth > 3
          ? moment(`01/04/${currentYear}`, "DD/MM/YYYY").toDate()
          : moment(`01/04/${currentYear - 1}`, "DD/MM/YYYY").toDate();
      var max_date = moment().toDate();
      if (formData.FinancialYear === "previousFyYear") {
        min_date =
          currMonth > 3
            ? moment(`01/04/${currentYear - 1}`, "DD/MM/YYYY").toDate()
            : moment(`01/04/${currentYear - 2}`, "DD/MM/YYYY").toDate();
        max_date =
          currMonth > 3
            ? moment(`31/03/${currentYear}`, "DD/MM/YYYY").toDate()
            : moment(`31/03/${currentYear - 1}`, "DD/MM/YYYY").toDate();
      }
      setFormData((prev) => ({
        ...prev,
        min: min_date,
        max: max_date,
        startDate: min_date,
        endDate: max_date,
      }));
    }
  }, [formData.FinancialYear]);

  useEffect(() => {
    if (fileCG) {
      document.querySelector("#cg-download").click();
    }
  }, [fileCG]);

  useEffect(() => {
    getMemberData();
    let _fdata = [
      {
        from: moment(`${moment().year() - 1}-04-01`, "YYYY-MM-DD")
          .startOf("day")
          .valueOf(),
        to: moment(`${moment().year()}-03-31`, "YYYY-MM-DD")
          .startOf("day")
          .valueOf(),
        label: "",
      },
      {
        from: moment(`${moment().year() - 2}-04-01`, "YYYY-MM-DD")
          .startOf("day")
          .valueOf(),
        to: moment(`${moment().year() - 1}-03-31`, "YYYY-MM-DD")
          .startOf("day")
          .valueOf(),
        label: "",
      },
    ];
    _fdata = _fdata.map((v) => {
      if (v.to > moment().startOf("day").valueOf()) {
        v.to = moment().startOf("day").valueOf();
      }
      return {
        label: `${moment(v.from).format("MMM YYYY")}-${moment(
          v.to
        ).format("MMM YYYY")}`,
        value: `${moment(v.from).format("DD-MMM-YYYY")}/${moment(v.to).format(
          "DD-MMM-YYYY"
        )}`,
      };
    });
    setFinancialYearData(_fdata);

    if (localStorage.getItem("data-added")) {
      localStorage.removeItem("data-added");
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "PAN updated",
          type: "success",
        },
      });
    }
  }, []);

  useEffect(() => {
    if (formData?.member?.pan) {
      getCapitalGainHistoryData();
    }
  }, [formData?.member?.pan]);

  useEffect(() => {
    if (formData?.FinancialYear) {
      try {
        let [minDate, maxDate] = formData.FinancialYear.split("/");
        let prepareString =
          moment(minDate, "DD-MMM-YYYY").format("YYYY") +
          "-" +
          moment(maxDate, "DD-MMM-YYYY").format("YY");
        let todaysData =
          capitalGainHistData.find(
            (v) =>
              v.financial_year == prepareString &&
              moment(v.created_at)
                .startOf("day")
                .isSame(moment().startOf("day"))
          ) || {};
        setFoundTodaysData(todaysData);
      } catch (e) {
        setFoundTodaysData({});
      }
    } else {
      setFoundTodaysData({});
    }
  }, [formData?.FinancialYear, formData?.member?.value, capitalGainHistData]);

  const userCred = async () => {
    try {
      const userid = getUserId();
      if (getUserId() == null) {
        loginRedirectGuest();
        return;
      }
      var res = await fetchUserProfileDetails(userid);
      setUserData(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const capitalGainData = async (event) => {
    try {
      if (validateForm() == false) return;
      setFormData((prev) => ({
        ...prev,
        enteredOtp: "",
      }));
      setAppErrorMessage("");
      event.target.disabled = true;
      event.target.textContent = "Processing...";
      const data = {
        from_date: moment(
          formData.FinancialYear.split("/")[0],
          "DD-MMM-YYYY"
        ).format("YYYY-MM-DD"),
        to_date: moment(
          formData.FinancialYear.split("/")[1],
          "DD-MMM-YYYY"
        ).format("YYYY-MM-DD"),
        user_id: "" + formData.member.value,
        pan: formData.member.pan,
        mobile: formData.member.mobile,
        data_belongs_to: DATA_BELONGS_TO,
      };

      const r = await sendOtpForCams(data);
      if (r.status_code == 200) {
        setShowOTPModal(true);
        setFormData((prev) => ({ ...prev, ...r.data }));
      } else {
        throw new Error(r.message);
      }
    } catch (e) {
      console.log(e);
      setShowOTPModal(false);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: e.message,
          type: "error",
          autoClose: 3000,
        },
      });
      setAppErrorMessage(e.message);
    } finally {
      event.target.disabled = false;
      event.target.textContent = "Generate";
    }
  };

  const downloadMyReport = async (event) => {
    if (!formData?.enteredOtp) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Please enter OTP",
          type: "error",
        },
      });
      return;
    }
    try {
      event.target.disabled = true;
      event.target.textContent = "Downloading...";
      document.getElementById("otp_auth_modal").classList.add("d-none");
      const reqData = {
        mobile: formData?.member?.mobile,
        from_date: moment(formData.startDate, "DD-MMM-YYYY").format("YYYY-MM-DD"),
        to_date: moment(formData.endDate, "DD-MMM-YYYY").format("YYYY-MM-DD"),
        token: formData.token,
        pan: formData?.member?.pan,
        user_id: formData?.member?.value,
        reqId: formData.reqId,
        otpRef: formData.otpRef,
        userSubjectReference: formData.userSubjectReference,
        clientRefNo: formData.clientRefNo,
        entered_otp: formData.enteredOtp,
        data_belongs_to: DATA_BELONGS_TO,
      };

      const response = await generateCapitalGainReport(reqData);

      if (response.status_code == 200) {
        setShowOTPModal(true);
        downloadFile(response.data, "Capital_Gain_Report.pdf");
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Report has been downloaded successfully!",
            type: "success",
          },
        });
      } else {
        if (response?.message) {
          throw new Error(response.message);
        } else {
          throw new Error("Something went wrong!");
        }
      }
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: e.message,
          type: "error",
        },
      });
      setAppErrorMessage(e.message);
    } finally {
      event.target.disabled = false;
      event.target.textContent = "Submit";
      document.getElementById("otp_auth_modal").classList.remove("d-none");
      setShowOTPModal(false);
    }
  };

  const downloadFile = async (url, fileName) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = fileName; // Force download with this filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    getCapitalGainHistoryData();
  };


  const getCapitalGainHistoryData = async () => {
    try {
      setIsDataLoading(true);
      setCapitalGainHistData([]);

      if (getParentUserId() == null) {
        loginRedirectGuest();
        return;
      }

      var res = await fetchUserProfileDetails(formData?.member?.value);
      if (res.status_code == 200) {
        if (Boolean(res.data.user_pan) == false) {
          throw "PAN not found";
        }
        userDetails.current = res.data;
      }
      const data = {
        pan: formData.member.pan,
        data_belongs_to: DATA_BELONGS_TO,
      };
      const r = await getCapitalGainStatus(formData?.member?.value, data.pan);
      if (r.status_code == 200) {
        setCapitalGainHistData(r.data);
      } else {
        if (r?.message) {
          throw new Error(r.message);
        } else {
          throw new Error("Something went wrong!");
        }
      }
    } catch (e) {
      console.log("getCapitalGainHistoryData Exception: ", e);
    } finally {
      setIsDataLoading(false);
    }
  };

  return (
    <PortfolioLayout>
      <FintooLoader isLoading={isLoading} />
      <Modal show={showOTPModal}>
        <Modal.Body>
          <>
            <div className="position-relative">
              <span
                id="otp_auth_modal"
                className="position-absolute"
                onClick={() => setShowOTPModal(false)}
              >
                <img
                  className="pointer"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/DMF/left-arrow.svg"
                  }
                  width={25}
                />
              </span>
              <div
                className="DeleteBank text-center pb-3 w-100"
                style={{ borderBottom: "1px solid #eeee" }}
              >
                <h3 className="mb-0 pb-0">OTP Verification</h3>
              </div>
            </div>
            <div>
              <div className="m-4 d-flex flex-column gap-4 text-center">
                <p className="mb-0">
                  You will receive OTP on your mobile number <br />
                  <b>+91 {maskBankAccNo(formData.member?.mobile)}</b>
                </p>

                <div className="form-group d-flex justify-content-center">
                  <input
                    type="text"
                    className="form-control w-50 text-center link-holdings-otp "
                    maxLength={6}
                    placeholder="Enter 6 digit OTP"
                    value={formData?.enteredOtp}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        enteredOtp: e.target.value.replace(/\D/g, ""),
                      }));
                    }}
                  />
                </div>

                <div className="justify-content-center d-flex ">
                  <button
                    className={Styles.submitbtn}
                    onClick={downloadMyReport}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </>
        </Modal.Body>
      </Modal>
      {!isLoading && (
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
                  <div className={`pt-3  ${Styles.ReportName}`}>
                    Capital Gains & Loss Report
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-10 mt-md-5 mt-4">
            <div className={`${Styles.ReportDetailsOptions}`}>
              <div className="">
                <div className={`${Styles.ReportLabel}`}>Member</div>
                <div className="mt-2">
                  <Select
                    value={
                      memberDropdownData.find(
                        (v) => v.value == (formData.member.value || getUserId())
                      ) || null
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
                        member: {
                          label: e.label,
                          value: e.value,
                          pan: e.pan,
                          mobile: e.mobile,
                        },
                      }));
                      setAppErrorMessage("");
                    }}
                  />
                </div>
                {simpleValidator.current.message(
                  "Member",
                  formData.member?.value,
                  "required"
                )}
              </div>
              <div className="">
                <div className={`${Styles.ReportLabel}`}>Financial Year</div>
                <div className="mt-2">
                  <Select
                    className="box-shadow-none border-0"
                    classNamePrefix="ReportSelect"
                    isSearchable={false}
                    options={financialYearData}
                    placeholder="Select.."
                    value={
                      financialYearData.find(
                        (v) => v.value === formData.FinancialYear
                      ) ?? null
                    }
                    styles={customStyles}
                    onChange={(e) => {
                      onDateAndSelectInputChange("FinancialYear", e.value);
                      setIsValueChange(true);
                      setAppErrorMessage("");
                    }}
                  />
                </div>
                {simpleValidator.current.message(
                  "Financial Year",
                  formData.FinancialYear,
                  "required"
                )}
              </div>

              <div className={`${Styles.ReportGenOption}`}>
                <div
                  className="d-md-block d-none"
                  style={{
                    height: "2.3rem",
                  }}
                ></div>
                {!(formData?.member?.value && !formData?.member?.pan) && (
                  <>
                    {foundTodaysData?.s3_file_url ? (
                      <button
                        onClick={() => {
                          downloadFile(
                            foundTodaysData.s3_file_url,
                            "Capital_Gain_Report.pdf"
                          );
                        }}
                        className={Styles.ReportButton}
                      >
                        Download
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          capitalGainData(e);
                          setIsValueChange(false);
                        }}
                        className={Styles.ReportButton}
                      >
                        Generate
                      </button>
                    )}
                  </>
                )}
                <div style={{ display: "none" }}>
                  <a
                    id="cg-download"
                    href={fileCG}
                    style={{
                      textDecoration: "none",
                      pointerEvents: fileCG ? "auto" : "none",
                    }}
                    download={"Capital_Gain_Report_" + getUserId()}
                  ></a>
                </div>
              </div>
            </div>
          </div>

          {appErrorMessage && (
            <p className="pt-4 error" style={{ fontSize: "1rem" }}>
              {appErrorMessage}
            </p>
          )}
          <>
            {(formData?.member?.value && !formData?.member?.pan) ? (
              <>
                <div className="pt-4">
                  <p>
                    Please{" "}
                    <Link
                      to={
                        process.env.PUBLIC_URL +
                        "/direct-mutual-fund/add-pan-details?member=" +
                        formData?.member?.value
                      }
                    >
                      add PAN
                    </Link>{" "}
                    of this member to proceed further.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="col-12 col-md-10 mt-md-5 mt-4">
                  <table className="bgStyleTable text-center">
                    <tbody>
                      <tr>
                        <th>Member</th>
                        <th>Financial Year</th>
                        <th>Created On</th>
                        <th>Download</th>
                      </tr>
                      <>
                        {isDataLoading ? (
                          <tr>
                            <td colSpan={10}>
                              <FintooInlineLoader isLoading={true} />
                            </td>
                          </tr>
                        ) : (
                          <>
                            {capitalGainHistData &&
                              capitalGainHistData.length > 0 ? (
                              <>
                                {capitalGainHistData.map((capitalgain) => (
                                  <tr>
                                    <td>{capitalgain?.user_name}</td>
                                    <td>{capitalgain?.cg_financial_year}</td>
                                    <td>
                                      {moment(capitalgain?.created_at).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </td>

                                    <td>
                                      <img
                                        width={18}
                                        height={18}
                                        title="Download Summary Report"
                                        className="ms-3 pointer"
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/static/media/DMF/Report/download.svg"
                                        }
                                        alt="Download Icon"
                                        onClick={() => {
                                          downloadFile(
                                            capitalgain?.s3_file_url,
                                            "Capital_Gain_Report.pdf"
                                          );
                                        }}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </>
                            ) : (
                              <tr>
                                <td colSpan={6}>No records found.</td>
                              </tr>
                            )}
                          </>
                        )}
                      </>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        </div>
      )}
    </PortfolioLayout>
  );
}

export default ReportDetails;
