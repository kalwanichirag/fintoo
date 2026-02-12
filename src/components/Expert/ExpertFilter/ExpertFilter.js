import React, { useEffect, useRef, useState } from "react";
import Styles from "./Style.module.css";
function ExpertFilter({ isTaxRm, onFilterChange }) {
  const SidebarClose = useRef();
  const [location, setLocation] = useState([]);
  const [rating, setRating] = useState([]);
  const [experience, setExperience] = useState([]);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        SidebarClose.current &&
        !SidebarClose.current.contains(event.target)
      ) {
        if (document.querySelector(".filter-menu-ildfX") != null) {
          document
            .querySelector(".filter-menu-ildfX")
            .classList.remove("active");
        }
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
      if (document.querySelector(".filter-menu-ildfX") != null) {
        document.querySelector(".filter-menu-ildfX").classList.remove("active");
      }
    };
  }, []);

  useEffect(() => {
    var payload = {
      location,
      rating,
      experience,
    };
    onFilterChange(payload);
  }, [location, rating, experience]);

  const handleLocationCheck = (e) => {
    var a = location;
    if (e.target.checked == true) {
      a.push(e.target.value.toLowerCase());
    } else {
      a = a.filter((x) => x != e.target.value.toLowerCase());
    }

    setLocation([...a]);
  };
  const handleRatingCheck = (e) => {
    var a = rating;
    if (e.target.checked == true) {
      a.push(1 * e.target.value);
    } else {
      a = a.filter((x) => x != 1 * e.target.value);
    }
    setRating([...a]);
  };
  const handleExperience = (e) => {
    var a = experience;
    if (e.target.checked == true) {
      a.push(e.target.value);
    } else {
      a = a.filter((x) => x != e.target.value);
    }
    setExperience([...a]);
  };

  return (
    <section className={`d-md-block ${Styles.exFltr} `}>
      <div className={`${Styles.filter} filter-menu-ildfX pr-4`}>
        <div className={Styles.inFilter} ref={SidebarClose}>
          <div className="d-flex justify-content-between">
            <div className={`${Styles.BigTextLabel}`}>Filters</div>
            <div className={`pointer ${Styles.SmallTextLabel}`}>
              <label
                onClick={() => {
                  setExperience([]);
                  setLocation([]);
                  setRating([]);
                  for (const checkbox of document.querySelectorAll(
                    "." + Styles.inFilter + " input[type='checkbox']"
                  )) {
                    checkbox.checked = false;
                  }
                }}
                className={`${Styles.reset}`}
              >
                Reset All
              </label>
            </div>
          </div>

          {/* <div className="d-flex justify-content-between mt-3 FilterDetails">
            <div className={`${Styles.BigLabel}`}>Location</div>
          </div>
          <div className="d-flex mt-2">
            <div className="">
              <input
                type="checkbox"
                name=""
                className="checkbox"
                defaultValue="Mumbai"
                id="mumblocation"
                onChange={(e) => {
                  handleLocationCheck(e);
                }}
              />
              <label
                className={`ms-2 ${Styles.FilterCity}`}
                htmlFor="mumblocation"
              >
                Mumbai
              </label>
            </div>
            <div className="ms-5">
              <input
                type="checkbox"
                name=""
                className="checkbox"
                defaultValue="Delhi"
                id="delhlocation"
                onChange={(e) => {
                  handleLocationCheck(e);
                }}
              />
              <label
                className={`ms-2 ${Styles.FilterCity}`}
                htmlFor="delhlocation"
              >
                Delhi
              </label>
            </div>
          </div> */}

          <div className="d-flex justify-content-between mt-5 FilterDetails">
            <div className={`${Styles.BigLabel}`}>Star Rating</div>
          </div>
          <div className="d-block Rating mt-3">
            <div className="d-flex">
              {" "}
              <input
                type="checkbox"
                name=""
                defaultValue={5}
                className="checkbox"
                id="5star"
                onChange={(e) => {
                  handleRatingCheck(e);
                }}
              />
              <label className={`ms-2 ${Styles.FilterCity}`} htmlFor="5star">
                5 Star
              </label>
            </div>
            <div className="pt-1 d-flex">
              <input
                type="checkbox"
                name=""
                defaultValue={4}
                className="checkbox"
                id="4star"
                onChange={(e) => {
                  handleRatingCheck(e);
                }}
              />
              <label className={`ms-2 ${Styles.FilterCity}`} htmlFor="4star">
                4 Star
              </label>
            </div>
            <div className="pt-1 d-flex">
              <input
                type="checkbox"
                name=""
                defaultValue={3}
                className="checkbox"
                id="3star"
                onChange={(e) => {
                  handleRatingCheck(e);
                }}
              />
              <label className={`ms-2 ${Styles.FilterCity}`} htmlFor="3star">
                3 Star
              </label>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-5 FilterDetails">
            <div className={`${Styles.BigLabel}`}>Experience</div>
          </div>
          <>
            <div className="d-block mt-3">
              <div className="d-flex">
                <input
                  className="checkbox"
                  type="checkbox"
                  name=""
                  id="abovefour"
                  defaultValue={"10+"}
                  onChange={(e) => {
                    handleExperience(e);
                  }}
                />
                <label
                  className={`ms-2 ${Styles.FilterCity}`}
                  htmlFor="abovefour"
                >
                  Above 10 Years
                </label>
              </div>
              <div className="pt-1 d-flex">
                <input
                  className="checkbox"
                  type="checkbox"
                  name=""
                  id="btwfivetoten"
                  defaultValue={"5-10"}
                  onChange={(e) => {
                    handleExperience(e);
                  }}
                />
                <label
                  className={`ms-2 ${Styles.FilterCity}`}
                  htmlFor="btwfivetoten"
                >
                  Between 5 to 10 Years
                </label>
              </div>
              {/* <div className="d-flex">
                <input
                  className="checkbox"
                  type="checkbox"
                  name=""
                  id="abovefour"
                  defaultValue={"4+"}
                  onChange={(e) => {
                    handleExperience(e);
                  }}
                />
                <label
                  className={`ms-2 ${Styles.FilterCity}`}
                  htmlFor="abovefour"
                >
                  Above 4 Years
                </label>
              </div> */}
              <div className="pt-1 d-flex">
                <input
                  className="checkbox"
                  type="checkbox"
                  name=""
                  id="btwtwotofour"
                  defaultValue={"2-4"}
                  onChange={(e) => {
                    handleExperience(e);
                  }}
                />
                <label
                  className={`ms-2 ${Styles.FilterCity}`}
                  htmlFor="btwtwotofour"
                >
                  Between 2 to 4 Years
                </label>
              </div>
              <div className="pt-1 d-flex">
                <input
                  className="checkbox"
                  type="checkbox"
                  name=""
                  id="belowtwo"
                  defaultValue={"<2"}
                  onChange={(e) => {
                    handleExperience(e);
                  }}
                />
                <label className={`ms-2 ${Styles.FilterCity}`} htmlFor="belowtwo">
                  Below 2 Years
                </label>
              </div>
            </div>
          </>

        </div>
      </div>
    </section>
  );
}

export default ExpertFilter;
