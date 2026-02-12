import React, { useState, useEffect } from "react";
import "jquery/dist/jquery";
import "react-tabs/style/react-tabs.css";
import hdfc from "../Assets/hdfc.png";
import ICICI from "../Assets/01_icici.png";
import Accordion from "./Accordion";
import FundBox from "../Compare/FundBox";
import { BsPlusCircle } from "react-icons/bs";
import { ReactComponent as AddIcon } from "../../Assets/Images/addicon_19.svg";
import MainLayout from "../Layout/MainLayout";
import axios from 'axios';
import commonEncode from '../../commonEncode';
import { ToastContainer, toast } from 'react-toastify';
import WhiteOverlay from "../HTML/WhiteOverlay";
import GuestLayout from "../Layout/GuestLayout";
import { GetSchemeDetails, GetSchemeList } from "../../FrappeIntegration-Services/services/investment-api/investmentService";


function Comapre() {
  const [show, setShow] = useState(true);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [productDetail, setProductDetail] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [txtvalue, setTxtvalue] = useState("");
  const [searchkey, setSearchkey] = useState("");
  const [name, setName] = useState("");
  const [searchlist, setSearchList] = useState([]);
  const [isHovering1, NewIsHovering] = useState(false);
  const [notReload, setNotReload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLimitMsg, setShowLimitMsg] = useState(false);
  const [allFundData, setAllFundData] = useState([
    { title: "Canara Robeco Emerging Equities Fund Direct Growth", "image": require("../Assets/01_icici.png"), id: 1 },
    { title: "DSP Midcap Direct Plan Growth", "image": require("../Assets/hdfc.png"), id: 2 },
    { title: "Axis Midcap Direct Plan Growth", "image": require("../Assets/01_icici.png"), id: 3 }
  ]);
  const refAutoComplete = React.useRef(null);
  const refSearchTxt = React.useRef(null);
  const [counter, setCounter] = useState(0);

  const removeFund = (id) => {
    var b = localStorage.getItem('schemecode');
    var a = b.split(",");
    var index = a.indexOf(id);
    if (index > -1) {
      a.splice(index, 1);
    }
    localStorage.setItem('schemecode', a.join(','));
    onLoadInIt();
  }

  const handleMouseOvernew = () => {
    NewIsHovering(true);
  };

  useEffect(() => {
    document.body.classList.add('page-compare');
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (refAutoComplete.current && !refAutoComplete.current.contains(event.target)) {
        setShowAutoComplete(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  React.useEffect(function () {
    onLoadInIt();
  }, []);

  React.useEffect(function () {
    setProductCount(productDetail.filter((v) => typeof v != 'string').length);
  }, [productDetail]);

  const onLoadInIt = async () => {
    setIsLoading(true);
    try {
      let prDetails = [];
      const oldData = productDetail || ["", "", ""];

      // ✅ Get from localStorage, sanitize and remove empty/undefined
      let scheme_code = localStorage.getItem("schemecode");
      let scheme_code_array = scheme_code
        .split(",")
        .filter(Boolean); // removes "" and undefined

      // ✅ Always make sure array has at least 3 slots
      while (scheme_code_array.length < 3) {
        scheme_code_array.push("");
      }
      scheme_code_array = scheme_code_array.slice(0, 3);
      let counter = 0;
      for (const v of scheme_code_array) {
        try {
          if (v && v.length > 0) {
            const res = await GetSchemeDetails({ scheme_code: v });
            const response = res.data;
            if (res?.status_code === 200 && res?.data) {
              prDetails[counter] = {
                ...res.data,
                validfor_flags: res.data?.validfor_flags || null
              };
            } else {
              prDetails[counter] = oldData[counter] || "";
            }
          } else {
            prDetails[counter] = oldData[counter] || "";
          }
        } catch (e) {
          console.error("Error fetching scheme details for:", v, e);
          prDetails[counter] = oldData[counter] || "";
        }
        counter++;
      }

      setProductDetail(prDetails);
      setCounter((v) => v + 1);
    } catch (e) {
      console.error("onLoadInIt error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSearchData = async () => {
    try {
      // const url = MUTUAL_FUND_DATA_API_URL;
      const controller = new AbortController();
      const res = await GetSchemeList({
        page: 1,
        sort_order: "three_year",
        search: searchkey?.search ? searchkey.search : "",
      });

      setSearchList(res.data || []);
      controller.abort();
    } catch (err) {
      console.error("Error fetching scheme list", err);
    }
  };

  useEffect(() => {
    if (!notReload) {
      fetchSearchData(searchkey);  // pass searchkey
    }
  }, [searchkey]);

  const filter = async (e) => {
    const keyword = e.target.value;

    setTxtvalue(keyword);
    if (keyword !== "" && keyword?.length > 2) {
      setSearchkey({ ...searchkey, search: keyword, recomm_search: undefined });
    } else {
      setSearchkey({ ...searchkey, recomm_search: "1", search: "" });
    }
    if (e.target.value?.length > 2 && showAutoComplete === false) {
      setShowAutoComplete(true);
    }
    setName(keyword);
  };

  const selectscheme = (item) => {
    var str = localStorage.getItem('schemecode');
    var index = ('' + str).indexOf(item.scheme_code);

    if (index > -1) {
      toast.error("Already in your compare list", { position: "bottom-left" });
      return;
    }

    if (str.trim() == "") {
      var a = [];
    } else {
      var a = str.split(",");
    }

    a.push(item.scheme_code);
    localStorage.setItem('schemecode', a.join(","));
    setShowAutoComplete(false);
    onLoadInIt();
    setTxtvalue('');
  };


  return (
    <GuestLayout>
      <ToastContainer />
      <WhiteOverlay show={isLoading} />
      <div className="container">
        <div className="Compare_Details">
          <div className="Header_Compare">
            <div className="Header_Name">
              <h4>Compare Funds</h4>
              <div
                className="Search"
                onClick={() => {
                  if (productCount > 2) {
                    setShowLimitMsg(true);
                  } else {
                    setShowLimitMsg(false);
                    refSearchTxt.current.focus();
                  }
                }}
              >
                <input
                  disabled={productCount > 2}
                  type="search"
                  name=""
                  id=""
                  placeholder="Search Funds"
                  onFocus={() => setShowAutoComplete(true)}
                  value={txtvalue}
                  onChange={filter}
                  ref={refSearchTxt}
                  style={{
                    pointerEvents: productCount > 2 ? "none" : "auto",
                    cursor: productCount > 2 ? "not-allowed" : "text"
                  }}
                />
                {showLimitMsg && productCount > 2 && (
                  <p className="text-danger mt-1">
                    You can compare only 3 funds at a time.
                  </p>
                )}
                {/* autocomplete start */}
                {showAutoComplete && <div ref={refAutoComplete} className="search-result-list mf-autocomplete">
                  {Array.isArray(searchlist) && searchlist?.length == 0 && (
                    <h6>No results found!</h6>
                  )}
                  {Array.isArray(searchlist) &&
                    searchlist?.length > 0 &&
                    searchlist.map((item) => (

                      <div className="user pointer" onClick={() => selectscheme(item)}>
                        <div className="user-name">
                          {item.scheme_name}
                        </div>
                        <div className="user-Price">
                          <div className="mf-nv-rt">
                            <p>NAV</p>
                            <p>{item.nav}</p>
                          </div>
                          <div className="mf-nv-lt">
                            <p>1D</p>
                            {item.nav_net_change >= 0 ? (
                              <p style={{ color: "#21913a" }}>
                                {item.nav_net_change}%
                              </p>
                            ) : (
                              <p style={{ color: "#E60909" }}>
                                {item.nav_net_change}%
                              </p>
                            )}
                            <p>{item.net_change}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>}

                {/* autocomplete end */}
              </div>
              <div id="emptydiv-no-display"></div>
            </div>
            <div className="Stock_Compare_List">
              <div className="compare_dec">
                <p className="compare-title-head">
                  {productCount == 0 && 'Add minimum 2 funds'}
                  {productCount == 1 && 'Add one more fund'}
                  {productCount >= 2 && 'Comparing ' + productCount + ' Funds'}

                </p>
                <p className="compare-text">
                  Detailed Comparsion on parameters like NAV | Returns | Risk |
                  Rating | Analysis
                </p>
              </div>
              <div className="items-main-container">
                {productDetail.map((v, index) => <FundBox key={index} fundData={v} onRemove={removeFund} onAdd={() => refSearchTxt.current.focus()} />)}
                {productDetail?.length < 3 && (
                  <div className="item-container d-flex justify-content-center">
                    <div className="addmore-fund-compare " onClick={() => refSearchTxt.current.focus()}>
                      <div><AddIcon width="35px" height="35px" /></div>
                    </div>
                    <div className="Invest_Btn">
                      <button onClick={() => refSearchTxt.current.focus()}>Add Fund</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={`AllComapareDetails fund-count-${allFundData?.length}`}>
            {productDetail?.length > 0 && <Accordion key={'acd-' + counter} productDetail={productDetail} />}
          </div>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
        </div>
      </div>
    </GuestLayout>

  );
}

export default Comapre;
