import React, { useState, useEffect } from "react";
import Styles from "./style.module.css";
import Scorecardimg from "./Assets/05_01_top_icon_scorecard.png";
function Scorecard() {
  return (
    <>
      <div>
        <div className={`${Styles.ReportProfile}`}>
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <div>
                <img width={30} src={Scorecardimg} />
              </div>
              <div className={`ms-md-4 ${Styles.RiskData}`}>
                <div className={`${Styles.riskTitle}`}>Your Scorecard</div>
                <p className={`${Styles.riskPara}`}>
                  We know that you are committed to improving your money
                  management skills and strengthening your financial health.
                  However, before you make any decisions, it's a good idea to
                  analyse where you stand currently and get an idea about your
                  strengths and weaknesses. You can learn this through financial
                  ratios. We have evaluated your performance with the help of{" "}
                  <b>5 </b>
                  such ratios and scored you on a scale of <b>1 to 100</b>. Once
                  you know where you stand you can chart your next steps
                  accordingly.
                </p>
              </div>
            </div>
          </div>
          <div className={`${Styles.ScorecardDetails}`}>
            <table>
              <tr>
                <td>
                  <div>
                    <div className={`${Styles.ScoreRound}`}>
                      <div className={`${Styles.innerBox}`}>
                        <span className={`${Styles.ScoreVal}`}>20 | 20</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className={`${Styles.RatioTable}`}>
                  <div className={`${Styles.RatioType}`}>Saving Ratio</div>
                  <div className={`${Styles.RatioTData}`}>
                    <div>
                      <table>
                        <tr>
                          <th>Savings</th>
                          <th>Total Income</th>
                          <th></th>
                        </tr>
                        <tr>
                          <td> &#8377; 7.90 Lac </td>
                          <td> &#8377; 12.90 Lac</td>
                          <td>
                            {" "}
                            <b>64 %</b>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    With increasing inflation and a longer lifespan, it is
                    incredibly important for you to be a smart saver! We are not
                    saying that you shouldn't enjoy your life, but remember that
                    the more you save, the more you can grow your wealth.
                    Currently, you are saving over <b>51%</b> of your income.
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Scorecard;
