import React, { useEffect, useState } from "react";
import Styles from "./style.module.css";
import { RiFileUserLine } from "react-icons/ri";
import { FcBusinessman } from "react-icons/fc";
import MaleAvatar from "../Assets/03_02_Introduction_About_me_Male.png";
import FemaleAvatar from "../Assets/03_02_Introduction_About_me_Female.png";
import Profile from "../Assets/03_01_Introduction_banner.svg";
import Name from "../Assets/03_02_01_Introduction_name.png";
import Age from "../Assets/03_04_Introduction_age.png";
import Gender from "../Assets/03_02_03_introduction_age.png";
import RetireAge from "../Assets/03_02_04_introduction_Retirement_Age.png";
import LifeExpectency from "../Assets/03_02_05_introduction_Life_Expectancy.png";
import Mail from "../Assets/03_02_05_introduction_email.png";
import MyFamily from "../Assets/03_03_Introduction_my_family.svg";
import Spouse from "../Assets/03_01_Introduction_spouse.svg";
import Son from "../Assets/03_04_Introduction_son.png";
import Daughter from "../Assets/03_05_Introduction_son..svg";
import Father from "../Assets/03_09_Introduction_father.png";
import Mother from "../Assets/03_10_Introduction_mother.png";
import HUF from "../Assets/03_11_Introduction_huf.png";
import ReportHeader from "../ReportHeader";
import ReportFooter from "../ReportFooter";
import {
  apiCall,
  getItemLocal,
  getParentUserId,
  getUserId,
  loginRedirectGuest,
  capitalize,
} from "../../../../common_utilities";
import {
  CHECK_SESSION,
} from "../../../../constants";
import { getFamilyMember } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService.js";
import { formatApiValue } from "../../../../Utils/Date/DateFormat.js";

