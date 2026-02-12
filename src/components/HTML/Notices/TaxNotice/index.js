import styles from "./style.module.css";
const TPCardSection = () => {
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
          <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/Notices/headerBg122.svg'} alt="" />
        </div>
        <div className={`${styles.FPRightbox}`}>
          <p className={`${styles.FPtitle}`}>
            Getting a notice from the income tax department is extremely
            stressful, especially for those who are receiving it for the first
            time and those who do not have efficient and reliable Income Tax
            experts to help them resolve it.
          </p>
          <p className={`${styles.FPSubtext}`}>
            We at Fintoo offer you a comprehensive income tax notice handling
            service wherein we take care of the entire process that one needs to
            follow after receiving an income tax notice. Right from
            understanding to notice and identifying the reason to replying to
            the department, making the required revision and resolving the
            issue, we assure you our complete support at every step.
          </p>
        </div>
      </div>
    </section>
  );
};
export default TPCardSection;

// import styles from "./style.module.css";
// import commonStyles from "../../../Layout/Fullpage/style.module.css";
// import SectionHeader from "../../../SectionHeader";
// function TaxNotice() {
//   return (
//     <>
//       <section
//         className={`${styles["TaxNotice-section"]} ${commonStyles["padding-class"]} pb-5 pt-5`}
//       >
//         <SectionHeader
//           className="text-center"
//           headerText={"Tax Notices"}
//         />
//         <div className={`mt-md-3 ${styles.Content}`}>
//           <p>
//             Getting a notice from the income tax department is extremely
//             stressful, especially for those who are receiving it for the first
//             time and those who do not have efficient and reliable Income Tax
//             experts to help them resolve it.
//           </p>
//           <p>
//             We at Fintoo offer you a comprehensive income tax notice handling
//             service wherein we take care of the entire process that one needs to
//             follow after receiving an income tax notice. Right from
//             understanding to notice and identifying the reason to replying to
//             the department, making the required revision and resolving the
//             issue, we assure you our complete support at every step.
//           </p>
//         </div>
//       </section>
//     </>
//   );
// }

// export default TaxNotice;
