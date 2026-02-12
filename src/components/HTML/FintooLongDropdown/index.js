// index.js backup


import React, { useState, useEffect } from "react";
import iciciLogo from "../../../Assets/Images/01_icici.png";
import { IoChevronBackCircleOutline, IoClose } from "react-icons/io5";
import FintooButton from "../FintooButton";
import uuid from "react-uuid";
import styles from "./style.module.css";
import {
  CheckSession,
  fetchEncryptData,
  getUserId,
} from "../../../common_utilities";
import { FaStar } from "react-icons/fa";

const FintooLongDropdown = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [foundStocks, setFoundFund] = useState("");
  const refLongDropdown = React.useRef(null);
  const handleChange = () => {
    if (Boolean(props.hideDropdown) == false) {
        setShowDropdown((v) => !v);
    }
}

  useEffect(()=> {
    if(localStorage.getItem("switch_to")) {
        setSelected(localStorage.getItem("switch_to"));
    }   
  }, []);

  useEffect(()=> {
    setFoundFund(props_data)
  }, []);

  useEffect(() => {
    if(selected) {
      props.onChange(selected);
      if (selected.includes("ELSS")) {
        if (props.isElss) {
          props.isElss(true);
        }
      } else {
        if (props.isElss) {
          props.isElss(false);
        }
      }
    }
  }, [selected]); 

var props_data = props.value;

const handleSearch = async (e) => {
  const keyword = e.target.value;
  setSearchTerm(keyword);
  if (keyword !== "" && keyword.length > 2) {
    const searchedFund = await fetchschemecode(keyword);
  }else if (keyword.length <= 2) { 
    setFoundFund(props_data);

  }
};

const fetchschemecode = async (searchValue) => {
  try {
    var detailsData = JSON.parse(localStorage.getItem("detailsData"));
    var details = detailsData.amc_code;
    var payload = {
      method: "post",
      // url:DMF_GET_SCHEME_BY_AMC_API_URL,
      url:'',
      data: { amc_code: details, search: searchValue, transaction_type: props.transaction_type ? props.transaction_type : "" },
    };

    var res = await fetchEncryptData(payload);
    setFoundFund(res.data);
  } catch (e) {}
};

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (refLongDropdown.current && !refLongDropdown.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="px-md-4 noselect long-dropdown-main-box">
      <div className="">{props.label}</div>
      <div>
        <div className={`${styles.longDropdown}`}>
          <div className={`d-flex ${styles.longDropdownText}`} onClick={() => setShowDropdown((v) => !v)}>
            <p onClick={() => handleChange()} className="flex-grow-1 ">
              <strong>{selected ? foundStocks.filter((v)=> v.scheme_name === selected)[0]['scheme_name'] : ""}</strong> 
            </p>
            <div
              className={props.hideDropdown == true ? "invisible" : ""}

            >
              <IoChevronBackCircleOutline
                width={"1.2rem"}
                height={"1.2rem"}
                className={styles.myDropdownArrow}
              />
            </div>
          </div>

          {showDropdown && (
            <div ref={refLongDropdown} className={styles.longDropdownBox}>
              <div className="p-4">
                <input
                  type="text"
                  name=""
                  id="search-text"
                  value={searchTerm}
                  placeholder="Search fund"
                  className={`w-100 ${styles.dFundInput}`}
                  onChange={handleSearch} 
                />
              </div>
              <hr className="mt-0" />
              <div className="p-1">
                <div className={styles.fixedHeightResults}>
                  {[...foundStocks].map((v) => (
                    <div className={`${styles.tblFnBx} py-4`} key={uuid()}>
                      <table className="w-100">
                        <tr>
                          <td className={`${styles.amcLogoBx}`}>
                            <img
                              // alt="AMC logo"
                              width={"50px"}
                              src={`${process.env.PUBLIC_URL}/static/media/companyicons/${v.amc_code}.png`}
                            />
                          </td>
                          <td colSpan={2}>
                            <div className={styles.fnAmcName}>
                              <div className={`h5 ${styles.fnAmcName1}`} onClick ={()=> {setSelected(v.scheme_name);
                               setShowDropdown(false);}}>
                              {v.scheme_name}
                             
                              </div>
                              <div className={`d-flex ${styles.fnAmcName2}`}>
                                <div>{v.fintoo_category_name}</div>
                                <div>{v.risk_value}</div>
                                <div>{v.star_rating}
                               
                                  <FaStar style={{ color: "#FFBF00" }} />
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>&nbsp;</td>
                          <td>
                            <div className="d-flex">
                              <div className="flex-grow-1">
                                <div>NAV</div>
                                <div>{v.nav}</div>
                              </div>
                              <div className="flex-grow-1">
                                <div>1 Year</div>
                                <div>{v.scheme_1_year_ret}%</div>
                              </div>
                              <div className="flex-grow-1">
                                <div>3 Year</div>
                                <div>{v.scheme_3_year_ret}%</div>
                              </div>
                              <div className="flex-grow-1">
                                <div>5 Year</div>
                                <div>{v.scheme_5_year_ret}%</div>
                              </div>
                            </div>
                          </td>
                          <td className={`td-btn-box ${styles.fnAddFundBtn}`}>
                            <FintooButton
                              title="Select"
                              onClick={() => {
                                setSelected(v.scheme_name);
                                setShowDropdown(false);
                                // setFirstFundData(v);
                              }
                              }
                            />
                          </td>
                        </tr>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FintooLongDropdown;