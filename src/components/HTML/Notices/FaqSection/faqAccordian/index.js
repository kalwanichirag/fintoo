import { useState } from "react";
import FaqAccordianContent from "./FaqAccordionContent";
import { AiOutlinePlus } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import style from "./style.module.css";

function FaqAccordian() {
  const [activeIndex, SetActiveIndex] = useState(0);

  const updateAccordionIndex = (idx) => {
    if (activeIndex === idx) {
      return SetActiveIndex(() => null);
    } else {
      return SetActiveIndex(() => idx);
    }
  };

  const isActive = (idx) => activeIndex === idx;

  return (
    <>
      <div >
        <div className="accordian-item">
          <div
            className={`${style["accordian-header"]} `}
            onClick={() => updateAccordionIndex(0)}
            style={isActive(0) ? { color: "#042b62" } : { color: "black" }}
          >
            {" "}
            <span>
              How can I save Income Tax?Why do taxpayers receive income tax
              notices?{" "}
            </span>{" "}
            {isActive(0) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(0)}>
            <div>
              <p>
                Taxpayers receive income tax notices for a variety of reasons,
                including discrepancies in their income tax return,
                non-disclosure of income, unreported assets or investments,
                non-payment or short payment of taxes, or any other
                non-compliance with tax laws.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className="accordian-item">
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(1)}
            style={isActive(1) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>How can taxpayers avoid receiving income tax notices? </span>{" "}
            {isActive(1) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(1)}>
            <div>
              <p>
                Taxpayers can avoid receiving income tax notices by filing
                accurate and complete income tax returns, disclosing all sources
                of income, paying taxes on time, and complying with all tax laws
                and regulations.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className="accordian-item">
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(3)}
            style={isActive(3) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>
              What are the consequences of ignoring an income tax notice?
            </span>{" "}
            {isActive(3) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(3)}>
            <div>
              <p>
                Ignoring an income tax notice can lead to penalties, fines, and
                legal action by the income tax department. It is important to
                respond to notices in a timely and appropriate manner to avoid
                any adverse consequences.
              </p>
            </div>
          </FaqAccordianContent>
        </div>

        <div className="accordian-item">
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(5)}
            style={isActive(5) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>Can a taxpayer request more time to respond to an income tax notice?</span>{" "}
            {isActive(5) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(5)}>
            <div>
              <p>
              Yes, a taxpayer can request additional time to respond to an income tax notice by submitting a written request to the income tax department. However, it is important to respond as soon as possible to avoid penalties or further legal action.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
      
      </div>
    </>
  );
}

export default FaqAccordian;
