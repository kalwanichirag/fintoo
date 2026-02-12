import React, { Component, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import moment from "moment";
const PieChartOutflow = ({ grossOutflowGraphData }) => {

  const [graphData, setGraphData] = useState({});

  useEffect(() => {
    const series = [];
    const labels = []; 
    if (grossOutflowGraphData && grossOutflowGraphData.length > 0) {    
      grossOutflowGraphData.forEach(item => {
        series.push(item.value);
        labels.push(item.name);
      });
    }
    setGraphData({
      series: series,
      options: {
        chart: {
          width: 480,
          type: "pie",
        },
        legend: {
          show: true,
          position: 'bottom',
          horizontalAlign: 'center', 
          offsetX: 14,
          offsetY: 0,
          markers : {
              fillColors: ["#588036", '#E1B624', '#042b62','#F8851E'],
              
          },
          // labels: {
          //     colors: ["#042b62", "#588036"],
          //     useSeriesColors: ["#588036", "#042b62"],
          //     // useSeriesColors: false
          // },
      },
      colors: ["#588036", '#E1B624', '#042b62','#F8851E'],
        labels: labels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 380,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    });
  }, [grossOutflowGraphData]);
  return (
    <div className="donut">
      {graphData?.series?.length > 0 && <ReactApexChart
        options={graphData?.options}
        series={graphData?.series}
        type="pie"
        width={380}
      />}
    </div>
  );
}

export default PieChartOutflow;