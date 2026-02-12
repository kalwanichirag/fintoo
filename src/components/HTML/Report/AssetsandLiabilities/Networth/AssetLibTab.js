import { useState } from "react";
import { useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import {

  imagePath,
} from "../../../../../constants";
import {
  apiCall,
  fetchEncryptData,
  getItemLocal,
  getParentUserId,
  loginRedirectGuest,
  getUserId,
  rsFilter,
  makePositive,
} from "../../../../../common_utilities";
import Switch from "react-switch";
import FintooLoader from "../../../../../components/FintooLoader";
import Liability from "../../../../../components/HTML/Report/AssetsandLiabilities/Liability";
import Styles from "../../../../HTML/Report/AssetsandLiabilities/Networth/Networth.module.css";
import { BiInfoCircle } from "react-icons/bi";
import BondsCss from "../../../../Bonds/Bonds.module.css";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import Liabilities from "./Liabilities";
import CustomSelectBox from "./CustomSelect";
import { ADVISORY_GET_NETWORTHFUNDFLOW_API_URL, ADVISORY_GET_EQUITY_DATA_API, ADVISORY_DEBT_INVESTMENT_API, financialplanningInsuranceEndpoints, ADVISORY_REALESTATE_INVESTMENT_API, ADVISORY_ALTERNATE_INVESTMENT_API, ADVISORY_COMMODITY_INVESTMENT_API } from "../../../../../constants";
import DataNotFound from "./DataNotFound";
import { ScrollToTop } from "../../../../../Pages/datagathering/ScrollToTop"
import Cookies from 'js-cookie';
import moment from "moment";

function formatToIndianRupee(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace("₹", "");
}
const AssetsLibTab = () => {
  const [equityData, setEquityData] = useState({});
  const [debtData, setDebtData] = useState({});
  const [insuranceData, setInsuranceData] = useState({});
  const [realEstateData, setRealEstateData] = useState({});
  const [alternateData, setAlternateData] = useState({});
  const [alternateAssetData, setAlternateAssetData] = useState({});
  const [goldData, setGoldData] = useState({});
  const [equitynetworthdata, setEquitynetworthdata] = useState([]);
  const [debtnetworthdata, setDebtnetworthdata] = useState([]);
  const [realestatenetworthdata, setRealEstatenetworthdata] = useState([]);
  const [insurancenetworthdata, setInsurancenetworthdata] = useState([]);
  const [alternateNetworthData, setAlternateNetworthData] = useState([]);
  const [goldNetworthData, setGoldNetworthData] = useState([]);
  const [tab, setTab] = useState("tab1");
  const [assettab, setAssetTab] = useState("tab7");
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState({});
  const userid = getParentUserId();
  const [isCritical, setIsCritical] = useState(false);
  const Info = styled(ReactTooltip)`
    max-width: 278px;
    padding-top: 9px;
    background: "#fff";
  `;
  const InfoMessage = styled.p`
    font-size: 13px;
    line-height: 1.4;
    text-align: left;
  `;

  const token = Cookies.get('token');

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      loginRedirectGuest();
    }
  }, []);

  useEffect(() => {
    // checksession(); - Disabled session checking
    const mockSessionData = {
      data: {
        user_id: getParentUserId(),
        id: getParentUserId(),
        fp_user_id: getParentUserId(),
        fp_log_id: "1",
      }
    };

    setSession(mockSessionData.data);
    setIsLoading(true);

    // Calling the data fetching functions with the mock session data
    getEquitySummaryData(mockSessionData);
    getDebtSummaryData(mockSessionData);
    getAlternateData(mockSessionData);
    getCommoditySummaryData(mockSessionData);
    getRealEstateSummaryData(mockSessionData);
    getInsuranceSummaryData(mockSessionData);
    getnetworthfundflow(mockSessionData);
    setIsLoading(false);
  }, []);

  // useEffect(() => {
  //     getnetworthfundflow();
  // }, [session]);

  const checksession = async () => {
    /* 
    Session checking functionality has been disabled
    try {
      let url = '';
// let url = CHECK_SESSION;
      let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
      let session_data = await apiCall(url, data, true, false);
      if (session_data["error_code"] == "100") {
        setSession(session_data["data"]);
        setIsLoading(true);
        getEquitySummaryData(session_data);
        getDebtSummaryData(session_data);
        getInsuranceSummaryData(session_data);
        getRealEstateSummaryData(session_data);
        getAlternateAndGoldSummaryData(session_data);
        getnetworthfundflow(session_data);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
    */
  };

