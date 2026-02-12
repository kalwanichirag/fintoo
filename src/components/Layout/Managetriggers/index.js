import { useEffect } from "react";
import ManagetriggersDSidebar from "./sidebar";
import Styles from "./Managetriggers.module.css";
import "./style.css";
import Profile from "../../CommonDashboard/Profile";
const Managetriggers = (props) => {
  useEffect(() => {
    document.body.classList.add("page-ManageTrigger");
  }, []);
  return (
    <>
      <div className={Styles.wrapper}>
        <ManagetriggersDSidebar />
        <div className={Styles.contentWrapper}>
          {/* <CommonDashboardTopMenu /> */}
          
          
          <div className={`container-fluid ${Styles.container}`}>
            {props.children}
          </div>
          
          <div style={{ height: "1rem" }}></div>
        </div>
      </div>
    </>
  );
};

export default Managetriggers;
