import { useEffect, useState } from "react";
import Performance from "../../../../Assets/Datagathering/Graph/Performance";
import ReturnAnalysis from "../../../../Assets/Datagathering/Graph/ReturnAnalysis";
import ReturnAnalysisOld from "../../../../Assets/Datagathering/Graph/ReturnAnalysis_old";
// import CorrelationMatrix from "../../../../Assets/Datagathering/Graph/CorrelationMatrix";
import CorrelationMatrix from "../../../../Assets/Datagathering/Graph/CorrelationMatrix";
// import stockBlue from "../Assets/02_All_stocks_Blue.svg";
import stockBlue from "../../../../Assets/Images/02_All_stocks_Blue.svg";

import { imagePath } from "../../../../constants";

function PerformanceData(props) {

    const PARData = props.PARData
    const growthSeriesData = props.PARData?.json_response?.Portfolio?.Benchmark?.GrowthSeries?.Return;
    const benchMarkGrowthSeriesData = props.PARData?.json_response?.Portfolio?.Benchmark?.GrowthSeries?.Return;
    const historicalPerformanceSeriesData = props.PARData?.json_response?.Portfolio?.Benchmark?.HistoricalPerformanceSeries?.HistoryDetail;
    const benchMarkHistoricalPerformanceSeriesData = props.PARData?.json_response?.Portfolio?.Benchmark?.HistoricalPerformanceSeries?.HistoryDetail;
    const trailingReturnsData = props.PARData?.json_response?.Portfolio?.Benchmark?.Performance?.Returns?.Return;
    const trailingReturnsBenchmark = props.PARData?.json_response?.Portfolio?.Benchmark?.Performance?.Returns?.Return;
    const topPortfolioHoldings = props.PARData?.json_response?.Portfolio?.Holdings?.Holding;
    const timePeriodReturnsData = props.PARData?.json_response?.Portfolio?.BestWorstPeriods?.Return;
    const statisticsData = props.PARData?.json_response?.Portfolio?.Performance?.['0']?.['RiskStats'];
    const sectionText = props.PARData?.section_text;

    const [mappedData, setMappedData] = useState([]);
    const [mappedBenchmark, setMappedBenchmark] = useState([]);
    const [newMappedData, setNewMappedData] = useState([]);
    const [riskReturnStatisticsData, setRiskReturnStatisticsData] = useState([]);
    const [filteredRRSData, setFilteredRRSData] = useState([]);
    const [mptStats, setMptReturnsStats] = useState([]);
    const [filteredMPTData, setFilteredMPTData] = useState([]);

    const [performanceholdingData, setPerformanceholdingData] = useState([]);
    const [performanceholdingDatajson, setPerformanceholdingDatajson] = useState({});
    const [three_year_std_deviation_mean, setThreeYearStandardDeviationMean] = useState({});
    const [returnAnalysisholdinggraphvalues, setReturnAnalysisholdinggraphvalues] = useState([]);
    const [returnAnalysisPortfolio, setReturnAnalysisPortfolio] = useState([]); 
    const [correlationData, setCorrelationData] = useState([]);
    const [corrData, setCorrData] = useState([]);
    const [categories, setCategories] = useState([]);

     // Transform data for Highcharts
    const transformCorrelationData = (correlationDetail) => {
        // Check if correlationDetail is an array, if not return empty data
        if (!Array.isArray(correlationDetail)) {
            console.warn('correlationDetail is not an array:', correlationDetail);
            return { categories: [], data: [] };
        }

        // const category_ids = correlationDetail.map((_, index) => index);
        const ids = correlationDetail.map((detail) => detail["@id"]);
        const data = [];

        correlationDetail.forEach((detail, i) => {
        detail.Correlation.forEach((correlation) => {
            const x = i; // x-axis index
            const y = ids.indexOf(correlation["@id"]); // y-axis index
            const value = parseFloat(correlation["#text"]);

            // Only include values provided in the dataset
            if (!isNaN(value)) {
            data.push([x, y, value]);
            }
        });
        });

        return {
        categories: ids,
            // categories: category_ids,
        data,
        };
    };

    useEffect(() => {
        if (PARData.json_response?.Portfolio?.Holdings) {
            const holdings = PARData.json_response.Portfolio.Holdings;

            const holdingArray = Array.isArray(holdings.Holding) ? holdings.Holding : [holdings.Holding];

            const newPerformanceholdingData = [];
            const newPerformanceholdingDatajson = {};
            const newReturnAnalysisholdinggraphvalues = [];

            holdingArray.sort((a, b) => b.Weight - a.Weight);

            holdingArray.forEach((val, key) => {
                val['KeyNum'] = key + 1;
                newPerformanceholdingData.push(val);
                newPerformanceholdingDatajson[val['@id']] = val;

                if (val.Performance?.RiskStats?.StandardDeviation) {
                    let valtopush = '0';
                    const standardDeviationArray = Array.isArray(val.Performance.RiskStats.StandardDeviation)
                        ? val.Performance.RiskStats.StandardDeviation
                        : [];

                    if (standardDeviationArray.length > 1) {
                        valtopush = standardDeviationArray[1]['#text'];
                    }

                    newReturnAnalysisholdinggraphvalues.push({
                        x: parseFloat(valtopush).toFixed(2),
                        y: parseFloat(val.Performance.Returns.Return[6]?.['#text'] || '0').toFixed(2),
                        z: 50,
                        name: (key + 1),
                        value: val.Name,
                        weight: parseFloat(val.Weight).toFixed(2),
                    });
                }
            });

            let performance_returns = PARData.json_response?.Portfolio?.Benchmark?.Performance?.Returns?.Return;
            let performance_std_deviations = PARData.json_response?.Portfolio?.Benchmark?.Performance?.RiskStats?.StandardDeviation;
            // let three_yr_std_mean = {
            //     "mean": performance_returns.find(item => item["@timePeriod"] === "M36")?.["#text"],
            //     "std_deviation": performance_std_deviations.find(item => item["@timePeriod"] === "M36")?.["#text"]
            // }
            // setThreeYearStandardDeviationMean(three_yr_std_mean);
            if (!performance_returns) {
                console.error("performance_returns is undefined");
            }
            if (!performance_std_deviations) {
                console.error("performance_std_deviations is undefined");
            }
            
            let three_yr_std_mean = {
                "y_value": performance_returns?.find(item => item["@timePeriod"] === "M36")?.["#text"] || null,
                "x_value": performance_std_deviations?.find(item => item["@timePeriod"] === "M36")?.["#text"] || null
            };
            
            setThreeYearStandardDeviationMean(three_yr_std_mean);

            setPerformanceholdingData(newPerformanceholdingData);
            setPerformanceholdingDatajson(newPerformanceholdingDatajson);

            // const portfolioData = newReturnAnalysisholdinggraphvalues.filter(
            //     (dataPoint) => dataPoint.name === "Portfolio"
            // );

            setReturnAnalysisholdinggraphvalues(newReturnAnalysisholdinggraphvalues.slice(0,10));
            // setReturnAnalysisPortfolio(portfolioData.slice(0, 1));
        }

        if (PARData.json_response?.Portfolio?.Benchmark?.Performance) {
            const portfolioPerformance = PARData.json_response?.Portfolio?.Benchmark?.Performance;
            const standardDeviationArray = Array.isArray(portfolioPerformance?.RiskStats?.StandardDeviation)
                ? portfolioPerformance.RiskStats.StandardDeviation
                : [];

            if (standardDeviationArray.length > 1) {
                // setReturnAnalysisholdinggraphvalues(prevValues => [
                //     ...prevValues,
                //     {
                //         x: parseFloat(standardDeviationArray[1]['#text']),
                //         y: parseFloat(portfolioPerformance[0]?.Returns?.Return[7]?.['#text'] || '0'),
                //         z: 50,
                //         name: 'Portfolio',
                //         value: 'Portfolio',
                //         weight: 100,
                //     },
                // ]);
                setReturnAnalysisPortfolio({
                        x: parseFloat(standardDeviationArray[1]['#text']),
                        y: parseFloat(portfolioPerformance[0]?.Returns?.Return[7]?.['#text'] || '0'),
                        z: 50,
                        name: 'Portfolio',
                        value: 'Portfolio',
                        weight: 100,
                });
            }

            // prepare correlation matrix data
            const correlation_detail = portfolioPerformance[0]?.CorrelationMatrix?.CorrelationMatrixDetail[1]?.CorrelationDetail;
            // Ensure correlation_detail is an array
            const correlationArray = Array.isArray(correlation_detail) ? correlation_detail : [];
            setCorrData(correlationArray);
            let { categories, data } = transformCorrelationData(correlationArray);
            setCorrelationData(data);
            setCategories(categories);
        }
    }, [PARData]);

    function getTimePeriodReturns(data) {
        switch (data["@timePeriod"]) {
            case "M3":
                return "3 Months"
            case "M6":
                return "6 Months"
            case "M12":
                return "1 Year"
            case "M36":
                return "3 Years Annualised"
            case "M60":
                return "5 Years Annualised"
        }
    }

    useEffect(() => {
        // Filter the data for the desired @timePeriod values
        const desiredTimePeriods = ["M3", "M6", "M12", "M36", "M60", "M0"];
        const filteredData = trailingReturnsData?.filter((data) =>
            desiredTimePeriods.includes(data["@timePeriod"])
        );

        const filteredTrainingBmark = trailingReturnsBenchmark?.filter((data) =>
            desiredTimePeriods.includes(data["@timePeriod"])
        );

        // Map the filtered data to extract pairs of timePeriod and value
        const mappedValues = filteredData?.map((data) => ({
            timePeriod: data["@timePeriod"],
            value: parseFloat(data["#text"])
        }));

        const mappedBenchmark = filteredTrainingBmark?.map((data) => ({
            timePeriod: data["@timePeriod"],
            value: parseFloat(data["#text"])
        }));

        // Find the index of "M0" in the mappedValues array
        const indexOfM0 = mappedValues?.findIndex((data) => data.timePeriod === "M0");

        // Move "M0" to the last position if it exists in the array
        if (indexOfM0 !== -1) {
            const m0Data = mappedValues?.splice(indexOfM0, 1)[0];
            mappedValues?.push(m0Data);
        }

        // Set the mapped data to the state
        setMappedData(mappedValues);
        setMappedBenchmark(mappedBenchmark);
    }, [trailingReturnsData]);



    function getTimePeriod(data) {
        switch (data["@timePeriod"] || data['timePeriod']) {
            case "M3":
                return "3 Months"
            case "M6":
                return "6 Months"
            case "M12":
                return "1 Year"
            case "M36":
                return "3 Years"
            case "M60":
                return "5 Years"
            case "M0":
                return "YTD"
        }
    };

    const bestData = {}
    const worstData = {}


    useEffect(() => {

        timePeriodReturnsData?.forEach((data) => {
            const timePeriod = getTimePeriodReturns(data);
            if (data['@type'] === 'Best') {
                bestData[timePeriod] = `${parseFloat(data['#text']).toFixed(2)} (${data['@startDate']}-${data['@endDate']})`;
            } else if (data['@type'] === 'Worst') {
                worstData[timePeriod] = `${parseFloat(data['#text']).toFixed(2)} (${data['@startDate']}-${data['@endDate']})`;
            }
        });

        const combinedData = Object.keys(bestData).map((timePeriod) => ({
            timePeriod,
            best: bestData[timePeriod],
            worst: worstData[timePeriod],
        }));

        setNewMappedData(combinedData)

    }, [timePeriodReturnsData]);


    useEffect(() => {
        const riskReturnKeys = ["StandardDeviation", "ArithmeticMean", "SharpeRatio"];
        const mptKeys = ["Alpha", "Beta", "RSquared", "InformationRatio", "TrackingError"];

        const riskReturnData = {};
        const mptData = {};

        for (const key in statisticsData) {
            if (riskReturnKeys.includes(key)) {
                riskReturnData[key] = statisticsData[key];
            } else if (mptKeys.includes(key)) {
                mptData[key] = statisticsData[key];
            }
        }

        // Update the state variables with the extracted data
        setRiskReturnStatisticsData(riskReturnData);
        setMptReturnsStats(mptData);
    }, [statisticsData])

    useEffect(() => {
        // Filter the data for the specified timePeriods ("M36" and "M60")
        const filtered = Object.keys(mptStats).reduce((acc, key) => {
            acc[key] = mptStats[key].filter((item) => {
                const timePeriod = item['@timePeriod'];
                return timePeriod === 'M36' || timePeriod === 'M60';
            });
            return acc;
        }, {});
        setFilteredMPTData(filtered);
    }, [mptStats]);

    // Function to get the value for a given key and time period
    const getValueNew = (key, timePeriod) => {
        if (filteredMPTData[key]) {
            const item = filteredMPTData[key].find((item) => item['@timePeriod'] === timePeriod);
            return item ? parseFloat(item['#text']).toFixed(2) : '0.00';
        }
        return '0.00';
    };

    useEffect(() => {
        // Filter the data for the specified timePeriods ("M36" and "M60")
        const filtered = Object.keys(riskReturnStatisticsData).reduce((acc, key) => {
          acc[key] = Object.values(riskReturnStatisticsData[key]).filter((item) => {
            const timePeriod = item['@timePeriod'];
            return timePeriod === 'M36' || timePeriod === 'M60';
          });
          return acc;
        }, {});
        setFilteredRRSData(filtered);
      }, [riskReturnStatisticsData]);      

    // Function to get the value for a given key and time period
    const getValue = (key, timePeriod) => {
        if (filteredRRSData[key]) {
            const item = filteredRRSData[key].find((item) => item['@timePeriod'] === timePeriod);
            return item ? parseFloat(item['#text']).toFixed(2) : '0.00';
        }
        return '0.00';
    };

    return (
        <div>
            {PARData && PARData.json_response && Object.keys(PARData.json_response).length > 0 ?
                (<div className="performance">
                    <h4 className="rTitle">
                        <img

                            alt=""
                            src={imagePath + "/static/media/DG/reports/current-investments/performances.svg"}
                        />{" "}
                        Performance
                    </h4>
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <h3 style={{ textAlign: "right" }}>
                                Performance Date
                            </h3>
                            <div style={{ textAlign: "right" }}>
                                {props.PARData?.json_response?.Portfolio?.Benchmark?.Performance?.EndDate
                                    ? props.PARData.json_response.Portfolio.Benchmark?.Performance?.EndDate
                                        .split("-")
                                        .reverse()
                                        .join("/")
                                    : ""}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div
                                className="recomm-box"

                            >
                                <div className="green cardBox d-flex">
                                    <div>
                                        {" "}
                                        <img
                                            alt=""
                                            src={imagePath + "/static/media/DG/reports/current-investments/performances.svg"}
                                        />
                                    </div>
                                    <div> Performance</div>
                                </div>
                                <div
                                    className="rContent "
                                >
                                      <p
                                            dangerouslySetInnerHTML={{
                                                __html: sectionText ? sectionText[51][0]['field0']  : "",
                                            }}
                                      ></p>
                                </div>
                                <div
                                    id="performance"
                                    data-highcharts-chart={4}
                                    style={{ overflow: "hidden" }}
                                >
                                    <Performance
                                        growthSeriesData={growthSeriesData}
                                        historicalSeriesData={historicalPerformanceSeriesData}
                                        benchMarkSeriesData={benchMarkGrowthSeriesData}
                                        benchMarkHistoricalSeriesData={benchMarkHistoricalPerformanceSeriesData}
                                    />
                                     {/* <PerformanceGrowthSeries
                                        growthSeriesData={growthSeriesData}
                                    /> */}
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="table-responsive rTable">
                                            <table className="bgStyleTable asset-table">
                                                <tbody>
                                                    <tr>
                                                        <th>Trailing Returns</th>
                                                        <th>Portfolio (%)</th>
                                                        <th>Benchmark</th>
                                                    </tr>

                                                    {mappedData?.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{getTimePeriod(item)}</td>
                                                            <td>{item.value.toFixed(2)}</td>
                                                            <td>{mappedBenchmark[index] ? mappedBenchmark[index].value.toFixed(2) : '0.00'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="table-responsive rTable">
                                            <table className="bgStyleTable asset-table">
                                                <tbody>
                                                    <tr>
                                                        <th>Time Period Returns</th>
                                                        <th>Best</th>
                                                        <th>Worst</th>
                                                    </tr>
                                                    {newMappedData.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="3" style={{ textAlign: "center" }}>
                                                                No data available.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        newMappedData.map((data, index) => (
                                                            <tr key={index}>
                                                                <td>{data.timePeriod}</td>
                                                                <td>{data.best}</td>
                                                                <td>{data.worst}</td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div
                                className="recomm-box"
                            >
                                <div className="green cardBox d-flex">
                                    <div>
                                        {" "}
                                        <img
                                            alt=""
                                            src={imagePath + "/static/media/DG/reports/current-investments/return-analysis.svg"}
                                        />
                                    </div>
                                    <div> Return Analysis</div>
                                </div>
                                <div
                                    className="rContent ">
                                      <p
                                            dangerouslySetInnerHTML={{
                                            __html: sectionText ? sectionText[51][0]['field1']  : "",
                                            }}
                                        ></p>   
                                </div>
                                <div
                                    id=""
                                    data-highcharts-chart={5}
                                    style={{ overflow: "hidden" }}
                                >
                                    {/* <ReturnAnalysisOld
                                        returnAnalysisholdinggraphvalues={returnAnalysisholdinggraphvalues}
                                    /> */}

                                    <ReturnAnalysis
                                        returnAnalysisholdinggraphvalues={returnAnalysisholdinggraphvalues}
                                        returnAnalysisPortfolio={returnAnalysisPortfolio}
                                        three_year_std_deviation_mean={three_year_std_deviation_mean}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <!-- CorrelationMatrix  */}
                        <div className="col-md-12">
                            <div
                                className="recomm-box"
                            >
                                <div className="green cardBox d-flex">
                                    <div>
                                        {" "}
                                        <img
                                            alt=""
                                            // src={imagePath + "/static/media/DG/reports/current-investments/return-analysis.svg"}
                                            src={stockBlue}
                                        />
                                    </div>
                                    <div>Correlation Matrix</div>
                                </div>
                                <div
                                    className="rContent mb-10">
                                     <p>A correlation matrix is a table that shows the correlation coefficients between different mutual funds or asset classes. 
                                     The correlation coefficient ranges from -1 to +1 and helps you understand how funds move relative to each other.</p>
                                </div>
                                <div className="row">
                                {/* <div
                                    className="col-md-6"
                                    id="correlationMatrix"
                                    data-highcharts-chart={6}
                                    style={{ overflow: "hidden", height: "600px"}}
                                >
                                    <CorrelationMatrix correlationData={correlationData} categories={categories}
                                        corrData={corrData}/>
                                    {console.log("Categoriesppp:", categories)}
                                </div> */}
                                <div
                                    className="col-md-6"
                                    id="correlationMatrix"
                                    data-highcharts-chart={6}
                                    // style={{ height: "600px"}}
                                >
                                    <CorrelationMatrix correlationData={correlationData} categories={categories}
                                        corrData={corrData}/>
                                </div>
                                </div>
                            </div>
                        </div>
                        {/* place top holding here --abdul */}
                        <div className="col-md-12">
                            <div className="recomm-box">
                                <div className="green cardBox d-flex">
                                    <div>
                                        {" "}
                                        <img
                                            alt=""
                                            src={imagePath + "/static/media/DG/reports/current-investments/top-underlying-holdingss.svg"}
                                        />
                                    </div>
                                    <div> Top Portfolio Holdings</div>
                                </div>
                                <div
                                    className="rContent "
                                >
                                      <p
                                            dangerouslySetInnerHTML={{
                                            __html: sectionText ? sectionText[51][0]['field3']  : "",
                                        }}
                                     ></p>
                                </div>
                                <table className="bgStyleTable asset-table">
                                    <tbody>
                                        <tr>
                                            <th>S.N</th>
                                            <th>Name</th>
                                            <th>Weightage (%)</th>
                                            <th>Mean (%)</th>
                                            <th>Standard deviation (%)</th>
                                        </tr>
                                        {/* {topPortfolioHoldings?.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: "center" }}>
                                                    No data available.
                                                </td>
                                            </tr>
                                        ) : (
                                            topPortfolioHoldings
                                                ?.sort((a, b) => parseFloat(b.Weight) - parseFloat(a.Weight))
                                                ?.slice(0, 10)
                                                ?.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{data.Name}</td>
                                                        <td>{parseFloat(data.Weight).toFixed(2)}</td>
                                                        <td>
                                                            {data && data.Performance && data.Performance.Returns && data.Performance.Returns.Return && data.Performance.Returns.Return['6']
                                                                ? parseFloat(data.Performance.Returns.Return['6']['#text']).toFixed(2)
                                                                : 0}
                                                        </td>
                                                        <td>
                                                            {data && data.Performance && data.Performance.RiskStats && data.Performance.RiskStats.StandardDeviation
                                                                ? parseFloat(data.Performance.RiskStats.StandardDeviation["1"]["#text"]).toFixed(2)
                                                                : 0}
                                                        </td>
                                                    </tr>
                                                ))
                                        )} */}
                                        {topPortfolioHoldings && (
                                            Array.isArray(topPortfolioHoldings) && topPortfolioHoldings.length > 0 ? (
                                                topPortfolioHoldings
                                                    .sort((a, b) => parseFloat(b.Weight) - parseFloat(a.Weight))
                                                    .slice(0, 10)
                                                    .map((data, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{data.Name}</td>
                                                            <td>{parseFloat(data.Weight).toFixed(2)}</td>
                                                            <td>
                                                                {data && data.Performance && data.Performance.Returns && data.Performance.Returns.Return && data.Performance.Returns.Return['6']
                                                                    ? parseFloat(data.Performance.Returns.Return['6']['#text']).toFixed(2)
                                                                    : 0}
                                                            </td>
                                                            <td>
                                                                {data && data.Performance && data.Performance.RiskStats && data.Performance.RiskStats.StandardDeviation
                                                                    ? parseFloat(data.Performance.RiskStats.StandardDeviation?.["1"]?.["#text"]).toFixed(2)
                                                                    : 0}
                                                            </td>
                                                        </tr>
                                                    ))
                                            ) : topPortfolioHoldings ? (
                                                <tr>
                                                    <td>1</td>
                                                    <td>{topPortfolioHoldings.Name}</td>
                                                    <td>{parseFloat(topPortfolioHoldings.Weight).toFixed(2)}</td>
                                                    <td>
                                                        {topPortfolioHoldings && topPortfolioHoldings.Performance && topPortfolioHoldings.Performance.Returns && topPortfolioHoldings.Performance.Returns.Return && topPortfolioHoldings.Performance.Returns.Return['6']
                                                            ? parseFloat(topPortfolioHoldings.Performance.Returns.Return['6']['#text']).toFixed(2)
                                                            : 0}
                                                    </td>
                                                    <td>
                                                        {topPortfolioHoldings && topPortfolioHoldings.Performance && topPortfolioHoldings.Performance.RiskStats && topPortfolioHoldings.Performance.RiskStats.StandardDeviation
                                                            ? parseFloat(topPortfolioHoldings.Performance.RiskStats.StandardDeviation?.["1"]?.["#text"]).toFixed(2)
                                                            : 0}
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                                        No data available.
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="recomm-box">
                                <div className="green cardBox d-flex">
                                    <div>
                                        {" "}
                                        <img
                                            alt=""
                                            src={imagePath + "/static/media/DG/reports/current-investments/statistics.svg"}
                                        />
                                    </div>
                                    <div>Statistics</div>
                                </div>
                                <div
                                    className="rContent "

                                >
                                    {/* <p>
                                        <b>R-squared</b> is an important factor
                                        that indicates to you the extent of
                                        correlation between a fund and its
                                        benchmark.{" "}
                                    </p>
                                    <p></p>
                                    <p>
                                        <b>Beta</b> is used to measure the extent
                                        to which market movements impact a fund.
                                        When the portfolio’s beta is higher than
                                        1, it is said to be more volatile than the
                                        market. On the other hand, when the
                                        portfolio’s beta is less than 1, it is
                                        deemed to be less volatile than the
                                        market.
                                    </p>
                                    <p></p>
                                    <p>
                                        <b>Alpha</b> indicates the gap between a
                                        fund's actual returns and its expected
                                        returns.
                                    </p>
                                    <p></p>
                                    <p>
                                        <b>Sharpe ratio</b> helps determine the
                                        reward reaped per unit of risk that you
                                        take on when investing. It does so by
                                        taking into account standard deviation and
                                        excess returns.
                                    </p>
                                    <p></p>
                                    <p>
                                        <b>Standard deviation</b> measures the
                                        volatility of portfolio returns. For a
                                        specific fund, it does so simply. It
                                        determines the extent of spread of a
                                        pre-determined set of values, both below
                                        and above the average.
                                    </p> */}
                                       <p
                                            dangerouslySetInnerHTML={{
                                            __html: sectionText ? sectionText[51][0]['field4']  : "",
                                        }}
                                     ></p>
                                </div>
                                <table className="bgStyleTable asset-table">
                                    <tbody>
                                        <tr>
                                            <th width="60%">
                                                Risk and Return Statistics
                                            </th>
                                            <th width="20%">3 Years</th>
                                            <th width="20%">5 Years</th>
                                        </tr>
                                        <tr>
                                            <td>Standard Deviation</td>
                                            <td>{getValue('StandardDeviation', 'M36')}</td>
                                            <td>{getValue('StandardDeviation', 'M60')}</td>
                                        </tr>
                                        <tr>
                                            <td>Arithmetic Mean</td>
                                            <td>{getValue('ArithmeticMean', 'M36')}</td>
                                            <td>{getValue('ArithmeticMean', 'M60')}</td>
                                        </tr>
                                        <tr>
                                            <td>Sharpe Ratio</td>
                                            <td>{getValue('SharpeRatio', 'M36')}</td>
                                            <td>{getValue('SharpeRatio', 'M60')}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/* <div class="rContent pt-2" ng-bind-html="cir_section_data['50'][0]['field4']"></div> */}
                                <br />
                                <table className="bgStyleTable asset-table">
                                    <tbody>
                                        <tr>
                                            <th width="60%">MPT Statistics</th>
                                            <th width="20%">3 Years</th>
                                            <th width="20%">5 Years</th>
                                        </tr>
                                        <tr>
                                            <td>Alpha</td>
                                            <td>{getValueNew('Alpha', 'M36')}</td>
                                            <td>{getValueNew('Alpha', 'M60')}</td>
                                        </tr>
                                        <tr>
                                            <td>Beta</td>
                                            <td>{getValueNew('Beta', 'M36')}</td>
                                            <td>{getValueNew('Beta', 'M60')}</td>
                                        </tr>
                                        <tr>
                                            <td>R-Squared</td>
                                            <td>{getValueNew('RSquared', 'M36')}</td>
                                            <td>{getValueNew('RSquared', 'M60')}</td>
                                        </tr>
                                        <tr>
                                            <td>Tracking Error</td>
                                            <td>{getValueNew('TrackingError', 'M36')}</td>
                                            <td>{getValueNew('TrackingError', 'M60')}</td>
                                        </tr>
                                        <tr>
                                            <td>Information Ratio</td>
                                            <td>{getValueNew('InformationRatio', 'M36')}</td>
                                            <td>{getValueNew('InformationRatio', 'M60')}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div
                                    style={{
                                        height: 50,
                                        clear: "both",
                                        width: 100,
                                    }}
                                >
                                    &nbsp;
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ) : (
                    <div className="no-data-found text-md-center">
                        <div className="container">
                            <div className="row justify-content-center align-items-center">
                                <div className="col-md-10">
                                    <img
                                        alt="Data not found"
                                        src={imagePath + "/static/media/DG/data-not-found.svg"}
                                    />
                                    <p>
                                        Since you missed to fill in the required information which is
                                        needed here, we are not able to show you this section. Kindly
                                        click on below button to provide all the necessary inputs.
                                        Providing all the information as asked will ensure more accurate
                                        financial planning report. Once you fill in the data, same will
                                        be reflected here.
                                    </p>
                                    <a
                                        href={process.env.PUBLIC_URL + "/datagathering/assets-liabilities"}
                                        target="_blank"
                                        className="link"
                                    >
                                        Complete Assets &amp; Liabilities
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

        </div>
    )
}

export default PerformanceData;