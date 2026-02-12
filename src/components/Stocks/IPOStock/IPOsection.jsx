import React, { useEffect, useState, useRef } from "react";
import Styles from "./style.module.css";
import { BiInfoCircle } from "react-icons/bi";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import { FaShareAlt, FaRegBookmark } from "react-icons/fa";
import AddToWish from "../../AddToWish";
import FintooShareBox from "../../HTML/FintooShareBox/FintooShareBox";
import { IoMdClose } from "react-icons/io";
import { rsFilter } from "../../../common_utilities";
import moment from "moment";
import * as toastr from "toastr";
import "toastr/build/toastr.css";

function IPOsection({ tabs, ipoDetails }) {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(null);
  const [style, setStyle] = useState("cont");
  const [style2, setStyle2] = useState("cont");
  const handleTogglewish = () => {
    setIsWish((prevState) => !prevState);
  };
  const handleToggle = () => {
    setIsOpen((prevState) => !prevState);
  };
  const onCloseModal = () => {
    setOpen(false);
  };
  const changeStyle = () => {
    setIsInWishlist(!isInWishlist);
    setStyle("cont3");
    if (!isInWishlist) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.success("Added to wishlist!");
    } else {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.success("Removed from wishlist!");
    }
  };
  React.useEffect(() => {
    if (isInWishlist === true) {
    } else if (isInWishlist === false) {
    }
  }, [isInWishlist]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [ipoDetail, setIpoDetail] = useState([]);
  const tabRefs = tabs.map(() => useRef());
  const [scroll, setScroll] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIpoDetail(ipoDetails);
  }, [ipoDetails]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 116);
    });
  }, []);
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
  const sectionRefs = [
    { id: 1, section: "Overview" },
    { id: 2, section: "SubscriptionRate" },
    { id: 3, section: "IPOFinancials" },
    { id: 4, section: "Objective" },
  ];

  const formatDate = (date) => {
    const dateObject = new Date(date);
    const formattedDate = moment(dateObject).format("D MMM YYYY");
    return formattedDate;
  };

  const checkNA = (string) => {
    if (string == "" || string == null || string == 0) {
      return "N/A";
    } else {
      return string;
    }
  };

  const checkNil = (string) => {
    if (string == "" || string == null || string == 0) {
      return "Nil";
    } else {
      return string;
    }
  };

  const objectives = (objective) => {
    if (objective) {
      const purposeArray = objective.split(";");

      const formattedList = purposeArray.map((purpose, index) => {
        // Extract text after the dot and space
        const purposeText = purpose.split(". ")[1];

        return (
          <div key={index} className={`ms-1 ${Styles.ipoOther}`}>
            <div className="d-flex">
              <span>
                <IoChevronBackCircleSharp className={`${Styles.Nexticon}`} />
              </span>
              <span className={`${Styles.objTxt}`}>{purposeText}</span>
            </div>
          </div>
        );
      });
      return formattedList;
    } else {
      return <span>N/A</span>;
    }
  };

  const scrollToSection = (sectionName) => {
    const section = document
      .getElementById(sectionName)
      .getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + section.top - 230,
      behavior: "smooth",
    });
  };

  const getCurrentDateMinusOne = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = formatDates(yesterday);
    return formattedDate;
  };

  const formatDates = (date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const day = date.getDate();

    return `${months[monthIndex]} ${day}, ${year}`;
  }
  
  useEffect(() => {
    const handleScroll = () => {
      // console.log(
      //   "handleScroll",
      //   window.scrollY,
      //   document.getElementById("Objective").getBoundingClientRect().top
      // );
      if (
        window.scrollY >
        document.getElementById("Objective").getBoundingClientRect().top + 280
      ) {
        setActiveTab("Objective");
      } else if (
        window.scrollY >
        document.getElementById("IPOFinancials").getBoundingClientRect().top +
          230
      ) {
        setActiveTab("IPOFinancials");
      } else if (
        window.scrollY >
        document.getElementById("SubscriptionRate").getBoundingClientRect()
          .top -
          230
      ) {
        setActiveTab("SubscriptionRate");
      } else if (
        window.scrollY >
        document.getElementById("Overview").getBoundingClientRect().top - 230
      ) {
        setActiveTab("Overview");
      }
      if (window.scrollY > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div>
      <div
        ref={containerRef}
        className={`${scroll ? Styles.ScrollIpoHead : ""}`}
      >
        <div className=" d-flex justify-content-between align-items-center">
          <div className={`${Styles.ipoNameOptions}`}>
            <img
              src={
                "https://stg.minty.co.in/web/static//media/companyicons/0C00003HJY.png"
              }
              alt=""
            />
            <span className={`${Styles.iponame}`}>{ipoDetail.COMPNAME}</span>
          </div>
          <div
            className={
              scroll
                ? "d-none"
                : "d-md-flex justify-content-around align-items-md-center mt-md-0 pt-md-0 pt-4"
            }
          >
            <div className={`${Styles.ipopricerange}`}>
              ₹ {ipoDetail.ISSUEPRICE1}-{ipoDetail.ISSUEPRICE2}{" "}
              <span>Per Share</span>
            </div>
            <div className={`d-flex ms-md-5 ms-4  ${Styles.iposhareoptions}`}>
              <span>
                {isOpen ? (
                  <>
                    <IoMdClose
                      style={{ fontSize: "20px", cursor: "pointer" }}
                      className={"cont"}
                      onClick={handleToggle}
                    />
                  </>
                ) : (
                  <>
                    <FaShareAlt
                      className={`pointer ${Styles.shareIpoicon}`}
                      onClick={handleToggle}
                    />
                  </>
                )}
              </span>
              <span
                className=" changeColor"
                style={{ cursor: "pointer", zIndex: 100 }}
                onClick={changeStyle}
              >
                <AddToWish value={isInWishlist} />
              </span>
            </div>
            <div
              className={`${Styles.outericons} ${isOpen ? Styles.visible : ""}`}
            >
              <FintooShareBox />
            </div>
          </div>
        </div>
        <div
          className={`mt-4 overflow-auto ${Styles.ipotabs}`}
          sectionRefs={sectionRefs}
        >
          {tabs.map((tab, val) => (
            <div
              key={tab}
              className={`text-decoration-none tabList ${Styles.tab} ${
                activeTab === sectionRefs[val].section
                  ? `${Styles.Active}`
                  : `${Styles.Inactive}`
              }`}
              onClick={() => {
                setActiveTab(tab);
                scrollToSection(sectionRefs[val].section);
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
      <div
        className={scroll ? `${Styles.borderRdRemove}` : ""}
        style={{
          zIndex: "999",
        }}
      >
        <div className={`${Styles.iposecBoxeslist}`}>
          {sectionRefs.map((sectionRef) => (
            <div
              key={sectionRef.id}
              id={sectionRef.section}
              className={`${Styles.iposectionbox}`}
            >
              {sectionRef.section === "Overview" && (
                <div id="Overview" className={`${Styles.iposectionbox}`}>
                  <p className={`${Styles.sectionName}`}>Overview</p>
                  <div className={`${Styles.iposectionDetails}`}>
                    <div>
                      <div className={`${Styles.ipolabel}`}>Face Value</div>
                      <div className={`${Styles.ipoval}`}>
                        ₹ {ipoDetail.FACEVALUE}
                      </div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                        Biding Start Date
                      </div>
                      <div className={`${Styles.ipoval}`}>
                        {ipoDetail.OPENDATE
                          ? formatDate(ipoDetail.OPENDATE)
                          : "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                        Biding End Date
                      </div>
                      <div className={`${Styles.ipoval}`}>
                        {ipoDetail.CLOSEDATE
                          ? formatDate(ipoDetail.CLOSEDATE)
                          : "N/A"}
                      </div>
                    </div>
                    <div className={`${Styles.popupBx}`}>
                      <div className={`${Styles.ipolabel}`}>
                        Price Range
                        <sup style={{ cursor: "pointer", marginLeft: "3px" }}>
                          <BiInfoCircle
                            style={{ fontSize: "16px", outline: "none" }}
                            data-tip
                            data-for="PriceRange"
                            data-event-off
                            data-class={`${Styles.ipotooltip}`}
                            data-title=""
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/information.png"
                            }
                          />
                        </sup>
                        <Info
                          className={`${Styles.ipotooltip}`}
                          id="PriceRange"
                          place="top"
                        >
                          <InfoMessage>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Aspernatur, similique.
                          </InfoMessage>
                        </Info>
                      </div>
                      <div className={`${Styles.ipoval}`}>
                        ₹ {ipoDetail.ISSUEPRICE1}-{ipoDetail.ISSUEPRICE2}
                      </div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                        Lot Size
                        <sup style={{ cursor: "pointer", marginLeft: "3px" }}>
                          <BiInfoCircle
                            style={{ fontSize: "16px", outline: "none" }}
                            data-tip
                            data-for="LotSize"
                            data-event-off
                            data-class={`${Styles.ipotooltip}`}
                            data-title=""
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/information.png"
                            }
                          />
                        </sup>
                        <Info
                          className={`${Styles.ipotooltip}`}
                          id="LotSize"
                          place="top"
                        >
                          <InfoMessage>
                            A range of price within which you can place your
                            bid.
                          </InfoMessage>
                        </Info>
                      </div>
                      <div className={`${Styles.ipoval}`}>
                        {ipoDetail.MINAPLN}
                      </div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                        Issue Size (Shares)
                      </div>
                      <div className={`${Styles.ipoval}`}>
                        {rsFilter(ipoDetail.TOTAL_EQUITY)}
                      </div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>Min. Invesment</div>
                      <div className={`${Styles.ipoval}`}>
                        ₹ {rsFilter(ipoDetail.ISSUEPRICE2 * ipoDetail.MINAPLN)}
                      </div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                        Max. Investment
                      </div>
                      <div className={`${Styles.ipoval}`}>
                        ₹ {rsFilter(ipoDetail.MAXRSUB)}
                      </div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                        Retail Discount
                      </div>
                      <div className={`${Styles.ipoval}`}>
                        {checkNil(ipoDetail.RETDISCOUNT)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {sectionRef.section === "SubscriptionRate" && (
                <div
                  id="SubscriptionRate"
                  className={`${Styles.iposectionbox}`}
                >
                  <p className={`d-grid ${Styles.sectionName}`}>
                    Subscription Rate
                    <span>(As on {getCurrentDateMinusOne()})</span>
                  </p>
                  <div className={`${Styles.ipoOther}`}>
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <span className={`${Styles.ipoLabel}`}>
                          Retail individual Investor
                        </span>
                        <sup
                          style={{
                            cursor: "pointer",
                            marginLeft: "3px",
                          }}
                        >
                          <BiInfoCircle
                            style={{
                              fontSize: "16px",
                              outline: "none",
                              color: "#b5b5b5",
                            }}
                            data-tip
                            data-for="Retail"
                            data-event-off
                            data-class={`${Styles.ipotooltip}`}
                            data-title=""
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/information.png"
                            }
                          />
                        </sup>
                        <Info
                          className={`${Styles.ipotooltip}`}
                          id="Retail"
                          place="top"
                        >
                          <InfoMessage>
                            Normal investors individual investor who apply upto
                            Rs 2 Lakhs in an IPO.
                          </InfoMessage>
                        </Info>
                      </div>
                      <div className={`${Styles.ipoLabel}`}>
                        {checkNA(ipoDetail.RII_Tot) != "N/A" ? (
                          <span>{ipoDetail.RII_Tot}x</span>
                        ) : (
                          <span>{checkNA(ipoDetail.RII_Tot)}</span>
                        )}
                      </div>
                    </div>
                    <hr className={`${Styles.ipoHr}`} />
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <span className={`${Styles.ipoLabel}`}>
                          Non-Institutional Investor
                        </span>
                        <sup
                          style={{
                            cursor: "pointer",
                            marginLeft: "3px",
                          }}
                        >
                          <BiInfoCircle
                            style={{
                              fontSize: "16px",
                              outline: "none",
                              color: "#b5b5b5",
                            }}
                            data-tip
                            data-for="Retail"
                            data-event-off
                            data-class={`${Styles.ipotooltip}`}
                            data-title=""
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/information.png"
                            }
                          />
                        </sup>
                        <Info
                          className={`${Styles.ipotooltip}`}
                          id="Retail"
                          place="top"
                        >
                          <InfoMessage>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Aspernatur, similique.
                          </InfoMessage>
                        </Info>
                      </div>
                      <div className={`${Styles.ipoLabel}`}>
                        {checkNA(ipoDetail.NII_Tot) != "N/A" ? (
                          <span>{ipoDetail.NII_Tot}x</span>
                        ) : (
                          <span>{checkNA(ipoDetail.NII_Tot)}</span>
                        )}
                      </div>
                    </div>
                    <hr className={`${Styles.ipoHr}`} />
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <span className={`${Styles.ipoLabel}`}>
                          Qualified Institutional Buyers
                        </span>
                        <sup
                          style={{
                            cursor: "pointer",
                            marginLeft: "3px",
                          }}
                        >
                          <BiInfoCircle
                            style={{
                              fontSize: "16px",
                              outline: "none",
                              color: "#b5b5b5",
                            }}
                            data-tip
                            data-for="Retail"
                            data-event-off
                            data-class={`${Styles.ipotooltip}`}
                            data-title=""
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/information.png"
                            }
                          />
                        </sup>
                        <Info
                          className={`${Styles.ipotooltip}`}
                          id="Retail"
                          place="top"
                        >
                          <InfoMessage>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Aspernatur, similique.
                          </InfoMessage>
                        </Info>
                      </div>
                      <div className={`${Styles.ipoLabel}`}>
                        {checkNA(ipoDetail.QIB_Tot) != "N/A" ? (
                          <span>{ipoDetail.QIB_Tot}x</span>
                        ) : (
                          <span>{checkNA(ipoDetail.QIB_Tot)}</span>
                        )}
                      </div>
                    </div>
                    <hr className={`${Styles.ipoHr}`} />
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <span className={`${Styles.ipoLabel}`}>Employees</span>
                      </div>
                      <div className={`${Styles.ipoLabel}`}>
                        {checkNA(ipoDetail.EMP_Tot) != "N/A" ? (
                          <span>{ipoDetail.EMP_Tot}x</span>
                        ) : (
                          <span>{checkNA(ipoDetail.EMP_Tot)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {sectionRef.section === "IPOFinancials" && (
                <div id="IPOFinancials" className={`${Styles.iposectionbox}`}>
                  <p className={`${Styles.sectionName}`}>IPO Financials</p>
                  <div className={`${Styles.ipoOther}`}>
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <span className={`${Styles.ipoLabel}`}>
                          Pre Promoter Holding
                        </span>
                      </div>
                      <div className={`${Styles.ipoLabel}`}>
                        {checkNA(ipoDetail.PRE_PROMOTERHOLDER) != "N/A" ? (
                          <span>{ipoDetail.PRE_PROMOTERHOLDER}%</span>
                        ) : (
                          <span>{checkNA(ipoDetail.PRE_PROMOTERHOLDER)}</span>
                        )}
                      </div>
                    </div>
                    <hr className={`${Styles.ipoHr}`} />
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <span className={`${Styles.ipoLabel}`}>
                          Pre Capital Share
                        </span>
                        <sup
                          style={{
                            cursor: "pointer",
                            marginLeft: "3px",
                          }}
                        >
                          <BiInfoCircle
                            style={{
                              fontSize: "16px",
                              outline: "none",
                              color: "#b5b5b5",
                            }}
                            data-tip
                            data-for="Retail"
                            data-event-off
                            data-class={`${Styles.ipotooltip}`}
                            data-title=""
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/information.png"
                            }
                          />
                        </sup>
                        <Info
                          className={`${Styles.ipotooltip}`}
                          id="Retail"
                          place="top"
                        >
                          <InfoMessage>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Aspernatur, similique.
                          </InfoMessage>
                        </Info>
                      </div>
                      <div className={`${Styles.ipoLabel}`}>
                        {checkNA(ipoDetail.PRE_SHARE_CAP) != "N/A" ? (
                          <span>
                            {rsFilter(parseInt(ipoDetail.PRE_SHARE_CAP))}
                          </span>
                        ) : (
                          <span>{checkNA(ipoDetail.PRE_SHARE_CAP)}</span>
                        )}
                      </div>
                    </div>
                    <hr className={`${Styles.ipoHr}`} />
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <span className={`${Styles.ipoLabel}`}>
                          Offer to Public
                        </span>
                        <sup
                          style={{
                            cursor: "pointer",
                            marginLeft: "3px",
                          }}
                        >
                          <BiInfoCircle
                            style={{
                              fontSize: "16px",
                              outline: "none",
                              color: "#b5b5b5",
                            }}
                            data-tip
                            data-for="Retail"
                            data-event-off
                            data-class={`${Styles.ipotooltip}`}
                            data-title=""
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/information.png"
                            }
                          />
                        </sup>
                        <Info
                          className={`${Styles.ipotooltip}`}
                          id="Retail"
                          place="top"
                        >
                          <InfoMessage>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Aspernatur, similique.
                          </InfoMessage>
                        </Info>
                      </div>
                      <div className={`${Styles.ipoLabel}`}>
                        {checkNA(ipoDetail.OFFER_TO_PUBLIC) != "N/A" ? (
                          <span>{rsFilter(ipoDetail.OFFER_TO_PUBLIC)}</span>
                        ) : (
                          <span>{checkNA(ipoDetail.OFFER_TO_PUBLIC)}</span>
                        )}
                      </div>
                    </div>
                    <hr className={`${Styles.ipoHr}`} />
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <span className={`${Styles.ipoLabel}`}>
                          Post Share Capital
                        </span>
                      </div>
                      <div className={`${Styles.ipoLabel}`}>
                        {checkNA(ipoDetail.POST_SHARECAP) != "N/A" ? (
                          <span>{rsFilter(ipoDetail.POST_SHARECAP)}</span>
                        ) : (
                          <span>{checkNA(ipoDetail.POST_SHARECAP)}</span>
                        )}
                      </div>
                    </div>
                    <hr className={`${Styles.ipoHr}`} />
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <span className={`${Styles.ipoLabel}`}>IPO PDF</span>
                      </div>
                      <div className={`${Styles.ipoLabel}`}>
                        {checkNA(ipoDetail.ipo_pdf) != "N/A" ? (
                          <span>{ipoDetail.ipo_pdf}</span>
                        ) : (
                          <span>{checkNA(ipoDetail.ipo_pdf)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {sectionRef.section === "Objective" && (
                <div id="Objective" className={`${Styles.iposectionbox}`}>
                  <p className={`${Styles.sectionName}`}>Objective</p>
                  <div className={`ms-1 ${Styles.ipoOther}`}>
                    <div className="d-flex">
                      <span className={`${Styles.objTxt}`}>
                        {checkNA(ipoDetail.Objective) != "N/A" ? (
                          <span>{ipoDetail.Objective}</span>
                        ) : (
                          <span>{checkNA(ipoDetail.Objective)}</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}{" "}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IPOsection;
