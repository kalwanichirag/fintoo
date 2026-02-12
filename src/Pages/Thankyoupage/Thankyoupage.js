import React, { useEffect, useState } from "react";
import styles from "./ThankYou.module.css";

const ThankYouPage = () => {

   useEffect(() => {
          const script = document.createElement("script");
          script.src = "https://www.googletagmanager.com/gtag/js?id=G-T15R5ED28G";
          script.async = true;
          document.head.appendChild(script);
  
          const script2 = document.createElement("script");
          script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T15R5ED28G');
          `;
          document.head.appendChild(script2);
  
          return () => {
              document.head.removeChild(script);
              document.head.removeChild(script2);
          };
      }, []);

 

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          src={
            process.env.REACT_APP_STATIC_URL +
            "media/wp/Fintoologo_.svg"
          }
          alt="Fintoo logo"
          className={styles.logo}
        />

        <h1 className={styles.title}>Thank you</h1>

        <p className={styles.sub}>We have successfully received your details.</p>

        <p className={styles.desc}>
          Our Financial Planning Expert will get in touch with you shortly.
        </p>

       
      </div>
    </div>
  );
};

export default ThankYouPage;
