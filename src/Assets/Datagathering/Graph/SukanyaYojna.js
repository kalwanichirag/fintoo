import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";

function Portfolio(props) {
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    const ssyGraphdata = props.ssyGraphdata;

    // Reformat the data into the required format for the pie chart
    const formattedData = ssyGraphdata.map(item => ({
      name: item.name,
      y: item.y,
    }));

    setChartOptions({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
        marginTop: 10,
        width: 500, 
        height: 450,
        backgroundColor: "transparent",
      },
      title: {
        text: "",
      },
      tooltip: {
        pointFormat: "{series.name}: {point.y:,.0f}",
      },
      colors: ["#588036", "#fead1b"],
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            allowPointSelect: true,
            cursor: 'pointer',
            enabled: true,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>',
              connectorColor: ["#588036", "#fead1b"]
            }
          }
        },
      },
      series: [
        {
          name: "Share",
          innerSize: "0%",
          data: formattedData,
        },
      ],
      credits: {
        enabled: false,
      },
      // responsive: {
      //   rules: [
      //     {
      //       condition: {
      //         // maxWidth: 600,
      //       },
      //       chartOptions: {
      //         legend: {
      //           align: "center",
      //           verticalAlign: "bottom",
      //           layout: "horizontal",
      //         },
      //       },
      //     },
      //   ],
      // },
    });
  }, [props.ssyGraphdata]);

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