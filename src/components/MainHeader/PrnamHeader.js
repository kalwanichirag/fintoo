import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import styles from "./style.module.css";
import WhiteOverlay from "../HTML/WhiteOverlay";
import LogoImg from './images/logo.png'
const PrnamHeader = (props) => {
  const [show, setShow] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  
  
  return (
    <>
      {/* <div className={`NDA-Space ${styles.fakeSpace} fakeSpace_rn_k9 d-block`}></div> */}
      <div
        // style={{
        //   backgroundColor: "transparent",
        //   padding: "1rem",
        // }}
        // className={header}
        className={styles.header3}
       
      >
        <WhiteOverlay show={isLoading} />
        <div className=" ">
          <div className={`container-fluid ${styles["UAE-in-container"]}`}>
            <div className="row align-items-center">
              <div className="col-md-12 col-12">
                <a className="text-sm-center">
                  <img
                  className={`${styles.Flogo} user-select-none`}
                
                    alt="logo"
                    src={process.env.PUBLIC_URL + '/static/media/Fintoo_Pranam_logo.jpg'}
                    style={{width: '375px'}}
                    // src={process.env.REACT_APP_STATIC_URL + "media/FintooLogoUAE.png"}
                    // src="https://static.fintoo.in/wealthmanagement/wp-content/uploads/2022/09/fintoo-logo-01-e1663135457467-2048x604.png"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrnamHeader;
