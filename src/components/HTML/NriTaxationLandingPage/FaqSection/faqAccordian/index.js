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
              Can an NRI avail of tax benefits under the Indian Income Tax Act?{" "}
            </span>{" "}
            {isActive(0) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(0)}>
            <div>
              <p>
                NRIs can avail of tax benefits under the Indian Income Tax Act
                for certain investments, such as contributions to the National
                Pension System (NPS), donations to charitable institutions, and
                home loans. However, the specific tax benefits available to NRIs
                may be different from those available to residents.{" "}
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
            <span>Can an NRI claim a tax refund in India?</span>{" "}
            {isActive(1) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(1)}>
            <div>
              <p>
                Yes, an NRI can claim a tax refund in India if they have paid
                excess tax. The process for claiming a tax refund is the same as
                for residents.
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
            <span>How to determine residential status?</span>{" "}
            {isActive(3) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(3)}>
            <div>
              <p>
                A person is said to be a resident of India under these two
                conditions.
                <br />
                <br />
                <ol>
                  <li>
                    If he has stayed in India for 182 days or more during the
                    previous year.
                  </li>
                  <li>
                    If he has stayed in India for 60 days in the previous year
                    but has also been in India during the 4 years immediately
                    preceding the previous year for a total period of 365 days
                    or more.
                  </li>
                </ol>
              </p>
              <div>
                If a person fails to meet either of the two conditions, he will
                be deemed as a non-resident.
              </div>  
            </div>
          </FaqAccordianContent>
        </div>

        <div className="accordian-item">
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(5)}
            style={isActive(5) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>
              How does the DTAA help NRIs to reduce their tax liability?{" "}
            </span>{" "}
            {isActive(5) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(5)}>
            <div>
              <p>
                Usually, the income will be taxed based on your residential
                status. But if you qualify as a resident of two countries, then
                the rules according to the agreement made with that particular
                country will be followed. This is called the tiebreaker rule.
              </p>
              <p>
                If a resident earns income in a country with which India has a
                DTAA, section 90 shall apply, and the individual will get a
                bilateral relief. On the other hand, if the income is earned in
                a country with which India does not have a DTAA, section 91
                shall apply, and the individual will get a unilateral relief.
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
            <span>What is the tax rate for NRIs in India?</span>{" "}
            {isActive(6) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(6)}>
            <div>
              <p>
              The tax rate for NRIs in India is the same as for residents.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
      </div>
    </>
  );
}

export default FaqAccordian;
