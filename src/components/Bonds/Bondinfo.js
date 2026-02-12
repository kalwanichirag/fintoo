import React, { useState } from "react";
import Styles from "../Stocks/IPOStock/style.module.css";
import BondsCss from "./Bonds.module.css";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BiInfoCircle } from "react-icons/bi";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
function Bondinfo() {
  const Info = styled(ReactTooltip)`
    max-width: 278px;
    padding-top: 9px;
    background: "#fff";
  `;
  const InfoMessage = styled.p`
    font-size: 13px;
    line-height: 1.4;
    text-align: left;
  `;
  return (
    <div>
      <div className={`${BondsCss.BondsBoxeslist}`}>
        <div id="Highlights" className={`p-4 ${Styles.iposectionbox}`}>
          <p className={`${BondsCss.sectionName}`}>Highlights</p>
          <div className={`${BondsCss.BondssectionDetails}`}>
            <div>
              <div className={`${Styles.ipolabel}`}>Open Price</div>
              <div className={`${BondsCss.Bondval}`}>₹ 10,14,960</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Close Price</div>
              <div className={`${BondsCss.Bondval}`}>₹ 10,14,960</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>High Price</div>
              <div className={`${BondsCss.Bondval}`}>₹ 10,14,960</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Low Price</div>
              <div className={`${BondsCss.Bondval}`}>₹ 10,14,960</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>ISIN</div>
              <div className={`${BondsCss.Bondval}`}>INE0M2307131</div>
            </div>
          </div>
          <div className={`mt-4 ${BondsCss.Bonddesc}`}>
            <div className={`${BondsCss.Bondlabel}`}>Description</div>
            <div className={`${BondsCss.Bondinfo}`}>
              8.74% Secured Rated Listed Redeemable Non Convertible Bond Series
              li 2022-23, Sub Series C Date of Maturity 28/11/2025{" "}
            </div>
          </div>
        </div>
        <div id="keymetrics" className={`${Styles.iposectionbox}`}>
          <p className={`${BondsCss.sectionName}`}>Key Metrics</p>
          <div className={`${BondsCss.BondskeysectionDetails}`}>
            <div>
              <div className={`${Styles.ipolabel}`}>Face Value</div>
              <div className={`${BondsCss.Bondval}`}>₹ 10,00,000</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Coupon Rate</div>
              <div className={`${BondsCss.Bondval}`}>8.40%</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Yield(YTM)</div>
              <div className={`${BondsCss.Bondval}`}>8.05%</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Maturity Date</div>
              <div className={`${BondsCss.Bondval}`}>
                31<sup>st</sup> July 2028{" "}
              </div>
            </div>
          </div>
          <hr className={` ${BondsCss.hrline}`} />
          <div className={` ${BondsCss.BondskeysectionDetails}`}>
            <div>
              <div className={`${Styles.ipolabel}`}>Payment Term</div>
              <div className={`${BondsCss.Bondval}`}>Quaterly</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Remaining Period</div>
              <div className={`${BondsCss.Bondval}`}>5y 4m 29d</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Issue Date</div>
              <div className={`${BondsCss.Bondval}`}>
                31<sup>st</sup> July 2018
              </div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Traded Date</div>
              <div className={`${BondsCss.Bondval}`}>
                23<sup>th</sup> February 2023{" "}
              </div>
            </div>
          </div>
          <hr className={` ${BondsCss.hrline}`} />
          <div className={` ${BondsCss.BondskeysectionDetails}`}>
            <div>
              <div className={`${Styles.ipolabel}`}>Credit Rating</div>
              <div className={`${BondsCss.Bondval}`}>AAA</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>Security</div>
              <div className={`${BondsCss.Bondval}`}>Secured</div>
            </div>
            <div>
              <div className={`${Styles.ipolabel}`}>
                Next Interset Payment Date
              </div>
              <div className={`${BondsCss.Bondval}`}>8.05%</div>
            </div>
            <div></div>
          </div>
          <br />
        </div>
        <div id="Comparison" className={`p-0 ${BondsCss.BondComparebox}`}>
          <p className={`${BondsCss.sectionName}`}>Compare With Other Bond</p>
          <div className={`${BondsCss.CompareTable}`}>
            <table>
              <thead className={`${BondsCss.CompareThead}`}>
                <tr>
                  <th>Bond Name</th>
                  <th>Face Value</th>
                  <th>Coupon Rate</th>
                  <th>Credit Rating</th>
                  <th>Maturity Date</th>
                  <th>Payment Freq</th>
                </tr>
              </thead>
              <tbody className={`${BondsCss.bondTableData}`}>
                <tr>
                  <td className={`${BondsCss.bondTableName}`}>Bajaj Finanace Ltd.</td>
                  <td>₹ 10,00,000</td>
                  <td>7.5%</td>
                  <td>AA+</td>
                  <td>06/09/2026</td>
                  <td>Semi-Annually</td>
                </tr>
                <tr>
                  <td className={`${BondsCss.bondTableName}`}>Bajaj Finanace Ltd.</td>
                  <td>₹ 10,00,000</td>
                  <td>7.5%</td>
                  <td>AA+</td>
                  <td>06/09/2026</td>
                  <td>Semi-Annually</td>
                </tr>
                <tr>
                  <td className={`${BondsCss.bondTableName}`}>Bajaj Finanace Ltd.</td>
                  <td>₹ 10,00,000</td>
                  <td>7.5%</td>
                  <td>AA+</td>
                  <td>06/09/2026</td>
                  <td>Semi-Annually</td>
                </tr>
                <tr>
                  <td className={`${BondsCss.bondTableName}`}>Bajaj Finanace Ltd.</td>
                  <td>₹ 10,00,000</td>
                  <td>7.5%</td>
                  <td>AA+</td>
                  <td>06/09/2026</td>
                  <td>Semi-Annually</td>
                </tr>
                <tr>
                  <td className={`${BondsCss.bondTableName}`}>Bajaj Finanace Ltd.</td>
                  <td>₹ 10,00,000</td>
                  <td>7.5%</td>
                  <td>AA+</td>
                  <td>06/09/2026</td>
                  <td>Semi-Annually</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bondinfo;
