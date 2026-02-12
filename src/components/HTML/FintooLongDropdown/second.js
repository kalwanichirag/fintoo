import React, { useState, useEffect } from "react";
import iciciLogo from "../../../Assets/Images/01_icici.png";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import FintooButton from "../FintooButton";
import uuid from "react-uuid";
import styles from "./style.module.css";

const FintooLongDropdownSecond = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState("");
  const handleChange = () => {
    if (Boolean(props.hideDropdown) == false) {
      setShowDropdown((v) => !v);
    }
  };
  const refLongDropdown = React.useRef(null);
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        refLongDropdown.current &&
        !refLongDropdown.current.contains(event.target)
      ) {
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

  useEffect(() => {
    if (props.defaultValue) {
      setSelected(props.defaultValue);
    }
  }, [props.defaultValue]);

  useEffect(() => {
    if (selected) {
        if (props.onChange) {
            props.onChange(selected);
        }
    }
  }, [selected]);

  var props_data = props.value.fund_list;


  return (
    <div className="px-md-4 noselect long-dropdown-main-box">
      <div className="">{props.label}</div>
      <div>
        <div className={`${styles.longDropdown}`}>
          <div className={`d-flex ${styles.longDropdownText}`}>
          <div><strong>{props.text}</strong></div>
            <strong>
              {selected
                ? props_data?.filter((v) => v?.scheme_code === selected)[0][
                    "scheme"
                  ]
                : "-"}
            </strong>
            <div
              className={props.hideDropdown == true ? "invisible" : ""}
              onClick={() => handleChange()}
            ></div>
          </div>

          {showDropdown && (
            <div ref={refLongDropdown} className={styles.longDropdownBox}>
              <div className="p-4">
                <input
                  placeholder="Search fund"
                  className={`w-100 ${styles.dFundInput}`}
                />
              </div>
              <hr className="mt-0" />
              <div className="p-1">
                <div className={styles.fixedHeightResults}>
                  {[...props_data].map((v) => (
                    <div className={`${styles.tblFnBx} py-4`} key={uuid()}>
                      <table className="w-100">
                        <tr>
                          <td className={`${styles.amcLogoBx}`}>
                            <img
                              alt="AMC logo"
                              width={"50px"}
                              src={iciciLogo}
                            />
                          </td>
                          <td colSpan={2}>
                            <div
                              className={styles.fnAmcName}
                              onClick={() => {
                                setSelected(v.scheme_code);
                              }}
                            >
                              <div className={`${styles.fnAmcName1}`}>
                                {v.scheme}
                              </div>
                              <div className={`d-flex ${styles.fnAmcName2}`}>
                                <div>Debt</div>
                                <div>Moderately High</div>
                                <div>{v.star_rating}</div>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>&nbsp;</td>
                          <td className="d-fl-details">
                            <div className="d-flex">
                              <div className="flex-grow-1">
                                <div>Folio No.</div>
                                <div>
                                  <strong>{v.folio_no}</strong>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <div>Units</div>
                                <div>
                                  <strong>{v.units}</strong>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <div>Value</div>
                                <div>
                                  <strong>₹{v.curr_val}</strong>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className={`${styles.fnAddFundBtn} td-btn-box`}>
                            <FintooButton
                              title="Add"
                              onClick={() => {
                                setSelected(v.scheme_code);
                                setShowDropdown(false);
                              }}
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

export default FintooLongDropdownSecond;
