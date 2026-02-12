import React, { useState } from "react";
import { render } from "react-dom";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const RealEstate = (props) => {
  const residential = props.residential; // Assuming this is an array of residential data for different locations

  const chartOptions = {
    chart: {
      type: "column",
    },
    title: {
      text: "Real Estate Yield",
    },
    xAxis: {
      categories: props.residential ? props.residential.map((data) => data.asset_name) : "",
    },
    colors: ["#3d8b37", "#e1b624d9", "#ff0000"],
    yAxis: {
      title: {
        text: "Price",
      },
      labels: {
        formatter: function () {
          return this.value;
        },
      },
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    tooltip: {
      enabled: false, // Disable the tooltip
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Rental Yield",
        data: props.residential ? props.residential.map((data) => data.rental_yield) : 0,
      },
      {
        name: "Average Yield",
        data: props.residential ? props.residential.map((data) => data.avg_yield) : 0,
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default RealEstate;
