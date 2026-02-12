import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

class ApexChart extends Component {


  constructor(props) {
    super(props);
    // this.onScreenChange = this.onScreenChange.bind(this);

    this.state = {
      // graphWidth: 409,
      series: [
        {
          name: [""],
          data: [this.props.data.broker_buy_1Y, this.props.data.broker_hold_1Y, this.props.data.broker_sell_1Y],
        },
      ],
      options: {
        chart: {
          type: "bar",
          // width: "100%",
          height: 430,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            distributed: true,
            horizontal: true,
            borderRadius: 20,
            dataLabels: {
              position: "top",
            },
          },
        },
        legend: {
          show: false,
        },
        dataLabels: {
          enabled: false,
          offsetX: -6,
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        stroke: {
          show: true,
          curve: "stepline",
          width: 1,
          colors: ["#fff"],
        },
        fill: {
          type: "solid",
          colors: ["#00e396d9", "#f7d81b", "#ff7f10"],
        },
        tooltip: {
          shared: true,
          intersect: false,
          offsetX: 0,
        },
        xaxis: {
          categories: ["Strong Buy", "Hold", "Strong Sell"],
          show: false,
        },
      },
    };
  }

  componentDidMount() {
    this.onScreenChange();
    window.addEventListener('resize', this.onScreenChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onScreenChange);
  }

  onScreenChange = () => {
    this.setState({count: this.state.count + 1});
  }

  render() {
    return (
      <div id="chart SlackChart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
        />
      </div>
    );
  }
}

export default ApexChart;
