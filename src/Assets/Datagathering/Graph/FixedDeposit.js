import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import moment from "moment";

class FixedDeposit extends Component {
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
        colors: ["#588036"],
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
      },
   
      series: [
        {
          name: "Bajaj Finance",
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

export default FixedDeposit;
