import React from "react";
import styles from "./style.module.css";


const Disclaimer = () => {

    return (
        <div className={`${styles.DisclaimerContainer}`} style={{ backgroundColor: '#042b62', color: 'white', fontSize: '1rem' }}>
            <p> <span style={{ fontWeight: 'bold' }}>Disclaimer:</span>
                <br />
                All investments are subject to market risks. Investors are advised to read all relevant information carefully before making any investment. The value of any investment may rise or fall as a result of market changes. Past performance is not indicative of future results.</p>
            <p>
                By accessing this website, you agree to be bound by the following terms of use of this site and use of any materials or services contained herein. This site is provided by MIHIKA Financial Services Private Limited (CIN U67200MH2004PTC144103) AMFI-registered Mutual Fund Distributor, having ARN Code – 21209 register w.e.f 30th July 2004 and valid till 25th july 2026) [B/307, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059] ( Brand name :Fintoo) for the purposes of information to its clients, financial literacy, and educational purposes only. The information provided on this website does not comprise an offer by Mihika Financial Services Private Limited to provide any product or service described herein. Products and services described herein are not available to all persons in all geographical locations. Mihika Financial Services Private Limited has used all reasonable care and skill in compiling the content of this website but does not guarantee the accuracy or completeness of any information on this website and does not accept liability for any errors or omissions. The information provided on this website should not be the basis for any personal decisions. The information contained on this website does not form a substitute for professional advice. Mihika Financial Services Private Limited shall not be liable to any person for any loss or damage which may arise from the use of any of the information contained on this website. No liability whatsoever is accepted for any direct or consequential loss arising from the use of the information contained on this site. Mihika Financial Services Private Limited does not guarantee that any functions at this site will operate without interruptions or errors and accepts no responsibility for any such interruptions or errors. This website may also provide links to other websites operated by third parties. Mihika Financial Services Private Limited is not responsible for such websites and their compliance with all relevant laws and regulations. To the full extent permissible by law, Mihika Financial Services Private Limited disclaims all responsibility for any error, omission, or inaccuracy in such material.
            </p>
        </div>
    );
}

export default Disclaimer;
