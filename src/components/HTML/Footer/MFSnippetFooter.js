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
function MFSnippetFooter() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    const hideMainFooter = useSelector((state) => state.hideMainFooter);

    return (
        <>
            <footer>
                <div className={`${styles.Footer}`}>
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
        </>
    );
}

export default MFSnippetFooter;
