import React, { Component, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import moment from "moment";
const PieChartInflow = ({ grossInflowGraphData }) => {

  const [graphData, setGraphData] = useState({});

  useEffect(() => {
    const series = [];
    const labels = []; 
    if (grossInflowGraphData && grossInflowGraphData.length > 0) {    
      grossInflowGraphData.forEach(item => {
        const percentage = Math.round((item.value / item.total) * 100);
        series.push(percentage);
        labels.push(item.name);
      });
    }
    setGraphData({
      series: series,
      options: {
        chart: {
          width: 380,
          type: "pie",
        },
        toolbar: {
          show: false,

        },
        legend: {
          show: true,
          position: 'bottom',
          horizontalAlign: 'center',
          offsetX: 14,
          offsetY: 0,
          markers: {
            fillColors: ["#588036", "#fead1b"],

          },
          // labels: {
          //     colors: ["#042b62", "#588036"],
          //     useSeriesColors: ["#588036", "#042b62"],
          //     // useSeriesColors: false
          // },
        },
        colors: ["#588036", '#fead1b',],
        labels: labels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 340,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    });
  }, [grossInflowGraphData]);
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

export default PieChartInflow;