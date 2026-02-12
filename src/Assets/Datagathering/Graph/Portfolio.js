import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";

function Portfolio(props) {
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    const assetAllocationData = props.assetAllocationData.map((item) => ({
      name: getTypeName(item["@type"]),
      y: parseFloat(item["#text"]),
    }));

    function getTypeName(type) {
      switch (type) {
        case "1":
          return "Stock";
        case "2":
          return "Bond";
        case "3":
          return "Cash";
        case "4":
          return "Others";
        case "5":
          return "Not Classified";
        default:
          return "Unknown Type";
      }
    }

    setChartOptions({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        type: "pie",
        marginTop: 10,
        backgroundColor: "transparent",
      },
      title: {
        text: "",
      },
      tooltip: {
        valueSuffix: "%",
        valueDecimals: 2, // Show two decimal places in tooltips
        formatter: function() {
          return this.y.toFixed(2) + "%"; // Custom tooltip formatter to display percentage value with two decimal places and a percent sign
        }
      },   
      colors: ["#588036", "#fead1b", "#042b62"],
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
        },
      },
      series: [
        {
          name: "",
          innerSize: "0%",
          data: assetAllocationData.filter((item) => item.y > 0),
        },
      ],
      credits: {
        enabled: false,
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
  }, [props.assetAllocationData]);

  if (!chartOptions) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
}

export default Portfolio;