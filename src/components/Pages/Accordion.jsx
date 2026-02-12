import React, { useState } from "react";
import MultiLineChart from "./Graph/MultiLineChart";
import BarGraph from "./Graph/BarGraph";
import PieGraph from "./Graph/PieGraph";
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import axios from "axios";
import { DMF_BASE_URL } from "../../constants";
import commonEncode from "../../commonEncode";
import { IoCompassOutline } from "react-icons/io5";
import { formatPrice, indianRupeeFormat } from "../../common_utilities";
import EmptyPara from "../HTML/EmptyPara";
import MobilePieGraph from "./Graph/MobilePieGraph";
import moment from "moment";

export default function Accordion(props) {
  const [show, setShow] = useState(true);
  const [show1, setShow1] = useState(true);
  const [show2, setShow2] = useState(true);
  const [show3, setShow3] = useState(true);
  const [show4, setShow4] = useState(true);
  const [show5, setShow5] = useState(true);
  const [show6, setShow6] = useState(true);
  const [show5funds, setShow5Funds] = useState(true);
  const [productDetail, setProductDetail] = useState([]);
  const [productDetail2, setProductDetail2] = useState([]);
  const [productDetail3, setProductDetail3] = useState([]);

  function getColNumberForCompareMF(data) {
    const colNum = data.reduce((acc, v) => {


      if (v.sector_allocation) {
        return acc + 1
      };
      return acc
    }, 0)
    return colNum;
  }

  return (
    <div className="Accordian_Box">
      <div className="NavTrend acc-section">
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setShow(!show)}
        >
          <h5 className="section-title">Nav Trend</h5>
          <div>
            <label style={{ cursor: "pointer" }} onClick={() => setShow(!show)}>
              {show ? <BiMinusCircle /> : <BiPlusCircle />}
            </label>
          </div>
        </div>
        <hr />
        {show ? <MultiLineChart productDetail={props.productDetail} /> : <></>}
      </div>

      <div className="Performannce_Histoty acc-section">
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setShow1(!show1)}
        >
          <h5 className="section-title">Performance History</h5>
          <div>
            <label
              style={{ cursor: "pointer" }}
              onClick={() => setShow1(!show1)}
            >
              {show1 ? <BiMinusCircle /> : <BiPlusCircle />}
            </label>
          </div>
        </div>
        <hr />
        {show1 ? <BarGraph productDetail={props.productDetail} /> : <></>}
      </div>

      <div className="FundssDetails acc-section">
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setShow2(!show2)}
        >
          <h5 className="section-title">Funds Details</h5>
          <div>
            <label
              style={{ cursor: "pointer" }}
              onClick={() => setShow2(!show2)}
            >
              {show2 ? <BiMinusCircle /> : <BiPlusCircle />}
            </label>
          </div>
        </div>
        {show2 == false && <hr />}
        {show2 ? (
          <div className="acc-section-bx">
            <div className=" TopSectors">
              <div className="fund-detail-grid">
                <div className="First_Div cmp-box">
                  <h6>Fund House</h6>
                </div>
                <div className="fund-detail-1">
                  {//console.log("props.productDetail", props.productDetail)
                  }
                  {props.productDetail?.map((item, index) => {
                    return (
                      <div key={index + 1} className="First_Div">
                        {typeof item != "string" && (
                          <p>{item.Overview?.amc_name  ?? "--"}</p>
                        )}
                        {typeof item == "string" && <EmptyPara />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Launch Date</h6>
                </div>
                <div className="fund-detail-1">
                  <div>
                    {props.productDetail.map((item, index) => (
                      <div key={index + 1} className="First_Div">
                        {typeof item != "string" && (
                          <p>
                            {moment(item?.Overview?.scheme_inception_date).format(
                              "DD MMM YYYY"
                            )}
                          </p>
                        )}
                        {typeof item == "string" && <EmptyPara />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Riskometer</h6>
                </div>
                <div className="fund-detail-1">
                  <div>
                    {props.productDetail.map((item, index) => (
                      <div key={index + 1} className="First_Div">
                        {typeof item != "string" && <p>{item?.Overview?.scheme_risk_value}</p>}
                        {typeof item == "string" && <EmptyPara />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Turnover</h6>
                </div>
                <div className="fund-detail-1">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1} className="First_Div">
                      {typeof item != "string" && (
                        <p>
                          {item?.Overview?.scheme_turnover == ""
                            ? "—"
                            : (item?.Overview?.scheme_turnover * 1).toFixed(2) +
                            " %"}{" "}
                        </p>
                      )}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Lock-in Period</h6>
                </div>
                <div className="fund-detail-1">
                  <div>
                    {props.productDetail.map((item, index) => (
                      <div key={index + 1} className="First_Div">
                        {typeof item != "string" && (
                          <p>{item?.Overview?.scheme_lock_period}</p>
                        )}
                        {typeof item == "string" && <EmptyPara />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Scheme Benchmark</h6>
                </div>
                <div className="fund-detail-1">
                  <div>
                    {[0, 1, 2].map((idx) => {
                      const item = props.productDetail?.[idx];
                      const hasBenchmark = item?.fund_detail?.scheme_benchmark;

                      return (
                        <div key={idx} className="First_Div">
                          <p
                            className={
                              !item
                                ? "text-center"
                                : "leftValue"
                            }
                          >
                            {!item
                              ? "-"
                              : hasBenchmark || "-"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Expense Ratio</h6>
                </div>
                <div className="fund-detail-1">
                  <div>
                    {props.productDetail.map((item, index) => (
                      <div key={index + 1} className="First_Div">
                        {/* <p>{item.Overview.expratio}% (As on {item.Overview.expratio_date})</p> */}
                        {typeof item != "string" && (
                          <p>{`${item?.Overview?.exp_ratio}% (As on ${moment(
                            item?.Overview?.exp_ratio_date
                          ).format("DD-MM-YYYY")})`}</p>
                        )}
                        {typeof item == "string" && <EmptyPara />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Corpus</h6>
                </div>
                <div className="fund-detail-1">
                  <div>
                    {props.productDetail?.map((item, index) => (
                      <div key={index + 1} className="First_Div">
                        {typeof item != "string" && (
                          <p>
                            {item?.Overview?.aum_total != null ? formatPrice(item?.Overview?.aum_total) : "-"}{" "}
                            <span>
                              (As on{" "}
                              {moment(item?.Overview?.aum_date).format(
                                "DD-MM-YYYY"
                              )}
                              )
                            </span>
                          </p>
                        )}
                        {typeof item == "string" && <EmptyPara />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Min. Lumpsum Investment</h6>
                </div>
                <div className="fund-detail-1">
                  <div>
                    {props.productDetail.map((item, index) => (
                      <div key={index + 1} className="First_Div">
                        {typeof item != "string" && (
                          <p>
                            {indianRupeeFormat(
                              item?.fund_detail?.lumpsum_minimum_investment * 1,
                              0
                            )}
                          </p>
                        )}
                        {typeof item == "string" && <EmptyPara />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Min. SIP Investment</h6>
                </div>
                <div className="fund-detail-1">
                  <div>
                    {props.productDetail.map((item, index) => (
                      <div key={index + 1} className="First_Div">
                        {typeof item != "string" &&
                          item?.fund_detail?.sip_minimum_investment != null && (
                            <p>
                              {indianRupeeFormat(
                                item?.fund_detail?.sip_minimum_investment * 1,
                                0
                              )}
                            </p>
                          )}
                        {typeof item != "string" &&
                          item?.fund_detail?.sip_minimum_investment == null && (
                            <p>-</p>
                          )}
                        {typeof item == "string" && <EmptyPara />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Scheme Type</h6>
                </div>
                <div className="fund-detail-1">
                  <div>
                    {props.productDetail.map((item, index) => (
                      <div key={index + 1} className="First_Div">
                        {typeof item != "string" && (
                          <p>{item?.Overview?.scheme_type_code}</p>
                        )}
                        {typeof item == "string" && <EmptyPara />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Scheme Category</h6>
                </div>
                <div className="fund-detail-1">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1} className="First_Div">
                      {typeof item != "string" && (
                        <p>{item?.Overview?.fintoo_category_name}</p>
                      )}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Fund Class</h6>
                </div>
                <div className="fund-detail-1">
                  {props.productDetail.map((item) => (
                    <div className="First_Div">
                      {typeof item != 'string' && <p>{item.Overview.fintoo_category}</p>}
                      {typeof item == 'string' && <EmptyPara />}
                    </div>))}
                </div>
              </div> */}

              <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Register Name</h6>
                </div>
                <div className="fund-detail-1">
                  <div>
                    {props.productDetail.map((item, index) => (
                      <div key={index + 1} className="First_Div">
                        {typeof item != "string" && (
                          <p>{item?.others?.[0]?.rta_name}</p>
                        )}
                        {typeof item == "string" && <EmptyPara />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fund-detail-grid">
                <div className="cmp-box">
                  <h6>Fund Manager</h6>
                </div>
                <div className="fund-detail-1">
                  <div>
                    {props.productDetail.map((item, index) => (
                      <div key={index + 1} className="First_Div">
                        {typeof item != "string" && (
                          <p>{item?.others?.[0]?.managers}</p>
                        )}
                        {typeof item == "string" && <EmptyPara />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="Mobile_Fund MobileTopSectors">
              <div className="fundSub">
                <div className="FundType">
                  <p>Fund House</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => {
                    return (
                      <div key={index + 1}>
                        {typeof item != "string" && (
                          <p>{item?.Overview?.amc_name  ?? "--"}</p>
                        )}
                        {typeof item == "string" && <EmptyPara />}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p>Launch Date</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" && (
                        <p>{item?.Overview?.scheme_inception_date}</p>
                      )}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p>Riskometer</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" && <p>{item?.Overview?.scheme_risk_value}</p>}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p>Turnover</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" && <p>{item?.Overview.scheme_turnover}</p>}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p>Lock-in Period</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" && (
                        <p>{item?.Overview?.scheme_lock_period}</p>
                      )}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p>Scheme Benchmark</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" && (
                        <p>{item?.fund_detail?.scheme_benchmark}</p>
                      )}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p>Expense Ratio</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" && (
                        <p>{`${item?.Overview?.exp_ratio}% (As on ${item?.Overview?.exp_ratio_date})`}</p>
                      )}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p>Corpus</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" && (
                        <p>
                          {item?.Overview?.aum_total != null ? formatPrice(item?.Overview?.aum_total) : "-"}{" "}
                          <span>(As on {item?.Overview?.aum_date})</span>
                        </p>
                      )}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p
                    style={{
                      width: "10rem",
                    }}
                  >
                    Min. Lumpsum Investment
                  </p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" && (
                        <p>
                          {indianRupeeFormat(
                            item?.fund_detail?.lumpsum_minimum_investment
                          )}
                        </p>
                      )}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p>Min. SIP Investment</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" &&
                        item?.fund_detail?.sip_minimum_investment != null && (
                          <p>
                            {indianRupeeFormat(
                              item?.fund_detail?.sip_minimum_investment
                            )}
                          </p>
                        )}
                      {typeof item != "string" &&
                        item?.fund_detail?.sip_minimum_investment == null && <p>-</p>}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p>Scheme Type</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" && (
                        <p>{item?.Overview?.scheme_type_code}</p>
                      )}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p>Scheme Category</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" && (
                        <p>{item?.Overview?.fintoo_category_name}</p>
                      )}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p>Fund Class</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" && (
                        <p>{item?.Overview?.fintoo_category_name}</p>
                      )}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p>Register Name</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" && <p>{item?.others?.[0]?.rta_name}</p>}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fundSub">
                <div className="FundType">
                  <p>Fund Manager</p>
                </div>
                <div className="FlexBoxFund">
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1}>
                      {typeof item != "string" && (
                        <div key={index + 2}>
                          {item?.others?.[0]?.managers.split("|").map((v) => (
                            <p>{v}</p>
                          ))}
                        </div>
                      )}
                      {typeof item == "string" && <EmptyPara />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="Asset_Allocation acc-section">
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <h5 className="section-title" onClick={() => setShow3(!show3)}>
            Asset Allocation
          </h5>
          <div>
            <label
              style={{ cursor: "pointer" }}
              onClick={() => setShow3(!show3)}
            >
              {show3 ? <BiMinusCircle /> : <BiPlusCircle />}
            </label>
          </div>
        </div>
        {show3 == false && <hr />}
        {show3 ? (
          <>
            <div className="acc-section-bx GraphAllocation d-none d-md-flex">
              <div className="DivGraph cmp-box w-12"></div>
              <div className="d-flex flex-grow-1 w-88">
                {props.productDetail
                  .filter((v) => typeof v != "string")
                  .map((v, index) => (
                    <div key={index + 1} className="borderGraph">
                      <PieGraph productDetail={v} />
                    </div>
                  ))}
                {props.productDetail
                  .filter((v) => typeof v == "string")
                  .map((v, index) => (
                    <div key={index + 1} className="borderGraph emptypara">
                      <p>-</p>
                    </div>
                  ))}
              </div>
            </div>
            <div className="acc-section-bx MobileGraphAllocation d-flex d-md-none">
              {props.productDetail
                .filter((v) => typeof v != "string")
                .map((v, index) => (
                  <div key={index + 1} className="borderGraph">
                    <MobilePieGraph productDetail={v} />
                  </div>
                ))}
              {props.productDetail
                .filter((v) => typeof v == "string")
                .map((v, index) => (
                  <div key={index + 1} className="borderGraph emptypara">
                    <p>-</p>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      {/* <div className="PortFolio acc-section">
        <div className="title-container" style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
          <h5 className="section-title" onClick={() => setShow4(!show4)}>Portfolio</h5>
          <div>
            <label
              style={{ cursor: "pointer" }}
              onClick={() => setShow4(!show4)}
            >
              {show4 ? <BiMinusCircle /> : <BiPlusCircle />}
            </label>
          </div>
        </div>
        {show4 == false && <hr />}
        {show4 ? (
          <div className="acc-section-bx">
            <div className="TopSectors d-none d-md-flex">
              <div className="Sector_Head cmp-box">
                <h6>Top 3 Sectors</h6>
              </div>
              <div className="flex-grow-1 d-flex">

                {props.productDetail.map((item) => (
                  <div className="w-33 justify-content-center Sector_List d-flex">
                    <div className="w-75">
                      <>

                        {typeof item == 'string' && <EmptyPara />}
                        {typeof item != 'string' && item.sector_allocation.filter((v, i) => show5funds ? ((i < 3) ? true : false) : true).map((v) => (
                          <div className="First_Div">
                            <p>{typeof v != 'string' ? (Boolean(v.sector_name) ? v.sector_name : "Others") : '-'} ({typeof v != 'string' ? v.sector_percentage : '-'}%)</p>
                          </div>
                        ))}

                      </>
                    </div>
                  </div>
                ))}


              </div>
            </div>
            <div className="MobileTopsectors d-block d-md-none">
              <div className="Sector_Head">
                <h6 style={{ textAlign: "center" }}>Top 3 Sectors</h6>
              </div>
              <br />
              <div className="Potfoliosector">
                <div className="portdetial">
                  <p>Financial (42.4%)</p>
                  <p>Technology (17.64%)</p>
                  <p>Energy (14.95%)</p>
                </div>
                <div>
                  <p>Financial (42.4%)</p>
                  <p>Technology (17.64%)</p>
                  <p>Energy (14.95%)</p>
                </div>
                <div>
                  <p>Financial (42.4%)</p>
                  <p>Technology (17.64%)</p>
                  <p>Energy (14.95%)</p>
                </div>
              </div>
            </div>
          </div>
        ) : <></>}
      </div> */}

      <div className="Sector_Allocation acc-section">
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <h5 className="section-title" onClick={() => setShow5(!show5)}>
            Sector Allocation
          </h5>
          <div>
            <label
              style={{ cursor: "pointer" }}
              onClick={() => setShow5(!show5)}
            >
              {show5 ? <BiMinusCircle /> : <BiPlusCircle />}
            </label>
          </div>
        </div>
        {show5 == false && <hr />}
        {show5 ? (
          <div className="acc-section-bx">
            <div className="Sector_Allocation_List TopSectors">
              <div className="empty-space w-12"></div>
              <div className="w-88 d-flex">
                {props.productDetail.map((item, index) => (
                  <div key={index + 1} className="sector-item-list">
                    <>
                      {typeof item == "string" && <EmptyPara />}
                      {typeof item != "string" &&
                        item?.sector_allocation?.filter((v, i) => i < 5)
                          .map((v) => (
                            <div className="sector-item ">
                              <div className="sector-item-title">
                                <div>
                                  {Boolean(v.sector_name)
                                    ? v.sector_name
                                    : "Others"}
                                </div>
                                <div>{v.sector_percentage}%</div>
                              </div>
                              <div className="sector-item-value">
                                <div className="range-outer">
                                  <div
                                    className="range-inner"
                                    style={{ width: v.sector_percentage + "%" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                    </>
                  </div>
                ))}
              </div>
            </div>
            <div className="Mobile_Sector_Allocation_List MobileTopsectors">
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${getColNumberForCompareMF(props.productDetail)}, 1fr)`, gap: '0.3rem' }}>
                {props.productDetail.map((item, i) => (
                  <div key={i + 1} className="AllocationFlex2" style={{ borderRight: props.productDetail[i + 1] ? '1px solid #d3d3d3' : 'none' }}>
                    <div>
                      <>
                        {typeof item != "string" &&
                          item?.sector_allocation?.filter((v, i) => i < 5)
                            .map((v) => (
                              <div >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', height: '40px' }} >
                                  <div >
                                    {Boolean(v.sector_name)
                                      ? v.sector_name
                                      : "Others"}
                                  </div>
                                  <div>{v.sector_percentage}%</div>
                                </div>
                                <br />
                              </div>
                            ))}
                      </>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="TopHoldings Sector_Allocation acc-section">
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <h5 className="section-title" onClick={() => setShow6(!show6)}>
            Top 5 Holdings
          </h5>
          <div>
            <label
              style={{ cursor: "pointer" }}
              onClick={() => setShow6(!show6)}
            >
              {show6 ? <BiMinusCircle /> : <BiPlusCircle />}
            </label>
          </div>
        </div>
        {show6 == false && <hr />}
        {show6 ? (
          <div className="acc-section-bx">
            {/* <div className="Holding_Details "> */}
            <div className="Sector_Allocation_List TopSectors">
              <div className="empty-space w-12"></div>
              <div className="w-88 d-flex">
                {props.productDetail.map((item, index) => (
                  <div key={index + 1} className="holding-item-list">
                    <table>
                      <tr>
                        <td>
                          <div className="holding-cl-1">Company Name</div>
                        </td>
                        <td>
                          <div className="holding-cl-2">Holding (%)</div>
                        </td>
                      </tr>

                      {typeof item == "string" && (
                        <tr>
                          <td colspan={2}>
                            <EmptyPara />
                          </td>
                        </tr>
                      )}
                      {typeof item != "string" &&
                        item?.top_holdings?.filter((v, i) => i < 5)
                          .map((v, index) => (
                            <tr key={index + 1} >
                              <td>
                                <div className="holding-data-1">
                                  {typeof v != "string" ? v.comp_name : "-"}
                                </div>
                              </td>
                              <td>
                                <div className="holding-data-2">
                                  {typeof v != "string" ? v.periodic_hold : "-"}
                                </div>
                              </td>
                            </tr>
                          ))}
                    </table>
                  </div>
                ))}
              </div>
            </div>
            <div className="mobileTopHoldings MobileTopSectors">
              <div
                style={{
                  display: "d-flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                {/* <div className="HoldingsFlex"> */}
                <div >
                  {props.productDetail.map((item, index) => (
                    <div key={index + 1} className="holding-item-list">
                      <table>
                        <tr>
                          <td>
                            <div className="holding-cl-1">Company Name</div>
                          </td>
                          <td>
                            <div className="holding-cl-2">Holding (%)</div>
                          </td>
                        </tr>

                        {typeof item == "string" && (
                          <tr>
                            <td colspan={2}>
                              <EmptyPara />
                            </td>
                          </tr>
                        )}
                        {typeof item != "string" &&
                          item?.top_holdings?.filter((v, i) => i < 5)
                            .map((v, index) => (
                              <tr key={index + 1}>
                                <td>
                                  <div className="holding-data-1">
                                    {typeof v != "string" ? v.comp_name : "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="holding-data-2">
                                    {typeof v != "string"
                                      ? v.periodic_hold
                                      : "-"}
                                  </div>
                                </td>
                              </tr>
                            ))}
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
