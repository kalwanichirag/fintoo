import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/heatmap";
import "highcharts/modules/exporting";
import { get } from "react-hook-form";

const transformCorrelationData = (correlationDetail) => {
  // const ids = correlationDetail.slice(1,11).map((detail) => detail["@id"]);
  // const ids = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  const data = [];
  let cnt = 0

  // correlationDetail.forEach((detail, i) => {
  //     detail.Correlation.forEach((correlation, j) => {
  //         const value = parseFloat(correlation["#text"]);
  //         data.push([i, ids.indexOf(correlation["@id"]), value]);
  //     });
  // });

  const sortedData = correlationDetail.sort((a, b) => parseInt(a["@id"]) - parseInt(b["@id"])).slice(0, 10);
  const ids = sortedData.map((detail) => (parseInt(detail["@id"]) + 1).toString());

  const final_sorted = sortedData.map(item => ({
    ...item,
    Correlation:
      item.Correlation.sort((a, b) => parseInt(a["@id"]) - parseInt(b["@id"])).slice(0, 10),

  }));

  final_sorted.forEach((detail, i) => {
    detail.Correlation.forEach((correlation, j) => {
      let value = parseFloat(correlation["#text"]);
      if (j < i) {
        data.push([i, ids.indexOf((parseInt(correlation["@id"]) + 1).toString()), null]);
      } else {
        if (isNaN(value) || value == null || value == 0.0) {
          value = 0;
        }
        data.push([i, ids.indexOf((parseInt(correlation["@id"]) + 1).toString()), value]);
      }
    });
  });

  return {
    categories: ids,
    data,
  };
};

// Example data
const correlationDetail = [
  {
    "@id": "28",
    "Correlation": [
      { "@id": "28", "#text": "1" },
      { "@id": "18", "#text": "0.89376" },
      { "@id": "24", "#text": "0.80407" },
    ],
  },
  {
    "@id": "18",
    "Correlation": [
      { "@id": "28", "#text": "0.89376" },
      { "@id": "18", "#text": "1" },
      { "@id": "24", "#text": "0.437" },
    ],
  },
  {
    "@id": "24",
    "Correlation": [
      { "@id": "28", "#text": "0.80407" },
      { "@id": "18", "#text": "0.437" },
      { "@id": "24", "#text": "1" },
    ],
  },
];


const CorrelationMatrix = (props) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "heatmap",
      zooming: { type: 'xy' },
      marginTop: 80,
      marginBottom: 130,
      marginLeft: 50,
      marginRight: 50,
      height: null,
      toolbar: { show: false },
    },
    legend: {
      enabled: true,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemMarginTop: 10,
      itemMarginBottom: 10,
      // symbolWidth: 500,
      itemStyle: {
        fontSize: '12px',
        fontWeight: 'bold',
        // width: "500px",
        textOverflow: undefined
      },
      itemWidth: 600,
    },
    title: {
      text: "",
    },
    exporting: {
      buttons: {
        contextButton: {
          enabled: false,
        },
      },
    },
    xAxis: {
      opposite: true,
      crosshair: true,
    },
    yAxis: {
      reversed: true,
      title: {
        text: "",
      },
      gridLineWidth: 0,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      crosshairs: true,
      shared: true,
    },
    colorAxis: {

      min: -1,
      max: 1,
      minColor: "#ffffff",
      maxColor: "#042b62",
      reversed: true,
      stops: [
        [-1.00, "#ffffff"],
        [-0.60, "#80deea"],
        [-0.20, "#44689b"],
        [0.20, "#0288d1"],
        [0.60, "#0288d1"],
        [1, "#042b62"],
      ],
      width: "80%",
      tickPositions: [-1.00, -0.60, -0.20, 0.20, 0.60, 1],
      labels: {
        format: "{value}",
        formatter: function () {
          if (this.value === -0.60) return "Highly<br> Negative";
          if (this.value === -0.20) return "Moderately<br>Negative";
          if (this.value === 0.20) return "None";
          if (this.value === 0.60) return "Moderate";
          if (this.value === 1) return "High";
          return "";
        },
        align: "left", // Aligns the labels to the right
        // x: 10, // Adjust the horizontal offset if needed
        style: {
          fontSize: "10px",
          fontWeight: "bold",
          // color: "#000000",
        },
        overflow: "allow"
      },
      layout: "horizontal", // Makes the color bar horizontal
      align: "bottom", // Aligns the color bar at the bottom
      marginBottom: 100,
      // paddingTop: 20, // Optional: Add spacing between the chart and the color bar
      height: 35,
      // floating: true,  // Allow positioning independently
      // left: "50%",  // Move to the center
      // translateX: "-50%", // Adjust for true centering
    },
    series: [
      {
        name: "Correlation Matrix",
        // borderWidth: 1, 
        // borderColor: "#d9d9d9", 
        data: [],
        dataLabels: {
          enabled: true,
          color: "#FFFFFF",
          format: "{point.value:.2f}",
          style: {
            textOutline: "none",  // Remove text border (outline)
            fontSize: "16px"
          },
        },
        pointPadding: 0, // Ensures tight square look
        groupPadding: 0, // No gaps between cells
      },
    ],
  });


  const getHeight = (number_of_categories) => {
    let cellsize;
    switch (number_of_categories) {
      case 2:
        cellsize = 150;
        return number_of_categories * cellsize;
      case 3:
        cellsize = 110;
        return number_of_categories * cellsize;
      case 4:
        cellsize = 95;
        return number_of_categories * cellsize;
      case 5:
        cellsize = 80;
        return number_of_categories * cellsize;
      case 6:
        cellsize = 70;
        return number_of_categories * cellsize;
      case 7:
      case 8:
        cellsize = 65;
        return number_of_categories * cellsize;
      case 9:
      case 10:
        cellsize = 60;
        return number_of_categories * cellsize;
      default:
        cellsize = 80;
        return number_of_categories * cellsize;
    }
  }

  useEffect(() => {

    let { categories, data } = transformCorrelationData(props.corrData);

    const cellSize = 60;
    // const chartSize = (categories.length * cellSize);
    let chartSize = getHeight(categories.length);

    // Update the chartOptions with new data
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      chart: {
        ...prevOptions.chart,
        // width: chartSize,
        height: chartSize,
      },
      xAxis: {
        ...prevOptions.xAxis,
        categories: categories,
      },
      yAxis: {
        ...prevOptions.yAxis,
        categories: categories,
        reversed: true,
      },
      series: [
        {
          ...prevOptions.series[0],
          data: data,
        },
      ],
      tooltip: {
        formatter: function () {
          if (this.point.value === null) {
            return false;
          }
          return `X: <b>${categories[this.point.x]}</b><br>Y: <b>${categories[this.point.y]}</b><br>Correlation: <b>${this.point.value.toFixed(2)}</b>`;
        },
      },
    }));
  }, [props.corrData]);

  return (
    <div
    // style={{ width: "50%", height: "800px" }}
    >
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
}

export default CorrelationMatrix;