import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ADVISORY_GET_EQUITY_DATA_API, imagePath } from "../../../../constants";
import {
  apiCall,
  fetchEncryptData,
  numberFormat,
  rsFilter,
} from "../../../../common_utilities";
function Currentequityinv(props) {
  const [tabCEI, setTabCEI] = useState("tab13");
  const [equitydata, setEquitydata] = useState([]);
  const [equityscreendata, setEquityscreendata] = useState("");
  const [notesdata, setNotesdata] = useState("");
  const session = props.session;
  useEffect(() => {
    getequitydata();
  }, []);

  const getequitydata = async () => {
    try {
      var payload = {
        method: "post",
        url: ADVISORY_GET_EQUITY_DATA_API,
        data: { fp_log_id: session["fp_log_id"], user_id: session["id"] },
      };
      let getequitydata = await fetchEncryptData(payload);
      if (getequitydata["error_code"] == "100") {
        setEquitydata(getequitydata["data"]["rpdata"]);

        setEquityscreendata(getequitydata["data"]["rpscreen_data"]);
        setNotesdata(getequitydata["data"]["notes_data"]);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
  if (!window.webengage) return;
  if (!equitydata || equitydata.length === 0) return;

  const xirr = equitydata[0]?.total_ror;

  if (xirr === undefined || xirr === null) return;

  window.webengage.user.setAttribute(
    "xirr",
    String(Math.round(xirr))
  );

}, [equitydata]);

  return (
    <div>
      {/* <ul
        className="nav nav-buttons nav-secoandary d-inline-flex"
        id="intro-appendix"
      >
        <li className={`tab-menu-item ${tabCEI == "tab13" ? "active" : ""}`}>
          <a href onClick={() => setTabCEI("tab13")}>
            Current Equity Investment
          </a>
        </li>
        <li className={`tab-menu-item ${tabCEI == "tab14" ? "active" : ""}`}>
          <a href onClick={() => setTabCEI("tab14")}>
            Current Equity Fund Flow
          </a>
        </li>
      </ul> */}
      <div className={tabCEI == "tab13" ? "d-block" : "d-none"}>
        <div>
          <div className="">
            {equitydata && equitydata.length > 0 ? (
              <div
                className="pageHolder currentEquityInvestments "
                style={{ marginTop: 15 }}
              >
                <h4 className="rTitle">
                  <img
                    className="title-icon"
                    src={imagePath + "/static/media/DG/reports/current-investments/current-equity-investment.svg"}
                  />
                  Your Current Equity Investment
                </h4>
                <div className="rContent ">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: equityscreendata ? equityscreendata : "",
                    }}
                  ></p>
                </div>
                {equitydata &&
                  equitydata.map((val) => (
                    <>
                      <div className="recomm-box ">
                        <span className="green cardBox ">
                          {val.member_id[0].fullname}
                        </span>
                        <div className="table-responsive rTable">
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
                              {val.member_id &&
                                val.member_id.map((item) => (
                                  <tr className="tabledata">
                                    <td className="">{item.asset_name}</td>
                                    <td className="">{item.category_name}</td>
                                    <td className="">
                                      {numberFormat(item.invested_value, 0)}
                                    </td>
                                    <td className="">
                                      {numberFormat(item.current_value, 0)}
                                    </td>
                                    {item.current_value - item.invested_value >=
                                      0 && (
                                      <td className=" ">
                                        {numberFormat(
                                          item.current_value -
                                            item.invested_value,
                                          0
                                        )}
                                      </td>
                                    )}
                                    {item.current_value - item.invested_value <
                                      0 && (
                                      <td
                                        style={{ color: "red" }}
                                        className=" "
                                      >
                                        (
                                        {numberFormat(
                                          Math.abs(
                                            item.current_value -
                                              item.invested_value
                                          ),
                                          0
                                        )}
                                        )
                                      </td>
                                    )}
                                    {item.asset_ror >= 0 && (
                                      <td className=" ">{item.asset_ror}</td>
                                    )}
                                    {item.asset_ror < 0 && (
                                      <td
                                        style={{ color: "red" }}
                                        className=" "
                                      >
                                        ({Math.abs(item.asset_ror)})
                                      </td>
                                    )}
                                  </tr>
                                ))}

                              <tr className="bold top-line total-value">
                                <td colSpan={2}>Total</td>
                                <td className="">
                                  {numberFormat(val.total_invested_value, 0)}
                                </td>
                                <td className="">
                                  {numberFormat(val.total_current_value, 0)}
                                </td>
                                {val.total_current_value -
                                  val.total_invested_value >=
                                  0 && (
                                  <td className=" ">
                                    {numberFormat(
                                      val.total_current_value -
                                        val.total_invested_value,
                                      0
                                    )}
                                  </td>
                                )}

                                {val.total_current_value -
                                  val.total_invested_value <
                                  0 && (
                                  <td style={{ color: "red" }} className=" ">
                                    (
                                    {numberFormat(
                                      Math.abs(
                                        val.total_current_value -
                                          val.total_invested_value
                                      ),
                                      0
                                    )}
                                    )
                                  </td>
                                )}

                                {val.total_ror >= 0 && (
                                  <td className=" ">
                                    {Math.abs(val.total_ror).toFixed(0)}
                                  </td>
                                )}
                                {val.total_ror < 0 && (
                                  <td style={{ color: "red" }} className=" ">
                                    ({Math.abs(val.total_ror).toFixed(0)})
                                  </td>
                                )}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ))}
                <div className="recomm-box">
                  <div
                    className="notes_sec_div"
                    style={{ border: "none !important", top: 35 }}
                  >
                    <div className="notes_head_div">
                      <i
                        style={{
                          backgroundSize: "100%",
                          width: 50,
                          height: 70,
                          display: "block",
                          position: "absolute",
                          top: "-25px",
                          left: "-15px",
                        }}
                      />
                      <span>Notes</span>
                      <h3
                        className="mt-4"
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                        }}
                      >
                        XIRR : -
                      </h3>
                    </div>
                    <div className="notes_text_div mt-3">
                      <div className="notes_text_div ">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: notesdata ? notesdata : "",
                          }}
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-data-found text-center">
                <div className="container">
                  <div className="row justify-content-center align-items-center">
                    <div className="col-md-10">
                      <img
                        alt="Data not found"
                        src={imagePath + "/static/media/DG/data-not-found.svg"}
                      />

                      <p>
                        Since you missed to fill in the required information
                        which is needed here, we are not able to show you this
                        section. Kindly click on below button to provide all the
                        necessary inputs. Providing all the information as asked
                        will ensure more accurate financial planning report.
                        Once you fill in the data, same will be reflected here.
                      </p>
                      <a
                        href="/web/datagathering/assets-liabilities"
                        target="_blank"
                        className="link"
                      >
                        Complete asset
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="row py-2">
              <div className=" text-center">
                <div>
                  <div className="btn-container">
                    <div className="d-flex justify-content-center">
                      <div
                        className="previous-btn form-arrow d-flex align-items-center"
                        onClick={() => props.settab("tab7")}
                      >
                        <FaArrowLeft />
                        <span className="hover-text">&nbsp;Previous</span>
                      </div>
                      <div
                        className="next-btn form-arrow d-flex align-items-center"
                        onClick={() => props.settab("tab9")}
                      >
                        <span className="hover-text" style={{ maxWidth: 100 }}>
                          Next&nbsp;
                        </span>
                        <FaArrowRight />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Currentequityinv;
