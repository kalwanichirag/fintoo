import React, { useState } from "react";
import { render } from "react-dom";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const GoalaasetMapAnalysis = () => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Goal Asset Mapping Graph'
    },
    xAxis: {
      min: 0,
      max : 1,
      categories: ['Assets Link', 'Goal Amount']
    },
    yAxis: {
      min: 0,
      max : 10,
      title: {
        text: 'Values'
      },
      labels: {
        formatter: function() {
          return this.value + "M ";
        }
      }
    },
    credits: {
      enabled: false,
    },
    colors: ['#9ac449','#e1b624' ,"#f88221"],
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        stacking: 'normal'
      }
    },
    series: [{
      name: 'Goal Amount',
      data: [4, 4, 6,]
    }, {
      name: 'Assets Linked by Fintoo',
      data: [5, 3, 12,]
    }, {
      name: 'Assets Linked by You',
      data: [5, 3, 12,]
    }]
  });

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default GoalaasetMapAnalysis;
