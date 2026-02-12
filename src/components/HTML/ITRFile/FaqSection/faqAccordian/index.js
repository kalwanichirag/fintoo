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
            <span>What is ITR filing on a video call?</span>{" "}
            {isActive(0) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(0)}>
            <div>
              <p>
              ITR filing over a one-on-one video call is an innovative method of filing your Income Tax Returns (ITR). It involves a real-time collaboration between a person who wishes to file ITR and a Tax Expert over a LIVE call.
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
            <span>What is the process of filing ITR on a video call?</span>{" "}
          {isActive(1) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(1)}>
            <div>
              <p>
              First, you are required to schedule an appointment with the tax expert by selecting your preferred date and time. Once you schedule the appointment, you will get a list of documents which you need to keep ready on the day of the appointment. At the time of the appointment, you and the tax expert will connect over a live video call via Google Meet, Skype, Zoom or MS Teams. The tax expert will guide you step-by-step to file our ITR.
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
            Is filing ITR online over a video call reliable?
            </span>{" "}
            {isActive(3) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(3)}>
            <div>
              <p>
              Yes, filing your ITR online over a live video call is a new concept, but it is as reliable as filing your ITR using the traditional way with your CA.
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
            <span>Will the tax expert answer my tax and ITR filing-related questions?</span>{" "}
            {isActive(5) ? <BsArrowRight /> : <AiOutlinePlus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(5)}>
            <div>
              <p>
              Yes, in case you have any questions related to your ITR filing and taxation, you can surely ask the tax expert, and the expert will answer them during the call.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
      </div>
    </>
  );
}

export default FaqAccordian;
