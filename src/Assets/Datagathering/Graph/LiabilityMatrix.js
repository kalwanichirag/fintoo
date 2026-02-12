import HighchartsReact from "highcharts-react-official";
import React, { useState } from "react";

import Highcharts from "highcharts";
// HighchartsMore(Highcharts);

function LiabilityMatrix(props) {
  const liability_graph_data = props.liabilitygraphdata;
  const [chartOptions] = useState({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "Liability Matrix",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    legend: {
      //layout: 'vertical',
      //align: 'right',
      //verticalAlign: 'middle',
      itemMarginTop: 10,
      itemMarginBottom: 10,
      useHTML: true,
      labelFormatter: function () {
        //return this.name + ' - '+ '₹ ' + this.y ;
        return this.name;
      },
    },
    colors: [
      "#588036",
      "#e1b624",
      "#042b62",
      "#f88221",
      "#f9411f",
      "#9400D3",
      "#4B0082",
      "#800000",
    ],
    series: [
      {
        name: "percentage",
        colorByPoint: true,
        data: liability_graph_data,
      },
    ],
    credits:{
      enabled:false
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 600,
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

export default LiabilityMatrix;
