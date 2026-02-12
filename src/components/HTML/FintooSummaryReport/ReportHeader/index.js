import React from "react";
import Styles from '../Profile/style.module.css'
function ReportHeader() {
  return (
    <div>
      <section className={`${Styles.ReportPdf}`}>
        <div className={`${Styles.Header}`}>
          {/* <img src="https://static.fintoo.in/static/userflow/img/logo.svg" /> */}
        </div>
      </section>
    </div>
  );
}

export default ReportHeader;
