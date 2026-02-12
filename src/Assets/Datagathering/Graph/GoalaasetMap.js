import React, { useState,useEffect } from "react";
import { render } from "react-dom";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { rsFilter } from "../../../common_utilities";

const GoalaasetMap = (props) => {
    
    const [chartOptions, setChartOptions] = useState({
        chart: {
        type: 'bar',
        renderTo: 'RecommgoalAssetMapping_' + props.id,
        style: {
            fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif'
        },
        width: 850
    },
    colors: props.colorArr,
    title: {
        text: 'Goal Asset Mapping Graph'
    },
    xAxis: {
        categories: props.x_categories,
        minPadding: 0,
        maxPadding: 0
    },yAxis: {
        min: 0,
        title: {
            text: 'Amount in (₹)'
        }
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
    credits: {
        enabled: false
    },
    series:props.y_categories,
    
    plotOptions: {
      series: {
          // animation: false,
          stacking: 'normal'
      },
      
    },
    
    lang: {
        thousandsSep: ',',
        numericSymbols: [" k", " M", " B", " T", "P", "E"]
    }


    })
    
    
//   useEffect(()=>{
    
//     // console.log('yCategories_new_array',yCategories_new_array);
//     setChartOptions({
//         chart: {
//         type: 'bar',
//         renderTo: 'RecommgoalAssetMapping_' + props.id
//     },
//     colors: props.colorArr,
//     title: {
//         text: 'Goal Asset Mapping Graph'
//     },
//     xAxis: {
//         categories: props.x_categories
//     },yAxis: {
//         min: 0,
//         title: {
//             text: 'Amount in (₹)'
//         }
//     },
//     tooltip: {
//         pointFormat: '{series.name}: <b>₹ {point.y}</b>'
//     },
//     credits: {
//         enabled: false
//     },
//     series:props.y_categories,
//     plotOptions: {
//       series: {
//           // animation: false,
//           stacking: 'normal'
//       },
//     //   formatter: function () {
//     //       var astrecom_tooltip_txt = '<span style="color:this.series.color"></span>' + this.series.name +
//     //           ':<b> ₹ ' + $filter('rs')(Math.abs(this.y)) + '</b>';
//     //       if (this.y < 0) {
//     //           astrecom_tooltip_txt = '<span style="color:this.series.color"></span>' + this.series.name +
//     //               ':<b> ₹ (' + $filter('rs')(Math.abs(this.y)) + ')</b>';
//     //       }
//     //       return astrecom_tooltip_txt
//     //   }
//     },


//     })
//     // console.log('croooo',{
//     //     chart: {
//     //     type: 'bar',
//     //     renderTo: 'RecommgoalAssetMapping_' + props.id
//     // },
//     // colors: props.colorArr,
//     // title: {
//     //     text: 'Goal Asset Mapping Graph'
//     // },
//     // xAxis: {
//     //     categories: props.x_categories
//     // },yAxis: {
//     //     min: 0,
//     //     title: {
//     //         text: 'Amount in (₹)'
//     //     }
//     // },
//     // tooltip: {
//     //     pointFormat: '{series.name}: <b>₹ {point.y}</b>'
//     // },
//     // credits: {
//     //     enabled: false
//     // },
//     // series:yCategories_new_array,
//     // plotOptions: {
//     //   series: {
//     //       // animation: false,
//     //       stacking: 'normal'
//     //   },
//     // //   formatter: function () {
//     // //       var astrecom_tooltip_txt = '<span style="color:this.series.color"></span>' + this.series.name +
//     // //           ':<b> ₹ ' + $filter('rs')(Math.abs(this.y)) + '</b>';
//     // //       if (this.y < 0) {
//     // //           astrecom_tooltip_txt = '<span style="color:this.series.color"></span>' + this.series.name +
//     // //               ':<b> ₹ (' + $filter('rs')(Math.abs(this.y)) + ')</b>';
//     // //       }
//     // //       return astrecom_tooltip_txt
//     // //   }
//     // },


//     // })
//   },[props.activeIndex])
 
  return (
    <div>

      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default GoalaasetMap;
