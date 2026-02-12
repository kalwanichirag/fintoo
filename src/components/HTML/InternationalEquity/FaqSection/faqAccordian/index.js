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
            <span>How do fractional shares work</span>{" "}
            {isActive(0) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(0)}>
            <div>
              <p>
                When investing in US stock markets, you can buy fraction of
                stocks. It is a very unique feature. Basically it means, you
                could own 0.05 of Apple stock. It implies that you don't have to
                think in terms of "how many shares should I buy? Instead, decide
                to invest a certain amount of money and the number of units will
                be allocated to you automatically. For instance, if a stock is
                valued at $158 and you decide to invest $100 in it, you will get
                0.63 shares. Many popular US stocks are more expensive than
                typical Indian stocks. So this feature lets you invest in these
                companies and build a decent diversified portfolio even with
                small amounts of money.
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
            <span>
              What are the tax implications in India where my shares get vested
              with my nominee in case of my death?
            </span>{" "}
            {isActive(1) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(1)}>
            <div>
              <p>
                There is no applicable estate duty in India on vesting of
                properties with the nominee in the event of death.
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
              Do I need to pay tax on foreign dividend both in US and India? Can
              I claim credit for the taxes paid on such dividend in India?
            </span>{" "}
            {isActive(2) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(2)}>
            <div>
              <p>
                Yes, tax needs to be paid on Foreign dividend both in US and
                India. However, an Indian Resident individual can claim Tax
                credit of taxes paid in US by virtue of Double Taxation
                Avoidance Agreement (DTAA) entered into between India and US by
                filing a return of income in India. Maximum credit that can be
                availed is the amount of tax that should have been paid in India
                on the transaction if there is no DTAA.
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
              Am I liable to pay tax when I remit the funds back to India?
            </span>{" "}
            {isActive(3) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(3)}>
            <div>
              <p>
                No, the tax incidence is on the event of transfer of securities
                by the Client. The remittance of any funds lying outside India
                has no connection with the tax incidence.
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
            <span>How much can I invest in US stocks from India?</span>{" "}
            {isActive(4) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(4)}>
            <div>
              <p>
                Currently, you can invest up to USD 250,000 every year in
                foreign stocks from India. This amount can change, subject to
                RBI guidelines. So your investments in US securities are also
                governed by the same limit.
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
            <span>What insurance or protection do I get for my account?</span>{" "}
            {isActive(4) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(5)}>
            <div>
              <p>
                DriveWealth LLC, a member of the Securities Investor Protection
                Corporation (SIPC), will serve as the custodian for your
                securities account. In the event that DriveWealth LLC fails and
                is placed in liquidation under the Securities Investor
                Protection Act, securities in your brokerage account may be
                protected up to $500,000. For details, please see www.sipc.org.
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
            <span>Can NRIs invest?</span>{" "}
            {isActive(4) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(6)}>
            <div>
              <p>
                Yes, NRIs can invest. If NRIs are adding funds via India, they
                can use their existing NRE or NRO account and if they are adding
                funds from their foreign bank account which does not fall under
                LRS (Liberalized Remittance Scheme), they can directly remit
                funds from their bank account online.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className="accordian-item">
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(7)}
            style={isActive(7) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>What are the documents required for opening an account?</span>{" "}
            {isActive(4) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(7)}>
            <div>
              <p>
                Any one of the following documents for a combination of Picture
                id proof + Proof of address
              </p>
              <p>
                <b> Picture ID proof:</b>
                <br/>
                <ul>
                  <li>Government issued Photo ID (voter id, PAN card - mandatory for Indian Residents)</li>
                  <li>Valid driver’s license</li>
                  <li>Passport</li>
                  <li>Voters registration card and photo</li>
                </ul>
              </p>
              <p>
                <b>Proof of address:</b>
                <br/>
                <ul>
                  <li>Utility bill</li>
                  <li>Mobile phone bill, Bank or credit card statement</li>
                </ul>
              </p>
              <p><b>Else, any one of the below documents would suffice</b></p>
              <p>
                <b>Picture ID proof of address:</b>
                <br/>
                <ul>
                  <li>Valid driver license with address</li>
                  <li>Government issued Photo ID with address (Aadhar card)</li>
                </ul>
              </p>
            </div>
          </FaqAccordianContent>
        </div>
      </div>
    </>
  );
}

export default FaqAccordian;
