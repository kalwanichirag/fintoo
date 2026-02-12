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
      <div>
        <div className="accordian-item">
          <div
            className={`${style["accordian-header"]} `}
            onClick={() => updateAccordionIndex(0)}
            style={isActive(0) ? { color: "#042b62" } : { color: "black" }}
          >
            {" "}
            <span>What are the benefits of having insurance?</span>{" "}
            {isActive(0) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(0)}>
            <div>
              <p>
                Insurance helps you manage risk and protect yourself against
                financial loss. It provides financial security and peace of
                mind, knowing that you are protected against unexpected events.
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
            <span>What should be my coverage amount?</span>{" "}
            {isActive(1) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(1)}>
            <div>
              <p>
                The amount of insurance coverage you need depends on various
                factors, such as your age, income, family size, lifestyle, and
                financial goals. It's recommended that you consult with a
                professional insurance advisor to determine your insurance
                needs.
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
            <span>Which kind of insurance do I need?</span>{" "}
            {isActive(2) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(2)}>
            <div>
              <p>
                The kind of insurance you need depends on your personal
                circumstances and the risks you face. For example, if you have
                dependents, you may need life insurance to provide financial
                support in case of your death. If you own a car, you may need
                auto insurance to cover damages or injuries resulting from an
                accident. It's recommended that you consult with a professional
                insurance advisor to determine your insurance needs.
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
              Is it a good idea to buy insurance online, or should I buy it from
              an expert?
            </span>{" "}
            {isActive(3) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(3)}>
            <div>
              <p>
                You can buy insurance online or through an expert. Buying online
                may be more convenient and cost-effective, but an expert can
                provide personalized advice and help you navigate the complex
                insurance landscape. It's recommended that you do your research
                and compare options before making a decision.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className="accordian-item">
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(4)}
            style={isActive(4) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>How can I choose the right insurance policy?</span>{" "}
            {isActive(4) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(4)}>
            <div>
              <p>
                You can choose the right insurance policy by considering your
                needs, budget, and coverage options. It's recommended that you
                compare multiple policies and read the fine print carefully
                before making a decision.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
      </div>
    </>
  );
}

export default FaqAccordian;
