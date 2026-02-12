import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const StockSectors = (props) => {
  const cyclicSectorTotal = props.cyclicSectorTotal;
  const sensitiveSectorTotal = props.sensitiveSectorTotal;
  const defensiveSectorTotal = props.defensiveSectorTotal;

  const chartOptions = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: " ",
    },
    colors: ["#588036", "#E1B624", "#042b62", "#F8851E"],
    yAxis: {
      title: {
        text: "Units",
      },
      labels: {
        formatter: function () {
          return this.value.toFixed(2) + "";
        },
        style: {
          color: "black",
        },
      },
    },
    tooltip: {
      valueSuffix: "%",
      valueDecimals: 2, // Show two decimal places in tooltips
      formatter: function() {
        return this.y.toFixed(2) + "%"; // Custom tooltip formatter to display percentage value with two decimal places and a percent sign
      }
    },    
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Cyclical",
        data: [cyclicSectorTotal],
      },
      {
        name: "Sensitive",
        data: [sensitiveSectorTotal],
      },
      {
        name: "Defensive",
        data: [defensiveSectorTotal],
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default StockSectors;