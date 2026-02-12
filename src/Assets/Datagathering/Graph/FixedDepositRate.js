import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import moment from "moment";

class FixedDepositRate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "basic-bar",
          toolbar: { show: false },
          // title : "Fixed deposit"
        },
        xaxis: {
          categories: ["Bajaj Finance"],
          // labels: {
          //   show: false,
          // },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      colors: ["#5D62B5", "#29C3BE", "#F2726F"],
      series: [
        {
          name: "series-1",
          data: [7.1],
        },
        
      ],
      title: {
        text: "Fixed deposit",
        align: "Center"
      },
    };
  }

  render() {
    return (
      <div className="mixed-chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          width="500"
        />
      </div>
    );
  }
}

export default FixedDepositRate;
