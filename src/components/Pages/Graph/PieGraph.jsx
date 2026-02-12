import React from "react";
import ReactApexChart from "react-apexcharts";

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

   
    this.state = {
      // series: [props.debt, props.points.equity, props.points.others],
      series: [ props.productDetail.asset_allocation.equity,props.productDetail.asset_allocation.debt, props.productDetail.asset_allocation.others],

      options: {
        
        plotOptions: {
          pie: {
            donut: {
              size: '30%'
            }
          }
        },
        chart: {

          type: "donut",
          toolbar: {
            show: false,
          },
          dataLabels: {
            show: false,
            distributed: false,
          },
        },
        labels: ['Equity',
          'Debt',
          'Cash'
        ],
        legend: {
          position: "bottom",
          onItemHover: {
            highlightDataSeries: false
          },
          onItemClick: {
            toggleDataSeries: false
          },
        },

        dataLabels: {
          enabled: false,
        },
      },
    };
  }
  componentDidMount() {
    // this.setState({});
  }
  render() {
    
    return (
      <div id="pie-compare" className="bar" style={{ marginTop: "2rem" }}>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="donut"
        />
      </div>
    );
  }
}

export default ApexChart;
