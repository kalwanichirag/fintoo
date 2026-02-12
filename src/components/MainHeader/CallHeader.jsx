import React, { useEffect, useState } from "react";
import { FaBeer } from "react-icons/fa";
import IoCallOutline from "react-icons/io";
import Call from "./Call.png";
import { useLocation, useNavigate } from "react-router-dom";
import { removeSlash } from "../../common_utilities";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import styles from "../HTML/Footer/style.module.css";
// src/components/HTML/Footer/style.module.css
function CallHeader() {
  const location = useLocation();
  const [pageurl, setPageurl] = useState(false);
  useEffect(() => {
    if ( (removeSlash(location.pathname) == "") || (removeSlash(location.pathname) == "/web")) {
      setPageurl(true);
    } else {
      setPageurl(false);
    }
  }, [location]);
  return (
    <div className={pageurl == true ? "" : "d-none"}>
      <div className={`CallHeader ${styles.TopHeader}`}>
        <div className="container-fluid">
          <div className="row d-flex align-items-center">
            <div className={`col-md-5 ${styles.CallExtension}`}>
              <span>
                <img width={20} src={Call} />{" "}
              </span>
              <span> <a className="text-decoration-none text-white ps-3" href="tel:+91-9699 800 600">+91-9699 800 600</a> </span>
              {/* <span className="ps-3">+91-9699 800 600</span> */}
            </div>
            <div className="col-md-7">
              <div className={`${styles.FooterwidgetSocial}`}>
                <a
                  className={`${styles.FooterwidgetSocialIcons}`}
                  href="https://twitter.com/FintooApp"
                >
                  <FaTwitter />
                </a>

                <a
                  className={`${styles.FooterwidgetSocialIcons}`}
                  href="https://www.facebook.com/fintooapp/"
                >
                  <FaFacebookF />
                </a>

                <a
                  className={`${styles.FooterwidgetSocialIcons}`}
                  href="https://www.linkedin.com/company/1769616/"
                >
                  <FaLinkedin />
                </a>

                <a
                  className={`${styles.FooterwidgetSocialIcons}`}
                  href="https://www.instagram.com/fintoo.app/"
                >
                  <FaInstagram />
                </a>

                <a
                  className={`${styles.FooterwidgetSocialIcons}`}
                  href="https://www.youtube.com/channel/UC00AMcwwfUKrV-XD5n6hWyQ/videos"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallHeader;
