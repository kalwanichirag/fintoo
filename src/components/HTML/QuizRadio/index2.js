import React, { useState } from "react";
import { Link } from "react-router-dom";
import FintooRadio2 from "../../FintooRadio2";
// import RadioCheck from "../../../Assets/Datagathering/RadioCheck.png";
// import RadioUncheck from "../../../Assets/Datagathering/RadioUncheck.png";
import RadioOn from "../../../components/FintooRadio2/radio-on-button.svg";
import RadioOff from "../../../components/FintooRadio2/radio-off-button.svg";

import { ADVISORY_GET_KNOW_YOUR_STATUS_API_URL, ADVISORY_KNOW_YOUR_RISK_ADD_API_URL, ADVISORY_KNOW_YOUR_RISK_UPDATE_API_URL, ADVISORY_USER_LOGIN_FLAG_UPDATE_API_URL } from "../../../constants";
const QuizRadio2 = (props) => {
  // const [checked, setChecked] = useState(props.selectedAnswer);
  const [active , setActive] = useState(false);
  const handleNext = () => {
    // call the handleResponse function with the selected option
    if(props.selectedAnswer >=0)
    {
      setActive(false);
    }
    if(props.selectedAnswer === null || props.selectedAnswer === "") {
      setActive(true);
    }
    props.handleResponse(props.selectedAnswer);
    // go to the next question
    // props.handleNext();
  };
  return (
    <div className="flow-form">
      <section className={`step done ${active  ? "step-uncheck" : ""}` } id="step-rf1">
        <span  className="step-no">{props.number}</span>
        <div className="step-body">
          <h2 className="step-title">{props.q}</h2>
          <div className="row ">
            <div className="col-md-8">
              <div className="material-radio risk-radio">
                <ul className="block">
                  {Boolean(props.options) &&
                    props.options.map((v, i) => (
                      <span key={i}>
                        <li
                          className="radio d-flex"
                          onClick={() => {
                            props.setSelectedAnswer(v.value);
                          }}
                        >
                          {props.selectedAnswer == v.value && (
                            <img
                              style={{
                                width: "20px",
                              }}
                              src={RadioOn}
                            />
                          )}

                          {props.selectedAnswer != v.value && (
                            <img
                              style={{
                                width: "20px",
                              }}
                              src={RadioOff}
                            />
                          )}

                          <label
                            htmlFor="b1-1"
                            className="radio-label ps-3 pointer"
                            onClick={() => {
                              props.setSelectedAnswer(v.value);
                            }}
                          >
                            {v.title}
                          </label>
                        </li>
                      </span>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <button
            type="submit"
            value="SAVE"
            className="default-btn gradient-btn"
            onClick={()=>handleNext()}
          >
            Submit
          </button>
        </div>
      </section>
    </div>
  );
};

export default QuizRadio2;
