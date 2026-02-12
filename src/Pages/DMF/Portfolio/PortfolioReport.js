import { useState, useEffect, useRef } from "react";
import PortfolioLayout from "../../../components/Layout/Portfolio";
import Styles from "./report.module.css";
import MutualFunds from "../../../components/PortfolioReport/MutualFunds";
import NewReportUI from "../../../components/PortfolioReport/NewReportUI";
import AdvisoryReportUI from "../../../components/PortfolioReport/AdvisoryReportUI";
import { CHECK_SESSION } from "../../../constants";
import {
  apiCall,
  getItemLocal,
  getParentUserId,
  getUserId,
} from "../../../common_utilities";
import { getReports } from "../../../Services/ReportService";
const PortfolioReport = (props) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [sessionData, setSessionData] = useState("");
  const [error, setError] = useState("");
  const [showReport, setShowReport] = useState(true);
  const [reportsData, setReportData] = useState({
    PAR: '',
    MF: ''
  });

  useEffect(() => {
    // // checksession();
  }, []);

  const userid = getParentUserId();
  const checksession = async () => {
    try {
      let url = '';
// let url = CHECK_SESSION;
      let data = { user_id: userid, sky: getItemLocal("sky") };
      let session_data = await apiCall(url, data, true, false);
      setSessionData(session_data["data"]);
    } catch (e) {
      setError(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (sessionData) {
        const { fp_lifecycle_status, plan_id, plan_payment_status } =
          sessionData;

        if (fp_lifecycle_status == 2 && plan_id == 31 && plan_payment_status == 1) {
          setShowReport(true);
        } else if (fp_lifecycle_status == 2 && plan_id == 29) {
          setShowReport(true);
        } else {
          setShowReport(false);
        }
      }
    };

    fetchData();
  }, [sessionData]);

  const fetchReportsData = async () => {
    const userId = parseInt(getUserId());

    const ReportData = await getReports([userId], [182, 163]);

    const PARReportLink = ReportData.data?.length > 0 ? (ReportData.data.filter(data => data.user_id == userId && data.report_type == 'PAR'))[0]?.download_url : '';
    const MFReportLink = ReportData.data?.length > 0 ? (ReportData.data.filter(data => data.user_id == userId && data.report_type == 'MF'))[0]?.download_url : '';

    setReportData(prev => ({ ...prev, PAR: PARReportLink, MF: MFReportLink }))
  }

  useEffect(() => {
    fetchReportsData();
  }, [])

  return (
    <PortfolioLayout>
      <div className={`row ${Styles.PortfolioReportSection}`}>
        <div className="col-12 mt-5">
          <div className={Styles.insideTabBoxd}>
            <div className="d-flex pt-3">
              <div
                onClick={() => setSelectedTab(1)}
                className={`pointer ${Styles.tabBx} ${selectedTab == 1 ? Styles.active : Styles.inactive
                  }`}
              >
                <div className={`mb-0 ${Styles.tabText} align-items-center`}>
                  <div>Investment</div>
                </div>
              </div>
              {showReport && (
                <>
                  <div className={`${Styles.VRline}`}></div>
                  <div
                    onClick={() => setSelectedTab(2)}
                    className={`pointer ps-5 ${Styles.tabBx} ${selectedTab == 2 ? Styles.active : Styles.inactive
                      }`}
                  >
                    <div
                      className={`mb-0 ${Styles.tabText} align-items-center`}
                    >
                      Advisory
                    </div>
                  </div>
                </>
              )}
              {/* <div className={`${Styles.VRline}`}></div>
              <div
                onClick={() => setSelectedTab(3)}
                className={`pointer ps-5 ${Styles.tabBx} ${selectedTab == 3 ? Styles.active : Styles.inactive
                  }`}
              >
                <div
                  className={`mb-0 ${Styles.tabText} align-items-center d-none`}
                >
                  Tax
                </div>
              </div>
              <div className={`${Styles.VRline}`}></div> */}
            </div>
          </div>
          <div className={`${Styles.TabSection}`}>
            <div className={selectedTab == 1 ? "d-block" : "d-none"}>
              <MutualFunds reportsData={reportsData} fetchReportsData={fetchReportsData} />
            </div>
            <div className={selectedTab == 4 ? "d-block" : "d-none"}>
              <NewReportUI />
            </div>
            {showReport && (
              <div className={selectedTab == 2 ? "d-block" : "d-none"}>
                {/* Advisory */}
                <AdvisoryReportUI reportsData={reportsData} fetchReportsData={fetchReportsData} />
              </div>
            )}
            {/* <div className={selectedTab == 3 ? "d-block" : "d-none"}>
              Tax
            </div> */}
          </div>
        </div>
      </div>
    </PortfolioLayout>
  );
};

export default PortfolioReport;
