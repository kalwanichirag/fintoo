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
            <span>What is Investment Planning?</span>{" "}
            {isActive(0) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(0)}>
            <div>
              <p>
                Investment Planning is about developing a personalised strategy
                for investing money to achieve one or multiple financial goals.
                Investment Planning includes setting goals, identifying your
                risk profile, and identifying ideal investment assets that will
                help you achieve your goals.
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
            <span>What is the importance of Investment Planning?</span>{" "}
            {isActive(1) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(1)}>
            <div>
              <p>
                Investment Planning is extremely important for everyone who
                wishes to grow their wealth and achieve long-term financial
                goals like buying a home, getting married, buying a car, going
                on vacation, or even retirement planning. Investment Planning
                helps you make the right investments that will give you enough
                returns that will help you achieve your goals at your desired
                time. Moreover, it also helps you prepare for any unexpected
                expenses in the future by creating an emergency fund.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className="accordian-item">
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(2)}
            style={isActive(2) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>
              What factors should I consider when creating an investment plan?
            </span>{" "}
            {isActive(2) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(2)}>
            <div>
              <p>
                While creating your investment plan, you must also consider your
                goals, current financial standing, income, expenses,
                investments, debts, risk-taking capacity, investment horizon,
                and preferences for your investment options.
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
              How can I monitor and adjust my investment plan over time?
            </span>{" "}
            {isActive(3) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(3)}>
            <div>
              <p>
                Portfolio rebalancing is an extremely important aspect of
                Investment Planning and regularly restructuring or rebalancing
                your portfolio to stay on track to achieve your goals requires
                monitoring the performance of your investments. You can either
                review your portfolio at regular intervals like once every six
                months or after any major changes in your life that may affect
                your financial standing.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
      </div>
    </>
  );
}

export default FaqAccordian;
