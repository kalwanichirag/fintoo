import React, { useState } from "react";

import Man from "../../Assets/Images/CommonDashboard/man.png";
import Down from "../../Assets/Images/CommonDashboard/down.png";
import Add from "../../Assets/Images/CommonDashboard/add.png";
import Account from "../../Assets/Images/CommonDashboard/account.png";
import logout from "../../Assets/Images/CommonDashboard/logout-72.png";
import watchlist from "../../Assets/Images/CommonDashboard/watchlist.png";
import { Link } from "react-router-dom";
import Notification from "../../Assets/Images/CommonDashboard/Notification.png";

function Profile() {
  const [showProfile, setShowProfile] = React.useState(false);
  function toggle() {
    setShowProfile((wasOpened) => !wasOpened);
  }
  const [isOpen, setIsOpen] = useState(false);

  const handleTrigger = () => setIsOpen(!isOpen);
  return (
    <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
    <div className="profile d-flex   float-end">
      
      <div className="d-flex ">
        <div className="mt-1">
          <img className="pointer" width={20} src={process.env.REACT_APP_STATIC_URL + "media/DMF/Notification.png"} />
        </div>
        <div className="ms-4">
          <div>
            <img className="pointer" width={30} src={process.env.REACT_APP_STATIC_URL + "media/DMF/man.png"} />
          </div>
        </div>
        <div className="ms-3 profieDetails">
          <div className="welcomeInfo">Welcome,</div>
          <div className="ProfileName">John Doe</div>
        </div>
        <div className="ms-3     mt-2">
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
                    <img className="pointer" width={40} src={process.env.REACT_APP_STATIC_URL + "media/DMF/man.png"} />
                  </div>
                  <div className="ms-2 mt-2">
                    <div className="ProfileUserName">Ramesh Kumar Singh</div>
                    <label className="user-mail">ramesh@gmail.com</label>
                  </div>
                </div>
              </div>
              <div className="profile-sub-details">
                <div className="ms-3 me-3">
                  <div className="text-label">Members</div>
                  <div className="profile-other-details">
                    <div className="profiledata">
                      <div>
                        <img className="pointer" width={30} src={process.env.REACT_APP_STATIC_URL + "media/DMF/man.png"} />
                      </div>
                      <div className="textlabel">Dinesh Kumar Singh</div>
                    </div>
                    <div className="profiledata">
                      <div>
                        <img className="pointer" width={30} src={process.env.REACT_APP_STATIC_URL + "media/DMF/man.png"} />
                      </div>
                      <div className="textlabel">Ridhima Kumar Singh</div>
                    </div>
                    <div className="profiledata">
                      <Link
                        to="/direct-mutual-fund/profile/AddMembers/"
                        className="d-flex"
                      >
                        <div>
                          <img className="pointer ms-1" width={25} src={process.env.REACT_APP_STATIC_URL + "media/DMF/add.png"}/>
                        </div>
                        <div className="textlabel ms-1">Add New Member</div>
                      </Link>
                    </div>
                    <div className="profiledata">
                      <div>
                        <img
                          className="pointer ms-1"
                          width={20}
                          src={process.env.REACT_APP_STATIC_URL + "media/DMF/watchlist.png"}
                        />
                      </div>
                      <div className="textlabel ms-2">Watchlist</div>
                    </div>
                    <div className="profiledata">
                      <div>
                        <img className="pointer" width={30}  src={process.env.REACT_APP_STATIC_URL + "media/DMF/account.png"}  />
                      </div>
                      <div className="textlabel ">Settings</div>
                    </div>
                    <div className="profiledata">
                      <div>
                        <img className="pointer ms-2" width={20} src={process.env.REACT_APP_STATIC_URL + "media/DMF/logout-72.png"} />
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
  );
}

export default Profile;
