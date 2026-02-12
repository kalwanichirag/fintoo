import React, { useState } from "react";
import { render } from "react-dom";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { rsFilter } from "../../../common_utilities";

const TotalInvestablee = (props) => {
  const total_investable_next_year = props.nextYearTotalInvestable;
  const currentYear = new Date().getFullYear() +1;
  if (Object.keys(total_investable_next_year).length > 0) {
    const idealCoverObject = total_investable_next_year.find(item => item.name === "Total Savings");
    const idealCoverObjectt = total_investable_next_year.find(item => item.name === "Total Investable Shortfall" || item.name === "Total Investable Surplus");
    const idealCoverObjecttt = total_investable_next_year.find(item => item.name === "Existing Insurance & Investment Commitment");

    let gross_inflow;
    let gross_outflow;
    let savings_or_deficeit;
    let text;
    let heading_lable;

    if (idealCoverObjectt) {
      text = total_investable_next_year.find(item => item.name === "Total Investable Shortfall" || item.name === "Total Investable Surplus").name;
    }

    if (idealCoverObject) {
      gross_inflow = idealCoverObject.y;
    }

    if (idealCoverObjectt) {
      savings_or_deficeit = idealCoverObjectt.y;
    }

    if (idealCoverObjecttt) {
      gross_outflow = idealCoverObjecttt.y;
    }

    var surplus_graphcolor = ['#588036', '#e1b624', '#042b62'];
    heading_lable = "Surplus"
    if (text == "Total Investable Shortfall") {
      surplus_graphcolor = ['#588036', '#e1b624', '#f9411f'];
      heading_lable = "Shortfall"
    }

    const [chartOptions, setChartOptions] = useState({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Total Investable '+heading_lable+' ('+currentYear+')'
      },
      xAxis: {
        categories: ['']
      },
      yAxis: {
        labels: {
          formatter: function () {
            return this.axis.defaultLabelFormatter.call(this);
          }
        },
        title: {
          text: 'Amount in (₹)'
        }
      },
      colors: surplus_graphcolor,
      credits: {
        enabled: false
      },
      tooltip: {
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>₹{point.y}</b><br />',
        // shared: false

        formatter: function () {
          var medical_tooltip_txt = '<span style="color:this.series.color"></span>' + this.series.name +
            ':<b> ₹ ' + rsFilter((Math.abs(this.y))) + '</b>';
          if (this.y < 0) {
            medical_tooltip_txt = '<span style="color:this.series.color"></span>' + this.series.name +
              ':<b> ₹ (' + rsFilter((Math.abs(this.y))) + ')</b>';
          }
          return medical_tooltip_txt
        }
      },
      legend: {
        // layout: 'horizontal',
        // align: 'center',
        // verticalAlign: 'bottom',
        itemMarginTop: 10,
        itemMarginBottom: 10,
      },
      series: [{
        name: 'Total Savings',
        data: [gross_inflow]
      }, {
        name: 'Existing Insurance & Investment Commitment',
        data: [gross_outflow]
      }, {
        name: [text],
        data: [savings_or_deficeit]
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 600
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal'
            }
          }
        }]
      }
    });

    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    );
  };
}

export default TotalInvestablee;
