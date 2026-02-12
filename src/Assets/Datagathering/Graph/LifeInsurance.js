import React, { useState } from "react";
import { render } from "react-dom";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { rsFilter } from "../../../common_utilities";

const LifeInsurance = (props) => {
    const life_insurance_graph = props.lifeInsurancegraphdata;
    const idealCoverObject = life_insurance_graph.find(item => item.name === "Ideal Cover");
    const idealCoverObjectt = life_insurance_graph.find(item => item.name === "Additional Insurance Required");
    const idealCoverObjecttt = life_insurance_graph.find(item => item.name === "Existing Cover");

    let ideal_cover;
    let existing_cover;
    let additional_insurance_required;

    if (idealCoverObject) {
        ideal_cover = idealCoverObject.y;
    }

    if (idealCoverObjectt) {
        additional_insurance_required = idealCoverObjectt.y;
    }

    if (idealCoverObjecttt) {
        existing_cover = idealCoverObjecttt.y;
    }

    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Life Insurance'
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
        colors: ["#3d8b37", "#e1b624d9", "#196B7C"],
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
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            itemMarginTop: 10,
            itemMarginBottom: 10,
        },
        series: [{
            name: 'Ideal Cover',
            data: [ideal_cover]
        }, {
            name: 'Existing Cover',
            data: [existing_cover]
        }, {
            name: 'Additional Insurance Required',
            data: [additional_insurance_required]
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

export default LifeInsurance;
