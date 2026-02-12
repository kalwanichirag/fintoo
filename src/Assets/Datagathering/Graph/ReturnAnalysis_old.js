import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-more"; 

const ReturnAnalysisOld = (props) => {
  const returnAnalysisholdinggraphvalues = props.returnAnalysisholdinggraphvalues;
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bubble",
      plotBorderWidth: 1,
      zoomType: "xy",
      backgroundColor: "transparent",
    },
    legend: {
      enabled: false,
    },
    title: {
      text: "Return Analysis",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      gridLineWidth: 1,
      title: {
        text: "3-Yr Standard Deviation",
      },
      labels: {
        format: "{value}",
      },
    },
    colors: ["#58803680"],
    yAxis: {
      startOnTick: false,
      endOnTick: false,
      title: {
        text: "3 Yr Mean",
      },
      labels: {
        format: "{value}",
      },
      maxPadding: 0.2,
      plotLines: [
        {
          value: 50,
          color: "black",
          dashStyle: "Dash",
          width: 1,
          label: {
            text: "",
            align: "right",
            style: {
              color: "red",
            },
          },
        },
      ],
    },
    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      pointFormat:
        '<tr><th colspan="2"><h3>{point.stcokName}</h3></th></tr>' +
        "<tr><th>Standard Deviation:</th><td>{point.x}</td></tr>" +
        "<tr><th>3Yr. Return value:</th><td>{point.y}</td></tr>" +
        "<tr><th>Weight:</th><td>{point.z}%</td></tr>",
      footerFormat: "</table>",
      followPointer: true,
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          allowOverlap: true,
        },
      },
    },
    
    series: [
      {
        data: returnAnalysisholdinggraphvalues.map((dataPoint) => ({
          x: parseFloat(dataPoint.x),
          y: parseFloat(dataPoint.y),
          z: dataPoint.weight,
          name: dataPoint.name,
          stcokName: dataPoint.value,
        })),
      },
    ],
  });

  useEffect(() => {
    // This effect will be triggered whenever the returnAnalysisholdinggraphvalues prop changes.
    // It will update the chart options accordingly.

    setChartOptions({
      series: [
        {
          data: returnAnalysisholdinggraphvalues.map((dataPoint) => ({
            x: parseFloat(dataPoint.x),
            y: parseFloat(dataPoint.y),
            z: dataPoint.weight,
            name: dataPoint.name,
            stcokName: dataPoint.value,
          })),
        },
      ],
    });

    // Note: You may have other dependencies to add here. If so, add them to the dependency array of useEffect.
    // For example, if you have another prop that affects the chart options, you should add it to the array like this:
    // }, [returnAnalysisholdinggraphvalues, anotherProp]);

  }, [returnAnalysisholdinggraphvalues]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default ReturnAnalysisOld;