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
            <span>What are the different types of bonds in India?</span>{" "}
            {isActive(0) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(0)}>
            <div>
              <p>
                There are various types of bonds in India, including government
                bonds, corporate bonds, municipal bonds, and convertible bonds.
                Each type of bond has its own characteristics and risk profile.
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
            <span>What is the coupon rate of a bond?</span>{" "}
            {isActive(1) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(1)}>
            <div>
              <p>
                The coupon rate of a bond is the interest rate paid by the bond
                issuer to the bondholder. The coupon rate is expressed as a
                percentage of the bond's face value.
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
              What is the difference between a primary market and a secondary
              market for bonds?
            </span>{" "}
            {isActive(2) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(2)}>
            <div>
              <p>
                The primary market is where bonds are first issued and sold by
                the issuer to investors. The secondary market is where
                previously issued bonds are bought and sold among investors.
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
            <span>
              What is the difference between a fixed-rate bond and a
              floating-rate bond?
            </span>{" "}
            {isActive(4) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(4)}>
            <div>
              <p>
                A fixed-rate bond has a fixed coupon rate that remains the same
                throughout the bond's life. A floating-rate bond has a coupon
                rate that is adjusted periodically based on a benchmark rate,
                such as the repo rate or the LIBOR rate.
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
            <span>What is a bond index?</span>{" "}
            {isActive(5) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(5)}>
            <div>
              <p>
                A bond index is a benchmark that tracks the performance of a
                specific group of bonds. Bond indices are used to measure the
                performance of the bond market and to compare the performance of
                individual bonds. Some popular bond indices in India include the
                CRISIL Composite Bond Fund Index and the NIFTY 10-Year Benchmark
                G-Sec Index.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
      </div>
    </>
  );
}

export default FaqAccordian;
