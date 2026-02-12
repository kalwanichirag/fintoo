import { useEffect, useState } from "react";
import { indianRupeeFormat } from "../../../../common_utilities";
import { imagePath } from "../../../../constants";

function HoldingsData(props) {

    const PARData = props.PARData
    // Handle both old and new API response formats
    const holdingsOverlapData = props.PARData?.json_response?.Portfolio?.HoldingOverlap?.Holding;
    // Get holdings data from the new API response format if available
    const portfolioHoldingData = props.PARData?.json_response?.Portfolio?.Holdings?.Holding;
    const [overlapData, setOverlapData] = useState("");
    const [holdingsData, setHoldingsData] = useState(null);
    const sectionText = props.PARData?.section_text;

    useEffect(() => {
        // Process holdings overlap data if available
        if (holdingsOverlapData) {
            const first10Holdings = holdingsOverlapData?.slice(0, 10); // Take only the first 10 elements

            const holdingOverlapData = first10Holdings?.flatMap((holding) => {
                const newHoldingOverlapData = [];
                newHoldingOverlapData?.push(holding);

                if (!Array.isArray(holding['ParentHoldings']['Holding'])) {
                    holding['ParentHoldings']['Holding'] = [holding['ParentHoldings']['Holding']];
                }

                holding['ParentHoldings']['Holding']?.forEach((parentHolding) => {
                    const performanceData = portfolioHoldingData?.[parentHolding['@id']];
                    if (performanceData) {
                        parentHolding['pIsin'] = performanceData?.['ISIN'] || performanceData?.['SecurityId'];
                        parentHolding['Pname'] = performanceData?.['Name'];
                        parentHolding['pdate'] = performanceData?.['PortfolioDate'];
                    }
                    newHoldingOverlapData?.push(parentHolding);
                });

                return newHoldingOverlapData;
            });

            setOverlapData(holdingOverlapData);
        }

        // Process the new holdings data format
        if (portfolioHoldingData) {
            // Check if portfolioHoldingData is an array or a single object
            const holdingsArray = Array.isArray(portfolioHoldingData) ? portfolioHoldingData : [portfolioHoldingData];
            setHoldingsData(holdingsArray);
        }

    }, [portfolioHoldingData, holdingsOverlapData]);

    function getSectorType(data) {
        switch (data["GlobalSectorId"] || data['@type'] || data) {
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


    return (

        <div>
            {/* Display holdings data from the new API format if available */}         
            {holdingsOverlapData && Object.keys(holdingsOverlapData).length > 0 ?
                (
                    <div>
                        <div className="holdings">
                            <h4 className="rTitle">
                                <img
                                    ng-src="/static/media/DG/reports/current-investments/holdings.svg"
                                    alt=""
                                    src={imagePath + "/static/media/DG/reports/current-investments/holdings.svg"}
                                />
                                Holdings
                            </h4>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="recomm-box">
                                        <div className="green cardBox d-flex">
                                            <div>
                                                {" "}
                                                <img
                                                    alt=""
                                                    src={imagePath + "/static/media/DG/reports/current-investments/holdings-overlap.svg"}
                                                />
                                            </div>
                                            <div> Holdings Overlap</div>
                                        </div>
                                        <div
                                            className="rContent "
                                        >
                                            <p
                                            dangerouslySetInnerHTML={{
                                                __html: sectionText ? sectionText[52][0]['field1']  : "",
                                            }}
                                            ></p>
                                        </div>
                                        <div className="table-responsive rTable">
                                            <table className="bgStyleTable asset-table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>ISIN</th>
                                                        <th>Weightage in Portfolio (%)</th>
                                                        <th>Sector</th>
                                                        <th>Portfolio Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {overlapData && overlapData.length > 0 ? (
                                                        overlapData?.map((item, index) => (
                                                            <tr key={index} style={item["@securityId"] ? { fontWeight: "bold" } : null}>
                                                                {item["@securityId"] ? <td>{item.Name}</td> : <td>{item.Pname}</td>}
                                                                {item["@securityId"] ? <td>{item.ISIN}</td> : <td>{item.pIsin}</td>}
                                                                {item["@securityId"] ? <td>{" "}</td> : <td>{parseFloat(item.WeightInParent).toFixed(2)}</td>}
                                                                {item && item["@securityId"] && item['GlobalSectorId'] ? (
                                                                    <td>{getSectorType(item.GlobalSectorId) ?? "null"}</td>
                                                                ) : (
                                                                    <td>{" "}</td>
                                                                )}

                                                                <td>
                                                                    {item.pdate
                                                                        ? item.pdate.split("-").reverse().join("/")
                                                                        : ""}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5">No data available</td>
                                                        </tr>
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
                )
            }
        </div>
    )
}

export default HoldingsData;