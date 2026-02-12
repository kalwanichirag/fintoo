import HighchartsReact from "highcharts-react-official";
import React, { useState } from "react";
import Highcharts from "highcharts";
import { indianRupeeFormat } from "../../../../common_utilities";
import style from "./style.module.css";

function PortfolioGraph({valuation, graphData}) {
  const chartOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
      width: 600,
    },
    credits: {
        enabled: false
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br/>{point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        innerSize: '50%',
        name: "Brands",
        colorByPoint: true,
        data: graphData,
      },
    ],
  };
  return (
    <div>
        <div className={style.portfolioHead}>
            <p>Portfolio Value</p>
            <p>{indianRupeeFormat(Number(valuation))}</p>
        </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
}

export default PortfolioGraph;
