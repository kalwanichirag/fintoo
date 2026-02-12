import { useEffect } from "react";

import MainLayout from "../components/Layout/MainLayout";
import GuestLayout from "../components/Layout/GuestLayout";

const InvestorCharter = () => {
  useEffect(() => {
    document.body.classList.add("main-layout");
  }, []);
  return (
    <GuestLayout>
      <section className="privacy-policy-section" style={{ paddingTop: 30 }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>Investor Charter in respect of Investment Adviser (IA)</h2>
            </div>
            <div className="col-md-12">
              <h4 className="fw-bold"> A. Vision and Mission Statements for investors</h4>
              <b>Vision</b>
              <p>Invest with knowledge &amp; safety.</p>
              <b>Mission</b>
              <p>
                Every investor should be able to invest in right investment
                products based on their needs, manage and monitor them to meet
                their goals, access reports and enjoy financial wellness.
              </p>
              <h4 className="fw-bold">
                  B. Details of business transacted by the Research Analyst with
                respect to the investors.
              </h4>
              <ol>
                <li>
                  To enter into an agreement with the client providing all
                  details including fee details, aspect of Conflict of interest
                  disclosure and maintaining confidentiality of information.
                </li>
                <br />
                <li>
                  To do a proper and unbiased risk – profiling and suitability
                  assessment of the client.
                </li>
                <br />
                <li>
                  To obtain registration with Know Your Client Registration
                  Agency (KRA) and Central Know Your Customer Registry (CKYC).
                </li>
                <br />
                <li>To conduct audit annually.</li>
                <br />
                <li>To disclose the status of complaints in its website.</li>
                <br />
                <li>
                  To disclose the name, proprietor name, type of registration,
                  registration number, validity, complete address with telephone
                  numbers and associated SEBI regional/local Office details in
                  its website.
                </li>
                <br />
                <li>To employ only qualified and certified employees.</li>
                <br />
                <li>To deal with clients only from official number</li>
                <br />
                <li>
                  To maintain records of interactions, with all clients
                  including prospective clients (prior to onboarding), where any
                  conversation related to advice has taken place.
                </li>
                <br />
              </ol>
              <h4 className="fw-bold">
                  C. Details of services provided to investors (No Indicative
                Timelines)
              </h4>
              <ol>
                <li>Onboarding of Clients</li>
                <ul>
                  <li>Sharing of agreement copy</li>
                  <li>Completing KYC of clients</li>
                </ul>
                <br />
                <li>Disclosure to Clients</li>
                <ul>
                  <li>
                    To provide full disclosure about its business, affiliations,
                    compensation in the agreement.
                  </li>
                  <li>
                    To not access client’s accounts or holdings for offering
                    advice.
                  </li>
                  <li>To disclose the risk profile to the client.</li>
                </ul>
                <br />
                <li>
                  To provide investment advice to the client based on the
                  risk-profiling of the clients
                </li>
                <br />
              </ol>
              <h4 className="fw-bold">
                  D. Details of grievance redressal mechanism and how to access it
              </h4>
              <ol>
                <li>
                  In case of any grievance / complaint, an investor should
                  approach the concerned Investment Adviser and shall ensure
                  that the grievance is resolved within 30 days.
                </li>
                <br />
                <li>
                  If the investor’s complaint is not redressed satisfactorily,
                  one may lodge a complaint with SEBI on SEBI’s 'SCORES' portal
                  which is a centralized web based complaints redressal system.
                  SEBI takes up the complaints registered via SCORES with the
                  concerned intermediary for timely redressal. SCORES
                  facilitates tracking the status of the complaint.
                </li>
                <br />
                <li>
                  With regard to physical complaints, investors may send their
                  complaints to: Office of Investor Assistance and Education,
                  Securities and Exchange Board of India, SEBI Bhavan, Plot No.
                  C4-A, ‘G’ Block, Bandra-Kurla Complex, Bandra (E), Mumbai -
                  400 051.
                </li>
              </ol>
              <h4 className="fw-bold">
                  E. Expectations from the investors (Responsibilities of
                investors)
              </h4>
            <p>  <b>Do’s</b></p>
              <ol>
                <li>Always deal with SEBI registered Investment Advisers.</li>
                <br />
                <li>
                  Ensure that the Investment Adviser has a valid registration
                  certificate.
                </li>{" "}
                <br />
                <li>
                  Check for SEBI registration number. Please refer to the list
                  of all SEBI registered Investment Advisers which is available
                  on SEBI website in the following link:{" "}
                  <a
                    style={{ color: "royalblue" }}
                    href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmld=13"
                    target="_blank"
                  >
                    https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&amp;intmld=13{" "}
                  </a>{" "}
                </li>{" "}
                <br />
                <li>
                  Pay only advisory fees to your Investment Adviser. Make
                  payments of advisory fees through banking channels only and
                  maintain duly signed receipts mentioning the details of your
                  payments.
                </li>{" "}
                <br />
                <li>
                  Always ask for your risk profiling before accepting investment
                  advice. Insist that Investment Adviser provides advisory
                  strictly on the basis of your risk profiling and take into
                  account available investment alternatives.
                </li>{" "}
                <br />
                <li>
                  Ask all relevant questions and clear your doubts with your
                  Investment Adviser before acting on advice.
                </li>{" "}
                <br />
                <li>
                  Assess the risk–return profile of the investment as well as
                  the liquidity and safety aspects before making investments.
                </li>{" "}
                <br />
                <li>
                  Insist on getting the terms and conditions in writing duly
                  signed and stamped. Read these terms and conditions carefully
                  particularly regarding advisory fees, advisory plans, category
                  of recommendations etc. before dealing with any Investment
                  Adviser.
                </li>{" "}
                <br />
                <li>Be vigilant in your transactions.</li> <br />
                <li>
                  Approach the appropriate authorities for redressal of your
                  doubts / grievances.
                </li>{" "}
                <br />
                <li>
                  Inform SEBI about Investment Advisers offering assured or
                  guaranteed returns.
                </li>{" "}
                <br />
              </ol>
            <p>  <b>Don’ts</b></p>
              <ol>
                <li>
                  Don’t fall for stock tips offered under the pretext of
                  investment advice.
                </li>{" "}
                <br />
                <li>
                  Do not provide funds for investment to the Investment Adviser.
                </li>{" "}
                <br />
                <li>
                  Don’t fall for the promise of indicative or exorbitant or
                  assured returns by the Investment Advisers. Don’t let greed
                  overcome rational investment decisions.
                </li>{" "}
                <br />
                <li>
                  Don’t fall prey to luring advertisements or market rumors.
                </li>{" "}
                <br />
                <li>
                  Avoid doing transactions only on the basis of phone calls or
                  messages from any Investment adviser or its representatives.
                </li>{" "}
                <br />
                <li>
                  Don’t take decisions just because of repeated messages and
                  calls by Investment Advisers.
                </li>{" "}
                <br />
                <li>
                  Do not fall prey to limited period discount or other
                  incentive, gifts, etc. offered by Investment advisers.
                </li>{" "}
                <br />
                <li>
                  Don’t rush into making investments that do not match your risk
                  taking appetite and investment goals.
                </li>{" "}
                <br />
                <li>
                  Do not share login credential and password of your trading and
                  demat accounts with the Investment Adviser.
                </li>{" "}
                <br />
              </ol>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
};
export default InvestorCharter;
