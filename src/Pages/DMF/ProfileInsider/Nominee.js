import React, { useState, useEffect } from "react";
import ProfileInsiderLayout from "../../../components/Layout/ProfileInsiderLayout";
import { useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NomineeList from "./NomineeList";
import Delete from "../../../components/Assets/Dashboard/delete_Gray.png";
import Edit from "../../../components/Assets/Dashboard/edit icon.png";
import { DMF_BASE_URL } from "../../../constants";
import { fetchUserMfProfileStatus } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { addNomineeDetails, getNomineeDetails } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
import axios from "axios"; //api calling
import commonEncode from "../../../commonEncode"; //encrypt decrypt data
import AddNominee from "./AddNominee";
import { } from "../../../constants";

import { ToastContainer, toast } from "react-toastify";
import {
  CheckSession,
  apiCall,
  successAlert,
  errorAlert,
  loginRedirectGuest,
  getUserId,
} from "../../../common_utilities";
import NomineeNoData from "../../../components/ProfileInsider/Nominee/NoData";


const Nominee = (props) => {
  const [nomineeList, getNomineeList] = React.useState("");
  const [dynamicNomineeList, getDynamicNomineeList] = useState([]);
  const [NomineeDatadelete, getNomineeDatadelete] = useState([]);
  const [dummyNomineeData, setdummyNomineeData] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const results = [];
  const [total1, setTotal1] = useState();
  const dispatch = useDispatch();
  const [nomineeflag, setnomineeflag] = useState("");
  const user_id = getUserId();

  useEffect(function () {

    if (getUserId() == null)
      loginRedirectGuest();
    else
      userdetails();
    onLoadInIt();
  }, []);

  useEffect(() => {
    if (nomineeflag === "No" && dynamicNomineeList.length < 1) {
      setShowAddForm(true);
    }
    else {
      setShowAddForm(false);
    }

  })

  const refreshPage = () => {
    onLoadInIt();
    setShowAddForm(false);
  }

  useEffect(() => {
    // // checksession();
    // onLoadInIt();
    userdetails()
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);


  const userdetails = async () => {
    try {
      var response = await fetchUserMfProfileStatus(user_id);
      setnomineeflag(response.data.nominee_authenticated);
      // setuseremail(user_data.email);
      // setusermobile(user_data.mobile);
    } catch (e) { }
  };

  const onLoadInIt = async () => {
    try {
      var user_data = {"nominee_user_id": user_id};
      var res = await getNomineeDetails(user_data);
      getDynamicNomineeList(res.data);

    } catch (e) {

    }
  };
  const HideAddForm = () => {
    setShowAddForm(false);
  }



  return (
    <ProfileInsiderLayout>
      <ToastContainer />
      <div className="ProfileDashboard">
        <div className="ml-10 md:mt-14 mt-4 p-2 md:p-3 rounded-3xl">
          <div className="text-label-info">
            <Row>
              <Col xs={12} lg={12}>
                <Row>
                  <Col>
                    <div
                      className="col-12 col-lg-8 nomineedata"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="text-nominee">
                        <p className="text-label">Nominee</p>
                        <span className="secondTextinfo desktopView">
                          You have added the following nominee for your investments.
                        </span>
                      </div>
                    </div>
                    <p className="Hrline "></p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <div>
            <div className="col-12 text-nominee mobileNomineeText">
              <span className="secondTextinfo">
                You have set of following nominees, for your investments
              </span>
            </div>
            {/* <>
              <Row>
                <Col xs={12} lg={8}>
                  <div
                    style={{
                      float: "right",
                    }}

                    onClick={() => {
                      if (dynamicNomineeList.length >= 1) {
                        if (dynamicNomineeList.length >= 1)
                          
                          dispatch({ type: "RENDER_TOAST", payload: {message: "You cannot add more than one nominee.", type: 'error'} });
                          return;
                        
                      }
                      else {
                        
                        setShowAddForm(true);
                        props.setEditNominee();
                      }
                    }}
                  >
                    {dynamicNomineeList.length > 0 ? "":
                    <div
                      className="pointer"
                      style={{
                        color: "#042b62",
                        fontWeight: "500",
                      }}
                    >
                      + Add New Nominee
                    </div>}
                  </div>
                </Col>
              </Row>
            </> */}
            {dynamicNomineeList.length > 0 && (
              dynamicNomineeList.map((item) => (
                <NomineeList refreshPage={() => refreshPage()} NomineeData={item} />
              ))
            )}

            {/* {Boolean(showAddForm) === false && dynamicNomineeList.length === 0 && <NomineeNoData onAdd={()=> {
              setShowAddForm(true);
            }} />} */}

            {Boolean(showAddForm) && <AddNominee refreshPage={() => refreshPage()} onRemove={() => HideAddForm()} />}

          </div>
        </div>
      </div>
    </ProfileInsiderLayout>
  );
};

export default Nominee;
