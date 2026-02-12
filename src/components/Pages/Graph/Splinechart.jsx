import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import moment from "moment";

const numberFormat = (value) =>
  new Intl.NumberFormat("en-IN", {
    // style: 'currency',
    currency: "INR",
  }).format(value);

class ApexChartsPage extends Component {
  constructor(props) {
    // const ApexChart = window.ApexCharts;
    super(props);
    // var data = [{ name: "NAV", data: [...this.props.Overview?.graph_data] }];

    const seriesData = (this.props.Overview?.graph_data).map((point) => ({
      x: point.nav_date,   // date string
      y: point.nav_rs      // number
    }));
    
    var data = [{
      name: "NAV", data: seriesData
    }];

    this.state = {
      data: data,
      series: data,
      options: {
        chart: {
          id: "area-datetime",
          type: "area",
          width: "100%",
          height: 350,
          toolbar: { show: false },

          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        annotations: {
          yaxis: [
            {
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
              borderColor: "#999",

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
          type: "datetime",
          tickAmount: 6,
        },
        tooltip: {
          x: {
            format: "dd-MM-yyyy",
          },
        },
      },

      selection: "six_month",
    };
  }

  componentDidMount() {
    this.updateData("six_month");
  }

  updateData(timeline) {
    this.setState(
      {
        selection: timeline,
        series: [],
      },
      function () {
        switch (timeline) {
          case "three_month":
            this.updateChart(moment().subtract(3, "month").valueOf());
            break;
          case "six_month":
            this.updateChart(moment().subtract(6, "month").valueOf());
            break;
          case "one_year":
            this.updateChart(moment().subtract(1, "year").valueOf());
            break;
          case "three_year":
            this.updateChart(moment().subtract(3, "year").valueOf());
            break;
          case "five_year":
            this.updateChart(moment().subtract(5, "year").valueOf());
            break;
          default:
        }
      }
    );
  }

  updateChart(limit) {
    const olddata = this.state.data;

    // var limit = moment().subtract(3, "year").valueOf();
    var newdata = olddata.map((v) => {
      return {
        ...v,
        data: v.data.filter((x) => moment(x[0]).valueOf() > limit),
      };
    });
    this.setState({ series: newdata });
  }

  render() {
    return (
      <div id="chart" className="Spline custom-spline-chart">
        <div
          className="toolbar"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <div
              className="d-block d-md-none mobile-lines"
              style={{ float: "left", color: "gray", fontWeight: "900" }}
            >
              <div className="pt-0">
                Date :{" "}
                {moment(this.props.Overview.navdate).format("DD/MM/YYYY")}{" | "}
                NAV : {numberFormat(this.props.Overview.navrs)}{" "}
              </div>

            </div>

            <div className="d-none d-md-block">
              <span style={{ float: "left", color: "gray", fontWeight: "900" }}>
                Date :
                {this.props.Overview.navdate ? moment(this.props.Overview?.navdate).format("DD/MM/YYYY") : moment(this.props.Overview?.scheme_inception_date).format("DD/MM/YYYY")}
                <span className="DiffLine"></span> NAV :{" "}
                {numberFormat(this.props.Overview.navrs)}{" "}
              </span>
            </div>
          </div>
          <div>
            <button
              onClick={() => this.updateData("three_month")}
              className={`chart-button-st ${this.state.selection == "three_month" ? "active" : ""
                }`}
            >
              3M
            </button>
            <button
              onClick={() => this.updateData("six_month")}
              className={`chart-button-st ${this.state.selection == "six_month" ? "active" : ""
                }`}
            >
              6M
            </button>
            <button
              onClick={() => this.updateData("one_year")}
              className={`chart-button-st ${this.state.selection == "one_year" ? "active" : ""
                }`}
            >
              1Y
            </button>
            <button
              onClick={() => this.updateData("three_year")}
              className={`chart-button-st ${this.state.selection == "three_year" ? "active" : ""
                }`}
            >
              3Y
            </button>
            <button
              onClick={() => this.updateData("five_year")}
              className={`chart-button-st ${this.state.selection == "five_year" ? "active" : ""
                }`}
            >
              5Y
            </button>
          </div>
        </div>

        <div id="chart-timeline">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    );
  }
}

export default ApexChartsPage;



