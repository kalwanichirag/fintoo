import { useEffect, useRef, useState } from "react";
import Creditreport from "./Creditreport.module.css";

const CreditScorecard = ({ value, width, creditScore, scoreIndicator }) => {
  const refPin = useRef(null);
  const imageRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scoreDeg, setScoreDeg] = useState("");
  const [scoreDeg2, setScoreDeg2] = useState("rotate(237deg)");

  useEffect(() => {
    if (scoreIndicator) {

      setTimeout(() => {
      // if (imageRef.current) {
        //   imageRef.current.style.webkitTransform = `rotate(${180 * (Number(value) / 900) - 90}deg)`;
        // }
        let deg =  "rotate(" + scoreIndicator + "deg)";
        // let deg =  "rotate(" + (180 * (Number(value) / 900 ) - 90) + "deg)";
        setScoreDeg2(deg);
      }, 2000);
      // let deg =  "rotate(" + scoreIndicator + "deg)";
      // setScoreDeg(deg)
    }

  }, [scoreIndicator]);

  useEffect(() => {
    // const handleLoad = () => {
    //   setIsLoaded(true);
    // };

    // if (imageRef.current) {
    //   imageRef.current.addEventListener('load', handleLoad);
    // }

    // return () => {
    //   if (imageRef.current) {
    //     imageRef.current.removeEventListener('load', handleLoad);
    //   }
    // };
  }, []);

  return (
    <div className="ScoreCard text-center">
      <div
        id={Creditreport["creditmeter-box"]}
        style={{
          width: width + "px",
          height: width * 0.6 + "px",
        }}
      >
        <div style={{ position: "relative" }}>
          <div>
            <img
              id={Creditreport["meter"]}
              alt="meter"
              style={{ width: "100%" }}
              src={process.env.REACT_APP_STATIC_URL + 'media/DG/Credit_Score.svg'}
            />
            <img
              ref={imageRef}
              // id={Creditreport["meter"]}
              alt="meter"
              // className={isLoaded ? Creditreport.indicatorRoatate : ''}
              style={{
                width: "20px",
                position: "absolute",
                top: "60px",
                left: '65px',
                width: "56px",
                // transform: `rotate(${scoreIndicator})deg`
                transform: `${scoreDeg2}`,
              }}
              src={process.env.REACT_APP_STATIC_URL + 'media/DG/Credit_Score_indicator.svg'}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              top: "64px",
              left: "67px"
            }}
            className={`${Creditreport.valueBox}`}>
            <div className={`${Creditreport.valueBoxcircle}`}>
              {creditScore}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScorecard;
