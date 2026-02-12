import { useState } from "react";
import FaqAccordianContent from "./AccordionWPContent";;
import style from "./style.module.css";

const Plus = () => {
  return (
    <svg width="60" height="60" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40.3285" cy="40.5785" r="39.6957" fill="#F7F7F7" />
      <path d="M49.0599 40.5807H31.5938M40.3268 49.3138L40.3268 31.8477" stroke="#786F77" stroke-width="1.58783" stroke-linecap="round" />
    </svg>

  )
}

const Minus = () => {
  return (
    <svg width="60" height="60" viewBox="0 0 81 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40.3285" cy="39.7543" r="39.6957" fill="#004FBF" />
      <path d="M49.0598 30.9805L31.6299 48.4827M49.096 48.4465L31.5938 31.0166" stroke="white" stroke-width="1.58783" stroke-linecap="round" />
    </svg>
  )
}

function AccordianWP({ accordionData }) {
  const [activeIndex, SetActiveIndex] = useState(null);

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
        {
          accordionData.map((data, idx) =>
            <div className={style["accordian-item"]}>
              <div
                className={`${style["accordian-header"]} `}
                onClick={() => updateAccordionIndex(idx)}
                style={isActive(idx) ? { color: "#022D63" } : { color: "#022D63" }}
              >
                {
                  data?.icon &&
                  <img style={{ width: '20px', marginRight: '0.5rem' }} src={data.icon} alt="" />
                }
                <span>
                  {data.heading}
                </span>{" "}
                {/* {isActive(idx) ? <Minus /> : <Plus />}{" "} */}
                {isActive(idx) ? "-" : "+"}{" "}
              </div>
              <FaqAccordianContent activeIndex={isActive(idx)}>
                <div style={{paddingBottom:'1rem'}}>
                  <span className="m-0">
                    {data.content}
                  </span>
                </div>
              </FaqAccordianContent>
            </div>)
        }

      </div>
    </>
  );
}

export default AccordianWP;
