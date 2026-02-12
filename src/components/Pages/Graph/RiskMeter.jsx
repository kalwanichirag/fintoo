import React, { memo } from "react";
import GaugeChart from "react-gauge-chart";

const RiskMeter = ({ value }) => {

  return (
    <GaugeChart
      animate={true}
      animDelay={0}
      animateDuration={0}
      id="gauge-chart1"
      nrOfLevels={6}
      percent={value}
      hideText={false}
      textColor="transparent"
      needleBaseColor="#F35725"
      arcPadding={0.0}
      cornerRadius={0}
      arcWidth={0.29}
      formatTextValue={(value) => `${value}%`}
      needleColor="#042b62"
      colors={["#a9ba1d", "#fcdf56", "#f8c847", "#edac39", "#e0733c", "#c43f38"]}
      arcsLength={[0.075, 0.075, 0.075, 0.075, 0.075, 0.075]}
    />
  );
}

export default memo(RiskMeter);
