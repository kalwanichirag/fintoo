import React, { useRef, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Slider from "../../../components/HTML/Slider";
import Switch from "react-switch";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaSwimmingPool } from "react-icons/fa";
import SimpleReactValidator from "simple-react-validator";
import FintooLoader from "../../../components/FintooLoader";
import GoalsDropdown from "../../../components/GoalsDropdown/GoalDropdown";
import customStyles from "../../../components/CustomStyles";
import {ScrollToTop} from "../ScrollToTop"
import { imagePath } from "../../../constants";
function Others(props) {
  const setAssetsDetails = props.setAssetsDetails;
  const assetsDetails = props.assetsDetails;
  const familyData = props.familyData;
  const goalData = props.goalData;
  const addForm = props.addForm;
  const updateForm = props.updateForm;
  const addAssetsSubmit = props.addAssetsSubmit;
  const cancelAssetForm = props.cancelAssetForm;
  const updateAssetsSubmit = props.updateAssetsSubmit;
  const assetForMember = props.assetForMember;
  const setGoalSelected = props.setGoalSelected;
  const closeModal = props.closeModal;
  const selectGoals = props.selectGoals;
  const selectedGoals = props.selectedGoals;
  const selectedGoalIdArray = props.selectedGoalIdArray;
  const selectedGoalsId = props.selectedGoalsId;
  const setPriorityArray = props.setPriorityArray;
  const selectedPriorityArray = props.selectedPriorityArray;
  const setAutoMatedGoal = props.setAutoMatedGoal;
  const isAutoMatedGoal = props.isAutoMatedGoal;
  const setGoalLink = props.setGoalLink;
  const isGoalSelected = props.isGoalSelected;
  const setSelectedGoals = props.setSelectedGoals;
  const setSelectedGoalsId = props.setSelectedGoalsId;
  const setSelectedPriorityArray = props.setSelectedPriorityArray;
  const unchangedgoaldata = props.unchangedgoaldata;
  const assetEditId = props.assetEditId;
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    forceUpdate(2);

    if (isFormValid) {
      // setIsLoading(true);
      addAssetsSubmit(e);
      setGoalSelected(false);

      setSelectedGoalsId(false);
      setSelectedPriorityArray([]);
      setAutoMatedGoal(true);
      setSelectedGoals("Automated Linkage");
      simpleValidator.current.hideMessages();
      forceUpdate(2);
    }
  };

  const handleUploadUpdate = async (e) => {
    e.preventDefault();
    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    forceUpdate(2);

    if (isFormValid) {
      // setIsLoading(true);
      updateAssetsSubmit(e);
      setGoalSelected(false);

      setSelectedGoalsId(false);
      setSelectedPriorityArray([]);
      setAutoMatedGoal(true);
      setSelectedGoals("Automated Linkage");
      simpleValidator.current.hideMessages();
      forceUpdate(2);
    }
  };

  const handleUploadCancel = async (e) => {
    e.preventDefault();
    cancelAssetForm(e);
    setGoalSelected(false);

    setSelectedGoalsId(false);
    setSelectedPriorityArray([]);
    if (assetEditId) {
      if (selectedGoals == "Automated Linkage") {
        setAutoMatedGoal(true);
        setSelectedGoals("Automated Linkage");
      } else {
        setAutoMatedGoal(false);
      }
    } else {
      setAutoMatedGoal(true);
      setSelectedGoals("Automated Linkage");
    }
    if (session && !assetEditId) {
      props.getfpgoalsdata(session.data.fp_log_id);
    }
    simpleValidator.current.hideMessages();
    forceUpdate(2);
  };

  return (
    <div>
      <FintooLoader isLoading={isLoading}></FintooLoader>
      <form noValidate="novalidate" name="goldassetform">
        <div className="row d-flex align-items-center">
          <div className="col-md-5 custom-input">
            <div className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null} `} style={{paddingTop : "17px"}}>
              <input
                type="text"
                id="asset_name_others"
                name="asset_name"
                maxLength={35}
                value={assetsDetails.user_asset_name}
                onChange={(e) => {
                  setAssetsDetails({
                    ...assetsDetails,
                   user_asset_name: e.target.value,
                  });
                }}
                onBlur={() => {
                  simpleValidator.current.showMessageFor("Asset Name");
                  forceUpdate(1);
                }}
                required
                autoComplete="off"
              />
              <span class="highlight"></span>
              <span class="bar"></span>
              <label for="name">Name of Asset*</label>
            </div>
            {simpleValidator.current.message(
              "Asset Name",
              assetsDetails.user_asset_name,
              "required|alpha_space|min:3|max:60",
              {
                messages: {
                  alpha_space: "Alphabets are allowed only.",
                  required: "Please enter asset name",
                  max: "Asset name must be between 3-35 characters.",
                  min: "Asset name must be between 3-35 characters.",
                },
              }
            )}
          </div>
          <div className="col-md-5">
            <div className="material mt-md-0 mt-3">
              <Form.Label>Name of holder*</Form.Label>
              {familyData && (
                <Select
                  classNamePrefix="sortSelect"
                  isSearchable={false}
                  styles={customStyles}
                  options={familyData}
                  onChange={(e) =>
                    setAssetsDetails({
                      ...assetsDetails,
                      user_asset_for: e.value,
                    })
                  }
                  value={familyData.filter(
                    (v) => v.value == assetsDetails.user_asset_for
                  )}
                />
              )}
            </div>
          </div>
        </div>
    
        <div className="row py-md-3">
          <div className="col-md-5 ">
            <div className="material mt-md-0 mt-4">
              <Form.Label>
                Rate Of Return (%)* : {Number(assetsDetails.user_asset_ror)}
              </Form.Label>
              <div
                className={`${assetsDetails.user_asset_ror < 2 && "sl-hide-left"} ${assetsDetails.user_asset_ror > 18 && "sl-hide-right"
                  }`}
              >
                <Slider
                  min={0}
                  max={20}
                  defaultValue={assetsDetails.user_asset_ror}
                  step={0.05}
                  onChange={(v) => {
                    setAssetsDetails({ ...assetsDetails, user_asset_ror: v });
                  }}
                  handleStyle={{
                    borderColor: "#042b62",
                    backgroundColor: "#042b62",
                  }}
                  railStyle={{
                    backgroundColor: "#ade9c0",
                  }}
                  trackStyle={{
                    backgroundColor: "#ade9c0",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row py-md-3">
          <div className="col-md-5 custom-input">
            <div
              className={`form-group ${assetsDetails.user_asset_current_amount ? "inputData" : null
                } `}
            >
              <input
                name="currentBalance"
                id="currentBalance_others"
                type="number"
                value={assetsDetails.user_asset_current_amount}
                onChange={(e) => {
                  setAssetsDetails({
                    ...assetsDetails,
                    user_asset_current_amount: e.target.value.slice(0, 10),
                  });
                }}
                onBlur={(e) => {
                  simpleValidator.current.showMessageFor("Current Balance");
                  // forceUpdate(1);
                }}
                required
                autoComplete="off"
              />
              <span class="highlight"></span>
              <span class="bar"></span>
              <label for="name">Current Balance*</label>
            </div>
            {simpleValidator.current.message(
              "Current Balance",
              assetsDetails.user_asset_current_amount,
              "required",
              { messages: { required: "Please enter current balance" } }
            )}
          </div>
          <div className="row py-md-3">
            <div className="col-md-8 mt-md-0 mt-3">
              <div className="d-md-flex">
              <div>
              <Form.Label className=" ">
                  Consider This Asset In Automated Linkage*
                </Form.Label>
                <span
                  className="ms-md-4 info-hover-left-box float-right"
                  style={{
                    position: "relative !important",
                  }}
                >
                  <span className="icon">
                    <img
                      alt="More information"
                       src={imagePath + '/static/media/more_information.svg'}
                    />
                  </span>
                  <span className="msg">
                    Select a goal below to map this investment with a goal of your
                    choice. Otherwise, Fintoo will link it automatically with your
                    high priority goal. In case, you do not wish to utilize this
                    investment for any goal, select "NO".
                  </span>
                </span>
              </div>
                <div className="d-flex  ms-md-4">
                  <div>No</div>
                  <Switch
                    onChange={(v) =>
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_automated_linkage: v ? 1 : 0 ? 1 : 0
                      })
                    }
                     checked={assetsDetails.user_asset_automated_linkage === 1 ? true : false}
                    className="react-switch px-2"
                    activeBoxShadow="0 0 2px 3px #042b62"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={20}
                    width={40}
                    onColor="#042b62"
                    offColor="#d8dae5"
                  />
                  <div>Yes</div>
                </div>
              </div>
            </div>
          </div>
          {assetsDetails.user_asset_automated_linkage === true || assetsDetails.user_asset_automated_linkage === 1 && (
            <>
              <div className="row py-md-2">
                <div className="col-md-8 mt-md-2 mt-3">
                  <div className="d-md-flex">
                    <Form.Label className="link_asset_style">
                      Link This Investment Asset to Goal
                    </Form.Label>{" "}
                    <span
                      className="ms-md-4 info-hover-left-box float-right"
                      style={{
                        position: "relative !important",
                      }}
                    >
                      <span className="icon">
                        <img
                          alt="More information"
                           src={imagePath + '/static/media/more_information.svg'}
                        />
                      </span>
                      <span className="msg">
                        You can only assign goals which are prior to the end
                        date of the SIP, if any
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mt-md-0 mt-md-5 mt-2">
                <div className="material">
                  <div
                    className="m-0 btn-sm default-btn gradient-btn save-btn"
                    onClick={() => setGoalSelected(true)}
                  >
                    Select Goals
                  </div>
                  <br></br>
                  <br></br>

                  {selectedGoals ? (
                    <div
                      className="d-flex"
                      style={{ textAlign: "left!important" }}
                    >
                      <div style={{whiteSpace :"nowrap"}}>
                        <b>Selected Goals : </b>
                      </div>
                      <div className="ms-1">{selectedGoals}</div>
                    </div>
                  ) : (
                    ""
                  )}
                  {isGoalSelected ? (
                    <GoalsDropdown
                      setGoalSelected={setGoalSelected}
                      goals={goalData}
                      unchangedgoaldata={unchangedgoaldata}
                      closeModal={closeModal}
                      selectGoals={selectGoals}
                      selectedGoals={selectedGoals}
                      selectedGoalIdArray={selectedGoalIdArray}
                      selectedGoalsId={selectedGoalsId}
                      setPriorityArray={setPriorityArray}
                      selectedPriorityArray={selectedPriorityArray}
                      setAutoMatedGoal={setAutoMatedGoal}
                      isAutoMatedGoal={isAutoMatedGoal}
                      setGoalLink={setGoalLink}
                      type={"Asset"}
                    ></GoalsDropdown>
                  ) : (
                    ""
                  )}
                  <span
                    className="info-hover-box float-right"
                    style={{
                      position: "relative !important",
                    }}
                  >
                    <span className="icon ms-4">
                      <img
                        alt="More information"
                         src={imagePath + '/static/media/more_information.svg'}
                      />
                    </span>
                    <span className="msg">
                      You can only assign goals which are prior to the end date
                      of the asset
                    </span>
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="row py-2">
            <div className=" text-center">
              <div>
                <div className="btn-container">
                  <div className="d-flex justify-content-center">
                    <a
                      href={process.env.PUBLIC_URL + "/datagathering/goals"}
                    >
                      <div className="previous-btn form-arrow d-flex align-items-center">
                        <FaArrowLeft />
                        <span className="hover-text">&nbsp;Previous</span>
                      </div>
                    </a>

                    {props.addForm && (
                      <button
                        onClick={(e) => handleUploadSubmit(e)}
                        className="default-btn gradient-btn save-btn"
                      >
                        Save & Add More
                      </button>
                    )}
                    {props.updateForm && (
                      <div>
                        <button
                          onClick={(e) => handleUploadCancel(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => handleUploadUpdate(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Update
                        </button>
                      </div>
                    )}

                    <div
                      className="next-btn form-arrow d-flex align-items-center"
                      onClick={() => 
                        {
                          ScrollToTop();
                          props.setTab("tab2")}
                      }
                    >
                      <span className="hover-text" style={{ maxWidth: 100 }}>
                        Continue&nbsp;
                      </span>
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Others;
