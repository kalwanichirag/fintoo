import { useEffect, useState } from "react";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import Menu from "../Assets/Dashboard/menu.png";
import Back from "../Assets/Dashboard/back.png";
import Cart from "../Assets/Dashboard/cart.png";
import Search from "../Assets/Dashboard/Search.png";
import Profile from "../Assets/Dashboard/profile.png";
import Addmember from "../Assets/Dashboard/add.png";
import Settings from "../Assets/Dashboard/account.png";
import Wishlist from "../Assets/Dashboard/wishlist.png";
import Logout from "../Assets/Dashboard/logout.png";
import Female from "../Assets/Dashboard/female.svg";
import { BiChevronDown } from "react-icons/bi";
import AddMembers from "../../Pages/DMF/ProfileInsider/AddMembers";
import { connect, useSelector } from "react-redux";
//  import { Link } from "react-router-dom";
import axios from "axios";
import { DMF_BASE_URL } from "../../constants";
import commonEncode from "../../commonEncode";
import { fetchEncryptData, getUserId } from "../../common_utilities";
import { Link,useNavigate } from "react-router-dom";
import { Select } from "evergreen-ui";
import { fetchUserProfileDetails } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";

const DashboardTopMenu = (props) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const handleTrigger = () => setIsOpen(!isOpen);
  const [getMember, setGetMember] = useState([]);
  const [parent, setParent] = useState([]);
  const [showMenu,setShowMenu] = useState(false);
  const [userDetails,setUserDetails] = useState('');

  useEffect(() => {
    if (localStorage.getItem("hideSideBar") == "true") {
      props.dispatch({ type: "HIDE_SHOW_SIDEBAR", payload: true });
    }
    getParentDetails();
  }, []);

  var user_id = localStorage.getItem("userid");

  const logout = () => {
    localStorage.clear();
    props.dispatch({ type: "LOGGIN_LOGOUT", payload: false });
  };
  
  const fetchgetMemberData = async () => {
    var urlgetmemdata1 = {
      user_id: getUserId()
    };
    
    var data = commonEncode.encrypt(JSON.stringify(urlgetmemdata1)); 
    var config = {
      method: "post",
      url: DMF_BASE_URL + "api/user/getmemberdetails",
      data: data,
    };
    var res = await axios(config);
    var response = commonEncode.decrypt(res.data);
    var a = JSON.parse(response)["data"];
    setGetMember([...a]);
    if(localStorage.getItem('session_user_id') == null) {
      props.dispatch({ type: "CHANGE_MEMBER", payload: { name: a[0]['name'], email: a[0]['email'], id: a[0]['id']} });
    } else {
      var selectedMember = [];
      selectedMember = a.filter((v)=> v.id === (localStorage.getItem('session_user_id') * 1));
      if(selectedMember.length){
        props.dispatch({
          type: "CHANGE_MEMBER",
          payload: {email: selectedMember[0].fdmf_email, name: selectedMember[0].name, memberid: selectedMember[0].id},
        });
      }
    }
  };

  const getParentDetails = async () => {
    var response = await fetchUserProfileDetails(getUserId());
    var res = response.data;
    
    var a = { 'name': res.user_name, email: res.user_email, id: res.user_id,'registration': res.user_bse_registered};
    if(localStorage.getItem('session_user_id') == null) {
      props.dispatch({ type: "CHANGE_MEMBER", payload: { name: a['name'], email: a['email'], id: a['id'], memberid:  a['id']} });
    }
    setParent({...a});
    setTimeout(()=> {
      fetchgetMemberData();
    }, 1000);
  }

  

  const FnGetMemberDetails = async (v) => {
    try {
      localStorage.setItem('session_user_id',v.id);
      setShowMenu(false);
      props.dispatch({
        type: "CHANGE_MEMBER",
        payload: {email: v.fdmf_email, name: v.name, memberid: v.id},
      });
      
      var payload = {
        url: '',
        data: {
          user_id: '' + v.id,
        },
        method: 'post'
      };
    
      var response = await fetchEncryptData(payload);
      setUserDetails(response.data)
      switch(response.data.bse_reg) {
        case 'Y':
          navigate(process.env.PUBLIC_URL + '/direct-mutual-fund/profile/dashboard');
          break;
        case 'N':
          navigate(process.env.PUBLIC_URL + '/direct-mutual-fund/profile');
          break;
        case '':
          navigate(process.env.PUBLIC_URL + '/direct-mutual-fund/profile');
          break;      
      }
      
    } catch(e) {
    }
  }
  const FnGetParentDetails = async (v) => {
    try {
      localStorage.removeItem('session_user_id',v.id);
      setShowMenu(false);
      props.dispatch({
        type: "CHANGE_MEMBER",
        payload: {email: v.fdmf_email, name: v.name, memberid: v.id},
      });
      
      var payload = {
        url: '',
        data: {
          user_id: '' + v.id,
        },
        method: 'post'
      };
    
      var response = await fetchEncryptData(payload);
      setUserDetails(response.data)
      switch(response.data.bse_reg) {
        case 'Y':
          navigate(process.env.PUBLIC_URL + '/direct-mutual-fund/profile/dashboard');
          break;
        case 'N':
          navigate(process.env.PUBLIC_URL + '/direct-mutual-fund/profile');
          break;
        case '':
          navigate(process.env.PUBLIC_URL + '/direct-mutual-fund/profile');
          break;      
      }
      
    } catch(e) {
    }
  }
  const fetchCurrentUser = () => {
    if(localStorage.getItem('session_user_id') == null) {
      return parent.name ? parent.name : parent.email;
    } else {
      return props.memberInfo.name ? props.memberInfo.name : props.memberInfo.email;
    }
  }


  return (
    <>
      <div
        id="header-menu"
      className={`sidebar profileSidebar ${isOpen ? "sidebar--open" : ""}`}
      >
        <div className="Profile-Header">
          <div className="desktopViewBack" onClick={()=> {
            navigate(-1);}}>
            <img
              src={Back}
              className="ProfileBack"
              style={{
                cursor: "pointer",
              }}
              alt="Back"
            />
          </div>
          <div className="mobileHumburger">
            <img
              src={Menu}
              onClick={() => {
                localStorage.setItem("hideSideBar", !props.hideSideBar);
                props.dispatch({
                  type: "HIDE_SHOW_SIDEBAR",
                  payload: !props.hideSideBar,
                });
              }}
              className="ProfileBack"
              style={{
                cursor: "pointer",
              }}
              alt="toggle"
            />
          </div>
          {/* <div className="right-menu">
            
            <div className="space-bet">
              <img src={Cart} className="ProfileSearch" alt="Cart" />
            </div>
            <div onMouseEnter={()=> {
              setShowMenu(true)
            }} onMouseLeave={()=> {
              setShowMenu(false)
            }} className="position-relative hover-dropdown space-bet d-flex">
              <span>
                <img src={Profile} className="ProfilePic" alt="Profile" />
              </span>
              <div
              className="ProfileName"
                style={{
                  cursor: "pointer",
                }}
              >
                Welcome, {fetchCurrentUser()}
              </div>{" "}
              <span>
                <BiChevronDown
                  style={{
                    fontSize: "27px",
                    color: "#042b62",
                    cursor: "pointer",
                  }}
                  className="mt-1"
                />{" "}
              </span>
              <div className={`download-report-box hover-dropdown-box ${showMenu ? 'active':''}`}>
                <div className="hover-dropdown-content">
                  <div className="custom-dropdown-9 ">
                    <div className="profile-nm-details">
                      <div className="User-details">
                        <div onClick={()=> {
                          
                          FnGetParentDetails({...parent, fdmf_email: parent.email});
                        }}><span>{parent.name ? parent.name : parent.email}</span></div>(Family Head)
                        <div className="user-mail">
                         
                          </div> 
                      </div>
                    </div>
                    <div className="profile-sub-details">
                      <div className="text-label">Members</div>
                      <div className="profile-other-details">
                       
                        <div className="profile-others-data">
                        {getMember.map((v)=> (
                          <div className={`profiledata ${(localStorage.getItem('session_user_id') * 1) === v.id ? 'active' : ''}`} onClick={()=> {
                            FnGetMemberDetails(v);
                          }}>
                            <img src={Female} />
                            <span className="textlabel">{v.fdmf_email}</span>
                          </div>
                        ))}
                        </div>
                        <div className="profiledata">
                          <img style={{
                            width : "35px"
                          }} src={Addmember} />
                        <Link to={process.env.PUBLIC_URL + `/direct-mutual-fund/profile/AddMembers`}><span className="textlabel">Add New Member</span></Link>
                          
                        </div>
                        <div className="profiledata">
                          <img style={{
                            width : "31.6px"
                          }} src={Wishlist} />
                          <Link to={process.env.PUBLIC_URL + `/direct-mutual-fund/funds/wishlist`}><span className="textlabel">Wishlist</span></Link>
                        </div>
                      
                        <div className="profiledata">
                          <img src={Logout} />
                          <span className="textlabel"><a onClick={() => logout()}
                                href={
                                  process.env.PUBLIC_URL + "/logout"
                                }
                                >Log Out</a></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  hideSideBar: state.hideSideBar,
  memberInfo: state.memberInfo
});

export default connect(mapStateToProps)(DashboardTopMenu);
