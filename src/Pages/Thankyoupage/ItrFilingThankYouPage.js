import React, { useEffect } from "react";
import styles from "./ThankYou.module.css";

const ItrFilingThankYouPage = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-T15R5ED28G";
    script.async = true;
    document.head.appendChild(script);

    const configScript = document.createElement("script");
    configScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-T15R5ED28G');
    `;
    document.head.appendChild(configScript);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(configScript);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          src={`${process.env.REACT_APP_STATIC_URL}media/wp/Fintoologo_.svg`}
          alt="Fintoo logo"
          className={styles.logo}
        />

        <h1 className={styles.title}>Thank you</h1>

        <p className={styles.sub}>
          Your appointment is successfully booked.
        </p>

        <p className={styles.desc}>
          You will receive a confirmation email shortly. Please keep the
          relevant documents ready at the time of your scheduled meeting with
          the tax expert.
        </p>

        <p className={styles.desc}>
          If you have any queries or concerns, please feel free to write to us
          at <a href="mailto:online@fintoo.in">online@fintoo.in</a>.
        </p>
      </div>
    </div>
  );
};

export default ItrFilingThankYouPage;
