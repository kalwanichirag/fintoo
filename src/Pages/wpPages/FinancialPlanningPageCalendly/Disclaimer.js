import React from "react";
import styles from "./style.module.css";


const Disclaimer = () => {

    return (
        <div className={`${styles.DisclaimerContainer}`} style={{ backgroundColor: '#042b62', color: 'white', fontSize: '0.8rem' }}>
            <p> <span style={{ fontWeight: 'bold' }}>Disclaimer:</span>
                <br />
                The information is only for the consumption by the client and such material should not be redistributed.
                Investment in the security market is subject to market risks. Read all the related documents carefully. Registration granted by SEBI, membership of BASL (in case of IAs), and certification from the NISM in no way affect the performance of intermediary or provide any assurance of returns to investors. </p>
            <p>
                By accessing this website, you agree to be bound by the following terms of use of this site and use of any materials or services contained herein. This site is provided by Fintoo Wealth Private Limited (CIN - U66301MH2023PTC414206) [SEBI RIA Registration No: INA000020031] [BASL Membership ID: 2252] [Type of Registration: Non-Individual] [Validity of registration: March 26,2025-Perpetual] [Address: Fintoo Wealth Private Limited B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059] (Brand name :Fintoo) for the purposes of information to its clients, financial literacy, and educational purposes only. The information provided on this website does not comprise an offer by Fintoo Wealth Private Limited to provide any product or service described herein. Products and services described herein are not available to all persons in all geographical locations. Fintoo Wealth Private Limited has used all reasonable care and skill in compiling the content of this website but does not guarantee the accuracy or completeness of any information on this website and does not accept liability for any errors or omissions. The information provided on this website should not be the basis for any personal decisions. The information contained on this website does not form a substitute for professional advice. Fintoo Wealth Private Limited shall not be liable to any person for any loss or damage which may arise from the use of any of the information contained on this website. No liability whatsoever is accepted for any direct or consequential loss arising from the use of the information contained on this site. Fintoo Wealth Private Limited does not guarantee that any functions at this site will operate without interruptions or errors and accepts no responsibility for any such interruptions or errors. This website may also provide links to other websites operated by third parties. Fintoo Wealth Private Limited is not responsible for such websites and their compliance with all relevant laws and regulations. To the full extent permissible by law, Fintoo Wealth Private Limited disclaims all responsibility for any error, omission, or inaccuracy in such material.
            </p>
        </div>
    );
}

export default Disclaimer;
