import { useEffect, useRef, useState } from "react";
import { BiSave } from "react-icons/bi";
import { BsPencilFill } from "react-icons/bs";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { imagePath, DATA_BELONGS_TO} from "../../../constants";
import { apiCall, fetchData, getItemLocal, getParentFpLogId, getParentUserId, getUserId, loginRedirectGuest } from "../../../common_utilities";
import commonEncode from "../../../commonEncode";
import FintooLoader from "../../../components/FintooLoader";
import * as toastr from 'toastr'
import 'toastr/build/toastr.css';
import { ScrollToTop } from '../ScrollToTop';
import { GetUserAssumptions, GetUserInflations } from "../../../FrappeIntegration-Services/services/financial-planning-api/yourprofileapi";
import { fetchUserInflation, updateUserSettingData } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { getExpenseDetails } from "../../../FrappeIntegration-Services/services/financial-planning-api/expense";
import { fetchUserInflations } from "../../../FrappeIntegration-Services/services/financial-planning-api/rp_intro";
function Assumptions(props) {

    const setTab = props.setTab;

    const [tab123, setTab123] = useState("tab5");
    const [isLoading, setIsLoading] = useState(false);
    const [assumptionData, setAssumptionData] = useState([]);
    const [inflationData, setInflationData] = useState([]);
    const [rorData, setRorData] = useState([]);
    const [inflation, setInflation] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [fplogid, setFplogid] = useState("");
    const sessionRef = useRef();
    const fpLogId = getParentFpLogId();

    useEffect(() => {
        document.body.classList.add("dg-layout");
        assumptionTabData();
        scrollToAssumptions();
        scrollToTop();
    }, [setTab]);

    useEffect(() => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        if (!userid) {
            loginRedirectGuest();
        }
    }, []);

    const scrollToTop = () => {
        window.scroll({ top: 0 });
    };

    const cntRef = useRef(null);
    const userid = getParentUserId();

    const scrollToAssumptions = () => {
        const { offsetTop } = cntRef.current;
        window.scroll({ top: offsetTop - 50 });
    };

    // APIs

    const assumptionTabData = async () => {
        try {
            getfpuserAssumptions();
            // let url = '';
// let url = CHECK_SESSION;
            // let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };

            // sessionRef.current = await apiCall(url, data, true, false);
            // setSession(sessionData);
            scrollToAssumptions();

            // if (sessionRef.current.error_code == "102") {
            //     loginRedirectGuest()
            // }
            // else {
            
            // getFpLog();
            getfpuserAssumptions();
            getfpuserInflations();
            // }

        } catch (e) {
            console.log("err", e);
        }
    };
    const getFpLog = async () => {
        if (sessionRef.current["data"]["fp_log_id"]) {
            setDefaultAssumptions()
        }
        else {
            let url = '';
            let data = { user_id: sessionRef.current["data"]["id"] };


            let fp_log_resp = await apiCall(url, data, false, false);
            if (fp_log_resp['error_code'] == "100") {
                if (fp_log_resp.data.fp_log_id != '') {
                    sessionRef.current["data"]["fp_log_id"] = fp_log_resp.data.fp_log_id
                    setFplogid(fp_log_resp.data.fp_log_id);
                    setDefaultAssumptions()
                }


            }

        }
    }
    const setDefaultAssumptions = async () => {

        let url = ADVISORY_SET_DEFAULT_ASSUMPTIONS;
        let data = {

            fp_log_id: sessionRef.current["data"]["fp_log_id"],
            user_id: sessionRef.current["data"]["id"],
            fp_user_id: sessionRef.current['data']['fp_user_id'],
            data_belongs_to: DATA_BELONGS_TO

        }
        let resp = await apiCall(url, data, false, false);
        if (resp['error_code'] == "100") {
            await getfpuserAssumptions();
            await getfpuserInflations()
        }


    }
    const getfpuserAssumptions = async () => {

        try {
            let apiData = {
                user_id: getUserId()
            };

            // var payloadData = commonEncode.encrypt(JSON.stringify(apiData));
            var res = await GetUserAssumptions(apiData)
            // var res = await apiCall(
            //     ADVISORY_GET_FPUSER_ASSUMPTIONS,
            //     payloadData,
            //     false,
            //     false
            // );

            // let decodedRes = JSON.parse(commonEncode.decrypt(res));
            let resData = res['data'];
            let tempRor = Object.entries(resData).map(([ROR, CAGR], index) => ({
                ROR: ROR.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
                CAGR,
                id: index + 1,
                ROR_id: ROR
            }));

            setRorData(tempRor);
        }
        catch (e) {
            console.log("Error", e)
        }
    };

    const getfpuserInflations = async () => {

        getUserExpenses();
        try {
            // var apiData = {
            //     fp_log_id: fpLogId,
            //     user_id: sessionRef.current['data']['id'],
            //     data_belongs_to: DATA_BELONGS_TO
            // };
            let apiData = {
                user_id: getUserId()
            };


            // var payloadInflations = commonEncode.encrypt(JSON.stringify(apiData));
            var res = await GetUserInflations(apiData);
            // var res = {
            //     "status_code": "200",
            //     "message": "Success",
            //     "data": {
            //         "post_retirement_inflation": 5,
            //         "pre_retirement_inflation": 5
            //     },
            //     "error": {}
            // }
            // var res = await apiCall(
            //     ADVISORY_GET_FPUSER_INFLATION,
            //     payloadInflations,
            //     false,
            //     false
            // );
            // var resInflations = JSON.parse(commonEncode.decrypt(res));
            
            var resData = res['data'];

            let keyToExtract = "post_retirement_inflation";

            let tempInflation = Object.entries(resData)
                .filter(([IR, _]) => IR === "post_retirement_inflation")
                .map(([IR, Percentage], index) => ({
                    IR: IR.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
                    Percentage,
                    id: index + 1,
                }));



            setInflation(tempInflation);

        } catch (e) {
            console.log("err", e);
        }
    };

    const getUserExpenses = async () => {
        let expenses = {};
        try {
            var res = await getExpenseDetails(getUserId())
            // var res = await apiCall(
            //     ADVISORY_GETEXPENSES_API_URL,
            //     apiData,
            //     false,
            //     false
            // );
            if (res.status_code === 200) {
                var resExp = res['data'];

                resExp.forEach((expense, index) => {
                    if (parseFloat(expense.user_expense_growth_rate) !== 0) {
                        let inflation_name = expense.user_name + " " + expense.user_expense_name;
                        let percent = expense.user_expense_growth_rate;
                        expenses[inflation_name] = percent;
                    }
                });

                let tmpExpenses = Object.entries(expenses).map(([IR, Percentage], index) => ({
                    IR: IR.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
                    Percentage,
                    id: index + 1,
                }));
                setExpenses(tmpExpenses);
            }
        } catch (e) {
            console.log("Error: ", e);
        };
    };

    const handleAssumptionEditClick = (id) => {
        let updatedAssumptionData = {}
        updatedAssumptionData["editAssumptionId"] = id;

        for (let i = 0; i < rorData.length; i++) {
            if (rorData[i].id === id) {
                updatedAssumptionData["changedROR"] = rorData[i].ROR;
                updatedAssumptionData["previousCAGR"] = rorData[i].CAGR;
                break;
            }
        }

        setAssumptionData(prevAssumptionData => ({
            ...prevAssumptionData,
            ...updatedAssumptionData
        }));

        setRorData(prev => prev.map(v => {
            v.tempCAGR = undefined;
            return v;
        }));
    };

    const handleInflationEditClick = (id) => {
        setInflationData((prevData) => {
            const updatedData = { ...prevData };
            updatedData.editInfId = id;
            updatedData.changedPercentage = prevData.enteredPercentage; // Store previous CAGR value

            const inflationToUpdate = inflation.find((item) => item.id === id);
            if (inflationToUpdate) {
                updatedData.changedIR = inflationToUpdate.IR; // Store previous ROR value
            }

            return updatedData;
        });
    };

    const saveupdatefpinflations = async () => {

        try {
            // var api_data = {
            //     fp_log_id: sessionRef.current['data']['fp_log_id'],
            //     user_id: sessionRef.current['data']['id'],
            //     pre_retirement_inflation: parseFloat(inflation["0"]["Percentage"]),
            //     post_retirement_inflation: parseFloat(inflation["0"]["Percentage"]),
            //     is_addedbyuser: 1,
            //     data_belongs_to: DATA_BELONGS_TO
            // }

            // var res = await apiCall(
            //     ADVISORY_SAVE_UPDATE_FP_INFLATION,
            //     api_data,
            //     false,
            //     false
            // );
            let payload = {
                user_id: getUserId(),
                update_type: "Inflation",
                update_field: { 
                    "pre_retirement_inflation":  parseFloat(inflation["0"]["Percentage"]),
                    "post_retirement_inflation": parseFloat(inflation["0"]["Percentage"])
                }
            }
            let res = await updateUserSettingData(payload);


            if (res["status_code"] === 200) {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.success(inflationData.changedIR + " updated successfully !!");
                setInflationData(prev => ({
                    ...prev,
                    "editInfId": null
                }));
                getfpuserInflations()

            } else {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error(res['message']);
            }

        }
        catch (e) {
            console.log("Error", e);
        }
    };

    const saveupdatefpassumptions = async (v) => {

        try {
            // var updateAssumptions = {
            //     fp_log_id: sessionRef.current['data']['fp_log_id'],
            //     user_id: sessionRef.current['data']['id'],
            //     alternate: parseFloat(rorData["0"]["tempCAGR"] ?? rorData["0"]["CAGR"]),
            //     debt_post_retirement: parseFloat(rorData["1"]["tempCAGR"] ?? rorData["1"]["CAGR"]),
            //     debt_pre_retirement: parseFloat(rorData["2"]["tempCAGR"] ?? rorData["2"]["CAGR"]),
            //     equity_post_retirement: parseFloat(rorData["3"]["tempCAGR"] ?? rorData["3"]["CAGR"]),
            //     equity_pre_retirement: parseFloat(rorData["4"]["tempCAGR"] ?? rorData["4"]["CAGR"]),
            //     gold: parseFloat(rorData["5"]["tempCAGR"] ?? rorData["5"]["CAGR"]),
            //     human_life_value: parseFloat(rorData["6"]["tempCAGR"] ?? rorData["6"]["CAGR"]),
            //     liquid_fund: parseFloat(rorData["7"]["tempCAGR"] ?? rorData["7"]["CAGR"]),
            //     real_estate: parseFloat(rorData["8"]["tempCAGR"] ?? rorData["8"]["CAGR"]),
            //     data_belongs_to: DATA_BELONGS_TO
            // }

            // const values = Object.values(updateAssumptions);
            
            v.tempCAGR = v.tempCAGR === undefined ? v.CAGR : v.tempCAGR;

            if (isNaN(v.tempCAGR) || v.tempCAGR === null || v.tempCAGR === "") {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Please enter valid data for " + assumptionData.changedROR);
            }
            else {

                // let payload = {
                //     method: "post",
                //     data: updateAssumptions,
                //     url: ADVISORY_SAVE_UPDATE_FP_ASSUMPTIONS,
                // };
                let payload = {
                    user_id: getUserId(),
                    update_type: "Assumption",
                    update_field: { [String(v.ROR_id)]: parseFloat(v.tempCAGR) }
                }
                let configUpdateAssumptions = await updateUserSettingData(payload);

                // let configUpdateAssumptions = await fetchData(payload);

                if (configUpdateAssumptions["status_code"] === 200) {
                    toastr.options.positionClass = "toast-bottom-left";
                    toastr.success(assumptionData.changedROR + " updated successfully !!");
                    setAssumptionData(prev => ({ ...prev, "editAssumptionId": null }));
                    getfpuserAssumptions()
                    scrollToAssumptions();

                } else {
                    toastr.options.positionClass = "toast-bottom-left";
                    toastr.error(configUpdateAssumptions["message"]);

                    setRorData(prev => {
                        return prev.map((item) => {
                            if (assumptionData.editAssumptionId == item.id) {
                                return { ...item, CAGR: assumptionData.previousCAGR };
                            } else {
                                return item;
                            }
                        })
                    })
                }

            }
        }
        catch (e) {
            console.log("Error", e)
        }
    };

    return (
        <div ref={cntRef}>
            <FintooLoader isLoading={isLoading}></FintooLoader>
            <div className="appendix">
                <div className="tabs innerTabs subTabWrapper">
                    <ul
                        className="nav nav-buttons nav-secoandary d-inline-flex"
                        id="intro-appendix"
                    >
                        <li
                            className={`tab-menu-item ${tab123 == "tab5" ? "active" : ""
                                }`}
                        >
                            <a onClick={() => setTab123("tab5")}>
                                Rate of Return Assumption
                            </a>
                        </li>
                        <li
                            className={`tab-menu-item ${tab123 == "tab6" ? "active" : ""
                                }`}
                        >
                            <a onClick={() => setTab123("tab6")}>
                                Inflation Assumptions
                            </a>
                        </li>
                    </ul>
                    <div>
                        <div className={tab123 == "tab5" ? "d-block" : "d-none"}>
                            <h4 className="rTitle">
                                <img src={imagePath + "/static/media/DG/reports/introduction/ror-assumption.svg"} />
                                Rate of Return Assumption
                            </h4>
                            {/* ngRepeat: sectiondata in assumptiondata.settingdata[16] */}
                            <div className="rContent" style={{}}>
                                <p className="" />
                                <p>
                                    Two elements form the basis of an effective
                                    financial plan;
                                </p>
                                <ol>
                                    <li>Input data</li>
                                    <li>Assumptions</li>
                                </ol>
                                <p>
                                    After understanding your current financial position
                                    and performing an in-depth analysis of the
                                    information collected during the Data Gathering
                                    Process, our financial experts have identified a
                                    perfect starting point for you along with making
                                    logical assumptions about your investments returns,
                                    expenses and inflation etc.
                                </p>
                                <p>
                                    It is extremely important for you to know about
                                    these assumptions as they are the variable factors
                                    that will shape your financial plan and will also
                                    have an impact on its efficacy.
                                </p>
                                <p className="notes">
                                    Note: Making The Changes In The Assumption Will
                                    Change The Calculation Based On It.
                                </p>
                                <p />
                            </div>
                            <div className="row assumptionheight">
                                <div className="col-md-6">
                                    <div className="table-responsive rTable">
                                        <div id="AssumptionTableForm">
                                            <table className="bgStyleTable">
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: "45%" }}>
                                                            Rate Of Return (ROR)</th>
                                                        <th style={{ width: "55%" }}>
                                                            Compound Annual Growth Rate (CAGR %)
                                                        </th>
                                                    </tr>
                                                    {rorData.map((v, index) => (
                                                        <>
                                                            <tr key={index} style={{}}>
                                                                <td className="">{v.ROR}</td>
                                                                <td className="position-relative">
                                                                    <span className="editrow d-flex">
                                                                        {assumptionData.editAssumptionId === v.id ? (
                                                                            <>
                                                                                <span className="d-block">
                                                                                    <input
                                                                                        type="text"
                                                                                        name={v.ROR.replace(/ /g, "_")}
                                                                                        maxLength={2}
                                                                                        minLength={1}
                                                                                        id={v.ROR.replace(/ /g, "_")}
                                                                                        className=""
                                                                                        value={v.tempCAGR ?? v.CAGR}
                                                                                        onChange={(e) => {
                                                                                            setRorData(prev => {
                                                                                                return prev.map((x, j) => {
                                                                                                    if (index == j) {
                                                                                                        return { ...x, tempCAGR: e.target.value.replace(/[^0-9.]/, '') };
                                                                                                    } else {
                                                                                                        return x;
                                                                                                    }
                                                                                                })
                                                                                            });
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (e.key === 'Enter') {
                                                                                                saveupdatefpassumptions();
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        style={{ width: "40px", padding: "0 10px" }}
                                                                                    //   
                                                                                    />
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <span style={{ width: "5%" }}>{Number(v.CAGR)}</span>
                                                                            </>
                                                                        )}

                                                                        <span className="editing-icon pointer" style={{ marginLeft: "5%" }}>
                                                                            {assumptionData.editAssumptionId === v.id ? (
                                                                                <BiSave onClick={() => saveupdatefpassumptions(v)} />
                                                                            ) : (

                                                                                <BsPencilFill onClick={() => handleAssumptionEditClick(v.id)} />
                                                                            )}
                                                                        </span>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="row pt-4 mb-4">
                                    <div className=" text-center">
                                        <div>
                                            <div className="btn-container">
                                                <div className="d-flex justify-content-center">
                                                    <div
                                                        className="previous-btn form-arrow d-flex align-items-center"
                                                        onClick={() => {
                                                            ScrollToTop();
                                                            setTab("tab2")
                                                        }
                                                        }
                                                    >
                                                        <FaArrowLeft />
                                                        <span className="hover-text">
                                                            &nbsp;Previous
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="next-btn form-arrow d-flex align-items-center"
                                                        onClick={() => {
                                                            ScrollToTop();
                                                            setTab123("tab6")
                                                        }
                                                        }
                                                    >
                                                        <span
                                                            className="hover-text"
                                                            style={{ maxWidth: 100 }}
                                                        >
                                                            Next&nbsp;
                                                        </span>
                                                        <FaArrowRight />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12 notes_sec_div">
                                    {/* <h4 className="rTitle">
                                        <img src={imagePath + "https://static.fintoo.in/static/assets/img/reports/introduction/ror-assumption.svg"} />
                                        Glossary
                                    </h4> */}
                                    <div className="notes_head_div">
                                        <i
                                            style={{
                                                backgroundSize: "100%",
                                                width: "50px",
                                                height: "70px",
                                                display: "block",
                                                position: "absolute",
                                                top: "-25px",
                                                left: "-15px",
                                            }}
                                        ></i>
                                        <span>Glossary</span>
                                    </div>

                                    <div className="riskAppetiteBox mt-5 notes_text_div">
                                        <p style={{ fontStyle: "normal", color: "black" }}>
                                            Here’s What Each Part Of Your Rate Of Return
                                            Stands For:
                                        </p>
                                        <ol>
                                            <li>
                                                <label className="RetirementType">
                                                    Debt post-retirement
                                                </label>
                                                : This is the rate of return that is assumed
                                                for debt investments that you make after
                                                retirement. Our experts use it to make
                                                post-retirement cash flow recommendations and
                                                for calculations about retirement planning.
                                            </li>
                                            <br />
                                            <li>
                                                <label className="RetirementType">
                                                    Debt pre-retirement
                                                </label>
                                                : This is the rate of return that is assumed
                                                for debt investments that you make before
                                                retirement. Our experts use it to determine
                                                cash flow and for asset mapping.
                                            </li>
                                            <br />
                                            <li>
                                                <label className="RetirementType">
                                                    Equity post-retirement
                                                </label>
                                                : This is the rate of return that is assumed
                                                for equity investments that you make after
                                                retirement. Our experts use it to make
                                                post-retirement cash flow recommendations and
                                                for calculations about your retirement
                                                planning.
                                            </li>
                                            <br />
                                            <li>
                                                <label className="RetirementType">
                                                    Equity pre-retirement
                                                </label>
                                                : This is the rate of return that is assumed
                                                for equity investments that you make before
                                                retirement. Our experts use it to determine
                                                cash flow and for asset mapping.
                                            </li>
                                            <br />
                                            <li>
                                                <label className="RetirementType">Gold</label>
                                                : This is the rate of return that is assumed
                                                for all your gold investments, be it physical
                                                gold, gold ETFs or gold mutual funds. Our
                                                experts use it to make cash flow
                                                recommendations and for asset mapping.
                                            </li>
                                            <br />
                                            <li className="addbreak">
                                                <label className="RetirementType">
                                                    Human Life Value (HLV) Rate
                                                </label>
                                                : This is called the Human life Value Rate
                                                which is used to calculate the life insurance
                                                corpus required for you. Basically, the
                                                assumption is if something unfortunate happens
                                                to you and your family claims the insurance
                                                money from the insurance company then they
                                                would be investing the entire insurance Sum
                                                Assured at this rate.
                                            </li>
                                            <br />
                                            <li>
                                                <label className="RetirementType">
                                                    Liquid fund
                                                </label>
                                                : It is assumed that this rate of return is
                                                offered by short-term liquid fund investments
                                                that you make for building an emergency fund.
                                                Our experts use it to make cash flow
                                                recommendations and for asset mapping.
                                            </li>
                                            <br />
                                            <li>
                                                <label className="RetirementType">
                                                    Real estate
                                                </label>
                                                : This is the rate of return that is assumed
                                                for all your real estate investments. Our
                                                experts use it to make cash flow
                                                recommendations and for asset mapping.
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={tab123 == "tab6" ? "d-block" : "d-none"}>
                            <h4 className="rTitle">
                                <img src={imagePath + "/static/media/DG/reports/introduction/inflation-assumption.svg"} />
                                Inflation Assumptions
                            </h4>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="table-responsive rTable">
                                        <table className="bgStyleTable">
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: "60%" }}>Inflation Rate</th>
                                                    <th style={{ width: "70%" }}>Percentage (%)</th>
                                                </tr>
                                                {expenses.map((v, i) => (
                                                    <>
                                                        <tr style={{}} key={i}>
                                                            <td className="">{v.IR}</td>
                                                            <td className="position-relative">
                                                                <span className="editrow d-flex justify-content-between">
                                                                    <span>{v.Percentage}</span>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </>
                                                ))}

                                                {inflation.map((v, index) => (
                                                    <>
                                                        <tr style={{}} key={index}>
                                                            <td className="">{v.IR}</td>
                                                            <td className="position-relative">
                                                                <span className="editrow d-flex">
                                                                    {inflationData.editInfId === v.id ? (
                                                                        <>
                                                                            <span className="d-block">
                                                                                <input
                                                                                    type="text"
                                                                                    maxLength={2}
                                                                                    minLength={1}
                                                                                    name={v.IR.replace(/ /g, "_")}
                                                                                    id={v.IR.replace(/ /g, "_")}
                                                                                    value={v.Percentage}
                                                                                    className=""
                                                                                    onChange={(e) => {
                                                                                        setInflation(prev => {
                                                                                            return prev?.map((x, j) => {
                                                                                                if (index == j) {
                                                                                                    return { ...x, Percentage: e.target.value.replace(/[^0-9.]/, '') };
                                                                                                } else {
                                                                                                    return x;
                                                                                                }
                                                                                            })
                                                                                        });
                                                                                    }}
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === 'Enter') {
                                                                                            saveupdatefpinflations();
                                                                                            e.preventDefault();
                                                                                        }
                                                                                    }}
                                                                                    style={{ width: "40px", padding: "0 10px" }}
                                                                                />
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <span style={{ width: "5%" }}>{Number(v.Percentage)}</span>
                                                                        </>
                                                                    )}
                                                                    <span className="editing-icon pointer" style={{ marginLeft: "5%" }}>
                                                                        {inflationData.editInfId === v.id ? (
                                                                            <BiSave onClick={saveupdatefpinflations} />
                                                                        ) : (
                                                                            <BsPencilFill onClick={() => handleInflationEditClick(v.id)} />
                                                                        )}
                                                                    </span>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* <div
                                style={{ paddingBottom: "5%", clear: "both" }}
                            ></div> */}

                            <div className="row py-2 mt-3">
                                <div className=" text-center">
                                    <div>
                                        <div className="btn-container">
                                            <div className="d-flex justify-content-center">
                                                <div
                                                    className="previous-btn form-arrow d-flex align-items-center"
                                                    onClick={() => {
                                                        ScrollToTop();
                                                        setTab123("tab5")
                                                    }
                                                    }
                                                >
                                                    <FaArrowLeft />
                                                    <span className="hover-text">
                                                        &nbsp;Previous
                                                    </span>
                                                </div>
                                                <div
                                                    className="next-btn form-arrow d-flex align-items-center"
                                                    onClick={() => {
                                                        ScrollToTop();
                                                        setTab("tab4")
                                                    }}
                                                >
                                                    <span
                                                        className="hover-text"
                                                        style={{ maxWidth: 100 }}
                                                    >
                                                        Next&nbsp;
                                                    </span>
                                                    <FaArrowRight />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="container mt-5">
                                <div
                                    className="notes_sec_div"
                                    style={{ border: "none !important" }}
                                >
                                    <div className="notes_head_div">
                                        <i
                                            style={{
                                                backgroundSize: "100%",
                                                width: "50px",
                                                height: "70px",
                                                display: "block",
                                                position: "absolute",
                                                top: "-25px",
                                                left: "-15px",
                                            }}
                                        ></i>
                                        <span>Glossary</span>
                                    </div>
                                    <div className="notes_text_div mt-5">
                                        <ol>
                                            <li>
                                                <b>Post-retirement inflation</b>: All the
                                                expenses that you will incur after retirement
                                                are inflated at this rate. Our experts use it
                                                to make post-retirement cash flow
                                                recommendations and to determine the quantum
                                                of corpus you need for your retirement.
                                            </li>
                                            <br />
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default Assumptions;