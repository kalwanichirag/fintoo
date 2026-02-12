import { useEffect, useState, useRef } from "react";
import "./GoalDropdown.css";
import { Modal } from "react-bootstrap";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import FintooCheckbox from "../FintooCheckbox/FintooCheckbox";
import mediclaim from "./Mediclaim.module.css";

const MembersDropdown = (props) => {
  const [selectedData, setSelectedData] = useState("");
  const [selectedMemberClone, setSelectedMemberClone] = useState([]);

  const closeMembersModal = () => {
    props.onClose();
  };

  const handleDoneClick = () => {
   
    if (props.insuranceData.insurance_for_member == "Family Multi Individual") {
      if (selectedMemberClone.length < 2) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("You must select minimum of 2 members");
      } else {
        const insu_member = [] 
        setSelectedData(selectedMemberClone.length);
        selectedMemberClone.map(member => insu_member.push(member.label))
        props.setSelectedMembers(insu_member);
        props.setInsuranceData((prev) => ({
          ...prev,
          insurance_total_members: selectedMemberClone.length,
          members: selectedMemberClone,
        }));
        props.onClose();
      }
    } else {

      let ifSpouseFound = Boolean(Number(props.membersData.findIndex((v) => v.relationname == "Spouse")) + 1);
      if (!ifSpouseFound) {
        const spouseIndex = props.membersData.findIndex((v) => v.relationname === "Spouse");
      
        if (spouseIndex !== -1) {
          selectedMemberClone.splice(spouseIndex, 1);
      
          props.setInsuranceData((prev) => ({
            ...prev,
            insurance_total_members: selectedMemberClone.length,
            members: selectedMemberClone,
          }));
        }
      }      
      if(!ifSpouseFound && (selectedMemberClone.length < 2 || selectedMemberClone.length > 3)) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("You must select minimum 2 and maximum 3 members");
      } else if (selectedMemberClone.length < 2 || selectedMemberClone.length > 4) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("You must select minimum 2 and maximum 4 members");
      } else {
        var insu_member = []
        setSelectedData(selectedMemberClone.length);
        selectedMemberClone.map(member => insu_member.push(member.label))
        props.setSelectedMembers(insu_member);
        props.setInsuranceData((prev) => ({
          ...prev,
          insurance_total_members: selectedMemberClone.length,
          members: selectedMemberClone,
        }));
        props.onClose();
      }
    }
  };

  const handleCheckboxChange = (member) => {
    if(member.label != "Self"){
      if (selectedMemberClone.map(x => x.value).includes(member.value)) {
        setSelectedMemberClone((prev) => prev.filter((v) => v.value != member.value));
      } else {
        setSelectedMemberClone((prev) => [...prev, member]);
      }
    }    
  };

  const handleCheckboxChangeFamily = (member) => {
    if (selectedMemberClone.map(x => x.value).includes(member.value)) {
      setSelectedMemberClone((prev) => prev.filter((v) => v.value != member.value));
    } else {
      setSelectedMemberClone((prev) => [...prev, member]);
    }
  };

  let members = [];
  if (props.insuranceData.members) {
    if (
      typeof props.insuranceData.members === "object" &&
      Array.isArray(props.insuranceData.members)
    ) {
      members = [...props.insuranceData.members];
    } else if (typeof props.insuranceData.members === "string") {
      members = [...JSON.parse(props.insuranceData.members.replace(/'/g, '"'))];
    } else {
      members = [];
    }
  } else {
    members = [];
  }
  let insu_members = [];
  if (props.insuranceData.insurance_for_member == "Family Multi Individual") {
    props.familyMultiData.forEach((data) => {
      if (members.some((filter) => filter.value === data.value)) {
        insu_members.push({ value: data.value, label: data.label });
      }
    })
  }
  else if (props.insuranceData.insurance_for_member == "Family Floater") {
    props.familyData.forEach((data) => {
      if (members.some((filter) => filter.value === data.value)) {
        insu_members.push({ value: data.value, label: data.label });
      }
    })
  }
  else{
    insu_members = []
  }

  useEffect(() => {
    if (props.open) {
      let selected = [];
      if (props.insuranceData?.user_insurance_member_ids && props.insuranceData?.user_insurance_member_ids != "null") {
        try {
          selected = JSON.parse(props.insuranceData.user_insurance_member_ids.replace(/'/g, '"'));
        } catch (e) {
          selected = [];
        }
      }
  
      if (selected.length > 0) {
        setSelectedMemberClone(selected);
      } else {
        // fallback to insu_members (already your logic)
        setSelectedMemberClone(insu_members);
      }
    }
  }, [props.open, props.insuranceData.user_insurance_member_ids]);
  

  return (
    <div>
      <Modal
        show={props.open}
        className="popupmodal"
        centered
        onShow={() => {
          setSelectedMemberClone(insu_members);
        }}
      >
        <Modal.Header className={`${mediclaim.mediclaim}`}>
          <div
            className="d-flex justify-content-between w-100"
            style={{ height: "26px" }}
          >
            <div className={` ${mediclaim.Headertxt}`}>
              {" "}
              Select Members for Mediclaim{" "}
            </div>

            <div className="">
              <img
                onClick={() => {
                  closeMembersModal();
                }}
                className={`pointer ${mediclaim.closeImg}`}
                src={
                  process.env.REACT_APP_STATIC_URL + "media/DG/Close_icon.svg"
                }
                width={40}
              />
            </div>
          </div>
          <br></br>
        </Modal.Header>
        <div className=" p-3 d-grid place-items-center align-item-center">
          <div className={`${mediclaim.mediclaimlist}`}>
            <div className={`${mediclaim.primaryTxt}`}>Members</div>
            <div
              className={`${
                props.familyMultiData.length >= 9 ? mediclaim.ScrollData : null
              }`}
            >
              {props.open ? (
                <div className={` ${mediclaim.mediclaimData}  `}>
                  {props.insuranceData.insurance_for_member == "Family Multi Individual" &&
                    props.familyMultiData.map((member, index) => (
                      <div className="d-flex align-items-center">
                        <div>
                          <FintooCheckbox
                            checked={selectedMemberClone.map(x => x.value).includes(member.value)}
                            onChange={() => handleCheckboxChange(member)}
                          />
                        </div>
                        <div
                          title={member.label}
                          className={`${mediclaim.mediclaimmemmber}`}
                        >
                          {member.label}
                        </div>
                      </div>
                    ))}
                    
                  {props.insuranceData.insurance_for_member === "Family Floater" &&
                    props.familyData.map((member, index) => (
                      <div className="d-flex align-items-center">
                        {/* chk-self is used for disabling the selection of Self and Spouse, css in custom.css */}
                        <div>
                          <FintooCheckbox
                            checked={selectedMemberClone.map(x => x.value).includes(member.value)}
                            onChange={() => handleCheckboxChangeFamily(member)}
                          />
                        </div>
                        <div
                          title={member.label}
                          className={`${mediclaim.mediclaimmemmber}`}
                        >
                          {member.label}
                        </div>
                      </div>
                    ))}
                </div>
              ) : null}
            </div>
            <div
              className={`mt-5 ${mediclaim.mediclaimBtns}`}
              style={{ textAlign: "center" }}
            >
              <button
                type="button"
                className={`${mediclaim.ResetBtn}`}
                onClick={() => {
                  let finalArray = [];
                  let _a;
                  try {
                    _a = props.membersData.filter((v) => v.relationname.toLowerCase() == "self")[0]["relationname"];
                    finalArray.push(_a);
                  } catch {
                    // 
                    finalArray.push('Self');
                  }
                  try {
                    _a = props.membersData.filter((v) => v.relationname.toLowerCase() == "spouse")[0]["first_name"];
                    _a = _a + ' ' + props.membersData.filter((v) => v.relationname.toLowerCase() == "spouse")[0]["last_name"];
                    // _b =
                    finalArray.push(_a);
                  } catch {
                    // 
                  }
                  if (props.insuranceData.insurance_for_member === "Family Multi Individual") {
                    setSelectedMemberClone(prevSelectedMembers => {
                      const updatedSelectedMembers = prevSelectedMembers.filter(member => member.label === "Self");
                      return updatedSelectedMembers;
                    });
                  }
                  else{
                    setSelectedMemberClone([]);
                  }
                }}
                // onClick={() => {
                //     setSelectedMemberClone([]);
                // }}
              >
                Reset
              </button>
              <button
                type="button"
                className={`${mediclaim.SaveBtn}`}
                onClick={() => {
                  handleDoneClick();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MembersDropdown;
