import React from "react";
import footerlogo from "./Assets/white-logo.svg";
import SocialFB from "./Assets/social-facebook.svg";
import SocialTW from "./Assets/social-twitter.svg";
import Socialyoutube from "./Assets/social-youtube.svg";
import SocialLinkein from "./Assets/social-linkedin.svg";
import Socialinstagram from "./Assets/social-instagram.svg";
import Mintyapp from "./Assets/minty-app-store.svg";
import Mintyandroid from "./Assets/minty-android-app.svg";
import FooterSvg from "./Assets/footer.svg";

function Footer() {
  return (
    <footer className="footer ng-scope" ng-controller="footerController">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-3">
            <img
             src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoowhitelogo_.svg"}
              alt="Fintoo Footer"
              className="footer-bg mobile-hidden"
            />
          </div>
          <div className="col-md-9">
            <div className="row top-footer align-items-center justify-content-center">
              <div className="col-md-3">
                <div>
                  <a
                    target="_self"
                    href={`${process.env.REACT_APP_PYTHON_URL}`}
                    className="logo"
                  >
                    <img
                     src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
                      alt="Fintoo white logo"
                      width={130}
                      height={36}
                    />
                  </a>
                  <ul className="social-media-links">
                    <li>
                      <a
                        target="_blank"
                        href="https://www.facebook.com/fintooapp/"
                      >
                        <img
                          src={SocialFB}
                          alt="Follow Fintoo on facebook"
                          width={16}
                          height={16}
                        />
                      </a>
                    </li>
                    <li>
                      <a target="_blank" href="https://twitter.com/FintooApp">
                        <img
                          src={SocialTW}
                          alt="Follow Fintoo on Twitter"
                          width={16}
                          height={16}
                        />
                      </a>
                    </li>
                    <li>
                      <a
                        target="_blank"
                        href="https://www.linkedin.com/company/1769616/"
                      >
                        <img
                          src={SocialLinkein}
                          alt="Follow Fintoo on Linkedin"
                          width={16}
                          height={16}
                        />
                      </a>
                    </li>
                    <li>
                      <a
                        target="_blank"
                        href="https://www.instagram.com/fintoo.app/"
                      >
                        <img
                          src={Socialinstagram}
                          alt="Follow Fintoo on Instagram"
                          width={16}
                          height={16}
                        />
                      </a>
                    </li>
                    <li>
                      <a
                        target="_blank"
                        href="https://www.youtube.com/channel/UC00AMcwwfUKrV-XD5n6hWyQ/videos"
                      >
                        <img
                          src={Socialyoutube}
                          alt="Follow Fintoo on Youtube"
                          width={18}
                          height={25}
                        />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col">
                    <h2 className="footer-heading">About Us</h2>
                    <ul className="footer-navigation">
                      <li>
                        <a target="_self" href="/about-us/">
                          About Us
                        </a>
                      </li>
                      <li>
                        <a target="_self" href="/news/">
                          News
                        </a>
                      </li>
                      <li>
                        <a
                          style={{ cursor: "default" }}
                          href={`${process.env.REACT_APP_PYTHON_URL}`}
                        >
                          Download Now
                        </a>
                      </li>
                      <li>
                        <a
                          target="_blank"
                          style={{ paddingTop: ".5rem !important", padding: 0 }}
                          href="https://play.google.com/store/apps/details?id=com.financialhospital.admin.finh"
                        >
                          <img
                            alt="Download Fintoo app on play store"
                            className=" ls-is-cached lazyloaded"
                            loading="lazy"
                            width="135"
                            height="40"
                            decoding="async"
                            src={Mintyandroid}
                          />
                        </a>
                      </li>
                      <li>
                        <a
                          target="_blank"
                          style={{ paddingTop: ".5rem !important", padding: 0 }}
                          href="https://apps.apple.com/in/app/fintoo/id1339092462"
                        >
                          <img
                            alt="Download Fintoo app on app store"
                            className=" ls-is-cached lazyloaded"
                            loading="lazy"
                            width="135"
                            height="40"
                            decoding="async"
                            src={Mintyapp}
                          />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col">
                    <h2 className="footer-heading">Advisory</h2>
                    <ul className="footer-navigation">
                      <li>
                        <a target="_self" href="/financial-planning-page/">
                          Financial Planning
                        </a>
                      </li>
                      <li>
                        <a target="_self" href="/retirement-services/">
                          Retirement Planning
                        </a>
                      </li>
                      <li>
                        <a target="_self" href="/tax-planning-page-strategies/">
                          Tax Planning
                        </a>
                      </li>
                      <li>
                        <a target="_self" href="/investment-planning-page/">
                          Investment Planning
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col">
                    <h2 className="footer-heading">Others</h2>
                    <ul className="footer-navigation">
                      <li>
                        <a target="_self" href="/contact">
                          Contact Us
                        </a>
                      </li>
                      <li>
                        <a target="_self" href="/web/our-events/">
                          Events
                        </a>
                      </li>
                      <li>
                        <a target="_self" href="/web/privacy-policy/">
                          Privacy &amp; Refund Policy
                        </a>
                      </li>
                      <li style={{ textAlign: "left !important" }}>
                        <a target="_self" href="/web/terms-conditions/">
                          Terms &amp; Conditions
                        </a>
                      </li>
                      <li style={{ textAlign: "left !important" }}>
                        <a target="_self" href="/web/grievance-mechanism">
                          Grievance Mechanism
                        </a>
                      </li>
                      <li style={{ textAlign: "left !important" }}>
                        <a target="_self" href="/web/complaints-status/">
                          Complaints Status
                        </a>
                      </li>
                      <li style={{ textAlign: "left !important" }}>
                        <a target="_self" href="/web/investor-charter/">
                          Investor Charter
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="row copyright text-center justify-content-center"
              style={{ textAlign: "justify !important" }}
            >
              <div className="col-md-11">
                <p>
                Fintoo Wealth Private Limited (Brand Name - Fintoo.in, Fintoo app, Fintoo) makes no warranties or representations, express or implied, on products and services offered through the platform. It accepts no liability for any damages or losses, however, caused in connection with the use of, or on the reliance of its advisory or related services.
                </p>
                <p>
                Past performance is not indicative of future returns. Please consider your specific investment requirements, risk tolerance, goal, time frame, risk and reward balance and the cost associated with the investment before choosing a fund, or designing a portfolio that suits your needs. Performance and returns of any investment portfolio can neither be predicted nor guaranteed. Investments made on advisory are subject to market risks, read all scheme related documents carefully.
                </p>
                <p>
                © Fintoo Wealth Private Limited [SEBI RIA Registration No: INA000020031] [BASL Membership ID: 2252] [Type of Registration: Non-Individual] [Validity of registration: March 26,2025-Perpetual] [Address: Fintoo Wealth Private Limited, B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059]  [CIN - U66301MH2023PTC414206] [GST No : 27AAFCF7114E1ZV] [Principal Officer details : Mr. Mihir Shah (mihir.shah@fintoo.in)] [Compliance Officer details : Mrs. Nisha Harchekar (nisha.harchekar@fintoo.in)] [Corresponding SEBI regional/local office: Plot No. C 4-A , G Block, Near Bank of India, Bandra Kurla Complex,Bandra East, Mumbai, Maharashtra 400051]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
