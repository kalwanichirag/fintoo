import style from './style.module.css';
import Styles from '../../moneymanagement.module.css';
import OverviewChartColumn from "./OverviewChartColumn";


const getFormattedGrossData = (data) => {
    return [
        {
            label: 'Gross Inflow',
            value: data.Gross_Inflow,
            view: 'INFLOW',
            colorTheme: '#042b62'
        },
        {
            label: 'Gross Outflow',
            value: data.Gross_Outflow,
            view: 'OUTFLOW',
            colorTheme: '#5b85f5'
        },
        {
            label: 'Gross Investment',
            value: data.Gross_investment,
            view: 'INVESTMENT',
            colorTheme: '#8fadff'
        }
    ]
}

const OverviewChart = (props) => {
    const chartData = props.chartData || {};
    const chartKey = props.chartKey || '';

    const data = chartData[chartKey] || {};

    const chartDataArray = props.changeView ? getFormattedGrossData(data) : (Object.entries(data).map(([label, value]) => ({ label, value }))).sort((a, b) => b.value - a.value);

    const maxAmount = Math.max(...Object.values(data));

    const heightPercentage = maxAmount > 0 ? chartDataArray.map(data => ((data.value / maxAmount) * 300)) : Array(chartDataArray.length).fill(0);

    const minHeight = 300;

    return (
        <div className={`${style.graphGrid} ${Styles.overviewChartContainer}`} style={{ minHeight: `${minHeight}px`, display: 'flex', flexDirection: 'column' }} >

            {Boolean(props.title) && <div
                className={`${Styles.overviewChartTitle}`}
                onClick={props.backFun}
            ><i style={{ color: '#042b62' }} className="fa-solid fa-angle-left"></i> {props.title}</div>}
            <br />
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', justifyContent: 'flex-end' }}>
                <div className={`${Styles.overviewChartColumnContainer}`} style={{ overflowY: 'auto', maxHeight: '400px' }}>
                    {
                        chartDataArray.map((data, index) => <OverviewChartColumn changeView={props.changeView} key={index} view={data.view} value={data.value} label={data.label} colorTheme={props.colColor ? props.colColor : data.colorTheme} height={heightPercentage[index]} />)
                    }
                </div>
            </div>


            {/* <div className={`${Styles.overviewChartColumnContainer}`} style={{ overflowY: 'auto', maxHeight: '400px' }}>
                {
                    chartDataArray.map((data, index) => (
                        <OverviewChartColumn
                            changeView={props.changeView}
                            key={index}
                            view={data.label} // Assuming label represents the view here
                            value={data.value}
                            label={data.label}
                            colorTheme="#28A6DF" // You can set a default color here
                            height={heightPercentage[index]}
                        />
                    ))
                }
            </div> */}
        </div>
    );
};
export default OverviewChart;

