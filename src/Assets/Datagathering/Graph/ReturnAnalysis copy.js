import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import Highcharts from "highcharts";

HighchartsMore(Highcharts);

const ReturnAnalysis = (props) => {
  const returnAnalysisholdinggraphvalues = props.returnAnalysisholdinggraphvalues;
  const three_year_std_deviation_mean = props.three_year_std_deviation_mean;

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
    exporting: {
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
      bubble: {
        maxSize: 22
      }
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
    let three_yr_mean = three_year_std_deviation_mean.mean;
    let three_yr_std_deviation = three_year_std_deviation_mean.std_deviation;

    setChartOptions((prevOptions) => ({
      ...prevOptions,
      chart: {
          ...prevOptions.chart,
          events: {
            load: function () {
                let chart = this;

                if (!chart.xAxis[0] || !chart.yAxis[0]) return; // Ensure axes exist

                let xValue = three_year_std_deviation_mean?.std_deviation, yValue = three_year_std_deviation_mean?.mean;
                print("mean", xValue, " std: ", yValue);
                let xPixel = chart.xAxis[0].toPixels(xValue, true);
                let yPixel = chart.yAxis[0].toPixels(yValue, true);

                if (isNaN(xPixel) || isNaN(yPixel)) {
                  console.warn("Pixel conversion failed.");
                  return;
                }

                chart.renderer
                  .rect(xPixel - 5, yPixel - 5, 10, 10)
                  .attr({
                    fill: "red",
                    stroke: "black",
                    "stroke-width": 2,
                  })
                  .add();
                }
          }  
      },
      // chart: {
      //     ...prevOptions.chart,
      //     events: {
      //         load: function () {
      //           let chart = this;
      //           console.log("hhhhhhhhhhhhhhhh");
      
              // setTimeout(() => {
              //   if (!chart.xAxis[0] || !chart.yAxis[0]) return; // Ensure axes exist
      
              //   let xValue = 50, yValue = 50;
              //   let xPixel = chart.xAxis[0].toPixels(xValue, true);
              //   let yPixel = chart.yAxis[0].toPixels(yValue, true);
      
              //   console.log("Chart Axis Min/Max:");
              //   console.log("X-Axis:", chart.xAxis[0].min, chart.xAxis[0].max);
              //   console.log("Y-Axis:", chart.yAxis[0].min, chart.yAxis[0].max);
              //   console.log("Pixel Coordinates:", xPixel, yPixel);
      
              //   if (isNaN(xPixel) || isNaN(yPixel)) {
              //     console.warn("Pixel conversion failed.");
              //     return;
              //   }
      
              //   chart.renderer
              //     .rect(xPixel - 5, yPixel - 5, 10, 10)
              //     .attr({
              //       fill: "red",
              //       stroke: "black",
              //       "stroke-width": 2,
              //     })
              //     .add();
              // }, 500); // Increased timeout
      //       },
      //   },
      // },
      xAxis: {
        ...prevOptions.xAxis,
        plotLines: [
          {
            value: three_yr_std_deviation,
            color: "black",
            width: 2,
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
      yAxis: {
        ...prevOptions.yAxis,
        plotLines: [
          {
            value: three_yr_mean,
            color: "black",
            // dashStyle: "longdash",
            width: 2,
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
    }));

   
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

export default ReturnAnalysis;