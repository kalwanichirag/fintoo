import React, { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import Styles from "./Accordion.module.css";
import "./style.css";
import { toast } from "react-toastify";
import { apiCall,getUserId } from "../../common_utilities";
import { BASE_API_URL } from "../../constants";
import { faL } from "@fortawesome/free-solid-svg-icons";

export default function TriggerAccordion({ title, is_sub, onChange, children, ...props }) {
  const [show, setShow] = useState(false);
  const [subChangeicon, SetSubchangeicon] = useState(is_sub);
  const handleChange = (newValue) => {
    onChange(newValue);
  };
  return (
    <div>
      <div className={`${Styles.Accordian_Box}`}>
        <div className={`${Styles.acc_section} ${show ? "Accordion_acc_section_active" : ""}`}>
          <div className={`${Styles["title-container"]} Accordion_title-container`} onClick={() => {setShow(!show);SetSubchangeicon(is_sub)}}>
            <div className={Styles.section_title}>{title}</div>
            <div>
              <label style={{ cursor: "pointer" }} onClick={() => setShow(!show)}>
                {show ? <BsChevronUp /> : <BsChevronDown />}
              </label>
            </div>
          </div>
          <>
            {show && (
              <div className={`${Styles["acc-body"]} Accordion_acc-body`}>
                {subChangeicon ? (
                  <>
                    <div className={Styles["noti-icon"]}>
                      <img onClick={
                        async () => {
                          SetSubchangeicon(false);
                          handleChange(false);
                          toast.info("Unsubscribed",
                          {
                            position: toast.POSITION.BOTTOM_LEFT,
                            autoClose: 2000,
                          })
                          let url = BASE_API_URL + "managetrigger/";
                            let payload = {
                              "user_id":getUserId(),
                              "tag":'is_sub',
                              "data":[title,false]
                            }
                            apiCall(url, payload, false, false);
                        }
                      } 
                      src={process.env.REACT_APP_STATIC_URL + "media/DMF/noti.svg"}/>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={Styles["noti-icon"]}>
                      <img onClick={
                        async () => {
                          SetSubchangeicon(true);
                          handleChange(true);
                          toast.info("Subscribed",
                          {
                            position: toast.POSITION.BOTTOM_LEFT,
                            autoClose: 2000,
                          })
                          let url = BASE_API_URL + "managetrigger/";
                            let payload = {
                              "user_id":getUserId(),
                              "tag":'is_sub',
                              "data":[title,true]
                            }
                            apiCall(url, payload, false, false);
                        }
                      } 
                      src={process.env.REACT_APP_STATIC_URL + "media/DMF/noti1.png"}/>
                    </div>
                  </>
                )}
                {children}
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
