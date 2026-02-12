import React from "react";
import styles from "./fhcheader.module.css";

function Fhcheader(props) {
  const redirectionToLogin = props.redirectToLogin;

  return (
    <>
      <div className={`${styles.Fhcheader}`}>
        <div>
          <img
            src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
            alt="Fintoo logo"
          />
        </div>
        <div>
          <button
            className={`${styles.subscribebtn}`}
            type="button"
            onClick={() => redirectionToLogin()}
          >
          Subscribe Now
          </button>
        </div>
      </div>
    </>
  );
}

export default Fhcheader;
