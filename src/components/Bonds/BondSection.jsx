import React, { useEffect, useState, useRef } from "react";
import Styles from "../Stocks/IPOStock/style.module.css";
import BondsCss from "./Bonds.module.css";
import Ipoinfo from "../Stocks/IPOStock/Ipoinfo";
import styled from "styled-components";
import { FaShareAlt, FaRegBookmark } from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import AddToWish from "../AddToWish";
import { BiInfoCircle } from "react-icons/bi";
import FintooShareBox from "../HTML/FintooShareBox/FintooShareBox";
import { MdClose } from "react-icons/md";
function BondSection({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Highlights");
  const activeClassName = useRef("");
  const [style, setStyle] = useState("cont");
  const [isInWishlist, setIsInWishlist] = useState(null);
  const [scroll, setScroll] = useState(false);
  const containerRef = useRef(null);
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
  };
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
    { id: 1, section: "Highlights" },
    { id: 2, section: "Key_Metrics" },
    { id: 3, section: "Comparison" },
  ];
  const scrollToSection = (sectionName) => {
    const section = document
      .getElementById(sectionName)
      .getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + section.top - 290,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const handleScroll = () => {
      const comparisonSection = document.getElementById("Comparison");
      const keyMetricsSection = document.getElementById("Key_Metrics");
      const highlightsSection = document.getElementById("Highlights");

      if (window.scrollY > comparisonSection.getBoundingClientRect().top - 290) {
        setActiveTab('Comparison');
      } else if (window.scrollY > keyMetricsSection.getBoundingClientRect().top - 180) {
        setActiveTab('Key_Metrics');
      } else if (window.scrollY > highlightsSection.getBoundingClientRect().top - 50) {
        setActiveTab('Highlights');
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
        className={scroll ? `${Styles.ScrollIpoHead}` : null}
      >
        <div className=" d-flex justify-content-between align-items-start">
          <div className={`${Styles.ipoNameOptions}`}>
            <span className={`m-0 p-0 ${Styles.iponame} ${BondsCss.bondName}`}>
              Andhra Pradesh Region Development Authority
            </span>
          </div>
          <div
            className={
              scroll
                ? "d-none"
                : "d-md-flex justify-content-around align-items-md-center mt-md-3 pt-md-0 pt-0"
            }
          >
            <div className={`d-flex ms-md-0 ms-4  ${Styles.iposhareoptions}`}>
              <span>
                {isOpen ? (
                  <>
                    <MdClose
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
            style={{
              zIndex : '999'
            }}
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
              className={`text-decoration-none tabList ${Styles.tab} ${activeTab === sectionRefs[val].section
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
        <div className={`${BondsCss.BondsBoxeslist}`}>
          {sectionRefs.map((sectionRef) => (
            <div
              key={sectionRef.id}
              id={sectionRef.section}
              className={`${Styles.iposectionbox}`}
            >
              {sectionRef.section === "Highlights" && (
                <div id="Highlights">
                  <p className={`${BondsCss.sectionName}`}>Highlights</p>
                  <div className={`${BondsCss.BondssectionDetails}`}>
                    <div>
                      <div className={`${Styles.ipolabel}`}>Open Price</div>
                      <div className={`${BondsCss.Bondval}`}>₹ 10,14,960</div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>Close Price</div>
                      <div className={`${BondsCss.Bondval}`}>₹ 10,14,960</div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>High Price</div>
                      <div className={`${BondsCss.Bondval}`}>₹ 10,14,960</div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>Low Price</div>
                      <div className={`${BondsCss.Bondval}`}>₹ 10,14,960</div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>ISIN</div>
                      <div className={`${BondsCss.Bondval}`}>INE0M2307131</div>
                    </div>
                  </div>
                  <div className={`mt-4 ${BondsCss.Bonddesc}`}>
                    <div className={`${BondsCss.Bondlabel}`}>Description</div>
                    <div className={`${BondsCss.Bondinfo}`}>
                      8.74% Secured Rated Listed Redeemable Non Convertible Bond Series
                      li 2022-23, Sub Series C Date of Maturity 28/11/2025{" "}
                    </div>
                  </div>
                </div>
              )}
              {sectionRef.section === "Key_Metrics" && (
                <div id="keymetrics">
                  <p className={`${BondsCss.sectionName}`}>Key Metrics</p>
                  <div className={`${BondsCss.BondskeysectionDetails}`}>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                        <div className="d-flex align-items-center">
                          <div>
                            <img width={30} src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/01_face_value.svg"
                            } alt="Face Value" />
                          </div>
                          <div className="ps-1">
                            Face Value <sup style={{ cursor: "pointer", marginLeft: "3px" }}>
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
                          </div>
                        </div>
                      </div>
                      <div className={`${BondsCss.Bondval}`}>₹ 10,00,000</div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                        <div className="d-flex align-items-center">
                          <div>
                            <img width={25} src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/02_coupon_rate.svg"
                            } alt="Face Value" />
                          </div>
                          <div className="ps-1">
                            Coupon Rate
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
                          </div>
                        </div>
                      </div>
                      <div className={`${BondsCss.Bondval}`}>8.40%
                      </div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                        <div className="d-flex align-items-center">
                          <div>
                            <img width={25} src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/03_yield.svg"
                            } alt="Face Value" />
                          </div>
                          <div className="ps-1">
                            Yield(YTM)
                          </div>
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
                        </div>
                      </div>
                      <div className={`${BondsCss.Bondval}`}>8.05%</div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                        <div className="d-flex align-items-center">
                          <div>
                            <img width={25} src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/04_maturity_date.svg"
                            } alt="Face Value" />
                          </div>
                          <div className="ps-1">
                            Maturity Date
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
                          </div>
                        </div>
                      </div>
                      <div className={`${BondsCss.Bondval}`}>
                        31<sup>st</sup> July 2028{" "}
                      </div>
                    </div>
                  </div>
                  <hr className={` ${BondsCss.hrline}`} />
                  <div className={` ${BondsCss.BondskeysectionDetails}`}>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                        <div className="d-flex align-items-center">
                          <div>
                            <img width={25} src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/05_payment_terms.svg"
                            } alt="Face Value" />
                          </div>
                          <div className="ps-1">
                            Payment Term   <sup style={{ cursor: "pointer", marginLeft: "3px" }}>
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
                            </Info></div>
                        </div>
                      </div>
                      <div className={`${BondsCss.Bondval}`}>Quaterly</div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                        <div className="d-flex align-items-center">
                          <div>
                            <img width={25} src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/06_remaining_period.svg"
                            } alt="Face Value" />
                          </div>
                          <div className="ps-1">
                            Remaining Period</div>
                        </div>
                      </div>
                      <div className={`${BondsCss.Bondval}`}>5y 4m 29d</div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                        <div className="d-flex align-items-center">
                          <div>
                            <img width={25} src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/07_issue_date.svg"
                            } alt="Face Value" />
                          </div>
                          <div className="ps-1">
                            Issue Date</div>
                        </div>
                      </div>
                      <div className={`${BondsCss.Bondval}`}>
                        31<sup>st</sup> July 2018
                      </div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                      <div className="d-flex align-items-center">
                          <div>
                            <img width={25} src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/08_trade_date.svg"
                            } alt="Face Value" />
                          </div>
                          <div className="ps-1">
                        Traded Date</div>
                        </div>
                        </div>
                      <div className={`${BondsCss.Bondval}`}>
                        23<sup>th</sup> February 2023{" "}
                      </div>
                    </div>
                  </div>
                  <hr className={` ${BondsCss.hrline}`} />
                  <div className={` ${BondsCss.BondskeysectionDetails}`}>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                      <div className="d-flex align-items-center">
                          <div>
                            <img width={25} src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/06_remaining_period.svg"
                            } alt="Face Value" />
                          </div>
                          <div className="ps-1">
                        Credit Rating   <sup style={{ cursor: "pointer", marginLeft: "3px" }}>
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
                        </Info></div>
                        </div>
                        </div>
                      <div className={`${BondsCss.Bondval}`}>AAA</div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                      <div className="d-flex align-items-center">
                          <div>
                            <img width={25} src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/10_security.svg"
                            } alt="Face Value" />
                          </div>
                          <div className="ps-1">
                        Security</div>
                        </div>
                        </div>
                      <div className={`${BondsCss.Bondval}`}>Secured</div>
                    </div>
                    <div>
                      <div className={`${Styles.ipolabel}`}>
                      <div className="d-flex align-items-center">
                          <div>
                            <img width={25} src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/011_next_interest_payment_date.svg"
                            } alt="Face Value" />
                          </div>
                          <div className="ps-1">
                        Next Interset Payment Date
                      </div>
                      </div>
                      </div>
                      <div className={`${BondsCss.Bondval}`}>8.05%</div>
                    </div>
                    <div></div>
                  </div>
                  <br />
                </div>
              )}
              {sectionRef.section === "Comparison" && (
                <div id="Comparison">
                  <p className={`${BondsCss.sectionName}`}>Compare With Other Bond</p>
                  <div className={`${BondsCss.CompareTable}`}>
                    <table>
                      <thead className={`${BondsCss.CompareThead}`}>
                        <tr>
                          <th>Bond Name</th>
                          <th>Face Value</th>
                          <th>Coupon Rate</th>
                          <th>Credit Rating</th>
                          <th>Maturity Date</th>
                          <th>Payment Freq</th>
                        </tr>
                      </thead>
                      <tbody className={`${BondsCss.bondTableData}`}>
                        <tr>
                          <td className={`${BondsCss.bondTableName}`}>Bajaj Finanace Ltd.</td>
                          <td>₹ 10,00,000</td>
                          <td>7.5%</td>
                          <td>AA+</td>
                          <td>06/09/2026</td>
                          <td>Semi-Annually</td>
                        </tr>
                        <tr>
                          <td className={`${BondsCss.bondTableName}`}>Bajaj Finanace Ltd.</td>
                          <td>₹ 10,00,000</td>
                          <td>7.5%</td>
                          <td>AA+</td>
                          <td>06/09/2026</td>
                          <td>Semi-Annually</td>
                        </tr>
                        <tr>
                          <td className={`${BondsCss.bondTableName}`}>Bajaj Finanace Ltd.</td>
                          <td>₹ 10,00,000</td>
                          <td>7.5%</td>
                          <td>AA+</td>
                          <td>06/09/2026</td>
                          <td>Semi-Annually</td>
                        </tr>
                        <tr>
                          <td className={`${BondsCss.bondTableName}`}>Bajaj Finanace Ltd.</td>
                          <td>₹ 10,00,000</td>
                          <td>7.5%</td>
                          <td>AA+</td>
                          <td>06/09/2026</td>
                          <td>Semi-Annually</td>
                        </tr>
                        <tr>
                          <td className={`${BondsCss.bondTableName}`}>Bajaj Finanace Ltd.</td>
                          <td>₹ 10,00,000</td>
                          <td>7.5%</td>
                          <td>AA+</td>
                          <td>06/09/2026</td>
                          <td>Semi-Annually</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BondSection;
