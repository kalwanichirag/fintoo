import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment";

class ApexChartsPage extends Component {

  constructor(props) {

    super(props);

    // var data = this.props.productDetail.filter((v) => typeof v != 'string').map((v) => {
    //   return { name: v.Overview.scheme_name, data: [...v.Overview?.graph_data] };
    // });
    var data = this.props.productDetail
      .filter((v) => typeof v !== "string" && v?.Overview)
      .map((v) => {
        return {
          name: v.Overview.scheme_name || "--",
          data: (v.Overview.graph_data || [])
            .map((item) => [
              moment(item.nav_date).valueOf(),
              parseFloat(item.nav_rs),
            ]).sort((a, b) => a[0] - b[0])
        };
      });


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
          type: "datetime",
          tickAmount: 6,
        },
        tooltip: {
          x: {
            format: "dd-MM-yyyy",
          },
          y: {
            formatter: function (v) {
              return '₹ ' + v;
            },
            // value: {
            //     formatter: (seriesName, v) => {
            //       return seriesName + ' <strong>₹</strong>';
            //     },
            // },
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

      selection: "five_year",
    };
  }

  updateData(timeline) {
    this.setState({
      selection: timeline,
    });

    switch (timeline) {
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

  updateChart(limit) {
    const olddata = this.state.data;


    var newdata = olddata.map((v) => {
      return {
        ...v,
        data: v.data.filter((x) => moment(x[0]).valueOf() > limit)
      };
    });
    this.setState({ series: newdata });
  }

  componentDidMount = () => {
    this.updateData('five_year');
  }

  render() {

    return (
      <div id="chart" style={{ width: "100%" }}>
        <div
          className="toolbar"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >

          <div>
            <span style={{ float: "left", color: "gray", fontWeight: "900" }}>
            </span>
          </div>

          <button
            // style={{
            //   outline: "None",
            //   borderRadius: "8px",
            //   marginRight: "0.5rem",
            //   background: "#042b62",
            //   color: "#fff",
            //   border: "1px solid #042b62",
            // }}
            id="six_month"
            onClick={() => this.updateData("six_month")}
            className={`${this.state.selection === "six_month" ? 'active' : ''} yearbuttons`}
          >
            6M
          </button>
          <button
            // style={{
            //   outline: "None",
            //   borderRadius: "8px",
            //   marginRight: "0.5rem",
            //   background: "#042b62",
            //   color: "#fff",
            //   border: "1px solid #042b62",
            // }}
            id="one_year"
            onClick={() => this.updateData("one_year")}
            className={`${this.state.selection === "one_year" ? 'active' : ''} yearbuttons`}
          >
            1Y
          </button>
          &nbsp;
          <button

            id="three_year"
            onClick={() => this.updateData("three_year")}

            className={`${this.state.selection === "three_year" ? 'active' : ''} yearbuttons`}
          >
            3Y
          </button>
          &nbsp;
          <button

            id="five_year"
            onClick={() => this.updateData("five_year")}

            className={`${this.state.selection === "five_year" ? 'active' : ''} yearbuttons`}

          >
            5Y
          </button>
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
