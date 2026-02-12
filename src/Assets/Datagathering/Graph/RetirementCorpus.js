import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { rsFilter } from "../../../common_utilities";

const RetirementCorpus = ({graphdata,colorArr}) => {
  const [chartOptions, setChartOptions] = useState({});
  useEffect(()=> {
    setChartOptions(
      {
        chart: {
          type: "bar",
        },
        title: {
          text: "",
          position : 'center'
        },
        xAxis: {
          min: 0,
          max: 1,
          categories: ["Assets Link", "Goal Amount"],
        },
        yAxis: {
          min: 0,
          title: {
            text: "Amount In (₹)",
          },
        },
        credits: {
          enabled: false,
        },
        colors: colorArr,
        legend: {
          reversed: true,
        },
        plotOptions: {
          series: {
            stacking: "normal",
          },
        },
        tooltip: {
          pointFormat: '{series.name}: <b>₹ {point.y}</b>',
          formatter(){
            var astrecom_tooltip_txt = '<span style="color:this.series.color"></span><span style="font-size:10px">'+this.x +'</span></br>'+ this.series.name +
                ':<b> ₹ ' + rsFilter((Math.abs(this.y))) + '</b>';
            if (this.y < 0) {
                astrecom_tooltip_txt = '<span style="color:this.series.color"></span><span style="font-size:10px">'+this.x +'</span></br>'+ this.series.name +
                    ':<b> ₹ (' + rsFilter(Math.abs(this.y)) + ')</b>';
            }
            return astrecom_tooltip_txt
          }
        },
        series: graphdata,
      }
    );
  }, [graphdata,colorArr]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default RetirementCorpus;
