import { useState, useEffect, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";
import {
  apiCall,
  getItemLocal,
  getParentUserId,
  getUserId,
  loginRedirectGuest,
} from "../../../common_utilities";
import CommonDashboardLayout from "../../../components/Layout/Commomdashboard";

import CardBoxGoals from "../../../components/CommonDashboard/CardBoxGoals";
import TotalGoals from "../../../components/CommonDashboard/TotalGoals";
import FintooInlineLoader from "../../../components/FintooInlineLoader";
import BlogBoxSection from "./BlogBoxSection";
// import { getUserId, loginRedirectGuest } from "../../common_utilities";
import commonEncode from "../../../commonEncode";
import RenewPopup from "../../../components/CommonDashboard/RenewPopup";
import Modal from "react-responsive-modal";
import RenewPopupTextbox from "../../../components/CommonDashboard/RenewPopupTextbox";
import NiftySensex from "../../../components/CommonDashboard/NiftySensex";
import { useSelector } from "react-redux";
import BuyTaxPlan from "../../../components/BuyTaxPlan";
import SavingAccountSection from "../../MoneyManagement/views/CommonDashboard/SavingAccountSection";
import Fintootour from "../../Fintootour";
import { getFamilyMember } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { getGoalDetailsByFilterType } from "../../../FrappeIntegration-Services/services/financial-planning-api/goal";
import MainDashboard from "../../../components/dashboardnew/MainContent";
const NetworthGoals = ({ renewpopup, subscriptionenddate }) => {
  const [selectedGoalTab, setSelectedGoalTab] = useState(5);
  const [goalCountData, setGoalCountData] = useState([]);
  const [goalData, setGoalData] = useState([]);
  const [isMemberSelected, setIsMemberSelected] = useState(false);
  const [isDataLoaded, setDataLoadFlag] = useState(false);
  const [memberID, setMemberID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [planId, setPlanId] = useState('')
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  // const navigate = useNavigate();
  // const interval = useRef(null);
  // const timer = useRef(0);

const userId = getUserId();
  useEffect(() => {
    getMemberList();
    if(getItemLocal("plan_uuid") == "fp_robo"){
      setPlanId("fp_robo")
    }
    if(getItemLocal("plan_uuid") != "fp_robo" && getItemLocal("plan_uuid") != ""){
      setPlanId("fp_expert")
    }
  }, []);



  const getMemberList = async () => {
    try {
      // let url = '';
// let url = CHECK_SESSION;
      // let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };

      // setIsLoading(true)

      // let session_data = await apiCall(url, data, true, false);
      // setIsLoading(false)

      // setPlanId(session['plan_id'])

      // let data = {
      //   user_id: getParentUserId(),
      //   is_direct: "1",
      // };

      let member_id = null;
      let session_member_data  = null;
      // let member_data = await apiCall(, data, true, false);

      // let data = {
      //   user_id: getParentUserId(),
      //   is_direct: DATA_BELONGS_TO,
      // };
      let member_data = await getFamilyMember(getParentUserId());
      
      if (member_data.status_code === "200") {
        const members = member_data.data;
        const currentUserId = getUserId();
        let member = members.find(v => v.user_id === currentUserId);
        session_member_data = member;
      
        if (member && getItemLocal("family") != 1) {
          const fp_user_id = member.user_id;  // assuming this is the equivalent
          setMemberID(fp_user_id);
          member_id = fp_user_id;
          setIsMemberSelected(true);
        }
      }

      let member_selected = "member_id";
      let member = "";
      if (getItemLocal("family")) {
        member_selected = "all"
        member = "all"
      }
      else {
        member = member_id?.toString()
      }

      try {
        let cache_member_goals = JSON.parse(localStorage.getItem('memberGoals'));
        const cachedMember = cache_member_goals ? cache_member_goals[userId] : null;

        if (
          !cachedMember || 
          !cachedMember.data || 
          cachedMember.data.length === 0
        ) {
          // if first time page load or all members data changed
          getGoalsAPI(session_member_data, member_selected)
        } else {
          setIsLoading(true);

          // check if member data exist
          if (member in cache_member_goals) {
            let goalss = cache_member_goals[member];
            // if not null goals
            if (goalss) {
              setGoalCountData(goalss['goalsCount']);
              setGoalData(goalss["data"]);
              setIsLoading(false);
              setDataLoadFlag(true);
              setSelectedGoalTab(5);
            }
            else {
              // if no goals
              getGoalsAPI(session_member_data, member_selected)

            }
          }
          else {
            getGoalsAPI(session_member_data, member_selected)

          }

        }

      } catch (e) {
        console.log("err", e);
      }
    } catch (e) {
      console.log("err", e);
    }
  };

  const getGoalsAPI = async (session_data, member_selected) => {
    // let url = ADVISORY_GET_GOALS_API_URL;
    // let user_id = session_data["user_id"];
    // let api_data = {
    //   user_id: session_data["user_id"],
    //   // fp_log_id: session_data["fp_log_id"],
    //   filter_type: member_selected,
    //   fp_user_id: member_id,
    //   // parent_fp_user_id: session_data["fp_user_id"],
    // };
    // var payload_data = commonEncode.encrypt(JSON.stringify(api_data));
    setIsLoading(true);

    // let res = await apiCall(url, payload_data, false, false);
    let decoded_res = await getGoalDetailsByFilterType(userId, member_selected);

    if (decoded_res["status_code"] == "200") {
      setSelectedGoalTab(5);
      setDataLoadFlag(true);
      setIsLoading(false);
      setGoalData(decoded_res['data']);
      setGoalCountData(decoded_res["count_data"]);

      let member = "";
      if (member_selected == "all") {
        member = "all"
      } else {
        member = userId.toString()
      }
      let cache_member_goals = JSON.parse(localStorage.getItem('memberGoals'));

      if (cache_member_goals != null) {
        cache_member_goals[member] = { 'data': decoded_res['data'], 'goalsCount': decoded_res['count_data'] }
        localStorage.setItem('memberGoals', JSON.stringify(cache_member_goals))
      } else {
        let member_goals = {
          [member]: { 'data': decoded_res['data'], 'goalsCount': decoded_res['count_data'] }
        }
        localStorage.setItem('memberGoals', JSON.stringify(member_goals))
      }

    } else {
      // console.error(err);
      setDataLoadFlag(true);
      setIsLoading(false);
      setGoalCountData([]);
      setGoalData([]);
    }
  }
const [useNewDashboard, setUseNewDashboard] = useState(true);

  return (
    <CommonDashboardLayout>

     
        {useNewDashboard ? (
      <MainDashboard
   
      />
    ) : (
          <>
            
      <div
        style={{
          marginTop: ".3rem",
        }}

      >
        <div className="Section " >
          <CardBoxGoals
            renewpopup={renewpopup}
            subscriptionenddate={subscriptionenddate}
            member_id={memberID}
            member_selected={isMemberSelected}
          />
        </div>
        {/* <SavingAccountSection /> */}
        <div className="Section d-block mt-4">
          <p className="GoalText default-grey">Goals</p>
          <div className="GoalTabs me-2">
            <div className="">
              <div className="insideTabBoxd row w-100">
                <div className="col-md-7 d-flex justify-content-between overflow-auto">
                  <div
                    onClick={() => setSelectedGoalTab(5)}
                    className={`pointer ${selectedGoalTab == 5 ? "active" : ""
                      }`}
                  >
                    <p>
                      Total Goals{" "}
                      <span className="TotalGoal">
                        {goalCountData ? goalCountData.total : 0}
                      </span>{" "}
                    </p>
                  </div>
                  <span className="borderRight"></span>
                  <div
                    onClick={() => setSelectedGoalTab(6)}
                    className={`pointer ${selectedGoalTab == 6 ? "active" : ""
                      }`}
                  >
                    <p>
                      Achieved{" "}
                      <span className="TotalGoal">
                        {goalCountData ? goalCountData.achieved_goal_data : 0}
                      </span>
                    </p>
                  </div>
                  <span className="borderRight"></span>
                  <div
                    onClick={() => setSelectedGoalTab(7)}
                    className={`pointer ${selectedGoalTab == 7 ? "active" : ""
                      }`}
                  >
                    <p>
                      Pending{" "}
                      <span className="TotalGoal">
                        {goalCountData ? goalCountData.pending_goal_data : 0}
                      </span>
                    </p>
                  </div>
                  <span className="borderRight"></span>
                  <div
                    onClick={() => setSelectedGoalTab(8)}
                    className={`pointer lastTab ${selectedGoalTab == 8 ? "active" : ""
                      }`}
                  >
                    <p>
                      Upcoming{" "}
                      <span className="TotalGoal">
                        {goalCountData ? goalCountData.upcoming_goal_data : 0}
                      </span><br />
                      <label className="bottomText">3 months</label>
                    </p>
                    {/* <div>2 months</div> */}
                  </div>
                </div>
                <div className="col-md-5 float-end">
                  {renewpopup === 1 ? (
                    <a onClick={onOpenModal}>
                      {" "}
                      <button className=" AddGoalBtn custom-background-color custom-border-color">Add Goal</button>{" "}
                    </a>
                  ) : (
                    <a href={process.env.PUBLIC_URL + "/datagathering/goals/"}>
                      <button className=" AddGoalBtn">Add Goal</button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <FintooInlineLoader isLoading={isLoading} />

          <div className="ms-0 mb-5">
            {selectedGoalTab == 5 && (
              <>
                <TotalGoals
                  goals={goalData}
                  goal_type={"all"}
                  member_id={memberID}
                  member_selected={isMemberSelected}
                  is_data={isDataLoaded}
                  renewpopup={renewpopup}
                  onOpenModal={onOpenModal}
                  plan_id={planId}
                />
              </>
            )}
            {selectedGoalTab == 6 && (
              <>
                {/* <p>Achieved </p> */}
                <TotalGoals
                  goals={goalData}
                  goal_type={"achieved"}
                  member_id={memberID}
                  member_selected={isMemberSelected}
                  is_data={isDataLoaded}
                  renewpopup={renewpopup}
                  onOpenModal={onOpenModal}
                  plan_id={planId}

                />
              </>
            )}
            {selectedGoalTab == 7 && (
              <>
                {/* <p>Pending </p> */}
                <TotalGoals
                  goals={goalData}
                  goal_type={"pending"}
                  member_id={memberID}
                  member_selected={isMemberSelected}
                  is_data={isDataLoaded}
                  renewpopup={renewpopup}
                  onOpenModal={onOpenModal}
                  plan_id={planId}

                />
              </>
            )}
            {selectedGoalTab == 8 && (
              <>
                {/* <p>Upcoming </p> */}
                <TotalGoals
                  goals={goalData}
                  goal_type={"upcoming"}
                  member_id={memberID}
                  member_selected={isMemberSelected}
                  is_data={isDataLoaded}
                  renewpopup={renewpopup}
                  onOpenModal={onOpenModal}
                  plan_id={planId}

                />
              </>
            )}
          </div>
          <p
            className="mt-md-5"
          // style={{
          //   height: "2rem",
          // }}
          ></p>
        </div>



      </div>
      <Modal
        className="Modalpopup"
        open={open}
        showCloseIcon={false}
        onClose={onCloseModal}
        center
      >
        <div className="text-center">
          <h2 className="HeaderText">Attention !!</h2>
          <RenewPopup
            open={open}
            onClose={onCloseModal}
            subscriptionenddate={subscriptionenddate}
          />
        </div>
        </Modal>
      </>
       )}
       
    

    </CommonDashboardLayout>
  );
};

export default NetworthGoals;
