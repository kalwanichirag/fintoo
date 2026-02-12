import styles from "./style.module.css";
const RightSection = (props) => {
  return (
    <>
      <div
        className={`${styles["header-section-image-container"]} ${styles.animated} ${styles.animatedFadeInUp} ${styles.fadeInUp} `}
      >
         <img style={{ width: "500px" }} src={process.env.REACT_APP_STATIC_URL + 'media/wp/Notices/notice.svg'} alt="" />
      </div>
    </>
  );
};
export default RightSection;
