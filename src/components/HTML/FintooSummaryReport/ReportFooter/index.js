import React from "react";
import Styles from '../Profile/style.module.css'
function ReportFooter() {
  let getYear = ()=> {
    return new Date().getFullYear();
}
  return (
    
    <div>
      <section className={`${Styles.ReportPdf}`}>
        <div className={`${Styles.Footer}`}>
          <div className={`${Styles.FooterContent}`}>
            <p>Page 1 of 18</p>
            <p>
            @{getYear()} Fintoo, All Rights Reserved
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReportFooter;
