import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import style from "../../style.module.css";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import {
  getItemLocal,
  getMemberId,
  getUserId,
  removeMemberId,
  setFpUserDetailsId,
  setMemberId,
  setUserId,
} from "../../../../common_utilities";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import * as toastr from "toastr";
import "toastr/build/toastr.css";

function TrackingOption(props) {
  const { setSelectedUserData } = useData();
  const dispatch = useDispatch();

  const updateUserData = async () => {
    dispatch({ type: "SET_USER_DETAILS", payload: props.usersData[0] });
    setSelectedUserData(props.usersData[0]);
  };

  useEffect(() => {
    updateUserData();
  }, []);

  const getMemberIdFn = () => {
    let isFamilySelected = Boolean(localStorage.getItem("family"));
    if (!isFamilySelected) {
      const userId = getUserId();
      const userIdArray = [userId];
      return userIdArray;
    } else {
      return "";
    }
  };

  const navigate = useNavigate();

  const checkDropdownSelect = () => {
    if (!Boolean(props.selectedUserId.memberId)) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error('Please select member from dropdown');
      return;
    }
    props.openPopup()
  }

  const dgexternalfetchbankbal = getItemLocal("dgexternalfetchbankbal");

  return (
    <div className={`${style.bankTrackingOverViewItemContainer}`}>
      <div className={`${style.backOption1}`}>
        <img onClick={() => {
          localStorage.removeItem("dgexternalfetchbankbal");
          dgexternalfetchbankbal == true ? navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`) : navigate(`${process.env.PUBLIC_URL}/commondashboard`)
        }
        }
          style={{ width: '10px', cursor: 'pointer' }} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/backarrow.svg"} />
      </div>
      <div className={`${style.backOption2}`}>
        <img
          onClick={() => navigate(-1)}
          style={{ width: "10px", cursor: "pointer" }}
          src={
            process.env.REACT_APP_STATIC_URL +
            "media/MoneyManagement/backarrow.svg"
          }
        />
      </div>
      <div className={`${style.trackingStepsOptionContainer}`}>
        {/* <img
          className={`${style.trackingStepsOptionImg}`}
          src={
            process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/cuate.svg"
          }
        />
        <br />
        <br /> */}
        <div className={`${style.headerText} text-center`}>
          Your <span style={{ color: "#DD7300" }}> Finances</span>, Your{" "}
          <span style={{ color: "#DD7300" }}>Data</span>, Your{" "}
          <span style={{ color: "#DD7300" }}>Security</span> Trust Fintoo's
          Money Management Tool
        </div>
        <br />
        <div className={`${style.trackingOptionSelectionContainer}`}>
          <div
            className={`${style.secondaryText3} ${style.trackingOptionSelection}`}
          >
            Please select the member{" "}
          </div>
          <Form.Select
            required
            name="guardianRelation"
            onChange={(e) => {
              e.stopPropagation();
              if (e.target.value) {
                let fpUserId =
                  props.usersData.filter((v) => v.id == e.target.value)[0][
                  "fp_user_details_id"
                  ] ?? "";
                if (fpUserId) {
                  props.setSelectedUserId(() => ({
                    memberId: "" + e.target.value,
                    fpUserId: "" + fpUserId
                  }))
                }
              }
            }}
            value={props.selectedUserId.memberId}
          >
            <option value={""}>Who’s account has to track</option>
            {props.usersData.map((item, index) => {
              return (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </Form.Select>
        </div>
      </div>
      <div
        className={`${style.btn2} ${style.trackBtn}`}
        onClick={() => checkDropdownSelect()}
      >
        Track Bank Account
      </div>
      <br />
      <div className={`${style.noteContainer}`} style={{ marginTop: '-0.5rem' }}>
        <div className={`${style.popuiHeader}`}> <img style={{ width: '25px' }} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/zondicons_shield.svg"} /><span className={`${style.headerText2}`}>Track With Security!</span></div>
        <div className={`${style.secondaryText4}`} style={{ display: 'flex', alignItems: 'center' }}>
          When you grant us consent to access your bank transactions through the RBI-regulated Account Aggregator FINVU enables Fintoo to receive end-to-end encrypted data safely, please rest assured that we do not store your password or any other sensitive details. Once you consent, ensure your financial information remains secure.
        </div>
      </div>
      <br />
      <div className={`${style.poweredByContainer}`}>
        <div className={`${style.chip2}`}>Powered by</div>
        <img
          style={{ width: "90px", cursor: "pointer" }}
          src={
            process.env.REACT_APP_STATIC_URL +
            "media/MoneyManagement/finvulogo.svg"
          }
        />
      </div>
    </div>
  );
}

export default TrackingOption;
