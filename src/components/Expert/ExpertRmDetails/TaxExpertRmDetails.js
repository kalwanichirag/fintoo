import React, { useRef, useState } from "react";
import Styles from "./Style.module.css";
import "./style.css";
import { FaStar } from "react-icons/fa";
import Carousel from "react-slick";
import { useSelector } from "react-redux";
import FintooLoader from "../../FintooLoader";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { Link, useNavigate } from "react-router-dom";
import { CheckSession, getItemLocal, getParentUserId, getStarRatingValue, indianRupeeFormat, removeMemberId, setFpUserDetailsId, setMemberId } from "../../../common_utilities";
import {CRM_URL, imagePath } from "../../../constants";

const getRatingClass = (rating, position) => {
  const starVal = getStarRatingValue(rating, position);

  if (starVal == 'FULL') return 'fa fa-star'

  if (starVal == 'HALF') return 'fa fa-star-half'

  return ''
}

function TaxExpertRmDetails() {

  const [skillSectFull, SetSkillSectFull] = useState(false);
  const selectedRM = useSelector((state) => state.selectedRM);
  const rmDetailRef = useRef();
  const loggedIn = useSelector(state => state.loggedIn);

  let navigate = useNavigate();

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    // centerMode: true,
    slidesToScroll: 1,
  };

  React.useEffect(() => {

    function handleClickOutside(event) {
      if (rmDetailRef.current && !rmDetailRef.current.contains(event.target)) {
        closePopup();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const discountedAmount = (selectedRM.discount_value / 100) * selectedRM.custom_employee_service_fee;

  const finalAmount = selectedRM.custom_employee_service_fee - discountedAmount;

  const expertise = selectedRM.custom_expertise;

  const expertiseArray = expertise ? expertise.split(',') : [];

  const closePopup = () => {
    document.querySelector(".outerRmBox-udim4").classList.remove("active");
    document.querySelector(".outerRmBox-udim4").classList.remove("mobile");
    document.body.classList.remove("overflow-hidden");
  };

  const payNowHandler = () => {
    // if (!loggedIn) {
    //   return // checksession();
    // }
    const PlanInfo = {
      RMId: selectedRM.name,
      planId: selectedRM.emp_service_for,
      expertTotalFees: selectedRM.custom_employee_service_fee,
      discountPercent: selectedRM.discount_value,
      couponCode: selectedRM.coupon_name,
      couponCodeId: selectedRM.coupon_id,
      employee_name: selectedRM.employee_name,
      custom_qualification: selectedRM.custom_qualification,
      rating: selectedRM.custom_rating,
      custom_experience: selectedRM.custom_experience,
      imagepath: selectedRM.image,
      value_after_discount: selectedRM.value_after_discount,
    }
    localStorage.setItem('FintooTaxPlanInfo', JSON.stringify(PlanInfo));
    if (getItemLocal("family") == '1') {
      removeMemberId();
      setMemberId(getParentUserId());
      setFpUserDetailsId(getParentUserId());
      localStorage.removeItem("family");
      localStorage.removeItem("logged_in");
      window.location.href = `${process.env.PUBLIC_URL}/userflow/payment`;
    } else {
      return navigate(`${process.env.PUBLIC_URL}/userflow/payment`);
    }

  }

  return (
    <div className={`${Styles.outerRmBox} outerRmBox-udim4`}>
      <FintooLoader isLoading={false} />
      <div
        className={`${Styles.RMPersonalData} RM-Data-ildfX`}
        ref={rmDetailRef}
      >
        <div className={`d-block d-md-none ${Styles.imgclose}`}>
          <div
            onClick={() => {
              closePopup();
            }}
          >
            <img src={require("./images/cancel_1.png")} />
          </div>
        </div>
        {Object.keys(selectedRM).length > 0 && (
          <>
            <>
              <div id="RMDATA1" className={`${Styles.RmSpace} ${Styles.TaxRmSpace}`}>
                <div className={`${Styles.Rmcareer} ${Styles.TaxExpertInfoTopContainer}  ps-2 pe-2`}>
                  <div className={`${Styles.BorderRight}`} style={{ paddingRight: '0' }}>
                    <div className="RMProfile text-center">
                      <div className={`${Styles.RmBox}`}>
                        {selectedRM.image == "" ? (
                          <img
                            style={{ width: '45px', height: '45px' }}
                            src={
                              imagePath + "/static/media/Images/userflow/img/profile-picture.svg"
                            }
                          />
                        ) : (
                          <img
                            style={{ width: '45px', height: '45px' }}
                            src={
                              CRM_URL +
                              selectedRM.image
                            }
                          />
                        )}
                      </div>
                      <div className={`mt-2 ${Styles.RMName} default-grey`}>
                        {selectedRM.employee_name}
                      </div>
                      <div className={`${Styles.RmQualification}`} style={{ borderBottom: 'none' }}>
                        <span className="ng-binding">
                          {selectedRM.designation}
                        </span>{" "}
                      </div>
                    </div>
                  </div>
                  <div className={`${Styles.BorderRight} ps-2 pe-2 `} style={{ paddingRight: '0', display: 'flex', flexDirection: 'column', gap: "1rem" }}>
                    <div className="d-flex justify-content-between">
                      <span className={`${Styles.textLabel} default-grey`}>Experience</span>
                      <span className={`${Styles.ValueLabel}`}>
                        {selectedRM.custom_experience}+{" "}Years
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className={`${Styles.textLabel} default-grey`}>Location</span>
                      <span className={`${Styles.ValueLabel}`}>
                        {selectedRM.custom_location}
                      </span>
                    </div>
                    {/* <div className="d-flex justify-content-between">
                      <span className={`${Styles.textLabel} default-grey`}>Social Link</span>
                      <span className={`${Styles.ValueLabel}`}>

                        <a href={selectedRM.emp_linkedin_profile} style={{ textDecoration: 'none' }} target="_blank"><span><i className="fa-brands fa-linkedin"></i></span> <span style={{ color: 'gray' }}>Linkedin</span></a>
                      </span>
                    </div> */}
                    <div className="d-flex justify-content-between">
                      <span className={`${Styles.textLabel} default-grey`}>Rating</span>
                      <span >
                        <div className={`${Styles.rating}`}>
                          <div>
                            <span
                              className={`${getRatingClass(selectedRM.custom_rating, 1)}`}
                              style={{
                                color: "orange",
                              }}
                            />
                            <span
                              className={`${getRatingClass(selectedRM.custom_rating, 2)}`}
                              style={{
                                color: "orange",
                              }}
                            />
                            <span
                              className={`${getRatingClass(selectedRM.custom_rating, 3)}`}
                              style={{
                                color: "orange",
                              }}
                            />
                            <span
                              className={`${getRatingClass(selectedRM.custom_rating, 4)}`}
                              style={{
                                color: "orange",
                              }}
                            />
                            <span
                              className={`${getRatingClass(selectedRM.custom_rating, 5)}`}
                              style={{
                                color: "orange",
                              }}
                            />
                          </div>
                        </div>
                      </span>
                    </div>
                  </div>
                  <div className="ps-2 pe-2" style={{ paddingRight: '0', display: 'flex', flexDirection: 'column' }}>
                    <span className={`${Styles.textLabel} default-grey`}>Consultancy Fees</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span><span style={{ textDecoration: 'line-through', fontSize: "1rem" }}>
                        ₹ {Number(selectedRM.custom_employee_service_fee).toLocaleString("en", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </span>
                        /-&nbsp;&nbsp;
                        <div style={{
                          display: 'inline-block',
                          width: 'fit-content',
                          color: 'white',
                          fontSize: '0.5rem',
                          padding: '0.2rem',
                          borderRadius: '50px',
                          backgroundColor: '#042b62'
                        }}>
                          Save {parseInt(selectedRM.discount_value)}%
                        </div>
                      </span>

                    </div>
                    <div>
                      <span><span style={{
                        color: "#114C5D",
                        fontSize: "1.1rem",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}>
                        ₹
                        {Number(selectedRM.value_after_discount).toLocaleString("en", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}/

                      </span>
                        <span style={{
                          fontSize: "0.9rem",
                        }}>Hour</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className={`${Styles.aboutRm}`}
                  style={{ borderBottom: "0.3px solid rgb(227, 227, 227)" }}
                >
                  <p className={`${Styles.labelText} default-grey`}>Expertise</p>
                  <div className={`${Styles.skilChipContainer}`} style={{ height: `${skillSectFull ? 'fit-content' : '33px'}`, alignItems: "center", overflow: 'hidden' }}>

                    {expertiseArray.map((item) => (
                      <div className={`${Styles.skilChip}`}>{item.trim()}</div>
                    ))}

                  </div>
                  <div style={{ textAlign: 'right' }}><span className={`${Styles.labelText}`} style={{ textDecoration: 'underline', textUnderlineOffset: '2px', color: '#042b62', cursor: 'pointer' }} onClick={() => SetSkillSectFull(prev => !prev)}>{skillSectFull ? 'View Less' : 'View All'}</span></div>
                </div>
                <div
                  className={`text-center ${Styles.aboutRm}`}
                  style={{ borderBottom: "0.3px solid rgb(227, 227, 227)" }}
                >
                  <p className={`${Styles.labelText} default-grey`}>About Me</p>
                  <p className={`${Styles.Textinfo}`}>
                    {selectedRM.custom_description}
                  </p>
                </div>

                <div className={`${Styles.FeedBackCustomer}`}>
                  <p className={`text-center ${Styles.labelText} default-grey`}>
                    Customer Feedback
                  </p>
                  {selectedRM.custom_employee_service_review != null ? (
                    <Carousel {...settings}>
                      {selectedRM.custom_employee_service_review
                        .slice(0, 3)
                        .map((x) => (
                          <div
                            key={`rv-${Math.random()}`}
                            className={`${Styles.item}`}
                          >
                            <div className="d-flex justify-content-center">
                              <div className="d-flex">
                                <div>
                                  <img
                                    width={40}
                                    src="https://www.fintoo.in/static/userflow/img/profile-picture.svg"
                                    alt=""
                                  />
                                </div>
                                <div
                                  className={`ms-1 ${Styles.customerDetails}`}
                                >
                                  <div className={`${Styles.customerName}`}>
                                    {x.user_name}
                                  </div>
                                  <div className={`${Styles.customerrating}`}>
                                    <div className={`${Styles.rating}`}>
                                      <div>
                                        <span
                                          className={`${getRatingClass(x.rating, 1)}`}
                                          style={{
                                            color: "orange",
                                          }}
                                        />
                                        <span
                                          className={`${getRatingClass(x.rating, 2)}`}
                                          style={{
                                            color: "orange",
                                          }}
                                        />
                                        <span
                                          className={`${getRatingClass(x.rating, 3)}`}
                                          style={{
                                            color: "orange",
                                          }}
                                        />
                                        <span
                                          className={`${getRatingClass(x.rating, 4)}`}
                                          style={{
                                            color: "orange",
                                          }}
                                        />
                                        <span
                                          className={`${getRatingClass(x.rating, 5)}`}
                                          style={{
                                            color: "orange",
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <p className={`mt-2 ${Styles.FeedbackMsg}`}>
                                {x.review}
                              </p>
                            </div>
                          </div>
                        ))}
                    </Carousel>
                  ) : (<div className={` mt-3 ${Styles.reviewslider}`}>
                    <div>
                      <p className={`mt-2 ${Styles.Textinfo}`}>
                        No Review Available
                      </p>
                    </div>
                  </div>)}


                </div>
                <div className={`text-center ${Styles.bookAppointment}`}>
                  {/* <Link to={`${process.env.PUBLIC_URL}/userflow/expert-payment`}> */}
                  <button onClick={() => payNowHandler()} className={`${Styles.AppointmentDate}  default-background-grey`}>
                    Book An Appointment
                  </button>
                  {/* </Link> */}
                </div>
              </div>
            </>
          </>
        )}

      </div>
    </div >
  );
}

export default TaxExpertRmDetails;
