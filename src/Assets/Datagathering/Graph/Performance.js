import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Performance = (props) => {
  const [growthChartOptions, setGrowthChartOptions] = useState({
    chart: {
      type: "spline",
      backgroundColor: "#f9fcf5",
    },
    title: {
      text: "Growth of 10000 INR",
      align: "left",
      y: 10,
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    colors: ["#f9411f", "#0d156300"],
    xAxis: {
      type: "datetime",
      crosshair: true,
      labels: {
        format: "{value:%Y}",
        align: "center",
      },
      tickPixelInterval: 150,
      tickInterval: 365 * 24 * 3600 * 1000,
      tickmarkPlacement: "between",
      gridLineWidth: 1,
      gridLineColor: "black",
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        formatter: function () {
          return (this.value / 1000) + "k";
        },
      },
      opposite: "true",
      gridLineWidth: 1,
      gridLineDashStyle: "Dot",
      gridLineColor: "black",
      tickPixelInterval: 50,
      tickInterval: 10000,
    },
    legend: {
      align: "left",
      verticalAlign: "top",
      layout: "horizontal",
      x: 200,
      y: -45,
      itemStyle: {
        fontSize: "12px",
        fontWeight: "normal",
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      crosshairs: true,
      shared: true,
    },
    plotOptions: {
      spline: {
        marker: {
          radius: 4,
          lineColor: "#0d156300",
          lineWidth: 1,
        },
      },
      column: {
        borderWidth: 0,
      },
      series: {
        animation: false,
        dataLabels: {
          enabled: false,
          distance: 40,
          pointFormat: "₹{point.y}",
          style: {
            fontWeight: "bold",
            color: "black",
          },
        },
      },
    },
    series: [
      {
        name: "Portfolio",
        type: "spline",
        marker: {
          enabled: false,
        },
        data: [],
      },
      {
        name: "Investment Style",
        type: "column",
        data: [],
        color: '#004a9c',
      },
    ],
  });

  const [historicalChartOptions, setHistoricalChartOptions] = useState({
    chart: {
      type: "column",
      backgroundColor: "#f9fcf5",
    },
    title: {
      text: "Quarterly Performance Relative To Benchmark",
      align: "left",
      x: 20,
      y: 10,
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      type: "datetime",
      crosshair: true,
      labels: {
        format: "{value:%Y}",
        align: "center",
      },
      tickmarkPlacement: "between",
      tickPixelInterval: 150,
      tickInterval: 365 * 24 * 3600 * 1000,
      gridLineWidth: 1,
      gridLineColor: "black",
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        formatter: function () {
          return this.value;
        },
      },
      tickInterval: 4,
      opposite: true,
      gridLineWidth: 1,
      gridLineDashStyle: "Dot",
      gridLineColor: "black",
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      shared: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        groupPadding: 0.1,
        pointPlacement: -0.5,
        borderWidth: 0,
      },
      spline: {
        marker: {
          radius: 4,
          lineColor: "#666666",
          lineWidth: 1,
        },
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: "Quarterly Performance Relative To Benchmark",
        type: "column",
        data: [],
        color: "#f9411f",
      },
    ],
  });

  useEffect(() => {
    // Add defensive coding to handle potentially undefined or malformed data
    const dataPoints = props.growthSeriesData && Array.isArray(props.growthSeriesData)
      ? props.growthSeriesData
          .filter(data => data && data["@date"] && data["#text"]) // Filter out invalid entries
          .map((data) => {
            try {
              return [
                new Date(data["@date"]).getTime(),
                parseFloat(data["#text"]),
              ];
            } catch (error) {
              console.error("Error processing growth series data:", error);
              return null;
            }
          })
          .filter(point => point !== null) // Remove any failed conversions
      : [];

    const barData = props.benchMarkSeriesData && Array.isArray(props.benchMarkSeriesData)
      ? props.benchMarkSeriesData
          .filter(data => data && data["@date"] && data["#text"]) // Filter out invalid entries
          .map((data) => {
            try {
              return [
                new Date(data["@date"]).getTime(),
                parseFloat(data["#text"]),
              ];
            } catch (error) {
              console.error("Error processing benchmark series data:", error);
              return null;
            }
          })
          .filter(point => point !== null) // Remove any failed conversions
      : [];

    setGrowthChartOptions((prevOptions) => ({
      ...prevOptions,
      series: [
        {
          ...prevOptions.series[0],
          data: dataPoints,
        },
        {
          ...prevOptions.series[1],
          data: barData,
        },
      ],
    }));
  }, [props.growthSeriesData, props.benchMarkSeriesData]);

  useEffect(() => {
    const processData = () => {
      // Ensure dataset exists before processing
      const getM3Data = (dataset) => {
        if (!dataset || !Array.isArray(dataset)) {
          return [];
        }
        
        return dataset.map((entry) => {
          if (!entry) return { date: null, value: null };
          
          let returnDetail = null;
          
          if (entry.ReturnDetail) {
            if (Array.isArray(entry.ReturnDetail)) {
              returnDetail = entry.ReturnDetail.find((item) => item && item["@timePeriod"] === "M3");
            } else if (entry.ReturnDetail["@timePeriod"] === "M3") {
              returnDetail = entry.ReturnDetail;
            }
          }

          return {
            date: entry.EndDate ? new Date(entry.EndDate).getTime() : null,
            value: returnDetail && returnDetail.Value ? parseFloat(returnDetail.Value) : null,
          };
        });
      };

      // Apply defensive coding for datasets
      const benchMarkData = getM3Data(props.benchMarkHistoricalSeriesData || []);
      const historicalData = getM3Data(props.historicalSeriesData || []);

      const differences = benchMarkData
        .filter((entry) => entry && entry.date && entry.value !== null)
        .map((benchmark) => {
          // Only find if historicalData is an array
          const historicalEntry = Array.isArray(historicalData) ? 
            historicalData.find((hist) => hist && hist.date === benchmark.date) : null;

          if (historicalEntry && historicalEntry.value !== null) {
            return [benchmark.date, historicalEntry.value - benchmark.value];
          }
          return null;
        })
        .filter((entry) => entry !== null);

      return differences;
    };

    const data = processData();
    setHistoricalChartOptions((prevOptions) => ({
      ...prevOptions,
      series: [
        {
          ...prevOptions.series[0],
          data: data,
        },
      ],
    }));
  }, [props.historicalSeriesData, props.benchMarkHistoricalSeriesData])

  return (
    <React.Fragment>
      <div style={{ width: "100%", height: "400px" }}>
        <HighchartsReact highcharts={Highcharts} options={growthChartOptions} />
      </div>
      <div style={{ width: "100%", height: "400px" }}>
        <HighchartsReact highcharts={Highcharts} options={historicalChartOptions} />
      </div>
    </React.Fragment>
  );
};

export default Performance;