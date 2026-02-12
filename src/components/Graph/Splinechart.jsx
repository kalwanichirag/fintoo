import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import moment from "moment";
class ApexChartsPage extends Component {
  constructor(props) {
    // const ApexChart = window.ApexCharts;
    super(props);

    this.state = {
      series: [],
      options: {},

      selection: "six_months",
    };
  }

  componentDidMount() {
    this.onScreenChange();
    window.addEventListener("resize", this.onScreenChange);

    var data1 = [...this.props.data].map((v) => v[1]);
    var data2 = [...this.props.data].map((v) => moment(v[0]).format("h:mm A"));
    
    this.setState({
      series: [
        {
          name: this.props.title,
          data: data1,
        },
      ],
      options: {
        chart: {
          id: "area-datetime",
          type: "area",
          // width: "100%",
          height: 350,
          toolbar: { show: false },
          zoom: {
            autoScaleYaxis: true,
          },
        },
        annotations: {
          yaxis: [
            {
              y: 30,
              borderColor: "#999",
              label: {
                show: true,
                text: "",
                style: {
                  color: "#fff",
                  background: "#00E396",
                },
              },
            },
          ],
          xaxis: [
            {
              x: new Date().getTime(),
              borderColor: "#999",
              yAxisIndex: 0,
              label: {
                show: true,
                text: "",
                style: {
                  color: "#fff",
                  background: "#775DD0",
                },
              },
            },
          ],
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
          style: "hollow",
        },
        xaxis: {
          categories: data2,
        },
        tooltip: {
          x: {
            format: "dd-MM-yyyy",
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100],
          },
        },
      },
    });
  }

  // updateData(timeline) {
  //   this.setState({
  //     selection: timeline,
  //   });

  //   switch (timeline) {
  //     case "one_day":
  //       ApexCharts.exec(
  //         "area-datetime",
  //         "zoomX",
  //         // new Date("28 Jan 2022").getTime(),
  //         moment().subtract(5, "minutes").valueOf(),
  //         moment().valueOf()
  //         // new Date("27 Feb 2022").getTime()
  //       );
  //       break;
  //     case "one_year":
  //       ApexCharts.exec(
  //         "area-datetime",
  //         "zoomX",
  //         moment().subtract(1, "year").valueOf(),
  //         moment().valueOf()
  //       );
  //       break;
  //     case "three_year":
  //       ApexCharts.exec(
  //         "area-datetime",
  //         "zoomX",
  //         moment().subtract(3, "year").valueOf(),
  //         moment().valueOf()
  //       );
  //       break;
  //     case "five_year":
  //       ApexCharts.exec(
  //         "area-datetime",
  //         "zoomX",
  //         moment().subtract(5, "year").valueOf(),
  //         moment().valueOf()
  //       );
  //       break;
  //   }
  // }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onScreenChange);
  }

  onScreenChange = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {   
    return (
      <>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="area"
        />
      </>
    );
  }
}

export default ApexChartsPage;
