import React, { useEffect, useState } from "react";
import Styles from "./Networth.module.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import NetworthImg from "./Networth.svg";
import FintooLoader from "../../../../FintooLoader";
function formatToIndianRupee(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace("₹", "");
}
const NetworthProjection = ({
  showProjection,
  onBackClick,
  networthProjection,
}) => {
  const [year, setYear] = useState(2023);
  const DummyAmt = 155000;
  const DummyBal = 8733;
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    document.body.classList.add("dg-layout");
    document.body.classList.add("rp-layout");
    // Set loading to false once component is mounted and props are available
    setIsLoading(false);
    return () => {
      document.body.classList.remove("dg-layout");
      document.body.classList.remove("rp-layout");
    };
  }, []);
  
  return (
    <>
    <FintooLoader isLoading={isLoading} />
    <div className={`${Styles.NetworthProjection}`}>
      <div
        onClick={onBackClick}
        style={{
          width: "max-content",
        }}
        className={`pointer  ${Styles.backArrow}`}
      >
        <div>
          <IoIosArrowRoundBack />
        </div>
        <div
          style={{ fontSize: "1rem", fontWeight: "600" }}
          className="ps-1 pt-2"
        >
          Back
        </div>
      </div>
      <div className={`${Styles.ProjectTitle}`}>
        <div>
          <img src={NetworthImg} />
        </div>
        <div className={`ms-2 mt-2 ${Styles.label}`}>Net Worth Projections</div>
      </div>
      <div
        className="rContent "

      >
        <p>This net worth projection table provides a detailed forecast of future financial standing by outlining expected assets, liabilities, and net worth on a year-end closing basis.</p>
      </div>
      {/* Table Data */}
      <div className="mt-2 overflow-auto">
        <div className="table-responsive rTable">
          <table className="bgStyleTable">
            <tbody>
              <tr>
                <th className="text-center">Year</th>
                <th>Assets</th>
                <th>Liabilities</th>
                <th>Networth</th>
              </tr>
              {Object.keys(networthProjection).length > 0 &&
                Object.keys(networthProjection.assets_data).map(
                  (year, index) => (
                    <tr key={index} className="tabledata">
                      <td className="text-center">{year}</td>
                      <td className={`${Styles.assetamt}`}>
                        <div className={`${Styles.amt}`}>
                          {formatToIndianRupee(
                            networthProjection.assets_data[year].total
                          )}
                        </div>
                        <div className={`${Styles.assetList}`}>
                          <span>
                            Equity -{" "}
                            {formatToIndianRupee(
                              networthProjection.assets_data[year].equity
                            )}
                          </span>
                          <span
                            className={`${Styles.seprateLine} ${Styles.spaceBetween}`}
                          ></span>
                          <span>
                            Debt -{" "}
                            {formatToIndianRupee(
                              networthProjection.assets_data[year].debt
                            )}
                          </span>
                          <span
                            className={`${Styles.seprateLine} ${Styles.spaceBetween}`}
                          ></span>
                          <span>
                            Alternate -{" "}
                            {formatToIndianRupee(
                              networthProjection.assets_data[year].alternate
                            )}
                          </span>
                          <span
                            className={`${Styles.seprateLine} ${Styles.spaceBetween}`}
                          ></span>
                          <span>
                            Gold -{" "}
                            {formatToIndianRupee(
                              networthProjection.assets_data[year].commodities
                            )}
                          </span>
                          <span
                            className={`${Styles.seprateLine} ${Styles.spaceBetween}`}
                          ></span>
                          <span>
                            Real Estate -{" "}
                            {formatToIndianRupee(
                              networthProjection.assets_data[year].real_estate
                            )}
                          </span>
                          <span
                            className={`${Styles.seprateLine} ${Styles.spaceBetween}`}
                          ></span>
                          <span>
                            Insurance -{" "}
                            {formatToIndianRupee(
                              networthProjection.assets_data[year].insurance
                            )}
                          </span>                          
                        </div>
                      </td>
                      <td className={`${Styles.assetamt}`}>
                        <div className={`${Styles.amt}`}>
                          {formatToIndianRupee(
                            networthProjection.liability_data[year].total
                          )}
                        </div>
                        <div className={`${Styles.assetList}`}>
                          {Object.keys(
                            networthProjection.liability_data[year]
                          ).map((item,index) => (
                            <React.Fragment key={index}>
                              {item != "total" && (
                                <>
                                  <span>
                                    {item} -{" "}
                                    {formatToIndianRupee(
                                      networthProjection.liability_data[year][
                                        item
                                      ]
                                    )}
                                  </span>
                                  <span
                                    className={`${Styles.seprateLine} ${Styles.spaceBetween}`}
                                  ></span>
                                </>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </td>
                      <td className={`${Styles.assetamt}`}>
                        <div className={`${Styles.amt}`}>
                          {formatToIndianRupee(
                            networthProjection.networth_data[year]
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default NetworthProjection;
