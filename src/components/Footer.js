import React from "react";
import footerlogo from "../Assets/Images/./white-logo.svg";

function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-3 col-6 footer-info">
              <a
                href="https://www.fintoo.in/"
                className="logo d-flex align-items-center"
              >
                <img src={footerlogo} alt="minty" />
              </a>

              <div className="social-links d-flex mt-3">
                <a
                  href="https://twitter.com/login"
                  target="_blank"
                  rel="noreferrer"
                  className="twitter"
                >
                  <i className="bi bi-twitter"></i>
                </a>
                <a
                  href="https://www.facebook.com/"
                  className="facebook"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="https://www.instagram.com/"
                  className="instagram"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-instagram"></i>
                </a>
                <a
                  href="https://www.linkedin.com/"
                  className="linkedin"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-6 footer-links">
              <h4>About us</h4>
              <ul>
                <li>
                  <a href="#test">Who we are</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-6 footer-links">
              <h4>Advisory</h4>
              <ul>
                <li>
                  <a href="#test">Financial Planning</a>
                </li>
                <li>
                  <a href="#test">Retirement Planning</a>
                </li>
                <li>
                  <a href="#test">Tax Planning</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-6 footer-links">
              <h4>Others</h4>
              <ul>
                <li>
                  <a href="#test">Contact Us</a>
                </li>
                <li>
                  <a href="#test">Privacy Policy</a>
                </li>
                <li>
                  <a href="#test">Terms & Conditions</a>
                </li>
              </ul>
            </div>
          </div>
          <hr className="smoothline" />
        </div>
      </div>
      <div className="footer-legal">
        <div className="container">
          <div className="copyright">
          Fintoo Wealth Private Limited (Brand Name - Fintoo.in, Fintoo app, Fintoo) makes no warranties or representations, express or implied, on products and services offered through the platform. It accepts no liability for any damages or losses, however, caused in connection with the use of, or on the reliance of its advisory or related services.
          </div>
          <div className="credits">
          Past performance is not indicative of future returns. Please consider your specific investment requirements, risk tolerance, goal, time frame, risk and reward balance and the cost associated with the investment before choosing a fund, or designing a portfolio that suits your needs. Performance and returns of any investment portfolio can neither be predicted nor guaranteed. Investments made on advisory are subject to market risks, read all scheme related documents carefully.
          </div>
          <div className="credits">
          © Fintoo Wealth Private Limited [SEBI RIA Registration No: INA000020031] [BASL Membership ID: 2252] [Type of Registration: Non-Individual] [Validity of registration: March 26,2025-Perpetual] [Address: Fintoo Wealth Private Limited, B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059]  [CIN - U66301MH2023PTC414206] [GST No : 27AAFCF7114E1ZV] [Principal Officer details : Mr. Mihir Shah (mihir.shah@fintoo.in)] [Compliance Officer details : Mrs. Nisha Harchekar (nisha.harchekar@fintoo.in)] [Corresponding SEBI regional/local office: Plot No. C 4-A , G Block, Near Bank of India, Bandra Kurla Complex,Bandra East, Mumbai, Maharashtra 400051]
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
