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
            <span>How can I apply for an IPO in India?</span>{" "}
            {isActive(0) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(0)}>
            <div>
              <p>
                You can apply for an IPO in India through various channels,
                including online portals of banks and brokerages or through the
                physical application forms available with the intermediaries.
                You will need to have a Demat account and a bank account to
                apply for an IPO.
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
            <span>What is an IPO price band?</span>{" "}
            {isActive(1) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(1)}>
            <div>
              <p>
                The IPO Price Band refers to the range of prices within which
                investors are able to bid for shares, with the lowest price
                being the floor price and the highest price being the cap price.
              </p>
              <p>
                If the company decides to make changes to the price band, the
                offer period is extended by at least three additional working
                days. These changes are communicated to the stock exchanges and
                the public through a press release as well as on the website.
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
            <span>What is a Green Shoe Option in an IPO?</span>{" "}
            {isActive(3) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(3)}>
            <div>
              <p>
                A Green Shoe Option is an option granted to the underwriters of
                an IPO, allowing them to sell additional shares to the public if
                the demand for the shares exceeds the initial offering. This
                option can help stabilize the price of the shares and ensure a
                successful offering.
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
            <span>What is the difference between a fixed-price and a book-building IPO?</span>{" "}
            {isActive(5) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(5)}>
            <div>
              <p>
              In a fixed-price IPO, the price at which the shares will be offered to the public is pre-determined and fixed by the company. In a book-building IPO, the price is determined through a bidding process in which investors can bid for shares at various prices within a price range specified by the company.
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
            <span>What are the benefits of investing in an IPO?</span>{" "}
            {isActive(6) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(6)}>
            <div>
              <p>
              Investing in an IPO can allow investors to participate in the growth and success of a promising company at an early stage. IPOs can also offer attractive returns and potential liquidity if the company performs well and the stock price increases.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
      </div>
    </>
  );
}

export default FaqAccordian;
