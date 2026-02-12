import React, { useState } from "react";
import { render } from "react-dom";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const RealEstateCommercial = (props) => {
    const commercial = props.commercial; // Assuming this is an array of commercial data for different locations
  
    const chartOptions = {
      chart: {
        type: "column",
      },
      title: {
        text: "Real Estate Yield",
      },
      xAxis: {
        categories: props.commercial ? props.commercial.map((data) => data.asset_name) : "",
      },
      colors: ["#3d8b37", "#e1b624d9", "#ff0000"],
      yAxis: {
        title: {
          text: "Yield in (%)",
        },
        labels: {
          formatter: function () {
            return this.value + "%";
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
          data: props.commercial ? props.commercial.map((data) => data.rental_yield) : 0,
        },
        {
          name: "Average Yield",
          data: props.commercial ? props.commercial.map((data) => data.avg_yield) : 0,
        },
      ],
    };
  
    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    );
  };
  
  export default RealEstateCommercial;