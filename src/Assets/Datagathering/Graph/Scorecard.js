import React from "react";
import ReactSpeedometer from "react-d3-speedometer";
function Scorecard({needle_pos}) {
  
  return (
    <div>
      <ReactSpeedometer
      minValue={0}
      maxValue={100}
      width={350}
    value={needle_pos}
      // value={85}
        currentValueText="Scorecard"
        customSegmentLabels={[
          {
            text: "Not Good",
            position: "INSIDE",
            color: "#555",
          },
          {
            text: "Average",
            position: "INSIDE",
            color: "#555",
          },
          {
            text: "Good",
            position: "INSIDE",
            color: "#555",
            fontSize: "19px",
          },
          {
            text: "Very Good",
            position: "INSIDE",
            color: "#555",
          },
          {
            text: "Excellent",
            position: "INSIDE",
            color: "#555",
          },
        ]}
      />
    </div>
  );
}

export default Scorecard;
