import HighchartsReact from "highcharts-react-official";
import React, { useState } from "react";
import Highcharts from "highcharts";

function AssetSummary(props) {
  const asset_summary_graph = props.assetgraphdata;
  const [chartOptions] = useState({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      type: "pie",
      marginTop: 10,
    },
    title: {
      text: "Asset Matrix",
      align: "center",
    },
    tooltip: {
      // pointFormat: '{series.name}: {point.percentage:.2f}%'
      pointFormat: "{series.name}: {point.percentage:.2f}%",
    },
    colors: ["#588036", "#042b62"],
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
          distance: 10,
          pointFormat: "{series.name}: {point.percentage:.2f} %",
          style: {
            fontWeight: "bold",
            color: "black",
          },
        },
        startAngle: -90,
        endAngle: -90,
        center: ["50%", "55%"],
        size: "90%",
        showInLegend: true,
      },
    },
    labels: {
      x: -20,
      y: 0,
    },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemMarginTop: 10,
      itemMarginBottom: 10,
      useHTML: true,
      labelFormatter: function () {
        return this.name;
        // return this.name + ' - ₹ ' + this.y;
      },
    },
    series: [
      {
        name: "Total Value",
        innerSize: "0%",
        data: asset_summary_graph,
      },
    ],
    credits:{
      enabled:false
    },
    responsive: {
      rules: [
        {
          condition: {
            // maxWidth: 600,
          },
          chartOptions: {
            legend: {
              align: "center",
              verticalAlign: "bottom",
              layout: "horizontal",
            },
          },
        },
      ],
    },
  });
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
}

export default AssetSummary;
