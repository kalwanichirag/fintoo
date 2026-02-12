import React from "react";
import ReactApexChart from "react-apexcharts";

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   series: this.props.productDetail.filter((v) => typeof v != 'string').map((v) => {
    //     return { name: v.Overview.scheme_name, "data": [v.Overview.return_3m, v.Overview.return_6m, v.Overview.return_1yr, v.Overview.return_3yr, v.Overview.return_5yr] };
    //   }),
    this.state = {
      series: this.props.productDetail
        .filter((v) => typeof v !== "string" && v?.Overview) // ensure object exists
        .map((v) => {
          return {
            name: v.Overview?.scheme_name || "--",
            data: [
              v.Overview?.["3M_ret"] ?? 0,
              v.Overview?.["6M_ret"] ?? 0,
              v.Overview?.["1Y_ret"] ?? 0,
              v.Overview?.["3Y_ret"] ?? 0,
              v.Overview?.["5Y_ret"] ?? 0,
            ],
          };
        }),

      options: {
        chart: {
          type: "bar",
          height: 350,
          toolbar: {
            show: false,
          },

        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            // borderRadius: 10,
            // endingShape: "rounded",
          },
          colors: ['#f7d81b', '#ff7f10', '#89b23b']
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 25,
          colors: ["transparent"],
        },

        xaxis: {
          categories: [
            "3 Month",
            "6 Month",
            "1 Year",
            "3 Years",
            "5 Years",
          ],
        },
        yaxis: {
          title: {
            text: "Returns in %",
          },
        },
        fill: {
          // opacity: 1,
          type: 'solid',
          // colors: ['#F44336', '#E91E63', '#9C27B0']
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " %";
            },
          },
        },
        legend: {
          position: 'top',
          onItemHover: {
            highlightDataSeries: false
          },
          onItemClick: {
            toggleDataSeries: false
          },
        }
      },
    };
  }

  render() {
    return (
      <div id="bargraph-compare" className="bar" style={{ marginTop: "2rem" }}>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={350}
        />
      </div>
    );
  }
}

export default ApexChart;