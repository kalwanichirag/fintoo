// import React from "react";
import React, { useState } from "react";
import { Document, Page } from "react-pdf";

import { RiFileUserLine } from "react-icons/ri";
import Profile from "./Images/Profile.jpg";
import Styles from "../../components/HTML/FintooSummaryReport/Profile/style.module.css";
import { FcBusinessman } from "react-icons/fc";
import ProfileReport from "../../components/HTML/FintooSummaryReport/Profile";
import ReportHeader from "../../components/HTML/FintooSummaryReport/ReportHeader";
import ReportFooter from "../../components/HTML/FintooSummaryReport/ReportFooter";
import Risk_Appetite from "../../components/HTML/FintooSummaryReport/Risk_Appetite";
import Scorecard from "../../components/HTML/FintooSummaryReport/Scorecard";
import ApplyWhiteBg from "../../components/ApplyWhiteBg";
import HideFooter from "../../components/HideFooter";
import HideHeader from "../../components/HideHeader";
function FintooReport() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <>
      <HideFooter />
      <HideHeader />
      <ApplyWhiteBg />
      <ReportHeader />
      <section className={`${Styles.PageBreak}`}>
        <ProfileReport />
      </section>
      <section className={`${Styles.PageBreak}`}>
        <></>
      </section>
      <section className={`${Styles.PageBreak}`}>
        <Risk_Appetite />
      </section>
      <section className={`${Styles.PageBreak}`}>
        <></>
      </section>
      <section className={`${Styles.PageBreak}`}>
        <Scorecard />
      </section>
      {/* <Document>
        <Page>
        </Page>
      </Document> */}
      <ReportFooter />
    </>
  );
}

export default FintooReport;
