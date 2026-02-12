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
            <span>How can I save Income Tax?</span>{" "}
            {isActive(0) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(0)}>
            <div>
              <p>
                The income tax department has given several ways to claim
                exemptions and deductions under several sections like 80C, 80G,
                80D etc. To know more about tax savings in detail, please refer
                to our blog <a style={{
                  color : '#042b62',
                  fontWeight : "600"
                }} href=" https://www.fintoo.in/blog/why-millennial-should-opt-for-a-robo-advisory/"> https://www.fintoo.in/blog/why-millennial-should-opt-for-a-robo-advisory/</a>.
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
            <span>Do I need to change my existing tax planning strategy?</span>{" "}
          {isActive(1) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(1)}>
            <div>
              <p>
                Whether to change your existing tax planning strategy or not can
                only be decided after analysing your current strategy and
                exploring its potential to achieve your tax-saving goals. Along
                with our experts, you can also Re-Evaluate Your Tax Planning
                Strategy using the following details <a style={{
                  color : '#042b62',
                  fontWeight : "600"
                }} href="https://www.fintoo.in/blog/re-evaluate-your-tax-planning-strategies/">&nbsp;https://www.fintoo.in/blog/re-evaluate-your-tax-planning-strategies/</a>.
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
              Should the youngsters prefer assisted advisory or Robo Advisory
              for tax planning?
            </span>{" "}
            {isActive(3) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(3)}>
            <div>
              <p>
                It is recommended that young investors can use the Robo Advisory
                tool for tax planning because of the following reasons; <a style={{
                  color : '#042b62',
                  fontWeight : "600"
                }} href="https://www.fintoo.in/blog/why-millennial-should-opt-for-a-robo-advisory/">&nbsp;https://www.fintoo.in/blog/why-millennial-should-opt-for-a-robo-advisory/</a>.
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
            <span>How much can Section 80C help me in tax planning?</span>{" "}
            {isActive(5) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(5)}>
            <div>
              <p>
                Section 80C is one of the most common tax-saving tools and
                here’s everything you need to know about tax saving under
                section 80C <a style={{
                  color : '#042b62',
                  fontWeight : "600"
                }} href="https://www.fintoo.in/blog/why-millennial-should-opt-for-a-robo-advisory/">&nbsp;https://www.fintoo.in/blog/why-millennial-should-opt-for-a-robo-advisory/</a>.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className="accordian-item">
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(6)}
            style={isActive(6) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>Does tax planning mean tax avoidance or tax evasion?</span>{" "}
            {isActive(6) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(6)}>
            <div>
              <p>
                No, tax planning, tax avoidance and tax evasion are completely
                different and here are the details <a style={{
                  color : '#042b62',
                  fontWeight : "600"
                }} href="https://www.fintoo.in/blog/why-millennial-should-opt-for-a-robo-advisory/">&nbsp;https://www.fintoo.in/blog/why-millennial-should-opt-for-a-robo-advisory/</a>
              </p>
            </div>
          </FaqAccordianContent>
        </div>
      </div>
    </>
  );
}

export default FaqAccordian;
