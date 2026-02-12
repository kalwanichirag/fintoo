import React, { useEffect } from 'react';
import Highcharts from 'highcharts';

const LibNwGraph = ({ containerId, data, total }) => {
    let liabilityData = data;
    useEffect(() => {
        const gridSize = 140;
        const gridInnerSize = gridSize - 32;
        Highcharts.setOptions({
            colors: [
                "#588036",
                "#e1b624",
                "#042b62",
                "#f88221",
                "#f9411f",
                "#9400D3",
                "#4B0082",
                "#800000",
            ]
        });

        Highcharts.chart(containerId, {
            chart: {
                type: "pie",
                width: 150,
                height: 150,
                events: {
                    load() {
                        const chart = this,
                            x = chart.plotSizeX / 2 - chart.plotLeft / 1,
                            y = chart.plotSizeY / 2 + chart.plotTop;

                        chart.middleValue = chart.renderer.text(total, x, y)
                            .css({
                                // fontSize: '14px',
                                fontWeight : "bold",
                                textAlign : "center"
                            })
                            .add();


                        // chart.middleValueLabel.translate(x - chart.middleValueLabel.getBBox().width / 4, y + chart.middleValue.getBBox().height / 2)
                    }
                }
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: false,
                    size: gridSize,
                    innerSize: gridInnerSize,
                    dataLabels: {
                        distance: 0, // this is the default
                        format: "{point.name}<br /><b>{point.y}</b>",
                        style: {
                            fontSize: "12px",
                            display: "none",
                            fontWeight: 300,
                            textAlign: "left",
                            textOverflow: "clip",
                        }
                    },
                    pointPadding: 0, // Remove point padding
                    groupPadding: 0, // Remove group padding
                },
                series: {
                    cursor: "pointer",
                    states: {
                        hover: {
                            enabled: false
                        },
                        inactive: {
                            opacity: 1
                        }
                    }
                }
            },
            title: {
                text: "",
                align: "left",
                style: {
                    fontSize: "16px"
                }
            },
            tooltip: {
                enabled: false, // Disable the tooltip
            },
            series: [{
                data: liabilityData
            }]
        });
    }, [data]);

    return (
        <div id={containerId}></div>
    );
};

export default LibNwGraph;