const getEquitySummaryData = async (session_data) => {
  try {
    const payload = {
      method: "GET",
      url: `${ADVISORY_GET_EQUITY_DATA_API}?user_id=${session_data.data.id}`,
      headers: {
        Authorization: `token ${token}`
      }
    };

    const response = await fetchEncryptData(payload);

    if (response.status_code === 200) {
      const final_data = {};
      const responseData = response.data || {};
      const equity_items = responseData.equity_data || [];

      const total_current_value = responseData.total_current_value || 0;
      const total_invested_value = responseData.total_invested_value || 0;
      const total_ror = responseData.total_ror || 0;

      const data = equity_items.map(item => {
        const invested_value = item.user_asset_quantity * item.user_asset_avg_purchase_price;
        const current_value = item.user_asset_quantity * item.user_asset_current_price;
        const gain_loss = current_value - invested_value;
        const absolute = invested_value > 0 ? (gain_loss / invested_value) * 100 : 0;

        return {
          ...item,
          invested_value,
          current_value,
          gain_loss,
          absolute,
          asset_name: item.user_asset_name || item.name,
          category_name: item.sub_category_name || "Unknown"
        };
      });

      const total_gain_loss = data.reduce((sum, item) => sum + item.gain_loss, 0);
      const total_absolute = data.reduce((sum, item) => {
        const value = isFinite(item.absolute) ? item.absolute : 0;
        return sum + value;
      }, 0);

      final_data.data = data;
      final_data.total_current_value = total_current_value;
      final_data.total_invested_value = total_invested_value;
      final_data.total_ror = total_ror;
      final_data.total_gain_loss = total_gain_loss;
      final_data.total_absolute = total_absolute;

      setEquityData(final_data);
    }
  } catch (e) {
    console.error("Error in getEquitySummaryData:", e);
  }
};

  const getDebtSummaryData = async (session_data) => {

    try {
      var payload = {
        method: "GET",
        url: `${ADVISORY_DEBT_INVESTMENT_API}?user_id=${session_data["data"]["id"]}`,
        headers: {
          Authorization: `token ${token}`
        }
      };

      let response = await fetchEncryptData(payload);
      if (response.status_code === 200 || response.status_code == "200") {
        let final_data = {};
        let total_invested = 0;
        let total_current = 0;
        let total_maturity = 0;
        if (response.data && response.data.length > 0) {
          response.data.forEach((d) => {
            total_invested += parseFloat(d.invested_amount || 0) || 0;
            total_current += parseFloat(d.current_price || 0) || 0;
            total_maturity += parseFloat(d.maturity_amount || 0) || 0;
          });
        }
        final_data.data = response.data || [];
        final_data.total_invested = total_invested;
        final_data.total_current = total_current;
        final_data.total_maturity = total_maturity;
        setDebtData(final_data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getInsuranceSummaryData = async (session_data) => {
    try {
      var payload = {
        method: "GET",
        url: `${financialplanningInsuranceEndpoints.GET_USER_INSURANCE_DETAILS}?user_id=${session_data["data"]["id"]}`,
        headers: {
          Authorization: `token ${token}`
        },
      };
      let response = await fetchEncryptData(payload);
      if (response["status_code"] == 200) {
        const filteredData = response["data"].filter(
          item => item.insurance_cat_uuid !== "general" && item.insurance_cat_uuid !== "mediclaim"
        );

        const premium_payable = filteredData.reduce(
          (total, item) => total + item.user_insurance_premium_amount,
          0
        );

        const final_data = {
          data: filteredData,
          premium_payable: premium_payable
        };
        setInsuranceData(final_data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getRealEstateSummaryData = async (session_data) => {
    try {
      var payload = {
        method: "GET",
        url: `${ADVISORY_REALESTATE_INVESTMENT_API}?user_id=${session_data["data"]["id"]}`,
        headers: {
          Authorization: `token ${token}`
        }
      };

      let response = await fetchEncryptData(payload);

      if (response["status_code"] == "200") {
        let final_data = {};
        let total_invested = 0;
        let total_current = 0;
        let total_absolute = 0;
        let data = [];

        if (response["data"].length > 0) {
          response["data"].forEach(function (d) {
            let { name, category, type, asset_type, holder } = "";
            let { invested_amount, current_amount, absolute } = 0;
            invested_amount = parseFloat(d["total_purchase_amount"]);
            current_amount = parseFloat(d["total_current_amount"]);
            absolute = d["total_absolute_val"];

            if ("member_id" in d && d["member_id"].length > 0) {
              d["member_id"].forEach(function (mem) {
                name = mem["user_asset_name"] || "";
                category = mem["sub_category_name"] || "";
                type = mem["residential_type"] || "-";
                asset_type = mem["asset_type"] || "-";
                holder = mem["fullname"] || "";

                const asset_purchase_amount = mem["invested_amount"] || 0;
                const asset_amount = mem["current_amount"] || 0;
                const absolute_return = mem["absolute_return"] || 0;

                data.push({
                  name: name,
                  category: category,
                  type: type,
                  asset_type: asset_type,
                  holder: holder,
                  invested_amount: asset_purchase_amount,
                  current_amount: asset_amount,
                  absolute: absolute_return,
                });
              })
            }
            total_invested = total_invested + parseFloat(d["total_purchase_amount"]);
            total_current = total_current + parseFloat(d["total_current_amount"]);
            total_absolute = total_absolute + parseFloat(d["total_absolute_val"]);
          });
        }
        final_data["data"] = data;
        final_data["total_invested"] = total_invested;
        final_data["total_current"] = total_current;
        final_data["total_absolute"] = total_absolute;
        setRealEstateData(final_data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getAlternateData = async (session_data) => {
    try {
      var payload = {
        method: "GET",
        url: `${ADVISORY_ALTERNATE_INVESTMENT_API}?user_id=${session_data["data"]["id"]}`,
        headers: {
          Authorization: `token ${token}`
        }
      };

      let response = await fetchEncryptData(payload);
      if (response["status_code"] == 200) {
        let alternate_final_data = {};
        let alternate_data = [];

        if (response["data"] && response["data"].length > 0) {
          const assetData = response["data"][0]

          if (assetData["member_id"] && assetData["member_id"].length > 0) {
            alternate_data = assetData["member_id"]
            // ?.filter((x) => x.asset_cat_id == "UCAT-4") || [];
          }

          const total_current_value = assetData["total_current_amount"] || 0;
          const total_invested_value = assetData["total_invested_amount"] || 0;
          const total_absolute = assetData["total_absolute_val"] || 0;

          alternate_final_data["data"] = alternate_data;
          alternate_final_data["total_current_value"] = total_current_value;
          alternate_final_data["total_invested_value"] = total_invested_value;
          alternate_final_data["total_absolute"] = total_absolute;

          setAlternateAssetData(alternate_final_data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCommoditySummaryData = async (session_data) => {
    try {
      var payload = {
        method: "GET",
        url: `${ADVISORY_COMMODITY_INVESTMENT_API}?user_id=${session_data["data"]["id"]}`,
        headers: {
          Authorization: `token ${token}`
        }
      };
      let response = await fetchEncryptData(payload);

      if (response["status_code"] == 200) {
        let gold_final_data = {};
        let gold_data = [];
        let gold_total_invested = 0;
        let gold_total_current = 0;
        let gold_total_absolute = 0;

        let assetdata = response["data"]
        // ["assetdata"];
        assetdata.map((asset) => {
          if ("member_id" in asset) {
            asset["member_id"].map((record) => {
              gold_total_invested =
                gold_total_invested + record["invested_amount"];
              gold_total_current =
                gold_total_current + record["current_amount"];
              gold_total_absolute =
                gold_total_absolute + record["absolute_return"];
              gold_data.push(record);
            });
          }
        });
        gold_final_data["data"] = gold_data;
        gold_final_data["total_current_value"] = gold_total_current;
        gold_final_data["total_invested_value"] = gold_total_invested;
        gold_final_data["total_absolute"] = gold_total_absolute;
        setGoldData(gold_final_data);
      }
    } catch (e) {
      console.log("Error in getAlternateAndGoldSummaryData - ", e);
    }
  };

  const getnetworthfundflow = async (session_data) => {
    try {
      var payload = {
        method: "GET",
        url: `${ADVISORY_GET_NETWORTHFUNDFLOW_API_URL}?user_id=${session_data["data"]["id"]}`,
        headers: {
          Authorization: `token ${token}`
        }
      };
      let getnetworthdata = await fetchEncryptData(payload);
      if (getnetworthdata["status_code"] == 200) {
        setEquitynetworthdata(
          checkEmptyResponse(getnetworthdata.data.equity_fund_flow, "Equity")
        );
        setDebtnetworthdata(
          checkEmptyResponse(getnetworthdata.data.debt_fund_flow, "Debt")
        );
        setRealEstatenetworthdata(
          checkEmptyResponse(getnetworthdata.data.real_estate_fund_flow, "Real Estate")
        );
        setInsurancenetworthdata(
          checkEmptyResponse(getnetworthdata.data.insurance_fund_flow, "Insurance")
        );
        setAlternateNetworthData(
          checkEmptyResponse(getnetworthdata.data.alternate_fund_flow, "Alternate")
        );
        // setAlternateNetworthData(getnetworthdata.data.alternate_fund_flow, "Alternate");
        setGoldNetworthData(getnetworthdata.data.commodities_fund_flow, "Gold");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkEmptyResponse = (data, type) => {
    const hasValueGreaterThanZero = Object.values(data).some((yearData) =>
      Object.values(yearData).some((value) => value >= 0)
    );
    if (hasValueGreaterThanZero) {
      return data;
    } else {
      //console.log("No data for Type", type, data);
      return {};
    }
  };

  const handleSetTab = (data) => {
    setAssetTab(data);
  };

  const handleMainSetTab = (data) => {
    setTab(data);
  };
  const handleSwitchChange = () => {
    setIsCritical(!isCritical);
  };
  // Dummy Table Data
  const bankName = "Yes bank";
  const shareType = "Equity Shares";
  const equityAmt = 150000;
  const CurrentVal = 155000;
  const value1 = 32.99;
  const value2 = 34.99;
  const totalinvest = 4309909;
  const totalcurrval = 4309909;
  const totalGain = 4309909;
  const totalabs = 329;

  return (
    <>
      <FintooLoader isLoading={isLoading} />
      <>
        <div className="white-box mt-2">
          <div className="d-md-flex justify-content-md-between ">
            <div className="d-flex top-tab-menu noselect tab-box p-0 md-mb-0 mb-0">
              <div
                className={`tab-menu-item ${tab == "tab1" ? "active" : ""}`}
                onClick={() => setTab("tab1")}
              >
                <div className="tab-menu-title">ASSETS</div>
              </div>
              <div
                className={`tab-menu-item ${tab == "tab2" ? "active" : ""}`}
                onClick={() => setTab("tab2")}
              >
                <div className="tab-menu-title">LIABILITIES</div>
              </div>
            </div>
            <div className={`${Styles.projectionDetails}`}>
              {tab == "tab1" ? (
                <>
                  <div className="d-flex mt-md-0 ">
                    <div className="d-flex ms-md-5 ">Summary</div>
                    <Switch
                      onChange={handleSwitchChange}
                      checked={isCritical}
                      className="react-switch px-2"
                      activeBoxShadow="0 0 2px 3px #042b62"
                      uncheckedIcon={false}
                      checkedIcon={false}
                      height={20}
                      width={40}
                      onColor="#042b62"
                      offColor="#d8dae5"
                    />
                    <div>Projections</div>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {Object.keys(session).length > 0 && (
            <div>
              <div className={tab == "tab1" ? "d-block" : "d-none"}>
                <div
                  className=" tab-box"
                  style={{
                    padding: "0px",
                  }}
                >
                  <div className="tabs innerTabs subTabWrapper">
                    <ul
                      className={`p-0 pt-4 nav-buttons nwassetlist justify-content-start nav-secoandary ${Styles.Nwassetlist}`}
                      id="intro-appendix"
                    >
                      <li
                        className={`tab-menu-item ${assettab == "tab7" ? "active" : ""
                          }`}
                        style={{
                          padding: "0 1rem",
                        }}
                      >
                        <a
                          style={{ padding: "8px" }}
                          href
                          onClick={() => setAssetTab("tab7")}
                        >
                          Equity
                        </a>
                      </li>
                      <li
                        className={`tab-menu-item ${assettab == "tab8" ? "active" : ""
                          }`}
                        style={{
                          padding: "0 1rem",
                        }}
                      >
                        <a
                          style={{ padding: "8px" }}
                          href
                          onClick={() => setAssetTab("tab8")}
                        >
                          Debt
                        </a>
                      </li>
                      <li
                        className={`tab-menu-item ${assettab == "tab10" ? "active" : ""
                          }`}
                        style={{
                          padding: "0 1rem",
                        }}
                      >
                        <a
                          style={{ padding: "8px" }}
                          href
                          onClick={() => setAssetTab("tab10")}
                        >
                          Alternate
                        </a>
                      </li>
                      <li
                        className={`tab-menu-item ${assettab == "tab12" ? "active" : ""
                          }`}
                        style={{
                          padding: "0 1rem",
                        }}
                      >
                        <a
                          style={{ padding: "8px" }}
                          href
                          onClick={() => setAssetTab("tab12")}
                        >
                          Gold
                        </a>
                      </li>
                      <li
                        className={`tab-menu-item ${assettab == "tab11" ? "active" : ""
                          }`}
                        style={{
                          padding: "0 1rem",
                        }}
                      >
                        <a
                          style={{ padding: "8px" }}
                          href
                          onClick={() => setAssetTab("tab11")}
                        >
                          Real Estate
                        </a>
                      </li>
                      <li
                        className={`tab-menu-item ${assettab == "tab9" ? "active" : ""
                          }`}
                        style={{
                          padding: "0 1rem",
                        }}
                      >
                        <a
                          style={{ padding: "8px" }}
                          href
                          onClick={() => setAssetTab("tab9")}
                        >
                          Insurance
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="overflow-auto">
                  <div className={assettab == "tab7" ? "d-block" : "d-none"}>
                    {isCritical ? (
                      <>
                        {Object.keys(equitynetworthdata).length > 0 ? (
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Year</th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Opening Balance
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Current Committed Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Fund Utilized For The Goal
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Switch Out To Any Other Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Switch In From Any Other Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Annual Growth
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Closing
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Notes
                                  </th>
                                </tr>
                                {equitynetworthdata.opening_balance &&
                                  Object.keys(
                                    equitynetworthdata.opening_balance
                                  ).map((year, index) => (
                                    // {Array(6).fill(null).map((_, index) => (

                                    <tr key={index} className="tabledata">
                                      <td>{year}</td>
                                      <td>
                                        {formatToIndianRupee(
                                          equitynetworthdata.opening_balance[
                                          year
                                          ]
                                        )}{" "}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          equitynetworthdata
                                            .commited_investment[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          equitynetworthdata.fund_for_goal[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          equitynetworthdata.switch_out[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          equitynetworthdata.switch_in[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          equitynetworthdata.annual_growth[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          equitynetworthdata.closing_balance[year]
                                        )}
                                      </td>
                                      <td className="text-center">
                                        {equitynetworthdata.notes[year] !=
                                          "" ? (
                                          <span>
                                            <BiInfoCircle
                                              style={{
                                                fontSize: "16px",
                                                outline: "none",
                                              }}
                                              data-tip
                                              data-for={"EquityProjection" + index + equitynetworthdata.notes[year]}
                                              data-event-off
                                              data-class={`${BondsCss.ipotooltip}`}
                                              data-title=""
                                              src={
                                                process.env
                                                  .REACT_APP_STATIC_URL +
                                                "media/DMF/information.png"
                                              }
                                            />

                                            <Info
                                              className={`${BondsCss.ipotooltip}`}
                                              id={"EquityProjection" + index + equitynetworthdata.notes[year]}
                                              place="top"
                                            >
                                              <InfoMessage >
                                                {equitynetworthdata.notes[year]}
                                              </InfoMessage>
                                            </Info>
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <DataNotFound />
                        )}
                      </>
                    ) : (
                      <>
                        {equityData && Object.entries(equityData).length > 0 ? (
                          <div>
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Name of Investment</th>
                                  <th>Sub - Category</th>
                                  <th>Invested amount (₹)</th>
                                  <th>Current value (₹)</th>
                                  <th>Gain/Loss (₹)</th>
                                  <th>Absolute (%)</th>
                                </tr>
                                {equityData.data &&
                                  equityData.data.map((equity, index) => {
                                    return (
                                      <tr key={index} className="tabledata">

                                        <td>{equity["user_asset_name"]}</td>
                                        <td>{equity["sub_category_name"]}</td>
                                        <td>
                                          {rsFilter(equity["invested_value"])}
                                        </td>
                                        <td>
                                          {rsFilter(equity["current_value"])}
                                        </td>
                                        {equity["gain_loss"] < 0 ? (
                                          <td style={{ color: "red" }}>
                                            (
                                            {formatToIndianRupee(
                                              makePositive(equity["gain_loss"])
                                            )}
                                            )
                                          </td>
                                        ) : (
                                          <td>
                                            {rsFilter(equity["gain_loss"])}
                                          </td>
                                        )}
                                        {equity["absolute"] < 0 ? (
                                          <td style={{ color: "red" }}>
                                            (
                                            {formatToIndianRupee(
                                              makePositive(equity["absolute"])
                                            )}
                                            )
                                          </td>
                                        ) : (
                                          <td>
                                            {formatToIndianRupee(
                                              equity["absolute"]
                                            )}
                                          </td>
                                        )}
                                      </tr>
                                    );
                                  })}
                                <tr className="bold top-line total-value">
                                  <td colSpan={2}>Total</td>
                                  <td className="">
                                    {rsFilter(
                                      equityData["total_invested_value"]
                                    )}
                                  </td>
                                  <td className="">
                                    {rsFilter(
                                      equityData["total_current_value"]
                                    )}
                                  </td>
                                  {equityData["total_gain_loss"] < 0 ? (
                                    <td style={{ color: "red" }}>
                                      (
                                      {rsFilter(
                                        makePositive(
                                          equityData["total_gain_loss"]
                                        )
                                      )}
                                      )
                                    </td>
                                  ) : (
                                    <td>
                                      {rsFilter(equityData["total_gain_loss"])}
                                    </td>
                                  )}
                                  {equityData["total_absolute"] < 0 ? (
                                    <td style={{ color: "red" }}>
                                      (
                                      {formatToIndianRupee(
                                        makePositive(
                                          equityData["total_absolute"]
                                        )
                                      )}
                                      )
                                    </td>
                                  ) : (
                                    <td>
                                      {formatToIndianRupee(equityData["total_absolute"])}
                                    </td>
                                  )}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <DataNotFound />
                        )}
                      </>
                    )}
                  </div>
                  <div className={assettab == "tab8" ? "d-block" : "d-none"}>
                    {isCritical ? (
                      <>
                        {Object.keys(debtnetworthdata).length > 0 ? (
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Year</th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Opening Balance
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Current Committed Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Fund Utilized For The Goal
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Switch Out To Any Other Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Switch In From Any Other Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Annual Growth
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Closing
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Notes
                                  </th>
                                </tr>
                                {debtnetworthdata.opening_balance &&
                                  Object.keys(
                                    debtnetworthdata.opening_balance
                                  ).map((year, index) => (
                                    // {Array(6).fill(null).map((_, index) => (
                                    <tr key={index} className="tabledata">
                                      <td>{year}</td>
                                      <td>
                                        {formatToIndianRupee(
                                          debtnetworthdata.opening_balance[year]
                                        )}{" "}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          debtnetworthdata.commited_investment[
                                          year
                                          ]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          debtnetworthdata.fund_for_goal[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          debtnetworthdata.switch_out[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          debtnetworthdata.switch_in[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          debtnetworthdata.annual_growth[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          debtnetworthdata.closing_balance[year]
                                        )}
                                      </td>
                                      <td className="text-center">
                                        {debtnetworthdata.notes[year] != "" ? (
                                          <>
                                            <BiInfoCircle
                                              style={{
                                                fontSize: "16px",
                                                outline: "none",
                                              }}
                                              data-tip
                                              data-for={"DebtProjection" + index + debtnetworthdata.notes[year]}
                                              data-event-off
                                              data-class={`${BondsCss.ipotooltip}`}
                                              data-title=""
                                              src={
                                                process.env
                                                  .REACT_APP_STATIC_URL +
                                                "media/DMF/information.png"
                                              }
                                            />

                                            <Info
                                              className={`${BondsCss.ipotooltip}`}
                                              id={"DebtProjection" + index + debtnetworthdata.notes[year]}
                                              place="top"
                                            >
                                              <InfoMessage>
                                                {debtnetworthdata.notes[year]}
                                              </InfoMessage>
                                            </Info>
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <DataNotFound />
                        )}
                      </>
                    ) : (
                      <>
                        {debtData &&
                          Object.entries(debtData).length > 0 &&
                          debtData.data.length > 0 ? (
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Name of Assets</th>
                                  <th>Sub - Category</th>
                                  <th>Name Of the Holder</th>
                                  <th>Invested Value (₹)</th>
                                  <th>Current value (₹)</th>
                                  <th>Maturity Date</th>
                                  <th>Maturity Amount(₹)</th>
                                </tr>
                                {debtData.data.map((debt, index) => {
                                  return (
                                    <tr key={index} className="tabledata">
                                      <td>{debt["user_asset_name"]}</td>
                                      <td>{debt["sub_category_name"]}</td>
                                      <td>{debt["holderName"]}</td>
                                      <td>
                                        {rsFilter(debt["invested_amount"])}
                                      </td>
                                      <td>{rsFilter(debt["current_price"])}</td>
                                      <td>{debt["maturity_date"] && !isNaN(new Date(debt["maturity_date"]).getTime()) ? moment(debt["maturity_date"]).format("DD/MM/YYYY") : "N/A"}</td>
                                      <td>
                                        {rsFilter(debt["maturity_amount"])}
                                      </td>
                                    </tr>
                                  );
                                })}
                                <tr className="bold top-line total-value">
                                  <td colSpan={3}>Total</td>
                                  <td className="">
                                    {rsFilter(debtData["total_invested"])}
                                  </td>
                                  <td className="">
                                    {rsFilter(debtData["total_current"])}{" "}
                                  </td>
                                  <td className=""></td>
                                  <td className="">
                                    {rsFilter(debtData["total_maturity"])}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <DataNotFound />
                        )}
                      </>
                    )}
                  </div>

                  <div className={assettab == "tab10" ? "d-block" : "d-none"}>
                    {isCritical ? (
                      <>
                        {Object.keys(alternateNetworthData).length > 0 ? (
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Year</th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Opening Balance
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Current Committed Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Fund Utilized For The Goal
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Switch Out To Any Other Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Switch In From Any Other Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Annual Growth
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Closing
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Notes
                                  </th>
                                </tr>
                                {alternateNetworthData.opening_balance &&
                                  Object.keys(
                                    alternateNetworthData.opening_balance
                                  ).map((year, index) => (
                                    // {Array(6).fill(null).map((_, index) => (
                                    <tr key={index} className="tabledata">
                                      <td>{year}</td>
                                      <td>
                                        {formatToIndianRupee(
                                          alternateNetworthData.opening_balance[
                                          year
                                          ]
                                        )}{" "}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          alternateNetworthData
                                            .commited_investment[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          alternateNetworthData.fund_for_goal[
                                          year
                                          ]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          alternateNetworthData.switch_out[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          alternateNetworthData.switch_in[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          alternateNetworthData.annual_growth[
                                          year
                                          ]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          alternateNetworthData.closing_balance[
                                          year
                                          ]
                                        )}
                                      </td>
                                      <td className="text-center">
                                        {alternateNetworthData.notes[year] != "" ? (
                                          <>
                                            <BiInfoCircle
                                              style={{
                                                fontSize: "16px",
                                                outline: "none",
                                              }}
                                              data-tip
                                              data-for={"AlternateProjection" + index + alternateNetworthData.notes[year]}
                                              data-event-off
                                              data-class={`${BondsCss.ipotooltip}`}
                                              data-title=""
                                              src={
                                                process.env
                                                  .REACT_APP_STATIC_URL +
                                                "media/DMF/information.png"
                                              }
                                            />

                                            <Info
                                              className={`${BondsCss.ipotooltip}`}
                                              id={"AlternateProjection" + index + alternateNetworthData.notes[year]}
                                              place="top"
                                            >
                                              <InfoMessage>
                                                {alternateNetworthData.notes[year]}
                                              </InfoMessage>
                                            </Info>
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <DataNotFound />
                        )}
                      </>
                    ) : (
                      <>
                        {/* {console.log("alternateAssetData", alternateAssetData)} */}
                        {alternateAssetData &&
                          Object.entries(alternateAssetData).length > 0 &&
                          alternateAssetData.data.length > 0 ? (
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Name of Assets</th>
                                  <th>Category</th>
                                  <th>Sub - Category</th>
                                  <th>Name Of the Holder</th>
                                  <th>Invested Value (₹)</th>
                                  <th>Current value (₹)</th>
                                  <th>Absolute Return (%)</th>
                                </tr>
                                {alternateAssetData.data.map((alternate, index) => {
                                  return (
                                    <tr key={index} className="tabledata">
                                      <td>{alternate["user_asset_name"]}</td>
                                      <td>{alternate["category_name"]}</td>
                                      <td>{alternate["sub_category_name"]}</td>
                                      <td>{alternate["fullname"]}</td>
                                      <td>
                                        {rsFilter(alternate["invested_amount"])}
                                      </td>
                                      <td>
                                        {rsFilter(alternate["current_amount"])}
                                      </td>
                                      {alternate["absolute_return"] < 0 ? (
                                        <td style={{ color: "red" }}>
                                          ({Math.abs(alternate["absolute_return"])})
                                        </td>
                                      ) : (
                                        <td>{alternate["absolute_return"]}</td>
                                      )}
                                    </tr>
                                  );
                                })}
                                <tr className="bold top-line total-value">
                                  <td colSpan={4}>Total</td>
                                  <td className="">
                                    {rsFilter(
                                      alternateAssetData["total_invested_value"]
                                    )}
                                  </td>
                                  <td className="">
                                    {rsFilter(
                                      alternateAssetData["total_current_value"]
                                    )}{" "}
                                  </td>
                                  <td className="">
                                    {rsFilter(alternateAssetData["total_absolute"])}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <DataNotFound />
                        )}
                      </>
                    )}
                  </div>
                  <div className={assettab == "tab12" ? "d-block" : "d-none"}>
                    {isCritical ? (
                      <>
                        {Object.keys(goldNetworthData).length > 0 ? (
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Year</th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Opening Balance
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Current Committed Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Fund Utilized For The Goal
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Switch Out To Any Other Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Switch In From Any Other Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Annual Growth
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Closing
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Notes
                                  </th>
                                </tr>
                                {goldNetworthData.opening_balance &&
                                  Object.keys(
                                    goldNetworthData.opening_balance
                                  ).map((year, index) => (
                                    // {Array(6).fill(null).map((_, index) => (
                                    <tr key={index} className="tabledata">
                                      <td>{year}</td>
                                      <td>
                                        {formatToIndianRupee(
                                          goldNetworthData.opening_balance[year]
                                        )}{" "}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          goldNetworthData.commited_investment[
                                          year
                                          ]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          goldNetworthData.fund_for_goal[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          goldNetworthData.switch_out[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          goldNetworthData.switch_in[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          goldNetworthData.annual_growth[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          goldNetworthData.closing_balance[year]
                                        )}
                                      </td>
                                      <td className="text-center">
                                        {goldNetworthData.notes[year] != "" ? (
                                          <>
                                            <BiInfoCircle
                                              style={{
                                                fontSize: "16px",
                                                outline: "none",
                                              }}
                                              data-tip
                                              data-for={"GoldProjection" + index + goldNetworthData.notes[year]}
                                              data-event-off
                                              data-class={`${BondsCss.ipotooltip}`}
                                              data-title=""
                                              src={
                                                process.env
                                                  .REACT_APP_STATIC_URL +
                                                "media/DMF/information.png"
                                              }
                                            />

                                            <Info
                                              className={`${BondsCss.ipotooltip}`}
                                              id={"GoldProjection" + index + goldNetworthData.notes[year]}
                                              place="top"
                                            >
                                              <InfoMessage>
                                                {goldNetworthData.notes[year]}
                                              </InfoMessage>
                                            </Info>
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <DataNotFound />
                        )}
                      </>
                    ) : (
                      <>
                        {goldData &&
                          Object.entries(goldData).length > 0 &&
                          goldData.data.length > 0 ? (
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Name of Assets</th>
                                  <th>Category</th>
                                  <th>Sub - Category</th>
                                  <th>Name Of the Holder</th>
                                  <th>Invested Value (₹)</th>
                                  <th>Current value (₹)</th>
                                  <th>Absolute Return (%)</th>
                                </tr>
                                {goldData.data.map((gold, index) => {
                                  return (
                                    <tr key={index} className="tabledata">
                                      <td>{gold["asset_name"]}</td>
                                      <td>{gold["category_name"]}</td>
                                      <td>{gold["sub_category_name"]}</td>
                                      <td>{gold["fullname"]}</td>
                                      <td>
                                        {rsFilter(gold["invested_amount"])}
                                      </td>
                                      <td>
                                        {rsFilter(gold["current_amount"])}
                                      </td>
                                      {gold["absolute_return"] < 0 ? (
                                        <td style={{ color: "red" }}>
                                          ({Math.abs(gold["absolute_return"])})
                                        </td>
                                      ) : (
                                        <td>{gold["absolute_return"]}</td>
                                      )}
                                    </tr>
                                  );
                                })}
                                <tr className="bold top-line total-value">
                                  <td colSpan={4}>Total</td>
                                  <td className="">
                                    {rsFilter(goldData["total_invested_value"])}
                                  </td>
                                  <td className="">
                                    {rsFilter(goldData["total_current_value"])}{" "}
                                  </td>
                                  <td className="">
                                    {rsFilter(goldData["total_absolute"])}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <DataNotFound />
                        )}
                      </>
                    )}
                  </div>
                  <div className={assettab == "tab11" ? "d-block" : "d-none"}>
                    {isCritical ? (
                      <>
                        {Object.keys(realestatenetworthdata).length > 0 ? (
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Year</th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Opening Balance
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Current Committed Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Fund Utilized For The Goal
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Switch Out To Any Other Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Switch In From Any Other Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Annual Growth
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Closing
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Notes
                                  </th>
                                </tr>
                                {realestatenetworthdata.opening_balance &&
                                  Object.keys(
                                    realestatenetworthdata.opening_balance
                                  ).map((year, index) => (
                                    // {Array(6).fill(null).map((_, index) => (
                                    <tr key={index} className="tabledata">
                                      <td>{year}</td>
                                      <td>
                                        {formatToIndianRupee(
                                          realestatenetworthdata
                                            .opening_balance[year]
                                        )}{" "}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          realestatenetworthdata
                                            .commited_investment[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          realestatenetworthdata.fund_for_goal[
                                          year
                                          ]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          realestatenetworthdata.switch_out[
                                          year
                                          ]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          realestatenetworthdata.switch_in[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          realestatenetworthdata.annual_growth[
                                          year
                                          ]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          realestatenetworthdata
                                            .closing_balance[year]
                                        )}
                                      </td>
                                      <td className="text-center">
                                        {realestatenetworthdata.notes[year] != "" ? (
                                          <>
                                            <BiInfoCircle
                                              style={{
                                                fontSize: "16px",
                                                outline: "none",
                                              }}
                                              data-tip
                                              data-for={"RealEstateProjection" + index + realestatenetworthdata.notes[year]}
                                              data-event-off
                                              data-class={`${BondsCss.ipotooltip}`}
                                              data-title=""
                                              src={
                                                process.env
                                                  .REACT_APP_STATIC_URL +
                                                "media/DMF/information.png"
                                              }
                                            />

                                            <Info
                                              className={`${BondsCss.ipotooltip}`}
                                              id={"RealEstateProjection" + index + realestatenetworthdata.notes[year]}
                                              place="top"
                                            >
                                              <InfoMessage>
                                                {realestatenetworthdata.notes[year]}
                                              </InfoMessage>
                                            </Info>
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <DataNotFound />
                        )}
                      </>
                    ) : (
                      <>
                        {realEstateData &&
                          Object.entries(realEstateData).length > 0 &&
                          realEstateData.data.length > 0 ? (
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Name Of Assets </th>
                                  <th>Sub - Category</th>
                                  <th>Residential Type </th>
                                  <th>Mortgage Or Freehold </th>
                                  <th>Name Of Holder</th>
                                  <th>Invested Amount (₹)</th>
                                  <th>Current Value (₹)</th>
                                  <th>Absolute Return (%)</th>
                                </tr>
                                {realEstateData.data.map(
                                  (real_estate, index) => {
                                    return (
                                      <tr key={index} className="tabledata">
                                        <td>{real_estate["name"]}</td>
                                        <td>{real_estate["category"]}</td>
                                        <td>{real_estate["type"]}</td>
                                        <td>{real_estate["asset_type"]}</td>
                                        <td>{real_estate["holder"]}</td>
                                        <td>
                                          {rsFilter(
                                            real_estate["invested_amount"]
                                          )}
                                        </td>
                                        <td>
                                          {rsFilter(
                                            real_estate["current_amount"]
                                          )}
                                        </td>
                                        {real_estate["absolute"] < 0 ? (
                                          <td style={{ color: "red" }}>
                                            ({Math.abs(real_estate["absolute"])})
                                          </td>
                                        ) : (
                                          <td>{real_estate["absolute"]}</td>
                                        )}
                                      </tr>
                                    );
                                  }
                                )}
                                <tr className="bold top-line total-value">
                                  <td colSpan={5}>Total</td>
                                  <td className="">
                                    {rsFilter(realEstateData["total_invested"])}
                                  </td>
                                  <td className="">
                                    {rsFilter(realEstateData["total_current"])}
                                  </td>
                                  <td className="">
                                    {rsFilter(realEstateData["total_absolute"])}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <DataNotFound />
                        )}
                      </>
                    )}
                  </div>
                  <div className={assettab == "tab9" ? "d-block" : "d-none"}>
                    {isCritical ? (
                      <>
                        {Object.keys(insurancenetworthdata).length > 0 ? (
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Year</th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Opening Balance
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Current Committed Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Fund Utilized For The Goal
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Switch Out To Any Other Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Switch In From Any Other Investment
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Annual Growth
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Closing
                                  </th>
                                  <th style={{ whiteSpace: "normal" }}>
                                    Notes
                                  </th>
                                </tr>
                                {insurancenetworthdata.opening_balance &&
                                  Object.keys(
                                    insurancenetworthdata.opening_balance
                                  ).map((year, index) => (
                                    // {Array(6).fill(null).map((_, index) => (
                                    <tr key={index} className="tabledata">
                                      <td>{year}</td>
                                      <td>
                                        {formatToIndianRupee(
                                          insurancenetworthdata.opening_balance[
                                          year
                                          ]
                                        )}{" "}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          insurancenetworthdata
                                            .commited_investment[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          insurancenetworthdata.fund_for_goal[
                                          year
                                          ]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          insurancenetworthdata.switch_out[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          insurancenetworthdata.switch_in[year]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          insurancenetworthdata.annual_growth[
                                          year
                                          ]
                                        )}
                                      </td>
                                      <td>
                                        {formatToIndianRupee(
                                          insurancenetworthdata.closing_balance[
                                          year
                                          ]
                                        )}
                                      </td>
                                      <td className="text-center">
                                        {insurancenetworthdata.notes[year] != "" ? (
                                          <>
                                            <BiInfoCircle
                                              style={{
                                                fontSize: "16px",
                                                outline: "none",
                                              }}
                                              data-tip
                                              data-for={"InsuProjection" + index + insurancenetworthdata.notes[year]}
                                              data-event-off
                                              data-class={`${BondsCss.ipotooltip}`}
                                              data-title=""
                                              src={
                                                process.env
                                                  .REACT_APP_STATIC_URL +
                                                "media/DMF/information.png"
                                              }
                                            />

                                            <Info
                                              className={`${BondsCss.ipotooltip}`}
                                              id={"InsuProjection" + index + insurancenetworthdata.notes[year]}
                                              place="top"
                                            >
                                              <InfoMessage>
                                                {insurancenetworthdata.notes[year]}
                                              </InfoMessage>
                                            </Info>
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <DataNotFound />
                        )}
                      </>
                    ) : (
                      <>
                        {insuranceData &&
                          Object.entries(insuranceData).length > 0 &&
                          insuranceData.data.length > 0 ? (
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Policy Name </th>
                                  <th>Type</th>
                                  <th>Name Of Holder</th>
                                  <th>Policy Start Date</th>
                                  <th>Policy End Date</th>
                                  <th>Sum Assured (₹)</th>
                                  <th>Premium Payable (₹)</th>
                                  <th>Premium Frequency</th>
                                </tr>
                                {insuranceData.data.map((insurance, index) => {
                                  return (
                                    <tr key={index} className="tabledata">
                                      <td>{insurance["user_insurance_name"]}</td>
                                      <td>{insurance["insurance_category_type"]}</td>
                                      <td>
                                        {insurance["insurance_for_name"]}
                                      </td>
                                      <td>
                                        {insurance["user_insurance_start_date"]}
                                      </td>
                                      <td>
                                        {insurance["user_insurance_end_date"]}
                                      </td>
                                      <td>
                                        {rsFilter(
                                          insurance["user_insurance_sum_assured"]
                                        )}
                                      </td>
                                      <td>
                                        {rsFilter(
                                          insurance["user_insurance_premium_amount"]
                                        )}
                                      </td>
                                      <td>{insurance["user_insurance_premium_freq"]}</td>
                                    </tr>
                                  );
                                })}
                                <tr className="bold top-line total-value">
                                  <td colSpan={6}>Total</td>
                                  <td className="">
                                    {formatToIndianRupee(
                                      insuranceData["premium_payable"]
                                    )}
                                  </td>
                                  <td></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <DataNotFound />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={tab == "tab2" ? "d-block" : "d-none"}>
                {/* <Liability session={session} settab1={handleMainSetTab} /> */}
                <Liabilities />
              </div>
            </div>
          )}
        </div>
      </>
    </>
  );
};
export default AssetsLibTab;
