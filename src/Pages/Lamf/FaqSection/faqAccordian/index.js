import { useState } from "react";
import FaqAccordianContent from "./FaqAccordionContent";
import { AiOutlinePlus } from "react-icons/ai";
import { BsDash  } from "react-icons/bs";
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
      <div className={style["accordian-item-container"]}>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]} `}
            onClick={() => updateAccordionIndex(0)}
            style={isActive(0) ? { color: "#042b62" } : { color: "black" }}
          >
            {" "}
            <span>
              What are the different types of mutual funds in India?
            </span>{" "}
            {isActive(0) ? <BsDash /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(0)}>
            <div>
              <p className="m-0">
                There are various types of mutual funds in India, including
                equity funds, debt funds, hybrid funds, money market funds, and
                index funds. Each type of fund has its own investment strategy
                and risk profile.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(2)}
            style={isActive(2) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>How do I invest in mutual funds in India?</span>{" "}
            {isActive(2) ? <BsDash /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(2)}>
            <div>
              <p className="m-0">
                You can invest in mutual funds in India through various
                channels, including online portals, mobile applications, or by
                visiting the offices of mutual fund companies or their
                authorized distributors. You can invest through lump-sum
                payments or a systematic investment plan (SIP).
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(3)}
            style={isActive(3) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>
              What is the minimum investment required for mutual funds in India?
            </span>{" "}
            {isActive(3) ? <BsDash /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(3)}>
            <div>
              <p className="m-0">
                The minimum investment amount required for mutual funds in India
                varies from fund to fund and can range from Rs. 100 to Rs. 5,000
                or more.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(4)}
            style={isActive(4) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>What is a Systematic Withdrawal Plan (SWP)?</span>{" "}
            {isActive(4) ? <BsDash /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(4)}>
            <div>
              <p className="m-0">
                A Systematic Withdrawal Plan (SWP) is a facility offered by
                mutual funds that allow investors to withdraw a fixed amount
                from their mutual fund investment at regular intervals while
                still keeping their investment in the fund.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(5)}
            style={isActive(5) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>Can non-residents invest in Indian mutual funds?</span>{" "}
            {isActive(5) ? <BsDash /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(5)}>
            <div>
              <p className="m-0">
                Yes, non-residents can invest in Indian mutual funds subject to
                certain conditions and regulatory requirements. Non-residents
                can invest in mutual funds through the portfolio investment
                scheme (PIS) route or through the foreign portfolio investment
                (FPI) route.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
      </div>
    </>
  );
}

export default FaqAccordian;
