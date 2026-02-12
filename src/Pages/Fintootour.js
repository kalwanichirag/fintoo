import React, { useState, useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { apiCall, getParentUserId, isFamilySelected } from "../common_utilities";
import { ScrollToTop } from "./datagathering/ScrollToTop";

function Fintootour(props) {
  const [closeTour, setCloseTour] = useState(true);

  const getCoachmarkStatus = async () => {
    try {
      let data = {
        user_id: getParentUserId(),
        fp_log_id: props.session["fp_log_id"],
      };

      let coachmark_data = await apiCall('', data, false, false);
      if (coachmark_data["error_code"] === "100" && isFamilySelected()) {
        if (coachmark_data["data"]["coachmark_status"] === "1") {
          setCloseTour(true);
        } else {
          setCloseTour(false);
        }
      } else {
        setCloseTour(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addCoachMarkStatus = async (status) => {
    try {
      const coachmarkStatus = status ? "1" : "0";
      let data = {
        user_id: getParentUserId(),
        fp_log_id: props.session["fp_log_id"],
        coachmark_status: coachmarkStatus,
      };

      await apiCall('', data, false, false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getCoachmarkStatus();
  }, []);

  useEffect(() => {
    let driverObj;

    const handleScroll = () => {
      const overlay = document.querySelector('.driver-overlay');
      const popover = document.querySelector('.driver-popover');

      if (overlay && popover) {
        const popoverRect = popover.getBoundingClientRect();
        popover.style.visibility = popoverRect.top <= 100 ? 'hidden' : 'visible';
      }
    };

    const handleCheckboxChange = (event) => {
      if (event.target.checked) {
        addCoachMarkStatus(true);
      } else {
        addCoachMarkStatus(false);
      }
    };

    const startTour = () => {
      driverObj = driver({
        showProgress: true,
        overlayClickDismiss: false,
        onNextClick: () => {
          ScrollToTop();
          driverObj.moveNext();
        },
        onPrevClick: () => {
          ScrollToTop();
          driverObj.movePrevious();
        },
        _steps: [
          {
            element: "#GraphImage",
            popover: {
              title: "Asset Value",
              description: `To determine the value of your portfolio, simply click on the "Assets Value" option.`,
              side: "right",
              align: "center",
            },
          },
          {
            element: ".viewReport",
            popover: {
              title: "View Report",
              description: `On "View Report," you'll have the option to download a summary report or view a detailed report.`,
              side: "bottom",
              align: "center",
            },
          },
          {
            element: ".EditData",
            popover: {
              title: "Edit & Update",
              description: `Feel free to Edit and update your income, expenses, assets, liabilities, and any other relevant information as required.`,
              side: "bottom",
              align: "center",
            },
          },
          {
            element: ".CoachmarkIssue .PortfolioCoach",
            popover: {
              title: "Portfolio",
              description: `Click the "Portfolio" tab to access your updated portfolio information.`,
              side: "right",
              align: "center",
            },
          },
          {
            element: ".CoachmarkIssue .ReportItem",
            popover: {
              title: "Report",
              description: `Access all reports related to advisory and investment.`,
              side: "right",
              align: "center",
            },
          },
        ],
        get steps() {
          return this._steps;
        },
        set steps(value) {
          this._steps = value;
        },
        onPopoverRender: (popover, { config, state }) => {
          const wrapperDiv = document.createElement("div");
          wrapperDiv.classList.add("dont-show-again-wrapper");

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = "dontShowAgain";
          checkbox.classList.add("dont-show-again-checkbox");
          checkbox.addEventListener("change", handleCheckboxChange);

          const label = document.createElement("label");
          label.htmlFor = "dontShowAgain";
          label.innerText = "Do not show again";
          label.classList.add("dont-show-again-label");

          wrapperDiv.appendChild(checkbox);
          wrapperDiv.appendChild(label);

          popover.wrapper.appendChild(wrapperDiv);

          const popoverContent = popover.popover
            ? popover.popover.getElementsByClassName("popover-content")[0]
            : undefined;

          if (popoverContent) {
            popoverContent.appendChild(wrapperDiv);

            checkbox.addEventListener("change", (event) => {
              if (event.target.checked) {
                driverObj.destroy();
                setCloseTour(true);
              }
            });
          } else {
            console.error("Popover content not found.");
          }
        },
      });

      driverObj.drive();
    };

    if (!closeTour) {
      startTour();
    }

    const handlePointerEvents = () => {
      const overlayElements = document.querySelectorAll('.driver-active .driver-overlay, .driver-active *');
      const isModalOpen = document.querySelector('.modal-open');

      overlayElements.forEach(el => {
        el.style.pointerEvents = isModalOpen ? 'unset' : 'unset';
      });
    };

    const observer = new MutationObserver(handlePointerEvents);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // observer.disconnect();
      if (driverObj) {
        driverObj.destroy();
      }
    };
  }, [closeTour]);

  return <></>;
}

export default Fintootour;
