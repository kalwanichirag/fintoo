import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import moment from 'moment';


class RadialBar extends Component {
  constructor(props) {
    super(props);
    var quality_value = this.props.data.quality.value && this.props.data.quality.value > 0 && this.props.data.quality.value.toFixed(2)
    var valuation_value = this.props.data?.valuation.value && this.props.data?.valuation.value > 0 && this.props.data?.valuation.value.toFixed(2)
    var technical_value = this.props.data?.technical.value && this.props.data?.technical.value > 0 && this.props.data?.technical.value.toFixed(2)
    this.state = {
      options: {
        labels: ["Quality", "Valuation", "Technical"],
        colors: [this.props.data.quality.color == "positive"? '#00e396d9': this.props.data.quality.color == "neutral"? '#f7d81b': '#ff7f10', this.props.data.valuation.color == "positive"? '#00e396d9': this.props.data.valuation.color == "neutral"? '#f7d81b': '#ff7f10', this.props.data.technical.color == "positive"? '#00e396d9': this.props.data.technical.color == "neutral"? '#f7d81b': '#ff7f10'],
        legend: {
          show: false,
          showForSingleSeries: false,
          showForNullSeries: true,
          showForZeroSeries: true,
          position: "bottom",
          horizontalAlign: "center",
          verticallAlign: "center",
          floating: false,
          fontSize: "12px",
          fontFamily: "Helvetica, Arial",
          width: undefined,
          height: undefined,
          formatter: undefined,
          offsetX: 0,
          offsetY: 0,
          labels: {
            colors: undefined,
            useSeriesColors: false,
          },
          markers: {
            width: 12,
            height: 12,
            strokeWidth: 0,
            strokeColor: "#dadada",
            radius: 12,
            customHTML: undefined,
            onClick: undefined,
            offsetX: 0,
            offsetY: 0,
          },
          itemMargin: {
            horizontal: 20,
            vertical: 3,
          },
          onItemClick: {
            toggleDataSeries: true,
          },
          onItemHover: {
            highlightDataSeries: true,
          },
        },
        plotOptions: {
          radialBar: {
            show: false,
            size: undefined,
            inverseOrder: false,
            startAngle: 0,
            endAngle: 360,
            offsetX: 0,
            offsetY: 0,
            hollow: {
              margin: 5,
              size: '50%',
              background: 'transparent',
              image: undefined,
              imageWidth: 150,
              imageHeight: 150,
              imageOffsetX: 0,
              imageOffsetY: 0,
              imageClipped: true,
              position: 'front',
              dropShadow: {
                enabled: false,
                top: 0,
                left: 0,
                blur: 3,
                opacity: 0.5
              }
            },
            fill: {
              type: 'solid',
              colors: ['#F44336', '#E91E63', '#9C27B0']
            },
            track: {
              show: true,
              startAngle: 1,
              endAngle: 1000,
              background: "#dadada",
              strokeWidth: "100%",
              opacity: 1,
              margin: 5.7,
              dropShadow: {
                enabled: false,
                top: 0,
                left: 0,
                blur: 3,
                opacity: 0.5,
              },
            },
            dataLabels: {
              show: true,
              name: {
                show: true,
                fontSize: "1px",
                fontFamily: undefined,
                color: undefined,
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: "12px",
                fontFamily: undefined,
                color: undefined,
                offsetY: 16,
                formatter: function (val) {
                  return val + "%";
                },
              },
              total: {
                show: true,
                // fontSize: "12px",
                marginTop: "20.7px",
                label: "QVT Score",
                verticallAlign: "middle",
                color: "#373d3f",
                formatter: function (w) {},
              },
            },
          },
        },
        
      },
  
      series: [quality_value*1, valuation_value*1, technical_value*1],
    };
  }

  render() {
    return (
      <div className="donut">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="radialBar"
        />
      </div>
    );
  }
}

export default RadialBar;
