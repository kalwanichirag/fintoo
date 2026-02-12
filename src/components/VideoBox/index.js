import { useLocation } from "react-router-dom";
import Styles from "./style.module.css";
import Logo from './UAEFintoo.svg'
import { Link as ScrollLink } from "react-scroll";
import React, { useEffect } from "react";
const VideoBox = () => {
  const location = useLocation();
  const [pageurl, setPageurl] = React.useState();
  useEffect(() => {
    if ("pathname" in location) {
      setPageurl(location.pathname);
    }
  }, [location]);
  return (
    <div className={Styles.videobox}>

      <div className={`${Styles.vBox}`}>
        <video
          className={`${Styles.VideoLayout}`}
          autoPlay={true}
          muted={true}
          playsInline={true}
          loop={true}
          src="https://www.fintoo.in/wealthmanagement/wp-content/uploads/2023/02/videoplayback.mp4"
        />
      </div>
      <div className={`${Styles.bgOverlay}`}></div>
      <div className="position-relative w-100">
        <div
          className={`position-absolute w-100 text-center ${Styles["land-txt"]}`}
        >
          {
            pageurl == "/web/nri-desk-dubai" ? (
              <>
                <div>
                  <div>
                    <img
                      width={300}
                      src={process.env.REACT_APP_STATIC_URL + "media/wp/FintooUAElogo_.svg"}
                      // src="https://static.fintoo.in/wealthmanagement/wp-content/uploads/2022/09/fintoo-logo-01-e1663135457467-2048x604.png"
                      alt="logo"
                    />
                  </div>
                  <div>
                    <h2

                      className={`${Styles.TextHello}`}
                    >
                      Namaste Dubai..!
                    </h2>
                  </div>
                </div>
                <div>
                </div>
              </>) : ""
          }
          <h1 className={`${Styles.SpaceReduce}`}>
            Your dreams have no boundaries. <br /> So why should your
            investments?
          </h1>
          <p>
            Open the doors to the world of endless possibilities with <br />{" "}
            customized wealth management solutions.
          </p>
          {
            pageurl == "/web/nri-desk-dubai" ? (
              <>

              </>
            ) : (
              <>
                <div className={`${Styles.BookAppBtn}`}>
                  <ScrollLink
                    to="ContactUs" // Specify the target section's id here
                    smooth={true} // Enable smooth scrolling
                    duration={500} // Set the scrolling duration (in milliseconds)
                  >
                    <button>
                      Book an Appointment
                    </button>
                  </ScrollLink>
                </div>
              </>
            )
          }
          <div className="d-flex justify-content-center mt-md-5">
            <a href="#Howweguide">
              <div className={`${Styles.mouseicon}`}>
                <span></span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoBox;
