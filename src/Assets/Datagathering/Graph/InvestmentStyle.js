import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/heatmap"; 

const InvestmentStyle = (props) => {
  function getPointCategoryName(point, dimension) {
    var series = point.series,
      isY = dimension === 'y',
      axis = series[isY ? 'yAxis' : 'xAxis'];
    return axis.categories[point[isY ? 'y' : 'x']];
  }

  const styleBoxData = props.styleBoxData;

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'heatmap',
      marginTop: 40,
      marginBottom: 80,
      plotBorderWidth: 1
    },
    title: {
      text: 'Investment Style'
    },
    xAxis: {
      categories: ['Value', 'Blend', 'Growth']
    },
    yAxis: {
      categories: ['Large', 'Mid', 'Small'],
      title: 'Size',
      reversed: true
    },
    accessibility: {
      point: {
        descriptionFormatter: function (point) {
          var ix = point.index + 1,
            xName = getPointCategoryName(point, 'x'),
            yName = getPointCategoryName(point, 'y'),
            val = point.value;
          return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
        }
      }
    },
    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
      maxColor: Highcharts.getOptions().colors[0]
    },
    legend: {
      symbolWidth: 350
    },
    tooltip: {
      formatter: function () {
        return '<b>' + getPointCategoryName(this.point, 'x') + '</b>  <br><b>' +
          this.point.value + '</b>  on <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
      }
    },
    series: [{
      name: 'Investment Style',
      borderWidth: 1,
      data: [], // Leave it empty for now, we'll update it using investmentstyleGraphData
      dataLabels: {
        enabled: true,
        color: '#000000'
      }
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          yAxis: {
            labels: {
              formatter: function () {
                return this.value.charAt(0);
              }
            }
          }
        }
      }]
    }
  });

  const [investmentstyleGraphData, setInvestmentstyleGraphData] = useState([
    [], [], [], // Three rows with three columns each
    [], [], [], // to match the structure of styleBoxData
    [], [], []
  ]);

  useEffect(() => {
    const mapStyleBoxDataToGraphData = () => {
      const graphData = [
        [], [], [], // Three rows with three columns each
        [], [], [], // to match the structure of styleBoxData
        [], [], []
      ];

      styleBoxData?.forEach((val) => {
        const key = parseInt(val["@type"]) - 1; // Convert @type to a numeric key (0-based)

        switch (key) {
          case 0:
            graphData[0] = [0, 0, Math.round(parseFloat(val['#text']))];
            break;
          case 1:
            graphData[3] = [1, 0, Math.round(parseFloat(val['#text']))];
            break;
          case 2:
            graphData[6] = [2, 0, Math.round(parseFloat(val['#text']))];
            break;
          case 3:
            graphData[1] = [0, 1, Math.round(parseFloat(val['#text']))];
            break;
          case 4:
            graphData[4] = [1, 1, Math.round(parseFloat(val['#text']))];
            break;
          case 5:
            graphData[7] = [2, 1, Math.round(parseFloat(val['#text']))];
            break;
          case 6:
            graphData[2] = [0, 2, Math.round(parseFloat(val['#text']))];
            break;
          case 7:
            graphData[5] = [1, 2, Math.round(parseFloat(val['#text']))];
            break;
          case 8:
            graphData[8] = [2, 2, Math.round(parseFloat(val['#text']))];
            break;
        }
      });

      setInvestmentstyleGraphData(graphData);

      // Update chartOptions here using graphData
      setChartOptions((prevChartOptions) => ({
        ...prevChartOptions,
        series: [{
          ...prevChartOptions.series[0],
          data: graphData,
        }],
      }));
    };

    mapStyleBoxDataToGraphData();
  }, [styleBoxData]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default InvestmentStyle;