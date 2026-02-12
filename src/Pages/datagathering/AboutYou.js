import React, { useRef, useState } from "react";
import { useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import QuizeRadio from "../../components/HTML/QuizRadio";
import { MdDelete } from "react-icons/md";
import { BsPencilFill } from "react-icons/bs";
import DatePicker from "react-date-picker";
import ReactDatePicker from "../../components/HTML/ReactDatePicker/ReactDatePicker";
import moment from "moment";
import { Row, Modal } from "react-bootstrap";
import DatagatherLayout from "../../components/Layout/Datagather";
import Select from "react-select";
import { Link, useLocation } from "react-router-dom";
import YourInfo from "./AboutYouPages/YourInfo";
import { BiSave } from "react-icons/bi";
import Assumptions from "./AboutYouPages/Assumptions";
import Family from "./Family";
import { ScrollToTop } from './ScrollToTop'
import {
  CHECK_SESSION,
  imagePath,
} from "../../constants";
import {
  apiCall,
  fetchEncryptData,
  getItemLocal,
  getParentFpLogId,
  getParentUserId,
  getSchemeDataStorage,
  getUserId,
  getprofilestatus, fetchData,
  setBackgroundDivImage
} from "../../common_utilities";
import commonEncode from "../../commonEncode";
import * as toastr from "toastr";
import "toastr/build/toastr.css";

import "toastr/build/toastr.css";
import DigiLocker from "./AboutYouPages/DigiLocker";
import SimpleReactValidator from "simple-react-validator";
import FintooLoader from "../../components/FintooLoader";
import customStyles from "../../components/CustomStyles";
import { useDispatch } from "react-redux";
import GetStarted from "./AboutYouPages/GetStarted";
import QuizRadio from "../../components/HTML/QuizRadio";
import { AddUpdateUserRiskAnswersUrl, FetchRiskQuestionsUrl, FetchUserRiskAnswersUrl } from "../../FrappeIntegration-Services/services/financial-planning-api/yourprofileapi";
// import QuizRadio2 from "../../components/HTML/QuizRadio/QuizRadio2";

// const questions = [
//   {
//     q: "Compared to others, how do you rate your willingness to take financial risks?",
//     a: [
//       { title: "Very Low Risk Taker.", value: 1 },
//       { title: "Low Risk Taker.", value: 2 },
//       { title: "Average Risk Taker.", value: 3 },
//       { title: "High Risk Taker.", value: 4 },
//       { title: "Extremely High Risk Taker.", value: 5 },
//     ],
//   },
//   {
//     q: "How easily do you adapt when things go wrong financially?",
//     a: [
//       { title: "Very Uneasily.", value: 1 },
//       { title: "Somewhat Uneasily.", value: 3 },
//       { title: "Somewhat Easily.", value: 5 },
//       { title: "Very Easily.", value: 6 },
//     ],
//   },
//   {
//     q: 'When you think of the word "risk" in a financial context, which of the following words comes to mind first?',
//     a: [
//       { title: "Danger", value: 1 },
//       { title: "Uncertainty", value: 3 },
//       { title: "Opportunity", value: 5 },
//       { title: "Thrill", value: 6 },
//     ],
//   },
//   {
//     q: "If you had to choose between more job security with a small pay Increase and less job Security with a big pay increase which would you pick ?",
//     a: [
//       {
//         title: "Definitely More Job Security With A Small Pay Increase.",
//         value: 1,
//       },
//       {
//         title: "Probably More Job Security With A Small Pay Increase.",
//         value: 2,
//       },
//       { title: "Not Sure.", value: 3 },
//       {
//         title: "Probably Less Job Security With A Big Pay Increase.",
//         value: 4,
//       },
//       {
//         title: "Definitely Less Job Security With A Big Pay Increase.",
//         value: 5,
//       },
//     ],
//   },
//   {
//     q: "Suppose that 5 years ago you bought stock in a highly regarded company. That same year the company experienced a severe decline in sales due to poor management. The price of the stock dropped drastically and you sold at a substantial loss. The company has been restructured under new management, and most experts now expect it to produce better than average returns. Given your bad past experience with this company, would you buy stock now?",
//     a: [
//       { title: "Definitely Not.", value: 1 },
//       { title: "Probably Not.", value: 2 },
//       { title: "Not Sure.", value: 3 },
//       { title: "Probably.", value: 4 },
//       { title: "Definitely.", value: 5 },
//     ],
//   },
//   {
//     q: "Investments can go up or down in value and experts often say you should be prepared to weather a downturn. By how much could the total value of your investments go down before you would begin to feel uncomfortable?",
//     a: [
//       {
//         title: "Any Fall In Value Would Make Me Feel Uncomfortable",
//         value: 1,
//       },
//       { title: "10%", value: 2 },
//       { title: "20%", value: 3 },
//       { title: "33%", value: 4 },
//       { title: "50%", value: 5 },
//       { title: "More Than 50%", value: 6 },
//     ],
//   },
// ];

const AboutYou = (props) => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState("tab6");
  const [dependencyStatus, setDependencyStatus] = useState("");
  const [dob, setDob] = useState(null);
  const [gender, setdGender] = useState(1);
  const [dependentStatus, setdDependentStatus] = useState(4);
  const [startDate, setStartDate] = useState(new Date());
  const [show123, setShow123] = useState(false);
  const [showYourInfoModal, setShowYourInfoModal] = useState(false);
  const [tab123, setTab123] = useState("tab5");
  const [isLoading, setIsLoading] = useState(false);
  const sessionRef = useRef();
  const fpLogId = getParentFpLogId();
  const [ndaComplete, setNdaComplete] = useState(false);
  const [showNDACompletion, setShowNDACompletion] = useState(false);
  const [rmName, setRmName] = useState("");
  const ScrollbottomEndRef = useRef(null);
  const location = useLocation();
  const scrollToBottom = () => {
    ScrollbottomEndRef.current?.scrollIntoView({
      top: document.body.offsetHeight,
      behavior: "smooth"
    })
  }
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    document.body.classList.add("dg-layout");

    const interval = setInterval(() => {
      const bgAbout = document.getElementById("bg-about");
      if (bgAbout) {
        bgAbout.style.background = `url(${imagePath}/static/media/DG/about.svg) no-repeat right top`;
        clearInterval(interval);
        setBackgroundDivImage();

        if (sessionStorage.getItem("showAboutYouToast") === "1") {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error('In About You section "Your Info" is Mandatory');
          sessionStorage.removeItem("showAboutYouToast");
        }
      }
    }, 50);

    return () => {
      clearInterval(interval);
      document.body.classList.remove("dg-layout");
    };
  }, []);


  const [selectedOption, setSelectedOption] = useState("Spouse");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleNDAClose = () => setShowNDACompletion(false);
  const handleShow = () => setShow(true);

  const sortOptionsOccupation = [
    { value: "1", label: "Doctor" },
    { value: "2", label: "Govt. Sector" },
    { value: "3", label: "House Wife" },
    { value: "4", label: "Public Sectoe Service" },
  ];


  const [session, setSession] = useState("");
  const [quizData, setQuizData] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, setForceUpdate] = useState(0);
  const [myQuestions, setMyQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answersMap, setAnswersMap] = useState({});


  const onOpenYourInfoModal = () => setShowYourInfoModal(true);
  const onCloseYourInfoModal = () => setShowYourInfoModal(false);
  // const checksession = async () => {
  //   // setIsLoading(true);

  //   let url = CHECK_SESSION;
  //   let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
  //   let session_data = await apiCall(url, data, true, false);

  //   setSession(session_data);
  //   if (session_data["error_code"] == "100") {
  //     setIsLoading(false);
  //     sessionRef.current = session_data
  //     getFpLog()
  //     // let fplogid = session_data["data"]["fp_log_id"];
  //     // knowyourriskget(fpLogId);
  //     // getprofilestatus(session_data)

  //     if (sessionStorage.getItem("showNDAcompletionToast") == "1") {
  //       getRMdetails(session_data);
  //       sessionStorage.removeItem("showNDAcompletionToast");
  //     }
  //     // getRMdetails(session_data);
  //   }
  // };

  useEffect(() => {
    // checksession();
    getSchemeDataStorage();
    fetchRiskQuestions().then(fetchUserAnswers);
  }, []);

  // useEffect(() => {

  // }, []);


  const getRMdetails = async (session_data) => {
    // var config = {
    //   method: "POST",
    //   url: ADVISORY_GET_RM_DETAILS_API_URL,
    //   data: {
    //     user_id: getParentUserId(),
    //   },
    // };

    // let rm_resp = await fetchData(config);

    // setRmName(rm_resp['data'][0]['emp_name']);
    // setShowNDACompletion(true);
  }

  const getFpLog = async () => {

    // let url = ADVISORY_GET_FP_LOG;
    // let data = { user_id: sessionRef.current["data"]["id"] };


    // let fp_log_resp = await apiCall(url, data, false, false);
    // if (fp_log_resp['error_code'] == "100") {
    //   if (fp_log_resp.data.fp_log_id != '') {
    //     sessionRef.current["data"]["fp_log_id"] = fp_log_resp.data.fp_log_id

    //   }
    // }
  }

  // New Frappe logic

  // 1. Fetch questions & pre-fill answers

  const fetchRiskQuestions = async () => {
    try {
      const res = await FetchRiskQuestionsUrl();

      // apiCall(FETCH_RISK_QUESTIONS_URL, "", false, false);
      if (res.status_code === 200) {
        const formatted = res.data.map((q, index) => ({
          q_id: q.risk_question_id,
          q: q.risk_question_text,
          a: q.options
            .sort((a, b) => a.risk_option_points - b.risk_option_points)
            .map(opt => ({
              id: opt.risk_option_points,
              title: opt.risk_option_text,
              value: opt.risk_option_points,
            })),
          selectedAnswerId: null,
          display: index === 0,
        }));
        setQuestions(formatted);
      }
    } catch (err) {
      console.error("Error fetching questions", err);
    }
  };

  const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');

  const fetchUserAnswers = async () => {
    try {
      const res = await FetchUserRiskAnswersUrl(user_data.user_id)
      if (res.status_code === 200) {
        const answersMap = Object.fromEntries(
          res.data.map(ans => [ans.risk_question_id, ans])
        );

        setQuestions(prev =>
          prev.map((q, index) => {
            const userAnswer = answersMap[q.q_id];
            return {
              ...q,
              selectedAnswerId: userAnswer?.risk_option_id || null,
              display: index === 0 || !!userAnswer,
            };
          })
        );
      }
    } catch (err) {
      console.error("Error fetching user answers", err);
    }
  };




  // const knowyourriskget = async (fplogid) => {
  //   try {
  //     const kyr_data = {
  //       user_id: getParentUserId(),
  //       fp_log_id: fpLogId,
  //       data_belongs_to: DATA_BELONGS_TO
  //     };
  //     const payload_kyr_data = commonEncode.encrypt(JSON.stringify(kyr_data));

  //     const config_kyr = await apiCall(
  //       ADVISORY_KNOW_YOUR_RISK_GET_API_URL,
  //       payload_kyr_data,
  //       false,
  //       false
  //     );

  //     const res_kyr = JSON.parse(commonEncode.decrypt(config_kyr));

  //     if (res_kyr.error_code === "100") {
  //       const quizData = res_kyr.data[0];
  //       setQuizData(quizData);
  //       setUpdateId(quizData.id);

  //       const questionFields = ["q1", "q2", "q3", "q4", "q5", "q6"];
  //       let _prevState = myQuestions;
  //       let _tempArray = [];
  //       questionFields.forEach((v, i) => {
  //         if (quizData[v + "_answer"] !== null) {
  //           _tempArray.push(i);
  //         }
  //       });
  //       let maxIndex = Math.max(..._tempArray);
  //       _prevState = _prevState.map((v, i) => {
  //         const field = questionFields[i];
  //         return {
  //           ...v,
  //           selectedAnswer: quizData[field + "_answer"],
  //           display: i <= maxIndex,
  //         };
  //       });
  //       setMyQuestions([..._prevState]);
  //     }
  //   } catch (e) {
  //     console.log("Error", e);
  //   }
  // };

  const scrollToTop = () => {
    window.scroll({ top: 0 });
  };

  useEffect(() => {
    const wait = async () => {
      // await  checksession();
      dispatch({ type: "RELOAD_SIDEBAR", payload: true });
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    }
    if (window.location.href.indexOf("#completekyc") > -1) {
      wait();
      setTab("tab5");
      window.location.hash = "";
    }
    if (window.location.href.indexOf("#knowyourrisk") > -1) {
      wait();
      setTab("tab2");
      window.location.hash = "";
    }
    if (window.location.href.indexOf("#aboutyou") > -1) {
      wait();
      setTab("tab1");
      window.location.hash = "";
    }
  }, []);

  const handleSaveAnswer = async (i) => {
    const { selectedAnswerId, q_id } = questions[i];

    if (!selectedAnswerId) {
      toastr.error("Please select an answer before proceeding.");
      return;
    }

    const payload = {
      user_id: user_data.user_id,
      question_id: q_id,
      answer_option_id: selectedAnswerId,
    };

    try {
      const res = await AddUpdateUserRiskAnswersUrl(payload)

      if (res.status_code === 200) {
        toastr.success(`Answer for question ${i + 1} updated successfully`);

        // Show next question
        setQuestions(prev =>
          prev.map((q, j) =>
            j === i + 1 ? { ...q, display: true } : q
          )
        );

        if (i === questions.length - 1) {
          dispatch({ type: "RELOAD_SIDEBAR", payload: true });
          setTab("tab3");
          scrollToTop();
        }
      } else {
        toastr.error(res.message || "Failed to save answer");
      }
    } catch (err) {
      toastr.error("Error saving answer");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setCurrentUrl(location.pathname);
    }, 100);
  }, [location]);
  useEffect(() => {
    document.body.classList.add("dg-layout");
    return () => {
      document.body.classList.remove("rp-layout");
    };
  }, []);

  return (
    <DatagatherLayout>
      <FintooLoader isLoading={isLoading} />

      <div className="">
        <div className="background-div">
          <div className={`bg ${currentUrl.indexOf("datagathering/about-you") > -1
            ? "active"
            : ""
            }`} id="bg-about"></div>
          {/* <div className="bg active" id="bg-about"></div> */}
        </div>
        <div className="white-box">
          <div className="d-flex justify-content-center tab-box">
            <div className="d-flex top-tab-menu noselect">
              <div
                className={`tab-menu-item ${tab == "tab6" ? "active" : ""}`}
                onClick={() => setTab("tab6")}
              >
                <div className="tab-menu-title">Get Started</div>
              </div>
              <div
                className={`tab-menu-item ${tab == "tab1" ? "active" : ""}`}
                onClick={() => setTab("tab1")}
              >
                <div className="tab-menu-title">Your Info</div>
              </div>
              <div
                className={`tab-menu-item ${tab == "tab2" ? "active" : ""}`}
                onClick={() => {
                  setTab("tab2");
                  scrollToBottom();
                }}
              >
                <div className="tab-menu-title">Know your risk</div>
              </div>
              <div
                className={`tab-menu-item ${tab == "tab3" ? "active" : ""}`}
                onClick={() => {
                  setTab("tab3");
                }}
              >
                <div className="tab-menu-title">Assumptions</div>
              </div>
              <div
                className={`tab-menu-item ${tab == "tab4" ? "active" : ""}`}
                onClick={() => {
                  setTab("tab4");
                }}
              >
                <div className="tab-menu-title">Your Family</div>
              </div>
              {/* <div
                className={`tab-menu-item ${tab == "tab5" ? "active" : ""}`}
                onClick={() => {
                  setTab("tab5");
                }}
              >
                <div className="tab-menu-title">Complete KYC</div>
              </div> */}
            </div>
          </div>

          <div>
            {/* */}
            <div className={tab == "tab6" ? "d-block" : "d-none"}>
              <GetStarted setTab={setTab} />
            </div>
            <div className={tab == "tab1" ? "d-block" : "d-none"}>
              {tab == "tab1" && <YourInfo
                customStyles={customStyles}
                sortOptionsOccupation={sortOptionsOccupation}
                gender={gender}
                tab={tab}
                setTab={setTab}
                onOpenYourInfoModal={onOpenYourInfoModal}
              />}
            </div>
            <div className={tab == "tab2" ? "d-block animationStart" : "d-none"}>
              <div className="step-progress" ref={ScrollbottomEndRef}>
                <svg
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                >
                  <circle
                    className="cls-1"
                    cx={25}
                    cy={25}
                    r="22.44"
                    fill="none"
                    stroke="#042b62"
                    strokeWidth={1}
                    style={{ opacity: "0.1" }}
                  />
                  <circle
                    id="svgBarkyb"
                    className="cls-1"
                    cx={25}
                    cy={25}
                    r="22.44"
                    fill="transparent"
                    stroke="#042b62"
                    strokeWidth={2}
                    strokeDasharray={141}
                    strokeDashoffset={141}
                    style={{ strokeDashoffset: 0 }}
                  />
                </svg>
                <span className="value default-grey">
                  <span id="svgStepValuekyb">
                    {
                      questions.filter((v) => Boolean(v.selectedAnswerId)).length
                    }
                  </span>
                  /6
                </span>
              </div>

              {questions.map((question, i) => (
                <QuizRadio
                  key={question.q_id}
                  q={question.q}
                  number={i + 1}
                  options={question.a}
                  display={question.display}
                  selectedAnswer={question.selectedAnswerId}
                  setSelectedAnswer={(selectedId) => {
                    setQuestions(prev =>
                      prev.map((q, j) =>
                        j === i ? { ...q, selectedAnswerId: selectedId } : q
                      )
                    );
                  }}
                  handleResponse={() => handleSaveAnswer(i)}
                />
              ))}



              <div className="row text-center">
                <div className="btn-container">
                  <div className="d-flex justify-content-center">
                    <div
                      className="previous-btn form-arrow d-flex align-items-center"
                      onClick={() => {
                        ScrollToTop();
                        setTab("tab1")
                      }}
                    >
                      <FaArrowLeft />
                      <span className="hover-text">&nbsp;Previous</span>
                    </div>
                    <div
                      className="next-btn form-arrow d-flex align-items-center"
                      onClick={() => {
                        ScrollToTop();
                        setTab("tab3")
                      }}
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
            <div className={tab == "tab3" ? "d-block" : "d-none"}>
              <Assumptions tab={tab} setTab={setTab} />
            </div>
            <div className={tab == "tab4" ? "d-block" : "d-none"}>
              <Family tab={tab} setTab={setTab} />
            </div>
            {/* <div className={tab == "tab5" ? "d-block" : "d-none"}>
              {tab == "tab5" && <DigiLocker session={session} setTab={setTab} />}
            </div> */}
          </div>
        </div>
      </div>

      <Modal className="popupmodal" centered show={show} onHide={handleClose}>
        <Modal.Header className="ModalHead">
          <div className="text-center">Delete Confirmation</div>
        </Modal.Header>
        <div className=" p-5 d-grid place-items-center align-item-center">
          <div className=" HeaderModal">
            <div
              style={{
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              This will permanently erase the record and its associated
              information.
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center pb-5">
          <button onClick={handleClose} className="outline-btn m-2">
            Yes
          </button>
          <button onClick={handleClose} className="outline-btn m-2">
            No
          </button>
        </div>
      </Modal>
      <Modal className="popupmodal" centered show={showYourInfoModal}>
        <Modal.Header className="ModalHead">
          <div className="text-center m-popup-header"> Yooho !!</div>
        </Modal.Header>
        <div className=" p-5 d-grid place-items-center align-item-center">
          <div className="row HeaderModal ">
            <div className="col-md-12">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  style={{
                    width: "250px",
                  }}
                  src="https://static.fintoo.in/static/assets/img/About-you-1.png"
                />
              </div>
              <p
                className="text-center"
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  fontStyle: "italic",
                }}
              >
                "Your Data Is Secured."
              </p>
            </div>

            <div
              style={{
                lineHeight: "26px",
              }}
            >
              <div>
                We understand data sensitivity and assure you that your data
                will not be shared without your consent. So please, do not
                hesitate to fill in the required information for your Financial
                Planning.
              </div>
              <div>
                To know more about our security, visit the
                <Link
                  style={{ color: "blue", paddingLeft: "4px" }}
                  to={`${process.env.PUBLIC_URL}/privacy-policy`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <b>
                    <i>
                      <u>Security Statement</u>
                    </i>
                  </b>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center pb-5">
          <button
            onClick={() => onCloseYourInfoModal()}
            className="outline-btn secuirtyBtn m-2"
          >
            Ok
          </button>
        </div>
      </Modal>

      <Modal
        className="popupmodal"
        centered
        show={showNDACompletion}
        onHide={handleNDAClose}
      >
        <Modal.Header className="ModalHead">
          <div className="text-center">Thank You</div>
        </Modal.Header>
        <div className=" px-3 d-grid place-items-center align-item-center">
          <div className=" HeaderModal">
            <p
              style={{
                marginTop: "2rem",
              }}
            >
              {" "}
            </p>

            <div className="text-center py-3">
              <p>Thanking you for accepting NDA agreement, now you can start entering data in datagathering activity. Your expert planner <b><span>{rmName}</span></b> will contact you soon.</p>
            </div>
            <div className="d-flex justify-content-center pb-5">
              <Link>
                <button onClick={handleNDAClose} className="outline-btn">
                  Ok
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Modal>

    </DatagatherLayout>
  );
};
export default AboutYou;