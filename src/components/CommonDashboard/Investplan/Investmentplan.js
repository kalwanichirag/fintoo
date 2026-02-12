import React, { useState } from "react";
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import { IoCompassOutline } from "react-icons/io5";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import Styles from "./Investplan.style.module.css";
import MutualFund from "./Images/MUTUAL-FUND-db.svg";
import Bond from "./Images/BOND.svg";
import JsonData from "./JsonData.json";
import PMS from "./Images/PMS.svg";
import Modal from "react-responsive-modal";
import CommingSoon from "../../Assets/coming-soon.svg";
import { indianRupeeFormat } from "../../../common_utilities";
import PlanofAction from "../../../Pages/DMF/CommonDashboard/PlanofAction";
import Planofactionpopup from "../Planofactionpopup";
import { BASE_API_URL, imagePath } from "../../../constants";
import Addinvestment from "./Images/add-investment.svg";
import Execute from "./Images/Execute.svg";
import { Link } from "react-router-dom";
const Investmentplan = (props) => {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [mainCheck, setMaincheck] = useState(false);
  const [selected, setSelected] = useState([]);
  const [pvsum, setPvSum] = useState(0);
  const mutualfund = props.mutualfunddata && Object.keys(props.mutualfunddata);
  const DisplayData =
    mutualfund &&
    mutualfund.map((key) => {
      if (
        props.mutualfunddata[key].pmt_sum > 0 ||
        props.mutualfunddata[key].pv_sum
      ) {
        return (
          <tr>
            <td>
              <input
                type="checkbox"
                checked={selected.indexOf(props.mutualfunddata[key]) > -1}
                onChange={(e) => {
                  var a = selected;
                  if (a.indexOf(props.mutualfunddata[key]) > -1) {
                    a = a.filter((v) => v != props.mutualfunddata[key]);
                  } else {
                    a.push(props.mutualfunddata[key]);
                  }
                  setSelected([...a]);
                }}
              />
            </td>
            <td>{props.mutualfunddata[key].name}</td>
            <td>
              {props.mutualfunddata[key].pv_sum &&
                indianRupeeFormat(
                  props.mutualfunddata[key].pv_sum.toFixed(0) * 1,
                  0
                )}
            </td>
            <td>
              {props.mutualfunddata[key].pmt_sum &&
                indianRupeeFormat(
                  props.mutualfunddata[key].pmt_sum.toFixed(0) * 1,
                  0
                )}
            </td>
          </tr>
        );
      }
    });

  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  return (
    <div>
      <div className={`${Styles.AccordianBox}`}>
        {props.totalmfsum &&
          props.totalmfsum.total_pmtsum &&
          props.totalmfsum.total_pmtsum > 0 ? (
          <>
            <div className={`${Styles.accsection}`}>
              <div
                className={`${Styles.titlecontainer}`}
                onClick={() => {
                  setShow(!show);
                  setShow1(false);
                  setShow2(false);
                  setSelected([]);
                }}
              >
                <div className={`${Styles.sectiontitle} + default-grey`}>
                  <div className="d-md-block d-none">
                    <span>
                      <span>
                        <img src={imagePath + "/static/media/DMF/MUTUAL-FUND-db.svg"} className="me-5" alt="MUTUAL-FUND" />
                      </span>
                      Mutual Fund
                    </span>
                  </div>
                  <div className="d-md-none d-sm-block">
                    {show ? (
                      <>
                        <span className="d-grid text-center">
                          <span>
                            <img
                              // src={
                              //   process.env.REACT_APP_STATIC_URL +
                              //   "media/DMF/MUTUAL-FUND-db.svg"
                              // }
                              src={imagePath + "/static/media/DMF/MUTUAL-FUND-db.svg"}
                              alt="Mutual-Fund"
                            />
                          </span>
                          <span>Mutual Fund</span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          <span>
                            <img
                              src={imagePath + "/static/media/DMF/MUTUAL-FUND-db.svg"}
                              className="me-5"
                              alt="Mutual-Fund"
                            />
                          </span>
                          Mutual Fund
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    className={`${Styles.icons}`}
                    style={{ cursor: "pointer" }}
                  >
                    {show ? (
                      <div
                        onClick={onOpenModal}
                        className={`${Styles.InvestmentIcon}`}
                      >
                        <div>
                          <img
                            // src={
                            //   process.env.REACT_APP_STATIC_URL +
                            //   "media/DMF/add-investment.svg"
                            // }
                            src={imagePath + "/static/media/DMF/add-investment.svg"}
                            alt="Add Investment"
                          />
                        </div>
                        <div className={`${Styles.Textlabel} + custom-color`}>
                          Add Investment
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <Link
                    className="text-decoration-none"
                      to={
                        process.env.PUBLIC_URL +
                        "/direct-mutual-fund/funds/all"
                      }
                    >
                      <div
                        // onClick={onOpenModal}
                        style={{ display: selected.length ? "block" : "none" }}
                        className={`${Styles.InvestmentIcon}`}
                      >
                        <div>
                          <img
                            // src={
                            //   process.env.REACT_APP_STATIC_URL +
                            //   "media/DMF/Execute.svg"
                            // }
                            src={imagePath + "/static/media/DMF/Execute.svg"}
                            alt="Execute"
                          />
                        </div>
                        <div className={`${Styles.Textlabel} + custom-color`}>Execute</div>
                      </div>
                    </Link>
                    <div
                      onClick={() => {
                        setShow(!show);
                        setShow1(false);
                        setShow2(false);
                        setSelected([]);
                      }}
                    >
                      {show ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                    </div>
                  </label>
                </div>
              </div>
              <div
                style={{
                  borderBottom: "1px solid #f0f4f3",
                }}
              ></div>
              {show ? (
                <div
                  style={{
                    transition: "all .4s",
                    overflowX: "auto",
                  }}
                >
                  <table className={`${Styles.TableBox}`}>
                    <thead>
                      <tr>
                        <th>
                          <input
                            className={`${Styles.CheckBox}`}
                            type="checkbox"
                            checked={
                              mutualfund.length === selected.length
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                var a = mutualfund.map(
                                  (v) => props.mutualfunddata[v]
                                );
                                setSelected([...a]);
                              } else {
                                setSelected([]);
                              }
                            }}
                          />
                        </th>
                        <th>CATEGORY</th>
                        <th>LUMPSUM AMOUNT</th>
                        <th>SIP AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>{DisplayData}</tbody>
                    <tfoot>
                      <tr>
                        <th>Total</th>
                        <th></th>
                        <th>
                          {props.totalmfsum.total_pvsum &&
                            indianRupeeFormat(
                              props.totalmfsum.total_pvsum.toFixed(0) * 1,
                              0
                            )}
                        </th>
                        <th>
                          {props.totalmfsum.total_pmtsum &&
                            indianRupeeFormat(
                              props.totalmfsum.total_pmtsum.toFixed(0) * 1,
                              0
                            )}
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className={`${Styles.accsection}`}>
              <div
                className={`${Styles.titlecontainer}`}
                onClick={() => {
                  setShow1(!show1);
                  setShow(false);
                  setShow2(false);
                }}
              >
                <div className={`${Styles.sectiontitle}  + default-grey`}>
                  <span>
                    <span>
                      <img className="me-5" src={imagePath + "/static/media/DMF/BOND.svg"} alt="Bond" />
                    </span>
                    Bond
                  </span>
                </div>
                <div>
                  <label
                    className={`${Styles.icons}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShow1(!show1);
                      setShow(false);
                      setShow2(false);
                    }}
                  >
                    {show1 ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                  </label>
                </div>
              </div>
              <div
                style={{
                  borderBottom: "1px solid #f0f4f3",
                }}
              ></div>
              {show1 ? (
                <div className={`${Styles.AccordianCommingSoonImg}`}>
                  <img src={imagePath + "/static/media/DMF/coming-soon.svg"} alt="comming-soon" />
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className={`${Styles.accsection}`}>
              <div
                className={`${Styles.titlecontainer}`}
                onClick={() => {
                  setShow2(!show2);
                  setShow(false);
                  setShow1(false);
                }}
              >
                <div className={`${Styles.sectiontitle}  + default-grey`}>
                  <span>
                    <span>
                      <img src={imagePath + "/static/media/DMF/PMS.svg"} className="me-5" alt="PMS" />
                    </span>
                    PMS
                  </span>
                </div>
                <div>
                  <label
                    className={`${Styles.icons}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShow2(!show2);
                      setShow(false);
                      setShow1(false);
                    }}
                  >
                    {show2 ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                  </label>
                </div>
              </div>
              <div
                style={{
                  borderBottom: "1px solid #f0f4f3",
                }}
              ></div>
              {show2 ? (
                <div className={`${Styles.AccordianCommingSoonImg}`}>
                  <img src={imagePath + "/static/media/DMF/coming-soon.svg"} alt="comming-soon" />
                </div>
              ) : (
                <></>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
        {props.totalmfsum && props.totalmfsum.total_pmtsum <= 0 ? (
          <div className={`${Styles.InvestmentCompBox}`}>
            <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/insurance_done.png"} alt="Insurance Done" />
            <h1>Great!</h1>
            <p>
              “You’ve successfully achieved your goals. As it is self-evidently
              needless to provide you with recommendations from our end, for any
              given plan to invest you in a life insurance policy.”
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Modal
        className={`${Styles.modalPopup}`}
        open={open}
        showCloseIcon={false}
        onClose={onCloseModal}
        center
      >
        <Planofactionpopup onClose={onCloseModal} />
      </Modal>
    </div>
  );
};

export default Investmentplan;
