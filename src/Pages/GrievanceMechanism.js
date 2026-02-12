import { useEffect } from "react";
import Footer from "../components/MainComponents/Footer";
import { ReactComponent as Logo } from "../Assets/Images/logo.svg";
import MainLayout from "../components/Layout/MainLayout";
import GuestLayout from "../components/Layout/GuestLayout";

const GrievanceMechanism = () => {
  useEffect(() => {
    document.body.classList.add("main-layout");
  }, []);
  return (
    <GuestLayout>
      <section className="privacy-policy-section" style={{ padding: 30 }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>Grievance Mechanism</h2>
            </div>
            <div className="col-md-12">
              <p>
                Client’s queries / complaints may arise due to lack of
                understanding or a deficiency of service experienced by clients.
                Deficiency of service may include lack of explanation,
                clarifications, understanding which escalates into shortfalls in
                the expected delivery standards, either due to inadequacy of
                facilities available or through the attitude of staff towards
                client.
              </p>
              <ol>
                <li>
                  Clients can seek clarification to their query and are further
                  entitled to make a complaint in writing, orally or
                  telephonically. An email may be sent to the Client Servicing
                  Team on{" "}
                  <a
                    style={{ color: "royalblue", textDecoration: "underline" }}
                    href="mailto:info@fintoo.in"
                    target="_blank"
                  >
                    info@fintoo.in
                  </a>
                  . Alternatively, the Investor may call on 9699800600.
                </li>
                <br />
                <li>
                  A letter may also be written with their query/complaint and
                  posted at the below mentioned address:
                  <br />
                  <b> Fintoo Wealth Private Limited</b> <br />
                  B/309, Dynasty Business park, Opp Sangam Cinema, <br />
                  Andheri (East), J B Nagar, Mumbai, <br />
                  Maharashtra 400059
                  <br />
                </li>
                <br />
                <li>
                  Clients can write to the Investment Adviser at{" "}
                  <a
                    style={{ color: "royalblue", textDecoration: "underline" }}
                    href="mailto:operations@fintoo.in"
                    target="_blank"
                  >
                    operations@fintoo.in
                  </a>{" "}
                  if the Investor does not receive a response within 10 business
                  days of writing to the Client Servicing Team. The client can
                  expect a reply within 10 business days of approaching the
                  Investment Advisor.
                </li>
                <br />
                <li>
                  {" "}
                  In case you are not satisfied with our response you can
                  lodge your grievance with SEBI at{" "}
                  <a
                    style={{ color: "royalblue", textDecoration: "underline" }}
                    href="https://scores.gov.in"
                    target="_blank"
                  >
                    https://scores.gov.in
                  </a>{" "}
                  or you may also write to any of the offices of SEBI. SCORES
                  may be accessed thorough SCORES mobile application as well,
                  same can be downloaded from below link:
                  <br />
                  <a
                    style={{ color: "royalblue", textDecoration: "underline" }}
                    href="https://play.google.com/store/apps/details?id=com.ionicframework.sebi236330"
                    target="_blank"
                  >
                    https://play.google.com/store/apps/details?id=com.ionicframework.sebi236330
                  </a>
                </li>
                <br />
                <li>
                  {" "}
                  ODR Portal could be accessed, if unsatisfied with the response. Your attention is
                  drawn to the SEBI circular no. SEBI/HO/OIAE/OIAE_IAD-1/P/CIR/2023/131 dated
                  July 31, 2023, on "Online Resolution of Disputes in the Indian Securities Market".
                  6. A common Online Dispute Resolution Portal ("ODR Portal") which harnesses.
                </li>
                <br />
                <li>
                  {" "}
                  A common Online Dispute Resolution Portal ("ODR Portal") which harnesses
                  conciliation and online arbitration for resolution of disputes arising in the Indian
                  Securities Market has been established. ODR Portal can be accessed via the following
                  link - {" "}
                  <a
                    style={{ color: "royalblue", textDecoration: "underline" }}
                    href="https://smartodr.in/"
                    target="_blank"
                  >
                    https://smartodr.in/
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
};
export default GrievanceMechanism;
