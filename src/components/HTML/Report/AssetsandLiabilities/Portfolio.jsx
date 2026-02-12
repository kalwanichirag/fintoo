import { useEffect, useState } from "react";
import InvestmentStyle from "../../../../Assets/Datagathering/Graph/InvestmentStyle";
import Portfolio from "../../../../Assets/Datagathering/Graph/Portfolio";
import StockSectors from "../../../../Assets/Datagathering/Graph/StockSectors";
import { imagePath } from "../../../../constants";

function PortfolioData(props) {

    const ReactStarRating = props.ReactStarRating;
    const PARData = props.PARData;
    const portfolioHoldingData = props.PARData?.json_response?.Portfolio?.Holdings?.Holding;
    const benchmarkReturns = props.PARData?.json_response?.Portfolio?.Benchmark?.Performance?.Returns?.Return;
    const assetAllocationData = props.PARData?.json_response?.Portfolio?.Breakdowns?.AssetAllocation?.['0']?.['Value'];
    const assetAllocationBenchmark = props.PARData?.json_response?.Portfolio?.Benchmark?.Breakdowns?.AssetAllocation?.['0']?.['Value'];
    const stockSectorData = props.PARData?.json_response?.Portfolio?.Breakdowns?.GlobalStockSector?.['Value'];
    const stockSectorBenchmark = props.PARData?.json_response?.Portfolio?.Benchmark?.Breakdowns?.GlobalStockSector?.['Value'];
    const underlyingHoldingData = props.PARData?.json_response?.Portfolio?.UnderlyHoldings?.Holding;
    const equityStatisticsData = props.PARData?.json_response?.Portfolio?.EquityStatistics;
    const equityStatisticsBenchmark = props.PARData?.json_response?.Portfolio?.Benchmark?.EquityStatistics;
    const styleBoxData = props.PARData?.json_response?.Portfolio?.Breakdowns?.StyleBox?.Value;
    const sectionText = props.PARData?.section_text;

    const oneYear = parseFloat(
        benchmarkReturns?.find(r => r?.["@timePeriod"] === "M12")?.["#text"] ?? NaN
      )?.toFixed(2);
      
      const threeYear = parseFloat(
        benchmarkReturns?.find(r => r?.["@timePeriod"] === "M36")?.["#text"] ?? NaN
      )?.toFixed(2);
      
      const fiveYear = parseFloat(
        benchmarkReturns?.find(r => r?.["@timePeriod"] === "M60")?.["#text"] ?? NaN
      )?.toFixed(2);


      useEffect(() => {
        if (Array.isArray(portfolioHoldingData) && portfolioHoldingData.length > 0) {
          portfolioHoldingData.forEach((data, index) => {
            // console.log({
            //   Name: data.Name,
            //   Type: getSecurityType(data),
            //   PortfolioDate: data.PriceDate,
            //   Rating: data.Rating,
            //   Weight: data.Weight
            // });
          });
        } else if (portfolioHoldingData) {
        //   console.log("Table Data (Single Holding):", {
        //     Name: portfolioHoldingData.Name,
        //     Type: getSecurityType(portfolioHoldingData),
        //     PortfolioDate: portfolioHoldingData.PortfolioDate,
        //     Rating: portfolioHoldingData.Rating,
        //     Weight: portfolioHoldingData.Weight
        //   });
        } else {
          console.log("No holding data found");
        }
      }, [portfolioHoldingData]);
      

    function getAssetType(data) {
        switch (data["@type"]) {
            case "1":
                return "Stock";
            case "2":
                return "Bond";
            case "3":
                return "Cash";
            case "4":
                return "Other";
            case "99":
                return "Not Classified";
        }
    };

    function getSectorType(data) {
        switch (data["GlobalSectorId"] || data['@type']) {
            case "101":
                return "Basic Materials"
            case "102":
                return "Consumer Cyclical"
            case "103":
                return "Financial Services"
            case "104":
                return "Real Estate"
            case "205":
                return "Consumer Defensive"
            case "206":
                return "Healthcare"
            case "207":
                return "Utilities"
            case "308":
                return "Communication Services"
            case "309":
                return "Energy"
            case "310":
                return "Industrials"
            case "311":
                return "Technology"
        }
    };

    function getSecurityType(data) {
        switch (data["SecurityType"]) {
            case "C0":
                return "Cash"
            case "FO":
                return "Funds"
            case "E0":
                return "Stocks"
            case "B0":
                return "Bonds"
            case "RE":
                return "Real Estate"
            case "NC":
                return "Not Classified"
            case "IX":
                return "Index"
            case "CA":
                return "Category"
            case "SA":
                return "SubAccount"
            case "MI":
                return "Miscellaneous"
            case "FC":
                return "Mutual Fund - Closed End"
            case "FE":
                return "Mutual Fund - ETF"
            case "FG":
                return "Euro Funds"
            case "FH":
                return "Mutual Fund - Hedge Funds"
            case "CB":
                return "Custom Benchmark"
            case "E":
                return "Equity"
            case "BT":
                return "Bond - Gov't/Treasury"
            case "B":
                return "Bonds"
        }
    };

    const cyclicSectorData = stockSectorData?.filter((data) =>
        ["101", "102", "103", "104"].includes(data["@type"])
    );
    const cyclicSectorBenchMark = stockSectorBenchmark?.filter((data) =>
        ["101", "102", "103", "104"].includes(data["@type"])
    );

    const sensitiveSectorData = stockSectorData?.filter((data) =>
        ["308", "309", "310", "311"].includes(data["@type"])
    );
    const sensitiveSectorBenchmark = stockSectorBenchmark?.filter((data) =>
        ["308", "309", "310", "311"].includes(data["@type"])
    );

    const defensiveSectorData = stockSectorData?.filter((data) =>
        ["205", "206", "207"].includes(data["@type"])
    );
    const defensiveSectorBenchmark = stockSectorBenchmark?.filter((data) =>
        ["205", "206", "207"].includes(data["@type"])
    );

    // Calculate totals
    const cyclicSectorTotal = cyclicSectorData?.reduce(
        (total, data) => total + parseFloat(data["#text"]),
        0
    );
    const cyclicSectorBmarkTotal = cyclicSectorBenchMark?.reduce(
        (total, data) => total + parseFloat(data["#text"]),
        0
    );

    const sensitiveSectorTotal = sensitiveSectorData?.reduce(
        (total, data) => total + parseFloat(data["#text"]),
        0
    );

    const sensitiveSectorBmarkTotal = sensitiveSectorBenchmark?.reduce(
        (total, data) => total + parseFloat(data["#text"]),
        0
    );

    const defensiveSectorTotal = defensiveSectorData?.reduce(
        (total, data) => total + parseFloat(data["#text"]),
        0
    );

    const defensiveSectorBmarkTotal = defensiveSectorBenchmark?.reduce(
        (total, data) => total + parseFloat(data["#text"]),
        0
    );

    return (
        <div>
            {PARData && PARData.json_response && Object.keys(PARData.json_response).length > 0 ?
                (<div>
                    <h4 className="rTitle">
                        <img
                            alt=""
                            src={imagePath + "/static/media/DG/reports/current-investments/portfolio.svg"}
                        />{" "}
                        Portfolio
                    </h4>
                    <div className="rContent ">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: PARData ? PARData.portfolio_section_data : "",
                          }}
                        ></p>
                    </div>
                    <div className="invest-recomm ">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="recomm-box">
                                    <div className="green cardBox d-flex">
                                        <div>
                                            {" "}
                                            <img
                                                alt=""
                                                src={imagePath + "/static/media/DG/reports/current-investments/portfolio-holdings.svg"}
                                            />
                                        </div>
                                        <div> Portfolio Holdings</div>
                                    </div>
                                    <div className="rContent">
  <p
    dangerouslySetInnerHTML={{
      __html: sectionText?.[52]?.[0]?.field0 || "",
    }}
  ></p>
</div>

<div className="table-responsive rTable">
  <table className="bgStyleTable asset-table text-center">
    <tbody>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Holding Portfolio Date</th>
        <th className="th-rating">Rating</th>
        <th style={{ width: 90 }}>1 Year</th>
        <th>3 Years Annualised</th>
        <th>5 Years Annualised</th>
        <th>Weightage (%)</th>
      </tr>

      {(() => {
        // ✅ Normalize data into array
        const holdings = Array.isArray(portfolioHoldingData)
          ? portfolioHoldingData
          : portfolioHoldingData
          ? [portfolioHoldingData]
          : [];

        if (!holdings.length) {
          return (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No data available.
              </td>
            </tr>
          );
        }

        // ✅ Helper: safe number formatter
        const safeNumber = (val, decimals = 2) => {
          const num = parseFloat(val);
          return isNaN(num) ? "-" : num.toFixed(decimals);
        };

        return holdings.map((data, index) => {
          const returns = data?.Performance?.Returns?.Return || [];

          // ✅ handle array safely
          const oneYear =
            Array.isArray(returns) && returns[5]
              ? returns[5]["#text"]
              : null;
          const threeYear =
            Array.isArray(returns) && returns[6]
              ? returns[6]["#text"]
              : null;
          const fiveYear =
            Array.isArray(returns) && returns[7]
              ? returns[7]["#text"]
              : null;

          return (
            <tr key={index}>
              <td>{data?.Name || "-"}</td>
              <td>{getSecurityType(data) || "-"}</td>
              <td>
                {data?.PortfolioDate
                  ? data.PortfolioDate.split("-").reverse().join("/")
                  : "-"}
              </td>
              <td>
                <div
                  className="star-rating"
                  key={`str-${index}-${parseInt(
                    Number(data?.Rating ?? 0)
                  )}`}
                >
                  <ReactStarRating
                    numberOfStar={5}
                    numberOfSelectedStar={parseInt(
                      Number(data?.Rating ?? 0)
                    )}
                    colorFilledStar="#042b62"
                    colorEmptyStar="gray"
                    starSize="20px"
                    spaceBetweenStar="10px"
                    disableOnSelect={true}
                  />
                </div>
              </td>
              <td>{safeNumber(oneYear)}</td>
              <td>{safeNumber(threeYear)}</td>
              <td>{safeNumber(fiveYear)}</td>
              <td>{safeNumber(data?.Weight)}</td>
            </tr>
          );
        });
      })()}
    </tbody>
  </table>
</div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="recomm-box">
                                    <div className="green cardBox d-flex">
                                        <div>
                                            {" "}
                                            <img
                                                alt=""
                                                src={imagePath + "/static/media/DG/reports/current-investments/assset-allocation.svg"}
                                            />
                                        </div>
                                        <div> Asset Allocation</div>
                                    </div>
                                    <div className="rContent ">
                                         <p
                                            dangerouslySetInnerHTML={{
                                                __html: sectionText ? sectionText[50][0]['field0']  : "",
                                            }}
                                            ></p>
                                    </div>
                                    <div className="row align-items-center">
                                        <div className="col-md-5">
                                            <div className="col-md-11 ">
                                                <div className="text-center">
                                                    <h4>Portfolio</h4>
                                                </div>
                                                <div>
                                                    {assetAllocationData && (
                                                        <Portfolio
                                                            assetAllocationData={assetAllocationData}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-7">
                                            <div className="table-responsive rTable">
                                                <table className="bgStyleTable asset-table">
                                                    <tbody>
                                                        <tr>
                                                            <th>Asset Allocation</th>
                                                            <th>Portfolio (%)</th>
                                                            <th>Benchmark</th>
                                                        </tr>
                                                        {assetAllocationData && (
                                                            assetAllocationData.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                                                        No data available.
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                assetAllocationData.map((data, index) => (
                                                                    <tr key={index}>
                                                                        <td>{getAssetType(data)}</td>
                                                                        <td>{parseFloat(data["#text"]).toFixed(2)}</td>
                                                                        <td>{assetAllocationBenchmark[index] ? 
                                                                                (parseFloat(assetAllocationBenchmark[index]["#text"]).toFixed(2) === '-0.00'
                                                                                ? '0.00'
                                                                                : parseFloat(assetAllocationBenchmark[index]["#text"]).toFixed(2))
                                                                            : '0.00'}</td>
                                                                    </tr>
                                                                ))
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {stockSectorData && (
                                <div className="col-md-12">
                                    <div className="recomm-box">
                                        <div className="green cardBox d-flex">
                                            <div>
                                                {" "}
                                                <img
                                                    alt=""
                                                    src={imagePath + "/static/media/DG/reports/current-investments/stock-sectors.svg"}
                                                />
                                            </div>
                                            <div> Stock Sectors </div>
                                        </div>

                                        <div className="rContent ">
                                            <p
                                            dangerouslySetInnerHTML={{
                                                __html: sectionText ? sectionText[50][0]['field1']  : "",
                                            }}
                                            ></p>
                                        </div>
                                        <div className="row align-items-center">
                                            <div id="assetMatrix" className="col-md-6 mt-5">
                                                <div className="text-center">
                                                    <h4>Stock Sectors</h4>
                                                </div>
                                                <div className="mt-1">
                                                    <StockSectors
                                                        cyclicSectorTotal={cyclicSectorTotal}
                                                        sensitiveSectorTotal={sensitiveSectorTotal}
                                                        defensiveSectorTotal={defensiveSectorTotal}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <table className="bgStyleTable asset-table" id="stockTable">
                                                    <tbody>
                                                        <tr>
                                                            <th>Cyclical</th>
                                                            <th>Stock (%)</th>
                                                            <th>Benchmark</th>
                                                        </tr>
                                                        {cyclicSectorData?.map((data, index) => (
                                                            <tr key={index}>
                                                                <td>{getSectorType(data)}</td>
                                                                <td>{parseFloat(data["#text"]).toFixed(2)}</td>
                                                                <td>{cyclicSectorBenchMark[index] ? parseFloat(cyclicSectorBenchMark[index]["#text"]).toFixed(2) : '-'}</td>
                                                            </tr>
                                                        ))}
                                                        <tr className="outline bold total-value">
                                                            <td>Total</td>
                                                            <td>{cyclicSectorTotal?.toFixed(2)}</td>
                                                            <td>{cyclicSectorBmarkTotal?.toFixed(2)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <table className="bgStyleTable asset-table">
                                                    <tbody>
                                                        <tr>
                                                            <th>Sensitive</th>
                                                            <th>Stock (%)</th>
                                                            <th>Benchmark</th>
                                                        </tr>
                                                        {sensitiveSectorData?.map((data, index) => (
                                                            <tr key={index}>
                                                                <td>{getSectorType(data)}</td>
                                                                <td>{parseFloat(data["#text"]).toFixed(2)}</td>
                                                                <td>{sensitiveSectorBenchmark[index] ? parseFloat(sensitiveSectorBenchmark[index]["#text"]).toFixed(2) : '-'}</td>
                                                            </tr>
                                                        ))}
                                                        <tr className="outline bold total-value">
                                                            <td>Total</td>
                                                            <td>{sensitiveSectorTotal?.toFixed(2)}</td>
                                                            <td>{sensitiveSectorBmarkTotal?.toFixed(2)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col-md-6">
                                                <table className="bgStyleTable asset-table">
                                                    <tbody>
                                                        <tr>
                                                            <th>Defensive</th>
                                                            <th>Stock %</th>
                                                            <th>Benchmark</th>
                                                        </tr>
                                                        {defensiveSectorData?.map((data, index) => (
                                                            <tr key={index}>
                                                                <td>{getSectorType(data)}</td>
                                                                <td>{parseFloat(data["#text"]).toFixed(2)}</td>
                                                                <td>{defensiveSectorBenchmark[index] ? parseFloat(defensiveSectorBenchmark[index]["#text"]).toFixed(2) : '-'}</td>
                                                            </tr>
                                                        ))}
                                                        <tr className="outline bold total-value">
                                                            <td>Total</td>
                                                            <td>{defensiveSectorTotal?.toFixed(2)}</td>
                                                            <td>{defensiveSectorBmarkTotal?.toFixed(2)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {equityStatisticsData && (
                                <div className="col-md-12">
                                    <div className="recomm-box">
                                        <div className="green cardBox d-flex">
                                            <div>
                                                {" "}
                                                <img
                                                    alt=""
                                                    src={imagePath + "/static/media/DG/reports/current-investments/investment-styles.svg"}
                                                />
                                            </div>
                                            <div> Investment Style</div>
                                        </div>
                                        <div className="rContent ">
                                            <p
                                            dangerouslySetInnerHTML={{
                                                __html: sectionText ? sectionText[50][0]['field2']  : "",
                                            }}
                                            ></p>
                                        </div>
                                        <div className="row align-items-center">
                                            <div className="col-md-5">
                                                <div
                                                    id="investmentStyle"
                                                    data-highcharts-chart={3}
                                                    style={{ overflow: "hidden" }}
                                                >
                                                    {styleBoxData && (
                                                        <InvestmentStyle
                                                            styleBoxData={styleBoxData}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-7">
                                                <div className="table-responsive rTable">
                                                    <table className="bgStyleTable asset-table">
                                                        <tbody>
                                                            <tr>
                                                                <th>Equity Style</th>
                                                                <th>Portfolio (%)</th>
                                                                <th>Benchmark</th>
                                                            </tr>
                                                            {!equityStatisticsData?.["ProspectiveBookValueYield"] &&
                                                                !equityStatisticsData?.["ProspectiveEarningsYield"] &&
                                                                !equityStatisticsData?.["ProspectiveCashFlowYield"] && (
                                                                    <tr>
                                                                        <td colSpan="2" style={{ textAlign: "center" }}>
                                                                            No data available.
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            {equityStatisticsData?.["ProspectiveBookValueYield"] && (
                                                                <tr>
                                                                    <td>Price/Book Ratio</td>
                                                                    <td className="">{parseFloat(equityStatisticsData?.["ProspectiveBookValueYield"]["#text"]).toFixed(2)}</td>
                                                                    <td className="">{parseFloat(equityStatisticsBenchmark?.["ProspectiveBookValueYield"]).toFixed(2)}</td>
                                                                </tr>
                                                            )}
                                                            {equityStatisticsData?.["ProspectiveEarningsYield"] && (
                                                                <tr>
                                                                    <td>Price/Earnings</td>
                                                                    <td className="">{parseFloat(equityStatisticsData?.["ProspectiveEarningsYield"]["#text"]).toFixed(2)}</td>
                                                                    <td className="">{parseFloat(equityStatisticsBenchmark?.["ProspectiveEarningsYield"]).toFixed(2)}</td>
                                                                </tr>
                                                            )}
                                                            {equityStatisticsData?.["ProspectiveCashFlowYield"] && (
                                                                <tr>
                                                                    <td>Price/Cashflow</td>
                                                                    <td className="">{parseFloat(equityStatisticsData?.["ProspectiveCashFlowYield"]["#text"]).toFixed(2)}</td>
                                                                    <td className="">{parseFloat(equityStatisticsBenchmark?.["ProspectiveCashFlowYield"]).toFixed(2)}</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {underlyingHoldingData && (
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
                                            <div> Top 10 Underlying Holdings</div>
                                        </div>
                                        <div className="rContent">
                                             <p
                                            dangerouslySetInnerHTML={{
                                                __html: sectionText ? sectionText[50][0]['field3']  : "",
                                            }}
                                            ></p>
                                        </div>
                                        <table className="bgStyleTable asset-table">
                                            <tbody>
                                                <tr>
                                                    <th>Assets (%)</th>
                                                    <th>Name</th>
                                                    <th>Type</th>
                                                    <th>Sector</th>
                                                    <th>Country</th>
                                                </tr>
                                                {/* {underlyingHoldingData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" style={{ textAlign: "center" }}>
                                                            No data available.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    underlyingHoldingData
                                                        ?.slice(0, 10) // Select only the first 10 elements
                                                        ?.map((data, index) => (
                                                            <tr key={index}>
                                                                <td>{parseFloat(data.Weight).toFixed(2)}</td>
                                                                <td>{data.Name}</td>
                                                                <td>{getSecurityType(data)}</td>
                                                                <td>{getSectorType(data)}</td>
                                                                <td>{data.CountryId}</td>
                                                            </tr>
                                                        ))
                                                )} */}
                                                {underlyingHoldingData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" style={{ textAlign: "center" }}>
                                                            No records found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    Array.isArray(underlyingHoldingData) ? (
                                                        underlyingHoldingData
                                                            .slice(0, 10) // Select only the first 10 elements
                                                            .map((data, index) => (
                                                                <tr key={index}>
                                                                    <td>{parseFloat(data.Weight).toFixed(2)}</td>
                                                                    <td>{data.Name}</td>
                                                                    <td>{getSecurityType(data)}</td>
                                                                    <td>{getSectorType(data)}</td>
                                                                    <td>{data.CountryId}</td>
                                                                </tr>
                                                            ))
                                                    ) : (
                                                        <tr>
                                                            <td>{parseFloat(underlyingHoldingData.Weight).toFixed(2)}</td>
                                                            <td>{underlyingHoldingData.Name}</td>
                                                            <td>{getSecurityType(underlyingHoldingData)}</td>
                                                            <td>{getSectorType(underlyingHoldingData)}</td>
                                                            <td>{underlyingHoldingData.CountryId}</td>
                                                        </tr>
                                                    )
                                                )}
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
                            )}
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
    );
}

export default PortfolioData;