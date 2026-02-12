import React, { useEffect } from 'react';
import Highcharts from 'highcharts';

const AssetNwGraph = ({containerId,data,total}) => {
    let assetData = data;
    
    const separateAmountAndShorthand = (inputString) => {
      const match = inputString.match(/([\d.]+)\s*([A-Za-z]+)/);

      if (match) {
        const amount = parseFloat(match[1]);
        const shorthand = match[2];

        return { amount, shorthand };
      } else {
        // Handle invalid input
        console.error("Invalid input format");
        return null;
      }
    }

    let total_amount = separateAmountAndShorthand(total);
    useEffect(() => {
        const gridSize = 140;
        const gridInnerSize = gridSize - 32;

        Highcharts.setOptions({
            colors: [
                "#00bca4",
                "#aebc1d",
                "#005165",
                "#3d8b37",
                "#9b0061",
                "#7FFFD4",
                "#FF9655",
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
                data: Object.values(assetData).map((asset) => ({
                    name: asset.name,
                    y: asset.percentage,
                })),
                
            }]
        });
    }, [data]);

    return (
        <div id={containerId}>
        </div>
    );
};

export default AssetNwGraph;