function ProfileReport() {
  const [userAvatar, setUserAvatar] = useState("");
  const [userSessionData, setUserSessionData] = useState({});
  const [userProfileData, setUserProfileData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [earningMembers, setEarningMembers] = useState([]);
  const [dependentMembers, setDependentMembers] = useState([]);
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [retirementage, setRetirementAge] = useState("");
  const [lifeexpectancyage, setLifeExpentancyAge] = useState("");
  const userid = getParentUserId();
  const userIcon = {
    Spouse: Spouse,
    Son: Son,
    Daughter: Daughter,
    Father: Father,
    Mother: Mother,
    "Hindu Undivided Family": HUF,
  };

  const getSessionData = async () => {
    // let url = CHECK_SESSION;
    // let data = { user_id: userid, sky: getItemLocal("sky") };
    // let session_data = await apiCall(url, data, true, false);
    // if (session_data["error_code"] == "100") {
    //   setUserSessionData(session_data["data"]);
    //   let firstName = session_data["data"]["user_details"]["first_name"];
    //   let lastName = session_data["data"]["user_details"]["last_name"];
    //   setFullName(firstName + " " + lastName);
    //   setEmail(session_data["data"]["email"]);
    //   setRetirementAge(session_data["data"]["user_details"]["retirement_age"]);
    //   setLifeExpentancyAge(
    //     session_data["data"]["user_details"]["life_expectancy"]
    //   );
    // } else if (session_data["error_code"] == "102") {
    //   loginRedirectGuest();
    // }
    // else {
    //   setUserSessionData({});
    // }
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return "-";
    try {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age > 0 ? age : "-";
    } catch {
      return "-";
    }
  };

  const getRpYourProfileData = async () => {
    try {
      const user_id = getUserId();
      
      if (!user_id) {
        loginRedirectGuest();
        return;
      }

      // Use the family member API to get both user profile and family data
      const data = await getFamilyMember(user_id);

      if (data.status_code === 200 && data.data) {
        // Separate user profile data (Self) and family members
        const userProfileData = data.data.find(member => 
          member.relation === "Self" && member.user_parent_id === null
        );
        
        const familyMembersData = data.data.filter(member => 
          !(member.relation === "Self" && member.user_parent_id === null)
        );

        // Set user profile data
        if (userProfileData) {
          setUserProfileData(userProfileData);
          
          // Set age with fallback
          const calculatedAge = calculateAge(userProfileData.dob);
          setAge(calculatedAge);

          // Set gender and avatar with fallbacks
          const userGender = userProfileData.gender?.toLowerCase() || "male";
          setGender(userGender);
          
          if (userGender === "male" || userGender === "other") {
            setUserAvatar(MaleAvatar);
          } else if (userGender === "female") {
            setUserAvatar(FemaleAvatar);
          } else {
            setUserAvatar(MaleAvatar); // Default fallback
          }

          // Set name with fallback
          const firstName = userProfileData.user_name || "-";
          const lastName = "-"; // Not splitting name as it's already full name
          
          if (firstName === "-" && lastName === "-") {
            setFullName("-");
          } else {
            setFullName(`${firstName !== "-" ? firstName : ""} ${lastName !== "-" ? lastName : ""}`.trim());
          }

          // Set email with fallback
          setEmail(userProfileData.user_email || "-");

          // Set retirement age and life expectancy with fallbacks
          setRetirementAge(userProfileData.retirement_age || "-");
          setLifeExpentancyAge(userProfileData.life_expectancy_age || "-");

          // Set mobile with proper formatting
          if (userProfileData.mobile_number) {
            setMobile(userProfileData.mobile_number);
          } else {
            setMobile("-");
          }
        } else {
          // No user profile data found, set defaults
          setUserProfileData({});
          setAge("-");
          setGender("male");
          setUserAvatar(MaleAvatar);
          setFullName("-");
          setEmail("-");
          setRetirementAge("-");
          setLifeExpentancyAge("-");
          setMobile("-");
        }

        // Transform family members data
        const transformedMembers = familyMembersData.map(member => ({
          user_id: member.user_id,
          first_name: member.user_name ? member.user_name.split(' ')[0] : "-",
          last_name: member.user_name ? member.user_name.split(' ').slice(1).join(' ') || "" : "-",
          relation_name: formatApiValue(member.relation),
          relation_id: formatApiValue(member.relation_id),
          age: calculateAge(member.dob),
          gender: formatApiValue(member.gender),
          mobile_number: formatApiValue(member.mobile_number),
          pan_number: formatApiValue(member.pan),
          retirement_age: formatApiValue(member.retirement_age),
          life_expectancy: formatApiValue(member.life_expectancy_age),
          dob: formatApiValue(member.dob),
          occupation: formatApiValue(member.occupation),
          occupation_id: formatApiValue(member.occupation_id),
          is_minor: member.is_minor,
          isdependent: member.is_dependent ? "1" : "0", // Convert boolean to string for compatibility
        }));

        setMemberData(transformedMembers);
        
        // Separate earning and dependent members
        const earning_members_tmp = [];
        const dependent_members_tmp = [];

        transformedMembers.forEach((member) => {
          if (member.isdependent === "1") {
            dependent_members_tmp.push(member);
          } else {
            earning_members_tmp.push(member);
          }
        });

        setEarningMembers(earning_members_tmp);
        setDependentMembers(dependent_members_tmp);
        
      } else {
        console.error("Failed to fetch family data:", data.message || "Unknown error");
        // Set default states when API fails
        setUserProfileData({});
        setMemberData([]);
        setEarningMembers([]);
        setDependentMembers([]);
      }
    } catch (error) {
      console.error("Error fetching family data:", error);
      // Set default states when error occurs
      setUserProfileData({});
      setMemberData([]);
      setEarningMembers([]);
      setDependentMembers([]);
    }
  };

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      loginRedirectGuest();
    }
  }, []);

  useEffect(() => {
    getSessionData();
    getRpYourProfileData();
  }, []);

  return (
    <>
      {/* <ReportHeader /> */}
      <div>
        <div className={`${Styles.ReportProfile}`}>
          <div style={{
            marginTop : "2rem"
          }} className={`${Styles.ReportSection}`}>
            <p>Profile</p>
          </div>
          <div
            style={{
              marginTop: "4rem",
            }}
          >
            <div className={`${Styles.RightSide}`}>
              <div>
                <img src={Profile} />
              </div>
              <div className={`${Styles.borderDv}`}></div>
            </div>
            {userProfileData ? (
              <div>
                <div className={`${Styles.profileType}`}>
                  <div className={`${Styles.TypeBox}`}>
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                        }}
                        className={`${Styles.bgWHite}`}
                      >
                        <span className={`${Styles.icons}`}>
                          <img width={40} src={userAvatar} />
                        </span>
                      </span>
                      <span className={`${Styles.Heading}`}>About Me</span>
                    </div>
                  </div>
                  <div></div>
                </div>
                <div className={`${Styles.ProfileSection}`}>
                  <table className="">
                    <tbody>
                      <tr className="mb-md-2">
                        <td>
                          <div className={`${Styles.DataImg}`}>
                            <img width={20} src={Name} />{" "}
                          </div>
                          <div className={`${Styles.DataInfo}`}>
                            <div>Name</div>
                            <div className={`${Styles.Datalabel}`}>
                              {fullname || "-"}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={`${Styles.DataImg}`}>
                            <img width={20} src={Age} />{" "}
                          </div>
                          <div className={`${Styles.DataInfo}`}>
                            <div>Age</div>
                            <div className={`${Styles.Datalabel}`}>{age || "-"}</div>
                          </div>
                        </td>
                        <td>
                          <div className={`${Styles.DataImg}`}>
                            <img width={20} src={Gender} />{" "}
                          </div>
                          <div className={`${Styles.DataInfo}`}>
                            <div>Gender</div>
                            <div className={`${Styles.Datalabel}`}>
                              {gender ? capitalize(gender) : "-"}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={`${Styles.DataImg}`}>
                            <img width={20} src={RetireAge} />{" "}
                          </div>
                          <div className={`${Styles.DataInfo}`}>
                            <div>Retirement Age</div>
                            <div className={`${Styles.Datalabel}`}>
                              {retirementage || "-"}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={`${Styles.DataImg}`}>
                            <img width={20} src={LifeExpectency} />{" "}
                          </div>
                          <div className={`${Styles.DataInfo}`}>
                            <div>Life Expectency</div>
                            <div className={`${Styles.Datalabel}`}>
                              {lifeexpectancyage || "-"}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <div className={`${Styles.DataImg}`}>
                            <img width={20} src={Mail} />{" "}
                          </div>
                          <div className={`${Styles.DataInfo}`}>
                            <div>Email</div>
                            <div className={`${Styles.Datalabel}`}>{email || "-"}</div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <p>No Records Found</p>
              </div>
            )}
            <div className={`${Styles.MyFamily}`}>
              {memberData.length > 0 ? (
                <div>
                  <div>
                    <div>
                      <div className={`${Styles.profileType}`}>
                        <div
                          style={{
                            width: "100%",
                          }}
                          className={`${Styles.borderDv}`}
                        ></div>
                        <div className={`${Styles.TypeBox}`}>
                          <div
                            style={{
                              position: "relative",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                              }}
                              className={`${Styles.bgWHite}`}
                            >
                              <span className={`${Styles.icons}`}>
                                <img width={40} src={MyFamily} />
                              </span>
                            </span>
                            <span className={`${Styles.Heading}`}>
                              My Family
                            </span>
                          </div>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>

                  {earningMembers.length > 0
                    ? earningMembers.map((earningMember) => (
                        <div className="" key={earningMember.user_id}>
                          <div>
                            <div>
                              <div className={`ms-1 ${Styles.profileType}`}>
                                <div className={`${Styles.TypeSubBox}`}>
                                  <div
                                    style={{
                                      position: "relative",
                                    }}
                                  >
                                    <span
                                      style={{
                                        position: "absolute",
                                      }}
                                      className={`${Styles.bgWHite}`}
                                    >
                                      <span className={`${Styles.icons}`}>
                                        <img
                                          width={40}
                                          src={
                                            userIcon[
                                              earningMember.relation_name
                                            ]
                                          }
                                        />
                                      </span>
                                    </span>
                                    <span className={`${Styles.Heading}`}>
                                      {earningMember.relation_name}
                                    </span>
                                  </div>
                                </div>
                                <div className={`${Styles.Datalabel}`}></div>
                              </div>
                            </div>
                          </div>
                          <div className={`${Styles.ProfileSection}`}>
                            <table className="">
                              <tbody>
                                <tr className="mb-md-2">
                                  <td>
                                    <div className={`${Styles.DataImg}`}>
                                      <img width={20} src={Name} />{" "}
                                    </div>
                                    <div className={`${Styles.DataInfo}`}>
                                      <div>Name</div>
                                      <div className={`${Styles.Datalabel}`}>
                                        {earningMember.first_name +
                                          " " +
                                          earningMember.last_name}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className={`${Styles.DataImg}`}>
                                      <img width={20} src={Age} />{" "}
                                    </div>
                                    <div className={`${Styles.DataInfo}`}>
                                      <div>Age</div>
                                      <div className={`${Styles.Datalabel}`}>
                                        {earningMember.age}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className={`${Styles.DataImg}`}>
                                      <img width={20} src={Gender} />{" "}
                                    </div>
                                    <div className={`${Styles.DataInfo}`}>
                                      <div>Gender</div>
                                      <div className={`${Styles.Datalabel}`}>
                                        {capitalize(earningMember.gender)}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className={`${Styles.DataImg}`}>
                                      <img width={20} src={RetireAge} />{" "}
                                    </div>
                                    <div className={`${Styles.DataInfo}`}>
                                      <div>Retirement Age</div>
                                      <div className={`${Styles.Datalabel}`}>
                                        {earningMember.retirement_age || earningMember.retirement_age === 0 ? earningMember.retirement_age : "-"}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className={`${Styles.DataImg}`}>
                                      <img width={20} src={LifeExpectency} />{" "}
                                    </div>
                                    <div className={`${Styles.DataInfo}`}>
                                      <div>Life Expectency</div>
                                      <div className={`${Styles.Datalabel}`}>
                                        {earningMember.life_expectancy || earningMember.life_expectancy === 0 ? earningMember.life_expectancy : "-"}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))
                    : ""}
                  {dependentMembers.length > 0
                    ? dependentMembers.map((dependentMember) => (
                        <div className="" key={dependentMember.user_id}>
                          <div>
                            <div>
                              <div className={`${Styles.profileType}`}>
                                <div
                                  style={{
                                    width: "100%",
                                  }}
                                  className={`${Styles.borderDv}`}
                                ></div>
                                <div className={`${Styles.TypeSubBox}`}>
                                  <div
                                    style={{
                                      position: "relative",
                                    }}
                                  >
                                    <span
                                      style={{
                                        position: "absolute",
                                      }}
                                      className={`${Styles.bgWHite}`}
                                    >
                                      <span className={`${Styles.icons}`}>
                                        <img
                                          width={40}
                                          src={
                                            userIcon[
                                              dependentMember.relation_name
                                            ]
                                          }
                                        />
                                      </span>
                                    </span>
                                    <span className={`${Styles.Heading}`}>
                                      {dependentMember.relation_name}
                                    </span>
                                  </div>
                                </div>
                                <div></div>
                              </div>
                              <div className={`${Styles.ProfileSection}`}>
                                <table className="">
                                  <tbody>
                                    <tr className="mb-md-2">
                                      <td>
                                        <div className={`${Styles.DataImg}`}>
                                          <img width={20} src={Name} />{" "}
                                        </div>
                                        <div className={`${Styles.DataInfo}`}>
                                          <div>Name</div>
                                          <div
                                            className={`${Styles.Datalabel}`}
                                          >
                                            {dependentMember.first_name +
                                              " " +
                                              dependentMember.last_name}
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <div className={`${Styles.DataImg}`}>
                                          <img width={20} src={Age} />{" "}
                                        </div>
                                        <div className={`${Styles.DataInfo}`}>
                                          <div>Age</div>
                                          <div
                                            className={`${Styles.Datalabel}`}
                                          >
                                            {dependentMember.age}
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <div className={`${Styles.DataImg}`}>
                                          <img width={20} src={Gender} />{" "}
                                        </div>
                                        <div className={`${Styles.DataInfo}`}>
                                          <div>Gender</div>
                                          <div
                                            className={`${Styles.Datalabel}`}
                                          >
                                            {capitalize(dependentMember.gender)}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    : ""}
                </div>
              ) : (
                <div className={`${Styles.Norecord}`}>
                  <p>No Family Members Records found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <ReportFooter /> */}
    </>
  );
}

export default ProfileReport;
