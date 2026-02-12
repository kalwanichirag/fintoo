import React, { useState, useEffect } from "react";
import CommonDashSlider from "react-elastic-carousel";
import { BASE_API_URL, CHECK_SESSION, imagePath } from "../../constants";
import NextImg from "../../Assets/Images/CommonDashboard/Next.svg";
import Arrow from "../../Assets/Images/CommonDashboard/NextArrow.png";
import Calendly from "./Calendly";
import { apiCall, getItemLocal, getUserId } from "../../common_utilities";
import RenewPopup from "./RenewPopup";
import Button from "react-bootstrap/Button";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 4 },
];

function DashboardSlider({ lifecyclestatus, renewpopup, subscriptionenddate }) {
  const [slide, setSlide] = useState([
    {
      id: 1,
      toptext: "Add &",
      title: "Manage Your Goals",
      Text1:
        " In-depth individual goal analysis and auto linkage with right assets.",
      // ImagesNext: process.env.REACT_APP_STATIC_URL + "media/DMF/NextArrow.png",
      ImagesNext: ".",
      buttonText: "Add Goals",
      Images: process.env.REACT_APP_STATIC_URL + "media/Goals.svg",
    },
    {
      id: 2,
      toptext: "Money",
      title: "Management Analysis",
      ImagesNext: ".",
      ImagesNext2: "",
      Text1: "Detailed Income and Expenses",
      Text2: "Analysis & Auto Advisory for Expenses optimization",
      buttonText: "Add Income",
      Images: process.env.REACT_APP_STATIC_URL + "media/Money.svg",
    },
    {
      id: 3,
      toptext: "Asset Allocation &",
      title: "Portfolio Analysis",
      ImagesNext: ".",
      ImagesNext2: "",
      Text1: "Rebalance & Restructuring of you Portfolio",
      Text2: "In-dept analysis of your existing portfolio",
      buttonText: "Add Assets",
      Images: process.env.REACT_APP_STATIC_URL + "media/Asstes.svg",
    },
    {
      id: 4,
      toptext: "Connect With",
      title: "Our Experts Today",
      ImagesNext: ".",
      ImagesNext2: "",
      Text1: "Book Your Appointment with Expert Now",
      buttonText: "Book Appointment",
      Images: process.env.REACT_APP_STATIC_URL + "media/Connect.svg",
    },
  ]);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [calendlydata, setCalendlyData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  useEffect(() => {
    getsessiondata();
  }, []);
  const userid = getUserId();
  const getsessiondata = async () => {
    // try {
    //   let url = CHECK_SESSION;
    //   let data = { user_id: userid, sky:getItemLocal("sky") };
    //   let session_data = await apiCall(url, data, true, false);
    //   if(session_data["data"]["user_details"]){
    //     let calendly_detail = session_data["data"]["user_details"];
    //     setCalendlyData({
    //       name: calendly_detail["name"],
    //       email: calendly_detail["email"],
    //       mobile: calendly_detail["mobile"],
    //     });
    //   }
    //   else{
    //     let calendly_detail = session_data["data"];
    //     setCalendlyData({
    //       name: calendly_detail["first_name"],
    //       email: calendly_detail["email"],
    //       mobile: calendly_detail["mobile"],
    //     });
    //   }
      
    // } catch {}
  };

  return (
    <div>
      <CommonDashSlider
        itemPadding={[0, 10]}
        itemsToShow={3}
        // outerSpacing={100}
        // enableAutoPlay
        autoPlaySpeed={1500}
        autoTabIndexVisibleItems={true}
        breakPoints={breakPoints}
        
      >
        {slide.map(
          ({
            id,
            toptext,
            title,
            Text1,
            Text2,
            Images,
            buttonText,
            ImagesNext,
            ImagesNext2,
          }) => (
            <div key={id}>
              <div className="CardBox">
                <div className="d-inline-block">
                <div className="ImgBx">
                    <img src={Images} width={"50px"} height={"50px"} />
                  </div>
                  <div className="TextLabel">
                    {toptext}
                    {/* <br /> */}
                     &nbsp;<span>{title}</span>
                  </div>
                  <div className="listLabel w-100">
                    <div className="d-flex align-content-center">
                      <div style={{marginTop: "-20px"}}>
                       <span style={{color: "black", fontSize: "28px"}}>{ImagesNext}</span>
                      </div>{" "}
                      <div className="ms-2">{Text1}</div>
                    </div>
                    <div className="d-flex">
                      {console.log("Text2", Text2 == undefined)}
                      {Text2 != "" && Text2 != undefined &&
                      <>
                        <div style={{marginTop: "-20px"}}>
                           {" "}
                        <span style={{color: "black", fontSize: "28px"}}>{ImagesNext}</span>
                        </div>
                        <div className="ms-2">{Text2}</div>
                        </>
                      }
                    </div>
                  </div>
                  <div className={id === 1 || id === 4 ? "SlideNextDiv" : " "}>
                    <button className="text-capitalize sildeBtn">
                      {buttonText === "Add Goals" &&
                      (lifecyclestatus === 1 || lifecyclestatus === 2) ? (
                        <>
                          {renewpopup === 2 ? (
                            <a
                              onClick={() => setOpen(true)}
                              className="slideRed"
                            >
                              {buttonText}
                            </a>
                          ) : (
                            <a
                              href={process.env.PUBLIC_URL + "/datagathering/goals"}
                              className="slideRed"
                            >
                              {buttonText}
                            </a>
                          )}
                        </>
                      ) : buttonText === "Add Income" &&
                        (lifecyclestatus === 1 || lifecyclestatus === 2) ? (
                        <>
                          {renewpopup === 2 ? (
                            <a
                              onClick={() => setOpen(true)}
                              className="slideRed"
                            >
                              {buttonText}
                            </a>
                          ) : (
                            <a
                              href={
                                process.env.PUBLIC_URL + "/datagathering/income-expenses"
                              }
                              className="slideRed"
                            >
                              {buttonText}
                            </a>
                          )}
                        </>
                      ) : buttonText === "Add Assets" &&
                        (lifecyclestatus === 1 || lifecyclestatus === 2) ? (
                        <>
                          {renewpopup === 2 ? (
                            <a
                              onClick={() => setOpen(true)}
                              className="slideRed"
                            >
                              {buttonText}
                            </a>
                          ) : (
                            <a
                              href={
                                process.env.PUBLIC_URL +
                                "/datagathering/assets-liabilities"
                              }
                              className="slideRed"
                            >
                              {buttonText}
                            </a>
                          )}
                        </>
                      ) : buttonText === "Book Appointment" ? (
                        <a onClick={() => setShow(true)} className="slideRed">
                          {buttonText}
                        </a>
                      ) : (
                        <Link
                        to={`${process.env.PUBLIC_URL}/pricing`}
                        className="slideRed">
                          {buttonText}
                        </Link>
                      )}
                    </button>
                  </div>
                  {/* <div className="ImgBx">
                    <img src={Images} width={"120px"} height={"120px"} />
                  </div> */}
                </div>
              </div>
              <Calendly
                show={show}
                handleClose={() => setShow(false)}
                calendlydata={calendlydata}
              />
               <Modal className="Modalpopup" open={open} showCloseIcon={false} onClose={onCloseModal} center>
                <div className="text-center">
                  <h2 className="HeaderText">Attention !!</h2>
                  <RenewPopup open={open} onClose={onCloseModal} subscriptionenddate={subscriptionenddate} />
                </div>
              </Modal>
            </div>
          )
        )}
      </CommonDashSlider>
    </div>
  );
}

export default DashboardSlider;
