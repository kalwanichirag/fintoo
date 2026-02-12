import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { rsFilter } from "../../../common_utilities";

const MedicalInsurance = (props) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'column'
    },
    title: {
      text: 'Medical Insurance'
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
    credits: {
      enabled: false
    },
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

  useEffect(() => {
    const medicalInsuranceData = props.medicalgraphdata;

    if (medicalInsuranceData.length > 0) {
      const idealCoverObject = medicalInsuranceData.find(item => item.name === "Ideal Health Cover");
      const existingCoverObject = medicalInsuranceData.find(item => item.name === "Existing Personal Cover");
      const shortfallObject = medicalInsuranceData.find(item => item.name === "shortfall");
      const surplusObject = medicalInsuranceData.find(item => item.name === "surplus");

      const idealCover = idealCoverObject ? idealCoverObject.total : 0;
      const existingCover = existingCoverObject ? existingCoverObject.total : 0;
      const surplusOrShortfall = shortfallObject ? shortfallObject.total : surplusObject ? surplusObject.total : 0;

      const surplusGraphColor = surplusOrShortfall < 0 ? ['#588036', '#e1b624', '#f9411f'] : ['#588036', '#e1b624', '#042b62'];

      setChartOptions({
        ...chartOptions,
        colors: surplusGraphColor,
        tooltip: {
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
        series: [
          {
            name: 'Ideal Health Cover',
            data: [idealCover]
          },
          {
            name: 'Existing Personal Cover',
            data: [existingCover]
          },
          {
            name: shortfallObject ? 'shortfall' : 'surplus',
            data: [surplusOrShortfall]
          }
        ]
      });
    }
  }, [props.medicalgraphdata]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default MedicalInsurance;