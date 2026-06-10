import ProfileInsiderLayout from "../../../components/Layout/ProfileInsiderLayout";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Modal } from "react-bootstrap";

import moment from "moment";
import axios from "axios";
import { DMF_BASE_URL } from "../../../constants";
import { DMF_URL } from "../../../constants";
import { useState, useEffect } from "react";
import commonEncode from "../../../commonEncode";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  CheckSession,
  getUserId,
  fetchEncryptData,
  setItemLocal,
  getItemLocal,
  loginRedirect,
  loginRedirectGuest,
} from "../../../common_utilities";
import { DATA_BELONGS_TO } from "../../../constants";
import { apiCall } from "../../../common_utilities";
import styles from "./style.module.css";
import FintooInlineLoader from "../../../components/FintooInlineLoader";
import WhiteOverlay from "../../../components/HTML/WhiteOverlay";
import FintooLoader from "../../../components/FintooLoader";
import ProfilePercentage from "../../../components/ProfilePercentage";
import FintooBackButton from "../../../components/HTML/FintooBackButton";
import FintooButton from "../../../components/HTML/FintooButton";
import { fetchUserProfileDetails } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";

const ProfileInsiderDashboard = (props) => {
  const [userDetails, setUserDetails] = useState({});
  const memberChanged = useSelector((state) => state.memberChanged);
  const [error, setError] = useState(false);
  const [userPan, setUserPan] = useState("");
  const navigate = useNavigate();
  const [profileStatus, setProfileStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [dis, setDis] = useState("");
  const [holdingNature, setHoldingNature] = useState("");
  const [prof, setprof] = useState("");
  const [residentialStatus, setResidentialStatus] = useState("");
  const [politicallyExposed, setPoliticallyExposed] = useState("");
  const [erroronproceed, setErrorOnProceed] = useState(
    "Please select a member from the dropdown to proceed."
  );
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const [isOpen, setIsOpen] = useState(false);


  useEffect(function () {
    onLoadInIt();
    // // checksession();
    var userid = getUserId();
    if (userid) {
      checkUserData();
    }
    if (getUserId() == null) {
      loginRedirectGuest();
    }
  }, []);

  useEffect(() => {
    onLoadInIt();
  }, []);

  useEffect(() => {
    if (getItemLocal("family")) {
      openModal();
    }
  });

  const checkUserData = async () => {
    var response = await fetchUserProfileDetails(getUserId());
    
    var userData = response?.data
    navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard");
    // if(userData?.user_pan == "") {
    //   if(userData.user_is_minor == 1 && userData.user_bse_registered == 1){
    //     navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard");
    //   }else{
    //     navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile");
    //   }

    // }
    // if (userData?.user_pan) {
    //   if (userData.kyc_verified == 0 || userData.kyc_verified == '') {
    //     navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile");
    //   }
    // }
  };

  var residential_status = "";
  var politically_exposed = "";

  const onLoadInIt = async () => {
    try {
      var userid = getUserId();
      setIsLoading(true);

      var userDetails = await fetchUserProfileDetails(userid);
      
      if (userDetails.data.account_holding_nature_label == "Single") {
        setHoldingNature("Single");
      } else if (userDetails.data.account_holding_nature_label == "Joint") {
        setHoldingNature("Joint");
      } else if (userDetails.data.account_holding_nature_label == "Either or survivor") {
        setHoldingNature("Either or survivor");
      } else {
        setHoldingNature("");
      }
      if(userDetails.status_code === 200){
        setUserPan(userDetails.data.user_pan);
        setUserDetails(userDetails.data);
        setIsLoading(false);
        if (userDetails) {
          residential_status = userDetails.data.user_residential_status;
          politically_exposed = userDetails.data.user_politically_exposed;
          if (residential_status == "RES") {
            setResidentialStatus("Resident");
          } else if (residential_status == "NRI") {
            setResidentialStatus("NRI");
          } else if (residential_status == "3") {
            setResidentialStatus("NRE/NRO");
          } else {
            setResidentialStatus("");
          }

          if (politically_exposed == "1") {
            setPoliticallyExposed("Yes");
          }
          else if (politically_exposed == "3") {
            setPoliticallyExposed("Partially");
          } else {
            setPoliticallyExposed("No");
          }
        }
      } else {
        setUserPan("");
        setUserDetails({});
        setIsLoading(true);
      }

    } catch (e) {
      setIsLoading(false);
      setError(true);
    }
  };

  var urldata = { pan: userPan };

  const userProfileState = async () => {
    setIsLoading1(true);
    try {
      if (userPan == "") return;
      let config = {
        method: "POST",
        url: '',
        data: {
          pan: userPan,
        },
      };
      var res2 = await fetchEncryptData(config);
      setIsLoading1(false);
      setProfileStatus(res2.data[0]);
      if (res2.data[0].profile_status === 100) {
        setDis(" ");
      } else {
        setDis(" disabled");
      }
      // }
    } catch (e) {
      console.error("natu err", e);
    }
  };


  const renderResidentialStatus = (n) => {
    switch (n) {
      case 1:
        return "Resident";
      case 2:
        return "NRI";
      case 3:
        return "NRE/NRO";
      case "":
        return "";
    }
  };

  const renderFatcaPoliticallyExposed = (n) => {
    switch (n) {
      case 0:
        return "No";
      case 1:
        return "Yes";
      case 2:
        return "Partially Exposed";
      case "":
        return "";
    }
  };


  const cleanAddress = () => {
    var a = "";
    if ("userDetails" in userDetails) {
      if ("address" in userDetails.userDetails) {
        a =
          userDetails.userDetails.address +
          " ," +
          userDetails.userDetails.city_name +
          " , " +
          userDetails.userDetails.state_name +
          " , " +
          userDetails.userDetails.country_name;
      } else {
        a =
          ("flat_no" in userDetails.userDetails
            ? userDetails.userDetails.flat_no
            : "") +
          ", " +
          ("building_name" in userDetails.userDetails
            ? userDetails.userDetails.building_name
            : "") +
          ", " +
          ("area" in userDetails.userDetails
            ? userDetails.userDetails.area
            : "") +
          ", " +
          ("userDetails" in userDetails.userDetails
            ? userDetails.userDetails.road_street
            : "") +
          ", " +
          ("city_name" in userDetails.userDetails
            ? userDetails.userDetails.city_name
            : "") +
          ", " +
          ("state_name" in userDetails.userDetails
            ? userDetails.userDetails.state_name
            : "") +
          ", " +
          ("country_name" in userDetails.userDetails
            ? userDetails.userDetails.country_name
            : "");
      }
    }

    a = a
      .split("")
      .filter((v, i) => !(v === " " && v === a[i - 1]))
      .join("");
    // remove space before comma
    a = a.replaceAll(" ,", ",");
    // remove extra comma
    a = a.split("").filter((v, i) => !(v === "," && v === a[i - 1]));
    // add space after comma
    a = a
      .map((v, i) => (v === "," && a[i + 1] !== " " ? v + " " : v))
      .join("")
      .trim();
    return a;
  };

  return (
    <ProfileInsiderLayout prog={dis}>
      <FintooLoader isLoading={isLoading1} />
      <div className="ProfileDashboard">
        <div className="ml-10 md:mt-14 mt-lg-4 p-2 md:p-3 rounded-3xl">
          <div>
            <div className="row">
              <div className="col-lg-8">
                <div className="d-flex">
                  <Link to={process.env.PUBLIC_URL + '/direct-mutual-fund/portfolio/dashboard'} style={{
                    paddingRight: 20
                  }}>
                    <img style={{
                      transform: 'rotate(180deg)'
                    }} width={20} height={20} src={process.env.REACT_APP_STATIC_URL + 'media/icons/chevron.svg'} />
                  </Link>
                  <div className="row" style={{ flexGrow: 1 }}>
                    <div
                      className={`col-12 col-lg-6 ${styles["text-label-info"]}`}
                    >
                      <p className="text-label">Basic Details</p>
                      <p className="secondTextinfo" style={{ color: "#7f7f7f" }}>
                        Information as per KYC
                      </p>
                    </div>
                    <div className={`col-12 col-lg-6 d-flex ${styles["pro-con8"]}`}>
                      <ProfilePercentage />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className={styles.Hrline}></p>
          <div>
            <Row>
              <Col xs={12} lg={8}>
                <Row>
                  <Col xs={12} lg={4}>
                    <div className="P-details mobileData details-fi ProfileName">
                      <div className="Text-label">Name</div>
                      <div
                        className="Text-label-Data"
                        style={{ textTransform: "capitalize" }}
                      >
                        {userDetails.user_name ? userDetails.user_name : ""}{" "}
                        {<>&nbsp;</>}
                      </div>
                    </div>

                    <div className="P-details">
                      <div className="Text-label">Email</div>
                      <div className="Text-label-Data">
                        {userDetails.user_email ? userDetails.user_email : ""}
                        {<>&nbsp;</>}
                      </div>
                    </div>

                    <div className="P-details">
                      <div className="Text-label">Residential Status</div>
                      <div className="Text-label-Data">
                        {residentialStatus}
                        {<>&nbsp;</>}
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div className="P-details details-fi">
                      <div className="Text-label">PAN</div>
                      <div className="Text-label-Data">
                        {userDetails.user_pan ? userDetails.user_pan : ""}
                        {<>&nbsp;</>}
                      </div>
                    </div>
                    <div className="P-details">
                      <div className="Text-label">Marital Status</div>
                      <div
                        className="Text-label-Data"
                        style={{ textTransform: "capitalize" }}
                      >
                        {userDetails.user_marital_status ? userDetails.user_marital_status : ""}
                        {<>&nbsp;</>}
                      </div>
                    </div>
                    <div className="P-details">
                      <div className="Text-label">Occupation</div>
                      <div className="Text-label-Data">
                        {userDetails.user_occupation ? userDetails.user_occupation : ""}
                        {<>&nbsp;</>}
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div className="P-details details-fi">
                      <div className="Text-label">Mobile Number</div>
                      <div className="Text-label-Data">
                        {userDetails.mobile ? userDetails.mobile : ""}
                      </div>
                    </div>
                    <div className="P-details">
                      <div className="Text-label">Date of Birth</div>
                      <div className="Text-label-Data">
                          {userDetails.user_dob ? moment(userDetails.user_dob,'YYYY-MM-DD').format(
                            "DD-MM-YYYY"
                          ) : ""}
                        <>&nbsp;</>

                        <span className="LineHr"></span>
                      </div>
                    </div>
                    <div className="P-details">
                      <div className="Text-label">Account Holding Nature</div>
                      <div className="Text-label-Data">
                        {holdingNature}
                        {<>&nbsp;</>}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <div>
            <Row>
              <Col xs={12} lg={8}>
                <Row>
                  <Col xs={12} lg={4}>
                    <div className="P-details">
                      <div className="Text-label">Politically Exposed</div>
                      <div className="Text-label-Data">
                        {politicallyExposed}
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} lg={8}>
                    <div className="P-details addressDetails" >
                      <div className="Text-label">Residential Address</div>
                      <div style={{
                        whiteSpace: "break-spaces"
                      }} className="Address-Data Text-label-Data">
                        {userDetails.address ? userDetails.address : ""}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <Modal
            backdrop="static"
            size="lg"
            centered
            show={isOpen}
            className="profile-popups sign-popup"
            onHide={() => {
              closeModal(false);
            }}
          >
            <Modal.Body>
              <div className="modal-body-box">
                <center>
                  <h5>
                    <b>{erroronproceed}</b>
                  </h5>
                </center>
                <>
                  <div className="pt-3 pb-3 ">
                    {/* <div className="img-box9 pt-4 inv-sign-border text-center">
                        <img
                          className="img-fluid inv-img-86"
                          // src={require("../../../../Assets/Images/temp_img_8865.jpg")}
                        />
                          </div> */}
                  </div>
                  <div className="pb-3 pt-3">
                    <FintooButton
                      onClick={() => {
                        closeModal(false);
                        window.location.href =
                          process.env.PUBLIC_URL +
                          "/direct-mutual-fund/funds/all";
                      }}
                      title={"Continue"}
                    />
                  </div>
                </>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </ProfileInsiderLayout>
  );
};

export default ProfileInsiderDashboard;

