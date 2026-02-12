import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-more"; 

const ReturnAnalysis = (props) => {
  const returnAnalysisholdinggraphvalues = props.returnAnalysisholdinggraphvalues;
  const returnAnalysisPortfolio = props.returnAnalysisPortfolio;
  const three_year_std_deviation_mean = props.three_year_std_deviation_mean;
  let three_yr_x_value = three_year_std_deviation_mean.x_value;
  let three_yr_y_value = three_year_std_deviation_mean.y_value;

  useEffect(() => {
      Highcharts.chart("return_analysis_container", {
          chart: {
            type: "scatter",
            plotBorderWidth: 1,
            zoomType: "xy",
            backgroundColor: "transparent",
            // events: {
            //   load: function () {
            //       let chart = this;
            //       console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhh");
  
            //       if (!chart.xAxis[0] || !chart.yAxis[0]) return; // Ensure axes exist
  
            //       let xValue = three_year_std_deviation_mean?.std_deviation, yValue = three_year_std_deviation_mean?.mean;
            //       console.log("mean", xValue, " std: ", yValue, typeof xValue, typeof yValue);
            //       if (xValue == null || yValue == null) {
            //           console.warn("Missing data for rectangle!");
            //           return;
            //       }

            //       console.log("X-Axis Range:", chart.xAxis[0].min, "-", chart.xAxis[0].max);
            //       console.log("Y-Axis Range:", chart.yAxis[0].min, "-", chart.yAxis[0].max);
            //       // Clamp values within the axis range
            //       xValue = Math.max(chart.xAxis[0].min, Math.min(chart.xAxis[0].max, xValue));
            //       yValue = Math.max(chart.yAxis[0].min, Math.min(chart.yAxis[0].max, yValue));

            //       let xPixel = chart.xAxis[0].toPixels(xValue, true) + chart.plotLeft;
            //       let yPixel = chart.yAxis[0].toPixels(yValue, true) + chart.plotTop;
                   
            //       console.log("Pixel Coordinates:", xPixel, yPixel);
  
            //       if (isNaN(xPixel) || isNaN(yPixel)) {
            //         console.warn("Pixel conversion failed.");
            //         return;
            //       }
  
            //       chart.renderer
            //         .rect(xPixel - 10, yPixel - 10, 20, 20)
            //         .attr({
            //           fill: "#042b62",
            //           // stroke: "black",
            //           // "stroke-width": 2,
            //         })
            //         .add();
            //       }
            // }  
          },
          legend: {
            enabled: true,
            align: "left",
            verticalAlign: "top",
            layout: "horizontal",
            x: 200,
            y: -10,
            itemStyle: {
              fontSize: "12px",
              fontWeight: "normal",
            },
          },
          exporting: {
            enabled: false, 
          },
          title: {
            // text: "Return Analysis",
            text: " ",
            align: "left"
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
            plotLines: [
              {
                value: three_yr_x_value,
                color: "black",
                opacity: 0.3,   
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
          // colors: ["#58803680"],
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
                value: three_yr_y_value,
                color: "black",
                // dashStyle: "longdash",
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
            bubble: {
              maxSize: 22
            }
          },
          series: [
            {
              name: "Underlying Holdings",
              // color: "#58803680",
              // color: "#588036",
              color: "red",
              marker: {
                radius: 10,
              },
              dataLabels: {
                enabled: true, 
                format: "{point.name}", // Display the name inside the bubble
                align: "center",
                verticalAlign: "middle",
                style: {
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: "#ffffff", 
                  textOutline: "none", 
                },
              },
              data: returnAnalysisholdinggraphvalues.map((dataPoint) => ({
                x: parseFloat(dataPoint.x),
                y: parseFloat(dataPoint.y),
                z: dataPoint.weight,
                name: dataPoint.name,
                stcokName: dataPoint.value,
                // marker: dataPoint.name === "Portfolio" ? {
                //   symbol: "custom-circle",
                //   radius: 10, // Adjust the size as needed
                //   fillColor: "",
                //   lineWidth: 3,
                //   lineColor: "green",
                // } : undefined,
              })),
            },
            {
              name: "Investment Style",
              // legendSymbol: "square",
              // drawLegendSymbol: function (legend, item) {
              //   var symbol = legend.chart.renderer.rect(
              //     0,
              //     legend.baseline - 6,
              //     12, // Width of square
              //     12, // Height of square
              //     0
              //   )
              //     .attr({
              //       fill: "#042b62",
              //       stroke: "#042b62",
              //       "stroke-width": 2,
              //     })
              //     .add(item.legendGroup);
              //   return symbol;
              // },
              // type: "bubble", // Ensure this remains a bubble type
              // marker: {
              //   symbol: "square", // Ensures a square marker in the chart
              // },
              // marker: {
              //   symbol: 'custom-square', 
              //   // radius: 30,
              //   fillColor: "",
              //   lineWidth: 2,
              //   lineColor: "green",
              // },
              color: "#042b62",
              // fillOpacity: 1,
              marker: {
                symbol: "square", 
                radius: 10, 
                // fillColor: "#042b62", 
                // lineWidth: 1,
                // lineColor: "#042b62", 
              },
              data: [{
                x: parseFloat(three_year_std_deviation_mean.x_value),
                y: parseFloat(three_year_std_deviation_mean.y_value),
                z: 100,
                name: "",
                marker: {
                  symbol: "square", 
                  radius: 10, 
                  // fillColor: "#042b62", 
                  // lineWidth: 1,
                  // lineColor: "#042b62", 
                  // fillOpacity: 1, 
                }
              }]
            },
            {
              name: "Portfolio",
              // type: "spline",
              // color: "red",
              marker: {
                // symbol: 'custom-circle', 
                symbol: 'circle',
                radius: 7,
                fillColor: "#ffffff",
                lineWidth: 3,
                lineColor: "red",
              },
              data: [{
                  x: parseFloat(returnAnalysisPortfolio.x),
                  y: parseFloat(returnAnalysisPortfolio.y),
                  z: returnAnalysisPortfolio.weight,
                  name: "",
                  stcokName: returnAnalysisPortfolio.value,
                  marker: {
                      // symbol: "custom-circle",
                      symbol: 'circle',
                      radius: 7, 
                      fillColor: "#ffffff",
                      lineWidth: 3,
                      lineColor: "red",
                  },
              }]
            },
          ],
      });

      Highcharts.SVGRenderer.prototype.symbols["custom-circle"] = function (x, y, w, h) {
        let outerRadius = w / 2;
        let innerRadius = outerRadius * 0.25; // Adjust inner dot size
      
        return [
            // Outer circle
            "M", x + outerRadius, y, 
            "A", outerRadius, outerRadius, 0, 1, 0, x + outerRadius, y + h, 
            "A", outerRadius, outerRadius, 0, 1, 0, x + outerRadius, y, 
    
            // Inner dot (small filled circle)
            "M", x + outerRadius - innerRadius, y + outerRadius, 
            "A", innerRadius, innerRadius, 0, 1, 0, x + outerRadius + innerRadius, y + outerRadius, 
            "A", innerRadius, innerRadius, 0, 1, 0, x + outerRadius - innerRadius, y + outerRadius,
            "Z"
        ];
     };

      // Highcharts.SVGRenderer.prototype.symbols["custom-square"] = function (x, y, w, h) {
      //   return [
      //       "M", x, y, 
      //       "L", x + w, y, 
      //       "L", x + w, y + h, 
      //       "L", x, y + h, 
      //       "Z"
      //   ];
      // };
      Highcharts.SVGRenderer.prototype.symbols["custom-square"] = function (x, y, w, h, options) {
        let fill = (options && options.fill) ? options.fill : "#042b62"; // Default to your desired color
    
        return this.rect(x, y, w, h, 0).attr({
            fill: fill, 
            stroke: fill, 
            "stroke-width": 1
        });
    };
  }, [returnAnalysisholdinggraphvalues, returnAnalysisPortfolio, three_year_std_deviation_mean]);

  
  return (
    <div id="return_analysis_container"></div>
);
};

export default ReturnAnalysis;