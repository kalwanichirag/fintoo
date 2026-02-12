import { useState } from "react";
import { useEffect } from "react";
import FintooLoader from "../../../../FintooLoader";
import Styles from "./Networth.module.css";
import {
  ADVISORY_LIABILITY_NETWORTH_DATA
} from "../../../../../constants";
import {
  apiCall,
  fetchEncryptData,
  getItemLocal,
  getParentUserId,
  loginRedirectGuest,
} from "../../../../../common_utilities";
import CustomSelectBox from "./CustomSelect";
import { MdKeyboardArrowDown } from "react-icons/md";
import Calendar from "react-calendar";
import DataNotFound from "./DataNotFound";
import Cookies from 'js-cookie';

function formatToIndianRupee(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("₹", "");
}

const Liabilities = () => {
  const [tab, setTab] = useState("tab1");
  const [type, setType] = useState("summary");
  const [selectedYear, setSelectedYear] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [year, setYear] = useState(2023);
  const [number, setNumber] = useState(1);
  const [selectedLiability, setSelectedLiability] = useState({});
  const [liabilityData, setLiabilityData] = useState([]);
  const [liabilityDetails, setLiabilityDetails] = useState({
    selectedTab: 0,
    selectedId: 100,
    minDate:new Date(),
    maxDate:""
  });
  const token = Cookies.get('token')

  useEffect(() => {
    document.body.classList.add("dg-layout");
    document.body.classList.add("rp-layout");
    // getMemberList(); - Disabled session checking
    
    const mockSessionData = {
      data: {
        id: getParentUserId(),
        fp_user_id: getParentUserId(),
        fp_log_id: "1"
      },
      status_code: "200"
    };
    
    liabilityNetWorthAPI(mockSessionData);

    return () => {
      document.body.classList.remove("dg-layout");
      document.body.classList.remove("rp-layout");
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (value) => {
    if (value === 'year') {
      setIsOpen(true);
      let minDate = selectedLiability.min_year;
      setSelectedYear(new Date(minDate)); 
    } else {
      setIsOpen(false);
      setSelectedYear(null); 
    }
    setType(value)
  };

  const handleChange = (date) => {
    const year = date;
    setSelectedYear(year);
    setYear(year);
    setIsOpen(!isOpen);
  };

  const getMemberList = async () => {
    /* 
    Session checking functionality has been disabled
    try {
      let url = '';
// let url = CHECK_SESSION;
      let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };

      let session_data = await apiCall(url, data, true, false);
      if (session_data.error_code == "102") {
        loginRedirectGuest();
      } else {
        liabilityNetWorthAPI(session_data);
      }
    } catch (e) {
      console.log("Error Occurred", e);
    }
    */
  };

  const liabilityNetWorthAPI = async (session_data) => {
    let api_data = {
      user_id: session_data["data"]["id"],
      fp_log_id: session_data["data"]["fp_log_id"],
    };
  
    let config = {
      method: "GET",
      url: `${ADVISORY_LIABILITY_NETWORTH_DATA}?user_id=${session_data["data"]["id"]}`,
      headers: {
        Authorization: `token ${token}`
      }
    };
  
    try {
      var response = await fetchEncryptData(config);
      
      if (response && response.status_code == 200 && response.data && response.data.length > 0) {
        setLiabilityData(response.data);
      } else {
        console.error("API returned error or no data:", response);
        setLiabilityData([]);
      }
    } catch (error) {
      console.error("Error in liabilityNetWorthAPI:", error);
      setLiabilityData([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const setLiability = (liability_details, tab) => {
    setLiabilityDetails({
      selectedTab: tab,
      selectedId: liability_details["unique_id"],
      selectedLiability: liability_details,
    });
  };

  useEffect(() => {
    if (liabilityData && liabilityData.length > 0) {
      let selectedLiability = {};
      selectedLiability = liabilityData.find(
        (l) => l.unique_id === liabilityDetails.selectedId
      );
      let minDate = selectedLiability.min_year;
      let maxDate = selectedLiability.max_year;
      if(minDate && maxDate){
        setLiabilityDetails({
          ...liabilityDetails,
          minDate:new Date(minDate),
          maxDate:new Date(maxDate)
        })
      }
      setSelectedYear(new Date(minDate));
      const aggregatedData = selectedLiability.record.reduce((acc, entry) => {
        const year = entry.year.toString();
      
        if (!acc[year]) {
          acc[year] = {
            year: year,
            opening_balance:0,
            emi: 0,
            interest_compound: 0,
            principle: 0,
            closing_balance: 0
          };
        }
        acc[year].opening_balance += entry.opening_balance;
        acc[year].emi += entry.emi;
        acc[year].interest_compound += entry.interest_compound;
        acc[year].principle += entry.principle;
        acc[year].closing_balance = entry.closing_balance;
      
        return acc;
      }, {});
      
      const result = Object.values(aggregatedData);
      selectedLiability = {
        ...selectedLiability,
        summary:result
      }
      setSelectedLiability(selectedLiability);
      setType("summary")
    }
  }, [liabilityData, liabilityDetails.selectedId]);

  return (
    <>
      <FintooLoader isLoading={isLoading} />
      <>
        <div className="position-relative">
          {liabilityData && liabilityData.length > 0 && (
            <div className={`${Styles.networthcustomSelectbox}`}>
              <div className={`${Styles.customselectbox}`}>
                <div onClick={toggleDropdown}>
                  {  type === "summary" ? "Summary" : (selectedYear ? selectedYear.getFullYear() : "Summary")}{" "}
                  <MdKeyboardArrowDown style={{ fontSize: "1.4rem" }} />
                </div>
                {isOpen && (
                  <div className={Styles.dropdown}>
                    <div className="custom-select">
                      <label>
                        <input
                          type="radio"
                          name="options"
                          value="summary"
                          checked={type=="summary"}
                          onChange={() => handleOptionChange("summary")}
                        />
                        Summary
                      </label>
                      <hr className="p-1 m-1" />
                      <label>
                        <input
                          type="radio"
                          name="options"
                          value="year"
                          checked={type=="year"}
                          onChange={() => handleOptionChange("year")}
                        />
                        Select Year
                      </label>
                    </div>
                    {type=="year"&& (
                      <div className="custom-options">
                        <Calendar
                          value={selectedYear}
                          onClickYear={handleChange}
                          view="decade"
                          showNavigation={true}
                          minDate={liabilityDetails.minDate}
                          maxDate={liabilityDetails.maxDate}
                          // maxDate={2030}
                          className={Styles.customCalendar}
                          tileClassName={Styles.customCalendarTile}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            {liabilityData && liabilityData.length > 0 ? (
              <div className={tab == "tab1" ? "d-block" : "d-none"}>
                <div
                  className="w-100 tab-box"
                  style={{
                    padding: "0px",
                  }}
                >
                  <div className="tabs innerTabs subTabWrapper ">
                    <ul
                      className={`p-0 pt-4 nav-buttons  justify-content-start nav-secoandary ${Styles.Nwassetlist}`}
                      id="intro-appendix"
                    >
                      {liabilityData &&
                        liabilityData.map((liability, i) => {
                          return (
                            <li
                              className={`tab-menu-item ${
                                liabilityDetails.selectedTab == i
                                  ? "active"
                                  : ""
                              }`}
                              style={{
                                padding: "0 1rem",
                              }}
                            >
                              <a
                                style={{ padding: "8px" }}
                                href
                                onClick={() => setLiability(liability, i)}
                              >
                                {liability["name"]}
                              </a>
                            </li>
                          );
                        })}
                    </ul>
                    <div>
                      {selectedLiability && selectedLiability.record ?
                        type == "year" && (
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Date</th>
                                  <th>No.</th>
                                  <th>Opening Balance</th>
                                  <th>EMI</th>
                                  <th>Interest Component</th>
                                  <th>Principal</th>
                                  <th>Balance</th>
                                </tr>
                                {selectedLiability["record"].filter((record) => record["year"] === selectedYear.getFullYear()).map((record, index) => (
                                  <tr key={index} className="tabledata">
                                    <td>{record["month"] + "-" + record["year"]}</td>
                                    <td>{index + 1}</td>
                                    <td>{formatToIndianRupee(record["opening_balance"])}</td>
                                    <td>{formatToIndianRupee(record["emi"])}</td>
                                    <td>{formatToIndianRupee(record["interest_compound"])}</td>
                                    <td>{formatToIndianRupee(record["principle"])}</td>
                                    <td>{formatToIndianRupee(record["closing_balance"])}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                      ) :(
                        ""
                      )}
                      {selectedLiability && selectedLiability.summary ?
                        type == "summary" && (
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable">
                              <tbody>
                                <tr>
                                  <th>Year End</th>
                                  <th>Principle (A)</th>
                                  <th>Interest (B)</th>
                                  <th>Total Payment (A+B)</th>
                                  <th>Closing Balance</th>
                                </tr>
                                  {selectedLiability["summary"].map((record, index) => (
                                    <tr key={index} className="tabledata">
                                      <td>{record["year"]}</td>
                                      <td>{formatToIndianRupee(record["principle"])}</td>
                                      <td>{formatToIndianRupee(record["interest_compound"])}</td>
                                      <td>{formatToIndianRupee(record["emi"])}</td>
                                      <td>{formatToIndianRupee(record["closing_balance"])}</td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                      ) :(
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <DataNotFound />
            )}
          </div>
        </div>
      </>
    </>
  );
};
export default Liabilities;
