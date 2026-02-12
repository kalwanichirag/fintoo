import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from 'apexcharts'
class ApexChartsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
      
        {
          name: "Small Cap",
          data: [
            {
              x: "Asset Allocation",
              y: [
                new Date(1789, 3, 30).getTime(),
                new Date(1797, 2, 4).getTime(),
              ],
            },
          ],
        },
        {
          name: "Mid Cap",
          data: [
            {
              x: "",
              y: [
                new Date(1797, 2, 4).getTime(),
                new Date(1801, 2, 4).getTime(),
              ],
            },
          ],
        },
        {
          name: "Large Cap",
          data: [
            {
              x: "Asset Allocation",
              y: [
                new Date(1801, 2, 4).getTime(),
                new Date(1809, 2, 4).getTime(),
              ],
            },
          ],
        },
        // Aaron Burr
      ],
      options: {
        chart: {
          height: 100,
          type: "rangeBar",
          toolbar: { show: false },
            stroke: {
            show : false
          },
          // events:  {
          //   click : (event)=> {
          //     console.log("here", event)
          //   },
          // }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "50%",
            rangeBarGroupRows: true,
            stroke: {
              show : false
            },
            // borderRadius: 16,
            events:  {
              click : function(event) {
                
              },
            }
            // borderRadiusOnAllStackedSeries: true
          },
        },
        colors: ["#008FFB", "#00E396", "#FEB019"],
        fill: {
          type: "solid",
        },
        xaxis: {
          axisBorder: {
            show: false
          },
          labels: {
            show: false,
          },
        },
        yaxis: { show: false },
        legend: {
          onItemClick: {
            toggleDataSeries: false
          },
          position: "bottom",
          events:  {
            click : function(event){

            },
          }
        },
        grid: {
          show: false
        },
        tooltip: {
            y: {
              formatter: function(value, opts) {
                  const sum = opts.series[0].reduce((a, b) => a + b, 0);
                  const percent = (value / sum) * 100;
                  return percent.toFixed(0) + '%'
              },
            },
        }
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="rangeBar"
          height={180}
        />
      </div>
    );
  }
}

export default ApexChartsPage;
