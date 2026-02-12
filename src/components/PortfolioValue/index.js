import { useEffect, useState } from "react";
import PortfolioCategory from "./PortfolioCategory";
import style from "./style.module.css";
import ReactApexChart from "react-apexcharts";

const PortfolioValue = (props) => {
  const [categoryValues, setCategoryValues] = useState([]);

  const [donutData, setDonutData] = useState({
    series: [70, 30],
    options: {
      responsive: [
        {
          breakpoint: 500,
          options: {
            legend: {
              fontSize: "11px"
            }
          }
        }
      ],
      colors: ['#9400D3', '#4B0082', '#0000FF', '#00FF00', '#FFFF00', '#FF7F00', '#FF0000'],
      states: {
        active: {
          filter: {
            type: "none" /* none, lighten, darken */
          }
        }
      },
      legend: false,
      dataLabels: {
        enabled: false,
      },
      chart: {
        type: "donut"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    }
  });

  useEffect(() => {
    if (categoryValues.length > 0) {
      let x = props?.invData?.inv_data
      setDonutData({ ...donutData, series: [x?.Equity?.perc, x?.Debt?.perc, x?.Real_Estate?.perc, x?.Liquid?.perc, x?.Gold?.perc, x?.Alternate?.perc, x?.Others?.perc], options: { ...donutData.options, labels: ['Equity', 'Debt', 'Real Estate', 'Liquid', 'Gold', 'Alternate', 'Others'] } });
    }
  }, [categoryValues]);

  const onLoadInit = async () => {
    await props;
    GetCategoryData(props?.invData);
  };

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      currency: "INR",
    }).format(value);

  const GetCategoryData = (data) => {
    let graph_data = [];
    Object.keys(data).length > 0 && Object.keys(data?.inv_data).forEach((key) => {
      const percValue = data?.inv_data[key]?.perc?.toFixed(2);
      graph_data.push({
        title: key,
        title_percentage_value: percValue,
        title_invested_value: numberFormat(data?.inv_data[key]?.inv_val),
      });
    });
    setCategoryValues(graph_data);
  };

  useEffect(() => {
    onLoadInit();
  }, []);
 


  return (
    <div>
      <div
        className={style.bepbox}
        style={{
          border: "1px solid #ececec",
          borderRadius: 10,
        }}
      >
        <div className={`${style.pbox}`}>
          <div className={`${style.pbox1}`}>
            <div>
              <div className={style.insidePo}>
                <p className={`mb-0 ${style.title}`}>Total Portfolio Value</p>
                <p className="mb-0">
                  <span className={style.symbol}>₹</span>
                  <span className={style.value}>
                    {props.invData.t_curr_val
                      ? numberFormat(props.invData.t_curr_val)
                      : 0}
                  </span>
                </p>
              </div>
            </div>
            <div className={style.diffDv}>
              <div className={style.insidePo}>
                <p className={`mb-0 ${style.title}`}>Investment Value</p>
                <p className="mb-0">
                  <span className={style.symbol}>₹</span>
                  <span className={style.value}>
                    {props.invData.t_inv_val
                      ? numberFormat(props.invData.t_inv_val)
                      : 0}
                  </span>
                </p>
              </div>
            </div>
          </div>
          {/* <div>
          <ReactApexChart
            className="donutchartI74y"
            options={donutData.options}
            series={donutData.series}
            key={'heolo' + donutData.series.length}
            type="donut"
            height={100}
          />
          </div> */}
        </div>
      </div>

      <div className="py-4">
        <div className={style.grid08}>
          {categoryValues.length > 0 ? (
            categoryValues.map((v) => <PortfolioCategory data={v} />)
          ) : (
            <></>
          )}

          {/* {categoryValues.length > 0 ? <PortfolioCategory data={categoryValues} />
            : (
              <></>
            )} */}
        </div>
      </div>
    </div>
  );
};
export default PortfolioValue;
