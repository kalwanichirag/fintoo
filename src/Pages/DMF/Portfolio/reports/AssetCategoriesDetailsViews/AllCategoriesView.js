import React from "react";
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/variable-pie';
import ReportActionsComponent from "../ReportsComponents/ReportActionsComponent";

const options = {
    exporting: { enabled: false },
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        // width: 400,
    },
    credits: {
        enabled: false
    },
    title: {
        text: '',
    },
    tooltip: {
        enabled: false
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },

    plotOptions: {
        pie: {
            borderWidth: 0,
            dataLabels: {
                connectorWidth: 0,
                distance: '10%',
                enabled: true,
            }
        },
        series: {
            enableMouseTracking: false,
            shadow: false,
            animation: false
        }
    },

    series: [{
        enableMouseTracking: false,
        shadow: false,
        animation: false,
        innerSize: '60%',
        dataLabels: {
            useHTML: true,
            format: '<span style="text-align: center;"><span style="color:rgb(153, 153, 153)"> {point.name} </span><br /> <span><span style="color:#042b62margin-left:8px">{point.y}%</span></span></span>'
        },
        data: [{
            name: 'Stock',
            y: 14,
        }, {
            name: 'FD / Bonds',
            y: 12.5,
        }, {
            name: 'Alternate',
            y: 8.6,

        }, {
            name: 'Gold',
            y: 10.5,

        }, {
            name: 'Liquid',
            y: 9.18,
        }, {
            name: 'Govt. Schemes',
            y: 9.1,
        }, {
            name: 'Real Estate',
            y: 22,
        }, {
            name: 'Mutual Fund',
            y: 18,
        }],
        colors: [
            '#2e86ad', '#60c5f2', '#9ad2eb', '#afdff5'
            , '#def4fe', '#bde9fd',
            '#28a6df', '#0a5d82'
        ]
    }]
};


function AllCategoriesView(props) {


    return (
        <div >
            <br />
            <div className={`${Styles.ReportLabel}`}>{props.selectedCategoryName}</div>
            <br />
            <div className={`${Styles.allCategoriesDataContainer}`}>
                <div className={`${Styles.invTypeBoxContainer}`}>
                    <div className={`${Styles.inlineInvTypeBox}`}>
                        <div className={`${Styles.inlineInvTypeBoxContainer}`}>
                            <div className={`${Styles.inlineInvTypeIndicatorContainer}`}>
                                <div className={`${Styles.inlineInvTypeIndicator}`} style={{ backgroundColor: '#0a5d82' }}></div>
                            </div>
                            <div>
                                <div className={`${Styles.textGrayLight1}`}>Mutual Fund</div>
                                <div className={`${Styles.textBlackBold1}`}>&#8377; 12,05,680,000.00 <span className={`${Styles.textLight1}`}>(18%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${Styles.inlineInvTypeBox}`}>
                        <div className={`${Styles.inlineInvTypeBoxContainer}`}>
                            <div className={`${Styles.inlineInvTypeIndicatorContainer}`}>
                                <div className={`${Styles.inlineInvTypeIndicator}`} style={{ backgroundColor: '#2e86ad' }}></div>
                            </div>
                            <div>
                                <div className={`${Styles.textGrayLight1}`}>Stocks</div>
                                <div className={`${Styles.textBlackBold1}`}>&#8377; 12,05,680,000.00 <span className={`${Styles.textLight1}`}>(18%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${Styles.inlineInvTypeBox}`}>
                        <div className={`${Styles.inlineInvTypeBoxContainer}`}>
                            <div className={`${Styles.inlineInvTypeIndicatorContainer}`}>
                                <div className={`${Styles.inlineInvTypeIndicator}`} style={{ backgroundColor: '#60c5f2' }}></div>
                            </div>
                            <div>
                                <div className={`${Styles.textGrayLight1}`}>FD/Bonds</div>
                                <div className={`${Styles.textBlackBold1}`}>&#8377; 12,05,680.00 <span className={`${Styles.textLight1}`}>(18%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${Styles.inlineInvTypeBox}`}>
                        <div className={`${Styles.inlineInvTypeBoxContainer}`}>
                            <div className={`${Styles.inlineInvTypeIndicatorContainer}`}>
                                <div className={`${Styles.inlineInvTypeIndicator}`}
                                    style={{ backgroundColor: '#bde9fd', border: '1px solid #9AD2EB' }}></div>
                            </div>
                            <div>
                                <div className={`${Styles.textGrayLight1}`}>Govt. Schemes</div>
                                <div className={`${Styles.textBlackBold1}`}>&#8377; 12,05,680.00 <span className={`${Styles.textLight1}`}>(18%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${Styles.inlineInvTypeBox}`}>
                        <div className={`${Styles.inlineInvTypeBoxContainer}`}>
                            <div className={`${Styles.inlineInvTypeIndicatorContainer}`}>
                                <div className={`${Styles.inlineInvTypeIndicator}`} style={{ backgroundColor: '#28a6df' }}></div>
                            </div>
                            <div>
                                <div className={`${Styles.textGrayLight1}`}>Real Estate</div>
                                <div className={`${Styles.textBlackBold1}`}>&#8377; 12,05,680.00 <span className={`${Styles.textLight1}`}>(18%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${Styles.inlineInvTypeBox}`}>
                        <div className={`${Styles.inlineInvTypeBoxContainer}`}>
                            <div className={`${Styles.inlineInvTypeIndicatorContainer}`}>
                                <div className={`${Styles.inlineInvTypeIndicator}`} style={{ backgroundColor: '#afdff5' }}></div>
                            </div>
                            <div>
                                <div className={`${Styles.textGrayLight1}`}>Gold</div>
                                <div className={`${Styles.textBlackBold1}`}>&#8377; 12,05,680.00 <span className={`${Styles.textLight1}`}>(18%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${Styles.inlineInvTypeBox}`}>
                        <div className={`${Styles.inlineInvTypeBoxContainer}`}>
                            <div className={`${Styles.inlineInvTypeIndicatorContainer}`}>
                                <div className={`${Styles.inlineInvTypeIndicator}`} style={{ backgroundColor: '#0a5d82' }}></div>
                            </div>
                            <div>
                                <div className={`${Styles.textGrayLight1}`}>Alternate</div>
                                <div className={`${Styles.textBlackBold1}`}>&#8377; 12,05,680.00 <span className={`${Styles.textLight1}`}>(18%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${Styles.inlineInvTypeBox}`}>
                        <div className={`${Styles.inlineInvTypeBoxContainer}`}>
                            <div className={`${Styles.inlineInvTypeIndicatorContainer}`}>
                                <div className={`${Styles.inlineInvTypeIndicator}`}
                                    style={{ backgroundColor: '#def4fe', border: '1px solid #9AD2EB' }}></div>
                            </div>
                            <div>
                                <div className={`${Styles.textGrayLight1}`}>Liquid</div>
                                <div className={`${Styles.textBlackBold1}`}>&#8377; 12,05,680.00 <span className={`${Styles.textLight1}`}>(18%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div >
                    <div style={{ textAlign: 'center' }}>
                        <div className={`${Styles.textGrayLight1}`}>Portfolio Value</div>
                        <div className={`${Styles.textBlackBold2}`}>&#8377; 7,64,000</div>
                    </div>
                    <div style={{ width: '100%', height: '100%' }}>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={options}
                        />
                    </div>
                </div>
            </div>
            <br />
            <ReportActionsComponent />
        </div>
    );
}

export default AllCategoriesView;
