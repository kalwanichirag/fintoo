import React, { useState, useEffect, useRef } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import News1 from "../../Assets/Images/CommonDashboard/News1.jpg";
import Man from "../../Assets/Images/CommonDashboard/profile_top.png";
import Down from "../../Assets/Images/CommonDashboard/down.png";
import Add from "../../Assets/Images/CommonDashboard/add.png";
import Account from "../../Assets/Images/CommonDashboard/account.png";
import logout from "../../Assets/Images/CommonDashboard/logout-72.png";
import watchlist from "../../Assets/Images/CommonDashboard/watchlist.png";
import { Link } from "react-router-dom";
import Notification from "../../Assets/Images/CommonDashboard/Notification.png";
import style from "./style.module.css";
import commonEncode from "../../commonEncode";
import { useDispatch, useSelector } from "react-redux";
import { apiCall, getItemLocal, getUserId, loginRedirectGuest } from "../../common_utilities"
import axios from "axios";
import FintooLoader from "../FintooLoader";

function Profile(props) {
  const [user, setUser] = React.useState({})
  const [loggedIn, setLoggedIn] = React.useState(false)
  const [members, setMembers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [showProfile, setShowProfile] = React.useState(false)
  const defaultUserImage = BASE_API_URL+'static/userflow/img/profile-picture.svg'
  const defaultAllMemberImage = 'https://cdn-icons-png.flaticon.com/512/32/32441.png'
  const invoiceImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD5d3tQTHnFvmeJXo-qyL-UHrMbiqQhgZvPdUvrI_e4A&s'
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();


  useEffect(() => {
    setIsLoading(true)
    profileApiCall();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  },[]);

  const profileApiCall = async () => {
    // let url = CHECK_SESSION;

    // let data = { user_id: getUserId(), sky:getItemLocal("sky") };
    // let session_data = await apiCall(url, data, true, false);
    // console.log("session",session_data)
    // if(session_data['error_code']=="100")
    // {
    //   setIsLoading(false)

    //   setLoggedIn(true)
    //   var self_user_data =session_data.data.user_details;
    //   if('user_avatar' in session_data.data){
    //     self_user_data.user_avatar=session_data.data.user_avatar
    //   }
    //   try {
    //     let user_id = JSON.stringify(session_data['data']['id']);
    //     if(session_data['data']['fp_log_id']){
    //       let fp_log_id = JSON.stringify(session_data['data']['fp_log_id']);
    //       let selfData = [self_user_data];
    //       setUser(self_user_data)
    //       var family_data = await apiCall(
    //         ADVISORY_GET_FAMILY_DATA_API_URL+"?parent_user_id="+user_id+"&fp_log_id="+fp_log_id+"&web=1",
    //         '',
    //         false,
    //         false
    //       );
    //       let res = JSON.stringify(family_data);
    //       let response = JSON.parse(res);
    //       let membersData = response["data"];
    //       setMembers([...selfData, ...membersData]);
    //       if(membersData.length==0){
    //         setSelectedUser(self_user_data)
    //       }
    //     }
    //     else{
    //       setUser(self_user_data)
    //       setSelectedUser(self_user_data)
    //     }

    //   } catch (e) {
    //     console.log(e);
    //     dispatch({
    //       type: "RENDER_TOAST",
    //       payload: { message: "Something went Wrong...", type: "error" },
    //     });
    //   }
    // }
    // else{
    //   setIsLoading(false)

    // }
  }

  const handleSelectUser =(member) => {
    if(member){
      props.setMember(true)
    }
    else{
      props.setMember(false)

    }
    props.passChildData(member);
    setSelectedUser(member)
    toggle();
  }

  const redirectToInvoice =() =>{
    window.location.href=BASE_API_URL+'userflow/invoice/'
  }

  function toggle() {
    setShowProfile((wasOpened) => !wasOpened);
  }
  const handleClickOutside = (e) => {
     if (!myRef.current.contains(e.target)) {
       setShowProfile(false);
    }
  };
  const myRef = useRef();
  // const handleClickInside = () => setShowProfile(true);
  const showMobileMenu = () => {
    document.querySelector(".mobile-nav__sidebar").style.left = "0px";
  };
  return (
    <>
      <FintooLoader isLoading={isLoading} />
      <div
        className="d-flex justify-content-between"
        ref={myRef}
        onClick={handleClickOutside}
      >
        <div className={style["mobile-nav_"]}>
          <div className="d-block d-md-none" onClick={() => showMobileMenu()}>
            <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/menu.png"} style={{ width: "30px" }} />
          </div>
        </div>
        <div className="profile  ">
          <div className="d-flex ">
            <div className="mt-1">
              <img className="pointer" width={20} src={process.env.REACT_APP_STATIC_URL + "media/DMF/Notification.png"}  />
            </div>
            <div className="ms-3">
              <div
                style={{
                  marginTop: "-.3rem",
                }}
              >
                <img className="pointer profile-img" width={40} src={selectedUser?(selectedUser.user_avatar?selectedUser.user_avatar:defaultUserImage):defaultUserImage} />
              </div>
            </div>
            <div className="ms-3 profieDetails">
              <div className="ProfileName">{loggedIn?(selectedUser? selectedUser.first_name +' '+ selectedUser.last_name : 'All Members'):'Guests'}</div>
            </div>
            <div className="ms-3">
              <img
                className="pointer  hover-dropdown"
                onClick={toggle}
                width={20}
                src={process.env.REACT_APP_STATIC_URL + "media/DMF/down.svg"}
              />
            </div>
          </div>
          {showProfile && (
            <div className="download-report-box hover-dropdown-box d-block">
              <div className="hover-dropdown-content ">
                <div className="custom-dropdown-9 ">
                  <div className="profile-nm-details">
                    <div className="User-details d-flex justify-around">
                      <div className="mt-1">
                        <img className="pointer profile-img" width={40} src={selectedUser?(selectedUser.user_avatar?selectedUser.user_avatar:defaultUserImage):defaultAllMemberImage} />
                      </div>
                      <div className="ms-2 mt-2">
                        <div className="ProfileUserName">{loggedIn?(selectedUser? selectedUser.first_name +' '+ selectedUser.last_name : 'All Members'):'Guests'}</div>
                        <label className="user-mail">{selectedUser? selectedUser.email : ''}</label>
                      </div>
                    </div>
                  </div>
                  <div className="profile-sub-details">
                    <div className="ms-3 me-3">
                      <div className="profile-other-details">
                        {members.length>1?(
                          <React.Fragment>
                          <div className="text-label">Members</div>
                            <div className="profiledata pointer" onClick={()=>{handleSelectUser(null)}}>
                              <div>
                                <img className="pointer profile-img" width={30} src={defaultAllMemberImage} />
                              </div>
                              <div className="textlabel">All Members</div>
                            </div>
                          {members.map((member)=>(
                            <div key={member.id} className="profiledata pointer" onClick={()=>{handleSelectUser(member)}}>
                              <div>
                                <img className="pointer profile-img" width={30} src={member.user_avatar?member.user_avatar:defaultUserImage} />
                              </div>
                              <div className="textlabel">{member.first_name+' '+member.last_name}</div>
                            </div>
                          ))}
                          </React.Fragment>
                        ):('')}
                        <div className="profiledata pointer"  onClick={()=>{redirectToInvoice()}} style={{textDecoration:'none'}}>
                          <div>
                            <img className="pointer profile-img" width={30} src={invoiceImage} />
                          </div>
                          <div className="textlabel">Invoice</div>
                          </div>
                        <div className="profiledata pointer">
                          <div>
                            <img
                              className="pointer profile-img ms-2"
                              width={20}
                              src={process.env.REACT_APP_STATIC_URL + "media/DMF/logout-72.png"}
                            />
                          </div>
                          <div className="textlabel ms-1">Log Out</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>

  );
}

export default Profile;
