// import React from 'react';
import React, { useEffect, useState } from "react";

import GaugeChart from "react-advanced-gauge-chart";
function RangeChart(props) {
  const [currentPercent, setCurrentPercent] = useState();
  const [arcs, setArcs] = useState([0.5, 0.3, 0.2]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPercent(Math.random());
      setArcs([0.1, 0.5, 0.4]);
    }, 2800);

    return () => {
      clearTimeout(timer);
    };
  });

  const chartStyle = {
    color: "#042b62",

    // width : 100
  };
  return (
    <div>
      <GaugeChart
        id="gauge-chart8"
        style={chartStyle}
        nrOfLevels={30}
        colors={["#EA4228 ", "#F5CD19", "#5BE12C"]}
        arcWidth={0.3}
        percent={
          (props.data.checklistP /100)
          // props.data.total - props.data.positivesNum < props.data.positivesNum
          //   ?(props.data.positivesNum / 100)
          //   : (100 - (props.data.total - props.data.positivesNum)) / 100
        }
        animDelay={0}
        formatTextValue={() =>
          props.data.checklistP.toFixed(2)
        }
      />
    </div>
  );
}

export default RangeChart;
