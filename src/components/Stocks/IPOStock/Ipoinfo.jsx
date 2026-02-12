import React, { useState } from 'react'
import Styles from "./style.module.css";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BiInfoCircle } from "react-icons/bi";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
function Ipoinfo() {
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
  const [showInfo, setShowInfo] = useState(true);
  return (
    <div>
         <div className={`${Styles.iposecBoxeslist}`}>
        <div id="Overview" className={`${Styles.iposectionbox}`}>
          <p className={`${Styles.sectionName}`}>Overview</p>
          <div className={`${Styles.iposectionDetails}`}>
            <div>
              <div className={`${Styles.ipolabel}`}>Face Value</div>
              <div className={`${Styles.ipoval}`}>₹ 10</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Biding Start Date</div>
              <div className={`${Styles.ipoval}`}>27 Jan 2023</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Biding End Date</div>
              <div className={`${Styles.ipoval}`}>31 Jan 2023</div>
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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aspernatur, similique.
                  </InfoMessage>
                </Info>
              </div>
              <div className={`${Styles.ipoval}`}>₹ 38-40</div>
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
                  A range of price within which you can place your bid.
                  </InfoMessage>
                </Info>
              </div>
              <div className={`${Styles.ipoval}`}>₹ 10</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Issue Size (Shares)</div>
              <div className={`${Styles.ipoval}`}>32,40,000</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Min. Invesment</div>
              <div className={`${Styles.ipoval}`}>₹ 1.20,000</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Max. Investment</div>
              <div className={`${Styles.ipoval}`}>₹ 5,00,000</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Retail Discount</div>
              <div className={`${Styles.ipoval}`}>N/A</div>
            </div>
          </div>
        </div>
        <div id="Subscription" className={`${Styles.iposectionbox}`}>
          <p className={`d-grid ${Styles.sectionName}`}>
            Subscription Rate
            <span>(As on Feb 04, 2023)</span>
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
                      color : "#b5b5b5"
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
                   Normal investors individual investor who apply upto Rs 2 Lakhs in an IPO.
                  </InfoMessage>
                </Info>
              </div>
              <div className={`${Styles.ipoLabel}`}>
                191.77<sub>x</sub>
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
                      color : "#b5b5b5"
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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aspernatur, similique.
                  </InfoMessage>
                </Info>
              </div>
              <div className={`${Styles.ipoLabel}`}>
                385.77<sub>x</sub>
              </div>
            </div>
            <hr className={`${Styles.ipoHr}`} />
            <div className="d-flex justify-content-between w-100">
              <div>
                <span className={`${Styles.ipoLabel}`}>
                  Qualified Institutional Investor
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
                      color : "#b5b5b5"
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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aspernatur, similique.
                  </InfoMessage>
                </Info>
              </div>
              <div className={`${Styles.ipoLabel}`}>
                39.83<sub>x</sub>
              </div>
            </div>
            <hr className={`${Styles.ipoHr}`} />
            <div className="d-flex justify-content-between w-100">
              <div>
                <span className={`${Styles.ipoLabel}`}>Employees</span>
              </div>
              <div className={`${Styles.ipoLabel}`}>N/A</div>
            </div>
          </div>
        </div>
        <div id="Financials" className={`${Styles.iposectionbox}`}>
          <p className={`${Styles.sectionName}`}>IPO Financials</p>
          <div className={`${Styles.ipoOther}`}>
            <div className="d-flex justify-content-between w-100">
              <div>
                <span className={`${Styles.ipoLabel}`}>
                  Pre Promoter Holding
                </span>
              </div>
              <div className={`${Styles.ipoLabel}`}>100%</div>
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
                      color : "#b5b5b5"
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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aspernatur, similique.
                  </InfoMessage>
                </Info>
              </div>
              <div className={`${Styles.ipoLabel}`}>
                385.77<sub>x</sub>
              </div>
            </div>
            <hr className={`${Styles.ipoHr}`} />
            <div className="d-flex justify-content-between w-100">
              <div>
                <span className={`${Styles.ipoLabel}`}>
                  Qualified Institutional Investor
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
                      color : "#b5b5b5"
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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aspernatur, similique.
                  </InfoMessage>
                </Info>
              </div>
              <div className={`${Styles.ipoLabel}`}>
                39.83<sub>x</sub>
              </div>
            </div>
            <hr className={`${Styles.ipoHr}`} />
            <div className="d-flex justify-content-between w-100">
              <div>
                <span className={`${Styles.ipoLabel}`}>Employees</span>
              </div>
              <div className={`${Styles.ipoLabel}`}>N/A</div>
            </div>
          </div>
        </div>
        <div id="Objective" className={`${Styles.iposectionbox}`}>
          <p className={`${Styles.sectionName}`}>Objective</p>
          <div className={`ms-1 ${Styles.ipoOther}`}>
            <div className="d-flex">
              <span><IoChevronBackCircleSharp className={`${Styles.Nexticon}`} /></span>
              <span className={`${Styles.objTxt}`}>
                Funding capital expenditure towards change in electricity supply
                voltage from 33 KV to 132 IN at our manufacturing facility at
                Village Duldula, Baloda Bazar (C.G)
              </span>
            </div>
          </div>
          <div className={`ms-1 mt-3 ${Styles.ipoOther}`}>
            <div className="d-md-flex align-items-center">
              <IoChevronBackCircleSharp className={`${Styles.Nexticon}`} />
              <span className={`${Styles.objTxt}`}>
                To meet Working Capital requirements.
              </span>
            </div>
          </div>
          <div className={`ms-1 mt-3 ${Styles.ipoOther}`}>
            <div className="d-md-flex align-items-center">
            <IoChevronBackCircleSharp className={`${Styles.Nexticon}`} />
              <span className={`${Styles.objTxt}`}>
                General Corporate Purpose.{" "}
              </span>
            </div>
          </div>
          <div className={`ms-1 mt-3 ${Styles.ipoOther}`}>
            <div className="d-md-flex align-items-center">
            <IoChevronBackCircleSharp className={`${Styles.Nexticon}`} />
              <span className={`${Styles.objTxt}`}>
                To meet issue expenses.{" "}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ipoinfo