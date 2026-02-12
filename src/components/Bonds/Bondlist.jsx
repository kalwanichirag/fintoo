import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
import { BiFilter } from "react-icons/bi";
import ExploreStock from "../HTML/ExploreStock";
import Filter from "../Assets/filter-results-button.svg";
import ReactPaginate from "react-paginate";
import BondsCss from "./Bonds.module.css";
import { BiInfoCircle } from "react-icons/bi";
import { IoCloseCircleOutline } from "react-icons/io5";
import styled from "styled-components";
import Search from "../Assets/search.svg";
import ReactTooltip from "react-tooltip";
import { BsChevronDown } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import SlidingPanel from "react-sliding-side-panel";
import FintooSubCheckbox from "../FintooCheckbox/FintooSubCheckbox";
import Styles from "../Stocks/IPOStock/style.module.css";
import Modal from "react-responsive-modal";
import Bondinvestpopup from "./Bondinvestpopup";
import { ReactComponent as SearchIo } from "../Assets/loupe-_1_.svg";
import { getUserId } from "../../common_utilities";
function Bondlist(props) {
  const [tabName, setTabName] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  const [openSearchPanel, setOpenSearchPanel] = useState(false);
  const [sidePanelWidth, setSidePanelWidth] = useState(30);
  const [fundOptions, setFundOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onOpenSearchModal = () => setOpenSearchPanel(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isLoading == false) {
      document.body.classList.add('Popupcenter');
    } else {
      document.body.classList.remove('Popupcenter');
    }
  }, [isLoading]);

  const handleTabClick = (newTabName) => {
    setTabName(newTabName);
    // const newPath = `${process.env.PUBLIC_URL}/bonds/${newTabName}`;
    // window.history.pushState(null, "", newPath);
  };
  const activeTabStyle = {
    borderBottom: "2px solid #042b62",
  };
  const userid = getUserId();
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const onCloseModal = () => {
    setOpen(false);
  };
  const onCloseSearchModal = () => {
    setOpenSearchPanel(false);
  };
  const BondsCreditOptionList = [
    "AAA (Very Low Risk)",
    "AA (Low Risk)",
    "A (Medium Risk)",
    "BBB (High Risk)",
    "BB and below (Very High Risk)",
  ];
  const BondsYeildOptionList = ["Below 7%", "7 - 10%", "Above 10%"];
  const BondsIPFOptionList = [
    "Monthly",
    "Quaterly",
    "Semi Annually",
    "Annually",
    "On Maturity",
  ];
  const BondsfacevalueOptionList = [
    "10,000 - 1 lacs",
    "1 lacs to 5 lacs",
    "5 lacs to 10 lace & Above",
  ];
  const tabsData = {
    all: { title: "All Bonds", image: "all.png", tabImage: "01_face_value.svg" },
    recommended: {
      title: "Recommended",
      image: "recommended.png",
      tabImage: "02_recommended.svg",
    },
    "goverment-bonds": {
      title: "Goverment Bonds",
      image: "tax-saver.png",
      tabImage: "03_government_bonds.svg",
    },
    "regular-bonds": {
      title: "Regular/Discount Bonds",
      image: "insta-redeem.png",
      tabImage: "05_NSD.svg",
    },
    ncd: { title: "NCD", image: "NFO.png", tabImage: "05_NSD.svg" },
  };

  const toggleSwitch = (option) => {
    const updatedSortOrder = { ...sortOrder };
    updatedSortOrder[option] = !updatedSortOrder[option];
    setSortOrder(updatedSortOrder);
  };
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

  function handleFundOptionChange(v) {
    var fo = [...fundOptions];
    var index = fo.indexOf(v);
    if (index > -1) {
      fo.splice(index, 1);
    } else {
      fo.push(v);
    }
    setFundOptions([...fo]);
  }

  const items = Array(20).fill(null);

  // Pagination

  const itemsPerPage = 8;
  const totalItems = 20;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const data = Array.from({ length: totalItems }, (_, index) => ({
    id: index + 1,
  }));
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const colourStyles = {
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#042b62",
      };
    },
  };
  useEffect(() => {
    if (openPanel) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [openPanel]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="pt-4  container">
        <div className="react-tabs">
          <div className="Stock_Header1">
            <ul
              style={{
                whiteSpace: "nowrap",
              }}
              className="react-tabs__tab-list top-nav-menu"
            >
              <li
                className={`TabHeader ${tabName === "all" ? "react-tabs__tab--selected" : ""
                  }`}
                onClick={() => handleTabClick("all")}
                style={tabName === "all" ? activeTabStyle : {}}
              >
                <div
                  className="text-decoration-none"
                  onClick={() => handleTabClick("all")}
                >
                  <div className="top-menu-li-item">
                    <div className="imgC" style={{ paddingRight: "10px" }}>
                      <img
                        className="mt-0"
                        style={{
                          width: "32px",
                          height: "32px"
                        }}
                        src={
                          process.env.REACT_APP_STATIC_URL + "media/01_all_bonds.svg"
                        }
                        alt="All"
                      />
                    </div>
                    <div className="header-tab-title">
                      {" "}
                      {tabsData["all"]["title"]}
                    </div>
                  </div>
                </div>
              </li>
              <li
                className={`TabHeader ${tabName == "recommended" ? "react-tabs__tab--selected" : ""
                  }`}
                onClick={() => handleTabClick("recommended")}
                style={tabName === "recommended" ? activeTabStyle : {}}
              >
                <div
                  className="text-decoration-none"
                  onClick={() => handleTabClick("recommended")}
                >
                  <div className="top-menu-li-item">
                    <div className="imgC" style={{ paddingRight: "10px" }}>
                      <img
                        className="mt-0"
                        style={{
                          width: "32px",
                          height: "32px"
                        }}
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/02_recommended.svg"
                        }
                        alt="Recommended"
                      />
                    </div>
                    <div className="header-tab-title">
                      {" "}
                      {tabsData["recommended"]["title"]}
                    </div>
                  </div>
                </div>
              </li>

              <li
                className={`TabHeader ms-md-0 ms-4 ${tabName == "goverment-bonds"
                  ? "react-tabs__tab--selected"
                  : ""
                  }`}
                onClick={() => handleTabClick("goverment-bonds")}
                style={tabName === "goverment-bonds" ? activeTabStyle : {}}
              >
                <div
                  className="text-decoration-none"
                  onClick={() => handleTabClick("goverment-bonds")}
                >
                  <div className="top-menu-li-item">
                    <div className="imgC" style={{ paddingRight: "10px" }}>
                      <img
                        className="mt-0"
                        style={{
                          width: "32px",
                          height: "32px"
                        }}
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/03_government_bonds.svg"
                        }
                        alt="Goverment Bonds"
                      />
                    </div>
                    <div className="header-tab-title">
                      {" "}
                      {tabsData["goverment-bonds"]["title"]}
                    </div>
                  </div>
                </div>
              </li>

              <li
                className={`TabHeader ms-md-0 ms-4 ${tabName == "regular-bonds" ? "react-tabs__tab--selected" : ""
                  }`}
                onClick={() => handleTabClick("regular-bonds")}
                style={tabName === "regular-bonds" ? activeTabStyle : {}}
              >
                <div
                  className="text-decoration-none"
                  onClick={() => handleTabClick("regular-bonds")}
                >
                  <div className="top-menu-li-item">
                    <div className="imgC" style={{ paddingRight: "10px" }}>
                      <img
                        className="mt-0"
                        style={{
                          width: "32px",
                          height: "32px"
                        }}
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/05_NSD.svg"
                        }
                        alt="regular-bonds"
                      />
                    </div>
                    <div className="header-tab-title">
                      {" "}
                      {tabsData["regular-bonds"]["title"]}
                    </div>
                  </div>
                </div>
              </li>

              <li
                className={`TabHeader ms-md-0 ms-4 ${tabName == "ncd" ? "react-tabs__tab--selected" : ""
                  }`}
                onClick={() => handleTabClick("ncd")}
                style={tabName === "ncd" ? activeTabStyle : {}}
              >
                <div
                  className="text-decoration-none"
                  onClick={() => handleTabClick("ncd")}
                >
                  <div className="top-menu-li-item">
                    <div className="imgC" style={{ paddingRight: "10px" }}>
                      <img
                        className="mt-0"
                        style={{
                          width: "32px",
                          height: "32px"
                        }}
                        src={
                          process.env.REACT_APP_STATIC_URL + "media/05_NSD.svg"
                        }
                        alt="ncd"
                      />
                    </div>
                    <div className="header-tab-title">
                      {" "}
                      {tabsData["ncd"]["title"]}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="Stock_Search">
          <div className="searchbar-desktop">
            <div className="row ">
              <div className="col-12 col-md-3 tab-header-bx">
                <div style={{ marginTop: "0.5rem" }}>
                  <h4>
                    <div className="top-menu-li-item d-flex align-items-center">
                      <div className="imgC" style={{ paddingRight: "10px" }}>
                        <img
                          style={{
                            width: "30px",
                            height: "30px"
                          }}
                          className="mt-0"
                          src={require("../../Assets/Images/main/bonds_list/" +
                            tabsData[tabName]["tabImage"])}
                          alt={tabName}
                        />
                      </div>
                      {tabsData[tabName] ? tabsData[tabName].title : "All Bonds"}
                    </div>
                  </h4>
                </div>
              </div>

              <div className="col-10 col-md-6">
                <div className="Second">
                  <div
                    style={{
                      border: "1px solid #a4a4a4",
                    }}
                    className="search-box-container"
                  >
                    <input
                      type="text"
                      name=""
                      id="search-text"
                      placeholder="Search Bond"
                      // tabIndex={0}
                      className={`autocomplete-text ${BondsCss.BondsSearchTxt}`}
                    />
                    <span
                      className="cr-pointer"
                      onClick={() =>
                        document.getElementById("search-text").focus()
                      }
                    >
                      <SearchIo width={"1.2em"} height={"1.2em"} />
                    </span>

                  </div>
                </div>
              </div>
              <div className="col-2 col-md-3">
                <div className="row fintoo-filter-buttons">
                  <div className="col-6 ">
                    <div
                     ref={dropdownRef}
                      onClick={toggleVisibility}
                      className={`d-md-flex ${BondsCss.customSelect}`}
                    >
                      <div
                        style={{
                          fontWeight: "500",
                        }}
                        className={`${BondsCss.label}`}
                      >
                        Sort
                      </div>
                      <div>
                        <BsChevronDown />{" "}
                      </div>
                    </div>
                    {isVisible && (
                      <div className={`${BondsCss.sortOptions}`}>
                        <div className={`${BondsCss.sortLabel}`}>Yield</div>
                        <div
                          className={` ${BondsCss.toggleswitch} ${sortOrder["yield"]
                            ? BondsCss.hightolow
                            : BondsCss.lowtohigh
                            }`}
                        >
                          <div
                            onClick={() => {
                              toggleSwitch("yield");
                              setIsVisible(false);
                            }
                            }
                            className={`${BondsCss.option} ${sortOrder["yield"]
                              ? BondsCss.active
                              : BondsCss.Inactive
                              }`}
                          >
                            High to Low
                          </div>
                          <div
                            onClick={() => {
                              toggleSwitch("yield");
                              setIsVisible(false);
                            }
                            }
                            className={`${BondsCss.option} ${!sortOrder["yield"]
                              ? BondsCss.active
                              : BondsCss.Inactive
                              }`}
                          >
                            Low to High
                          </div>
                        </div>

                        <div className={`mt-2 ${BondsCss.sortLabel}`}>
                          Credit Rating
                        </div>
                        <div
                          className={` ${BondsCss.toggleswitch} ${sortOrder["creditRating"]
                            ? BondsCss.hightolow
                            : BondsCss.lowtohigh
                            }`}
                        >
                          <div
                            onClick={() => {
                              toggleSwitch("creditRating");
                              setIsVisible(false);
                            }
                            }
                            className={`${BondsCss.option} ${sortOrder["creditRating"]
                              ? BondsCss.active
                              : BondsCss.Inactive
                              }`}
                          >
                            High to Low
                          </div>
                          <div
                            onClick={() => {
                              toggleSwitch("creditRating");
                              setIsVisible(false);
                            }
                            }
                            className={`${BondsCss.option} ${!sortOrder["creditRating"]
                              ? BondsCss.active
                              : BondsCss.Inactive
                              }`}
                          >
                            Low to High
                          </div>
                        </div>

                        <div className={`mt-2 ${BondsCss.sortLabel}`}>
                          Maturity Period
                        </div>
                        <div
                          className={` ${BondsCss.toggleswitch} ${sortOrder["maturityPeriod"]
                            ? BondsCss.hightolow
                            : BondsCss.lowtohigh
                            }`}
                        >
                          <div
                            onClick={() => {
                              toggleSwitch("maturityPeriod");
                              setIsVisible(false);
                            }
                            }
                            className={`${BondsCss.option} ${sortOrder["maturityPeriod"]
                              ? BondsCss.active
                              : BondsCss.Inactive
                              }`}
                          >
                            High to Low
                          </div>
                          <div
                            onClick={() => {
                              toggleSwitch("maturityPeriod");
                              setIsVisible(false);
                            }
                            }
                            className={`${BondsCss.option} ${!sortOrder["maturityPeriod"]
                              ? BondsCss.active
                              : BondsCss.Inactive
                              }`}
                          >
                            Low to High
                          </div>
                        </div>
                        <br />
                        {/* <br /> */}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <button
                      onClick={() => setOpenPanel(true)}
                      className="Btn btn-filter"
                    >
                      <span
                        style={{
                          color: "gray",
                          fontWeight: "500",
                        }}
                      >
                        Filter{" "}
                        <BiFilter
                          style={{ fontSize: "1.5em", color: "#042b62" }}
                        />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="Mobile_Stock_search">
            <div className="Search_Filter_Mobile">
              <div className="Search_Field">
                <img onClick={onOpenSearchModal} src={Search} alt="search" />
                <div>
                  <Modal
                    className="Search_Modal"
                    open={openSearchPanel}
                    onClose={onCloseSearchModal}
                    center
                  >
                    <div>
                      <input
                        placeholder="Search for Bonds...."
                        type="search"
                        name=""
                        id=""
                      />
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                      <p className="mostpop">MostsPopular</p>
                      <div style={{ marginTop: "1rem" }}>
                        <div className="Top_Stock_List">
                          <div>Bajaj Finance Ltd. 3Y</div>
                          <div>
                            <p style={{ float: "right" }}>FD</p>
                          </div>
                        </div>
                        <div className="Top_Stock_List">
                          <div>Parag Parikh Flexi Cap Growth Direct Plan</div>
                          <div>
                            <p style={{ float: "right" }}>MF</p>
                          </div>
                        </div>
                        <div className="Top_Stock_List">
                          <div>Tata Motors Ltd.</div>
                          <div>
                            <p style={{ float: "right" }}>US Stocks</p>
                          </div>
                        </div>
                        <div className="Top_Stock_List">
                          <div>UTI Nifty 50 Index Growth Direct Plan</div>
                          <div>
                            <p style={{ float: "right" }}>MF</p>
                          </div>
                        </div>
                        <div className="Top_Stock_List">
                          <div>Mahindra & Mahindra Ltd</div>
                          <div>
                            <p style={{ float: "right" }}>FD</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <h4 className="mt-0 mb-0">  {tabsData[tabName] ? tabsData[tabName].title : "All Bonds"}</h4>
              </div>
              <div className="Filter_Field">
                <img
                  width={"16px"}
                  onClick={() => setOpenPanel(true)}
                  src={Filter}
                  alt="filter"
                />
              </div>
            </div>
          </div>
        </div>


        {currentData.map((item) => (
          <div className="item-continer-bx mf-container">
            <div className="row item-continer-row ">
              <div className="col-12 col-md-3">
                {/* <h3>{item.id}</h3> */}
                <div className="item-title-container">
                  <div className="Stock_Img">
                    <img
                      className="mt-0"
                      src={
                        "https://stg.minty.co.in/web/static//media/companyicons/0C00001QYY.png"
                      }
                    />
                  </div>
                  <div
                    className="item-title-parent"
                    style={{ verticlAlign: "middle" }}
                  >
                    <div className="item-title">
                      <a
                        href={""}
                        className="text-decoration-none"
                        target="_blank"
                      >
                        HSBC Small Cap Fund Fund
                      </a>
                    </div>
                    <span>(INS2376237673)</span>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-9">
                <div
                  className={`item-side-options ps-md-3 pe-md-3 ${BondsCss.itemSide}`}
                >
                  <div className={`${BondsCss.Sample} fordesktop`}>
                    <div className="in-options-title">
                      <span className="fordesktop">
                        Face Value{" "}
                        <sup style={{ cursor: "pointer", marginLeft: "3px" }}>
                          <BiInfoCircle
                            style={{ fontSize: "16px", outline: "none" }}
                            data-tip
                            data-for="LotSize"
                            data-event-off
                            data-class={`${BondsCss.ipotooltip}`}
                            data-title=""
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/information.png"
                            }
                          />
                        </sup>
                        <Info
                          className={`${BondsCss.ipotooltip}`}
                          id="LotSize"
                          place="top"
                        >
                          <InfoMessage>
                            A range of price within which you can place your
                            bid.
                          </InfoMessage>
                        </Info>
                      </span>
                      <span className="formobile">Face Value</span>
                    </div>
                    <div className="Value">₹ 192.16 </div>
                  </div>
                  <div className={`${BondsCss.Sample} `}>
                    <div className="in-options-title">
                      <span className="fordesktop">
                        YTM{" "}
                        <sup style={{ cursor: "pointer", marginLeft: "3px" }}>
                          <BiInfoCircle
                            style={{ fontSize: "16px", outline: "none" }}
                            data-tip
                            data-for="LotSize"
                            data-event-off
                            data-class={`${BondsCss.ipotooltip}`}
                            data-title=""
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/information.png"
                            }
                          />
                        </sup>
                        <Info
                          className={`${BondsCss.ipotooltip}`}
                          id="LotSize"
                          place="top"
                        >
                          <InfoMessage>
                            A range of price within which you can place your
                            bid.
                          </InfoMessage>
                        </Info>
                      </span>
                      <span className="formobile">YTM</span>
                    </div>
                    <div className="Value">8.05 %</div>
                  </div>
                  <div className={`${BondsCss.Sample} `}>
                    <div className="in-options-title">
                      <span className="fordesktop">
                        Maturity Date{" "}
                        <sup style={{ cursor: "pointer", marginLeft: "3px" }}>
                          <BiInfoCircle
                            style={{ fontSize: "16px", outline: "none" }}
                            data-tip
                            data-for="LotSize"
                            data-event-off
                            data-class={`${BondsCss.ipotooltip}`}
                            data-title=""
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/information.png"
                            }
                          />
                        </sup>
                        <Info
                          className={`${BondsCss.ipotooltip}`}
                          id="LotSize"
                          place="top"
                        >
                          <InfoMessage>
                            A range of price within which you can place your
                            bid.
                          </InfoMessage>
                        </Info>
                      </span>
                      <span className="formobile">Maturity Date</span>
                    </div>
                    <div className="Value">31/07/2028</div>
                  </div>
                  <div className={`${BondsCss.Sample} `}>
                    <div className="in-options-title">
                      <span className="fordesktop">
                        Payment Frequnecy{" "}
                        <sup style={{ cursor: "pointer", marginLeft: "3px" }}>
                          <BiInfoCircle
                            style={{ fontSize: "16px", outline: "none" }}
                            data-tip
                            data-for="LotSize"
                            data-event-off
                            data-class={`${BondsCss.ipotooltip}`}
                            data-title=""
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/information.png"
                            }
                          />
                        </sup>
                        <Info
                          className={`${BondsCss.ipotooltip}`}
                          id="LotSize"
                          place="top"
                        >
                          <InfoMessage>
                            A range of price within which you can place your
                            bid.
                          </InfoMessage>
                        </Info>
                      </span>
                      <span className="formobile">Payment Frequnecy</span>
                    </div>
                    <div className="Value">Quterly</div>
                  </div>
                  <div className={`${BondsCss.Sample} `}>
                    <div className="in-options-title">
                      <span className="fordesktop">
                        Credit Rating{" "}
                        <sup style={{ cursor: "pointer", marginLeft: "3px" }}>
                          <BiInfoCircle
                            style={{ fontSize: "16px", outline: "none" }}
                            data-tip
                            data-for="LotSize"
                            data-event-off
                            data-class={`${BondsCss.ipotooltip}`}
                            data-title=""
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/information.png"
                            }
                          />
                        </sup>
                        <Info
                          className={`${BondsCss.ipotooltip}`}
                          id="LotSize"
                          place="top"
                        >
                          <InfoMessage>
                            A range of price within which you can place your
                            bid.
                          </InfoMessage>
                        </Info>
                      </span>
                      <span className="formobile">Credit Rating</span>
                    </div>
                    <div className="Value">AAA</div>
                  </div>
                  <div className="Sample explore-for-desktop d-flex justify-content-end">
                    <div className="explore-now-bx">
                      <div
                        className="explore-now text-decoration-none pointer"
                        // to={process.env.PUBLIC_URL + "/Bonds/all/bond-details/"}
                        onClick={onOpenModal}
                      >
                        Invest
                      </div>
                    </div>
                    <div className="ps-4">
                      <Link
                        to={process.env.PUBLIC_URL + "/bonds/bond-details/"}
                      >
                        <ExploreStock width="17px" />
                      </Link>
                      {/* <Link
                            className="explore-now"
                            to={`/stocks/details?stock_code=${stock.nseCode}`}
                          >
                            Explore
                          </Link> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 d-none explore-for-mobile">
                <Link className="explore-now" to={""}>
                  Explore
                </Link>
              </div>
            </div>
          </div>
        ))}
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={totalPages} // Use totalPages here
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-end"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
          forcePage={currentPage}
        />
        <br />
        <br />
      </div>
      {/* Filter Section */}
      <SlidingPanel
        className="Filter_Panel"
        type={"right"}
        isOpen={openPanel}
        size={sidePanelWidth}
      >
        <Form id="FilterData" className="d-flex ps-2 flex-column">
          <div className="ps-3 pe-3 pt-4">
            <div className="pb-3 SideBar_Filter">
              <div className={`${BondsCss.filter_text}`}>Filters</div>
              <div>
                <button type="button" onClick={() => setOpenPanel(false)}>
                  <IoCloseCircleOutline
                    style={{
                      color: "gray",
                      fontSize: "1.5rem",
                    }}
                  />
                </button>
              </div>
            </div>
            {/* <div style={{ marginTop: "1rem" }} className="Line"></div> */}
          </div>
          <div className="p-3 pt-0" style={{ flexGrow: "1", overflow: "auto" }}>
            <div className="fltr-section pt-0">
              <h4 className="pb-0">Credit Rating</h4>
              <div className={`p-0 ${BondsCss.filterlabel}`}>
                A bond rating a grade given to a bond by various rating
                services. <br /> Higher the rating safer the bond.
              </div>
              <div className="fund_Option">
                <ul className="fltr-items d-grid w-100">
                  {BondsCreditOptionList.map((v) => (
                    <li
                      className="fltr-items-li w-100"
                      key={"fo-" + v.toLowerCase()}
                    >
                      <div className="chk-item-bx">
                        <FintooSubCheckbox
                          checked={fundOptions.indexOf(v.toLowerCase()) > -1}
                          title={v}
                          onChange={() =>
                            handleFundOptionChange(v.toLowerCase())
                          }
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="fltr-section pt-0">
              <h4 className="pb-0">Yeild</h4>
              <div className={`p-0 ${BondsCss.filterlabel}`}>
                This shows percentage return on bond
              </div>
              <div className="fund_Option">
                <ul className="fltr-items d-grid w-100">
                  {BondsYeildOptionList.map((v) => (
                    <li
                      className="fltr-items-li w-100"
                      key={"fo-" + v.toLowerCase()}
                    >
                      <div className="chk-item-bx">
                        <FintooSubCheckbox
                          checked={fundOptions.indexOf(v.toLowerCase()) > -1}
                          title={v}
                          onChange={() =>
                            handleFundOptionChange(v.toLowerCase())
                          }
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="fltr-section pt-0">
              <h4 className="pb-0">Interest Payment Frequency</h4>
              <div className={`p-0 ${BondsCss.filterlabel}`}>
                This shows time period (Frequnecy) of interest
              </div>
              <div className="fund_Option">
                <ul className="fltr-items d-grid w-100">
                  {BondsIPFOptionList.map((v) => (
                    <li
                      className="fltr-items-li w-100"
                      key={"fo-" + v.toLowerCase()}
                    >
                      <div className="chk-item-bx">
                        <FintooSubCheckbox
                          checked={fundOptions.indexOf(v.toLowerCase()) > -1}
                          title={v}
                          onChange={() =>
                            handleFundOptionChange(v.toLowerCase())
                          }
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="fltr-section pt-0">
              <h4 className="pb-0">Face Value</h4>
              <div className={`p-0 ${BondsCss.filterlabel}`}>
                The face value of a bond is the price that the issuer pays back
                at the <br /> time of maturity
              </div>
              <div className="fund_Option">
                <ul className="fltr-items d-grid w-100">
                  {BondsfacevalueOptionList.map((v) => (
                    <li
                      className="fltr-items-li w-100"
                      key={"fo-" + v.toLowerCase()}
                    >
                      <div className="chk-item-bx">
                        <FintooSubCheckbox
                          checked={fundOptions.indexOf(v.toLowerCase()) > -1}
                          title={v}
                          onChange={() =>
                            handleFundOptionChange(v.toLowerCase())
                          }
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="p-3 Filter_Btn_panel">
            <div>
              <button onClick={""}>Apply</button>
            </div>
            <div
              onClick={() => {
                window.location.reload();
              }}
              style={{ paddingLeft: "5%" }}
              className="Filter_Btn_panel"
            >
              <button
                className="Reset"
                type="button"
                onClick={() => {
                  // fetchWishListFundReset();
                  // navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/funds/all");
                  window.location.reload();
                }}
              >
                Reset All
              </button>
            </div>
          </div>
        </Form>
      </SlidingPanel>
      {/* Popup */}
      <div
        style={{
          maxWidth: "400px !important",
        }}
        className={`p-2 ${Styles.Ipomodal} ${BondsCss.Bondmodal} `}
      >
        <Modal
          backdrop="static"
          animationDuration={0}
          center
          styles={{
            modal: {
              maxWidth: "650px", // Adjust this value as needed
              padding: "0rem",
            },
          }}
          open={open}
          showCloseIcon={false}
        >
          <Bondinvestpopup onCloseModal={onCloseModal} />
        </Modal>
      </div>
    </div>
  );
}

export default Bondlist;
