import styles from "./style.module.css";
import { FaBeer, FaDownload } from "react-icons/fa";
const FPCardSection = () => {
  const onButtonClick = () => {
    // using Java Script method to get PDF file
    fetch("financial-planning-sample-report.pdf").then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "financial-planning-sample-report.pdf";
        alink.click();
      });
    });
  };
  return (
    <section className={`${styles.FPCard}`}>
      <div className={`${styles["FPCard-section-container"]}`}>
        <div className={`${styles.FpCardImg}`}>
        <img  src={process.env.REACT_APP_STATIC_URL + 'media/wp/FPPlan/stocks.svg'} alt="Financial Growth" />
          {/* <img src={Stcok} /> */}
        </div>
        <div className={`${styles.FPRightbox}`}>
          <p className={`${styles.FPtitle}`}>
          Chart Your Course to Financial Freedom with a Customized Plan Designed Just for You!
          </p>
          <div className="text-center mt-5 pb-4">
            {/* <a className={`${styles.FPbtn}`} onClick={onButtonClick}> */}
            <a href="https://stg.minty.co.in/restapi/downloadfilefromstaticurl/financial-planning-page-sample-report.pdf" target='_blank' rel="nofollow" className={`${styles.FPbtn}`}>
            Get Your Sample Report{" "}
              <span>
                <FaDownload />{" "}
              </span>{" "}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FPCardSection;
