import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

class BarNegitive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 1,
    
      series: [{
        name: 'Broker Target Up',
        color : "#00e396d9",
        data: [this.props.data.broker_targetup_1M,this.props.data.broker_targetup_3M,this.props.data.broker_targetup_6M,]
      }, {
        name: 'Broker Target Down',
        color : "#ff7f10",
        data: [Math.abs(this.props.data.broker_targetdown_1M),Math.abs(this.props.data.broker_targetdown_3M),Math.abs(this.props.data.broker_targetdown_6M),]
      }, ],
      options: {
        
        chart: {
          type: 'bar',
          height : 350,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            borderRadius: 16,
            
          },
        },
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          title: {
            text: "Broker Target",
          },
          // showAlways : 'false',
          labels: {
            formatter: function (y) {
              return y.toFixed(0) + "";
            },
          },
        },
        xaxis: {
          // type: 'datetime',
          categories: ["1 M", "3 M", "6 M"],
          labels: {
            rotate: -90,
          },
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
    //
    return (
      <div id="chart" style={{marginTop: "-4rem"}}>
       <ReactApexChart key={`bn-${this.state.count}`} options={this.state.options} series={this.state.series} type="bar" />
      </div>
    );
  }
}

export default BarNegitive;
