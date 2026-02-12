import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Styles from "./Profile.module.css";
import { imagePath } from "../../../constants";

function Profile() {
  return (
    <div className="container">
      <div className="row">
        {/* <div ng-include="'../static/userflow/common/dashboard-mobile-chat.html'"></div> */}
        <div className="col-md-10  pt-1 pb-5">
          <div className="row justify-content-center pt-5 mobile-padding">
            <div className="col-md-10 col-padding">
              <div className={`${Styles.welcomebanner}`}>
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div>
                      <img
                        alt=""
                        src={imagePath + "/static/media/Images/userflow/img/welcome-img"}
                      />
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div>
                      <h2 className={`${Styles.pageheader}`}>Welcome!</h2>
                      <div className={`pt-4 ${Styles.TextPara}`}>
                        <p >
                          We just want some of your personal details before we can
                          start with your financial plan.
                        </p>
                        <p>You can start by clicking on the cards below.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-10 mt-4 mt-md-5 col-padding">
              <div className="row">
                <div className="col-md-6">
                  <div className={`${Styles.whitecontainer}`}>
                    <div className={`d-flex ${Styles.titleheader}`}>
                      <h3 style={{
                        color: '#042b62'
                      }} className="sub-header pt-md-0 color-blue">
                        Basic Details
                      </h3>
                      <div>
                        <Link
                          to={process.env.PUBLIC_URL + "/userflow/profile-fill-details"}
                          href="/userflow/profile-fill-details/"
                          target="_self"
                          className="d-block ml-auto"
                        >
                          <img
                            alt="add"
                            className={`${Styles.addnew}`}
                            src={imagePath + "/static/media/Images/userflow/img/icons/add.svg"}
                          />
                        </Link>
                      </div>
                    </div>
                    {/* <p style="font-weight: bold;">Add / Update</p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
