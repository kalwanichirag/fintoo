import styles from "./style.module.css";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

function Footer() {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  const hideMainFooter = useSelector((state) => state.hideMainFooter);

  return (
    <>
      {hideMainFooter == false && (
        <footer id="FooterView">
          <div className={`${styles.Footer + " main-footer"}`}>
            <div className={`${styles.FooterSection}`}>
              <div className={`row ${styles.FooterSectionContent}`}>
                <div className={`col-md-3 col-12 ${styles.Footerwidget}`}>
                  <div className={`${styles.FooterwidgetImg}`}>
                    <img
                      width={200}
                      src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoowhitelogo_.svg"}
                    />
                  </div>
                  <div className={`${styles.Footerwidgetcontact}`}>
                    <a href="tel:+919699800600">+91-9699 800 600</a>
                  </div>
                  <div className={`${styles.Footerwidgetcontact}`}>
                    <a href="mailto:online@fintoo.in">online@fintoo.in</a>
                  </div>
                  <div className={`${styles.FooterwidgetSocial}`}>
                    <a
                      className={`${styles.FooterwidgetSocialIcons}`}
                      href="https://twitter.com/FintooApp"
                    >
                      <FaTwitter />
                    </a>

                    <a
                      className={`${styles.FooterwidgetSocialIcons}`}
                      href="https://www.facebook.com/fintooapp/"
                    >
                      <FaFacebookF />
                    </a>

                    <a
                      className={`${styles.FooterwidgetSocialIcons}`}
                      href="https://www.linkedin.com/company/1769616/"
                    >
                      <FaLinkedin />
                    </a>

                    <a
                      className={`${styles.FooterwidgetSocialIcons}`}
                      href="https://www.instagram.com/fintoo.app/"
                    >
                      <FaInstagram />
                    </a>

                    <a
                      className={`${styles.FooterwidgetSocialIcons}`}
                      href="https://www.youtube.com/channel/UC00AMcwwfUKrV-XD5n6hWyQ/videos"
                    >
                      <FaYoutube />
                    </a>
                  </div>
                </div>
                <div
                  className={`col-md-9 col-12 ${styles.FooterSectionContent}`}
                >
                  <div className={`row ${styles.FooterSectionLinks}`}>
                    <div className="col">
                      <h2 className={`row ${styles.footerheading}`}>
                        Advisory
                      </h2>
                      <ul className={`row ${styles.footernavigation}`}>
                        <li>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                            to={
                              process.env.PUBLIC_URL +
                              "/financial-planning-page"
                            }
                          >
                            Financial Planning
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                            to={
                              process.env.PUBLIC_URL +
                              "/retirement-planning-page"
                            }
                          >
                            Retirement Planning
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                            to={
                              process.env.PUBLIC_URL +
                              "/investment-planning-page"
                            }
                          >
                            Investment Planning
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                            to={process.env.PUBLIC_URL + "/tax-planning-page"}
                          >
                            Tax Planning
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                            to={process.env.PUBLIC_URL + "/risk-management"}
                          >
                            Risk Management
                          </NavLink>
                        </li>
                        {/* <li>
                        <a
                          style={{ cursor: "default" }}
                          href={`${process.env.REACT_APP_PYTHON_URL}`}
                        >
                          Download Now
                        </a>
                      </li> */}
                        {/* <li>
                        <a
                          target="_blank"
                          style={{ paddingTop: ".5rem !important", padding: 0 }}
                          href="https://play.google.com/store/apps/details?id=com.financialhospital.admin.finh"
                        >
                          <img
                            alt="Download Fintoo app on play store"
                            className=" ls-is-cached lazyloaded"
                            src={Mintyandroid}
                          />
                        </a>
                      </li> */}
                        {/* <li>
                        <a
                          target="_blank"
                          style={{ paddingTop: ".5rem !important", padding: 0 }}
                          href="https://apps.apple.com/in/app/fintoo/id1339092462"
                        >
                          <img
                            alt="Download Fintoo app on app store"
                            className=" ls-is-cached lazyloaded"
                            src={Mintyapp}
                          />
                        </a>
                      </li> */}
                      </ul>
                    </div>
                    <div className="col ms-md-0 ms-4">
                      <h2 className={`row ${styles.footerheading}`}>Invest</h2>
                      <ul className={`row ${styles.footernavigation}`}>
                        <li>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                            to={process.env.PUBLIC_URL + "/direct-mutual-funds"}
                          >
                            Mutual Fund
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                            to={process.env.PUBLIC_URL + "/bond-investment"}
                          >
                            Bond
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                            to={process.env.PUBLIC_URL + "/stock-advisory"}
                          >
                            Domestic Equity
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                            to={
                              process.env.PUBLIC_URL + "/international-equity"
                            }
                          >
                            International Equity
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                            to={process.env.PUBLIC_URL + "/ipo"}
                          >
                            IPO
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                    <div className="col ms-md-0 ms-3">
                      <h2 className={`row ${styles.footerheading}`}>Tax</h2>
                      <ul className={`row ${styles.footernavigation}`}>
                        {/* <li>
                        <a target="_self" href="#">
                          File your ITR
                        </a>
                      </li> */}

                        <li>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                            to={process.env.PUBLIC_URL + "/nri-taxation"}
                          >
                            NRI Taxation
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                            to={process.env.PUBLIC_URL + "/notices"}
                          >
                            Notices
                          </NavLink>
                        </li>
                        {/* <li>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                            to={process.env.PUBLIC_URL + "/tax-calculators"}
                          >
                            Tax Calculators
                          </NavLink>
                        </li> */}
                      </ul>
                    </div>
                    <div className="col">
                      <h2 className={`row ${styles.footerheading}`}>
                        About Us
                      </h2>
                      <ul className={`row ${styles.footernavigation}`}>
                        <li>
                          <a
                            target="_self"
                            href="https://www.fintoo.in/blog/how-fintoo-ensures-your-safety-and-security/"
                            // href={
                            //   process.env.PUBLIC_URL +
                            //   "blog/how-fintoo-ensures-your-safety-and-security/"
                            // }
                          >
                            Safety Shield (Data Privacy)
                          </a>
                        </li>
                        <li>
                          <a
                            target="_self"
                            href={process.env.PUBLIC_URL + "/about-us"}
                          >
                            About Us
                          </a>
                        </li>
                        <li>
                          <a
                            target="_self"
                            href={process.env.PUBLIC_URL + "/contact"}
                          >
                            Contact Us
                          </a>
                        </li>

                        <li>
                          <a
                            target="_blank"
                            style={{
                              paddingTop: ".5rem !important",
                              padding: 0,
                            }}
                            href="https://play.google.com/store/apps/details?id=com.financialhospital.admin.finh"
                          >
                            <img
                              alt="Download Fintoo app on play store"
                              className=" ls-is-cached lazyloaded"
                              loading="lazy"
                              src={
                                process.env.REACT_APP_STATIC_URL +
                                "media/footer/minty-android-app.webp"
                              }
                            />
                          </a>
                        </li>
                        <li>
                          <a
                            target="_blank"
                            style={{
                              paddingTop: ".5rem !important",
                              padding: 0,
                            }}
                            href="https://apps.apple.com/in/app/fintoo/id1339092462"
                          >
                            <img
                              alt="Download Fintoo app on app store"
                              className=" ls-is-cached lazyloaded"
                              src={
                                process.env.REACT_APP_STATIC_URL +
                                "media/footer/minty-app-store.png"
                              }
                            />
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="col ms-4">
                      <h2 className={`row ${styles.footerheading}`}>Others</h2>
                      <ul className={`row ${styles.footernavigation}`}>
                        <li>
                          <a
                            target="_self"
                            href={process.env.PUBLIC_URL + "/contact"}
                          >
                            Partner With Us
                          </a>
                        </li>
                        <li>
                          <a
                            target="_self"
                            href={
                              process.env.PUBLIC_URL + "/privacy-policy"
                            }
                          >
                            Privacy Policy
                          </a>
                        </li>
                        <li>
                          <a
                            target="_self"
                            href={
                              process.env.PUBLIC_URL +
                              "/terms-conditions"
                            }
                          >
                            Terms and Conditions
                          </a>
                        </li>
                        <li>
                          <a
                            target="_self"
                            href={
                              process.env.PUBLIC_URL +
                              "/grievance-mechanism"
                            }
                          >
                            Grievance Mechanism
                          </a>
                        </li>
                        <li>
                          <a
                            target="_self"
                            href={
                              process.env.PUBLIC_URL +
                              "/complaints-status"
                            }
                          >
                            Complaints Status
                          </a>
                        </li>
                        <li>
                          <a
                            target="_blank"
                            href={"https://smartodr.in/login"}
                          >
                            Access Online Dispute Resolution (ODR) Portal
                          </a>
                        </li>
                        <li>
                          <a
                            target="_self"
                            href={
                              process.env.PUBLIC_URL +
                              "/investor-charter"
                            }
                          >
                            Investor Charter
                          </a>
                        </li>
                        <li>
                          <a
                            target="_self"
                            href={
                              process.env.PUBLIC_URL +
                              "/compliance-audit-status"
                            }
                          >
                            Compliance Audit Status
                          </a>
                        </li>
                        <li>
                          <a
                            target="blank"
                            href="https://help.fintoo.in/portal/en/home"
                          >
                            Help Center
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${styles.FooterSection}`}></div>
            </div>
            <div className={`${styles.FooterSectionText}`}>
              <div className={`${styles.FooterSectionPara}`}>
                <p>
                  Fintoo Wealth Private Limited (Brand Name - Fintoo.in, Fintoo app, Fintoo) makes no warranties or representations, express or implied, on products and services offered through the platform. It accepts no liability for any damages or losses, however, caused in connection with the use of, or on the reliance of its advisory or related services. Past performance is not indicative of future returns. Please consider your specific investment requirements, risk tolerance, goal, time frame, risk and reward balance and the cost associated with the investment before choosing a fund, or designing a portfolio that suits your needs. Performance and returns of any investment portfolio can neither be predicted nor guaranteed. Investments made on advisory are subject to market risks, read all scheme related documents carefully.
                </p>
                <p>
                  © Fintoo Wealth Private Limited [SEBI RIA Registration No: INA000020031] [BASL Membership ID: 2252] [Type of Registration: Non-Individual] [Validity of registration: March 26,2025-Perpetual] [Address: Fintoo Wealth Private Limited, B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059]  [CIN - U66301MH2023PTC414206] [GST No : 27AAFCF7114E1ZV] [Principal Officer details : Mr. Mihir Shah (mihir.shah@fintoo.in)] [Compliance Officer details : Mrs. Nisha Harchekar (nisha.harchekar@fintoo.in)] [Corresponding SEBI regional/local office: Plot No. C 4-A , G Block, Near Bank of India, Bandra Kurla Complex,Bandra East, Mumbai, Maharashtra 400051]
                </p>
              </div>
              <div
                className={`text-center ${styles.FooterSectionCopyRightText}`}
              >
                Copyright © {year} Fintoo,. All rights reserved
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

export default Footer;
