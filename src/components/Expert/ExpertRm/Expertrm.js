import React, { useState, useEffect, useRef } from "react";
import ExpertRmSlider from "react-elastic-carousel";
import Slider from "react-slick";
import Styles from "./Style.module.css";
import { FaStar } from "react-icons/fa";
import LeftArrow from "./Images/left_arrow.svg";
import RightArrow from "./Images/right_arrow.svg";
// import LeftArrow from "./Images/left_arrow.png";
// import RightArrow from "./Images/right_arrow.png";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { BASE_API_URL, ADVISORY_GET_RM_LIST_API, CRM_URL } from "../../../constants";
import { apiCall, fetchData, getStarRatingValue } from "../../../common_utilities";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import StepComponent from "../../StepsComponent";
import { GetExpertDetails } from "../../../FrappeIntegration-Services/services/payment-api/paymentapiService";
// import Img from /

const getRatingClass = (rating, position) => {
  const starVal = getStarRatingValue(rating, position);

  if (starVal == 'FULL') return 'fa fa-star'

  if (starVal == 'HALF') return 'fa fa-star-half'

  return ''
}

const ExpertItem = (props) => (
  <div className={`d-flex ${Styles.RmBox}`} onClick={() => props.onClick()}>
    <div>
      {(props.data.image == "" || props.data.image == null) ? (
        <img  src={imagePath + "/static/media/DMF/profile-picture.svg"}  />
        
      ) : (
        <img src={CRM_URL+props.data.image} />
      )}
    </div>
    <div>
      <div className={`ms-2 ${Styles.rminfo}`}>
        <div className={`${Styles.rmName}`}>{props.data.employee_name}</div>
        <div style={{ color: "#858487" }} className={`${Styles.rmPersonal}`}>
          {" "}
          <span className={`${Styles.rmProfile}`}>
            {props.data.designation}
          </span>{" "}
          {" "}
          <span className={`${Styles.rmQualification}`}>
            {props.data.custom_qualification}
          </span>
        </div>
        <div className="d-flex  mt-3">
          <div className={`${Styles.BorderRight}`}>
            <div className={`${Styles.textLabel}`}>Experience</div>
            <div className={`${Styles.ValueLabel}`}>
              {props.data.custom_experience}+
              <span className="ps-1"> Years</span>
            </div>
          </div>
          <div className={`ms-2 ${Styles.BorderRight}`}>
            <div className={`${Styles.textLabel}`}>Location</div>
            <div className={`${Styles.ValueLabel}`}>
              {props.data.custom_location}
            </div>
          </div>
          <div className="Rating ms-2">
            <div className={`${Styles.textLabel}`}>Rating</div>
            <div ng-if="rm.rating == 4" className="ng-scope pt-1">
              <span
                className={`${getRatingClass(props.data.custom_rating, 1)}`}
                style={{
                  color: "orange",
                }}
              />
              <span
                className={`${getRatingClass(props.data.custom_rating, 2)}`}
                style={{
                  color: "orange",
                }}
              />
              <span
                className={`${getRatingClass(props.data.custom_rating, 3)}`}
                style={{
                  color: "orange",
                }}
              />
              <span
                className={`${getRatingClass(props.data.custom_rating, 4)}`}
                style={{
                  color: "orange",
                }}
              />
              <span
                className={`${getRatingClass(props.data.custom_rating, 5)}`}
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
);
function Expertrm({ searchTerm, filters, isTaxRm, setRmLength }) {
  const [expertRmData, setExpertRmData] = useState();
  const allDataRef = useRef([]);
  const [slide, setSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  let selectedRM = useSelector((state) => state.selectedRM);
  const dispatch = useDispatch();
  const [activeRM, setActiveRM] = useState(0);

  const [currentRM, setCurrentRM] = useState({});

  const sliderRef = useRef(null);

  const openRMData = () => {
    document.querySelector(".RM-Data-ildfX").classList.add("active");
  };

  useEffect(() => {
    // selectedRMRef.current = selectedRM;
  }, [selectedRM]);

  // =================================================================================

  useEffect(() => {
    getrmdetailslist();

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    if (slide == null) return;
    if (slide.length > 0) {
      document.querySelector(".outerRmBox-udim4").style.display = "block";

      sliderRef.current.slickGoTo(0);
    } else {
      document.querySelector(".outerRmBox-udim4").style.display = "none";
    }
  }, [slide]);

  const getrmdetailslist = async () => {
    setLoading(true);
    try {
      // if (isTaxRm) {
      //   const taxRMs = await apiCall(
      //     BASE_API_URL + '/restapi/getexpertlist/',
      //     {
      //       "plan_id": ["44"]
      //     },
      //     false,
      //     false
      //   );
      //   RmList = taxRMs
      // } else {
      // var payload = {
      //   url: ADVISORY_GET_RM_LIST_API + `?plan_id=${isTaxRm ? '44' : '31'}`,
      //   method: "get",
      // };
      var plan_uuid = isTaxRm ? "tax_plan" : "fp_expert"
      const RmList = await GetExpertDetails(plan_uuid);
      // }

      setRmLength(RmList.data.length)
      allDataRef.current = RmList.data.sort((a, b) => b.custom_experience - a.custom_experience);
      cleanRmData(allDataRef.current);

      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(async function (position) {
          try {
            var location_api =
              "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
              position.coords.latitude +
              "&lon=" +
              position.coords.longitude;
            var payload = {
              url: location_api,
              method: "get",
            };
            var response = await fetchData(payload);
            var city = response.address.city;
            allDataRef.current.sort((a, b) => {
              if (a.custom_location === city) {
                return -1;
              }
              if (b.custom_location === city) {
                return 1;
              }
              return 0;
            });
            cleanRmData(allDataRef.current);
          } catch (error) {
            console.log(error);
          }
        });
      }
    } catch (error) {
      console.log("function catch", error);
    }
    finally {
      setLoading(false);
    }
  };

  const cleanRmData = (data) => {
    const sortedData = data.sort((a, b) => a.name - b.name);
    if (sortedData.length > 0) {
      dispatch({ type: "RM_DETAILS", payload: { ...sortedData[0] } });
      setActiveRM(sortedData[0]["name"]);
    } else {
      dispatch({ type: "RM_DETAILS", payload: {} });
      setActiveRM(0);
    }
    const chunkSize = 8;
    let a = [];
    for (let i = 0; i < sortedData.length; i += chunkSize) {
      a.push(sortedData.slice(i, i + chunkSize));
    }
    if (a.length > 0) {
      setSlide([...a]);
    } else {
      setSlide([]);
    }
  };


  // Custom Arrows
  const ArrowButtonPrevious = ({ imgSrc, imgAlt, onClick }) => {
    return (
      <button onClick={onClick} className={`${Styles.BackBtn}`}>
        <img src={imgSrc} alt={imgAlt} className={`${Styles.BackImg}`} />
      </button>
    );
  };

  const ArrowButtonNext = ({ imgSrc, imgAlt, onClick }) => {
    return (
      <button onClick={onClick} className={`${Styles.NextBtn}`}>
        <img src={imgSrc} alt={imgAlt} className={`${Styles.NextImg}`} />
      </button>
    );
  };

  const breakPoints = [
    { width: 1, itemsToShow: 8 },
    { width: 550, itemsToShow: 1 },
    { width: 768, itemsToShow: 2 },
    { width: 1200, itemsToShow: 2 },
  ];
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    // centerMode: true,
    slidesToScroll: 1,
    prevArrow: (
      <ArrowButtonPrevious imgSrc={LeftArrow} imgAlt="previous-button" />
    ),
    nextArrow: <ArrowButtonNext imgSrc={RightArrow} imgAlt="next-button" />,
    // prevArrow: (
    //   <FaArrowLeft />
    // ),
    // nextArrow: <FaArrowRight />
  };

  useEffect(() => { 
    var a = [];
    allDataRef.current.forEach((v) => {
      var valid = false;
      if (
        v.designation?.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        v.employee_name?.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        ||
        v.custom_qualification?.toLowerCase().indexOf(searchTerm.toLowerCase()) >
        -1
        ||
        v.custom_experience?.toString()
          .toLowerCase()
          .indexOf(searchTerm.toLowerCase()) > -1
      ) {
        valid = true;
      }
      // check location
      if (
        valid === true &&
        "location" in filters &&
        filters.location.length > 0
      ) {
        if (filters.location.indexOf(v.custom_location.toLowerCase()) > -1) {
          valid = true;
        } else {
          valid = false;
        }
      }
      // check rating
      if (valid === true && "rating" in filters && filters.rating.length > 0) {
        if (filters.rating.indexOf(1 * Math.floor(v.custom_rating)) > -1) {
          valid = true;
        } else {
          valid = false;
        }
      }
      // check experience
      if (
        valid == true &&
        "experience" in filters &&
        filters.experience.length > 0
      ) {
        var match = false;
        // check above 10
        if (filters.experience.indexOf("10+") > -1) {
          if (parseInt(v.custom_experience) > 10) {
            match = true;
          }
        }
        // check above 4
        if (filters.experience.indexOf("4+") > -1) {
          if (parseInt(v.custom_experience) > 4) {
            match = true;
          }
        }
        // check 5-10
        if (match == false && filters.experience.indexOf("5-10") > -1) {
          if (parseInt(v.custom_experience) > 4 && parseInt(v.custom_experience) < 11) {
            match = true;
          }
        }
        // check 2-4
        if (match == false && filters.experience.indexOf("2-4") > -1) {
          if (parseInt(v.custom_experience) > 1 && parseInt(v.custom_experience) < 5) {
            match = true;
          }
        }
        // check <2
        if (match == false && filters.experience.indexOf("<2") > -1) {
          if (parseInt(v.custom_experience) < 2) {
            match = true;
          }
        }
        valid = match;
      }

      if (valid === true) {
        a.push(v);
      }
    });
    // var a = allDataRef.current.filter(
    //   (v) =>
    //     v.designation.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
    //     v.employee_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
    //     v.custom_qualification.toLowerCase().indexOf(searchTerm.toLowerCase()) >
    //       -1 ||
    //     v.custom_experience
    //       .toString()
    //       .toLowerCase()
    //       .indexOf(searchTerm.toLowerCase()) > -1
    // );
    cleanRmData(a);
  }, [searchTerm, filters]);

  // const onRMClick = (v) => {
  //   // var a = allDataRef.current.filter((x) => x.id == v)[0];
  //   // dispatch('RM_DETAILS', {...a});
  //   dispatch({ type: "RM_DETAILS", payload: { ...a } });
  //   setActiveRM(v);
  // };
  const onRMClick = (id) => {
    const selectedRM = allDataRef.current.find((x) => x.name === id);
    dispatch({ type: "RM_DETAILS", payload: selectedRM });
    setActiveRM(name);
  };

  const openBottomSheet = () => {
    document.querySelector(".outerRmBox-udim4").classList.add("active");
    document.querySelector(".outerRmBox-udim4").classList.add("mobile");
    document.body.classList.add("overflow-hidden");
  };

  const stepsData = [
    {
      current: true,
      stepCompleted: false,
      name: 'Select the Expert',
    },
    {
      current: false,
      stepCompleted: false,
      name: 'Pay for Consultancy',
    },
    {
      current: false,
      stepCompleted: false,
      name: 'Book an Appointment',
    },
    {
      current: false,
      stepCompleted: false,
      name: 'Upload Documents',
    }
  ]

  return (
    <div
      className={`${Styles.exMainData} ${slide != null && slide.length == 0 ? Styles.exMainData_1 : ""
        }`}
    >
      {isTaxRm && slide != null && slide.length > 0 && <StepComponent stepsData={stepsData} />}
      <div
        class={`d-none d-md-block ${Styles.rmlist}`}
        style={{
          outline: "none !important",
        }}
      >
        {loading ? (
          <div className="d-flex justify-content-center">
            {/* Skeleton or Loader */}
            <p>Loading...</p>
          </div>
        ) :
        
          slide?.length > 0 ? (
            <Slider
              {...settings}
              className={`${Styles.SlideRm}`}
              style={{
                outline: "none !important",
              }}
              ref={sliderRef}
            >
              {slide.map((v) => (
                <div
                  className=""
                  style={{
                    outline: "none !important",
                  }}
                >
                  <div
                    className="row  "
                    style={{
                      outline: "none !important",
                    }}
                  >
                    {v.map((x) => (
                      <div
                        key={`desk-rm-${x.name}`}
                        className={`mb-4 col-md-6 ${activeRM == x.name ? Styles.activeRM : ""
                          }`}
                        style={{
                          outline: "none !important",
                        }}
                      >
                        <ExpertItem data={x} onClick={() => onRMClick(x.name)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p>   No expert found matching this criteria. You might want to
              refine your search.</p>
          )}
        {/* {slide != null && slide.length == 0 && (
          <div>
            <p>
              No expert found matching this criteria. You might want to
              refine your search.
            </p>
          </div>
        )} */}
      </div>
      <div className="container">
        <div className="d-block d-md-none">
          <div className={`row ${Styles.MobileRMList}`}>
            {slide != null &&
              slide.map((v) =>
                v.map((x) => (
                  <div key={`mobile-rm-${x.name}`} className="col-12">
                    <div className="py-2">
                      <ExpertItem
                        data={x}
                        onClick={() => {
                          onRMClick(x.name);
                          openBottomSheet();
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expertrm;
