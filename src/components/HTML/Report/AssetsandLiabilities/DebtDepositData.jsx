import { useEffect, useState } from "react";
import FixedDeposit from "../../../../Assets/Datagathering/Graph/FixedDeposit";
import FixedDepositRate from "../../../../Assets/Datagathering/Graph/FixedDepositRate";
import SukanyaYojna from "../../../../Assets/Datagathering/Graph/SukanyaYojna";
import { numberFormat } from "../../../../common_utilities";
import { imagePath } from "../../../../constants";

function DebtDepositData(props) {

    const PARData = props.PARData;
    const debtDeposit = props.PARData?.ssy_recomm;
    const fixedDebtDeposit = props.PARData?.fddata_recomm;
    const sectionText = props.PARData?.section_text;

    const [pmvalues, setPmvalues] = useState([]);
    const [pmtkeys, setPmtkeys] = useState([]);
    const [ssyGraphdata, setSsyGraphdata] = useState([]);
    const [cashflow, setCashflow] = useState([]);

    useEffect(() => {
        if (debtDeposit && !debtDeposit.ssy_isinvested) {
            const pmValuesArray = [];
            const pmKeysArray = [];
            const cashflowArray = [];

            Object.entries(props.PARData?.ssy_recomm?.pmt_array)?.forEach(([key, val]) => {
                pmValuesArray?.push(val);
                pmKeysArray?.push(key);
            });

            Object.entries(props.PARData?.ssy_recomm?.m_cashflow)?.forEach(([key, val]) => {
                cashflowArray?.push(val);
            });

            setPmvalues(pmValuesArray);
            setPmtkeys(pmKeysArray);
            setCashflow(cashflowArray);

            const totalInvestment = props.PARData?.ssy_recomm?.total_investemnt;
            const totalInterest = Math.abs(props.PARData?.ssy_recomm?.maturity_amount) - Math.abs(props.PARData?.ssy_recomm?.total_investemnt);

            setSsyGraphdata([
                { name: 'Total Investment', y: totalInvestment },
                { name: 'Total Interest', y: totalInterest },
            ]);
        }
    }, [props.PARData?.ssy_recomm]);
    
    return (
        <div>

            {Boolean(debtDeposit && !debtDeposit.ssy_isinvested && Object.keys(debtDeposit).length > 0) ||
                Boolean(fixedDebtDeposit && Object.keys(fixedDebtDeposit).length > 0) ?
                (
                    <div>
                        <div className="debt-deposit">
                            <div className="row">
                                {(debtDeposit && !debtDeposit.ssy_isinvested && Object.keys(debtDeposit).length > 0) ? (
                                    <div
                                        className="col-md-12"
                                    >
                                        <div className="recomm-box">
                                            <div className="green cardBox d-flex">
                                                <div>
                                                    {" "}
                                                    <img
                                                        alt=""
                                                        src={imagePath + "/static/media/DG/reports/current-investments/sukanya-samriddhi-yojana.svg"}
                                                    />
                                                </div>
                                                <div> Sukanya Samriddhi Yojana </div>
                                            </div>

                                            <div
                                                className="rContent "
                                            >
                                                <p
                                                dangerouslySetInnerHTML={{
                                                    __html: sectionText ? sectionText[68][0]['field0']  : "",
                                                }}
                                                ></p>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="rTable">
                                                        <table className="bgStyleTable">
                                                            <tbody>
                                                                <tr className="color">
                                                                    <td
                                                                        colSpan={2}
                                                                        style={{
                                                                            textAlign: "center",
                                                                        }}
                                                                    >
                                                                        Sukanya Samriddhi Yojana
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Yearly Investment (₹)</td>
                                                                    <td>
                                                                        {debtDeposit?.pmt_array ? numberFormat(debtDeposit.pmt_array[Object.keys(debtDeposit.pmt_array)[0]] || 0) : '0'}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Year of Maturity</td>
                                                                    <td>
                                                                        {debtDeposit?.maturity_year || 0}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Total Investment (₹)</td>
                                                                    <td>{debtDeposit?.total_investemnt ? numberFormat(debtDeposit.total_investemnt) : '0'}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Interest Amount (₹)</td>
                                                                    <td>{numberFormat(Math.round(debtDeposit?.maturity_amount - debtDeposit?.total_investemnt) || 0)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Interest Rate</td>
                                                                    <td>
                                                                        {debtDeposit?.ssy_intrest_rate ?
                                                                            `${debtDeposit.ssy_intrest_rate}%`
                                                                            : '0%'}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Maturity Value (₹)</td>
                                                                    <td>{numberFormat(Math.round(debtDeposit?.maturity_amount) || 0)}</td>
                                                                </tr>
                                                            </tbody>
                                                            <tfoot>
                                                                <tr>
                                                                    <td
                                                                        style={{ padding: 0 }}
                                                                        colSpan={4}
                                                                    />
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="col-md-5 mt-3">
                                                    <div className="col-md-11 ">
                                                        <div className="text-center">
                                                            <h4>Sukanya Samriddhi Yojana</h4>
                                                        </div>
                                                        <div className="d-grid place-item-center">
                                                            <SukanyaYojna
                                                                ssyGraphdata={ssyGraphdata}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-responsive rTable">
                                                <table className="bgStyleTable">
                                                    <tbody>
                                                        <tr>
                                                            <th>Daughter Age</th>
                                                            <th>Year</th>
                                                            <th>Amount Deposited (₹)(A)</th>
                                                            <th>
                                                                Interest Earned Corpus (₹)(B)
                                                            </th>
                                                            <th>
                                                                Year End Balanced (₹)(C) =
                                                                (A)+(B)
                                                            </th>
                                                        </tr>
                                                        {pmtkeys.map((year, index) => {
                                                            const age = props.PARData?.ssy_recomm?.daughter_age + index;
                                                            const amountDeposited = numberFormat(pmvalues[index]);
                                                            const interestEarned = numberFormat(Math.round(cashflow[index] - pmvalues[index]));
                                                            const yearEndBalance = numberFormat(Math.round(cashflow[index]));

                                                            return (
                                                                <tr key={index}>
                                                                    <td>{age}</td>
                                                                    <td>{index + 1}</td>
                                                                    <td>{amountDeposited}</td>
                                                                    <td>{interestEarned}</td>
                                                                    <td>{yearEndBalance}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                {(fixedDebtDeposit && Object.keys(fixedDebtDeposit).length > 0) ? (
                                    <div className="col-md-12">
                                        <div>
                                            {/*  <div> */}
                                            <div className="recomm-box">
                                                <div className="green cardBox d-flex">
                                                    <div>
                                                        {" "}
                                                        <img
                                                            alt=""
                                                            src={imagePath + "/static/media/DG/reports/current-investments/debt-deposit-recommendation.svg"}
                                                        />
                                                    </div>
                                                    <div>
                                                        {" "}
                                                        Debt Deposit Recommendation
                                                    </div>
                                                </div>
                                                <div className="rContent ">
                                                    <p>
                                                        Fixed deposits are a safe,
                                                        convenient way to start investing.
                                                        On taking into account the data that
                                                        you have provided Fintoo regarding
                                                        your existing FD investments, the
                                                        table below shows you alternative FD
                                                        schemes that you can switch to for
                                                        higher returns.
                                                    </p>
                                                </div>
                                                {/* ngRepeat: fddata in fddata_recomm */}
                                                <div className="">
                                                    <div className="table-responsive rTable">
                                                        <table className="bgStyleTable">
                                                            <tbody>
                                                                <tr>
                                                                    <th>Name of the Holder </th>
                                                                    <th>Name of Assets </th>
                                                                    <th>Invested Product</th>
                                                                    <th>Rate of Return</th>
                                                                </tr>
                                                                <tr>
                                                                    <td className="">
                                                                        Gokul Sharma
                                                                    </td>
                                                                    <td className="">
                                                                        Fixed deposit
                                                                    </td>
                                                                    <td className="">
                                                                        Fixed Deposit
                                                                    </td>
                                                                    <td className="">5.25%</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="row align-items-center">
                                                        <div className="col-md-6 mt-3" style={{ backgroundColor: "#fff" }}>
                                                            <div className="col-md-11 ">
                                                                <div className="text-center">
                                                                    <h4>Fixed deposit</h4>
                                                                </div>
                                                                <div className="d-grid place-item-center">
                                                                    <FixedDeposit />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="table-responsive rTable">
                                                                <table className="bgStyleTable">
                                                                    <thead>
                                                                        <tr>
                                                                            <th colSpan={4} className="text-center">
                                                                                Recommendation Rate
                                                                            </th>
                                                                            {/* <th></th>
                                            <th></th> */}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr className="outline">
                                                                            <td>Name</td>
                                                                            <td>FD Type</td>
                                                                            <td>Tax Type </td>
                                                                            <td>Interest Rate (%)</td>
                                                                        </tr>
                                                                        {/* ngRepeat: dd in fddata.recommendation */}
                                                                        <tr className="">
                                                                            <td className="">
                                                                                Axis Bank
                                                                            </td>
                                                                            <td>Bank FD</td>
                                                                            <td>Taxable</td>
                                                                            <td className="">5.4</td>
                                                                        </tr>
                                                                        {/* end ngRepeat: dd in fddata.recommendation */}
                                                                        <tr className="">
                                                                            <td className="">
                                                                                Bajaj Finance
                                                                            </td>
                                                                            <td>Bank FD</td>
                                                                            <td>Taxable</td>
                                                                            <td className="">7</td>
                                                                        </tr>
                                                                        {/* end ngRepeat: dd in fddata.recommendation */}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        {/* <p>Note: This rate which are given is before TAX & After Comparing with your Existing rate our Recommendation is HDFC & Bajaj Finance is providing better rate. The Tenure which we have taken is the same which
                        you have provided us in Data gathering.</p>*/}
                                                        <div className="rContent pt-2 ">
                                                            <p>
                                                                Note: The table showcases
                                                                pre-tax returns. Keep in mind
                                                                that interest earned via fixed
                                                                deposits is taxable, and actual
                                                                post-tax returns will vary based
                                                                on the tax slab you fall under.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* end ngRepeat: fddata in fddata_recomm */}
                                                <div className="">
                                                    <div className="table-responsive rTable">
                                                        <table className="bgStyleTable">
                                                            <tbody>
                                                                <tr>
                                                                    <th>Name of the Holder </th>
                                                                    <th>Name of Assets </th>
                                                                    <th>Invested Product</th>
                                                                    <th>Rate of Return</th>
                                                                </tr>
                                                                <tr>
                                                                    <td className="">
                                                                        Gokul Sharma
                                                                    </td>
                                                                    <td className="">
                                                                        Fixed deposit
                                                                    </td>
                                                                    <td className="">
                                                                        Fixed Deposit
                                                                    </td>
                                                                    <td className="">7.00%</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="row align-items-center">
                                                        <div className="col-md-6 mt-3" style={{ backgroundColor: "#fff" }}>
                                                            <div className="col-md-11 ">
                                                                <div className="text-center">
                                                                    <h4>Fixed deposit</h4>
                                                                </div>
                                                                <div className="d-grid place-item-center">
                                                                    <FixedDepositRate />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="table-responsive rTable">
                                                                <table className="bgStyleTable">
                                                                    <thead>
                                                                        <tr>
                                                                            <th colSpan={4} className="text-center">
                                                                                Recommendation Rate
                                                                            </th>
                                                                            {/* <th></th>
                                            <th></th> */}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr className="outline">
                                                                            <td>Name</td>
                                                                            <td>FD Type</td>
                                                                            <td>Tax Type </td>
                                                                            <td>Interest Rate (%)</td>
                                                                        </tr>
                                                                        <tr className="">
                                                                            <td className="">
                                                                                Bajaj Finance
                                                                            </td>
                                                                            <td>Bank FD</td>
                                                                            <td>Taxable</td>
                                                                            <td className="">7.1</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className="rContent pt-2 ">
                                                            <p>
                                                                Note: The table showcases
                                                                pre-tax returns. Keep in mind
                                                                that interest earned via fixed
                                                                deposits is taxable, and actual
                                                                post-tax returns will vary based
                                                                on the tax slab you fall under.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                ) : (

                    <div
                        className="no-data-found text-md-center"
                    >
                        <div className="container">
                            <div className="row justify-content-center align-items-center">
                                <div className="col-md-10">
                                    <img
                                        alt="Data not found"
                                        src={imagePath + "/static/media/DG/data-not-found.svg"}
                                    />
                                    <p>
                                        Since you missed to fill in the required
                                        information which is needed here, we are
                                        not able to show you this section. Kindly
                                        click on below button to provide all the
                                        necessary inputs. Providing all the
                                        information as asked will ensure more
                                        accurate financial planning report. Once
                                        you fill in the data, same will be
                                        reflected here.
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
        </div >
    )
}

export default DebtDepositData;