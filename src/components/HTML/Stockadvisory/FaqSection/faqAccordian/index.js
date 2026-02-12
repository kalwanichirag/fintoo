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
              What is the difference between growth and value stocks?
            </span>{" "}
            {isActive(0) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(0)}>
            <div>
              <p>
                Growth stocks are stocks of companies that are expected to grow
                at a faster rate than the overall market. Value stocks are
                stocks of companies that are considered to be undervalued by the
                market and have the potential to generate higher returns in the
                future.
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
            <span>What is a blue-chip stock?</span>{" "}
            {isActive(1) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(1)}>
            <div>
              <p>
                A blue-chip stock is a stock of a company that is
                well-established, financially sound and has a reputation for
                stability and reliability. Blue-chip stocks are considered to be
                a safe and low-risk investment.
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
            <span>What is market capitalization?</span>{" "}
            {isActive(2) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(2)}>
            <div>
              <p>
                Market capitalization is the total value of all outstanding
                shares of a company. It is calculated by multiplying the number
                of outstanding shares by the current market price of the stock.
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
            <span>What is P/E ratio?</span>{" "}
            {isActive(3) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(3)}>
            <div>
              <p>
                The price-to-earnings (P/E) ratio measures the ratio of a
                company's stock price to its earnings per share (EPS). It is a
                valuation method that helps investors determine the relative
                value of a stock and whether it is overvalued or undervalued. To
                calculate the P/E ratio, you divide the current market price of
                a stock by its EPS. For example, if a stock is trading at Rs.
                100 and its EPS is Rs. 10, the P/E ratio would be 10.
                <br />A high P/E ratio may indicate that a stock is overvalued,
                while a low P/E ratio may suggest that a stock is undervalued.
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
            <span>Is the share market open on weekends?</span>{" "}
            {isActive(4) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(4)}>
            <div>
              <p>
                No, the Indian stock market is not open on Saturdays and
                Sundays. The Indian stock market operates on weekdays (Monday to
                Friday) from 9:15 AM to 3:30 PM, Indian Standard Time. However,
                the market may be closed on certain holidays or special
                occasions.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
      </div>
    </>
  );
}

export default FaqAccordian;
