import React, { useState } from "react";
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import { IoCompassOutline } from "react-icons/io5";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import Styles from "./Insurance.style.module.css";
import {default as Lifeinsurance} from "./Images/LIFE-INSURANCE-COVER.svg";
import JsonData from "./JsonData.json";
import Modal from "react-responsive-modal";
import { indianRupeeFormat } from "../../../common_utilities";
import Planofactionpopup from "../Planofactionpopup";
import { BASE_API_URL } from "../../../constants";
import Addinvestment from './Images/add-investment.svg';
import Execute from './Images/Execute.svg';
const Insuranceplan = (props) => {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [mainCheck, setMaincheck] = useState(false);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const lifeins = props.lifeinsurance;
  
    const DisplayData = lifeins && lifeins.map((info, i) => {
      return (
        <tr>
          <td>
            <input
              type="checkbox"
              checked={selected.indexOf(info.id) > -1}
              onChange={(e) => {
                var a = selected;
                if (a.indexOf(info.id) > -1) {
                  a = a.filter((v) => v != info.id);
                } else {
                  a.push(info.id);
                }
                setSelected([...a]);
              }}
            />
          </td>
          <td>{info.name}</td>
          <td>
            {info.insurance &&
              indianRupeeFormat(Math.abs(info.insurance).toFixed(0) * 1, 0)}
          </td>
        </tr>
      );
    });
  

  return (
    <div>
      <div className={`${Styles.AccordianBox}`}>
        {lifeins && lifeins.length <= 0 ? (
          <div className={`${Styles.InsuranceCompBox}`}>
            <img
             src={process.env.REACT_APP_STATIC_URL + "media/DMF/insurance_done.png"}
              alt="Insurance Done"
            />
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
        {lifeins && lifeins.length > 0 ? (
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
              <div className={`${Styles.sectiontitle} default-grey`}>
                <div className="d-md-block d-none">
                  <span>
                    <span>
                      <img
                      src={process.env.REACT_APP_STATIC_URL + "/media/DMF/LIFE-INSURANCE-COVER.svg"}
                        className="me-5"
                      />{" "}
                    </span>
                    Life Insurance
                  </span>
                </div>
                <div className="d-md-none d-sm-block">
                  {show ? (
                    <>
                      <span className="d-grid text-center">
                        <span>
                          <img
                          src={process.env.REACT_APP_STATIC_URL + "/media/DMF/LIFE-INSURANCE-COVER.svg"}
                            className=""
                          />{" "}
                        </span>
                        <span>Life Insurance</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        <span>
                          <img
                          src={process.env.REACT_APP_STATIC_URL + "/media/DMF/LIFE-INSURANCE-COVER.svg"}
                            className="me-5"
                          />{" "}
                        </span>
                        Life Insurance
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
                         src={process.env.REACT_APP_STATIC_URL + "/media/DMF/add-investment.svg"}
                        />
                      </div>
                      <div className={`${Styles.Textlabel} + custom-color`}>
                        Add Investment
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}

                  <div
                    // onClick={onOpenModal}
                    style={{ display: selected.length ? "block" : "none" }}
                    className={`${Styles.InvestmentIcon}`}
                  >
                    <div>
                      <img
                      src={process.env.REACT_APP_STATIC_URL + "/media/DMF/Execute.svg"}
                      />
                    </div>
                    <div className={`${Styles.Textlabel} custom-color`}>Execute</div>
                  </div>

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
                            lifeins.length === selected.length ? true : false
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              var a = lifeins.map((v) => v.id);
                              setSelected([...a]);
                            } else {
                              setSelected([]);
                            }
                          }}
                        />
                      </th>
                      <th>CATEGORY</th>
                      <th>ADDITIONAL INSURANCE REQUIRED</th>
                    </tr>
                  </thead>
                  <tbody>{DisplayData}</tbody>
                  <tfoot>
                    <tr>
                      <th>Total</th>
                      <th></th>
                      <th>
                        {props.lifeinsurancerecomm &&
                          indianRupeeFormat(
                            Math.abs(props.lifeinsurancerecomm).toFixed(0) * 1,
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
        <Planofactionpopup onClose={onCloseModal} lifeins={lifeins} />
      </Modal>
    </div>
  );
};

export default Insuranceplan;
